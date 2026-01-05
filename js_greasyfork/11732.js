// ==UserScript==
// @name        YouTube HTML5 AutoPause
// @namespace   https://greasyfork.org/en/users/13981-chk1
// @description Automatically pause YouTube HTML5 videos on Youtube
// @include     https://*.youtube.com/watch*
// @include     http://*.youtube.com/watch*
// @version     0.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/11732/YouTube%20HTML5%20AutoPause.user.js
// @updateURL https://update.greasyfork.org/scripts/11732/YouTube%20HTML5%20AutoPause.meta.js
// ==/UserScript==

var config = { 
  childList: true,
  attributes: true, 
  subtree: true,
  attributeOldValue: true
};

var docbody = document.body;
var playBtn;

var playBtnObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type == "attributes"){// && mutation.oldValue == "ytp-play-button ytp-button") {
      //console.log(mutation);
      //console.log(playBtn);
      playBtn.click();
      playBtnObserver.disconnect();
    }
  });
});

var bodyObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type == "childList" && mutation.addedNodes.length >= 1) {
      //console.log(mutation);
      var _playBtn = document.querySelector('.ytp-play-button');
      if(_playBtn){
        playBtn = _playBtn;
        bodyObserver.disconnect();
        playBtnObserver.observe(playBtn, config);
      }
    }
  });    
});

bodyObserver.observe(docbody, config);