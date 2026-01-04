// ==UserScript==
// @name         scratch extesion: math by rssaromeo
// @version      4
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,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
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524956/scratch%20extesion%3A%20math%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524956/scratch%20extesion%3A%20math%20by%20rssaromeo.meta.js
// ==/UserScript==

;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  const {
    newext,
    newmenu,
    newblock,
    bt,
    inp,
    gettarget,
    totype,
    scratch_math,
    projectid,
    canvas,
    scratchvar,
    scratchlist,
  } = loadlib("scratchextesnsionmanager")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  newext(
    "math",
    "rssaromeo",
    class {
      power({ x, y }) {
        x = totype(x, "number", true)
        y = totype(y, "number", true)
        return Math.pow(x, y)
      }
      tern({ cond, a, s }) {
        cond = totype(cond, "bool")
        return cond ? a : s
      }
      invert({ a }) {
        a = totype(a, "bool") ?? totype(a, "string")
        return !a
      }
      tobool({ a }) {
        a = totype(a, "bool") ?? totype(a, "string")
        return !!a
      }
      toplaces({ num, before, after }) {
        var [start = "", end = ""] = String(num).split(".")
        if (totype(before, "number") !== undefined) {
          start = start.substring(start.length - before)
          while (start.length < before) start = "0" + start
        }
        if (totype(after, "number") !== undefined) {
          end = end.substring(0, after)
          // log(end, end.length, after, end.length < after)
          while (end.length < after) end += "0"
        }
        return start + "." + end
      }
      distance2points({ x1, y1, x2, y2 }) {
        x1 = totype(x1, "number", true)
        y1 = totype(y1, "number", true)
        x2 = totype(x2, "number", false)
        y2 = totype(y2, "number", false)
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
      }
      distancebetweenspriteandpoint({ sprite, x2, y2 }) {
        var x1 = totype(gettarget(sprite).x, "number")
        var y1 = totype(gettarget(sprite).y, "number")
        x2 = totype(x2, "number")
        y2 = totype(y2, "number")
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
      }
      distancebetween2sprites({ sprite1, sprite2 }) {
        var x1 = totype(gettarget(sprite1).x, "number")
        var y1 = totype(gettarget(sprite1).y, "number")
        var x2 = totype(gettarget(sprite2).x, "number")
        var y2 = totype(gettarget(sprite2).y, "number")
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
      }
      pointtopoint({ sprite, x, y }) {
        x = totype(x, "number")
        y = totype(y, "number")
        return gettarget(sprite).setDirection(
          scratch_math(
            "atan",
            (gettarget(sprite).x - x) / (gettarget(sprite).y - y)
          ) +
            (gettarget(sprite).y >= y) * 180
        )
      }
      pointtosprite({ sprite1, sprite2 }) {
        var x = totype(gettarget(sprite2).x, "number")
        var y = totype(gettarget(sprite2).y, "number")
        return gettarget(sprite1).setDirection(
          scratch_math(
            "atan",
            (gettarget(sprite1).x - x) / (gettarget(sprite1).y - y)
          ) +
            (gettarget(sprite1).y >= y) * 180
        )
      }
      type({ data }) {
        //number, string, list, object, json, bool
        data = String(data)
        if (data == "true" || data == "false") return "bool"
        if (/^-?[0-9]*\.?[0-9]+$/.test(data)) return "number"
        if (data === "NaN" || data == "nan") return "NaN"
        try {
          var temp = JSON.parse(
            inp.replaceAll("'", '"').replaceAll("`", '"')
          )
          return Array.isArray(temp) ? "jsonarray" : "jsonobject"
        } catch (e) {}
      }
      totype({ data, type }) {
        return totype(data, type)
      }
    },
    [
      newblock(bt.ret, "type", "type[data]"),
      newblock(bt.ret, "totype", "[data]totype[type]", [
        inp.str,
        newmenu("totype", {
          items: ["string", "number", "array", "object", "bool"],
        }),
      ]),
      newblock(bt.ret, "power", "[x]^[y]", [
        [inp.num, "3"],
        [inp.num, "7"],
      ]),
      newblock(bt.ret, "tern", "if [cond] then [a] else [s]", [
        inp.str,
        [inp.str, "it was true"],
        [inp.str, "it was false"],
      ]),
      newblock(bt.bool, "invert", "![a]", [inp.bool]),
      newblock(bt.bool, "tobool", "!![a]", [inp.bool]),
      newblock(
        bt.ret,
        "toplaces",
        "toplaces [num], before: [before], after: [after]",
        [
          { type: inp.int, defaultValue: 156165156156156 },
          { type: inp.int, defaultValue: 5 },
          { type: inp.int, defaultValue: 2 },
        ]
      ),
      newblock(
        bt.cmd,
        "pointtosprite",
        "make [sprite1] face sprite [sprite2]",
        [
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
        ]
      ),
      newblock(
        bt.cmd,
        "pointtopoint",
        "make [sprite] face point at [x], [y]",
        [
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
          [inp.num, "6"],
          [inp.num, "200"],
        ]
      ),
      newblock(
        bt.ret,
        "distancebetween2sprites",
        "distance between [sprite1] and [sprite2]",
        [
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
        ]
      ),
      newblock(
        bt.ret,
        "distancebetweenspriteandpoint",
        "distance between [sprite] and [x2], [y2]",
        [
          newmenu("spritelistwithoutglobal", { defaultValue: "" }),
          [inp.num, "6"],
          [inp.num, "200"],
        ]
      ),
      newblock(
        bt.ret,
        "distance2points",
        "distance between [x1], [y1] and [x2], [y2]",
        [
          [inp.num, "4"],
          [inp.num, "400"],
          [inp.num, "6"],
          [inp.num, "200"],
        ]
      ),
    ],
    "12B312",
    "data:image/png;base64,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"
  )
})()
