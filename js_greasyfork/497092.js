// ==UserScript==
// @name         pixiv获取原图
// @namespace    https://github.com/MuXia-0326/twitter-auto-original-picture
// @version      1.13
// @description  pixiv页面生成按钮用于复制原图链接和下载原图
// @author       Mossia
// @icon         https://raw.githubusercontent.com/MuXia-0326/drawio/master/angri.png
// @match        *://www.pixiv.net/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497092/pixiv%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497092/pixiv%E8%8E%B7%E5%8F%96%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

const css = `
.pixiv-Btn {
  z-index: 1000;
  position: relative;
  display: inline-block;
  margin-right: 5px;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 1px;
  text-decoration: none;
  color: rgb(0, 150, 250);
  background: transparent;
  cursor: pointer;
  transition: ease-out 0.5s;
  border: 2px solid rgb(0, 150, 250);
  border-radius: 10px;
  box-shadow: inset 0 0 0 0 rgb(0, 150, 250);
}
.pixiv-Btn:hover {
  color: white;
  box-shadow: inset 0 -100px 0 0 rgb(0, 150, 250);
}
.pixiv-Btn:active {
  transform: scale(0.9);
}
.pixiv-Btn:hover svg {
  fill: white;
}
.pixiv-Btn:active svg, .pixiv-Btn svg {
  fill: rgb(0, 150, 250);
}


.Btn {
  position: absolute;
  right: 0px;
  bottom: 0px;
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

function ILog() {
  this.prefix = '';

  this.v = function (value) {
    if (level <= this.LogLevel.Verbose) {
      console.log(this.prefix + value);
    }
  };

  this.i = function (info) {
    if (level <= this.LogLevel.Info) {
      console.info(this.prefix + info);
    }
  };

  this.w = function (warning) {
    if (level <= this.LogLevel.Warning) {
      console.warn(this.prefix + warning);
    }
  };

  this.e = function (error) {
    if (level <= this.LogLevel.Error) {
      console.error(this.prefix + error);
    }
  };

  this.d = function (element) {
    if (level <= this.LogLevel.Verbose) {
      console.log(element);
    }
  };

  this.setLogLevel = function (logLevel) {
    level = logLevel;
  };

  this.LogLevel = {
    Verbose: 0,
    Info: 1,
    Warning: 2,
    Error: 3,
  };

  let level = this.LogLevel.Warning;
}
var iLog = new ILog();

// let pixiv_proxy = 'https://i.pixiv.cat';
let pixiv_proxy = 'https://pixiv.mossia.top';
let g_getArtworkUrl = '/ajax/illust/#id#/pages';

let share_url = '';
let share_url_two = '';
let userName = '';

// 当前页面类型
let g_pageType = -1;

// 页面相关的一些预定义，包括处理页面元素等
let PageType = {
  // 作品详情页
  Artwork: 0,

  // 总数
  PageTypeCount: 1,
};

/* Pages 必须实现的函数
 * PageTypeString: string，字符串形式的 PageType
 * bool CheckUrl: function(string url)，用于检查一个 url 是否是当前页面的目标 url
 * ProcessPageElements: function()，处理页面（寻找图片元素、添加按钮）
 */
let Pages = {};

Pages[PageType.Artwork] = {
  PageTypeString: 'ArtworkPage',
  CheckUrl: function (url) {
    return /^https:\/\/www.pixiv.net\/artworks\/.*/.test(url) || /^https:\/\/www.pixiv.net\/en\/artworks\/.*/.test(url);
  },
  ProcessPageElements: function () {
    if (userName === '') {
      getUserName();
    }

    // 动图不处理
    if (document.querySelector('main figure canvas')) {
      return;
    }

    // 未加载完不处理
    if (!document.querySelector('main figure')) {
      return;
    }

    let allImage = document.querySelector('main figure').parentNode.querySelector('section + button');
    if (allImage) {
      allImage.click();
    }

    let matched = location.href.match(/artworks\/(\d+)/);
    if (!matched) {
      return;
    }

    let pid = matched[1];
    let url = g_getArtworkUrl.replace('#id#', pid);

    let original = [];

    //生成按钮
    let divImages = document.querySelectorAll('main figure div:first-child div[role="presentation"]');
    divImages.forEach((e, i) => {
      let _this = e;
      let image = _this.querySelector('a').parentNode;
      if (image.querySelector('.Btn') && image.querySelector('.Btn').getAttribute('data-pid') === pid) {
        return;
      }

      fetch(url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((json) => {
          iLog.i('Got artwork urls:');

          if (json.error === true) {
            iLog.e('Server responsed an error: ' + json.message);
            return;
          }

          for (let i = 0; i < json.body.length; i++) {
            original.push(json.body[i].urls.original);
          }
        })
        .catch((error) => {
          iLog.e('Request image urls failed!');
          if (error) {
            iLog.e(error);
          }
        });

      let btns = image.querySelectorAll('.Btn');
      if (btns.length > 0) {
        btns.forEach((btn) => btn.remove());
      }
      let div = document.createElement('div');

      div.innerHTML = `
            <div class="Btn" data-pid=${pid}>
                <button class="pixiv-Btn" id="cp_${i}">
                    <div class="svgClass">
                        <svg t="1694962361717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5412" width="20" height="20">
                            <path d="M761.088 715.3152a38.7072 38.7072 0 0 1 0-77.4144 37.4272 37.4272 0 0 0 37.4272-37.4272V265.0112a37.4272 37.4272 0 0 0-37.4272-37.4272H425.6256a37.4272 37.4272 0 0 0-37.4272 37.4272 38.7072 38.7072 0 1 1-77.4144 0 115.0976 115.0976 0 0 1 114.8416-114.8416h335.4624a115.0976 115.0976 0 0 1 114.8416 114.8416v335.4624a115.0976 115.0976 0 0 1-114.8416 114.8416z" p-id="5413" ></path>
                            <path d="M589.4656 883.0976H268.1856a121.1392 121.1392 0 0 1-121.2928-121.2928v-322.56a121.1392 121.1392 0 0 1 121.2928-121.344h321.28a121.1392 121.1392 0 0 1 121.2928 121.2928v322.56c1.28 67.1232-54.1696 121.344-121.2928 121.344zM268.1856 395.3152a43.52 43.52 0 0 0-43.8784 43.8784v322.56a43.52 43.52 0 0 0 43.8784 43.8784h321.28a43.52 43.52 0 0 0 43.8784-43.8784v-322.56a43.52 43.52 0 0 0-43.8784-43.8784z" p-id="5414" ></path>
                        </svg>
                    </div>
                </button>
                <button class="pixiv-Btn" id="download_${i}">
                    <div class="svgClass">
                        <svg t="1694962091616" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4129" id="mx_n_1694962091617" width="20" height="20">
                            <path d="M160 579.2a28.8 28.8 0 0 1 28.8 28.8v170.672c0 30.4 25.664 56.528 59.2 56.528h528c33.536 0 59.2-26.144 59.2-56.528V608a28.8 28.8 0 0 1 57.6 0v170.672c0 63.856-53.12 114.128-116.8 114.128h-528c-63.68 0-116.8-50.272-116.8-114.128V608a28.8 28.8 0 0 1 28.8-28.8z"  p-id="4130"></path><path d="M540.8 176l0 464a28.8 28.8 0 0 1-57.6 0L483.2 176a28.8 28.8 0 0 1 57.6 0z"  p-id="4131"></path>
                            <path d="M331.632 459.632a28.8 28.8 0 0 1 40.736 0l160 160a28.8 28.8 0 0 1-40.736 40.736l-160-160a28.8 28.8 0 0 1 0-40.736z" p-id="4132"></path><path d="M692.368 459.632a28.8 28.8 0 0 0-40.736 0l-160 160a28.8 28.8 0 0 0 40.736 40.736l160-160a28.8 28.8 0 0 0 0-40.736z" p-id="4133"></path>
                        </svg>
                    </div>
                </button>
                <button class="pixiv-Btn share-btn" id="share_${i}">
                    <div class="svgClass">
                        <svg t="1713618483987" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2790" width="20" height="20">
                            <path d="M720.020242 809.16812c0-49.233308 39.919175-89.151459 89.151459-89.151459s89.150436 39.918151 89.150436 89.151459c0 49.227168-39.918151 89.159646-89.150436 89.159646S720.020242 858.397335 720.020242 809.16812zM571.433112 214.824717c0-49.234331 39.919175-89.152483 89.151459-89.152483 49.234331 0 89.152483 39.918151 89.152483 89.152483 0 49.232285-39.918151 89.151459-89.152483 89.151459C611.352287 303.976176 571.433112 264.057001 571.433112 214.824717zM125.674792 675.441443c0-82.07018 66.530252-148.586107 148.585083-148.586107 82.056877 0 148.58713 66.515926 148.58713 148.586107 0 82.071204-66.531276 148.58713-148.58713 148.58713C192.205045 824.028573 125.674792 757.511623 125.674792 675.441443zM66.240145 675.441443c0 114.89375 93.142353 208.027917 208.019731 208.027917 81.402985 0 151.8525-46.752814 186.03809-114.870214l200.360284 35.288714-0.073678 5.28026c0 82.07632 66.531276 148.594293 148.58713 148.594293s148.586107-66.517973 148.586107-148.594293c0-82.072227-66.530252-148.586107-148.586107-148.586107-59.507302 0-110.815875 34.927487-134.554532 85.436858l-195.454554-34.403554c2.059915-11.738345 3.119037-23.839965 3.119037-36.174897 0-54.311976-20.822235-103.748922-54.892191-140.779304l180.740434-180.755784c16.309454 6.152117 33.983999 9.503445 52.454676 9.503445 82.056877 0 148.58713-66.514903 148.58713-148.586107 0-82.07018-66.530252-148.58713-148.58713-148.58713-82.055854 0-148.585083 66.51695-148.585083 148.58713 0 41.674145 17.165961 79.32772 44.792159 106.317421L381.013225 496.92056c-31.211862-18.71934-67.703985-29.499871-106.753349-29.499871C159.382499 467.421712 66.240145 560.549739 66.240145 675.441443z" p-id="2791"></path>
                        </svg>
                    </div>
                </button>
            </div>
            `;

      image.appendChild(div);

      document.getElementById(`cp_${i}`).addEventListener('click', function () {
        let newUrl = original[i].replace('https://i.pximg.net', pixiv_proxy);
        navigator.clipboard.writeText(newUrl);
      });

      document.getElementById(`download_${i}`).addEventListener('click', function () {
        // 点击喜欢按钮
        let section = document.querySelector('main section section');
        let likeDiv = section.children[2];

        if (likeDiv) {
          let a = likeDiv.querySelector('a');
          if (!a) {
            likeDiv.querySelector('button').click();
          }
        }

        let newUrl = original[i];

        GM_xmlhttpRequest({
          method: 'GET',
          url: newUrl,
          headers: {
            Referer: 'https://www.pixiv.net/',
          },
          responseType: 'blob', // 添加这一行
          onload: function (response) {
            if (response.status === 200) {
              var blobUrl = URL.createObjectURL(response.response);
              GM_download(blobUrl, newUrl.substring(newUrl.lastIndexOf('/') + 1));
            } else {
              console.error('Download failed:', response.statusText);
            }
          },
        });

        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://api.mossia.top/add/pPidQueue',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            pidList: [pid],
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

      document.getElementById(`share_${i}`).addEventListener('click', function () {
        let newUrl = original[i].replace('https://i.pximg.net', pixiv_proxy);
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
    });
  },
};

function main() {
  // 匹配当前页面
  for (let i = 0; i < PageType.PageTypeCount; i++) {
    if (Pages[i].CheckUrl(location.href)) {
      g_pageType = i;
      break;
    }
  }

  if (g_pageType >= 0) {
    iLog.i('当前页面类型：' + Pages[g_pageType].PageTypeString);
  } else {
    iLog.i('当前页面类型：未知');
    clearInterval(mainInterval);
    return;
  }

  // 执行操作
  Pages[g_pageType].ProcessPageElements();
}

function getUserName() {
  var div = document.querySelector('button.flex.gap-8.items-center.p-0.text-text3');
  let nameDiv = div.querySelector('div.sc-31291b51-0.PfjcA');
  userName = nameDiv.getAttribute('title');
}

let mainInterval = setInterval(main, 200);
