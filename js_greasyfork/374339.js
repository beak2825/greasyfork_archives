// ==UserScript==
// @name         google translate utils
// @name:zh-CN   google翻译实用工具
// @namespace    https://github.com/tabedit/tamperMonkey
// @version      0.6
// @description  auto remove line break for google translate(replaced with space)
// @description:zh-CN 自动移除google翻译原文中的换行符（替换为空格）
// @author       tabedit
// @include     http*://translate.google.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374339/google%20translate%20utils.user.js
// @updateURL https://update.greasyfork.org/scripts/374339/google%20translate%20utils.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var container = Array.from(document.querySelectorAll('nav')).filter(v => v.innerHTML.indexOf('翻译类型') !== -1)[0]
    var customButton = container.children[2].cloneNode(true);
    customButton.querySelector('svg').remove();
    customButton.querySelector('button').innerText = '自动替换换行';
    container.appendChild(customButton);
    if(localStorage.getItem('replaceOn') === 'true'){
        customButton.style.backgroundColor='#E4ECFA';
    }

    // button for switch whether turn replace on
    customButton.addEventListener('click',function(event){
        var replaceOn = localStorage.getItem('replaceOn') === 'true';
        if(!replaceOn){
            localStorage.setItem('replaceOn', 'true')
            customButton.style.backgroundColor='#E4ECFA';
        }else{
            localStorage.setItem('replaceOn', 'false')
            customButton.style.backgroundColor='#FAFAFA';
        }
    });

    // Your code here...
    function single(){
        var replaceOn = localStorage.getItem('replaceOn') === 'true';
        if(replaceOn === false){
            return
        }
        var raw = /text=([^&]+)/.exec(location.href);
        raw = raw && raw[1]
        if(!raw){
            return
        }
        raw = decodeURIComponent(raw);
        if(!/\n/.test(raw)){
            return
        }
        var replaced = raw.replace(/\n/g, ' ')
                          .replace(/ {2,}/g, ' ')
                          .replace(/\. /g, '.')
        replaced = encodeURIComponent(replaced);
        var location_href = location.href.replace(/text=([^&]+)/, 'text=' + replaced)
        location.href = location_href;
        return true
    }
    function loop(){
        setTimeout(()=> {
            if(single()){
                return
            }
            loop()
        }, 200)
    }
    loop()
})();