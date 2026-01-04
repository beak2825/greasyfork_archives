// ==UserScript==
// @name         原神NGA板块屏蔽幽夜净土帖子
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  目前只支持桌面web页面
// @author       wcx19911123
// @include        *bbs.nga.cn/thread.php?fid=650*
// @icon         https://www.google.com/s2/favicons?domain=nga.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427627/%E5%8E%9F%E7%A5%9ENGA%E6%9D%BF%E5%9D%97%E5%B1%8F%E8%94%BD%E5%B9%BD%E5%A4%9C%E5%87%80%E5%9C%9F%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/427627/%E5%8E%9F%E7%A5%9ENGA%E6%9D%BF%E5%9D%97%E5%B1%8F%E8%94%BD%E5%B9%BD%E5%A4%9C%E5%87%80%E5%9C%9F%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==
const rubbish = /.*幽夜净土.*/;
(function() {
    'use strict';
    let eventId = setInterval(function(){
        document.querySelector("#topicrows") ?
            [... document.querySelector("#topicrows").querySelectorAll("td.c2")]
            .filter(o=>o.innerHTML.match(rubbish))
            .forEach(o=>o.parentNode.parentNode.remove())
        :null;
    },100);
})();