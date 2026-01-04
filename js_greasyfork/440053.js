// ==UserScript==
// @name         Import Pinterest images to LingQuan
// @name:zh      批量采集 Pinterest 图片到 LingQuan
// @namespace    https://lingquan.cool/
// @version      0.0.1

// @description         This script will automatically scroll the page when pinterest is running, and import the pictures into the LingQuan APP. When using it, please make sure that the LingQuan APP has been opened.
// @description:zh      这个脚本在pinterest运行时会自动滚动页面，并将图片导入到LingQuan APP，使用时，请确保LingQuan APP已经打开。

// @author       tingyu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinterest.com

// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @run-at       context-menu

// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/440053/Import%20Pinterest%20images%20to%20LingQuan.user.js
// @updateURL https://update.greasyfork.org/scripts/440053/Import%20Pinterest%20images%20to%20LingQuan.meta.js
// ==/UserScript==

(function () {
  if (location.href.indexOf("pinterest.") === -1) {
    alert("This script only works on pinterest.com.");
    return;
  }

  // LINGQUAN API
  const LINGQUAN_SERVER_URL = "http://localhost:55735";
  const LINGQUAN_IMPORT_API_URL = `${LINGQUAN_SERVER_URL}/api/item/addFromBrowser`;
  const LINGQUAN_CREATE_FOLDER_API_URL = `${LINGQUAN_SERVER_URL}/api/folder/create`;

  let SELECTOR_IMAGE = "[data-grid-item] a img[loading]";
  const SELECTOR_LINK = "[data-grid-item] a";
  let retryCount = 0; //当前滚动重试次数
  let RETRY_THRESHOLD = 100; //无法滚动页面重试次数，当超过次数，表示到底部了
  let lastScrollHeight = 0;
  var distance = 900;
  var interval = 60;
  let isCache = false;
  /*if (document.body.scrollHeight > 4000) {
    isCache = true;
    distance = 125;
    interval = 250;
    RETRY_THRESHOLD = 20;
    SELECTOR_IMAGE = "[data-grid-item] a img[srcset]";
  }*/
  window.scrollTo(0, 0);
  let id = "";
  let imgs = new Map();



  // 创建文件夹,成功时返回folder_id
  var createFolder = function (folderName, callback) {
    GM_xmlhttpRequest({
      url: LINGQUAN_CREATE_FOLDER_API_URL,
      method: "POST",
      data: JSON.stringify({ folderName: folderName }),
      headers: {
      "content-type": "application/json"
      },
      responseType:"text",
      onload: function (response) {
        console.log(response)
        try {
          var result = JSON.parse(response.response);
          if (result.status === "success" && result.data && result.data.id) {
            id = result.data.id
            //console.log(`folderId:${id}`)
            callback(undefined, result.data);
          } else {
            callback(true);
          }
        } catch (err) {
          callback(true);
        }
      },
    });
  };

  var addImgsToLINGQUAN = function (images, callback) {
    //console.log(images,id)

    GM_xmlhttpRequest({
      url: LINGQUAN_IMPORT_API_URL,
      method: "POST",
      data: JSON.stringify({ items: images, folderId: id }),
      headers: {
      "content-type": "application/json"
      },
      responseType:"text",
      onload: function (response) {
        try {
          var result = JSON.parse(response.response);
          if (result.data.isDone === true) {
            callback(false);
          } else {
            callback(true);
          }
        } catch (err) {
          callback(true);
        }
      },
    });
  };

  if (!isCache) {
    main();
  } else {
    //mainCache();
    main();
  }

  function main() {
    // 创建本次保存使用文件夹
    var folderName =
      (document.querySelector("h1") &&
        document.querySelector("h1").innerText) ||
      "Pinterest";
    let timer = null;
    createFolder(folderName, function (err, folder) {
      console.log(folder)
      if (folder) {
        // 持续滚动列表，直到列表没有更多内容
        id = folder.id;
        timer = setInterval(() => {
          //页面的高度 包含滚动高度
          var scrollHeight = document.body.scrollHeight;
          //滚动条向下滚动 distance
          window.scrollBy(0, distance);
          if (lastScrollHeight == scrollHeight) {
            retryCount += 1;
          } else {
            let contents = document.body.querySelectorAll(".mobileGrid");
            if (contents.length > 1) {
              end();
              return;
            }
            let images = getImgs(contents[0]);
            retryCount = 0;
            addImgsToLINGQUAN(images,(res)=>{
               if(res === false){
                  end()
               }
            })
          }
          if (lastScrollHeight + distance > scrollHeight) {
            lastScrollHeight = scrollHeight;
          } else {
            lastScrollHeight += distance;
          }

          console.log(lastScrollHeight, document.body.scrollHeight);
          if (retryCount >= RETRY_THRESHOLD) {
            end();
          }
        }, interval);
      } else {
        alert(
          "软件尚未打开，或当前软件版本不支持，需至 LINGQUAN 官网下载，手动重新安装最新版本"
        );
      }
    });

    function getImgs() {
      let imgElements = Array.from(document.querySelectorAll(SELECTOR_IMAGE));
      var getLink = function (img) {
        var links = Array.from(document.querySelectorAll(SELECTOR_LINK));
        for (var i = 0; i < links.length; i++) {
          const regPin = /.*\/pin\/.+/;
          if (links[i].contains(img) && regPin.test(links[i].href)) {
            return absolutePath(links[i].href);
          }
        }
        return "";
      };

      var getTitle = function (img) {
        var gridItem = img.closest("[data-grid-item]");
        if (gridItem && gridItem.textContent) {
          return gridItem.textContent;
        }
        return img.alt || "";
      };

      let content = new Array();

      imgElements.forEach(function (elem, index) {
        let website = getLink(elem); // 取得图片链接
        if (website.length < 10) {//去除无效链接
          return;
        }
        imgs.set(website, {
          name: getTitle(elem),
          url: getHighestImg(elem) || elem.src, // getHighestImg:取得最大分辨率
          website,
        });
        content.push({
          name: getTitle(elem),
          url: getHighestImg(elem) || elem.src, // getHighestImg:取得最大分辨率
          website,
        });
      });

      return content

      function absolutePath(href) {
        if (href && href.indexOf(" ") > -1) {
          href = href.trim().split(" ")[0];
        }
        var link = document.createElement("a");
        link.href = href;
        return link.href;
      }

      function getHighestImg(element) {
        if (element.getAttribute("srcset")) {
          let highResImgUrl = "";
          let maxRes = 0;
          let imgWidth, urlWidthArr;
          element
            .getAttribute("srcset")
            .split(",")
            .forEach((item) => {
              urlWidthArr = item.trim().split(" ");
              imgWidth = parseInt(urlWidthArr[1]);
              if (imgWidth > maxRes) {
                maxRes = imgWidth;
                highResImgUrl = urlWidthArr[0];
              }
            });
          return highResImgUrl;
        } else {
          return element.getAttribute("src");
        }
      }
    }

    function end() {
      console.log(imgs);
      alert(`imgs was added to Lingquan`)
      clearInterval(timer);
    }
  }

  function mainCache() {}
})();

