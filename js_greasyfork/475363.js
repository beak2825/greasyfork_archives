// ==UserScript==
// @name         力扣新版UI评论区
// @namespace    Ocyss
// @version      0.3
// @description  杀软,tm的会不会设计?
// @author       Ocyss
// @source       https://github.com/Ocyss/Tampermonkey
// @homepage     https://github.com/Ocyss
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475363/%E5%8A%9B%E6%89%A3%E6%96%B0%E7%89%88UI%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/475363/%E5%8A%9B%E6%89%A3%E6%96%B0%E7%89%88UI%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function () {
  const t = setInterval(() => {
    const comment = document.querySelector('.mt-6.flex.flex-col.gap-3 .flex.flex-col:has( svg[data-icon="comment"])')
    const header = document.querySelector(".flexlayout__tabset_tabbar_inner_tab_container.flexlayout__tabset_tabbar_inner_tab_container_top")
    const layout = document.querySelector(".flexlayout__layout")
    if (!layout || !comment || !header) {
      return
    }
    clearInterval(t)
    const l = new leetcode(comment, header, layout)
    l.main()
  }, 1000)
})();

class DOMApi {
  static createElement(tag, _class = "", id = "", content = "", style = "") {
    const el = document.createElement(tag)
    if (_class) { el.className = _class }
    if (id) { el.id = id }
    if (style) { el.style.cssText = style }
    el.innerHTML = content
    return el
  }
  static click(el, func) {
    el.addEventListener("click", func)
  }
  static mousedown(el, func) {
    el.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        func(e)
      }
    })
  }
  static remove(cls, parent = document) {
    const t = setInterval(() => {
      const el = parent.querySelector(cls)
      if (!el) {
        return
      }
      el.remove()
      clearInterval(t)
    }, 200)
  }
}

class leetcode {
  constructor(comment, header, layout) {
    this.comment = comment // 评论区
    this.header = header
    this.layout = layout
    this.flexlayout = document.querySelectorAll(".flexlayout__tab")

    this.content = null
  }
  main() {
    this.buildComment()
    this.buildTagBut()
    this.additionalEventHandler()
  }
  // 编译评论页面视图
  buildComment() {

    this.content = DOMApi.createElement("div", "flexlayout__tab", "", "", "left: 0px; top: 32px; width: 595px; height: 928.391px; position: absolute;display: none;")
    const overflowTransition = this.comment.querySelector(".overflow-hidden.transition-all")
    overflowTransition.style.paddingBottom = "80px"
    this.content.appendChild(overflowTransition)
    DOMApi.remove(".w-full.border.p-4.bg-fill-4.border-divider-4", this.content)
    this.layout.appendChild(this.content)
  }
  // 编译评论标签按钮
  buildTagBut() {

    const commentBut = DOMApi.createElement("div", "flexlayout__tab_button flexlayout__tab_button_top flexlayout__tab_button--unselected", "", `
    <div class="flexlayout__tab_button_content">
    <div class="relative flex items-center gap-1 overflow-hidden text-sm capitalize" style="max-width: 150px;">
    <div class="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-blue-500"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clock-rotate-left" class="svg-inline--fa fa-clock-rotate-left absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path></svg></div>
      <div class="relative">
        <div class="medium whitespace-nowrap font-medium">评论</div>
        <div class="normal absolute left-0 top-0 whitespace-nowrap font-normal">评论</div>
      </div>
    </div>
  </div>
    `)
    const svg = this.comment.querySelector(".origin-center.transition-transform")
    const buts = document.querySelectorAll(".flexlayout__tab_button.flexlayout__tab_button_top")
    let pre

    const syncWidth = () => {
      if (!pre) {
        return
      }
      this.content.style.width = pre.style.width;
    }
    this.commentButEv = (e) => {
      if (!svg.classList.contains("rotate-180")) {
        this.comment.firstElementChild.click()
      }
      this.flexlayout.forEach((flex) => {
        if (flex.dataset.layoutPath.startsWith("/ts0") && flex.style.display == "") {
          pre = flex
          flex.style.display = "none"
          syncWidth()
        }
      })
      buts.forEach((but) => {
        if (but.dataset.layoutPath.startsWith("/ts0") && but.classList.contains("flexlayout__tab_button--selected")) {
          but.classList.replace("flexlayout__tab_button--selected", "flexlayout__tab_button--unselected");
        }
      })
      commentBut.classList.replace("flexlayout__tab_button--unselected", "flexlayout__tab_button--selected");
      this.content.style.display = ""
    }
    DOMApi.mousedown(commentBut, this.commentButEv)


    buts.forEach((but) => {
      if (but.dataset.layoutPath.startsWith("/ts0")) {
        DOMApi.mousedown(but, (e) => {
          if (pre && pre.dataset.layoutPath.replace(/\/t([^\/]*)$/, '/tb$1') == but.dataset.layoutPath) {
            pre.style.display = ""
            pre.classList.replace("flexlayout__tab_button--unselected", "flexlayout__tab_button--selected");
            pre = void 0
          }
          commentBut.classList.replace("flexlayout__tab_button--selected", "flexlayout__tab_button--unselected");
          this.content.style.display = "none"
        })
      }
    })

    this.header.appendChild(DOMApi.createElement("div", "flexlayout__tabset_tab_divider"))
    this.header.appendChild(commentBut)
    document.addEventListener("mousemove", function (event) {
      syncWidth()
    });
    setTimeout(() => {
      commentBut.innerHTML = commentBut.innerHTML.replaceAll("评论", this.comment.firstElementChild.firstElementChild.textContent)
    }, 2000)
  }
  // 进行额外事件绑定
  additionalEventHandler() {
    // 题目描述页评论按钮重定向
    const commentBug = document.querySelector("svg.fa-comment").closest("button")
    commentBug.onclick = () => {
      this.commentButEv()
    }
    this.comment.style.display = "none"

  }
}
