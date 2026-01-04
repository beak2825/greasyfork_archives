// ==UserScript==
// @name		Websta Toolkit
// @namespace	Websta.me
// @version		0.3.0
// @description	Quickly and easily copy the hashtags on websta.me
// @author		PassiveDot
// @license		MIT
// @include		https://websta.me/search/*
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35083/Websta%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/35083/Websta%20Toolkit.meta.js
// ==/UserScript==
window.$=this.$=this.jQuery = jQuery.noConflict(true);

$(function() {
	var i,m,array=[],str,hashtag,post,$eleCopy,ele,text,eleBtn;
	function copy(text) {
		$(document.body).append('<textarea class="copy-text">'+text+'</textarea>');
		$('.copy-text').select();
		document.execCommand('copy');
		$('.copy-text').remove();
	}
	function main() {
		$('input[class="form-control search"]').css('margin-right','200px');
		$('div[id="1"] div[class="input-group input-group-sm"]').append('<span class="input-group-btn" id="copy-btn-people"><button class="btn btn-flat btn-primary" type="submit">COPY</button></span>');
		$('div[id="2"] div[class="input-group input-group-sm"]').append('<span class="input-group-btn" id="copy-btn-tags"><button class="btn btn-flat btn-primary" type="submit">COPY</button></span>');
		$('div[id="3"] div[class="input-group input-group-sm"]').append('<span class="input-group-btn" id="copy-btn-places"><button class="btn btn-flat btn-primary" type="submit">COPY</button></span>');
		$('#copy-btn-tags').on('click', function(e) {
			e.preventDefault();
			$eleCopy = $('a[href*="/tag/"]');
			if ($eleCopy.length>0){
				for(i=0; i<$eleCopy.length; i++) {
					ele = $eleCopy[i];
					text = ele.innerText;
					m = text.match(/(#.+)\s\((.+)\)/);
					if (m){
						hashtag=m[1];post=m[2];
						array.push(hashtag+'\t'+post+'&#13;&#10;');
					}
				}
			}
			str = array.join('');
			copy(str);
			array.length=0;
		});
		$('#copy-btn-people,#copy-btn-places').on('click', function(e) {
			e.preventDefault();
			eleBtn = e.target.parentNode;
			if(eleBtn.id === 'copy-btn-people'){
				$eleCopy = $('strong[class="user-username"] a[href*="/n/"]');
			}
			else if(eleBtn.id === 'copy-btn-places'){
				$eleCopy = $('a[href*="/location/"]');
			}
			if ($eleCopy.length>0){
				for(i=0; i<$eleCopy.length; i++) {
					ele = $eleCopy[i];
					text = ele.innerText;
					array.push(text+'&#13;&#10;');
				}
			}
			str = array.join('');
			copy(str);
			array.length=0;
		});
	}
	main();
});