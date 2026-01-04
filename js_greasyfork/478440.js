// ==UserScript==
// ==UserLibrary==
// @name        NH_web
// @description Common patterns for working with the WEB API.
// @version     6
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @homepageURL https://github.com/nexushoratio/userscripts
// @supportURL  https://github.com/nexushoratio/userscripts/issues
// @match       https://www.example.com/*
// ==/UserLibrary==
// ==/UserScript==

window.NexusHoratio ??= {};

window.NexusHoratio.web = (function web() {
  'use strict';

  /** @type {number} - Bumped per release. */
  const version = 6;

  const NH = window.NexusHoratio.base.ensure(
    [{name: 'base', minVersion: 36}]
  );

  /**
   * Run querySelector to get an element, then click it.
   * @param {Element} base - Where to start looking.
   * @param {string[]} selectorArray - CSS selectors to use to find an
   * element.
   * @param {boolean} [matchSelf=false] - If a CSS selector would match base,
   * then use it.
   * @returns {boolean} - Whether an element could be found.
   */
  function clickElement(base, selectorArray, matchSelf = false) {
    if (base) {
      for (const selector of selectorArray) {
        let el = null;
        if (matchSelf && base.matches(selector)) {
          el = base;
        } else {
          el = base.querySelector(selector);
        }
        if (el) {
          el.click();
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Bring the Browser's focus onto element.
   * @param {Element} element - HTML Element to focus on.
   */
  function focusOnElement(element) {
    if (element) {
      const magicTabIndex = -1;
      const tabIndex = element.getAttribute('tabindex');
      element.setAttribute('tabindex', magicTabIndex);
      element.focus();
      if (tabIndex) {
        element.setAttribute('tabindex', tabIndex);
      } else {
        element.removeAttribute('tabindex');
      }
    }
  }

  /**
   * Post a bunch of information about an HTML element to issues.
   * @param {Element} element - Element to get information about.
   * @param {string} name - What area this information came from.
   */
  function postInfoAboutElement(element, name) {
    const msg = `An unsupported element from  "${name}" discovered:`;
    NH.base.issues.post(msg, element.outerHTML);
  }

  /**
   * Determines if the element accepts keyboard input.
   * @param {Element} element - HTML Element to examine.
   * @returns {boolean} - Indicating whether the element accepts keyboard
   * input.
   */
  function isInput(element) {
    let tagName = '';
    if ('tagName' in element) {
      tagName = element.tagName.toLowerCase();
    }
    // eslint-disable-next-line no-extra-parens
    return (element.isContentEditable ||
            ['input', 'textarea'].includes(tagName));
  }

  /**
   * @typedef {object} Continuation
   * @property {boolean} done - Indicate whether the monitor is done
   * processing.
   * @property {object} [results] - Optional results object.
   */

  /**
   * @callback Monitor
   * @param {MutationRecord[]} records - Standard mutation records.
   * @returns {Continuation} - Indicate whether done monitoring.
   */

  /**
   * Simple function that takes no parameters and returns nothing.
   * @callback SimpleFunction
   */

  /**
   * @typedef {object} OtmotWhat
   * @property {string} name - The name for this observer.
   * @property {Element} base - Element to observe.
   */

  /**
   * @typedef {object} OtmotHow
   * @property {object} observeOptions - MutationObserver().observe() options.
   * @property {SimpleFunction} [trigger] - Function to call that triggers
   * observable results.
   * @property {Monitor} monitor - Callback used to process MutationObserver
   * records.
   * @property {number} [timeout] - Time to wait for completion in
   * milliseconds, default of 0 disables.
   */

  /**
   * MutationObserver callback for otmot.
   *
   * @param {MutationRecord[]} records - Standard mutation records.
   * @param {MutationObserver} observer - The invoking observer, enhanced with
   * extra properties by *otmot()*.
   * @returns {boolean} - The *done* value of the monitor function.
   */
  const otmotMoCallback = (records, observer) => {
    const {done, results} = observer.monitor(records);
    observer.logger.log('monitor:', done, results);
    if (done) {
      observer.disconnect();
      clearTimeout(observer.timeoutID);
      observer.logger.log('resolving');
      observer.resolve(results);
    }
    return done;
  };

  /**
   * One time mutation observer with timeout.
   * @param {OtmotWhat} what - What to observe.
   * @param {OtmotHow} how - How to observe.
   * @returns {Promise<Continuation.results>} - Will resolve with the results
   * from monitor when done is true.
   */
  function otmot(what, how) {
    const prom = new Promise((resolve, reject) => {
      const observer = new MutationObserver(otmotMoCallback);

      const {
        name,
        base,
      } = what;
      const {
        observeOptions,
        trigger = () => {},  // eslint-disable-line no-empty-function
        timeout = 0,
      } = how;

      observer.monitor = how.monitor;
      observer.resolve = resolve;
      observer.logger = new NH.base.Logger(`otmot ${name}`);
      observer.timeoutID = null;

      /** Standard setTimeout callback. */
      const toCallback = () => {
        observer.disconnect();
        observer.logger.log('one last try');
        if (!otmotMoCallback([], observer)) {
          observer.logger.log('rejecting after timeout');
          reject(new Error(`otmot ${name} timed out`));
        }
      };

      if (timeout) {
        observer.timeoutID = setTimeout(toCallback, timeout);
      }

      observer.observe(base, observeOptions);
      trigger();
      observer.logger.log('running');
      // Call once at start in case we missed the change.
      otmotMoCallback([], observer);
    });

    return prom;
  }

  /**
   * @typedef {object} OtrotWhat
   * @property {string} name - The name for this observer.
   * @property {Element} base - Element to observe.
   */

  /**
   * @typedef {object} OtrotHow
   * @property {SimpleFunction} [trigger] - Function to call that triggers
   * observable events.
   * @property {number} timeout - Time to wait for completion in milliseconds.
   */

  /**
   * ResizeObserver callback for otrot.
   *
   * @param {ResizeObserverEntry[]} entries - Standard resize records.
   * @param {ResizeObserver} observer - The invoking observer, enhanced with
   * extra properties by *otrot()*.
   * @returns {boolean} - Whether a resize was observed.
   */
  const otrotRoCallback = (entries, observer) => {
    const {initialHeight, initialWidth} = observer;
    const {clientHeight, clientWidth} = observer.base;
    observer.logger.log('observed dimensions:', clientWidth, clientHeight);
    const resized = clientHeight !== initialHeight ||
          clientWidth !== initialWidth;
    if (resized) {
      observer.disconnect();
      clearTimeout(observer.timeoutID);
      observer.logger.log('resolving');
      observer.resolve(observer.what);
    }
    return resized;
  };

  /**
   * One time resize observer with timeout.
   *
   * Will resolve automatically upon first resize change.
   * @param {OtrotWhat} what - What to observe.
   * @param {OtrotHow} how - How to observe.
   * @returns {Promise<OtrotWhat>} - Will resolve with the what parameter.
   */
  function otrot(what, how) {
    const prom = new Promise((resolve, reject) => {
      const observer = new ResizeObserver(otrotRoCallback);

      const {
        name,
        base,
      } = what;
      const {
        trigger = () => {},  // eslint-disable-line no-empty-function
        timeout,
      } = how;

      observer.base = base;
      observer.initialHeight = base.clientHeight;
      observer.initialWidth = base.clientWidth;

      observer.what = what;
      observer.resolve = resolve;
      observer.logger = new NH.base.Logger(`otrot ${name}`);
      observer.logger.log(
        'initial dimensions:',
        observer.initialWidth,
        observer.initialHeight
      );

      /** Standard setTimeout callback. */
      const toCallback = () => {
        observer.disconnect();
        observer.logger.log('one last try');
        if (!otrotRoCallback([], observer)) {
          observer.logger.log('rejecting after timeout');
          reject(new Error(`otrot ${name} timed out`));
        }
      };

      observer.timeoutID = setTimeout(toCallback, timeout);

      observer.observe(base);
      trigger();
      observer.logger.log('running');
      // Call once at start in case we missed the change.
      otrotRoCallback([], observer);
    });

    return prom;
  }

  /**
   * @callback ResizeAction
   * @param {ResizeObserverEntry[]} entries - Standard resize entries.
   */

  /**
   * @typedef {object} Otrot2How
   * @property {SimpleFunction} [trigger] - Function to call that triggers
   * observable events.
   * @property {ResizeAction} action - Function to call upon each event
   * observed and also at the end of duration.
   * @property {number} duration - Time to run in milliseconds.
   */

  /**
   * ResizeObserver callback for otrot2.
   *
   * @param {ResizeObserverEntry[]} entries - Standard resize records.
   * @param {ResizeObserver} observer - The invoking observer, enhanced with
   * extra properties by *otrot()*.
   */
  const otrot2RoCallback = (entries, observer) => {
    observer.logger.log('calling action');
    observer.action(entries);
  };

  /**
   * One time resize observer with action callback and duration.
   *
   * Will resolve upon duration expiration.  Uses the same what parameter as
   * {@link otrot}.
   * @param {OtrotWhat} what - What to observe.
   * @param {Otrow2How} how - How to observe.
   * @returns {Promise<string>} - Will resolve after duration expires.
   */
  function otrot2(what, how) {
    const prom = new Promise((resolve) => {
      const observer = new ResizeObserver(otrot2RoCallback);

      const {
        name,
        base,
      } = what;
      const {
        trigger = () => {},  // eslint-disable-line no-empty-function
        duration,
      } = how;

      observer.logger = new NH.base.Logger(`otrot2 ${name}`);
      observer.action = how.action;

      /** Standard setTimeout callback. */
      const toCallback = () => {
        observer.disconnect();
        observer.logger.log('one last call');
        otrot2RoCallback([], observer);
        observer.logger.log('resolving');
        resolve(`otrot2 ${name} finished`);
      };

      setTimeout(toCallback, duration);

      observer.observe(base);
      trigger();
      observer.logger.log('running');
      // Call once at start in case we missed the change.
      otrot2RoCallback([], observer);
    });

    return prom;
  }

  /**
   * Wait for selector to match using querySelector.
   * @param {string} selector - CSS selector.
   * @param {number} timeout - Time to wait in milliseconds, 0 disables.
   * @returns {Promise<Element>} - Matched element.
   */
  function waitForSelector(selector, timeout) {
    const me = 'waitForSelector';
    const logger = new NH.base.Logger(me);
    logger.entered(me, selector, timeout);

    /**
     * @implements {Monitor}
     * @returns {Continuation} - Indicate whether done monitoring.
     */
    const monitor = () => {
      const element = document.querySelector(selector);
      if (element) {
        logger.log(`match for ${selector}`, element);
        return {done: true, results: element};
      }
      logger.log('Still waiting for', selector);
      return {done: false};
    };

    const what = {
      name: me,
      base: document,
    };

    const how = {
      observeOptions: {childList: true, subtree: true},
      monitor: monitor,
      timeout: timeout,
    };

    logger.leaving(me);
    return otmot(what, how);
  }

  return {
    version: version,
    clickElement: clickElement,
    focusOnElement: focusOnElement,
    postInfoAboutElement: postInfoAboutElement,
    isInput: isInput,
    otmot: otmot,
    otrot: otrot,
    otrot2: otrot2,
    waitForSelector: waitForSelector,
  };

}());
