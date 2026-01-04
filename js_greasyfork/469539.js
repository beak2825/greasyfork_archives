// ==UserScript==
// @name         BiliBili港台番剧CC字幕繁转简去黑边字体优化
// @name:en      BiliBili Bangumi CC Subtile Auto Translation And Improvement
// @name:zh-CN   BiliBili港台番剧CC字幕繁转简去黑边字体优化
// @description  哔哩哔哩B站番剧字幕自动翻译繁转简、去除字幕黑色边框、字体大小样式位置优化
// @description:en BiliBili bangumi CC subtitle auto translation (CHT to CHS), make subtitle background transparent, improve font-style
// @description:zh-CN  哔哩哔哩B站番剧字幕自动翻译繁转简、去除字幕黑色边框、字体样式优化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       大猹狸子
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require https://greasyfork.org/scripts/430412-chinese-conversion-api/code/Chinese%20Conversion%20API.js?version=957744
// @license MIT
// @run-at document-start
// @grant    GM_addStyle
//项目参考自Rurutie、Howard20181二位的代码
//源项目地址：https://greasyfork.org/zh-CN/scripts/428492
//源项目授权：license MIT
// @downloadURL https://update.greasyfork.org/scripts/469539/BiliBili%E6%B8%AF%E5%8F%B0%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E7%B9%81%E8%BD%AC%E7%AE%80%E5%8E%BB%E9%BB%91%E8%BE%B9%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469539/BiliBili%E6%B8%AF%E5%8F%B0%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E7%B9%81%E8%BD%AC%E7%AE%80%E5%8E%BB%E9%BB%91%E8%BE%B9%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
GM_addStyle(`
    .squirtle-subtitle-item-text{
    background: rgba(0, 0, 0, 0) !important;
    transform: scale(1.3);
    bottom: -0.5em;
    font-weight: bold;
    -webkit-text-stroke: 0.033em #000;
    font-family:"Microsoft YaHei","微软雅黑",Helvetica,Tahoma,Arial,STXihei,sans-serif;
    }
`);

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