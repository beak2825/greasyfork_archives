// ==UserScript==
// @name         ComicfuzSpider
// @namespace    https://comic-fuz.com/
// @version      0.1
// @description  Image spider for comic-fuz.com
// @author       DD1969
// @match        https://comic-fuz.com/manga/viewer/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444096/ComicfuzSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/444096/ComicfuzSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // get chapter id
    const chapterId = window.location.href.split('viewer/')[1];

    // get title
    const title = `comic-fuz-${chapterId}`;

    // get encrypted image data
    const payload = {
      deviceInfo: { deviceType: 2 },
      chapterId: chapterId,
      useTicket: false,
      consumePoint: { event: 0, paid: 0 }
    }

    const url = 'https://api.comic-fuz.com/v1/manga_viewer';
    const content = await fetch(url, { credentials: 'include', method: 'POST', body: createInfoSchema().encodeInfo(payload) }).then(async res => new Uint8Array(await res.arrayBuffer()).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const regexp = /(\/f.*&e=\d{10}).*([0-9a-z]{32})"@([0-9a-z]{64})/gm;
    const encryptedImageData = Array.from(content.matchAll(regexp)).map(item => ({ url: 'https://img.comic-fuz.com' + item[1], iv: item[2], key: item[3] }));

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 60px; left: 40px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(encryptedImageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function createInfoSchema() {
    const exports = {};

    exports.encodeInfo = function (message) {
      var bb = popByteBuffer();
      _encodeInfo(message, bb);
      return toUint8Array(bb);
    }

    function _encodeInfo(message, bb) {
      // optional DeviceInfo deviceInfo = 1;
      var $deviceInfo = message.deviceInfo;
      if ($deviceInfo !== undefined) {
        writeVarint32(bb, 10);
        var nested = popByteBuffer();
        _encodeDeviceInfo($deviceInfo, nested);
        writeVarint32(bb, nested.limit);
        writeByteBuffer(bb, nested);
        pushByteBuffer(nested);
      }

      // optional uint32 chapterId = 2;
      var $chapterId = message.chapterId;
      if ($chapterId !== undefined) {
        writeVarint32(bb, 16);
        writeVarint32(bb, $chapterId);
      }

      // optional bool useTicket = 3;
      var $useTicket = message.useTicket;
      if ($useTicket !== undefined) {
        writeVarint32(bb, 24);
        writeByte(bb, $useTicket ? 1 : 0);
      }

      // optional ConsumePoint consumePoint = 4;
      var $consumePoint = message.consumePoint;
      if ($consumePoint !== undefined) {
        writeVarint32(bb, 34);
        var nested = popByteBuffer();
        _encodeConsumePoint($consumePoint, nested);
        writeVarint32(bb, nested.limit);
        writeByteBuffer(bb, nested);
        pushByteBuffer(nested);
      }
    };

    exports.decodeInfo = function (binary) {
      return _decodeInfo(wrapByteBuffer(binary));
    }

    function _decodeInfo(bb) {
      var message = {};

      end_of_message: while (!isAtEnd(bb)) {
        var tag = readVarint32(bb);

        switch (tag >>> 3) {
          case 0:
            break end_of_message;

            // optional DeviceInfo deviceInfo = 1;
          case 1: {
            var limit = pushTemporaryLength(bb);
            message.deviceInfo = _decodeDeviceInfo(bb);
            bb.limit = limit;
            break;
          }

            // optional uint32 chapterId = 2;
          case 2: {
            message.chapterId = readVarint32(bb) >>> 0;
            break;
          }

            // optional bool useTicket = 3;
          case 3: {
            message.useTicket = !!readByte(bb);
            break;
          }

            // optional ConsumePoint consumePoint = 4;
          case 4: {
            var limit = pushTemporaryLength(bb);
            message.consumePoint = _decodeConsumePoint(bb);
            bb.limit = limit;
            break;
          }

          default:
            skipUnknownField(bb, tag & 7);
        }
      }

      return message;
    };

    exports.encodeDeviceInfo = function (message) {
      var bb = popByteBuffer();
      _encodeDeviceInfo(message, bb);
      return toUint8Array(bb);
    }

    function _encodeDeviceInfo(message, bb) {
      // optional uint32 deviceType = 3;
      var $deviceType = message.deviceType;
      if ($deviceType !== undefined) {
        writeVarint32(bb, 24);
        writeVarint32(bb, $deviceType);
      }
    };

    exports.decodeDeviceInfo = function (binary) {
      return _decodeDeviceInfo(wrapByteBuffer(binary));
    }

    function _decodeDeviceInfo(bb) {
      var message = {};

      end_of_message: while (!isAtEnd(bb)) {
        var tag = readVarint32(bb);

        switch (tag >>> 3) {
          case 0:
            break end_of_message;

            // optional uint32 deviceType = 3;
          case 3: {
            message.deviceType = readVarint32(bb) >>> 0;
            break;
          }

          default:
            skipUnknownField(bb, tag & 7);
        }
      }

      return message;
    };

    exports.encodeConsumePoint = function (message) {
      var bb = popByteBuffer();
      _encodeConsumePoint(message, bb);
      return toUint8Array(bb);
    }

    function _encodeConsumePoint(message, bb) {
      // optional uint32 event = 1;
      var $event = message.event;
      if ($event !== undefined) {
        writeVarint32(bb, 8);
        writeVarint32(bb, $event);
      }

      // optional uint32 paid = 2;
      var $paid = message.paid;
      if ($paid !== undefined) {
        writeVarint32(bb, 16);
        writeVarint32(bb, $paid);
      }
    };

    exports.decodeConsumePoint = function (binary) {
      return _decodeConsumePoint(wrapByteBuffer(binary));
    }

    function _decodeConsumePoint(bb) {
      var message = {};

      end_of_message: while (!isAtEnd(bb)) {
        var tag = readVarint32(bb);

        switch (tag >>> 3) {
          case 0:
            break end_of_message;

            // optional uint32 event = 1;
          case 1: {
            message.event = readVarint32(bb) >>> 0;
            break;
          }

            // optional uint32 paid = 2;
          case 2: {
            message.paid = readVarint32(bb) >>> 0;
            break;
          }

          default:
            skipUnknownField(bb, tag & 7);
        }
      }

      return message;
    };

    function pushTemporaryLength(bb) {
      var length = readVarint32(bb);
      var limit = bb.limit;
      bb.limit = bb.offset + length;
      return limit;
    }

    function skipUnknownField(bb, type) {
      switch (type) {
        case 0: while (readByte(bb) & 0x80) { } break;
        case 2: skip(bb, readVarint32(bb)); break;
        case 5: skip(bb, 4); break;
        case 1: skip(bb, 8); break;
        default: throw new Error("Unimplemented type: " + type);
      }
    }

    function stringToLong(value) {
      return {
        low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
        high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
        unsigned: false,
      };
    }

    function longToString(value) {
      var low = value.low;
      var high = value.high;
      return String.fromCharCode(
        low & 0xFFFF,
        low >>> 16,
        high & 0xFFFF,
        high >>> 16);
    }

    // The code below was modified from https://github.com/protobufjs/bytebuffer.js
    // which is under the Apache License 2.0.

    var f32 = new Float32Array(1);
    var f32_u8 = new Uint8Array(f32.buffer);

    var f64 = new Float64Array(1);
    var f64_u8 = new Uint8Array(f64.buffer);

    function intToLong(value) {
      value |= 0;
      return {
        low: value,
        high: value >> 31,
        unsigned: value >= 0,
      };
    }

    var bbStack = [];

    function popByteBuffer() {
      const bb = bbStack.pop();
      if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
      bb.offset = bb.limit = 0;
      return bb;
    }

    function pushByteBuffer(bb) {
      bbStack.push(bb);
    }

    function wrapByteBuffer(bytes) {
      return { bytes, offset: 0, limit: bytes.length };
    }

    function toUint8Array(bb) {
      var bytes = bb.bytes;
      var limit = bb.limit;
      return bytes.length === limit ? bytes : bytes.subarray(0, limit);
    }

    function skip(bb, offset) {
      if (bb.offset + offset > bb.limit) {
        throw new Error('Skip past limit');
      }
      bb.offset += offset;
    }

    function isAtEnd(bb) {
      return bb.offset >= bb.limit;
    }

    function grow(bb, count) {
      var bytes = bb.bytes;
      var offset = bb.offset;
      var limit = bb.limit;
      var finalOffset = offset + count;
      if (finalOffset > bytes.length) {
        var newBytes = new Uint8Array(finalOffset * 2);
        newBytes.set(bytes);
        bb.bytes = newBytes;
      }
      bb.offset = finalOffset;
      if (finalOffset > limit) {
        bb.limit = finalOffset;
      }
      return offset;
    }

    function advance(bb, count) {
      var offset = bb.offset;
      if (offset + count > bb.limit) {
        throw new Error('Read past limit');
      }
      bb.offset += count;
      return offset;
    }

    function readBytes(bb, count) {
      var offset = advance(bb, count);
      return bb.bytes.subarray(offset, offset + count);
    }

    function writeBytes(bb, buffer) {
      var offset = grow(bb, buffer.length);
      bb.bytes.set(buffer, offset);
    }

    function readString(bb, count) {
      // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
      var offset = advance(bb, count);
      var fromCharCode = String.fromCharCode;
      var bytes = bb.bytes;
      var invalid = '\uFFFD';
      var text = '';

      for (var i = 0; i < count; i++) {
        var c1 = bytes[i + offset], c2, c3, c4, c;

        // 1 byte
        if ((c1 & 0x80) === 0) {
          text += fromCharCode(c1);
        }

        // 2 bytes
        else if ((c1 & 0xE0) === 0xC0) {
          if (i + 1 >= count) text += invalid;
          else {
            c2 = bytes[i + offset + 1];
            if ((c2 & 0xC0) !== 0x80) text += invalid;
            else {
              c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
              if (c < 0x80) text += invalid;
              else {
                text += fromCharCode(c);
                i++;
              }
            }
          }
        }

        // 3 bytes
        else if ((c1 & 0xF0) == 0xE0) {
          if (i + 2 >= count) text += invalid;
          else {
            c2 = bytes[i + offset + 1];
            c3 = bytes[i + offset + 2];
            if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
            else {
              c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
              if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
              else {
                text += fromCharCode(c);
                i += 2;
              }
            }
          }
        }

        // 4 bytes
        else if ((c1 & 0xF8) == 0xF0) {
          if (i + 3 >= count) text += invalid;
          else {
            c2 = bytes[i + offset + 1];
            c3 = bytes[i + offset + 2];
            c4 = bytes[i + offset + 3];
            if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
            else {
              c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
              if (c < 0x10000 || c > 0x10FFFF) text += invalid;
              else {
                c -= 0x10000;
                text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
                i += 3;
              }
            }
          }
        }

        else text += invalid;
      }

      return text;
    }

    function writeString(bb, text) {
      // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
      var n = text.length;
      var byteCount = 0;

      // Write the byte count first
      for (var i = 0; i < n; i++) {
        var c = text.charCodeAt(i);
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
          c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
        }
        byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
      }
      writeVarint32(bb, byteCount);

      var offset = grow(bb, byteCount);
      var bytes = bb.bytes;

      // Then write the bytes
      for (var i = 0; i < n; i++) {
        var c = text.charCodeAt(i);
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
          c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
        }
        if (c < 0x80) {
          bytes[offset++] = c;
        } else {
          if (c < 0x800) {
            bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
          } else {
            if (c < 0x10000) {
              bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
            } else {
              bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
              bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
            }
            bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
          }
          bytes[offset++] = (c & 0x3F) | 0x80;
        }
      }
    }

    function writeByteBuffer(bb, buffer) {
      var offset = grow(bb, buffer.limit);
      var from = bb.bytes;
      var to = buffer.bytes;

      // This for loop is much faster than subarray+set on V8
      for (var i = 0, n = buffer.limit; i < n; i++) {
        from[i + offset] = to[i];
      }
    }

    function readByte(bb) {
      return bb.bytes[advance(bb, 1)];
    }

    function writeByte(bb, value) {
      var offset = grow(bb, 1);
      bb.bytes[offset] = value;
    }

    function readFloat(bb) {
      var offset = advance(bb, 4);
      var bytes = bb.bytes;

      // Manual copying is much faster than subarray+set in V8
      f32_u8[0] = bytes[offset++];
      f32_u8[1] = bytes[offset++];
      f32_u8[2] = bytes[offset++];
      f32_u8[3] = bytes[offset++];
      return f32[0];
    }

    function writeFloat(bb, value) {
      var offset = grow(bb, 4);
      var bytes = bb.bytes;
      f32[0] = value;

      // Manual copying is much faster than subarray+set in V8
      bytes[offset++] = f32_u8[0];
      bytes[offset++] = f32_u8[1];
      bytes[offset++] = f32_u8[2];
      bytes[offset++] = f32_u8[3];
    }

    function readDouble(bb) {
      var offset = advance(bb, 8);
      var bytes = bb.bytes;

      // Manual copying is much faster than subarray+set in V8
      f64_u8[0] = bytes[offset++];
      f64_u8[1] = bytes[offset++];
      f64_u8[2] = bytes[offset++];
      f64_u8[3] = bytes[offset++];
      f64_u8[4] = bytes[offset++];
      f64_u8[5] = bytes[offset++];
      f64_u8[6] = bytes[offset++];
      f64_u8[7] = bytes[offset++];
      return f64[0];
    }

    function writeDouble(bb, value) {
      var offset = grow(bb, 8);
      var bytes = bb.bytes;
      f64[0] = value;

      // Manual copying is much faster than subarray+set in V8
      bytes[offset++] = f64_u8[0];
      bytes[offset++] = f64_u8[1];
      bytes[offset++] = f64_u8[2];
      bytes[offset++] = f64_u8[3];
      bytes[offset++] = f64_u8[4];
      bytes[offset++] = f64_u8[5];
      bytes[offset++] = f64_u8[6];
      bytes[offset++] = f64_u8[7];
    }

    function readInt32(bb) {
      var offset = advance(bb, 4);
      var bytes = bb.bytes;
      return (
        bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)
      );
    }

    function writeInt32(bb, value) {
      var offset = grow(bb, 4);
      var bytes = bb.bytes;
      bytes[offset] = value;
      bytes[offset + 1] = value >> 8;
      bytes[offset + 2] = value >> 16;
      bytes[offset + 3] = value >> 24;
    }

    function readInt64(bb, unsigned) {
      return {
        low: readInt32(bb),
        high: readInt32(bb),
        unsigned,
      };
    }

    function writeInt64(bb, value) {
      writeInt32(bb, value.low);
      writeInt32(bb, value.high);
    }

    function readVarint32(bb) {
      var c = 0;
      var value = 0;
      var b;
      do {
        b = readByte(bb);
        if (c < 32) value |= (b & 0x7F) << c;
        c += 7;
      } while (b & 0x80);
      return value;
    }

    function writeVarint32(bb, value) {
      value >>>= 0;
      while (value >= 0x80) {
        writeByte(bb, (value & 0x7f) | 0x80);
        value >>>= 7;
      }
      writeByte(bb, value);
    }

    function readVarint64(bb, unsigned) {
      var part0 = 0;
      var part1 = 0;
      var part2 = 0;
      var b;

      b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
          b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
            b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

              b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
                  b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                    b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                      b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                        b = readByte(bb); part2 |= (b & 0x7F) << 7;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return {
        low: part0 | (part1 << 28),
        high: (part1 >>> 4) | (part2 << 24),
        unsigned,
      };
    }

    function writeVarint64(bb, value) {
      var part0 = value.low >>> 0;
      var part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
      var part2 = value.high >>> 24;

      // ref: src/google/protobuf/io/coded_stream.cc
      var size =
          part2 === 0 ?
          part1 === 0 ?
          part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
      part0 < 1 << 21 ? 3 : 4 :
      part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
      part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

      var offset = grow(bb, size);
      var bytes = bb.bytes;

      switch (size) {
        case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
        case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
        case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
        case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
        case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
        case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
        case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
        case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
        case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
        case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
      }
    }

    function readVarint32ZigZag(bb) {
      var value = readVarint32(bb);

      // ref: src/google/protobuf/wire_format_lite.h
      return (value >>> 1) ^ -(value & 1);
    }

    function writeVarint32ZigZag(bb, value) {
      // ref: src/google/protobuf/wire_format_lite.h
      writeVarint32(bb, (value << 1) ^ (value >> 31));
    }

    function readVarint64ZigZag(bb) {
      var value = readVarint64(bb, /* unsigned */ false);
      var low = value.low;
      var high = value.high;
      var flip = -(low & 1);

      // ref: src/google/protobuf/wire_format_lite.h
      return {
        low: ((low >>> 1) | (high << 31)) ^ flip,
        high: (high >>> 1) ^ flip,
        unsigned: false,
      };
    }

    function writeVarint64ZigZag(bb, value) {
      var low = value.low;
      var high = value.high;
      var flip = high >> 31;

      // ref: src/google/protobuf/wire_format_lite.h
      writeVarint64(bb, {
        low: (low << 1) ^ flip,
        high: ((high << 1) | (low >>> 31)) ^ flip,
        unsigned: false,
      });
    }

    return exports;
  }

  async function getDecryptedImageData(encryptedImageData) {
    function En(e) {
      const t = e.match(/.{1,2}/g);
      return new Uint8Array(t.map((function (e) {
        return parseInt(e, 16)
      })));
    }

    const decryptedImageData = [];
    for (let i = 0; i < encryptedImageData.length; i++) {
      const encryptedImage = await axios.get(encryptedImageData[i].url, { responseType: 'arraybuffer' }).then(res => res.data);
      const key = await crypto.subtle.importKey('raw', En(encryptedImageData[i].key), "AES-CBC", false, ['decrypt']);
      decryptedImageData.push(await crypto.subtle.decrypt({ name: 'AES-CBC', iv: En(encryptedImageData[i].iv) }, key, encryptedImage));
    }

    return decryptedImageData;
  }

  async function download(encryptedImageData, title, dlBtn) {
    const decryptedImageData = await getDecryptedImageData(encryptedImageData);

    const zip = new JSZip();
    const folder = zip.folder(title);
    decryptedImageData.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpeg`, image));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);
      dlBtn.innerText = "下载完毕";
    });
  }

})(axios, JSZip, saveAs);