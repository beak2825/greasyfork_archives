// ==UserScript==
// @name         ComicFuzDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.9
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-fuz.com
// @icon         https://comic-fuz.com/favicons/favicon-32x32.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451863-comicfuzdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-fuz.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469722/ComicFuzDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469722/ComicFuzDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // if not in specific manga chapter
  const re4Path = /https:\/\/comic-fuz\.com\/manga\/\d+.*/;
  const timer4Path = setInterval(() => {
    if (re4Path.test(window.location.href)) {
      const currentTitle = document.querySelector('[class*=Chapter_chapter__isReading] h3[class*=Chapter_chapter__name]')?.textContent;
      const chapters = __NEXT_DATA__?.props?.pageProps?.chapters?.reduce((acc, cur) => acc.concat(cur.chapters), []);
      if (currentTitle && chapters) {
        for (const chapter of chapters) {
          if (chapter.chapterMainName === currentTitle) {
            clearInterval(timer4Path)
            window.location.href = `https://comic-fuz.com/manga/viewer/${chapter.chapterId}`;
          }
        }
      }
    }
  }, 200);

  // reload page when enter or leave chapter
  const re = /https:\/\/comic-fuz\.com\/(manga|book|magazine)\/(viewer|\d+).*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // get type and id
  const { type, id } = window.location.pathname.match(/\/(?<type>.*)\/viewer\/(?<id>.*)/).groups;

  // set the endpoint of API request
  const endpoint = ({
    'manga': 'manga_viewer',
    'book': 'book_viewer_2',
    'magazine': 'magazine_viewer_2',
  })[type];

  // set the body of API request
  const requestBody = ({
    'manga': {
      deviceInfo: { deviceType: 2 },
      chapterId: id,
      useTicket: false,
      consumePoint: { event: 0, paid: 0 }
    },
    'book': {
      deviceInfo: { deviceType: 2 },
      bookIssueId: id,
      purchaseRequest: false,
      consumePaidPoint: 0
    },
    'magazine': {
      deviceInfo: { deviceType: 2 },
      magazineIssueId: id,
      purchaseRequest: false,
      consumePaidPoint: 0
    },
  })[type];

  // get config data from API
  const url = `https://api.comic-fuz.com/v1/${endpoint}`;
  const config = await fetch(url, {
    method: 'POST',
    body: createInfoSchema().encodeInfo(requestBody),
    credentials: 'include',
  }).then(res => res.text());

  // get encrypted image data
  const imageDataRegexp = /(\/[fkh].*&e=\d{10}).*([0-9a-z]{32})"@([0-9a-z]{64})/gm;
  const encryptedImageData = Array.from(config.matchAll(imageDataRegexp)).map(item => ({ url: 'https://img.comic-fuz.com' + item[1], iv: item[2], key: item[3] }));

  // get title
  const { mangaName, chapterMainName, chapterSubName } = await new Promise(resolve => {
    const timer = setInterval(() => {
      try {
        const target = document.getElementById('__NEXT_DATA__');
        const chapterData = JSON.parse(target.textContent).props.pageProps.data;
        if (chapterData) {
          clearInterval(timer);
          resolve({
            mangaName: chapterData.mangaName,
            chapterMainName: chapterData.chapterMainName,
            chapterSubName: chapterData.chapterSubName
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 200);
  });
  const title0 = `${mangaName} ${chapterMainName} ${chapterSubName}`;
    let title = title0.replace(/(\?|\~|\/|\:|undefined)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            'undefined':'',
            }[$1];
            });
  
  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: encryptedImageData.length,
    getImagePromises,
    title,
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return encryptedImageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(data) {
    function En(e) {
      const t = e.match(/.{1,2}/g);
      return new Uint8Array(t.map((function (e) {
        return parseInt(e, 16)
      })));
    }

    const encryptedImage = await axios.get(data.url, { responseType: 'arraybuffer' }).then(res => res.data);
    const key = await crypto.subtle.importKey('raw', En(data.key), "AES-CBC", false, ['decrypt']);
    const decryptedImage = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: En(data.iv) }, key, encryptedImage);

    return decryptedImage;
  }

  // I copy these code from somewhere else before, but I cant find the source now.
  // But surely they are related to 'protobuf' and 'protobufjs'
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

      // I try this and it works!
      var $bookIssueId = message.bookIssueId;
      if ($bookIssueId !== undefined) {
        writeVarint32(bb, 16);
        writeVarint32(bb, $bookIssueId);
      }

      // I try this and it works!
      var $magazineIssueId = message.magazineIssueId;
      if ($magazineIssueId !== undefined) {
        writeVarint32(bb, 16);
        writeVarint32(bb, $magazineIssueId);
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

    // The code below was modified from https://github.com/protobufjs/bytebuffer.js
    // which is under the Apache License 2.0.

    var f32 = new Float32Array(1);
    var f32_u8 = new Uint8Array(f32.buffer);

    var f64 = new Float64Array(1);
    var f64_u8 = new Uint8Array(f64.buffer);

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

    return exports;
  }

})(axios, JSZip, saveAs, ImageDownloader);
