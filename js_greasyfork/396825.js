// ==UserScript==
// @name         智慧树，二倍速
// @namespace    http://github.com/Xzonn/
// @version      0.9.0
// @description  打开智慧树的新大门
// @author       Xzonn
// @match        https://studyh5.zhihuishu.com/videoStudy.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396825/%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%8C%E4%BA%8C%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/396825/%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%8C%E4%BA%8C%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

let style = `/*.dialog-test {
    display: none;
}*/

.v-modal {
    display: none;
}

.stopAutoButton {
    display: block;
    position: fixed;
    left: 1rem;
    top: 1rem;
    padding: 0.5rem;
    color: #fff;
    background-color: #000;
    font-size: 2rem;
    cursor: pointer;
    z-index: 99999;
}`;

(function ($) {
    $(function () {
        let isAuto = localStorage.getItem("isAuto") == "true" ? true : false;
        $("<style/>").html(style).appendTo($("body"));
        let addDiv = function () {
            if ($(".video-js").length) {
                $("<div/>").text(isAuto ? "关闭自动播放" : "开启自动播放").addClass("stopAutoButton").on("click", function () {
                    isAuto = !isAuto;
                    localStorage.setItem("isAuto", "" + isAuto);
                    $(this).text(isAuto ? "关闭自动播放" : "开启自动播放");
                    if (isAuto) {
                        window.repeatInterval = setInterval(repeat, 100);
                    } else {
                        clearInterval(window.repeatInterval);
                    }
                }).insertBefore($(".video-js"));
            } else {
                setTimeout(addDiv, 100);
            }
        };
        let next = 0;
        addDiv();
        let repeat = function () {
            let rate = $(".speedTab")[0];
            if (rate) {
                rate.setAttribute("rate", "2.0");
                rate.innerText = "X 2.0";
                if ($(".speedBox > span").text() != "X 2.0") {
                    $(rate).click();
                }
            }
            if($("video").prop("ended") && (new Date() - next) > 10000) {
                /* 播放完毕后 10 秒内不重复点击，防止“禁止跳课”提示刷屏 */
                $(".nextButton").click();
                next = new Date();
            } else if ($("video").prop("paused")) {
                $("#playButton").click();
            }
            if (!$(".stopAutoButton").length) {
                addDiv();
            }
        }
        if (isAuto) {
            window.repeatInterval = setInterval(repeat, 100);
        }
    });
})(jQuery);