// ==UserScript==
// @name         Shanbay Listen Hint
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  安装后在听力学习界面按下按键5获得提示。
// @author       Yang
// @match        https://www.shanbay.com/listen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373766/Shanbay%20Listen%20Hint.user.js
// @updateURL https://update.greasyfork.org/scripts/373766/Shanbay%20Listen%20Hint.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).keydown(function(event){
	if(event.keyCode == 53){
        var textField = document.activeElement;
        textField.value = textField.getAttribute('data');
        return false;
	}
});
    // Your code here...
})();