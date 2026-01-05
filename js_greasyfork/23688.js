// ==UserScript==
// @name         新浪科技内页精简
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.2
// @description  精简新浪科技文章页，去广告和多余模块
// @author       BackRunner
// @include      http://tech.sina.com.cn/*
// @run-at       document-body
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/23688/%E6%96%B0%E6%B5%AA%E7%A7%91%E6%8A%80%E5%86%85%E9%A1%B5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/23688/%E6%96%B0%E6%B5%AA%E7%A7%91%E6%8A%80%E5%86%85%E9%A1%B5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

// == 更新日志 ==
// 2017.04.23 - 1.2
// 更新规则
// ==============
(function() {
    var cssText = "";
    //聚焦
    cssText += '#left_focus_ad {display: none !important;}';
	//广告
	cssText += '.sinaAd {display: none !important;}';
    cssText += '.sinaads {display: none !important; height:0px !important;}';
    cssText += '.ad {display: none !important;}';
	cssText += '.top_ad {display: none !important;} .ads {display: none !important;} .sinaad-toolkit-box{display: none !important;}';
    //众测
	cssText += '.zhongce {display: none !important;}';
    var modStyle = document.querySelector('#modCSS');
    if (modStyle === null)
    {
        modStyle = document.createElement('style');
        modStyle.id = 'modCSS';
        document.body.appendChild(modStyle);
    }   
    modStyle.innerHTML = cssText;
})();