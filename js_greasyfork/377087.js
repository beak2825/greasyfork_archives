// ==UserScript==
// @name        BraZZers+
// @author      GugZi
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Add external search links most popular torrent sites to BraZZers. Every feature can be enabled/disabled in settings.
// @include     http*://www.brazzers.com/scenes/view/id/*
// @include     http*://www.brazzers.com/series/*/*/episode/*/*/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/377087/BraZZers%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377087/BraZZers%2B.meta.js
// ==/UserScript==
//
jQuery(document).ready(function($) {
	var m = {};
	// m.Id = getMovieId();
	m.Tt = getMovieTt();
	// m.TtYr = getMovieTt() + "+" + getMovieYr();
	var l = {};
	// Info
	l.rb = ["RARBG", "https://www.proxyrarbg.org/torrents.php?search=" + m.Tt, "http://proxyrarbg/favicon.ico"];
	// Functions

    // function getMovieId() {
	//	 var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	//	 return id;
	// }

	function getMovieTt() {
        try {
            var title = document.getElementsByClassName("scene-title")[0].innerHTML;
            return title.substring(0,title.indexOf("<"));
            console.log('BraZZers+: Grabbed title - ')
        }
        catch(err) {
            alert("Can't get Title " + err.message);
        }
	}

	// function getMovieYr() {
	// 	 var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	// 	 return encodeURIComponent(year);
	// }

	function BraZZersPlusStyle() {
		var s = '.video-data.clearfix #BraZZersPlus { padding: 20px 0 0 0px; }'
              + '.video-data.clearfix #BraZZersPlus a { margin: 5px 5px; }'
              + '.video-data.clearfix #BraZZersPlus #BraZZersPlus-Feature-Settings { margin-left: 1px; }'
              + 'hr { border: 1px solid #404040; }'

              + '#action-box #BraZZersPlus #BraZZersPlus-Feature-Settings { margin-top: 10px; }'
              + '#BraZZersPlus-SettingsBox { background-color: #2B2B2B; box-shadow: 0px 0px 300px 1000px rgba(0,0,0,0.75); color: white; display: none; margin-left: -404px; padding: 20px; position: fixed; top: 30%; left: 50%; width: 768px; z-index: 999; }'
              + '#BraZZersPlus-SettingsBox > h2 { font-size: 21px }'
              + '#BraZZersPlus-SettingsBox #BraZZersPlus-Options { margin: 20px 0;}'
              + '#BraZZersPlus-SettingsBox #BraZZersPlus-Options .BraZZersPlus-OptionField label { display: inline-block; width: 150px; }'
              + '#BraZZersPlus-SettingsBox button { background: -webkit-linear-gradient(top, #666 0%, #2b2b2b 50%, #0a0e0a 51%, #0a0809 100%) !important; border: none; margin: 8px 0 0; }'
              + '#BraZZersPlus-SettingsBox #BraZZersPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
        console.log('BraZZers+: Style Added')
	}

	function BraZZersPlusInit() {
		var fh, oh;
		fh = '<div id="BraZZersPlus"><hr>';
		oh = '<div id="BraZZersPlus-SettingsBox" class="aux-content-widget-2"><h2>BraZZers+ Options</h2><ul id="BraZZersPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("BraZZersPlus-Option-" + val[0], 1)) {
				fh += '<a class="BraZZersPlus-Button linkasbutton-secondary" id="BraZZersPlus-Feature-'
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
			oh += '<li id="BraZZersPlus-Option-'
                + val[0]
                + '-Field" class="BraZZersPlus-OptionField"><label for="BraZZersPlus-Option-'
                + val[0]
                + '">'
                + val[0]
                + '</label> <input id="BraZZersPlus-Option-'
                + val[0]
                + '" type="checkbox"'
                + ((GM_getValue("BraZZersPlus-Option-"
                + val[0], 1)) ? ' checked' : '')
                + '></li>';
		});
		fh += '<a class="BraZZersPlus-Button linkasbutton-secondary" id="BraZZersPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a><hr></div>';
		oh += '</ul><hr>'
            + '<button id="BraZZersPlus-SettingsBox-Save" class="primary">Save</button>'
            + '<button id="BraZZersPlus-SettingsBox-Close" class="primary">Close</button>'
            + '</div>';
		BraZZersPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '.video-data.clearfix').append(fh);
		$('body').append(oh);
        console.log('BraZZers+: Created HTML')
	}
	BraZZersPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#BraZZersPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#BraZZersPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.BraZZersPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#BraZZersPlus-Feature-Settings').click(showOpts);
	$('#BraZZersPlus-SettingsBox-Close').click(hideOpts);
	$('#BraZZersPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});