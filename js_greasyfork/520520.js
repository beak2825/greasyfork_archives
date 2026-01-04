// ==UserScript==
// @name         AP Megascript Public
// @namespace    Cartel Empire
// @version      1.0.27
// @description  A combination of multiple scripts, originally created by K9ER.
// @author       K9ER [781]
// @include      /https:\/\/cartelempire\.online\/?.*$/
// @icon         https://i.imgur.com/Zh7LX39.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520520/AP%20Megascript%20Public.user.js
// @updateURL https://update.greasyfork.org/scripts/520520/AP%20Megascript%20Public.meta.js
// ==/UserScript==



// === Installation ===
// PC: just get Tampermonkey browser add-on
// Android: Violentmonkey browser add-on
// iOS: Userscripts


// === Some basic user options ===
const LINKS = [
	{
		name: "ITEM MARKET",
		altName: "Market",
		link: "/Market",
		path: `<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"></path>`,
		viewBox: "16"
	},
	{
		name: "STAT EST",
		altName: "Stat Ests",
		link: "/StatEstimates",
		path: `<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>`,
		viewBox: "16"
	},
	{
		name: "HOSPITAL",
		altName: "Hospital",
		link: "/Hospital",
		path: `<path d="M6 0h4v4h4v4h-4v4h-4v-4H2V4h4V0z"/>`,
		viewBox: "16"
	},
	{
		name: "HIGHSCORES",
		altName: "Highscores",
		link: "/Highscores",
		path: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
  <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>
</svg>`,
		viewBox: "16"
	}
];
const STRIKETHROUGH = false; // Display the normally-displayed price as well, striked-through
const ALWAYS_COLOR_NAMES = [ "FN SCAR-H", "Desert Eagle", "Full-Body Armour" ];
const DAYS = 7; // Number of days of production materials to stock up
// === End user options ===

let user_name = "";
let user_id = 0;

function extractUserInfo() {
    console.log("Extracting user info...");

    const labels = document.querySelectorAll(".profileLabel");

    let nameIdElement = null;

    labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === "name") {
            nameIdElement = label.parentElement.nextElementSibling.querySelector(".form-data-inset");
        }
    });

    if (nameIdElement) {
        const userInfo = nameIdElement.textContent.trim();

        const [extractedName, extractedId] = userInfo.split(" - ");

        if (extractedName && extractedId) {
            user_name = extractedName.trim();
            user_id = extractedId.trim();

            // Save the user name and ID in localstorage
            localStorage.setItem("user_name", user_name);
            localStorage.setItem("user_id", user_id);

            console.log("✅ Extracted User Name:", user_name);
            console.log("✅ Extracted User ID:", user_id);
        } else {
            console.warn("⚠️ Failed to properly split name and ID.");
        }
    } else {
        console.error("❌ User name and ID not found on the page!");
    }
}

// Function to get user name and ID from localstorage
function getUserInfoFromStorage() {
    const storedName = localStorage.getItem("user_name");
    const storedId = localStorage.getItem("user_id");

    if (storedName && storedId) {
        console.log(`From LocalStorage: Name: ${storedName}, ID: ${storedId}`);
        return { user_name: storedName, user_id: storedId };
    } else {
        console.log("ℹ️ User info not found in localStorage.");
        return null;
    }
}

// Try to get user info from localStorage
let userInfo = getUserInfoFromStorage();

// If not found in localStorage, extract it from the page
if (!userInfo) {
    extractUserInfo(); // Extract and store
    userInfo = getUserInfoFromStorage(); // Try again after extraction
}

// Use extracted info in the script
if (userInfo) {
    user_name = userInfo.user_name;
    user_id = userInfo.user_id;

    const userInfoElement = document.querySelector("#user-info-display");
    if (userInfoElement) {
        userInfoElement.textContent = `Name: ${user_name}, ID: ${user_id}`;
    }

    console.log(`Final Name: ${user_name}, Final ID: ${user_id}`);
}

user_name = localStorage.getItem('user_name') || "";
user_id = localStorage.getItem('user_id') || 0;


const observeDOM = (function() { // Used for seeing when elements update, for some reason there's no neat standard way to do that
	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	return function(obj, callback) {
		if(!obj || obj.nodeType !== 1)
			return;
		if(MutationObserver) {
			let mutationObserver = new MutationObserver(callback);
			mutationObserver.observe(obj, {
				childList: true,
				subtree: true
			});
			return mutationObserver;
		} else if(window.addEventListener) {
			obj.addEventListener("DOMNodeInserted", callback, false);
			obj.addEventListener("DOMNodeRemoved", callback, false);
		}
	}
})();


class AddItemButtons {
	constructor() {
		this.cokeDesc = "Unlike the shadows of tainted competitors, this cocaine embodies purity \u2013 a potent source of untamed energy, and unparalleled confidence. Time itself seems to bow to your will, granting you control over the universe and its secrets. Cocaine serves as both reward and temptation, a double-edged sword that can either elevate you to greatness or lead you down a treacherous path to Hospital and reduces Combat Stats.";
		this.PFDesc = "The Personal Favour is granted to players by El Capo, the boss of boss's. It's a valuable asset that can be used to get the player out of jail when they find themselves in a tight spot with the law. With this favour, players bypass the usual legal processes and secure their freedom with just a single phone call to El Capo.";
		this.cokeEffect = "Increases Energy by 50. Increases drug cooldown by 3 hours. Possible overdose effect of -20% all Combat Stats";
		this.PFEffect = "Releases you from Jail";
	}
	getID(coke = true) {
		const ID = GM_getValue(`itemID_${coke ? "Cocaine" : "Personal Favour"}`);
		return ID === undefined ? null : ID;
	}
	setID(cache, coke = true) {
		const itemName = coke ? "Cocaine" : "Personal Favour";
		GM_setValue(`itemID_${itemName}`, cache);
		console.log(`Set itemID_${itemName} to ${cache}`);
		return cache;
	}
	getCount(coke = true) {
		const val = GM_getValue(`itemCache_${coke ? "Cocaine" : "Personal Favour"}`);
		return val === undefined ? null : val;
	}
	setCount(cache, coke = true) {
		const itemName = coke ? "Cocaine" : "Personal Favour"
		GM_setValue(`itemCache_${itemName}`, cache);
		console.log(`Set itemCache_${itemName} to ${cache}`);
		return cache;
	}
	getValue(coke = true) {
		const val = GM_getValue(`value_${coke ? "Cocaine" : "Personal Favour"}`);
		return val === undefined ? null : val;
	}
    scriptFunc() {
        $(() => {
            // Existing click handlers
            $(document).on("click", ".row.inventoryItemWrapper", e => handleInventoryCollapse(e.target));
            $(".use-item-btn").on("click", e => useItemClicked(e));
        });

	function useItemClicked(e) {
    // Disable button
    $(".use-item-btn").prop("disabled", true);
    var containingRow = $(e.currentTarget).parents(".row")[0];
    const dateString = new Date(Date.now()).toLocaleTimeString("en-GB", { timeZone: "UTC" });
    $(".useItemMsg").remove();

    const id = e.currentTarget.getAttribute("id");
    $.post("/Inventory/Use?id=" + id, data => {
        if (data.status == 200) {
            if (data.type == "Weapon" || data.type == "Armour" || data.type == "Thrown") {
                $(location).attr("href", "/Inventory");
            } else {
                if (data.statusMsg.success) {
                    $(containingRow).append(`<div class="col-12 useItemMsg mt-2 text-success fw-bold">${dateString} - ${data.statusMsg.success}</div>`);

                    if (data.energyGained) {
                        let currentEnergy = parseInt($("#currentEnergy")[0].innerText);
                        let newEnergy = currentEnergy + data.energyGained;
                        let maxEnergy = parseInt($("#maxEnergy")[0].innerText);
                        let percentageOfMax = ((newEnergy / maxEnergy) * 100);

                        $("#currentEnergy")[0].innerText = newEnergy;
                        $("#energyProgress")[0].style.width = `${percentageOfMax}%`;
                        $("#energyProgress")[0].setAttribute("aria-valuenow", newEnergy);

                        // Update input fields
                        $("form.input-group input.form-control").each((idx, elem) => {
                            elem.setAttribute("max", newEnergy.toString());
                            elem.setAttribute("value", newEnergy.toString());
                        });
                        $("form.input-group input.btn.disabled").each((idx, elem) => elem.classList.remove("disabled"));
                    }
                    if (data.lifeToSet || data.lifeToSet === 0) {
                        let maxLife = parseInt($("#maxLife")[0].innerText);
                        let newLife = data.lifeToSet;
                        let percentageOfMax = ((newLife / maxLife) * 100);
                        if (newLife > maxLife)
                            newLife = maxLife;

                        $("#currentLife")[0].innerText = newLife;
                        $("#lifeProgress")[0].style.width = `${percentageOfMax}%`;
                        $("#lifeProgress")[0].setAttribute("aria-valuenow", newLife);
                    }

                    if (data.sentToHospital) {
                        $(".content-container").attr("style", "background-image:linear-gradient(to right, rgba(255,0,0,0.05), rgba(255, 0, 0, 0.2), rgba(255,0,0,0.05)), url(../images/background-hospital.webp);");
                        $("#userStatus").text("In Hospital");
                    }
                    if (data.releaseFromHosp || data.releaseFromJail) {
                        $(".content-container").attr("style", "background-image:linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(../images/background.webp)");
                        $("#userStatus").text("Active");
                    }

                    // Update item count
                    let container = $(e.currentTarget).parents(".inventoryItemWrapper")[0];
                    let itemCountLabel = $(container).find(".itemQuantity");
                    if (itemCountLabel.length == 0) {

                    }
                    if (itemCountLabel[0]) {
                        let currentCount = parseInt(itemCountLabel[0].innerText);
                        if (!isNaN(currentCount)) {
                            if (currentCount - 1 > 0)
                                itemCountLabel[0].innerText = currentCount - 1;
                            else
                                containingRow.remove();
                        }
                    }

                    // Reload the page if the item was successfully used
                    location.reload();
                } else {
                    $(containingRow).append(`<div class="col-12 useItemMsg mt-2 text-danger fw-bold">${dateString} - ${data.statusMsg.error}</div>`);
                }
            }
            $(".use-item-btn").prop("disabled", false);
        }
    });
}



		function handleInventoryCollapse(target) {
			if(target.tagName != 'svg' && target.tagName != 'BUTTON' && target.tagName != 'path') {
				// Hide any open items
				$('.collapse').collapse('hide');

				if($(target).hasClass("inventoryItemWrapper")) {
					$(target).find('.collapse').collapse("show");
				} else {
					$(target).parents('.row.inventoryItemWrapper').first().find('.collapse').collapse("show");
				}
			}
		}
	}
	addScript() {
		this.script = document.createElement("script");
		this.script.type = "text/javascript";
		this.script.innerHTML = this.scriptFunc.toString().replace(/^[^\{]*\{/, "").replace(/\}[^\}]*$/, "");
		document.head.appendChild(this.script);
	}
	add(count, value, pb, coke = true) {
		const ID = this.getID(coke);
		if(ID === null)
			return "";
		const imageID = coke ? 301 : 3;
		const itemName = coke ? "Cocaine" : "Personal Favour";
		const actionName = coke ? "Take" : "Use";
		return `<hr><div class="row row-cols-3 align-items-center pb-${pb} inventoryItemWrapper" id="item-${ID}" style="cursor: auto; border-bottom: none"><div class="col col-4 col-sm-2 col-xl-1"><img class="img-thumbnail" src="/images/items/${imageID}.png" title="${itemName}"></div><div class="col col-8 col-sm-3 col-xl-4">${itemName}<span class="fw-bold"> x<span class="itemQuantity">${count.toLocaleString("en-US")}</span></span></div><div class="col col-2 col-sm-4 col-xl-2 d-none d-sm-inline">${coke ? "Drug" : "Special"}</div><div class="col col-2 col-xl-2 d-none d-xl-inline"><span></span>\u00a3${value.toLocaleString("en-US")} </div><div class="col col-12 col-sm-3 pe-2 d-none d-sm-inline"><button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" title="Throw Away" aria-label="Throw Away ${itemName}" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg></button><button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="${count}" title="Send" aria-label="Send ${itemName}" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path></svg></button><button class="btn btn-sm btn-outline-dark action-btn use-item-btn float-end" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path></svg></button></div><div class="col col-12 collapse" id="itemCollapse${ID}" style=""><div class="row row-cols-2 d-md-none mt-3 mb-2"><div class="col col-6 mb-2"><button class="btn btn-sm btn-outline-dark action-btn use-item-btn w-100" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">${actionName}</button></div><div class="col col-6 mb-2"> <button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="42" title="Send" aria-label="Send ${itemName}" disabled="true">Send</button></div><div class="col col-6 mb-2"> <button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-itemquantity="42" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="true">Throw</button></div></div><div class="row mb-3"><div class="col-12 mt-2"><div class="card-text"> <div class="fw-bold">Description </div><div class="card-text">${coke ? this.cokeDesc : this.PFDesc}</div></div></div></div><div class="row mb-3"><div class="col-6 d-md-none"><div class="card-text"> <div class="fw-bold">Type </div><div class="card-text">${coke ? "Drug" : "Special"}  </div></div></div><div class="col-6 d-xl-none"><div class="card-text"> <div class="fw-bold">Value</div><div class="card-text"><span></span>\u00a3${value.toLocaleString("en-US")} </div></div></div></div><div class="row"> <div class="col-xl-6 col-md-6 col-12 mb-3"><div class="card-text"> <div class="fw-bold">Effect </div><div class="card-text">${coke ? this.cokeEffect : this.PFEffect}</div></div></div></div></div></div>`;
	}
	addListener(coke = true) {
		const ID = this.getID(coke);
		if(ID === null)
			return;
		const item = document.getElementById(`item-${ID}`);
		observeDOM(item, e => {
			const added = e[0].addedNodes[0];
			if(!added || !added.classList || !added.classList.contains("useItemMsg"))
				return;
			if(added.classList.contains("text-danger") /*&& added.innerText.endsWith(coke ? "max Drug cooldown." : "you're in Jail.")*/) // Couldn't use
				return;
			const newCokeCount = (this.getCount(coke) || 1) - 1;
			this.setCount(newCokeCount, coke);
			let countText = document.querySelector(`#item-${ID} span.itemQuantity`);
			countText.innerText = newCokeCount.toLocaleString("en-US");
		});
	}
	inGym(url) {
        let targetElement = document.querySelector(".row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
        if (targetElement !== null) {
            let newDiv = document.createElement("div");
            newDiv.innerHTML = this.add(this.getCount(true) || 0, this.getValue(true) || "???", 4, true);
            targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);
            this.addScript();
            this.addListener(true);
        }
    }
	inUniversity(url) {
		let container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		if(container === null)
			return;
		const form = container.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if(form === null) // At max int
			return;
		if(container !== null) {
			container.innerHTML += this.add(this.getCount(true) || 0, this.getValue(true) || "???", 2, true);
			this.addScript();
			this.addListener(true);
		}
	}
	inJail(url) { // Add personal favour button
		let container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		const inJail = container.querySelector("p.card-text.fw-bold.text-success");
		if(inJail === null)
			return;
		if(container !== null) {
			container.innerHTML += this.add(this.getCount(false) || 0, this.getValue(false) || "???", 2, false);
			this.addScript();
			this.addListener(false);
		}
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if(itemList === null)
			return;

		for(var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if(item.children.length < 2)
				continue;
			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');
			if(itemName === "Cocaine")
				this.setID(item.id.slice(5), true);
			else if(itemName === "Personal Favour")
				this.setID(item.id.slice(5), false);
		}
	}
}


class AddLinks {
	constructor(links) {
		this.links = links;
	}

	inAnywhere(url) {
		let mobileMenu = document.querySelector("ul#menu");
		let desktopMenu = document.querySelector("ul#desktopMenu");

		for (let linkObj of this.links) {
			let listItem = document.createElement("li");
			listItem.className = "flex-fill"; // Ensures proper desktop spacing

			listItem.innerHTML = `
				<a class="nav-link d-flex flex-column align-items-center px-md-0 px-2 leftNavLink" href="${linkObj.link}">
					<svg class="mb-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 ${linkObj.viewBox} ${linkObj.viewBox}">
						${linkObj.path}
					</svg>
					<span class="text-center">${linkObj.name}</span>
				</a>
			`;

			if (mobileMenu) {
				mobileMenu.appendChild(listItem.cloneNode(true));
			}
			if (desktopMenu) {
				desktopMenu.appendChild(listItem);
			}
		}
	}
}



class BankDepositTax {
	constructor() {
		this.taxRate = 2.5;
		this.ID = "taxOnDeposit";
	}
	calc(val) {
		return `Deposit tax: \u00a3${Math.round(val / 100 * this.taxRate).toLocaleString("en-US")}`;
	}
	inBank(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if(container === null)
			return;
		const depositInput = container.querySelector("input#depositInput");
		let value = Math.floor(parseFloat(depositInput.value.replaceAll(',', "")));

		const row = container.querySelector("div.row");
		let breakHr = document.createElement("hr");
		breakHr.classList.add("w-75");
		container.insertBefore(breakHr, row);

		let tax = document.createElement("p");
		tax.id = this.ID;
		tax.classList.add("card-text", "text-muted", "mt-2");
		tax.innerHTML = this.calc(value);
		container.appendChild(tax);

		[ "autoNumeric:formatted", "input" ].forEach(eventType => {
			depositInput.addEventListener(eventType, e => {
				value = e.target.value === "" ? 0 : Math.floor(parseFloat(e.target.value.replaceAll(',', "")));
				tax.innerHTML = this.calc(value);
			});
		});
	}
}


class BetterItemValues {
	constructor(darkMode, strikethrough, alwaysColorNames) {
		this.brightness = darkMode ? 50 : 45;
		this.bestColor = `hsl(60, 100%, ${darkMode ? 70 : 40}%)`;
		this.strikethrough = strikethrough;
		this.alwaysColorNames = alwaysColorNames;

		this.pointName = "Supporter Points";

		const values = GM_listValues().filter(name => name.startsWith("value_")); // Prefill values first use
		if(values.length === 0) {
			const defaultVals = {"Walther P38":2200,"AK-47":13000,"M1911":13000,"M16A2 Rifle":13000,"S&W Magnum Revolver":120000,"MG34":400000,"Fragmentation Grenade":24999,"Stun Grenade":18000,"Illuminating Grenade":9999,"Flash Bang Grenade":9999,"Tear Gas Grenade":18000,"Covert Stab Vest":75000,"Tactical Plate Armour":3000000,"Personal Favour":170000,"Supporter Pack":9500000,"Corana Beer":150000,"Mexcal Beer":438000,"Blancoda Tequila":847000,"Repose Tequila":1850000,"Anejo Tequila":1720000,"Raicilla":2000000,"Bandage":3999,"Small Medical Kit":6999,"Tainted Cannabis":9999,"Large Medical Kit":16000,"Basic Trauma Kit":25000,"Large Trauma Kit":40000,"Tainted Cocaine":15000,"Cannabis":24998,"Cocaine":610000,"Bag of Fertiliser":19000,"Coca Paste":26000,"Agave Heart":53000,"Concrete Bags":89000,"Nails":124900,"Bricks":99999,"Steel":94000,"Dog Food":7398,"Supporter Points":34899,"El Chapo's Head":10000000,"Glock 18":500000,"Ballistic Vest":100000,"G36":750000,"Desert Eagle":8000000}; // Players should go to the market to load up-to-date values, these are presets probably over half a year old
			for(var name in defaultVals)
				this.setValue(name, defaultVals[name]);
		}

		this.maxCokeDaily = 8;
		this.cokeODChance = 1; // percent
		this.taintedChance = [ 10, 20 ]; // percent
		this.energyItems = {
			"Corana Beer": 5,
			"Mexcal Beer": 10,
			"Blancoda Tequila": 15,
			"Repose Tequila": 20,
			"Anejo Tequila": 25,
			Raicilla: 30,
			Cocaine: 50 * (1 - this.cokeODChance / 100),
			"Glittering Gift": 100
		};
		this.hospitalItems = {
			Bandage: 10,
			"Small Medical Kit": 15,
			"Large Medical Kit": 60,
			"Basic Trauma Kit": 80,
			"Large Trauma Kit": 120
		};

		this.prodDepreciation = 2;
		this.narcoCounts = [ 1, 5, 25, 10, 60 ];
		this.prodMoney = [ 1000, 0, 105000, 70000, 800000 ]; // Accurate
		this.prodCokeScaling = [ 1, 1.75, 2.3125, 2.734375 ]; // Source: screenshot in the Coke suggestions thread
		this.prodReqs = [ // NOTE: values no longer used, since courses can reduce requirements
			{},
			{},
			{ "Bag of Fertiliser": 10 },
			{ "Agave Heart": 5 },
			{ "Coca Paste": 35 }
		];
		this.doctorsOfficePerProd = 1;
		this.maxCannabis = 12;
		this.alcoholPerProd = 1;
		this.maxCoke = 8;
		this.itemCounts = [
			{},
			{ // Very likely accurate
				Bandage: this.doctorsOfficePerProd * 50 / 100,
				"Small Medical Kit": this.doctorsOfficePerProd * 30 / 100,
				"Large Medical Kit": this.doctorsOfficePerProd * 12.5 / 100,
				"Basic Trauma Kit": this.doctorsOfficePerProd * 5 / 100,
				"Large Trauma Kit": this.doctorsOfficePerProd * 2.5 / 100
			},
			{ // Accurate
				Cannabis: this.maxCannabis / 2 * (1 - this.taintedChance[0] / 100),
				"Tainted Cannabis": this.maxCannabis / 2 * this.taintedChance[0] / 100
			},
			{ // Distribution from 35 days with 14 stills
				"Corana Beer": this.alcoholPerProd * 25.9 / 100,
				"Mexcal Beer": this.alcoholPerProd * 8.5 / 100,
				"Blancoda Tequila": this.alcoholPerProd * 30.3 / 100,
				"Repose Tequila": this.alcoholPerProd * 14.1 / 100,
				"Anejo Tequila": this.alcoholPerProd * 9.5 / 100,
				Raicilla: this.alcoholPerProd * 3.1 / 100
			},
			{
				Cocaine: this.maxCoke / 2 * (1 - this.taintedChance[1] / 100),
				"Tainted Cocaine": this.maxCoke / 2 * this.taintedChance[1] / 100
			}
		];
		//this.jobTimes = [ 5, 30, 60, 180, 15, 30, 60, 90, 360, 720 ]; // NOTE: prestige may change this, so instead calculate
		this.jobMoney = [ 1650, 14000, 55000, 250000, 111, 111, 111, 260, 700000, 2250000 ];
		this.jobRep = [ 10, 75, 160, 490, 21, 50, 82, 165, 1130, 2320 ];
		this.jobItems = [
			{},
			{ "Personal Favour": 1 / 20 },
			{ "Personal Favour": 1 / 15 },
			{ "Personal Favour": 1 / 10 },
			{ "Bag of Fertiliser": 5 },
			{ "Agave Heart": 2.5 },
			{ "Coca Paste": 9.5 },
			{ Nails: 11 * 0.4, Bricks: 11 * 0.3, "Concrete Bags": 11 * 0.2, Steel: 11 * 0.1 },
			{ "Personal Favour": 1 / 5 }, // TODO this is a guess
			{ "Personal Favour": 1 / 2 } // TODO this is a guess
		];

		const prodProfit = GM_getValue("perks_Production Profit") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.prodProfitFactor = 1 + prodProfit / 100;
		const streetProfit = GM_getValue("perks_Street Crime Profit") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.streetProfitFactor = 1 + streetProfit / 100;
		const jobProfit = GM_getValue("perks_Job Profits") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.jobProfitFactor = 1 + jobProfit / 100;
		const medEffectivenessBoost = GM_getValue("perks_Med Effectiveness") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.medEffectivenessFactor = 1 + medEffectivenessBoost / 100;

		this.poundPerEnergy = {};
		this.maxPpe = 0;
		this.minPpe = Infinity;
		this.poundPerHospitalTime = {};
		this.maxPpht = 0;
		this.minPpht = Infinity;

		for(var item in this.energyItems) {
			const price = this.getValue(item);
			if(price !== null) {
				const ppe = price / this.energyItems[item];
				this.poundPerEnergy[item] = ppe;
				this.maxPpe = Math.max(this.maxPpe, ppe);
				this.minPpe = Math.min(this.minPpe, ppe);
			}
		}
		for(var item in this.hospitalItems) {
			const price = this.getValue(item);
			if(price !== null) {
				let time = this.hospitalItems[item];
				time *= this.medEffectivenessFactor;
				const ppht = price / time;
				this.poundPerHospitalTime[item] = ppht;
				this.maxPpht = Math.max(this.maxPpht, ppht);
				this.minPpht = Math.min(this.minPpht, ppht);
			}
		}
		// NOTE: calculate job values inJob since it's only used there and we need prestige levels
	}
    getValue(itemName) {
        let formattedName = `value_${itemName.replaceAll(' ', '_')}`;
        let val = GM_getValue(formattedName, null);

        // Fallback to old format if new format returns null
        if (val === null) {
            formattedName = `value_${itemName}`; // Try without replacing spaces
            val = GM_getValue(formattedName, null);
        }

        console.log(`Fetching value for: ${formattedName}, ItemName: ${itemName}, Result: ${val}`);
        return val;
    }

	setValue(itemName, value) {
		GM_setValue(`value_${itemName}`, value);
		console.log(`Set value_${itemName} to \u00a3${value.toLocaleString("en-US")}`);
		return value;
	}
    inMarket(url) {
        const itemSelector = document.querySelector("#itemSelector");
        if(itemSelector === null)
            return;
        const options = itemSelector.options;

        let pointPriceLabel = document.querySelector("#pricePerPointsLabel");
        let pointCurrentBest = document.createElement("span");
        pointCurrentBest.id = "pricePerPointsLabelCurrentBest";
        pointCurrentBest.classList.add("text-muted");
        let currentBest = this.getValue(this.pointName);
        pointCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
        pointPriceLabel.innerText += ' ';
        pointPriceLabel.appendChild(pointCurrentBest);

        let pricePerLabel = document.querySelector("#pricePerLabel");
        let priceCurrentBest = document.createElement("span");
        priceCurrentBest.id = "pricePerLabelCurrentBest";
        priceCurrentBest.classList.add("text-muted");
        let itemName = options[0].innerText;
        currentBest = this.getValue(itemName);
        priceCurrentBest.value = itemName;
        priceCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
        pricePerLabel.innerText += ' ';
        pricePerLabel.appendChild(priceCurrentBest);

        itemSelector.addEventListener("change", e => {
            for(var option of options)
                if(option.value === e.target.value) {
                    itemName = option.innerText.trim().replace(/\s+-\s+\d+(?:\.\d+)?%$/, "");
                    currentBest = this.getValue(itemName);
                    priceCurrentBest.value = itemName;
                    priceCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
                    break;
                }
        });

        const container = document.querySelector("nav#itemMarketNav > div.tab-content");
        let before = null;
        let done = [];

        /* const ownOffers = document.querySelector("div.card-body > div.offerListWrapper");
		let ownItems = {};
		let list = ownOffers.children;
		for(var itemNum = 1; itemNum < list.children.length; ++itenNum) {
			const listing = list.children[itemNum];
			const listingName = listing.children[1].children[0].innerText;
			const listingPrice = parseInt(listing.children[2].innerText.slice(1).replaceAll(',', ""));
			if(listingName in ownItems)
				ownItems[listingName] = Math.min(ownItems[listingName], listingPrice);
			else
				ownItems[listingName] = listingPrice;
		} */

        // Function to handle item processing
        function processItems() {
            const offerListWrappers = document.querySelectorAll(".offerListWrapper.mb-3");
            console.log("Number of offerListWrappers found:", offerListWrappers.length);

            offerListWrappers.forEach(wrapper => {
                const itemCards = wrapper.querySelectorAll("div.col-xl-2.col-md-3.col-sm-4.col-6");
                console.log("Number of item cards in wrapper:", itemCards.length);

                itemCards.forEach(card => {
                    try {
                        const itemName = card.querySelector("h5.card-title").innerText.trim();
                        console.log(`Found item: ${itemName}`);  // Debugging log

                        const itemPriceText = card.querySelector("p.card-text.fst-italic").innerText.trim();
                        const itemPrice = parseInt(itemPriceText.slice(1).replaceAll(',', ""));

                        // Format key to match required format
                        const key = `value_${itemName.replace(/\s+/g, '_')}`;

                        // Use GM_getValue to retrieve the current best value
                        const currentBest = GM_getValue(key, null);
                        console.log(`Current stored value for ${itemName}: ${currentBest}`);  // Debugging log

                        if (currentBest !== itemPrice) {
                            console.log(`Updating value for ${itemName} from ${currentBest} to ${itemPrice}`);  // Debugging log
                            GM_setValue(key, itemPrice);  // Store value with formatted key
                            const newStoredValue = GM_getValue(key);
                            console.log(`New stored value for ${itemName}: ${newStoredValue}`);  // Debugging log

                            // Ensure pointName and priceCurrentBest are defined
                            if (typeof pointName !== 'undefined' && itemName === pointName) {
                                pointCurrentBest.innerText = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
                            } else if (priceCurrentBest && priceCurrentBest.value === itemName) {
                                priceCurrentBest.innerText = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
                            }
                        } else {
                            console.log(`No update needed for ${itemName}. Current: £${currentBest}, New: £${itemPrice}`);  // Debugging log
                        }
                    } catch (error) {
                        console.error(`Error processing card: ${error}`);
                    }
                });
            });
        }

        // Observer to watch for changes in the market area and re-run the script
        function observeMarketChanges() {
            const targetNode = document.querySelector("#itemMarketNav");  // Adjust the selector as needed
            if (!targetNode) return;

            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        console.log("Detected new nodes in market area, re-running item processing...");
                        processItems();  // Re-run the script to process newly added items
                    }
                }
            });

            // Observe the target node for changes in children
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Initial run to process any already loaded items
        processItems();

        // Start observing for dynamic changes
        observeMarketChanges();


        // Handle event card updates (unchanged)
        const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
        if (eventCard === null)
            return;

        const eventText = eventCard.innerText.split(" - ")[1];
        const textSplit = eventText.split(' ');

        if (textSplit[1] === "listed") {
            let i = 3;
            let itemName = textSplit[i];
            while (textSplit[++i] !== "for")
                itemName += ` ${textSplit[i]}`;
            const val = parseInt(textSplit[textSplit.length - 1].slice(1).replace(',', ""));
            const curVal = this.getValue(itemName);
            if (curVal === null || val < curVal)
                this.setValue(itemName, val);
        }

    }
	inSupporter(url) {
		let refillText = document.querySelector("div.card-body p.card-text:not(.fw-bold)");
		const pointPrice = this.getValue(this.pointName);
		if(pointPrice !== null)
			refillText.innerHTML = `${refillText.innerText.slice(0, -1)} <span class="text-muted">(\u00a3${(pointPrice * 25).toLocaleString("en-US")})</span>.`;
	}
	inEstateAgent(url) {
		const buildReqs = document.querySelectorAll("div.row.pb-2");

		for(var i = 0; i < buildReqs.length; i += 2) {
			let buildReq = buildReqs[i];
			let matList = buildReq.children[1].children[1];
			let mats = matList.innerHTML.split("<br>");
			let totalCost = 0;
			for(var j = 0; j !== mats.length; ++j) {
				let mat = mats[j];
				const count = parseInt(mat.split(' ')[0].slice(1).replaceAll(',', ""));
				const val = this.getValue(mat.split(' ').slice(1).join(' ').trim());
				mats[j] = `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;
				if(val === null)
					totalCost = "???";
				else if(totalCost !== "???")
					totalCost += count * val;
			}
			matList.innerHTML = mats.join("<br>");
			if(totalCost !== "???") {
				const cash = buildReq.children[2].children[1];
				totalCost += parseInt(cash.innerText.slice(1).replaceAll(',', ""));
			}
			buildReq.innerHTML += `<div class="col-6"><p class="fw-bold mb-0">Total Value:</p><p class="fw-bold text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</p></div>`;
		}

		const buildModal = document.querySelector("div#buildModal");

		observeDOM(buildModal, e => {
			let modal = e[1].target;
			const matList = modal.querySelectorAll("ul li");

			let changed = false;
			let totalCost = 0;
			for(var matDesc of matList) {
				const mat = matDesc.innerText;
				if(matDesc.children.length)
					continue;
				else if(mat[0] === '\u00a3') {
					totalCost += parseInt(mat.slice(1).replaceAll(',', ""));
					continue;
				}
				changed = true;
				const count = parseInt(mat.split(' ')[0].slice(0, -1).replaceAll(',', ""));
				const matName = mat.split(' ').slice(1).join(' ').trim();
				const val = this.getValue(matName === "Concrete" ? "Concrete Bags" : matName);
				matDesc.innerHTML = `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;
				if(val === null)
					totalCost = "???";
				else if(totalCost !== "???")
					totalCost += count * val;
			}
			if(changed)
				modal.innerHTML += `<p class="fw-bold text-center mt-3">Total value: <span class="text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</span></p>`;
		});
	}
	inTownStore(url) {
		const itemLists = document.querySelectorAll("div.container.inventoryWrapper.mb-4");

		for(var il = 0; il !== itemLists.length; ++il) {
			const itemList = itemLists[il];
			for(var i = 1; i !== itemList.children.length; ++i) {
				const item = itemList.children[i];
				if(item.children.length < 2)
					continue;
				let selling = false;
				let itemName = "";
				if(item.children[1].children.length) {
					itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
					selling = true;
				} else
					itemName = item.children[1].innerText;

				const currentBest = this.getValue(itemName);
				if(currentBest !== null) {
					const currentVal = parseInt(item.children[4].innerText.slice(1).replaceAll(',', ""));
					let shopHTML = item.children[4].innerHTML;
					if(currentVal > currentBest)
						shopHTML = `<span class="text-${selling ? "success" : "danger"}">${item.children[4].innerText}</span>`;
					else if(currentVal === currentBest && selling)
						shopHTML = `<span class="text-warning">${item.children[4].innerText}</span>`;
					const marketHTML = `<br><span class="text-muted">(\u00a3${currentBest.toLocaleString("en-US")})</span>`;

					item.children[4].innerHTML = shopHTML + marketHTML;
					let otherValueText = item.children[6].querySelector("div.col-6");
					otherValueText.innerHTML = `<div class="card-text"><div class="fw-bold">Value</div>${shopHTML}${marketHTML}</div>`;
				}
			}
		}
	}
	inTradeView(url) {
		const tradeTabs = document.querySelectorAll("div.card-body:not(.text-center)");
		let totalVal = [ 0, 0 ];

		for(var i = 0; i !== 2; ++i) {
			const itemList = tradeTabs[i + 1].querySelector("div.table-responsive tbody");
			if(itemList !== null) {
				itemList.children[0].innerHTML += "<th>Value</th>";

				const items = itemList.querySelectorAll("tr.align-middle");
				for(var item of items) {
					const itemName = item.children[0].innerText;
					const val = this.getValue(itemName);
					const itemCount = parseInt(item.children[1].innerText.replaceAll(',', ""));
					item.innerHTML += `<td class="text-muted">\u00a3${val === null ? "???" : (val * itemCount).toLocaleString("en-US")}</td>`;
					if(val === null) {
						totalVal[i] = "???";
						break;
					} else
						totalVal[i] += val * itemCount;
				}
				if(totalVal[i] === "???")
					continue;
			}
			const inputs = tradeTabs[i + 1].querySelectorAll("input.form-control");
			const pointVal = this.getValue(this.pointName);
			if(pointVal !== null) {
				totalVal[i] += pointVal * parseInt(inputs[1].value.replaceAll(',', ""));
				totalVal[i] += parseInt(inputs[0].value.replaceAll(',', ""));
			} else {
				totalVal[i] = "???";
				continue;
			}
			const properties = tradeTabs[i + 1].querySelectorAll("div.card.equipmentModule");
			for(var property of properties) {
				const propertyVal = property.querySelector("div.card-text");
				totalVal[i] += parseInt(propertyVal.innerText.slice(1).replaceAll(',', ""));
			}
		}
		if(totalVal[0] === "???" || totalVal[1] === "???")
			for(var i = 0; i !== 2; ++i) {
				let nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
				nameHeader.outerHTML = `<h2 class="row"><div class="col">${nameHeader.innerText}</div><div class="col text-end text-muted">\u00a3${totalVal[i] === "???" ? "???" : totalVal[i].toLocaleString("en-US")}</div></h2>`;
			}
		else {
			let totalValSum = totalVal[0] + totalVal[1];
			for(var i = 0; i !== 2; ++i) {
				let nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
				const colorVal = totalValSum === 0 ? 0.5 : totalVal[1 - i] / totalValSum;
				nameHeader.outerHTML = `<h2 class="row"><div class="col">${nameHeader.innerText}</div><div class="col text-end" style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">\u00a3${totalVal[i].toLocaleString("en-US")}</div></h2>`;
			}
		}
	}
	inAddItems(url) {
		let itemList = document.querySelector("div.container.inventoryWrapper");
		if(itemList === null)
			return;

		let buttonNode = itemList.parentNode.querySelector("div.contentColumn input.btn");
		const buttonHTML = buttonNode.outerHTML;
		let totalContainer = document.createElement("div");
		totalContainer.classList.add("card-body", "mb-4");
		totalContainer.innerHTML = `<p class="card-text">Total item value: <span id="totalValue" class="fw-bold">\u00a30</span>.${buttonHTML}</p>`;
		buttonNode.remove();
		itemList.parentNode.appendChild(totalContainer);
		let totalText = itemList.parentNode.querySelector("span#totalValue");
		let totalVals = {};

		itemList = itemList.children;
		for(var i = 1; i !== itemList.length; ++i) {
			let item = itemList[i];
			if(item.children.length < 2)
				continue;
			const itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
			const currentBest = this.getValue(itemName);

			let value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
			item.children[1].appendChild(value);

			let input = item.querySelector("input.form-control");
			input.addEventListener("input", e => {
				let value = e.target.parentNode.parentNode.querySelector("span.itemValue");
				const currentBest = this.getValue(itemName);
				const inputVal = e.target.value;
				let totalValue = 0;
				if(inputVal === "" || inputVal.trim()[0] === '-' || parseInt(inputVal) === 0) {
					value.classList.remove("fw-bold");
					value.classList.add("text-muted");
					value.style.color = null;
					value.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
					if(currentBest === null)
						return;
					totalVals[currentBest] = 0;
					for(var val in totalVals)
						totalValue += val * totalVals[val];
				} else {
					const count = parseInt(inputVal);
					value.classList.remove("text-muted");
					value.classList.add("fw-bold");
					value.style.color = this.bestColor;
					value.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * count).toLocaleString("en-US")})`;
					if(!currentBest)
						return;
					totalVals[currentBest] = count;
					for(var val in totalVals)
						totalValue += val * totalVals[val];
				}
				totalText.innerText = `\u00a3${totalValue.toLocaleString("en-US")}`;
			});
		}
	}
	inCartelArmory(url) {
		const container = document.querySelector("div.contentColumn > div.col-12");


        if (!container) {
            console.error("Container not found");
            return; // Exit the function early if the container doesn't exist
        }
		const cards = container.querySelectorAll("div.card.mb-4");
		const itemList = container.querySelector("div.container.inventoryWrapper").children;
		let totalVal = 0;
		let haveAll = true;

		for(var i = 2; i !== itemList.length; ++i) {
			let item = itemList[i];
			if(item.children.length < 2)
				continue;
			const itemText = item.children[1];
			const itemName = itemText.innerText.split(' ').slice(0, -1).join(' ');
			const countOf = parseInt(itemText.children[0].innerText.slice(2));
			const currentBest = this.getValue(itemName);

			let value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * countOf).toLocaleString("en-US")})`;
			itemText.appendChild(value);
			if(currentBest === null)
				haveAll = false;
			else
				totalVal += currentBest * countOf;

			if(this.alwaysColorNames.includes(itemName))
				item.children[1].style.color = this.bestColor;
			else if(itemName in this.poundPerEnergy) {
				if(this.poundPerEnergy[itemName] === this.minPpe)
					item.children[1].style.color = this.bestColor;
			} else if(itemName in this.poundPerHospitalTime)
				if(this.poundPerHospitalTime[itemName] === this.minPpht)
					item.children[1].style.color = this.bestColor;
		}
		const pointVal = this.getValue(this.pointName);
		if(pointVal !== null) {
			const pointsText = cards[cards.length - 2].querySelector("div.header-section > h2");
			const pointsTextSplit = pointsText.innerText.split(' ');
			const points = parseInt(pointsTextSplit[pointsTextSplit.length - 1].replaceAll(',', ""));
			totalVal += points * pointVal;
		}

		let totalValCard = document.createElement("div");
		totalValCard.classList.add("mb-4", "card");
		totalValCard.innerHTML = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Armory Value</h2></div></div></div><div class="card-body"><p class="card-text">The value of this armory is ${haveAll ? "" : "at least "}<span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p></div>`;
		container.insertBefore(totalValCard, cards[cards.length - 2]);
	}
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if(![ "All", "Production", "Jobs", "Casino", "Item Sending", "Expedition", "", null ].includes(category))
			return;

		const eventList = document.querySelector("div.container.eventWrapper").children;

		let profit = [];
		let maxProfit = 0;
		let minProfit = Infinity;

		for(var i = 2; i !== eventList.length; ++i) {
			const ev = eventList[i];
			const eventType = ev.children[0].innerText;
			const eventSplit = ev.children[1].innerText.split(' ');

			if(eventType === "Casino") {
				const finalWord = eventSplit[eventSplit.length - 1];
				let spinProfit = "---";
				let haveAll = true;
				if(finalWord === "nothing.")
					spinProfit = 0;
				else if(finalWord.endsWith("000."))
					spinProfit = parseInt(finalWord.slice(1, -1).replaceAll(',', ""));
				else if(finalWord === "Points.") {
					const countOf = parseInt(eventSplit[eventSplit.length - 2]);
					const pointVal = this.getValue(this.pointName);
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = countOf * pointVal;
				} else if(finalWord === "Pack.") {
					const pointVal = this.getValue("Supporter Pack");
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = pointVal;
				} else if(finalWord === "Favour.") {
					const pointVal = this.getValue("Personal Favour");
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = pointVal;
				}
				profit.push(haveAll ? spinProfit : "???");
				if(haveAll && spinProfit !== "---") {
					maxProfit = Math.max(maxProfit, spinProfit);
					minProfit = Math.min(minProfit, spinProfit);
				}
				continue;
			} else if(eventType === "Item Sending") {
				let itemsVal = "???";
				let j = eventSplit.length - 1;
				let accumulate = eventSplit[j].replace(/('s)?\.$/, "");
				while(!/\d$/.test(eventSplit[--j]))
					accumulate = `${eventSplit[j]} ${accumulate}`;
				const val = this.getValue(accumulate);
				const countOf = parseInt(eventSplit[j].slice(1).replaceAll(',', ""));
				if(val !== null)
					itemsVal = countOf * val;
				profit.push(itemsVal);
				continue;
			}

			if(![ "Production", "Jobs", "Expedition" ].includes(eventType) || eventSplit[0] === "Prestiged" || eventSplit[0] === "More" || eventSplit[1] === "were" || eventSplit[1] === "failed" || eventSplit[2] === "failed") {
				profit.push("---");
				continue;
			}
			let haveAll = true;
			let totalVal = 0;
			let countOf = 0;
			for(var j = 0; j < eventSplit.length; ++j) {
				const word = eventSplit[j];
				if(word.startsWith('\u00a3'))
					totalVal += parseInt(word.slice(1).replaceAll(',', ""));
				else if(eventType === "Expedition" ? word.endsWith('x') : word.startsWith('x')) {
					countOf = parseInt((eventType === "Expedition" ? word.slice(0, -1) : word.slice(1)).replaceAll(',', ""));
					let accumulate = eventSplit[++j];
					while(++j < eventSplit.length && !accumulate.endsWith(',') && !accumulate.endsWith('.') && !accumulate.endsWith(" and"))
						accumulate += ` ${eventSplit[j]}`;
					--j;
					if(accumulate.endsWith(',') || accumulate.endsWith('.'))
						accumulate = accumulate.slice(0, -1);
					else if(accumulate.endsWith(" and"))
						accumulate = accumulate.slice(0, -4);
					const val = this.getValue(accumulate);
					if(val === null) {
						haveAll = false;
						break;
					} else
						totalVal += countOf * val;
				}
			}
			profit.push(haveAll ? totalVal : "???");
			if(haveAll) {
				maxProfit = Math.max(maxProfit, totalVal);
				minProfit = Math.min(minProfit, totalVal);
			}
		}
		for(var i = 1; i !== eventList.length; ++i) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-3 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-6 col-sm-7"; //"col-6 col-lg-7 col-md-6 col-sm-7";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";
			let valueCol = document.createElement("div");
			let mergedCol = document.createElement("div");
			valueCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-1 col-lg-1 col-md-1 col-sm-1";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new

			if(i === 1) {
				valueCol.innerText = "Value";
				mergedCol.innerText = "Date/Value";
				ev.insertBefore(valueCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			const prof = profit[i - 2];
			if(prof === "---") {
				mergedCol.innerHTML = ev.children[2].innerHTML;
				ev.insertBefore(valueCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			} else if(prof === "???")
				valueCol.innerHTML = `<span class="text-muted">\u00a3???</span>`;
			else if([ "Production", "Jobs", "Casino", "Expedition" ].includes(category)) {
				const colorVal = (prof - minProfit) / (maxProfit - minProfit);
				valueCol.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">\u00a3${prof.toLocaleString("en-US")}</span>`;
			} else
				valueCol.innerHTML = `<span class="text-muted">\u00a3${prof.toLocaleString("en-US")}</span>`;

			mergedCol.innerHTML = `${ev.children[2].innerHTML}<br>${valueCol.innerHTML}`;
			ev.insertBefore(valueCol, ev.children[2]);
			ev.appendChild(mergedCol);
		}
    }
    inProduction() {
        // Get all production containers
        const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
        if (containers.length === 0) {
            console.warn("No production containers found!");
            return;
        }

        console.log("Found", containers.length, "production containers.");

        const cokeVal = this.getValue("Cocaine");
        let assigned = [];
        let profit = [];
        let maxProfit = -Infinity;
        let minProfit = Infinity;
        for(let i = 0; i !== containers.length; ++i) {
            profit[i] = calcProfit.call(this, i, containers[i]);
            if(profit[i] === null) continue;
            maxProfit = Math.max(maxProfit, profit[i]);
            minProfit = Math.min(minProfit, profit[i]);
        }

        for(let i=0; i !== containers.length; ++i) {
            let container = containers[i];
            let expectedProfit = document.createElement("p");
            expectedProfit.classList.add("card-text", "text-center");
            if(profit[i] !== null) {
                const colorVal = (profit[i] - minProfit) / (maxProfit - minProfit);
                expectedProfit.innerHTML = `Profit: <span class="fw-bold" style="color: hsl(${profit[i] >= 0 ? colorVal * 120 : 0}, 67%, ${this.brightness}%)">\u00a3${Math.floor(profit[i]).toLocaleString("en-US")}/narco</span>`;
            } else
                expectedProfit.innerHTML = `Profit: <span class="text-muted">\u00a3???/narco</span>`;
            container.insertBefore(expectedProfit, container.querySelectorAll("hr")[1]);

            let narcoInput = containers[i].querySelector("input.assignNarcoInput");
            assigned[i] = parseInt(narcoInput.value.replaceAll(',', ""));
            narcoInput.id = `inputNum${i}`;
            narcoInput.addEventListener("input", assignedNarcosChange.bind(this));
        }

        // Calculate Expected Daily Profit
        const prodHeader = document.querySelector("#mainBackground > div > div > div.col-12 > div.productionsContainer.rounded > div.row.mb-0");
        let dailyProfit = calcDailyProfit(profit, assigned, containers);

        const flexContainer = constructProdHeader.call(this, dailyProfit, cokeVal);

        // Insert the flex container at the top of the target section
        prodHeader.parentNode.insertBefore(flexContainer, prodHeader);

        for (let i = 2; i < containers.length; i++) { // Start from index 2 to skip the first two
            let container = containers[i];

            // Get the "Narcos Assigned" input field
            let narcoInput = container.querySelector("input.assignNarcoInput");
            if (!narcoInput) {
                console.warn(`No narco input found for container ${i}`);
                continue;
            }

            // Get production ID if needed
            let productionIdElement = container.querySelector(".productionId");
            let productionId = productionIdElement ? productionIdElement.innerText.trim() : "Unknown";

            // Get supply items
            let requiredElement = container.querySelector("p.card-text.text-center.mb-0");
            let ownedElement = container.querySelector("p.card-text.text-center.fst-italic");

            let requiredText = requiredElement ? requiredElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only
            let ownedText = ownedElement ? ownedElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only

            let required = parseInt(requiredText);
            let owned = parseInt(ownedText);

            // Log extracted values
            console.log(`Production ID: ${productionId}`);
            console.log(`Required: ${requiredText}`);
            console.log(`Owned: ${ownedText}`);
            console.log(`Assigned Narcos: ${narcoInput.value}`);

            // Calculate days left
            let daysLeftElement = document.createElement("p");
            daysLeftElement.classList.add("card-text", "text-center");

            if (!isNaN(required) && !isNaN(owned) && required > 0) {
                let daysLeft = Math.floor(owned / required);

                let colorClass = "text-success"; // Default to green
                if (daysLeft <= 3) {
                    colorClass = "text-danger"; // Red for 0-3 days
                } else if (daysLeft <= 10) {
                    colorClass = "text-warning"; // Orange for 4-10 days
                }

                daysLeftElement.innerHTML = `Days Left: <span class="fw-bold ${colorClass}">${daysLeft}</span>`;
            } else {
                daysLeftElement.innerHTML = `Days Left: <span class="fw-bold text-muted">N/A</span>`;
            }

            // Append days left under supply items
            if (requiredElement) {
                requiredElement.parentElement.insertBefore(daysLeftElement, requiredElement.nextSibling);
            }
        }

        function calcProfit(id, container){
            let narcoInput = container.querySelector("input.assignNarcoInput");
            assigned[id] = parseInt(narcoInput.value.replaceAll(',', ""));
            if(assigned[id] === 0) return 0;

            let profit = this.prodMoney[id];
            const itemProfit = calcItemProfits.call(this, id);
            if(itemProfit === null) return null;
            profit += itemProfit;

            let prodCount = getProdCount(container);

            profit *= calcProfitScalar.call(this, id, prodCount);

            const supplyCost = calcSupplyCost.call(this, id, prodCount, container);
            if(supplyCost === null) return null;
            profit -= supplyCost;

            profit *= this.prodProfitFactor;
            if(id === 0)
                profit *= this.streetProfitFactor;
            profit /= this.narcoCounts[id] * (id === 4 ? prodCount : 1); // Also dealing with coke custom scaling
            return profit;
        }

        function getProdCount(container){
            const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
            if(prodCountText.length === 0) return 1;
            return parseInt(prodCountText[1].innerText) || 1;
        }

        function calcProfitScalar(id, prodCount){
            if(id === 4)
                return this.prodCokeScaling[prodCount - 1]; // Coke has custom scaling
            else
                return Math.pow(1 - this.prodDepreciation / 100, prodCount - 1); // Maybe should instead be *= (1 - prodCount * this.prodDepreciation / 100)
        }

        function calcItemProfits(id){
            let itemProfit = 0;
            for(const itemName of Object.keys(this.itemCounts[id])) {
                const itemVal = this.getValue(itemName);
                if(itemVal === null) return null;
                itemProfit += itemVal * this.itemCounts[id][itemName];
            }
            return itemProfit;
        }

        function calcSupplyCost(id, prodCount, container){
            const prodReqsText = container.querySelector("p.card-text.text-center.mb-0");
            const prodReqs = prodReqsText.innerText.split(' ').filter(w => w.startsWith('x'));
            let supplyCost = 0;
            let j = 0;
            for(let itemName of Object.keys(this.prodReqs[id])) {
                const itemVal = this.getValue(itemName);
                if(itemVal === null) return null;
                supplyCost += itemVal * parseInt(prodReqs[j].slice(1).replaceAll(',', "")) / (id === 4 ? 1 : prodCount);
                ++j;
            }
            return supplyCost;
        }

        function assignedNarcosChange(e){
            assigned[parseInt(e.target.id.slice(8))] = parseInt(e.target.value.replaceAll(',', ""));
            let dailyProfitText = document.querySelector("span#dailyProfit");
            let dailyProfitCokeText = document.querySelector("span#dailyProfitMinusCoke");
            let dailyProfit = calcDailyProfit(profit, assigned, containers);

            dailyProfitText.innerText = `\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}`;
            if(dailyProfit === null) return;
            adjustColors(dailyProfitText, dailyProfit);

            const dailyProfitCoke = dailyProfit - this.maxCokeDaily * cokeVal;
            dailyProfitCokeText.innerText = `\u00a3${cokeVal === null ? "???" : Math.round(dailyProfitCoke).toLocaleString("en-US")}`;
            if(cokeVal === null) return;
            adjustColors(dailyProfitCokeText, dailyProfitCoke);
        }

        function calcDailyProfit(profit, assigned, containers){
            let dailyProfit = 0;
            for(var j = 0; j !== containers.length; ++j) {
                if(profit[j] === null && assigned[j]) {
                    return null;
                }
                dailyProfit += profit[j] * assigned[j];
            }
            return dailyProfit;
        }


        function adjustColors(elem, value){
            elem.classList.remove("text-danger", "text-warning", "text-success");
            const className = value > 0 ? "text-success" : value < 0 ? "text-danger" : "text-warning";
            elem.classList.add(className);
        }

        function constructProdHeader(dailyProfit, cokeVal){
            // Create Expected Daily Profit card
            let expectedProfit = document.createElement("div");
            expectedProfit.classList.add("mb-4", "card");
            expectedProfit.innerHTML = `<div class="header-section"><h2>Expected Daily Profit</h2></div><div class="card-body"><p class="card-text text-center">Each day your narcos will produce roughly <span id="dailyProfit" class="fw-bold ${dailyProfit === null ? "text-muted" : dailyProfit > 0 ? "text-success" : dailyProfit < 0 ? "text-danger" : "text-warning"}">\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}</span> in profit.<br>If you take ${this.maxCokeDaily} cocaine daily, your net profit is <span id="dailyProfitMinusCoke" class="fw-bold ${cokeVal === null || dailyProfit === null ? "text-muted" : dailyProfit - this.maxCokeDaily * cokeVal > 0 ? "text-success" : dailyProfit - this.maxCokeDaily * cokeVal < 0 ? "text-danger" : "text-warning"}">\u00a3${cokeVal === null || dailyProfit === null ? "???" : Math.round(dailyProfit - this.maxCokeDaily * cokeVal).toLocaleString("en-US")}</span> per day.</p></div>`;

            // Create Buy Production card
            let linkCard = document.createElement("div");
            linkCard.classList.add("mb-4", "card");
            linkCard.innerHTML = `<div class="header-section"><h2>Buy Production</h2></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Production">Item Market</a> to buy production.</p><p></p></div>`;

            // Create a flex container to hold both cards
            let flexContainer = document.createElement("div");
            flexContainer.classList.add("d-flex", "align-items-stretch", "mb-4");
            flexContainer.style.justifyContent = "space-between";

            // Wrap each card with a flex item that can grow
            let leftFlexItem = document.createElement("div");
            leftFlexItem.classList.add("flex-grow-1", "me-2");
            leftFlexItem.appendChild(linkCard);

            let rightFlexItem = document.createElement("div");
            rightFlexItem.classList.add("flex-grow-1", "ms-2");
            rightFlexItem.appendChild(expectedProfit);

            // Add both flex items to the container
            flexContainer.appendChild(leftFlexItem);
            flexContainer.appendChild(rightFlexItem);
            return flexContainer;
        }
    }

	inJobs(url) {
		const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
		const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
		if(jobPanels === null || buttons.length <= 1)
			return;

		this.jobTimes = [];
		this.maxJobRep = 0;
		this.minJobRep = Infinity;
		this.jobValue = [];
		this.maxJobValue = 0;
		this.minJobValue = Infinity;
		for(var i = 0; i !== this.jobMoney.length; ++i) {
			const jobPanel = jobPanels[i];
			const jobTime = jobPanel.querySelector("p.card-text.fw-bold.text-muted");
			const jobTimeSplit = jobTime.innerText.split(' ');
			this.jobTimes[i] = parseFloat(jobTimeSplit[0].slice(1));
			if(jobTimeSplit[1].startsWith("hour")) {
				this.jobTimes[i] *= 60;
				if(jobTimeSplit.length > 2)
					this.jobTimes[i] += parseFloat(jobTimeSplit[2]);
			}

			this.jobValue[i] = this.jobMoney[i];
			for(var item in this.jobItems[i]) {
				const price = this.getValue(item);
				if(price !== null)
					this.jobValue[i] += price * this.jobItems[i][item];
				else {
					this.jobValue[i] = "???";
					break;
				}
			}
			if(this.jobValue[i] !== "???") {
				const prestigeText = jobPanel.querySelector("p.prestigeText");
				const incrReward = prestigeText !== null && /\+\d+%/.test(prestigeText.innerText) ? parseInt(prestigeText.innerText.match(/\+\d+%/)[0].slice(1, -1)) : 0;
				this.jobValue[i] *= 1 + incrReward / 100;

				this.jobValue[i] *= this.jobProfitFactor;
				this.jobValue[i] /= this.jobTimes[i];
				this.maxJobValue = Math.max(this.maxJobValue, this.jobValue[i]);
				this.minJobValue = Math.min(this.minJobValue, this.jobValue[i]);
			}
			this.maxJobRep = Math.max(this.maxJobRep, this.jobRep[i] / this.jobTimes[i]);
			this.minJobRep = Math.min(this.minJobRep, this.jobRep[i] / this.jobTimes[i]);
		}

		for(var i = 0; i !== this.jobValue.length; ++i) {
			let jobPanel = jobPanels[i];
			let append = `<hr class="mt-4 w-75"><p class="text-center">`;
			const gain = this.jobValue[i];
			const repPerTime = this.jobRep[i] / this.jobTimes[i];
			append += gain === "???"
				? `Expected gain: <span class="text-muted">\u00a3???/h</span>`
				: `Expected gain: <span class="fw-bold" style="color: hsl(${(gain - this.minJobValue) / (this.maxJobValue - this.minJobValue) * 120}, 67%, ${this.brightness}%)">\u00a3${Math.round(gain * 60).toLocaleString("en-US")}/h</span>`;
			append += `<br>Expected rep: <span class="fw-bold" style="color: hsl(${(repPerTime - this.minJobRep) / (this.maxJobRep - this.minJobRep) * 120}, 67%, ${this.brightness}%)">${(repPerTime * 60).toLocaleString("en-US")}/h</span>`;
			append += "</p>";
			jobPanel.innerHTML += append;
		}
	}
	/*
	inJail(url) {
		let bribeText = document.querySelector("div.card.mb-4 p.card-text.fw-bold:not(.text-success)");
		if(bribeText === null || !bribeText.innerText.startsWith("I'm willing to release you but it's going to cost you."))
			return;
		const PFvalue = this.getValue("Personal Favour");
		if(PFvalue === null)
			return;
		const textSplit = bribeText.innerText.split(' ');
		const bribe = parseInt(textSplit[textSplit.length - 1].slice(2, -1).replaceAll(',', ""));
		if(bribe > PFvalue)
			bribeText.innerHTML += `<br><span class="text-warning">You can get out of jail cheaper using a <a class="text-warning" href="/Inventory">Personal Favour</a>.</span>`;
	}
	*/
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper.pt-2");
		const header = itemList.querySelector("div.row.row-cols-3.row-header");
		let totalVal = 0;
		let haveAll = true;

		for(var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if(item.children.length < 7)
				continue;
			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');

			if(this.alwaysColorNames.includes(itemName))
				item.children[1].style.color = this.bestColor;

			const countOf = parseInt(nameSplit[nameSplit.length - 1].slice(1).replaceAll(',', ""));
			const currentBest = this.getValue(itemName);
			if(currentBest !== null) {
				let val = null;
				let colorVal = null;
				let append = null;
				if(itemName in this.poundPerEnergy) {
					val = this.poundPerEnergy[itemName];
					colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
					append = 'E';
					if(val === this.minPpe)
						item.children[1].style.color = this.bestColor;
				} else if(itemName in this.poundPerHospitalTime) {
					val = this.poundPerHospitalTime[itemName];
					colorVal = (1 - (val - this.minPpht) / (this.maxPpht - this.minPpht)) * 120;
					append = "min";
					if(val === this.minPpht)
						item.children[1].style.color = this.bestColor;
				}

				const valueTexts = [ item.children[3], item.children[6].querySelectorAll("div.card-text > div.card-text")[2] ];
				for(var valueText of valueTexts) {
					valueText.innerHTML = this.strikethrough ? `<del>${valueText.innerText}</del><br><span class="fw-bold">` : "<span>";
					valueText.innerHTML += `\u00a3${currentBest.toLocaleString("en-US")}</span>`;
					if(val !== null)
						valueText.innerHTML += ` <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/${append})</span>`;
				}
				totalVal += currentBest * countOf;
			} else {
				totalVal += parseInt(item.children[3].innerText.slice(1).replaceAll(',', "")) * countOf;
				haveAll = false;
			}
		}

		let totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The value of these items is ${haveAll ? "" : "roughly "}<span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		itemList.insertBefore(totalValCard, header);
	}
    inGym(url) { // Run after addItemButtons
        const item = document.getElementById(`item-${GM_getValue("itemID_Coke")}`);
        if(item === null)
            return;
        const val = this.poundPerEnergy["Cocaine"];
        const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
        const valueTexts = [ item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2] ];
        for(var valueText of valueTexts)
            if(valueText !== undefined && valueText !== null)
                valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/E)</span>`;
}
    inUniversity(url) { // Run after addItemButtons
        const item = document.getElementById(`item-${GM_getValue("itemID_Coke")}`);
        if(item === null)
            return;
        const val = this.poundPerEnergy["Cocaine"];
        const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
        const valueTexts = [ item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2] ];
        for(var valueText of valueTexts)
            if(valueText !== undefined && valueText !== null)
                valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/E)</span>`;
}
}


class BetterMoneyInputs {
	constructor() {}
	_changeAutonumeric(input) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		elem.update({
			decimalPlaces: 3,
			decimalPlacesRawValue: 0,
			decimalPlacesShownOnBlur: 0,
			allowDecimalPadding: false,
			alwaysAllowDecimalCharacter: true
		});
	}
	changeAutonumeric(input) {
		if(AutoNumeric.isManagedByAutoNumeric(input))
			this._changeAutonumeric(input);
		else
			input.addEventListener("autoNumeric:initialized", () => this._changeAutonumeric(input));
	}
	_listener(e, input, max) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		const curVal = parseFloat(elem.get().replaceAll(',', ""));
		if(e.ctrlKey)
			return;
		if(e.key === 'k')
			elem.set(Math.min(max, Math.floor(curVal * 1000)));
		else if(e.key === 'm')
			elem.set(Math.min(max, Math.floor(curVal * 1000000)));
		else if(e.key === 'b')
			elem.set(Math.min(max, Math.floor(curVal * 1000000000)));
		else if(e.key === 'a')
			elem.set(max);
		else if(e.key === 'h')
			elem.set(Math.floor(max / 2));
	}
	listener(e, input) {
		const max = parseInt(input.max.replaceAll(',', ""));
		if(AutoNumeric.isManagedByAutoNumeric(input))
			this._listener(e, input, max);
		else
			input.addEventListener("autoNumeric:initialized", () => this._listener(e, input, max));
	}
	update(input) {
		this.changeAutonumeric(input);
		input.addEventListener("keydown", e => this.listener(e, input));
	}
	inBank(url) {
		let depositInput = document.querySelector("input#depositInput");
		let withdrawInput = document.querySelector("input#withdrawInput");
		if(depositInput === null)
			return;
		this.update(depositInput);
		this.update(withdrawInput);
	}
	inCartelArmory(url) {
		let pointsDeposit = document.querySelector("input#pointsdepositquantity");
		if(pointsDeposit === null)
			return;
		this.update(pointsDeposit);
	}
	inTradeView(url) {
		let cashInput = document.querySelector("input#cashModifier");
		let pointsInput = document.querySelector("input#pointsModifier");
		if(cashInput === null || cashInput.disabled)
			return;
		this.update(cashInput);
		this.update(pointsInput);
	}
	inMarket(url) {
		let pricePer = document.querySelector("input#priceper");
		let pointsPricePer = document.querySelector("input#pointspriceper");
		let qty = document.querySelector("input#quantity");
		let pointsQty = document.querySelector("input#pointsquantity");
		if(pricePer === null)
			return;
		this.update(pricePer);
		this.update(pointsPricePer);
		this.update(qty);
		this.update(pointsQty);

		pointsPricePer.min = 0; // Make it like pricePer
		if(AutoNumeric.isManagedByAutoNumeric(pointsPricePer)) {
			let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
			elem.update({ minimumValue: 0 });
		} else
			pointsPricePer.addEventListener("autoNumeric:initialized", () => {
				let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
				elem.update({ minimumValue: 0 });
			});
	}
	inUserProfile(url) {
		let sendCash = document.querySelector("input#sendCashInput");
		if(sendCash === null)
			return;
		this.update(sendCash);
	}
}


class BetterProgressBars {
    constructor() {
        this.healthColor = `hsl(230, 75%, 60%)`;
        this.setReloadInterval();
    }

    setReloadInterval() {
        // Get the current time in UTC
        const now = new Date();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();

        // Calculate the minutes remaining until the next 5-minute interval
        const nextInterval = 500 - (minutes % 500);
        const timeToNextInterval = (nextInterval * 60 - seconds) * 1000;

        // Set a timeout to reload the page at the next 5-minute interval
        setTimeout(() => {
            window.location.reload();
        }, timeToNextInterval);
    }

    inExpeditions(url) {
        const bars = document.querySelectorAll(".progress-bar-striped");
        for (var bar of bars) {
            bar.classList.remove("bg-success");
        }
    }

    inJobs(url) {
        const bars = document.querySelectorAll("div.equipmentModule .progress-bar");
        for (var bar of bars) {
            const val = parseFloat(bar.getAttribute("aria-valuenow"));
            bar.classList.remove("bg-success");
            bar.classList.add("progress-bar-striped");
            bar.style.backgroundColor = `hsl(${val / 100 * 120}, 67%, 30%)`;
        }
        const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
        if (buttons.length === 1) {
            let bar = buttons[0].parentNode.parentNode.querySelector(".progress-bar");
            bar.classList.add("progress-bar-animated");
        }
    }

    inBarPage(url) {
        const bars = document.querySelectorAll(".progress-bar.bg-dark");
        for (var bar of bars) {
            bar.classList.remove("bg-dark");
            bar.classList.add("fs-6");
        }
    }

    inAnywhere() {
        const healthTimer = document.getElementById("lifeCountdown");
        const energyTimer = document.getElementById("energyCountdown");

        let healthBar = document.getElementById("lifeProgress");
        healthBar.classList.add("progress-bar-striped");
        let energyBar = document.getElementById("energyProgress");
        energyBar.classList.add("progress-bar-striped");

        observeDOM(healthTimer, e => {
            const text = e[0].addedNodes[0];
            if (text === "")
                healthBar.classList.remove("progress-bar-animated");
            else
                healthBar.classList.add("progress-bar-animated");
        });

        observeDOM(energyTimer, e => {
            const text = e[0].addedNodes[0];
            if (text === "")
                energyBar.classList.remove("progress-bar-animated");
            else
                energyBar.classList.add("progress-bar-animated");
        });

        const energyPercent = parseFloat(energyBar.style.width.slice(0, -1));
        const energyColor = Math.min(15, 150 / (109 - energyPercent));
        GM_addStyle(`#lifeProgress { background-color: ${this.healthColor} !important }`);
        GM_addStyle(`#energyProgress { background-color: hsl(${50 - energyColor}, 100%, 51.37%) !important }`);
    }
}


class BlackjackHelper {
	constructor() {
		this.statsRegex = /^casino\/blackjackstats(\/|\/?\?.+)?/;
		this.id = "totalProfit";
		this.statsLink = "/Casino/blackjackStats";
		if(this.getStats() === null)
			this.setStats([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
		if([ null, NaN ].includes(this.getMoneyStat("Profit")))
			this.setMoneyStat("Profit", 0);
		if([ null, NaN ].includes(this.getMoneyStat("Gain")))
			this.setMoneyStat("Gain", 0);
		if([ null, NaN ].includes(this.getMoneyStat("Loss")))
			this.setMoneyStat("Loss", 0);
		this.statIndexes = [ "Blackjack", "Win", "Lose", "Bust", "Surrendered", "Push", "Times split", "Times doubled" ];
		this.cardVals = [ '2', '3', '4', '5', '6', '7', '8', '9', 'K', 'A' ];
		// https://www.beatingbonuses.com/bjstrategy.php?decks2=4&h17=stand&doubleon2=any2cards&peek2=off&surrender2=earlyf&charlie2=no&dsa2=on&resplits2=0&shuffle=0&bj=3to2&opt2=1&btn2=Generate+Strategy
 		this.houseOdds = -0.17; // percent
		this.blackjackBroken = true; // 1.5x payout instead of push when both get blackjack
		//if(this.blackjackBroken)
			//this.houseOdds -= 100 * 1.5 * 4 * ((4*16) *(4*16-1) * (4*4) * (4*4-1)) / (208 * 207 * 206 * 205);
		this.normalTable = [ // First row is 5-7, last row is 18+
			"HHHHHHHHHR",
			"HHHHHHHHHH",
			"HDDDDHHHHH",
			"DDDDDDDDHH",
			"DDDDDDDDHH",
			"HHSSSHHHHR",
			"SSSSSHHHHR",
			"SSSSSHHHRR",
			"SSSSSHHHRR",
			"SSSSSHHRQR",
			"SSSSSSSSSQ",
			"SSSSSSSSSS"
		];
		this.softTable = [
			"HHHDDHHHHH",
			"HHHDDHHHHH",
			"HHDDDHHHHH",
			"HHDDDHHHHH",
			"HDDDDHHHHH",
			"SEEEESSHHH",
			"SSSSSSSSSS",
			"SSSSSSSSSS",
			"SSSSSSSSSS" // Custom
		];
		this.splitTable = [
			"HHPPPPHHHH",
			"HHPPPPHHHR",
			"HHHHHHHHHH",
			"DDDDDDDDHH",
			"HPPPPHHHHR",
			"PPPPPPHHRR",
			"PPPPPPPPQR",
			"PPPPPSPPSS",
			"SSSSSSSSSS",
			"PPPPPPPPPP"
		];
	}
	getMoneyStat(stat) {
		const money = GM_getValue(`blackjack_${stat}`);
		return money === undefined ? null : money;
	}
	setMoneyStat(stat, money) {
		GM_setValue(`blackjack_${stat}`, money);
		console.log(`Set blackjack_${stat} to \u00a3${money.toLocaleString("en-US")}`);
		return money;
	}
	getStats() {
		const stats = GM_getValue("blackjack_Stats");
		return stats === undefined ? null : stats;
	}
	setStats(stats) {
		GM_setValue("blackjack_Stats", stats);
		console.log(`Set blackjack_${stats} to ${JSON.stringify(stats)}`);
		return stats;
	}
	addProfit(val) {
		const setTo = this.getMoneyStat("Profit") + val;
		if(isNaN(setTo)) // Not sure why this is happening
			return;
		this.setMoneyStat("Profit", setTo);
		if(val > 0) {
			this.setMoneyStat("Gain", this.getMoneyStat("Gain") + val);
		} else
			this.setMoneyStat("Loss", this.getMoneyStat("Loss") - val);

		let profitText = document.querySelector(`span#${this.id}`);
		profitText.innerText = `\u00a3${setTo.toLocaleString("en-US")}`;
		if(setTo > 0) {
			profitText.classList.remove("text-warning", "text-danger");
			profitText.classList.add("text-success");
		} else if(setTo < 0) {
			profitText.classList.remove("text-warning", "text-success");
			profitText.classList.add("text-danger");
		} else {
			profitText.classList.remove("text-success", "text-danger");
			profitText.classList.add("text-warning");
		}
	}
	addStat(gameType) {
		if(!this.statIndexes.includes(gameType))
			return;
		let curStats = this.getStats();
		curStats[this.statIndexes.indexOf(gameType)] += 1;
		this.setStats(curStats);
	}
	inBlackjack(url) {
		GM_addStyle(".click-this { background-color: #0d6efd !important; border: var(--bs-btn-border-width) solid #0d6efd !important }");

		const container = document.querySelector("#mainBackground > div > div > div.col-12");
		let ellen = container.querySelector("div.card.mb-3");
		if(ellen === null)
			return;
		ellen.classList.remove("mb-3");
		ellen.outerHTML = `<div class="row"><div class="col-xl-9 col-12 mb-4">${ellen.outerHTML}</div><div class="col-xl-3 col-12 mb-4"><div class="card h-100"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Profit</h2></div></div></div><div class="card-body"><p class="card-text text-center">Total running profit: <span id="${this.id}" class="fw-bold text-warning">\u00a3???</span>.</p><p class="card-text text-center"><span class="fs-2 text-${this.houseOdds > 0 ? "danger" : this.houseOdds < 0 ? "success" : "warning"}">${this.houseOdds.toFixed(2)}%</span> house odds</p></div></div></div></div>`;
		this.addProfit(0);

		let statsLink = document.createElement("a");
		statsLink.href = this.statsLink;
		statsLink.innerHTML = `<button class="btn btn-sm btn-dark">Stats</button>`;
		const linkContainer = container.querySelector("div.gap-2.flex-wrap");
		const rulesLink = linkContainer.querySelector("a");
		linkContainer.insertBefore(statsLink, rulesLink);

		const dealButton = container.querySelector("button#deal");
		const betAmountInput = container.querySelector("input#betAmountInput");
		let hitButton = container.querySelector("button#hit");
		if(hitButton === null)
			return;
		let standButton = container.querySelector("button#stand");
		let doubleButton = container.querySelector("button#double");
		let splitButton = container.querySelector("button#split");
		let surrenderButton = container.querySelector("button#surrender");
		const result = container.querySelector("div#result");
		const bjGame = container.querySelector("div#blackjackGame");
		const dealerCards = bjGame.querySelector("div#dealerCards");
		const playerCards = bjGame.querySelector("div#playerCards");

		const removeHighlights = () => {
			for(var button of [ hitButton, standButton, doubleButton, splitButton, surrenderButton ])
				button.classList.remove("click-this");
		};

		observeDOM(bjGame, () => {
			removeHighlights();
			const dealerCardText = dealerCards.innerText.replace(/10|J|Q/g, "K");
			if(dealerCardText.length !== 1)
				return;
			const dealerVal = this.cardVals.indexOf(dealerCardText) + 2;
			let playerCardText = playerCards.innerText.replace(/\s+/g, '').replace(/10|J|Q/g, "K");
			if(playerCardText.length < 2)
				return;
			let playerVal = 0;
			for(var l of playerCardText)
				playerVal += this.cardVals.indexOf(l) + 2;

			let move = "";
			if(playerCardText.length === 2) {
				if(playerCardText[0] === playerCardText[1]) {
					if(!splitButton.disabled)
						move = this.splitTable[playerVal / 2 - 2][dealerVal - 2];
				} else if(playerCardText[0] === 'A' || playerCardText[1] === 'A') {
					if(playerVal === 21) {
						if(!standButton.disabled)
							move = 'S';
					} else
						move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
				}
			}
			if(move === "" && playerCardText.includes('A') && playerVal <= 21)
				move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
			if(move === "") {
				while(playerCardText.includes('A') && playerVal > 21) {
					playerVal -= 10;
					playerCardText.replace('A', 'a');
				}
				playerCardText.replaceAll('a', 'A');
				move = this.normalTable[Math.min(11, Math.max(0, playerVal - 7))][dealerVal - 2];
			}

			const hl = button => button.classList.add("click-this");
			if(move === 'H')
				hl(hitButton);
			else if(move === 'J')
				hl(playerCardText.length === 2 ? hitButton : standButton);
			else if(move === 'S')
				hl(standButton);
			else if(move === 'D')
				hl(doubleButton.disabled ? hitButton : doubleButton);
			else if(move === 'E')
				hl(doubleButton.disabled ? standButton : doubleButton);
			else if(move === 'P')
				hl(splitButton);
			else if(move === 'R')
				hl(surrenderButton.disabled ? hitButton : surrenderButton);
			else if(move === 'Q')
				hl(surrenderButton.disabled ? standButton : surrenderButton);
		});

		let doubled = false;
		const applyBet = () => {
			const betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			this.addProfit(-betAmount);
		};
		doubleButton.addEventListener("click", () => {
			doubled = true;
			applyBet();
			this.addStat("Times doubled");
		});
		splitButton.addEventListener("click", () => {
			applyBet();
			this.addStat("Times split");
		});
		dealButton.addEventListener("click", applyBet.bind(this));
		observeDOM(result, e => {
			const val = e[0].target.innerText;
			if(val === "")
				return;
			let betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			if(doubled)
				betAmount *= 2;
			if(val.startsWith("Win") || val.startsWith("Blackjack")) {
				e[0].target.classList.add("text-success");
				e[0].target.classList.remove("text-warning", "text-danger");
				const textSplit = val.split(' ');
				const won = parseInt(textSplit[textSplit.length - 1].slice(1).replaceAll(',', ""));
				this.addProfit(betAmount + won);
			} else if(val === "Push") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(betAmount);
			} else if(val === "Surrendered") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(Math.floor(betAmount / 2));
			} else {
				e[0].target.classList.add("text-danger");
				e[0].target.classList.remove("text-warning", "text-success");
			}
			doubled = false;
			this.addStat(val.split(' ')[0].replace('!', ""));
		});
	}
	inBlackjackStats(url) {
		document.title = "Blackjack Stats | Cartel Empire";
		let container = document.querySelector("div.content-container.contentColumn");
		let insertHTML = "";

		const urlParams = new URLSearchParams(window.location.search);
		const reset = urlParams.get("resetMoney");
		if(reset === "true") {
			this.setMoneyStat("Profit", 0);
			this.setMoneyStat("Gain", 0);
			this.setMoneyStat("Loss", 0);
			window.history.replaceState({}, document.title, this.statsLink); // remove params from URL
		}

		let colorClass = "text-warning";
		const curProfit = this.getMoneyStat("Profit");
		const curGain = this.getMoneyStat("Gain");
		const curLoss = this.getMoneyStat("Loss");
		if(curProfit) {
			if(curProfit > 0)
				colorClass = "text-success";
			else if(curProfit < 0)
				colorClass = "text-danger";
		}
		const curStats = this.getStats();
		let totalGames = 0;
		for(var gameCount of curStats)
			totalGames += gameCount;
		for(var i = 0; i !== curStats.length; ++i)
			insertHTML += `<tr class="align-middle"><td>${this.statIndexes[i]}</td><td>${curStats[i]}</td><td>${(curStats[i] / totalGames * 100).toFixed(2)}%</td></tr>`;
		insertHTML += `<tr class="align-middle"><td>Hands played</td><td>${totalGames}</td><td></td></tr><tr class="align-middle"><td>Total gain</td><td>\u00a3${curGain !== null ? curGain.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><td>Total loss</td><td>\u00a3${curLoss !== null ? curLoss.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><th>Net total profit</th><th class="${colorClass}">\u00a3${curProfit ? curProfit.toLocaleString("en-US") : 0}</th><td></td></tr><tr class="align-middle"><td>Reset money stats</td><td></td><td><button onclick="window.location.href += '?resetMoney=true'" title="Reset" aria-label="Reset money stats" class="btn btn-danger action-btn fw-normal">Reset</button></td></tr>`;

		const tableHTML = `<div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Blackjack Stats</h2></div></div></div><div class="card-body"> <div class="table-responsive"><table class="table align-items-center table-flush dark-tertiary-bg" id="blackjackStatsTable"><thead class="thead-light"><tr><th scope="col">Value</th><th scope="col">Count</th><th scope="col">Chance</th></tr></thead><tbody>${insertHTML}</tbody></div></div></div>`;
		container.innerHTML = `<div class="col-12 col-md-10"><div class="gap-2 d-flex justify-content-md-end mb-2 flex-wrap"><a href="/Casino/Blackjack"><button class="btn btn-sm btn-dark">Back to Blackjack </button></a></div>${tableHTML}</div>`;
	}
}


class BuyPointsLink {
    constructor() {
        this.add = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Buy Points</h2></div></div></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Points">Item Market</a> to buy points.</p></div>`;
    }

    inSupporter(url) {
        // Find the container (updated from the previous class names)
        let container = document.querySelector("div.col-12"); // Adjust this selector if needed

        // Find the cards in the container (adjust this according to the new structure of your cards)
        const cards = container.querySelectorAll("div.card.mb-4");

        // Create a new card to be inserted
        let linkCard = document.createElement("div");
        linkCard.classList.add("mb-4", "card");
        linkCard.innerHTML = this.add;

        // Find the third last card (or modify this logic if needed)
        const refillCard = cards[cards.length - 3];

        // Insert the new card before the refill card
        container.insertBefore(linkCard, refillCard);
    }
}



class CartelMemberRep {
	constructor() {
		this.attackList = this.getAttackList();
		if(this.attackList === null) {
			this.attackList = [];
			this.setAttackList(this.attackList);
		}
	}
	getAttackList() {
		const list = GM_getValue("cartelMemberRep_attackList");
		return list === undefined ? null : list;
	}
	setAttackList(list) {
		GM_setValue("cartelMemberRep_attackList", list);
		console.log(`Set cartelMemberRep_attackList to ${JSON.stringify(list)}`);
		return list;
	}
	getMemberRep(memberID) {
		const rep = GM_getValue(`cartelMemberRep_${memberID}`);
		return rep === undefined ? null : rep;
	}
	setMemberRep(memberID, rep) {
		GM_setValue(`cartelMemberRep_${memberID}`, rep);
		console.log(`Set cartelMemberRep_${memberID} to ${rep.toLocaleString("en-US")}`);
		return rep;
	}
	processLogs(rows) {
		for(var row of rows) {
			let [ date, data ] = row.children;
			const ID = parseInt(data.children[2].href.match(/\d+/)[0]);
			if(!/\(\+\d+\)/.test(data.innerText)) {
				date.classList.add("text-muted"); // Doesn't need to be done
				continue;
			} else if(this.attackList.includes(ID)) {
				date.classList.add("text-muted"); // Signal that it's already been done
				continue;
			}
			this.attackList.push(ID);
			this.setAttackList(this.attackList);

			const rep = parseInt(/\(\+(\d+)\)/.exec(data.innerText)[1]);
			const attackerID = data.children[0].href.match(/\d+/)[0];
			const oldRep = this.getMemberRep(attackerID);
			this.setMemberRep(attackerID, oldRep === null ? rep : oldRep + rep);
		}
	}
	inAttackLog(url) {
		let rows = document.querySelectorAll("table#eventsTable tbody tr");
		this.processLogs(rows);
	}
	inCartelHomepage(url) {
		const attackTable = document.querySelectorAll("table#eventsTable tbody")[1];
		let rows = attackTable.querySelectorAll("tr");
		this.processLogs(rows);

		const table = document.querySelector("div.card-body > div.container-fluid");
		if(table === null)
			return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[2]; // Already reduced to col-xl-1 by stat estimate
		let roleCol = tableHead.querySelectorAll(".col")[3];
		let repCol = document.createElement("div");
		repCol.classList.add("col", "col-xl-1");
		repCol.innerText = "Added Rep";
		tableHead.insertBefore(repCol, levelCol);
		roleCol.classList.remove("col-xl-2");
		roleCol.classList.add("col-xl-1");

		let entries = table.querySelectorAll(".row.align-middle");
		for(var i = 0; i !== entries.length; ++i) {
			let entry = entries[i];
			const cols = entry.querySelectorAll(".col");
			levelCol = cols[2];
			roleCol = cols[3];
			repCol = document.createElement("div");
			repCol.classList.add("col", "col-xl-1");
			roleCol.classList.remove("col-xl-2");
			roleCol.classList.add("col-xl-1");

			const userLink = cols[0].children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const rep = this.getMemberRep(userID);
			repCol.innerText = rep === null ? 0 : rep.toLocaleString("en-US");
			entry.insertBefore(repCol, levelCol);
		}
	}
}


class CenterTabs {
	constructor() {}
	inNavTabPlace(URL) {
		let tabs = document.querySelectorAll(".nav-tabs");
		for(var tab of tabs) {
			tab.classList.add("nav-justified");
		}
		GM_addStyle(".nav-tabs .nav-link.active { border-bottom: 3px solid #0d6efd !important }");
	}
}


class CenterText {
	constructor() {}
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule p.card-text.flex-grow-1");
		for(var place of places)
			place.classList.add("text-center");
	}
	inAnywhere() {
		const chatRows = document.querySelector("div.chats.row");
		observeDOM(chatRows, e => {
			for(var ev of e) {
				if(ev.target !== chatRows)
					continue;
				for(var addedChat of ev.addedNodes) {
					let header = addedChat.querySelector("div.header h6");
					header.classList.add("text-center");
				}
			}
		});

		const headers = chatRows.querySelectorAll("div.header h6");
		for(var header of headers)
			header.classList.add("text-center");
	}
}


class ColorChatNames {
    constructor() {
        this.ownID = user_id;
    }
	ownColor(l) {
		return `hsl(200, 70%, ${l}%)`;
	}
	/*
	changeColor(msgNode) {
		const chatName = msgNode.children[0];
		const ID = parseInt(chatName.href.match(/\d+$/)[0]);
		if(ID === this.ownID)
			chatName.style.color = this.ownColor;
	}
	inAnywhere(url) {
		const chatRows = document.querySelector("div.chats.row");
		observeDOM(chatRows, e => {
			for(var ev of e) {
				if(ev.target !== chatRows)
					continue;

				for(var addedChat of ev.addedNodes) {
					const messageContainer = addedChat.querySelector("div.MessagesContainer");
					observeDOM(messageContainer, e => {
						for(var newMsg of e)
							this.changeColor(newMsg.addedNodes[1])
					});
					for(var newMsg of messageContainer.querySelectorAll("div.messageText"))
						this.changeColor(newMsg);
				}
			}
		});

		const messageContainers = chatRows.querySelectorAll("div.MessagesContainer");
		for(var messageContainer of messageContainers)
			observeDOM(messageContainer, e => {
				for(var newMsg of e)
					this.changeColor(newMsg.addedNodes[1]);
			});
	}
	*/
	getList(friends = true) {
		const list = GM_getValue(`connections_${friends ? "friends" : "enemies"}`);
		return list === undefined ? [] : list;
	}
	setList(list, friends = true) {
		GM_setValue(`connections_${friends ? "friends" : "enemies"}`, list);
		console.log(`Set connections_${friends ? "friends" : "enemies"} to ${JSON.stringify(list)}`);
		return list;
	}
	inConnections(url) {
		const [ friendList, enemyList ] = document.querySelectorAll("div.card-body tbody");
		const friends = friendList.querySelectorAll("a.fw-bold");
		const enemies = enemyList.querySelectorAll("a.fw-bold");
		let list = [];
		for(var user of friends) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, true);
		list = [];
		for(var user of enemies) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, false);
	}
	inUserProfile(url) {
		const text = document.querySelector("div.card p.card-text.fw-bold");
		if(text === null)
			return;
		const textSplit = text.innerText.split(' ');
		let userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if(userID.endsWith('/'))
			userID = userID.slice(0, -1);
		if(textSplit[textSplit.length - 1] === "enemy") {
			let list = this.getList(false);
			if(textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(true);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, true);
			} else if(textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, false);
		} else if(textSplit[textSplit.length - 1] === "friend") {
			let list = this.getList(true);
			if(textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(false);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, false);
			} else if(textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, true);
		}
	}
	inBountyOrOtherCartel(url) {
		GM_addStyle(`[data-bs-theme="dark"] table a[href$="/${this.ownID}"] { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] table a[href$="/${this.ownID}"] { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`table a[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`table a[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inTrade(url) {
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`table a[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`table a[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inMail(url) {
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`div.mailRow div.col-3 a[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`div.mailRow div.col-3 a[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inMarket(url) {
		GM_addStyle(`div.offerListWrapper a[href$="${this.ownID}"] { color: var(--bs-secondary-color) !important }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`div.offerListWrapper a[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`div.offerListWrapper a[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inForumCategory(url) {
		GM_addStyle(`[data-bs-theme="dark"] div.inventoryWrapper .col-2 a[href$="/${this.ownID}"] { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] div.inventoryWrapper .col-2 a[href$="/${this.ownID}"] { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`div.inventoryWrapper .col-2 a[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`div.inventoryWrapper .col-2 a[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inForumPost(url) {
		GM_addStyle(`[data-bs-theme="dark"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
	inAnywhere(url) {
		GM_addStyle(`[data-bs-theme="dark"] div.messageText a.PlayerHighlight[href$="/${this.ownID}"] { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] div.messageText a.PlayerHighlight[href$="/${this.ownID}"] { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for(var userID of friends) {
			GM_addStyle(`div.messageText a.PlayerHighlight[href$="/${userID}"] { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for(var userID of enemies) {
			GM_addStyle(`div.messageText a.PlayerHighlight[href$="/${userID}"] { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
}


class ColorStats {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;
		this.maxInt = GM_getValue("perks_Max Int") || 1200;
	}
	calcGym(stat) {
		return Math.min(1, 12.5 / 120 * Math.log(stat / 51000 + 1)); // Arbitrary calculation, reaches 120 at ~750 mil (per stat)
	}
	calcInt(currentInt) {
		return 1 - Math.pow(this.maxInt - currentInt, 2) / Math.pow(this.maxInt, 2);
	}
	calcNetworth(networth) {
		return Math.min(1, networth / 600000000); // Arbitrary calculation, reaches max at 600 mil
	}
	calcAttacksWon(won) {
		return Math.min(1, won / 3000); // Arbitrary calculation, reaches max at 3000
	}
	calcRep(rep) {
		return Math.min(1, Math.log(rep / 420000 + 1)); // Arbitrary calculation, reaches max at ~720000
	}
	calcCartelRep(rep) {
		return Math.min(1, Math.log(rep / 1300000 + 1)); // Arbitrary calculation, reaches max at ~2.22 mil
	}
	calcRespect(resp) {
		return Math.max(0, 226 - resp * (resp < 0 ? 15 : 3.7)); // Arbitrary calculation, reaches max at ~-15 if negative, or ~61 if positive
	}
	calcQuality(qualChance) {
		return Math.min(1, 1 - qualChance / 100); // Reaches max at top 0%, min at top 100%
	}
	poz(z) { // From https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score
		var y, x, w;
		if(z == 0.0) {
			x = 0.0;
		} else {
			y = 0.5 * Math.abs(z);
			if(y > (4 * 0.5)) { // Was previously 6 * 0.5
				x = 1.0;
			} else if(y < 1.0) {
				w = y * y;
				x = ((((((((0.000124818987 * w
				  - 0.001075204047) * w + 0.005198775019) * w
				  - 0.019198292004) * w + 0.059054035642) * w
				  - 0.151968751364) * w + 0.319152932694) * w
				  - 0.531923007300) * w + 0.797884560593) * y * 2.0;
			} else {
				y -= 2.0;
				x = (((((((((((((-0.000045255659 * y
				  + 0.000152529290) * y - 0.000019538132) * y
				  - 0.000676904986) * y + 0.001390604284) * y
				  - 0.000794620820) * y - 0.002034254874) * y
				  + 0.006549791214) * y - 0.010557625006) * y
				  + 0.011630447319) * y - 0.009279453341) * y
				  + 0.005353579108) * y - 0.002141268741) * y
				  + 0.000535310849) * y + 0.999936657524;
			}
		}
		return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
	}
	changeQuality(elem) {
		if(elem === null)
			return;
		const percent = elem.innerText.replace(/^\s+\w+\s+/, "");
		if(percent !== elem.innerText && elem.innerText.trim().split(/\s/)[0] !== "Quality")
			return;
		if(percent === "" || percent === "N/A")
			return;
		const qual = parseFloat(percent.slice(0, -1));
		const qualChance = (this.poz((50 - qual) / 12.5) * 100).toString(); // mean = 50, std = 12.5
		if(qualChance === "NaN")
			return;
		const first4 = qualChance.slice(0, 4);
		elem.innerHTML += ` <span style="color: hsl(${this.calcQuality(qualChance) * 120}, 67%, ${this.brightness}%)">(top ${qualChance.slice(0, first4 === "0.00" ? 5 : first4 === "99.9" ? (qualChance.slice(0, 5) === "99.99" ? 6 : 5) : 4)}%)</span>`;
	}
	changeHsThing(content, selector, lambda, valFunc, calcFunc) {
		const rows = content.querySelectorAll(selector);
		for(var row of rows) {
			let thing = row.children[2];
			const val = parseFloat(lambda(thing.innerText));
			thing.style.color = `hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)`;
		}
	}
	changePsThing(elem, lambda, valFunc, calcFunc) {
		const val = parseFloat(lambda(elem.innerText));
		elem.innerHTML = `<span style="color: hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)">${elem.innerText}</span>`;
	}
	inForumPost(url) {
		const respects = document.querySelectorAll(".mb-2 p.card-text");
		for(var respText of respects) {
			const resp = parseInt(respText.innerText.split(' ')[0].replaceAll(',', ""));
			const colorVal = this.calcRespect(resp);
			respText.innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span> Respect`;
		}
	}
	inHighscores(url) {
		const noCommas = text => text.replaceAll(',', "");
		const changeBattlestats = content => this.changeHsThing(content, "tr.fw-bold", noCommas, val => val / 4, this.calcGym.bind(this));
		const battlestats = document.querySelector("div#v-content-battlestats");
		changeBattlestats(battlestats);
		observeDOM(battlestats, e => changeBattlestats(e[0].target));

		const changeRep = (content, calcFunc) => this.changeHsThing(content, "tbody tr", noCommas, val => val, calcFunc);
		const repContainer = document.querySelector("div#v-content-reputation");
		changeRep(repContainer, this.calcRep.bind(this));
		observeDOM(repContainer, e => changeRep(e[0].target, this.calcRep));
		const cartelRepContainer = document.querySelector("div#v-content-cartelreputation");
		changeRep(cartelRepContainer, this.calcCartelRep.bind(this));
		observeDOM(cartelRepContainer, e => changeRep(e[0].target, this.calcCartelRep.bind(this)));

		const changeNetworth = content => this.changeHsThing(content, "tbody tr", text => noCommas(text.slice(1)), val => val, this.calcNetworth.bind(this));
		const networthContainer = document.querySelector("div#v-content-networth");
		changeNetworth(networthContainer);
		observeDOM(networthContainer, e => changeNetworth(e[0].target));

		const changeAttacksWon = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcAttacksWon.bind(this));
		const attacksWonContainer = document.querySelector("div#v-content-attackswon");
		changeAttacksWon(attacksWonContainer);
		observeDOM(attacksWonContainer, e => changeAttacksWon(e[0].target));
	}
	inHomepage(url) {
        const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if(stats.length < 2)
			return;

		const leftStats = stats[0].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		for(var i = 0; i !== 2; ++i) {
			let theStat = leftStats[i === 0 ? 2 : 6];
			const text = theStat.innerText;
			const val = parseFloat(text.replaceAll(',', ""));
			theStat.innerHTML = `<span style="color: hsl(${(i === 0 ? this.calcRep(val) : this.calcInt(val)) * 120}, 67%, ${this.brightness}%)">${text}</span>`;
		}

		const trs = stats[1].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		if(trs.length < 5)
			return;
		for(var i = 0; i !== 5; ++i) {
			let td = trs[i];
			const valText = td.innerText.match(/^[\d\.,]+/)[0];
			const val = parseFloat(valText.replaceAll(',', ""));
			const colorVal = i === 4 ? this.calcGym(val / 4) : this.calcGym(val);
			const effectiveStats = td.children[0];
			if(effectiveStats)
				effectiveStats.classList.add("float-end");
			td.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">${valText}</span>${td.innerHTML.replace(/^[\d\.,]+/, "")}`;
		}
	}
	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if(statCols === null)
			return;
		statCols = statCols.children;

		let totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Is the first one
		const textSplit = totalStats.innerText.split(' ');
		const totalStatVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
		totalStats.innerHTML = `(<span style="color: hsl(${this.calcGym(totalStatVal / 4) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;

		for(var col of statCols) {
			let stat = col.children[0].children[2];
			const textSplit = stat.innerText.split(' ');
			const statVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
			stat.innerHTML = `(<span style="color: hsl(${this.calcGym(statVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit[1].slice(0, -1)}: ${(statVal / totalStatVal * 100).toFixed(1)}%)`;
		}
	}
	inUniversity(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if(container === null)
			return;
		let currentInt = container.querySelector("p.card-text.fw-bold.text-muted");

		const textSplit = currentInt.innerText.split(' ');
		const currentIntVal = parseFloat(textSplit[0].slice(1));
		currentInt.innerHTML = `(<span style="color: hsl(${this.calcInt(currentIntVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;
	}
	inPersonalStats(url) {
		let stats = document.querySelectorAll(".list-group .list-group-item ~ .list-group-item .col-4 ~ .col-4");
		if(stats.length === 0)
			return;

		const noCommas = text => text.replaceAll(',', "");
		for(var i = 0; i < 2; ++i) {
			this.changePsThing(stats[i], noCommas, val => val, this.calcRep.bind(this));
			this.changePsThing(stats[i + 2], noCommas, val => val, this.calcInt.bind(this));
			this.changePsThing(stats[i + 12], noCommas, val => val / 4, this.calcGym.bind(this));
			const resp = parseInt(noCommas(stats[i + 14].innerText));
			const colorVal = this.calcRespect(resp);
			stats[i + 14].innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span>`;
		}
		for(var i = 0; i < 8; ++i) {
			this.changePsThing(stats[i + 4], noCommas, val => val, this.calcGym.bind(this));
		}
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if(itemList === null)
			return;

		for(var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if(item.children.length < 7)
				continue;
			this.changeQuality(item.children[4]);
			let otherElem = item.children[6].querySelector(".align-items-center .col-xl-2");
			this.changeQuality(otherElem);
		}
	}
	inMarket(url) {
		const container = document.querySelector("nav#itemMarketNav > div.tab-content");
		if(container === null)
			return;

		for(var section of container.children)
			observeDOM(section, e => {
				const list = e[1].addedNodes[0];
				if(list.classList === undefined || !list.classList.contains("offerListWrapper"))
					return;

				const listings = list.querySelectorAll(".offerItemWrapper");
				for(var listing of listings) {
					let qualElem = listing.children[3];
					if(qualElem.innerText.slice(-1) !== "%")
						continue;
					this.changeQuality(qualElem);
				}
				const collapsed = list.querySelectorAll(".collapse, .collapsing");
				for(var listing of collapsed) {
					this.changeQuality(listing.querySelector(".col-xl-2"));
				}
			});

		const ownOffers = document.querySelectorAll(".card-body > .offerListWrapper .inventoryItemWrapper");
		for(var offer of ownOffers) {
			this.changeQuality(offer.children[3]);
		}
	}
}


class DisableThrow {
	constructor() {
		this.throwText = "Throw Away";
	}
	inInventory(url) {
		const buttons = document.querySelectorAll("button.btn.action-btn.ms-1.float-end");
		for(var button of buttons)
			if(button.title === this.throwText)
				button.setAttribute("disabled", true);
	}
}


class DisplayPerks {
	constructor() {
		this.statGains = [ "Accuracy", "Agility", "Defence", "Strength" ];
		this.prod = "Production Profit";
		this.medEffectiveness = "Med Effectiveness";
		this.maxInt = "Max Int";
		this.intGains = "Int Gains";
		this.jobProfits = "Job Profits";
		this.streetCrimeProfit = "Street Crime Profit";

		this.all = "Territory";
		this.medProgram = "Medical Program";
	}
	getPerk(type) {
		const perk = GM_getValue(`perks_${type}`);
		return perk === undefined ? null : perk;
	}
	setPerk(type, perk) {
		GM_setValue(`perks_${type}`, perk);
		console.log(`Set perks_${type} to ${perk}`);
		return perk;
	}
	changeHospitalTime(texts) {
		let timeText = texts[texts.length - 1];
		if(timeText === undefined || !timeText.innerText.includes("Hospital timer"))
			return;
		const textSplit = timeText.innerText.split(' ');
		let time = parseInt(textSplit[textSplit.length - 2]);
		time *= 1 + this.getPerk(this.medEffectiveness) / 100;
		timeText.innerText = textSplit.slice(0, -2).join(' ');

		if(time >= 60) {
			const hours = Math.floor(time / 60);
			timeText.innerText += ` ${hours} hour${hours === 1 ? "" : 's'}${time % 60 ? " and" : ""}`;
		}
		if(time % 60)
			timeText.innerText += ` ${time % 60} minute${time % 60 === 1 ? "" : 's'}`;
		if(this.getPerk(this.medEffectiveness) === 0)
			timeText.innerText += '.';
		else
			timeText.innerHTML += ` <span class="text-success">(+${this.getPerk(this.medEffectiveness)}% applied)</span>.`;
	}
	inHomepage(url) {
    // Grab the perk items from the updated structure
    const perks = document.querySelectorAll(".col-12.d-flex.align-items-stretch.col-xxl-4 .perk-item");

    const museumVals = {
        "Small": 50,
        "Large": 100,
        "Basic": 150,
        "Superior": 200
    };

    let allStats = 0;
    let medEffectiveness = 0;
    let prodEffectiveness = 0;

    for (let perk of perks) {
        const perkName = perk.querySelector(".perkTitle").innerText;  // Get perk name
        const perkDesc = perk.querySelector(".perkDescription").innerText;  // Get perk description

        const textSplit = perkDesc.split(' ');  // Split description into words

        // Check for different perk types and apply logic accordingly
        if (perkName === this.all) {
            if (perkDesc.startsWith("Increase all Gym gains by"))
                allStats += parseFloat(textSplit[textSplit.length - 1].slice(0, -1));
        } else if (perkName === this.medProgram) {
            if (perkDesc.endsWith("more effective Medicine"))
                medEffectiveness += parseFloat(textSplit[0].slice(0, -1));
        } else if (perkDesc.endsWith("Street Crime Profit"))
            this.setPerk(this.streetCrimeProfit, parseFloat(textSplit[0].slice(0, -1)));
        else if (perkDesc.endsWith("increase to production profits"))
            prodEffectiveness += parseFloat(textSplit[0].slice(0, -1));
        else if (perkDesc.endsWith("increase to all Gym gains"))
            allStats += parseFloat(textSplit[0].slice(0, -1));
        else if (perkDesc.startsWith("Increases the Intelligence stat cap"))
            this.setPerk(this.maxInt, 1000 + museumVals[perkName.split(' ')[0]]);
        else if (perkDesc.startsWith("Increases all Intelligence gains"))
            this.setPerk(this.intGains, parseFloat(textSplit[textSplit.length - 1].slice(0, -1).replaceAll(',', "")));
        else if (perkDesc.endsWith("increase to Job profits"))
            this.setPerk(this.jobProfits, parseFloat(textSplit[0].slice(0, -1)));
    }

    // Update stat gains after processing perks
    let statGains = [allStats, allStats, allStats, allStats];
    for (let perk of perks) {
        const perkDesc = perk.querySelector(".perkDescription").innerText;
        for (let i = 0; i < this.statGains.length; ++i) {
            // Dynamically check if a perk description ends with one of the stat gain descriptions
            if (perkDesc.endsWith(`increase to ${this.statGains[i]} gains`))
                statGains[i] += parseInt(perkDesc.split(' ')[0].slice(0, -1));  // Assuming the first part of the description is the percentage value
        }
    }

    // Set the final stats
    for (let i = 0; i < this.statGains.length; ++i)
        this.setPerk(`${this.statGains[i]} Gain`, statGains[i]);

    // Set the other perks
    this.setPerk(this.medEffectiveness, medEffectiveness);
    this.setPerk(this.prod, prodEffectiveness);
}

	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if(statCols === null)
			return;
		statCols = statCols.children;

		for(var col of statCols) {
			const perkGainText = `${col.children[0].children[0].innerText}Gain`;
			const perkGain = this.getPerk(perkGainText);
			if(perkGain !== null) {
				let extraGains = document.createElement("p");
				extraGains.classList.add("extraGains", "card-text");
				extraGains.innerHTML = `(+${perkGain}% gains)`;

				col.children[0].insertBefore(extraGains, col.children[0].children[3]);
			}
		}
	}
	inInventory(url) {
		if(!this.getPerk(this.medEffectiveness))
			return;
		const itemList = document.querySelector("div.container.inventoryWrapper.pt-2");

		for(var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			const texts = item.querySelectorAll("div.card-text > div.card-text");
			this.changeHospitalTime(texts);
		}
	}
	inMarket(url) {
		const medItems = document.querySelector("div#content-medical");
		observeDOM(medItems, e => {
			const list = e[1].addedNodes[0];
			if(list.classList === undefined || !list.classList.contains("offerListWrapper"))
				return;

			let doit = false;
			for(var itemNum = 1; itemNum < list.children.length; ++itemNum) {
				const listing = list.children[itemNum];
				const listingName = listing.children[1].innerText;
				if(itemNum % 2)
					doit = [ "Bandage", "Small Medical Kit", "Large Medical Kit", "Basic Trauma Kit", "Large Trauma Kit" ].includes(listingName);
				else if(doit) {
					const texts = listing.querySelectorAll("div.card-text > div.card-text");
					this.changeHospitalTime(texts);
				}
			}
		});
	}
	inPharmacy(url) {
		const itemLists = document.querySelectorAll("div.container.inventoryWrapper.mb-4");

		for(var il = 0; il !== itemLists.length; ++il) {
			const itemList = itemLists[il];
			for(var i = 1; i !== itemList.children.length; ++i) {
				const item = itemList.children[i];
				const texts = item.querySelectorAll("div.card-text > div.card-text");
				this.changeHospitalTime(texts);
			}
		}
	}
}


class DisplayTownCaches {
	constructor(darkMode) {
		this.hoursLate = 0;
		this.brightness = darkMode ? 50 : 45;
		this.incompleteColor = `hsl(60, 67%, ${this.brightness}%)`;

		this.casinoIdx = 4;
		this.petsIdx = 5;
		this.spinsIdx = 1;

		this.petAbbrevs = {
			"Common": "C",
			"Uncommon": "UC",
			"Rare": "R",
			"Epic": "E",
			"Legendary": "L"
		};
		this.links = [
			// TODO: drug CD takes a while to load
			/*{
				name: "Take Cocaine",
				altName: "Cocaine",
				link: "/Inventory",
				path: `<path d="M213.7,42.3a53.4,53.4,0,0,0-75.4,0l-96,96a53.3,53.3,0,0,0,75.4,75.4l96-96A53.5,53.5,0,0,0,213.7,42.3Zm-11.4,64L160,148.7,107.3,96l42.4-42.3a36.9,36.9,0,0,1,52.6,0A37.1,37.1,0,0,1,202.3,106.3ZM190.2,82.9a7.9,7.9,0,0,1-.2,11.3l-24.4,23.6a7.9,7.9,0,0,1-11.3-.2,7.9,7.9,0,0,1,.2-11.3l24.4-23.6A8,8,0,0,1,190.2,82.9Z"></path>`,
				viewBox: 256
			},*/
			{
				name: "REFILL",
				altName: "Refill",
				link: "/Supporter",
				path: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>`,
				viewBox: 16
			},
			{
				name: "WHEEL SPIN",
				altName: "Spins",
				link: "/Casino/Spinner",
				path: `<path fill-rule="evenodd" clip-rule="evenodd" d="M0.877075 7.49985C0.877075 3.84216 3.84222 0.877014 7.49991 0.877014C11.1576 0.877014 14.1227 3.84216 14.1227 7.49985C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49985ZM3.78135 3.21565C4.68298 2.43239 5.83429 1.92904 7.09998 1.84089V6.53429L3.78135 3.21565ZM3.21567 3.78134C2.43242 4.68298 1.92909 5.83428 1.84095 7.09997H6.5343L3.21567 3.78134ZM6.5343 7.89997H1.84097C1.92916 9.16562 2.43253 10.3169 3.21579 11.2185L6.5343 7.89997ZM3.78149 11.7842C4.6831 12.5673 5.83435 13.0707 7.09998 13.1588V8.46566L3.78149 11.7842ZM7.89998 8.46566V13.1588C9.16559 13.0706 10.3168 12.5673 11.2184 11.7841L7.89998 8.46566ZM11.7841 11.2184C12.5673 10.3168 13.0707 9.16558 13.1588 7.89997H8.46567L11.7841 11.2184ZM8.46567 7.09997H13.1589C13.0707 5.83432 12.5674 4.68305 11.7842 3.78143L8.46567 7.09997ZM11.2185 3.21573C10.3169 2.43246 9.16565 1.92909 7.89998 1.8409V6.53429L11.2185 3.21573Z"></path>`,
				viewBox: 16
			},
			{
				name: "SICARIOS",
				altName: "Sicarios",
				link: "/Town/Club",
				path: `<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path> <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path>`,
				viewBox: 16
			},
			{
				name: "PET SHOP",
				altName: "Pets",
				link: "/PetShop",
				path: `<path d="M104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm60-12a12,12,0,1,0,12,12A12,12,0,0,0,164,128Zm68.7,16a16.1,16.1,0,0,1-6.7,1.4,15.6,15.6,0,0,1-10-3.6V184a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V141.8a15.6,15.6,0,0,1-10,3.6,16.1,16.1,0,0,1-6.7-1.4,15.8,15.8,0,0,1-9.1-17.6L30.6,38.9A16.1,16.1,0,0,1,50.2,26.3L105,40h46l54.8-13.7a16.1,16.1,0,0,1,19.6,12.6l16.4,87.5A15.8,15.8,0,0,1,232.7,144ZM200,184V122L148.1,56H107.9L56,122v62a24.1,24.1,0,0,0,24,24h40V195.3l-13.7-13.6a8.1,8.1,0,0,1,11.4-11.4L128,180.7l10.3-10.4a8.1,8.1,0,0,1,11.4,11.4L136,195.3V208h40A24.1,24.1,0,0,0,200,184Z"></path>`,
				viewBox: 256
			},
            {
                name: "POINTS",
                altName: "Points",
                link: "/Town/Mateos",
                path: `<path d="M13,7H10A1,1,0,0,0,9,8v8a1,1,0,0,0,2,0V14h2a3,3,0,0,0,3-3V10A3,3,0,0,0,13,7Zm1,4a1,1,0,0,1-1,1H11V9h2a1,1,0,0,1,1,1ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"></path>`,
                viewBox: 24
            }

		];
	}
	getCache(type) {
		const cache = GM_getValue(`cache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`cache_${type}`, cache);
		console.log(`Set cache_${type} to ${cache}`);
		return cache;
	}
	timeFunc(now) {
		return new Date(now).toLocaleDateString("en-GB", { timeZone: "UTC" });
	}
	inPetshop(url) {
		const rarities = document.querySelectorAll(".equipmentModule div.fw-bold > span:not(.fw-normal)");

		if(rarities.length === 3) {
			const curCache = this.getCache("Pets");
			const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
			if(curCache === null || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
				this.setCache("Pets", [ now, rarities[0].innerText, rarities[1].innerText, rarities[2].innerText ]);
		}
	}
	inSicarios(url) {
		const curCache = this.getCache("Sicarios");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if(curCache === null || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("Sicarios", [ now ]);
	}
	inCasinoSpinner(url) {
		const spinsLeft = document.querySelector("span#tokenCount");
		const spinsLeftNum = parseInt(spinsLeft.innerText);
		const curCache = this.getCache("Spins");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if(curCache === null || parseInt(spinsLeftNum) !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("Spins", [ now, spinsLeftNum ]);
		observeDOM(spinsLeft, e => {
			const spinsLeftNum = parseInt(e[0].target.innerText);
			const now = Date.now();
			this.setCache("Spins", [ now, spinsLeftNum ]);
		});
	}
	inSupporter(url) {
		const refillButton = document.querySelector("a#refillEnergy");
		const refillDone = refillButton.classList.contains("disabled");

		const curCache = this.getCache("EnergyRefill");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if(curCache === null || refillDone !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("EnergyRefill", [ now, refillDone ]);
	}
    inMateos(url){
        const headerSections = document.querySelectorAll('.header-section');
        const pointsHeader = headerSections[2].querySelector('h2').innerText;
        const pointsDepleted = pointsHeader.includes("(0/25)");
        console.log(pointsHeader);
        console.log(pointsDepleted);

        const curCache = this.getCache("MateosPoints");
        const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

        if (curCache === null || pointsDepleted !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0]))
            this.setCache("MateosPoints", [ now, pointsDepleted ]);
    }
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule");
		if(places.length === 0)
			return;
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

		const petShop = places[this.petsIdx].children[0];
		const curPetsCache = this.getCache("Pets");
		let button = petShop.querySelector("a.btn.btn-block");

		let hrBreak = document.createElement("hr");
		hrBreak.classList.add("w-75");
		petShop.insertBefore(hrBreak, button);
		let cacheText = document.createElement("p");
		cacheText.classList.add("text-center");
		if(curPetsCache !== null && this.timeFunc(now) === this.timeFunc(curPetsCache[0]))
			cacheText.innerHTML = `(Today: <span class="${curPetsCache[1]}">${this.petAbbrevs[curPetsCache[1]]}</span>, <span class="${curPetsCache[2]}">${this.petAbbrevs[curPetsCache[2]]}</span>, <span class="${curPetsCache[3]}">${this.petAbbrevs[curPetsCache[3]]}</span>)`;
		else
			cacheText.innerHTML = `(Today: <span class="text-muted">???</span>)`;
		petShop.insertBefore(cacheText, button);

		const casino = places[this.casinoIdx].children[0];
		const curSpinsCache = this.getCache("Spins");
		button = casino.querySelector("a.btn.btn-block");

		hrBreak = document.createElement("hr");
		hrBreak.classList.add("w-75");
		casino.insertBefore(hrBreak, button);
		cacheText = document.createElement("p");
		cacheText.classList.add("text-center");
		if(curSpinsCache !== null && this.timeFunc(now) === this.timeFunc(curSpinsCache[0])) {
			if(curSpinsCache[1] === 0)
				cacheText.innerHTML = `(Today: <span class="text-muted">done</span>)`;
			else
				cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">${curSpinsCache[1]} left</span>)`;
		} else
			cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">2 left</span>)`;
		casino.insertBefore(cacheText, button);
	}
	inCasino(url) {
		const places = document.querySelectorAll("div.card-group div.card");
		if(places.length === 0)
			return;
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

		const spins = places[this.spinsIdx].children[0];
		const curSpinsCache = this.getCache("Spins");
		const button = spins.querySelector("a.btn.btn-block");

		let hrBreak = document.createElement("hr");
		hrBreak.classList.add("w-75");
		spins.insertBefore(hrBreak, button);
		let cacheText = document.createElement("p");
		cacheText.classList.add("text-center");
		if(curSpinsCache !== null && this.timeFunc(now) === this.timeFunc(curSpinsCache[0])) {
			if(curSpinsCache[1] === 0)
				cacheText.innerHTML = `(Today: <span class="text-muted">done</span>)`;
			else
				cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">${curSpinsCache[1]} left</span>)`;
		} else
			cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">2 left</span>)`;
		spins.insertBefore(cacheText, button);
	}
    inAnywhere() {
        const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
        const curRefillCache = this.getCache("EnergyRefill");
        const curSpinsCache = this.getCache("Spins");
        const curSicariosCache = this.getCache("Sicarios");
        const curPetsCache = this.getCache("Pets");
        const curMateosCache = this.getCache("MateosPoints");

        const done = [
            curRefillCache && this.timeFunc(now) === this.timeFunc(curRefillCache[0]) && curRefillCache[1],
            curSpinsCache && this.timeFunc(now) === this.timeFunc(curSpinsCache[0]) && curSpinsCache[1] === 0,
            curSicariosCache && this.timeFunc(now) === this.timeFunc(curSicariosCache[0]),
            curPetsCache && this.timeFunc(now) === this.timeFunc(curPetsCache[0]),
            curMateosCache && this.timeFunc(now) === this.timeFunc(curMateosCache[0]) && curMateosCache[1]
        ];

        let mobileMenu = document.querySelector("ul#menu");
        let desktopMenu = document.querySelector("ul#desktopMenu");

        for (let i = 0; i < this.links.length; ++i) {
            const linkObj = this.links[i];
            if (!done[i]) {
                let listItem = document.createElement("li");
                listItem.innerHTML = `
        <a class="nav-link d-flex flex-column align-items-center px-md-0 px-2 leftNavLink" href="${linkObj.link}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                 fill="hsl(60, 67%, ${this.brightness}%)"
                 viewBox="0 0 ${linkObj.viewBox} ${linkObj.viewBox}">
                ${linkObj.path}
            </svg>
            <span class="text-warning mt-1">${linkObj.name}</span>
        </a>
    `;

                if (mobileMenu) {
                    mobileMenu.appendChild(listItem.cloneNode(true));
                }
                if (desktopMenu) {
                    desktopMenu.appendChild(listItem);
                }
            }
        }
    }
}


class DPEnergyRefillReminder {
	constructor() {}
	inSupporter(url) {
		let modalText = document.querySelector("#useRefillConfirm p.card-text.modal-bodyText");
		observeDOM(modalText, e => {
			const textSplit = e[0].target.innerText.split(' ');
			const option = textSplit[textSplit.length - 1];
			if(option === "Energy?")
				if(document.querySelector("#maxEnergy").innerText !== "200")
					modalText.innerHTML += `<br><span class="text-warning">Your max energy isn't 200!</span>`;
				else if(document.querySelector("#currentEnergy").innerText !== "0")
					modalText.innerHTML += `<br><span class="text-danger">Your current energy isn't 0!</span>`;
		});
	}
}


class EstateLevelInfo {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.prefixes = [ "", "", '\u00a3', '-', '+', '+', '+' ];
		this.postfixes = [ "", "", 'M', '%', '%', " INT", '%' ];
		this.values = [
			[],
			[],
			[ 0, 10, 50, 150, 250, 500, 2000 ],
			[ 0, 1, 2, 4, 6, 8, 10 ],
			[ 0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75 ],
			[ 0, 50, 100, 150, 200 ],
			[ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75 ]
		];
	}
	inEstateAgent(url) {
		const containers = document.querySelectorAll("div.accordion-body");

		for(var i = 1; i !== containers.length; ++i) {
			const container = containers[i];
			const numbers = container.querySelectorAll("div.col-6 p:not(.mb-0)");
			const jAdd = i > 5 ? 1 : 0;
			for(var j = 2 + jAdd; j !== numbers.length; ++j) {
				let numberP = numbers[j];
				const number = parseInt(numberP.innerText);
				const val = this.values[j - jAdd][number];
				if(val === undefined)
					return;
				const colorVal = // j - jAdd === 2 ? 1 - ((val - 26) / (41.3 - 26)) :
					val / this.values[j - jAdd][this.values[j - jAdd].length - 1];
				numberP.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this.prefixes[j - jAdd]}${val.toLocaleString("en-US")}${this.postfixes[j - jAdd]})</span>`;
			}
		}
	}
}


class EstimatedIntGains {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.improperWay = false; // Instead of using ^energy, Diablo used to use *energy incorrectly
		this.constant = this.improperWay ? 36715 : 36667;
		this.base = 1 + 1 / this.constant;
		this.ID = "expectedIntGains";

		this.maxInt = GM_getValue("perks_Max Int") || 1200; // NOTE: only works when integrated with other scripts
		const extraIntGains = GM_getValue("perks_Int Gains") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.extraGainsFactor = 1 + extraIntGains / 100;
	}
	calcGain(energy, currentInt) {
		if(this.improperWay)
			return Math.min(this.maxInt - currentInt, currentInt * (this.base - 1) * energy * this.extraGainsFactor);
		else
			return Math.min(this.maxInt - currentInt, currentInt * (Math.pow(this.base, energy * this.extraGainsFactor) - 1));
	}
	genText(value, currentInt) {
		return `Expected gain: <span class="fw-bold">${value === 0 ? '0' : '~' + value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>`;
	}
	genToMaxText(currentInt) {
		const eToMax = Math.log(this.maxInt / currentInt) / Math.log(this.base) / this.extraGainsFactor;
		return `<span class="fw-bold">~${Math.round(eToMax).toLocaleString("en-US")}</span> energy until ${this.maxInt.toLocaleString("en-US")}`;
	}
inUniversity(url) {
    const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
    if (container === null) return;

    // Look for the form or the "too tired" message
    let targetElement = container.querySelector("form.input-group");
    if (targetElement === null) {
        targetElement = container.querySelector("p.card-text.text-danger");
        if (targetElement === null) {
            return; // Exit if neither the form nor the message is found
        }
    }

    let currentIntVal = 0;
    const currentInt = container.querySelector("p.card-text.fw-bold.text-muted");
    if (currentInt !== null) {
        currentIntVal = parseFloat(currentInt.innerText.split(' ')[0].slice(1));
    } else {
        return; // Exit if currentInt is not found
    }

    let energy = 50;
    if (targetElement.tagName === 'FORM') {
        const energyInput = targetElement.querySelector("input.form-control");
        if (energyInput !== null) {
            energy = parseInt(energyInput.value);
        }

        let value = this.calcGain(energy, currentIntVal);

        let expectedIntGains = document.createElement("p");
        expectedIntGains.id = this.ID;
        expectedIntGains.classList.add("card-text", "mt-2");
        expectedIntGains.innerHTML = this.genText(value, currentIntVal);

        // Insert the expected gain element after the form
        targetElement.insertAdjacentElement("afterend", expectedIntGains);

        // Add event listener for energy input changes
        if (energyInput !== null) {
            energyInput.addEventListener("input", e => {
                const energyText = e.target.value;
                if (energyText !== "" && energyText.trim()[0] !== '-') {
                    energy = parseInt(energyText);
                    value = this.calcGain(energy, currentIntVal);
                    expectedIntGains.innerHTML = this.genText(value, currentIntVal);
                }
            });
        }
    }

    // Always create and insert the "energy until maximum" element
    let eToMaxText = document.createElement("p");
    eToMaxText.classList.add("card-text", "mb-0");
    eToMaxText.innerHTML = this.genToMaxText(currentIntVal);

    // Insert the "energy until maximum" element after the targetElement
    targetElement.insertAdjacentElement("afterend", eToMaxText);

    const usedGainBox = document.querySelector("div.mb-4.card.border-success p.card-text.fw-bold.text-white");
    if (usedGainBox !== null) {
        const textSplit = usedGainBox.innerText.split(' ');
        if (textSplit[textSplit.length - 1] === "Intelligence") {
            const prevIntVal = currentIntVal - parseFloat(textSplit[7]);
            const expected = this.calcGain(parseInt(textSplit[4]), prevIntVal);
            usedGainBox.innerHTML += ` <span class="text-muted">(expected ${expected.toLocaleString("en-US", { minimumFractionDigits: 2 })})</span>`;
        }
    }
}

}


class ExpeditionChances {
	constructor() {}
	inExpeditions(URL) {
		let teamStats = [ [], [], [], [], [] ];
		for(var team_i = 1; team_i <= 5; ++team_i) {
			const stats = document.querySelectorAll(`#v-content-team${team_i} > .justify-content-center span:not(.fw-bold)`);
			if(stats.length !== 4)
				return;
			for(var statText of stats) {
				teamStats[team_i - 1].push(parseInt(statText.innerText.replaceAll(',', "")));
			}
		}
		const expeds = document.querySelectorAll(".expeditionButton");
		for(var exped of expeds) {
			if(exped.children.length < 5)
				continue;
			let chances = [ 1, 1, 1, 1, 1 ];
			for(var i = 1; i < 4; ++i) { // Don't factor in speed (last value) since it only affects expedition time not success rate
				const stat = parseInt(exped.children[i].children[1].innerText.replaceAll(',', ""));
				for(var team_i = 0; team_i < 5; ++team_i) {
					chances[team_i] = Math.min(chances[team_i], teamStats[team_i][i - 1] / stat);
				}
			}
			chances.forEach(c => console.log(c * 100));
			let options = exped.querySelectorAll("select.expeditionTeamSelector option");
			for(var opt of options) {
				const team_i = parseInt(opt.value);
				if(team_i === 0)
					continue;
				opt.innerText += ` - ${Math.floor(chances[team_i - 1] * 100)}%`;
			}
		}
	}
}


class GreenMoney {
    constructor() {
        this.color = "hsl(95, 100%, 25%)"; // Default color
        this.inAnywhere(); // Automatically run inAnywhere when the class is defined
    }

    inAnywhere() {
        // List of class names to handle
        ["currentCashDesktop", "cashDisplay"].forEach(className => {
            // Find the cash elements
            let cash = document.querySelector(`span.${className}`);

            if (cash !== null) {
                // Apply color to the cash amount
                cash.style.color = this.color;

                // Determine the parent element for context
                let parentElement = cash.closest('li') || cash.closest('.row');

                if (parentElement) {
                    // Case 1: Handle £ in the same element
                    if (parentElement.textContent.includes('£')) {
                        parentElement.innerHTML = parentElement.innerHTML.replace(/£/, `<span style="color: ${this.color};">£</span>`);
                    }

                    // Case 2: Handle £ as a sibling element
                    let poundSymbol = parentElement.querySelector('span, p')?.previousSibling;
                    if (poundSymbol && poundSymbol.nodeType === Node.TEXT_NODE && poundSymbol.textContent.includes('£')) {
                        poundSymbol.textContent = poundSymbol.textContent.replace('£', `£`);
                        poundSymbol.style.color = this.color;
                    }
                }
            }
        });
    }
}


class HighlightExcessHealth {
	constructor() {}
	inUserProfile(url) {
		const trs = document.querySelectorAll("table.table tbody tr");
		if(trs.length < 6)
			return;
		let lifeTd = trs[5].children[1];
		const life = lifeTd.innerText;
		const curHealth = parseInt(life.split(" / ")[0].replaceAll(',', ""));
		const maxHealth = parseInt(life.split(" / ")[1].replaceAll(',', ""));
		if(curHealth > maxHealth)
			lifeTd.classList.add("text-danger", "fw-bold");
	}
}


class HighlightInactives {
	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days
	}
	inCartel(url) { // Run after stat estimates
		const table = document.querySelector("div.card-body > div.container-fluid");
		let rows = table.querySelectorAll(".row.align-middle");

		for(var row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			let activity = cols[cols.length - 2];
			if(activity.innerText.endsWith("days ago") || activity.innerText.endsWith("day ago")) {
				const days = parseInt(activity.innerText.match(/\d+/)[0]);
				if(days >= this.redBy)
					activity.classList.add("text-danger");
				else if(days >= this.yellowBy)
					activity.classList.add("text-warning");
			}
		}
	}
}


class HighlightUnequipped {
	constructor(darkMode) {}
	inInventory(url) {
		let titles = document.querySelectorAll("h6.card-title");

		for(var title of titles)
			if(title.innerText === "None")
				title.classList.add("fw-bold", "text-danger");
	}
	inProduction(url) {
		let idle = document.querySelector("p.idleNarcos");
		if(idle === null)
			return;
		const setColor = text => {
			if(text === "0")
				idle.classList.remove("fw-bold", "text-danger");
			else
				idle.classList.add("fw-bold", "text-danger");
		};
		setColor(idle.innerText);
		observeDOM(idle, e => setColor(e[0].target.innerText));
	}
}


class HighscoreChanges {
	constructor() {
		this.hoursLate = 2;
		this.height = 16.75;
		if(this.getCache("Battlestats_self") === null)
			this.setCache("Battlestats_self", [ null, null ]);
		if(this.getCache("Networth_self") === null)
			this.setCache("Networth_self", [ null, null ]);
		if(this.getCache("Reputation") === null)
			this.setCache("Reputation", [ null, null ]);
		if(this.getCache("Cartel Reputation") === null)
			this.setCache("Cartel Reputation", [ null, null ]);
		if(this.getCache("Attacks Won") === null)
			this.setCache("Attacks Won", [ null, null ]);
		this.hoverColor = "rgba(var(--bs-emphasis-color-rgb), 0)";
	}
	getCache(type) {
		const cache = GM_getValue(`highscoreCache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`highscoreCache_${type}`, cache);
		console.log(`Set highscoreCache_${type} to ${JSON.stringify(cache)}`);
		return cache;
	}
	timeFunc(now) {
		return new Date(now - this.hoursLate * 1000 * 60 * 60).toLocaleDateString("en-GB", { timeZone: "UTC" });
	}
	up(diff) {
		return ` <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"></path></svg> ${diff.toLocaleString("en-US")}</span>`;
	}
	down(diff) {
		return ` <span class="text-danger"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path></svg> ${(-diff).toLocaleString("en-US")}</span>`;
	}
	same(diff) {
		return ` <span class="text-warning"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"></path></svg></span>`;
	}
	changeSelfOnly(content, type) {
		const ownStats = content.querySelector("tbody tr.fw-bold");
		if(ownStats === null)
			return;
		const timeNow = this.timeFunc(Date.now());
		let curCache = this.getCache(`${type}_self`);
		const ownRank = ownStats.children[0];
		const newVal = parseInt(ownRank.innerText.replaceAll(',', ""));
		if(curCache[1] === null)
			curCache[1] = [ timeNow, newVal ];
		else if(curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [ timeNow, newVal ];
		}
		if(curCache[0] !== null && curCache[1] !== null) {
			const diff = curCache[0][1] - curCache[1][1];
			if(diff > 0)
				ownRank.innerHTML += this.up(diff);
			else if(diff < 0)
				ownRank.innerHTML += this.down(diff);
			else
				ownRank.innerHTML += this.same(diff);
		}
		this.setCache(`${type}_self`, curCache);
	}
	change(content, type) {
		const rows = content.querySelectorAll("tbody tr");
		const timeNow = this.timeFunc(Date.now());
		let curCache = this.getCache(type);
		let newRanks = {};
		if(curCache[1] !== null && curCache[1][0] === timeNow)
			newRanks = curCache[1][1];
		for(var row of rows) {
			let user = row.children[1];
			const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
			newRanks[userID] = parseInt(row.children[0].innerText.replaceAll(',', ""));
		}
		if(curCache[1] === null)
			curCache[1] = [ timeNow, newRanks ];
		else if(curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [ timeNow, newRanks ];
		}
		if(curCache[0] !== null && curCache[1] !== null)
			for(var row of rows) {
				let user = row.children[1];
				const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
				if(userID in curCache[0][1] && userID in curCache[1][1]) {
					const diff = curCache[0][1][userID] - curCache[1][1][userID];
					if(diff > 0)
						row.children[0].innerHTML += this.up(diff);
					else if(diff < 0)
						row.children[0].innerHTML += this.down(diff);
					else
						row.children[0].innerHTML += this.same(diff);
				}
			}
		this.setCache(type, curCache);
	}
	inHighscores(url) {
		const battlestatsContainer = document.querySelector("div#v-content-battlestats");
		this.changeSelfOnly(battlestatsContainer, "Battlestats");
		observeDOM(battlestatsContainer, e => this.changeSelfOnly(e[0].target, "Battlestats"));
		const networthContainer = document.querySelector("div#v-content-networth");
		this.changeSelfOnly(networthContainer, "Networth");
		observeDOM(networthContainer, e => this.changeSelfOnly(e[0].target, "Networth"));

		const repContainer = document.querySelector("div#v-content-reputation");
		this.change(repContainer, "Reputation");
		observeDOM(repContainer, e => this.change(e[0].target, "Reputation"));
		const cartelRepContainer = document.querySelector("div#v-content-cartelreputation");
		this.change(cartelRepContainer, "Cartel Reputation");
		observeDOM(cartelRepContainer, e => this.change(e[0].target, "Cartel Reputation"));
		const attacksWonContainer = document.querySelector("div#v-content-attackswon");
		this.change(attacksWonContainer, "Attacks Won");
		observeDOM(attacksWonContainer, e => this.change(e[0].target, "Attacks Won"));

		GM_addStyle(`#highscoresTable tr:hover td > span { background-color: ${this.hoverColor} !important }`);
	}
}


class IntPerWeek {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.stats = window.location.href[window.location.href.length - 1] === '2';
	}
	inUniversityPage(url) {
		const courses = document.querySelectorAll("div#classAccordion div.accordion-item");
		let intPerDay = [];
		let maxIpd = 0;
		let minIpd = Infinity;

		for(var course of courses) {
			const data = course.children[1].children[0];
			const length = parseInt(data.children[0].children[1].children[1].innerText.split(' ')[2]);
			const intGainText = data.children[1].children[1].children[1].innerHTML.match(/\d+\s/g);
			let intGain = 0;
			for(var text of intGainText)
				intGain += parseInt(text);
			if(this.stats && data.children[1].children[1].children[1].innerHTML.includes("intelligence")) // One course gives int rather than stats
				intGain = 0;

			const ipd = 7 * intGain / length;
			intPerDay.push(ipd);
			maxIpd = Math.max(maxIpd, ipd);
			minIpd = Math.min(minIpd, ipd);
		}

		for(var i = 0; i !== courses.length; ++i) {
			const ipd = intPerDay[i];
			const colorVal = (ipd - minIpd) / (maxIpd - minIpd);
			let { children } = courses[i].children[0].children[0];
			children[children.length - 1].children[0].innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${ipd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${this.stats ? "stats" : "INT"}/week)</span>`
		}
	}
}


class ItemCache {
	constructor(darkMode, days) {
		this.brightness = darkMode ? 50 : 45;
		this.days = days;

		this.prodItemNames = [ "Bag of Fertiliser", "Agave Heart", "Coca Paste" ];
		this.itemNames = [ ...this.prodItemNames, "Cocaine", "Personal Favour" ]; // Also cache these for other scripts
	}
	getCache(type) {
		const cache = GM_getValue(`itemCache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`itemCache_${type}`, cache);
		console.log(`Set itemCache_${type} to ${cache}`);
		return cache;
	}
	getReq(type) {
		const req = GM_getValue(`prodReq_${type}`);
		return req === undefined ? null : req;
	}
	setReq(type, req) {
		GM_setValue(`prodReq_${type}`, req);
		console.log(`Set prodReq_${type} to ${req}`);
		return req;
	}
	inMarket(url) {
		const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
		if(eventCard === null)
			return;

		const eventText = eventCard.innerText.split(" - ")[1];
		const textSplit = eventText.split(' ');
		if(textSplit[1] === "listed") {
			let i = 3;
			let itemName = textSplit[i];
			while(textSplit[++i] !== "for")
				itemName += ` ${textSplit[i]}`;
			if(!this.itemNames.includes(itemName))
				return;
			const curVal = this.getCache(itemName);
			if(curVal === null)
				return;
			const amount = parseInt(textSplit[2].slice(1).replace(',', ""));
			this.setCache(itemName, curVal - amount);
		} else if(textSplit[0] === "bought") {
			let i = 2;
			let itemName = textSplit[i];
			while(textSplit[++i] !== "for")
				itemName += ` ${textSplit[i]}`;
			if(!this.itemNames.includes(itemName))
				return;
			const curVal = this.getCache(itemName);
			if(curVal === null)
				return;
			const amount = parseInt(textSplit[1].slice(1).replace(',', ""));
			this.setCache(itemName, curVal + amount);
		}
	}
	inInventory(url) {
		let itemList = document.querySelector("div.container.inventoryWrapper.pt-2");
		if(itemList === null)
			return;
		itemList = itemList.children;
		let done = [];

		for(var i = 2; i !== itemList.length; ++i) {
			const item = itemList[i];
			if(item.children.length < 2)
				continue;
			const itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
			if(!this.itemNames.includes(itemName))
				continue;
			const itemCount = parseInt(item.querySelector("span.itemQuantity").innerText.replace(",", ""));
			this.setCache(itemName, itemCount);
			done.push(itemName);
		}
		for(var itemName of this.itemNames) {
			if(!done.includes(itemName))
				this.setCache(itemName, 0);
		}
	}
	inProduction(url) {
		const containers = document.querySelectorAll("div.prodContainer div.equipmentModule div.row.flex-column");
		if(containers === null)
			return;

		const narcosPerProd = [ 25, 10, 60 ];
		const prodReqs = [ 10, 5, 35 ];
		for(var i = 2; i < containers.length; ++i) {
			const container = containers[i];
			const assignedText = container.querySelector("input.assignNarcoInput");
			const assigned = parseInt(assignedText.value);
			const prodReq = Math.ceil(assigned / narcosPerProd[i - 2]) * prodReqs[i - 2];
			this.setReq(this.prodItemNames[i - 2], prodReq);
		}
	}
	inJobs(url) {
		const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
		const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
		if(jobPanels === null || buttons.length <= 1)
			return;

		for(var i = 4; i !== 8; ++i) {
			let jobPanel = jobPanels[i];
			let append = `<hr class="w-75"><p class="text-center">`;
			if(i !== 7) {
				const have = this.getCache(this.prodItemNames[i - 4]);
				const prodReq = this.getReq(this.prodItemNames[i - 4]);
				if(prodReq === null)
					append += `Have <span class="text-muted">???</span>`;
				else if(prodReq === 0)
					append += "None needed";
				else if(have === null)
					append += `Have <span class="text-muted">???/${prodReq}</span>`;
				else
					append += `Have <span class="fw-bold" style="color: hsl(${prodReq === 0 ? 120 : Math.min(have / (prodReq * this.days), 1) * 120}, 67%, ${this.brightness}%)">${have.toLocaleString("en-US")}/${prodReq}</span>`;
			} else
				append += "None needed";
			append += " for production</p>";
			jobPanel.innerHTML += append;
		}
	}
}


class LargerGymGraph {
	constructor() {
		this.newHeight = 400;
		this.factor = 1.12;
	}
	inGym(url) {
		let container = document.querySelector("div#graphContainer div.card-body div");
		if(container === null)
			return;
		container.style.maxHeight = `${this.newHeight * this.factor}px`;
		let graph = container.querySelector("canvas#gymGraph");
		graph.style.height = `${this.newHeight * this.factor}px`;
		graph.height = this.newHeight;
	}
}


class PropertyPageAgentLink {
    constructor() {
        this.add = `
            <div class="row">
                <div class="col-12">
                    <div class="header-section">
                        <h2>Estate Agent</h2>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Go to the <a class="text-white" href="/Town/EstateAgent">Estate Agent</a> to view other properties.</p>
            </div>`;
    }

    inProperty(url) {
        // Find the correct container for the tabs and content
        let container = document.querySelector("#cartelPerksNav");
        console.log("Container element found:", container);

        if (!container) {
            console.error("Container not found!");
            return;
        }

        // Remove the default button
        const defaultButton = container.querySelector("div.gap-2.d-flex");
        if (defaultButton !== null) {
            console.log("Removing default button.");
            defaultButton.remove();
        } else {
            console.log("No default button found.");
        }

        // Check if combined content already exists
        if (container.querySelector("#combined-content")) {
            console.log("Combined content already exists, skipping creation.");
            return; // If it exists, exit the function
        }

        // Locate the tabs and their corresponding content
        const tabs = container.querySelectorAll(".nav-link");
        const tabContents = container.querySelectorAll(".tab-content .tab-pane");

        console.log("Tabs found:", tabs.length);
        console.log("Tab contents found:", tabContents.length);

        // Create the estate agent section
        let agentSection = document.createElement("div");
        agentSection.classList.add("mb-4", "card");
        agentSection.innerHTML = this.add;

        // Create the combined card with all content
        let combinedCard = document.createElement("div");
        combinedCard.id = "combined-content"; // Add an ID for easier reference
        combinedCard.classList.add("mb-4", "card");
        combinedCard.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h4 class="header-section">Home Details</h4>
                    <div class="card-body">
                        ${document.querySelector("#v-content-home")?.innerHTML || 'No home content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Vault</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-safe")?.innerHTML || 'No vault content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Upgrades</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-upgrades")?.innerHTML || 'No upgrades content available.'}
                    </div>
                </div>
            </div>
        `;

        // Hide tabs
        tabs.forEach((tab, index) => {
            console.log(`Hiding tab ${index}:`, tab);
            tab.classList.add('d-none');
        });

        // Remove all existing tab content
        tabContents.forEach((content, index) => {
            console.log(`Removing tab content ${index}:`, content);
            content.remove();
        });

        // Check if there is any element with the class 'mb-4 card border-success'
        var successCard = container.querySelector('.mb-4.card.border-success');
        console.log("Success card found:", successCard);

        if (!successCard) {
            // If no such element exists, append the estate agent section first
            console.log("No success card found, appending agent section at the top.");
            container.insertBefore(agentSection, container.firstChild);
        } else {
            // Otherwise, insert it after the 'mb-4 card border-success' element
            console.log("Success card found, inserting agent section after it.");
            container.insertBefore(agentSection, successCard.nextSibling);
        }

        // Append the new combined card
        console.log("Appending combined card.");
        container.appendChild(combinedCard);
    }
}


class RedLeaveCourseButton {
	constructor() {
		this.redClassName = "bg-danger";
	}
	inUniversity(url) {
		const leaveButtons = document.querySelectorAll("button.leaveCourseBtn");
		for(var button of leaveButtons)
			button.classList.add(this.redClassName);
	}
}


class RemoveOwnStatus {
    // Immediately execute the static method upon class definition
    static {
        // Find the "Status" label and its corresponding row
        const labels = Array.from(document.querySelectorAll("p.fw-bold"));
        const statusLabel = labels.find(label => label.textContent.trim() === 'Status');
        const statusRow = statusLabel ? statusLabel.closest('.row') : null;

        if (statusRow) {
            // Find and remove the cells containing the "Status" label and value
            const statusLabelIndex = Array.from(statusRow.children).findIndex(child => child.textContent.trim() === 'Status');
            if (statusLabelIndex >= 0) {
                statusRow.children[statusLabelIndex].remove(); // Remove the label's parent container
                if (statusRow.children[statusLabelIndex]) {
                    statusRow.children[statusLabelIndex].remove(); // Remove the value's container
                }
            }
        }
    }
}


class RoundedCards {
	constructor() {}
	inAnywhere() {
		GM_addStyle(".contentColumn .card.border-success > .card-body.bg-success, .contentColumn .card.border-danger > .card-body.bg-danger, .contentColumn .card.border-warning > .card-body.bg-warning { border-radius: 10px !important }");
	}
}


class ScriptSettings {
	constructor() {
		this.name = "megascript-settings";
		this.fullName = "Megascript Settings";
	}
	inSettings(URL) {
		let navTabs = document.querySelector("#settingsNav .nav-tabs");
		let tabContent = document.querySelector("#settingsNav .tab-content");
		if(navTabs === null || tabContent === null)
			return;

		const urlParams = new URLSearchParams(window.location.search);
		const selected = urlParams.get("t") === this.name;

		let button = document.createElement("button");
		button.id = `v-tab-${this.name}`;
		button.classList.add("nav-link", "settings-nav-link");
		if(selected)
			button.classList.add("active");
		button.setAttribute("data-bs-toggle", "tab");
		button.setAttribute("data-bs-target", `#v-content-${this.name}`);
		button.type = "button";
		button.role = "tab";
		button.setAttribute("aria-controls", `v-content-${this.name}`);
		button.setAttribute("aria-selected", selected.toString());
		button.setAttribute("tab", this.name);
		if(!selected)
			button.setAttribute("tabindex", "-1");
		button.innerText = this.fullName;
		navTabs.append(button);
		let tab = document.createElement("div");
		tab.classList.add("tab-pane", "fade");
		if(selected)
			tab.classList.add("active", "show");
		tab.id = `v-content-${this.name}`;
		tab.setAttribute("role", "tabpanel");
		tab.setAttribute("aria-labelledby", `v-tab-${this.name}`);
		tab.innerHTML = `<div class="card"><div class="card-body"> <h5 class="h5">${this.fullName}</h5><p class="card-text">Currently there's no toggleable script settings.</p></div></div>`;
		tabContent.appendChild(tab);
		//navTabs.innerHTML += `<button class="nav-link settings-nav-link${selected ? " active" : ""}" id="v-tab-${this.name}" data-bs-toggle="tab" data-bs-target="#v-content-${this.name}" type="button" role="tab" aria-controls="v-content-${this.name}" aria-selected="${selected.toString()}" tab="${this.name}"${selected ? "" : 'tabindex="-1"'}>${this.fullName}</button>`;
		//tabContent.innerHTML += `<div class="tab-pane fade${selected ? " active show" : ""}" id="v-content-${this.name}" role="tabpanel" aria-labelledby="v-tab-${this.name}"><div class="card"><div class="card-body"> <h5 class="h5">${this.fullName}</h5><p class="card-text">Currently there's no toggleable script settings, but if you want a minor change done you can message me in-game (<a href="/User/781">K9ER</a>) or on Discord (k9er.), and I'll likely do it for free.</p></div></div></div>`;
	}
}


class StatEstimate {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;
		this.statEstimateLink = "/StatEstimates";
		this.statEstimateRegex = /^statestimates(\/|(\/\d+\/?)?(\?.+)?)?/;

		this.currentList = this.getList();
		if(this.currentList === null) {
			this.currentList = [];
			this.setList([]);
		}
		//GM_deleteValue("statEstimate_40");
		//this.currentList = this.currentList.filter(x=>x != 40);
		this.ownID = user_id;
		this.ownStats = this.getEst("self");

		this.constant = 8 / 3;
		this.maxFF = 3;
		this.minFF = 1;
		this.cutoff = 0.01; // Can't be certain whether it truncates or rounds, use the more conservative estimate
		this.repQuadratic = false;
		if(this.repQuadratic) {
			this.repA = 53 / 990;
			this.repC = 48 / 3;
		} else {
			this.repM = 0.049;
			this.repC = 2.7;
		}
		this.minStats = 400;
		this.multMug = 1 / 2;
		this.multHosp = 3 / 4;
		this.perPage = 50;
	}
	getEst(ID = "self") {
		const val = GM_getValue(`statEstimate_${ID}`);
		return val === undefined ? null : val;
	}
	setEst(ID, estimate) {
		GM_setValue(`statEstimate_${ID}`, estimate);
		console.log(`Set statEstimate_${ID} to "${estimate}"`);
		return estimate;
	}
	getList() {
		const list = GM_getValue("statEstimate_list");
		return list === undefined ? null : list;
	}
	setList(list) {
		GM_setValue("statEstimate_list", list);
		return list;
	}
	getName(ID) {
		const name = GM_getValue(`name_${ID}`);
		return name === undefined ? null : name;
	}
	setName(ID, name) {
		GM_setValue(`name_${ID}`, name);
		console.log(`Set name_${ID} to "${name}"`);
		return name;
	}
	calcFairFight(ownStats, theirStats) {
		return Math.min(this.maxFF, Math.max(this.minFF, 1 + this.constant * theirStats / ownStats));
	}
	estimateRep(level, fairFight) {
		return (this.repQuadratic ? Math.pow(level + 1, 2) * this.repA + this.repC : Math.exp(level * this.repM + this.repC)) * fairFight;
	}
	estimateYouAttacked(ownStats, fairFight) {
		if(fairFight === this.minFF)
			return [ '<', Math.ceil(this.cutoff / this.constant * ownStats).toLocaleString("en-US") ];
		return [ fairFight === this.maxFF ? '>' : '~', Math.floor(Math.max(this.minStats, (fairFight - 1) / this.constant * ownStats)).toLocaleString("en-US") ];
	}
	estimateAttackedYou(ownStats, fairFight) {
		if(fairFight === this.minFF)
			return [ '>', Math.floor(this.constant * ownStats / this.cutoff).toLocaleString("en-US") ];
		return [ fairFight === this.maxFF ? '<' : '~', Math.ceil(Math.max(this.minStats, this.constant * ownStats / (fairFight - 1))).toLocaleString("en-US") ];
	}
	AattackedB(knownStatsText, fairFight, knownIsA) {
		const knownChar = knownStatsText[0];
		const knownStats = parseInt(knownStatsText.split(' ')[0].slice(1).replaceAll(',', ""));
		const theirStats = (knownIsA ? this.estimateYouAttacked : this.estimateAttackedYou).bind(this)(knownStats, fairFight);
		if(knownChar === '~')
			return theirStats;
		else if(knownChar === '>' && fairFight === (knownIsA ? this.minFF : this.maxFF))
			return [];
		else if(knownChar === '<' && fairFight === (knownIsA ? this.maxFF : this.minFF))
			return [];
		return [ knownChar, theirStats[1] ];
	}
	dontOverride(curStatEst, newStatEst, curChar, newChar) {
		if(curChar === '>' && newChar === '>' && curStatEst > newStatEst)
			return true;
		else if(curChar === '~' && newChar !== '~') {
			if(newChar === '>' && curStatEst > newStatEst)
				return true;
			else if(newChar === '<' && curStatEst > newStatEst)
				return true;
		}
		return false;
	}
	colorVal(ownStats, theirStats) {
		return ownStats ? ownStats / (ownStats + theirStats) : 0.5;
	}
	unColorVal(ownStats, theirStats) { // Unused
		return ownStats ? 67 * ownStats / (ownStats + theirStats) : 0;
	}
	scriptFunc() {
		$(() => {
			$("#userSearchName").on("input", target => {
				$.get(`/User/SearchName?search=${target.currentTarget.value}`, result => {
					if(result && result.status == 204) {
						$("#userInput").attr("value", "");
						$("#userInputActual").attr("value", "");
						$("#userName").attr("value", "");
					} else {
						$("#userInput").attr("value", result.userId);
						$("#userInputActual").attr("value", result.userId);
						$("#userName").attr("value", result.name.toUpperCase());
					}
					validateSend();
				});
			});

			$("#stats").on("input", () => validateSend());
		});
		function validateSend() {
			var allValid = true;

			if((typeof $("#userName").attr("value")) === "undefined") {
				allValid = false;
				$("#userInput").removeClass("is-invalid");
			} else if($("#userName").attr("value") == "") {
				$("#userInput").addClass("is-invalid");
				allValid = false;
			} else
				$("#userInput").removeClass("is-invalid");

			let statsInput = document.getElementById("stats");
			if(!statsInput) {
				allValid = false;
				$("#stats").removeClass("is-invalid");
			} else if(statsInput.value.length === 0 || !/^\d[\d,]*$/.test(statsInput.value)) {
				$("#stats").addClass("is-invalid");
				allValid = false;
			} else {
				$("#stats").removeClass("is-invalid");
				statsInput.value = parseInt(statsInput.value.replaceAll(',', "")).toLocaleString("en-US");
			}

			if(allValid)
				$("#addEstimate").attr("disabled", false);
			else
				$("#addEstimate").attr("disabled", true);
		}
	}
	inStatEstimate(url) {
		document.title = "Stat Estimates | Cartel Empire";
		const ownName = user_name;
		if(!this.ownStats) {
			let errorText = document.querySelector("div.content-container.contentColumn strong");
			errorText.innerHTML = `You haven't set your own stats yet! Visit <a class="text-white" href="/Gym">the gym</a> or <a class="text-white" href="/user">the homepage</a>`;
			return;
		}
		let container = document.querySelector("div.content-container.contentColumn");

		const urlParams = new URLSearchParams(window.location.search);
		const userID = urlParams.get("userId");
		const userName = urlParams.get("userName");
		const statEst = urlParams.get("stats");
		const deleteID = urlParams.get("delete");
		if(ownName !== userName && userID !== null && userName !== null && statEst !== null) {
			this.setEst(userID, `~${statEst} ${Date.now()} 0`);
			if(!this.currentList.includes(parseInt(userID))) {
				this.currentList.push(parseInt(userID));
				this.setList(this.currentList);
			}
			this.setName(userID, userName);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Set the stat estimate for <a class="text-white" href="/User/${userID}">${userName}</a> to ${statEst}</p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else if(deleteID !== null) {
			GM_deleteValue(`statEstimate_${deleteID}`);
			this.currentList = this.currentList.filter(estID => estID !== parseInt(deleteID));
			this.setList(this.currentList);
			const userName = this.getName(deleteID);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Removed the stat estimate for <a class="text-white" href="/User/${deleteID}">${userName}</a></p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else
			container.innerHTML = "";

		let extractedData = [];
		const ownData = [ ownName, "self", '~', this.ownStats, "---", 0 ];
		extractedData.push(ownData);
		for(var ID of this.currentList) {
			const estimate = this.getEst(ID);
			if(estimate === null) {
				this.currentList = this.currentList.filter(estID => estID !== ID);
				continue;
			}
			const textSplit = estimate.split(' ');
			extractedData.push([ this.getName(ID) || "???", ID, estimate[0], parseInt(textSplit[0].slice(1).replaceAll(',', "")), parseInt(textSplit[1]), parseInt(textSplit[2]) ]);
		}
		extractedData.sort((a, b) => {
			if(a[3] !== b[3])
				return b[3] - a[3];
			else if(a[2] === '>' && b[2] !== '>')
				return -1;
			else if(b[2] === '>' && a[2] !== '>')
				return 1;
			else if(b[2] === '<' && a[2] !== '<')
				return -1;
			else if(a[2] === '<' && b[2] !== '<')
				return 1;
			return 0;
		});
		const ownRank = extractedData.indexOf(ownData);
		const pageNumText = url.replace('#', "").match(/\/\d+\/?$/);
		let pageNum = pageNumText === null ? Math.ceil(ownRank / this.perPage) : parseInt(pageNumText[0].replaceAll('/', ""));
		if(pageNum === 0)
			pageNum = 1;

		let navHTML = "";
		let insert = "";
		let muted = false;
		let added = false;
		for(var i = (pageNum - 1) * this.perPage; i >= 0 && i < extractedData.length && i !== pageNum * this.perPage; ++i) {
			added = true;
			const data = extractedData[i];
			if(!muted && data[3] < this.ownStats * (this.maxFF - 1) / this.constant)
				muted = true;
			if(data[1] === "self")
				insert += `<tr class="align-middle fw-bold"><td>${i + 1}</td><th><a class="fw-bold" href="/user">${ownName}</a></th><td><span style="color: hsl(60, 67%, ${this.brightness}%)">${this.ownStats.toLocaleString("en-US")}</span></td><td>---</td><td></td></tr>`;
			else {
				insert += `<tr class="align-middle"><td${muted ? " class='text-muted'" : ""}>${i + 1}</td><th><a class="fw-bold" href="/User/${data[1]}">${data[0]}</a></th><td><span class="fw-bold">${data[2] === '~' ? "" : data[2].replace('>', "&gt;").replace('<', "&lt;")}</span><span style="color: hsl(${this.ownStats / (this.ownStats + data[3]) * 120}, 67%, ${this.brightness}%)">${data[3].toLocaleString("en-US")}</span></td>`;
				const dateStr = new Date(data[4]).toLocaleDateString("en-GB", { timeZone: "Europe/London" });
				if(data[5] === 0)
					insert += `<td><span style="color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1))">${dateStr}</span></td>`;
				else
					insert += `<td><a href="/Fight/${data[5]}">${dateStr}</a></td>`;
				insert += `<td><button onclick="window.location.href += '?delete=${data[1]}'" title="Delete" aria-label="Delete stat estimate for ${data[0]}" class="btn btn-sm btn-outline-dark action-btn fw-normal p-0"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" height="20" width="20"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></button></td></tr>`;
			}
		}
		if(!added)
			insert = `<p class="card-text mt-4">You have no estimates</p>`;
		else {
			insert = `<table class="table align-items-center table-flush table-hover dark-tertiary-bg" id="statEstimateTable"><thead class="thead-light"><tr><th>Rank</th><th>Name</th><th>Estimate</th><th class="d-none d-lg-table-cell">Date of Estimate</th><th class="d-table-cell d-lg-none">Date</th><th>Delete</th></tr></thead><tbody>${insert}</tbody></table>`;
			const lastPageNum = Math.ceil(extractedData.length / this.perPage);
			navHTML = `<nav aria-label="Stat Estimates Page"><ul class="pagination justify-content-center"><li class="page-item${pageNum === 1 ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/1" data-page="1">1</a></li>`;
			if(pageNum >= 5)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum - 1}" data-page="${pageNum - 1}">&lt;- </a></li>`;
			for(var i = Math.max(2, pageNum - 2); i <= Math.min(lastPageNum - 1, pageNum + 2); ++i)
				navHTML += `<li class="page-item${pageNum === i ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${i}" data-page="${i}">${i}</a></li>`;
			if(pageNum <= lastPageNum - 4)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum + 1}" data-page="${pageNum + 1}">-&gt; </a></li>`;
			if(lastPageNum !== 1)
				navHTML += `<li class="page-item${pageNum === lastPageNum ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${lastPageNum}" data-page="${lastPageNum}">${lastPageNum}</a></li>`;
			navHTML += `</ul></nav>`;
		}

		let script = document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = this.scriptFunc.toString().replace(/^[^{]*{/, "").replace(/}[^}]*$/, "");
		document.head.appendChild(script);

		let fileInput = document.createElement("input");
		fileInput.id = "fileInput";
		fileInput.type = "file";
		fileInput.classList.add("d-none");
		fileInput.addEventListener("input", async e => {
			const file = e.target.files[0];
			if(file.type !== "application/json")
				return;
			const contentText = await file.text();
			const content = JSON.parse(contentText);
			for(var entry of content) {
				const userName = entry[0];
				const userID = entry[1];
				if(userID == this.ownID)
					continue;
				if(userName !== "???" && userName !== this.getName(userID))
					this.setName(userID, userName);
				const curEst = this.getEst(userID);
				if(curEst === null || entry[4] > parseInt(curEst.split(' ')[1])) {
					this.setEst(userID, `${entry[2]}${entry[3].toLocaleString("en-US")} ${entry[4]} ${entry[5]}`);
					if(!this.currentList.includes(userID)) {
						this.currentList.push(userID);
						this.setList(this.currentList);
					}
				}
			}
			window.location.reload();
		});

		const exportText = JSON.stringify(extractedData.filter(data => data[1] !== "self"));
		const fileBlob = new Blob([ exportText ], { type: "application/octet-binary" });
		const exportURL = window.URL.createObjectURL(fileBlob);
		const exportImport = `<div class="row align-items-center mb-4"><span class="text-center fw-bold">Export/Import Estimates</span></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" href="${exportURL}" download="stat_estimates.json">Export</a></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" onclick="document.getElementById('fileInput').click()">Import and Merge</a></div>`;
		const newEntryHTML = `<div class="row"><div class="col-12 col-sm-8 mb-3"><form id="addEstimateForm" class="mt-auto"><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="searchLabel">Search</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control" type="text" placeholder="Diablo" autofill="false" id="userSearchName"></div></div></div><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="usernameLabel">Player</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control is-invalid" name="userId" type="number" placeholder="1" min="1" disabled="" id="userInput" value=""><input class="form-control d-none" name="userId" type="number" placeholder="1" min="1" id="userInputActual" value=""><input class="form-control" name="userName" type="text" placeholder="Diablo" id="userName" value="" readonly></div></div></div><div class="row align-items-center"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="stats">Stats</label></div><div class="col-12 col-sm-9"><input class="form-control is-invalid" name="stats" type="text" placeholder="Enter player's stats" maxlength="20" required="true" autofill="false" id="stats"></div></div><input class="btn btn-outline-dark w-100 mt-4" type="submit" value="Add estimate" disabled="" id="addEstimate"></form></div><div class="col-12 col-sm-4">${exportImport}</div></div>`;
		container.innerHTML += `<div class="col-12 col-md-10"><div class="card mb-2"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Battlestat Estimates</h2></div></div></div><div class="card-body">${newEntryHTML}<hr><div class="tab-pane fade active show" role="tabpanel"><div class="row mb-2 align-items-center">${navHTML}<div class="container">${insert}</div></div></div></div></div></div>`;
		container.appendChild(fileInput);
	}
	inSearch(url) {
		const table = document.querySelector("#userTable");

		const tableHeadTr = table.querySelector("thead tr");
		let ageCol = tableHeadTr.querySelectorAll("th")[2];
		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, ageCol);

		const entries = table.querySelectorAll("tbody tr");
		for(var entry of entries) {
			ageCol = entry.querySelectorAll("td")[1];
			statEstCol = document.createElement("td");

			const userLink = entry.querySelector("th").children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if(statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.innerText; // Don't really need username of everyone
				if(userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if(userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, ageCol);
		}
	}
	inBountyOrOtherCartel(url) {
		const table = document.querySelector("div.table-responsive table.table");
		if(table === null)
			return;

		const tableHeadTr = table.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];
		let statEstCol = document.createElement("th");
		if(/^cartel/.test(url))
			statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);

		let entries;
		let start = 0;
		let linkIdx = 1;
		if(/^cartel/.test(url)) {
			entries = table.querySelectorAll("tbody tr");
			if(/\d\/?$/.test(url))
				linkIdx = 0;
		} else {
			entries = table.querySelectorAll("thead tr");
			start = 1;
			linkIdx = 0;
		}
		for(var i = start; i !== entries.length; ++i) {
			let entry = entries[i];
			const tds = entry.querySelectorAll("td");
			levelCol = tds[1];
			statEstCol = document.createElement("td");

			const userLink = tds[0].children[linkIdx];
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if(statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.innerText; // Don't really need username of everyone
				if(userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if(userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
		}
	}
	inCartelHomepage(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		if(table === null)
			return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[1];
		let roleCol;
		let daysCol = tableHead.querySelectorAll(".col")[3];
		let statEstCol = document.createElement("div");
		statEstCol.classList.add("col", "col-xl-2");
		statEstCol.innerText = "Stat Estimate";
		tableHead.insertBefore(statEstCol, levelCol);
		levelCol.classList.remove("col-xl-2");
		levelCol.classList.add("col-xl-1");
		daysCol.classList.remove("col-xl-2");
		daysCol.classList.add("col-xl-1");

		let entries = table.querySelectorAll(".row.align-middle");
		for(var i = 0; i !== entries.length; ++i) {
			let entry = entries[i];
			const cols = entry.querySelectorAll(".col");
			const headerCols = entry.querySelectorAll(".col-3.fw-bold");
			levelCol = cols[1];
			roleCol = cols[2];
			daysCol = cols[3];
			let levelHeaderCol = headerCols[0];
			let roleHeaderCol = headerCols[1];
			let daysHeaderCol = headerCols[2];
			statEstCol = document.createElement("div");
			let statEstColHeader = document.createElement("div");
			statEstCol.classList.add("col", "col-3", "col-xl-2");
			statEstColHeader.classList.add("col-3", "d-xl-none", "fw-bold");
			levelCol.classList.remove("col-xl-2", "col-3");
			levelCol.classList.add("col-xl-1", "col-2");
			daysCol.classList.remove("col-xl-2", "col-3");
			daysCol.classList.add("col-xl-1", "col-2");
			roleCol.classList.remove("col-3");
			roleCol.classList.add("col-2");
			levelHeaderCol.classList.remove("col-3");
			levelHeaderCol.classList.add("col-2");
			roleHeaderCol.classList.remove("col-3");
			roleHeaderCol.classList.add("col-2");
			daysHeaderCol.classList.remove("col-3");
			daysHeaderCol.classList.add("col-2");
			statEstColHeader.innerText = "Stat Estimate";

			const userLink = cols[0].children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if(statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.innerText; // Don't really need username of everyone
				if(userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if(userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
			entry.insertBefore(statEstColHeader, levelHeaderCol);
		}
	}
	inCartelWar(url) {
		const war = document.querySelector("div#warReportModule");
		let cols = war.querySelectorAll("div.col-12.col-lg-6");
		cols[0].classList.remove("col-lg-6");
		cols[0].classList.add("col-lg-7");
		cols[1].classList.remove("col-lg-6");
		cols[1].classList.add("col-lg-5");

		const theirTable = cols[0].querySelector("table.table");
		const tableHeadTr = theirTable.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];
		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);
		const tableBody = theirTable.querySelector("tbody");

		observeDOM(theirTable, e => {
			if(e[0].target !== tableBody)
				return;
			let trs = tableBody.querySelectorAll("tr");
			for(var tr of trs) {
				const tds = tr.querySelectorAll("td");
				levelCol = tds[1];
				statEstCol = document.createElement("td");

				let statusCol = tds[2];
				if(statusCol.innerText === "Active") // Highlight actives in war
					statusCol.classList.add("fw-bold");
				else
					statusCol.classList.add("text-muted");

				const userLink = tds[0].children[0];
				const userID = userLink.href.match(/\d+$/)[0];

				const statEst = this.getEst(userID);
				if(statEst !== null) {
					const theirStatsText = statEst.split(' ')[0];
					const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
					statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

					const userName = userLink.innerText;
					if(userName !== this.getName(userID))
						this.setName(userID, userName);
				} else {
					statEstCol.classList.add("text-muted");
					statEstCol.innerText = "---";
				}
				tr.insertBefore(statEstCol, levelCol);
			}
		});
	}
    inHomepage(url) {
        try {
            // Grab the stats container and rows
            const stats = document.querySelectorAll("div.mb-4.card.flex-fill")[1];
            const statRows = stats?.querySelectorAll(".row.align-items-center.gy-2.mb-2");

            // Ensure stats and rows are found
            if (stats && statRows?.length > 0) {
                const fifthSpan = statRows[0].querySelector("div:last-of-type > p");  // Get last p in the first row
                const statText = (fifthSpan.lastChild ?? fifthSpan)?.textContent.replace(/\D/g, "");
                const statValue = statText ? parseInt(statText, 10) : 0;

                // If value has changed, update
                if (this.ownStats !== statValue && statValue !== 0) {
                    console.log("Updating ownStats");
                    this.setEst("self", statValue);
                }
            } else {
                console.error("Stats or stat rows not found");
            }
        } catch (error) {
            console.error("Error in inHomepage:", error);
        }
    }

	inGym(url) {
		const totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Total is the first one
		if(totalStats === null)
			return;
		const totalStatsVal = parseInt(totalStats.innerText.split(' ')[0].slice(1).replaceAll(',', ""));

		if(this.ownStats !== totalStatsVal)
			this.setEst("self", totalStatsVal);
	}
	inFight(url) {
		const showEsts = (nameA, nameB, A_ID, B_ID, Anew = false, Bnew = false) => {
			let container = document.querySelector("div.contentColumn");
			const fightReport = container.querySelector("div.col-12.col-md-10");
			let ests = document.createElement("div");
			ests.classList.add("col-12", "col-md-10");
			const estA = A_ID === "self" ? (this.ownStats ? this.ownStats.toLocaleString("en-US") : "???") : (this.getEst(A_ID) || "???");
			const estB = this.getEst(B_ID) || "???";
			let inner = `<div class="row"><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2>`;
			inner += nameA === "You" ? "You" : `<a class="text-white" href="/${A_ID === "self" ? "user" : ("User/" + A_ID)}">${nameA}</a>`;
			inner += `</h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if(estA === "???")
				inner += `<span class="text-muted">???</span>`;
			else {
				const Astats = parseInt(estA.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Astats) * 120}, 67%, ${this.brightness}%)">${estA.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Anew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2><a class="text-white" href="/${"User/" + B_ID}">${nameB}</a></h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if(estB === "???")
				inner += `<span class="text-muted">???</span>`;
			else {
				const Bstats = parseInt(estB.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Bstats) * 120}, 67%, ${this.brightness}%)">${estB.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Bnew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div></div>`;
			ests.innerHTML = inner;
			container.insertBefore(ests, fightReport);
		}

		const firstRow = document.querySelector("div.fightTable tbody tr td");
		const youAttacked = firstRow.innerText.startsWith("You ");
		const attackedYou = firstRow.innerText.endsWith(" you");
		const estimate = youAttacked ? this.estimateYouAttacked.bind(this) : attackedYou ? this.estimateAttackedYou.bind(this) : this.AattackedB.bind(this);

		const headers = document.querySelectorAll("div.card-body p.card-text.fw-bold");
		if(!this.ownStats || headers.length < 3 || (headers[0].innerText.split(' ')[2] === "Loss" && !attackedYou)) {
			if(firstRow.children.length === 1) {
				const other = firstRow.children[0];
				showEsts("You", other.innerText, "self", other.href.match(/\d+$/)[0]);
			} else {
				const userA = firstRow.children[0];
				const userB = firstRow.children[1];
				showEsts(userA.innerText, userB.innerText, userA.href.match(/\d+$/)[0], userB.href.match(/\d+$/)[0]);
			}
			return;
		}
		const fairFightText = headers[1];
		const fairFight = parseFloat(fairFightText.children[0].innerText.slice(1));
		const dateText = headers[headers.length - 1].innerText.slice(7).split(/[ :\/]/g);
		const fightDate = Date.UTC(dateText[5], parseInt(dateText[4]) - 1, dateText[3], dateText[0], dateText[1], dateText[2]);

		let fightID = url.replace('#', "").match(/\d+\/?$/)[0];
		if(fightID.endsWith('/'))
			fightID = fightID.slice(0, -1);

		// Method: replace old log with new log, but only if it's more extreme OR specific
		if(youAttacked || attackedYou) {
			const userLink = firstRow.children[0];
			const againstID = userLink.href.match(/\d+$/)[0];
			const currentEstimate = this.getEst(againstID);

			const userName = userLink.innerText;
			if(userName !== this.getName(againstID))
				this.setName(againstID, userName);

			if(currentEstimate === null || fightDate > parseInt(currentEstimate.split(' ')[1])) {
				const est = estimate(this.ownStats, fairFight);
				const newStatEst = parseInt(est[1].replace(',', ""));
				if(currentEstimate !== null) {
					const curStatEst = parseInt(currentEstimate.split(' ')[0].slice(1).replace(',', ""));
					if(this.dontOverride(curStatEst, newStatEst, currentEstimate[0], est[0])) {
						showEsts("You", userName, "self", againstID);
						return;
					}
				}

				this.setEst(againstID, `${est[0]}${est[1]} ${fightDate} ${fightID}`);
				if(!this.currentList.includes(parseInt(againstID))) {
					this.currentList.push(parseInt(againstID));
					this.setList(this.currentList);
				}
			}
			showEsts("You", userName, "self", againstID, false, true);
		} else {
			// Indirect attack logs
			const userA = firstRow.children[0];
			const userB = firstRow.children[1];
			const A_ID = userA.href.match(/\d+$/)[0];
			const B_ID = userB.href.match(/\d+$/)[0];
			const Astats = this.getEst(A_ID);
			const Bstats = this.getEst(B_ID);
			if(Astats !== null && Bstats !== null) {
				const Adate = parseInt(Astats.split(' ')[1]);
				const Bdate = parseInt(Bstats.split(' ')[1]);
				if(Adate === Bdate || fightDate <= Adate || fightDate <= Bdate) {
					showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
					return;
				}

				const newerStats = Adate > Bdate ? Astats : Bstats;
				const otherEst = estimate(newerStats, fairFight, Adate > Bdate);
				if(otherEst.length === 0) {
					showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
					return;
				}
				const oldEst = Adate > Bdate ? Bstats : Astats;
				console.log(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0]);
				if(this.dontOverride(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0])) {
					showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
					return;
				}
				console.log("hi");
				const otherID = Adate > Bdate ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${newerStats.split(' ')[1]} ${fightID}`);
				if(!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.innerText, userB.innerText, A_ID, B_ID, Adate <= Bdate, Adate > Bdate);
			} else if((Astats !== null && Bstats === null) || (Astats === null && Bstats !== null)) {
				const knownStats = Astats !== null ? Astats : Bstats;
				const knownDate = parseInt(knownStats.split(' ')[1]);
				if(fightDate <= knownDate) {
					showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
					return;
				}

				const otherEst = estimate(knownStats, fairFight, Astats !== null);
				if(otherEst.length === 0) {
					showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
					return;
				}
				const otherID = Astats !== null ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${knownDate} ${fightID}`);
				if(!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.innerText, userB.innerText, A_ID, B_ID, Astats === null, Astats !== null);
				const otherUser = Astats !== null ? userB : userA;
				const userName = otherUser.innerText;
				if(userName !== this.getName(otherID))
					this.setName(otherID, userName);
			} else
				showEsts(userA.innerText, userB.innerText, A_ID, B_ID);
		}
	}
	inUserProfile(url) {
		let userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if(userID.endsWith('/'))
			userID = userID.slice(0, -1);
		if(userID === this.ownID)
			return;

		let statsTable = document.querySelector("div.card-body tbody");
		const estimate = this.getEst(userID);

		const attackText = document.querySelector("div#attackConfirmModal p.card-text");
		const level = parseInt(statsTable.children[4].children[1].innerText);
		const repMultipliers = {
			Attack: 1,
			Mug: this.multMug,
			Hospitalise: this.multHosp
		};
		let prefix = "";
		let append = "";
		let expectedRep = 0;

		if(estimate !== null) {
			const textSplit = estimate.split(' ');
			const statEstimate = textSplit[0];
			const date = new Date(parseInt(textSplit[1])).toLocaleDateString("en-GB", { timeZone: "Europe/London" });

			const theirStats = parseInt(statEstimate.slice(1).replaceAll(',', ""));
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%)">${statEstimate.replace('>', "&gt;").replace('<', "&lt;")}</a> (${date})</td></tr>`;

			expectedRep = this.ownStats ? this.estimateRep(level, this.calcFairFight(this.ownStats, theirStats)) : "???";
			prefix = statEstimate[0].replace('~', "");
		} else {
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="text-muted">No attacks recorded</a></td></tr>`;
			expectedRep = this.estimateRep(level, this.maxFF);
			append = " with 3x fair fight modifier";
		}
		observeDOM(attackText, e => {
			const textSplit = e[0].target.innerText.split(' ');
			let attackType = textSplit[textSplit.length - 2];
            attackType = attackType.charAt(0).toUpperCase() + attackType.slice(1);
			if(![ "Attack", "Mug", "Hospitalise" ].includes(attackType))
				return;
			e[0].target.innerHTML += `<br>Expected rep gain: <span class="fw-bold">${prefix.replace('>', "&gt;").replace('<', "&lt;")}${expectedRep === "???" ? "???" : Math.round(expectedRep * repMultipliers[attackType])}</span>${append}`;
		});

		const userName = document.querySelector("div.header-section > .profileNameTitle").innerText;
		if(userName !== this.getName(userID))
			this.setName(userID, userName);
	}
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if(category !== "Attack")
			return;

		const eventList = document.querySelector("div.container.eventWrapper").children;
		for(var i = 1; i !== eventList.length; ++i) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-2 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-7 col-sm-7"; //"col-5 col-lg-6 col-md-5 col-sm-6";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";
			let estCol = document.createElement("div");
			let mergedCol = document.createElement("div");
			estCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new

			if(i === 1) {
				estCol.innerText = "Stat Estimate";
				mergedCol.innerText = "Date/Est";
				ev.insertBefore(estCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			const userID = parseInt(ev.children[1].querySelector("a").href.match(/\d+$/)[0]);
			const theirStats = this.getEst(userID);
			if(theirStats !== null) {
				estCol.style.color = `hsl(${this.colorVal(this.ownStats, parseInt(theirStats.split(' ')[0].slice(1).replaceAll(',', ""))) * 120}, 67%, ${this.brightness}%)`;
				estCol.innerText = theirStats.split(' ')[0];
				mergedCol.innerHTML = `${ev.children[2].innerText}<br><span style="color: ${estCol.style.color}">${estCol.innerText}</span>`;
			} else {
				estCol.classList.add("text-muted");
				estCol.innerText = "???";
				mergedCol.innerHTML = `${ev.children[2].innerText}<br><span class="text-muted">${estCol.innerText}</span>`;
			}
			ev.insertBefore(estCol, ev.children[2]);
			ev.appendChild(mergedCol);
		}
	}
}


class TotalListingValue {
	constructor() {}
	inMarket(url) {
		let ownOffers = document.querySelector(".offerListWrapper");
		if(ownOffers === null)
			return;
		const header = ownOffers.querySelector("div.row.row-cols-3.row-header");

		let totalVal = 0;
		for(var i = 1; i < ownOffers.children.length; ++i) {
			const item = ownOffers.children[i];
			if(item.children.length < 5)
				continue;
			const val = parseInt(item.children[2].innerText.slice(1).replaceAll(',', ""));
			const countOf = parseInt(item.children[4].innerText.replaceAll(',', ""));
			totalVal += val * countOf;
		}

		let totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The total value of your listings is <span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		ownOffers.insertBefore(totalValCard, header);
	}
}


class TransparentChats {
	constructor() {}
	inAnywhere() {
		GM_addStyle("div.chats.row label.chat-btn { opacity: 0.9 }");
	}
}


class TrueKDR {
	constructor() {}
	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if(stats.length < 2)
			return;

		const table = stats[1].querySelector("div.row.align-items-center.gy-2.mb-2:nth-of-type(2)");
		const lambda = idx => parseInt(table.children[idx].children[0].innerText.replaceAll(',', ""));
		let totalW = lambda(3) + lambda(5);
		let totalL = lambda(7) + lambda(9);

        const descriptionText = document.createElement("div");
        descriptionText.className = "col-4";
        descriptionText.innerHTML = '<p class="profileLabel">True K/D</p>';
		table.insertBefore(descriptionText, table.children[2]);

        const trueKD = document.createElement("div");
        trueKD.className = "col-8";
        trueKD.innerHTML = `<p class="form-data-inset p-2 mb-0 rounded d-flex">${totalW} / ${totalL}</p>`;
        table.insertBefore(trueKD, table.children[3]);
    }
}



(function(links, strikethrough, alwaysColorNames, days) {
	const URL = window.location.href.split(/\/|\?/g).slice(3).join('/').replace(/#[^\?\/]*$/, "").toLowerCase() || "home";
	const darkMode = document.querySelector("html").getAttribute("data-bs-theme") === "dark";
	const addItemButtons = new AddItemButtons();
	const addLinks = new AddLinks(links);
	const bankDepositTax = new BankDepositTax();
	const betterItemValues = new BetterItemValues(darkMode, strikethrough, alwaysColorNames);
	const betterMoneyInputs = new BetterMoneyInputs(); // INACTIVATED
	const betterProgressBars = new BetterProgressBars();
	const blackjackHelper = new BlackjackHelper();
	const buyPointsLink = new BuyPointsLink();
	const cartelMemberRep = new CartelMemberRep(); // INACTIVATED
	const centerTabs = new CenterTabs();
	const centerText = new CenterText();
	const colorChatNames = new ColorChatNames();
	const colorStats = new ColorStats(darkMode);
	const disableThrow = new DisableThrow();
	const displayPerks = new DisplayPerks();
	const displayTownCaches = new DisplayTownCaches(darkMode);
	const dpEnergyRefillReminder = new DPEnergyRefillReminder();
	const estateLevelInfo = new EstateLevelInfo(darkMode);
	const estimatedIntGains = new EstimatedIntGains(darkMode);
	const expeditionChances = new ExpeditionChances();
	const greenMoney = new GreenMoney();
	const highlightExcessHealth = new HighlightExcessHealth();
	const highlightInactives = new HighlightInactives();
	const highlightUnequipped = new HighlightUnequipped();
	const highscoreChanges = new HighscoreChanges();
	const intPerWeek = new IntPerWeek(darkMode);
	const itemCache = new ItemCache(darkMode, days);
	const largerGymGraph = new LargerGymGraph();
	const propertyPageAgentLink = new PropertyPageAgentLink();
	const redLeaveCourseButton = new RedLeaveCourseButton();
	const removeOwnStatus = new RemoveOwnStatus();
	const roundedCards = new RoundedCards();
	const scriptSettings = new ScriptSettings();
	const statEstimate = new StatEstimate(darkMode);
	const totalListingValue = new TotalListingValue();
	const transparentChats = new TransparentChats();
	const trueKDR = new TrueKDR();


	if(/^gym\/?$/.test(URL)) {
		// In the gym
		statEstimate.inGym(URL);
		colorStats.inGym(URL);
		displayPerks.inGym(URL);
		addItemButtons.inGym(URL);
		betterItemValues.inGym(URL);
		largerGymGraph.inGym(URL);
	} else if(/^university\/?$/.test(URL)) {
		// In the university main page
		colorStats.inUniversity(URL);
		redLeaveCourseButton.inUniversity();
		addItemButtons.inUniversity(URL);
		betterItemValues.inUniversity(URL);
		estimatedIntGains.inUniversity(URL);
	} else if(/^university\/[132]\/?$/.test(URL)) {
		// In a university course pages
		intPerWeek.inUniversityPage(URL);
		redLeaveCourseButton.inUniversity();
	} else if(/^jail\/?$/.test(URL)) {
		// In the jail
		addItemButtons.inJail(URL);
	} else if(/^bank\/?$/.test(URL)) {
		// In the bank
		bankDepositTax.inBank(URL);
		//betterMoneyInputs.inBank(URL);
	} else if(/^expedition/.test(URL)) {
		// In the expeditions page
		expeditionChances.inExpeditions(URL);
		centerTabs.inNavTabPlace(URL);
		betterProgressBars.inExpeditions(URL);
	} else if(/^market/.test(URL)) {
		// In the market
		itemCache.inMarket(URL);
		displayPerks.inMarket(URL);
		colorStats.inMarket(URL);
		betterItemValues.inMarket(URL);
		totalListingValue.inMarket(URL);
		centerTabs.inNavTabPlace(URL);
		colorChatNames.inMarket(URL);
		//betterMoneyInputs.inMarket(URL);
	} else if(/^supporter\/?$/.test(URL)) {
		// On the Supporter main page
		betterItemValues.inSupporter(URL);
		buyPointsLink.inSupporter(URL);
		displayTownCaches.inSupporter(URL);
		dpEnergyRefillReminder.inSupporter(URL);
	} else if(/^town\/?$/.test(URL)) {
		// In the town main page
		centerText.inTown(URL);
		displayTownCaches.inTown(URL);
	} else if(/^town\/estateagent\/?$/.test(URL)) {
		// In the estate agent
		betterItemValues.inEstateAgent(URL);
		estateLevelInfo.inEstateAgent(URL);
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^town\/pharmacy\/?$/.test(URL)) {
		// In the pharmacy
		betterItemValues.inTownStore(URL);
		displayPerks.inPharmacy(URL);
    } else if(/^town\/club\/?$/.test(URL)) {
		// In Julio's club
		displayTownCaches.inSicarios(URL);
    } else if(/^town\/mateos\/?$/.test(URL)) {
        // In Mateo's
        displayTownCaches.inMateos(URL);
	} else if(/^town\/.+\/?$/.test(URL)) {
		// In a town store other than the estate agent or pharmacy
		betterItemValues.inTownStore(URL);
	} else if(/^petshop\/?$/.test(URL)) {
		// In the petshop
		betterItemValues.inTownStore(URL);
		displayTownCaches.inPetshop(URL);
	} else if(/^trade\/view/.test(URL)) {
		// Viewing a trade
		betterItemValues.inTradeView(URL);
		//betterMoneyInputs.inTradeView(URL);
	} else if(/^trade/.test(URL)) {
		// In the trade list
		colorChatNames.inTrade(URL);
	} else if(/^trade\/additems/.test(URL)) {
		// Adding items to a trade
		betterItemValues.inAddItems(URL);
	} else if(/^cartel\/\d+\/?$/.test(URL)) {
		// In someone else's cartel homepage
		statEstimate.inBountyOrOtherCartel(URL);
		colorChatNames.inBountyOrOtherCartel(URL);
	} else if(/^cartel\/?$/.test(URL)) {
		// In the cartel homepage
		highlightInactives.inCartel(URL);
		//statEstimate.inCartelHomepage(URL);
		//cartelMemberRep.inCartelHomepage(URL);
	} else if(/^cartel\/armou?ry\/deposit\/?$/.test(URL)) {
		// Adding items to cartel armoury
		betterItemValues.inAddItems(URL);
	} else if(/^cartel\/armou?ry/.test(URL)) {
		// Viewing the cartel armoury
		betterItemValues.inCartelArmory(URL);
		//betterMoneyInputs.inCartelArmory(URL);
	} else if(/^cartel\/territory\/?$/.test(URL)) {
		// In cartel war page
		statEstimate.inCartelWar(URL);
	} else if(/^cartel\/perks\/?$/.test(URL)) {
		// In the cartel perks page
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^cartel\/allfights/.test(URL)) {
		// In the cartel fight log
		//cartelMemberRep.inAttackLog(URL);
	} else if(/^events/.test(URL)) {
		// On an events page
		betterItemValues.inEvents(URL);
		statEstimate.inEvents(URL);
	} else if(/^production\/?$/.test(URL)) {
		// On the productions page
		betterItemValues.inProduction(URL);
		highlightUnequipped.inProduction(URL);
		itemCache.inProduction(URL);
	} else if(/^jobs\/?$/.test(URL)) {
		// In the jobs page
		betterItemValues.inJobs(URL);
		itemCache.inJobs(URL);
		betterProgressBars.inJobs(URL);
	} else if(/^inventory/.test(URL)) {
		// In the inventory
		addItemButtons.inInventory(URL);
		itemCache.inInventory(URL);
		colorStats.inInventory(URL);
		displayPerks.inInventory(URL);
		disableThrow.inInventory(URL);
		betterItemValues.inInventory(URL);
		highlightUnequipped.inInventory(URL);
	} else if(/^casino\/?$/.test(URL)) {
		// In the casino main page
		displayTownCaches.inCasino(URL);
	} else if(/^casino\/spinner\/?$/.test(URL)) {
		// In the casino wheel spinner
		displayTownCaches.inCasinoSpinner(URL);
	} else if(/^casino\/blackjack\/?$/.test(URL)) {
		// In casino blackjack
		blackjackHelper.inBlackjack(URL);
	} else if(blackjackHelper.statsRegex.test(URL)) {
		// In the blackjack stats page
		blackjackHelper.inBlackjackStats(URL);
	} else if(/^highscores/.test(URL)) {
		// On a highscores page
		highscoreChanges.inHighscores(URL);
		colorStats.inHighscores(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^(home|user)\/?$/.test(URL)) {
		// On the homepage
		displayPerks.inHomepage(URL);
		statEstimate.inHomepage(URL);
		colorStats.inHomepage(URL);
		trueKDR.inHomepage(URL);
	} else if(/^user\/\d+\/?$/.test(URL)) {
		// Viewing someone's profile
		highlightExcessHealth.inUserProfile(URL);
		statEstimate.inUserProfile(URL);
		//betterMoneyInputs.inUserProfile(URL);
		colorChatNames.inUserProfile(URL);
	} else if(/^user\/stats/.test(URL)) {
		// In personal stats
		colorStats.inPersonalStats(URL);
	} else if(/^property\/?$/.test(URL)) {
		// On own property page
		propertyPageAgentLink.inProperty(URL);
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(statEstimate.statEstimateRegex.test(URL)) {
		// On the custom stat estimate page
		statEstimate.inStatEstimate(URL);
	} else if(/^(advanced)?search/.test(URL)) {
		// On the search page
		statEstimate.inSearch(URL);
	} else if(/^bounty/.test(URL)) {
		// In the bounty list page
		statEstimate.inBountyOrOtherCartel(URL);
		colorChatNames.inBountyOrOtherCartel(URL);
	} else if(/^fight/.test(URL)) {
		// Viewing attack log
		statEstimate.inFight(URL);
	} else if(/^connections$/.test(URL)) {
		// In the friends & enemies page
		colorChatNames.inConnections(URL);
	} else if(/^forum\/\d+\/\d+|^forum\/thread\/\d+/.test(URL)) {
		// In a forum post
		colorChatNames.inForumPost(URL);
		colorStats.inForumPost(URL);
	} else if(/^forum\/\d+/.test(URL)) {
		// In a forum category
		colorChatNames.inForumCategory(URL);
	} else if(/^inbox|^outbox/.test(URL)) {
		// In inbox/outbox
		colorChatNames.inMail(URL);
	} else if(/^settings/.test(URL)) {
		// In the settings page
		centerTabs.inNavTabPlace(URL);
		scriptSettings.inSettings(URL);
	}

	addLinks.inAnywhere();
	betterProgressBars.inAnywhere();
	centerText.inAnywhere();
	colorChatNames.inAnywhere();
	displayTownCaches.inAnywhere();
	greenMoney.inAnywhere();
	roundedCards.inAnywhere();
	transparentChats.inAnywhere();

	return darkMode; // Just for confusion for decompilers
})(LINKS, STRIKETHROUGH, ALWAYS_COLOR_NAMES, DAYS);