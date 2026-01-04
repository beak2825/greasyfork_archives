// ==UserScript==
// @name         RedditP Collect
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Collect cool stuff while staying in the flow. Download them at the end.
// @author       Leeroy
// @match        http://redditp.com/*
// @grant        GM_addStyle
// @grant        GM_download
// @noframes
// @nocompat Chrome
// @downloadURL https://update.greasyfork.org/scripts/39494/RedditP%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/39494/RedditP%20Collect.meta.js
// ==/UserScript==
/* global rp */

/*
WARNING GM_download must be set to Browser API in Tampermonkey settings
*/
rp.savedURLs = rp.savedURLs || [];
if(saveEvent) document.removeEventListener("keyup", saveEvent);

GM_addStyle('#timeToNextSlide{width:2.4rem}.sort-link{display:table}#subredditUrl.with-sort{padding-top:0;padding-bottom:0;max-width:145px;white-space:nowrap;}.numberButton.saved,.numberButton.saved.active{background:#00C853;color:#eee!important}.numberButton.saved.downloaded{background:#006429}@keyframes burst{0%{opacity:.6}50%{-webkit-transform:scale(1.8);-ms-transform:scale(1.8);transform:scale(1.8);opacity:0}100%{opacity:0}}body.saved #titleDiv:before{content:"\\2705 ";color:#00C853;position:fixed;width:99%;text-align:right;right:1em;top:1em;font-weight:700;font-size:large}body.confirm:after{-webkit-animation:burst 2s forwards linear;animation:burst 2s forwards linear;content:"\\2705";color:#00C853;background-color:#fff;border-radius:50%;position:fixed;font-size:2rem;line-height:4rem;text-align:center;z-index:999;height:2em;width:2em;margin:auto;top:0;left:0;bottom:0;right:0}');

function getFilename(path) {
  return path.split('\\').pop().split('/').pop();
}

var downloadSaved = function() {
  // Download collection one by one (must be allowed by user)
  rp.savedURLs.forEach(function(url) {
    GM_download(url, getFilename(url));
  });
  [].map.call(document.querySelectorAll('.numberButton.saved'), function(el) {
    el.classList.add('downloaded');
  });
  rp.savedURLs = [];
};

rp.saveActive = function() {
  var activeNumberButton = document.querySelector(".numberButton.active");

  var url = rp.photos[rp.session.activeIndex].type === "gfycat" ? document.querySelector("video source").src : rp.photos[rp.session.activeIndex].url;
  url = url.replace(".gifv",".webm");

  var index = rp.savedURLs.indexOf(url);
  if (index !== -1) {
    activeNumberButton.classList.remove("saved");
    rp.savedURLs.splice(index, 1);
    checkSaved();
  } else {
    activeNumberButton.classList.add("saved");
    rp.savedURLs.push(url);
    checkSaved();
  }
};

var saveEvent = function(e) {
  var S_KEY = 83,
      D_KEY = 68;
  if(e.keyCode === S_KEY) {
    rp.saveActive();
    document.body.classList.toggle("confirm", (document.querySelector(".active.saved")));
  }
  if(e.keyCode === D_KEY) {
    downloadSaved();
  }
};

document.addEventListener("keyup", saveEvent, false);

var checkSaved = function() {
  document.body.classList.toggle("saved", document.querySelector(".active.saved"));
  document.body.classList.remove("confirm");
};

var enableLoop = function() {
  // Always enable loop on videos
  if(rp.photos[rp.session.activeIndex].type !== "image") document.querySelector("video").loop = true;
};

var observer = (function() {
  // select the target node
  var target = document.querySelector('#pictureSlider');

  // create an observer instance
  var observer = new MutationObserver(function(mutations) {
    checkSaved();
    // On the first mutation the video element isn't ready yet
    if(mutations[0].removedNodes.length) enableLoop();
  });
  // pass in the target node, as well as the observer options
  observer.observe(target, {childList: true});
  return observer;
})();