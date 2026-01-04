// ==UserScript==
// @name         lib:progress bar
// @version      7
// @description  none
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
// @downloadURL https://update.greasyfork.org/scripts/491567/lib%3Aprogress%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/491567/lib%3Aprogress%20bar.meta.js
// ==/UserScript==
;(() => {
  const a = loadlib("allfuncs")

  class progressBar {
    constructor(min, max, name = "") {
      this.min = min
      this.max = max
      this.barname = name
      document.body.appendChild(
        (this.parent = a.newelem(
          "div",
          {
            position: "fixed",
            top: "0",
            left: 0,
            border: "30px solid #999",
            backgroundColor: "black",
            color: "white",
            width: "calc(100vw - 60px)",
            height: "29px",
          },
          [
            (this.progresstext = a.newelem("div", {
              // backgroundColor: "#fff",
              height: "20px",
            })),
            (this.progressbar = a.newelem("div", {
              backgroundColor: "#777",
              width: "100%",
              height: "10px",
            })),
          ]
        ))
      )
    }
    set(val, name = "") {
      this.progresstext.innerHTML = `${val}/${this.max}: ${name}`
      this.progressbar.style.width =
        "calc(" + a.rerange(val, 0, this.max, 0, 100) + "% - 2px)"
    }
    remove() {
      this.parent.remove()
      delete this.parent
    }
  }
  loadlib("libloader").savelib("progress bar", progressBar)
})()
