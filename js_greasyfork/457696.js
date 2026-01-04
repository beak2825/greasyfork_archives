// ==UserScript==
// @name         Pynyau problem solver
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A wishmaster compatible with sosach
// @license      MIT
// @author       Burunduk Vanya
// @match        https://2ch.hk/po/*
// @match        https://2ch.life/po/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457696/Pynyau%20problem%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/457696/Pynyau%20problem%20solver.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const randomColor = ((floor = 256) => {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        
        return `rgb(${r}, ${g}, ${b});`;
    });

    let matchWords = [
        'путин',
        'Путин'
    ];

    let replacements = {
        'путин': "пыня",
        'Путин': "Пыня"
    };

    const doReplace = (() => {
        for (let index = 0; index < matchWords.length; index++) {
            const element = matchWords[index];
            
            $(`article:contains("${element}")`).each(function() {
                let text = $(this).html();
    
                text = text.replaceAll(element, () => { return `<span style="color:${randomColor(115)}background-color:${randomColor()}">${replacements[element]}</span>`; });
    
                $(this).html(text);
            });
        }
    });

    setInterval(doReplace, 4500);
    doReplace();
})();