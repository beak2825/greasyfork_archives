// ==UserScript==
// @name         云班课一键看班课资源
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Avenshy
// @match        https://www.mosoteach.cn/web/index.php*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/423325/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E7%9C%8B%E7%8F%AD%E8%AF%BE%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423325/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%B8%80%E9%94%AE%E7%9C%8B%E7%8F%AD%E8%AF%BE%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==


(function () {
    'use strict';
    function HookPlay() {
        let temp = myPlayer.play;
        myPlayer.play = function () {
            temp();
            let count = 0;
            let int = setInterval(function () {
                count++;
                if (isNaN(myPlayer.duration) == false) {
                    clearInterval(int);
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: 'https://www.mosoteach.cn/web/index.php?c=res&m=save_watch_to',
                        data: {
                            clazz_course_id: clazzcourseId,
                            res_id: watchingResId,
                            watch_to: Math.ceil(myPlayer.duration),
                            duration: Math.ceil(myPlayer.duration),
                            current_watch_to: Math.ceil(myPlayer.duration)
                        },
                        success: function () {
                            location.reload();
                        }
                    }); // 直接复制修改官方代码 
                }
                if (count > 100) {
                    clearInterval(int);
                    location.reload();
                }
            }, 10);
        };
    };

    function run() {
        HookPlay();
        let menu = document.querySelectorAll("div[data-value].res-row-open-enable");
        let i = 1;
        for (let x of menu) {
            let finish = x.querySelector("span[data-is-drag]").getAttribute("data-is-drag");
            console.log(finish);
            if (finish == "N") {
                if (Array.from(x.classList).includes("preview")) { // 对视频特殊处理
                    x.click();
                    return null;

                } else { // 不是视频则直接刷
                    $.get("/web/index.php?c=res&m=online_preview&clazz_course_id=" + clazzcourseId + "&file_id=" + x.getAttribute("data-value"),
                        function (data, status) {
                            console.log(i + " > " + status);
                        }
                    );
                }
            }
            i++;
        }

        GM_setValue("FuckYBK", "0");
        alert('FINISH !!Made By Avenshy !!');
        location.reload();

    }
    function SetMenuStart() {
        GM_registerMenuCommand("开启脚本", () => {
            GM_setValue("FuckYBK", "1");
            GM_unregisterMenuCommand("开启脚本");
            SetMenuStop();
            run();
        });
    }
    function SetMenuStop() {
        GM_registerMenuCommand("停止脚本", () => {
            GM_setValue("FuckYBK", "0");
            location.reload();
        });
    }


    if (GM_getValue("FuckYBK", "") == "1") {
        SetMenuStop();
        run();
    } else {
        SetMenuStart();
    }

    // Your code here...
})();