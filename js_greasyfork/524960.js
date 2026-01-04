// ==UserScript==
// @name         scratch extesion: storage by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @tag          lib
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524960/scratch%20extesion%3A%20storage%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524960/scratch%20extesion%3A%20storage%20by%20rssaromeo.meta.js
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
    "storage",
    "rssaromeo",
    class {
      lssave({ key, data }) {
        localStorage.setItem(projectid + key, data)
      }
      lsload({ key, _default }) {
        var x =
          projectid + key in localStorage
            ? localStorage.getItem(projectid + key)
            : _default
        return x
      }
      lsremove({ key }) {
        localStorage.removeItem(projectid + key)
      }
      lsclearall() {
        var n = localStorage.length
        while (n--) {
          var key = localStorage.key(n)
          if (key.startsWith(projectid)) {
            localStorage.removeItem(key)
          }
        }
      }
    },
    [
      newblock(bt.cmd, "lssave", "localStorage[key] = [data]", [
        [inp.str, "a key goes here"],
        [inp.str, "the data to store goes here"],
      ]),
      newblock(bt.ret, "lsload", "localStorage[key] ?? [_default]", [
        [inp.str, "a key goes here"],
        [inp.str, "the key was not saved in this project"],
      ]),
      newblock(bt.cmd, "lsremove", "remove [key] from localstorage", [
        [inp.str, "a key goes here"],
      ]),
      newblock(bt.cmd, "lsclearall", "remove all from localstorage"),
    ],
    "12B3B3"
  )
})()
