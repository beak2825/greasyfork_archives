// ==UserScript==
// @name         NeuExamSys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NeueduExam
// @author       You
// @match        *://172.17.141.31:7003/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=141.31.
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @license      MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/467553/NeuExamSys.user.js
// @updateURL https://update.greasyfork.org/scripts/467553/NeuExamSys.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = $ || window.$;

    // 去除禁止选中和复制
    setTimeout(()=>{
        $("html").css("user-select", "text");
        $("html")[0].addEventListener('selectstart', function(e){
            e.stopPropagation();
        }, true);
        $("html")[0].addEventListener('copy', function(e){
            e.stopPropagation();
        }, true);

        let copyContent = "";
        let domChanged = false;
        if($(".questionContent").length > 0){
            // 题目span
            let question = $(".questionContent").find("div:eq(1)").find("span:eq(1)");
            question.css("cursor", "default");

            // // 监听dom内容改变
            question.on('DOMSubtreeModified', function() {
                if (domChanged) return;
                console.log($(this));
                console.log('DOM内容已改变');
                setTimeout(()=>{
                    $(this).mousedown();
                    $(this).click();
                },1000);
                domChanged = true;
                setTimeout(()=>{
                    domChanged = false;
                }, 1000);
            });

            question.on("mousedown", function(){
                console.log($(this).text());
                copyContent += $(this).text() + "\n";
                // 选项label
                let options = $(".questionContent").find("div:eq(4)").find("label");
                for(let i = 0;i<options.length;i++){
                    console.log(options.eq(i).text());
                    copyContent += options.eq(i).text() + "\n";
                }
                copyToBoard(copyContent);
                localStorage.setItem("projectOne", copyContent);
                // console.log(`GMGetValue0: ${localStorage.getItem("projectOne")}`)
                copyContent = "";
            });
        }
    },3000);

    // 复制到剪贴板
    function copyToBoard (text) {
        try {
            const input = document.createElement('textarea')
            input.value = text
            document.body.appendChild(input)
            input.focus() // focus会滚动页面到input处
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
        } catch (err) {
            alert("浏览器不支持")
        }
    }
})();