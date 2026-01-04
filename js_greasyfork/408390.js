// ==UserScript==
// @name        AnimePahe Link Bypasser & Downloader
// @namespace   https://violentmonkey.github.io/
// @description AnimePahe uses an ad protected URL shortner to go to the download page of an anime. This script directs to the download page without a third party url, this script also automatically downloads the file from the file host. This script is the result of boredom, and curiosity. I made this with the purpose of showing this bug and not to skip AD's, I have much respect for the owner of the website.
// @include     https://animepahe.com/play* 
// @include     https://kwik.cx/f*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @version     1.0
// @author      Wooback
// @homepageURL https://animepahe.com
// @downloadURL https://update.greasyfork.org/scripts/408390/AnimePahe%20Link%20Bypasser%20%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/408390/AnimePahe%20Link%20Bypasser%20%20Downloader.meta.js
// ==/UserScript==

function kwik_download() {
  document.getElementsByClassName("button is-uppercase is-success is-fullwidth")[0].click();
  setTimeout(function(){
    window.location = "about:blank";
  }, 3000);
}

function get_kwik_url() {
  return url.replace("/e/", "/f/");
}

function check() {
    if (document.URL.includes("animepahe.com")) {
        window.location = get_kwik_url(); // switch to the file page of currently streaming video
    } else if (document.URL.includes("kwik.cx")) {
        kwik_download();
    } else {
      if (confirm("Invalid URL processed, send the developer current url?")) {
        window.location = "mailto:ashwn73@gmail.com?subject=" + document.URL + " is an invalid URL.";
      }
      else {
        return;
      }
    }
}

$(document).ready(function(){ check(); }) 
