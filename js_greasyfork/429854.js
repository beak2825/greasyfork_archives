// ==UserScript==
// @icon         https://huyaimg.msstatic.com/avatar/1094/b7/1429a763a419403e621a3472214759_180_135.jpg?1461836156?452005
// @name         JS弹幕发射鸡
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  虎牙JS弹幕发射鸡
// @author       饭店的老师
// @match        *://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429854/JS%E5%BC%B9%E5%B9%95%E5%8F%91%E5%B0%84%E9%B8%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/429854/JS%E5%BC%B9%E5%B9%95%E5%8F%91%E5%B0%84%E9%B8%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var counter = 0;

    function b(){
        $("body").append(" <div style='left: 25px;bottom: 15px;color:#fff;background-color:#3e8e41;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;border-radius:6px;font-size: 16px;height: 65px;'><p>JS弹幕发射鸡</p><input type='text' style='margin:0; padding:0px 0px 0px 10px; height: 38px;width: 98px;color:#111;background-color:#fff;border: 1px solid #4CAF50;border-radius:6px 0px 0px 6px; font-size: 16px; float: left; outline:none;' id='js' placeholder='请输入666' value='夺笋' /> <input style='height: 40px;weight:; line-height: 0px; background-color: #4CAF50; border:none; border-radius:0px 6px 6px 0px;color: white;padding: 15px 18px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;cursor: pointer;float: left;box-sizing: border-box;outline:none;' type='button' id='btt' value='发射' /></div>");}
    setTimeout(b, 500);

    function co(){

        counter++;
        if(counter>=4){
            setTimeout(fn, 10000);
            counter = 0;
        }else{
            setTimeout(fn, 500);

        }
    }

    function fn() {
        var val = document.getElementById("js").value;
        if(val!=""){
            var input = document.querySelector('#player-full-input-txt');
            input.value = val;
            var btn = document.querySelector('#player-full-input-btn');
            btn.click();
            if(stp==" "){
                setTimeout(co, 100);}
        }else{
            alert("您没有输入任何内容！请输入...");
        }
    }
    var stp = " ";
    $(document).on("click", "#btt",function () {
        $("#btt").attr("disabled",true);//点击后开启'不可点击'
        setTimeout(function(){//设置5秒后关闭'不可点击'
            $("#btt").attr("disabled", false)
        },5000);
        var e = document.getElementById("btt");
        if (e.value == '发射') {
            e.value = '停止';
            stp=" ";
            setTimeout(fn,5000);
        } else {
            e.value = '发射';
            stp=1;
        }

    });

    // Your code here...
})();