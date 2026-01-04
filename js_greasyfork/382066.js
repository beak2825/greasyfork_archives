// ==UserScript==
// @name         颈椎病治疗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.acfun.cn/*
// @match        http://www.acfun.cn/*
// @match        https://www.bilibili.com/*
// @match        http://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382066/%E9%A2%88%E6%A4%8E%E7%97%85%E6%B2%BB%E7%96%97.user.js
// @updateURL https://update.greasyfork.org/scripts/382066/%E9%A2%88%E6%A4%8E%E7%97%85%E6%B2%BB%E7%96%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        $(".sp7").after('<span id="cure"  style="color:red">治疗颈椎病</span>')
        $('.tr-fix.tit').after('<span id="cure"  style="color:red">治疗颈椎病</span>')
        $("#cure").click(function(){
            var a;
            try{
                a=$("video")[0].style.transform
            } catch(err)
            {
            }
            if(a=='rotate(90deg)'){
                $("video").css("transform","rotate(0deg)");
            }else{
                $("video").css("transform","rotate(90deg)");
            }

        });
    },5000)


})();