// ==UserScript==
// @name         ChatGPT学术版 by 肖博vlog
// @namespace    https://openai.com/
// @version      1.0
// @description  ChatGPT by XiaoBoVlog
// @author       XiaoBoVlog, https://space.bilibili.com/425848841
// @match        *://chat.openai.com/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// @license      免费使用，禁止商用
// @downloadURL https://update.greasyfork.org/scripts/462584/ChatGPT%E5%AD%A6%E6%9C%AF%E7%89%88%20by%20%E8%82%96%E5%8D%9Avlog.user.js
// @updateURL https://update.greasyfork.org/scripts/462584/ChatGPT%E5%AD%A6%E6%9C%AF%E7%89%88%20by%20%E8%82%96%E5%8D%9Avlog.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //
    function creat_buttons()
    {

        var main = document.getElementsByTagName("main")[0]; // 获取第一个标签为“form”的元素
        var absolute_div = main.childNodes[1];
        let stretch_form = document.getElementsByTagName("form")[0]; // 获取所有标签为“form”的元素
        var relative_div = stretch_form.childNodes[0];
        var relative_flex_button_div = relative_div.childNodes[0];
        var relative_flex_text_div = relative_div.childNodes[1];
        var relative_flex_text = relative_flex_text_div.childNodes[0];
        var relative_flex_send_button = relative_flex_text_div.childNodes[1];

        if(relative_flex_button_div!=null)
        {
            // 翻译成英按钮
            var btn_to_english = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_to_english.setAttribute("type", "button");
            btn_to_english.setAttribute("value", "翻译成英");
            btn_to_english.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_to_english.setAttribute("id", "btn_to_english");
            relative_flex_button_div.appendChild(btn_to_english);

            // 英文润色重写按钮
            var btn_polish_english = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_polish_english.setAttribute("type", "button");
            btn_polish_english.setAttribute("value", "英文润色");
            btn_polish_english.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_polish_english.setAttribute("id", "btn_polish_english");
            relative_flex_button_div.appendChild(btn_polish_english);

            // 英文润色重写按钮
            var btn_polish_rewriting_english = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_polish_rewriting_english.setAttribute("type", "button");
            btn_polish_rewriting_english.setAttribute("value", "英文重写");
            btn_polish_rewriting_english.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_polish_rewriting_english.setAttribute("id", "btn_polish_rewriting_english");
            //relative_flex_button_div.appendChild(btn_polish_rewriting_english);

            // 翻译成中按钮
            var btn_to_chinese = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_to_chinese.setAttribute("type", "button");
            btn_to_chinese.setAttribute("value", "翻译成中");
            btn_to_chinese.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_to_chinese.setAttribute("id", "btn_to_chinese");
            relative_flex_button_div.appendChild(btn_to_chinese);

            // 中文润色按钮
            var btn_polish_chinese = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_polish_chinese.setAttribute("type", "button");
            btn_polish_chinese.setAttribute("value", "中文润色");
            btn_polish_chinese.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_polish_chinese.setAttribute("id", "btn_polish_chinese");
            relative_flex_button_div.appendChild(btn_polish_chinese);

            // 相关工作按钮
            var btn_related_work = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_related_work.setAttribute("type", "button");
            btn_related_work.setAttribute("value", "相关工作");
            btn_related_work.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_related_work.setAttribute("id", "btn_related_work");
            relative_flex_button_div.appendChild(btn_related_work);

            // 写作指导按钮
            var btn_writing_tutor = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_writing_tutor.setAttribute("type", "button");
            btn_writing_tutor.setAttribute("value", "写作指导");
            btn_writing_tutor.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_writing_tutor.setAttribute("id", "btn_writing_tutor");
            relative_flex_button_div.appendChild(btn_writing_tutor);


            // 摘要润色按钮
            var btn_abstract = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_abstract.setAttribute("type", "button");
            btn_abstract.setAttribute("value", "摘要润色");
            btn_abstract.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_abstract.setAttribute("id", "btn_abstract");


            // 移除换行按钮
            var btn_remove_line = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_remove_line.setAttribute("type", "button");
            btn_remove_line.setAttribute("value", "移除换行");
            btn_remove_line.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_remove_line.setAttribute("id", "btn_remove_line");
            relative_flex_button_div.appendChild(btn_remove_line);

            // 清空内容按钮
            var btn_clear = document.createElement("input"); //创建一个input对象（提示框按钮）
            btn_clear.setAttribute("type", "button");
            btn_clear.setAttribute("value", "清空内容");
            btn_clear.setAttribute("class", "btn relative btn-neutral border-0 md:border");
            btn_clear.setAttribute("id", "btn_clear");
            relative_flex_button_div.appendChild(btn_clear);

         // 英文翻译
         $("#btn_to_english").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value = "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My content is : " + relative_flex_text.value;
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 英文润色重写
         $("#btn_polish_english").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value ="\"" + relative_flex_text.value + "\". " + "Polish and rewrite the above content to make it more formal, logical, more coherent, and academic paper style.";
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

        // 英文润色重写
         $("#btn_polish_rewriting_english").click(function(){
             if(relative_flex_text!=null)
             {
                 if(relative_flex_text.value!="")
                 {
                     relative_flex_text.value ="\"" + relative_flex_text.value + "\". " + "Polish and rewrite the above content to make it more formal, logical, more coherent, and academic paper style.";
                 }
                 else
                 {
                      relative_flex_text.value = "Polish and rewrite the above content to make it more formal, logical, more coherent, and academic paper style.";
                 }
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 中文翻译
         $("#btn_to_chinese").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value = "I want you to act as an Chinese translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in Chinese. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level Chinese words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My content is \"" + relative_flex_text.value + "\".";
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 中文润色
         $("#btn_polish_chinese").click(function(){
             if(relative_flex_text!=null)
             {
                 if(relative_flex_text.value!="")
                 {
                     relative_flex_text.value ="\"" + relative_flex_text.value + "\". " + "对上述内容进行润色和重写，使其更正式、更有逻辑、更连贯和更学术的论文风格。";
                 }
                 else
                 {
                      relative_flex_text.value = "对上述内容进行润色和重写，使其更正式、更有逻辑、更连贯和更学术的论文风格。";
                 }
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 相关工作
         $("#btn_related_work").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value ="\"" + relative_flex_text.value + "\". " + "Conclude in 60 words as related work.";
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });


          // 英文写作指导
         $("#btn_writing_tutor").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value = "I want you to act as an AI writing tutor. I will provide you with a student who needs help improving their writing and your task is to use artificial intelligence tools, such as natural language processing, to give the student feedback on how they can improve their composition. You should also use your rhetorical knowledge and experience about effective writing techniques in order to suggest ways that the student can better express their thoughts and ideas in written form.";
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 英文摘要润色
         $("#btn_abstract").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value = "I started to write an academic paper, the title is "+"\"" + relative_flex_text.value + "\", now I have finished the abstract part, but I am not sure whether it is suitable, can you help me to read it, and put forward detailed and specific revision suggestions?";
                 relative_flex_send_button.focus();
                 relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 移除换行符
         $("#btn_remove_line").click(function(){
             if(relative_flex_text!=null)
             {
                 var txt = relative_flex_text.value;
                 for (var i = 0; i < txt.length; i++)
                 {
                     if (txt.indexOf('\n')) txt = txt.replace('\n', ' ')
                 }
                 relative_flex_text.value = txt;
                 // 创造事件
                 var event = document.createEvent('HTMLEvents');
                 event.initEvent("input", true, true);
                 event.eventType = 'message';
                 // 调度事件
                 relative_flex_text.dispatchEvent(event);
                 //relative_flex_send_button.focus();
                 //relative_flex_send_button.click();
                 relative_flex_text.focus();
             }
         });

         // 清空文本内容
         $("#btn_clear").click(function(){
             if(relative_flex_text!=null)
             {
                 relative_flex_text.value ="";
                 // 创造事件
                 var event = document.createEvent('HTMLEvents');
                 event.initEvent("input", true, true);
                 event.eventType = 'message';
                 // 调度事件
                 relative_flex_text.dispatchEvent(event);
                 relative_flex_text.focus();
             }
         });

        }
    }


    // 定时检查按钮
    let glt=2000;
    var inq = setInterval(function () {
        var main = document.getElementsByTagName("main")[0]; // 获取第一个标签为“form”的元素
        var absolute_div = main.childNodes[1];
        var stretch_form = document.getElementsByTagName("form")[0]; // 获取第一个标签为“form”的元素
        var relative_div = stretch_form.childNodes[0];
        var relative_flex_button_div = relative_div.childNodes[0];
        var relative_flex_text_div = relative_div.childNodes[1];
        var relative_flex_text = relative_flex_text_div.childNodes[0]; //文本框
        if(relative_flex_button_div.childNodes.length<2)
        {
            //clearInterval(inq);
            creat_buttons();
        }
        // 对话内容节点
        var main_flex1 = main.childNodes[0];
        var react_scroll1_div = main_flex1.childNodes[0];
        var react_scroll2_div = react_scroll1_div.childNodes[0];
        var react_scroll2_flex_div2 = react_scroll2_div.childNodes[0];
        // 对话内容子节点
        var childNodes = react_scroll2_flex_div2.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            const childNode = childNodes[i];
            childNode.onclick = function(){
                // 获取当前节点中的文本
                var txt = childNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerText;
                // 显示到文本框
                relative_flex_text.value = txt;
                // 创造事件
                var event = document.createEvent('HTMLEvents');
                event.initEvent("input", true, true);
                event.eventType = 'message';
                // 调度事件
                relative_flex_text.dispatchEvent(event);
                // 聚焦到文本框
                relative_flex_text.focus();
                // 复制到剪切板
                GM_setClipboard(txt);
            }

        }

    }, glt);



})();