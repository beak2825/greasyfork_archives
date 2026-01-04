// ==UserScript==
// @name         3号直播间报喜
// @namespace    mscststs
// @version      0.2
// @description   琉璃坏了的时候帮你们报喜
// @author       mscststs
// @match        *://live.bilibili.com/3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37018/3%E5%8F%B7%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8A%A5%E5%96%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/37018/3%E5%8F%B7%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8A%A5%E5%96%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let helper_baoxi_list =[];
	let buff = true;
	let delayTime = 6000;
	function Time_24(){//取得时间
		let mydate = new Date();
		return `${mydate.getHours()}:${mydate.getMinutes()}:${mydate.getSeconds()}`;
	}
	function getSeconds(){//取得秒数时间戳
        return Date.parse(new Date())/1000;
    }
	function getMiliSeconds(){//取得毫秒数时间戳
		return (new Date()).valueOf();
	}
	function getRandomSmile(){//获取随机颜文字
		let smile = ["╮(￣▽￣)╭","(=・ω・=)","(´･_･`)","（￣へ￣）","ヽ(`Д´)ﾉ","(｡･ω･｡)","(｡･ω･｡)"];
		let random = parseInt(Math.random()*100)%smile.length;
		return smile[random];
	}
	function AddToList(obj){
		obj.time = Time_24();

		if(helper_baoxi_list[obj.roomid]){
			helper_baoxi_list[obj.roomid].number+=1;
			if(helper_baoxi_list[obj.roomid].type!=obj.type){
				helper_baoxi_list[obj.roomid].type="ALL";
			}
			helper_baoxi_list[obj.roomid].targetTime = getMiliSeconds()+delayTime;
		}else{
			helper_baoxi_list[obj.roomid] = obj;
			helper_baoxi_list[obj.roomid].number = 1;
			helper_baoxi_list[obj.roomid].targetTime = getMiliSeconds()+delayTime;
		}
	}
	function post(obj){
		if(!buff) return;
		let mytype = "";
		switch(obj.type){
			case "Raffle":mytype = "火力";break;
			case "SmallTv":mytype = "电视";break;
			case "ALL": mytype="火力+电视";break;
			default:break;
		}
		let myroomid = obj.roomid+"";
		myroomid = myroomid.replace(/64/g,"Ⅵ泗");//敏感词过滤
		let Text = `${obj.time} 房间${myroomid} ${mytype} X${obj.number}`;
		console.log(Text);
		$.ajax({
                    type: "POST",
                    url: "//api.live.bilibili.com/msg/send",
                    data: {
                        color:16777215,
                        fontsize:25,
                        mode:1,
                        msg:Text,
                        rnd:getSeconds(),
                        roomid:23058
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    }
                });
	}
	function getList(){
		//console.log(helper_baoxi_list);
		let now_Time = getMiliSeconds();
		for (let key in helper_baoxi_list){
			if(now_Time>helper_baoxi_list[key].targetTime){
				post(helper_baoxi_list[key]);
				delete(helper_baoxi_list[key]);

				return;//每秒只允许发一句
			}
		}
	}
	function SmallTv(obj){
		let content = obj.find("div.msg-content > a").text();
		//【575の一只黄鸭】在直播间【575】赠送 小电视一个，请前往抽奖
		let roomid = parseInt(content.slice(content.indexOf("直播间【")+4));
		let type = "SmallTv";
		AddToList({roomid,type});
	}
	function Raffle(obj){
		let content = obj.find(".msg-content > a").text();
		//阿凉の月神在直播间71084火力全开，嗨翻全场，速去围观，还能免费领取火力票！
		if(content.indexOf("火力全开，嗨翻全场")>0 && content.indexOf("系统公告")==-1){
			let roomid = parseInt(content.slice(content.indexOf("在直播间")+4));
			let type = "Raffle";
			AddToList({roomid,type});
		}
	}
	function Listen(){
		$("body").on("DOMNodeInserted",".chat-item.system-msg.small-tv",function(e){
			SmallTv($(this));
		});
		$("body").on("DOMNodeInserted",".chat-item.system-msg.news",function(e){
			Raffle($(this));
		});
		$("body").on("DOMNodeInserted",".chat-item.danmaku-item",function(e){
			let medal = $(this).find(".fans-medal-item > .label").text();
			let conetnt = $(this).find(".danmaku-content").text();
			if((medal.indexOf("夏沫")>=0 && (conetnt.indexOf("火力全开")>=0||conetnt.indexOf("直播间")>=0||conetnt.indexOf("嗨起来")>=0))||(conetnt == "苹朵你别再刷屏了")){
				buff = false;
				$.ajax({
                    type: "POST",
                    url: "//api.live.bilibili.com/msg/send",
                    data: {
                        color:16777215,
                        fontsize:25,
                        mode:1,
                        msg:`苹朵已下线`,
                        rnd:getSeconds(),
                        roomid:23058
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
					success:function(data){
						window.location.href="http://www.baidu.com";
					}
                });
			}
		});
	}
	function init(){
		Listen();
		setInterval(function(){
			getList();
		},1000);
	}
	init();
})();