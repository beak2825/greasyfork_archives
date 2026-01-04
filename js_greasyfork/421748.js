// ==UserScript==
// @name         Scrape TornStats
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Scrapes data from torn stats
// @author       Natty_Boh[1651049]
// @include        https://beta.tornstats.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421748/Scrape%20TornStats.user.js
// @updateURL https://update.greasyfork.org/scripts/421748/Scrape%20TornStats.meta.js
// ==/UserScript==

'use strict';

setTimeout(renderButton, 500)

function renderButton(){
    if (!document.getElementById('scrape-button')) {
        var elem = document.getElementById('graph_description')
        if (elem != null) {
            let html = `<a href="#" class="scrape" id="scrape-button">SCRAPE DATA</a>`
            elem.insertAdjacentHTML('afterend', html);
            const scrapeButton = document.getElementById('scrape-button');
            scrapeButton.addEventListener('click', function () {
                func()
            });
            setTimeout(renderButton, 500)
        }
    }
}

function func() {
    var arr = []
    var table = document.getElementById("player-table").children[1]
    for (var i = 0, row; row = table.rows[i]; i++) {
        if(row.children[2].innerHTML.replace(/,/g, '') > 500) {
            arr.push(row.children[1].children[0].href.split('=')[1])
        }
    }
    var elem = document.getElementById('graph_description')
    let resulthtml = `<p>` + arr + `</p>`
    elem.insertAdjacentHTML('afterend', resulthtml);
}