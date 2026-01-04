// ==UserScript==
// @name 漫画网站画质AI修复
// @version 0.6.0
// @namespace http://tampermonkey.net/
// @description 修复漫画网站上的低清漫画。需要下载并安装后台程序。仅支持windows。网站暂时只支持漫画柜。
// @author call_duck
// @homepage https://github.com/pboymt/userscript-typescript-template#readme
// @license https://opensource.org/licenses/MIT
// @match https://www.manhuagui.com/comic/**
// @match https://manhuabika.com/pchapter/**
// @run-at document-end
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/483769/%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E7%94%BB%E8%B4%A8AI%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/483769/%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E7%94%BB%E8%B4%A8AI%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const gm_config_1 = __importDefault(__webpack_require__(494));
const readMode_1 = __webpack_require__(186);
const readMode_2 = __importDefault(__webpack_require__(186));
(function () {
    "use strict";
    const urlRegs = [
        /\/comic\/[0-9]+\/[0-9]+\.html/,
        /\/pchapter\//
    ];
    let urlFlag = false;
    for (let i = 0; i < urlRegs.length; i++) {
        const reg = urlRegs[i];
        if (location.href.match(reg)) {
            urlFlag = true;
        }
    }
    if (!urlFlag) {
        return;
    }
    if (location.hostname.indexOf('manhuagui') !== -1) {
        GM.addStyle(`#smh-msg-box { z-index: 2147483647 !important }`);
    }
    if (location.hostname.indexOf('manhuabika') !== -1) {
        GM.addStyle(`#toast-user { z-index: 2147483647 !important }`);
    }
    (0, readMode_2.default)();
    let imgDomIndex = 0;
    let queueLength = 0;
    let stop = true;
    let isShowError = false;
    const maxQueueLength = 4;
    const baseUrl = 'http://localhost:31485';
    const gmc = new gm_config_1.default({
        id: "MyConfig",
        title: "设置AI缩放",
        frameStyle: "z-index:100003;position: fixed;height:400px!important",
        fields: {
            scale: {
                label: "缩放倍数",
                title: "默认“4”",
                type: "select",
                options: ["2", "3", "4"],
                default: "4",
            },
            maxQueueLength: {
                label: "最大同时处理图片数量",
                type: "int",
                min: 1,
                default: 3,
            },
            isAutoEnterReadMode: {
                label: '是否自动进入阅读模式',
                type: 'checkbox',
                default: true
            },
            model: {
                label: "模型",
                title: "realesrgan-x4plus-anime拥有比默认模型realesr-animevideov3更好的质量以及更慢的速度。推荐高端显卡 用户使用。",
                type: "select",
                options: ["realesr-animevideov3（速度快，默认）", "realesrgan-x4plus-anime（质量好，更慢）"],
                default: "realesr-animevideov3（速度快，默认）",
            },
            stateBarStyle: {
                label: "状态栏样式",
                title: "设置状态栏显示的信息",
                type: "select",
                options: ["完整", '精简', '不显示'],
                default: "完整",
            },
            enableCache: {
                label: "是否启用缓存",
                title: "将生成的高清图片缓存，减少再次请求高清图片时的响应时间。启用后将占用一定的C盘空间",
                type: "checkbox",
                default: true,
            },
            cleanCacheSpan: {
                label: "自动清理缓存时间间隔（单位为天。设置为0则不自动清理）",
                title: "单位为天",
                type: "int",
                min: 0,
                default: 1,
            },
            cleanCache: {
                label: "清除缓存",
                type: "button",
                click: function () {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: baseUrl + "/clean_cache",
                        onload: function (r) {
                            var _a;
                            console.log(r.response);
                            const frame = document.getElementById('MyConfig');
                            const label = (_a = frame.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementById('sizeLabel');
                            label.innerHTML = "0MB";
                        }
                    });
                }
            }
        },
        events: {
            save: function () {
                gmc.close();
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: baseUrl + '/setting',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    data: JSON.stringify({ 'enable_cache': gmc.get('enableCache'), 'clean_cache_span': gmc.get('cleanCacheSpan') }),
                    onload: function (r) {
                        console.log(r.response);
                    },
                    onerror() {
                        showErrorStateBar();
                    }
                });
            },
        },
    });
    GM_addStyle("#MyConfig {width:500px!important;height:320px!important;}");
    function openConfigPanel() {
        if (document.getElementById('MyConfig')) {
            return;
        }
        gmc.open();
        setTimeout(() => {
            console.log(document.getElementById('MyConfig'));
        }, 1);
        GM_xmlhttpRequest({
            method: 'GET',
            url: baseUrl + "/get_settings",
            onload: function (r) {
                var _a, _b, _c, _d;
                try {
                    const info = JSON.parse(r.response);
                    const settings = info.settings;
                    if (settings.enable_cache) {
                        gmc.set("enableCache", settings.enable_cache.toLowerCase() === "true" ? true : false);
                    }
                    else {
                        gmc.set("enableCache", true);
                    }
                    gmc.set("cleanCacheSpan", settings.clean_cache_span ? parseInt(settings.clean_cache_span) : 1);
                    const configFrame = document.getElementById('MyConfig');
                    if (!configFrame) {
                        return;
                    }
                    const sizeLabel = document.createElement('span');
                    sizeLabel.innerHTML = ((info.cache_size / 1000) / 1000).toFixed(2) + "MB";
                    sizeLabel.id = "sizeLabel";
                    const span = document.createElement('div');
                    span.innerHTML = '当前缓存大小：';
                    (_b = (_a = configFrame.contentDocument) === null || _a === void 0 ? void 0 : _a.getElementById('MyConfig_cleanCache_var')) === null || _b === void 0 ? void 0 : _b.appendChild(span);
                    (_d = (_c = configFrame.contentDocument) === null || _c === void 0 ? void 0 : _c.getElementById('MyConfig_cleanCache_var')) === null || _d === void 0 ? void 0 : _d.appendChild(sizeLabel);
                }
                catch (error) {
                    console.log(error);
                }
            },
            onerror: function () {
                stateBar.innerHTML = `后端程序未运行，请先启动后端程序 <a class="__callLink" href="mangaAIRepairerBackend:a" style="color:blue">尝试调起应用 <a/>`;
                stateBar.style.display = 'block';
            }
        });
    }
    function waitImg(img, fun) {
        setTimeout(() => {
            if (img && img.complete) {
                fun(img);
            }
            else {
                waitImg(img, fun);
            }
        }, 100);
    }
    function refreshStateBar() {
        const stateBarStyle = gmc.fields.stateBarStyle.value;
        if (stateBarStyle === '不显示') {
            return;
        }
        if (queueLength === 0 && stop === false) {
            stateBar.style.display = "none";
        }
        else {
            stateBar.style.display = "block";
        }
        let model = gmc.fields.model.value;
        model = model.replace(/(\（.+\）)/g, '');
        if (stateBarStyle === '精简') {
            stateBar.innerHTML = `正在处理 ${queueLength} 张图片`;
        }
        else {
            stateBar.innerHTML = `正在处理 ${queueLength} 张图片<br><div style="font-size:10px;line-height:12px">当前模型：<br>${model}</div>`;
        }
    }
    function showErrorStateBar() {
        if (isShowError) {
            return;
        }
        isShowError = true;
        stateBar.style.display = "block";
        stateBar.innerHTML =
            `
      <span class="msg">本机后台AI画质修复程序未运行，请检查后台程序状态。 </span>
      <a href="https://greasyfork.org/zh-CN/scripts/483769-%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E7%94%BB%E8%B4%A8ai%E4%BF%AE%E5%A4%8D" style="color:blue" target="_blank">说明文档 <a/>
      <a class="__callLink" href="mangaAIRepairerBackend:a" style="color:blue">尝试调起应用 <a/>
      `;
        stateBar.querySelector('.__callLink').addEventListener("click", function () {
            stateBar.querySelector(".msg").innerHTML =
                "如果应用未启动则需安装应用。如果更新后无法调起后端应用请重新执行安装脚本。详情见文档。 ";
        });
    }
    function handleImg(img) {
        if (img.dataset.handled) {
            return;
        }
        if (queueLength >= gmc.get('maxQueueLength')) {
            return;
        }
        queueLength++;
        refreshStateBar();
        img.dataset.handled = "true";
        let host = window.location.origin + "/";
        let model = gmc.fields.model.value;
        if (model.indexOf('realesrgan-x4plus-anime') !== -1) {
            model = 'realesrgan-x4plus-anime';
        }
        else {
            model = 'realesr-animevideov3';
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: img.src,
            headers: { referer: host },
            responseType: "blob",
            onload: function (r) {
                var blob = r.response;
                let oFileReader = new FileReader();
                oFileReader.onloadend = function () {
                    let base64 = oFileReader.result;
                    let scale = gmc.fields.scale.value;
                    const urlObj = new URL(img.src);
                    const url = urlObj.hostname + urlObj.pathname;
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://localhost:31485/handle_img",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                        data: JSON.stringify({ data: base64, level: scale, scale, model, url }),
                        onload: function (r) {
                            const token = r.response;
                            queueLength--;
                            refreshStateBar();
                            const distImgLink = `http://127.0.0.1:31485/get_img?token=${token}`;
                            (0, readMode_1.replaceReadModeImg)(distImgLink, img.src);
                            img.src = distImgLink;
                        },
                        onerror: function () {
                            stop = true;
                            queueLength--;
                            showErrorStateBar();
                            delete img.dataset.handled;
                        },
                    });
                };
                oFileReader.readAsDataURL(blob);
            },
        });
    }
    function checkAlive() {
        return new Promise((res, rej) => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://localhost:31485",
                    timeout: 1000,
                    onload: function (r) {
                        res();
                    },
                    onerror: function (e) {
                        rej();
                    },
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    var stateBar = document.createElement("div");
    stateBar.style.position = "fixed";
    stateBar.style.border = "1px solid #333";
    stateBar.style.padding = "8px";
    stateBar.style.backgroundColor = "#fff";
    stateBar.style.fontSize = "14px";
    stateBar.style.display = "none";
    stateBar.style.left = "20px";
    stateBar.style.bottom = "70px";
    stateBar.style.zIndex = "100001";
    document.body.appendChild(stateBar);
    const toolBar = document.createElement("div");
    toolBar.innerHTML = `
    
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
    </svg>
    
      `;
    toolBar.style.padding = "20px";
    toolBar.style.cursor = "pointer";
    toolBar.style.opacity = "0.5";
    toolBar.style.display = "none";
    toolBar.style.marginLeft = "30px";
    toolBar.style.marginTop = "100px";
    const hover = document.createElement("div");
    hover.style.width = "200px";
    hover.style.height = "300px";
    hover.style.position = "fixed";
    hover.style.left = "0";
    hover.style.bottom = "0";
    hover.addEventListener("mousemove", function () {
        toolBar.style.display = "block";
    });
    hover.addEventListener("mouseleave", function () {
        toolBar.style.display = "none";
    });
    document.body.appendChild(hover);
    hover.appendChild(toolBar);
    toolBar.addEventListener("click", () => {
        openConfigPanel();
    });
    gmc.onInit = () => {
        checkAlive()
            .then(() => {
            stop = false;
        })
            .catch(() => {
            showErrorStateBar();
        });
        setInterval(() => {
            const allImg = Array.from(document.getElementsByTagName("img"));
            allImg.forEach((img, i) => {
                if (img.offsetWidth >= 400 && !img.src.match(/.*\.gif/) && !img.dataset.skip) {
                    var pEle = img.parentElement;
                    if (pEle.tagName === "A" && pEle.href.indexOf("/ad/") !== -1) {
                        return;
                    }
                    if (!img.dataset.width) {
                        img.dataset.width = `${img.offsetWidth}px`;
                    }
                    if (!img.style.width) {
                        img.style.width = img.offsetWidth + 'px';
                    }
                    if (img.dataset.index === undefined) {
                        img.dataset.index = `${imgDomIndex}`;
                        imgDomIndex++;
                        (0, readMode_1.addImgToReadMode)(img);
                    }
                    if (!stop && !img.dataset.handled) {
                        waitImg(img, handleImg);
                    }
                }
            });
        }, 300);
        setInterval(() => {
            checkAlive()
                .then(() => {
                if (stop) {
                    stateBar.style.display = 'none';
                }
                stop = false;
                isShowError = false;
            })
                .catch(() => {
                stop = true;
                showErrorStateBar();
            });
        }, 1000);
        GM_registerMenuCommand('AI缩放选项', function () {
            openConfigPanel();
        });
        if (gmc.get('isAutoEnterReadMode')) {
            setTimeout(() => {
                (0, readMode_1.enterReadMode)();
            }, 500);
        }
    };
})();


/***/ }),

/***/ 186:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceReadModeImg = exports.addImgToReadMode = exports.enterReadMode = exports.imgList = void 0;
function scrollDown() {
    document.documentElement.scrollTop = document.documentElement.scrollTop + 1000;
    document.body.scrollTop = document.body.scrollTop + 1000;
}
exports.imgList = [];
let readModeTimer = 0;
let oScrollPosition = 0;
const root = document.createElement('div');
const rootId = '__manga_read_mode';
const scrollViewId = '__scrollview';
const singleViewId = '__singleView';
root.id = rootId;
root.style.display = 'none';
root.style.width = '100%';
root.style.height = '100%';
root.style.backgroundColor = 'rgb(255,255,255)';
root.style.position = 'fixed';
root.style.left = '0';
root.style.top = '0';
root.style.zIndex = '100000';
root.style.overflow = 'auto';
const scrollView = document.createElement('div');
scrollView.style.overflow = 'auto';
scrollView.style.width = '100%';
scrollView.style.display = 'flex';
scrollView.style.flexDirection = 'column';
scrollView.style.alignItems = 'center';
scrollView.style.overflowX = 'hidden';
scrollView.id = ('__scrollview');
const scrollViewWrap = document.createElement('div');
scrollViewWrap.id = '__scrollviewWrap';
scrollViewWrap.style.overflow = 'auto';
scrollViewWrap.appendChild(scrollView);
function scrollViewToolbarFactory() {
    const scrollViewToolbar = document.createElement('div');
    scrollViewToolbar.style.display = 'flex';
    scrollViewToolbar.style.justifyContent = 'center';
    scrollViewToolbar.style.alignItems = 'center';
    scrollViewToolbar.style.width = "100%";
    scrollViewToolbar.style.height = "100px";
    scrollViewToolbar.innerHTML = `
  <div class="__toPrev" style="font-size:20px;cursor:pointer" >上一话</div>
  <div style="width:50px">    </div>
  <div class="__toNext" style="font-size:20px;cursor:pointer" >下一话</div>
  `;
    scrollViewToolbar.querySelector('.__toPrev').addEventListener('click', () => {
        if (window.location.hostname.indexOf('manhuagui') !== -1) {
            SMH.prevC();
        }
        else if (window.location.hostname.indexOf('manhuabika') !== -1) {
            chapterJump('prev');
        }
    });
    scrollViewToolbar.querySelector('.__toNext').addEventListener('click', () => {
        if (window.location.hostname.indexOf('manhuagui') !== -1) {
            SMH.nextC();
        }
        else if (window.location.hostname.indexOf('manhuabika') !== -1) {
            chapterJump('next');
        }
    });
    return scrollViewToolbar;
}
scrollViewWrap.appendChild(scrollViewToolbarFactory());
scrollViewWrap.insertBefore(scrollViewToolbarFactory(), scrollViewWrap.firstChild);
root.appendChild(scrollViewWrap);
const singleView = document.createElement('div');
singleView.id = singleViewId;
singleView.style.width = '100%';
singleView.style.height = '100%';
singleView.style.display = 'flex';
singleView.style.justifyContent = 'center';
const singleViewImg1 = document.createElement('img');
const singleViewImg1Id = '__singleViewImg1';
singleViewImg1.style.height = window.innerHeight + 'px';
singleViewImg1.style.userSelect = 'none';
singleViewImg1.dataset.skip = 'true';
singleViewImg1.id = singleViewImg1Id;
singleView.appendChild(singleViewImg1);
let readModeCurrentIndex = 0;
function jump(step) {
    console.log(exports.imgList);
    const currentImgObj = exports.imgList.find(o => o.index === readModeCurrentIndex + step);
    if (currentImgObj) {
        singleViewImg1.src = currentImgObj.src ? currentImgObj.src : currentImgObj.oSrc;
        readModeCurrentIndex = currentImgObj.index;
    }
}
singleView.addEventListener('click', function (event) {
    var mouseX = event.clientX;
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (mouseX < screenWidth / 2) {
        console.log("鼠标位于屏幕左侧");
        jump(-1);
    }
    else {
        console.log("鼠标位于屏幕右侧");
        jump(1);
    }
});
root.appendChild(singleView);
const quitBtn = document.createElement('div');
quitBtn.innerHTML = '退出阅读模式';
quitBtn.style.position = 'fixed';
quitBtn.style.right = '20px';
quitBtn.style.bottom = '20px';
quitBtn.style.cursor = 'pointer';
quitBtn.addEventListener('click', quitReadMode);
root.appendChild(quitBtn);
function enterReadMode(mode = 0) {
    oScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    root.style.display = 'block';
    readModeTimer = setInterval(function () {
        scrollDown();
    }, 100);
    enterReadModeBtn.style.visibility = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    switch (mode) {
        case 1:
            scrollView.style.display = 'none';
            singleView.style.display = 'flex';
            root.className = '__single';
            break;
        default:
            scrollView.style.display = 'flex';
            singleView.style.display = 'none';
            root.className = '__scroll';
    }
}
exports.enterReadMode = enterReadMode;
function quitReadMode() {
    root.className = '';
    document.documentElement.style.overflow = 'auto';
    root.style.display = 'none';
    clearInterval(readModeTimer);
    enterReadModeBtn.style.visibility = 'visible';
    document.documentElement.scrollTop = oScrollPosition;
    document.body.scrollTop = oScrollPosition;
}
const enterReadModeBtn = document.createElement('div');
enterReadModeBtn.style.backgroundColor = 'white';
enterReadModeBtn.style.position = 'fixed';
enterReadModeBtn.style.padding = '5px 10px';
enterReadModeBtn.style.right = '10px';
enterReadModeBtn.style.bottom = '175px';
enterReadModeBtn.style.border = '1px solid #000';
enterReadModeBtn.style.cursor = 'pointer';
enterReadModeBtn.innerHTML = '进入阅读模式';
enterReadModeBtn.addEventListener('click', () => { enterReadMode(0); });
function initReadMode() {
    document.body.appendChild(enterReadModeBtn);
    document.body.appendChild(root);
}
exports["default"] = initReadMode;
function addImgToReadMode(img) {
    const imgObj = { oSrc: img.src, src: ``, index: parseInt(img.dataset.index) };
    exports.imgList.push(imgObj);
    if (!singleViewImg1.src) {
        singleViewImg1.src = imgObj.oSrc;
    }
    const scrollView = document.getElementById(scrollViewId);
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.width = img.dataset.width;
    imgContainer.style.maxWidth = '100%';
    imgContainer.className = 'img-container';
    imgContainer.dataset.index = `${imgObj.index}`;
    const copyImg = img.cloneNode();
    copyImg.style.width = '100%';
    copyImg.dataset.skip = 'true';
    imgContainer.appendChild(copyImg);
    const pageTag = document.createElement('div');
    pageTag.innerHTML = `第 ${imgObj.index + 1} 页`;
    pageTag.style.position = 'absolute';
    pageTag.style.right = '-60px';
    pageTag.style.bottom = '0px';
    imgContainer.appendChild(pageTag);
    scrollView.appendChild(imgContainer);
    const elements = Array.from(scrollView.getElementsByClassName('img-container'));
    elements.sort((a, b) => {
        const indexA = parseInt(a.dataset.index);
        const indexB = parseInt(b.dataset.index);
        if (indexA < indexB) {
            return -1;
        }
        else if (indexA > indexB) {
            return 1;
        }
        else {
            return 0;
        }
    });
    elements.forEach(element => {
        scrollView.appendChild(element);
    });
}
exports.addImgToReadMode = addImgToReadMode;
function replaceReadModeImg(url, oldUrl) {
    const readModeImgs = Array.from(root.getElementsByTagName('img'));
    readModeImgs.forEach(function (rImg) {
        if (rImg.src === oldUrl) {
            rImg.src = url;
        }
    });
    const imgObj = exports.imgList.find(o => {
        o.oSrc === oldUrl;
    });
    if (imgObj) {
        imgObj.oSrc = url;
    }
}
exports.replaceReadModeImg = replaceReadModeImg;


/***/ }),

/***/ 494:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let GM_config = (function (GM) {
    // This is the initializer function
    function GM_configInit(config, args) {
      // Initialize instance variables
      if (typeof config.fields == "undefined") {
        config.fields = {};
        config.onInit = config.onInit || function () {};
        config.onOpen = config.onOpen || function () {};
        config.onSave = config.onSave || function () {};
        config.onClose = config.onClose || function () {};
        config.onReset = config.onReset || function () {};
        config.isOpen = false;
        config.title = "User Script Settings";
        config.css = {
          basic:
            [
              "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }",
              "#GM_config { background: #FFF; }",
              "#GM_config input[type='radio'] { margin-right: 8px; }",
              "#GM_config .indent40 { margin-left: 40%; }",
              "#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }",
              "#GM_config .radio_label { font-size: 12px; }",
              "#GM_config .block { display: block; }",
              "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
              "#GM_config .reset, #GM_config .reset a," +
                " #GM_config_buttons_holder { color: #000; text-align: right; }",
              "#GM_config .config_header { font-size: 20pt; margin: 0; }",
              "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
              "#GM_config .center { text-align: center; }",
              "#GM_config .section_header_holder { margin-top: 8px; }",
              "#GM_config .config_var { margin: 0 0 4px; }",
              "#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;",
              " font-size: 13pt; margin: 0; }",
              "#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757;" +
                " font-size: 9pt; margin: 0 0 6px; }",
            ].join("\n") + "\n",
          basicPrefix: "GM_config",
          stylish: "",
        };
      }
      config.frameStyle = [
        "bottom: auto; border: 1px solid #000; display: none; height: 75%;",
        "left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;",
        "overflow: auto; padding: 0; position: fixed; right: auto; top: 0;",
        "width: 75%; z-index: 9999;",
      ].join(" ");

      var settings = null;
      if (
        args.length == 1 &&
        typeof args[0].id == "string" &&
        typeof args[0].appendChild != "function"
      )
        settings = args[0];
      else {
        // Provide backwards-compatibility with argument style intialization
        settings = {};

        // loop through GM_config.init() arguments
        for (let i = 0, l = args.length, arg; i < l; ++i) {
          arg = args[i];

          // An element to use as the config window
          if (typeof arg.appendChild == "function") {
            settings.frame = arg;
            continue;
          }

          switch (typeof arg) {
            case "object":
              for (let j in arg) {
                // could be a callback functions or settings object
                if (typeof arg[j] != "function") {
                  // we are in the settings object
                  settings.fields = arg; // store settings object
                  break; // leave the loop
                } // otherwise it must be a callback function
                if (!settings.events) settings.events = {};
                settings.events[j] = arg[j];
              }
              break;
            case "function": // passing a bare function is set to open callback
              settings.events = { onOpen: arg };
              break;
            case "string": // could be custom CSS or the title string
              if (/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg))
                settings.css = arg;
              else settings.title = arg;
              break;
          }
        }
      }

      /* Initialize everything using the new settings object */
      // Set the id
      if (settings.id) config.id = settings.id;
      else if (typeof config.id == "undefined") config.id = "GM_config";

      // Set the title
      if (settings.title) config.title = settings.title;

      // Set the custom css
      if (settings.css) config.css.stylish = settings.css;

      // Set the frame
      if (settings.frame) config.frame = settings.frame;

      // Set the style attribute of the frame
      if (typeof settings.frameStyle === "string")
        config.frameStyle = settings.frameStyle;

      // Set the event callbacks
      if (settings.events) {
        let events = settings.events;
        for (let e in events) {
          config["on" + e.charAt(0).toUpperCase() + e.slice(1)] = events[e];
        }
      }

      // If the id has changed we must modify the default style
      if (config.id != config.css.basicPrefix) {
        config.css.basic = config.css.basic.replace(
          new RegExp("#" + config.css.basicPrefix, "gm"),
          "#" + config.id
        );
        config.css.basicPrefix = config.id;
      }

      // Create the fields
      config.isInit = false;
      if (settings.fields) {
        config.read(null, (stored) => {
          // read the stored settings
          let fields = settings.fields,
            customTypes = settings.types || {},
            configId = config.id;

          for (let id in fields) {
            let field = fields[id],
              fieldExists = false;

            if (config.fields[id]) {
              fieldExists = true;
            }

            // for each field definition create a field object
            if (field) {
              if (config.isOpen && fieldExists) {
                config.fields[id].remove();
              }

              config.fields[id] = new GM_configField(
                field,
                stored[id],
                id,
                customTypes[field.type],
                configId
              );

              // Add field to open frame
              if (config.isOpen) {
                config.fields[id].wrapper = config.fields[id].toNode();
                config.frameSection.appendChild(config.fields[id].wrapper);
              }
            } else if (!field && fieldExists) {
              // Remove field from open frame
              if (config.isOpen) {
                config.fields[id].remove();
              }

              delete config.fields[id];
            }
          }

          config.isInit = true;
          config.onInit.call(config);
        });
      } else {
        config.isInit = true;
        config.onInit.call(config);
      }
    }

    let construct = function () {
      // Parsing of input provided via frontends
      GM_configInit(this, arguments);
    };
    construct.prototype = {
      // Support re-initalization
      init: function () {
        GM_configInit(this, arguments);
      },

      // call GM_config.open() from your script to open the menu
      open: function () {
        // don't open before init is finished
        if (!this.isInit) {
          setTimeout(() => this.open(), 0);
          return;
        }
        // Die if the menu is already open on this page
        // You can have multiple instances but you can't open the same instance twice
        let match = document.getElementById(this.id);
        if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0))
          return;

        // Sometimes "this" gets overwritten so create an alias
        let config = this;

        // Function to build the mighty config window :)
        function buildConfigWin(body, head) {
          let create = config.create,
            fields = config.fields,
            configId = config.id,
            bodyWrapper = create("div", { id: configId + "_wrapper" });

          // Append the style which is our default style plus the user style
          head.appendChild(
            create("style", {
              type: "text/css",
              textContent: config.css.basic + config.css.stylish,
            })
          );

          // Add header and title
          bodyWrapper.appendChild(
            create(
              "div",
              {
                id: configId + "_header",
                className: "config_header block center",
              },
              config.title
            )
          );

          // Append elements
          let section = bodyWrapper,
            secNum = 0; // Section count

          // loop through fields
          for (let id in fields) {
            let field = fields[id],
              settings = field.settings;

            if (settings.section) {
              // the start of a new section
              section = bodyWrapper.appendChild(
                create("div", {
                  className: "section_header_holder",
                  id: configId + "_section_" + secNum,
                })
              );

              if (!Array.isArray(settings.section))
                settings.section = [settings.section];

              if (settings.section[0])
                section.appendChild(
                  create(
                    "div",
                    {
                      className: "section_header center",
                      id: configId + "_section_header_" + secNum,
                    },
                    settings.section[0]
                  )
                );

              if (settings.section[1])
                section.appendChild(
                  create(
                    "p",
                    {
                      className: "section_desc center",
                      id: configId + "_section_desc_" + secNum,
                    },
                    settings.section[1]
                  )
                );
              ++secNum;
            }

            if (secNum === 0) {
              section = bodyWrapper.appendChild(
                create("div", {
                  className: "section_header_holder",
                  id: configId + "_section_" + secNum++,
                })
              );
            }

            // Create field elements and append to current section
            section.appendChild((field.wrapper = field.toNode()));
          }

          config.frameSection = section;

          // Add save and close buttons
          bodyWrapper.appendChild(
            create(
              "div",
              { id: configId + "_buttons_holder" },

              create("button", {
                id: configId + "_saveBtn",
                textContent: "Save",
                title: "Save settings",
                className: "saveclose_buttons",
                onclick: function () {
                  config.save();
                },
              }),

              create("button", {
                id: configId + "_closeBtn",
                textContent: "Close",
                title: "Close window",
                className: "saveclose_buttons",
                onclick: function () {
                  config.close();
                },
              }),

              create(
                "div",
                { className: "reset_holder block" },

                // Reset link
                create("a", {
                  id: configId + "_resetLink",
                  textContent: "Reset to defaults",
                  href: "#",
                  title: "Reset fields to default values",
                  className: "reset",
                  onclick: function (e) {
                    e.preventDefault();
                    config.reset();
                  },
                })
              )
            )
          );

          body.appendChild(bodyWrapper); // Paint everything to window at once
          config.center(); // Show and center iframe
          window.addEventListener("resize", config.center, false); // Center frame on resize

          // Call the open() callback function
          config.onOpen(
            config.frame.contentDocument || config.frame.ownerDocument,
            config.frame.contentWindow || window,
            config.frame
          );

          // Close frame on window close
          window.addEventListener(
            "beforeunload",
            function () {
              config.close();
            },
            false
          );

          // Now that everything is loaded, make it visible
          config.frame.style.display = "block";
          config.isOpen = true;
        }

        // Either use the element passed to init() or create an iframe
        if (this.frame) {
          this.frame.id = this.id; // Allows for prefixing styles with the config id
          if (this.frameStyle)
            this.frame.setAttribute("style", this.frameStyle);
          buildConfigWin(
            this.frame,
            this.frame.ownerDocument.getElementsByTagName("head")[0]
          );
        } else {
          // Create frame
          this.frame = this.create("iframe", { id: this.id });
          if (this.frameStyle)
            this.frame.setAttribute("style", this.frameStyle);
          document.body.appendChild(this.frame);

          // In WebKit src can't be set until it is added to the page
          this.frame.src = "";
          // we wait for the iframe to load before we can modify it
          let that = this;
          this.frame.addEventListener(
            "load",
            function (e) {
              let frame = config.frame;
              if (!frame.contentDocument) {
                that.log(
                  "GM_config failed to initialize default settings dialog node!"
                );
              } else {
                let body =
                  frame.contentDocument.getElementsByTagName("body")[0];
                body.id = config.id; // Allows for prefixing styles with the config id
                buildConfigWin(
                  body,
                  frame.contentDocument.getElementsByTagName("head")[0]
                );
              }
            },
            false
          );
        }
      },

      save: function () {
        this.write(null, null, (vals) => this.onSave(vals));
      },

      close: function () {
        // If frame is an iframe then remove it
        if (this.frame && this.frame.contentDocument) {
          this.remove(this.frame);
          this.frame = null;
        } else if (this.frame) {
          // else wipe its content
          this.frame.innerHTML = "";
          this.frame.style.display = "none";
        }

        // Null out all the fields so we don't leak memory
        let fields = this.fields;
        for (let id in fields) {
          let field = fields[id];
          field.wrapper = null;
          field.node = null;
        }

        this.onClose(); //  Call the close() callback function
        this.isOpen = false;
      },

      set: function (name, val) {
        this.fields[name].value = val;

        if (this.fields[name].node) {
          this.fields[name].reload();
        }
      },

      get: function (name, getLive) {
        /* Migration warning */
        if (!this.isInit) {
          this.log(
            "GM_config: get called before init, see https://github.com/sizzlemctwizzle/GM_config/issues/113"
          );
        }

        let field = this.fields[name],
          fieldVal = null;

        if (getLive && field.node) {
          fieldVal = field.toValue();
        }

        return fieldVal != null ? fieldVal : field.value;
      },

      write: function (store, obj, cb) {
        let forgotten = null,
          values = null;
        if (!obj) {
          let fields = this.fields;

          values = {};
          forgotten = {};

          for (let id in fields) {
            let field = fields[id];
            let value = field.toValue();

            if (field.save) {
              if (value != null) {
                values[id] = value;
                field.value = value;
              } else values[id] = field.value;
            } else forgotten[id] = value != null ? value : field.value;
          }
        }

        (async () => {
          try {
            let val = this.stringify(obj || values);
            await this.setValue(store || this.id, val);
          } catch (e) {
            this.log("GM_config failed to save settings!");
          }
          cb(forgotten);
        })();
      },

      read: function (store, cb) {
        (async () => {
          let val = await this.getValue(store || this.id, "{}");
          try {
            let rval = this.parser(val);
            cb(rval);
          } catch (e) {
            this.log("GM_config failed to read saved settings!");
            cb({});
          }
        })();
      },

      reset: function () {
        let fields = this.fields;

        // Reset all the fields
        for (let id in fields) {
          fields[id].reset();
        }

        this.onReset(); // Call the reset() callback function
      },

      create: function () {
        let A = null,
          B = null;
        switch (arguments.length) {
          case 1:
            A = document.createTextNode(arguments[0]);
            break;
          default:
            A = document.createElement(arguments[0]);
            B = arguments[1];
            for (let b in B) {
              if (b.indexOf("on") == 0)
                A.addEventListener(b.substring(2), B[b], false);
              else if (
                ",style,accesskey,id,name,src,href,which,for".indexOf(
                  "," + b.toLowerCase()
                ) != -1
              )
                A.setAttribute(b, B[b]);
              else A[b] = B[b];
            }
            if (typeof arguments[2] == "string") A.innerHTML = arguments[2];
            else
              for (let i = 2, len = arguments.length; i < len; ++i)
                A.appendChild(arguments[i]);
        }
        return A;
      },

      center: function () {
        let node = this.frame;
        if (!node) return;
        let style = node.style,
          beforeOpacity = style.opacity;
        if (style.display == "none") style.opacity = "0";
        style.display = "";
        style.top =
          Math.floor(window.innerHeight / 2 - node.offsetHeight / 2) + "px";
        style.left =
          Math.floor(window.innerWidth / 2 - node.offsetWidth / 2) + "px";
        style.opacity = "1";
      },

      remove: function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      },
    };

    construct.prototype.name = "GM_config";
    construct.prototype.constructor = construct;
    let isGM4 =
      typeof GM.getValue !== "undefined" && typeof GM.setValue !== "undefined";
    let isGM =
      isGM4 ||
      (typeof GM_getValue !== "undefined" &&
        typeof GM_getValue("a", "b") !== "undefined");
    construct.prototype.isGM = isGM;

    if (!isGM4) {
      let promisify =
        (old) =>
        (...args) => {
          return new Promise((resolve, reject) => {
            try {
              resolve(old.apply(this, args));
            } catch (e) {
              reject(e);
            }
          });
        };

      let getValue = isGM
        ? GM_getValue
        : (name, def) => {
            let s = localStorage.getItem(name);
            return s !== null ? s : def;
          };
      let setValue = isGM
        ? GM_setValue
        : (name, value) => localStorage.setItem(name, value);
      let log = typeof GM_log !== "undefined" ? GM_log : console.log;

      GM.getValue = promisify(getValue);
      GM.setValue = promisify(setValue);
      GM.log = promisify(log);
    }

    construct.prototype.stringify = JSON.stringify;
    construct.prototype.parser = JSON.parse;
    construct.prototype.getValue = GM.getValue;
    construct.prototype.setValue = GM.setValue;
    construct.prototype.log = GM.log || console.log;

    // Passthrough frontends for new and old usage
    let config = function () {
      return new (config.bind.apply(
        construct,
        [null].concat(Array.from(arguments))
      ))();
    };
    config.prototype.constructor = config;

    // Support old method of initalizing
    config.init = function () {
      GM_config = config.apply(this, arguments);
      GM_config.init = function () {
        GM_configInit(this, arguments);
      };
    };

    // Reusable functions and properties
    // Usable via GM_config.*
    config.create = construct.prototype.create;
    config.isGM = construct.prototype.isGM;
    config.setValue = construct.prototype.setValue;
    config.getValue = construct.prototype.getValue;
    config.stringify = construct.prototype.stringify;
    config.parser = construct.prototype.parser;
    config.log = construct.prototype.log;
    config.remove = construct.prototype.remove;
    config.read = construct.prototype.read.bind(config);
    config.write = construct.prototype.write.bind(config);

    return config;
  })(typeof GM === "object" ? GM : Object.create(null));
  let GM_configStruct = (/* unused pure expression or super */ null && (GM_config));

  function GM_configField(settings, stored, id, customType, configId) {
    // Store the field's settings
    this.settings = settings;
    this.id = id;
    this.configId = configId;
    this.node = null;
    this.wrapper = null;
    this.save = typeof settings.save == "undefined" ? true : settings.save;

    // Buttons are static and don't have a stored value
    if (settings.type == "button") this.save = false;

    // if a default value wasn't passed through init() then
    //   if the type is custom use its default value
    //   else use default value for type
    // else use the default value passed through init()
    this["default"] =
      typeof settings["default"] == "undefined"
        ? customType
          ? customType["default"]
          : this.defaultValue(settings.type, settings.options)
        : settings["default"];

    // Store the field's value
    this.value = typeof stored == "undefined" ? this["default"] : stored;

    // Setup methods for a custom type
    if (customType) {
      this.toNode = customType.toNode;
      this.toValue = customType.toValue;
      this.reset = customType.reset;
    }
  }

  GM_configField.prototype = {
    create: GM_config.create,

    defaultValue: function (type, options) {
      let value;

      if (type.indexOf("unsigned ") == 0) type = type.substring(9);

      switch (type) {
        case "radio":
        case "select":
          value = options[0];
          break;
        case "checkbox":
          value = false;
          break;
        case "int":
        case "integer":
        case "float":
        case "number":
          value = 0;
          break;
        default:
          value = "";
      }

      return value;
    },

    toNode: function () {
      let field = this.settings,
        value = this.value,
        options = field.options,
        type = field.type,
        id = this.id,
        configId = this.configId,
        labelPos = field.labelPos,
        create = this.create;

      function addLabel(pos, labelEl, parentNode, beforeEl) {
        if (!beforeEl) beforeEl = parentNode.firstChild;
        switch (pos) {
          case "right":
          case "below":
            if (pos == "below") parentNode.appendChild(create("br", {}));
            parentNode.appendChild(labelEl);
            break;
          default:
            if (pos == "above")
              parentNode.insertBefore(create("br", {}), beforeEl);
            parentNode.insertBefore(labelEl, beforeEl);
        }
      }

      let retNode = create("div", {
          className: "config_var",
          id: configId + "_" + id + "_var",
          title: field.title || "",
        }),
        firstProp;

      // Retrieve the first prop
      for (let i in field) {
        firstProp = i;
        break;
      }

      let label =
        field.label && type != "button"
          ? create(
              "label",
              {
                id: configId + "_" + id + "_field_label",
                for: configId + "_field_" + id,
                className: "field_label",
              },
              field.label
            )
          : null;

      let wrap = null;
      switch (type) {
        case "textarea":
          retNode.appendChild(
            (this.node = create("textarea", {
              innerHTML: value,
              id: configId + "_field_" + id,
              className: "block",
              cols: field.cols ? field.cols : 20,
              rows: field.rows ? field.rows : 2,
            }))
          );
          break;
        case "radio":
          wrap = create("div", {
            id: configId + "_field_" + id,
          });
          this.node = wrap;

          for (let i = 0, len = options.length; i < len; ++i) {
            let radLabel = create(
              "label",
              {
                className: "radio_label",
              },
              options[i]
            );

            let rad = wrap.appendChild(
              create("input", {
                value: options[i],
                type: "radio",
                name: id,
                checked: options[i] == value,
              })
            );

            let radLabelPos =
              labelPos && (labelPos == "left" || labelPos == "right")
                ? labelPos
                : firstProp == "options"
                ? "left"
                : "right";

            addLabel(radLabelPos, radLabel, wrap, rad);
          }

          retNode.appendChild(wrap);
          break;
        case "select":
          wrap = create("select", {
            id: configId + "_field_" + id,
          });
          this.node = wrap;

          for (let i = 0, len = options.length; i < len; ++i) {
            let option = options[i];
            wrap.appendChild(
              create(
                "option",
                {
                  value: option,
                  selected: option == value,
                },
                option
              )
            );
          }

          retNode.appendChild(wrap);
          break;
        default: // fields using input elements
          let props = {
            id: configId + "_field_" + id,
            type: type,
            value: type == "button" ? field.label : value,
          };

          switch (type) {
            case "checkbox":
              props.checked = value;
              break;
            case "button":
              props.size = field.size ? field.size : 25;
              if (field.script) field.click = field.script;
              if (field.click) props.onclick = field.click;
              break;
            case "hidden":
              break;
            default:
              // type = text, int, or float
              props.type = "text";
              props.size = field.size ? field.size : 25;
          }

          retNode.appendChild((this.node = create("input", props)));
      }

      if (label) {
        // If the label is passed first, insert it before the field
        // else insert it after
        if (!labelPos)
          labelPos = firstProp == "label" || type == "radio" ? "left" : "right";

        addLabel(labelPos, label, retNode);
      }

      return retNode;
    },

    toValue: function () {
      let node = this.node,
        field = this.settings,
        type = field.type,
        unsigned = false,
        rval = null;

      if (!node) return rval;

      if (type.indexOf("unsigned ") == 0) {
        type = type.substring(9);
        unsigned = true;
      }

      switch (type) {
        case "checkbox":
          rval = node.checked;
          break;
        case "select":
          rval = node[node.selectedIndex].value;
          break;
        case "radio":
          let radios = node.getElementsByTagName("input");
          for (let i = 0, len = radios.length; i < len; ++i) {
            if (radios[i].checked) rval = radios[i].value;
          }
          break;
        case "button":
          break;
        case "int":
        case "integer":
        case "float":
        case "number":
          let num = Number(node.value);
          let warn =
            'Field labeled "' +
            field.label +
            '" expects a' +
            (unsigned ? " positive " : "n ") +
            "integer value";

          if (
            isNaN(num) ||
            (type.substr(0, 3) == "int" && Math.ceil(num) != Math.floor(num)) ||
            (unsigned && num < 0)
          ) {
            alert(warn + ".");
            return null;
          }

          if (!this._checkNumberRange(num, warn)) return null;
          rval = num;
          break;
        default:
          rval = node.value;
          break;
      }

      return rval; // value read successfully
    },

    reset: function () {
      let node = this.node,
        field = this.settings,
        type = field.type;

      if (!node) return;

      switch (type) {
        case "checkbox":
          node.checked = this["default"];
          break;
        case "select":
          for (let i = 0, len = node.options.length; i < len; ++i) {
            if (node.options[i].textContent == this["default"])
              node.selectedIndex = i;
          }
          break;
        case "radio":
          let radios = node.getElementsByTagName("input");
          for (let i = 0, len = radios.length; i < len; ++i) {
            if (radios[i].value == this["default"]) radios[i].checked = true;
          }
          break;
        case "button":
          break;
        default:
          node.value = this["default"];
          break;
      }
    },

    remove: function () {
      GM_config.remove(this.wrapper);
      this.wrapper = null;
      this.node = null;
    },

    reload: function () {
      let wrapper = this.wrapper;
      if (wrapper) {
        let fieldParent = wrapper.parentNode;
        let newWrapper = this.toNode();
        fieldParent.insertBefore(newWrapper, wrapper);
        GM_config.remove(this.wrapper);
        this.wrapper = newWrapper;
      }
    },

    _checkNumberRange: function (num, warn) {
      let field = this.settings;
      if (typeof field.min == "number" && num < field.min) {
        alert(warn + " greater than or equal to " + field.min + ".");
        return null;
      }

      if (typeof field.max == "number" && num > field.max) {
        alert(warn + " less than or equal to " + field.max + ".");
        return null;
      }
      return true;
    },
  };


  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GM_config);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;