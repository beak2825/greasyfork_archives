// ==UserScript==
// @name         scratch extended - change perms
// @version      0.1
// @description  none
// @run-at context-menu
// @author       You
// @match        *://scratch.mit.edu/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAkFJREFUeF7l2sFRAzEMBVBSBww3qqAP6qAUiqEFCuDMjQl1wPhgxuw4kS39r28P3JgkjvRsybvenJ5e379v/vHfKRPg6+O5S3378CKbgjSAS8nXzFUIKQBt8ue3zz+zffd4//u/AoEOcC35mrkSgQowkrwagQYwk7wSgQLgSV6FAAeIJK9AgAKMJl+b3nFHaLeHrMYIA5hNviarRoAAeJNfASEM4Em+XvBEPou6dg4BIBJAjBHBcAMgA0eONYvhAmAEzBhzBCMEgO7gCgQKQGQPz0ZYDqAs21mEyG00BaAkEVkFowj1O2QAJVB0H2gbl7USZACjM8ReCVIAFUJva0svgZllirrFZZ0ou5rgcRasWkUhjFzYzL4HApBZDrMJWu+HAeyKAAXYEQEOsBsCBWAnBBrALghUgB0Q6ACrI6QArIyQBrAqQirAigjpAKshSABWQpABrIIgBVgBwQ2APKBQnie4ABg/eVMhhADQP3lTIEAB2KfA7elO9LlDHQsOoEBIPxWuS1X5UKSFlgGUIFgII/1A+mBkJEBvOcyOnb4CagOZDbR8zgqWMea1o3FXE2wHRAaMHMt6HhDaBY6DIwJHjDGadPu+8ApAlIMq+RI7DMB7Y9POBmtHofYARDkwt1OrLKArwFsOipmHNsGe8mhdX5sh1PV+agl4tshegBnJw5sgaiVkJZ8CMLM7eC+drUYnK4HZcsiceXoTnC0HRfJpJXBpJfSQrJulyHLvfZZyHWAFiTxRtr7Lel0CYAWV+foPdui0399khioAAAAASUVORK5CYII=
// @grant        none
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/476417/scratch%20extended%20-%20change%20perms.user.js
// @updateURL https://update.greasyfork.org/scripts/476417/scratch%20extended%20-%20change%20perms.meta.js
// ==/UserScript==

(function() {
if (window?.__scratchextended) {
  var ___scratchextended = ["all", ...Object.keys(__scratchextended).filter(
      (e) => !["inputtype", "eventdata", "thread"].includes(e)
    )]
  var perms = JSON.parse(localStorage.getItem(`scratch:defaultperms`) || '[""]')

  var div = createelem(
    "div",
    {
      position: "absolute",
      top: 0,
      left: "0",
      width: "min-content",
      height: "0",
      backgroundColor: "#444",
      zIndex: 9999999,
    },
    document.body
  )
  createelem(
    "p",
    { innerHTML: "default perms", color: "#0f0", backgroundColor: "#777" },
    div
  )
  createelem(
    "button",
    {
      innerHTML: "+",
      onclick: () => {
        var v = (___scratchextended).filter((k) => {
          return ![...div.querySelectorAll("select")]
            .map((e) => e.value || e)
            .includes(k)
        })
        createoptions("", v, div)
      },
    },
    div
  )
  createelem(
    "button",
    {
      innerHTML: "save",
      onclick: () => {
        localStorage.setItem(
          `scratch:defaultperms`,
          JSON.stringify(
            [...div.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `allowed:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div2.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `denied:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div3.querySelectorAll("select")].map((e) => e.value)
          )
        )
        div.remove()
        div2.remove()
        div3.remove()
      },
    },
    div
  )
  var v = (___scratchextended).filter((k) => {
    return ![...perms, ...div.querySelectorAll("select")]
      .map((e) => e.value || e)
      .includes(k)
  })
  perms.forEach((e) => {
    createoptions(e, v, div)
  })

  var perms2 = JSON.parse(
    localStorage.getItem(
      `allowed:${location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"}`
    ) || '[""]'
  )

  var div2 = createelem(
    "div",
    {
      position: "absolute",
      top: 0,
      left: "150px",
      width: "min-content",
      height: "0",
      backgroundColor: "#444",
      zIndex: 9999999,
    },
    document.body
  )
  createelem(
    "p",
    { innerHTML: "allowed perms", color: "#0f0", backgroundColor: "#777" },
    div2
  )
  createelem(
    "button",
    {
      innerHTML: "+",
      onclick: () => {
        var v = (___scratchextended).filter((k) => {
          return ![...div2.querySelectorAll("select")]
            .map((e) => e.value || e)
            .includes(k)
        })
        v = v.filter((e) => !perms.includes(e))
        createoptions("", v, div2)
      },
    },
    div2
  )
  createelem(
    "button",
    {
      innerHTML: "save",
      onclick: () => {
        localStorage.setItem(
          `scratch:defaultperms`,
          JSON.stringify(
            [...div.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `allowed:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div2.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `denied:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div3.querySelectorAll("select")].map((e) => e.value)
          )
        )
        div.remove()
        div2.remove()
        div3.remove()
      },
    },
    div2
  )
  var v = (___scratchextended).filter((k) => {
    return ![...perms2, ...div2.querySelectorAll("select")]
      .map((e) => e.value || e)
      .includes(k)
  })
  v = v.filter((e) => !perms.includes(e))
  perms2.forEach((e) => {
    createoptions(e, v, div2)
  })

  var perms3 = JSON.parse(
    localStorage.getItem(
      `denied:${location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"}`
    ) || '[""]'
  )

  var div3 = createelem(
    "div",
    {
      position: "absolute",
      top: 0,
      left: "300px",
      width: "min-content",
      height: "0",
      backgroundColor: "#444",
      zIndex: 9999999,
    },
    document.body
  )
  createelem(
    "p",
    { innerHTML: "denied perms", color: "#0f0", backgroundColor: "#777" },
    div3
  )
  createelem(
    "button",
    {
      innerHTML: "+",
      onclick: () => {
        var v = (___scratchextended).filter((k) => {
          return ![...div3.querySelectorAll("select")]
            .map((e) => e.value || e)
            .includes(k)
        })
        v = v.filter((e) => !perms.includes(e))
        createoptions("", v, div3)
      },
    },
    div3
  )
  createelem(
    "button",
    {
      innerHTML: "save",
      onclick: () => {
        localStorage.setItem(
          `scratch:defaultperms`,
          JSON.stringify(
            [...div.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `allowed:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div2.querySelectorAll("select")].map((e) => e.value)
          )
        )
        localStorage.setItem(
          `denied:${
            location.href.match(/(?<=\/)[0-9]+(?=\/)/)?.[0] || "local"
          }`,
          JSON.stringify(
            [...div3.querySelectorAll("select")].map((e) => e.value)
          )
        )
        div.remove()
        div2.remove()
        div3.remove()
      },
    },
    div3
  )
  var v = (___scratchextended).filter((k) => {
    return ![...perms3, ...div3.querySelectorAll("select")]
      .map((e) => e.value || e)
      .includes(k)
  })
  v = v.filter((e) => !perms.includes(e))
  perms3.forEach((e) => {
    createoptions(e, v, div3)
  })

  function createoptions(perm, options, div) {
    options = options.filter((e) => e !== perm)
    var s = createelem(
      "select",
      {
        onchange: (e) => {
          if (e.target.value == "remove") {
            e.target.remove()
          }
        },
      },
      div
    )
    ;["remove", perm, ...options].forEach((e) => {
      if (e !== "requestperms")
        createelem("option", { value: e, innerHTML: e }, s)
    })
    s.value = perm
  }
  function createelem(elem, data, parent) {
    elem = document.createElement(elem)
    if (data.style)
      data.style.split(" ").forEach((e) => {
        elem.classList.add(e)
      })
    Object.assign(elem.style, data)
    Object.assign(elem, data)
    if (typeof parent == "string") parent = zzz.qs(parent)
    parent?.appendChild(elem)
    return elem
  }
} else {
  alert('you must have scratch extended running before this can be run')
}

})();