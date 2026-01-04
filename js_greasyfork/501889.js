// ==UserScript==
// @name        Youtube 1080p Video Quality
// @version     0.91
// @grant       none
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @run-at      document-start
// @author      Yamako - Tanuki
// @license     GPL
// @description Script sets 1080p video quality based on youtube events, KUALITAS can be changed to set quality, original scripts:  ->https://greasyfork.org/en/scripts/379822-youtube-video-quality,  https://greasyfork.org/en/users/226529
// @no-frames
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/501889/Youtube%201080p%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/501889/Youtube%201080p%20Video%20Quality.meta.js
// ==/UserScript==

const QUALITIES =  ['auto',  'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
const QUALITY_MEDIUM = QUALITIES[3]; //hd720
const QUALITY_LARGE = QUALITIES[2]; //hd1080
const QUALITY_SMALL = QUALITIES[9]; //240p
const KUALITAS = QUALITY_LARGE;
var entut = 0;
var kntd = 0;
var ytp =  document.getElementById("movie_player");
addCSS('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
addScript('https://cdn.jsdelivr.net/npm/toastify-js');

function SetQuality() {

    ytp =  document.getElementById("movie_player");
    ytp.addEventListener('onStateChange', onPlayerStateChange);
        ytp.addEventListener('onReady', onPlayerReady);
  if (window.location.href.indexOf('watch?v=')>1){
    if (         document.getElementById("movie_player").getAvailableQualityLevels().indexOf(KUALITAS) <= -1)
    {
      Toastify({text: "expeced qual not available!, current: "+document.getElementById("movie_player").getPlaybackQuality(),duration: 3000}).showToast();
    }
     else if ( document.getElementById("movie_player").getAvailableQualityLevels().indexOf(document.getElementById("movie_player").getPlaybackQuality() ) >
        document.getElementById("movie_player").getAvailableQualityLevels().indexOf(KUALITAS) )
    {
      Toastify({text: "Already Higher qualit set: "+document.getElementById("movie_player").getPlaybackQuality()+" than "+ KUALITAS,duration: 3000}).showToast();
    }
     else if (document.getElementById("movie_player").getPlaybackQuality() != KUALITAS &&
        document.getElementById("movie_player").getAvailableQualityLevels().indexOf(KUALITAS) > -1)
    {
      Toastify({text: "Change "+document.getElementById("movie_player").getPlaybackQuality()+" to "+ KUALITAS + " Quality.",duration: 3000}).showToast();
      document.getElementById("movie_player").setPlaybackQualityRange(KUALITAS);
    }
      else
    {

        Toastify({text: "Video Quality Already "+ document.getElementById("movie_player").getPlaybackQuality(),duration: 4000}).showToast();

    }
  }
}
function SetQualityDynamic( instr ) {
    var tmpstr ="  v  ";
    if(instr === undefined)
        tmpstr=" kn ";
   else
       tmpstr = instr;
     ytp =  document.getElementById("movie_player");

  if (window.location.href.indexOf('watch?v=')>1){
    if (document.getElementById("movie_player").getPlaybackQuality() != KUALITAS &&
        document.getElementById("movie_player").getAvailableQualityLevels().indexOf(KUALITAS) > -1)
    {
      Toastify({text: "Change "+tmpstr+document.getElementById("movie_player").getPlaybackQuality()+" to "+ KUALITAS + " Quality.",duration: 3000}).showToast();
      document.getElementById("movie_player").setPlaybackQualityRange(KUALITAS);
    }
      else
    {
      if (entut == 0){
        Toastify({text: "Video Quality Already "+ document.getElementById("movie_player").getPlaybackQuality(),duration: 4000}).showToast();

      }
    }
  }
}

setTimeout(SetQuality, 1000);
//setInterval(SetQuality, 1000);

function onPlayerStateChange(event)
{
       ytp =  document.getElementById("movie_player");
  if (event.data == YT.PlayerState.CUED) {
      SetQualityDynamic(" chge cue ");
  }


  if (event.data == YT.PlayerState.PLAYING) {
      SetQualityDynamic(" chge playing ");
  }

   if (event.data == YT.PlayerState.ENDED) {
      SetQualityDynamic( " chge edn " );
  }

}

function onPlayerReady(event)
{
       ytp =  document.getElementById("movie_player");
      SetQualityDynamic( " ready! " );
}

// https://makitweb.com/dynamically-include-script-and-css-file-with-javascript/
// Include CSS file
function addCSS(filename){
 var head = document.getElementsByTagName('head')[0];

 var style = document.createElement('link');
 style.href = filename;
 style.type = 'text/css';
 style.rel = 'stylesheet';
 head.append(style);
 console.log(filename + " Loaded.")
}

// Include script file
function addScript(filename){
 var head = document.getElementsByTagName('head')[0];

 var script = document.createElement('script');
 script.src = filename;
 script.type = 'text/javascript';

 head.append(script);
 console.log(filename + " Loaded.")
}

