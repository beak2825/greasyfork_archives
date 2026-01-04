// ==UserScript==
// @name                 Hacker News Apps Switcher
// @name:zh-CN           Hacker News 网站切换器
// @namespace            https://www.pipecraft.net/
// @homepage             https://github.com/dev-topics-only/hacker-news-apps-switcher#readme
// @supportURL           https://github.com/dev-topics-only/hacker-news-apps-switcher/issues
// @version              0.0.4
// @description          Open Hacker News links on the favorite apps
// @description:zh-CN    选择其他 HN 网站打开 Hacker News 链接
// @icon                 https://icons.pipecraft.net/favicons/64/news.ycombinator.com/favicon.ico
// @author               Pipecraft
// @license              MIT
// @match                https://*/*
// @match                http://*/*
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/462865/Hacker%20News%20Apps%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/462865/Hacker%20News%20Apps%20Switcher.meta.js
// ==/UserScript==
//
;(() => {
  "use strict"
  var doc = document
  var $ = (element, selectors) =>
    element && typeof element === "object"
      ? element.querySelector(selectors)
      : doc.querySelector(element)
  var $$ = (element, selectors) =>
    element && typeof element === "object"
      ? [...element.querySelectorAll(selectors)]
      : [...doc.querySelectorAll(element)]
  var createElement = (tagName, attributes) => {
    const element = doc.createElement(tagName)
    if (attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (name === "textContent") {
            element[name] = value
          } else if (name === "style") {
            setStyle(element, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return () => 0
    }
    if (typeof type === "object") {
      const removers = []
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
          removers.push(() => element.removeEventListener(type1, type[type1]))
        }
      }
      return () => {
        for (const remover of removers) remover()
      }
    }
    if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
      return () => {
        element.removeEventListener(type, listener, options)
      }
    }
  }
  var getAttribute = (element, name) =>
    element ? element.getAttribute(name) : null
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "")
      }
    }
  }
  var toStyleMap = (styleText) => {
    styleText = noStyleSpace(styleText)
    const map = {}
    const keyValues = styleText.split("}")
    for (const keyValue of keyValues) {
      const kv = keyValue.split("{")
      if (kv[0] && kv[1]) {
        map[kv[0]] = kv[1]
      }
    }
    return map
  }
  var noStyleSpace = (text) => text.replace(/\s*([^\w-!])\s*/gm, "$1")
  var createSetStyle = (styleText) => {
    const styleMap = toStyleMap(styleText)
    return (element, value, overwrite) => {
      if (typeof value === "object") {
        setStyle(element, value, overwrite)
      } else if (typeof value === "string") {
        const key = noStyleSpace(value)
        const value2 = styleMap[key]
        setStyle(element, value2 || value, overwrite)
      }
    }
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var content_default =
    ".hnas_wrapper {  display: inline-block;}.hnas_wrapper > div.hnas_tooltip {  min-width: 250px;  display: none;  position: absolute;  top: 0px;  left: 0px;  box-sizing: border-box;  padding: 10px 15px;  background-color: white;  z-index: 100000;  border-radius: 5px;  -webkit-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);  -moz-box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);  box-shadow: 0px 10px 39px 10px rgba(62, 66, 66, 0.22);}.hnas_wrapper > div.hnas_tooltip > div {  display: flex;  flex-direction: column;}.hnas_wrapper > div.hnas_tooltip > div > a {  text-decoration: none;  color: black;  padding: 5px;  border-radius: 5px;  border: none;  font-weight: normal;  font-size: 1rem;  line-height: 1.25rem;}.hnas_wrapper > div.hnas_tooltip > div > a:hover {  text-decoration: underline;  color: black !important;  background-color: #f3f4f6;}"
  var apps = [
    "https://news.ycombinator.com/item?id=1234",
    "https://hn.svelte.dev/item/1234",
    "https://hn-redesign.vercel.app/items/1234",
    "https://insin.github.io/react-hn/#/story/1234",
    "https://lotusreader.netlify.app/item/1234",
    "https://hackernewsmobile.com/#/comments/1234",
    "https://hackerweb.app/#/item/1234",
    "https://hn.premii.com/#/comments/1234",
    "https://whnex.com/items/1234",
    "https://hack.ernews.info/comments-for/1234",
    "https://hacker-news.news/post/1234",
    "Close",
  ]
  var setStyle2 = createSetStyle(content_default)
  var tooltip = null
  function toSiteName(url) {
    return /\/([^/]+)\//.exec(url)[1]
  }
  var handler = (event) => {
    let target = event.target
    const tooltip2 = $(".hnas_tooltip")
    if (tooltip2) {
      while (target !== tooltip2 && target) {
        target = target.parentNode
      }
      if (target === tooltip2) {
        event.preventDefault()
        return
      }
      tooltip2.style.display = "none"
    }
    document.removeEventListener("click", handler)
  }
  function displayTooltip(id, wrapper) {
    if (!tooltip) {
      tooltip = createElement("div")
      setStyle2(tooltip, ".hnas_wrapper > div.hnas_tooltip")
      setAttribute(tooltip, "class", "hnas_tooltip")
      const list = createElement("div")
      setStyle2(list, ".hnas_wrapper > div.hnas_tooltip > div")
      for (const app of apps) {
        const link = createElement("a")
        setStyle2(link, ".hnas_wrapper > div.hnas_tooltip > div > a")
        link.dataset.hnas_link = "1"
        if (app === "Close") {
          link.innerHTML = "Close"
          setStyle2(link, "color: #217dfc; cursor: pointer;")
        } else {
          setAttribute(link, "href", app)
          setAttribute(link, "target", "_blank")
          link.innerHTML = toSiteName(app)
        }
        addEventListener(link, {
          click(event) {
            const tooltip2 = $(".hnas_tooltip")
            if (tooltip2) {
              tooltip2.style.display = "none"
            }
            document.removeEventListener("click", handler)
            if (link.innerHTML === "Close") {
              event.preventDefault()
            }
          },
          mouseover() {
            setStyle2(
              link,
              "text-decoration: underline; background-color: #f3f4f6; color: black !important;"
            )
            if (app === "Close") {
              setStyle2(link, "color: #217dfc; cursor: pointer;")
            }
          },
          mouseout() {
            setStyle2(link, ".hnas_wrapper > div.hnas_tooltip > div > a", true)
            if (app === "Close") {
              setStyle2(link, "color: #217dfc; cursor: pointer;")
            }
          },
        })
        list.append(link)
      }
      tooltip.append(list)
    }
    if (tooltip.style.display === "block" && tooltip.parentNode === wrapper) {
      return
    }
    for (const link of $$(tooltip, "div a")) {
      const href = getAttribute(link, "href")
      if (href) {
        setAttribute(link, "href", href.replace(/\d+/, id))
      }
    }
    const linkElement = wrapper.previousSibling
    const width = linkElement.offsetWidth
    const height = linkElement.offsetHeight
    const top = linkElement.offsetTop
    const left = linkElement.offsetLeft
    wrapper.append(tooltip)
    setStyle2(tooltip, {
      display: "block",
      top: String(top + height) + "px",
      left: String(left) + "px",
      width: String(width) + "px",
    })
    document.removeEventListener("click", handler)
    setTimeout(() => {
      addEventListener(document, "click", handler)
    }, 100)
  }
  function updateLinks() {
    const links = $$(
      'a[href^="https://news.ycombinator.com/item?id="],a[href^="http://news.ycombinator.com/item?id="]'
    )
    for (const link of links) {
      if (link.dataset.hnas_binded || link.dataset.hnas_link) {
        continue
      }
      link.dataset.hnas_binded = "1"
      const wrapper = createElement("span")
      setAttribute(wrapper, "class", "hnas_wrapper")
      link.after(wrapper)
      const id = /id=(\d+)/.exec(getAttribute(link, "href"))[1]
      if (id) {
        addEventListener(link, "click", (event) => {
          event.preventDefault()
          displayTooltip(id, wrapper)
        })
      }
    }
  }
  function main() {
    if (!document.body) {
      return
    }
    setInterval(updateLinks, 1e3)
    updateLinks()
  }
  main()
})()
