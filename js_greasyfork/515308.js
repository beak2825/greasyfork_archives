// ==UserScript==
// @name          DIUserscript for AudioAddict platforms - my CSS code to reuse for future updates of main script
// @description   Corrections to UI of di.fm and related sites
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         https://*.di.fm*
// @match         https://di.fm*
// @match         https://*.classicalradio.com*
// @match         https://classicalradio.com*
// @match         https://*.radiotunes.com*
// @match         https://radiotunes.com*
// @match         https://*.jazzradio.com*
// @match         https://jazzradio.com*
// @match         https://*.rockradio.com*
// @match         https://rockradio.com*
// @match         https://*.zenradio.com*
// @match         https://zenradio.com*
// @version       2.0
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/515308/DIUserscript%20for%20AudioAddict%20platforms%20-%20my%20CSS%20code%20to%20reuse%20for%20future%20updates%20of%20main%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/515308/DIUserscript%20for%20AudioAddict%20platforms%20-%20my%20CSS%20code%20to%20reuse%20for%20future%20updates%20of%20main%20script.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  //CSS for any mode
  var css = `
  /*Remove link to mobile app*/
  .android-app-banner, .ios-app-banner {
    display: none !important;
  }
  #root[data-page-container], #page[data-page-container] {
    transform: none !important;
  }

  /*Remove banners*/
  .homepage-banners {
    display: none !important;
  }
  .channel-mosaic-layout--original {
    margin-top: 0px !important;
  }

  /*Remove tooltip about number of skips available per hour*/
  .skip-button div[data-tooltip-region] {
    display: none !important;
  }

  /*Add border under the player*/
  .wp-visible #webplayer-region {
    border-bottom: black solid 5px !important;
  }

  /*Make waveform canvas usable in mobile browser*/
  .column-view--single-column .now-playing-component--channel-theme.now-playing-component--has-waveform .now-playing-component__waveform-region {
    margin-top: 10px !important;
  }
  .column-view--single-column .now-playing-component--channel-theme.now-playing-component--has-waveform .vote-buttons-component {
    margin-top: 5px !important;
  }
  @media (width <= 500px) {
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__timecode {
      display: unset !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__label {
      line-height: 1 !important;
      margin-bottom: 5px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__tile {
      display: none !important;
    }
    .column-view--single-column .now-playing-component--channel-theme.now-playing-component {
      padding-left: 0px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__tile .play-button-circular-component {
      display: none !important;
    }
  }
  @media (500px < width <= 780px) {
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__timecode {
      display: unset !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__label {
      line-height: 1 !important;
      margin-bottom: 5px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__tile {
      width: 60px !important;
      height: 60px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme.now-playing-component {
      padding-left: 0px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme.now-playing-component .now-playing-component__label,
    .column-view--single-column .now-playing-component--channel-theme.now-playing-component .now-playing-component__title,
    .column-view--single-column .now-playing-component--channel-theme.now-playing-component .now-playing-component__artist {
      padding-left: 80px !important;
    }
    .column-view--single-column .now-playing-component--channel-theme .now-playing-component__tile .play-button-circular-component {
      width: 90% !important;
      height: 90% !important;
      top: 5% !important;
      left: 5% !important;
    }
  }
  .column-view--single-column .now-playing-component--channel-theme .now-playing-component__timecode {
    font-weight: bold !important;
  }

  /*Correct track description position in desktop browser*/
  .column-view--main-content .now-playing-component--channel-theme .now-playing-component__label {
    padding-top: 0px !important;
  }

  /*Correct track description position in mobile browser*/
  @media (width <= 727px) {
    #embedded-webplayer-region {
      padding-top: 70px !important;
      padding-bottom: 20px !important;
    }
    #embedded-webplayer-region #now-playing {
      margin-top: -4px !important;
      padding-top: 0px !important;
    }
    /*#embedded-webplayer-region #wp-track-vote-buttons .track-voting-component__vote-btn {
      height: 38px !important;
      line-height: 36px !important;
    }*/
    #embedded-webplayer-region #row-player-controls {
      padding-top: 0px !important;
    }
    #embedded-webplayer-region #art, #embedded-webplayer-region #play-button {
      top: 4px !important;
    }
  }

  /*Web-player controls always visible*/
  #embedded-webplayer-region #now-playing {
    opacity: 1 !important;
  }

  /*Correct previous track button in mobile browser*/
  div.actions-menu .diu-prevtrack-container .icon-skip::before {
    content: "\\f15e" !important;
    transform: rotateY(180deg) !important;
    margin-left: -3px !important;
  }
  div.actions-menu .icon-skip::before {
    margin-top: 4px !important;
    margin-left: 2px !important;
  }
  div.actions-menu .skip-button__text {
    margin-left: -2px !important;
  }
  div.actions-menu .diu-prevtrack-container .prev-button {
    margin-bottom: 10px !important;
  }
  div.actions-menu .diu-prevtrack-container .rotateback[data-v-30541998]:not(.foo) {
    -webkit-transform: unset !important;
    transform: unset !important;
  }

  /*Hide today's free channels*/
  .channel-mosaic__free-channels-heading, .marionette-region[data-daily-free-tooltip-region], .marionette-region[data-daily-free-channels-region],
  div#root .content-area.flex-wrap .column-view .column-view__section[data-region-1] {
    display: none !important;
  }

  /*Hide "Unlock with premium"*/
  .channel-mosaic__all-channels-heading.channel-mosaic__all-channels-heading--locked .channel-mosaic__all-channels-msg, a[data-track-group="unlockAllWithPremium"] {
    display: none !important;
  }

  /*Optimize "About channel"*/
  .channel-info-component .channel-info-component__wrap,
  .about-channel > .about-channel__content {
    display: unset !important;
  }
  .channel-info-component .channel-info-component__image,
  .about-channel > .about-channel__content > .marionette-region,
  ul.interact > li.current-channel.interact-item > .artwork {
    display: none !important;
  }
  .channel-info-component .channel-info-component__info,
  .about-channel > .about-channel__content > .about-channel__description,
  ul.interact > li.current-channel.interact-item > .info {
    width: 90% !important;
  }

  /*Remove Get Premium to unlock all the music! and Get apps button*/
  .content-area .column-view__section > .homepage-hero-cta, .get-apps-cta {
    display: none !important;
  }

  /*Make top padding on homepage of di.fm*/
  .page-layout--homepage .column-view__section[data-region-0] {
    padding-top: 20px !important;
  }

  /*Amend left and right paddings on homepage and genre page of di.fm*/
  .page-layout--homepage .column-view__section .horizontal-content-browser,
  .page-layout--genre-detail .column-view__section .horizontal-content-browser,
  .page-layout--genre-detail .column-view__section .page-title-component {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  /*Remove try premium button and slideshow*/
  .premium-button, #slideshow-wrap {
    display: none !important;
  }
  `;

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }
})();
