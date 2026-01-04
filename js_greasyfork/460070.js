// ==UserScript==
// @name         ssby自动配女
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.com
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460070/ssby%E8%87%AA%E5%8A%A8%E9%85%8D%E5%A5%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/460070/ssby%E8%87%AA%E5%8A%A8%E9%85%8D%E5%A5%B3.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
	'use strict';
	var timer;
    var dzh="hi";//打招呼的内容
	var status = 0; //0-未开始 1-匹配中
    //开始配妹按钮
	$("#btnTabChange1").html($("#btnTabChange1").html() +
		"<div id='ppmz'  style='box-shadow: 0 0 12px 0px #0000003b; touch-action: none;background: white;color: #7E7E7E !important;font-size: 0.7rem;height: 3rem;width: 3rem;border-radius: 100%;text-align: center;padding: .5rem 0px;position: fixed;right: 1rem;bottom: 5rem;z-index: 9999;font-weight: bold;'>开始配妹</div>"
		)
    //高级设置按钮
	$("#btnTabChange1").html($("#btnTabChange1").html() +
		"<div id='gjan'  style=' touch-action: none;font-size: 0.8rem;height: 3rem;width: 3rem;border-radius: 100%;color:#000;text-align: center;padding: .5rem 0px;position: fixed;left:1.5rem;top:-0.5rem;z-index: 9999;'>设置</div>"
		)
    //高级设置弹窗
	$("#btnTabChange1").html($("#btnTabChange1").html() +
		"<div id='gjgn' style='display:none;padding:10px;width: 80%;height: 18rem;color:#000;background-color: #ffffff;position: fixed;z-index: 9999;left: 10%;top: 20vh;border-radius:0.5rem'><h4 align='center' style='margin:0px'>高级设置</h4><div>打招呼内容：<input class='input_ys' id='dzhnr' type='text' ></div><div style='display: flex; justify-content: center; align-items: center; height: 100%; background: rgb(254, 83, 81); color: white; border-radius: 10rem;height:2rem' id='save_set'><span href='#' style='position: inherit; color: white !important;'>保存设置</span></div><div id='close' style='touch-action: pan-y;;top: -0.5rem; position: absolute; right: -0.5rem; background-color: rgb(0, 0, 0); border-radius: 100%; width: 1.5rem; height: 1.5rem; display: flex; justify-content: center; align-items: center;'><i class='van-icon van-icon-cross' style='color: rgb(255, 255, 255); font-size: 1rem;'><!----></i></div></div>"
		);
    $(".input_ys").css({"height":"1rem","width":"60%"});
	var ppmz = $("#ppmz");
	//事件延迟加载，等vue的虚拟dom加载完
setTimeout(function(){
  	$("#close").click(function() {
			$("#gjgn").css("display", "none");
		});
		$("#gjan").click(function() {
			$("#gjgn").css("display", "block");
            $("#dzhnr").val(dzh);

		});
		$("#ppmz").click(function() {
			if (status == 0) {
				$(".chat-control").click();
				ppmz.html("正在匹配");
				status = 1;
				timer = setInterval(pp, 100);
			} else {
				alert("已经在匹配中了，请勿重复点击")
			}
		});
        $("#save_set").click(function() {
               dzh=$("#dzhnr").val();
             $("#gjgn").css("display", "none");
		});
        	//高级设置



},2000);
    function pp() {
		let sex = $("#partnerInfoText").text().slice(5, 7);

		if (sex == "男生") {

            if($(".chat-control").text()!="离开"){
              $(".chat-control").click();

            }else{
              $(".chat-control")[0].click();
              $(".actions-modal-button")[0].click()


            }


		} else if (sex == "女生") {
			ppmz.html("开始配妹");
			//var msgInput = document.getElementById("msgInput");
             var msgInput = document.getElementById("msgInput");
            msgInput .value=dzh;
            msgInput.dispatchEvent(new Event('input'));
            clearInterval(timer);
            var comment=document.getElementsByClassName("msg-send")[0];
            var ev = document.createEvent('MouseEvents');
            ev.initEvent('click', false, true);
            comment.dispatchEvent(ev);

			status = 0;
			clearInterval(timer);
		}
	}




})();