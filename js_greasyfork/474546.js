// ==UserScript==

// #region Info

// @namespace   https://openuserjs.org/users/93Akkord
// @exclude     *
// @author      Michael Barros (https://openuserjs.org/users/93Akkord)
// @icon        data:image/png;base64,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

// #endregion Info

// ==UserLibrary==

// @name        loglevel
// @description loglevel bundled with loglevel-plugin-prefix
// @copyright   2022+, Michael Barros (https://openuserjs.org/users/93Akkord)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @version     0.0.4

// ==/UserScript==

// ==/UserLibrary==

// ==OpenUserJS==

// @author      93Akkord

// ==/OpenUserJS==

/**
 *
 *
 * @returns {Window}
 */
 function getWindow() {
    return window.GM_info && GM_info.script.grant.includes('unsafeWindow') ? unsafeWindow : window;
}

// #region loglevel

/**
 * Minified by jsDelivr using Terser v5.9.0.
 * Original file: /npm/loglevel@1.8.0/lib/loglevel.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
 !function(e,o){"use strict";"function"==typeof define&&define.amd?define(o):"object"==typeof module&&module.exports?module.exports=o():e.log=o()}(this,(function(){"use strict";var e=function(){},o="undefined",t=typeof window!==o&&typeof window.navigator!==o&&/Trident\/|MSIE /.test(window.navigator.userAgent),n=["trace","debug","info","warn","error"];function l(e,o){var t=e[o];if("function"==typeof t.bind)return t.bind(e);try{return Function.prototype.bind.call(t,e)}catch(o){return function(){return Function.prototype.apply.apply(t,[e,arguments])}}}function i(){console.log&&(console.log.apply?console.log.apply(console,arguments):Function.prototype.apply.apply(console.log,[console,arguments])),console.trace&&console.trace()}function r(n){return"debug"===n&&(n="log"),typeof console!==o&&("trace"===n&&t?i:void 0!==console[n]?l(console,n):void 0!==console.log?l(console,"log"):e)}function c(o,t){for(var l=0;l<n.length;l++){var i=n[l];this[i]=l<o?e:this.methodFactory(i,o,t)}this.log=this.debug}function a(e,t,n){return function(){typeof console!==o&&(c.call(this,t,n),this[e].apply(this,arguments))}}function u(e,o,t){return r(e)||a.apply(this,arguments)}function s(e,t,l){var i,r=this;t=null==t?"WARN":t;var a="loglevel";function s(){var e;if(typeof window!==o&&a){try{e=window.localStorage[a]}catch(e){}if(typeof e===o)try{var t=window.document.cookie,n=t.indexOf(encodeURIComponent(a)+"=");-1!==n&&(e=/^([^;]+)/.exec(t.slice(n))[1])}catch(e){}return void 0===r.levels[e]&&(e=void 0),e}}"string"==typeof e?a+=":"+e:"symbol"==typeof e&&(a=void 0),r.name=e,r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=l||u,r.getLevel=function(){return i},r.setLevel=function(t,l){if("string"==typeof t&&void 0!==r.levels[t.toUpperCase()]&&(t=r.levels[t.toUpperCase()]),!("number"==typeof t&&t>=0&&t<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+t;if(i=t,!1!==l&&function(e){var t=(n[e]||"silent").toUpperCase();if(typeof window!==o&&a){try{return void(window.localStorage[a]=t)}catch(e){}try{window.document.cookie=encodeURIComponent(a)+"="+t+";"}catch(e){}}}(t),c.call(r,t,e),typeof console===o&&t<r.levels.SILENT)return"No console available for logging"},r.setDefaultLevel=function(e){t=e,s()||r.setLevel(e,!1)},r.resetLevel=function(){r.setLevel(t,!1),function(){if(typeof window!==o&&a){try{return void window.localStorage.removeItem(a)}catch(e){}try{window.document.cookie=encodeURIComponent(a)+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC"}catch(e){}}}()},r.enableAll=function(e){r.setLevel(r.levels.TRACE,e)},r.disableAll=function(e){r.setLevel(r.levels.SILENT,e)};var f=s();null==f&&(f=t),r.setLevel(f,!1)}var f=new s,p={};f.getLogger=function(e){if("symbol"!=typeof e&&"string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var o=p[e];return o||(o=p[e]=new s(e,f.getLevel(),f.methodFactory)),o};var d=typeof window!==o?window.log:void 0;return f.noConflict=function(){return typeof window!==o&&window.log===f&&(window.log=d),f},f.getLoggers=function(){return p},f.default=f,f}));
 //# sourceMappingURL=/sm/dbe3b9b5ef3004a41b919a0a34b0105caac42fc07383936e32c9f3d3758f212d.map

// #endregion loglevel

// #region loglevel-plugin-prefix

(function (root, factory) {
    root.prefix = factory(root);
})(this, function (root) {
    let merge = function (target) {
        let i = 1;
        let length = arguments.length;
        let key;

        for (; i < length; i++) {
            for (key in arguments[i]) {
                if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                    target[key] = arguments[i][key];
                }
            }
        }

        return target;
    };

    let defaults = {
        template: '[%t] %l:',
        levelFormatter: function (level) {
            return level.toUpperCase();
        },
        nameFormatter: function (name) {
            return name || 'root';
        },
        timestampFormatter: function (date) {
            return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
        },
        format: undefined,
    };

    let loglevel;
    let configs = {};

    let reg = function (rootLogger) {
        if (!rootLogger || !rootLogger.getLogger) {
            throw new TypeError('Argument is not a root logger');
        }

        loglevel = rootLogger;
    };

    let apply = function (logger, config) {
        if (!logger || !logger.setLevel) {
            throw new TypeError('Argument is not a logger');
        }

        /* eslint-disable vars-on-top */
        let originalFactory = logger.methodFactory;
        let name = logger.name || '';
        let parent = configs[name] || configs[''] || defaults;
        /* eslint-enable vars-on-top */

        function methodFactory(methodName, logLevel, loggerName) {
            let originalMethod = originalFactory(methodName, logLevel, loggerName);
            let options = configs[loggerName] || configs[''];

            let hasTimestamp = options.template.indexOf('%t') !== -1;
            let hasLevel = options.template.indexOf('%l') !== -1;
            let hasName = options.template.indexOf('%n') !== -1;

            return (function () {
                let content = '';

                let length = arguments.length;
                let args = Array(length);
                let key = 0;

                for (; key < length; key++) {
                    args[key] = arguments[key];
                }

                // skip the root method for child loggers to prevent duplicate logic
                if (name || !configs[loggerName]) {
                    /* eslint-disable vars-on-top */
                    let timestamp = options.timestampFormatter(new Date());
                    let level = options.levelFormatter(methodName);
                    let lname = options.nameFormatter(loggerName);
                    /* eslint-enable vars-on-top */

                    if (options.format) {
                        content += options.format(level, lname, timestamp);
                    } else {
                        content += options.template;

                        if (hasTimestamp) {
                            content = content.replace(/%t/, timestamp);
                        }

                        if (hasLevel) content = content.replace(/%l/, level);
                        if (hasName) content = content.replace(/%n/, lname);
                    }

                    if (args.length && typeof args[0] === 'string') {
                        // concat prefix with first argument to support string substitutions
                        args[0] = content + ' ' + args[0];
                    } else {
                        args.unshift(content);
                    }
                }

                return getWindow().console[methodName].bind(getWindow().console, ...args);

                // originalMethod.apply(undefined, args);
            })();
        }

        if (!configs[name]) {
            logger.methodFactory = methodFactory;
        }

        // for remove inherited format option if template option preset
        config = config || {};

        if (config.template) config.format = undefined;

        configs[name] = merge({}, parent, config);

        logger.setLevel(logger.getLevel());

        if (!loglevel) {
            logger.warn('It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md');
        }

        return logger;
    };

    let api = {
        reg: reg,
        apply: apply,
    };

    let save;

    if (root) {
        save = root.prefix;

        api.noConflict = function () {
            if (root.prefix === api) {
                root.prefix = save;
            }
            return api;
        };
    }

    return api;
});

// #endregion loglevel-plugin-prefix

// #region chalk

// http-url:https://unpkg.com/chalk@5.2.0/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// http-url:https://unpkg.com/chalk@5.2.0/source/vendor/supports-color/browser.js
var level = (() => {
  if (navigator.userAgentData) {
    const brand = navigator.userAgentData.brands.find(({ brand: brand2 }) => brand2 === "Chromium");
    if (brand && brand.version > 93) {
      return 3;
    }
  }
  if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
    return 1;
  }
  return 0;
})();
var colorSupport = level !== 0 && {
  level,
  hasBasic: true,
  has256: level >= 2,
  has16m: level >= 3
};
var supportsColor = {
  stdout: colorSupport,
  stderr: colorSupport
};
var browser_default = supportsColor;

// http-url:https://unpkg.com/chalk@5.2.0/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// http-url:https://unpkg.com/chalk@5.2.0/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = browser_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var Chalk = class {
  constructor(options) {
    return chalkFactory(options);
  }
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level2, type, ...arguments_) => {
  if (model === "rgb") {
    if (level2 === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level2 === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level2, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level2) {
      this[GENERATOR].level = level2;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// /input.tsx
function getWindow() {
  return globalThis.GM_info && GM_info.script.grant.includes("unsafeWindow") ? unsafeWindow : globalThis;
}
getWindow().chalk = source_default;

// #endregion chalk

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} name
 * @param {{logLevel: log.LogLevelDesc, tag: string}} logLevel
 * @return {log.Logger}
 */
 function getLogger(name, { logLevel, tag }) {
    prefix.reg(log);

    const colors = {
        TRACE: '220;86;220',
        DEBUG: '86;86;220',
        INFO: '134;134;221',
        WARN: '220;220;86',
        ERROR: '220;86;86',
    };

    /** @type {prefix.LoglevelPluginPrefixOptions} */
    let options = {
        levelFormatter: function (level) {
            return level.toUpperCase();
        },
        nameFormatter: function (name) {
            return name || 'root';
        },
        timestampFormatter: function (date) {
            return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
        },
        format: function (level, name, timestamp) {
            let _timestamp = `\x1B[90m[${timestamp}]\x1B[m`;
            let _level = `\x1B[38;2;${colors[level.toUpperCase()]}m${level.toUpperCase()}\x1B[m`;
            let _name = `\x1B[38;2;38;177;38m${tag ? `[${tag}-` : '['}${name}]\x1B[m`;
    
            let _format = `${_timestamp} ${_level} ${_name}:`;
    
            return _format;
        },
    };

    const logger = log.getLogger(name);

    prefix.apply(logger, options);

    logger.setLevel(logLevel || 'WARN');

    return logger;
}
