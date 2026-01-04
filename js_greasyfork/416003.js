// ==UserScript==
// @name         Iwara Enhancement
// @name:zh-CN   Iwara增强
// @description  Please refer to the script's homepage for more information.
// @description:zh-CN 请参考脚本的主页以获取更多信息
// @noframes
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_info
// @grant        GM_addStyle
// @require      https://unpkg.com/jquery@3.6.0
// @require      https://unpkg.com/vue@3.2.20
// @require      https://unpkg.com/vue-i18n@9.2.0-beta.26
// @match        *://*.iwara.tv/*
// @namespace    https://github.com/guansss/userscripts
// @version      1.5
// @author       guansss
// @source       https://github.com/guansss/userscripts
// @supportURL   https://github.com/guansss/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/416003/Iwara%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/416003/Iwara%20Enhancement.meta.js
// ==/UserScript==
;(() => {
  "use strict"

  $

  const external_Vue_namespaceObject = Vue

  function onClickOutside(el, callback) {
    document.addEventListener("click", handler)

    function handler(e) {
      if (!el.contains(e.target)) {
        document.removeEventListener("click", handler)
        callback(e)
      }
    }
  }

  /**
   * MutationObserver that calls callback with just a single mutation.
   */
  class SimpleMutationObserver extends MutationObserver {
    // since calling `new NodeList()` is illegal, this is the only way to create an empty NodeList

    constructor(callback) {
      super((mutations) => {
        for (const mutation of mutations) if (this.callback(mutation)) break
      })
      this.callback = callback
    }

    /**
     * @param options.immediate - When observing "childList", immediately trigger a mutation with existing nodes.
     */
    observe(target, options) {
      super.observe(target, options)

      if (options && options.immediate && options.childList && target.childNodes.length)
        this.callback({
          target,
          type: "childList",
          addedNodes: target.childNodes,
          removedNodes: SimpleMutationObserver.emptyNodeList,
        })
    }
  }

  SimpleMutationObserver.emptyNodeList = document.querySelectorAll("#__absolutely_nonexisting")
  function hasClass(node, className) {
    var _classList
    return !!(
      null !== (_classList = node.classList) &&
      void 0 !== _classList &&
      _classList.contains(className)
    )
  }

  let log

  setLogger(console.log)

  function setLogger(logger) {
    log = logger.bind(console, `[${GM_info.script.name}]`)
  }

  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val
  }

  function parseAbbreviatedNumber(str) {
    const units = { k: 1e3, m: 1e6, b: 1e9 }

    let number = parseFloat(str)

    if (!isNaN(number)) {
      const unit = str.trim().slice(-1).toLowerCase()

      return number * (units[unit] || 1)
    }

    return NaN
  }

  function formatDate(date) {
    let delimiter = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/"
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ]
      .map((num) => String(num).padStart(2, "0"))
      .join(delimiter)
  }

  function formatError(e) {
    let fallback = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Unknown error"
    if ("string" === typeof e) return e || fallback

    if (null !== e && "object" === typeof e) {
      if (e instanceof Event && "error" === e.type) return "Failed to load resource"

      if (e.message) return e.message

      const str = String(e)
      return "[object Object]" === str ? fallback : str
    }

    return fallback
  }

  function adjustHexColor(color, amount) {
    return color.replace(/\w\w/g, (color) =>
      clamp(parseInt(color, 16) + amount, 0, 255)
        .toString(16)
        .padStart(2, "0")
    )
  }

  // written by ChatGPT
  function adjustAlpha(color, alpha) {
    if (alpha < 0 || alpha > 1) throw new Error("Alpha value must be between 0 and 1")

    let r, g, b

    if (color.startsWith("#")) {
      if (7 !== color.length) throw new Error("Invalid color format")

      r = parseInt(color.slice(1, 3), 16)
      g = parseInt(color.slice(3, 5), 16)
      b = parseInt(color.slice(5, 7), 16)
    } else if (color.startsWith("rgb")) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)

      if (!match) throw new Error("Invalid color format")

      r = parseInt(match[1], 10)
      g = parseInt(match[2], 10)
      b = parseInt(match[3], 10)
    } else throw new Error("Invalid color format")

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /**
   * Replaces characters that are forbidden in file systems.
   */
  function sanitizePath(path, illegalCharReplacement) {
    let keepDelimiters = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true
    path = path.replace(/[*:<>?|]/g, illegalCharReplacement)

    if (!keepDelimiters) path = path.replace(/[\\/]/g, illegalCharReplacement)

    return path
  }

  const external_VueI18n_namespaceObject = VueI18n

  const en_namespaceObject = JSON.parse(
    '{"language":"English","name":"Iwara Enhancement","description":"Multiple UI enhancements for better experience.","ui":{},"s":{"enabled":"Enabled","extra":"Extra settings","download":{"label":"Download","auto":{"label":"One-click Download","desc":"Automatically starts download when clicking the download button."},"resolution":{"label":"Preferred Resolution for Download"},"filename":{"label":"Filename","desc":"Filename template to use when downloading a video.<br>Each keyword should be surrounded by <b>{\'{ }\'}</b>.","preview":"Preview","key":{"id":"video\'s ID","title":"video\'s title","res":"video\'s resolution","author":"author\'s name","date":"date time when the download starts","up_date":"date time when the video was uploaded","date_ts":"DATE in timestamp format","up_date_ts":"UP_DATE in timestamp format"},"replace_illegal_char":"Replace characters that are disallowed in filename with:","tips":["Tips","You can use \\"/\\" in the filename to create subfolders, for example {AUTHOR}/{DATE}-{TITLE}.","If the filename doesn\'t work, check if you have any browser extensions that may interfere with the download, such as the Aria2 extension."],"warn":"Only works in Tampermonkey.","warn_tm":{"desc":"This feature requires Tampermonkey\'s download mode to be set to <b>Browser API</b>, please follow <a href=\'https://www.tampermonkey.net/faq.php#Q302\' target=\'_blank\' rel=\'noopener noreferrer\'>this guide↗</a> and refresh the page once done.","steps":[]}}},"ui":{"label":"UI","like_rate":{"label":"Like rate","desc":"Displays like rates in video and image list."},"highlight_threshold":{"label":"Highlight threshold","desc":"Highlights video and image items over certain like rate."},"highlight_bg":{"label":"Highlight opacity"},"widen_content":{"label":"Widen content","desc":"Widen the content area in video and image pages.","scale":"Additional scale (%)"}},"script":{"label":"Script","language":{"label":"Language"}}}}'
  )

  const zh_namespaceObject = JSON.parse(
    '{"language":"中文","name":"Iwara增强","description":"多种增强体验的界面优化","s":{"enabled":"启用","extra":"更多选项","download":{"label":"下载","auto":{"label":"一键下载","desc":"点击下载按钮时自动开始下载"},"resolution":{"label":"优先下载的分辨率"},"filename":{"label":"文件名","desc":"下载视频时使用的文件名模板<br>每个关键词必须使用 <b>{\'{ }\'}</b> 来包围","preview":"预览","key":{"id":"视频 ID","title":"视频标题","author":"作者名","res":"视频分辨率","date":"下载开始时的日期和时间","up_date":"视频发布时的日期和时间","date_ts":"DATE 的时间戳格式","up_date_ts":"UP_DATE 的时间戳格式"},"replace_illegal_char":"将文件名中的非法字符替换为:","tips":["提示","可以在文件名里使用\\"/\\"来创建文件夹，例如{AUTHOR}/{DATE}-{TITLE}","如果文件名不起作用，检查一下是否安装了与下载相关的浏览器插件，比如 Aria2 插件"],"warn":"该功能仅在 Tampermonkey 中可用","warn_tm":{"desc":"该功能需要启用 Tampermonkey 的<b>浏览器 API</b>下载模式，请按照以下步骤启用，或者查看<a href=\'https://www.tampermonkey.net/faq.php#Q302\' target=\'_blank\' rel=\'noopener noreferrer\'>官方指南↗</a>","steps":["进入 Tampermonkey 的设置面板，选择<b>设置</b>标签页","在<b>通用</b>里，设置<b>配置模式</b>为<b>高级<b>（或者<b>初学者</b>）","在<b>下载 BETA</b>里，设置<b>下载模式</b>为<b>浏览器 API</b>","在<b>下载 BETA</b>里，点击<b>保存</b>","如果请求权限的话，选择同意","刷新当前页面"]}}},"ui":{"label":"界面","like_rate":{"label":"喜爱率","desc":"在视频和图片列表里显示喜爱率"},"highlight_threshold":{"label":"高亮分界点","desc":"喜爱率高于此值的视频和图片将会被高亮显示"},"highlight_bg":{"label":"高亮透明度"},"widen_content":{"label":"加宽内容区域","desc":"加宽视频页和图片页的内容区域","scale":"额外缩放 (%)"}},"script":{"label":"脚本","language":{"label":"语言"}}}}'
  )

  /* harmony default export */ const i18n = { zh: zh_namespaceObject, en: en_namespaceObject }

  function createStorage(prefix, schema) {
    if (prefix) prefix += "."

    return {
      get(key) {
        return GM_getValue(prefix + key, schema[key])
      },
      set(key, val) {
        if ("function" === typeof val) val = val(this.get(key))

        GM_setValue(prefix + key, val)
      },
    }
  }

  const storage = createStorage("", {
    v: GM_info.script.version,
    locale: navigator.language,
    volume: 0.5,
    auto_down_enabled: true,
    preferred_res: "Source",
    filename: "{DATE} {TITLE} - {AUTHOR} ({ID})",
    illegal_char_replacement: "_",
    dark: false,
    like_rates: true,
    like_rate_highlight: 4,
    like_rate_highlight_opacity: 0.2,
    widen_content: true,
    widen_content_scale: 100,
  })

  const i18n_i18n = (0, external_VueI18n_namespaceObject.createI18n)({
    locale: storage.get("locale"),
    fallbackLocale: "en",
    messages: i18n,

    // disable warnings - I know what I'm doing!!
    silentFallbackWarn: true,
    silentTranslationWarn: true,
    warnHtmlInMessage: "off",
  })

  function matchLocale(locale) {
    return i18n_i18n.global.availableLocales.includes(locale)
      ? locale
      : i18n_i18n.global.availableLocales.find((loc) => locale.startsWith(loc)) || "en"
  }

  const locale = (0, external_Vue_namespaceObject.ref)(storage.get("locale"))

  ;(0, external_Vue_namespaceObject.watchEffect)(() => {
    i18n_i18n.global.locale = locale.value

    storage.set("locale", locale.value)
  })

  function useConfigSettings() {
    // locale that will actually be used, with fallback applied
    const activeLocale = (0, external_Vue_namespaceObject.computed)(() => matchLocale(locale.value))

    return { locale, activeLocale }
  }

  /* harmony default export */ function mitt(n) {
    return {
      all: (n = n || new Map()),
      on: function (t, e) {
        var i = n.get(t)
        i ? i.push(e) : n.set(t, [e])
      },
      off: function (t, e) {
        var i = n.get(t)
        i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []))
      },
      emit: function (t, e) {
        var i = n.get(t)
        i &&
          i.slice().map(function (n) {
            n(e)
          }),
          (i = n.get("*")) &&
            i.slice().map(function (n) {
              n(t, e)
            })
      },
    }
  }

  const ready = new Promise((resolve) => {
    if ("loading" === document.readyState)
      document.addEventListener("DOMContentLoaded", () => resolve())
    else resolve()
  })

  function once(emitter, event, listener) {
    const fn = (data) => {
      emitter.off(event, fn)
      listener(data)
    }

    emitter.on(event, fn)

    return fn
  }

  function setupPaging() {
    ready.then(() => {
      const appDiv = document.getElementById("app")

      if (!appDiv) {
        log("Missing app div.")
        return
      }

      log("Start observing pages.")

      const appObserver = new SimpleMutationObserver((mutation) => {
        detectPageChange(appDiv, mutation.addedNodes, "pageEnter")
        detectPageChange(appDiv, mutation.removedNodes, "pageLeave")
      })
      appObserver.observe(appDiv, { childList: true, immediate: true })
    })
  }

  const emitter = mitt()

  let currentClassName = ""

  emitter.on("pageEnter", (className) => (currentClassName = className))

  const ALL = "*"

  // page listener for iwara
  function page(id, enter) {
    const match = (() => {
      if (id === ALL) return () => id

      const ids = "string" === typeof id ? [id] : id
      const classes = ids.map((id) => `page-${id}`)

      return (className) => {
        const split = className.split(" ")
        const index = classes.findIndex((cls) => split.includes(cls))

        return ids[index]
      }
    })()

    function callIfMatch(listener) {
      return (className) => {
        const matchedID = match(className)

        if (void 0 !== matchedID)
          try {
            listener(matchedID)
          } catch (e) {
            log("Error executing page listener", e)
          }
      }
    }

    const onPageEnter = callIfMatch((matchedID) => {
      enter(matchedID, (onLeave) => {
        once(emitter, "pageLeave", callIfMatch(onLeave))
      })
    })

    emitter.on("pageEnter", onPageEnter)
  }

  function detectPageChange(appDiv, nodes, event) {
    if (nodes.length)
      // a valid class name will be like "page page-videoList", where "videoList" is the ID
      for (const node of nodes)
        if (hasClass(node, "page")) {
          // sometimes there are two (maybe more) "page" elements, and one of them contains only the "page" class,
          // we ignore it in this case
          const hasOtherPageElements =
            $(appDiv)
              .children(".page")
              .filter((_, e) => e !== node && !node.className.includes("page-")).length > 0

          if (!hasOtherPageElements) emitter.emit(event, node.className)
          break
        }
  }

  function cancelOnLeave(onLeave, promise) {
    onLeave(() => promise.cancel())
    return promise
  }
  let reactEventHandlersKey = ""

  function getReactEventHandlers(element) {
    if (reactEventHandlersKey) return element[reactEventHandlersKey]

    for (const key of Object.keys(element))
      if (key.startsWith("__reactEventHandlers$")) {
        reactEventHandlersKey = key
        return element[key]
      }
  }

  // sometimes I just don't want the script to depend on Lodash...
  function throttle(fn, timeout) {
    let timer = 0

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)
        args[_key] = arguments[_key]
      if (timer) return

      timer = setTimeout(() => {
        fn.apply(null, args)

        timer = 0
      }, timeout)
    }
  }

  /**
   * Periodically calls given function until the return value is truthy.
   * @returns A CancelablePromise that resolves with the function's return value when truthy.
   */
  function until(fn) {
    let interval = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
    let cancelOnReload = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true
    let cancelled = false

    if (cancelOnReload);

    const STOP = Symbol()

    const promise = new Promise((resolve, reject) => {
      const run = () => {
        if (cancelled) return STOP

        const result = fn()

        if (result) {
          resolve(result)
          return STOP
        }
      }

      const timerId = setInterval(() => {
        try {
          if (run() === STOP) clearInterval(timerId)
        } catch (e) {
          reject(e)
          clearInterval(timerId)
        }
      }, interval)
    })
    promise.cancel = () => (cancelled = true)

    return promise
  }

  /**
   * Periodically calls given function until the returned jQuery object is not empty.
   * @returns A CancelablePromise that resolves with the jQuery object.
   */
  function until$(fn) {
    let interval = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
    let cancelOnReload = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true
    return until(
      () => {
        const result = fn()

        if (result.length) return result
      },
      interval,
      cancelOnReload
    )
  }

  // a partial structure of the video data defined in iwara's video page,
  // including only the properties we need

  const FILENAME_KEYWORDS = [
    "ID",
    "TITLE",
    "RES",
    "AUTHOR",
    "DATE",
    "UP_DATE",
    "DATE_TS",
    "UP_DATE_TS",
  ]
  const RESOLUTIONS = ["Source", "540p", "360p"]

  const autoEnabled = (0, external_Vue_namespaceObject.ref)(storage.get("auto_down_enabled"))
  const filenameTemplate = (0, external_Vue_namespaceObject.ref)(storage.get("filename"))
  const illegalCharReplacement = (0, external_Vue_namespaceObject.ref)(
    storage.get("illegal_char_replacement")
  )
  const resolution = (0, external_Vue_namespaceObject.ref)(storage.get("preferred_res"))

  const videoInfo = (0, external_Vue_namespaceObject.reactive)({
    id: "",
    title: "",
    author: "",
    created: 0,
    size: 0,
    error: "",
  })
  const sources = (0, external_Vue_namespaceObject.reactive)([])
  const source = (0, external_Vue_namespaceObject.computed)(
    () =>
      sources.find((_ref) => {
        let { label } = _ref
        return label === resolution.value
      }) || sources[0]
  )

  // indicates whether the sources belong to current page
  const hasFreshSources = (0, external_Vue_namespaceObject.ref)(false)

  const filename = (0, external_Vue_namespaceObject.computed)(() => {
    try {
      if (!source.value) throw "Please open a video"

      return resolveFilename(filenameTemplate.value, source.value)
    } catch (e) {
      return `Unable to resolve filename (${formatError(e)})`
    }
  })

  ;(0, external_Vue_namespaceObject.watchEffect)(() =>
    storage.set("preferred_res", resolution.value)
  )
  ;(0, external_Vue_namespaceObject.watchEffect)(() =>
    storage.set("filename", filenameTemplate.value)
  )
  ;(0, external_Vue_namespaceObject.watchEffect)(() =>
    storage.set("auto_down_enabled", autoEnabled.value)
  )
  ;(0, external_Vue_namespaceObject.watchEffect)(() =>
    convertDownloadDropdown(void 0, autoEnabled.value)
  )

  function useDownloaderSettings() {
    return {
      FILENAME_KEYWORDS,
      RESOLUTIONS,
      autoDownEnabled: autoEnabled,
      resolution,
      filenameTemplate,
      filenamePreview: filename,
      illegalCharReplacement,
    }
  }

  page("video", async (pageID, onLeave) => {
    const videoActions = $(".page-video__actions").get(0)

    if (!videoActions) {
      log("Could not find video actions.")
      return
    }

    onLeave(() => {
      // prevent unexpected downloads
      hasFreshSources.value = false
    })

    const $downloadButton = await cancelOnLeave(
      onLeave,
      until$(() => $(".page-video__actions .downloadButton"))
    )

    updateVideoInfo(videoActions)
    updateSources($downloadButton.closest(".dropdown").get(0))

    if (autoEnabled.value) convertDownloadDropdown($downloadButton.get(0), true)
  })

  function updateVideoInfo(videoActions) {
    try {
      // FIXME: reading the prop by a path is quite unreliable, any improvement?
      const video = getReactEventHandlers(videoActions).children[1].props.video

      videoInfo.id = video.id
      videoInfo.title = video.title
      videoInfo.created = new Date(video.createdAt).getTime()
      videoInfo.author = video.user.name
      videoInfo.size = video.file.size
    } catch (e) {
      log(e)
      videoInfo.error = e + ""
    }
  }

  function updateSources(downloadDropdown) {
    const newSources = $(downloadDropdown)
      .find(".dropdown__content a")
      .map(function () {
        const url = this.href
        const label = this.innerText

        return { url, label }
      })
      .get()

    if (!newSources.length) return

    sources.splice(0, sources.length, ...newSources)

    hasFreshSources.value = true
  }

  function convertDownloadDropdown(downloadButton, enabled) {
    const $button = downloadButton ? $(downloadButton) : $(".downloadButton")
    const $dropdown = $button.closest(".dropdown")

    if (!$dropdown.length) return

    const rawButtonText = $button.text().replace(/\s*\(.*\)/, "")

    if (enabled) {
      var _source$value
      if (!$dropdown.data("converted"))
        $dropdown
          .data("converted", true)
          .on("click", function () {
            download(this)
          })
          .children(".dropdown__content")
          .css("display", "none")

      const resolution =
        null === (_source$value = source.value) || void 0 === _source$value
          ? void 0
          : _source$value.label

      $button.text(rawButtonText + (resolution ? ` (${resolution})` : ""))
    } else {
      $dropdown
        .data("converted", false)
        .off("click")
        .children(".dropdown__content")
        .css("display", "")
      $button.text(rawButtonText)
    }
  }

  function download(downloadDropdown) {
    try {
      if (!hasFreshSources.value) throw new Error("No sources found in current page.")
      if (!source.value) throw new Error("Missing source.")

      const $downloadButton = $(downloadDropdown).find(".downloadButton")

      const filename = resolveFilename(filenameTemplate.value, source.value)

      log("Downloading:", filename, source.value.url, GM_info.downloadMode)

      if ("browser" === GM_info.downloadMode) {
        setDownloadButtonEnabled(false)

        if (false);

        GM_download({
          url: source.value.url,
          name: filename,
          onload: () => downloadEnded("onload"),
          onerror: (e) => downloadEnded("onerror", e),
          ontimeout: () => downloadEnded("ontimeout"),
        })
      } else {
        const a = document.createElement("a")
        a.href = source.value.url
        a.download = filename
        a.click()
      }

      function setDownloadButtonEnabled(enabled) {
        if (enabled) {
          // TODO: properly disable the button
          $(downloadDropdown).css("pointer-events", "")
          $downloadButton.css("background-color", "")
        } else {
          $(downloadDropdown).css("pointer-events", "none")
          $downloadButton.css("background-color", "var(--primary-dark)")
        }
      }

      function downloadEnded(type, e) {
        setDownloadButtonEnabled(true)

        if ("ontimeout" === type) e = { error: "timed_out" }

        if (e && e.error) {
          log(e)
          printDownloadMessage(
            `Download Error (${e.error}): ${(e.details && e.details.current) || "No info"}`
          )
        }
      }
    } catch (e) {
      log(e)
      printDownloadMessage(e + "")
    }
  }

  function resolveFilename(template, source) {
    if (videoInfo.error) throw new Error("Broken video info: " + videoInfo.error)

    const replacements = {
      ID: videoInfo.id,
      TITLE: videoInfo.title,
      RES: source.label,
      AUTHOR: videoInfo.author,
      DATE: formatDate(new Date(), ""),
      DATE_TS: new Date().getTime() + "",
      UP_DATE: formatDate(new Date(videoInfo.created), ""),
      UP_DATE_TS: videoInfo.created + "",
    }

    const wrappedKeywords = FILENAME_KEYWORDS.map((k) => `{${k}}`)
    const regex = new RegExp(`(${wrappedKeywords.join("|")})`, "g")

    const basename = template.replace(regex, (match) => {
      const keyword = match.slice(1, -1)
      const value = replacements[keyword]

      // remove path delimiters in keyword values
      return value.replace(/[/\\]/g, illegalCharReplacement.value)
    })

    const ext = source.url.slice(source.url.lastIndexOf(".")).replace(/[^A-Za-z0-9.]/g, "")

    const filename = basename + ext

    return sanitizePath(filename, illegalCharReplacement.value)
  }

  function printDownloadMessage(msg) {
    $(".page-video__bottom")
      .css("flex-wrap", "wrap")
      .append(`<div style="flex: 100% 0 0">${msg}</div>`)
  }

  const likeRateEnabled = (0, external_Vue_namespaceObject.ref)(storage.get("like_rates"))
  const highlightThreshold = (0, external_Vue_namespaceObject.ref)(
    storage.get("like_rate_highlight")
  )
  const highlightOpacity = (0, external_Vue_namespaceObject.ref)(
    storage.get("like_rate_highlight_opacity")
  )

  const likeRateClass = "enh-like-rate"
  const highlightClass = "enh-highlight"

  ready.then(updateHighlightOpacity)

  ;(0, external_Vue_namespaceObject.watchEffect)(() => {
    storage.set("like_rates", likeRateEnabled.value)

    if (likeRateEnabled.value) {
      document.body.classList.add("enh-show-like-rates")
      $(".videoTeaser, .imageTeaser").each((i, teaser) => processTeaser(teaser))
    } else {
      document.body.classList.remove("enh-show-like-rates")
      $("." + highlightClass).removeClass(highlightClass)
    }
  })

  ;(0, external_Vue_namespaceObject.watchEffect)(() => {
    storage.set("like_rate_highlight", highlightThreshold.value)

    $(".videoTeaser, .imageTeaser").each((i, teaser) => processTeaser(teaser))
  })

  ;(0, external_Vue_namespaceObject.watchEffect)(() => {
    storage.set("like_rate_highlight_opacity", highlightOpacity.value)

    updateHighlightOpacity()
  })

  function useTeaserSettings() {
    return { likeRateEnabled, highlightThreshold, highlightOpacity }
  }

  page(
    ["home", "videoList", "imageList", "subscriptions", "profile", "video", "image"],
    async (pageID, onLeave) => {
      const teaserObserver = new SimpleMutationObserver((mutation) =>
        mutation.addedNodes.forEach(detectColumn)
      )

      onLeave(() => {
        teaserObserver.disconnect()
      })

      const teaserBatcher = new TeaserBatcher()

      if (["home", "profile", "image"].includes(pageID))
        [".videoTeaser", ".imageTeaser"].forEach(async (selector) => {
          const $teasers = await until$(() => $(selector), 200)

          requestProcessTeasers($teasers.toArray())
        })
      else if ("video" === pageID) {
        const selectors = [".moreFromUser", ".moreLikeThis"].flatMap((parentCls) =>
          [".videoTeaser", ".imageTeaser"].map((cls) => `${parentCls} ${cls}`)
        )

        selectors.forEach(async (selector) => {
          const $teasers = await until$(() => $(selector), 200)

          requestProcessTeasers($teasers.toArray())
        })
      } else {
        const $teasers = await until$(
          () => $(".videoTeaser:first-of-type, .imageTeaser:first-of-type"),
          200
        )

        detectRow($teasers.closest(".row")[0])
      }

      function detectRow(row) {
        teaserObserver.observe(row, { childList: true, immediate: true })
      }

      function detectColumn(column) {
        const { firstChild } = column

        if (
          !!firstChild &&
          (hasClass(firstChild, "videoTeaser") || hasClass(firstChild, "imageTeaser"))
        )
          requestProcessTeasers([firstChild])
      }

      function requestProcessTeasers(teasers) {
        teasers.forEach((teaser) => teaserBatcher.add(teaser))
        teaserBatcher.run(processTeaser)
      }
    }
  )

  class TeaserBatcher {
    constructor() {
      this.teasers = []

      this.run = throttle((callback) => {
        let lastError

        try {
          this.teasers.forEach(callback)
        } catch (e) {
          // only record the last error so the console won't blow up
          lastError = e
        }

        if (lastError) log("Failed to process teasers", lastError)

        this.teasers.length = 0
      }, 0)
    }

    add(teaser) {
      this.teasers.push(teaser)
    }
  }

  function processTeaser(teaser) {
    const viewsLabel = $(teaser).find(".views")
    const likesLabel = $(teaser).find(".likes")

    let likePercentage

    const likeRateLabel = viewsLabel.children("." + likeRateClass)

    if (likeRateLabel.length) likePercentage = +likeRateLabel.text().trim().replace("%", "")
    else {
      const views = parseAbbreviatedNumber(viewsLabel.text().trim())
      const likes = parseAbbreviatedNumber(likesLabel.text().trim())

      likePercentage = Math.round((100 * likes) / views)

      const display = Number.isFinite(likePercentage) ? likePercentage + "%" : "/"

      // prettier-ignore
      viewsLabel.children().eq(0).clone().addClass(likeRateClass).text(display).prependTo(viewsLabel)
    }

    if (likePercentage >= highlightThreshold.value && likeRateEnabled.value)
      teaser.classList.add(highlightClass)
    else teaser.classList.remove(highlightClass)
  }

  function updateHighlightOpacity() {
    const color = getComputedStyle(document.body).getPropertyValue("--primary").trim()

    // color will be empty before the page is fully loaded
    if (color)
      document.body.style.setProperty("--ehg-hl-bg", adjustAlpha(color, highlightOpacity.value))
  }

  const widenContentEnabled = (0, external_Vue_namespaceObject.ref)(storage.get("widen_content"))
  const widenContentScale = (0, external_Vue_namespaceObject.ref)(
    storage.get("widen_content_scale")
  )

  ;(0, external_Vue_namespaceObject.watch)(widenContentEnabled, (enabled) =>
    storage.set("widen_content", enabled)
  )
  ;(0, external_Vue_namespaceObject.watch)(widenContentScale, (scale) =>
    storage.set("widen_content_scale", scale)
  )

  function useWidenContentSettings() {
    return { widenContentEnabled, widenContentScale }
  }

  page(["video", "image"], (pageID, onLeave) => {
    const mediaArea = $(".page-video__player, .page-video__slideshow").get(0)

    if (!mediaArea) {
      log(`${"video" === pageID ? "video" : "slideshow"} area not found.`)
      return
    }

    const sidebar = $(".page-video__sidebar").get(0)

    if (!sidebar) {
      log("sidebar not found.")
      return
    }

    const col = $(mediaArea).closest(".col-12").get(0)
    const row = $(mediaArea).closest(".row").get(0)
    const container = $(row).closest(".content").get(0)

    onLeave((0, external_Vue_namespaceObject.watchEffect)(() => updateResize()))

    function updateResize(entries) {
      if (widenContentEnabled.value) {
        let containerWidth = 0
        let rowWidth = 0
        let colWidth = 0
        let mediaHeight = 0

        if (entries) {
          for (const entry of entries)
            if (entry.target === mediaArea) mediaHeight = entry.contentRect.height
            else if (entry.target === col) colWidth = entry.contentRect.width
            else if (entry.target === row) rowWidth = entry.contentRect.width
            else if (entry.target === container) containerWidth = entry.contentRect.width
        } else {
          containerWidth = container.offsetWidth
          rowWidth = row.offsetWidth
          colWidth = col.offsetWidth
          mediaHeight = mediaArea.offsetHeight
        }

        if (containerWidth > 0 && rowWidth > 0 && colWidth > 0) {
          const scale = widenContentScale.value / 100
          const mediaWidth = Math.min(rowWidth * scale, containerWidth)

          mediaArea.style.marginLeft = `${(rowWidth - mediaWidth) / 2}px`
          mediaArea.style.marginRight = `${(rowWidth - mediaWidth) / 2 - (rowWidth - colWidth)}px`
        }

        if (mediaHeight > 0) sidebar.style.marginTop = `${mediaArea.offsetTop + mediaHeight}px`
      } else {
        mediaArea.style.marginLeft = ""
        mediaArea.style.marginRight = ""
        sidebar.style.marginTop = ""
      }
    }

    const observer = new ResizeObserver(updateResize)

    observer.observe(mediaArea)
    observer.observe(row)
    observer.observe(container)

    onLeave(() => {
      observer.disconnect()
    })
  })

  // extracted by mini-css-extract-plugin
  /* harmony default export */ const Settings_module = {
    switch: "Settings-module__switch--qcsG",
    settings: "Settings-module__settings--alpJ",
    active: "Settings-module__active--iMRv",
    disabled: "Settings-module__disabled--vvjv",
    header: "Settings-module__header--s2Rw",
    title: "Settings-module__title--aDU_",
    view: "Settings-module__view--dY2E",
    sectionHeader: "Settings-module__section-header--Xy_I",
    fieldLabel: "Settings-module__field-label--O5EA",
    labelBlock: "Settings-module__label-block--EYVa",
    labelInline: "Settings-module__label-inline--v3DK",
    panel: "Settings-module__panel--PuCY",
    warn: "Settings-module__warn--KbCV",
  }

  // recommended vscode plugin for syntax highlighting: https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html
  // language=HTML
  const template = /* html */ `
    <div class='text text--text text--bold'>E</div>



    <div v-if='visible' :class='css.settings' @click.stop>
        <header :class='css.header'>
            <h2 :class='css.title'>{{ $t('name') }} v${GM_info.script.version}</h2>
        </header>
        <nav>
            <ul>
                <li
                    v-for='tab, i in tabs'
                    :class='{ [css.active]: i === tabIndex }'
                    @click='tabIndex = i'
                >
                    {{ $t(tab.name) }}
                </li>
            </ul>
        </nav>
        <div v-if='tabVal === "ui"' :class='css.view'>
            <h2 :class='css.sectionHeader'>{{ $t('s.ui.label') }}</h2>



            <h3 :class='css.fieldLabel'>{{ $t('s.ui.like_rate.label') }}</h3>
            <p v-html='$t("s.ui.like_rate.desc")'></p>
            <p>
                <label :class='css.labelBlock'>
                    {{ $t('s.enabled') }}
                    <input type='checkbox' v-model='likeRateEnabled'>
                </label>
            </p>



            <h3 :class='css.fieldLabel'>{{ $t('s.ui.highlight_threshold.label') }}</h3>
            <p v-html='$t("s.ui.highlight_threshold.desc")'></p>
            <p>
                <input type='number' step='0.1' min='0' max='100' v-model='highlightThreshold'>
            </p>
            <h3 :class='css.fieldLabel'>{{ $t('s.ui.highlight_bg.label') }}</h3>
            <p>
                <input type="range" min="0" max="1" step="0.01" v-model='highlightOpacity'>
            </p>



            <h3 :class='css.fieldLabel'>{{ $t('s.ui.widen_content.label') }}</h3>
            <p v-html='$t("s.ui.widen_content.desc")'></p>
            <p>
                <label :class='css.labelBlock'>
                    {{ $t('s.enabled') }}
                    <input type='checkbox' v-model='widenContentEnabled'>
                </label>
            </p>
            <p>
                <label :class='css.labelBlock'>
                    {{ $t('s.ui.widen_content.scale') }}
                    <input type='number' step='1' min='10' max='500' :value='widenContentScale' @change='widenContentScale = Math.round($event.target.value)'>
                </label>
            </p>
        </div>
        <div v-else-if='tabVal === "download"' :class='css.view'>
            <h2 :class='css.sectionHeader'>{{ $t('s.download.label') }}</h2>



            <h3 :class='css.fieldLabel'>{{ $t('s.download.auto.label') }}</h3>
            <p v-html='$t("s.download.auto.desc")'></p>
            <p>
                <label :class='css.labelBlock'>
                    {{ $t('s.enabled') }}
                    <input type='checkbox' v-model='autoDownEnabled'>
                </label>
            </p>



            <h3 :class='css.fieldLabel'>{{ $t('s.download.resolution.label') }}</h3>
            <p>
                <label v-for='res in RESOLUTIONS' :class='css.labelInline'>
                    <input type='radio' name='res' :value='res' v-model='resolution'>
                    {{ res }}
                </label>
            </p>



            <h3 :class='css.fieldLabel'>{{ $t('s.download.filename.label') }}</h3>
            <p v-if='!downloadMode' v-html='$t("s.download.filename.warn")'></p>
            <div v-else-if='downloadMode !== "browser"' :class='[css.panel, css.warn]'>
                <p v-html='$t("s.download.filename.warn_tm.desc")'></p>
                <ol v-if='$tm("s.download.filename.warn_tm.steps").length'>
                    <li v-for='step in $tm("s.download.filename.warn_tm.steps")'><p v-html='step'></p></li>
                </ol>
            </div>



            <p v-html='$t("s.download.filename.desc")'></p>



            <div :class='css.keywords'>
                <table :class='css.keywordTable'>
                    <tr v-for='kw in FILENAME_KEYWORDS'>
                        <th>{{ kw }}</th>
                        <td>{{ $t('s.download.filename.key.' + kw.toLowerCase()) }}</td>
                    </tr>
                </table>
            </div>
            <details>
                <summary>{{ $t('s.extra') }}</summary>
                <p>
                    {{ $t('s.download.filename.replace_illegal_char') }}
                    <input type='text' v-model='illegalCharReplacement'>
                    {{ '*miku*miku:dance??.mp4 -> ' }} {{ sanitizePath('*miku*miku:dance??.mp4', illegalCharReplacement) }}
                </p>
            </details>
            <input type='text' v-model='filenameTemplate'>
            <p>{{ $t('s.download.filename.preview') + ': ' + filenamePreview }}</p>
            <div :class='css.panel'>
                <p><b>{{ $tm('s.download.filename.tips')[0] }}</b></p>
                <ul>
                    <li v-for='tip in $tm("s.download.filename.tips").slice(1)'><p v-html='tip'></p></li>
                </ul>
            </div>
        </div>
        <div v-if='tabVal === "script"' :class='css.view'>
            <h2 :class='css.sectionHeader'>{{ $t('s.script.label') }}</h2>



            <h3 :class='css.fieldLabel'>{{ $t('s.script.language.label') }}</h3>
            <p>
                <label v-for='loc in $i18n.availableLocales' :class='css.labelInline'>
                    <input type='radio' name='loc' :value='loc' :checked='activeLocale === loc' @change='locale = loc'>
                    {{ $t('language', loc) }}
                </label>
            </p>
        </div>
    </div>
`

  function setup() {
    const tabs = [
      { name: "s.ui.label", val: "ui" },
      { name: "s.download.label", val: "download" },
      { name: "s.script.label", val: "script" },
    ]
    const tabIndex = (0, external_Vue_namespaceObject.ref)(0)
    const tabVal = (0, external_Vue_namespaceObject.computed)(
      () => tabs[tabIndex.value] && tabs[tabIndex.value].val
    )
    const visible = (0, external_Vue_namespaceObject.ref)(false)

    const onClickContainer = () => {
      visible.value = !visible.value

      if (visible.value) onClickOutside(settingsContainer, () => (visible.value = false))
    }

    settingsContainer.addEventListener("click", onClickContainer)

    ;(0, external_Vue_namespaceObject.onBeforeUnmount)(() => {
      settingsContainer.removeEventListener("click", onClickContainer)
    })

    return {
      css: Settings_module,
      tabs,
      tabIndex,
      tabVal,
      visible,
      downloadMode: GM_info.downloadMode,
      sanitizePath,
      ...useDownloaderSettings(),
      ...useConfigSettings(),
      ...useTeaserSettings(),
      ...useWidenContentSettings(),
    }
  }

  const SETTINGS_ID = "enh-settings"

  const settingsContainer = $(
    `<div id="${SETTINGS_ID}" class='header__link ${Settings_module["switch"]}'></div>`
  )[0]

  let app

  page(ALL, (pageID, onLeave) => {
    const destination = $(
      ".page .header__content:first-of-type .dropdown:last-of-type, a[href='/register']"
    )[0]

    if (destination) {
      // destination element will be destroyed everytime the page changes,
      // so we need to insert the container after every page change
      destination.before(settingsContainer)

      // lazy-init the app
      if (!app) {
        app = (0, external_Vue_namespaceObject.createApp)({ template, setup })

        app.use(i18n_i18n)

        if (true)
          // pending fix https://github.com/vuejs/core/pull/5197
          // @ts-ignore
          unsafeWindow.Vue = Vue

        app.mount(settingsContainer)

        log("Settings view initialized")
      }
    } else log("Could not insert settings view: container not found.")
  })

  // prevent Sentry from tracking the logging
  setLogger(console.log.__sentry_original__ || console.log)

  const patchedFlag = "__enhPatched"

  page(["video"], async (pageID, onLeave) => {
    const timerPromise = until(() => {
      const player = getPlayer()

      if (player) {
        fixResolution(player)

        if (!(patchedFlag in player)) {
          player[patchedFlag] = true
          preventVolumeScrolling(player)
        }
      }
    }, 500)

    onLeave(() => timerPromise.cancel())

    function getPlayer() {
      var _$$get
      return null === (_$$get = $(".page-video__player .video-js").get(0)) || void 0 === _$$get
        ? void 0
        : _$$get.player
    }

    function preventVolumeScrolling(player) {
      const originalGet = WeakMap.prototype.get

      // hook WeakMap.get() to get the event data
      // https://github.com/videojs/video.js/blob/2b0df25df332dceaab375327887f0721ca8d21d0/src/js/utils/events.js#L271
      WeakMap.prototype.get = function (key) {
        const value = originalGet.call(this, key)

        try {
          var _data$handlers
          const data = value

          if (
            null !== data &&
            void 0 !== data &&
            null !== (_data$handlers = data.handlers) &&
            void 0 !== _data$handlers &&
            _data$handlers.mousewheel
          ) {
            log(`removing ${data.handlers.mousewheel.length} mousewheel handler(s) from Player`)

            // the listeners are bound functions and cannot be checked with toString(),
            // so we have to remove all mousewheel handlers
            delete data.handlers.mousewheel
          }
        } catch (e) {
          log("error:", e)
        } finally {
          return value
        }
      }

      // trigger the hook by adding an arbitrary event listener
      player.on("__dummy", () => {})
      player.off("__dummy")

      WeakMap.prototype.get = originalGet

      const originalOn = player.on

      // prevent adding new mousewheel listeners
      player.on = function (targetOrType) {
        if ("mousewheel" === targetOrType) {
          log("prevented adding mousewheel listener")
          return
        }

        for (
          var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
          _key < _len;
          _key++
        )
          rest[_key - 1] = arguments[_key]
        return originalOn.call(this, targetOrType, ...rest)
      }
    }

    function fixResolution(player) {
      const targetSource = getTargetSource(player)

      if (targetSource && targetSource.src !== player.src()) {
        log(`setting resolution to ${targetSource.name}: ${targetSource.src}`)
        player.src(targetSource)
      }
    }

    function getTargetSource(player) {
      const sources = player.currentSources()

      if (!sources.length) return

      const selectedResName = localStorage.getItem("player-resolution")
      const source = sources.find((s) => s.name === selectedResName)

      if (source) return source

      log(`error: source not found for ${selectedResName}`)

      return
    }
  })

  // this "bg" is covering the video player and preventing player from entering fullscreen mode by double-clicks
  GM_addStyle(`
.videoPlayer__bg {
  pointer-events: none;
}
`)

  const state = (0, external_Vue_namespaceObject.reactive)({ theme: "light" })

  setInterval(() => {
    state.theme = localStorage.theme
  }, 1e3)

  ;(0, external_Vue_namespaceObject.watchEffect)(updateTheme)

  function updateTheme() {
    const theme = state.theme
    const adjustmentSign = "light" === theme ? -1 : 1
    const bodyColor = getComputedStyle(document.body).getPropertyValue("--body")

    document.body.style.setProperty(
      "--enh-body-focus",
      adjustHexColor(bodyColor, 15 * adjustmentSign)
    )
    document.body.style.setProperty(
      "--enh-body-highlight",
      adjustHexColor(bodyColor, 30 * adjustmentSign)
    )

    const darkClass = "enh-dark"

    if ("dark" === theme) document.body.classList.add(darkClass)
    else document.body.classList.remove(darkClass)
  }

  async function main() {
    document.body.classList.add("enh-body")

    setupPaging()
  }

  main()
})()

GM_addStyle(`
.Settings-module__switch--qcsG {
  cursor: pointer;
}

.Settings-module__settings--alpJ {
  position: absolute;
  z-index: 1000;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: calc(100vh - 65px);
  overflow: auto;
  background: var(--body);
  font-size: 14px;
  border: 2px solid var(--primary);
  border-top: none;
  cursor: default;
}

.Settings-module__settings--alpJ nav {
    padding: 0 16px;
    border-bottom: 1px solid var(--enh-body-highlight);
  }

.Settings-module__settings--alpJ nav ul {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
    }

.Settings-module__settings--alpJ nav li {
      padding: 8px 16px;
      list-style-type: none;
      cursor: pointer;
    }

.Settings-module__settings--alpJ nav li:hover {
        background: var(--enh-body-focus);
      }

.Settings-module__settings--alpJ nav li.Settings-module__active--iMRv {
        background: var(--enh-body-highlight);
      }

.Settings-module__settings--alpJ details {
    border: 1px solid var(--enh-body-highlight);
  }

.Settings-module__settings--alpJ details > * {
      padding: 0 8px;
    }

.Settings-module__settings--alpJ p,
  .Settings-module__settings--alpJ summary {
    color: var(--muted);
  }

.Settings-module__settings--alpJ p {
    margin-top: 0;
    margin-bottom: 8px;
  }

.Settings-module__settings--alpJ a {
    font-weight: bold;
    cursor: pointer;
  }

.Settings-module__settings--alpJ ol,
  .Settings-module__settings--alpJ ul {
    padding-left: 20px;
  }

.Settings-module__settings--alpJ table {
    margin: 8px 0;
    width: 100%;
    background: var(--enh-body-focus);
    border: 1px solid var(--enh-body-highlight);
    border-collapse: collapse;
  }

.Settings-module__settings--alpJ th {
    text-align: right;
  }

.Settings-module__settings--alpJ th,
  .Settings-module__settings--alpJ td {
    padding: 4px 8px;
    border: 1px solid var(--enh-body-highlight);
  }

.Settings-module__settings--alpJ label,
  .Settings-module__settings--alpJ summary {
    cursor: pointer;
  }

.Settings-module__settings--alpJ label:hover, .Settings-module__settings--alpJ summary:hover {
      background: var(--enh-body-focus);
    }

.Settings-module__settings--alpJ label input, .Settings-module__settings--alpJ summary input {
      cursor: pointer;
    }

.Settings-module__settings--alpJ label.Settings-module__disabled--vvjv, .Settings-module__settings--alpJ summary.Settings-module__disabled--vvjv {
      cursor: not-allowed;
    }

.Settings-module__settings--alpJ label.Settings-module__disabled--vvjv input, .Settings-module__settings--alpJ summary.Settings-module__disabled--vvjv input {
        cursor: not-allowed;
      }

.Settings-module__settings--alpJ input[type="text"] {
    outline: none !important;
  }

.Settings-module__settings--alpJ input[type="text"] {
    margin: 8px 0;
    width: 100%;
    padding: 8px;
    background: var(--enh-body-focus);
    color: var(--text);
    border: 2px solid var(--enh-body-highlight);
    border-radius: 3px;
  }

.Settings-module__settings--alpJ input[type="text"]:hover,
    .Settings-module__settings--alpJ input[type="text"]:focus {
      background: var(--enh-body-highlight);
    }

.Settings-module__header--s2Rw {
  padding: 0 16px;
}

.Settings-module__title--aDU_ {
  margin-top: 4px;
}

.Settings-module__view--dY2E {
  padding: 16px;
}

.Settings-module__section-header--Xy_I {
  margin-bottom: 16px;
}

.Settings-module__field-label--O5EA {
  position: relative;
  margin: 16px 0;
  padding-top: 16px;
}

.Settings-module__field-label--O5EA:not(:first-of-type) {
    border-top: 1px solid var(--enh-body-highlight);
  }

.Settings-module__label-block--EYVa {
  display: flex;
  padding: 8px 8px 8px 0;
}

.Settings-module__label-block--EYVa input {
    margin-left: auto;
  }

.Settings-module__label-inline--v3DK {
  display: inline-flex;
  padding: 8px 8px 8px 0;
}

.Settings-module__label-inline--v3DK:not(:first-child) {
    padding-left: 8px;
  }

.Settings-module__label-inline--v3DK:not(:last-child) {
    margin-right: 8px;
  }

.Settings-module__panel--PuCY {
  margin-bottom: 8px;
  padding: 8px;
  background: var(--enh-body-focus);
}

.Settings-module__warn--KbCV {
  background-color: #e9db89;
}

.enh-dark .Settings-module__warn--KbCV {
    background-color: #594c00;
  }

.enh-body {
  --ehg-hl-bg: rbga(0, 0, 0, 0);
}

#enh-settings {
  position: relative;
}

#enh-settings * {
    box-sizing: border-box;
  }

.enh-like-rate {
  display: none;
}

.enh-show-like-rates .videoTeaser .views, .enh-show-like-rates .imageTeaser .views {
    }

.enh-show-like-rates .videoTeaser .enh-like-rate, .enh-show-like-rates .imageTeaser .enh-like-rate {
      display: block;
    }

.enh-show-like-rates .videoTeaser .enh-like-rate + .text, .enh-show-like-rates .imageTeaser .enh-like-rate + .text {
        display: none;
      }

.enh-show-like-rates .page-start__subscriptions,
  .enh-show-like-rates .page-start__videos,
  .enh-show-like-rates .page-start__images {
    position: relative;
    z-index: 0;
  }

/* for all the affected pages, check out process-teaser.ts */
.enh-highlight:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -8px;
    bottom: 7px;
    left: 7px;
    right: 7px;
    background: var(--ehg-hl-bg);
  }
.page-video .enh-highlight:before,
    .page-image .enh-highlight:before {
      content: none;
    }
.page-profile .enh-highlight,
  .page-subscriptions .enh-highlight {
    position: relative;
  }
.page-profile .enh-highlight:before, .page-subscriptions .enh-highlight:before {
      top: -6px;
      bottom: -6px;
      left: -6px;
      right: -6px;
    }
.page-video .enh-highlight,
  .page-image .enh-highlight {
    background: var(--ehg-hl-bg);
  }

`)
