// ==UserScript==
// @name         ucas-course-console-helper 
// @namespace    https://les1ie.com/
// @version      0.2
// @description  去除中国科学院大学课程网站对进入控制台的限制
// @author       Les1ie
// @match        https://course.ucas.ac.cn/portal/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398576/ucas-course-console-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/398576/ucas-course-console-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.oncontextmenu = true // 允许右键
    // 允许通过快捷键进入控制台
    document.onkeydown = document.onkeyup = document.onkeypress = function(event) {
    	var e = event || window.event || arguments.callee.caller.arguments[0];
    	if (e && e.keyCode == 123) {
            e.returnValue = false;
            return (false);
    	}else if((e.ctrlKey)&&(e.shiftKey)&&(e.keyCode==73)){
    		e.returnValue = false;
            return (false);
		}else if((e.ctrlKey)&&(e.keyCode==85)){//追加
			e.returnValue = false;
            return (false);
		}
	}
})();