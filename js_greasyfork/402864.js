// ==UserScript==
// @name         取消所有微博关注
// @namespace    http://github.com/imlinhanchao/canel_all_watch_in_weibo
// @version      0.1
// @description  自动取消所有微博关注
// @author       Hancel
// @match        https://weibo.com/p/*/myfollow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402864/%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E5%BE%AE%E5%8D%9A%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/402864/%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E5%BE%AE%E5%8D%9A%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    window.onload = async () => {
        Array.from(document.getElementsByTagName('a')).filter(a => a.getAttribute('action-type') == 'cancel_follow_single');
        await sleep(2000);
        location = location;
    }
})();