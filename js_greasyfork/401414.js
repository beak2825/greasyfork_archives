// ==UserScript==
// @name         钓鱼笔记筛选按钮
// @namespace    http://your.homepage/
// @version      Beta v1.2
// @description  在输入框输入百分比，点击筛选百分比以下的窗口期的鱼
// @author       凛岚@幻影群岛
// @match        http://fish.senriakane.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401414/%E9%92%93%E9%B1%BC%E7%AC%94%E8%AE%B0%E7%AD%9B%E9%80%89%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/401414/%E9%92%93%E9%B1%BC%E7%AC%94%E8%AE%B0%E7%AD%9B%E9%80%89%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
// @require      https://code.jquery.com/jquery-3.2.1.min.js
//网站自带jquery

function screen(per) {
    let count = 0;
    let fishlist = document.getElementsByClassName("fish-entry");
    for (let i = 0; i < fishlist.length; i++) {
        fishlist[i].style.display = '';
        if (fishlist[i].getAttribute("class").indexOf("fish-intuition-row") != -1) {//小标签
            if (predel) {
                fishlist[i].style.display = 'none';
                count++;
            }
        }
        else {
            let num = fishlist[i].getElementsByClassName("fish-availability-uptime");
            if (num.length == 0 || parseFloat(num[0].innerHTML) > parseFloat(per)) {//大标签检查
                fishlist[i].style.display = 'none';
                predel = 1;
                count++;
            }
            else {
                predel = 0;
            }
        }
    }
    return count;
};

function reshow() {
    let fishlist = document.getElementsByClassName("fish-entry");
    for (let i = 0; i < fishlist.length; i++) {
        fishlist[i].style.display = '';
    }
};

$(document).ready(function () {
    let boddy = document.getElementsByTagName("body")[0];
    boddy.innerHTML = boddy.innerHTML +
        '<div id="dg" style="z-index: 9999; position: fixed ! important; right: 0px; bottom: 0px;width: 40px">' +
        '<div hidden id="srndiv" style="background:#000;color:#fff;">' +
        '<input id="per" placeholder="%" style="color:#000;" inputοnkeyup="value=value.replace(/[^\0-9\.]/g,"")"οnpaste="value=value.replace(/[^\0-9\.]/g,"")" oncontextmenu ="value=value.replace(/[^\0-9\.]/g,"")"></input>' +
        '<button id="yesbtn" style="background:#fff;color:#000;">确定</button>' +
        '<button id="rebtn" style="background:#fff;color:#000;">复原</button>' +
        '</div>' +
        '<button id="showbtn" class="ui button" style="margin-bottom:8px;">' +
        '筛选' +
        '</button>' +
        '</div>';
    $("#showbtn").click(function(){
        $("#srndiv").toggle();
    });
    $("#yesbtn").click(function(){
        let per = 0.0;
        try {
            per = parseFloat(document.getElementById('per').value);
        } catch (error) {
            return 0;
        }
        screen(per);
    });
    $("#rebtn").click(function(){
        reshow();
    });
}

);
