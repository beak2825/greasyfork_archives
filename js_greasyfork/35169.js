// ==UserScript==
// @name             BiliBili一键开播-RTMP地址获取
// @namespace    mscststs
// @version      0.23
// @description  B站免跳转获取直播推流地址
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @require       https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=618337
// @connect     api.live.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35169/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD-RTMP%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/35169/BiliBili%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD-RTMP%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(function(){

        var as = [];
        as["prepare"]="闲置";
        as["round"]="轮播";
        as["live"]="直播";
	 function get_roomid(){
            var url_text = window.location.href+"";
            var  m=url_text.slice(url_text.indexOf(".com/")+5,100);
            return m;//获取当前房间号
     }
        function room_init(roomid){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/room/v1/Room/room_init",
                    data: {
                        id:roomid
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            var room_id = data.data.room_id;//获取真实房间号，用于短号转长号
                            var master_id = data.data.uid;//获取主播ID
                            window.roomid = room_id;
                            console.log("success to get room info "+room_id+master_id);
                            get_info_in_room(room_id,master_id);
                        }else{
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
        }
        function get_info_in_room(roomid,master_id){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/live_user/v1/UserInfo/get_info_in_room",
                    data: {
                        roomid:roomid
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            var myid = data.data.info.uid;
                            if(myid == master_id){
                                //alert("这是你的直播间");
                                //do something...
                                prepare();
                            }else{
                                //alert("这不是你的直播间");
                            }
                        }else{
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
        }
        function start_live(){
            $.ajax({
                    type: "post",
                    url: "//api.live.bilibili.com/room/v1/Room/startLive",
                    data: {
                        room_id:window.roomid,
                        area_v2:"27",
                        platform:"pc",
                        csrf_token:""
                    },
                    datatype: "json",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            var rtmp_address = data.data.rtmp.addr;
                            var rtmp_code = data.data.rtmp.code;
                            prompt("本次直播的 RTMP 推流地址是：",rtmp_address);
                            prompt("本次直播的 RTMP 推流密钥是：",rtmp_code);
                            var status = data.data.status;
                            $("span.live-status-label").removeClass("live prepare round").addClass(status).text(as[status]);
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
        }
        function stop_live(){
			let csrf_token ="";
			let cookies = document.cookie.split(" ");
			for(let ck of cookies){
				let key = ck.split("=")[0];
				let value = ck.split("=")[1].split(";")[0];
				if(key=="bili_jct"){
					csrf_token = value;
				}
			}
			
			
            $.ajax({
                    type: "post",
                    url: "//api.live.bilibili.com/room/v1/Room/stopLive",
                    data: {
                        room_id:window.roomid,
                        platform:"pc",
						csrf_token
                    },
                    datatype: "json",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            var status = data.data.status;
                            $("span.live-status-label").removeClass("live prepare round").addClass(status).text(as[status]);
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
        }


        function prepare(){
            $("#head-info-vm").append("<style>.live-status-label{cursor:pointer;}</style>");
            $("#head-info-vm").on("click","span.live-status-label",function(){
                if($("span.live-status-label").text()!="直播"){
                    start_live();
                }else{
                    stop_live();
                }
            });
        }
        async function init(){
			await mscststs.wait(".live-status-label");
			console.log("getInfo")
            var roomid = get_roomid();
            room_init(roomid);
        }
		init();



    });
})();