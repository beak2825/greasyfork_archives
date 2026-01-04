// ==UserScript==
// @name        Minetest ContentDB Image Gallery
// @name:RU-ru  Просмотр изображений на Minetest ContentDB
// @namespace   Violentmonkey Scripts
// @match       https://content.minetest.net/*
// @grant       none
// @version     1.1.0
// @author      Xevin
// @license     MIT
// @description 02.11.2022, 00:57:11
// @downloadURL https://update.greasyfork.org/scripts/454152/Minetest%20ContentDB%20Image%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/454152/Minetest%20ContentDB%20Image%20Gallery.meta.js
// ==/UserScript==

const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

let imageList = []
let imageIndex = null


function nextImage(idx) {
  imageIndex = imageList[idx + 1] ? idx + 1 : 0
  return imageList[imageIndex]
}


function prevImage(idx) {
  imageIndex = idx - 1 >= 0 ? idx - 1 : imageList.length - 1
  return imageList[imageIndex]
}

function showImage(url) {
  const $galleryModal = $("body #gallery-modal")
  let $galleryModalBody

  if (!$galleryModal) {
    const $galleryModal = document.createElement("div")
    $galleryModal.id = "gallery-modal"
    $galleryModal.classList.add("gallery-modal")

    const $galleryModalClose = document.createElement("button")
    $galleryModalClose.innerHTML = "&times;"
    $galleryModalClose.classList.add("gallery-modal__close")

    $galleryModalClose.addEventListener("click", () => {
      $galleryModal.classList.add("hidden")
    })

    const $galleryModalPrev = document.createElement("button")
    $galleryModalPrev.innerHTML = "&lt;"
    $galleryModalPrev.classList.add("gallery-modal__prev")

    $galleryModalPrev.addEventListener("click", () => {
      showImage(prevImage(imageIndex))
    })

    const $galleryModalNext = document.createElement("button")
    $galleryModalNext.innerHTML = "&gt;"
    $galleryModalNext.classList.add("gallery-modal__next")

    $galleryModalNext.addEventListener("click", () => {
      showImage(nextImage(imageIndex))
    })

    $galleryModalBody = document.createElement("div")
    $galleryModalBody.classList.add("gallery-modal__body")

    $galleryModalImage = document.createElement("img")

    $galleryModal.appendChild($galleryModalClose)
    $galleryModal.appendChild($galleryModalBody)
    $galleryModalBody.appendChild($galleryModalImage)
    $galleryModalBody.appendChild($galleryModalPrev)
    $galleryModalBody.appendChild($galleryModalNext)

    if (imageList.length === 1) {
      $galleryModalNext.classList.add("hidden")
      $galleryModalPrev.classList.add("hidden")
    }

    document.body.appendChild($galleryModal)
  } else {
    $galleryModal.classList.remove("hidden")
    $galleryModalBody = $galleryModal.querySelector(".gallery-modal__body")
  }

  $galleryModalBody.style.backgroundImage = `url(${url})`

  return $galleryModal
}


function addCss(styleText) {
  const $style = document.createElement("style")
  $style.innerHTML = styleText

  document.head.appendChild($style)
}


$$("ul.gallery li a.gallery-image").forEach((el) => {
  imageList.push(el.href)

  el.addEventListener("click", (ev) => {
    ev.preventDefault()
    imageIndex = imageList.findIndex((i) => el.href == i)
    showImage(imageList[imageIndex])
  })
})



addCss(`
.gallery-image {
  transition: transform .15s ease-in-out;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 10;
}

.gallery-modal.hidden {
  display: none;
}

.gallery-modal__body {
  position: absolute;
  height: 90%;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}


.gallery-modal__next,
.gallery-modal__prev,
.gallery-modal__close {
  width: 50px;
  height: 50px;
  background-color: rgba(255,255,255,0.5);
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 200%;
  border: none;
  transition: all .15s ease-in-out;
}


.gallery-modal__close {
  top: 6px;
  right: 6px;
}

.gallery-modal__close:hover {
  background-color: white;
  transform: scale(1.1);
}

.gallery-modal__prev {
  top: 50%;
  left: -25px;
}

.gallery-modal__next {
  top: 50%;
  right: -25px;
}

.hidden {
  display: none;
}
`)

