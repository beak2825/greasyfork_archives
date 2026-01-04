// ==UserScript==
// @name         阿里云后台刷新
// @version      1.0
// @namespace    HolyNight
// @description  阿里云后台页面的定时刷新
// @author       shengguangchanhui@foxmail.com
// @run-at       document-start
// @match        https://www.baidu.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js
// @downloadURL https://update.greasyfork.org/scripts/406311/%E9%98%BF%E9%87%8C%E4%BA%91%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406311/%E9%98%BF%E9%87%8C%E4%BA%91%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

function ahInit(){
    setTimeout(() => {
        tryReset();
    }, 1000*60*1);
}

window.addEventListener('load', ahInit, false);