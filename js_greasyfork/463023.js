// ==UserScript==
// @name         环球资讯广播上下篇修复
// @namespace    
// @version      0.1.1
// @description  将环球资讯广播中album-control替换为void以修复链接不显示问题
// @author       You
// @match        https://newsradio.cri.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cri.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463023/%E7%8E%AF%E7%90%83%E8%B5%84%E8%AE%AF%E5%B9%BF%E6%92%AD%E4%B8%8A%E4%B8%8B%E7%AF%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/463023/%E7%8E%AF%E7%90%83%E8%B5%84%E8%AE%AF%E5%B9%BF%E6%92%AD%E4%B8%8A%E4%B8%8B%E7%AF%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
// @include newsradio.cri.cn
// @license GNU GPLv3

(function() {
    'use strict';
    var Temp110 = document.getElementsByClassName("album-control");
    var Temp111 = document.getElementsByClassName("edui-upload-video");
    Temp110[0].className = "void";
    Temp111[0].className = "void";
    var Temp112 = document.getElementsByClassName("void");
    Temp112[0].src = Temp112[0].src.replace("http://huayuncpv.meldingcloud.com", "http://vcrires.cri.cn/01dcri");
    Temp112[0]._url = Temp112[0]._url.replace("http://huayuncpv.meldingcloud.com", "http://vcrires.cri.cn/01dcri");
    // Your code here...
})();