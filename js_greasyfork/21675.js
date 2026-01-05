// ==UserScript==
// @name        Fausa
// @namespace   fausa
// @description Parse images from popular nudes galleries
// @include     http://www.girlstop.info/psto.php?id*
// @include		http://xuk.net/erotic/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21675/Fausa.user.js
// @updateURL https://update.greasyfork.org/scripts/21675/Fausa.meta.js
// ==/UserScript==


var pagePictures = [];
var parser = document.createElement('a');
parser.href = window.location.href;
if(parser.hostname == 'xuk.net'){
	parseXuk();
}
else if(parser.hostname == 'www.girlstop.info'){
	parseGirlstop();
}
else {
	return null;
}


$('#fausa').append('<p><a href="#" id="usrscipt_picture_list">Показать список изображений</a></p>');
$('#usrscipt_picture_list').click(function (){
	$('#fausa').append('<div id="picture_list"></div>');
	for (picture in pagePictures){
		$('#picture_list').append(pagePictures[picture]+'<br>');
	}
});

function parseXuk(){
	var re = /thumb/gi;
	for(item in $('.photo-item').find('img').attr('src')){
		checkimage = $('.photo-item').eq(item).find('img').attr('src');
		if(typeof checkimage  !== 'undefined'){
			image = $('.photo-item').eq(item).find('img').attr('src');
			newimage = image.replace(re, 'origin');
			pagePictures.push(newimage);
		}
	}
	$('.gallery').prepend('<div id="fausa"><div class="gallery-header"><span class="content-header">Fausa</span></div></div>');
}



function parseGirlstop(){
	var siteUrl = 'http://www.girlstop.info';
	for(item in $('.fullimg').attr('href')){
		pagePictures.push(siteUrl+$('.fullimg').eq(item).attr('href'));
	}
	$('#main_body_psto').prepend('<div id="fausa"><h1>Fausa</h1></div>');
}