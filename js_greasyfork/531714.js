// ==UserScript==
// @name         白嫖NodeLoc装饰
// @namespace    QQ:94575594
// @version      1.4
// @description  免费使用装饰店的头像边框、用户名颜色特效、用户卡背景图片
// @author       chendaye
// @grant        GM_addStyle
// @match        https://www.nodeloc.com/*
// @run-at       document-end
// @icon         https://favicon.im/www.nodeloc.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531714/%E7%99%BD%E5%AB%96NodeLoc%E8%A3%85%E9%A5%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531714/%E7%99%BD%E5%AB%96NodeLoc%E8%A3%85%E9%A5%B0.meta.js
// ==/UserScript==

(function () {
  const config = {
    userName: "meihang",
    delay: 500
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const replaceUserName = node => {
    if (node == null) document.querySelectorAll(`[username="${config.userName}"]`).forEach(item => replaceUserName(item));
    else {
      let lable = node.parentNode.querySelector(".username");
      if (!lable) {
        replaceUserName(node.parentNode);
      } else {
        if (lable.querySelector(localStorage.userNameStyle)) {
          return;
        }
        lable.className = "username " + localStorage.userNameStyle;
      }
    }
  };

  const insertBtn = () => {
    document.querySelectorAll(".DecorationStoreLabel").forEach(label => {
      if (label.querySelector(".btnPiao")) return;

      if (label.previousElementSibling.querySelector(".DecorationItemAvatarImage")) {
        const btn = Object.assign(document.createElement("button"), {
          className: "btnPiao DecorationItemLabel",
          innerHTML: "白嫖头像边框",
          onclick: e => handleImageStorage(label, e)
        });

        label.appendChild(btn);
      } else if (label.previousElementSibling.querySelector(".decorationItemUsernameColorStyle")) {
        const btn = Object.assign(document.createElement("button"), {
          className: "btnPiao DecorationItemLabel",
          innerHTML: "白嫖用户名颜色",
          onclick: e => handleUserNameStyle(label, e)
        });

        label.appendChild(btn);
      } else if (label.previousElementSibling.querySelector(".DecorationItemProfileBackgroundImage")) {
        const btn = Object.assign(document.createElement("button"), {
          className: "btnPiao DecorationItemLabel",
          innerHTML: "白嫖用户卡背景",
          onclick: e => handleUserBackGroundImg(label, e)
        });

        label.appendChild(btn);
      } else if (label.previousElementSibling.querySelector(".DecorationItemProfileBackgroundVideo")) {
        const btn = Object.assign(document.createElement("button"), {
          className: "btnPiao DecorationItemLabel",
          innerHTML: "白嫖用户卡背景",
          onclick: e => handleUserBackGroundVideo(label, e)
        });

        label.appendChild(btn);
      }
    });
  };

  const handleUserNameStyle = (label, event) => {
    try {
      // 阻止事件冒泡
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      const container = label.closest(".DecorationStoreContainer");
      const style = container?.querySelector(".decorationItemUsernameColorStyle div");
      localStorage.userNameStyle = style.className;
      alert("白嫖成功");
    } catch (e) {
      console.error("白嫖失败:", e);
    }
    replaceUserName();
  };

  const handleImageStorage = (label, event) => {
    try {
      // 阻止事件冒泡
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      const container = label.closest(".DecorationStoreContainer");
      const img = container?.querySelector(".DecorationItemAvatarImage");

      if (img?.src) {
        localStorage.avatarUrl = img.src;
      }
      alert("白嫖成功");
    } catch (e) {
      console.error("白嫖失败:", e);
    }
    replaceAvatar();
  };

  const handleUserBackGroundImg = (label, event) => {
    try {
      // 阻止事件冒泡
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      let container;
      let imgSrc = "";
      if (
        label.previousElementSibling.childNodes.length &&
        label.previousElementSibling.childNodes[0].className === "DecorationItemProfileBackgroundImage"
      ) {
        container = label.previousElementSibling.childNodes[0];
        if (container) {
          imgSrc = container?.style.backgroundImage;
        }
      }
      localStorage.backgroundImgUrl = imgSrc;
      alert("白嫖成功");
    } catch (e) {
      console.error("白嫖失败:", e);
    }
    replaceBgImg();
  };

  const handleUserBackGroundVideo = (label, event) => {
    try {
      // 阻止事件冒泡
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      let container;
      let imgSrc = "";
      if (
        label.previousElementSibling.childNodes.length &&
        label.previousElementSibling.childNodes[0].className === "DecorationItemProfileBackgroundVideo"
      ) {
        container = label.previousElementSibling.childNodes[0].childNodes[0];
        if (container) {
          imgSrc = container.src;
        }
      }
      localStorage.backgroundImgUrl = imgSrc;
      alert("白嫖成功");
    } catch (e) {
      console.error("白嫖失败:", e);
    }
    replaceBgImg();
  };

  const replaceAvatar = () => {
    const storedSrc = localStorage.avatarUrl;
    if (!storedSrc) return;

    document.querySelectorAll(`[username="${config.userName}"]`).forEach(userContainer => {
      const images = userContainer.querySelectorAll("img");
      images.forEach(img => {
        if (img.src !== storedSrc) {
          img.src = storedSrc;
        }
      });
    });
  };

  const replaceBgImg = () => {
    const storedSrc = localStorage.backgroundImgUrl;
    if (!storedSrc) return;
    document.getElementsByClassName("username").textContent = "";
    document.querySelectorAll(`[username="${config.userName}"]`).forEach(userContainer => {
      let cardElement = userContainer.closest(".UserCard");
      if (cardElement && !cardElement.querySelector("video")) {
        if (cardElement) {
          if (storedSrc.includes("mp4")) {
            cardElement.style.background = "transparent";
            cardElement.style.overflow = "hidden";
            console.log(cardElement.offsetWidth);
            const video = document.createElement("video");
            video.src = storedSrc;
            video.addEventListener("loadedmetadata", () => {
              if (video.videoWidth / video.videoHeight < cardElement.offsetWidth / cardElement.offsetHeight) {
                video.style.width = "100%";
                video.style.height = "auto";
              } else {
                video.style.width = "auto";
                video.style.height = "100%";
              }
            });
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsinline = true;
            video.controls = false;
            video.style.position = "absolute";
            video.style.top = "0";
            video.style.left = "50%";
            video.style.right = "50%";
            video.style.zIndex = "-1";
            video.style.transform = "translateX(-50%)";
            if (cardElement.className.includes("UserHero")) {
              cardElement.style.position = "relative";
              video.style.left = "0";
              video.style.right = "0%";
              video.style.width = "100%";
              video.style.height = "unset";
              video.style.transform = "translateY(-50%)";
            }
            cardElement.appendChild(video);
          } else {
            cardElement.style.backgroundImage = storedSrc;
            cardElement.style = `background-image: ${storedSrc}; background-size: cover; background-position: center;`;
          }
        }
      }
    });
  };
  const begin = () => {
    replaceAvatar();
    replaceUserName();
    replaceBgImg();
    insertBtn();
  };
  const observer = new MutationObserver(
    debounce(mutationsList => {
      mutationsList.forEach(mutation => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(node => {
            begin();
          });
        }
      });
    }, config.delay)
  );

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  begin();

  GM_addStyle(`
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .btnPiao {
            background: blue;
            border: none;
            color: white !important;
            cursor: pointer;
            transition: all 0.3s;
            margin-left: 5px;
        }
        .btnPiao:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px #4834d4;
        }
    `);
})();
