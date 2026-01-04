// ==UserScript==
// @name           YAAS (YouTube Ads Auto Skip)
// @description    Automatically closes the banner ad or clicks the "Skip ad" button.
// @name:uk        YAAS (Автоматичний пропуск реклами на YouTube).
// @description:uk Автоматично закриває рекламний банер чи клікає по кнопці "Пропустити рекламу".
// @version        3.0.5
// @namespace      https://greasyfork.org/uk/users/741855
// @author         boboha
// @match          *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/422390/YAAS%20%28YouTube%20Ads%20Auto%20Skip%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422390/YAAS%20%28YouTube%20Ads%20Auto%20Skip%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let skiped = true,
        video_speed = 1,
        player,
        video;
    const SEC = 1000,
          TO = 0 * SEC,
          TO_SUBSCIBED_VIDEO = 10 * SEC,
          TO_SUBSCIBED_BANNER = 5 * SEC,
          AD_SPEED = 6,
          log = (...msg) => { console.log('[YAAS]', ...msg) },
          isSubscribed = () => document.querySelector('#subscribe-button [subscribed]') ? true : false,
          skipVideo = (btn) => {
              skiped = false;
              btn.addEventListener('click', setSkiped, false);
              setTimeout(() => {
                  skip(btn);
              }, isSubscribed() ? TO_SUBSCIBED_VIDEO : TO);
          },
          setSkiped = () => { skiped = true; log('Video skiped!') },
          skip = (btn) => {
              if (btn.nodeType === 1 && getComputedStyle(btn).display === 'inline-block') {
                  btn.click();
              } else {
                  setTimeout(() => {
                      !skiped && skip(btn);
                  }, 100);
              }
          },
          closeBanner = (btn) => {
              btn.addEventListener('click', setClosed, false);
              setTimeout(() => {
                  btn.click();
              }, isSubscribed() ? TO_SUBSCIBED_BANNER : TO);
          },
          setClosed = () => { log('Banner closed!') },
          observer = new MutationObserver(mutations => {
                  for (const mutation of mutations) {
                      try {
                          if (mutation.target.className === 'video-ads ytp-ad-module') {
                              if (mutation.addedNodes.length) {
                                  // Video loading
                                  if (mutation.addedNodes[0].className === 'ytp-ad-player-overlay') {
                                      if (!video.muted) video.muted = true;
                                      if (video.playbackRate != AD_SPEED) video.playbackRate = AD_SPEED;
                                      log('Video is loaded...', '(', Math.round(video.duration), 's )');
                                  }
                                  // Banner loading
                                  else if (mutation.addedNodes[0].className === 'ytp-ad-overlay-slot') {
                                      log('Banner is loaded...');
                                      // Banner closing
                                      const close_button = mutation.addedNodes[0].querySelector('.ytp-ad-overlay-close-container > .ytp-ad-overlay-close-button');
                                      close_button && closeBanner(close_button);
                                  }
                                  // Pre ad countdown start
                                  else if (mutation.addedNodes[0].className === 'ytp-ad-message-overlay') {
                                      video_speed = video.playbackRate;
                                  }
                                  // Interstitial ad countdown
                                  else if (mutation.addedNodes[0].className === 'ytp-ad-action-interstitial') {
                                      if (!isSubscribed()) {
                                          const btn = mutation.target.querySelector('.ytp-ad-text.ytp-ad-skip-button-text');
                                          btn && btn.click();
                                          log('Interstitial ad skiped!');
                                      }
                                  }
                                  // else {}
                              } else if (mutation.removedNodes.length) {
                                  if (mutation.removedNodes[0].id.startsWith('player-overlay')) {
                                      video.muted=false;
                                      video.playbackRate = video_speed;
                                      log('Video ended');
                                  }
                                  // Pre ad countdown end
                                  else if (mutation.removedNodes[0].className === 'ytp-ad-message-overlay') {
                                      video.muted = true;
                                      video.playbackRate = AD_SPEED;
                                  }
                              }
                          }

                          // Video skiping
                          if (mutation.target.className === 'ytp-ad-skip-button-slot') {
                              const skip_button = mutation.target.querySelector('.ytp-ad-skip-button-container > .ytp-ad-skip-button');
                              skip_button && skipVideo(skip_button);
                          }
                      } catch (e) {
                          console.groupCollapsed(e.message, mutation.target);
                          log(mutation);
                          console.groupEnd();
                      }
                  }
          }),
          initPlayer = () => {
              if (player) {
                  log('Init Player');
              } else {
                  player = document.querySelector('#movie_player');
                  initPlayer();
              }
          },
          toggleObserver = () => {
              if (location.pathname === '/watch') {
                  if (player) {
                      if (!video) {
                          video = document.querySelector('video.html5-main-video');
                          observer.observe(player, {childList: true, attributes: true, subtree: true});
                          log('Observer start');
                      }
                  } else {
                      initPlayer();
                      toggleObserver();
                  }
              } else {
                  if (player) {
                      observer.disconnect();
                      player = null;
                      video = null;
                      log('Observer stop');
                  } else {
                    initPlayer();
                  }
              }
          };

    window.addEventListener('yt-navigate-start', toggleObserver);
    toggleObserver();

})();