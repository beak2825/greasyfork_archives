// ==UserScript==
// @name         dazi.kukuw.com自动打字
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  made by lazzman.com
// @author       Lazzman
// @include        http*://dazi.kukuw.com/typing.html*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @icon         http://www.icontuku.com/download/ico/100604
// @require      https://code.jquery.com/jquery-3.3.1.min.js

// @compatible        chrome
// @compatible        firefox
// @compatible        opera 未测试
// @compatible        safari 未测试
// @license     MIT License

/*
Alt+F1    开始模拟输入
Alt+F2    填充下一行
*/

// @downloadURL https://update.greasyfork.org/scripts/377244/dazikukuwcom%E8%87%AA%E5%8A%A8%E6%89%93%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/377244/dazikukuwcom%E8%87%AA%E5%8A%A8%E6%89%93%E5%AD%97.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 这些个未经批准，无法提交代码
    // @require      http://www.jqueryfuns.com/content/js/jquery-1.8.3.min.js
    // @require      https://raw.githubusercontent.com/imingyu/jquery.mloading/master/src/jquery.mloading.js
    // @require      http://view.jqueryfuns.com/%E9%A2%84%E8%A7%88-/2016/6/6/4acd3731999352ee27d3e4fb759f5dcc/src/jquery.toast.js
    // @resource     ui http://view.jqueryfuns.com/%E9%A2%84%E8%A7%88-/2016/6/6/4acd3731999352ee27d3e4fb759f5dcc/src/jquery.toast.css
    // @resource     ui https://raw.githubusercontent.com/imingyu/jquery.mloading/master/src/jquery.mloading.css

    // 两个字符之间的输入延迟ms
    const wordLazy = 200;

    // 进入打字页面的提示信息
    function tip(){
        alert(`ALT+F1开始模拟第一行输入，ALT+F2模拟下一行输入（即除首行外后面行填充按ALT+F2），每次模拟页面会卡住，不是无响应了，放心食用`);
    }

    window.onload=function(){
        tip();
    }

    // js中没有自带的sleep方法，要想休眠要自己定义个方法
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime){
                return;
            }
        }
    }

    // 模拟键盘输入指定字符
    function simulateKeyPress(jq_el,character) {
        console.log("当前模拟输入的字符:"+character+" 对应键盘码:"+character.charCodeAt(0));
        // 模拟键盘事件，网站以事件数统计KPM
        let kd = new KeyboardEvent("keydown", {
            bubbles: true, cancelable: true, keyCode: character.charCodeAt(0), which: character.charCodeAt(0)
        });
        jq_el[0].dispatchEvent(kd);
        const last = jq_el.val();
        jq_el.val(last+character);
        // 有概率发生错误输入并删除
        if(Math.random()<0.1){
            kd = new KeyboardEvent("keydown", {
                bubbles: true, cancelable: true, keyCode: 8, which: 8
            });
            jq_el[0].dispatchEvent(kd);
            jq_el.val(last);
            // 有概率发生错误输入并删除
            kd = new KeyboardEvent("keydown", {
                bubbles: true, cancelable: true, keyCode: character.charCodeAt(0), which: character.charCodeAt(0)
            });
            jq_el[0].dispatchEvent(kd);
            jq_el.val(last+character);
        }
    }

    // 模拟每一行输入(行索引，当前输入行JQuery选择器，当前行文本)
    function processLineTextIn(index,jq_el,text){
        console.log("当前模拟输入行数："+(index+1)+" 模拟文本内容："+text);
        for(let idx = 0; idx < text.length; idx++){
            // 模拟输入
            simulateKeyPress(jq_el,text[idx]);
            // 休眠
            sleep(wordLazy);
        }
    }

    // 所有的内容行数组
    let contentArray = [];
    function loopLazy(){
        // 所有的内容行数组
        $("#content > div").each(function(index){
            contentArray.push($(this));
        });
        let jq_line = contentArray.shift();

        // 当前内容行获取焦点
        jq_line.children("input:last").focus();
        // 处理每一行
        processLineTextIn(0,jq_line.children("input:last"),jq_line.children(".text").text());
    }

    // 开始模拟输入
    function run(){

        loopLazy();
    }

    // 监听键盘快捷键
    document.addEventListener("keydown", function(e) {
        if(e.keyCode == 112) {
            if(e.altKey){
                run();
            }else if(e.ctrlKey){

            }
        }
        if(e.keyCode == 113) {
            if(e.altKey){
                loopLazy();
            }else if(e.ctrlKey){

            }
        }
    });

})();