// ==UserScript==
// @name         autoopen
// @namespace    http://tampermonkey.net/
// @version      9.0.0
// @description  авываваыва
// @author       crypt
// @match        https://zelenka.guru/forums/contests*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/462119/autoopen.user.js
// @updateURL https://update.greasyfork.org/scripts/462119/autoopen.meta.js
// ==/UserScript==

var contest_sleep = 3000
var reload_sleep = 100000

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function openNewPage() {
    var dates = document.querySelectorAll('[id^="thread"]');
    for (var i = 0; i < dates.length; i++) {

        var alreadyIn = dates[i].innerHTML;
        console.log(alreadyIn.search('fa fa-bullseye mainc Tooltip') == -1);
        console.log(alreadyIn.search('alreadyParticipate') == -1);

        if (alreadyIn.search('alreadyParticipate') == -1 && alreadyIn.search('fa fa-bullseye mainc Tooltip') == -1) {
            setTimeout(function (i) {
                var num = dates[i].attributes.id.nodeValue;
                var splits = num.split('-');
                GM_openInTab('https://zelenka.guru/threads/' + splits[1]);
            }, contest_sleep * i, i);
        }
    }
}

openNewPage();
setTimeout(function(){ location.reload(); }, reload_sleep);