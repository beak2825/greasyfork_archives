// ==UserScript==
// @name         Loop exercise videos
// @namespace    Itsnotlupus Industries
// @version      1.0
// @description  Exercise videos will loop, press space to start playing, press F for full screen.
// @author       itsnotlupus
// @license      MIT
// @match        https://www.muscleandstrength.com/exercises/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=muscleandstrength.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503678/Loop%20exercise%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/503678/Loop%20exercise%20videos.meta.js
// ==/UserScript==
/* global Vimeo, YT */
/* jshint esversion: 11 */

// Videos seen so far are one of
// 1. adhoc flowplayer with <video> tags
// 2. embedded Vimeo players
// 3. embedded Youtube players
// Each type needs its own handling to loop and control playback.

document.head.append(Object.assign(document.createElement('script'), { src: "https://www.youtube.com/iframe_api" }));
document.head.append(Object.assign(document.createElement('script'), { src: "https://player.vimeo.com/api/player.js" }));

function onYouTubeIframeAPIReady() {
  console.log("YOUTUBE IFRAME API READY!");
}

function init() {
  const video = document.querySelector('video');
  const iframe = document.querySelector('iframe');
  if (!video && !iframe) return setTimeout(init, 1000);
  if (!window.YT) return setTimeout(init, 1000);
  if (!window.Vimeo) return setTimeout(init, 1000);
  let player; // youtube or vimeo player API.
  if (video) {
    console.log('found old video, adding loop attribute');
    video.loop = true;
  } else if (iframe) {
    const url = new URL(iframe.src);
    if (url.host.includes('youtube')) {
      console.log('found youtube video, adding loop and loading player object');
      const id = url.pathname.split('/').at(-1);
      iframe.src += '&enablejsapi=1&mute=1&loop=1&playlist=' + id;
      iframe.id = iframe.id || 'YoutubeVideoWidget';
      player = new YT.Player(iframe.id);
    } else if (url.host.includes('vimeo')) {
      console.log('found vimeo video, adding loop and loading player object');
      iframe.src += '&loop=1';
      player = new Vimeo.Player(iframe);
    } else {
      return setTimeout(init, 1000);
    }
  }
  // full screen toggling by pressing "F"
  const fullscreen = (e=document.documentElement, d=e.ownerDocument) => d.fullscreenElement ? d.exitFullscreen() : e.requestFullscreen();
  addEventListener('keypress', async e=> {
    if (document.activeElement != document.body) return; // don't mess with text fields.
    if (e.key == 'f') {
      e.preventDefault();
      fullscreen(video?.parentElement?.parentElement ?? iframe);
    }
    if (e.key == ' ') {
      e.preventDefault();
      if (video) document.querySelector('.fp-ui').click();
      if (iframe) {
        const url = new URL(iframe.src);
        if (url.host.includes('youtube')) {
          if (player.getPlayerState() == 1) {
            player.pauseVideo();
          } else {
            player.playVideo();
          }
        } else {
          // vimeo, probably
          const paused = await player.getPaused();
          if (paused) {
            player.play();
          } else {
            player.pause();
          }
        }
      }
    }
  });
}

init();
