// ==UserScript==
// @name wedotv stream url
// @namespace Violentmonkey Scripts
// @description get wedotv.com stream url to watch it in vlc/mpc-hc or any other media player of your choice
// @version 3
// @license MIT
// @match https://*.wedotv.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/542044/wedotv%20stream%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/542044/wedotv%20stream%20url.meta.js
// ==/UserScript==

window.addEventListener('load',
  function() {
  
    var url = ""; 
    var xhr = new XMLHttpRequest();

    var buttons = document.querySelectorAll(".hero-content")[0].innerHTML;

    document.querySelectorAll(".hero-content")[0].innerHTML = buttons + '<a id="show-url-button" style="display:inline-block" href="' + document.querySelector("#start-player-button").href + '" class="watch-button"><i class="fa-solid fa-circle-play"></i> <span>show url</span></a>';
    document.querySelector("#start-player-button").getElementsByTagName("span")[0].innerText = "watch";

    var film_id = document.querySelector("#start-player-button").getAttribute("data-video-id");

    document.querySelector("#show-url-button").onclick = function() {

      var getJSON = function(url, callback) {

        xhr.open('GET', url, true);
        xhr.responseType = 'json';

        xhr.onload = function() {

          var status = xhr.status;

          if (status == 200) {
            callback(null, xhr.response);
          } else {
            callback(status);
          }
        };

        xhr.send();
      };

      getJSON("https://www.wedotv.com/api/player.get_video.php?video_id=" + film_id, function(err, data) {
        if (err != null) {
          console.error(err);
        } else {
          url = data.video_source;

           document.querySelector("#show-url-button").onclick = function () {
           
               var test = prompt("stream URL (OK for ffmpeg command)", url);
                  if (test !== null) {
                    prompt("ffmpeg command (OK for yt-dlp)", 'ffmpeg -referer "' + location.href + '" -user_agent "' + window.navigator.userAgent + '" -i "' + url + '" -c copy -bsf:a aac_adtstoasc "' + document.location.hash.replace("#","") + '.mp4"');
                    if (test !== null) {
                      prompt("yt-dlp command", "yt-dlp " + url);
                    }

                  }
           
           }
          
        }
      });

    };

    var jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);

    for (var i = 0, len = document.getElementsByClassName("details-column")[0].getElementsByTagName("p").length - 1; i < len; ++i) {

      if (document.getElementsByClassName("details-column")[0].getElementsByTagName("p")[i].innerText.indexOf("IMDB") != -1) {
        var rating = document.getElementsByClassName("details-column")[0].getElementsByTagName("p")[i].innerText.replace("IMDB-Bewertung: ", "");
        break;
      }

    }

    var imdbsvg = '<span><svg height="16" width="32" viewBox="0 5 64 16"><rect fill="#f5c518" height="32" rx="4" width="64"/><path d="m8 7v18h5v-18zm7 0v18h4.25v-11.875l1.78125 11.875h3.03125l1.6875-12.15625.03125 12.15625h4.21875v-18h-6.3125l-1.125 8.40625-.71875-4.5625c-.2015908-1.46493163-.3773656-2.75199879-.5625-3.84375zm17 0v18h7.8125c1.7671031 0 3.1875-1.43311 3.1875-3.1875v-11.625c0-1.75666009-1.4227064-3.1875-3.1875-3.1875zm13 0v17.78125h4.46875l.3125-1.125c.5884049.8053879 1.5578038 1.34375 2.65625 1.34375h.3125c1.7956636 0 3.25-1.3919253 3.25-3.125v-7.21875c0-1.73219176-1.4548082-3.15625-3.25-3.15625h-.3125c-1.0747565 0-2.0380781.51087183-2.65625 1.28125v-5.78125zm-8.3125 3.09375c.5518634 0 .957924.04905988 1.15625.15625.2026373.10719012.3189514.26973974.375.5s.09375.74864909.09375 1.5625v6.96875c0 1.1989413-.0818541 1.9487897-.25 2.21875-.1681459.2739303-.6463678.40625-1.375.40625zm13.84375 4.1875c.2639059 0 .6557478.1308602.75.34375.0942522.21288983.125.70151132.125 1.40625v4.25c0 .8038426-.0420582 1.3220307-.125 1.53125-.0829419.2092193-.4785537.3125-.75.3125-.2714464 0-.6595179-.1069512-.75-.3125v-1.40625-4.375-1.4375c.0791718-.18719623.4860938-.3125.75-.3125z"/></svg></span>',
      imdbprefix = '<a href="https://www.imdb.com/find/?q=',
      imdbsuffix = '" target="somenewwindow">' + imdbsvg + '</a> ';

    var origtitle = location.pathname.replace("/ch-de/", "").replace("/at-de/", "").replace("/de-de/", "").replace("/en-de/", "").replaceAll("-", " ");
    var imdblink = imdbprefix + encodeURIComponent(origtitle) + imdbsuffix;
    var meta = document.getElementsByClassName("hero-meta")[0].innerHTML;
    document.getElementsByClassName("hero-meta")[0].innerHTML = meta + imdblink + " = " + rating;

    var titleyear = document.getElementsByClassName("hero-title")[0].innerHTML;

    var myregex = new RegExp(" - .*", "gi");
    titleyear = titleyear.replace(myregex, "");

    var originaltitle = titleyear + " (" + jsonld.copyrightYear + ")";
    document.getElementsByClassName("hero-title")[0].innerHTML = originaltitle;

    document.title = "wedotv video: " + originaltitle;
  
    document.setTimeout(document.querySelector("#show-url-button").click(), 3500);

  });