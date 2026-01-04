// ==UserScript==
// @name         1024小助手
// @namespace    https://greasyfork.org/zh-CN/scripts/489614-1024%E5%B0%8F%E5%8A%A9%E6%89%8B
// @version      1.0
// @description  草榴社区一键下载图片和视频、修复部分视频无法播放的问题、图片透明、图片隐藏、隐藏logo、点击图片全屏图片预览、高亮今天的帖子、返回顶部、去除图片点击限制、主题内小图模式和图片下载
// @author       水中雨
// @match        *://*/htm_data/*
// @match        *://*/thread*
// @match        *://*/@*
// @match        http*://*/htm_data/*.html
// @match        http*://*/htm_mob/*.html
// @match        http*://*/read.php?*
// @match        http*://*/search.php?*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/489614/1024%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/489614/1024%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 记录主题图片是否透明的状态
  var isTransparent = false;
  // 记录主题图片是否隐藏的状态
  var isHidden = false;
  // 是否隐藏logo
  let hiddenLogo = false;
  // 是否开启小图
  let isSmall = false;
  // 共用样式
  const cssStr = '.cl-box{position:fixed;top:0;right:0;z-index:9999;background:rgba(255,255,255,.5);padding:10px;border-radius:6px}.cl-download{color:#4fa1ff;cursor:pointer}#ImageView{position:fixed;top:0;right:0;z-index:9999;background:#000;padding:10px;height:100vh;overflow:auto}#ImageView img{width:100%;margin-bottom:20px}#ImageView #close{position:fixed;top:10px;right:26px;z-index:10000;padding:10px;cursor:pointer;background:rgba(255,255,255,.5)}.newTag{border-bottom:1px dotted red;color:red!important}.newPost{color:#ff5722;background:#fafff4}.newPost .tal a{color:#5656ff}h3 a:visited{color:#999!important}h3 a:visited font{color:#8b978c!important}.t tr th a:visited font{color:#8b978c!important}.img-box{margin-left:-10px}.image-container{position:relative;float:left;width:200px;height:200px;margin-bottom:10px;margin-left:10px;overflow:hidden;display:flex;justify-content:center;align-items:center;border:1px solid #ccc}.image-container img{max-width:100%;max-height:100%;object-fit:contain}.image-container b{position:absolute;top:0;left:0;color:#000!important}.image-container span{display:none;position:absolute;top:0;right:0;font-size:12px;color:#000!important;cursor:pointer}.image-container:hover span{display:block}.back-to-top{position:fixed;bottom:20px;right:20px;width:50px;height:50px;background-color:#3498db;border-radius:50%;cursor:pointer;z-index:9999;text-align:center;transition:all .3s ease}.back-to-top::before{content:"↑";color:#fff;font-size:24px;line-height:50px;text-align:center}';

  // const IMGLIST = document.querySelectorAll('#conttpc img');
  // const VIDEOLIST = document.querySelectorAll('#conttpc video');
  // const isDetail = document.querySelector('#conttpc');
  let originalContentClone = document.querySelector('#conttpc')?.cloneNode(true);

  var helper = {
    addCss: function (css) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      document.getElementsByTagName('head')[0].appendChild(style);
    },
    addScript: function (js) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.appendChild(document.createTextNode(js));
      document.body.appendChild(script);
    },
    getCss: function (src) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      document.getElementsByTagName('head')[0].appendChild(link);
    },
    getScript: function (src, onload) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = onload;
      script.src = src;
      document.body.appendChild(script);
    },
    timeFormat: function (data, format) { // eg:data=new Data() eg:format="yyyy-MM-dd hh:mm:ss";
      var o = {
        'M+': data.getMonth() + 1,
        'd+': data.getDate(),
        'h+': data.getHours(),
        'm+': data.getMinutes(),
        's+': data.getSeconds(),
        'q+': Math.floor((data.getMonth() + 3) / 3),
        'S': data.getMilliseconds()
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return format;
    },
    hash: function (url) {
      var hash = url.split('hash=');
      return hash[1].substring(3);
    },
    inurl: function (str) {
      var url = document.location.href;
      return url.indexOf(str) >= 0;
    },
    upVideo: function (video) {
      var iframe = document.createElement('iframe');
      iframe.src = "https://tempssr.github.io/videoHTML/?videoId=" + video.currentSrc;

      // 设置其他需要的属性，例如：width和height
      iframe.width = '100%';
      iframe.height = '506px';
      iframe.style.border = 'none';
      iframe.style.margin = 0;
      iframe.style.padding = 0;
      iframe.style.background = 'transparent';

      // 将video元素替换为新创建的iframe元素
      video?.parentNode?.replaceChild(iframe, video);
    },
    upImg: function (imgItem, index) {
      var imgDom = document.createElement('img');

      // 设置iframe的src属性为video的src属性值
      imgDom.src = imgItem.src;
      imgDom.alt = "鼠标点击，打开相册!";

      // 设置其他需要的属性，例如：width和height
      imgDom.style.maxWidth = '100%';
      imgDom.style.cursor = 'pointer';

      imgDom.onclick = function () {
        openImgAlert();
        setTimeout(() => {
          helper.scrollToElement('img_' + index)
        }, 500);
      };

      // 将video元素替换为新创建的iframe元素
      imgItem?.parentNode?.replaceChild(imgDom, imgItem);
    },
    scrollToElement: function (id) {
      var el = document.getElementById(id);
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    },
    replaceStr: function (str = "") {
      // https://66img.c1c
      return str?.replace(/\.jpg\.[^/]+\//g, '.jpg.dog/')
        .replace(".ca11tbox.moe", ".catbox.moe")
        .replace(".c111atbox.moe", ".catbox.moe")
        .replace("catbox.m22o1e/", "catbox.moe/")
        .replace("2311img.", "23img.")

        .replace(/\66img\.[^/]+\//g, '66img.cc/')
        .replace("66im6g.", "66img.")
        .replace("666img.", "66img.")
        .replace("663img.", "66img.");
    }
  };

  /*-------------------------------------------------------------------------------------------------------------------------------------------*/
  helper.addCss(cssStr);

  reloadImageUrls();
  addOpacityButton();

  // 修复主题内的图片和视频的URL
  function reloadImageUrls () {
    document.querySelectorAll('#conttpc img').forEach((img, index) => {
      img.src = helper.replaceStr(img.src);
      helper.upImg(img, index);
    });
    document.querySelectorAll('#conttpc video').forEach(videoItem => {
      videoItem.src = helper.replaceStr(videoItem.src);
      helper.upVideo(videoItem);
    });
  }

  // 批量下载  [主题内的图片和视频]
  function batchDownloadImages () {
    document.querySelectorAll('#conttpc img').forEach((imgItem, index) => {
      const url = imgItem?.src || '';
      const name = url.substring(url.lastIndexOf('/') + 1);
      const name2 = `[${index + 1}]` + name;
      GM_download(url, name2);
    });

    document.querySelectorAll('#conttpc video').forEach((videoItem, index) => {
      const url = videoItem?.src || '';
      const name = url.substring(url.lastIndexOf('/') + 1);
      const name2 = `[${index + 1}]` + name;
      GM_download(url, name2);
    });
  }


  // 添加操作层
  function addOpacityButton () {
    // 创建一个容器来放置复选框
    var container = document.createElement('div');
    container.className = 'cl-box';
    document.body.appendChild(container);

    // 初始化通用配置
    initConfig(container);

    // 初始化列表页配置
    initListConfig(container);

    // 初始化详情页配置
    document.querySelector('#conttpc') && initDetailConfig(container);
  }

  // 创建复选框
  function createCheckbox (props) {
    const { id, name, checked = false, parObj, } = props;
    var transparentCheckbox = document.createElement('input');
    transparentCheckbox.type = 'checkbox';
    transparentCheckbox.id = id;
    transparentCheckbox.checked = checked;
    var transparentLabel = document.createElement('label');
    transparentLabel.htmlFor = id;
    transparentLabel.textContent = name;
    var div1 = document.createElement('div');
    div1.appendChild(transparentCheckbox);
    div1.appendChild(transparentLabel);
    parObj.appendChild(div1);
    return transparentCheckbox;
  }
  /*****  通用配置  ******/
  function initConfig (container) {
    // 创建复选框1：是否隐藏logo
    const isPageLogo = createCheckbox({
      id: 'isPageLogo',
      name: '是否隐藏logo',
      checked: false,
      parObj: container,
    });

    isPageLogo.addEventListener('change', function () {
      if (this.checked) {
        document.querySelector(".banner").style.display = "none";
      } else {
        document.querySelector(".banner").style.display = "block";
      }
    });
  }

  /*****  列表页配置  ******/
  function initListConfig (container) {

    if (helper.inurl('/thread') || helper.inurl('/@') || helper.inurl('/search.php')) {
      // 高亮今天发表的帖子
      var today = new Date();
      today = helper.timeFormat(today, 'yyyy-MM-dd');
      $('tr.tr3').each(function () {
        var isToday = $(this).find('td>div.f12>.s3');
        if (isToday.length > 0) {
          $(this).addClass('newPost');
        }
      });
    }
  }

  /*****  详情页配置  ******/
  function initDetailConfig (container) {

    // 创建复选框1：主题图片透明
    const transparentCheckbox = createCheckbox({
      id: 'transparentCheckbox',
      name: '主题图片透明',
      parObj: container,
    });

    // 创建复选框2：主题图片隐藏
    const hideCheckbox = createCheckbox({
      id: 'hideCheckbox',
      name: '主题图片隐藏',
      parObj: container,
    });

    // 创建复选框3：纠正错误图片和视频
    const checkCheckbox = createCheckbox({
      id: 'checkCheckbox',
      name: '修复图片',
      parObj: container,
    });

    // 创建复选框4：小图模式
    const imgMinBox = createCheckbox({
      id: 'imgMinBox',
      name: '小图模式',
      parObj: container,
    });



    // 监听复选框的改变事件
    transparentCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // 选中时的操作
        isTransparent = true;
        applyImageSettings();
      } else {
        // 取消选中时的操作
        isTransparent = false;
        applyImageSettings();
      }
    });

    hideCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // 选中时的操作
        isHidden = true;
        applyImageSettings();
      } else {
        // 取消选中时的操作
        isHidden = false;
        applyImageSettings();
      }
    });

    checkCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // 选中时的操作
        reloadImageUrls();
      } else {
        // 取消选中时的操作

      }
    });

    imgMinBox.addEventListener('change', function () {
      if (this.checked) {
        // 选中时的操作
        openMinImg();
      } else {
        // 取消选中时的操作
        reloadContent();
      }
    });


    /*-------------------------------------------------------------------------------------------------------------------------------------------*/
    // 图片下载
    const button = document.createElement('div');
    button.textContent = '⏬主题图片视频一键下载';;
    button.className = 'cl-download';
    button.addEventListener('click', batchDownloadImages);
    container.insertBefore(button, container.firstChild);

    /*-------------------------------------------------------------------------------------------------------------------------------------------*/
  }

  // 设置图片功能： 图片透明+图片隐藏
  function applyImageSettings () {
    [...document.querySelectorAll('#conttpc img'), ...document.querySelectorAll('#conttpc video')].forEach(function (img) {
      if (isTransparent) {
        img.style.opacity = '0.1';
      } else {
        img.style.opacity = '1';
      }

      if (isHidden) {
        img.style.display = 'none';
      } else {
        img.style.display = 'block';
      }
    });
  }

  // 图片预览
  function closeImgAlert () {
    document.body.style.overflow = 'auto';
    document.getElementById("ImageView")?.remove();
  }
  function openImgAlert () {
    var imgList = new Array(0);
    $('#conttpc img').each(function () {
      imgList.push($(this).attr('src'));
    });

    if (imgList.length > 0) {
      ImageView(imgList);
    }
  }
  function ImageView (list = []) {
    // 创建一个容器预览图片
    var container = document.createElement('div');
    container.id = 'ImageView';
    var close = document.createElement('div');
    close.id = 'close';
    close.innerText = "关闭"
    close.onclick = closeImgAlert;
    container.appendChild(close);

    document.body.style.overflow = 'hidden';
    document.body.appendChild(container);

    list.map((item, index) => {
      // 创建一个新的img元素
      var newImg = document.createElement("img");
      newImg.id = 'img_' + index;
      newImg.src = item;
      container.appendChild(newImg);
    });
  }


  /*-------------------------------------------------------------------------------------------------------------------------------------------*/

  // 小图模式 - 清空
  function clearContent () {
    while (document.querySelector('#conttpc').firstChild) {
      document.querySelector('#conttpc').removeChild(document.querySelector('#conttpc').firstChild);
    }
  }

  // 小图模式 - 打开小图模式
  function openMinImg () {
    const conttpcDiv = document.querySelector('#conttpc');
    var imgBox = document.createElement('div');
    imgBox.className = "img-box";
    document.querySelectorAll('#conttpc img').forEach((item, index) => {
      var div = document.createElement('div');
      var imgDom = item.cloneNode(true);;
      var bDom = document.createElement('b');
      var spanDom = document.createElement('span');
      div.className = "image-container";
      bDom.textContent = index + 1;
      spanDom.textContent = "⏬下载";
      spanDom.onclick = function () {
        const url = item?.src || '';
        const name = url.substring(url.lastIndexOf('/') + 1);
        const name2 = `[${index + 1}]` + name;
        GM_download(url, name2);
      }

      div.append(imgDom);
      div.append(bDom);
      div.append(spanDom);
      imgBox.appendChild(div);
    });

    clearContent();
    conttpcDiv.appendChild(imgBox);
  }

  // 小图模式 - 还原
  function reloadContent () {
    clearContent();

    document.querySelector('#conttpc').parentNode.replaceChild(originalContentClone, document.querySelector('#conttpc'));
    setTimeout(() => {
      reloadImgOn();
      originalContentClone = document.querySelector('#conttpc').cloneNode(true);
    }, 350);

  }

  // 小图模式 -  图片事件还原
  function reloadImgOn () {
    document.querySelectorAll('#conttpc img').forEach((img, index) => {
      img.onclick = function () {
        openImgAlert();
        setTimeout(() => {
          helper.scrollToElement('img_' + index)
        }, 500);
      };
    });
  }

  /*-------------------------------------------------------------------------------------------------------------------------------------------*/

  // 返回顶部
  $('body').append(`<div class='back-to-top' onclick="window.scrollTo({top: 0,behavior: 'smooth'});" title="返回顶部"></div>`);

  // 监听esc，关闭全部预览模式
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeImgAlert();
    }

    // 开启和关闭小图
    if (event.key === 'x' || event.key === 'X') {
      if (isSmall) {
        // 选中时的操作
        openMinImg();
      } else {
        // 取消选中时的操作
        reloadContent();
      }
      isSmall = !isSmall;

    }
  });

})();
