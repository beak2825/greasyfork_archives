// ==UserScript==
// @name           Novel Sites Enhance
// @name:ja        小説サイト機能強化
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2025-05-20
// @description    Kakuyomu / Narou / Alphapolis auto bookmark & cheering, hightlight author & unreads, enhance history, download as txt
// @description:ja アルファポリス・カクヨム・なろう 自動しおり、自動応援、ハイライト著者と未読小説、強化閲覧履歴、TXTダウンロード。
// @author         LE37
// @license        MIT
// @include        /^https:\/\/kakuyomu\.jp\/my\/antenna\/reading_histories/
// @include        /^https:\/\/kakuyomu\.jp\/my\/antenna\/works/
// @include        /^https:\/\/kakuyomu\.jp\/works\/[0-9]+$/
// @include        /^https:\/\/kakuyomu\.jp\/works\/[0-9]+\/episodes\/[^\/]+$/
// @include        /^https:\/\/syosetu\.com\/favnovelmain\/list\//
// @include        /^https:\/\/ncode\.syosetu\.com\/[A-z0-9]+\/?$/
// @include        /^https:\/\/ncode\.syosetu\.com\/[A-z0-9]+\/[0-9]+\/?$/
// @include        /^https:\/\/yomou\.syosetu\.com\/rireki\/list\/$/
// @include        /^https:\/\/www\.alphapolis\.co\.jp\/mypage\/notification\/index\/110000/
// @include        /^https:\/\/www\.alphapolis\.co\.jp\/novel\/[0-9]+/[0-9]+/episode/[0-9]+$/
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/490265/Novel%20Sites%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/490265/Novel%20Sites%20Enhance.meta.js
// ==/UserScript==

(()=>{
	'use strict';

	let gMk, tlo, fAuthor, sFa, sFb, sFh, sFo;
	sFa = false;
	sFb = false;
	sFh = false;
	sFo = false;
	switch (location.host) {
		case "kakuyomu.jp":
			gMk = "HUN_K";
			break;
		case "ncode.syosetu.com":
		case "syosetu.com":
		case "yomou.syosetu.com":
			gMk = "HUN_N";
			break;
		case "www.alphapolis.co.jp":
			gMk = "HUN_A";
			break;
	}
	// GM menu
	GM_registerMenuCommand("Option", OPT);
	// Read List
	URD();
	function URD() {
		const trc = GM_getValue(gMk);
		tlo = trc ? trc : { ATC:false, AUH:false, SDB:false, DTF:false, FAC:"indigo", FCC:"orange", FUC:"red", FAU:3, FBL:[2,4,2], FDT:[10000,5000,0], FAL:[], RRK:{} };
	}
	// Save List
	function USV() {
		if (gMk && JSON.stringify(tlo) !== JSON.stringify(GM_getValue(gMk))) {
			GM_setValue(gMk, tlo);
		}
	}
	const uRi = location.href;
	const rMb = navigator.userAgent.includes("Mobile");
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	// Favorite page css
	let fss = (`:root {background-color: #fefefe; filter: invert(1) hue-rotate(180deg);}
				* {background-color: inherit;}`);
	switch (true) {
		case uRi.includes("/my/"):
		case uRi.includes("/favnovelmain/"):
		case uRi.includes("/mypage/"):
			GM_registerMenuCommand("Select", ADA);
			if (tlo.DTF) {
				GM_addStyle(fss);
			}
			FAV();
			break;
		case /^https:\/\/ncode\.syosetu\.com\/[A-z0-9]+\/?$/.test(uRi): {
			if(document.getElementById("novel_honbun")) {
				EPI();
			} else {
				// Add resume button(base on casutom history)
				if (tlo.AUH) {
					const cKey = location.pathname.split("/")[1];
					if(Object.hasOwn(tlo.RRK, cKey)) {
						CRB(cKey, "p.novel_title", "https://ncode.syosetu.com/", "/");
					}
				}
			}
			break;
		}
		case uRi.includes("/rireki"):
			//console.log("DoNothing");
			break;
		case /^https:\/\/kakuyomu\.jp\/works\/[0-9]+$/.test(uRi): {
			// Add resume button(base on custom history)
			if (tlo.AUH) {
				URD();
				sleep(2000).then(() => {
					const cKey = location.pathname.split("/")[2];
					if (Object.hasOwn(tlo.RRK, cKey) && tlo.RRK[cKey].epi.length <= 4) {
						const data = JSON.parse(document.getElementById("__NEXT_DATA__").innerHTML);
						const re = new RegExp("Episode:");
						const keys = data.props.pageProps.__APOLLO_STATE__;
						let i = 1;
						for (let key in keys) {
							if (re.test(key)) {
								if (i === parseInt(tlo.RRK[cKey].epi)) {
									tlo.RRK[cKey].epi = keys[key].id;
									USV();
									break;
								}
								i++;
							}
						}
					}
					CRB(cKey, "a[title]", "https://kakuyomu.jp/works/", "/episodes/");
				});
			}
			break;
		}
		default:
			EPI();
	}

	// Episode page
	function EPI() {
		if (tlo.AUH) {
			URD();
		}
		// eCheer button;
		let eCb;
		let rMf = false;
		switch (gMk) {
			case "HUN_K": {
				eCb = document.getElementById("episodeFooter-action-cheerButton");
				if ( document.getElementById("episodeFooter-action-cheerButton-cheer").classList.contains("isShown")
					&& tlo.FAL.some(name => document.title.includes('（' + name + '） -')) ) {
					rMf = true;
				}
				if (tlo.AUH) {
					ANH(location.pathname.split("/")[2], location.pathname.split("/")[4], document.querySelector("h1.js-vertical-composition-item>a").title, null);
				}
				break;
			}
			case "HUN_N": {
				eCb = document.querySelector("div.js-reactionepisode_change");
				if ( !document.querySelector("div.is-posted")
					&& tlo.FAL.some(name => document.querySelector('div.c-announce a:nth-child(2)').textContent.includes(name)) ) {
					rMf = true;
				}
				// Auto siori/bookmark
				/*if (document.querySelector("li.bookmark_now")) {
					sleep(Math.floor((Math.random() * (5000 - 2000 + 1)) + 2000)).then(() => {
						document.querySelector("li.bookmark_now>a").click();
					});
				}*/
				if (tlo.AUH) {
					ANH(location.pathname.split("/")[1], location.pathname.split("/")[2], document.title.split(" - ")[0], null);
				}
				break;
			}
			case "HUN_A":
				eCb = document.getElementById("contentMangaLikeBtnCircle");
				if ( !eCb.classList.contains("max")
					&& tlo.FAL.some(name => uRi.includes(name)) ) {
					rMf = true;
				}
				break;
		}
		// Save updated custom reading history
		if (tlo.AUH) {
			USV();
		}
		const ioc = new IntersectionObserver((entries) => {
			if (entries[0].intersectionRatio <= 0) return;
			ioc.disconnect();
			if (rMf) {
				eCb.style.backgroundColor = tlo.FCC;
				if (tlo.ATC) {
					if (gMk === "HUN_A") {
						// Randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
						let x = 0;
						setInterval(function() {
							if (x < parseInt(eCb.getAttribute("data-content-like-limit"))) {
								//console.log(x);
								eCb.click();
							} else {
								return;
							}
							x++;
						}, Math.floor(Math.random() * (1000 - 500 + 1)) + 500);
					} else {
						eCb.click();
					}
					//console.log("===いいね===");
					sleep(1500).then(() => {
						if (gMk === "HUN_K" && !document.getElementById("episodeFooter-action-cheerButton-cheer").classList.contains("isShown")
						|| gMk === "HUN_N" && !document.querySelector("div.is-empty")
						|| gMk === "HUN_A" && document.getElementById("contentMangaLikeBtnCircle").classList.contains("max") ) {
							eCb.style.backgroundColor = "";
						}
					});
				}
			}
		});
		if (gMk !== "HUN_N" || !document.querySelector("span.p-novelgood-form__status")) {
			ioc.observe(eCb);
		}
	}

	// Favorite page
	function FAV() {
		let fNode, fUnreadCount;
		switch (gMk) {
			case "HUN_K":
				fAuthor = "p.widget-antennaList-author";
				fNode = "li.widget-antennaList-item";
				fUnreadCount = "li.widget-antennaList-unreadEpisodeCount";
				break;
			case "HUN_N":
				fAuthor = "a.p-up-bookmark-item__data-item";
				fNode = "li.p-up-bookmark-item";
				fUnreadCount = "span.p-up-bookmark-item__unread-num";
				break;
			case "HUN_A":
				fAuthor = "h2.title>a";
				fNode = "div.content-main";
				fUnreadCount = "a.disp-order";
				break;
		}
		const tNode = document.querySelectorAll(fNode);
		for(let i = 0; i < tNode.length; i++) {
			const fAuthorTag = tNode[i].querySelector(fAuthor);
			const fAuthorName = (gMk === "HUN_A")
									? fAuthorTag.href.match(/\d+$/)[0]
									: fAuthorTag.textContent;
			fAuthorTag.style.color = CHK(fAuthorTag, fAuthorName)
										? tlo.FAC
										: "";
			const tUnreadCount = tNode[i].querySelector(fUnreadCount);
			const fCurrent = (gMk === "HUN_A") && tUnreadCount
								? parseInt(tUnreadCount.textContent.match(/[0-9]+/)[0])
								: 0;
			let tUnreadNum;
			if (tUnreadCount) {
				tUnreadNum = (gMk === "HUN_K") ? parseInt(tUnreadCount.textContent.match(/[0-9]+/)[0])
								: (gMk === "HUN_N") ? parseInt(tUnreadCount.textContent)
								: parseInt(tNode[i].querySelector("a.total").textContent.match(/[0-9]+/)[0]) - fCurrent;
			} else {
				tUnreadNum = 0;
			}
			const fUnreadColor = CHK(fAuthorTag, fAuthorName) ? tlo.FAC
									: tUnreadCount && tUnreadNum > tlo.FAU ? tlo.FUC
									: "";
			if (tUnreadCount) {
				if (gMk === "HUN_K") {
					tNode[i].querySelector("a.widget-antennaList-continueReading").style.color = fUnreadColor;
				} else if (gMk === "HUN_N") {
					tNode[i].querySelector("span.p-up-bookmark-item__unread").style.color = fUnreadColor;
				} else {
					tUnreadCount.style.color = fUnreadColor;
				}
			} else {
				if (gMk === "HUN_A") {
					fAuthorTag.style.color = tlo.FUC;
				}
			}
		}
	}
	// Check author name
	function CHK(elem, s) {
		const result = tlo.FAL.some((v) => s === v);
		if (sFa) {
			elem.style.border = result ? "thin solid fuchsia" : "thin solid dodgerblue";
		} else {
			elem.style.border = "none";
		}
		return result;
	}

	// Add fav author
	function ADA() {
		if (!sFa) {
			URD();
			sFa = true;
			document.addEventListener("click", AAH);
		} else {
			sFa = false;
			document.removeEventListener("click", AAH);
			USV();
		}
		document.getElementById("nse_asb").textContent = sFa ? "💖" : "💟";
		FAV();
	}
	// Add author handler
	function AAH(e) {
		e.preventDefault();
		if (e.target.closest(fAuthor)) {
			if (gMk === "HUN_A") {
				UTL(e.target.href.match(/\d+$/)[0]);
			} else {
				UTL(e.target.textContent);
			}
			FAV();
		}
	}
	// Update temp list
	function UTL(s) {
		const i = tlo.FAL.findIndex((v) => v === s);
		if (i !== -1) {
			tlo.FAL.splice(i,1);
		} else {
			tlo.FAL.push(s);
		}
		//console.log(tlo.FAL);
		return tlo.FAL;
	}

	// Create float buttons
	CFB();
	function CFB() {
		if (!document.getElementById("nse_fcm")) {
			const cDiv = document.body.appendChild(document.createElement("div"));
			cDiv.id = "nse_fcm";
		}
		const posx = tlo.FBL[0], posy = tlo.FBL[1], diff = tlo.FBL[2];
		BCR("nse_fcb", "💠", posx, posy, "yellow", "");
		BCR("nse_opt", "Ⓜ", posx + diff, posy, "blue", "none");
		if (tlo.AUH) {
			BCR("nse_rhb", "🕓", posx, posy + diff, "#4baae0", "none");
		}
		switch (true) {
			case uRi.includes("/antenna/works"):
			case uRi.includes("/favnovelmain/"):
				BCR("nse_asb", "💟", posx + diff, posy + diff, "red", "none");
				break;
			case /^https:\/\/ncode\.syosetu\.com\/[A-z0-9]+/.test(uRi):
			case /^https:\/\/kakuyomu\.jp\/works\/[0-9]+/.test(uRi):
				if (tlo.SDB) {
					BCR("nse_dlb", "📥", posx + diff, posy + diff, "red", "none");
				}
			break;
		}
		document.getElementById("nse_fcb").addEventListener("click", SCB);
	}
	// Button creater
	function BCR(id, text, posx, posy, color, show) {
		const cBtn = document.getElementById("nse_fcm").appendChild(document.createElement("button"));
		cBtn.id = id;
		if (id === "nse_fcb") {
			//console.log("💠");
		} else {
			cBtn.classList.add("nse_cfb");
		}
		cBtn.textContent = text;
		cBtn.style = "position: fixed; width: 44px; height: 44px; z-index: 9999; font-size: 200%; opacity: 50%; cursor:pointer; border: none; padding: unset; right: " + posx + "em; bottom: " + posy + "em; color: " + color + "; display: " + show + ";";
		cBtn.type = "button";
	}
	// Menu creater
	function MCR(id) {
		const cMenu = document.body.appendChild(document.createElement("div"));
		cMenu.id = id;
		const cPos = !rMb ? " width: 50%; left: 25%; height: 80%;" : " width: 98%; left: 1%; height: 52%;";
		cMenu.style = "position: fixed;" + cPos + " overflow-y: scroll; overflow-wrap: break-word; top:10%; z-index: 9999; background-color: #f1f3f5; display: none;";
	}
	// Show child button
	function SCB() {
		if (!sFb) {
			sFb = true;
			document.getElementById("nse_fcm").addEventListener("click", FBH);
		} else {
			sFb = false;
			document.getElementById("nse_fcm").removeEventListener("click", FBH);
		}
		const no = document.getElementsByClassName("nse_cfb");
		for (let i = 0; i < no.length; i++) {
			no[i].style.display = sFb ? "" : "none";
		}
	}
	// Buttons handler
	function FBH(e) {
		switch (e.target.id) {
			// Options button
			case "nse_opt":
				OPT();
				break;
			// Author select button
			case "nse_asb":
				ADA();
				break;
			// Reading history button
			case "nse_rhb": {
				if (!document.getElementById("nse_rhp")) {
					MCR("nse_rhp");
				}
				const crhp = document.getElementById("nse_rhp");
				if (!sFh) {
					URD();
					sFh = true;
					crhp.style.display = "";
					if (gMk === "HUN_K") {
						CRH("nse_rhp", "https://kakuyomu.jp/works/", "/episodes/");
					} else if (gMk === "HUN_N") {
						CRH("nse_rhp", "https://ncode.syosetu.com/", "/");
					}
					crhp.addEventListener("click", RHB);
				} else {
					sFh = false;
					crhp.style.display = "none";
					// Clear history
					crhp.innerHTML = "";
					crhp.removeEventListener("click", RHB);
					USV();
				}
				break;
			}
			// Download button
			case "nse_dlb":
				if ( /^https:\/\/ncode\.syosetu\.com\/[A-z0-9]+\/?$/.test(uRi)
				|| /^https:\/\/kakuyomu\.jp\/works\/[0-9]+$/.test(uRi) ) {
					// Add download all episodes button
					if (gMk === "HUN_N") {
						NGL(document.title, document.querySelector("ul.undernavi li:nth-child(2) a").href, 'select[name="no"]');
					} else {
						KGL(document.title.split("（")[0], uRi, "__NEXT_DATA__");
					}
				} else {
					// Add download current episodes button
					DCE();
				}
				break;
			default:
				//console.log("DoNothing");
		}
	}
	// Reading history button
	function RHB(e) {
		if (e.target.id === "nse_shb") {
			// Save history button
			let htit, upa, upb;
			if (gMk === "HUN_K") {
				htit = "カクヨム閲覧履歴";
				upa = "https://kakuyomu.jp/works/";
				upb = "/episodes/";
			} else if (gMk === "HUN_N") {
				htit = "なろう閲覧履歴";
				upa = "https://ncode.syosetu.com/";
				upb = "/";
			}
			let htxt = "";
			Object.keys(tlo.RRK).reverse().forEach(k => {
				const vbmk = tlo.RRK[k].bmk === "1" ? " 💖 "
							: tlo.RRK[k].bmk === "2" ? " 🖤 "
							: " ❓ ";
				let kpt = "";
				let vlink = upa + k + upb + tlo.RRK[k].epi;
				if (gMk === "HUN_K") {
					if (tlo.RRK[k].epi.length <= 4) {
						kpt = "[" + tlo.RRK[k].epi + "]";
						vlink = upa + k + "/resume_reading";
					}
				}
				htxt += tlo.RRK[k].tim + vbmk + tlo.RRK[k].tit.replace(/\n/g,'') + kpt + ": " + vlink + "\n";
			});
			SAT(htit, htxt);
			alert("File downloads completed");
		} else if (e.target.id === "nse_ihb") {
			// Import history button
			if (gMk === "HUN_K") {
				CIB("widget-antennaList-item", "h4.widget-antennaList-title", "a.widget-antennaList-continueReading");
			} else if (gMk === "HUN_N") {
				if (location.host.startsWith("y")) {
					CIB("p-rireki-item", "a.c-card__title", "div.p-rireki-item__button-link>a.c-button");
				} else {
					CIB("p-up-bookmark-item", "div.p-up-bookmark-item__title>a", "a.c-button--sm");
				}
			}
		} else if (e.target.className === "nse_drh") {
			// Delete history button
			const key = e.target.getAttribute("data");
			delete tlo.RRK[key];
			CRH();
		} else if (e.target.className === "nse_brh") {
			// Bookmark history button
			const key = e.target.getAttribute("data");
			tlo.RRK[key].bmk = tlo.RRK[key].bmk === "1" ? "2" : "1";
			CRH();
		}
	}
	// Options
	function OPT() {
		if (!document.getElementById("nse_omu")) {
			MCR("nse_omu");
		}
		const comu = document.getElementById("nse_omu");
		if (!sFo) {
			URD();
			sFo = true;
			UOM();
			comu.style.display = "";
			comu.addEventListener("click", OMB);
		} else {
			sFo = false;
			comu.style.display = "none";
			comu.innerHTML = "";
			comu.removeEventListener("click", OMB);
			if (JSON.stringify(tlo) !== JSON.stringify(GM_getValue(gMk))) {
				GM_setValue(gMk, tlo);
				const t = prompt("New options will be applied after reload current page, reload now?", "Yes");
				if (t === "Yes") {
					location.reload();
				}
			}
		}
	}
	// Update Options Menu
	function UOM() {
		const comu = document.getElementById("nse_omu");
		const ost = "margin-left: 1em; cursor: pointer;";
		comu.innerHTML = `<h2>Options:</h2>
			<p id="nse_inp" style="${ost} background-color: cyan;" contenteditable>Paste options here</p>
			<p id="nse_iop" style="${ost}">📤 Import options from above</p>
			<p id="nse_sop" style="${ost}">💾 Save options to local txt</p>`;
		const mItems = [ "AutoCheering [true:On false:Off]", "LocalHistory [true:On false:Off]", "DownloadButton [true:On false:Off]", "DarkFavoritepage [true:On false:Off]","AuthorColour", "CheeringButtonColour", "UnreadColour", "UnreadCounts [default:3]", "ButtonPositon [default(right,bottom,dist):2,4,2]", "DownloadSettings [default(maxdelay(ms),mindelay(ms),type:0.Separate else.combine):10000,5000,0]" ];
		mItems.forEach((item, index) => {
			let bna, val;
			const psb = '<p style="font-size: 1em; line-height: 2em; margin: 1em;">' + item + ': <span type="button" style="border: thin solid dodgerblue;';
			const pse = '</span></p>';
			switch (index) {
				case 0:
					bna = "ATC";
					break;
				case 1:
					bna = "AUH";
					break;
				case 2:
					bna = "SDB";
					break;
				case 3:
					bna = "DTF";
					break;
				case 4:
					bna = "FAC";
					break;
				case 5:
					bna = "FCC";
					break;
				case 6:
					bna = "FUC";
					break;
				case 7:
					bna = "FAU";
					break;
				case 8:
					bna = "FBL";
					break;
				case 9:
					bna = "FDT";
					break;
			}
			if (index <= 3) {
				comu.innerHTML += psb + '" class="nse_swh" data="' + bna + '">' + tlo[bna] + pse;
			} else if (index > 3 && index < 7) {
				comu.innerHTML += psb + 'color:' + tlo[bna] + '; display: inline-block; min-width: 2em;" contenteditable>' + tlo[bna] + '</span><span class="nse_inc" data="' + bna + '"> ✅</span><span class="nse_csb" data="' + bna + '"> 🎨' + pse;
			} else {
				comu.innerHTML += psb + ' display: inline-block; min-width: 2em;" contenteditable>' + tlo[bna] + '</span><span class="nse_inn" data="' + bna + '"> ✅' + pse;
			}
		});
	}
	// Option menu button
	function OMB(e) {
		const eT = e.target;
		if (eT.id === "nse_iop") {
			let copt = document.getElementById("nse_inp").innerText;
			if ( copt.startsWith("{") ) {
				copt = copt.slice(1, -1).split("\n");
				for (let i=1; i<copt.length-1; i++) {
					let ttt = i === (copt.length-2) ? copt[i] : copt[i].slice(0, -1);
					if (ttt.slice(1, 6) === gMk) {
						tlo = JSON.parse(ttt.slice(9));
						UOM();
					} else {
						GM_setValue(ttt.slice(1, 6), JSON.parse(ttt.slice(9)));
					}
				}
				document.getElementById("nse_inp").innerText = "Import completed";
			} else {
				document.getElementById("nse_inp").innerText = "Invalid input";
			}
		} else if (eT.id === "nse_sop") {
			const ctim = new Date().toISOString().split('T')[0];
			let copt = "{\n";
			const keys = GM_listValues();
			keys.forEach(k => {
				copt += '"' + k + '": ' + JSON.stringify(GM_getValue(k)) + ',\n';
			});
			SAT("nse_bak_" + ctim, copt.slice(0, -2) + "\n}");
			alert("File downloads completed");
		} else if (eT.className === "nse_swh") {
			const key = eT.getAttribute("data");
			tlo[key] = !tlo[key];
			eT.textContent = tlo[key];
		} else if (eT.className === "nse_inc") {
			const ePf = eT.parentElement.querySelector("span");
			const key = eT.getAttribute("data");
			tlo[key] = ePf.textContent;
			ePf.style.color = ePf.textContent;
		} else if (eT.className === "nse_csb") {
			const ePf = eT.parentElement.querySelector("span");
			CCL(eT, ePf);
		} else if (eT.className === "nse_inn") {
			const ePf = eT.parentElement.querySelector("span");
			let num;
			if (ePf.textContent.includes(",")) {
				num = JSON.parse("[" + ePf.textContent + "]");
			} else {
				num = parseInt(ePf.textContent);
			}
			const key = eT.getAttribute("data");
			tlo[key] = num;
		}
	}
	// Colour list
	function CCL(elem, pele) {
		const clst = elem.appendChild(document.createElement("dialog"));
		clst.id = "nse_clst";
		let cContent = `<form method="dialog">
			<p>
				<label>Select a colour:
					<select>`;
		const colors = ['deepskyblue', 'blue', 'lime', 'green', 'fuchsia', 'indigo', 'orange', 'red'];
		colors.forEach((item) => {
			cContent += `<option style="color: ${item};">${item}</option>`;
		});
		cContent += `</select>
				</label>
			</p>
			<menu>
				<button value="cancel" formmethod="dialog">Cancel</button>
				<button id="confirmBtn" value="default">Confirm</button>
			</menu>
		</form>`;
		clst.innerHTML = cContent;
		clst.showModal();
		const selectEl = clst.querySelector("select");
		const confirmBtn = clst.querySelector("#confirmBtn");
		clst.addEventListener("close", (e) => {
			if (clst.returnValue !== "cancel" && clst.returnValue !== "") {
				pele.textContent = clst.returnValue;
				const key = elem.getAttribute("data");
				tlo[key] = pele.textContent;
				pele.style.color = pele.textContent;
			}
			clst.innerHTML = "";
			elem.removeChild(clst);
		});
		confirmBtn.addEventListener("click", (event) => {
			event.preventDefault();
			clst.close(selectEl.value);
		});
	}
	// Custom reading history
	function CRH(elem, upa, upb) {
		if (!document.getElementById("nse_rhd")) {
			const crl = document.getElementById(elem);
			if (gMk === "HUN_K") {
				const gBody = document.querySelector("body#page-my-antenna-worksGuest");
				if (gBody) {
					gBody.style.overflow = "auto";
				}
			}
			let cihb = "";
			if ( uRi.includes("/antenna/works")
			|| uRi.includes("/favnovelmain/")
			|| uRi.includes("_histor") 
			|| uRi.includes("/rireki") ) {
				cihb = '<p id="nse_ihb" style="margin-left: 1em; cursor: pointer;">💕 Import from current page</p>';
			}
			crl.innerHTML = '<h2>閲覧履歴：</h2>' +
								cihb + 
								'<p id="nse_shb" style="margin-left: 1em; cursor: pointer;">💾 Save history to local txt</p>' + 
							'<div id="nse_rhd" style="margin: 1em 0 0 1em;"></div>';
		}
		document.getElementById("nse_rhd").innerHTML = "";
		Object.keys(tlo.RRK).reverse().forEach(k => {
			// Update version patch
			if (!tlo.RRK[k].bmk) {
				tlo.RRK[k].bmk = null;
			}
			const vbmk = tlo.RRK[k].bmk === "1" ? " 💖 "
						: tlo.RRK[k].bmk === "2" ? " 🖤 "
						: " ❓ ";
			const vlink = (gMk === "HUN_K" && (tlo.RRK[k].epi.length <= 4))
						? '<a href="' + upa + k + '/resume_reading" data="' + tlo.RRK[k].epi + '" style="margin-left: 1em;">' + tlo.RRK[k].tit + '</a>'
						: '<a href="' + upa + k + upb + tlo.RRK[k].epi + '" data="' + tlo.RRK[k].epi + '" style="margin-left: 1em;">' + tlo.RRK[k].tit + '</a>';
			document.getElementById("nse_rhd").innerHTML += '<p style="font-size: 1em; line-height: 2em;">' +
				'<span class="nse_drh" data="' + k + '" type="button" style="color: red; cursor: pointer;">✖</span>' + 
				'<span style="margin-left: 1em;">' + tlo.RRK[k].tim + '</span>' + 
				'<span class="nse_brh" data="' + k + '" style="margin-left: 1em; cursor: pointer;">' + vbmk + '</span>' + 
				vlink +
			'</p>';
		});
	}
	// Create resume button
	function CRB(key, elem, upa, upb) {
		const tbtn = document.querySelector(elem).appendChild(document.createElement("a"));
		tbtn.href = upa + key + upb + tlo.RRK[key].epi;
		tbtn.textContent = "▶続きから読む";
		tbtn.style = "margin-left: 1em; color: dodgerblue; cursor: pointer;";
	}
	// Create import button
	function CIB(node, etit, eepi) {
		URD();
		let bookmark;
		const no = document.getElementsByClassName(node);
		for (let i = no.length - 1; i >= 0; i--) {
			switch (location.host) {
				case "kakuyomu.jp": {
					const cno = no[i].querySelectorAll("li");
					let cepi;
					if (uRi.includes("histo")) {
						cepi = (cno.length === 2)
								? cno[1].textContent.slice(3,-1)
								: (cno[2].textContent.slice(3,-1) - cno[1].textContent.slice(2,-1)).toString();
						bookmark = null;
					} else {
						cepi = (cno.length === 2)
								? cno[0].textContent.slice(3,-1)
								: (cno[1].textContent.slice(3,-1) - cno[0].textContent.slice(2,-1)).toString();
						bookmark = "1";
					}
					ANH(no[i].querySelector(eepi).href.split("/")[4], cepi, no[i].querySelector(etit).textContent, bookmark);
					break;
				}
				case "syosetu.com":
				case "yomou.syosetu.com": {
					let title;
					if (location.host.startsWith("y")) {
						title = no[i].querySelector(etit).textContent.slice(0, 12);
						bookmark = null;
					} else {
						title = no[i].querySelector(etit).textContent.slice(3, 15);
						bookmark = "1";
					}
					ANH(no[i].querySelector(etit).href.split("/")[3], no[i].querySelector(eepi).href.split("/")[4], title, bookmark);
					break;
				}
			}
		}
		USV();
		alert("result: " + JSON.stringify(tlo.RRK));
	}
	// Add new history
	function ANH(key, epi, title, bmk) {
		let tim = new Date().toISOString().split('T')[0];
		if ( !uRi.includes("/favnovelmain/") 
		&& !uRi.includes("/antenna/works") ) {
			if (Object.hasOwn(tlo.RRK, key)) {
				if ( uRi.includes("_histor")
				|| uRi.includes("/rireki") ) {
					tim = tlo.RRK[key].tim;
				}
				bmk = tlo.RRK[key].bmk;
				delete tlo.RRK[key];
			}
		} else {
			if (Object.hasOwn(tlo.RRK, key)) {
				tlo.RRK[key].bmk = bmk;
			}
		}
		if (!Object.hasOwn(tlo.RRK, key)) {
			if (title.length > 12) {
				title = title.slice(0, 12);
			}
			tlo.RRK[key] = {"epi": epi, "tit": title, "tim": tim, "bmk": bmk};
		}
	}

	// Narou get episodes from download page
	function NGL(title, url, elem) {
		fetch(url).then((response) => {
			if (response.ok) {
				return response.text();
			}
			throw new Error('Something went wrong');
		})
		.then(async (text) => {
			const doc = new DOMParser().parseFromString(text, 'text/html');
			const data = doc.querySelector(elem).textContent;
			const min = parseInt(prompt("Enter a start episode number", "1"));
			const max = parseInt(prompt("Enter a end episode number", "2"));
			let nlc = "";
			if (min >= 1 && min <= max) {
				const ept = data.split("\n");
				for (let i = 1; i < data.split("\n").length - 1; ) {
					const tit = i + ". " + ept[i];
					const url = uRi + i + "/";
					// download episode base on input range
					if (i >= min && i <= max) {
						await sleep(Math.floor((Math.random() * (tlo.FDT[0] - tlo.FDT[1] + 1)) + tlo.FDT[1])).then(() => {
							nlc += tit + ": " + url + "\n";
							//console.log(tit, url);
							GEC(tit, url, "div#novel_honbun");
						});
					}
					i++;
				}
			} else {
				alert("Invalid Inputs");
			}
			WLD(title, nlc, "nse_sml");
		})
		.catch((error) => {
			//console.log(error);
		});
	}
	// Kakuyomu get episodes list from novel page
	async function KGL(title, url, elem) {
		const data = JSON.parse(document.getElementById(elem).innerHTML);
		const re = new RegExp("Episode:");
		const keys = data.props.pageProps.__APOLLO_STATE__;
		const min = parseInt(prompt("Enter a start episode number", "1"));
		const max = parseInt(prompt("Enter a end episode number", "2"));
		let nlc = "";
		if (min >= 1 && min <= max) {
			let i = 1;
			for (let key in keys) {
				if (re.test(key)) {
					const ttit = i + ". " + keys[key].title;
					const turl = url + "/episodes/" + keys[key].id;
					// download episode base on input range
					if (i >= min && i <= max) {
						await sleep(Math.floor((Math.random() * (tlo.FDT[0] - tlo.FDT[1] + 1)) + tlo.FDT[1])).then(() => {
							nlc += ttit + ": " +turl + "\n";
							//console.log(nlc);
							GEC(ttit, turl, "div.widget-episodeBody");
						});
					}
					i++;
				}
			}
		} else {
			alert("Invalid Inputs");
		}
		WLD(title, nlc, "nse_sml");
	}
	// Get episode content
	function GEC(title, url, elem) {
		fetch(url).then((response) => {
			if (response.ok) {
				return response.text();
			}
			throw new Error('Something went wrong');
		})
		.then((text) => {
			const doc = new DOMParser().parseFromString(text, 'text/html');
			const data = doc.querySelector(elem).textContent;
			if (tlo.FDT[2] === 0) {
				// Separate txt
				SAT(title, data);
			} else {
				// Combine
				SML(title, data);
			}
		})
		.catch((error) => {
			//console.log(error);
		});
	}
	// Download current epicode as txt
	function DCE() {
		let elem, title;
		if (gMk === "HUN_K") {
			elem = "div.widget-episodeBody";
			title = document.querySelector("p.widget-episodeTitle")
					? document.querySelector("p.widget-episodeTitle").textContent
					: document.title.replace(/\s/g,"").match(/[^-]+/);
		} else if (gMk === "HUN_N") {
			elem = "div#novel_honbun";
			title = document.querySelector("p.novel_subtitle")
					? document.querySelector("p.novel_subtitle").textContent
					: document.title.split("-")[1];
		}
		const data = document.querySelector(elem).textContent;
		SAT(title, data);
		alert("File downloads completed");
	}
	// Save as txt
	function SAT(title, text) {
		//console.log(text);
		const link = document.createElement("a");
		link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
		link.download = title + ".txt";
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	// Save multiple data to link
	function SML(title, text) {
		if (!document.getElementById("nse_sml")) {
			const link = document.body.appendChild(document.createElement("a"));
			link.id = "nse_sml";
			link.href = "data:text/plain;charset=utf-8,";
			link.style.display = "none";
		}
		document.getElementById("nse_sml").href += encodeURIComponent(title + "\n" + text + "\n");
	}
	// Wait link data are all ready
	function WLD(title, eplst, elem) {
		sleep(tlo.FDT[0]).then(() => {
			// Save episodes list
			SAT(title + "_目次", eplst);
			// Save episodes content
			const clnk = document.getElementById(elem);
			if(clnk) {
				clnk.download = title + ".txt";
				clnk.click();
				document.body.removeChild(clnk);
				alert("File downloads completed");
			}
		});
	}
})();