// ==UserScript==
// @name         花瓣下载素材 - 星星专属
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  给花瓣的图加上“下载”按钮，方便下载
// @author       snow
// @license      MIT
// @match        *://huaban.com/*
// @match        *://hbimg.huabanimg.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      gd-hbimg.huaban.com
// @downloadURL https://update.greasyfork.org/scripts/544289/%E8%8A%B1%E7%93%A3%E4%B8%8B%E8%BD%BD%E7%B4%A0%E6%9D%90%20-%20%E6%98%9F%E6%98%9F%E4%B8%93%E5%B1%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/544289/%E8%8A%B1%E7%93%A3%E4%B8%8B%E8%BD%BD%E7%B4%A0%E6%9D%90%20-%20%E6%98%9F%E6%98%9F%E4%B8%93%E5%B1%9E.meta.js
// ==/UserScript==
/*
 *
 *
 * 本脚本参考了潘志城_Neo的花瓣 - 添加下载按钮 相关实现思路，在此基础上修改，在此表示感谢。
 * 特别感谢以下资源提供的灵感：
 * - Greasy Fork社区的相关用户脚本
 * - 各类花瓣网辅助工具的开源实现
 *
 * 本脚本为个人学习研究用途开发，仅用于提升用户体验，
 * 无意侵犯任何网站权益。如涉及侵权，请及时联系，
 * 我将立即删除相关代码。
 *
 * 本脚本完全免费，仅供个人使用，禁止用于任何商业用途。
 * 使用本脚本产生的一切后果由使用者自行承担。
 */
(function () {
  "use strict";

  // 所有图片
  var allImages = [];
  // 按钮样式
  var btnStyleText =
    "border:0; color:#ffffff ;background-color: rgb(26 179 125 / 75%);border-radius:8px;padding:3px 12px;cursor:pointer;pointer-events:all;";
  var interval = null;

  var defaultSetting = {
    prefix: "HB", // 前缀
    show_notification: true, // 是否显示通知消息
    rename: false, // 是否重命名
    show_source_img: true, // 是否显示大图
    show_img_title: false, // 是否显示图片标题
    download_type: "gm_download", // 下载方式
  };

  // 配置信息
  var setting = GM_getValue("setting");
  if (!setting) {
    setting = Object.assign({}, defaultSetting);
  } else {
    setting = Object.assign({}, defaultSetting, setting);
  }
  GM_setValue("setting", setting);
  // 主函数
  function main() {
    document.body.addEventListener("click", function (e) {
      // 点击img标签的时候才尝试添加下载按钮
      if ((e, e.target.tagName === "IMG")) {
        addDonwloadBtnToPreivew();
      }
    });
    // 网页滚动的时候，检测图片是否有添加下载按钮，没有就添加
    document.addEventListener("scroll", throttle(addDownloadBtn, 300));

    addDownloadBtn();
    interval = setInterval(() => {
      if (allImages.length === 0) {
        addDownloadBtn();
      } else {
        clearInterval(interval);
      }
    }, 1500);
  }
  main();

  /**
   * 添加下载按钮(如果有按钮，就不添加)
   */
  function addDownloadBtn() {
    if (document.URL.includes("pins")) {
      addDonwloadBtnToPreivew();
    } else {
      if (!document.URL.includes("user")) {
        addDownloadBtnToDiscovery();
        addDonwloadAllBtn();
      }
    }
  }


  // 修改后的下载全部功能
function addDonwloadAllBtn() {
    // 创建下载按钮
    var downloadBtn = document.createElement("button");
    downloadBtn.innerText = "下载全部";
    downloadBtn.style.cssText = btnStyleText + 
        "position: fixed;" +
        "right: 20px;" +
        "top: 30%;" +
        "border-radius: 12px;" +
        "padding: 9px 12px;" +
        "z-index: 1000;" +
        "cursor: pointer;";
    downloadBtn.className = "neo_add_btn";
    
    // 添加点击事件
    downloadBtn.addEventListener("click", function() {
        // 显示确认对话框
        if (confirm("确定要下载本页所有图片吗？这可能需要一些时间。")) {
            downloadAllImages();
        }
    });

    // 添加到页面
    document.body.appendChild(downloadBtn);
}

// 改进的下载所有图片函数
function downloadAllImages() {


        // 获取包含所有图片的外层容器
    const container = document.querySelector(
      ".infinite-scroll-component__outerdiv"
    );
    console.log(container,'////////////////////////////////////////////')

    if (!container) {
      console.error("未找到 infinite-scroll-component__outerdiv 元素");
      return;
    }

    // 获取所有img元素
    const images = container.querySelectorAll("img");
    if (images.length === 0) {
      console.log("未找到任何图片");
      return;
    }

    console.log(`找到 ${images.length} 张图片，开始下载...`);

    // 显示开始下载通知
    show_notification({
        text: `开始下载 ${images.length} 张图片`,
        title: "下载任务开始",
        timeout: 3000
    });

    // 遍历所有图片并下载
    images.forEach((img, index) => {
        // 延迟执行，避免浏览器同时发起过多请求
        setTimeout(() => {
            const pinInfo = img.parentNode.href.split("/");
            const imgInfo = {
                title: img.getAttribute("alt") || `图片_${index + 1}`,
                src: img.getAttribute("src").replace("_fw240webp", ""),
                pin: pinInfo[pinInfo.length - 1]
            };
            
            // 下载单张图片
            downloadImage(imgInfo);
            
            // 显示进度通知
            if ((index + 1) % 5 === 0 || index + 1 === images.length) {
                show_notification({
                    text: `已下载 ${index + 1}/${images.length} 张图片`,
                    title: "下载进度",
                    timeout: 2000
                });
            }
        }, index * 1000); // 每1秒下载一张，避免触发网站的防爬机制
    });
}


  // 单张图片下载函数
  function downloadImage(url, index) {
    console.log(`正在下载第 ${index} 张图片: ${url}`);

    // 创建一个隐藏的a标签用于下载
    const a = document.createElement("a");
    a.href = url;
    a.download = `image_${index}.jpg`; // 可以自定义文件名
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(`第 ${index} 张图片下载完成`);
  }

  // 执行下载
  function addDownloadBtnToDiscovery() {
    // Add loading indicator
    var loadingIndicator = document.createElement("div");
    loadingIndicator.innerText = "脚本加载中...";
    loadingIndicator.style.cssText = `
    position: fixed;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
    document.body.appendChild(loadingIndicator);

    allImages = document.querySelectorAll(".transparent-img-bg.hb-image");
    allImages.forEach((dom) => {
      var pinInfo = dom.parentNode.href.split("/");
      // 图片标题和样式
      var imgInfo = {
        title: dom.getAttribute("alt"),
        src: dom.getAttribute("src"),
        pin: pinInfo[pinInfo.length - 1],
      };
      // 和包含图片的a标签同级的节点
      var tempList = dom.parentNode.parentNode.childNodes;
      // 图片dom
      var imgNode = tempList[tempList.length - 1];
      // 与图片父级a标签同级，并处于上方的元素
      var lookNode = tempList[tempList.length - 2];

      lookNode.setAttribute("hidden", true);
      lookNode.className = "";
      lookNode.style.cssText =
        "position: absolute;bottom: 8px; right: 8px; display: flex; flex-direction: row;align-items: center;z-index:1";
      // 添加鼠标悬停时的样式
      lookNode.parentNode.addEventListener("mouseover", function () {
        lookNode.removeAttribute("hidden");
      });

      // 移除鼠标悬停时的样式
      lookNode.parentNode.addEventListener("mouseout", function () {
        lookNode.setAttribute("hidden", true);
      });
      if (lookNode.querySelectorAll(".neo_add").length === 0) {
        var btnContainer = document.createElement("div");
        btnContainer.style = "display:flex;";

        if (setting.show_source_img) {
          // 添加打开大图按钮
          var sourceBtn = document.createElement("div");
          sourceBtn.className = "neo_add_source";
          sourceBtn.innerText = "大图";
          sourceBtn.addEventListener("click", () => {
            window.open(imgInfo.src.replace("_fw240webp", ""));
          });

          sourceBtn.style.cssText = btnStyleText + "margin-left:3px;";
          btnContainer.appendChild(sourceBtn);
        }
        // 添加下载图片按钮
        var downloadBtn = document.createElement("div");
        downloadBtn.className = "neo_add";
        downloadBtn.innerText = "下载";
        downloadBtn.addEventListener("click", () => {
          downloadImage(imgInfo);
        });

        downloadBtn.style.cssText = btnStyleText + "margin-left:3px;";
        btnContainer.appendChild(downloadBtn);
        lookNode.insertBefore(btnContainer, null);
        // 添加图片标题
        if (setting.show_img_title) {
          var domTitle = document.createElement("div");
          domTitle.innerText = imgInfo.title;
          domTitle.title = imgInfo.title;
          domTitle.style.cssText =
            "padding-left:5px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; color: rgba(30,32,35,.65);height:3em;";
          dom.parentNode.parentNode.parentNode.appendChild(domTitle);
        }
      }
    });
    // Remove loading indicator when done
    setTimeout(() => {
      loadingIndicator.remove();
    }, 1000);
  }

  function addDonwloadBtnToPreivew() {
    var newBtn = document.createElement("button");
    newBtn.innerText = "画板";
    newBtn.style.cssText =
      btnStyleText + "border-radius:12px;padding:9px 12px;margin-left:10px;";
    newBtn.className = "neo_add_btn";
    newBtn.addEventListener("click", function () {
      window.open("https://huaban.com/space", "_blank");
    });

    var downloadBtn = document.createElement("button");
    downloadBtn.innerText = "下载";
    downloadBtn.style.cssText =
      btnStyleText + "border-radius:12px;padding:9px 12px;margin-left:10px;";
    downloadBtn.className = "neo_add_btn";
    downloadBtn.addEventListener("click", function () {
      download();
    });

    function download() {
      var imgDom = document.querySelector("#pin_detail div img");
      var pinInfo = document.URL.split("/");
      var imgInfo = {};
      imgInfo.title = imgDom.alt;
      imgInfo.src = imgDom.src;
      imgInfo.pin = pinInfo[pinInfo.length - 1];
      downloadImage(imgInfo);
    }

    // 创建提示文字元素
    var tipElement = document.createElement("div");
    tipElement.innerHTML =
      "<span style='color:#f56c6c;font-size:12px;'>无水印素材可直接下载, ⚠️水印素材先点采集,再统一去画板里面下载</span>";
    tipElement.style.cssText =
      "position:absolute;right:0;top:-23px;background:linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);padding:10px 8px;border-radius:12px;";
    var count = 0;
    var maxCount = 8;
    var interval = setInterval(function () {
      var btnDom = document.querySelector("#pin_detail div button");
      if (btnDom) {
        clearInterval(interval);
        var neoAddDom = document.querySelector(
          "#pin_detail div button.neo_add_btn"
        );
        if (neoAddDom) return;

        // 确保pin_detail有relative定位
        var pinDetail = document.querySelector("#pin_detail");
        if (pinDetail) {
          pinDetail.style.position = "relative";
          // 添加按钮和提示
          btnDom.parentNode.appendChild(downloadBtn);
          btnDom.parentNode.appendChild(newBtn);
          pinDetail.appendChild(tipElement);
        }
      }
      if (count >= maxCount) {
        clearInterval(interval);
      } else {
        count++;
      }
    }, 1000);
  }

  /**
   * 下载图片
   * @param {Object} imgInfo src：图片链接; title：图片标题
   */

  function sanitizeFilename(name) {
    return name.replace(/[\\/:*?"<>|]/g, "_");
  }
  function downloadImage(imgInfo) {
    const extension = getExtensionFromUrl(imgInfo.src);
    let imgTitle = imgInfo.title ? sanitizeFilename(imgInfo.title) : "无标题";

    if (setting.rename) {
      imgTitle =
        (setting.prefix ? setting.prefix + "-" : "") +
        formatDate(new Date()) +
        "-" +
        imgInfo.pin;
    }

    imgInfo.src = imgInfo.src.replace(/(_fw\d+.*|_sq\d+.*)/, "");

    show_notification({
      text: imgTitle,
      title: "图片已添加下载",
      timeout: 2000,
    });

    switch (setting.download_type) {
      case "gm_download":
        imageDownload_with_gm_download(imgInfo.src, imgTitle, extension);
        break;
      case "fetch":
        imageDownload_with_fetch(imgInfo.src, imgTitle, extension);
        break;
      case "xhr":
        imageDownload_with_Xhr_download(imgInfo.src, imgTitle, extension);
        break;
      case "xmlhttpRequest":
        imageDownload_with_xmlhttpRequest_download(imgInfo.src, imgTitle);
        break;
      default:
        imageDownload_with_Xhr_download(imgInfo.src, imgTitle, extension);
        break;
    }
  }

  function show_notification(item) {
    if (setting.show_notification) {
      GM_notification(item);
    }
  }
  function throttle(cb, wait = 300) {
    var last = 0;
    return function () {
      var now = new Date().getTime();
      if (now - last > wait) {
        cb.call(this);
        last = new Date().getTime();
      }
    };
  }

  //格式化时间
  function formatDate(dat) {
    //获取年月日，时间
    var year = dat.getFullYear();
    var mon =
      dat.getMonth() + 1 < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1;
    var data = dat.getDate() < 10 ? "0" + dat.getDate() : dat.getDate();
    var newDate = year + mon + data;
    return newDate;
  }

  /**
   * 用fecth下载图片
   */
  function imageDownload_with_fetch(src, title) {
    const extension = getExtensionFromUrl(src);
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = title + extension;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        show_notification({
          text: title + "\n" + error,
          title: "下载出错",
          timeout: 5000,
        });
        console.error(error);
      });
  }
  function getExtensionFromUrl(url) {
    const match = url.match(/\.(jpeg|jpg|png|gif|webp|bmp)/);
    return match ? "." + match[1] : ".png"; // 默认使用.jpg
  }
  /**
   * 用GM_download 下载图片
   */
  function imageDownload_with_gm_download(src, title) {
    const extension = getExtensionFromUrl(src);
    GM_download({
      url: src,
      name: title + extension,
      onload: function () {
        show_notification({
          text: title,
          title: "图片已完成下载",
          timeout: 5000,
        });
      },
      onerror: function (error) {
        show_notification({
          text: title + "\n" + src,
          title: "下载出错",
          timeout: 5000,
        });
        console.error(error);
      },
    });
  }
})();
