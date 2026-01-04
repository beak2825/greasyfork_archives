// ==UserScript==
// @name         Nyaa2pikpak
// @namespace    https://greasyfork.org/zh-CN/users/709496-wlm3201
// @version      0.1.1
// @description  redirect torrent download button to saving to pikpak
// @author       wlm3201
// @match        https://nyaa.si/*
// @match        https://sukebei.nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @downloadURL https://update.greasyfork.org/scripts/447155/Nyaa2pikpak.user.js
// @updateURL https://update.greasyfork.org/scripts/447155/Nyaa2pikpak.meta.js
// ==/UserScript==

$("a[href^='/download/']").each(function() { $(this).attr("href", "https://drive.mypikpak.com/landing?__add_url=" + $(this).next().attr("href").match(/magnet:\?xt=urn:btih:.{40}/)[0]) })