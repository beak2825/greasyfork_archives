// ==UserScript==
// @name         how long ago
// @version      8
// @description  replaces all dates with the time from that date
// @run-at       document-end
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @tag          style
// @exclude      /^https?:\/\/[^\/]*livereload.net\/files\/ffopen\/index\.html$/
// @exclude      /^https?:\/\/[^\/]*stackblitz.com/
// @exclude      /^https?:\/\/[^\/]*webcontainer.io/
// @exclude      /^https?:\/\/[^\/]*regexr.com/
// @exclude      /^https?:\/\/[^\/]*regex101.com/
// @exclude      *://*/*.mjs
// @exclude      *://*/*.js
// @exclude      *://*/*.css
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/491654/how%20long%20ago.user.js
// @updateURL https://update.greasyfork.org/scripts/491654/how%20long%20ago.meta.js
// ==/UserScript==
const tonum = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}
const cache = loadlib("cache")
const replacements = [
  [
    "monthname",
    "(?:jan(?:uary)?|feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|may|june?|july?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)",
  ],
  [
    "month",
    "(?:\\d{1,2}|(?:jan(?:uary)?|feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|may|june?|july?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))",
  ],
  ["day", "\\d{1,2}(?:rd|th|nd|st)?"],
  ["year", "\\d{4}(?:rd|th|nd|st)?"],
  ["space", "[^a-z0-9.]"],
  ["start", "(?<![\\d\\w])"],
  ["end", "(?![\\d\\w])"],
  ["d2", "\\d{2}(?:rd|th|nd|st)?"],
  ["d4", "\\d{4}(?:rd|th|nd|st)?"],
  ["d12", "\\d{1,2}(?:rd|th|nd|st)?"],
]
const formats = [
  { regex: "start(month)space(day),?space(year)end", order: [2, 1, 3] },
  { regex: "start(year)[-/](month)[-/](day)end", order: [3, 2, 1] },
].map(({ regex, order }) => {
  replacements.forEach(([pattern, replacement]) => {
    regex = regex.replaceAll(pattern, replacement)
  })
  return { regex: new RegExp(regex, "gi"), order }
})

const datecache = new cache()
function replaceDates(text) {
  if (datecache.has(text)) {
    return datecache.get()
  }
  // if (text.includes("\u202e\u202d]")) {
  //   return datecache.set(text)
  // }
  for (var { regex, order } of formats) {
    if (regex.test(text)) {
      text = text.replace(regex, (fullstr, ...data) => {
        var pos = text.indexOf(fullstr) + fullstr.length
        if (text.substring(pos, pos + 3) == "\u202e\u202d]") {
          // prevent infinite loops
          return fullstr
        }
        var o = order.map((e) => data[e - 1])
        return getstr(createDateObject(...o, fullstr))
      })
    }
  }
  return datecache.set(text)
}

loadlib("textjack")(function (text) {
  var newtext = text
  newtext = replaceDates(text)
  if (newtext !== text) {
    return newtext
  }
  return text
})

function createDateObject(day, month, year, string) {
  day = parseInt(day, 10)
  month = tonum[month.toLowerCase()] || parseInt(month, 10)
  year = parseInt(year, 10)
  if (year < 100) year += 2000

  if (!month || day > 31) return null

  const date = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const ms = today - date

  return {
    // day,
    // month,
    // year,
    string,
    ms: Math.abs(ms),
    isago: ms > 0,
  }
}

function howlongago(ms) {
  const units = [
    { name: "year", ms: 31536000000 },
    { name: "week", ms: 604800000 },
    { name: "day", ms: 86400000 },
    { name: "hour", ms: 3600000 },
    { name: "minute", ms: 60000 },
    { name: "second", ms: 1000 },
  ]

  let result = []
  for (const unit of units) {
    const value = Math.floor(ms / unit.ms)
    if (value > 0) {
      result.push(`${value} ${unit.name}${value !== 1 ? "s" : ""}`)
      ms %= unit.ms
    }
    if (result.length >= 2) break
  }

  return result.length ? result.join(" ") : "today"
}

function getstr(x) {
  return `[${howlongago(x.ms)} ${
    howlongago(x.ms) == "today" ? "" : x.isago ? "ago" : "until"
  } ${x.string}\u202e\u202d]`
}

// document.querySelector("#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.caTGn > c-wiz > div.iggndc > c-wiz > div > div > div > div.rlWbvd > div.gLXQIf > div.LYeNu").innerHTML="oct 21 0202 ****"
