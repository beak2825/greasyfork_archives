// ==UserScript==
// @name        漫畫補檔 評分一鍵回復
// @author      alphax
// @description 漫畫補檔 評分一鍵回復 評分後直接回覆
// @namespace   alphax@alphax.com
// @version     20170305
// @icon        https://cdn3.iconfinder.com/data/icons/faticons/32/message-01-48.png
// @include     https://www.manhuabudang.com/read.php?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27893/%E6%BC%AB%E7%95%AB%E8%A3%9C%E6%AA%94%20%E8%A9%95%E5%88%86%E4%B8%80%E9%8D%B5%E5%9B%9E%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/27893/%E6%BC%AB%E7%95%AB%E8%A3%9C%E6%AA%94%20%E8%A9%95%E5%88%86%E4%B8%80%E9%8D%B5%E5%9B%9E%E5%BE%A9.meta.js
// ==/UserScript==

// 20170305 增加評分按鈕 PS 尚待處理 評分視窗不能隨按鈕位置定位 只能固定在上面
// 20161009 更新include網址

var tpchref = document.getElementById("showping_tpc");

var TTSicon = document.createElement("div");

TTSicon.innerHTML ='<img id="TTSimg" src="https://cdn3.iconfinder.com/data/icons/faticons/32/message-01-48.png" />'

TTSicon.innerHTML = TTSicon.innerHTML + '<a class="r_score" id="showping_tpc1" href="' + tpchref.href + '" onclick="return sendurl(this,8)" title="评分"><img src="https://cdn3.iconfinder.com/data/icons/faticons/32/user-01-48.png"></a>'

TTSicon.style.position = "fixed";
TTSicon.style.width = "64px";
TTSicon.style.bottom = "1%";
TTSicon.style.right = "5px";
TTSicon.style.zIndex = "10000";
TTSicon.style.padding = "0px";
// TTSicon.style.visibility = "hidden"


document.body.insertBefore(TTSicon, document.body.firstChild);

document.getElementById('TTSimg').addEventListener('click', function(){
  Reply();
});

function Reply(){
	var jstext=document.getElementById("atc_content");

	jstext.value="感謝分享~~";

	document.getElementById("ifpost").checked=true;

    /* 直接提交 */
    operateshowping();
}