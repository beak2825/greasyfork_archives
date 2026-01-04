// ==UserScript==
// @name         V5ON autojoin
// @namespace    https://greasyfork.org/users/34380
// @version      20180319
// @description  v5on自动参赠
// @match        http://www.v5on.com/
// @match        http://www.v5on.com/query_raffle_by_id/1/*
// @match        http://www.v5on.com/lottery
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/39456/V5ON%20autojoin.user.js
// @updateURL https://update.greasyfork.org/scripts/39456/V5ON%20autojoin.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//.login通过右上角信息，检测是否登录状态。
	if ($(".login").length > 0) {
		const loc = window.location.href;
		const id = loc.match(/query_raffle_by_id\/1\/(\d+)/);
		if (loc == "http://www.v5on.com/") {
			window.open("http://www.v5on.com/lottery");
			let rooms_ignored = GM_getValue("V5ON_rooms_ignored", "") == "" ? [] : GM_getValue("V5ON_rooms_ignored", "").split(",");
			let rooms = [];
			$(".ele_btn.btn_orange.btn_oranges:contains(立即参与)").each(function() {
				const room_id = $(this).attr("data-value");
				const room_seat = $(this).parent().parent().find(".raffleNum").text().split("/");
				const pos = rooms_ignored.indexOf(room_id);
				//人满的强制显示已忽略。
				if (room_seat[0] == room_seat[1] && pos <0) {
					rooms_ignored.push($(this).attr("data-value"));
					GM_setValue("V5ON_rooms_ignored", rooms_ignored.toString());
				}
				if (rooms_ignored.includes(room_id)) {
					$(this).after(`<a class="notin ignored ele_btn btn_orange" data-value="` + room_id + `"><span>已忽略</span></a>`);
				} else {
					$(this).after(`<a class="notin ignore ele_btn btn_orange" data-value="` + room_id + `"><span>点击忽略</span></a>`);
					rooms.push($(this).attr("data-value"));
				}
			});
			$(".tc").on("click", ".notin", function() {
				$(this).toggleClass("ignored ignore");
			});
			$(".tc").on("click", ".ignored", function() {
				const room_id = $(this).attr("data-value");
				const pos = rooms_ignored.indexOf(room_id);
				if( pos > -1 ){
					rooms_ignored.splice(pos, 1);
				}
				GM_setValue("V5ON_rooms_ignored", rooms_ignored.toString());
				$(this).text("点击忽略");
			});
			$(".tc").on("click", ".ignore", function() {
				const room_id = $(this).attr("data-value");
				rooms_ignored.push($(this).attr("data-value"));
				GM_setValue("V5ON_rooms_ignored", rooms_ignored.toString());
				$(this).text("已忽略");
			});
			GM_setValue("V5ON_rooms_notin", rooms.toString());
			$(".raffleNav").after(`<a id="clear-ignored" class="ele_btn btn_orange" style="margin:20px 20px 0px 0px; padding: 0px 20px 0px 20px">清除所有已忽略</a>`);
			$("#clear-ignored").click(function() {
				rooms_ignored = [];
				GM_setValue("V5ON_rooms_ignored", "");
			});

			//添加了"自动参与"按钮，点击才自动参加未参与的所有房间。如不需要删除或注释掉下方1、2、6行$(".raffleNav")、$("#autojoin")、});
			//$(".raffleNav").after(`<a id="autojoin" class="ele_btn btn_orange" style="margin:20px 20px 0px 0px; padding: 0px 20px 0px 20px">自动参与</a>`);
			//$("#autojoin").click(function() {
			if (rooms.length > 0) {
				window.open("http://www.v5on.com/query_raffle_by_id/1/" + rooms[0]);
			}
			//});
		} else if (id != null) {
			let rooms_notin = GM_getValue("V5ON_rooms_notin", "") == "" ? [] : GM_getValue("V5ON_rooms_notin", "").split(",");
			let rooms_ignored = GM_getValue("V5ON_rooms_ignored", "") == "" ? [] : GM_getValue("V5ON_rooms_ignored", "").split(",");
			const pos = rooms_notin.indexOf(id[1]);
			if (pos > -1 && rooms_ignored.includes(id[1]) == false && $(".flags").length > 0) {
				setTimeout(function() {
					$("#namechange").click();
					$("#csgoid").click();
					$("#pubgid").click();
					$("#lotteryid").click();
					setTimeout(function() {
						$("#pickrandom").click();
						//人满导致不断刷新，所以设置点击"选择随机数"就删除记录。
						rooms_notin.splice(pos, 1);
						GM_setValue("V5ON_rooms_notin", rooms_notin.toString());
						setTimeout(function() {
							$("#join_now").click();
							//网站默认点击参加会刷新页面，下方的setTimeout一般不会实现，保留代码以防网站改版不刷新。
							//点击参加后，记录中的房间号已消失，所以网站刷新页面，只会运行下方else if代码（如果记录中还有未参加的房间，会跳转到未参加的房间）。
							setTimeout(function() {
								if (rooms_notin.length > 0) {
									window.location.href = "http://www.v5on.com/query_raffle_by_id/1/" + rooms_notin[0];
								}
							}, 2000);
						}, 2000);
					}, 2000);
				}, 2000);
			} else if (rooms_notin.length > 0) {
				window.location.href = "http://www.v5on.com/query_raffle_by_id/1/" + rooms_notin[0];
			} else {
				window.close();
			}
		} else if (loc == "http://www.v5on.com/lottery") {
			let is_free = $('#V_num:contains(免费)').length;
			openCase();

			function openCase() {
				setTimeout(function() {
					$.ajax({
						'url': '/lottery/get_lottery_num',
						'type': 'POST',
						'data': {
							'is_free': is_free
						},
						success: function(data) {
							is_free = 0;
							if (data.status == 1) {
								var type = data.type;
								if (type == 1) {
									alert("恭喜！中了一个皮肤，快查看背包并取回");
								}
							} else if (data.currency_num >= 10 && data.specific_number != 0) {
								openCase();
							} else {
								window.close();
							}
						}
					});
				}, 2000);
			}
		}
	}
})();