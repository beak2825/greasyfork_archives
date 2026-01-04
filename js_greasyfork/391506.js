// ==UserScript==
// @name        VVVVID Streaming
// @namespace   https://github.com/Nearata/
// @description Utilizza un player esterno per bypassare la pubblicità su VVVVID.
// @author      Nearata
// @version     1.0.9
// @license     MIT; https://choosealicense.com/licenses/mit/
// @copyright   2019+, William Di Cicco (https://github.com/Nearata/)
// @homepage    https://github.com/Nearata/vvvvid-streaming/
// @supportURL  https://github.com/Nearata/vvvvid-streaming/issues
// @match       *://www.vvvvid.it/*
// @exclude     *://www.vvvvid.it/adblock.html
// @require     https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/flowplayer/7.2.7/flowplayer.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.12.4/hls.light.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/391506/VVVVID%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/391506/VVVVID%20Streaming.meta.js
// ==/UserScript==

let currentLocation = window.location.href
let fpCSSAdded = false

function fixUrl(url) {
  return url.replace("http://vvvvid-vh.akamaihd.net/z", "http://vvvvid-vh.akamaihd.net/i").replace("/manifest.f4m", "/master.m3u8")
}

(() => {
  setInterval(() => {
    if ($("div.show-title").length && window.location.href !== currentLocation || (window.location.href === currentLocation && $(".show-streaming-button").length == 0)) {
      currentLocation = window.location.href
      
      if (!fpCSSAdded) {
        let fpCSS = $("<link />", {
          "rel": "stylesheet",
          "href": "https://cdnjs.cloudflare.com/ajax/libs/flowplayer/7.2.7/skin/skin.min.css"
        })
        fpCSS.appendTo("head")
        fpCSSAdded = true
      }
      
      $(".show-streaming-button").remove()
      $("#streaming-modal").remove()
      
      let streamingElem = $("<div />", {
          "id": "streaming-modal"
      })
      streamingElem.css({
        "z-index": "10000",
        "position": "fixed",
        "top": "50%",
        "left": "50%",
        "transform": "translate(-50%, -50%)",
        "background-color": "rgba(0, 0, 0, .5)",
        "padding": "14px",
        "width": "480px",
        "display": "none"
      })
      streamingElem.prependTo("body")
      
      let closeStreamingElem = $("<div />", {"id":"streaming-modal-close", "text":"x"})
      closeStreamingElem.css({
        "cursor": "pointer",
        "font-size": "32px",
        "text-align": "center",
        "margin-bottom": "12px"
      })
      closeStreamingElem.appendTo(streamingElem)
      
      let videoElem = $("<div />", {"id":"video-player-fp"})
      videoElem.appendTo(streamingElem)
      
      let fpApi = flowplayer("#video-player-fp", {
        aspectRatio: "16:9",
        fullscreen: true,
        clip: {
          sources: [
            {
              type: "application/x-mpegurl",
              src: "https://vvvvid-vh.akamaihd.net/i/Dynit/PromisedNeverland/PromisedNeverland_S01Ep04_ufu9RSmTrcmBbcnvm.mp4/master.m3u8"
            }
          ]
        }
      });
      
      let showButtonsActionsElem = $(".show-buttons-actions")

      $.get("https://www.vvvvid.it/user/login", loginResult => {
        let connId = loginResult["data"]["conn_id"]
        let showId = currentLocation.match(/\d+/g).map(Number);
        
        $.get(`https://www.vvvvid.it/vvvvid/ondemand/${showId}/seasons/?conn_id=${connId}`, seasonsResult => {
          $.each(seasonsResult["data"], (index, value) => {
            if (value["episodes"].length >= 1) {
              if (value["episodes"][0].playable) {
                showButtonsActionsElem.append($("<div />", {
                  "class":"button-35 show-streaming-button button-black-background button-shadow-small text-shadow",
                  "text":value["name"],
                  "title":value["name"],
                  "data-season-id":value["season_id"]
                }).css({
                  "text-transform": "uppercase",
                  "font-weight": "700",
                  "color": "hsl(225, 73%, 57%)",
                  "overflow": "hidden",
                  "white-space": "nowrap",
                  "text-overflow": "ellipsis",
                  "box-sizing": "border-box",
                  "padding": "0 8px"
                }))
              }
            }
          })

          $(".show-streaming-button").click((e) => {
            let versionTitle = e.currentTarget.title
            let seasonId = e.currentTarget.dataset.seasonId
            $.get(`https://www.vvvvid.it/vvvvid/ondemand/${showId}/season/${seasonId}?conn_id=${connId}`, seasonResult => {
              let numEpisodes = seasonResult["data"].length
              swal({
                "title": versionTitle,
                "text": `Seleziona un episodio da 1 a ${numEpisodes}. Es. 1`,
                "content": "input",
                "button": {
                  "text": "Play",
                }
              }).then(ep => {
                if (isNaN(ep)) {
                  return swal("Deve essere un numero!")
                }
                
                if (ep < 1 || ep > numEpisodes) {
                  return swal("Episodio non trovato!")
                }
                
                fpApi.load({
                  sources: [
                    {
                      type: "application/x-mpegurl",
                      src: fixUrl(window.$ds(seasonResult["data"][ep-1]["embed_info"])).replace("http:", "https:"),
                      title: `${seasonResult["data"][ep-1]["show_title"]} - E${ep}`
                    }
                  ]
                }, () => {
                  let videoId = seasonResult["data"][ep-1]["video_id"]
                  
                  $.get(`https://www.vvvvid.it/vvvvid/video/${videoId}?conn_id=${connId}`, videoResult => {
                    let ondemandType = videoResult["data"]["ondemand_type"]
                    
                    $.post(`https://www.vvvvid.it/vvvvid/video/${videoId}/event/start`, {
                      "idVideo": videoId,
                      "eventCode": "start",
                      "ondemand_type": ondemandType,
                      "conn_id": connId
                    }).done(() => {
                      $.post(`https://www.vvvvid.it/vvvvid/video/${videoId}/event/displayClick`, {
                        "idVideo": videoId,
                        "eventCode": "displayClick",
                        "ondemand_type": ondemandType,
                        "conn_id": connId
                      })
                    })
                  })
                })
                
                $("#streaming-modal").fadeIn()
                $("#streaming-modal-close").click(() => $("#streaming-modal").fadeOut(() => fpApi.stop()))
              })
            })
          })
        })
      })
    }
  }, 1000)
})()
