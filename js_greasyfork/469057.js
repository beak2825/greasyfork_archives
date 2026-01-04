// ==UserScript==
// @name         评教脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UJN
// @author       GoCo
// @match        http://gms.ujn.edu.cn/index.html
// @icon         https://www.google.com/s2/favicons?domain=ujn.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469057/%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469057/%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer;
    var flag = false;
    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "judgeBtn"
	button.textContent = "评教开始";
	button.style.width = "60px";
	button.style.height = "30px";
	button.style.align = "center";
    button.style.zIndex = "9999999";

    button.onclick = function (){
        flag = !flag
        if (flag) {
            timer = startInput();
            $("#judgeBtn").text("评教结束")
        } else {
            clearInterval(timer);
            $("#judgeBtn").text("评教开始")
        }
	};

    var x = document.getElementsByClassName('container')[0];
	x.appendChild(button);

    function startInput() {
        return setInterval(function(){
            var item = $("input[id*='teachTask_evaluate_standInputScore']")
            console.log(item)
            if (item.length > 0) {
                item.val(11);
            }
            setTimeout(()=>{
                 $("#teachTask_evaluate_nextStandBtn").click()
            }, 500)
        },2000);
    }
})();