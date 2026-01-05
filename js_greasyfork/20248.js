// ==UserScript==
// @name        b站直播自动抽奖
// @namespace   https://greasyfork.org/zh-CN/scripts/20248-b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96
// @version     1.8.11
// @include      http://live.bilibili.com/*
// @grant       none
// @description  bilibiliAutoTV
// @downloadURL https://update.greasyfork.org/scripts/20248/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/20248/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

var addStyle = function(w) {
	var E = document.createElement("style");
	E.appendChild(document.createTextNode(w));
	document.getElementsByTagName("head")[0].appendChild(E)
}, printLog = function(w) {
		window.needLog && console.log(w)
	};
(function() {
	function w(a) {
		$(".avatar-msg-panel").find("span").first().html(a);
		$(".avatar-msg-panel").addClass("show");
		clearTimeout(H);
		H = setTimeout(function() {
			$(".avatar-msg-panel").removeClass("show")
		}, 5E3)
	}
	if (window.isloaded) alert("脚本正在运行,无需再次启动,如需重启脚本,请刷新页面后再开启");
	else {
		window.isloaded = !0;
		var E, x, m, n, y;
		$("#player_object");
		var z = "喵娘",
			G = '狂点340次深空远征,结果中了5根辣条;#user,想进小黑屋吗?喵~;(´･_･`)你们这样很容易失去我;科科;再看我都要疯了\n神TM均富卡;你们咋不上天呢: );你们翻车翻得那么6,不是触是什么^_^;为什么只有我被嫌弃[手动再见];沐沐怂了,沐沐消失了,泥萌慢慢玩;作死…就会死 : );谁要开车呀: );沐沐智商都没上线,怎么下线_(:зゝ∠)_;我真机智.;╮(╯▽╰)╭ 这不挺好的么;#user,吃枣^_^;么么有风险,亲亲需谨慎哟~;作死是一定会死的!!!;^_^主播&房管可是在窥屏的...;智商是什么能吃么╮(╯▽╰)╭;果然,我没有智商是有原因的..._(:зゝ∠)_;对啊…我白羊座啊;这里没有喵娘~;这直播间..简直没法待了.;沐沐是我..;现在你看到的沐沐是幻觉^_^;对,我疯了╮(￣▽￣")╭;还是送你们上天,我比较看好;就幼稚!!!气死你们!!~;播主是蛇精病;哈鲁_(:зゝ∠)_感觉我又要被嫌弃了...;奔30的一米八男生还卖萌..那我岂不是死变态: );╮(╯▽╰)╭我只是单纯的蛇精病;想上天的可以直接说: );你试试就造沐沐在不在啦~~~;沐沐怂了;你萌才发现咩╮(╯▽╰)╭;喵喵喵???..;咱是男的;咱又不是宠物;毒奶什么的都是玄学;欧吃矛(╯‵□′)╯︵┻━┻;^_^我^_^是^_^男^_^的^_^;#user,不要污哦;kill all;^_^我仿佛听到了有人在嘚瑟;张猫才是男神= =#\n     我是男神经病= =#;沐沐不想和你说话并向你投掷了一只张猫;沐沐没做饭..你们别回来了喵!;反正已经没有形象了..T_T;果然吃枣要被打死啊我.....;有胆量来面基!路费你自己出!;原来泥萌是这样的泥萌: );为什么一定要作死;再揉就要死了p(#￣▽￣#)o;不要怀疑人生喵~\n还是怀疑自己脸黑吧.喵~o( =∩ω∩= )m'.split(";"),
			H;
		$(".avatar-msg-panel");
		var A = {
			rewardNotify: function(a, c) {
				var b = {
					dir: "ltr",
					lang: "utf-8",
					icon: "http://static.hdslb.com/live-static/live-room/images/gift-section/gift-25.png",
					body: a && 1 == a ? "小电视抱枕!!!" : 2 == a ? "蓝白胖次x" + c : 3 == a ? "B坷垃x" + c : 4 == a ? z + "x" + c : 5 == a ? "便当x" + c : 6 == a ? "银瓜子x" + c : 7 == a ? "辣条x" + c : "没中奖"
				};
				if (Notification && "granted" === Notification.permission) {
					var e = new Notification("获得了: ", b);
					e.onshow = function() {
						setTimeout(function() {
							e.close()
						}, 8E3)
					}
				} else Notification && "denied" === Notification.permission && Notification.requestPermission(function(a) {
					if ("granted" === a) {
						var c = new Notification("获得了: ", b);
						c.onshow = function() {
							setTimeout(function() {
								c.close()
							}, 8E3)
						}
					}
				})
			},
			errorNotify: function(a) {
				var c = {
					dir: "ltr",
					lang: "utf-8",
					icon: "http://static.hdslb.com/live-static/live-room/images/gift-section/gift-25.png",
					body: "此次抽奖请尝试手动抽奖(点击跳转)"
				};
				if (Notification && "granted" === Notification.permission) {
					var b = new Notification("【" + a + "】直播间抽奖出错", c);
					b.onshow = function() {
						setTimeout(function() {
							b.close()
						}, 1E4)
					};
					b.onclick = function() {
						window.open("http://live.bilibili.com/" + a)
					}
				} else Notification && "denied" === Notification.permission && Notification.requestPermission(function(b) {
					if ("granted" === b) {
						var d = new Notification("【" + a + "】直播间抽奖出错", c);
						d.onshow = function() {
							setTimeout(function() {
								d.close()
							}, 1E4)
						};
						d.onclick = function() {
							window.open("http://live.bilibili.com/" + a)
						}
					}
				})
			}
		}, q = !1,
			k = [],
			B = 0,
			h = 0,
			r = 0,
			t = {}, u = function(a) {
				return 1E4 >= a ? t[a] : a
			}, d = {
				startLoadingListDelay: function(a) {
					/*setTimeout(function() {
						d.startLoadingList(a)
					}, 12E3)*/
				},
				startLoadingList: function(a) {
					t[a] ? (k.push(a), d.getSmallTVID()) : 1E4 >= a ? d.getRoomID(a) : (k.push(a), d.getSmallTVID())
				},
				getRoomID: function(a) {
					$.ajax({
						url: a,
						type: "GET",
						timeout: 8E3,
						async: !1,
						success: function(c) {
							c = c.match(/ROOMID = (\d+)/);
							t[a] = c[1];
							k.push(a);
							d.getSmallTVID();
							B = 0
						},
						error: function() {
							B++;
							console.error("获取房间号错误次数: " + B);
							5 < B ? (A.errorNotify(a), B = 0) : setTimeout(function() {
								d.getRoomID(a)
							}, 1E3 * B + 1E3)
						}
					})
				},
				getSmallTVID: function() {
					if (!q && 0 < k.length) {
						q = !0;
						var a = k[0],
							c = {
								roomid: u(a)
							};
						$.ajax({
							url: "/SmallTV/index",
							type: "GET",
							data: c,
							cache: !1,
							timeout: 2500,
							async: !1,
							dataType: "JSON",
							success: function(b) {
								if (b && b.data && b.data.unjoin && b.data.unjoin[0] && b.data.unjoin[0].id) h = 0, d.joinSmallTV(b.data.unjoin[0].id, a), k.splice(0, 1), d.getSmallTVID();
								else if (b && b.data && b.data.join) {
									for (var c = 0; c < b.data.join.length; c++) 0 === $("#smallTV" + b.data.join[c].id).size() && (h = 0, m.append('<p class="item_jstv" id="smallTV' + b.data.join[c].id + '" style="font-size: 13px" title="' + (new Date).toLocaleTimeString() + '">已参与【' + a + "】小电视抽奖: 等待开奖</p>"), d.getRewardDelay(b.data.join[c].id, b.data.join[c].dtime));
									q = !1;
									k.splice(0, 1);
									k[0] && d.getSmallTVID()
								} else q = !1, h++, console.error("获取tvID错误次数: " + h), 5 < h ? (A.errorNotify(a), h = 0, k.splice(0, 1), d.getSmallTVID()) : setTimeout(function() {
									d.getSmallTVID()
								}, 800 * h + 500)
							},
							error: function() {
								q = !1;
								h++;
								console.error("获取tvID错误次数: " + h);
								5 < h ? (A.errorNotify(a), h = 0, k.splice(0, 1), d.getSmallTVID()) : setTimeout(function() {
									d.getSmallTVID()
								}, 800 * h + 500)
							}
						})
					}
				},
				getRewardDelay: function(a, c) {
					setTimeout(function() {
						d.getReward(a)
					}, 1E3 * c + 26E3)
				},
				joinSmallTV: function(a, c) {
					$.ajax({
						url: "/SmallTV/join",
						type: "GET",
						data: {
							roomid: u(c),
							id: a
						},
						cache: !1,
						async: !1,
						timeout: 2500,
						dataType: "JSON",
						success: function(b) {
							q = !1;
							m.append('<p class="item_jstv" id="smallTV' + a + '" style="font-size: 13px" title="' + (new Date).toLocaleTimeString() + '">已参与【' + c + "】小电视抽奖: 等待开奖</p>");
							d.getRewardDelay(a, b.data.dtime);
							k[0] && d.getSmallTVID()
						},
						error: function() {
							q = !1;
							printLog("joinSmallTV出现错误: tempData.isDrawing = " + q);
							setTimeout(function() {
								A.errorNotify(c)
							}, 5E3)
						}
					})
				},
				getReward: function(a) {
					var c = $("#smallTV" + a);
					$.ajax({
						url: "/SmallTV/getReward",
						type: "GET",
						data: {
							id: a
						},
						cache: !1,
						async: !1,
						dataType: "JSON",
						timeout: 2500,
						success: function(b) {
							if (0 === b.code && 0 === b.data.status) {
								var e = b.data.reward.id;
								b = b.data.reward.num;
								c.html(d.clearMsg(c.html()) + '<span style="color:' + (e && 1 == e ? 'darkorange;">小电视抱枕!!!' : 2 == e ? 'skyblue;">蓝白胖次x' + b : 3 == e ? 'gold;">B坷垃x' + b : 4 == e ? 'pink;">' + z + "x" + b : 5 == e ? 'palevioletred;">便当x' + b : 6 == e ? '#888;">银瓜子x' + b : 7 == e ? 'rosybrown;">辣条x' + b : '#888;">没中奖') + "</span>");
								4 == e && $(".gift-item.gift-4").mouseenter();
								r = 0;
								6 > e && A.rewardNotify(e, b)
							} else 0 === b.code && 1 == b.data.status ? (r = 0, c.html(d.clearMsg(c.html()) + "没有参与抽奖")) : 0 === b.code && 2 == b.data.status && (30 < c.val() ? (r = 0, c.html(d.clearMsg(c.html()) + '<span style="cursor: pointer;color:RED">点击查询结果</span>'), c.click(function() {
								c.html(d.clearMsg(c.html()) + "查询结果中");
								d.getReward(a);
								c.unbind()
							})) : (c.val() ? c.val(parseInt(c.val()) + 1) : c.val(1), c.html(d.clearMsg(c.html()) + "正在抽奖中"), setTimeout(function() {
								d.getReward(a)
							}, 2E3)))
						},
						error: function(b, e) {
							"timeout" == e ? (printLog("getReward: 超时,尝试重试"), c.html(d.clearMsg(c.html()) + "正在抽奖中"), setTimeout(function() {
								d.getReward(a)
							}, 2800)) : (r++, console.error("获取抽奖结果错误次数: " + r), 5 < r ? (printLog("getReward: 获取结果失败"), r = 0, c.html(d.clearMsg(c.html()) + '<span style="cursor: pointer;color:RED">点击查询结果</span>'), c.click(function() {
								c.html(d.clearMsg(c.html()) + "查询结果中");
								d.getReward(a);
								c.unbind()
							})) : setTimeout(function() {
								d.getReward(a)
							}, 2E3))
						}
					})
				},
				clearMsg: function(a) {
					return a.replace("等待开奖", "").replace("正在抽奖中", "").replace("查询结果中", "").replace("点击查询结果", "")
				}
			}, v = {
				startLoadingListDelay: function(a) {
					setTimeout(function() {
						v.startLoadingList(a)
					}, 6E3)
				},
				startLoadingList: function(a) {
					t[a] ? v.getSpecialGift(a) : 1E4 >= a ? v.getRoomID(a) : v.getSpecialGift(a)
				},
				getRoomID: function(a) {
					$.ajax({
						url: a,
						type: "GET",
						timeout: 3E3,
						success: function(c) {
							c = c.match(/ROOMID = (\d+)/);
							t[a] = c[1];
							v.getSpecialGift(a)
						},
						error: function() {
							printLog("getRoomID出错")
						}
					})
				},
				getSpecialGift: function(a) {
					var c = u(a);
					$.ajax({
						url: "/SpecialGift/room/" + c,
						type: "GET",
						cache: !1,
						dataType: "JSON",
						timeout: 3E3,
						success: function(b) {
							b && 0 === b.code && (b.data && !$.isEmptyObject(b.data[39]) && b.data[39].content && v.joinStorm(a, b.data[39].content), b.data && !$.isEmptyObject(b.data[39]) && 1 === b.data[39].hadJoin && console.log("数据显示你已经在别处了参与节奏风暴 :D"))
						},
						error: function() {
							console.error("getSpecialGift-节奏风暴网络请求异常!")
						}
					})
				},
				joinStorm: function(a, c) {
					$.ajax({
						url: "/msg/send",
						type: "POST",
						data: {
							color: 16777215,
							fontsize: 25,
							mode: 1,
							msg: c,
							roomid: u(a)
						},
						cache: !1,
						timeout: 3E3,
						dataType: "JSON",
						success: function(b) {
							0 === b.code && b.data.tips && 39 === b.data.tips.gift_id && (b.data.tips.content.indexOf("获得一个") ? (m.append('<p class="item_jstv" style="font-size:13px" title="' + (new Date).toLocaleTimeString() + '">节奏风暴:【' + a + "】抢到一个亿圆</p>"), $('#P_aud').html('<embed type="audio/mpeg" src="http://localhost/mymy/18.mp3" autostart=true loop=false hidden=ture volume="20" starttime="00:00" width=0 height=0></embed>')) : m.append('<p class="item_jstv" style="font-size:13px" title="' + (new Date).toLocaleTimeString() + '">节奏风暴:没有抢到_(:зゝ∠)_</p>'));

						},
						error: function() {
							console.error("joinStorm-节奏风暴网络请求异常!")
						}
					})
				}
			}, F = !1,
			p = [],
			C = 0,
			l = 0,
			D = 0,
			f = {
				startLoadingList: function(a) {
					t[a] ? (p.push(a), f.getSkID()) : 1E4 >= a ? f.getRoomID(a) : (p.push(a), f.getSkID())
				},
				getRoomID: function(a) {
					$.ajax({
						url: a,
						type: "GET",
						timeout: 8E3,
						async: !1,
						success: function(c) {
							c = c.match(/ROOMID = (\d+)/);
							t[a] = c[1];
							p.push(a);
							f.getSkID();
							C = 0
						},
						error: function() {
							C++;
							console.error("获取房间号错误次数: " + C);
							5 < C ? C = 0 : setTimeout(function() {
								f.getRoomID(a)
							}, 1E3 * C + 1E3)
						}
					})
				},
				getSkID: function() {
					if (!F && 0 < p.length) {
						F = !0;
						var a = p[0],
							c = {
								roomid: u(a)
							};
						$.ajax({
							url: "/eventRoom/check",
							type: "GET",
							data: c,
							cache: !1,
							timeout: 2500,
							async: !1,
							dataType: "JSON",
							success: function(b) {
								b.data && b.data.length && b.data[0] && !$.isEmptyObject(b.data[0]) && !b.data[0].status ? (l = 0, f.joinSk(b.data[0].raffleId, a, b.data[0].time), p.splice(0, 1), f.getSkID()) : (F = !1, l++, console.error("获取skID错误次数: " + l), 5 < l ? (l = 0, p.splice(0, 1), f.getSkID()) : setTimeout(function() {
									f.getSkID()
								}, 800 * l + 500))
							},
							error: function() {
								F = !1;
								l++;
								console.error("获取skID错误次数: " + l);
								5 < l ? (l = 0, p.splice(0, 1), f.getSkID()) : setTimeout(function() {
									f.getSkID()
								}, 800 * l + 500)
							}
						})
					}
				},
				joinSk: function(a, c, b) {
					$.ajax({
						url: "/eventRoom/join",
						type: "POST",
						data: {
							roomid: u(c),
							raffleId: a
						},
						cache: !1,
						dataType: "JSON",
						success: function(e) {
							0 === e.code && m.append('<p class="item_jstv" id="skDraw' + a + '" style="font-size: 13px" title="' + (new Date).toLocaleTimeString() + '">已参与【' + c + "】深空远征: 等待开奖</p>");
							setTimeout(function() {
								f.getReward(a, u(c))
							}, 1E3 * b + 3E4);
							F = !1;
							setTimeout(function() {
								p[0] && f.getSkID()
							}, 1E3)
						},
						error: function() {
							printLog("深空远征-joinSk失败")
						}
					})
				},
				getReward: function(a, c) {
					var b = $("#skDraw" + a);
					$.ajax({
						url: "/eventRoom/notice",
						type: "GET",
						data: {
							raffleId: a,
							roomid: c
						},
						cache: !1,
						dataType: "JSON",
						timeout: 2500,
						success: function(e) {
							if (0 === e.code) {
								var d = "获取成功" == e.msg ? e.data.giftName : "未中奖";
								e = e.data.giftNum ? "x" + e.data.giftNum : "";
								b.html(f.clearMsg(b.html()) + '<span style="color:#123471;">' + d + e + "</span>");
								D = 0
							} else 30 < b.val() ? (D = 0, b.html(f.clearMsg(b.html()) + '<span style="cursor: pointer;color:RED">点击查询结果</span>'), b.click(function() {
								b.html(f.clearMsg(b.html()) + "查询结果中");
								f.getReward(a, c);
								b.unbind()
							})) : (b.val() ? b.val(parseInt(b.val()) + 1) : b.val(1), b.html(f.clearMsg(b.html()) + "正在抽奖中"), setTimeout(function() {
								f.getReward(a, c)
							}, 2E3))
						},
						error: function(e, d) {
							"timeout" == d ? (b.html(f.clearMsg(b.html()) + "正在抽奖中"), setTimeout(function() {
								f.getReward(a, c)
							}, 2800)) : (D++, console.error("获取结果错误次数: " + D), 5 < D ? (D = 0, b.html(f.clearMsg(b.html()) + '<span style="cursor: pointer;color:RED">点击查询结果</span>'), b.click(function() {
								b.html(f.clearMsg(b.html()) + "查询结果中");
								f.getReward(a, c);
								b.unbind()
							})) : setTimeout(function() {
								f.getReward(a, c)
							}, 2E3))
						}
					})
				},
				clearMsg: function(a) {
					return a.replace("等待开奖", "").replace("正在抽奖中", "").replace("查询结果中", "").replace("点击查询结果", "")
				}
			};
		(function() {
			$(document).ready(function() {
				//if (5269 == window.ROOMID || 143036 == window.ROOMID || 36979 == window.ROOMID || 11899 == window.ROOMID || 95366 == window.ROOMID) {
					E = $("#chat-list-ctnr");
					x = $("#profile-ctrl");
					m = $('<div id="box_jstv"></div>');
					n = $('<a href="javascript: void(0)" title="隐藏列表开关" class="profile-ctrl-item" id="switchTV"><i class="live-icon" style=" background-position: -20px -20px; margin: 0 0 1px 6px;"></i></a>');
					y = $('<a href="javascript: void(0)" title="隐藏所有UI" class="profile-ctrl-item" id="switchUI"><i class="live-icon" style=" background-position: 0 -20px; margin: 0 0 1px 6px;"></i></a>');
					$(".anchor-avatar").append('<div class="avatar-msg-panel live-hover-panel arrow-top"><span></span></div>');
					addStyle(".head-info-panel .avatar-msg-panel {left: 107px;color: " + (95366 == window.ROOMID ? "#555;" : "#FFF;") + "background: " + (95366 == window.ROOMID ? "#F3ECCC;" : "#444c59;") + "padding: 12px;top: 44px;width: auto;white-space: nowrap;}.avatar-msg-panel.arrow-top:before {top: 10px;border-right-color: " + (95366 == window.ROOMID ? "#F3ECCC;" : "#444c59;") + 'border-top-color: transparent;border-bottom-color: transparent;}.avatar-msg-panel:before {margin: 0;content: "";display: block;width: 0;height: 0;border-width: 10px 10px 10px 0;border-style: solid;position: absolute;left: -10px;}');
					95366 == window.ROOMID ? ($(".gift-item.gift-4").attr({
						"data-title": "滚滚",
						"data-desc": "滚来滚去…~(～o￣▽￣)～o .。滚来滚去…o～(＿△＿o～) ~。."
					}), z = "滚滚", addStyle('.hiddenList { display: none }.switchUI {outline:4096px solid #FFF;z-index:2333}.supergift-4 > img.gift-step-1 {box-sizing: border-box; border-width: 30px; border-color: rgba(0, 0, 0, 0); background-origin: border-box; background-image: url("http://i1.hdslb.com/bfs/face/8f15685dd59cbd2445475a84a7f77008b431c25f.jpg.jpg_60x60.jpg"); }.gift-info-panel .gift-img.gift-4, #gift-send-panel .gift-img.gift-4, .gift-img.gift-4, .gift-item.gift-4 {background-image: url("http://i1.hdslb.com/bfs/face/8f15685dd59cbd2445475a84a7f77008b431c25f.jpg_60x60.jpg")}')) : $.ajax({
						url: 11899,
						type: "GET",
						success: function(a) {
							a = a.match(/itemprop=\"image\" content=\"(.+)\"\/?>/);
							a[1] && (z = "沐沐喵", $(".gift-item.gift-4").attr({
								"data-title": "沐沐喵",
								"data-desc": G[Math.floor(Math.random() * G.length)].replace("#user", window.UNAME ? window.UNAME : "Hi")
							}), setInterval(function() {
								var a = G[Math.floor(Math.random() * G.length)].replace("#user", window.UNAME ? window.UNAME : "Hi");
								11899 == window.ROOMID && w(a);
								$(".gift-item.gift-4").attr({
									"data-title": "沐沐喵",
									"data-desc": a
								})
							}, 4E4), addStyle('.hiddenList { display: none }.switchUI {outline:4096px solid #FFF;z-index:2333}.supergift-4 > img.gift-step-1 {box-sizing: border-box; border-width: 30px; border-color: rgba(0, 0, 0, 0); background-origin: border-box; background-image: url("' + a[1] + '_60x60.jpg"); }.gift-info-panel .gift-img.gift-4, #gift-send-panel .gift-img.gift-4, .gift-img.gift-4, .gift-item.gift-4 {background-image: url("' + a[1] + '_60x60.jpg")}'))
						}
					});
					var a = /【(\d+)】赠送 小/,
						c = /【(\d+)】抽到 大/,
						b = /【(\d+)】.+大家/,//b = /【(\d+)】.+风暴/,
						e = "";
					E.bind("DOMNodeInserted", function(g) {
						g = g.target;
						if ($(g).find("div").first().hasClass("chat-msg"))
							if ($(g).find(".square-icon").hasClass("admin"))(e = $(g).find(".msg-content").text().match(/sk ?(\w+)/)) && 95366 === window.ROOMID && f.startLoadingList(e[1]);
							else return;
							(e = g.innerText.match(a)) ? (printLog("小电视:" + e[1]), e[1] && d.startLoadingListDelay(e[1])) : (e = g.innerText.match(c)) || ((e = g.innerText.match(b)) ? (printLog("节奏风暴:" + e[1]), e[1] && v.startLoadingListDelay(e[1])) : $(g).find("div").first().hasClass("gift-msg") && (printLog("礼物信息"), 11899 != window.ROOMID && 95366 != window.ROOMID || w("感谢 " + $(g).find(".user-name").first().html() + " 赠送的" + $(g).find(".gift-count").first().html().replace("X ", "") + $(g).find(".action").first().html().replace("喂食", "根").replace("赠送", "个").replace("喵娘", z)), $(g).html($(g).html().replace("赠送喵娘", "赠送" + z))))
					});
					printLog("监听评论消息中");
					x.find("a:nth-child(3)").after(n);
					x.find("a:nth-child(4)").after(y);
					x.append(m);
					m.append('<p class="item_jstv" style="font-size:13px;color:DIMGRAY;">自动抽奖模式已启动(v1.8.5)   <span style="font-size:12px;color:DARKGRAY;">' + (new Date).toLocaleTimeString() + "</span></p>");
					n.attr("title", "隐藏列表开关");
					n.click(function() {
						"show" != n.val() && n.val() ? "hide" == n.val() && (n.val("show"), m.removeClass("hiddenList")) : (n.val("hide"), m.addClass("hiddenList"))
					});
					y.click(function() {
						"hide" != y.val() ? (y.val("hide"), $(".room-main-ctnr").css("z-index", 2332), x.addClass("switchUI")) : (y.val("show"), $(".room-main-ctnr").css("z-index", ""), x.removeClass("switchUI"))
					});
					if (! ($('#P_aud').length)) {
						$('body').after('<div id="P_aud" style="width:1;height:1;display:block;"></div>');
					}
				//} else //alert("只能在5269,143036,36979,11899,95366直播间使用该辅助脚本.")
			});
			Notification && "granted" !== Notification.permission && Notification.requestPermission()
		})();
		window.needLog = !1;
		window.Zprogress = d;
		window.Znotify = A
	}
})();