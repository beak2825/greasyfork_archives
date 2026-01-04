// ==UserScript==
// @name         中国保密在线网-自动完成视频打卡
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  保密打卡刷题

// @run-at       document-end
// @match        http://www.baomi.org.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501636/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91-%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/501636/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91-%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var $ = window.jQuery;
    class HttpRequest extends window.XMLHttpRequest {
        constructor() {
            super(...arguments);
            this._url = "";
            this._params = "";
        }
        open() {
            const arr = [...arguments];
            const url = arr[1];
            if (/studyTime\/saveCoursePackage.do/g.test(url)) {
                const [path, params] = url.split(/\?/);
                this._url = path;
                this._params = params;
                var replaceNum = Number(url.match(/resourceLength=(\d*)&/)[1]);
                var studyTime = replaceNum + Math.round(Math.random()*(50-20)+20);
                if (this._params) {
                    arr[1] = arr[1].replace(/(?<=studyLength=)(\d*)/, replaceNum).replace(/(?<=studyTime=)(\d*)/, studyTime);
                }
                Toast("任务完成");
            }else if(/coursePacket\/viewResourceDetails/g.test(url)){
                setTimeout(function () {
                    //setInterval(function () {
                        playVideo();
                    //}, 5000);
                }, 2000);

            }else if(/coursePacket\/getCourseResourceList/g.test(url)){

            }
            return super.open(...arr);
        }
    }

    function Toast(msg, duration) {
        console.log("QL_Toast");
        duration = isNaN(duration) ? 500 : duration;
        var m = document.createElement("div");
        m.innerHTML = msg;
        m.style.cssText =
            "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition =
                "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
            m.style.opacity = "0";
            setTimeout(function () {
                document.body.removeChild(m);
                history.back();
            }, d * 1000);
        }, duration);
    }

    window.XMLHttpRequest = HttpRequest;

    function playVideo(){
        let vd = $('video')[0];
        if (vd) {
            console.log("QL_video",vd);
            vd.volume = vd.volume === 0 ? 1 : 0;
            let vdb = $('.prism-play-btn')[0];
             if (vdb) {
                 console.log("QL_prism-play-btn",vdb);
                 $('.prism-play-btn')[0].click();
             }
        }
    }
})();