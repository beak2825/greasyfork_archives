// ==UserScript==
// @name         WHUCodeInference
// @namespace    http://luxiaoxiao.work/
// @version      0.2.4
// @description  武大本科生院附件下载自动填验证码
// @author       LXX
// @license      MIT
// @match        https://uc.whu.edu.cn/system/_content/download.jsp*
// @icon         https://uc.whu.edu.cn/2022/images/favicon.ico
// @connect      code.luxiaoxiao.work
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/477081/WHUCodeInference.user.js
// @updateURL https://update.greasyfork.org/scripts/477081/WHUCodeInference.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var image = document.getElementById("codeimg");
    function sleep(sleepTime) {
        for(var start = new Date; new Date - start <= sleepTime;) {}
    }

    const inference = function(){
        context.drawImage(image, 0, 0);
        var base64Data = canvas.toDataURL('image/png');
        console.log(base64Data);
        base64Data = base64Data.replace(/^data:image\/png;base64,/, '');
        base64Data = base64Data.replace(/\+/g, '-').replace(/\//g, '_');
        console.log(base64Data);

        GM_xmlhttpRequest({
            method: 'get',
            url: 'https://code.luxiaoxiao.work/code/' + base64Data,
            onload: function(response){
                console.log(response);
                document.getElementById('codeValue').value = response.responseText;
            }
        })
    }

    const main = function(){
        image = document.getElementById("codeimg");
        inference();
    }
    window.addEventListener('load', function() {
        // 在页面的所有资源加载完成后执行一些操作
        image = document.getElementById("codeimg");
        inference();
    });
    //main();

    var canvas = document.createElement('canvas');
    canvas.width = 60
    canvas.height = 20;
    var context = canvas.getContext('2d');

    const callback = function(){
        console.log('changed!');
        sleep(500);
        image = document.getElementById("codeimg");
        inference();
    }
    const observer = new MutationObserver(callback);
    const config = {
        attributes: true
    }
    observer.observe(image, config);
    
})();