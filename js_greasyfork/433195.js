// ==UserScript==
// @name        New script - gxun.edu.cn
// @namespace   Violentmonkey Scriptss
// @match       https://oj.gxun.edu.cn/admin/courseAdmin/assignmentAdmin/plagSourceFile.jsp
// @grant       none
// @version     1.0
// @author      -
// @description 2021/9/29 下午11:40:07
// @downloadURL https://update.greasyfork.org/scripts/433195/New%20script%20-%20gxuneducn.user.js
// @updateURL https://update.greasyfork.org/scripts/433195/New%20script%20-%20gxuneducn.meta.js
// ==/UserScript==



window.setTimeout(function(){
        $('.pre-numbering').css("display","none");  
    },3);