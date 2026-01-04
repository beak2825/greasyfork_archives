var BanguminiUserscript = function() {
  "use strict";/*!
// ==UserScript==
// @name              番组迷你
// @version           1.0.1
// @description       bangumini↗↗
// @author            Vick Scarlet(vick@syaro.io)
// @namespace         https://b38.dev
// @require           https://unpkg.com/echarts
// @match             *://bgm.tv/*
// @match             *://bangumi.tv/*
// @match             *://chii.in/*
// @grant             GM_addStyle
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/479747/%E7%95%AA%E7%BB%84%E8%BF%B7%E4%BD%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/479747/%E7%95%AA%E7%BB%84%E8%BF%B7%E4%BD%A0.meta.js
// ==/UserScript==
*/

  GM_addStyle("");
  const FormerName = {
    name: "former_name",
    indexes: [
      {
        name: "_user_tml",
        keyPath: ["user", "tml"],
        options: { unique: true }
      }
    ]
  };
  const ProgressActivity = {
    name: "progress_activity",
    indexes: [
      {
        name: "_user_time",
        keyPath: ["user", "time"],
        options: { unique: true }
      }
    ]
  };
  const models = [FormerName, ProgressActivity];
  let instance = null;
  async function initDb(name, version) {
    if (instance)
      return instance;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(name, version);
      req.addEventListener("error", () => reject(req.error));
      req.addEventListener("success", () => {
        instance = req.result;
        resolve(req.result);
      });
      req.addEventListener("upgradeneeded", () => {
        for (const model of models) {
          if (req.result.objectStoreNames.contains(model.name))
            continue;
          const store = req.result.createObjectStore(model.name);
          for (const index of model.indexes)
            store.createIndex(index.name, index.keyPath, index.options);
        }
      });
    });
  }
  function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
      var char = str[i];
      if (char === "*" || char === "+" || char === "?") {
        tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
        continue;
      }
      if (char === "\\") {
        tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
        continue;
      }
      if (char === "{") {
        tokens.push({ type: "OPEN", index: i, value: str[i++] });
        continue;
      }
      if (char === "}") {
        tokens.push({ type: "CLOSE", index: i, value: str[i++] });
        continue;
      }
      if (char === ":") {
        var name = "";
        var j = i + 1;
        while (j < str.length) {
          var code = str.charCodeAt(j);
          if (
            // `0-9`
            code >= 48 && code <= 57 || // `A-Z`
            code >= 65 && code <= 90 || // `a-z`
            code >= 97 && code <= 122 || // `_`
            code === 95
          ) {
            name += str[j++];
            continue;
          }
          break;
        }
        if (!name)
          throw new TypeError("Missing parameter name at ".concat(i));
        tokens.push({ type: "NAME", index: i, value: name });
        i = j;
        continue;
      }
      if (char === "(") {
        var count = 1;
        var pattern = "";
        var j = i + 1;
        if (str[j] === "?") {
          throw new TypeError('Pattern cannot start with "?" at '.concat(j));
        }
        while (j < str.length) {
          if (str[j] === "\\") {
            pattern += str[j++] + str[j++];
            continue;
          }
          if (str[j] === ")") {
            count--;
            if (count === 0) {
              j++;
              break;
            }
          } else if (str[j] === "(") {
            count++;
            if (str[j + 1] !== "?") {
              throw new TypeError("Capturing groups are not allowed at ".concat(j));
            }
          }
          pattern += str[j++];
        }
        if (count)
          throw new TypeError("Unbalanced pattern at ".concat(i));
        if (!pattern)
          throw new TypeError("Missing pattern at ".concat(i));
        tokens.push({ type: "PATTERN", index: i, value: pattern });
        i = j;
        continue;
      }
      tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
  }
  function parse(str, options) {
    if (options === void 0) {
      options = {};
    }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function(type) {
      if (i < tokens.length && tokens[i].type === type)
        return tokens[i++].value;
    };
    var mustConsume = function(type) {
      var value2 = tryConsume(type);
      if (value2 !== void 0)
        return value2;
      var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
      throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function() {
      var result2 = "";
      var value2;
      while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
        result2 += value2;
      }
      return result2;
    };
    while (i < tokens.length) {
      var char = tryConsume("CHAR");
      var name = tryConsume("NAME");
      var pattern = tryConsume("PATTERN");
      if (name || pattern) {
        var prefix = char || "";
        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }
        if (path) {
          result.push(path);
          path = "";
        }
        result.push({
          name: name || key++,
          prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      var value = char || tryConsume("ESCAPED_CHAR");
      if (value) {
        path += value;
        continue;
      }
      if (path) {
        result.push(path);
        path = "";
      }
      var open = tryConsume("OPEN");
      if (open) {
        var prefix = consumeText();
        var name_1 = tryConsume("NAME") || "";
        var pattern_1 = tryConsume("PATTERN") || "";
        var suffix = consumeText();
        mustConsume("CLOSE");
        result.push({
          name: name_1 || (pattern_1 ? key++ : ""),
          pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
          prefix,
          suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      mustConsume("END");
    }
    return result;
  }
  function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
  }
  function regexpToFunction(re, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.decode, decode = _a === void 0 ? function(x) {
      return x;
    } : _a;
    return function(pathname) {
      var m2 = re.exec(pathname);
      if (!m2)
        return false;
      var path = m2[0], index = m2.index;
      var params = /* @__PURE__ */ Object.create(null);
      var _loop_1 = function(i2) {
        if (m2[i2] === void 0)
          return "continue";
        var key = keys[i2 - 1];
        if (key.modifier === "*" || key.modifier === "+") {
          params[key.name] = m2[i2].split(key.prefix + key.suffix).map(function(value) {
            return decode(value, key);
          });
        } else {
          params[key.name] = decode(m2[i2], key);
        }
      };
      for (var i = 1; i < m2.length; i++) {
        _loop_1(i);
      }
      return { path, index, params };
    };
  }
  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  function flags(options) {
    return options && options.sensitive ? "" : "i";
  }
  function regexpToRegexp(path, keys) {
    if (!keys)
      return path;
    var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    var index = 0;
    var execResult = groupsRegex.exec(path.source);
    while (execResult) {
      keys.push({
        // Use parenthesized substring match if available, index otherwise
        name: execResult[1] || index++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
      });
      execResult = groupsRegex.exec(path.source);
    }
    return path;
  }
  function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function(path) {
      return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
  }
  function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
  }
  function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
      return x;
    } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
    var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
    var delimiterRe = "[".concat(escapeString(delimiter), "]");
    var route = start ? "^" : "";
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      if (typeof token === "string") {
        route += escapeString(encode(token));
      } else {
        var prefix = escapeString(encode(token.prefix));
        var suffix = escapeString(encode(token.suffix));
        if (token.pattern) {
          if (keys)
            keys.push(token);
          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              var mod = token.modifier === "*" ? "?" : "";
              route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
            } else {
              route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
            }
          } else {
            if (token.modifier === "+" || token.modifier === "*") {
              route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
            } else {
              route += "(".concat(token.pattern, ")").concat(token.modifier);
            }
          }
        } else {
          route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
        }
      }
    }
    if (end) {
      if (!strict)
        route += "".concat(delimiterRe, "?");
      route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
      if (!strict) {
        route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
      }
      if (!isEndDelimited) {
        route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
      }
    }
    return new RegExp(route, flags(options));
  }
  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
      return regexpToRegexp(path, keys);
    if (Array.isArray(path))
      return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
  }
  var o = {}, a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  class p {
    constructor() {
      this.pullQueue = [], this.pushQueue = [], this.eventHandlers = {}, this.isPaused = false, this.isStopped = false;
    }
    push(t) {
      if (this.isStopped)
        return;
      const e = { value: t, done: false };
      if (this.pullQueue.length) {
        const r = this.pullQueue.shift();
        r && r.resolve(e);
      } else
        this.pushQueue.push(Promise.resolve(e)), this.highWaterMark !== void 0 && this.pushQueue.length >= this.highWaterMark && !this.isPaused && (this.isPaused = true, this.eventHandlers.highWater ? this.eventHandlers.highWater() : console && console.warn(`EventIterator queue reached ${this.pushQueue.length} items`));
    }
    stop() {
      if (!this.isStopped) {
        this.isStopped = true, this.remove();
        for (const t of this.pullQueue)
          t.resolve({ value: void 0, done: true });
        this.pullQueue.length = 0;
      }
    }
    fail(t) {
      if (!this.isStopped)
        if (this.isStopped = true, this.remove(), this.pullQueue.length) {
          for (const e of this.pullQueue)
            e.reject(t);
          this.pullQueue.length = 0;
        } else {
          const e = Promise.reject(t);
          e.catch(() => {
          }), this.pushQueue.push(e);
        }
    }
    remove() {
      Promise.resolve().then(() => {
        this.removeCallback && this.removeCallback();
      });
    }
    [Symbol.asyncIterator]() {
      return {
        next: (t) => {
          const e = this.pushQueue.shift();
          return e ? (this.lowWaterMark !== void 0 && this.pushQueue.length <= this.lowWaterMark && this.isPaused && (this.isPaused = false, this.eventHandlers.lowWater && this.eventHandlers.lowWater()), e) : this.isStopped ? Promise.resolve({ value: void 0, done: true }) : new Promise((r, s) => {
            this.pullQueue.push({ resolve: r, reject: s });
          });
        },
        return: () => (this.isStopped = true, this.pushQueue.length = 0, this.remove(), Promise.resolve({ value: void 0, done: true }))
      };
    }
  }
  class d {
    constructor(t, { highWaterMark: e = 100, lowWaterMark: r = 1 } = {}) {
      const s = new p();
      s.highWaterMark = e, s.lowWaterMark = r, s.removeCallback = t({
        push: (i) => s.push(i),
        stop: () => s.stop(),
        fail: (i) => s.fail(i),
        on: (i, u) => {
          s.eventHandlers[i] = u;
        }
      }) || (() => {
      }), this[Symbol.asyncIterator] = () => s[Symbol.asyncIterator](), Object.freeze(this);
    }
  }
  a.EventIterator = d;
  a.default = d;
  Object.defineProperty(o, "__esModule", { value: true });
  const h = a;
  o.EventIterator = h.EventIterator;
  function v(n, t, e) {
    return new h.EventIterator(({ push: r }) => (this.addEventListener(n, r, t), () => this.removeEventListener(n, r, t)), e);
  }
  o.subscribe = v;
  var m = o.default = h.EventIterator;
  const l = /* @__PURE__ */ new Map();
  async function* w(n) {
    const t = (() => {
      let e = null, r = new Promise((i) => e = i);
      const s = new EventSource(n);
      return s.addEventListener("message", (i) => {
        const u = e, c = JSON.parse(i.data);
        c.done ? (s.close(), r = null) : r = new Promise((f) => e = f), u == null || u(c);
      }), {
        next: () => r
      };
    })();
    for (; ; ) {
      const e = await t.next();
      if (!e || (yield e, e != null && e.done))
        break;
    }
  }
  function Q(n) {
    let t = l.get(n), e = !t;
    e && (t = /* @__PURE__ */ new Set(), l.set(n, t));
    const r = new m(({ push: s, stop: i }) => {
      t.add({ push: s, stop: i });
    });
    return e && Promise.resolve(w(n)).then(async (s) => {
      for await (const i of s)
        for (const u of t)
          u.push(i);
      for (const i of t)
        i.stop();
      l.delete(n);
    }), r;
  }
  const apiPath = (api) => `https://api.b38.dev/${api}`;
  const getProgressActivity = (user2) => Q(
    apiPath(`user/${user2}/progress_activity`)
  );
  function drawActivity(element) {
    const chart = echarts.init(element);
    const resize = () => chart.resize();
    const update = (raw, start, end) => {
      const date = [];
      const data = [];
      let time = new Date(end);
      while (time >= start) {
        const t = time.toISOString().slice(0, 10);
        date.push(t);
        data.push(raw.get(t) ?? 0);
        time.setDate(time.getDate() - 1);
      }
      chart.setOption({
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: date },
        yAxis: { type: "value" },
        toolbox: { feature: { restore: {}, saveAsImage: {} } },
        dataZoom: [
          { type: "inside", start: 0, end: 100 },
          { start: 0, end: 10 }
        ],
        grid: { left: 35, right: 35, top: 10 },
        series: [
          { data, type: "bar", name: "格子数", itemStyle: { color: "#e19699" } }
        ]
      });
    };
    return { update, resize };
  }
  const style = `
.bangumini.progress_activity {
    position: relative;
    min-height: 60px;
    background-color: #444444;
    border-radius: 5px;
}
.bangumini.progress_activity h3 {
    margin: 0;
    padding: 10px;
    font-size: 14px;
    color: #ffffff;
}
.bangumini.canvas {
    width: 100%;
    height: 300px;
    margin: 10px 0;
}
.bangumini.button {
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%);
    cursor: pointer;
    font-size: 12px;
    color: #ffffff;
    padding: 2px 10px;
    background-color: #e19699;
    border-radius: 100px;
}
`;
  function user$1(user2) {
    console.debug("this is", user2, "user page");
    $("head").append(`<style>${style}</style>`);
    const element = $(`<div class="bangumini progress_activity"><h3>格子活跃</h3></div>`);
    const canvas = $(`<div class="bangumini canvas"></div>`).hide();
    const button = $(`<div class="bangumini button chiiBtn">让我看看</div>`);
    element.append(canvas);
    element.append(button);
    $("#user_home .user_box").prepend(element);
    const { update, resize } = drawActivity(canvas[0]);
    button.on("click", async () => {
      button.hide();
      canvas.show();
      resize();
      const raw = /* @__PURE__ */ new Map();
      let start = /* @__PURE__ */ new Date("3000-1-1");
      let end = /* @__PURE__ */ new Date(0);
      const source = getProgressActivity(user2);
      for await (const { data } of source)
        if (data) {
          for (const { time, activity } of data) {
            const old = raw.get(time) ?? 0;
            raw.set(time, old + activity);
            const t = new Date(time);
            if (t < start)
              start = t;
            if (t > end)
              end = t;
          }
          update(raw, start, end);
        }
    });
  }
  const user = () => new Router().add("/:user", async (ctx) => {
    user$1(ctx.params.user);
  }).routes();
  class Router {
    constructor() {
      this._routes = /* @__PURE__ */ new Map();
    }
    routes() {
      const routes = (path, ctx, from = "") => {
        if (!ctx) {
          const re = /(https?:\/\/[^\/?]+)(\/[^?]*)?(\?.*)?/.exec(location.href);
          if (!re)
            throw new Error("Invalid location");
          const req = { origin: re[1], path, query: re[3] ?? "" };
          const query = Object.fromEntries(new URLSearchParams(req.query).entries());
          ctx = { req, path: re[2] ?? "/", params: {}, query };
        }
        return this.dispatch(path, ctx, from);
      };
      return routes;
    }
    add(path, callback) {
      this._routes.set(path, {
        sub: false,
        path,
        callback
      });
      return this;
    }
    use(path, router2) {
      this._routes.set(path, {
        sub: true,
        path,
        callback: router2
      });
      return this;
    }
    dispatch(path, ctx, from) {
      for (const route of this._routes.values()) {
        const m2 = from + route.path;
        const r = match(m2, { end: !route.sub })(path);
        if (!r)
          continue;
        if (route.sub) {
          const ret = route.callback(path, ctx, m2);
          if (ret)
            return true;
          continue;
        }
        Object.assign(ctx.params, r.params);
        route.callback(ctx);
        return true;
      }
      return false;
    }
  }
  const router = () => new Router().use("/user", user()).routes();
  async function main(config) {
    const { name, version } = config.database;
    await initDb(name, version);
    const routes = router();
    routes(location.pathname);
  }
  main({
    database: {
      name: "bangumini",
      version: 1
    }
  });
  return main;
}();
