// ==UserScript==
// @name         🔥🔥🔥【持续更新】CSDN、B站（bilibili）、51CTO博客、站酷等各类网站轻松复制
// @namespace    http://tampermonkey.net/
// @version      1.3.3.6
// @description  【🔥 功能1】复制CSDN文字：多数脚本已实现未登录可复制CSDN网页中的代码，本脚本补充实现未登录可复制CSDN网页中的文字，且不限于CSDN，51CTO博客等众多其他网站也适用，自测便知。【🔥 功能2】去掉B站尾巴：去掉B站文字复制粘贴后出现的作者和链接等信息，且不限于B站，众多其他网站也适用，自测便知。【🔥 功能3】安卓手机浏览器也可用：先安装支持油猴（Tampermonkey）插件的安卓手机浏览器（如：kiwi 浏览器），再安装油猴插件，最后安装本脚本，以上所有功能在手机上也可用。
// @author       wfjeefwe
// @match        *blog.csdn.net/*
// @match        *.bilibili.com/*
// @match        *.51cto.com/*
// @match        *zcool.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACoElEQVRYR+2UT2hcVRTGf99LTEGki/x5nRmrjTNDpqaUQoKO4kYQQcRFCzaLWIWKhYLYRRctdNNk1xYRSopYFFxokVriJhaLiN2kQgJuQiN2nBknEH3JpCmUYrWYeV950xRsKd1JN++uDufce853fvfcKx7x0iOuTyogJZASSAmkBO4hcHlwsOvGzTgXmKy9dr2ri5WhanXl//yu2wJ+ym/d3hGzFxgFb/pvwXLjioqZzKDxfsslwQ7gcSACmrInLJ1dP7NkWMBcaK3FpxeuXo2K3d0bvaHzPGIjpgfoNsxJPlP7c2VCM/mtbyj2aUMO+F5mzvIlSU9gb36+UTlWyIaXgW2Gc5hf2slgs3Af1reID23GEUXBc8AAMC8HI2tws0Px78A/hsnAumW5fDefZraUvkbsBn9VblRGH4Q7nw1XdUf5uQCmgo7Wj5XF1T+SvYVs30nQAcOeetQ8k/jymXBM4ijWKan1uQl+Fvq1Gi0/m8SLmd6XreBiYmumv+TEiPH4i43K2AMFZPpel7QT2AX0AteNPq5Hy0cK2fCbxN+K9UJjeXnmvgIXbE9IOg/8UIuar94X/1uzz5SmbV7CfFFeuPLOwwaumMn0Qbzb4l1gWPaIpcOJfaujq2dxcfHaHSphgrwf+YAddAp/JJisRs031+NJI4nwec1uKb1l8WUbB9SM5rCrEqWWg/E9/65+QEw3YskmksgDb7eF2nuRjgNhewbwkNAwIpdcVz1qjuRz4SmZ98Gf1aKVfW0C2U3vGX9qe6r9CmafHnjFgZIXUAblDdcEC491tnaO/HXjoB33Iw0BTyF+w8zbVOpLzbFCNpwGnmx3DA1ww+hsPWp+st7td8BrmBO1pWZCi0IuPIQ5Dj6Z/oQpgZRASiAlkBK4DZtvGMy5535NAAAAAElFTkSuQmCC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469335/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E3%80%91CSDN%E3%80%81B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E3%80%8151CTO%E5%8D%9A%E5%AE%A2%E3%80%81%E7%AB%99%E9%85%B7%E7%AD%89%E5%90%84%E7%B1%BB%E7%BD%91%E7%AB%99%E8%BD%BB%E6%9D%BE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469335/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E3%80%91CSDN%E3%80%81B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E3%80%8151CTO%E5%8D%9A%E5%AE%A2%E3%80%81%E7%AB%99%E9%85%B7%E7%AD%89%E5%90%84%E7%B1%BB%E7%BD%91%E7%AB%99%E8%BD%BB%E6%9D%BE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('*')].forEach(item=>{
        item.oncopy = function(e) {
            e.stopPropagation();
        }
    });
})();
