// ==UserScript==
// @name         B站直播工具
// @namespace    https://github.com/EY2318/
// @version      0.4
// @description  B站直播辅助工具, 支持登录、开始直播、结束直播和更新直播信息
// @author       LynLuc
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.bilibili.com
// @connect      api.live.bilibili.com
// @connect      passport.bilibili.com
// @license      MIT
// @history      0.4 fix Room/update
// @history      0.3 新增人脸认证状态检查
// @history      0.2 修复开播API签名验证错误
// @history      0.1 初始版本
// @downloadURL https://update.greasyfork.org/scripts/542453/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542453/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 基础配置
  const config = {
    version: [0, 3, 0],
    userAgent:
      "LiveHime/7.35.0.9971 os/Windows pc_app/livehime build/9971 osVer/10.0_x86_64",
    APP_KEY: "aae92bc66f3edfab",
    APP_SECRET: "af125a0d5279fd576c1b4418a3e8276d",
    LIVEHIME_BUILD: "9971",
    LIVEHIME_VERSION: "7.35.0.9971",
    // 签名配置
    START_LIVE_AUTH_CSRF: true,
    STOP_LIVE_AUTH_CSRF: true,
    // 推流协议偏好设置
    // RTMP: 使用RTMP协议
    // SRT_FALLBACK_RTMP: 优先使用SRT协议，失败时回退到RTMP
    // SRT_ONLY: 仅使用SRT协议
    PROTOCOL_PREFERENCE: "RTMP",
    // API端点配置
    API: {
      START_LIVE: "https://api.live.bilibili.com/room/v1/Room/startLive",
      STOP_LIVE: "https://api.live.bilibili.com/room/v1/Room/stopLive",
      UPDATE_LIVE_INFO: "https://api.live.bilibili.com/room/v1/Room/update",
      GET_ROOM_INFO: "https://api.live.bilibili.com/room/v1/Room/getRoomInfo",
      GET_AREA_LIST: "https://api.live.bilibili.com/room/v1/Area/getList",
      CHECK_FACE_AUTH:
        "https://api.live.bilibili.com/xlive/app-blink/v1/preLive/IsUserIdentifiedByFaceAuth",
    },
  };

  // 存储数据
  const data = {
    userId: -1,
    roomId: -1,
    areaId: -1,
    parentAreaId: -1,
    title: "",
    liveStatus: -1,
    roomData: {},
    rtmpAddr: "",
    rtmpCode: "",
    srtAddr: "",
    srtCode: "",
    currentProtocol: "RTMP",
    cookies: {},
    csrf: "",
    areaList: {},
  };

  // B站直播API签名相关函数
  // MD5哈希函数 - 使用纯JavaScript实现
  function md5(str) {
    function rotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX, lY) {
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    }

    function F(x, y, z) {
      return (x & y) | (~x & z);
    }
    function G(x, y, z) {
      return (x & z) | (y & ~z);
    }
    function H(x, y, z) {
      return x ^ y ^ z;
    }
    function I(x, y, z) {
      return y ^ (x | ~z);
    }

    function FF(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str) {
      let lWordCount;
      const lMessageLength = str.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 =
        (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] |
          (str.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }

    function wordToHex(lValue) {
      let wordToHexValue = "",
        wordToHexValue_temp = "",
        lByte,
        lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        wordToHexValue_temp = "0" + lByte.toString(16);
        wordToHexValue =
          wordToHexValue +
          wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
      }
      return wordToHexValue;
    }

    let x = [];
    let k, AA, BB, CC, DD, a, b, c, d;
    const S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22;
    const S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20;
    const S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23;
    const S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;

    // Steps 1 and 2: Append padding bits and length
    x = convertToWordArray(str);

    // Step 3: Initialize MD buffer
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;

    // Step 4: Process message in 16-word blocks
    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
      b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);

      a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

      a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

      a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
      b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
      d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
      d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
      b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);

      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }

    const result = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return result.toLowerCase();
  }

  // 对象按键名排序
  function orderPayload(obj) {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = obj[key];
        return result;
      }, {});
  }

  // URL编码查询字符串
  function encodeParams(params) {
    return Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&")
      .replace(/%20/g, "+")
      .replace(/%7E/g, "~");
  }

  // 获取基础请求参数
  function basePayload() {
    return {
      access_key: "",
      build: config.LIVEHIME_BUILD,
      platform: "pc_link",
      ts: Math.floor(Date.now() / 1000).toString(),
      version: config.LIVEHIME_VERSION,
    };
  }

  // 生成B站API签名
  function livehimeSign(payload) {
    const signed = { ...basePayload() };
    signed.appkey = config.APP_KEY;
    Object.assign(signed, payload);

    const orderedParams = orderPayload(signed);
    const queryString = encodeParams(orderedParams);
    const signStr = queryString + config.APP_SECRET;

    const sign = md5(signStr);
    orderedParams.sign = sign;

    // console.log("livehime_sign base_payload:", JSON.stringify(basePayload()));
    // console.log("livehime_sign before order:", JSON.stringify(signed));
    // console.log("livehime_sign after order:", JSON.stringify(orderedParams));
    // console.log("livehime_sign encoded:", queryString);
    // console.log("livehime_sign sign_str:", signStr);
    // console.log("livehime_sign sign:", sign);

    return orderedParams;
  }

  // 工具函数
  const utils = {
    // 拼音处理工具
    pinyin: {
      // 获取汉字拼音首字母
      getInitials: function (str) {
        if (!str) return "";
        const pinyinMap = this.getPinyinMap();
        let result = "";
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          // 如果是汉字，查找对应拼音首字母
          if (/[\u4e00-\u9fa5]/.test(char)) {
            const initial = this.getCharInitial(char, pinyinMap);
            if (initial) result += initial;
          } else {
            // 非汉字原样保留
            result += char;
          }
        }
        return result.toLowerCase();
      },
      // 获取完整拼音
      getFullPinyin: function (str) {
        if (!str) return "";
        const pinyinMap = this.getPinyinMap();
        let result = "";
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          // 如果是汉字，查找对应拼音
          if (/[\u4e00-\u9fa5]/.test(char)) {
            const pinyin = this.getCharPinyin(char, pinyinMap);
            if (pinyin) result += pinyin;
          } else {
            // 非汉字原样保留
            result += char;
          }
        }
        return result.toLowerCase();
      },
      // 获取单个汉字的拼音首字母
      getCharInitial: function (char, pinyinMap) {
        const pinyin = this.getCharPinyin(char, pinyinMap);
        return pinyin ? pinyin.charAt(0) : "";
      },
      // 获取单个汉字的完整拼音
      getCharPinyin: function (char, pinyinMap) {
        // 查找该汉字的拼音
        return pinyinMap[char] || "";
      },
      // 简化版拼音映射表 (仅包含常用汉字)
      getPinyinMap: function () {
        // 这里是简化版的拼音映射表，只包含一些常见汉字
        // 实际使用时可以扩展更多
        return {
          一: "yi",
          二: "er",
          三: "san",
          四: "si",
          五: "wu",
          六: "liu",
          七: "qi",
          八: "ba",
          九: "jiu",
          十: "shi",
          百: "bai",
          千: "qian",
          万: "wan",
          亿: "yi",
          星: "xing",
          穹: "qiong",
          铁: "tie",
          道: "dao",
          电: "dian",
          竞: "jing",
          技: "ji",
          王: "wang",
          者: "zhe",
          荣: "rong",
          耀: "yao",
          英: "ying",
          雄: "xiong",
          联: "lian",
          盟: "meng",
          和: "he",
          平: "ping",
          精: "jing",
          英: "ying",
          网: "wang",
          游: "you",
          戏: "xi",
          原: "yuan",
          神: "shen",
          崩: "beng",
          坏: "huai",
          蛋: "dan",
          娱: "yu",
          乐: "le",
          动: "dong",
          漫: "man",
          鬼: "gui",
          畜: "chu",
          科: "ke",
          技: "ji",
          手: "shou",
          游: "you",
          单: "dan",
          机: "ji",
          绝: "jue",
          地: "di",
          求: "qiu",
          生: "sheng",
          虎: "hu",
          牙: "ya",
          直: "zhi",
          播: "bo",
          购: "gou",
          物: "wu",
          美: "mei",
          食: "shi",
          户: "hu",
          外: "wai",
          风: "feng",
          音: "yin",
          乐: "yue",
          舞: "wu",
          蹈: "dao",
          日: "ri",
          常: "chang",
          学: "xue",
          习: "xi",
          才: "cai",
          艺: "yi",
          展: "zhan",
          示: "shi",
          房: "fang",
          产: "chan",
          数: "shu",
          码: "ma",
          摄: "she",
          影: "ying",
          翻: "fan",
          唱: "chang",
          聊: "liao",
          天: "tian",
          大: "da",
          厅: "ting",
          交: "jiao",
          友: "you",
          热: "re",
          点: "dian",
          快: "kuai",
          手: "shou",
          主: "zhu",
          机: "ji",
          游: "you",
          戏: "xi",
          怪: "guai",
          物: "wu",
          语: "yu",
          音: "yin",
          文: "wen",
          化: "hua",
          语: "yu",
          言: "yan",
          国: "guo",
          创: "chuang",
          意: "yi",
          时: "shi",
          尚: "shang",
          知: "zhi",
          识: "shi",
          军: "jun",
          事: "shi",
          资: "zi",
          讯: "xun",
          教: "jiao",
          育: "yu",
          健: "jian",
          康: "kang",
          相: "xiang",
          声: "sheng",
          传: "chuan",
          媒: "mei",
          体: "ti",
          育: "yu",
          赛: "sai",
          事: "shi",
          金: "jin",
          融: "rong",
          社: "she",
          会: "hui",
          民: "min",
          生: "sheng",
          高: "gao",
          校: "xiao",
          情: "qing",
          感: "gan",
          校: "xiao",
          园: "yuan",
          二: "er",
          次: "ci",
          元: "yuan",
          舞: "wu",
          蹈: "dao",
          虚: "xu",
          拟: "ni",
          演: "yan",
          出: "chu",
          音: "yin",
          乐: "yue",
          综: "zong",
          合: "he",
          歌: "ge",
          舞: "wu",
          才: "cai",
          艺: "yi",
          搞: "gao",
          笑: "xiao",
          脱: "tuo",
          口: "kou",
          秀: "xiu",
          户: "hu",
          外: "wai",
          美: "mei",
          食: "shi",
          萌: "meng",
          宅: "zhai",
          家: "jia",
          日: "ri",
          常: "chang",
          情: "qing",
          感: "gan",
          旅: "lv",
          游: "you",
          路: "lu",
          亚: "ya",
          服: "fu",
          装: "zhuang",
          时: "shi",
          尚: "shang",
          聊: "liao",
          天: "tian",
          线: "xian",
          游: "you",
          戏: "xi",
          电: "dian",
          竞: "jing",
          体: "ti",
          育: "yu",
          手: "shou",
          机: "ji",
          大: "da",
          杂: "za",
          烩: "hui",
        };
      },
    },
    // 发送GET请求
    get: function (url, params = {}, headers = {}) {
      return new Promise((resolve, reject) => {
        const queryString = Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&");
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        GM_xmlhttpRequest({
          method: "GET",
          url: fullUrl,
          headers: {
            "User-Agent": config.userAgent,
            ...headers,
          },
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response);
            } else {
              reject({
                status: response.status,
                statusText: response.statusText,
              });
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 发送POST请求
    post: function (url, data = {}, headers = {}) {
      return new Promise((resolve, reject) => {
        const formData = encodeParams(data);

        // 获取当前页面的cookies并添加appkey
        const currentCookies = document.cookie;
        const appkeyCookie = `appkey=${config.APP_KEY}`;
        const cookieHeader = currentCookies
          ? `${currentCookies}; ${appkeyCookie}`
          : appkeyCookie;

        GM_xmlhttpRequest({
          method: "POST",
          url: url,
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "User-Agent": config.userAgent,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: cookieHeader,
            ...headers,
          },
          data: formData,
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response);
            } else {
              reject({
                status: response.status,
                statusText: response.statusText,
              });
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    },

    // 从响应中解析JSON
    parseJSON: function (response) {
      try {
        return JSON.parse(response.responseText);
      } catch (e) {
        console.error("解析JSON失败:", e);
        return null;
      }
    },

    // 协议相关工具函数
    protocol: {
      // 获取协议类型
      getProtocolType: function () {
        return config.PROTOCOL_PREFERENCE;
      },

      // 判断是否使用SRT协议
      isSRTProtocol: function () {
        const preference = config.PROTOCOL_PREFERENCE;
        return preference === "SRT_FALLBACK_RTMP" || preference === "SRT_ONLY";
      },

      // 判断是否使用RTMP协议
      isRTMPProtocol: function () {
        const preference = config.PROTOCOL_PREFERENCE;
        return preference === "RTMP" || preference === "SRT_FALLBACK_RTMP";
      },

      // 解析推流地址
      parseStreamAddress: function (apiResponse) {
        if (!apiResponse || !apiResponse.data) {
          return null;
        }

        const result = {
          protocol: "RTMP",
          rtmpAddr: "",
          rtmpCode: "",
          srtAddr: "",
          srtCode: "",
          fallbackAvailable: false,
        };

        // 解析RTMP地址
        if (apiResponse.data.rtmp) {
          result.rtmpAddr = apiResponse.data.rtmp.addr || "";
          result.rtmpCode = apiResponse.data.rtmp.code || "";
        }

        // 解析SRT地址
        if (apiResponse.data.srt) {
          result.srtAddr = apiResponse.data.srt.addr || "";
          result.srtCode = apiResponse.data.srt.code || "";
        }

        // 根据协议偏好设置协议类型
        const preference = config.PROTOCOL_PREFERENCE;
        if (preference === "SRT_ONLY") {
          result.protocol = "SRT";
        } else if (preference === "SRT_FALLBACK_RTMP") {
          result.protocol = "SRT";
          result.fallbackAvailable = true;
        } else {
          result.protocol = "RTMP";
        }

        return result;
      },

      // 获取当前使用的推流地址
      getCurrentStreamAddress: function (parsedAddress) {
        if (!parsedAddress) {
          return { addr: "", code: "", protocol: "RTMP" };
        }

        const preference = config.PROTOCOL_PREFERENCE;

        // SRT_ONLY模式
        if (preference === "SRT_ONLY") {
          if (parsedAddress.srtAddr && parsedAddress.srtCode) {
            return {
              addr: parsedAddress.srtAddr,
              code: parsedAddress.srtCode,
              protocol: "SRT",
            };
          }
          utils.log("SRT_ONLY模式但未获取到SRT地址", "warning");
          return { addr: "", code: "", protocol: "SRT" };
        }

        // SRT_FALLBACK_RTMP模式
        if (preference === "SRT_FALLBACK_RTMP") {
          if (parsedAddress.srtAddr && parsedAddress.srtCode) {
            return {
              addr: parsedAddress.srtAddr,
              code: parsedAddress.srtCode,
              protocol: "SRT",
            };
          }
          utils.log("SRT不可用，回退到RTMP", "info");
          return {
            addr: parsedAddress.rtmpAddr,
            code: parsedAddress.rtmpCode,
            protocol: "RTMP",
          };
        }

        // RTMP模式（默认）
        return {
          addr: parsedAddress.rtmpAddr,
          code: parsedAddress.rtmpCode,
          protocol: "RTMP",
        };
      },

      // 格式化推流地址用于显示
      formatStreamAddress: function (addr, code) {
        if (!addr || !code) {
          return "未获取到推流地址";
        }
        return `${addr}/${code}`;
      },

      // 验证推流地址有效性
      validateStreamAddress: function (addr, code) {
        if (!addr || !code) {
          return false;
        }
        return addr.startsWith("rtmp://") || addr.startsWith("srt://");
      },
    },

    // 保存数据到GM_setValue
    saveData: function () {
      GM_setValue(
        "biliLiveData",
        JSON.stringify({
          userId: data.userId,
          roomId: data.roomId,
          areaId: data.areaId,
          parentAreaId: data.parentAreaId,
          title: data.title,
          liveStatus: data.liveStatus,
          roomData: data.roomData,
          rtmpAddr: data.rtmpAddr,
          rtmpCode: data.rtmpCode,
          srtAddr: data.srtAddr,
          srtCode: data.srtCode,
          currentProtocol: data.currentProtocol,
          csrf: data.csrf,
          cookies: data.cookies,
        })
      );
    },

    // 从GM_getValue加载数据
    loadData: function () {
      const savedData = GM_getValue("biliLiveData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          Object.assign(data, parsedData);
          return true;
        } catch (e) {
          console.error("加载数据失败:", e);
          return false;
        }
      }
      return false;
    },

    // 日志函数
    log: function (message, type = "info") {
      const styles = {
        info: "color: #2196F3",
        success: "color: #4CAF50",
        warning: "color: #FF9800",
        error: "color: #F44336",
      };
      console.log("%c[B站直播工具] " + message, styles[type]);
    },

    // 加载QR Code库
    loadQRCodeLib: function () {
      return new Promise((resolve) => {
        // 如果已经加载了QRCode库, 直接返回
        if (window.QRCode) {
          resolve(window.QRCode);
          return;
        }

        // 尝试多个CDN源，如果都失败则使用内联版本
        const loadFromCDN = () => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
          script.onerror = loadInlineQRCode;
          script.onload = () => resolve(window.qrcode || window.QRCode);
          document.head.appendChild(script);
        };

        // 加载内联版本的QRCode库（简化版本）
        const loadInlineQRCode = () => {
          utils.log("CDN加载失败，使用内联QRCode库", "warning");

          // 简单的QR码生成函数
          window.QRCode = function (container, options) {
            this.makeCode = function (text) {
              // 创建一个显示文本的元素作为替代
              const el =
                typeof container === "string"
                  ? document.getElementById(container)
                  : container;

              el.innerHTML = `<div style="padding:10px;border:2px solid #000;text-align:center;">
                                <div>扫码登录</div>
                                <div style="margin:8px 0;">请打开B站APP</div>
                                <div style="font-size:12px;color:#999">无法加载二维码库，请手动访问登录链接</div>
                                <div style="word-break:break-all;font-size:10px;margin-top:8px;">${text}</div>
                            </div>`;
            };
          };
          resolve(window.QRCode);
        };

        // 开始尝试加载
        loadFromCDN();
      });
    },
  };

  // 登录相关功能
  const auth = {
    // 检查用户登录状态
    checkLoginStatus: async function (showVisualIndicator = true) {
      try {
        // 显示加载提示
        if (showVisualIndicator) {
          ui.showMessage("正在检查B站登录状态...", "info");
        }

        const response = await utils.get(
          "https://api.bilibili.com/x/web-interface/nav/stat"
        );
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          utils.log("用户已登录", "success");
          if (showVisualIndicator) {
            ui.showMessage("登录状态检查完成：已登录B站", "success");
          }
          return true;
        } else {
          utils.log("用户未登录或登录已过期", "warning");
          if (showVisualIndicator) {
            ui.showMessage("请先登录B站再使用本功能", "warning");
          }
          return false;
        }
      } catch (error) {
        utils.log("检查登录状态失败", "error");
        console.error(error);

        if (showVisualIndicator) {
          ui.showMessage("登录状态检查失败，请检查网络连接", "error");
        }
        return false;
      }
    },

    // 通过cookie获取用户信息
    getUserInfoFromCookies: async function () {
      try {
        // 从cookie获取csrf
        const biliJct = document.cookie
          .split("; ")
          .find((row) => row.startsWith("bili_jct="));
        if (biliJct) {
          data.csrf = biliJct.split("=")[1];
        }

        // 从cookie获取用户ID
        const dedeUserID = document.cookie
          .split("; ")
          .find((row) => row.startsWith("DedeUserID="));
        if (dedeUserID) {
          data.userId = dedeUserID.split("=")[1];
        }

        // 获取直播间ID
        if (data.userId && data.userId !== -1) {
          // 创建签名参数
          const params = livehimeSign({ uid: data.userId });
          const response = await utils.get(
            "https://api.live.bilibili.com/room/v2/Room/room_id_by_uid",
            params
          );
          const result = utils.parseJSON(response);
          if (result && result.code === 0 && result.data) {
            data.roomId = result.data.room_id;
            utils.log("获取直播间信息成功", "success");
            utils.saveData();
            return true;
          }
        }

        utils.log("获取用户信息失败", "error");
        return false;
      } catch (error) {
        utils.log("获取用户信息异常", "error");
        console.error(error);
        return false;
      }
    },

    // 生成二维码
    generateQRCode: async function () {
      try {
        const response = await utils.get(
          "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
        );
        const result = utils.parseJSON(response);
        if (result && result.code === 0 && result.data) {
          return {
            url: result.data.url,
            qrcodeKey: result.data.qrcode_key,
          };
        }
        utils.log("生成二维码失败", "error");
        return null;
      } catch (error) {
        utils.log("生成二维码异常", "error");
        console.error(error);
        return null;
      }
    },

    // 检查二维码扫描状态
    checkQRCodeStatus: async function (qrcodeKey) {
      try {
        const response = await utils.get(
          "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
          { qrcode_key: qrcodeKey }
        );
        const result = utils.parseJSON(response);
        if (result && result.data) {
          return {
            code: result.data.code,
            message: result.data.message,
            refreshToken: result.data.refresh_token,
            timestamp: result.data.timestamp,
            status: result.code === 0,
          };
        }
        return { status: false, code: -1, message: "获取二维码状态失败" };
      } catch (error) {
        utils.log("检查二维码状态异常", "error");
        console.error(error);
        return { status: false, code: -1, message: "检查二维码状态异常" };
      }
    },

    // 二维码登录流程
    startQRLogin: async function () {
      // 创建二维码容器
      const qrContainer = document.createElement("div");
      qrContainer.className = "bili-live-qr-container protected";
      qrContainer.innerHTML = `
                <div class="qr-header">B站直播工具登录</div>
                <div class="qr-content">
                    <div class="qr-loading">正在加载二维码...</div>
                    <div class="qr-img"></div>
                    <div class="qr-status">请使用哔哩哔哩APP扫描二维码登录</div>
                </div>
                <div class="qr-footer">
                    <button class="qr-refresh">刷新二维码</button>
                    <button class="qr-close">关闭</button>
                </div>
            `;

      // 添加样式
      const style = document.createElement("style");
      style.textContent = `
                .bili-live-qr-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    text-align: center;
                    font-family: Arial, sans-serif;
                }
                .qr-header {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: #23ade5;
                }
                .qr-content {
                    padding: 10px;
                }
                .qr-img {
                    width: 200px;
                    height: 200px;
                    margin: 0 auto 15px;
                    display: none;
                }
                .qr-status {
                    font-size: 14px;
                    color: #666;
                    margin-top: 10px;
                }
                .qr-loading {
                    font-size: 14px;
                    color: #666;
                    margin: 80px 0;
                }
                .qr-footer {
                    margin-top: 15px;
                }
                .qr-close, .qr-refresh {
                    padding: 5px 20px;
                    background: #23ade5;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 0 5px;
                }
                .qr-close:hover, .qr-refresh:hover {
                    background: #1e9cd7;
                }
            `;
      document.head.appendChild(style);
      document.body.appendChild(qrContainer);

      // 关闭按钮事件
      const closeBtn = qrContainer.querySelector(".qr-close");
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(qrContainer);
      });

      // 刷新按钮事件
      const refreshBtn = qrContainer.querySelector(".qr-refresh");
      refreshBtn.addEventListener("click", async () => {
        // 重置状态
        const statusText = qrContainer.querySelector(".qr-status");
        statusText.textContent = "请使用哔哩哔哩APP扫描二维码登录";
        statusText.style.color = "";

        // 显示加载中状态
        const qrImg = qrContainer.querySelector(".qr-img");
        qrImg.style.display = "none";
        qrImg.innerHTML = ""; // 清除旧二维码
        const loadingEl = qrContainer.querySelector(".qr-loading");
        loadingEl.style.display = "block";

        // 重新生成二维码
        try {
          const qrData = await auth.generateQRCode();
          if (!qrData) {
            statusText.textContent = "生成二维码失败，请再次点击刷新";
            loadingEl.style.display = "none";
            return;
          }

          // 显示新二维码
          qrImg.style.display = "block";
          loadingEl.style.display = "none";

          // 生成二维码
          new QRCode(qrImg, {
            text: qrData.url,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });

          // 重新开始检查扫码状态
          let status = false;

          const checkInterval = setInterval(async () => {
            const result = await auth.checkQRCodeStatus(qrData.qrcodeKey);
            if (result.code === 0) {
              // 登录成功
              clearInterval(checkInterval);
              statusText.textContent = "登录成功！";
              statusText.style.color = "#4CAF50";

              // 更新用户信息
              await auth.getUserInfoFromCookies();

              // 3秒后关闭二维码窗口
              setTimeout(() => {
                try {
                  document.body.removeChild(qrContainer);
                  // 刷新页面以应用新的登录状态
                  location.reload();
                } catch (e) {
                  // 忽略可能的错误
                }
              }, 3000);
            } else if (result.code === 86038) {
              // 二维码已失效
              clearInterval(checkInterval);
              statusText.textContent = "二维码已失效，请点击刷新按钮重试";
              statusText.style.color = "#F44336";
            } else if (result.code === 86090) {
              // 已扫码等待确认
              if (!status) {
                statusText.textContent = "已扫描，请在手机上确认登录";
                statusText.style.color = "#FF9800";
                status = true;
              }
            }
          }, 1000);

          // 60秒后清除轮询
          setTimeout(() => {
            clearInterval(checkInterval);
            // 如果容器仍然存在，显示过期提示
            if (document.body.contains(qrContainer)) {
              statusText.textContent = "二维码已过期，请点击刷新按钮重试";
              statusText.style.color = "#F44336";
            }
          }, 60000);
        } catch (error) {
          utils.log("刷新二维码异常", "error");
          console.error(error);
          statusText.textContent = "刷新二维码出错，请重试";
          loadingEl.style.display = "none";
        }
      });

      // 加载QRCode库并生成二维码
      try {
        await utils.loadQRCodeLib();
        const qrData = await auth.generateQRCode();
        if (!qrData) {
          qrContainer.querySelector(".qr-status").textContent =
            "生成二维码失败，请点击刷新按钮重试";
          qrContainer.querySelector(".qr-loading").style.display = "none";
          return;
        }

        // 显示二维码
        const qrImg = qrContainer.querySelector(".qr-img");
        qrImg.style.display = "block";
        qrContainer.querySelector(".qr-loading").style.display = "none";

        // 生成二维码
        new QRCode(qrImg, {
          text: qrData.url,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });

        // 轮询检查扫码状态
        let status = false;
        const statusText = qrContainer.querySelector(".qr-status");

        const checkInterval = setInterval(async () => {
          const result = await auth.checkQRCodeStatus(qrData.qrcodeKey);
          if (result.code === 0) {
            // 登录成功
            clearInterval(checkInterval);
            statusText.textContent = "登录成功！";
            statusText.style.color = "#4CAF50";

            // 更新用户信息
            await auth.getUserInfoFromCookies();

            // 3秒后关闭二维码窗口
            setTimeout(() => {
              try {
                document.body.removeChild(qrContainer);
                // 刷新页面以应用新的登录状态
                location.reload();
              } catch (e) {
                // 忽略可能的错误
              }
            }, 3000);
          } else if (result.code === 86038) {
            // 二维码已失效
            clearInterval(checkInterval);
            statusText.textContent = "二维码已失效，请点击刷新按钮重试";
            statusText.style.color = "#F44336";
          } else if (result.code === 86090) {
            // 已扫码等待确认
            if (!status) {
              statusText.textContent = "已扫描，请在手机上确认登录";
              statusText.style.color = "#FF9800";
              status = true;
            }
          }
        }, 1000);

        // 60秒后清除轮询
        setTimeout(() => {
          clearInterval(checkInterval);
          // 如果容器仍然存在，显示过期提示
          if (document.body.contains(qrContainer)) {
            statusText.textContent = "二维码已过期，请点击刷新按钮重试";
            statusText.style.color = "#F44336";
          }
        }, 60000);
      } catch (error) {
        utils.log("二维码登录流程异常", "error");
        console.error(error);
        qrContainer.querySelector(".qr-status").textContent =
          "登录过程中出错，请刷新页面重试";
        qrContainer.querySelector(".qr-loading").style.display = "none";
      }
    },
  };

  // 直播控制相关功能
  const liveControls = {
    // 获取分区列表
    getAreaList: async function () {
      try {
        const params = livehimeSign({});
        const response = await utils.get(
          "https://api.live.bilibili.com/room/v1/Area/getList",
          params
        );
        const result = utils.parseJSON(response);

        if (result && result.code === 0 && result.data) {
          utils.log("获取分区列表成功", "success");
          data.areaList = result.data;
          return { status: true, data: result.data };
        } else {
          utils.log("获取分区列表失败", "error");
          return { status: false, message: "获取分区列表失败" };
        }
      } catch (error) {
        utils.log("获取分区列表异常", "error");
        console.error(error);
        return { status: false, message: "获取分区列表过程发生异常" };
      }
    },

    // 获取直播预配置信息 (PreLive接口)
    getPreLiveInfo: async function () {
      try {
        // 创建签名参数
        const params = livehimeSign({
          area: true,
          cover: true,
          coverVertical: true,
          liveDirectionType: 0,
          mobi_app: "pc_link",
          schedule: true,
          title: true,
        });

        const response = await utils.get(
          "https://api.live.bilibili.com/xlive/app-blink/v1/preLive/PreLive",
          params
        );
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          utils.log("获取直播预配置信息成功", "success");
          // console.log(result.data);
          // 保存标题信息
          if (result.data && result.data.title) {
            data.title = result.data.title;
            utils.saveData();
          }
          return { status: true, data: result.data };
        } else {
          utils.log(
            "获取直播预配置信息失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return {
            status: false,
            message: result ? result.message : "获取直播预配置信息失败",
          };
        }
      } catch (error) {
        utils.log("获取直播预配置信息异常", "error");
        console.error(error);
        return { status: false, message: "获取直播预配置信息过程发生异常" };
      }
    },

    // 获取直播间详细信息 (GetInfo接口)
    getRoomInfo: async function () {
      try {
        if (!data.userId || data.userId === -1) {
          utils.log("未获取到用户ID，无法获取房间信息", "error");
          return { status: false, message: "未获取到用户ID" };
        }

        // 创建签名参数
        const params = livehimeSign({
          uId: data.userId,
        });

        const response = await utils.get(
          "https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo",
          params
        );
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          utils.log("获取直播间信息成功", "success");
          // 更新房间信息
          if (result.data) {
            data.roomId = result.data.room_id;
            data.areaId = result.data.area_v2_id;
            data.parentAreaId = result.data.parent_id;
            data.roomData = {
              parent_area: result.data.parent_name,
              area: result.data.area_v2_name,
              parent_id: result.data.parent_id,
              area_id: result.data.area_v2_id,
            };

            // 更新直播状态
            data.liveStatus = result.data.live_status;

            // 如果正在直播，尝试获取推流地址
            if (result.data.live_status === 1) {
              // 通过开播接口获取推流地址，即使显示"重复开播"
              this.startLive(
                data.title || result.data.title,
                result.data.area_v2_id
              );
            }

            utils.saveData();
          }
          return { status: true, data: result.data };
        } else {
          utils.log(
            "获取直播间信息失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return {
            status: false,
            message: result ? result.message : "获取直播间信息失败",
          };
        }
      } catch (error) {
        utils.log("获取直播间信息异常", "error");
        console.error(error);
        return { status: false, message: "获取直播间信息过程发生异常" };
      }
    },

    // 开始直播
    startLive: async function (title = "我的直播", areaId = 371) {
      try {
        if (!data.roomId || data.roomId === -1) {
          utils.log("未获取到直播间ID，无法开播", "error");
          return { status: false, message: "未获取到直播间ID" };
        }

        let payload;
        let params;

        if (config.START_LIVE_AUTH_CSRF) {
          utils.log("startLive sign with csrf", "info");
          utils.log(
            `startLive original payload: area=${areaId}, room_id=${data.roomId}, csrf=${data.csrf}`,
            "info"
          );
          payload = {
            area_v2: areaId,
            csrf_token: data.csrf,
            csrf: data.csrf,
            room_id: data.roomId,
            type: 2,
          };
          params = livehimeSign(payload);
        } else {
          utils.log("startLive sign without csrf", "info");
          utils.log(
            `startLive original payload: area=${areaId}, room_id=${data.roomId}, csrf=${data.csrf}`,
            "info"
          );
          payload = {
            room_id: data.roomId,
            area_v2: areaId,
            type: 2,
          };
          params = livehimeSign(payload);
          params.csrf_token = data.csrf;
          params.csrf = data.csrf;
          params = orderPayload(params);
        }

        // utils.log(`startLive signed data: ${JSON.stringify(params)}`, "info");
        // utils.log("startLive Request", "info");

        // 发送开播请求
        const response = await utils.post(config.API.START_LIVE, params);
        const result = utils.parseJSON(response);

        // utils.log("startLive Response", "info");

        if (result && result.code === 0) {
          utils.log("开播成功", "success");

          // 解析推流地址
          const parsedAddress = utils.protocol.parseStreamAddress(result);
          if (parsedAddress) {
            // 保存所有推流地址
            data.rtmpAddr = parsedAddress.rtmpAddr;
            data.rtmpCode = parsedAddress.rtmpCode;
            data.srtAddr = parsedAddress.srtAddr;
            data.srtCode = parsedAddress.srtCode;

            // 根据协议偏好获取当前使用的推流地址
            const currentAddress =
              utils.protocol.getCurrentStreamAddress(parsedAddress);
            data.currentProtocol = currentAddress.protocol;

            utils.log(
              `使用${
                data.currentProtocol
              }协议推流: ${utils.protocol.formatStreamAddress(
                currentAddress.addr,
                currentAddress.code
              )}`,
              "info"
            );

            // 验证推流地址有效性
            if (
              !utils.protocol.validateStreamAddress(
                currentAddress.addr,
                currentAddress.code
              )
            ) {
              utils.log("推流地址验证失败", "warning");
            }
          }

          data.liveStatus = 1;
          utils.saveData();

          return {
            status: true,
            message: "开播成功",
            data: {
              ...result.data,
              protocol: data.currentProtocol,
              streamAddress: utils.protocol.formatStreamAddress(
                data.currentProtocol === "SRT" ? data.srtAddr : data.rtmpAddr,
                data.currentProtocol === "SRT" ? data.srtCode : data.rtmpCode
              ),
            },
          };
        } else if (result && result.code === 60024) {
          utils.log("需要人脸认证", "warning");
          const qrUrl = result.data && result.data.qr;
          if (qrUrl) {
            const pollInterval = setInterval(async () => {
              const statusResult = await this.checkFaceAuthStatus();
              const statusText = document.getElementById(
                "bili-face-auth-status"
              );
              if (statusText) {
                if (statusResult.status && statusResult.isIdentified) {
                  statusText.textContent = "人脸认证成功，正在重新开播...";
                  clearInterval(pollInterval);
                  const qrContainer = document.getElementById(
                    "bili-face-auth-qr-container"
                  );
                  if (qrContainer) {
                    qrContainer.remove();
                  }
                  const startResult = await this.startLive(title, areaId);
                  if (startResult.status) {
                    const panel = document.getElementById("bili-live-panel");
                    if (panel) {
                      panel.querySelector(".status-value").className =
                        "status-value status-on";
                      panel.querySelector(".status-value").textContent =
                        "直播中";
                      panel.querySelector(".protocol-value").textContent =
                        data.currentProtocol || "RTMP";
                      panel.querySelector("#start-live").className =
                        "btn-disabled";
                      panel.querySelector("#stop-live").className =
                        "btn-danger";
                      panel.querySelector("#copy-rtmp").className =
                        "btn-success";
                      panel.querySelector("#update-live-info").className =
                        "btn-primary";
                    }
                    utils.log("直播已开始", "success");
                  }
                } else {
                  statusText.textContent = "等待人脸认证...";
                }
              }
            }, 2000);
            await this.showFaceAuthQR(qrUrl, pollInterval);
            return { status: false, message: "需要人脸认证" };
          } else {
            utils.log("未获取到二维码URL", "error");
            return { status: false, message: "未获取到二维码URL" };
          }
        } else {
          utils.log(
            "开播失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return {
            status: false,
            message: result ? result.message : "开播失败",
          };
        }
      } catch (error) {
        utils.log("开播过程异常", "error");
        console.error(error);
        return { status: false, message: "开播过程发生异常" };
      }
    },

    // 结束直播
    stopLive: async function () {
      try {
        if (!data.roomId || data.roomId === -1) {
          utils.log("未获取到直播间ID，无法停播", "error");
          return { status: false, message: "未获取到直播间ID" };
        }

        const payload = {
          room_id: data.roomId,
          platform: "pc",
        };

        if (data.csrf) {
          payload.csrf = data.csrf;
          payload.csrf_token = data.csrf;
        } else {
          utils.log("未获取到CSRF，停播可能会失败", "warning");
        }

        const params = livehimeSign(payload);

        if (data.csrf) {
          params.csrf = data.csrf;
          params.csrf_token = data.csrf;
        }

        const response = await utils.post(config.API.STOP_LIVE, params);
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          utils.log("停播成功", "success");
          data.liveStatus = 0;
          data.rtmpAddr = "";
          data.rtmpCode = "";
          data.srtAddr = "";
          data.srtCode = "";
          data.currentProtocol = "RTMP";
          utils.saveData();
          return { status: true, message: "停播成功" };
        } else {
          utils.log(
            "停播失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return {
            status: false,
            message: result ? result.message : "停播失败",
          };
        }
      } catch (error) {
        utils.log("停播过程异常", "error");
        console.error(error);
        return { status: false, message: "停播过程发生异常" };
      }
    },

    // 更新直播信息（标题/分区）
    updateLiveInfo: async function (title, areaId) {
      try {
        if (!data.roomId || data.roomId === -1) {
          utils.log("未获取到直播间ID，无法更新直播信息", "error");
          return { status: false, message: "未获取到直播间ID" };
        }

        const payload = {
          room_id: data.roomId,
        };

        if (title) {
          payload.title = title;
        }

        if (areaId) {
          payload.area_id = areaId;
        }

        if (data.csrf) {
          payload.csrf = data.csrf;
          payload.csrf_token = data.csrf;
        } else {
          utils.log("未获取到CSRF，更新直播信息可能会失败", "warning");
          return { status: false, message: "未获取到CSRF令牌" };
        }

        const response = await utils.post(config.API.UPDATE_LIVE_INFO, payload);
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          utils.log("更新直播信息成功", "success");

          if (title) {
            data.title = title;
          }
          if (areaId) {
            data.areaId = parseInt(areaId);
          }
          utils.saveData();

          return { status: true, message: "更新直播信息成功" };
        } else {
          utils.log(
            "更新直播信息失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return {
            status: false,
            message: result ? result.message : "更新直播信息失败",
          };
        }
      } catch (error) {
        utils.log("更新直播信息过程异常", "error");
        console.error(error);
        return { status: false, message: "更新直播信息过程发生异常" };
      }
    },

    // 检查人脸认证状态
    checkFaceAuthStatus: async function () {
      try {
        const payload = {
          room_id: data.roomId,
          face_auth_code: "60024",
          csrf_token: data.csrf,
          csrf: data.csrf,
          visit_id: "",
        };
        const response = await utils.post(config.API.CHECK_FACE_AUTH, payload);
        const result = utils.parseJSON(response);

        if (result && result.code === 0) {
          const isIdentified = result.data && result.data.is_identified;
          utils.log(
            `人脸认证状态: ${isIdentified ? "已认证" : "未认证"}`,
            "info"
          );
          return { status: true, isIdentified: isIdentified };
        } else {
          utils.log(
            "检查人脸认证状态失败: " + (result ? result.message : "未知错误"),
            "error"
          );
          return { status: false, isIdentified: false };
        }
      } catch (error) {
        utils.log("检查人脸认证状态异常", "error");
        console.error(error);
        return { status: false, isIdentified: false };
      }
    },

    // 显示人脸认证二维码
    showFaceAuthQR: async function (qrUrl, pollInterval) {
      try {
        utils.log("显示人脸认证二维码", "info");

        const qrContainer = document.createElement("div");
        qrContainer.id = "bili-face-auth-qr-container";
        qrContainer.className = "protected";
        qrContainer.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 10000;
          text-align: center;
        `;

        const title = document.createElement("div");
        title.textContent = "请使用B站APP扫码进行人脸认证";
        title.style.cssText = `
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        `;

        const closeBtn = document.createElement("div");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          line-height: 1;
        `;
        closeBtn.onclick = function () {
          clearInterval(pollInterval);
          qrContainer.remove();
        };

        const qrDiv = document.createElement("div");
        qrDiv.id = "bili-face-auth-qr";
        qrDiv.style.cssText = `
          display: flex;
          justify-content: center;
          align-items: center;
        `;

        const statusText = document.createElement("div");
        statusText.id = "bili-face-auth-status";
        statusText.textContent = "等待扫码...";
        statusText.style.cssText = `
          margin-top: 15px;
          font-size: 14px;
          color: #666;
        `;

        qrContainer.appendChild(closeBtn);
        qrContainer.appendChild(title);
        qrContainer.appendChild(qrDiv);
        qrContainer.appendChild(statusText);
        document.body.appendChild(qrContainer);

        await utils.loadQRCodeLib();
        new QRCode(qrDiv, {
          text: qrUrl,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });

        return qrContainer;
      } catch (error) {
        utils.log("显示人脸认证二维码异常", "error");
        console.error(error);
        return null;
      }
    },
  };

  // 主界面UI
  const ui = {
    // 显示自定义确认对话框
    // 显示消息提示
    showMessage: function (message, type = "info") {
      // 创建消息元素
      const msgEl = document.createElement("div");
      msgEl.className = `bili-message bili-message-${type} protected`;
      msgEl.innerHTML = `<div class="message-content">${message}</div>`;

      // 添加样式
      if (!document.querySelector(".bili-message-style")) {
        const style = document.createElement("style");
        style.className = "bili-message-style";
        style.textContent = `
                    .bili-message {
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        padding: 10px 20px;
                        border-radius: 4px;
                        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
                        z-index: 10002;
                        min-width: 240px;
                        max-width: 400px;
                        animation: message-fade-in 0.3s, message-fade-out 0.3s 2.7s;
                        opacity: 0;
                    }
                    .bili-message .message-content {
                        text-align: center;
                        font-size: 14px;
                    }
                    .bili-message-info {
                        background: #f0f9ff;
                        border: 1px solid #d0e6fe;
                        color: #1890ff;
                    }
                    .bili-message-success {
                        background: #f0fff0;
                        border: 1px solid #d0fed0;
                        color: #52c41a;
                    }
                    .bili-message-warning {
                        background: #fffbe6;
                        border: 1px solid #fff6c6;
                        color: #faad14;
                    }
                    .bili-message-error {
                        background: #fff0f0;
                        border: 1px solid #fed0d0;
                        color: #f5222d;
                    }
                    @keyframes message-fade-in {
                        from { opacity: 0; transform: translate(-50%, -20px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                    @keyframes message-fade-out {
                        from { opacity: 1; transform: translate(-50%, 0); }
                        to { opacity: 0; transform: translate(-50%, -20px); }
                    }
                `;
        document.head.appendChild(style);
      }

      document.body.appendChild(msgEl);

      // 显示动画
      setTimeout(() => {
        msgEl.style.opacity = "1";
      }, 0);

      // 自动消失
      setTimeout(() => {
        msgEl.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(msgEl)) {
            document.body.removeChild(msgEl);
          }
        }, 300);
      }, 3000);
    },

    // 更新面板数据的方法
    // 使面板可拖动的方法
    makePanelDraggable: function (panel) {
      let offsetX,
        offsetY,
        isDragging = false;
      const header = panel.querySelector(".panel-header");

      // 阻止冒泡，确保点击面板内容时不触发拖动
      const stopPropagation = function (e) {
        e.stopPropagation();
      };

      // 为所有表单元素和按钮添加阻止冒泡
      const formElements = panel.querySelectorAll(
        "input, select, button, .btn-primary, .btn-danger, .btn-success, .area-search-container"
      );
      formElements.forEach((el) => {
        el.addEventListener("mousedown", stopPropagation);
      });

      // 开始拖动事件 - 只在标题栏触发
      const dragStart = function (e) {
        // 只允许鼠标左键拖动
        if (e.button !== 0) return;

        // 确保拖动开始于标题栏
        if (e.currentTarget === header) {
          isDragging = true;

          // 获取鼠标在面板中的相对位置
          const rect = panel.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;

          // 防止拖动时选中文本
          e.preventDefault();

          // 添加活动样式
          header.style.cursor = "grabbing";
        }
      };

      // 拖动中事件
      const dragMove = function (e) {
        if (!isDragging) return;

        // 计算新位置
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        // 限制不超出屏幕边界
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));

        // 设置面板位置
        panel.style.left = boundedX + "px";
        panel.style.top = boundedY + "px";
        panel.style.right = "auto"; // 清除right属性以避免冲突
      };

      // 结束拖动事件
      const dragEnd = function () {
        if (isDragging) {
          isDragging = false;
          // 恢复正常样式
          header.style.cursor = "move";
        }
      };

      // 添加事件监听
      header.addEventListener("mousedown", dragStart);
      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);

      // 设置标题栏鼠标样式
      header.style.cursor = "move";

      // 清理函数 - 当面板被移除时调用
      panel.dragCleanup = function () {
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
        formElements.forEach((el) => {
          el.removeEventListener("mousedown", stopPropagation);
        });
      };
    },

    updateLivePanel: function (data) {
      if (!this._livePanel) return;

      const panel = this._livePanel;

      const statusValue = panel.querySelector(".status-value");
      statusValue.className = `status-value ${
        data.liveStatus === 1 ? "status-on" : "status-off"
      }`;
      statusValue.textContent = data.liveStatus === 1 ? "直播中" : "未开播";

      const protocolValue = panel.querySelector(".protocol-value");
      if (protocolValue) {
        protocolValue.textContent = data.currentProtocol || "RTMP";
      }

      const titleInput = panel.querySelector("#live-title");
      if (data.title) {
        titleInput.value = data.title;
      }

      const parentAreaSelect = panel.querySelector("#parent-area");
      const areaIdSelect = panel.querySelector("#area-id");

      if (data.areaList && data.areaList.length > 0) {
        parentAreaSelect.innerHTML = "";
        data.areaList.forEach((parentArea) => {
          const option = document.createElement("option");
          option.value = parentArea.id;
          option.textContent = parentArea.name;
          if (data.parentAreaId == parentArea.id) {
            option.selected = true;
          }
          parentAreaSelect.appendChild(option);
        });

        areaIdSelect.innerHTML = "";
        const selectedParent =
          data.areaList.find((p) => p.id == data.parentAreaId) ||
          data.areaList[0];
        if (
          selectedParent &&
          selectedParent.list &&
          selectedParent.list.length > 0
        ) {
          selectedParent.list.forEach((area) => {
            const option = document.createElement("option");
            option.value = area.id;
            option.textContent = area.name;
            if (data.areaId == area.id) {
              option.selected = true;
            }
            areaIdSelect.appendChild(option);
          });
        }
      }

      const startLiveBtn = panel.querySelector("#start-live");
      const stopLiveBtn = panel.querySelector("#stop-live");
      const copyRtmpBtn = panel.querySelector("#copy-rtmp");
      const updateLiveInfoBtn = panel.querySelector("#update-live-info");

      startLiveBtn.className =
        data.liveStatus === 1 ? "btn-disabled" : "btn-primary";
      stopLiveBtn.className =
        data.liveStatus !== 1 ? "btn-disabled" : "btn-danger";
      copyRtmpBtn.className =
        !data.rtmpAddr && !data.srtAddr ? "btn-disabled" : "btn-success";
      updateLiveInfoBtn.className =
        data.liveStatus === 1 ? "btn-primary" : "btn-disabled";
    },

    // 显示自定义确认对话框
    showConfirm: function (message, confirmCallback, cancelCallback) {
      // 创建对话框容器
      const dialog = document.createElement("div");
      dialog.className = "bili-confirm-dialog";
      dialog.innerHTML = `
                <div class="confirm-dialog-content">
                    <div class="confirm-dialog-message">${message}</div>
                    <div class="confirm-dialog-buttons">
                        <button class="btn-cancel">取消</button>
                        <button class="btn-confirm">确定</button>
                    </div>
                </div>
            `;

      // 添加样式
      const style = document.createElement("style");
      style.textContent = `
                .bili-confirm-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                }
                .confirm-dialog-content {
                    background: white;
                    border-radius: 8px;
                    width: 300px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                }
                .confirm-dialog-message {
                    padding: 20px;
                    text-align: center;
                    font-size: 16px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                }
                .confirm-dialog-buttons {
                    display: flex;
                    padding: 15px;
                }
                .confirm-dialog-buttons button {
                    flex: 1;
                    padding: 8px 0;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    margin: 0 5px;
                    font-size: 14px;
                }
                .btn-cancel {
                    background: #f0f0f0;
                    color: #666;
                }
                .btn-cancel:hover {
                    background: #e0e0e0;
                }
                .btn-confirm {
                    background: #F44336;
                    color: white;
                }
                .btn-confirm:hover {
                    background: #d32f2f;
                }
            `;
      document.head.appendChild(style);
      document.body.appendChild(dialog);

      // 绑定按钮事件
      const confirmBtn = dialog.querySelector(".btn-confirm");
      const cancelBtn = dialog.querySelector(".btn-cancel");

      confirmBtn.addEventListener("click", () => {
        document.body.removeChild(dialog);
        if (typeof confirmCallback === "function") {
          confirmCallback();
        }
      });

      cancelBtn.addEventListener("click", () => {
        document.body.removeChild(dialog);
        if (typeof cancelCallback === "function") {
          cancelCallback();
        }
      });
    },
    // 创建主界面按钮
    createMainButton: function () {
      const button = document.createElement("div");
      button.className = "bili-live-tool-button protected";
      button.innerHTML = `<svg t="1623318424332" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1127" width="24" height="24"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0" fill="#23ADE5" p-id="1128"></path><path d="M826.624 464.583111l-63.4368-235.8784a37.7344 37.7344 0 0 0-46.1312-27.4944l-231.8848 62.1568a37.6832 37.6832 0 0 0-27.4944 46.1312l63.4368 235.8784a37.7344 37.7344 0 0 0 46.1312 27.4944l231.8848-62.1568a37.7344 37.7344 0 0 0 27.4944-46.1312" fill="#23ADE5" p-id="1129"></path><path d="M834.56 938.665911H190.0032c-69.632 0-126.1056-56.32-126.1056-125.7472V211.529311c0-69.4272 56.4736-125.7472 126.1056-125.7472H834.56c69.632 0 126.1056 56.32 126.1056 125.7472v601.4464c0 69.4272-56.4736 125.7472-126.1056 125.7472z m-644.5568-778.5472c-28.2624 0-51.2 22.8864-51.2 51.1488v601.4464c0 28.2624 22.9376 51.1488 51.2 51.1488H834.56c28.2624 0 51.2-22.8864 51.2-51.1488V211.529311c0-28.2624-22.9376-51.1488-51.2-51.1488H190.0032z" fill="#23ADE5" p-id="1130"></path></svg>`;

      // 添加样式
      const style = document.createElement("style");
      style.textContent = `
                .bili-live-tool-button {
                    position: fixed;
                    right: 20px;
                    top: 80px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 9999;
                }
                .bili-live-tool-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
                }
            `;
      document.head.appendChild(style);
      document.body.appendChild(button);

      // 点击事件
      button.addEventListener("click", async () => {
        const isLoggedIn = await auth.checkLoginStatus();
        if (!isLoggedIn) {
          // 未登录，启动登录流程
          auth.startQRLogin();
        } else {
          // 已登录，获取用户信息
          await auth.getUserInfoFromCookies();
          utils.log(
            "用户已登录，用户ID: " + data.userId + ", 房间ID: " + data.roomId
          );

          // // 先获取最新的直播信息
          // await liveControls.getPreLiveInfo();
          // await liveControls.getRoomInfo();
          // await liveControls.getAreaList();

          // 显示直播控制面板
          ui.showLivePanel(data, true);
        }
      });
    },

    // 显示直播面板
    // 存储面板引用
    _livePanel: null,

    showLivePanel: async function (data, ifFresh = false) {
      // 检查面板是否已经存在
      if (this._livePanel) {
        // 如果面板已存在但被隐藏，则显示它
        if (this._livePanel.style.display === "none") {
          this._livePanel.style.display = "block";
          if (ifFresh) {
            await liveControls.getPreLiveInfo();
            await liveControls.getRoomInfo();
            await liveControls.getAreaList();
          }

          // 更新面板数据
          this.updateLivePanel(data);
        }
        return;
      }

      // 创建面板
      const panel = document.createElement("div");
      panel.className = "bili-live-panel protected";
      // 存储面板引用
      this._livePanel = panel;
      panel.innerHTML = `
                <div class="panel-header">B站直播控制面板<div class="panel-header-controls"><div class="refresh-button" title="刷新数据"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></div></div></div>
                <div class="panel-content">
                    <div class="panel-status">
                        <div class="status-title">直播状态</div>
                        <div class="status-value ${
                          data.liveStatus === 1 ? "status-on" : "status-off"
                        }">
                            ${data.liveStatus === 1 ? "直播中" : "未开播"}
                        </div>
                    </div>
                    <div class="panel-status">
                        <div class="status-title">推流协议</div>
                        <div class="status-value protocol-value">
                            ${data.currentProtocol || "RTMP"}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="live-title">直播标题</label>
                        <input type="text" id="live-title" value="${
                          data.title || "我的直播间"
                        }">
                    </div>
                    <div class="form-group">
                        <label for="parent-area">直播分区</label>
                        <div style="display: flex; gap: 10px;">
                            <select id="parent-area" style="flex: 1;">
                                ${
                                  data.areaList && data.areaList.length > 0
                                    ? data.areaList
                                        .map(
                                          (parentArea) =>
                                            `<option value="${parentArea.id}" ${
                                              data.parentAreaId == parentArea.id
                                                ? "selected"
                                                : ""
                                            }>${parentArea.name}</option>`
                                        )
                                        .join("")
                                    : `<option value="2">网游</option>
                                    <option value="3">手游</option>
                                    <option value="1">娱乐</option>
                                    <option value="5">电台</option>`
                                }
                            </select>
                            <select id="area-id" style="flex: 1;">
                                ${
                                  data.areaList && data.areaList.length > 0
                                    ? (() => {
                                        const currentParent =
                                          data.areaList.find(
                                            (p) => p.id == data.parentAreaId
                                          ) || data.areaList[0];
                                        return currentParent.list
                                          .map(
                                            (area) =>
                                              `<option value="${area.id}" ${
                                                data.areaId == area.id
                                                  ? "selected"
                                                  : ""
                                              }>${area.name}</option>`
                                          )
                                          .join("");
                                      })()
                                    : `<option value="371">虚拟主播</option>
                                    <option value="372">唱见电台</option>
                                    <option value="21">视频唱见</option>
                                    <option value="373">舞见</option>
                                    <option value="6">单机游戏</option>`
                                }
                            </select>
                        </div>
                        <div id="area-search-container" style="margin-top: 10px;">
                            <input type="text" id="area-search" placeholder="搜索分区..." style="width:100%; padding:5px; border:1px solid #ddd; border-radius:4px;">
                            <div id="search-results" style="max-height:150px; overflow-y:auto; display:none; position:absolute; z-index:1000; background:white; width:calc(100% - 40px); border:1px solid #ddd; border-radius:4px;"></div>
                        </div>
                    </div>
                    <div class="button-group">
                        <button id="start-live" class="${
                          data.liveStatus === 1 ? "btn-disabled" : "btn-primary"
                        }">开始直播</button>
                        <button id="stop-live" class="${
                          data.liveStatus !== 1 ? "btn-disabled" : "btn-danger"
                        }">结束直播</button>
                        <button id="copy-rtmp" class="${
                          !data.rtmpAddr && !data.srtAddr
                            ? "btn-disabled"
                            : "btn-success"
                        }">复制推流地址</button>
                    </div>
                    <div class="button-group" style="margin-top: 10px;">
                        <button id="update-live-info" class="${
                          data.liveStatus === 1 ? "btn-primary" : "btn-disabled"
                        }" style="width:100%;">更新直播信息</button>
                    </div>
                </div>
                <div class="panel-footer">
                    <button id="close-panel">关闭</button>
                </div>
            `;

      // 添加样式
      const style = document.createElement("style");
      style.textContent = `
                .bili-live-panel {
                    position: fixed;
                    top: 100px;
                    right: 70px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                    width: 350px;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                }
                .panel-header {
                    background: #23ADE5;
                    color: white;
                    padding: 15px;
                    border-radius: 8px 8px 0 0;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move; /* 确保标题栏可以作为拖动手柄 */
                    user-select: none; /* 防止文本被选中影响拖动 */
                }
                .panel-header-controls {
                    display: flex;
                    align-items: center;
                }
                .refresh-button {
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.2);
                    transition: background-color 0.2s;
                }
                .refresh-button:hover {
                    background-color: rgba(255, 255, 255, 0.4);
                    font-size: 16px;
                }
                .panel-content {
                    padding: 20px;
                    cursor: default; /* 内容区域使用默认鼠标样式 */

                }
                .panel-footer {
                    padding: 15px;
                    text-align: right;
                    border-top: 1px solid #eee;
                }
                .panel-status {
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .status-title {
                    font-weight: bold;
                }
                .status-value {
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .status-on {
                    background: #4CAF50;
                    color: white;
                }
                .status-off {
                    background: #F44336;
                    color: white;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    font-size: 14px;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .button-group {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .button-group button {
                    flex: 1;
                    margin: 0 5px;
                }
                .button-group button:first-child {
                    margin-left: 0;
                }
                .button-group button:last-child {
                    margin-right: 0;
                }
                .btn-primary {
                    background: #23ADE5;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-danger {
                    background: #F44336;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-success {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-disabled {
                    background: #cccccc;
                    color: #666666;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: not-allowed;
                }
                #close-panel {
                    background: #f0f0f0;
                    border: 1px solid #ddd;
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #close-panel:hover {
                    background: #e0e0e0;
                }
                .btn-primary:hover:not(.btn-disabled) {
                    background: #1e9cd7;
                }
                .btn-danger:hover:not(.btn-disabled) {
                    background: #d32f2f;
                }
                .btn-success:hover:not(.btn-disabled) {
                    background: #388e3c;
                }
            `;
      document.head.appendChild(style);
      document.body.appendChild(panel);

      // 使面板可拖动
      this.makePanelDraggable(panel);

      // 主分区和子分区联动事件
      const parentAreaSelect = panel.querySelector("#parent-area");
      const areaIdSelect = panel.querySelector("#area-id");
      const searchContainer = panel.querySelector("#area-search-container");
      const searchInput = panel.querySelector("#area-search");
      const searchResults = panel.querySelector("#search-results");

      // 分区搜索功能 - 支持拼音搜索、首字母搜索和area_id搜索
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length < 1) {
          searchResults.style.display = "none";
          return;
        }

        // 清空搜索结果
        searchResults.innerHTML = "";
        searchResults.style.display = "block";

        // 搜索所有子分区
        let results = [];
        if (data.areaList && data.areaList.length > 0) {
          data.areaList.forEach((parentArea) => {
            if (parentArea.list) {
              parentArea.list.forEach((childArea) => {
                // 准备搜索用的数据
                const name = childArea.name.toLowerCase();
                const pinyin = utils.pinyin.getFullPinyin(childArea.name);
                const initials = utils.pinyin.getInitials(childArea.name);
                const id = childArea.id.toString();

                // 多种匹配方式：名称、拼音、首字母、ID
                if (
                  name.includes(searchTerm) || // 名称匹配
                  pinyin.includes(searchTerm) || // 拼音匹配
                  initials.includes(searchTerm) || // 拼音首字母匹配
                  id === searchTerm
                ) {
                  // ID精确匹配
                  results.push({
                    parentId: parentArea.id,
                    parentName: parentArea.name,
                    id: childArea.id,
                    name: childArea.name,
                    pinyin: pinyin,
                    initials: initials,
                  });
                }
              });
            }
          });
        }

        // 显示搜索结果
        if (results.length > 0) {
          results.forEach((result) => {
            const resultItem = document.createElement("div");
            resultItem.style.padding = "8px";
            resultItem.style.cursor = "pointer";
            resultItem.style.borderBottom = "1px solid #eee";
            resultItem.style.display = "flex";
            resultItem.style.justifyContent = "space-between";
            resultItem.style.flexDirection = "column";
            // 显示更多匹配信息
            resultItem.innerHTML = `
                            <div>
                                <span>${result.name}</span>
                                <span style="color:#666; font-size:0.85em; margin-left:6px;">(${result.id})</span>
                            </div>
                            <div>
                                <span style="color:#999; font-size:0.85em;">${result.parentName}</span>
                                <span style="color:#aaa; font-size:0.8em; margin-left:6px;">${result.initials}</span>
                            </div>
                        `;
            resultItem.addEventListener("mouseover", () => {
              resultItem.style.backgroundColor = "#f0f0f0";
            });
            resultItem.addEventListener("mouseout", () => {
              resultItem.style.backgroundColor = "";
            });
            resultItem.addEventListener("click", () => {
              // 选择父分区
              data.parentAreaId = result.parentId;
              for (let i = 0; i < parentAreaSelect.options.length; i++) {
                if (
                  parseInt(parentAreaSelect.options[i].value) ===
                  result.parentId
                ) {
                  parentAreaSelect.selectedIndex = i;
                  break;
                }
              }

              // 更新子分区列表
              const selectedParentId = parentAreaSelect.value;
              areaIdSelect.innerHTML = "";
              if (data.areaList && data.areaList.length > 0) {
                const selectedParent = data.areaList.find(
                  (p) => p.id == selectedParentId
                );
                if (
                  selectedParent &&
                  selectedParent.list &&
                  selectedParent.list.length > 0
                ) {
                  selectedParent.list.forEach((area) => {
                    const option = document.createElement("option");
                    option.value = area.id;
                    option.textContent = area.name;
                    if (area.id === result.id) {
                      option.selected = true;
                    }
                    areaIdSelect.appendChild(option);
                  });
                }
              }

              // 选择子分区
              data.areaId = result.id;
              areaIdSelect.value = result.id;

              // 关闭搜索结果
              searchResults.style.display = "none";
              searchInput.value = result.name;
            });
            searchResults.appendChild(resultItem);
          });
        } else {
          const noResult = document.createElement("div");
          noResult.style.padding = "8px";
          noResult.textContent = "没有找到匹配的分区";
          searchResults.appendChild(noResult);
        }
      });

      // 点击其他地方关闭搜索结果
      document.addEventListener("click", (e) => {
        if (e.target !== searchInput && e.target !== searchResults) {
          searchResults.style.display = "none";
        }
      });

      parentAreaSelect.addEventListener("change", () => {
        const selectedParentId = parentAreaSelect.value;
        // 保存当前选择的主分区ID
        data.parentAreaId = parseInt(selectedParentId);
        searchContainer.style.display = "block";

        // 清空并重新填充子分区选项
        areaIdSelect.innerHTML = "";

        if (data.areaList && data.areaList.length > 0) {
          // 找到选中的主分区
          const selectedParent = data.areaList.find(
            (p) => p.id == selectedParentId
          );

          if (
            selectedParent &&
            selectedParent.list &&
            selectedParent.list.length > 0
          ) {
            // 填充该主分区下的子分区
            selectedParent.list.forEach((area) => {
              const option = document.createElement("option");
              option.value = area.id;
              option.textContent = area.name;
              areaIdSelect.appendChild(option);
            });
            // 默认选中第一个子分区
            data.areaId = parseInt(areaIdSelect.options[0].value);
          }
        }
      });

      // 子分区点击事件 - 显示搜索框
      areaIdSelect.addEventListener("click", () => {
        searchContainer.style.display = "block";
      });

      // 子分区变更事件
      areaIdSelect.addEventListener("change", () => {
        data.areaId = parseInt(areaIdSelect.value);
      });

      // 关闭按钮事件
      const closeBtn = panel.querySelector("#close-panel");
      closeBtn.addEventListener("click", () => {
        // 隐藏面板而不是移除
        panel.style.display = "none";
      });

      // 刷新按钮事件
      const refreshBtn = panel.querySelector(".refresh-button");
      refreshBtn.addEventListener("click", async () => {
        // 显示加载提示
        ui.showMessage("正在刷新数据...", "info");

        try {
          // 获取最新的直播状态和信息
          await liveControls.getPreLiveInfo();
          await liveControls.getRoomInfo();
          await liveControls.getAreaList();

          // 使用公共方法更新面板
          ui.updateLivePanel(data);

          // 刷新完成提示
          ui.showMessage("数据刷新成功", "success");
          utils.log("面板数据已刷新", "success");
        } catch (error) {
          ui.showMessage("刷新数据失败", "error");
          utils.log("刷新数据失败: " + error, "error");
        }
      });

      // 开始直播按钮事件
      const startLiveBtn = panel.querySelector("#start-live");
      startLiveBtn.addEventListener("click", async () => {
        if (data.liveStatus === 1) return;

        const title = panel.querySelector("#live-title").value;
        const areaId = parseInt(panel.querySelector("#area-id").value);

        data.title = title;
        data.areaId = areaId;
        utils.saveData();

        const result = await liveControls.startLive(title, areaId);
        if (result.status) {
          panel.querySelector(".status-value").className =
            "status-value status-on";
          panel.querySelector(".status-value").textContent = "直播中";
          panel.querySelector(".protocol-value").textContent =
            data.currentProtocol || "RTMP";
          startLiveBtn.className = "btn-disabled";
          panel.querySelector("#stop-live").className = "btn-danger";
          panel.querySelector("#copy-rtmp").className = "btn-success";
          panel.querySelector("#update-live-info").className = "btn-primary";
          utils.log("直播已开始", "success");
        } else {
          ui.showMessage("开播失败: " + result.message, "error");
        }
      });

      // 结束直播按钮事件
      const stopLiveBtn = panel.querySelector("#stop-live");
      stopLiveBtn.addEventListener("click", async () => {
        if (data.liveStatus !== 1) return;

        ui.showConfirm(
          '确定要结束本次直播吗？<br><span style="color:#F44336;font-size:14px;">此操作不可撤销</span>',
          async () => {
            const result = await liveControls.stopLive();
            if (result.status) {
              panel.querySelector(".status-value").className =
                "status-value status-off";
              panel.querySelector(".status-value").textContent = "未开播";
              panel.querySelector(".protocol-value").textContent = "RTMP";
              startLiveBtn.className = "btn-primary";
              stopLiveBtn.className = "btn-disabled";
              panel.querySelector("#update-live-info").className =
                "btn-disabled";
              panel.querySelector("#copy-rtmp").className = "btn-disabled";
              utils.log("直播已结束", "success");
            } else {
              ui.showMessage("停播失败: " + result.message, "error");
            }
          }
        );
      });

      // 复制推流地址按钮
      const copyRtmpBtn = panel.querySelector("#copy-rtmp");
      if (copyRtmpBtn) {
        copyRtmpBtn.addEventListener("click", () => {
          let streamUrl = "";
          let protocol = data.currentProtocol || "RTMP";

          if (protocol === "SRT" && data.srtAddr && data.srtCode) {
            streamUrl = `${data.srtAddr}?streamid=${data.roomId}:${data.srtCode}`;
          } else if (data.rtmpAddr && data.rtmpCode) {
            streamUrl = `${data.rtmpAddr}/${data.roomId}/${data.rtmpCode}`;
            protocol = "RTMP";
          }

          if (streamUrl) {
            const textarea = document.createElement("textarea");
            textarea.value = streamUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            utils.log(`${protocol}推流地址已复制到剪贴板`, "success");
            ui.showMessage(
              `${protocol}推流地址已复制到剪贴板，可直接在OBS中使用`,
              "success"
            );
          } else {
            utils.log("未获取到推流地址，请先开播", "warning");
            ui.showMessage("未获取到推流地址，请先开播", "warning");
          }
        });
      }

      // 更新直播信息按钮
      const updateLiveInfoBtn = panel.querySelector("#update-live-info");
      if (updateLiveInfoBtn) {
        updateLiveInfoBtn.addEventListener("click", async () => {
          if (data.liveStatus !== 1) {
            ui.showMessage("只能在直播中更新直播信息", "warning");
            return;
          }

          const title = panel.querySelector("#live-title").value;
          const areaId = parseInt(panel.querySelector("#area-id").value);

          // 更新直播信息
          const result = await liveControls.updateLiveInfo(title, areaId);
          if (result.status) {
            ui.showMessage("直播信息更新成功", "success");
            // 保存最新数据
            data.title = title;
            data.areaId = areaId;
            utils.saveData();
          } else {
            ui.showMessage("更新失败: " + result.message, "error");
          }
        });
      }
    },
  };

  // 初始化
  async function init() {
    utils.log("B站直播工具初始化", "info");

    // 加载保存的数据
    utils.loadData();

    // 检查是否已登录
    const isLoggedIn = await auth.checkLoginStatus();
    if (isLoggedIn) {
      await auth.getUserInfoFromCookies();
      utils.log("用户已登录，ID: " + data.userId);

      // 获取直播间信息
      if (data.userId && data.userId !== -1) {
        // 获取直播预配置信息
        const preLiveResult = await liveControls.getPreLiveInfo();
        if (preLiveResult.status) {
          utils.log("获取直播预配置信息成功");
        }

        // 获取分区列表
        const areaListResult = await liveControls.getAreaList();
        if (areaListResult.status) {
          utils.log(
            "获取分区列表成功，共" +
              (data.areaList ? data.areaList.length : 0) +
              "个分区"
          );
        }

        // 获取直播间详细信息
        const roomInfoResult = await liveControls.getRoomInfo();
        if (roomInfoResult.status) {
          utils.log("获取直播间详细信息成功，房间ID: " + data.roomId);

          // 确保父分区ID也被设置 - 根据当前子分区找到对应的父分区
          if (data.areaList && data.areaId) {
            for (const parentArea of data.areaList) {
              const childArea = parentArea.list.find(
                (area) => area.id === data.areaId
              );
              if (childArea) {
                data.parentAreaId = parentArea.id;
                break;
              }
            }
            utils.saveData();
          }
        }
      }
    }

    // 创建主界面按钮
    ui.createMainButton();
  }

  // 等待页面加载完成后初始化，使用标志位防止重复初始化
  let initialized = false;
  function safeInit() {
    if (!initialized) {
      initialized = true;
      init();
    }
  }

  if (document.readyState === "complete") {
    safeInit();
  } else {
    window.addEventListener("load", safeInit);
  }
})();

//
