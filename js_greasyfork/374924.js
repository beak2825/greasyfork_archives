// ==UserScript==
// @name        IMDb+-Continued
// @namespace   https://greasyfork.org/users/229116-fat-zer
// @description Add external search links most popular torrent sites to IMDb. Every feature can be enabled/disabled in settings.
// @include     https://www.imdb.com/title/tt*
// @include     http://www.imdb.com/title/tt*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-end
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/374924/IMDb%2B-Continued.user.js
// @updateURL https://update.greasyfork.org/scripts/374924/IMDb%2B-Continued.meta.js
// ==/UserScript==
// An IMDb+ fork compataible with GreasyMonkey-4.0+

function getMovieId() {
	var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
	return id;
}

function getMovieTitle() {
	var title = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$1');
	return encodeURIComponent(title);
}

function getMovieOriginalTitle() {
	var origTitle = $('div.originalTitle').contents().filter(function() { return this.nodeType === Node.TEXT_NODE;})[0];
  return encodeURIComponent(origTitle.nodeValue);
}

function getMovieYear() {
	var year = document.title.replace(/^(.+) \((.*)([0-9]{4})(.*)$/gi, '$3');
	return encodeURIComponent(year);
}

function IMDbPlusOptionName(service_name) {
  return "IMDbPlus-Option-" + service_name;
}


(async () => {
  var m = {};
	m.Id = getMovieId();
	m.Tt = getMovieTitle ();
  m.Yr = getMovieYear();
  m.Ot = getMovieOriginalTitle ();
  m.TtYr = m.Tt + '+' + m.Yr;
  
	var serviceList = [];

  // Info
  serviceList.push ({ name: "Youtube"        , url: "https://www.youtube.com/results?search_query=" + m.TtYr             , icon: "https://www.youtube.com/favicon.ico"       });
  serviceList.push ({ name: "Kinopoisk"      , url: "https://www.kinopoisk.ru/index.php?first=yes&kp_query=" + m.Tt      , icon: "https://www.kinopoisk.ru/favicon.ico"      });
  serviceList.push ({ name: "allMovie"       , url: "https://www.allmovie.com/search/movies/" + m.TtYr                   , icon: "https://www.allmovie.com/favicon.ico"      });
  // TV Series
  serviceList.push ({ name: "Broadcast"      , url: "https://broadcasthe.net/torrents.php?imdb=tt" + m.Id                , icon: "https://broadcasthe.net/favicon.ico"       });
  serviceList.push ({ name: "BitmeTV"        , url: "http://www.bitmetv.org/browse.php?search=" + m.TtYr                 , icon: "https://i.imgur.com/qCecxho.png"           });
  // All
  serviceList.push ({ name: "RuTracker"      , url: "https://rutracker.org/forum/tracker.php?o=10&nm=" + m.TtYr          , icon: "https://rutracker.org/favicon.ico"         });
  serviceList.push ({ name: "ThePirateBay"   , url: "https://thepiratebay.org/search/" + m.Ot + "+" + m.Yr               , icon: "https://thepiratebay.org/favicon.ico"      });
  //serviceList.push ({ name: "Karagarga"      , url: "https://karagarga.net/browse.php?search_type=imdb&search=" + m.TtYr , icon: "https://karagarga.net/favicon.ico"         });
  serviceList.push ({ name: "Cinemageddon"   , url: "http://cinemageddon.net/browse.php?search=" + m.TtYr                , icon: "http://cinemageddon.net/favicon.ico"       });
  serviceList.push ({ name: "Cinematik"      , url: "http://cinematik.net/browse.php?search=" + m.TtYr                   , icon: "http://cinematik.net/favicon.ico"          });
  serviceList.push ({ name: "PassThePopcorn" , url: "https://tls.passthepopcorn.me/torrents.php?searchstr=" + m.TtYr     , icon: "https://tls.passthepopcorn.me/favicon.ico" });
  serviceList.push ({ name: "Kinozal"        , url: "http://kinozal.tv/browse.php?s=" + m.TtYr                           , icon: "http://kinozal.tv/favicon.ico"             });
  serviceList.push ({ name: "RuTor"          , url: "https://rutor.is/search/0/0/000/2/" + m.Tt                          , icon: "https://rutor.is/s/favicon.ico"            });
  serviceList.push ({ name: "NNMClub"        , url: "http://nnm-club.me/forum/tracker.php?nm=" + m.TtYr                  , icon: "http://nnm-club.me/favicon.ico"            });
  serviceList.push ({ name: "x264"           , url: "http://x264.me/browse.php?search=" + m.TtYr                         , icon: "http://x264.me/favicon.ico"                });
  serviceList.push ({ name: "AsiaDVDClub"    , url: "http://asiandvdclub.org/browse.php?search=" + m.TtYr                , icon: "http://asiandvdclub.org/favicon.ico"       });
  // HD
  serviceList.push ({ name: "HDBits"         , url: "https://hdbits.org/browse.php?search=" + m.TtYr                     , icon: "https://hdbits.org/favicon.ico"            });
  //serviceList.push ({ name: "HDClub"         , url: "http://hdclub.org/browse.php?search=" + m.TtYr                      , icon: "http://hdclub.org/favicon.ico"             });
  serviceList.push ({ name: "HDTracker"      , url: "http://hdtracker.org/browse.php?search=" + m.TtYr                   , icon: "http://hdtracker.org/favicon.ico"          });
  serviceList.push ({ name: "CHD"            , url: "https://chdbits.org/torrents.php?search=" + m.TtYr                  , icon: "https://chdbits.org/favicon.ico"           });
  serviceList.push ({ name: "HDWinG"         , url: "https://hdwing.com/browse.php?search=" + m.TtYr                     , icon: "http://hdwing.com/favicon.ico"             });
  serviceList.push ({ name: "HDSpain"        , url: "https://www.hd-spain.com/browse.php?" + m.TtYr                      , icon: "https://www.hd-spain.com/favicon.ico"      });
  serviceList.push ({ name: "SceneHD"        , url: "https://scenehd.org/browse.php?search=" + m.TtYr                    , icon: "http://scenehd.org/favicon.ico"            });
  serviceList.push ({ name: "BitHDTV"        , url: "https://www.bit-hdtv.com/torrents.php?search=" + m.TtYr             , icon: "https://www.bit-hdtv.com/favicon.ico"      });
  serviceList.push ({ name: "AwesomeHD"      , url: "https://awesome-hd.net/torrents.php?searchstr=" + m.TtYr            , icon: "https://awesome-hd.net/favicon.ico"        });

  await Promise.all(serviceList.map(function (service) {
    return GM.getValue (IMDbPlusOptionName(service.name), 1).then (
      function (val) { service.is_enabled = val }
    );
  }));
  
  // Initialise styles
  $('head').append(
            '<style type="text/css">'
          +   '#title-overview-widget #IMDbPlus { padding: 5px 0 0 230px; }' 
          +   '#title-overview-widget #IMDbPlus a { margin: 5px 1px; }' 
          +   '#title-overview-widget #IMDbPlus #IMDbPlus-Feature-Settings { margin-left: 1px; }' 
          +   '#action-box #IMDbPlus #IMDbPlus-Feature-Settings { margin-top: 10px; }' 
          +   '#IMDbPlus-SettingsBox { display: none; margin-left: -404px; padding: 20px; position: absolute; top: 10%; left: 50%; width: 768px; z-index: 999; }' 
          +   '#IMDbPlus-SettingsBox > h2 { font-size: 21px }' + '#IMDbPlus-SettingsBox #IMDbPlus-Options { margin: 20px 0;}' 
          +   '#IMDbPlus-SettingsBox #IMDbPlus-Options .IMDbPlus-OptionField label { display: inline-block; width: 150px; }' 
          +   '#IMDbPlus-SettingsBox button { margin: 8px 0 0; }' + '#IMDbPlus-SettingsBox #IMDbPlus-SettingsBox-Close { float: right; }'
		      + '</style>'
  );
  
  // Initialize the UI
	{
		var fh = '<div id="IMDbPlus"><hr>';
		var oh = '<div id="IMDbPlus-SettingsBox" class="aux-content-widget-2"><h2>IMDb+ Options</h2><ul id="IMDbPlus-Options">';

    serviceList.forEach(function(service) {
      var optName = IMDbPlusOptionName (service.name);
      if (service.is_enabled) {
				fh += '<a class="IMDbPlus-Button linkasbutton-secondary" id="IMDbPlus-Feature-' + service.name + '" href="' + service.url + '" target="_blank" title="' + service.name + '">'
           +    '<img alt="' + service.name + '" src="' + service.icon + '" width="16" height="16">'
           +  '</a>';
			}
			oh += '<li id="' + optName + '-Field" class="IMDbPlus-OptionField">'
         +    '<label for=' + optName + '">' 
         +      '<img " src="' + service.icon + '" width="16" height="16">'
         +       service.name 
         +    '</label>'
         +    '<input id="' + optName + '" type="checkbox"' + (service.is_enabled ? ' checked' : '') + '>'
         +  '</li>';
		});
		fh += '<a class="IMDbPlus-Button linkasbutton-secondary" id="IMDbPlus-Feature-Settings" title="Open settings frame"><img alt="Settings" src="https://i.imgur.com/j9VseXa.png"></a></div>';
		oh += '</ul><hr>' + '<button id="IMDbPlus-SettingsBox-Save" class="primary">Save</button>' + '<button id="IMDbPlus-SettingsBox-Close" class="primary">Close</button>' + '</div>';

    $((location.pathname.match(/combined/)) ? '#action-box' : '.plot_summary_wrapper').append(fh);
		$('body').append(oh);
	}
	
  // Setup Interactions
	$('#IMDbPlus-Feature-Settings').click(showOpts);
	$('#IMDbPlus-SettingsBox-Close').click(hideOpts);
	$('#IMDbPlus-SettingsBox-Save').click(saveOpts);
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			hideOpts();
		}
	});

})();

function showOpts() {
  $('#wrapper').css('visibility', 'hidden').animate({
	  opacity: 0
	}, 500);
	$('#IMDbPlus-SettingsBox').show(500);
}

function hideOpts() {
	$('#IMDbPlus-SettingsBox').hide(500);
	$('#wrapper').css('visibility', 'visible').animate({
		opacity: 1
	}, 500);
}

function saveOpts() {
	$('.IMDbPlus-OptionField').each(function() {
		var inputElm = $('input', this);
		var inputId = inputElm.attr('id');
    GM.setValue(inputId, (inputElm.is(":checked") ? 1 : 0));
  });
	hideOpts();
	window.location.reload();
}