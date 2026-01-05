// ==UserScript==
// @name        twitterRtAsNew
// @namespace   twitter
// @include     https://twitter.com/*
// @version     1.00
// @require		http://code.jquery.com/jquery-1.11.0.min.js
// @grant       none
// @description This script add a new button with name Rt New bottom of the tweet and you can ReTweet clicked tweet as your own tweet or you can edit tweet like quote. (Turkish) Script temelde twitterda ilgili tweet'in altına bir adet Rt New butonu eklemekte. Bu buton sayesinde ilgili tweet'e tıkladığınızda otomatik olarak tweeti kendi tweetiniz gibi paylaşabilir, dilerseniz twiti düzenleyebilirsiniz.
// @downloadURL https://update.greasyfork.org/scripts/1809/twitterRtAsNew.user.js
// @updateURL https://update.greasyfork.org/scripts/1809/twitterRtAsNew.meta.js
// ==/UserScript==
$('.tweet-actions-sidebar').append('<li><a class="alertMeID">Rt New</a></li>');
$('.alertMeID').click(function(e){
	var root = $(this).parents('div')[2].innerHTML; var das = $(root).find('.tweet-text')[0].textContent;
	if($('#tweet-box-mini-home-profile').length==0){
		$('#global-new-tweet-button').trigger('click');
		$('#tweet-box-global').text(das);
	} else {
		$('.home-tweet-box form').trigger('uiTweetBoxExpand');
		$('#tweet-box-mini-home-profile').text(das);
	}
});