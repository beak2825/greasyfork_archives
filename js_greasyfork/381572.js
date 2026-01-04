// ==UserScript==
// @name        JoyRemocon
// @namespace   https://github.com/segabito/
// @description Nintendo SwitchのJoy-Conを動画プレイヤーのリモコンにする.
// @include     *://*.nicovideo.jp/watch/*
// @include     *://www.youtube.com/*
// @include     *://www.bilibili.com/video/*
// @include     *://www.amazon.co.jp/gp/video/*
// @version     1.6.0
// @author      segabito macmoto
// @license     public domain
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/381572/JoyRemocon.user.js
// @updateURL https://update.greasyfork.org/scripts/381572/JoyRemocon.meta.js
// ==/UserScript==




(() => {

  const monkey = () => {
    if (!window.navigator.getGamepads) {
      window.console.log('%cGamepad APIがサポートされていません', 'background: red; color: yellow;');
      return;
    }

    const PRODUCT = 'JoyRemocon';
    let isPauseButtonDown = false;
    let isRate1ButtonDown = false;
    let isMetaButtonDown = false;

    const getVideo = () => {
      switch (location.host) {
        case 'www.nicovideo.jp':
          return document.querySelector('.MainVideoPlayer video');
        case 'www.amazon.co.jp':
          return document.querySelector('video[width="100%"]');
        default:
          return Array.from(document.querySelectorAll('video')).find(v => {
            return !!v.src;
          });
      }
    };

    const video = {
      get currentTime() {
        try {
          return window.__videoPlayer ?
            __videoplayer.currentTime() : getVideo().currentTime;
        } catch (e) {
          console.warn(e);
          return 0;
        }
      },
      set currentTime(v) {
        try {
          if (v <= video.currentTime && location.host === 'www.nicovideo.jp') {
            return seekNico(v);
          } else if (location.host === 'www.amazon.co.jp') {
            return seekPrimeVideo(v);
          }
          getVideo().currentTime = v;
        } catch (e) {
          console.warn(e);
        }
      },

      get muted() {
        try {
          return getVideo().muted;
        } catch (e) {
          console.warn(e);
          return false;
        }
      },

      set muted(v) {
        try {
          getVideo().muted = v;
        } catch (e) {
          console.warn(e);
        }
      },

      get playbackRate() {
        try {
          return window.__videoPlayer ?
            __videoplayer.playbackRate() : getVideo().playbackRate;
        } catch (e) {
          console.warn(e);
          return 1;
        }
      },
      set playbackRate(v) {
        try {
          if (window.__videoPlayer) {
            window.__videoPlayer.playbackRate(v);
            return;
          }
          getVideo().playbackRate = Math.max(0.01, v);
        } catch (e) {
          console.warn(e);
        }
      },

      get volume() {
        try {
          if (location.host === 'www.nicovideo.jp') {
            return getVolumeNico();
          }
          return getVideo().volume;
        } catch (e) {
          console.warn(e);
          return 1;
        }
      },

      set volume(v) {
        try {
          v = Math.max(0, Math.min(1, v));
          if (location.host === 'www.nicovideo.jp') {
            return setVolumeNico(v);
          }
          getVideo().volume = v;
        } catch (e) {
          console.warn(e);
        }
      },

      get duration() {
        try {
          return getVideo().duration;
        } catch (e) {
          console.warn(e);
          return 1;
        }
      },

      play() {
        try {
          return getVideo().play();
        } catch (e) {
          console.warn(e);
          return Promise.reject();
        }
      },

      pause() {
        try {
          return getVideo().pause();
        } catch (e) {
          console.warn(e);
          return Promise.reject();
        }
      },

      get paused() {
        try {
          return getVideo().paused;
        } catch (e) {
          console.warn(e);
          return true;
        }
      },

    };

    const seekNico = time => {
      const xs = document.querySelector('.SeekBar .XSlider');
      let [min, sec] = document.querySelector`.PlayerPlayTime-duration`.textContent.split(':');
      let duration = min * 60 + sec * 1;
      let left = xs.getBoundingClientRect().left;
      let offsetWidth = xs.offsetWidth;
      let per = time / duration * 100;
      let clientX = offsetWidth * per / 100 + left;
      xs.dispatchEvent(new MouseEvent('mousedown', {clientX}));
      document.dispatchEvent(new MouseEvent('mouseup', {clientX}));
    };

    const setVolumeNico = vol => {
      const xs = document.querySelector('.VolumeBar .XSlider');
      let left = xs.getBoundingClientRect().left;
      let offsetWidth = xs.offsetWidth;
      let per = vol * 100;
      let clientX = offsetWidth * per / 100 + left;
      xs.dispatchEvent(new MouseEvent('mousedown', {clientX}));
      document.dispatchEvent(new MouseEvent('mouseup', {clientX}));
    };

    const seekPrimeVideo = time => {
      const xs = document.querySelector('.seekBar .progressBarContainer');
      xs.closest('.bottomPanelItem').style.display = '';
      let left = xs.getBoundingClientRect().left;
      let offsetWidth = xs.offsetWidth;
      let per = (time - 10) / video.duration * 100; // 何故か10秒分ズレてる？
      let clientX = offsetWidth * per / 100 + left;
      // console.log('seek', video.currentTime, time, left, offsetWidth, per, clientX);
      xs.dispatchEvent(new PointerEvent('pointerdown', {clientX}));
      xs.dispatchEvent(new PointerEvent('pointerup', {clientX}));
    };

    const getVolumeNico = () => {
      try {
        const xp = document.querySelector('.VolumeBar .XSlider .ProgressBar-inner');
        return (xp.style.transform || '1').replace(/scaleX\(([0-9\.]+)\)/, '$1') * 1;
      } catch (e) {
        console.warn(e);
        return 1;
      }
    };

    const execCommand = (command, param) => {
      switch (command) {
        case 'playbackRate':
          video.playbackRate = param;
          break;
        case 'toggle-play': {
          const btn = document.querySelector(
            '.ytp-ad-skip-button, .PlayerPlayButton, .PlayerPauseButton, .html5-main-videom, .bilibili-player-video-btn-start, .pausedOverlay');
          if (btn) {
            if (location.host === 'www.amazon.co.jp') {
              btn.dispatchEvent(new CustomEvent('pointerup'));
            } else {
              btn.click();
            }
          } else
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
        }
        case 'toggle-mute': {
          const btn = document.querySelector(
            '.MuteVideoButton, .UnMuteVideoButton, .ytp-mute-button, .bilibili-player-iconfont-volume-max');
          if (btn) {
            btn.click();
          } else {
            video.muted = !video.muted;
          }
          break;
        }
        case 'seek':
          video.currentTime = param * 1;
          break;
        case 'seekBy':
          video.currentTime += param * 1;
          break;
        case 'seekNextFrame':
          video.currentTime += 1 / 60;
          break;
        case 'seekPrevFrame':
          video.currentTime -= 1 / 60;
          break;
        case 'volumeUp': {
          let v = video.volume;
          let r = v < 0.05 ? 1.3 : 1.1;
          video.volume = Math.max(0.05, v * r + 0.01);
          break;
        }
        case 'volumeDown': {
          let v = video.volume;
          let r = 1 / 1.2;
          video.volume = Math.max(0.01, v * r);
          break;
        }
        case 'toggle-showComment': {
          const btn = document.querySelector('.CommentOnOffButton, .bilibili-player-video-danmaku-switch input');
          if (btn) {
            btn.click();
          }
          break;
        }
        case 'toggle-fullscreen': {
          const btn = document.querySelector(
            '.EnableFullScreenButton, .DisableFullScreenButton, .ytp-fullscreen-button, .bilibili-player-video-btn-fullscreen, .imageButton.fullscreenButton');
          if (btn) {
            btn.click();
          }
          break;
        }
        case 'playNextVideo': {
          const btn = document.querySelector(
            '.PlayerSkipNextButton, .ytp-next-button, .nextTitleButton, .skipAdButton');
          if (btn) {
            btn.click();
          }
          break;
        }
        case 'playPreviousVideo': {
          const btn = document.querySelector(
            '.PlayerSeekBackwardButton');
          if (btn) {
            btn.click();
          }
          if (['www.youtube.com'].includes(location.host)) {
            history.back();
          }
          break;
        }
        case 'screenShot': {
          screenShot();
          break;
        }
        case 'deflistAdd': {
          const btn = document.querySelector(
            '.InstantMylistButton');
          if (btn) {
            btn.click();
          }
          break;
        }
        case 'notify':
          notify(param);
          break;
        case 'unlink':
          if (document.hasFocus()) {
            JoyRemocon.unlink();
          }
          break;
        default:
          console.warn('unknown command "%s" "%o"', command, param);
          break;
      }
    };

    const notify = message => {
      const div = document.createElement('div');
      div.textContent = message;
      Object.assign(div.style, {
        position: 'fixed',
        display: 'inline-block',
        zIndex: 1000000,
        left: 0,
        bottom:  0,
        transition: 'opacity 0.4s linear, transform 0.5s ease',
        padding: '8px 16px',
        background: '#00c',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '16px',
        fontWeight: 'bolder',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        boxShadow: '2px 2px 0 #ccc',
        userSelect: 'none',
        pointerEvents: 'none',
        willChange: 'transform',
        opacity: 0,
        transform: 'translate(0, +100%) translate(48px, +48px) ',
      });


      const parent = document.querySelector('.MainContainer') || document.body;
      parent.append(div);

      setTimeout(() => {
        Object.assign(div.style, { opacity: 1, transform: 'translate(48px, -48px)' });
      }, 100);
      setTimeout(() => {
        Object.assign(div.style, { opacity: 0, transform: 'translate(48px, -48px) scaleY(0)' });
      }, 2000);
      setTimeout(() => {
        div.remove();
      }, 3000);
    };

    const getVideoTitle = () => {
      switch (location.host) {
        case 'www.nicovideo.jp':
          return document.title;
        case 'www.youtube.com':
          return document.title;
        default:
          return document.title;
      }
    };

    const toSafeName = function(text) {
      text = text.trim()
        .replace(/</g, '＜')
        .replace(/>/g, '＞')
        .replace(/\?/g, '？')
        .replace(/:/g, '：')
        .replace(/\|/g, '｜')
        .replace(/\//g, '／')
        .replace(/\\/g, '￥')
        .replace(/"/g, '”')
        .replace(/\./g, '．')
      ;
      return text;
    };

    const speedUp = () => {
      let current = video.playbackRate;
      execCommand('playbackRate', Math.floor(Math.min(current + 0.1, 3) * 10) / 10);
    };

    const speedDown = () => {
      let current = video.playbackRate;
      execCommand('playbackRate', Math.floor(Math.max(current - 0.1, 0.1) * 10) / 10);
    };

    const scrollUp = () => {
      document.documentElement.scrollTop =
        Math.max(0, document.documentElement.scrollTop - window.innerHeight / 5);
    };

    const scrollDown = () => {
      document.documentElement.scrollTop =
        document.documentElement.scrollTop + window.innerHeight / 5;
    };

    const scrollToVideo = () => {
      getVideo().scrollIntoView({behavior: 'smooth', block: 'center'});
    };

    const screenShot = video => {
      video = video || getVideo();
      if (!video) {
        return;
      }
      // draw canvas
      const width = video.videoWidth;
      const height = video.videoHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      document.body.append(canvas);
      // fileName
      const videoTitle = getVideoTitle();
      const currentTime = video.currentTime;
      const min = Math.floor(currentTime / 60);
      const sec = (currentTime % 60 + 100).toString().substr(1, 6);
      const time = `${min}_${sec}`;
      const fileName = `${toSafeName(videoTitle)}@${time}.png`;

      // to objectURL
      console.time('canvas to DataURL');
      const dataURL = canvas.toDataURL('image/png');
      console.timeEnd('canvas to DataURL');

      console.time('dataURL to objectURL');
      const bin = atob(dataURL.split(',')[1]);
      const buf = new Uint8Array(bin.length);
      for (let i = 0, len = buf.length; i < len; i++) {
        buf[i] = bin.charCodeAt(i);
      }
      const blob = new Blob([buf.buffer], {type: 'image/png'});
      const objectURL = URL.createObjectURL(blob);
      console.timeEnd('dataURL to objectURL');

      // save
      const link = document.createElement('a');
      link.setAttribute('download', fileName);
      link.setAttribute('href', objectURL);
      document.body.append(link);
      link.click();
      setTimeout(() => { link.remove(); URL.revokeObjectURL(objectURL); }, 1000);
    };

    const ButtonMapJoyConL = {
      Y: 0,
      B: 1,
      X: 2,
      A: 3,
      SUP: 4,
      SDN: 5,
      SEL: 8,
      CAP: 13,
      LR: 14,
      META: 15,
      PUSH: 10
    };
    const ButtonMapJoyConR = {
      Y: 3,
      B: 2,
      X: 1,
      A: 0,
      SUP: 5,
      SDN: 4,
      SEL: 9,
      CAP: 12,
      LR: 14,
      META: 15,
      PUSH: 11
    };

    const JoyConAxisCenter = +1.28571;

    const AxisMapJoyConL = {
      CENTER: JoyConAxisCenter,
      UP:     +0.71429,
      U_R:    +1.00000,
      RIGHT:  -1.00000,
      D_R:    -0.71429,
      DOWN:   -0.42857,
      D_L:    -0.14286,
      LEFT:   +0.14286,
      U_L:    +0.42857,
    };

    const AxisMapJoyConR = {
      CENTER: JoyConAxisCenter,
      UP:     -0.42857,
      U_R:    -0.14286,
      RIGHT:  +0.14286,
      D_R:    +0.42857,
      DOWN:   +0.71429,
      D_L:    +1.00000,
      LEFT:   -1.00000,
      U_L:    -0.71429,
    };


    const onButtonDown = (button, deviceId) => {
      const ButtonMap = deviceId.match(/Vendor: 057e Product: 2006/i) ?
        ButtonMapJoyConL : ButtonMapJoyConR;
      switch (button) {
        case ButtonMap.Y:
          if (isPauseButtonDown) {
            execCommand('seekPrevFrame');
          } else {
            execCommand('toggle-showComment');
          }
          break;
        case ButtonMap.B:
          isPauseButtonDown = true;
          execCommand('toggle-play');
          break;
        case ButtonMap.X:
          if (isMetaButtonDown) {
            execCommand('playbackRate', 2);
          } else {
            isRate1ButtonDown = true;
            execCommand('playbackRate', 0.1);
          }
          break;
        case ButtonMap.A:
          if (isPauseButtonDown) {
            execCommand('seekNextFrame');
          } else {
            execCommand('toggle-mute');
          }
          break;
        case ButtonMap.SUP:
          if (isMetaButtonDown) {
            scrollUp();
          } else {
            execCommand('playPreviousVideo');
          }
          break;
        case ButtonMap.SDN:
          if (isMetaButtonDown) {
            scrollDown();
          } else {
            execCommand('playNextVideo');
          }
          break;
        case ButtonMap.SEL:
          if (isMetaButtonDown) {
            execCommand('unlink');
          } else {
            execCommand('deflistAdd');
          }
          break;
        case ButtonMap.CAP:
          if (location.host === 'www.amazon.co.jp') {
            return;
          }
          execCommand('screenShot');
          break;
        case ButtonMap.PUSH:
          if (isMetaButtonDown) {
            scrollToVideo();
          } else {
            execCommand('seek', 0);
          }
          break;
        case ButtonMap.LR:
          execCommand('toggle-fullscreen');
          break;
        case ButtonMap.META:
          isMetaButtonDown = true;
          break;
      }
    };


    const onButtonUp = (button, deviceId) => {
      const ButtonMap = deviceId.match(/Vendor: 057e Product: 2006/i) ?
        ButtonMapJoyConL : ButtonMapJoyConR;
      switch (button) {
        case ButtonMap.Y:
          break;
        case ButtonMap.B:
          isPauseButtonDown = false;
          break;
        case ButtonMap.X:
          isRate1ButtonDown = false;
          execCommand('playbackRate', 1);
          break;
        case ButtonMap.META:
          isMetaButtonDown = false;
          break;
      }
    };


    const onButtonRepeat = (button, deviceId) => {
      const ButtonMap = deviceId.match(/Vendor: 057e Product: 2006/i) ?
        ButtonMapJoyConL : ButtonMapJoyConR;
      switch (button) {
        case ButtonMap.Y:
          if (isMetaButtonDown) {
            execCommand('seekBy', -15);
          } else if (isPauseButtonDown) {
            execCommand('seekPrevFrame');
          }
          break;

        case ButtonMap.A:
          if (isMetaButtonDown) {
            execCommand('seekBy', 15);
          } else if (isPauseButtonDown) {
            execCommand('seekNextFrame');
          }
          break;
        case ButtonMap.SUP:
          if (isMetaButtonDown) {
            scrollUp();
          } else {
            execCommand('playPreviousVideo');
          }
          break;
        case ButtonMap.SDN:
          if (isMetaButtonDown) {
            scrollDown();
          } else {
            execCommand('playNextVideo');
          }
          break;
      }
    };


    const onAxisChange = (axis, value, deviceId) => {};
    const onAxisRepeat = (axis, value, deviceId) => {};
    const onPovChange = (pov, deviceId) => {
      switch(pov) {
        case 'UP':
          if (isMetaButtonDown) {
            speedUp();
          } else {
            execCommand('volumeUp');
          }
          break;
        case 'DOWN':
          if (isMetaButtonDown) {
            speedDown();
          } else {
            execCommand('volumeDown');
          }
          break;
        case 'LEFT':
          execCommand('seekBy', isRate1ButtonDown || isMetaButtonDown ? -1 : -5);
          break;
        case 'RIGHT':
          execCommand('seekBy', isRate1ButtonDown || isMetaButtonDown ? +1 : +5);
          break;
      }
    };

    const onPovRepeat = onPovChange;


    class Handler {
      constructor(...args) {
        this._list = new Array(...args);
      }

      get length() {
        return this._list.length;
      }

      exec(...args) {
        if (!this._list.length) {
          return;
        } else if (this._list.length === 1) {
          this._list[0](...args);
          return;
        }
        for (let i = this._list.length - 1; i >= 0; i--) {
          this._list[i](...args);
        }
      }

      execMethod(name, ...args) {
        if (!this._list.length) {
          return;
        } else if (this._list.length === 1) {
          this._list[0][name](...args);
          return;
        }
        for (let i = this._list.length - 1; i >= 0; i--) {
          this._list[i][name](...args);
        }
      }

      add(member) {
        if (this._list.includes(member)) {
          return this;
        }
        this._list.unshift(member);
        return this;
      }

      remove(member) {
        _.pull(this._list, member);
        return this;
      }

      clear() {
        this._list.length = 0;
        return this;
      }

      get isEmpty() {
        return this._list.length < 1;
      }
    }


    const {Emitter} = (() => {
      class Emitter {

        on(name, callback) {
          if (!this._events) {
            Emitter.totalCount++;
            this._events = {};
          }

          name = name.toLowerCase();
          let e = this._events[name];
          if (!e) {
            e = this._events[name] = new Handler(callback);
          } else {
            e.add(callback);
          }
          if (e.length > 10) {
            Emitter.warnings.push(this);
          }
          return this;
        }

        off(name, callback) {
          if (!this._events) {
            return;
          }

          name = name.toLowerCase();
          const e = this._events[name];

          if (!this._events[name]) {
            return;
          } else if (!callback) {
            delete this._events[name];
          } else {
            e.remove(callback);

            if (e.isEmpty) {
              delete this._events[name];
            }
          }

          if (Object.keys(this._events).length < 1) {
            delete this._events;
          }
          return this;
        }

        once(name, func) {
          const wrapper = (...args) => {
            func(...args);
            this.off(name, wrapper);
            wrapper._original = null;
          };
          wrapper._original = func;
          return this.on(name, wrapper);
        }

        clear(name) {
          if (!this._events) {
            return;
          }

          if (name) {
            delete this._events[name];
          } else {
            delete this._events;
            Emitter.totalCount--;
          }
          return this;
        }

        emit(name, ...args) {
          if (!this._events) {
            return;
          }

          name = name.toLowerCase();
          const e = this._events[name];

          if (!e) {
            return;
          }

          e.exec(...args);
          return this;
        }

        emitAsync(...args) {
          if (!this._events) {
            return;
          }

          setTimeout(() => {
            this.emit(...args);
          }, 0);
          return this;
        }
      }

      Emitter.totalCount = 0;
      Emitter.warnings = [];

      return {
        Emitter
      };
    })();

    class PollingTimer {
      constructor(callback, interval) {
        this._timer = null;
        this._callback = callback;
        if (typeof interval === 'number') {
          this.changeInterval(interval);
        }
      }
      changeInterval(interval) {
        if (this._timer) {
          if (this._currentInterval === interval) {
            return;
          }
          window.clearInterval(this._timer);
        }
        console.log('%cupdate Interval:%s', 'background: lightblue;', interval);
        this._currentInterval = interval;
        this._timer = window.setInterval(this._callback, interval);
      }
      pause() {
        window.clearInterval(this._timer);
        this._timer = null;
      }
      start() {
        if (typeof this._currentInterval !== 'number') {
          return;
        }
        this.changeInterval(this._currentInterval);
      }
    }

    class GamePad extends Emitter {
      constructor(gamepadStatus) {
        super();
        this._gamepadStatus = gamepadStatus;
        this._buttons = [];
        this._axes = [];
        this._pov = '';
        this._lastTimestamp = 0;
        this._povRepeat = 0;
        this.initialize(gamepadStatus);
      }
      initialize(gamepadStatus) {
        this._buttons.length = gamepadStatus.buttons.length;
        this._axes.length = gamepadStatus.axes.length;
        this._id = gamepadStatus.id;
        this._index = gamepadStatus.index;
        this._isRepeating = false;
        this.reset();
      }
      reset() {
        let i, len;
        this._pov = '';
        this._povRepeat = 0;

        for (i = 0, len = this._gamepadStatus.buttons.length + 16; i < len; i++) {
          this._buttons[i] = {pressed: false, repeat: 0};
        }
        for (i = 0, len = this._gamepadStatus.axes.length; i < len; i++) {
          this._axes[i] = {value: null, repeat: 0};
        }
      }

      update() {
        let gamepadStatus = (navigator.getGamepads())[this._index];

        if (!gamepadStatus || !gamepadStatus.connected) { console.log('no status'); return; }

        if (!this._isRepeating && this._lastTimestamp === gamepadStatus.timestamp) {
          return;
        }
        this._gamepadStatus = gamepadStatus;
        this._lastTimestamp = gamepadStatus.timestamp;

        let buttons = gamepadStatus.buttons, axes = gamepadStatus.axes;
        let i, len, axis, isRepeating = false;

        for (i = 0, len = Math.min(this._buttons.length, buttons.length); i < len; i++) {
          let buttonStatus = buttons[i].pressed ? 1 : 0;

          if (this._buttons[i].pressed !== buttonStatus) {
            let eventName = (buttonStatus === 1) ? 'onButtonDown' : 'onButtonUp';
            this.emit(eventName, i, 0);
            this.emit('onButtonStatusChange', i, buttonStatus);
          }
          this._buttons[i].pressed = buttonStatus;
          if (buttonStatus) {
            this._buttons[i].repeat++;
            isRepeating = true;
            if (this._buttons[i].repeat % 5 === 0) {
              //console.log('%cbuttonRepeat%s', 'background: lightblue;', i);
              this.emit('onButtonRepeat', i);
            }
          } else {
            this._buttons[i].repeat = 0;
          }
        }
        for (i = 0, len = Math.min(8, this._axes.length); i < len; i++) {
          axis = Math.round(axes[i] * 1000) / 1000;

          if (this._axes[i].value === null) {
            this._axes[i].value = axis;
            continue;
          }

          let diff = Math.round(Math.abs(axis - this._axes[i].value));
          if (diff >= 1) {
            this.emit('onAxisChange', i, axis);
          }
          if (Math.abs(axis) <= 0.1 && this._axes[i].repeat > 0) {
            this._axes[i].repeat = 0;
          } else if (Math.abs(axis) > 0.1) {
            this._axes[i].repeat++;
            isRepeating = true;
          } else {
            this._axes[i].repeat = 0;
          }
          this._axes[i].value = axis;

        }

        if (typeof axes[9] !== 'number') {
          this._isRepeating = isRepeating;
          return;
        }
        {
          const b = 100000;
          const axis = Math.trunc(axes[9] * b);
          const margin = b / 10;
          let pov = '';
          const AxisMap = this._id.match(/Vendor: 057e Product: 2006/i) ? AxisMapJoyConL : AxisMapJoyConR;
          if (Math.abs(JoyConAxisCenter * b - axis) <= margin) {
            pov = '';
          } else {
            Object.keys(AxisMap).forEach(key => {
              if (Math.abs(AxisMap[key] * b - axis) <= margin) {
                pov = key;
              }
            });
          }
          if (this._pov !== pov) {
            this._pov = pov;
            this._povRepeat = 0;
            isRepeating = pov !== '';
            this.emit('onPovChange', this._pov);
          } else if (pov !== '') {
            this._povRepeat++;
            isRepeating = true;
            if (this._povRepeat % 5 === 0) {
              this.emit('onPovRepeat', this._pov);
            }
          }
         }


        this._isRepeating = isRepeating;
      }

      dump() {
        let gamepadStatus = this._gamepadStatus, buttons = gamepadStatus.buttons, axes = gamepadStatus.axes;
        let i, len, btmp = [], atmp = [];
        for (i = 0, len = axes.length; i < len; i++) {
          atmp.push('ax' + i + ': ' + axes[i]);
        }
        for (i = 0, len = buttons.length; i < len; i++) {
          btmp.push('bt' + i + ': ' + (buttons[i].pressed ? 1 : 0));
        }
        return atmp.join('\n') + '\n' + btmp.join(', ');
      }

      getButtonStatus(index) {
        return this._buttons[index] || 0;
      }

      getAxisValue(index) {
        return this._axes[index] || 0;
      }

      release() {
        this.clear();
      }

      get isConnected() {
        return this._gamepadStatus.connected ? true : false;
      }

      get deviceId() {
        return this._id;
      }

      get deviceIndex() {
        return this._index;
      }

      get buttonCount() {
        return this._buttons ? this._buttons.length : 0;
      }

      get axisCount() {
        return this._axes ? this._axes.length : 0;
      }

      get pov() {
        return this._pov;
      }

      get x() {
        return this._axes.length > 0 ? this._axes[0] : 0;
      }

      get y() {
        return this._axes.length > 1 ? this._axes[1] : 0;
      }

      get z() {
        return this._axes.length > 2 ? this._axes[2] : 0;
      }
    }

    const noop = () => {};

    const JoyRemocon = (() => {
      let activeGamepad = null;
      let pollingTimer = null;
      let emitter = new Emitter();
      let unlinked = false;

      const detectGamepad = () => {
        if (activeGamepad) {
          return;
        }
        const gamepads = navigator.getGamepads();
        if (gamepads.length < 1) {
          return;
        }
        const pad = Array.from(gamepads).reverse().find(pad => {
          return  pad &&
                  pad.connected &&
                  pad.id.match(/^Joy-Con/i);
        });
        if (!pad) { return; }

        window.console.log(
          '%cdetect gamepad index: %s, id: "%s", buttons: %s, axes: %s',
          'background: lightgreen; font-weight: bolder;',
          pad.index, pad.id, pad.buttons.length, pad.axes.length
        );

        const gamepad = new GamePad(pad);
        activeGamepad = gamepad;

        gamepad.on('onButtonDown',
            number => emitter.emit('onButtonDown', number, gamepad.deviceIndex));
        gamepad.on('onButtonRepeat',
            number => emitter.emit('onButtonRepeat', number, gamepad.deviceIndex));
        gamepad.on('onButtonUp',
            number => emitter.emit('onButtonUp', number, gamepad.deviceIndex));
        gamepad.on('onPovChange',
            pov => emitter.emit('onPovChange', pov, gamepad.deviceIndex));
        gamepad.on('onPovRepeat',
            pov => emitter.emit('onPovRepeat', pov, gamepad.deviceIndex));

        emitter.emit('onDeviceConnect', gamepad.deviceIndex, gamepad.deviceId);

        pollingTimer.changeInterval(30);
      };


      const onGamepadConnectStatusChange = (e, isConnected) => {
        console.log('onGamepadConnetcStatusChange', e, e.gamepad.index, isConnected);

        if (isConnected) {
          console.log('%cgamepad connected id:"%s"', 'background: lightblue;', e.gamepad.id);
          detectGamepad();
        } else {
          emitter.emit('onDeviceDisconnect', activegamepad.deviceIndex);
          // if (activeGamepad) {
          //   activeGamepad.release();
          // }
          // activeGamepad = null;
          console.log('%cgamepad disconneced id:"%s"', 'background: lightblue;', e.gamepad.id);
        }
      };

      const initializeTimer = () => {
        console.log('%cinitializeGamepadTimer', 'background: lightgreen;');

        const onTimerInterval = () => {
          if (unlinked) {
            return;
          }
          if (!activeGamepad) {
            return detectGamepad();
          }
          if (!activeGamepad.isConnected) {
            return;
          }
          activeGamepad.update();
        };

        pollingTimer = new PollingTimer(onTimerInterval, 1000);
      };

      const initializeGamepadConnectEvent = () => {
        console.log('%cinitializeGamepadConnectEvent', 'background: lightgreen;');

        window.addEventListener('gamepadconnected',
          function(e) { onGamepadConnectStatusChange(e, true); });
        window.addEventListener('gamepaddisconnected',
          function(e) { onGamepadConnectStatusChange(e, false); });

        if (activeGamepad) {
          return;
        }
        window.setTimeout(detectGamepad, 1000);
      };


      let hasStartDetect = false;
      return {
        on: (...args) => { emitter.on(...args); },
        startDetect: () => {
          if (hasStartDetect) { return; }
          hasStartDetect = true;
          initializeTimer();
          initializeGamepadConnectEvent();
        },
        startPolling: () => {
          if (pollingTimer) { pollingTimer.start(); }
        },
        stopPolling: () => {
          if (pollingTimer) { pollingTimer.pause(); }
        },
        unlink: () => {
          if (!activeGamepad) {
            return;
          }
          unlinked = true;
          activeGamepad.release();
          activeGamepad = null;
          pollingTimer.changeInterval(1000);
          execCommand(
            'notify',
            'JoyRemocon と切断しました'
          );
          }
      };
    })();


    const initGamepad = () => {

      let isActivated = false;
      let deviceId, deviceIndex;

      let notifyDetect = () =>  {
        if (!document.hasFocus()) { return; }
        isActivated = true;
        notifyDetect = noop;

        // 初めてボタンかキーが押されたタイミングで通知する
        execCommand(
          'notify',
          'ゲームパッド "' + deviceId + '" とリンクしました'
        );
      };


      let bindEvents = () => {
        bindEvents = noop;

        JoyRemocon.on('onButtonDown',   number => {
          notifyDetect();
          if (!isActivated) { return; }
          onButtonDown(number, deviceId);
        });
        JoyRemocon.on('onButtonRepeat', number => {
          if (!isActivated) { return; }
          onButtonRepeat(number, deviceId);
        });
        JoyRemocon.on('onButtonUp',     number => {
          if (!isActivated) { return; }
          onButtonUp(number, deviceId);
        });
        JoyRemocon.on('onPovChange',   pov => {
          if (!isActivated) { return; }
          onPovChange(pov, deviceId);
        });
        JoyRemocon.on('onPovRepeat',   pov => {
          if (!isActivated) { return; }
          onPovRepeat(pov, deviceId);
        });
      };

      let onDeviceConnect = function(index, id) {
         deviceIndex = index;
         deviceId = id;

         bindEvents();
      };

      JoyRemocon.on('onDeviceConnect', onDeviceConnect);
      JoyRemocon.startDetect();
    };


    const initialize = () => {
      initGamepad();
    };

    initialize();
  };

  const script = document.createElement('script');
  script.id = 'JoyRemoconLoader';
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('charset', 'UTF-8');
  script.appendChild(document.createTextNode(`(${monkey})();`));
  document.documentElement.append(script);

})();
