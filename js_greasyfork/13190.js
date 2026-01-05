// ==UserScript==
// @name		Call the playButton for SongTaste
// @namespace	a@b.c
// @author		jasake
// @description	召唤播放按钮君
// @version		v1.1
// @include		http://www.songtaste.com/song/*
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/13190/Call%20the%20playButton%20for%20SongTaste.user.js
// @updateURL https://update.greasyfork.org/scripts/13190/Call%20the%20playButton%20for%20SongTaste.meta.js
// ==/UserScript==

document.querySelector('.song_left img[style][src$="/tmp/songa.jpg"]').style.display = 'none';

document.querySelector('.song_left').innerHTML = document.querySelector('.song_left').innerHTML.replace(/<!--\s*</g,'<').replace(/>\s*-->/g,'>');

var sUrl = document.querySelector('#playicon script[src]').src;
var sText = document.querySelector('#playicon script[src] + script').text;

var xhrObj = new XMLHttpRequest();
xhrObj.onreadystatechange = function(){
    if(xhrObj.readyState == 4){
        var script1 = document.createElement("script");
        script1.type = "text/javascript";
        script1.text = xhrObj.responseText;
        document.getElementsByTagName("head")[0].appendChild(script1);
        var script2 = document.createElement("script");
        script2.type = "text/javascript";
        script2.text = sText;
        document.getElementsByTagName("head")[0].appendChild(script2);
    }
};
xhrObj.open("GET", sUrl, true);
xhrObj.send("");
