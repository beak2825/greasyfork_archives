// ==UserScript==
// @name         H3C eos日志格式
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  修改H3C的eos日志字体为等宽字体
// @author       z404p
// @match        *://eos.h3c.com/project/logs*
// @match        *://eos-ts.h3c.com/project/logs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447530/H3C%20eos%E6%97%A5%E5%BF%97%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447530/H3C%20eos%E6%97%A5%E5%BF%97%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t = setInterval(function(){
        if(document.getElementById("loghtml")){
            var elementStyle = document.getElementById("loghtml").style
            elementStyle['font-family'] = 'Consolas'
            elementStyle['letter-spacing'] = '0'
            clearInterval(t);
        }
    }, 100);

    var pNum=0
    var t2 = setInterval(function(){
        if(document.getElementById("loghtml")){
            var element = document.getElementById("loghtml")
            if(pNum !== element.children.length){
                console.log(element.children.length)
                pNum = element.children.length
                editChildren(element)
            }
        }
    }, 100);

    function editChildren(element){
        for (let i = 0; i < element.children.length; i++) {
            var children = element.children[i];
            children.style['margin-bottom'] = '5px'
            children.style['word-break'] = 'break-word'
            if(children.innerHTML.includes(' ERROR')){
                children.style.color = 'red'
            }else if(children.innerHTML.includes(' WARN')){
                children.style.color = '#92d900'
            }else if(children.innerHTML.includes(' DEBUG')){
                children.style.color = '#959595'
            }
        }
    }
})();