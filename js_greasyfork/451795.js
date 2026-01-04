// ==UserScript==
// @name           dlsite_rj_code_preview
// @author         SettingDust
// @description    Make RJ code great again!
// @grant          GM_xmlhttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @inject-into    auto
// @match          *://*/*
// @match          *://dlsite.com/*
// @name:zh-CN     DLSite_RJ_码预览
// @namespace      SettingDust
// @run-at         document-end
// @version        3.1.0
// @downloadURL https://update.greasyfork.org/scripts/451795/dlsite_rj_code_preview.user.js
// @updateURL https://update.greasyfork.org/scripts/451795/dlsite_rj_code_preview.meta.js
// ==/UserScript==

// src/fetch-rj.ts
var productPage = (rj) => `https://www.dlsite.com/maniax/work/=/product_id/${rj.toUpperCase()}.html`, agings = {
  adult: "18 \u7981",
  general: "\u5168\u5E74\u9F84"
};
function productInfo(rj) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/api/=/product.json?workno=${rj}`,
      responseType: "json",
      onload: function(resp) {
        resp.readyState === 4 && resp.status === 200 ? (resolve(resp.response[0]), console.debug("[rj-code-preview/product]", resp.response[0])) : reject(resp);
      }
    });
  });
}
function productRatingInfo(rj) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/product/info/ajax?product_id=${rj}`,
      responseType: "json",
      onload: function(resp) {
        resp.readyState === 4 && resp.status === 200 ? (resolve(resp.response[rj]), console.debug("[rj-code-preview/rating]", resp.response[rj])) : reject(resp);
      }
    });
  });
}
function fetch_rj_default(rj) {
  return new Promise((resolve, reject) => {
    Promise.all([productInfo(rj), productRatingInfo(rj)]).then(
      ([product, rating]) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return {
          name: product.work_name,
          image: (_a = product.image_main) == null ? void 0 : _a.url,
          type: product.work_type_string,
          group: product.maker_name,
          date: product.regist_date,
          series: product.title_name,
          age: (_b = agings[product.age_category_string]) != null ? _b : product.age_category_string,
          voices: (_d = (_c = product.creaters) == null ? void 0 : _c.voice_by) == null ? void 0 : _d.map((it) => it.name),
          illusts: (_f = (_e = product.creaters) == null ? void 0 : _e.illust_by) == null ? void 0 : _f.map((it) => it.name),
          scenarios: (_h = (_g = product.creaters) == null ? void 0 : _g.scenario_by) == null ? void 0 : _h.map((it) => it.name),
          creators: (_j = (_i = product.creaters) == null ? void 0 : _i.created_by) == null ? void 0 : _j.map((it) => it.name),
          musics: (_l = (_k = product.creaters) == null ? void 0 : _k.music_by) == null ? void 0 : _l.map((it) => it.name),
          hasCreators: (_n = (_m = product.creaters) == null ? void 0 : _m.created_by) == null ? void 0 : _n.length,
          hasScenarios: (_p = (_o = product.creaters) == null ? void 0 : _o.scenario_by) == null ? void 0 : _p.length,
          hasIllusts: (_r = (_q = product.creaters) == null ? void 0 : _q.illust_by) == null ? void 0 : _r.length,
          hasVoices: (_t = (_s = product.creaters) == null ? void 0 : _s.voice_by) == null ? void 0 : _t.length,
          hasMusics: (_v = (_u = product.creaters) == null ? void 0 : _u.music_by) == null ? void 0 : _v.length,
          tags: (_w = product.genres) == null ? void 0 : _w.map((it) => it.name),
          hasTags: (_x = product.genres) == null ? void 0 : _x.length,
          rating: rating == null ? void 0 : rating.rate_average_2dp,
          sale: rating == null ? void 0 : rating.dl_count
        };
      }
    ).then((it) => {
      GM_setValue(rj, it), resolve(it);
    }).catch(reject);
    let cache = GM_getValue(rj);
    cache && (console.debug(`[rj-code-preview/cached/${rj}]`), resolve(cache));
  });
}

// src/hack-rj-code.ts
var RJ_CODE_LINK_CLASS = "rj-code", RJ_CODE_ATTRIBUTE = "rjCode", RJ_REGEX = new RegExp("R[JE][0-9]{6,8}", "gi");
function wrapRJCode(rj) {
  let a = document.createElement("a");
  return a.classList.add(RJ_CODE_LINK_CLASS), a.href = productPage(rj), a.innerHTML = rj, a.target = "_blank", a.rel = "noreferrer", a.dataset[RJ_CODE_ATTRIBUTE] = rj.toUpperCase(), a;
}
function injectRJCode(node) {
  var _a;
  let text = node.nodeValue, matches = [], match;
  for (; match = RJ_REGEX.exec(text); )
    matches.push({
      index: match.index,
      value: match[0]
    });
  matches.length && console.debug("[rj-code-preview/matches]", text, matches), node.nodeValue = text.substring(0, matches[0].index);
  let prev = null;
  for (let i = 0; i < matches.length; i++) {
    let match2 = matches[i], a = wrapRJCode(match2.value);
    node.parentNode.insertBefore(a, prev ? prev.nextSibling : node.nextSibling);
    let nextIndex = (_a = matches[i + 1]) == null ? void 0 : _a.index, afterText = text.substring(
      match2.index + match2.value.length,
      nextIndex
    );
    if (afterText) {
      let afterNode = document.createTextNode(afterText);
      node.parentNode.insertBefore(afterNode, a.nextElementSibling), prev = afterNode;
    } else
      prev = a;
  }
}
function hack_rj_code_default(root) {
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.parentElement.classList.contains(RJ_CODE_LINK_CLASS) || node.nodeValue.match(RJ_REGEX))
        return NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; walker.nextNode(); ) {
    let node = walker.currentNode;
    node.parentElement.classList.contains(RJ_CODE_LINK_CLASS) || injectRJCode(node);
  }
}

// node_modules/.pnpm/mustache@4.2.0/node_modules/mustache/mustache.mjs
var objectToString = Object.prototype.toString, isArray = Array.isArray || function(object) {
  return objectToString.call(object) === "[object Array]";
};
function isFunction(object) {
  return typeof object == "function";
}
function typeStr(obj) {
  return isArray(obj) ? "array" : typeof obj;
}
function escapeRegExp(string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function hasProperty(obj, propName) {
  return obj != null && typeof obj == "object" && propName in obj;
}
function primitiveHasOwnProperty(primitive, propName) {
  return primitive != null && typeof primitive != "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
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
  return String(string).replace(/[&<>"'`=\/]/g, function(s) {
    return entityMap[s];
  });
}
var whiteRe = /\s*/, spaceRe = /\s+/, equalsRe = /\s*=/, curlyRe = /\s*\}/, tagRe = /#|\^|\/|>|\{|&|=|!/;
function parseTemplate(template2, tags) {
  if (!template2)
    return [];
  var lineHasNonSpace = !1, sections = [], tokens = [], spaces = [], hasTag = !1, nonSpace = !1, indentation = "", tagIndex = 0;
  function stripSpace() {
    if (hasTag && !nonSpace)
      for (; spaces.length; )
        delete tokens[spaces.pop()];
    else
      spaces = [];
    hasTag = !1, nonSpace = !1;
  }
  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags(tagsToCompile) {
    if (typeof tagsToCompile == "string" && (tagsToCompile = tagsToCompile.split(spaceRe, 2)), !isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error("Invalid tags: " + tagsToCompile);
    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*"), closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1])), closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]));
  }
  compileTags(tags || mustache.tags);
  for (var scanner = new Scanner(template2), start, type, value, chr, token, openSection; !scanner.eos(); ) {
    if (start = scanner.pos, value = scanner.scanUntil(openingTagRe), value)
      for (var i = 0, valueLength = value.length; i < valueLength; ++i)
        chr = value.charAt(i), isWhitespace(chr) ? (spaces.push(tokens.length), indentation += chr) : (nonSpace = !0, lineHasNonSpace = !0, indentation += " "), tokens.push(["text", chr, start, start + 1]), start += 1, chr === `
` && (stripSpace(), indentation = "", tagIndex = 0, lineHasNonSpace = !1);
    if (!scanner.scan(openingTagRe))
      break;
    if (hasTag = !0, type = scanner.scan(tagRe) || "name", scanner.scan(whiteRe), type === "=" ? (value = scanner.scanUntil(equalsRe), scanner.scan(equalsRe), scanner.scanUntil(closingTagRe)) : type === "{" ? (value = scanner.scanUntil(closingCurlyRe), scanner.scan(curlyRe), scanner.scanUntil(closingTagRe), type = "&") : value = scanner.scanUntil(closingTagRe), !scanner.scan(closingTagRe))
      throw new Error("Unclosed tag at " + scanner.pos);
    if (type == ">" ? token = [type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace] : token = [type, value, start, scanner.pos], tagIndex++, tokens.push(token), type === "#" || type === "^")
      sections.push(token);
    else if (type === "/") {
      if (openSection = sections.pop(), !openSection)
        throw new Error('Unopened section "' + value + '" at ' + start);
      if (openSection[1] !== value)
        throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
    } else
      type === "name" || type === "{" || type === "&" ? nonSpace = !0 : type === "=" && compileTags(value);
  }
  if (stripSpace(), openSection = sections.pop(), openSection)
    throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
  return nestTokens(squashTokens(tokens));
}
function squashTokens(tokens) {
  for (var squashedTokens = [], token, lastToken, i = 0, numTokens = tokens.length; i < numTokens; ++i)
    token = tokens[i], token && (token[0] === "text" && lastToken && lastToken[0] === "text" ? (lastToken[1] += token[1], lastToken[3] = token[3]) : (squashedTokens.push(token), lastToken = token));
  return squashedTokens;
}
function nestTokens(tokens) {
  for (var nestedTokens = [], collector = nestedTokens, sections = [], token, section, i = 0, numTokens = tokens.length; i < numTokens; ++i)
    switch (token = tokens[i], token[0]) {
      case "#":
      case "^":
        collector.push(token), sections.push(token), collector = token[4] = [];
        break;
      case "/":
        section = sections.pop(), section[5] = token[2], collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  return nestedTokens;
}
function Scanner(string) {
  this.string = string, this.tail = string, this.pos = 0;
}
Scanner.prototype.eos = function() {
  return this.tail === "";
};
Scanner.prototype.scan = function(re) {
  var match = this.tail.match(re);
  if (!match || match.index !== 0)
    return "";
  var string = match[0];
  return this.tail = this.tail.substring(string.length), this.pos += string.length, string;
};
Scanner.prototype.scanUntil = function(re) {
  var index = this.tail.search(re), match;
  switch (index) {
    case -1:
      match = this.tail, this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index), this.tail = this.tail.substring(index);
  }
  return this.pos += match.length, match;
};
function Context(view, parentContext) {
  this.view = view, this.cache = { ".": this.view }, this.parent = parentContext;
}
Context.prototype.push = function(view) {
  return new Context(view, this);
};
Context.prototype.lookup = function(name) {
  var cache = this.cache, value;
  if (cache.hasOwnProperty(name))
    value = cache[name];
  else {
    for (var context = this, intermediateValue, names, index, lookupHit = !1; context; ) {
      if (name.indexOf(".") > 0)
        for (intermediateValue = context.view, names = name.split("."), index = 0; intermediateValue != null && index < names.length; )
          index === names.length - 1 && (lookupHit = hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index])), intermediateValue = intermediateValue[names[index++]];
      else
        intermediateValue = context.view[name], lookupHit = hasProperty(context.view, name);
      if (lookupHit) {
        value = intermediateValue;
        break;
      }
      context = context.parent;
    }
    cache[name] = value;
  }
  return isFunction(value) && (value = value.call(this.view)), value;
};
function Writer() {
  this.templateCache = {
    _cache: {},
    set: function(key, value) {
      this._cache[key] = value;
    },
    get: function(key) {
      return this._cache[key];
    },
    clear: function() {
      this._cache = {};
    }
  };
}
Writer.prototype.clearCache = function() {
  typeof this.templateCache != "undefined" && this.templateCache.clear();
};
Writer.prototype.parse = function(template2, tags) {
  var cache = this.templateCache, cacheKey = template2 + ":" + (tags || mustache.tags).join(":"), isCacheEnabled = typeof cache != "undefined", tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
  return tokens == null && (tokens = parseTemplate(template2, tags), isCacheEnabled && cache.set(cacheKey, tokens)), tokens;
};
Writer.prototype.render = function(template2, view, partials, config) {
  var tags = this.getConfigTags(config), tokens = this.parse(template2, tags), context = view instanceof Context ? view : new Context(view, void 0);
  return this.renderTokens(tokens, context, partials, template2, config);
};
Writer.prototype.renderTokens = function(tokens, context, partials, originalTemplate, config) {
  for (var buffer = "", token, symbol, value, i = 0, numTokens = tokens.length; i < numTokens; ++i)
    value = void 0, token = tokens[i], symbol = token[0], symbol === "#" ? value = this.renderSection(token, context, partials, originalTemplate, config) : symbol === "^" ? value = this.renderInverted(token, context, partials, originalTemplate, config) : symbol === ">" ? value = this.renderPartial(token, context, partials, config) : symbol === "&" ? value = this.unescapedValue(token, context) : symbol === "name" ? value = this.escapedValue(token, context, config) : symbol === "text" && (value = this.rawValue(token)), value !== void 0 && (buffer += value);
  return buffer;
};
Writer.prototype.renderSection = function(token, context, partials, originalTemplate, config) {
  var self = this, buffer = "", value = context.lookup(token[1]);
  function subRender(template2) {
    return self.render(template2, context, partials, config);
  }
  if (value) {
    if (isArray(value))
      for (var j = 0, valueLength = value.length; j < valueLength; ++j)
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
    else if (typeof value == "object" || typeof value == "string" || typeof value == "number")
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
    else if (isFunction(value)) {
      if (typeof originalTemplate != "string")
        throw new Error("Cannot use higher-order sections without the original template");
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender), value != null && (buffer += value);
    } else
      buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
    return buffer;
  }
};
Writer.prototype.renderInverted = function(token, context, partials, originalTemplate, config) {
  var value = context.lookup(token[1]);
  if (!value || isArray(value) && value.length === 0)
    return this.renderTokens(token[4], context, partials, originalTemplate, config);
};
Writer.prototype.indentPartial = function(partial, indentation, lineHasNonSpace) {
  for (var filteredIndentation = indentation.replace(/[^ \t]/g, ""), partialByNl = partial.split(`
`), i = 0; i < partialByNl.length; i++)
    partialByNl[i].length && (i > 0 || !lineHasNonSpace) && (partialByNl[i] = filteredIndentation + partialByNl[i]);
  return partialByNl.join(`
`);
};
Writer.prototype.renderPartial = function(token, context, partials, config) {
  if (partials) {
    var tags = this.getConfigTags(config), value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6], tagIndex = token[5], indentation = token[4], indentedValue = value;
      tagIndex == 0 && indentation && (indentedValue = this.indentPartial(value, indentation, lineHasNonSpace));
      var tokens = this.parse(indentedValue, tags);
      return this.renderTokens(tokens, context, partials, indentedValue, config);
    }
  }
};
Writer.prototype.unescapedValue = function(token, context) {
  var value = context.lookup(token[1]);
  if (value != null)
    return value;
};
Writer.prototype.escapedValue = function(token, context, config) {
  var escape = this.getConfigEscape(config) || mustache.escape, value = context.lookup(token[1]);
  if (value != null)
    return typeof value == "number" && escape === mustache.escape ? String(value) : escape(value);
};
Writer.prototype.rawValue = function(token) {
  return token[1];
};
Writer.prototype.getConfigTags = function(config) {
  return isArray(config) ? config : config && typeof config == "object" ? config.tags : void 0;
};
Writer.prototype.getConfigEscape = function(config) {
  if (config && typeof config == "object" && !isArray(config))
    return config.escape;
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
}, defaultWriter = new Writer();
mustache.clearCache = function() {
  return defaultWriter.clearCache();
};
mustache.parse = function(template2, tags) {
  return defaultWriter.parse(template2, tags);
};
mustache.render = function(template2, view, partials, config) {
  if (typeof template2 != "string")
    throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template2) + '" was given as the first argument for mustache#render(template, view, partials)');
  return defaultWriter.render(template2, view, partials, config);
};
mustache.escape = escapeHtml;
mustache.Scanner = Scanner;
mustache.Context = Context;
mustache.Writer = Writer;
var mustache_default = mustache;

// node_modules/.pnpm/delegate-it@5.0.0/node_modules/delegate-it/index.js
var ledger = /* @__PURE__ */ new WeakMap();
function editLedger(wanted, baseElement, callback, setup) {
  var _a, _b;
  if (!wanted && !ledger.has(baseElement))
    return !1;
  let elementMap = (_a = ledger.get(baseElement)) != null ? _a : /* @__PURE__ */ new WeakMap();
  if (ledger.set(baseElement, elementMap), !wanted && !ledger.has(baseElement))
    return !1;
  let setups = (_b = elementMap.get(callback)) != null ? _b : /* @__PURE__ */ new Set();
  elementMap.set(callback, setups);
  let existed = setups.has(setup);
  return wanted ? setups.add(setup) : setups.delete(setup), existed && wanted;
}
function isEventTarget(elements) {
  return typeof elements.addEventListener == "function";
}
function safeClosest(event, selector) {
  let target = event.target;
  if (target instanceof Text && (target = target.parentElement), target instanceof Element && event.currentTarget instanceof Element) {
    let closest = target.closest(selector);
    if (closest && event.currentTarget.contains(closest))
      return closest;
  }
}
function delegate(base, selector, type, callback, options) {
  let listenerOptions = typeof options == "object" ? options : { capture: options };
  delete listenerOptions.once;
  let { signal } = listenerOptions;
  if (signal != null && signal.aborted)
    return;
  if (typeof base == "string" && (base = document.querySelectorAll(base)), !isEventTarget(base)) {
    for (let element of base)
      delegate(element, selector, type, callback, listenerOptions);
    return;
  }
  let baseElement = base instanceof Document ? base.documentElement : base, capture = Boolean(typeof options == "object" ? options.capture : options), listenerFn = (event) => {
    let delegateTarget = safeClosest(event, selector);
    if (delegateTarget) {
      let delegateEvent = Object.assign(event, { delegateTarget });
      callback.call(baseElement, delegateEvent);
    }
  }, setup = JSON.stringify({ selector, type, capture });
  editLedger(!0, baseElement, callback, setup) || baseElement.addEventListener(type, listenerFn, listenerOptions), signal == null || signal.addEventListener("abort", () => {
    editLedger(!1, baseElement, callback, setup);
  });
}
var delegate_it_default = delegate;

// src/popup.ts
var linkSelector = `a.${RJ_CODE_LINK_CLASS}`, template = `
  <img src="{{ image }}">
  <div class="info">
    <h3>{{ name }}</h3>
    {{ #rating }}<p><span>\u8BC4\u4EF7\uFF1A</span><span>{{ rating }}</span></p>{{ /rating }}
    {{ #sale }}<p><span>\u8D29\u5356\u6570\uFF1A</span><span>{{ sale }}</span></p>{{ /sale }}
    {{ #group }}<p><span>\u793E\u56E2\u540D\uFF1A</span><span>{{ group }}</span></p>{{ /group }}
    {{ #date }}<p><span>\u8D29\u5356\u65E5\uFF1A</span><span>{{ date }}</span></p>{{ /date }}
    {{ #series }}<p><span>\u7CFB\u5217\u540D\uFF1A</span><span>{{ series }}</span></p>{{ /series }}
    {{ #hasCreators }}<p><span>\u4F5C\u8005\uFF1A</span>{{ #creators }}<span>{{ . }} / </span>{{ /creators }}</p>{{ /hasCreators }}
    {{ #hasScenarios }}<p><span>\u5267\u60C5\uFF1A</span>{{ #scenarios }}<span>{{ . }} / </span>{{ /scenarios }}</p>{{ /hasScenarios }}
    {{ #hasIllusts }}<p><span>\u63D2\u753B\uFF1A</span>{{ #illusts }}<span>{{ . }} / </span>{{ /illusts }}</p>{{ /hasIllusts }}
    {{ #hasVoices }}<p><span>\u58F0\u4F18\uFF1A</span>{{ #voices }}<span>{{ . }} / </span>{{ /voices }}</p>{{ /hasVoices }}
    {{ #hasMusics }}<p><span>\u97F3\u4E50\uFF1A</span>{{ #musics }}<span>{{ . }} / </span>{{ /musics }}</p>{{ /hasMusics }}
    {{ #age }}<p><span>\u5E74\u9F84\u6307\u5B9A\uFF1A</span><span>{{ age }}</span></p>{{ /age }}
    {{ #type }}<p><span>\u4F5C\u54C1\u7C7B\u578B\uFF1A</span><span>{{ type }}</span></p>{{ /type }}
    {{ #hasTags }}<p><span>\u5206\u7C7B\uFF1A</span>{{ #tags }}<span>{{ . }} </span>{{ /tags }}</p>{{ /hasTags }}
  </div>`, currentWork, currentRj;
async function show(x, y) {
  let popup = document.getElementById("rj-popup"), tempRj = currentRj, temp = await fetch_rj_default(tempRj);
  if ((currentRj === tempRj || !currentWork) && (currentWork = temp), console.debug("[rj-code-preview/work]", currentWork), !hided && currentWork) {
    let rendered = mustache_default.render(template, currentWork, null, {
      escape: (it) => it
    });
    console.debug("[rj-code-preview/rendered]", rendered), popup.innerHTML = rendered, move(x, y);
    let img = popup.getElementsByTagName("img").item(0);
    img.onload = () => setTimeout(() => move(x, y)), img.onerror = () => setTimeout(() => move(x, y));
  }
  hided = !1;
}
var hided = !1;
function hide() {
  hided = !0, currentRj = void 0, currentWork = void 0, document.getElementById("rj-popup").innerHTML = "";
}
function move(x, y) {
  let popup = document.getElementById("rj-popup");
  if (x + popup.offsetWidth + 16 < window.innerWidth)
    popup.style.left = x + 8 + "px";
  else {
    let left = x - popup.offsetWidth - 8;
    left < 0 ? popup.style.left = "8px" : popup.style.left = left + "px";
  }
  popup.offsetHeight + y + 16 > window.innerHeight ? popup.style.top = window.innerHeight - popup.offsetHeight - 16 + "px" : popup.style.top = y + 8 + "px";
}
delegate_it_default(document.body, linkSelector, "mouseout", () => hide());
delegate_it_default(document.body, linkSelector, "mouseover", (event) => {
  currentRj = event.target.dataset[RJ_CODE_ATTRIBUTE], console.debug("[rj-code-preview/rj]", currentRj), currentRj && (hided = !1, show(event.clientX, event.clientY).then());
});
delegate_it_default(
  document.body,
  linkSelector,
  "mousemove",
  (event) => move(event.clientX, event.clientY)
);
function initPopup() {
  let popup = document.createElement("div");
  popup.id = "rj-popup", document.body.append(popup);
  let style2 = document.createElement("style");
  style2.innerHTML = `
  #rj-popup {
    max-width: min(calc(100vw - 16px), 360px);
    max-height: calc(100vh - 32px);
    position: fixed;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #fff;
    background-color: #424242;
    border-radius: 12px;
    z-index: 99999;
  }
  #rj-popup > img {
    width: 100%;
    height: auto;
    border-radius: 0;
  }
  
  #rj-popup > .info {
    padding: 12px 16px;
    font-size: 0.88rem;
    line-height: 1.2;
    display: grid;
    grid-gap: 6px;
    box-sizing: border-box;
  }
  
  #rj-popup > .info > * {
    margin: 0;
  }
  
  #rj-popup > .info > h3 {
    color: inherit;
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1;
  }`, document.head.append(style2);
}

// src/index.ts
var observer = new MutationObserver((records) => {
  for (let { addedNodes } of records)
    for (let node of addedNodes)
      hack_rj_code_default(node);
});
observer.observe(document.body, { childList: !0, subtree: !0 });
hack_rj_code_default(document.body);
var style = document.createElement("style");
style.innerHTML = `
.${RJ_CODE_LINK_CLASS} {
  color: inherit;
  -webkit-text-stroke-width: 1px;
  
  /* \u5E7B\u60F3\u6B21\u5143\u9996\u9875\u5217\u8868\u4F1A\u8BA9\u5BBD\u5EA6\u53D8\u6210 70% */
  width: fit-content !important;
  
  /* \u5E7B\u60F3\u6B21\u5143\u548C\u7EC5\u58EB\u4E4B\u5EAD\u4F1A\u8BA9 a \u6807\u7B7E\u6362\u884C */
  display: inline-flex !important;
  line-height: 1;
  
  /* [[\u7EC5\u58EB\u4E4B\u5EAD]] \u9996\u9875\u6807\u9898\u7684 [[RJ \u7801]] \u4F1A\u53D8\u5F97\u5F88\u5927 */
  font-size: inherit !important;
  
  /* [[\u5357+]] \u7684\u5E16\u5B50\u5217\u8868\u4F1A\u7ED9 a \u6807\u7B7E\u4E00\u4E2A\u53F3\u4FA7 [[margin]] */
  margin: 0;
  
  align-items: center;
}`;
document.head.append(style);
initPopup();
document.addEventListener("securitypolicyviolation", (e) => {
  e.blockedURI.includes("img.dlsite.jp") && document.querySelector(`img[src="${e.blockedURI}"]`).remove();
});
/*! Bundled license information:

mustache/mustache.mjs:
  (*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   *)
*/
