// ==UserScript==
// @name         easyv悬浮窗
// @namespace    https://lssnow.gitee.io/stone/
// @version      0.1.0
// @description  提供一个可编辑的悬浮球
// @author       stone
// @match        https://workspace.easyv.cloud/create/*
// @match        https://workspace.easyv.cloud/dashboard/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474262/easyv%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/474262/easyv%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    "use stric"
     document.documentElement.style.overflow = "hidden"
    var isMin = false
    var ballSize = 60
    var currentPosition = "left"
    // 处理公共部分工具函数
    function resolveDom(styles, dom) {
      const element = document.createElement(dom)
      // element.style.display = "none"
      for (const key in styles) {
        element.style[key] = styles[key]
      }
      // element.style.display = "block"


      return element
    }
    // 创建面板
    function createPanel() {
      const styles = {
        position: "absolute",
        zIndex: 998,
        width: "250px",
        height: "300px",
        background: "rgba(255,255,255,0.5)",
        top: "10px",
        left: "10px",
        color: "black",
        border: "1px solid grey",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "width linear 0.3s,height linear 0.3s",
        boxShadow:
          `2.6px 2.8px 2.2px rgba(0, 0, 0, 0.02),
         6.3px 6.7px 5.3px rgba(0, 0, 0, 0.028),
         11.8px 12.5px 10px rgba(0, 0, 0, 0.035),
         21px 22.3px 17.9px rgba(0, 0, 0, 0.042),
         39.3px 41.8px 33.4px rgba(0, 0, 0, 0.05),
         94px 100px 80px rgba(0, 0, 0, 0.07)`
      }
      const panel = resolveDom(styles, 'div')
      document.body.appendChild(panel)
      return panel
    }

    // 创建导航栏
    function createMenu(panel) {
      const styles = {
        width: "100%",
        height: "10%",
        background: "rgba(255,255,255,0.5)",
        top: "10px",
        left: "10px",
        borderBottom: "1px solid grey",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
      }
      const menu = resolveDom(styles, 'div')


      const options = {
        isMouseDown: false,
        initX: 0,
        initY: 0
      }
      menu.addEventListener('mousedown', (e) => {
        panel.style.transition = "width linear 0.3s,height linear 0.3s"
        menu.style.cursor = "move"
        options.isMouseDown = true
        options.initX = e.clientX - panel.offsetLeft
        options.initY = e.clientY - panel.offsetTop

        document.onmousemove = function (e) {
          if (options.isMouseDown) {
            let skewX = e.clientX - options.initX
            let skewY = e.clientY - options.initY
            if (skewX < 0) {
              skewX = 10
            }
            if (skewY < 0) {
              skewY = 0
            }
            if (skewX > (window.innerWidth - panel.offsetWidth)) {
              skewX = (window.innerWidth - panel.offsetWidth - 10)
            }
            if (skewY > window.innerHeight - panel.offsetHeight) {
              skewY = (window.innerHeight - panel.offsetHeight)
            }
            panel.style.left = skewX + "px"
            panel.style.top = skewY + "px"
          }
        }
        document.onmouseup = function (e) {
          options.isMouseDown = false
          menu.style.cursor = "default"
          this.onmousemove = null
          this.onmouseup = null

        }
      })

      panel.appendChild(menu)
      return menu
    }

    // 创建文本域
    function createTextArea(panel) {
      let folditem;
      // console.log(folditem);

      const styles = {
        width: "100%",
        height: "90%",
        background: "rgba(255,255,255,0.5)",
        border: "none",
        outline: "none",
        resize: "none",
        borderBottomLeftRadius: "5px",
        borderBottomRightRadius: "5px",
        boxSizing: "border-box"
      }
      const textarea = resolveDom(styles, 'textarea')
      const options = {
        isMouseDown: false,
        initX: 0,
        initY: 0
      }
      textarea.addEventListener('mousedown', (e) => {
        folditem = document.querySelector('#foldItem')
        if (!isMin) return
        panel.style.transition = "width linear 0.3s,height linear 0.3s"
        textarea.style.cursor = "move"
        options.isMouseDown = true
        options.initX = e.clientX - panel.offsetLeft
        options.initY = e.clientY - panel.offsetTop

        document.onmousemove = function (e) {
          if (options.isMouseDown) {
            let skewX = e.clientX - options.initX
            let skewY = e.clientY - options.initY
            if (skewX < 0) {
              skewX = 0
            }
            if (skewY < 0) {
              skewY = 0
            }
            if (skewX > (window.innerWidth - panel.offsetWidth)) {
              skewX = (window.innerWidth - panel.offsetWidth)
            }
            if (skewY > window.innerHeight - panel.offsetHeight) {
              skewY = (window.innerHeight - panel.offsetHeight)
            }
            panel.style.left = skewX + "px"
            panel.style.top = skewY + "px"
          }
        }
        document.onmouseup = function (e) {
          panel.style.transition = "width linear 0.3s,height linear 0.3s,left linear 0.3s"
          let skewX = e.clientX - options.initX
          let skewY = e.clientY - options.initY
          const target = window.innerWidth / 2 - ballSize / 2

          if (skewX < target) {
            currentPosition = "left"
            folditem.innerText = ">"
            folditem.style.border = "none"
            folditem.style.textAlign = "right"
            folditem.style.borderRight = "1px solid black",
              folditem.style.borderTopRightRadius = "40%",
              folditem.style.borderBottomRightRadius = "40%",
              folditem.style.removeProperty('left')
            folditem.style.right = 0
            skewX = -ballSize / 2
          } else {
            currentPosition = "right"
            folditem.innerText = "<"
            folditem.style.border = "none"
            folditem.style.textAlign = "left"
            folditem.style.borderLeft = "1px solid black",
              folditem.style.borderTopLeftRadius = "40%",
              folditem.style.borderBottomLeftRadius = "40%",
              folditem.style.removeProperty('right')
            folditem.style.left = 0
            skewX = window.innerWidth - panel.offsetWidth + ballSize / 2
          }

          if (currentPosition == "left") {
            panel.style.removeProperty('right')
            panel.style.left = skewX + "px"
          } else {
            panel.style.removeProperty('left')
            panel.style.left = skewX + "px"
          }


          options.isMouseDown = false
          textarea.style.cursor = "default"
          this.onmousemove = null
          this.onmouseup = null
        }
      })

      panel.appendChild(textarea)
      return textarea
    }


    // 吸附在左边
    function stickLeft(folditem, panel, textarea) {
      if (folditem.innerText == '>') {
        panel.style.borderRadius = "5px"
        panel.style.overflow = "visible"
        panel.style.width = "250px"
        panel.style.height = "300px"
        panel.style.left = "10px"
        isMin = false
        textarea.removeAttribute('readonly')
        folditem.style.right = "-10px"
        folditem.innerText = "<"
      } else {
        panel.style.transition = "width linear 0.3s,height linear 0.3s,left linear 0.3s"
        panel.style.borderRadius = "50%"
        panel.style.overflow = "hidden"
        panel.style.width = ballSize + "px"
        panel.style.height = ballSize + "px"
        panel.style.left = (-ballSize / 2) + "px"
        isMin = true
        textarea.setAttribute('readonly', "")
        folditem.style.right = "0px"
        folditem.innerText = ">"
      }
    }

    // 吸附在右边
    function stickRight(folditem, panel, textarea) {
      if (folditem.innerText == '<') {
        panel.style.borderRadius = "5px"
        panel.style.overflow = "visible"
        panel.style.width = "250px"
        panel.style.height = "300px"
        panel.style.left = window.innerWidth - 290 + ballSize / 2 + "px"
        isMin = false
        textarea.removeAttribute('readonly')
        folditem.style.removeProperty("right")
        folditem.style.left = "-10px"
        folditem.innerText = ">"
      } else {
        panel.style.transition = "width linear 0.3s,height linear 0.3s,left linear 0.3s"
        panel.style.borderRadius = "50%"
        panel.style.overflow = "hidden"
        panel.style.width = ballSize + "px"
        panel.style.height = ballSize + "px"
        panel.style.left = window.innerWidth - 60 + ballSize / 2 + "px"
        isMin = true
        textarea.setAttribute('readonly', "")
        folditem.style.removeProperty("right")
        folditem.style.left = "0px"
        folditem.innerText = "<"
      }
    }

    // 创建折叠选项
    function createFoldItem(panel, textarea) {
      const styles = {
        position: "absolute",
        zIndex: 999,
        width: "20px",
        height: "20px",
        right: "-10px",
        top: 0,
        bottom: 0,
        margin: "auto",
        textAlign: "right",
        cursor: "pointer",
        background: "rgba(255,255,255,0.5)",
        borderRight: "1px solid black",
        borderTopRightRadius: "40%",
        borderBottomRightRadius: "40%",
        // background:"red"
      }
      const folditem = resolveDom(styles, 'div')
      folditem.setAttribute('id', "foldItem")
      folditem.innerText = "<"
      panel.appendChild(folditem)

      folditem.addEventListener('click', () => {
        if (currentPosition == "left") {
          stickLeft(folditem, panel, textarea)
        } else {
          stickRight(folditem, panel, textarea)
        }
      })
      return folditem
    }
    async function init() {
      const panel = await createPanel()
      const menu = await createMenu(panel)
      const textarea = await createTextArea(panel)
      const folditem = await createFoldItem(panel, textarea)
    }
    const script = document.createElement('script')
    script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js"
    script.type = "text/javascript"
    document.body.insertBefore(script, document.body.children[0])
    script.onload = function () {
      // console.log($);
      init()
    }
})();