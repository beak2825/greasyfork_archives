// ==UserScript==
// @name         acg漫画自动翻页
// @namespace    https://github.com/oneadms
// @version      0.13
// @description  acg漫画自动翻页 批量下载
// @author       oneadm
// @match        https://acg-manhua.com/h/*
// @match        https://acg-manhua.com/hentai/*
// @match        https://www.cool-comics.com/hentai/*
// @match        https://www.cool-comics.com/h/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acg-manhua.com
// @resource     myCss https://raw.githubusercontent.com/oneadms/acg-manga-tools/main/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download

// @downloadURL https://update.greasyfork.org/scripts/441151/acg%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/441151/acg%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // var bootstrapCss = GM_getResourceText("customCSS");
  // GM_addStyle(bootstrapCss)

  /**
   添加自动翻页按钮
   */
  const timer = null;
  var flag;
  var hash = 1;

  function addAutoTranPageButton() {

    var button = document.createElement("a");
    //   button.style.width="60px";
    button.style.height = "20px";
    button.style.align = "center";
    var flag = localStorage.getItem('autoTrans') || "false";
    if (flag === "true") {
      button.textContent = "关闭自动翻页";
    } else {
      button.textContent = "开启自动翻页";
    }
    button.id = "auto_tran";
    button.style.cursor = "pointer"
    setInterval(() => {
      let mode = localStorage.getItem("mode");
      if (mode === "more") {
        if (flag === "false") {
          localStorage.setItem('autoTrans', false);
          document.getElementById("auto_tran").textContent = "开启自动翻页";
        } else {
          localStorage.setItem('autoTrans', true);
          //document.getElementsByClassName("page")[0].getElementsByClassName("a1")[1].click()
          document.getElementsByClassName("next_picture")[0].click();
          document.getElementById("auto_tran").textContent = "关闭自动翻页";
        }
      } else {
        if (flag === "false") {
          localStorage.setItem('autoTrans', false);

        } else {
          localStorage.setItem('autoTrans', true);
          //document.getElementsByClassName("page")[0].getElementsByClassName("a1")[1].click()
          window.location.hash = ('#page-' + hash++)

        }
      }

    }, 10000);

    button.onclick = function () {
      flag = (flag === "true" ? "false" : "true");
      if (flag === "false") {
        localStorage.setItem('autoTrans', false)
        document.getElementById("auto_tran").textContent = "开启自动翻页";
      } else {
        localStorage.setItem('autoTrans', true)
        document.getElementById("auto_tran").textContent = "关闭自动翻页"
      }
    }
    var mangaPage = document.getElementsByClassName("acg-manga")[0]
    var div = document.createElement("div");
    div.className = "page";
    div.appendChild(button);
    mangaPage.appendChild(div);

  }

  /**
   批量下载图片
   */
  async function batchDownloadPicture() {
    //判断是否到最后一页 startsWith()
    var nextPage = document.getElementsByClassName("next_picture")[0]
    if (!nextPage.href.startsWith("javascript")) {
      //已经到最后一页
      let mangaPictureUrl = document.getElementsByClassName(
          "manga-picture")[0].children[0].src;
      images.push(mangaPictureUrl)

      var res = images.join("\n");

      console.log(res)
      navigator.clipboard.writeText(res)
      .then(() => {
        alert("已复制到剪贴板");
        console.log("Text copied to clipboard...")
      }).catch(err => {
        console.log('Something went wrong', err);
      })

    } else {
      //获取图片地址
      let mangaPictureUrl = document.getElementsByClassName(
          "manga-picture")[0].children[0].src;
      images.push(mangaPictureUrl)
      //继续翻页
      nextPage.click();

      setTimeout(function () {
        batchDownloadPicture();
      }, 3000);

    }

  }

  /**
   * 添加批量下载按钮
   */
  function addBatchDownloadBtn() {

    var button = document.createElement("a");
    //   button.style.width="60px";
    button.style.height = "20px";
    button.style.align = "center";

    button.textContent = "下载所有图片";

    button.onclick = function () {
      // batchDownloadPicture();
      const pageSize = document.getElementById(
          "pages").children[document.getElementById("pages").children.length
      - 2].textContent
      batchDownloadAllPicture(Number.parseInt(pageSize))
    }

    button.style.cursor = "pointer"
    var mangaPage = document.getElementsByClassName("acg-manga")[0]
    var div = document.createElement("div");
    div.className = "page";
    div.appendChild(button);
    mangaPage.appendChild(div);
  }

  /**
   添加下载按钮
   */
  function addDownloadPictureButton() {

    var div = document.createElement("div");
    var downBtn = document.createElement("a");
    var mangaPage = document.getElementsByClassName("acg-manga")[0]

    downBtn.textContent = "预览图片";
    downBtn.target = "_blank"
    downBtn.style.cursor = "pointer"
    downBtn.onclick = function () {

      var mangaPictureUrl = document.getElementsByClassName(
          "manga-picture")[0].children[0].src;
      window.open(mangaPictureUrl, "_blank")

    }
    div.className = "page";
    div.appendChild(downBtn);
    mangaPage.appendChild(div);

  }

  async function batchDownloadAllPicture(page) {
    const images = await getAllPictures(page)
    // let res = JSON.stringify(images)
    // navigator.clipboard.writeText(res)
    // .then(() => {
    //   alert("已成功获取所有图片到剪贴板")
    //   console.log("Text copied to clipboard...")
    // }).catch(err => {
    //   console.log('Something went wrong', err);
    // })
    images.forEach((item,index)=>{
      console.log(item.src)
      GM_download(item.src, String(item.page)+'.jpg')
    })

  }


  /**
   * 获取所有页面的图片到剪贴板
   * @param page 最后一页
   * @author oneadm
   */
  async function getAllPictures(page) {
    var images = []
    //判断是否在第一页
    let isFirstPage = window.location.pathname.indexOf("-");
    if (isFirstPage === -1) {
      isFirstPage = true
    } else {
      isFirstPage = false
    }
    let pathName;
    if (!isFirstPage) {
      pathName = document.getElementById("pages").children[1].href.replace(
          window.location.origin, "");
    } else {

      pathName = window.location.pathname

    }
    //获取第一页的url

    // console.log(pathName)
    // 是否到最后一页
    // console.log(page)
    var promises = []
    for (let i = 1; i <= page; i++) {
      let rightIndex = pathName.lastIndexOf(".");

      let accessUrl = window.location.origin + pathName.substring(pathName,
          rightIndex) + "-" + i + ".html";

      var promise = fetch(accessUrl).then(async res => {
        const text = await res.text();

        const pattern = "<img src=[^\\s]+://[^\\s]*"
        //<img src="https://cdn.3dtuman.com/h/20220302/e503knop1vi.jpg" 匹配到 获取src
        let imgEl = text.match(pattern)[0];
        let imgSrc = imgEl.substring(imgEl.indexOf('"') + 1, imgEl.length - 1)
        // console.log(imgSrc);
        images.push({
          page: i,
          src: imgSrc
        })
      })
      promises.push(promise)

    }
    //等待所有异步操作
    await Promise.all(promises);
    //升序排序数组
    images.sort((m, n) => {
      return m["page"] - n["page"];
    })
    // let res = JSON.stringify(images)
    // navigator.clipboard.writeText(res)
    // .then(() => {
    //
    //   console.log("Text copied to clipboard...")
    // }).catch(err => {
    //   console.log('Something went wrong', err);
    // })
    //拼接url
    //返回images
    //TODO 切换单页用
    return images;

  }

  var moreModeHtml = null

  async function switchToSingleMode() {
    //清空div
    let magnaEl = document.getElementsByClassName("acg-manga")[0];

    if (!moreModeHtml) {
      moreModeHtml = String(magnaEl.innerHTML);
    }

    magnaEl.innerHTML = "";
    const pageSize = document.getElementById(
        "pages").children[document.getElementById("pages").children.length
    - 2].textContent
    const images = await getAllPictures(Number.parseInt(pageSize))
    var html = "";
    images.forEach((item, index) => {
      console.log(item.src)
      html += `<img  id=page-${index} src=${item.src} />\n`
    })
    console.log(html)
    magnaEl.innerHTML = html;
    addAutoTranPageButton()
    // addDownloadPictureButton();
    addBatchDownloadBtn();
    //
  }

  function switchMoreMode() {

    let magnaEl = document.getElementsByClassName("acg-manga")[0];
    if (moreModeHtml) {
      magnaEl.innerHTML = moreModeHtml;
    }
    addBatchDownloadBtn()
    addAutoTranPageButton()
    addDownloadPictureButton()

  }

  function addSwitchModeButton() {
    var headerEL = document.getElementsByClassName("header")[0];
    let switchModeBtn = document.createElement("div");
    let mode = localStorage.getItem("mode") || "more";
    if (mode === "more") {
      switchMoreMode();
      document.getElementById("pages").style.display = 'block'
      switchModeBtn.textContent = "多页模式";
    } else {
      //隐藏翻页容器
      switchToSingleMode();
      document.getElementById("pages").style.display = 'none'
      switchModeBtn.textContent = "单页模式";
    }

    switchModeBtn.style.float = 'right'
    switchModeBtn.style.padding = "10px"

    switchModeBtn.style.backgroundColor = "#ff34b3"
    switchModeBtn.onclick = function () {
      //切换模式
      mode = (mode === 'more' ? "sing" : "more");
      if (mode === "more") {
        switchModeBtn.textContent = "多页模式";
        document.getElementById("pages").style.display = 'block'
        switchMoreMode();
      } else {
        switchModeBtn.textContent = "单页模式";
        document.getElementById("pages").style.display = 'none'
        switchToSingleMode();
      }
      //保存模式
      localStorage.setItem("mode", mode)

    };
    headerEL.insertBefore(switchModeBtn,
        document.getElementsByClassName('header-con')[0]);
  }

  addSwitchModeButton();

  if (localStorage.css) {
    GM_addStyle(localStorage.css);
  }else{
    var myCss = GM_getResourceText("myCss");
    //缓存css
    localStorage.css = myCss;
    GM_addStyle(myCss);

  }

// Your code here...
})();