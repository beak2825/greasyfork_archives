// ==UserScript==
// @name         ctrl + alt + E切换页面可编辑
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  RT
// @author       Pidanmeng
// @match        *
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30052/ctrl%20%2B%20alt%20%2B%20E%E5%88%87%E6%8D%A2%E9%A1%B5%E9%9D%A2%E5%8F%AF%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/30052/ctrl%20%2B%20alt%20%2B%20E%E5%88%87%E6%8D%A2%E9%A1%B5%E9%9D%A2%E5%8F%AF%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function() {
   var flag=0;
    document.body.addEventListener('keydown',function(event){
        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;

        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }
        if(keynum==69&&event.altKey&&event.ctrlKey){ //若想更改快捷键，请用需要的keyCode与keynum变量进行比较。altKey可以改为ctrlKey、shiftKey或metaKey。请务必注意尽量避免快捷键冲突！
            if(!(flag%2)){
                document.body.contentEditable = true;
            }else if(flag%2){
                document.body.contentEditable = false;
            }
            flag++;
        }
    });
   /*
    *  以下代码用于从键盘读取你需要的键的keyCode
    *  去掉注释后，在任意页面运行脚本，按下需要的键，页面会alert出该键的keyCode
    *  将判断条件改成你需要的快捷键
    *  如：
    *  已知z的keyCode为229
    *  则将第25行的判断条件改为  keynum==229 && event.altKey && event.ctrlKey  时，此时的快捷键为  ctrl + alt + z
    */
/******************若想查询keyCode请去除以下注释*********************/
    /*
    document.body.onkeydown=function(event){
    alert(event.keyCode);
    };
    */
/******************若想查询keyCode请去除以上注释*********************/
})();