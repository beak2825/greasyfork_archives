// ==UserScript==
// @name         Bilibili独轮车
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  dulunche for bilibili live
// @author       You
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/521197/Bilibili%E7%8B%AC%E8%BD%AE%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/521197/Bilibili%E7%8B%AC%E8%BD%AE%E8%BD%A6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    function handleSubmit(){
        var input1 = $('#textbox1').val();
        $(".entry").each(function (index, item){
            $(item).show()
        })
        go_with(input1)
    }


    function repeatUntil20(str) {
        if (str.length === 0) return ""; // 防止空字符串死循环

        let result = str;
        while (result.length <= 30) {
            result += str; // 追加字符串
        }
        return result;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function go_with(keywords) {
        const word_limit = 20; // 目标切片长度
        const template_word = repeatUntil20(keywords); // 重复字符串到足够长
        const keyword_length = keywords.length;

        const textarea = document.querySelector('textarea.chat-input.border-box');

        let loop_time = 0;

        const test_interval = window.setInterval(function () {
            console.log($("button.bl-button.live-skin-highlight-button-bg").click());

            if (loop_time > 5 * keyword_length) {
                // 超出限制，停止循环
                clearInterval(test_interval);
                console.log("循环结束");
                return;
            }

            // 从模板字符串中取切片
            const result = template_word.slice(
                loop_time % keyword_length,
                loop_time % keyword_length + word_limit
            );

            // 更新到文本框中
            textarea.value = result;
            textarea.dispatchEvent(new InputEvent('input'))

            console.log(result); // 打印当前切片
            loop_time += 1;
        }, 2000); // 每 1 秒执行一次
    }

    (function () {
        var $container = $('<div></div>')
        .attr('id', 'fixed-container')
        .css({
            position: 'fixed',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '200px',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textAlign: 'center',
            "z-index": 9999
        });

        var $textbox1 = $('<textarea>')
        .attr('type', 'text')
        .attr('id', 'textbox1')
        .attr('placeholder', 'include keywords, split with ;')
        .css({
            width: '90%',
            margin: '5px 0',
            padding: '5px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '3px'
        });

        var $button = $('<button></button>')
        .attr('id', 'submit-button')
        .text('独轮车，启动!')
        .css({
            width: '95%',
            padding: '5px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
        })
        .hover(
            function () {
                $(this).css('background-color', '#0056b3'); // 鼠标悬停
            },
            function () {
                $(this).css('background-color', '#007bff'); // 鼠标移出
            }
        )
        .click(function () {
            handleSubmit();
        });

        $('#textbox1, #textbox2').on('keydown', function (event) {
            if (event.key === 'Enter') {
                handleSubmit(); // 调用提交处理函数
            }
        });


        // 将文本框和按钮添加到容器中
        $container.append($textbox1).append($button);

        // 将容器添加到页面的 body 中
        $('body').append($container);
    })();


})();
