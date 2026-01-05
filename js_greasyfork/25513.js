// ==UserScript==
// @name               dm5.com image list
// @description        Lists all images in a chapter/volume
// @name:zh-TW         DM5 漫畫列表
// @description:zh-TW  列出章節內所有圖片
// @version            1.1.2
// @include            /^https\:\/\/.*?\.dm5\.com\//
// @author             willy_sunny
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/9968
// @downloadURL https://update.greasyfork.org/scripts/25513/dm5com%20image%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/25513/dm5com%20image%20list.meta.js
// ==/UserScript==
//
// ************************
// Own Variable Declaration
// ************************
// imgList: the output result
// 

var imgList="";
var nextChap = "";
try { 
	nextChap = $('.view-btn-next')[0].href;
} catch (e) { 
	nextChap ="#' onClick='alert(\"End of chapter\")";
}
function lp(p, list, count, callback) {
	$.ajax({
		url: 'chapterfun.ashx', 
		data: { 
			cid: DM5_CID, 
			page: p, 
			key: $("#dm5_key").val(), 
			language: 1, 
			gtk: 6, 
			_cid: DM5_CID, 
			_mid: DM5_MID, 
			_dt: DM5_VIEWSIGN_DT, 
			_sign: DM5_VIEWSIGN 
		}, 
		type: 'GET', 
		success: function (data) {
			eval(data);
			if(p>count) {
				callback(list);
			} else {
				document.body.innerHTML = "Loading Page " + p + "/" + count;
				lp(p+1, list+'<img src="' + d[0] + '"><br>', count, callback);
			}
		}
	})
}
imgList=lp(1,"",DM5_IMAGE_COUNT, function(data) {
	document.body.innerHTML = "<center>" + data + "<br><br><a href='" + nextChap + "'>Next &gt;&gt;</a></center>";
});
document.body.style.overflow = 'scroll';