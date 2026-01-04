// ==UserScript==
// @name         Facebook All Comments Helper
// @name:zh-TW   FB全部留言小幫手
// @name:zh-CN   FB全部留言小帮手
// @namespace    https://github.com/Xuitty/FBallComments
// @version      2.4
// @description  Easy way to show all comments.
// @description:zh-tw  讓您更快打開全部留言
// @description:zh-cn  让您更快打开全部留言
// @author       Xuitty
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488033/Facebook%20All%20Comments%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/488033/Facebook%20All%20Comments%20Helper.meta.js
// ==/UserScript==

/**
 * string array for detecting the menu button
 */

const langs = {
	de: ["Relevanteste", "Top-Kommentare", "Am zutreffendsten", "Neueste zuerst", "Neueste", "Alle Kommentare"],
	en: ["Top comments", "Most relevant", "Most applicable", "Most recent", "Newest", "All comments"],
	es: ["Comentarios destacados", "Más relevantes", "Más pertinentes", "Más recientes", "Más recientes", "Todos los comentarios"],
	hu: ["A legfontosabb hozzászólások", "A legrelevánsabbak", "A témához leginkább illők", "A legújabbak", "A legutóbbiak", "Az összes hozzászólás"],
	ja: ["トップコメント", "関連度の高い順", "最も適切", "新しい順", "新しい順", "すべてのコメント"],
	ko: ["관련성 높은 댓글", "참여도 높은 댓글", "적합성 높은 순", "최신순", "날짜 내림차순", "모든 댓글"],
	fr: ["Plus pertinents", "Les meilleurs commentaires", "Les plus pertinents", "Plus récents", "Les plus récents", "Tous les commentaires"],
	sk: ["Top komentáre", "Najrelevantnejšie", "Najvhodnejšie", "Najnovšie", "Najnovšie", "Všetky komentáre"],
	sl: ["Najbolj priljubljeni komentarji", "Najustreznejši", "Najustreznejše", "Najnovejši", "Najnovejši", "Vsi komentarji"],
	"zh-Hans": ["热门评论", "最相关", "最合适", "从新到旧", "最新", "所有评论"],
	"zh-Hant": ["最熱門留言", "最相關", "最相關", "最新", "由新到舊", "所有留言"],
};

/**
 * string array for notification
 */

const notificationStr = {
	de: ["Wechseln zu allen Kommentaren!", "Wechseln zu den neuesten Kommentaren!"],
	en: ["Switch to All Comments!", "Switch to Latest Comments!"],
	es: ["Cambiar a todos los comentarios!", "Cambiar a los comentarios más recientes!"],
	hu: ["Váltás az összes hozzászólásra!", "Váltás a legújabb hozzászólásokra!"],
	ja: ["すべてのコメントに切り替え！", "最新のコメントに切り替え！"],
	ko: ["모든 댓글로 전환!", "최신 댓글로 전환!"],
	fr: ["Passer à tous les commentaires!", "Passer aux commentaires les plus récents!"],
	sk: ["Prepnúť na všetky komentáre!", "Prepnúť na najnovšie komentáre!"],
	sl: ["Preklopite na vse komentarje!", "Preklopite na najnovejše komentarje!"],
	"zh-Hant": ["切換到所有留言！", "切換到最新留言！"],
	"zh-Hans": ["切换到所有评论！", "切换到最新评论！"],
};

/**
 * string array for settings
 */

const settingsStr = {
	"zh-Hant": {
		settings: "設定",
		autoDetect: "自動切換為全部/最新留言",
		notifyEnabled: "操作通知",
		isAll: "全部留言/最新留言",
		isScroll: "是否開啟捲動",
		scrollBehavior: "捲動特效",
		hideSettings: "隱藏選單",
		smooth: "平滑",
		auto: "無",
		openMenu: "開啟選單",
		needRefresh: "需要重新整理頁面應用自動切換",
	},
	"zh-Hans": {
		settings: "设置",
		autoDetect: "自动切换为全部/最新评论",
		notifyEnabled: "操作通知",
		isAll: "全部评论/最新评论",
		isScroll: "是否开启滚动",
		scrollBehavior: "滚动特效",
		hideSettings: "隐藏菜单",
		smooth: "平滑",
		auto: "无",
		openMenu: "打开菜单",
		needRefresh: "需要重新刷新页面应用自动切换",
	},
	en: {
		settings: "Settings",
		autoDetect: "Auto detect all/latest comments",
		notifyEnabled: "Notify after action",
		isAll: "All comments/Latest comments",
		isScroll: "Enable scroll effect",
		scrollBehavior: "Scroll behavior",
		hideSettings: "Hide settings",
		smooth: "Smooth",
		auto: "None",
		openMenu: "Open menu",
		needRefresh: "Need to refresh the page to apply auto detection",
	},
	de: {
		settings: "Einstellungen",
		autoDetect: "Automatisch alle/neuesten Kommentare erkennen",
		notifyEnabled: "Nach Aktion benachrichtigen",
		isAll: "Alle Kommentare/Neueste Kommentare",
		isScroll: "Bildlauf aktivieren",
		scrollBehavior: "Bildlaufverhalten",
		hideSettings: "Einstellungen ausblenden",
		smooth: "Sanft",
		auto: "Keine",
		openMenu: "Menü öffnen",
		needRefresh: "Die Seite muss aktualisiert werden, um die automatische Erkennung anzuwenden",
	},
	es: {
		settings: "Ajustes",
		autoDetect: "Detectar automáticamente todos/los comentarios más recientes",
		notifyEnabled: "Notificar después de la acción",
		isAll: "Todos los comentarios/Comentarios más recientes",
		isScroll: "Activar efecto de desplazamiento",
		scrollBehavior: "Comportamiento de desplazamiento",
		hideSettings: "Ocultar ajustes",
		smooth: "Suave",
		auto: "Ninguno",
		openMenu: "Abrir menú",
		needRefresh: "Necesita actualizar la página para aplicar la detección automática",
	},
	fr: {
		settings: "Paramètres",
		autoDetect: "Détecter automatiquement tous/les derniers commentaires",
		notifyEnabled: "Notifier après l'action",
		isAll: "Tous les commentaires/Derniers commentaires",
		isScroll: "Activer l'effet de défilement",
		scrollBehavior: "Comportement de défilement",
		hideSettings: "Masquer les paramètres",
		smooth: "Doux",
		auto: "Aucun",
		openMenu: "Ouvrir le menu",
		needRefresh: "Besoin de rafraîchir la page pour appliquer la détection automatique",
	},
	hu: {
		settings: "Beállítások",
		autoDetect: "Az összes/legújabb hozzászólás automatikus észlelése",
		notifyEnabled: "Értesítés az akció után",
		isAll: "Minden megjegyzés/Legfrissebb megjegyzések",
		isScroll: "Gördítési hatás engedélyezése",
		scrollBehavior: "Gördülési viselkedés",
		hideSettings: "Beállítások elrejtése",
		smooth: "Simít",
		auto: "Nincs",
		openMenu: "Menü megnyitása",
		needRefresh: "Az automatikus észlelés alkalmazásához frissíteni kell az oldalt",
	},
	ja: {
		settings: "設定",
		autoDetect: "すべて/最新のコメントを自動検出",
		notifyEnabled: "アクション後に通知",
		isAll: "すべてのコメント/最新のコメント",
		isScroll: "スクロール効果を有効にする",
		scrollBehavior: "スクロール動作",
		hideSettings: "設定を非表示",
		smooth: "スムーズ",
		auto: "なし",
		openMenu: "メニューを開く",
		needRefresh: "自動検出を適用するにはページを更新する必要があります",
	},
	ko: {
		settings: "설정",
		autoDetect: "모든/최신 댓글 자동 감지",
		notifyEnabled: "작업 후 알림",
		isAll: "모든 댓글/최신 댓글",
		isScroll: "스크롤 효과 사용",
		scrollBehavior: "스크롤 동작",
		hideSettings: "설정 숨기기",
		smooth: "부드러운",
		auto: "없음",
		openMenu: "메뉴 열기",
		needRefresh: "자동 감지를 적용하려면 페이지를 새로 고쳐야 합니다",
	},
	sk: {
		settings: "Nastavenia",
		autoDetect: "Automaticky zistiť všetky/najnovšie komentáre",
		notifyEnabled: "Upozorniť po akcii",
		isAll: "Všetky komentáre/Najnovšie komentáre",
		isScroll: "Povoliť posuvný efekt",
		scrollBehavior: "Správanie posuvu",
		hideSettings: "Skryť nastavenia",
		smooth: "Hladký",
		auto: "Žiadny",
		openMenu: "Otvoriť menu",
		needRefresh: "Na použitie automatického zistenia je potrebné obnoviť stránku",
	},
	sl: {
		settings: "Nastavitve",
		autoDetect: "Samodejno zaznani vsi/najnovejši komentarji",
		notifyEnabled: "Obvesti po dejanju",
		isAll: "Vsi komentarji/Najnovejši komentarji",
		isScroll: "Omogoči učinek drsenja",
		scrollBehavior: "Vedenje drsenja",
		hideSettings: "Skrij nastavitve",
		smooth: "Gladko",
		auto: "Brez",
		openMenu: "Odpri meni",
		needRefresh: "Za uporabo samodejnega zaznavanja je treba osvežiti stran",
	},
};

/**
 * get the language of the fb
 * @returns the language of the fb
 */
function detectLang() {
	return document.getElementById("facebook")?.getAttribute("lang") || "en";
}

/**
 * get the settings string array
 * @returns the settings string array
 */

function getSettingsStr() {
	return settingsStr[detectLang()] || settingsStr.en;
}

/**
 * get the xpath for menu
 * @returns the xpath for menu
 */

function getMenuButtonXPath() {
	const lang = langs[detectLang()] || langs.en;
	return `//span[not(@style) and (text()='${lang[0]}' or text()='${lang[1]}' or text()='${lang[2]}' or text()='${lang[3]}' or text()='${lang[4]}' or text()='${lang[5]}')]`;
}

/**
 * handle the click the comment button or the right bottom comment count
 */

function handleClickOutside() {
	if (settings.isAll) showAllComment();
	else showLatestComment();
}

/**
 * wait for the element to appear in the DOM
 * @param {string} xpath
 * @param {Function} callback
 * @param {number} timeout
 * @param {number} interval
 */

function waitForElement(xpath, callback, timeout = 3000, intervalTime = 100) {
	const startTime = Date.now();
	const interval = setInterval(() => {
		const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (element) {
			clearInterval(interval);
			callback(element);
		} else if (Date.now() - startTime > timeout) {
			clearInterval(interval);
			console.warn("Timeout: Element not found for XPath", xpath);
		}
	}, intervalTime);
}

/**
 *
 * @param {Element} element
 */

function safeClick(element) {
	try {
		element.click();
	} catch (err) {
		console.error("Error clicking element:", err);
	}
}

/**
 * show the notification to user after the action
 * override is for mode in settings is allcomments and user press ctrl+dblclick/ctrl+insert
 * @param {boolean} reverse
 */

async function notifyUser(reverse = false) {
	const notification = document.createElement("div");
	notification.setAttribute("id", "FBAllCommentsHelperNotification");
	notification.style.position = "fixed";
	notification.style.bottom = "20px";
	notification.style.left = "20px";
	notification.style.backgroundColor = "rgba(0,0,0,1)";
	notification.style.color = "white";
	notification.style.padding = "10px";
	notification.style.borderRadius = "5px";
	notification.style.zIndex = "9999";
	const notifyingTimeout = Number(await GM.getValue("notifyingTimeout"));
	if (reverse) {
		notification.textContent = notificationStr[detectLang()][settings.isAll ? 1 : 0] || notificationStr.en[settings.isAll ? 1 : 0];
	} else {
		notification.textContent = notificationStr[detectLang()][settings.isAll ? 0 : 1] || notificationStr.en[settings.isAll ? 0 : 1];
	}
	document.body.appendChild(notification);
	if (notifyingTimeout) {
		document.getElementById("FBAllCommentsHelperNotification").remove();
		clearTimeout(notifyingTimeout);
		await GM.setValue("notifyingTimeout", undefined);
	}
	const id = setTimeout(async () => {
		notification.remove();
		await GM.setValue("notifyingTimeout", undefined);
	}, 3000);
	await GM.setValue("notifyingTimeout", id);
}

/**
 * parse the user action
 * @param {*} e
 * @returns
 */

function actionParser(e) {
	if (e.type === "dblclick" && e.ctrlKey) {
		!settings.isAll ? showAllComment(true) : showLatestComment(true);
		return;
	}
	if (e.type === "dblclick") {
		settings.isAll ? showAllComment() : showLatestComment();
		return;
	}
	if (e.code === "Insert" && e.ctrlKey) {
		!settings.isAll ? showAllComment(true) : showLatestComment(true);
		return;
	}
	if (e.code === "Insert") {
		settings.isAll ? showAllComment() : showLatestComment();
		return;
	}
}

/**
 * detecting the changes in the DOM
 * @param {Function} callback
 */

function observeDOM(callback) {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach(() => callback());
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * show all comments
 */

function showAllComment(reverse = false) {
	waitForElement(
		//getting the menu
		getMenuButtonXPath(),
		(element) => {
			if (settings.isScroll) {
				element.scrollIntoView({ behavior: settings.scrollBehavior, block: "center" });
			}
			setTimeout(() => {
				safeClick(element);
			}, 100);
			waitForElement(
				//getting the items in menu
				"//*[@role='menuitem']",
				(element) => {
					const menuItems = document.querySelectorAll('*[role="menuitem"]');
					if (menuItems.length > 1) {
						safeClick(menuItems[menuItems.length - 1]);
						if (settings.notifyEnabled) {
							notifyUser(reverse);
						}
					}
				}
			);
		}
	);
}

/**
 * show latest comment
 * override is for mode in settings is allcomments and user press ctrl+dblclick/ctrl+insert
 * @param {boolean} reverse
 */
function showLatestComment(reverse = false) {
	waitForElement(
		//getting the menu
		getMenuButtonXPath(),
		(element) => {
			if (settings.isScroll) {
				element.scrollIntoView({ behavior: settings.scrollBehavior, block: "center" });
			}
			setTimeout(() => {
				safeClick(element);
			}, 100);
			waitForElement(
				//getting the items in menu
				"//*[@role='menuitem']",
				(element) => {
					const menuItems = document.querySelectorAll('*[role="menuitem"]');
					if (menuItems.length > 1) {
						safeClick(menuItems[menuItems.length - 2]);
						if (settings.notifyEnabled) {
							notifyUser(reverse);
						}
					}
				}
			);
		}
	);
}

/**
 * bind the event for detected object after the DOM changes
 */

function bindForDetected(action = "bind") {
	let commentRightBottomBtn = document.querySelectorAll("div[role='button'][tabindex='0'][id^=':']");
	let commentBtn = document.querySelectorAll("span[data-ad-rendering-role='comment_button']");
	commentRightBottomBtn.forEach((btn) => {
		if (action === "remove") {
			btn.removeEventListener("click", handleClickOutside);
		} else {
			btn.addEventListener("click", handleClickOutside);
		}
	});
	commentBtn.forEach((btn) => {
		if (action === "remove") {
			btn.parentElement.parentElement.parentElement.removeEventListener("click", handleClickOutside);
		} else {
			btn.parentElement.parentElement.parentElement.addEventListener("click", handleClickOutside);
		}
	});
}

/**
 * default settings
 */

const settings = {
	autoDetect: true, // auto detect all/latest comments
	scrollBehavior: "smooth", // scroll behavior
	notifyEnabled: true, // notify after action
	isAll: true, // all comments/latest comments
	isHidden: false, // settings panel hidden
	isScroll: false, // enable scroll effect
};

/**
 * save settings to gm storage
 */

async function saveSettings() {
	await GM.setValue("fbAllCommentsHelperSettings", JSON.stringify(settings));
}

/**
 * load settings from gm storage
 */

async function loadSettings() {
	const storedSettings = await GM.getValue("fbAllCommentsHelperSettings");
	if (storedSettings) {
		Object.assign(settings, JSON.parse(storedSettings));
	}
}

/**
 * create settings panel
 */

function createSettingsPanel() {
	const panel = document.createElement("div");
	panel.id = "settingsPanel";
	panel.style.position = "fixed";
	panel.style.top = "10px";
	panel.style.right = "10px";
	panel.style.backgroundColor = "rgba(0, 0, 0, 1)";
	panel.style.padding = "10px";
	panel.style.borderRadius = "5px";
	panel.style.zIndex = "9999";
	panel.style.fontSize = "14px";

	panel.innerHTML = `
        <h4 style="margin: 0 0 10px;color: white;">${getSettingsStr().settings}</h4>
        <label style="color: white;">
            <input type="checkbox" id="autoDetect" ${settings.autoDetect ? "checked" : ""}>
            ${getSettingsStr().autoDetect}
        </label><br>
        <label style="color: white;">
            <input type="checkbox" id="notifyEnabled" ${settings.notifyEnabled ? "checked" : ""}>
            ${getSettingsStr().notifyEnabled}
        </label><br>
		<label style="color: white;">
            <input type="checkbox" id="isAll" ${settings.isAll ? "checked" : ""}>
            ${getSettingsStr().isAll}
        </label><br>
		<label style="color: white;">
            <input type="checkbox" id="isScroll" ${settings.isScroll ? "checked" : ""}>
            ${getSettingsStr().isScroll}
        </label><br>
        <label style="color: white;">
		${getSettingsStr().scrollBehavior}
            <select id="scrollBehavior">
                <option value="smooth" ${settings.scrollBehavior === "smooth" ? "selected" : ""}>${getSettingsStr().smooth}</option>
                <option value="auto" ${settings.scrollBehavior === "auto" ? "selected" : ""}>${getSettingsStr().auto}</option>
            </select>
        </label><br>
        <button id="hideSettings" style="margin-top: 10px;">${getSettingsStr().hideSettings}</button>
    `;

	document.body.appendChild(panel);

	// add panel buttons event listeners
	document.getElementById("autoDetect").addEventListener("change", (e) => {
		settings.autoDetect = e.target.checked;
		saveSettings();
		alert(getSettingsStr().needRefresh);
	});
	document.getElementById("notifyEnabled").addEventListener("change", (e) => {
		settings.notifyEnabled = e.target.checked;
		saveSettings();
	});
	document.getElementById("isAll").addEventListener("change", (e) => {
		settings.isAll = e.target.checked;
		saveSettings();
	});
	document.getElementById("isScroll").addEventListener("change", (e) => {
		settings.isScroll = e.target.checked;
		saveSettings();
	});
	document.getElementById("scrollBehavior").addEventListener("change", (e) => {
		settings.scrollBehavior = e.target.value;
		saveSettings();
	});
	document.getElementById("hideSettings").addEventListener("click", () => {
		settings.isHidden = true;
		document.getElementById("settingsPanel").remove();
		saveSettings();
	});
}

(async function () {
	"use strict";
	window.addEventListener("load", async () => {
		await loadSettings();
		await saveSettings();
		await GM_registerMenuCommand(getSettingsStr().openMenu, () => {
			// gm menu command
			createSettingsPanel();
			settings.isHidden = false;
		});
		if (!settings.isHidden) {
			// create settings panel when isHidden is false
			createSettingsPanel();
		}
		document.addEventListener("dblclick", actionParser); //handle dblclick event
		document.addEventListener("keydown", actionParser); //handle keydown event
		bindForDetected("remove");
		if (settings.autoDetect) {
			bindForDetected();
			// for auto detect
			observeDOM(bindForDetected);
		}
	});
})();
