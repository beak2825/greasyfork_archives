// ==UserScript==
// @name         Gartic Phone Draw Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      GNU
// @description  Auto drawing bot!
// @author       petmshall (peter-marshall5)

// @match        *://garticphone.com/*
// @connect      garticphone.com
// @exclude      *://garticphone.com/_next/*

// @icon         https://www.google.com/s2/favicons?domain=garticphone.com

// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_log

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495177/Gartic%20Phone%20Draw%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/495177/Gartic%20Phone%20Draw%20Bot.meta.js
// ==/UserScript==





function requestText (url) {
  return fetch(url).then((d) => {return d.text()})
}

function requestBuffer (url) {
  return fetch(url).then((d) => {return d.arrayBuffer()})
}

// Generate decimal to hexadecimal conversion table
let hexTable = []
for (let i = 0; i < 256; i++) {
  let hex = i.toString(16)
  if (hex.length < 2) {
    hex = '0' + hex
  }
  hexTable.push(hex)
}

function rgbToHex (r, g, b) {
  return `#${hexTable[r]}${hexTable[g]}${hexTable[b]}`
}

// Check if in a gamemode with animation
// Ex. Animation, Background, Solo
function isAnimation () {
  return Boolean(document.getElementsByClassName('note').length)
}

// Proxy to modify client script
Node.prototype.appendChild = new Proxy( Node.prototype.appendChild, {
  async apply (target, thisArg, [element]) {
    if (element.tagName == "SCRIPT") {
      if (element.src.indexOf('draw') != -1) {
        let text = await requestText(element.src)
        text = editScript(text)
        let blob = new Blob([text])
        element.src = URL.createObjectURL(blob)
      }
    }
    return Reflect.apply( ...arguments )
  }
})

/* stroke configuration note */
/* [toolID, strokeID, [color, 18, 0.6], [x0, y0]. [x1, y1], ..., [xn, yn]] */

function editScript (text) {
  // Find the final draw function
  let functionFinalDraw = text.match(/function\s\w{1,}\(\w{0,}\){[^\{]+{[^\}]{0,}return\[\]\.concat\(Object\(\w{0,}\.*\w{0,}\)\(\w{0,}\),\[\w{0,}\]\)[^\}]{0,}}[^\}]{0,}}/g)[0]
  // find the variable that setData is part of
  let setDataVar = functionFinalDraw.match(/\w{1,}(?=\.setData)/g)[0]
  // Expose setData to the script
  text = text.replace(/\(\(function\(\){if\(!\w{1,}\.disabled\)/, `((function(){;window.setData = ${setDataVar}.setData;if(!${setDataVar}.disabled)`)
  return text
}

// Stores the current turn in the game
let turnNum = null
// Stores the websocket that is currently in use
let currWs = null

// Custom websocket class to capture current websocket
class customWebSocket extends WebSocket {
  constructor(...args) {
    let ws = super(...args)
    currWs = ws
    // console.log(ws)
    ws.addEventListener('message', (e) => {
      // console.log(e.data)
      if (e.data && typeof e.data == 'string' && e.data.includes('[')) {
        let t = JSON.parse(e.data.replace(/[^\[]{0,}/, ''))[2]
        if (t?.hasOwnProperty('turnNum')) turnNum = t.turnNum
      }
    })
    return ws
  }
}
unsafeWindow.WebSocket = customWebSocket

let drawEnabled = true

CanvasRenderingContext2D.prototype.stroke = new Proxy( CanvasRenderingContext2D.prototype.stroke, {
  async apply (target, thisArg, [element]) {
    if (drawEnabled) return Reflect.apply( ...arguments )
    return
  }
})

CanvasRenderingContext2D.prototype.fill = new Proxy( CanvasRenderingContext2D.prototype.fill, {
  async apply (target, thisArg, [element]) {
    if (drawEnabled) return Reflect.apply( ...arguments )
    return
  }
})

CanvasRenderingContext2D.prototype.clearRect = new Proxy( CanvasRenderingContext2D.prototype.clearRect, {
  async apply (target, thisArg, [element]) {
    if (drawEnabled) return Reflect.apply( ...arguments )
    return
  }
})

// Converts an image element to the format that Gartic Phone uses
function draw (image, fit='zoom', width=758, height=424, penSize=2) {
  console.log('[Autodraw] Drawing image')

  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'

  // White background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)

  // Calculate the image position and dimensions
  let imageX = 0
  let imageY = 0
  let imageWidth = width
  let imageHeight = height
  // Stretch to fit by default (do nothing)
  if (fit != 'stretch') {
    const imageAspectRatio = image.width / image.height
    const canvasAspectRatio = canvas.width / canvas.height
    if (fit == 'zoom') {
      // Zoom to fit
      if (imageAspectRatio > canvasAspectRatio) {
        imageWidth = image.width * (height / image.height)
        imageX = (width - imageWidth) / 2
      } else if (imageAspectRatio < canvasAspectRatio) {
        imageHeight = image.height * (width / image.width)
        imageY = (height - imageHeight) / 2
      }
    } else {
      // Shrink to fit
      if (imageAspectRatio < canvasAspectRatio) {
        imageWidth = image.width * (height / image.height)
        imageX = (width - imageWidth) / 2
      } else if (imageAspectRatio > canvasAspectRatio) {
        imageHeight = image.height * (width / image.width)
        imageY = (height - imageHeight) / 2
      }
    }
  }

  // Draw the image on the canvas
  ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight)

  // Draw the image on the game canvas
  let gc = document.querySelector('.jsx-187140558')
   gc.getContext('2d')
  .drawImage(canvas, 0, 0, gc.width, gc.height)

  // Get RGB data from canvas
  let data = ctx.getImageData(0, 0, width, 424).data

  let packets = []
  let story = []
  let strokeId = 0

  if (isAnimation()) {
    // Gamemodes with animation require different format
    let pos = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let color = rgbToHex(data[pos], data[pos+1], data[pos+2])
        packets.push(`42[2,7,{"t":${turnNum},"d":1,"v":[1,${strokeId},["${color}",${penSize},${data[pos+3]/255}],[${x},${y}]]}]`)
        story.push([1, strokeId, [color, 2, data[3]/255], [x, y]])
        strokeId++
        pos += 4
      }
    }
    drawEnabled = false
    unsafeWindow.setData((function(e){ return story })())
  } else {
    // Other gamemodes
    let dict = {}
    let pos = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // let pos = i * 4
        let color = rgbToHex(data[pos], data[pos+1], data[pos+2])
        if (dict[color] == undefined) {
          // Huge stability improvement
          // Use unique stroke ID
          dict[color] = [8, strokeId, [color, data[3]/255], x, y, 1, 1]
          strokeId++
        } else {
          dict[color].push(x, y, 1, 1)
        }
        pos += 4
      }
    }

    for (let key in dict) {
      story.push(dict[key])
      let stroke = `42[2,7,{"t":${turnNum},"d":1,"v":`+JSON.stringify(dict[key])+`}]`
      packets.push(stroke)
    }
    drawEnabled = false
    unsafeWindow.setData((function(e){ return story })())
  }

  // Send packets to server
  drawEnabled = true
  return sendPackets(packets, story)
  //.then(() => drawEnabled = true)
}

function sendPackets (packets, story) {
  console.log('[Autodraw] Sending packets')
  return new Promise(function(resolve) {
    let p = 0
    let sent = 0
    let pongCount = 2
    let rateLimitActive = false
    let pongsRecieved = 0
    function pongHandler (e) {
      if (e.data == '3') {
        pongsRecieved++
        console.log('[Autodraw] Pong ' + pongsRecieved + ' / ' + pongCount)
        if (pongsRecieved >= pongCount) {
          console.log('[Autodraw] All pongs recieved')
          currWs.removeEventListener('message', pongHandler)
          resolve()
        }
      }
    }
    currWs.addEventListener('message', pongHandler)
    currWs.send('2')
    let pingInterval = setInterval(() => {
      currWs.send('2')
      pongCount++
    }, 10000)
    function sendChunk () {
      // Check if websocket is in OPEN state
      if (currWs.readyState != WebSocket.OPEN) {
        console.log('[Autodraw] Reconnecting', currWs.readyState)
        setTimeout(sendChunk, 200)
        return
      }

      // Only send data when nothing is buffered
      if (currWs.bufferedAmount > 0) {
        // Schedule for next javascript tick
        setTimeout(sendChunk, 0)
        return
      }

      // Limit to 100Kb at a time
      while (currWs.bufferedAmount < 100000) {
        currWs.send(packets[p])

        sent += packets[p].length

        p++

        if (p >= packets.length) {
          clearInterval(pingInterval)
          currWs.send('2')
          // Exit if the websocket closes
          console.log('[Autodraw] Finished sending packets')
          currWs.addEventListener('close', resolve)
          return
        }
      }
      setTimeout(sendChunk, 0)
    }
    sendChunk()
  })
}

let doneButton
let bottomContainer

// Fake "Done" button that shows while drawing
// Prevents submitting before all packets are sent
let fakeButton = document.createElement('button')
fakeButton.classList = 'jsx-4289504161 small'
fakeButton.disabled = true
fakeButton.style.display = 'none'
fakeButton.innerHTML = '<i class="jsx-3322258600 pencil"></i><strong>Drawing...</strong>'

function disableButton (e) {
  if (!doneButton) return e
  doneButton.style.display = 'none'
  fakeButton.style.display = ''
  return e
}

function enableButton (e) {
  if (!doneButton) return e
  doneButton.style.display = ''
  fakeButton.style.display = 'none'
  return e
}

let currentImage

function loadImage (objectURL) {
  // Store an image file
  console.log('[Autodraw] Selected image')
  dropPreview.style.display = 'block'
  dropText.style.display = 'none'
  currentImage = objectURL
  dropPreview.src = objectURL
}

function unloadImage () {
  dropPreview.style.display = 'none'
  dropText.style.display = 'block'
  currentImage = null
  dropPreview.src = 'favicon.ico'
}

function startDrawing () {
  if (!currentImage) {
    console.error('[Autodraw] No image loaded')
    return
  }
  if (unsafeWindow.location.href.indexOf('draw') == -1) {
   console.error('[Autodraw] You are not in the drawing section')
   return
  }
  if (!unsafeWindow.setData) {
    console.error('[Autodraw] window.setData is missing! (Injector malfunction)')
    return
  }
  disableButton()
  closeDialog()
  setTimeout(() => {
    createImage(currentImage)
    .then(draw)
    .then(enableButton)
    .then(() => {
      console.log('[Autodraw] Done!')
      closeDialog()
      unloadImage()
    })
  }, 500)
}

function pickFile () {
  return new Promise(function(resolve) {
    let picker = document.createElement('input')
    picker.type = 'file'
    picker.click()
    picker.oninput = function() {
      resolve(URL.createObjectURL(picker.files[0]))
    }
  })
}

function createImage (url) {
  console.log('[Autodraw] Loading image')
  return new Promise(function(resolve) {
    let image = document.createElement('img')
    image.onload = function() {
      console.log('[Autodraw] Image loaded')
      resolve(image)
    }
    image.src = url
  })
}

function injectUI () {
  // Get the side menu container
  const sideMenu = document.querySelector('.jsx-2643802174.tools > .jsx-2643802174')
  if (!sideMenu) {
    return
  }
  if (sideMenu.childElementCount > 10) {
    return
  }
  sideMenu.style.height = 'unset'

  doneButton = document.querySelector('button.jsx-4289504161.small')
  bottomContainer = document.querySelector('.jsx-2849961842.bottom')

  // Add the fake button
  bottomContainer.appendChild(fakeButton)

  // Create the "Add image" button
  const addImageButton = document.createElement('div')
  addImageButton.classList = 'jsx-2643802174 tool image'
  addImageButton.style.margin = '6px 0 1px 0'
  addImageButton.style.backgroundSize = '100%'
  addImageButton.style.color = '#d16283'

  // Add style
  const style = document.createElement('style')
  style.innerText = `.jsx-2643802174.tool.image::after {
    content: "+";
    margin: 2px;
    flex: 1 1 0%;
    border-radius: 3px;
    align-self: stretch;
    font: 60px Black;
    transform: translate(0px, -20px);
  }`
  document.head.appendChild(style)
  sideMenu.appendChild(addImageButton)

  // Click handler
  addImageButton.onclick = openDialog
}

function openDialog () {
  container.style.display = 'flex'
  setTimeout(() => {
    container.style.opacity = '1'
  }, 0)
}

function closeDialog () {
  container.style.opacity = '0'
  setTimeout(() => {
    container.style.display = 'none'
  }, 200)
}

// Create the UI
const container = document.createElement('div')
container.style.width = '100%'
container.style.height = '100%'
container.style.position = 'absolute'
container.style.top = '0px'
container.style.left = '0px'
container.style.background = 'rgba(0,0,0,0.8)'
container.style.justifyContent = 'center'
container.style.alignItems = 'center'
container.style.display = 'none' // Set to "flex" to show
container.style.opacity = 0
container.style.zIndex = '5'
container.classList = 'autodraw-container'
const modal = document.createElement('div')
modal.style.width = '60%'
modal.style.height = '60%'
modal.style.background = 'white'
modal.style.padding = '25px 30px'
modal.style.borderRadius = '12px'
modal.style.display = 'flex'
modal.style.flexDirection = 'column'
modal.style.alignItems = 'center'
modal.style.fontFamily = 'Black'
container.appendChild(modal)
const closeButton = document.createElement('div')
closeButton.innerText = '' // "X" symbol
closeButton.style.fontFamily = 'ico' // Icon font
closeButton.style.fontSize = '24px'
closeButton.style.color = 'black'
closeButton.style.textAlign = 'right'
closeButton.style.margin = '0 0 0 100%'
closeButton.style.lineHeight = '5px' // Center in corner
closeButton.style.textTransform = 'uppercase'
closeButton.style.height = '0px' // Don't offset the next line
closeButton.style.cursor = 'pointer'
closeButton.onclick = closeDialog
modal.appendChild(closeButton)
const title = document.createElement('h2')
title.classList = 'jsx-143026286'
title.innerText = 'Insert Image'
title.style.fontFamily = 'Black'
title.style.fontSize = '24px'
title.style.color = 'rgb(48, 26, 107)'
title.style.textAlign = 'center'
title.style.lineHeight = '29px'
title.style.textTransform = 'uppercase'
title.style.display = 'flex'
title.style.flexDirection = 'row'
modal.appendChild(title)
const dropArea = document.createElement('div')
dropArea.style.width = '100%'
dropArea.style.height = '100%'
dropArea.style.alignItems = 'center'
dropArea.style.display = 'flex'
dropArea.style.justifyContent = 'center'
dropArea.style.border = '4px dashed gray'
dropArea.style.borderRadius = '17px'
dropArea.style.cursor = 'pointer'
dropArea.style.overflow = 'hidden'
// dropArea.style.margin = '0 0 10px'
dropArea.onclick = function() {
  pickFile().then(loadImage)
}
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault()
})
dropArea.addEventListener('drop', (e) => {
  e.preventDefault()
  loadImage(URL.createObjectURL(e.dataTransfer.files[0]))
})
const dropText = document.createElement('div')
dropText.style.padding = '20px'
dropText.innerText = 'Drag and drop images here or click to choose a file'
dropArea.appendChild(dropText)
const dropPreview = document.createElement('img')
dropPreview.style.display = 'none'
dropPreview.style.maxWidth = '95%'
dropPreview.style.maxHeight = '95%'
dropPreview.style.borderRadius = '6px'
dropPreview.style.objectFit = 'cover'
dropPreview.src = 'favicon.ico'
dropArea.appendChild(dropPreview)
modal.appendChild(dropArea)
const bottomDiv = document.createElement('div')
bottomDiv.style.width = '100%'
bottomDiv.style.display = 'flex'
bottomDiv.style.flexDirection = 'row'
bottomDiv.style.margin = '20px 0 0'
bottomDiv.style.justifyContent = 'center'
modal.appendChild(bottomDiv)
const insertButton = document.createElement('button')
insertButton.classList = 'insert-button'
insertButton.innerText = 'DRAW IMAGE'
insertButton.onclick = function() {
  startDrawing()
}
bottomDiv.appendChild(insertButton)
const uiStyle = document.createElement('style')
uiStyle.innerText = `
.insert-button:hover {
  background-color: rgb(64, 32, 194);
}
.insert-button {
  margin: 0px 8px;
  cursor: pointer;
  border: none;
  background-color: rgb(86, 53, 220);
  border-radius: 7px;
  width: 160px;
  height: 42px;
  font-family: Black;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
  text-transform: uppercase;
}
.autodraw-container {
  transition: opacity linear 0.2s;
}`

unsafeWindow.startDrawing = startDrawing
document.addEventListener('DOMContentLoaded', () => {
  setInterval(injectUI, 300)

  // Add UI
  document.body.appendChild(container)
  document.head.appendChild(uiStyle)
})