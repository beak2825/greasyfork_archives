// ==UserScript==
// @name         切屏取消
// @namespace    http://www.myctu.cn/
// @version      3.0
// @description  使用双击 左边150像素以内 开启功能
// @author       fzguolg
// @time         2022/06/16 15:54
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446557/%E5%88%87%E5%B1%8F%E5%8F%96%E6%B6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446557/%E5%88%87%E5%B1%8F%E5%8F%96%E6%B6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*
// @grant        none  取消沙盒运行
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
    var eventNames="blur|mouseleave|mouseout|selectstart|copy|contextmenu|keyup|keydown|keypress|fullscreenchange";

    function dbfunc(){
        var x=event.pageX,
            y=event.pageY;
        if (x<=150){
            var eventA=eventNames.split("|");
            for(var i=0;i<eventA.length;i++){
              eval("window.on"+eventA[i]+"=null");
              eval("document.on"+eventA[i]+"=null");
              eval("document.body.on"+eventA[i]+"=null");
            }
            console.log("x="+x);
            alert("取消成功。。。可能不成功");
        }
    }

    document.ondblclick=dbfunc;
    console.log("启用切屏脚本.双击");
    // Your code here...
})();