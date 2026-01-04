// ==UserScript==
// @name         jAccount 验证码 Tesseract.js 识别
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  使用 Tesseract.js 替换 ResNet 以在 Safari 上实现识别 jAccount 登录中的验证码
// @author       danyang685 | Adapted by Milvoid with ChatGPT
// @match        https://jaccount.sjtu.edu.cn/jaccount/jalogin*
// @icon         https://vi.sjtu.edu.cn/img/base/Logo.png
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @connect      localhost
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2
// @downloadURL https://update.greasyfork.org/scripts/488388/jAccount%20%E9%AA%8C%E8%AF%81%E7%A0%81%20Tesseractjs%20%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/488388/jAccount%20%E9%AA%8C%E8%AF%81%E7%A0%81%20Tesseractjs%20%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        if (!$("#captcha-img").length) {
            return; // 没有验证码时退出
        }
        $("#captcha-box").stop();
        $("#captcha-box").attr("style", "overflow: hidden;");
        $("#operate-buttons").show();

        let raw_placeholder = $("#captcha").attr("placeholder");
        $("body").append($('<canvas width="110" height="40" style="display: none;" id="captcha-canvas"></canvas>'));
        let img_elem = document.getElementById("captcha-img");
        let canvas_elem = document.getElementById("captcha-canvas");
        let recognize = function () {
            canvas_elem.getContext("2d").drawImage(img_elem, 0, 0);
            let dataURL = canvas_elem.toDataURL("image/jpeg");
            
            // 使用 Tesseract.js 进行识别
            Tesseract.recognize(
              dataURL,
              'eng',
              {
                logger: m => console.log(m)
              }
            ).then(({ data: { text } }) => {
              let captcha_text = text.trim().replace(/\s/g, ''); // 去除所有空格
              if (captcha_text === "" || captcha_text.includes("l")) {
                  $("#captcha-img").click();
                  return;
              }
              $("#captcha").attr("value", captcha_text);
              $("#captcha").attr("placeholder", raw_placeholder);
              $("#login-form").show();
            }).catch(error => {
              console.error('识别失败:', error);
              $("#captcha").attr("placeholder", "识别失败，请手动输入或刷新验证码");
            });
        };
        
        const do_recognize = function () {
            $("#captcha-img").hide();
            $("#captcha").attr("placeholder", "正在加载验证码");
            $("#captcha").attr("value", "");
            let img_complete_check = setInterval(function () {
                if (document.getElementById("captcha-img").complete) {
                    clearInterval(img_complete_check);
                    $("#captcha").attr("placeholder", "正在识别");
                    $("#captcha-img").show();
                    recognize();
                }
            }, 1);
        }
        do_recognize(); // 打开后执行一次
        $("#captcha-img").on("click", do_recognize); // 刷新验证码后再执行一次
    }());
})();

