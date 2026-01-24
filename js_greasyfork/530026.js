// ==UserScript==
// @name         yt blocker
// @version      51
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://youtube.com/*
// @match        *://*.youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHJQTFRFAAAAEIijAo2yAI60BYyuF4WaFIifAY6zBI2wB4usGIaZEYigIoiZCIyrE4igG4iYD4mjEomhFoedCoqpDIqnDomlBYyvE4efEYmiDYqlA42xBoytD4mkCYqqGYSUFYidC4qoC4upAo6yCoupDYqmCYur4zowOQAAACZ0Uk5TAO////9vr////1+/D/+/L+/Pf/////+f3///////H4////////+5G91rAAACgUlEQVR4nM2Y22KjIBCGidg1264liZqDadK03X3/V2wNKHMC7MpF/xthHD5mgERAqZhWhfYqH6K+Qf2qNNf625hCoFj9/gblMUi5q5jLkXLCKudgyiRm0FMK82cWJp1fLbV5VmvJbCIc0GCYaFqqlDJgADdBjncqAXYobm1xh72aFMflbysteFfdy2Yi1XGOm5HGBzQ1dq7TzEoxjeNTjQZb7VA3e1c7+ImgasAgQ9+xusNVNZIo5xmOMgihIS2PbCQIiHEUdTvhxCcS/kPomfFI2zHy2PkWmA6aNatIJpKFJyekyy02xh5Y3DI9T4aOT6VhIUrsNTFp1pf79Z4SIIVDegl6IJO6cHiL/GimIZDhgTu/BlYWCQzHMl0zBWT/T3KAhtxOuUB9FtBrpsz0RV4xsjHmW+UCaffcSy/5viMGer0/6HdFNMZBq/vjJL38H9Dqx4Fuy0Em12DbZy+9pGtiDijbglwAehyj11n0tRD3WUBm+lwulE/8h4BuA+iWAQQnteg2Xm63WQLTpnMnpjdge0Mgu/GRPsV4xdjQ94Lfi624fabhDkfUqIKNrM64Q837v8yL0prasepCgrtvw1sJpoqanGEX7b5mQboNW8eawXaWXTMfMGxub472hzWzHSn6Sg2G9+6TAyRruE71s+zAzjWaknoyJCQzwxrghH2k5FDT4eqWunuNxyN9QCGcxVod5oADbYnIUkDTGZEf1xDJnSFteQ3KdsT8zYDMQXcHxsevcLH1TrsABzkNPyA/L7b0jg704viMMlpQI96WsHknCt/3YH0kOEo9zcGkwrFK39ck72rmoehmKqo2RKlilzSy/nJKEV45CT38myJp456fezktHjN5aeMAAAAASUVORK5CYII=
// @grant        unsafeWindow
// @require https://update.greasyfork.org/scripts/491829/1671236/tampermonkey%20storage%20proxy.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/530026/yt%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530026/yt%20blocker.meta.js
// ==/UserScript==
// findAllValues(ytInitialData, "UCdVBvoLL26v7JjiICMeIUPg")
// % of video watched to hide, 0 to not hide any
const hideWatchedVidProg = 1

const rclickBlocksUrl = true
const rclickBlocksTitle = false

const updateInterval = 1000

var creatorNameCache = {}
var firstNav = true
window.addEventListener("yt-navigate-finish", () => {
  if (firstNav) firstNav = false
  else if (!location.href.includes("@")) location.reload()
})
;(async () => {
  unsafeWindow.newJsData ??= [unsafeWindow.ytInitialData]
  // // Save the original fetch
  // const originalFetch = unsafeWindow.fetch;

  // unsafeWindow.fetch = async function(input, init) {
  //     // Check if the request URL contains /youtubei/v1/next
  //     const url = (typeof input === 'string') ? input : input.url;
  //     // if (url.includes('/youtubei/v1/next')) {
  //         console.log('YT next request detected:', url);

  //         // Call the original fetch
  //         const response = await originalFetch(input, init);

  //         // Clone the response so we can read it without affecting YouTube
  //         const cloned = response.clone();
  //           try{
  //         cloned.json().then(data => {

  //             console.log('ytInitialData (soft nav) updated:', data);
  //             // You can now store this data in a global variable
  //           log(findAllKeys(
  //             unsafeWindow.ytInitialData,
  //             "lockupMetadataViewModel"
  //           ), findAllKeys(
  //             data,
  //             "lockupMetadataViewModel"
  //           ))
  //           // unsafeWindow.newJsData.push(data)
  //             deepAssignMerge(unsafeWindow.ytInitialData, data)
  //         });
  //           }
  //           catch(e){}

  //         return response; // return original response
  //     // }

  //     // Otherwise, just call fetch normally
  //     return originalFetch(input, init);
  // };
  //   function deepAssignMerge(...objects) {
  //   const isObject = v => v && typeof v === "object" && !Array.isArray(v);

  //   return objects.reduce((acc, obj) => {
  //     for (const key in obj) {
  //       const prev = acc[key];
  //       const next = obj[key];

  //       if (Array.isArray(prev) && Array.isArray(next)) {
  //         acc[key] = [...new Set([...prev, ...next])];
  //       }
  //       else if (isObject(prev) && isObject(next)) {
  //         acc[key] = deepAssignMerge(prev, next);
  //       }
  //       else {
  //         acc[key] = next;
  //       }
  //     }
  //     return acc;
  //   }, {});
  // }

  const a = loadlib("allfuncs")
  const sp = new storageproxy("globaloptions")
  var ls = sp.get()
  // var lastvol // stores the last volume to restore to when muting from sub button border
  var vidlock = true
  const LOC = {}
  updateLoc()

  // var LOADED = false
  function setVidSpeed() {
    unsafeWindow.novidspeedcontroller = true
    for (var vid of a.qsa("video")) {
      vid.playbackRate =
        vidlock || !unsafeWindow.ytInitialData ?
          0
        : Number(!globalname ? 0 : (localStorage.playRate ?? 0))
    }
  }
  ls.blockedCreators ??= []
  ls.blockedTitles ??= []
  ls.blockedTitlesReg ??= []
  ls.blockedCreatorsReg ??= []
  ls.blockedUrls ??= []
  if (LOC.watch) {
    var fastint = setInterval(setVidSpeed, 0)
    setVidSpeed()
    update()
    a.waituntil(() => globalname).then(() => clearInterval(fastint))
  }
  unsafeWindow.findCreatorNameById = findCreatorNameById
  function findCreatorNameById(cweatorId, nocache = false) {
    function t() {
      // watch
      var data = findAllKeys(
        unsafeWindow.ytInitialData,
        "listItemViewModel",
      )
        .flat()
        .find((e) => findValue(e, cweatorId))?.title?.content
      if (data) {
        return data
      }

      // root
      var manyData =
        ytInitialData?.["contents"]?.[
          "twoColumnBrowseResultsRenderer"
        ]?.["tabs"]?.["0"]?.["tabRenderer"]?.["content"]?.[
          "richGridRenderer"
        ]?.["contents"]
          ?.map?.((e) => {
            const temp =
              e?.["richItemRenderer"]?.["content"]?.[
                "lockupViewModel"
              ]?.["metadata"]?.["lockupMetadataViewModel"]
            return {
              name: temp?.["metadata"]?.[
                "contentMetadataViewModel"
              ]?.["metadataRows"]?.["0"]?.["metadataParts"]?.["0"]?.[
                "text"
              ]?.["content"],
              id: temp?.["image"]?.["decoratedAvatarViewModel"]?.[
                "rendererContext"
              ]?.["commandContext"]?.["onTap"]?.[
                "innertubeCommand"
              ]?.["browseEndpoint"]?.["browseId"],
            }
          })
          ?.flat?.()
          ?.filter?.((e) => e?.name && e?.id) ?? []
      if (a.gettype(manyData, "array")) {
        var cweatorName = null
        for (var { id, name } of manyData) {
          if (id == cweatorId) {
            cweatorName = name
          }
          if (!creatorNameCache[id]) {
            creatorNameCache[id] = name
          }
        }
        if (cweatorName) {
          return cweatorName
        }
      }
      // watch
      var manyData =
        unsafeWindow.ytInitialData["contents"]?.[
          "twoColumnWatchNextResults"
        ]?.["results"]?.["results"]?.["contents"]?.["1"]?.[
          "videoSecondaryInfoRenderer"
        ]?.["owner"]?.["videoOwnerRenderer"]?.title?.runs?.[0]
          ?.map?.((e) => {
            return {
              name: e?.text,
              id: e?.["navigationEndpoint"]?.["browseEndpoint"]?.[
                "browseId"
              ],
            }
          })
          ?.flat?.()
          ?.filter?.((e) => e?.name && e?.id) ?? []
      if (a.gettype(manyData, "array")) {
        var cweatorName = null
        for (var { id, name } of manyData) {
          if (id == cweatorId) {
            cweatorName = name
          }
          if (!creatorNameCache[id]) {
            creatorNameCache[id] = name
          }
        }
        if (cweatorName) {
          return cweatorName
        }
      }
      // asdsasdasdasdads
      var manyData =
        unsafeWindow.ytInitialData["contents"]?.[
          "twoColumnWatchNextResults"
        ]?.["secondaryResults"]?.["secondaryResults"]?.["results"]
          ?.map((ee) => {
            ee =
              ee?.["lockupViewModel"]?.["metadata"]?.[
                "lockupMetadataViewModel"
              ]
            return {
              name: ee?.metadata?.contentMetadataViewModel
                ?.metadataRows?.[0]?.metadataParts?.[0]?.text
                ?.content,
              id: ee?.["image"]?.["decoratedAvatarViewModel"]?.[
                "rendererContext"
              ]?.["commandContext"]?.["onTap"]?.[
                "innertubeCommand"
              ]?.["browseEndpoint"]?.["browseId"],
            }
          })
          ?.flat?.()
          ?.filter?.((e) => e?.name && e?.id) ?? []
      if (a.gettype(manyData, "array")) {
        var cweatorName = null
        for (var { id, name } of manyData) {
          if (id == cweatorId) {
            cweatorName = name
          }
          if (!creatorNameCache[id]) {
            creatorNameCache[id] = name
          }
        }
        if (cweatorName) {
          return cweatorName
        }
      }
      var manyData =
        ytInitialData?.["contents"]?.["twoColumnWatchNextResults"]?.[
          "secondaryResults"
        ]?.["secondaryResults"]?.["results"]
          ?.map?.((e) =>
            e?.["itemSectionRenderer"]?.["contents"]?.map((e) => {
              var base =
                e?.["lockupViewModel"]?.["metadata"]?.[
                  "lockupMetadataViewModel"
                ]
              return {
                name: base?.["metadata"]?.[
                  "contentMetadataViewModel"
                ]?.["metadataRows"]?.["0"]?.["metadataParts"]?.[
                  "0"
                ]?.["text"]?.["content"],
                id: base?.image?.decoratedAvatarViewModel
                  ?.rendererContext?.commandContext?.onTap
                  ?.innertubeCommand?.browseEndpoint?.browseId,
              }
            }),
          )
          ?.flat?.()
          ?.filter?.((e) => e?.name && e?.id) ?? []
      if (a.gettype(manyData, "array")) {
        var cweatorName = null
        for (var { id, name } of manyData) {
          if (id == cweatorId) {
            cweatorName = name
          }
          if (!creatorNameCache[id]) {
            creatorNameCache[id] = name
          }
        }
        if (cweatorName) {
          return cweatorName
        }
      }
      var manyData =
        unsafeWindow.ytInitialData?.["contents"]?.[
          "twoColumnWatchNextResults"
        ]?.["secondaryResults"]?.["secondaryResults"]?.["results"]
          ?.map?.((e) =>
            e?.["itemSectionRenderer"]?.["contents"]?.map(
              (e) =>
                e?.["lockupViewModel"]?.["metadata"]?.[
                  "lockupMetadataViewModel"
                ],
            ),
          )
          .flat?.()
          ?.map?.((e) => {
            return {
              name: e?.["metadata"]?.["contentMetadataViewModel"]?.[
                "metadataRows"
              ]?.["0"]?.["metadataParts"]?.["0"]?.["text"]?.[
                "content"
              ],
              id: e?.["image"]?.["decoratedAvatarViewModel"]?.[
                "rendererContext"
              ]?.["commandContext"]?.["onTap"]?.[
                "innertubeCommand"
              ]?.["browseEndpoint"]?.["browseId"],
            }
          })
          ?.filter?.((e) => e?.name && e?.id) ?? []
      // log(manyData)
      if (a.gettype(manyData, "array")) {
        var cweatorName = null
        for (var { id, name } of manyData) {
          if (id == cweatorId) {
            cweatorName = name
          }
          if (!creatorNameCache[id]) {
            creatorNameCache[id] = name
          }
        }
        if (cweatorName) {
          return cweatorName
        }
      }
    }
    if (nocache) {
      return t()
    }
    if (creatorNameCache[cweatorId]) {
      return creatorNameCache[cweatorId]
    }
    return (creatorNameCache[cweatorId] = t())
  }
  var updateIntervalId = setInterval(update, updateInterval)
  async function customRadioSelection(options) {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement("div")
      overlay.style.position = "fixed"
      overlay.style.top = 0
      overlay.style.left = 0
      overlay.style.width = "100%"
      overlay.style.height = "100%"
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
      overlay.style.zIndex = "9999"
      overlay.style.scale = 1.5
      // Create dialog box
      const dialog = document.createElement("div")
      dialog.style.position = "absolute"
      dialog.style.top = "50%"
      dialog.style.left = "50%"
      dialog.style.transform = "translate(-50%, -50%)"
      dialog.style.padding = "20px"
      dialog.style.backgroundColor = "white"
      dialog.style.borderRadius = "5px"
      dialog.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
      dialog.style.zIndex = "10000"

      // Create radio buttons
      options.forEach((option, index) => {
        const label = document.createElement("label")
        label.style.display = "block"
        const radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "customRadio"
        var optionText =
          a.gettype(option, "string") ? option : (
            JSON.stringify(option, "_")
          )
        radio.value = optionText
        radio.onclick = () => {
          document.body.removeChild(overlay)
          resolve(option, index)
        }
        label.appendChild(radio)
        label.appendChild(document.createTextNode(optionText))
        dialog.appendChild(label)
      })

      // Add dialog to overlay
      overlay.appendChild(dialog)
      document.body.appendChild(overlay)
    })
  }
  // LOADED = true
  var globalname
  function newBlockBtn(title, creator) {
    var elem = a.newelem("button", {
      innerHTML:
        isBlocked(this.creator, this.title, null) ? "unblock" : (
          "block"
        ),
      creator,
      title,
      id: "blockbtn",
      async onclick(e) {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        log(this.creator)
        if (a.gettype(this.creator, "array")) {
          var blockedList = this.creator.map((e) => ({
            id: e,
            name: findCreatorNameById(e),
            isBlocked: ls.blockedCreators.includes(e),
          }))
          blockedList.push("unblock all")
          blockedList.push("block all")
          blockedList.push("abort")
          var whatToBlock = await customRadioSelection(blockedList)
          if (whatToBlock == "abort") {
            return
          } else if (whatToBlock == "unblock all") {
            for (var cweator of this.creator) {
              if (ls.blockedCreators.includes(cweator))
                ls.blockedCreators.splice(
                  ls.blockedCreators.indexOf(cweator),
                  1,
                )
            }
          } else if (whatToBlock == "block all") {
            for (var cweator of this.creator) {
              if (!ls.blockedCreators.includes(cweator))
                ls.blockedCreators.push(cweator)
            }
          } else {
            if (whatToBlock.isBlocked) {
              ls.blockedCreators.splice(
                ls.blockedCreators.indexOf(whatToBlock.id),
                1,
              )
            } else {
              ls.blockedCreators.push(whatToBlock.id)
            }
          }
        } else {
          if (isCreatorBlocked(this.creator)) {
            ls.blockedCreators.splice(
              ls.blockedCreators.indexOf(this.creator),
              1,
            )
          } else {
            ls.blockedCreators.push(this.creator)
          }
        }
        update()
        log(ls.blockedCreators, this.creator)
      },
      oncontextmenu(e) {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        if (rclickBlocksUrl) {
          log(this.url)
          if (ls.blockedUrls.includes(this.url)) {
            ls.blockedUrls.splice(ls.blockedUrls.indexOf(this.url), 1)
          } else {
            ls.blockedUrls.push(this.url)
          }
          update()
          log(ls.blockedUrls, this.url)
        }
        if (rclickBlocksTitle) {
          log(this.title)
          if (ls.blockedTitles.includes(this.title)) {
            ls.blockedTitles.splice(
              ls.blockedTitles.indexOf(this.title),
              1,
            )
          } else {
            ls.blockedTitles.push(this.title)
          }
          update()
          log(ls.blockedTitles, this.title)
        }
      },
    })
    ;((elem, creator) => {
      var val = creator
      Object.defineProperty(elem, "creator", {
        get() {
          return val
        },
        set(newval) {
          if (a.gettype(newval, "array")) {
            val = newval.map((e) => e.replace(/ • \d+\w? views$/, ""))
          } else {
            val = newval.replace(/ • \d+\w? views$/, "")
          }
        },
        enumerable: true,
        configurable: true,
      })
    })(elem, creator)
    return elem
  }
  update()
  function update() {
    try {
      var failCount = 0
      function getCreatorId(viddiv, url) {
        var id = a
          .qs(url, viddiv)
          .href.split("?v=")
          .at(-1)
          .split("&")[0]
        var video =
          findAllKeys(
            unsafeWindow.ytInitialData,
            "lockupMetadataViewModel",
          ).find((e) => findValue(e, id)) ||
          findAllKeys(
            unsafeWindow.ytInitialData,
            "videoRenderer",
          ).find((e) => findValue(e, id))
        var res = [
          ...new Set(
            findAllKeys(video, "browseEndpoint").map(
              (e) => e?.browseId,
            ),
          ),
        ].filter((e) => e)
        if (res.length == 1) {
          res = res[0]
        }
        if (res.length) {
          if (failCount > 0) failCount -= 1
          return res
        }
        log(
          1111111,
          unsafeWindow.newJsData.find((e) => findValue(e, id)),
        )
        failCount += 1
        if ((LOC.watch || LOC.root || LOC.search) && failCount > 5) {
          location.reload()
          clearInterval(updateIntervalId)
        }
        error(video, viddiv)
        return ""
      }
      updateLoc()
      unsafeWindow.ls = ls = sp.update()
      // log(LOC)
      if (LOC.search) {
        addVid(
          "div#dismissible.style-scope.ytd-video-renderer:has(a#video-title)",
          "a#video-title",
          "#video-title",
          getCreatorId,
          "#channel-info",
          "#text > a",
        )
      } else if (LOC.root) {
        globalname = null
        addVid(
          "ytd-rich-item-renderer:has(a>.cbCustomTitle):has(yt-lockup-metadata-view-model)",
          "a:has(> .cbCustomTitle:first-child)",
          "a:has(> .cbCustomTitle:first-child)>*:not(.cbCustomTitle)",
          getCreatorId,
          "yt-lockup-metadata-view-model",
          "a.yt-core-attributed-string__link",
        )
        addVid(
          "ytd-rich-item-renderer:has(#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model-wiz__text-container > div > yt-content-metadata-view-model > div:nth-child(1) > span > span > a)",
          "#content > yt-lockup-view-model > div > a",
          "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model-wiz__text-container > h3 > a > span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap:not(.cbCustomTitle)",
          getCreatorId,
          "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model",
          "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model-wiz__text-container > div > yt-content-metadata-view-model > div:nth-child(1) > span > span > a",
        )
        // addVid(
        //   "ytd-rich-item-renderer:not(:has(#blockbtn))",
        //   () => "",
        //   () => "",
        //   () => "",
        //   "*",
        //   () => ""
        // )
      } else if (LOC.feed) {
        addVid(
          "ytd-rich-item-renderer:has(a>.cbCustomTitle):has(a.yt-core-attributed-string__link):has(yt-lockup-metadata-view-model)",
          "a:has(> .cbCustomTitle:first-child)",
          "a:has(> .cbCustomTitle:first-child)>*:not(.cbCustomTitle)",
          getCreatorId,
          "yt-lockup-metadata-view-model",
          "a.yt-core-attributed-string__link",
        )
        addVid(
          "#dismissible:has(#video-title-link)",
          "#video-title-link",
          "#video-title-link>yt-formatted-string:not(.cbCustomTitle)",
          getCreatorId,
          "#byline-container",
          "#container>#text-container>yt-formatted-string#text>a",
        )
        // ['contents']['twoColumnBrowseResultsRenderer']['tabs']['0']['tabRenderer']['content']['richGridRenderer']['contents']['5']['richItemRenderer']['content']['lockupViewModel']
      } else if (LOC.userhome || LOC.uservids) {
        const CREATOR = getCreatorNameFromUrl(location.href)
        const btn = a.qs(
          "#page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-dynamic-text-view-model > h1 > #blockbtn",
        )
        if (
          a.qs(
            "#page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-dynamic-text-view-model > h1",
          ) &&
          !btn
        ) {
          a.qs(
            "#page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-dynamic-text-view-model > h1",
          ).appendChild(newBlockBtn(null, CREATOR))
        } else if (btn) {
          btn.innerHTML =
            isBlocked(btn.creator, btn.title, btn.url) ?
              "unblock - " +
              JSON.stringify(
                isBlocked(btn.creator, btn.title, btn.url),
              )
            : "block"
        }
        if (LOC.userhome) {
          addVid(
            "#dismissible:has(#video-title-link)",
            "#video-title-link",
            "#video-title-link",
            () => CREATOR,
            "#byline-container",
          )
          addVid(
            "#dismissible:has(#video-title-link)",
            "#video-title-link",
            "#video-title-link",
            (viddiv, url) => {
              var id = a
                .qs(url, viddiv)
                .href.split("?v=")
                .at(-1)
                .split("&")[0]
              var video = findAllKeys(
                unsafeWindow.ytInitialData,
                "lockupMetadataViewModel",
              ).find((e) => findValue(e, id))
              return (
                findKey(video, "browseEndpoint")?.browseId ??
                error(video, viddiv)
              )
            },
            "#byline-container",
            "#container>#text-container>yt-formatted-string#text",
          )
        }
        if (LOC.uservids) {
          addVid(
            "ytd-rich-item-renderer:has(#dismissible #video-title-link)",
            "#video-title-link",
            "#video-title-link > #video-title:not(.cbCustomTitle)",
            () => CREATOR,
            "#meta > h3",
          )
        }
      } else if (LOC.watch) {
        if (!a.qs("#playrate") && a.qs(".ytp-right-controls")) {
          a.qs(".ytp-right-controls").appendChild(
            a.newelem(
              "div",
              {
                display: "inline flex",
                flexDirection: "row",
                id: "playrate",
                class:
                  "ytp-button ytp-settings-button ytp-hd-quality-badge",
                width: "fit-content",
              },
              [
                a.newelem("button", {
                  innerHTML: ".1",
                  onclick() {
                    localStorage.playRate = 0.1
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: ".25",
                  onclick() {
                    localStorage.playRate = 0.25
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: "1",
                  backgroundColor: "#449",
                  onclick() {
                    localStorage.playRate = 1
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: "1.4",
                  onclick() {
                    localStorage.playRate = 1.4
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: "1.8",
                  onclick() {
                    localStorage.playRate = 1.8
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: "2",
                  backgroundColor: "#449",
                  onclick() {
                    localStorage.playRate = 2
                    update()
                  },
                }),
                a.newelem("button", {
                  innerHTML: "2.5",
                  onclick() {
                    localStorage.playRate = 2.5
                    update()
                  },
                }),
              ],
            ),
          )
        }
        globalname =
          unsafeWindow.ytInitialData?.["contents"]?.[
            "twoColumnWatchNextResults"
          ]?.["results"]?.["results"]?.["contents"]?.[
            "1"
          ]?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer?.attributedTitle?.commandRuns?.[0]?.onTap?.innertubeCommand?.showDialogCommand?.panelLoadingStrategy?.inlineContent?.dialogViewModel?.customContent?.listViewModel?.listItems?.map(
            (e) =>
              e?.listItemViewModel?.title?.commandRuns[0]?.onTap
                ?.innertubeCommand?.browseEndpoint?.browseId,
          ) ||
          unsafeWindow.ytInitialData?.["contents"]?.[
            "twoColumnWatchNextResults"
          ]?.["results"]?.["results"]?.["contents"]?.["1"]
            ?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer
            ?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint
            ?.browseId ||
          unsafeWindow.ytInitialData?.["contents"]?.[
            "twoColumnWatchNextResults"
          ]?.["results"]?.["results"]?.["contents"]?.["1"]?.[
            "videoSecondaryInfoRenderer"
          ]?.["subscribeButton"]?.["subscribeButtonRenderer"]?.[
            "channelId"
          ] ||
          unsafeWindow.ytInitialData?.["header"]?.[
            "pageHeaderRenderer"
          ]?.["content"]?.["pageHeaderViewModel"]?.["actions"]?.[
            "flexibleActionsViewModel"
          ]?.["actionsRows"]?.["0"]?.["actions"]?.["0"]?.[
            "subscribeButtonViewModel"
          ]?.["subscribeButtonContent"]?.["onTapCommand"]?.[
            "innertubeCommand"
          ]?.["subscribeEndpoint"]?.["channelIds"] ||
          unsafeWindow.ytInitialData?.["contents"]?.[
            "twoColumnWatchNextResults"
          ]?.["results"]?.["results"]?.["contents"]?.["2"]?.[
            "videoSecondaryInfoRenderer"
          ]?.["subscribeButton"]?.["subscribeButtonRenderer"]?.[
            "onUnsubscribeEndpoints"
          ]?.["0"]?.["signalServiceEndpoint"]?.["actions"]?.["0"]?.[
            "openPopupAction"
          ]?.["popup"]?.["confirmDialogRenderer"]?.[
            "confirmButton"
          ]?.["buttonRenderer"]?.["serviceEndpoint"]?.[
            "unsubscribeEndpoint"
          ]?.channelIds?.[0] ||
          unsafeWindow.ytInitialData?.["contents"]?.[
            "twoColumnWatchNextResults"
          ]?.["results"]?.["results"]?.["contents"]?.["2"]?.[
            "videoSecondaryInfoRenderer"
          ]?.["subscribeButton"]?.["subscribeButtonRenderer"]?.[
            "onSubscribeEndpoints"
          ]?.[
            "0"
          ]?.showDialogCommand?.panelLoadingStrategy?.inlineContent?.dialogViewModel?.customContent?.listViewModel?.listItems
            ?.map(
              (e) =>
                e?.listItemViewModel?.title?.commandRuns?.[0]?.onTap
                  ?.innertubeCommand?.browseEndpoint?.browseId,
            )
            .filter((e) => e)
        //  a.qs(
        //   "#upload-info>ytd-channel-name#channel-name>#container>#text-container>yt-formatted-string#text > a"
        // )?.textContent
        if (
          a.qs("ytd-video-owner-renderer") &&
          a.qs("#title > h1 > span.cbCustomTitle") &&
          globalname
        ) {
          addVid(
            "ytd-watch-metadata",
            () => location.href.split("?v=").at(-1).split("&")[0],
            "#title > h1 > yt-formatted-string",
            () => {
              return globalname
            },
            "ytd-video-owner-renderer",
            "#container>#text-container>yt-formatted-string#text>a",
          )
          a.qs("ytd-watch-metadata").style.display = ""
          const btn = a.qs("ytd-video-owner-renderer>#blockbtn")
          vidlock = isBlocked(btn.creator, btn.title, btn.url)
          btn.innerHTML =
            isBlocked(btn.creator, btn.title, btn.url) ?
              "unblock - " +
              JSON.stringify(
                isBlocked(btn.creator, btn.title, btn.url),
              )
            : "block"
        }

        // these don't have creator id anywhere only creator name so all will be hidden

        // addVid(
        //   "ytd-compact-video-renderer:has(#dismissible #video-title-link)",
        //   "#video-title-link",
        //   "#container>#text-container>yt-formatted-string#text",
        //   "#metadata"
        // )
        // these also don't have creator data
        // addVid(
        //   "#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles > div > a:has(span.ytp-videowall-still-info)",
        //   "span.ytp-videowall-still-info > span > span>div>.cbCustomTitle",
        //   "span.ytp-videowall-still-info > span > span>.ytp-videowall-still-info-author",
        //   "span.ytp-videowall-still-info > span > span>div"
        // )
        // new youtube display classes?

        addVid(
          "yt-lockup-view-model:has(yt-lockup-metadata-view-model)",
          ".yt-lockup-metadata-view-model__title",
          ".yt-lockup-metadata-view-model__title",
          getCreatorId,
          ".yt-lockup-metadata-view-model__text-container",
        )

        // log(video)
        // log()

        // a.qsa().forEach((e) => (e.style.visibility = "hidden"))
        // a.qsa(".ytp-videowall-still").forEach(
        //   (e) => (e.style.visibility = "hidden")
        // )
        // addVid(
        //   "yt-lockup-view-model:has(yt-lockup-metadata-view-model)",
        //   "div.yt-lockup-metadata-view-model-wiz__text-container > h3 > a",
        //   "yt-content-metadata-view-model > div:nth-child(1) > span",
        //   ".yt-lockup-view-model-wiz__metadata:has(yt-lockup-metadata-view-model)"
        // )
        setVidSpeed()
      }
    } catch (e) {
      trace("update", e)
    }
  }
  function findAllKeys(obj, keyToFind) {
    const results = []

    function recurse(currentObj) {
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          if (key.includes(keyToFind)) {
            results.push(currentObj[key]) // Add the path to results if it matches
          }

          if (
            typeof currentObj[key] === "object" &&
            currentObj[key] !== null
          ) {
            recurse(currentObj[key]) // Recur for nested objects
          }
        }
      }
    }

    recurse(obj, "")
    return results
  }
  function findAllValues(obj, keyToFind) {
    const results = []

    function recurse(currentObj) {
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          try {
            if (currentObj[key].includes(keyToFind)) {
              results.push(currentObj[key]) // Add the path to results if it matches
            }
          } catch (e) {}

          if (
            typeof currentObj[key] === "object" &&
            currentObj[key] !== null
          ) {
            recurse(currentObj[key]) // Recur for nested objects
          }
        }
      }
    }

    recurse(obj, "")
    return results
  }
  function findKey(obj, keyToFind) {
    const results = []

    function recurse(currentObj, exact = true) {
      if (results.length) {
        return results[0]
      }
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          if (exact ? key === keyToFind : key.includes(keyToFind)) {
            results.push(currentObj[key]) // Add the path to results if it matches
            return currentObj[key]
          }

          if (
            typeof currentObj[key] === "object" &&
            currentObj[key] !== null
          ) {
            recurse(currentObj[key]) // Recur for nested objects
          }
        }
      }
    }

    recurse(obj, "")
    return results[0]
  }
  function findValue(obj, keyToFind) {
    const results = []

    function recurse(currentObj, exact = true) {
      if (results.length) {
        return results[0]
      }
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          try {
            if (
              exact ?
                currentObj[key] === keyToFind
              : currentObj[key].includes(keyToFind)
            ) {
              results.push(currentObj[key]) // Add the path to results if it matches
              return currentObj[key]
            }
          } catch (e) {}

          if (
            typeof currentObj[key] === "object" &&
            currentObj[key] !== null
          ) {
            recurse(currentObj[key]) // Recur for nested objects
          }
        }
      }
    }

    recurse(obj, "")
    return results[0]
  }

  function addVid(
    mainDivID,
    url,
    titleID,
    creatorID,
    blockButtonParentID,
    // OLDurl,
    // OLDtitleID,
    creatorName,
    // OLDblockButtonParentID
  ) {
    try {
      // log(mainDivID, a.qsa(mainDivID))
      // remove invalid block buttons on root
      // if (isroot())
      //   a.qsa("#blockbtn")
      //     .filter(function (btn) {
      //       return btn.closest(blockButtonParentID)
      //     })
      //     .forEach((e) => e.remove())
      function trycall(thing) {
        if (typeof thing === "function") {
          return thing(viddiv, url, titleID, creatorID) ?? ""
        }
        return undefined
      }
      for (var viddiv of a.qsa(mainDivID)) {
        if (
          !viddiv.getBoundingClientRect().height &&
          viddiv?.style?.display != "none"
        ) {
          continue
        }
        if (viddiv.textContent.includes("Free with ads")) {
          viddiv.style.display = "none"
          continue
        }
        var btn = a.qs(blockButtonParentID + ">#blockbtn", viddiv)
        if (!btn)
          btn = a
            .qs(blockButtonParentID, viddiv)
            .appendChild(newBlockBtn("", ""))

        btn.url =
          trycall(url) ??
          a.qs(url, viddiv).href.split("?v=").at(-1).split("&")[0]
        btn.title =
          trycall(titleID) ??
          a.qs(titleID, viddiv).textContent.toLowerCase()
        btn.creator =
          trycall(creatorID) ??
          getCreatorNameFromUrl(a.qs(creatorID, viddiv).href)

        btn.innerHTML =
          isCreatorBlocked(btn.creator) ?
            "unblock " +
            (a.gettype(btn.creator, "array") ?
              btn.creator.map((e) => findCreatorNameById(e))
            : (findCreatorNameById(btn.creator) ?? "NO CREATOR SET"))
          : "block " +
            (a.gettype(btn.creator, "array") ?
              btn.creator.map((e) => findCreatorNameById(e))
            : (findCreatorNameById(btn.creator) ??
              (log("failed to find creators name!!!", btn.creator) ||
                "NO CREATOR SET")))
        var prog =
          a.qs(
            ".ytd-thumbnail-overlay-resume-playback-renderer.style-scope",
            viddiv,
          ) ||
          a.qs(
            ".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment",
            viddiv,
          )
        // if (OLDcreatorID && btn.creator) {
        //   var OLDcreator =
        //     trycall(OLDcreatorID) ??
        //     (a.qs(OLDcreatorID, viddiv) &&
        //       getCreatorNameFromUrl(a.qs(OLDcreatorID, viddiv).href))
        //   // delete OLDcreatorID
        //   // if (OLDcreator) {
        //   //  ls.creatorNameDict ??= {}
        //   // ls.creatorNameDict[btn.creator] ??= []
        //   // if (!ls.creatorNameDict[btn.creator].includes(OLDcreator)) {
        //   //   ls.creatorNameDict[btn.creator].push(OLDcreator)
        //   // }
        //   // if (
        //   //   OLDcreator != btn.creator &&
        //   //   isCreatorBlocked(OLDcreator)
        //   // ) {
        //   //   log("UPDATING!!!", OLDcreator, btn.creator)
        //   //   ls.blockedCreators[
        //   //     ls.blockedCreators.indexOf(OLDcreator)
        //   //   ] = btn.creator
        //   // }
        //   // }
        // }
        viddiv.style.display =
          (
            isBlocked(btn.creator, btn.title, btn.url) ||
            (hideWatchedVidProg &&
              prog &&
              prog.style.width.replace("%", "") >= hideWatchedVidProg)
          ) ?
            "none"
          : ""
      }
    } catch (e) {
      trace("addVid", e, titleID, creatorID, viddiv)
    }
  }
  unsafeWindow.isBlocked = isBlocked
  unsafeWindow.addVid = addVid
  function isBlocked(creator, title, url) {
    try {
      if (creator == undefined)
        return {
          type: "invalid creator",
          val: { creator, title, url },
        }

      if (ls.blockedUrls.includes(url))
        return { type: "blockedUrls", val: url }
      if (ls.blockedTitles.includes(title))
        return { type: "blockedTitles", val: title }
      var creatorBlockInfo = isCreatorBlocked(creator)
      if (creatorBlockInfo) return creatorBlockInfo
      for (let reg of ls.blockedTitlesReg) {
        if (new RegExp(reg, "i").test(title))
          return { type: "blockedTitlesReg", val: reg }
      }
      return false
    } catch (e) {
      trace("isBlocked", e)
    }
  }
  function isCreatorBlocked(cweator) {
    if (a.gettype(cweator, "array")) {
      var blocrea = []
      for (var c of cweator) {
        if (ls.blockedCreators.includes(c)) {
          blocrea.push(c)
        }
      }
      if (blocrea.length) {
        return {
          type: "blockedCreators",
          val: blocrea.map((e) => findCreatorNameById(e) || e),
        }
      }
      for (let reg of ls.blockedCreatorsReg) {
        for (var c of cweator) {
          if (new RegExp(reg, "i").test(c))
            return { type: "blockedCreatorsReg", val: reg }
        }
      }
      return
    }
    if (ls.blockedCreators.includes(cweator)) {
      return {
        type: "blockedCreators",
        val: findCreatorNameById(cweator) || cweator,
      }
    }
    for (let reg of ls.blockedCreatorsReg) {
      if (new RegExp(reg, "i").test(cweator))
        return { type: "blockedCreatorsReg", val: reg }
    }
  }
  function updateLoc() {
    Object.assign(LOC, {
      root: /^https?:\/\/(?:www\.)?youtube\.com\/?(?:\?|#|$)/.test(
        location.href,
      ),
      watch:
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\/?(?:\?|#|$)/.test(
          location.href,
        ),
      search:
        /^https?:\/\/(?:www\.)?youtube\.com\/results\?search_query=.*(?:#|$)/.test(
          location.href,
        ),
      feed: /^https?:\/\/(?:www\.)?youtube\.com\/feed\/subscriptions/.test(
        location.href,
      ),
      userhome:
        /^https?:\/\/(?:www\.)?youtube\.com\/@[^\/]+\/?$/.test(
          location.href,
        ),
      uservids:
        /^https?:\/\/(?:www\.)?youtube\.com\/@[^\/]+\/videos\/?$/.test(
          location.href,
        ) ||
        /^https?:\/\/(?:www\.)?youtube\.com\/(?:channel|user|c)\/[^\/]+\/videos\/?$/.test(
          location.href,
        ),
    })
  }
  unsafeWindow.getCreatorNameFromUrl = getCreatorNameFromUrl
  function getCreatorNameFromUrl(url) {
    return url.match(/(?:\/@|\/(?:channel|user|c)\/)([^\/]*)/i)?.[1]
  }
})()
