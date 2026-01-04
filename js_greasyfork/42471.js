// ==UserScript==
// @name         爆炸吧！非洲人
// @namespace    Cutemon
// @version      0.1
// @description  打死欧洲人！_(¦3」∠)_
// @author       Cutemon
// @match        *://live.bilibili.com/h5/189/boom
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/42471/%E7%88%86%E7%82%B8%E5%90%A7%EF%BC%81%E9%9D%9E%E6%B4%B2%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/42471/%E7%88%86%E7%82%B8%E5%90%A7%EF%BC%81%E9%9D%9E%E6%B4%B2%E4%BA%BA.meta.js
// ==/UserScript==

window.biWebSock = (function() {
			var dataStruct = [{
				name: "Header Length",
				key: "headerLen",
				bytes: 2,
				offset: 4,
				value: 16
			}, {
				name: "Protocol Version",
				key: "ver",
				bytes: 2,
				offset: 6,
				value: 1
			}, {
				name: "Operation",
				key: "op",
				bytes: 4,
				offset: 8,
				value: 1
			}, {
				name: "Sequence Id",
				key: "seq",
				bytes: 4,
				offset: 12,
				value: 1
			}];

            var protocol = location.origin.match(/^(.+):\/\//)[1];

            var wsUrl = 'ws://broadcastlv.chat.bilibili.com:2244/sub';

            if(protocol === 'https') {
                wsUrl = 'wss://broadcastlv.chat.bilibili.com:2245/sub';
            }

            //  wsUrl = 'wss://api.energys.cn/sub' // 自己的服务器转发

            function str2bytes(str) {
				var bytes = [];
				var len, c;
				len = str.length;
				for(var i = 0; i < len; i++) {
					c = str.charCodeAt(i);
					if(c >= 0x010000 && c <= 0x10FFFF) {
						bytes.push(((c >> 18) & 0x07) | 0xF0);
						bytes.push(((c >> 12) & 0x3F) | 0x80);
						bytes.push(((c >> 6) & 0x3F) | 0x80);
						bytes.push((c & 0x3F) | 0x80);
					} else if(c >= 0x000800 && c <= 0x00FFFF) {
						bytes.push(((c >> 12) & 0x0F) | 0xE0);
						bytes.push(((c >> 6) & 0x3F) | 0x80);
						bytes.push((c & 0x3F) | 0x80);
					} else if(c >= 0x000080 && c <= 0x0007FF) {
						bytes.push(((c >> 6) & 0x1F) | 0xC0);
						bytes.push((c & 0x3F) | 0x80);
					} else {
						bytes.push(c & 0xFF);
					}
				}
                return bytes;
            }

            function bytes2str(array) {
                var __array = array.slice(0);
                var j;
                var filterArray = [
                    [0x7f],
                    [0x1f, 0x3f],
                    [0x0f, 0x3f, 0x3f],
                    [0x07, 0x3f, 0x3f, 0x3f]
                ];
                var str = '';
                for(var i = 0; i < __array.length; i = i + j) {
                    var item = __array[i];
                    var number = '';
                    if(item >= 240) {
                        j = 4;
                    } else if(item >= 224) {
                        j = 3;
                    } else if(item >= 192) {
                        j = 2;
                    } else if(item < 128) {
                        j = 1;
                    }
                    var filter = filterArray[j - 1];
                    for(var k = 0; k < j; k++) {
                        var r = (__array[i + k] & filter[k]).toString(2);
                        var l = r.length;
                        if(l > 6) {
							number = r;
							break;
						}
						for(var n = 0; n < 6 - l; n++) {
							r = '0' + r;
						}
						number = number + r;
					}
					str = str + String.fromCharCode(parseInt(number, 2));
                }
                return str;
            }

            function getPacket(payload) {
                return str2bytes(payload);
            }

            function generatePacket(action, payload) {
                action = action || 2; // 2心跳  或  7加入房间
                payload = payload || '';
                var packet = getPacket(payload);
                var buff = new ArrayBuffer(packet.length + 16);
                var dataBuf = new DataView(buff);
                dataBuf.setUint32(0, packet.length + 16);
                dataBuf.setUint16(4, 16);
                dataBuf.setUint16(6, 1);
                dataBuf.setUint32(8, action);
                dataBuf.setUint32(12, 1);
                for(var i = 0; i < packet.length; i++) {
                    dataBuf.setUint8(16 + i, packet[i]);
                }
                return dataBuf;
            }

            function Room() {
                this.timer = null;
                this.socket = null;
                this.roomid = null;
            }

            Room.prototype = {
                sendBeat: function() {
                    var self = this;
                    self.timer = setInterval(function() {
                        self.socket.send(generatePacket());
                    }, 3000);
                },
                destroy: function() {
                    clearTimeout(this.timer);
                    this.socket.close();
                    this.socket = null;
                    this.timer = null;
                    this.roomid = null;
                },
                joinRoom: function(rid, uid) {
					rid = rid || 22557;
					uid = uid || 193351;
					var packet = JSON.stringify({
						uid: uid,
						roomid: rid
					});
					return generatePacket(7, packet);
                },
                init: function(roomid) {
                    var self = this;
                    self.roomid = roomid;
                    var socket = new WebSocket(wsUrl);
                    socket.binaryType = 'arraybuffer';
                    socket.onopen = function(event) {
                        if(socket.readyState == 1) {
                            console.log("%c 连接弹幕服务器成功", "color: blue");
                        } else {
                            console.log("%c 连接失败了，错误码：" + readyState, "color: red");
                        }

                        var join = self.joinRoom(roomid);
                        socket.send(join.buffer);
                        self.sendBeat(socket);
                    };

                    socket.onmessage = function(event) {
                        var dataView = new DataView(event.data);
                        var data = {};
                        data.packetLen = dataView.getUint32(0);
                        dataStruct.forEach(function(item) {
                            if(item.bytes === 4) {
                                data[item.key] = dataView.getUint32(item.offset);
                            } else if(item.bytes === 2) {
                                data[item.key] = dataView.getUint16(item.offset);
                            }
                        });
                        if(data.op && data.op === 5) {
                            data.body = [];
                            var packetLen = data.packetLen;
                            for(var offset = 0; offset < dataView.byteLength; offset += packetLen) {
                                packetLen = dataView.getUint32(offset);
                                headerLen = dataView.getUint16(offset + 4);

                                var recData = [];
                                for(var i = headerLen; i < packetLen; i++) {
                                    recData.push(dataView.getUint8(i));
                                }
                                try {
                                    // console.log(bytes2str(recData))
                                    let body = JSON.parse(bytes2str(recData));
                                    //                          console.log(body); // 弹幕、礼物、系统公告
                                    if(body.cmd === 'DANMU_MSG') {
                                        //                              console.log(body.info[2][1], ':', body.info[1]) // 用户：弹幕内容
                                        self.fn.call(null, {
                                            name: body.info[2][1],
                                            text: body.info[1],
                                            metal_name: body.info[3][1] || "没勋章",
                                            metal_level: body.info[3][0] || "0",
                                        });
                                    }
                                    data.body.push(body);
                                } catch(e) {
                                    // console.log('tcp 校验失败，重新发送')
                                }
                            }
                        }
                    };

                    socket.onclose = function() {
                        //              if (this.roomid) {
						console.log('%c 弹幕服务器关闭', "color: red");
                        //              }
                    };

                    self.socket = socket;
                },

                then: function(fn) {
                    this.fn = fn;
                }
            };

            return {
                room: null,
                start: function(roomid) {
                    $('.danmaku_info').remove();
                    $('.danmaku_pool').eq(0).prepend('<div class="danmaku_info" style="color: green">获取弹幕中……</div>');
                    console.log('%c 正在进入房间：' + roomid + '...', "color: blue");
                    this.room = new Room();
                    this.room.init(roomid);
                    return this.room;
                },
                disconnect: function() {
                    $('.danmaku_info').remove();
                    $('.danmaku_pool').eq(0).prepend('<div class="danmaku_info" style="color: indianred">弹幕获取停止……</div>');
                    if(this.room) {
                        console.log('%c 正在退出房间：' + this.room.roomid + '...', "color: red");
                        this.room.destroy();
                        this.room = null;
                    }
                }
            };
        })();


(function() {
	var html = (function() {/*
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>欧洲狐宝抽选姬</title>
			<style>
				body {
					background: #ddd;
				}
				#content {
					line-height: 30px;
					background: mediumpurple;
					text-align: center;
					color: #fff;
					padding: 10px;
				}
				.clean, .boom {
					width: 100%;
					line-height: 50px;
					display: block;
					color: #fff;
					font-size: 24px;
				}
				.start, .end {
					width: 50%;
					line-height: 50px;
					display: inline-block;
					color: #fff;
					font-size: 24px;
				}
				.start {
					background: green;
				}
				.end {
					background: indianred;
				}
				.boom {
					background: #FF86B2;
				}
				.clean {
					background: deepskyblue;
				}
				#room, #lowest_level, #highest_level {
					width: 20%;
					line-height: 20px;
					color: #000;
					outline: none;
					box-sizing: border-box;
					padding-left: 5px;
					text-align: center;
				}
				.danmaku_pool, .lottery_pool {
					width: 50%;
					display: inline-block;
					height: 400px;
					overflow: auto;
				}
				.danmu, .danmaku_info {
					border: 1px solid #0df;
					border-bottom: 0;
					background: #fff;
					width: 100%;
					line-height: 30px;
					padding-left: 10px;
					box-sizing: border-box;
					font-size: 12px;
				}
				.danmu div {
					display: inline-block;
				}
				.lottory, .lottery_member {
					border: 1px solid #f6be18;
					border-bottom: 0;
					background: #FFDDDD;
					width: 100%;
					line-height: 30px;
					padding-left: 10px;
					box-sizing: border-box;
					font-size: 12px;
				}
				.arr_list {
					width: 100%;
					line-height: 30px;
					padding-left: 10px;
					box-sizing: border-box;
				}
			</style>
			<style type="text/css">
				.fans-medal-item {
					display: inline-block;
					height: 14px;
					line-height: 14px;
					color: #fff;
					border: 1px solid #61decb;
					border-left: 0;
					white-space: nowrap;
					border-radius: 2px;
					font-family: "Microsoft YaHei", "Microsoft Sans Serif", "Microsoft SanSerf", "\5FAE\8F6F\96C5\9ED1";
					font-size: 12px;
					vertical-align: text-bottom;
				}

				.fans-medal-item.special-medal .label {
					padding-left: 14px;
					width: 54px;
					height: 14px;
					box-sizing: border-box;
				}

				.fans-medal-item.special-medal .label .content {
					display: block;
					width: 40px;
				}

				.fans-medal-item.special-medal .medal-deco {
					position: absolute;
					left: 2px;
					width: 12px;
					height: 14px;
				}

				.fans-medal-item.special-medal .union {
					background-repeat: no-repeat;
					background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAAAXNSR0IArs4c6QAAAKRJREFUKBWVUMENgzAQO1DHgEmYofxgHRiJXz9MwAL98O2nD8QGwRYXSMlFKpasu9jnS0DEgHOuBzvDktwSob3BFqFRWSXmdhlDDRii8YGHb4w6Q1tU/xr+KWE1bzi2no5IDmMFn8pVzRqVlMiHQExK9gP4UbInDj/jSbf+VVK/NRm2Ai9Ml0r2v+CTLij8BPTy4rnoGzLAB1gZCM/Wk0I/6m8HNoK7rij43fREAAAAAElFTkSuQmCC);
				}

				.fans-medal-item .label,
				.fans-medal-item .level {
					position: relative;
					display: block;
					float: left;
				}

				.fans-medal-item .label {
					width: 40px;
					text-align: center;
					padding: 0 2px;
					color: #fff;
				}

				.fans-medal-item .level {
					width: 16px;
					background-color: #fff;
					text-align: center;
					color: #000;
				}

				.level-0 {
					border-color: #000;
				}

				.level-0 .label {
					background-color: #000;
				}

				.level-0 .level {
					color: #000;
				}
				.level-1 {
					border-color: #61decb;
				}

				.level-1 .label {
					background-color: #61decb;
				}

				.level-1 .level {
					color: #61decb;
				}

				.level-2 {
					border-color: #61decb;
				}

				.level-2 .label {
					background-color: #61decb;
				}

				.level-2 .level {
					color: #61decb;
				}

				.level-3 {
					border-color: #61decb;
				}

				.level-3 .label {
					background-color: #61decb;
				}

				.level-3 .level {
					color: #61decb;
				}

				.level-4 {
					border-color: #61decb;
				}

				.level-4 .label {
					background-color: #61decb;
				}

				.level-4 .level {
					color: #61decb;
				}

				.level-5 {
					border-color: #5896de;
				}

				.level-5 .label {
					background-color: #5896de;
				}

				.level-5 .level {
					color: #5896de;
				}

				.level-6 {
					border-color: #5896de;
				}

				.level-6 .label {
					background-color: #5896de;
				}

				.level-6 .level {
					color: #5896de;
				}

				.level-7 {
					border-color: #5896de;
				}

				.level-7 .label {
					background-color: #5896de;
				}

				.level-7 .level {
					color: #5896de;
				}

				.level-8 {
					border-color: #5896de;
				}

				.level-8 .label {
					background-color: #5896de;
				}

				.level-8 .level {
					color: #5896de;
				}

				.level-9 {
					border-color: #a068f1;
				}

				.level-9 .label {
					background-color: #a068f1;
				}

				.level-9 .level {
					color: #a068f1;
				}

				.level-10 {
					border-color: #a068f1;
				}

				.level-10 .label {
					background-color: #a068f1;
				}

				.level-10 .level {
					color: #a068f1;
				}

				.level-11 {
					border-color: #a068f1;
				}

				.level-11 .label {
					background-color: #a068f1;
				}

				.level-11 .level {
					color: #a068f1;
				}

				.level-12 {
					border-color: #a068f1;
				}

				.level-12 .label {
					background-color: #a068f1;
				}

				.level-12 .level {
					color: #a068f1;
				}

				.level-13 {
					border-color: #ff86b2;
				}

				.level-13 .label {
					background-color: #ff86b2;
				}

				.level-13 .level {
					color: #ff86b2;
				}

				.level-14 {
					border-color: #ff86b2;
				}

				.level-14 .label {
					background-color: #ff86b2;
				}

				.level-14 .level {
					color: #ff86b2;
				}

				.level-15 {
					border-color: #ff86b2;
				}

				.level-15 .label {
					background-color: #ff86b2;
				}

				.level-15 .level {
					color: #ff86b2;
				}

				.level-16 {
					border-color: #ff86b2;
				}

				.level-16 .label {
					background-color: #ff86b2;
				}

				.level-16 .level {
					color: #ff86b2;
				}

				.level-17 {
					border-color: #f6be18;
				}

				.level-17 .label {
					background-color: #f6be18;
				}

				.level-17 .level {
					color: #f6be18;
				}

				.level-18 {
					border-color: #f6be18;
				}

				.level-18 .label {
					background-color: #f6be18;
				}

				.level-18 .level {
					color: #f6be18;
				}

				.level-19 {
					border-color: #f6be18;
				}

				.level-19 .label {
					background-color: #f6be18;
				}

				.level-19 .level {
					color: #f6be18;
				}

				.level-20 {
					border-color: #f6be18;
				}

				.level-20 .label {
					background-color: #f6be18;
				}

				.level-20 .level {
					color: #f6be18;
				}
			</style>
		</head>
		<body>
			<div id="content">
				<p>
					基于开源项目 <a target="_blank" href="https://github.com/LeeeeeeM/bilibili-web-socket">bilibili-web-socket</a> 的二次开发，感谢原作者。<br />
					——by 萌萌兽<br />

				抽奖范围：<input type="number" placeholder="勋章最低等级,默认为1" id="lowest_level"> -
				<input type="number" placeholder="勋章最高等级,默认为20" id="highest_level">
				</p>
			</div>
			<div style="font-size: 0;">
				<button class="start">开始获取弹幕</button>
				<button class="end">停止获取弹幕</button>
				<button class="boom">非洲人瞬间爆炸！</button>
				<button class="clean">清空弹幕和抽奖池</button>
			</div>
			<div style="font-size: 0;">
				<div class="danmaku_pool">

				</div>
				<div class="lottery_pool">

				</div>
			</div>
		</body>
				*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
	$('body').html(html);

//		biWebSock.start(5279).then(addDanMu);
		$('.clean').eq(0).bind('click', function() {
			$('.danmaku_pool').eq(0).empty();
			$('.lottery_pool').eq(0).empty();
			lottery_arr = [];
			lottery_contrast_arr = [];
		});
		$('.start').eq(0).bind('click', function() {
//			var number = $('#room').val();
			biWebSock.disconnect();
			var room = biWebSock.start(70270);
			room.then(lotteryFilter);
		});
		$('.end').eq(0).bind('click', function() {
			biWebSock.disconnect();
		});
		$('.boom').eq(0).bind('click', function() {
			if(lottery_arr.length){
				var lucky_num = Math.round(Math.random()*(lottery_arr.length - 1));
//				console.log(lucky_num);
				$('.lottory').remove();
				var luvky_dog = '<div class="lottory">非洲人已经全部爆炸_(:з」∠)_<br /><div class="fans-medal-item level-' + lottery_arr[lucky_num][2] + '"><span class="label">' + lottery_arr[lucky_num][1] + '</span><span class="level">' + lottery_arr[lucky_num][2] + '</span></div><span style="padding-left: 4px;"></span><span style="padding-left: 4px; color: blue;">【' + lottery_arr[lucky_num][0] + '】</span><span style="padding-left: 4px;">吸干了其他非洲人的欧气，成为了欧皇，请大家跟着萌萌兽一起打死Ta吧！</span></div>';
				$('.lottery_pool').eq(0).append(luvky_dog);
	//			lottery_arr.splice(lucky_num, 1);
			} else {
				alert('抽奖列表为空');
			}

		});

		function addDanMu(res) {
//			console.log(res);
//			div.innerHTML = '<div style="display: inline-block; width: 56px; height: 14px; border: 1px solid #f6be18;"><span style="float: left; width: 40px; color: #fff; background-color: #f6be18; font-size: 12px; line-height: 14px; text-align: center;">' + res.metal_name + '</span> <span style="float: left; width: 16px; color: #f6be18; background-color: #fff; font-size: 12px; line-height: 14px; text-align: center;">' + res.metal_level + '</span></div>' + res.name + '   :   ' + res.text
			var danmaku_content = '<div class="danmu" style="font-size: 12px;"><div class="fans-medal-item level-' + res.metal_level + '"><span class="label">' + res.metal_name + '</span><span class="level">' + res.metal_level + '</span></div><div class="level-' + res.metal_level + '"><span class="level" style="padding-left: 4px;">' + res.name + '   :   ' + res.text + '</span></div></div>';
			$('.danmaku_pool').eq(0).append(danmaku_content);
		}


		var lottery_arr = [];
		var lottery_contrast_arr = [];
		function lotteryFilter(res) {
			var danmaku_content = '<div class="danmu"><div class="fans-medal-item level-' + res.metal_level + '"><span class="label">' + res.metal_name + '</span><span class="level">' + res.metal_level + '</span></div><div class="level-' + res.metal_level + '" style="display: inline-block;"><span class="level" style="padding-left: 4px;">' + res.name + '   :</span>   ' + res.text + '</div></div>';
			$('.danmaku_pool').eq(0).append(danmaku_content);

			var lowest_level = $('#lowest_level').val() || 1,
				highest_level = $('#highest_level').val() || 20;
			if(res.metal_name == "狐宝" && res.metal_level >= lowest_level && res.metal_level <= highest_level){

				if($.inArray(res.name, lottery_contrast_arr) == -1){
					var lottery_join = '<div class="lottory"><span style="padding-right: 4px;">非洲人</span><div class="fans-medal-item level-' + res.metal_level + '"><span class="label">' + res.metal_name + '</span><span class="level">' + res.metal_level + '</span></div><span style="padding-left: 4px; color: blue;">【' + res.name + '】</span><span style="padding-left: 4px;">加入了拉低中奖率的队伍</span></div>';
					$('.lottery_pool').eq(0).append(lottery_join);
					lottery_arr.push([res.name, res.metal_name, res.metal_level]);
					lottery_contrast_arr.push(res.name);
//					console.log(lottery_arr)
//					$('.arr_list').remove();
//					var arr_list = '<div class="arr_list" style="font-size: 12px;">' + lottery_arr + '</div>';
//					$('.lottery_pool').eq(0).prepend(arr_list);
				} else {
					console.log('%c 【' + res.name + '】已经是非酋了！', "color: red");
				}
            } else {
				console.log('%c 【' + res.name + '】的勋章不符合条件', "color: red");
			}
			$('.lottery_member').remove();
        	$('.lottery_pool').eq(0).prepend('<div class="lottery_member" style="color: blue">当前非洲人的数量为：' + lottery_contrast_arr.length + '</div>');
        }
})();