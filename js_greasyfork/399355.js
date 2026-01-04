// ==UserScript==
// @name         getchu 名称复制
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  copy name for getchu detail
// @author       You
// @match        http://www.getchu.com/soft.phtml?id=*
// @match        http://www.getchu.com/php/search.phtml?*

// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js

// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue

// @run-at       document-idle
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/399355/getchu%20%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/399355/getchu%20%E5%90%8D%E7%A7%B0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

// getchu 页面名称复制

function addHTML() {
  GM_addStyle(`
    #soft_table {
      position: relative;
    }
    .getchu-button-wrapper {
      position: absolute;
      left: 20px;
      top: 0;
    }
    .btn_default {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      height: 26px;
      padding: 0 10px;
      font-size: 12px;
      border-radius: 3px;
      background: #fafafa;
      border: solid 1px #ccc;
      box-sizing: border-box;
      cursor: pointer;
      outline: none;
      color: #666;
      line-height: 24px;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      font-family: "Microsoft YaHei", "微软雅黑", "SimSun" !important;
    }
    .tooltip {
      position: relative;
    }
    .tooltip:hover::before {
      position: absolute;
      z-index: 1000000;
      padding: 5px 8px;
      color: #fff;
      display: block;
      text-align: center;
      text-decoration: none;
      text-shadow: none;
      text-transform: none;
      letter-spacing: normal;
      font-size: 14px;
      word-wrap: break-word;
      white-space: pre;
      pointer-events: none;
      content: attr(aria-label);
      background: rgba(0, 0, 0, .8);
      border-radius: 3px;
      -webkit-font-smoothing: subpixel-antialiased;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
    }
`);
}

function getImageSrc(src) {
  const image = new Image();
  // 解决跨域 canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.src = src;
  var deferred = $.Deferred();
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    //得到图片的base64编码数据
    const url = canvas.toDataURL("image/png");
    deferred.resolve(url);
  };
  return deferred.promise();
}

function downloadImage(src, name) {
  const image = new Image();
  // 解决跨域 canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    //得到图片的base64编码数据
    const url = canvas.toDataURL("image/png");
    // 生成一个 a 标签
    const a = document.createElement("a");
    // 创建一个点击事件
    const event = new MouseEvent("click");
    // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
    a.download = name || "图片";
    // 将生成的 URL 设置为 a.href 属性
    a.href = url;
    // 触发 a 的点击事件
    a.dispatchEvent(event);
    // return a;
  };
  image.src = src;
}

var convertBase64ToBlob = function (base64) {
  var base64Arr = base64.split(',');
  var imgtype = '';
  var base64String = '';
  if (base64Arr.length > 1) {
    //如果是图片base64，去掉头信息
    base64String = base64Arr[1];
    imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'));
  }
  // 将base64解码
  var bytes = atob(base64String);
  //var bytes = base64;
  var bytesCode = new ArrayBuffer(bytes.length);
  // 转换为类型化数组
  var byteArray = new Uint8Array(bytesCode);
  // 将base64转换为ascii码
  for (var i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i);
  }
  // 生成Blob对象（文件对象）
  return new Blob([bytesCode], { type: imgtype });
};

(function () {
  'use strict';
  addHTML();
  let IN_SEARCH = window.location.href.indexOf('search.phtml') !== -1;
  if (!IN_SEARCH) {
    let time = $('#tooltip-day').text().replace('/', '').replace('/', '');
    let titleA = $('#soft-title').text().replace(/\n/g, '');
    let title = titleA.slice(0, titleA.lastIndexOf('（'));
    let comName = $('#brandsite').text();
    let info = {
      1: `[${time}] ${title}`,
      2: `${comName}`,
      3: `[${time}] [${comName}] ${title}`
    };
    $('#soft_table').append(`
        <div class='getchu-button-wrapper'>
        <button type="button" class="btn_default clipboard-btn" data-type='1'>复制名称</button>
        <button type="button" class="btn_default clipboard-btn" data-type='2'>复制公司/社团名称</button>
        <button type="button" class="btn_default clipboard-btn" data-type='3'>复制全称</button>
        </div>
      `);
    new ClipboardJS('.clipboard-btn', {
      text: function (trigger) {
        let text = info[$(trigger).attr('data-type')];
        $(trigger).addClass('tooltip');
        if (text.length > 250) {
          $(trigger).attr('aria-label', '已复制，但超过路径最大长度');
        } else {
          $(trigger).attr('aria-label', '已复制');
        }
        return text;
      }
    });
  } else {
    let str = '';
    let str2 = '';
    let array = [];
    let imgs = [];
    let comName2 = '';
    let items = $('.display li').each(function (i) {
      let name = $(this).find('.blueb').text();
      let time = $(this).find('#detail_block table tr:eq(1)').html().split('<br>')[1].match(new RegExp(/(?<=：).*?(?=<)/))[0].replace('/', '').replace('/', '');
      let comName = $(this).find('#detail_block .blue').text();
      let IS_PC = $(this).find('.orangeb').text() === '[PCゲーム・アダルト]' ||$(this).find('.orangeb').text() === '[同人・アダルト]';
      comName2 = comName;
      if (IS_PC) {
        let str1 = `[${time}] ${name}`;
        array.push(str1);
        let name2 = `[${time}] ${name}`;
        let src = $(this).find('.lazy').attr('data-original');
        getImageSrc(src).then((base64str) => {
          imgs.push({
            file: base64str,
            name: name2
          });
        })
        $(this).append(`<button type="button" class="btn_default downloadImg" data-text="${name}" data-src="${src}">下载图片</button>`);
        $(this).append(`<button type="button" class="btn_default clipboard-btn name" data-text="${name}">复制名称</button>`);
        $(this).append(`<button type="button" class="btn_default clipboard-btn one" data-text="${name2}">复制[时间]名称</button>`);
        $(this).append(`<button type="button" class="btn_default clipboard-btn com" data-text="${comName}">复制公司名称</button>`);
      }
    });
    array.reverse().map(function (item) {
      str += `${item}\n`;
      str2 += `'${item}',`;
    })
    new ClipboardJS('.clipboard-btn.name', {
      text: function (trigger) {
        $(trigger).addClass('tooltip');
        return $(trigger).attr('data-text');
      }
    });
    new ClipboardJS('.clipboard-btn.one', {
      text: function (trigger) {
        $(trigger).addClass('tooltip');
        return $(trigger).attr('data-text');
      }
    });
    new ClipboardJS('.clipboard-btn.com', {
      text: function (trigger) {
        $(trigger).addClass('tooltip');
        return $(trigger).attr('data-text');
      }
    });
    $('.tocart_button').append(`
        <button type="button" class="btn_default clipboard-btn list" data-type='1'>复制名称集合</button>
        <button type="button" class="btn_default downImgList" data-type='1'>批量下载图片</button>
     `);
    new ClipboardJS('.clipboard-btn.list', {
      text: function (trigger) {
        $(trigger).addClass('tooltip');
        return str;
      }
    });
    new ClipboardJS('.clipboard-btn.list2', {
      text: function (trigger) {
        $(trigger).addClass('tooltip');
        return str2;
      }
    });
    function zip_file() {
      let zip = new JSZip();
      imgs.map((item, i) => {
        let img = zip.folder(item.name);
        img.file(`${item.name}.png`, convertBase64ToBlob(item.file))
      });
      zip.generateAsync({ type: 'blob' })
        .then((content) => {
          saveAs(content, comName2);
        })
    }
    $('.downloadImg').click(function () {
      let name = $(this).attr('data-text');
      let src = $(this).attr('data-src');
      console.log(src)
      downloadImage(src, name);
    })

    $('.downImgList').click(function () {
      zip_file();
    })

  }
})();