// ==UserScript==
// @name         Xaos Mobile
// @version      4.0.3
// @description  Скрипт для игры Наследие Хаоса
// @author       The Big (2023)
// @include      *://xaos.mobi/*
// @include      *://xaoc.mobi/*
// @include      *://*.xaos.mobi/*
// @include      *://*.xaoc.mobi/*
// @include      *://xaos.spaces-games.com/*
// @include      *://xaos.play.tegos.ru/*
// @include      *://xaos.mgates.ru/*
// @icon         http://xaos.mobi/favicon.ico
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace https://skile.ru/xaos
// @downloadURL https://update.greasyfork.org/scripts/477643/Xaos%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/477643/Xaos%20Mobile.meta.js
// ==/UserScript==

'use strict';
/** @type {function(!Function): ?} */
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(regionData) {
  return typeof regionData;
} : function(obj) {
  return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" :
    typeof obj;
};
(function(self, document, undefined) {
  /**
   * @param {string} seletor
   * @return {?}
   */
  function parse(seletor) {
    return document.querySelector(seletor);
  }
  /**
   * @param {string} elem
   * @return {?}
   */
  function get(elem) {
    return document.querySelectorAll(elem);
  }
  /**
   * @return {undefined}
   */
  function expect() {
    console.log.apply(console, arguments);
  }
  /**
   * @param {!Object} func
   * @return {?}
   */
  function func(func) {
    return Object.prototype.toString.call(func);
  }
  /**
   * @param {string} text
   * @return {?}
   */
  function exec(text) {
    throw new Error(text || "stop");
  }
  /**
   * @param {!Object} obj
   * @param {!Function} callback
   * @return {?}
   */
  function forEach(obj, callback) {
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var forTotal = 0;
    /** @type {string} */
    var key = "";
    /** @type {string} */
    var type = "";
    if ("function" != typeof callback) {
      throw new TypeError("forEach: callBack should be function, " + ("undefined" == typeof callback ?
        "undefined" : _typeof(callback)) + "given.");
    }
    switch (func(obj)) {
      case "[object Array]":
      case "[object HTMLCollection]":
      case "[object NodeList]":
        /** @type {string} */
        type = "array";
        break;
      case "[object Object]":
        /** @type {string} */
        type = "object";
        break;
      case "[object String]":
        /** @type {string} */
        type = "string";
        break;
      default:
        throw type = func(obj), new TypeError("forEach: collection should be array, object or string, " + type +
          " given.");
    }
    switch (type) {
      case "array":
        /** @type {number} */
        i = 0;
        forTotal = obj.length;
        for (; i < forTotal; i = i + 1) {
          callback(obj[i], i);
        }
        break;
      case "string":
        /** @type {number} */
        i = 0;
        forTotal = obj.length;
        for (; i < forTotal; i = i + 1) {
          callback(obj.charAt(i), i);
        }
        break;
      case "object":
        for (key in obj) {
          if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            callback(obj[key], key);
          }
        }
        break;
      default:
        throw new Error("Continuity error in forEach, this should not be possible.");
    }
    return null;
  }
  /**
   * @param {number} data
   * @param {string} name
   * @param {string} value
   * @return {?}
   */
  function init(data, name, value) {
    data = "object" === ("undefined" == typeof data ? "undefined" : _typeof(data)) ? JSON.stringify(data) : data.toString();
    if (!(name && "" != name)) {
      /** @type {string} */
      name = "info";
    }
    var blink_timer;
    var b;
    var topValue;
    var interval;
    /** @type {string} */
    var dir = "xaosjs_notify";
    var a = parse("#" + dir);
    return interval = "info" === name ? 150 * data.length : 3e5, a ? (expect(name, data), b = callback({
      text: data,
      class: name
    }), utility && (topValue = parseInt(self.pageYOffset || document.documentElement.scrollTop || document.body
      .scrollTop), a.style.top = topValue + "px"), setTimeout(function() {
      b.classList.add("active");
    }, 1), b.remove = function() {
      if (b) {
        if (blink_timer) {
          clearTimeout(blink_timer);
        }
        this.classList.remove("active");
        setTimeout(function() {
          a.removeChild(b);
        }, 500);
      }
    }, !utility && (3e4 < interval || value) && setTimeout(function() {
      b.classList.add("opacity");
    }, 1e4), !value && 3e5 > interval && (blink_timer = setTimeout(function() {
      b.remove();
    }, interval)), b.onclick = function() {
      this.remove();
      if ("function" == typeof value) {
        value(data);
      }
    }, b.appendTo(a), b) : (debug("#" + dir +
      "{transition: top 100ms;z-index:2147483647;left:0px;position:absolute;}#" + dir +
      ">div{display:table;cursor:pointer;border-bottom-right-radius:4px;padding:.5em;margin:.3em 0;border-top-right-radius:4px;opacity:0;visibility:hidden;transition:opacity .3s,visibility 0s linear .3s}#" +
      dir + ">div.active{opacity:1;visibility:visible;transition-delay:0s}#" + dir +
      ">div.opacity{opacity:.6;transition:opacity 15s cubic-bezier(0.55,0.09,0.68,0.53);}#" + dir +
      ">.opacity:hover {opacity: 1;transition: opacity .3s linear;}#" + dir +
      ">div.info{background-color: #59db39;color: #e3f2fd;}#" + dir +
      ">div.err{background-color: #D84315;color: #FBE9E7;}#" + dir +
      ">div.warn{background-color: #F9A825;color: #212121;}"), a = callback({
      id: dir
    }).appendTo(document.body), topValue = parseInt(self.pageYOffset || document.documentElement.scrollTop ||
      document.body.scrollTop), a.style.top = topValue + "px", document.onscroll = function() {
      /** @type {number} */
      var shift = parseInt(self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
      if (parseInt(a.style.top) > shift) {
        /** @type {string} */
        a.style.top = shift + "px";
      } else {
        if (!utility) {
          /** @type {string} */
          a.style.top = shift + "px";
        }
      }
    }, init.apply(this, arguments));
  }
  /**
   * @param {!Object} value
   * @return {?}
   */
  function assert(value) {
    if (value == undefined) {
      return false;
    }
    try {
      JSON.parse(value);
    } catch (ua) {
      return false;
    }
    return true;
  }
  /**
   * @return {?}
   */
  function removeUpload() {
    return init("\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e!"), $("set", JSON.stringify(options)),
      true;
  }
  /**
   * @param {!Object} doc
   * @return {?}
   */
  function getDocRect(doc) {
    doc = doc || document;
    var htmlElt = "CSS1Compat" === doc.compatMode ? doc.documentElement : doc.body;
    return [htmlElt.clientWidth, htmlElt.clientHeight];
  }
  /**
   * @param {string} key
   * @param {number} val
   * @return {?}
   */
  function $(key, val) {
    var name = cookie + ".";
    if (key = name + key, val === undefined) {
      var ret = gm_storage ? GM_getValue(key, null) : localStorage[key];
      return parseFloat(ret) == ret && (ret = parseFloat(ret)), ret;
    }
    return val = "true" == val || true === val ? 1 : "false" == val || false === val ? 0 : val, gm_storage ?
      GM_setValue(key, val) : localStorage.setItem(key, val);
  }
  /**
   * @param {!Object} data
   * @return {?}
   */
  function c(data) {
    return "object" === ("undefined" == typeof data ? "undefined" : _typeof(data));
  }
  /**
   * @param {!Node} element
   * @return {?}
   */
  function offset(element) {
    var targetOffset;
    var body;
    var docElem;
    var targetTopCenter;
    var targetOuterWidth;
    var comboTop;
    var elementOuterWidth;
    var fromTop;
    var left;
    return targetOffset = element.getBoundingClientRect(), body = document.body, docElem = document.documentElement,
      targetTopCenter = self.pageYOffset || docElem.scrollTop || body.scrollTop, targetOuterWidth = self.pageXOffset ||
      docElem.scrollLeft || body.scrollLeft, comboTop = docElem.clientTop || body.clientTop || 0,
      elementOuterWidth = docElem.clientLeft || body.clientLeft || 0, fromTop = targetOffset.top +
      targetTopCenter - comboTop, left = targetOffset.left + targetOuterWidth - elementOuterWidth, {
        top: Math.round(fromTop),
        left: Math.round(left)
      };
  }
  /**
   * @param {!Object} a
   * @return {?}
   */
  function append(a) {
    /**
     * @param {!Object} str
     * @return {?}
     */
    function callback(str) {
      if ("[object String]" !== func(str)) {
        return "";
      }
      if ("undefined" == typeof str) {
        return "";
      }
      if (pathCache[str]) {
        return pathCache[str];
      }
      var path;
      var DIACRITICS = {
        a: "\u0430",
        b: "\u0432",
        c: "\u0441",
        k: "\u043a",
        m: "\u043c",
        h: "\u043d",
        o: "\u043e",
        p: "\u0440",
        t: "\u0442",
        y: "\u0443",
        x: "\u0445",
        e: "\u0435",
        r: "\u0433",
        u: "\u0438"
      };
      return path = str.trim().toLowerCase(), path = path.replace(/[a-z]/gm, function(a) {
        return DIACRITICS[a] || a;
      }), pathCache[str] = path, path;
    }
    var result;
    return c(a) ? (result = [], forEach(a, function(canCreateDiscussions, i) {
      result[i] = callback(a[i].text);
    })) : result = callback(a), result;
  }
  /**
   * @param {string} param
   * @param {number} cb
   * @return {?}
   */
  function range(param, cb) {
    var pseudoNames = param.split("_");
    return 1 == cb % 10 && 11 != cb % 100 ? pseudoNames[0] : 2 <= cb % 10 && 4 >= cb % 10 && (10 > cb % 100 || 20 <=
      cb % 100) ? pseudoNames[1] : pseudoNames[2];
  }
  /**
   * @param {!Node} el
   * @return {?}
   */
  function show(el) {
    var pos = offset(el);
    var cw = el.offsetWidth;
    var ch = el.offsetHeight;
    /** @type {(CSSStyleDeclaration|null)} */
    var s = getComputedStyle(el);
    if ("none" == s.display || "" == s.display || "hidden" == s.visibility || 1 > s.opacity || !(0 < cw && 0 < ch)) {
      return false;
    }
    var target = el.parentNode;
    return ("body" === target.nodeName.toLowerCase() || show(target)) && pos;
  }
  /**
   * @param {!Node} e
   * @return {?}
   */
  function cellDblClicked(e) {
    if (!e) {
      return false;
    }
    var pos;
    var box = {
      top: 0,
      left: 0
    };
    return pos = show(e), !!pos && (0 < pos.top || 0 < pos.left) && (p.top > pos.top && pos.top < height ? (box.top =
      pos.top, box.left = pos.left, pos.top < height / 3 && (box.top = height / 3)) : box = {
      top: Math.max(pos.top, p.top) - Math.min(pos.top, p.top),
      left: Math.max(pos.left, p.left) - Math.min(pos.left, p.left)
    }, $("oldPos", JSON.stringify(pos)), options.timeout = Math.round(box.top * options.speed + box.left *
      options.speed), true);
  }
  /**
   * @param {number} text
   * @return {?}
   */
  function debug(text) {
    return callback({
      el: "style",
      type: "text/css",
      text: text
    }).appendTo(document.head);
  }
  /**
   * @param {!Object} element
   * @param {!Function} data
   * @return {undefined}
   */
  function link(element, data) {
    /** @type {boolean} */
    var _0x8E9E = false;
    /** @type {null} */
    var timeoutId = null;
    if ("function" != typeof data) {
      throw new TypeError("longClick: callBack should be function, " + ("undefined" == typeof data ? "undefined" :
        _typeof(data)) + "given.");
    }
    /**
     * @return {undefined}
     */
    var touchStart = function() {
      if (null != timeoutId) {
        clearTimeout(timeoutId);
        /** @type {null} */
        timeoutId = null;
      }
      this.classList.remove("LongrohtuasieliksiPress");
    };
    /**
     * @param {!Object} event
     * @return {?}
     */
    var callback = function(event) {
      if ("click" !== event.type || 0 === event.button) {
        return _0x8E9E = false, this.classList.add("LongrohtuasieliksiPress"), timeoutId = setTimeout(
          function() {
            /** @type {boolean} */
            _0x8E9E = true;
            data(2, element);
          }, 1e3), false;
      }
    };
    element.addEventListener("mousedown", callback);
    element.addEventListener("touchstart", callback);
    element.addEventListener("click", function hideUsernameBox() {
      return null != timeoutId && (clearTimeout(timeoutId), timeoutId = null), this.classList.remove(
        "LongrohtuasieliksiPress"), !_0x8E9E && void data(1, element);
    });
    element.addEventListener("mouseout", touchStart);
    element.addEventListener("touchend", touchStart);
    element.addEventListener("touchleave", touchStart);
    element.addEventListener("touchcancel", touchStart);
    element.addEventListener("mousemove", function(event) {
      if ("on" == event.target.getAttribute("unselectable")) {
        event.target.ownerDocument.defaultView.getSelection().removeAllRanges();
      }
    }, false);
  }
  /**
   * @param {!Object} e
   * @param {!HTMLElement} value
   * @return {?}
   */
  function cb(e, value) {
    /**
     * @param {!Element} link
     * @return {undefined}
     */
    function wrap(link) {
      location.assign(link.href);
      exec();
    }
    var pos;
    var result;
    var updateElementsText = value.querySelectorAll("a");
    /** @type {boolean} */
    var _0x8EFA = false;
    if (!(imgBoxElem || imgBoxElem && ch)) {
      return ~func(value).indexOf("[object HTML") ? (c(e) || (e = [e]), forEach(updateElementsText, function(item) {
        forEach(e, function(canCreateDiscussions, i) {
          if (!_0x8EFA && (result = append(item.textContent), ~result.indexOf(e[i]))) {
            if (cellDblClicked(item)) {
              /** @type {boolean} */
              _0x8EFA = true;
              if (!ch) {
                /** @type {boolean} */
                imgBoxElem = true;
                if (options.scroll) {
                  pos = offset(item);
                  if (pos && pos.top > height) {
                    self.scrollTo(0, pos.top - height / 2 + item.offsetHeight / 2);
                  }
                }
                /** @type {string} */
                item.style.border = "3px solid #00A321";
                if (options.sleep > options.timeout) {
                  options.timeout = options.sleep;
                }
                if (1 < options.timeout) {
                  setTimeout(function() {
                    wrap(item);
                  }, options.timeout);
                } else {
                  wrap(item);
                }
              }
            } else {
              if (options.debug) {
                var w = "InDiv: " + item.outerHTML + "\ntext: " + e[i];
                expect(w, item);
                params.add(w);
              }
            }
          }
        });
      }), _0x8EFA) : void 0;
    }
  }
  /**
   * @param {string} data
   * @param {boolean} p
   * @return {?}
   */
  function mkdirIfNotExist(data, p) {
    /**
     * @param {!Element} link
     * @return {undefined}
     */
    function getInlineContent(link) {
      location.assign(link.href);
      exec();
    }
    if (!(imgBoxElem || imgBoxElem && ch)) {
      if (!c(data)) {
        /** @type {!Array} */
        data = [data];
      }
      var obj;
      var p;
      var result;
      /** @type {boolean} */
      var dest = false;
      /** @type {boolean} */
      var title = false;
      /** @type {boolean} */
      var id = false;
      /** @type {number} */
      var val = 0;
      return forEach(document.links, function(element) {
        forEach(data, function(canCreateDiscussions, i) {
          if (!dest && (result = append(element.innerHTML), p ? title = (new RegExp(data[i], "i"))
              .test(result) : id = ~result.indexOf(data[i]), title || id)) {
            if (cellDblClicked(element)) {
              forEach(element.childNodes, function(node) {
                if ("IMG" === node.nodeName.toUpperCase() && /energy\.\w{3}$/i.test(node.src)) {
                  if (null !== node.nextSibling) {
                    var html = node.nextSibling.nodeValue;
                    if (/\+\s*\d+/.test(html)) {
                      return;
                    }
                  }
                  /** @type {(Array<string>|null)} */
                  obj = /^\s*(\d+)\s*$/.exec(html);
                  if (null === obj) {
                    /** @type {(Array<string>|null)} */
                    obj = /(\d+)/.exec(html);
                    if (null != obj) {
                      /** @type {number} */
                      val = 5 * +obj[1];
                    }
                  } else {
                    /** @type {string} */
                    val = obj[1];
                  }
                }
              });
              if (v >= val) {
                p = offset(element);
                if (options.scroll) {
                  p = offset(element);
                  if (p && p.top > height) {
                    self.scrollTo(0, p.top - height / 2 + element.offsetHeight / 2);
                  }
                }
                if (!ch) {
                  /** @type {boolean} */
                  imgBoxElem = true;
                  /** @type {string} */
                  element.style.border = "3px solid blue";
                  if (options.sleep > options.timeout) {
                    options.timeout = options.sleep;
                  }
                  if (1 < options.timeout) {
                    setTimeout(function() {
                      getInlineContent(element);
                    }, options.timeout);
                  } else {
                    getInlineContent(element);
                  }
                }
                /** @type {boolean} */
                dest = true;
              } else {
                if (p) {
                  /** @type {number} */
                  dest = 0;
                }
                /** @type {string} */
                element.style.border = "3px solid #d35400";
              }
            } else {
              if (options.debug) {
                var w = "Global: " + element.outerHTML + "\n" + (title ? "regex" : "text") +
                  ": " + data[i];
                expect(w, element);
                params.add(w);
              }
            }
          }
        });
      }), dest;
    }
  }
  
  function goTo(element) {
    function getInlineContent(link) {
      location.assign(link.href);
      exec();
    }
    element.style.border = "3px solid blue";
    if (options.sleep > options.timeout) {
      options.timeout = options.sleep;
    }
    if (1 < options.timeout) {
      setTimeout(function() {
        getInlineContent(element);
      }, options.timeout);
    } else {
      getInlineContent(element);
    }
  }
  
  /**
   * @param {!Object} input
   * @param {!HTMLElement} output
   * @return {?}
   */
  function AddChar(input, output) {
    var $c$;
    var data;
    return $c$ = ch, ch = true, data = cb(input, output), ch = $c$, data;
  }
  /**
   * @param {string} pathname
   * @param {boolean} params
   * @return {?}
   */
  function join(pathname, params) {
    var $c$;
    var stream;
    return $c$ = ch, ch = true, stream = mkdirIfNotExist(pathname, params), ch = $c$, stream;
  }
  /**
   * @return {undefined}
   */
  function start() {
    /** @type {number} */
    var scrollTop = self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (!self.setMenu.added) {
      debug(
        ".opacityChange{animation-name:opacityChange;animation-duration:.5s;-webkit-animation-duration:.5s;animation-timing-function:ease-out;visibility:visible!important}@keyframes opacityChange{0%{opacity:.1}100%{opacity:1}}"
      );
      renderPaging();
      /** @type {boolean} */
      self.setMenu.added = true;
    }
    self.setMenu.style = debug("body{overflow:hidden;}#xaosjsSet{display:block!important;top:" + scrollTop +
      "px!important;}");
    setTimeout(function() {
      self.scrollTo(0, scrollTop);
      if (options.animation) {
        parse("#xaosjsSet>.container").classList.add("opacityChange");
      }
    }, 1);
  }
  /**
   * @return {undefined}
   */
  function renderPaging() {
    render();
  }
  /**
   * @return {?}
   */
  function render() {
    /**
     * @return {undefined}
     */
    function close() {
      if (options.animation) {
        parse("#xaosjsSet>.container").classList.remove("opacityChange");
      }
      self.setMenu.style.remove();
    }
    var element;
    var body;
    var group;
    var header;
    var el;
    var after;
    var container;
    var row;
    var node;
    var result;
    var div;
    var a = get("body");
    return debug(
        "#xaosjsSet{display:none;position:absolute;top:0;left:0;height:100%;width:100%;background-color:rgba(0,0,0,.8);transition:all .5s}#xaosjsSet>.container{" +
        (options.animation ? "visibility:hidden;" : "") +
        "max-width:480px;overflow:auto;max-height:100%;color:#E2E8F0;margin:0 auto}#xaosjsSet>.container>.main{background:url(style/bg3.jpg);color:khaki;padding:1em;margin:1em auto;border-radius:10px}#xaosjsSet .header{border-bottom:1px solid #0f172a;margin-bottom:.5em}#xaosjsSet .header .close{float:right;cursor:pointer}#xaosjsSet input[type=text],input[type=number]{border:1px solid #0b0b0b;padding:3px;color:white;background-color:#131313;color:#d1d1d1;border-radius:5px;font-size:16px;background-image:url(style2/bg5.png)}#xaosjsSet .item{padding:4px 0;border-bottom:1px solid #0f172a;margin:4px 0}#xaosjsSet .item .subitem{margin:7px 0 7px 0,7em;padding:4px;background-image:url(style/bg2.jpg);border:1px solid #131313;display:block}#xaosjsSet input{vertical-align:middle}#xaosjsSet .footer,#xaosjsSet .footer a{color:#94A3B8}#xaosjsSet .footer a:hover{color:#64748B}"
      ),
      a = a[a.length - 1], element = document.createElement("div"), element.id = "xaosjsSet", element.addEventListener(
        "click",
        function(targ) {
          if (targ.target.isEqualNode(element)) {
            close();
          }
        }), body = document.createElement("div"), body.className = "container", group = document.createElement(
        "div"), group.className = "main", header = document.createElement("div"), header.className = "header",
      el = document.createElement("span"), el.className = "close", el.textContent =
      "применить", el.onclick = close, header.appendChild(el), after = document.createElement(
        "h1"), after.textContent = "установки",
      header.appendChild(after), group.appendChild(header), container = document.createElement("div"), container.className =
      "menu", row = document.createElement("div"), row.className = "item", node = document.createElement("label"),
      node.appendChild(document.createTextNode("Скорость: ")), result =
      document.createElement("input"), result.type = "text", result.value = options.speed, result.onchange =
      function() {
        /** @type {number} */
        var value = parseFloat(this.value);
        if (!isNaN(value) && 0 <= value) {
          /** @type {number} */
          options.speed = value;
          removeUpload();
        } else {
          init("Введите цифру");
        }
      }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Задержка (мс): "
      )), result = document.createElement("input"), result.type = "number", result.min = 0, result.value =
      options.sleep, result.onchange = function() {
        /** @type {number} */
        var value = parseInt(this.value);
        if (!isNaN(value) && 0 <= value) {
          /** @type {number} */
          options.sleep = value;
          removeUpload();
        } else {
          init("Введите цифру");
        }

      }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Автообновление страницы: ")), result = document.createElement(
        "input"), result.type = "checkbox", result.checked = options.aUpdate, result.onchange = function() {
        options.aUpdate = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), node = document.createElement("label"), node.className =
      "subitem", node.appendChild(document.createTextNode(
        "Периодичность (мс): "
      )), result = document.createElement("input"), result.type = "number", result.min = 0, result.value =
      options.autoUpdate, result.onchange = function() {
        /** @type {number} */
        var value = parseInt(this.value);
        if (!isNaN(value) && 0 <= value) {
          /** @type {number} */
          options.autoUpdate = value;
          removeUpload();
        } else {
          init("Введите цифру");
        }

      }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Призрачный Разлом: ")), result = document.createElement("input"), result.type =
      "checkbox", result.checked = options.fault, result.onchange = function() {
        options.fault = this.checked;
        removeUpload();
         }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Арена смерти: ")), result = document.createElement("input"), result.type =
      "checkbox", result.checked = options.arena, result.onchange = function() {
        options.arena = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Разбор Рюкзака: ")), result = document
      .createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.enable, result.onchange =
      function() {
        options.razborRukzaka.enable = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), node = document.createElement("label"), node.className =
      "subitem", node.appendChild(document.createTextNode("Открывать сундуки: ")), result =
      document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.sunduk,
      result.onchange = function() {
        options.razborRukzaka.sunduk = this.checked;
        removeUpload();
      }, node.appendChild(result), node.appendChild(document.createTextNode("; открыть n коробок: ")), result =
      document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.alleBox,
      result.onchange = function() {
        options.razborRukzaka.alleBox = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node),
      node = document.createElement("label"), node.className =
      "subitem", node.appendChild(document.createTextNode("Продавать банки: "
      )), result = document.createElement("input"), result.type = "checkbox", result.checked = options.autoSellPotions,
      result.onchange = function() {
        options.autoSellPotions = this.checked;
        removeUpload();
      }, node.appendChild(result),
      node.appendChild(document.createTextNode("; продать энку до +1500: ")), result =
      document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.enka,
      result.onchange = function() {
        options.razborRukzaka.enka = this.checked;
        removeUpload();
      }, node.appendChild(result), 
      row.appendChild(node),
      node = document.createElement("label"), node.className =
      "subitem", node.appendChild(document.createTextNode("Продавать камни: силы ")), result = document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.samocvet['силы'], result.onchange = function() {
        options.razborRukzaka.samocvet['силы'] = this.checked;
        removeUpload();
      }, node.appendChild(result), node.appendChild(document.createTextNode(", здоровья ")), result = document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.samocvet['здоровья'], result.onchange = function() {
        options.razborRukzaka.samocvet['здоровья'] = this.checked;
        removeUpload();
      }, node.appendChild(result),
      node.appendChild(document.createTextNode(", защиты ")), result = document.createElement("input"), result.type = "checkbox", result.checked = options.razborRukzaka.samocvet['защиты'], result.onchange = function() {
        options.razborRukzaka.samocvet['защиты'] = this.checked;
        removeUpload();
      }, node.appendChild(result),
      row.appendChild(node),
        container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Уведомления: ")), result = document.createElement(
        "input"), result.type = "checkbox", result.checked = options.notifications.enable, result.onchange =
      function() {
        options.notifications.enable = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), node = document.createElement("label"), node.className =
      "subitem", node.appendChild(document.createTextNode(
        "На всех страницах: ")),
      result = document.createElement("input"), result.type = "checkbox", result.checked = options.notifications.allPages,
      result.onchange = function() {
        options.notifications.allPages = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), container.appendChild(row), row = document.createElement(
        "div"), row.className = "item", node = document.createElement("label"), node.appendChild(document.createTextNode(
        "Автоюз энергии: "
      )), result = document.createElement("input"), result.type = "checkbox", result.checked =
      options.autoUseEnergy.enable, result.onchange = function() {
        options.autoUseEnergy.enable = this.checked;
        removeUpload();
      }, node.appendChild(result), row.appendChild(node), forEach(energyList, function(name) {
        name = name.toString();
        /** @type {!Element} */
        node = document.createElement("label");
        /** @type {string} */
        node.className = "subitem";
        node.appendChild(document.createTextNode("Энергия +" + name + ": "));
        /** @type {!Element} */
        result = document.createElement("input");
        /** @type {string} */
        result.type = "checkbox";
        result.checked = options.autoUseEnergy[name];
        /** @type {string} */
        result.name = name;
        /**
         * @return {undefined}
         */
        result.onchange = function() {
          options.autoUseEnergy[this.name] = this.checked;
          removeUpload();
        };
        node.appendChild(result);
        row.appendChild(node);
      }), node.appendChild(result), row.appendChild(node), container.appendChild(row), group.appendChild(container),
      div = document.createElement("div"), div.className = "footer", div.innerHTML =
      '&copy; triumph 2023', group.appendChild(
        div), body.appendChild(group), element.appendChild(body), a.appendChild(element), true;
  }
  /**
   * @return {undefined}
   */
  function draw() {
    var set_tags;
    var src;
    src = get('body > div.box ~ div[style] > div[style="font-size:12px"]');
    if (null == src) {
      src = get("body > div.box > div");
      if (null == src) {
        src = get("*");
      }
    }
    src = src[src.length - 1];
    /** @type {string} */
    set_tags = "<br>Triumph edition &copy; 2021<br>";
    debug("#xaosjsFooter p{margin: 1em 0px}");
    if (!(gm_storage || _0x8AAA)) {
      /** @type {string} */
      set_tags = set_tags +
        '<p><small>Для лучшей работы установите tampermonkey или greasemonkey! <a href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo">tampermonkey</a> \u0438\u043b\u0438 <a href="https://addons.mozilla.org/RU/firefox/addon/greasemonkey/">greasemonkey</a>!</small></p>';
    }
    callback({
      html: '',
      id: "xaosjsFooter",
      style: {
        color: "#a5a5a5",
        fontSize: "14px",
        textAlign: "center"
      },
      child: {
        el: "p",
        child: {
          el: "a",
          href: "#",
          text: "настройки",
          click: function formatNumber() {
            start();
          }
        }
      }
    }).after(src);
  }
  /**
   * @param {number} i
   * @param {number} n
   * @return {?}
   */
  function filter(i, n) {
    var obj = {
      d: 0,
      h: 0,
      m: 0,
      s: 0
    };
    /** @type {string} */
    var pix_color = "";
    return i = parseInt(i), n = 2 === n ? 2 : 1, obj.d = 0 ^ i / 86400, obj.s = i - 60 * (60 * (24 * obj.d)), obj.h =
      0 ^ obj.s / 3600, obj.s -= 60 * (60 * obj.h), obj.m = 0 ^ obj.s / 60, obj.s -= 60 * obj.m, 2 === n &&
      forEach(obj, function(value, x) {
        if (!("d" == x)) {
          if (10 > value) {
            /** @type {string} */
            obj[x] = "0" + value;
          }
        }
      }), 0 < +obj.d && (pix_color = pix_color + (obj.d + " " + range(
        "\u0434\u0435\u043d\u044c_\u0434\u043d\u044f_\u0434\u043d\u0435\u0439", obj.d) + " ")), 0 < +obj.h && (
        pix_color = pix_color + (obj.h + (1 == n ? "\u0447. " : ":"))), (0 < +obj.m || 2 === n) && (pix_color =
        pix_color + (obj.m + (1 == n ? "\u043c. " : ":"))), (0 == +obj.h && 1 == n || 2 === n || 0 == +obj.m) &&
      (pix_color = pix_color + (obj.s + (1 == n ? "\u0441." : ""))), pix_color;
  }
  /**
   * @param {string} s
   * @return {?}
   */
  function trim(s) {
    var type;
    var mask;
    var data;
    var f;
    var regexMask;
    return /\d+:\d+/.test(s) ? (regexMask = s.match(/(\d+):(\d+)/), mask = 0, type = 0, data = +regexMask[1] || 0,
        f = +regexMask[2] || 0) : (type = s.match(/(\d+)(?:\s*\u0434)/i), mask = s.match(/(\d+)(?:\s*\u0447)/i),
        data = s.match(/(\d+)(?:\s*\u043c)/i), f = s.match(/(\d+)(?:\s*\u0441)/i), type = null === type ? 0 : +
        type[1], mask = null === mask ? 0 : +mask[1], data = null === data ? 0 : +data[1], f = null === f ? 0 :
        +f[1]), type = 24 * (3600 * type), mask = mask * 3600, data = data * 60, type +
      mask + data + f;
  }
  /**
   * @return {?}
   */
  function set() {
    if (!options.autoUseEnergy.enable || ~el.indexOf("\u0440\u044e\u043a\u0437\u0430\u043a")) {
      return false;
    }
    var _0x8E9E;
    var updateElementsText = {};
    /** @type {number} */
    _0x8E9E = 100 * v / fmax;
    if (10 >= _0x8E9E) {
      $("updEnergy", 1);
      /** @type {boolean} */
      inputel = true;
    }
    forEach(energyList, function(name) {
      if (options.autoUseEnergy[name] && name + v <= fmax) {
        /** @type {null} */
        updateElementsText[name] = null;
      }
    });
    forEach(updateElementsText, function(isSlidingUp, canCreateDiscussions) {
      mkdirIfNotExist("\u044d\u043d\u0435\u0440\u0433\u0438\u044f +" + canCreateDiscussions);
    });
    if (!imgBoxElem) {
      $("updEnergy", 0);
    }
  }
  /**
   * @param {!Object} obj
   * @param {!Object} args
   * @return {?}
   */
  function create(obj, args) {
    return forEach(obj, function(data, i) {
      try {
        if ("object" == ("undefined" == typeof data ? "undefined" : _typeof(data)) && "object" == _typeof(
            args[i])) {
          obj[i] = create(obj[i], args[i]);
        } else {
          if (args[i] !== undefined) {
            obj[i] = args[i];
          }
        }
      } catch (xa) {}
    }), obj;
  }
  /**
   * @param {!Object} obj
   * @return {?}
   */
  function callback(obj) {
    if (!c(obj) || 0 == Object.keys(obj).length) {
      return void(obj = {});
    }
    /** @type {!Element} */
    var self = document.createElement(obj.el || "div");
    var data = {
      class: "className",
      html: "innerHTML"
    };
    return forEach(obj, function(log, type) {
      switch (type) {
        case "text":
          if ("input" == obj.el) {
            /** @type {number} */
            self.value = log;
          } else {
            /** @type {number} */
            self.textContent = log;
          }
          break;
        case "change":
          /**
           * @param {?} data
           * @return {undefined}
           */
          self.onchange = function(data) {
            log.call(this, data);
          };
          if ("checkbox" != obj.type) {
            /**
             * @param {?} event
             * @return {undefined}
             */
            self.onkeyup = function(event) {
              log.call(this, event);
            };
          }
          break;
        case "click":
          /**
           * @param {?} event
           * @return {undefined}
           */
          self.onclick = function(event) {
            log.call(this, event);
          };
          break;
        case "child":
          if (~func(obj.child).indexOf("[object HTML")) {
            self.appendChild(obj.child);
          } else {
            if ("[object Object]" == func(obj.child)) {
              self.appendChild(callback(obj.child));
            }
          }
          break;
        default:
          if (data[type] !== undefined && (type = data[type]), self[type] === undefined) {
            return;
          }
          if ("object" === _typeof(obj[type])) {
            forEach(obj[type], function(loadedPlugin, name) {
              self[type][name] = loadedPlugin;
            });
          } else {
            self[type] = log.toString();
          }
      }
    }), self.appendTo = function(object) {
      return object.appendChild(self);
    }, self.after = function(elt) {
      return elt.parentNode.insertBefore(self, elt.nextSibling);
    }, self.remove = function() {
      return self.parentNode.removeChild(self);
    }, self;
  }
  /**
   * @param {?} c
   * @return {undefined}
   */
  function decode(c) {
    if (!(imgBoxElem || $("stopGoTo"))) {
      if (c && "" != c.trim()) {
        $("goTo", c);
      }
      c = c || $("goTo");
      /** @type {boolean} */
      var _0x8E70 = false;
      if (c && "" != c.trim()) {
        forEach({
          "\u0430\u0440\u0435\u043d\u0430 \u0441\u043c\u0435\u0440\u0442\u0438": [
            "\u0430\u0440\u0435\u043d\u0430 \u0441\u043c\u0435\u0440\u0442\u0438"
          ],
          "\u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044f": [
            "\u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435"
          ],
          "\u0430\u043b\u0445\u0438\u043c\u0438\u043a": [
            "\u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u044b\u0439 \u043b\u0430\u0433\u0435\u0440\u044c",
            "\u0430\u043b\u0445\u0438\u043c\u0438\u043a"
          ],
          "\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f": [
            "\u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u044b\u0439 \u043b\u0430\u0433\u0435\u0440\u044c",
            "\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f"
          ],
          "\u043f\u0435\u0441\u043a\u0438 \u0437\u0430\u0431\u0432\u0435\u043d\u0438\u044f": [
            "\u0431\u0435\u0437\u0434\u043d\u0430 \u0445\u0430\u043e\u0441\u0430",
            "\u043f\u0435\u0441\u043a\u0438 \u0437\u0430\u0431\u0432\u0435\u043d\u0438\u044f"
          ],
          "\u0430\u0441\u0442\u0440\u0430\u043b": [
            "\u0431\u0435\u0437\u0434\u043d\u0430 \u0445\u0430\u043e\u0441\u0430",
            "\u0431\u043e\u0439 \u0432 \u0430\u0441\u0442\u0440\u0430\u043b\u0435"
          ],
          "\u0448\u0430\u0445\u0442\u044b": ["\u0448\u0430\u0445\u0442\u044b"],
          "\u043f\u0440\u043e\u0442\u0438\u0432\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435": [
            "\u043f\u0440\u043e\u0442\u0438\u0432\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435"
          ],
          "\u043e\u0441\u0430\u0434\u0430 \u0437\u0430\u043c\u043a\u043e\u0432": [
            "\u043a\u043b\u0430\u043d\u043e\u0432\u044b\u0435 \u0441\u0440\u0430\u0436\u0435\u043d\u0438\u044f",
            "\u043e\u0441\u0430\u0434\u0430 \u0437\u0430\u043c\u043a\u043e\u0432"
          ],
          "\u043f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u0441\u0442\u0432\u043e": [
            "\u043a\u043b\u0430\u043d\u043e\u0432\u044b\u0435 \u0441\u0440\u0430\u0436\u0435\u043d\u0438\u044f",
            "\u043f\u0440\u0435\u0432\u043e\u0441\u0445\u043e\u0434\u0441\u0442\u0432\u043e"
          ],
          "\u043f\u0440\u0438\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f": [
            "\u043f\u0440\u0438\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f"
          ],
          "\u043f\u0440\u0438\u0437\u0440\u0430\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u043b\u043e\u043c": [
            "\u043f\u0440\u0438\u0437\u0440\u0430\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u043b\u043e\u043c"
          ],
          "\u043f\u043e\u0431\u0435\u0434\u0430": [
            "\u043f\u0440\u0438\u0437\u0440\u0430\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u043b\u043e\u043c"
          ],
          "\u043f\u043e\u0440\u0430\u0436\u0435\u043d\u0438\u0435": [
            "\u043f\u0440\u0438\u0437\u0440\u0430\u0447\u043d\u044b\u0439 \u0440\u0430\u0437\u043b\u043e\u043c"
          ]
        }, function(prefixesList, choiceToSet) {
          if (~c.indexOf(choiceToSet)) {
            if (_0x8E70 = true, ~el.indexOf(choiceToSet)) {
              $("goTo", "");
            } else {
              /** @type {boolean} */
              var _0x8EFA = false;
              if ("\u043d\u0430\u0441\u043b\u0435\u0434\u0438\u0435 \u0445\u0430\u043e\u0441\u0430" ==
                el) {
                if (!prefixesList[1]) {
                  $("goTo", "");
                }
                mkdirIfNotExist(prefixesList[0]);
              }
              forEach(prefixesList, function(sceneUid, shorthand_prop) {
                if (~el.indexOf(sceneUid)) {
                  shorthand_prop++;
                  /** @type {boolean} */
                  _0x8EFA = true;
                  if (prefixesList[shorthand_prop]) {
                    if (shorthand_prop == prefixesList.length - 1) {
                      $("goTo", "");
                    }
                    if (!mkdirIfNotExist(prefixesList[shorthand_prop])) {
                      init('\u0421\u0441\u044b\u043b\u043a\u0430: "' + prefixesList[
                          shorthand_prop] +
                        '" \u043d\u0435 \u043d\u0430\u0448\u043b\u0430\u0441\u044c',
                        "err");
                      $("goTo", "");
                    }
                  }
                }
              });
              if (!_0x8EFA) {
                mkdirIfNotExist("\u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e");
              }
            }
          }
        });
        if (!_0x8E70) {
          $("goTo", "");
        }
      }
    }
  }
  /**
   * @param {boolean} data
   * @return {undefined}
   */
  function getData(data) {
    if (!imgBoxElem) {
      data = data === undefined ? 1 : data;
      $("stopGoTo", data);
      if (!data) {
        decode();
      }
    }
  }
  /**
   * @param {!Object} abs_movie_time
   * @return {undefined}
   */
  function update(abs_movie_time) {
    var totalTransferValue;
    var item;
    /** @type {number} */
    var thisBalance = +new Date / 1e3;
    forEach(abs_movie_time, function(prefix, i) {
      totalTransferValue = $(i + "_time");
      if (totalTransferValue) {
        if (thisBalance >= totalTransferValue) {
          if (~el.indexOf(prefix)) {
            $(i + "_time", "");
          } else {
            /** @type {string} */
            item = prefix + (1 < thisBalance - totalTransferValue ? " (" + filter(thisBalance -
              totalTransferValue) + " \u043d\u0430\u0437\u0430\u0434)" : "");
            if (items[i]) {
              /** @type {string} */
              items[i].textContent = item;
            } else {
              items[i] = init(item, "warn", function() {
                /** @type {boolean} */
                items[i] = false;
                if (confirm("\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 " + prefix + "?")) {
                  decode(prefix);
                }
                $(i + "_time", "");
              });
            }
          }
        } else {
          if (items[i]) {
            items[i].remove();
            /** @type {boolean} */
            items[i] = false;
          }
        }
      }
    });
  }
  /**
   * @return {undefined}
   */
  
  var rang = [null, 'k', 'm', 'g', 't', 'p', 'e', 'kE', 'mE', 'gE', 'tE', 'pE', 'eE', 'kEE'];
  function bigNumKalkulator(num1, akt, num2) {
    function format(numform) {
      var zahllang = parseInt(numform[0]).toString().length;
      if(zahllang > 3) {
        var mal = parseInt((zahllang-1)/3);
        numform = [numform[0]/Math.pow(1000, mal), numform[1]+mal];
      }
      return numform;
    }
    function konvert(num) {
      num = [parseFloat(num), num.match(/[A-z]+/)];
      num[1] = num[1] ? num[1][0] : null;
      num[1] = rang.indexOf(num[1]);
      return format(num);
    }
    num1 = konvert(num1);
    num2 = num2 ? konvert(num2) : null;
    switch (akt) {
      case undefined:
        return num1[0]*Math.pow(1000, num1[1]);
        break;
      case '+':
        var differenz = num1[1]-num2[1];
        var abs = Math.abs(differenz);
        var result;
        if(differenz < 0) {
          result = [num1[0]/Math.pow(1000, abs)+num2[0], num2[1]];
          return format(result);
        } else if(differenz === 0) {
          result = [num1[0]+num2[0], num2[1]];
          return format(result);
        } else if(differenz > 0) {
          result = [num2[0]/Math.pow(1000, abs)+num1[0], num1[1]];
          return format(result);
        }
        break;
    }
  }
  
  function main() {
    /**
     * @return {undefined}
     */
    function resize() {
      setInterval(function() {
        update({
          specialization: "специализация",
          osada: "осада замков",
          sands: "пески забвения",
          superiority: "превосходство",
          battle: "противостояние",
          travel: "путешествия",
          alchemist: "алхимик",
          astral: "астрал",
          mine: "шахты"
        });
      }, 1e3);
    }
    var ActionAOP;
    var layer;
    var message;
    var item;
    var Position;
    var _0x8FB2;
    if (Object.defineProperty(self, "startSec", {
        value: new Date / 1e3,
        writable: false
      }), utility = 1e3 > getDocRect()[0] || 10 > offset(parse("div.box")).left, message = $("set"), assert(
        message) ? (message = JSON.parse(message), options = create(options, message), message = null) : $("set",
        JSON.stringify(options)), options.animation = !utility, forEach({
        enable: 1,
        backpack: 0,
        maxEnergy: 1,
        updEnergy: 0,
        stopGoTo: 0
      }, function(mei, derTrigger) {
        if (null === $(derTrigger)) {
          $(derTrigger, mei);
        }
      }), options.debug && (self.onerror = function(event, handler, context) {
        alert("Error: " + event + " at " + handler + " on line " + context);
      }, gm_storage)) {
      var keys = GM_listValues();
      forEach(keys, function(prop) {
        expect(prop, GM_getValue(prop, null));
      });
      /** @type {null} */
      keys = null;
    }
    el = append(document.title);
    value = $("enable");
    /** @type {*} */
    p = assert($("oldPos")) ? JSON.parse($("oldPos")) : {
      top: 0,
      left: 0
    };
    height = getDocRect()[1];
    fmax = $("maxEnergy");
    inputel = $("updEnergy");
    layer = new Map("clanNewsletters");
    params = new Map("hiddenLinks");
    /** @type {number} */
    //v = cookie ? +parse("body > div.box > div.butt_bott").childNodes[3].nodeValue : 0;
    v = cookie ? bigNumKalkulator(parse("body > div.box > div.butt_bott").childNodes[3].nodeValue)*0.99 : 0;
    /** @type {number} */
    self.energy = v;
    item = callback({
      id: "toogrohtuasieliksixd",
      text: value ? "on" : "off"
    }).appendTo(document.body.querySelector('.exp'));
    if (v > fmax || isNaN(fmax)) {
      $("maxEnergy", v);
      /** @type {number} */
      fmax = v;
    }
    link(item, function(canCreateDiscussions, elem) {
      if (1 === canCreateDiscussions) {
        /** @type {boolean} */
        value = !value;
        $("enable", value);
        /** @type {string} */
        elem.textContent = value ? "on" : "off"
      } else {
        /** @type {string} */
        elem.style.top = (0 < elem.offsetTop ? "0" : elem.offsetHeight) + "px";
      }
    });
    debug(
      "#toogrohtuasieliksixd{-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent;color:#E2E8F0;-webkit-user-select:none;user-select:none;cursor:pointer;position:relative;top:0px;right:0px;opacity:.7;padding:1em 1.0em;background:#0f172a;border-radius:0px;display:inline-block}.LongrohtuasieliksiPress{animation:1s LongrohtuasieliksiPress}@keyframes LongrohtuasieliksiPress{0%,20%{background:#1E293B}100%{background:#ec5e00;color:#34495e}}"
    );
    Position = {
      BEFORE: function softShowFieldDetails() {
        var group = parse(
          'body > div.box > div:first-child:not([class="jour"]) > table > tbody > tr > td:nth-child(2)'
        );
        if (group) {
          if (null === group.querySelector("span:nth-child(1) > img")) {
            cb("\u043f\u043e\u0437\u0436\u0435", group);
          } else {
            if (options.notifications.newsletter) {
              var browser = parse('body > div.box > div:first-child:not([class="jour"])');
              var message = {
                author: browser.querySelector("div>a:nth-child(2)").textContent.trim(),
                text: group.childNodes[1].textContent.trim().replace(/^:\s*/, ""),
                date: group.childNodes[2].textContent.trim()
              };
              /** @type {number} */
              message.date = startSec - trim(message.date);
              layer.add(message);
              expect(message);
              cb("\u0437\u0430\u043a\u0440\u044b\u0442\u044c", browser);
            }
          }
        }
        if (inputel) {
          set();
        }
      },
      "\u0440\u044e\u043a\u0437\u0430\u043a": function update() {
        var associations;
        var r = $("backpack");
        var n = parse(".box>.separ2 + .jour2 + .separ");
        switch (n && (n = n.previousSibling), r) {
          case 3:
            {
              mkdirIfNotExist("продать");
              if (!imgBoxElem) {
                $("backpack", 0);
                getData(false);
              }
              break;
            }
          case 2:
            {
              cb(["разобрать",
                "улучшить"
              ], n);
              if(options.razborRukzaka.alleBox) {
                var regxp = /Открыть \d+ сундуков/,
                   jr = get(".box > .separ + div.jour2");
                forEach(jr, function(boxen) {
                  var boxenText = regxp.exec(boxen.textContent);
                  if(boxenText) cb([boxenText[0].toLowerCase()], boxen);
                });
              }
            // associations = get(".box > .separ + div > .menu_link3 > table > tbody > tr");
              associations = get(".box > div");
              for(var q = 0; q < associations.length; q++) {
                var fnstr = associations[q];
                if(fnstr.className == '') {
                  associations = fnstr.querySelectorAll(".menu_link3 > table > tbody > tr");
                  break;
                }
              }
              forEach(associations, function(menupopup) {
                var sArrDayId;
                var remainder = append(menupopup.querySelector("td:nth-child(2) > div:nth-child(1)")
                  .textContent);
                /** @type {number} */
                var first = 0;
                if (options.razborRukzaka.sunduk && ~remainder.indexOf("сундук")) {
                  cb([
                    "открыть сундук",
                    "продать"
                  ], menupopup);
                }
                if (~remainder.indexOf("самоцвет")) {
                  /** @type {(Array<string>|null)} */
                  sArrDayId = /\+[A-z0-9.]+/.exec(menupopup.children[1].children[1].textContent)[0];
                  var rang = [null, 'k', 'm', 'g', 't', 'p', 'e', 'kE', 'mE', 'gE', 'tE', 'pE', 'eE', 'kEE'],
                    Rang = /[A-z]+/.exec(sArrDayId),
                    value = parseFloat(/[0-9.]+/.exec(sArrDayId)),
                    punkte = 1000 * rang.indexOf(Rang ? Rang[0] : null) + value,
                    uberPunkte = $("samocvetPunkte"),
                    par = remainder.match(/самоцвет \S+/)[0].split(' ')[1];
                  uberPunkte = uberPunkte ? +uberPunkte : 0;
                  /** @type {number} */
                  //first = parseInt(sArrDayId[0], 10);
                  //alert(first);
                  if (punkte < uberPunkte || options.razborRukzaka.samocvet[par]) {
                    cb(["\u043f\u0440\u043e\u0434\u0430\u0442\u044c"], menupopup);
                  } else if (punkte > uberPunkte) {
                    $("samocvetPunkte", punkte);
                  }
                }
                if (options.razborRukzaka.enka && ~remainder.indexOf("энергии")) {
                  var kraft = +menupopup.querySelector('a').textContent.match(/\d+/)[0];
                  if(kraft < 1500) cb(["\u043f\u0440\u043e\u0434\u0430\u0442\u044c"], menupopup);
                }
                var indexBanki = [
                    "адское зелье",
                    "ледяное зелье",
                    "отравляющий воду",
                    "яд кобры",
                    "яд скорпиона",
                    "яд чёрной вдовы",
                    "ядовитая кровь",
                    "отравленная слюна",
                    "кислота",
                    "динамит",
                    "малый напиток жизни",
                    "напиток жизни",
                    "малый эликсир жизни",
                    "эликсир жизни",
                    "малый напиток силы",
                    "напиток силы",
                    "малый эликсир силы",
                    "эликсир силы",
                    "малый напиток выносливости",
                    "напиток выносливости",
                    "малый эликсир выносливости",
                    "эликсир выносливости",
                    "малый напиток сопротивления",
                    "напиток сопротивления",
                    "малый эликсир сопротивления",
                    "эликсир сопротивления"
                  ].indexOf(remainder);
                if (options.autoSellPotions && ~indexBanki) {
                  if(indexBanki > 13) cb([" +", "\u043f\u0440\u043e\u0434\u0430\u0442\u044c"], menupopup)
                  else cb(["\u043f\u0440\u043e\u0434\u0430\u0442\u044c"], menupopup);
                }
                forEach(["\u0430\u0440\u0442\u0435\u0444\u0430\u043a\u0442",
                  "\u043f\u0435\u0440\u0447\u0430\u0442\u043a\u0438",
                  "\u0434\u043e\u0441\u043f\u0435\u0445",
                  "\u0441\u0430\u043f\u043e\u0433\u0438", "\u0448\u043b\u0435\u043c",
                  "\u043e\u043f\u043b\u0435\u0447\u044c\u0435",
                  "\u043f\u043e\u043d\u043e\u0436\u0438", "\u043f\u043b\u0430\u0449",
                  "\u043a\u043e\u043b\u044c\u0446\u043e",
                  "\u043e\u0436\u0435\u0440\u0435\u043b\u044c\u0435",
                  "\u0441\u0435\u0440\u044c\u0433\u0430", "\u043c\u0435\u0447",
                  "\u0449\u0438\u0442"
                ], function(term) {
                  if (~remainder.indexOf(term)) {
                    if (first = menupopup.querySelector(
                        'td > div > span[style="color:green"]:last-child'), !first) {
                      return;
                    }
                    if (first = first.textContent.trim(), "+" !== first.charAt(0)) {
                      return;
                    }
                    cb("\u043d\u0430\u0434\u0435\u0442\u044c", menupopup.parentNode.parentNode
                      .parentNode);
                  }
                });
              });
              if (!imgBoxElem) {
                $("backpack", 0);
                getData(false);
              }
              break;
            }
          default:
            callback({
              class: "title-top",
             // style: {display: "block"},
              child: {
                type: "a",
                href: location.href,
                id: "panel",
                text: "разобрать",
                click: function cb(event) {
                  event.preventDefault();
                  $("backpack", 2);
                  location.reload();
                },
                style: {
                  position: "absolute",
                  left: "100px",
                  display: "inline",
                  textDecoration: "none",
                  cursor: "pointer"
                }
              }
            }).after(callback({
              class: "separ2"
            }).after(n));
            callback({
                type: "a",
                href: location.href,
                text: "распродать",
                click: function cb(event) {
                  event.preventDefault();
                  $("backpack", 3);
                  location.reload();
                },
                style: {
                  position: "relative",
                  left: "100px",
                  display: "inline",
              //    width: "50%",
                  textDecoration: "none",
                  cursor: "pointer"
                }
            }).after(callback({
              class: ""
            }).after(document.querySelector('#panel')));
        }
      },
      "что заменить": function writeTask() {
        mkdirIfNotExist("параметры\s*\\+\\s*\\d", true);
      },
      "наследие хаоса": function changeBlockClass() {
        if (join(
            "восстановить жизни за"
          )) {
          $("backpack", 1);
          mkdirIfNotExist(
            "восстановить жизни за"
          );
        }
        mkdirIfNotExist(
          "забрать награду");
        if (options.fault) {
          mkdirIfNotExist(
            "призрачный разлом (+)"
          );
        }
        if (options.arena) {
          mkdirIfNotExist(
            "арена смерти"
          );
        }
      },
      "марафон наград": function writeTask() {
        mkdirIfNotExist(["забрать награду",
          "вернуться в город"
        ]);
      },
      "грандмастер": function writeTask() {
        mkdirIfNotExist("MAX".toLowerCase());
        mkdirIfNotExist("х250");
      },
      "бонусы": function writeTask() {
        mkdirIfNotExist(["150",
          "Активировать за"
          ]);
      },
      /*"мои достижения": function writeTask() {
        mkdirIfNotExist("забрать");
      },*/
      "таланты": function writeTask() {
        mkdirIfNotExist(["изучить",
          "улучшить",
          "тренировать"
        ]);
      },
      "путешествия": function writeTask() {
        mkdirIfNotExist("отправиться");
      },
      "призрачный разлом": function writeTask() {
        mkdirIfNotExist("150%");
        mkdirIfNotExist("100%");
        mkdirIfNotExist(["50%",
          "завершить поединки"
        ]);
      },
      "победа": function writeTask() {
        mkdirIfNotExist(
          "завершить поединки"
        );
      },
      "поражение": function writeTask() {
        mkdirIfNotExist(
          "завершить поединки"
        );
      },
      "специализация": function writeTask() {
        mkdirIfNotExist([
          "закончить изучение",
          "улучшить знания"
        ]);
      },
       "мастерская": function writeTask() {
        mkdirIfNotExist([
          "перейти в новую эпоху",
          "эпоха",
          "улучшить за",
          "качество",
          "да, заточить",
          "заточить"
        ]);
      },
      "книга таинств": function writeTask() {
        mkdirIfNotExist(
          "улучшить"
        );
      },
      /*"алхимик": function writeTask() {
        mkdirIfNotExist(
          "забрать эликсир");
      },*/
      "замок ": function writeTask() {
        mkdirIfNotExist("вступить в бой");
      },
      "армия": function writeTask() {
        mkdirIfNotExist("лечить");
        getData(false);
      },
      AFTER: function render() {
        var output = parse("body > .box > .butt_bott");
        if (options.razborRukzaka.enable && AddChar("рюкзак", output) && !~
          el.indexOf("рюкзак")) {
          $("backpack", 2);
          $("goTo", el);
          getData(true);
          cb("рюкзак", output);
        }
        /*if (join("вылечить воинов")) {
          $("goTo", el);
          getData(true);
          mkdirIfNotExist(
            "вылечить воинов");
        }*/
        var lose;
        if ((join("как стать сильней?") || sessionStorage.lose) && join("пропустить")) {
          delete sessionStorage.lose;
          mkdirIfNotExist(
            "пропустить");
        } else if (lose = get('.jour2 > div > div[style="font-size:18px;color:white"]')[0]) {
          if(lose ? lose.textContent == 'Поражение!' : null) {
            if (join("продолжить")) sessionStorage.lose = 1;
          }
        }
        if(document.title.match(/У меня \S+ медалей/)) {
          var fr = document.querySelectorAll('div[id="passreward:1:1"]').length;
          var collect = document.querySelectorAll('div[id="passreward:1:1"] > div > img[src="16x16/tick.png"]').length;
          var btns = get('body > .box > .separ2 + .menu_link3 > a.mybutt_att');
          if(!~document.body.textContent.indexOf('Ошибка получения награды!')) {
            if(btns[1]) {
              if(btns[1].style.opacity == '') goTo(btns[1]);
            }
            if(fr > collect) goTo(btns[0]);
          }
        }
        if(document.title=='Превосходство') {
            if(~document.body.textContent.indexOf('Превосходство окончится через')) {
                if(sessionStorage.prevo!=1)sessionStorage.prevo = 1;
                mkdirIfNotExist(['атаковать']);
            } else {
                sessionStorage.prevo = 0;
                mkdirIfNotExist(['на главную']);
            }
        } else if(sessionStorage.prevo==1 && (document.title=='Наследие Хаоса' || document.title=='Арена Смерти' || document.title=='Клановые Сражения')) 
                mkdirIfNotExist(['style/city-icon.jpg', 'на главную', 'клановые сражения', 'превосходство'])
        else if (~el.indexOf("арена смерти")) {
          var butt = parse('a.mybutt_gold > img[src="16x16/time.png"]');
          if(butt) goTo(butt.parentElement)
          else mkdirIfNotExist("\\d+\\s\u0431\u043e(\u0451\u0432|\u0439|\u044f)", true);
          set();
          mkdirIfNotExist(
            "другой противник"
          );
        } else {
          mkdirIfNotExist(["бить противника",
                           "в атаку",
                           "бить ещё",
                           "ещё раз",
                           "другой противник",
                           "атаковать",
                           "окончить путешествие",
                           "найти врага",
                           "завершить задание",
                           "отправиться на задание",
                           "получить награду",
                           "закончить работу",
                           "вернуться в колизей",
                           "отправиться в колизей",
                           "отправиться на работу",
                           "закончить изучение",
                           "удар киркой",
                           "продолжить",
                           "воскреснуть"]);
          set();
        }
      }
    };
      // автообновление
        setTimeout(function(){
        if (options.aUpdate) {
        window.location.reload(1);
        }}, (options.autoUpdate));

    ActionAOP = {
      BEFORE: function constructDynamicTables() {
        decode();
      },
      "блокировка": function VIEWAS_cal() {
        /** @type {!Element} */
        var elCancel = document.createElement("a");
        /** @type {string} */
        elCancel.innerHTML =
          '<div style="text-align: center;background: #00A321;"><h1>Выйти из аккаунта</h1></div>';
        /** @type {string} */
        elCancel.href = "#";
        /**
         * @return {undefined}
         */
        elCancel.onclick = function() {
          /** @type {!Array<string>} */
          var updateElementsText = document.cookie.split(";");
          forEach(updateElementsText, function(clusterShardData) {
            document.cookie = clusterShardData.split("=")[0] +
              "=; expires=Sun, Aug 03 1997 00:00:00 GMT;";
          });
          /** @type {string} */
          location.href = location.protocol + setInterval(function() {
            /** @type {number} */
            _0x906A = +new Date / 1e3;
            /** @type {number} */
            _0x917E = _0x906A - startSec;
            if (_0x917E >= updateElementsText) {
              clearInterval(_0x90C6);
              location.reload();
              _0x9098 = filter(0);
            } else {
              _0x9098 = filter(updateElementsText - _0x917E);
            }
            elCancel.textContent =
              "Превосходство начнётся через " +
              _0x9098;
          }, 100);
        };
      },
      "колизей": function loadDisqusCounter() {
        var element = parse('.box > .separ + .jour2 > .jour[style*="text-align:center"] > span');
        if (element && ~append(element.textContent).indexOf(
            "следующий бой через"
          )) {
          var totalTransferValue;
          var nowSec;
          var thisBalance;
          var text;
          var initializeCheckTimer;
          totalTransferValue = trim(element.textContent);
          /** @type {number} */
          initializeCheckTimer = setInterval(function() {
            /** @type {number} */
            nowSec = +new Date / 1e3;
            /** @type {number} */
            thisBalance = nowSec - startSec;
            if (thisBalance >= totalTransferValue) {
              delete sessionStorage.grossKz;
              clearInterval(initializeCheckTimer);
              location.reload();
              text = filter(0);
            } else {
              text = filter(totalTransferValue - thisBalance);
            }
            element.textContent =
              "Следующий бой через " +
              text;
          }, 100);
        }
      },
      "путешествия": function handleImportCall() {
        var associations;
        var _checkForChangesIntervalId;
        var now;
        var value;
        var name;
        var data;
        /** @type {!Array} */
        var array = [];
        /** @type {!Array} */
        var a = [];
        associations = get(".mybutt_no");
        forEach(associations, function(component, i) {
          var el = append(component.textContent);
          if (~el.indexOf("\u043e\u0442\u0434\u044b\u0445")) {
            array[i] = trim(el);
            a[i] = array[i];
          } else {
            /** @type {boolean} */
            array[i] = false;
          }
        });
        /** @type {number} */
        name = Math.min.apply(null, a);
        if (0 < name) {
          $("travel_time", startSec + name);
        }
        /** @type {number} */
        _checkForChangesIntervalId = setInterval(function() {
          forEach(associations, function(err, i) {
            return false !== array[i] && void(now = +new Date / 1e3, value = now - startSec,
              value >= array[i] ? (clearInterval(_checkForChangesIntervalId), location.reload(),
                data = filter(0, 2)) : data = filter(array[i] - value, 2), err.textContent =
              "\u041e\u0442\u0434\u044b\u0445 " + data);
          });
        }, 50);
      },
     /* "\u0448\u0430\u0445\u0442\u044b": function handleImportCall() {
        var associations;
        var _checkForChangesIntervalId;
        var nowSec;
        var x;
        var number;
        var data;
        /** @type {!Array} *
        var pos = [];
        associations = get(".mybutt_no");
        forEach(associations, function(view, i1) {
          var w = append(view.textContent);
          pos[i1] = (~w.indexOf(
              "\u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0435\u0449\u0451") || ~w.indexOf(
              "\u0448\u0430\u0445\u0442\u0430 \u0437\u0430\u043a\u0440\u044b\u0442\u0430")) &&
            trim(view.textContent);
        });
        /** @type {number} *
        number = Math.min.apply(null, pos);
        if (0 < number) {
          $("mine_time", startSec + number);
        }
        /** @type {number} *
        _checkForChangesIntervalId = setInterval(function() {
          forEach(associations, function(err, i) {
            return false !== pos[i] && void(nowSec = +new Date / 1e3, x = nowSec - startSec,
              x >= pos[i] ? (clearInterval(_checkForChangesIntervalId), location.reload(),
                data = filter(0)) : data = filter(pos[i] - x), err.textContent =
              "\u0428\u0430\u0445\u0442\u0430 \u0437\u0430\u043a\u0440\u044b\u0442\u0430 " +
              data);
          });
        }, 100);
      },*/
      "\u043f\u0435\u0441\u043a\u0438 \u0437\u0430\u0431\u0432\u0435\u043d\u0438\u044f": function loadDisqusCounter() {
        var element = parse(
          '.box > .jour2 + .jour2 > .jour[style*="text-align:center"] > div[style="font-size:16px"]');
        if (element && ~append(element.textContent).indexOf(
            "\u0431\u043e\u0439 \u0447\u0435\u0440\u0435\u0437")) {
          var number;
          var nowSec;
          var count;
          var text;
          var initializeCheckTimer;
          number = trim(element.textContent);
          $("sands_time", startSec + number);
          /** @type {number} */
          initializeCheckTimer = setInterval(function() {
            /** @type {number} */
            nowSec = +new Date / 1e3;
            /** @type {number} */
            count = nowSec - startSec;
            if (count >= number) {
              clearInterval(initializeCheckTimer);
              location.reload();
              text = filter(0);
            } else {
              text = filter(number - count);
            }
            element.textContent =
              "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0431\u043e\u0439 \u0447\u0435\u0440\u0435\u0437 " +
              text;
          }, 100);
        }
      },
      "\u0437\u0430\u043c\u043e\u043a ": function loadDisqusCounter() {
        var element = parse(
          '.box > .separ + .jour2 > .jour[style*="text-align:center"] > div[style*="text-align:center"] > span'
        );
        if (element && ~append(element.textContent).indexOf(
            "\u043d\u0430\u0447\u043d\u0451\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437")) {
          var number;
          var nowSec;
          var count;
          var text;
          var initializeCheckTimer;
          number = trim(element.textContent);
          $("osada_time", startSec + number);
          /** @type {number} */
          initializeCheckTimer = setInterval(function() {
            /** @type {number} */
            nowSec = +new Date / 1e3;
            /** @type {number} */
            count = nowSec - startSec;
            if (count >= number) {
              clearInterval(initializeCheckTimer);
              location.reload();
              text = filter(0);
            } else {
              text = filter(number - count);
            }
            element.textContent =
              "\u041e\u0441\u0430\u0434\u0430 \u0437\u0430\u043c\u043a\u0430 \u043d\u0430\u0447\u043d\u0451\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 " +
              text;
          }, 100);
        }
      },
      "\u0441\u043f\u0435\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f": function get_all_ids() {
        var associations;
        var initializeCheckTimer;
        var now;
        var value;
        var id;
        var date;
        /** @type {!Array} */
        var item = [];
        associations = get(".mybutt_no");
        forEach(associations, function(prop, cond) {
          item[cond] = trim(prop.textContent);
          if (60 <= item[cond]) {
            item[cond] += 60;
          }
        });
        /** @type {number} */
        id = Math.min.apply(null, item);
        if (0 < id) {
          $("specialization_time", startSec + id);
        }
        /** @type {number} */
        initializeCheckTimer = setInterval(function() {
          forEach(associations, function(result, i) {
            /** @type {number} */
            now = +new Date / 1e3;
            /** @type {number} */
            value = now - startSec;
            if (value >= item[i]) {
              clearInterval(initializeCheckTimer);
              cb(result.textContent, result.parentNode);
            }
            date = filter(Math.max(0, item[i] - value), 1);
            result.textContent = date;
          });
        }, 100);
      },
      AFTER: function bindEvents() {
        if(document.title.match(/У меня \S+ медалей/)) {
          var Interface = parse('body > .box > .separ2 + .menu_link3 > a.mybutt_att').parentElement,
            info = document.createElement('div'),
            freireward = document.querySelectorAll('div[id="passreward:1:1"]'),
            geldreward = document.querySelectorAll('div[id="passreward:2:2"]'),
            fr = freireward.length,
            collect = document.querySelectorAll('div[id="passreward:1:1"] > div > img[src="16x16/tick.png"]').length,
            N = fr - collect,
            summ = (2*(25*(collect+1)-10) + 25*(N-1))*N/2,
            stat = '';
          for(var i = 0; i < 4; i++) {
            var reward = freireward[collect-1-1+i];
            if(reward) {
              reward = reward.querySelector('div');
              var text = reward.querySelectorAll('span')[1].innerHTML+' / '+geldreward[collect-2+i].querySelectorAll('span')[1].innerHTML,
              img = reward.querySelectorAll('img');
              stat+= '<div style="opacity:'+(i < 2 ? 0.5 : 1)+';">'+(collect+i-1)+': <img src="'+img[img.length-1].src+'" style="width:16px"> '+text+'</div>';
            }
          }
          info.className = 'jour2';
          info.innerHTML = 'Открыто '+collect+'/'+fr+' наград; Осталось накопить '+summ+' медалей;<div class="jour">'+stat+'</div>';
          Interface.appendChild(info);
        }
        if (0 < layer) {
          init("\u0420\u0430\u0441\u0441\u044b\u043b\u043a\u0438 \u043a\u043b\u0430\u043d\u0430 (" +
            layer + ")", "info",
            function() {
              forEach(layer.get, function(post, surface) {
                init(post.author + ": " + post.text + ", " + filter(startSec - post.date) +
                  " \u043d\u0430\u0437\u0430\u0434", "info",
                  function() {
                    layer.clear(surface);
                  });
              });
            });
        }
        if (options.debug && 0 < params) {
          init("\u0421\u043a\u0440\u044b\u0442\u044b\u0435 \u0441\u0441\u044b\u043b\u043a\u0438 (" +
            params + ")", "info",
            function() {
              forEach(params.get, function(cfiParser, libraryID) {
                init(cfiParser, "err", function() {
                  params.clear(libraryID);
                });
              });
            });
        }
        parse("body > div.box > div.butt_bott").childNodes[3].nodeValue += " / " + fmax + " ";
        setTimeout(function() {
          draw();
        }, 0);
        if (options.notifications.enable && options.notifications.allPages) {
          resize();
        }
      }
    };
    decode();
    if (!~["\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u043f\u0440\u0435\u0434\u043c\u0435\u0442"].indexOf(
        el)) {
      ActionAOP.BEFORE();
      if (value) {
        Position.BEFORE();
        forEach(Position, function(saveNotifs, where) {
          if ("AFTER" !== where && ~el.indexOf(where)) {
            /** @type {boolean} */
            _0x8FB2 = true;
            saveNotifs();
          }
        });
        Position.AFTER();
      }
      forEach(ActionAOP, function(saveNotifs, where) {
        if ("AFTER" !== where && ~el.indexOf(where)) {
          /** @type {boolean} */
          _0x8FB2 = true;
          saveNotifs();
        }
      });
      ActionAOP.AFTER();
    }
  }
  /**
   * @return {undefined}
   */
  function run() {
    if ("loading" !== document.readyState) {
      if (options.antiSiteScript) {
        /** @type {!HTMLCollection<HTMLScriptElement>} */
        var script = document.scripts;
        /** @type {number} */
        var xPointer = 0;
        if (0 < script.length) {
          expect(script);
          forEach(script, function(option) {
            if (option.src) {
              if (/^(?:chrome-extension:|http:\/\/local.adguard.com)/i.test(option.src)) {
                return init(option.src), false;
              }
              init(option.src, "warn");
            } else {
              var projectDir = option.textContent.trim();
              if (0 === projectDir.indexOf("")) {
                return;
              }
              init(projectDir, "err");
            }
            xPointer++;
          });
        }
        if (0 < xPointer) {
          alert("\u0447\u0451-\u0442\u043e \u043d\u0435 \u0442\u043e: " + xPointer);
          exec("scripts");
        }
      }
      try {
        main();
      } catch (errorMessage) {
        if ("stop" !== errorMessage.message) {
          expect(errorMessage.message, errorMessage);
        }
      }
    } else {
      setTimeout(function() {
        run();
      }, 1);
    }
  }
  /*if (!~["xaos.mobi", "xaos.spaces-games.com", "xaoc.mobi", "m.xaos.mobi", "secure.xaos.mobi",
      "xaos.play.tegos.ru", "xaos.mgates.ru"
    ].indexOf(location.hostname)) {
    return false;
  }*/
  var el;
  var cookie;
  var value;
  var p;
  var v;
  var height;
  var fmax;
  var params;
  var _0x8AAA;
  var utility;
  var inputel;
  var energyList = [125, 250, 375, 500, 625, 1500, 1750, 2000, 2250, 2500, 5500, 6000, 6500];
  var options = {
    speed: 0,
    scroll: !1,
    aUpdate: !1,
    animation: !0,
    razborRukzaka: {
      enable: !1,
      sunduk: !0,
      alleBox: !0,
      enka: !0,
      samocvet: {
        enable: !1,
        from: 128,
        'силы': 0,
        'здоровья': 0,
        'защиты': 0,
      }
    },
    fault: !1,
    arena: !1,
    sleep: 0,
    autoUpdate: 50000,
    debug: !1,
    antiSiteScript: !0,
    notifications: {
      enable: !1,
      allPages: !1,
      newsletter: !1
    },
    autoSellPotions: !0,
    osada: {
      enable: !0,
      zamok: 0
    },
    autoUseEnergy: energyList.reduce(function(target, key) {
      target[key] = true;
      return target;
    }, {enable: true}),
  };
  /** @type {boolean} */
  var ch = false;
  var pathCache = {};
  var items = {};
  /** @type {boolean} */
  var imgBoxElem = false;
  cookie = function(value) {
    var i;
    /** @type {!Array} */
    var strCookies = [];
    /** @type {!Array} */
    var env_data = [];
    var img_envs = {};
    if ("" !== value) {
      /** @type {!Array<string>} */
      strCookies = value.substr(1).split("&");
      /** @type {number} */
      i = 0;
      for (; i < strCookies.length; i = i + 1) {
        /** @type {!Array<string>} */
        env_data = strCookies[i].split("=");
        if (env_data[0]) {
          /** @type {string} */
          img_envs[env_data[0]] = env_data[1];
        }
      }
    }
    return img_envs;
  }(self.location.search);
  cookie = cookie.userid && parseInt(cookie.userid) ? cookie.userid : 0;
  /** @type {boolean} */
  _0x8AAA = "undefined" != typeof self.opera && 13 > parseInt(opera.version());
  if (!cookie) {
    exec("no user id");
  }
  self.gm_storage = function() {
    return !("undefined" == typeof GM_getValue || ~GM_getValue.toString().indexOf("not supported"));
  }();
  self.setMenu = {
    added: false,
    style: null
  };
  /**
   * @param {string} data
   * @return {undefined}
   */
  var Map = function(data) {
    var newVal;
    var initializeData;
    var each;
    /** @type {string} */
    data = "db_" + data;
    /**
     * @return {?}
     */
    initializeData = function value() {
      var structure = $(data);
      return structure = !!assert(structure) && JSON.parse(structure), newVal = structure || [];
    };
    /**
     * @return {?}
     */
    each = function has() {
      var hash = newVal.filter(function(optionalNewValue) {
        return optionalNewValue != undefined;
      });
      return $(data, JSON.stringify(hash));
    };
    initializeData();
    this.__defineGetter__("get", function() {
      return newVal;
    });
    /**
     * @param {string} name
     * @return {?}
     */
    this.add = function(name) {
      return newVal.push(name), each();
    };
    /**
     * @param {string} id
     * @return {?}
     */
    this.clear = function(id) {
      if (id !== undefined) {
        if (newVal[id] === undefined) {
          return false;
        }
        delete newVal[id];
      } else {
        /** @type {!Array} */
        newVal = [];
      }
      return each();
    };
  };
  if (document.defaultView.parent === document.defaultView) {
    run();
  } else {
    exec("this is frame");
  }
5})(window, document);