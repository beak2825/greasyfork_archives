// ==UserScript==
// @name         IdlePixel TCG Dex (Lux Fork)
// @namespace    luxferre.dev
// @version      1.5.2
// @description  Organizational script for the Criptoe Trading Card Game
// @author       GodofNades & Lux-Ferre
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/527481/code/IdlePixel%20Dialogue%20Handler.js?anticache=20250219b
// @downloadURL https://update.greasyfork.org/scripts/523402/IdlePixel%20TCG%20Dex%20%28Lux%20Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523402/IdlePixel%20TCG%20Dex%20%28Lux%20Fork%29.meta.js
// ==/UserScript==

(function () {
	"use strict";

	let playername = "";

	class tcgDex extends IdlePixelPlusPlugin {
		constructor() {
			super("tcgDex", {
				about: {
					name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description,
				},
				config: [
					{
						label:
							"------------------------------------------------<br/>Notification<br/>------------------------------------------------",
						type: "label"
					},
					{
						id: "tcgNotification",
						label:
							"Enable TCG Card Buying Available Notification<br/>(Default: Enabled)",
						type: "boolean",
						default: true
					},
					{
						id: "newCardTimer",
						label:
							"New Card Timer<br/>(How long do you want a card to show as new, in minutes.)",
						type: "int",
						default: 15
					},
					{
						id: "enableSend",
						label: "Enable auto send of duplicate cards to the player in the next option.",
						type: "boolean",
						default: false
					},
					{
						id: "sendTo",
						label: "Player to send duplicate cards to automatically.",
						type: "string",
						default: null
					}
				]
			})
			this.login_loaded = false
			this.dupe_sending = false
			this.pause_processing = false
			this.newest_card_ids = new Map()
			this.categoriesTCG = []
			this.row_bg_colours = {
				"ORE": "#734d26",
				"BAR": "#3d3d29",
				"SEED": "#1a3300",
				"WOOD": "#663300",
				"LEAF": "#669900",
				"GEM": "#990099",
				"FISH": "#3333cc",
				"MONSTER": "#000000",
				"GEAR": "#800000",
				"LEGENDARY": "#ffffff",
				"BREEDING": "#ffb31a",
				"LIMITED": "#ffffe6",
			}
			this.row_text_colours = {
				"ORE": "white",
				"BAR": "white",
				"SEED": "white",
				"WOOD": "white",
				"LEAF": "white",
				"GEM": "white",
				"FISH": "white",
				"MONSTER": "white",
				"GEAR": "white",
				"LEGENDARY": "black",
				"BREEDING": "black",
				"LIMITED": "black",
			}

			this.cards_received = []

			this.load_fa()
		}

		load_fa(){
			const fontAwesomeLink = document.createElement('link')
			fontAwesomeLink.rel = 'stylesheet'
			fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
			document.head.appendChild(fontAwesomeLink)
		}

		getCategoryData() {
			let uniqueDescriptionTitles = [];
			const descriptionTitlesSet = new Set();
			let i = 1;

			Object.values(CardData.data).forEach((card) => {
				const descriptionTitle = card["description_title"];
				const properTitles =
					descriptionTitle.charAt(0).toUpperCase() +
					descriptionTitle.slice(1).toLowerCase();

				if (!descriptionTitlesSet.has(descriptionTitle)) {
					descriptionTitlesSet.add(descriptionTitle);

					uniqueDescriptionTitles.push({
						id: `[${descriptionTitle}]`,
						desc: descriptionTitle,
						label: `${properTitles}`,
					});
					i++;
				}
			})

			//	Sort categories alphabetically with legendaries first
			uniqueDescriptionTitles.sort((a, b) => {
				if (a.desc === "LEGENDARY") return -1
				if (b.desc === "LEGENDARY") return 1
				return a.desc.localeCompare(b.desc)
			})

			return uniqueDescriptionTitles
		}

		ensureNewSettingExists() {
			const settings = JSON.parse(
				localStorage.getItem(`${playername}.tcgSettings`)
			);
			if (settings && typeof settings.new === "undefined") {
				settings.new = true;
				localStorage.setItem(
					`${playername}.tcgSettings`,
					JSON.stringify(settings)
				);
			}
		}

		initializeDatabase() {
			const dbName = `IdlePixel_TCG_DB.${playername}`;
			const version = 2;
			const request = indexedDB.open(dbName, version);

			request.onerror = (event) => {
				console.error("Database error: ", event.target.error);
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				const objectStoreName = `current_cards`;
				if (!db.objectStoreNames.contains(objectStoreName)) {
					db.createObjectStore(objectStoreName, {keyPath: "cardNum"})
				} else {
					db.deleteObjectStore(objectStoreName)
					db.createObjectStore(objectStoreName, {keyPath: "cardNum"})
				}
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
			};
		}

		card_counts(currentCards){
			if(this.categoriesTCG.length === 0){console.log("Cards counted without categories!");return;}
			const counts = {}

			this.categoriesTCG.forEach((category) => {
				counts[category.desc] = {
					uniHolo: 0,
					ttlHolo: 0,
					uniNormal: 0,
					ttlNormal: 0,
					possHolo: 0,
					possNormal: 0,
					possUniHolo: 0,
					possUniNormal: 0,
				};
			});

			const overall_counts = {
				overallUniHolo: 0,
				overallHolo: 0,
				overallTTL: 0,
				overallUniNormal: 0,
				overallNormal: 0,
			};

			Object.values(CardData.data).forEach((card) => {
				const category = this.categoriesTCG.find(
					(c) => c.id === `[${card.description_title}]`
				);
				if (category) {
					counts[category.desc].uniHolo++;
					counts[category.desc].uniNormal++;
					overall_counts.overallTTL++;
				}
			});

			const uniHoloSetOverall = new Set();
			const uniNormalSetOverall = new Set();

			currentCards.forEach((card) => {
				const new_id = `${card.id}${card.holo? "_h":""}`
				if (!this.newest_card_ids[new_id]) {
					this.newest_card_ids.set(new_id, card.cardNum);
				}

				const category = Object.entries(CardData.data).find(
					(c) => c[0] === card.id
				);
				if (category) {
					if (card.holo) {
						counts[category[1].description_title].possHolo++;
						counts[category[1].description_title].ttlHolo++;
						overall_counts.overallHolo++;
						if (!uniHoloSetOverall.has(card.id)) {
							uniHoloSetOverall.add(card.id);
							overall_counts.overallUniHolo++;
							counts[category[1].description_title].possUniHolo++;
						}
					} else {
						counts[category[1].description_title].possNormal++;
						counts[category[1].description_title].ttlNormal++;
						overall_counts.overallNormal++;
						if (!uniNormalSetOverall.has(card.id)) {
							uniNormalSetOverall.add(card.id);
							overall_counts.overallUniNormal++;
							counts[category[1].description_title].possUniNormal++;
						}
					}
				}
			});
			return {counts, overall_counts};
		}

		async identifyAndRemoveAbsentCards(db, objectStoreName, currentCards) {
			try {
				const dbCards = await this.fetchAllCardsFromDB(db, objectStoreName);

				const current_card_nums = currentCards.map(card => card.cardNum)

				dbCards.forEach((dbCard) => {
					const card_num = dbCard.cardNum
					if (!current_card_nums.includes(card_num)) {
						//console.log(`Card not found in current cards, removing: ${dbCardKey}`);
						this.removeCardFromDB(db, objectStoreName, card_num);
					}
				});
			} catch (error) {
				console.error('Error in identifyAndRemoveAbsentCards:', error);
			}
		}

		removeCardFromDB(db, objectStoreName, cardKey) {
			const transaction = db.transaction([objectStoreName], "readwrite");
			const objectStore = transaction.objectStore(objectStoreName);
			const request = objectStore.delete(cardKey);
			request.onerror = (event) => {
				console.error("Error removing card from DB:", event.target.error);
			};
			request.onsuccess = () => {
				//console.log(`Card removed from DB: ${cardKey}`);
			};
		}

		updateTcgSettings(categoryId, state) {
			const settings = JSON.parse(
				localStorage.getItem(`${playername}.tcgSettings`)
			);
			settings[categoryId] = state;
			localStorage.setItem(
				`${playername}.tcgSettings`,
				JSON.stringify(settings)
			);
		}

		getTcgSetting(categoryId) {
			const settings = JSON.parse(
				localStorage.getItem(`${playername}.tcgSettings`)
			);
			return settings[categoryId];
		}

		tcgBuyerNotifications() {
			let tcgTimerCheck = IdlePixelPlus.getVarOrDefault("tcg_timer", 0, "int");
			let tcgUnlocked = IdlePixelPlus.getVarOrDefault("tcg_active", 0, "int");
			const notifDiv = document.createElement("div");
			notifDiv.id = `notification-tcg-timer`;
			notifDiv.onclick = function () {
				switch_panels("panel-criptoe-tcg");
				Modals.open_buy_tcg();
			};
			notifDiv.className = "notification hover";
			notifDiv.style = "margin-right: 4px; margin-bottom: 4px; display: none";
			notifDiv.style.display = "inline-block";

			let elem = document.createElement("img");
			elem.setAttribute("src", window.get_image("images/ash_50.png"))
			const notifIcon = elem;
			notifIcon.className = "w20";

			const notifDivLabel = document.createElement("span");
			notifDivLabel.id = `notification-tcg-timer-label`;
			notifDivLabel.innerText = " Loading...";
			notifDivLabel.className = "color-white";

			notifDiv.append(notifIcon, notifDivLabel);
			document.querySelector("#notifications-area").prepend(notifDiv);
			if (tcgUnlocked == 0 || !this.getConfig("tcgNotification")) {
				document.querySelector("#notification-tcg-timer").style.display =
					"none";
			}
		}

		updateTCGNotification() {
			let tcgTimerCheck = IdlePixelPlus.getVarOrDefault("tcg_timer", 0, "int");
			let tcgUnlocked = IdlePixelPlus.getVarOrDefault("tcg_active", 0, "int");
			if (this.getConfig("tcgNotification") && tcgUnlocked != 0) {
				document.getElementById("notification-tcg-timer").style.display =
					"inline-block";
				if (tcgTimerCheck > 0) {
					let timerLabel = format_time(tcgTimerCheck);
					document.getElementById(
						"notification-tcg-timer-label"
					).innerText = ` ${timerLabel}`;
				} else {
					document.getElementById(
						"notification-tcg-timer-label"
					).innerText = ` Time to buy cards!`;
				}
			} else {
				document.getElementById("notification-tcg-timer").style.display =
					"none";
			}
		}

		async checkForAndHandleDuplicates() {
			const sendTo = IdlePixelPlus.plugins.tcgDex.getConfig("sendTo");
			const enableSend = IdlePixelPlus.plugins.tcgDex.getConfig("enableSend");
			const cards = await this.fetchAllCardsFromDB(this.db, 'current_cards');
			const cardOccurrences = new Map();

			if (!this.dupe_sending && sendTo !== playername) {
				this.dupe_sending = true;
				cards.forEach((card) => {
					const key = `${card.id}-${card.holo}`;
					if (cardOccurrences.has(key)) {
						cardOccurrences.get(key).push(card);
					} else {
						cardOccurrences.set(key, [card]);
					}
				});

				cardOccurrences.forEach((occurrences, key) => {
					if (occurrences.length > 1) {
						occurrences.sort((a, b) => b.cardNum - a.cardNum);

						for (let i = 0; i < (occurrences.length - 1); i++) {
							const duplicate = occurrences[i];

							if (enableSend && sendTo) {
								websocket.send(`GIVE_TCG_CARD=${sendTo}~${duplicate.cardNum}`);
							}
						}
					}
				});

				setTimeout(function () {
					CardData.fetchData();
					setTimeout(function () {
						this.dupe_sending = false;
					}.bind(this), 10000);
				}.bind(this), 20000);
			}
		}

		async fetchAllCardsFromDB(db, objectStoreName) {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([objectStoreName], "readonly");
				const objectStore = transaction.objectStore(objectStoreName);
				const request = objectStore.getAll();

				request.onerror = (event) => {
					console.error("Error fetching cards from DB:", event.target.error);
					reject(event.target.error);
				};

				request.onsuccess = () => {
					resolve(request.result);
				};
			});
		}

		add_open_multi_button(){
			const new_button = `<table data-bs-dismiss="modal" onclick="IdlePixelPlus.plugins.tcgDex.multi_open()" class="modal-table-button hover">
              <tbody><tr>
                <td>
                  <img alt="" src="${window.get_image("images/tcg_back_50.png")}" class="w50" title="tcg_back_50">
                </td>
                <td>
                  REVEAL MULTIPLE
                  <hr>
                  <span class="color-grey font-small">Reveal many cards for yourself.</span>
                </td>
              </tr>
            </tbody></table>`

			let inner = document.getElementById("modal-open-tcg-unknown").querySelector("center").innerHTML
			inner += new_button
			document.getElementById("modal-open-tcg-unknown").querySelector("center").innerHTML = inner

			const modal_string = `
				<div class="modal fade" id="tcg_open_multi_modal" tabindex="-1" data-bs-theme="dark">
					<div class="modal-dialog">
						<div class="modal-content justify-content-around d-flex flex-column" style="color: white; min-height:200px;">
							<div class="row"><div class="col d-flex justify-content-center">
								<img alt="" src="${window.get_image("images/tcg_back_50.png")}">
							</div></div>
							<div class="row"><div class="col d-flex justify-content-center">
								How many do you want to open?
							</div></div>
							<div class="row"><div class="col d-flex justify-content-center">
								<input type="number" id="tcg_multi_open_count">
							</div></div>
							<div class="row"><div class="col d-flex justify-content-center">
								<button id="tcg_multi_button" data-bs-dismiss="modal" class="bg-info-subtle"><span class="font-pixel hover">Open</span></button>
							</div></div>
						</div>
					</div>
				</div>`
			document.body.insertAdjacentHTML("beforeend", modal_string);

			document.getElementById("tcg_multi_button").addEventListener("click", (e) => {
				let input = document.getElementById("tcg_multi_open_count").value
				if (input === "") {
					return
				} else {
					input = parseInt(input)
				}
				if (input > parseInt(window.var_tcg_unknown)){
					input = parseInt(window.var_tcg_unknown)
				}

				IdlePixelPlus.plugins.tcgDex.pause_processing = true;
				setTimeout(function () {
					IdlePixelPlus.plugins.tcgDex.pause_processing = false;
					websocket.send("RFRESH_TCG_CLIENT")
				}, 2000)
				for (let i = 0; i < input; i++) {
					websocket.send("REVEAL_TCG_CARD")
				}
			})
		}

		multi_open(){
			document.getElementById("tcg_open_multi_modal").style.top = window.scrollY;
			$("#tcg_open_multi_modal").modal("show")
		}

		cardStyling() {
			const style = document.createElement("style");
			style.id = "styles-tcg-dex";
			style.textContent = `
                .tcg-card-inner {
                  text-align: center;
                  margin: 5px 18px;
                  border: 2px solid black;
                  background-color: #FEFEFE;
                  box-shadow: 1px 1px 5px;
                  padding: 25px 25px;
                }

                .tcg-card {
                  width: 200px;
                  height: 300px;
                  display: inline-block;
                  border-radius: 10pt;
                  box-shadow: 1px 1px 5px;
                  margin: 5px;
                  color: black;
                }

                .tcg-card-title {
                  font-weight: bold;
                  font-size: 12pt;
                  margin-left: 18px;
                  margin-top: 4px;
                }

                .tcg-card-inner-text {
                  margin: 0px 18px;
                  border: 1px solid black;
                  border-radius: 5pt;
                  background-color: #FEFEFE;
                  padding: 5px 5px;
                  font-size: 8pt;
                  margin-top: 10px;
                  margin-bottom: 4px;
                }

                .tcg-card-rarity {
                  font-weight: bold;
                  font-size: 12pt;
                  margin-right: 4px;
                  text-align: right;
                  font-style: italic;
                }

                .tcg-card-type {
                  font-weight: bold;
                  font-size: 12pt;
                  margin-left: 4px;
                  text-align: left;
                }

                .tcg-category-text {
                  font-weight: bold;
                  font-size: 12px;
                  color: black;
                }

                .tcgDex-card-container-open {
                    margin-bottom: 20px;
                }

                .tcgDex-card-container-closed {
                    margin-bottom: 5px;
                }
                
                .tcgdex_category_label_row {
                	display: inline-flex;
                	width: 100%;
                	height: 30px;
                	font-weight: bolder;
                	user-select: none;
                }
                
                .tcgdex_category_label_button {
                	flex: 0 0 5%;
                	align-content: center;
                	text-align: center;
                }
                
                .tcgdex_category_label_cat {
                	flex: 0 0 35%;
                	align-content: center;
                }
                
                .tcgdex_category_label_total {
                	flex: 0 0 10%;
                	align-content: center;
                	padding-left: 5px;
                }
                
                .tcgdex_category_label_counts {
                	flex: 0 0 33%;
                	align-content: center;
                }
                
                .tcgdex_category_label_counts_outer {
                	flex: 0 0 25%;
                	display: inline-flex;
                }
                
                .tcgdex_category_label_counts_label {
                	padding-left: 5px;
                	flex: 0 0 34%;
                	align-content: center;
                }
                
                .tcgdex_category_new_label {
                	flex: 0 0 55%;
                	align-content: center;
                }
                
                .tcgdex_category_new_total {
                	flex: 0 0 10%;
                	align-content: center;
                }
                
                .tcgdex_category_new_values_holo {
                	flex: 0 0 15%;
                	align-content: center;
                }
                
                .tcgdex_category_new_values {
                	flex: 0 0 15%;
                	align-content: center;
                }
            `;
			document.head.appendChild(style);
		}

		create_totals_bar_frag(overall_counts) {
			const template = document.getElementById("tcg_category_total_template")
			let clone = template.content.cloneNode(true)

			clone.querySelector(`.ttl-cards-label`).textContent = `Total: ${overall_counts.overallHolo + overall_counts.overallNormal} `;
			clone.querySelector(`.uni-holo-label`).textContent = `U: ${overall_counts.overallUniHolo}/${overall_counts.overallTTL}`;
			clone.querySelector(`.ttl-holo-label`).textContent = `T: ${overall_counts.overallHolo}`;
			clone.querySelector(`.uni-normal-label`).textContent = `U: ${overall_counts.overallUniNormal}/${overall_counts.overallTTL}`;
			clone.querySelector(`.ttl-normal-label`).textContent = `T: ${overall_counts.overallNormal}`;

			return clone;
		}

		create_new_bar_frag() {
			const template = document.getElementById("tcg_category_new_template")
			let clone = template.content.cloneNode(true)

			let loadVis = JSON.parse(localStorage.getItem(`${playername}.tcgSettings`))['new']

			let category_div = clone.getElementById("tcgDex-New_Card-Container")

			category_div.classList.add(loadVis ? "tcgDex-card-container-open" : "tcgDex-card-container-closed")

			clone.querySelector(".tcg_category_container_inner").setAttribute("style", IdlePixelPlus.plugins.tcgDex.getTcgSetting("new") ? "" : "display: none;")

			clone.querySelector(".tcg_new_timer_label").textContent = `New Cards (last ${this.new_card_timer} mins)`;

			clone.querySelector(".fas").classList.add(IdlePixelPlus.plugins.tcgDex.getTcgSetting("new") ? "fa-eye-slash" : "fa-eye")

			category_div.addEventListener("click", (event) => {
				if (event.target.closest(".tcg_category_container_inner")) {return;}
				const ele = event.currentTarget
				const category_inner = ele.querySelector(".tcg_category_container_inner")
				const isVisible = getComputedStyle(category_inner).display !== "none"

				if (isVisible) {
					category_inner.style.display = "none"
					ele.querySelector(".fas").classList.remove("fa-eye-slash")
					ele.querySelector(".fas").classList.add("fa-eye")
					ele.classList.add("tcgDex-card-container-closed")
					ele.classList.remove("tcgDex-card-container-open")
				} else {
					category_inner.style.display = ""
					ele.querySelector(".fas").classList.add("fa-eye-slash")
					ele.querySelector(".fas").classList.remove("fa-eye")
					ele.classList.remove("tcgDex-card-container-closed")
					ele.classList.add("tcgDex-card-container-open")
				}

				IdlePixelPlus.plugins.tcgDex.updateTcgSettings("new", !isVisible);
			});

			return clone;
		}

		draw_card_categories(card_container_frag, all_counts) {
			this.categoriesTCG.forEach((category) => {
				const template = document.getElementById("tcg_category_template");
				let row_frag = this.create_row_fragment(template, category);

				card_container_frag.appendChild(row_frag);
			});

			for (const [cat, counts] of Object.entries(all_counts)) {
				card_container_frag.querySelector(`#tcgDex-${cat}-Container .ttl-cards-label`).textContent = `Total: ${counts.possHolo + counts.possNormal}`;
				card_container_frag.querySelector(`#tcgDex-${cat}-Container .uni-holo-label`).textContent = `U: ${counts.possUniHolo}/${counts.uniHolo}`;
				card_container_frag.querySelector(`#tcgDex-${cat}-Container .ttl-holo-label`).textContent = `T: ${counts.ttlHolo}`;
				card_container_frag.querySelector(`#tcgDex-${cat}-Container .uni-normal-label`).textContent = `U: ${counts.possUniNormal}/${counts.uniNormal}`;
				card_container_frag.querySelector(`#tcgDex-${cat}-Container .ttl-normal-label`).textContent = `T: ${counts.ttlNormal}`;
			}
		}

		create_card_template(){
			const card_template_str = `
				<template id="tcg_card_template">
					<div id="" onclick="IdlePixelPlus.plugins.tcgDex.send_card(this.getAttribute('data-card-id'), this.getAttribute('id'))" style="" class='tcg-card hover'>
						<div class='row d-flex justify-content-around w-100'>
							<div class='col text-start' style="max-width:80%; margin-right:0; padding-right:1px; padding-left:0">
								<div class='tcg-card-title' style="white-space:nowrap; text-overflow:clip; overflow:hidden;"></div>
							</div>
							<div class='col-auto text-end' style="margin-top:4px; padding: 0; max-width:19%">
								<span class="dupe_count" style="font-weight: bolder;"></span>
							</div>
						</div>
						<div class='tcg-card-inner'>
							<img src="" class='w50'>
						</div>
						<div class='tcg-card-inner-text'>
							<span class='tcg-category-text'></span>
							<br>
							<br>
							<span class='tcg_card_zalgo'>𓀚𓁁𓂧𓃢𓃴𓄜𓈤𓈤𓊙𓐈𓀚𓁁𓂧𓃢𓃴<br>𓄜𓈤𓈤𓊙𓐈𓀚𓁁𓂧𓃢𓃴𓄜𓈤𓈤𓊙𓐈<br>𓀚𓁁𓂧𓃢𓃴𓄜𓈤𓈤𓊙𓐈𓀚𓁁𓂧𓃢𓃴<br>𓄜𓈤𓈤𓊙𓐈𓀚𓁁𓂧𓃢𓃴𓄜𓈤𓈤𓊙𓐈</span>
						</div>
						<div class="row" style="display: flex; flex-wrap:nowrap">
							<div class="col" style="flex: 0 0 50%; padding-right:0px;">
								<span class="tcg-card-type"></span>
							</div>
							<div class="col" style="flex: 0 0 50%; text-align: end; padding-left: 0px;flex-wrap:nowrap;">
								<span class="tcg-card-rarity"></span>
							</div>
						</div>
					</div>
				</template>
			`
			$("body").append($(card_template_str))
		}

		create_row_template(){
			const row_template_str = `
				<template id="tcg_category_template">
					<div class="tcgdex_card_container">
						<div class="tcgdex_category_label_row">
							<div class="col tcgdex_category_label_button">
								<i class="fas"></i>
							</div>
							<div class="col tcgdex_category_label_cat">
								<span class="labelSpan"></span>
							</div>
							<div class="col tcgdex_category_label_total">
								<span class="ttl-cards-label"></span>
							</div>
							<div class="col tcgdex_category_label_counts_outer">
								<div class="tcgdex_category_label_counts_label">Holo:</div>
								<div class="tcgdex_category_label_counts">
									<span class="ttl-holo-label"></span>
								</div>
								<div class="tcgdex_category_label_counts">
									<span class="uni-holo-label"></span>
								</div>
							</div>
							<div class="col tcgdex_category_label_counts_outer">
								<div class="tcgdex_category_label_counts_label">Normal:</div>
								<div class="tcgdex_category_label_counts">
									<span class="ttl-normal-label"></span>
								</div>
								<div class="tcgdex_category_label_counts">
									<span class="uni-normal-label"></span>
								</div>
							</div>
						</div>
						<br>
						<div class="tcg_category_container_inner" id="tcgDex-LIMITED-Container-Inner" style="display: none;"></div>
					</div>
				</template>
			`
			$("body").append($(row_template_str))
		}

		create_total_row_template(){
			const row_template_str = `
				<template id="tcg_category_total_template">
					<div class="tcgdex_category_label_row" style="background-color:cyan; color:black;">
						<div class="col tcgdex_category_label_button"></div>
						<div class="col tcgdex_category_label_cat">T = Total &amp; U = Unique</div>
						<div class="col tcgdex_category_label_total" style="border-left: 1px solid black;">
							<span class="ttl-cards-label"></span>
						</div>
						<div class="col tcgdex_category_label_counts_outer" style="border-left: 1px solid black;">
							<div class="tcgdex_category_label_counts_label">Holo:</div>
							<div class="tcgdex_category_label_counts">
								<span class="ttl-holo-label"></span>
							</div>
							<div class="tcgdex_category_label_counts">
								<span class="uni-holo-label"></span>
							</div>
						</div>
						<div class="col tcgdex_category_label_counts_outer" style="border-left: 1px solid black;">
							<div class="tcgdex_category_label_counts_label">Normal:</div>
							<div class="tcgdex_category_label_counts">
								<span class="ttl-normal-label"></span>
							</div>
							<div class="tcgdex_category_label_counts">
								<span class="uni-normal-label"></span>
							</div>
						</div>
					</div>
				</template>
			`
			$("body").append($(row_template_str))
		}

		create_new_row_template(){
			const row_template_str = `
				<template id="tcg_category_new_template">
					<div id="tcgDex-New_Card-Container">
						<div class="tcgdex_category_label_row" style="background-color:gray; color:black;">
							<div class="col tcgdex_category_label_button">
								<i class="fas"></i>
							</div>
							<div class="col tcgdex_category_new_label">
								<span class="tcg_new_timer_label"></span>
							</div>
							<div class="col tcgdex_category_new_total"></div>
							<div class="col tcgdex_category_new_values_holo"></div>
							<div class="col tcgdex_category_new_values"></div>
						</div>
						<br>
						<div class="tcg_category_container_inner"></div>
					</div>
				</template>
			`
			$("body").append($(row_template_str))
		}

		add_link_to_collection(){
			const url = `https://luxferre.dev/idlepixel/tcg?user=${window.var_username}`

			const button = `
				<div id="tcg_collection_button" class="itembox-rings hover" onclick="window.open('${url}', '_blank')">
					<div class="center mt-1"><img alt="" src="https://cdn.idle-pixel.com/images/book_template.png" title="Collection Viewer"></div>
					<div class="center mt-2"><span>CLXN VIEW</span></div>
				</div>
				`

			const boxes = document.getElementById("panel-criptoe-tcg").querySelectorAll(".itembox-rings")
			const stats = boxes[boxes.length-1].parentNode
			stats.insertAdjacentHTML("afterend", button)
		}

		add_link_to_received(){
			const button = `
				<div id="received_card_button" class="itembox-rings hover">
					<div class="center mt-1"><img alt="" height="50px" width="50px" src="https://cdn.idle-pixel.com/images/castle_chest.png" title="Received Cards"></div>
					<div class="center mt-2"><span>Received</span></div>
				</div>
				`

			document.getElementById("tcg_collection_button").insertAdjacentHTML("beforebegin", button)

			document.getElementById("received_card_button").addEventListener("click", function(){
				document.getElementById("received_card_button").classList.remove("animation-glow")
				let inner_html = ""
				IdlePixelPlus.plugins.tcgDex.cards_received.forEach(card=>{
					inner_html += `<li>${card}</li>`
				})
				document.getElementById("received_card_list").innerHTML = inner_html
				document.getElementById("tcg_received_list_modal").style.top = window.scrollY;
				$("#tcg_received_list_modal").modal("show")
			})
		}

		create_received_list_modal() {
			const modal_string = `
				<div class="modal fade" id="tcg_received_list_modal" tabindex="-1" data-bs-theme="dark">
					<div class="modal-dialog">
						<div class="modal-content" style="color: white;">
							<ul style="list-style-type: circle; margin-top: 5px;" id="received_card_list"></ul>
						</div>
					</div>
				</div>`
			document.body.insertAdjacentHTML("beforeend", modal_string);
		}

		initialisation(){
			if(!CardData.data){
				setTimeout(() => {
					IdlePixelPlus.plugins.tcgDex.initialisation()
				}, 1000)
				return
			}

			this.create_card_template()
			this.create_row_template()
			this.create_total_row_template()
			this.create_new_row_template()
			this.cardStyling()
			this.create_received_list_modal()
			this.add_link_to_collection()
			this.add_link_to_received()
			this.add_open_multi_button()

			this.categoriesTCG = this.getCategoryData();

			playername = IdlePixelPlus.getVarOrDefault("username", "", "string")
			if (!localStorage.getItem(`${playername}.tcgSettings`)) {
				let defaultSettings = this.categoriesTCG.reduce((settings, category) => {
					settings[category.desc] = true;
					return settings;
				}, {});
				defaultSettings.new = true;
				localStorage.setItem(
					`${playername}.tcgSettings`,
					JSON.stringify(defaultSettings)
				);
			} else {
				IdlePixelPlus.plugins.tcgDex.ensureNewSettingExists();
			}

			this.initializeDatabase()
			this.tcgBuyerNotifications()
			this.updateTCGNotification()

			const popup_handler = function(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable){
				let name, card
				if (message.includes("unrevealed")){
					name = message.split("from ")[1]
					card = "Unrevealed"
				} else {
					name = message.split("<")[0].slice(27)
					card = message.split("<")[3].split(">")[1]
				}

				let time = new Date()
				time = time.toLocaleString()

				IdlePixelPlus.plugins.tcgDex.cards_received.push(`${card}(${name}) [${time}]`)
				document.getElementById("received_card_button").classList.add("animation-glow")
				return [title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable]
			}

			dialoguer.register_handler("TRADE COMPLETED", popup_handler, false)

			this.card_order = new Map()
			let order = 1
			Object.keys(CardData.data).forEach((card_name) => {
				this.card_order.set(`${card_name}_h`, order++);
				this.card_order.set(`${card_name}`, order++);
			})
			this.login_loaded = true
		}

		onLogin() {
			this.new_card_timer = IdlePixelPlus.plugins.tcgDex.getConfig("newCardTimer")
			CToe.loadCards = function () {}
			if (!CardData.data) {
				CardData.fetchData();
			}

			this.initialisation()
		}

		onVariableSet(key, valueBefore, valueAfter) {
			if (this.login_loaded) {
				if (key.startsWith("tcg") && valueBefore != valueAfter) {
					IdlePixelPlus.plugins.tcgDex.updateTCGNotification();
				}
			}
		}

		onConfigChange() {
			if (this.login_loaded) {
				IdlePixelPlus.plugins.tcgDex.updateTCGNotification();
				this.new_card_timer = IdlePixelPlus.plugins.tcgDex.getConfig("newCardTimer")
			}
		}

		send_card(card_id, card_name){
			Modals.open_tcg_give_card(null, card_id)
			card_name = card_name.replace("_Normal", "").replace("_Holo", "_h")
			IdlePixelPlus.plugins.tcgDex.newest_card_ids.delete(card_name)
		}

		create_card_fragment(template, card){
			const id = card.cardNum
			const holo = card.holo
			const card_data = CardData.data[card.id]

			const rarity_map = {
				common: "Common",
				uncommon: "Uncommon",
				rare: "Rare",
				very_rare: "Very Rare",
				legendary: "Legendary"
			}

			let clone = template.content.cloneNode(true)

			let tcg_outer = clone.querySelector(".tcg-card")
			tcg_outer.setAttribute("data-card-id", id)
			tcg_outer.setAttribute("data-card-cat", card_data.description_title)

			const styles = `${card_data.border_css}${card_data.background_css}`
			tcg_outer.setAttribute("style", styles)

			const label = card_data.label.replaceAll('MOONSTONE', 'M. STONE').replaceAll('PROMETHIUM', 'PROM.').replaceAll('WOODEN ARROWS', 'WOOD ARROWS').replaceAll('STINGER ', 'STING ')

			clone.querySelector(".tcg-card-title").innerText = label
			clone.querySelector(".tcg-card-rarity").innerText = `(${rarity_map[card_data.rarity]})`
			clone.querySelector("img").setAttribute("src", `https://cdn.idle-pixel.com/images/${card_data.image}`)
			clone.querySelector(".tcg-category-text").innerText = `[${card_data.description_title}]`

			if (card.count){
				clone.querySelector(".dupe_count").innerText = `x${card.count}`
			}


			if(holo){
				tcg_outer.id = `${card.id}_Holo`
				clone.querySelector(".tcg-card-type").innerText = " Holo"
				clone.querySelector(".tcg-card-inner").classList.add("holo")
				clone.querySelector(".tcg_card_zalgo").classList.add("shine")
			} else {
				tcg_outer.id = `${card.id}_Normal`
				clone.querySelector(".tcg-card-type").innerText = " Normal"
				clone.querySelector(".tcg_card_zalgo").classList.add("color-red")
			}

			return clone;
		}

		create_row_fragment(template, category){
			let loadVis = IdlePixelPlus.plugins.tcgDex.getTcgSetting(category.desc);
			let rowBGColor = this.row_bg_colours[category.desc];
			let rowTextColor = this.row_text_colours[category.desc];

			let clone = template.content.cloneNode(true)

			let category_div = clone.querySelector(".tcgdex_card_container")
			category_div.id = `tcgDex-${category.desc}-Container`
			category_div.classList.add(loadVis ? "tcgDex-card-container-open" : "tcgDex-card-container-closed")

			let category_inner = clone.querySelector(".tcg_category_container_inner")
			category_inner.id = `tcgDex-${category.desc}-Container-Inner`;
			category_inner.setAttribute("style", IdlePixelPlus.plugins.tcgDex.getTcgSetting(category.desc) ? "" : "display: none;")

			clone.querySelector(".tcgdex_category_label_row").setAttribute("style", `background-color: ${rowBGColor}; color: ${rowTextColor};`)

			clone.querySelector(".fas").classList.add(IdlePixelPlus.plugins.tcgDex.getTcgSetting(category.desc) ? "fa-eye-slash" : "fa-eye")

			clone.querySelector(".tcgdex_category_label_counts_outer").setAttribute("style", `border-left: 1px solid ${rowTextColor};`)
			clone.querySelector(".tcgdex_category_label_total").setAttribute("style", `border-left: 1px solid ${rowTextColor};`)

			clone.querySelector(".labelSpan").innerHTML = category.label

			category_div.addEventListener("click", (event) => {
				if (event.target.closest(".tcg_category_container_inner")) {return;}
				const ele = event.currentTarget
				const category_inner = ele.querySelector(".tcg_category_container_inner")
				const isVisible = getComputedStyle(category_inner).display !== "none"

				if (isVisible) {
					category_inner.style.display = "none"
					ele.querySelector(".fas").classList.remove("fa-eye-slash")
					ele.querySelector(".fas").classList.add("fa-eye")
					ele.classList.add("tcgDex-card-container-closed")
					ele.classList.remove("tcgDex-card-container-open")
				} else {
					category_inner.style.display = ""
					ele.querySelector(".fas").classList.add("fa-eye-slash")
					ele.querySelector(".fas").classList.remove("fa-eye")
					ele.classList.remove("tcgDex-card-container-closed")
					ele.classList.add("tcgDex-card-container-open")
				}

				IdlePixelPlus.plugins.tcgDex.updateTcgSettings(
					category.desc,
					!isVisible
				);
			});

			return clone;
		}

		draw_cards(currentCards, card_type_count){
			document.getElementById("tcg-area-context").innerHTML = ""

			const template = document.getElementById("tcg_card_template")
			let card_container_frag = document.createDocumentFragment()

			const {counts, overall_counts} = this.card_counts(currentCards)

			card_container_frag.appendChild(this.create_totals_bar_frag(overall_counts))
			card_container_frag.appendChild(this.create_new_bar_frag())
			IdlePixelPlus.plugins['tcgDex'].draw_card_categories(card_container_frag, counts);

			document.getElementById("tcg-area-context").appendChild(card_container_frag)

			const card_sorter = {}
			this.categoriesTCG.forEach((category) => {
				card_sorter[category.desc] = []
			})

			for (const [card, count] of Object.entries(card_type_count)) {
				const split_idx = card.lastIndexOf("_")
				const card_id = card.slice(0, split_idx)
				const holo = card.slice(split_idx + 1) === "Holo"

				const order_key = holo? `${card_id}_h`: card_id

				const card_data = {
					id: card_id,
					holo: holo,
					cardNum: this.newest_card_ids.get(order_key),
					count: count,
				}

				const card_fragment = this.create_card_fragment(template, card_data)
				const card_category = card_fragment.querySelector(".tcg-card").getAttribute("data-card-cat")

				const card_position = this.card_order.get(order_key)
				card_sorter[card_category][card_position] = card_fragment
			}

			for (const [cat, cards] of Object.entries(card_sorter)) {
				let cat_frag = document.createDocumentFragment()
				cards.forEach(card_frag => {
					cat_frag.appendChild(card_frag)
				})
				document.getElementById(`tcgDex-${cat}-Container-Inner`).appendChild(cat_frag)
			}
		}

		handle_new_cards(newCards){
			newCards.sort((a, b) => b.received_datetime - a.received_datetime);
			const new_card_container = document.getElementById("tcgDex-New_Card-Container").querySelector(".tcg_category_container_inner")
			new_card_container.innerHTML = "";
			const template = document.getElementById("tcg_card_template")
			let card_container_frag = document.createDocumentFragment()

			for (const card of Object.values(newCards)) {
				card.count = false
				const card_fragment = this.create_card_fragment(template, card);

				card_container_frag.appendChild(card_fragment)
			}

			new_card_container.appendChild(card_container_frag)
			card_container_frag.innerHTML = ""
		}

		find_new_cards(currentCards){
			const new_cards = []
			const objectStoreName = `current_cards`;
			const transaction = this.db.transaction([objectStoreName], "readwrite");
			const objectStore = transaction.objectStore(objectStoreName);

			currentCards.forEach((card) => {
				const key = card.cardNum
				const getRequest = objectStore.get(key);
				getRequest.onsuccess = (event) => {
					let result = event.target.result;
					if (result) {
						let now = new Date();
						let timeBefore = new Date(now.getTime() - this.new_card_timer * 60 * 1000);

						let receivedDateTime = result.received_datetime;
						if (receivedDateTime > timeBefore) {
							new_cards.push({
								cardNum: result.cardNum,
								id: result.id,
								holo: result.holo,
								received_datetime: receivedDateTime,
							});
						}
					} else {
						const cardData = {
							cardNum: card.cardNum,
							id: card.id,
							holo: card.holo,
							received_datetime: new Date(),
						};
						const addRequest = objectStore.add(cardData);
						addRequest.onerror = (event) => {
							console.error("Error adding new card:", event.target.error);
						};
						addRequest.onsuccess = (event) => {
							// console.log("Successfully adding new card:", event.target.result);
						};
						new_cards.push({
							cardNum: card.cardNum,
							id: card.id,
							holo: card.holo,
							received_datetime: new Date(),
						});
					}
				};
				getRequest.onerror = (event) => {
					console.error("Error fetching card record:", event.target.error);
				};
			});
			return new_cards;
		}

		parse_card_stream(parts){
			const current_cards = []
			const card_type_count = {};

			for (let i = 0; i < parts.length; i += 3) {
				const cardNum = parts[i];
				const cardKey = parts[i + 1];
				const isHolo = parts[i + 2] === "true";
				const idHolo = isHolo ? "Holo" : "Normal";
				const countKey = `${cardKey}_${idHolo}`;

				current_cards.push({
					id: cardKey,
					cardNum: parseInt(cardNum),
					holo: isHolo,
				})

				// Increment or initialise count for card type
				card_type_count[countKey] = (card_type_count[countKey] ?? 0) + 1
			}

			return {current_cards, card_type_count};
		}

		onMessageReceived(data) {
			if (data.startsWith("REFRESH_TCG")) {
				if(this.pause_processing){return;}
				const parts = data.replace("REFRESH_TCG=", "").split("~")

				const {current_cards, card_type_count} = this.parse_card_stream(parts)

				const new_cards = this.find_new_cards(current_cards);

				void this.identifyAndRemoveAbsentCards(this.db, `current_cards`, current_cards)

				this.draw_cards(current_cards, card_type_count);

				setTimeout(() => this.handle_new_cards(new_cards), 2000)

				void this.checkForAndHandleDuplicates()
			}
		}
	}

	const plugin = new tcgDex();
	IdlePixelPlus.registerPlugin(plugin);
})();
