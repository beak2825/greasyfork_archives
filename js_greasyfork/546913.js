// ==UserScript==
// @name        arras - build parser
// @namespace   Violentmonkey Scripts
// @match       https://arras.io/*
// @grant       none
// @version     1.2
// @author      ales
// @description use window.build to get the current player build! note: with release of future builds pointer to values may change
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546913/arras%20-%20build%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/546913/arras%20-%20build%20parser.meta.js
// ==/UserScript==

let ptr = 0

let WebAssembly_instantiateStreaming = WebAssembly.instantiateStreaming
WebAssembly.instantiateStreaming = async function(wasm, imports) {

  // prevent randomness in encoded values
  for (let i = 0; i < imports[0].length; i++) {
    if (imports[0][i].toString() === "()=>crypto.getRandomValues(new Uint32Array(1))[0]") {
      imports[0][i] = () => [0]
      break
    }
  }

  let instance = await WebAssembly_instantiateStreaming.call(this, wasm, imports)
  let memory_export
  for (let i in instance.instance.exports) {
    if (instance.instance.exports[i] instanceof WebAssembly.Memory) {
      memory_export = i
      break
    }
  }

  Object.defineProperty(window, "HEAPU32", { get() { return new Uint32Array(instance.instance.exports[memory_export].buffer) } })

  return instance
}

Object.defineProperty(window, "build", {
  get() {
    let c
    let build

    c = HEAPU32[ptr + 1]
    max_health = ((c >> 16) & 0xFF) ^ 159 // max health
    body_damage = (c & 0xFF) ^ 213 // body damage

    c = HEAPU32[ptr + 2]
    bullet_health = ((c >> 16) & 0xFF) - 193 // bullet health
    bullet_speed = (c & 0xFF) - 240 // bullet speed

    c = HEAPU32[ptr + 3]
    bullet_damage = ((c >> 16) & 0xFF) ^ 43 // bullet damage
    bullet_penetration = (c & 0xFF) ^ 199 // bullet penetration

    c = HEAPU32[ptr + 4]
    movement_speed = ((c >> 16) & 0xFF) - 47 // movement speed
    reload = (c & 0xFF) - 214 // reload

    c = HEAPU32[ptr + 5]
    shield_capacity = ((c >> 16) & 0xFF) ^ 86 // shield capacity
    shield_regeneration = (c & 0xFF) ^ 41 // shield regeneration

    build = new Uint8Array([body_damage, max_health, bullet_speed, bullet_health, bullet_penetration, bullet_damage, reload, movement_speed, shield_regeneration, shield_capacity])

    return {
      build_points: HEAPU32[ptr] - 1607198298,
      body_damage: build[0],
      max_health: build[1],
      bullet_speed: build[2],
      bullet_health: build[3],
      bullet_penetration: build[4],
      bullet_damage: build[5],
      reload: build[6],
      movement_speed: build[7],
      shield_regeneration: build[8],
      shield_capacity: build[9],
      string: `${build[0]}/${build[1]}/${build[2]}/${build[3]}/${build[4]}/${build[5]}/${build[6]}/${build[7]}/${build[8]}/${build[9]}`
    }
  }
})

// search pointer (bad)
setInterval(() => {
  if (ptr || !window.HEAPU32) return

  let start_addr = 0
  while(true) {
    let index = HEAPU32.indexOf(1607198298, start_addr + 1)
    if (index !== -1) {
      start_addr = index
    } else {
      ptr = start_addr
      break
    }
  }
}, 500)