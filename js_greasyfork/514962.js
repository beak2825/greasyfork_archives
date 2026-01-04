// ==UserScript==
// @name         问卷星310题自动填写指定答案
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  填写310题答案，答案集合为每行10个答案的矩阵
// @author       zzzhht1
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @match        https://www.wjx.*/*/*
// @match        http://www.wjx.*/*/*
// @icon         https://image.wjx.com/images/newimg/index/star.png
// @grant        none
// @require      https://www.layuicdn.com/layer/layer.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/514962/%E9%97%AE%E5%8D%B7%E6%98%9F310%E9%A2%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8C%87%E5%AE%9A%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/514962/%E9%97%AE%E5%8D%B7%E6%98%9F310%E9%A2%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8C%87%E5%AE%9A%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    var randWrite_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
    randWrite_btn.id = "randWrite_btn";
    randWrite_btn.textContent = "填写答案";
    randWrite_btn.style.width = "4rem";
    randWrite_btn.style.height = "2rem";
    randWrite_btn.style.marginLeft = '1rem';
    randWrite_btn.type = 'button';
    randWrite_btn.onclick = function (e){
        writeAnswer()
    }
    $('#toptitle h1').eq(0).append(randWrite_btn);































































    function writeAnswer() {
        var ans_ls_html = document.querySelectorAll('.field.ui-field-contain');
        var answers = [
            "r0","r0","r0","r0","r1","r0","r1","r1","r1","r1","r1","r0",
            "r0","r0","r1","r1","r0","r0","r0","r0","r0","r1",
            "r1","r3","r1","r0","r2","r1","r1","r3","r0","r2",
            "r3","r2","r2","r1","r1","r1","r3","r3","r1","r3",
            "r3","r0","c0123","c23","c0123","c0123","c0123","c0123","c0123","r0",
            "r0","r0","r1","r0","r0","r0","r0","r0","r0","r1",
            "r0","r1","r0","r2","r2","r1","r0","r0","r3","c0123",
            "c0123","c0123","c02","c0123","r0","r0","r0","r0","r1","r0",
            "r1","r0","r1","r1","r0","r0","r0","r1","r0","r0",
            "r1","r1","r0","r2","r0","r3","r2","r3","c0123","c01",
            "c0123","c013","c012","r1","r1","r0","r0","r0","r0","r0",
            "r0","r2","r3","r3","r3","r2","r3","r2","r3","r1",
            "c0123","c0123","r0","r0","r0","r1","r0","r0","r1","r1",
            "r1","r0","r3","r2","r0","r3","r0","r3","r2","r0",
            "c0123","c012","c0123","c123","c0123","r1","r0","r1","r1","r0",
            "r1","r0","r0","r1","r0","r1","r1","r0","r1","r1",
            "r1","r3","r2","r1","r0","r0","r0","c0123","c123","c0123",
            "c0123","c0123","c23","c0123","c01","c023","r0","r1","r0","r1",
            "r0","r0","r0","r0","r0","r0","r0","r0","r1","r1",
            "r0","r0","r0","r0","r0","r0","r0","r1","r0","r0",
            "r0","r0","r0","r1","r0","r3","r1","r0","r0","r2",
            "r3","r2","r1","r0","r2","r3","r2","r1","r1","r0",
            "r2","r0","r2","r2","r2","r2","r3","r0","r1","r1",
            "r0","r2","c0123","c01","c03","c01","c123","c13","c013","c0123",
            "c12","c0123","c13","c013","c0123","c12","r0","r0","r0","r0",
            "r0","r0","r0","r1","r0","r0","r0","r1","r1","r1",
            "r0","r1","r1","r1","r0","r0","r1","r0","r0","r1",
            "r1","r0","r1","r0","r0","r0","r0","r1","r0","r3",
            "r2","r1","r2","r1","r1","r3","r3","r0","r2","r3",
            "r3","r3","r0","r1","r0","c01","c023","c123","c0123","c0123",
            "c01","c0123","c0123","c0123","c023","c0123","c01","c123","c013","c013"
        ]; //310答案集合

/*        ar answers = [
            "r0","r0",
        ]; //489答案合集
*/

        // 填写答案
        for (let i = 0; i < ans_ls_html.length; i++) {
            const answerString = answers[i]; //按顺序获取答案
            const answerType = answerString.charAt(0); // 判断单选或多选'r' 或 'c'
            const answerValue = answerString.substring(1); // 去掉前缀后的答案
            //const fields = ans_ls_html[i].querySelectorAll(`.ui-${answerType === 'r' ? 'radio' : 'checkbox'}`);
            const radios = ans_ls_html[i].querySelectorAll('.ui-radio');
            const checkboxes = ans_ls_html[i].querySelectorAll('.ui-checkbox');

            if (answerType === 'r') {
                const indexToSelect = parseInt(answerValue);
                if (!isNaN(indexToSelect) && indexToSelect < radios.length) {
                    radios[indexToSelect].click();
                }
            } else if (answerType === 'c') {
                const indicesToSelect = answerValue.split('');
                for (let k = 0; k < indicesToSelect.length; k++) {
                    const checkboxIndex = parseInt(indicesToSelect[k]);
                    if (!isNaN(checkboxIndex) && checkboxIndex < checkboxes.length) {
                        checkboxes[checkboxIndex].click();
                    }
                }
            }
        }
    }




})();