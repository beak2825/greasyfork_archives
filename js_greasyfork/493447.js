// ==UserScript==
// @name        Viefaucet Auto Shortlinks
// @namespace   Violentmonkey Scripts
// @match       https://viefaucet.com/app/link*
// @grant       none
// @version     1.0
// @author      -
// @description 4/22/2024, 9:42:15 AM
// @downloadURL https://update.greasyfork.org/scripts/493447/Viefaucet%20Auto%20Shortlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/493447/Viefaucet%20Auto%20Shortlinks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var cols = document.querySelectorAll('.el-col');
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (!col.querySelector('*')) {
                col.remove();
                continue;
            }
            var card = col.querySelector('.el-card');
            if (card) {
                var cardBody = card.querySelector('.el-card__body');
                if (cardBody) {
                    var paragraph = cardBody.querySelector('.link-name');
                    if (paragraph) {
                        var text = paragraph.textContent.trim().toLowerCase();
                        const keywordsToRemove = [ // Place the shortlinks that you don't want to solve here...
                          'shortlinks',
                          'rsshort',
                          //'clks',
                          //'earnow.online',
                          'gms',
                          //'adlink',
                          'easycut',
                          'freeltc.top',
                          'bestlink',
                          //'revcut', 'inlinks', 'nightfaucet',
                          'btcut',
                          'paycut',
                          'c2g',
                          'vielink',
                          'linksfly',
                          //'cutlink',
                          'sharecut',
                          'shortano',
                          'ctr.sh',
                          'try2link',
                          'shortino',
                          'freecrypto',
                          //'urlcut',
                          'paylinks',
                          'cinfo',
                          'bitss',
                          //'quicklink',
                          //'faho',
                          'exalink',
                          //'bitad',
                          'shrinkearn.com',
                          'shrinkme.io',
                          'clk.sh',
                          'droplink',
                          'hatelink'
                        ];
                        if (keywordsToRemove.includes(text)) {
                            col.remove();
                        }
                    }
                }
            }
        }
    }, 3000);
    setTimeout(function() {
        var buttons = document.querySelectorAll('button[class*="el-button"]');
        if (buttons.length >= 0) {
            buttons[0].click();
        }
    }, 5000);
})();