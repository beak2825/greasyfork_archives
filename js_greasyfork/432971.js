// ==UserScript==
// @name         背景动画
// @namespace    https://github.com/cy567/bganimate
// @version      0.1
// @description  网页背景动画脚本
// @author       cyblack
// @match        *://*/*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432971/%E8%83%8C%E6%99%AF%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/432971/%E8%83%8C%E6%99%AF%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==

function insertScript() {
    var scriptElement = document.createElement('script');
    scriptElement.src = "https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js"
    scriptElement.defer = true
   // scriptElement.text = 'L2Dwidget.init({"model": { "jsonPath": "https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json", "scale": 1, "hHeadPos": 0.5, "vHeadPos": 0.618 },"dialog": {enable: true,script: {"tap body": "哎呀！别碰我！","tap face": "人家是在认真写博客哦",}},"mobile": { "show": true, scale: 0.5 },"display": {"superSample": 2,"width": 200,"height": 400,"position": "left","hOffset": 0,"vOffset": 0}})';
    document.body.appendChild(scriptElement)
}

function insertL2Dwidget() {
    if(document.getElementById('live2d-widget')) {
        return false
    }
    const modelList = ['https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json',
                       'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json',
                       'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',
                       'https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json',
                       'https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json',
                       'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',
                      // 'https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json',
                      // 'https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json'
                      ];

    var scriptElement = document.createElement('script');
    let path = modelList[parseInt(Math.random()*modelList.length)];
    scriptElement.text = ` function init() { if(document.getElementById('live2d-widget')){return};L2Dwidget.init({"model": { "jsonPath": "${path}", "scale": 1, "hHeadPos": 0.5, "vHeadPos": 0.618 },"dialog": {enable: true,script: {"tap body": "哎呀！别碰我！","tap face": "hahahaha",}},"mobile": { "show": true, scale: 0.5 },"display": {"superSample": 2,"width": 100,"height": 200,"position": "right","hOffset": 0,"vOffset": 0}})};init()`;
    document.body.appendChild(scriptElement)
}

(function() {
    'use strict';
    insertScript()
    setTimeout(() => {
        insertL2Dwidget()
    }, 500)

   // Your code here...
})();