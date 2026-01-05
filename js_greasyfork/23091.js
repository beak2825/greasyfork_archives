// ==UserScript==
// @name aliparser (http and https)
// @namespace Violentmonkey Scripts
// @grant none
// @description:en select producy on aliexpress then post it to vk.com album
// @include *aliexpress.com*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version 0.1.1.20180406
// @description select producy on aliexpress then post it to vk.com album
// @downloadURL https://update.greasyfork.org/scripts/23091/aliparser%20%28http%20and%20https%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23091/aliparser%20%28http%20and%20https%29.meta.js
// ==/UserScript==

setButton();

addEventClick();

setIframe();

function setIframe(){
	// var iframe = '<iframe src="http://wshost.iam.by/" id="iframe"></iframe>';
	//var iframe = '<iframe src="http://tdom.in/www/ali/" id="iframe"></iframe>';
	//var src = 'http://wshost.iam.by/'
	var src = 'https://kramarenko.niro.biz/ali_parser/';
    if(window.parent !== window.self){
        throw new Error('not main window');
    }
	$('<iframe>').css({'width':'100%','height':'410px','z-index':1000}).prependTo('body:eq(0)').attr('src',src).attr('id','iframe');

}
function addEventClick(){

	$('.addButton').click(function(){
		var images = $('.image-nav-item img').length ?
			$('.image-nav-item img') : ($('.img-thumb-item img').length ?
									  $('.img-thumb-item img') : $('.ui-image-viewer-thumb-frame img'));
		var imgs = [];
		for(var i=0;i<images.length;i++){
			imgs[i] = images[i].src.replace('.jpg_50x50','');
		}
		if($(this).attr('data-it')=='1'){
			var object = {
			price: $('[itemprop=highPrice]').text() || $('[itemprop=price]').text(),
			href:location.href,
			image:$('.ui-image-viewer-thumb-wrap img').attr('src'),
			id:$('#hid-product-id').val(),
			images: imgs,
		    };
			object.price += ' '+$('[itemprop=priceCurrency]').text();
		}else{
		var item = $(this).closest('li');
		var object = {
			price:item.find('.info [itemprop=price]').html(),
			href:item.find('a.picRind').attr('href'),
			image:item.find('.picCore').attr('src'),
			id:item.find('.atc-product-id').val(),
			images: imgs
			};
		}
		win = document.getElementById('iframe').contentWindow;
		win.postMessage(object,'*');

	});

}

function setButton(){

	var button = '<input type="button" value="ДОБАВИТЬ" class="addButton">';
	var appendTo ='.product-name';
	//var appendTo = $('.list-item').length?'.list-item':'.product-name'
	//if(!appendTo.length) appendTo = '.list-item'
	//alert(appendTo)
	$(button).css({'position': 'absolute','top':'0px','left':'45px','z-index':'100','background':'#EA7B7B',
				  'padding':'5px 20px','border':'none','margin':'4px'}).appendTo(appendTo).attr('data-it','0');
	if(appendTo=='.product-name')
		$('.addButton').css('position','static').attr('data-it','1');

}