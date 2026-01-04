// ==UserScript==
// @name         SetVideo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  You can used this Script to control video tag in HTML, whitch include rotate and scalc.
// @author       XaZh.com
// @include      *
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451776/SetVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/451776/SetVideo.meta.js
// ==/UserScript==

(function () {
  var isVideo = function () {
    var video = document.getElementsByTagName('video')
    if (video.length)
      return video
    return null
  }

  var Panel = class {
    el = {
      panel: null,
      selector: null,
      isValid: null,
      rotate: null,
      reduce: null,
      amplify: null,
    }
    videoObj = null
    isShow = true
    isValid = false
    objParameters = [0, 1]

    constructor() {
      // Panel
      this.el.panel = document.createElement('div')
      this.el.panel.style.all = 'initial'
      this.el.panel.style.height = '60px'
      this.el.panel.style.width = '160px'
      this.el.panel.style.position = 'fixed'
      this.el.panel.style.top = '12px'
      this.el.panel.style.right = '12px'
      this.el.panel.style.background = 'rgba(255,255,255,.2)'
      this.el.panel.style.backdropFilter = 'blur(12px)'
      this.el.panel.style.boxShadow = '0 0 1px rgba(55,55,55,.3)'
      this.el.panel.style.borderRadius = '12px'
      this.el.panel.style.zIndex = '999999'
      this.el.panel.style.padding = '20px'
      this.el.panel.style.transition = 'all .2s ease-in-out'

      // Selector in Panel
      let selectorBox = document.createElement('div')
      this.el.selector = document.createElement('input')
      this.el.selector.style.color = 'gray'
      this.el.selector.style.display = 'inline-block'
      this.el.selector.style.width = '70px'
      this.el.selector.style.outline = 'none'
      this.el.selector.style.border = '2px solid gray'
      this.el.selector.style.borderRadius = '6px'
      this.el.selector.style.verticalAlign = 'top'
      this.el.selector.style.background = 'transparent'
      this.el.selector.style.textAlign = 'right'
      this.el.selector.style.padding = '2px 6px'
      this.el.selector.onkeyup = () => {
        this.setSelector(this.el.selector.value)
      }
      selectorBox.innerHTML = '<span style="color: gray">选择器：</span>'
      selectorBox.appendChild(this.el.selector)

      // Judge whether the selector is valid
      this.el.isValid = document.createElement('div')
      this.el.isValid.style.color = 'red'
      this.el.isValid.style.fontSize = '12px'
      this.el.isValid.style.lineHeight = '24px'
      this.el.isValid.style.textAlign = 'center'
      this.el.isValid.innerText = '无效'

      // Function button
      let functionsBox = document.createElement('div')
      functionsBox.style.display = 'flex'
      functionsBox.style.justifyContent = 'space-around'
      this.el.rotate = document.createElement('div')
      this.el.reduce = document.createElement('div')
      this.el.amplify = document.createElement('div')
      this.el.rotate.innerText = '旋转'
      this.el.reduce.innerText = '缩小'
      this.el.amplify.innerText = '放大'
      let buttonCss = '\
        color: gray;\
        border: 1px solid gray;\
        border-radius: 6px;\
        background-color: transparent;\
        padding: 2px 3px;\
        font-size: 12px;\
        user-select: none;\
      '
      this.el.rotate.style.cssText =
        this.el.reduce.style.cssText =
        this.el.amplify.style.cssText = buttonCss
      let buttonHoverCss = '\
        color: white;\
        border: 1px solid #FFF;\
        border-radius: 6px;\
        background-color: #CCC;\
        padding: 2px 3px;\
        font-size: 12px;\
        user-select: none;\
      '
      this.el.rotate.onmouseover =
        this.el.reduce.onmouseover =
        this.el.amplify.onmouseover = (el) => {
          el.srcElement.style.cssText = buttonHoverCss
        }
      this.el.rotate.onmouseout =
        this.el.reduce.onmouseout =
        this.el.amplify.onmouseout = (el) => {
          el.srcElement.style.cssText = buttonCss
        }
      this.el.rotate.onclick = () => { this.rotate() }
      this.el.reduce.onclick = () => { this.reduce() }
      this.el.amplify.onclick = () => { this.amplify() }
      functionsBox.appendChild(this.el.rotate)
      functionsBox.appendChild(this.el.reduce)
      functionsBox.appendChild(this.el.amplify)

      // Panel switch
      let panelSwitch = document.createElement('div')
      panelSwitch.style.height = '20px'
      panelSwitch.style.width = '200px'
      panelSwitch.style.position = 'absolute'
      panelSwitch.style.bottom = '-20px'
      panelSwitch.style.left = '0'
      panelSwitch.style.background = 'transparent'
      let panelSwitchFlag = document.createElement('div')
      panelSwitchFlag.style.width = '100px'
      panelSwitchFlag.style.height = '4px'
      panelSwitchFlag.style.margin = '9px calc(50% - 50px)'
      panelSwitchFlag.style.borderRadius = '2px'
      panelSwitchFlag.style.background = 'white'
      panelSwitchFlag.style.display = 'none'
      panelSwitch.appendChild(panelSwitchFlag)
      panelSwitch.onmouseover = (el) => {
        panelSwitchFlag.style.display = 'block'
      }
      panelSwitch.onmouseout = (el) => {
        panelSwitchFlag.style.display = 'none'
      }
      panelSwitchFlag.onmousedown = (el) => {
        if (this.isShow) {
          this.el.panel.style.top = '-100px'
        } else {
          this.el.panel.style.top = '12px'
        }
        this.isShow = !this.isShow
      }

      // insert
      this.el.panel.appendChild(selectorBox)
      this.el.panel.appendChild(this.el.isValid)
      this.el.panel.appendChild(functionsBox)
      this.el.panel.appendChild(panelSwitch)
      document.body.appendChild(this.el.panel)

      this.setSelector('video')
    }

    rotate() {
      if (!this.isValid) return false
      console.log(this.objParameters)
      console.log(this.videoObj[0])
      this.objParameters[0] = (this.objParameters[0] + 45) % 360
      this.applyVideo()
    }
    reduce() {
      if (!this.isValid) return false
      this.objParameters[1] -= 0.1
      this.objParameters[1] = this.objParameters[1] <= 0 ? 0 : this.objParameters[1]
      this.applyVideo()
    }
    amplify() {
      if (!this.isValid) return false
      this.objParameters[1] += 0.1
      this.objParameters[1] = this.objParameters[1] >= 5 ? 5 : this.objParameters[1]
      this.applyVideo()
    }
    applyVideo() {
      this.videoObj[0].style.transform =
        'rotate(' + this.objParameters[0] + 'deg) scale(' + this.objParameters[1] + ')'
    }

    setSelector(s) {
      this.videoObj = this.matchSelector(s)
      if (this.videoObj) {
        this.el.isValid.innerText = '有效'
        this.el.isValid.style.color = 'green'
        this.isValid = true
      } else {
        this.el.isValid.innerText = '无效'
        this.el.isValid.style.color = 'red'
        this.isValid = false
      }
      this.el.selector.value = s
    }
    matchSelector(s) {
      if (!(/^[a-zA-Z_].*/.exec(s)))
        return false
      let obj = document.querySelectorAll(s)
      return obj.length ? obj : false
    }
  }

  function main() {
    if (!isVideo())
      return false
    var m = new Panel()
  }

  main()
})();