// ==UserScript==
// @name        Sync media
// @description You can set the start timet to syncronize the media.
// @namespace   utubo/syncmedia
// @match       https://www.youtube.com/*
// @match       https://abema.tv/*
// @version     1.0
// @author      -
// @name:ja     Sync media
// @description:ja You can set the start timet to syncronize the media.
// @downloadURL https://update.greasyfork.org/scripts/465726/Sync%20media.user.js
// @updateURL https://update.greasyfork.org/scripts/465726/Sync%20media.meta.js
// ==/UserScript==

(function() {
  // ----------
  // sync
  const INTERVAL = 5000;
  const RANGE = 1;
  let timer = null;
  let startDateTime = null;
  const syncVideo = () => {
    if (!startDateTime) return;
    clearTimeout(timer);
    timer = setTimeout(syncVideo, INTERVAL);
    let target = null;
    if (location.host === 'abema.tv') {
      target = document.querySelector('video[preload=metadata]');
    } else {
      target = document.querySelector('video');
    }
    if (!target) return;
    const syncTime = (Date.now() - startDateTime) / 1000;
    if (Math.abs(target.currentTime - syncTime) > RANGE) {
      target.currentTime = syncTime;
    }
  };

  // ----------
  // ui
  const msecToStr = msec => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return new Date(msec - tzoffset)
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d\d\dZ$/, '');
  };

  const showDlg = () => {
    const val = prompt('⏱Set the start time', msecToStr(startDateTime || Date.now()));
    if (val === null) return;
    startDateTime = new Date(val).getTime();
    syncVideo();
  };

  addEventListener('keydown', e => {
    if (e.altKey && e.key === 's') {
      showDlg();
    }
  });

})();
