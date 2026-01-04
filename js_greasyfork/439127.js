// ==UserScript==
// @name         gdysxh_auto_videos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  医药协会_继续教育_我的课程
// @author       You
// @match        https://www.gdysxh.com/my_classes/classes/index.html
// @match        https://www.gdysxh.com/my_classes/classes/video/course_id/*
// @icon         https://www.google.com/s2/favicons?domain=gdysxh.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439127/gdysxh_auto_videos.user.js
// @updateURL https://update.greasyfork.org/scripts/439127/gdysxh_auto_videos.meta.js
// ==/UserScript==

window.onload = (function () {
    function appendJQCDN(src) {
        var head = document.body || document.getElementsByTagName('body')[0];
        if (src.indexOf("js") == -1) { //css
            var style = document.createElement('style');
            style.setAttribute("rel", "stylesheet");
            style.setAttribute("href", src);
            head.appendChild(style);
        } else {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.setAttribute("src", src);
            head.appendChild(script);
        }
    };

    let nocache = new Date().getTime();
    appendJQCDN("https://greasyfork.org/scripts/439126-gdysxh-auto-videos-source/code/gdysxh_auto_videos_source.js?"+nocache)

})();
