// ==UserScript==
// @name         学分绩点
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  只适用于重庆三峡学院，看看你的平均学分绩点是多少
// @author       dianli
// @match        http://jwgl.sanxiau.edu.cn/xs_main.aspx?*
// @grant        none
// @require       https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380962/%E5%AD%A6%E5%88%86%E7%BB%A9%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/380962/%E5%AD%A6%E5%88%86%E7%BB%A9%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    window.setTimeout(function() {
        $('.nav .top:nth-last-child(2) .sub li:last-child').click(function(){
            setTimeout(() => {
                $('.tab .location em').append('<a id="searchbtn" style="cursor: pointer; background-color: #98ece4">查看绩点</a>');
                $('#searchbtn').click(function(){
                    let ar1 = $("#iframeautoheight").contents().find("#Datagrid1 tr").slice(1);
                    // 总学分*绩点和
                    var scorepoint = 0;
                    // 学分总和
                    let scores = 0;
                    for (const i of ar1) {
                        if(i.children[4].innerText !== "公选课") {
                            // 学分
                            let score = Number(i.children[6].innerText);
                            // 绩点
                            let point = Number(i.children[7].innerText);
                            scorepoint += score * point;
                            scores += score;
                        }
                    }
                    let aervpoint = scorepoint/scores;
                    let scorepoint2 = Math.floor(scorepoint*100)/100;
                    let aervpoint2 = Math.floor(aervpoint*100)/100;
                    let word = aervpoint > 2 ? "🐂🍺过了!" : "凉凉，大五欢迎您！";
                    alert(word+'总学分绩点：'+ scorepoint2 + ",总学分："+ scores + "，平均学分绩点：" + aervpoint2);
                });
            }, 1000);
          });
   }, 60);
})();