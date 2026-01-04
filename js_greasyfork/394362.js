// ==UserScript==
// @name         Free Custom Surviv.io Skins and Mods (FREE SURVIV GOLD PASS #11)
// @namespace    https://github.com/notKaiAnderson/
// @version      1.3.8
// @description   a free and purely cosmetic script that lets you use custom skins during games, it even lets you make your own skins!
// @author       preacher
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @icon         https://i.imgur.com/jgHdTYA.png
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/394362/Free%20Custom%20Survivio%20Skins%20and%20Mods%20%28FREE%20SURVIV%20GOLD%20PASS%2011%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394362/Free%20Custom%20Survivio%20Skins%20and%20Mods%20%28FREE%20SURVIV%20GOLD%20PASS%2011%29.meta.js
// ==/UserScript==

/*** contributors
 * garlic
 * preacher
 * and thanks to Michal2SAB for the webpack inject code
 ***/

//*************** Michal2SAB's code

let webpackR = undefined;

const func = {
	webpack_inject: (w, e, get) => {
		webpackR = get.bind(this);
	},
};

if (typeof webpackJsonp === "function")
	webpackJsonp([0], func, ["webpack_inject"]);
else webpackJsonp.push([["webpack_inject"], func, [["webpack_inject"]]]);

//*************** don't edit code above ^

// make console.log() work
console.log = console.info;

// global declarartion
const skins = webpackR("63d67e9d");
const hands = webpackR("ccb6ad93");
const guns = webpackR("ad1c4e70");

// utils
const getEle = (selector) => document.querySelector(selector);
const getAllEle = (selector) => document.querySelectorAll(selector);
const removeBorder = () =>
	getAllEle(".active").forEach((i) => i.classList.remove("active"));
const addBorder = (id) => getEle(`#${id}`).classList.add("active");
const injectCss = (css) => (document.head.innerHTML += `<style>${css}</style>`);
const imgToUrl = (type, img) =>
	`https://surviv.io/img/${type}/${img.slice(0, -4)}.svg`;
const backUpDeafultSkin = () =>
	(skins.defaultSkin = { ...skins.outfitBase, rarity: 10 });

let skinsArr = getSkinsByRarity(2);

function getSkinsByRarity(rarity) {
	let tempArr = [];
	Object.keys(skins).forEach((skin) => {
		if (!skins[skin]?.rarity) return;
		if (skins[skin].rarity < rarity) return;
		tempArr.push(skin);
	});

	backUpDeafultSkin();
	tempArr.push("defaultSkin");

	return tempArr.reverse();
}

const handsArr = [];
// add all the availaible surviv hand skins to handsArr
for (key in hands) {
	if (key.includes("fist_")) handsArr.push(key);
}

const gunsArr = {
	weaponSkinMilitary: {
		name: "weaponSkinMilitary",
		long: "https://surviv.io/img/guns/gun-long-02.svg",
		med: "https://surviv.io/img/guns/gun-med-02.svg",
		short: "https://surviv.io/img/guns/gun-short-02.svg",
	},
	weaponSkinAquatic: {
		name: "weaponSkinAquatic",
		long: "https://surviv.io/img/guns/gun-long-03.svg",
		med: "https://surviv.io/img/guns/gun-med-03.svg",
		short: "https://surviv.io/img/guns/gun-short-03.svg",
	},
	weaponSkinSand: {
		name: "weaponSkinSand",
		long: "https://surviv.io/img/guns/gun-long-04.svg",
		med: "https://surviv.io/img/guns/gun-med-04.svg",
		short: "https://surviv.io/img/guns/gun-short-04.svg",
	},
};

// _SKIN and _Hand must be a String
// ex: skins["outfitFireball"]

window.assignSkin = (_SKIN) => {
	if (!skins[_SKIN]) return;

	skins.outfitBase.accessory = { sprite: "" };
	Object.assign(skins.outfitBase, skins[_SKIN]);

	removeBorder();
	addBorder(_SKIN);
};

window.assignHand = (_HAND) => {
	if (!hands[_HAND]) return;

	hands.fists.handSprites = { spriteL: "", spriteR: "" };
	Object.assign(hands.fists, hands[_HAND]);

	removeBorder();
	addBorder(_HAND);
};

window.assignGuns = (_GUNSKIN) => {
	// guns = webpackR("ad1c4e70");
	// loop through all the guns and change their skins
	Object.values(guns).forEach((gun) => {
		switch (gun.worldImg.sprite) {
			case "gun-short-01.img":
				gun.worldImg.sprite = gunsArr[_GUNSKIN].short;
				break;
			case "gun-med-01.img":
				gun.worldImg.sprite = gunsArr[_GUNSKIN].med;
				break;
			case "gun-long-01.img":
				gun.worldImg.sprite = gunsArr[_GUNSKIN].long;
				break;
		}

		if (gun.worldImg.tint != 16777215) gun.worldImg.tint = 16777215;
	});

	removeBorder();
	addBorder(_GUNSKIN);
};

const css = `.active { color: green; border: 2px solid #668e38;} .content, .pass-body-container  {display: none;}; .skin-name {margin: 10px;} .tab {display: flex !important;} .active-tab {display: block !important} .contents {display: flex; flex-direction: column; width: 100%; overflow-y: scroll; height: 100%;text-align: center; box-sizing: border-box;} .container {width: 100%; flex: 1 0 auto;} .skins, .fists, .guns, .crates {display: flex; box-sizing: border-box; flex-wrap: wrap} .trees img {max-height: auto; max-width: 100%} .maps {display: flex; box-sizing: border-box; flex-wrap: wrap} .skin-item, .map-item {flex-grow: 1; flex-basis: 25%; position: relative; cursor: pointer; box-sizing: border-box; padding: 10px 0;} .tabs {display: flex !important;} .tab {display: inline-block !important; flex-grow: 1; padding: 10px; background: rgba(0, 0, 0, 0.28); cursor: pointer; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;} #start-menu {padding: 0;} #social-share-block-wrapper {display: none;} .tab.active-tab {background: #000;} .footer {background-color: #000; padding: 10px; border-top: 1px solid #ddd; flex-shrink: 0;} .footer p {margin:0; text-align: center;} .tab.icon { padding: 0; display: flex !important; justify-content: center; align-items: center;} .svg-icon { width: 1.5em; height: 1.5em; } .svg-icon path, .svg-icon polygon, .svg-icon rect { fill: #ffffff; } .svg-icon circle { stroke: #ffffff; stroke-width: 1;} .container.set .modal-settings-item {padding: 10px 0; } .btn-custom {-webkit-animation-name:custom-pulse;-webkit-animation-duration:5s;border-bottom:4px solid #00448a}@-webkit-keyframes custom-pulse{from{background-color:#8a9e69;border-bottom-color:#8a9e69;-webkit-box-shadow:0 0 9px #8a9e69}25%{background-color:#318585;border-bottom-color:#208686;-webkit-box-shadow:0 0 18px #318585}75%{background-color:#675fe0;border-bottom-color:#312b8a;-webkit-box-shadow:0 0 18px #675fe0}to{background-color:#8a9e69;border-bottom-color:#8a9e69;-webkit-box-shadow:0 0 9px #8a9e69}}#deleteSkinItem { position: absolute; right: 2px;} .btn-submit { margin-left: 10px; padding: 5px 10px; font-size: 1.3rem; background: #191616; color: #fff; border: solid 1px #fff; border-radius: 4px;} #addSkinName { font-size: 1.5rem;} .custom-wrapper-random { width: 753.89px; height: 415.06px; border-radius: 10.27px; box-sizing: border-box; max-height: unset; display: -webkit-box; display: flex;} #start-menu {padding: 0 !important;} .disable-the-script { position: absolute; bottom: -10%; text-align: center; background: #000; width: 100%; } #start-menu { position: relative; }`;

injectCss(css);
loadMainScript();

function loadMainScript() {
	const passBody = getEle(".pass-body-container");

	const disableScripthtml = `
        <div class="disable-the-script">
        <label>Disable the script</label>
            <input type="checkbox" id="disableTheScript">    
        </div>`;

	const startMenuEle = getEle("#start-menu");
	startMenuEle.insertAdjacentHTML("afterend", disableScripthtml);

	const customSkinsWrapperHtml = `<div class="custom-wrapper-random">)</div>`;
	startMenuEle.insertAdjacentHTML("beforeend", customSkinsWrapperHtml);
	customWrapperEle = getEle(".custom-wrapper-random");
	customWrapperEle.innerHTML = `
        <div class="contents">
            <div class="tabs">
                <div class="tab" style="flex-basis: 80%;">Select Skins</div>
                <div class="tab" style="flex-basis: 80%;">Select Fists</div>
                <div class="tab" style="flex-basis: 80%;">Select Guns</div>
                <div class="tab" style="flex-basis: 80%;">Settings</div>
            </div>
            <div class="container content">
                <div class="skins"></div>
            </div>
            <div class="container content">
                <div class="fists"></div>
            </div>
            <div class="container content">
                <div class="guns"></div>
            </div>
            <div class="container content">
                <div class="settings">
                    <div style="padding: 1em">
                        <span>disable the endgame screen: </span>
                        <input type="checkbox" id="disableTheEndGameScreen">
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>
                    report bugs on
                    <a href="https://discord.gg/WjXgrGa" target="_blank">Discord</a> 🐓
                </p>
            </div>
		</div>`;

	// disable the script
	getEle("#disableTheScript").addEventListener("click", (e) => {
		if (e.target.checked) {
			passBody.style.display = "block";
			customWrapperEle.style.display = "none";
		} else if (!e.target.checked) {
			passBody.style.display = "none";
			customWrapperEle.style.display = "block";
		}
	});

	// Tabs
	const tabLinks = getAllEle(".tab");
	const tabContents = getAllEle(".content");
	tabLinks[0].classList.add("active-tab");
	tabContents[0].classList.add("active-tab");
	tabLinks.forEach((tabLink, i) => {
		tabLink.addEventListener("click", () => {
			tabLinks.forEach((tabLink) => tabLink.classList.remove("active-tab"));
			tabContents.forEach((tabContent) =>
				tabContent.classList.remove("active-tab")
			);
			tabLink.classList.add("active-tab");
			tabContents[i].classList.add("active-tab");
		});
	});

	generateHtml();
}

getEle("#disableTheEndGameScreen").addEventListener("change", (e) => {
	// if checked add option to hide end screen, refresh to remove it
	if (e.target.checked) {
		for (;;) {
			let uiStatsHeaderEle = getEle("#ui-stats-header");
			if (!uiStatsHeaderEle) break;
			let shodowDom = uiStatsHeaderEle.attachShadow({ mode: "closed" });

			const inputEle = document.createElement("input");
			inputEle.type = "button";
			inputEle.value = "HIDE";

			shodowDom.appendChild(inputEle);

			inputEle.onclick = () => {
				getEle("#ui-stats").style.display = "none";
				getEle("#ui-stats-ad-container-desktop").style.display = "none";

				const ev10 = document.addEventListener("keypress", (e) => {
					getEle("#ui-stats").style.display = "block";
					document.removeEventListener(ev10);
				});
			};
			break;
		}
	}
});

function generateHtml() {
	const generateSkinTemplate = (arr, obj, func) => {
		const isGunSkins = arr.constructor == Object;
		let html = "";
		Object.values(arr).forEach((i) => {
			let htmlMockup = `
            <div class="skin-item" id="${
							isGunSkins ? i.name : i
						}" onclick="${func}('${isGunSkins ? i.name : i}')">
                <img src="${
									isGunSkins ? i.long : imgToUrl("loot", obj[i].lootImg.sprite)
								}" class="skin-img" />
                <h4 class="skin-name">${isGunSkins ? i.name : obj[i].name}</h4>
            </div>`;
			html += htmlMockup;
		});
		return html;
	};

	getEle(".skins").innerHTML = generateSkinTemplate(
		skinsArr,
		skins,
		"assignSkin"
	);
	getEle(".fists").innerHTML = generateSkinTemplate(
		handsArr.reverse(),
		hands,
		"assignHand"
	);
	getEle(".guns").innerHTML = generateSkinTemplate(gunsArr, null, "assignGuns");
}

// make variables accessible in the console
window.public = { skins, hands, guns, skinsArr, handsArr, gunsArr };
