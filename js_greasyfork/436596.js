// ==UserScript==
// @name         河南省国家安全知识竞赛一键答题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  河南省国家安全知识竞赛一键答题,什么垃圾题狗都不答
// @author       磊落不凡
// @match        http://gjaqzsjs.haedu.cn/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @icon         https://www.google.com/s2/favicons?domain=haedu.cn
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/436596/%E6%B2%B3%E5%8D%97%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%AE%89%E5%85%A8%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/436596/%E6%B2%B3%E5%8D%97%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%AE%89%E5%85%A8%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function selectDanxuan(que,tiku){
        var re = /(.*?)、(.*?)\n【(.*?)】(.*?)\n/g
        let ans = ""
        var ress = {
            "A":0,
            "B":1,
            "C":2,
            "D":3,
            "E":4,
            "F":5,
            "G":6,
            "对":0,
            "错":1,
        }
        let hhh = []
        let flag = true
        do{
            ans = re.exec(tiku)
            if(ans&&ans[2]==que){
                for(let e of ans[3]){
                    hhh.push(ress[e])
                }
                flag=false;
            }
        }while(ans&&flag)
        return hhh
    }
    function test1(){
        var titles = document.querySelectorAll(".question_list>.title>.issue")
        var options = document.querySelectorAll(".question_list>.options")
        $.ajax({
            url: "https://a417600121.rth1.me/",
            context: document.body
        }).done(function(res){
            for(let i=0;i<7;i++){
                console.log(titles[i].innerHTML)
                var select_options = selectDanxuan(titles[i].innerHTML,res)
                //console.log(select_options)
                let options_items = options[i].querySelectorAll(".options_item")
                select_options.forEach(e=>{
                    options_items[e].click()
                })
            }
        })
    }

    function test2(){
        var titles = document.querySelectorAll(".question_list>.title>.issue")
        var options = document.querySelectorAll(".question_list>.options")
        $.ajax({
            url: "https://a417600121.rth1.me/",
            context: document.body
        }).done(function(res){
            for(let i=7;i<13;i++){
                console.log(titles[i].innerHTML)
                var select_options = selectDanxuan(titles[i].innerHTML,res)
                //console.log(select_options)
                let options_items = options[i].querySelectorAll(".options_item")
                select_options.forEach(e=>{
                    options_items[e].click()
                })
            }
        })
    }

    function test3(){
        var titles = document.querySelectorAll(".question_list>.title>.issue")
        var options = document.querySelectorAll(".question_list>.options")
        $.ajax({
            url: "https://a417600121.rth1.me/",
            context: document.body
        }).done(function(res){
            for(let i=13;i<20;i++){
                console.log(titles[i].innerHTML)
                var select_options = selectDanxuan(titles[i].innerHTML,res)
                //console.log(select_options)
                let options_items = options[i].querySelectorAll(".options_item")
                select_options.forEach(e=>{
                    options_items[e].click()
                })
            }
        })
    }

    function test4(){
        var titles = document.querySelectorAll(".question_list>.title>.issue")
        var options = document.querySelectorAll(".question_list>.options")
        $.ajax({
            url: "https://a417600121.rth1.me/",
            context: document.body
        }).done(function(res){
            for(let i=0;i<20;i++){
                console.log(titles[i].innerHTML)
                var select_options = selectDanxuan(titles[i].innerHTML,res)
                //console.log(select_options)
                let options_items = options[i].querySelectorAll(".options_item")
                select_options.forEach(e=>{
                    options_items[e].click()
                })
            }
        })
    }
    window.onload = function(){

        var selectBox = document.createElement("div");
        var danxuan_btn = document.createElement("input");
        var duoxuan_btn = document.createElement("input");
        var panduan_btn = document.createElement("input");
        var all_btn = document.createElement("input");
        //
        var btn_style = `padding: 5px 10px;background: #315ADD;color: #fff;cursor: pointer;margin-right:2px;`
        danxuan_btn.type = "button" ;
        danxuan_btn.value = "单选题" ;
        danxuan_btn.style = btn_style
        danxuan_btn.addEventListener("click",test1);

        duoxuan_btn.type = "button" ;
        duoxuan_btn.value = "多选题" ;
        duoxuan_btn.style = btn_style
        duoxuan_btn.addEventListener("click",test2);

        panduan_btn.type = "button" ;
        panduan_btn.value = "判断题" ;
        panduan_btn.style = btn_style
        panduan_btn.addEventListener("click",test3);

        all_btn.type = "button" ;
        all_btn.value = "一键全做（By 磊落不凡）" ;
        all_btn.style = btn_style
        all_btn.addEventListener("click",test4);
        //
        selectBox.style = `position: fixed;left: 0;top: 0;padding: 5px 10px;z-index: 9999999;`
        document.body.appendChild(selectBox);
        //
        selectBox.appendChild(danxuan_btn);
        selectBox.appendChild(duoxuan_btn);
        selectBox.appendChild(panduan_btn);
        selectBox.appendChild(all_btn);
    }
    // Your code here...
})();