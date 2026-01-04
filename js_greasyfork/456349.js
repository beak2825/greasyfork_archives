// ==UserScript==
// @name        Mobile Mode - Bonk.io
// @namespace   left paren
// @match       https://bonk.io/gameframe-release.html
// @grant       none
// @version     1.0
// @author      left paren
// @license     The Unlicense
// @description Allows you to use bonk.io on mobile devices

// @downloadURL https://update.greasyfork.org/scripts/456349/Mobile%20Mode%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/456349/Mobile%20Mode%20-%20Bonkio.meta.js
// ==/UserScript==
window.top.document.head.innerHTML += '<meta name="viewport" content="width=1200px, maximum-scale=0.5">'
function kill(el) {
  el.style.top = el.style.left = el.style.width = el.style.height = "0px"
}

kill(window.top.document.getElementById("adboxverticalCurse"))
kill(window.top.document.getElementById("adboxverticalleftCurse"))

window.top.document.body.style.width = "1420px"
window.top.document.body.style.height = 1420*(window.screen.availHeight / window.screen.availWidth) + "px"
window.top.document.body.style.transformOrigin = "top left"
window.top.document.body.style.overflow = "hidden"

/**
 * Simulate a key event.
 * @param {Number} keyCode The keyCode of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 */
function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

var up = 38
var down = 40
var left = 37
var right = 39
var heavy = 88
var special = 17
var enter = 13

function addButton(key, x, y, text) {
  var button = document.createElement("div")
  button.innerText = text
  if (typeof key == "number") {
    button.addEventListener("touchstart", ()=>{simulateKey(key, "down")})
    button.addEventListener("touchend", ()=>{simulateKey(key, "up")})
  } else {
    button.addEventListener("click", key)
  }
  button.style.position = "fixed"
  button.style.bottom = y
  button.style.left = x
  button.style.lineHeight = "100px"
  button.style.fontSize = "50px"
  button.classList = "brownButton brownButton_classic buttonShadow"
  button.style.width = button.style.height = "100px"
  document.body.append(button)
  return button
}

function clamp(x, min, max) {
  if (x < min) return min
  if (x > max) return max
  return x
}

joystick = {
  currentKeys: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  applyKeys: function() {
    simulateKey(up, joystick.currentKeys.up?"down":"up")
    simulateKey(down, joystick.currentKeys.down?"down":"up")
    simulateKey(left, joystick.currentKeys.left?"down":"up")
    simulateKey(right, joystick.currentKeys.right?"down":"up")
  },
  /**
   * 
   * @param {TouchEvent} e 
   */
  move: function(e) {
    var touch = e.touches.item(0)
    var elBox = joystick.el.getBoundingClientRect()
    var relative = {
      x: (touch.clientX - elBox.left) / (elBox.width / 2) - 1,
      y: (touch.clientY - elBox.top) / (elBox.height / 2) - 1,
    }
    joystick.handleAtVector(relative.x, relative.y)
  },
  end: function(e) {
    joystick.handleAtVector(0, 0)
  },
  handleAtVector(x, y) {
    console.log([x, y])
    joystick.el.style.transform = `perspective(1000px) rotate3d(${clamp(-y, -1, 1)}, ${clamp(x, -1, 1)}, 0, 15deg)`
    joystick.currentKeys.up = y<-0.6
    joystick.currentKeys.down = y>0.6
    joystick.currentKeys.left = x<-0.6
    joystick.currentKeys.right = x>0.6
    joystick.applyKeys()
  },
  /** @type {HTMLDivElement} */
  el: undefined
}


joystick.el = document.createElement("div")
joystick.el.addEventListener("touchstart", joystick.move)
joystick.el.addEventListener("touchmove", joystick.move)
joystick.el.addEventListener("touchend", joystick.end)
joystick.el.style.position = "fixed"
joystick.el.style.bottom = "10px"
joystick.el.style.right = "10px"
joystick.el.style.opacity = "30%"
joystick.el.style.transformOrigin = "center"
joystick.el.style.backgroundBlendMode = "multiply"
joystick.el.style.backgroundSize = "cover"
joystick.el.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABHNCSVQICAgIfAhkiAAACfRJREFUeF7t1sFtHEEMAEHbUFgb/kahZGw/7AgIEMdG6b+YYXHUuJ+///798PfRAu/7fvT9Kpd7nqcySnaOX9nJDEaAQE5AsHIrNRCBroBgdXdrMgI5AcHKrdRABLoCgtXdrckI5AQEK7dSAxHoCghWd7cmI5ATEKzcSg1EoCsgWN3dmoxATkCwcis1EIGugGB1d2syAjkBwcqt1EAEugKC1d2tyQjkBAQrt1IDEegKCFZ3tyYjkBMQrNxKDUSgKyBY3d2ajEBOQLByKzUQga6AYHV3azICOQHByq3UQAS6AoLV3a3JCOQEBCu3UgMR6AoIVne3JiOQExCs3EoNRKArIFjd3ZqMQE5AsHIrNRCBroBgdXdrMgI5AcHKrdRABLoCgtXdrckI5AQEK7dSAxHoCghWd7cmI5ATEKzcSg1EoCsgWN3dmoxATkCwcis1EIGugGB1d2syAjkBwcqt1EAEugKC1d2tyQjkBAQrt1IDEegKCFZ3tyYjkBMQrNxKDUSgKyBY3d2ajEBOQLByKzUQga6AYHV3azICOQHByq3UQAS6AoLV3a3JCOQEBCu3UgMR6AoIVne3JiOQExCs3EoNRKArIFjd3ZqMQE5AsHIrNRCBroBgdXdrMgI5AcHKrdRABLoCgtXdrckI5AQEK7dSAxHoCghWd7cmI5ATEKzcSg1EoCsgWN3dmoxATkCwcis1EIGugGB1d2syAjkBwcqt1EAEugKC1d2tyQjkBAQrt1IDEegKCFZ3tyYjkBMQrNxKDUSgKyBY3d2ajEBOQLByKzUQga6AYHV3azICOQHByq3UQAS6AoLV3a3JCOQEBCu3UgMR6AoIVne3JiOQExCs3EoNRKArIFjd3ZqMQE5AsHIrNRCBroBgdXdrMgI5AcHKrdRABLoCgtXdrckI5AQEK7dSAxHoCghWd7cmI5ATEKzcSg1EoCsgWN3dmoxATkCwcis1EIGugGB1d2syAjkBwcqt1EAEugKC1d2tyQjkBAQrt1IDEegKCFZ3tyYjkBMQrNxKDUSgKyBY3d2ajEBOQLByKzUQga6AYHV3azICOQHByq3UQAS6AoLV3a3JCOQEBCu3UgMR6AoIVne3JiOQExCs3EoNRKArIFjd3ZqMQE5AsHIrNRCBroBgdXdrMgI5AcHKrdRABLoCgtXdrckI5AQEK7dSAxHoCghWd7cmI5ATEKzcSg1EoCvw9b5vd7rIZN/f35FJjEFgJuAX1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAoI1iK2owgQmAkI1szP1wQILAp8Pc+zeJyjCHyugP+Fz93N/5v5hfX5O3JDAgT+CQiWp0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAoJ1ZlUuSoCAYHkDBAicERCsM6tyUQIEBMsbIEDgjIBgnVmVixIgIFjeAAECZwQE68yqXJQAAcHyBggQOCMgWGdW5aIECAiWN0CAwBkBwTqzKhclQECwvAECBM4ICNaZVbkoAQKC5Q0QIHBGQLDOrMpFCRAQLG+AAIEzAn8ARK4Pmm9m298AAAAASUVORK5CYII=)"
joystick.el.classList = "brownButton brownButton_classic buttonShadow"
joystick.el.style.width = joystick.el.style.height = "380px"
document.body.append(joystick.el)

fullscreenButton = document.createElement("div")
fullscreenButton.innerText = "⛶"
fullscreenButton.addEventListener("click", ()=>{window.top.document.documentElement.requestFullscreen()})
fullscreenButton.style.position = "fixed"
fullscreenButton.style.top =
  fullscreenButton.style.right = "10px"
fullscreenButton.style.lineHeight = "100px"
fullscreenButton.style.fontSize = "50px"
fullscreenButton.classList = "brownButton brownButton_classic buttonShadow"
fullscreenButton.style.width = fullscreenButton.style.height = "100px"
document.body.append(fullscreenButton)

joystick.special = addButton(special, "10px", "10px", "Z")
joystick.heavy = addButton(heavy, "120px", "10px", "X")
addButton(()=>{}, "10px", "120px", "💬").addEventListener("touchend", ()=>{
  setTimeout(()=>{
    var ingame = document.getElementById("gamerenderer").style.visibility == "inherit"
    if (ingame) {
      document.getElementById("gamerenderer").focus()
      simulateKey(enter, "down")
    } else {
      document.getElementById("newbonklobby_chat_input").focus()
      document.getElementById("newbonklobby_chat_lowerinstruction").style.visibility = "hidden"
    }
  }, 100)
})
function handleAnimFrame() {
  requestAnimationFrame(handleAnimFrame);

  //joystick
  var ingame = document.getElementById("gamerenderer").style.visibility == "inherit"
  joystick.el.style.display =
    joystick.special.style.display =
    joystick.heavy.style.display = ingame ? "block" : "none"
  if (ingame) joystick.applyKeys()

  // gamepad support
  var gamepads = navigator.getGamepads()
  gamepads.forEach(g=>{
    if (!g) return
    simulateKey(up, g.axes[1]<-0.3?"down":"up")
    simulateKey(down, g.axes[1]>0.3?"down":"up")
    simulateKey(left, g.axes[0]<-0.3?"down":"up")
    simulateKey(right, g.axes[0]>0.3?"down":"up")
    simulateKey(heavy, g.buttons[2].pressed?"down":"up")
    simulateKey(special, g.buttons[1].pressed<-0.3?"down":"up")
  })

  // scale viewport
  if (window.top.document.fullscreenElement) {
    fullscreenButton.style.display = "none"
    var html = window.top.document.fullscreenElement
    var body = window.top.document.body
    var scale = Math.min(
      window.screen.availWidth / body.clientWidth,
      window.screen.availHeight / body.clientHeight,
    )
    scale *= 100
    body.style.transform = `scale(${scale}%, ${scale}%)`
  } else {
    fullscreenButton.style.display = "block"
  }
}

requestAnimationFrame(handleAnimFrame)

window.addEventListener('load', () => { 
  document.getElementById("newbonklobby_chat_input").type = "search"
  document.getElementById("newbonklobby_chat_input").autocomplete = "off"
});