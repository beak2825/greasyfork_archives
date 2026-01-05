// ==UserScript==
// @name		WRMdoc Message
// @namespace	WRMdocmessage
// @description	WRMdoc Message is for WRMdoc sellers only. It is creating nice signature when sending donation log to buyer.
// @include		http://www.erepublik.com/*/main/messages-inbox
// @version		3.1
// @downloadURL https://update.greasyfork.org/scripts/1291/WRMdoc%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/1291/WRMdoc%20Message.meta.js
// ==/UserScript==

function GM_wait() {
	if (typeof unsafeWindow.jQuery == 'undefined') {
		window.setTimeout(GM_wait, 100);
	} else {
		$ = unsafeWindow.jQuery;
        letsJQuery();
	}
}

GM_wait();

function letsJQuery() {
	GM_addStyle("#InsertMessage {-moz-box-shadow:inset 0px 1px 0px 0px#ffffff;-webkit-box-shadow:inset 0px 1px 0px 0px#ffffff;box-shadow:inset 0px 1px 0px 0px#ffffff;background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#ededed),color-stop(1,#dfdfdf));background:-moz-linear-gradient(center top,#ededed 5%,#dfdfdf 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ededed',endColorstr='#dfdfdf');background-color:#ededed;-webkit-border-top-left-radius:6px;-moz-border-radius-topleft:6px;border-top-left-radius:6px;-webkit-border-top-right-radius:6px;-moz-border-radius-topright:6px;border-top-right-radius:6px;-webkit-border-bottom-right-radius:6px;-moz-border-radius-bottomright:6px;border-bottom-right-radius:6px;-webkit-border-bottom-left-radius:6px;-moz-border-radius-bottomleft:6px;border-bottom-left-radius:6px;text-indent:0;border:1px solid#dcdcdc;display:inline-block;color:#777777;font-family:Trebuchet MS;font-size:15px;font-weight:bold;font-style:normal;height:35px;line-height:35px;width:120px;position: relative;text-decoration:none;text-align:center;}");
	GM_addStyle("#InsertMessage:hover {background:-webkit-gradient(linear,left top,left bottom,color-stop(0.05,#dfdfdf),color-stop(1,#ededed));background:-moz-linear-gradient(center top,#dfdfdf 5%,#ededed 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#dfdfdf',endColorstr='#ededed');background-color:#dfdfdf;}");
	GM_addStyle("#InsertMessage:active {position:relative;top:1px;}");
	$("DIV.sidebar_container").after('<center><input type="button" id="InsertMessage"  style="position:relative;top:10px;" value=" Insert message "></center>');
	$('input#InsertMessage').click(function() {
		$("TEXTAREA#citizen_message.textarea.padded").val('o/ ' + $("DIV.nameholder:last a:first").text() + ',\n\n❝  ❞\n\nThanks for buying from us!\n\n' + $(".user_name").text().trim() + '\n\nWRMdoc™ ★ http://bit.ly/WRMdocTM');
	});
}