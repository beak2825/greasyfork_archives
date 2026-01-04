// ==UserScript==
// @name         小康在线播放器
// @namespace    http://www.jixiaokang.com
// @version      0.1
// @description  看天下的视频!
// @author       xkloveme
// @match        *://www.zuidazy4.com/*
// @match        *://www.zuidazy.com/*
// @match        *://www.zuidazy*.com/*
// @match        *://www.yongjiuzy1.com/*
// @match        *://www.yongjiuzy.com/*
// @match        *://www.156zy.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421940/%E5%B0%8F%E5%BA%B7%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421940/%E5%B0%8F%E5%BA%B7%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('小康在线播放器加载成功');
    for (let index = 0; index < document.all.length; index++) {
        const element = document.all[index];
        if(element.innerText.indexOf('.m3u8')>-1&&element.nodeName==='LI'){
            console.log(element);
            var buttonDiv = document.createElement("div");
            buttonDiv.appendChild(document.createTextNode("点击在线播放"))
            buttonDiv.style = "background-color: #f44336; border-radius: 10px; color: white; padding: 0px 15px;  margin: 10px;cursor:pointer;line-height: 33px;font-weight: 500; display:inline-block;";
            buttonDiv.onclick = function() {
                var str = element.innerText.substring(element.innerText.indexOf('//'),element.innerText.lastIndexOf('.m3u8'))+'.m3u8'
                console.log(element.innerText,33,element.innerText.substring(element.innerText.indexOf('//'),element.innerText.lastIndexOf('.m3u8'))+'.m3u8');
                var name =element.innerText.substring(0,element.innerText.indexOf('$http'))
                window.open("https://www.jixiaokang.com/whatisit/#/?url="+str+'&name='+name);
            };
            element.append(buttonDiv);
        }
    }
    // Your code here...
})();