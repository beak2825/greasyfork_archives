// ==UserScript==
// @name         布雷克影院跳过支付
// @namespace    https://p00q.cn
// @version      0.4
// @description  该脚本用于跳过布雷克影院（http://www.breakvip.com）观影支付环节。
// @author       DanBai
// @match        http://www.breakvip.com/*
// @icon         http://breakvip.czmhgz.cn/wp-content/uploads/2018/11/c7925a33830e59.ico
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430596/%E5%B8%83%E9%9B%B7%E5%85%8B%E5%BD%B1%E9%99%A2%E8%B7%B3%E8%BF%87%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/430596/%E5%B8%83%E9%9B%B7%E5%85%8B%E5%BD%B1%E9%99%A2%E8%B7%B3%E8%BF%87%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getCache(key) {
        if (window.localStorage) {
            var storage = window.localStorage;
            return JSON.parse(storage.getItem(key));
        }
    }
    function setCache(key, data) {
        if (window.localStorage) {
            var storage = window.localStorage;
            storage.setItem(key, JSON.stringify(data));
        }
    }
    Storage.add = function (name, addVal) {
        let oldVal = Storage.get(name)
        let newVal = oldVal.concat(addVal)
        Storage.set(name, newVal)

    }
    function deleteCache(key) {
        if (window.localStorage) {
            var storage = window.localStorage;
            storage.removeItem(key);
        }

    }
    window.onload = function () {
        $(".footmobile").replaceWith(`<div class="footmobile">
        声明本站内容均由站长精心采集自互联网并以此牟利，请联系www.ncac.gov.cn并举报。<br />
        <a href="http://www.ncac.gov.cn/chinacopyright/channels/12578.shtml"
        style="background:red;" target="_blank">点击举报</a>
        </div>`);
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", window.location.href, true);
        httpRequest.send();
        var pattern = /http.*(m3u8|mp4)/;
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var dp = new DPlayer({
                    element: document.getElementById("dplayer"),
                    autoplay: true,
                    preload: "auto",
                    loop: false,
                    screenshot: false,
                    hotkey: true,
                    video: {
                        url: pattern.exec(httpRequest.responseText)[0],
                    },
                })
                window.dp = dp;
                var key = window.btoa(window.location.href);
                var time = getCache(key);
                if (time != null) {
                    window.dp.seek(time);
                    window.dp.play();
                }
                $(".dplayer").css("width","80%");
                window.setInterval(function () {
                    if (window.dp.video.currentTime > 10) {
                        setCache(key, window.dp.video.currentTime);
                    }
                }, 266);
            }
        };
    }
})();