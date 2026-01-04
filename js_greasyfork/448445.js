// ==UserScript==
// @name         华科超星快捷评教脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  用于快速评教
// @author       tctco
// @match        *://newes.chaoxing.com/pj/newesReception/questionnaireInfo*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448445/%E5%8D%8E%E7%A7%91%E8%B6%85%E6%98%9F%E5%BF%AB%E6%8D%B7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448445/%E5%8D%8E%E7%A7%91%E8%B6%85%E6%98%9F%E5%BF%AB%E6%8D%B7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let colors = ['#0fb912', '#497709', '#d79a07', '#ff0000'];
    let texts = ['全优', '全优良', '全中', '全差'];
    let scores = ['1.0', '0.8', '0.6', '0.4'];
    let container = document.createElement('div');
    container.style.cssText = 'position:fixed;right:0px;top:60px;z-index:99999;'
    for (let i = 0; i < colors.length; i++) {
        container.appendChild(createBtn(texts[i], colors[i], scores[i]))
    }

    document.body.appendChild(container);

})();

function selectScore(score) { // 科里化
    return () => {
        let l = document.getElementsByClassName('inputvalue'); // 分项评分
        for (let op of l) {
            if (op.getAttribute('score') === score) op.checked = true;
        }
        let radios = document.getElementsByClassName('reselect'); // 最满意课堂/最不满意课堂评价
        switch (score) {
            case '1.0':
                radios[40].checked = true;
                break;
            case '0.8':
            case '0.6':
                radios[42].checked = true;
                break;
            case '0.4':
                radios[41].checked = true;
                break;
        }
        save(2);
    }
}

function createBtn(text, color, score) {
    let btn = document.createElement('div');
    btn.style.cssText = `width:100%;background-color:${color};width:100px;height:30px;text-align:center;cursor:pointer;vertical-align:center;`
    btn.onclick = selectScore(score);
    btn.innerHTML = text;
    return btn;
}