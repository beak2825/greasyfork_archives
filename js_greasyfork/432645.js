// ==UserScript==
// @name         jAccount 验证码在线 ResNet 高速高精度毫秒级识别
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  基于在线的 ResNet 神经网络实现，毫秒级高速高精度识别 jAccount 登录中的验证码
// @author       danyang685
// @match        https://jaccount.sjtu.edu.cn/jaccount/jalogin*
// @icon         data:image/png;base64,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
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @connect      geek.sjtu.edu.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432645/jAccount%20%E9%AA%8C%E8%AF%81%E7%A0%81%E5%9C%A8%E7%BA%BF%20ResNet%20%E9%AB%98%E9%80%9F%E9%AB%98%E7%B2%BE%E5%BA%A6%E6%AF%AB%E7%A7%92%E7%BA%A7%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/432645/jAccount%20%E9%AA%8C%E8%AF%81%E7%A0%81%E5%9C%A8%E7%BA%BF%20ResNet%20%E9%AB%98%E9%80%9F%E9%AB%98%E7%B2%BE%E5%BA%A6%E6%AF%AB%E7%A7%92%E7%BA%A7%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const captcha_input_selector = "#input-login-captcha";
    const captcha_image_selector = "#captcha-img";
    const captcha_solver_url = "https://geek.sjtu.edu.cn/captcha-solver/";
    $(document).ready(function () {
        if (!$(captcha_image_selector).length) {
            return; // 没有验证码时退出
        }
        $("#captcha-box").stop();
        $("#captcha-box").attr("style", "overflow: hidden;");
        $("#operate-buttons").show();

        let raw_placeholder = $(captcha_input_selector).attr("placeholder");
        $("body").append($('<canvas width="110" height="40" style="display: none;" id="captcha-canvas"></canvas>'));
        let img_elem = $(captcha_image_selector)[0];
        let canvas_elem = document.getElementById("captcha-canvas");
        let recognize = function () {
            canvas_elem.getContext("2d").drawImage(img_elem, 0, 0);
            let dataURL = canvas_elem.toDataURL("image/jpeg");
            fetch(dataURL).then(function (response) {
                response.arrayBuffer().then(function (arrayBuffer) {
                    let formData = new FormData();
                    formData.append('image', new File([arrayBuffer], 'captcha.jpg'));
                    GM.xmlHttpRequest({
                        url: captcha_solver_url,
                        method: "POST",
                        data: formData,
                        onload: function (response) {
                            let captcha_text;
                            try {
                                captcha_text = JSON.parse(response.responseText)["result"];
                            } catch (e) {
                                $(captcha_input_selector).attr("placeholder", "识别服务异常");
                                return;
                            }
                            $(captcha_input_selector).attr("value", captcha_text);
                            $(captcha_input_selector).attr("spellcheck", "false");
                            $(captcha_input_selector).attr("placeholder", raw_placeholder);
                            $("#login-form").show();
                        }
                    });
                });
            });
        };
        const do_recognize = function () {
            $(captcha_image_selector).hide();
            $(captcha_input_selector).attr("placeholder", "正在加载验证码");
            $(captcha_input_selector).attr("value", "");
            $(captcha_input_selector).focus();
            let hue = Math.random();
            let saturation = Math.random() + 0.5;
            $(captcha_image_selector).css("filter", `hue-rotate(${hue}turn) saturate(${saturation}) blur(0.5px)`);
            let img_complete_check = setInterval(function () {
                if ($(captcha_image_selector)[0].complete) {
                    clearInterval(img_complete_check);
                    $(captcha_input_selector).attr("placeholder", "正在识别");
                    $(captcha_image_selector).show();
                    recognize();
                }
            }, 1);
        }
        do_recognize(); // 打开后执行一次
        //$(captcha_image_selector).on("click", do_recognize); // 刷新验证码后再执行一次

        if (typeof refreshCaptcha == "function") {
            let refreshCaptcha0 = refreshCaptcha;
            refreshCaptcha = function () {
                refreshCaptcha0();
                do_recognize(); // 刷新验证码后再执行一次
            }
        }
    }());
})();