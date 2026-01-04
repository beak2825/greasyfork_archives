// ==UserScript==
// @name         北理乐学美化
// @namespace    cn.edu.bit
// @version      0.1
// @description  优化乐学的显示界面
/*
1. 通过判断是否有文件，来判断是否要隐藏
2. 统一修改各个项目的标题，为了让用户意识到某些项目是隐藏的，所以我们给不显示的周也打上周号以此来提醒用户
3. (准备增加一个还原按钮)
*/
// @author       SH
// @match        http://lexue.bit.edu.cn/course/view.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415353/%E5%8C%97%E7%90%86%E4%B9%90%E5%AD%A6%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/415353/%E5%8C%97%E7%90%86%E4%B9%90%E5%AD%A6%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    var btn=document.createElement("BUTTON");
	document.body.appendChild(btn);
    btn.clientHeight = 100;
    btn.clientWidth = 100;
    btn.innerHTML = "click me";
    */

    function reBuild(){
        // 获取各个标题
        var items = document.getElementsByClassName("section main section-summary clearfix");
        // 用于记录第一个非空的周
        var order = 1;
        for(var i = 0;i < items.length; i++){
            // 修改标题
            items[i].getElementsByTagName("a")[0].innerHTML = "第" + (order++) + "周";
            // 判断是不是为空
            var isEmpty = items[i].getElementsByClassName("section-summary-activities pr-2 mdl-right").length == 0;
            // 设置为隐藏
            if(isEmpty) items[i].style.display = "none";
        }
    }
    window.setTimeout(reBuild(), 1500);

})();