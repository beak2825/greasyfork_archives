// ==UserScript==
// @name         KomifloDownloader
// @namespace    https://github.com/ans/komiflo-downloader
// @version      0.3
// @license      GPL-3.0
// @author       Ans
// @description  Manga downloader for komiflo.com
// @icon         https://komiflo.com/assets/img/favicon.ico
// @homepageURL  https://github.com/ans/komiflo-downloader
// @supportURL   https://github.com/ans/komiflo-downloader
// @match        https://komiflo.com/comics/*/read/*
// @match        https://komiflo.com/#!/comics/*/read/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/loglevel@1.9.2/dist/loglevel.min.js
// @require      https://unpkg.com/loglevel-plugin-prefix@0.8.4/dist/loglevel-plugin-prefix.min.js
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @downloadURL https://update.greasyfork.org/scripts/513665/KomifloDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513665/KomifloDownloader.meta.js
// ==/UserScript==

// 日志打印配置
log.setLevel('debug');
prefix.reg(log);
prefix.apply(log, {
  template: '[%t %l]',
  timestampFormatter: function(date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1') + '.' + date.getMilliseconds();
  },
});

(async function(logger, axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // 页面会 hack 掉部分对象的方法，以阻上脚本使用这些方法，这里通过代理的方式阻止页面修改这些对象
  proxyHackObj();

  // collect essential params
  const { cid } = window.location.href.match(/comics\/(?<cid>\d+)\/read\/page\//).groups;
  logger.debug('cid:', cid);

  let userData, contentData, contentArray, imgsArray;
  // request user data
  try {
    userData = await requestUserData();
    logger.debug('userData:', userData);
  } catch(err) {
    logger.error('request user data error:', err);
    return;
  }
  // request content data
  try {
    contentData = await requestContentData(cid);
    logger.debug('contentData:', contentData);
  } catch(err) {
    logger.error('request content data error:', err);
    return;
  }
  // decode content data to content array
  try {
    contentArray = decodeContentData(userData.emailEncoded, contentData.keyHash, contentData.keyData);
    logger.debug('contentArray:', contentArray);
  } catch(err) {
    logger.error('decode content data error:', err);
    return;
  }
  // initialize imgs info to imgs array
  try {
    imgsArray = initImgsInfo(contentData.imgs, contentArray);
  } catch(err) {
    logger.error('init imgs info error:', err);
    return;
  }

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imgsArray.length,
    getImagePromises,
    title: contentData.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imgsArray
      .slice(startNum - 1, endNum)
      .map(imgInfo => getDecryptedImage(imgInfo)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(imgInfo) {
    return new Promise(async (resolve, reject) => {
      let imageArrayBuffer;
      try {
        imageArrayBuffer = await fetchImage(imgInfo.src);
      } catch(err) {
        logger.error('fetch image error:', err);
      }

      const image = document.createElement('img');
      const imageDataStr = new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
      image.src = 'data:image/jpg;base64,' + window.btoa(imageDataStr);
      image.onload = function() {
        // create canvas
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = imgInfo.width;
        canvas.height = imgInfo.height;

        // draw pieces on correct position
        for (const { sx, sy, dx, dy, width, height } of imgInfo.ops) {
          ctx.drawImage(this, sx, sy, 128, 128, dx, dy, 128, 128);
        }

        canvas.toBlob(resolve);
      }
      image.onerror = function(err) {
        logger.error('image load error:', err);
        reject(err);
      }
    });
  }

  function fetchImage(imgUrl) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: imgUrl,
        responseType: 'arraybuffer',
        onload: (res) => {
          if(res.status === 200) {
            resolve(res.response);
          } else {
            reject(new Error(`HTTP status error: ${res.status}`));
          }
        },
        onerror: (err) => {
          reject(err);
        }
      });
    });
  }

  async function requestUserData() {
    const userData = await axios({
      method: 'GET',
      url: 'https://api.komiflo.com/session/user',
      // 允许携带 cookie 或其他凭证信息
      withCredentials: true,
    }).then(res => {
      const data = res.data;
      return {
        email: data.user.email,
        emailEncoded: window.btoa(data.user.email),
      };
    });

    if(!userData.email) {
      throw new Error('email is null');
    }
    return userData;
  }

  async function requestContentData(cid) {
    const contentData = await axios({
      method: 'GET',
      url: `https://api.komiflo.com/content/id/${cid}`,
      // 允许携带 cookie 或其他凭证信息
      withCredentials: true,
    }).then(res => {
      const data = res.data.content;
      return {
        title: data.data.title,
        cdn: data.cdn_public,
        keyData: data.key_data,
        keyHash: data.key_hash,
        imgs: data.imgs,
      };
    });

    if(!contentData.title) {
      throw new Error('title is null');
    }
    if(!contentData.keyData || !contentData.keyHash) {
      throw new Error('key_data or key_hash is null');
    }
    if(!contentData.cdn) {
      throw new Error('cdn is null');
    }
    const imgCdn = contentData.cdn.replace("resized", "scrambled");
    for(let imgKey in contentData.imgs) {
      const imgItem = contentData.imgs[imgKey];
      const imgName = imgItem.filename.replace(/\.(jpg|png)$/i, "");
      imgItem.image = imgCdn.concat('/', imgName);
    }
    return contentData;
  }

  function decodeContentData(emailEncoded, keyHash, keyData) {
    const cKey = emailEncoded + keyHash + '76c065bbe09bdbf3663a28dd74a22bcb40dac7cc2386a2b7a4c69774ae1f461a';
    const cData = window.atob(keyData);

    let results = [];
    for(let i=0; i<cData.length; ++i) {
      var textCharCode = cData.charCodeAt(i);
      var keyCharCode = cKey.charCodeAt(i % cKey.length);
      results.push(String.fromCharCode(textCharCode ^ keyCharCode));
    }

    const contentStr = results.join('');
    if(!contentStr) {
      throw new Error('contentStr is empty');
    }
    const contentArray = JSON.parse(contentStr);
    return contentArray;
  }

  function initImgsInfo(imgs, contentArray) {
    const tile = 128;
    let imgsArray = [];

    for(let key in contentArray) {
      const imgInfo = imgs[key];
      const ckArray = contentArray[key];

      // 从 contentArray 数组中提取种子值、宽度和高度
      const ckSeed = ckArray[2];
      const ckWidth = ckArray[0] ^ ckSeed;
      const ckHeight = ckArray[1] ^ ckSeed;
      // // 图像最长边的长度
      const longSideLen = Math.max(ckWidth, ckHeight);
      const shortSideLen = Math.min(ckWidth, ckHeight);
      const height = Math.floor(longSideLen / tile) * tile;
      const ratio = longSideLen / height;
      const width = Math.round(shortSideLen / ratio);

      imgInfo.seed = ckSeed;
      imgInfo.width = width;
      imgInfo.height = height;
    }

    for(let key in imgs) {
      const imgInfo = imgs[key];
      const imgWidth = imgInfo.width || 1360;
      const imgHeight = imgInfo.height || 1920;

      // 图像是否为横图的判断标记
      const isWideImage = (imgWidth / imgHeight) > 1;
      // 图像最短边的长度
      const shortSideLen = isWideImage ? imgHeight : imgWidth;
      // 短边的对齐偏移量
      const shortSideOffset = Math.ceil(shortSideLen / tile) * tile - shortSideLen;
      // 列数，即图像水平方向上的分块数
      const column = Math.ceil(imgWidth / tile);
      // 行数，即图像垂直方向上的分块数
      const row = Math.ceil(imgHeight / tile);
      // 图像总的分块数
      const blocksNum = column * row;

      let opsArray = shuffleArray(blocksNum, imgInfo.seed);
      logger.debug('opsArray:', imgInfo.seed, opsArray);
      opsArray = opsArray.map((value, index) => {
        // 图像方块在源图像中的列索引
        const sColumnIndex = value % column;
        // 图像方块在源图像中的行索引
        const sRowIndex = (value - sColumnIndex) / column;
        // 图像方块在绘制目标中的列索引
        const dColumnIndex = index % column;
        // 图像方块在绘制目标中的行索引
        const dRowIndex = (index - dColumnIndex) / column;

        let sx = sColumnIndex * tile;
        let sy = sRowIndex * tile;
        let dx = dColumnIndex * tile;
        let dy = dRowIndex * tile;
        // 判断是否在边界：如果宽图，则检查最后一行，否则检查最后一列
        const isOnEdge = isWideImage ? dRowIndex === row - 1 : dColumnIndex === column - 1;
        // 如果在边界，则调整坐标以裁剪块大小
        if(isOnEdge) {
          dx -= isWideImage ? 0 : shortSideOffset;
          dy -= isWideImage ? shortSideOffset : 0;
        }

        return {
            sx, sy, dx, dy,
            width: tile,
            height: tile,
        };
      });
      imgsArray.push({
        src: imgInfo.image,
        width: imgInfo.width,
        height: imgInfo.height,
        ops: opsArray,
      });
    }

    logger.debug('imgsArray:', imgsArray);
    return imgsArray;
  }

  function shuffleArray(length, seed) {
    let seqArray = Array.from({ length }, (value, index) => index);

    // 创建带种子的随机数生成器实例
    const randomGenerator = createRandomGenerator(seed);

    // 复制数组以免更改原始数组
    const shuffledArray = seqArray.slice();

    // 遍历数组，进行洗牌操作
    for (let remaining = shuffledArray.length; remaining > 0; remaining--) {
        // 生成一个 0 到 remaining-1 范围内的随机索引
        const randomIndex = Math.floor(randomGenerator.random() * remaining);

        // 交换当前元素和随机选中的元素
        [shuffledArray[remaining - 1], shuffledArray[randomIndex]] = 
        [shuffledArray[randomIndex], shuffledArray[remaining - 1]];
    }

    console.log(JSON.stringify(shuffleArray));
    return shuffledArray;
  }

  function createRandomGenerator(seed) {
    return function() {
      // 随机数状态数组的大小
      const stateSize = 48;
      // 状态数组的当前位置
      let stateIndex = stateSize;
      // 创建随机数状态数组
      let stateArray = new Array(stateSize);

      // 当前索引
      let currentIndex = 1;

      // 进位
      let carry = 0;

      // 初始化伪随机数生成器方法
      const numberRandomFunc = new NumberRandomFunc();
      // 填充初始状态
      for (let i=0; i<stateSize; i++) {
        stateArray[i] = numberRandomFunc(Math.random());
      }

      const random = () => {
        stateIndex ++;
        // 如果超过随机数状态数组的长度，则重置为 0
        if(stateIndex >= stateSize) stateIndex = 0;

        let calculatedValue = 1768863 * stateArray[stateIndex] + 2.3283064365386963e-10 * currentIndex;
        // 更新 currentIndex 为 calculatedValue 的整数部分
        currentIndex = 0 | calculatedValue;

        stateArray[stateIndex] = calculatedValue - currentIndex;
        return stateArray[stateIndex];
      };

      const updateState = (...args) => {
        for(let i=0; i<args.length; i++) {
          for (let j=0; j<stateSize; j++) {
            stateArray[j] -= numberRandomFunc(args[i]);
            if(stateArray[j] < 0) {
              stateArray[j] += 1;
            }
          }
        }
      };

      const generateRandomInt = (max) => {
        return Math.floor(max * (random() + 11102230246251565e-32 * (2097152 * random() | 0)));
      };

      generateRandomInt.string = (length) => {
        let result = '';
        for(let i=0; i<length; i++) {
          // 生成ASCII字符
          result += String.fromCharCode(33 + generateRandomInt(94));
        }
        return result;
      };

      generateRandomInt.cleanString = (input) => {
        return input
            .replace(/(^\s*)|(\s*$)/g, '')  // 去除首尾空格
            .replace(/[\x00-\x1F]/g, '')    // 去除控制字符
            .replace(/\n /g, '\n');         // 去除换行后的空格
      };

      generateRandomInt.hashString = (input) => {
        input = generateRandomInt.cleanString(input);
        numberRandomFunc(input);

        for(let i=0; i<input.length; i++) {
          const charCode = input.charCodeAt(i);
          for (let j=0; j<stateSize; j++) {
            stateArray[j] -= numberRandomFunc(charCode);
            if(stateArray[j] < 0) {
              stateArray[j] += 1;
            }
          }
        }
      };

      generateRandomInt.seed = (input) => {
        if(input == null) {
          input = Math.random();
        }
        if(typeof input !== 'string') {
          input = JSON.stringify(input) || '';
        }
        generateRandomInt.initState();
        generateRandomInt.hashString(input);
      };

      generateRandomInt.addEntropy = (...args) => {
        const entropyString = `${Date.now()}${args.join(' ')}${Math.random()}`;
        updateState(carry++ + entropyString);
      };

      generateRandomInt.initState = () => {
        numberRandomFunc();
        for (let i=0; i<stateSize; i++) {
            stateArray[i] = numberRandomFunc(' ');
        }
        currentIndex = 1;
        stateIndex = stateSize;
      };
      if (seed !== undefined) {
        generateRandomInt.seed(seed); // 如果提供种子，进行初始化
      }

      generateRandomInt.done = () => {
        numberRandomFunc = null;
      };

      generateRandomInt.range = (max) => {
        // 生成范围内的随机数
        return generateRandomInt(max);
      };

      generateRandomInt.random = () => {
        // 生成0到1之间的随机数
        return generateRandomInt(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
      };

      generateRandomInt.floatBetween = (min, max) => {
        // 生成指定范围内的随机浮点数
        return generateRandomInt.random() * (max - min) + min;
      };

      generateRandomInt.intBetween = (min, max) => {
        // 生成指定范围内的随机整数
        return Math.floor(generateRandomInt.random() * (max - min + 1)) + min;
      };

      return generateRandomInt;
    }();
  }

  /** 伪随机数生成器方法 */
  function NumberRandomFunc() {
    // 初始的种子值
    let seed = 4022871197;
    return function(input) {
      if(input) {
        // 如果提供了输入参数，则将输入转换为字符串
        input = input.toString();
        for(let i=0; i<input.length; i++) {
          // 获取当前字符的 Unicode 编码并更新种子值
          var randomValue = 0.02519603282416938 * (seed += input.charCodeAt(i));
          // 将种子值转换为无符号整数
          randomValue -= seed = randomValue >>> 0;
          // 更新种子值
          seed = (randomValue *= seed) >>> 0;
          // 确保种子值在有效范围内
          seed += 4294967296 * (randomValue -= seed);
        }
        // 返回归一化的随机数
        return 2.3283064365386963e-10 * (seed >>> 0);
      } else {
        // 如果没有提供输入参数，则重置种子值
        seed = 4022871197;
      }
    }
  }

  function proxyHackObj() {
    // 定义需要阻止被hack的对象的数组
    const preventObjs = [
      window.HTMLDocument.prototype,
      window.HTMLCanvasElement.prototype,
      window.CanvasRenderingContext2D.prototype,
      window.HTMLIFrameElement.prototype,
      window.URL,
    ];

    // 保存原始 Object.defineProperties 方法
    const originalDefineProperties = Object.defineProperties;
    // 使用 Proxy 创建代理，以阻止这些对象的属性被重新定义或修改
    Object.defineProperties = new Proxy(originalDefineProperties, {
      apply(target, thisArg, args) {
        const [ obj ] = args;
        // 检查传入的对象是否为要阻止的对象
        if(preventObjs.includes(obj)) {
          // 如果是，则返回对象本身（不进行重新定义或修改）
          return obj;
        } else {
          // 否则，调用原始的 Object.defineProperties 方法进行重新定义或修改
          return Reflect.apply(target, thisArg, args);
        }
      }
    });

    // 保存原始 Object.freeze 方法
    const originalFreeze = Object.freeze;
    // 使用 Proxy 创建代理，以阻止这些对象被冻结
    Object.freeze = new Proxy(originalFreeze, {
      apply(target, thisArg, args) {
        const [ obj ] = args;
        // 检查传入的对象是否为要阻止的对象
        if(preventObjs.includes(obj)) {
          // 如果是，则返回对象本身（不进行冻结）
          return obj;
        } else {
          // 否则，调用原始的 Object.freeze 方法进行冻结
          return Reflect.apply(target, thisArg, args);
        }
      }
    });
  }

})(log, axios, JSZip, saveAs, ImageDownloader);
