// ==UserScript==
// @name        Komica_video2_block
// @description 屏蔽特定的內文、回應、影片、圖片
// @author      f1238762001
// @include     *touhonoob.mymoe.moe/video2/*
// @include			*sora.komica.org/69/*
// @include			*phone.mymoe.moe/pda/*
// @version     1.4
// @run-at		document-end
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/24558/Komica_video2_block.user.js
// @updateURL https://update.greasyfork.org/scripts/24558/Komica_video2_block.meta.js
// ==/UserScript==

(function () {
	// 功能開關
	var clear_ThaiSymbol = true;
	var clear_TargetString = true;
	var hide_TargetIP = true;
	var hide_TripID = false;
	//消除泰文
	if (clear_ThaiSymbol) {
		var quote_content = document.getElementsByClassName("quote");
		for (var q in quote_content) {
			if (quote_content[q].innerHTML.match(/[\u0e00-\u0e7f]/)) {
				quote_content[q].innerHTML = quote_content[q].innerHTML.replace(/[\u0e00-\u0e7f]/g, "");
			}
			if (q == quote_content.length - 1) {
				break;
			}
		}
	}
	//消除特定文字
	//要過濾的文字放這 ex:["gginin","ggsuperinin"]
	if (clear_TargetString) {
		var target_string = [""];
		if (target_string[0] != "") {
			for (var q in quote_content) {
				for (var t in target_string) {
					if (quote_content[q].innerHTML.match(target_string[t]) != null) {
						quote_content[q].innerHTML = quote_content[q].innerHTML.replace(target_string[t], "");
					}
				}
				if (q == quote_content.length - 1) {
					break;
				}
			}
		}
	}
	//消除特定ip發言
	if (hide_TargetIP) {
		var ip = document.getElementsByClassName("mod_showip");
		//要消除發言的IP放這 ex:["192.168.*.*","192.169.*.*"]
		var target = ["116.241.*.*", "114-39-*.dynamic.hinet.net", "114-24-*.dynamic.hinet.net", "61-63-*.tbcnet.net.tw", 
					"122-118-*.dynamic.hinet.net", "218-161-*.hinet-ip.hinet.net", "180-177-*.kbronet.com.tw", "218.191.*.*", 
					"175.143.*.*", "*.hyogo.ocn.ne.jp", "*.shawcable.net", "112.166.*.*", "14.39.*.*", "118.70.*.*", "1.52.*.*", "*.rcn.com",
					"1.232.*.*", "123.0.*.*", "22.166.*.dion.ne.jp", "126.169.*.bbtec.net", "123-192-*.kbronet.com.tw"];
		for (let i in ip) {
			for (let j in target) {
				if (ip[i].getAttribute("title") == target[j] && target[0] != null) {
					// 封鎖發言(包含影片、回應)
					let post_contain = ip[i].parentNode.parentNode.parentNode.getElementsByClassName("quote")[0];
					if(post_contain != null){
						post_contain.innerHTML = "";
					}
					// 封鎖附圖
					let post_img = ip[i].parentNode.parentNode.parentNode.getElementsByClassName("img_container")[0];
					if(post_img != null){
						post_img.innerHTML = "";
					}
				}
			}
		}
	}
	//消除特定ID發言
	if (hide_TripID) {
		var ID = document.getElementsByClassName("trip_id");
		var target_ID = ["MbX67MtE"];
		for (let i in ID) {
			for (let j in target_ID) {
				if (ID[i].innerHTML.substring(3) == target_ID[j] && target_ID[0] != null) {
					// 封鎖發言(包含影片、回應)
					let post_contain = ID[i].parentNode.parentNode.parentNode.getElementsByClassName("quote")[0];
					if(post_contain != null){
						post_contain.innerHTML = "";
					}
					// 封鎖附圖
					let post_img = ID[i].parentNode.parentNode.parentNode.getElementsByClassName("img_container")[0];
					if(post_img != null){
						post_img.innerHTML = "";
					}
				}
			}
		}
	}

})();
