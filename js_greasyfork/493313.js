// ==UserScript==
// @name         B站自动修仙
// @namespace    https://support.apple.com/zh-cn/safari
// @version      1.5
// @description  在B站直播间里自动修仙
// @author       真理部部长
// @run-at       document-idle
// @include      /:\/\/live.bilibili.com(\/blanc)?\/\d+/
// @icon         http://bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493313/B%E7%AB%99%E8%87%AA%E5%8A%A8%E4%BF%AE%E4%BB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/493313/B%E7%AB%99%E8%87%AA%E5%8A%A8%E4%BF%AE%E4%BB%99.meta.js
// ==/UserScript==

var str = window.prompt("请输入循环的命令,多个命令以空格分割","修仙 突破");
if (str != null && str != ""){
    var strList = str.split(' ')
    var interval = window.prompt("请输入循环的命令（以秒为单位，最低为60秒）：",302);
		var count = 0
    var Max = strList.length
  	if (interval < 60){
      interval = 60
    }
    var timer = setInterval(() => {
        var dom = document.querySelectorAll("textarea.chat-input.border-box")[0];
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: 'insertText',
            dataTransfer: null,
            isComposing: false
        });
        dom.value = strList[count];
        dom.dispatchEvent(evt);
        setTimeout(() => {
            document.querySelectorAll("button.bl-button.live-skin-button-text")[0].click();
        }, 100);
				count++;
      	if(count >= Max){
          count = 0;
        }
    }, 1000*interval);
}