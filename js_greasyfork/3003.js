// ==UserScript==
// @name          Add Spotify to YouTube
// @description   Adds a link to Spotify on music videos on YouTube
// @include       *://youtube.*/*
// @include       *://*.youtube.*/*
// @version 0.0.1.20160521101909
// @namespace https://greasyfork.org/users/3216
// @downloadURL https://update.greasyfork.org/scripts/3003/Add%20Spotify%20to%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/3003/Add%20Spotify%20to%20YouTube.meta.js
// ==/UserScript==

var userscript = function()
{

// http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main()
{

var videoinfo = {url: top.location.href, complete: 0, text: "", timer: null, running: 0};
var DEBUG = 0;
var PLAYVERSION = 0;
var DEBUGLOG;

if(DEBUG) DEBUGLOG = console;
else { var TDEBUGLOG = function() { return {log: function() {}}; }; DEBUGLOG = TDEBUGLOG(); }

function IsMusic()
{
	if(jQ('#eow-title #watch-headline-show-title').length !== 0) return 1;
	//if(jQ('#eow-category').text().trim() == "Music") return 1;
	var extrasismusic = false;
	jQ('.watch-extras-section .watch-meta-item').each(function(index)
	{
		var item = jQ(this);
		var title = item.find('.title').text().trim();
		var content = item.find('.content').text().trim();
		if(title == "Category" && content == "Music") extrasismusic = true;
		if(title == "Music") extrasismusic = true;
	});
	if(extrasismusic === true) return 1;
	
	var metadata = jQ('.metadata-info-title');
	for(var i = 0; i < metadata.length; i++)
	{
		if(metadata[i].innerText.match(/Buy ".*?" on|Artist/) !== null) return 1;
	}

	if(jQ('#eow-title').text().split('-', 2).length == 2) return 1; // Might be dangerous!
	return 0;
}

function GetVideoTitle()
{
	var artistname;
	var trackname;
	var fullname;
    var artist;
	
	var artist = jQ('#eow-title #watch-headline-show-title');
	if(artist.length !== 0 && !artistname)
	{
		artistname = artist.text();
	}
	
	artist = jQ('.metadata-info');
	if(artist.length !== 0 && !artistname)
	{
		for(var i = 0; i < artist.length; i++)
		{
			var tname = artist[i].innerText.match(/(Artist)[ \n\r]*(.*)/);
			if(tname)
			{
				if(tname[2].trim() != "Various Artists")
				{
					artistname = tname[2];
					break;
				}
			}
		}
	}
	
	if(!artistname || !trackname)
	{
		jQ('.watch-extras-section .watch-meta-item').each(function(index)
		{
			var item = jQ(this);
			var title = item.find('.title').text().trim();
			var content = item.find('.content').text().trim();
			if(title == "Music")
			{
				var musicsplit = content.split('by');
				var tname = musicsplit[0].match(/"(.*)"/)[1];
				var tartist = musicsplit[1].replace(/\([a-z• ]*\)$/i, '').trim();
				if(tartist !== "") artistname = tartist;
				if(tname !== "") trackname = tname;
			}
		});
	}
	
	if(!artistname)
	{
		var tname = jQ('#eow-title').text().split('-', 2);
		if(tname.length == 2)
		{
			artistname = tname[0].trim();
		}
	}
	
	var track = jQ('.metadata-info-title').text().match(/Buy "(.*?)" on/);
	if(track !== null && !trackname)
	{
		trackname = track[1];
	}
	
	if(!trackname)
	{
		//trackname = jQ('#eow-title').text().replace(artistname, "").replace(/-/, '').trim();
		var tname = jQ('#eow-title').text().split(/[-]+/, 2);
		if(tname.length == 2)
		{
			trackname = tname[1].trim();
		}
		else
		{
			trackname = trackname = jQ('#eow-title').text().replace(/-/, '').trim();
			if(artistname) trackname = trackname.replace(artistname, "");
		}
	}
	
	if(!artistname && trackname)
	{
		artistname = " ";
	}
	
	if(artistname && trackname)
	{
		trackname = trackname.replace(/\((.*?)\)|\[(.*?)\]| (Re)?mastered| f(ea)?t(uring)?(.)? .*|\"|\'/gi, "").trim();
		artistname = artistname.replace(/f(ea)?t(uring)?(.)? .*/gi, "").trim(); //  & .*
		return {artist: artistname, track: trackname};
	}
	else
	{
		if(!artistname) DEBUGLOG.log("failed to get artistname");
		if(!trackname) DEBUGLOG.log("failed to get trackname");
	}
	return 0;
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// http://stackoverflow.com/a/21081760
function wordInString(s, word){
  return new RegExp( '\\b' + word + '\\b', 'i').test(s);
}

function FindOriginal(title, data)
{
	var scores = [];
	var highest = 0;
	var title_artist = title.artist.replace(/[^a-zA-Z ]/g, "").split(' ').filter(Boolean);
	var extra = [];
	if(!/remix/i.test(title.track))
	{
		extra.push("remix");
	}

	for(var i = 0; i < Math.min(data.tracks.total, 10); i++)
	{
		var points = 0;
		var track = data.tracks.items[i];
        
        if(new RegExp('^(' + escapeRegExp(title.track) + ')', 'i').test(track.name))
        {
            points += 1;
        }
        
        if(!new RegExp('.*(radio|clean|live|remaster(ed)?|edit|karaoke|' + extra.join('|') + ')', 'gi').test(track.name))
		//if(!new RegExp(escapeRegExp(title.track) + ' .*(radio|clean|live|remaster(ed)?|edit|karaoke|' + extra.join('|') + ')', 'gi').test(track.name))
		{
			points += 1;
		}
		
		var artists = track.artists;
		for(var x = 0; x < artists.length; x++)
		{
			if(new RegExp('(karaoke)', 'gi').test(track.name)) points -= 2;
			if(title_artist.some(function(str) { return wordInString(this, str); }, artists[x].name)) points += 1;
			if(title.artist == artists[x].name) points += 2; // Favour exact matches
		}
		scores[i] = points;
	}
    for(var i = 0; i < scores.length; i++) if(scores[i] > scores[highest]) highest = i;
    DEBUGLOG.log("scores", scores);
	return highest;
}

function CheckAddress()
{
	if(window.location.href.match(/^(https?\:\/\/(www\.)?youtube.com\/watch)/))
	{
		return 1;
	}
	return 0;
}

function AddSpotify()
{
	if(!CheckAddress()) return 1;

	videoinfo.complete = 0;
	if(IsMusic())
	{
		var title = GetVideoTitle();
		DEBUGLOG.log("title", title);
		if(title !== 0)
		{
			jQ.getJSON('//api.spotify.com/v1/search?q=' + encodeURIComponent(title.artist + " " + title.track) + "&type=track&limit=10", function(data)
			{
				DEBUGLOG.log("data", data);
				DEBUGLOG.log("fullname:", title.artist, title.track);
				if(data.tracks.total > 0)
				{
					var artists = [];
					var index = FindOriginal(title, data);
					DEBUGLOG.log("Index", index, "selected");
					var track = data.tracks.items[index];
					jQ.each(track.artists, function(key, val)
					{
						var artisturl = "";
						if(PLAYVERSION === 0) artisturl = val.uri;
						else artisturl = val.external_urls.spotify;
						artists.push('<a href="' + artisturl + '" ' + (PLAYVERSION ? 'target="_blank"' : '') + '>' + val.name + '</a>'); 
					});
					var artistsname = artists.join(", ");
					var trackname = track.name;
					
					var urltrack = "";
					if(PLAYVERSION === 0) urltrack = track.uri;
					else urltrack = track.external_urls.spotify;
					
					var htmloutput =  '<div class="youtubespotify yt-uix-menu" style="font-size: 70%"><a href="' + urltrack + '" ' + (PLAYVERSION ? 'target="_blank"' : '') + '>';
					htmloutput += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQhSURBVDhPhZVtSJ11GMZ/zznHoz56XHbsbFmtpgj5khuZWCO3hDnG+tLqy+hDRRBsxPoSFX4IIigZsQjWgogFoygI5iAsSpdrMqHhXEKzCUujhWe+TI969OiZL6frfp4jKS12w9/n5fz/131d133fj05GwW1iLn2D38eOE5/tYCZ9lZXVFMGAy6a8SkqL9lIVO0Jh7r3Z3RvjP6BLKwucvlJPfGaASC7khiAnAAEHVrVzeRXSy5C8hcCrebaml5xgfva0HxtAryfO8nV/s9hAfo7Agj5gSNdgFnRJoMsrlhwWBD6zCAe3d7K1eE8WRQSyV/5KdPJFXzPFAswTu5BAbBlwWCuknXYNWxItS5anZ9v/5eVm7/xaeExN8tEul6irQ2KYFxZTk677sMnX4VUxzJh0yV5Mw60sW1t2P5mCN5tSnhUe6KneGqZSA0TvgoICGP0TRq7B9LgAtNmkF0SgZAtsrZCX5ahw8nVOBZ0XqGxIKdndbjUv1F/BSS7GM8fOlXJ/DL7/HNpOZDXcIcoqoek52HNQKvQ8nYAJJXm9KU5w30vhd0aTF4iIyTcfQkLs8mTDw49C7ePwSIPud8ADYle4CeaTYib5iZvwazec/kRqxHbHLv99KBDGOXWxLjM+1+cVJ1KkrEsC2OZLtoIEtRzdo8pbn1gHTAmwux3OnIThAY8477WpDlGI5tfhHPvJ1TYzWC9VyckR6NGBod/k7XV5NiNwFS66GR6Un1WPwZNPw5aH/Nbq74HBfmh8xveYjIvT+iMZrx+1jOnLdX5mC0csTfKyirAgiesjdh+82AIN++TnlGzR7zYYVjTng05XqlKeVFeDMdirKqpotU8okSyxSTL5ASWdHIW+8/DzGbh0zgff3givfQSz0/5gOIjpyZ66zFiyj1wdMv+K7/F9HZb88az8gL1XovIa2FblK5iehI/f0rtaST8gA9V6xnJzkTztGmzJdP/RiivfCtUBX7XChW99Fv8XO/fD828okXw2hgsCtL61Xm2saMGZXYhn3v2ulJJCydUEJSRx4m+oVEGMdUjvzAIbgpFh+OUHaFfVLQ4dVeFkU1rzb6CT8vXt/XF/oj7trmF0dsBrKwO2tarKWhvZMk9tBe13G195365BqdkpdcX+qKZlWUxfrUO7NFEGarPf0uZSrBG1/jRmawXyelRhF8uxFiGBW7NbWxnLaSl5/4A/+7Jc2XVz+KkOJjQta5usPby17tm76tmYpSR1Sezs+abOHd7d4eFYeEy9O8XQxFlOdDUT0RDY18ljqvdrbC1st+eK/li15+Tnq02dlMX+/Z5uALUwKz47X8+1sQEKJNH7QEuPJ187V7SM3bwqXRGr5pXdd/jyr4/k4g0uDh9naLxD8q6SXkmpl11KIpWUx/bSUHZEim73Pwr+AWfotNJ4G681AAAAAElFTkSuQmCC">';
					htmloutput += ' ' + trackname + '</a> - ' + artistsname + '</div>';
					jQ('.youtubespotify').remove();
					jQ('#watch8-secondary-actions').append(htmloutput);
				}
				else
				{
					jQ('.youtubespotify').remove();
					DEBUGLOG.log("No song found");
				}
			});
		} else
		{
			jQ('.youtubespotify').remove();
			DEBUGLOG.log("failed to get title");
		}
	}
	else
	{
		DEBUGLOG.log("not music!!");
	}
	
	videoinfo.complete = 1;
	videoinfo.url = top.location.href;
	videoinfo.text = jQ('#eow-title').text().trim();
}

AddSpotify();

function timerfunction()
{
	videoinfo.running = 1;
	if(videoinfo.complete && videoinfo.url != top.location.href)
	{
		if(videoinfo.text != jQ('#eow-title').text().trim())
		{
			AddSpotify();
		}
	}
}

window.addEventListener('focus', function()
{
	clearInterval(videoinfo.timer);
	if(!videoinfo.running) videoinfo.timer = setInterval(timerfunction, CheckAddress() ? 1000 : 2000);
});

window.addEventListener('blur', function()
{
	clearInterval(videoinfo.timer);
	videoinfo.running = 0;
});

}

addJQuery(main);

};

// http://stackoverflow.com/questions/7971930/how-to-call-youtube-flash-api-of-existing-videos-using-greasemonkey
function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

addJS_Node(null, null, userscript);