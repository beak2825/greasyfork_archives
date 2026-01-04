// ==UserScript==
// @name         Soundcloud Mobile Enhancer
// @namespace    http://tampermonkey.net/
// @version      2025-08-11
// @description  Improve soundcloud experience
// @author       You
// @match        https://m.soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545476/Soundcloud%20Mobile%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/545476/Soundcloud%20Mobile%20Enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    .Artwork_RoundedArtwork__124l2 {
      border-radius: 15px;
    }
    .FullPlayer_FullPlayerActions__CiaE6 {
      color: var(--white-color, #fff);
      display: flex;
      justify-content: space-around;
      flex-grow: 0.3;
      background-color: black;
      height: 70px;
      border-radius: 20px;
    }
    .Modal_Modal__17Lu7 {
      transition: transform .3s ease-in-out;
    }
    .FullPlayer_FullPlayerBtn__LWbjV {
      background-color: black;
      color: white !important;
    }
    .FullPlayer_FullPlayerBtn__LWbjV svg {
      color: white !important;
    }
    .Modal_LargeScreenModal__3g9gi {
      position: absolute;
      left: 50%;
      bottom: 50%;
      width: 567px;
      max-height: 80%;
      transform: translate(-50%,150%);
      visibility: hidden;
      transition: transform .3s ease-in-out, visibility .2s ease-in-out;
    }
    /* Blur toggle classes */
    .FullPlayer_FullPlayerArtworkImage__3XG4S.blurredArtwork {
      filter: blur(100px) !important;
      transtransition: filter 0.2s linear;
    }
    .FullPlayer_FullPlayerArtworkImage__3XG4S.clearArtwork {
      filter: blur(0px) !important;
      transition: filter 0.2s linear;
    }
    .Swipeable_SwipeableCarousel__rI8Je {
    transition: transform 0.1s linear 0.1s;
    }
  `);

  const selectors = [
    'div.HomePageHeroImage_HeroContainer__3iuuI',
    'div.Header_RightContainer__1VyFh',
    'div.Me_CtaContainer__mg8ss.Me_GreenCtaContainer__zpqfE',
    'div.Me_CtaContainer__mg8ss.Me_OrangeCtaContainer__3NtxC',
    'div.FooterStoreSection_FooterStoreSection__30zge',
    'div.MiniPlayer_MiniPlayerBtn__240Sd.MiniPlayer_MiniPlayerLike__2JfRP.Engagement_EngagementItem__DBRbj',
    'button.BaseButton_BaseButton__RweeB.Button_shared_Button__4WBj-.Button_Primary__ka8Iw.Button_Medium__3vYzd',
    'button.anotherButtonClass'
  ];

  function removeElements() {
    const elements = document.querySelectorAll(selectors.join(','));
    if (elements.length > 0) {
      elements.forEach(el => el.remove());
      console.log('Removed element(s)');
    }
  }

  // Run once immediately
  removeElements();

  // Mutation observer for removing elements
  const removeObserver = new MutationObserver(() => {
    removeElements();
  });
  removeObserver.observe(document.body, { childList: true, subtree: true });



//Swipeable_SwipeableCarousel__rI8Je


  // ======= Blur toggle logic =======

  function updateBlur() {
    const artwork = document.querySelector('.FullPlayer_FullPlayerArtworkImage__3XG4S');
    if (!artwork) return;

    const playBtn = document.querySelector('button.FullPlayer_FullPlayerPlay__kFeHk[data-testid="fullplayer-play"]');
    const pauseBtn = document.querySelector('button.FullPlayer_FullPlayerPause__3ydQ-[data-testid="fullplayer-pause"]');

    if (playBtn && playBtn.offsetParent !== null) {
      artwork.classList.add('blurredArtwork');
      artwork.classList.remove('clearArtwork');
      //console.log('Paused — artwork blurred');
    } else if (pauseBtn && pauseBtn.offsetParent !== null) {
      artwork.classList.remove('blurredArtwork');
      artwork.classList.add('clearArtwork');
      //console.log('Playing — artwork clear');
    }
  }

  // Poll every 500ms — less resource intensive than MutationObserver here
  setInterval(updateBlur, 500);

})();
