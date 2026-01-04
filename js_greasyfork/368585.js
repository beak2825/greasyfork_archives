// ==UserScript==
// @name         肥宅快乐抽（动态ver）
// @namespace    https://github.com/G-Cutemon
// @version      1.4
// @description  做肥宅真开心啊！
// @author       Cutemon
// @include      http*://live.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/368585/%E8%82%A5%E5%AE%85%E5%BF%AB%E4%B9%90%E6%8A%BD%EF%BC%88%E5%8A%A8%E6%80%81ver%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/368585/%E8%82%A5%E5%AE%85%E5%BF%AB%E4%B9%90%E6%8A%BD%EF%BC%88%E5%8A%A8%E6%80%81ver%EF%BC%89.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var dynamic_id = "";
	var oid = "";
	var comment_arr = [];
	var transmit_arr = [];
	var roomUid = "";
	var add = "";

	window.onload = function(){
		add = setInterval(addBtn, 1000);
		getUid();
	};

	function getUid(){
		var roomId = window.location.pathname.slice(1);
		$.ajax({
			type: "get",
			url: "//api.live.bilibili.com/room/v1/Room/room_init",
			data: {
				id: roomId
			},
			success: function(response){
				roomUid = response.data.uid;
			}
		});
	}

//	toast功能函数
    function toast(text,level,right,bottom){
        text=text||"这是一个提示";
        level=level||"success";
        right=right||"80px";
        bottom=bottom||"16%";
        if(level!="success"){
            console.log(text);
        }
        var id = (new Date()).valueOf();

        $("body").append('<div class="link-toast '+level+'"data-id="'+id+'" style="position: fixed; right: '+right+'; bottom: '+bottom+';"><span class="toast-text">'+text+'</span></div>');
        $("div.link-toast[data-id='"+id+"']").slideDown("normal",function(){setTimeout(function(){$("div.link-toast[data-id='"+id+"']").fadeOut("normal",function(){$("div.link-toast[data-id='"+id+"']").remove();});},500);});

    }

//	添加抽奖启用开关
	function addBtn(){
		if($('.side-bar-cntr').length > 0){
			clearInterval(add);
			var lottery_btn = '<div data-v-4fd462ac="" class="side-bar-cntr" style="z-index: 11; height: 60px; bottom: 14.5%; border-top: 0; border-top-left-radius: 0; box-shadow:0 0 40px 0 rgba(0,85,255,.1); padding: 6px 4px 0"><div data-v-4fd462ac="" role="button" id="lottory_on" class="side-bar-btn"><span data-v-4fd462ac="" class="side-bar-icon svg-icon" style="background-position: 0 -28em; width: 1em; height: 1em; "></span><p data-v-4fd462ac="" class="size-bar-text" style="color: rgb(255, 109, 109);">抽奖模式</p></div></div>';
			$('.side-bar-cntr').eq(0).before(lottery_btn);
			lotteryOn();
		} else {
			return;
		}
	}

//	在动态中加入抽奖功能
	function addBtnInDynamic(){
		if($('div').hasClass('room-feed-content')){
			toast('抽奖功能添加成功');
			var happy_btn = '<a data-v-4077d7b8="" href="javascript:void(0)" class="detail-link tc-slate happy_btn" style="padding-left: 10px;">肥宅快乐抽</a>';
			$('.happy_btn').remove();
			$('.detail-link.tc-slate').after(happy_btn);
			$('.happy_btn').click(function(){
				var dynamic_addr = $(this).prev().attr('href');
				var reg = "[0-9]+(?=\.)";
				dynamic_id = dynamic_addr.match(reg)[0];
				console.log(dynamic_id);
				$.ajax({
					type: "get",
					url: "//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history",
					data: {
						visitor_uid: 0,
						host_uid: roomUid,
						offset_dynamic_id: 0
					},
					success: function(response){
//						console.log(response.data.cards);
						var cards_list = response.data.cards;
						for(var i = 0; i < cards_list.length; i++){
							if(cards_list[i].desc.dynamic_id == dynamic_id){
								console.log(cards_list[i].desc.rid);
								oid = cards_list[i].desc.rid + "";
							}
						}
					}
				});
				panel();
			});
		} else {
			alert('动态尚未加载，抽奖功能添加失败');
			return;
		}
	}

//	抽奖启用开关的点击事件
	function lotteryOn(){
		$('#lottory_on').click(function(){
			addBtnInDynamic();
		});
	}

//	抽奖页面
	function panel(){
		var style = `<style type="text/css">
.p-relative[data-v-5caee2c7] {
  position: relative;
}
.p-absolute[data-v-5caee2c7] {
  position: absolute;
}
.bg-center[data-v-5caee2c7] {
  background-position: center center;
}
.bg-no-repeat[data-v-5caee2c7] {
  background-repeat: no-repeat;
}
.pointer[data-v-5caee2c7] {
  cursor: pointer;
}
.m-auto[data-v-5caee2c7] {
  margin: 0 auto;
}
.a-move-in-top[data-v-5caee2c7] {
  -webkit-animation: move-in-top-data-v-5caee2c7 cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
          animation: move-in-top-data-v-5caee2c7 cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
}
.a-scale-out[data-v-5caee2c7] {
  -webkit-animation: scale-out-data-v-5caee2c7 cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
          animation: scale-out-data-v-5caee2c7 cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
}
.a-forwards[data-v-5caee2c7] {
  -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;
}
.t-center[data-v-5caee2c7] {
  text-align: center;
}
.bp-popup-panel[data-v-5caee2c7] {
  width: 500px;
  height: auto;
  top: 50%;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 5em 0.5em rgba(0,0,0,0.2);
          box-shadow: 0 0 5em 0.5em rgba(0,0,0,0.2);
  word-wrap: break-word;
  word-break: break-word;
}
.bp-popup-panel .title-ctnr[data-v-5caee2c7] {
  padding-bottom: 5px;
}
.bp-popup-panel .title-ctnr .popup-title[data-v-5caee2c7] {
  margin: 0;
  color: #23ade5;
  font-weight: 100;
  font-size: 18px;
}
.bp-popup-panel .popup-btn-ctnr .panel-btn[data-v-5caee2c7] {
  margin: 0 10px;
}
.bp-popup-panel .close-btn[data-v-5caee2c7] {
  width: 20px;
  height: 20px;
  right: 12px;
  top: 12px;
  color: #999;
  line-height: 20px;
  -webkit-transition: all cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.3s;
  transition: all cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.3s;
}
.bp-popup-panel .close-btn[data-v-5caee2c7]:hover {
  -webkit-transform: rotate(180deg) scale(1.1);
          transform: rotate(180deg) scale(1.1);
}
.bp-popup-panel .close-btn[data-v-5caee2c7]:active {
  -webkit-transform: rotate(180deg) scale(1);
          transform: rotate(180deg) scale(1);
  -webkit-transition: none !important;
  transition: none !important;
}
.bp-popup-panel .close-btn.disabled[data-v-5caee2c7] {
  cursor: not-allowed;
  opacity: 0.5;
}
.bp-popup-panel .close-btn.disabled[data-v-5caee2c7]:hover,
.bp-popup-panel .close-btn.disabled[data-v-5caee2c7]:active {
  -webkit-transform: rotate(0) scale(1) !important;
          transform: rotate(0) scale(1) !important;
}
@-webkit-keyframes move-in-top-data-v-5caee2c7 {
from {
    opacity: 0;
    -webkit-transform: translate(0, 5em);
            transform: translate(0, 5em);
}
to {
    opacity: 1;
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
}
}
@keyframes move-in-top-data-v-5caee2c7 {
from {
    opacity: 0;
    -webkit-transform: translate(0, 5em);
            transform: translate(0, 5em);
}
to {
    opacity: 1;
    -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
}
}
@-webkit-keyframes scale-out-data-v-5caee2c7 {
from {
    opacity: 1;
    -webkit-transform: scale(1);
            transform: scale(1);
}
to {
    opacity: 0;
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
}
}
@keyframes scale-out-data-v-5caee2c7 {
from {
    opacity: 1;
    -webkit-transform: scale(1);
            transform: scale(1);
}
to {
    opacity: 0;
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
}
}
</style>
<style type="text/css">
.bl-button[data-v-3d422a0b] {
  position: relative;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  line-height: 1;
  margin: 0;
  padding: 6px 12px;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  overflow: hidden;
}
.bl-button > .txt[data-v-3d422a0b] {
  position: relative;
}
.bl-button[data-v-3d422a0b]:disabled {
  cursor: not-allowed;
}
.bl-button--primary[data-v-3d422a0b] {
  background-color: #23ade5;
  color: #fff;
  border-radius: 4px;
}
.bl-button--primary[data-v-3d422a0b]:hover {
  background-color: #39b5e7;
}
.bl-button--primary[data-v-3d422a0b]:active {
  background-color: #21a4d9;
}
.bl-button--primary[data-v-3d422a0b]:disabled {
  background-color: #e9eaec;
  color: #b4b4b4;
}
.bl-button--ghost[data-v-3d422a0b] {
  border: 1px solid #23ade5;
  color: #23ade5;
  border-radius: 4px;
}
.bl-button--ghost[data-v-3d422a0b]:hover {
  border-color: #39b5e7;
  background-color: #39b5e7;
  color: #fff;
}
.bl-button--ghost[data-v-3d422a0b]:active {
  border-color: #21a4d9;
  background-color: #21a4d9;
  color: #fff;
}
.bl-button--ghost[data-v-3d422a0b]:disabled {
  border-color: #d0d7dd;
  background-color: transparent;
  color: #b4b4b4;
}
.bl-button--shallow[data-v-3d422a0b] {
  background-color: #e9eaec;
  color: #999;
  border-radius: 4px;
}
.bl-button--shallow[data-v-3d422a0b]:hover {
  background-color: #edeeef;
}
.bl-button--shallow[data-v-3d422a0b]:active {
  background-color: #dddedf;
}
.bl-button--shallow[data-v-3d422a0b]:disabled {
  background-color: #e9eaec;
  color: #b4b4b4;
}
.bl-button--shallow-ghost[data-v-3d422a0b] {
  border: 1px solid #e9eaec;
  color: #999;
  border-radius: 4px;
}
.bl-button--shallow-ghost[data-v-3d422a0b]:hover {
  border-color: #39b5e7;
  background-color: #39b5e7;
  color: #fff;
}
.bl-button--shallow-ghost[data-v-3d422a0b]:active {
  border-color: #21a4d9;
  background-color: #21a4d9;
  color: #fff;
}
.bl-button--shallow-ghost[data-v-3d422a0b]:disabled {
  border-color: #e9eaec;
  background-color: #e9eaec;
  color: #b4b4b4;
}
.bl-button--text[data-v-3d422a0b] {
  color: #23ade5;
  border-radius: 4px;
}
.bl-button--text[data-v-3d422a0b]:hover {
  background-color: #eef9fd;
}
.bl-button--text[data-v-3d422a0b]:active {
  background-color: #eef9fd;
}
.bl-button--text[data-v-3d422a0b]:disabled {
  color: #b4b4b4;
}
.bl-button--size[data-v-3d422a0b] {
  min-width: 104px;
  height: 32px;
  font-size: 14px;
}
.bl-button--small[data-v-3d422a0b] {
  min-width: 80px;
  height: 24px;
  font-size: 12px;
}
.bl-button--ssmall[data-v-3d422a0b] {
  min-width: 64px;
  height: 18px;
  padding: 3px 12px;
  font-size: 12px;
}
@-webkit-keyframes anim-effect-boris-data-v-3d422a0b {
0% {
    -webkit-transform: scale3d(0.3, 0.3, 1);
            transform: scale3d(0.3, 0.3, 1);
}
25%, 50% {
    opacity: 1;
}
100% {
    opacity: 0;
    -webkit-transform: scale3d(1.2, 1.2, 1);
            transform: scale3d(1.2, 1.2, 1);
}
}
@keyframes anim-effect-boris-data-v-3d422a0b {
0% {
    -webkit-transform: scale3d(0.3, 0.3, 1);
            transform: scale3d(0.3, 0.3, 1);
}
25%, 50% {
    opacity: 1;
}
100% {
    opacity: 0;
    -webkit-transform: scale3d(1.2, 1.2, 1);
            transform: scale3d(1.2, 1.2, 1);
}
}
</style>`;
		$('head').eq(0).append(style);
		var lottery_panel = `<div data-v-83c148d8="" role="alertdialog" class="bp-popup-ctnr dp-table w-100 h-100 p-fixed p-zero f-family"><div data-v-83c148d8="" class="body-merge w-100 h-100 p-absolute p-zero"></div><div data-v-83c148d8="" class="dp-table-cell v-middle"><div data-v-5caee2c7="" data-v-83c148d8="" class="bp-popup-panel p-relative m-auto a-move-in-top a-forwards" style="width: 500px;"><div data-v-5caee2c7="" class="title-ctnr p-relative"><h2 data-v-5caee2c7="" class="popup-title">肥宅快乐抽</h2></div><div data-v-5caee2c7="" class="popup-content-ctnr"><div data-v-83c148d8="" id="popup-340d7f94cb710a" class="popup-content-ctnr" style="font-size: 13px;">要在这条动态抽奖吗？</div><div data-v-5caee2c7="" class="popup-btn-ctnr t-center"><button data-v-3d422a0b="" data-v-5caee2c7="" id="select_comment" class="bl-button panel-btn bl-button--primary bl-button--size">抽个评论</button><button data-v-3d422a0b="" data-v-5caee2c7="" id="select_transmit" class="bl-button panel-btn bl-button--primary bl-button--size">抽个转发</button></div></div><div data-v-5caee2c7="" role="button" title="关闭面板" id="close_btn" class="close-btn p-absolute bg-center bg-no-repeat pointer t-center"><i data-v-5caee2c7="" class="bp-icon-font icon-close"></i></div></div></div></div>`;
		$('.bp-popup-ctnr').eq(0).append(lottery_panel);
		$('#close_btn').click(function(){
			$('.bp-popup-ctnr').eq(0).empty();
		});
		$('#select_comment').click(function(){
			toast('数据获取中……', 'info', '46%', '50%');
			setTimeout(chooseComment,500);
		});
		$('#select_transmit').click(function(){
			toast('数据获取中……', 'info', '46%', '50%');
			setTimeout(chooseTransmit,500);
		});
	}

//	抽个评论
	function chooseComment(){
//		console.log(comment_arr);
		console.log('chooseComment');
		var doNext = 0;
		var type = "";
		comment_arr = [];
//		console.log(oid.length, dynamic_id.length);
		if(oid.length == dynamic_id.length){
			type = "17";
			oid = dynamic_id;
		} else {
			type = "11";
		}
		$.ajax({
			type: "get",
			url: "//api.bilibili.com/x/v2/reply",
			async: false,
			data: {
				oid: oid,
				type: type,
				pn: 1,
				jsonp: "jsonp"
			},
			success: function(response){
				var count = response.data.page.count,
					size = 20,
					replies = response.data.replies;
//					console.log(replies);
				for(var i = 0; i < replies.length; i++){
					comment_arr.push([replies[i].floor, replies[i].member.uname, replies[i].member.mid]);
				}

				if(Math.ceil(count / size) != 1){
					var pn = Math.ceil(count / size);
//					console.log(pn);
					for(var j = 2; j <= pn; j++){
						var stop = 0;
						$.ajax({
							type: "get",
							url: "//api.bilibili.com/x/v2/reply",
							async: false,
							data: {
								oid: oid,
								type: type,
								pn: j,
								jsonp: "jsonp"
							},
							success: function(response){
								replies = response.data.replies;
//								console.log(replies);
								for(var i = 0; i < replies.length; i++) {
									comment_arr.push([replies[i].floor, replies[i].member.uname, replies[i].member.mid]);
								}
							},
							error: function(){
								alert('有数据未能获取成功，请重试');
								stop = 1;
								return;
							}
						});

						if(j > pn){
							console.log(comment_arr.length);
						}
						if(stop == 1){
							break;
						}
					}
				}
//				console.log(comment_arr);
				console.log(comment_arr.length);
				if(!comment_arr.length){
					toast('并没有获取到评论！', 'warning', '46%', '50%');
				}
				var lucky_comment = Math.floor(Math.random() * comment_arr.length);
				console.log(lucky_comment);
				console.log('中奖者是：第' + comment_arr[lucky_comment][0] + '楼的【' + comment_arr[lucky_comment][1] + '】——uid: ' + comment_arr[lucky_comment][2]);
				var result_panel = `<div data-v-83c148d8="" role="alertdialog" class="bp-popup-ctnr dp-table w-100 h-100 p-fixed p-zero f-family"><div data-v-83c148d8="" class="body-merge w-100 h-100 p-absolute p-zero"></div><div data-v-83c148d8="" class="dp-table-cell v-middle"><div data-v-5caee2c7="" data-v-83c148d8="" class="bp-popup-panel p-relative m-auto a-move-in-top a-forwards" style="width: 500px;"><div data-v-5caee2c7="" class="title-ctnr p-relative"><h2 data-v-5caee2c7="" class="popup-title">交易完成</h2></div><div data-v-5caee2c7="" class="popup-content-ctnr"><div data-v-83c148d8="" id="popup-340d7f94cb710a" class="popup-content-ctnr" style="font-size: 13px;">获取到` + comment_arr.length + `条肥宅评论<br /><br />经过一场公平公正的交易之后，我们黑幕出的快乐肥宅是：<br /><br />第 ` + comment_arr[lucky_comment][0] + ` 楼的【` + comment_arr[lucky_comment][1] + `】——uid: ` + comment_arr[lucky_comment][2] + `</div><div data-v-5caee2c7="" class="popup-btn-ctnr t-center"><button data-v-3d422a0b="" data-v-5caee2c7="" id="confirm_btn" class="bl-button panel-btn bl-button--primary bl-button--size">吸Ta欧气</button></div></div><div data-v-5caee2c7="" role="button" title="关闭面板" id="close_btn" class="close-btn p-absolute bg-center bg-no-repeat pointer t-center"><i data-v-5caee2c7="" class="bp-icon-font icon-close"></i></div></div></div></div>`;
				$('.bp-popup-ctnr').eq(0).html(result_panel);
				$('#close_btn, #confirm_btn').click(function() {
					$('.bp-popup-ctnr').eq(0).empty();
				});
			},
			error: function() {
				alert('有数据未能获取成功，请重试');
				return;
			}
		});
//		console.log(comment_arr.length);
	}

//	抽个转发
	function chooseTransmit(){
		console.log('chooseTransmit');
		transmit_arr = [];
		$.ajax({
			type: "get",
			url: "//api.live.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost",
			async: false,
			data: {
				dynamic_id: dynamic_id
			},
			success: function(response){
//				console.log(response);
				var total_count = response.data.total_count;
				for(var offset = 0; offset < total_count; offset += 20){
					var stop = 0;
					$.ajax({
						type: "get",
						url: "//api.live.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost",
						async: false,
						data: {
							dynamic_id: dynamic_id,
							offset: offset
						},
						success: function(response){
							var comments = response.data.comments;
//							console.log(comments);
							for(var i = 0; i < comments.length; i++){
								transmit_arr.push([comments[i].uname, comments[i].uid]);
							}
						},
						error: function() {
							alert('有数据未能获取成功，请重试');
							stop = 1;
							return;
						}
					});
					if(stop == 1) {
						break;
					}
				}
//				console.log(transmit_arr);
				console.log(transmit_arr.length);
				var lucky_transmit = Math.floor(Math.random() * transmit_arr.length);
				console.log(lucky_transmit);
				console.log('中奖者是：【' + transmit_arr[lucky_transmit][0] + '】——uid: ' + transmit_arr[lucky_transmit][1]);
				var result_panel = `<div data-v-83c148d8="" role="alertdialog" class="bp-popup-ctnr dp-table w-100 h-100 p-fixed p-zero f-family"><div data-v-83c148d8="" class="body-merge w-100 h-100 p-absolute p-zero"></div><div data-v-83c148d8="" class="dp-table-cell v-middle"><div data-v-5caee2c7="" data-v-83c148d8="" class="bp-popup-panel p-relative m-auto a-move-in-top a-forwards" style="width: 500px;"><div data-v-5caee2c7="" class="title-ctnr p-relative"><h2 data-v-5caee2c7="" class="popup-title">交易完成</h2></div><div data-v-5caee2c7="" class="popup-content-ctnr"><div data-v-83c148d8="" id="popup-340d7f94cb710a" class="popup-content-ctnr" style="font-size: 13px;">获取到` + transmit_arr.length + `条肥宅转发<br /><br />经过一场公平公正的交易之后，我们黑幕出的快乐肥宅是：<br /><br />【` + transmit_arr[lucky_transmit][0] + `】——uid: ` + transmit_arr[lucky_transmit][1] + `</div><div data-v-5caee2c7="" class="popup-btn-ctnr t-center"><button data-v-3d422a0b="" data-v-5caee2c7="" id="confirm_btn" class="bl-button panel-btn bl-button--primary bl-button--size">吸Ta欧气</button></div></div><div data-v-5caee2c7="" role="button" title="关闭面板" id="close_btn" class="close-btn p-absolute bg-center bg-no-repeat pointer t-center"><i data-v-5caee2c7="" class="bp-icon-font icon-close"></i></div></div></div></div>`;
				$('.bp-popup-ctnr').eq(0).html(result_panel);
				$('#close_btn, #confirm_btn').click(function() {
					$('.bp-popup-ctnr').eq(0).empty();
				});
			},
			error: function() {
				alert('有数据未能获取成功，请重试');
				return;
			}
		});
	}
})();