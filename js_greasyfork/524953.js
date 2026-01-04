// ==UserScript==
// @name         scratch extesion: pointerlock by rssaromeo
// @version      4
// @description  none
// @run-at       document-start
// @author       rssaromeo
// @license      GPLv3
// @match        *://*/*
// @include      *
// @tag          lib
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA8dJREFUeF7Vm/1x1DAQxW1aoIU0QGjlUgLUABVADaSE1EJo4BqAGWo4Zi8RoxP78fZDtsl/Gduy3m/frmRJty4T/h5+P1wmNLs8vX1aq9sta3CWaElwFYwSAFuLb1AqIKQA7CV8dEUGRBhARPz521lN4buPd+EUj0JwA/AItwRbaiNAvCBcAFDxWeEjGC8IDwQYgCW+WrTkDhQGCgECcBTxDUolBBOAJn6rqGfcYDlBBVAh/vnT89/+33+9t+qe+zriBg2CCKBCPKnpAdD/KITHzz9uYHz48i41hEoQWABV4jkACIRRPD1jAaB7LDdwEFwAIjk/OqCFUXNCFIAFAQKARN9jTwmA5AROPOoAZJQYIdw4ABFPL/F0UgPAQchEvy8SWjr0ECAAo/UlAK0Dfb5aAHoIHrDWcOEGgEZfc8DYKQKBAGgQqqLvSYWrAzziW+OWC3oY7y/2AtH3lR+RkeqvucFyggoAqfooCAsCByArHhkV0gC8juBAzIq+lQpUDNeI/TXLRRwxK/oWALouAkDsXwFCaoOcgk6brRFBS4VpADyjxSigT5MqCFIxZAFko98LomFQynEt+v21mRA2AdDEoCC4QlkBgXPBpgCyILIQDgOAQKBuoHuragIEoDL/qfPcVNgjnptRZpwwQvgnBY4MoMHIDJG7A5Ci32yOuiMKYVcAlvje7igI7/fCfwPAO2KgIHYD4Ik+N0GqcsShAFifyCMIFAI9JzliFwDZ6EdBcBBMAPSyyqFQ+hbwRr9B6OcA1qf3CACaCFUDkDoZASBNgNDF1MMAqBTfp4e1X7E5gMrok9DMFFhaFNl8QSQS/Yq1AdeCSEUdiESfIozsI0ScIAI4/TxdFmZJfn2zLudH/VSXd01Qiv4oqBqCtjdwlX76dXrZuViXZaUNilcg0eEQjb4WyUoIEoDrsjjplpbGKwFEFjWqIIQBRGqBFv1I7mYhQFtjmgu8EKo3OKVVpbH+cHAt8a9Z/9JUxQ4ROiPTiqd0zXKCB4D7fADqghnR74F4jtsg0b9xQHtRxgmzAXDp4Ik8Pa8ekcmmgjUXj1ife6Y5QSqqWtUf23OdEkNToUpopB3U+q3t6QclIyKiz3jFszUAqQXtnuhEKSpQei5yQNJ0gFUPjgIhI151gMcJe9QGSzhX8TkHmcflUSdsCaFKPOQArxNmpQYiGo167wTIAVEIFa5AhUfEuxzQU7N+QqNVeWvk8Ahu77F+FaL1x+WAKgiVw2BGfNgBRwCRFQ7NA9BIZVICfUd/X5X4EgeMAmbBqBTd9/kPiqWdQ5N12vYAAAAASUVORK5CYII=
// @grant        none
// @namespace https://greasyfork.org/users/1184528
// @downloadURL https://update.greasyfork.org/scripts/524953/scratch%20extesion%3A%20pointerlock%20by%20rssaromeo.user.js
// @updateURL https://update.greasyfork.org/scripts/524953/scratch%20extesion%3A%20pointerlock%20by%20rssaromeo.meta.js
// ==/UserScript==
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

  var mousepos = {}
  var pointerlock_active = false
  newext(
    "pointerlock",
    "rssaromeo",
    class {
      setpointerlock({ on }) {
        on = totype(on, "bool")
        if (on) pointerlock_active = true
        else {
          pointerlock_active = false
          document.exitPointerLock()
        }
      }
      getpointerlockengaged() {
        return !!document.pointerLockElement
      }
      getpointerlockstate() {
        if (!!document.pointerLockElement) return "active"
        if (pointerlock_active) return "waiting"
        return "dissabled"
      }
      pointerlock_mousex() {
        return mousepos.totalx
      }
      pointerlock_mousey() {
        return mousepos.totaly
      }
      pointerlock_deltax() {
        return mousepos.x
      }
      pointerlock_deltay() {
        return mousepos.y
      }
      pointerlock_resettotalpos() {
        mousepos = { x: 0, y: 0, totalx: 0, totaly: 0 }
      }
    },
    [
      newblock(
        bt.ret,
        "getpointerlockstate",
        "get pointerlock state"
      ),
      newblock(
        bt.bool,
        "getpointerlockengaged",
        "is pointerlock engaged?"
      ),
      newblock(bt.ret, "pointerlock_deltax", "pointerlock: delta x"),
      newblock(bt.ret, "pointerlock_mousex", "pointerlock: mouse x"),
      newblock(bt.ret, "pointerlock_deltay", "pointerlock: delta y"),
      newblock(bt.ret, "pointerlock_mousey", "pointerlock: mouse y"),
      newblock(
        bt.cmd,
        "pointerlock_resettotalpos",
        "pointerlock: reset mouse position to 0,0"
      ),
      newblock(bt.cmd, "setpointerlock", "set pointerlock [on]", [
        newmenu("setpointerlock", { items: ["true", "false"] }),
      ]),
    ],
    "50dd50",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA8dJREFUeF7Vm/1x1DAQxW1aoIU0QGjlUgLUABVADaSE1EJo4BqAGWo4Zi8RoxP78fZDtsl/Gduy3m/frmRJty4T/h5+P1wmNLs8vX1aq9sta3CWaElwFYwSAFuLb1AqIKQA7CV8dEUGRBhARPz521lN4buPd+EUj0JwA/AItwRbaiNAvCBcAFDxWeEjGC8IDwQYgCW+WrTkDhQGCgECcBTxDUolBBOAJn6rqGfcYDlBBVAh/vnT89/+33+9t+qe+zriBg2CCKBCPKnpAdD/KITHzz9uYHz48i41hEoQWABV4jkACIRRPD1jAaB7LDdwEFwAIjk/OqCFUXNCFIAFAQKARN9jTwmA5AROPOoAZJQYIdw4ABFPL/F0UgPAQchEvy8SWjr0ECAAo/UlAK0Dfb5aAHoIHrDWcOEGgEZfc8DYKQKBAGgQqqLvSYWrAzziW+OWC3oY7y/2AtH3lR+RkeqvucFyggoAqfooCAsCByArHhkV0gC8juBAzIq+lQpUDNeI/TXLRRwxK/oWALouAkDsXwFCaoOcgk6brRFBS4VpADyjxSigT5MqCFIxZAFko98LomFQynEt+v21mRA2AdDEoCC4QlkBgXPBpgCyILIQDgOAQKBuoHuragIEoDL/qfPcVNgjnptRZpwwQvgnBY4MoMHIDJG7A5Ci32yOuiMKYVcAlvje7igI7/fCfwPAO2KgIHYD4Ik+N0GqcsShAFifyCMIFAI9JzliFwDZ6EdBcBBMAPSyyqFQ+hbwRr9B6OcA1qf3CACaCFUDkDoZASBNgNDF1MMAqBTfp4e1X7E5gMrok9DMFFhaFNl8QSQS/Yq1AdeCSEUdiESfIozsI0ScIAI4/TxdFmZJfn2zLudH/VSXd01Qiv4oqBqCtjdwlX76dXrZuViXZaUNilcg0eEQjb4WyUoIEoDrsjjplpbGKwFEFjWqIIQBRGqBFv1I7mYhQFtjmgu8EKo3OKVVpbH+cHAt8a9Z/9JUxQ4ROiPTiqd0zXKCB4D7fADqghnR74F4jtsg0b9xQHtRxgmzAXDp4Ik8Pa8ekcmmgjUXj1ife6Y5QSqqWtUf23OdEkNToUpopB3U+q3t6QclIyKiz3jFszUAqQXtnuhEKSpQei5yQNJ0gFUPjgIhI151gMcJe9QGSzhX8TkHmcflUSdsCaFKPOQArxNmpQYiGo167wTIAVEIFa5AhUfEuxzQU7N+QqNVeWvk8Ahu77F+FaL1x+WAKgiVw2BGfNgBRwCRFQ7NA9BIZVICfUd/X5X4EgeMAmbBqBTd9/kPiqWdQ5N12vYAAAAASUVORK5CYII="
  )

  await a.waituntil(canvas)
  window.onblur = () => {
    mousestate = {
      left: false,
      center: false,
      right: false,
    }
  }
  canvas().oncontextmenu = (e) => e.preventDefault()

  canvas().onmousemove = (e) => {
    if (pointerlock_active && !!document.pointerLockElement) {
      mousepos.x = e.movementX
      mousepos.y = -e.movementY
      // if (Math.abs(mousepos.x) < 5) mousepos.x = 0
      // if (Math.abs(mousepos.y) < 5) mousepos.y = 0
      mousepos.totalx ??= 0
      mousepos.totaly ??= 0
      mousepos.totalx += mousepos.x
      mousepos.totaly += mousepos.y
      mousepos.justmoved = 1
      // scratchvar("__mousex", mousepos.x)
      // scratchvar("__mousey", mousepos.y)
    }
  }
  /*newfunc("vm.runtime._step", () => {
  if (!pointerlock_active && !document.pointerLockElement) {
    // mousepos.x = vm.runtime.ioDevices.mouse._scratchX
    // mousepos.y = vm.runtime.ioDevices.mouse._scratchY
    // scratchvar("__mousex", mousepos.x)
    // scratchvar("__mousey", mousepos.y)
  }
  if (!mousepos.justmoved) {
    mousepos.x = 0
    mousepos.y = 0
  }
  mousepos.justmoved = 0
})*/
  // document.onpointerlockchange = () => {
  //   scratchvar("__pointerlock", !!document.pointerLockElement)
  // }

  canvas().addEventListener("click", async () => {
    if (pointerlock_active)
      await canvas().requestPointerLock({
        unadjustedMovement: true,
      })
    mousepos.x = 0
    mousepos.y = 0
  })

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
})()
