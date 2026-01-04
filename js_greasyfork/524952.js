// ==UserScript==
// @name         scratch extesion: clipboard by rssaromeo
// @version      4
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA1LIZh3EQ//7+4yuyIQAAAAR0Uk5TAP///7MtQIgAAAFXSURBVHictZM9coQwDIWtgiP4NGnYInUo7NPlCPbO0KeA+/gILsh7shGQzSZpwuww6w/pSdaPOD5+xGvL/Ct8DZPiOu9ADboJgQTXnrI2AA8J/Ewfgqg2JEkBTioCB/yEHj1Koo8whn8lqe8r3ACihJZYyjASSAxTbC4JIgIJf2uJlI+5zgIJ+FA+lCVvGeAWJCSmU9ZEgO8GgISaw6SgQqIIY9ptCRBkjP22kKiiQez6aRME6Vfh9XfAyiARSCwSGSapAcIg9Yiob7nV/oWpPwI/ngBS/x7cA5N4BqI7AZeeABP9N/C3u/wMfq8YinwAFFnbcFR9eewLWnnt3DFRqNGCZn/pftGBucyH0+Z2CY6UO8ZDRXQsDegUmkQTITiNFEcbRwurw4+jRWnr4cfuU9a2QPiuJjjZzqlK0j3kVjJs5NfT3u5R+qrHvRzuuvutbs5M1MB9Akq0BTbMKt+oAAAAAElFTkSuQmCC
// @grant        none
// @tag          lib
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524952/scratch%20extesion%3A%20clipboard%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524952/scratch%20extesion%3A%20clipboard%20by%20rssaromeo.meta.js
// ==/UserScript==
;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  // debugger
  const { newext, newmenu, newblock, bt, inp, gettarget, totype } =
    loadlib("scratchextesnsionmanager")

  newext(
    "clipboard",
    "rssaromeo",
    class {
      setclipcmd({ a: text }) {
        navigator.clipboard.writeText(text)
      }
      async setclipbool({ a: text }) {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch (error) {
          return false
        }
      }
      async getclip() {
        return await navigator.clipboard.readText()
      }
    },
    [
      newblock(bt.cmd, "setclipcmd", "try to set the clipboard [a]", [
        [inp.str, "new clipboard text"],
      ]),
      newblock(bt.bool, "setclipbool", "set the clipboard [a]", [
        [inp.str, "new clipboard text"],
      ]),
      newblock(bt.ret, "getclip", "clip"),
    ],
    "bb9e16",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAA1LIZh3EQ//7+4yuyIQAAAAR0Uk5TAP///7MtQIgAAAFXSURBVHictZM9coQwDIWtgiP4NGnYInUo7NPlCPbO0KeA+/gILsh7shGQzSZpwuww6w/pSdaPOD5+xGvL/Ct8DZPiOu9ADboJgQTXnrI2AA8J/Ewfgqg2JEkBTioCB/yEHj1Koo8whn8lqe8r3ACihJZYyjASSAxTbC4JIgIJf2uJlI+5zgIJ+FA+lCVvGeAWJCSmU9ZEgO8GgISaw6SgQqIIY9ptCRBkjP22kKiiQez6aRME6Vfh9XfAyiARSCwSGSapAcIg9Yiob7nV/oWpPwI/ngBS/x7cA5N4BqI7AZeeABP9N/C3u/wMfq8YinwAFFnbcFR9eewLWnnt3DFRqNGCZn/pftGBucyH0+Z2CY6UO8ZDRXQsDegUmkQTITiNFEcbRwurw4+jRWnr4cfuU9a2QPiuJjjZzqlK0j3kVjJs5NfT3u5R+qrHvRzuuvutbs5M1MB9Akq0BTbMKt+oAAAAAElFTkSuQmCC"
  )
})()
