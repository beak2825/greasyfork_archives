// ==UserScript==
// @name         对AdBlock友好的知乎
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.0
// @description  和知乎的启用了Adblock的提示说再见
// @author       BackRunner
// @include      *://www.zhihu.com*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/373235/%E5%AF%B9AdBlock%E5%8F%8B%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/373235/%E5%AF%B9AdBlock%E5%8F%8B%E5%A5%BD%E7%9A%84%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {

    appendCSS();
    console.log("再见，AdblockBanner。");

    function appendCSS(){
        var cssText = "";
        cssText += '.AdblockBanner {display: none !important;}';

        var modStyle = document.querySelector('#modCSS_zhihu');
        if (modStyle === null){
            modStyle = document.createElement('style');
            modStyle.id = 'modCSS_zhihu';
            document.body.appendChild(modStyle);
            modStyle.innerHTML = cssText;
        }

    }
})();