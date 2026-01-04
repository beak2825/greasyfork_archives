// ==UserScript==
// @name		SunFrog Date Uploaded
// @namespace	http://tampermonkey.net/
// @version		0.1.0
// @description	Auto show the SKU and date uploaded on SunFrog
// @author		PassiveDot
// @license		MIT
// @include		https://www.sunfrog.com/*
// @include		https://www.sunfrog.com/*.html
// @exclude		https://www.sunfrog.com/Contact*
// @exclude		https://www.sunfrog.com/size*
// @exclude		https://www.sunfrog.com/Wholesale*
// @exclude		https://www.sunfrog.com/legal*
// @exclude		https://www.sunfrog.com/Careers*
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/35432/SunFrog%20Date%20Uploaded.user.js
// @updateURL https://update.greasyfork.org/scripts/35432/SunFrog%20Date%20Uploaded.meta.js
// ==/UserScript==
window.$=this.$=this.jQuery = jQuery.noConflict(true);

$(function() {
	'use strict';
	var i,m,title,date,sku,selected;
	$('.container').arrive('img[data-src*="/images.sunfrogshirts.com/"]', {existing:true}, function() {
		var $img=$(this);
		m=$img.attr('data-src').match(/.+com\/([\d/]+)\//);
		if(m!==null){
			date=m[1];
		}else{date='N/A';}
		var $anchor=$img.closest('a');
		if($anchor.length>0){
			m=$anchor.attr('href').match(/\-(\d+)/);
			if(m!==null){
				sku=m[1];
			}else{sku='N/A';}
		}
		var $div=$img.closest('.frameitWrapper'), $prepend=$div.find('div[class="text-center text-info title_display"]');
		if ($div.length>0 && $prepend.length===0){
			$div.prepend('<div class="text-center text-info title_display" style="font-weight: 700;"><span class="my-sku">'+sku+'</span><span> | </span><span class="my-date">'+date+'</span></div>');
		}
	});
});