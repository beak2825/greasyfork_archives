// ==UserScript==
// @name        RealityKings+
// @author      GugZi
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Add external search links most popular torrent sites to RealityKings. Every feature can be enabled/disabled in settings.
// @include     http*://www.realitykings.com/tour/video/watch/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/377086/RealityKings%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377086/RealityKings%2B.meta.js
// ==/UserScript==
//
jQuery(document).ready(function($) {
	var m = {};
	// m.Id = getMovieId();
	m.Tt = getMovieTt();
	// m.TtYr = getMovieTt() + "+" + getMovieYr();
	var l = {};
	// Info
	l.rb = ["RARBG", "http://rarbgmirror.xyz/torrents.php?search=" + m.Tt, "https://rarbgmirror.xyz/favicon.ico"];
	// Functions

    // function getMovieId() {
	//	 var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	//	 return id;
	// }

	function getMovieTt() {
        try {
            var el = $("h1").eq(0), text = el.text();
            return $.trim(text);
        }
        catch(err) {
            alert("Can't get Title " + err.message);
        }
        console.log('RealityKings+: Grabbed title')
	}

	// function getMovieYr() {
	// 	 var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	// 	 return encodeURIComponent(year);
	// }

	function RealityKingsPlusStyle() {
		var s = '#trailerbox #RealityKingsPlus {  }'
              + '#trailerbox #RealityKingsPlus a { margin: 5px 5px; }'
              + '#trailerbox #RealityKingsPlus #RealityKingsPlus-Feature-Settings { margin-left: 1px; }'
              + 'hr { border: 1px solid #404040; }'

              + '#action-box #RealityKingsPlus #RealityKingsPlus-Feature-Settings { margin-top: 10px; }'
              + '#RealityKingsPlus-SettingsBox { background-color: #2B2B2B; box-shadow: 0px 0px 300px 1000px rgba(0,0,0,0.75); color: white; display: none; margin-left: -404px; padding: 20px; position: fixed; top: 30%; left: 50%; width: 768px; z-index: 999; }'
              + '#RealityKingsPlus-SettingsBox > h2 { font-size: 21px }'
              + '#RealityKingsPlus-SettingsBox #RealityKingsPlus-Options { margin: 20px 0;}'
              + '#RealityKingsPlus-SettingsBox #RealityKingsPlus-Options .RealityKingsPlus-OptionField label { display: inline-block; width: 150px; }'
              + '#RealityKingsPlus-SettingsBox button { background: -webkit-linear-gradient(top, #666 0%, #2b2b2b 50%, #0a0e0a 51%, #0a0809 100%) !important; border: none; margin: 8px 0 0; }'
              + '#RealityKingsPlus-SettingsBox #RealityKingsPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
        console.log('RealityKings+: Style Added')
	}

	function RealityKingsPlusInit() {
		var fh, oh;
		fh = '<div id="RealityKingsPlus"><hr>';
		oh = '<div id="RealityKingsPlus-SettingsBox" class="aux-content-widget-2"><h2>RealityKings+ Options</h2><ul id="RealityKingsPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("RealityKingsPlus-Option-" + val[0], 1)) {
				fh += '<a class="RealityKingsPlus-Button linkasbutton-secondary" id="RealityKingsPlus-Feature-'
                    + val[0]
                    + '" href="'
                    + val[1]
                    + '" target="_blank" title="'
                    + val[0]
                    + '"><img alt="'
                    + val[0]
                    + '" src="'
                    + val[2]
                    + '" width="16" height="16"></a>';
			}
			oh += '<li id="RealityKingsPlus-Option-'
                + val[0]
                + '-Field" class="RealityKingsPlus-OptionField"><label for="RealityKingsPlus-Option-'
                + val[0]
                + '">'
                + val[0]
                + '</label> <input id="RealityKingsPlus-Option-'
                + val[0]
                + '" type="checkbox"'
                + ((GM_getValue("RealityKingsPlus-Option-"
                + val[0], 1)) ? ' checked' : '')
                + '></li>';
		});
		fh += '<a class="RealityKingsPlus-Button linkasbutton-secondary" id="RealityKingsPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a><hr></div>';
		oh += '</ul><hr>'
            + '<button id="RealityKingsPlus-SettingsBox-Save" class="primary">Save</button>'
            + '<button id="RealityKingsPlus-SettingsBox-Close" class="primary">Close</button>'
            + '</div>';
		RealityKingsPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '#trailerbox').append(fh);
		$('body').append(oh);
        console.log('RealityKings+: Created HTML')
	}
	RealityKingsPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#RealityKingsPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#RealityKingsPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.RealityKingsPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#RealityKingsPlus-Feature-Settings').click(showOpts);
	$('#RealityKingsPlus-SettingsBox-Close').click(hideOpts);
	$('#RealityKingsPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});