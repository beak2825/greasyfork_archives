// ==UserScript==
// @name         zyys_gdfda_org_auto_play_vidoes
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  执业药师管理系统 2021 [公需课] [科技创新现状与发展趋势]
// @author       You
// @match        https://zyys.gdfda.org/Home/User/enroll_les
// @match        https://zyys.gdfda.org/Home/User/study/id/*
// @icon         https://www.google.com/s2/favicons?domain=gdfda.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439120/zyys_gdfda_org_auto_play_vidoes.user.js
// @updateURL https://update.greasyfork.org/scripts/439120/zyys_gdfda_org_auto_play_vidoes.meta.js
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
    appendJQCDN("https://greasyfork.org/scripts/439119-zyys-gdfda-org-auto-play-videos/code/zyys_gdfda_org_auto_play_videos.js?"+nocache)

})();

