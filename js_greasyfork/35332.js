// ==UserScript==
// @name			Gazelle Snatched
// @namespace		Gazelle
// @description		Mark snatched torrents across your favorite gazelle music trackers.
// @author			Mordred
// @include			https://*passtheheadphones.me/*
// @include			https://*redacted.ch/*
// @include 		https://*apollo.rip/*
// @include 		https://*notwhat.cd/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// @grant			GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @grant 			GM_getResourceText
// @grant			GM_addStyle
// @grant			GM_log
// @version			2.2.2
// @date			2016-08-28
// @downloadURL https://update.greasyfork.org/scripts/35332/Gazelle%20Snatched.user.js
// @updateURL https://update.greasyfork.org/scripts/35332/Gazelle%20Snatched.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var chromeExtension = true;
	var manifest;
	var chromep;
	var storageObj = { gazelle_snatched: {} };
	if (!window.chrome || !chrome.extension) {
		// not on chrome so do FF specific things
		chromeExtension = false;
		// Not working: @require 		materialize_CSS https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css
		// var materialize_CSS = GM_getResourceText ("materialize_CSS");
		// GM_addStyle(materialize_CSS);
		manifest = GM_info.script;
	} else {
		manifest = chrome.runtime.getManifest();

		chromep = new ChromePromise();
	}
	console.log(manifest.name + ' v' + manifest.version + ' by Mordred');

	var releaseTypes = ['Album', 'EP', 'Soundtrack', 'Compilation', 'Remix', 'Anthology', 'DJ Mix', 'Single'];
	var releaseTypeRegex = new RegExp('\\[(?:' + releaseTypes.join('|') + ')\\]$')

	// function setValue (key, val) {
	// 	var obj = {};
	// 	obj[key] = val;
	// 	chromep.storage.local.set(obj).then(function () { return; });
	// }

	// function getValue (key) {
	// 	chromep.storage.local.get(key).then(function (vals) {
	// 		console.log('retrieved', vals);
	// 		return vals;
	// 	});
	// }

	function GM_getLSValue (key, defaultValue) {
		var value = window.localStorage.getItem(key);
		if (value == null) value = defaultValue;
		// if (chromeExtension) {
		// 	chromep.storage.local.get('gazelle_snatched').then(function (data) {
		// 		console.log(key, data.gazelle_snatched[key]);
		// 	});
		// }
		return value;
	}

	function GM_setLSValue(key, value) {
		try {
			window.localStorage.setItem(key, value);
		} catch (e) {
			console.error("Gazelle Snatched Error: Could not update torrent list. You will most likely need to update your maximum localStorage size. \
				Check the main support thread for details on doing this. https://redacted.ch/forums.php?action=viewthread&threadid=4082&page=4#post279935");
		}
		if (!chromeExtension) {
			GM_setValue(key, value);
		}
		// if (chromeExtension) {
		// 	storageObj.gazelle_snatched[key] = value;
		// 	chromep.storage.local.set(storageObj);
		// }
	}
	function GM_deleteLSValue(key) {
		window.localStorage.removeItem( key );
	}
	function GM_addStyle(css) {
		$("<style type='text/css'>"+css+"</style>").appendTo('head');
	}

	function GM_xmlhttpRequest(details) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			var responseState = {
				responseXML:(xmlhttp.readyState==4 ? xmlhttp.responseXML : ''),
				responseText:(xmlhttp.readyState==4 ? xmlhttp.responseText : ''),
				readyState:xmlhttp.readyState,
				responseHeaders:(xmlhttp.readyState==4 ? xmlhttp.getAllResponseHeaders() : ''),
				status:(xmlhttp.readyState==4 ? xmlhttp.status : 0),
				statusText:(xmlhttp.readyState==4 ? xmlhttp.statusText : '')
			}
			if (details["onreadystatechange"]) {
				details["onreadystatechange"](responseState);
			}
			if (xmlhttp.readyState==4) {
				if (details["onload"] && xmlhttp.status>=200 && xmlhttp.status<300) {
					details["onload"](responseState);
				}
				if (details["onerror"] && (xmlhttp.status<200 || xmlhttp.status>=300)) {
					details["onerror"](responseState);
				}
			}
		}
		try {
			//cannot do cross domain
			xmlhttp.open(details.method, details.url);
		} catch(e) {
			if( details["onerror"] ) {
				//simulate a real error
				details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
			}
		  return;
		}
		if (details.headers) {
			for (var prop in details.headers) {
				xmlhttp.setRequestHeader(prop, details.headers[prop]);
			}
		}
		xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
	}

	function GM_log(message) {
		console.log(message);
	}

	function getIconImageUrl(icon) {
		if (chromeExtension) {
			return chrome.extension.getURL('images/' + icon + '.png');
		} else {
			var url = '';
			switch (icon) {
				case 'uploaded':
					url = 'https://ptpimg.me/4i1y66.png';
					break;
				case 'snatched':
					url = 'https://ptpimg.me/13itg3.png';
					break;
				case 'down':
					url = 'https://ptpimg.me/8180y8.png';
					break;
				case 'bookmark':
					url = 'https://ptpimg.me/33z7ms.png';
					break;
				case 'whatcd':
					url = 'https://ptpimg.me/eo9003.png';
					break;
			}
			return url;
		}
	}

	var GROUP_SNATCHED = 'font-style:italic; font-weight:bolder; text-decoration:underline;';
	var T_SNATCHED = 'color: #E5B244 !important; text-decoration:line-through !important; display:inline; background:url(' + getIconImageUrl('snatched') + ') top right no-repeat; padding:1px 18px 1px 0;';
	var UPLOADED = 'color: #63b708 !important; text-decoration:line-through !important; display:inline; background:url(' + getIconImageUrl('uploaded') + ') top right no-repeat; padding:1px 18px 1px 0;';
	var LEECHING = 'color: #F70000 !important; display:inline; background:url(' + getIconImageUrl('down') + ') top right no-repeat; padding:1px 18px 1px 0;';
	var SEEDING = 'font-style:italic; text-decoration:none !important;';
	var BOOKMARKED = 'background:url(' + getIconImageUrl('bookmark') + ') top right no-repeat; padding:1px 18px 1px 0;';
	var WHATCD_GROUP = 'background:url(' + getIconImageUrl('whatcd') + ') top right no-repeat; padding:1px 22px 1px 0;';
	// var UPLOADED = 'color: #63b708 !important; text-decoration:line-through !important; display:inline; background:url(https://whatimg.com/i/8oux68.png) top right no-repeat; padding:1px 18px 1px 0;';
	// var LEECHING = 'color: #F70000 !important; display:inline; background:url(https://whatimg.com/i/ay3zvb.png) top right no-repeat; padding:1px 18px 1px 0;';
	// var SEEDING = 'font-style:italic; text-decoration:none !important;';
	// var BOOKMARKED = 'background:url(https://whatimg.com/i/4otnce.png) top right no-repeat; padding:1px 18px 1px 0;';

	var HEADER_STYLE = '.sBoxTitle { color: white; } .sBoxTitle:visited { color: white; } .sboxTitleVersion { color: red; } .sboxTitleVersion:visited { color: red; }';
	var AUTO_UPDATE_INTERVAL = 20; /* minutes */
	var STATUS_BOX_YOFFSET = 20; /* pixels */

	var domain_prefix = 'gazelle_';
	switch (location.hostname) {
		case 'passtheheadphones.me':
		case 'redacted.ch':
			domain_prefix = 'redacted_';
			break;
		case 'apollo.rip':
		case 'xanax.rip':
			domain_prefix = 'apollo_';
			break;
	}

	var global_updateFreq = 	getDomainLSValue('update_freq', AUTO_UPDATE_INTERVAL);
	var global_hideStatusBox =	getDomainLSValue('box_hidden', 'false');
	var global_SB_YOffset = 	getDomainLSValue('box_yoffset', STATUS_BOX_YOFFSET);
	/* Inject CSS style */
	var style_groupsnatched = getDomainLSValue('style_groupsnatched',GROUP_SNATCHED);
	var style_tsnatched =     getDomainLSValue('style_tsnatched',T_SNATCHED);
	var style_uploaded =      getDomainLSValue('style_uploaded',UPLOADED);
	var style_leeching =      getDomainLSValue('style_leeching',LEECHING);
	var style_seeding =       getDomainLSValue('style_seeding',SEEDING);
	var style_bookmarked =    getDomainLSValue('style_bookmarked',BOOKMARKED);
	var scriptVersion =       GM_getLSValue('script_version','0.0.0');
	var style_whatgroup =     GM_getLSValue('style_whatgroup', WHATCD_GROUP);
	GM_addStyle('.group_snatched { ' + style_groupsnatched + ' }');
	GM_addStyle('.gazelle_snatched { ' + style_tsnatched + ' }');
	GM_addStyle('.gazelle_uploaded { ' + style_uploaded + ' }');
	GM_addStyle('.gazelle_leeching { ' + style_leeching + ' }');
	GM_addStyle('.gazelle_seeding { ' + style_seeding + ' }');
	GM_addStyle('.gazelle_bookmark { ' + style_bookmarked + ' }');
	GM_addStyle('.whatcd_group { ' + style_whatgroup + ' }');
	GM_addStyle(HEADER_STYLE);

	/** REMOVE THESE STYLES FOR CHROME */
	GM_addStyle(".gazelle_menu { background-color: rgba(40,40,40,0.96); position: fixed; z-index: 902; font-family: Arial, sans-serif; font-size: 11px !important; }")
	GM_addStyle(".pull-right { float: right; } ");
	GM_addStyle(".gazelle_btn { margin-right: 5px; text-decoration: none; color: #fff; background-color: #26a69a; text-align: center; letter-spacing: .5px; transition: .2s ease-out; cursor: pointer; border: none; border-radius: 2px; display: inline-block; height: 36px; line-height: 36px; padding: 0 2rem; text-transform: uppercase; vertical-align: middle; -webkit-tap-highlight-color: transparent; } ");
	GM_addStyle(".gazelle_btn:hover { background-color: #2bbbad; box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14),0 1px 7px 0 rgba(0,0,0,0.12),0 3px 1px -1px rgba(0,0,0,0.2); } ");
	GM_addStyle(".gazelle_sm_btn { padding: 2px 5px; margin-top: -3px; line-height: 20px; height: 20px; }");

	GM_addStyle(".gazelle_subItem { margin: 0px 5px 0px 25px; }");
	GM_addStyle(".gazelle_numeric { padding: 2px !important; font-size: 9pt !important; }")
	GM_addStyle('.gazelle_header { color:#ffffff !important; font-size: 11pt; }');
	GM_addStyle('.gazelle_text { width: 68% !important; margin-right:10px; padding: 2px !important; font-size: 9pt !important; }');
	GM_addStyle('.gazelle_small_text { font-size: 10px; }');
	GM_addStyle('.gazelle_link { margin-left:3px; margin-right:3px; }');
	GM_addStyle('.gazelle_class { display: inline-block; width:93px; margin-left:25px; margin-bottom:9px; font-size:8pt;}');
	GM_addStyle('.gazelle_leftCol { width:50%; height:auto; display:table-cell; padding: 10px 0px 10px; }');
	GM_addStyle('.gazelle_rightCol { width:auto; height:auto; display:table-cell; padding: 10px 0px 10px; }');
	/** END FIREFOX STYLES */

	function log(text) {
		GM_log(text);
	}

	/* Throttled proxy */
	function ThrottledProxy(url_base, delay) {
		var last_req = new Date(0);
		var queue = [];
		var processing = false;

		return {
			get: function(req) {
				var now = new Date();
				queue.push(req);
				if (!processing) {
					/* Race condition: atomic test and set would be appropriate here, to ensure thread safety (is it a problem?) */
					processing = true;
					var diff = last_req.getTime() + delay - now.getTime();
					if (diff > 0) {
						var that = this;
						window.setTimeout(function() { that.process_queue(); }, diff);
					} else {
						this.process_queue();
					}
				}
			},

			process_queue: function() {
				var req = queue.shift();
				this.do_request(req);
				processing = (queue.length > 0);
				if (processing) {
					var that = this;
					window.setTimeout(function() { that.process_queue(); }, delay);
				}
			},

			do_request: function(req) {
				last_req = new Date();
				var timer;
				var req_timed_out = false; /* We cannot abort a request, so we need keep track of whether it timed out */

				/* Create timeout handler */
				timer = window.setTimeout(function() {
					/* Race condition: what if the request returns successfully now? */
					req_timed_out = true;
					if (req.error) req.error(null, 'Network timeout');
				}, req.timeout || 20000);

				/* Do the actual request */
				GM_xmlhttpRequest({
					method: req.method || 'GET',
					url: url_base+req.url,
					headers: { /*'User-Agent': navigator.userAgent,*/ 'Accept': req.accept || 'text/xml' },
					onload: function(response) {
						window.clearTimeout(timer);
						if (!req_timed_out) req.callback(response);
					},
					onerror: function(response) {
						window.clearTimeout(timer);
						if (!req_timed_out && req.error) req.error(response, 'GM_xmlhttpRequest error');
					}
				});
			}
		};
	}

	/* Global status area - feel free to reuse in your own scripts :)
	   Requires jQuery and the round extension above. */
	function StatusBox(title) {
		/* Setup status area */
		var status_area = $('#gazelle_greasemonkey_status_area').eq(0);
		if (status_area.length == 0) {
			var statWidth = '20%';
			if (window.innerWidth < 1340)
				statWidth = 268;
			status_area = $('<div id="gazelle_greasemonkey_status_area"></div>').css({
				'position': 'fixed',
				'margin': global_SB_YOffset.toString() + 'px 20px',
				'width': statWidth,
				'z-index': 901
			});
			var boxPos = getDomainLSValue('box_position', 'top_right');
			if (boxPos == 'bottom_right')
				status_area.css({ 'bottom': '0', 'right': '0'});
			else if (boxPos == 'top_left')
				status_area.css({ 'top': '0', 'left': '0'});
			else if (boxPos == 'bottom_left')
				status_area.css({ 'bottom': '0', 'left': '0'});
			else /* top_right */
				status_area.css({ 'top': '0', 'right': '0'});
			$('body').append(status_area);
		}

		/* Create box */
		var box = $('<div id="status_content_area"></div>').hide();
		box.css({
			'color': 'white',
			'background-color': 'black',
			'opacity': 0.7,
			'margin': '0 0 10px 0',
			'padding': '10px 10px 20px 10px',
			'border-radius': '10px'
		});

		/* Create contents area */
		var contents = $('<div></div>');
		box.append(contents);

		var timer = null;
		var timeout = 0;
		var inhibit_fade = false;

		function set_visible(visible) {
			if (visible && box.is(':hidden')) box.fadeIn(500);
			else if (!visible && box.is(':visible')) box.fadeOut(500);
		}

		function clear_timer() {
			if (timer) {
				window.clearTimeout(timer);
				timer = null;
			}
		}

		function set_timer() {
			if (!timer && timeout > 0) {
				timer = window.setTimeout(function() { clear_timer(); set_visible(false); }, timeout);
			}
		}

		function update_timer(t) {
			clear_timer();
			timeout = t;
			if (!inhibit_fade) set_timer();
		}

		function set_inhibit_fade(inhibit) {
			inhibit_fade = inhibit;
			if (!inhibit_fade) { set_timer(); }
			else clear_timer();
		}

		/* Register event handlers */
		box.mouseenter(function(event) {
			set_inhibit_fade(true);
			$(this).fadeTo(500, 0.9);
		});

		box.mouseleave(function(event) {
			set_inhibit_fade(false);
			$(this).fadeTo(500, 0.7);
		});

		box.click(function(event) {
			clear_timer();
			$(this).unbind('mouseenter');
			$(this).unbind('mouseleave');
			set_visible(false);
		});

		/* Append to global status area */
		status_area.append(box);

		return {
			contents: function() {
				return contents;
			},

			show: function(t) {
				if (global_hideStatusBox != 'true' || /\/torrents\.php.type/.test(document.URL)) {
					t = t || 0;
					update_timer(t);
					set_visible(true);
				}
			},

			hide: function() {
				clear_timer();
				set_visible(false);
			}
		};
	}

	function doOptionsMenu() {
		var options_menu = $('#gazelle_options_menu').eq(0);
		if (options_menu.length == 0) {
			var optHeight = 570;
			var optWidth = 820;
			options_menu = $('<div id="gazelle_options_menu" class="gazelle_menu"></div>').css({
				'top': window.innerHeight,
				'left': '50%',
				'margin-left': -optWidth*.5,
				'width': optWidth,
				'height': optHeight,
				'border-radius': '10px'
			}).hide();
			var css_div = $('<div></div>').css({
				'width': '95%', 'height':'auto','margin': '20px 20px 15px','color':'#ffffff'//,'overflow': 'hidden'
			});
			var refreshHeader = $('<h3 class="gazelle_header">Update Frequency</h3>');
			var refreshInput = $('<input class="gazelle_subItem gazelle_numeric" type="text" name="interval" maxlength="3">Interval between updates in minutes (minimum of 10)<br>').css({'text-align':'right', 'width':'20px'});
			var columns_div = $('<div></div>').css({ 'width':'100%', 'margin-top':'-18px', 'display':'table'});
			var leftColumn = $('<div class="gazelle_leftCol"></div>');
			leftColumn.append(refreshHeader);
			leftColumn.append(refreshInput);

			var hideHeader = $('<h3 class="gazelle_header">Visibility</h3>');
			var check_box_hide = $('<input class="gazelle_subItem" type="checkbox" name="visibility">Show the status box on all pages<br>');
			var explanation_div = $('<div class="gazelle_small_text gazelle_subItem">The status box will always appear on \'/torrents.php?type=...\' and whenever a script update is available.</div>');
			leftColumn.append(hideHeader);
			leftColumn.append(check_box_hide);
			leftColumn.append(explanation_div);

			var positionHeader = $('<h3 class="gazelle_header">Status Box Position</h3>');
			var radio_button_tl = $('<input class="gazelle_subItem" type="radio" name="location" id="top_left"/>Top Left<br>');
			var radio_button_tr = $('<input class="gazelle_subItem" type="radio" name="location" id="top_right"/>Top Right<br>');
			var radio_button_bl = $('<input class="gazelle_subItem" type="radio" name="location" id="bottom_left"/>Bottom Left<br>');
			var radio_button_br = $('<input class="gazelle_subItem" type="radio" name="location" id="bottom_right"/>Bottom Right<br>');
			var rightColumn = $('<div class="gazelle_rightCol"></div>');
			rightColumn.append(positionHeader);
			rightColumn.append(radio_button_tl);
			rightColumn.append(radio_button_tr);
			rightColumn.append(radio_button_bl);
			rightColumn.append(radio_button_br);

			var offsetHeader = $('<h3 class="gazelle_header">Status Box Y-Offset</h3>');
			var offsetInput = $('<input class="gazelle_subItem gazelle_numeric" type="text" name="yOffset" maxlength="3">The offset in pixels from the top or bottom of the window<br>').css({'text-align':'right', 'width':'20px'});
			rightColumn.append(offsetHeader);
			rightColumn.append(offsetInput);
			columns_div.append(leftColumn);
			columns_div.append(rightColumn);
			css_div.append(columns_div);

			var full_div = $('<div></div>');

			var styleHeader = $('<h3 class="gazelle_header">Link Style Settings</h3>');
			full_div.append(styleHeader);
			var sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_gsnatched">Sample Group Snatched Torrent Link</a><br>');
			sampleText.click(function () { return false; });
			snatchedInput = $('<span class="gazelle_class">.group_snatched</span><input class="gazelle_text" type="text" id="input_gsnatched" value="'+ style_groupsnatched +'">');
			var applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_gsnatched', 'input_gsnatched'); return false; });
			var defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () {	SetStyle('sample_gsnatched', GROUP_SNATCHED); $("input[id='input_gsnatched']").val(GROUP_SNATCHED); return false; });
			full_div.append(sampleText);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);

			var sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_tsnatched">Sample Snatched Torrent Link</a><br>');
			sampleText.click(function () { return false; });
			var snatchedInput = $('<span class="gazelle_class">.gazelle_snatched</span><input class="gazelle_text" type="text" id="input_tsnatched" value="'+ style_tsnatched +'">');
			applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_tsnatched', 'input_tsnatched'); ApplyStyle('sample_seeding', 'input_tsnatched', 'input_seeding'); return false; });
			defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () { SetStyle('sample_tsnatched', T_SNATCHED); SetStyle('sample_seeding', T_SNATCHED + $("input[id='input_seeding']").val()); $("input[id='input_tsnatched']").val(T_SNATCHED); return false; });
			full_div.append(sampleText);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);

			sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_uploaded">Sample Uploaded Torrent Link</a><br>');
			sampleText.click(function () { return false; });
			snatchedInput = $('<span class="gazelle_class">.gazelle_uploaded</span><input class="gazelle_text" type="text" id="input_uploaded" value="'+ style_uploaded +'">');
			applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_uploaded', 'input_uploaded'); ApplyStyle('sample_ul_seed', 'input_uploaded', 'input_seeding'); return false; });
			defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () { SetStyle('sample_uploaded', UPLOADED); SetStyle('sample_ul_seed', UPLOADED + $("input[id='input_seeding']").val()); $("input[id='input_uploaded']").val(UPLOADED); return false; });
			full_div.append(sampleText);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);

			//sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_seeding">Sample Seeding Snatched Torrent Link</a><span>&nbsp;&nbsp;(.gazelle_snatched style is also applied to this link)</span><br>');
			//sampleTxt2 = $('<span class="gazelle_class"></span><a href="#" id="sample_ul_seed">Sample Seeding Uploaded Torrent Link</a><span>&nbsp;&nbsp;(.gazelle_uploaded style is also applied to this link)</span><br>');
			sampleText = $('<span class="gazelle_class"></span>Seeding links will <i>always</i> have either the .gazelle_snatched style or the .gazelle_uploaded style applied<br><span class="gazelle_class"></span>to them, so .gazelle_seeding is commonly used to override those base styles.</br>');
			var sampleTxt2 = $('<span class="gazelle_class"></span><a href="#" id="sample_seeding">Sample Seeding Snatched Torrent Link</a>&nbsp;&nbsp;<a href="#" id="sample_ul_seed">Sample Seeding Uploaded Torrent Link</a><br>');
			//sampleText.click(function () { return false; });
			sampleTxt2.click(function () { return false; });
			snatchedInput = $('<span class="gazelle_class">.gazelle_seeding</span><input class="gazelle_text" type="text" id="input_seeding" value="'+ style_seeding +'">');
			applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_seeding', 'input_tsnatched', 'input_seeding'); ApplyStyle('sample_ul_seed', 'input_uploaded', 'input_seeding'); return false; });
			defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () { SetStyle('sample_seeding', $("input[id='input_tsnatched']").val() + SEEDING); $("input[id='input_seeding']").val(SEEDING);
											SetStyle('sample_ul_seed', $("input[id='input_uploaded']").val() + SEEDING); return false; });
			full_div.append(sampleText);
			full_div.append(sampleTxt2);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);

			sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_leeching">Sample Leeching Torrent Link</a><br>');
			sampleText.click(function () { return false; });
			snatchedInput = $('<span class="gazelle_class">.gazelle_leeching</span><input class="gazelle_text" type="text" id="input_leeching" value="'+ style_leeching +'">');
			applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_leeching', 'input_leeching'); return false; });
			defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () { SetStyle('sample_leeching', LEECHING); $("input[id='input_leeching']").val(LEECHING); return false; });
			full_div.append(sampleText);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);

			sampleText = $('<span class="gazelle_class"></span><a href="#" id="sample_bookmarked">Sample Bookmarked Torrent Link</a><br>');
			sampleText.click(function () { return false; });
			snatchedInput = $('<span class="gazelle_class">.gazelle_bookmark</span><input class="gazelle_text" type="text" id="input_bookmarked" value="'+ style_bookmarked +'">');
			applyLink = $('<span class="gazelle_btn gazelle_sm_btn">Test</span>');
			applyLink.click(function () { ApplyStyle('sample_bookmarked', 'input_bookmarked'); return false; });
			defaultLink = $('<span class="gazelle_btn gazelle_sm_btn">Default</span>');
			defaultLink.click(function () { SetStyle('sample_bookmarked', BOOKMARKED); $("input[id='input_bookmarked']").val(BOOKMARKED); return false; });
			full_div.append(sampleText);
			full_div.append(snatchedInput);
			full_div.append(applyLink);
			full_div.append(defaultLink);
			css_div.append(full_div);

			var okay_button = $('<span id="js_ok_button" class="gazelle_btn pull-right">Submit</span>');
			okay_button.click(function () { CommitOptions(); DisplaySlideMenu(false); });
			var cancel_button = $('<span id="js_close_button" class="gazelle_btn pull-right">Cancel</span>');
			cancel_button.click(function () { DisplaySlideMenu(false); });
			var button_div = $('<div></div>').css({
				'width': '95%', 'margin': '15px','overflow': 'hidden'
			});

			options_menu.append(css_div);
			button_div.append(cancel_button);
			button_div.append(okay_button);
			options_menu.append(button_div);
			$('body').append(options_menu);
		} else {
			// we already created the div
			var boxPos = getDomainLSValue('box_position', 'top_right');
			$("input[name='location'][id='" + boxPos + "']").attr('checked','checked');
			if (global_hideStatusBox != 'true')
				$("input[name='visibility']").attr('checked','checked');
			$("input[name='interval']").val(global_updateFreq);
			$("input[name='yOffset']").val(global_SB_YOffset);
			ApplyStyle('sample_gsnatched', 'input_gsnatched');
			ApplyStyle('sample_tsnatched', 'input_tsnatched');
			ApplyStyle('sample_uploaded', 'input_uploaded');
			ApplyStyle('sample_leeching', 'input_leeching');
			ApplyStyle('sample_seeding', 'input_tsnatched', 'input_seeding');
			ApplyStyle('sample_ul_seed', 'input_uploaded', 'input_seeding');
			ApplyStyle('sample_bookmarked', 'input_bookmarked');
		}
	}

	function ApplyStyle(textControl, styleControl, styleControl2) {
		var css_style = $("input[id='" + styleControl + "']").val();
		if (styleControl2)
			css_style += $("input[id='" + styleControl2 + "']").val();
		SetStyle(textControl, css_style);
	}

	function SetStyle(textControl, css_style) {
		$("a[id='" + textControl + "']").removeAttr('style');
		$("a[id='" + textControl + "']").attr('style',css_style);
	}

	function CommitOptions() {
		var locRadio = $("input[name='location']:checked").attr('id');
		if (locRadio.length != 0) {
			setDomainLSValue('box_position',locRadio);
		}
		var boxHide = $("input[name='visibility']:checked");
		if (boxHide.length != 0) {
			deleteDomainLSValue('box_hidden');
		} else {
			setDomainLSValue('box_hidden','true');
			global_hideStatusBox = true;
			status.hide();
		}
		var updateFreq = $("input[name='interval']").val();
		if (jQuery.isNumeric(updateFreq)) {
			if (updateFreq != AUTO_UPDATE_INTERVAL) {
				if (updateFreq < 10) updateFreq = 10;
				setDomainLSValue('update_freq', updateFreq);
			}
			else
				deleteDomainLSValue('update_freq');
		}
		var offset = $("input[name='yOffset']").val();
		if (jQuery.isNumeric(offset) && offset >= 0) {
			if (offset != STATUS_BOX_YOFFSET)
				setDomainLSValue('box_yoffset', offset);
			else
				deleteDomainLSValue('box_yoffset');
		}
		AddOrDeleteCustomStyle('input_gsnatched',	GROUP_SNATCHED, 'style_groupsnatched',	'.group_snatched');
		AddOrDeleteCustomStyle('input_tsnatched',	T_SNATCHED, 	'style_tsnatched', 		'.gazelle_snatched');
		AddOrDeleteCustomStyle('input_uploaded',	UPLOADED, 		'style_uploaded', 		'.gazelle_uploaded');
		AddOrDeleteCustomStyle('input_leeching', 	LEECHING, 		'style_leeching', 		'.gazelle_leeching');
		AddOrDeleteCustomStyle('input_seeding', 	SEEDING, 		'style_seeding', 		'.gazelle_seeding');
		AddOrDeleteCustomStyle('input_bookmarked', 	BOOKMARKED, 	'style_bookmarked', 	'.gazelle_bookmark');
	}

	function AddOrDeleteCustomStyle(inputName, def_css, storageVal, className) {
		var css = jQuery.trim($("input[id='" + inputName + "']").val());
		if (css == def_css) {	// if the current css stripped of whitespace equals the default style, delete the custom style
			deleteDomainLSValue(storageVal);
			css = def_css;
			}
		else
			setDomainLSValue(storageVal, css);
		GM_addStyle(className + '{' + css + '}');	// updates the page without reloading (at least on chrome)
	}

	function DisplaySlideMenu(showMenu) {
		if (showMenu) {
			if (!slideMenuShowing) {
				slideMenuShowing = 1;
				$('#gazelle_options_menu').show().animate({
					top:'-=' + ($('#gazelle_options_menu').innerHeight()-10) + 'px'
				});
			}
		} else {
			slideMenuShowing = 0;
			$('#gazelle_options_menu').animate({
				top:'+=' + ($('#gazelle_options_menu').innerHeight()-10) + 'px'
			}, function () { $('#gazelle_options_menu').hide(); });
		}
	}
	/*****************************/
	/*** END OPTIONS PAGE CODE ***/
	/*****************************/

	/* Cache */
	function Cache(name, def_value) {
		var cache;
		return {
			serialize: function() {
				setDomainLSValue(name, JSON.stringify(cache));
			},
			unserialize: function() {
				cache = jQuery.parseJSON(getDomainLSValue(name, 'false'));
				if (!cache) cache = jQuery.extend({}, def_value); /* clone */
				return cache;
			},
			clear: function() {
				cache = jQuery.extend({}, def_value); /* clone */
				this.serialize();
			}
		};
	}

	function registerMenuCommand(oText, oFunc) {
		if(/firefox/i.test(navigator.userAgent))
			GM_registerMenuCommand(oText, oFunc);
		MenuCommandArray[MenuCommandArray.length] = [oText.replace("Gazelle Snatched: ",""),oFunc,oText.replace("Gazelle Snatched: ","").replace(" ","_")];
	}

	/************************************/
	/*** SCRIPT EXECUTION STARTS HERE ***/
	/************************************/

	/* Get gazelle base URL */
	var gazelle_url_base = location.protocol + '//' + location.hostname;

	/* Create proxy */
	var gazelle_proxy = ThrottledProxy(gazelle_url_base, 1000);

	/* Get user id of this user */
	var user_id = (function() {
		var m = $('#userinfo_username .username').eq(0).attr('href').match(/user\.php\?id=(\d+)/);
		if (m) return m[1];
		return null;
	})();

	if (!user_id) return; /* Exceptional condition: User ID not found */

	/* Create status box */
	// var server_version = GM_getLSValue("serverVersion", CURRENT_VERSION);
	var status = StatusBox('Gazelle Snatched');
	var options = doOptionsMenu();
	var slideMenuShowing = 0;

	/* backup what.cd cache */ /* TODO: Remove this eventually? */
	var whatcd_cache = GM_getLSValue('snatch_cache', {});
	if (whatcd_cache.length > 5) {
		whatcd_cache = jQuery.parseJSON(whatcd_cache);
		delete whatcd_cache.torrents;
		GM_setLSValue('whatcd_snatched_groups', JSON.stringify(whatcd_cache));
		console.warn('Saved what.cd snatched groups list for later use. -- You should not see this message again.');
		GM_deleteLSValue('snatch_cache');
	}

	var what_groups = GM_getLSValue('whatcd_snatched_groups', {});
	var snatched_groups = {};
	if (what_groups.length > 5) {
		what_groups = jQuery.parseJSON(what_groups);
		for (var group in what_groups.groups) {
			snatched_groups[what_groups.groups[group].nm.toLowerCase()] = { s: 'w', id: group };
		}
		// console.log(snatched_groups);
		if (chromeExtension) {
			storageObj.gazelle_snatched['whatcd_snatched_groups'] = what_groups;
			chromep.storage.local.set(storageObj);
		}
	}

	/* Cache of snatched torrents */
	var snatch_cache = Cache('snatch_cache', { groups: {}, torrents: {} });
	var bookmark_cache = Cache('bookmark_cache', { groups: {} });

	var MenuCommandArray = [];
	var hasPageGMloaded = false;

	/* Reset command */
	registerMenuCommand('Gazelle Snatched: Reset Snatched', function() {
		snatch_cache.clear();
		bookmark_cache.clear();
		setDomainLSValue('last_update', '0');
		setDomainLSValue('full_update', '1');
		setDomainLSValue('fullUpdateStarted', '1');
		location.reload();
	});
	/* Update w/o clear */
	registerMenuCommand('Gazelle Snatched: Update', function() {
		setDomainLSValue('last_update', '0');
		setDomainLSValue('full_update', '1');
		setDomainLSValue('force_all', '1');
		setDomainLSValue('fullUpdateStarted', '1');
		location.reload();
	});
	registerMenuCommand('Gazelle Snatched: Options', function() { DisplaySlideMenu(true); });

	doGMMenu();
	doOptionsMenu();

	/* Scan torrent table in doc and mark links as type in cache */
	function scan_torrent_page(doc, type) {
		var torrent_table = $(doc).find('#content > .thin > table').eq(0);
		if (torrent_table.length == 0) return 0;
		var found = 0;

		/* Old version: {"groups":{"2417":{"name":"pg.lost - Yes I Am"}}, "torrents":{941290:{type:"snatched", seeding:true}}} */
		/* New version: {"groups":{"2417":{"nm":"pg.lost - Yes I Am"}}, "torrents":{941290:{ty:"snatched", sd:1}}} // this was changed to save space */
		var d = snatch_cache.unserialize();
		torrent_table.find('div.group_info').each(function(i) {
			/* Find group and torrent ID */
			var group_id;
			var torrent_id;
			var link = $(this).children('a:last').eq(0);
			var m = link.attr('href').match(/torrents\.php\?id=(\d+)&torrentid=(\d+)/);
			if (m) {
				group_id = m[1];
				torrent_id = m[2];
			} else {
				/* I don't know if we can ever get here! */
				log("Not sure how Gazelle Snatched got here. Please notify Mordred with what you were doing");
				m = link.attr('href').match(/torrents\.php\?id=(\d+)/);
				if (m) {
					group_id = m[1];
					//link = $(this).children('td').eq(1).children('span').eq(0).children('a').eq(0);
					link = $(this).children('td').eq(1).find('span:first a:first').eq(0);
					m = link.attr('href').match(/torrents\.php\?action=download&id=(\d+)/);
					if (m) torrent_id = m[1];
				}
				if (!m) {
					status.contents().append('<div><span style="color: red;">Failed:</span> '+$(this).children('td').eq(1).text()+'</div>');
					z();	//purposely error out
				}
			}

			/* Save in cache */
			if (group_id && torrent_id) {
				// we are saving a type of "snatched" but when applying that class we have to apply it as "gazelle_snatched" due to gazelle having it's own .snatched style now
				if (!d.torrents[torrent_id] ||
						(type != 'seeding' && d.torrents[torrent_id].ty != type && !(type!='uploaded' && d.torrents[torrent_id].ty=='uploaded')) ||		// we have issues if you've snatched a torrent you uploaded, so uploaded takes precendence
						(type == 'seeding' && !d.torrents[torrent_id].sd)) {
					var reg = $(this).text().match(/.*\s]\s+(.+)\s(\[\d{4}\])\s-/);
					if (!reg)
						reg = $(this).text().match(/.*\s]\s+(.+)\s-?/);
					var nm = jQuery.trim(reg[1]);
					//trying alternate method
					//log($(this).clone().children('span, div, strong').remove().end().text());
					//var nm = jQuery.trim($(this).clone().children('span, div, strong').remove().end().text().match(/(.+)\s(\[|-)/)[1]);

					d.groups[group_id] = { nm: nm.replace(/"/g,"'") };
					if (type == 'seeding') { /* Special case seeding */
						if (d.torrents[torrent_id])
							d.torrents[torrent_id].sd = 1;
						else
							d.torrents[torrent_id] = { ty: 'seeding', sd: 1 };
					} else {
						if (d.torrents[torrent_id])
							d.torrents[torrent_id].ty = type;
						else
							d.torrents[torrent_id] = { ty: type, sd: 0 };
					}
					//log ("adding:" + nm + " with group_id="+group_id+", torrent_id="+torrent_id);
					found += 1;
				}
			}
		});

		if (found == 0) return 0;

		snatch_cache.serialize();
		return found;
	}

	function scan_bookmark_page(doc) {
		//log ('scanning bookmark page');
		var torrent_table = $(doc).find('#torrent_table').eq(0);
		if (torrent_table.length == 0) return 0;
		var found = 0;

		bookmark_cache.clear();		// makes sense not to save bookmarks because they get added/removed a lot and it's just one page
		var b = bookmark_cache.unserialize();
		torrent_table.find('tr.group.discog').each(function(i) {
			/* Find group and torrent ID */
			var group_id;

			var link = $(this).find('strong a:last').eq(0);
			var m = link.attr('href').match(/torrents\.php\?id=(\d+)/);
			if (m) {
				group_id = m[1];
				b.groups[group_id] = 1;
				found++;
				}
			//log (found + ". group_id:" + group_id + " - " + link.text());
		});
		torrent_table.find('tr.torrent').each(function(i) {	// single, non-music torrents show up not in a group
			/* Find group and torrent ID */
			var group_id;

			var link = $(this).find('strong a:last').eq(0);
			var m = link.attr('href').match(/torrents\.php\?id=(\d+)/);
			if (m) {
				group_id = m[1];
				b.groups[group_id] = 1;
				found++;
				}
			//log (found + ". group_id:" + group_id + " - " + link.text());
		});
		bookmark_cache.serialize();
		return found;
	}

	/* Fetch and scan all pages of type, call callback when done */
	function scan_all_torrent_pages(type, page_cb, finish_cb, forced_full) {
		var page = 1;
		var total = 0;
		var lastPage = 0;

		function request_url() {
			if (type == 'bookmark')
				return '/bookmarks.php?type=torrents';
			else
				return '/torrents.php?type='+type+'&userid='+user_id+'&page='+page;
		}

		function error_handler(response, reason) {
			status.contents().append('<div><span style="color: red;">Error:</span> Unable to fetch '+type+' page '+page+' ('+reason+')</div>');
			status.show();
			finish_cb(total);
		}

		function page_handler(response) {
			if (response.status == 200) {
				//pageText = response.responseText.replace(/collageShow.*\);/g,";");
				//log (pageText);
				var doc = document.implementation.createHTMLDocument('');
				doc.documentElement.innerHTML = response.responseText; //.replace(/<head>[\s\S]*<\/head>/,"<head><\/head>");

				page_cb(type, page);

				if (forced_full) {
					lastPage = 1;
					$(doc).find('#content .linkbox').eq(0).find('a:last').each(function(i) {
						var pgVal = $(this).attr('href').match(/torrents\.php\?page=(\d+)&type/);
						lastPage = pgVal[1];
					});
				}
				if (type == 'bookmark') {
					var found = scan_bookmark_page(doc);
				} else {
					var found = scan_torrent_page(doc, type);
				}
				total += found;
				if ((!found && !forced_full) || (forced_full && page >= lastPage) || (type == 'bookmark')) {
					finish_cb(type, total);
					return;
				} /* End of asynchronous chain */

				page += 1;
				gazelle_proxy.get({ url: request_url(), callback: page_handler, error: error_handler });
			} else {
				error_handler(response, 'HTTP '+response.status);
			}
		}
		gazelle_proxy.get({ url: request_url(), callback: page_handler, error: error_handler });
	}

	function parse_json_api(type, page_cb, finish_cb) {
		function error_handler(response, reason) {
			status.contents().append('<div><span style="color: red;">Error:</span> Unable to fetch '+type+'s ('+reason+')</div>');
			status.show();
			finish_cb(total);
		}
		// if the API gets expanded to other types, we won't hard code the URL here
		jQuery.getJSON('/ajax.php?action=bookmarks&type=torrents', function (data) {
			bookmark_cache.clear();		// we don't need to save the old bookmarks
			var b = bookmark_cache.unserialize();
			jQuery.each(data.response.bookmarks, function (key,val) {
				b.groups[val.id] = 1;
				//log("id:"+ val.id + " - name:" + val.name);
			});
			finish_cb(type, data.response.bookmarks.length);
			bookmark_cache.serialize();
		})
		.fail(function(jqXHR, textStatus) {
			error_handler("null",textStatus);
		});
	}

	/* Mark all links to torrents that are snatched/uploaded/leeching/seeding/bookmarked */
	function mark_snatched_links() {
		var d = snatch_cache.unserialize();
		var b = bookmark_cache.unserialize();

		/* Go through all links */
		$('#content a').each(function(i) {
			var href = $(this).attr('href');
			if (href) {
				var group_id;
				var torrent_id;

				/* Find and mark links to snatched torrents */
				var m = href.match(/torrents\.php\?id=(\d+)&torrentid=(\d+)/);
				if (m) {
					group_id = m[1];
					torrent_id = m[2];
				} else {
					m = href.match(/torrents\.php\?torrentid=(\d+)/);
					if (m) {
						torrent_id = m[1];
					} else {
						m = href.match(/torrents\.php\?id=(\d+)/);
						if (m) group_id = m[1];
					}
				}

				/* Add classes */
				if (group_id && d.groups[group_id] &&
						(!torrent_id || !$(this).parent().parent().is('.group_torrent')) && !$(this).is('.post_id')) {
					$(this).addClass('group_snatched');
				}
				if (group_id && b.groups[group_id] && !(/\/bookmarks\.php/.test(document.URL)) &&
						!(/\/user\.php/.test(document.URL)) &&
						(!torrent_id || !$(this).parent().parent().is('.group_torrent')) && !$(this).is('.post_id')) {
					$(this).addClass('gazelle_bookmark');
				}
				if (torrent_id && d.torrents[torrent_id]) {
					if (d.torrents[torrent_id].ty == 'snatched')
						$(this).addClass('gazelle_snatched');	// we can't use .snatched anymore because what has now added it's own .snatched class
					else if (d.torrents[torrent_id].ty == 'uploaded')
						$(this).addClass('gazelle_uploaded');
					else if (d.torrents[torrent_id].ty == 'leeching')
						$(this).addClass('gazelle_leeching');
					if (d.torrents[torrent_id].sd) {
						if (d.torrents[torrent_id].ty != 'uploaded')
							$(this).addClass('gazelle_seeding gazelle_snatched');	// we're really just marking seeding here, but you can't seed if you haven't snatched so adding that class as well
						else
							$(this).addClass('gazelle_seeding');
						}
				}

				/* Change text if text is url */
				if (('/'+$(this).text()) == $(this).attr('href')
					&& group_id && d.groups[group_id] && d.groups[group_id].nm) {
					$(this).text(d.groups[group_id].nm);
				}
			}
		});

		/* Mark links on album page in torrent table */
		if (/\/torrents\.php/.test(document.URL)) {
			/* Parse search */
			var search = {};
			var search_list = document.location.search.substring(1).split('&');
			for (var i = 0; i < search_list.length; i++) {
				var pair = search_list[i].split('=');
				search[pair[0]] = pair[1];
			}

			if (search.id) {
				/* Album page */
				$('#content .torrent_table:first tr.group_torrent').each(function(i) {
					/* Find torrent id */
					var torrent_id;
					$(this).find('td:first span:first a').each(function(i) {
						var href = $(this).attr('href');
						if (href) {
							var m = href.match(/torrents\.php\?torrentid=(\d+)/);
							if (m) {
								// the permalink automatically gets the style applied to it, so we need to remove it here and then manually add it to the text below
								torrent_id = m[1];
								$(this).removeClass('group_snatched gazelle_snatched gazelle_uploaded gazelle_leeching gazelle_seeding');
								return false;
							}
						}
					});

					if (torrent_id && d.torrents[torrent_id]) {
						var link = $(this).find('td:first a:last');
						if (d.torrents[torrent_id].ty == 'snatched')
							link.addClass('gazelle_snatched');	// we can't use .snatched anymore because what has now added it's own .snatched class
						else if (d.torrents[torrent_id].ty == 'uploaded')
							link.addClass('gazelle_uploaded');
						else if (d.torrents[torrent_id].ty == 'leeching')
							link.addClass('gazelle_leeching');
						if (d.torrents[torrent_id].sd) {
							if (d.torrents[torrent_id].ty != 'uploaded')
								link.addClass('gazelle_seeding gazelle_snatched');	// we're really just marking seeding here, but you can't seed if you haven't snatched so setting that class too
							else
								link.addClass('gazelle_seeding');
							}
					}
				});
			}
		}

		/* Show bookmark link on bookmarked album page */
		if (/\/torrents\.php\?id/.test(document.URL)) {
			var group_id;
			var albumName = $('#content > .thin > .header > h2 > span').eq(0);
			var mark_snatched;
			if (albumName) {
				var m = document.URL.match(/torrents\.php\?id=(\d+)/);
				if (m) {
					group_id = m[1];
					if (b.groups[group_id])
						albumName.addClass('gazelle_bookmark');
				}
			}

			/* show mark/unmark snatched on album page */
			if ($("a.add_bookmark").length && !$("#mark_snatched").length) {
				if (d.groups[group_id])
					mark_snatched = $('<a href="#" id="mark_snatched" class="brackets">Unmark Snatched</a>');
				else
					mark_snatched = $('<a href="#" id="mark_snatched" class="brackets">Mark Snatched</a>');

				mark_snatched.on("click", function () {
					var d = snatch_cache.unserialize();
					if (d.groups[group_id]) {
						delete d.groups[group_id]
						mark_snatched.text("Mark Snatched");
					} else {
						d.groups[group_id] = { nm: albumName.text().replace(/"/g,"'") };
						mark_snatched.text("Unmark Snatched");
					}
					snatch_cache.serialize();
				});
				mark_snatched.insertAfter(".add_bookmark");
				var spacing = $('<b> </b>');	// just used to add spacing
				spacing.insertAfter(".add_bookmark");
			}

		}

		/* Mark previously snatched groups */
		if (/\/artist\.php\?id/.test(document.URL)) {
			var artist = $('#content .header h2').text();
			$('#content a[href^="torrents.php?id="].tooltip').each(function () {
				var album = $(this)[0].innerText;
				var key = (artist + ' - ' + album).toLowerCase();
				if (snatched_groups[key]) {
					addGroupSnatched(key, snatched_groups[key], this);
				}
			});
		}

		if (/\/bookmarks\.php\?type=torrents/.test(document.URL)) {
			$('tr.group.discog td:nth-of-type(3) strong').each(function () {
				var key = this.innerText.replace(/\[\d*\]/, '').trim().toLowerCase();
				if (snatched_groups[key]) {
					addGroupSnatched(key, snatched_groups[key], $(this).contents().filter('a.tooltip')[0]);
				}
			});
		}

		if (/\/top10\.php/.test(document.URL) || /\/torrents\.php\?action=notify/.test(document.URL)) {
			$('td div.group_info > strong').each(function () {
				var key = this.innerText.replace(releaseTypeRegex,'').replace(/\[\d*\]/, '').trim().toLowerCase();
				if (snatched_groups[key]) {
					addGroupSnatched(key, snatched_groups[key], $(this).contents().filter('a.tooltip')[0]);
				}
			});
		}

		if (/\/torrents.php\?id=/.test(document.URL)) {
			var header = $('#content .header h2').text();
			var key = header.replace(releaseTypeRegex,'').replace(/\[\d*\]/, '').trim().toLowerCase();
			if (snatched_groups[key]) {
				addGroupSnatched(key, snatched_groups[key], $('#content .header h2 span')[0]);
			}
		}
	}

	function addGroupSnatched(name, key, element) {
		switch (key.s) {
			case 'w':	// what.cd
				$(element).addClass('group_snatched whatcd_group');
				break;
			case 'a':	// apollo
				break;
			case 'p':	// PTH
				break;
		}
		// console.log(key.id, name);
	}

	/* Mark torrent as leeching when download link is clicked */
	function mark_download_links() {
		$('#content').find('a').each(function(i) {
			var href = $(this).attr('href');
			if (href) {
				/* Find download links */
				var m = href.match(/torrents\.php\?action=download&id=(\d+)/);
				if (m) {
					var torrent_id = m[1];
					$(this).click(function(event) {
						var d = snatch_cache.unserialize();
						d.torrents[torrent_id] = { ty: 'leeching', sd: 0 };
						snatch_cache.serialize();
						mark_snatched_links();
					});
				}
			}
		});
	}

	function mark_bookmark_links() {
		$('#content').find('a').each(function(i) {
			var id = $(this).attr('id');
			if (id) {
				/* Find download links */
				var m = id.match(/bookmarklink_torrent_(\d+)/);
				if (m) {
					//log (m);
					var group_id = m[1];
					$(this).click(function(event) {
						if (!/remove/i.test($(this).text()) && !/unbookmark/i.test($(this).text())) {
							var b = bookmark_cache.unserialize();
							b.groups[group_id] = 1;
							bookmark_cache.serialize();
							mark_snatched_links();
						} else {
							var b = bookmark_cache.unserialize();
							delete b.groups[group_id];
							bookmark_cache.serialize();
							$('#content').find('a.gazelle_bookmark').each(function(i) {
								var href = $(this).attr('href');
								torrentString = 'torrents.php?id='+group_id;
								if (href && href=='torrents.php?id='+group_id) {
									$(this).removeClass('gazelle_bookmark');
								}
							});
							$('#content > .thin > .header > h2 > span').eq(0).removeClass('gazelle_bookmark');
						}
					});
				}
			}
		});
	}

	/* This function was hacked from a generic one and converted to jQuery to work better with Gazelle Snatched.
	   If you'd like to see that version it's here: http://userscripts.org/scripts/show/68559 */
	function doGMMenu() {
		// jQuery Version
		if( !MenuCommandArray.length ) { return; }
		var mdiv = $('<div></div>');
		$.each(MenuCommandArray, function(i, value) {
			if (i+1<MenuCommandArray.length)
				var mEntry = $('<span><a href="#" id="'+ MenuCommandArray[i][2] +'">' + MenuCommandArray[i][0] + '</a>\u00A0\u00A0|\u00A0\u00A0</span>');
			else
				var mEntry = $('<a href="#" id="'+ MenuCommandArray[i][2] +'">' + MenuCommandArray[i][0] + '</a>');
			mEntry.click(function () { MenuCommandArray[i][1](arguments[0]); var e = arguments[0]; e.stopPropagation(); return false; });
			mdiv.append(mEntry);
		});
		status.contents().append(mdiv);
	}

	/* Scan current page */
	if (/\/torrents\.php/.test(document.URL)) {
		/* Parse search */
		var search = {};
		var search_list = document.location.search.substring(1).split('&');
		for (var i = 0; i < search_list.length; i++) {
			var pair = search_list[i].split('=');
			search[pair[0]] = pair[1];
		}

		var full_update = parseInt(getDomainLSValue('full_update','0')) ? true : false;

		if ((search.type == 'snatched' || search.type == 'uploaded' || search.type == 'seeding' || search.type == 'leeching') &&
				search.userid == user_id && !full_update) {
			var scan_status = $('<div>Scanning current page... <span></span></div>');
			status.contents().append(scan_status);
			status.show();

			/* Scan current page */
			var found = scan_torrent_page(document, search.type);
			scan_status.children('span').text('Done ('+((found > 0) ? (found+' updates found') : 'no updates found')+')');
			status.show(5000);
		}
	}
	if (/\/bookmarks\.php(?!.action=edit)/i.test(document.URL)) {
		var scan_status = $('<div>Scanning current page... <span></span></div>');
		status.contents().append(scan_status);
		status.show();

		bookmark_cache.clear();
		var found = scan_bookmark_page(document);

		scan_status.children('span').text(((found > 0) ? (found+' bookmarks found') : 'no bookmarks found'));
		status.show(5000);
	}

	/* Mark links */
	mark_download_links();
	mark_bookmark_links();
	mark_snatched_links();

	/*******************************/
	/*** AUTO-UPDATE STARTS HERE ***/
	/*******************************/
	var now = new Date();
	var just_updated = 0;
	var last_update = parseInt(getDomainLSValue('last_update', '0'));
	var next_update = last_update + global_updateFreq*60*1000;
	var full_update = parseInt(getDomainLSValue('full_update','0')) ? true : false;
	var forced_full = parseInt(getDomainLSValue('force_all','0')) ? true : false;

	// if (scriptVersion != CURRENT_VERSION) {
	// 	log("Script was recently updated to " + CURRENT_VERSION);
	// 	// the script was recently updated
	// 	GM_setLSValue('script_version', CURRENT_VERSION);
	// 	//deleteDomainLSValue('snatch_cache');		// Had to reset this due to changes in the cache structure. Will remove in a version or two.
	// 	deleteDomainLSValue('serverVersion');		// we remove this just to make sure it will be properly retrieved in the future
	// 	deleteDomainLSValue('lastUpdateCheck');
	// 	deleteDomainLSValue('last_update');
	// 	just_updated = 1;						// location.reload is called after we reach the end of this function so we don't want the script to continue executing before reloading first
	// 	location.reload();
	// }
	if (full_update) {
		deleteDomainLSValue('full_update');
		deleteDomainLSValue('last_update');
		deleteDomainLSValue('force_all');
		next_update = 0;
		last_update = 0;
		}
	if (next_update < now.getTime() && just_updated!=1) {
		setDomainLSValue('last_update', now.getTime().toString());
		var fullUpdateFinished = getDomainLSValue('fullUpdateStarted', '0');
		var jobs = 5;
		var total_found = {};

		/* Show auto update status */
		last_update = 0;
		if (last_update == 0) {
			var update_status = {
				snatched: $('<div>Updating snatched: <span>Initializing...</span></div>'),
				uploaded: $('<div>Updating uploaded: <span>Initializing...</span></div>'),
				leeching: $('<div>Updating leeching: <span>Initializing...</span></div>'),
				seeding: $('<div>Updating seeding: <span>Initializing...</span></div>'),
				bookmark: $('<div>Updating bookmarks: <span>Initializing...</span></div>'),
			};
			for (var type in update_status) status.contents().append(update_status[type]);
			status.show();
		}

		function scan_page_handler(type, page) {
			if (last_update == 0) {
				update_status[type].children('span').text('Page '+page+'...');
				status.show();
			}
		}

		function scan_finished_handler(type, found) {
			if (last_update == 0) {
				if (type != 'bookmark')
					update_status[type].children('span').text('Done ('+((found > 0) ? (found+' updates found') : 'no updates found')+')');
				else
					update_status[type].children('span').text('Done ('+((found > 0) ? (found+' bookmarks found') : 'no bookmarks found')+')');
			}

			jobs -= 1;
			total_found[type] = found;

			if (jobs == 0) {
				mark_snatched_links();
				if (last_update == 0) {
					var total = [];
					for (var type in total_found)
						if (total_found[type] > 0)
							total.push(type+': '+total_found[type]);
					status.contents().append('<div>Auto update done</div>');
					deleteDomainLSValue('fullUpdateStarted');
					status.show(5000);
				}
			}
		}

		/* Rescan all types of torrent lists */
		if (fullUpdateFinished == 1) {
			forced_full = true;
		}
		scan_all_torrent_pages('snatched', scan_page_handler, scan_finished_handler, forced_full);
		scan_all_torrent_pages('uploaded', scan_page_handler, scan_finished_handler, forced_full);
		scan_all_torrent_pages('leeching', scan_page_handler, scan_finished_handler, forced_full);
		scan_all_torrent_pages('seeding',  scan_page_handler, scan_finished_handler, forced_full);
		//scan_all_torrent_pages('bookmark', scan_page_handler, scan_finished_handler, forced_full);

		parse_json_api('bookmark', scan_page_handler, scan_finished_handler);
	}

	/**********************************/
	/*** SCRIPT EXECUTION ENDS HERE ***/
	/**********************************/

	function getDomainLSValue (key, defaultValue) {
		return GM_getLSValue (domain_prefix + key, defaultValue);
	}
	function setDomainLSValue (key, value) {
		return GM_setLSValue (domain_prefix + key, value);
	}
	function deleteDomainLSValue (key) {
		return GM_deleteLSValue (domain_prefix + key);
	}
})();