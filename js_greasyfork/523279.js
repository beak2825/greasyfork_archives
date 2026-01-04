// ==UserScript==
// @name  ConsoleHook
// @namespace http://tampermonkey.net/
// @description utils of hook javascript function and value changes for js reverse engineering
// @author  @Esonhugh
// @match http://*
// @match https://*
// @include http://*
// @include https://*
// @exclude http://127.0.0.1:*/*
// @exclude http://localhost:*/*
// @icon  https://blog.eson.ninja/img/reol.png
// @grant none
// @license MIT
// @run-at  document-start
// @version 2025-03-10
// @downloadURL https://update.greasyfork.org/scripts/523279/ConsoleHook.user.js
// @updateURL https://update.greasyfork.org/scripts/523279/ConsoleHook.meta.js
// ==/UserScript==

(function () {
  console.hooks = {
    // settings
    settings: {
      // trigger debugger if hook is caught
      autoDebug: false,
      // don't let page jump to other place
      blockPageJump: false,
      // log prefix
      prefix: "[EHOOKS] ", // u can filter all this things with this tag
      // init with eventListener added
      checkEventListnerAdded: false,
      // init with cookie change listener
      checkCookieChange: false,
      // init with localstorage get set
      checkLocalStorageGetSet: false,
      // anti dead loop debugger in script
      antiDeadLoopDebugger: true,
      // Run main in init
      runMain: false,
      // hidden too many default debug logs if you don't need it
      hiddenlog: false,
    },

    // init function to apply settings
    init: function () {
      if (this.utils) {
        this.utils.init();
      }
      if (this.settings.blockPageJump) {
        window.onbeforeunload = function () {
          return "ANTI LEAVE";
        };
      }
      if (this.settings.checkEventListnerAdded) {
        this.hookEvents();
      }
      if (this.settings.checkCookieChange) {
        this.hookCookie();
      }
      if (this.settings.checkLocalStorageGetSet) {
        this.hookLocalStorage();
      }
      if (this.settings.antiDeadLoopDebugger) {
        this.antiDebuggerLoops();
      }
      if (this.settings.runMain) {
        this.main();
      }
    },

    // hook data change
    main: function () {

      this.hookfunc(window, "eval");
      // this.hookfunc(window, "Function");
      this.hookfunc(window, "atob");
      this.hookfunc(window, "btoa");
      this.hookfunc(window, "fetch");
      this.hookfunc(window, "encodeURI");
      this.hookfunc(window, "decodeURI");
      this.hookfunc(window, "encodeURIComponent");
      this.hookfunc(window, "decodeURIComponent");

      this.hookfunc(JSON, "parse");
      this.hookfunc(JSON, "stringify");

      this.hookfunc(console, "log");
      // this.hookfunc(console, "warn")
      // this.hookfunc(console, "error")
      // this.hookfunc(console, "info")
      // this.hookfunc(console, "debug")
      // this.hookfunc(console, "table")
      // this.hookfunc(console, "trace")
      this.hookfunc(console, "clear");
    },

    // rawlogger for console hooks and it can be disabled by settings.hiddenlog
    rawlog: function (...data) {
      if (this.settings.hiddenlog) {
        return; // don't print
      }
      return console.debug(...data);
    },

    // log for console hooks, using console.warn for debug
    log: console.warn,

    // pasue if any trap triggered
    debugger: function () {
      // traped in debug
      if (this.settings.autoDebug) {
        // dump the real stack for u
        this.dumpstack();
        debugger;
      }
    },

    // It will store raw things all your hooked
    hooked: {},

    // dump stack and delete the userscript.html
    dumpstack(print = true) {
      var err = new Error();
      var stack = err.stack.split("\n");
      var ret = [`${this.settings.prefix}DUMP STACK: `];
      for (var i of stack) {
        if (!i.includes("userscript.html") && i !== "Error") {
          ret = ret.concat(i);
        }
      }
      ret = ret.join("\n");
      if (print) {
        this.log(ret);
      }
      return ret;
    },

    // dump raw data you hooked
    dumpHooked() {
      for (var i in this.hooked) {
        if (this.hooked[i].toString) {
          this.log(`${i}: ${this.hooked[i].toString()}`);
        } else {
          this.log(`${i}: ${this.hooked[i]}`);
        }
      }
    },

    // hookfunc will hooks functions when it called
    // e.g.
    // 1. basic use
    //  hookfunc(window,"Function") ==> window.Function("return xxx")
    //
    // 2. if you need get things when it returns
    // hookfunc(window, "Function", (res)=>{
    //  let [returnValue,originalFunction,realargs,this,] = res
    // })
    //
    // 3. if you need change what when it calls
    // hookfunc(window, "Function", ()=>{} ,(res)=>{
    //  let [originalFunction,realargs,this,] = res
    //  args = realargs
    //  return args
    // })
    //
    // 4. if make this hooks sliently
    // hookfunc(window, "Function", ()=>{} ,(res)=>{
    //  let [originalFunction,realargs,this,] = res
    //  args = realargs
    //  return args
    // }, true)
    directhookfunc: function (
      originalFn,
      posthook = () => {},
      prehook = () => {},
      slience = false
    ) {
      let hookedfunction = () => {}
      (function (originalFunction) {
        hookedfunction = function () {
          // hook logic
          // 1. Allow Check
          var args = prehook([originalFunction, arguments, this]);
          var realargs = arguments;
          if (args) {
            realargs = args;
          } else {
            realargs = arguments;
          }
          // 2. Execute old function
          var returnValue = originalFunction.apply(this, realargs);
          if (!slience) {
            // not slience
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook function trap-> func[${originalFunction.toString()}]`,
              "args->",
              realargs,
              "ret->",
              returnValue
            );
            console.hooks.debugger();
          }
          // 3. Post hook change values
          var newReturn = posthook([
            returnValue,
            originalFunction,
            realargs,
            this,
          ]);
          if (newReturn) {
            return newReturn;
          }
          return returnValue;
        };
        hookedfunction.toString = function () {
          console.hooks.log(
            `${console.hooks.settings.prefix}Found hook ${originalFunction.toString()}.toString check!`,
          );
          console.hooks.debugger();
          return originalFunction.toString();
        };
      })(originalFn);
      this.log(
        `${console.hooks.settings.prefix}Hook function`,
        originalFn,
        "success!"
      );
      return hookedfunction
    },
    // hookfunc will hooks functions when it called
    // e.g.
    // 1. basic use
    //  hookfunc(window,"Function") ==> window.Function("return xxx")
    //
    // 2. if you need get things when it returns
    // hookfunc(window, "Function", (res)=>{
    //  let [returnValue,originalFunction,realargs,this,] = res
    // })
    //
    // 3. if you need change what when it calls
    // hookfunc(window, "Function", ()=>{} ,(res)=>{
    //  let [originalFunction,realargs,this,] = res
    //  args = realargs
    //  return args
    // })
    //
    // 4. if make this hooks sliently
    // hookfunc(window, "Function", ()=>{} ,(res)=>{
    //  let [originalFunction,realargs,this,] = res
    //  args = realargs
    //  return args
    // }, true)
    hookfunc: function (
      object,
      functionName,
      posthook = () => {},
      prehook = () => {},
      slience = false
    ) {
      (function (originalFunction) {
        object[functionName] = function () {
          // hook logic
          // 1. Allow Check
          var args = prehook([originalFunction, arguments, this]);
          var realargs = arguments;
          if (args) {
            realargs = args;
          } else {
            realargs = arguments;
          }
          // 2. Execute old function
          var returnValue = originalFunction.apply(this, realargs);
          if (!slience) {
            // not slience
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook function trap-> func[${functionName}]`,
              "args->",
              realargs,
              "ret->",
              returnValue
            );
            console.hooks.debugger();
          }
          // 3. Post hook change values
          var newReturn = posthook([
            returnValue,
            originalFunction,
            realargs,
            this,
          ]);
          if (newReturn) {
            return newReturn;
          }
          return returnValue;
        };
        object[functionName].toString = function () {
          console.hooks.log(
            `${console.hooks.settings.prefix}Found hook ${object}.${functionName}.toString check! and origin function is `,
            originalFunction
          );
          console.hooks.debugger();
          return originalFunction.toString();
        };
        console.hooks.hooked[functionName] = originalFunction;
      })(object[functionName]);
      this.log(
        `${console.hooks.settings.prefix}Hook function`,
        functionName,
        "success!"
      );
    },

    unhookfunc: function (object, functionName) {
      object[functionName] = console.hooks.hooked[functionName];
      this.rawlog(
        `${console.hooks.settings.prefix}unHook function`,
        functionName,
        "success!"
      );
    },

    hookCookie: function () {
      try {
        var cookieDesc =
          Object.getOwnPropertyDescriptor(Document.prototype, "cookie") ||
          Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");
        if (cookieDesc && cookieDesc.configurable) {
          this.hooked["Cookie"] = document.cookie;
          Object.defineProperty(document, "cookie", {
            set: function (val) {
              console.hooks.rawlog(
                `${console.hooks.settings.prefix}Hook捕获到cookie设置->`,
                val
              );
              console.hooks.debugger();
              console.hooks.hooked["Cookie"] = val;
              return val;
            },
            get: function () {
              return (console.hooks.hooked["Cookie"] = "");
            },
            configurable: true,
          });
        } else {
          var org = document.__lookupSetter__("cookie");
          document.__defineSetter__("cookie", function (cookie) {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Cookie Set as`,
              cookie
            );
            console.hooks.debugger();
            org = cookie;
          });
          document.__defineGetter__("cookie", function () {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Cookie Got`,
              org
            );
            console.hooks.debugger();
            return org;
          });
        }
      } catch (e) {
        this.rawlog(`${console.hooks.settings.prefix}Cookie hook failed!`);
      }
    },

    hookLocalStorage: function () {
      this.hookfunc(localStorage, "getItem");
      this.hookfunc(localStorage, "setItem");
      this.hookfunc(localStorage, "removeItem");
      this.hookfunc(localStorage, "clear");
      this.rawlog(`${console.hooks.settings.prefix}LocalStorage hooked!`);
    },

    hookValueViaGetSet: function (name, obj, key) {
      if (obj[key]) {
        this.hooked[key] = obj[key];
      }
      var obj_name = `OBJ_${name}.${key}`;
      var org = obj.__lookupSetter__(key);
      obj.__defineSetter__(key, function (val) {
        org = console.hooks.hooked[key];
        console.hooks.rawlog(
          `${console.hooks.settings.prefix}Hook value set `,
          obj_name,
          "value->",
          org,
          "newvalue->",
          val
        );
        console.hooks.debugger();
        console.hooks.hooked[key] = val;
      });
      obj.__defineGetter__(key, function () {
        org = console.hooks.hooked[key];
        console.hooks.rawlog(
          `${console.hooks.settings.prefix}Hook value get `,
          obj_name,
          "value->",
          org
        );
        console.hooks.debugger();
        return org;
      });
    },

    // return default getsetter obj
    GetSetter(obj_name, key) {
      return {
        get: function (target, property, receiver) {
          var ret = target[property];
          if (key === "default_all") {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook Proxy value get`,
              `${obj_name}.${property}`,
              "value->",
              ret
            );
            console.hooks.debugger();
          }
          if (property == key && key != "default_all") {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook Proxy value get`,
              `${obj_name}.${property}`,
              "value->",
              ret
            );
            console.hooks.debugger();
          }
          return target[property];
        },
        set: function (target, property, newValue, receiver) {
          var ret = target[property];
          if (key === "default_all") {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook Proxy value set`,
              `${obj_name}.${property}`,
              "value->",
              ret,
              "newvalue->",
              newValue
            );
            console.hooks.debugger();
          }
          if (property == key && key != "default_all") {
            console.hooks.rawlog(
              `${console.hooks.settings.prefix}Hook Proxy value get`,
              `${obj_name}.${property}`,
              "value->",
              ret,
              "newvalue->",
              newValue
            );
            console.hooks.debugger();
          }
          target[property] = newValue;
          return true;
        },
      };
    },

    // hooks value using proxy
    // usage: obj = hookValueViaProxy("name", obj)
    hookValueViaProxy: function (name, obj, key = "default_all") {
      var obj_name = "OBJ_" + name;
      return this.utils.createProxy(obj, this.GetSetter(obj_name, key));
    },

    hookValueViaObject: function (name, obj, key) {
      var obj_desc = Object.getOwnPropertyDescriptor(obj, key);
      if (!obj_desc || !obj_desc.configurable || obj[key] === undefined) {
        return Error("No Priv to set Property or No such keys!");
      }
      var obj_name = "OBJ_" + name;
      this.hooked[obj_name] = obj[key];
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          console.hooks.rawlog(
            `${console.hooks.settings.prefix}Hook Object value get`,
            `${obj_name}.${key}`,
            "value->",
            console.hooks.hooked[obj_name]
          );
          console.hooks.debugger();
          return console.hooks.hooked[obj_name];
        },
        set(v) {
          console.hooks.rawlog(
            `${console.hooks.settings.prefix}Hook Proxy value get`,
            `${obj_name}.${key}`,
            "value->",
            console.hooks.hooked[obj_name],
            "newvalue->",
            v
          );
          console.hooks.hooked[obj_name] = v;
        },
      });
    },

    hookEvents: function (params) {
      var placeToReplace;
      if (window.EventTarget && EventTarget.prototype.addEventListener) {
        placeToReplace = EventTarget;
      } else {
        placeToReplace = Element;
      }
      this.hookfunc(
        placeToReplace.prototype,
        "addEventListener",
        function (res) {
          let [ret, originalFunction, arguments] = res;
          console.hooks.rawlog(
            `${console.hooks.settings.prefix}Hook event listener added!`,
            arguments
          );
        }
      );
    },

    antiDebuggerLoops: function () {
      processDebugger = (type, res) => {
        let [originalFunction, arguments, t] = res;
        var handler = arguments[0];
        console.hooks.debugger();
        if (handler.toString().includes("debugger")) {
          console.hooks.log(
            `${console.hooks.settings.prefix}found debug loop in ${type}`
          );
          console.hooks.debugger();
          let func = handler.toString().replaceAll("debugger", `console.error(1332)`);
          arguments[0] = new Function("return " + func)();
          return arguments;
        } else {
          return arguments;
        }
      };

      this.hookfunc(
        window,
        "setInterval",
        () => {},
        (res) => {
          return processDebugger("setInterval", res);
        },
        true
      );

      this.hookfunc(
        window,
        "setTimeout",
        () => {},
        (res) => {
          return processDebugger("setTimeout", res);
        },
        true
      );

      this.hookfunc(
        window,
        "eval",
        () => {},
        (res) => {
          return processDebugger("eval", res);
        },
        true
      );

      this.hookfunc(
        Function.prototype,
        "constructor",
        (res) => {
          let [ret, originalFunction, arguments, env] = res;
          if (ret.toString().includes("debugger")) {
            console.hooks.log(
              `${console.hooks.settings.prefix}found debug loop in Function constructor`
            );
            console.hooks.debugger();
            let func = handler.toString().replaceAll("debugger", "console.error(1331)");
            return new Function("return " + func)();
          }
          return ret;
        },
        () => {},
        true
      );
    },

    vueinfo: {
      findVueRoot(root) {
        const queue = [root];
        while (queue.length > 0) {
          const currentNode = queue.shift();
    
          if (
            currentNode.__vue__ ||
            currentNode.__vue_app__ ||
            currentNode._vnode
          ) {
            console.hooks.log("vue detected on root element:", currentNode);
            return currentNode;
          }
    
          for (let i = 0; i < currentNode.childNodes.length; i++) {
            queue.push(currentNode.childNodes[i]);
          }
        }
    
        return null;
      },
      findVueRouter(vueRoot) {
        let router;
    
        try {
          if (vueRoot.__vue_app__) {
            router =
              vueRoot.__vue_app__.config.globalProperties.$router.options.routes;
            console.hooks.log("find router in Vue object", vueRoot.__vue_app__);
          } else if (vueRoot.__vue__) {
            router = vueRoot.__vue__.$root.$options.router.options.routes;
            console.hooks.log("find router in Vue object", vueRoot.__vue__);
          }
        } catch (e) {}
    
        try {
          if (vueRoot.__vue__ && !router) {
            router = vueRoot.__vue__._router.options.routes;
            console.hooks.log("find router in Vue object", vueRoot.__vue__);
          }
        } catch (e) {}
    
        return router;
      },
      walkRouter(rootNode, callback) {
        const stack = [{ node: rootNode, path: "" }];
    
        while (stack.length) {
          const { node, path } = stack.pop();
    
          if (node && typeof node === "object") {
            if (Array.isArray(node)) {
              for (const key in node) {
                stack.push({
                  node: node[key],
                  path: this.mergePath(path, node[key].path),
                });
              }
            } else if (node.hasOwnProperty("children")) {
              stack.push({ node: node.children, path: path });
            }
          }
    
          callback(path, node);
        }
      },
      mergePath(parent, path) {
        if (path.indexOf(parent) === 0) {
          return path;
        }
    
        return (parent ? parent + "/" : "") + path;
      },
      dump() {
        const vueRoot = this.findVueRoot(document.body);
        if (!vueRoot) {
          console.error("This website is not developed by Vue");
          return;
        }
    
        let vueVersion;
        if (vueRoot.__vue__) {
          vueVersion = vueRoot.__vue__.$options._base.version;
        } else {
          vueVersion = vueRoot.__vue_app__.version;
        }
    
        console.hooks.log("Vue version is ", vueVersion);
        const routers = [];
    
        const vueRouter = this.findVueRouter(vueRoot);
        if (!vueRouter) {
          console.error("No Vue-Router detected");
          return;
        }
    
        console.hooks.log(vueRouter);
        this.walkRouter(vueRouter, function (path, node) {
          if (node.path) {
            routers.push({ name: node.name, path });
          }
        });
        console.table(routers);
        return routers;
      }
    },    
  };

  // Console Hooks utils for
  {
    console.hooks.utils = {};

    console.hooks.utils.init = () => {
      console.hooks.utils.preloadCache();
    };

    /**
     * Wraps a JS Proxy Handler and strips it's presence from error stacks, in case the traps throw.
     *
     * The presence of a JS Proxy can be revealed as it shows up in error stack traces.
     *
     * @param {object} handler - The JS Proxy handler to wrap
     */
    console.hooks.utils.stripProxyFromErrors = (handler = {}) => {
      const newHandler = {
        setPrototypeOf: function (target, proto) {
          if (proto === null)
            throw new TypeError("Cannot convert object to primitive value");
          if (Object.getPrototypeOf(target) === Object.getPrototypeOf(proto)) {
            throw new TypeError("Cyclic __proto__ value");
          }
          return Reflect.setPrototypeOf(target, proto);
        },
      };
      // We wrap each trap in the handler in a try/catch and modify the error stack if they throw
      const traps = Object.getOwnPropertyNames(handler);
      traps.forEach((trap) => {
        newHandler[trap] = function () {
          try {
            // Forward the call to the defined proxy handler
            return handler[trap].apply(this, arguments || []);
          } catch (err) {
            // Stack traces differ per browser, we only support chromium based ones currently
            if (!err || !err.stack || !err.stack.includes(`at `)) {
              throw err;
            }

            // When something throws within one of our traps the Proxy will show up in error stacks
            // An earlier implementation of this code would simply strip lines with a blacklist,
            // but it makes sense to be more surgical here and only remove lines related to our Proxy.
            // We try to use a known "anchor" line for that and strip it with everything above it.
            // If the anchor line cannot be found for some reason we fall back to our blacklist approach.

            const stripWithBlacklist = (stack, stripFirstLine = true) => {
              const blacklist = [
                `at Reflect.${trap} `, // e.g. Reflect.get or Reflect.apply
                `at Object.${trap} `, // e.g. Object.get or Object.apply
                `at Object.newHandler.<computed> [as ${trap}] `, // caused by this very wrapper :-)
              ];
              return (
                err.stack
                  .split("\n")
                  // Always remove the first (file) line in the stack (guaranteed to be our proxy)
                  .filter((line, index) => !(index === 1 && stripFirstLine))
                  // Check if the line starts with one of our blacklisted strings
                  .filter(
                    (line) =>
                      !blacklist.some((bl) => line.trim().startsWith(bl))
                  )
                  .join("\n")
              );
            };

            const stripWithAnchor = (stack, anchor) => {
              const stackArr = stack.split("\n");
              anchor =
                anchor || `at Object.newHandler.<computed> [as ${trap}] `; // Known first Proxy line in chromium
              const anchorIndex = stackArr.findIndex((line) =>
                line.trim().startsWith(anchor)
              );
              if (anchorIndex === -1) {
                return false; // 404, anchor not found
              }
              // Strip everything from the top until we reach the anchor line
              // Note: We're keeping the 1st line (zero index) as it's unrelated (e.g. `TypeError`)
              stackArr.splice(1, anchorIndex);
              return stackArr.join("\n");
            };

            // Special cases due to our nested toString proxies
            err.stack = err.stack.replace(
              "at Object.toString (",
              "at Function.toString ("
            );
            if ((err.stack || "").includes("at Function.toString (")) {
              err.stack = stripWithBlacklist(err.stack, false);
              throw err;
            }

            // Try using the anchor method, fallback to blacklist if necessary
            err.stack =
              stripWithAnchor(err.stack) || stripWithBlacklist(err.stack);

            throw err; // Re-throw our now sanitized error
          }
        };
      });
      return newHandler;
    };

    /**
     * Strip error lines from stack traces until (and including) a known line the stack.
     *
     * @param {object} err - The error to sanitize
     * @param {string} anchor - The string the anchor line starts with
     */
    console.hooks.utils.stripErrorWithAnchor = (err, anchor) => {
      const stackArr = err.stack.split("\n");
      const anchorIndex = stackArr.findIndex((line) =>
        line.trim().startsWith(anchor)
      );
      if (anchorIndex === -1) {
        return err; // 404, anchor not found
      }
      // Strip everything from the top until we reach the anchor line (remove anchor line as well)
      // Note: We're keeping the 1st line (zero index) as it's unrelated (e.g. `TypeError`)
      stackArr.splice(1, anchorIndex);
      err.stack = stackArr.join("\n");
      return err;
    };

    /**
     * Replace the property of an object in a stealthy way.
     *
     * Note: You also want to work on the prototype of an object most often,
     * as you'd otherwise leave traces (e.g. showing up in Object.getOwnPropertyNames(obj)).
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     *
     * @example
     * replaceProperty(WebGLRenderingContext.prototype, 'getParameter', { value: "alice" })
     * // or
     * replaceProperty(Object.getPrototypeOf(navigator), 'languages', { get: () => ['en-US', 'en'] })
     *
     * @param {object} obj - The object which has the property to replace
     * @param {string} propName - The property name to replace
     * @param {object} descriptorOverrides - e.g. { value: "alice" }
     */
    console.hooks.utils.replaceProperty = (
      obj,
      propName,
      descriptorOverrides = {}
    ) => {
      return Object.defineProperty(obj, propName, {
        // Copy over the existing descriptors (writable, enumerable, configurable, etc)
        ...(Object.getOwnPropertyDescriptor(obj, propName) || {}),
        // Add our overrides (e.g. value, get())
        ...descriptorOverrides,
      });
    };

    /**
     * Preload a cache of function copies and data.
     *
     * For a determined enough observer it would be possible to overwrite and sniff usage of functions
     * we use in our internal Proxies, to combat that we use a cached copy of those functions.
     *
     * Note: Whenever we add a `Function.prototype.toString` proxy we should preload the cache before,
     * by executing `console.hooks.utils.preloadCache()` before the proxy is applied (so we don't cause recursive lookups).
     *
     * This is evaluated once per execution context (e.g. window)
     */
    console.hooks.utils.preloadCache = () => {
      if (console.hooks.utils.cache) {
        return;
      }
      console.hooks.utils.cache = {
        // Used in our proxies
        Reflect: {
          get: Reflect.get.bind(Reflect),
          apply: Reflect.apply.bind(Reflect),
        },
        // Used in `makeNativeString`
        nativeToStringStr: Function.toString + "", // => `function toString() { [native code] }`
      };
    };

    /**
     * Utility function to generate a cross-browser `toString` result representing native code.
     *
     * There's small differences: Chromium uses a single line, whereas FF & Webkit uses multiline strings.
     * To future-proof this we use an existing native toString result as the basis.
     *
     * The only advantage we have over the other team is that our JS runs first, hence we cache the result
     * of the native toString result once, so they cannot spoof it afterwards and reveal that we're using it.
     *
     * @example
     * makeNativeString('foobar') // => `function foobar() { [native code] }`
     *
     * @param {string} [name] - Optional function name
     */
    console.hooks.utils.makeNativeString = (name = "") => {
      return console.hooks.utils.cache.nativeToStringStr.replace(
        "toString",
        name || ""
      );
    };

    /**
     * Helper function to modify the `toString()` result of the provided object.
     *
     * Note: Use `console.hooks.utils.redirectToString` instead when possible.
     *
     * There's a quirk in JS Proxies that will cause the `toString()` result to differ from the vanilla Object.
     * If no string is provided we will generate a `[native code]` thing based on the name of the property object.
     *
     * @example
     * patchToString(WebGLRenderingContext.prototype.getParameter, 'function getParameter() { [native code] }')
     *
     * @param {object} obj - The object for which to modify the `toString()` representation
     * @param {string} str - Optional string used as a return value
     */
    console.hooks.utils.patchToString = (obj, str = "") => {
      const handler = {
        apply: function (target, ctx) {
          // This fixes e.g. `HTMLMediaElement.prototype.canPlayType.toString + ""`
          if (ctx === Function.prototype.toString) {
            return console.hooks.utils.makeNativeString("toString");
          }
          // `toString` targeted at our proxied Object detected
          if (ctx === obj) {
            // We either return the optional string verbatim or derive the most desired result automatically
            return str || console.hooks.utils.makeNativeString(obj.name);
          }
          // Check if the toString protype of the context is the same as the global prototype,
          // if not indicates that we are doing a check across different windows., e.g. the iframeWithdirect` test case
          const hasSameProto = Object.getPrototypeOf(
            Function.prototype.toString
          ).isPrototypeOf(ctx.toString); // eslint-disable-line no-prototype-builtins
          if (!hasSameProto) {
            // Pass the call on to the local Function.prototype.toString instead
            return ctx.toString();
          }
          return target.call(ctx);
        },
      };

      const toStringProxy = new Proxy(
        Function.prototype.toString,
        console.hooks.utils.stripProxyFromErrors(handler)
      );
      console.hooks.utils.replaceProperty(Function.prototype, "toString", {
        value: toStringProxy,
      });
    };

    /**
     * Make all nested functions of an object native.
     *
     * @param {object} obj
     */
    console.hooks.utils.patchToStringNested = (obj = {}) => {
      return console.hooks.utils.execRecursively(
        obj,
        ["function"],
        utils.patchToString
      );
    };

    /**
     * Redirect toString requests from one object to another.
     *
     * @param {object} proxyObj - The object that toString will be called on
     * @param {object} originalObj - The object which toString result we wan to return
     */
    console.hooks.utils.redirectToString = (proxyObj, originalObj) => {
      const handler = {
        apply: function (target, ctx) {
          // This fixes e.g. `HTMLMediaElement.prototype.canPlayType.toString + ""`
          if (ctx === Function.prototype.toString) {
            return console.hooks.utils.makeNativeString("toString");
          }

          // `toString` targeted at our proxied Object detected
          if (ctx === proxyObj) {
            const fallback = () =>
              originalObj && originalObj.name
                ? console.hooks.utils.makeNativeString(originalObj.name)
                : console.hooks.utils.makeNativeString(proxyObj.name);

            // Return the toString representation of our original object if possible
            return originalObj + "" || fallback();
          }

          if (typeof ctx === "undefined" || ctx === null) {
            return target.call(ctx);
          }

          // Check if the toString protype of the context is the same as the global prototype,
          // if not indicates that we are doing a check across different windows., e.g. the iframeWithdirect` test case
          const hasSameProto = Object.getPrototypeOf(
            Function.prototype.toString
          ).isPrototypeOf(ctx.toString); // eslint-disable-line no-prototype-builtins
          if (!hasSameProto) {
            // Pass the call on to the local Function.prototype.toString instead
            return ctx.toString();
          }

          return target.call(ctx);
        },
      };

      const toStringProxy = new Proxy(
        Function.prototype.toString,
        console.hooks.utils.stripProxyFromErrors(handler)
      );
      console.hooks.utils.replaceProperty(Function.prototype, "toString", {
        value: toStringProxy,
      });
    };

    /**
     * All-in-one method to replace a property with a JS Proxy using the provided Proxy handler with traps.
     *
     * Will stealthify these aspects (strip error stack traces, redirect toString, etc).
     * Note: This is meant to modify native Browser APIs and works best with prototype objects.
     *
     * @example
     * replaceWithProxy(WebGLRenderingContext.prototype, 'getParameter', proxyHandler)
     *
     * @param {object} obj - The object which has the property to replace
     * @param {string} propName - The name of the property to replace
     * @param {object} handler - The JS Proxy handler to use
     */
    console.hooks.utils.replaceWithProxy = (obj, propName, handler) => {
      const originalObj = obj[propName];
      const proxyObj = new Proxy(
        obj[propName],
        console.hooks.utils.stripProxyFromErrors(handler)
      );

      console.hooks.utils.replaceProperty(obj, propName, { value: proxyObj });
      console.hooks.utils.redirectToString(proxyObj, originalObj);

      return true;
    };
    /**
     * All-in-one method to replace a getter with a JS Proxy using the provided Proxy handler with traps.
     *
     * @example
     * replaceGetterWithProxy(Object.getPrototypeOf(navigator), 'vendor', proxyHandler)
     *
     * @param {object} obj - The object which has the property to replace
     * @param {string} propName - The name of the property to replace
     * @param {object} handler - The JS Proxy handler to use
     */
    console.hooks.utils.replaceGetterWithProxy = (obj, propName, handler) => {
      const fn = Object.getOwnPropertyDescriptor(obj, propName).get;
      const fnStr = fn.toString(); // special getter function string
      const proxyObj = new Proxy(
        fn,
        console.hooks.utils.stripProxyFromErrors(handler)
      );

      console.hooks.utils.replaceProperty(obj, propName, { get: proxyObj });
      console.hooks.utils.patchToString(proxyObj, fnStr);

      return true;
    };

    /**
     * All-in-one method to replace a getter and/or setter. Functions get and set
     * of handler have one more argument that contains the native function.
     *
     * @example
     * replaceGetterSetter(HTMLIFrameElement.prototype, 'contentWindow', handler)
     *
     * @param {object} obj - The object which has the property to replace
     * @param {string} propName - The name of the property to replace
     * @param {object} handlerGetterSetter - The handler with get and/or set
     *                                     functions
     * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description
     */
    console.hooks.utils.replaceGetterSetter = (
      obj,
      propName,
      handlerGetterSetter
    ) => {
      const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(
        obj,
        propName
      );
      const handler = { ...ownPropertyDescriptor };

      if (handlerGetterSetter.get !== undefined) {
        const nativeFn = ownPropertyDescriptor.get;
        handler.get = function () {
          return handlerGetterSetter.get.call(this, nativeFn.bind(this));
        };
        console.hooks.utils.redirectToString(handler.get, nativeFn);
      }

      if (handlerGetterSetter.set !== undefined) {
        const nativeFn = ownPropertyDescriptor.set;
        handler.set = function (newValue) {
          handlerGetterSetter.set.call(this, newValue, nativeFn.bind(this));
        };
        console.hooks.utils.redirectToString(handler.set, nativeFn);
      }

      Object.defineProperty(obj, propName, handler);
    };

    /**
     * All-in-one method to mock a non-existing property with a JS Proxy using the provided Proxy handler with traps.
     *
     * Will stealthify these aspects (strip error stack traces, redirect toString, etc).
     *
     * @example
     * mockWithProxy(chrome.runtime, 'sendMessage', function sendMessage() {}, proxyHandler)
     *
     * @param {object} obj - The object which has the property to replace
     * @param {string} propName - The name of the property to replace or create
     * @param {object} pseudoTarget - The JS Proxy target to use as a basis
     * @param {object} handler - The JS Proxy handler to use
     */
    console.hooks.utils.mockWithProxy = (
      obj,
      propName,
      pseudoTarget,
      handler
    ) => {
      const proxyObj = new Proxy(
        pseudoTarget,
        console.hooks.utils.stripProxyFromErrors(handler)
      );

      console.hooks.utils.replaceProperty(obj, propName, { value: proxyObj });
      console.hooks.utils.patchToString(proxyObj);

      return true;
    };

    /**
     * All-in-one method to create a new JS Proxy with stealth tweaks.
     *
     * This is meant to be used whenever we need a JS Proxy but don't want to replace or mock an existing known property.
     *
     * Will stealthify certain aspects of the Proxy (strip error stack traces, redirect toString, etc).
     *
     * @example
     * createProxy(navigator.mimeTypes.__proto__.namedItem, proxyHandler) // => Proxy
     *
     * @param {object} pseudoTarget - The JS Proxy target to use as a basis
     * @param {object} handler - The JS Proxy handler to use
     */
    console.hooks.utils.createProxy = (pseudoTarget, handler) => {
      const proxyObj = new Proxy(
        pseudoTarget,
        console.hooks.utils.stripProxyFromErrors(handler)
      );
      console.hooks.utils.patchToString(proxyObj);

      return proxyObj;
    };

    /**
     * Helper function to split a full path to an Object into the first part and property.
     *
     * @example
     * splitObjPath(`HTMLMediaElement.prototype.canPlayType`)
     * // => {objName: "HTMLMediaElement.prototype", propName: "canPlayType"}
     *
     * @param {string} objPath - The full path to an object as dot notation string
     */
    console.hooks.utils.splitObjPath = (objPath) => ({
      // Remove last dot entry (property) ==> `HTMLMediaElement.prototype`
      objName: objPath.split(".").slice(0, -1).join("."),
      // Extract last dot entry ==> `canPlayType`
      propName: objPath.split(".").slice(-1)[0],
    });

    /**
     * Convenience method to replace a property with a JS Proxy using the provided objPath.
     *
     * Supports a full path (dot notation) to the object as string here, in case that makes it easier.
     *
     * @example
     * replaceObjPathWithProxy('WebGLRenderingContext.prototype.getParameter', proxyHandler)
     *
     * @param {string} objPath - The full path to an object (dot notation string) to replace
     * @param {object} handler - The JS Proxy handler to use
     */
    console.hooks.utils.replaceObjPathWithProxy = (objPath, handler) => {
      const { objName, propName } = console.hooks.utils.splitObjPath(objPath);
      const obj = eval(objName); // eslint-disable-line no-eval
      return console.hooks.utils.replaceWithProxy(obj, propName, handler);
    };

    /**
     * Traverse nested properties of an object recursively and apply the given function on a whitelist of value types.
     *
     * @param {object} obj
     * @param {array} typeFilter - e.g. `['function']`
     * @param {Function} fn - e.g. `console.hooks.utils.patchToString`
     */
    console.hooks.utils.execRecursively = (obj = {}, typeFilter = [], fn) => {
      function recurse(obj) {
        for (const key in obj) {
          if (obj[key] === undefined) {
            continue;
          }
          if (obj[key] && typeof obj[key] === "object") {
            recurse(obj[key]);
          } else {
            if (obj[key] && typeFilter.includes(typeof obj[key])) {
              fn.call(this, obj[key]);
            }
          }
        }
      }
      recurse(obj);
      return obj;
    };

    /**
     * Everything we run through e.g. `page.evaluate` runs in the browser context, not the NodeJS one.
     * That means we cannot just use reference variables and functions from outside code, we need to pass everything as a parameter.
     *
     * Unfortunately the data we can pass is only allowed to be of primitive types, regular functions don't survive the built-in serialization process.
     * This utility function will take an object with functions and stringify them, so we can pass them down unharmed as strings.
     *
     * We use this to pass down our utility functions as well as any other functions (to be able to split up code better).
     *
     * @see console.hooks.utils.materializeFns
     *
     * @param {object} fnObj - An object containing functions as properties
     */
    console.hooks.utils.stringifyFns = (fnObj = { hello: () => "world" }) => {
      // Object.fromEntries() ponyfill (in 6 lines) - supported only in Node v12+, modern browsers are fine
      // https://github.com/feross/fromentries
      function fromEntries(iterable) {
        return [...iterable].reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {});
      }
      return (Object.fromEntries || fromEntries)(
        Object.entries(fnObj)
          .filter(([key, value]) => typeof value === "function")
          .map(([key, value]) => [key, value.toString()]) // eslint-disable-line no-eval
      );
    };

    /**
     * Utility function to reverse the process of `console.hooks.utils.stringifyFns`.
     * Will materialize an object with stringified functions (supports classic and fat arrow functions).
     *
     * @param {object} fnStrObj - An object containing stringified functions as properties
     */
    console.hooks.utils.materializeFns = (
      fnStrObj = { hello: "() => 'world'" }
    ) => {
      return Object.fromEntries(
        Object.entries(fnStrObj).map(([key, value]) => {
          if (value.startsWith("function")) {
            // some trickery is needed to make oldschool functions work :-)
            return [key, eval(`() => ${value}`)()]; // eslint-disable-line no-eval
          } else {
            // arrow functions just work
            return [key, eval(value)]; // eslint-disable-line no-eval
          }
        })
      );
    };

    // Proxy handler templates for re-usability
    console.hooks.utils.makeHandler = () => ({
      // Used by simple `navigator` getter evasions
      getterValue: (value) => ({
        apply(target, ctx, args) {
          // Let's fetch the value first, to trigger and escalate potential errors
          // Illegal invocations like `navigator.__proto__.vendor` will throw here
          console.hooks.utils.cache.Reflect.apply(...arguments);
          return value;
        },
      }),
    });

    /**
     * Compare two arrays.
     *
     * @param {array} array1 - First array
     * @param {array} array2 - Second array
     */
    console.hooks.utils.arrayEquals = (array1, array2) => {
      if (array1.length !== array2.length) {
        return false;
      }
      for (let i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    };

    /**
     * Cache the method return according to its arguments.
     *
     * @param {Function} fn - A function that will be cached
     */
    console.hooks.utils.memoize = (fn) => {
      const cache = [];
      return function (...args) {
        if (!cache.some((c) => console.hooks.utils.arrayEquals(c.key, args))) {
          cache.push({ key: args, value: fn.apply(this, args) });
        }
        return cache.find((c) => console.hooks.utils.arrayEquals(c.key, args))
          .value;
      };
    };
  }
  // auto run init
  console.hooks.init();
})();
