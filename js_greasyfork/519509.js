// ==UserScript==
// @name         抖音弹窗 合集页面 合集列表复制按钮
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description   抖音弹窗 合集页面
// @author       You
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/*/search/*
// @match        https://www.douyin.com/search/*
// @match        https://www.douyin.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519509/%E6%8A%96%E9%9F%B3%E5%BC%B9%E7%AA%97%20%E5%90%88%E9%9B%86%E9%A1%B5%E9%9D%A2%20%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519509/%E6%8A%96%E9%9F%B3%E5%BC%B9%E7%AA%97%20%E5%90%88%E9%9B%86%E9%A1%B5%E9%9D%A2%20%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
// 拦截请求
window.aggrxDialogCollectionIDDictionary = {};
window.aggrxDialogTAWorksIDDictionary = {};
function aggrxDialogCollectionDictionaryInterception() {

  // 保存原始的 open 和 send 方法
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  // 重写 open 方法，记录请求信息
  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this._requestInfo = { method, url }; // 保存请求的 URL 和方法
    return originalOpen.apply(this, arguments);
  };

  // 重写 send 方法，拦截响应数据
  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this;

    // 保存请求体数据
    this._requestInfo.body = body;

    // 保存原始的 onreadystatechange
    const originalOnReadyStateChange = xhr.onreadystatechange;

    // 重写 onreadystatechange
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const { url } = xhr._requestInfo;

        // 判断是否是特定接口
        if (url.includes('/aweme/v1/web/mix/aweme/')) {
          console.log(`Request to: ${url}`);
          try {
            const parsedResponse = JSON.parse(xhr.responseText);
            parsedResponse.aweme_list.forEach(item => {
              console.log(item);
              window.aggrxDialogCollectionIDDictionary[`${item.desc}`] = item.aweme_id;
            });
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
        if (url.includes('/aweme/v1/web/aweme/post/')) {
          console.log(`Request to: ${url}`);
          try {
            const parsedResponse = JSON.parse(xhr.responseText);
            parsedResponse.aweme_list.forEach(item => {
              let urlList = item.video.cover.url_list;
              if (!urlList || urlList.length <= 0) {
                console.waring("❎ 未查找到到封面URL!");
                return
              }
              urlList.forEach(url => {
                let coverUrl = url.split('?')[0];
                window.aggrxDialogTAWorksIDDictionary[`${coverUrl}`] = item.aweme_id;
              });
            });
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
      }
      // 调用原始的回调函数
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.apply(xhr, arguments);
      }
    };

    return originalSend.apply(this, arguments);
  };
}
console.log('📚 字典弹窗初始化拦截');
aggrxDialogCollectionDictionaryInterception();

// 检测合集列表,添加复制按钮
function aggrxDetectionCollectionDOMList() {
  let slideListDOM = document.getElementById("slidelist");
  if (!slideListDOM) {
    console.log("🆕 弹窗不存在!")
    return;
  };
  let tabTitleDom = document.querySelector("#relatedVideoCard div[role='tablist'] div[aria-selected='true'] span");
  if (!tabTitleDom) {
    console.log("🆕 弹窗的切换Tab不存在!")
    return;
  };
  let tabTitle = tabTitleDom.innerText;
  if (tabTitle != "合集") {
    console.log("🆕 弹窗的切换合集框不是合集!");
    return;
  };
  let collectionUlList = document.querySelector("div#slidelist div#related-card-list-container ul");
  if (!collectionUlList) {
    console.log("🆕 弹窗的合集列表不存在!")
    return;
  };
  let listDOMArray = collectionUlList.querySelectorAll("li");
  listDOMArray.forEach(item => {
    if (!item.querySelector("h3 span")) {
      console.log("🆕 弹窗的合集列表不存在标题!")
      return
    }
    let collectionName = item.querySelector("h3 span").innerText.replace(/第\d+集：/, '');
    let videoID = window.aggrxDialogCollectionIDDictionary[collectionName];
    let aggrxListButton = item.querySelector("button.aggrxCollectionCopyButton");
    if (!aggrxListButton) {
      // 添加复制按钮
      aggrxAddCopyButton(item, videoID, (event) => {
        let videoId = event.target.dataset.videoId;
        aggrx_copyToClipboard(`https://www.douyin.com/video/${videoId}, 1`)
      })
    }
  });
}
// 添加视频详情页的复制按钮
function aggrxVideoDetailCollection() {
  let slideListDOM = document.getElementById("slidelist");
  if (!slideListDOM) {
    console.log("🆕 弹窗不存在!")
    return;
  };
  let videoDetailDOM = document.querySelector('div[data-e2e="video-detail"]> div  > div > div[data-e2e="aweme-mix"] > ul');
  if (!videoDetailDOM) {
    console.log("🆕 弹窗不存在!")
    return;
  }
  let listDOMArray = videoDetailDOM.querySelectorAll("li");
  listDOMArray.forEach(item => {
    item.style.position = "relative";
    let videoUrl = item.querySelector("a").href;

    aggrxAddCopyButton(item, '', (event) => {
      aggrx_copyToClipboard(`${videoUrl}, 1`)
    })
  })
}

// 添加复制按钮
function aggrxAddCopyButton(listDOM, videoID, clickCallback, buttonText = "🔗 复制链接") {
  // 获取所有带有 data-video-id 属性的元素
  let copyButton = document.createElement("button");
  copyButton.className = "aggrxCollectionCopyButton";
  copyButton.textContent = buttonText;
  if (videoID) {
    copyButton.dataset.videoId = videoID;
  }
  copyButton.style.cssText = `
        display: inline-block;  
        white-space: nowrap;
        cursor: pointer;
     
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        height: 32px;
        line-height: 28px;
        width: 120px;
        font-size: 14px;
        border-radius: 4px;
        border: 2px solid #dcdfe6;
        color: #333;
        background: #C0C4CC;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 99999;
      `;
  copyButton.addEventListener('click', (event) => {
    event.stopPropagation();
    clickCallback(event)
  })

  listDOM.appendChild(copyButton);
}

// 添加TA的作品的复制按钮
function aggrxAddVideoDialogWorks() {
  let slideListDOM = document.getElementById("slidelist");
  if (!slideListDOM) {
    console.log("🆕 弹窗不存在!")
    return;
  };
  let tabTitleDom = document.querySelector("#relatedVideoCard div[role='tablist'] div[aria-selected='true'] span");
  if (!tabTitleDom) {
    console.log("🆕 弹窗的切换Tab不存在!")
    return;
  };
  let tabTitle = tabTitleDom.innerText;
  if (tabTitle != 'TA的作品') {
    console.log("🆕 弹窗的切换不是TA的作品!");
    return;
  };
  // 添加清除剪贴板按钮
  let aggrxClearClipboardDom = document.querySelector('div.author-card-body-margin-expand div.aggrxClearClipboard');
  if (!aggrxClearClipboardDom) {
    let ListDom = document.querySelector('div.author-card-body-margin-expand');
    ListDom.style.position = "relative";
    let clearClipboardDom = document.createElement('button');
    clearClipboardDom.className = "aggrxClearClipboard";
    clearClipboardDom.textContent = "🔄 清除剪贴板";
    clearClipboardDom.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99999;
      width: 120px;
      font-size: 14px;
      border-radius: 4px;
      border: 2px solid #dcdfe6;
      color: #333;
      background: #C0C4CC;
    `;
    clearClipboardDom.addEventListener('click', (event) => {
      event.stopPropagation();
      navigator.clipboard.writeText('');
    })
    ListDom.appendChild(clearClipboardDom);
  }

  let worksList = document.querySelectorAll('div.author-card-body-margin-expand ul li');
  if (!worksList && worksList.length <= 0) {
    console.log("🆕 弹窗的TA的作品, 列表不存在!");
    return
  }
  worksList.forEach(item => {

    let imgUrl = item.querySelector('img').src.split('?')[0];
    let videoID = window.aggrxDialogTAWorksIDDictionary[`${imgUrl}`];
    if (!videoID) {
      console.log("❎ 未查找到到视频ID!");
      return
    }
    aggrxAddCopyButton(item, videoID, (event) => {
      event.stopPropagation();
      if (videoID) {
        aggrxContinuousCopyText(`https://www.douyin.com/video/${videoID}`)
      } else {
        alert("❌ 未查找到到视频ID!");
      }
    }, '🔗 叠加复制链接')
  });
}
// 连续复制文本
async function aggrxContinuousCopyText(text) {
  // 读取剪贴板
  const readText = await navigator.clipboard.readText();
  const newText = `${readText}
  ${text}`;
  aggrx_copyToClipboard(newText)
}



// 复制文本
function aggrx_copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(text).then(function () {
      console.log(`✅ 复制成功; ${text}`);
      resolve(true);
    }).catch(function (err) {
      console.error(`❌ 复制失败; ${text}`, err);
      reject(false);
    });
  });
}
setInterval(() => {
  aggrxDetectionCollectionDOMList();
  aggrxVideoDetailCollection();
  aggrxAddVideoDialogWorks();
}, 800)
