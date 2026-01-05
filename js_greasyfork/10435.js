// ==UserScript==
// @name        BetterFetLife
// @namespace   com.fetlife.better
// @include     https://fetlife.com/*
// @version     1.4
// @grant       none
// @description See website
// @downloadURL https://update.greasyfork.org/scripts/10435/BetterFetLife.user.js
// @updateURL https://update.greasyfork.org/scripts/10435/BetterFetLife.meta.js
// ==/UserScript==

$(document).ready(function(){
			
	// add custom css
	$('head').append('<style type="text/css">' + bfl_css + '</style>');
	
	// === USER POPUP === //
	
	// create user popup
	$('body').append('							' +
		'	<div id="bfl-user">					' +
		'		<a class="avatar-wrap">			' +
		'			<div class="avatar"></div>	' +
		'		</a>							' +
		'		<a class="name"></a>			' +
		'		<span class="status"></span>	' +
		'		<span class="location"></span>	' +
		'		<span class="photos"></span>	' +
		'	</div>								'
	);
	
	// show a user popup on hover
	$(document).hoverIntent({
		selector: 'a[href^="/users/"], a[href^="https://fetlife.com/users/"]',
		over: function(){
				
			var linkEl = this;
			var href = $(linkEl).attr('href');
				href = href.replace('https://fetlife.com', '');
			
			// prevent non-user links
			if( href.split('/').length != 3 ) return;
			
			// prevent self-links
			if( $(linkEl).closest('#bfl-user').length > 0 ) return;		
			
			// prevent closing
			clearTimeout(hideUserPopupTimeout);	
			
			// reset the popup
			hideUserPopup();
					
			// show the popup
			$('#bfl-user')
				.addClass('loading')
				.css({
					top: $(linkEl).offset().top + $(linkEl).height() + 8,
					left: $(linkEl).offset().left
				})
				.show();
									
			$.ajax({
				url: href,
	            dataType: "html",
				
				// cache is OK
				cache: true,
				
				// prevent 503, fetlife don't liking ajax calls
			    beforeSend: function(xhr) {
			        xhr.setRequestHeader(
			            'X-Requested-With',
			            {
			                toString: function() { return ''; }
			            }
			        );
			    },
				success: function(userDOM){
					
					var userAvatarEl = $(userDOM).find('#main_content a img');
					
					// avatar href
					$('#bfl-user')
						.attr('avatar-href', $(userAvatarEl).attr('src'));
										
					// avatar
					$('#bfl-user .avatar-wrap')
						.attr('href', href)
						
					$('#bfl-user .avatar')
						.css('background-image', 'url(' + $(userAvatarEl).attr('src') + ')')
	
					// name
					$('#bfl-user .name')
						.attr('href', href)
						.html( $(userAvatarEl).attr('alt') );
					
					// status (age+gender+orientation)
					$('#bfl-user .status')
						.html( $(userDOM).find('#profile h2 .small').html() );
					
					// location
					$('#bfl-user .location')
						.html( $(userDOM).find('#profile h2.bottom + p').html() );
					
					window.userDOM = userDOM;
					
					// photos
					var photos = $(userDOM).find('#profile .container a[href^="/users/"][href*="/pictures"]');
					photos = photos.filter(function(){
						return $(this).find('img').length > 0;
					})
					photos = photos.slice(0,5);
					$('#bfl-user .photos')
						.html('')
						.append( photos );
						
					// friends status
					// remove the link first
					$(userDOM).find('.friends_badge').find('a').remove()
					$('#bfl-user .friends_status')
						.html( $(userDOM).find('.friends_badge').text() );	
						
					$('#bfl-user')
						.removeClass('loading')	
				}
			});
			
		},
		
		out: function(e){
			
			var linkEl = this;
			var href = $(linkEl).attr('href');
			
			// prevent non-user links
			if( href.split('/').length != 3 ) return;
			
			clearTimeout(hideUserPopupTimeout);
			hideUserPopupTimeout = setTimeout(hideUserPopup, hideUserPopupDelay);
		}
	});
	$(document).on('mouseover', '#bfl-user', function(e){
		clearTimeout(hideUserPopupTimeout);
	});
	$(document).on('mouseleave', '#bfl-user', function(e){
		clearTimeout(hideUserPopupTimeout);
		hideUserPopupTimeout = setTimeout(hideUserPopup, hideUserPopupDelay);
	});

	var hideUserPopupTimeout = setTimeout('', 0);
	var hideUserPopupDelay = 500;
	
	function hideUserPopup() {
		
		$('#bfl-user .avatar').attr('style', '');
		$('#bfl-user .name').html('').attr('href', '');
		$('#bfl-user .status').html('');
		$('#bfl-user .location').html('');
		$('#bfl-user .friends_badge').html('');
		$('#bfl-user .photos').html('');
		$('#bfl-user').removeClass('loading');
		
		$('#bfl-user').hide();
	}
	
	// === IMAGE POPUP === //
	
	// create image popup
	$('body').append('										' +
		'	<div id="bfl-image">							' +
		'		<span class="header">						' +
		'			<span class="title"></span>				' +
		'			<span class="like-wrap">				' +
		'				<span class="like-count"></span>	' +
		'				<span class="like picto">k</span>	' +
		'			</span>									' +
		'		</span>										' +
		'		<a class="image-wrap">						' +
		'			<img class="image" />					' +
		'		</a>										' +
		'	</div>											'
	);
	
	
	$(document).hoverIntent({
		selector: 'a[href^="/users/"][href*="/pictures"], a[href^="https://fetlife.com/users/"][href*="/pictures"]',
		over: function(){
							
			var linkEl = this;
			var href = $(this).attr('href');
				href = href.replace('https://fetlife.com', '');
			
			// prevent non-image links
			if( href.split('/').length != 5 ) return;
			
			// prevent self-links
			if( $(linkEl).closest('#bfl-image').length > 0 ) return;
			
			// prevent 'next image'
			if( $(linkEl).children('.fake_img').length > 0 ) return;
			
			// reset the popup
			hideImagePopup();
			
			// show the popup
			var css = {
				top: $(linkEl).offset().top + $(linkEl).height() + 8
			}
			
			if( $(linkEl).offset().left > $(window).width()/2 ) {
				css.right = $(window).width() - $(linkEl).offset().left - $(linkEl).width();
				$('#bfl-image').addClass('alignright');
			} else {
				css.left = $(linkEl).offset().left;
			}
			
			$('#bfl-image')
				.addClass('loading')
				.css(css)
				.show();
			
			$.ajax({
	            url: href,
	            dataType: "html",
	            success: function(html){  
	               
	                var title = $(html).find('.s.i.caption').text();
	                
		            var likeUrl = href.split('/');  
		                likeUrl = likeUrl[ likeUrl.length-1 ];
		                likeUrl = "/pictures/" + likeUrl + "/likes"
					
					// extract the image src                                          
	                var src = $(html).find('style').first().html().match(/\(\'(.*?)\'\)/);
	                    src = src[0];
	                    src = src.replace("('", "");
	                    src = src.replace("')", "");
	                   					
					$('#bfl-image .title')
						.html(title)
						.attr('title', title)
					
					$('#bfl-image .like-wrap')
						.attr('data-href', likeUrl);
					
					$('#bfl-image .image-wrap')
						.attr('href', href);
						
					$('#bfl-image .image')
						.load(function(){
							$('#bfl-image').removeClass('loading')
						})
						.attr('src', src)
	               
					// get amount of likes
	                $.ajax({
	                    url: likeUrl,
	                    dataType: "json",
	                    success: function(data) {
	                        $('#bfl-image .like-wrap').toggle(data.user_can_like);
	                        if( data.is_liked_by_user ) {
	                            $('#bfl-image .like-wrap').addClass('liked');
	                        }
					
							$('#bfl-image .like-count')
								.html(data.total);
	                    }
	                });
	            }
	        });
			
		},
	
		out: function(e){
			
			var linkEl = this;
			var href = $(linkEl).attr('href');
			
			// prevent non-user links
			if( href.split('/').length != 5 ) return;
			
			clearTimeout(hideImagePopupTimeout);
			hideImagePopupTimeout = setTimeout(hideImagePopup, hideImagePopupDelay);
		}
	});
	$(document).on('mouseover', '#bfl-image', function(e){
		clearTimeout(hideImagePopupTimeout);	
		clearTimeout(hideUserPopupTimeout);
	});
	$(document).on('mouseleave', '#bfl-image', function(e){
		clearTimeout(hideImagePopupTimeout);
		hideImagePopupTimeout = setTimeout(hideImagePopup, hideImagePopupDelay);
	});

	var hideImagePopupTimeout = setTimeout('', 0);
	var hideImagePopupDelay = 500;
	
	function hideImagePopup() {
		
		$('#bfl-image .title').html('').attr('href', '');
		$('#bfl-image .image').attr('src', '');
		$('#bfl-image .like-wrap').attr('data-href', '');
		$('#bfl-image .like-count').html('');
		$('#bfl-image').removeClass('loading');
		$('#bfl-image').removeClass('alignright');
		$('#bfl-image').hide();
	}
	
	$(document).on('click', '#bfl-image .like-wrap', function(){
        var this_ = this;
        $.ajax({
            url: $(this_).data('href') + '/toggle',
            type: 'post',
            success: function(){
                
                if( $(this_).hasClass('liked') ) {
	                $('#bfl-image .like-count').html( parseInt( $('#bfl-image .like-count').html()) - 1 )
                } else {
	                $('#bfl-image .like-count').html( parseInt( $('#bfl-image .like-count').html()) + 1 )
                }
                
                $(this_).toggleClass('liked');
            }
        });
       
        return false;
    });
	
});

var bfl_css = '' +
'	#bfl-user {' +
'		position: absolute;' +
'		z-index: 100;' +
'		display: none;' +
'		padding: 4px;' +
'		min-width: 180px;' +
'		height: 80px;' +
'		padding-left: 92px;' +
'		padding-right: 8px;' +
'		background: #323232;' +
'		border: 3px solid #171717;' +
'	}' +
'	#bfl-user.loading {' +
'		padding-left: 84px;' +
'		padding-right: 4px;' +
'		min-width: 0;' +
'	}' +
'	#bfl-user:before,' +
'	#bfl-image:before {' +
'		position: absolute;' +
'		z-index: 101;' +
'		display: block;' +
'		content: "";' +
'		left: 7px;' +
'		top: -8px;' +
'		border: 8px solid transparent;' +
'		border-bottom-color: #171717;' +
'		border-top-width: 0;' +
'	}' +
'	#bfl-user:after,' +
'	#bfl-image:after {' +
'		position: absolute;' +
'		z-index: 102;' +
'		display: block;' +
'		content: "";' +
'		left: 10px;' +
'		top: -5px;' +
'		border: 5px solid transparent;' +
'		border-bottom-color: #323232;' +
'		border-top-width: 0;' +
'	}' +
'		#bfl-user .avatar {' +
'			position: absolute;' +
'			left: 4px;' +
'			width: 80px;' +
'			height: 80px;' +
'			padding: 0px;' +
'			margin-right: 8px;' +
'			background-color: transparent;' +
'			background-size: cover;' +
'			background-position: center center;' +
'			background-repeat: no-repeat;' +
'		}' +
'		#bfl-user.loading .avatar {' +
'			background-size: auto;' +
'			background-image: url(https://flassets.a.ssl.fastly.net/std/spinners/circle_big.gif);' +
'			margin-right: 0;' +
'		}' +
'		#bfl-user .name {' +
'			white-space: nowrap;' +
'		}'	+
'		#bfl-user .status {' +
'			white-space: nowrap;' +
'			color: #aaa;' +
'		}'	+
'		#bfl-user .location {' +
'			display: block;' +
'			font-size: 12px;' +
'			white-space: nowrap;' +
'		}' +
'		#bfl-user .friends_status {' +
'			float: right;' +
'			font-size: 12px;' +
'		}' +
'		#bfl-user .photos {' +
'			position: absolute;' +
'			right: 4px;' +
'			bottom: 4px;' +
'			font-size: 12px;' +
'		}' +
'			#bfl-user .photos a {' +
'				float: left;' +
'				font-size: 12px;' +
'			}' +
'				#bfl-user .photos a img {' +
'					float: left;' +
'					margin: 2px;' +
'					width: 25px;' +
'					height: 25px;' +
'					padding: 0;' +
'				}' +
'	#bfl-image {' +
'		position: absolute;' +
'		z-index: 100;' +
'		display: none;' +
'		background: #323232;' +
'		border: 3px solid #171717;' +
'		padding: 4px;' +
'	}' +
'	#bfl-image.alignright:before {' +
'		left: auto;' +
'		right: 7px;' +
'	}' +
'	#bfl-image.alignright:after {' +
'		left: auto;' +
'		right: 10px;' +
'	}' +
'	#bfl-image.loading {' +
'		width: 80px;' +
'		height: 80px;' +
'		background: #323232 url(https://flassets.a.ssl.fastly.net/std/spinners/circle_big.gif) no-repeat center center;' +
'	}' +
'		#bfl-image .header {' +
'			position: absolute;' +
'			left: 0;' +
'			right: 0;' +
'			top: 0;' +
'			background: #323232;' +
'			padding: 4px;' +
'			overflow: hidden;' +
'			font-size: 12px;;' +
'		}'	+
'		#bfl-image.loading .header {' +
'			display: none;' +
'		}' +
'			#bfl-image .title {' +
'				float: left;' +
'				width: 80%;' +
'				white-space: nowrap;' +
'				overflow: hidden;' +
'				text-overflow: ellipsis;' +
'			}'	+
'			#bfl-image .like-wrap {' +
'				float: right;' +
'				width: 10%;' +
'				white-space: nowrap;' +
'				text-align: right;' +
'				cursor: pointer;' +
'			}'	+
'			#bfl-image .like-wrap:hover {' +
'				color: #ffffff;' +
'			}'	+
'			#bfl-image .like-wrap:active {' +
'				color: #bbbbbb;' +
'			}'	+
'			#bfl-image .like-wrap.liked {' +
'				color: #DD0000;' +
'			}'	+
'			#bfl-image .like-wrap.liked:hover {' +
'				color: #FF0000;' +
'			}'	+
'			#bfl-image .like-wrap.liked:active {' +
'				color: #BB0000;' +
'			}'	+
'		#bfl-image .image {' +
'			display: block;' +
'			padding: 0;' +
'		}'	+
'		#bfl-image.loading .image {' +
'			opacity: 0;' +
'		}' +

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
 
/* hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 */
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 6,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = true;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = false;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = $.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type === "mouseenter"
            if (e.type === "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);
