// ==UserScript==
// @name                可可英语
// @name:zh-CN          可可英语
// @description         替换默认flash播放器
// @author              xiaoyifang
// @include             *://www.kekenet.com/broadcast/*
// @match               *://www.kekenet.com/broadcast/*
// @version             1.0
// @run-at              document-end
// @namespace https://greasyfork.org/users/662810
// @downloadURL https://update.greasyfork.org/scripts/406416/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/406416/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD.meta.js
// ==/UserScript==

(function() {

    'use strict';
  console.log("替换播放器");

    var mp3=document.querySelector("param[name=movie]").value;
    var index=mp3.indexOf("_file=");
    var mp3url=mp3.substring(index+6);

    var a=document.createElement("audio");
    a.setAttribute("controls","");
    a.style="width:100%";
    a.src=mp3url;

    document.querySelector("div.e_title").append(a);
})();