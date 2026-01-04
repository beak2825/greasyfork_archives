// ==UserScript==
// @name         futbin.com - Extract players to buy for squad sbc
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.5
// @description  Makes it easy to get the players you need, to finish a SBC
// @author       VeryDoc
// @match        https://www.futbin.com/23/squad/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=futbin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452919/futbincom%20-%20Extract%20players%20to%20buy%20for%20squad%20sbc.user.js
// @updateURL https://update.greasyfork.org/scripts/452919/futbincom%20-%20Extract%20players%20to%20buy%20for%20squad%20sbc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addButton('Export list', OpenSquadList);

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || { 'z-index': 3 }
        let button = document.createElement('button'), btnStyle = button.style;
        let body = document.getElementsByClassName('squad-options-block')[0];
        body.appendChild(button);
        button.innerHTML = text;
        button.onclick = onclick;
        button.classList.add('builder-ui-control-pill');
        button.classList.add('active');
        // btnStyle.position = 'absolute';
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
        return button;
    }

    function OpenSquadList() {
        let cards = document.querySelectorAll(".card.added");
        var htmlstr = Array.prototype.reduce.call(cards, function (html, node) {
            return html + node.dataset.formpos + ' - ' + node.getElementsByClassName('pcdisplay-name')[0].innerHTML + ' - ' + node.getElementsByClassName('pcdisplay-rat')[0].innerText + ' - <img style="width: 12px;" src="/design/img/coins_bin.png"> ' + node.getElementsByClassName('pcdisplay-pc-price')[0].innerText + '<br/>';
        }, "");

        htmlstr = htmlstr + '<br /><a href="' + window.location.href +'">Link to sqaud</a>';

        var newWin = open('', 'Export list', 'height=300,width=300');
        newWin.document.write(htmlstr);
    }
})();