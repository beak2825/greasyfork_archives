// ==UserScript==
// @name         【Mod】PHDownloader
// @namespace    http://tampermonkey.net/
// @version      0.0.2-Mod-20240408.02
// @description  Pornhub 视频一键下载 | pornhub.com 【Mod】1、调整样式减少版面占用，2、增加对手机网页的支持
// @author       Hmhm【Mod】by heckles
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.pornhubpremium.com/view_video.php?viewkey=*
// @icon         https://ci.phncdn.com/www-static/favicon.ico
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491333/%E3%80%90Mod%E3%80%91PHDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/491333/%E3%80%90Mod%E3%80%91PHDownloader.meta.js
// ==/UserScript==

/**
 * 一个异步函数，用于检索并显示远程视频地址的下载列表。
 * 该函数会遍历`unsafeWindow`对象，寻找以`flashvars_`开头的属性，
 * 然后从这些属性中提取视频信息，并通过AJAX请求获取视频下载列表，
 * 最后将下载列表插入到页面指定的位置。
 *
 * @returns {void} 该函数没有返回值。
 */

(async function () {
  "use strict";
  let playerdiv; //let可以先不赋值，用在这里
  if (document.querySelector("#player")) {
    playerdiv = document.querySelector("#player");
  } else {
    console.log("安卓");
    playerdiv = document.querySelector(".playerWrapper");
  }
  alert(playerdiv);

  // 获取视频容器元素和标题容器元素
  const videoWrap = document.querySelector(".video-wrapper");
  const signDom = document.querySelector(".video-wrapper .title-container");
  let remoteAddress;

  // 遍历unsafeWindow对象，寻找可能的视频源信息
  for (let key in unsafeWindow) {
    // 查找以'flashvars_'开头的属性，提取视频地址
    if (key.startsWith("flashvars_")) {
      console.log(unsafeWindow[key]);
      let flashvars = unsafeWindow[key];
      let mediaDefinitions = flashvars.mediaDefinitions;
      // 从mediaDefinitions中寻找远程视频地址
      mediaDefinitions.some((item) => {
        if (item.remote) {
          remoteAddress = item.videoUrl;
        }
      });
    }
  }

  // 使用获取到的远程地址通过AJAX请求下载列表
  const list = await $.ajax(remoteAddress).then((data) => {
    return data;
  });

  // 创建一个DOM元素，用于装载下载列表
  const dom = document.createElement("div");
  dom.style = "display:inline-flex;"; //调成一行
  let str =
    '<div style="font-size:17px;">DOWNLOAD LIST</div><ul class="Download_List" style="display:inline-flex;">'; //调字号和调成一行
  // 构建下载列表的HTML字符串
  list.forEach((item) => {
    const { videoUrl, quality } = item;
    console.log(item);
    str += `<li style='padding-inline:16px; font-size:17px;'><a href="${videoUrl}" target="_blank">${quality}P</a></li>`; //调字号
  });
  str += "</ul>";
  dom.innerHTML = str;

  // 创建文档片段，并将下载列表DOM插入其中
  const fragment = document.createDocumentFragment();
  fragment.appendChild(dom);
  // 将下载列表插入到页面指定位置
  videoWrap.insertBefore(fragment, signDom);
})();
