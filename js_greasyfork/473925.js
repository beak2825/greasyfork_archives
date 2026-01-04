// ==UserScript==
// @name        dy验证码
// @namespace   Violentmonkey Scripts
// @match       https://oa1.scdykj.com:883/*
// @grant       none
// @version     1.1
// @author      -
// @license MIT
// @description 2023/8/25 下午10:57:01
// @downloadURL https://update.greasyfork.org/scripts/473925/dy%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/473925/dy%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==


// 监听Ajax请求
var originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (data) {
    var selfs = this;

    // 在请求完成后拦截响应
    selfs.addEventListener('load', function () {
        if (selfs.responseURL.includes("auth/captcha")) {
            // 获取响应结果
            const responseText = selfs.responseText;

            var jsonData = JSON.parse(responseText)
            var img = jsonData['data'].replace("data:image/jpg;base64,", "")
            img = img.replace("data:image/jpeg;base64,", "")

            $.ajax({
                url: "https://upload.chaojiying.net/Upload/Processing.php",
                type: "POST",
                dataType: "json",
                data: {
                    "user": "younggg",
                    "pass": "123456",
                    "softid": 951997,
                    "codetype": 1004,
                    "file_base64": img
                },
                success: function (data) {

                  let inputElement = document.getElementById('captcha');
                  inputElement.value = data.pic_str;
                  // 触发输入事件
                  inputElement.dispatchEvent(new Event('input'));

                  $(".login-btn").click()

                  setTimeout(()=>{
                    location.href = 'https://oa1.scdykj.com:883/eoffice/client/web/diary/mine'
                  },2000)

                }
            })
        }
    });
    originalSend.call(this, data);
}
