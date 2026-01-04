// ==UserScript==
// @name         Nga-自定义自己的发言颜色
// @namespace    fufu.net
// @version      1.0
// @description  不要爱慕虚荣
// @author       monat151
// @run-at       document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/462188/Nga-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8F%91%E8%A8%80%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/462188/Nga-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8F%91%E8%A8%80%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selfDefColor = 'rgb(128 98 51)'; // 在这里自定义

    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;

    setTimeout(() => {
        var post_infos = document.getElementsByClassName('postInfo');
        forEach(post_infos, function(o) {
            let me_uid = page.__CURRENT_UID;
            var buttons = getButtons(o);
            var fp = buttons.parentElement.id;
            if(fp.length>=19) fp='0';
            fp = fp.substr(13);console.log(fp);
            var uid = document.getElementsByName('uid')[fp%20]?.text;
            let isSelf = uid==me_uid
            // Def ui
            if (isSelf) {
                let oldStyle = buttons.parentElement.style
                if (buttons.parentElement.style) {
                    buttons.parentElement.style.color = selfDefColor;
                } else {
                    buttons.parentElement.style = 'color: ' + selfDefColor;
                }
            }
        });
    }, 10);

    function forEach(obj, func) {
        var len = obj.length;
        for (var i=0; i<len; i++) {
            func(obj[i]);
        }
    }
    function getButtons(post_info) {
        return post_info;
    }
})();