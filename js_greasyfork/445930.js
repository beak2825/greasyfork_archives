// ==UserScript==
// @name         海康监控后台扩展
// @namespace    
// @version      0.1.2
// @description  海康威视监控、录像机后台页面功能扩展
// @author       wanghouyusheng
// @match        *://*/doc/page/preview.asp
// @match        *://*/doc/page/playback.asp
// @match        *://*/doc/page/config.asp
// @icon         https://www.hikvision.com/etc/clientlibs/it/resources/icons/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445930/%E6%B5%B7%E5%BA%B7%E7%9B%91%E6%8E%A7%E5%90%8E%E5%8F%B0%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445930/%E6%B5%B7%E5%BA%B7%E7%9B%91%E6%8E%A7%E5%90%8E%E5%8F%B0%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function add_button () {
        var button = document.createElement("button");
        button.className = "btn";
        button.type = "button";
        button.title = "轮播";
        button.id = "auto_next";
        // button.setAttribute("ng-click", "auto_next()");
        // button.setAttribute("onclick",  'document.querySelector("#tool > div > div.tool-r > span > button:nth-child(7)").click();');
        button.innerHTML = '<div>轮播</div>'
        var span = document.querySelector("#tool > div > div.tool-r > span");
        span.insertBefore(button, span.childNodes[0]);
    }
    function auto_next_page () {
        var button = document.querySelector("#auto_next");
        button.onclick = function () {
            for (var i=1; i<100; i++) {
                setTimeout(
                    function () {
                        document.querySelector("#tool > div > div.tool-r > span > button:nth-child(7)").click();
                    },
                    10000 * (i - 1) + 800
                    );
                // count = count + 1
            }
        }
    }
    function remove_occr () {
        if (window.location.hostname == "192.168.9.211") {
            var occr1 = document.querySelector("#channel > div > div.channel-list > div:nth-child(28)");
            var occr2 = document.querySelector("#channel > div > div.channel-list > div:nth-child(46)");
            console.log("will remove the channels of original central control room");
            occr1.remove();
            occr2.remove();
        }
    }
    function remove_not_need () {
        var ptz, header_right, talk, talk_r, device, stream_list, stream, record_list, record, camera_list, camera, scope_list, scope, outline_list, outline;
        var idx, channel_list;
        ptz = document.querySelector("#ptz");
        header_right = document.querySelector("#header > div > div.header-r");
        talk = document.querySelector("#btn_talk_change");
        talk_r = document.querySelector("#tool > div > div.tool-l > span:nth-child(4)");
        device = document.querySelector("#channel > div > div.device");
        // stream_list = document.querySelectorAll("#channel > div > div.channel-list > div > div.ch-btns.ng-isolate-scope.ng-scope");
        // record_list = document.querySelectorAll("#channel > div > div.channel-list > div > div.ch-btns.recordContainer");
        // camera_list = document.querySelectorAll("#channel > div > div > div > div.ch-btns");
        scope_list = document.querySelectorAll("#channel > div > div.channel-list > div");
        ptz.remove();
        header_right.remove();
        talk.remove();
        talk_r.remove();
        device.remove();
        /*
        for (idx = 0; idx <= stream_list.length; idx++) {
            stream_list[idx].remove();
            record_list[idx].remove();
            camera_list[idx].remove();

        }
        */
        for (idx = 0; idx <= scope_list.length; idx++) {
            scope_list[idx].children[0].remove();
            scope_list[idx].children[1].remove();
            scope_list[idx].children[1].remove();
            scope_list[idx].children[0].setAttribute('style', 'width: 150px');
            if (!scope_list[idx].children[1].classList[1]) {
                scope_list[idx].remove();
            }
        }
    }
    var location_href = window.location.href;
    window.onload = function () {
        var footer = document.querySelector("#footer");
        footer.outerHTML = '<a href="myprotocol://" target="_blank" id="runexe" style="display: block"><div class="footer" id="footer">启用插件</div></a>';
        console.log("页脚已替换");
        //remove_occr();
        setTimeout(
            function () {
                var channel_list = document.querySelector("#channel > div > div.channel-list");
                if (location_href.endsWith("playback.asp")) {
                    channel_list.style = "height: 750px; overflow-y: auto;";
                }
                else {
                    channel_list.style = "height: 810px; overflow-y: auto;";
                }
                if (location_href.endsWith("preview.asp")) {
                    add_button();
                }
            },
            500
            );
        if (location_href.endsWith("preview.asp")) {
            setTimeout(
                function () {
                    auto_next_page();
                    remove_occr();
                    remove_not_need();
                },
                600
                );
        }
        if (location_href.endsWith("config.asp")) {
            setTimeout(
                function () {
                    // alert(location_href);
                    document.querySelector("#tableDigitalChannels").style = "height: 750px;";
                },
                3000
                );
        }
    }
})();