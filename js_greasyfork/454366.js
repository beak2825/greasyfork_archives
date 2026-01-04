// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            GK验证码助手
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          sh
// @description     GK自动输入验证码
// @match           *://*.pt.ouchn.cn/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.2.5
// @grant           GM_addStyle
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @connect         *
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/454366/GK%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454366/GK%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
 var kph = $("#kaptchaImage");
 function getKaptch(){
    //var pwd = $("#password");
    let img = document.getElementById('kaptchaImage')
    let src = img.getAttribute('src')
    var cnv = document.createElement('canvas')
    var cxt = cnv.getContext('2d')
    var imgSrc = document.getElementById('kaptchaImage').src
    const image = new Image()
    image.src = imgSrc
    image.onload = () => {
    cxt.drawImage(image, 0, 0, image.width, image.height)
    var base64 = cnv.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, "");
    setTimeout(function(){
     GM_xmlhttpRequest({
        method: "post",
        url: "http://api.shen668.cn",
        onload: function(r) {
            var res = r.responseText.split("<a href=")[1].split(">")[0]+"";
                 GM_xmlhttpRequest({
                     method: "post",
                     url: res.substring(1,res.length-1),
                     data: "img=" + encodeURIComponent (base64),
                     headers: { "Content-Type": "application/x-www-form-urlencoded" },
                     onload: function(r) {
                         var json = JSON.parse(r.responseText);
                         var doValidate = json.data.raw_out['0']['1'];
                         var validate = JSON.parse(JSON.stringify(doValidate).replace(/\s*/g,""));
                         //填入验证码
                         console.log("当前验证码识别结果为：（"+validate+"）,若识别有误请点击切换验证码图片或刷新页面并自动重新识别！");
                         $("#validateCode").val(validate);
                         // pwd.val("Ouchn@2021");
                     },
                 });
            },
       });
     },888)
   }
  }
 window.onload = function(){
    getKaptch();
 }
 kph.on("click",function(){
    getKaptch();
 });
})();

