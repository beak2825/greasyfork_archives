// ==UserScript==
// @name         ProtonDB Status Badge
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a badge of ProtonDB Status to Steam store page with shields.io.
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        *://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425762/ProtonDB%20Status%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/425762/ProtonDB%20Status%20Badge.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
'use strict';

var D = document;

const appid = D.querySelector("meta[property='og:url']").content.split('/')[4];
const badgeHref = 'https://www.protondb.com/app/' + appid;
const badgeSrc = `https://img.shields.io/badge/dynamic/json.svg
                  ?uri=https://www.protondb.com/api/v1/reports/summaries/${appid}.json
                  &query=$.trendingTier
                  &label=ProtonDB
                  &colorB=e3e3e3
                  &style=plastic`.replace(/\s+/g, "");

var protonElm = D.createElement('div');
protonElm.innerHTML = `
<div class="dev_row">
    <div class="subtitle column">ProtonDB:</div>
    <div class="summary column">
        <a href="${badgeHref}" target="_blank">
            <img src="${badgeSrc}" />
        </a>
    </div>
</div>`.trim();

D.querySelector('div.user_reviews').appendChild(protonElm.firstChild);

})();