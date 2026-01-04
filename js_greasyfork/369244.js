// ==UserScript==
// @name         虎牙老e网页全屏
// @namespace    http://pansx.net/
// @version      0.9
// @description  使老e直播变为网页全屏
// @author       pansx
// @match        https://www.huya.com/edmunddzhang
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369244/%E8%99%8E%E7%89%99%E8%80%81e%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/369244/%E8%99%8E%E7%89%99%E8%80%81e%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $(function () {
        setTimeout(function () {
            $("#pub_msg_input").attr("placeholder","在此输入弹幕按回车发送").appendTo("#videoContainer");
            $("#videoContainer").prependTo("body").siblings().remove();
            $(".player-refresh-btn").click();
            $(".player-gift-wrap").remove();
            $(".player-ctrl-wrap").remove();
            $("body").append("<style>\n    .player-banner-gift {\n        display: none !important;\n    }\n\n    #player-marquee-wrap {\n        display: none !important;\n    }\n    #player-video{\n        height: 100vh !important;\n    }\n    #pub_msg_input{\n        transition: all 1s;\n        position: fixed;\n        z-index: 99;\n        bottom: 0;\n        left: 0;\n        right: 0;\n        width: 100vw;\n        height: 1rem;\n        border: 0;\n        background-color: transparent;\n        opacity: 0;\n    }\n    #pub_msg_input:hover {\n        border: 1px solid #ffffff;\n        font-size: 1.6rem;\n        line-height: 2rem;\n        height: 2rem;\n        color: #ffffff;\n        text-shadow: 0 0 10px white;\n        opacity: 1;\n        text-align: center;\n    }\n    \n" +
                "</style>");
        }, 3000);

    });



})();