// ==UserScript==
// @name         lib:allfuncs
// @version      27
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/489763/lib%3Aallfuncs.user.js
// @updateURL https://update.greasyfork.org/scripts/489763/lib%3Aallfuncs.meta.js
// ==/UserScript==

// fix gettype in test func
/*
// @noregex
// @name remove ai comments
// @regex (//) \.\.\..*
// @replace
// @endregex
// @regex   maketype\((\w+),
// @replace   $1 = maketype($1,
// @endregex
*/
/**
 * @typedef {Object} TestUtils
 * @property {function(...*): void} ifunset - Sets default values for undefined inputs.
 * @property {function(*): string} gettype - Checks the type of a value.
 * @property {function(number): void} pass - Validates that the current parameter is correct.
 * @property {function(): boolean} end - Validates that all parameters have been checked.
 * @property {function(*, Array<*>): boolean} isany - Checks if a value is in a list of options.
 * @property {function(string, RegExp): boolean} matchesregex - Checks if a value matches a regex pattern.
 * @property {function(*, *): boolean} issame - Checks if two values are strictly equal.
 * @property {function(number, Array<string>): boolean} trymaketype - Attempts to convert a value to one of the specified types.
 */
/**
 * @callback TestFunction
 * @param {TestUtils} testUtils - An object containing utility functions for testing.
 * @returns {boolean} Returns true if all validations pass.
 */
/**
 * @param {Function} func - The function to wrap in a test.
 * @param {TestFunction} testfunc - The function to test func against.
 * @returns {Function} - The wrapped function.
 */

;(() => {
  function newfunc(func, testfunc) {
    var funcname = func.name || func.prototype.name
    var retfunc = function () {
      var i = 0
      var inputargs = [...arguments]
      return testfunc({
        funcname,
        args: inputargs,
        /**
         *
         * @param {*} thing - anything
         * @param {Array} _enum - list of posable things thing can be
         * @returns {Error|*}
         */
        makeenum: function makeenum(thing, _enum) {
          for (var thing2 of _enum) {
            if (thing == thing2) return thing2
          }
          throw new Error(
            `makeenum: in function ${this.funcname} input ${i} is invalid, should match enum [${_enum}] but is instead ${thing}`
          )
        }.bind(retfunc),
        trymakeenum: function trymakeenum(thing, _enum) {
          try {
            this.makeenum(thing, _enum)
            return true
          } catch (e) {
            return false
          }
        }.bind(retfunc),
        /**
         * Sets default values for input if they are undefined.
         * @param {...*} input - The default values to set.
         */
        ifunset: function ifunset(newinputs) {
          for (var i in newinputs) {
            if (inputargs[i] === undefined)
              inputargs[i] = newinputs[i]
          }
        }.bind(retfunc),
        /**
         *
         * @param {Number} i - tries to make thing become a type in types
         * @param {Array|string} types - array of types to try to be
         * @returns {boolean}
         */
        trymaketype: function trymaketype(thing, types) {
          try {
            this.maketype(thing, types)
            return true
          } catch (e) {
            return false
          }
        }.bind(retfunc),
        /**
         *
         * @param {Number} i - tries to make thing become a type in types
         * @param {Array|string} types - array of types to try to be
         * @returns {Error|true}
         */
        maketype: function maketype(thing, types) {
          // if (types.includes("any")) return true
          if (gt(thing, types)) return thing
          for (var type of types) {
            if (gt(thing, "string") && type == "number") {
              thing = Number(thing)
            }
            if (gt(thing, "number") && type == "string") {
              thing = String(thing)
            }
            if (gt(thing, "string") && type == "number") {
              thing = Number(thing)
            }
            if (gt(thing, "number") && type == "string") {
              thing = String(thing)
            }
            if (gt(thing, "boolean") && type == 1) {
              thing = true
            }
            if (type == "boolean" && (thing == 0 || thing == "")) {
              thing = false
            }
            if (gt(thing, type)) return thing
          }
          throw new Error(
            `trymaketype: in function ${
              this.funcname
            } input ${i} is invalid, should be type [${types}] but is instead type ${gt(
              thing
            )}`
          )
        }.bind(retfunc),
        /**
         *
         * @param {*} thing - the thing to get the type of
         * @param {string|Array|undefined} match - if set the type to check aganst or array of ytpes to check aganst
         * @returns {boolean|string}
         */
        trygettype: gt,
        gettype: function gettype(a, s) {
          if (gt(a, s)) return true
          throw new Error(
            `gettype: in function ${
              this.funcname
            } input ${i} is invalid, should be type [${s}] but is instead type ${gettype(
              a
            )}`
          )
        }.bind(retfunc),
        /**
         * tells that the test function has ended and to try and call the main function
         * @returns {boolean|undefined}
         */
        end: function end() {
          return func.call(func, ...inputargs)
        }.bind(retfunc),
      })
    }
    retfunc.name = retfunc.prototype.name =
      "strict " + (funcname ?? "function")
    retfunc.funcname = funcname
    return retfunc.bind(retfunc)
    /**
     *
     * @param {*} thing - the thing to get the type of
     * @param {string|Array|undefined} match - if set the type to check aganst or array of ytpes to check aganst
     * @returns {boolean|string}
     */
    function gt(thing, match) {
      if (
        !match ||
        (Object.prototype.toString
          .call(match)
          .toLowerCase()
          .match(/^\[[a-z]+ (.+)\]$/)[1] == "string" &&
          !match.includes("|"))
      ) {
        var type = Object.prototype.toString
          .call(thing)
          .toLowerCase()
          .match(/^\[[a-z]+ (.+)\]$/)[1]
        if (type !== "function") if (type == match) return true
        if (match == "normalfunction") return type == "function"
        if (type == "htmldocument" && match == "document") return true
        if (match == "body" && type == "htmlbodyelement") return true
        if (match && new RegExp(`^html${match}element$`).test(type))
          return true
        if (/^html\w+element$/.test(type)) type = "element"
        if (type == "htmldocument") type = "element"
        if (type == "asyncfunction") type = "function"
        if (type == "generatorfunction") type = "function"
        if (type == "regexp") type = "regex"
        if (match == "regexp") match = "regex"
        if (match == "element" && type == "window") return true
        if (match == "element" && type == "shadowroot") return true
        if (match == "event" && /\w+event$/.test(type)) return true
        if (/^(html|svg).*element$/.test(type)) type = "element"
        if (type == "function") {
          type = /^\s*class\s/.test(
            Function.prototype.toString.call(thing)
          )
            ? "class"
            : "function"
        }
        if (match == "none")
          return (
            type == "nan" || type == "undefined" || type == "null"
          )
        try {
          if (type === "number" && isNaN(thing) && match == "nan")
            return true
        } catch (e) {
          error(thing)
        }
        return match ? match === type : type
      } else {
        if (match.includes("|")) match = match.split("|")
        match = [...new Set(match)]
        return !!match.find((e) => gt(thing, e))
      }
    }
  }
  const a = {}
  var x = newfunc(
    function foreach(arr, func) {
      var type = a.gettype(arr)
      if (type == "array") arr.forEach(func)
      else if (type == "object") {
        Reflect.ownKeys(arr).forEach((e, i) => {
          func(e, arr[e], i)
        })
      } else {
        ;[arr].forEach(func)
      }
    },
    ({ args: [arr, func], end, maketype }) => {
      arr = maketype(arr, ["array", "object", "any"])
      func = maketype(func, ["function"])
      return end()
    }
  )

  a.wait = newfunc(
    function wait(ms) {
      return new Promise(function (done) {
        var last = Date.now()
        setTimeout(() => done(Date.now() - last - ms), ms)
      })
    },
    function ({ ifunset, end, args: [ms], maketype }) {
      ifunset([0])
      ms = maketype(ms, ["number"])
      return end()
    }
  )

  a.waituntil = newfunc(
    function waituntil(q, cb) {
      return new Promise((resolve) => {
        var last = Date.now()
        var int = setInterval(
          function (q, cb) {
            if (!!q()) {
              clearInterval(int)
              try {
                cb(Date.now() - last)
              } catch (e) {}
              resolve(Date.now() - last)
            }
          },
          0,
          q,
          cb
        )
      })
    },
    function ({ end, args: [q, cb], maketype }) {
      q = maketype(q, ["function"])
      cb = maketype(cb, ["function", "undefined"])
      return end()
    }
  )

  a.keeponlyone = newfunc(
    function keeponlyone(arr) {
      return [...new Set(arr)]
    },
    function ({ end, args: [arr], maketype }) {
      arr = maketype(arr, ["array"])
      return end()
    }
  )

  a.matchall = newfunc(
    function matchall(x, y) {
      return [...x.matchAll(y)].map((e) =>
        e[1] !== undefined ? [...e] : e[0]
      )
    },
    function ({ args: [x, y], end, maketype }) {
      x = maketype(x, ["string"])
      y = maketype(y, ["regex"])
      return end()
    }
  )

  a.randfrom = newfunc(
    function randfrom(min, max) {
      if (max === undefined)
        return min.length
          ? min[this(0, min.length - 1)]
          : this(0, min)
      if (min == max) return min
      if (max) return Math.round(Math.random() * (max - min)) + min
      return min[Math.round(Math.random() * (min.length - 1))]
    },
    function ({ args: [min, max], end, maketype }) {
      min = maketype(min, ["number", "array"])
      max = maketype(max, ["number", "undefined"])
      return end()
    }
  )
  a.foreach = newfunc(
    function foreach(
      //none
      arr, //array|object|any
      func //function
    ) {
      var type = a.gettype(arr)
      if (type == "array") arr.forEach(func)
      else if (type == "object") {
        Reflect.ownKeys(arr).forEach((e, i) => {
          func(e, arr[e], i)
        })
      } else {
        ;[arr].forEach(func)
      }
    },
    function ({ args: [arr, func], end, maketype }) {
      func = maketype(func, ["function"])
      return end()
    }
  )
  a.listen = newfunc(
    function listen(elem, type, cb, istrue = false) {
      var all = []
      if (a.gettype(elem, "array")) {
        return [...elem].map(listen).flat()
      } else {
        return listen(elem)
      }
      function listen(elem) {
        if (a.gettype(type, "array")) {
          var temp = {}
          a.foreach(type, (e) => (temp[e] = cb))
          type = temp
        }
        if (a.gettype(type, "object")) {
          istrue = cb
          a.foreach(type, function (type, cb) {
            if (a.gettype(type, "string"))
              type = a.matchall(type, /[a-z]+/g)
            type.forEach((type) => {
              const newcb = function (...e) {
                cb.call(elem, ...e)
              }
              elem.addEventListener(type, newcb, istrue)
              all.push([elem, type, newcb, istrue])
            })
          })
        } else if (a.gettype(type, "string")) {
          type = a.matchall(type, /[a-z]+/g)
          type.forEach((type) => {
            const newcb = function (e) {
              cb.call(elem, e, type)
            }
            elem.addEventListener(type, newcb, istrue)
            all.push([elem, type, newcb, istrue])
          })
        }
        return all
      }
    },
    function ({
      gettype,
      trygettype,
      args, //[elem, type, cb, istrue],
      end,
      maketype,
    }) {
      var [elem, type, cb, istrue] = args
      elem = maketype(elem, ["element", "window", "string", "array"])
      if (trygettype(elem, "string")) {
        elem = a.qs(elem)
        elem = maketype(elem, ["element"])
        args[0] = elem
      }
      type = maketype(type, ["array", "object", "string"])
      if (trygettype(type, ["array", "any"])) {
        for (var temp in type) gettype(temp, "string")
      } else if (trygettype(type, "object")) {
        for (var temp of Object.values(type))
          gettype(temp, "function")
      }
      if (trygettype(type, "object")) cb = maketype(cb, ["undefined"])
      else cb = maketype(cb, ["function"])
      istrue = maketype(istrue, ["boolean", "undefined"])
      return end()
    }
  )
  a.unlisten = newfunc(
    function listen(all) {
      for (var l of all) {
        l[0].removeEventListener(l[1], l[2], l[3])
      }
    },
    function ({ gettype, trygettype, args: [all], end, maketype }) {
      all = maketype(all, ["array"])
      return end()
    }
  )

  a.toelem = newfunc(
    function toelem(elem, single) {
      if (a.gettype(elem, "element")) return elem
      switch (a.gettype(elem)) {
        case "string":
          return single ? a.qs(elem) : a.qsa(elem)
        case "array":
          return elem.map((elem) => {
            return a.toelem(elem, single)
          })
        case "object":
          var newobj = {
            ...elem,
          }
          if (single)
            return {
              [Object.keys(newobj)[0]]: a.toelem(
                newobj[Object.keys(newobj)[0]],
                single
              ),
            }
          a.foreach(newobj, function (a, s) {
            newobj[a] = a.toelem(s)
          })
          return newobj
        default:
          error(elem, "inside [toelem] - not an element?")
          return undefined
      }
    },
    function ({ ifunset, end, args: [elem, single], maketype }) {
      ifunset([undefined, false])
      elem = maketype(elem, ["element", "string", "array", "object"])
      single = maketype(single, ["boolean"])
      return end()
    }
  )

  a.geturlperams = newfunc(
    function geturlperams(e = location.href) {
      var arr = {}
      ;[
        ...e.matchAll(/[?&]([^&\s]+?)(?:=([^&\s]*?))?(?=&|$|\s)/g),
      ].forEach((e) => {
        if (e[1].includes("#")) arr["#"] = e[1].match(/#(.*$)/)[1]
        if (e[2].includes("#")) arr["#"] = e[2].match(/#(.*$)/)[1]
        e[1] = e[1].replace(/#.*$/, "")
        e[2] = e[2].replace(/#.*$/, "")
        arr[decodeURIComponent(e[1]).replaceAll("+", " ")] =
          e[2] === undefined
            ? undefined
            : decodeURIComponent(e[2]).replaceAll("+", " ")
      })
      return arr
    },
    function ({ end, maketype, args: [e], ifunset }) {
      ifunset([location.href])
      e = maketype(e, ["string", "undefined"])
      return end()
    }
  )

  a.updateurlperam = newfunc(
    function updateurlperam(key, value, cangoback) {
      var g = a.geturlperams()
      if (g[key] == value && !cangoback) return
      g[key] = value
      var k = ""
      var hash = ""
      a.foreach(g, function (key, value) {
        if (key == "#") return (hash = key + value)
        key = encodeURIComponent(key)
        value = encodeURIComponent(value)
        k += "&" + (value === undefined ? key : key + "=" + value)
      })
      k = k.replace("&", "?")
      k += hash
      cangoback
        ? history.pushState(null, null, k)
        : history.replaceState(null, null, k)
      return key
    },
    function ({
      ifunset,
      end,
      maketype,
      args: [key, value, cangoback],
    }) {
      ifunset([undefined, undefined, true])
      key = maketype(key, ["string"])
      value = maketype(value, ["string"])
      cangoback = maketype(cangoback, ["boolean"])
      return end()
    }
  )

  a.rerange = newfunc(
    function rerange(val, low1, high1, low2, high2) {
      return ((val - low1) / (high1 - low1)) * (high2 - low2) + low2
    },
    function ({
      end,
      maketype,
      args: [val, low1, high1, low2, high2],
    }) {
      val = maketype(val, ["number"])
      low1 = maketype(low1, ["number"])
      high1 = maketype(high1, ["number"])
      low2 = maketype(low2, ["number"])
      high2 = maketype(high2, ["number"])
      return end()
    }
  )

  a.destring = newfunc(
    function destring(inp) {
      var out = inp
      if (/^[\-0-9]+$/.test(inp)) return Number(inp)
      if (a.gettype((out = JSON.parse(inp)), "array")) return out
      if (
        a.gettype(
          (out = JSON.parse(
            inp.replaceAll("'", '"').replaceAll("`", '"')
          )),
          "object"
        )
      )
        return out
      if (inp == "true") return true
      if (inp == "false") return false
      if (inp == "undefined") return undefined
      if (inp == "NaN") return NaN
      return inp
    },
    function ({ end, maketype, args: [inp] }) {
      inp = maketype(inp, ["string"])
      return end()
    }
  )

  a.eachelem = newfunc(
    function eachelem(arr1, cb) {
      var arr = []
      var elem = []
      if (a.gettype(arr1, "array")) {
        arr1.foreach((e) => {
          elem = [
            ...elem,
            ...(a.gettype(e, "string") ? a.qsa(e) : [e]),
          ]
        })
      } else {
        elem = a.gettype(arr1, "string") ? a.qsa(ar1) : [arr1]
      }
      elem = elem.filter((e) => {
        return e instanceof Element
      })
      elem.foreach(function (...a) {
        arr.push(cb(...a))
      })
      if (arr.length == 1) arr = arr[0]
      return arr
    },
    function ({ end, maketype, args: [arr1, cb] }) {
      arr1 = maketype(arr1, ["string", "array", "element"])
      cb = maketype(cb, ["function"])
      return end()
    }
  )

  a.remove = newfunc(
    function remove(arr, idx, isidx) {
      arr = [...arr]
      idx = isidx ? idx : arr.indexOf(idx)
      if (idx < 0 || typeof idx !== "number") return arr
      arr.splice(idx, 1)
      return arr
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      trymaketype,
      trygettype,
      args: [arr, idx, isidx],
    }) {
      ifunset([undefined, undefined, true])
      isidx = maketype(isidx, ["boolean"])
      if (isidx) idx = maketype(idx, ["number"])
      arr = maketype(arr, ["array"])
      return end()
    }
  )

  a.createelem = newfunc(
    function createelem(parent, elem, data = {}) {
      var type = elem
      var issvg =
        elem == "svg" || parent?.tagName?.toLowerCase?.() == "svg"
      elem = issvg
        ? document.createElementNS("http://www.w3.org/2000/svg", elem)
        : document.createElement(elem)
      if (data.class)
        data.class.split(" ").forEach((e) => {
          elem.classList.add(e)
        })
      if (data.options && type == "select")
        data.options = data.options.map((e) =>
          a.gettype(e, "array")
            ? a.createelem(elem, "option", {
                innerHTML: e[0],
                value: e[1],
              })
            : a.createelem(elem, "option", {
                innerHTML: e,
                value: e,
              })
        )
      if (type == "label" && "for" in data) {
        data.htmlFor = data.for
      }
      Object.assign(elem.style, data)
      if (type == "select") {
        a.foreach(data, function (a, s) {
          elem[a] = s
        })
      } else if (issvg) {
        Object.keys(data).forEach((e) => (elem[e] = data[e]))
      } else {
        Object.assign(elem, data)
      }
      if (parent !== null) {
        if (typeof parent == "string") parent = a.qs(parent)
        parent.appendChild(elem)
      }
      return elem
    },
    function ({
      ifunset,
      end,
      maketype,
      args: [parent, elem, data],
    }) {
      ifunset([undefined, undefined, {}])
      parent = maketype(parent, ["element", "none"])
      elem = maketype(elem, ["string"])
      data = maketype(data, ["object"])
      return end()
    }
  )
  a.newelem = newfunc(
    function newelem(type, data = {}, inside = []) {
      var parent = a.createelem(null, type, data)
      inside.forEach((elem) => {
        parent.appendChild(elem)
      })
      return parent
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      trymaketype,
      trygettype,
      args: [type, data, inside],
    }) {
      ifunset([null, {}, []])
      type = maketype(type, ["string"])
      data = maketype(data, ["object", "undefined", "null"])
      maketype(inside, ["array", "undefined", "null"])
      return end()
    }
  )
  a.gettype = newfunc(
    function gettype(thing, match) {
      if (
        !match ||
        (Object.prototype.toString
          .call(match)
          .toLowerCase()
          .match(/^\[[a-z]+ (.+)\]$/)[1] == "string" &&
          !match.includes("|"))
      ) {
        var type = Object.prototype.toString
          .call(thing)
          .toLowerCase()
          .match(/^\[[a-z]+ (.+)\]$/)[1]
        if (type !== "function") if (type == match) return true
        if (match == "normalfunction") return type == "function"
        if (type == "htmldocument" && match == "document") return true
        if (match == "body" && type == "htmlbodyelement") return true
        if (match && new RegExp(`^html${match}element$`).test(type))
          return true
        if (/^html\w+element$/.test(type)) type = "element"
        if (type == "htmldocument") type = "element"
        if (type == "asyncfunction") type = "function"
        if (type == "generatorfunction") type = "function"
        if (type == "regexp") type = "regex"
        if (match == "regexp") match = "regex"
        if (match == "element" && type == "window") return true
        if (match == "element" && type == "shadowroot") return true
        if (match == "event" && /\w+event$/.test(type)) return true
        if (/^(html|svg).*element$/.test(type)) type = "element"
        if (type == "function") {
          type = /^\s*class\s/.test(
            Function.prototype.toString.call(thing)
          )
            ? "class"
            : "function"
        }
        if (match == "none")
          return (
            type == "nan" || type == "undefined" || type == "null"
          )
        try {
          if (type === "number" && isNaN(thing) && match == "nan")
            return true
        } catch (e) {
          error(thing)
        }
        return match ? match === type : type
      } else {
        if (match.includes("|")) match = match.split("|")
        match = [...new Set(match)]
        return match.filter((e) => a.gettype(thing, e)).length > 0
      }
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      trymaketype,
      trygettype,
      args: [_thing, match],
    }) {
      // _thing = maketype(_thing, ["any"])
      match = maketype(match, ["array", "string", "none"])
      return end()
    }
  )

  a.waitforelem = newfunc(
    async function waitforelem(selector) {
      if (a.gettype(selector, "string")) {
        selector = [selector]
      }
      await a.bodyload()
      var g = false
      return new Promise((resolve) => {
        var observer = new MutationObserver(check)
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: false,
        })
        check()
        function check() {
          if (g) return
          if (selector.find((selector) => !a.qs(selector))) return
          observer.disconnect()
          resolve(
            selector.length == 1
              ? a.qs(selector[0])
              : selector.map((e) => a.qs(e))
          )
        }
      })
    },
    function ({ ifunset, end, args: [selector], maketype }) {
      ifunset([undefined])
      selector = maketype(selector, ["string", "array"])
      return end()
    }
  )

  a.getallvars = newfunc(
    function getallvars() {
      var obj = {}
      var variables = []
      for (var name in this)
        if (
          !`window self document name location customElements history locationbar menubar personalbar scrollbars statusbar toolbar status closed frames length top opener parent frameElement navigator origin external screen innerWidth innerHeight scrollX pageXOffset scrollY pageYOffset visualViewport screenX screenY outerWidth outerHeight devicePixelRatio clientInformation screenLeft screenTop styleMedia onsearch isSecureContext trustedTypes performance onappinstalled onbeforeinstallprompt crypto indexedDB sessionStorage localStorage onbeforexrselect onabort onbeforeinput onblur oncancel oncanplay oncanplaythrough onchange onclick onclose oncontextlost oncontextmenu oncontextrestored oncuechange ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onmousewheel onpause onplay onplaying onprogress onratechange onreset onresize onscroll onsecuritypolicyviolation onseeked onseeking onselect onslotchange onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwebkitanimationend onwebkitanimationiteration onwebkitanimationstart onwebkittransitionend onwheel onauxclick ongotpointercapture onlostpointercapture onpointerdown onpointermove onpointerrawupdate onpointerup onpointercancel onpointerover onpointerout onpointerenter onpointerleave onselectstart onselectionchange onanimationend onanimationiteration onanimationstart ontransitionrun ontransitionstart ontransitionend ontransitioncancel onafterprint onbeforeprint onbeforeunload onhashchange onlanguagechange onmessage onmessageerror onoffline ononline onpagehide onpageshow onpopstate onrejectionhandled onstorage onunhandledrejection onunload crossOriginIsolated scheduler alert atob blur btoa cancelAnimationFrame cancelIdleCallback captureEvents clearInterval clearTimeout close confirm createImageBitmap fetch find focus getComputedStyle getSelection matchMedia moveBy moveTo open postMessage print prompt queueMicrotask releaseEvents reportError requestAnimationFrame requestIdleCallback resizeBy resizeTo scroll scrollBy scrollTo setInterval setTimeout stop structuredClone webkitCancelAnimationFrame webkitRequestAnimationFrame originAgentCluster navigation webkitStorageInfo speechSynthesis oncontentvisibilityautostatechange openDatabase webkitRequestFileSystem webkitResolveLocalFileSystemURL chrome caches cookieStore ondevicemotion ondeviceorientation ondeviceorientationabsolute launchQueue onbeforematch getDigitalGoodsService getScreenDetails queryLocalFonts showDirectoryPicker showOpenFilePicker showSaveFilePicker TEMPORARY PERSISTENT addEventListener dispatchEvent removeEventListener`
            .split(" ")
            .includes(name)
        )
          variables.push(name)
      variables.forEach((e) => {
        var c = String(a.gettype(this[e]))
        if (c === "object") c = "variable"
        if (!obj[c]) obj[c] = []
        obj[c].push(e)
      })
      return obj
    },
    function ({ end }) {
      return end()
    }
  )

  a.sha = newfunc(
    function sha(s = "", includesymbols) {
      var tab
      if (typeof includesymbols == "string") {
        tab = includesymbols
      } else if (includesymbols) {
        tab =
          "`~\\|[];',./{}:<>?\"!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      } else {
        tab =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      }
      return binb2b64(core_sha1(str2binb(s), s.length * 8))
      function core_sha1(x, len) {
        x[len >> 5] |= 0x80 << (24 - len)
        x[(((len + 64) >> 9) << 4) + 15] = len
        var w = Array(80)
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878
        var e = -1009589776
        for (var i = 0; i < x.length; i += 16) {
          var olda = a
          var oldb = b
          var oldc = c
          var oldd = d
          var olde = e
          for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j]
            else
              w[j] = rol(
                w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16],
                1
              )
            var t = safe_add(
              safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
              safe_add(safe_add(e, w[j]), sha1_kt(j))
            )
            e = d
            d = c
            c = rol(b, 30)
            b = a
            a = t
          }
          a = safe_add(a, olda)
          b = safe_add(b, oldb)
          c = safe_add(c, oldc)
          d = safe_add(d, oldd)
          e = safe_add(e, olde)
        }
        return Array(a, b, c, d, e)
      }
      function sha1_ft(t, b, c, d) {
        if (t < 20) return (b & c) | (~b & d)
        if (t < 40) return b ^ c ^ d
        if (t < 60) return (b & c) | (b & d) | (c & d)
        return b ^ c ^ d
      }
      function sha1_kt(t) {
        return t < 20
          ? 1518500249
          : t < 40
          ? 1859775393
          : t < 60
          ? -1894007588
          : -899497514
      }
      function safe_add(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
      }
      function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
      }
      function str2binb(str) {
        var bin = Array()
        var mask = (1 << 8) - 1
        for (var i = 0; i < str.length * 8; i += 8)
          bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (24 - i)
        return bin
      }
      function binb2b64(binarray) {
        var str = ""
        for (var i = 0; i < binarray.length * 4; i += 3) {
          var triplet =
            (((binarray[i >> 2] >> (8 * (3 - (i % 4)))) & 0xff) <<
              16) |
            (((binarray[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) &
              0xff) <<
              8) |
            ((binarray[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) &
              0xff)
          for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += ""
            else str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f)
          }
        }
        return str
      }
    },
    function ({ ifunset, end, args: [s, includesymbols], maketype }) {
      ifunset([undefined, false])
      s = maketype(s, ["string"])
      includesymbols = maketype(includesymbols, ["boolean", "string"])
      return end()
    }
  )

  a.qs = newfunc(
    function qs(text, parent = document) {
      return parent.querySelector(text)
    },
    function ({ end, args: [text, parent], maketype }) {
      parent = maketype(parent, ["element", "undefined"])
      text = maketype(text, ["string"])
      return end()
    }
  )

  a.qsa = newfunc(
    function qsa(text, parent = document) {
      return Array.from(parent.querySelectorAll(text))
    },
    function ({ end, args: [text, parent], maketype }) {
      parent = maketype(parent, ["element", "undefined"])
      text = maketype(text, ["string"])
      return end()
    }
  )

  a.csspath = newfunc(
    function csspath(el) {
      if (a.gettype(el, "array"))
        return a.map(el, (e) => a.csspath(e))
      if (!(el instanceof Element)) return
      var path = []
      while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase()
        if (el.id) {
          selector += "#" + el.id
          path.unshift(selector)
          break
        } else {
          var sib = el,
            nth = 1
          while ((sib = sib.previousElementSibling)) {
            if (sib.nodeName.toLowerCase() == selector) nth++
          }
          if (nth != 1) selector += ":nth-of-type(" + nth + ")"
        }
        path.unshift(selector)
        el = el.parentNode
      }
      return path.join(" > ")
    },
    function ({ end, args: [el], maketype }) {
      el = maketype(el, ["element", "array"])
      return end()
    }
  )

  a.fromms = newfunc(
    function fromms(ms) {
      ms = Number(ms)
      return {
        years: Math.floor(ms / 1000 / 60 / 60 / 24 / 365),
        days: Math.floor(ms / 1000 / 60 / 60 / 24) % 365,
        hours: Math.floor(ms / 1000 / 60 / 60) % 24,
        mins: Math.floor(ms / 1000 / 60) % 60,
        secs: Math.floor(ms / 1000) % 60,
        ms: Math.floor(ms) % 1000,
      }
    },
    function ({ ifunset, end, args: [ms], maketype }) {
      ifunset([0]) // Default value for ms
      ms = maketype(ms, ["number"]) // Ensure ms is a number
      return end()
    }
  )

  a.fromms = newfunc(
    function fromms(ms) {
      ms = Number(ms)
      return {
        years: Math.floor(ms / 1000 / 60 / 60 / 24 / 365),
        days: Math.floor(ms / 1000 / 60 / 60 / 24) % 365,
        hours: Math.floor(ms / 1000 / 60 / 60) % 24,
        mins: Math.floor(ms / 1000 / 60) % 60,
        secs: Math.floor(ms / 1000) % 60,
        ms: Math.floor(ms) % 1000,
      }
    },
    function ({ ifunset, end, args: [ms], maketype }) {
      ifunset([0]) // Default value for ms
      ms = maketype(ms, ["number"]) // Ensure ms is a number
      return end()
    }
  )

  a.rect = newfunc(
    function rect(e) {
      if (a.gettype(e, "string")) e = a.qs(e)
      var { x, y, width, height } = e.getBoundingClientRect().toJSON()
      return {
        x,
        y,
        w: width,
        h: height,
      }
    },
    function ({ end, args: [e], maketype }) {
      e = maketype(e, ["element", "string"])
      return end()
    }
  )

  a.setelem = newfunc(
    function setelem(elem, data) {
      var issvg =
        elem == "svg" || parent?.tagName?.toLowerCase?.() == "svg"
      if (data.class)
        data.class.split(" ").forEach((e) => {
          elem.classList.add(e)
        })
      if (data.options && elem.tagName.toLowerCase() == "select")
        data.options = data.options.map((e) =>
          a.gettype(e, "array")
            ? a.createelem(elem, "option", {
                innerHTML: e[0],
                value: e[1],
              })
            : a.createelem(elem, "option", {
                innerHTML: e,
                value: e,
              })
        )
      if (elem.tagName.toLowerCase() == "label" && "for" in data) {
        data.htmlFor = data.for
      }
      Object.assign(elem.style, data)
      if (elem.tagName.toLowerCase() == "select") {
        a.foreach(data, function (a, s) {
          elem[a] = s
        })
      } else if (issvg) {
        Object.keys(data).forEach((e) => (elem[e] = data[e]))
      } else {
        Object.assign(elem, data)
      }
      return elem
    },
    function ({ ifunset, end, args: [elem, data], maketype }) {
      ifunset([undefined, {}]) // Default value for data
      elem = maketype(elem, ["element", "string"]) // Ensure elem is an element or string
      data = maketype(data, ["object"]) // Ensure data is an object
      return end()
    }
  )

  a.watchvar = newfunc(
    function watchvar(varname, onset, onget, obj = window) {
      obj = obj || window
      obj[`_${varname}`] = undefined
      obj[`${varname}`] = undefined
      Object.defineProperty(obj, varname, {
        configurable: false,
        get() {
          if (onget) return onget(obj[`_${varname}`])
          return obj[`_${varname}`]
        },
        set(value) {
          if (value === obj[`_${varname}`]) {
            return
          }
          var s = onset(value, obj[`_${varname}`])
          if (s) obj[`_${varname}`] = value
        },
      })
    },
    function ({
      ifunset,
      end,
      args: [varname, onset, onget, obj],
      maketype,
    }) {
      ifunset([undefined, () => {}, () => {}, window]) // Default values
      varname = maketype(varname, ["string"]) // Ensure varname is a string
      onset = maketype(onset, ["function"]) // Ensure onset is a function
      onget = maketype(onget, ["function", "undefined"]) // Ensure onget is a function or undefined
      obj = maketype(obj, ["object", "undefined"]) // Ensure obj is an object or undefined
      return end()
    }
  )

  a.randomizeorder = newfunc(
    function randomizeorder(arr) {
      arr = [...arr]
      var arr2 = []
      var count = arr.length
      for (var i = 0; i < count; i++) {
        var idx = a.randfrom(0, arr.length - 1)
        arr2.push(arr[idx])
        arr.splice(idx, 1)
      }
      return arr2
    },
    function ({ end, args: [arr], maketype }) {
      arr = maketype(arr, ["array"]) // Ensure arr is an array
      return end()
    }
  )

  a.constrainvar = newfunc(
    function constrainvar(varname, min, max) {
      window[`_${varname}`] = undefined
      window[`${varname}`] = undefined
      Object.defineProperty(window, varname, {
        configurable: false,
        get() {
          return window[`_${varname}`]
        },
        set(value) {
          if (value === window[`_${varname}`]) {
            return
          }
          if (value > max) value = max
          if (value < min) value = min
          window[`_${varname}`] = value
        },
      })
    },
    function ({ ifunset, end, args: [varname, min, max], maketype }) {
      ifunset([undefined, -Infinity, Infinity]) // Default values for min and max
      varname = maketype(varname, ["string"]) // Ensure varname is a string
      min = maketype(min, ["number"]) // Ensure min is a number
      max = maketype(max, ["number"]) // Ensure max is a number
      return end()
    }
  )

  a.isbetween = newfunc(
    function isbetween(z, x, c) {
      if (x == c) return false
      var big, small
      if (x > c) {
        big = x
        small = c
      } else {
        big = c
        small = x
      }
      return z > big && z < small
    },
    function ({ args: [z, x, c], end, maketype }) {
      z = maketype(z, ["number"])
      x = maketype(x, ["number"])
      c = maketype(c, ["number"])
      return end()
    }
  )

  a.indexsof = newfunc(
    function indexsof(y, x) {
      var i = 0
      var arr = []
      y.split(x).forEach((e, k) => {
        i += e.length
        arr.push(i + k)
      })
      arr.pop()
      return arr
    },
    function ({ args: [y, x], end, maketype }) {
      y = maketype(y, ["string"]) // Ensure y is a string
      x = maketype(x, ["string"]) // Ensure x is a string
      return end()
    }
  )

  a._export = newfunc(
    function _export() {
      var s = []
      a.qsa("input, textarea").foreach((e) => {
        s.push({
          path: a.csspath(e),
          value: escape(e.value),
          checked: e.checked,
        })
      })
      return JSON.stringify(s)
    },
    function ({ end }) {
      return end()
    }
  )

  a._import = newfunc(
    function _import(data) {
      data.forEach((e) => {
        var s = a.qs(e.path)
        s.checked = e.checked
        s.value = unescape(e.value)
      })
      return data
    },
    function ({ end, args: [data], maketype }) {
      data = maketype(data, ["array"])
      return end()
    }
  )

  a.popup = newfunc(
    function popup(data, x, y, w, h) {
      if (x || x === 0) {
        x = (screen.width / 100) * x
        y = (screen.height / 100) * y
        w = (screen.width / 100) * w
        h = (screen.height / 100) * h
        var win = open(
          "",
          "",
          `left=${x}, top=${y} width=${w},height=${h}`
        )
        win.document.write(data)
        return win
      } else {
        var win = open("")
        win.document.write(data)
        return win
      }
    },
    function ({ end, maketype, args: [data, x, y, w, h] }) {
      data = maketype(data, ["string"])
      x = maketype(x, ["number"])
      y = maketype(y, ["number"])
      w = maketype(w, ["number"])
      h = maketype(h, ["number"])
      return end()
    }
  )

  a.same = newfunc(
    function same(...a) {
      if (a.length == 1) a = a[0]
      return (
        [...new Set(a.map((e) => JSON.stringify(e)))].length === 1
      )
    },
    function ({ end }) {
      return end()
    }
  )

  a.containsany = newfunc(
    function containsany(arr1, arr2) {
      return !!arr2.find((e) => arr1.includes(e))
    },
    function ({ end, args: [arr1, arr2], maketype }) {
      arr1 = maketype(arr1, ["string", "array"])
      arr2 = maketype(arr2, ["string", "array"])
      return end()
    }
  )

  a.getprops = newfunc(
    function getprops(func, peramsonly) {
      return peramsonly
        ? getprops(func)
            .vars.map((e) => e.var)
            .filter((e) => e)
        : getprops(func)
    },
    function ({ end, args: [func, peramsonly], maketype }) {
      func = maketype(func, ["function"]) // Ensure func is a function
      peramsonly = maketype(peramsonly, ["boolean", "undefined"]) // Ensure peramsonly is a boolean or undefined
      return end()
    }
  )

  a.bodyload = newfunc(
    function bodyload() {
      return new Promise((resolve) => {
        if (document.body) resolve()
        var observer = new MutationObserver(function () {
          if (document.body) {
            resolve()
            observer.disconnect()
          }
        })
        observer.observe(document.documentElement, {
          childList: true,
        })
      })
    },
    function ({ end }) {
      return end()
    }
  )

  a.repeat = newfunc(
    function repeat(func, count, delay, instantstart, waituntildone) {
      if (delay || waituntildone)
        return new Promise(async (resolve) => {
          if (delay) {
            var extra = 0
            for (var i = 0; i < count; i++) {
              if (instantstart)
                waituntildone ? await func(i) : func(i)
              extra = await a.wait(delay - extra)
              if (!instantstart)
                waituntildone ? await func(i) : func(i)
            }
            resolve()
          } else
            for (var i = 0; i < count; i++)
              waituntildone ? await func(i) : func(i)
          resolve()
        })
      for (var i = 0; i < count; i++) func(i)
      return
    },
    function ({
      end,
      args: [func, count, delay, instantstart, waituntildone],
      maketype,
    }) {
      func = maketype(func, ["function"]) // Ensure func is a function
      count = maketype(count, ["number"]) // Ensure count is a number
      delay = maketype(delay, ["number", "undefined"]) // Ensure delay is a number or undefined
      instantstart = maketype(instantstart, ["boolean", "undefined"]) // Ensure instantstart is a boolean or undefined
      waituntildone = maketype(waituntildone, [
        "boolean",
        "undefined",
      ]) // Ensure waituntildone is a boolean or undefined
      return end()
    }
  )

  a.repeatuntil = newfunc(
    function repeatuntil(
      func,
      donecheck,
      delay,
      instantstart,
      waituntildone
    ) {
      return new Promise(async (resolve) => {
        if (delay) {
          var extra = 0
          var i = 0
          while (!donecheck()) {
            i++
            if (instantstart) {
              waituntildone ? await func(i) : func(i)
            }
            extra = await a.wait(delay - extra)
            if (!instantstart) {
              waituntildone ? await func(i) : func(i)
            }
          }
          resolve()
        } else {
          var i = 0
          while (!donecheck()) {
            i++
            waituntildone ? await func(i) : func(i)
          }
          resolve()
        }
      })
    },
    function ({
      end,
      args: [func, donecheck, delay, instantstart, waituntildone],
      maketype,
    }) {
      func = maketype(func, ["function"]) // Ensure func is a function
      donecheck = maketype(donecheck, ["function"]) // Ensure donecheck is a function
      delay = maketype(delay, ["number", "undefined"]) // Ensure delay is a number or undefined
      instantstart = maketype(instantstart, ["boolean", "undefined"]) // Ensure instantstart is a boolean or undefined
      waituntildone = maketype(waituntildone, [
        "boolean",
        "undefined",
      ]) // Ensure waituntildone is a boolean or undefined
      return end()
    }
  )

  a.getfolderpath = newfunc(
    async function getfolderpath(folder) {
      async function parsedir(dir, x) {
        if (!x) {
          return [
            {
              name: dir.name,
              inside: await parsedir(dir, true),
              type: "folder",
              handle: dir,
            },
          ]
        } else var arr = []
        for await (const [name, handle] of dir.entries()) {
          arr.push(
            a.gettype(handle, "filesystemdirectoryhandle")
              ? {
                  type: "folder",
                  inside: await parsedir(handle, true),
                  name,
                  handle,
                }
              : { type: "file", handle, name }
          )
        }
        return arr
      }
      return parsedir(folder)
    },
    function ({ end, args: [folder], maketype }) {
      folder = maketype(folder, ["filesystemdirectoryhandle"])
      return end()
    }
  )

  a.getfiles = newfunc(
    async function getfiles(
      oldway,
      multiple,
      accept = [],
      options = {}
    ) {
      const supportsFileSystemAccess =
        "showOpenFilePicker" in window &&
        (() => {
          try {
            return window.self === window.top
          } catch {
            return false
          }
        })()
      if (!oldway) {
        if (!supportsFileSystemAccess) throw new Error("no access")
        let fileOrFiles = undefined
        try {
          const handles = await showOpenFilePicker({
            types: [
              {
                accept: {
                  "*/*": accept,
                },
              },
            ],
            multiple,
            ...options,
          })
          if (!multiple) {
            fileOrFiles = handles[0]
          } else {
            fileOrFiles = await Promise.all(handles)
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            error(err.name, err.message)
          }
        }
        return fileOrFiles
      }
      return new Promise(async (resolve) => {
        await a.bodyload()
        const input = document.createElement("input")
        input.style.display = "none"
        input.type = "file"
        if (accept) input.accept = accept
        document.body.append(input)
        if (multiple) {
          input.multiple = true
        }
        input.addEventListener("change", () => {
          input.remove()
          resolve(multiple ? Array.from(input.files) : input.files[0])
        })
        if ("showPicker" in HTMLInputElement.prototype) {
          input.showPicker()
        } else {
          input.click()
        }
      })
    },
    function ({
      end,
      args: [oldway, multiple, accept, options],
      maketype,
      ifunset,
    }) {
      ifunset(undefined, undefined, [], {})
      oldway = maketype(oldway, ["boolean"]) // Ensure oldway is a boolean
      multiple = maketype(multiple, ["boolean"]) // Ensure multiple is a boolean
      accept = maketype(accept, ["array", "string", "undefined"]) // Ensure accept is an array or string
      options = maketype(options, ["object", "undefined"])
      return end()
    }
  )
  a.getfolder = newfunc(
    async function getfolder(write = false, options = {}) {
      const supportsFileSystemAccess =
        "showDirectoryPicker" in window &&
        (() => {
          try {
            return window.self === window.top
          } catch {
            return false
          }
        })()
      if (!supportsFileSystemAccess) throw new Error("no access")
      try {
        return await showDirectoryPicker({
          mode: write ? "readwrite" : "read",
          ...options,
        })
      } catch (err) {
        if (err.name !== "AbortError") {
          error(err.name, err.message)
        }
      }
      return undefined
    },
    function ({ end, args: [write, options], maketype, ifunset }) {
      ifunset(false, {})
      write = maketype(write, ["boolean", "undefined"])
      options = maketype(options, ["object", "undefined"])
      return end()
    }
  )

  a.map = newfunc(
    function map(arr, func) {
      var type = a.gettype(arr)
      if (type == "array") return arr.map(func)
      else if (type == "object") {
        var temparr = {}
        Reflect.ownKeys(arr).forEach((e, i) => {
          temparr = {
            ...temparr,
            ...func(e, arr[e], i),
          }
        })
        return temparr
      } else {
        return [arr].map(func)
      }
    },
    function ({ end, args: [arr, func], maketype }) {
      arr = maketype(arr, ["array", "object"]) // Ensure arr is an array or object
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.find = newfunc(
    function find(arr, func) {
      var type = a.gettype(arr)
      if (type == "array") return arr.find(func)
      else if (type == "object") {
        return Reflect.ownKeys(arr).find((e, i) => {
          return func(e, arr[e], i)
        })
      } else {
        return [arr].find(func)
      }
    },
    function ({ end, args: [arr, func], maketype }) {
      arr = maketype(arr, ["array", "object"]) // Ensure arr is an array or object
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.filteridx = newfunc(
    function filteridx(arr, func) {
      if (a.gettype(arr, "object")) arr = [arr]
      return a
        .map(arr, (e, i) => (func(e, i) ? i : undefined))
        .filter((e) => e !== undefined)
    },
    function ({ end, args: [arr, func], maketype }) {
      arr = maketype(arr, ["array", "object"]) // Ensure arr is an array or object
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.filter = newfunc(
    function filter(arr, func) {
      var type = a.gettype(arr)
      if (type == "array") return arr.filter(func)
      else if (type == "object") {
        var temparr = {}
        Reflect.ownKeys(arr).forEach((e, i) => {
          if (func(e, arr[e], i))
            temparr = {
              ...temparr,
              [e]: arr[e],
            }
        })
        return temparr
      } else {
        return [arr].filter(func)
      }
    },
    function ({ end, args: [arr, func], maketype }) {
      arr = maketype(arr, ["array", "object"]) // Ensure arr is an array or object
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.unique = newfunc(
    function unique() /*object*/ {
      return last || (last = different.new())
    },
    function ({ end }) {
      return end()
    }
  )

  a.tostring = newfunc(
    function tostring(e) {
      if (["object", "array"].includes(a.gettype(e)))
        return JSON.stringify(e)
      if (a.gettype(e, "element")) return a.csspath(e)
      return String(e)
    },
    function ({ end, args: [e], maketype }) {
      e = maketype(e, ["any"]) // Ensure e can be any type
      return end()
    }
  )

  a.toregex = newfunc(
    function toregex(d, s) {
      if (a.gettype(d, "array")) var temp = d
      if (s) var temp = [d, s]
      else if (String(d).match(/^\/(.*)\/(\w*)$/)) {
        var m = String(d).match(/^\/(.*)\/(\w*)$/)
        var temp = [m[1], m[2]]
      } else var temp = [String(d), ""]
      temp[1] = temp[1].toLowerCase()
      if (temp[1].includes("w")) {
        temp[1] = temp[1].replace("w", "")
        temp[0] = `(?<=[^a-z0-9]|^)${temp[0]}(?=[^a-z0-9]|$)`
      }
      return new RegExp(
        temp[0],
        temp[1].replaceAll(/(.)(?=.*\1)/g, "")
      )
    },
    function ({ end, args: [d, s], maketype }) {
      d = maketype(d, ["string", "array"]) // Ensure d is a string or array
      s = maketype(s, ["string", "undefined"]) // Ensure s is a string or undefined
      return end()
    }
  )

  a.isregex = newfunc(
    function isregex(s) {
      if (a.gettype(s, "regex")) return true
      return (
        /^\/.*(?<!\\)\/[gimusy]*$/.test(s) && !/^\/\*.*\*\/$/.test(s)
      )
    },
    function ({ end, args: [s], maketype }) {
      s = maketype(s, ["string"]) // Ensure s is a string
      return end()
    }
  )

  a.ispressed = newfunc(
    function ispressed(e /*event*/, code) {
      code = code.toLowerCase()
      var temp =
        e.shiftKey == code.includes("shift") &&
        e.altKey == code.includes("alt") &&
        e.ctrlKey == code.includes("ctrl") &&
        e.metaKey == code.includes("meta") &&
        e.key.toLowerCase() ==
          code.replaceAll(/alt|ctrl|shift|meta/g, "").trim()
      if (temp && !a) e.preventDefault()
      return temp
    },
    function ({ end, args: [e, code], maketype }) {
      e = maketype(e, ["object"]) // Ensure e is an event object
      code = maketype(code, ["string"]) // Ensure code is a string
      return end()
    }
  )

  a.controller_vibrate = newfunc(
    function controller_vibrate(
      pad,
      duration = 1000,
      strongMagnitude = 0,
      weakMagnitude = 0
    ) {
      getpad(pad).vibrationActuator.playEffect("dual-rumble", {
        duration,
        strongMagnitude,
        weakMagnitude,
      })
      return pad
    },
    function ({
      end,
      args: [pad, duration, strongMagnitude, weakMagnitude],
      maketype,
    }) {
      pad = maketype(pad, ["element"]) // Ensure pad is a valid element
      duration = maketype(duration, ["number"]) // Ensure duration is a number
      strongMagnitude = maketype(strongMagnitude, ["number"]) // Ensure strongMagnitude is a number
      weakMagnitude = maketype(weakMagnitude, ["number"]) // Ensure weakMagnitude is a number
      return end()
    }
  )

  a.controller_getbutton = newfunc(
    function controller_getbutton(pad, button) {
      return button
        ? getpad(pad).buttons[button].value
        : getpad(pad).buttons.map((e) => e.value)
    },
    function ({ end, args: [pad, button], maketype }) {
      pad = maketype(pad, ["element"]) // Ensure pad is a valid element
      button = maketype(button, ["number", "undefined"]) // Ensure button is a number or undefined
      return end()
    }
  )

  a.controller_getaxes = newfunc(
    function controller_getaxes(pad, axes) {
      return axes ? getpad(pad).axes[axes] : getpad(pad).axes
    },
    function ({ end, args: [pad, axes], maketype }) {
      pad = maketype(pad, ["element"]) // Ensure pad is a valid element
      axes = maketype(axes, ["number", "undefined"]) // Ensure axes is a number or undefined
      return end()
    }
  )

  a.controller_exists = newfunc(
    function controller_exists(pad) {
      return pad === undefined
        ? getpad().filter((e) => e).length
        : !!getpad(pad)
    },
    function ({ end, args: [pad], maketype }) {
      pad = maketype(pad, ["element", "undefined"]) // Ensure pad is a valid element or undefined
      return end()
    }
  )

  a.readfile = newfunc(
    async function readfile(file, type = "Text") {
      return new Promise(function (done, error) {
        var f = new FileReader()
        f.onerror = error
        f.onload = () =>
          done(type == "json" ? JSON.parse(f.result) : f.result)
        f["readAs" + (type == "json" ? "Text" : type)](file)
      })
    },
    function ({ end, args: [file, type], maketype, ifunset }) {
      ifunset(undefined, "Text")
      type = maketype(type, ["string", "undefined"]) // Ensure type is a string
      return end()
    }
  )

  a.writefile = newfunc(
    async function writefile(file, text) {
      var f = await file.createWritable()
      await f.write(text)
      await f.close()
      return file
    },
    function ({ end, args: [file, text], maketype }) {
      text = maketype(text, ["string"]) // Ensure text is a string
      return end()
    }
  )

  a.getfileperms = newfunc(
    async function getfileperms(fileHandle, readWrite) {
      const options = {}
      if (readWrite) {
        options.mode = "readwrite"
      }
      try {
        return (
          (await fileHandle.queryPermission(options)) === "granted" ||
          (await fileHandle.requestPermission(options)) === "granted"
        )
      } catch (e) {
        await a.waitforclick()
        return (
          (await fileHandle.queryPermission(options)) === "granted" ||
          (await fileHandle.requestPermission(options)) === "granted"
        )
      }
    },
    function ({ end, args: [fileHandle, readWrite], maketype }) {
      readWrite = maketype(readWrite, ["boolean", "undefined"]) // Ensure readWrite is a boolean or undefined
      return end()
    }
  )
  a.waitforclick = newfunc(
    async function waitforclick(fileHandle, readWrite) {
      return new Promise((resolve) => {
        var listener = a.listen(
          window,
          "click",
          () => {
            a.unlisten(listener)
            resolve()
          },
          true
        )
      })
    },
    function ({ end, args: [] }) {
      return end()
    }
  )

  a.indexeddb_set = newfunc(
    async function indexeddb_set(place, obj) {
      return new Promise((done, error) =>
        place.put(
          obj,
          (e) => done(e),
          (e) => error(e)
        )
      )
    },
    function ({ end, args: [place, obj], maketype }) {
      place = maketype(place, ["object"]) // Ensure place is an object
      obj = maketype(obj, ["object"]) // Ensure obj is an object
      return end()
    }
  )

  a.indexeddb_get = newfunc(
    async function indexeddb_get(place, obj) {
      return new Promise((done, error) =>
        place.get(
          obj,
          (e) => done(e),
          (e) => error(e)
        )
      )
    },
    function ({ end, args: [place, obj], maketype }) {
      place = maketype(place, ["object"]) // Ensure place is an object
      obj = maketype(obj, ["string"]) // Ensure obj is a string
      return end()
    }
  )

  a.indexeddb_getall = newfunc(
    async function indexeddb_getall(place) {
      return new Promise((done, error) =>
        place.getAll(
          (e) => done(e),
          (e) => error(e)
        )
      )
    },
    function ({ end, args: [place], maketype }) {
      place = maketype(place, ["object"]) // Ensure place is an object
      return end()
    }
  )

  a.indexeddb_clearall = newfunc(
    async function indexeddb_clearall(place) {
      return new Promise((done, error) =>
        place.clear(
          (e) => done(e),
          (e) => error(e)
        )
      )
    },
    function ({ end, args: [place], maketype }) {
      place = maketype(place, ["object"]) // Ensure place is an object
      return end()
    }
  )

  a.indexeddb_remove = newfunc(
    async function indexeddb_remove(place, obj) {
      return new Promise((done, error) =>
        place.remove(
          obj,
          (e) => done(e),
          (e) => error(e)
        )
      )
    },
    function ({ end, args: [place, obj], maketype }) {
      place = maketype(place, ["object"]) // Ensure place is an object
      obj = maketype(obj, ["string"]) // Ensure obj is a string
      return end()
    }
  )

  a.indexeddb_setup = newfunc(
    async function indexeddb_setup(obj) {
      return new Promise((e) => {
        var x
        obj = {
          dbVersion: 1,
          storeName: "tempstorename",
          keyPath: "id",
          autoIncrement: true,
          ...obj,
          onStoreReady() {
            e(x)
          },
        }
        if (!window.IDBStore) {
          ;(function (p, h, k) {
            "function" === typeof define
              ? define(h)
              : "undefined" !== typeof module && module.exports
              ? (module.exports = h())
              : (k[p] = h())
          })(
            "IDBStore",
            function () {
              function p(a, b) {
                var c, d
                for (c in b)
                  (d = b[c]), d !== u[c] && d !== a[c] && (a[c] = d)
                return a
              }
              var h = function (a) {
                  throw a
                },
                k = function () {},
                r = {
                  storeName: "Store",
                  storePrefix: "IDBWrapper-",
                  dbVersion: 1,
                  keyPath: "id",
                  autoIncrement: !0,
                  onStoreReady: function () {},
                  onError: h,
                  indexes: [],
                  implementationPreference: [
                    "indexedDB",
                    "webkitIndexedDB",
                    "mozIndexedDB",
                    "shimIndexedDB",
                  ],
                },
                q = function (a, b) {
                  "undefined" == typeof b &&
                    "function" == typeof a &&
                    (b = a)
                  "[object Object]" !=
                    Object.prototype.toString.call(a) && (a = {})
                  for (var c in r)
                    this[c] = "undefined" != typeof a[c] ? a[c] : r[c]
                  this.dbName = this.storePrefix + this.storeName
                  this.dbVersion = parseInt(this.dbVersion, 10) || 1
                  b && (this.onStoreReady = b)
                  var d = "object" == typeof window ? window : self
                  this.implementation =
                    this.implementationPreference.filter(function (
                      a
                    ) {
                      return a in d
                    })[0]
                  this.idb = d[this.implementation]
                  this.keyRange =
                    d.IDBKeyRange ||
                    d.webkitIDBKeyRange ||
                    d.mozIDBKeyRange
                  this.consts = {
                    READ_ONLY: "readonly",
                    READ_WRITE: "readwrite",
                    VERSION_CHANGE: "versionchange",
                    NEXT: "next",
                    NEXT_NO_DUPLICATE: "nextunique",
                    PREV: "prev",
                    PREV_NO_DUPLICATE: "prevunique",
                  }
                  this.openDB()
                },
                t = {
                  constructor: q,
                  version: "1.7.2",
                  db: null,
                  dbName: null,
                  dbVersion: null,
                  store: null,
                  storeName: null,
                  storePrefix: null,
                  keyPath: null,
                  autoIncrement: null,
                  indexes: null,
                  implementationPreference: null,
                  implementation: "",
                  onStoreReady: null,
                  onError: null,
                  _insertIdCount: 0,
                  openDB: function () {
                    var a = this.idb.open(
                        this.dbName,
                        this.dbVersion
                      ),
                      b = !1
                    a.onerror = function (a) {
                      var b
                      b =
                        "error" in a.target
                          ? "VersionError" == a.target.error.name
                          : "errorCode" in a.target
                          ? 12 == a.target.errorCode
                          : !1
                      if (b)
                        this.onError(
                          Error(
                            "The version number provided is lower than the existing one."
                          )
                        )
                      else
                        a.target.error
                          ? (a = a.target.error)
                          : ((b =
                              "IndexedDB unknown error occurred when opening DB " +
                              this.dbName +
                              " version " +
                              this.dbVersion),
                            "errorCode" in a.target &&
                              (b +=
                                " with error code " +
                                a.target.errorCode),
                            (a = Error(b))),
                          this.onError(a)
                    }.bind(this)
                    a.onsuccess = function (a) {
                      if (!b)
                        if (this.db) this.onStoreReady()
                        else if (
                          ((this.db = a.target.result),
                          "string" == typeof this.db.version)
                        )
                          this.onError(
                            Error(
                              "The IndexedDB implementation in this browser is outdated. Please upgrade your browser."
                            )
                          )
                        else if (
                          this.db.objectStoreNames.contains(
                            this.storeName
                          )
                        ) {
                          this.store = this.db
                            .transaction(
                              [this.storeName],
                              this.consts.READ_ONLY
                            )
                            .objectStore(this.storeName)
                          var d = Array.prototype.slice.call(
                            this.getIndexList()
                          )
                          this.indexes.forEach(function (a) {
                            var c = a.name
                            if (c)
                              if (
                                (this.normalizeIndexData(a),
                                this.hasIndex(c))
                              ) {
                                var g = this.store.index(c)
                                this.indexComplies(g, a) ||
                                  ((b = !0),
                                  this.onError(
                                    Error(
                                      'Cannot modify index "' +
                                        c +
                                        '" for current version. Please bump version number to ' +
                                        (this.dbVersion + 1) +
                                        "."
                                    )
                                  ))
                                d.splice(d.indexOf(c), 1)
                              } else
                                (b = !0),
                                  this.onError(
                                    Error(
                                      'Cannot create new index "' +
                                        c +
                                        '" for current version. Please bump version number to ' +
                                        (this.dbVersion + 1) +
                                        "."
                                    )
                                  )
                            else
                              (b = !0),
                                this.onError(
                                  Error(
                                    "Cannot create index: No index name given."
                                  )
                                )
                          }, this)
                          d.length &&
                            ((b = !0),
                            this.onError(
                              Error(
                                'Cannot delete index(es) "' +
                                  d.toString() +
                                  '" for current version. Please bump version number to ' +
                                  (this.dbVersion + 1) +
                                  "."
                              )
                            ))
                          b || this.onStoreReady()
                        } else
                          this.onError(
                            Error("Object store couldn't be created.")
                          )
                    }.bind(this)
                    a.onupgradeneeded = function (a) {
                      this.db = a.target.result
                      this.db.objectStoreNames.contains(
                        this.storeName
                      )
                        ? (this.store =
                            a.target.transaction.objectStore(
                              this.storeName
                            ))
                        : ((a = {
                            autoIncrement: this.autoIncrement,
                          }),
                          null !== this.keyPath &&
                            (a.keyPath = this.keyPath),
                          (this.store = this.db.createObjectStore(
                            this.storeName,
                            a
                          )))
                      var d = Array.prototype.slice.call(
                        this.getIndexList()
                      )
                      this.indexes.forEach(function (a) {
                        var c = a.name
                        c ||
                          ((b = !0),
                          this.onError(
                            Error(
                              "Cannot create index: No index name given."
                            )
                          ))
                        this.normalizeIndexData(a)
                        if (this.hasIndex(c)) {
                          var g = this.store.index(c)
                          this.indexComplies(g, a) ||
                            (this.store.deleteIndex(c),
                            this.store.createIndex(c, a.keyPath, {
                              unique: a.unique,
                              multiEntry: a.multiEntry,
                            }))
                          d.splice(d.indexOf(c), 1)
                        } else
                          this.store.createIndex(c, a.keyPath, {
                            unique: a.unique,
                            multiEntry: a.multiEntry,
                          })
                      }, this)
                      d.length &&
                        d.forEach(function (a) {
                          this.store.deleteIndex(a)
                        }, this)
                    }.bind(this)
                  },
                  deleteDatabase: function (a, b) {
                    if (this.idb.deleteDatabase) {
                      this.db.close()
                      var c = this.idb.deleteDatabase(this.dbName)
                      c.onsuccess = a
                      c.onerror = b
                    } else
                      b(
                        Error(
                          "Browser does not support IndexedDB deleteDatabase!"
                        )
                      )
                  },
                  put: function (a, b, c, d) {
                    null !== this.keyPath &&
                      ((d = c), (c = b), (b = a))
                    d || (d = h)
                    c || (c = k)
                    var f = !1,
                      e = null,
                      g = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_WRITE
                      )
                    g.oncomplete = function () {
                      ;(f ? c : d)(e)
                    }
                    g.onabort = d
                    g.onerror = d
                    null !== this.keyPath
                      ? (this._addIdPropertyIfNeeded(b),
                        (a = g.objectStore(this.storeName).put(
                          (() => {
                            function isFilesystemHandle(obj) {
                              return (
                                obj &&
                                (obj instanceof
                                  FileSystemFileHandle ||
                                  obj instanceof
                                    FileSystemDirectoryHandle)
                              )
                            }
                            function replaceProxies(obj) {
                              if (isFilesystemHandle(obj)) {
                                return obj
                              }
                              if (
                                typeof obj !== "object" ||
                                obj === null
                              ) {
                                return obj
                              }
                              if (Array.isArray(obj)) {
                                return obj.map((item) =>
                                  replaceProxies(item)
                                )
                              }
                              const result = {}
                              for (const key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                  result[key] = replaceProxies(
                                    obj[key]
                                  )
                                }
                              }
                              return result
                            }
                            return replaceProxies(b)
                          })()
                        )))
                      : (a = g.objectStore(this.storeName).put(b, a))
                    a.onsuccess = function (a) {
                      f = !0
                      e = a.target.result
                    }
                    a.onerror = d
                    return g
                  },
                  get: function (a, b, c) {
                    c || (c = h)
                    b || (b = k)
                    var d = !1,
                      f = null,
                      e = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_ONLY
                      )
                    e.oncomplete = function () {
                      ;(d ? b : c)(f)
                    }
                    e.onabort = c
                    e.onerror = c
                    a = e.objectStore(this.storeName).get(a)
                    a.onsuccess = function (a) {
                      d = !0
                      f = a.target.result
                    }
                    a.onerror = c
                    return e
                  },
                  remove: function (a, b, c) {
                    c || (c = h)
                    b || (b = k)
                    var d = !1,
                      f = null,
                      e = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_WRITE
                      )
                    e.oncomplete = function () {
                      ;(d ? b : c)(f)
                    }
                    e.onabort = c
                    e.onerror = c
                    a = e.objectStore(this.storeName)["delete"](a)
                    a.onsuccess = function (a) {
                      d = !0
                      f = a.target.result
                    }
                    a.onerror = c
                    return e
                  },
                  batch: function (a, b, c) {
                    c || (c = h)
                    b || (b = k)
                    if (
                      "[object Array]" !=
                      Object.prototype.toString.call(a)
                    )
                      c(
                        Error(
                          "dataArray argument must be of type Array."
                        )
                      )
                    else if (0 === a.length) return b(!0)
                    var d = a.length,
                      f = !1,
                      e = !1,
                      g = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_WRITE
                      )
                    g.oncomplete = function () {
                      ;(e ? b : c)(e)
                    }
                    g.onabort = c
                    g.onerror = c
                    var l = function () {
                      d--
                      0 !== d || f || (e = f = !0)
                    }
                    a.forEach(function (a) {
                      var b = a.type,
                        d = a.key,
                        e = a.value
                      a = function (a) {
                        g.abort()
                        f || ((f = !0), c(a, b, d))
                      }
                      "remove" == b
                        ? ((e = g
                            .objectStore(this.storeName)
                            ["delete"](d)),
                          (e.onsuccess = l),
                          (e.onerror = a))
                        : "put" == b &&
                          (null !== this.keyPath
                            ? (this._addIdPropertyIfNeeded(e),
                              (e = g
                                .objectStore(this.storeName)
                                .put(e)))
                            : (e = g
                                .objectStore(this.storeName)
                                .put(e, d)),
                          (e.onsuccess = l),
                          (e.onerror = a))
                    }, this)
                    return g
                  },
                  putBatch: function (a, b, c) {
                    a = a.map(function (a) {
                      return { type: "put", value: a }
                    })
                    return this.batch(a, b, c)
                  },
                  upsertBatch: function (a, b, c, d) {
                    "function" == typeof b && ((d = c = b), (b = {}))
                    d || (d = h)
                    c || (c = k)
                    b || (b = {})
                    "[object Array]" !=
                      Object.prototype.toString.call(a) &&
                      d(
                        Error(
                          "dataArray argument must be of type Array."
                        )
                      )
                    var f = b.keyField || this.keyPath,
                      e = a.length,
                      g = !1,
                      l = !1,
                      n = 0,
                      m = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_WRITE
                      )
                    m.oncomplete = function () {
                      l ? c(a) : d(!1)
                    }
                    m.onabort = d
                    m.onerror = d
                    var v = function (b) {
                      a[n++][f] = b.target.result
                      e--
                      0 !== e || g || (l = g = !0)
                    }
                    a.forEach(function (a) {
                      var b = a.key
                      null !== this.keyPath
                        ? (this._addIdPropertyIfNeeded(a),
                          (a = m.objectStore(this.storeName).put(a)))
                        : (a = m
                            .objectStore(this.storeName)
                            .put(a, b))
                      a.onsuccess = v
                      a.onerror = function (a) {
                        m.abort()
                        g || ((g = !0), d(a))
                      }
                    }, this)
                    return m
                  },
                  removeBatch: function (a, b, c) {
                    a = a.map(function (a) {
                      return { type: "remove", key: a }
                    })
                    return this.batch(a, b, c)
                  },
                  getBatch: function (a, b, c, d) {
                    c || (c = h)
                    b || (b = k)
                    d || (d = "sparse")
                    if (
                      "[object Array]" !=
                      Object.prototype.toString.call(a)
                    )
                      c(
                        Error(
                          "keyArray argument must be of type Array."
                        )
                      )
                    else if (0 === a.length) return b([])
                    var f = [],
                      e = a.length,
                      g = !1,
                      l = null,
                      n = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_ONLY
                      )
                    n.oncomplete = function () {
                      ;(g ? b : c)(l)
                    }
                    n.onabort = c
                    n.onerror = c
                    var m = function (a) {
                      a.target.result || "dense" == d
                        ? f.push(a.target.result)
                        : "sparse" == d && f.length++
                      e--
                      0 === e && ((g = !0), (l = f))
                    }
                    a.forEach(function (a) {
                      a = n.objectStore(this.storeName).get(a)
                      a.onsuccess = m
                      a.onerror = function (a) {
                        l = a
                        c(a)
                        n.abort()
                      }
                    }, this)
                    return n
                  },
                  getAll: function (a, b) {
                    b || (b = h)
                    a || (a = k)
                    var c = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_ONLY
                      ),
                      d = c.objectStore(this.storeName)
                    d.getAll
                      ? this._getAllNative(c, d, a, b)
                      : this._getAllCursor(c, d, a, b)
                    return c
                  },
                  _getAllNative: function (a, b, c, d) {
                    var f = !1,
                      e = null
                    a.oncomplete = function () {
                      ;(f ? c : d)(e)
                    }
                    a.onabort = d
                    a.onerror = d
                    a = b.getAll()
                    a.onsuccess = function (a) {
                      f = !0
                      e = a.target.result
                    }
                    a.onerror = d
                  },
                  _getAllCursor: function (a, b, c, d) {
                    var f = [],
                      e = !1,
                      g = null
                    a.oncomplete = function () {
                      ;(e ? c : d)(g)
                    }
                    a.onabort = d
                    a.onerror = d
                    a = b.openCursor()
                    a.onsuccess = function (a) {
                      ;(a = a.target.result)
                        ? (f.push(a.value), a["continue"]())
                        : ((e = !0), (g = f))
                    }
                    a.onError = d
                  },
                  clear: function (a, b) {
                    b || (b = h)
                    a || (a = k)
                    var c = !1,
                      d = null,
                      f = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_WRITE
                      )
                    f.oncomplete = function () {
                      ;(c ? a : b)(d)
                    }
                    f.onabort = b
                    f.onerror = b
                    var e = f.objectStore(this.storeName).clear()
                    e.onsuccess = function (a) {
                      c = !0
                      d = a.target.result
                    }
                    e.onerror = b
                    return f
                  },
                  _addIdPropertyIfNeeded: function (a) {
                    "undefined" == typeof a[this.keyPath] &&
                      (a[this.keyPath] =
                        this._insertIdCount++ + Date.now())
                  },
                  getIndexList: function () {
                    return this.store.indexNames
                  },
                  hasIndex: function (a) {
                    return this.store.indexNames.contains(a)
                  },
                  normalizeIndexData: function (a) {
                    a.keyPath = a.keyPath || a.name
                    a.unique = !!a.unique
                    a.multiEntry = !!a.multiEntry
                  },
                  indexComplies: function (a, b) {
                    return ["keyPath", "unique", "multiEntry"].every(
                      function (c) {
                        if (
                          "multiEntry" == c &&
                          void 0 === a[c] &&
                          !1 === b[c]
                        )
                          return !0
                        if (
                          "keyPath" == c &&
                          "[object Array]" ==
                            Object.prototype.toString.call(b[c])
                        ) {
                          c = b.keyPath
                          var d = a.keyPath
                          if ("string" == typeof d)
                            return c.toString() == d
                          if (
                            ("function" != typeof d.contains &&
                              "function" != typeof d.indexOf) ||
                            d.length !== c.length
                          )
                            return !1
                          for (var f = 0, e = c.length; f < e; f++)
                            if (
                              !(
                                (d.contains && d.contains(c[f])) ||
                                d.indexOf(-1 !== c[f])
                              )
                            )
                              return !1
                          return !0
                        }
                        return b[c] == a[c]
                      }
                    )
                  },
                  iterate: function (a, b) {
                    b = p(
                      {
                        index: null,
                        order: "ASC",
                        autoContinue: !0,
                        filterDuplicates: !1,
                        keyRange: null,
                        writeAccess: !1,
                        onEnd: null,
                        onError: h,
                        limit: Infinity,
                        offset: 0,
                        allowItemRejection: !1,
                      },
                      b || {}
                    )
                    var c =
                      "desc" == b.order.toLowerCase()
                        ? "PREV"
                        : "NEXT"
                    b.filterDuplicates && (c += "_NO_DUPLICATE")
                    var d = !1,
                      f = this.db.transaction(
                        [this.storeName],
                        this.consts[
                          b.writeAccess ? "READ_WRITE" : "READ_ONLY"
                        ]
                      ),
                      e = f.objectStore(this.storeName)
                    b.index && (e = e.index(b.index))
                    var g = 0
                    f.oncomplete = function () {
                      if (d)
                        if (b.onEnd) b.onEnd()
                        else a(null)
                      else b.onError(null)
                    }
                    f.onabort = b.onError
                    f.onerror = b.onError
                    c = e.openCursor(b.keyRange, this.consts[c])
                    c.onerror = b.onError
                    c.onsuccess = function (c) {
                      if ((c = c.target.result))
                        if (b.offset)
                          c.advance(b.offset), (b.offset = 0)
                        else {
                          var e = a(c.value, c, f)
                          ;(b.allowItemRejection && !1 === e) || g++
                          if (b.autoContinue)
                            if (g + b.offset < b.limit)
                              c["continue"]()
                            else d = !0
                        }
                      else d = !0
                    }
                    return f
                  },
                  query: function (a, b) {
                    var c = [],
                      d = 0
                    b = b || {}
                    b.autoContinue = !0
                    b.writeAccess = !1
                    b.allowItemRejection = !!b.filter
                    b.onEnd = function () {
                      a(c, d)
                    }
                    return this.iterate(function (a) {
                      d++
                      var e = b.filter ? b.filter(a) : !0
                      !1 !== e && c.push(a)
                      return e
                    }, b)
                  },
                  count: function (a, b) {
                    b = p({ index: null, keyRange: null }, b || {})
                    var c = b.onError || h,
                      d = !1,
                      f = null,
                      e = this.db.transaction(
                        [this.storeName],
                        this.consts.READ_ONLY
                      )
                    e.oncomplete = function () {
                      ;(d ? a : c)(f)
                    }
                    e.onabort = c
                    e.onerror = c
                    var g = e.objectStore(this.storeName)
                    b.index && (g = g.index(b.index))
                    g = g.count(b.keyRange)
                    g.onsuccess = function (a) {
                      d = !0
                      f = a.target.result
                    }
                    g.onError = c
                    return e
                  },
                  makeKeyRange: function (a) {
                    var b = "undefined" != typeof a.lower,
                      c = "undefined" != typeof a.upper,
                      d = "undefined" != typeof a.only
                    switch (!0) {
                      case d:
                        a = this.keyRange.only(a.only)
                        break
                      case b && c:
                        a = this.keyRange.bound(
                          a.lower,
                          a.upper,
                          a.excludeLower,
                          a.excludeUpper
                        )
                        break
                      case b:
                        a = this.keyRange.lowerBound(
                          a.lower,
                          a.excludeLower
                        )
                        break
                      case c:
                        a = this.keyRange.upperBound(
                          a.upper,
                          a.excludeUpper
                        )
                        break
                      default:
                        throw Error(
                          'Cannot create KeyRange. Provide one or both of "lower" or "upper" value, or an "only" value.'
                        )
                    }
                    return a
                  },
                },
                u = {}
              q.prototype = t
              q.version = t.version
              return q
            },
            unsafeWindow
          )
        }
        x = new IDBStore(obj)
      })
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [obj],
    }) {
      obj = maketype(obj, ["object"])
      return end()
    }
  )

  a.readfileslow = newfunc(
    function readfileslow(
      file,
      type = "Text",
      cb1 = (e) => e,
      cb2 = (e) => e
    ) {
      var fileSize = file.size
      var chunkSize = 64 * 1024 * 50
      var offset = 0
      var chunkReaderBlock = null
      var arr = []
      var lastidx
      var readEventHandler = function (evt, idx) {
        if (evt.target.error == null) {
          arr.push([idx, evt.target.result])
          cb1(a.rerange(arr.length, 0, lastidx, 0, 100))
          if (arr.length === lastidx)
            cb2(arr.sort((e) => e[0]).map((e) => e[1]))
        } else {
          return error("Read error: " + evt.target.error)
        }
      }
      chunkReaderBlock = function (_offset, length, _file, idx) {
        var r = new FileReader()
        var blob = _file.slice(_offset, length + _offset)
        const zzz = idx + 1
        r.onload = function (e) {
          readEventHandler(e, zzz - 1)
        }
        r["readAs" + type](blob)
      }
      let idx = 0
      while (offset < fileSize) {
        idx++
        chunkReaderBlock(offset, chunkSize, file, idx)
        offset += chunkSize
      }
      lastidx = idx
    },
    function ({ end, args: [file, type, cb1, cb2], maketype }) {
      file = maketype(file, ["object"]) // Ensure file is an object
      type = maketype(type, ["string"]) // Ensure type is a string
      cb1 = maketype(cb1, ["function"]) // Ensure cb1 is a function
      cb2 = maketype(cb2, ["function"]) // Ensure cb2 is a function
      return end()
    }
  )

  a.cbtoasync = newfunc(
    function cbtoasync(func, ...args) {
      return new Promise(function (resolve) {
        func(...args, resolve)
      })
    },
    function ({ end, args: [func, ...args], maketype }) {
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.asynctocb = newfunc(
    function asynctocb(func, ...args) {
      var cb = args.pop()
      return func(...args).then(cb)
    },
    function ({ end, args: [func, ...args], maketype }) {
      func = maketype(func, ["function"]) // Ensure func is a function
      return end()
    }
  )

  a.randstr = newfunc(
    function randstr({
      lower = true,
      upper = false,
      number = false,
      symbol = false,
      length = 20,
    }) {
      var rand = ""
      a.repeat(() => {
        rand += a.randfrom(
          `${lower ? "asdfghjklzxcvbnmqwertyuiop" : ""}${
            upper ? "ASDFGHJKLQWERTYUIOPZXCVBNM" : ""
          }${number ? "0123456789" : ""}${
            symbol ? ",./;'[]-=\\`~!@#$%^&*()_+|{}:\"<>?" : ""
          }`.split("")
        )
      }, length)
      return rand
    },
    function ({ end, maketype, args: [options], ifunset }) {
      ifunset([
        {
          lower: true,
          upper: false,
          number: false,
          symbol: false,
          length: 20,
        },
      ])
      options = maketype(options, ["object", "undefined"]) // Ensure options is an object
      return end()
    }
  )

  a.toplaces = newfunc(
    function toplaces(num, pre, post = 0, func = Math.round) {
      num = String(num).split(".")
      if (num.length == 1) num.push("")
      if (pre !== undefined) {
        num[0] = num[0].substring(num[0].length - pre, num[0].length)
        while (num[0].length < pre) num[0] = "0" + num[0]
      }
      var temp = num[1].substring(post, post + 1) ?? 0
      num[1] = num[1].substring(0, post)
      while (num[1].length < post) num[1] += "0"
      if (post > 0) {
        temp = func(num[1].at(-1) + "." + temp)
        num[1] = num[1].split("")
        num[1].pop()
        num[1].push(temp)
        num[1] = num[1].join("")
        num = num.join(".")
      } else num = num[0]
      return num
    },
    function ({ end, maketype, args: [num, pre, post, func] }) {
      num = maketype(num, ["number"]) // Ensure num is a number
      pre = maketype(pre, ["number", "undefined"]) // Ensure pre is a number
      post = maketype(post, ["number"]) // Ensure post is a number
      func = maketype(func, ["function", "undefined"]) // Ensure func is a function or undefined
      return end()
    }
  )

  a.fetch = newfunc(
    async function fetch(url, type = "text", ...args) {
      return await (await fetch(url, ...args))[type]()
    },
    function ({ end, maketype, args: [url, type], makeenum }) {
      url = maketype(url, ["string"]) // Ensure url is a string
      type = maketype(type, ["string"]) // Ensure type is a string
      type = makeenum(type, ["text", "json"])
      return end()
    }
  )

  a.replaceall = newfunc(
    function replaceall(text, regex, replacewith) {
      return text.replaceAll(
        a.toregex(String(a.toregex(regex)) + "g"),
        replacewith
      )
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [text, regex, replacewith],
    }) {
      text = maketype(text, ["string"])
      regex = maketype(regex, ["regex"])
      replacewith = maketype(replacewith, ["string"])
      return end()
    }
  )

  a.setrange = newfunc(
    function setrange(num, min, max) {
      return num < min ? min : num > max ? max : num
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [num, min, max],
    }) {
      num = maketype(num, ["number"])
      min = maketype(min, ["number"])
      max = maketype(max, ["number"])
      return end()
    }
  )

  a.ondrop = newfunc(
    function ondrop(obj) {
      if (!obj.types) obj.types = "all"
      obj.types = a.toarray(obj.types)
      if (!obj.func) throw new Error('object is missing "func"')
      var oldelem = obj.elem
      if (obj.elem) obj.elem = a.toelem(obj.elem, true)
      if (obj.elem && !a.gettype(obj.elem, "element"))
        throw new Error(
          `elem is not an elem, ${oldelem} -> ${obj.elem}`
        )
      drops.push(obj)
      return obj
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [obj],
    }) {
      obj = maketype(obj, ["object"])
      return end()
    }
  )
  a.clamp = newfunc(
    function clamp(num, min, max) {
      if (min !== undefined && num < min) num = min
      if (max !== undefined && num > max) num = max
      return num
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [num, min, max],
    }) {
      ifunset(undefined, undefined, undefined)
      num = maketype(num, ["number"])
      min = maketype(min, ["number", "undefined"])
      max = maketype(max, ["number", "undefined"])
      return end()
    }
  )
  a.step = newfunc(
    function step(num, step) {
      return Math.round(num / step) * step
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [num, step],
    }) {
      num = maketype(num, ["number"])
      step = maketype(step, ["number"])
      return end()
    }
  )
  a.download = newfunc(
    function download(
      data, //string|file|blob
      filename = "temp.txt", //string|undefined
      type = "text/plain", //string|undefined
      isurl = false //boolean|undefined
    ) {
      var url
      if (isurl) {
        url = data
      } else {
        if (a.gettype(data, "string"))
          var file = new Blob([data], {
            type,
          })
        else if (a.gettype(data, ["file", "blob"])) {
          filename = data.name
          var file = data
        }
        url = URL.createObjectURL(file)
      }
      var link = document.createElement("a")

      link.href = url
      link.download = filename
      a.bodyload().then(() => {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        if (!isurl) URL.revokeObjectURL(url)
      })
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [data, filename, type, isurl],
    }) {
      ifunset(undefined, "temp.txt", "text/plain", false)
      data = maketype(data, ["string", "blob", "file"])
      filename = maketype(filename, ["string", "undefined"])
      type = maketype(type, ["string", "undefined"])
      isurl = maketype(isurl, ["boolean", "undefined"])
      return end()
    }
  )
  a.maketable = newfunc(
    function maketable(tableData) {
      const table = a.newelem("table", {}, [])
      var tbody
      var first = true
      for (var tableRow of tableData) {
        var tr = a.newelem("tr")
        if (tbody) {
          tbody.appendChild(tr)
        } else {
          table.appendChild(a.newelem("thead", {}, [tr]))
          table.appendChild((tbody = a.newelem("tbody")))
        }
        for (var data of tableRow) {
          var type = first ? "th" : "td"
          if (data == null) {
            var elem = a.newelem(type, {})
          } else if (a.gettype(data, "string")) {
            var elem = a.newelem(type, { innerHTML: data })
          } else if (a.gettype(data, "object")) {
            var elem = a.newelem(type, data)
          } else if (a.gettype(data, "array")) {
            var elem = a.newelem(type, {}, data)
          } else if (a.gettype(data, "element")) {
            var elem = a.newelem(type, {}, [data])
          }
          tr.appendChild(elem)
        }
        first = false
      }
      return table
    },
    function ({
      ifunset,
      gettype,
      end,
      maketype,
      makeenum,
      trymaketype,
      trymakeenum,
      trygettype,
      args: [tableData],
    }) {
      tableData = maketype(tableData, ["array"])
      return end()
    }
  )
  loadlib("libloader").savelib("allfuncs", a)
})()
