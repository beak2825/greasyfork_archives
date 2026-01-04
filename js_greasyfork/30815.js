// ==UserScript==
// @name         SDU Auto Teaching Scoring（山东大学自动评教）
// @namespace    
// @version      0.15
// @description  Auto Teaching Scoring Script
// @author       Bluefissure
// @match        http://bkjws.sdu.edu.cn/f/common/main
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30815/SDU%20Auto%20Teaching%20Scoring%EF%BC%88%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/30815/SDU%20Auto%20Teaching%20Scoring%EF%BC%88%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%89.meta.js
// ==/UserScript==
var style_btn = 'float:right;background:rgba(228,228,228,0.4); cursor:pointer; margin:0px 1px 0px 0px; padding:0px 3px;color:black; border:2px ridge black;border:2px groove black;';
var style_win_top = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;left:5px;top:5px;border:1px solid grey; ';
var style_win_buttom = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;right:5px;bottom:5px;border:1px solid grey;  ';
(function() {
    'use strict';
    // Your code here...
    if(window.location.href=="http://bkjws.sdu.edu.cn/f/common/main"){
        var newDiv = document.createElement("div");
        newDiv.id = "controlWindow";
        newDiv.align = "left";
        document.body.appendChild(newDiv);
        GM_addStyle("#controlWindow{" + style_win_top + " }");
        var table = document.createElement("table");
        newDiv.appendChild(table);
        var th = document.createElement("th");
        th.id = "headTd";
        var thDiv = document.createElement("span");
        thDiv.id = "thDiv";
        thDiv.innerHTML = "Auto Score";
        GM_addStyle("#thDiv{color:red;font-size: 12pt;}");
        th.appendChild(thDiv);
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var td = document.createElement("td");
        td.id = "footTd";
        tr.appendChild(td);
        var close = document.createElement("span");
        close.id = "close";
        close.innerHTML = "关闭脚本";
        close.addEventListener("click", function () {document.body.removeChild(document.getElementById("controlWindow"));}, false);
        td.appendChild(close);
        GM_addStyle("#close{" + style_btn + "}");
        var score = document.createElement("span");
        score.id = "score";
        score.innerHTML = "自动评教";
        score.addEventListener("click", function () {
            console.log("Auto Teaching Scoring.");
            for (var iter=0; iter<=20; iter++){
                var selects = document.getElementsByName("zbda_"+iter.toString());
                for (var i=0; i<selects.length; i++){
                    if (selects[i].value=="10.0"||selects[i].value=="5.0"||selects[i].value=="课程难度适中"||selects[i].value=="推荐") {
                        //selects[i].parentNode.className= "checked";
                        selects[i].click();
                        break;
                    }
                }
                //console.log(selects);
            }
            var comment = document.getElementsByName("zbda_21");
            comment[0].value="满意";
            //console.log(comment);
        });
        td.appendChild(score);
        GM_addStyle("#score{" + style_btn + "}");
    }
})();
