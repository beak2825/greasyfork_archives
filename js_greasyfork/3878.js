// ==UserScript==
// @name        Apina.biz improved
// @namespace   Rennex/apina.biz
// @description Browse apina.biz with full-sized images. Plus other tweaks.
// @include     /https?://apina\.biz//
// @version     3.0
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3878/Apinabiz%20improved.user.js
// @updateURL https://update.greasyfork.org/scripts/3878/Apinabiz%20improved.meta.js
// ==/UserScript==

const randoms_cache_days = 7

const randoms_cache_ms = randoms_cache_days*24*3600*1000

var m
if (m = location.href.match(/apina\.biz\/(\d+\.(jpg|gif|png|webm|mp4))/)) {
    // we've landed on the zoom-in page from an external link
    // -> redirect to the full-sized picture
    location.replace("https://images.apina.biz/full/" + m[1])
    return
}
// also remove that ?ref=randoms bullshit from the address bar
if (m = location.href.match(/apina\.biz\/(.+)\?ref=/)) {
    history.replaceState(null, "", m[1])
}

// hide the main picture and randoms list asap
var style = document.createElement("style")
style.type = "text/css"
style.innerHTML = "#big_image, #randoms { display: none; }"

// the <head> might not exist at this point
var head = document.head
if (!head) {
    head = document.createElement("head")
    document.children[0].appendChild(head)
}
head.appendChild(style)


function addZoomIndicator(img, parent, event) {
    var handler = function() {
        // only handle this event once
        img.removeEventListener(event, handler)

        var zoom = document.createElement("small")
        zoom.style.color = "#888"

        // update the percentage when the window is resized
        var updateZoom = function() {
            // if it's a video, we must use clientWidth and hope that the borders are always 6 px
            var displayw = img.width || (img.clientWidth - 6)
            var realw = img.naturalWidth || img.videoWidth

            // calculate the size in physical pixels for high DPI screens
            var dpr = window.devicePixelRatio || 1
            var ratio = dpr * displayw / realw

            // show the zoom indicator only if it's shrunken in physical pixels
            zoom.textContent = (ratio >= 1) ? "" : Math.floor(ratio*100).toString() + "%"

            // if it's not shrunken in logical pixels, remove the hover effect and finger cursor
            if (displayw == realw) {
                img.style.background = "#fff"
                img.style.cursor = "default"
            }
            else {
                img.style.background = ""
                img.style.cursor = ""
            }
        }
        window.addEventListener("resize", updateZoom)
        updateZoom()
        parent.appendChild(zoom)
    }
    img.addEventListener(event, handler)
}


addEventListener("DOMContentLoaded", function () {
    try {
        // if we are in the image browsing mode, viewing a medium-sized image,
        // this will find an element
        var m, img, video, a
        if (a = document.querySelector("#big_image a")) {
            if (m = a.href.match(/\/\d+[^\/]+$/)) {
                // fix the link to point directly to the image
                a.href = "//images.apina.biz/full" + m[0]
                // and remove that annoying title popup while we're at it
                a.removeAttribute("title")

                var parent = a.parentElement

                // change the img element to use the full-sized image and appear wider
                if (img = a.querySelector("img")) {
                    // we have to remove this image and create a new one,
                    // to prevent it from visibly growing moments later
                    a.removeChild(img)
                    img = new Image()
                    addZoomIndicator(img, parent, "load")
                    img.src = a.href
                    img.style.maxWidth = "100%"
                    a.appendChild(img)
                }
                else if (video = a.querySelector("video")) {
                    // webm/mp4 video instead?
                    // let it auto-size
                    video.removeAttribute("width")
                    video.removeAttribute("height")
                    video.style.maxWidth = "100%"

                    // to enable pausing and other controls, move it outside the <a>
                    parent.removeChild(a)

                    // we need a new <video> element, the old one's events may have fired
                    var newvideo = video.cloneNode(false)

                    // "canplay" seems to fire at a time when the video element size has settled
                    addZoomIndicator(newvideo, parent, "canplay")

                    // replace small sources with full-sized ones
                    for (var source of video.querySelectorAll("source")) {
                        var newsource = source.cloneNode(false)
                        newsource.src = source.src.replace(/medium\/m_/, "full/")
                        newvideo.appendChild(newsource)
                    }
                    parent.appendChild(newvideo)
                }
            }
        }

        // handle the randoms memory    
        if (m = location.href.match(/apina\.biz\/(\d+)$/)) {
            var pic = m[1]
            var randoms = document.getElementById("randoms")
            var stored = localStorage.getItem(pic)
            if (stored) {
                try {
                    stored = JSON.parse(stored)
                    randoms.innerHTML = stored.randoms
                    console.log("restored randoms from cache")
                }
                catch (e) { }
            }
            localStorage.setItem(pic, JSON.stringify({
                time: Date.now(),
                randoms: randoms.innerHTML
            }))
        }
    }
    finally {
        // re-enable displaying the picture and randoms bar
        head.removeChild(style)
    }

}, false)

// if it's been too long since the last cleanup of the randoms cache, do it now
var lastcleanup = parseInt(localStorage["lastcleanup"])
if (!lastcleanup || lastcleanup < Date.now() - 0.1*randoms_cache_ms) {
    localStorage["lastcleanup"] = Date.now()

    console.log("cleaning randoms cache")
    for (var key of Object.keys(localStorage)) {
        if (key.match(/^\d+$/)) {
            var keep = false
            try {
                var stored = JSON.parse(localStorage.getItem(key))
                if (stored.time > Date.now() - randoms_cache_ms) {
                    keep = true
                }
            }
            catch (e) { }

            if (!keep) {
                localStorage.removeItem(key)
                console.log("flushed " + key + " from localStorage")
            }
        }
    }

}
