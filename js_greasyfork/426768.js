// ==UserScript==
// @name         youtubeで常にライブ再生
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtubeでライブ配信を再生中、読み込み等で遅れた場合に自動で追いつきます
// @author       You
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426768/youtube%E3%81%A7%E5%B8%B8%E3%81%AB%E3%83%A9%E3%82%A4%E3%83%96%E5%86%8D%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/426768/youtube%E3%81%A7%E5%B8%B8%E3%81%AB%E3%83%A9%E3%82%A4%E3%83%96%E5%86%8D%E7%94%9F.meta.js
// ==/UserScript==


 $(function(){
     var state = $('.ytp-live > button').text();
     $('.ytp-live > button').text(state + "追従中…");
     var mode = true;

	setInterval(function(){
		var flag = $('.ytp-live > button').prop('disabled');
        if(!flag && mode){
            $('.ytp-live > button').trigger("click");
            console.log("[youtube live autoclick] clicked button!!");
            $('.ytp-live > button').text(state + "追従中…")
        }
        if(flag)   $('.ytp-live > button').text(state + "追従中…");
	},3000);

     document.onkeydown = function (e){
        if(e.keyCode == 113){
            mode = !mode;
            if(mode){
                alert("追従を有効化しました");
                $('.ytp-live > button').text(state + "追従中…");
            }
            if(!mode){
                alert(state + "追従を無効にしました");
                $('.ytp-live > button').text(state);
            }
        }
     };
});
