// ==UserScript==
// @name         Codeforces显示problemSet页面的题目数量统计
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  一款可以显示当前页面的题目数量和已解决题目数量和待解决题目数量的Codeforces插件。
// @author       turgen
// @match        https://codeforces.com/problemset*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @license        GPL
// @downloadURL https://update.greasyfork.org/scripts/470407/Codeforces%E6%98%BE%E7%A4%BAproblemSet%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%A2%98%E7%9B%AE%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/470407/Codeforces%E6%98%BE%E7%A4%BAproblemSet%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%A2%98%E7%9B%AE%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
 window.onload=function(){
   var table = document.querySelector("table.problems");
    if (table) {
        var tbody = table.querySelector("tbody");
        if (tbody) {
            var problemCount = tbody.querySelectorAll("tr").length-1;
            var AcceptedCount= tbody.querySelectorAll("tr.accepted-problem").length;
        }
        var org=table.getElementsByClassName("top")[1]
        if(problemCount>0)org.innerHTML="<strong>题目</strong>"+"<strong>（本页面总共<span style='color: red'>"+problemCount+"</span>道题目,</strong>"+"<strong>已解决<span style='color: green'>"+AcceptedCount+"</span>道,</strong>"+"<strong>剩余<span style='color: red'>"+(problemCount-AcceptedCount)+"</span>道未解决）</strong>"
    }
 }
})();