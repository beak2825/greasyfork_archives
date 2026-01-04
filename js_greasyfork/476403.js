// ==UserScript==
// @name         scratch extended
// @version      0.18
// @description  adds new functionality to scratch.mit.edu
// @run-at       document-start
// @author       rssaromeo
// @match        *://scratch.mit.edu/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAkFJREFUeF7l2sFRAzEMBVBSBww3qqAP6qAUiqEFCuDMjQl1wPhgxuw4kS39r28P3JgkjvRsybvenJ5e379v/vHfKRPg6+O5S3378CKbgjSAS8nXzFUIKQBt8ue3zz+zffd4//u/AoEOcC35mrkSgQowkrwagQYwk7wSgQLgSV6FAAeIJK9AgAKMJl+b3nFHaLeHrMYIA5hNviarRoAAeJNfASEM4Em+XvBEPou6dg4BIBJAjBHBcAMgA0eONYvhAmAEzBhzBCMEgO7gCgQKQGQPz0ZYDqAs21mEyG00BaAkEVkFowj1O2QAJVB0H2gbl7USZACjM8ReCVIAFUJva0svgZllirrFZZ0ou5rgcRasWkUhjFzYzL4HApBZDrMJWu+HAeyKAAXYEQEOsBsCBWAnBBrALghUgB0Q6ACrI6QArIyQBrAqQirAigjpAKshSABWQpABrIIgBVgBwQ2APKBQnie4ABg/eVMhhADQP3lTIEAB2KfA7elO9LlDHQsOoEBIPxWuS1X5UKSFlgGUIFgII/1A+mBkJEBvOcyOnb4CagOZDbR8zgqWMea1o3FXE2wHRAaMHMt6HhDaBY6DIwJHjDGadPu+8ApAlIMq+RI7DMB7Y9POBmtHofYARDkwt1OrLKArwFsOipmHNsGe8mhdX5sh1PV+agl4tshegBnJw5sgaiVkJZ8CMLM7eC+drUYnK4HZcsiceXoTnC0HRfJpJXBpJfSQrJulyHLvfZZyHWAFiTxRtr7Lel0CYAWV+foPdui0399khioAAAAASUVORK5CYII=
// @grant        none
// @tag          unused
// @license      GPLv3
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/476403/scratch%20extended.user.js
// @updateURL https://update.greasyfork.org/scripts/476403/scratch%20extended.meta.js
// ==/UserScript==

window.getvm = getvm
function getvm() {
  return new Promise((resolve) => {
    var c
    if (window.vm) c = test(true)
    if (c) resolve(c)
    new Promise(() => {
      const oldBind = Function.prototype.bind
      Function.prototype.bind = function (...args) {
        if (
          args[0] &&
          args[0].hasOwnProperty("editingTarget") &&
          args[0].hasOwnProperty("runtime")
        ) {
          Function.prototype.bind = oldBind
          window.vm = args[0]
          test()
          // vm.runtime._primitives.operator_gt = (e, y) => {
          //   alert("got it")
          // }
        }
        return oldBind.apply(this, args)
      }
    })
    function test(once) {
      if (
        document?.querySelectorAll("canvas") &&
        (window?.vm ||
          document
            ?.querySelector("#app")
            ?._reactRootContainer?._internalRoot?.current?.child?.stateNode?.store?.getState?.()
            ?.scratchGui?.vm) &&
        (window?.vm ||
          (document
            ?.querySelector("#app")
            ?._reactRootContainer?._internalRoot?.current?.child?.stateNode?.store?.getState?.()
            ?.scratchGui?.vm?.runtime?._lastStepDoneThreads?.length &&
            window.vm.runtime.getTargetForStage()))
      ) {
        window.vm =
          window?.vm ||
          document
            .querySelector("#app")
            ._reactRootContainer._internalRoot.current.child.stateNode.store.getState()
            .scratchGui.vm
        if (once) return window.vm
        resolve(window.vm)
      } else {
        if (once) return false
        setTimeout(test, 1)
      }
    }
  })
}

getvm().then((vm) => {
  window.vm = vm
  vm.runtime._primitives.operator_gt = (...e) => {
    var c = w(...e)
    return c
  }
  var b = setInterval(() => {
    if (canvas() && vm.runtime.getTargetForStage()) {
      clearInterval(b)
      loaded()
    }
  })
})
var w
window.canvas = canvas
function loaded() {
  function gtgotran(e, y) {
    datatype = "gt"
    var func = e.OPERAND1
    var args = String(e.OPERAND2)
    if (
      /^[$!#%()*+,-./:;=?@\[\]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789]{20}$/.test(
        args,
      )
    )
      args =
        Object.values(y?.thread?.target?.comments)?.filter?.(
          (e) => e.id == args,
        )?.[0]?.text ?? args
    if (func === "isloaded") {
      scratchvar("__script loaded", "true")
      return true
    }
    window.__scratchextended.thread = y?.thread
    window.__scratchextended.eventdata = y?.thread?.target
    if (window.__scratchextendendebug)
      console.log(y?.thread?.target?.sprite?.name)
    if (func === "") {
      return (y.thread.lastvalue = parse(args).join(""))
    } else if (__scratchextended[func]) {
      return (y.thread.lastvalue =
        run(func, parse(args, func !== "escape")) || "")
    } else {
      return Number(e.OPERAND1) > Number(e.OPERAND2)
    }
  }
  w = gtgotran
  var mousestate = {
    left: false,
    center: false,
    right: false,
  }

  function mousechanged(e) {
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
  canvas().oncontextmenu = (e) => e.preventDefault()
  canvas().onmousedown = mousechanged
  canvas().onmouseup = mousechanged
  canvas().addEventListener("click", async () => {
    if (pointerlock_active)
      await canvas().requestPointerLock({
        unadjustedMovement: true,
      })
    mousepos.x = 0
    mousepos.y = 0
  })
  var messagelisteners = []
  var pointerlock_active = false
  var mousepos = {
    x: 0,
    y: 0,
  }
  canvas().onmousemove = (e) => {
    if (pointerlock_active && !!document.pointerLockElement) {
      mousepos.x = e.movementX
      mousepos.y = -e.movementY
      if (Math.abs(mousepos.x) < 5) mousepos.x = 0
      if (Math.abs(mousepos.y) < 5) mousepos.y = 0
      scratchvar("__mousex", mousepos.x)
      scratchvar("__mousey", mousepos.y)
    }
  }
  if (!Array.prototype.none)
    Object.defineProperty(Array.prototype, "none", {
      value: function (callback) {
        return !this.some(callback)
      },
    })
  var rawdata
  window.vm =
    window?.vm ||
    document
      .querySelector("#app")
      ._reactRootContainer._internalRoot.current.child.stateNode.store.getState()
      .scratchGui.vm
  const stage = vm.runtime.getTargetForStage()
  newfunc("vm.runtime._step", () => {
    if (!pointerlock_active && !document.pointerLockElement) {
      mousepos.x = vm.runtime.ioDevices.mouse._scratchX
      mousepos.y = vm.runtime.ioDevices.mouse._scratchY
      scratchvar("__mousex", mousepos.x)
      scratchvar("__mousey", mousepos.y)
      if (pointerlock_active) {
        mousepos.x = 0
        mousepos.y = 0
      }
    }
  })
  document.onpointerlockchange = () => {
    scratchvar("__pointerlock", !!document.pointerLockElement)
  }
  function scratchlist(listname, value, spritename = aaa?.spritename) {
    if (value === undefined && /^\[\]$/.test(listname))
      return JSON.parse(listname)
    if (value !== undefined) {
      if (gettarget(spritename)?.getvar(listname, "list"))
        gettarget(spritename).getvar(listname, "list").value = [...value]
      else console.warn(`list "${listname}" does not exist`)
    } else {
      return gettarget(spritename)?.getvar(listname, "list")?.value
    }
  }
  function scratchvar(varname, value, spritename = aaa?.spritename) {
    if (value !== undefined) {
      if (varname === "__out") {
        scratchvar("__loading", "done", spritename)
        if (scratchlist("debug:outputlog", undefined, spritename))
          updatelist(
            "debug:outputlog",
            (e) => {
              e[e.length - 1] = value
              return e
            },
            spritename,
          )
        if (aaa?.before && aaa.before !== "__out") {
          if (aaa.before.includes("list:")) {
            updatelist(
              aaa.before.replace("list:", ""),
              (e) => {
                e.push(String(value))
                return e
              },
              undefined,
            )
          } else scratchvar(aaa?.before, String(value), varname)
          return
        }
      }
      if (varname === "__error") scratchvar("__loading", "error")
      if (gettarget(spritename)?.getvar(varname))
        gettarget(spritename).getvar(varname).value = String(value)
      else {
        if (
          [
            "__mousey",
            "__mousex",
            "__out",
            "__error",
            "__loading",
            "__script loaded",
          ].includes(varname)
        )
          return
        console.warn(`var "${varname}" does not exist`)
      }
    } else {
      return gettarget(spritename)?.getvar(varname)?.value
    }
  }
  const projectid = location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
  listen(window, "keydown", (e) => {
    var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(
      e.key.toUpperCase(),
    )
    if (index !== -1) {
      vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
    }
    vm.runtime.ioDevices.keyboard._keysPressed.push(e.key.toUpperCase())
  })
  listen(window, "keyup", (e) => {
    var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(
      e.key.toUpperCase(),
    )
    if (index !== -1) {
      vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
    }
  })
  function createelem(elem, data, parent) {
    elem = document.createElement(elem)
    if (data.style)
      data.style.split(" ").forEach((e) => {
        elem.classList.add(e)
      })
    Object.assign(elem.style, data)
    Object.assign(elem, data)
    if (typeof parent == "string") parent = qs(parent)
    parent?.appendChild(elem)
    return elem
  }
  var aaa = "asd"
  window.__scratchextended = {
    inputtype: undefined,
    eventdata: undefined,
    thread: undefined,
    clip(data) {
      return new Promise(function (done, error) {
        if (data)
          navigator.clipboard
            .writeText(data)
            .then(() => {
              done(data)
            })
            .catch(() => {
              done(false)
            })
        else {
          navigator.clipboard
            .readText()
            .then((e) => {
              done(e)
            })
            .catch((e) => {
              error(e)
            })
        }
      })
    },
    open(a, s, d, e) {
      if (e) open(a, s, d).document.write(e)
      else open(a, s, d)
      return true
    },
    popup(text, x, y, w, h) {
      var win
      if (x) {
        x = totype(x, "number", true)
        y = totype(y, "number", true)
        w = totype(w, "number", true)
        h = totype(h, "number", true)
        x = (screen.width / 100) * x
        y = (screen.height / 100) * y
        w = (screen.width / 100) * w
        h = (screen.height / 100) * h
        win = open("", "", `left=${x}, top=${y} width=${w},height=${h}`)
      } else win = open("")
      if (text) win.document.write(text)
      return win
    },
    eval(data) {
      return eval(data)
    },
    alert(data) {
      alert(data)
    },
    prompt(a, s) {
      return prompt(a, s)
    },
    confirm(a) {
      return confirm(a)
    },
    save(key, data) {
      localStorage.setItem(projectid + key, data)
    },
    load(key) {
      return localStorage.getItem(projectid + key)
    },
    clearsave(a) {
      if (a) localStorage.removeItem(key)
      else {
        var n = localStorage.length
        while (n--) {
          var key = localStorage.key(n)
          if (key.startsWith(projectid)) {
            localStorage.removeItem(key)
          }
        }
      }
      return true
    },
    fetch(a, s) {
      s = totype(s, "json")
      return new Promise(function (done) {
        if (s)
          fetch(a, s).then((e) => {
            e.text().then((e) => {
              return e
            })
          })
        else
          fetch(a).then((e) => {
            e.text().then((e) => {
              done(e)
            })
          })
      })
    },
    pointerlock(a) {
      a = totype(a, "bool")
      if (a) pointerlock_active = true
      else {
        pointerlock_active = false
        document.exitPointerLock()
      }
    },
    cursor(a) {
      return (canvas().style.cursor = a)
    },
    escape() {
      return rawdata.replace(/(['"`\\])/g, "\\$1").replaceAll("${", "\\${")
    },
    replace(a, s, d, regex) {
      regex = totype(regex, "bool") || false
      if (regex)
        return a.replace(
          new RegExp(s.match(/(?<=\/).*(?=\/)/)[0], s.split("/").pop()),
          d,
        )
      else return a.replaceAll(s, d)
    },
    substr(a = "", s = "", d = "") {
      return a.substring(s - 1, d)
    },
    press(key) {
      if (key == " ") key = "space"
      if (/^[a-z]$/.test(key)) key = key.toUpperCase()
      var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
      if (index !== -1) {
        vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
      }
      vm.runtime.ioDevices.keyboard._keysPressed.push(key)
      return true
    },
    unpress(key) {
      if (key == " ") key = "space"
      if (/^[a-z]$/.test(key)) key = key.toUpperCase()
      var index = vm.runtime.ioDevices.keyboard._keysPressed.indexOf(key)
      if (index !== -1) {
        vm.runtime.ioDevices.keyboard._keysPressed.splice(index, 1)
      }
      return true
    },
    pressed(keys = "", any = "") {
      keys = [...keys.matchAll(/[a-z:]+/g)].map((e) => e[0])
      keys = keys.map((e) => e.toLowerCase())
      var nokeys = [...any.matchAll(/[a-z:]+/g)].map((e) => e[0])
      nokeys = nokeys.map((e) => e.toLowerCase())
      var x = vm.runtime.ioDevices.keyboard._keysPressed.map((e) =>
        e.toLowerCase(),
      )
      if (mousestate.left) x.push("mouse:left")
      if (mousestate.right) x.push("mouse:right")
      if (mousestate.center) x.push("mouse:center")
      if (any === true) return keys.some((e) => x.includes(e))
      else
        return (
          keys.every((e) => x.includes(e)) && nokeys.none((e) => x.includes(e))
        )
    },
    getkeys(key, list) {
      if (key == "first") {
        return vm.runtime.ioDevices.keyboard._keysPressed[0]
      } else if (key == "last") {
        return vm.runtime.ioDevices.keyboard._keysPressed[
          vm.runtime.ioDevices.keyboard._keysPressed.length - 1
        ]
      } else if (key) {
        return vm.runtime.ioDevices.keyboard._keysPressed.includes(key)
      } else {
        if (list)
          scratchlist(list, vm.runtime.ioDevices.keyboard._keysPressed.sort())
        else
          return JSON.stringify(
            vm.runtime.ioDevices.keyboard._keysPressed.sort(),
          )
      }
    },
    getmouse(button) {
      if (button && mousestate[button] !== undefined) return mousestate[button]
      else return JSON.stringify(mousepos)
    },
    fullscreen(on) {
      on = totype(on, "bool")
      if (on) canvas().requestFullscreen()
      else if (on === undefined) return !!document.fullscreenElement
      else document.exitFullscreen()
      return true
    },
    clearlogs() {
      if (scratchlist("debug:functionlog")) scratchlist("debug:functionlog", [])
      if (scratchlist("debug:datalog")) scratchlist("debug:datalog", [])
      if (scratchlist("debug:outputlog")) scratchlist("debug:outputlog", [])
      return true
    },
    doesitexist(func) {
      return Object.keys(__scratchextended).includes(func)
    },
    requestperms(...d) {
      if (
        (
          JSON.parse(localStorage.getItem("allowed:" + projectid)) || []
        ).includes("all")
      )
        return true
      var perms = [
        ...(JSON.parse(localStorage.getItem("allowed:" + projectid)) || []),
        ...(JSON.parse(localStorage.getItem("denied:" + projectid)) || []),
        ...(JSON.parse(sessionStorage.getItem("temprevoked:" + projectid)) ||
          []),
      ]
      data = d.filter((o) => !perms.some((i) => i === o))
      if (data.length)
        if (confirm(`grant permissions for "${data.join('", "')}"?`)) {
          perms = [
            ...new Set([
              ...(JSON.parse(localStorage.getItem("allowed:" + projectid)) ||
                []),
              ...data,
            ]),
          ]
          localStorage.setItem("allowed:" + projectid, JSON.stringify(perms))
          return true
        } else {
          var perms = [
            ...new Set([
              ...(JSON.parse(
                sessionStorage.getItem("temprevoked:" + projectid),
              ) || []),
              ...data,
            ]),
          ]
          sessionStorage.setItem(
            "temprevoked:" + projectid,
            JSON.stringify(perms),
          )
          return false
        }
      return (
        d.filter((e) =>
          JSON.parse(localStorage.getItem("allowed:" + projectid)).includes(e),
        ).length === d.length
      )
    },
    indexof(x, y) {
      return x.indexOf(y + 1)
    },
    matches(x = "", y = "") {
      return y.test(
        new RegExp(x.match(/(?<=\/).*(?=\/)/)[0], x.split("/").pop()),
      )
    },
    lowercase(data = "") {
      return String(data.toLowerCase())
    },
    uppercase(data = "") {
      return String(data.toUpperCase())
    },
    places(num, places = 3) {
      num = totype(num, "number", true)
      places = totype(places, "number", true)
      return String(Number(num).toFixed(Number(places)))
    },
    turbo(on) {
      on = totype(on, "bool")
      if (on === undefined) return vm.runtime.turboMode
      else vm.setTurboMode(on)
    },
    savefile(data = "", name = "temp.txt") {
      const blob = new Blob([data])
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = name
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      return true
    },
    readfile(accept, readas = "text") {
      //accept:"image/png, image/jpeg"
      return new Promise((resolve) => {
        var s = createelem("input", { type: "file", accept }, document.body)
        s.click()
        s.onchange = () => {
          file = s.files[0]
          var f = new FileReader()
          f.onloadend = () => {
            resolve(f.result)
          }
          f.onerror = (e) => {
            console.warn(e)
            scratchvar("__error", e)
            scratchvar("__loading", "error")
          }
          if (readas == "text") f.readAsText(file)
          if (readas == "dataurl") f.readAsDataURL(file)
          if (readas == "binary") f.readAsBinaryString(file)
        }
      })
    },
    split(z, split, list, spritename) {
      //splits "z:string" by "split:string" and returns it
      if (list) scratchlist(list, z.split(split), spritename)
      else return JSON.stringify(z.split(split))
    },
    join(list, join) {
      //joins "list:name of list" by "join:string"
      return scratchlist(list, scratchlist(list).join(join))
    },
    var(varname, value, sprite) {
      return scratchvar(varname, value, sprite)
    },
    list(list, data) {
      //if "data:set": replaces "list:name of list" with "data: an array" elsereturns "list:name of list" as as an array
      if (data)
        scratchlist(
          list,
          JSON.parse(data).map((e) => {
            return typeof e == "object" ? JSON.stringify(e) : e
          }),
        )
      else return JSON.stringify(scratchlist(list))
    },
    fromms(ms = 0) {
      ms = totype(ms, "number", true)
      return JSON.stringify({
        years: Math.floor(ms / 1000 / 60 / 60 / 24 / 360),
        days: Math.floor(ms / 1000 / 60 / 60 / 24) % 365,
        hours: Math.floor(ms / 1000 / 60 / 60) % 24,
        mins: Math.floor(ms / 1000 / 60) % 60,
        secs: Math.floor(ms / 1000) % 60,
        ms: Math.floor(ms) % 1000,
      })
    },
    toms(ms = 0, secs = 0, mins = 0, hours = 0, days = 0, years = 0) {
      ms = totype(ms, "number", true)
      secs = totype(secs, "number", true)
      mins = totype(mins, "number", true)
      hours = totype(hours, "number", true)
      days = totype(days, "number", true)
      years = totype(years, "number", true)
      return (
        ms +
        secs * 1000 +
        mins * 60000 +
        hours * 3600000 +
        days * 86400000 +
        years * 31560000000
      )
    },
    keeponlyone(arr) {
      arr = totype(arr, "list", true)
      arr = arr.filter((e, i) => i == arr.indexOf(e))
      if (scratchlist(a)) scratchlist(a, arr)
      else return JSON.stringify(arr)
    },
    json(json, value = "") {
      json = totype(json, "json", true)
      if (value.includes("/"))
        value.split("/").forEach((e) => {
          json = json[e]
        })
      else json = json[value]
      //if(json.reverse)
      return typeof json == "string" || typeof json == "number"
        ? json
        : JSON.stringify(json)
    },
    filter(arr, filter) {
      arr = totype(arr, "list", true)
      arr = arr.filter(() => eval(filter))
      if (scratchlist(list)) scratchlist(list, arr)
      else return JSON.stringify(arr)
    },
    map(arr, map) {
      arr = totype(arr, "list", true)
      arr = arr.map(() => eval(map))
      if (scratchlist(list)) scratchlist(list, arr)
      else return JSON.stringify(arr)
    },
    power(x, y) {
      x = totype(x, "number", true)
      y = totype(y, "number", true)
      return Math.pow(x, y)
    },
    createvar(varname, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      gettarget(sprite).createVariable(varname, varname, "", sprite)
      return true
    },
    deletevar(varname, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(varname, "")?.id) {
        gettarget(sprite).deleteVariable(
          gettarget(sprite).getvar(varname, "").id,
        )
        return true
      } else {
        return false
      }
    },
    createlist(list, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      return true
      gettarget(sprite).createVariable(list, list, "list", sprite)
    },
    deletelist(list, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(list, "list")?.id) {
        gettarget(sprite).deleteVariable(
          gettarget(sprite).getvar(list, "list").id,
        )
        return true
      } else {
        return false
      }
    },
    getallvars() {
      return JSON.stringify(vm.runtime.getAllVarNamesOfType())
    },
    math(func, ...num) {
      num = num.map((e) => totype(e, "number", true))
      if (num !== undefined) return Math[func].call(this, ...num)
      else return Math[func]
    },
    showvar(varname, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(varname, "")?.id) {
        vm.runtime._primitives.data_showvariable({
          VARIABLE: gettarget(sprite).getvar(varname, ""),
        })
        return true
      } else {
        return false
      }
    },
    showlist(list, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(list, "list")?.id) {
        vm.runtime._primitives.data_showlist({
          LIST: gettarget(sprite).getvar(list, "list"),
        })
        return true
      } else {
        return false
      }
    },
    hidevar(varname, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(varname, "")?.id) {
        vm.runtime._primitives.data_hidevariable({
          VARIABLE: gettarget(sprite).getvar(varname, ""),
        })
        return true
      } else {
        return false
      }
    },
    hidelist(list, sprite) {
      if (!gettarget(sprite))
        return scratchvar("__error", "sprite does not exist")
      if (gettarget(sprite).getvar(list, "list")?.id) {
        vm.runtime._primitives.data_hidelist({
          LIST: gettarget(sprite).getvar(list, "list"),
        })
        return true
      } else {
        return false
      }
    },
    console(type, ...data) {
      console[type](...data)
    },
    distance(x1, y1, x2, y2) {
      x1 = totype(x1, "number", true)
      y1 = totype(y1, "number", true)
      x2 = totype(x2, "number", false) ?? window.__scratchextended.eventdata.x
      y2 = totype(y2, "number", false) ?? window.__scratchextended.eventdata.y
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    },
    pointto(x, y) {
      x = totype(x, "number")
      y = totype(y, "number")
      return gettarget(
        window.__scratchextended.eventdata.sprite.name,
      ).setDirection(
        scratch_math(
          "atan",
          (window.__scratchextended.eventdata.x - x) /
            (window.__scratchextended.eventdata.y - y),
        ) +
          (window.__scratchextended.eventdata.y >= y) * 180,
      )
    },
    onmessage(message) {
      if (!message) {
        return new Promise(function (done) {
          const index = messagelisteners.length
          messagelisteners.push(function (e) {
            delete messagelisteners[index]
            if (window.__scratchextendendebug) console.log(messagelisteners)
            done(e)
          })
        })
      } else if (/^\/(.*)\/[gimsuy]$/.test(message)) {
        return new Promise(function (done) {
          const index = messagelisteners.length
          messagelisteners.push(function (e) {
            if (
              new RegExp(
                message.match(/^\/(.*)\/([gimsuy]*)$/)[1],
                message.match(/^\/(.*)\/([gimsuy]*)$/)[2],
              ).test(e)
            ) {
              delete messagelisteners[index]
              if (window.__scratchextendendebug) console.log(messagelisteners)
              done(e)
            }
          })
        })
      } else {
        return new Promise(function (done) {
          const index = messagelisteners.length
          messagelisteners.push(function (e) {
            if (e == message) {
              delete messagelisteners[index]
              if (window.__scratchextendendebug) console.log(messagelisteners)
              done(e)
            }
          })
        })
      }
    },
    colorat(x, y, a) {
      x = totype(x, "number", true)
      y = totype(y, "number", true)
      a = totype(a, "bool") || false
      return new Promise(function (done) {
        var gl = canvas().getContext("webgl") || canvas().getContext("webgl2")
        var pixels = new Uint8Array(4)
        const xx = x + 240
        const yy = y + 180
        test()
        function test() {
          gl.readPixels(xx, yy, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
          if (pixels.join(",") === "0,0,0,255") setTimeout(test, 0)
          else {
            var c = [...pixels]
            if (!a) c.pop()
            done(JSON.stringify([...c]))
          }
        }
      })
    },
    arrdistance(arr1, arr2) {
      arr1 = totype(arr1, "list", true)
      arr2 = totype(arr2, "list", true)
      arr1 = [...arr1.matchAll(/[\-0-9]+/g)].map((e) => Number(e[0]))
      arr2 = [...arr2.matchAll(/[\-0-9]+/g)].map((e) => Number(e[0]))
      return dist(arr1, arr2)
      function dist(x, y) {
        var d = 0
        x.forEach((_e, i) => {
          d += x[i] - y[i]
        })
        return Math.abs(d)
      }
    },
    clickat(x, y, time) {
      x = totype(x, "number", true)
      y = totype(y, "number", true)
      time = totype(time, "number")
      return new Promise(function (done) {
        x = Number(x)
        y = -Number(y)
        x += qol.rect(canvas()).x + 240
        y += qol.rect(canvas()).y + 180
        canvas().dispatchEvent(
          new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
          }),
        )
        canvas().dispatchEvent(
          new MouseEvent("mousedown", {
            view: window,
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
          }),
        )
        setTimeout(() => {
          canvas().dispatchEvent(
            new MouseEvent("mouseup", {
              view: window,
              bubbles: true,
              cancelable: true,
              screenX: x,
              screenY: y,
              clientX: x,
              clientY: y,
            }),
          )
          done("")
        }, time || 1)
      })
    },
    nextanswer(answer) {
      return new Promise(function (done) {
        var last = vm.runtime._events.QUESTION
        vm.runtime._events.QUESTION = () => {
          vm.runtime._events.ANSWER(answer)
          setTimeout(() => {
            vm.runtime._events.ANSWER(answer)
            vm.runtime._events.QUESTION = last
            done(answer || "")
          })
        }
      })
    },
    jsonkeys(json, list, sprite) {
      if (scratchlist(list, undefined, sprite))
        return scratchlist(list, Object.keys(JSON.parse(json)), sprite)
      else return JSON.stringify(Object.keys(JSON.parse(json)))
    },
    jsonvalues(json, list, sprite) {
      if (scratchlist(list, undefined, sprite))
        return scratchlist(list, Object.values(JSON.parse(json)), sprite)
      else return JSON.stringify(Object.values(JSON.parse(json)))
    },
    compress(data, value) {
      value = totype(value, "number")
      try {
        return _c(data, value).value
      } catch (e) {
        error(e)
        return "ERROR"
      }
    },
    decompress(data) {
      try {
        return de_c(data)
      } catch (e) {
        error(e)
        return "ERROR"
      }
    },
    pausetimer() {
      vm.runtime.ioDevices.clock.pause()
    },
    resumetimer() {
      vm.runtime.ioDevices.clock.resume()
    },
    tempvar(name, value) {
      return (window.__scratchextended.thread[name] =
        value ?? window.__scratchextended.thread[name])
    },
    testfunction(...a) {
      window.testfunction(...a)
    },
  }
  scratchvar("__script loaded", "true")
  send("__script loaded")
  function run(func, args) {
    scratchvar("__script loaded", "true")
    data = args
    if (scratchlist("debug:functionlog"))
      updatelist(
        "debug:functionlog",
        (e) => {
          e.push(func)
          return e
        },
        undefined,
      )
    if (scratchlist("debug:datalog"))
      updatelist(
        "debug:datalog",
        (e) => {
          e.push(JSON.stringify(args))
          return e
        },
        undefined,
      )
    if (scratchlist("debug:outputlog"))
      updatelist(
        "debug:outputlog",
        (e) => {
          e.push("")
          return e
        },
        undefined,
      )
    if (window.__scratchextendendebug) console.log(func, data)
    try {
      var perms = JSON.parse(localStorage.getItem("allowed:" + projectid)) || []
      var req = func.toLowerCase()
      var noperms =
        JSON.parse(localStorage.getItem("denied:" + projectid)) || []
      if (noperms.includes("all") || noperms.includes(req)) return
      var defaultperms =
        JSON.parse(localStorage.getItem("scratch:defaultperms")) || []
      if (
        ["requestperms", "doesitexist"].includes(req) ||
        perms.includes(req) ||
        defaultperms.includes(req) ||
        perms.includes("all") ||
        defaultperms.includes("all")
      )
        try {
          return window.__scratchextended[req](...args)
        } catch (E) {
          scratchvar("__loading", "error")
          console.trace(E)
        }
      else {
        if (noperms.includes(req)) {
          localStorage.setItem("denied:" + projectid, JSON.stringify(noperms))
          return
        }
        var c = confirm(`grant permission for "${req}"?`)
        if (c) {
          perms.push(req)
          localStorage.setItem("allowed:" + projectid, JSON.stringify(perms))
          return window.__scratchextended[req](...args)
        } else {
          noperms.push(req)
          localStorage.setItem("denied:" + projectid, JSON.stringify(noperms))
        }
      }
    } catch (e) {
      scratchvar("__loading", "error")
      console.trace(e)
    }
  }

  // vm.runtime._events.SAY = (event, type, rawdata) => {
  //   datatype = "say"
  //   window.__scratchextended.eventdata = event
  //   if (__scratchextended[rawdata?.match(/^[a-z0-9]*?(?=[ '"`(])/i)?.[0]])
  //     run(rawdata?.match(/^[a-z0-9]*?(?=[ '"`(])/i)?.[0], parse(rawdata))
  // }
  function updatelist(listname, func, spritename) {
    scratchlist(
      listname,
      func([...scratchlist(listname, undefined, spritename)]),
      spritename,
    )
  }
  function parse(data, canhavevar) {
    rawdata = data
    var rand = Math.random()
    data = data.replaceAll(/\\\\/g, rand).replaceAll("\\n", "\n")
    aaa = (
      data.match(
        /(?:(?<!\\)(["'`])[^]*?(?<!\\)\1)|(?<=\()(?<!(["'`]))[^]*(?=\))/gim,
      ) || []
    ).map((e) => {
      e = e
        .replace(/\\(['"`])/g, "$1")
        .replace(/^["'`]/, "")
        .replace(/["'`]$/, "")
        .replaceAll(rand, "\\")
      if (canhavevar)
        e = e
          .replaceAll(
            /(?<!\\)\$\{([a-z0-9_!@#$%^&*() ,/;'\[\]\\:"<>?\{|~`+\}]+?(?:\.[a-z0-9_!@#$%^&*() ,/;'\[\]\\:"<>?\{|~`+\}]+?)?)\}/g,
            (_full, one) =>
              window.__scratchextended.thread[one] ??
              (one.includes(".")
                ? scratchvar(one.split(".")[1], undefined, one.split(".")[0])
                : scratchvar(one)),
          )
          .replaceAll("\\${", "${")
      return e
    })
    return aaa
  }
  function newfunc(func1, func2) {
    eval(`var a = ${func1}
    var s = ${func2}
    ${func1} = function (...args) {
      try{
        s(arguments)
      }
      catch(e){console.error("${func1.replaceAll('"', '\\"')}", e)}
      return a.call(this, ...args)
    }`)
  }
  function gettarget(sprite) {
    if (sprite) var x = vm.runtime.getSpriteTargetByName(sprite)
    else var x = vm.runtime.getTargetForStage()
    x.getvar = x.lookupVariableByNameAndType
    return x
  }
  window.gettarget = gettarget
  window.stage = stage
  function totype(inp, type, forced) {
    //number, string, list, object, json, bool
    try {
      switch (type) {
        case "number":
          if (inp == "true") inp = 1
          if (inp == "false") inp = 0
          if (/^-?[0-9]*\.?[0-9]+$/.test(inp)) return Number(inp)
          if (inp === "NaN" || inp == "nan") return NaN
          return fail(inp, type, forced)
        case "string":
          return inp
        case "list":
          inp = JSON.parse(inp)
          if (inp.reverse) return inp
          return fail(inp, type, forced)
        case "object":
          inp = JSON.parse(inp.replaceAll("'", '"').replaceAll("`", '"'))
          if (/^[\-0-9]+$/.test(inp) || inp === true || inp === false)
            return undefined
          if (Object.keys(inp).length !== undefined && inp.length === undefined)
            return inp
          return fail(inp, type, forced)
        case "bool":
          if (inp === "1" || inp === "true") return true
          if (inp === "0" || inp === "false") return false
          return fail(inp, type)
        case "json":
          if (
            totype(inp, "object") !== undefined ||
            totype(inp, "list") !== undefined
          )
            return totype(inp, "object") || totype(inp, "list")
          else {
            fail(inp, type, forced)
          }
      }
    } catch (s) {
      return fail(inp, type, forced)
    }

    function fail(inp, type, forced) {
      if (forced) {
        throw new Error(`"${inp}" must be of type "${type}"`)
      } else return undefined
    }
  }

  function scratch_math(operator, n) {
    switch (operator) {
      case "sin":
        return Math.round(Math.sin((Math.PI * n) / 180) * 1e10) / 1e10
      case "cos":
        return Math.round(Math.cos((Math.PI * n) / 180) * 1e10) / 1e10
      case "asin":
        return (Math.asin(n) * 180) / Math.PI
      case "acos":
        return (Math.acos(n) * 180) / Math.PI
      case "atan":
        return (Math.atan(n) * 180) / Math.PI
      case "log":
        return Math.log(n) / Math.LN10
    }
    return 0
  }
  function send(data) {
    vm.runtime.startHats("event_whenbroadcastreceived", {
      BROADCAST_OPTION: data,
    })
  }
  newfunc("vm.runtime.startHats", function (...args) {
    args = args[0]
    if (args[0] == "event_whenbroadcastreceived") {
      if (
        !messagelisteners[messagelisteners.length - 1] &&
        messagelisteners.length
      )
        messagelisteners.pop()
      messagelisteners.forEach((e) => {
        e(args[1].BROADCAST_OPTION)
      })
      if (window.__scratchextendendebug) console.log(messagelisteners)
    }
  })

  var allowedchars =
    "asdfghjklqwertyuiopzxcvbnm,./;'[]`1234567890-=}{\":?><|+_)(*&^%$#@!~\\ASDFGHJKLZXCVBNMQWERTYUIOP "

  function best_c(data) {
    var arr = [Infinity, ""]
    for (var i = 1; i++ < 20; ) {
      var s = _c(data, i).value
      if (s.length < arr[0]) arr = [s.length, s, i]
    }
    return {
      value: arr[1],
      p: Math.round((s.length / data.length) * 10000) / 100,
    }
  }
  var asd = []
  for (var i = 100; i++ < 999; ) {
    var c = String(i)
    while (c.length < 4) c = "1" + c
    eval(`c = "\\u${c}"`)
    if (c) asd.push(c)
  }
  asd = asd.filter((e) => {
    return asd.join("").includes(e)
  })
  asd = asd.filter((e) => !allowedchars.split("").includes(e))
  function de_c(text) {
    const split1 = "\u1000"
    const split2 = "\u1001"
    text = text.split(split1)
    var arr = text[0].split(split2)
    arr.forEach((e, i) => {
      text[1] = text[1].replaceAll(asd[i], e)
    })
    return text[1]
  }
  function _c(t, jj) {
    if (!jj) return best_c(t)
    var origlength = t.length
    const split1 = "\u1000"
    function g(count) {
      var d = ""
      while (count-- > 0) {
        d += "."
      }
      return d
    }
    var dots = g(jj)
    const split2 = "\u1001"
    var t1 = [...t.matchAll(new RegExp(dots, "g"))]
    var c = t.split("")
    c.shift()
    c = c.join("")
    var t2 = [...c.matchAll(new RegExp(dots, "g"))]
    t1 = t1.map((e) => JSON.stringify(e))
    t2 = t2.map((e) => JSON.stringify(e))
    var t1dupes = t1.length - keeponlyone([...t1]).length
    var t2dupes = t2.length - keeponlyone([...t2]).length
    var output = t2dupes > t1dupes ? t2 : t1
    var arr = []
    output.forEach((e, i) => {
      if (output.indexOf(e) !== i) arr.push(JSON.parse(e))
    })
    arr = keeponlyone(arr.flat())
    var x = arr.join(split2)
    arr.forEach((e, i) => {
      t = t.replaceAll(e, asd[i])
    })
    return {
      value: x + split1 + t,
      p: Math.round((t.length / origlength) * 10000) / 100,
    }
  }
}
function canvas() {
  return (
    window?.vm?.runtime?.renderer?.canvas ||
    document.querySelector(
      "#app > div > div.gui_body-wrapper_-N0sA.box_box_2jjDp > div > div.gui_stage-and-target-wrapper_69KBf.box_box_2jjDp > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas",
    ) ||
    document.querySelector(
      "#view > div > div.inner > div:nth-child(2) > div.guiPlayer > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas",
    ) ||
    document.querySelector(
      "#app > div > div > div > div.gui_body-wrapper_-N0sA.box_box_2jjDp > div > div.gui_stage-and-target-wrapper_69KBf.box_box_2jjDp > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div.stage-wrapper_stage-canvas-wrapper_3ewmd.box_box_2jjDp > div > div.stage_stage_1fD7k.box_box_2jjDp > div:nth-child(1) > canvas",
    )
  )
}
listen(window, "mousemove", function () {
  if (!location.href.includes("/editor")) return
  if (!window?.vm?.editingTarget?.comments) return
  var temp = false

  a(vm.editingTarget.comments).foreach(function (a, s) {
    var f = vm.editingTarget.blocks._blocks[s.blockId]
    if (!f) return
    if (f.comment !== a) {
      f.comment = a
      return
    }
    if (f?.opcode !== "operator_gt") return
    if (
      vm.editingTarget.blocks._blocks[f.inputs.OPERAND2.block]?.fields?.TEXT
        ?.value == a
    )
      return
    if (
      vm.editingTarget.blocks._blocks[f.inputs.OPERAND2.block]?.fields?.TEXT
        ?.value === undefined
    )
      return

    vm.editingTarget.blocks._blocks[f.inputs.OPERAND2.block].fields.TEXT.value =
      a
    f.comment = a
    return (temp = true)
  })
  if (temp) vm.emitWorkspaceUpdate()
  a(vm.editingTarget.comments).foreach(function (a, s) {
    var f = vm.editingTarget.blocks._blocks[s.blockId]
    if (!f) delete vm.editingTarget.comments[a]
    else f.comment = a
  })
})
function listen(elem, type, cb) {
  elem.addEventListener(type, cb)
  return [elem, type, cb]
}

function unlisten(data) {
  return data[0].removeEventListener(data[1], data[2])
}
function foreachobj(arr, func) {
  Reflect.ownKeys(arr).forEach((e, i) => {
    func(e, arr[e], i)
  })
}

function keeponlyone(arr) {
  return [...new Set(arr)]
}
