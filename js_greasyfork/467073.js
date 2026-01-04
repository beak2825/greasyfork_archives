// ==UserScript==
// @name          HTML canvas fps limiter
// @description   Fps limiter for browser games or some 2D/3D animations
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://img.icons8.com/external-neu-royyan-wijaya/32/external-animation-neu-solid-neu-royyan-wijaya.png
// @icon64        https://img.icons8.com/external-neu-royyan-wijaya/64/external-animation-neu-solid-neu-royyan-wijaya.png
// @version       2.0.0
// @match         *://*/*
// @compatible    Chrome
// @compatible    Opera
// @run-at        document-start
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/467073/HTML%20canvas%20fps%20limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/467073/HTML%20canvas%20fps%20limiter.meta.js
// ==/UserScript==

/*
 * msPrevMap is needed to provide individual rate limiting in cases
 * where requestAnimationFrame is used by more than one function loop.
 * Using a variable instead of a map in such cases makes limiter not working properly.
 * But if some loop is using anonymous functions, the map mode can't limit it,
 * so I've decided to make a switcher: the map mode or the single variable mode.
 * Default is the map mode (mode 1)
*/

/* jshint esversion: 8 */

(async function() {
  function DataStore(uuid, defaultStorage = {}) {
    if (typeof uuid !== 'string' && typeof uuid !== 'number') {
      throw new Error('Expected uuid when creating DataStore');
    }

    let cachedStorage = defaultStorage;

    try {
      cachedStorage = JSON.parse(GM_getValue(uuid));
    } catch (err) {
      GM_setValue(uuid, JSON.stringify(defaultStorage));
    }

    const getter = (obj, prop) => cachedStorage[prop];

    const setter = (obj, prop, val) => {
      cachedStorage[prop] = val;

      GM_setValue(uuid, JSON.stringify(cachedStorage));

      return val;
    }

    return new Proxy({}, { get: getter, set: setter });
  }

  class Measure {
    constructor(functionToMeasure, measurementsTargetAmount = 100) {
      this.isMeasureEnded = false;
      this.isMeasureStarted = false;

      this.functionToMeasure = functionToMeasure;
      this.measurements = [];
      this.measurementsTargetAmount = measurementsTargetAmount;

      this._completionPromise = {
        object: null,
        reject: null,
        resolve: null,
      };

      this._completionPromise.object = new Promise((resolve, reject) => {
        this._completionPromise.reject = reject;
        this._completionPromise.resolve = resolve;
      });

      this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
    }

    _performMeasure() {
      const start = performance.now();

      this.functionToMeasure(() => {
        const end = performance.now();
        const elapsed = end - start;

        if (this.isMeasureEnded) return;

        this.measurements.push(elapsed);

        if (this.measurements.length < this.measurementsTargetAmount) {
          this._performMeasure();
        } else {
          this.end();
          this._completionPromise.resolve(this._calculateMedian());
        }
      });
    }

    _calculateMedian() {
      const sorted = this.measurements.slice().sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);

      return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
    }

    _handleVisibilityChange() {
      if (document.hidden) {
        // just reject to avoid messing with
        // some measurements pause/unpause system
        this.end();
        this._completionPromise.reject();
      } else {
        this._performMeasure();
      }
    }

    end() {
      this.isMeasureEnded = true;
      document.removeEventListener('visibilitychange', this._handleVisibilityChange);
    }

    async run() {
      this.isMeasureStarted = true;

      document.addEventListener('visibilitychange', this._handleVisibilityChange);

      if (!document.hidden) this._performMeasure();

      return this._completionPromise.object;
    }
  }

  const setZeroTimeout = ((operatingWindow = window) => {
    const messageName = 'ZERO_TIMEOUT_MESSAGE';
    const timeouts = [];

    operatingWindow.addEventListener('message', (ev) => {
      if (ev.source === operatingWindow && ev.data === messageName) {
        ev.stopPropagation();

        if (timeouts.length > 0) {
          try {
            timeouts.shift()();
          } catch (e) {
            console.error(e);
          }
        }
      }
    }, true);

    return (fn) => {
      timeouts.push(fn);
      operatingWindow.postMessage(messageName);
    };
  })(unsafeWindow);

  const MODE = {
    map: 1,
    variable: 2,
  };

  const DEFAULT_FPS_CAP = 10;
  const DEFAULT_MODE = MODE.map;
  const MAX_FPS_CAP = 200;

  const s = DataStore('storage', {
    fpsCap: DEFAULT_FPS_CAP,
    isFirstRun: true,
    mode: DEFAULT_MODE,
  });

  const stallFnNames = {
    oldRequestAnimationFrame: 'oldRequestAnimationFrame',
    setTimeout: 'setTimeout',
    setZeroTimeout: 'setZeroTimeout',
  };

  const fpsLimiterActivationConditions = {
    fpsCapIsSmallerThanHz: false,
    tabIsVisible: !document.hidden,
  };

  const oldRequestAnimationFrame = unsafeWindow.requestAnimationFrame;
  const msPrevMap = new Map();
  const menuCommandsIds = [];
  let stallTimings, sortedStallTimings;
  let isLimiterActive = false;
  let userHz = 60;
  let msPerFrame = 1000 / s.fpsCap;
  let msPrev = 0;

  unsafeWindow.requestAnimationFrame = function newRequestAnimationFrame(cb) {
    for (const key in fpsLimiterActivationConditions) {
      if (!fpsLimiterActivationConditions[key]) return oldRequestAnimationFrame(cb);
    }

    let msPassed, now;

    (function recursiveTimeout() {
      now = performance.now();
      msPassed = now - ((s.mode === MODE.map ? msPrevMap.get(cb) : msPrev) || 0);

      const diff = msPerFrame - msPassed;

      if (diff > 0) {
        let chosenStallFnName, chosenStallValue;

        for (let i = 0; i < sortedStallTimings.length; i++) {
          const [stallFnName, stallValue] = sortedStallTimings[i];

          chosenStallFnName = stallFnName;
          chosenStallValue = stallValue;

          if (diff >= stallValue) break;
        }

        if (chosenStallFnName === stallFnNames.oldRequestAnimationFrame) {
          return oldRequestAnimationFrame(recursiveTimeout);
        }

        if (chosenStallFnName === stallFnNames.setTimeout) {
          return setTimeout(recursiveTimeout);
        }

        if (chosenStallFnName === stallFnNames.setZeroTimeout) {
          return setZeroTimeout(recursiveTimeout);
        }
      }

      if (s.mode === MODE.variable) {
        msPrev = now;
      } else {
        msPrevMap.set(cb, now);
      }

      return cb(now);
    }());
  }

  document.addEventListener('visibilitychange', () => {
    fpsLimiterActivationConditions.tabIsVisible = !document.hidden;
  });

  stallTimings = await (async function makeMeasurements(attemptsNumber = 10) {
    attemptsNumber -= 1;

    const t = {
      [stallFnNames.oldRequestAnimationFrame]: Infinity,
      [stallFnNames.setTimeout]: Infinity,
      [stallFnNames.setZeroTimeout]: Infinity,
    };

    try {
      await Promise.all([
        (async () => {
          const measureFn = (cb) => setTimeout(cb);

          t.setTimeout = await (new Measure(measureFn, 100)).run();
        })(),

        (async () => {
          const measureFn = (cb) => oldRequestAnimationFrame(cb);

          t.oldRequestAnimationFrame = await (new Measure(measureFn, 100)).run();
        })(),
      ]);

      await (async () => {
        const measureFn = (cb) => setZeroTimeout(cb);

        t.setZeroTimeout = await (new Measure(measureFn, 3000)).run();
      })();
    } catch (e) {
      if (attemptsNumber > 0) return await makeMeasurements();

      throw new Error('Failed with unknown reason');
    }

    return t;
  }());

  userHz = Math.round(1000 / stallTimings[stallFnNames.oldRequestAnimationFrame]);
  sortedStallTimings = Object.entries(stallTimings).sort((a, b) => b[1] - a[1]);
  fpsLimiterActivationConditions.fpsCapIsSmallerThanHz = s.fpsCap < userHz;

  // mode 1 garbage collector. 50 is random number
  setInterval(() => (msPrevMap.size > 50) && msPrevMap.clear(), 1000);

  function changeFpsCapWithUser() {
    const userInput = prompt(
      `Current fps cap: ${s.fpsCap}. ` +
      'What should be the new one? Leave empty or cancel to not to change'
    );

    if (userInput !== null && userInput !== '') {
      let userInputNum = Number(userInput);

      if (isNaN(userInputNum)) {
        messageUser('bad input', 'Seems like the input is not a number');
      } else if (userInputNum > MAX_FPS_CAP) {
        s.fpsCap = MAX_FPS_CAP;
        fpsLimiterActivationConditions.fpsCapIsSmallerThanHz = s.fpsCap < userHz;

        messageUser(
          'bad input',
          `Seems like the input number is way too big. Decreasing it to ${MAX_FPS_CAP}`,
        );
      } else if (userInputNum < 0) {
        messageUser(
          'bad input',
          "The input number can't be negative",
        );
      } else {
        s.fpsCap = userInputNum;
        fpsLimiterActivationConditions.fpsCapIsSmallerThanHz = s.fpsCap < userHz;
      }

      msPerFrame = 1000 / s.fpsCap;

      // can't be applied in iframes
      messageUser(
        `the fps cap was set to ${s.fpsCap}`,
        "For some places the fps cap change can't be applied without a reload, " +
        "and if you can't tell worked it out or not, better to refresh the page",
      );

      unregisterMenuCommands();
      registerMenuCommands();
    }
  }

  function messageUser(title, text) {
    alert(`Fps limiter: ${title}.\n\n${text}`);
  }

  function registerMenuCommands() {
    // skip if in an iframe
    if (window.self !== window.top) return;

    menuCommandsIds.push(GM_registerMenuCommand(
      `Cap fps (${s.fpsCap} now)`, () => changeFpsCapWithUser(), 'c'
    ));

    menuCommandsIds.push(GM_registerMenuCommand(
      `Switch mode to ${s.mode === MODE.map ? MODE.variable : MODE.map}`, () => {
        s.mode = s.mode === MODE.map ? MODE.variable : MODE.map;

        // can't be applied in iframes
        messageUser(
          `the mode was set to ${s.mode}`,
          "For some places the mode change can't be applied without a reload, " +
          "and if you can't tell worked it out or not, better to refresh the page. " +
          "You can find description of the modes at the script download page",
        );

        unregisterMenuCommands();
        registerMenuCommands();
      }, 'm'
    ));
  }

  function unregisterMenuCommands() {
    // skip if in an iframe
    if (window.self !== window.top) return;

    for (const id of menuCommandsIds) {
      GM_unregisterMenuCommand(id);
    }

    menuCommandsIds.length = 0;
  }

  registerMenuCommands();

  if (s.isFirstRun) {
    messageUser(
      'it seems like your first run of this script',
      'You need to refresh the page on which this script should work. ' +
      `What fps cap do you prefer? Default is ${DEFAULT_FPS_CAP} as a demonstration. ` +
      'You can always quickly change it from your script manager icon ↗'
    );

    changeFpsCapWithUser();
    s.isFirstRun = false;
  }
})();
