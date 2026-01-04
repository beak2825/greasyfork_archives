// ==UserScript==
// @name         scratch extesion: string by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRFAAAAGO0YDocO/////v/9//7///3/EIcOIYQO/v/////9E4YO/f/////+/f3/6+V7QQAAAA90Uk5TAP//////////////////5Y2epgAAAedJREFUeJy9lTtOAzEQhj0EgbQIWPMQUijSUXOEUNDQwAXQcgUKRAk1TdIiIZE7cADECZJLRKIAvG2QosXPmdmNvUnFSlk59uf/H3vtGRD4QI7NqqRebEnBH7UAsPk1DYiPExEAiVgYUTVAchWPKAbYIXJxhHsDCtRWofAFQaAepZ1tX+AFmquwg8oDZrC+TX7QUBAX8ISyQFTATdc/B0QE7HQHxB2chNJAwiFIQNIBgZSD94C0g5OAtMMKgPaowIYAuRKSnVRh/q3t/pitliaERWB/XupORUBvIukk6+7+WAPnzxawURRD2fliwOOg1DMGNx4QFydD2PtmgPEUynwLB8hsmm1yi6c7ExQD9Jbl/ML138XHpQfMPsLpuA74ZSkEjj5r65TDArqHEwI6O1XJ12ktewww+hw4M9ugBAFGH0YFAm/XMaA7ReD2tczuHziQeFYDksfBHft/AVqixBO1BAge0lykXPcez16uvIPgxx4BOSpCGquaQOfgV9kGB0IQpn99WxBgbxa7vN35rNzaIMBd3vbb7fNDewJZmoLaAMxyUQ/McgkJ5xCAeMUJqdgONk18JsZsH6t6VA4aBUewasAqDteggsNrFhEKRbDq0RcPM+N1sxElB5rEstpNuYSqP9dg6ewPfinyF4eDNn8AAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524962/scratch%20extesion%3A%20string%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524962/scratch%20extesion%3A%20string%20by%20rssaromeo.meta.js
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
    "string",
    "rssaromeo",
    class {
      strreplace({ replacethis, replacein, replacewith, count }) {
        replacethis = totype(replacethis, "string")
        replacein = totype(replacein, "string")
        replacewith = totype(replacewith, "string")
        count = totype(count, "number")
        if (count) {
          var i = 0
          while (i++ < count) {
            replacein = replacein.replace(replacethis, replacewith)
            if (!replacein.includes(replacethis)) break
          }
          return replacein
        } else return replacein.replaceAll(replacethis, replacewith)
      }
      regreplace({ replacethis, flags, replacein, replacewith }) {
        flags = totype(flags, "string") ?? ""
        replacewith = totype(replacewith, "string")
        replacein = totype(replacein, "string")
        replacethis = totype(replacethis, "string")
        flags = flags.toLowerCase()
        if (!count && !flags.includes("g")) flags += "g"
        return replacein.replace(
          new RegExp(replacethis, flags),
          replacewith
        )
      }
      substr({ string, start, end }) {
        string = totype(string, "string")
        start = totype(start, "number", 1)
        end = totype(end, "number", 1)
        return string.substring(start - 1, end)
      }
      indexof({ x, y }) {
        return x.indexOf(y) + 1
      }
      lowercase({ string }) {
        string = totype(string, "string")
        return string.toLowerCase()
      }
      uppercase({ string }) {
        string = totype(string, "string")
        return string.toUpperCase()
      }
      splittoarr({ string, arr, chars }) {
        var [sprite, arrname] = JSON.parse(arr)
        scratchlist(arrname, string.split(chars), sprite)
      }
      joinfromarr({ arr, chars }) {
        var [sprite, arrname] = JSON.parse(arr)
        return (
          scratchlist(arrname, undefined, sprite)?.join?.(chars) ||
          false
        )
      }
      string({ string }) {
        return totype(string, "string")
      }
    },
    [
      newblock(
        bt.ret,
        "strreplace",
        "string replace: in [replacein] replace [replacethis] with [replacewith], count: [count]",
        [
          [inp.str, "some main text"],
          [inp.str, "main"],
          [inp.str, "other"],
        ]
      ),
      newblock(
        bt.ret,
        "regreplace",
        "regex replace: in [replacein] replace [replacethis][flags] with [replacewith]",
        [
          [inp.str, "some main text"],
          [inp.str, "..."],
          [inp.str, "g"],
          [inp.str, "[$&]"],
        ]
      ),
      newblock(bt.ret, "substr", "[string] from [start] to [end]", [
        [inp.str, "some main text"],
        [inp.num, "3"],
        [inp.num, "5"],
      ]),
      newblock(bt.ret, "indexof", "in [x], index of [y]", [
        [inp.str, "some main text"],
        [inp.str, "main"],
      ]),
      newblock(bt.ret, "lowercase", "lowercase [string]", [
        [inp.str, "Some main Text"],
      ]),
      newblock(bt.ret, "uppercase", "uppercase [string]", [
        [inp.text, "Some main Text"],
      ]),
      newblock(
        bt.cmd,
        "splittoarr",
        "split [string] into [arr] by [chars]",
        [inp.str, newmenu("listnames", { defaultValue: "" }), inp.str]
      ),
      newblock(bt.ret, "joinfromarr", "join [arr] by [chars]", [
        newmenu("listnames", { defaultValue: "" }),
        inp.str,
      ]),
      newblock(bt.ret, "string", "[string]"),
    ],
    "12B312",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRFAAAAGO0YDocO/////v/9//7///3/EIcOIYQO/v/////9E4YO/f/////+/f3/6+V7QQAAAA90Uk5TAP//////////////////5Y2epgAAAedJREFUeJy9lTtOAzEQhj0EgbQIWPMQUijSUXOEUNDQwAXQcgUKRAk1TdIiIZE7cADECZJLRKIAvG2QosXPmdmNvUnFSlk59uf/H3vtGRD4QI7NqqRebEnBH7UAsPk1DYiPExEAiVgYUTVAchWPKAbYIXJxhHsDCtRWofAFQaAepZ1tX+AFmquwg8oDZrC+TX7QUBAX8ISyQFTATdc/B0QE7HQHxB2chNJAwiFIQNIBgZSD94C0g5OAtMMKgPaowIYAuRKSnVRh/q3t/pitliaERWB/XupORUBvIukk6+7+WAPnzxawURRD2fliwOOg1DMGNx4QFydD2PtmgPEUynwLB8hsmm1yi6c7ExQD9Jbl/ML138XHpQfMPsLpuA74ZSkEjj5r65TDArqHEwI6O1XJ12ktewww+hw4M9ugBAFGH0YFAm/XMaA7ReD2tczuHziQeFYDksfBHft/AVqixBO1BAge0lykXPcez16uvIPgxx4BOSpCGquaQOfgV9kGB0IQpn99WxBgbxa7vN35rNzaIMBd3vbb7fNDewJZmoLaAMxyUQ/McgkJ5xCAeMUJqdgONk18JsZsH6t6VA4aBUewasAqDteggsNrFhEKRbDq0RcPM+N1sxElB5rEstpNuYSqP9dg6ewPfinyF4eDNn8AAAAASUVORK5CYII="
  )
})()
