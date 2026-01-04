// ==UserScript==
// @name         bilibili 自動字幕轉換（簡體轉繁體）
// @name:en         bilibili Auto Subtitle Translation (Simplified Chinese -> Traditional Chinese)
// @name:zh-TW         bilibili 自動字幕轉換（簡體轉繁體）
// @name:zh-CN         bilibili 自动字幕转换（简体转繁体）
// @description:en  For bilibili videos
// @description:zh-tw  For bilibili videos
// @description:zh-cn  For bilibili videos
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  For bilibili videos
// @author       CY Fung
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require https://greasyfork.org/scripts/430412-chinese-conversion-api/code/Chinese%20Conversion%20API.js?version=957744
// @license MIT
// @run-at document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428492/bilibili%20%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E8%BD%89%E6%8F%9B%EF%BC%88%E7%B0%A1%E9%AB%94%E8%BD%89%E7%B9%81%E9%AB%94%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/428492/bilibili%20%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E8%BD%89%E6%8F%9B%EF%BC%88%E7%B0%A1%E9%AB%94%E8%BD%89%E7%B9%81%E9%AB%94%EF%BC%89.meta.js
// ==/UserScript==

const {sc2tc} = window.ChineseConversionAPI;

(function() {
    'use strict';
    const hKey_json_parse='rhlxuprkmayw'

    JSON.parse[hKey_json_parse]||!(() => {

        const $$parse=JSON.parse;
        JSON.parse=function(){
            if(typeof arguments[0]=='string' && arguments[0].length>16){
                if(/"(from|to|location)"\s*:\s*[\d\.]+/.test(arguments[0])){
                    arguments[0]= sc2tc(arguments[0])
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