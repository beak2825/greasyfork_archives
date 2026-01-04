// ==UserScript==
// @name         自动修炼二弟
// @namespace    https://support.apple.com/zh-cn/safari
// @version      0.1
// @description  auto!
// @author       bibi
// @run-at       document-end
// @match        https://live.bilibili.com/32017899
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493711/%E8%87%AA%E5%8A%A8%E4%BF%AE%E7%82%BC%E4%BA%8C%E5%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/493711/%E8%87%AA%E5%8A%A8%E4%BF%AE%E7%82%BC%E4%BA%8C%E5%BC%9F.meta.js
// ==/UserScript==

var str = window.prompt("请输入循环的命令,多个命令以空格分割","修仙 突破");
if (str != null && str != ""){
    var strList = str.split(' ')
    var interval = window.prompt("请输入循环的命令（以秒为单位，最低为5秒）：",302);
		var count = 0
    var Max = strList.length
  	if (interval < 5){
      interval = 5
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