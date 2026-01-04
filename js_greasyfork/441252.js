// ==UserScript==
// @name         Tools-身份證產生器-自動產生身份證並複製
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自動點擊generate和check按扭並反白產生的身份證字號
// @author       Hander
// @match        https://people.debian.org/~paulliu/ROCid.html
// @icon         https://www.google.com/s2/favicons?domain=debian.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441252/Tools-%E8%BA%AB%E4%BB%BD%E8%AD%89%E7%94%A2%E7%94%9F%E5%99%A8-%E8%87%AA%E5%8B%95%E7%94%A2%E7%94%9F%E8%BA%AB%E4%BB%BD%E8%AD%89%E4%B8%A6%E8%A4%87%E8%A3%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441252/Tools-%E8%BA%AB%E4%BB%BD%E8%AD%89%E7%94%A2%E7%94%9F%E5%99%A8-%E8%87%AA%E5%8B%95%E7%94%A2%E7%94%9F%E8%BA%AB%E4%BB%BD%E8%AD%89%E4%B8%A6%E8%A4%87%E8%A3%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generate
    output2(city,sex,mid,idoutput1,idoutput2);

    // Check
    output3(idoutput1,idoutput2,city,sex,mid);


    // 選取產生的身份證字號
    idoutput1.a.select();
    // document.execCommand("copy");








    // var textarea = document.createElement('textarea');
    // textarea.textContent = idoutput1.a.value;
    // document.body.appendChild(textarea);

    // var selection = document.getSelection();
    // var range = document.createRange();
    // range.selectNode(textarea);
    // selection.removeAllRanges();
    // selection.addRange(range);

    // console.log('copy success', document.execCommand('copy'));
    // selection.removeAllRanges();

    // document.body.removeChild(textarea);
})();