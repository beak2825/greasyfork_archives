// ==UserScript==
// @name servustv.com stream url
// @namespace Violentmonkey Scripts!
// @match https://www.servustv.com/*/v/*/
// @description get servustv.com stream url to feed into vlc/mpc-hc or ffmpeg etc
// @grant none
// @version 0.0.1.20240827172214
// @downloadURL https://update.greasyfork.org/scripts/459145/servustvcom%20stream%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/459145/servustvcom%20stream%20url.meta.js
// ==/UserScript==

window.addEventListener ("load", pageFullyLoaded); // https://stackoverflow.com/questions/26268816/how-to-get-a-greasemonkey-script-to-run-both-at-run-at-document-start-and-at-r

function pageFullyLoaded () {
  var id = location.href.split("/");
  // pretty much hardcoded:
  var urlp = "https://dms.redbull.tv/v5/destination/stv/";
  var urls = "/personal_computer/chrome/de/de_DE/playlist.m3u8";
  var properid = id[id.length - 2].toUpperCase();
  if (properid.match(/^AA/) != null) {
    var filmtitle = document.querySelector('meta[property="og:title"]').content;
    filmtitle = filmtitle.replace(/ /g, "_").replace(/[^a-z0-9%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%B1%C3%BC \.,_-]/gim, "");
    var test = prompt("stream URL (OK for ffmpeg command or cancel)", urlp + properid + urls);
    if (test !== null) {
      prompt("ffmpeg command", 'ffmpeg -referer "' + location.href + '" -user_agent "%ua%" -i "' + urlp + properid + urls + '" -c copy -bsf:a aac_adtstoasc "' + filmtitle + '.mp4"');
    }
  } else {
    alert("can't detect programme ID")
  }
}
