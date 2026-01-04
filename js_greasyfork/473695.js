// ==UserScript==
// @name         ProfileLikesRemover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Удаляет блок с лайками из профилей
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473695/ProfileLikesRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/473695/ProfileLikesRemover.meta.js
// ==/UserScript==

$("#content > div > div > div > div.mainProfileColumn > div > div.counts_module > div").remove();