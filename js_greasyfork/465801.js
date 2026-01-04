// ==UserScript==
// @name         91新页面观看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  91新页面观看，告别烦人的广告
// @author       水鬼派克
// @match        http*://*.workarea2.live/*
// @match        http*://*.91porn.com/*
// @match        http*://*.91p*.com/*
// @match        http*://*.91p*.live/*
// @match        http*://*.91p51.live/*
// @match        http*://*.workgreat11.live/*
// @match        http*://*.91p46.com/*
// @match        http*://*.91p321.com/*
// @match        http*://*.workarea9.live/*
// @icon         https://0117.workarea2.live/images/logo.png
// @grant       unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465801/91%E6%96%B0%E9%A1%B5%E9%9D%A2%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465801/91%E6%96%B0%E9%A1%B5%E9%9D%A2%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==
(function () {
    '观看窗口1';
    var button1 = document.createElement('button');
    button1.id = "openOnNewWin1";
    button1.style.color = '#ff6578'
    button1.style.position = "fixed";
    button1.style.left = "0px";
    button1.style.top = "220px";
    button1.style['z-index'] = "999999";
    button1.innerHTML = "观看窗口1";
    document.body.appendChild(button1);
    document.getElementById('openOnNewWin1').addEventListener('click', function () {
        window.open("http://91.9p9.xyz/ev.php?VID=" + document.getElementById('VUID').innerText);
    })
})();
(function () {
    '观看窗口2';
    var button2 = document.createElement('button');
    button2.id = "openOnNewWin2";
    button2.style.color = '#123456'
    button2.style.position = "fixed";
    button2.style.left = "0px";
    button2.style.top = "270px";
    button2.style['z-index'] = "999999";
    button2.innerHTML = "观看窗口2";
    var VID2 = document.querySelector('#favorite #VID').innerHTML
    document.body.appendChild(button2);
    document.getElementById('openOnNewWin2').addEventListener('click', function () {
        alert('请复制一下网址\n https://cdn77.91p49.com/m3u8/' + VID2 + '/' + VID2 + '.m3u8\n去新的窗口的粘贴解析一下')
        setTimeout(() => {
            window.open("http://www.m3u8.zone/");
        }, 2000)
    })
})();


