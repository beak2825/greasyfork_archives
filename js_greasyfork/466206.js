// ==UserScript==
// @name         [Typing Tube] 対戦機能の名前変更
// @namespace    http://tampermonkey.net/
// @version      1
// @description  名前変更とマルチプレイチャットを追加
// @author       You
// @match        https://typing-tube.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466206/%5BTyping%20Tube%5D%20%E5%AF%BE%E6%88%A6%E6%A9%9F%E8%83%BD%E3%81%AE%E5%90%8D%E5%89%8D%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/466206/%5BTyping%20Tube%5D%20%E5%AF%BE%E6%88%A6%E6%A9%9F%E8%83%BD%E3%81%AE%E5%90%8D%E5%89%8D%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==


/**
 *
 * 名前を変更する際は以下の行の guest の箇所を変更してください。
 *
 */


document.getElementsByClassName("user__name")[0].textContent = 'guest'