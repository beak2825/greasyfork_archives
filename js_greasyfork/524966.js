// ==UserScript==
// @name         scratch extesion: json by rssaromeo
// @version      2
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @tag          lib
// @license      GPLv3
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524966/scratch%20extesion%3A%20json%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524966/scratch%20extesion%3A%20json%20by%20rssaromeo.meta.js
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

  // var json = JSON.stringify({
  //   test: "123",
  //   1212: [
  //     {
  //       a: 2,
  //     },
  //     [1, 2, 3, 65, 2, 4, "Asd", { zxc: "asdasd", test: "123123123" }],
  //   ],
  // })

  newext(
    "json",
    "rssaromeo",
    class {
      isjson({ data }) {
        try {
          JSON.parse(data)
          return true
        } catch (e) {
          return false
        }
      }
      jsonget({ data, path }) {
        return JSON.stringify(JSON.parse(data)[path])
      }
      jsonset({ data, path, set }) {
        var temp = JSON.parse(data)
        temp[path] = set
        return JSON.stringify(temp)
      }
      jsonhas({ data, path }) {
        return path in JSON.parse(data)
      }
      listtojson({ list }) {
        var [sprite, name] = JSON.parse(list)
        return JSON.stringify(scratchlist(name, undefined, sprite))
      }
    },
    [
      newblock(bt.bool, "isjson", "is json[data]?", [[inp.str, ""]]),
      newblock(bt.ret, "jsonget", "[data] get [path]", [
        [inp.str, ""],
      ]),
      newblock(bt.ret, "jsonset", "[data] set [path] to [set]", [
        [inp.str, ""],
      ]),
      newblock(bt.bool, "jsonhas", "is [path] in [data]?", [
        [inp.str, ""],
      ]),
      newblock(bt.ret, "listtojson", "[list] to json", [
        newmenu("listnames", { defaultValue: "" }),
      ]),
    ]
  )
})()
