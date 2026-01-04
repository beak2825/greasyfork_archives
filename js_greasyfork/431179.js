// ==UserScript==
// @name         火狐洛谷测评补丁
// @namespace    https://cwd316.com/
// @version      0.1
// @description  to successfully show judge status
// @author       chenwenda316
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com.cn/record/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        location.reload
// @downloadURL https://update.greasyfork.org/scripts/431179/%E7%81%AB%E7%8B%90%E6%B4%9B%E8%B0%B7%E6%B5%8B%E8%AF%84%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/431179/%E7%81%AB%E7%8B%90%E6%B4%9B%E8%B0%B7%E6%B5%8B%E8%AF%84%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function lis(){
        $("button.lfe-form-sz-middle:nth-child(7)").on("click",function() {
            console.log("ceping");
            setTimeout(check, 2000);
        });
    }
    function init(){
        check();
        console.log($)
        lis();
        $(".operation > button:nth-child(1)").on("click",function() {
            console.log("sub");
            lis();
        });

    }
	function check(){
        console.log("checking....")
        console.log($(".info-rows > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)").text()=="\n        Judging\n      "||$(".info-rows > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)").text()=="\n        Waiting\n      ")
        if($(".info-rows > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)").text()=="\n        Judging\n      "||$(".info-rows > div:nth-child(2) > span:nth-child(2) > span:nth-child(1)").text()=="\n        Waiting\n      "){
            console.log("bad....")
            location.reload();
        }
    }
  setTimeout(init, 500);
})();