// ==UserScript==
// @name                正方教务教学评价填写(需手动提交)
// @namespace           https://bbs.tampermonkey.net.cn/
// @version             0.1.0
// @description         广西职师院专供
// @author              JHPatchouli
// @match               https://jw.gxvnu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @downloadURL https://update.greasyfork.org/scripts/447569/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%A1%AB%E5%86%99%28%E9%9C%80%E6%89%8B%E5%8A%A8%E6%8F%90%E4%BA%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447569/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E5%A1%AB%E5%86%99%28%E9%9C%80%E6%89%8B%E5%8A%A8%E6%8F%90%E4%BA%A4%29.meta.js
// ==/UserScript==
(function () {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    'use strict';
    let divObj = document.createElement('div');
    divObj.innerHTML = '<button id="btnx" style="width: 80px;height: 40px;">评分</button>';
    divObj.style = "position: fixed;z-index: 999;top: 0px;margin: 0px auto;text-align: center;width: 1900px;";
    //把div添加到body作为他的子元素
    document.body.appendChild(divObj);
    btnx.addEventListener('click', async function () {
        var kc = document.getElementsByClassName("ui-widget-content jqgrow ui-row-ltr");
        for (let index = 0; index < kc.length; index++) {
            const elekc = kc[index];
            if (elekc.getElementsByTagName('td')[7].innerText == "未评") {
                elekc.click();
                await sleep(3000);
                var doc = document.getElementsByClassName("radio-pjf");
                var docle = doc.length;
                for (let i = 0; i < docle; i += 5) {
                    const elemen = doc[i];
                    elemen.checked = "true";
                }
                await sleep(4000);
            }
        }
    })
})();