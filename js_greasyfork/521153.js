// ==UserScript==
// @name         empornium lightbox gallery
// @namespace    https://www.empornium.sx
// @version      1.3
// @description  add a lightbox gallery to torrent pages
// @author       ephraim
// @match        https://www.empornium.sx/torrents.php?id=*
// @match        https://www.emparadise.rs/torrents.php?id=*
// @grant        GM_addElement
// @grant        GM_getResourceText
// @resource     fancyboxJS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @resource     fancyboxCSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css
// @downloadURL https://update.greasyfork.org/scripts/521153/empornium%20lightbox%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/521153/empornium%20lightbox%20gallery.meta.js
// ==/UserScript==

GM_addElement('style', { textContent: GM_getResourceText("fancyboxCSS") })
GM_addElement('script', { textContent: GM_getResourceText("fancyboxJS") })

var descbox = document.querySelector('#descbox')

// make thumbnails of fullsize images
var srcQuery = `img[src*="hamsterimg.net"]:not([src*=".th."], [src*=".md."], [src*="poster" i], [src*="banner" i],
                      [src$=".png"],[src$="cast11.jpg"], [src$="plot11.jpg"], [src$="info11.jpg"], [src$="screens11.jpg"], [src$="finger-pointing-down.gif"])`
var dataSrcQuery = srcQuery.replaceAll('[src', '[data-src')
var fullsize = descbox.querySelectorAll(`${srcQuery}, ${dataSrcQuery}`)

fullsize.forEach(i => {
  var src = i.src || i.dataset.src
  var thumbSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.th.$1')
  if (!i.hasAttribute('width')) {
    i.src = thumbSrc
    i.dataset.src = thumbSrc
  }
  var a = document.createElement('a')
  a.className = 'lightbox-image'
  var parent = i.parentElement
  if (parent.tagName === "A") {
    parent.parentElement.insertBefore(a, parent)
    parent.remove()
  } else {
    parent.insertBefore(a, i)
  }
  a.append(i)
})

// put thumbnails on one row
document.querySelectorAll('a.lightbox-image + br').forEach(br => { br.remove() })

//find links to fullsize images without thumbnails
var fullsizeLinks = descbox.querySelectorAll('a[href*="hamsterimg.net"]:not(:has(img)):not([href*="/album/"])')
fullsizeLinks.forEach(f => {
  var th = document.createElement('img')
  th.className = 'bbcode scale_image'
  th.alt = f.href
  if (!/\.gif$/.test(th.alt)) {
    if (/images\/fi/.test(th.alt)) {
      //th.src = f.href
      th.src = f.href.replace('image-', 'thumb-')
    } else {
      th.src = f.href.replace(/\.(?=\w*$)/, '.th.')
    }
  }
  th.style.display = 'none'
  th.loading = "lazy"
  f.append(th)
  f.className += 'lightbox-image'
})

//find thumbnails with links to fullsize
var images = descbox.querySelectorAll(`a[href*="hamsterimg.net"]:has(img[src*=".th."], img[src*=".md."], img[data-src*=".th."], img[data-src*=".md."]),
                                       a.lightbox-image`)
images.forEach(a => {
  var thumb = a.querySelector('img')
  var thumbUrl = thumb.dataset.src || thumb.src
  var fullUrl = thumbUrl.replace(/\.(?:th|md)\.(?=\w*$)/i, '.')
  var fullName = fullUrl.split('/').pop()

  a.removeAttribute('target')
  thumb.removeAttribute('onclick')
  a.href = fullUrl
  a.dataset.fancybox = 'gallery'
  a.dataset.caption = `<a href="${fullUrl}" style="color:white;">${fullName}</a>`
})

Fancybox.bind('[data-fancybox="gallery"]', {
  wheel: "slide",
  animationDuration: 100,
  contentClick: "toggleCover",
  contentDblClick: "zoomToMax",
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: [
        "zoomIn",
        "zoomOut",
        "toggle1to1",
        "rotateCCW",
        "rotateCW",
        "thumbs",
      ],
      right: ["close"],
    },
  },
  Thumbs: {
    type: "classic",
  },
  Images: {
    Panzoom: {
      maxScale: 2,
      panMode: "mousemove",
      mouseMoveFriction: 0.2,
      mouseMoveFactor: 1.2
    }
  }
});
