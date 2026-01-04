// ==UserScript==
// @name        HideImg
// @license     MIT
// @namespace   github.com/ojer
// @match       *://*/*
// @version     1.46
// @author      ojer
// @description 隐藏/显示页面中的图片和视频
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addElement
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @require     https://unpkg.com/@violentmonkey/shortcut@1.4.1/dist/index.js
// @downloadURL https://update.greasyfork.org/scripts/476159/HideImg.user.js
// @updateURL https://update.greasyfork.org/scripts/476159/HideImg.meta.js
// ==/UserScript==

let hImg = undefined
const {
  register
} = VM.shortcut
const HI_STATUS = 'HI_STATUS'
const dataId = 'vm-hide-img'

const captionKey = 'Hide/Show Img(Alt+I)'

class Himg {
  state
  stateOn
  stateOff

  constructor(on) {
    this.stateOn = new StateOn(this)
    this.stateOff = new StateOff(this)
    this.setState(on)
  }

  setState(on) {
    this.state = on ? this.stateOn : this.stateOff
  }

  switchMode() {
    this.state.switchMode()
  }
}

class State {
	msg(context) {
		// @grant       GM_notification
		// const opt = {
		//   text: context
		// }
		// const control = GM_notification(opt)
		// if (control) {
		//   setTimeout(() => {
		//     control.remove()
		//   }, 1500)
		// }
	}
}

class StateOn extends State {
	hImg
	constructor(hImg) {
		super()
		this.hImg = hImg
	}

	switchMode() {
		const content = `* { background-image: url("data:,") !important; } img,video{ visibility: hidden !important; }`
		const ele = GM_addElement(document.head, 'style', content)
		ele.setAttribute('data-id', dataId)
		super.msg('Image Hide')
	}
}

class StateOff extends State {
	hImg
	constructor(hImg) {
		super()
		this.hImg = hImg
	}

	switchMode() {
		document.querySelectorAll('style[data-id="' + dataId + '"]').forEach((e) => e.remove())
		super.msg('Image Show')
	}
}

const updateVal = () => {
	GM_setValue(HI_STATUS, !GM_getValue(HI_STATUS))
}

GM_addValueChangeListener(HI_STATUS, (name, oldValue, newValue, remote) => {
	hImg.setState(newValue)
	hImg.switchMode()
})

GM_registerMenuCommand(captionKey, updateVal)

register('a-i', () => {
	updateVal()
})

hImg = new Himg(GM_getValue(HI_STATUS, undefined))
hImg.switchMode()

// if (0 || window.location.href.includes('www.baidu.com/s?')) { }
new MutationObserver((mutationsList, observer) => {
	if (!document.querySelector('style[data-id="' + dataId + '"]') && GM_getValue(HI_STATUS)) {
		console.log('observer check')
		hImg.switchMode()
	}
}).observe(document.body, {
	childList: true
})
