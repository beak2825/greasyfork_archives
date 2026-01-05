// ==UserScript==
// @name         T411 - Redirection Forum
// @namespace    https://www.t411.li
// @version      1.1.1
// @description  Permet d'éviter un bug d'affichage en redirigeant l'adresse d'accès au forum T411
// @author       Micdu70
// @include      http://www.t411.al/forum*
// @include      https://www.t411.al/forum*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/24972/T411%20-%20Redirection%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/24972/T411%20-%20Redirection%20Forum.meta.js
// ==/UserScript==
function INIT() {
    var url = window.location.href;
    var reg = /.*forum(\.php)?(\?)?(#)?(\/\S+)/;
    if (url.match(reg) !== null) {
        var newurl = 'https://forum.t411.al' + url.match(reg)[4];
        window.location.replace(newurl);
    } else {
        window.location.replace('https://forum.t411.al/');
    }
}
INIT();