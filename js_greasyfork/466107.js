// ==UserScript==
// @name         91-plus
// @namespace    jiuyi
// @version      17
// @author       uh58fg
// @description  多线程下载91porn视频，跳过广告，清除页面广告。
// @license      WTFPL
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        *91porn.com/view_video.php?*
// @match        *91porn.com/index.php
// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/dplayer/1.26.0/DPlayer.min.js
// @require      https://greasyfork.org/scripts/466106-91-plus-mux-mp4/code/91-plus-mux-mp4.js?version=1189391
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.runtime.global.prod.min.js
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/466107/91-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/466107/91-plus.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(' .row2[data-v-56d4409a]{display:flex;justify-content:flex-end}.big-btn[data-v-56d4409a]{position:relative;display:inline-flex;justify-content:center;align-items:center;margin-left:1rem;font-size:1.6rem;min-width:10rem;color:#fff;cursor:pointer;border-radius:4px;border:1px solid #eeeeee;background-color:#3d8ac7;opacity:1;transition:.3s all;padding:.5rem 1rem}.big-btn[data-v-56d4409a]:hover{opacity:.9}.big-btn.disable[data-v-56d4409a]{cursor:not-allowed;background-color:#ddd;color:#000}.m-p-input-container[data-v-56d4409a]{display:flex}.m-p-input-container input[data-v-56d4409a]{flex:1;display:block;padding:0 1rem;font-size:1.8rem;border-radius:4px;box-shadow:none;color:#fff;background:rgba(239,239,239,.3);border:1px solid #cccccc}.m-p-tips[data-v-56d4409a]{width:100%;color:#999;text-align:left;font-style:italic;word-break:break-all}.m-p-tips p[data-v-56d4409a]{width:100px;display:inline-block}.m-p-tips.error-tips[data-v-56d4409a]{color:#dc5350}.m-p-segment[data-v-56d4409a]{text-align:left}.m-p-segment .item[data-v-56d4409a]{display:inline-block;margin:10px 6px;width:50px;height:40px;color:#fff;line-height:40px;text-align:center;border-radius:4px;cursor:help;border:solid 1px #eeeeee;background-color:#ddd;transition:.3s all}.m-p-segment .finish[data-v-56d4409a]{background-color:#0acd76}.m-p-segment .error[data-v-56d4409a]{cursor:pointer;background-color:#dc5350}.m-p-segment .error[data-v-56d4409a]:hover{opacity:.9}.error-btns[data-v-56d4409a]{display:flex;justify-content:flex-end;gap:1rem}.m-p-force[data-v-56d4409a],.m-p-retry[data-v-56d4409a]{margin-top:1rem;right:50px;display:inline-block;padding:6px 12px;font-size:18px;color:#fff;cursor:pointer;border-radius:4px;border:1px solid #eeeeee;background-color:#3d8ac7;opacity:1;transition:.3s all}.m-p-retry[data-v-56d4409a]{right:250px}.m-p-force[data-v-56d4409a]:hover,.m-p-retry[data-v-56d4409a]:hover{opacity:.9}.info[data-v-56d4409a]{display:flex;justify-content:center;align-items:center;gap:1rem;margin-bottom:1rem}.info .options[data-v-56d4409a]{margin-right:1rem;display:flex;flex-direction:column;align-items:flex-end}.info .option[data-v-56d4409a]{cursor:pointer;display:flex;justify-content:center;align-items:center;color:#fff;margin-bottom:.3rem}.info .option label[data-v-56d4409a]{margin:0}.info .option input[data-v-56d4409a]{margin:0;margin-left:1rem;width:1.4rem;height:1.4rem}.progress[data-v-56d4409a]{flex:1;border-radius:.8rem;opacity:1;height:1.5rem;background:#FCFDFF;box-sizing:border-box;border:.1rem solid #FFFFFF;box-shadow:inset 0 -1rem 4rem #fffc,inset 0 1rem 4rem #2d4c7266;display:flex;align-items:center;justify-content:space-between;position:relative}.progress .bar[data-v-56d4409a]{height:100%;width:50%;left:0;top:0;position:absolute;background:linear-gradient(90deg,#9CDCFF 0%,#0ACD76 100%);border-radius:.8rem}.row2[data-v-429419b2]{display:flex;justify-content:flex-end}.big-btn[data-v-429419b2]{position:relative;display:inline-flex;justify-content:center;align-items:center;margin-left:1rem;font-size:1.6rem;min-width:10rem;color:#fff;cursor:pointer;border-radius:4px;border:1px solid #eeeeee;background-color:#3d8ac7;opacity:1;transition:.3s all;padding:.5rem 1rem}.big-btn[data-v-429419b2]:hover{opacity:.9}.big-btn.disable[data-v-429419b2]{cursor:not-allowed;background-color:#ddd;color:#000}.m-p-input-container[data-v-429419b2]{display:flex}.m-p-input-container input[data-v-429419b2]{flex:1;display:block;padding:0 1rem;font-size:1.8rem;border-radius:4px;box-shadow:none;color:#fff;background:rgba(239,239,239,.3);border:1px solid #cccccc}.m-p-tips[data-v-429419b2]{width:100%;color:#999;text-align:left;font-style:italic;word-break:break-all}.m-p-tips p[data-v-429419b2]{width:100px;display:inline-block}.m-p-tips.error-tips[data-v-429419b2]{color:#dc5350}.m-p-segment[data-v-429419b2]{text-align:left}.m-p-segment .item[data-v-429419b2]{display:inline-block;margin:10px 6px;width:50px;height:40px;color:#fff;line-height:40px;text-align:center;border-radius:4px;cursor:help;border:solid 1px #eeeeee;background-color:#ddd;transition:.3s all}.m-p-segment .finish[data-v-429419b2]{background-color:#0acd76}.m-p-segment .error[data-v-429419b2]{cursor:pointer;background-color:#dc5350}.m-p-segment .error[data-v-429419b2]:hover{opacity:.9}.error-btns[data-v-429419b2]{display:flex;justify-content:flex-end;gap:1rem}.m-p-force[data-v-429419b2],.m-p-retry[data-v-429419b2]{margin-top:1rem;right:50px;display:inline-block;padding:6px 12px;font-size:18px;color:#fff;cursor:pointer;border-radius:4px;border:1px solid #eeeeee;background-color:#3d8ac7;opacity:1;transition:.3s all}.m-p-retry[data-v-429419b2]{right:250px}.m-p-force[data-v-429419b2]:hover,.m-p-retry[data-v-429419b2]:hover{opacity:.9}.info[data-v-429419b2]{display:flex;justify-content:center;align-items:center;gap:1rem;margin-bottom:1rem}.info .options[data-v-429419b2]{margin-right:1rem;display:flex;flex-direction:column;align-items:flex-end}.info .option[data-v-429419b2]{cursor:pointer;display:flex;justify-content:center;align-items:center;color:#fff;margin-bottom:.3rem}.info .option label[data-v-429419b2]{margin:0}.info .option input[data-v-429419b2]{margin:0;margin-left:1rem;width:1.4rem;height:1.4rem}.progress[data-v-429419b2]{flex:1;border-radius:.8rem;opacity:1;height:1.5rem;background:#FCFDFF;box-sizing:border-box;border:.1rem solid #FFFFFF;box-shadow:inset 0 -1rem 4rem #fffc,inset 0 1rem 4rem #2d4c7266;display:flex;align-items:center;justify-content:space-between;position:relative}.progress .bar[data-v-429419b2]{height:100%;width:50%;left:0;top:0;position:absolute;background:linear-gradient(90deg,#9CDCFF 0%,#0ACD76 100%);border-radius:.8rem}[data-v-a069d05a]::-webkit-scrollbar{width:10px}[data-v-a069d05a]::-webkit-scrollbar-thumb{background:#4e4e4e;border-radius:25px}.showBtn[data-v-a069d05a]{cursor:pointer;position:fixed;top:1rem;right:1rem;color:#fff;z-index:99999;background:gray;padding:.6rem 1rem;border-radius:.3rem}.content[data-v-a069d05a]{z-index:9999;background:#0f0f0f;position:fixed;left:0;top:0;width:100vw;min-width:100vw;height:100vh;box-sizing:border-box;padding:1rem;display:flex;gap:2rem;text-align:start}.content .close[data-v-a069d05a]{cursor:pointer;position:absolute;top:1rem;right:2rem;width:2rem;height:2rem;line-height:4rem;text-align:center;color:#fff}.content .close[data-v-a069d05a]:before{position:absolute;content:"";width:.2rem;height:2rem;background:white;transform:rotate(45deg);top:calc(50% - .45rem);left:50%}.content .close[data-v-a069d05a]:after{content:"";position:absolute;width:.2rem;height:2rem;background:white;transform:rotate(-45deg);top:calc(50% - .45rem);left:50%}.content .home-icon[data-v-a069d05a]{cursor:pointer;right:2rem;position:absolute}.content .big-title[data-v-a069d05a]{position:relative;display:flex;align-items:center;justify-content:center;height:5rem;font-weight:700;color:#fff;letter-spacing:2px;background:#212121;font-size:2rem}.content .video[data-v-a069d05a]{width:60%;overflow:auto;padding-bottom:2rem}.content .video #dplayer[data-v-a069d05a]{width:100%}.content .video .title[data-v-a069d05a]{margin-top:1rem;font-weight:700;font-size:2rem;color:#fff;margin-bottom:1rem}.content .video .author[data-v-a069d05a]{margin-right:2rem;font-weight:700;font-size:1.4rem;margin-bottom:2rem;display:inline-block}.content .left[data-v-a069d05a]{flex:1;border:1px solid gray;border-radius:.5rem;overflow:hidden;position:relative}.content .left .comments[data-v-a069d05a]{color:#fff;height:calc(100% - 6rem);padding-bottom:4rem;overflow:auto}.content .left .comments .item[data-v-a069d05a]{margin-bottom:5px;padding:10px;border-bottom:1px solid #3f3f3f;text-align:start}.content .left .comments .item .title[data-v-a069d05a]{font-size:1rem}.content .left .comments .item .title span[data-v-a069d05a]{margin-right:10px}.content .left .comments .item .quote[data-v-a069d05a]{margin-top:.5rem;font-size:1rem;padding:.5rem .5rem .5rem 1rem;border:1px dashed gray}.content .left .comments .item .replay[data-v-a069d05a]{margin-top:1rem}.content .right[data-v-a069d05a]{flex:1;border:1px solid gray;border-radius:.5rem;overflow:hidden}.content .right .list[data-v-a069d05a]{color:#fff;height:calc(100% - 6rem);padding:1rem 1rem 4rem;overflow:auto}.ml20[data-v-a069d05a]{margin-left:20px} ');

(function (vue) {
  'use strict';

  var _monkeyWindow = /* @__PURE__ */ (() => window)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function removePadding(buffer) {
    const outputBytes = buffer.byteLength;
    const paddingBytes = outputBytes && new DataView(buffer).getUint8(outputBytes - 1);
    if (paddingBytes) {
      return buffer.slice(0, outputBytes - paddingBytes);
    } else {
      return buffer;
    }
  }
  function AESDecryptor() {
    return {
      constructor() {
        this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
        this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
        this.sBox = new Uint32Array(256);
        this.invSBox = new Uint32Array(256);
        this.key = new Uint32Array(0);
        this.initTable();
      },
      // Using view.getUint32() also swaps the byte order.
      uint8ArrayToUint32Array_(arrayBuffer) {
        let view = new DataView(arrayBuffer);
        let newArray = new Uint32Array(4);
        for (let i = 0; i < 4; i++) {
          newArray[i] = view.getUint32(i * 4);
        }
        return newArray;
      },
      initTable() {
        let sBox = this.sBox;
        let invSBox = this.invSBox;
        let subMix = this.subMix;
        let subMix0 = subMix[0];
        let subMix1 = subMix[1];
        let subMix2 = subMix[2];
        let subMix3 = subMix[3];
        let invSubMix = this.invSubMix;
        let invSubMix0 = invSubMix[0];
        let invSubMix1 = invSubMix[1];
        let invSubMix2 = invSubMix[2];
        let invSubMix3 = invSubMix[3];
        let d = new Uint32Array(256);
        let x = 0;
        let xi = 0;
        let i = 0;
        for (i = 0; i < 256; i++) {
          if (i < 128) {
            d[i] = i << 1;
          } else {
            d[i] = i << 1 ^ 283;
          }
        }
        for (i = 0; i < 256; i++) {
          let sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
          sx = sx >>> 8 ^ sx & 255 ^ 99;
          sBox[x] = sx;
          invSBox[sx] = x;
          let x2 = d[x];
          let x4 = d[x2];
          let x8 = d[x4];
          let t = d[sx] * 257 ^ sx * 16843008;
          subMix0[x] = t << 24 | t >>> 8;
          subMix1[x] = t << 16 | t >>> 16;
          subMix2[x] = t << 8 | t >>> 24;
          subMix3[x] = t;
          t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
          invSubMix0[sx] = t << 24 | t >>> 8;
          invSubMix1[sx] = t << 16 | t >>> 16;
          invSubMix2[sx] = t << 8 | t >>> 24;
          invSubMix3[sx] = t;
          if (!x) {
            x = xi = 1;
          } else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
          }
        }
      },
      expandKey(keyBuffer) {
        let key = this.uint8ArrayToUint32Array_(keyBuffer);
        let sameKey = true;
        let offset = 0;
        while (offset < key.length && sameKey) {
          sameKey = key[offset] === this.key[offset];
          offset++;
        }
        if (sameKey) {
          return;
        }
        this.key = key;
        let keySize = this.keySize = key.length;
        if (keySize !== 4 && keySize !== 6 && keySize !== 8) {
          throw new Error("Invalid aes key size=" + keySize);
        }
        let ksRows = this.ksRows = (keySize + 6 + 1) * 4;
        let ksRow;
        let invKsRow;
        let keySchedule = this.keySchedule = new Uint32Array(ksRows);
        let invKeySchedule = this.invKeySchedule = new Uint32Array(ksRows);
        let sbox = this.sBox;
        let rcon = this.rcon;
        let invSubMix = this.invSubMix;
        let invSubMix0 = invSubMix[0];
        let invSubMix1 = invSubMix[1];
        let invSubMix2 = invSubMix[2];
        let invSubMix3 = invSubMix[3];
        let prev;
        let t;
        for (ksRow = 0; ksRow < ksRows; ksRow++) {
          if (ksRow < keySize) {
            prev = keySchedule[ksRow] = key[ksRow];
            continue;
          }
          t = prev;
          if (ksRow % keySize === 0) {
            t = t << 8 | t >>> 24;
            t = sbox[t >>> 24] << 24 | sbox[t >>> 16 & 255] << 16 | sbox[t >>> 8 & 255] << 8 | sbox[t & 255];
            t ^= rcon[ksRow / keySize | 0] << 24;
          } else if (keySize > 6 && ksRow % keySize === 4) {
            t = sbox[t >>> 24] << 24 | sbox[t >>> 16 & 255] << 16 | sbox[t >>> 8 & 255] << 8 | sbox[t & 255];
          }
          keySchedule[ksRow] = prev = (keySchedule[ksRow - keySize] ^ t) >>> 0;
        }
        for (invKsRow = 0; invKsRow < ksRows; invKsRow++) {
          ksRow = ksRows - invKsRow;
          if (invKsRow & 3) {
            t = keySchedule[ksRow];
          } else {
            t = keySchedule[ksRow - 4];
          }
          if (invKsRow < 4 || ksRow <= 4) {
            invKeySchedule[invKsRow] = t;
          } else {
            invKeySchedule[invKsRow] = invSubMix0[sbox[t >>> 24]] ^ invSubMix1[sbox[t >>> 16 & 255]] ^ invSubMix2[sbox[t >>> 8 & 255]] ^ invSubMix3[sbox[t & 255]];
          }
          invKeySchedule[invKsRow] = invKeySchedule[invKsRow] >>> 0;
        }
      },
      // Adding this as a method greatly improves performance.
      networkToHostOrderSwap(word) {
        return word << 24 | (word & 65280) << 8 | (word & 16711680) >> 8 | word >>> 24;
      },
      decrypt(inputArrayBuffer, offset, aesIV, removePKCS7Padding) {
        let nRounds = this.keySize + 6;
        let invKeySchedule = this.invKeySchedule;
        let invSBOX = this.invSBox;
        let invSubMix = this.invSubMix;
        let invSubMix0 = invSubMix[0];
        let invSubMix1 = invSubMix[1];
        let invSubMix2 = invSubMix[2];
        let invSubMix3 = invSubMix[3];
        let initVector = this.uint8ArrayToUint32Array_(aesIV);
        let initVector0 = initVector[0];
        let initVector1 = initVector[1];
        let initVector2 = initVector[2];
        let initVector3 = initVector[3];
        let inputInt32 = new Int32Array(inputArrayBuffer);
        let outputInt32 = new Int32Array(inputInt32.length);
        let t0, t1, t2, t3;
        let s0, s1, s2, s3;
        let inputWords0, inputWords1, inputWords2, inputWords3;
        let ksRow, i;
        let swapWord = this.networkToHostOrderSwap;
        while (offset < inputInt32.length) {
          inputWords0 = swapWord(inputInt32[offset]);
          inputWords1 = swapWord(inputInt32[offset + 1]);
          inputWords2 = swapWord(inputInt32[offset + 2]);
          inputWords3 = swapWord(inputInt32[offset + 3]);
          s0 = inputWords0 ^ invKeySchedule[0];
          s1 = inputWords3 ^ invKeySchedule[1];
          s2 = inputWords2 ^ invKeySchedule[2];
          s3 = inputWords1 ^ invKeySchedule[3];
          ksRow = 4;
          for (i = 1; i < nRounds; i++) {
            t0 = invSubMix0[s0 >>> 24] ^ invSubMix1[s1 >> 16 & 255] ^ invSubMix2[s2 >> 8 & 255] ^ invSubMix3[s3 & 255] ^ invKeySchedule[ksRow];
            t1 = invSubMix0[s1 >>> 24] ^ invSubMix1[s2 >> 16 & 255] ^ invSubMix2[s3 >> 8 & 255] ^ invSubMix3[s0 & 255] ^ invKeySchedule[ksRow + 1];
            t2 = invSubMix0[s2 >>> 24] ^ invSubMix1[s3 >> 16 & 255] ^ invSubMix2[s0 >> 8 & 255] ^ invSubMix3[s1 & 255] ^ invKeySchedule[ksRow + 2];
            t3 = invSubMix0[s3 >>> 24] ^ invSubMix1[s0 >> 16 & 255] ^ invSubMix2[s1 >> 8 & 255] ^ invSubMix3[s2 & 255] ^ invKeySchedule[ksRow + 3];
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
            ksRow = ksRow + 4;
          }
          t0 = invSBOX[s0 >>> 24] << 24 ^ invSBOX[s1 >> 16 & 255] << 16 ^ invSBOX[s2 >> 8 & 255] << 8 ^ invSBOX[s3 & 255] ^ invKeySchedule[ksRow];
          t1 = invSBOX[s1 >>> 24] << 24 ^ invSBOX[s2 >> 16 & 255] << 16 ^ invSBOX[s3 >> 8 & 255] << 8 ^ invSBOX[s0 & 255] ^ invKeySchedule[ksRow + 1];
          t2 = invSBOX[s2 >>> 24] << 24 ^ invSBOX[s3 >> 16 & 255] << 16 ^ invSBOX[s0 >> 8 & 255] << 8 ^ invSBOX[s1 & 255] ^ invKeySchedule[ksRow + 2];
          t3 = invSBOX[s3 >>> 24] << 24 ^ invSBOX[s0 >> 16 & 255] << 16 ^ invSBOX[s1 >> 8 & 255] << 8 ^ invSBOX[s2 & 255] ^ invKeySchedule[ksRow + 3];
          ksRow = ksRow + 3;
          outputInt32[offset] = swapWord(t0 ^ initVector0);
          outputInt32[offset + 1] = swapWord(t3 ^ initVector1);
          outputInt32[offset + 2] = swapWord(t2 ^ initVector2);
          outputInt32[offset + 3] = swapWord(t1 ^ initVector3);
          initVector0 = inputWords0;
          initVector1 = inputWords1;
          initVector2 = inputWords2;
          initVector3 = inputWords3;
          offset = offset + 4;
        }
        return removePKCS7Padding ? removePadding(outputInt32.buffer) : outputInt32.buffer;
      },
      destroy() {
        this.key = void 0;
        this.keySize = void 0;
        this.ksRows = void 0;
        this.sBox = void 0;
        this.invSBox = void 0;
        this.subMix = void 0;
        this.invSubMix = void 0;
        this.keySchedule = void 0;
        this.invKeySchedule = void 0;
        this.rcon = void 0;
      }
    };
  }
  const _sfc_main$2 = {
    name: "downloader",
    props: {
      url: "",
      title: ""
    },
    data() {
      return {
        conf: {
          autoDownload: true,
          autoSave: true,
          autoClose: false
        },
        show: false,
        tips: "m3u8 视频在线提取工具",
        // 顶部提示
        isPause: false,
        // 是否暂停下载
        isGetMP4: false,
        // 是否转码为 MP4 下载
        durationSecond: 0,
        // 视频持续时长
        isShowRefer: false,
        // 是否显示推送
        downloading: false,
        // 是否下载中
        beginTime: "",
        // 开始下载的时间
        errorNum: 0,
        // 错误数
        finishNum: 0,
        // 已下载数
        downloadIndex: 0,
        // 当前下载片段
        finishList: [],
        // 下载完成项目
        tsUrlList: [],
        // ts URL数组
        mediaFileList: [],
        // 下载的媒体数组
        isSupperStreamWrite: _monkeyWindow.streamSaver && !_monkeyWindow.streamSaver.useBlobFallback,
        // 当前浏览器是否支持流式下载
        streamWriter: null,
        // 文件流写入器
        streamDownloadIndex: 0,
        // 文件流写入器，正准备写入第几个视频片段
        rangeDownload: {
          // 特定范围下载
          isShowRange: false,
          // 是否显示范围下载
          startSegment: "",
          // 起始片段
          endSegment: "",
          // 截止片段
          targetSegment: 1
          // 待下载片段
        },
        aesConf: {
          // AES 视频解密配置
          method: "",
          // 加密算法
          uri: "",
          // key 所在文件路径
          iv: "",
          // 偏移值
          key: "",
          // 秘钥
          decryptor: null,
          // 解码器对象
          stringToBuffer: function(str) {
            return new TextEncoder().encode(str);
          }
        }
      };
    },
    computed: {
      progress() {
        return (this.finishNum / this.rangeDownload.targetSegment * 100).toFixed(2);
      }
    },
    watch: {
      conf: {
        handler(n, o) {
          localStorage.setItem("porn-plus", JSON.stringify(n));
        },
        deep: true
      },
      progress(n, o) {
        document.title = Number(n).toFixed(0) + "% " + this.title;
      }
    },
    created() {
      console.log("m3u8-downloader.vue");
      this.getConf();
      if (this.conf.autoDownload) {
        this.getMP4();
      }
      setInterval(this.retryAll.bind(this), 2e3);
    },
    methods: {
      // ajax 请求
      ajax(options) {
        options = options || {};
        let xhr = new XMLHttpRequest();
        if (options.type === "file") {
          xhr.responseType = "arraybuffer";
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            let status = xhr.status;
            if (status >= 200 && status < 300) {
              options.success && options.success(xhr.response);
            } else {
              options.fail && options.fail(status);
            }
          }
        };
        xhr.open("GET", options.url, true);
        xhr.send(null);
      },
      // 合成URL
      applyURL(targetURL, baseURL) {
        baseURL = baseURL || location.href;
        if (targetURL.indexOf("http") === 0) {
          if (location.href.indexOf("https") === 0) {
            return targetURL.replace("http://", "https://");
          }
          return targetURL;
        } else if (targetURL[0] === "/") {
          let domain = baseURL.split("/");
          return domain[0] + "//" + domain[2] + targetURL;
        } else {
          let domain = baseURL.split("/");
          domain.pop();
          return domain.join("/") + "/" + targetURL;
        }
      },
      // 使用流式下载，边下载边保存，解决大视频文件内存不足的难题
      streamDownload(isMp4) {
        this.isGetMP4 = isMp4;
        let fileName = this.title || this.formatTime(/* @__PURE__ */ new Date(), "YYYY_MM_DD hh_mm_ss");
        this.streamWriter = _monkeyWindow.streamSaver.createWriteStream(`${fileName}.${isMp4 ? "mp4" : "ts"}`).getWriter();
        this.getM3U8();
      },
      // 解析为 mp4 下载
      getMP4() {
        this.isGetMP4 = true;
        this.getM3U8();
      },
      // 获取在线文件
      getM3U8(onlyGetRange) {
        if (!this.url) {
          alert("请输入链接");
          return;
        }
        if (this.url.toLowerCase().indexOf("m3u8") === -1)
          ;
        if (this.downloading) {
          alert("资源下载中，请稍后");
          return;
        }
        this.tips = "m3u8 文件下载中，请稍后";
        this.beginTime = /* @__PURE__ */ new Date();
        this.ajax({
          url: this.url,
          success: (m3u8Str) => {
            this.tsUrlList = [];
            this.finishList = [];
            m3u8Str.split("\n").forEach((item) => {
              if (/^[^#]/.test(item)) {
                this.tsUrlList.push(this.applyURL(item, this.url));
                this.finishList.push({
                  title: item,
                  status: ""
                });
              }
            });
            if (onlyGetRange) {
              this.rangeDownload.isShowRange = true;
              this.rangeDownload.endSegment = this.tsUrlList.length;
              this.rangeDownload.targetSegment = this.tsUrlList.length;
              return;
            } else {
              let startSegment = Math.max(this.rangeDownload.startSegment || 1, 1);
              let endSegment = Math.max(this.rangeDownload.endSegment || this.tsUrlList.length, 1);
              startSegment = Math.min(startSegment, this.tsUrlList.length);
              endSegment = Math.min(endSegment, this.tsUrlList.length);
              this.rangeDownload.startSegment = Math.min(startSegment, endSegment);
              this.rangeDownload.endSegment = Math.max(startSegment, endSegment);
              this.rangeDownload.targetSegment = this.rangeDownload.endSegment - this.rangeDownload.startSegment + 1;
              this.downloadIndex = this.rangeDownload.startSegment - 1;
              this.downloading = true;
            }
            if (this.isGetMP4) {
              let infoIndex = 0;
              m3u8Str.split("\n").forEach((item) => {
                if (item.toUpperCase().indexOf("#EXTINF:") > -1) {
                  infoIndex++;
                  if (this.rangeDownload.startSegment <= infoIndex && infoIndex <= this.rangeDownload.endSegment) {
                    this.durationSecond += parseFloat(item.split("#EXTINF:")[1]);
                  }
                }
              });
            }
            console.log("this.durationSecond", this.durationSecond);
            if (m3u8Str.indexOf("#EXT-X-KEY") > -1) {
              this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ["", "", ""])[2];
              this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ["", "", ""])[2];
              this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ["", "", ""])[2];
              this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : "";
              this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url);
              this.getAES();
            } else if (this.tsUrlList.length > 0) {
              this.downloadTS();
            } else {
              this.alertError("资源为空，请查看链接是否有效");
            }
          },
          fail: () => {
            this.alertError("链接不正确，请查看链接是否有效");
          }
        });
      },
      // 获取AES配置
      getAES() {
        this.ajax({
          type: "file",
          url: this.aesConf.uri,
          success: (key) => {
            this.aesConf.key = key;
            this.aesConf.decryptor = new AESDecryptor();
            this.aesConf.decryptor.constructor();
            this.aesConf.decryptor.expandKey(this.aesConf.key);
            this.downloadTS();
          },
          fail: () => {
            this.alertError("视频已加密，可试用右下角入口的「无差别提取工具」");
          }
        });
      },
      // ts 片段的 AES 解码
      aesDecrypt(data, index) {
        let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index]);
        return this.aesConf.decryptor.decrypt(data, 0, iv.buffer || iv, true);
      },
      // 下载分片
      downloadTS() {
        this.tips = "ts 视频碎片下载中，请稍后";
        let download = () => {
          let isPause = this.isPause;
          let index = this.downloadIndex;
          if (index >= this.rangeDownload.endSegment) {
            return;
          }
          this.downloadIndex++;
          if (this.finishList[index] && this.finishList[index].status === "") {
            this.finishList[index].status = "downloading";
            this.ajax({
              url: this.tsUrlList[index],
              type: "file",
              success: (file) => {
                this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download());
              },
              fail: () => {
                this.errorNum++;
                this.finishList[index].status = "error";
                if (this.downloadIndex < this.rangeDownload.endSegment) {
                  !isPause && download();
                }
              }
            });
          } else if (this.downloadIndex < this.rangeDownload.endSegment) {
            !isPause && download();
          }
        };
        for (let i = 0; i < Math.min(6, this.rangeDownload.targetSegment - this.finishNum); i++) {
          download();
        }
      },
      // 处理 ts 片段，AES 解密、mp4 转码
      dealTS(file, index, callback) {
        const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file;
        this.conversionMp4(data, index, (afterData) => {
          this.mediaFileList[index - this.rangeDownload.startSegment + 1] = afterData;
          this.finishList[index].status = "finish";
          this.finishNum++;
          if (this.streamWriter) {
            for (let index2 = this.streamDownloadIndex; index2 < this.mediaFileList.length; index2++) {
              if (this.mediaFileList[index2]) {
                this.streamWriter.write(new Uint8Array(this.mediaFileList[index2]));
                this.mediaFileList[index2] = null;
                this.streamDownloadIndex = index2 + 1;
              } else {
                break;
              }
            }
            if (this.streamDownloadIndex >= this.rangeDownload.targetSegment) {
              this.streamWriter.close();
            }
          } else if (this.finishNum === this.rangeDownload.targetSegment) {
            let fileName = this.title || this.formatTime(this.beginTime, "YYYY_MM_DD hh_mm_ss");
            this.downloadFile(this.mediaFileList, fileName);
          }
          callback && callback();
        });
      },
      // 转码为 mp4
      conversionMp4(data, index, callback) {
        if (this.isGetMP4) {
          let transmuxer = new _monkeyWindow.muxjs.Transmuxer({
            keepOriginalTimestamps: true,
            duration: parseInt(this.durationSecond)
          });
          transmuxer.on("data", (segment) => {
            if (index === this.rangeDownload.startSegment - 1) {
              let data2 = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
              data2.set(segment.initSegment, 0);
              data2.set(segment.data, segment.initSegment.byteLength);
              callback(data2.buffer);
            } else {
              callback(segment.data);
            }
          });
          transmuxer.push(new Uint8Array(data));
          transmuxer.flush();
        } else {
          callback(data);
        }
      },
      // 暂停与恢复
      togglePause() {
        this.isPause = !this.isPause;
        !this.isPause && this.retryAll(true);
      },
      // 重新下载某个片段
      retry(index) {
        if (this.finishList[index].status === "error") {
          this.finishList[index].status = "";
          this.ajax({
            url: this.tsUrlList[index],
            type: "file",
            success: (file) => {
              this.errorNum--;
              this.dealTS(file, index);
            },
            fail: () => {
              this.finishList[index].status = "error";
            }
          });
        }
      },
      // 重新下载所有错误片段
      retryAll(forceRestart) {
        if (!this.finishList.length || this.isPause) {
          return;
        }
        let firstErrorIndex = this.downloadIndex;
        this.finishList.forEach((item, index) => {
          if (item.status === "error") {
            item.status = "";
            firstErrorIndex = Math.min(firstErrorIndex, index);
          }
        });
        this.errorNum = 0;
        if (this.downloadIndex >= this.rangeDownload.endSegment || forceRestart) {
          this.downloadIndex = firstErrorIndex;
          this.downloadTS();
        } else {
          this.downloadIndex = firstErrorIndex;
        }
      },
      // 下载整合后的TS文件
      downloadFile(fileDataList, fileName, forceSave = false) {
        this.getConf();
        setTimeout(() => {
          document.title = "下载完成 " + this.title;
        }, 1e3);
        if (!this.conf.autoSave && !forceSave) {
          return;
        }
        this.tips = "ts 碎片整合中，请留意浏览器下载";
        let fileBlob = null;
        let a = document.createElement("a");
        if (this.isGetMP4) {
          fileBlob = new Blob(fileDataList, { type: "video/mp4" });
          a.download = fileName + ".mp4";
        } else {
          fileBlob = new Blob(fileDataList, { type: "video/MP2T" });
          a.download = fileName + ".ts";
        }
        a.href = URL.createObjectURL(fileBlob);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          if (this.conf.autoClose) {
            window.opener = null;
            window.open("", "_self", "");
            window.close();
          }
        }, 1e3);
      },
      // 格式化时间
      formatTime(date, formatStr) {
        const formatType = {
          Y: date.getFullYear(),
          M: date.getMonth() + 1,
          D: date.getDate(),
          h: date.getHours(),
          m: date.getMinutes(),
          s: date.getSeconds()
        };
        return formatStr.replace(
          /Y+|M+|D+|h+|m+|s+/g,
          (target) => (new Array(target.length).join("0") + formatType[target[0]]).substr(-target.length)
        );
      },
      // 强制下载现有片段
      forceDownload() {
        if (this.mediaFileList.length) {
          let fileName = this.title || this.formatTime(this.beginTime, "YYYY_MM_DD hh_mm_ss");
          this.downloadFile(this.mediaFileList, fileName, true);
        } else {
          alert("当前无已下载片段");
        }
      },
      // 发生错误，进行提示
      alertError(tips) {
        alert(tips);
        this.downloading = false;
        this.tips = "m3u8 视频在线提取工具";
      },
      getConf() {
        let confStr = localStorage.getItem("porn-plus");
        if (confStr) {
          try {
            this.conf = JSON.parse(confStr);
          } catch (e) {
          }
        }
      }
    }
  };
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-56d4409a"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$2 = { id: "app" };
  const _hoisted_2$2 = { class: "info" };
  const _hoisted_3$2 = { class: "options" };
  const _hoisted_4$2 = { class: "option" };
  const _hoisted_5$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a1" }, "自动下载", -1));
  const _hoisted_6$2 = { class: "option" };
  const _hoisted_7$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a2" }, "下载完成后自动保存", -1));
  const _hoisted_8$2 = { class: "option" };
  const _hoisted_9$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a3" }, "保存后自动关闭", -1));
  const _hoisted_10$2 = {
    key: 0,
    class: "row2"
  };
  const _hoisted_11$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", null, "保存", -1));
  const _hoisted_12$2 = [
    _hoisted_11$2
  ];
  const _hoisted_13$2 = { class: "wrapper" };
  const _hoisted_14$2 = { class: "m-p-input-container" };
  const _hoisted_15$2 = ["value"];
  const _hoisted_16$2 = {
    key: 1,
    class: "disable big-btn"
  };
  const _hoisted_17$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("span", null, "保存", -1));
  const _hoisted_18$2 = [
    _hoisted_17$2
  ];
  const _hoisted_19$1 = { class: "error-btns" };
  const _hoisted_20 = { class: "m-p-tips" };
  const _hoisted_21 = { class: "m-p-segment" };
  const _hoisted_22 = ["title", "onClick"];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("section", _hoisted_1$2, [
      vue.createElementVNode("div", _hoisted_2$2, [
        vue.createElementVNode("div", {
          class: "progress",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.show = !$data.show)
        }, [
          vue.createElementVNode("div", {
            class: "bar",
            style: vue.normalizeStyle({ width: $options.progress + "%" })
          }, null, 4)
        ]),
        vue.createElementVNode("div", _hoisted_3$2, [
          vue.createElementVNode("div", _hoisted_4$2, [
            _hoisted_5$2,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a1",
              type: "checkbox",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.conf.autoDownload = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoDownload]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_6$2, [
            _hoisted_7$2,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a2",
              type: "checkbox",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.conf.autoSave = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoSave]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_8$2, [
            _hoisted_9$2,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a3",
              type: "checkbox",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.conf.autoClose = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoClose]
            ])
          ])
        ])
      ]),
      !$data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$2, [
        $data.finishNum === $data.rangeDownload.targetSegment && $data.rangeDownload.targetSegment > 0 ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "big-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.forceDownload && $options.forceDownload(...args))
        }, _hoisted_12$2)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: "big-btn",
          onClick: _cache[5] || (_cache[5] = ($event) => $data.show = !$data.show)
        }, [
          vue.createElementVNode("span", null, vue.toDisplayString(!$data.show ? "展开" : "收起") + "下载详情", 1)
        ])
      ])) : vue.createCommentVNode("", true),
      vue.withDirectives(vue.createElementVNode("div", _hoisted_13$2, [
        vue.createElementVNode("section", _hoisted_14$2, [
          vue.createElementVNode("input", {
            type: "text",
            value: $props.url,
            disabled: true,
            placeholder: "请输入 m3u8 链接"
          }, null, 8, _hoisted_15$2),
          !$data.downloading ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "big-btn",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.getMP4 && $options.getMP4(...args))
          }, "下载")) : $data.finishNum === $data.rangeDownload.targetSegment && $data.rangeDownload.targetSegment > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16$2, " 下载完成 ")) : (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: "big-btn",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.togglePause && $options.togglePause(...args))
          }, vue.toDisplayString($data.isPause ? "恢复下载" : "暂停下载"), 1)),
          $data.finishNum === $data.rangeDownload.targetSegment && $data.rangeDownload.targetSegment > 0 && !$data.conf.autoSave ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 3,
            class: "big-btn",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.forceDownload && $options.forceDownload(...args))
          }, _hoisted_18$2)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: "big-btn detail",
            onClick: _cache[9] || (_cache[9] = ($event) => $data.show = !$data.show)
          }, [
            vue.createElementVNode("span", null, vue.toDisplayString(!$data.show ? "展开" : "收起") + "下载详情", 1)
          ])
        ]),
        $data.finishList.length > 0 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
          vue.createElementVNode("div", _hoisted_19$1, [
            $data.errorNum && $data.downloadIndex >= $data.rangeDownload.targetSegment ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "m-p-retry",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.retryAll && $options.retryAll(...args))
            }, " 重新下载错误片段 ")) : vue.createCommentVNode("", true),
            $data.mediaFileList.length && !$data.streamWriter ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: "m-p-force",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.forceDownload && $options.forceDownload(...args))
            }, "强制下载现有片段 ")) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("div", _hoisted_20, "待下载碎片总量：" + vue.toDisplayString($data.rangeDownload.targetSegment) + "，已下载：" + vue.toDisplayString($data.finishNum) + "，错误：" + vue.toDisplayString($data.errorNum) + "，进度：" + vue.toDisplayString($options.progress) + "% ", 1),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["m-p-tips", [$data.errorNum ? "error-tips" : ""]])
          }, " 若某视频碎片下载发生错误，将标记为红色，可点击相应图标进行重试 ", 2),
          vue.createElementVNode("section", _hoisted_21, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.finishList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                class: vue.normalizeClass(["item", [item.status]]),
                title: item.title,
                onClick: ($event) => $options.retry(index)
              }, vue.toDisplayString(index + 1), 11, _hoisted_22);
            }), 256))
          ])
        ], 64)) : vue.createCommentVNode("", true)
      ], 512), [
        [vue.vShow, $data.show]
      ])
    ]);
  }
  const Downloader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-56d4409a"]]);
  let videoBlob;
  const _sfc_main$1 = {
    name: "mp4-downloader",
    props: {
      url: "",
      name: ""
    },
    data() {
      return {
        conf: {
          autoDownload: true,
          autoSave: true,
          autoClose: false
        },
        progress: 0,
        show: false,
        tips: "m3u8 视频在线提取工具",
        // 顶部提示
        isPause: false,
        // 是否暂停下载
        isGetMP4: false
        // 是否转码为 MP4 下载
      };
    },
    watch: {
      conf: {
        handler(n, o) {
          localStorage.setItem("porn-plus", JSON.stringify(n));
        },
        deep: true
      },
      progress(n, o) {
        document.title = Number(n).toFixed(0) + "% " + this.name;
      }
    },
    created() {
      console.log("mp4-downloader.vue");
      this.getConf();
      if (this.conf.autoDownload) {
        this.download();
      }
    },
    methods: {
      getConf() {
        let confStr = localStorage.getItem("porn-plus");
        if (confStr) {
          try {
            this.conf = JSON.parse(confStr);
          } catch (e) {
          }
        }
      },
      download() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        xhr.responseType = "blob";
        xhr.onprogress = (event) => {
          this.progress = Number(Number(event.loaded / event.total).toFixed(2)) * 100;
          console.log("进度", this.progress);
        };
        xhr.onload = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            videoBlob = xhr.response;
            this.progress = 100;
            this.getConf();
            if (this.conf.autoSave) {
              this.save();
            }
          }
        };
        xhr.send();
      },
      save() {
        if (!videoBlob)
          return;
        this.getConf();
        let a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(videoBlob);
        a.href = url;
        a.download = this.name + ".mp4";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setTimeout(() => {
          if (this.conf.autoClose) {
            window.opener = null;
            window.open("", "_self", "");
            window.close();
          }
        }, 1e3);
      }
    }
  };
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-429419b2"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "mp4-downloader" };
  const _hoisted_2$1 = { class: "info" };
  const _hoisted_3$1 = { class: "options" };
  const _hoisted_4$1 = { class: "option" };
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a1" }, "自动下载", -1));
  const _hoisted_6$1 = { class: "option" };
  const _hoisted_7$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a2" }, "下载完成后自动保存", -1));
  const _hoisted_8$1 = { class: "option" };
  const _hoisted_9$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("label", { for: "a3" }, "保存后自动关闭", -1));
  const _hoisted_10$1 = {
    key: 0,
    class: "row2"
  };
  const _hoisted_11$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", null, "保存", -1));
  const _hoisted_12$1 = [
    _hoisted_11$1
  ];
  const _hoisted_13$1 = { class: "wrapper" };
  const _hoisted_14$1 = { class: "m-p-input-container" };
  const _hoisted_15$1 = ["value"];
  const _hoisted_16$1 = {
    key: 1,
    class: "disable big-btn"
  };
  const _hoisted_17$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", null, "保存", -1));
  const _hoisted_18$1 = [
    _hoisted_17$1
  ];
  const _hoisted_19 = { class: "m-p-tips" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
      vue.createElementVNode("div", _hoisted_2$1, [
        vue.createElementVNode("div", {
          class: "progress",
          onClick: _cache[0] || (_cache[0] = ($event) => $data.show = !$data.show)
        }, [
          vue.createElementVNode("div", {
            class: "bar",
            style: vue.normalizeStyle({ width: $data.progress + "%" })
          }, null, 4)
        ]),
        vue.createElementVNode("div", _hoisted_3$1, [
          vue.createElementVNode("div", _hoisted_4$1, [
            _hoisted_5$1,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a1",
              type: "checkbox",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.conf.autoDownload = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoDownload]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_6$1, [
            _hoisted_7$1,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a2",
              type: "checkbox",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.conf.autoSave = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoSave]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_8$1, [
            _hoisted_9$1,
            vue.withDirectives(vue.createElementVNode("input", {
              id: "a3",
              type: "checkbox",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.conf.autoClose = $event)
            }, null, 512), [
              [vue.vModelCheckbox, $data.conf.autoClose]
            ])
          ])
        ])
      ]),
      !$data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$1, [
        vue.createElementVNode("div", {
          class: "big-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.save && $options.save(...args))
        }, _hoisted_12$1),
        vue.createElementVNode("div", {
          class: "big-btn",
          onClick: _cache[5] || (_cache[5] = ($event) => $data.show = !$data.show)
        }, [
          vue.createElementVNode("span", null, vue.toDisplayString(!$data.show ? "展开" : "收起") + "下载详情", 1)
        ])
      ])) : vue.createCommentVNode("", true),
      vue.withDirectives(vue.createElementVNode("div", _hoisted_13$1, [
        vue.createElementVNode("section", _hoisted_14$1, [
          vue.createElementVNode("input", {
            type: "text",
            value: $props.url,
            disabled: true,
            placeholder: "请输入 链接"
          }, null, 8, _hoisted_15$1),
          $data.progress === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "big-btn",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.download && $options.download(...args))
          }, "下载")) : $data.progress === 100 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16$1, " 下载完成 ")) : vue.createCommentVNode("", true),
          $data.progress === 100 ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: "big-btn",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.save && $options.save(...args))
          }, _hoisted_18$1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: "big-btn detail",
            onClick: _cache[8] || (_cache[8] = ($event) => $data.show = !$data.show)
          }, [
            vue.createElementVNode("span", null, vue.toDisplayString(!$data.show ? "展开" : "收起") + "下载详情", 1)
          ])
        ]),
        vue.createElementVNode("div", _hoisted_19, "进度：" + vue.toDisplayString($data.progress) + "%", 1)
      ], 512), [
        [vue.vShow, $data.show]
      ])
    ]);
  }
  const Mp4Downloader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-429419b2"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-a069d05a"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "content" };
  const _hoisted_2 = { class: "left" };
  const _hoisted_3 = { class: "big-title" };
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M9 18V42H39V18L24 6L9 18Z",
    fill: "none",
    stroke: "#ffffff",
    "stroke-width": "4",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M19 29V42H29V29H19Z",
    fill: "none",
    stroke: "#ffffff",
    "stroke-width": "4",
    "stroke-linejoin": "round"
  }, null, -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M9 42H39",
    stroke: "#ffffff",
    "stroke-width": "4",
    "stroke-linecap": "round"
  }, null, -1));
  const _hoisted_7 = [
    _hoisted_4,
    _hoisted_5,
    _hoisted_6
  ];
  const _hoisted_8 = { class: "comments" };
  const _hoisted_9 = { class: "item" };
  const _hoisted_10 = { class: "title" };
  const _hoisted_11 = {
    key: 0,
    class: "quote"
  };
  const _hoisted_12 = { class: "replay" };
  const _hoisted_13 = { class: "video" };
  const _hoisted_14 = { class: "title" };
  const _hoisted_15 = {
    class: "author",
    target: "_blank"
  };
  const _hoisted_16 = ["href"];
  const _hoisted_17 = { class: "right" };
  const _hoisted_18 = { class: "big-title" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const dpRef = vue.ref(null);
      const dp = vue.ref(null);
      const recommendRef = vue.ref(null);
      const data = vue.reactive({
        comments: [],
        info: window.info,
        show: true
      });
      vue.watch(() => data.show, (n, o) => {
        var _a;
        if (n) {
          pauseOriginVideo();
          document.body.style.overflow = "hidden";
        } else {
          (_a = dp.value) == null ? void 0 : _a.pause();
          document.body.style.overflow = "unset";
        }
      }, { immediate: true });
      vue.onMounted(() => {
        recommendRef.value.append($("h3").next().next()[0]);
        $("br").remove();
        initComments();
        initVideo();
        checkOriginVideoIsPlay();
      });
      function pauseOriginVideo() {
        if ($(".vjs-playing").length) {
          $("#player_one_html5_api").click();
        }
      }
      function checkOriginVideoIsPlay() {
        setInterval(() => {
          if (data.show) {
            pauseOriginVideo();
          }
        }, 3e3);
      }
      function initComments() {
        $.ajax({
          url: `${location.origin}/show_comments2.php?VID=${data.info.video.vid}&start=1&comment_per_page=30`,
          success(r) {
            let h = $(r);
            h.each(function() {
              if (this.tagName === "TABLE") {
                let name = $(this).find("a:first").remove().text().trim();
                let time = $(this).find(".comment-info").contents()[4];
                let body = $(this).find(".comment-body");
                let quote = body.find(".comment_quote").text().replaceAll(" ", "").replaceAll("\n", "");
                body.find(".comment_quote").remove();
                let replay = body.find("a").remove().end().text().trim();
                if (replay.includes("请不要发广告或与视频无关的评论") || quote.includes("请不要发广告或与视频无关的评论"))
                  ;
                else {
                  data.comments.push({
                    name,
                    time: $(time).text(),
                    quote,
                    replay
                  });
                }
              }
            });
          }
        });
      }
      function initVideo() {
        if (!dpRef.value)
          return;
        let config = {
          url: data.info.video.url,
          type: data.info.video.type
        };
        if (config.type === "customHls") {
          config.customType = {
            customHls: function(video, player) {
              const hls = new _monkeyWindow.Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            }
          };
        }
        dp.value = new _monkeyWindow.DPlayer({
          container: dpRef.value,
          autoplay: true,
          video: config
        });
        dp.value.seek(10);
      }
      function goHome() {
        location.href = "https://91porn.com/index.php";
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.withDirectives(vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("div", _hoisted_3, [
                vue.createTextVNode(" 评论 "),
                (vue.openBlock(), vue.createElementBlock("svg", {
                  onClick: goHome,
                  class: "home-icon",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 48 48",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, _hoisted_7))
              ]),
              vue.createElementVNode("div", _hoisted_8, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(data.comments, (item) => {
                  return vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
                    vue.createElementVNode("div", _hoisted_10, [
                      vue.createElementVNode("span", null, vue.toDisplayString(item.name), 1),
                      vue.createElementVNode("span", null, vue.toDisplayString(item.time), 1)
                    ]),
                    item.quote ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, vue.toDisplayString(item.quote), 1)) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_12, vue.toDisplayString(item.replay), 1)
                  ]);
                }), 256))
              ])
            ]),
            vue.createElementVNode("div", _hoisted_13, [
              vue.createElementVNode("div", {
                id: "dplayer",
                ref_key: "dpRef",
                ref: dpRef,
                style: { "height": "70vh" }
              }, null, 512),
              vue.createElementVNode("div", _hoisted_14, vue.toDisplayString(data.info.video.name), 1),
              vue.createElementVNode("div", _hoisted_15, " 添加时间： " + vue.toDisplayString(data.info.video.date), 1),
              data.info.author.name ? (vue.openBlock(), vue.createElementBlock("a", {
                key: 0,
                href: data.info.author.url,
                class: "author",
                target: "_blank"
              }, " 作者： " + vue.toDisplayString(data.info.author.name), 9, _hoisted_16)) : vue.createCommentVNode("", true),
              data.info.video.type === "auto" ? (vue.openBlock(), vue.createBlock(Mp4Downloader, {
                key: 1,
                name: data.info.video.name,
                url: data.info.video.url
              }, null, 8, ["name", "url"])) : (vue.openBlock(), vue.createBlock(Downloader, {
                key: 2,
                title: data.info.video.name,
                url: data.info.video.url
              }, null, 8, ["title", "url"]))
            ]),
            vue.createElementVNode("div", _hoisted_17, [
              vue.createElementVNode("div", _hoisted_18, [
                vue.createTextVNode(" 本月热播 "),
                vue.createElementVNode("div", {
                  class: "close",
                  onClick: _cache[0] || (_cache[0] = ($event) => data.show = !data.show)
                })
              ]),
              vue.createElementVNode("div", {
                class: "list",
                ref_key: "recommendRef",
                ref: recommendRef
              }, null, 512)
            ])
          ], 512), [
            [vue.vShow, data.show]
          ]),
          vue.withDirectives(vue.createElementVNode("div", {
            class: "showBtn",
            onClick: _cache[1] || (_cache[1] = ($event) => data.show = !data.show)
          }, "展开脚本", 512), [
            [vue.vShow, !data.show]
          ])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a069d05a"]]);
  window.info = {
    author: {
      name: "",
      url: "",
      vid: ""
    },
    video: {
      name: "",
      url: "",
      vid: ""
    }
    // videoUrl:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  };
  function init() {
    if (window.info.videoUrl)
      return;
    const videoWrapper = $("#player_one_html5_api");
    const userWrapper = $(".title-yakov");
    if ((userWrapper == null ? void 0 : userWrapper.length) === 2) {
      let href = userWrapper[1].firstElementChild.href;
      let start = href.indexOf("UID");
      let uid = href.substring(start + 4);
      window.info.author = {
        name: userWrapper.find(".title").text(),
        url: `https://91porn.com/uvideos.php?UID=${uid}&type=public`,
        uid
      };
    }
    if (!videoWrapper[0]) {
      return;
    } else {
      window.info.video = {
        name: document.title.replace("Chinese homemade video", ""),
        url: videoWrapper.find("source")[0].src,
        vid: $("#favorite #VID").text(),
        date: $(".title-yakov")[0].innerText
      };
      if (window.info.video.url.toLowerCase().indexOf("m3u8") === -1) {
        window.info.video.type = "auto";
      } else {
        window.info.video.type = "customHls";
      }
      vue.createApp(App).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    }
    console.log(window.info);
  }
  try {
    let style2 = `
  .ad_img{display:none;}
  `;
    let addStyle2 = document.createElement("style");
    addStyle2.rel = "stylesheet";
    addStyle2.type = "text/css";
    addStyle2.innerHTML = style2;
    window.document.head.append(addStyle2);
    $("iframe").hide();
    let l = window.location;
    if (l.pathname === "/index.php") {
    } else if (l.pathname === "/view_video.php") {
      init();
    }
  } catch (e) {
    console.log("init报错了", e);
  }

})(Vue);
