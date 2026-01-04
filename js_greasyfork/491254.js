// ==UserScript==
// @name         Time Control
// @description  Script allowing you to control time.
// @icon         https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/ce262758ff44d053136358dcd892979d_low_res_Time_Machine.png
// @namespace    mailto:lucaszheng2011@outlook.com
// @version      1.5.6.1
// @author       lucaszheng
// @license      MIT
//
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues

// @inject-into  page
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491254/Time%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/491254/Time%20Control.meta.js
// ==/UserScript==
/*globals unsafeWindow,GM_setValue,GM_getValue,GM_deleteValue*/

(function (window) {
  'use strict';
  let scale = 1, pristine = true;
  /** @type {null | number} */
  let timeJump = null;

  let timeReset = false;
  let debug = false;

  const {
    Reflect: {
      apply, construct,
      setPrototypeOf,
      getPrototypeOf,
      getOwnPropertyDescriptor,
      defineProperty,
      get
    },
    Object,
    Object: {
      freeze,
      hasOwn,
      create
    },
    Event,
    Number: {
      isFinite
    },
    Symbol: {
      toPrimitive,
      toStringTag
    },
    console: {
      trace: log
    },
    Error,
    ReferenceError,
    String: {
      raw
    },
    RegExp
  } = window;

  function update() {
    for (let idx = 0; idx < updaters.length; idx++) {
      updaters[idx]();
    }
  }

  let profile_id = '';
  /** @param {string} name */
  function get_var_name(name) {
    if (profile_id != '') name = name + '_profile_' + profile_id;
    return name;
  }
  /** @type {typeof GM_getValue} */
  function getValue(name, defaultValue) {
    return GM_getValue(get_var_name(name), defaultValue);
  }
  /** @type {typeof GM_setValue} */
  function setValue(name, value) {
    return GM_setValue(get_var_name(name), value);
  }
  /** @type {typeof GM_deleteValue} */
  function deleteValue(name) {
    return GM_deleteValue(get_var_name(name));
  }

  const substring = String.prototype.substring;
  function getProfiles() {
    const keys = GM_listValues();
    const profiles = [];
    /** @type {{[key: string]: boolean}} */
    const seen = {};
    const match = '_profile_';
    setPrototypeOf(seen, null);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (let j = 1; j < 20 && j < (key.length - match.length); j++) {
        if (apply(substring, key, [j, j + match.length]) === match) {
          const profile = apply(substring, key, [j + match.length, key.length]);
          if (seen[profile]) break;
          profiles[profiles.length] = profile;
          seen[profile] = true;
          break;
        }
      }
    }

    return profiles;
  }

  /**
   * @this { { toString: typeof time.toString, now: typeof time.now } }
   * @param {'string' | 'number' | 'default'} type
   */
  function timeToPrimitive(type) {
    switch (type) {
      case 'number': return this === time.storage ? this.now : time.now;
      case 'string':
      default: return this === time.storage ? this.toString() : time.toString();
    }
  }

  /** @this { { now: typeof time.now } } */
  function timeToString() {
    return apply(date.toString, construct(DateConstructor, [this === time.storage ? this.now : time.now]), []);
  }

  /** @this { { now: typeof time.now } } */
  function timeValueOf() {
    return this === time.storage ? this.now : time.now;
  }

  const time = {
    [toStringTag]: 'time',
    [toPrimitive]: timeToPrimitive,
    toString: timeToString,
    valueOf: timeValueOf,

    /**
     * @param {number | null} [newTime]
     */
    jump(newTime) {
      if (!newTime && newTime !== 0) return;
      pristine = false;
      try {
        timeJump = +newTime;
        update();
      } finally {
        timeJump = null;
      }
    },

    /**
     * @param {number | null} [shiftTime]
     */
    shift(shiftTime) {
      if (!shiftTime) return;
      shiftTime = +shiftTime;
      if (!shiftTime) return;
      time.jump(time.now + shiftTime);
    },

    reset(resetTime = true, resetScale = true, resetDebug = true) {
      if (resetDebug) debug = false;
      if (pristine) return;

      if (resetScale) scale = 1;

      if (!resetTime) return;
      timeReset = true;
      update();
      timeReset = false;
      pristine = scale === 1;
    },

    storage: {
      [toStringTag]: 'time.storage',
      [toPrimitive]: timeToPrimitive,
      toString: timeToString,
      valueOf: timeValueOf,

      get profile() {
        return profile_id || null;
      },
      set profile(val) {
        profile_id = (val ?? '') + '';
      },

      get profiles() {
        return getProfiles();
      },

      /**
       * @param {string | null} [profile]
       */
      erase(profile) {
        const prev_profile_id = profile_id;
        profile_id = (profile ?? '') + '';
        try {
          time.storage.reset();
        } finally {
          profile_id = prev_profile_id;
        }
      },

      /**
       * @param {number} newTime
       */
      jump(newTime) {
        setValue('baseTime', time.real);
        setValue('contTime', +newTime);
      },

      save(saveTime = true, saveScale = true, saveDebug = true) {
        if (saveDebug) {
          if (debug === false) time.storage.reset(false, false, true);
          else time.storage.debug = debug;
        }
        if (saveTime) {
          if (pristine) time.storage.reset(true, false, false);
          else time.storage.now = time.now;
        }
        if (saveScale) {
          if (scale === 1) time.storage.reset(false, true, false);
          else time.storage.scale = scale;
        }
      },

      load(loadTime = true, loadScale = true, loadDebug = true) {
        if (loadDebug) time.debug = time.storage.debug;
        if (time.storage.pristine) return time.reset(true, true, false);

        if (loadTime) {
          let baseTime = getValue('baseTime', null);
          let contTime = getValue('contTime', null);
          if (baseTime != null && contTime != null)
            time.jump((time.real - baseTime) * time.storage.scale + contTime);
        }
        if (loadScale) time.scale = time.storage.scale;
      },

      reset(resetTime = true, resetScale = true, resetDebug = true) {
        if (resetTime) {
          deleteValue('baseTime');
          deleteValue('contTime');
        }
        if (resetScale) deleteValue('scale');
        if (resetDebug) deleteValue('debug');
      },

      get debug() { return getValue('debug', false); },
      set debug(value) { setValue('debug', !!value); },

      get now() {
        let baseTime = getValue('baseTime', null);
        let contTime = getValue('contTime', null);
        if (baseTime != null && contTime != null)
          return (time.real - baseTime) * time.storage.scale + contTime;
        return time.real;
      },
      set now(value) { time.storage.jump(value); },

      get pristine() {
        let baseTime = getValue('baseTime', null);
        let contTime = getValue('contTime', null);
        let scale = getValue('scale', null);
        return (baseTime == null || contTime == null) && scale == null;
      },
      set pristine(value) {
        if (!value) return;
        time.storage.reset(true, true, false);
      },

      get real() { return date.realTime(); },

      get scale() {
        let scale = getValue('scale', null);
        if (scale != null) return scale;
        return 1;
      },
      set scale(value) {
        if (value === time.storage.scale) return;
        setValue('scale', +value);
      }
    },

    get debug() { return debug; },
    set debug(value) { debug = !!value; },

    get now() { return date.now(); },
    set now(value) { time.jump(value); },

    get pristine() { return pristine; },
    set pristine(value) { if (value) time.reset(); },

    get real() { return date.realTime(); },

    get scale() { return scale; },
    set scale(value) {
      value = +value;
      if (value === scale) return;
      pristine = false; update(); scale = value;
    },

    get hidden() {
      return time_global_is_hidden;
    },

    set hidden(val) {
      time_global_is_hidden = !!val;
    }
  };

  let time_global_is_hidden = true;

  const testRegExp = RegExp.prototype.test;
  /** @returns {[stackIntrospection: false, windowProps: null] | [stackIntrospection: true, windowProps: boolean]} */
  function detectDevtools() {
    try {
      throw new Error();
    } catch (thrownError) {
      try {
        if (!(thrownError instanceof Error)) return [false, null];
        const stack = thrownError.stack;
        if (!stack) return [false, null];
        const regex = /(\n|^)\s*(global code@|@debugger eval code:.*|at <anonymous>:.*)\s*$/;
        if (!apply(testRegExp, regex, [stack])) return [false, null];
      } catch { return [false, null];  }
    }
    try {
      const props = ['$', '$$', '$x', 'clear', 'copy', 'inspect', 'keys', 'values'];
      for (let i = 0; i < props.length; i++)
        if (!(props[i] in window)) return [true, false];
    } catch { return [true, false]; }
    return [true, true];
  }

  /** @type {<T extends (...args: any[]) => any>(object: object, constructor: T) => void} */
  let captureStackTrace = () => { };
  if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function')
    captureStackTrace = /** @type {any} */(Error.captureStackTrace);

  /**
   * @param {(...args: any[]) => any} introspectionPoint
   * @param {number} safariTrimLevel
   */
  function detectEval(introspectionPoint = detectEval, safariTrimLevel = 1) {
    try {
      const err = new Error();
      captureStackTrace(err, introspectionPoint);
      const stack = err.stack;
      if (!stack) return false;
      const regexStr = raw`^\s*(Error\s*\n\s*at eval(:| ).*|.*> eval:.*|` +
                       '(?:.*\n)?'.repeat(safariTrimLevel) + raw`\s*eval code@)\s*(\n|$)`;
      if (apply(testRegExp, new RegExp(regexStr), [stack])) return true;
    } catch { return false; }
  }

  freeze(time.storage); freeze(time);
  const windowProto = getPrototypeOf(window);
  if (windowProto) {
    const windowProperties = getPrototypeOf(windowProto) ?? create(null);
    /** @type {Required<Pick<PropertyDescriptor, 'get' | 'set' | 'configurable' | 'enumerable'>> & ThisType<any>} */
    const desc = {
      get() {
        if (!time_global_is_hidden) return time;
        if (this === window) {
          const result = detectDevtools();
          if (result[0] && result[1]) return time;
          if (!('time' in windowProperties) && detectEval(timeGetter, 2)) {
            const refError = new ReferenceError('time is not defined');
            captureStackTrace(refError, timeGetter);
            throw refError;
          }
        }
        try {
          return get(windowProperties, 'time', window);
        } catch (err) {
          if (err instanceof Error)
            captureStackTrace(err, timeGetter);
          throw err;
        }
      },
      set(value) {
        try {
          const self = Object(this ?? window);
          const hasProp = hasOwn(self, 'time');
          if (hasProp) {
            self.time = value;
          } else {
            const desc = {
              value, writable: true,
              enumerable: true, configurable: true
            };
            setPrototypeOf(desc, null);
            defineProperty(self, 'time', desc);
          }
        } catch (err) {
          if (err instanceof Error)
            captureStackTrace(err, timeSetter);
          throw err;
        }
      },
      enumerable: false,
      configurable: true
    }, timeGetter = desc.get, timeSetter = desc.set;
    defineProperty(windowProto, 'time', desc);
  }

  /** @type {(() => void)[]} */
  const updaters = [];

  /**
   * @template {() => number | null | undefined} T
   * @param {T} func
   * @param {object} self
   * @param {object | null} req_self
   * @param {(func: T) => number} offset
   */
  function wrap_now(func, self, offset = () => 0, req_self = null) {
    let baseTime = 0;
    let contTime = baseTime;

    /** @type {ProxyHandler<typeof func>} */
    const handler = {
      apply(target, self, args) {
        if (debug) log('apply(%o, %o, %o)', target, self, args);
        let time = apply(target, self, args);
        // pristine check necessary due to handler.apply(func, self, [])
        if (pristine || !isFinite(time) || (req_self !== null && self !== req_self)) return time;
        return ((time - baseTime) * scale) + contTime;
      }
    };
    setPrototypeOf(handler, null);

    updaters[updaters.length] =
      function update() {
        if (!handler.apply) return;
        contTime = timeJump == null ? handler.apply(func, self, []) : timeJump + offset(func);
        baseTime = apply(func, self, []) ?? baseTime;
        if (timeReset) contTime = baseTime;
      };

    return new Proxy(func, wrapHandler(handler));
  }

  /**
   * @template {object} O
   * @template {keyof O} P
   * @template {(this: O) => Extract<O[P], number | null | undefined>} T
   * @param {O} obj
   * @param {P} prop
   * @param {() => object} getSelf
   * @param {null | ((getter: (...args: unknown[]) => O[P]) => T)} getFunc
   * @param {object | null} req_self
   * @param {(func: T) => number} offset
   */
  function wrap_getter(obj, prop, getSelf, getFunc = null, offset = () => 0, req_self = null) {
    const propDesc = getOwnPropertyDescriptor(obj, prop);
    if (propDesc?.get) {
      const func = getFunc?.(propDesc.get) ?? propDesc.get, real_func = propDesc.get;
      let baseTime = 0;
      let contTime = baseTime;

      /** @type {ProxyHandler<typeof real_func>} */
      const handler = {
        apply(_target, self, args) {
          // cannot show `self`, it results in infinite loop from Chrome Devtools automatically expanding document.timeline
          if (debug) log('apply(%o, self, %o)', func, args);
          let time = apply(func, self, args);
          // pristine check necessary due to handler.apply(func, self, [])
          if (pristine || !isFinite(time) || (req_self !== null && self !== req_self)) return time;
          return ((time - baseTime) * scale) + contTime;
        }
      };
      setPrototypeOf(handler, null);

      updaters[updaters.length] =
        function update() {
          if (!handler.apply) return;
          contTime = timeJump == null ? handler.apply(real_func, getSelf(), []) : timeJump + offset(/** @type {T} */(func));
          baseTime = apply(func, getSelf(), []) ?? baseTime;
          if (timeReset) contTime = baseTime;
        };

      const wrappedGetter = new Proxy(real_func, wrapHandler(handler));

      defineProperty(obj, prop, {
        get: wrappedGetter
      });
      return /** @type {T} */(wrappedGetter);
    }
    return null;
  }

  const DateConstructor = window.Date;
  /** @type {{ realTime: typeof Date.now, now: typeof Date.now, real_perfNow: typeof performance.now, toString: typeof Date.prototype.toString, handler: ProxyHandler<DateConstructor> }} */
  const date = {
    realTime: window.Date.now,
    now: wrap_now(window.Date.now, window.Date),
    real_perfNow: window.performance.now.bind(performance),
    toString: DateConstructor.prototype.toString,
    handler: {
      apply(target, self, args) {
        if (debug) log('apply(%o, %o, %o)', target, self, args);
        return time.toString();
      },
      construct(target, args, newTarget) {
        if (debug) log('construct(%o, %o, %o)', target, args, newTarget);
        if (args.length < 1) {
          args[0] = time.now;
        }
        return construct(DateConstructor, args, newTarget);
      }
    }
  };
  setPrototypeOf(date, null);
  setPrototypeOf(date.handler, null);
  DateConstructor.now = date.now;

  window.Date = new Proxy(DateConstructor, wrapHandler(date.handler));
  window.Date.prototype.constructor = window.Date;

  window.Performance.prototype.now = wrap_now(
    window.Performance.prototype.now,
    window.performance,
    () => date.real_perfNow() - date.realTime(),
    window.performance
  );

  function noop() { }

  /**
   * @param {(handler: TimerHandler, timeout?: number | undefined, ...args: any[]) => number} func
   */
  function wrap_timer(func) {
    /** @type {ProxyHandler<typeof func>} */
    const handler = {
      apply(target, self, args) {
        if (debug) log('apply(%o, %o, %o)', target, self, args);
        if (args.length > 1) {
          args[1] = +args[1];
          if (args[1] && scale === 0)
            args[0] = noop;
          else if (args[1] && isFinite(args[1]))
            args[1] /= scale;
        }
        return apply(target, self, args);
      }
    };
    setPrototypeOf(handler, null);
    return new Proxy(func, wrapHandler(handler));
  }

  window.setTimeout = wrap_timer(window.setTimeout);
  window.setInterval = wrap_timer(window.setInterval);

  const docTimeline = window.document.timeline;
  const wrappedGetAnimTime = wrap_getter(
    window.AnimationTimeline.prototype, 'currentTime', () => docTimeline,
    (func) => function () {
      const time = apply(func, this, arguments);
      if (this !== docTimeline) return time;
      return typeof time === 'number' ? time : null;
    },
    getAnimTime =>
      (apply(getAnimTime, docTimeline, []) ?? date.real_perfNow()) - date.realTime(),
    docTimeline
  );
  if (wrappedGetAnimTime) {
    /** @type {ProxyHandler<typeof requestAnimationFrame>} */
    const handler = {
      apply(target, self, args) {
        if (debug) log('apply(%o, %o, %o)', target, self, args);
        if (typeof args[0] === 'function') {
          const cb = args[0];
          args[0] = function () {
            if (!pristine)
              arguments[0] = apply(wrappedGetAnimTime, docTimeline, []);
            return apply(cb, this, arguments);
          }
        }
        return apply(target, self, args);
      }
    };
    setPrototypeOf(handler, null);
    window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, wrapHandler(handler));
  }
  wrap_getter(
    window.Event.prototype, 'timeStamp', () => new Event(''), null,
    getTimeStamp =>
      (apply(getTimeStamp, new Event(''), []) ?? date.real_perfNow()) - date.realTime()
  );

  /**
   * @param {ProxyHandler<any>} handler
   */
  function wrapHandler(handler) {
    /** @type {ProxyHandler<ProxyHandler<any>>} */
    const internalHandler = {
      get(target, prop) {
        if (pristine) return undefined;
        return Reflect.get(target, prop);
      }
    };
    setPrototypeOf(internalHandler, null);
    return new Proxy(handler, internalHandler);
  }

  time.storage.load();
})(/** @type {typeof window} */(unsafeWindow));
