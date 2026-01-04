// ==UserScript==
// @namespace         https://greasyfork.org/users/443103
// @name              HFUT Captcha Filler
// @name:en           HFUT Captcha Filler
// @name:zh           合工大信息门户验证码自动填充
// @name:zh-CN        合工大信息门户验证码自动填充
// @description       自动填充合肥工业大学信息门户的登录验证码，调用百度云通用文字识别接口，不保证准确度。
// @description:en    Automatically fill the captcha on my.hfut.edu.cn, using baiduyun api.
// @description:zh    自动填充合肥工业大学信息门户的登录验证码，调用百度云通用文字识别接口，不保证准确度。
// @description:zh-CN 自动填充合肥工业大学信息门户的登录验证码，调用百度云通用文字识别接口，不保证准确度。
// @include           *://my.hfut.edu.cn/*
// @version           1.0.3
// @author            Zijun Yu
// @grant             GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396516/HFUT%20Captcha%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/396516/HFUT%20Captcha%20Filler.meta.js
// ==/UserScript==

// 百度云已关闭通用文字识别api

"use strict";
setTimeout(function () {
  var api = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=24.a227a80dd03bacb2059c50d1021d6cf7.2592000.1583841714.282335-18426133';
  var imgElement = document.getElementById('captchaImg');
  var canvasElement = document.createElement('canvas');
  canvasElement.height = 100;
  canvasElement.width = 230;
  canvasElement.getContext('2d').drawImage(imgElement, 0, 0);
  var base64 = canvasElement.toDataURL().split(',')[1];
  GM_xmlhttpRequest({
    method: 'POST',
    url: api,
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    data: 'image=' + encodeURIComponent(base64),
    onload: function (res) {
      var response = JSON.parse(res.response);
      document.getElementById('code').value = response.words_result[0].words;
    }
  });
}, 1000);