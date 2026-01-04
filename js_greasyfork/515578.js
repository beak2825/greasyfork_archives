// ==UserScript==
// @name Google Maps Contributions Downloader
// @namespace gmcd
// @description Download all the photospheres of a specific Google Maps contributor as a GeoGuessr json
// @version 0.3
// @match https://www.google.com/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515578/Google%20Maps%20Contributions%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/515578/Google%20Maps%20Contributions%20Downloader.meta.js
// ==/UserScript==

(function() {
  locations = []
  semaphore = null
  n = 0
  label = null
  lastUpdate = 0
  function onLoad() {
    h1 = document.querySelector("h1[jsaction='pane.profile-stats.showStats; keydown:pane.profile-stats.showStats']")
    
    div = document.createElement("div")
    div.style = "display: flex; flex-direction: horizontal; align-items: center;"
    
    h1.parentNode.insertBefore(div, h1)
    div.appendChild(h1)
    
    button = document.createElement("button")
    button.innerText = "💾"
    button.classList = h1.classList
    button.addEventListener("click", onClick)
    div.appendChild(button)
    
    label = document.createElement("label")
    label.classList = h1.classList
    div.appendChild(label)
    
    semaphore = new Semaphore(1000)
  }
	window.addEventListener("load", onLoad)

  function onClick() {
    locations = []
    
    for (let img of document.querySelectorAll("button[data-photo-id] img")) {
      if (img.src.includes("-fo")) {
        let panoId = img.closest("button").dataset.photoId.split(":")[1]
        if (panoId.length == 44) {
          panoId = btoa("\b\n\x12," + panoId)
        } else if (panoId.length == 43) {
          panoId = btoa("\b\n\x12+" + panoId).replaceAll("=", "")
        } else if (panoId.length == 42) {
          panoId = btoa("\b\n\x12+" + panoId).replaceAll("=", "")
        }
        locations.push({ lat: 0, lng:0, panoId: panoId })
      }
    }
    
    n = 0
    label.innerText = 0 + "/" + locations.length
    lastUpdate = 0
    for (let location of locations) {
      semaphore.add(getMetadata, location)
    }
  }
  
  class Semaphore {
    constructor(max = 1) {
      this.max = max
      this.compteur = 0
      this.liste = []
    }
 
    add(f, ...args) {
      return new Promise((resolve, reject) => {
        this.liste.push({
          f, args, resolve, reject
        })
        this.next()
      })
    }
 
    next() {
      if (this.liste.length > 0 && this.compteur < this.max) {
        let { f, args, resolve, reject } = this.liste.shift()
        this.compteur++
        f(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.compteur--
            this.next()
          })
      }
    }
  }
  
  function getMetadata(location) {
    return new Promise((resolve, reject) => {
      let url = "https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata"
      let init = {
        method: "POST",
        headers: {
          "Content-Type": "application/json+protobuf",
          "x-user-agent": "grpc-web-javascript/0.1"
        },
        body: JSON.stringify([["apiv3"],[],[[[10, location.panoId]]],[[1, 2, 3, 4, 6, 8]]])
      }
      fetch(url, init)
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          location.lat = response[1][0][5][0][1][0][2]
          location.lng = response[1][0][5][0][1][0][3]
          location.panoId = btoa("\x08\x0A\x12" + String.fromCharCode(location.panoId.length) + location.panoId).replaceAll("=", "")
        })
				.catch((response) => {
        	console.error(response)
				})
				.finally(() => {
					resolve()
        
          n++
          if (Date.now() - lastUpdate > 1000) {
            label.innerText = n + "/" + locations.length
            lastUpdate = Date.now()
          }
 
          if (n == locations.length) {
            label.innerText = null
            downloadJSON()
          }
				})
    })
  }
  
  function downloadJSON() {
    let file = new Blob([JSON.stringify(locations)], { type: "application/json" })
    let link = document.createElement("a")
    link.target= "_blank"
    link.href = URL.createObjectURL(file)
    link.download = document.querySelector("h1[jsaction='pane.profile-stats.showStats; keydown:pane.profile-stats.showStats']").innerText + ".json"
    link.click()
    URL.revokeObjectURL(link.href)
  }
})();