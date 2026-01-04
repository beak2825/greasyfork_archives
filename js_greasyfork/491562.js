// ==UserScript==
// @name         libloader
// @version      7
// @description  none
// @license      GPLv3
// @run-at       document-start
// @author       rssaromeo
// @tag          lib loader
// @match        *://*/*
// @include      *
// @exclude      /^https?:\/\/[^\/]*livereload.net\/files\/ffopen\/index\.html$/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/1184528
// @require https://update.greasyfork.org/scripts/491829/1356221/tampermonkey%20storage%20proxy.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491562/libloader.user.js
// @updateURL https://update.greasyfork.org/scripts/491562/libloader.meta.js
// ==/UserScript==

;(async () => {
  try {
    unsafeWindow
  } catch (e) {
    unsafeWindow = window
  }
  var err
  var sp
  const loadedscripts = {
    libloader: {
      savelib,
      loadlib,
      waitforlib,
      //       requirescript, //for saying that a certan script should've been loaded by the time this function was called
    },
  }
  var menus = []
  async function waitforlib(name) {
    return new Promise((done) => {
      if (loadedscripts[name]) return done()
      var int = setInterval(() => {
        if (loadedscripts[name]) return done(clearInterval(int))
      })
    })
  }
  function loadlib(name, filename = "unset") {
    // if (err) throw new Error(err)
    name = name.replace(/\.js$/, "")
    if (!loadedscripts[name]) {
      err ??= `{${filename}} script "${name}" hasn't been loaded`
      log({ ...loadedscripts }, loadedscripts)
      throw new Error(err)
    }
    return loadedscripts[name]
  }
  //   function getfilename() {
  //     var scripts = document.getElementsByTagName("script")
  //     var src = scripts[scripts.length - 1].src
  //     src = src.replaceAll(/%\d\d/g, "")
  //     if (src.startsWith("blob:")) return src.match(/[\w\d._]+\.js(?!\w)/)[0]
  //     return src.match(/\/[^\/]\.js$/)[0]
  //   }

  function savelib(name, obj, liboptions, filename) {
    filename ??= name
    name = name.replace(/\.js$/, "")
    if (Object.prototype.toString.call(obj) === "[object Object]") {
      if (!loadedscripts[name]) loadedscripts[name] = {}
      Object.assign(loadedscripts[name], obj)
    } else {
      if (loadedscripts[name]) {
        if (
          Object.prototype.toString.call(loadedscripts[name]) ===
          "[object Object]"
        ) {
          err ??= `{${filename}} script with name "${name}" was allready loaded as an object`
          throw new Error(err)
        } else {
          err ??= `{${filename}} script with name "${name}" was allready loaded`
          throw new Error(err)
        }
      }
      loadedscripts[name] = obj
    }
  }
  Object.assign(unsafeWindow, {
    loadlib,
  })
})()
