// ==UserScript==
// @name        Stimulation Splitter
// @namespace   mikarific.com
// @description LiveSplit Auto-Split support for Stimulation Clicker!
// @icon        https://raw.githubusercontent.com/Mikarific/StimulationSplitter/main/assets/userscript/icon.png
// @icon64      https://raw.githubusercontent.com/Mikarific/StimulationSplitter/main/assets/userscript/icon64.png
// @version     0.1.1
// @author      Mikarific
// @match       https://neal.fun/*
// @run-at      document-start
// @noframes    
// @inject-into browser
// @sandbox     raw
// @connect     github.com
// @supportURL  https://discord.gg/Ka4ww68xnY
// @homepageURL https://discord.gg/Ka4ww68xnY
// @license     MIT
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/523171/Stimulation%20Splitter.user.js
// @updateURL https://update.greasyfork.org/scripts/523171/Stimulation%20Splitter.meta.js
// ==/UserScript==

(function () {
'use strict';

if (window.location.hostname === 'neal.fun') {
  let finishedLoading = false;
  window.history.pushState = new Proxy(history.pushState, {
    apply: (target, thisArg, argsList) => {
      if (argsList[2] !== undefined && finishedLoading) {
        const newURL = new URL(argsList[2], document.baseURI);
        const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
        if (isStimulationClicker) location.replace(newURL);
      }
      return Reflect.apply(target, thisArg, argsList);
    }
  });
  window.history.replaceState = new Proxy(history.replaceState, {
    apply: (target, thisArg, argsList) => {
      if (argsList[2] !== undefined && finishedLoading) {
        const newURL = new URL(argsList[2], document.baseURI);
        const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
        if (isStimulationClicker) location.replace(newURL);
      }
      return Reflect.apply(target, thisArg, argsList);
    }
  });
  window.addEventListener('popstate', () => {
    if (finishedLoading) {
      const newURL = new URL(window.location.href);
      const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
      if (isStimulationClicker) location.replace(newURL);
    }
  });
  if (document.readyState === 'interactive') {
    finishedLoading = true;
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      finishedLoading = true;
    }, {
      once: true
    });
  }
}

function domPromise(elem) {
  return new Promise(resolve => {
    if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
      if (document.readyState === 'interactive') {
        resolve(elem());
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          resolve(elem());
        }, {
          once: true
        });
      }
    } else {
      resolve(null);
    }
  });
}
const container = domPromise(() => document.querySelector('.container'));
const dom = {
  container
};

function getVueState(container, resolve) {
  if (container.__vue__ !== undefined) {
    const vueState = container.__vue__.stimulation === undefined ? container.__vue__.$children.find(child => child.stimulation !== undefined) : container.__vue__;
    resolve(vueState);
  } else {
    Object.defineProperty(container, '__vue__', {
      set(vueState) {
        if (vueState !== null) {
          resolve(vueState);
          Object.defineProperty(container, '__vue__', {
            value: vueState,
            writable: true,
            configurable: true,
            enumerable: true
          });
        }
      },
      configurable: true,
      enumerable: true
    });
  }
}
const state = new Promise(resolve => {
  if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
    if (document.readyState === 'complete') {
      dom.container.then(async container => getVueState(await container, resolve));
    } else {
      window.addEventListener('load', () => {
        dom.container.then(async container => getVueState(await container, resolve));
      }, {
        once: true
      });
    }
  } else {
    resolve(null);
  }
});

async function startLiveSplit() {
  const livesplitServer = new WebSocket('ws://127.0.0.1:16834/livesplit');
  livesplitServer.onopen = () => {
    livesplitServer.send('reset');
  };
  function getSplitIndex() {
    return new Promise(resolve => {
      livesplitServer.onmessage = event => {
        livesplitServer.onmessage = null;
        resolve(parseInt(event.data));
      };
      livesplitServer.send('getsplitindex');
    });
  }
  async function split(splitTo) {
    let splitIndex = await getSplitIndex();
    for (let i = Math.max(splitIndex, 0); i < splitTo; i++) {
      livesplitServer.send('skipsplit');
      splitIndex++;
    }
    if (splitIndex === splitTo) livesplitServer.send('split');
  }
  const vueState = await state;

  // When stimulation is first shown, start the timer
  const {
    set: showStimulationSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'showStimulation');
  Object.defineProperty(vueState, 'showStimulation', {
    set(showStimulation) {
      if (!vueState.showStimulation && showStimulation) livesplitServer.send('starttimer');
      return showStimulationSetter.call(this, showStimulation);
    },
    configurable: true,
    enumerable: true
  });

  // When Hydraulic Press is purchased, split to index 0
  const {
    set: showHydraulicPressSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'showHydraulicPress');
  Object.defineProperty(vueState, 'showHydraulicPress', {
    set(showHydraulicPress) {
      if (!vueState.showHydraulicPress && showHydraulicPress) split(0);
      return showHydraulicPressSetter.call(this, showHydraulicPress);
    },
    configurable: true,
    enumerable: true
  });

  // When Levels is purchased, split to index 1
  const {
    set: showLevelsSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'showLevels');
  Object.defineProperty(vueState, 'showLevels', {
    set(showLevels) {
      if (!vueState.showLevels && showLevels) split(1);
      return showLevelsSetter.call(this, showLevels);
    },
    configurable: true,
    enumerable: true
  });

  // When Stock Market is purchased, split to index 2
  const {
    set: showStockMarketSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'showStockMarket');
  Object.defineProperty(vueState, 'showStockMarket', {
    set(showStockMarket) {
      if (!vueState.showStockMarket && showStockMarket) split(2);
      return showStockMarketSetter.call(this, showStockMarket);
    },
    configurable: true,
    enumerable: true
  });

  // When Email is purchased, split to index 3
  const {
    set: inboxUnlockedSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'inboxUnlocked');
  Object.defineProperty(vueState, 'inboxUnlocked', {
    set(inboxUnlocked) {
      if (!vueState.inboxUnlocked && inboxUnlocked) split(3);
      return inboxUnlockedSetter.call(this, inboxUnlocked);
    },
    configurable: true,
    enumerable: true
  });

  // When Crypto is purchased, split to index 4
  const {
    set: cryptoUnlockedSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'cryptoUnlocked');
  Object.defineProperty(vueState, 'cryptoUnlocked', {
    set(cryptoUnlocked) {
      if (!vueState.cryptoUnlocked && cryptoUnlocked) split(4);
      return cryptoUnlockedSetter.call(this, cryptoUnlocked);
    },
    configurable: true,
    enumerable: true
  });

  // When Leverage is purchased, split to index 5
  const {
    set: stockLeverageSetter
  } = Object.getOwnPropertyDescriptor(vueState, 'stockLeverage');
  Object.defineProperty(vueState, 'stockLeverage', {
    set(stockLeverage) {
      if (vueState.stockLeverage === 1 && stockLeverage === 2) split(5);
      return stockLeverageSetter.call(this, stockLeverage);
    },
    configurable: true,
    enumerable: true
  });

  // When Subway Surfers Wormhole is purchased, split to index 6
  vueState.startWormhole = new Proxy(vueState.startWormhole, {
    apply: (target, thisArg, argsList) => {
      split(6);
      return Reflect.apply(target, thisArg, argsList);
    }
  });

  // When Go to the Ocean is purchased, split to index 7
  vueState.endGame = new Proxy(vueState.endGame, {
    apply: (target, thisArg, argsList) => {
      split(7);
      return Reflect.apply(target, thisArg, argsList);
    }
  });
}
if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
  if (document.readyState === 'complete') {
    startLiveSplit();
  } else {
    window.addEventListener('load', startLiveSplit, {
      once: true
    });
  }
}

async function patchDVDs() {
  if (await GM.getValue('dvdStandardization', true)) {
    const vueState = await state;
    const bgState = vueState.$refs.bg;
    const renderer = bgState.$refs.renderer;
    renderer.style.width = '1920px';
    renderer.style.height = '1080px';
    renderer.style.position = 'fixed';
    renderer.style.top = '50%';
    renderer.style.left = '50%';
    renderer.style.transform = 'translate(-50%, -50%)';

    // We don't have direct access to updateDVDs as it's not part of vue data,
    // but we can set the size of the window to 1920x1080 before the dvd hits
    // calculation by setting them before the start of bgAnimationLoop, and
    // resetting them after the bgAnimationLoop function has executed.
    vueState.bgAnimationLoop = new Proxy(vueState.bgAnimationLoop, {
      apply: (target, thisArg, argsList) => {
        const realWidth = window.innerWidth;
        const realHeight = window.innerHeight;
        window.innerWidth = 1920;
        window.innerHeight = 1080;
        const returnValue = Reflect.apply(target, thisArg, argsList);
        window.innerWidth = realWidth;
        window.innerHeight = realHeight;
        return returnValue;
      }
    });
    // This is purely for the visuals, actually renders the DVDs at the size of the canvas (1920x1080)
    bgState.resize();
  }
}
if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
  if (document.readyState === 'complete') {
    patchDVDs();
  } else {
    window.addEventListener('load', patchDVDs, {
      once: true
    });
  }
}

GM.registerMenuCommand('Toggle DVD Standardization', async () => {
  const dvdStandardization = await GM.getValue('dvdStandardization', true);
  GM.setValue('dvdStandardization', !dvdStandardization);
  if (dvdStandardization) alert('DVD Standardization has been turned OFF');
  if (!dvdStandardization) alert('DVD Standardization has been turned ON');
  location.reload();
});

})();
