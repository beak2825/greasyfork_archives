// ==UserScript==
// @name          Justin Y. nizator
// @match *://youtube.*/*
// @description   Turns everyone on Džůvtube to Justin Y.
// @namespace ad48
// @author DDosSantoStm
// @version 0.69b
// @grant none
// @include       *://youtube.*/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/371596/Justin%20Y%20nizator.user.js
// @updateURL https://update.greasyfork.org/scripts/371596/Justin%20Y%20nizator.meta.js
// ==/UserScript==
var lorename="Justin Y.";
var lorepic="https://yt3.ggpht.com/-5GchV8wK-aE/AAAAAAAAAAI/AAAAAAAAAAA/ojoZ46vXxcU/s100-mo-c-c0xffffffff-rj-k-no/photo.jpg";
var changenames=true;
  setInterval(function(){
   var h3s = document.body.getElementsByTagName("*");
    for(var i = 0; i < h3s.length; i++) {
      if(h3s[i].getAttribute("class")) {
        if(changenames && h3s[i].getAttribute("class")=="yt-user-info") {
          h3s[i].children[0].innerText=lorename;
        }
         if(changenames && h3s[i].getAttribute("class")=="yt-masthead-picker-name") {
          h3s[i].innerText=lorename;
        }
        if(h3s[i].getAttribute("class")=="appbar-content-hidable") {
          h3s[i].children[0].children[0].setAttribute("src",lorepic);
          if(changenames)
            {
            h3s[i].children[1].children[0].children[0].innerText=lorename;
            }
            }
        if(h3s[i].getAttribute("class")=="yt-thumb-clip" && h3s[i].parentNode && h3s[i].parentNode.parentNode && h3s[i].parentNode.parentNode.getAttribute("class")!=="video-thumb  yt-thumb yt-thumb-196") {
          h3s[i].children[0].setAttribute("src",lorepic);
        }
        if(h3s[i].getAttribute("class")=="branding-img-container") {
          h3s[i].children[0].setAttribute("src",lorepic);
        }
        if(h3s[i].getAttribute("class")=="channel-header-profile-image") {
          h3s[i].setAttribute("src",lorepic);
        }
       if(changenames && h3s[i].getAttribute("class")=="stat attribution" || h3s[i].getAttribute("class")=="qualified-channel-title-text" || ((h3s[i].getAttribute("class")=="yt-lockup-title" || h3s[i].getAttribute("class")=="yt-lockup-title ") && (h3s[i].parentNode && h3s[i].parentNode.parentNode && h3s[i].parentNode.parentNode.getAttribute("class")!=="yt-lockup-dismissable"))) {
          h3s[i].children[0].innerText=lorename;
        }
        if(changenames && (h3s[i].getAttribute("class")=="comment-renderer-header" && h3s[i].children[0].getAttribute("class")!=="comment-renderer-author-comment-badge") || h3s[i].getAttribute("class")=="comment-renderer-author-comment-badge") {
          h3s[i].children[0].innerText=lorename;
        }
      }
    }
   },360);