// ==UserScript==
// @name        isaeonline skipper
// @namespace   Violentmonkey Scripts
// @match       https://www.isaeonline.com/user/online-class-db/*
// @require     https://www.isaeonline.com/user/online-class-db/js/util.js
// @run-at      document-idle
// @grant       none
// @version     1.2
// @author      ice_fly
// @description  Skips voice and video after doFadeInCurrSlide is called, using MutationObserver.
// @downloadURL https://update.greasyfork.org/scripts/529949/isaeonline%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/529949/isaeonline%20skipper.meta.js
// ==/UserScript==
function tryToClick(querySel){
  var clickable=document.querySelector(querySel);
  if (clickable){clickable.click()}
}
function skip() {
  if (typeof document.querySelector('[data-is="5198FE52-5056-A02D-9C3F40598F205483"]' !== 'undefined')){
    window.setTimeout(tryToClick('[data-is="5198FE52-5056-A02D-9C3F40598F205483"]'),1600); //data-is appears to be constant but without another account i don't know. Inspect element if this breaks
  }
  if (typeof window.showVideoExercise === 'function' && typeof window.voiceDoneShowNextSlideButton === 'function') { // sometimes this glitches out due to ajx not keeping pace, just reload the page
    console.log('skip');
      window.voiceDoneShowNextSlideButton(); // skip voice
      if(window.doesPageHaveExercise()){
        window.showVideoExercise(); // skip video
        window.setTimeout(tryToClick('span.slideButtonContinue'),1600);
      } else {
        window.setTimeout(tryToClick('span.slideButtonOrange'),1600);
      }
  } else {
    console.log('func not def');
  }
}

var interval = setInterval(function(){
  if (typeof window.doFadeInCurrSlide === 'function' && typeof window.showVideoExercise === 'function' &&
      typeof window.g_highestPageThisChapter !== 'undefined' && typeof window.g_chapterPagesArr !== 'undefined') {
    skip();
  } else {console.log('page not load')}
},2400); //slow this down as needed