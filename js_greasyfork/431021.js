// ==UserScript==
// @name         bilibili（B站）番剧CC字幕自动转换/翻译（繁体转简体）
// @name:en         bilibili Auto CC Subtitle Translation (Traditional Chinesee -> Simplified Chinese)
// @name:zh-CN         bilibili（B站）番剧CC字幕自动转换/翻译（繁体转简体）
// @description:en  For bilibili videos
// @description:zh-CN  For bilibili videos B站番剧字幕翻译(繁体中文转简体中文)
// @namespace    http://tampermonkey.net/
// @version      0.1.7.1
// @description  For bilibili videos
// @author       CY Fung
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require https://greasyfork.org/scripts/430412-chinese-conversion-api/code/Chinese%20Conversion%20API.js?version=957744
// @license MIT
// @run-at document-start
// @grant        none
//解决了bilibili（B站）番剧的CC字幕的繁简转换
//代码更改由CY Fung的代码修改而来
//源项目地址：https://greasyfork.org/zh-CN/scripts/428492
//源项目授权：license MIT
// @downloadURL https://update.greasyfork.org/scripts/431021/bilibili%EF%BC%88B%E7%AB%99%EF%BC%89%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%E7%BF%BB%E8%AF%91%EF%BC%88%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/431021/bilibili%EF%BC%88B%E7%AB%99%EF%BC%89%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%E7%BF%BB%E8%AF%91%EF%BC%88%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93%EF%BC%89.meta.js
// ==/UserScript==

const {tc2sc} = window.ChineseConversionAPI;

(function() {
    'use strict';
    const hKey_json_parse='rhlxuprkmayw'

    JSON.parse[hKey_json_parse]||!(() => {

        const $$parse=JSON.parse;
        JSON.parse=function(){
            if(typeof arguments[0]=='string' && arguments[0].length>16){
                if(/"(from|to|location)"\s*:\s*[\d\.]+/.test(arguments[0])){
                    arguments[0]= tc2sc(arguments[0])
                }
            }
            return $$parse.apply(this,arguments)
        }
        JSON.parse.toString=()=>$$parse.toString();
        JSON.parse[hKey_json_parse]=true


    })();



})();


(function $$() {
    'use strict';

if(!document||!document.documentElement) window.requestAnimationFrame($$)

function addStyle (styleText) {
  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.textContent = styleText;
  document.documentElement.appendChild(styleNode);
  return styleNode;
}

addStyle(`
.bilibili-player-video-subtitle .subtitle-item-text{
font-family: system-ui;
}
`)

})();