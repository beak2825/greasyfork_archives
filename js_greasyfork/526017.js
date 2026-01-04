// ==UserScript==
// @name         free code camp auto
// @version      3
// @description  none
// @run-at       document-idle
// @author       rssaromeo
// @license      GPLv3
// @match        *://www.freecodecamp.org/learn/*/*
// @match        *://www.freecodecamp.org/learn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/526017/free%20code%20camp%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/526017/free%20code%20camp%20auto.meta.js
// ==/UserScript==

;(async () => {
  const a = loadlib("allfuncs")
  var p = loadlib("progress bar")
  await a.waitforelem(".universal-nav-right.main-nav")
  document.querySelector(".universal-nav-right.main-nav").appendChild(
    a.newelem("button", {
      textContent: "solve",
      async onclick() {
        var min = 1 || prompt("min", 1)
        var max = 999 || prompt("max", 4)
        p.set(max - min + 1)
        var i = min
        while (i <= max) {
          p.set(i - min)
          try {
            var data = await (
              await fetch(
                location.href
                  .replace("/learn/", "/page-data/learn/")
                  .replace(/(?<=\/step-)\d+\/?$/, "") +
                  i +
                  "/page-data.json",
                {
                  headers: {
                    accept: "*/*",
                    "accept-language": "en-US,en;q=0.8",
                    "sec-ch-ua":
                      '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-gpc": "1",
                  },
                  referrer: location.href,
                  referrerPolicy: "no-referrer-when-downgrade",
                  body: null,
                  method: "GET",
                  mode: "cors",
                  credentials: "include",
                }
              )
            ).json()
            var id = data.result.data.challengeNode.challenge.id
            log(id, data)
            await fetch(
              "https://api.freecodecamp.org/modern-challenge-completed",
              {
                headers: {
                  accept: "*/*",
                  "accept-language": "en-US,en;q=0.6",
                  "content-type": "application/json",
                  "csrf-token": document.cookie.match(
                    /csrf_token=([\w\-]+)/
                  )[1],
                  "sec-ch-ua":
                    '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": '"Windows"',
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-site",
                  "sec-gpc": "1",
                },
                referrer: "https://www.freecodecamp.org/",
                referrerPolicy: "no-referrer-when-downgrade",
                body: '{"id":"' + id + '","challengeType":0}',
                method: "POST",
                mode: "cors",
                credentials: "include",
              }
            )
            i++
          } catch (e) {
            i = max + 1
            p.remove()
          }
        }
        p.remove()
      },
    })
  )
  setInterval(() => {
    ;[...document.querySelectorAll("code")].map(
      (e) =>
        (e.onclick = (e) => {
          navigator.clipboard.writeText(e.target.textContent)
          e.stopImmediatePropagation()
          e.stopPropagation()
          e.preventDefault()
        })
    )
  }, 3000)
})()
