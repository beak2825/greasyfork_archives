// ==UserScript==
// @name         简书纯净版
// @description  简书纯净版-只保留文字与评论
// @version      0.1
// @author       tomiaa
// @match      *://www.jianshu.com/*
// @namespace    http://tampermonkey.net/

// @downloadURL https://update.greasyfork.org/scripts/431392/%E7%AE%80%E4%B9%A6%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/431392/%E7%AE%80%E4%B9%A6%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==
;(() => {
  const $ = id => document.querySelector(id)
  console.clear()
  const config = {
    default: {
      remove: [
        /* 头部 */
        "._1nZg8v",
        "._1F7CTF",
        "._1jKNin",
        "._1OyPqC",
        /* 左侧 */
        "._3Pnjry",

        "._2OwGUo", // 右侧
        /* 底部 */
        "._13lIbp",
        ".d0hShY",
      ],
      css: `
      ._gp-ck > section:nth-of-type(n+2){
        display: none;
      }
      ._1Jdfvb{
        margin-right: unset;
      }
      
      `,
    },
  }
  class Clear {
    constructor(config) {
      this.config = config
      this.domain = ""
      this.query = null
      this.init()
    }

    init() {
      // const currentHref = location.href.split('?');
      // this.domain = currentHref[0];
      this.domain = "default"
      // this.query = currentHref[1];
      console.log(this.domain)

      this.removeToHidden(this.config?.[this.domain]?.remove)
      this.addCss(this.config?.[this.domain]?.css)
      this.remove(this.config?.[this.domain]?.remove)
      this.config?.[this.domain]?.fn?.()
    }

    remove(arr = []) {
      arr
        .map(item => $(item))
        .forEach(item => {
          item?.remove()
        })
    }

    removeToHidden(arr = []) {
      if (!arr.length) return
      this.addCss(
        arr.join(",") +
          `{    
        display: none !important;
      }`
      )
    }

    addCss(css = "") {
      if (!css) return
      let style = document.createElement("style")
      style.innerHTML = css
      document.documentElement.appendChild(style)
    }
  }
  new Clear(config)
})()
