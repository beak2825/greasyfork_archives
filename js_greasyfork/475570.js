// ==UserScript==
// @name         webvpn-中国知网入口
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在兰交大webvpn网站添加中国知网入口
// @author       白白小草
// @match        https://webvpn.lzjtu.edu.cn/
// @icon         http://authserver.lzjtu.edu.cn/oss/serviceIcon/5554839989070099/1.0_EM1/icon_72.png?sign=lfRTc_YKqmM2zuQaYy0SIHCztjAb7v5db9vjIIpRzNIJvIhsklP8eMX1tO3p2e9r
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475570/webvpn-%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/475570/webvpn-%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var lastChild = document.querySelector('.block-group__content');
        if (lastChild){
            var newDiv = document.createElement('div');
            newDiv.className = 'block-group__item__wrap';
            var newAnchor = document.createElement('a');
            newAnchor.href = 'https://webvpn.lzjtu.edu.cn/https/494a553139386968732a235e35546e2827384a30190ce109615cefc6/';
            newAnchor.target = '_blank'
            newAnchor.className = 'block-group__item';
            var newLogoDiv = document.createElement('div');
            newLogoDiv.className = 'block-group__item__logo__wrap';
            var newLogo = document.createElement('div');
            newLogo.className = 'block-group__item__logo';
            newLogo.style.backgroundColor = 'rgb(242, 115, 61)';
            newLogo.textContent = '知';
            newLogoDiv.appendChild(newLogo);
            var newContentDiv = document.createElement('div');
            newContentDiv.className = 'block-group__item__content';
            var newName = document.createElement('h2');
            newName.title = '中国知网';
            newName.className = 'block-group__item__name';
            newName.textContent = '中国知网';
            var newDesc = document.createElement('div');
            newDesc.title = 'www.cnki.net';
            newDesc.className = 'block-group__item__desc';
            newDesc.textContent = 'www.cnki.net';
            var newSvg = document.createElement('svg');
            newSvg.ariaHidden = 'true';
            newSvg.title = '收藏';
            newSvg.className = 'wrdvpn-icon';
            var useElement = document.createElement('use');
            useElement.setAttribute('xlink:href', '#wrdvpn-collect');
            newSvg.appendChild(useElement);
            newContentDiv.appendChild(newName);
            newContentDiv.appendChild(newDesc);
            newContentDiv.appendChild(newSvg);
            newAnchor.appendChild(newLogoDiv);
            newAnchor.appendChild(newContentDiv);
            newDiv.appendChild(newAnchor);
            lastChild.appendChild(newDiv);
        }
    }, 2000);
})();