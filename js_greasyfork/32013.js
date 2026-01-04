// ==UserScript==
// @name               YouTube Thumbnail Enlarger
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            1.0
// @description        Hover over YouTube video thumbnails to retrieve their stored zoomed and expanded full quality size of 480x360px 
// @include            https://www.youtube.com/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author             drhouse
// @downloadURL https://update.greasyfork.org/scripts/32013/YouTube%20Thumbnail%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/32013/YouTube%20Thumbnail%20Enlarger.meta.js
// ==/UserScript==

$(document).ready(function () {
	var prevWidth;
	var prevHeight;
	
	$("div.thumb-wrapper").hover(function(e){ //video.. related
		var url = $(this).find("img").attr('src');
		var c = $(this).parent().find('span.title').text();
		var thumb = url.split("?")[0];
		console.log("url: " + url);
		$("body").append("<p id='preview'><img src='"+ thumb +"' alt='Image preview' />"+ c +"</p>");
		$('#preview').css('position','absolute')
			.css('color','white')
			.css('padding','8px')
			.css('font','100% Arial')
			.css('border','1px solid #fff')
			.css('background','#191919')
			.css('z-index','19999999999');
		var $img = $('#preview > img');

		$img.on('load', function(){
			prevWidth = $(this).width();
			prevHeight = $(this).height();
			$('#preview').css('width', prevWidth);
			$('#preview').css('height', prevHeight+30);
		});

		$('#preview').css('width', prevWidth);
		$('#preview').css('word-wrap','break-word');

		var rtx = ($(window).width() - ($( this ).find('img').offset().left + $( this ).find('img').outerWidth()));
		var rty = ($(window).height() - ($( this ).find('img').offset().top + $( this ).find('img').outerHeight()));
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		var viewportWidthCenter = viewportWidth/2;
		var viewportHeightCenter = viewportHeight/2;
		var xOffset;
		var yOffset;

		if (rty >= viewportHeightCenter){
			xOffset = -500;
			yOffset = 30;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		} else {
			xOffset = -500;
			yOffset = $('#preview').height() + 10;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		}
	},
									   function(){
		this.title = this.t;
		$("#preview").remove();
	});

	
	$("div.yt-lockup-thumbnail").hover(function(e){ //user ... videos
		var url = $(this).find("img").attr('src');
		var c = $(this).parent().find('a').text();
		var thumb = url.split("?")[0];
		console.log("url: " + url);
		$("body").append("<p id='preview'><img src='"+ thumb +"' alt='Image preview' />"+ c +"</p>");
		$('#preview').css('position','absolute')
			.css('color','white')
			.css('padding','8px')
			.css('font','100% Arial')
			.css('border','1px solid #fff')
			.css('background','#191919')
			.css('z-index','19999999999');
		var $img = $('#preview > img');

		$img.on('load', function(){
			prevWidth = $(this).width();
			prevHeight = $(this).height();
			$('#preview').css('width', prevWidth);
			$('#preview').css('height', prevHeight+30);
		});

		$('#preview').css('width', prevWidth);
		$('#preview').css('word-wrap','break-word');

		var rtx = ($(window).width() - ($( this ).find('img').offset().left + $( this ).find('img').outerWidth()));
		var rty = ($(window).height() - ($( this ).find('img').offset().top + $( this ).find('img').outerHeight()));
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		var viewportWidthCenter = viewportWidth/2;
		var viewportHeightCenter = viewportHeight/2;
		var xOffset;
		var yOffset;

		if (rty >= viewportHeightCenter){
			xOffset = -500;
			yOffset = 30;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		} else {
			xOffset = -500;
			yOffset = $('#preview').height() + 10;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		}
	},
									   function(){
		this.title = this.t;
		$("#preview").remove();
	});


	$("div.yt-lockup-thumbnail.contains-addto").hover(function(e){ //subscriptions
		var url = $(this).find("a > div > span > img").attr('src');
		var c = $(this).parent().find('div.yt-lockup-content > div.yt-lockup-description.yt-ui-ellipsis.yt-ui-ellipsis-2').text();
		var thumb = url.split("?")[0];
		console.log("url: " + url);
		$("body").append("<p id='preview'><img src='"+ thumb +"' alt='Image preview' />"+ c +"</p>");
		$('#preview').css('position','absolute')
			.css('color','white')
			.css('padding','8px')
			.css('font','80% Arial')
			.css('border','1px solid #fff')
			.css('background','#191919')
			.css('z-index','19999999999');
		var $img = $('#preview > img');

		$img.on('load', function(){
			prevWidth = $(this).width();
			prevHeight = $(this).height();
			$('#preview').css('width', prevWidth);
			$('#preview').css('height', prevHeight+30);
		});

		$('#preview').css('width', prevWidth);
		$('#preview').css('word-wrap','break-word');

		var rtx = ($(window).width() - ($( this ).find('img').offset().left + $( this ).find('img').outerWidth()));
		var rty = ($(window).height() - ($( this ).find('img').offset().top + $( this ).find('img').outerHeight()));
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		var viewportWidthCenter = viewportWidth/2;
		var viewportHeightCenter = viewportHeight/2;
		var xOffset;
		var yOffset;

		if (rty >= viewportHeightCenter){
			xOffset = -500;
			yOffset = 30;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		} else {
			xOffset = -500;
			yOffset = $('#preview').height() + 10;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		}
	},
													  function(){
		this.title = this.t;
		$("#preview").remove();
	});


	
	$("li.yt-uix-scroller-scroll-unit").hover(function(e){ //playlists

		var url = $(this).attr('data-thumbnail-url');
		var c = $(this).attr('data-video-title');
		var thumb = url.split("?")[0];

		$("body").append("<p id='preview'><img src='"+ thumb +"' alt='Image preview' />"+ c +"</p>");
		$('#preview').css('position','absolute')
			.css('color','white')
			.css('padding','8px')
			.css('font','90% Arial')
			.css('border','1px solid #fff')
			.css('background','#191919')
			.css('z-index','999');
		var $img = $('#preview > img');

		$img.on('load', function(){
			prevWidth = $(this).width();
			prevHeight = $(this).height();
			$('#preview').css('width', prevWidth);
			$('#preview').css('height', prevHeight+30);
		});

		$('#preview').css('width', prevWidth);
		$('#preview').css('word-wrap','break-word');

		var rtx = ($(window).width() - ($( this ).find('img').offset().left + $( this ).find('img').outerWidth()));
		var rty = ($(window).height() - ($( this ).find('img').offset().top + $( this ).find('img').outerHeight()));
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();
		var viewportWidthCenter = viewportWidth/2;
		var viewportHeightCenter = viewportHeight/2;
		var xOffset;
		var yOffset;

		if (rty >= viewportHeightCenter){
			xOffset = -500;
			yOffset = 30;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		} else {
			xOffset = -500;
			yOffset = $('#preview').height() + 10;
			$("#preview")
				.css("top",(e.pageY - yOffset) + "px")
				.css("left",(e.pageX + xOffset) + "px")
				.fadeIn("fast");
		}
	},
											  function(){
		this.title = this.t;
		$("#preview").remove();
	});
});
