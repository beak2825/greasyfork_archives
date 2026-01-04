// ==UserScript==
// @name         虎牙自动送礼物-定制版
// @namespace    https://item.taobao.com/item.htm?id=670749376549
// @version      1.2
// @description  将包裹里的礼物自动全部送出【淘宝店铺（因稀有才珍贵）制作】
// @author       【淘宝店铺（因稀有才珍贵）制作】
// @match        （填写你的直播间网址，例如https://www.huya.com/chuhe）
// @match        （填写你的直播间网址，例如https://www.huya.com/998）
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      huya.com
// @license      淘宝店铺（因稀有才珍贵）制作
// @downloadURL https://update.greasyfork.org/scripts/470412/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E7%89%A9-%E5%AE%9A%E5%88%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470412/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E7%89%A9-%E5%AE%9A%E5%88%B6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取时间戳
    function getTimeSign() {
    	console.log("getTimeSign");
    	GM_xmlhttpRequest({
			method: "GET",
			url: "https://q.huya.com/index.php?m=PackageApi&do=getTimeSign",
			headers: {
	    		"Content-Type": "application/json"
	    	},
			onload: function(res) {
				console.log("getTimeSignSuccess");
				console.log(res);
				console.log(res.response);
				getGiftList(JSON.parse(res.response).data);
			},
			onerror: function(res) {
				console.log("getTimeSignError");
				console.log(res);
				console.log(res.response);
			}
		});
    }

    // 获取礼物列表
    function getGiftList(timeSgin) {
    	console.log("getGiftList");
    	GM_xmlhttpRequest({
			method: "GET",
			url: "https://q.huya.com/index.php?m=PackageApi&do=listTotal" + "&time=" + timeSgin.time + "&sign=" + timeSgin.sign,
			headers: {
	    		"Content-Type": "application/json"
	    	},
			onload: async function(res) {
				console.log("getGiftListSuccess", res);
				console.log(res.response);
				var giftList = JSON.parse(res.response).data.package;
				if(!!giftList.length) {
					console.log("包裹", giftList);
					for (var i = 0; i < giftList.length; i++) {
						var value = giftList[i];
						if(4 == value.type || 20865 == value.type) {  // 虎粮4，热火20865
	                		console.log(value.cName, value);
	                		$(`.player-face-list.player-face-list-ctrl li:first`).mouseover().mouseout();
	                		$(".desc").text(value.cName + "剩余：" + value.num);
	    					$(".btn.num-select span").text(value.num);// 设置礼物数量

            				sendGift(value.num, value.type, value.cName);

	                		// 等待，礼物送完后，再继续送下一个礼物
					    	await new Promise(function (resolve, reject) {
					    		setTimeout(()=>{
					    			console.log("wait...")
					    			resolve();
					    		}, 5e3);
							});
	                	}
					}
				} else {
					GM_notification({
			    		text: "礼物送完啦",
			    		title: "礼物送完啦",
			    		image: "https://huyaimg.msstatic.com/cdnimage/actprop/4_1__gif_1532944034.gif",
			    		timeout: 3e3
			    	});
				}
			},
			onerror: function(res) {
				console.error("getGiftListError");
				console.error(res);
			}
		});
    }

    // 送礼
    function sendGift(total, type, name) {  // total礼物数量，type礼物ID，name礼物名称
    	console.log("sendGift");
    	var zhuboName = $(".host-name").text();// 主播名
    	$("#player-gift-tip").attr("propsid", type);// 以防万一，再指定一次礼物ID
    	$(".btn.num-select span").text(total);// 设置礼物数量
    	$(".btn.send.normal").click();// 发送礼物

    	// 确认送礼
    	setTimeout(()=>{
    		$("#player-gift-dialog .btn.confirm").click();
    	}, 2 * 1e3);

    	console.log("已自动送" + name + total + "个");
    	GM_notification({
    		text: "已自动送" + name + total + "个",
    		title: zhuboName + "直播间",
    		image: "https://huyaimg.msstatic.com/avatar/1086/bf/fd6f69d69c0015eaface1f6024869e_180_135.jpg",
    		timeout: 3e3
    	});
    }

    // 打卡
    function checkIn() {
    	console.log("打卡");
    }

    $(window).ready(function (){
    	var time = setInterval(()=> {
    		console.log("自动送虎粮setInterval");
    		$(".player-face-list.player-face-list-ctrl li:first").mouseover().mouseout();
    		if(!!$(".player-face-gift").length) {
    			clearInterval(time);
    			getTimeSign();
    		}
    	}, 6e3);
    });
})();
