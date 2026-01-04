// ==UserScript==
// @name        Colourful LOR
// @namespace   com.bodqhrohro.lor.colourful
// @description Improve LOR with colourful pixel art!
// @include     https://www.linux.org.ru/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375993/Colourful%20LOR.user.js
// @updateURL https://update.greasyfork.org/scripts/375993/Colourful%20LOR.meta.js
// ==/UserScript==


(function() {
  var forthMap = {
    3: 8,
    4: 3,
    5: 6,
    6: 9,
    7: 13,
    8: 4,
    9: 5,
    10: 7,
    11: 12,
    12: 10,
    13: 11
  }
  
  var backMap = {
    3: 4,
    4: 8,
    5: 9,
    6: 5,
    7: 10,
    8: 3,
    9: 6,
    10: 12,
    11: 13,
    12: 11,
    13: 7
  }
  
  var braileRegex = /^[⠀-⣿]+$/m
  
  var PIXEL_SCALE = 8

  var reduceByte = function(byte) {
    byte = (byte>>3) & 15
    return byte < 3 || byte > 13 ? byte : forthMap[byte]
  }

  var enduceByte = function(byte) {
    byte = byte < 3 || byte > 13 ? byte : backMap[byte]
    return byte << 3
  }

  var bytesToBraile = function(byte1, byte2) {
    byte1 = reduceByte(byte1)
    byte2 = reduceByte(byte2)
    return String.fromCharCode(0x2800 + ((byte2&8)<<4) + ((byte1&8)<<3) + ((byte2&7)<<3) + (byte1&7))
  }
  
  var braileToBytes = function(symbol) {
    symbol = symbol.charCodeAt(0) - 0x2800
    byte1 = (symbol&7) + ((symbol&64)>>3)
    byte2 = ((symbol&56)>>3) + ((symbol&128)>>4)

    return [
      enduceByte(byte1),
      enduceByte(byte2)
    ]
  }

  var insertText = function(textarea, text) {
      var startPos = textarea.selectionStart
      var endPos = textarea.selectionEnd
      textarea.value = textarea.value.substring(0, startPos) +
        '\n\n' + text + '\n\n' +
        textarea.value.substring(endPos, textarea.value.length)
      textarea.selectionStart = startPos + text.length
      textarea.selectionEnd = startPos + text.length
  }
  
  var encodeImage = function(img) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    
    ctx.drawImage(img, 0, 0)
    var imageData = ctx.getImageData(0, 0, img.width, img.height).data
    
    var text = ''
    var bytesWidth = img.width * 4
    var r, g, b, a;
    for (var i = 0; i < imageData.length; i += 4) {
      r = imageData[i];
      g = imageData[i+1];
      b = imageData[i+2];
      a = imageData[i+3];
      
      // alpha subcarrier
      a &= 128
      a >>= 4
      a |= (r & 128) >> 1
      a |= (g & 128) >> 2
      a |= (b & 128) >> 3

      if (!(i % bytesWidth)) {
        text += '[br]\n'
      }
      text += bytesToBraile(r, g)
      text += bytesToBraile(b, a)
    }
    return text
  }

  var assignFileInputs = function(textarea) {
    var fileInput = document.createElement('input')
    fileInput.type = 'file'

    textarea.parentNode.insertBefore(fileInput, textarea.nextSibling)
    fileInput.addEventListener('change', function() {
      if (!FileReader || !this.files.length) {
        return ''
      }

      var fileReader = new FileReader()
      fileReader.onload = function() {
        var img = document.createElement('img')
        document.body.appendChild(img)
        img.style.display = 'none'
        img.src = fileReader.result
        img.onload = function() {
          var text = encodeImage(img)
          insertText(textarea, text)
          img.parentNode.removeChild(img)
        }
      }
      fileReader.readAsDataURL(this.files[0])
    })
    
    // description
    var description = document.createElement('div')
    description.innerHTML = 'Картинка для Colourful:'
    textarea.parentNode.insertBefore(description, fileInput)
  }
  
  var decodeImage = function(p) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    lines = p.innerText.split('\n').filter(function(line) { return line !== ''; })

    canvas.width = Math.max.apply(null, Array.prototype.map.call(lines, function(line) {
      return line.length / 2;
    })) * PIXEL_SCALE
    canvas.height = lines.length * PIXEL_SCALE
    
    lines.forEach(function(line, lineIndex) {
      for (var i = 0; i < line.length; i += 2) {
        var rg = line[i]
        var ba = line[i+1]
        
        rg = braileToBytes(rg)
        ba = braileToBytes(ba)

        var r = rg[0]
        var g = rg[1]
        var b = ba[0]
        var a = ba[1]

        r += (a & 64) << 1
        g += (a & 32) << 2
        b += (a & 16) << 3
        a = (a & 8) ? 255 : 0
        
        ctx.beginPath()
        ctx.rect(i * PIXEL_SCALE / 2, lineIndex * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE)
        ctx.fillStyle = 'rgba(' + [r, g, b, a].join(',') + ')'
        ctx.fill()
      }
    })

    p.innerHTML = ''
    p.appendChild(canvas)
  }

  var decodeImages = function(message) {
    var ps = message.querySelectorAll('p')
    if (ps && ps.length) {
      Array.prototype.forEach.call(ps, function(p) {
        if (braileRegex.test(p.innerText)) {
          decodeImage(p)
        }
      })
    }
  }

  window.addEventListener('load', function() {
    // encode
    var textareas = document.getElementsByTagName('textarea')
    if (textareas && textareas.length) {
      Array.prototype.forEach.call(textareas, assignFileInputs)
    }

    //decode
    var messages = document.querySelectorAll('.msg_body')
    if (messages && messages.length) {
      Array.prototype.forEach.call(messages, decodeImages)
    }
  })
})()
