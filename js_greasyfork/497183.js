// ==UserScript==
// @name         Zhihu free read
// @name:zh-CN   知乎关闭自动登陆
// @description  Zhihu free read, no login required
// @description:zh-cn 知乎关闭自动登陆
// @version      1.1
// @author       Anc
// @include      *://*zhihu.com/*
// @grant        none


// @namespace https://greasyfork.org/users/61607
// @downloadURL https://update.greasyfork.org/scripts/497183/Zhihu%20free%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/497183/Zhihu%20free%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';
        setTimeout(()=>{
            document.getElementsByClassName('Button Modal-closeButton Button--plain')[0].click();
        },1000);
})();