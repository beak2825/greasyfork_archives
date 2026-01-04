// ==UserScript==
// @name         网大复制切屏取消
// @namespace    http://www.myctu.cn/
// @version      2.0
// @description  使用ctrl+f1 开启功能
// @author       fzguolg
// @time         2021/12/17 14:41
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434247/%E7%BD%91%E5%A4%A7%E5%A4%8D%E5%88%B6%E5%88%87%E5%B1%8F%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/434247/%E7%BD%91%E5%A4%A7%E5%A4%8D%E5%88%B6%E5%88%87%E5%B1%8F%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hotkey() {
        var a = window.event.keyCode;
        //ctrl+f1
        if ((a == 112) && (event.ctrlKey)) {
                if(confirm('是否开启复制，关闭切屏！！')){

/*
                    //window.onblur = document.onblur = document.body.onblur = onblur = null;

                    //解除切屏限制
                    window.onmouseleave = window.onblur = window.onmouseout = document.onmouseleave = document.onblur = document.onmouseout = document.body.onmouseleave = document.body.onblur = document.body.onmouseout = onmouseleave = onblur = onmouseout = null;

                    //解除选中文本限制（这里html看具体考试页面绑定的限制事件dom而定）
                    window.onselectstart = document.onselectstart = document.body.onselectstart = onselectstart = document.querySelector("html").onselectstart = null;

                    //解除复制粘贴限制
                    window.oncopy = document.oncopy  = document.body.oncopy  = oncopy  = null;

                    //解除右键菜单限制（这里html看具体考试页面绑定的限制事件dom而定）
                    window.oncontextmenu = document.oncontextmenu = document.body.oncontextmenu = oncontextmenu = document.querySelector("html").oncontextmenu = null;

                    //解除快捷键操作屏蔽
                    window.onkeyup = window.onkeydown = window.onKeyPress = document.onkeyup = document.onkeydown = document.onKeyPress = document.body.onkeyup = document.body.onkeydown = document.body.onKeyPress = onkeyup = onkeydown = onKeyPress = null;
*/
                    clearLoop();
                    
                    document.onkeydown = setClipboard; //设置ctrl+c监听
                    console.log('开启复制功能，取消切屏');
                }
        }
    }

    // 清理循环
    function clearLoop() {

        var elements = getElements();
        var eventNames = ["mousedown","mouseup","keydown","keyup","contextmenu","select","selectstart","copy","cut","dragstart","mousemove","mouseleave","paste","blur","beforeunload"]
        
        for(var i in elements) {
          for(var j in eventNames) {
            var name = 'on' + eventNames[j];
 
            if(Object.prototype.toString.call(elements[i])=="[object String]"){
                continue;
            }
            if(elements[i][name] !== null) {
                elements[i][name] = null;
            }
          }
        }
        
        document.onmousedown = function(){return true;};
    }
    
    // 获取所有元素 包括document
    function getElements() {
        var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
        elements.push(document);
 
        // 循环所有 frame 窗口
        var frames = document.querySelectorAll("frame")
        if(frames){
            var frames_element;
            for (let i = 0;i<frames.length;i++){
                frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"))
                elements.push(frames[i].contentWindow.document)
                elements = elements.concat(frames_element);
            }
        }
        return elements;
    };
   
    // 复制到剪贴板
    function setClipboard(){
         var a = window.event.keyCode;
        //ctrl+c
        if ((a == 67) && (event.ctrlKey) ) {
            var text_obj = window.getSelection();
            var text = text_obj.toString();
            GM_setClipboard(text);
        }
    }

    document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数

    console.log("启用网大破解脚本.快捷键 crlt+f1");
    // Your code here...
})();