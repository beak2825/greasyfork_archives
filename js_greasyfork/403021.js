// ==UserScript==
// @name         洛谷首页添加用户名搜索
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在洛谷的首页添加用户名搜索功能
// @author       引领天下
// @match        https://www.luogu.org/
// @match        https://www.luogu.com.cn
// @match        http://www.luogu.org/
// @match        http://www.luogu.com.cn
// @match        https://www.luogu.org
// @match        https://www.luogu.com.cn
// @match        http://www.luogu.org
// @match        http://www.luogu.com.cn
// @match        https://www.luogu.org/#feed
// @match        https://www.luogu.com.cn/#feed
// @match        http://www.luogu.org/#feed
// @match        http://www.luogu.com.cn/#feed
// @match        https://www.luogu.org/#feed/
// @match        https://www.luogu.com.cn/#feed/
// @match        http://www.luogu.org/#feed/
// @match        http://www.luogu.com.cn/#feed/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403021/%E6%B4%9B%E8%B0%B7%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%94%A8%E6%88%B7%E5%90%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/403021/%E6%B4%9B%E8%B0%B7%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E7%94%A8%E6%88%B7%E5%90%8D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tar=document.getElementsByClassName("lg-index-content")[0].getElementsByClassName("lg-article lg-index-stat")[0].parentNode;
    var ele="<div class='am-u-md-3'><div class='lg-article lg-index-stat'><h2>用户名搜索</h2><div class='am-input-group am-input-group-primary am-input-group-sm'><input type='text' class='am-form-field' placeholder='输入要搜索的用户名' id='usernamesearchbox'></div><p><button class='am-btn am-btn-danger am-btn-sm' id='usernamesearch'>进入用户主页</button></p></div></div>";
    $(tar).after(ele);
    document.getElementsByClassName("lg-index-content")[0].getElementsByClassName("am-u-md-9")[0].setAttribute("class","am-u-md-6");
    function searchname(){
        var username=document.getElementById("usernamesearchbox").value;
        $.get("https://www.luogu.com.cn/api/user/search?keyword=" + username,
                function (data) {
                    var arr = eval(data);
                    if (arr["users"][0]==null){
                        show_alert("提示","找不到用户");
                        return;
                    }
                    var tarid = arr["users"][0].uid;
                    location.href="https://www.luogu.com.cn/user/"+tarid;
                }
             );
    }
    document.getElementById("usernamesearch").onclick=function(){
        searchname();
    };
    $(document.getElementById("usernamesearchbox")).keydown(function (e) {
        if (e.keyCode==13){
            searchname();
        }
    });
    $('#container').highcharts().reflow();
    $('#container2').highcharts().reflow();
})();