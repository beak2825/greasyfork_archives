// ==UserScript==
// @name         教务系统辅助
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.js
// @connect      us.nwpu.edu.cn
// @include      *://*.nwpu.edu.cn/eams/*
// @version      0.1.1
// @description  QAQ
// @author       Tastror
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437145/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/437145/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

'use strict';

var nwpuURL = "http://us.nwpu.edu.cn/";
var 我的学业 = '<a onclick="childmenus(165)" mytitle="我的学业" myengtitle="Academic Information" parentid="" parentname="" parentengname="" class="subMenu"><span>我的学业</span></a>';
var 公共服务 = '<a onclick="childmenus(176)" mytitle="公共服务" myengtitle="General Service Centre" parentid="" parentname="" parentengname="" class="subMenu"><span>公共服务</span></a>';
var 选课退课 = '<a href="/eams/stdElectCourse.action" onclick="return bg.Go(this,\'main\')" parentid="165" myengtitle="Courses Choosing and Withdrawal" parentengname="Academic Information" class="subMenu" mytitle="选课退课" parentname="我的学业"><span>选课退课</span></a>';
var 成绩查询 = '<a href="/eams/teach/grade/course/person.action" onclick="return bg.Go(this,\'main\')" parentid="165" myengtitle="Exam Results" parentengname="Academic Information" class="subMenu" mytitle="成绩与成绩单" parentname="我的学业"><span>成绩查询</span></a>'

function Home() {
    $("#tab_title_box_1").append(我的学业);
    $("#tab_title_box_1").append(公共服务);
    $("#tab_title_box_1").append(选课退课);
    $("#tab_title_box_1").append(成绩查询);
}

(
    function() {
        // 首页添加快速跳转栏
        Home();
        // 误刷新跳转
        var currentURL = window.location.href;
        if (currentURL.indexOf("?") !== -1)
            currentURL = currentURL.substring(0, currentURL.indexOf("?"));
        if (currentURL.match("courseTableForStd!courseTable.action")!=null)
            window.location.replace("http://us.nwpu.edu.cn/eams/home!index.action");
        currentURL = window.location.href;
    }
)();