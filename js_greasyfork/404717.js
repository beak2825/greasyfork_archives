// ==UserScript==
// @name         Custom Native HTML5 Player with Shortcuts
// @namespace    https://gist.github.com/narcolepticinsomniac
// @version      1.9
// @description  Custom html5 player with shortcuts and v.redd.it videos with audio
// @author       narcolepticinsomniac
// @include      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @connect      v.redd.it
// @downloadURL https://update.greasyfork.org/scripts/404717/Custom%20Native%20HTML5%20Player%20with%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/404717/Custom%20Native%20HTML5%20Player%20with%20Shortcuts.meta.js
// ==/UserScript==

let imagusAudio;
let audioSync;
let audioError;
let ytID;
let ytTimeChecked;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const newEl = document.createElement.bind(document);

const settings = {
  // delay to hide contols and cursor if inactive (set to 3000 milliseconds)
  hideControls: 3000,
  // delay for fullscreen double-click (set to 300 milliseconds)
  clickDelay: 300,
  // right-click delay to match imagus user setting (set to 0 milliseconds)
  imagusStickyDelay: 0,
  // right/left arrows keys or inner skip buttons (set to 10 seconds)
  skipNormal: 10,
  // Shift + Arrow keys or outer skip buttons (set to 30 seconds)
  skipShift: 30,
  // Ctrl + Arrow keys skip (set to 1 minute)
  skipCtrl: 1,
};

const shortcutFuncs = {
  toggleCaptions: v => {
    const validTracks = [];
    for (let i = 0; i < v.textTracks.length; ++i) {
      const tt = v.textTracks[i];
      if (tt.mode === 'showing') {
        tt.mode = 'disabled';
        if (v.textTracks.addEventListener) {
          // If text track event listeners are supported
          // (they are on the most recent Chrome), add
          // a marker to remember the old track. Use a
          // listener to delete it if a different track
          // is selected.
          v.cbhtml5vsLastCaptionTrack = tt.label;

          function cleanup(e) {
            for (let i = 0; i < v.textTracks.length; ++i) {
              const ott = v.textTracks[i];
              if (ott.mode === 'showing') {
                delete v.cbhtml5vsLastCaptionTrack;
                v.textTracks.removeEventListener('change', cleanup);
                return;
              }
            }
          }
          v.textTracks.addEventListener('change', cleanup);
        }
        return;
      } else if (tt.mode !== 'hidden') {
        validTracks.push(tt);
      }
    }
    // If we got here, none of the tracks were selected.
    if (validTracks.length === 0) {
      return true; // Do not prevent default if no UI activated
    }
    // Find the best one and select it.
    validTracks.sort((a, b) => {
      if (v.cbhtml5vsLastCaptionTrack) {
        const lastLabel = v.cbhtml5vsLastCaptionTrack;

        if (a.label === lastLabel && b.label !== lastLabel) {
          return -1;
        } else if (b.label === lastLabel && a.label !== lastLabel) {
          return 1;
        }
      }

      const aLang = a.language.toLowerCase();
      const bLang = b.language.toLowerCase();
      const navLang = navigator.language.toLowerCase();

      if (aLang === navLang && bLang !== navLang) {
        return -1;
      } else if (bLang === navLang && aLang !== navLang) {
        return 1;
      }

      const aPre = aLang.split('-')[0];
      const bPre = bLang.split('-')[0];
      const navPre = navLang.split('-')[0];

      if (aPre === navPre && bPre !== navPre) {
        return -1;
      } else if (bPre === navPre && aPre !== navPre) {
        return 1;
      }

      return 0;
    })[0].mode = 'showing';
  },

  togglePlay: v => {
    v.paused ? v.play() : v.pause();
  },

  toStart: v => {
    v.currentTime = 0;
  },

  toEnd: v => {
    v.currentTime = v.duration;
  },

  skipLeft: (v, key, shift, ctrl) => {
    if (shift) {
      v.currentTime -= settings.skipShift;
    } else if (ctrl) {
      v.currentTime -= settings.skipCtrl;
    } else {
      v.currentTime -= settings.skipNormal;
    }
  },

  skipRight: (v, key, shift, ctrl) => {
    if (shift) {
      v.currentTime += settings.skipShift;
    } else if (ctrl) {
      v.currentTime += settings.skipCtrl;
    } else {
      v.currentTime += settings.skipNormal;
    }
  },

  increaseVol: v => {
    if (audioError) return;
    if (v.nextSibling.querySelector('volume.disabled')) {
      v.volume = 0;
      return;
    }
    const increase = (v.volume + 0.1).toFixed(1);
    if (v.muted) {
      v.muted = !v.muted;
      v.volume = 0.1;
    } else {
      v.volume <= 0.9 ? v.volume = increase : v.volume = 1;
    }
  },

  decreaseVol: v => {
    if (audioError) return;
    if (v.nextSibling.querySelector('volume.disabled')) {
      v.volume = 0;
      return;
    }
    const decrease = (v.volume - 0.1).toFixed(1);
    v.volume >= 0.1 ? v.volume = decrease : v.volume = 0;
  },

  toggleMute: v => {
    v.muted = !v.muted;
    if (audioSync) imagusAudio.muted = v.muted;
  },

  toggleFS: v => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      v.parentElement.classList.remove('native-fullscreen');
    } else {
      v.parentElement.classList.add('native-fullscreen');
      v.parentElement.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  },

  reloadVideo: v => {
    const currTime = v.currentTime;
    v.load();
    v.currentTime = currTime;
  },

  slowOrPrevFrame: (v, key, shift) => {
    if (shift) { // Less-Than
      v.currentTime -= 1 / 60;
    } else { // Comma
      if (v.playbackRate >= 0.1) {
        const decrease = (v.playbackRate - 0.1).toFixed(2);
        const rate = v.nextSibling.querySelector('rate');
        v.playbackRate = decrease;
        rate.textContent = `${v.playbackRate}x`;
        if (v.playbackRate !== 1) {
          rate.setAttribute('data-current-rate', `${v.playbackRate}x`);
        }
        if (v.playbackRate === 0.9) {
          v.classList.add('playback-rate-decreased');
        } else if (v.playbackRate === 1.1) {
          v.classList.add('playback-rate-increased');
        } else if (v.playbackRate === 1) {
          v.classList.remove('playback-rate-decreased');
          v.classList.remove('playback-rate-increased');
          rate.removeAttribute('data-current-rate');
        }
      } else {
        v.playbackRate = 0;
      }
      if (audioSync) imagusAudio.playbackRate = v.playbackRate;
    }
  },

  fastOrNextFrame: (v, key, shift) => {
    if (shift) { // Greater-Than
      v.currentTime += 1 / 60;
    } else { // Period
      if (v.playbackRate <= 15.9) {
        const increase = (v.playbackRate += 0.1).toFixed(2);
        const rate = v.nextSibling.querySelector('rate');
        v.playbackRate = increase;
        rate.textContent = `${v.playbackRate}x`;
        if (v.playbackRate !== 1) {
          rate.setAttribute('data-current-rate', `${v.playbackRate}x`);
        }
        if (v.playbackRate === 0.9) {
          v.classList.add('playback-rate-decreased');
        } else if (v.playbackRate === 1.1) {
          v.classList.add('playback-rate-increased');
        } else if (v.playbackRate === 1) {
          v.classList.remove('playback-rate-decreased');
          v.classList.remove('playback-rate-increased');
          rate.removeAttribute('data-current-rate');
        }
      } else {
        v.playbackRate = 16;
      }
      if (audioSync) imagusAudio.playbackRate = v.playbackRate;
    }
  },

  normalSpeed: v => { // ?
    v.playbackRate = v.defaultPlaybackRate;
    if (audioSync) imagusAudio.playbackRate = v.playbackRate;
    v.classList.remove('playback-rate-decreased');
    v.classList.remove('playback-rate-increased');
    v.nextSibling.querySelector('rate').textContent = '1x';
    v.nextSibling.querySelector('rate').removeAttribute('data-current-rate');
  },

  toPercentage: (v, key) => {
    v.currentTime = (v.duration * (key - 48)) / 10.0;
  },
};

const keyFuncs = {
  32: shortcutFuncs.togglePlay, // Space
  75: shortcutFuncs.togglePlay, // K
  35: shortcutFuncs.toEnd, // End
  48: shortcutFuncs.toStart, // 0
  36: shortcutFuncs.toStart, // Home
  37: shortcutFuncs.skipLeft, // Left arrow
  74: shortcutFuncs.skipLeft, // J
  39: shortcutFuncs.skipRight, // Right arrow
  76: shortcutFuncs.skipRight, // L
  38: shortcutFuncs.increaseVol, // Up arrow
  40: shortcutFuncs.decreaseVol, // Down arrow
  77: shortcutFuncs.toggleMute, // M
  70: shortcutFuncs.toggleFS, // F
  67: shortcutFuncs.toggleCaptions, // C
  82: shortcutFuncs.reloadVideo, // R
  188: shortcutFuncs.slowOrPrevFrame, // Comma or Less-Than
  190: shortcutFuncs.fastOrNextFrame, // Period or Greater-Than
  191: shortcutFuncs.normalSpeed, // Forward slash or ?
  49: shortcutFuncs.toPercentage, // 1
  50: shortcutFuncs.toPercentage, // 2
  51: shortcutFuncs.toPercentage, // 3
  52: shortcutFuncs.toPercentage, // 4
  53: shortcutFuncs.toPercentage, // 5
  54: shortcutFuncs.toPercentage, // 6
  55: shortcutFuncs.toPercentage, // 7
  56: shortcutFuncs.toPercentage, // 8
  57: shortcutFuncs.toPercentage, // 9
};

function customPlayer(v) {
  let videoWrapper;
  let savedTimeKey;
  let mouseDown;
  let isPlaying;
  let isSeeking;
  let earlyXposPercent;
  let preventMouseMove;
  let controlsTimeout;
  let imagusMouseTimeout;
  let imagusVid;
  let muteTillSync;
  let loaded;
  let error;
  let elToFocus;
  let target;
  let clickCount = 0;
  let repeat = 0;
  const directVideo = /video/.test(document.contentType) &&
        document.body.firstElementChild === v;
  const controls = newEl('controls');
  const imagus = v.classList.contains('imagus');
  if (imagus && !imagusVid) {
    imagusVid = v;
    imagusAudio = newEl('video');
    imagusAudio.preload = 'auto';
    imagusAudio.autoplay = 'true';
    imagusAudio.className = 'imagus imagus-audio';
    imagusAudio.style = 'display: none!important;';
    imagusVid.parentElement.insertBefore(imagusAudio, imagusVid);
  }
  if (directVideo) {
    elToFocus = document.body;
    self === top ? document.body.classList.add('direct-video-top-level') :
    document.body.classList.add('direct-video-embed');
  } else {
    elToFocus = v;
    videoWrapper = newEl('videowrapper');
    v.parentNode.insertBefore(videoWrapper, v);
    videoWrapper.appendChild(v);
    if (!imagus) {
      const compStyles = getComputedStyle(v);
      const position = compStyles.getPropertyValue('position');
      const zIndex = compStyles.getPropertyValue('z-index');
      if (position === 'absolute') {
        videoWrapper.style.setProperty('--wrapper-position', `${position}`);
      }
      if (zIndex !== 'auto') {
        controls.style.setProperty('--controls-z-index', `calc(${zIndex} + 1)`);
      }
    }
  }
  v.parentNode.insertBefore(controls, v.nextSibling);
  const playButton = newEl('btn');
  playButton.className = 'toggle-play';
  controls.appendChild(playButton);
  const beginButton = newEl('btn');
  beginButton.className = 'begin';
  controls.appendChild(beginButton);
  const skipLongLeft = newEl('btn');
  skipLongLeft.className = 'skip-long left';
  controls.appendChild(skipLongLeft);
  const skipShortLeft = newEl('btn');
  skipShortLeft.className = 'skip-short left';
  controls.appendChild(skipShortLeft);
  const skipShortRight = newEl('btn');
  skipShortRight.className = 'skip-short right';
  controls.appendChild(skipShortRight);
  const skipLongRight = newEl('btn');
  skipLongRight.className = 'skip-long right';
  controls.appendChild(skipLongRight);
  const timelineWrapper = newEl('timelinewrapper');
  controls.appendChild(timelineWrapper);
  const currentTime = newEl('currenttime');
  currentTime.textContent = '0:00';
  timelineWrapper.appendChild(currentTime);
  const timeline = newEl('timeline');
  timelineWrapper.appendChild(timeline);
  const timeBar = newEl('timebar');
  timeline.appendChild(timeBar);
  const timeBuffer = newEl('timebuffer');
  timeBar.appendChild(timeBuffer);
  const timeProgress = newEl('timeprogress');
  timeBar.appendChild(timeProgress);
  const timeSlider = newEl('input');
  timeSlider.type = 'range';
  timeSlider.value = 0;
  timeSlider.min = 0;
  timeSlider.max = 100;
  timeSlider.step = 0.01;
  timeSlider.textContent = '';
  timeline.appendChild(timeSlider);
  const timeTooltip = newEl('timetooltip');
  timeTooltip.className = 'hidden';
  timeline.appendChild(timeTooltip);
  const preview = newEl('preview');
  timeTooltip.appendChild(preview);
  const timeText = newEl('timetext');
  timeTooltip.appendChild(timeText);
  timeText.textContent = '-:-';
  const totalTime = newEl('totaltime');
  totalTime.textContent = '-:-';
  timelineWrapper.appendChild(totalTime);
  const rateDecrease = newEl('btn');
  rateDecrease.className = 'rate-decrease';
  controls.appendChild(rateDecrease);
  const rate = newEl('rate');
  rate.textContent = '1x';
  controls.appendChild(rate);
  const rateIncrease = newEl('btn');
  rateIncrease.className = 'rate-increase';
  controls.appendChild(rateIncrease);
  const volume = newEl('volume');
  controls.appendChild(volume);
  const volumeBar = newEl('volumebar');
  volume.appendChild(volumeBar);
  const volumeTrail = newEl('volumetrail');
  volumeBar.appendChild(volumeTrail);
  const volumeSlider = newEl('input');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.textContent = '';
  volume.appendChild(volumeSlider);
  const volumeTooltip = newEl('volumetooltip');
  volumeTooltip.className = 'hidden';
  volumeTooltip.textContent = '0%';
  volume.appendChild(volumeTooltip);
  const muteButton = newEl('btn');
  muteButton.className = 'mute';
  controls.appendChild(muteButton);
  const expandButton = newEl('btn');
  expandButton.className = 'expand';
  controls.appendChild(expandButton);
  v.classList.remove('custom-native-player-hidden');
  if (v.querySelector('source')) v.classList.add('contains-source');
  if (videoWrapper) enforcePosition();
  volumeValues();

  v.onloadedmetadata = e => {
    loaded = true;
    shortcutFuncs.normalSpeed(v);
    savedTimeKey = `${location.pathname}${location.search}${v.duration}`;
    const savedTime = localStorage.getItem(savedTimeKey);
    if (timeSlider.value === '0') {
      if (savedTime) v.currentTime = savedTime;
    } else if (earlyXposPercent) {
      const time = (earlyXposPercent * v.duration) / 100;
      v.currentTime = time;
    }
    currentTime.textContent = formatTime(v.currentTime);
    totalTime.textContent = formatTime(v.duration);
    v.classList.remove('disabled');
    sliderValues(e);
  };

  v.onloadeddata = () => {
    const imagusVreddit = /v(cf)?\.redd\.it/.test(v.src);
    const vHasAudio = hasAudio(v);
    if (!vHasAudio && !imagusVreddit) {
      v.classList.add('muted');
      volumeSlider.value = 0;
      muteButton.classList.add('disabled');
      volume.classList.add('disabled');
    } else if (vHasAudio && !imagusVreddit) {
      if (v.volume && !v.muted) v.classList.remove('muted');
      volumeValues();
      if (volume.classList.contains('disabled')) {
        muteButton.classList.remove('disabled');
        volume.classList.remove('disabled');
      }
    }
    elToFocus.focus({preventScroll: true});
    if (v.duration <= settings.skipNormal) {
      skipShortLeft.classList.add('disabled');
      skipShortRight.classList.add('disabled');
    } else {
      skipShortLeft.classList.remove('disabled');
      skipShortRight.classList.remove('disabled');
    }
    if (v.duration <= settings.skipShift) {
      skipLongLeft.classList.add('disabled');
      skipLongRight.classList.add('disabled');
    } else {
      skipLongLeft.classList.remove('disabled');
      skipLongRight.classList.remove('disabled');
    }
    if (v.paused) {
      v.classList.add('paused');
      if (videoWrapper) videoWrapper.classList.add('paused');
    }
    if (imagus) v.currentTime = 0;
  };

  v.oncanplay = () => {
    v.oncanplay = null;
    if (!loaded) {
      v.load();
      console.log('Custom native player reloaded');
    }
  };

  v.onseeked = () => {
    styleBuffer();
    setTimeout(styleBuffer, 500);
  };

  v.onprogress = () => {
    styleBuffer();
    setTimeout(styleBuffer, 500);
  };

  v.ontimeupdate = e => {
    if (v.readyState > 0) {
      if (v.duration > 0 && !mouseDown) {
        sliderValues(e);
        totalTime.textContent = formatTime(v.duration);
        if (!imagus && savedTimeKey) localStorage.setItem(savedTimeKey, v.currentTime);
      }
    }
  };

  v.onvolumechange = e => {
    if (audioError) return;
    if (audioSync) imagusAudio.volume = v.volume;
    if (v.muted || !v.volume) {
      v.classList.add('muted');
      volumeSlider.value = 0;
      volumeTrail.style.width = '0';
      localStorage.setItem('videomuted', 'true');
    } else {
      v.classList.remove('muted');
      sliderValues(e);
      v.volume > 0.1 ? localStorage.setItem('videovolume', v.volume) :
      localStorage.setItem('videovolume', 0.1);
      localStorage.setItem('videomuted', 'false');
    }
  };

  v.onplay = () => {
    if (v === imagusVid && audioSync) imagusAudio.play();
    v.classList.remove('paused');
    if (videoWrapper) videoWrapper.classList.remove('paused');
    v.classList.add('playing');
  };

  v.onpause = () => {
    if (v === imagusVid && audioSync) imagusAudio.pause();
    if (!isSeeking) {
      v.classList.remove('playing');
      v.classList.add('paused');
      if (videoWrapper) videoWrapper.classList.add('paused');
    }
  };

  v.onended = () => {
    if (localStorage.getItem(savedTimeKey)) localStorage.removeItem(savedTimeKey);
    savedTimeKey = false;
  };

  v.onemptied = () => {
    if (v === imagusVid) {
      const vPP = v.parentNode.parentNode;
      if (imagusAudio.getAttribute('src') &&
          /v(cf)?\.redd\.it/.test(imagusAudio.src)) {
        audioSync = false;
        audioError = false;
        imagusAudio.pause();
        imagusAudio.removeAttribute('src');
        imagusAudio.load();
        imagusAudio.removeAttribute('loop');
      }
      if (v.src !== '') {
        if (/\.(mp3|m4a)/.test(v.src)) {
          vPP.classList.add('audio-only');
        }
        if (/v(cf)?\.redd\.it/.test(v.src)) {
          const prefix = v.src.split('DASH')[0].replace('vcf.', 'v.');
          const audioSrc = `${prefix}DASH_AUDIO_128.mp4`;
          GM.xmlHttpRequest({
            method: 'GET',
            url: audioSrc,
            onload: xhr => {
              imagusAudio.src = xhr.status >= 200 && xhr.status < 300 ? audioSrc : `${prefix}audio`;
            },
            onerror: () => {
              imagusAudio.src = `${prefix}audio`;
            },
          });
          if (!imagusAudio.muted) {
            muteTillSync = true;
            imagusAudio.muted = true;
          }
          if (imagusVid.hasAttribute('loop')) imagusAudio.setAttribute('loop', 'true');
        }
        vPP.classList.add('imagus-video-wrapper');
        window.addEventListener('click', imagusClick, true);
        document.addEventListener('keyup', imagusKeys, true);
        document.addEventListener('mousedown', imagusMouseDown, true);
        document.addEventListener('mouseup', imagusMouseUp, true);
      } else {
        audioSync = false;
        audioError = false;
        imagusAudio.pause();
        imagusAudio.removeAttribute('src');
        imagusAudio.load();
        imagusAudio.removeAttribute('loop');
        vPP.removeAttribute('class');
        timeTooltip.classList.add('hidden');
        window.removeEventListener('click', imagusClick, true);
        document.removeEventListener('keyup', imagusKeys, true);
        document.removeEventListener('mousedown', imagusMouseDown, true);
        document.removeEventListener('mouseup', imagusMouseUp, true);
      }
    }
  };

  v.onerror = () => {
    error = true;
    elToFocus.blur();
    v.classList.add('disabled');
  };

  v.onmousedown = e => {
    if (error && e.button !== 2) return;
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.button === 0) {
      clickCount++;
      const checkState = v.paused;
      if (clickCount === 1) {
        setTimeout(() => {
          if (clickCount === 1) {
            // avoid conflicts with existing click listeners
            const recheckState = v.paused;
            if (checkState === recheckState) shortcutFuncs.togglePlay(v);
          } else {
            shortcutFuncs.toggleFS(v);
          }
          clickCount = 0;
        }, settings.clickDelay);
      }
    } else if (e.button === 2) {
      window.addEventListener('contextmenu', preventHijack, true);
    }
  };

  v.onmouseup = e => {
    if (e.button === 2) {
      setTimeout(() => {
        window.removeEventListener('contextmenu', preventHijack, true);
      }, 100);
    }
    if (error) elToFocus.blur();
  };

  v.onmousemove = () => {
    controlsTimeout ? clearTimeout(controlsTimeout) :
    v.classList.add('active');
    if (videoWrapper) videoWrapper.classList.add('active');
    controlsTimeout = setTimeout(() => {
      controlsTimeout = false;
      v.classList.remove('active');
      if (videoWrapper) videoWrapper.classList.remove('active');
    }, settings.hideControls);
  };

  new ResizeObserver(compactControls).observe(v);

  controls.onmousedown = e => {
    if (e.button > 0) return;
    target = e.target;
  };

  controls.onmouseup = () => {
    if (error) return;
    elToFocus.focus({preventScroll: true});
    target = null;
  };

  timeSlider.onmousemove = e => sliderValues(e);

  timeSlider.oninput = e => sliderValues(e);

  timeSlider.onmousedown = e => {
    if (e.button > 0) return;
    mouseDown = true;
    isSeeking = true;
    if (timeTooltip.classList.contains('hidden')) sliderValues(e);
    if (v.readyState > 0) {
      if (!v.paused) {
        isPlaying = true;
        v.pause();
      } else {
        isPlaying = false;
      }
    }
  };

  timeSlider.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    mouseDown = false;
    isSeeking = false;
    if (v.readyState > 0) {
      sliderValues(e);
      if (isPlaying) {
        v.play();
        isPlaying = false;
      }
    }
  };

  volumeSlider.onmousemove = e => sliderValues(e);

  volumeSlider.oninput = e => {
    if (v.muted) shortcutFuncs.toggleMute(v);
    sliderValues(e);
  };

  muteButton.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    const lastVolume = localStorage.getItem('videovolume');
    if (v.muted || v.volume) shortcutFuncs.toggleMute(v);
    v.volume = lastVolume;
    if (audioSync) imagusAudio.muted = v.muted;
  };

  playButton.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.togglePlay(v);
  };

  skipShortLeft.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.skipLeft(v);
  };

  skipShortRight.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.skipRight(v);
  };

  skipLongLeft.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    v.currentTime -= settings.skipShift;
  };

  skipLongRight.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    v.currentTime += settings.skipShift;
  };

  beginButton.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    v.currentTime = 0;
    timeSlider.value = 0;
    timeProgress.style.width = '0';
    currentTime.textContent = '0:00';
  };

  rateDecrease.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.slowOrPrevFrame(v);
  };

  rateIncrease.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.fastOrNextFrame(v);
  };

  rate.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.normalSpeed(v);
  };

  rate.onmouseenter = () => {
    rate.textContent = '1x?';
  };

  rate.onmouseleave = () => {
    const currentRate = rate.getAttribute('data-current-rate');
    if (currentRate) rate.textContent = currentRate;
  };

  expandButton.onmouseup = e => {
    if (e.button > 0 || e.target !== target) return;
    shortcutFuncs.toggleFS(v);
  };

  // exiting fullscreen by escape key or other browser provided method
  document.onfullscreenchange = () => {
    if (!document.fullscreenElement) {
      const nativeFS = $('.native-fullscreen');
      if (nativeFS) nativeFS.classList.remove('native-fullscreen');
    }
  };

  if (imagusVid) {
    imagusAudio.onloadedmetadata = () => {
      audioSync = true;
      if (v.hasAttribute('autoplay')) imagusAudio.play();
    };

    imagusAudio.onloadeddata = () => {
      if (v.volume && !v.muted) v.classList.remove('muted');
      volumeValues(v);
      if (volume.classList.contains('disabled')) {
        muteButton.classList.remove('disabled');
        volume.classList.remove('disabled');
      }
    };

    imagusAudio.onended = () => {
      imagusAudio.currentTime = 0;
      if (imagusVid.hasAttribute('loop')) imagusAudio.play();
    };

    imagusAudio.onerror = () => {
      audioError = true;
      v.classList.add('muted');
      volumeSlider.value = 0;
      muteButton.classList.add('disabled');
      volume.classList.add('disabled');
    };
  }

  if (directVideo) {
    v.removeAttribute('tabindex');
    document.body.setAttribute('tabindex', '0');
    document.addEventListener('keydown', docHandleKeyDown, true);
    document.addEventListener('keypress', docHandleKeyOther, true);
    document.addEventListener('keyup', docHandleKeyOther, true);
  } else {
    v.addEventListener('keydown', handleKeyDown, false);
    v.addEventListener('keypress', handleKeyOther, false);
    v.addEventListener('keyup', handleKeyOther, false);
  }

  function sliderValues(e) {
    let slider;
    let xPosition;
    const vid = audioSync ? imagusAudio && v : v;
    const eType = e && e.type;
    const eTime = eType === 'timeupdate';
    const eVolume = eType === 'volumechange';
    const eMeta = eType === 'loadedmetadata';
    const eData = eType === 'loadeddata';
    const eInput = eType === 'input';
    const eMouseUp = eType === 'mouseup';
    const eMouseMove = eType === 'mousemove';
    const eMouseDown = eType === 'mousedown';
    if (eMeta || eTime || eVolume || eData || !e) {
      slider = eMeta || eTime ? timeSlider : volumeSlider;
    } else {
      slider = e.target;
    }
    const tooltip = slider.nextSibling;
    const timeTarget = slider === timeSlider;
    const sliderWidth = slider.clientWidth;
    const halfSlider = sliderWidth / 2;
    const slider14ths = halfSlider / 7;
    const eX = e && e.offsetX;
    const start7 = eX <= 7;
    const end7 = eX >= sliderWidth - 7;
    if (eMouseMove || eMouseDown) {
      if (start7 || end7) {
        xPosition = start7 ? 0 : sliderWidth;
      } else {
        xPosition = eX < halfSlider ? (eX + (-7 + (eX / slider14ths))).toFixed(1) :
        (eX + ((eX - halfSlider) / slider14ths)).toFixed(1);
      }
    }
    if (eMeta || eTime || eVolume || eData || !e) {
      xPosition = eMeta || eTime ?
        ((((100 / v.duration) * v.currentTime) * sliderWidth) / 100).toFixed(1) :
      (v.volume * sliderWidth).toFixed(1);
    }
    if (eTime && e.target === imagusVid && audioSync) {
      if (imagusVid.currentTime - imagusAudio.currentTime >= 0.1 ||
          imagusVid.currentTime - imagusAudio.currentTime <= -0.1) {
        imagusAudio.currentTime = imagusVid.currentTime + 0.06;
        console.log('time sync corrected');
        if (muteTillSync && imagusAudio.readyState > 2) {
          imagusAudio.muted = false;
          muteTillSync = false;
          console.log('unmuted after time correct');
        }
      } else if (muteTillSync && imagusAudio.readyState > 2) {
        imagusAudio.muted = false;
        muteTillSync = false;
        console.log('unmuted');
      }
    }
    if (eInput || eMouseUp) xPosition = +tooltip.getAttribute('data-x-position');
    const xPosPercent = timeTarget ? (xPosition / sliderWidth) * 100 :
    Math.round((xPosition / sliderWidth) * 100);
    let time = (xPosPercent * v.duration) / 100;
    if (eInput || eMeta || eTime || eVolume || eData || !e) {
      const valueTrail = timeTarget ? timeProgress : volumeTrail;
      const offset = halfSlider < xPosition ? -7 + (xPosition / slider14ths) :
      (xPosition - halfSlider) / slider14ths;
      slider.value = timeTarget ? xPosPercent : xPosPercent / 100;
      valueTrail.style.width = `calc(${xPosPercent}% - ${offset}px)`;
      if (eInput && !timeTarget) {
        if (start7 || end7) {
          vid.volume = start7 ? 0 : 1;
        } else {
          vid.volume = xPosPercent / 100;
        }
      }
      if (eInput && timeTarget && v.readyState > 0) currentTime.textContent = formatTime(time);
      if (eTime) currentTime.textContent = formatTime(v.currentTime);
      if (eInput && timeTarget && v.readyState < 1) earlyXposPercent = xPosPercent;
      if (eMeta && !tooltip.classList.contains('hidden')) {
        xPosition = +tooltip.getAttribute('data-x-position');
        time = (xPosition / sliderWidth) * v.duration;
        timeText.textContent = formatTime(time);
      }
    } else if (eMouseUp) {
      if (audioSync) {
        if (start7 || end7) {
          imagusAudio.currentTime = start7 ? 0 : v.duration;
        } else {
          imagusAudio.currentTime = time;
        }
      }
      if (start7 || end7) {
        v.currentTime = start7 ? 0 : v.duration;
      } else {
        v.currentTime = time;
      }
      preventMouseMove = true;
      setTimeout(() => {
        preventMouseMove = false;
      }, 10);
    } else if (eMouseMove || eMouseDown) {
      if (!preventMouseMove || eMouseDown) {
        tooltip.dataset.xPosition = xPosition;
        tooltip.dataset.targetTime = time;
        tooltip.style.left = `${eX}px`;
        if (v.readyState > 0 && timeTarget) timeText.textContent = formatTime(time);
        if (!timeTarget) tooltip.textContent = `${xPosPercent}%`;
      }
      tooltip.classList.remove('hidden');
      preventMouseMove = false;
    }
  }

  function styleBuffer() {
    if (v.readyState > 1 && v.duration > 0) {
      const buffer = (v.buffered.end(v.buffered.length - 1) / v.duration) * 100;
      timeBuffer.style.width = `${buffer}%`;
    }
  }

  function formatTime(t) {
    if (isNaN(t)) {
      timeTooltip.classList.add('hidden');
      return '-:-';
    } else {
      let seconds = Math.round(t);
      const minutes = Math.floor(seconds / 60);
      if (minutes > 0) seconds -= minutes * 60;
      if (seconds.toString().length === 1) seconds = `0${seconds}`;
      return `${minutes}:${seconds}`;
    }
  }

  function volumeValues() {
    const videovolume = localStorage.getItem('videovolume');
    const videomuted = localStorage.getItem('videomuted');
    if ((!videovolume && !videomuted) ||
        (videovolume && videovolume === '1' &&
         videomuted && videomuted !== 'true')) {
      v.volume = 1;
      volumeSlider.value = 1;
      volumeTrail.style.width = '100%';
      localStorage.setItem('videovolume', v.volume);
      localStorage.setItem('videomuted', 'false');
    } else if (videomuted && videomuted === 'true') {
      v.classList.add('muted');
      volumeSlider.value = 0;
      volumeTrail.style.width = '0';
      v.muted = true;
    } else {
      v.volume = videovolume;
      if (audioSync) imagusAudio.volume = v.volume;
      sliderValues();
      if (!volumeSlider.clientWidth) {
        new MutationObserver((_, observer) => {
          const volumeWidthSet = v.parentElement.querySelector('volume input').clientWidth;
          if (volumeWidthSet) {
            sliderValues();
            observer.disconnect();
          }
        }).observe(v.parentElement, {childList: true, subtree: true, attributes: true});
      }
    }
  }

  function hasAudio() {
    return v.mozHasAudio ||
      Boolean(v.webkitAudioDecodedByteCount) ||
      Boolean(v.audioTracks && v.audioTracks.length);
  }

  function compactControls() {
    const width = v.clientWidth;
    if (!width) return;
    if (width < 892) {
      v.classList.add('compact');
      if (imagus) v.parentNode.parentNode.classList.add('compact');
    } else {
      v.classList.remove('compact');
      if (imagus) v.parentNode.parentNode.classList.remove('compact');
    }
    width < 412 ? v.classList.add('compact-2') : v.classList.remove('compact-2');
    width < 316 ? v.classList.add('compact-3') : v.classList.remove('compact-3');
    width < 246 ? v.classList.add('compact-4') : v.classList.remove('compact-4');
  }

  function imagusMouseDown(e) {
    const vid = $('.imagus-video-wrapper');
    if (vid && e.button === 2) {
      e.stopImmediatePropagation();
      imagusMouseTimeout = setTimeout(() => {
        imagusMouseTimeout = 'sticky';
      }, settings.imagusStickyDelay);
    }
  }

  function imagusMouseUp(e) {
    const vid = $('.imagus-video-wrapper');
    if (vid && e.button === 2) {
      if (imagusMouseTimeout === 'sticky') {
        vid.classList.add('stickied');
        setTimeout(() => {
          v.removeAttribute('controls');
        });
        if (volume.classList.contains('disabled')) volumeSlider.value = 0;
        document.removeEventListener('mousedown', imagusMouseDown, true);
        document.removeEventListener('mouseup', imagusMouseUp, true);
      } else {
        clearInterval(imagusMouseTimeout);
        imagusMouseTimeout = false;
      }
    }
  }

  function imagusClick(e) {
    const imagusStickied = $('.imagus-video-wrapper.stickied');
    if (imagusStickied) {
      if (e.target.closest('.imagus-video-wrapper.stickied')) {
        e.stopImmediatePropagation();
      } else {
        imagusStickied.removeAttribute('class');
        e.preventDefault();
      }
    }
  }

  function imagusKeys(e) {
    const vid = $('.imagus-video-wrapper');
    if (vid) {
      if (e.keyCode === 13 || e.keyCode === 90) {
        vid.classList.add('stickied');
        setTimeout(() => {
          v.removeAttribute('controls');
        });
        if (volume.classList.contains('disabled')) volumeSlider.value = 0;
        document.removeEventListener('keyup', imagusKeys, true);
        document.removeEventListener('mousedown', imagusMouseDown, true);
        document.removeEventListener('mouseup', imagusMouseUp, true);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.altKey || e.metaKey) return true; // Do not activate
    const func = keyFuncs[e.keyCode];
    if (func) {
      if ((func.length < 3 && e.shiftKey) ||
          (func.length < 4 && e.ctrlKey)) return true; // Do not activate
      func(e.target, e.keyCode, e.shiftKey, e.ctrlKey);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  function handleKeyOther(e) {
    if (e.altKey || e.metaKey) return true; // Do not prevent default
    const func = keyFuncs[e.keyCode];
    if (func) {
      if ((func.length < 3 && e.shiftKey) ||
          (func.length < 4 && e.ctrlKey)) return true; // Do not prevent default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  function docHandleKeyDown(e) {
    if (document.body !== document.activeElement ||
        e.altKey || e.metaKey) return true; // Do not activate
    const func = keyFuncs[e.keyCode];
    if (func) {
      if ((func.length < 3 && e.shiftKey) ||
          (func.length < 4 && e.ctrlKey)) return true; // Do not activate
      func(v, e.keyCode, e.shiftKey, e.ctrlKey);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function docHandleKeyOther(e) {
    if (document.body !== document.activeElement ||
        e.altKey || e.metaKey) return true; // Do not prevent default
    const func = keyFuncs[e.keyCode];
    if (func) {
      if ((func.length < 3 && e.shiftKey) ||
          (func.length < 4 && e.ctrlKey)) return true; // Do not prevent default
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  // circumvent any scripts attempting to hijack video context menus
  function preventHijack(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    const redirectEvent = e.target.ownerDocument.createEvent('MouseEvents');
    redirectEvent.initMouseEvent(e, e.bubbles, e.cancelable);
    return e;
  }

  function enforcePosition() {
    setTimeout(() => {
      let controlsDisplaced = controls !== v.nextSibling;
      const vidDisplaced = videoWrapper !== v.parentNode;
      if (vidDisplaced || controlsDisplaced) {
        if (vidDisplaced) videoWrapper.appendChild(v);
        controlsDisplaced = v !== controls.previousSibling;
        if (controlsDisplaced) videoWrapper.insertBefore(controls, v.nextSibling);
        const bs =
              videoWrapper.querySelectorAll('videowrapper > *:not(video):not(controls)');
        for (let i = 0; i < bs.length; ++i) {
          bs[i].remove();
        }
      }
      repeat++;
      if (repeat < 10) enforcePosition.call(this);
    }, 100);
  }
}

function ytSaveCurrentTime(v) {
  v.addEventListener('loadstart', ytCheckSavedTime);
  v.addEventListener('loadeddata', ytCheckSavedTime);

  v.ontimeupdate = () => {
    if (v.currentTime > 0 && ytTimeChecked) localStorage.setItem(ytID, v.currentTime);
  };

  v.onended = () => {
    if (localStorage.getItem(ytID)) localStorage.removeItem(ytID);
  };
}

function ytCheckSavedTime(e) {
  ytID = location.href.replace(/.*?\/(watch\?v=|embed\/)(.*?)(\?|&|$).*/, '$2');
  const savedTime = localStorage.getItem(ytID);
  const timeURL = /(\?|&)(t(ime_continue)?|start)=[1-9]/.test(location.href);
  const ytStart = $('.ytp-clip-start:not([style*="left: 0%;"])');
  if (e.type === 'loadstart') {
    ytTimeChecked = false;
    if ((!ytStart || !savedTime) && !timeURL) ytTimeChecked = true;
    if (ytStart) ytStart.click();
    if (ytTimeChecked && savedTime) e.target.currentTime = savedTime;
    e.target.focus({preventScroll: true});
    if (self === top) window.scroll({top: 0, behavior: 'smooth'});
  } else if (e.type === 'loadeddata' && !ytTimeChecked) {
    if (savedTime) e.target.currentTime = savedTime;
    ytTimeChecked = true;
  }
}

function moveStyle() {
  const style = $('#custom-native-player-style');
  if (!style) return;
  const docEls = $$('html > *');
  for (let i = 0; i < docEls.length; i++) {
    if (docEls[i].tagName === 'STYLE' &&
        docEls[i].classList.contains('stylus') &&
        docEls[i].id !== 'custom-native-player-style') {
      $('html').insertBefore(style, docEls[i]);
      break;
    } else if (docEls[i] === docEls[docEls.length - 1]) {
      $('html').insertBefore(style, docEls[i].nextSibling);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const style = $('#custom-native-player-style');
  !style ? injectStyle() : moveStyle();
  setTimeout(moveStyle, 1000);

  document.arrive(
    'video[controls], video[style*="visibility: inherit !important"]',
    {fireOnAttributesModification: true, existing: true}, v => {
      if (!v.parentNode.parentNode) return;
      const vP = v.parentNode;
      const vPP = v.parentNode.parentNode;
      const imagus = !v.hasAttribute('controls') &&
            $('html > div[style*="z-index: 2147483647"]') === v.parentNode;
      const vidOrParentsIdOrClass =
            `${v.id}${v.classList}${vP.id}${vP.classList}${vPP.id}${vPP.classList}`;
      const exclude = v.classList.contains('custom-native-player') ||
            v.classList.contains('imagus') ||
            /(v(ideo)?|me)(-|_)?js|jw|jplay|plyr|kalt|flowp|wisti/i.test(vidOrParentsIdOrClass);
      if (imagus || (v.hasAttribute('controls') && !exclude)) {
        if (imagus) v.classList.add('imagus');
        v.classList.add('custom-native-player');
        v.classList.add('custom-native-player-hidden');
        v.setAttribute('tabindex', '0');
        v.setAttribute('preload', 'auto');
        v.removeAttribute('controls');
        customPlayer(v);
      }
    });
});

if (/^https?:\/\/www\.youtube\.com/.test(location.href)) {
  document.arrive(
    '#player video[src*="youtube.com"]',
    {fireOnAttributesModification: true, existing: true}, v => {
      ytSaveCurrentTime(v);
    });
}

const css = `.imagus-video-wrapper {
  height: min-content!important;
  position: fixed!important;
  left: 0!important;
  right: 0!important;
  top: 0!important;
  bottom: 0!important;
  margin: auto!important;
  box-shadow: none!important;
  background-color: hsl(0, 0%, 0%)!important;
  width: calc(100% - 100px)!important;
}
.imagus-video-wrapper.stickied {
  box-shadow: 0 0 0 100000px hsla(0, 0%, 0%, .7)!important;
}
html > div[style*="2147483647"] div span {
  cursor: auto!important;
}
.imagus-video-wrapper videowrapper {
  height: 0!important;
  padding-top: 56.25%!important;
}
.imagus-video-wrapper videowrapper video.custom-native-player {
  position: absolute!important;
}
@media (min-width: 177.778vh) {
  .imagus-video-wrapper {
    margin: 18px auto!important;
    height: calc(100vh - 18px)!important;
    width: calc(((100vh - 18px) * 16) / 9)!important;
  }
  .imagus-video-wrapper videowrapper {
    height: 100%!important;
    padding-top: 0!important;
  }
  .imagus-video-wrapper videowrapper video.custom-native-player {
    position: relative!important;
  }
}
html > div[style*="2147483647"] > img[style*="display: block"] ~ videowrapper {
  display: none!important;
}
html > div[style*="2147483647"] {
  background: none!important;
  box-shadow: none!important;
  border: 0!important;
}
html > div[style*="2147483647"] videowrapper + div {
  -webkit-text-fill-color: hsl(0, 0%, 90%)!important;
  box-shadow: none!important;
  width: 100%!important;
  max-width: 100%!important;
  box-sizing: border-box!important;
  overflow: hidden!important;
  text-overflow: ellipsis!important;
}
html > div:not(.stickied) video.custom-native-player + controls,
video[controls]:not(.custom-native-player) {
  opacity: 0!important;
  pointer-events: none!important;
}
videowrapper {
  --wrapper-position: relative;
  position: var(--wrapper-position)!important;
  height: 100%!important;
  display: block!important;
  font-size: 0px!important;
  top: 0!important;
  bottom: 0!important;
  left: 0!important;
  right: 0!important;
  background-color: hsl(0, 0%, 0%)!important;
  overflow: hidden!important;
}
video.custom-native-player + controls timetooltip,
video.custom-native-player + controls volumetooltip {
  position: absolute!important;
  display: none!important;
  top: -25px!important;
  height: 22px!important;
  line-height: 22px!important;
  text-align: center!important;
  border-radius: 4px!important;
  font-size: 12px!important;
  background: hsla(0, 0%, 0%, .7)!important;
  box-shadow: 0 0 4px hsla(0, 0%, 100%, .5)!important;
  color: hsl(0, 0%, 100%)!important;
  pointer-events: none!important;
}
video.custom-native-player + controls timetooltip timetext {
  color: hsl(0, 0%, 100%)!important;
}
video.custom-native-player + controls timetooltip.preview preview {
  height: 113px!important;
  width: 200px!important;
  display: block!important;
}
video.custom-native-player + controls timetooltip.preview {
  height: 138px!important;
  width: 200px!important;
  top: -142px!important;
  margin-left: -100px!important;
}
video.custom-native-player + controls timetooltip {
  margin-left: -25px!important;
  width: 50px!important;
}
video.custom-native-player + controls volumetooltip {
  margin-left: -20px!important;
  width: 40px!important;
}
video.custom-native-player.compact + controls timeline timetooltip {
  top: -25px!important;
}
video.custom-native-player.compact + controls btn,
video.custom-native-player.compact + controls rate,
video.custom-native-player.compact + controls volume {
  height: 24px!important;
  line-height: 22px!important;
}
video.custom-native-player.compact + controls volume input {
  padding-bottom: 2px!important;
}
video.custom-native-player.compact + controls btn:before {
  margin-top: -2px!important;
}
video.custom-native-player.compact + controls volume > volumebar {
  top: 6px!important;
}
video.custom-native-player + controls timelinewrapper {
  height: 100%!important;
  line-height: 20px!important;
}
video.custom-native-player + controls timeline:hover timetooltip:not(.hidden),
video.custom-native-player + controls volume:hover volumetooltip:not(.hidden) {
  display: inline!important;
}
video.custom-native-player {
  user-select: none!important;
  cursor: none!important;
  max-height: 100%!important;
  height: 100%!important;
  width: 100%!important;
  margin: 0!important;
  padding: 0!important;
  top: 0!important;
  bottom: 0!important;
  left: 0!important;
  right: 0!important;
  background-color: hsl(0, 0%, 0%)!important;
  border-radius: 0!important;
}
video.custom-native-player:not(.contains-source):not([src*="/"]) {
  cursor: auto!important;
}
video.custom-native-player:not(.contains-source):not([src*="/"]) + controls {
  display: none!important;
}
video.custom-native-player + controls > * {
  background: none!important;
  outline: none!important;
  line-height: 32px!important;
  font-family: monospace!important;
}
video.custom-native-player.compact + controls > * {
  line-height: 24px!important;
}
video.custom-native-player + controls {
  --controls-z-index: 1;
  white-space: nowrap!important;
  transition: opacity .5s ease 0s!important;
  background-color: hsla(0, 0%, 0%, .85)!important;
  height: 32px !important;
  width: 100%!important;
  cursor: default !important;
  font-size: 18px !important;
  user-select: none!important;
  z-index: var(--controls-z-index)!important;
  flex: none!important;
  position: absolute!important;
  display: flex!important;
  flex-wrap: wrap!important;
  opacity: 0!important;
  margin: 0!important;
  bottom: 0!important;
  left: 0!important;
  right: 0!important;
}
video.custom-native-player.custom-native-player-hidden,
video.custom-native-player.custom-native-player-hidden + controls {
  opacity: 0!important;
  pointer-events: none!important;
}
video.custom-native-player.paused + controls,
video.custom-native-player.active + controls,
video.custom-native-player + controls:hover {
  opacity: 1!important;
}
video.custom-native-player + controls timeline {
  flex-grow: 1!important;
  position: relative!important;
  align-items: center!important;
  flex-direction: column!important;
  height: 100%!important;
}
video.custom-native-player + controls timelinewrapper {
  flex: 1 0 480px!important;
  position: relative!important;
  align-items: center!important;
}
video.custom-native-player.compact + controls timelinewrapper {
  order: -1;
  flex-basis: 100%!important;
  height: 20px!important;
}
video.custom-native-player.compact + controls timeline timebar {
  top: 5px!important;
}
video.custom-native-player.compact + controls currenttime,
video.custom-native-player.compact + controls totaltime {
  line-height: 20px!important;
}
video.custom-native-player.compact + controls {
  height: 44px!important;
}
video.custom-native-player.compact-2 + controls btn.begin,
video.custom-native-player.compact-2 + controls btn.skip-short,
video.custom-native-player.compact-3 + controls rate,
video.custom-native-player.compact-3 + controls btn.rate-increase,
video.custom-native-player.compact-3 + controls btn.rate-decrease,
video.custom-native-player.compact-4 + controls btn.skip-long {
  display: none!important;
}
video.custom-native-player + controls > * {
  display: inline-flex!important;
}
video.custom-native-player.compact-2 + controls btn.rate-increase,
video.custom-native-player.compact-4 + controls btn.toggle-play {
  margin-right: auto!important;
}
video.custom-native-player + controls timeline > timebar > timebuffer,
video.custom-native-player + controls timeline > timebar > timeprogress,
video.custom-native-player + controls volume > volumebar > volumetrail {
  position: absolute!important;
  flex: none!important;
  pointer-events: none!important;
  height: 100%!important;
  border-radius: 20px!important;
}
video.custom-native-player + controls timeline > timebar,
video.custom-native-player + controls volume > volumebar {
  position: absolute!important;
  height: 10px!important;
  border-radius: 20px!important;
  overflow: hidden!important;
  background-color: hsla(0, 0%, 16%, .85)!important;
  top: 11px!important;
  left: 0!important;
  right: 0!important;
  pointer-events: none!important;
  z-index: -1!important;
  box-shadow: inset 0 0 0 1px hsla(0, 0%, 40%), inset 0 0 5px hsla(0, 0%, 40%, .85)!important;
}
.audio-only.imagus-video-wrapper {
  height: 58px!important;
  padding: 0!important;
}
.audio-only.imagus-video-wrapper.compact {
  height: 78px!important;
}
.audio-only.imagus-video-wrapper video.custom-native-player + controls {
  opacity: 1!important;
}
.audio-only.imagus-video-wrapper video.custom-native-player {
  height: 0!important;
  opacity: 0!important;
  min-height: 0!important;
}
.audio-only.imagus-video-wrapper.stickied {
  box-shadow: none!important;
}
.audio-only.imagus-video-wrapper videowrapper {
  height: 58px!important;
  top: auto!important;
  padding:0!important;
}
.audio-only.imagus-video-wrapper.compact {
  top: 18px!important;
  bottom: auto!important;
}
.audio-only.imagus-video-wrapper.compact videowrapper {
  height: 78px!important;
}
video.custom-native-player + controls volume.disabled,
video.custom-native-player + controls btn.disabled {
  -webkit-filter: brightness(.4);
  filter: brightness(.4);
  pointer-events: none!important;
}
video.custom-native-player.disabled,
video.custom-native-player.active.disabled {
  cursor: default!important;
}
video.custom-native-player.disabled + controls {
  opacity: 1!important;
  -webkit-filter: brightness(.3)sepia(1)hue-rotate(320deg)saturate(5);
  filter: brightness(.3)sepia(1)hue-rotate(320deg)saturate(5);
}
video.custom-native-player.disabled + controls > * {
  pointer-events: none!important;
}
video.custom-native-player + controls volume {
  max-width: 70px!important;
  flex: 1 0 48px!important;
  position: relative!important;
  margin: 0 12px!important;
  height: 100%!important;
}
video.custom-native-player + controls timeline > timebar > timebuffer {
  background-color: hsla(0, 0%, 100%, .2)!important;
  border-top-right-radius: 20px!important;
  border-bottom-right-radius: 20px!important;
  left: 0!important;
}
video.custom-native-player + controls timeline > timebar > timeprogress,
video.custom-native-player + controls volume > volumebar > volumetrail {
  background-color: hsla(0, 0%, 100%, .4)!important;
  left: 0!important;
}
video.custom-native-player + controls volume.disabled volumetrail {
  width: 0!important;
}
video.custom-native-player + controls timeline > input {
  height: 100%!important;
  width: 100%!important;
}
video.custom-native-player.active {
  cursor: pointer!important;
}
video.custom-native-player + controls btn {
  border: none !important;
  cursor: pointer!important;
  background-color: transparent!important;
  font-family: "Segoe UI Symbol"!important;
  font-size: 0!important;
  margin: 0!important;
  align-items: center!important;
  justify-content: center!important;
  height: 32px!important;
  padding: 0!important;
  flex: 1 1 32px!important;
  max-width: 46px!important;
  box-sizing: content-box!important;
  position: relative!important;
  opacity: .86!important;
  text-shadow: none!important;
  transition: opacity .3s, text-shadow .3s!important;
  -webkit-text-fill-color: hsl(0, 0%, 100%)!important;
}
video.custom-native-player + controls btn.toggle-play {
  flex: 1 1 46px!important
}
video.custom-native-player + controls btn:hover {
  opacity: 1!important;
  text-shadow: 0 0 8px hsla(0, 0%, 100%)!important;
}
video.custom-native-player.playback-rate-increased + controls btn.rate-increase,
video.custom-native-player.playback-rate-decreased + controls btn.rate-decrease {
  -webkit-text-fill-color: cyan!important;
}
video.custom-native-player + controls rate {
  height: 32px!important;
  width: 42px!important;
  margin: 0!important;
  display: unset!important;
  text-align: center!important;
  font-size: 14px!important;
  flex-shrink: 0!important;
  font-weight: bold!important;
  letter-spacing: .5px!important;
  -webkit-text-fill-color: hsl(0, 0%, 100%)!important;
  user-select: none!important;
  pointer-events: none!important;
  opacity: .86!important;
}
video.custom-native-player + controls rate[data-current-rate] {
  pointer-events: all!important;
  cursor: pointer!important;
}
video.custom-native-player + controls rate[data-current-rate]:hover {
  transition: opacity .3s, text-shadow .3s!important;
  opacity: 1!important;
  text-shadow: 0 0 8px hsla(0, 0%, 100%)!important;
}
video.custom-native-player + controls input[type=range] {
  -webkit-appearance: none!important;
  background-color: transparent !important;
  outline: none!important;
  border: 0!important;
  border-radius: 6px !important;
  margin: 0!important;
  top: 0!important;
  bottom: 0!important;
  left: 0!important;
  right: 0!important;
  padding: 0!important;
  height: 100%!important;
  width: 100%!important;
  position: relative!important;
}
video.custom-native-player + controls input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none!important;
  background-color: hsl(0, 0%, 86%)!important;
  border: 0!important;
  height: 14px!important;
  width: 14px!important;
  border-radius: 50%!important;
  pointer-events: none!important;
}
video.custom-native-player.muted + controls volume input[type='range']::-webkit-slider-thumb {
  background-color: hsl(0, 0%, 50%)!important;
}
video.custom-native-player + controls input[type='range']::-moz-range-thumb {
  -moz-appearance: none!important;
  background-color: hsl(0, 0%, 86%)!important;
  border: 0!important;
  height: 14px!important;
  width: 14px!important;
  border-radius: 50%!important;
  pointer-events: none!important;
}
video.custom-native-player.muted + controls volume input[type='range']::-moz-range-thumb {
  background-color: hsl(0, 0%, 50%)!important;
}
video.custom-native-player + controls currenttime,
video.custom-native-player + controls totaltime {
  font-family: monospace, arial!important;
  font-weight: bold!important;
  font-size: 14px!important;
  letter-spacing: .5px!important;
  height: 100%!important;
  line-height: 32px!important;
  min-width: 58px!important;
  display: unset!important;
  -webkit-text-fill-color: hsl(0, 0%, 86%)!important;
}
video.custom-native-player + controls btn.rate-decrease,
video.custom-native-player + controls btn.rate-increase {
  padding: 0!important;
  flex: 1 0 14px!important;
  max-width: 24px!important;
}
video.custom-native-player + controls btn.rate-decrease {
  margin-left: auto!important;
}
video.custom-native-player + controls currenttime {
  padding: 0 12px 0 0!important;
  margin-right: 2px!important;
  text-align: right!important;
}
video.custom-native-player + controls totaltime {
  padding: 0 0 0 12px!important;
  margin-left: 2px!important;
  text-align: left!important;
}
.direct-video-top-level {
  margin: 0!important;
  padding: 0!important;
  display: flex!important;
  align-items: center!important;
  justify-content: center!important;
}
.direct-video-top-level video {
  height: calc(((100vw - 30px) * 9) / 16)!important;
  min-height: calc(((100vw - 30px) * 9) / 16)!important;
  max-height: calc(((100vw - 30px) * 9) / 16)!important;
  width: calc(100vw - 30px)!important;
  min-width: calc(100vw - 30px)!important;
  max-width: calc(100vw - 30px)!important;
  margin: auto!important;
}
.direct-video-top-level > video.custom-native-player + controls {
  position: absolute!important;
  left: 0!important;
  right: 0!important;
  margin: 0 auto !important;
  width: calc(100vw - 30px)!important;
  bottom: calc((100vh - (((100vw - 30px) * 9) / 16)) / 2)!important;
}
@media (min-width: 177.778vh) {
  .direct-video-top-level video {
    position: unset!important;
    height: calc(100vh - 30px)!important;
    min-height: calc(100vh - 30px)!important;
    max-height: calc(100vh - 30px)!important;
    width: calc(((100vh - 30px) * 16) / 9)!important;
    min-width: calc(((100vh - 30px) * 16) / 9)!important;
    max-width: calc(((100vh - 30px) * 16) / 9)!important;
    margin: 8px auto 0!important;
    padding: 0!important;
    background-color: hsl(0, 0%, 0%)!important;
  }
  .direct-video-top-level > video.custom-native-player + controls {
    width: calc(((100vh - 30px) * 16) / 9)!important;
    min-width: calc(((100vh - 30px) * 16) / 9)!important;
    max-width: calc(((100vh - 30px) * 16) / 9)!important;
    bottom: 15px!important;
  }
}
video::-webkit-media-controls,
.native-fullscreen > *:not(video):not(controls) {
  display: none!important;
}
.native-fullscreen video.custom-native-player,
.direct-video-top-level .native-fullscreen video.custom-native-player {
  height: 100vh!important;
  width: 100vw!important;
  max-height: 100vh!important;
  max-width: 100vw!important;
  min-height: 100vh!important;
  min-width: 100vw!important;
  margin: 0!important;
}
.native-fullscreen video.custom-native-player + controls {
  position: fixed!important;
  bottom: 0!important;
  left: 0!important;
  right: 0!important;
  margin: 0!important;
  width: 100vw!important;
  max-width: 100vw!important;
}
video.custom-native-player + controls btn:before {
  font-family: 'customNativePlayer'!important;
  font-weight: 400!important;
  -webkit-font-smoothing: subpixel-antialiased!important;
  -moz-osx-font-smoothing: subpixel-antialiased!important;
  font-size: 20px!important;
}
video.custom-native-player + controls btn.skip-short.right:before {
  content: '\\e90c'!important;
}
video.custom-native-player + controls btn.skip-short.left:before {
  content: '\\e90b'!important;
}
video.custom-native-player + controls btn.skip-long.right:before {
  content: '\\e901'!important;
}
video.custom-native-player + controls btn.skip-long.left:before {
  content: '\\e902'!important;
}
video.custom-native-player + controls btn.begin:before {
  content: '\\e908'!important;
}
video.custom-native-player + controls btn.toggle-play:before {
  content: '\\e906'!important;
  font-size: 26px!important;
}
video.custom-native-player.playing + controls btn.toggle-play:before {
  content: '\\e905'!important;
  font-size: 24px!important;
}
video.custom-native-player + controls btn.rate-decrease:before {
  content: '\\ea0b'!important;
  font-size: 10px!important;
}
video.custom-native-player + controls btn.rate-increase:before {
  content: '\\ea0a'!important;
  font-size: 10px!important;
}
video.custom-native-player + controls btn.mute:before {
  content: '\\e90a'!important;
  font-size: 22px!important;
}
video.custom-native-player.muted + controls btn.mute:before {
  content: '\\e909'!important;
  font-size: 22px!important;
}
video.custom-native-player + controls btn.mute.disabled:before {
  content: '\\e909'!important;
}
video.custom-native-player + controls btn.expand:before {
  content: '\\e904'!important;
  font-size: 24px!important;
}
.native-fullscreen video.custom-native-player + controls btn.expand:before {
  content: '\\e903'!important;
  font-size: 24px!important;
}
@font-face {
  font-family: 'customNativePlayer';
  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff'), url('customNativePlayer.ttf') format('truetype'), url('customNativePlayer.svg#customNativePlayer') format('svg');
  font-weight: normal;
  font-style: normal;
}`;

function injectStyle() {
  const style = newEl('style');
  style.id = 'custom-native-player-style';
  style.type = 'text/css';
  style.className = 'stylus'; // Dark Reader won't brute force override stylus
  style.textContent = css;
  document.documentElement.appendChild(style);
}

injectStyle();
