// ==UserScript==
// @name        "Atcoder" Finder
// @description ツイート内の"Atcoder"の文字列を赤色にします("AtCoder"など、大文字小文字が違っているものには変化はありません)
// @version     1.0
// @author      euglenese
// @match       https://twitter.com/*

// @namespace https://greasyfork.org/users/201019
// @downloadURL https://update.greasyfork.org/scripts/373742/%22Atcoder%22%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/373742/%22Atcoder%22%20Finder.meta.js
// ==/UserScript==


var count = 0;
var tweets = $(".tweet-text").each(function(){
	var txt = $(this).html().toString();
	var ans = "";
	for(var j = 0; j < txt.length; j++){
		if(j + 7 <= txt.length && txt.substr(j, 7) == "Atcoder"){
			ans += "<red style='color: red;'>Atcoder</red>";
			j += 6;
			count++;
		}else{
			ans += txt[j];
		}
	}
	$(this).html(ans);
});