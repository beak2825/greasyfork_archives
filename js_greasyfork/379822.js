// ==UserScript==
// @name        Youtube Video Quality
// @version     2.0
// @icon        https://www.gstatic.com/youtube/img/branding/favicon/favicon_144x144.png
// @grant       GM_addStyle
// @match       *://*.youtube.com/*
// @exclude     *://music.youtube.com/*
// @exclude     *://*.music.youtube.com/*
// @run-at      document-end
// @author      Yamako - Tanuki
// @description Disabling auto video quality with toast notification, original script -> https://greasyfork.org/en/users/226529
// @no-frames
// @namespace   https://greasyfork.org/en/scripts/379822-youtube-video-quality
// @homepage    https://greasyfork.org/en/scripts/379822-youtube-video-quality
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/379822/Youtube%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/379822/Youtube%20Video%20Quality.meta.js
// ==/UserScript==

var entut = 0;
var kntd = 0;

const QUALITIES =  ['auto', 'highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
const QUALITY_HIGHRES = QUALITIES[1]; //Highest resolution available
const QUALITY_1080 = QUALITIES[5]; //HD 1080p
const QUALITY_LARGE = QUALITIES[7]; //480p
const QUALITY_MEDIUM = QUALITIES[8]; //360p
const QUALITY_SMALL = QUALITIES[9]; //240p

// Edit This Variable to Change Video Quality
const KUALITAS = QUALITY_MEDIUM;

// Main Function for changing quality
function SetQuality() {
  var mp = document.getElementById("movie_player");
  if (window.location.href.indexOf('watch?v=')>1){
    if (mp.getPlaybackQuality() != KUALITAS &&
        mp.getAvailableQualityLevels().indexOf(KUALITAS) > -1)
    {
      Toast("Change "+mp.getPlaybackQuality()+" to "+ KUALITAS);
      mp.setPlaybackQualityRange(KUALITAS);
    }
      else
    {
      if (entut == 0 && mp.getPlaybackQuality() != "unknown"){
        Toast("Already "+ mp.getPlaybackQuality());
        entut = 1;
      }
    }
  }
}

function Toast(text) {
  var x = document.getElementById("qualitytoast");
  x.className = "show";
  x.innerHTML = text;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

window.addEventListener("load", () => {
    var toastdiv = document.createElement('div');
    toastdiv.id = "qualitytoast";
    document.body.appendChild(toastdiv);

    setTimeout(SetQuality, 1000);
    setInterval(SetQuality, 500);

    GM_addStyle(`
        #qualitytoast {
            visibility: hidden;
            min-width: 250px;
            margin-left: -125px;
            background-color: #303030;
            color: #f9f9f9;
            text-align: center;
            border-radius: 10px;
            padding: 16px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            font-size: 21px;
        }

        #qualitytoast.show {
            visibility: visible;
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }

        @-webkit-keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }

        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }

        @-webkit-keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }

        @keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
    `);

});

