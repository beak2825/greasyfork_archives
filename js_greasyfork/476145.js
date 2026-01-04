// ==UserScript==
// @name         Pastille connecté
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Pastille pour voir qui est connecté
// @author       Porn
// @license      MIT
// @match        https://onche.org/topic*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onche.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476145/Pastille%20connect%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/476145/Pastille%20connect%C3%A9.meta.js
// ==/UserScript==

$('<script>', {src: 'https://code.jquery.com/jquery-3.6.0.min.js'}).appendTo('head');

$(".button.large.medium.filled.secondary.bordered").click()

setTimeout(function connecte() {
var liste = $(".content.users.compact .user").map(function() {
return $(this).text(); }).get();

var isse = $(".message-op")[0]


if (liste.length>50){
    $(".message-username").each(function() {
        $(this).append(liste.indexOf(this.outerText) >= 0 ? " 🔹" : " 🔸");
    })}
    else connecte()
},250)

