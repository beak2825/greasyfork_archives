// ==UserScript==
// @name        Fix Skip YouTube Ads Bug in Brave
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @version     0.0.002
// @author      -
// @license MIT
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @description For personal use only.
// @downloadURL https://update.greasyfork.org/scripts/521853/Fix%20Skip%20YouTube%20Ads%20Bug%20in%20Brave.user.js
// @updateURL https://update.greasyfork.org/scripts/521853/Fix%20Skip%20YouTube%20Ads%20Bug%20in%20Brave.meta.js
// ==/UserScript==


(() => {

  let cid = 0;

  const [setInterval_, clearInterval_, setTimeout_, clearTimeout_] = [setInterval, clearInterval, setTimeout, clearTimeout];

  const Promise = (async () => { })().constructor;

  let md1 = '';
  let md2 = 0;
  let qt = 0;

  let wd1 = 0;
  let wd2 = 0;

  const timerFn = () => {

    const mps = [...document.querySelectorAll('#movie_player')].filter(e => !e.closest('[hidden]'));
    if (mps.length !== 1) return;

    const media = mps[0].querySelectorAll('audio, video');
    if (media.length !== 1) return;
    const md = media[0];

    if (Number.isFinite(md.currentTime) && md.currentTime > wd1 && md.currentTime > 0.1) {
      wd1 = md.currentTime;
      wd2++;
    } else if (Number.isFinite(md.currentTime) && md.currentTime > 0.1) {

    } else {
      wd1 = 0;
      wd2 = 0;
    }

    if (wd2 >= 3) {
      clearInterval_(cid);
      cid = 0;
    }

    if (Number.isFinite(md.currentTime) && md.currentTime < 0.0001 && md.duration > 5 && (qt ? md.duration < qt + 5 : true)) {
      const t = `${md.currentTime}${md.duration}${md.src}`;
      if (md1 === t) md2++;
      else {
        md1 = t;
        md2 = 0;
      }

    } else if (md2 > 0) {
      md1 = '';
      md2 = 0;
    }

    if (md2 >= 3) {
      md.currentTime = md.duration;
    }

  };

  const triggerFn = async (m) => {

    cid && clearInterval_(cid);
    cid = 0;
    if (m !== null) qt = +m;
    md1 = '';
    md2 = 0;
    wd1 = 0;
    wd2 = 0;

    const conditionCheck = () => {

      const mps = [...document.querySelectorAll('#movie_player')].filter(e => !e.closest('[hidden]'));
      if (mps.length !== 1) return false;

      const media = mps[0].querySelectorAll('audio, video');
      if (media.length !== 1) return false;

      return true;
    }

    let tryCount = 8;
    while (r = !conditionCheck()) {
      await new Promise(r => setTimeout_(r), 80);
      if (--tryCount <= 0) break;
    }

    if (!cid && !r) cid = setInterval_(timerFn, 250);

  }

  document.addEventListener('yt-page-data-fetched', (evt) => {
    const pageFetchedDataLocal = evt.detail;
    const m = pageFetchedDataLocal?.pageData?.playerResponse?.videoDetails?.lengthSeconds;
    triggerFn(m);
  }, false);

  document.addEventListener('durationchange', (evt) => {
    if (evt.target instanceof HTMLMediaElement) {
      triggerFn();
    }
  }, true);

})();


