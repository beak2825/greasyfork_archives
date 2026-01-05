// ==UserScript==
// @name aliparser with partner link (https)
// @namespace Violentmonkey Scripts
// @grant none
// @description:en select producy on aliexpress then post it to vk.com album with partner link
// @include http://*aliexpress.com/*
// @include https://*aliexpress.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version 0.0.1.20160915080900
// @description select producy on aliexpress then post it to vk.com album with partner link
// @downloadURL https://update.greasyfork.org/scripts/23160/aliparser%20with%20partner%20link%20%28https%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23160/aliparser%20with%20partner%20link%20%28https%29.meta.js
// ==/UserScript==

setButton()

addEventClick()

setIframe()

function setIframe(){
	var src = 'https://tdom.in/www/ali2/',
        display = localStorage.getItem('aliparse_visible') == 'true' ?'block':'none';
	$('<iframe>').css({display: display,width:'100%','height':'410px','z-index':99999}).prependTo('body').attr('src',src).attr('id','iframe')

$('<div id="aliparse_wrapper_toggler">ALIPARSER <small>свернуть / развернуть</small></div>	')
  .insertBefore('#iframe').css({
    padding:'10px',
    margin:0,
    color:'#fff',
    background:'#e62e04',
    cursor:'pointer',
  })
  .click(function(){
     $('#iframe').slideToggle('slow', function(){
     localStorage.setItem('aliparse_visible',$('#iframe').is(':visible'));
     })
  });
}
function addEventClick(){
	
	$('.addButton').click(function(){
		var images = $('.image-nav-item img').length ?
			$('.image-nav-item img') : ($('.img-thumb-item img').length ?
									  $('.img-thumb-item img') : $('.ui-image-viewer-thumb-frame img'));
		var imgs = new Array();
		for(var i=0;i<images.length;i++){
			imgs[i] = images[i].src.replace('.jpg_50x50','')
		}
		if($(this).attr('data-it')=='1'){
			var object = {
			price: $('[itemprop=lowPrice]').text() || $('[itemprop=price]').text(),
			href:location.href,
            desc : $('.product-name').text(),
			image:$('.ui-image-viewer-thumb-wrap img').attr('src'),
			id:$('#hid-product-id').val(),
			images: imgs
		    }
			object.price += ' '+$('[itemprop=priceCurrency]').text();
		}else{
		var item = $(this).closest('li')
		var object = {
			price:item.find('.info [itemprop=price]').html(),
			href:item.find('a.picRind').attr('href'),
			image:item.find('.picCore').attr('src'),
			id:item.find('.atc-product-id').val(),
			images: imgs
			}
		}
		win = document.getElementById('iframe').contentWindow
		win.postMessage(object,'*')

	})
	
}

function setButton(){

	var button = '<input type="button" value="добавить" class="addButton">'
	var appendTo ='.product-name'
	//var appendTo = $('.list-item').length?'.list-item':'.product-name'
	//if(!appendTo.length) appendTo = '.list-item'
	//alert(appendTo)
	$(button).css({'position': 'absolute','top':'0px','left':'45px','z-index':'100','background':'#494',
				  'padding':'5px 20px','border':'none','margin':'4px','color':'#fff',borderRadius:'3px', boxShadow:'rgba(100,200,100,.7) 2px 2px 7px'}).appendTo(appendTo).attr('data-it','0')
	if(appendTo=='.product-name')
		$('.addButton').css('position','static').attr('data-it','1')
	
}