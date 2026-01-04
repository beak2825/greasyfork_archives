// ==UserScript==
// @name         mooc自动互评，enter键评分
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  mooc自动评分，enter键评分一次作业
// @author       Minke
// @match        *://www.icourse163.org/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419889/mooc%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%EF%BC%8Center%E9%94%AE%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/419889/mooc%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84%EF%BC%8Center%E9%94%AE%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==


(function() {
    'use strict';
$(function(){

$(document).keyup(function(event){
 //   console.log("Key: "+event.keyCode);
    var a;
    var b;
    var c;
    if(event.keyCode=="13"){
        var len=$(".s .d:last-child input").length;
        for(var i=0; i<len;i++){
            a=$(".s .d:last-child input").eq(i).val();
            b=$(".s .d:first-child input").eq(i).val();
            if(a>b)
                $(".s .d:last-child input").eq(i).attr('checked', 'true');
            else
                $(".s .d:first-child input").eq(i).attr('checked', 'true');
        }
        $(".j-textarea.inputtxt").val("好,答滴针不戳");

        $(".u-btn.u-btn-default.f-fl.j-submitbtn").css({"background":"black","font-size":"200%"});
        $('html,body').animate({ scrollTop: document.getElementsByTagName('BODY')[0].scrollHeight}, 2000);
        $(".u-btn.u-btn-default.f-fl.j-submitbtn").click(function(){
        });
    }
    $(".j-gotonext").css({"background":"black","font-size":"300%"});

 });
      });
})();