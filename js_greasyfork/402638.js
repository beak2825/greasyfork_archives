// ==UserScript==
// @name         Youtube Playlist 2 mp3
// @description  Makes script to download playlist and convert it to mp3 with number.
// @namespace    https://greasyfork.org/users/3159
// @version      0.3
// @include      http*://www.youtube.com/playlist?list=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402638/Youtube%20Playlist%202%20mp3.user.js
// @updateURL https://update.greasyfork.org/scripts/402638/Youtube%20Playlist%202%20mp3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateScript(){
        var playlist = document.getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-video-renderer');
        var allCode = [];

        for (var i = 0; i < playlist.length; i++) {
            if (playlist[i].getAttribute("href")){
                if (playlist[i].children[1].children[0].children[1].title != ("[Deleted video]" || "[Private video]")) {

                    var a=playlist[i].href.split('v=')[1].split('&')[0] // Video ID
                    var b=playlist[i].href.split('index=')[1].split('&')[0].padStart(3, "0") // Number
                    var c=playlist[i].children[1].children[0].children[1].title.replace(/\//g, "\\").replace(/\'/g, '"') // Name and remove '

                 allCode.push("youtube-dl -f 251 'https://www.youtube.com/watch?v=" + a + "' --id && ffmpeg -i '" + a + ".webm' '" + b + "_" + c + ".mp3'");
            }}
        }
        document.body.innerHTML = "select all and copy into terminal, remove webm waste when done<br /><br />";
        document.body.style.fontSize="1.3em"
        for (i = 0; i < allCode.length; i++) {
            document.body.innerHTML += allCode[i] + " && <br />";
        }
        document.body.innerHTML += "echo 'done! Remember to use kid3 to set track number if needed.'";
    }

    var css = 'p:hover{ background-color:red;color:white;border-radius: 3px; }p{ font-size:.75em;float:right;cursor:pointer }';
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    var button = document.createElement('p');
    button.innerText = " ⇩ ";
    button.onclick = generateScript;
    document.getElementById('text-displayed').appendChild(button);
})();

