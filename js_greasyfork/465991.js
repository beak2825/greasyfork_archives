// ==UserScript==
// @name         审核助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  要打开粤语审核页面, 微软翻译页面(https://www.bing.com/translator)
// @author       You
// @match        https://tcs.jiyunhudong.com/workprocess/*
// @match        https://www.bing.com/translator*
// @match        https://cn.bing.com/translator*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiyunhudong.com
// @grant        GM_addStyle
// @grant        window.onurlchange
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_deleteValue
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/465991/%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465991/%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
function addStyle() {
    let css = `
        .panel-container {
            padding: 18px;
            width: 224px;
            position: fixed;
            top: 64px;
            right: 30px;
            background-color: #fff;
            box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
            border-radius: 8px;
        }
        #origin-text-maximum {
            font-weight: bold;
            background-color: #eee;
            border-radius: 4px;
            padding: 2px 6px;
        }
        #origin-text-maximum-input{
           display: inline-block;
           width: 50px;
           margin: 4px 6px;
        }
        #submit-btn {
           border: none;
           padding: 2px 6px;
           border-radius: 4px;
        }
        #current-text-length {
            font-weight: bold;
        }
    `;

    GM_addStyle(css);
}

function createContainer(innerHTML = '') {
    let containEle = document.createElement('div');
    document.body.append(containEle);
    containEle.className = "panel-container";
    containEle.innerHTML = innerHTML;
    document.body.append(containEle);

    return containEle;
}

function isTimeout(oldTime, time) {
    return ((new Date).getTime() - oldTime > time);
}



const TRANSLATE_INTERVAL = 2000;

function getTranslatedText(text) {
    document.getElementById('tta_input_ta').value = text;
    document.getElementById('tta_input_ta').click();
    return new Promise((res) => {
        setTimeout(() => {
            res(document.getElementById('tta_output_ta').value);
        }, (parseInt(text.length / 50) || 1) * TRANSLATE_INTERVAL); // 每增加50字, 增加2秒等待时间
    });
}




let theTranslatedText = '';
function checkTranslatedText() { // 在 TCS 页检查是否有翻译好的文本
    setInterval(() => {
        let text = GM_getValue('translatedText');
        if (text && theTranslatedText !== text) {
            document.getElementsByClassName('tcs_text_correct_enable')[1].value = text;
            theTranslatedText = text;
        }
    }, 2000);
}

function resetValue() {
    GM_deleteValue('originText');
    GM_deleteValue('translatedText');
}

// 初始化 submit-btn 点击事件
let originTextMaximum = '';
function initEvent() {
    const $submitBtn = document.getElementById('submit-btn');
    const $originTextMaximum = document.getElementById('origin-text-maximum');
    const $originTextMaximumIput = document.getElementById('origin-text-maximum-input');
    $submitBtn.onclick = async () => {
        if ($originTextMaximumIput.value.trim()) {
            await GM.setValue("originTextMaximum", $originTextMaximumIput.value);
            originTextMaximum = $originTextMaximumIput.value;
            $originTextMaximum.innerText = $originTextMaximumIput.value;
            $originTextMaximumIput.value = null;
        }
    };
}
async function init() {
    let isTCSPage = Boolean(document.getElementById('app_master'));
    originTextMaximum = await GM.getValue('originTextMaximum');
    if (isTCSPage) {
        // 当前是 TCS 页
        resetValue();
        createContainer(`
        请务必同时打开<a target="_blank" href="https://www.bing.com/translator">微软翻译</a>页面
        <hr />
        字数超过 <span id="origin-text-maximum">${originTextMaximum || '未设'}</span> 不翻译 <span id="current-text-length"></span><br />
        上限字数:<input id="origin-text-maximum-input" type="number"><button id="submit-btn">提交</button>`);
        initEvent();
        const $currentLength = document.getElementById('current-text-length');
        let now = (new Date).getTime();
        let timer = setInterval(async () => {
            let ele = document.getElementsByClassName('tcs_text_correct_enable')[0];
            let ele1 = document.getElementsByClassName('tcs_text_correct_enable')[1];

            if (ele && ele1) { // 页面已经加载好
                $currentLength.innerText = '当前:' + ele.value.length || '';
                if (originTextMaximum && ele.value.length > originTextMaximum) {
                    console.warn("字数超出所设上限了");
                } else {
                    await GM.setValue("originText", ele.value);
                    checkTranslatedText();
                }
                clearInterval(timer);
            } else if (isTimeout(now, 2000)) {
                clearInterval(timer);
            }
        }, 500);


        if (window.onurlchange === null) {
            // feature is supported
            window.addEventListener('urlchange', (info) => {
                setTimeout(() => {
                    let textAreas = document.getElementsByClassName('tcs_text_correct_enable');
                    $currentLength.innerText = '当前:' + textAreas[0]?.value?.length || '';
                    if (!originTextMaximum || textAreas[0]?.value?.length < originTextMaximum) {
                        textAreas[1].value = "...";
                        GM_setValue("originText", textAreas[0].value);
                    } else {
                        resetValue();
                    }
                }, 800);
            });
        }
    } else {
        // 在翻译页
        createContainer("想配合TCS翻译, 不要关闭此页面");
        let theOriginText = '';
        setInterval(() => {
            let text = GM_getValue('originText');
            if (text && text !== theOriginText) {
                theOriginText = text;
                getTranslatedText(text).then(async function (translatedText) {
                    await GM_setValue('translatedText', translatedText)
                });
            }
        }, 1200); // 1200 毫秒检查一次是否TCS页面有更新
    }
}

(function () {
    'use strict';
    addStyle();
    init();
})();
