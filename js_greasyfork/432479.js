// ==UserScript==
// @name         Add Border to SDS tables
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  厚生労働省SDSの表に枠線を追加
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://anzeninfo.mhlw.go.jp/anzen/gmsds/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432479/Add%20Border%20to%20SDS%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/432479/Add%20Border%20to%20SDS%20tables.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll("table")).forEach(x=>x.setAttribute("border",""))

