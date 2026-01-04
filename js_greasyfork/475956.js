// ==UserScript==
// @name         BLACKLIST-LZT
// @namespace    BLACKLIST-LZT
// @version      2
// @description  Черный список ЛЗТ
// @author       анапа2007
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      анапа2007
// @downloadURL https://update.greasyfork.org/scripts/475956/BLACKLIST-LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/475956/BLACKLIST-LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userId = [4526055, 130411, 291806, 4392978, 431587, 3740180, 2655428, 4949238, 106631, 6300187, 4261050, 222815, 3146986, 3909739, 6266214, 5817640, 4724789, 5400862, 2410024, 39541, 437086, 5610047, 7532768, 6538093, 3048647, 583406, 2171880, 5628970, 4626251, 2927898, 4447951, 288110, 381733, 2420878, 5632358, 5284864, 7054509, 6665441, 2243751, 3660313, 586850,  4464231, 3355592, 2882235, 4523981, 2924457, 912127, 6974123, 4488111, 4881147, 3649877, 5271542, 713065, 4519826, 2494720, 3347461, 3900256, 6582749, 3381504, 1003800, 6279898, 3430982, 4844272, 3988393, 924527, 14641, 7560275, 3860393, 7553505, 2323373, 6721592, 3752647, 6938076, 549832, 4759322, 967966, 957218, 2283430, 3740180, 3812139, 5516690, 3438657, 3667711, 35578, 3008139, 6257108, 5792810, 3146986, 3586434, 4713857, 5873777, 7036001, 6290347, 3666210, 4698015];
    const button = document.querySelector('button.lzt-fe-se-sendMessageButton');
    const div = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
    if (button && div) {
        button.addEventListener('click', function() {
            const elements = [];
            const childElements = div.children;
            for (var i = 0; i < childElements.length; i++) elements.push(childElements[i].outerHTML);
            if(elements.length != 0) div.innerHTML = `[exceptids=${userId.join(",")}]` + elements.join("<br>") + "[/exceptids]"
            setTimeout(function(){
                div.innerHTML = ``;
            }, 1);
        });
    }
})();