// ==UserScript==
// @name         scratch extesion: file by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAA5pYXh1sOh1oOh1kO////h1wOh24Qh2oPh2UPh2APjm/x/AAAAAt0Uk5TAP////////////99dn3VAAABlUlEQVR4nMWV3U0DMQzH41biFTIAEiO0uhWYiEUYiQkqsUiVLoCOxN9JnHvhgTxUd83v/o7t2IakC170cX/Yv/qUk19lAtz3nQbE+0YIkBnL+ee7MwJu/3yhF0aKA9CA7AtBRkAFNn+Cm0qACNj3qoESwAL9PhOFgSawpWHdWAJiASYKAqEAGakSBAQCKEFAs3DlSJdBolQALWgqyigBZMFyVSYAfXDJNAJtAPkwZRuj0CSAfKi/ZbxUAdAT+6Pa2IHCyEBnCYHUgC0tFJofHYAC7EU2oMXZDimXFYFqw4AhDCtA62EFaBwdsDn/rCgRqKccAEvEDPhE/yeQ7agh4J11gOXCh2uOpL9RfwHcrwJ2Yehg7nm8USvg9Pz+dYkAvLT19enj9fMtTYuvfQVO10VlCXBcelPxGnDH4j0GuD9ELSppf1g0OWtBR4B2udCGdrmFBFkQYCa4j2qvnoxwJ9ZuPxLSy21e9EZ0GriJ4zVs4PiZZQTuc6Hz1JNcbLK9mJtuSSXqaM7x/mp2W6ex6e81XKX/AhMjASZ02e5oAAAAAElFTkSuQmCC
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524964/scratch%20extesion%3A%20file%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524964/scratch%20extesion%3A%20file%20by%20rssaromeo.meta.js
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
  // var a = loadlib("newallfuncs")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  newext(
    "file",
    "rssaromeo",
    class {
      savefile({ data, name }) {
        data = totype(data, "string")
        name = totype(name, "string")
        const blob = new Blob([data])
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = name
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
        return true
      }
      // allows progress bar when i learn how to do loops
      // readfile({ id, startIn }) {
      //   //accept:"image/png, image/jpeg"
      //   return new Promise(async (resolve) => {
      //     try {
      //       var file = await showOpenFilePicker({
      //         id,
      //         startIn,
      //       })
      //       function readfileslow(
      //         //undefined
      //         file, //file
      //         type = "Text", //string|undefined
      //         cb1 = (e) => e, //function|undefined
      //         cb2 = (e) => e //function|undefined
      //       ) {
      //         var fileSize = file.size
      //         var chunkSize = 64 * 1024 * 50 // bytes
      //         var offset = 0
      //         var chunkReaderBlock = null
      //         var arr = []
      //         var lastidx
      //         var readEventHandler = function (evt, idx) {
      //           if (evt.target.error == null) {
      //             arr.push([idx, evt.target.result])
      //             cb1(a.rerange(arr.length, 0, lastidx, 0, 100))
      //             if (arr.length === lastidx)
      //               cb2(arr.sort((e) => e[0]).map((e) => e[1]))
      //           } else {
      //             return error("Read error: " + evt.target.error)
      //           }
      //         }
      //         chunkReaderBlock = function (_offset, length, _file, idx) {
      //           var r = new FileReader()
      //           var blob = _file.slice(_offset, length + _offset)
      //           const zzz = idx + 1
      //           r.onload = function (e) {
      //             readEventHandler(e, zzz - 1)
      //           }
      //           r["readAs" + type](blob)
      //         }
      //         let idx = 0
      //         while (offset < fileSize) {
      //           idx++
      //           chunkReaderBlock(offset, chunkSize, file, idx)
      //           offset += chunkSize
      //         }
      //         lastidx = idx
      //       }
      //       readfileslow(await file.getFile(), undefined, console.log, (e) => {
      //         resolve(e.join(""))
      //       })
      //     } catch (e) {
      //       resolve(false)
      //       // resolve("you must get the user to interact before calling")
      //     }
      //   })
      // }
      readfile({ id, startIn }) {
        //accept:"image/png, image/jpeg"
        return new Promise(async (resolve) => {
          try {
            var file = await showOpenFilePicker({
              id,
              startIn,
            })
            var f = new FileReader()
            f.onloadend = () => {
              resolve(f.result)
            }
            f.onerror = (e) => {
              console.warn(e)
              return undefined
            }
            f.readAsText(await file.getFile())
          } catch (e) {
            resolve(false)
            // resolve("you must get the user to interact before calling")
          }
        })
      }
    },
    [
      newblock(
        bt.cmd,
        "savefile",
        "save file, content: [data], filename: [name]",
        [inp.str, [inp.str, "temp.txt"]]
      ),
      newblock(
        bt.ret,
        "readfile",
        "read file, id:[id], start in:[startIn]",
        [
          inp.str,
          newmenu("readfile", {
            items: [
              "desktop",
              "documents",
              "downloads",
              "music",
              "pictures",
              "videos",
              "",
            ],
            defaultValue: "",
          }),
        ]
      ),
    ],
    "B37512",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAACFQTFRFAAAA5pYXh1sOh1oOh1kO////h1wOh24Qh2oPh2UPh2APjm/x/AAAAAt0Uk5TAP////////////99dn3VAAABlUlEQVR4nMWV3U0DMQzH41biFTIAEiO0uhWYiEUYiQkqsUiVLoCOxN9JnHvhgTxUd83v/o7t2IakC170cX/Yv/qUk19lAtz3nQbE+0YIkBnL+ee7MwJu/3yhF0aKA9CA7AtBRkAFNn+Cm0qACNj3qoESwAL9PhOFgSawpWHdWAJiASYKAqEAGakSBAQCKEFAs3DlSJdBolQALWgqyigBZMFyVSYAfXDJNAJtAPkwZRuj0CSAfKi/ZbxUAdAT+6Pa2IHCyEBnCYHUgC0tFJofHYAC7EU2oMXZDimXFYFqw4AhDCtA62EFaBwdsDn/rCgRqKccAEvEDPhE/yeQ7agh4J11gOXCh2uOpL9RfwHcrwJ2Yehg7nm8USvg9Pz+dYkAvLT19enj9fMtTYuvfQVO10VlCXBcelPxGnDH4j0GuD9ELSppf1g0OWtBR4B2udCGdrmFBFkQYCa4j2qvnoxwJ9ZuPxLSy21e9EZ0GriJ4zVs4PiZZQTuc6Hz1JNcbLK9mJtuSSXqaM7x/mp2W6ex6e81XKX/AhMjASZ02e5oAAAAAElFTkSuQmCC"
  )
})()
