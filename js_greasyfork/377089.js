// ==UserScript==
// @name        EvilAngel+
// @author      GugZi
// @namespace   https://greasyfork.org/users/3348-xant1k
// @description Add external search links most popular torrent sites to EvilAngel. Every feature can be enabled/disabled in settings.
// @include     http*://www.evilangel.com/en/video/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/377089/EvilAngel%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377089/EvilAngel%2B.meta.js
// ==/UserScript==
//
jQuery(document).ready(function($) {
	var m = {};
	// m.Id = getMovieId();
	m.Tt = getMovieTt();
	// m.TtYr = getMovieTt() + "+" + getMovieYr();
	var l = {};
	// Info
	l.rb = ["RARBG", "http://rarbgmirror.xyz/torrents.php?search=" + m.Tt, "rarbgmirror.xyz/favicon.ico"];
	// Functions

    // function getMovieId() {
	//	 var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	//	 return id;
	// }

	function getMovieTt() {
        try {
            console.log('EvilAngel+: Trying to grab title');
            var title = document.getElementsByClassName("seo_h1")[0].innerHTML;
            return title; //.substring(0,title.indexOf("<"));
            console.log('EvilAngel+: Grabbed title - ' + title);
        }
        catch(err) {
            alert("Can't get Title " + err.message);
        }
	}

	// function getMovieYr() {
	// 	 var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	// 	 return encodeURIComponent(year);
	// }

	function EvilAngelPlusStyle() {
		var s = '.Giraffe_ScenePlayer .controlBar .playerHolder #EvilAngelPlus'
              + '.Giraffe_ScenePlayer .controlBar .playerHolder #EvilAngelPlus a { margin: 5px 5px; }'
              + '.Giraffe_ScenePlayer .controlBar .playerHolder #EvilAngelPlus #EvilAngelPlus-Feature-Settings { margin-left: 1px; }'
              + '.Giraffe_ScenePlayer_PlyerNew img { display: -webkit-inline-box; margin: 5px; }'
              + 'hr { border: 1px solid #404040; }'

              + '#action-box #EvilAngelPlus #EvilAngelPlus-Feature-Settings { margin-top: 10px; }'
              + '#EvilAngelPlus-SettingsBox { background-color: #2B2B2B; box-shadow: 0px 0px 300px 1000px rgba(0,0,0,0.75); color: white; display: none; margin-left: -404px; padding: 20px; position: fixed; top: 30%; left: 50%; width: 768px; z-index: 999; }'
              + '#EvilAngelPlus-SettingsBox > h2 { font-size: 21px }'
              + '#EvilAngelPlus-SettingsBox #EvilAngelPlus-Options { margin: 20px 0;}'
              + '#EvilAngelPlus-SettingsBox #EvilAngelPlus-Options .EvilAngelPlus-OptionField label { display: inline-block; width: 150px; }'
              + '#EvilAngelPlus-SettingsBox button { background: -webkit-linear-gradient(top, #666 0%, #2b2b2b 50%, #0a0e0a 51%, #0a0809 100%) !important; border: none; margin: 8px 0 0; }'
              + '#EvilAngelPlus-SettingsBox #EvilAngelPlus-SettingsBox-Close { float: right; }';
		GM_addStyle(s);
        console.log('EvilAngel+: Style Added')
	}

	function EvilAngelPlusInit() {
		var fh, oh;
		fh = '<div id="EvilAngelPlus"><hr>';
		oh = '<div id="EvilAngelPlus-SettingsBox" class="aux-content-widget-2"><h2>EvilAngel+ Options</h2><ul id="EvilAngelPlus-Options">';
		$.each(l, function(key, val) {
			if (GM_getValue("EvilAngelPlus-Option-" + val[0], 1)) {
				fh += '<a class="EvilAngelPlus-Button linkasbutton-secondary" id="EvilAngelPlus-Feature-'
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
			oh += '<li id="EvilAngelPlus-Option-'
                + val[0]
                + '-Field" class="EvilAngelPlus-OptionField"><label for="EvilAngelPlus-Option-'
                + val[0]
                + '">'
                + val[0]
                + '</label> <input id="EvilAngelPlus-Option-'
                + val[0]
                + '" type="checkbox"'
                + ((GM_getValue("EvilAngelPlus-Option-"
                + val[0], 1)) ? ' checked' : '')
                + '></li>';
		});
		fh += '<a class="EvilAngelPlus-Button linkasbutton-secondary" id="EvilAngelPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a><hr></div>';
		oh += '</ul><hr>'
            + '<button id="EvilAngelPlus-SettingsBox-Save" class="primary">Save</button>'
            + '<button id="EvilAngelPlus-SettingsBox-Close" class="primary">Close</button>'
            + '</div>';
		EvilAngelPlusStyle();
		$((location.pathname.match(/combined/)) ? '#action-box' : '.Giraffe_ScenePlayer .controlBar').append(fh);
		$('body').append(oh);
        console.log('EvilAngel+: Created HTML')
	}
	EvilAngelPlusInit();

	function showOpts() {
		$('#wrapper').css('visibility', 'hidden').animate({
			opacity: 0
		}, 500);
		$('#EvilAngelPlus-SettingsBox').show(500);
	}

	function hideOpts() {
		$('#EvilAngelPlus-SettingsBox').hide(500);
		$('#wrapper').css('visibility', 'visible').animate({
			opacity: 1
		}, 500);
	}

	function saveOpts() {
			$('.EvilAngelPlus-OptionField').each(function() {
				var inputElm = $('input', this),
					inputId = inputElm.attr('id');
				GM_setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
			});
			hideOpts();
			window.location.reload();
		}
		// Interactions
	$('#EvilAngelPlus-Feature-Settings').click(showOpts);
	$('#EvilAngelPlus-SettingsBox-Close').click(hideOpts);
	$('#EvilAngelPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});
});