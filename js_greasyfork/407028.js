// ==UserScript==
// @name         SpringSunday-Show-All-Level
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       陶陶滔滔涛
// @match        https://springsunday.net/users.php*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407028/SpringSunday-Show-All-Level.user.js
// @updateURL https://update.greasyfork.org/scripts/407028/SpringSunday-Show-All-Level.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('select[name="class"]').append('<option value="20">VIP</option><option value="21">荣誉会员</option><option value="22">养老族</option><option value="26">发布员</option><option value="28">助理员</option><option value="29">总版主</option><option value="30">管理员</option><option value="31">维护开发员</option><option value="32">主管</option>');
    var _class = getUrlParam('class');
    if (_class) {
        $('select[name="class"]').val(_class);
    }

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
})();