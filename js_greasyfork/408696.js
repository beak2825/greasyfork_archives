// ==UserScript==
// @name         BVHover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站视频评论区BV信息显示
// @author       KeJun
// @include      *://www.bilibili.com/video/BV*
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @require      https://unpkg.com/animejs@2.2.0/anime.min.js
// @downloadURL https://update.greasyfork.org/scripts/408696/BVHover.user.js
// @updateURL https://update.greasyfork.org/scripts/408696/BVHover.meta.js
// ==/UserScript==
"use strict";
const api = {
  view: "https://api.bilibili.com/x/web-interface/view?bvid=",
  videoshot: "https://api.bilibili.com/x/player/videoshot?bvid=",
};
const log = console.log.bind(console, "[BVHOVER]:");

function throttle(fun, delay) {
  let last, deferTimer;
  return function (args) {
    let that = this;
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fun.apply(that, _args);
      }, delay);
    } else {
      last = now;
      fun.apply(that, _args);
    }
  };
}

// 过滤未添加事件的元素
function getBVATag(comment) {
  return Array.from(comment.querySelectorAll("a")).filter((v) => !v.instance);
}

// 获取数据设置事件等乱七八糟
async function getDataAndSetEvent(ele) {
  const bvid = ele.innerText;
  if (!/^(bv|BV)[a-zA-Z0-9]{10}$/.test(bvid)) return;
  ele.instance = tippy(ele, {
    content: "加载中...",
    interactiveBorder: 5,
    interactive: true,
  });
  try {
    const { data: viewData } = await (await fetch(`${api.view}${bvid}`)).json();
    const { data: videoshotData } = await (
      await fetch(`${api.videoshot}${bvid}`)
    ).json();
    const { title, pic: image } = viewData;
    const [shotImage] = videoshotData.image;
    const boxEl = document.createElement("div");
    const titleEl = document.createElement("marquee");
    const imageEl = document.createElement("div");
    imageEl.style.backgroundImage = `url(${image})`;
    imageEl.style.backgroundSize = "cover";
    imageEl.style.width = boxEl.style.width = "160px";
    imageEl.style.height = "90px";
    titleEl.innerText = title;
    boxEl.style.margin = "5px 0 ";
    boxEl.append(titleEl, imageEl);
    ele.instance.setContent(boxEl);
    let PX = new Array(10)
      .fill(
        new Array(10).fill({}).map((v, i) => ({
          value: `-${i * 160}px`,
          delay: 100,
        }))
      )
      .flat();
    let PY = new Array(10).fill({}).map((v, i) => ({
      value: `-${i * 90}px`,
      delay: 1000,
    }));
    imageEl.addEventListener("mouseover", function () {
      if (!shotImage) return;
      imageEl.style.backgroundSize = "auto";
      imageEl.style.backgroundImage = `url(${shotImage})`;
      imageEl.animation = anime({
        targets: imageEl,
        backgroundPositionX: PX,
        backgroundPositionY: PY,
        loop: true,
        duration: 1,
      });
    });
    imageEl.addEventListener("mouseout", function () {
      if (!imageEl.animation) return;
      imageEl.style.backgroundImage = `url(${image})`;
      imageEl.style.backgroundSize = "cover";
      imageEl.animation.restart();
      imageEl.animation.pause();
    });
  } catch (e) {
    log(e);
    ele.instance.setContent("加载失败！");
  }
}

// 悬停事件
// 本来打算使用事件委托，最后想想感觉还不如这样实现好
const hoverHandle = throttle(function (target) {
  getBVATag(target).forEach((v) => getDataAndSetEvent(v));
}, 1000);

(function () {
  log("脚本启动");
  document
    .querySelector("#comment")
    .addEventListener("mouseover", async ({ target }) => {
      hoverHandle(target);
    });
  document
    .querySelector("#v_desc")
    .addEventListener("mouseover", async ({ target }) => {
      hoverHandle(target);
    });
})();
