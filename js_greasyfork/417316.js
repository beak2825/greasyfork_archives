// ==UserScript==
// @name         Block Youtube Sign-in Pop-up
// @namespace    http://d4d4k.github.io
// @version      0.1
// @description  this script blocks the annoying 'Sign in to YouTube' popup
// @author       Dadak
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417316/Block%20Youtube%20Sign-in%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/417316/Block%20Youtube%20Sign-in%20Pop-up.meta.js
// ==/UserScript==

// SentinelJS is a JavaScript library that lets you detect new DOM nodes
const sentinel = function(){var e,n,t,i=Array.isArray,r={},o={};return{on:function(a,s){if(s){if(!e){var f=document,l=f.head;f.addEventListener("animationstart",function(e,n,t,i){if(n=o[e.animationName])for(e.stopImmediatePropagation(),t=n.length,i=0;i<t;i++)n[i](e.target)},!0),e=f.createElement("style"),l.insertBefore(e,l.firstChild),n=e.sheet,t=n.cssRules}(i(a)?a:[a]).map(function(e,i,a){(i=r[e])||(a="!"==e[0],r[e]=i=a?e.slice(1):"sentinel-"+Math.random().toString(16).slice(2),t[n.insertRule("@keyframes "+i+"{from{transform:none;}to{transform:none;}}",t.length)]._id=e,a||(t[n.insertRule(e+"{animation-duration:0.0001s;animation-name:"+i+";}",t.length)]._id=e),r[e]=i),(o[i]=o[i]||[]).push(s)})}},off:function(e,a){(i(e)?e:[e]).map(function(e,i,s,f){if(i=r[e]){if(s=o[i],a)for(f=s.length;f--;)s[f]===a&&s.splice(f,1);else s=[];if(!s.length){for(f=t.length;f--;)t[f]._id==e&&n.deleteRule(f);delete r[e],delete o[i]}}})},reset:function(){r={},o={},e&&e.parentNode.removeChild(e),e=0}}}(document);

(() => {
  const isSignedIn = document.cookie.includes('APISID=');

  if (isSignedIn) return;

  addStyles();
  addScript();

  const observer = new MutationObserver(() => {
    const dismissButton = document.querySelector(
      'yt-upsell-dialog-renderer #dismiss-button'
    );

    dismissButton && dismissButton.click();

    const consentBump = document.querySelector('#consent-bump');

    if (consentBump) {
      consentBump.remove();

      const video = document.querySelector('video');

      if (!video) return;

      const onVideoPauseAfterConsentBump = () => {
        video.play();
        video.removeEventListener('pause', onVideoPauseAfterConsentBump);
        setPopupContainerDisplay();
      };

      video.addEventListener('pause', onVideoPauseAfterConsentBump);
    }
  });

  observer.observe(document.querySelector('ytd-app'), { childList: true });

  sentinel.on('.ytp-large-play-button', (button) => {
    let searchTime;
    try {
      searchTime = parseInt(location.search.match(/&t=(\d+)/)[1]);
    } catch {}

    button.click();
    searchTime && (document.querySelector('video').currentTime = searchTime);

    setPopupContainerDisplay();
  });

  function setPopupContainerDisplay() {
    const popupContainer = document.querySelector('.ytd-popup-container');
    popupContainer && (popupContainer.style.display = 'none');
  }

  function addStyles() {
    const style = document.createElement('style');

    style.innerHTML = /* css */ `
      #consent-bump,
      iron-overlay-backdrop,
      yt-upsell-dialog-renderer {
        display: none !important;
      }
    `;

    document.head.append(style);
  }

  function addScript() {
    const script = document.createElement('script');

    script.innerHTML = /* javascript */ `
      const player = document.querySelector('#movie_player');
      player && (player.stopVideo = function() { console.log("Don't stop!"); });
    `;

    document.body.append(script);
  }
})();