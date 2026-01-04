// ==UserScript==
// @name         Bandcamp Download Link
// @namespace    bandcamp.com
// @version      0.1
// @description  Download Link for Bandcamp
// @author       You
// @match        *.bandcamp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367775/Bandcamp%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/367775/Bandcamp%20Download%20Link.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
(function() {
for (var j = 0; j < TralbumData.trackinfo.length; j++) {
    var track = TralbumData.trackinfo[j];
    var trackNum = track.track_num;
    var mp3 = track.file['mp3-128'];
    var rows = document.querySelectorAll('[itemprop="tracks"][rel]');
    //window.console.log(track);
    for (var i=0; i < rows.length; i++) {
        //window.console.log(rows[i]);
        var trackNumElem = rows[i].querySelector('.track_number.secondaryText');
        if (trackNumElem) {
            var num = parseInt(trackNumElem.innerText);
            //window.console.log(num);
            if (num === trackNum) {
                var a = document.createElement('a');
                a.setAttribute('href', mp3);
                a.setAttribute('target', '_blank');
                a.innerHTML = 'Download';
                //window.console.log(a);
                if(rows[i].querySelector('.download-col')) {
                    rows[i].querySelector('.download-col').appendChild(a);
                    if (rows[i].querySelector('.dl_link')) {
                        rows[i].querySelector('.dl_link').setAttribute('style', 'visibility: hidden; display: none;');
                    }
                }
            }
        }
    }
}
})();
}, false);

