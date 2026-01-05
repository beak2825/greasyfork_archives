// ==UserScript==
// @name        	nico_playerChanger
// @description 	Change ニコニコ flashplayer to html5 player,and can exchange it.
// @include     	*www.nicovideo.jp/watch/*
// @version     	1.2.1
// @grant 				GM_xmlhttpRequest
// @run-at				document-end
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/24559/nico_playerChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/24559/nico_playerChanger.meta.js
// ==/UserScript==

(function() {
	// Nico getflv API
	const nico_Getflv_API = "http://flapi.nicovideo.jp/api/getflv/";
	// 播放模式切換按鈕的css
	const changePlayer_Btn_CSS = "display:block; width:6em; height:1.5em; background:#ccc; position:fixed; right:0; top:0; z-index:1000000; text-align:center";
	// 字幕開關的css
	const changeSub_Btn_CSS = "display:block; width:6em; height:1.5em; background:#ccc; position:fixed; right:0; top:1.5em; z-index:1000000; text-align:center";
	// 取得影片ID
	const video_ID = location.href.replace(/http.*?watch\/([^?]*)(\?.*)?$/g, "$1");
	// 用於取得字幕
	var thread_ID;
	// 創建html5 player
	var html5_Player = document.createElement("video");
	// 取得nico的flashPlayer
	var nico_flashPlayer = document.querySelector("object[id*=external_nicoplayer]");
	// 存放flashPlayer的內容
	var nico_FlashPlayer_outerHTML = nico_flashPlayer.outerHTML;
	var nico_FlashPlayer_parentNode = nico_flashPlayer.parentNode;
	// 存放字幕
	var track;
	// 取得並存放當前Html5 Player
	var nicoHtml5Player;
	// 創建播放模式切換的按鈕
	var changePlayer_Btn = document.createElement("span");
	// 創建字幕開關的按鈕
	var changeSub_Btn = document.createElement("span");
	// 重試次數
	var retry_Times = 0;
	
	build();
	function build(){
		// 用nico api取得影片flv檔案位置
		GM_xmlhttpRequest({
			method : "GET",
			url : nico_Getflv_API + video_ID,
			onload : function (responseDetails) {
				// nico api回傳的字串
				let res_str = responseDetails.responseText;
				// 如有錯誤, 嘗試5次
				if(res_str.match(/thread\_id\=.?.+\&url\=.?/) == null && retry_Times <= 5) {
					build();
					retry_Times++;
				} else if (res_str.match(/thread\_id\=.?.+\&url\=.?/) == null && retry_Times >= 5) {
					alert("Can't get response frome Nico API.\n" + "Error messages: " + res_str);
				}
				// 切出flv的url
				var flvURL = unescape(res_str.substring(res_str.indexOf("&url=") + 5, res_str.indexOf("&ms=")));
				// 切出thread_id
				thread_ID = res_str.substring(10, res_str.indexOf("&l="));
				// 設定html5 Player
				html5_Player.id = "html5_video"
				html5_Player.src = flvURL; //影片url
				html5_Player.setAttribute("controls", "");
				html5_Player.style.cssText = "height: 100%; width: 100%;"
				ConfigHtml5Player();
				// 取得評論(弾幕) 依照thread_ID取得commend 數量為1000
				GM_xmlhttpRequest({
					method : "GET",
					url : "http://nmsg.nicovideo.jp/api.json/thread?version=20090904&thread=" + thread_ID + "&res_from=-1000",
					onload : function (res) {
						// 移除json中不必要的物件(thread與leaf) 只取得chat後的內容
						let json_str = res.responseText.match(/\{\"chat\"\:\s\{(.*)\}\}\]/)[0];
						/* var json_str = "[" + /\{\"chat\"\:\s\{(.*)\}\}\]/.exec(res.responseText)[0]; */
						if (json_str != null) {
							json_str = "[" + json_str;
							// 轉成json物件
							var comment_json = JSON.parse(json_str);
							// 依照vpos由小到大排序
							/* for (let i in comment_json) {
								for (let j = parseInt(i); j > 0; j--) {
									if (parseInt(comment_json[j - 1].chat.vpos) > parseInt(comment_json[j].chat.vpos)) {
										var temp = comment_json[j];
										comment_json[j] = comment_json[j - 1];
										comment_json[j - 1] = temp;
									} else {
										break;
									}
								}
							} */
							// 新增track
							track = html5_Player.addTextTrack("subtitles", "弾幕", "jp");
							// 設定track預設為顯示
							track.mode = "showing";
							// 將評論輸出成字幕 vpos單位為1/100秒
							for (let i = 0; i < comment_json.length; i++) {
								let cue = new VTTCue(parseFloat(comment_json[i].chat.vpos) / 100.00, //字幕開始時間
										parseFloat(comment_json[i].chat.vpos + (3 * 100)) / 100.00, //字幕結束時間
										comment_json[i].chat.content != undefined ? comment_json[i].chat.content : " "); //字幕內容
								cue.align = "right";
								cue.vertical = ""; //rl: vertical growing left, lr: vertical growing right
								cue.lineAlign = "start";
								cue.positionAlign = "line-right";
								cue.position = 50;
								track.addCue(cue);
							}
						} else {track = "none_sub";}
						ConfigSubButton();
					}
				});
				//設定html5 Player
				function ConfigHtml5Player() {
					// 存放html5 Player的內容
					let html5_outer_html = html5_Player.outerHTML;
					// 移除flashPlayer(預設使用html5 player)
					nico_FlashPlayer_parentNode.removeChild(nico_flashPlayer);
					nico_FlashPlayer_parentNode.appendChild(html5_Player);
					// 設定播放模式切換按鈕
					changePlayer_Btn.textContent = "切換為Flash";
					changePlayer_Btn.id = "player_btn";
					changePlayer_Btn.style.cssText = changePlayer_Btn_CSS;
					// 播放模式切換按鈕的點擊事件
					changePlayer_Btn.addEventListener("click", function () {
						let flash = document.querySelector("object[id*=external_nicoplayer]");
						if (flash) {
							// 切換成html5 Player
							flash.parentNode.innerHTML = html5_outer_html;
							// 重新上字幕
							if (track != "none_sub") {
								nicoHtml5Player = document.querySelector("video[id*=html5_video]");
								nicoHtml5Player.addTextTrack("subtitles", "弾幕", "jp");
								nicoHtml5Player.textTracks[0].mode = "showing";
								for(let i = 0; i < track.cues.length; i++) {
									nicoHtml5Player.textTracks[0].addCue(track.cues[i]);
								}
								document.getElementById("sub_btn").textContent = "關閉字幕";
							}
							document.getElementById("player_btn").textContent = "切換為Flash";
						} else {
							// 切換成flashPlayer
							nico_FlashPlayer_parentNode.innerHTML = nico_FlashPlayer_outerHTML;
							document.getElementById("player_btn").textContent = "切換為Html5";
						}
					});
				}
				// 設定字幕開關
				function ConfigSubButton(){
					changeSub_Btn.textContent = (track == "none_sub") ? "無字幕" : "關閉字幕";
					changeSub_Btn.id = "sub_btn";
					changeSub_Btn.style.cssText = changeSub_Btn_CSS;
					// 切換字幕開關的點擊事件
					if (track != "none_sub") {
						changeSub_Btn.addEventListener("click", function () {
							nicoHtml5Player = document.querySelector("video[id*=html5_video]");
							if (nicoHtml5Player != null) {
								let mode = nicoHtml5Player.textTracks[0].mode;
								if (mode == "showing") {
									// 隱藏字幕
									nicoHtml5Player.textTracks[0].mode = "hidden";
									document.getElementById("sub_btn").textContent = "開啟字幕";
								} else if (mode == "hidden") {
									// 開啟字幕
									nicoHtml5Player.textTracks[0].mode = "showing";
									document.getElementById("sub_btn").textContent = "關閉字幕";
								}
							} else {alert("Html5 Player not founded.");}
						});
					}
				}
			}
		});
		//附加按鈕到頁面上
		document.body.appendChild(changePlayer_Btn);
		document.body.appendChild(changeSub_Btn);
	}
})();