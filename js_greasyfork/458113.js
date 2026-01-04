// ==UserScript==
// @name         Draw on page using a pen or mouse
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hotkey based on page drawer.
// @author       @alexrintt
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458113/Draw%20on%20page%20using%20a%20pen%20or%20mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/458113/Draw%20on%20page%20using%20a%20pen%20or%20mouse.meta.js
// ==/UserScript==
(function () {
  window.onload = () => {
    const CANVAS_ID = `__on__page__drawing__`
    const SUPPORT_CANVAS_ID = `__on__page__drawing__support__`
    const CANVAS_COMMON_CLASS = `__on__page__drawing__class__`
    const RADIUS_CONFIG_LOCAL_KEY = `drawing__radius__size___`
    const canvasStyle = `
  <style>
    .${CANVAS_COMMON_CLASS} {
      touch-action: none;
      box-sizing: border-box;
      position: fixed;
      top: 0;.
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 10000;
      width: 100%;
      height: 100%;
      visibility: hidden;
    }
    #${CANVAS_ID} {
      background: rgba(0,0,0,0.4);
    }
  </style>
`
    const canvasHtml = `
  <canvas class="${CANVAS_COMMON_CLASS}" id="${CANVAS_ID}"></canvas>
  <canvas class="${CANVAS_COMMON_CLASS}" id="${SUPPORT_CANVAS_ID}"></canvas>
`
    window.document.body.insertAdjacentHTML(`beforeend`, canvasHtml)
    window.document.head.insertAdjacentHTML(`beforeend`, canvasStyle)

    const canvas = window.document.getElementById(CANVAS_ID)
    const support = window.document.getElementById(SUPPORT_CANVAS_ID)

    const canvasPhysicalSize = canvas.getBoundingClientRect()
    const supportPhysicalSize = support.getBoundingClientRect()

    canvas.width = canvasPhysicalSize.width
    canvas.height = canvasPhysicalSize.height
    support.width = supportPhysicalSize.width
    support.height = supportPhysicalSize.height

    let recording = false

    const ctx = canvas.getContext(`2d`)
    const sctx = support.getContext(`2d`)

    let stack = []
    let lastPos = undefined
    let radius = Number(window.localStorage.getItem(RADIUS_CONFIG_LOCAL_KEY)) ||
      (() => {
        window.localStorage.setItem(RADIUS_CONFIG_LOCAL_KEY, 5)
        return 5
      })()

    function drawPointerCircle(x, y) {
      if (!isCanvasVisible()) return
      sctx.clearRect(0, 0, support.width, support.height)
      sctx.beginPath()
      sctx.strokeStyle = 'orange';
      sctx.arc(x, y, radius, 0, Math.PI * 2, false);
      sctx.stroke()
    }

    function getPointerEventCoord(e) {
      let x, y
      switch (e.pointerType) {
        case `mouse`:
          x = e.x
          y = e.y
          break
        case `pen`:
          x = e.x
          y = e.y
          break
      }
      return {
        x,
        y
      }
    }

    function record(e) {
      e.stopPropagation()
      const {
        x,
        y
      } = getPointerEventCoord(e)
      lastPos = {
        x,
        y
      }
      const hasPenPressureWhenApplicable = e.pointerType === `pen` ? e
        .pressure > 0 : true
      drawPointerCircle(x, y)
      if (!recording || !hasPenPressureWhenApplicable) return
      pushStackPoint(x, y)
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawStack() {
      const entries = stack.filter(e => e.enabled)
      for (const entry of entries) {
        const points = entry.points.filter(p => p && p.x && p.y)
        const radiusAvg = entry.points.map(p => p.radius || 0).reduce((acc,
          e) => acc + e, 0) / entry.points.length
        if (points.length) {
          ctx.lineWidth = radiusAvg
          ctx.strokeStyle = "rgb(255, 255, 255)"
          ctx.fillStyle = "rgb(255, 255, 255)"
          drawPoints(ctx, points)
        }
      }
    }
    // https://stackoverflow.com/a/10568043/11793117.
    function drawPoints(ctx, points) {
      // draw a basic circle instead
      if (points.length < 6) {
        var b = points[0];
        ctx.beginPath();
        ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
        ctx.closePath();
        ctx.fill();
        return
      }
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      // draw a bunch of quadratics, using the average of two points as the control point
      let i = 1
      for (; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2,
          d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d)
      }
      ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i +
        1].y);
      ctx.stroke();
    }
    const KEY_Z = 90
    const KEY_Y = 89
    const KEY_ESC = 27
    const KEY_BACKSPACE = 8
    const KEY_D = 68
    const KEY_NUMPAD_PLUS = 107
    const KEY_NUMPAD_MINUS = 109
    const KEY_C = 67
    let visible = false

    function hideCanvas() {
      visible = false
      canvas.style.visibility = "hidden"
      support.style.visibility = "hidden"
    }

    function showCanvas() {
      visible = true
      canvas.style.visibility = "visible"
      support.style.visibility = "visible"
    }

    function isCanvasVisible() {
      return visible
    }

    function toggleCanvasVisibility() {
      if (isCanvasVisible()) {
        hideCanvas()
      } else {
        showCanvas()
      }
    }

    function onKeyUp() { }

    function onKeyDown(e) {
      if (e.keyCode === KEY_ESC || e.keyCode === KEY_BACKSPACE) {
        clearStack()
      } else {
        if (e.shiftKey && e.ctrlKey) {
          if (e.keyCode === KEY_Z) {
            redo()
          }
        } else if (e.shiftKey) {
          if (e.keyCode === KEY_C) {
            clearStack()
          } else if (e.keyCode === KEY_D) {
            toggleCanvasVisibility()
          } else if (e.keyCode === KEY_NUMPAD_PLUS) {
            radius += 2
            drawPointerCircle(lastPos.x, lastPos.y)
            window.localStorage.setItem(RADIUS_CONFIG_LOCAL_KEY, radius)
          } else if (e.keyCode === KEY_NUMPAD_MINUS) {
            radius -= 2
            drawPointerCircle(lastPos.x, lastPos.y)
            window.localStorage.setItem(RADIUS_CONFIG_LOCAL_KEY, radius)
          }
        } else if (e.ctrlKey) {
          if (e.keyCode === KEY_Z) {
            undo()
          } else if (e.keyCode === KEY_Y) {
            redo()
          }
        }
      }
    }

    function redraw() {
      clearCanvas()
      drawStack()
    }

    function undo() {
      const last = stack.map(e => e.enabled).lastIndexOf(true)
      if (last === -1) return // ignore, there no drawing undo.
      stack[last].enabled = false
      redraw()
    }

    function clearStack() {
      stack = []
      redraw()
    }

    function redo() {
      const first = stack.findIndex(e => !e.enabled)
      if (first === -1) return // There nothing to redo.
      stack[first].enabled = true
      redraw()
    }

    function pushStackPoint(x, y) {
      if (!recording || !isCanvasVisible()) return
      // Remove disabled old entries since this current push call overrides it.
      stack = stack.filter(e => e.enabled)
      if (!stack.length) pushStackEntry()
      stack[stack.length - 1] = {
        ...stack[stack.length - 1],
        points: [...((stack[stack.length - 1] || {}).points || []), {
          x,
          y,
          radius
        }]
      }
      redraw()
    }

    function pushStackEntry() {
      stack.push({
        points: [],
        enabled: true
      })
    }

    function startRecording() {
      recording = true
      pushStackEntry()
    }

    function stopRecording() {
      recording = false
    }
    window.addEventListener('pointerdown', startRecording)
    window.addEventListener('pointermove', record)
    window.addEventListener('pointerup', stopRecording)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.onclick = console.log
  }
})();