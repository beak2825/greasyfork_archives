// ==UserScript==
// @name           4chan Archive Image Expander
// @description    Adds inline image expansion to 4chan archives.
// @author         Hen-Tie
// @homepage       http://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /https?:\/\/(desuarchive\.org|archived\.moe)\/.*\/thread\/.*/
// @include        /https?:\/\/thebarchive\.com\/(b|bant|talk)\/.*/
// @include        /https?:\/\/archive\.4plebs\.org\/.*/
// @grant          none
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require        https://greasyfork.org/scripts/39415-jquery-initialize/code/jQuery%20Initialize.js?version=258071
// @icon           https://i.imgur.com/80UFdoW.png
// @version        1.9
// @downloadURL https://update.greasyfork.org/scripts/34486/4chan%20Archive%20Image%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/34486/4chan%20Archive%20Image%20Expander.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
(function ($) {
	//index all images for modal gallery
	var fullImage = [];
	var thumbnail = [];
	var galleryActivated = 0;

	$("body").append('<modal id="aie"><div id="aie-img-controls">Image Size: <a id="aie-img-native" href="javascript:;">Native</a> | <a id="aie-img-fill" href="javascript:;">Fill</a> | <a id="aie-img-fit" href="javascript:;">Fit</a></div></modal>');

	//gallery mode keypress listener
	$("body").on("keydown", function(e) {
		//g to open
		if (e.which == 71) {
			if (galleryActivated) {
				$('modal').show();
			} else {
				$('modal').show();
				$('a.thread_image_link').each(function() {
					fullImage.push('<img src="' + $(this).attr('href') + '" />');
					thumbnail.push('<img src="' + $(this).children('img').attr('src') + '" />');
				});
				$.each(fullImage, function(i) {
					$("modal").append(fullImage[i]);
				});
				galleryActivated = 1;
			}
		}
		//esc to close
		if (e.which == 27) {
			$('modal').hide();
		}
	});

	//gallery image contorls
	$('#aie-img-native').click(function() {
		//$('modal img').each(function() {
		//	$(this).css({'width':'auto','max-width':'unset'});
		//});
		imgFit(this);
	});
	function imgFit(x) {
		console.log(x);
	}
	$('#aie-img-fill').click(function() {
		$('modal img').each(function() {
			$(this).css({'width':'100%','max-width':'unset'});
		});
	});
	$('#aie-img-fit').click(function() {
		$('modal img').each(function() {
			$(this).css({'width':'unset','max-width':'100%'});
		});
	});

	//catches image load event
	$.initialize('.init', function() {
		$(this).parent().removeClass('spinner');
	});

	//insert download image links
	$('.post_file_filename').each(function() {
		$(this).attr('download',true);
	});

	$('<style type="text/css">.spinner:before{content:"";box-sizing:border-box;position:absolute;top:50%;left:50%;width:20px;height:20px;margin-top:-10px;margin-left:-10px;border-radius:50%;border-top:2px solid #CCC;border-right:2px solid transparent;animation:spinner 0.6s linear infinite}@keyframes spinner{to{transform:rotate(360deg)}}</style>').appendTo('head');
	$('<style type="text/css">#aie-img-controls{width:100%;background:#282a2e;padding:0 1em;line-height:2;position:fixed;}modal img{display:block;margin-top:2em;}modal{display:none;position:fixed;top:0;left:0;overflow:auto;width:100%;height:100%;background:#1d1f21;}</style>').appendTo("head");

	//video settings
	var vidAttr = 'loop autoplay controls';
	var imgCSS = {
		'max-width': '100%',
		'height': 'auto'
	};
	var webmCSS = {
		'max-width': '100%',
		'height': 'auto'
	};
	//indicate webm thumbnail
	$('.post_file_filename[href$=".webm"]').parent().next().find('.post_image').css('border', '3px solid #5f89ac');

	//prevent weird wrapping around expanded images
	$('.theme_default .post header').css('display', 'inline-block');

	$('.thread_image_box a').on('click', function (e) {
		var myHref = $(this).attr('href');
		var myHeight = $(this).children('img').outerHeight();
		var myWidth = $(this).children('img').outerWidth();
		$(this).parent().addClass('spinner').css({
			'min-height': myHeight,
			'min-width': myWidth,
			'position': 'relative'
		});

		//new elements containing full size href as src
		var img = $('<img />').attr({
			'src': myHref,
			'class': 'openItem'
		}).css(imgCSS).load(function(){
			$(this).addClass('init');
		});

		var webm = $('<video style="background-color: #222;" poster="data:image/gif,AAAA" ' + vidAttr + ' id="vid"><source type="video/webm" src="' + myHref + '"/></video>').attr('class', 'openItem').css(webmCSS);
		//check filetype, hide thumbnail, insert full size file
		if (myHref.match(/.gif$|.png$|.jpg$/g)) {
			e.preventDefault();
			$(this).fadeTo('fast', 0, function () {
				$(this).hide();
				$(this).after(img);
			});
		} else if (myHref.match(/.webm$/g)) {
			e.preventDefault();
			$(this).hide();
			$(this).after(webm);
			var vid = document.getElementById("vid");
			//video proven to be loadable, cancel spinner
			vid.ondurationchange = function() {
				$(this).parent().removeClass('spinner');
			};
		} else {
			console.log('"4chan Archive Image Expander"\nUnsupported filetype, please report.\nSee @homepage or @namespace for contact info.');
		}
		//if src is broken insert placeholder, stop infinite spinner
		setTimeout(function(){
			var checkBroken = $('.openItem');
			if (checkBroken.width() === 16 && checkBroken.height() === 16) {
				checkBroken.addClass('init').attr('src','http://via.placeholder.com/'+myWidth + 'x' + myHeight+'/1d1f21/888888?text=ERR.');
				console.log('broken image');
			} else if (checkBroken.is('video')) {
				//if readyState has no metadata
				if (vid.readyState === 0) {
					checkBroken.addClass('init');
					console.log('broken video');
				}
			} else {
				return false;
			}
		}, 3000);
	});

	//on reclick, remove full size, show thumbnail again
	$(document).on('click', '.openItem', function () {
		//video not loaded or timed out, remove spinner on close
		if ($(this).is('video')) {
			$(this).parent('.spinner').removeClass('spinner');
		}
		$(this).prev().show().fadeTo(0, 1);
		$(this).remove();
	});
}(jq));