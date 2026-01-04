// ==UserScript==
// @name         调整网页亮度
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  调整网页亮度,护眼
// @description:en  Adjust page brightness,eyeshield
// @author       wodexianghua
// @match        http://*/*
// @match        https://*/*
// @match        file:///*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/392399/%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E4%BA%AE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/392399/%E8%B0%83%E6%95%B4%E7%BD%91%E9%A1%B5%E4%BA%AE%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //保证iframe不起作用
    if (self == top) {
        var timer = null;
        var mousemove = false;
        var shift_downorup = false;
        var liangduui;
        var liangduuitz;
        var liangduuitzmouse;
        var __nightingale_view_cover;

        function insertHTML(lv) {
            if (self == top) {
                //https://www.easyicon.net/api/resizeApi.php?id=1180288&size=24
                document.body.insertAdjacentHTML("beforebegin",
                    '<div class="liangduui" style="display: none; width: 60px; height: 170px; background-color: rgb(255, 255, 255); z-index: 2147483640; position: fixed; top: 200px; left: 50%; border-radius: 50px; box-shadow: rgb(74, 74, 74) 0px 0px 20px;"><div class="liangduuitzmouse" style="width:40%;height:100px;background-color:#cecece;position:absolute;top:20px;left:30%;border-radius:50px;cursor:pointer"><div class="liangduuitz" style="width: 100%; height: 100%; background-color: rgb(147, 112, 223); position: absolute; bottom: 0px; right: 0px; border-radius: 50px;"></div></div><div style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAtFBMVEUAAABPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNPXXNOXHJNXHJmcoVgbIBqdolNW3GwtsBNW3JMW3GLlKLX2+BfbIBKWG+CjJyDjZxKWW/Y2+CLlKNea3+XoK1pdYh9iJiYoK16hZbS1tz5+fr////T1tzs7fCDjJxmc4bS1ttpdYd6hZXr7e98hpfj5em7wcmutL6utb9gbYGqsLvt7vFueYxjZY6cAAAAD3RSTlMAAAhBktDyOKftBmzngPgUDvOpAAAAAWJLR0QqU77UngAAAAd0SU1FB+UCEQw2CnjrwgQAAAE1SURBVCjPdZLpdoIwEIUTFgFRJyAQEFdWQVvr1rq8/3t1kkBPz2mdPzm5H9zZQgghlFJNN8wBwMA0dA2vhCiZWrYDXTi2RRWidOiOpMaYPEbuUADUxxMUPWC+z8BDOBkLQqkr9GkAYRRxCKaCuAJYwidOZul8sVyl600s3CxKNBu/j3mWF2VVlUWe8Rj/sTWiO+izyXi9bdq22dU8S9DN0YkB4AXrvN63MvZ1Pgs8AIOYosK02LVdbItUKCbBflk4L5seNOU8xCQDgrofvVXtT1SL6B2JAst/wF+rlbLqkh96cPjokstyZ/nxpPTTMV+rcmWDScbOF6FfzizbqAbVSBiEVwGuobyIkaghIvwU4KtbidWPHcHt/njcbxKosatFIYHnE5Q+7lfYrZbz36t9/RhePJ9vQOAtdle14JgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDctMTlUMDM6Mzk6MTgrMDA6MDA7B0fYAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA4VDE5OjM5OjQ4KzAwOjAwyXZcbAAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAAxMjhDfEGAAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADEyONCNEd0AAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTU0Njk3NjM4OKgYFgEAAAARdEVYdFRodW1iOjpTaXplADMzMDhCPmi6RgAAAFp0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2RhdGEvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vZmlsZXMvMTE4LzExODAyODgucG5n1XuOIwAAAABJRU5ErkJggg==);width:24px;height:24px;position:absolute;bottom:15px;right:18px;border-radius:50%;box-shadow:0 0 10px #9370df;background-repeat:no-repeat"></div></div><div id="__nightingale_view_cover" style="width: 100%; height: 100%; transition: -webkit-transform 10s ease-in-out 0s; position: fixed !important; left: 0px !important; bottom: 0px !important; overflow: hidden !important; background: rgb(0, 0, 0) !important; pointer-events: none !important; z-index: 2147483647; opacity: ' +
                    lv + ';"></div>');
            }

            liangduui = document.querySelector(".liangduui");
            liangduuitz = document.querySelector(".liangduuitz");
            liangduuitzmouse = document.querySelector(".liangduuitzmouse");
            __nightingale_view_cover = document.querySelector("#__nightingale_view_cover");

            liangduui.style.top = ((window.innerHeight / 2) - (liangduui.style.height.replace("px", "") / 2)) + "px";
            liangduui.style.left = ((window.innerWidth / 2) - (liangduui.style.width.replace("px", "") / 2)) + "px";

            liangduuitzmouse.addEventListener('mousedown', function (event) {
                window.clearTimeout(timer);
                mousemove = true;
                liangduuitz.style.height = (100 - (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop)) + "%"
                lv = (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop) / 100;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv
            });

            liangduuitzmouse.addEventListener('mousemove', function (event) {
                if (!mousemove) return;
                if (liangduuitz.offsetTop <= 0 || liangduuitz.offsetTop > 100) return;
                liangduuitz.style.height = (100 - (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop)) + "%"
                lv = (event.clientY - liangduui.offsetTop - liangduuitzmouse.offsetTop) / 100;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv
            });

            liangduuitzmouse.addEventListener('mouseup', function (event) {
                mousemove = false;
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            });

            liangduuitzmouse.addEventListener('mousewheel', function (event) {
                mousemove = false;
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            });
        }

        if (GM_getValue("lv") == undefined) {
            GM_setValue("lv", '0.35');
        }

        document.addEventListener('keydown', function (event) {
            if (event.altKey && event.which == 40) {
                var lv = parseFloat(GM_getValue("lv"));
                lv += 0.02;
                if (lv > 1.0) lv = 1.0;
                GM_setValue('lv', lv);
                __nightingale_view_cover.style.opacity = lv;
                liangduui.style.display = "block";
                liangduuitz.style.height = (100 - (lv * 100)) + "%";
                window.clearTimeout(timer);
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            } else if (event.altKey && event.which == 38) {
                var lv = parseFloat(GM_getValue("lv"));
                lv -= 0.02;
                if (lv < 0) lv = 0;
                GM_setValue("lv", lv);
                __nightingale_view_cover.style.opacity = lv;
                liangduui.style.display = "block";
                liangduuitz.style.height = (100 - (lv * 100)) + "%";
                window.clearTimeout(timer);
                timer = setTimeout(function () {
                    liangduui.style.display = "none";
                }, 2000);
            } else if (event.ctrlKey && event.altKey && event.which == 83) {
                liangduuitz.style.height = (100 - (GM_getValue("lv") * 100)) + "%"
                liangduui.style.display = "block";
            } else if (event.shiftKey) {
                shift_downorup = true;
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.shiftKey) {
                shift_downorup = false;
            }
        });

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState == 'hidden') { //状态判断

            } else {
                var lv = parseFloat(GM_getValue("lv"));
                if (document.querySelector("#__nightingale_view_cover") == null) {
                    insertHTML(GM_getValue("lv"));
                }
                GM_setValue("lv", lv);
                document.querySelector("#__nightingale_view_cover").style.opacity = lv
            }
        });

        document.body.addEventListener('click', function () {
            liangduui.style.display = "none";
            mousemove = false;
        });

        // window.addEventListener("storage", function(event) {
        //     console.log(event.key + '=' +event.newValue);
        // });

        setTimeout(insertHTML(GM_getValue("lv")), 300);
    }

    // Your code here...
})();