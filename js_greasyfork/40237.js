// ==UserScript==
// @name         acfun评论翻转
// @namespace    http://www.acfun.cn
// @version      0.2
// @description  增加按钮使评论翻转
// @author       星雨漂流
// @match        http://www.acfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40237/acfun%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/40237/acfun%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btnStr = '<div class="icon tool-item" id="flipBtn" style="background:rgba(0,0,0,0.8);margin-top:8px;border-radius:3px; width: 50px; height: 50px;display:flex; align-items: center; justify-content:center;cursor: pointer"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1522804290079" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1481" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M252.76928 299.904l146.2784 0 0 472.42752-146.2784 0 0-472.42752Z" p-id="1482" fill="#ffffff"></path><path d="M477.48096 85.34528l70.87104 0 0 885.80608-70.87104 0 0-885.80608Z" p-id="1483" fill="#ffffff"></path><path d="M629.80096 284.8l31.0016 0 0 502.88128-31.0016 0L629.80096 284.8zM776.42752 284.8l31.0016 0 0 502.88128-31.0016 0L776.42752 284.8zM657.09056 315.8016l0-31.0016 123.04896 0 0 31.0016L657.09056 315.8016zM657.27488 787.64544l0-31.0016 123.04896 0 0 31.0016L657.27488 787.64544z" p-id="1484" fill="#ffffff"></path></svg></div>';
    $("#toolbar").prepend(btnStr);
    $("#toolbar").css({"height": "180px!important"});
    $("#flipBtn").click(function(){
         var editor = $("#editor"),
             text = editor.text();
          var textArr = text.split(""),
             flipArr = textArr.reverse();
         flipArr.push("←");
         var flipText = flipArr.join("");

         $("#editor p").contents().filter(function() { return this.nodeType == 3;  }).remove();
        editor.prepend(flipText);
    });
})();