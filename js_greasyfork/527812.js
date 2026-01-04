// ==UserScript==
// @name         B站视频缩略图预览
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在B站视频页面显示视频缩略图预览
// @author       Ts8zs
// @match        https://www.bilibili.com/video/*
// @match   https://www.bilibili.com/bangumi/play/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license GPL
// @connect      bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/527812/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527812/B%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
(function () {
  "use strict";
  let responseExample = {
    code: 0,
    message: "0",
    ttl: 1,
    data: {
      pvdata: "//boss.hdslb.com/videoshotpvhdboss/28533788210_jgdo7b.bin",
      img_x_len: 10,
      img_y_len: 10,
      img_x_size: 480,
      img_y_size: 270,
      image: [
        "//bimp.hdslb.com/videoshotpvhdboss/28533788210_jgdo7b-0001.jpg",
        "//bimp.hdslb.com/videoshotpvhdboss/28533788210_jgdo7b-0002.jpg",
        "//bimp.hdslb.com/videoshotpvhdboss/28533788210_jgdo7b-0003.jpg",
      ],
      index: [0, 0, 9, 14, 22, 31, 38, 45, 52, 60, 68, 76, 85, 92, 100],
      video_shots: {},
      indexs: {},
    },
  };


  const video = document.querySelector("video");
  const offset = 40;
  let bottomoffset = 0;
  // 添加缩略图样式
  GM_addStyle(`
        #bili-thumbnail-preview {
            padding: 10px;
            border-radius: 4px;
        }
        .thumbnail-item {
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            transition: transform 0.2s;
            height:${offset}px;
          filter: contrast(1.3);
        }
        .thumbnail-fullsizeitem {
            position: relative;
            border-radius: 4px;
            overflow: hidden;
          display:inline;
        }
        .thumbnail-item:hover {
/*               transform: translateY(-3px); */
/*               height:100%; */
        }
    `);

  // 等待页面初始化完成
  const waitForInitialState = () =>
    new Promise((resolve) => {
      const check = () => {
        const state = window.__INITIAL_STATE__;
        if (state && state.videoData && state.videoData.aid) {
          resolve(state);
          aid=state.videoData.aid;
          bvid=state.videoData.bvid;
          cid=state.videoData.cid;
          main();
        } else {
          setTimeout(check, 5000);
        }
      };
      check();
    });

  // 获取视频截图数据
  async function fetchVideoShots() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.bilibili.com/x/player/videoshot?aid=${aid}&index=1`,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.code === 0) {
              resolve(data.data);
            } else {
              console.error("请求失败:", data.message);
              reject(data.message);
            }
          } catch (e) {
            console.error("解析响应数据失败:", e);
            reject("解析响应数据失败");
          }
        },
        onerror: () => {
          console.error("请求失败: 网络错误");
          reject("请求失败: 网络错误");
        },
      });
    });
  }

  function jumpto(time) {
    video.currentTime = time;
  }

  // 创建缩略图容器
  function createContainer() {
    const container = document.createElement("div");
    container.id = "bili-thumbnail-preview";
    container.innerHTML = `
      <button id="load-thumbnails" style="margin: 10px; padding: 5px 10px; background: #00a1d6; color: #fff; border: none; border-radius: 4px; cursor: pointer;">加载字幕缩略图</button>
      字幕偏移: <input id="bottomoffset" value="0" type="range" min="0" max="100" step="1">
      <button id="load-fullsizethumbnails" style="margin: 10px; padding: 5px 10px; background: #00a1d6; color: #fff; border: none; border-radius: 4px; cursor: pointer;">加载全尺寸缩略图</button>
    `;
    return container;
  }

  // 创建单个缩略图元素
  function createThumbnailItem(
    imgUrl,
    x,
    y,
    width,
    height,
    time,
    isFullSize = false
  ) {
    let offsety = isFullSize ? y : y + height - offset - bottomoffset;
    const container = document.createElement("div");
    container.className = isFullSize
      ? "thumbnail-fullsizeitem"
      : "thumbnail-item";
    container.innerHTML = `
  <img class="thumbnail-img" time="${time}" src="${
      imgUrl.startsWith("//") ? `https:${imgUrl}` : imgUrl
    }" style="object-position: -${x}px -${offsety}px; width: ${width}px; height: ${height}px; object-fit: none;">
`;
    container.querySelector(".thumbnail-img").addEventListener("click", () => {
      const targetTime = parseFloat(
        container.querySelector(".thumbnail-img").getAttribute("time")
      );
      if (!isNaN(targetTime) && video) {
        jumpto(targetTime); // 跳转到指定时间点
      }
    });
    return container;
  }

  // 加载缩略图
  async function loadThumbnails(isFullSize = false) {
    //清理全部 thumbnail-grid
    if (document.getElementsByClassName("thumbnail-grid")) {
      document.getElementsByClassName("thumbnail-grid").forEach((item) => {
        item.remove();
      });
    }

    if (!isFullSize) {
      bottomoffset = document.getElementById("bottomoffset").value;
    }
    const shotsData = await fetchVideoShots();
    const grid = document.createElement("div");
    grid.className = "thumbnail-grid";
    grid.idName = "thumbnail-grid";

    let index = 1;
    shotsData.image.forEach((imgUrl) => {
      for (let y = 0; y < shotsData.img_y_len; y++) {
        for (let x = 0; x < shotsData.img_x_len; x++) {
          if (index >= shotsData.index.length) {
            return; // 如果 index 超出范围，停止生成缩略图
          }
          const item = createThumbnailItem(
            imgUrl,
            x * shotsData.img_x_size,
            y * shotsData.img_y_size,
            shotsData.img_x_size,
            shotsData.img_y_size,
            shotsData.index[index], // 使用 index 数组中的值作为 time
            isFullSize
          );
          grid.appendChild(item);
          index++;
        }
      }
    });

    container.appendChild(grid);
  }

  let container; // 将 container 定义为全局变量

  // 主执行函数
  async function main() {
    try {
            let targetNode = document.querySelector("#commentapp");
      //如果没有commentapp 选择comment-module
      if (!targetNode) {
         targetNode = document.querySelector("#comment-module");
      }
      container = createContainer(); // 在 main 函数中初始化 container

      if (targetNode) {
        targetNode.parentNode.insertBefore(container, targetNode);
      }
      document
        .getElementById("load-fullsizethumbnails")
        .addEventListener("click", () => loadThumbnails(true));

      document
        .getElementById("load-thumbnails")
        .addEventListener("click", () => loadThumbnails(false));
    } catch (error) {
      console.error("[缩略图脚本错误]", error);
    }
  }
  setTimeout(main, 6000);
})();
