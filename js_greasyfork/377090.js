// ==UserScript==
// @name        NaughtyAmerica+
// @author      GugZi
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Add external search links most popular torrent sites to NaughtyAmerica. Every feature can be enabled/disabled in settings.
// @include     http*://tour.naughtyamerica.com/scene/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/377090/NaughtyAmerica%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377090/NaughtyAmerica%2B.meta.js
// ==/UserScript==
//
jQuery(document).ready(function($) {
	var m = {};
	// m.Id = getMovieId();
	m.Tt = getMovieTt();
	// m.TtYr = getMovieTt() + "+" + getMovieYr();
	var l = {};
	// Info
	l.rb = ["RARBG", "http://rarbgmirror.xyz/torrents.php?search=" + m.Tt, "http://rarbgmirror.xyz/favicon.ico"];
	// Functions

    // function getMovieId() {
	//	 var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	//	 return id;
	// }

	function getMovieTt() {
        try {
            var title = document.getElementsByClassName("scene-title")[0].innerHTML;
            return title.substring(0,title.indexOf("<"));
            console.log('NaughtyAmerica+: Grabbed title - ')
        }
        catch(err) {
            alert("Can't get Title " + err.message);
        }
	}

	// function getMovieYr() {
	// 	 var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	// 	 return encodeURIComponent(year);
	// }

	function NaughtyAmericaPlusStyle() {
		var s = '.signup-options #NaughtyAmericaPlus { padding: 20px 0 0 0px; }'
              + '.signup-options #NaughtyAmericaPlus a { margin: 5px 5px; }'
              + '.signup-options #NaughtyAmericaPlus #NaughtyAmericaPlus-Feature-Settings { margin-left: 1px; }'
              + 'hr { border: 1px solid #404040; }'

              + '#action-box #NaughtyAmericaPlus #NaughtyAmericaPlus-Feature-Settings { margin-top: 10px; }'
              + '#NaughtyAmericaPlus-SettingsBox { background-color: #2B2B2B; box-shadow: 0px 0px 300px 1000px rgba(0,0,0,0.75); color: white; display: none; margin-left: -404px; padding: 20px; position: fixed; top: 30%; left: 50%; width: 768px; z-index: 999; }'
              + '#NaughtyAmericaPlus-SettingsBox > h2 { font-size: 21px }'
              + '#NaughtyAmericaPlus-SettingsBox #NaughtyAmericaPlus-Options { margin: 20px 0;}'
              + '#NaughtyAmericaPlus-SettingsBox #NaughtyAmericaPlus-Options .NaughtyAmericaPlus-OptionField label { display: inline-block; width: 150px; }'
              + '#NaughtyAmericaPlus-SettingsBox button { background: -webkit-linear-gradient(top, #666 0%, #2b2b2b 50%, #0a0e0a 51%, #0a0809 100%) !important; border: none; margin: 8px 0 0; }'
              + '#NaughtyAmericaPlus-SettingsBox #NaughtyAmericaPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
        console.log('NaughtyAmerica+: Style Added')
	}

	function NaughtyAmericaPlusInit() {
		var fh, oh;
		fh = '<div id="NaughtyAmericaPlus"><hr>';
		oh = '<div id="NaughtyAmericaPlus-SettingsBox" class="aux-content-widget-2"><h2>NaughtyAmerica+ Options</h2><ul id="NaughtyAmericaPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("NaughtyAmericaPlus-Option-" + val[0], 1)) {
				fh += '<a class="NaughtyAmericaPlus-Button linkasbutton-secondary" id="NaughtyAmericaPlus-Feature-'
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
			oh += '<li id="NaughtyAmericaPlus-Option-'
                + val[0]
                + '-Field" class="NaughtyAmericaPlus-OptionField"><label for="NaughtyAmericaPlus-Option-'
                + val[0]
                + '">'
                + val[0]
                + '</label> <input id="NaughtyAmericaPlus-Option-'
                + val[0]
                + '" type="checkbox"'
                + ((GM_getValue("NaughtyAmericaPlus-Option-"
                + val[0], 1)) ? ' checked' : '')
                + '></li>';
		});
		fh += '<a class="NaughtyAmericaPlus-Button linkasbutton-secondary" id="NaughtyAmericaPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a><hr></div>';
		oh += '</ul><hr>'
            + '<button id="NaughtyAmericaPlus-SettingsBox-Save" class="primary">Save</button>'
            + '<button id="NaughtyAmericaPlus-SettingsBox-Close" class="primary">Close</button>'
            + '</div>';
		NaughtyAmericaPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '.signup-options').append(fh);
		$('body').append(oh);
        console.log('NaughtyAmerica+: Created HTML')
	}
	NaughtyAmericaPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#NaughtyAmericaPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#NaughtyAmericaPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.NaughtyAmericaPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#NaughtyAmericaPlus-Feature-Settings').click(showOpts);
	$('#NaughtyAmericaPlus-SettingsBox-Close').click(hideOpts);
	$('#NaughtyAmericaPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});