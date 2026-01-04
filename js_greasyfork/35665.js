// ==UserScript==
// @name         点歌姬-网易云音乐-Bind of bilibili
// @namespace    mscststs
// @version      0.4
// @description  bilibili点歌姬-网易云音乐曲库
// @connect      163.com
// @connect     bilibili.com
// @author       mscststs
// @include        /^https?:\/\/live\.bilibili\.com\/\d/
// @grant 		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/35665/%E7%82%B9%E6%AD%8C%E5%A7%AC-%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90-Bind%20of%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/35665/%E7%82%B9%E6%AD%8C%E5%A7%AC-%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90-Bind%20of%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
	$().ready(function(){
	    function getSeconds(){//取得秒数时间戳
			return Date.parse(new Date())/1000;
		}

		function getMiliSeconds(){//取得毫秒数时间戳
			return (new Date()).valueOf();
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
							window.music_helper_roomid = room_id;
                            var master_id = data.data.uid;//获取主播ID
                            get_info_in_room(room_id,master_id);
                        }
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
                                start();
                            }else{
                                //alert("这不是你的直播间");
                            }
                        }
                    }
                });
        }
		function get_roomid(){
            var url_text = window.location.href+"";
            var  m=url_text.match(/(\d)*$/);
            return m[0];//获取当前房间号
        }
		function Send_Danmaku(text){//发送弹幕
			var roomid = window.music_helper_roomid;
			 $.ajax({
				 type: "POST",
				 url: "//api.live.bilibili.com/msg/send",
				 data: {
					 color:16777215,
					 fontsize:25,
					 mode:1,
					 msg:text,
					 rnd:getSeconds(),
					 roomid:roomid
				 },
				 datatype: "jsonp",
				 crossDomain:true,
				 xhrFields: {
					 withCredentials: true
				 },
				 success: function (data) {
					 if(data.code!==0){
						 console.log("发送弹幕出错了",data);
					 }
				 }
			 });
		}
		function init(){
            var roomid = get_roomid();
            room_init(roomid);
		}
		function Search_song(name){
			GM_xmlhttpRequest({
				method: "post",
				url: "http://music.163.com/api/search/get/web?csrf_token=",
				data:"s="+name+"&type=1&offset=0&total=true&limit=10",
  				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				onload: function(responseDetails) {
					var data = JSON.parse(responseDetails.responseText);
					console.log(data);
					var songs = data.result.songs;
					if(songs.length>0){
						var music = {
							id :songs[0].id,
							name :songs[0].name,
							duration :songs[0].duration
						};
						Send_Danmaku("【点歌姬】点歌"+music.name+"成功");
						window.music_helper_list.push(music);
						console.log(window.music_helper_list);
					}else{
						Send_Danmaku("【点歌姬】找不到歌曲");
					}
				}
			});
		}
		function Get_duration(id){
			GM_xmlhttpRequest({
				method: "get",
				url: "http://music.163.com/api/song/detail/?id="+id+"&ids=["+id+"]",
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				onload: function(responseDetails) {
					var data = JSON.parse(responseDetails.responseText);
					console.log(data);
					var songs = data.songs;
					if(songs.length>0){
						var music = {
							id :id,
							name :songs[0].name,
							duration :songs[0].duration
						};
						Send_Danmaku("【点歌姬】点歌"+music.name+"成功");
						window.music_helper_list.push(music);
						console.log(window.music_helper_list);
					}else{
						Send_Danmaku("【点歌姬】找不到歌曲");
					}
				}
			});
		}
		function next_song(){
			//console.log("切歌");
			if(window.music_helper_list.length){//如果有歌
				switch_music(window.music_helper_list.shift());//放出队列第一首
			}else{
				if(window.helper_music_default){
					Search_song(window.helper_music_default);
				}
				//Send_Danmaku("【点歌姬】播放队列为空");
				$("#helper_music_player *").remove();
				setTimeout(function(){next_song();},2000);//递归判断队列
				//卧槽感觉这几个部分耦合有点严重
			}
		}
		function play(id){
			GM_xmlhttpRequest({
				method: "get",
				url: "http://music.163.com/api/song/enhance/download/url?br=320000&id="+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				onload: function(responseDetails) {
					var data = JSON.parse(responseDetails.responseText);
					console.log(data);
					var url = data.data.url;
					if(typeof(url)!="string"){
						Send_Danmaku("【点歌姬】播放失败");
						next_song();
						return;
					}
					var audio=$('<audio src="'+url+'" autoplay="autoplay">您的浏览器不支持 audio 标签。</audio>');
					audio[0].volume=0.5;
					$("#helper_music_player").append(audio);
				}
			});
		}
		function switch_music(music){
			var next = window.music_helper_list.length?("；下一首:"+window.music_helper_list[0].name):("；没有下一首了");
			Send_Danmaku("【点歌姬】当前播放:"+music.name+next);
			window.helper_music_id=music.id;
			$("#helper_music_player *").remove();
			//$("#helper_music_player").append('<embed src="//music.163.com/style/swf/widget.swf?sid='+music.id+'&type=2&auto=1&width=320&height=66" width="340" height="86"  allowNetworking="all"></embed>');
			//$("#helper_music_player").append('<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=510 height=66 src="//music.163.com/outchain/player?type=2&id='+music.id+'&auto=1&height=66"></iframe>');
			play(music.id);
			setTimeout(function(){
				if(window.helper_music_id == music.id){
					next_song();
				}else{}
			},parseInt(music.duration)-(-2000));//播放完毕自动切歌
		}
		function cmd(cmd,isadmin){
			//命令列表
			if(/切歌/.test(cmd)){
				if(isadmin)//仅允许管理员切歌
					next_song();
			}
			if(/默认/.test(cmd)){
				if(isadmin)//仅允许管理员切歌
					var  m=cmd.match(/[^#默+认](.)*/);
					window.helper_music_default =  m[0];
			}
			if(/点歌/.test(cmd)){
				if(window.music_helper_list.length<=1){
					var  m=cmd.match(/[^#切+歌][^点+歌](.)*/);
					var word = m[0];
					if(/^\d*$/.test(word)){//id点歌
						Get_duration(word);
					}else{
						Search_song(word);
					}
				}else{
					Send_Danmaku("【点歌姬】这首歌结束才能点歌哦");
				}
			}
		}
		function start(){
			//自己的直播间，开启弹幕命令监听，设置相关参数
			console.log("启动了");
			window.music_helper_list = [];
			$("body").append("<div id='helper_music_player' style='display:none'></div>");//歌曲播放容器
			$("body").on("DOMNodeInserted","div.chat-item.danmaku-item",function(e){
				var danmaku = $(this).attr("data-danmaku");
				var isadmin = $(this).find(".anchor-icon").length>0||$(this).find(".my-self").length>0;//获取是否是牛逼的人
				if(/^#/.test(danmaku)){
					cmd(danmaku,isadmin);
				}else{
				}
			});
			next_song();
		}
		init();
	});
    // Your code here...
})();