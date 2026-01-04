// ==UserScript==
// @name         提取磁力
// @namespace    http://www.busjav.cam/forum
// @version      0.1
// @description  try to take over the world!
// @author       zfy
// @match        *
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423648/%E6%8F%90%E5%8F%96%E7%A3%81%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/423648/%E6%8F%90%E5%8F%96%E7%A3%81%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 清除数组里面以图片拓展名结尾的
    // 清除数组里面以图片拓展名结尾的
    window.clrURL = function(arr) {
        let result = [];
        let re2 = /\.(png|jpg|gif|jpeg|webp)$/;
        for (let i in arr) {
            if(arr[i].search(re2) == -1) {
                result.push(arr[i])
            }
        }
        return result;
    }
    // 点击按钮，开始收集磁力
    window.divBtnClick = function() {
        if($(".floatWindow").css("visibility") == "hidden") {
            $(".floatWindow").css({"visibility":"visible"});
            let re = /[a-z0-9A-Z\.]{32,40}/g
            let result = $("body").html().match(re)
            let newResult = Array.from(new Set(result)) // 利用ES6的set去重
            let NewNewResult = clrURL(newResult)
            $(".resultNum").html("共有"+NewNewResult.length+"个");
            let tempMagnet = "";
            for(let item of NewNewResult) {
                tempMagnet = tempMagnet +"magnet:?xt=urn:btih:" +item +"\n";
            }
            // --------------------------------------------------------------------收集完毕
            $(".divInput").text(tempMagnet);
            $(".divInput").select();
            document.execCommand('copy');
        }
        else {
            $(".floatWindow").css({"visibility":"hidden"});
        }
    }
    // 隐藏框框
    window.closeWindow = function() {
        $(".floatWindow").css({"visibility":"hidden"});
    }
    // 创建一个按钮
    $("body").append("<button class='divBtn' onclick='divBtnClick()'>点我收集磁力</button>");
    $(".divBtn").css({"background-color":"#00ff5a78", "cursor":"pointer", "border-radius":"50%", "padding":"42px 12px", "font-size":"22px", "outline":"none"});
    $(".divBtn").css({"z-index":"999", "float":"right", "position":"fixed", "right":"10px", "top":"200px", "user-select":"none"});
    // 创建一个输入框
    $("body").append(`
        <div class="floatWindow">
            <button class="closeInput" onclick="closeWindow()">点击关闭</button>
            <h3 class="resultNum"></h3>
            <div><textarea class='divInput'></textarea></div>
        </div>
        `);
    $(".floatWindow").css({"visibility":"hidden", "z-index":"999", "float":"right", "position":"fixed", "right":"500px", "top":"100px", "border":"solid 2px blue", "background-color":"white"});
    $(".closeInput").css({"background-color":"#1b00ff78", "cursor":"pointer", "font-size":"22px", "padding":"5px 12px", "margin":"5px"});
    $(".resultNum").css({"margin":"5px"});
    $(".divInput").css({"width":"450px", "height":"200px", "margin":"5px"});
})();