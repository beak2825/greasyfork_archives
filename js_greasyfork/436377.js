// ==UserScript==
// @name         芯参数vip限制移除
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  移除芯参数中vip的限制
// @author       leandrowhy
// @match        *://*.www.xincanshu.com/*
// @icon         https://www.google.com/s2/favicons?domain=xincanshu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436377/%E8%8A%AF%E5%8F%82%E6%95%B0vip%E9%99%90%E5%88%B6%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/436377/%E8%8A%AF%E5%8F%82%E6%95%B0vip%E9%99%90%E5%88%B6%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleDom = document.getElementsByClassName('mui-input-row')[0]
    var isWhile = true
    while(isWhile){
        styleDom = styleDom.previousSibling
        if(styleDom.tagName=="STYLE") isWhile=false
    }
    var dom = document.getElementsByClassName('cack_jt_box')[0].children
    for(let i=0;i<=4;i++){
        dom[i]?dom[i].style.display= "none":''
    }
    styleDom.innerText = ".vip_denglukejian .zheceng2021_1639367170 {\n    position: absolute;\n    width: 0;\n    height: 0;\n    background: rgba(0, 0, 0, 0.3);\n    z-index: -5;\n    left: 0px;\n    top: 0px;\n}\n\n.vip_denglukejian .tishitubiao {\n    font-size: 60px;\n    padding-bottom: 10px;\n}\n\n.vip_denglukejian .denglutishi1639367170 {\n    text-align: center;\n    position: absolute;\n    z-index: -89;\n    top: -1090px;\n    margin-left: -120px;\n    left: 0%;\n    padding: 20px;\n    background: white;\n    border-radius: 4px;\n    background: rgba(255, 255, 255, 1);\n}\n\n.vip_denglukejian .cpu_index_a3 #chart-wrapper {\n    filter: blur(0px);\n}\n\n.vip_denglukejian .cpu_index_a3 .paofenjietu {\n    filter: blur(0px);\n}\n\n.vip_denglukejian .denglutishi1639367170 .wxdl {\n}\n\n.vip_denglukejian .denglutishi1639367170 p {\n    color: #424242;\n    padding-bottom: 20px;\n    font-size: 16px;\n}\n\n.vip_denglukejian .denglutishi1639367170 .wxdl a {\n    width: 200px;\n    background: #4CAF50;\n    color: white;\n    border-radius: 4px;\n    display: inline-block;\n    text-align: center;\n    padding: 6px;\n}\n\n.vip_denglukejian .denglutishi1639367170 .wxdl a:hover {\n    background: #39943c;\n    color: white!important;\n}\n\n.vip_denglukejian .denglutishi1639367170 .wxdl a i {\n    font-size: 20px;\n    margin-right: 2px;\n}\n\n.cack_jt_box {\n    display: block;\n}\n\n@keyframes mimahuxichange {\n    0% {\n        opacity: .6;\n    }\n\n    10% {\n        opacity: .95;\n    }\n\n    100% {\n        opacity: 1;\n    }\n}\n\n.vip_denglukejian .denglutishi1639367170 {\n    animation-name: mimahuxichange;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-direction: alternate;\n}"
})();