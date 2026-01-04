// ==UserScript==
// @name         lib:range
// @version      8
// @description  adds range function to allow for i of range(0, 10, step:optional)
// @license      GPLv3
// @run-at       document-start
// @author       rssaromeo
// @match        *://*/*
// @include      *
// @tag          lib
// @exclude      /livereload.net\/files\/ffopen\/index.html$/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/491568/lib%3Arange.user.js
// @updateURL https://update.greasyfork.org/scripts/491568/lib%3Arange.meta.js
// ==/UserScript==
;(() => {
  const a = loadlib("allfuncs")
  loadlib("libloader").savelib("range", range)
  function range(
    n1,
    n2=undefined,
    step =1
  ) {
    if (n2 == undefined) {
      n2 = n1
      n1 = 1
    }
    if (!(String(n1).endsWith("0") && String(n1).length > 7))
      n1 = Number(n1)
    if (!(String(n2).endsWith("0") && String(n2).length > 7))
      n2 = Number(n2)
    if (n1>n2==step>0){
      step*=-1
    }
    var places = Math.max(String(n1).match(/\.(.*)/)?.[1]?.length??0, String(n2).match(/\.(.*)/)?.[1]?.length??0,String(n1+step).match(/\.(.*)/)?.[1]?.length??0,String(n2+step).match(/\.(.*)/)?.[1]?.length??0)
    var arr = []
    var i = n1
    var namedrange = new (class range {
      constructor() {
        this.from = n1
        this.to = n2
      }
    })()
    Object.getPrototypeOf(arr).name = "asd"
    return new Proxy(namedrange, {
      get(_obj, prop) {
        if (prop !== Symbol.iterator)
          return Reflect.get(namedrange, prop)
        return function* () {
          while (true) {
            yield i
            i += step
            i = Number(a.toplaces(i, undefined, places))
            if (n2>n1&&i > n2||(n1>n2&&i<n2)) break
          }
        }
      },
    })
  }
})()
