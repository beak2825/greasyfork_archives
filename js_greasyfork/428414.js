// ==UserScript==
// @name         贴吧图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查看坦克图
// @author       wl
// @match        http://tieba.baidu.com/photo/p*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428414/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/428414/%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.createElement('div')
    div.innerText = '转换'
    div.style.background = 'green'
    div.style.position = 'fixed'
    div.style.left = '50px'
    div.style.top = '50px'
    div.style.padding = '20px'
    div.style.zIndex= '9999'
    div.onclick = trans
    document.body.appendChild(div)


    var img = new Image();
    var cvs = document.createElement("canvas");
    var cxt = cvs.getContext("2d");
    var textDecoder = new TextDecoder();
    async function trans() {
        var tkimg = document.getElementsByClassName('image_original_original')[0]
        let imgfile = await decrypt(tkimg.src)
        console.log(imgfile)
        var reader = new FileReader();
        reader.onload = function (e) {
            tkimg.src = e.target.result
        }
        reader.readAsDataURL(imgfile);
    }

    async function decrypt(imgBlob) {
      await new Promise((res, rej) => {
        img.crossOrigin = 'anonymous'
        img.onload = () => res(img);
        img.onerror = () => rej(new Error("读取图片失败"));
        // img.src = window.URL.createObjectURL(imgBlob);
        img.src = imgBlob
      });
      let width = cvs.width = img.width, height = cvs.height = img.height;
      console.log(width, height)
      cxt.drawImage(img, 0, 0);
      let imgdata = cxt.getImageData(0, 0, width, height);

      let mode = imgdata.data[2] & 7;
      if (
        (imgdata.data[0] & 7) !== 0 ||
        (imgdata.data[1] & 7) !== 3 ||
        mode === 0 || mode > 5
      ) {
        throw new Error("🔨");
      }

      let pixelCount = width * height;
      let bitBuffer = new BitQueue32(), i = 1, metadataBytes = [];
      while (i < pixelCount) {
        while (bitBuffer.length < 8) {
          bitBuffer.enqBits(mode, imgdata.data[i << 2]);
          bitBuffer.enqBits(mode, imgdata.data[i << 2 | 1]);
          bitBuffer.enqBits(mode, imgdata.data[i << 2 | 2]);
          ++i;
        }
        let byte = bitBuffer.deqByte();
        if (!byte) break;
        metadataBytes.push(byte);
      }
      let fileMetadata = textDecoder.decode(new Uint8Array(metadataBytes)).split("\x01");
      let [fileSize, fileName, fileType] = fileMetadata;
      console.log({ fileSize, fileName, fileType });
      fileSize = Number(fileSize);
      if (
        fileMetadata.length < 3 ||
        isNaN(fileSize) ||
        (0 | fileSize) !== fileSize || // 判断是否为32位整数
        fileSize < 0
      ) throw new Error("头部信息无效");

      let blist = new Uint8Array(fileSize), j = 0;
      while (i < pixelCount && j < fileSize) {
        while (bitBuffer.length < 8) {
          bitBuffer.enqBits(mode, imgdata.data[i << 2]);
          bitBuffer.enqBits(mode, imgdata.data[i << 2 | 1]);
          bitBuffer.enqBits(mode, imgdata.data[i << 2 | 2]);
          ++i;
        }
        let byte = bitBuffer.deqByte();
        blist[j++] = byte;
      }
      return new File([blist], fileName, { type: fileType });
    }


    class BitQueue32 {
      constructor() {
        this.data = 0;
        this.length = 0;
      }
      enqBits(valueLength, value) {
        if (this.length + valueLength > 32) throw new RangeError("BitQueue32.prototype.pushBits(): Overflow");
        this.length += valueLength;
        this.data <<= valueLength;
        this.data |= value & ~(-1 << valueLength);
      }
      peekByte() {
        var newLength = this.length - 8;
        if (newLength < 0) return this.data << (-newLength);
        else return this.data >>> newLength;
      }
      deqByte() {
        var newLength = this.length - 8;
        var result;
        if (newLength < 0) {
          result = this.data << (-newLength);
          this.data = 0;
          this.length = 0;
        } else {
          result = this.data >>> newLength;
          this.data &= ~(-1 << newLength);
          this.length = newLength;
        }
        return result;
      }
    }
    // Your code here...
})();