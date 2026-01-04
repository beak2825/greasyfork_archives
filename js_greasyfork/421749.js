// ==UserScript==
// @name         Invitation (Bot)
// @icon         https://icons.duckduckgo.com/ip2/invitation.codes.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Añade links de referidos a invitation.codes, aumenta tus referidos.
// @author       wuniversales
// @include      https://invitation.codes/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421749/Invitation%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421749/Invitation%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof document.querySelectorAll("div.level-item")[1] !== "undefined") {
        var user=document.querySelectorAll("div.level-item")[1].outerText;
        var extra = document.createElement("br");
        document.querySelector("div.is-centered").appendChild(extra);
        extra = document.createElement("input");
        extra.setAttribute('type', 'url');
        extra.setAttribute('readonly', '');
        extra.setAttribute('onclick', 'this.select()');
        extra.setAttribute('style', 'width:100%;text-align:center;');
        extra.setAttribute('value', location.origin+location.pathname+'/?invite='+document.querySelector("div.counterapi").getAttribute("userId"));
        document.querySelector("div.is-centered").appendChild(extra);
    }
})();