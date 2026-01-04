// ==UserScript==
// @name         scratch extended autocomplete
// @version      0.2
// @description  adds a simple way of searching for functions when selected on a > block - this is meant to be used with my scratch extended script as without it it won't do anything.
// @run-at       document-load
// @author       rssaromeo
// @match        *://scratch.mit.edu/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAkFJREFUeF7l2sFRAzEMBVBSBww3qqAP6qAUiqEFCuDMjQl1wPhgxuw4kS39r28P3JgkjvRsybvenJ5e379v/vHfKRPg6+O5S3378CKbgjSAS8nXzFUIKQBt8ue3zz+zffd4//u/AoEOcC35mrkSgQowkrwagQYwk7wSgQLgSV6FAAeIJK9AgAKMJl+b3nFHaLeHrMYIA5hNviarRoAAeJNfASEM4Em+XvBEPou6dg4BIBJAjBHBcAMgA0eONYvhAmAEzBhzBCMEgO7gCgQKQGQPz0ZYDqAs21mEyG00BaAkEVkFowj1O2QAJVB0H2gbl7USZACjM8ReCVIAFUJva0svgZllirrFZZ0ou5rgcRasWkUhjFzYzL4HApBZDrMJWu+HAeyKAAXYEQEOsBsCBWAnBBrALghUgB0Q6ACrI6QArIyQBrAqQirAigjpAKshSABWQpABrIIgBVgBwQ2APKBQnie4ABg/eVMhhADQP3lTIEAB2KfA7elO9LlDHQsOoEBIPxWuS1X5UKSFlgGUIFgII/1A+mBkJEBvOcyOnb4CagOZDbR8zgqWMea1o3FXE2wHRAaMHMt6HhDaBY6DIwJHjDGadPu+8ApAlIMq+RI7DMB7Y9POBmtHofYARDkwt1OrLKArwFsOipmHNsGe8mhdX5sh1PV+agl4tshegBnJw5sgaiVkJZ8CMLM7eC+drUYnK4HZcsiceXoTnC0HRfJpJXBpJfSQrJulyHLvfZZyHWAFiTxRtr7Lel0CYAWV+foPdui0399khioAAAAASUVORK5CYII=
// @grant        none
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1184528
// @tag          unused
// @downloadURL https://update.greasyfork.org/scripts/476416/scratch%20extended%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/476416/scratch%20extended%20autocomplete.meta.js
// ==/UserScript==
function foreachobj(
  //array
  obj, //object
  cb, //function
) {
  return Reflect.ownKeys(obj).map((e, i) => {
    return cb(e, obj[e], i)
  })
}
function qs(
  //element
  text, //string
  parent = document, //element|string
) {
  //querySelector
  if (gettype(parent) == "string") parent = qs(parent)
  return parent.querySelector(text)
}
function gettype(
  //string
  a, //any
) {
  var thing = a
  var type = "string"
  if (typeof thing == "undefined") return "undefined"
  if (typeof thing == "symbol") return "symbol"
  if (ignore(() => thing.addEventListener) !== undefined) type = "element"
  if (typeof thing == "function") type = "function"
  if (ignore(() => thing.reverse)) type = "array"
  if (!!thing)
    if (Object.keys(thing).length !== undefined && thing.length === undefined)
      type = "object"
  if (typeof thing !== "object")
    if (
      isNaN(thing) &&
      String(Number(thing)) === String(thing) &&
      thing.length === undefined &&
      String(thing) === "NaN" &&
      JSON.stringify(thing) === "null"
    )
      type = "NaN"
  if (typeof thing !== "object") if (String(!!a) === String(a)) type = "boolean"
  if (typeof thing !== "object")
    if (String(Number(thing)) === String(thing) && a[0] === undefined)
      type = "number"
  return type
}
function ignore(
  //any
  func, //func
  senderr, //boolean
) {
  try {
    func()
  } catch (e) {
    return senderr ? e.message : undefined
  }
}
function createelem(
  //element
  elem, //string
  data, //object
  parent, //string|element
) {
  elem = document.createElement(elem)
  if (data.style)
    data.style.split(" ").forEach((e) => {
      elem.classList.add(e)
    })
  Object.assign(elem.style, data)
  Object.assign(elem, data)
  if (typeof parent == "string") parent = a(parent).qs().val
  a(() => parent.appendChild(elem)).ignore()
  return elem
}
function listen(
  //[element, string, function]
  elem, //element
  type, //string
  cb, //function
) {
  elem.addEventListener(type, cb)
  return [elem, type, cb]
}
if (!qs("#scratchextendedstyles"))
  createelem(
    "style",
    {
      innerHTML: `.hide{
                  display:none;
                }
                z:hover{
                  background-color:#999;
                }`,
      id: "scratchextendedstyles",
    },
    document.head,
  )
if (!window.g)
  window.g = createelem(
    "div",
    {
      innerHTML: "asd",
      position: "absolute",
      color: "#777",
      backgroundColor: "#777",
      maxHeight: "200px",
      overflow: "scroll",
      border: "2px solid black",
    },
    document.body,
  )
listen(window, "mousemove", update)
listen(window, "scroll", update)
listen(window, "keyup", update)
listen(window, "keypress", update)
var lastf, lastfhtml
log("asdasdsd")
function update() {
  var f = document.querySelectorAll(
    "g.blocklyDraggable.blocklySelected > * > .blocklyEditableText > text",
  )[0]
  if (f == lastf && f?.innerHTML == lastfhtml) return
  if (!f?.innerHTML) return g.classList.add("hide")
  lastf = f
  lastfhtml = f.innerHTML
  if (!f) return g.classList.add("hide")
  g.classList.remove("hide")
  var temp
  if (!(temp = document.querySelector("g.blocklyDraggable.blocklySelected")))
    return g.classList.add("hide")
  temp = temp["dataset"].id
  temp = vm.editingTarget.blocks._blocks[temp]
  if (!temp) return
  if (temp.opcode !== "operator_gt") return g.classList.add("hide")
  temp = temp.inputs.OPERAND1.block
  var r = rect(f)
  Object.assign(g.style, { top: r.y + r.h * 2 + "px", left: r.x + "px" })
  g.innerHTML = ""
  var projectid = location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
  var allow = [
    ...JSON.parse(localStorage["allowed:" + projectid] ?? "[]"),
    ...JSON.parse(localStorage["scratch:defaultperms"] ?? "[]"),
  ]
  var deny = JSON.parse(localStorage["denied:" + projectid] ?? "[]")
  search(
    f.innerHTML,
    Object.keys(__scratchextended)
      .filter((e) => !["inputtype", "eventdata", "thread"].includes(e))
      .sort(),
  ).forEach((e) => {
    createelem(
      "z",
      {
        f,
        class: "selectables",
        padding: "2px",
        innerHTML: e,
        color: allow.includes(e) ? "#0a0" : deny.includes(e) ? "#a00" : "black",
        onclick(e) {
          var temp
          if (
            !(temp = document.querySelector(
              "g.blocklyDraggable.blocklySelected",
            ))
          )
            return
          temp =
            vm.editingTarget.blocks._blocks[temp["dataset"].id].inputs.OPERAND1
              .block
          vm.editingTarget.blocks._blocks[temp].fields.TEXT.value =
            this.innerHTML
          g.classList.add("hide")
          vm.emitWorkspaceUpdate()
        },
      },
      g,
    )
    createelem("br", {}, g)
  })
}
function rect(e) {
  var { x, y, width, height } = e.getBoundingClientRect().toJSON()
  return { x, y, w: width, h: height }
}
function search(q, o) {
  var arr = []
  o.forEach((e) => {
    var text = e.trim()
    var s = ""
    q.split(" ").forEach((e, i) => {
      s += `(?:^| ).*?${e}.*?`
    })
    if (new RegExp(s, "gi").test(text)) arr.push(e)
  })
  return arr
}
