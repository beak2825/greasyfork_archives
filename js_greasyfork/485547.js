// ==UserScript==
// @name         BILIBILI首页封面替换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个可以将bilibili首页顶部封面更换的一个个性化脚本
// @author       KAFUU CHINO
// @match        https://www.bilibili.com/
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/485547/BILIBILI%E9%A6%96%E9%A1%B5%E5%B0%81%E9%9D%A2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/485547/BILIBILI%E9%A6%96%E9%A1%B5%E5%B0%81%E9%9D%A2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==


(function ()  {var css = [
	".bili-header__banner {",
    "  min-height: 305px !important;",
    "  z-index: 0;",
	"}",
    	".animated-banner {",
    "   display: none;",
	"}",
        	".logo-img {",
    "   display: none !important;",
	"}",
        	".custom-navbar.transparent::before {",
    "   display: none;",
	"}",
            	".custom-navbar {",
    "       background-color: #ffffff00 !important;",
	"}"
].join("\n");
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}


    // 只需要在此处定义需要隐藏元素
    var clearElementArr = [
        '#bili-header-banner-img'
    ];

    // 这是架子代码，不用改动
    console.log("准备隐藏以下元素 >>> " + clearElementArr);
    window.pageC = function (clearElements) {
        let style = document.createElement("style");
        if (typeof (clearElements) === "object") {
            clearElements.forEach(cE => {
                style.innerText += `${cE} {display: none !important;} `
            });
        } else {
            console.error("param error,require array!");
        }
        document.head.appendChild(style);
    };
    pageC(clearElementArr);
    console.log("清理完成！");
        'use strict';
    let a = document.querySelector('.bili-header__banner');
    a.style.backgroundImage='url(//www.freeimg.cn/i/2024/01/21/65acd4ab736f1.png)';

})();