// ==UserScript==
// @name     NicoNico manga download
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description save loaded manga as html.
// @grant    none
// @include	 https://seiga.nicovideo.jp/watch/*
// @run-at   document-idle
// @version   2023.12.05+6fe81875
// @downloadURL https://update.greasyfork.org/scripts/436220/NicoNico%20manga%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/436220/NicoNico%20manga%20download.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/utils/urlLastPart.ts
  function urlLastPart(url) {
    return url.split("/").filter((i) => i).slice(-1)[0];
  }

  // src/utils/downloadFile.ts
  function downloadFile(file, filename = `${urlLastPart(location.pathname)} ${document.title}.md`) {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(file);
    anchor.download = filename;
    anchor.style["display"] = "none";
    document.body.append(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(anchor.href);
    }, 0);
  }

  // src/utils/sleep.ts
  function sleep(duration) {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        setTimeout(resolve, duration);
      });
    });
  }

  // src/niconico.jp/manga-reader.html
  var manga_reader_default = '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>{{ title }}</title>\n    <style>\n      {{{style}}}\n    </style>\n  </head>\n  <body>\n    <div class="container m-auto">\n      <h1 class="text-lg font-bold text-center">{{ title }}</h1>\n      <a\n        class="block text-center text-blue-400 underline"\n        href="{{ window.location.href }}"\n        >{{ window.location.href }}</a\n      >\n      <div class="sm:space-y-2 md:space-y-4">\n        {{#images}}\n        <img\n          class="block m-auto border"\n          src="{{src}}"\n          alt="{{alt}}"\n          title="{{title}}"\n        />\n        {{/images}}\n      </div>\n    </div>\n  </body>\n</html>\n';

  // node_modules/.pnpm/mustache@4.2.0/node_modules/mustache/mustache.mjs
  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill(object) {
    return objectToString.call(object) === "[object Array]";
  };
  function isFunction(object) {
    return typeof object === "function";
  }
  function typeStr(obj) {
    return isArray(obj) ? "array" : typeof obj;
  }
  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }
  function hasProperty(obj, propName) {
    return obj != null && typeof obj === "object" && propName in obj;
  }
  function primitiveHasOwnProperty(primitive, propName) {
    return primitive != null && typeof primitive !== "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
  }
  var regExpTest = RegExp.prototype.test;
  function testRegExp(re, string) {
    return regExpTest.call(re, string);
  }
  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;"
  };
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }
  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;
  function parseTemplate(template, tags) {
    if (!template)
      return [];
    var lineHasNonSpace = false;
    var sections = [];
    var tokens = [];
    var spaces = [];
    var hasTag = false;
    var nonSpace = false;
    var indentation = "";
    var tagIndex = 0;
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }
      hasTag = false;
      nonSpace = false;
    }
    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tagsToCompile) {
      if (typeof tagsToCompile === "string")
        tagsToCompile = tagsToCompile.split(spaceRe, 2);
      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error("Invalid tags: " + tagsToCompile);
      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
      closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]));
    }
    compileTags(tags || mustache.tags);
    var scanner = new Scanner(template);
    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;
      value = scanner.scanUntil(openingTagRe);
      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);
          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += " ";
          }
          tokens.push(["text", chr, start, start + 1]);
          start += 1;
          if (chr === "\n") {
            stripSpace();
            indentation = "";
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }
      if (!scanner.scan(openingTagRe))
        break;
      hasTag = true;
      type = scanner.scan(tagRe) || "name";
      scanner.scan(whiteRe);
      if (type === "=") {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === "{") {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = "&";
      } else {
        value = scanner.scanUntil(closingTagRe);
      }
      if (!scanner.scan(closingTagRe))
        throw new Error("Unclosed tag at " + scanner.pos);
      if (type == ">") {
        token = [type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace];
      } else {
        token = [type, value, start, scanner.pos];
      }
      tagIndex++;
      tokens.push(token);
      if (type === "#" || type === "^") {
        sections.push(token);
      } else if (type === "/") {
        openSection = sections.pop();
        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);
        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === "name" || type === "{" || type === "&") {
        nonSpace = true;
      } else if (type === "=") {
        compileTags(value);
      }
    }
    stripSpace();
    openSection = sections.pop();
    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
    return nestTokens(squashTokens(tokens));
  }
  function squashTokens(tokens) {
    var squashedTokens = [];
    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];
      if (token) {
        if (token[0] === "text" && lastToken && lastToken[0] === "text") {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }
    return squashedTokens;
  }
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];
    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];
      switch (token[0]) {
        case "#":
        case "^":
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case "/":
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }
    return nestedTokens;
  }
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }
  Scanner.prototype.eos = function eos() {
    return this.tail === "";
  };
  Scanner.prototype.scan = function scan(re) {
    var match = this.tail.match(re);
    if (!match || match.index !== 0)
      return "";
    var string = match[0];
    this.tail = this.tail.substring(string.length);
    this.pos += string.length;
    return string;
  };
  Scanner.prototype.scanUntil = function scanUntil(re) {
    var index = this.tail.search(re), match;
    switch (index) {
      case -1:
        match = this.tail;
        this.tail = "";
        break;
      case 0:
        match = "";
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }
    this.pos += match.length;
    return match;
  };
  function Context(view, parentContext) {
    this.view = view;
    this.cache = { ".": this.view };
    this.parent = parentContext;
  }
  Context.prototype.push = function push(view) {
    return new Context(view, this);
  };
  Context.prototype.lookup = function lookup(name) {
    var cache = this.cache;
    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, intermediateValue, names, index, lookupHit = false;
      while (context) {
        if (name.indexOf(".") > 0) {
          intermediateValue = context.view;
          names = name.split(".");
          index = 0;
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index]);
            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }
        if (lookupHit) {
          value = intermediateValue;
          break;
        }
        context = context.parent;
      }
      cache[name] = value;
    }
    if (isFunction(value))
      value = value.call(this.view);
    return value;
  };
  function Writer() {
    this.templateCache = {
      _cache: {},
      set: function set(key, value) {
        this._cache[key] = value;
      },
      get: function get(key) {
        return this._cache[key];
      },
      clear: function clear() {
        this._cache = {};
      }
    };
  }
  Writer.prototype.clearCache = function clearCache() {
    if (typeof this.templateCache !== "undefined") {
      this.templateCache.clear();
    }
  };
  Writer.prototype.parse = function parse(template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ":" + (tags || mustache.tags).join(":");
    var isCacheEnabled = typeof cache !== "undefined";
    var tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
    if (tokens == void 0) {
      tokens = parseTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };
  Writer.prototype.render = function render(template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = view instanceof Context ? view : new Context(view, void 0);
    return this.renderTokens(tokens, context, partials, template, config);
  };
  Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate, config) {
    var buffer = "";
    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = void 0;
      token = tokens[i];
      symbol = token[0];
      if (symbol === "#")
        value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === "^")
        value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === ">")
        value = this.renderPartial(token, context, partials, config);
      else if (symbol === "&")
        value = this.unescapedValue(token, context);
      else if (symbol === "name")
        value = this.escapedValue(token, context, config);
      else if (symbol === "text")
        value = this.rawValue(token);
      if (value !== void 0)
        buffer += value;
    }
    return buffer;
  };
  Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate, config) {
    var self = this;
    var buffer = "";
    var value = context.lookup(token[1]);
    function subRender(template) {
      return self.render(template, context, partials, config);
    }
    if (!value)
      return;
    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
      }
    } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== "string")
        throw new Error("Cannot use higher-order sections without the original template");
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    }
    return buffer;
  };
  Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate, config) {
    var value = context.lookup(token[1]);
    if (!value || isArray(value) && value.length === 0)
      return this.renderTokens(token[4], context, partials, originalTemplate, config);
  };
  Writer.prototype.indentPartial = function indentPartial(partial, indentation, lineHasNonSpace) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, "");
    var partialByNl = partial.split("\n");
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join("\n");
  };
  Writer.prototype.renderPartial = function renderPartial(token, context, partials, config) {
    if (!partials)
      return;
    var tags = this.getConfigTags(config);
    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];
      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  };
  Writer.prototype.unescapedValue = function unescapedValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };
  Writer.prototype.escapedValue = function escapedValue(token, context, config) {
    var escape = this.getConfigEscape(config) || mustache.escape;
    var value = context.lookup(token[1]);
    if (value != null)
      return typeof value === "number" && escape === mustache.escape ? String(value) : escape(value);
  };
  Writer.prototype.rawValue = function rawValue(token) {
    return token[1];
  };
  Writer.prototype.getConfigTags = function getConfigTags(config) {
    if (isArray(config)) {
      return config;
    } else if (config && typeof config === "object") {
      return config.tags;
    } else {
      return void 0;
    }
  };
  Writer.prototype.getConfigEscape = function getConfigEscape(config) {
    if (config && typeof config === "object" && !isArray(config)) {
      return config.escape;
    } else {
      return void 0;
    }
  };
  var mustache = {
    name: "mustache.js",
    version: "4.2.0",
    tags: ["{{", "}}"],
    clearCache: void 0,
    escape: void 0,
    parse: void 0,
    render: void 0,
    Scanner: void 0,
    Context: void 0,
    Writer: void 0,
    /**
     * Allows a user to override the default caching strategy, by providing an
     * object with set, get and clear methods. This can also be used to disable
     * the cache by setting it to the literal `undefined`.
     */
    set templateCache(cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache() {
      return defaultWriter.templateCache;
    }
  };
  var defaultWriter = new Writer();
  mustache.clearCache = function clearCache2() {
    return defaultWriter.clearCache();
  };
  mustache.parse = function parse2(template, tags) {
    return defaultWriter.parse(template, tags);
  };
  mustache.render = function render2(template, view, partials, config) {
    if (typeof template !== "string") {
      throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)');
    }
    return defaultWriter.render(template, view, partials, config);
  };
  mustache.escape = escapeHtml;
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;
  var mustache_default = mustache;

  // src/niconico.jp/style.css
  var style_default = "/*! tailwindcss v2.2.19 | MIT License | https://tailwindcss.com*/ /*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\nhtml {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n}\nbody {\n  margin: 0;\n  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,\n    sans-serif, Apple Color Emoji, Segoe UI Emoji;\n}\nhr {\n  height: 0;\n  color: inherit;\n}\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n  text-decoration: underline dotted;\n}\nb,\nstrong {\n  font-weight: bolder;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo,\n    monospace;\n  font-size: 1em;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: initial;\n}\nsub {\n  bottom: -0.25em;\n}\nsup {\n  top: -0.5em;\n}\ntable {\n  text-indent: 0;\n  border-color: inherit;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: 100%;\n  line-height: 1.15;\n  margin: 0;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nbutton {\n  -webkit-appearance: button;\n}\n::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\nlegend {\n  padding: 0;\n}\nprogress {\n  vertical-align: initial;\n}\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  font: inherit;\n}\nsummary {\n  display: list-item;\n}\nblockquote,\ndd,\ndl,\nfigure,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\npre {\n  margin: 0;\n}\nbutton {\n  background-color: initial;\n  background-image: none;\n}\nfieldset,\nol,\nul {\n  margin: 0;\n  padding: 0;\n}\nol,\nul {\n  list-style: none;\n}\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,\n    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,\n    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;\n  line-height: 1.5;\n}\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n*,\n:after,\n:before {\n  box-sizing: border-box;\n  border: 0 solid;\n}\nhr {\n  border-top-width: 1px;\n}\nimg {\n  border-style: solid;\n}\ntextarea {\n  resize: vertical;\n}\ninput::-moz-placeholder,\ntextarea::-moz-placeholder {\n  opacity: 1;\n  color: #9ca3af;\n}\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1;\n  color: #9ca3af;\n}\nbutton {\n  cursor: pointer;\n}\ntable {\n  border-collapse: collapse;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\na {\n  color: inherit;\n  text-decoration: inherit;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\ncode,\nkbd,\npre,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,\n    Liberation Mono, Courier New, monospace;\n}\naudio,\ncanvas,\nembed,\niframe,\nimg,\nobject,\nsvg,\nvideo {\n  display: block;\n  vertical-align: middle;\n}\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n*,\n:after,\n:before {\n  --tw-border-opacity: 1;\n  border-color: rgba(229, 231, 235, var(--tw-border-opacity));\n}\n.container {\n  width: 100%;\n}\n@media (min-width: 640px) {\n  .container {\n    max-width: 640px;\n  }\n}\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n  }\n}\n@media (min-width: 1024px) {\n  .container {\n    max-width: 1024px;\n  }\n}\n@media (min-width: 1280px) {\n  .container {\n    max-width: 1280px;\n  }\n}\n@media (min-width: 1536px) {\n  .container {\n    max-width: 1536px;\n  }\n}\n.m-auto {\n  margin: auto;\n}\n.block {\n  display: block;\n}\n.table {\n  display: table;\n}\n@keyframes spin {\n  to {\n    transform: rotate(1turn);\n  }\n}\n@keyframes ping {\n  75%,\n  to {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n@keyframes pulse {\n  50% {\n    opacity: 0.5;\n  }\n}\n@keyframes bounce {\n  0%,\n  to {\n    transform: translateY(-25%);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  50% {\n    transform: none;\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n}\n.border {\n  border-width: 1px;\n}\n.text-center {\n  text-align: center;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-blue-400 {\n  --tw-text-opacity: 1;\n  color: rgba(96, 165, 250, var(--tw-text-opacity));\n}\n.underline {\n  text-decoration: underline;\n}\n*,\n:after,\n:before {\n  --tw-shadow: 0 0 #0000;\n  --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n}\n@media (min-width: 640px) {\n  .sm\\:space-y-2 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.5rem * (1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n  }\n}\n@media (min-width: 768px) {\n  .md\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1rem * (1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n  }\n}\n";

  // src/utils/isCanvasTainted.ts
  function isCanvasTainted(canvas) {
    try {
      canvas.getContext("2d").getImageData(0, 0, 1, 1);
      return false;
    } catch (err) {
      return err instanceof DOMException && err.name === "SecurityError";
    }
  }

  // src/utils/imageToCanvas.ts
  function imageToCanvas(_0) {
    return __async(this, arguments, function* (img, {
      background
    } = {}) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      if (img.src && img.crossOrigin !== "anonymous" && isCanvasTainted(canvas)) {
        const corsImage = new Image();
        corsImage.crossOrigin = "anonymous";
        corsImage.src = img.src;
        yield corsImage.decode();
        return imageToCanvas(corsImage, { background });
      }
      return canvas;
    });
  }

  // src/niconico.jp/manga-download.user.ts
  var __name__ = "NicoNico manga download";
  (function() {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const images = [];
      const title = (_b = (_a = document.querySelector("meta[property='og:title']")) == null ? void 0 : _a.content) != null ? _b : document.title;
      const startTime = Date.now();
      const loopNext = () => {
        if (Date.now() - startTime < 3e5) {
          return true;
        }
        throw new Error(`${__name__}: timeout`);
      };
      const pages = document.querySelectorAll("li.page");
      for (let index = 0; index < pages.length; index += 1) {
        const li = pages.item(index);
        while (loopNext()) {
          const pageIndex = Number.parseInt(li.dataset.pageIndex, 10) || index;
          let canvas = li.querySelector("canvas:not(.balloon)");
          const image = li.querySelector("img[data-image-id]");
          if (image) {
            canvas != null ? canvas : canvas = imageToCanvas(image);
          }
          if (!canvas || canvas.width === 1) {
            li.scrollIntoView();
            console.log(`${__name__}: waiting page: ${pageIndex}`);
            yield sleep(1e3);
            continue;
          }
          images.push({
            src: canvas.toDataURL(),
            alt: li.id,
            title: `p${pageIndex + 1}`
          });
          break;
        }
      }
      (_c = pages.item(0)) == null ? void 0 : _c.scrollIntoView();
      const data = mustache_default.render(manga_reader_default, {
        title,
        window,
        images,
        style: style_default
      });
      console.log(`${__name__}: got ${images.length} page(s)`);
      const file = new Blob([data], { type: "text/html" });
      downloadFile(file, `${title}.html`);
    });
  })();
})();
/*! Bundled license information:

mustache/mustache.mjs:
  (*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   *)
*/
