// ==UserScript==
// @name        Fausa LightGallery
// @namespace   fausa LightGallery
// @description Parse images from popular nudes galleries
// @include     http://www.girlstop.info/psto.php?id*
// @include     http://girlstop-extra.info/psto.php?id*
// @include	https://xuk.mobi/erotic/*
// @include	http://xuk.mobi/erotic/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375802/Fausa%20LightGallery.user.js
// @updateURL https://update.greasyfork.org/scripts/375802/Fausa%20LightGallery.meta.js
// ==/UserScript==


var pagePictures = [];
var parser = document.createElement('a');
parser.href = window.location.href;
if(parser.hostname == 'xuk.mobi'){
	parseXuk();
}
else if(parser.hostname == 'www.girlstop.info'){
	parseGirlstop();
}
else if(parser.hostname == 'girlstop-extra.info'){
	parseGirlstop(true);
}
else {
	return null;
}


$('#fausa').append('<p><a href="#" id="usrscipt_picture_list">Показать список изображений</a></p>');
$('#usrscipt_picture_list').click(function (){
	$('#fausa').append('<div id="picture_list"></div>');
	for (picture in pagePictures){
		$('#picture_list').append('<a href="'+pagePictures[picture]+'">'+pagePictures[picture]+'</a><br>');
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



function parseGirlstop(extraClonSite = false){
	if(extraClonSite)
		var siteUrl = 'http://girlstop-extra.info';
	else
		var siteUrl = 'http://www.girlstop.info';
	for(item in $('.fullimg').attr('href')){
		pagePictures.push(siteUrl+$('.fullimg').eq(item).attr('href'));
	}
	$('#main_body_psto').prepend('<div id="fausa"><h1>Fausa</h1></div>');
}