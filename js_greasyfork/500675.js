// ==UserScript==
// @name         latex预标注2
// @namespace    http://tampermonkey.net/
// @version      2024-07-29
// @description  try to take over the world!
// @author       ErikPan
// @match        https://label.vegas.100tal.com/other-mark/low-code-template/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100tal.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500675/latex%E9%A2%84%E6%A0%87%E6%B3%A82.user.js
// @updateURL https://update.greasyfork.org/scripts/500675/latex%E9%A2%84%E6%A0%87%E6%B3%A82.meta.js
// ==/UserScript==

var replacements_extra = {
    "{}":"",
    "{i}":"i",
    "\\underline":"\\underline{}"
};

var replacements_add = {
    "^\\circ":"^{\\circ}",
    "^\\prime":"^{\\prime}",
};

var replacements_h5={
    "&lt;":"<",
    "&nbsp;":" ",
    "&gt;":">",
    "~":" ",
};

var replacements_standard={
    "°":"^{\\circ}",
    "△":"\\triangle",
    "∠":"\\angle",
    "//":"\\parallel"
};


(function() {
    'use strict';
    setTimeout(()=>{

        function replaceChinesePunctuation(text) {
            // 定义匹配包含在 "$$" 中的文字对的正则表达式
            const regex = /\$\$([^$]+)\$\$/g;
            let matches = [];
            let match;

            // 使用正则表达式查找所有匹配项
            while (match = regex.exec(text)) {
                matches.push(match[1]); // 将匹配到的文字对存入数组
            }

            // 替换中文符号为英文符号
            function replacePunctuation(str) {
                return str.replace(/，/g, ',')
                          .replace(/。/g, '.')
                          .replace(/（/g, '(')
                          .replace(/）/g, ')')
                          .replace(/＞/g,">")
                          .replace(/＜/g,"<")
                          .replace(/－/g,"-")
                          .replace(/＋/g,"+")
                          .replace(/＝/g,"=")
                          ;
            }

            let replacedMatches = matches.map(replacePunctuation);

            // 将修改后的字符串插回原来的文本中
            let replacedText = text;
            for (let i = 0; i < matches.length; i++) {
                let original = `$$${matches[i]}$$`;
                let replaced = `$$$${replacedMatches[i]}$$$`;
                replacedText = replacedText.replace(original, replaced);
            }

            return replacedText;
        }

        function exe_replacesingle(text) {
            // 定义匹配包含在 "$$" 中的文字对的正则表达式
            const regex = /\$\$(-?[a-zA-Z0-9]+)\$\$/g;
            let matches = [];
            let match;

            // 使用正则表达式查找所有匹配项
            while (match = regex.exec(text)) {
                matches.push(match[1]); // 将匹配到的文字对存入数组
            }


            // 将修改后的字符串插回原来的文本中
            let replacedText = text;
            for (let i = 0; i < matches.length; i++) {
                let original = `$$${matches[i]}$$`;
                let replaced = matches[i]
                replacedText = replacedText.replace(original, replaced);
            }

            return replacedText;
        }

        function exe_replacement_extra(text){
            let tmp_str
            for (var key in replacements_extra) {
                tmp_str=text.replaceAll(key, replacements_extra[key]);
                if(tmp_str!=text){
                    text=tmp_str
                }
            }
            text= text.replaceAll(/{({[^{}]+})}/g, (match, frac) => {
                console.log(frac);
                // 处理系数的修改
                return frac;
            });

            text= text.replaceAll(/{?{([^{}]+)}_{?([^{}]+)}?}?/g, (match, base, exponent) => {
                // 处理系数的修改
                return `${base}_{${exponent}}`;
            });

            var text2= text.replaceAll(/{(\\frac{[^{}]+}{[^{}]+})}/g, (match, frac) => {
                console.log(frac);
                // 处理系数的修改
                return frac;
            });
            console.log(text2);
            return text2
        }

        function exe_replacement_h5(text){
            let tmp_str
            for (var key in replacements_h5) {
                tmp_str=text.replaceAll(key, replacements_h5[key]);
                if(tmp_str!=text){
                    text=tmp_str
                }
            }

            return text
        }
        
        function exe_replacement_standard(text){
            let tmp_str
            for (var key in replacements_standard) {
                tmp_str=text.replaceAll(key, replacements_standard[key]);
                if(tmp_str!=text){
                    text=tmp_str
                }
            }

            return text
        }

        function exe_replacement_add(text){
            let tmp_str
            for (var key in replacements_add) {
                tmp_str=text.replaceAll(key, replacements_add[key]);
                if(tmp_str!=text){
                    text=tmp_str
                }
            }

            return text
        }

        function simulatePaste(i,text,input_list) {
            var div = input_list[i]

            // Create a new ClipboardEvent
            var pasteEvent = new ClipboardEvent('paste', {
                clipboardData: new DataTransfer(),
                bubbles: true,
                cancelable: true
            });

            // Set the clipboard data
            pasteEvent.clipboardData.setData('text/plain', text);

            // Dispatch the paste event on the div
            div.dispatchEvent(pasteEvent);

            // Manually insert the text (since the default paste handler may not be invoked)
            div.focus();
            document.execCommand('insertText', false, text);
        }

        function replaceExponentiation(expression) {
            return expression.replace(/(?<!_){?{([^{}]+)}\^{?([^{}]+)}?}?/g, (match, base, exponent) => {
                return `${base}^{${exponent}}`;
            });
        }
        function replace_all(){
            console.log("加载")
        var btn_list=document.getElementsByClassName("control-area-switch")
        var input_list=document.getElementsByClassName("ant-input-borderless")
        for(let i = 2; i< btn_list.length; i++) {
            setTimeout(()=>{
                btn_list[i].click()
            },100)
        }
        var content_list
        var is_extra,is_standard,is_h5,is_adjust,is_add,is_else=0
        content_list=document.getElementsByClassName("ignore-math-jax")
         for(let i = btn_list.length-3; i>=0 ; i--) {
             setTimeout(()=>{
            var inputString=content_list[i].innerText.slice(1, -1).replace(/\\\\/g, '\\');

            let beforeOutputRegex = /(.*)【出】/;
            let beforeMatch = inputString.match(beforeOutputRegex);

            // 使用正则表达式提取"【出】"后面的字符串
            let afterOutputRegex = /【入】(.*)/;
            let afterMatch = "【出】"+beforeMatch[1].match(afterOutputRegex)[1];
            let result=afterMatch.slice(0, -2)
            let result_tmp

            //extra
            result_tmp=exe_replacement_extra(result)
            result_tmp=replaceExponentiation(result_tmp)
            if (result!=result_tmp){
                is_extra=1
                result=result_tmp
            }

            //standard
            result_tmp=exe_replacement_standard(result_tmp)
            if (result!=result_tmp){
                is_standard=1
                result=result_tmp
            }

            //h5
            result_tmp=exe_replacement_h5(result)
            if (result!=result_tmp){
                is_h5=1
                result=result_tmp
            }

            //add
            result_tmp=exe_replacement_add(result)
            if (result!=result_tmp){
                is_add=1
                result=result_tmp
            }


            //adjust
            result_tmp=exe_replacesingle(result)
            result_tmp=result_tmp.replace("$$ $$","")
            if (result!=result_tmp){
                is_adjust=1
                result=result_tmp
            }
            //else
            result_tmp=replaceChinesePunctuation(result_tmp)
            if (result!=result_tmp){
                is_else=1
                result=result_tmp
            }

            simulatePaste(i,beforeMatch[1].slice(0, -2)+'\n'+result,input_list)
             },100)


        }
        setTimeout(()=>{
            if (is_extra==1){
                console.log("extra");
                document.getElementsByClassName("ant-checkbox-inner")[3].click()
            }
            if (is_h5==1){
                document.getElementsByClassName("ant-checkbox-inner")[6].click()
            }
            if (is_standard==1){
                document.getElementsByClassName("ant-checkbox-inner")[7].click()
            }
            if (is_adjust==1){
                document.getElementsByClassName("ant-checkbox-inner")[5].click()
            }
            if (is_add==1){
                document.getElementsByClassName("ant-checkbox-inner")[4].click()
            }

            if (is_else==1){
                document.getElementsByClassName("ant-checkbox-inner")[8].click()
            }
        },2000)
        for(let i = 2; i< btn_list.length; i++) {
            setTimeout(()=>{
                btn_list[i].click()
            },100)
          }
        }
        replace_all()

        function replace_all_with_delay(){
             setTimeout(()=>{
                replace_all()
            },3000)
        }
        document.getElementsByClassName("skip-btn")[0].addEventListener("click", replace_all_with_delay, false);
        document.getElementsByClassName("submit-btn")[0].addEventListener("click", replace_all_with_delay, false);
       },3000)



})();

