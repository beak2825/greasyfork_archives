// ==UserScript==
// @name         scratch - show unused blocks
// @version      2
// @description  adds a unused blocks tab to the debug panel of scratch addons that shows all custom blocks that exist but are not called and all that call to a nonexistant custom block
// @license      GPLv3
// @tag          more info
// @run-at       document-start
// @author       rssaromeo
// @match        *://scratch.mit.edu/*
// @icon         https://scratch.mit.edu/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/491555/scratch%20-%20show%20unused%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/491555/scratch%20-%20show%20unused%20blocks.meta.js
// ==/UserScript==
;(async () => {
  const a = loadlib("newallfuncs")
  await loadlib("libloader").waitforlib("scratch")
  const { vm } = loadlib("scratch")
  await a.waitforelem(".sa-debugger-tabs>li")
  var unusedblocks = a.createelem(".sa-debugger-tabs", "li", {
    class: "scratchCategoryId-myBlocks",
    innerHTML: `<div class="scratchCategoryItemBubble" style="background-color: rgb(94, 30, 63); border-color: rgb(255, 0, 132);"></div>unused blocks`,
    onclick(e) {
      e.stopImmediatePropagation()
      a.qs(".sa-debugger-tab-selected").classList.remove(
        "sa-debugger-tab-selected"
      )
      this.classList.add("sa-debugger-tab-selected")
      var content = a.qs(".sa-debugger-tab-content")
      content.innerHTML = ""
      var arrs = {}
      vm.runtime.targets.forEach((target) =>
        Object.entries(target.blocks._blocks)
          .filter(
            (target) =>
              target[1].opcode == "procedures_call" ||
              target[1].opcode == "procedures_prototype"
          )
          .forEach((e) => {
            if (!arrs[target.sprite.name])
              arrs[target.sprite.name] = {
                procedures_prototype: [],
                procedures_call: [],
              }
            arrs[target.sprite.name][e[1].opcode].push(
              e[1]?.mutation?.proccode
            )
          })
      )
      var parents = {}
      Object.entries(arrs).forEach(
        ([name, { procedures_call, procedures_prototype }]) => {
          procedures_call.forEach((call) => {
            if (!procedures_prototype.includes(call)) {
              if (
                [
                  "breakpoint",
                  "​​warn​​ %s",
                  "​​log​​ %s",
                  "​​error​​ %s",
                  "​​breakpoint​​",
                ].includes(call)
              )
                return
              var parent =
                parents[name] ??
                content.appendChild(
                  a.newelem("div", {
                    id: "ubpar" + name,
                    width: "calc(100% - 8px)",
                    border:
                      vm.editingTarget.sprite.name == name
                        ? "4px solid #090"
                        : "4px solid #900",
                    backgroundColor:
                      vm.editingTarget.sprite.name == name
                        ? "#070"
                        : "#700",
                    innerHTML: `${name}`,
                  })
                )
              parents[name] ??= parent
              parent.appendChild(
                a.newelem("div", {
                  width: "calc(100% - 48px)",
                  position: "relative",
                  left: "40px",
                  border: "4px solid #990",
                  backgroundColor: "#770",
                  innerHTML: `call to non existent function "${call}"`,
                  onclick() {
                    if (vm.editingTarget.sprite.name == name)
                      goto("define " + call)
                  },
                })
              )
            }
          })
          procedures_prototype.forEach((prototype) => {
            if (!procedures_call.includes(prototype)) {
              var parent =
                parents[name] ??
                content.appendChild(
                  a.newelem("div", {
                    id: "ubpar" + name,
                    width: "calc(100% - 8px)",
                    border:
                      vm.editingTarget.sprite.name == name
                        ? "4px solid #090"
                        : "4px solid #900",
                    backgroundColor:
                      vm.editingTarget.sprite.name == name
                        ? "#070"
                        : "#700",
                    innerHTML: `${name}`,
                  })
                )
              parents[name] ??= parent
              parent.appendChild(
                a.newelem("div", {
                  width: "calc(100% - 48px)",
                  position: "relative",
                  left: "40px",
                  border: "4px solid #990",
                  backgroundColor: "#770",
                  innerHTML: `unused function "${prototype}"`,
                  onclick() {
                    if (vm.editingTarget.sprite.name == name)
                      goto("define " + prototype)
                  },
                })
              )
            }
          })
        }
      )
    },
  })
  a.qsa(".sa-debugger-tabs>li").map((e) =>
    a.listen(e, "click", function (e) {
      log(e.target)
      if (e.target !== unusedblocks)
        unusedblocks.classList.remove("sa-debugger-tab-selected")
    })
  )
  function goto(text) {
    var find = a.qs("#sa-find-input")
    find.value = text
    // find.blur()
    find.focus()
    a.qs(
      '.sa-find-dropdown>li[style="display: block;"]'
    ).dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    )
  }
})()
