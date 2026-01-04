// ==UserScript==
// @name         For Imhentai
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  不翻墙下，更快加载 imhentai.xxx 的图片，并提供打包下载
// @author       水母
// @match        https://imhentai.xxx/gallery/*
// @match        https://*.imhentai.xxx/*
// @icon         https://imhentai.xxx/images/logo.png
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js#sha512-uVSVjE7zYsGz4ag0HEzfugJ78oHCI1KhdkivjQro8ABL/PRiEO4ROwvrolYAcZnky0Fl/baWKYilQfWvESliRA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_download
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468278/For%20Imhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/468278/For%20Imhentai.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 全局数据
  let IS_INIT = false;
  /**
   * 启动
   */
  let IS_RUN = false;
  let IS_DOWNLOADING = false;
  // 页码序列 [cover.jpg, 1.jpg, ..., 30.jpg] : cover不计入页数; eg.总页数定为 30; 数组 [0] 定为 cover
  /**
   * 当前页码
   */
  let CURRENT_PAGE = 0;
  /**
   * 最大浏览的页码，只增
   */
  let MAX_BROWSE_PAGE = 0;
  /**
   * 已加载的页码
   */
  let PAGE_LOADED = 0;

  /**
   * @desc 标识当前在哪个页面
   */
  let CURRENT_URL;
  /**
   * @desc 页面枚举
   */
  const CURRENT_URL_TYPE = {
    /**
     * @desc 标识在 https://imhentai.xxx/gallery/? 页面
     */
    gallery: "gallery",
    /**
     * @desc 标识在 https://imhentai.xxx/view/? 页面
     */
    view: "view",
    /**
     * @desc 标识在 https://?.imhentai.xxx/?/?/cover.jpg 页面
     */
    imgPage: "imgPage",
    /**
     * @desc 标识在 测试 gallery 页面
     */
    testGallery: "testGallery",
    /**
     * @desc 标识在 测试 imgPage 页面
     */
    testImgPage: "testImgPage",
    /**
     * @desc 标识为无法识别页面
     */
    unknow: "unknow",
  };

  /**
   * 用户定义的下载页码区间
   */
  let UserCustemRange = {
    min: 0,
    max: 0,
    page_loaded: 0,
  };
  // enum
  const CanEleID = {
    /**
     * 主体
     */
    app: "can-app",
    runBtn: "can-run",
    previousBtn: "can-pre",
    nextBtn: "can-next",
    downloadBtn: "can-down",
    scaleUpBtn: "can-sUp",
    scaleResetBtn: "can-sReset",
    scaleDownBtn: "can-sDown",
    /**
     * 页码
     */
    pageLabel: "can-page",
    /**
     * 页码跳转
     */
    changePageInput: "can-input",
    /**
     * 图片显示
     */
    showImg: "can-img",
    /**
     * 图片显示外包 <div>
     */
    showImgDiv: "can-img-div",
    /**
     * 转 base64
     */
    canvas: "can-cvs",
  };
  const BtnText = {
    runBtn: "启动🥰",
    previousBtn: "⫷",
    nextBtn: "⫸",
    downloadBtn: "下载🥵",
    scaleUpBtn: "⇲",
    scaleResetBtn: "↺◲",
    scaleDownBtn: "⇱",
  };
  /**
   * FileReader 加载完毕计算器，由异步方法调用
   */
  const CounterForFileReader = {
    /**
     * 异步锁
     */
    is_lock: false,
    count: 0,
    /**
     * 如果更新成功，返回 true
     * @returns {boolean}
     */
    update() {
      if (this.is_lock) return false;
      else {
        this.is_lock = true;
        this.count++;
        this.is_lock = false;
        return true;
      }
    },
  };

  // 避免没必要下载属性，被 JSON.stringify()
  const keyImageBase64 = Symbol("imageBase64");
  const keyImageScale = Symbol("imageScale");
  /**
   *
   * @param {string} imgName
   * @param {string} imgUrl
   * @param {string} imgType
   * @param {number} width
   * @param {number} height
   * @param {number} scale 仅用于页面浏览
   * @param {string} imageBase64
   */
  function ImgInfo(
    imgName,
    imgUrl = "",
    imgType = "",
    width = 0,
    height = 0,
    scale = 1.0,
    imageBase64 = ""
  ) {
    this.imgName = imgName;
    this.imgUrl = imgUrl;
    this.imgType = imgType;
    this.width = width;
    this.height = height;
    this[keyImageScale] = scale;
    this[keyImageBase64] = imageBase64;
  }
  /**
   * 本子数据
   * @param {string} name_en
   * @param {string} name_sub
   * @param {number} page
   * @param {string} origin_url 原预览页面
   * @param {string} root_url 图片的根地址
   * @param {ImgInfo[]} imgInfoList
   */
  function BzData(
    name_en = "Null",
    name_sub = "Null",
    page = 0,
    origin_url = "",
    root_url = "",
    imgInfoList = []
  ) {
    this.name_en = name_en;
    this.name_sub = name_sub;
    this.page = page;
    this.origin_url = origin_url;
    this.root_url = root_url;
    this.imgInfoList = imgInfoList;
  }
  /**
   * BzData 迭代器
   * @param {BzData} bzData
   */
  function* BzDataIterator(bzData) {
    let index = 0;
    while (index < bzData.imgInfoList.length) {
      let imgInfo = bzData.imgInfoList[index];
      yield [index++, bzData.root_url, imgInfo];
    }
  }

  /**
   * 保存跳转下载的存储数据
   */
  let downloadTabData = {
    dataKey: "",
    oriBzData: null,
  };

  // <style>
  ((t) => {
    const e = document.createElement("style");
    e.textContent = t;
    document.head.append(e);
  })(
    `
    #${CanEleID.app} {
      top:40%; 
      width:120px; 
      height:200px;
      font-size:20px; 
      color: #d71989;
      background-color:hsla(0, 0%, 90%, 50%);
      display:flex; 
      flex-direction:column; 
      justify-content:space-between;
      position:fixed; 
      z-index:1000002; 
      transform:translateX(calc(-50% * var(--direction))) translateY(-50%);
    }
  
    .can-button-sm {
      height: 30px;
      font-size: 20px; 
      color: #d71989;
      flex: 1;
    }
  
    .can-button-lg {
      height: 34px;
      font-size:20px; 
      color: #d71989;
    }
  
    #${CanEleID.app} div {
      width: 100%;
    }

    #${CanEleID.app} svg {
      display: none;
      width: 24px;
      height: 24px;
    }

    #${CanEleID.showImg} {
      -webkit-user-select: none;
      margin:0 auto;
      transition: background-color 300ms;
    }
  
    #${CanEleID.changePageInput} {
      width: 90%;
      height: 24px;
      font-size:18px;
      text-align:center;
    }
  
    #${CanEleID.pageLabel} {
      font-size:18px;
      text-align:center;
      margin: 0px 3px;
      background-color: hsla(0, 0%, 90%, 90%);
      flex: 1;
    }
  
    #${CanEleID.showImgDiv} {
      display:none;
      position: fixed;
      overflow: auto;
      width: 80%;
      height: 100%;
      top: 0%;
      z-index: 1000001;
      left: 0;
      right: 0;
      margin:0 auto;
      text-align: center;
      background-color: hsla(338, 100%, 70%, 0.8);
    }
    `
  );

  /**
   * 漫画名去特殊字符处理
   * @param {string} filename 文件名
   * @return {string} 处理后的文件名
   */
  function processFilename(filename) {
    return filename
      .replaceAll("\\", "-")
      .replaceAll("/", "-")
      .replaceAll(":", "：")
      .replaceAll("*", "-")
      .replaceAll("?", "？")
      .replaceAll('"', "“")
      .replaceAll("<", "《")
      .replaceAll(">", "》")
      .replaceAll("|", "~");
  }

  /**
   * 判断图片 url 有效与否
   * @returns {Promise<Image>}
   */
  function verifyImgExists(imgUrl) {
    return new Promise((resolve, reject) => {
      let ImgObj = new Image();
      ImgObj.src = imgUrl;
      ImgObj.onload = () => resolve(ImgObj);
      ImgObj.onerror = (rej) => reject(rej);
    });
  }

  /**
   * 为 ImgInfo 保存正确的 URL 和后缀格式，并生成 base64
   * @param {string} root_url
   * @param {ImgInfo} imgInfo
   * @param {string[]} types ['.jpg', '.png', '.gif', '.err']
   */
  async function processImgInfoAsync(
    root_url,
    imgInfo,
    types = [".jpg", ".png", ".gif", ".err"]
  ) {
    // 测试三种后缀
    for (let type of types) {
      imgInfo.imgUrl = root_url + imgInfo.imgName + type;
      imgInfo.imgType = type;
      try {
        let ImgObj = await verifyImgExists(imgInfo.imgUrl);

        // 图片有效，即加载图片的 base64
        // 避开站点的跨域策略
        if (
          CURRENT_URL !== CURRENT_URL_TYPE.gallery &&
          CURRENT_URL !== CURRENT_URL_TYPE.testGallery
        ) {
          // canvas 无法加载 gif
          if (type !== ".gif") {
            try {
              let c = document.createElement("canvas");
              let ctx = c.getContext("2d");
              c.height = ImgObj.naturalHeight;
              c.width = ImgObj.naturalWidth;
              ctx.drawImage(
                ImgObj,
                0,
                0,
                ImgObj.naturalWidth,
                ImgObj.naturalHeight
              );
              // 图片格式的mime类型：image/png, image/jpeg
              imgInfo[keyImageBase64] =
                type === ".jpg"
                  ? c.toDataURL("image/jpeg", 1.0)
                  : c.toDataURL();
            } catch (e1) {
              imgInfo[keyImageBase64] = "data:image/png;base64,null";
              console.log(`[ERR] ${imgInfo.imgUrl} 无法处理为 base64 : ${e1}`);
            }
          } else {
            getGifBase64Async(imgInfo);
          }
        }
        imgInfo.width = ImgObj.width;
        imgInfo.height = ImgObj.height;
        break; // 结束循环
      } catch (e2) {
        if (type !== ".err") {
          console.log(`[TEST] ${imgInfo.imgUrl} 不存在，尝试下一个扩展名`);
        } else {
          imgInfo[keyImageBase64] = "data:image/png;base64,null";
          console.log(`[ERR] ${imgInfo.imgUrl} 不存在`);
        }
        // 继续循环
      }
    }
  }

  /**
   * 处理所有图片
   * @param {BzDataIterator} bzDataIterator
   */
  async function processImgAsync(bzDataIterator) {
    let page_ = document.querySelector(`#${CanEleID.pageLabel}`);
    let div_img = document.querySelector(`#${CanEleID.showImgDiv}`);

    for (let [index, root_url, imgInfo] of bzDataIterator) {
      await processImgInfoAsync(root_url, imgInfo);
      updateImgInfoScale(imgInfo, false, div_img);
      PAGE_LOADED = index;
      page_.textContent = `${PAGE_LOADED}`;
    }
    document.querySelector(`#${CanEleID.app} svg`).style.display = "none";
  }

  /**
   * 获取图片的 base64 编码，此处指定 Gif ，其他格式由 canvas 方式获取
   * @param {ImgInfo} imgInfo
   */
  const getGifBase64Async = async (imgInfo) => {
    try {
      let reader = new FileReader();
      reader.onloadend = function () {
        imgInfo[keyImageBase64] = reader.result;
        // 持续，直至更新计数
        let intervalID = setInterval(() => {
          if (CounterForFileReader.update()) clearInterval(intervalID);
        }, Math.round(Math.random() * 1000));
      };

      // 加载图片的 blob 类型数据
      let imgBlob = await fetch(imgInfo.imgUrl).then((respone) =>
        respone.blob()
      );
      reader.readAsDataURL(imgBlob); // 将 blob 数据转换成 DataURL 数据
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 批量下载图片
   * @param {BzData} bzData 图像数据
   * @param {number} min
   * @param {number} max
   */
  const downloadZip = async (bzData, min, max) => {
    console.log(bzData);
    document.querySelector(`#${CanEleID.downloadBtn}`).textContent = "正在打包";

    const zip = new JSZip();
    // 图片 url json 文件
    let stringData = JSON.stringify(bzData, null, 2);
    zip.file(
      `${bzData.name_en} [${UserCustemRange.min}-${UserCustemRange.max}].json`,
      stringData
    );
    // 创建图片文件夹
    const fileFolder = zip.folder(
      `${bzData.name_en} [${UserCustemRange.min}-${UserCustemRange.max}]`
    );
    const fileList = [];
    for (let i = min; i <= max; i++) {
      let name = bzData.imgInfoList[i].imgName + bzData.imgInfoList[i].imgType;
      let imageBase64 = bzData.imgInfoList[i][keyImageBase64].substring(22); // 截取 data:image/png;base64, 后的数据
      fileList.push({ name: name, img: imageBase64 });
    }
    // 往 zip 中，添加每张图片数据
    for (let imgFile of fileList) {
      fileFolder.file(imgFile.name, imgFile.img, {
        base64: true,
      });
    }

    document.querySelector(`#${CanEleID.downloadBtn}`).innerHTML =
      "<div style='font-size: 10px;'>浏览器酱正在响应</div>";

    zip.generateAsync({ type: "blob" }).then((content) => {
      // saveAs(
      //   content,
      //   `${bzData.name_en} [${UserCustemRange.min}-${UserCustemRange.max}].zip`
      // );
      const downloadUrl = URL.createObjectURL(content);
      GM_download({
        url: downloadUrl,
        name: `${bzData.name_en} [${UserCustemRange.min}-${UserCustemRange.max}].zip`,
        saveAs: true,
        onload: () => {
          // 按钮还原
          document.querySelector(`#${CanEleID.downloadBtn}`).textContent =
            BtnText.downloadBtn;
          document.querySelector(`#${CanEleID.downloadBtn}`).disabled = false;
          IS_DOWNLOADING = false;
        },
        onerror: (error) => {
          console.log(error);
          // 按钮还原
          document.querySelector(`#${CanEleID.downloadBtn}`).textContent =
            BtnText.downloadBtn;
          document.querySelector(`#${CanEleID.downloadBtn}`).disabled = false;
          IS_DOWNLOADING = false;
        },
      });
    });
  };

  /**
   * 数据初始化，获取漫画名、页数、图片的 url
   */
  function initData() {
    let bzData = new BzData();
    let bzDataIterator;
    console.log(`CURRENT_URL:${CURRENT_URL}`);
    if (
      CURRENT_URL === CURRENT_URL_TYPE.gallery ||
      CURRENT_URL === CURRENT_URL_TYPE.testGallery
    ) {
      let coverUrl;
      const tag_div_main = document.querySelectorAll(
        "body > div.overlay > div.container > div.row.gallery_first > div"
      );
      // 获取漫画名

      bzData.name_en = tag_div_main[1].querySelector("h1").textContent;
      bzData.name_sub = tag_div_main[1].querySelector("p.subtitle").textContent;
      // 漫画名去特殊字符处理
      if (bzData.name_sub !== "") {
        bzData.name_sub = processFilename(bzData.name_sub);
      }
      if (bzData.name_en !== "") {
        bzData.name_en = processFilename(bzData.name_en);
      } else {
        bzData.name_en = bzData.name_sub;
      }

      // 获取页数
      let page_str = tag_div_main[1].querySelector("li.pages").textContent;
      bzData.page = Number.parseInt(page_str.match(/Pages: ([0-9]*)/i)[1]);

      // 预览页面地址
      bzData.origin_url = window.location.href;

      // 图片序列的 url 前缀与封面的 url 相同，
      // eg.封面 url=https://m7.imhentai.xxx/023/mnsiote3jg/cover.jpg
      // eg.序列的 url=https://m7.imhentai.xxx/023/mnsiote3jg/
      coverUrl = tag_div_main[0].querySelector("img").dataset.src;
      bzData.root_url = coverUrl.slice(0, coverUrl.lastIndexOf("/") + 1);

      // 在 gallary 页面保存数据，跳转 imgPage 页面后使用
      // https://m7.imhentai.xxx/023/mnsiote3jg/cover.jpg
      let dataKey = coverUrl.substring("https://".length);
      dataKey = dataKey.substring(0, dataKey.lastIndexOf("/"));
      // dataKey = "m7.imhentai.xxx/023/mnsiote3jg"
      downloadTabData.dataKey = dataKey;
      downloadTabData.oriBzData = new BzData(
        bzData.name_en,
        bzData.name_sub,
        bzData.page,
        bzData.origin_url,
        bzData.root_url
      );
      console.log(downloadTabData);
    } else if (
      CURRENT_URL === CURRENT_URL_TYPE.imgPage ||
      CURRENT_URL === CURRENT_URL_TYPE.testImgPage
    ) {
      let dataKey = window.location.href.substring("https://".length);
      dataKey = dataKey.substring(0, dataKey.lastIndexOf("/"));
      bzData = GM_getValue(`${dataKey}`);
      if (!bzData) alert("数据为空，请先访问，预览页面 gallarg");
    }

    // cover
    bzData.imgInfoList.push(new ImgInfo("cover"));
    // 图片序列的 url 生成,
    // eg: https://m7.imhentai.xxx/023/mnsiote3jg/1.jpg
    for (let p = 1; p <= bzData.page; p++) {
      bzData.imgInfoList.push(new ImgInfo(p.toString())); // 图片名未编码，数字序列就行
    }

    bzDataIterator = BzDataIterator(bzData);
    // 初始化 cover 数据，next() 让 CURRENT_PAGE 与 PAGE_LOADED 能够对齐
    let [index, root_url, coverInfo] = bzDataIterator.next().value;
    processImgInfoAsync(bzData.root_url, coverInfo);

    console.log(bzData);
    // alert(JSON.stringify(bzData));
    return [bzData, bzDataIterator];
  }

  /**
   * 初始化组件
   * @param {BzData} bzData
   * @param {BzDataIterator} bzDataIterator
   */
  function initComponents(bzData, bzDataIterator) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div id="${CanEleID.app}">
        <button id="${CanEleID.runBtn}" class="can-button-lg">${BtnText.runBtn}</button>
        <div style="display: flex; flex-direction: column; justify-content: space-around; align-items: center; flex: 1;">
          <div style="display: flex; flex-direction: row;">
            <button id="${CanEleID.previousBtn}" class="can-button-sm" disabled>${BtnText.previousBtn}</button>
            <button id="${CanEleID.nextBtn}" class="can-button-sm" disabled>${BtnText.nextBtn}</button>
          </div>
          <div style="display: flex; flex-direction: row;">
            <button id="${CanEleID.scaleUpBtn}" class="can-button-sm" disabled>${BtnText.scaleUpBtn}</button>
            <button id="${CanEleID.scaleResetBtn}" class="can-button-sm" disabled>${BtnText.scaleResetBtn}</button>
            <button id="${CanEleID.scaleDownBtn}" class="can-button-sm" disabled>${BtnText.scaleDownBtn}</button>
          </div>
          <input id="${CanEleID.changePageInput}" value="0" disabled>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <label id="${CanEleID.pageLabel}">0</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="#ff7cc9">
              <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
              <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
                <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        </div>
        <button id="${CanEleID.downloadBtn}" class="can-button-lg">${BtnText.downloadBtn}</button>
      </div>

      <div id="can-img-div" style="display: none;">
        <img id="can-img" alt="null">
      </div>

      <canvas id="can-cvs" style="display: none;"></canvas>
      `
    );

    document
      .querySelector(`#${CanEleID.runBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        if (!IS_INIT) {
          IS_INIT = true;

          // 初始显示封面
          document.querySelector(`#${CanEleID.showImgDiv}`).style.display =
            "block";
          updateImgInfoScale(bzData.imgInfoList[0]);
          updateShowImgTag(bzData.imgInfoList[0]);

          // 异步加载图片信息
          document.querySelector(`#${CanEleID.app} svg`).style.display =
            "block";
          processImgAsync(bzDataIterator);
        }
        if (!IS_RUN) {
          IS_RUN = true;
          if (
            CURRENT_URL === CURRENT_URL_TYPE.imgPage ||
            CURRENT_URL === CURRENT_URL_TYPE.testImgPage
          ) {
            evt.target.textContent = `跳转预览页`;
          } else {
            evt.target.textContent = "显示预览页";
          }
          // 生效按钮
          let btns = document
            .querySelector(`#${CanEleID.app}`)
            .querySelectorAll("button");
          for (const btn of btns) {
            btn.disabled = false;
          }
          let inputPage = document.querySelector(
            `#${CanEleID.changePageInput}`
          );
          inputPage.disabled = false;
          // 显示 新 <img>
          document.querySelector(`#${CanEleID.showImgDiv}`).style.display =
            "block";
        } else {
          if (
            CURRENT_URL === CURRENT_URL_TYPE.imgPage ||
            CURRENT_URL === CURRENT_URL_TYPE.testImgPage
          ) {
            GM_openInTab(bzData.origin_url, { active: true });
          } else {
            IS_RUN = false;

            evt.target.textContent = BtnText.runBtn;
            // 无效按钮
            let btns = document
              .querySelector(`#${CanEleID.app}`)
              .querySelectorAll("button");
            for (const btn of btns) {
              btn.disabled =
                btn.id !== CanEleID.runBtn && btn.id !== CanEleID.downloadBtn
                  ? true
                  : false;
            }
            let inputPage = document.querySelector(
              `#${CanEleID.changePageInput}`
            );
            inputPage.disabled = true;
            // 隐藏新 <img>
            document.querySelector(`#${CanEleID.showImgDiv}`).style.display =
              "none";
          }
        }
      });

    document
      .querySelector(`#${CanEleID.previousBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        let imgInfo =
          bzData.imgInfoList[
            CURRENT_PAGE > 0 ? --CURRENT_PAGE : (CURRENT_PAGE = MAX_BROWSE_PAGE)
          ];
        updateShowImgTag(imgInfo);
        let inputPage = document.querySelector(`#${CanEleID.changePageInput}`);
        let page_ = document.querySelector(`#${CanEleID.pageLabel}`);
        inputPage.value = CURRENT_PAGE;
      });

    document
      .querySelector(`#${CanEleID.nextBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        let imgInfo =
          bzData.imgInfoList[
            CURRENT_PAGE < PAGE_LOADED
              ? ++CURRENT_PAGE
              : (CURRENT_PAGE = PAGE_LOADED !== bzData.page ? CURRENT_PAGE : 0) // 完全加载完前不会 '溢出跳 0'
          ];
        updateShowImgTag(imgInfo);
        let inputPage = document.querySelector(`#${CanEleID.changePageInput}`);
        let page_ = document.querySelector(`#${CanEleID.pageLabel}`);
        inputPage.value = CURRENT_PAGE;
        if (MAX_BROWSE_PAGE < CURRENT_PAGE) MAX_BROWSE_PAGE = CURRENT_PAGE;
      });

    document
      .querySelector(`#${CanEleID.downloadBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        if (
          CURRENT_URL === CURRENT_URL_TYPE.gallery ||
          CURRENT_URL === CURRENT_URL_TYPE.testGallery
        ) {
          // 传递本子数据，跳转到封面页面，再启动下载，避免 strict-origin-when-cross-origin
          console.log(`跳转至：${bzData.imgInfoList[0].imgUrl}`);
          GM_setValue(`${downloadTabData.dataKey}`, downloadTabData.oriBzData);
          GM_openInTab(bzData.imgInfoList[0].imgUrl, { active: true });
          return;
        }
        // 打包 zip
        if (!IS_DOWNLOADING) {
          IS_DOWNLOADING = true;
          document.querySelector(`#${CanEleID.downloadBtn}`).disabled = true;
          UserCustemRange.page_loaded = PAGE_LOADED;
          if (UserCustemRange.page_loaded !== bzData.page) {
            let result = confirm(
              `当前${UserCustemRange.page_loaded}页，图片未加载完全，是否继续？🤨`
            );
            if (!result) {
              IS_DOWNLOADING = false;
              document.querySelector(
                `#${CanEleID.downloadBtn}`
              ).disabled = false;

              return;
            }
          }
          let result = prompt(
            "选择下载页面区间，请使用 [英文符号 - ] 隔开😇",
            `0-${UserCustemRange.page_loaded}`
          );
          if (result) {
            let rangeRegExp = result.match(/^(\d+)-(\d+)$/);
            if (rangeRegExp) {
              UserCustemRange.min = Number.parseInt(rangeRegExp[1]);
              UserCustemRange.max = Number.parseInt(rangeRegExp[2]);
              // 处理意外输入
              if (
                !rangeRegExp ||
                0 > UserCustemRange.min ||
                UserCustemRange.min > UserCustemRange.max ||
                UserCustemRange.max > UserCustemRange.page_loaded
              ) {
                alert("无效输入😥");
                IS_DOWNLOADING = false;
                document.querySelector(
                  `#${CanEleID.downloadBtn}`
                ).disabled = false;

                return;
              }
            } else {
              alert("无效输入😥");
              IS_DOWNLOADING = false;
              document.querySelector(
                `#${CanEleID.downloadBtn}`
              ).disabled = false;

              return;
            }
            downloadZip(bzData, UserCustemRange.min, UserCustemRange.max);
          } else {
            IS_DOWNLOADING = false;
            document.querySelector(`#${CanEleID.downloadBtn}`).disabled = false;
          }
        }
      });

    document
      .querySelector(`#${CanEleID.scaleUpBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        let imgInfo = bzData.imgInfoList[CURRENT_PAGE];
        imgInfo[keyImageScale] += 0.1;
        updateShowImgTag(imgInfo);
      });

    document
      .querySelector(`#${CanEleID.scaleResetBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();

        let imgInfo = bzData.imgInfoList[CURRENT_PAGE];

        // 切换 原始尺寸-平铺尺寸
        if (imgInfo[keyImageScale] !== 1.0) {
          imgInfo[keyImageScale] = 1.0;
        } else {
          updateImgInfoScale(imgInfo, true);
        }

        updateShowImgTag(imgInfo);
      });

    document
      .querySelector(`#${CanEleID.scaleDownBtn}`)
      .addEventListener("click", (evt) => {
        evt.stopPropagation();
        let imgInfo = bzData.imgInfoList[CURRENT_PAGE];
        imgInfo[keyImageScale] -= 0.1;
        updateShowImgTag(imgInfo);
      });

    document
      .querySelector(`#${CanEleID.changePageInput}`)
      .addEventListener("change", (evt) => {
        evt.stopPropagation();
        if (0 <= evt.target.value && evt.target.value <= bzData.page) {
          CURRENT_PAGE = evt.target.value;
          let imgInfo = bzData.imgInfoList[CURRENT_PAGE];
          updateShowImgTag(imgInfo);
        }
      });
  }

  /**
   * @desc 更新显示图片
   * @param {ImgInfo} imgInfo
   */
  function updateShowImgTag(imgInfo) {
    let newImg_ = document.querySelector(`#${CanEleID.showImg}`);
    newImg_.src = imgInfo.imgUrl;
    newImg_.alt = imgInfo.imgName + imgInfo.imgType;
    if (imgInfo.imgType !== ".err") {
      newImg_.width = imgInfo.width * imgInfo[keyImageScale];
      newImg_.height = imgInfo.height * imgInfo[keyImageScale];
    } else {
      newImg_.style.removeProperty("width");
      newImg_.style.removeProperty("height");
    }
  }

  /**
   * @desc 更新图片的缩放，自动平铺
   * @param {ImgInfo} imgInfo
   * @param {boolean} isUseToSm 是否将小图放大，默认：false
   * @param {HTMLDivElement} showImgDiv 包装 \<img\> 的 \<div\> 元素对象
   */
  function updateImgInfoScale(imgInfo, isUseToSm = false, showImgDiv = null) {
    let div_img = showImgDiv
      ? showImgDiv
      : document.querySelector(`#${CanEleID.showImgDiv}`);
    let HScale = imgInfo.height / div_img.offsetHeight;
    let WScale = imgInfo.width / div_img.offsetWidth;
    if (
      imgInfo.height > div_img.offsetHeight ||
      imgInfo.width > div_img.offsetWidth
    ) {
      if (HScale > 1 && HScale > WScale) imgInfo[keyImageScale] = 1 / HScale;
      if (WScale > 1 && WScale > HScale) imgInfo[keyImageScale] = 1 / WScale;
      // 误差
      imgInfo[keyImageScale] -= 0.003;
    } else {
      if (isUseToSm) {
        if (HScale < 1 && HScale > WScale) imgInfo[keyImageScale] = 1 / HScale;
        if (WScale < 1 && WScale > HScale) imgInfo[keyImageScale] = 1 / WScale;
        // 误差
        imgInfo[keyImageScale] -= 0.01;
      }
    }
  }

  // 标识当前页面
  const currentUrl = window.location.href;
  if (currentUrl.match(/https:\/\/imhentai.xxx\/gallery\/\S*/g) !== null)
    CURRENT_URL = CURRENT_URL_TYPE.gallery;
  else if (currentUrl.match(/https:\/\/imhentai.xxx\/view\/\S*/g) !== null)
    CURRENT_URL = CURRENT_URL_TYPE.view;
  else if (currentUrl.match(/https:\/\/\w*.imhentai.xxx\/\S*/g) !== null)
    CURRENT_URL = CURRENT_URL_TYPE.imgPage;
  else if (currentUrl.match(/file:\/\/\/D:\/\S*\/\S*\/py\S*/g) !== null)
    CURRENT_URL = CURRENT_URL_TYPE.testGallery;
  else if (currentUrl.match(/https:\/\/www.anna\S*/g) !== null)
    CURRENT_URL = CURRENT_URL_TYPE.testImgPage;
  else {
    CURRENT_URL = CURRENT_URL_TYPE.unknow;
    return;
  }
  // 清除脚本存储数据
  if (
    CURRENT_URL === CURRENT_URL_TYPE.imgPage ||
    CURRENT_URL === CURRENT_URL_TYPE.testImgPage
  ) {
    // 7天自动清除
    if (GM_getValue("expire", null) === null) GM_setValue("expire", Date.now());
    const expire = GM_getValue("expire");
    const clearInterval = Date.parse("07 Jan 1970 00:00:00 GMT");
    if (Date.now() - expire >= clearInterval)
      (() => {
        // 当所有 imgPage 页面关闭时，才清除数据；同时段浏览多个页面时，数据应该缓存；Be like 共享指针
        // 直接关闭浏览器，unload 不会触发；使用变化的 LinkCountSign，保证某个未来时间会清除，依赖用户操作
        const dateNow = new Date();
        const LinkCountSign = `LC:${dateNow.getDate()}`;
        GM_setValue(LinkCountSign, GM_getValue(LinkCountSign, 0) + 1);
        window.addEventListener("unload", (evt) => {
          GM_setValue(LinkCountSign, GM_getValue(LinkCountSign, 0) - 1);
          if (GM_getValue(LinkCountSign, 0) <= 0) {
            let expireData = GM_listValues();
            expireData.forEach((data) => GM_deleteValue(data));
          }
        });
      })();
  }
  // 脚本~ 启动!
  initComponents(...initData());
})();
