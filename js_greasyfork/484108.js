// ==UserScript==
// @name         哔哩哔哩直播 码率
// @namespace    https://github.com/PaperStrike
// @version      1.1.0
// @description  展示哔哩哔哩直播“预估视频片段码率/服务端回报视频码率”信息。查看方法：右键播放区域，点击“视频统计信息”。
// @author       sliphua
// @match        https://live.bilibili.com/*
// @icon         https://live.bilibili.com/favicon.ico
// @run-at       document-start
// @sandbox      JavaScript
// @grant        unsafeWindow
// @grant        GM.notification
// @downloadURL https://update.greasyfork.org/scripts/484108/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%20%E7%A0%81%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/484108/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%20%E7%A0%81%E7%8E%87.meta.js
// ==/UserScript==

(() => {
  class SpyRates {
    // 最新 m3u8 片段的码率
    frameKbps = 0;

    // 最新 flv 视频片段的码率
    packetKbps = 0;

    // 服务端回报的音频码率
    audioKbps = 0;

    // 服务端回报的视频码率
    videoKbps = 0;

    /**
     * 当前直播流解析模式
     * @type {'m3u8'|'flv'|null}
     */
    mode = null;

    // 当前直播流是否被正确解析
    supported = true;

    /**
     * @param {Response} response
     */
    async parseM3u8(response) {
      const content = await response.clone().text();

      // Example:
      // #EXT-BILI-AUX:be4a52|K|106967|eca94dad
      // #EXTINF:1.00,106967|eca94dad
      const durationSizeRegex = /#EXTINF:([0-9.]+),([0-9a-f]+)/g;

      let size = 0;
      let duration = 0; // usually ~5s
      for (const [, durationStr, sizeStr] of content.matchAll(durationSizeRegex)) {
        size += Number.parseInt(sizeStr, 16);
        duration += Number(durationStr);
      }

      if (size && duration) {
        this.supported = true;
        this.frameKbps = 8 * size / duration / 1e3;
      } else {
        this.supported = false;
        this.frameKbps = 0;
      }
    }

    /**
     * @param {Response} response
     */
    async parseFlv(response) {
      const read = this.spyResponseBodyReader(response);

      /** @type {Uint8Array|null} */
      let buffer = new Uint8Array(0);
      let size = 0;
      /** @type {[size: number, timestamp: number][]|null} */
      const view = [];
      while (buffer) {
        const [nextBuffer, packetSize, packetTimestamp] = await this.parseFlvPacket(read, buffer);
        buffer = nextBuffer;
        if (packetSize === 0) continue; // not a video packet

        size += packetSize;
        view.push([packetSize, packetTimestamp]);
        if (view.length < 2) continue; // not enough packets

        // Keep the window minimal and >= 5s
        while (view.length > 2) {
          const [[firstSize, _firstTimestamp], [_secondSize, secondTimestamp]] = view;
          if (packetTimestamp - secondTimestamp < 5000) break;
          size -= firstSize;
          view.shift();
        }

        const [[_firstSize, firstTimestamp]] = view;
        this.packetKbps = 8 * size / (packetTimestamp - firstTimestamp);
        this.supported = true;
      }

      this.supported = false;
    }

    /**
     * @param {() => Promise<BodyReadResult>} read
     * @param {Uint8Array} buffer
     * @returns {Promise<[Uint8Array|null, size: number, timestamp: number]>}
     */
    async parseFlvPacket(read, buffer) {
      while (buffer.byteLength < 11) {
        const { value, done } = await read();
        if (done) return [null, 0, 0];
        buffer = new Uint8Array([...buffer, ...value]);
      }

      const [flags, size0, size1, size2, t0, t1, t2, tE, id0] = buffer;

      const dataSize = (size0 << 16) | (size1 << 8) | size2;

      // FLV header
      if (dataSize === 0x4c5601 && flags === 0x46) {
        const size = (t1 << 24) | (t2 << 16) | (tE << 8) | id0;
        const totalSize = size + 4;
        const nextBuffer = await this.skipBytes(read, buffer, totalSize);
        return [nextBuffer, 0, 0];
      }

      if (dataSize > 0xc00000) {
        throw new Error(`FLV packet data too large: 0x${dataSize.toString(16)}`);
      }

      const totalSize = 11 + dataSize + 4;
      const nextBuffer = await this.skipBytes(read, buffer, totalSize);

      const type = flags & 0b11111;
      if (type === 0x09) {
        const timestamp = (t0 << 16) | (t1 << 8) | t2 | (tE << 24); // in ms
        return [nextBuffer, totalSize, timestamp];
      }

      return [nextBuffer, 0, 0];
    }

    /**
     * @param {() => Promise<BodyReadResult>} read
     * @param {Uint8Array} buffer
     * @param {number} count
     * @returns {Promise<Uint8Array|null>}
     */
    async skipBytes(read, buffer, count) {
      let size = buffer.byteLength;
      if (size >= count) return buffer.subarray(count);

      while (true) {
        const { value, done } = await read();
        if (done) return null;
        const nextSize = size + value.byteLength;
        if (nextSize >= count) {
          return value.subarray(count - size);
        }
        size = nextSize;
      }
    }

    /**
     * Spy the response body reader instead of cloning the response.
     * There's no API to sync the lifecycle with the cloned stream.
     * Also, spying uses less memory.
     * @param {Response} response
     * @returns {() => Promise<BodyReadResult>}
     */
    spyResponseBodyReader(response) {
      if (!response.body) {
        throw new Error('Response body is null');
      }

      /** @type {BodyReadResult[]} */
      const pendingResults = [];

      /** @type {((value: BodyReadResult) => void)|null} */
      let pendingResolve = null;

      response.body.getReader = new Proxy(response.body.getReader, {
        apply(target, thisArg, args) {
          /** @type {BodyReader} */
          const reader = Reflect.apply(target, thisArg, args);
          reader.read = new Proxy(reader.read, {
            async apply(target, thisArg, args) {
              /** @type {BodyReadResult} */
              const result = await Reflect.apply(target, thisArg, args);
              if (pendingResolve) {
                pendingResolve(result);
                pendingResolve = null;
              } else {
                pendingResults.push(result);
              }
              return result;
            },
          });
          return reader;
        },
      });

      return () => new Promise((resolve) => {
        const result = pendingResults.shift();
        if (result) {
          resolve(result);
        } else {
          pendingResolve = resolve;
        }
      });
    }

    /** @type {VideoPanel|null} */
    panel = null; // for debugging

    /** @type {StreamInfo|null} */
    streamInfo = null; // for debugging

    /** @type {unknown} */
    lastError = null;

    /**
     * @param {VideoPanel} panel
     */
    constructor(panel) {
      this.panel = panel; // for debugging

      // Spy frameKbps
      unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
        apply: (target, thisArg, args) => {
          /** @type {Promise<Response>} */
          const result = Reflect.apply(target, thisArg, args);

          // */live-bvc/{num}/live_{word}(/{word})?.(m3u8|flv)*
          // Examples:
          // https://xy221x11x101x198xy.mcdn.bilivideo.cn:486/live-bvc/645043/live_7263131_8977223_minihevc/index.m3u8
          // https://xy221x11x101x198xy.mcdn.bilivideo.cn:486/live-bvc/645043/live_7263131_8977223_prohevc/index.m3u8
          // https://xy221x11x101x198xy.mcdn.bilivideo.cn:486/live-bvc/645043/live_7263131_8977223/index.m3u8
          // https://xy221x11x101x197xy.mcdn.bilivideo.cn:486/live-bvc/238242/live_22259479_ab_745908762254479374_bluray/index.m3u8
          // https://xy221x11x101x198xy.mcdn.bilivideo.cn:486/live-bvc/645043/live_7263131_8977223.flv
          const streamUrlRegex = /\/live-bvc\/\d+\/live_\w+(?:\/\w+)?\.(m3u8|flv)/;

          const match = streamUrlRegex.exec(args[0]);
          if (match) {
            const [, ext] = match;
            result
              .then((response) => {
                if (!response.ok) return;
                if (ext === 'm3u8') {
                  return this.parseM3u8(response);
                } else if (ext === 'flv') {
                  return this.parseFlv(response);
                }
              })
              .catch((e) => {
                this.supported = false;
                this.lastError = e;
              });
          }

          return result;
        }
      });

      // Spy audioKbps / videoKbps
      panel.updateVideoTemplate = new Proxy(panel.updateVideoTemplate, {
        apply: (target, thisArg, args) => {
          /** @type {StreamInfo} */
          const streamInfo = args[0];
          this.streamInfo = streamInfo; // for debugging
          if (streamInfo?.mediaInfo) {
            const { audioDataRate, videoDataRate, videoSrc } = streamInfo.mediaInfo;
            this.audioKbps = audioDataRate;
            this.videoKbps = videoDataRate;
            if (videoSrc.includes('.m3u8')) {
              this.mode = 'm3u8';
            } else if (videoSrc.includes('.flv')) {
              this.mode = 'flv';
            } else {
              this.mode = null;
            }
          }
          return Reflect.apply(target, thisArg, args);
        },
      });

      // Print to video panel
      panel.createTemplateProxy = new Proxy(panel.createTemplateProxy, {
        /**
         * @param {VideoPanel} thisArg
         */
        apply: (target, thisArg, args) => {
          /** @type {VideoTemplate} */
          const result = Reflect.apply(target, thisArg, args);
          return new Proxy(result, {
            set: (propTarget, property, value, receiver) => {
              if (property === 'videoInfo' && value) {
                const reported = thisArg.computeBps(this.videoKbps);
                if (this.mode && this.supported) {
                  // 预估视频片段码率
                  let estimated;
                  if (this.mode === 'm3u8') {
                    // m3u8：最新片段码率 - 服务端回报音频码率
                    estimated = thisArg.computeBps(this.frameKbps - this.audioKbps);
                  } else {
                    // flv：最新视频片段码率
                    estimated = thisArg.computeBps(this.packetKbps);
                  }
                  value = `${value}, ${estimated}/${reported}`;
                } else {
                  value = `${value}, ${reported}`;
                }
              }
              return Reflect.set(propTarget, property, value, receiver);
            },
          });
        },
      });
    }
  }

  // Hunt WeakMap for the video panel
  const originalWeakMapSet = WeakMap.prototype.set;
  WeakMap.prototype.set = new Proxy(originalWeakMapSet, {
    apply(target, thisArg, args) {
      const [candidate] = args;

      if (candidate !== null
      && typeof candidate === 'object'
      && 'updateVideoTemplate' in candidate
      && 'createTemplateProxy' in candidate) {
        // Restore WeakMap hack
        WeakMap.prototype.set = originalWeakMapSet;

        // Expose the spy to window for debug info
        unsafeWindow.debugSpyRates = new SpyRates(candidate);
      }

      return Reflect.apply(target, thisArg, args);
    },
  });
})();
