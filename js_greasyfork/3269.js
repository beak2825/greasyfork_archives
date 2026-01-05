// ==UserScript==
// @name       DL w/ utube
// @version    9.22.14.8
// @description  DL from multiple sites using their youtube videos
// @match	   *://www.google.com/?utube-mp3*
// @match      *://www.youtube.com/*
// @match	   *://www.youtube-mp3.org/?*
// @match      *://www.pandora.com/*
// @copyright  2014+,  Hans Strausl
// @namespace https://greasyfork.org/users/3445
// @downloadURL https://update.greasyfork.org/scripts/3269/DL%20w%20utube.user.js
// @updateURL https://update.greasyfork.org/scripts/3269/DL%20w%20utube.meta.js
// ==/UserScript==

function init(){
    var host = window.location.hostname; L_(host);
    if (host === "www.youtube-mp3.org"){
        download();
    }
    if (host === "www.google.com"){
        google();
    }
    if (host === "www.youtube.com"){
        utube();
    }
    if (host === "www.pandora.com"){
        pand();
    }
}

window.onload = init();

function download(){
    urlsplit = String(window.location).split("vid=");
    document.getElementById("youtube-url").value = urlsplit[1];
    setTimeout(function() {
        document.getElementById("submit").click();
    }, 500);
    check = setInterval(function(){ // check for dl link every second
        if (document.getElementById("dl_link").innerHTML != "") {
            tags = document.getElementsByTagName("a");
            for (x=1;x<6;x++){
                if ((tags[x].style.display != "none") && (String(tags[x].href).indexOf("ab=") > 0)){
                    window.location = tags[x].href;
                    setTimeout(close, 3500); // auto-close after 3.5 seconds
                    clearInterval(check); // break the loop
                }
            }
        }
    }, 1000);
}

function google(){
    setTimeout(function(){
        var vids = document.getElementsByTagName('cite'); // changes
alert(vids.length);
        for (i = 0; i < vids.length; i++){
            var url = vids[i].innerHTML;
            if (url.search('<b>') > -1){ // .....<b>you</b>tube.com.....
                url = url.replace('<b>','');
                url = url.replace('</b>','');
            }
            if (url.search('youtube.com/watch') > 0){
                break;
            }

        
        }
alert(url);
        window.location = "http://www.youtube-mp3.org?vid=" + url;
    }, 2500);
}

function utube(){
    var div = document.getElementById("yt-masthead-user");
    div.innerHTML = "<button class='yt-uix-button yt-uix-sessionlink yt-uix-button-default yt-uix-button-size-default' id='dlbut' type='button' style='margin-right:5px;'> Download </button>" + div.innerHTML;
    document.getElementById("dlbut").onclick = function(){
        var url = String(window.location); L_(url);
        urlsplit = url.split("&");
        url = urlsplit[0];
        window.open("http://www.youtube-mp3.org?vid=" + url,"","height=250,width=250,left=250");
    };
}

function pand(){
    setTimeout(function(){
        var box = document.getElementById('trackInfoButtons').getElementsByClassName('buttons')[0];
        box.innerHTML += "<div id='downloadYT' class='button btn_bg' style='margin:auto'> Download </div>";
        document.getElementById('downloadYT').onclick = function(){
            var song = document.getElementsByClassName('songTitle')[0].innerHTML;
            var artist = document.getElementsByClassName('artistSummary')[0].innerHTML;
            var album = document.getElementsByClassName('albumTitle')[0].innerHTML;
            L_(song + " by " + artist);
            window.open("https://www.google.com/?utube-mp3#q=" + song + " by " + artist + " on " + album + "&tbm=vid","","height=250,width=250,left=250");
        };
    }, 10000);
}

function L_(data){
    console.log(data);
}