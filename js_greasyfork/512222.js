// ==UserScript==
// @name         Click2Redirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Encounter925
// @description  Inserts a floating button in the page and you can click it to get ariticles.
// @license      MIT
// @match        *://*.cnki.net/*
// @match        *://*.bj.cxstar.cn/*
// @match        *://*.blyun.com/*
// @match        *://*.zhizhen.com/*
// @match        *://qikan.chaoxing.com/*
// @match        *://*.innojoy.com/*
// @match        *://*.duxiu.com/*
// @match        *://*.epsnet.com.cn/*
// @match        *://*.keledge.com/*
// @match        *://*.qdexam.com/*
// @match        *://*.yjsexam.com/*
// @match        *://*.fenqubiao.com/*
// @match        *://*.engineeringvillage.com/*
// @match        *://*.emerald.com/*
// @match        *://*.nature.com/*
// @match        *://onepetro.org/*
// @match        *://*.onepetro.org/*
// @match        *://*.iresearchbook.cn/*
// @match        *://*.pqdtcn.com/*
// @match        *://*.sciencedirect.com/*
// @match        *://*.sciencemag.org/*
// @match        *://*.science.org/*
// @match        *://*.newacademic.net/*
// @match        *://*.wanfangdata.com.cn/*
// @match        *://*.wiley.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512222/Click2Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/512222/Click2Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href; //get current url

    var urlObj = new URL(currentUrl);

    // 获取服务器地址（包括协议和主机名）
    var serverAddress = urlObj.origin;

    var modifiedAssress = serverAddress.replace(/\./g, '-');
    modifiedAssress = modifiedAssress+'-s.atrust.yangtzeu.edu.cn';

    // 获取文件路径（不包括服务器地址）
    var filePath = currentUrl.substring(serverAddress.length);

    var destiUrl = modifiedAssress+filePath;

    // Create container for buttons
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '15%';
    container.style.right = '12px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';

    // Create first button
    var button1 = document.createElement('button');
    button1.innerHTML = '重定向';
    button1.style.padding = '10px';
    button1.style.cursor = 'pointer';
    button1.onclick = function() {
        // alert("Server:"+serverAddress+"\n"
        //     +"ModifiedServer:"+modifiedAssress+"\n"
        //     +"Path:"+filePath);
        alert("我们将跳转至:"+destiUrl);
        window.location.href = destiUrl;
        // window.open(destiUrl);
    };
    
    // Create second button
    var button2 = document.createElement('button');
    button2.innerHTML = '登陆';
    button2.style.padding = '10px';
    button2.style.cursor = 'pointer';
    button2.onclick = function() {
        // alert('Button 2 clicked!');
        window.open('https://atrust.yangtzeu.edu.cn:4443/');
    };

    // Add buttons to container
    container.appendChild(button1);
    container.appendChild(button2);

    // Add container to the body
    document.body.appendChild(container);
})();