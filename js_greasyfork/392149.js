// ==UserScript==
// @name         keylol 添加只看我的
// @description  keylol 添加"只看我的"链接
// @author       Splash
// @namespace    https://greasyfork.org/users/101223
// @version      0.4
// @match        https://keylol.com/t*
// @match        https://keylol.com/forum.php?mod=viewthread&tid=*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392149/keylol%20%E6%B7%BB%E5%8A%A0%E5%8F%AA%E7%9C%8B%E6%88%91%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/392149/keylol%20%E6%B7%BB%E5%8A%A0%E5%8F%AA%E7%9C%8B%E6%88%91%E7%9A%84.meta.js
// ==/UserScript==

(function () {
    'use strict';
    unsafeWindow.jQuery('.plc div.authi>a[rel=nofollow]').eq(0).after(`<span class="pipe">|</span><a href="forum.php?mod=viewthread&tid=${unsafeWindow.tid}&authorid=${unsafeWindow.discuz_uid}">只看我的</a>`);
})();