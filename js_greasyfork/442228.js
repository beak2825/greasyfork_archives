// ==UserScript==
// @name         PageEditor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  33333333333333333333333333333333333333
// @author       You
// @match        https://vercel-typecho-sand.vercel.app/countdown.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhanqun.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442228/PageEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/442228/PageEditor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copy_code(message) {
        var input = document.createElement("input");
        input.value = message;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length-43), document.execCommand('Copy');
        document.body.removeChild(input);
        alert("复制成功！");
    }
    // Your code here...
    document.body.contentEditable = true;

    var button = document.createElement("button");
    button.textContent = "复制代码";
    button.onclick = function (){
		copy_code(document.body.innerHTML);
		return;
	};
    document.body.appendChild(button);

    var button2 = document.createElement("button");
    button2.textContent = "换背景图片";
    button2.onclick = function (){
		var url = prompt('請輸入图片地址');
        document.getElementById("image_box").style.backgroundImage="url('"+url+"')";
		return;
	};
    document.body.appendChild(button2);

})();