// ==UserScript==
// @name         师学通
// @namespace    http://cn202141047.stu.teacher.com.cn
// @version      0.2
// @description  自动完成学习检测
// @author       星星课
// @match        http://cn202141047.stu.teacher.com.cn/course/intoSelectCourseUrlVideo*
// @match        http://cn202141047.stu.teacher.com.cn/course/intoSelectCourseVideo*
// @icon         https://obohe.com/i/2021/08/18/10kn92x.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431011/%E5%B8%88%E5%AD%A6%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/431011/%E5%B8%88%E5%AD%A6%E9%80%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if ($( "div:contains('验证信息')" ).length>1){
            console.log("检测到学习验证");
            $("#code").attr("value",$("#codespan").text());
            $( "a:contains('提交')")[0].click();
        }},3e3)
})();