// ==UserScript==
// @name         获取189舰队成员
// @namespace    Cutemon
// @version      1.2
// @description  _(¦3」∠)_上船大佬好多啊
// @author       Cutemon
// @match        http://live.bilibili.com/h5/189/guard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37176/%E8%8E%B7%E5%8F%96189%E8%88%B0%E9%98%9F%E6%88%90%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/37176/%E8%8E%B7%E5%8F%96189%E8%88%B0%E9%98%9F%E6%88%90%E5%91%98.meta.js
// ==/UserScript==

(function() {
    $.ajax({
		type: "get",
		url: "//api.live.bilibili.com/guard/topList?roomid=70270&page=1",
		data: {

		},
		success: function(result) {
			var guard = [];
			var guardSort = [];
			for(var i = 0; i < result.data.top3.length; i++) {
				guard.push({username: result.data.top3[i].username, uid: result.data.top3[i].uid});
			}
//						console.log(guard);

			for(var pages = 1; pages <= result.data.info.page; pages++) {
				$.ajax({
					type: "get",
					url: "//api.live.bilibili.com/guard/topList?roomid=70270&page=" + pages,
					data: {

					},
					success: function(result) {
						//						this.guard = [];
						for(var li_page = 0; li_page < result.data.list.length; li_page++) {
							guard.push({username: result.data.list[li_page].username, uid: result.data.list[li_page].uid});
						}
						if(guard.length == result.data.info.num) {
							function compare(property) {
								return function(a, b) {
									var guard1 = a[property];
									var guard2 = b[property];
									return guard1 - guard2;
								}
							}
							guardSort = guard.sort(compare('uid'));
//							console.log(guardSort[0]);
							$(function(){
  								$('body').html('<table border=1><tr><td>昵称</td><td>uid</td></tr>');
  								for(var i = 0; i<guard.length; i++){
//									console.log(guardSort);
									$('table').append('<tr><td>' + guardSort[i].username + '</td><td>' + guardSort[i].uid + '</td></tr>'); 
								}
  								$('table').append('</table>');
							});
							
						}
					}
				});
			}
		}
	});
})();