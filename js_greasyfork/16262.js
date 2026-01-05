// ==UserScript==
// @name		ThemeForest full preview
// @namespace	com.frzsombor.userscripts.themeforest
// @description	This script will change the list pages from being less useful Icons into the bigger Preview Image. Along with a few keyboard shortcuts to further speed up browsing. (Based on a userscript by Stuart O'Brien)
// @include		http://themeforest.net/*
// @include		http://*.themeforest.net/*
// @grant		unsafeWindow
// @version		1.1.1
// @downloadURL https://update.greasyfork.org/scripts/16262/ThemeForest%20full%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/16262/ThemeForest%20full%20preview.meta.js
// ==/UserScript==

// Temporary disabled
// @include		http://graphicriver.net/*
// @include		http://*.graphicriver.net/*
// @include		http://activeden.net/*
// @include		http://*.activeden.net/*
// @include		http://videohive.net/*
// @include		http://*.videohive.net/*
// @include		http://3docean.net/*
// @include		http://*.3docean.net/*
// @include		http://marketplace.tutplus.com/*
// @include		http://codecanyon.net/*
// @include		http://*.codecanyon.net/*
// @include		http://photodune.net/*
// @include		http://*.photodune.net/*

var $ = unsafeWindow.jQuery;

jQuery(document).ready(function($) {
	
	// --------------- Themeforest ---------------
	
	//Click to make sure layout grid is always selected
	$('#content').click();
	
	//Enable next and prev keynav
	//$(window).keypress(function(e){

	//	var next = $('.pagination__list .pagination__next');
	//	var prev = $('.pagination__list .pagination__previous');

	//	console.log(e.keyCode);

	//	//Next
	//	if(e.keyCode == 39 || e.keyCode == 0){
	//		next.click();
	//		return false;
	//	}
	//	//Prev
	//	if(e.keyCode == 37){
	//		prev.click();
	//	}
	//})
    
	document.onkeydown = function(event) {
		if (!event) event = window.event;
		var code = event.keyCode;
		if (event.charCode && code == 0) code = event.charCode;

		var next = $('.pagination__list .pagination__next');
		var prev = $('.pagination__list .pagination__previous');

		switch(code) {
			case 37:
				prev.click();
                event.preventDefault();
				break;
			case 39:
				next.click(); 
                event.preventDefault();
				break;
		}
	};
	
	function update_list(){
		
		//Change the image src to be the bif slab image
		$('.content-l ul.product-list li .item-thumbnail img').each(function(){
			$(this).attr('src', $(this).attr('data-preview-url'));
			$(this).attr('width', '330');
			$(this).removeAttr('height');
			$(this).css('max-width', 'initial');
		});
		
		//Change the image src to be the bif slab image
		$('.content-l ul.product-list li .product-list__adjacent-thumbnail').each(function(){
            var $newTitle = $(this).clone();
            $newTitle.css('float', 'none');
            $newTitle.css('width', '100%');
			$(this).closest('.product-list__columns-container').find('.product-list__column-category').prepend($newTitle);
            $(this).remove();
		});
		
		//Change the url of the link to go straight to the preview
		//$('.content-l ul li .item-thumbnail a').each(function(){
		//	
		//	var preview_url = $(this).attr('href');
		//	
		//	//remove all the querysting stuff
		//	preview_url = preview_url.split("?");
		//	preview_url = preview_url[0];
		//	//insert full_screen_preview into the string
		//	preview_url = preview_url.substring(0,preview_url.lastIndexOf("/")) + '/full_screen_preview/' + preview_url.substring(preview_url.lastIndexOf("/")+1, preview_url.length )  ;
		//	//console.log( preview_url );
		//	
		//	$(this).attr('href', preview_url)
		//})
		
		//Remove the reduntdant preview slab
		//$('#landscape-image-magnifier').remove();
					
		//Apply the css to change the styling of the block
		//$('.content-l ul li .item-thumbnail').css({
		//	'width':'auto',
		//	'height':'auto',
		//	'display':'block'
		//})
		//$('.content-l ul li').css({
		//	'width':'auto',
		//	'height':'auto',
		//	'float':'none'
		//})			
		//$('.content-l ul li h3 a').css({
		//	'width':'auto',
		//	'height':'auto',
		//	'float':'none'
		//})			
		//$('.content-l ul li .sale-info').css({
		//	'width':'auto',
		//	'height':'auto',
		//	'float':'none',
		//	'display':'block',
		//})			
		//$('.content-l ul li .item-thumbnail img').css({
		//	'width':'auto',
		//	'height':'auto',
		//	'float':'none',
		//	'box-shadow':'0 0 0 1px #DEDEDE, 0 2px 0 rgba(0, 0, 0, 0.02)',
		//	'border':'8px solid white'
		//})
		//$('.content-l ul').css({
		//	'padding-top':62
		//})
		
	}
	
	//execture funtion every time page is updated
	$(document).ajaxComplete(function() {
		update_list();
	});
	
	//once at startup
	update_list();
	
});

