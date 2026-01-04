// ==UserScript==
// @name                qq-docs Redirect Fix
// @name:zh-CN          腾讯文档地址重定向
// @description         Avoid link redirect for docs.qq.com
// @description:zh-CN   自动跳过网站安全性未知提示页面

// @author              GallenHu
// @namespace           https://hgl2.com
// @license             MIT
// @icon                https://pub.idqqimg.com/pc/misc/files/20200904/2eb030216d9362bbc6c0df045857b718.png

// @grant               none
// @run-at              document-end
// @include             https://docs.qq.com/scenario/link.html?url=*

// @date                03/15/2021
// @modified            03/15/2021
// @version             0.1.0
// @downloadURL https://update.greasyfork.org/scripts/423235/qq-docs%20Redirect%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/423235/qq-docs%20Redirect%20Fix.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let timer = null;

    function checkLink() {
        const $linkWrapper = document.querySelector('.url-click');
        if ($linkWrapper) {
            const targetUrl = $linkWrapper.innerText;
            if (targetUrl) {
                clearInterval(timer);
                location.href = targetUrl.trim();
            }
        }
    }

    timer = setInterval(checkLink, 100);
})();
