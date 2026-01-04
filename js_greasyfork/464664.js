// ==UserScript==
// @name         小红书转发
// @namespace    https://mundane.ink/redbook
// @version      3.5
// @description  在浏览小红书收藏和点赞时将数据转发到https://xhs.mundane.ink，方便收藏和点赞的管理和导出
// @match        https://www.xiaohongshu.com/*
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.xiaohongshu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/464664/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464664/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("小红书脚本生效了");
  const baseUrl = "https://mundane.ink";
  // const baseUrl = "http://localhost:8088";
  document.body.addEventListener("click", (e) => {
    if (
      e.target.tagName === "A" &&
      e.target.classList.value.includes("cover ld mask")
    ) {
      setTimeout(() => {
        const href = window.location.href;
        const noteId = extractID(href);
        if (noteId) {
          createDownloadMdButton(noteId);
          createMediaButton(noteId);
        }
      }, 1000);
    }
  });

  function extractID(url) {
    const regex = /explore\/([0-9a-fA-F]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // 创建下载md按钮
  function createDownloadMdButton(noteId) {
    const mask = document.querySelector("div.note-detail-mask");
    const button = document.createElement("button");
    button.textContent = "下载md文件";
    button.style.position = "fixed";
    button.style.bottom = "65px";
    button.style.right = "20px";
    button.style.padding = "10px 20px";
    button.style.border = "none";
    button.style.backgroundColor = "#056b00";
    button.style.color = "#fff";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontSize = "16px";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
    button.addEventListener("click", function () {
      exportMd(noteId);
    });
    mask.appendChild(button);
  }

  // 创建下载图片和视频按钮
  function createMediaButton(noteId) {
    const mask = document.querySelector("div.note-detail-mask");
    const button = document.createElement("button");
    button.textContent = "下载图片和视频";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.padding = "10px 20px";
    button.style.border = "none";
    button.style.backgroundColor = "#056b00";
    button.style.color = "#fff";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontSize = "16px";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
    button.addEventListener("click", function () {
      extractDownloadLinks();
    });
    mask.appendChild(button);
  }

  const extractDownloadLinks = async () => {
    let note = extractNoteInfo();
    if (note.note) {
      await exploreDeal(note.note);
    }
  };

  const extractNoteInfo = () => {
    let note = Object.values(unsafeWindow.__INITIAL_STATE__.note.noteDetailMap);
    return note[note.length - 1];
  };

  const exploreDeal = async (note) => {
    try {
      let links;
      if (note.type === "normal") {
        links = generateImageUrl(note);
      } else {
        links = generateVideoUrl(note);
      }
      if (links.length > 0) {
        await download(links, note.type);
      }
    } catch (error) {
      console.error("Error in deal function:", error);
    }
  };

  const download = async (urls, type_) => {
    const name = extractName();
    if (type_ === "video") {
      await downloadVideo(urls[0], name);
    } else {
      await downloadImage(urls, name);
    }
  };

  const downloadVideo = async (url, name) => {
    if (!(await downloadFile(url, `${name}.mp4`))) {
      console.error("下载视频失败");
    }
  };

  const downloadImage = async (urls, name) => {
    let result = [];
    for (const [index, url] of urls.entries()) {
      result.push(await downloadFile(url, `${name}_${index + 1}.png`));
    }
    if (!result.every((item) => item === true)) {
      console.error("下载图片失败");
    }
  };

  const downloadFile = async (link, filename) => {
    try {
      // 使用 fetch 获取文件数据
      let response = await fetch(link);

      // 检查响应状态码
      if (!response.ok) {
        console.error(`请求失败，状态码: ${response.status}`, response.status);
        return false;
      }

      let blob = await response.blob();

      // 创建 Blob 对象的 URL
      let blobUrl = window.URL.createObjectURL(blob);

      // 创建一个临时链接元素
      let tempLink = document.createElement("a");
      tempLink.href = blobUrl;
      tempLink.download = filename;

      // 模拟点击链接
      tempLink.click();

      // 清理临时链接元素
      window.URL.revokeObjectURL(blobUrl);

      return true;
    } catch (error) {
      console.error(`下载失败 (${filename}):`, error);
      return false;
    }
  };

  const extractName = () => {
    let name = document.title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
    let match = window.location.href.match(/\/([^\/]+)$/);
    let id = match ? match[1] : null;
    return name === "" ? id : name;
  };

  const generateVideoUrl = (note) => {
    try {
      return [
        `https://sns-video-bd.xhscdn.com/${note.video.consumer.originVideoKey}`,
      ];
    } catch (error) {
      console.error("Error generating video URL:", error);
      return [];
    }
  };

  const generateImageUrl = (note) => {
    let images = note.imageList;
    const regex = /http:\/\/sns-webpic-qc\.xhscdn.com\/\d+\/[0-9a-z]+\/(\S+)!/;
    let urls = [];
    try {
      images.forEach((item) => {
        let match = item.urlDefault.match(regex);
        if (match && match[1]) {
          urls.push(
            `https://ci.xiaohongshu.com/${match[1]}?imageView2/2/w/format/png`
          );
        }
      });
      return urls;
    } catch (error) {
      console.error("Error generating image URLs:", error);
      return [];
    }
  };

  function getMedia(noteId) {
    fetch(`${baseUrl}/mail/redbook/note/getMediaInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // 解析响应数据为 JSON 格式
        return response.json();
      })
      .then((resp) => {
        if (resp.code === 200) {
          exportMedia(resp.data);
        }
      })
      .catch((error) => console.error(error));
  }

  function exportMedia(data) {
    const { title, videoUrl, imageUrls } = data;
    if (imageUrls.length <= 10) {
      exportImages(title, imageUrls);
    } else {
      exportMoreImages(title, imageUrls);
    }

    if (videoUrl) {
      exportVideo(title, videoUrl);
    }
  }

  async function exportMoreImages(title, imageUrls) {
    const imgUrls1 = imageUrls.slice(0, 10);
    const imgUrls2 = imageUrls.slice(10);
    exportImages(title, imgUrls1);
    await pause();
    exportImages10(title, imgUrls2);
  }

  // 暂停1s
  function pause() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  function exportVideo(title, videoUrl) {
    fetch(videoUrl)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        // 创建一个下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = title + ".mp4";

        document.body.appendChild(a);

        // 模拟点击下载链接
        a.click();

        // 清理对象 URL
        URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  }

  async function exportImages10(title, imageUrls) {
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = imageURL;
      a.download = title + "-" + (i + 11) + ".png";
      a.click();
      URL.revokeObjectURL(imageURL);
    }
  }

  async function exportImages(title, imageUrls) {
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = imageURL;
      a.download = title + "-" + (i + 1) + ".png";
      a.click();
      URL.revokeObjectURL(imageURL);
    }
  }

  function exportMd(noteId) {
    fetch(`${baseUrl}/mail/redbook/note/exportNoteMd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId }),
    })
      .then((response) => {
        const contentDisposition = response.headers.get("Content-Disposition");
        const filenameMatch = decodeURIComponent(
          contentDisposition.match(/filename\=(.*)/)[1]
        );
        const filename = filenameMatch || "filename.md";
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      })
      .catch((error) => console.error(error));
  }

  // 创建按钮元素
  const btnScroll = document.createElement("button");
  btnScroll.innerHTML = "自动滚动";
  const btnJump = document.createElement("button");
  btnJump.innerHTML = "去下载";
  const btnTest = document.createElement("button");
  btnTest.innerHTML = "测试";

  // 设置按钮样式
  btnScroll.style.position = "fixed";
  btnScroll.style.top = "160px";
  btnScroll.style.right = "20px";
  btnScroll.style.backgroundColor = "#056b00";
  btnScroll.style.color = "#fff";
  btnScroll.style.padding = "8px";
  btnScroll.style.borderRadius = "6px";
  btnScroll.style.zIndex = "1000";

  btnJump.style.position = "fixed";
  btnJump.style.top = "210px";
  btnJump.style.right = "20px";
  btnJump.style.backgroundColor = "#056b00";
  btnJump.style.color = "#fff";
  btnJump.style.padding = "8px";
  btnJump.style.borderRadius = "6px";
  btnJump.style.zIndex = "1000";

  btnTest.style.position = "fixed";
  btnTest.style.top = "260px";
  btnTest.style.right = "20px";
  btnTest.style.backgroundColor = "#056b00";
  btnTest.style.color = "#fff";
  btnTest.style.padding = "8px";
  btnTest.style.borderRadius = "6px";
  btnTest.style.zIndex = "1000";

  // 添加按钮到页面中
  document.body.appendChild(btnScroll);
  document.body.appendChild(btnJump);
  // document.body.appendChild(btnTest);

  let isScrolling = false;
  let timerId;

  function getUserId() {
    const arr = window.location.href.match(/\/user\/profile\/(\w+)/);
    if (!arr) {
      return "";
    }
    if (arr.length < 2) {
      return "";
    }
    return arr[1];
  }

  function simulateScroll() {
    // window.scrollBy(0, 200);
    window.scrollBy({ top: 200, left: 0, behavior: "smooth" });
  }

  function startScroll() {
    if (isScrolling) {
      return;
    }
    isScrolling = true;
    btnScroll.innerHTML = "停止滚动";
    btnScroll.style.backgroundColor = "#ff2442";
    timerId = setInterval(simulateScroll, 200);
  }

  function cancelScroll() {
    if (!isScrolling) {
      return;
    }
    isScrolling = false;
    btnScroll.style.backgroundColor = "#056b00";
    btnScroll.innerHTML = "自动滚动";
    if (timerId) {
      clearInterval(timerId);
    }
  }

  // 给按钮添加点击事件
  btnScroll.addEventListener("click", function () {
    if (isScrolling) {
      cancelScroll();
    } else {
      startScroll();
    }
  });

  btnJump.addEventListener("click", function () {
    const userId = getUserId();
    window.open(
      `https://xhs.mundane.ink/manage/collect?userId=${userId}`,
      "_blank"
    );
  });

  btnTest.addEventListener("click", function () {
    let tab = document.querySelectorAll(".tab-content-item")[1];
    const elements = tab.querySelectorAll("a.cover.ld.mask");
    elements[0].click();
    let timeId = setInterval(function () {
      let closeButton = document.querySelector("div.close-circle div.close");
      if (closeButton) {
        closeButton.click();
        clearInterval(timeId);
      }
    }, 500);
  });

  const originOpen = XMLHttpRequest.prototype.open;
  const collectUrl = "//edith.xiaohongshu.com/api/sns/web/v2/note/collect";
  const feedUrl = "//edith.xiaohongshu.com/api/sns/web/v1/feed";
  const likeUrl = "//edith.xiaohongshu.com/api/sns/web/v1/note/like";
  let patchIndex = 0;
  XMLHttpRequest.prototype.open = function (_, url) {
    const xhr = this;
    if (
      url.startsWith(collectUrl) ||
      url.startsWith(feedUrl) ||
      url.startsWith(likeUrl)
    ) {
      const getter = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        "response"
      ).get;
      Object.defineProperty(xhr, "responseText", {
        get: () => {
          let result = getter.call(xhr);
          // console.log("result =", result);
          let myUrl = "";
          let requestData = "";
          const userId = getUserId();
          if (url.startsWith(collectUrl)) {
            if (!userId) {
              return result;
            }
            const params = new URLSearchParams(url.split("?")[1]);
            const cursor = params.get("cursor");
            if (!cursor) {
              patchIndex = 0;
            }
            myUrl = `${baseUrl}/mail/redbook/collect/save`;
            requestData = JSON.stringify({ result, userId, patchIndex });
          } else if (url.startsWith(feedUrl)) {
            myUrl = `${baseUrl}/mail/redbook/note/save`;
            requestData = JSON.stringify({ result });
          } else if (url.startsWith(likeUrl)) {
            if (!userId) {
              return result;
            }
            myUrl = `${baseUrl}/mail/redbook/like/save`;
            const data = JSON.parse(result).data;
            // 不要拦截点赞笔记的请求
            if (!data.hasOwnProperty("notes")) {
              return result;
            }
            requestData = JSON.stringify({ result, userId });
          }
          try {
            // 将result发送到服务器
            fetch(myUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: requestData,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((resp) => {
                if (resp.code === 200) {
                  console.log("ok");
                }
              })
              .catch((error) => console.error(error));
            if (url.startsWith(collectUrl)) {
              patchIndex++;
              const obj = JSON.parse(result);
              if (isScrolling && !obj.data.has_more) {
                cancelScroll();
                patchIndex = 0;
                console.log("没有更多收藏数据了！！！");
                alert("小红书收藏已发送完毕，没有更多了");
              }
            } else if (isScrolling && url.startsWith(likeUrl)) {
              const obj = JSON.parse(result);
              if (!obj.data.has_more) {
                cancelScroll();
                console.log("没有更多点赞数据了！！！");
                alert("小红书点赞已发送完毕，没有更多了");
              }
            }
          } catch (e) {
            console.error(e);
          }
          return result;
        },
      });
    }
    originOpen.apply(this, arguments);
  };
})();
