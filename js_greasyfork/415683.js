// ==UserScript==
// @name            Stream CDA videos in VLC
// @name:pl         Streamuj filmy z CDA w VLC
// @description     Watch videos from cda.pl in VLC media player
// @description:pl  Ogladaj filmy z cda.pl w odtwarzaczu VLC
// @version         1.0
// @author          SerpentDash
// @include         /https?:\/\/(ebd|www)?\.cda\.pl\/(video|[0-9a-z]+)\/[0-9]+.+/
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// @namespace       https://greasyfork.org/users/702655
// @downloadURL https://update.greasyfork.org/scripts/415683/Stream%20CDA%20videos%20in%20VLC.user.js
// @updateURL https://update.greasyfork.org/scripts/415683/Stream%20CDA%20videos%20in%20VLC.meta.js
// ==/UserScript==

// [EN] Script create file that can be opened in VLC to stream videos from cda.pl and ebd.cda.pl (others media player that can stream should work too)
// After you click new button (top right corner of player) click "Open as" VLC

// [PL] Skrypt tworzy plik, ktory mozna odtworzyc w VLC aby streamowac filmy z cda.pl oraz ebd.cda.pl (inne odtwarzacze umozliwiajace streamowanie rowniez powinny zadzialac)
// Po wcisnieciu nowego przycisku (gorny prawy rog odtwarzacza) wcisnij "Otworz za pomoca" VLC

(function () {
    let vid = document.getElementsByClassName("pb-video-player")[0];
    let btn = document.createElement("a");
    btn.text = '\u229A'; // icon
    btn.href = 'data:video/mp4,' + vid.src;
    btn.download = vid.ownerDocument.title;
    btn.setAttribute("style", 'font-size: 30px; color: white; padding: 10px 10px; opacity: 0.3; position: absolute; z-index: 10; top: 0; right: 0; line-height: .8;');
    (document.URL.match("www.cda.pl") ? document.getElementsByClassName("wplayer")[0] : document.body).appendChild(btn);
})();