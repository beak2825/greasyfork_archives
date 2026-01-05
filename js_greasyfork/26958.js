// ==UserScript==
// @name           Hide Watched & Selected Youtubes Videos
// @description    Hide viewed & selected videos from your subscriptions.
// @include        https://www.youtube.com/feed/subscriptions*
// @include        https://www.youtube.com/feed/subscriptions*
// @license        MIT
// @version        1.7
// @date           31-01-2017
// @require        https://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/59385
// @downloadURL https://update.greasyfork.org/scripts/26958/Hide%20Watched%20%20Selected%20Youtubes%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/26958/Hide%20Watched%20%20Selected%20Youtubes%20Videos.meta.js
// ==/UserScript==
// js-cookie
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
// Required
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.hideButton { width:30px; position: absolute; bottom: 0%; right: 2%; background-color: white;';
style.innerHTML += 'border-radius: 50%; opacity: 1; }';
style.innerHTML += '.hideButton:hover { opacity: 1; cursor: pointer;} ';
//style.innerHTML += '.a.yt-uix-sessionlink.spf-link:hover .hideButton{ opacity: 1;}';

document.getElementsByTagName('head')[0].appendChild(style);
// Start

function hideWatched() {
    if ($("#hide-videos").is(":checked") && window.location.href == "https://www.youtube.com/feed/subscriptions" || window.location.href == "http://www.youtube.com/feed/subscriptions") {
        $(".ytd-thumbnail-overlay-resume-playback-renderer").each(function() {
            $(this).closest("ytd-grid-video-renderer").hide();
        });
    }
}

function showWatched() {
        $("ytd-grid-video-renderer").show("200");
}

function refreshHideYoutubeVideos(showAll) {
		$('ytd-grid-video-renderer #dismissable #details').each(function() {
			if(!$(this).find('.hideButton').length) {
				$(this).append('<img src="https://image.flaticon.com/icons/svg/61/61685.svg" class="hideButton" />');
			}
		});
    if (Cookies.getJSON('hideYoutubeVideos') !== undefined && window.location.href == "https://www.youtube.com/feed/subscriptions" || window.location.href == "http://www.youtube.com/feed/subscriptions") {
        var data = Cookies.getJSON('hideYoutubeVideos').data;
        data.items.forEach(function(item) {
            //console.log(item.href);
						if(showAll === true) {
							$('a[href="' + item.href + '"]').each(function() {
								$(this).closest("ytd-grid-video-renderer").show("200");
							});
						} else if ($("#hide-videos").prop('checked') === true) {
                $('a[href="' + item.href + '"]').each(function() {
									$(this).closest("ytd-grid-video-renderer").hide();
                });
            } else {
                $('a[href="' + item.href + '"]').each(function() {
									$(this).closest("ytd-grid-video-renderer").show("200");
                });
            }
        });
    }
}

$(function() {
    //Add mutation observer, checks for changes in DOM
    if (MutationObserver) {
        var myObserver = new MutationObserver(hideWatched);
    } else {
        var myObserver = new WebKitMutationObserver(hideWatched);
    }
    myObserver.observe(document, {
        childList: true,
        subtree: true
    });
    //Add mutation observer 2, checks for changes in DOM
    if (MutationObserver) {
        var myObserver2 = new MutationObserver(refreshHideYoutubeVideos);
    } else {
        var myObserver2 = new WebKitMutationObserver(refreshHideYoutubeVideos);
    }
    myObserver2.observe(document, {
        childList: true,
        subtree: true
    });
    // Add checkbox
    var checker = '<label id="checker-container" id="null">' +
        '<input type="checkbox" id="hide-videos" checked=""  id="null"/>' +
        'Hide watched & selected videos' +
        '</label>' ;
    $("#end").prepend(checker);
    $("#checker-container").css({
        'color': "#666",
        "vertical-align": "middle",
        "text-align": "center"
    });


		var removeCookie = '<li><img id="removeCookie" src="https://www.iconsdb.com/icons/preview/gray/delete-xxl.png" width="16" style="vertical-align: middle; cursor: pointer;"</li>';
		$("#appbar-nav .appbar-nav-menu").append(removeCookie);
		$('#removeCookie').on('click', function(){
				setTimeout(function() {
					refreshHideYoutubeVideos(true);
					Cookies.remove('hideYoutubeVideos');
				}, 1000);
			});

    //checkbox event
    $("#hide-videos").click(function() {
        refreshHideYoutubeVideos();
        if ($(this).is(":not(:checked)")) {
            showWatched();
        } else {
            hideWatched();
        }
    });
    //BONUS: always enable load more button.
    $("button.load-more-button").removeProp("disabled");
    hideWatched();
		//$(".yt-thumb").prepend('<img src="https://image.flaticon.com/icons/svg/61/61685.svg" class="hideButton" />');
    refreshHideYoutubeVideos();
});
// on click and Functions
$('body').on('click', '.hideButton', function(e) {
    e.preventDefault();
    if (Cookies.getJSON('hideYoutubeVideos') !== undefined) {
        var data = Cookies.getJSON('hideYoutubeVideos').data;
    } else {
        var data = {
            items: []
        };
    }
    data.items.push({
        href: $(this).parent().parent().find('a').attr('href')
    });
    Cookies.set('hideYoutubeVideos', {
        data: data,
    }, {
        expires: 36500
    });
    refreshHideYoutubeVideos();
    setTimeout(function(){ window.history.back(); }, 250);
});
