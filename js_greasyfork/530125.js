// ==UserScript==
// @name        weighted grade formatter
// @version     4
// @run-at      document-start
// @author      rssaromeo
// @match       *://learn.vccs.edu/courses/*/grades*
// @match       *://*/courses/*/grades*
// @grant       none
// @license     GPLv3
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @description 3/17/2025, 4:31:41 PM
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/530125/weighted%20grade%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/530125/weighted%20grade%20formatter.meta.js
// ==/UserScript==
;(async () => {
  const a = loadlib("allfuncs")
  await a.waitforelem([
    // "#assignments-not-weighted > div:nth-child(1) > table>tbody",
    "#grades_summary > tbody>tr:has(th > div)",
    "td.assignment_score > div > span.tooltip",
    ".original_points",
    ".original_score",
  ])
  await a.wait(1000)
  updateGrades()
  //setInterval(updateGrades, 5000)
  async function updateGrades() {
    var table = a.qs(
      "#assignments-not-weighted > div:nth-child(1) > table>tbody"
    )

    var elems = {}
    var grades = a
      .qsa("#grades_summary > tbody>tr:has(th > div)")
      .forEach((e) => {
        var tc = a.qs("th > div", e).textContent
        elems[tc] ??= []
        elems[tc].push(
          a.qs("td.assignment_score > div > span.tooltip", e)
        )
      })
    log(elems)
for (var tr of table?a.qsa("tr", table):Object.values(elems).flat()) {
      var val = table?Number(a.qs("td", tr).textContent.replace("%", "")):Object.keys(elems).length
      for (var e of table?(elems?.[a.qs("th", tr).textContent] ?? []):[tr]) {
        var grade1 =
          e.children[0].childNodes[
            e.children[0].childNodes.length - 1
          ]
        var grade2 = e.children[1]
        if (!grade2) {
          grade2 = grade1
          grade1 = null
        }
        var g1num, g2num
        if (grade1)
          grade1.textContent = (
            (g1num =
              Number(
                a
                  .qs(".original_score", e.nextElementSibling)
                  .textContent.trim()
              ) * val) / 100
          ).toFixed(2)
        grade2.textContent =
          "/ " +
          (
            (g2num =
              Number(
                grade2.textContent.replace(/\/ /, "").trim()
                // a
                //   .qs(".original_points", e.nextElementSibling)
                //   .textContent.trim()
              ) * val) / 100
          ).toFixed(2)
        if (
          a
            .qs(".original_points", e.nextElementSibling)
            .textContent.trim() == 0
        ) {
          e.parentElement.parentElement.parentElement.style.display =
            "none"
        } else {
          grade1.parentElement.parentElement.parentElement.parentElement.appendChild(
            newHealthBar(g1num, g2num)
          )
        }
      }
    }
    await a.waituntil(() =>
      a
        .qsa(".grade")
        .find((e) => /^\s*\d+(?:\.\d+)%\s*$/.test(e.textContent))
    )
    a.qsa(".grade")
      .filter((e) => /^\s*\d+(?:\.\d+)%\s*$/.test(e.textContent))
      .forEach((e) => {
        e.parentElement.parentElement.parentElement.appendChild(
          newHealthBar(
            Number(e.textContent.replace("%", "").trim()),
            100
          )
        )
      })
    function newHealthBar(val, max) {
      return a.newelem(
        "div",
        {
          width: "calc(100% - 2px)",
          height: "20px",
          backgroundColor: "#a00",
        },
        [
          a.newelem("div", {
            boxShadow: "0 0 2px 1px #0a0",
            width:
              "calc(" + a.rerange(val, 0, max, 0, 100) + "% - 2px)",
            backgroundColor: "#0a0",
            height: "18px",
            position: "relative",
            left: "1px",
            top: "1px",
          }),
        ]
      )
    }
  }
})()
