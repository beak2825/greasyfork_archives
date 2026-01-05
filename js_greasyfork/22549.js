// ==UserScript==
// @name         SoundCloud Toggle Continuous Play and Autoplay
// @namespace    https://greasyfork.org/users/649
// @version      1.1.21
// @description  Adds options to toggle continuous play and autoplay in SoundCloud
// @author       Adrien Pyke
// @match        *://soundcloud.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/22549/SoundCloud%20Toggle%20Continuous%20Play%20and%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/22549/SoundCloud%20Toggle%20Continuous%20Play%20and%20Autoplay.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'SoundCloud Toggle Continuous Play and Autoplay';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    createCheckbox(lbl) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(lbl));
      return label;
    }
  };

  const Config = GM_config([
    {
      key: 'autoplay',
      label: 'Autoplay',
      default: false,
      type: 'bool'
    },
    {
      key: 'continuousPlay',
      label: 'Continuous Play',
      default: false,
      type: 'bool'
    }
  ]);
  GM_registerMenuCommand('SoundCloud Autoplay', Config.setup);

  const App = {
    playButton: Util.q('.playControl'),
    isPlaying() {
      return App.playButton.classList.contains('playing');
    },
    pause() {
      if (App.isPlaying()) {
        App.playButton.click();
      }
    },
    play() {
      if (!App.isPlaying()) {
        App.playButton.click();
      }
    },
    getPlaying() {
      const link = Util.q('a.playbackSoundBadge__title');
      if (link) {
        return link.href;
      }
      return null;
    },
    addAutoplayControl() {
      const container = Util.q('.playControls__inner');
      const label = Util.createCheckbox('Autoplay');
      label.setAttribute(
        'style',
        'position: absolute; bottom: 0; right: 0; z-index: 1;'
      );
      container.appendChild(label);
      const check = Util.q('input', label);
      check.checked = Config.load().continuousPlay;
      check.onchange = () => {
        const cfg = Config.load();
        cfg.continuousPlay = check.checked;
        Config.save(cfg);
      };
      return check;
    }
  };

  // disable autoplay
  if (!Config.load().autoplay) {
    App.pause();
  }

  const autoplayControl = App.addAutoplayControl();
  let current = App.getPlaying();
  let timeout;
  // every time the song changes
  waitForElems({
    context: Util.q('.playControls__soundBadge'),
    onchange() {
      const next = App.getPlaying();
      if (!autoplayControl.checked && current && next !== current) {
        timeout = setTimeout(() => {
          Util.log('Pausing...');
          App.pause();
        }, 0);
      }
      current = next;
    }
  });

  // override the click event for elements that shouldn't trigger a pause
  waitForElems({
    sel: '.skipControl, .playButton, .compactTrackList__item, .fullListenHero__foreground',
    onmatch(elem) {
      elem.addEventListener('click', () => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      });
    }
  });

  // waveforms need to be handled differently
  waitForElems({
    sel: '.waveform__layer',
    onmatch(elem) {
      elem.addEventListener('click', () => {
        setTimeout(() => {
          if (!App.isPlaying()) {
            Util.log('Playing via Waveform');
            App.play();
          }
        }, 0);
      });
    }
  });

  // fix for buttons constantly showing buffering
  waitForElems({
    sel: '.sc-button-buffering',
    onmatch(button) {
      if (!App.isPlaying()) {
        button.classList.remove('sc-button-buffering');
        button.title = button.textContent = 'Play';
      }
    }
  });
})();
