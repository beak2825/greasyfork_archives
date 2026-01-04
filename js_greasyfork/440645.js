// ==UserScript==
// @name tele5 video 2023
// @namespace Violentmonkey Scripts
// @match https://tele5.de/mediathek/*
// @exclude /^https://tele5\.de/mediathek/$/
// @exclude /^https://tele5\.de/mediathek/#.*$/
// @exclude /^https://tele5\.de/mediathek/schlefaz.*$/
// @exclude /^https://tele5\.de/mediathek/kulfaz.*$/
// @description removes all the crap and re-enables your browsers native video player
// @version 0.0.1.20230323202331
// @downloadURL https://update.greasyfork.org/scripts/440645/tele5%20video%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/440645/tele5%20video%202023.meta.js
// ==/UserScript==

document.getElementsByTagName("body")[0].style.display = "none";

var players = setInterval(function() {

  $   = function(_) {return document.getElementById(_)}
  $tg = function(_) {return document.getElementsByTagName(_)}
  $cn = function(_) {return document.getElementsByClassName(_)}
  $qa = function(_) {return document.querySelectorAll(_)}
  $qs = function(_) {return document.querySelector(_)}

  var vidcount = $qa("hyoga-player").length;

  var vidnumint = 0;
  $cn("video-js")[vidnumint].style.display = "none";
  $cn("vjs-tech")[vidnumint].style.display = "none";

  if (vidcount > 0) {

    clearInterval(players);
    $tg("body")[0].style.overflow = "hidden";
    console.log("vidcount: " + vidcount);

    var d = new Date();

    var onlinebis = $qs('meta[name="title"]').content;

    var phonenumbera = new RegExp("\|.*", "gi");

    onlinebis = onlinebis.replace(" | Kostenlos online sehen | TELE 5", "");

    document.title = onlinebis;
    var phonenumberb = new RegExp(".* - ", "gi");
    onlinebis = onlinebis.replace(phonenumberb, "");
    var filmtitel = $qs('meta[name="twitter:title"]').content;
    var phonenumberc = new RegExp(" - .*", "gi");
    filmtitel = filmtitel.replace(phonenumberc, "");
    var phonenumberd = new RegExp(":.*", "gi");
    filmtitel = filmtitel.replace(phonenumberd, "");
    onlinebis = onlinebis.replace(d.getFullYear(), "");

    if (vidcount < 1) {
      document.title = "tele5 mediathek: " + filmtitel.replace(" | Kostenlos online sehen | TELE 5", "");
    } else {
      document.title = "tele5 mediathek: " + filmtitel.replace(" | Kostenlos online sehen | TELE 5", "");
    }

    var volset = 0;
    var vidnum = 0;

    if (vidcount < 1) {
      $tg("body")[0].innerHTML = "<div align='center' id=nix><div class='center'><p>Kein Video-Element gefunden. Eventuell ist der Film noch nicht oder nicht mehr verfügbar.</p></div></div";
      $("nix").style = 'position: absolute;  width: 100%;  height: 100%;  z-index: 15;  top: 40%;  left: 40%;  margin: -100px 0 0 -150px;';
    }

    $cn("sonicVideoBlock")[0].style.display = "none";

    setTimeout("document.getElementsByTagName('body')[0].style.display = 'block'", 500);

    $cn("vjs-big-play-button")[vidnumint].style.visibility = "hidden";
    $cn("vjs-big-play-button")[vidnumint].style.display = "none";

    $cn("vjs-loading-spinner")[vidnumint].style.visibility = "hidden";
    $cn("vjs-loading-spinner")[vidnumint].style.display = "none";
    $qa("video")[vidnumint].poster = "";

    $tg("body")[0].onclick = function() {

      $cn("sonicVideoBlock")[0].style.display = "block";
      $cn("video-js")[vidnumint].style.display = "block";
      $cn("vjs-tech")[vidnumint].style.display = "block";

      var t5vida = $qa("video")[vidnumint].id;

      $(t5vida).setAttribute("controls", true);
      $cn("vjs-control-bar")[vidnumint].style.display = "none";

      var vidwidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      vidwidth = vidwidth - 55;

      var vidheight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      vidheight = vidheight - 55;

      $cn("video-js")[vidnumint].style.height = vidheight + "px";
      $cn("vjs-tech")[vidnumint].style.height = vidheight + "px";
      $cn("video-js")[vidnumint].style.width = vidwidth + "px";
      $cn("vjs-tech")[vidnumint].style.width = vidwidth + "px";
      $cn("video-overlay-show-title")[vidnumint].style.display = "none";
      $cn("video-overlay-show-title")[vidnumint].style.visibility = "hidden";
      $cn("video-overlay-video-title")[vidnumint].style.display = "none";
      $cn("video-overlay-video-title")[vidnumint].style.visibility = "hidden";
      $cn("video-overlay-content-descriptors")[vidnumint].style.display = "none";
      $cn("video-overlay-content-descriptors")[vidnumint].style.visibility = "hidden";
      $cn("video-overlay-duration")[vidnumint].style.display = "none";
      $cn("video-overlay-duration")[vidnumint].style.visibility = "hidden";
      $cn("vjs-contentinfo")[vidnumint].style.display = "none";
      $cn("vjs-contentinfo")[vidnumint].style.visibility = "hidden";
      $cn("vjs-contentinfo")[vidnumint].style.display = "none";
      $cn("vjs-contentinfo")[vidnumint].style.visibility = "hidden";
      $cn("vjs-contentinfo")[vidnumint].innerHTML = "";
      $cn("vjs-big-play-button")[vidnumint].style.visibility = "hidden";
      $cn("vjs-big-play-button")[vidnumint].style.display = "none";
      $cn("vjs-loading-spinner")[vidnumint].style.visibility = "hidden";
      $cn("vjs-loading-spinner")[vidnumint].style.display = "none";
      $qa("video")[vidnumint].poster = "";
      
      if (volset != 1) {
        $(t5vida).volume = 0.5;
        volset = 1;
      }

      
      $(t5vida).play();

    }

    setTimeout('document.getElementsByTagName("body")[0].click()', 1500);

  }


}, 5000);
