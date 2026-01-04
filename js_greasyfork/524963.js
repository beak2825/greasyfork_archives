// ==UserScript==
// @name         scratch extesion: input by rssaromeo
// @version      3
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @tag          lib
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAAGO3tDoeH////Ea+F+gAAAAR0Uk5TAP///7MtQIgAAAFySURBVHicjZMxbsMwDEXFwXOX+jQuUPcENVDrlPKgDp2jS/QUWrp7cPk/KUcpUiBCYEfPIr+kT0rAGGd9HBv+Ch7DQrznBrjAlwDIGmzUYkAjZMVnxABErgFJBDpjEg3QnyDCVRJiBBquUouGKYjIMEwFWZICWREBoNNaRFMggmDPexZNEYODYzs2BW9rAyEBMKeDWpJYTgd7rgq4iyswEQfHtouJONCsQhF5/5q+aw8+PqcxQeYiVJU1vzwTFIlUjT/haaOMA1XinQOY6sIbVl0HmiiFHoRovl3BOOUGuNG205AaaOMf4Ize3QWn++lBMM7DwnPgZTsdFp5D1keB+vDKk4ZIs6MbE4K7H906A3rJakMPLnfAHDugznU5zew/oLaCOZO0krKBkroFl62VpV8IqrDLqiIZoOsolLZOW0xi8ev07Eprj3H2mFqsgfQ7l+js7DlmSbQOXQnZiK9d355GWavHdrRw2/v0T8K5hAvCLxHq4ydmN9O+AAAAAElFTkSuQmCC
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524963/scratch%20extesion%3A%20input%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524963/scratch%20extesion%3A%20input%20by%20rssaromeo.meta.js
// ==/UserScript==

// fix +=+up=up -> + in list

;(async () => {
  await loadlib("libloader").waitforlib("scratchextesnsionmanager")
  const {
    newext,
    newmenu,
    newblock,
    bt,
    inp,
    gettarget,
    totype,
    scratch_math,
    projectid,
    canvas,
    scratchvar,
    scratchlist,
  } = loadlib("scratchextesnsionmanager")
  var a = loadlib("newallfuncs")
  var vm
  loadlib("libloader")
    .waitforlib("scratch")
    .then(() => (vm = loadlib("scratch").vm))

  var mousestate = {
    left: false,
    center: false,
    right: false,
  }

  newext(
    "input",
    "rssaromeo",
    class {
      getmouse({ button }) {
        button = totype(button, "string", 1)
        if (button == "any")
          return Object.values(mousestate).includes(true)
        if (mousestate?.[button] !== undefined)
          return mousestate[button]
        else return false
      }
      press({ key }) {
        if (key == " ") key = "space"
        if (/^[a-z]$/.test(key)) key = key.toUpperCase()
        var index =
          vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
        if (index !== -1) {
          vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
        }
        vm.runtime.ioDevices.keyboard._keysPressed.push(key)
      }
      unpress({ key }) {
        key = totype(key, "string")
        if (key == " ") key = "space"
        if (/^[a-z]$/.test(key)) key = key.toUpperCase()
        var index =
          vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
        if (index !== -1) {
          vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
        }
      }
      keypressed({ key }) {
        if (key == "any")
          return !!vm.runtime.ioDevices.keyboard._keysPressed.length
        return !!vm.runtime.ioDevices.keyboard._keysPressed.includes(
          key
        )
      }
    },
    [
      newblock(bt.bool, "getmouse", "mouse [button] pressed?", [
        newmenu("getmouse", {
          items: ["left", "right", "center", "any"],
          defaultValue: "right",
        }),
      ]),
      newblock(bt.cmd, "press", "press [key]", [
        newmenu("fullkeylist", {
          defaultValue: "escape",
        }),
      ]),
      newblock(bt.cmd, "unpress", "unpress [key]", [
        newmenu("fullkeylist", {
          defaultValue: "escape",
        }),
      ]),
      newblock(bt.bool, "keypressed", "key [key] pressed?", [
        newmenu("fullkeylistandany", {
          defaultValue: "any",
        }),
      ]),
    ],
    "12B3B3",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAAGO3tDoeH////Ea+F+gAAAAR0Uk5TAP///7MtQIgAAAFySURBVHicjZMxbsMwDEXFwXOX+jQuUPcENVDrlPKgDp2jS/QUWrp7cPk/KUcpUiBCYEfPIr+kT0rAGGd9HBv+Ch7DQrznBrjAlwDIGmzUYkAjZMVnxABErgFJBDpjEg3QnyDCVRJiBBquUouGKYjIMEwFWZICWREBoNNaRFMggmDPexZNEYODYzs2BW9rAyEBMKeDWpJYTgd7rgq4iyswEQfHtouJONCsQhF5/5q+aw8+PqcxQeYiVJU1vzwTFIlUjT/haaOMA1XinQOY6sIbVl0HmiiFHoRovl3BOOUGuNG205AaaOMf4Ize3QWn++lBMM7DwnPgZTsdFp5D1keB+vDKk4ZIs6MbE4K7H906A3rJakMPLnfAHDugznU5zew/oLaCOZO0krKBkroFl62VpV8IqrDLqiIZoOsolLZOW0xi8ev07Eprj3H2mFqsgfQ7l+js7DlmSbQOXQnZiK9d355GWavHdrRw2/v0T8K5hAvCLxHq4ydmN9O+AAAAAElFTkSuQmCC"
  )
  await loadlib("libloader").waitforlib("scratch")
  await a.waituntil(canvas)
  // unsafeWindow.vm = loadlib("scratch").vm
  function fkey(key) {
    if (key == " ") key = "space"
    key = key.replace(/arrow(up|down|left|right)/i, "$1 arrow")
    if (/^[a-z]$/.test(key)) key = key.toUpperCase()
    else key = key.toLowerCase()
    return key
  }
  // setInterval(() => {
  function isinselfmenu() {
    if (document.querySelector(".blocklyDropDownArrow.arrowTop")) {
      var rect = document
        .querySelector(".blocklyDropDownArrow.arrowTop")
        .getBoundingClientRect()
      var arr = document.elementsFromPoint(rect.x, rect.y - 20)
    } else if (
      document.querySelector(".blocklyDropDownArrow.arrowBottom")
    ) {
      var rect = document
        .querySelector(".blocklyDropDownArrow.arrowBottom")
        .getBoundingClientRect()
      var arr = document.elementsFromPoint(rect.x, rect.y + 20)
    } else return false

    return arr
      .filter((e) => e.tagName.toLowerCase() == "path")
      .map((e) => e.parentElement.dataset.id)
      .join("|")
      .includes("inputcreatedbyrssaromeo")
  }
  window.onkeydown = (e) => {
    // log(e.target)
    if (e.target == document.querySelector(".u-dropdown-searchbar")) {
      if (!isinselfmenu()) return
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
      return
    }
    if (e.target !== document.body) return
    var key = fkey(e.key)
    if (key.length == 1) return
    e.preventDefault()
    var index =
      vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
    if (index !== -1) {
      vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
    }
    vm.runtime.ioDevices.keyboard._keysPressed.push(key)
  }
  window.onkeyup = (e) => {
    if (e.target == document.querySelector(".u-dropdown-searchbar")) {
      if (!isinselfmenu()) return
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
      log(e.target, e.key, fkey(e.key))
      e.target.value = fkey(e.key)
      e.target.dispatchEvent(
        new Event("input", {
          bubbles: true,
          cancelable: true,
        })
      )
      e.target.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          bubbles: true,
        })
      )
      // --editorTheme3-hoveredItem: #224b4b;
      return
    }
    e.preventDefault()
    var key = fkey(e.key)
    var index =
      vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
    if (index !== -1) {
      vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
    }
  }
  window.onblur = () =>
    (vm.runtime.ioDevices.keyboard._keysPressed = [])
  canvas().onmousedown = canvas().onmouseup = function (e) {
    e.preventDefault()
    switch (e.buttons) {
      case 0:
        mousestate = {
          left: false,
          center: false,
          right: false,
        }
        break
      case 1:
        mousestate = {
          left: true,
          center: false,
          right: false,
        }
        break
      case 2:
        mousestate = {
          left: false,
          center: false,
          right: true,
        }
        break
      case 3:
        mousestate = {
          left: true,
          center: false,
          right: true,
        }
        break
      case 4:
        mousestate = {
          left: false,
          center: true,
          right: false,
        }
        break
      case 5:
        mousestate = {
          left: true,
          center: true,
          right: false,
        }
        break
      case 6:
        mousestate = {
          left: false,
          center: true,
          right: true,
        }
        break
      case 7:
        mousestate = {
          left: true,
          center: true,
          right: true,
        }
        break
    }
  }
  // })
})()
