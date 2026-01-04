// ==UserScript==
// @name         BiliBili直播送礼物连击
// @namespace    mscststs
// @version      0.1
// @description  破站送礼物批量按键
// @author       mscststs
// @include      /https?:\/\/live\.bilibili\.com\/\d/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36956/BiliBili%E7%9B%B4%E6%92%AD%E9%80%81%E7%A4%BC%E7%89%A9%E8%BF%9E%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/36956/BiliBili%E7%9B%B4%E6%92%AD%E9%80%81%E7%A4%BC%E7%89%A9%E8%BF%9E%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let delay = 100; //点击延迟

	function res(cli,input){
		cli.click();
		input.val(input.val()-1);
		if(input.val() <= 0){
			$("#helper_auto_clicker button").removeAttr("disabled");
			return;
		}
		setTimeout(()=>{res(cli,input);},delay);
	}
	$("body").on("DOMNodeInserted",".link-popup-ctnr",function(){
		if($(this).find(".helper").length){
			return;//防止递归
		}
		if($(this).find(".gift-sender form").length){
			let pa = $(this).find(".gift-sender form .gift-info");//容器
			let cli = $(this).find(".gift-sender form button > span.txt");//目标按钮
			pa.append(`<div class='helper' id="helper_auto_clicker"><input type="number" value="1" min="0"><button>连击</button></div>
						<style>
						#helper_auto_clicker{
							margin-top:5px;
						}
						</style>
					`);
			$("#helper_auto_clicker button").click(function(){
				let input = $("#helper_auto_clicker input");
				console.log(input.val());
				let one = $(".gift-sender form .p-relative>input");
				console.log(one.val());
				let all = $("div.popup-content-ctnr > div > form > div.gift-info > div.dp-i-block.v-top").text();
				let allnumber = parseInt(all.slice(all.indexOf("还剩")+3));
				if(parseInt(input.val())*parseInt(one.val())>allnumber){
					alert("超出总数，无法连击，已修改可连击数");
					input.val(parseInt(allnumber/one));
				}else if(input.val()<=0){
					alert("连击不得小于0");
					input.val(parseInt(1));
				}else{
					$(this).attr("disabled","disabled");
					res(cli,input);
				}
				return false;
			});
		}

	});
})();