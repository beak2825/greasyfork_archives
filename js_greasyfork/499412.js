// ==UserScript==
// @name         florr.io hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the florr.io!
// @author       m28
// @match        https://florr.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499412/florrio%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/499412/florrio%20hack.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // some settings
  const client = {
    autoRespawn: {
      enabled: 0, // set to 1 to autoRespawn in spawnBiome
      spawnBiome: 'Hel'
    },
    bypassAfkCheck: {
      movementCheck: 1,
      afkButton: 1,
    },
    autoGrind: {
     enabled: 0 // set to 1 to enable autoGrind. also set autoRespawn.enabled to 1
    },
    tracers: 1, // draw tracers
  }

  let respawnState = 0 // keep track of whether need to press Continue or Ready
  let lastCheck = 0 // 100 timer
  // use original functions, add prefix
  const _console = {
    _log: window.console.log,
    log: function() {
      this._log(`%c[FlorrScript]`, `color: rgb(30, 150, 30); background: rgb(215, 255, 205)`, ...arguments)
    }
  }
  // array multiplier for canvas untransform
  const multiply = function(t,l){let e=t.length,n=t[0].length,$=l[0].length,r=Array(e);for(let f=0;f<e;++f){let o=Array($);r[f]=o;let g=t[f];for(let h=0;h<$;++h){let u=0;for(let i=0;i<n;++i)u+=g[i]*l[i][h];o[h]=u}}return r}
  // proxy identity function that does nothing
  let identity = function(a, b, c) {
    return Reflect.apply(a, b, c)
  }
  let beforeAnimationFrame = identity
  // keep track of tracers
  let tracers = {}, addTracer = function(t, color) {
    if(!color) { color = '#000000' } // use black if no color
    if(!tracers[color]) { tracers[color] = [] }
    tracers[color].push(t)
  }, mobs = []
  const parseColor = function(str) { // convert hex to [r, g, b]
    return [parseInt(str[1] + str[2], 16), parseInt(str[3] + str[4], 16), parseInt(str[5] + str[6], 16)]
  }
  // mouse position relative to screen center
  let mouse = {
    dx: 0,
    dy: 0
  }
  const main = function() {
    const canvas = document.getElementById('canvas')
    // record actual mouse position
    canvas._addEventListener('mousemove', function(e) {
      mouse.dx = (e.clientX - window.innerWidth * 0.5)
      mouse.dy = (e.clientY - window.innerHeight * 0.5)
    })
    const ctx = canvas.getContext('2d')
    beforeAnimationFrame = function(a, b, c) {
      // we want to run this right after the rendering function
      let n = performance.now()
      let w = canvas.width * 0.5, h = canvas.height * 0.5
      // converting between dom coordinates and canvas coordinates
      let ir = 1 / window.devicePixelRatio
      let dw = w * ir, dh = h * ir
      if(client.autoGrind.enabled) {
        // listeners.keydown({ keyCode:16, preventDefault:function() {} })
        let closestMob = false, closestDistance = -1
        // finding closest mob, doesn't include flowers
        for(let i=mobs.length-1;i>=0;i--) {
          let m = mobs[i]
          let dx = m[0] - w, dy = m[1] - h
          let d = dx * dx + dy * dy
          if(d < closestDistance || closestDistance < 0) {
            closestDistance = d
            closestMob = [dx, dy]
          }
        }
        if(closestMob) {
          let d = 100 * (closestDistance < 1 ? 1 : 1 / Math.sqrt(closestDistance))
          // move mouse to run toward mob
          mouse.dx = closestMob[0] * d
          mouse.dy = closestMob[1] * d
        }
      }
      // if Ready button not present reset state
      if(!buttons.Ready || !client.autoRespawn.enabled) { respawnState = 0 }
      if(n - lastCheck > 100) {
        // runs every 100 ms
        lastCheck = n
        !function() {
          if(client.autoRespawn.enabled) {
            if(respawnState < 1) {
              // change biome to specified biome
              if(buttons[client.autoRespawn.spawnBiome]) {
                if(clickButton(client.autoRespawn.spawnBiome)) {
                  respawnState ++
                }
                return
              }
            } else {
              if(buttons.Ready) {
                // click Ready button
                clickButton('Ready')
                return
              }
            } if(buttons.Continue) {
              // died, click Continue button
              clickButton('Continue')
              // reset state to make sure correct biome
              respawnState = 0
            }
          }
          if(client.bypassAfkCheck.afkButton) {
            // not fully working
            clickButton(`I'm here`)
          }
        }()
      } else if(!buttons.Continue && (client.bypassAfkCheck.movementCheck || client.autoGrind.enabled)) {
        let a = (n / 1000) % (2 * Math.PI)
        let tx = mouse.dx + dw + Math.sin(a), ty = mouse.dy + dh + Math.cos(a)
        // bypass afk check
        listeners.mousemove({
          clientX: tx,
          screenX: tx,
          clientY: ty,
          screenY: ty
        })
      }
      let transform = ctx.getTransform()
      ctx.translate(w, h)
      ctx.lineCap = 'round'
      ctx.miterLimit = 1.68
      ctx.font = '14px Ubuntu'
      for(let color in tracers) {
        let o = tracers[color]
        for(let i=o.length-1;i>=0;i--) {
          let t = o[i]
          let l = 1, a = 1
          // lower rarities are transparent, higher rarities thicker lines
          if(t[2] > 3) {
            l += (t[2] - 3) * 0.5
          } else {
            a = (t[2] + 1) / 4
          }
          let j = a
          // draw dashed line at 50% opacity
          a *= 0.5
          let r = parseColor(color)
          ctx.strokeStyle = `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${a})`
          ctx.setLineDash([10, 15])
          ctx.lineWidth = l
          ctx._beginPath()
          let dx = t[0] - w, dy = t[1] - h
          ctx._moveTo(dx, dy)
          let d = dx * dx + dy * dy
          ctx._lineTo(0, 0)
          ctx._stroke()
          // draw solid line at 25% opacity of dashed line
          a *= 0.25
          ctx.strokeStyle = `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${a})`
          ctx.setLineDash([])
          ctx._stroke()
          ctx._closePath()
          if(d > 300 * 300) {
            // target distance over 300, draw number
            let rd = Math.sqrt(d)
            if(rd < 350) {
              // between 300 and 350 make it transparent
              j *= (rd - 300) * 0.02
            }
            if(j > 0.05) {
              // if under 5% don't draw
              d = 1 / rd
              let y = 300 + (rd - 300) / (rd - 100) * 100
              // calculate text position
              let tx = dx * d * y
              let ty = dy * d * y + 7
              // if rgb(0, 0, 0) use white instead
              if(r[0] === 0 && r[1] === 0 && r[2] === 0) { r[0] = r[1] = r[2] = 255 }
              ctx.fillStyle = `rgb(${r[0]}, ${r[1]}, ${r[2]})`
              ctx.strokeStyle = '#000000'
              ctx.lineWidth = 1.68
              // use j^2 for opacity to make gradient steeper
              j *= j
              // when over 95% use 100% for better performance
              if(j < 0.95) { ctx.globalAlpha = j }
              // number is how many 100's away target is
              let text = '' + Math.round(rd / 100)
              ctx.textAlign = 'center'
              // stroke then fill
              ctx._strokeText(text, tx, ty)
              ctx.lineWidth = 10
              ctx._fillText(text, tx, ty)
              if(j < 0.95) { ctx.globalAlpha = 1 }
            }
          }
        }
      }
      ctx.setTransform(transform)
      let f = c[0]
      if(f.proxy) { c[0] = f.proxy } else {
        c[0] = f.proxy = new Proxy(f, { apply:function(a, b, c) {
          // we want to run these right before the rendering function
          lbuttons = buttons
          buttons = {}
          tracers = {}
          mobs = []
          window.l = listeners
          window.b = buttons
          return Reflect.apply(a, b, c)
        } })
      }
      return Reflect.apply(a, b, c)
    }
  }
  // might be used in the future
  window.console.log = new Proxy(window.console.log, { apply:function(a, b, c) {
    return Reflect.apply(a, b, c)
  } })
  const untransform = function(x, y, t) {
    let r = multiply([[x, y, 1]], [[t.a, t.b, 0], [t.c, t.d, 0], [t.e, t.f, 1]])[0]
    return [r[0] / r[2], r[1] / r[2]]
  }
  let lastText = [], lastWhiteText = []
  // rarity data, useful for determining of some text is a valid rarity type
  let rarities = {
    Common: {
      name: 'Common',
      color: '#7eef6d',
      index: 0
    },
    Unusual: {
      name: 'Unusual',
      color: '#ffe65d',
      index: 1
    },
    Rare: {
      name: 'Rare',
      color: '#4d52e3',
      index: 2
    },
    Epic: {
      name: 'Epic',
      color: '#861fde',
      index: 3
    },
    Legendary: {
      name: 'Legendary',
      color: '#de1f1f',
      index: 4
    },
    Mythic: {
      name: 'Mythic',
      color: '#1fdbde',
      index: 5
    },
    Ultra: {
      name: 'Ultra',
      color: '#ff2b75',
      index: 6
    },
    Super: {
      name: 'Super',
      color: '#000000',
      index: 7
    }
  }
  let colors = {}
  // reversing table for better performance
  for(let r in rarities) {
    colors[rarities[r].color] = rarities[r]
  }
  // funny text modification callback
  const textTransform = function(text, ctx) {
    if(text === 'Plinko') {
      text = 'Scam Machine'
    }
    return text
  }
  let buttons = {}, lbuttons = {}
  // proxy measureText to keep results consistent with fillText and strokeText
  window.CanvasRenderingContext2D.prototype._measureText = window.CanvasRenderingContext2D.prototype.measureText
  window.CanvasRenderingContext2D.prototype.measureText = new Proxy(window.CanvasRenderingContext2D.prototype.measureText, { apply:function(a, b, c) {
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  // proxy strokeText to keep results consistent with fillText
  window.CanvasRenderingContext2D.prototype._strokeText = window.CanvasRenderingContext2D.prototype.strokeText
  window.CanvasRenderingContext2D.prototype.strokeText = new Proxy(window.CanvasRenderingContext2D.prototype.strokeText, { apply:function(a, b, c) {
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  // proxy fillText for tracer detection
  window.CanvasRenderingContext2D.prototype._fillText = window.CanvasRenderingContext2D.prototype.fillText
  window.CanvasRenderingContext2D.prototype.fillText = new Proxy(window.CanvasRenderingContext2D.prototype.fillText, { apply:function(a, b, c) {
    if(lastText[1]) {
      // something detected here
      if(colors[b.fillStyle] && b.globalAlpha >= 1 && lastPaths[0][3] && client.tracers) {
        let t = lastPaths[0]
        if(c[0].startsWith('Lvl ') && parseInt(c[0].slice(4)) >= 0) {
          // flower found. treat it like a mob with rarity determined by level
          t = untransform((t[0] + t[1]) * 0.5, t[2], t[3])
          // tracer is black
          addTracer([t[0], t[1], colors[b.fillStyle].index], '#000000')
          lastPaths = [[], [], []]
        } else if(rarities[c[0]]) {
          // mob found. also includes player summons like egg beetles
          t = untransform((t[0] + t[1]) * 0.5, t[2], t[3])
          // tracer color same as rarity
          addTracer([t[0], t[1], colors[b.fillStyle].index], b.fillStyle)
          mobs.push([t[0], t[1]])
          lastPaths = [[], [], []]
        }
      }
    }
    // this fillText might be a button
    let bd = buttonData[c[0]]
    if(bd && (!bd.color || bd.color === b.fillStyle) && (!bd.font || bd.font === b.font)) {
      // button found
      let t = untransform(c[1], c[2], b.getTransform())
      // if this button was existing last render
      let o = lbuttons[c[0]]
      let n = buttons[c[0]] = {
        x: t[0],
        y: t[1],
        d: 1, // we don't want to click buttons that are moving. only click when d < 0.01
        s: performance.now(), // we want to wait 2000 ms before we click any button
        fillStyle: b.fillStyle,
        font: b.font
      }
      if(o) {
        n.d = Math.abs(n.x - o.x) + Math.abs(n.y - o.y) // calculate speed
        n.s = o.s // this button alr exists so its creation time is lower
      }
    }
    if(c[0] === `I'm here` && client.bypassAfkCheck.afkButton) {
      afkButton(untransform(c[1], c[2], b.getTransform()))
    }
    // for referencing next fillText
    lastText = [c, b.fillStyle]
    if(b.fillStyle === '#ffffff') {
      lastWhiteText = [c, b.fillStyle]
    }
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  let clicking = false
  // I'm here button clicker
  const afkButton = function(t) {
    if(clicking) { return }
    clicking = true
    setTimeout(function() {
      clicking = false
      clickAt(t.x, t.y)
    }, 500 + 2000 * Math.random())
  }
  // buttons we want to look for
  let buttonData = {
    Ready: {
      color: '#ffffff',
      font: '27.5px Ubuntu'
    },
    Garden: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Desert: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Ocean: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Jungle: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Hel: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    'Play as guest': {},
    Continue: {
      color: '#ffffff',
    }
  }
  // keep track of paths, we can find health bars
  let lastPaths = [[], [], []], lastFill = ''
  let path = [], topPath = false, addSegment = function(s) {
    if(topPath) {
      topPath.push(s)
    } else {
      path.push(topPath = [s])
    }
  }
  // proxy beginPath
  window.CanvasRenderingContext2D.prototype._beginPath = window.CanvasRenderingContext2D.prototype.beginPath
  window.CanvasRenderingContext2D.prototype.beginPath = new Proxy(window.CanvasRenderingContext2D.prototype.beginPath, { apply:function(a, b, c) {
    path = []
    topPath = false
    // path restart
    return Reflect.apply(a, b, c)
  } })
  // proxy moveTo
  window.CanvasRenderingContext2D.prototype._moveTo = window.CanvasRenderingContext2D.prototype.moveTo
  window.CanvasRenderingContext2D.prototype.moveTo = new Proxy(window.CanvasRenderingContext2D.prototype.moveTo, { apply:function(a, b, c) {
    addSegment({
      type: 'moveTo',
      x: c[0],
      y: c[1]
    })
    return Reflect.apply(a, b, c)
  } })
  // proxy lineTo
  window.CanvasRenderingContext2D.prototype._lineTo = window.CanvasRenderingContext2D.prototype.lineTo
  window.CanvasRenderingContext2D.prototype.lineTo = new Proxy(window.CanvasRenderingContext2D.prototype.lineTo, { apply:function(a, b, c) {
    addSegment({
      type: 'lineTo',
      x: c[0],
      y: c[1]
    })
    return Reflect.apply(a, b, c)
  } })
  // proxy closePath
  window.CanvasRenderingContext2D.prototype._closePath = window.CanvasRenderingContext2D.prototype.closePath
  window.CanvasRenderingContext2D.prototype.closePath = new Proxy(window.CanvasRenderingContext2D.prototype.closePath, { apply:function(a, b, c) {
    path = []
    topPath = false
    // path destroyed
    return Reflect.apply(a, b, c)
  } })
  // proxy stroke
  window.CanvasRenderingContext2D.prototype._stroke = window.CanvasRenderingContext2D.prototype.stroke
  window.CanvasRenderingContext2D.prototype.stroke = new Proxy(window.CanvasRenderingContext2D.prototype.stroke, { apply:function(a, b, c) {
    // shift paths
    if(path.length === 1 && path[0].length === 2 && path[0][0].y === path[0][1].y) {
      lastPaths[0] = lastPaths[1]
      lastPaths[1] = lastPaths[2]
      lastPaths[2] = [path[0][0].x, path[0][1].x, path[0][0].y, b.getTransform()]
    }
    return Reflect.apply(a, b, c)
  } })
  // proxy fill
  window.CanvasRenderingContext2D.prototype._fill = window.CanvasRenderingContext2D.prototype.fill
  window.CanvasRenderingContext2D.prototype.fill = new Proxy(window.CanvasRenderingContext2D.prototype.fill, { apply:function(a, b, c) {
    lastFill = b.fillStyle
    return Reflect.apply(a, b, c)
  } })
  // proxy requestAnimationFrame for render hooks
  window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, { apply:function(a, b, c) {
    return beforeAnimationFrame(a, b, c)
  } })
  // wait for load
  const interval = setInterval(function() {
    if(document.body) {
      clearInterval(interval)
      main()
    }
  })
  // we can force an arraybuffer instantiation if want
  if(0) {
    window.WebAssembly.instantiateStreaming = new Proxy(window.WebAssembly.instantiateStreaming, { apply:function(a, b, c) {
      let d = new Response()
      c[0] = d
      return Reflect.apply(a, b, c)
    } })
  }
  const listeners = {}, trigger = function(type, data) {
    if(listeners[type]) { listeners[type](data) }
  }
  // universal hook for event listeners
  const listenerApply = function(a, b, c) {
    if(c[0] === 'mousemove') {
      listeners.mousemove = c[1]
    }
    if(c[0] === 'blur' || c[0] === 'focus' || c[0] === 'visibilitychange') {
      // makes it easier to afk and stuff
      return
    }
    if(b && b.id === 'canvas') {
      if(c[0] === 'mousedown') {
        listeners.mousedown = c[1]
      }
    }
    if(c[0] === 'mouseup') {
      listeners.mouseup = c[1]
    }
    if(c[0] === 'keydown') {
      listeners.keydown = c[1]
    }
    if(c[0] === 'keyup') {
      listeners.keyup = c[1]
    }
    return Reflect.apply(a, b, c)
  }
  const clickAt = function(x, y) {
    let ir = 1 / window.devicePixelRatio
    x *= ir
    y *= ir
    // move mouse
    listeners.mousemove({
      clientX: x,
      screenX: x,
      clientY: y,
      screenY: y
    })
    // mouse down
    listeners.mousedown({
      preventDefault: function() {},
      clientX: x,
      clientY: y
    })
    // mouse up
    listeners.mouseup({
      preventDefault: function() {},
      clientX: x,
      clientY: y
    })
  }
  const clickButton = function(text) {
    if(buttons[text]) {
      if(buttons[text].d > 0.01) {
        // moving fast, don't click moving buttons
        return
      }
      let n = performance.now()
      if(n - buttons[text].s < 2000) {
        // at least 2000 ms until clickable
        return
      }
      clickAt(buttons[text].x, buttons[text].y)
      return true
    }
  }
  // hook event listeners
  HTMLElement.prototype._addEventListener = HTMLElement.prototype.addEventListener
  HTMLElement.prototype.addEventListener = new Proxy(HTMLElement.prototype.addEventListener, { apply:listenerApply })
  window.addEventListener = new Proxy(window.addEventListener, { apply:listenerApply })
  document.addEventListener = new Proxy(document.addEventListener, { apply:listenerApply })
  localStorage.florrio_tutorial = 'complete'
})();