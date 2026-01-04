// ==UserScript==
// @name		PinCount
// @namespace	http://tampermonkey.net/
// @version		0.1.1
// @description	Check pin counts/tried on Pinterest
// @author		PassiveDot
// @license		MIT
// @include		https://www.pinterest.com/*
// @grant		unsafeWindow
// @grant		GM_xmlhttpRequest
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/34864/PinCount.user.js
// @updateURL https://update.greasyfork.org/scripts/34864/PinCount.meta.js
// ==/UserScript==

$(function() {
	'use strict';
	var url,btn,tried,saved;
	function main(){
		//Add button
		$('.SaveButton').parent().parent().prepend('<div id="PinCount" class="SaveButtonBackground" style="padding-left: 8px;padding-right: 8px;margin-right: 5px;width: 100%;font-size: 14px;color: #fff;font-weight: bold;text-align: center;line-height: 36px;cursor: pointer;">PinCount</div>');
		//Get data
		$('#PinCount').on('click', function() {
			url = document.location.href;
			GM_xmlhttpRequest({
				method: 'GET',
				url: url+"activity/saved/",
				onload: function (response) {
					var pagesource = response.responseText;
					var m1 = pagesource.match(/"done":\s(\d+)/);
					var m2 = pagesource.match(/"saves":\s(\d+)/);
					if (m1 && m2){
						tried = m1[1];console.log(tried);
						saved = m2[1];console.log(saved);
						$('#PinCount').text(tried+' tried, '+saved+' saved');
					}
				}
			});
		});
	}
	main();
	$(document.body).arrive(".reactCloseupScrollContainer", {existing:true}, function() {
		if($('#PinCount').length === 0){main();}
	});
});