// ==UserScript==
// @name         91标题+url修复
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  91porn最近不知道为什么很多视频的链接都经过md5加密了，因此不能直接右击-后台标签页打开，这非常不便于快速浏览视频，并且视频播放页或许是为了反爬，页面title不显示视频的标题了。这个插件就是为了修复这两个问题而诞生的。
// @author       guess
// @match        http://www.91porn.com/*
// @match        https://www.91porn.com/*
// @match        https://91porn.com/*
// @match        http://91porn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512722/91%E6%A0%87%E9%A2%98%2Burl%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/512722/91%E6%A0%87%E9%A2%98%2Burl%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
        document.title = document.querySelector("#videodetails > h4").textContent.replace(/\s+/g, '');
    } catch (error) {
        console.log('no title')
    }
      // 等待页面加载完成
    window.addEventListener('load', function() {
        let parentElement = document.querySelector("#wrapper > div.container.container-minheight > div.row > div > div");
        try{
            document.title = document.querySelector("#videodetails > h4").textContent.replace(/\s+/g, '');
        } catch (error) {
            console.log('no title')
        }

        for (let i = 0; i < parentElement.childElementCount; i++) {
            let div = parentElement.children[i]
            let change_a = document.querySelector(`#wrapper > div.container.container-minheight > div.row > div > div > div:nth-child(${i+1}) > div > a`)
            // 在每个 div 中查找 a 标签
            let anchor = div.querySelector('a');
            // 如果 a 标签存在，获取 href 属性
            let href_source = anchor.getAttribute('href');
            try{
                let onclick_source = anchor.getAttribute('onclick');
                let md5_href = onclick_source.match(/'([^']+)'/)[1];
                change_a.href=atob(md5_href);
                change_a.setAttribute('target', '_blank')
            } catch (error) {
                console.log("")
            }
        }
    });
})();