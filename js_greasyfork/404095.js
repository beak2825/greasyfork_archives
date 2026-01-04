// ==UserScript==
// @name         mooc自动自评互评，enter键评分一次作业（默认最高）
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  mooc自动评分，enter键评分一次作业（默认最高），自动提交和自动下一份还未写出。本人新手，且此版本为测试版，还请提交前检查一下，发现任何问题，可以评论下联系我。谢谢大家的下载使用
// @author       zhcy2018
// @match        *://www.icourse163.org/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404095/mooc%E8%87%AA%E5%8A%A8%E8%87%AA%E8%AF%84%E4%BA%92%E8%AF%84%EF%BC%8Center%E9%94%AE%E8%AF%84%E5%88%86%E4%B8%80%E6%AC%A1%E4%BD%9C%E4%B8%9A%EF%BC%88%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/404095/mooc%E8%87%AA%E5%8A%A8%E8%87%AA%E8%AF%84%E4%BA%92%E8%AF%84%EF%BC%8Center%E9%94%AE%E8%AF%84%E5%88%86%E4%B8%80%E6%AC%A1%E4%BD%9C%E4%B8%9A%EF%BC%88%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';
$(function(){

$(document).keyup(function(event){
 //   console.log("Key: "+event.keyCode);
    var a;
    var b;
    if(event.keyCode=="13"){
        var len=$(".s .d:last-child input").length;
        for(var i=0; i<len;i++){
    //        console.log(i);
            a=$(".s .d:last-child input").eq(i).val();
            b=$(".s .d:first-child input").eq(i).val();
      //      console.log(a);
      //      console.log(b);
            if(a>b)
                $(".s .d:last-child input").eq(i).attr('checked', 'true');
            else
                $(".s .d:first-child input").eq(i).attr('checked', 'true');
        }
        $(".j-textarea.inputtxt").val("好");

        $(".u-btn.u-btn-default.f-fl.j-submitbtn").css("background","yellow");
      //  $(".u-btn.u-btn-default.f-fl.j-submitbtn")[0].click();
   //     document.getElementsByClassName("u-btn u-btn-default f-fl j-submitbtn")[0].click();
    //    return false;
    }
     //或者
     //console.log("Key: " + event.which);
 });

      });
})();