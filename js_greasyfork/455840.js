// ==UserScript==
// @name       IconFont批量下载图标库
// @namespace    https://greasyfork.org/zh-CN/scripts/455840
// @version      0.3
// @description   批量下载图标集合，包括png和svg格式
// @license MIT
// @author      zw95.cn@gmail.com
// @match       *://www.iconfont.cn/collections/detail*
// @match       *://www.iconfont.cn/manage/index*
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require https://greasyfork.org/scripts/475259-elementgetter-alone/code/ElementGetter_Alone.js?version=1250106
// @run-at	     document-end
// @grant        none
// @icon data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/455840/IconFont%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%9B%BE%E6%A0%87%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/455840/IconFont%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%9B%BE%E6%A0%87%E5%BA%93.meta.js
// ==/UserScript==
(function () {
  var cid, pid, size;
  // 从url获取图标集合cid
  var url = window.location.href;
  var downloadUrl;
  var match;
  var matchType = 1; // 1|collection；2|项目

  var div = document.querySelector('body');
  var observer = new MutationObserver(function (mutations) {
    mutations.some(function (mutation) {
      if (mutation.target.querySelector('.block-radius-btn-group')) {
        observer.disconnect();
        init();
        return;
      }
    });
  });
  var config = {
    childList: true,
  };

  function initUrl(){
    console.log('[IconFont Download] 初始化识别...');
    url = window.location.href;
    var collectionReg = /(?<=(\&|\?)cid=)(\d+)/;
    var projectReg = /(?<=(\&|\?)projectId=)(\d+)/;

    if (url.match(collectionReg) != null) {
      match = url.match(collectionReg);
      matchType = 1;
      cid = match[0];
      downloadUrl = 'https://www.iconfont.cn/api/collection/detail.json?id=';
      observer.observe(div, config);
    } else if (url.match(projectReg) != null) {
      match = url.match(projectReg);
      matchType = 2;
      pid = match[0];
      downloadUrl = 'https://www.iconfont.cn/api/project/detail.json?pid=';
      observer.observe(div, config);
    } else{
      console.log('[IconFont Download] 未检测到图标集合cid 或 项目pid，加载失败！');
    }
  }

  // 初始化按钮和事件
  function init() {
    console.log('[IconFont Download] 初始化按钮...');
    var box = document.querySelector('.block-radius-btn-group');
    box.innerHTML = `
    <span title="批量下载png" class="iconfont radius-btn radius-btn-sort">
        <svg t="1670148914928" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1284" xmlns:xlink="http://www.w3.org/1999/xlink" style="padding-bottom:5px; width: 0.8em;height: 0.8em;vertical-align: middle;fill: currentColor;overflow: hidden;"><path d="M513 98C854.752 98 928 171.248 928 513S854.752 928 513 928 98 854.752 98 513 171.248 98 513 98z m0 69.166c-83.864 0-146.53 4.6-194.012 15.148-46.722 10.376-74.39 25.592-92.752 43.92-18.33 18.364-33.546 46.032-43.92 92.754-10.55 47.482-15.15 110.148-15.15 194.012s4.6 146.53 15.148 194.012c10.376 46.722 25.592 74.39 43.92 92.754 18.364 18.328 46.032 33.544 92.754 43.92 47.482 10.548 110.148 15.148 194.012 15.148s146.53-4.6 194.012-15.148c46.722-10.376 74.39-25.592 92.754-43.92 18.328-18.364 33.544-46.032 43.92-92.754 10.548-47.482 15.148-110.148 15.148-194.012s-4.6-146.53-15.148-194.012c-10.376-46.722-25.592-74.39-43.92-92.752-18.364-18.33-46.032-33.546-92.754-43.92-47.482-10.55-110.148-15.15-194.012-15.15z" fill="#ffffff" p-id="1285"></path><path d="M409.25 270.916c76.394 0 138.334 61.94 138.334 138.334s-61.94 138.334-138.334 138.334-138.334-61.94-138.334-138.334 61.94-138.334 138.334-138.334z m0 69.168c-38.214 0-69.166 30.952-69.166 69.166s30.952 69.166 69.166 69.166 69.166-30.952 69.166-69.166-30.952-69.166-69.166-69.166z" fill="#ffffff" p-id="1286"></path><path d="M182.314 707.012a411.68 411.68 0 0 1-3.77-19.02c3.32-3.354 6.848-6.78 10.548-10.202 30.02-27.7 77.156-61.04 133.7-61.04 40.186 0 71.588 9.06 97.456 19.228 9.648 3.77 18.952 7.886 27.044 11.448 2.316 1.036 4.564 2.04 6.674 2.974 10.03 4.358 17.948 7.574 25.316 9.682 12.9 3.666 23.724 3.978 38.214-2.662 16.634-7.642 39.806-25.246 73.212-63.46 75.358-86.08 150.058-108.696 209.402-105.618a199.392 199.392 0 0 1 58.688 12.07c0.036 4.15 0.036 8.334 0.036 12.588 0 22.824-0.346 44.094-1.04 63.91-0.656-0.414-1.278-0.83-1.9-1.28l-0.312-0.208a42.648 42.648 0 0 0-2.56-1.59c-2.488-1.486-6.466-3.666-11.758-5.948-10.58-4.6-25.936-9.476-44.75-10.48-35.76-1.832-90.712 10.1-153.722 82.1-35.76 40.88-66.642 67.094-96.454 80.788-31.954 14.664-60.07 13.696-86.078 6.294-12.104-3.458-23.62-8.3-33.994-12.83a1016.86 1016.86 0 0 1-7.852-3.458c-7.85-3.46-15.286-6.744-23.412-9.926-20.578-8.092-43.194-14.456-72.21-14.456-29.914 0-60.59 18.538-86.77 42.712-12.484 11.516-22.686 23.17-29.776 31.954-1.52 1.868-2.87 3.632-4.08 5.188-7.782-15.356-14.456-34.48-19.852-58.758z" fill="#ffffff" p-id="1287"></path></svg>
        <div class="drop-wrap">
            <span title="32*32 png" class="drop-item png32">32</span>
            <span title="64*64 png" class="drop-item png64">64</span>
            <span title="128*128 png" class="drop-item png128">128</span>
            <span title="256*256 png" class="drop-item png256">256</span>
            <span title="512*512 png" class="drop-item png512">512</span>
        </div>
    </span>
    <span title="批量下载svg" class="iconfont radius-btn radius-btn-sort d-svg">
        <svg t="1670149051370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1506" xmlns:xlink="http://www.w3.org/1999/xlink" style="padding-bottom:5px; width: 0.8em;height: 0.8em;vertical-align: middle;fill: currentColor;overflow: hidden;"><path d="M513 98C854.684 98 928 171.248 928 513S854.684 928 513 928C171.316 928 98 854.752 98 513S171.316 98 513 98z m0 69.166c-83.692 0-146.634 4.6-194.012 15.148-46.688 10.376-74.354 25.592-92.684 43.92-18.33 18.364-33.546 46.032-43.92 92.754-10.72 47.482-15.218 110.148-15.218 194.012s4.496 146.53 15.218 194.012c10.374 46.722 25.59 74.39 43.92 92.754 18.33 18.328 45.996 33.544 92.684 43.92 47.38 10.548 110.32 15.148 194.012 15.148 83.692 0 146.634-4.6 194.012-15.148 46.688-10.376 74.354-25.592 92.684-43.92 18.328-18.364 33.546-46.032 43.92-92.754 10.72-47.482 15.218-110.148 15.218-194.012s-4.496-146.53-15.218-194.012c-10.374-46.722-25.592-74.39-43.92-92.752-18.33-18.33-45.996-33.546-92.684-43.92-47.38-10.55-110.32-15.15-194.012-15.15z" fill="#ffffff" p-id="1507"></path><path d="M337.662 594.928c-6.916 17.74-26.974 26.42-44.958 19.4-17.638-7.02-26.284-27.112-19.366-44.888l32.162 12.726c32.162 12.728 32.162 12.762 32.162 12.762z" fill="#ffffff" p-id="1508"></path><path d="M305.5 582.166l32.162 12.728v-0.346c0.346-0.346 0.346-0.9 0.692-1.626 0.692-1.486 1.73-3.734 3.112-6.57 2.42-5.74 6.226-13.8 11.068-22.964 10.374-18.78 23.86-40.394 39.424-56.51 16.6-16.772 29.742-22.132 39.08-21.51 8.992 0.588 27.666 7.09 52.912 46.41 30.434 47.138 65.708 75.22 106.17 77.882 39.772 2.594 71.588-20.128 93.376-42.26 22.134-22.79 39.424-50.872 50.838-72.106a417.58 417.58 0 0 0 13.486-27.148c1.384-3.46 2.768-6.226 3.46-8.232 0.346-0.968 0.69-1.764 1.036-2.316l0.346-0.692v-0.312s0-0.034-32.162-12.76l32.162 12.726c6.918-17.776-1.728-37.868-19.366-44.89-17.984-7.02-38.04 1.66-44.96 19.402v0.38c-0.344 0.346-0.344 0.9-0.69 1.626-0.692 1.488-1.73 3.734-3.112 6.57-2.42 5.74-6.226 13.8-11.068 22.964-10.374 18.78-23.86 40.394-39.424 56.51-16.6 16.772-29.742 22.132-39.08 21.51-8.992-0.588-27.666-7.09-52.912-46.41-30.434-47.138-65.708-75.22-106.17-77.882-39.772-2.594-71.588 20.128-93.376 42.26-22.134 22.79-39.424 50.872-50.838 72.106a417.58 417.58 0 0 0-13.486 27.148c-1.384 3.46-2.768 6.226-3.46 8.232-0.344 0.968-0.69 1.764-1.036 2.352l-0.346 0.656v0.312s0 0.034 32.162 12.76z" fill="#ffffff" p-id="1509"></path></svg>
    </span> ` + box.innerHTML;
    var png32 = document.querySelector('.png32');
    var png64 = document.querySelector('.png64');
    var png128 = document.querySelector('.png128');
    var png256 = document.querySelector('.png256');
    var png512 = document.querySelector('.png512');
    var svg = document.querySelector('.d-svg');
    png32.onclick = function () { size = 32; downloadImage("png", size) };
    png64.onclick = function () { size = 64; downloadImage("png", size) };
    png128.onclick = function () { size = 128; downloadImage("png", size) };
    png256.onclick = function () { size = 256; downloadImage("png", size) };
    png512.onclick = function () { size = 512; downloadImage("png", size) };
    svg.onclick = function () { size = 512; downloadImage("svg") };
    console.log('[IconFont Download] 初始化按钮完毕');
  }

  // 下载动作
  function downloadImage(type, size) {
    fetch(`${downloadUrl}${matchType == 1 ? cid :pid}`).then(async resp => {
      const { data } = await resp.json();
      const { icons } = data;
      var count = icons.length;
      var name = matchType == 1 ? data.collection?.name : data.project?.name;

      var processIconsFn;

      switch (type) {
        case "png": processIconsFn = processPngIcons(icons);
          break;
        case "svg": processIconsFn = processSvgIcons(icons);
          break;
        default: console.error("[IconFont Download] 错误的处理类型！");
      }

      processIconsFn.then((zip) => {
        setTimeout(() => {
          zip.generateAsync({ type: 'blob' }).then(content => {
            const filename = name + "_" + type + (size != undefined ? "_" + size : "") + ".zip";
            const eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            eleLink.href = URL.createObjectURL(content);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
            console.log(`[IconFont Download] 成功获取${icons.length}/${count}个${type}图标，已保存到${filename}文件`);
          });
        }, 10);
      });
    });
  }

  // 处理png图片
  async function processPngIcons(icons) {
    return await new Promise((reslove) => {
      const zip = new JSZip();
      for (var icon of icons) {
        const { name, show_svg } = icon;
        var content, filename;
        var pngBase64Fun = svgToPng(show_svg);
        pngBase64Fun.then((pngBase64) => {
          filename = `${name}.png`;
          content = base64ToBlob(pngBase64, "image/png"); // 调用base64转图片方法
          zip.file(filename, content);
        });
      }
      reslove(zip);
    });
  }
  //处理svg图片
  async function processSvgIcons(icons) {
    return await new Promise((reslove) => {
      const zip = new JSZip();
      for (var icon of icons) {
        const { name, show_svg } = icon;
        var content, filename;
        // svg
        filename = `${name}.svg`;
        content = show_svg;
        zip.file(filename, content);
      }
      reslove(zip);
    });
  }
  // svg转png
  async function svgToPng(svgXmlStr) {
    var svgBase64Str = "data:image/svg+xml;base64," + window.btoa(svgXmlStr);
    const img = new Image(); // 创建图片容器
    img.src = svgBase64Str;
    return await new Promise((reslove) => {
      // setTimeout(() => {
      img.onload = function () {
        // 图片创建后再执行，转Base64过程
        const canvas = document.createElement('canvas');
        canvas.width = size; //设置好 宽高  不然图片 不完整
        canvas.height = size;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        let pngBase64 = canvas.toDataURL('image/png');
        reslove(pngBase64);
      }
      // }, 100);
    });
  }

  //pngbase64转文件流
  function base64ToBlob(urlData, type) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    let bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }

  initUrl();

})();