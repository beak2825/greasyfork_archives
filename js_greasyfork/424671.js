// ==UserScript==
// @name         提取nyaa磁力
// @namespace    https://sukebei.nyaa.si/
// @icon        https://sukebei.nyaa.si/static/favicon.png
// @version      1.0
// @description  nyaa优化
// @author       zfy
// @match        *://sukebei.nyaa.si/*
// @match        *://nyaa.si/*
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424671/%E6%8F%90%E5%8F%96nyaa%E7%A3%81%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/424671/%E6%8F%90%E5%8F%96nyaa%E7%A3%81%E5%8A%9B.meta.js
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
    $(document).ready(function(){
    	// 刷新数量
    	if(localStorage.getItem("magList")==null)
    		$(".divBtnBody").html("购物车   已有0个");
    	else
    		$(".divBtnBody").html("购物车   已有"+localStorage.getItem("magList").split("\n").length+"个");
    	// 复制单个磁力
        $(".divBtn").click(function(){
            let re = /[a-z0-9A-Z\.]{32,40}/g
            let hash = $(this).parent()[0].outerHTML.match(re)
            let result = "magnet:?xt=urn:btih:"+hash+"\n"
            // 开始复制
            $(".floatWindow").css({"visibility":"visible"});
            $(".divInput").text(result);
            $(".divInput").select();
            document.execCommand('copy');
            $(".floatWindow").css({"visibility":"hidden"});
            console.log("复制成功:"+result);
        })
        // 显示/隐藏购物车
        $(".divBtnBody").click(function(){
            if($(".floatWindow").css("visibility")==="hidden") {
            	$(".floatWindow").css("visibility","visible");
            	let result = ""
				if(localStorage.getItem("magList") !== null)
					result = localStorage.getItem("magList");
            	$(".divInput").text(result);
            	$(".divInput").select();
            	document.execCommand('copy');
            } else {
            	$(".floatWindow").css("visibility","hidden");
            }
        })
        // 清空购物车
        $(".clearShopCar").click(function(){
            window.localStorage.removeItem("magList");
            $(".divBtnBody").html("购物车   已有0个");
            $(".divInput").text("");
            $(".floatWindow").css("visibility","hidden");
        })
        // 添加购物车
        $(".shopCarAdd").click(function(){
        	let re = /[a-z0-9A-Z\.]{32,40}/g
            let hash = $(this).parent()[0].outerHTML.match(re)
            let result = "magnet:?xt=urn:btih:"+hash
			let magnetList = [];
			if(localStorage.getItem("magList") == null) {
			    localStorage.setItem("magList", "");
			}
			else {
			    magnetList = localStorage.getItem("magList").split("\n");
			}
			if(magnetList.indexOf(result) == -1) {
			    magnetList.push(result);
			}
			localStorage.setItem("magList", magnetList.join("\n"));
			// 刷新数量
			$(".divBtnBody").html("购物车   已有"+magnetList.length+"个");
        })
        // 奖励一个功能
        $(".search-bar").click(function(){
            $(".search-bar").select();
        })
    });

    // 创建一个按钮
    $("body").append("<div class='divBtnBody'>购物车   已有0个</div>");
    $(".divBtnBody").css({"background-color":"#00ff5a78", "cursor":"pointer", "border-radius":"50%", "padding":"42px 12px", "font-size":"22px", "outline":"none"});
    $(".divBtnBody").css({"z-index":"999", "float":"right", "position":"fixed", "right":"10px", "top":"200px", "user-select":"none", "width":"118px"});
    // 创建一个按钮
    $("tbody tr").append("<button class='shopCarAdd'>+</button>");
    $(".shopCarAdd").css({"user-select":"none", "cursor":"pointer", "outline":"none", "width":"30px", "height":"30px", "margin-top":"4px"});
    $("tbody tr").append("<button class='divBtn'>复制磁力</button>");
    $(".divBtn").css({"background-color":"#00ff5a78", "cursor":"pointer", "border-radius":"12%", "outline":"none"});
    $(".divBtn").css({"z-index":"999", "user-select":"none", "height": "30px"});
    // 创建一个输入框
    $("body").append(`
        <div class="floatWindow">
            <button class="clearShopCar">点击清空</button>
            <h3 class="resultNum"></h3>
            <div><textarea class='divInput'></textarea></div>
        </div>
        `);
    $(".floatWindow").css({"visibility":"hidden", "z-index":"999", "float":"right", "position":"fixed", "right":"500px", "top":"100px", "border":"solid 2px blue", "background-color":"white"});
    $(".clearShopCar").css({"background-color":"#1b00ff78", "cursor":"pointer", "font-size":"22px", "padding":"5px 12px", "margin":"5px"});
    $(".resultNum").css({"margin":"5px"});
    $(".divInput").css({"width":"450px", "height":"200px", "margin":"5px"});
})();