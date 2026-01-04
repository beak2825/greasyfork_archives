// ==UserScript==
// @name         双拼练习去弹框
// @version      0.1
// @description  去掉每次刷新后出现的10秒弹窗
// @author       NoOne
// @match        http://typing.sjz.io/
// @grant GM.getValue
// @grant GM.setValue
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @namespace https://greasyfork.org/users/11075
// @downloadURL https://update.greasyfork.org/scripts/381458/%E5%8F%8C%E6%8B%BC%E7%BB%83%E4%B9%A0%E5%8E%BB%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/381458/%E5%8F%8C%E6%8B%BC%E7%BB%83%E4%B9%A0%E5%8E%BB%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // GM脚本
    (async ()=>{
        let counter = await GM.getValue('sjz-init', 0);
        console.log('This script has been run ' + counter + ' times.');
        console.log(counter)
        if(counter==0){alert("请支持原网站作者（http://sjz.io/），本弹窗只显示一次。本脚本仅用于学习用途")}
        GM.setValue('sjz-init', ++counter);
    })();
    // 正式代码
    window.onload = function(){
        var target=$(".modal-open").children();
        target[0].remove();
        target[1].remove();
        $(".modal-open").attr("class","");
    }
})();