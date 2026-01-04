/* eslint-disable no-unused-expressions */
// ==UserScript==
// @name     Sketchful API
// @version  1
// @grant    none
// @require  https://greasyfork.org/scripts/426583-wshook-library/code/wsHook%20library.js?version=931699
// @require  https://greasyfork.org/scripts/426578-decoder/code/Decoder.js?version=931677
// @run-at   document-start
// @match    https://sketchful.io/
// @description skApi
// @namespace https://greasyfork.org/users/281093
// @downloadURL https://update.greasyfork.org/scripts/426584/Sketchful%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/426584/Sketchful%20API.meta.js
// ==/UserScript==
/* globals wsHook Decoder */
/* jshint esversion: 8 */

class Sketchful extends EventTarget {
  constructor() {
    super();
    
    this.on = this.addEventListener;
    this._wsHook = wsHook;
    this._wsClient = null;
    this.canvas = null;
    this.ctx = null;
  }
  
  async init() {
    this._wsHook.before = this._onSend.bind(this);
    this._wsHook.after = this._onReceive.bind(this);
    
    return new Promise((res) => {
      window.addEventListener('DOMContentLoaded', () => {
        this._onDomLoaded(res);
      });
    });
  }
  
  _onDomLoaded(res) {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');

    const poll = setInterval(() => {
      if (!this._wsClient) return;

      clearInterval(poll);
      res();
    }, 100);
  }
  
  _onSend(data, _url, wsObject) {
    if (!this._wsClient) this._wsClient = wsObject;

    // if (typeof data === 'object') {
    //   const decoded = Decoder.decode(data);
      
    //   console.log('sent: ', decoded.data);
    // }
    
    return data;
  }
  
  // eslint-disable-next-line no-unused-vars
  _onReceive(message, url, wsObject) {
    const { data } = message;

    if (typeof data === 'object') {
      const [event, payload] = Decoder.decode(data).data;
      
      // if (event !== 'draw' && event !== 'state') console.log(event, payload);
      
      this.dispatchEvent(new CustomEvent(event, { detail: payload }));
    }

    return message;
  }
  
  emit(event, data) {
    this._wsClient.send(Decoder.createPayload(event, data));
  }
}

class Artist extends Sketchful {
  static get drawCodes() {
    return {
      DRAW: 0,
      ERASE: 1,
      FILL: 2,
      SAVE: 3,
      UNDO: 4,
      CLEAR: 5,
    };
  }
  
  constructor() {
    super();
  }
  
  drawLine(startX, startY, stopX, stopY, r, g, b, size) {
    this.emit('draw', [
      0, stopX, stopY, startX, startY, r, g, b, size
    ]);

    this._drawLineLocal([
      ~~startX, ~~startY, ~~stopX, ~~stopY, size, r, g, b 
    ]);
  }
  
  clearCanvas() {
    this.emit('draw', [Artist.drawCodes.CLEAR]);
  }
  
  saveCanvasState() {
    // this.emit('draw', [Artist.drawCodes.SAVE]);
    function createMouseEvent(name, pos, bubbles = false) {
      return new MouseEvent(name, {
        bubbles,
        clientX: pos.x,
        clientY: pos.y,
        button: 0
      });
    }
    
    this.canvas.dispatchEvent(createMouseEvent('pointerup', { x: 0, y: 0 }, true));
  }
  
  undo() {
    this.emit('draw', [Artist.drawCodes.UNDO]);
  }
  
  fill(x, y, r, g, b) {
    this.emit('draw', [
      Artist.drawCodes.FILL, x, y, x, y, r, g, b, 2
    ]);
  }
  
  _drawLineLocal([startX, startY, stopX, stopY, size, r, g, b]) {
    const sizeInt = ~~(size / 2);
    const sizeSquared = sizeInt * sizeInt;
    const minXminusSize = Math.min(startX, stopX) - sizeInt;
    const minYminusSize = Math.min(startY, stopY) - sizeInt;
    const maxXplusSize = Math.max(startX, stopX) + sizeInt;
    const maxYplusSize = Math.max(startY, stopY) + sizeInt;
    startX -= minXminusSize;
    startY -= minYminusSize;
    stopX -= minXminusSize;
    stopY -= minYminusSize;
    // eslint-disable-next-line max-len
    const imgData = this.ctx.getImageData(minXminusSize, minYminusSize, maxXplusSize - minXminusSize, maxYplusSize - minYminusSize);
    const data = imgData.data;
    const dataLength = data.length;
    const _0x21ef6f = (_0x11952c, _0x726f10) => {
      for (let _0x15bc98 = -sizeInt; _0x15bc98 <= sizeInt; _0x15bc98++) {
        for (let _0x44a304 = -sizeInt; _0x44a304 <= sizeInt; _0x44a304++) {
          if (_0x15bc98 * _0x15bc98 + _0x44a304 * _0x44a304 < sizeSquared) {
            const _0x443ae7 = 4 * ((_0x726f10 + _0x44a304) * imgData.width + _0x11952c + _0x15bc98);
            _0x443ae7 >= 0 && _0x443ae7 < dataLength && (data[_0x443ae7] = r,
            data[_0x443ae7 + 1] = g,
            data[_0x443ae7 + 2] = b,
            data[_0x443ae7 + 3] = 255);
          } 
        } 
      }
    };
    if (startX === stopX && startY === stopY) { _0x21ef6f(startX, startY); } else {
      _0x21ef6f(startX, startY);
      _0x21ef6f(stopX, stopY);
      // eslint-disable-next-line max-len
      for (let _0x1c8ffa = Math.abs(stopX - startX), _0x43db79 = Math.abs(stopY - startY), _0x13e500 = startX < stopX ? 1 : -1, _0x354fdf = startY < stopY ? 1 : -1, _0x3d8cb4 = _0x1c8ffa - _0x43db79; startX !== stopX || startY !== stopY;) {
        const _0x5139ce = _0x3d8cb4 << 1;
        _0x5139ce > -_0x43db79 && (_0x3d8cb4 -= _0x43db79,
        startX += _0x13e500);
        _0x5139ce < _0x1c8ffa && (_0x3d8cb4 += _0x1c8ffa,
        startY += _0x354fdf);
        _0x21ef6f(startX, startY);
      }
    }
    this.ctx.putImageData(imgData, minXminusSize, minYminusSize);
  }
}