// ==UserScript==
// @name        DigitalPlayground+
// @author      GugZi
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Add external search links most popular torrent sites to DigitalPlayground. Every feature can be enabled/disabled in settings.
// @include     http*://www.digitalplayground.com/*/trailer/*/*/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/377088/DigitalPlayground%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377088/DigitalPlayground%2B.meta.js
// ==/UserScript==
//
jQuery(document).ready(function($) {
	var m = {};
	m.Tt = getMovieTt();
	var l = {};
	// Info
	l.rb = ["RARBG", "http://rarbgmirror.xyz/torrents.php?search=" + m.Tt, "https://rarbgmirror.xyz/favicon.ico"];
	// Functions

    // function getMovieId() {
	//	 var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	//	 return id;
	// }

    function myTrim(x) {
        return x.replace(/.\/?[a-z][a-z0-9]*[^<>]*>/igm,'');
    }

	function getMovieTt() {
        try {
            var title = document.getElementsByClassName("player-title")[0].innerHTML;
            var n = title.substring(0,title.indexOf("</h1>")).trim();
            return myTrim(n);
        }
        catch(err) {
            alert("DigitalPlayground+\nCan't get Title\n" + err.message);
        }
        console.log('BraZZers+: Grabbed title - ', n)
	}

	// function getMovieYr() {
	// 	 var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	// 	 return encodeURIComponent(year);
	// }

	function DigitalPlaygroundPlusStyle() {
		var s = '.player-video #DigitalPlaygroundPlus { padding: 10px 0 10px 0px; }'
              + '.player-video #DigitalPlaygroundPlus a { margin: 5px 5px; }'
              + '.player-video #DigitalPlaygroundPlus #DigitalPlaygroundPlus-Feature-Settings { margin-left: 1px; }'
              + 'hr { display: none; border: none; }'

              + '#action-box #DigitalPlaygroundPlus #DigitalPlaygroundPlus-Feature-Settings { margin-top: 10px; }'
              + '#DigitalPlaygroundPlus-SettingsBox { background-color: #2B2B2B; box-shadow: 0px 0px 300px 1000px rgba(0,0,0,0.75); color: white; display: none; margin-left: -404px; padding: 20px; position: fixed; top: 30%; left: 50%; width: 768px; z-index: 999; }'
              + '#DigitalPlaygroundPlus-SettingsBox > h2 { font-size: 21px }'
              + '#DigitalPlaygroundPlus-SettingsBox #DigitalPlaygroundPlus-Options { margin: 20px 0;}'
              + '#DigitalPlaygroundPlus-SettingsBox #DigitalPlaygroundPlus-Options .DigitalPlaygroundPlus-OptionField label { display: inline-block; width: 150px; }'
              + '#DigitalPlaygroundPlus-SettingsBox button { background: -webkit-linear-gradient(top, #666 0%, #2b2b2b 50%, #0a0e0a 51%, #0a0809 100%) !important; border: none; margin: 8px 0 0; }'
              + '#DigitalPlaygroundPlus-SettingsBox #DigitalPlaygroundPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
        console.log('DigitalPlayground+: Style Added')
	}

	function DigitalPlaygroundPlusInit() {
		var fh, oh;
		fh = '<div id="DigitalPlaygroundPlus"><hr>';
		oh = '<div id="DigitalPlaygroundPlus-SettingsBox" class="aux-content-widget-2"><h2>DigitalPlayground+ Options</h2><ul id="DigitalPlaygroundPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("DigitalPlaygroundPlus-Option-" + val[0], 1)) {
				fh += '<a class="DigitalPlaygroundPlus-Button linkasbutton-secondary" id="DigitalPlaygroundPlus-Feature-'
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
			oh += '<li id="DigitalPlaygroundPlus-Option-'
                + val[0]
                + '-Field" class="DigitalPlaygroundPlus-OptionField"><label for="DigitalPlaygroundPlus-Option-'
                + val[0]
                + '">'
                + val[0]
                + '</label> <input id="DigitalPlaygroundPlus-Option-'
                + val[0]
                + '" type="checkbox"'
                + ((GM_getValue("DigitalPlaygroundPlus-Option-"
                + val[0], 1)) ? ' checked' : '')
                + '></li>';
		});
		fh += '<a class="DigitalPlaygroundPlus-Button linkasbutton-secondary" id="DigitalPlaygroundPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a><hr></div>';
		oh += '</ul><hr>'
            + '<button id="DigitalPlaygroundPlus-SettingsBox-Save" class="primary">Save</button>'
            + '<button id="DigitalPlaygroundPlus-SettingsBox-Close" class="primary">Close</button>'
            + '</div>';
		DigitalPlaygroundPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '.player-video').append(fh);
		$('body').append(oh);
        console.log('DigitalPlayground+: Created HTML')
	}
	DigitalPlaygroundPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#DigitalPlaygroundPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#DigitalPlaygroundPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.DigitalPlaygroundPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#DigitalPlaygroundPlus-Feature-Settings').click(showOpts);
	$('#DigitalPlaygroundPlus-SettingsBox-Close').click(hideOpts);
	$('#DigitalPlaygroundPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});