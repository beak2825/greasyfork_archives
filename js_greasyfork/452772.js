// ==UserScript==
// @name Font Changer
// @namespace http://tampermonkey.net/
// @version 1.0
// @description  Script changing vk.com default font
// @author       Dmitry Mikhalin
// @run-at document-start
// @match       *://vkontakte.ru/*
// @match       *://*.vkontakte.ru/*
// @match       *://vk.com/*
// @match       *://*.vk.com/*
// @match       *://userapi.com/*
// @match       *://*.userapi.com/*
// @match       *://vk.me/*
// @match       *://*.vk.me/*
// @match       *://*.vkuseraudio.net/*
// @match       *://*.vkuservideo.net/*
// @downloadURL https://update.greasyfork.org/scripts/452772/Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/452772/Font%20Changer.meta.js
// ==/UserScript==

var sheet = (function() {
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style.sheet;
})();

// цвет текста и высота блока (подблока)
sheet.insertRule(".ui_rmenu_subitem { height:30px !important; color: #184575 !important; }", 0);
sheet.insertRule(".ui_rmenu_item { height:30px !important; color: #184575 !important; }", 0);

// размер шрифта по умолчанию
sheet.insertRule(".ui_rmenu_item_label { font-size:13px !important; font-weight:unset !important; }", 0);
sheet.insertRule(".ui_rmenu_label-text { font-weight:unset !important; }", 0);

//непрочитанные и выделенные
sheet.insertRule(".ui_rmenu_item_sel { font-weight:500 !important; }", 0);
sheet.insertRule(".ui_rmenu_item.im-right-menu--unread { font-weight:500 !important; }", 0);