// ==UserScript==
// @name         CNMOOC视频进度条解禁
// @namespace    nekomoyi.enable_cnmooc_progressbar
// @version      1.0.0
// @description  允许CNMOOC拖动视频进度条
// @author       nekomoyi
// @match        https://*.cnmooc.org/study/initplay/*.mooc
// @match        https://*.cnmooc.org/study/unit/*.mooc
// @match        https://cnmooc.org/study/initplay/*.mooc
// @match        https://cnmooc.org/study/unit/*.mooc
// @icon         https://www.cnmooc.org/images/zhitu/icon-sub01.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480323/CNMOOC%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%A7%A3%E7%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/480323/CNMOOC%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1%E8%A7%A3%E7%A6%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fxxkProgressBar(){
        if(typeof jwObj != 'undefined' && document.querySelector("#mediaplayer_view span.jwcontrols") != null){
            var currentPos = jwObj.getPosition();
            jwObj.seek(jwObj.getDuration() - 2);
            setTimeout(function(){
                jwObj.seek(currentPos);
            }, 1000);
        }else{
            console.log("未找到播放器");
        }
    }
    var button = document.createElement('button');
    button.innerHTML = '启用进度条';
    button.style.position = 'fixed';
    button.style.top = '5px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.addEventListener('click', function() {
        fxxkProgressBar();
    });
    document.body.appendChild(button);
})();