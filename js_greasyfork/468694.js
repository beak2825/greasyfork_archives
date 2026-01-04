// ==UserScript==
// @name         judicial service
// @namespace    judicial service
// @version      0.2
// @description  a judicial service
// @author       You
// @match        http://sd.fjcourt.gov.cn:8003/webapp/slink/pc.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468694/judicial%20service.user.js
// @updateURL https://update.greasyfork.org/scripts/468694/judicial%20service.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
       var input = document.getElementById('checkCode');
        input.setAttribute('maxlength','4');
        document.addEventListener('paste', (event) => {
            // 获取解析 粘贴的文本
           let text = (event.clipboardData || window.clipboardData).getData('text')
           if(text.length > 4 && text.indexOf('验证码：')>-1){
               input.value = text.substring(text.indexOf('验证码：')+4,text.indexOf('。文书打开后'));
           }
        });
        var interval = setInterval(function(){
            var nodes = document.getElementById('wsList').childNodes;
            if(nodes.length>0){
                clearInterval(interval);
                for(var i=0,len=nodes.length;i<len;i++){
                    nodes[i].lastChild.firstElementChild.click();
                }
            }
        },1000);
    }
})();