// ==UserScript==
// @name         Pokemon Showdown 资料卡
// @name:zh-CN   Pokemon Showdown 资料卡
// @namespace    pokemon-showdown-card
// @version      0.8.0
// @description  Pokemon Showdown Local Card
// @description:zh-CN  Pokemon Showdown 本地资料卡
// @author       Sabertaz
// @license      MIT License
// @match        http://play.pokemonshowdown.com/*
// @match        https://play.pokemonshowdown.com/*
// @match        http://psim.us/*
// @match        https://psim.us/*
// @match        http://legacy.psim.us/*
// @match        https://legacy.psim.us/*
// @match        http://china.psim.us/*
// @match        https://china.psim.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421359/Pokemon%20Showdown%20%E8%B5%84%E6%96%99%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/421359/Pokemon%20Showdown%20%E8%B5%84%E6%96%99%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const spanGap = 40;
    let spanIdx = 3;

    const createSpan = (text) => {
        const span = document.createElement('textarea');
        span.style.position = 'fixed';
        span.style.right = '40px';
        span.style.bottom = `${spanIdx * spanGap}px`;
        //span.style.minHeight = '100px';
        span.style.height = 'auto';
        span.style.zIndex = 9999;
        span.textContent = text;
        span.rows = '5';
        span.readOnly = 'true';
        span.classList.add('span');
        spanIdx++;
        return span;
    }

    const idSpan = createSpan('TakeOwn: Yes\nBall: Moon Ball\nLanguage: ChineseS\nOT: 赛博塔VGC\nTID: 320210\nSID: 3869\nOTGender: Female');
    document.body.appendChild(idSpan);
})();