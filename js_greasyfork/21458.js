// ==UserScript==
// @name	AzLyrics +
// @description Adds some extra functions to AzLyrics, changes theme and removes adds
// @version     2.0.0
// @author      Bekir Uzun
// @namespace   https://greasyfork.org/en/scripts/21458-azlyrics
// @match       http://www.azlyrics.com/*
// @run-at      document-start
// @license     https://creativecommons.org/licenses/by-sa/4.0/
// @icon        https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az_lyrics_plus_logo.png
// @homepage	https://github.com/BekirUzun/AzLyricsPlus
// @supportURL  https://github.com/BekirUzun/AzLyricsPlus/issues
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant       GM_addStyle
// @grant   	GM_setValue
// @grant   	GM_getValue
// @grant   	GM_deleteValue
// @grant   	GM_listValues
// @grant   	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/21458/AzLyrics%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/21458/AzLyrics%20%2B.meta.js
// ==/UserScript==
/*jshint multistr: true, newcap: false */
(function() {
	'use strict';

	// disable script in Iframes
	if (window.self!==window.top) { return; }

	var initial_settings = {
		"light_mode": false,
		"font_size": 30,
		"block_ads": true,
		"background":{
			"type":"color",
			"shadow": true,
			"filter": "none",
			"image":"http://s21.postimg.org/klu7ak9mt/image.jpg",
			"video":"https://zippy.gfycat.com/AdvancedReasonableAbyssiniancat.mp4",
			"filters":[
				"none",
				"grayscale(70%)",
				"grayscale(100%) blur(3px)",
				"grayscale(50%) blur(5px) brightness(70%)"
			],
			"images": [
				"https://s10.postimg.org/cfo4eg5mx/image.jpg",
				"https://s21.postimg.org/qb8bgmy91/image.jpg",
				"https://s12.postimg.org/783o9ixmj/image.jpg",
				"https://s21.postimg.org/klu7ak9mt/image.jpg"
			],
			"videos": ["https://zippy.gfycat.com/AdvancedReasonableAbyssiniancat.mp4",
					   "https://giant.gfycat.com/PartialSlowIriomotecat.mp4",
					   "https://giant.gfycat.com/BestUncomfortableBagworm.mp4"
					  ]
		}, "colors": {
			"font":"#FFFFFF",
			"font_glow":"#0000FF",
			"bold_font_glow":"#00FFFF",
			"link_glow":"#FF0000",
			"background":"#000000"
		}
	};
	var settings = GM_getValue("settings", JSON.stringify(initial_settings));
	settings = JSON.parse(settings);

	var duration, duration_copy, path;

	function calculateDuration() {
		var dur, lines, height;
		height = $("#addsong").offset().top - window.innerHeight - settings.font_size * 1.4 * 2 ;
		lines = height / ( settings.font_size * 1.4 );
		dur = (lines * 5 ).toFixed(1);
		console.log( height, lines, dur );
		if (lines < 0)
			dur = 0.5;
		return dur;
	}

	function reCalculateDuration() {
		duration = duration_copy - ($( document ).scrollTop() / (settings.font_size * 1.4 )) * 5;
		if (duration <= 0.5)
			duration = 0.5;
		document.getElementById("duration").value = duration.toFixed(1);
	}

	function saveSettings() {
		settings.font_size = document.getElementById("font-size").value;
		settings.colors.font = document.getElementById("font-color").value;
		settings.colors.font_glow = document.getElementById("font-glow-color").value;
		settings.colors.link_glow = document.getElementById("link-glow-color").value;
		settings.colors.bold_font_glow = document.getElementById("bold-font-glow-color").value;
		settings.background.type = document.getElementById("background-type").value;
		settings.background.filter = document.getElementById("background-filter").value;

		if(document.getElementById("background-type").value == "color" )
			settings.colors.background = document.getElementById("background-color").value;
		else if(document.getElementById("background-type").value == "image" )
			settings.background.image = document.getElementById("background-image").value;
		else if(document.getElementById("background-type").value == "video" )
			settings.background.video = document.getElementById("background-video").value;

		if (document.getElementById("duration").value != duration) {
			duration = document.getElementById("duration").value;
			GM_setValue(path, duration);
		}
		settings.background.shadow = document.getElementById("bg-shadow").checked;
		settings.block_ads = document.getElementById("block-ads").checked;

		setTimeout( function() { // delayed this part because it temporarily fixed code. Some one fix this please :O
			if(document.getElementById("light-mode").checked != settings.light_mode) {
				if(document.getElementById("light-mode").checked){
					GM_setValue("settings_old", JSON.stringify(settings)); // save old settings
					settings.background.shadow = false;
					settings.background.filter = "none";
					settings.background.type = "color";
					settings.light_mode = true;
				} else {
					var settings_old = GM_getValue("settings_old", JSON.stringify(initial_settings));
					settings = JSON.parse(settings_old);
					GM_deleteValue("settings_old");
				}
			}
			GM_setValue("settings", JSON.stringify(settings));
		}, 100);
	}

	function resetEverything() {
		var keys = GM_listValues();
		alert(keys + keys.length);
		for (var i = 0; i < keys.length; i++) {
			GM_deleteValue(keys[i]);
		}
	}

	function resetSettings() {
		GM_deleteValue(path);
		GM_deleteValue("settings");
		GM_deleteValue("settings_old");
	}

	var css = '.main-page { width: 90%; font-size: ' + settings.font_size + 'px !important; color: ' + settings.colors.font + ' !important; letter-spacing: 1px !important; text-shadow: 0px 0px 5px ' + settings.colors.font_glow + ', 0px 0px 10px ' + settings.colors.font_glow + ', 0px 0px 15px ' + settings.colors.font_glow + ', 0px 0px 20px ' + settings.colors.font_glow + ', 0px 0px 30px ' + settings.colors.font_glow + ' !important;}\
body, .navbar-footer, .footer-wrap {background: rgba(0,0,0,0.8) !important; font-family: "Righteous", cursive !important; line-height: 1.4 !important;}\
.footer-wrap > .container > .noprint > img {filter: invert(100%) hue-rotate(195deg) saturate(300%);}\
body { background: ' + settings.colors.background + ' !important; }\
.main-page a {color: #FFF !important; text-shadow: 0px 0px 5px ' + settings.colors.link_glow + ', 0px 0px 10px ' + settings.colors.link_glow  + ', 0px 0px 15px ' + settings.colors.link_glow  + ', 0px 0px 20px ' + settings.colors.link_glow  + ', 0px 0px 30px ' + settings.colors.link_glow  + ' !important;}\
.main-page b {color: #FFF !important; text-shadow: 0px 0px 5px ' + settings.colors.bold_font_glow + ', 0px 0px 10px ' + settings.colors.bold_font_glow  + ', 0px 0px 15px ' + settings.colors.bold_font_glow + ', 0px 0px 20px ' + settings.colors.bold_font_glow + ', 0px 0px 30px ' + settings.colors.bold_font_glow + ' !important;}\
.navbar-default {background-color: #55F !important; border-color: #66F !important;}\
.comment { color: ddd !important}\
.btn-menu, .btn-primary { background-color: #00F !important; border-color: #00A !important; margin: 1px !important;}\
.btn-default, .breadcrumb, .panel.album-panel {background-color: #222 !important; border-color: #800 !important;}\
.btn.focus, .btn:focus, .btn:hover {background-color: #008 !important; border-color: #008 !important;}\
.lboard-wrap, .links-menu-wrap {background-color: #33D !important; padding-bottom: 10px !important; position: relative; z-index: 5; }\
@font-face {font-family: "Righteous"; font-style: normal; font-weight: 400; src: local("Righteous"), local("Righteous-Regular"), url(https://fonts.gstatic.com/s/righteous/v5/w5P-SI7QJQSDqB3GziL8XVtXRa8TVwTICgirnJhmVJw.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;}\
.settings { box-shadow: 0px 0px 10px rgba(0,0,0,0.7); font-size: 12pt; width: 25em; position: fixed; top: 0px; right: 0px; background: #21B262; color: #ffffff; height: 100%; z-index: 99995; font-family: "Open Sans", Helvetica, sans-serif;  display: none; padding: 30px 20px 10px 20px;}\
.settings table {width: 100%;}\
.settings td {padding: 3px 5px 3px 5px; line-height: 1.5em;}\
.settings td:nth-child(even) { text-align: center; }\
.settings tr:nth-child(even){ background: rgba(0,0,0,0.1); }\
.settings td.buttons { width: 50%; padding: 5px 20px 5px 20px; }\
.settings button {background-color: #ed4933; box-shadow: none !important; width: 90%; height: 1.5em; color: #fff; font-family: "Open Sans", Helvetica, sans-serif;	font-size: 14pt; font-weight: 400; letter-spacing: 0.1em; border: none; cursor: pointer;}\
.settings input, .settings select {font-size: 12pt; color: #fff; font-family: "Open Sans", Helvetica, sans-serif; line-height: 1.5em; height: 1.5em; background: rgba(100, 100, 100, 0.25); border: none; padding: 0em 0em 0em 0.3em; text-decoration: none; width: 100px; }\
.settings input[type="color"] {background: rgba(0, 0, 0, 0); height: 1.5em; border: none; padding: 0em; position: relative;}\
.settings input[type="checkbox"]:checked + label:before { background: #0F0; color: #fff; content: "✔";}\
.settings input[type="checkbox"] + label:before { background: rgba(150,178,150,1);  content: "X"; color: rgba(150,178,150,1); display: inline-block; height: 1.5em; line-height: 1.5em; text-align: center; width: 1.5em; }\
.settings input[type="checkbox"] { -moz-appearance: none; -webkit-appearance: none; appearance: none; display: block; float: left; margin-right: -2em; opacity: 0; width: 1em; z-index: -1;}\
.settings label {margin: 0 !important;}\
.pre-defined { width: initial !important; margin-right: 5px;}\
.closeSettings {position: fixed; top:0px; right:0px; background-image: url("http://bekiruzun.com/test/1/assets/css/images/close.svg"); background-repeat: no-repeat; background-position: 1em 1em; width: 3em; height: 2em; cursor: pointer;}\
.openSettings {position: fixed; top:0px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/gear-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99990; cursor: pointer;}\
.start {position: fixed; top:50px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/play-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99991; cursor: pointer;}\
.stop {position: fixed; top:50px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/stop-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99990; cursor: pointer;}';

	var html = {
		"bg_inputs":['<td>Background Color:</td><td><input id="background-color" type="color" value="' + settings.colors.background + '"></td>',
					 '<td>Background Image Url:</td><td><select id="pre-defined-images" class="pre-defined"><option value="0">1</option><option value="1">2</option><option value="2">3</option></select><input id="background-image" type="text" value="' + settings.background.image + '"></td>',
					 '<td>Background Video Url:</td><td><select id="pre-defined-videos" class="pre-defined"><option value="0">1</option><option value="1">2</option><option value="2">3</option></select><input id="background-video" type="text" value="' + settings.background.video + '"></td>'],
		"bg_type_select": "",
		"bg_input":"",
		"bg":"",
		"bg_shadow":"",
		"light_mode":"",
		"pre_defined":'<option value="0">1</option><option value="1">2</option><option value="2">3</option>'};

	if(settings.block_ads){
		css += '.ringtone, .addthis_toolbox.addthis_default_style:first-child, .sky-ad, .top-ad, .fb-like, #cf_fb_id, .col-xs-12.col-lg-8.text-center > .noprint.hidden-xs, .col-xs-12.col-lg-8.text-center > div:nth-child(2) { display: none !important; width: 0px !important; height: 0px !important}';
	}

	if(settings.background.shadow){
		html.bg_shadow = '<input id="bg-shadow" name="bg-shadow" type="checkbox" checked><label for="bg-shadow"></label>';
		css += '.col-xs-12.col-lg-8.text-center { background: rgba(0,0,0,0.6) !important; box-shadow: 0 0 100px 100px rgba(0, 0, 0, 0.6) !important; }';
	} else
		html.bg_shadow = '<input id="bg-shadow" name="bg-shadow" type="checkbox"><label for="bg-shadow"></label>';

	if(settings.light_mode)
		html.light_mode = '<input id="light-mode" name="light-mode" type="checkbox" checked><label for="light-mode"></label>';
	else
		html.light_mode = '<input id="light-mode" name="light-mode" type="checkbox"><label for="light-mode"></label>';

	if(settings.block_ads)
		html.block_ads = '<input id="block-ads" name="block-ads" type="checkbox" checked><label for="block-ads"></label>';
	else
		html.block_ads = '<input id="block-ads" name="block-ads" type="checkbox"><label for="block-ads"></label>';

	if(settings.background.type == "color"){
		html.bg_type_select = '<select id="background-type"><option value="color" selected>Color</option> <option value="image">Image</option><option value="video">Video</option></select>';
		html.bg_input = html.bg_inputs[0];
	} else if(settings.background.type == "image"){
		css += '.bg-div { background: '+ settings.colors.background +' url('+ settings.background.image +') no-repeat fixed; background-size: cover; -webkit-filter: '+ settings.background.filter +'; -moz-filter: '+ settings.background.filter +'; filter: '+ settings.background.filter +'; position: fixed; top: 0px; left: 0px; width: 100%; height:100%; z-index: -10; }';
		html.bg = '<div class="bg-div"></div>';
		html.bg_type_select = '<select id="background-type"><option value="color">Color</option><option value="image" selected>Image</option><option value="video">Video</option></select>';
		html.bg_input = html.bg_inputs[1];
	} else if(settings.background.type == "video"){
		css += '#bg-vid { -webkit-filter: '+ settings.background.filter +'; -moz-filter: '+ settings.background.filter +'; filter: '+ settings.background.filter +'; position: fixed; top: 0px; left: 0px; width: 100%; z-index: -10; }';
		html.bg = '<video id="bg-vid" autoplay loop poster="true"><source data-ng-src="'+ settings.background.video +'" src="'+ settings.background.video +'"></video>';
		html.bg_type_select = '<select id="background-type"><option value="color">Color</option><option value="image">Image</option><option value="video" selected>Video</option></select>';
		html.bg_input = html.bg_inputs[2];
	}

	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var head = document.getElementsByTagName("head");
		if (head.length > 0) {
			head[0].appendChild(node);
		} else {
			document.documentElement.appendChild(node);
		}
	}

	//Thanks to Brock Adams @  http://stackoverflow.com/questions/26268816/how-to-get-a-greasemonkey-script-to-run-both-at-run-at-document-start-and-at-r#answer-26269087
	document.addEventListener("DOMContentLoaded", DOM_ContentReady);

	function DOM_ContentReady() {
		path = window.location.pathname;
		if (path.includes("lyrics")) {
			var holder = document.getElementsByTagName("h2")[0].getElementsByTagName("b")[0].innerHTML;
			var patharray = path.split("/");
			var artisturl = "/" + patharray[2].charAt(0) + "/" + patharray[2] + ".html";
			document.getElementsByTagName("h2")[0].innerHTML = '<a href="' + artisturl + '" ><font size="35px">' + holder + '</font></a>';
		}
		document.getElementsByClassName("pull-left")[0].src = 'https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az_lyrics_plus_logo.png';
		
		var duration_interval = setInterval(function(){
			$('html, body').animate({
				scrollTop: 0
			}, {
				duration: 0,
				easing: 'linear',
				complete: function() {
					duration = GM_getValue(path, calculateDuration());
					if(duration > 0){
						duration_copy = duration;
						reCalculateDuration();
						clearInterval(duration_interval);
					}
				}
			});
		}, 250);

		var settingsOutterDiv = document.createElement('div');
		settingsOutterDiv.innerHTML =
			'<div class="settings"><table class="settings-table">\
			    <tbody>\
                    <tr><td>Duration (seconds):</td><td><input id="duration" type="number" step="10" value=""></td></tr>\
                    <tr><td>Font Size (px):</td><td><input id="font-size" type="number" value="' + settings.font_size + '"></td></tr>\
                    <tr><td>Font Color:</td><td><input id="font-color" type="color" value="' + settings.colors.font + '"></td></tr>\
                    <tr><td>Font Glow Color:</td><td><input id="font-glow-color" type="color" value="' + settings.colors.font_glow + '"></td></tr>\
                    <tr><td>Bold Font Glow Color:</td><td><input id="bold-font-glow-color" type="color" value="' + settings.colors.bold_font_glow + '"></td></tr>\
                    <tr><td>Link Glow Color:</td><td><input id="link-glow-color" type="color" value="' + settings.colors.link_glow + '"></td></tr>\
                    <tr><td>Background Type:</td><td>'+ html.bg_type_select +'</td></tr>\
                    <tr id="bg-input">'+ html.bg_input +'</tr>\
                    <tr><td>Background Shadow:</td><td>'+ html.bg_shadow +'</td></tr>\
                    <tr><td>Background Filters:</td><td><select id="pre-defined-filters" class="pre-defined"><option value="0">1</option><option value="1">2</option><option value="2">3</option><option value="3">4</option></select><input id="background-filter" type="text" value="' + settings.background.filter + '"></td></tr>\
                    <tr><td>Block Ads:</td><td>'+ html.block_ads +'</td></tr>\
                    <tr><td>Light Mode:</td><td>'+ html.light_mode +'</td></tr>\
                    <tr style="margin-top: 5px;"><td class="buttons"><button id="save" type="button">Save</button></td><td class="buttons"><button id="reset" type="button">Reset</button></td></tr>\
                </tbody></table> <a class="closeSettings"></a>\
            </div>\
            <a id="openSettings" class="openSettings" ></a> <a class="start"></a> <a class="stop">';
		document.body.appendChild(settingsOutterDiv);
		if(settings.background.type != "color"){
			$('body').prepend(html.bg);
		}
		/* TODO (maybe): Split lyrics into two containers
		setTimeout( function() {
            var lyrics = document.querySelector("body > div.container.main-page > div > div.col-xs-12.col-lg-8.text-center > div:nth-child(6)").outerHTML;
			lyrics = lyrics.replace(/(\r\n|\n|\r)/gm,"");
			var lyrics_array = lyrics.split("<br><br>");
			var left_html = '', right_html = '';
			for( var i = 0; i < lyrics_array.length; i++){
				if(i%2 === 0){
					left_html += lyrics_array[i] + '<br><br>';
				} else {
					right_html += lyrics_array[i] + '<br><br>';
				}
			}
			$("body > div.container.main-page > div > div.col-xs-12.col-lg-8.text-center > div:nth-child(6)").html('<div class="left">'+ left_html +'</div><div class="right">'+ right_html +'</div>');
        }, 250);
*/

		if(settings.background.type == "video")
			document.getElementById("bg-vid").playbackRate = 0.7;
		//I think adding this to the settings menu is not really necessary.
		//but if you want to, you can :')

		if ($.fn.jquery !== "undefined") {
			$('.openSettings').click(function() {
				reCalculateDuration();
				$(".settings").show(800);
			});
			$('.closeSettings').click(function() {
				reCalculateDuration();
				$(".settings").hide(500);
			});
			$('.main-page').click(function() {
				$(".settings").hide(500);
			});
			$('#save').click(function() {
				$('html, body').animate({
					scrollTop: 0
				}, {
					duration: 0,
					easing: 'linear',
					complete: function() {
						reCalculateDuration();
						setTimeout( function() {
							saveSettings();
							setTimeout( function() {
								window.location.reload(true); // page will reload after saveSettings() function done its job. look at line 114
							}, 200);
						}, 200);
					}
				});
			});
			$('#reset').click(function() {
				if (confirm("Do you really want to reset color settings on all pages and duration time on current page?") === true) {
					resetSettings();
					window.location.reload(true);
				}
			});
			$('.start').click(function() {
				$('.start').toggle();
				reCalculateDuration();
				var one_line_height = settings.font_size * 1.4;
				$('html, body').animate({
					scrollTop: $("#addsong").offset().top - window.innerHeight - (one_line_height * 2)
				}, {
					duration: duration * 1000,
					easing: 'linear',
					complete: function() {
						$(".start").show();
					}
				});
			});
			$(".stop").click(function() {
				$(".start").toggle();
				$('html, body').stop();
				reCalculateDuration();
			});
			$("#background-type").change(function() {
				var selected = $("#background-type option:selected").val();
				if (selected == "color"){
					$("#bg-input").html(html.bg_inputs[0]);
				} else if (selected == "image"){
					$("#bg-input").html(html.bg_inputs[1]);
					$("#pre-defined-images").change(function() {
						var index = $("#pre-defined-images option:selected").val();
						$("#background-image").val(settings.background.images[index]);
					});
				} else if (selected == "video"){
					$("#bg-input").html(html.bg_inputs[2]);
					$("#pre-defined-videos").change(function() {
						var index = $("#pre-defined-videos option:selected").val();
						$("#background-video").val(settings.background.videos[index]);
					});
				}
			});
			$("#pre-defined-filters").change(function() {
				var index = $("#pre-defined-filters option:selected").val();
				$("#background-filter").val(settings.background.filters[index]);
			});
			if(settings.background.type == "image"){
				$("#pre-defined-images").change(function() {
					var index = $("#pre-defined-images option:selected").val();
					$("#background-image").val(settings.background.images[index]);
				});
			} else if(settings.background.type == "video"){
				$("#pre-defined-videos").change(function() {
					var index = $("#pre-defined-videos option:selected").val();
					$("#background-video").val(settings.background.videos[index]);
				});
			}
			if(!settings.light_mode){
				$( window ).scroll(function() {
					reCalculateDuration();
				});
			}
		}
	}
})();
