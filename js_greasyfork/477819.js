// ==UserScript==
// @name         推特获取原图
// @namespace    https://github.com/MuXia-0326/twitter-auto-original-picture
// @version      1.17
// @description  推特在新标签页打开图片自动原图
// @author       Mossia
// @icon         https://raw.githubusercontent.com/MuXia-0326/drawio/master/angri.png
// @match        https://pbs.twimg.com/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477819/%E6%8E%A8%E7%89%B9%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477819/%E6%8E%A8%E7%89%B9%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const copyUpdate = true;
  const share_url = '';
  const share_url_two = '';

  let userName = '';

  //载入css样式
  const css = `/* From www.lingdaima.com */
  .twitter-Btn {
    position: relative;
    display: inline-block;
    padding: 10px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    text-decoration: none;
    color: rgb(29, 155, 240);
    background: transparent;
    cursor: pointer;
    transition: ease-out 0.5s;
    border: 2px solid rgb(29, 155, 240);
    border-radius: 10px;
    box-shadow: inset 0 0 0 0 rgb(29, 155, 240);
  }

  .twitter-Btn:hover {
    color: white;
    box-shadow: inset 0 -100px 0 0 rgb(29, 155, 240);
  }

  .twitter-Btn:active {
    transform: scale(0.9);
  }

  .twitter-Btn:hover svg {
    fill: white;
  }
  .twitter-Btn:active svg,
  .twitter-Btn svg {
    fill: rgb(29, 155, 240);
  }

  .Btn {
    position: absolute;
    top: 2px;
    right: 2px;
  }
  .svgClass {
    display: flex;
  }

  .share-btn {
    display:none;
  }
  `;

  let styleTag = document.createElement('style');
  styleTag.innerText = css;
  document.head.append(styleTag);

  // 获取当前页面的URL
  if (window.location.hostname === 'pbs.twimg.com') {
    let newUrl = replaceImageSizeName(window.location.href);
    if (newUrl !== window.location.href) {
      window.location.href = newUrl;
    }
  } else if (window.location.hostname === 'twitter.com' || window.location.hostname === 'x.com') {
    document.js_nsfw = setInterval(main, 100);
  }

  let url = '';
  let createDate = '';

  function main() {
    if (userName === '') {
      getUserName();
    }

    tweetAdd();
    imageDetailsAdd();
    copy();
    tweetAltAdd();
  }

  function getUserName() {
    let divs = document.querySelectorAll('button[aria-label="账号菜单"]');

    for (let div of divs) {
      if (div.children.length === 3) {
        let secondDiv = div.children[1];
        if (secondDiv === null) {
          continue;
        }

        let oneDiv = secondDiv.children[0].children[0];
        let twoDiv = secondDiv.children[0].children[1];

        let likeName = oneDiv.children[0].children[0].children[0].textContent;
        let name = twoDiv.children[0].children[0].children[0].textContent;

        userName = likeName + '(' + name + ')';
      } else if (div.children.length === 1) {
        let oneDiv = div.children[0];
        if (oneDiv === null) {
          continue;
        }

        let nameDiv =
          oneDiv.children[0].children[1].children[0].children[1].children[0].children[0].children[2].children[0].children[1]
            .children[0];
        userName = nameDiv.getAttribute('aria-label');
      }
    }
  }

  function tweetAltAdd() {
    let tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');

    for (let tweet of tweets) {
      let className = 'div.css-175oi2r.r-rki7wi.r-u8s1d.r-14fd9ze';

      let div = tweet.querySelector(className);
      if (div === null) {
        continue;
      }

      let parent = div.parentNode;
      let links = parent.querySelector('a');
      if (links === null) {
        continue;
      }

      let imageDiv = links.querySelector('img.css-9pa8cd');
      if (imageDiv === null) {
        continue;
      }

      let temp = [...new Set(baseSelectorAlt(parent, 'img.css-9pa8cd'))];
      let like = queryLikeBtn(tweet);

      for (let i = 0; i < temp.length; i++) {
        setAltBtn([temp[i]], like);
      }
    }
  }

  function copy() {
    if (copyUpdate) {
      // 替换复制按钮的url
      let firstChildDiv = document.querySelector('div[data-testid="Dropdown"] > div:first-child');

      // 确保第一个子元素是一个 div
      if (firstChildDiv) {
        firstChildDiv.addEventListener('click', function (e) {
          navigator.clipboard
            .readText()
            .then((text) => {
              // console.log('剪贴板的内容：', text);
              if (text.indexOf('fixupx') === -1) {
                // 修改剪贴板的内容
                GM_setClipboard(text.replace(/x/g, 'fixupx'), 'text');
              }
            })
            .catch((err) => {
              console.log('无法读取剪贴板的内容：', err);
            });
        });
      }
    }
  }

  function imageDetailsAdd() {
    // 图片详情页的按钮
    let classDetailsName = 'div[data-testid="swipe-to-dismiss"] div[aria-label="图像"]';

    let tempDetails = [...new Set(baseSelector(document, classDetailsName))];

    for (let i = 0; i < tempDetails.length; i++) {
      setDetailsBtn([tempDetails[i]]);
    }
  }

  function tweetAdd() {
    let tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');

    for (let tweet of tweets) {
      let time = tweet.querySelector('time');

      let className = 'div[data-testid="tweetPhoto"]';

      let imageDiv = tweet.querySelector(className);
      if (imageDiv === null) {
        continue;
      }

      let temp = [...new Set(baseSelector(tweet, className))];
      let like = queryLikeBtn(tweet);

      for (let i = 0; i < temp.length; i++) {
        setBtn([temp[i]], like, time);
      }
    }
  }

  function queryLikeBtn(tweet) {
    let like = null;
    if (tweet.querySelector('div.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1ny4l3l')) {
      let divs = tweet.querySelector('div.css-175oi2r.r-16y2uox.r-1wbh5a2.r-1ny4l3l');

      let childCount = divs.children.length;
      if (childCount === 3) {
        let div = divs.children[2];
        let lastNum = 4;
        like = div.children[lastNum].querySelector('div').querySelector('div').children[2];
      } else if (childCount === 2) {
        like = divs.children[1].children[1].children[3].querySelector('div').querySelector('div').children[2];
      }
    } else if (tweet.querySelector('div.css-175oi2r.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu')) {
      like = tweet
        .querySelector('div.css-175oi2r.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu')
        .children[3].querySelector('div')
        .querySelector('div').children[2];
    }

    return like;
  }

  function baseSelector(parentEle, selector) {
    let items = parentEle.querySelectorAll(selector);
    return Array.from(items).filter((item) => {
      let node = getParentByNum(item, 5).querySelectorAll('div[data-nsfw]');
      return !(node && node.length > 0);
    });
  }

  function baseSelectorAlt(parentEle, selector) {
    let items = parentEle.querySelectorAll(selector);
    return Array.from(items).filter((item) => {
      let node = getParentByNum(item, 5).querySelectorAll('div[data-nsfw]');
      return !(node && node.length > 0);
    });
  }

  function setBtn(node, like, time) {
    for (let container of node) {
      let images = container.querySelectorAll('img');

      for (let image of images) {
        let imageUrl = image.getAttribute('src');
        let classText = image.getAttribute('class') + getRandomIntExclusive(10);

        let buttonHtml = getBtnHtml(classText);

        let parentElement = getParentByNum(image, 5);

        let newUrl = replaceImageSizeName(imageUrl);
        appendBtn(parentElement, newUrl, buttonHtml, classText, like, time);
      }
    }
  }

  function setAltBtn(node, like) {
    for (let images of node) {
      let imageUrl = images.getAttribute('src');
      let classText = images.getAttribute('class') + getRandomIntExclusive(10);

      let buttonHtml = getBtnHtml(classText);

      let parentElement = getParentByNum(images, 5);

      let newUrl = replaceImageSizeName(imageUrl);
      appendBtn(parentElement, newUrl, buttonHtml, classText, like);
    }
  }

  function setDetailsBtn(node) {
    for (let container of node) {
      let images = container.querySelectorAll('img');

      for (let image of images) {
        let imageUrl = image.getAttribute('src');
        let classText = image.getAttribute('class') + getRandomIntExclusive(10);

        let buttonHtml = getBtnHtml(classText);

        let like = getParentByNum(container, 4).nextElementSibling.querySelector('div').querySelector('div').querySelector('div')
          .children[2];

        let newUrl = replaceImageSizeName(imageUrl);
        appendBtn(container, newUrl, buttonHtml, classText, like);
      }
    }
  }

  function getBtnHtml(classText) {
    const buttonHtml = `<div class="Btn">
                <button class="twitter-Btn" id="copy-${classText}">
                    <div class="svgClass">
                        <svg t="1694962361717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5412" width="20" height="20">
                            <path d="M761.088 715.3152a38.7072 38.7072 0 0 1 0-77.4144 37.4272 37.4272 0 0 0 37.4272-37.4272V265.0112a37.4272 37.4272 0 0 0-37.4272-37.4272H425.6256a37.4272 37.4272 0 0 0-37.4272 37.4272 38.7072 38.7072 0 1 1-77.4144 0 115.0976 115.0976 0 0 1 114.8416-114.8416h335.4624a115.0976 115.0976 0 0 1 114.8416 114.8416v335.4624a115.0976 115.0976 0 0 1-114.8416 114.8416z" p-id="5413" ></path>
                            <path d="M589.4656 883.0976H268.1856a121.1392 121.1392 0 0 1-121.2928-121.2928v-322.56a121.1392 121.1392 0 0 1 121.2928-121.344h321.28a121.1392 121.1392 0 0 1 121.2928 121.2928v322.56c1.28 67.1232-54.1696 121.344-121.2928 121.344zM268.1856 395.3152a43.52 43.52 0 0 0-43.8784 43.8784v322.56a43.52 43.52 0 0 0 43.8784 43.8784h321.28a43.52 43.52 0 0 0 43.8784-43.8784v-322.56a43.52 43.52 0 0 0-43.8784-43.8784z" p-id="5414" ></path>
                        </svg>
                    </div>
                </button>
                <button class="twitter-Btn" id="download-${classText}">
                    <div class="svgClass">
                        <svg t="1694962091616" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" id="mx_n_1694962091617" width="20" height="20">
                            <path d="M160 579.2a28.8 28.8 0 0 1 28.8 28.8v170.672c0 30.4 25.664 56.528 59.2 56.528h528c33.536 0 59.2-26.144 59.2-56.528V608a28.8 28.8 0 0 1 57.6 0v170.672c0 63.856-53.12 114.128-116.8 114.128h-528c-63.68 0-116.8-50.272-116.8-114.128V608a28.8 28.8 0 0 1 28.8-28.8z"  p-id="4130"></path><path d="M540.8 176l0 464a28.8 28.8 0 0 1-57.6 0L483.2 176a28.8 28.8 0 0 1 57.6 0z"  p-id="4131"></path>
                            <path d="M331.632 459.632a28.8 28.8 0 0 1 40.736 0l160 160a28.8 28.8 0 0 1-40.736 40.736l-160-160a28.8 28.8 0 0 1 0-40.736z" p-id="4132"></path><path d="M692.368 459.632a28.8 28.8 0 0 0-40.736 0l-160 160a28.8 28.8 0 0 0 40.736 40.736l160-160a28.8 28.8 0 0 0 0-40.736z" p-id="4133"></path>
                        </svg>
                    </div>
                </button>
                <button class="twitter-Btn share-btn" id="share-${classText}">
                    <div class="svgClass">
                        <svg t="1713618483987" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2790" width="20" height="20">
                            <path d="M720.020242 809.16812c0-49.233308 39.919175-89.151459 89.151459-89.151459s89.150436 39.918151 89.150436 89.151459c0 49.227168-39.918151 89.159646-89.150436 89.159646S720.020242 858.397335 720.020242 809.16812zM571.433112 214.824717c0-49.234331 39.919175-89.152483 89.151459-89.152483 49.234331 0 89.152483 39.918151 89.152483 89.152483 0 49.232285-39.918151 89.151459-89.152483 89.151459C611.352287 303.976176 571.433112 264.057001 571.433112 214.824717zM125.674792 675.441443c0-82.07018 66.530252-148.586107 148.585083-148.586107 82.056877 0 148.58713 66.515926 148.58713 148.586107 0 82.071204-66.531276 148.58713-148.58713 148.58713C192.205045 824.028573 125.674792 757.511623 125.674792 675.441443zM66.240145 675.441443c0 114.89375 93.142353 208.027917 208.019731 208.027917 81.402985 0 151.8525-46.752814 186.03809-114.870214l200.360284 35.288714-0.073678 5.28026c0 82.07632 66.531276 148.594293 148.58713 148.594293s148.586107-66.517973 148.586107-148.594293c0-82.072227-66.530252-148.586107-148.586107-148.586107-59.507302 0-110.815875 34.927487-134.554532 85.436858l-195.454554-34.403554c2.059915-11.738345 3.119037-23.839965 3.119037-36.174897 0-54.311976-20.822235-103.748922-54.892191-140.779304l180.740434-180.755784c16.309454 6.152117 33.983999 9.503445 52.454676 9.503445 82.056877 0 148.58713-66.514903 148.58713-148.586107 0-82.07018-66.530252-148.58713-148.58713-148.58713-82.055854 0-148.585083 66.51695-148.585083 148.58713 0 41.674145 17.165961 79.32772 44.792159 106.317421L381.013225 496.92056c-31.211862-18.71934-67.703985-29.499871-106.753349-29.499871C159.382499 467.421712 66.240145 560.549739 66.240145 675.441443z" p-id="2791"></path>
                        </svg>
                    </div>
                </button>
            </div>`;
    return buttonHtml;
  }

  function appendBtn(parentElement, newUrl, buttonHtml, classText, like, time) {
    // 创建按钮元素
    let button = document.createElement('div');
    button.setAttribute('data-nsfw', 'x');
    button.innerHTML = buttonHtml;

    // 按钮点击事件处理程序
    button.querySelector(`#copy-${classText}`).addEventListener('click', () => navigator.clipboard.writeText(newUrl));

    // 发起fetch请求获取图片内容
    button.querySelector(`#download-${classText}`).addEventListener('click', () => {
      // 点击喜欢按钮
      let likeDiv = like.querySelector('[data-testid="like"]');
      if (likeDiv) {
        likeDiv.click();
      }

      let url = parentElement.querySelector('a').href.replace(/\/photo\/\d+$/, '');

      let date = new Date(time.getAttribute('datetime'));
      let formattedDate =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' + // 月份从 0 开始，需要加 1
        String(date.getDate()).padStart(2, '0') +
        ' ' +
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0') +
        ':' +
        String(date.getSeconds()).padStart(2, '0');

      fetch(newUrl)
        .then(function (response) {
          if (response.ok) {
            return response.blob(); // 以Blob形式解析响应内容
          } else {
            throw new Error('下载失败');
          }
        })
        .then(function (imageBlob) {
          // 创建一个Blob URL，用于保存图片内容
          var imageUrl = URL.createObjectURL(imageBlob);

          let urlParams = new URL(newUrl);
          // 创建一个下载链接
          var downloadLink = document.createElement('a');
          downloadLink.href = imageUrl;
          downloadLink.download =
            urlParams.pathname.substring(urlParams.pathname.lastIndexOf('/') + 1) + '.' + urlParams.searchParams.get('format');

          // 模拟用户点击下载链接
          downloadLink.click();

          // 释放Blob URL以节省内存
          URL.revokeObjectURL(imageUrl);
        })
        .catch(function (error) {
          console.error('下载失败：', error);
        });

      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.mossia.top/add/xPicture',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          url: url,
          pictureUrl: newUrl,
          xCreateDate: formattedDate,
          createBy: userName,
        }),
        onload: function (response) {
          let result = JSON.parse(response.responseText);
        },
        onerror: function (error) {
          console.error('Request failed:', error);
        },
      });
    });

    // 发起分享图片
    button.querySelector(`#share-${classText}`).addEventListener('click', () => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: share_url, // 目标 URL
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ imageUrl: newUrl }),
        onload: function (response) {
          var responseData = JSON.parse(response.responseText);
          console.log('Received response:', responseData);
        },
        onerror: function (error) {
          console.error('Request failed:', error);
        },
      });
      GM_xmlhttpRequest({
        method: 'POST',
        url: share_url_two, // 目标 URL
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ urls: [newUrl] }),
        onload: function (response) {
          var responseData = JSON.parse(response.responseText);
          console.log('Received response:', responseData);
        },
        onerror: function (error) {
          console.error('Request failed:', error);
        },
      });
    });

    parentElement.appendChild(button);
  }

  function getParentByNum(element, number) {
    let ancestor = element;
    for (let i = 0; i < number; i++) {
      if (ancestor.parentElement) {
        ancestor = ancestor.parentElement;
      } else {
        break;
      }
    }
    return ancestor;
  }

  /**
   * @param {string} urlString
   */
  function replaceImageSizeName(urlString) {
    // 替换name参数的值为"orig"
    const url = new URL(urlString);
    url.searchParams.set('name', 'orig');
    return url.toString();
  }

  /**
   * @param {number} max
   */
  function getRandomIntExclusive(max) {
    return Math.floor(Math.random() * max);
  }
})();
