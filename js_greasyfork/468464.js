// ==UserScript==
// @name        Disable Spoilers
// @namespace   FoxyBoy
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      TailsTheFox
// @description You probably think it's useless for a big site like YouTube, and I don't blame you, but people with ADHD always get the urge to look at comments or most replayed before watching and accidentally see spoilers.
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/468464/Disable%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/468464/Disable%20Spoilers.meta.js
// ==/UserScript==
window.addEventListener("load", () => {
  setTimeout(function() {
    document.querySelector(".style-scope.ytd-comments").remove();
    document.querySelector(".style-scope.ytd-comments").remove();
    document.querySelector(".style-scope.ytd-comments").remove();
    document.querySelector(".style-scope.ytd-comments").remove();
    document.querySelector(".style-scope.ytd-watch-metadata").innerHTML = "Spoilers and comments removed :)";
    document.querySelector(".ytp-timed-markers-container").remove();
    document.querySelector('.ytp-progress-bar-container').classList.remove('ytp-progress-bar-container');
    document.querySelector('.ytp-progress-bar').classList.remove('ytp-progress-bar');
    document.querySelector('.ytp-progress-bar-padding').classList.remove('ytp-progress-bar-padding');
    const popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "50%";
popup.style.left = "50%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.backgroundColor = "#1d1d1d";
popup.style.boxShadow = "rgba(0, 0, 0, 0.2) 3.5px 3.5px 10px 0px";
popup.style.borderRadius = "5px";
popup.style.padding = "25px 25px";

const title = document.createElement("h1");
title.style.color = "#eaeaea";
title.innerText = "Mod enabled";

const desc = document.createElement("p");
desc.style.color = "#eaeaea";
desc.innerText = "You probably think it's useless, but people with ADHD always get the urge to look at comments or most replayed before watching and accidentally see spoilers.";

const closeBtn = document.createElement("button");
closeBtn.style.fontFamily = "Tahoma";
closeBtn.style.fontSize = "18px";
closeBtn.style.border = "none";
closeBtn.style.color = "#eaeaea";
closeBtn.style.backgroundColor = "#363636";
closeBtn.style.outline = "none";
closeBtn.innerText = "Close";

closeBtn.addEventListener("click", function() {
  popup.remove();
});

popup.appendChild(title);
popup.appendChild(desc);
popup.appendChild(closeBtn);
document.body.appendChild(popup);
  }, 53 * 100);
});