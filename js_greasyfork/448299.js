// ==UserScript==
// @name         Pallex
// @namespace    dedeman
// @version      1.0
// @description  Copiere link tracking
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        https://nexus.pallex.com/Tracking/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448299/Pallex.user.js
// @updateURL https://update.greasyfork.org/scripts/448299/Pallex.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`.link_tracking {
color: white;
float: right;
margin-right: 34px;
margin-top: 14px;
font-size: 14px;
cursor: pointer;
}
.link_tracking:hover {
text-decoration: underline;
}
`);
    $('.navbarContainer').append('<span class="link_tracking">Link tracking</span>');
    $('.link_tracking').click(function() {
        var text = 'AWB Pallex: <a href="'+location.href+'" target="_blank">'+location.href.split('/').slice(-2,-1)[0]+'</a>';
        $(this).fadeOut().fadeIn();
        function listener(e) {
            e.clipboardData.setData("text/html", text);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
    });
})();