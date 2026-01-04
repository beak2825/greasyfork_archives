// ==UserScript==
// @name         YouTube enhancer for Via
// @namespace    https://viayoo.com/
// @version      1.3
// @license MIT
// @description  NewPipe button, force H.264 ≤30FPS, persistent quality lock, HW acceleration and opening videos and shorts in new tab so that pressing back gets you to previous tab without reloading.
// @author       jc
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.youtubekids.com/*
// @match        https://m.youtube.com/*
// @exclude      *://www.youtube.com/*/music*
// @exclude      *://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537139/YouTube%20enhancer%20for%20Via.user.js
// @updateURL https://update.greasyfork.org/scripts/537139/YouTube%20enhancer%20for%20Via.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1. FORCE H.264 & ≤30 FPS EVERYWHERE
  (function(){
    const BAD = /webm|vp8|vp9|av01/i;
    const FR = /framerate=(\d+)/;
    const ms = window.MediaSource;
    if (!ms) return;
    const orig = ms.isTypeSupported.bind(ms);
    ms.isTypeSupported = type => {
      if (typeof type !== 'string' || BAD.test(type)) return false;
      const m = FR.exec(type);
      if (m && +m[1] > 30) return false;
      return orig(type);
    };
  })();

  // 2. GPU-KICK HACK: hidden 1×1 WebGL canvas (offscreen/no styling touch)
  (function(){
    try {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      // use OffscreenCanvas if available
      const ctx = (window.OffscreenCanvas
                   ? new OffscreenCanvas(1,1).getContext('webgl')
                   : c.getContext('webgl'));
      // we never add it to the DOM, but context init triggers GPU paths
    } catch (e) {
      // ignore
    }
  })();

  // 3. YOUTUBE-ONLY: NewPipe download button
  if (/^https?:\/\/(?:\w+\.)?youtube\.com/.test(location.href)) {
    (function addNewPipeBtn(){
      function makeBtn(){
        const btn = document.createElement('div');
        btn.textContent = '↓';
        Object.assign(btn.style, {
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          background: '#222',
          color: '#fff',
          borderRadius: '50%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 999999,
          opacity: '0.6',
          transition: 'opacity .2s, transform .2s'
        });
        btn.addEventListener('mouseenter', ()=> btn.style.opacity='1');
        btn.addEventListener('mouseleave', ()=> btn.style.opacity='0.6');
        btn.addEventListener('click', ()=>{
          let id = new URL(location.href).searchParams.get('v');
          if (!id) {
            const m = location.pathname.match(/\/shorts\/([^\/?&]+)/);
            id = m && m[1];
          }
          if (id) {
            location.href = `intent://www.youtube.com/watch?v=${id}#Intent;scheme=https;package=org.schabi.newpipe;end`;
          }
        });
        document.body.appendChild(btn);
      }
      if (document.body) makeBtn();
      else new MutationObserver((_, obs)=>{
        if (document.body) {
          obs.disconnect();
          makeBtn();
        }
      }).observe(document.documentElement,{childList:true});
    })();

    // 4. YOUTUBE-ONLY: Persistent quality locker
    (function(){
      const KEY = 'yt_quality_preference';
      // watch menu for clicks on “240p, 360p, …”
      new MutationObserver(()=>{
        document.querySelectorAll('.ytp-menuitem-label')
          .forEach(el=>{
            if (/^\d+p$/.test(el.textContent)) {
              el.addEventListener('click',()=>{
                localStorage.setItem(KEY, el.textContent);
              },{once:true});
            }
          });
      }).observe(document.documentElement,{childList:true,subtree:true});

      const apply = ()=>{
        const q = localStorage.getItem(KEY);
        if (!q) return;
        const setQ = ()=>{
          const vid = document.querySelector('video');
          const player =
            vid?.player_ ||
            window.ytplayer?.config?.args ||
            (window.yt && yt.player && yt.player.getPlayerByElement &&
             yt.player.getPlayerByElement(document.querySelector('#movie_player')));
          try {
            player?.setPlaybackQuality(q);
            player?.setPlaybackQualityRange?.(q);
          } catch(e){}
        };
        const t = setInterval(setQ, 1000);
        setTimeout(()=> clearInterval(t), 8000);
      };
      document.addEventListener('yt-navigate-finish', apply);
      window.addEventListener('load', apply);
    })();

    // 5. YOUTUBE-ONLY MOBILE: open video links in new tab
    if (/^https?:\/\/m\.youtube\.com/.test(location.href)) {
      document.body.addEventListener('click', e=>{
        const a = e.target.closest('a[href]');
        if (!a) return;
        const u = a.href;
        if ((u.includes('/watch?v=') || u.includes('/shorts/'))
            && !a.closest('ytm-pivot-bar-renderer')
            && !a.closest('ytm-player-controls-overlay-renderer')
            && !a.closest('.player-controls-middle')) {
          e.preventDefault();
          e.stopPropagation();
          window.open(u, '_blank');
        }
      }, true);
    }
  }
})();