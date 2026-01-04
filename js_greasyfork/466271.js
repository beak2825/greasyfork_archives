// ==UserScript==
// @name         含羞草破解播放 vip、收费免费观看 fi11.tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  含羞草破解播放 vip、收费免费观看 fi11.tv 免费下载视频
// @author       zxyty
// @match        *://*/videoContent/*
// @match        *://*/play/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zogps.com
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466271/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%B4%E8%A7%A3%E6%92%AD%E6%94%BE%20vip%E3%80%81%E6%94%B6%E8%B4%B9%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%20fi11tv.user.js
// @updateURL https://update.greasyfork.org/scripts/466271/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%B4%E8%A7%A3%E6%92%AD%E6%94%BE%20vip%E3%80%81%E6%94%B6%E8%B4%B9%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%20fi11tv.meta.js
// ==/UserScript==

(async function (exports = {}) {
  const { VITE_APP_AES_KEY: fn, VITE_APP_AES_IV: gn } = {
    VITE_NODE_ENV: "production",
    VITE_APP_ROUTER_NAME: "false",
    VITE_APP_API_BASE_URL: "/api",
    VITE_APP_THEME: "dark",
    VITE_APP_LOG: "false",
    VITE_PORT: "8080",
    VITE_BASE_URL: "/api",
    VITE_OUTPUT_DIR: ".dist",
    VITE_APP_NAME: "fission-friends-pc",
    VITE_APP_WEB_SOCKET_URL: "127.0.0.1",
    VITE_APP_IMGKEY: "46cc793c53dc451b",
    VITE_APP_AES_PASSWORD_KEY: "0123456789123456",
    VITE_APP_AES_PASSWORD_IV: "0123456789123456",
    VITE_APP_AES_KEY: "B77A9FF7F323B5404902102257503C2F",
    VITE_APP_AES_IV: "B77A9FF7F323B5404902102257503C2F",
    BASE_URL: "https://js10.pmeaqve.cn/pc/",
    MODE: "production",
    DEV: !1,
    PROD: !0,
  };

  function encodeRequestData(data) {
    const t = new Date();
    return JSON.stringify({
      endata: encode(JSON.stringify(data || {})),
      ents: encode(parseInt(t.getTime() / 1000) + 60 * t.getTimezoneOffset()),
    });
  }

  function encode(e, { key: n, iv: t } = {}) {
    // 使用cryptojs aes加密
    var a = CryptoJS.enc.Utf8.parse(e),
      i = CryptoJS.AES.encrypt(a, CryptoJS.enc.Utf8.parse(n || fn), {
        iv: CryptoJS.enc.Utf8.parse(t || gn),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    return CryptoJS.enc.Base64.stringify(i.ciphertext);
  }

  function removePadding(buffer) {
    const outputBytes = buffer.byteLength;
    const paddingBytes =
      outputBytes && new DataView(buffer).getUint8(outputBytes - 1);
    if (paddingBytes) {
      return buffer.slice(0, outputBytes - paddingBytes);
    } else {
      return buffer;
    }
  }

  function AESDecryptor() {
    return {
      constructor() {
        this.rcon = [
          0x0, 0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
        ];
        this.subMix = [
          new Uint32Array(256),
          new Uint32Array(256),
          new Uint32Array(256),
          new Uint32Array(256),
        ];
        this.invSubMix = [
          new Uint32Array(256),
          new Uint32Array(256),
          new Uint32Array(256),
          new Uint32Array(256),
        ];
        this.sBox = new Uint32Array(256);
        this.invSBox = new Uint32Array(256);

        // Changes during runtime
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
            d[i] = (i << 1) ^ 0x11b;
          }
        }

        for (i = 0; i < 256; i++) {
          let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
          sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
          sBox[x] = sx;
          invSBox[sx] = x;

          // Compute multiplication
          let x2 = d[x];
          let x4 = d[x2];
          let x8 = d[x4];

          // Compute sub/invSub bytes, mix columns tables
          let t = (d[sx] * 0x101) ^ (sx * 0x1010100);
          subMix0[x] = (t << 24) | (t >>> 8);
          subMix1[x] = (t << 16) | (t >>> 16);
          subMix2[x] = (t << 8) | (t >>> 24);
          subMix3[x] = t;

          // Compute inv sub bytes, inv mix columns tables
          t =
            (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
          invSubMix0[sx] = (t << 24) | (t >>> 8);
          invSubMix1[sx] = (t << 16) | (t >>> 16);
          invSubMix2[sx] = (t << 8) | (t >>> 24);
          invSubMix3[sx] = t;

          // Compute next counter
          if (!x) {
            x = xi = 1;
          } else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
          }
        }
      },

      expandKey(keyBuffer) {
        // convert keyBuffer to Uint32Array
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
        let keySize = (this.keySize = key.length);

        if (keySize !== 4 && keySize !== 6 && keySize !== 8) {
          throw new Error("Invalid aes key size=" + keySize);
        }

        let ksRows = (this.ksRows = (keySize + 6 + 1) * 4);
        let ksRow;
        let invKsRow;

        let keySchedule = (this.keySchedule = new Uint32Array(ksRows));
        let invKeySchedule = (this.invKeySchedule = new Uint32Array(ksRows));
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
            // Rot word
            t = (t << 8) | (t >>> 24);

            // Sub word
            t =
              (sbox[t >>> 24] << 24) |
              (sbox[(t >>> 16) & 0xff] << 16) |
              (sbox[(t >>> 8) & 0xff] << 8) |
              sbox[t & 0xff];

            // Mix Rcon
            t ^= rcon[(ksRow / keySize) | 0] << 24;
          } else if (keySize > 6 && ksRow % keySize === 4) {
            // Sub word
            t =
              (sbox[t >>> 24] << 24) |
              (sbox[(t >>> 16) & 0xff] << 16) |
              (sbox[(t >>> 8) & 0xff] << 8) |
              sbox[t & 0xff];
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
            invKeySchedule[invKsRow] =
              invSubMix0[sbox[t >>> 24]] ^
              invSubMix1[sbox[(t >>> 16) & 0xff]] ^
              invSubMix2[sbox[(t >>> 8) & 0xff]] ^
              invSubMix3[sbox[t & 0xff]];
          }

          invKeySchedule[invKsRow] = invKeySchedule[invKsRow] >>> 0;
        }
      },

      // Adding this as a method greatly improves performance.
      networkToHostOrderSwap(word) {
        return (
          (word << 24) |
          ((word & 0xff00) << 8) |
          ((word & 0xff0000) >> 8) |
          (word >>> 24)
        );
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

          // Iterate through the rounds of decryption
          for (i = 1; i < nRounds; i++) {
            t0 =
              invSubMix0[s0 >>> 24] ^
              invSubMix1[(s1 >> 16) & 0xff] ^
              invSubMix2[(s2 >> 8) & 0xff] ^
              invSubMix3[s3 & 0xff] ^
              invKeySchedule[ksRow];
            t1 =
              invSubMix0[s1 >>> 24] ^
              invSubMix1[(s2 >> 16) & 0xff] ^
              invSubMix2[(s3 >> 8) & 0xff] ^
              invSubMix3[s0 & 0xff] ^
              invKeySchedule[ksRow + 1];
            t2 =
              invSubMix0[s2 >>> 24] ^
              invSubMix1[(s3 >> 16) & 0xff] ^
              invSubMix2[(s0 >> 8) & 0xff] ^
              invSubMix3[s1 & 0xff] ^
              invKeySchedule[ksRow + 2];
            t3 =
              invSubMix0[s3 >>> 24] ^
              invSubMix1[(s0 >> 16) & 0xff] ^
              invSubMix2[(s1 >> 8) & 0xff] ^
              invSubMix3[s2 & 0xff] ^
              invKeySchedule[ksRow + 3];
            // Update state
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;

            ksRow = ksRow + 4;
          }

          // Shift rows, sub bytes, add round key
          t0 =
            (invSBOX[s0 >>> 24] << 24) ^
            (invSBOX[(s1 >> 16) & 0xff] << 16) ^
            (invSBOX[(s2 >> 8) & 0xff] << 8) ^
            invSBOX[s3 & 0xff] ^
            invKeySchedule[ksRow];
          t1 =
            (invSBOX[s1 >>> 24] << 24) ^
            (invSBOX[(s2 >> 16) & 0xff] << 16) ^
            (invSBOX[(s3 >> 8) & 0xff] << 8) ^
            invSBOX[s0 & 0xff] ^
            invKeySchedule[ksRow + 1];
          t2 =
            (invSBOX[s2 >>> 24] << 24) ^
            (invSBOX[(s3 >> 16) & 0xff] << 16) ^
            (invSBOX[(s0 >> 8) & 0xff] << 8) ^
            invSBOX[s1 & 0xff] ^
            invKeySchedule[ksRow + 2];
          t3 =
            (invSBOX[s3 >>> 24] << 24) ^
            (invSBOX[(s0 >> 16) & 0xff] << 16) ^
            (invSBOX[(s1 >> 8) & 0xff] << 8) ^
            invSBOX[s2 & 0xff] ^
            invKeySchedule[ksRow + 3];
          ksRow = ksRow + 3;

          // Write
          outputInt32[offset] = swapWord(t0 ^ initVector0);
          outputInt32[offset + 1] = swapWord(t3 ^ initVector1);
          outputInt32[offset + 2] = swapWord(t2 ^ initVector2);
          outputInt32[offset + 3] = swapWord(t1 ^ initVector3);

          // reset initVector to last 4 unsigned int
          initVector0 = inputWords0;
          initVector1 = inputWords1;
          initVector2 = inputWords2;
          initVector3 = inputWords3;

          offset = offset + 4;
        }

        return removePKCS7Padding
          ? removePadding(outputInt32.buffer)
          : outputInt32.buffer;
      },

      destroy() {
        this.key = undefined;
        this.keySize = undefined;
        this.ksRows = undefined;

        this.sBox = undefined;
        this.invSBox = undefined;
        this.subMix = undefined;
        this.invSubMix = undefined;
        this.keySchedule = undefined;
        this.invKeySchedule = undefined;

        this.rcon = undefined;
      },
    };
  }

  function stringToBuffer(str) {
    return new TextEncoder().encode(str);
  }

  const apiHost = window.origin; // `https://www.16855888.top`;

  const APIS = {
    login: apiHost + "/api/login/userLogin",
    videoType: apiHost + "/api/album/getAlbumList",
    videoList: apiHost + "/api/album/getAlbumVideoList",
    actorVedioList: apiHost + "/api/actor/getActorVideoList",
    previewVideo: apiHost + "/api/videos/getPreUrl",
  };

  const fileDownload = async (url) => {
    const fileBlob = await fetch(url).then((res) => res.arrayBuffer());
    return fileBlob;
  };

  // ts 片段的 AES 解码
  const aesDecrypt = (blobData, index, aesConf) => {
    const iv =
      aesConf.iv ||
      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index]);
    return aesConf.decryptor.decrypt(blobData, 0, iv.buffer || iv, true);
  };

  async function getM3u8TsUrlArr(m3u8Url, hostName = "") {
    return new Promise((resolve) => {
      fetch(m3u8Url, { method: "GET" })
        .then((res) => res.text())
        .then(async (response) => {
          const urlArrs = response
            .split("\n")
            .filter((d) => d && !d.startsWith("#EXT"));

          if (urlArrs?.length === 1 && urlArrs[0].indexOf(".m3u8") > 0) {
            // 说明是m3u8地址内嵌m3u8地址
            const result = await getM3u8TsUrlArr(
              `${hostName}${urlArrs[0]}`,
              hostName
            );
            resolve(result);
          } else {
            const aseConfig = await getAESDecodeConfig(response, hostName);
            resolve({ tsArr: urlArrs, m3u8Url, aseConfig });
          }
        });
    });
  }

  async function getAESDecodeConfig(m3u8Str, hostName) {
    // 检测视频 AES 加密
    if (m3u8Str.indexOf("#EXT-X-KEY") > -1) {
      const aseConfig = {};
      aseConfig.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || [
        "",
        "",
        "",
      ])[2];
      aseConfig.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ["", "", ""])[2];
      aseConfig.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ["", "", ""])[2];
      aseConfig.iv = aseConfig.iv ? stringToBuffer(aseConfig.iv) : "";
      aseConfig.uri = (() => {
        if (aseConfig.uri.startsWith("/")) {
          return `${hostName}${aseConfig.uri}`;
        }
        return aseConfig.uri;
      })();

      const aseKeyResult = await fetch(aseConfig.uri).then((res) =>
        res.arrayBuffer()
      );
      aseConfig.key = aseKeyResult;
      aseConfig.decryptor = new AESDecryptor();
      aseConfig.decryptor.constructor();
      aseConfig.decryptor.expandKey(aseConfig.key);
      return aseConfig;
    }
    return null;
  }

  const STATE = {
    token: "",
    userId: "",
  };

  const SERVICES = {
    user_login: async () => {
      if (STATE.token) {
        return STATE;
      }

      const loginResult = await fetch(APIS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: encodeRequestData({
          user_login: "xxxxx",
          user_pass: "xxxxx",
        }),
      }).then((res) => res.json());

      // save user info
      const { id: userId, token } = loginResult.data;

      STATE.userId = userId;
      STATE.token = token;

      return STATE;
    },
    get_video_type: async () => {
      const videoTypeResult = await fetch(APIS.videoType, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: encodeRequestData({
          length: 999,
          page: 1,
        }),
      }).then((res) => res.json());

      return videoTypeResult.data.list;
    },
    download_m3u8: async (m3u8Src, outfileName) => {
      const { tsArr, aseConfig } = await getM3u8TsUrlArr(m3u8Src);

      // const download_process = tsArr.map((d, i) => {
      //     return fileDownload(d).then(data => {
      //         if (aseConfig) {
      //             return aesDecrypt(data, i, aseConfig);
      //         }
      //         return data;
      //     });
      //     // then(arrayBuffer => {
      //     //     return new Blob([arrayBuffer]);
      //     // });
      // });

      // 下载结果全部存在此内存变量里
      const fileDataList = new Array(tsArr.length).fill(0);

      let downloadProcessDom = document.querySelector("#m3u8_download_process");
      if (!downloadProcessDom) {
        downloadProcessDom = document.createElement("div");
        downloadProcessDom.id = "m3u8_download_process";
        document.body.appendChild(downloadProcessDom);
      } else {
        downloadProcessDom.classList.remove("hide");
      }
      const innerHtml = tsArr
        .map((d, i) => {
          return `<div class="download_item">${i + 1}</div>`;
        })
        .join("");
      downloadProcessDom.innerHTML = innerHtml;

      const downloadItems =
        downloadProcessDom.querySelectorAll(".download_item");

      const downloadIndexTs = (index) => () => {
        return fileDownload(tsArr[index]).then((data) => {
          let validData = data;
          if (aseConfig) {
            validData = aesDecrypt(data, index, aseConfig);
          }
          fileDataList[index] = validData;
          const item =
            downloadProcessDom.querySelectorAll(".download_item")[index];
          item.classList.add("success");
          return validData;
        });
      };

      try {
        const MAX_REQUEST_SIZE = 6;
        let requestQueue = [];
        for (let i = 0; i < downloadItems.length; i++) {
          const item = downloadItems[i];
          item.title = "click to download again.";
          item.onclick = downloadIndexTs(i);
          requestQueue.push(item.onclick);
          if (requestQueue.length >= MAX_REQUEST_SIZE) {
            await Promise.all(requestQueue.map((func) => func()));
            requestQueue = [];
          }
        }
        await Promise.all(requestQueue.map((func) => func()));
      } catch (error) {}

      // if (fileDataList.every(d => !!d)) {
      // 说明所有的数据已经下载完毕
      // 这里不做判断 允许下载拼接所有当前下载完成的buffer
      const downloadAllBtn = document.createElement("div");
      downloadAllBtn.innerHTML = "Download";
      downloadAllBtn.classList.add("download_btn");
      downloadAllBtn.onclick = () => {
        const fileBlob = new Blob(
          fileDataList.filter((d) => !!d),
          { type: "video/MP2T" }
        ); // 创建一个Blob对象，并设置文件的 MIME 类型
        const a = document.createElement("a");
        a.download = outfileName || `download.ts`;
        a.href = URL.createObjectURL(fileBlob);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        downloadProcessDom.classList.add("hide");
      };
      downloadProcessDom.appendChild(downloadAllBtn);
    },
    fetch_m3u8Url: async (videoId) => {
      const m3u8UrlResult = await fetch(APIS.previewVideo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Auth: STATE.token,
        },
        body: encodeRequestData({
          videoId: videoId,
        }),
      }).then((res) => res.json());

      const {
        data: { url },
        code,
      } = m3u8UrlResult;

      if (code === 2010) {
        throw new Error("非vip视频");
      }

      // https://ts.pmeaqve.cn/20230217/7kd7zbuF/index.m3u8?start1=1&end=10&sign=204401fc9a2cd377d7019156e8066bb5b1ee3c9073658c383b28a70f95a22f30e68dd77cdf83da9be5290c1ae3e20ce5
      // 返回的query里有start和end参数需要去掉拿到整个片段
      if (!url) {
        // 如果url不存在
        // 有可能是没有登录
        await SERVICES.user_login();
        return await SERVICES.fetch_m3u8Url(videoId);
      }
      const [m3u8Url, query] = url.split("?");
      const fullUrl = `${m3u8Url}?sign=${query.split("&sign=")[1]}`;
      return fullUrl;
    },
    download_video: async (videoId, outfileName) => {
      const fullUrl = await SERVICES.fetch_m3u8Url(videoId);

      if (!fullUrl) {
        // 如果url不存在
        // 有可能是没有登录
        await SERVICES.user_login();
        return await SERVICES.download_video(videoId, outfileName);
      }

      const { origin: hostName } = new URL(fullUrl);
      const { tsArr, aseConfig } = await getM3u8TsUrlArr(fullUrl, hostName);

      // const download_process = tsArr.map((d, i) => {
      //     return fileDownload(d).then(data => {
      //         if (aseConfig) {
      //             return aesDecrypt(data, i, aseConfig);
      //         }
      //         return data;
      //     });
      //     // then(arrayBuffer => {
      //     //     return new Blob([arrayBuffer]);
      //     // });
      // });

      // 下载结果全部存在此内存变量里
      const fileDataList = new Array(tsArr.length).fill(0);

      let downloadProcessDom = document.querySelector("#m3u8_download_process");
      if (!downloadProcessDom) {
        downloadProcessDom = document.createElement("div");
        downloadProcessDom.id = "m3u8_download_process";
        document.body.appendChild(downloadProcessDom);
      } else {
        downloadProcessDom.classList.remove("hide");
      }
      const innerHtml = tsArr
        .map((d, i) => {
          return `<div class="download_item">${i + 1}</div>`;
        })
        .join("");
      downloadProcessDom.innerHTML = innerHtml;

      const downloadItems =
        downloadProcessDom.querySelectorAll(".download_item");

      const downloadIndexTs = (index) => () => {
        return fileDownload(tsArr[index]).then((data) => {
          let validData = data;
          if (aseConfig) {
            validData = aesDecrypt(data, index, aseConfig);
          }
          fileDataList[index] = validData;
          const item =
            downloadProcessDom.querySelectorAll(".download_item")[index];
          item.classList.add("success");
          return validData;
        });
      };

      try {
        const MAX_REQUEST_SIZE = 6;
        let requestQueue = [];
        for (let i = 0; i < downloadItems.length; i++) {
          const item = downloadItems[i];
          item.title = "click to download again.";
          item.onclick = downloadIndexTs(i);
          requestQueue.push(item.onclick);
          if (requestQueue.length >= MAX_REQUEST_SIZE) {
            await Promise.all(requestQueue.map((func) => func()));
            requestQueue = [];
          }
        }
        await Promise.all(requestQueue.map((func) => func()));
      } catch (error) {}

      // if (fileDataList.every(d => !!d)) {
      // 说明所有的数据已经下载完毕
      // 这里不做判断 允许下载拼接所有当前下载完成的buffer
      const downloadAllBtn = document.createElement("div");
      downloadAllBtn.innerHTML = "Download";
      downloadAllBtn.classList.add("download_btn");
      downloadAllBtn.onclick = () => {
        const fileBlob = new Blob(
          fileDataList.filter((d) => !!d),
          { type: "video/MP2T" }
        ); // 创建一个Blob对象，并设置文件的 MIME 类型
        const a = document.createElement("a");
        a.download = outfileName || `download.ts`;
        a.href = URL.createObjectURL(fileBlob);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        downloadProcessDom.classList.add("hide");
      };
      downloadProcessDom.appendChild(downloadAllBtn);
      // }
    },
  };

  exports.downHelper = SERVICES;

  // auto inject the download btn;
  const cssInject = `
        #m3u8_download_process {
            display: flex;
            flex-wrap: wrap;
            position: fixed;
            right: 0;
            top: 0;
            width: 460px;
            height: 300px;
            overflow: auto;
            padding: 8px;
            background: #fff;
            box-shadow: 0px 0px 4px #164375;
            z-index: 999999;
        }
        #m3u8_download_process.hide {
            display: none;
        }
        #m3u8_download_process .download_item {
            padding: 4px;
            border-radius: 2px;
            width: 38px;
            justify-content: center;
            background-color: #666;
            margin: 8px;
            color: #fff;
            cursor: pointer;
        }
        #m3u8_download_process .download_item.success {
            background-color: green;
            color: #fff;
        }
        #m3u8_download_process .download_btn {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            border-radius: 4px;
            background: green;
            color: red;
            cursor: pointer;
        }
        ._relative {
          // position: relative !important;
        }
        ._relative:hover ._down_btn{
            display: block;
        }
        ._relative:hover ._play_btn{
            display: block;
        }
        ._down_btn {
            display: none;
            position: absolute !important;
            right: 4px;
            top: 4px;
            padding: 4px;
            border-radius: 4px;
            background: #ccc;
            color: red;
            z-index: 999;
            cursor: pointer;
        }
        ._play_btn {
            display: none;
            position: absolute !important;
            left: 4px;
            top: 4px;
            padding: 4px;
            border-radius: 4px;
            background: #ccc;
            color: red;
            z-index: 999;
            cursor: pointer;
        }
    `;

  if (!document.querySelector("#styleDom")) {
    const styleDom = document.createElement("style");
    styleDom.id = "inject_css";
    styleDom.innerHTML = cssInject;
    document.head.appendChild(styleDom);
  }

  if (document.domain !== apiHost.split("//")[1]) {
    return;
  }

  const [_, pageName, pageType, videoId] = window.location.pathname.split("/");
  // https://www.fi11sm245.com/play/video/30827
  // ['', 'play', 'video', '30827']
  if (!/^[\d]+?$/i.test(videoId) || pageName !== "play") {
    // 没在播放界面
    return;
  }

  const createDownloadBtn = () => {
    // const vi = document.querySelector("#videoContent");
    const vi = document.querySelector(".vip-mask");
    if (!vi) {
      return;
    }

    if (vi.querySelector("._down_btn")) {
      return;
    }

    let titleDom = document.querySelector(".article-title");
    if (!titleDom || !titleDom.innerText) {
      return;
    }
    const title = titleDom.innerText;

    clearInterval(timer);
    vi.classList.remove("_relative");
    vi.classList.add("_relative");

    // download btn
    const newBtn = document.createElement("div");
    newBtn.onclick = (e) => {
      e.stopPropagation();
      SERVICES.download_video(Number(videoId), title + ".ts");
    };
    newBtn.innerHTML = "Download";
    newBtn.classList.add("_down_btn");
    vi.appendChild(newBtn);

    // play btn
    const playBtn = document.createElement("div");
    playBtn.innerHTML = "Go to play url";
    playBtn.classList.add("_play_btn");
    playBtn.onclick = (e) => {
      e.stopPropagation();
      SERVICES.fetch_m3u8Url(Number(videoId)).then((url) => {
        window.open(`https://www.zxyty.com/m3u8-play?link=${url}`);
      });
    };
    vi.appendChild(playBtn);
  };

  let timer = setInterval(createDownloadBtn, 4000);
})(window);
