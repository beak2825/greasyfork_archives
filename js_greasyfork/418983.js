// ==UserScript==
// @name         中国农业大学 官网修改版
// @namespace    Jia.ys
// @version      1.0
// @description  更易于使用的农大官网入口
// @author       Rsmix
// @include      https://cau.edu.cn/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/418983/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%20%E5%AE%98%E7%BD%91%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/418983/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%20%E5%AE%98%E7%BD%91%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function () {
    setTimeout(function(){
        javascript: (function () {
            var foxx = document.getElementsByClassName('indexnav-content clearfix')[0];
            var foot = foxx.children[11];
            foot.children[0].href = atob("aHR0cHM6Ly9naXRodWIuY29tL0ppYVl1blNvbmc=");
            foot.children[0].innerHTML = "快捷入口";
            var HREF = [
                ["网关登录页", "http://10.3.191.8/"],
                ["教务管理系统（学生）", "http://urpjw.cau.edu.cn/login"],
                ["THEOL 在线教育平台", "http://jx.cau.edu.cn/meol/index.do"],
                ["学吧 Studybar", "http://studybar.cau.edu.cn/"],
                ["希冀 Course Grading", "https://course.educg.net/indexcs/simple.jsp?loginErr=0"],
                ["爱思资源平台", "http://is.cau.edu.cn/"],
                ["CAU 爱思PT站", "http://pt.cau.edu.cn/"],
                ["NPU 蒲公英网", "https://npupt.com/index.php"],
                ["TJU 北洋园", "https://www.tjupt.org/"],
                ["正版软件平台", "http://soft.cau.edu.cn/"]
            ]
            var oElentment = document.getElementsByClassName('box')[0].cloneNode();
            for (const i of HREF)
            {
                oElentment.appendChild(document.getElementsByClassName('box')[0].children[6].cloneNode());
                oElentment.children[oElentment.childElementCount-1].appendChild(document.createTextNode(i[0]));
                oElentment.children[oElentment.childElementCount-1].href = i[1];
            }
            foot.appendChild(oElentment);
        })()
    },0);
})();

// @Etc:     Hello my friend, this is my contact information, welcome to advise
// @Blog:    https://www.cnblogs.com/rsmx/
// @GitHub:  https://github.com/JiaYunSong
// @Date:    2020-12-22 08:52