// ==UserScript==
// @name Pluto.tv auto mute'n'hide ads
// @namespace Violentmonkey Scripts
// @version 2.5
// @locale en
// @author       mihau
// @supportURL   https://greasyfork.org/en/scripts/535805-pluto-tv-auto-mute-n-hide-ads
// @license MIT
// @description mutes and hides embedded/"hardcoded"/non skippable ad breaks on Pluto tv live channels
// @match https://pluto.tv/gsa/live-tv*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/535805/Plutotv%20auto%20mute%27n%27hide%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/535805/Plutotv%20auto%20mute%27n%27hide%20ads.meta.js
// ==/UserScript==

// if you don't want to *hide* the ads while playing, change this from 1 to 0 :
let hidevid = 1;
// if you don't want to the audio to be unmuted and video to maximized (to full vieport width), change this from 1 to 0 :
let maximized = 1;

// best don't edit below this line

addEventListener("DOMContentLoaded", (event) => {
  
// via https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitforit(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
  
waitforit('.avia-container').then((elm) => {
    go();
});

function go() {
    
    const t = document.querySelector('meta[property="og:title"]').content.replace("Watch ","").replace(": Live TV Channel for Free | Pluto TV","")

    const noads = document.createElement("div");

    noads.style.display = "none";
    noads.style.width = "100%";
    noads.style.height = "100%";
    noads.style.top = "0";
    noads.style.left = "0";
    noads.style.right = "0";
    noads.style.bottom = "0";
    noads.style.fontSize = "xx-large"; 
    noads.style.position = "fixed";
    noads.id = "noads";

    noads.innerHTML  = '<div style="position: relative;  text-align: center;  color: white;"><img src="' + document.querySelector('meta[property="og:image"]').content + '" style="width:100%;height: 100%"/>';
    noads.innerHTML += '<div style="position: absolute; top: 15%; left: 15%; color: white; font: bold 150px arial,sans-serif;">AD<br />BREAK</div></div>';
    
    document.body.appendChild(noads);

    const observer = new MutationObserver(function(mutations) {

      mutations.forEach(function(mutation) {
        let v = document.getElementsByTagName("video")[0];
        
        let x = document.getElementById("root");
        let y = document.getElementById("modal-root");

        if (document.querySelectorAll("[class^='adPodProgressIndicator']")[0].innerHTML != "") {
          if (hidevid == 1) {
            x.style.visibility="hidden";
            y.style.visibility="hidden";
            noads.style.display="block";
          }
          v.muted = true;
          document.title = "AD BREAK: " + t;
        } else {
          if (hidevid == 1) {
            x.style.visibility="visible";
            y.style.visibility="visible";
            noads.style.display="none";
          }
          v.muted = false;
          document.title = t;
        }
      });

    });
    
    observer.observe(document.querySelector(".upper-right-stacked"), { childList: true, subtree: true });

    setTimeout(function() {

        if (maximized == 1) {

            document.getElementsByClassName("fullbrowser-btn-atc")[0].click();
            document.getElementsByClassName("unmute-btn-atc")[0].click();

        }
      
        document.title = t;

    }, 1250);

  }

})