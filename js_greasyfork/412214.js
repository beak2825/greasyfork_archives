// ==UserScript==
// @name         安全教育平台自动完成
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  拒绝形式主义，拒绝学校压迫，拒绝老师催债，自动做安全平台作业
// @author       daojun
// @match        https://*.xueanquan.com/jiating//EscapeSkill/SeeVideo.aspx*
// @match        http://*.xueanquan.com/jiating//EscapeSkill/SeeVideo.aspx*
// @match        https://*.xueanquan.com/JiaTing/EscapeSkill/SeeVideo.aspx*
// @match        http://*.xueanquan.com/JiaTing/EscapeSkill/SeeVideo.aspx*
// @match        https://*.huodong.xueanquan.com/*.html*
//@match         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412214/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/412214/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var box = document.getElementById("jcjn");
    // box.innerHTML = "<div id=\"zuobi\" style=\"font-size: 40px;color:#ff0000\">点击开始自动完成，跳过答题得到满分</div>";
    var mainbtn=document.createElement("div");
    mainbtn.style="opacity: 0.95;user-select: none;transition: all 0.3s;position: fixed;left: 25px;top: 25px;border: none;font-size: 20px;padding: 15px 35px;display: block;z-index: 99999999999;border-radius: 25px;color: #fff;background: #5e72e4;box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);cursor: pointer;";
    mainbtn.id="zuobi";
    mainbtn.innerText="自动做作业";
    box.appendChild(mainbtn);
    var hovercss=document.createElement("style");
    hovercss.innerHTML="#zuobi:hover{transform: scale(1.05);}"
    box.appendChild(hovercss);
    mainbtn=document.getElementById("zuobi");
    mainbtn.addEventListener("click", function(){
        mainbtn.innerText="作业中";
        ShowTestPaper();
        var x=document.getElementsByClassName("hdtcbg03")[0].getElementsByTagName("input");
        for(var i= 0;i<x.length;i++){
            x[i].setAttribute("value","1");
            x[i].click();
        }
        mainbtn.innerText="作业已自动完成 !";
        var disabledcss=document.createElement("style");
        disabledcss.innerHTML="#zuobi{background:#999 !important;pointer-events: none !important;cursor: default !important;}#zuobi:hover{transform: scale(1) !important;}"
        box.appendChild(disabledcss);
    });
})();