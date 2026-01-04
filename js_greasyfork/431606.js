// ==UserScript==
// @name         开心过英语vip
// @namespace    http://www.kaixg.net
// @version      0.2
// @description  开启vip
// @author       You
// @match        http://*.kaixg.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431606/%E5%BC%80%E5%BF%83%E8%BF%87%E8%8B%B1%E8%AF%ADvip.user.js
// @updateURL https://update.greasyfork.org/scripts/431606/%E5%BC%80%E5%BF%83%E8%BF%87%E8%8B%B1%E8%AF%ADvip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        document.getElementsByClassName("praxis_item_video_analys_video")[0].style.marginTop =0
        document.getElementsByClassName("praxis_item_video_analys_video")[0].style.display = "block"
        document.getElementsByClassName("praxis_item_video_analys_poster")[0].style.display = "none"

    },2*1000);

})();