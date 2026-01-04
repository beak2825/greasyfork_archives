// ==UserScript==
// @name         e-hance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个脚本，用来改善e站的观看体验
// @author       wof
// @match        https://e-hentai.org/g/*
// @match        https://exhentai.org/g/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     customCSS https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @resource     animeCSS  https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492293/e-hance.user.js
// @updateURL https://update.greasyfork.org/scripts/492293/e-hance.meta.js
// ==/UserScript==
let util = {
    getValue(name) {
        return GM_getValue(name);
    },

    setValue(name, value) {
        GM_setValue(name, value);
    },

    removeValue(name) {
        GM_deleteValue(name);
    },

    addStyle(id, tag, css) {
        tag = tag || 'style';
        let doc = document, styleDom = doc.getElementById(id);
        if (styleDom) return;
        let style = doc.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        doc.head.appendChild(style);
    },
};

var totalpic = 0; // 总图片数
var nowpic = 1; // 当前图片序号
var nowpage = -1; // 当前页数
var nowpageurl = new Array(); // 现在页的所有图片url
var nowurl = ""; // 当前图片的url
var scale = 1; // 图片大小
var imgurl = {}; // 现在页的所有图片src url

var cacheAbortController = null; // 缓存控制
var cacheAbortSignal = null; // 缓存终止信号
var willshowads = false; // 是否显示广告

function getUrl(pic) {
    return new Promise(async (resolve, reject) => {
        try {
            var nowpic = pic - 1;
            var page = pic / 40;
            if (page == nowpage && !nowpageurl) {

            } else {
                var host = window.location.href.replace(/\?.*$/, "");
                host = host + "?p=" + page;
                await fetch(host)
                    .then(response => response.text())
                    .then(res => {
                        var parser = new DOMParser();
                        var htmlDocument = parser.parseFromString(res, 'text/html');
                        var pages = htmlDocument.getElementById('gdt').children;
                        nowpageurl = [];
                        for (var i = 0; i < pages.length - 1; i++) {
                            nowpageurl.push(pages[i].firstChild.firstChild.href);
                        }
                    });

                nowpage = page;
            }
            await fetch(nowpageurl[nowpic % 40])
                .then(response => response.text())
                .then(res => {
                    var parser = new DOMParser();
                    var htmlDocument = parser.parseFromString(res, 'text/html');
                    nowurl = htmlDocument.getElementById('img').src;
                })
                .catch(e => {
                    1;
                });

            if (!imgurl[pic]) {
                var url = nowurl;
                imgurl[pic] = url;
            }

            var p = {
                pic: pic,
                url: nowurl,
            }
            resolve(p);
        } catch (error) {
            reject(error);
        }
    });
}

function recover() {
    var picture = document.getElementById('img');
    picture.style.height = "100%";
    scale = 1;
    picture.style.transform = `translate(-50%) scale(${scale})`;
    picture.style.top = "0px";
    picture.style.left = "50%";
    document.getElementById("page").innerHTML = `${nowpic}/${totalpic}`;
}

function buttonable() {
    var preButton = document.getElementById('pre');
    var nextButton = document.getElementById('next');
    switch (nowpic) {
        case totalpic: {
            nextButton.style.pointerEvents = "none";
            preButton.style.pointerEvents = "auto";
            break;
        }
        case 1: {
            preButton.style.pointerEvents = "none";
            nextButton.style.pointerEvents = "auto";
            break;
        }
        default: {
            nextButton.style.pointerEvents = preButton.style.pointerEvents = "auto";
        }
    }
}

// 换页
function changepage(pic) {
    var picture = document.getElementById('img');
    var divMove = document.querySelector('div#viewer');
    var loading = document.getElementById("loading");
    var selecter = document.getElementById("pageselecter");

    selecter.value = pic;

    buttonable()

    if (imgurl[pic]) {
        if (pic != nowpic) {

        }
        else {
            cache5Images(pic);
            var newImage = new Image();
            newImage.src = imgurl[pic];

            if (newImage.complete) {
                divMove.style.background_image = `url(${imgurl[pic]}})`;
                picture.src = `${imgurl[pic]}`;
                picture.style.opacity = 1;
                loading.style.opacity = 0;
                recover();
            }
            else {
                picture.style.opacity = 0;
                loading.style.opacity = 1;
                recover();

                newImage.onload = function () {
                    if (pic != nowpic) {

                    }
                    else {
                        divMove.style.background_image = `url(${imgurl[pic]}})`;
                        picture.src = `${imgurl[pic]}`;
                        picture.style.opacity = 1;
                        loading.style.opacity = 0;
                        recover();
                    }
                }
            }
        }
    }
    else {
        picture.style.opacity = 0;
        loading.style.opacity = 1;
        recover();

        getUrl(pic).then((p) => {
            imgurl[p.pic] = p.url;
            if (p.pic != nowpic) {

            }
            else {
                cache5Images(pic);
                var newImage = new Image();
                newImage.src = p.url;
                if (newImage.complete) {
                    divMove.style.background_image = `url(${p.url}})`;
                    picture.src = `${p.url}`;
                    picture.style.opacity = 1;
                    loading.style.opacity = 0;
                    recover();
                }
                else {
                    newImage.onload = function () {
                        if (p.pic != nowpic) {

                        }
                        else {
                            divMove.style.background_image = `url(${p.url}})`;
                            picture.src = `${p.url}`;
                            picture.style.opacity = 1;
                            loading.style.opacity = 0;
                            recover();
                        }
                    }
                }
            }
        });

    }
}

function showSlider() {
    var slider = document.getElementById("slider");
    slider.classList.toggle("show");
    removeShiftByKeyborad();
    if (slider.classList.contains("show")) {
        window.addEventListener("click", hideSliderOnClick);
    } else {
        window.removeEventListener("click", hideSliderOnClick);
    }
}

function hideSliderOnClick(event) {
    var slider = document.getElementById("slider");
    var target = event.target;
    if (!slider.contains(target) && target !== slider && target !== document.getElementById("page")) {
        initShiftByKeyboard();
        slider.classList.remove("show");
        window.removeEventListener("click", hideSliderOnClick);
    }
}

var shiftbykeyboard = function (e) {
    if (e.key === "ArrowLeft" && nowpic != 1) {
        changepage(--nowpic);
    }
    else if (e.key === "ArrowRight" && nowpic != totalpic) {
        changepage(++nowpic);
    }
    else if (e.key === "M" || e.key === "m") {
        addBookmark(nowpic);
    }
    else if (e.key === "N" || e.key === "n") {
        removeBookmark();
    }
}

function initShiftByKeyboard() {
    document.body.getElementsByClassName("swal2-container swal2-center swal2-grow-fullscreen swal2-backdrop-show")[0].addEventListener("keydown",
        shiftbykeyboard,
        { capture: true, passive: true }
    );
}

function removeShiftByKeyborad() {
    document.body.getElementsByClassName("swal2-container swal2-center swal2-grow-fullscreen swal2-backdrop-show")[0].removeEventListener("keydown",
        shiftbykeyboard,
        { capture: true, passive: true }
    );
}

function initShiftButton() {
    var preButton = document.getElementById('pre');
    var nextButton = document.getElementById('next');
    nextButton.addEventListener("click", function () {
        changepage(++nowpic);
    });

    preButton.addEventListener("click", function () {
        changepage(--nowpic);
    });
}

function initSelecter() {
    var pageshower = document.getElementById("page");
    var selecter = document.getElementById("pageselecter");
    selecter.value = nowpic;

    pageshower.addEventListener("click", showSlider);

    selecter.addEventListener("keydown", function (e) {
        e.preventDefault();
    });

    selecter.addEventListener("input", function () {
        var value = selecter.value;
        document.getElementById("page").innerHTML = `${value}/${totalpic}`;
    });

    selecter.addEventListener("change", function () {
        var value = selecter.value;
        nowpic = Number(value);
        changepage(nowpic);
    });
}

function initPicFunction() {
    var picture = document.getElementById('img');
    picture.onmousedown = function (e) {
        if (e.button === 0) {
            let disX = e.clientX - e.target.offsetLeft;
            let disY = e.clientY - e.target.offsetTop;
            window.onmousemove = function (event) {
                picture.style.left = event.clientX - disX + 'px'
                picture.style.top = event.clientY - disY + 'px'
            }
        }
    }
    picture.onmouseup = function (e) {
        if (e.button === 0) {
            window.onmousemove = null
        }
    }
    picture.onwheel = function (e) {
        if (e.wheelDelta > 0) {
            scale += 0.1
            picture.style.transform = `translate(-50%) scale(${scale})`
        }
        else {
            if (scale - 0.1 > 0.1) {
                scale -= 0.1
                picture.style.transform = `translate(-50%) scale(${scale})`
            }
        }
    }
}

// 缓存图片
function cacheImage(pic, src, signal) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            resolve();
        };
        img.onerror = function () {
            1;
        };
        img.src = src;

        // 监听终止信号
        signal.addEventListener('abort', function () {
            if(pic > nowpic + 5 || pic < nowpic){
                reject();
            }
        });
    });
}

// 缓存当前页及后五张
async function cache5Images(pic) {
    if (cacheAbortController) {
        cacheAbortController.abort();
    }

    // 创建 AbortController 对象和 AbortSignal
    cacheAbortController = new AbortController();
    cacheAbortSignal = cacheAbortController.signal;

    // 创建 Promise 数组来存储每张图片的缓存操作
    var cachePromises = [];

    for (var i = pic; i <= pic + 5; i++) {
        var imgSrc = "";
        if (imgurl[i]) {
            imgSrc = imgurl[i];
        }
        else {
            await getUrl(i).then((p) => {
                imgSrc = p.url;
            })
        }
        var cachePromise = cacheImage(i, imgSrc, cacheAbortSignal);
        cachePromises.push(cachePromise);
    }
    Promise.all(cachePromises)
        .then(function () {

        })
        .catch(function () {
            1;
        })
}

// 书签相关
function addBookmark(pic) {
    showMessage(`已将第${pic}页作为书签位置`);
    util.setValue("bookmark", pic);
}

function checkBookmark() {
    var bookmark = util.getValue("bookmark");
    if (bookmark) {
        bookmark = Number(bookmark);
        if (isNaN(bookmark)) {
            return 1;
        }
        return bookmark;
    }
    else {
        return 1;
    }
}

function removeBookmark() {
    showMessage(`已移除书签`);
    util.removeValue("bookmark");
}

// 屏幕中央的提示信息
var messagetimer = null;
function showMessage(text) {
    if (messagetimer) {
        clearTimeout(messagetimer);
        messagetimer = null;
    }
    var messageBox = document.getElementById('viewer-messageBox');
    var previousMessageBox = document.querySelector('.show');

    if (previousMessageBox) {
        previousMessageBox.classList.remove('show');
        previousMessageBox.style.display = 'none';
    }

    messageBox.textContent = text;
    messageBox.style.display = 'block';

    messageBox.classList.add('show');

    messagetimer = setTimeout(function () {
        messageBox.classList.remove('show');
        messageBox.style.display = 'none';
    }, 3000);
}


(function () {
    'use strict';
    // 应用sweetalert和animate样式
    var css1 = GM_getResourceText("customCSS");
    GM_addStyle(css1);

    var css2 = GM_getResourceText("animeCSS");
    GM_addStyle(css2);

    // 获取总页数
    totalpic = Number((document.getElementsByClassName("gdt2")[5].innerHTML.split(" "))[0]);
    nowpic = checkBookmark();

    if (willshowads) {
        showAds();
    }

    // 打开菜单
    GM_registerMenuCommand('📚开启阅读器', async () => {
        var pictureurl;
        if (imgurl[nowpic]) {
            pictureurl = imgurl[nowpic];
        }
        else {
            pictureurl = await getUrl(nowpic);
            pictureurl = pictureurl['url'];
            imgurl[nowpic] = pictureurl;
        }

        let dom = `
        <div id="viewer">
            <div id="slider" class="slider-container">
                <input id = "pageselecter" type="range" name="points" value="1" min="1" max="${totalpic}">
            </div>
            <p id="loading">加载中</p>
            <img id = "img" src="${pictureurl}" alt="" draggable="false">
            <div id="pre" class="circle left"></div>
            <div id="next" class="circle right"></div>
            <div id="viewer-messageBox"></div>
        </div>`;
        let style = `
        .swal2-close {
            user-select: none;
        }
        .swal2-container {
            z-index: 9999;
        }
        div#viewer{
            height: 90vh;
            overflow: hidden;
            position: relative;
        }
        img#img{
            height: 100%;
            top: 0px;
            position: absolute;
            background-image: url("${pictureurl}");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            user-select: none;
            transform: translate(-50%);
            z-index: 999;
        }
        button#next{
            position: absolute;
        }

        .circle {
            position: absolute;
            top: 50%;
            width: 80px; /* 调整按钮的宽度 */
            height: 80px; /* 调整按钮的高度 */
            border-radius: 50%;
            background-color: rgba(128, 128, 128, 0.5); /* 灰色透明的背景颜色 */
            transform: translateY(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 1001;
        }

        .left {
            left: 5%;
        }

        .right {
            right: 5%;
        }

        .circle.left:before {
            content: "";
            width: 20px;
            height: 20px;
            border-top: 2px solid #fff;
            border-right: 2px solid #fff;
            transform: rotate(225deg);
        }

        .circle.right:before {
            content: "";
            width: 20px;
            height: 20px;
            border-top: 2px solid #fff;
            border-right: 2px solid #fff;
            transform: rotate(45deg);
        }
        .circle:hover {
            background-color: rgba(128, 128, 128, 0.8); /* 鼠标悬停时的背景颜色 */
        }

        .circle:hover:before {
            border-color: #fff; /* 鼠标悬停时的箭头颜色 */
        }

        .slider-container {
            position: absolute;
            top: -100%; /* 初始位置在最上方 */
            left: 15%;
            width: 70%;
            height: 3%;
            background-color: black;
            transition: top 0.5s; /* 添加过渡效果 */
            z-index: 1000;
            text-align:center;
        }

        .slider-container.show {
            top: 0; /* 滑动下来时的位置 */
        }
        #pageselecter{
            margin: 0 auto;
            width: 90%;
            user-select: none;
        }
        #loading{
            user-select: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            opacity: 0;
        }
        #viewer-messageBox {
            display: none;
            user-select: none;
            position: absolute;
            font-size: 30px;
            color: #FFFFFF;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: auto;
            max-width: 80%;
            background-color: rgb(128,128,128,0.8);
            border-radius: 8px;
            padding: 5px;
            text-align: center;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 999999;
        }

        #viewer-messageBox.show {
            opacity: 1;
        }
        `;
        util.addStyle('viewer-style', 'style', style);

        // 生成阅读器
        Swal.fire({
            title: `<p id="page" style="user-select: none; cursor: pointer;">${nowpic}/${totalpic}</p>`,
            html: dom,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            showCloseButton: true,
            showConfirmButton: false,
            background: "#000000",
            grow: "fullscreen",
            heightAuto: false,
        }).then((res) => {
            document.body.style.height = "";
            document.body.style.overflow = "auto";
            res.isConfirmed;
        });

        // 锁定页面高度
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";

        // 缓存后五张
        cache5Images(nowpic);

        // 检验按钮是否可用
        buttonable()

        // 初始化左右按钮
        initShiftButton();

        // 初始化键盘左右键换页
        initShiftByKeyboard();

        // 初始化选页器
        initSelecter();

        // 初始化图片拖拽和滚轮放大缩小功能
        initPicFunction();
    });

    // 去除广告
    window.addEventListener('DOMContentLoaded', function () {
        var iframes = document.getElementsByTagName('iframe');

        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            iframe.style.display = "none";
            iframe.style.visibility = "none";
            iframe.remove();
        }
    });

    // 加载完后再移除一次广告
    window.onload = function () {
        var iframes = document.getElementsByTagName('iframe');

        for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            if (iframe.src != "https://ys.mihoyo.com/") {
                iframe.style.display = "none";
                iframe.style.visibility = "none";
            }
        }
    }
})();