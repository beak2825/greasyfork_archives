// ==UserScript==
// @name         override-missav-js
// @namespace    https://missav.*
// @version      v0.1.4
// @description  override missav js
// @author       You
// @include        https://missav.*/*
// @exclude      /^https:\/\/missav\.*\/.*-\d+.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482631/override-missav-js.user.js
// @updateURL https://update.greasyfork.org/scripts/482631/override-missav-js.meta.js
// ==/UserScript==

// 节流
function throttle(func, wait) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    };
  }

// 防抖
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

const onMouseEnter = () => {
    // 获取页面中所有拥有 .thumbnail 类的元素
    const thumbnails = document.querySelectorAll(".thumbnail");

    // 遍历所有的 .thumbnail 元素
    thumbnails.forEach(function (thumbnail) {
        // 在每个 .thumbnail 元素下找到符合条件的 a 元素
        const link = thumbnail.querySelector("div:first-child > a:last-child");

        if (link == null) {
            return;
        }

        // 检查 link 是否已经有监听器或者已经被触发过点击
        if (!link.hasAttribute("data-click-triggered")) {
            // 创建一个监听函数，它可以被解除绑定
            function hoverTriggerClick(event) {
                // 触发点击事件
                link.click();
                // 在触发点击后解除 mouseenter 事件监听
                link.removeEventListener("mouseenter", hoverTriggerClick);
            }

            // 标记 link 已添加事件监听器
            link.setAttribute("data-click-triggered", "true");
            // 为该 a 元素添加鼠标悬停的事件监听器
            link.addEventListener("mouseenter", hoverTriggerClick);
        }
    });
};

const onVideo = () => {
    // 获取页面中所有拥有 .thumbnail 类的元素
    const thumbnails = document.querySelectorAll(
        ".thumbnail > div:first-child > a:first-child"
    );

    // 遍历所有的 .thumbnail 元素
    thumbnails.forEach(function (thumbnail) {
        // 在每个 .thumbnail 元素下找到符合条件的 a 元素
        const video = thumbnail.querySelector(
            "div:first-child > a:first-child > video"
        );

        if (video == null){
            return;
        }

        if (video.getAttribute("play") === "true" && video.src.indexOf("https") != -1) {
            // video.play();
            // video.className = "preview";
            return;
        }

        // const id = video.id.replace("preview-", "");
        // console.log(id, video.dataset.src);
        // video.src = video.dataset.src.replace("undefined", id);

        // console.log(video.id, video.dataset.src);

        if (video.dataset.src.indexOf("undefined") > -1) {
            return;
        }

        video.setAttribute("costom-src", "true");
        video.setAttribute("play", "true");
        video.src = video.dataset.src;
        // video.play();
        // video.className = "preview";
    });
};

const playVideo = () => {
    onVideo();
    const videos = document.querySelectorAll("video[costom-src=true]");
    videos.forEach((video) => {
        video.play();
        video.className = "preview";
    });
}

const addSettingIcon = () => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.right = "20px";
    div.style.bottom = "45%";
    div.style.padding="10px";
    div.style.zIndex = "50";
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.color = "white";
    div.style.backgroundColor = "black";
    div.style.borderRadius = "50%";
    div.style.opacity = "1";
    div.style.cursor = "pointer";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.userSelect = "none";
    div.innerText = "⚙️";

    div.addEventListener("mouseenter", function () {
        div.style.opacity = "1";
    });
    div.addEventListener("mouseleave", function () {
        div.style.opacity = "0.5";
    });

    div.addEventListener("click", function () {
        playVideo();
    });

    document.body.appendChild(div);
}

const addTriggerAutoPlay = () => {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.left = "20px";
    div.style.bottom = "20px";
    div.style.padding="10px";
    div.style.zIndex = "50";
    div.style.width = "30px";
    div.style.height = "30px";
    div.style.color = "white";
    div.style.backgroundColor = "black";
    div.style.borderRadius = "50%";
    div.style.opacity = "1";
    div.style.cursor = "pointer";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    div.style.userSelect = "none";
    div.innerText = "🚫";

    if (localStorage.getItem("autoPlay") === "1") {
        div.innerText = "♨️";
    }

    div.addEventListener("mouseenter", function () {
        div.style.opacity = "1";
    });
    div.addEventListener("mouseleave", function () {
        div.style.opacity = "0.5";
    });

    div.addEventListener("click", function () {
        const autoPlay = localStorage.getItem("autoPlay");
        if (autoPlay === "1") {
            div.innerText = "🚫";
            localStorage.setItem("autoPlay", "0");
            return;
        }
        div.innerText = "♨️";
        localStorage.setItem("autoPlay", "1");
    });

    document.body.appendChild(div);
}

(function () {
    "use strict";

    addSettingIcon();
    addTriggerAutoPlay();

    document.addEventListener("keydown", function (event) {
        playVideo();
    });

    const timer = setInterval(() => {
        if (window.player != null) {
            return;
        }

        const autoPlay = localStorage.getItem("autoPlay");
        if (autoPlay === "1") {
            setTimeout(() => {
                playVideo();
            }, 2000);

            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes.length > 0) {
                        // onMouseEnter();
                        debounce(playVideo, 1000)();
                    }
                });
            });

            observer.observe(document.body, {
                attributes: false,
                childList: true,
                subtree: true,
            });
        }

        clearInterval(timer);

    }, 1000)

})();
