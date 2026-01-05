// ==UserScript==
// @name         T411 Shoutbox - Youtube
// @namespace    https://www.t411.io
// @version      1.9.4
// @description  Corrige les liens Youtube dans la shoutbox de T411
// @author       RavenRoth
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @exclude      http://www.t411.al/chati/history.php*
// @exclude      https://www.t411.al/chati/history.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13090/T411%20Shoutbox%20-%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/13090/T411%20Shoutbox%20-%20Youtube.meta.js
// ==/UserScript==
function YoutubeRec() {
    document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
        if (event.target.parentNode.id == 'messages') {
            var element = document.getElementsByClassName(event.target.className) [0];
            var _first = element.getElementsByTagName('div') [0];
            var text = _first.getElementsByTagName('p') [0];
            var links = text.getElementsByTagName('a');
            for (var i = 0; i <links.length; i++) {
                if (links[i].className == 'youtube') {
                    var youtube=links[i].getAttribute("href");
                    var idarray = youtube.split('/');
                    var idargs = idarray[idarray.length-1].split('?');
                    var id=idargs[0];
                    idargs.shift();
                    for (var j=idargs.length-1; j>=0; j--) {
                        if (idargs[j] === "autoplay=1") {
                            idargs.splice(j, 1);
                        }
                    }
                    var args = "";
                    if (idarray[idarray.length-2]=="user") {
                        youtubelink='https://www.youtube.com/user/'+id;
                        args="?";
                    }
                    else if (idarray[idarray.length-2]=="channel") {
                        youtubelink='https://www.youtube.com/channel/'+id;
                        args="?";
                    }
                    else if (id=="results") {
                        youtubelink='https://www.youtube.com/'+id;
                        args="?";
                    } else {
                        youtubelink='https://www.youtube.com/watch?v='+id;
                        args='&'+args;
                    }
                    args=args+idargs.join('&');
                    if (idargs.length > 0) {
                        youtubelink=youtubelink+args;
                    }
                    links[i].removeAttribute('class');
                    links[i].setAttribute('target', '_blank');
                    links[i].setAttribute('href', youtubelink);
                    links[i].innerHTML = youtubelink;
                }
            }
        }
    }, false);
}
function YoutubeSend() {
    document.getElementById('send').addEventListener('click', function() {
        var textbox = document.getElementById('text-input');
        text=textbox.value;
        text=text.replace(/https?:\/\/(www.)?youtube\.com/gi,'https://www.youtube.ca');
        text=text.replace(/https?:\/\/youtu\.be\/([^\/]{11})(?!\?[^ ]*)/gi,"https://www.youtube.ca/watch?v=$1");
        text=text.replace(/https?:\/\/youtu\.be\/([^\/]{11})\?([^ ]*)/gi,"https://www.youtube.ca/watch?v=$1&$2");
        text=text.replace(/https?:\/\/youtu\.be\/user/gi,'https://www.youtube.ca/user');
        textbox.value=text;
    });
}
YoutubeSend();
YoutubeRec();