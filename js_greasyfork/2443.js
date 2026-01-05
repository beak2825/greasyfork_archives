// ==UserScript==
// @author          iMan
// @name            iShout MOD
// @namespace       iShout for e-Iran MOD
// @description     Mass Shout in erepublik for e-Iran MOD
// @version         1.0.0
// @match           http://www.erepublik.com/en
// @match           https://www.erepublik.com/en
// @match           http://www.erepublik.com/fa
// @match           https://www.erepublik.com/fa
// @include         http://www.erepublik.com/en
// @include         https://www.erepublik.com/en
// @include         http://www.erepublik.com/fa
// @include         https://www.erepublik.com/fa
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2443/iShout%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/2443/iShout%20MOD.meta.js
// ==/UserScript==

var LANG = typeof unsafeWindow.erepublik.settings.culture == "undefined" ? unsafeWindow.culture : unsafeWindow.erepublik.settings.culture;
var temp = $(".user_name").attr("href").split("/");
var citizenID = temp[temp.length-1];

function shout(){
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://iran.erep.ir/MOD/ishoutmessage.php?UID="+citizenID,
		dataType: "html",
		onload: function (e) {
			var data = e.responseText;
			var strength = parseInt($(data).find(".citizen_military").eq(0).find(".stat small strong").text().split("/")[0].trim().replace(",", ""));
			var rank = img_rank[$(data).find(".citizen_military").eq(1).find("h4 img").attr("src").split("/")[6].split(".")[0]];
			var s = Math.round(10 * (1 + strength / 400) * (1 + rank / 5) * (1 + 200 / 100));
			shoutend(s,unsafeWindow.SERVER_DATA.csrfToken);
		}
	})
}
function shoutend(mes,tok){
	var name = $(".user_name").text();
	GM_xmlhttpRequest({
		method: "POST",
		url: "http://www.erepublik.com/en/main/wall-post/create/",
        data: "post_message="+mes+"&_token="+tok,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },        
		onload: function (e) {
			var data = e.responseText;
			$("#iShout1").text("Ready");
			var currentTime = new Date().getTime();
			GM_setValue("iShoutReport",currentTime.toString());
			wait();
		}
	})	
}


function wait(){
	var timerSet = parseInt(GM_getValue("iShoutReport"));
	var nowTime = new Date();
	var diff = nowTime.getTime() - timerSet;
	if(diff <= 600000){		
		diff = Math.floor((600000 - diff)/1000);
		$("#iShout1").text("(شات شده) ("+diff+")");
		setTimeout(wait,1000);
	}
	else{
		reset();
	}
}

function reset(){
	$("#iShout1").removeAttr("disabled");
	$("#iShout1").text("ارسال شات");
}

var version = "0.0.1";

$(document).ready(function () {
	$(".user_identity").after('<div class="user_identity" style="text-align:center; margin:0;"><button id="iShout1">ارسال شات</button></div>');
	$("#iShout1").attr("disabled","disabled");
	$("#iShout1").click(function(){
		$(this).attr("disabled","disabled");
		$(this).text("لطفاً صبر کنید");
		shout();        
	});
	e = GM_getValue("iShoutReport");
	if(typeof e != "undefined"){
		$("#iShout1").text("Ready");
		wait();
	}
	else{
		$("#iShout1").removeAttr("disabled");
	}
})