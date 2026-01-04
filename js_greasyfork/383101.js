// ==UserScript==
// @name         网站图片（背景图，svg，canvas）抓取预览下载
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      2.7
// @license      MIT
// @description  将站点所有的图片（背景图，svg，canvas）抓取提供预览，直接点击下载，批量打包下载。
// @author       yujinpan
// @include      http*://**
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383101/%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%EF%BC%88%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%8Csvg%EF%BC%8Ccanvas%EF%BC%89%E6%8A%93%E5%8F%96%E9%A2%84%E8%A7%88%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/383101/%E7%BD%91%E7%AB%99%E5%9B%BE%E7%89%87%EF%BC%88%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%8Csvg%EF%BC%8Ccanvas%EF%BC%89%E6%8A%93%E5%8F%96%E9%A2%84%E8%A7%88%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/**
 * 已有功能列表：
 * - 抓取页面上的图片链接，包括 **img，背景图，svg，canvas**
 * - 提供展示抓取的图片的列表快速预览
 * - 提供按钮快速切换抓取的图片展示区
 * - 提供快速下载，点击预览即可下载源图片文件
 * - 提供动态抓取后来加载的图片
 *
 * 2021-03-04
 * - 优化查找性能，平衡每次查找的数量与间隔
 * - 修复部分元素查找失败问题
 * - 修复被破坏的原生代码
 *
 * 2020-3-30
 * - 新增对【图片尺寸过滤】设置的记住功能
 * - 优化查询速度
 *
 * 2020-1-12
 * - 新增【图片尺寸过滤】功能
 * - 修复会出现重复的情况
 *
 * 2019-12-23
 * - 修复 blob 类型的图片展示与下载失败问题
 * - 优化性能，解决多图的卡顿问题
 *
 * 2019-11-17 更新内容：
 * - **新增【批量下载功能】一键打包下载全部图片**
 *
 * 2019-5-17 更新内容：
 * - 修复 svg，canvas 展示与下载问题
 * - 增加暗黑透明样式，黑色，白色图片区分明显
 * - 重构核心代码，分模块执行，提高可读性与维护性
 * - 兼容 iframe 的 btoa 方法报错
 */

(() => {
  // 存放抓取与生成的图片
  const urls = new Set();
  const blobUrls = new Set();
  let timeId;

  // 开启高级模式
  advance();

  // 初始化
  document.addEventListener('DOMContentLoaded', init);

  /**
   * 初始化
   */
  function init() {
    // 创建样式
    createStyle();

    // 创建容器
    const section = document.createElement('section');
    section.id = 'SIR';
    section.innerHTML = `
      <button class="SIR-toggle-button SIR-button">自动获取图片</button>
      <div class="SIR-cover"></div>
      <div class="SIR-main-wrap">
          <ul class="SIR-main">
          </ul>
          <div class="SIR-tools">
            <select class="SIR-filter-mini-button SIR-button">
              <option value ="0">不进行过滤</option>
              <option value ="50">宽高大于 50</option>
              <option value ="100">宽高大于 100</option>
              <option value="150">宽高大于 150</option>
              <option value="200">宽高大于 200</option>
              <option value="300">宽高大于 300</option>
              <option value="400">宽高大于 400</option>
              <option value="600">宽高大于 600</option>
              <option value="800">宽高大于 800</option>
              <option value="1000">宽高大于 1000</option>
            </select>
            <button class="SIR-download-bat-button SIR-button">批量下载（部分可能失败）</button>
          </div>
          <div class="SIR-download-program"></div>
      </div>
    `;
    document.body.append(section);

    // 获取按钮与列表 DOM
    const button = section.querySelector('.SIR-toggle-button');
    const main = section.querySelector('.SIR-main');
    const downloadBat = section.querySelector('.SIR-download-bat-button');
    const filterMini = section.querySelector('.SIR-filter-mini-button');

    // 切换时进行抓取
    let showMain = false;

    const reset = () => {
      main.innerHTML = '';
      urls.clear();
      blobUrls.clear();
      clearTimeout(timeId);
    };

    const initImages = () => {
      imagesReptile(url => {
        !urls.has(url) && main.appendChild(addListItem(url));
      });
    };

    button.onclick = () => {
      showMain = !showMain;
      reset();
      if (showMain) {
        initImages();
      }
      section.classList.toggle('active', showMain);
    };
    downloadBat.onclick = downloadAll;

    // filter
    const filter = localStorage.getItem('SIR_FILTER');
    filter && (filterMini.value = filter);
    filterMini.onchange = (e) => {
      localStorage.setItem('SIR_FILTER', e.target.value);
      reset();
      initImages();
    };
  }

  /**
   * 添加图片列表项
   * @param {String} url
   * @return {HTMLLIElement}
   */
  function addListItem(url) {
    urls.add(url);

    let li, a, img;
    li = document.createElement('li');
    a = document.createElement('a');
    img = document.createElement('img');

    a.target = '_blank';
    a.download = 'image';
    a.title = '点击下载';
    a.href = url;
    img.src = url;

    a.appendChild(img);
    li.appendChild(a);

    return li;
  }

  /**
   * 获取资源列表
   * @param {Function} callback 参数为 url 值
   */
  function imagesReptile(callback) {
    const elements = Array.from(document.querySelectorAll(`
      *:not(head):not(script):not(textarea):not(input):not(meta):not(title):not(style):not(link)
    `));
    const elem = document.querySelector('.SIR-download-program');
    elem.classList.add('active');
    elem.innerHTML = getProgramHTML(0, elements.length);

    let url, index = 0, element, len = elements.length, tagName,
      filterMiniSize = +document.querySelector('.SIR-filter-mini-button').value;
    // 遍历取出 img，backgroundImage，svg，canvas
    (function each() {
      element = elements[index];

      // 过滤小图尺寸
      if (
        (filterMiniSize && element.clientWidth > filterMiniSize && element.clientHeight > filterMiniSize) ||
        !filterMiniSize
      ) {
        tagName = element.tagName.toLowerCase();
        url = '';

        // img 标签
        if (tagName === 'img') {
          try {
            url = getImgUrl(element);
          } catch (e) {
            warnMessage(e);
          }
        }
        // svg
        else if (tagName === 'svg') {
          try {
            url = getSvgImage(element);
          } catch (e) {
            warnMessage(e);
          }
        }
        // canvas
        else if (tagName === 'canvas') {
          try {
            url = getCanvasImage(element);
          } catch (e) {
            warnMessage(e);
          }
        }
        // background-image
        else {
          const backgroundImage = getComputedStyle(element).backgroundImage;
          if (backgroundImage !== 'none' && backgroundImage.startsWith('url')) {
            url = backgroundImage.slice(5, -2);
          }
        }
      }

      url && callback(url);

      elem.innerHTML = getProgramHTML(index + 1, elements.length);

      if (++index < len) {
        // 延迟计算（解决卡顿问题）
        // 每进行 50 次计算就休息一次
        if (Number.isInteger(index / 50)) {
          timeId = setTimeout(() => each(), 0);
        } else {
          each();
        }
      } else {
        elem.classList.remove('active');
      }
    })();
  }

  /**
   * 创建样式
   */
  function createStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      #SIR * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
      }
      #SIR.active .SIR-cover {
          display: block;
      }
      #SIR.active .SIR-main-wrap {
          display: block;
      }
      #SIR .SIR-button {
          visibility: visible;
          display: inline-block;
          height: 22px;
          line-height: 22px;
          margin-right: 10px;
          padding: 0 3px;
          opacity: 0.5;
          background: white;
          font-size: 13px;
      }
      #SIR .SIR-button:hover {
          opacity: 1;
      }
      #SIR .SIR-toggle-button {
          position: fixed;
          right: 0;
          bottom: 0;
          z-index: 99999;
      }
      #SIR .SIR-cover,
      #SIR .SIR-main-wrap {
          display: none;
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
      }
      #SIR .SIR-cover {
          z-index: 99997;
          background: rgba(255, 255, 255, 0.7);
      }
      #SIR .SIR-main-wrap {
          z-index: 99998;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.7);
      }
      #SIR .SIR-main {
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          list-style-type: none;
      }
      #SIR .SIR-main > li {
          box-sizing: border-box;
          width: 10%;
          min-width: 168px;
          min-height: 100px;
          max-height: 200px;
          border: 2px solid transparent;
          box-shadow: 0 0 1px 1px white;
          background: rgba(0, 0, 0, 0.5);
          overflow: hidden;
      }
      #SIR .SIR-main > li > a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
      }
      #SIR .SIR-main > li:hover img {
          transform: scale(1.5);
      }
      #SIR .SIR-main > li img {
          transition: transform .3s;
          max-width: 100%;
      }
      #SIR .SIR-tools {
          position: fixed;
          bottom: 0;
          right: 100px;
          display: flex;
      }
      #SIR .SIR-download-program {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background-color: inherit;
          border: 1px solid white;
          font-size: 20px;
          display: none;
      }
      #SIR .SIR-download-program.active {
          display: flex;
      }
    `;
    document.head.append(style);
  }

  /**
   * 获取 svg 图片链接
   * @param {Element} svg svg 元素
   */
  function getSvgImage(svg) {
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    try {
      return 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
    } catch (e) {
      warnMessage('svg创建失败');
      return '';
    }
  }

  /**
   * 获取 canvas 图片链接
   * @param {HTMLCanvasElement} canvas canvas 元素
   */
  function getCanvasImage(canvas) {
    return canvas.toDataURL_();
  }

  /**
   * 获取 img 的链接
   * @description
   * 兼容 srcset 属性
   * @param {HTMLImageElement} element 图片元素
   */
  function getImgUrl(element) {
    let url;

    // 兼容 srcset 属性
    if (element.srcset) {
      const srcs = element.srcset.split(' ');
      url = srcs[0];
    } else {
      url = element.src;
      // blob 类型可能被 revoke，这里生成 canvas
      if (!blobUrls.has(url) && url.startsWith('blob')) {
        blobUrls.add(url); // 存储源地址用于判断是否已经生成，因为生成的已经转换了
        const canvas = createCanvasWithImg(element);
        url = getCanvasImage(canvas);
      }
    }

    return url;
  }

  /**
   * 创建 img 元素的 canvas
   * @param {HTMLImageElement} imgElem
   */
  function createCanvasWithImg(imgElem) {
    const canvas = document.createElement('canvas');
    canvas.width = imgElem.naturalWidth || imgElem.width;
    canvas.height = imgElem.naturalHeight || imgElem.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElem, 0, 0);
    return canvas;
  }

  /**
   * 获取链接的图片文件
   * @param url
   * @return {Promise<{file, suffix}>}
   */
  function getImg(url) {
    return new Promise((resolve) => {
      // 如果是链接，就先加载图片，再存文件
      if (/((\.(png|jpg|jpeg|gif|svg)$)|^(http|\/|file|blob))/.test(url)) {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'blob';
        request.onload = function () {
          let suffix = url.match(/\.[a-zA-Z]+$/);
          suffix = suffix ? suffix[0] : '.png';
          resolve({file: request.response, suffix});
        };
        request.onerror = function (e) {
          warnMessage('图片获取失败', url, e);
          resolve(null);
        };
        request.send();
      } else if (url.includes('base64')) {
        let suffix = '.' + url.replace('data:image/', '').match(/^[a-zA-Z]*/)[0];
        resolve({
          file: dataURLtoFile(url, 'image' + suffix),
          suffix
        });
      } else {
        warnMessage('图片类型无法解析，请联系插件作者', url);
        resolve(null);
      }
    });
  }

  /**
   * 将 base64 转换为文件
   * @param dataUrl
   * @param filename
   * @return {File}
   */
  function dataURLtoFile(dataUrl, filename) {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  /**
   * 批量下载所有文件
   */
  function downloadAll() {
    const elem = document.querySelector('.SIR-download-program');
    if (elem && !elem.classList.contains('active')) {
      let total = 0;
      let successCount = 0;
      const promiseArr = Array.from(urls).map((item) => {
        return getImg(item).then(res => {
          successCount++;
          elem.innerHTML = getProgramHTML(successCount, total);
          return res;
        });
      });
      total = promiseArr.length;
      if (total) {
        elem.classList.add('active');
        elem.innerHTML = getProgramHTML(successCount, total);
        Promise.all(promiseArr).then(res => {
          res = res.filter(item => item);
          const zip = new JSZip();
          res.forEach((item, index) => zip.file('image' + index + item.suffix, item.file));
          zip.generateAsync({type: 'blob'})
          .then(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = 'images.zip';
            a.href = url;
            a.click();
            elem.classList.remove('active');
            URL.revokeObjectURL(url);
          });
        }, () => {
          alert('下载失败');
          elem.classList.remove('active');
        });
      } else {
        alert('暂无图片');
      }
    }
  }

  /**
   * 获取下载进度 HTML
   * @param program
   * @param total
   * @return {string}
   */
  function getProgramHTML(program, total) {
    return `<b>${program}</b> / ${total}`;
  }

  /**
   * 警告信息
   * @param params
   */
  function warnMessage(...params) {
    console.warn('[自动获取图片]:', ...params);
  }

  function advance() {
    // `toDataURL` was broke
    HTMLCanvasElement.prototype.toDataURL_ = HTMLCanvasElement.prototype.toDataURL;

    // remove tainted source
    const canvasContextPrototype = CanvasRenderingContext2D.prototype;
    canvasContextPrototype.drawImage_ = CanvasRenderingContext2D.prototype.drawImage;
    canvasContextPrototype.drawImage = function () {
      const { src, crossOrigin } = arguments[0];
      if (src.startsWith('http') && location.origin !== src.slice(0, src.indexOf('/', 8)) && !crossOrigin) {
        console.log('%c 【自动获取图片】站点正在加载无法下载的图片，请自行访问该链接下载：', 'color: orange;', src);
        return;
      }
      this.drawImage_.apply(this, arguments);
    };
  }
})();
