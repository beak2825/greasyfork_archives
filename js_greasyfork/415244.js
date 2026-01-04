// ==UserScript==
// @name        自动识别同济验证码
// @namespace   Violentmonkey Scripts
// @match       https://ids.tongji.edu.cn:8443/nidp/*
// @grant       GM.xmlHttpRequest
// @version     1.2
// @author      melonedo
// @description 11/1/2020, 7:14:05 PM
// @downloadURL https://update.greasyfork.org/scripts/415244/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%90%8C%E6%B5%8E%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/415244/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%90%8C%E6%B5%8E%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==
captcha_elem = document.forms.IDPLogin.Txtidcode;
captcha_image = document.forms.IDPLogin.codeImg;
captcha_image.onload = () => {
  GM.xmlHttpRequest({
    method: "POST",
    url: "http://172.81.215.215/pi/crack",
    data: JSON.stringify({ data_url: captcha_image.src }),
    onload: (resp) => {
      captcha_elem.value = JSON.parse(resp.responseText).ans;
    },
  });
};