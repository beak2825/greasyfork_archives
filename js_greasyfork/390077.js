/* eslint-disable max-len */
// ==UserScript==
// @name           Improve pixiv thumbnails
// @name:ja        pixivサムネイルを改善する
// @namespace      https://www.kepstin.ca/userscript/
// @license        MIT; https://spdx.org/licenses/MIT.html
// @version        20240918.2
// @description    Stop pixiv from cropping thumbnails to a square. Use higher resolution thumbnails on Retina displays.
// @description:ja 正方形にトリミングされて表示されるのを防止します。Retinaディスプレイで高解像度のサムネイルを使用します。
// @author         Calvin Walton
// @match          https://www.pixiv.net/*
// @match          https://dic.pixiv.net/*
// @match          https://en-dic.pixiv.net/*
// @exclude        https://www.pixiv.net/fanbox*
// @noframes
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/390077/Improve%20pixiv%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/390077/Improve%20pixiv%20thumbnails.meta.js
// ==/UserScript==
/* eslint-enable max-len */
/* global GM_addValueChangeListener */

// Copyright © 2020 Calvin Walton <calvin.walton@kepstin.ca>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function kepstinFixPixivThumbnails () {
  'use strict'

  // Use an alternate domain (CDN) to load images
  // Configure this by setting `domainOverride` in userscript values
  let domainOverride = ''

  // Use custom (uploader-provided) thumbnail crops
  // If you enable this setting, then if the uploader has set a custom square crop on the image, it will
  // be used. Automatically cropped images will continue to be converted to uncropped images
  // Configure this by setting `allowCustom` in userscript values
  let allowCustom = false

  // Browser feature detection for CSS 4 image-set()
  let imageSetSupported = false
  let imageSetPrefix = ''
  if (CSS.supports('background-image', 'image-set(url("image1") 1x, url("image2") 2x)')) {
    imageSetSupported = true
  } else if (CSS.supports('background-image', '-webkit-image-set(url("image1") 1x, url("image2") 2x)')) {
    imageSetSupported = true
    imageSetPrefix = '-webkit-'
  }

  // A regular expression that matches pixiv thumbnail urls
  // Has 5 captures:
  // $1: domain name
  // $2: thumbnail width (optional)
  // $3: thumbnail height (optional)
  // $4: everything in the URL after the thumbnail size up to the image suffix
  // $5: thumbnail crop type: square (auto crop), custom (manual crop), master (no crop)
  // eslint-disable-next-line max-len
  const srcRegexp = /https?:\/\/(i[^.]*\.pximg\.net)(?:\/c\/(\d+)x(\d+)(?:_[^/]*)?)?\/(?:custom-thumb|img-master)\/(.*?)_(custom|master|square)1200.jpg/

  // Look for a URL pattern for a thumbnail image in a string and return its properties
  // Returns null if no image found, otherwise a structure containing the domain, width, height, path.
  function matchThumbnail (str) {
    const m = str.match(srcRegexp)
    if (!m) { return null }

    let [_, domain, width, height, path, crop] = m
    // The 1200 size does not include size in the URL, so fill in the values here when missing
    width = width || 1200
    height = height || 1200
    if (domainOverride) { domain = domainOverride }
    return { domain, width, height, path, crop }
  }

  // List of image sizes and paths possible for original aspect thumbnail images
  // This must be in order from small to large for the image set generation to work
  const imageSizes = [
    { size: 150, path: '/c/150x150' },
    { size: 240, path: '/c/240x240' },
    { size: 360, path: '/c/360x360_70' },
    { size: 600, path: '/c/600x600' },
    { size: 1200, path: '' }
  ]

  // Generate a list of original thumbnail images in various sizes for an image,
  // and determine a default image based on the display size and screen resolution
  function genImageSet (size, m) {
    if (allowCustom && m.crop === 'custom') {
      return imageSizes.map((imageSize) => ({
        src: `https://${m.domain}${imageSize.path}/custom-thumb/${m.path}_custom1200.jpg`,
        scale: imageSize.size / size
      }))
    }
    return imageSizes.map((imageSize) => ({
      src: `https://${m.domain}${imageSize.path}/img-master/${m.path}_master1200.jpg`,
      scale: imageSize.size / size
    }))
  }

  // Create a srcset= attribute on the img, with appropriate dpi scaling values
  // Also update the src= attribute
  function imgSrcset (img, size, m) {
    const imageSet = genImageSet(size, m)
    img.srcset = imageSet.map((image) => `${image.src} ${image.scale}x`).join(', ')
    // IMG tag src attribute is assumed to be 1x scale
    const defaultSrc = imageSet.find((image) => image.scale >= 1) || imageSet[imageSet.length - 1]
    img.src = defaultSrc.src
    img.style.objectFit = 'contain'
    if (!img.attributes.width && !img.style.width) { img.setAttribute('width', size) }
    if (!img.attributes.height && !img.style.height) { img.setAttribute('height', size) }
  }

  // Set up a css background-image with image-set() where supported, falling back
  // to a single image
  function cssImageSet (node, size, m) {
    const imageSet = genImageSet(size, m)
    node.style.backgroundSize = 'contain'
    node.style.backgroundPosition = 'center'
    node.style.backgroundRepeat = 'no-repeat'
    if (imageSetSupported) {
      const cssImageList = imageSet.map((image) => `url("${image.src}") ${image.scale}x`).join(', ')
      node.style.backgroundImage = `${imageSetPrefix}image-set(${cssImageList})`
    } else {
      const optimalSrc = imageSet.find((image) => image.scale >= window.devicePixelRatio) || imageSet[imageSet.length - 1]
      node.style.backgroundImage = `url("${optimalSrc.src}")`
    }
  }

  // Parse a CSS length value to a number of pixels. Returns NaN for other units.
  function cssPx (value) {
    if (!value.endsWith('px')) { return NaN }
    return +value.replace(/[^\d.-]/g, '')
  }

  function findParentSize (node) {
    let e = node
    while (e.parentElement) {
      let size = Math.max(e.getAttribute('width'), e.getAttribute('height'))
      if (size > 0) { return size }

      size = Math.max(cssPx(e.style.width), cssPx(e.style.height))
      if (size > 0) { return size }

      e = e.parentElement
    }
    e = node
    while (e.parentElement) {
      const cstyle = window.getComputedStyle(e)
      const size = Math.max(cssPx(cstyle.width), cssPx(cstyle.height))
      if (size > 0) { return size }

      e = e.parentElement
    }
    return 0
  }

  function handleImg (node) {
    if (node.dataset.kepstinThumbnail === 'bad') { return }
    // Check for lazy-loaded images, which have a temporary URL
    // They'll be updated later when the src is set
    if (node.src === '' || node.src.startsWith('data:') || node.src.endsWith('transparent.gif')) { return }

    // Terrible hack: A few pages on pixiv create temporary IMG tags to... preload? the images, then switch
    // to setting a background on a DIV afterwards. This would be fine, except the temporary images have
    // the height/width set to 0, breaking the hidpi image selection
    if (
      node.getAttribute('width') === '0' && node.getAttribute('height') === '0' &&
      /^\/(?:discovery|(?:bookmark|mypixiv)_new_illust(?:_r18)?\.php)/.test(window.location.pathname)
    ) {
      // Set the width/height to the expected values
      node.setAttribute('width', 198)
      node.setAttribute('height', 198)
    }

    const m = matchThumbnail(node.src || node.srcset)
    if (!m) { node.dataset.kepstinThumbnail = 'bad'; return }
    if (node.dataset.kepstinThumbnail === m.path) { return }

    // Cancel image load if it's not already loaded
    if (!node.complete) {
      node.src = ''
      node.srcset = ''
    }

    // layout-thumbnail type don't have externally set size, but instead element size is determined
    // from image size. For other types we have to calculate size.
    let size = Math.max(m.width, m.height)
    if (node.matches('div._layout-thumbnail img')) {
      node.setAttribute('width', m.width)
      node.setAttribute('height', m.height)
    } else {
      const newSize = findParentSize(node)
      if (newSize > 16) { size = newSize }
    }

    imgSrcset(node, size, m)

    node.dataset.kepstinThumbnail = m.path
  }

  function handleCSSBackground (node) {
    if (node.dataset.kepstinThumbnail === 'bad') { return }
    // Check for lazy-loaded images
    // They'll be updated later when the background image (in style attribute) is set
    if (
      node.classList.contains('js-lazyload') ||
      node.classList.contains('lazyloaded') ||
      node.classList.contains('lazyloading')
    ) { return }

    const m = matchThumbnail(node.style.backgroundImage)
    if (!m) { node.dataset.kepstinThumbnail = 'bad'; return }
    if (node.dataset.kepstinThumbnail === m.path) { return }

    node.style.backgroundImage = ''

    let size = Math.max(cssPx(node.style.width), cssPx(node.style.height))
    if (!(size > 0)) {
      const cstyle = window.getComputedStyle(node)
      size = Math.max(cssPx(cstyle.width), cssPx(cstyle.height))
    }
    if (!(size > 0)) { size = Math.max(m.width, m.height) }

    cssImageSet(node, size, m)

    node.dataset.kepstinThumbnail = m.path
  }

  function onetimeThumbnails (parentNode) {
    parentNode.querySelectorAll('IMG').forEach((node) => {
      handleImg(node)
    })
    parentNode.querySelectorAll('DIV[style*=background-image]').forEach((node) => {
      handleCSSBackground(node)
    })
    parentNode.querySelectorAll('A[style*=background-image]').forEach((node) => {
      handleCSSBackground(node)
    })
  }

  function mutationObserverCallback (mutationList, _observer) {
    mutationList.forEach((mutation) => {
      const target = mutation.target
      switch (mutation.type) {
        case 'childList':
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return

            if (node.nodeName === 'IMG') {
              handleImg(node)
            } else if ((node.nodeName === 'DIV' || node.nodeName === 'A') && node.style.backgroundImage) {
              handleCSSBackground(node)
            } else {
              onetimeThumbnails(node)
            }
          })
          break
        case 'attributes':
          if (target.nodeType !== Node.ELEMENT_NODE) break

          if ((target.nodeName === 'DIV' || target.nodeName === 'A') && target.style.backgroundImage) {
            handleCSSBackground(target)
          } else if (target.nodeName === 'IMG') {
            handleImg(target)
          }
          break
        // no default
      }
    })
  }

  function addStylesheet() {
    if (!(window.location.host == "www.pixiv.net")) { return; }
    if (document.head === null) {
      document.addEventListener("DOMContentLoaded", addStylesheet, { once: true });
      return;
    }
    let s = document.createElement("style");
    s.textContent = `
      div:has(>div[width][height]), div:has(>label div[width][height]), div[type="illust"] {
        border-radius: 0;
      }
      div[width][height]:hover img[data-kepstin-thumbnail], div[type="illust"] a:hover img {
        opacity: 1 !important;
        background-color: var(--charcoal-background1-hover);
      }
      div[radius] img[data-kepstin-thumbnail], div[type="illust"] img {
        border-radius: 0;
        background-color: var(--charcoal-background1);
        transition: background-color 0.2s;
      }
      div[radius]::before, div[type="illust"] a > div::before {
        border-radius: 0;
        background: transparent;
        box-shadow: inset 0 0 0 1px var(--charcoal-border);
      }
    `;
    document.head.appendChild(s);
  }

  function loadSettings () {
    const gmDomainOverride = GM_getValue('domainOverride')
    if (typeof gmDomainOverride === 'undefined') {
      // migrate settings
      domainOverride = localStorage.getItem('kepstinDomainOverride') || ''
      localStorage.removeItem('kepstinDomainOverride')
    } else {
      domainOverride = gmDomainOverride || ''
    }
    if (domainOverride !== gmDomainOverride) {
      GM_setValue('domainOverride', domainOverride)
    }

    const gmAllowCustom = GM_getValue('allowCustom')
    if (typeof gmAllowCustom === 'undefined') {
      // migrate settings
      allowCustom = !!localStorage.getItem('kepstinAllowCustom')
      localStorage.removeItem('kepstinAllowCustom')
    } else {
      allowCustom = !!gmAllowCustom
    }
    if (allowCustom !== gmAllowCustom) {
      GM_setValue('allowCustom', allowCustom)
    }
  }

  if (typeof GM_getValue !== 'undefined' && typeof GM_setValue !== 'undefined') {
    loadSettings()
  }
  if (typeof GM_addValueChangeListener !== 'undefined') {
    GM_addValueChangeListener('domainOverride', (_name, _oldValue, newValue, remote) => {
      if (!remote) { return }
      domainOverride = newValue || ''
      if (domainOverride !== newValue) {
        GM_setValue('domainOverride', domainOverride)
      }
    })
    GM_addValueChangeListener('allowCustom', (_name, _oldValue, newValue, remote) => {
      if (!remote) { return }
      allowCustom = !!newValue
      if (allowCustom !== newValue) {
        GM_setValue('allowCustom', allowCustom)
      }
    })
  }

  addStylesheet()
  onetimeThumbnails(document.firstElementChild)
  const thumbnailObserver = new MutationObserver(mutationObserverCallback)
  thumbnailObserver.observe(document.firstElementChild, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'src', 'style']
  })
}())
