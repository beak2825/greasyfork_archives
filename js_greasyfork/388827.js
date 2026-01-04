// ==UserScript==
// @name         Big Boy Cytube Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Cytube Work @ Half-Width
// @author       EntranceJew
// @match        https://cytu.be/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388827/Big%20Boy%20Cytube%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/388827/Big%20Boy%20Cytube%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style, styleContent;
        head = document.getElementsByTagName('head')[0];
        console.log(head);
        if (!head) { return; }
        styleContent = document.createTextNode(css);
        style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(styleContent);
        head.appendChild(style);
    }

    addGlobalStyle(
        '#mainpage .container div[class^="col-"] { padding-left: 0; padding-right: 0; }' +
        '#mainpage .container div[class*=" col-"] { padding-left: 0; padding-right: 0; }' +
        '#mainpage .container { margin-left: 0; margin-right: 0; }' +
        '#mainpage { padding-top: 0; }' +
        '#wrap { margin-bottom: 0; padding-bottom: 0; }' +
        '#rightpane-inner #addfromurl { padding-left: 15px; padding-right: 15px; }' +
        '#mainpage .container #controlsrow { padding-left: 15px; padding-right: 15px; }' +
        '#mainpage .container #playlistrow #rightpane #rightpane-inner { margin-right: 0; margin-left: 0; }'
    );

    var enlargen = function(match, group1, group2, offset, original){ return group1 + "-12"; };
    document.querySelector('#chatheader').parentNode.remove();
    document.querySelector('#drinkbarwrap').remove();
    document.querySelector('#leftpane').remove();
    document.querySelector('#motdrow').remove();
    document.querySelector('#resizewrap').remove();
    document.querySelector('#footer').remove();

    var videowrap = document.querySelector('#videowrap');
    videowrap.className = videowrap.className.replace(/(col-[a-z]{2})-([0-9]+)/g, enlargen);
    var leftpane = document.querySelector('#rightpane');
    leftpane.className = leftpane.className.replace(/(col-[a-z]{2})-([0-9]+)/g, enlargen);

    var bodywrap = document.querySelector('#mainpage > .container');
    bodywrap.setAttribute('style', "width: 100%;");

    var logoutForm = document.querySelector('#logoutform');
    if( null != logoutForm ){
        logoutForm.parentNode.parentNode.remove();
    }
})();