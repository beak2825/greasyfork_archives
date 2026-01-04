// ==UserScript==
// @name         Third Eye - 'Sharty Port
// @description  Display some soyjak.party images differently according to file name (MD5)
// @author       Originally by Cunny Software Solutions
// @include      https://*.soyjak*.party/*
// @match        https://soyjak.party/*
// @namespace    ThirdEyeSharty
// @match        https://www.soyjak.party/*
// @license      Public Domain
// @version      22
// @grant GM.xmlHttpRequest
// @grant GM_xmlHttpRequest
// @grant unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/458428/Third%20Eye%20-%20%27Sharty%20Port.user.js
// @updateURL https://update.greasyfork.org/scripts/458428/Third%20Eye%20-%20%27Sharty%20Port.meta.js
// ==/UserScript==

//
/* PLEASE REPORT BUGS & ISSUES @ https://git.coom.tech/cunnysoft/third-eye/issues */
/* You can also ask for help at /cumg/: https://boards.4channel.org/g/catalog#s=cumg */
//

/*eslint curly:0*/

(function() {
  "use strict"

  //
  /* Added in v8, used to clear the cache on updates. Only bump when the cache needs to be cleared */
  //
  const THIRD_EYE_VERSION = 10

  //
  /* Enable or disable sources here */
  //
  const SOURCE_LIST = [
    {name: "gelbooru", url: "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=md5:", width: "sample_width", height: "sample_height"},
    {name: "yande.re", url: "https://yande.re/post.json?tags=md5%3A", width: "sample_width", height: "sample_height"},
    {name: "sankaku", url: "https://capi-v2.sankakucomplex.com/posts/keyset?tags=md5:", width: "sample_width", height: "sample_height"},
    {name: "rule34", url: "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=md5:", width: "sample_width", height: "sample_height"},
  ]

  //
  /* Set to true to color Third Eye links */
  //
  const COLOR_THIRD_EYE_LINKS = false

  //
  /* Any color */
  //
  const THIRD_EYE_LINK_COLOR = "deeppink"

  //
  /* Set to false to disallow images from git.coom.tech/cunnysoft/oekaki */
  //
  const ENABLE_OEKAKI = true

  //
  /* Set to false to disallow explicit images */
  //
  const ALLOW_EXPLICIT = true

  //
  /* BLACKLIST: Uncomment one or add your own tags */
  //const BLACKLIST = []
  const BLACKLIST = ["scat"]
  //const BLACKLIST = ["male_focus", "scat", "penis", "cum"]

  //
  /* THUMBNAIL SIZE */
  //
  const THUMBNAIL_SIZE = "125px"
  const BIG_THUMBNAIL_SIZE = "250px"

  //
  /* Change at your own peril */
  //
  const PRESERVE_THUMBNAIL_SIZE = false

  //
  /* Options for when to use the source's preview image instead of the full image */
  /* Some of these settings may interfere with PRESERVE_THUMBNAIL_SIZE */
  //
  const USE_PREVIEW_IMAGE_IN_OP = false // preview is often less than 250px, threatening loss of quality
  const USE_PREVIEW_IMAGE_IN_REPLIES = true // preview is usually the right size

  //
  /* Avoid touching things below this line */
  //
  const XMLHttpRequest = (GM && GM.xmlHttpRequest) ?? GM_xmlHttpRequest

  const THIRD_EYE_CACHE_PREFIX = "__thirdeye"
  const THIRD_EYE_MD5_CACHE_PREFIX = "__thirdeye_md5__"
  const THIRD_EYE_MISC_CACHE_PREFIX = "__thirdeye_misc__"

  const must = (map, key) => {
    if (map.has(key))
      return map.get(key)
    else
      console.error("must() failed:", key)
  }

  const quote = (string) => {
    return "'" + string + "'"
  }

  {
    const clear_cache = () => {
      for (const x in localStorage) {
        if (x.startsWith(THIRD_EYE_CACHE_PREFIX))
          localStorage.removeItem(x)
      }
    }
    const _THIRD_EYE_VERSION = localStorage.getItem(THIRD_EYE_MISC_CACHE_PREFIX+"version")
    if (!_THIRD_EYE_VERSION) { // _THIRD_EYE_VERSION === null
      console.warn("third eye: No version in cache, so clearing cache.")
      clear_cache()
    } else if (_THIRD_EYE_VERSION < THIRD_EYE_VERSION) { // _THIRD_EYE_VERSION is a string like "8"
      console.warn("third eye: Version in cache is outdated (" + _THIRD_EYE_VERSION + " < " + THIRD_EYE_VERSION + "), so clearing cache.")
      clear_cache()
    }
    localStorage.setItem(THIRD_EYE_MISC_CACHE_PREFIX+"version", THIRD_EYE_VERSION)
  }

  for (const element of document.getElementsByClassName("fileThumb"))
    element.__thirdeye_prepared = undefined

  const whitelisted = (json) => {
    // sankaku
    if (typeof(json.tags) === "object") {
      for (const tag of BLACKLIST) {
        for (const tag2 in json.tags) {
          if (tag2.name_en === tag)
            return false
        }
      }
    } else {
      for (const tag of BLACKLIST) {
        if ((json.tag_string_general || json.tags).split(" ").includes(tag))
          return false
        else if ((json.tag_string_character || "").split(" ").includes(tag))
          return false
      }
    }
    return ALLOW_EXPLICIT || json.rating !== "e"
  }

  const whitelisted_log = (json, md5sum) => {
    const res = whitelisted(json)
    if (!res)
      console.info("third eye: skipped md5 " + md5sum + " due to one or more blacklisted tags")
    return res
  }

  const _4cdn_image = (url) => {
    return url.startsWith("https://i.4cdn.org/") || url.startsWith("https://s.4cdn.org/")
  }

  const _4cdn_full_image_cache = new Map()
  const with_4cdn_full_image = (url, func) => {
    if (_4cdn_full_image_cache.has(url)) {
      func(_4cdn_full_image_cache.get(url))
    } else {
      const img = document.createElement("img")
      img.src = url.replace("s.jpg", ".jpg")
      img.onerror = () => {
        img.src = url.replace("s.jpg", ".png")
        img.onerror = () => {
          img.src = url.replace("s.jpg", ".gif")
          img.onerror = () => {
            img.src = url.replace("s.jpg", ".webm")
          }
        }
      }
      img.onload = () => {
        _4cdn_full_image_cache.set(url, img.src)
        func(img.src)
      }
    }
  }

  const blob_cache = new Map()
  const r_blob_cache = new Map()
  const with_blob = (image, func) => {
    if (blob_cache.has(image)) {
      func(blob_cache.get(image))
    } else
      XMLHttpRequest({
        method: "GET",
        url: image,
        responseType: "blob",
        onload: (response) => {
          const bimg = URL.createObjectURL(response.response)
          blob_cache.set(image, bimg)
          r_blob_cache.set(bimg, image)
          func(bimg)
        }
      })
  }

  const add_events = (element, image) => {

    const href0 = element.href
    const href1 = () => {
      if (_4cdn_image(href0))
        return href0
      else
        return element.href
    }

    element.href = image
    // TODO remove | try to fix race condition
    setTimeout(() => {
      element.href = image
    }, 700)

    // event handling
    if (element.__thirdeye_observer) {
      console.debug("third eye: disconnecting observer")
      element.__thirdeye_observer.disconnect()
      element.__thirdeye_observer = null // futureproofing
    }

    const config = { attributes: false, childList: true, subtree: false }
    const callback = function(mutationsList, observer) {
      if (element.children[1]?.className === "full-image")
        element.children[1].style.visibility = "hidden"
    }

    const observer = new MutationObserver(callback)
    observer.observe(element, config)
    element.__thirdeye_observer = observer

    element.addEventListener("click", (e) => {
      setTimeout(() => {
        const image2 = (element.parentElement.querySelector(".third-eye-swap-button")?.__thirdeye_show_original) ? href1() : image
        with_blob(image2, (bimg) => {
          element.href = image2
          if (element.children[1])
            element.children[1].style.visibility = "visible"
          if (element.children[1]?.className === "full-image") {
            element.children[1].src = bimg
          }
        })
      }, 4)
    })

    // video thumbnails don't load and break the hoverUI
    if (!element.href.endsWith(".mp4") && !element.href.endsWith(".webm")) {
      element.children[0].addEventListener("mouseover", (e) => {
        const handle_4chanX_hoverUI = (currentCB) => {
          const hoverUI = document.getElementById("hoverUI")
          if (!hoverUI || hoverUI.children.length === 0) {
            if (currentCB < 125)
              setTimeout(() => handle_4chanX_hoverUI(currentCB+1), 16) // DO NOT set this to below 16, it breaks
            else {
              if (hoverUI)
                hoverUI.style.visibility = "visible"
              console.warn("third eye: intercepting 4chanX HoverUI took too long. If 4chanX is not installed or hover is turned off, ignore this warning.")
            }
          } else {
            const child = hoverUI.children[0]
            const image2 = (element.parentElement.querySelector(".third-eye-swap-button")?.__thirdeye_show_original) ? href1() : image
            with_blob(image2, (bimg) => {
              child.src = bimg
              const img = document.createElement("img")
              img.src = bimg
              img.onerror = () => {
                console.error("Hover: Error loading img with src", quote(img.src))
                hoverUI.style.visibility = "visible"
              }
              img.onload = () => {
                const doc = document.documentElement
                let width = img.width
                let height = img.height
                const maxWidth = doc.clientWidth
                const maxHeight = doc.clientHeight - 25
                const scale = Math.min(1, maxWidth / width, maxHeight / height)
                width *= scale
                height *= scale
                width = Math.floor(width)
                height = Math.floor(height)
                child.src = bimg
                child.style.width = width + "px"
                child.style.height = height + "px"
                child.style.maxWidth = width + "px"
                child.style.maxHeight = height + "px"
                child.style.top = Math.max(0, e.clientY * (doc.clientHeight - height) / doc.clientHeight) + "px"
                hoverUI.style.visibility = "visible"

                // event handling
                if (child.__thirdeye_observer) {
                  //console.debug("third eye: disconnecting observer")
                  child.__thirdeye_observer.disconnect()
                  child.__thirdeye_observer = null // futureproofing
                }

                const config = { attributes: true, childList: false, subtree: false }
                const callback = function(mutationsList, observer) {
                  // Use traditional 'for loops' for IE 11
                  for (const mutation of mutationsList) {
                    child.style.top = Math.max(0, e.clientY * (doc.clientHeight - height) / doc.clientHeight) + "px"
                    break
                  }
                }

                const observer = new MutationObserver(callback)
                observer.observe(child, config)
                child.__thirdeye_observer = observer
              }
            })
          }
        }
        const hoverUI = document.getElementById("hoverUI")
        if (hoverUI)
          hoverUI.style.visibility = "hidden"
        setTimeout(() => handle_4chanX_hoverUI(0), 4)
      })
    }
  }

  const thumbnail_cache = new Map()
  const thumbnailize = (url, preview_url_or_undefined, md5sum, is_OP) => {
    const work = (thumbnail) => {
      thumbnail_cache.set(thumbnail, url)
      return thumbnail
    }
    if (!USE_PREVIEW_IMAGE_IN_REPLIES || (is_OP && !USE_PREVIEW_IMAGE_IN_OP))
      return url
    else if (url.startsWith("https://img1.gelbooru.com/"))
      return work("https://img1.gelbooru.com/thumbnails/" + md5sum[0] + md5sum[1] + "/" + md5sum[2] + md5sum[3] + "/thumbnail_" + md5sum + ".jpg")
    else if (url.startsWith("https://img2.gelbooru.com/"))
      return work("https://img2.gelbooru.com/thumbnails/" + md5sum[0] + md5sum[1] + "/" + md5sum[2] + md5sum[3] + "/thumbnail_" + md5sum + ".jpg")
    else if (url.startsWith("https://img3.gelbooru.com/"))
      return work("https://img3.gelbooru.com/thumbnails/" + md5sum[0] + md5sum[1] + "/" + md5sum[2] + md5sum[3] + "/thumbnail_" + md5sum + ".jpg")
    else
      return preview_url_or_undefined ? work(preview_url_or_undefined) : url
  }

  // loading function
  const request_source = (element, md5sum, thumbnail_size, is_OP) => {

    const callback = (i) => {
      const source = SOURCE_LIST[i]
      XMLHttpRequest({
        method: "GET",
        url: source.url+md5sum,
        responseType: "json",
        onload: (response) => {
          // NOTE response.response should always exist, but this doesn't hurt
          // https://git.coom.tech/cunnysoft/third-eye/pulls/1
          let json = response?.response ?? JSON.parse(response?.responseText || "{}");
          if (json && json.data !== undefined) // yande.re
            json = json.data
          // typeof(null) === "object"
          // danbooru: json[0]
          // gelbooru: json.post OR json.post[0]. Changed from json[0] on jan 2 2022
          // yande.re: json[0]
          // sankaku: json.data[0]
          // rule34: json[0]
          // lolibooru: json[0]
          json = (json && typeof(json) == "object") ? (json.post || json[0]) : json
          json = (json && typeof(json) == "object") ? (json[0] || json) : json // gelbooru exception
          if (json && json.file_url && whitelisted_log(json, md5sum)) {
            const child = element.children[0]
            const thumbnail = {width: json[source.width], height: json[source.height]}
            localStorage.setItem(THIRD_EYE_MD5_CACHE_PREFIX+md5sum,
                                 JSON.stringify({url: json.file_url,
                                                 preview_url: json.preview_url /* yande.re, sankaku, lolibooru, rule34 */ || json.preview_file_url, // danbooru (not always available?)
                                                 width: thumbnail.width,
                                                 height: thumbnail.height,
                                                 rating: json.rating,
                                                 tags: json.tags,
                                                 tag_string_general: json.tag_string_general,
                                                 tag_string_character: json.tag_string_character}))
            child.setAttribute("referrerpolicy", "no-referrer")
            cache_src(json.file_url, child.src)
            set_element_src(child, thumbnailize(json.file_url, json.preview_url, md5sum, is_OP))
            if (PRESERVE_THUMBNAIL_SIZE) {
              child.style.width = thumbnail.width+"px"
              child.style.height = thumbnail.height+"px"
            } else if (thumbnail.width > thumbnail.height) {
              child.style.width = thumbnail_size
              child.style.height = "auto"
            } else {
              child.style.height = thumbnail_size
              child.style.width = "auto"
            }
            add_events(element, json.file_url)
            console.debug("third eye: registering a new file (" + source.name + ")")
          } else if (i < SOURCE_LIST.length-1)
            callback(i+1)
          else
            console.debug("third eye: couldn't find anything for md5 " + md5sum)
        }
      })
    }
    callback(0)
  }

  const src_cache = new Map()

  const cache_src = (image1, image2) => {
    if (!src_cache.has(image1))
      src_cache.set(image1, image2)
    if (!src_cache.has(image2))
      src_cache.set(image2, image1)
  }

  const set_element_src = (element, image) => {
    cache_src(element.src, image)
    element.src = image
  }

  const swap_element_src = (element) => {
    element.src = must(src_cache, element.src)
  }

  const swap_element_src_then = (element, image, func) => {
    with_blob(image, (bimg) => {
      element.src = bimg
      func()
    })
  }

  let time = performance.now()

  // main function
  const main = () => {

    // re-assign download href whenever it changes (4chanX)
    // also add the swap button
    for (const downloader of document.getElementsByClassName("download-button")) {
      const fileThumb = downloader.parentElement.parentElement.parentElement.querySelector(".fileThumb")
      if (downloader.__thirdeye_original_href === undefined)
        downloader.__thirdeye_original_href = downloader.href
      if (!_4cdn_image(fileThumb.href)) {
        downloader.href = fileThumb.href
        downloader.__thirdeye_replaced_href = downloader.href
      }
      if (!downloader.parentElement.querySelector(".third-eye-swap-button") &&
          !_4cdn_image(fileThumb.children[0].src)) {
        let image1 = fileThumb.children[0].src
        const button = document.createElement("a")
        // swap image button
        button.className = "fa fa-eye third-eye-swap-button"
        button.innerHTML = ""
        button.style.marginLeft = "4px"
        button.style.textDecoration = "none"
        button.href = "javascript:void(null);"
        button.__thirdeye_show_original = false
        button.onclick = () => {

          if (button.className == "fa fa-eye third-eye-swap-button")
            button.className = "fa fa-eye third-eye-swap-button disabled"
          else
            button.className = "fa fa-eye third-eye-swap-button"

          image1 = must(src_cache, image1)
          const thumbnail = downloader.parentElement.parentElement.parentElement.querySelector(".fileThumb").children[0]
          swap_element_src_then(thumbnail, image1, () => {

            button.__thirdeye_show_original = !button.__thirdeye_show_original

            const swap = (a, b, c) => {
              if (a == b)
                return c
              else
                return b
            }

            downloader.href = swap(downloader.href, downloader.__thirdeye_original_href, downloader.__thirdeye_replaced_href)
            fileThumb.href = downloader.href

            // only option to get the original 4chan image in replies
            const img = document.createElement("img")
            img.src = thumbnail.src
            img.onerror = () => {
              console.error("Swap1: Error loading img with src", quote(img.src))
            }
            img.onload = () => {
              // fix dimensions of alt images
              const child = fileThumb.children[0]
              if (img.width > img.height) {
                child.style.width = fileThumb.closest(".opContainer") ? BIG_THUMBNAIL_SIZE : THUMBNAIL_SIZE
                child.style.height = "auto"
              } else {
                child.style.height = fileThumb.closest(".opContainer") ? BIG_THUMBNAIL_SIZE : THUMBNAIL_SIZE
                child.style.width = "auto"
              }
            }
          })
        }
        downloader.parentElement.insertBefore(button, downloader.nextSibling)
      }
    }

    // 4chanX (fnswitch does not exist otherwise)
    if (COLOR_THIRD_EYE_LINKS) {
      for (const element of document.getElementsByClassName("fnswitch")) {
        if (!_4cdn_image(element.parentElement.parentElement.parentElement.parentElement.querySelector(".fileThumb").href))
          element.style.color = THIRD_EYE_LINK_COLOR
      }
    }

    // for replies
    for (const button of document.getElementsByClassName("third-eye-swap-button")) {
      if (button.__thirdeye_show_original === undefined) {
        button.__thirdeye_show_original = false
        // 4chanX copies the replaced image so make sure the icon is right
        button.className = "fa fa-eye third-eye-swap-button"
      }
      if (button.onclick === null) {
        let image1 = undefined // wait for thumbnail to be replaced
        button.onclick = () => {

          if (button.className == "fa fa-eye third-eye-swap-button")
            button.className = "fa fa-eye third-eye-swap-button disabled"
          else
            button.className = "fa fa-eye third-eye-swap-button"
          button.__thirdeye_show_original = !button.__thirdeye_show_original

          const downloader = button.parentElement.querySelector(".download-button")
          const fileThumb = downloader.parentElement.parentElement.parentElement.querySelector(".fileThumb")
          const thumbnail = fileThumb.children[0]

          if (image1 === undefined) {
            image1 = fileThumb.children[0].src
            image1 = r_blob_cache.get(image1) || image1
          }

          image1 = must(src_cache, image1)
          swap_element_src_then(thumbnail, image1, () => {
            // only option to get the original 4chan image in replies
            const img = document.createElement("img")
            img.src = thumbnail.src
            img.onerror = () => {
              console.error("Swap2: Error loading img with src", quote(img.src))
            }
            img.onload = () => {
              if (_4cdn_image(image1)) {
                with_4cdn_full_image(image1, (image2) => {
                  downloader.href = image2
                  fileThumb.href = image2
                })
              } else {
                downloader.href = thumbnail_cache.get(image1) || image1
                fileThumb.href = downloader.href
              }
              // fix dimensions of alt images
              const child = fileThumb.children[0]
              if (img.width > img.height) {
                child.style.width = fileThumb.closest(".opContainer") ? BIG_THUMBNAIL_SIZE : THUMBNAIL_SIZE
                child.style.height = "auto"
              } else {
                child.style.height = fileThumb.closest(".opContainer") ? BIG_THUMBNAIL_SIZE : THUMBNAIL_SIZE
                child.style.width = "auto"
              }
            }
          })
        }
      }
    }

    let it = 0

    for (const element of document.getElementsByClassName("fileThumb")) {
      // the last is necessary for those that don't have an extended filename
      const text_field = element.parentElement.children[0].children[0].title || // vanilla 4chan
            element.parentElement.children[0].children[0].text || // vanilla 4chan (truncated filename...)
            element.parentElement.children[0].children[0].children[0]?.children[0]?.children[1].innerText || // 4chanX
            element.parentElement.children[0].children[0].children[0]?.text /* 4chanX */ || ""
      const field_prefix = text_field.split(".")[0]
      const is_valid_MD5 = (x) => {
        const regexpr = /^[a-f0-9]{32}$/gi
        return regexpr.test(x)
      }
      const skip_MD5 = (element, maybe_md5sum) => {
        try {
          const md5 = Array.from(atob(element.children[0].dataset.md5), aChar => ('0' + aChar.charCodeAt(0).toString(16)).slice(-2)).join('')
          if (md5 === maybe_md5sum) {
            console.debug("third eye: Skipping md5sum " + md5 + " because it is the same as the image MD5")
            return true
          } else
            return false
        } catch (error) {
          console.error("third eye: skip_MD5 error: " + error + " (md5=" + maybe_md5sum + ")")
          return true
        }
      }
      // field_prefix !== "" for deleted files
      it++
      if (element.__thirdeye_prepared === undefined && field_prefix !== "" && !skip_MD5(element, field_prefix) && (is_valid_MD5(field_prefix) || (ENABLE_OEKAKI && (field_prefix.startsWith("oekaki--") || field_prefix.startsWith("oekakijpg--"))))) {
        element.__thirdeye_prepared = true
        // TODO
        const is_OP = (it === 1 || element.closest(".opContainer"))
        const thumbnail_size = is_OP ? BIG_THUMBNAIL_SIZE : THUMBNAIL_SIZE
        let item = localStorage.getItem(THIRD_EYE_MD5_CACHE_PREFIX+field_prefix)
        if (item === null) {
          if (field_prefix.startsWith("oekaki--")) {
            console.info("third eye: using oekaki (git.coom.tech/cunnysoft/oekaki) for file prefix " + field_prefix)
            const child = element.children[0]
            child.setAttribute("referrerpolicy", "no-referrer")
            set_element_src(child, "https://git.coom.tech/cunnysoft/oekaki/raw/branch/%e3%82%bb%e3%82%af%e3%82%b7%e3%83%bc%e3%81%aa%e5%a5%b3%e3%81%ae%e5%ad%90/" + field_prefix.split("oekaki--")[1] + ".png")
            child.onerror = () => {
              console.error("Main1: Error loading img with src", quote(child.src))
            }
            child.onload = () => {
              if (child.width > child.height) {
                child.style.width = thumbnail_size
                child.style.height = "auto"
              } else {
                child.style.height = thumbnail_size
                child.style.width = "auto"
              }
            }
            // we assume width:height ratio is the same for now
            add_events(element, child.src)
            // although .jpg files are not planned at the moment we'd like to make sure older clients support them in case they ever are
          } else if (field_prefix.startsWith("oekakijpg--")) {
            console.info("third eye: using oekaki jpg (git.coom.tech/cunnysoft/oekaki) for file prefix " + field_prefix)
            const child = element.children[0]
            child.setAttribute("referrerpolicy", "no-referrer")
            set_element_src(child, "https://git.coom.tech/cunnysoft/oekaki/raw/branch/%e3%82%bb%e3%82%af%e3%82%b7%e3%83%bc%e3%81%aa%e5%a5%b3%e3%81%ae%e5%ad%90/" + field_prefix.split("oekakijpg--")[1] + ".jpg")
            child.onerror = () => {
              console.error("Main2: Error loading img with src", quote(child.src))
            }
            child.onload = () => {
              if (child.width > child.height) {
                child.style.width = thumbnail_size
                child.style.height = "auto"
              } else {
                child.style.height = thumbnail_size
                child.style.width = "auto"
              }
            }
            // we assume width:height ratio is the same for now
            add_events(element, child.src)
          } else {
            const md5sum = field_prefix
            console.info("third eye: found valid md5 " + md5sum + ", running query")
            request_source(element, md5sum, thumbnail_size, is_OP)
          }
        } else {
          const md5sum = field_prefix
          item = JSON.parse(item)
          if (whitelisted_log(item, md5sum)) {
            console.debug("third eye: reusing cached file for md5 " + md5sum)
            const child = element.children[0]
            child.setAttribute("referrerpolicy", "no-referrer")
            cache_src(item.url, child.src)
            set_element_src(child, thumbnailize(item.url, item.preview_url, md5sum, is_OP))
            if (PRESERVE_THUMBNAIL_SIZE) {
              child.style.width = item.width+"px"
              child.style.height = item.height+"px"
            } else if (item.width > item.height) {
              child.style.width = thumbnail_size
              child.style.height = "auto"
            } else {
              child.style.height = thumbnail_size
              child.style.width = "auto"
            }
            add_events(element, item.url)
          }
        }
      } else {
        if (((performance.now() - time)/1000) >= 30) {
          time = performance.now()
          console.info("third eye: Skipping element with assigned 'prepared' field/invalid MD5 (delayed next log)")
        }
      }
    }
  }

  main() // required if no 4chanX

  // event handling
  const config = { attributes: false, childList: true, subtree: true }
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      main()
      break
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(document.getElementsByClassName("thread")[0], config)

})()

if (typeof exportFunction === "function") {

  const THIRD_EYE_CACHE_PREFIX = "__thirdeye"
  const THIRD_EYE_MD5_CACHE_PREFIX = "__thirdeye_md5__"
  const THIRD_EYE_MISC_CACHE_PREFIX = "__thirdeye_misc__"

  // exports for the client
  const clear_third_eye_cache = () => {
    for (const x in localStorage) {
      if (x.startsWith(THIRD_EYE_CACHE_PREFIX))
        localStorage.removeItem(x)
    }
  }

  const display_third_eye_cache = () => {
    for (const x in localStorage) {
      if (x.startsWith(THIRD_EYE_CACHE_PREFIX))
        console.info(x + " = " + localStorage[x])
    }
  }

  unsafeWindow.clear_third_eye_cache = exportFunction(clear_third_eye_cache, unsafeWindow)
  unsafeWindow.display_third_eye_cache = exportFunction(display_third_eye_cache, unsafeWindow)

  // more searchable
  unsafeWindow.third_eye_clear_cache = exportFunction(clear_third_eye_cache, unsafeWindow)
  unsafeWindow.third_eye_display_cache = exportFunction(display_third_eye_cache, unsafeWindow)

  unsafeWindow.third_eye_version = exportFunction(() => localStorage.getItem(THIRD_EYE_MISC_CACHE_PREFIX+"version"))

} else {

  const THIRD_EYE_CACHE_PREFIX = "__thirdeye"
  const THIRD_EYE_MD5_CACHE_PREFIX = "__thirdeye_md5__"
  const THIRD_EYE_MISC_CACHE_PREFIX = "__thirdeye_misc__"

  // exports for the client
  clear_third_eye_cache = (() => {
    for (const x in localStorage) {
      if (x.startsWith(THIRD_EYE_CACHE_PREFIX))
        localStorage.removeItem(x)
    }
  })

  // more searchable
  third_eye_clear_cache = clear_third_eye_cache

  display_third_eye_cache = (() => {
    for (const x in localStorage) {
      if (x.startsWith(THIRD_EYE_CACHE_PREFIX))
        console.info(x + " = " + localStorage[x])
    }
  })

  // more searchable
  third_eye_display_cache = display_third_eye_cache

  third_eye_version = (() => {
    return localStorage.getItem(THIRD_EYE_MISC_CACHE_PREFIX+"version")
  })
}
