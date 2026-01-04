// ==UserScript==
// @name         CF Hide Test Number
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hide “on test X” suffix in Codeforces verdicts
// @author       SanguineChameleon
// @match        https://codeforces.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538114/CF%20Hide%20Test%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/538114/CF%20Hide%20Test%20Number.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
span[class='verdict-format-judged'] {
    display: none !important;
}
td[class^='time-consumed-cell'] {
    font-size: 0px !important;
}
td[class^='memory-consumed-cell'] {
    font-size: 0px !important;
}
`)
})();

(function() {
    'use strict';

    const css = `
.verdict-format-judged,
.diagnosticsHint {
  display: none !important;
}`;
    if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
    } else {
        const s = document.createElement('style');
        s.textContent = css;
        (document.head || document.documentElement).appendChild(s);
    }

    const pluckRE = / on (pre)?test ?\d*$/;
    function pluck(s) {
        return s.replace(pluckRE, '');
    }

    const CF = (unsafeWindow || window).Codeforces;
    if (CF && CF.showMessage) {
        const _old = CF.showMessage;
        CF.showMessage = msg => _old(pluck(msg));
    }

    function stripNode(el) {
        try {
            const txt = el.childNodes[0];
            txt.nodeValue = pluck(txt.nodeValue);
        } catch {}
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.verdict-rejected span, .verdict-waiting span')
                .forEach(stripNode);

        const catcher = (unsafeWindow || window).submissionsEventCatcher;
        if (catcher && catcher.subscribe) {
            const channel = catcher.channels[0];
            catcher.subscribe(channel, data => {
                if (data.t === 's') {
                    const sel = `[data-a='${data.d[0]}'] .status-verdict-cell span`;
                    const el = document.querySelector(sel);
                    if (el) stripNode(el);
                }
            });
        }
    });
})();



(function () {
  'use strict';

  // 🛑 Prevent any “on test X” span from ever showing
  const earlyHideCSS = ".verdict-format-judged, .diagnosticsHint { display: none !important; }";
  if (typeof GM_addStyle === 'function') {
    GM_addStyle(earlyHideCSS);
  } else {
    const s = document.createElement('style');
    s.textContent = earlyHideCSS;
    (document.head || document.documentElement).appendChild(s);
  }

  const env = {"NODE_ENV":"production","VERSION":"2.4.0","TARGET":"userscript"};

  /**
   * @file Utilities to manipulate the DOM
   */
  function isEvent(str) {
    return str.length > 2 && str[0] == 'o' && str[1] == 'n' && str[2] >= 'A' && str[2] <= 'Z';
  }

  var dom = {
    $(query, element) {
      return (element || document).querySelector(query);
    },

    $$(query, element) {
      return (element || document).querySelectorAll(query);
    },

    on(element, event, handler, options) {
      element.addEventListener(event, handler, options || {});
    },

    /**
     * Works like React.createElement
     * Doesn't support a set of features, but should work for most purposes
     */
    element(tag, props, ...children) {
      let el;

      if (typeof tag === 'string') {
        el = document.createElement(tag);
        Object.assign(el, props); // Some properties like data-* and onClick won't do anything here...

        if (props) {
          // ...so we have to consider them here
          for (let key in props) {
            if (key.startsWith('data-') || key == 'for') el.setAttribute(key, props[key]);else if (isEvent(key)) el.addEventListener(key.substr(2).toLowerCase(), props[key]);
          }
        }
      } else if (typeof tag === 'function') {
        el = tag(props);
      }

      for (let c of children) {
        if (typeof c === 'string') {
          el.appendChild(document.createTextNode(c));
        } else if (c instanceof Array) {
          el.append(...c);
        } else if (c) {
          el.appendChild(c);
        }
      }

      return el;
    },

    fragment(...children) {
      let frag = document.createDocumentFragment();

      for (let c of children) {
        if (typeof c === 'string') {
          frag.appendChild(document.createTextNode(c));
        } else if (c instanceof Array) {
          for (let cc of c) frag.appendChild(cc);
        } else if (c) {
          frag.appendChild(c);
        }
      }

      return frag;
    },

    isEditable(element) {
      const unselectable = ["button", "checkbox", "color", "file", "hidden", "image", "radio", "reset", "submit"];
      const isEditableInput = element.tagName == "INPUT" && unselectable.indexOf(element.type) == -1;
      const isTextarea = element.tagName == "TEXTAREA";
      const isSelect = element.tagName == "SELECT";
      return isEditableInput || isTextarea || isSelect || element.isContentEditable;
    }

  };

  /**
   * The same as Ramda's tryCatch:
   * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
   * function evaluates the `tryer`; if it does not throw, it simply returns the
   * result. If the `tryer` *does* throw, the returned function evaluates the
   * `catcher` function and returns its result. Note that for effective
   * composition with this function, both the `tryer` and `catcher` functions
   * must return the same type of results.
   *
   * @param {Function} tryer The function that may throw.
   * @param {Function} catcher The function that will be evaluated if `tryer` throws.
   * @return {Function} A new function that will catch exceptions and send then to the catcher.
   */

  function tryCatch(tryer, catcher) {
    return (...args) => {
      try {
        return tryer(...args);
      } catch (err) {
        return catcher(err);
      }
    };
  }
  /**
   * Returns a new function that, when called, will try to call `fn`.
   * If `fn` throws, `def` will be returned instead
   * @param {Function} fn The function to try executing
   * @param {any} def The default value to return if `fn` throws
   * @return {Function}
   */

  function safe(fn, def) {
    return (...args) => {
      try {
        return fn(...args);
      } catch {
        return def;
      }
    };
  }
  /**
   * Takes a list of functions and returns a function that executes them in
   * left-to-right order, passing the return value of one to the next
   * @param {[Function]} fns The functions to be piped
   * @return {Function} The piped composition of the input functions
   */

  const pipe = (...fns) => arg => fns.reduce((acc, f) => f(acc), arg);
  /**
   * Curried version of Array.prototype.map
   */

  const map = fn => arr => [].map.call(arr, fn);
  /**
   * Curried version of Array.prototype.forEach
   */

  const forEach = fn => arr => [].forEach.call(arr, fn);
  /**
   * Flattens one level of a list
   * @param {[[a]]} list
   * @return {[a]}
   */

  function flatten(list) {
    const len = xs => xs && typeof xs.length === 'number' ? xs.length : 1;

    const n = list.reduce((acc, xs) => acc + len(xs), 0);
    let res = new Array(n);
    let p = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].length >= 0) {
        for (let j = 0; j < list[i].length; j++) res[p++] = list[i][j];
      } else {
        res[p++] = list[i];
      }
    }

    return res;
  }
  function once(fn) {
    let result,
        ran = false;
    return function (...args) {
      if (!ran) {
        ran = true;
        result = fn(...args);
      }

      return result;
    };
  }
  const capitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase();
  const nop = function () {};
  /**
   * Formats a keyboard event to a shortcut string
   * It's in Functional.js because putting it in shortcuts.js created a circular dependency, and I don't like warnings in my builds
   * @param {KeyboardEvent} event
   * @returns {String} a formatted shortcut string from the event, like "Ctrl+Shift+P"
   */

  function formatShortcut(event) {
    let res = "";
    if (event.metaKey) res += 'Meta+';
    if (event.ctrlKey) res += 'Ctrl+';
    if (event.altKey) res += 'Alt+';
    if (event.shiftKey) res += 'Shift+';
    res += event.key == ' ' ? 'Space' : capitalize(event.key);
    return res;
  }
  /**
   * Returns a debounced function that fires no more than once in a `delay` ms period
   * @param {Function} fn the function to debounce
   * @param {Number} delay the delay in milliseconds
   */

  function debounce(fn, delay) {
    let timeout;
    return function debounced(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = undefined;
        fn(...args);
      }, delay);
    };
  }
  async function profile(fn) {
    return fn();
  }

  /**
   * @file Minimalistic event-bus
   */
  let listeners = {};
  function listen(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }
  async function fire(event, data) {
    const results = (listeners[event] || []).map(async cb => cb(data));
    return Promise.all(results);
  }

  const version = env.VERSION;
  /**
   * Decorates a function so, when called, it only runs when the DOM has loaded
   * @example
   * let write_sum = ready((x, y) => document.write(x + y));
   * write_sum(1, 2); // only writes when the DOM has loaded
   * @type (...a -> b) -> ...a -> Promise<b>
   */

  const ready = fn => (...args) => {
    if (document.readyState == 'complete') {
      return Promise.resolve(fn(...args));
    }

    return new Promise(res => document.addEventListener('DOMContentLoaded', () => res(fn(...args)), {
      once: true
    }));
  };
  /**
   * @type Function -> Promise
   */

  const run_when_ready = fn => ready(fn)();
  const userHandle = once(ready(function () {
    const handle = dom.$('.lang-chooser').children[1].children[0].innerText.trim();
    return handle == 'Enter' ? 'tourist' : handle;
  }));

  var shared = /*#__PURE__*/Object.freeze({
      __proto__: null,
      version: version,
      ready: ready,
      run_when_ready: run_when_ready,
      userHandle: userHandle
  });

  const global =  typeof unsafeWindow !== 'undefined' && unsafeWindow;
  const storage = {
    get: key => Promise.resolve(localStorage.getItem(key)).then(safe(JSON.parse, {})),
    set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value))),
    propagate: async function () {}
  };

  var userscript = /*#__PURE__*/Object.freeze({
      __proto__: null,
      global: global,
      storage: storage
  });

  let env$1 = {};

  {
    env$1 = { ...shared,
      ...userscript
    };
  }

  var env$2 = env$1;

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function prop(title, type, id, data) {
    return {
      title,
      type,
      id,
      data
    };
  }
  let configProps = [
      prop('Hide "on test X" in verdicts', 'toggle', 'hideTestNumber'),
  ];
  function scProp(title, id) {
    return {
      title,
      id
    };
  }
  let shortcutProps = [
      scProp('Hide Test Number', 'hideTestNumber')
  ];

  const Toggle = ({
    config,
    id,
    pushChange,
    pullChange
  }) => {
    let checkbox = dom.element("input", {
      id: id,
      checked: config[id],
      type: "checkbox",
      onChange: e => pushChange(id, e.target.checked)
    });
    pullChange(id, value => checkbox.checked = value);
    return dom.element(dom.fragment, null, checkbox, dom.element("span", null));
  };

  function Prop({
    title,
    type,
    id,
    data,
    config,
    pushChange,
    pullChange
  }) {
    let props = {
      config,
      id,
      pushChange,
      pullChange
    };
    const table = {
      toggle: () => dom.element(Toggle, props)
    };
    let el = table[type]();
    return dom.element("label", {
      className: type,
      for: id
    }, title, el);
  }

  function Shortcut({
    title,
    id,
    shortcuts,
    pushChange
  }) {
    const pushDebounced = debounce(pushChange, 250);

    function handleKeyDown(e) {
      e.preventDefault();
      let sc = formatShortcut(e);
      if (sc != 'Escape') {
        e.target.value = sc;
        pushDebounced(id, sc);
      }
    }

    return dom.element("label", {
      className: "shortcut",
      for: `sc-${id}`
    }, title, dom.element("input", {
      id: `sc-${id}`,
      value: shortcuts[id],
      type: "text",
      onKeyDown: handleKeyDown
    }));
  }

  function Config({
    config,
    pushChange = nop,
    pullChange = nop
  }) {
    return configProps.map(p => dom.element(Prop, _extends({}, p, {
      config: config,
      pushChange: pushChange,
      pullChange: pullChange
    })));
  }
  function Shortcuts({
    shortcuts,
    pushChange = nop
  }) {
    return shortcutProps.map(p => dom.element(Shortcut, _extends({}, p, {
      shortcuts: shortcuts,
      pushChange: pushChange
    })));
  }

  let config = {};
  function save() {
    localStorage.cfpp = JSON.stringify(config);
  }
  function commit(id) {
    fire(id, config[id]);
    save();
  }
  const get = key => config[key];
  function set(key, value) {
    if (config[key] == value) return;
    config[key] = value;
    commit(key);
  }
  const toggle = key => set(key, !config[key]);
  const defaultConfig = {
    hideTestNumber: false,
    shortcuts: {
      hideTestNumber: "Ctrl+Shift+H"
    }
  };
  function load() {
    config = safe(JSON.parse, {})(localStorage.cfpp);
    config = Object.assign({}, defaultConfig, config);
    {
      save();
    }
    listen('request config change', ({
      id,
      value
    }) => {
      config[id] = value;
      fire(id, value);
    });
  }

  const createUI =  env$2.ready(function () {
    if (!dom.$('.lang-chooser')) return;

    function pushShortcut(id, value) {
      config.shortcuts[id] = value;
      commit('shortcuts');
    }

    let modal = dom.element("div", {
      className: "cfpp-config cfpp-modal cfpp-hidden"
    }, dom.element("div", {
      className: "cfpp-modal-background",
      onClick: closeUI
    }), dom.element("div", {
      className: "cfpp-modal-inner"
    }, dom.element(Config, {
      config: config,
      pushChange: set,
      pullChange: listen
    }), dom.element("span", {
      className: "hr"
    }), dom.element(Shortcuts, {
      shortcuts: config.shortcuts,
      pushChange: pushShortcut
    })));

    let modalBtn = dom.element("a", {
      className: "cfpp-config-btn"
    }, "[++]");
    dom.on(modalBtn, 'click', ev => {
      ev.preventDefault();
      modal.classList.remove('cfpp-hidden');
    });
    dom.on(document, 'keyup', keyupEvent => {
      if (keyupEvent.key == 'Escape') closeUI();
    });

    document.body.appendChild(modal);
    dom.$('.lang-chooser').children[0].prepend(modalBtn);
  });
  function closeUI() {
    dom.$('.cfpp-config').classList.add('cfpp-hidden');
    save();
  }

  var commonCSS = "@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}.cfpp-hidden{display:none;}.cfpp-config-btn{font-size:22px!important;cursor:pointer;}.cfpp-config>.cfpp-modal-inner{width:auto; min-width: 300px;}.cfpp-modal{box-sizing:border-box;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:101;}.cfpp-modal-background{position:absolute;top:0;left:0;width:100vw;height:100vh;background:#00000087;animation:fadeIn 0.15s forwards;}.cfpp-modal-inner>label{position:relative;margin-bottom:0.5em;display:flex;flex-direction:row;justify-content:space-between;user-select:none;}.cfpp-modal-inner input[type=text]{width:32%;} .cfpp-modal-inner input[type=checkbox]{visibility:hidden;}.cfpp-modal-inner .toggle>span{position:absolute;width:1.4rem;height:1.4rem;top:calc(50% - 0.7rem);right:0;display:inline-block;border:thin solid #188ecd;border-radius:100%;background:#eee;transition:background 0.2s;}.cfpp-modal-inner .toggle>input:checked + span{background:#188ecd;}.cfpp-modal-inner .toggle>span:before{content:\"✓\";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#eee;font-size:0.8em;}.cfpp-modal-inner{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:auto;min-width:350px;max-height:80vh;background:white;padding:2em;border-radius:6px;overflow:auto;animation:fadeIn 0.15s forwards;}.hr{display:block;border-top:1px solid #7f7f7f52;width:calc(100% + 4em);margin:.5em -2em;}.verdict-hide-number .verdict-format-judged,.verdict-hide-number .diagnosticsHint{display:none!important;}";

  async function injectStyle(css) {
    let style = dom.element("style", {
      className: "cfpp-style"
    }, css);
    (document.body || document.head || document.documentElement).appendChild(style);
    return style;
  }
  const addStyle = typeof GM_addStyle === 'function' ? GM_addStyle : injectStyle;

  async function applyCommonStyles() {
    addStyle(commonCSS);
  }

  const pluckVerdictRegex = / on (pre)?test ?\d*$/;
  const pluckVerdict = s => s.replace(pluckVerdictRegex, '');
  const pluckVerdictOnNode = safe(n => {
    let c = n.childNodes[0];
    c.nodeValue = pluckVerdict(c.nodeValue);
  }, '');
  let ready$1 = false;
  function init() {
    if (ready$1) return;
    ready$1 = true;
    let _showMessage = env$2.global.Codeforces.showMessage;
    env$2.global.Codeforces.showMessage = function (message) {
      if (get('hideTestNumber')) {
        message = pluckVerdict(message);
      }
      _showMessage(message);
    };
    if (env$2.global.submissionsEventCatcher) {
      const channel = env$2.global.submissionsEventCatcher.channels[0];
      env$2.global.submissionsEventCatcher.subscribe(channel, data => {
        if (!get('hideTestNumber')) return;
        if (data.t === 's') {
          const el = dom.$(`[data-a='${data.d[0]}'] .status-verdict-cell span`);
          pluckVerdictOnNode(el);
        }
      });
    }
  }
  const install$a = env$2.ready(function () {
    if (!get('hideTestNumber')) return;
    init();
    document.documentElement.classList.add('verdict-hide-number');
    dom.$$('.verdict-rejected,.verdict-waiting').forEach(pluckVerdictOnNode);
  });
  function uninstall$7() {
    if (!document.documentElement.classList.contains('verdict-hide-number')) return;
    document.documentElement.classList.remove('verdict-hide-number');
    dom.$$('.verdict-rejected,.verdict-waiting').forEach(e => {
      // This might not perfectly restore the original text if it was complex,
      // but attempts to add back a generic "on test"
      // if (e.childNodes[0] && !e.childNodes[0].nodeValue.includes('on test')) {
      //      e.childNodes[0].nodeValue += ' on test ';
      // }
    });
  }

  var verdict_test_number = /*#__PURE__*/Object.freeze({
      __proto__: null,
      init: init,
      install: install$a,
      uninstall: uninstall$7
  });

  function install$b() {
    const id2Fn = {
      hideTestNumber: () => toggle('hideTestNumber')
    };
    let id2Shortcut = get('shortcuts');
    function convert(i2s, i2f) {
      let s2f = {};
      for (let id in i2s) {
        let shortcut = i2s[id].toLowerCase();
        let fn = i2f[id];
        s2f[shortcut] = fn;
      }
      return s2f;
    }
    let shortcut2Fn = convert(id2Shortcut, id2Fn);
    listen('shortcuts', newId2Shortcut => shortcut2Fn = convert(newId2Shortcut, id2Fn));
    dom.on(document, 'keydown', e => {
      if (dom.isEditable(document.activeElement)) return;
      let sc = formatShortcut(e).toLowerCase();
      const fn = shortcut2Fn[sc];
      if (fn) {
        e.preventDefault();
        e.stopPropagation();
        fn();
      }
    });
  }

  var shortcuts = /*#__PURE__*/Object.freeze({
      __proto__: null,
      install: install$b
  });

  profile(run);

  async function run() {
    console.log("Codeforces++ (Hide Test Number Only) is running!");
    load();
    createUI();

    let modules = [
      [verdict_test_number, 'hideTestNumber'],
      [shortcuts, 'shortcuts'], // 'shortcuts' is the config key for the shortcuts object
    ];

    let moduleNames = ['verdict_test_number', 'shortcuts'];

    function registerConfigCallback(m, id) {
      listen(id, value => {
        // For 'hideTestNumber' (boolean)
        if (id === 'hideTestNumber') {
          if (value === true || value === false) {
              value ? m.install() : (m.uninstall || nop)();
          } else { // Should not happen for a boolean toggle
              (m.uninstall || nop)();
               m.install(value);
          }
        } else if (id === 'shortcuts') { // For shortcuts object
          (m.uninstall || nop)(); // uninstall might not be needed or defined for shortcuts
          m.install(value); // shortcuts.install handles the new shortcut values
        }
      });
    }

    modules.forEach(([m, configID], index) => {
      tryCatch(m.install, e => console.log(`Error installing module #${moduleNames[index]}:`, e))();
      if (configID) {
        registerConfigCallback(m, configID);
      }
    });

    applyCommonStyles();

    env$2.run_when_ready(function () {
      const v = get('version');
      if (v != env$2.version) {
        set('version', env$2.version);
        env$2.global.Codeforces.showMessage(`Codeforces++ (Hide Test Number Only) was updated to version ${env$2.version}!`);
      }
    });
  }
}());