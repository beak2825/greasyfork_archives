// ==UserScript==
// @name        AnimePahe (Link Bypasser & Downloader)
// @namespace   https://violentmonkey.github.io/
// @description I made this to download anime faster and more efficently from AnimePahe. This was made as a proof of concept, and not for general use.
// @include     https://animepahe.com/play*
// @include     https://kwik.cx/f*
// @version     1.2
// @author      Jordan Stills
// @homepageURL https://animepahe.com
// @downloadURL https://update.greasyfork.org/scripts/408270/AnimePahe%20%28Link%20Bypasser%20%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408270/AnimePahe%20%28Link%20Bypasser%20%20Downloader%29.meta.js
// ==/UserScript==

function kwik_download() {
    document.getElementsByClassName("button is-uppercase is-success is-fullwidth")[0].click(); // programmatically click the button
    setTimeout(function(){ window.location = "about:blank"; }, 5000); // wait 5 seconds and switch to about:blank to save memory
}

function get_kwik_url() {
    return url.replace("/e/", "/f/"); // use the locally stored Kwik URL meant for streaming, and change it from stream to file page.
}

function check() {
    if (document.URL.includes("animepahe.com")) {
        window.location = get_kwik_url(); // switch to the file page of currently streaming video
    } else if (document.URL.includes("kwik.cx")) {
        kwik_download();
    } else {
        alert("Invalid URL processed, please send current url to\ndrakoholdsahundredroundsofammo@gmail.com."); // incase an inorrect url gets parsed, I can change regex or match query
    }
}

setTimeout(function(){ check(); }, 2000); // wait 1000ms so the page can load content in kwik & also so that animepahe.com has enough time to make an api call