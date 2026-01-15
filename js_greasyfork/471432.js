// ==UserScript==
// @name         手机助手
// @namespace    http://tampermonkey.net/
// @version      10.0.0.96
// @description  自动滚动，嗅探图片、视频，字体放大，去除广告浮动
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant    GM_registerMenuCommand
// @grant    GM_setValue
// @grant    GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471432/%E6%89%8B%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471432/%E6%89%8B%E6%9C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

{
    'use strict';

    const hengPin = screen.orientation.lock;
    (function() {
        const isInIframe = () => {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        };
        if (document.querySelector('.JqMA-btn-all')) return;
        if (isInIframe()) {
            let lastIframeCache;
            const getSrc = el => el.currentSrc || el.src || el.getAttribute('src');

            function getIframe() {
                let _lastIframe = GM_getValue("iframeHtml", {});
                const videos = [],
                    posters = [];
                document.querySelectorAll('video').forEach(v => {
                    const src = getSrc(v);
                    if (src) videos.push(src);
                    if (v.poster) posters.push(v.poster);
                    v.querySelectorAll('source').forEach(s => {
                        const src = getSrc(s);
                        if (src) videos.push(src);
                    });
                });
                const nowIframe = {
                    html: document.documentElement.outerHTML,
                    entries: performance.getEntries().map(e => e.name),
                    videos,
                    imgs: Array.from(document.querySelectorAll('img')).map(getSrc).filter(Boolean),
                    posters
                };
                if (JSON.stringify(nowIframe) !== lastIframeCache) {
                    _lastIframe[location.href] = nowIframe;
                    GM_setValue("iframeHtml", _lastIframe);
                    lastIframeCache = JSON.stringify(nowIframe);
                }
            }
            setInterval(getIframe, 2000, 700);
            return;
        }
        GM_setValue("iframeHtml", {});

        const currentDomain = location.hostname;

        const docSltAll = selector => {
            const doms = [...document.querySelectorAll(selector)];

            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    doms.push(...doc.querySelectorAll(selector));
                } catch (e) {
                    console.debug('Cross-origin iframe blocked:', e);
                }
            });
            return doms;
        };
        const simulateClick = element => {
            try {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                });
                element.dispatchEvent(event);
            } catch (error) {
                element.click();
            }
        };
        const createElement = (tagName, attributes = null, content = null) => {
            const element = document.createElement(tagName);

            attributes && Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            if (content !== null) {
                element.textContent = content;
            }
            return element;
        };

        function getDataValue(gValName, _default) {
            const _data = GM_getValue(gValName, {});
            const keys = Object.keys(_data);
            if (keys.length > 50) {
                delete _data[keys[0]];
                GM_setValue(gValName, _data);
            }
            return [_data, _data[currentDomain] !== undefined ? _data[currentDomain] : _default];
        }

        let [txtToCData, txtToC] = getDataValue("txtToCData", "");

        let [cssToCData, cssToC] = getDataValue("cssToCData", "");

        let [clickNumData, clickNum] = getDataValue("clickNumData", 1);

        let [scriptEnabledData, scriptEnabled] = getDataValue('scriptEnabledData', true);

        const scalable = ",user-scalable=1,maximum-scale=10.0";

        function autoChangeScale() {

            if (!scriptEnabled) return;

            const metaNode = document.querySelector('meta[name=viewport]');
            if (!metaNode) return;

            const metaContent = metaNode.getAttribute('content');

            if (!metaContent.includes(scalable)) {

                metaNode.setAttribute('content', (metaContent + scalable).replace(/, ?,/, ","));
            }
        }

        let clickNextTime = GM_getValue("clickNextTime", new Date().getTime() - 2000);

        let cleanLocation = location.href.split('#')[0];

        function clickElsByTextSel(_tToC, _cToC) {

            if (new Date().getTime() - clickNextTime >= 2000) {
                if (_tToC.length) {
                    const regex = new RegExp('^\s*(' + _tToC + ')');
                    const elements = document.body.getElementsByTagName('*');
                    for (let j = 0; j < elements.length; j++) {
                        const element = elements[j];
                        if (regex.test(element.textContent)) {
                            for (let k = 0; k < clickNum; k++) {
                                simulateClick(element);
                            }
                        }
                    }
                }
                if (_cToC.length) {
                    const elements = document.querySelectorAll(_cToC);
                    for (let j = 0; j < elements.length; j++) {
                        const element = elements[j];
                        for (let k = 0; k < clickNum; k++) {
                            simulateClick(element);
                        }
                    }
                }
                GM_setValue("clickNextTime", new Date().getTime());
            }
        }

        function removeShadowRoot() {
            let hasShadowRoot = false;
            for (const div of document.querySelectorAll('div')) {
                if (div.shadowRoot) {
                    div.replaceWith(...div.shadowRoot.childNodes);
                    hasShadowRoot = true;
                }
            }
            alert(`#shadow-root ${hasShadowRoot ? '已移除' : '不存在'}`); // 模板字符串优化
        }

        function checkImgExists(imgurl, timeout = 8000) {
            return new Promise(function(resolve, reject) {
                const img = new Image();
                let resolved = false;

                const cleanup = () => {
                    img.onload = null;
                    img.onerror = null;
                    if (timer) clearTimeout(timer);
                };
                const timer = setTimeout(() => {
                    if (resolved) return;
                    resolved = true;
                    cleanup();
                    reject(new Error('Image load timeout'));
                }, timeout);
                img.onload = function() {
                    if (resolved) return;
                    resolved = true;
                    cleanup();
                    resolve(this);
                };
                img.onerror = function(err) {
                    if (resolved) return;
                    resolved = true;
                    cleanup();
                    reject(err);
                };
                img.src = imgurl;
            });
        }

        function getTouchSite(_element, event) {
            const rect = _element.getBoundingClientRect();
            const touch = event.touches[0];

            const offsetY = touch.clientY - rect.top - _element.offsetHeight / 2;
            const offsetX = touch.clientX - rect.left - _element.offsetHeight / 2;

            return [offsetX, offsetY, _element.offsetHeight];
        }

        function getSelector(element, maxIndex = 3) {
            const pathParts = [];
            let currentElement = element;
            let index = 0;
            while (index < maxIndex && currentElement && currentElement.nodeType == Node.ELEMENT_NODE) {
                let selector = currentElement.nodeName.toLowerCase();
                if (selector == "body") break;

                const id = currentElement.id;
                if (id) {
                    selector += `#${id}`;
                } else if (currentElement.classList.length > 0) {
                    let classPart = '';
                    for (let i = 0; i < 2 && i < currentElement.classList.length; i++) {
                        classPart += '.' + currentElement.classList[i];
                    }
                    if (classPart) selector += classPart;
                }
                pathParts.unshift(selector);
                currentElement = currentElement.parentNode;
                index++;
            }
            return pathParts.join(' > ');
        }

        let addCss = GM_getValue("addCss", "");

        let hidePagetual = GM_getValue("hidePagetual", 0)

        let [DtransformData, Dtransform] = getDataValue("DtransformData", 0);

        let [nextpageData, nextpage] = getDataValue("nextpageData", 1);

        let btnPosition = GM_getValue("btnPosition", 1);

        GM_registerMenuCommand("显示菜单", function() {

            let inputNum = window.prompt(`1、显隐按钮 2、${hidePagetual ? "显" : "隐"} 东方组件
3、${Dtransform?"关":"开"} 去浮动 4、${nextpage?"关":"开"} 点击翻页
5、按钮位置 6、添加css ${addCss}
7、${scriptEnabled ? '禁' : '启'} 双指缩放 8、加载时模拟点击 ${clickNum}次 ${txtToC} ${cssToC}`, 1);
            if (inputNum === "1") {
                const element = document.querySelector(".JqMA-btn-del");
                const isHide = window.getComputedStyle(element).display === "none";
                if (isHide) {
                    document.head.removeChild(hideAllBtn);
                } else {
                    document.head.appendChild(hideAllBtn);
                }
            } else if (inputNum === "2") {
                hidePagetual = hidePagetual ? 0 : 1;
                GM_setValue("hidePagetual", hidePagetual);
                location.reload(false);
            } else if (inputNum === "3") {
                btnTransfClick();
            } else if (inputNum === "4") {
                if (nextpage) {
                    nextpage = 0;
                    nextpageData[currentDomain] = nextpage;
                } else {
                    nextpage = 1;
                    delete nextpageData[currentDomain];
                }
                GM_setValue("nextpageData", nextpageData);
            } else if (inputNum === "5") {
                btnPosition = btnPosition ? 0 : 1;
                GM_setValue("btnPosition", btnPosition);
                location.reload(false);
            } else if (inputNum === "6") {
                inputNum = window.prompt("输入css内容：", addCss);
                if (inputNum !== null) {
                    GM_setValue("addCss", inputNum);
                    location.reload(false);
                }
            } else if (inputNum === "7") {
                scriptEnabled = !scriptEnabled;
                scriptEnabledData[currentDomain] = scriptEnabled;

                GM_setValue('scriptEnabledData', scriptEnabledData);

                scriptEnabled ? autoChangeScale() : location.reload();
            } else if (inputNum === "8") {
                const _menu = prompt(`1、输入起始文本 ${txtToC}\n2、输入css选择器 ${cssToC}\n3、点击次数 ${clickNum}次`, 1);
                if (_menu == "1") {
                    const _prot = prompt('加载点击 输入起始文本 分隔|（正则特殊字符转义）', txtToC);
                    if (_prot === "") {
                        txtToC = "";
                        delete txtToCData[currentDomain];
                    } else if (_prot !== null) {
                        txtToC = _prot;
                        txtToCData[currentDomain] = _prot;
                    }
                    GM_setValue("txtToCData", txtToCData);
                } else if (_menu == "2") {
                    const _prot = prompt('加载点击 输入css选择器 分隔 ,(半角)', cssToC);
                    if (_prot === "") {
                        cssToC = "";
                        delete cssToCData[currentDomain];
                    } else if (_prot !== null) {
                        cssToC = _prot;
                        cssToCData[currentDomain] = _prot;
                    }
                    GM_setValue("cssToCData", cssToCData);
                } else if (_menu == "3") {
                    const _prot = prompt('页面加载点击 输入点击次数', clickNum);
                    if (_prot === "") {
                        clickNum = 1;
                        delete clickNumData[currentDomain];
                    } else if (_prot !== null) {
                        clickNum = Number(_prot);
                        clickNumData[currentDomain] = _prot;
                    }
                    GM_setValue("clickNumData", clickNumData);
                }
            }
        });

        function changeDataFunc(_data, _default) {
            let changeData = window.prompt("请修改：", JSON.stringify(_data));
            if (typeof JSON.parse(changeData) == "object") {
                changeData && alert(changeData);
                changeData = JSON.parse(changeData)
                return [changeData, changeData.hasOwnProperty(currentDomain) ? changeData[currentDomain] : _default]
            } else {
                return false;
            }
        }

        const html_style = `
body{
min-height:100vh!important;
min-height:100dvh!important;
}${nextpage?"html{scroll-behavior:auto!important;}":""}`;
        let inner_style = `
.JqMA-btn-all,
.JqMA-inner-all,
.JqMA-inner-pic *{
min-width:none!important;
max-width:none!important;
min-height:none!important;
max-height:none!important;
}.JqMA-inner-all{
position:relative!important;
z-index:2147483646!important;
margin:15vh 0 5vh 0!important;
border:0!important;
padding:0!important;
width:100vw!important;
height:auto!important;
background:black!important;
display:block!important;
}.JqMA-inner-all,
.JqMA-inner-word *,
.JqMA-inner-pic *{
box-sizing:border-box!important;
border-radius:0!important;
float:none!important;
opacity:1!important;
visibility:visible!important;
filter:none!important;
-webkit-filter:none!important;
}.JqMA-inner-word,
.JqMA-inner-word>p{
color:#FEFEFE!important;
text-align:left!important;
font-size:calc(2.3vh + 2.3vw)!important;
text-indent:0!important;
}.JqMA-inner-word>p{
width:100%!important;
}.JqMA-inner-pic{
text-align:center!important;
font:0 "Fira Sans", sans-serif!important;
}.JqMA-inner-word *,
.JqMA-inner-pic *{
margin:0!important;
padding:0!important;
border:0!important;
position:static!important;
}.JqMA-inner-pic *::before,
.JqMA-inner-pic *::after{
display:none!important;
}.JqMA-inner-pic>img{
display:inline-block!important;
width:auto!important;
min-width:12.5%!important;
max-width:100%!important;
height:auto!important;
min-height:calc(3.5vh + 3.5vw)!important;
object-fit:contain!important;
background:gray!important;
}.JqMA-inner-pic>img.JqMA-css-smallPic{
max-width:33.3%!important;
max-height:calc(10vh + 10vw)!important;
}.JqMA-inner-pic>*{
vertical-align:top!important;
overflow:hidden!important;
}.JqMA-inner-word a,
.JqMA-inner-pic a,
.JqMA-mark-pageNum{
background:none!important;
color:#FEFEFE!important;
height:calc(2.7vh + 2.7vw)!important;
font-size:calc(1.6vh + 1.6vw)!important;
line-height:1.7!important;
text-align:center!important;
white-space:normal!important;
}.JqMA-mark-pageNum{
width:100%!important;
}.JqMA-inner-word>a{
display:inline-block!important;
width:100%!important;
}.JqMA-inner-pic>a{
display:inline-block!important;
width:12.5%!important;
margin-left:-12.5%!important;
height:calc(3.5vh + 3.5vw)!important;
background:rgba(0,0,0,.2)!important;
line-height:1.1!important;
}.JqMA-inner-pic>p>a{
display:inline!important;
}.JqMA-btn-all{
overflow:hidden!important;
opacity:1!important;
background:rgba(0,0,0,.4)!important;
color:#FEFEFE!important;
display:none!important;
text-align:center!important;
text-indent:0!important;
line-height:2.8!important;
border-radius:0!important;
user-select:none!important;
z-index:999999999999!important;
margin:0!important;
padding:0!important;
border:0!important;
font-weight:bold!important;
position:fixed!important;
font-size:calc(1.2vh + 1.2vw)!important;
height:calc(3.2vh + 3.2vw)!important;
width:calc(3.2vh + 3.2vw)!important;
}html .JqMA-btn-del{
display:block!important;
opacity:.4!important;
}.JqMA-mark-pageNext:not(.JqMA-mark-pageNum){
display:inline-block!important;
height:0!important;
min-height:none!important;
margin:0!important;
border:0!important;
padding:0!important;
overflow:hidden!important;
}.JqMA-inner-word,.JqMA-inner-word>p{
letter-spacing:normal!important;
line-height:normal!important;
white-space:pre-line!important;
overflow-x:hidden!important;
text-indent:0!important;
}` + addCss;

        if (hidePagetual) {
            inner_style += `
.pagetual_pageBar,#pagetual-sideController{
display:inline-block!important;
height:0!important;
min-height:none!important;
margin:0!important;
border:0!important;
padding:0!important;
overflow:hidden!important;}`;
        }

        function getValLoc(gValName, _default) {
            if (currentDomain == GM_getValue(gValName + "_locH")) {
                return GM_getValue(gValName, _default);
            } else {
                return _default;
            }
        }

        function setValLoc(gValName, value) {
            GM_setValue(gValName, value);
            GM_setValue(gValName + "_locH", currentDomain);
        }

        let scrollJu = Math.abs(GM_getValue("scrollJu", 5));

        let defDSI = GM_getValue("defDSI", "12");

        let [DSImgData, DSImg] = getDataValue("DSImgData", defDSI);

        let minPicHD = GM_getValue("minPicHD", 500);

        let minPicwh = GM_getValue("minPicwh", 100),
            picwh = getValLoc("picwh", minPicwh);

        let minOuterSz = GM_getValue("minOuterSz", 10),
            outerSz = getValLoc("outerSz", minOuterSz);

        let [backcolordata, backcolor] = getDataValue("backcolordata", 0);

        let direction = 1;

        function addInput(class1, value1, style1) {

            document.documentElement.appendChild(createElement('p', {
                class: "JqMA-btn-all " + class1
            }, value1));

            inner_style += `.JqMA-btn-all.${class1} {${style1}!important;${btnPosition ? "left" : "right"}:0!important;}`;
        }

        function addAllBtn() {

            addInput('JqMA-btn-del', 'X', "top:calc(50vh - 1.6vh - 1.6vw)");
            addInput('JqMA-btn-down', '♢', "top:calc(50vh - 4.8vh - 4.8vw)");
            addInput('JqMA-btn-Ju', scrollJu, "top:calc(50vh - 8vh - 8vw)");
            addInput('JqMA-btn-width', widthN ? (backcolor ? "#" : "") + widthN : "W", "top:calc(50vh - 11.2vh - 11.2vw)");
            addInput('JqMA-btn-scrollDiv', 'O', "top:calc(50vh - 14.4vh - 14.4vw)");

            addInput('JqMA-btn-transform', "T", "top:calc(50vh + 1.6vh + 1.6vw)");
            addInput('JqMA-btn-blank ', 'B', "top:calc(50vh + 4.8vh + 4.8vw)");
            addInput('JqMA-btn-pic', picwh, "top:calc(50vh + 8vh + 8vw)");
            addInput('JqMA-btn-outerSz', outerSz, "top:calc(50vh + 11.2vh + 11.2vw)");

            document.head.appendChild(createElement('style', null, html_style + inner_style));

            openBlk && document.querySelector(".JqMA-btn-blank").style.setProperty("color", "green", "important");

            Dtransform && document.querySelector(".JqMA-btn-transform").style.setProperty("color", "green", "important");

            picZ && document.querySelector(".JqMA-btn-pic").style.setProperty("color", "green", "important");

            Drotate && document.querySelector(".JqMA-btn-scrollDiv").style.setProperty("color", "green", "important");

            delHide();
        }

        let Dhide = getValLoc("Dhide", 1);

        const publicStyle = createElement("style");

        setTimeout(function() {

            Dtransform && applyClear();

            clickElsByTextSel(txtToC, cssToC);

            firstRun();

            autoChangeScale();

            document.addEventListener('touchstart', (e) => {
                e.touches.length > 1 && autoChangeScale();
            });
            document.addEventListener('touchend', function handler(event) {
                Dscroll && (Dscroll = 0, scrollRun());
                event.currentTarget.removeEventListener(event.type, handler);
            });
            document.head.appendChild(publicStyle);
        }, 800);

        let _lastTouchTime = 0;

        function touchRun() {
            if (Date.now() - _lastTouchTime > 3000) {
                firstRun();
                _lastTouchTime = Date.now();
            }
        }

        function htmlTouch(event) {

            if (Dscroll && !pauseScroll) {
                const _target = event.target;

                if (!_target.matches(".JqMA-btn-Ju")) {

                    scrollRun();

                    if (!_target.matches(".JqMA-btn-down")) {

                        pauseScroll = true;
                    }
                }
            }
        }

        let oNextScroll;

        function firstRun() {
            if (!document.querySelector('.JqMA-btn-all')) {
                addAllBtn();
            }
            Drotate && fullScreen();

            (widthN || backcolor) && fontInterFn();

            if (picZ) imgInterFn();

            openBlk && aOpenBlank();

            !Dhide && xiuTan();

            document.querySelector(".JqMA-inner-word") && innerWordAdd();

            if (!oNextScroll && nextScrollTop) {
                const element = visibleDiv([9, -9]);
                if (element) {
                    autoScrollBy(element, nextScrollTop, "to");
                    oNextScroll = 1;
                }
            }
            docSltAll("html:not([JqMA-mark-htmlFunc])").forEach(function(elet) {

                elet.setAttribute('JqMA-mark-htmlFunc', true);

                elet.addEventListener('click', function(event) {

                    const _target = event.target;

                    if (_target.matches("#JqMA-mark-lastOne")) {

                        pageX.unshift(visibleDiv([9, -9]).scrollTop);
                        const lastOne = document.querySelector(".JqMA-inner-pic>:last-child");
                        lastOne.scrollIntoView({
                            behavior: 'auto',
                            block: 'start'
                        });
                        setTimeout(() => autoScrollBy(visibleDiv([9]), lastOne.offsetHeight), 310);

                    } else if (_target.matches("#JqMA-mark-pageNext_1,#JqMA-mark-pageNext_2")) {

                        pageX.unshift(visibleDiv([9, -9]).scrollTop);
                        document.querySelector("." + _target.id).scrollIntoView({
                            behavior: 'auto',
                            block: 'start'
                        });
                    } else if (_target.matches("a,a *")) {
                        setTimeout(function() {
                            if (Dscroll) {
                                scrollRun();
                                pauseScroll = true;
                            }
                        }, 210);
                    } else if (
                        nextpage &&
                        !this.matches("html *") &&
                        _target.matches("picture,img,.JqMA-inner-pic") &&
                        _target.offsetWidth > .45 * window.innerWidth
                    ) {
                        direction = event.clientY < window.innerHeight * .15 ? -1 : 1;

                        autoScrollBy(visibleDiv(direction > 0 ? [9] : [-9], false), direction * .45 * window.innerHeight);
                    }
                    if (nextScrollTop) {
                        autoScrollBy(visibleDiv([9, -9]), nextScrollTop, "to");
                    }
                });
                elet.addEventListener('touchstart', function(event) {
                    htmlTouch(event);
                });
                elet.addEventListener('touchmove', function(event) {
                    htmlTouch(event);
                });
                elet.addEventListener("touchend", function() {
                    touchRun();
                    stopPause();
                });
            });
        }

        let pauseScroll;

        function stopPause() {

            setTimeout(function() {
                if (pauseScroll) {
                    pauseScroll = false;

                    Dscroll || scrollRun();
                }
            }, 200);
        }

        function onLongPress(element, callback, timeout = 600) {
            let timer;
            let touchLen = true;

            element.addEventListener('touchstart', function(event) {
                timer = setTimeout(function() {
                    if (touchLen) {
                        callback(event);
                    }
                }, timeout);

                setTimeout(function() {
                    touchLen = true;
                }, timeout);
            });
            element.addEventListener('touchend', function() {
                clearTimeout(timer);
            });
            element.addEventListener('touchmove', function(event) {
                timer && clearTimeout(timer);
                if (touchLen && event.touches.length > 1) {
                    touchLen = false;
                }
            });
        }

        function onSlideScreen(element, callback, timeout = 600) {
            let timer;

            element.addEventListener('touchmove', function(event) {
                timer && clearTimeout(timer);

                timer = setTimeout(function() {
                    callback(event);
                }, timeout);
            });
        }

        function btnScrollDivClick() {
            let width = prompt("页面宽度：", Drotate_W);
            if (width === null) {
                Drotate = false;
                document.exitFullscreen();
                publicStyle.textContent = publicStyle.textContent.replace(fullBodyText, "");
            } else {
                Drotate_W = Number(width);
                Drotate = true;
                setValLoc("Drotate_W", Drotate_W);
                fullScreen();
            }
            document.querySelector(".JqMA-btn-scrollDiv").style.setProperty("color", Drotate ? "green" : null, "important");

            setValLoc("Drotate", Drotate);
        }

        let pageX = [];

        let [widthNdata, widthN] = getDataValue("widthNdata", 0);

        let [picZData, picZ] = getDataValue("picZData", 0);

        let [openBlkData, openBlk] = getDataValue("openBlkData", 0);

        let preIframes = new Set();

        let Dscroll = getValLoc("Dscroll", 0);
        let timeDown;

        let [textSltData, textSlt] = getDataValue("textSltData", "");
        let [imgSltData, imgSlt] = getDataValue("imgSltData", "");

        let currentStr = 0;

        document.addEventListener('click', function(event) {
            const eventClass = event.target.classList;
            if (eventClass.contains('JqMA-btn-down')) {
                btnDownClick();
            } else if (eventClass.contains('JqMA-btn-scrollDiv')) {
                btnScrollDivClick();
            } else if (eventClass.contains('JqMA-btn-transform')) {
                btnTransfClick();
            } else if (eventClass.contains('JqMA-btn-width')) {
                btnWidthClick();
            } else if (eventClass.contains('JqMA-btn-outerSz')) {
                btnOuterSzClick();
            } else if (eventClass.contains('JqMA-btn-pic')) {
                btnPicClick(event);
            } else if (eventClass.contains('JqMA-btn-del')) {
                btnDelClick();
            } else if (eventClass.contains('JqMA-btn-blank')) {
                btnBlankClick();
            } else if (eventClass.contains('JqMA-btn-Ju')) {
                btnJuClick();
            }
        });

        let hideAllBtn = createElement("style", null, `html .JqMA-btn-all {display:none!important;}`);

        onSlideScreen(document, function(event) {
            const eventClass = event.target.classList;
            if (eventClass.contains('JqMA-btn-Ju')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight) {
                    scrollJu -= 1;
                } else if (offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {
                    scrollJu += 1;
                } else {
                    btnJuClick();
                    return;
                }
                scrollJu = Math.max(scrollJu, 0);

                document.querySelector(".JqMA-btn-Ju").textContent = scrollJu;

                GM_setValue("scrollJu", scrollJu);
            } else if (eventClass.contains('JqMA-btn-blank')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight || offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {

                    document.head.appendChild(hideAllBtn);

                    waitClick(function(event) {

                        const originalTarget = event.target;
                        const isInput = originalTarget.matches("a") || originalTarget.closest("a") ? "a" : "input";
                        const lastTarget = originalTarget.closest(isInput);

                        if (lastTarget) {
                            let allNum = 0;
                            const stopNum = parseInt(prompt("数量", 10)) + 1;

                            const fragment = document.createDocumentFragment();

                            docSltAll(prompt("修改选择器：", getSelector(lastTarget))).forEach(el => {
                                if (el == lastTarget) allNum++;
                                if (!allNum) return;
                                allNum++;
                                if (allNum <= stopNum) {
                                    if (isInput == "input") {
                                        el.checked = !el.checked;
                                    } else if (el.href && !preIframes.has(el.href)) {
                                        preIframes.add(el.href);

                                        const iframe = createElement("iframe", {
                                            src: el.href,
                                            scrolling: "no",
                                            sandbox: 'allow-scripts allow-same-origin',
                                            style: "box-sizing: border-box!important; overflow: hidden!important; width: 100%!important; min-height: 150vh!important;"
                                        });
                                        iframe.onload = () => {
                                            setTimeout(() => {
                                                if (iframe.contentDocument) {
                                                    const clonedBody = document.importNode(iframe.contentDocument.body, true);
                                                    iframe.parentNode.replaceChild(clonedBody, iframe);
                                                }
                                            }, 800);
                                        };
                                        fragment.appendChild(createElement('p', {
                                            class: "pagetual_pageBar"
                                        }));
                                        fragment.appendChild(iframe);
                                    }
                                }
                            });
                            document.body.appendChild(fragment);
                        } else {
                            alert("请点击链接或复选框！");
                        }
                    });
                } else {
                    btnBlankClick();
                }
            } else if (eventClass.contains('JqMA-btn-del')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetX > thisHeight || offsetY > thisHeight || offsetY < -thisHeight || offsetX < -thisHeight) {
                    return;
                } else {
                    btnDelClick();
                }
            } else if (eventClass.contains('JqMA-btn-pic')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight * 3 || offsetY < thisHeight * -3 || offsetX > thisHeight * 3 || offsetX < thisHeight * -3) {
                    btnPicwhClick();
                } else if (offsetY > thisHeight) {
                    if (minPicwh < picwh && picwh < minPicwh + 100) {
                        picwh = minPicwh;
                    } else if (picwh <= minPicwh) {
                        picwh = 0
                    } else {
                        picwh -= 100;
                    }
                    picImgFilter();
                } else if (offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {
                    if (picwh == 0) {
                        picwh = minPicwh;
                    } else {
                        picwh += 100;
                    }
                    picImgFilter();
                } else {
                    btnPicClick(event);
                }
            } else if (eventClass.contains('JqMA-btn-outerSz')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight * 3 || offsetY < thisHeight * -3 || offsetX > thisHeight * 3 || offsetX < thisHeight * -3) {

                    scrollPicLoad();

                } else if (offsetY > thisHeight) {

                    if (minOuterSz < outerSz && outerSz < minOuterSz + 10) {
                        outerSz = minOuterSz;
                    } else if (outerSz <= minOuterSz) {
                        outerSz = 0;
                    } else {
                        outerSz -= 10;
                    }
                } else if (offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {
                    if (outerSz === 0) {
                        outerSz = minOuterSz;
                    } else {
                        outerSz += 10;
                    }
                } else {
                    btnOuterSzClick();
                }
                outerSz_run();
            } else if (eventClass.contains('JqMA-btn-width')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > 3 * thisHeight || offsetY < -3 * thisHeight || offsetX > 3 * thisHeight || offsetX < thisHeight * -3) {
                    if (!document.querySelector(".JqMA-inner-word") && textSlt.length) {
                        event.target.style.setProperty("color", "green", "important");
                        appendWord();
                    }
                    setTimeout(function() {
                        readPause();
                    }, 500);
                    return;
                } else if (offsetY > thisHeight) {
                    widthN -= 1;
                } else if (offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {
                    widthN += 1;
                } else {
                    btnWidthClick();
                    return;
                }
                widthNFunc();
            } else if (eventClass.contains('JqMA-btn-transform')) {

                btnTransfClick();
            } else if (eventClass.contains('JqMA-btn-scrollDiv')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight || offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {
                    removeShadowRoot();
                } else {
                    btnScrollDivClick();
                }
            } else if (eventClass.contains('JqMA-btn-down')) {

                let [offsetX, offsetY, thisHeight] = getTouchSite(event.target, event);

                if (offsetY > thisHeight * 3) {
                    const visDiv = visibleDiv([9, -9]);

                    pageX.unshift(visDiv.scrollTop);

                    autoScrollBy(visDiv, 0, "to");

                    document.querySelector(".JqMA-btn-down").textContent = "♢";

                } else if (offsetY < thisHeight * -3 || offsetX > thisHeight * 3 || offsetX < thisHeight * -3) {
                    const visDiv = visibleDiv([9, -9]);

                    pageX.unshift(visDiv.scrollTop);

                    autoScrollBy(visDiv, visDiv.scrollHeight, "to");

                    document.querySelector(".JqMA-btn-down").textContent = "♢";

                } else if (offsetY > thisHeight) {

                    pageNextFunc("up");

                } else if (offsetY < -thisHeight || offsetX > thisHeight || offsetX < -thisHeight) {

                    pageNextFunc("down");
                } else {
                    btnDownClick();
                }
            }
        });

        onLongPress(document, function(event) {
            const eventClass = event.target.classList;
            if (eventClass.contains('JqMA-btn-Ju')) {

                let inputNum = window.prompt("请输入滚动速度：" + scrollJu, 5);

                if (Number(inputNum.replace("`", ""))) {

                    scrollJu = Number(inputNum.replace("`", ""));

                    scrollJu = Math.max(scrollJu, 0);

                    document.querySelector(".JqMA-btn-Ju").textContent = scrollJu;

                    GM_setValue("scrollJu", scrollJu);
                }
            } else if (eventClass.contains('JqMA-btn-del')) {

                let newHref = [];
                let hrefSplit = location.href.split(/(?<=[^a-z]page)([=/])(?=\d)/);
                hrefSplit.length > 1 && newHref.push(getNextPage(hrefSplit));

                hrefSplit = location.href.split(/([^\d])(?=\d+(?:\.html|\/)?$)/);
                hrefSplit.length > 1 && newHref.push(getNextPage(hrefSplit));

                hrefSplit = location.href.split(/([/_\-])(?=\d+\/\?)/);
                hrefSplit.length > 1 && newHref.push(getNextPage(hrefSplit));

                !newHref.length && newHref.push(location.href.replace(/\/?$/i, "/2/"));

                let pageEnter, twoHref;
                const maoHref = location.href.replace(/\/?#?$/i, "/#");
                const allA = docSltAll("a").reverse();

                for (const _this of allA) {
                    if (!twoHref && /^\s*0?2\s*$/.test(_this.textContent)) {

                        twoHref = _this.href;
                        break;
                    } else if (/^\s*(?:(?:>|次のページ|下.?[章页頁]|下[一—].)\s*$|下[一—].[:：]|next\s*(page\s*)?$)/i.test(_this.textContent)) {

                        pageEnter = true;
                        if (_this.href && _this.href != location.href && _this.href != maoHref) {
                            openHref(_this.href);
                        } else {
                            simulateClick(_this);
                        }
                        break;
                    } else if (newHref.includes(_this.href)) {

                        pageEnter = true;
                        openHref(_this.href);
                        break;
                    }
                }!pageEnter && twoHref && openHref(twoHref);

            } else if (eventClass.contains('JqMA-btn-outerSz')) {

                const menuNum = prompt(`图片集功能：1、可见 2、深度 3、所有\n123（全部）\n@（修改默认 ${defDSI}）`, DSImg);
                if (menuNum == "@") {
                    const promptNum = prompt("默认开启：1、可见 2、深度 3、所有", defDSI);
                    if (promptNum && promptNum != defDSI) {
                        defDSI = promptNum;
                        GM_setValue("defDSI", defDSI);
                    }
                } else if (menuNum && DSImg != menuNum) {
                    DSImg = menuNum;
                    if (picZ) {
                        const visDiv = visibleDiv([9, -9]);
                        const _scrollTop = visDiv.scrollTop;

                        removePicClass();
                        imgInterFn();

                        setTimeout(() => autoScrollBy(visDiv, _scrollTop, "to"), 400);
                    }
                }
                if (DSImg == defDSI) {
                    delete DSImgData[currentDomain];
                } else {
                    DSImgData[currentDomain] = DSImg;
                }
                GM_setValue("DSImgData", DSImgData);
            } else if (eventClass.contains('JqMA-btn-pic')) {

                let inputNum = window.prompt("请输入图片链接替换（`分隔，@开头：正则且数字->[0-9]）：", picReplace);
                if (inputNum == "所有域名") {
                    let resultData = changeDataFunc(picRepData, "");
                    if (resultData)[picRepData, picReplace] = resultData;
                } else if (typeof inputNum === "string") {
                    picReplace = inputNum;
                    if (picReplace === "") {
                        delete picRepData[currentDomain];
                    } else {
                        picRepData[currentDomain] = picReplace;
                        if (picZ) {
                            const visDiv = visibleDiv([9, -9]);
                            const _scrollTop = visDiv.scrollTop;

                            removePicClass();
                            imgInterFn();

                            setTimeout(() => autoScrollBy(visDiv, _scrollTop, "to"), 400);
                        }
                    }
                }
                GM_setValue("picRepData", picRepData);
            } else if (eventClass.contains('JqMA-btn-width')) {

                const innerWord = document.querySelector(".JqMA-inner-word");
                const btn = event.target;
                if (innerWord) {
                    innerWord.remove();

                    docSltAll("[JqMA-mark-word]").forEach(function(element) {
                        element.removeAttribute("JqMA-mark-word");
                    });
                } else {
                    btn.style.setProperty("color", "green", "important");
                    if (textSlt.length) {
                        appendWord();
                        return;
                    }
                }
                waitClick(function(event) {
                    const textLen = Number(prompt("最小文字长度：", 5));
                    let _target = event.target;

                    while (_target && _target !== document.body) {
                        if (getText(_target).replace(/\s+/g, "").length > textLen) break;
                        _target = _target.parentNode;
                    }
                    const selector = getSelector(_target);

                    const inputNum = window.prompt(`修改选择器：${selector}`, textSlt.length ? textSlt : selector);
                    if (inputNum == "所有域名") {
                        const resultData = changeDataFunc(textSltData, "");
                        if (resultData)[textSltData, textSlt] = resultData;
                    } else if (typeof inputNum === "string") {
                        textSlt = inputNum;
                        if (textSlt === "") {
                            delete textSltData[currentDomain];
                        } else {
                            textSltData[currentDomain] = textSlt;
                        }
                    } else if (inputNum === null) {
                        btn.style.setProperty("color", "white", "important");
                        return;
                    }
                    GM_setValue("textSltData", textSltData);

                    appendWord();
                });
            } else if (eventClass.contains('JqMA-btn-down')) {

                let menuNum = window.prompt(`1：跳转节点 2：保存位置 ${nextScrollTop}`, 1);
                if (menuNum === "1") {
                    let inputNum = window.prompt("跳转第几个节点：");
                    if (Number(inputNum) || inputNum === "0") {
                        let nextNum = Number(inputNum);
                        pageNextFunc(nextNum);
                    }
                } else if (menuNum === "2") {
                    let inputNum = window.prompt(`是否保存滚动位置？（取消关闭）${nextScrollTop}`, parseInt(visibleDiv([9, -9]).scrollTop));
                    if (inputNum === null) {
                        nextScrollTop = 0;
                    } else {
                        nextScrollTop = Number(inputNum)
                    }
                    setValLoc("nextScrollTop", nextScrollTop);
                }
            } else if (eventClass.contains('JqMA-btn-scrollDiv')) {
                location.reload();
            } else if (eventClass.contains('JqMA-btn-transform')) {

                alert(`O：
==点击：横屏全屏
==滑动：移除#shadow-root
==长按：刷新页面
W：
==点击：输入字体大小
==短滑：上/下 加/减
==长滑：开启文字集
==长按：朗读文字集
5：
==点击：启/停 滚动
==滑动：上/下 加/减
==长按：输入滚动速度
♢：
==点击：回上一位置
==短滑：上/下 下/上一节点
==长滑：上/下 到底/顶部
==长按：跳转节点/保存滚动位置
X：
==点击：显/隐 其他按钮
==长按：自动点击下一页
T：
==点击：元素取消浮动
==长按：显示操作清单
B：
==点击：切换a链接 新页面打开
==滑动：点击2个a链接，加载页面
100：
==点击：开关图片集
==短滑：上/下 加/减
==长滑：修改过滤尺寸
==长按：输入图片链接替换规则
10：
==点击：点击元素，修改过滤尺寸
==短滑：上/下 加/减
==长滑：滚动加载图片集
==长按：修改图片搜索`);
            }
        });

        function btnDownClick() {

            if (pageX.length) {
                pageX = Array.from(new Set(pageX));

                if (typeof pageX[0] === "number") {
                    autoScrollBy(visibleDiv([9, -9]), pageX[0], "to");
                } else {
                    pageX[0].scrollIntoView({
                        block: "center",
                        behavior: 'auto'
                    });
                }
                pageX.splice(0, 1);

                document.querySelector(".JqMA-btn-down").textContent = "♢";
            }
        }

        function pageNextFunc(nextNum) {

            pageX.unshift(visibleDiv([9, -9]).scrollTop);

            let pageDom = Array.from(document.querySelectorAll(".pagetual_pageBar,.JqMA-mark-pageNext,.JqMA-inner-all>:last-child,.JqMA-inner-word>p[style*=green],video"));

            if (Number(nextNum) && nextNum >= pageDom.length) {

                pageDom.pop().scrollIntoView({
                    behavior: 'auto',
                    block: 'start'
                });
                document.querySelector(".JqMA-btn-down").textContent = pageDom.length - 1;
                return;
            }
            if (nextNum == "up") pageDom.reverse();

            let index = 0;
            for (const dom of pageDom) {
                index++;
                const offsetD = dom.getBoundingClientRect().top;

                if (nextNum == index || (nextNum == "up" && offsetD < -.25 * window.innerHeight) ||
                    (nextNum == "down" && offsetD > .25 * window.innerHeight)) {

                    dom.scrollIntoView({
                        behavior: 'auto',
                        block: 'start'
                    });
                    document.querySelector(".JqMA-btn-down").textContent = nextNum == "up" ? pageDom.length - index - 1 : index;
                    break;
                }
            }
        }
        let clearText;

        function applyClear() {

            clearText = `
html{
overflow-y:visible!important;
}body{
transform:translate(0%, 0%)!important;
padding:${Dtransform}vh 0!important;
height:auto!important;
max-height:none!important;
}[JqMA-css-fixed_hide]{
opacity:.2!important;
}`;
            publicStyle.textContent += clearText;

            setTimeout(function() {
                for (const _this of document.querySelectorAll(':not(.JqMA-btn-all)')) {

                    const style = window.getComputedStyle(_this);

                    if (/sticky|fixed/.test(style.position) && _this.offsetHeight < .5 * window.innerHeight) {
                        _this.setAttribute("JqMA-css-fixed_hide", "1");
                    }
                }
            }, 400);
        }

        function btnTransfClick() {
            const _prompt = prompt("请输入上下边距：（取消=关闭）", Dtransform ? Dtransform : "1");
            if (_prompt === null) {
                Dtransform = 0;
            } else {
                Dtransform = _prompt > 0 ? _prompt : 1;
            }
            document.querySelector(".JqMA-btn-transform").style.setProperty("color", Dtransform ? "green" : null, "important");

            if (Dtransform) {
                applyClear();
                DtransformData[currentDomain] = Dtransform;
            } else {
                publicStyle.textContent = publicStyle.textContent.replace(clearText, "");
                delete DtransformData[currentDomain];
            }
            GM_setValue("DtransformData", DtransformData);
        }

        let [picRepData, picReplace] = getDataValue("picRepData", "");

        function visibleDiv(_zfs = [9, -9], _max = true) {

            const threshold = .6 * window.innerHeight;
            let maxOne;

            for (const element of document.querySelectorAll("*")) {
                if (element.offsetHeight < threshold) continue;
                const oldScrollTop = element.scrollTop;
                for (const _zf of _zfs) {
                    element.scrollTop += _zf;
                    if (element.scrollTop == oldScrollTop) continue;
                    element.scrollTop -= _zf;
                    if (!_max) return element;
                    if (!maxOne || element.scrollHeight > maxOne.scrollHeight) maxOne = element;
                }
            }
            return maxOne || document.body;
        }

        function xScrollDiv(_zfs = [9, -9]) {

            const threshold = .6 * window.innerHeight;
            let scrollEles = [];

            for (const element of document.querySelectorAll("*")) {

                if (element.offsetWidth > threshold && window.getComputedStyle(element).overflowX !== "hidden") {
                    const oldScrollLeft = element.scrollLeft;
                    for (const _zf of _zfs) {
                        element.scrollLeft += _zf;
                        if (element.scrollLeft == oldScrollLeft) continue;
                        element.scrollLeft -= _zf;
                        scrollEles.push(element);
                    }
                }
            }
            return scrollEles;
        }

        function autoScrollBy(element, sJu, mood = "by", direction = "scrollTop") {
            if (!element) return;
            if (mood == "by") {
                element[direction] += sJu;
            } else {
                element[direction] = sJu;
            }
        }

        function downloadTxt(filename, textContent) {
            let objectURL = URL.createObjectURL(new Blob([textContent], {
                type: "text/plain;charset=utf-8"
            }));
            let a = createElement('a', {
                href: objectURL,
                download: filename,
                style: "display:none!important;"
            });
            document.body.appendChild(a);
            simulateClick(a);
            document.body.removeChild(a);

            setTimeout(function() {
                URL.revokeObjectURL(objectURL);
            }, 2000);
        }

        function changeStyle(_id, _style) {

            docSltAll("head").forEach(function(elet) {
                let styleElement = elet.querySelector("style#" + _id);
                if (!styleElement) {
                    elet.appendChild(createElement('style', {
                        id: _id
                    }, _style));
                } else {
                    if (styleElement.textContent != _style) {
                        styleElement.textContent = _style;
                    }
                }
            });
        }

        let defWidthN = GM_getValue("defWidthN", 24);

        function fontInterFn() {

            changeStyle("JqMA-css-textBig", (widthN ? `
.JqMA-inner-word>p{
font-size:${widthN}px!important;
}html>body *,html>body [class] *,
html>body [class] [class]{
font-size:${widthN}px!important;
letter-spacing:normal!important;
line-height:normal!important;
}` : "") + (backcolor ? `
html,html>body{
background:#000000!important;
color:#FEFEFE!important;
}html>body :not(a,a *,button,button *),
html>body [class] :not(a,a *,button,button *) {
background:transparent!important;
color:#FEFEFE!important;
}` : ""));
        }

        function btnWidthClick() {

            let inputNum = window.prompt(`请输入字体大小：（@=修改默认，${defWidthN}；#开头=黑色背景）`, widthN ? (backcolor ? "#" : "") + widthN : defWidthN);
            if (inputNum && inputNum.startsWith("#")) {
                backcolor = 1;
                backcolordata[currentDomain] = backcolor;
                inputNum = inputNum.replace("#", "");
            } else {
                backcolor = 0;
                delete backcolordata[currentDomain];
            }
            GM_setValue("backcolordata", backcolordata);

            if (inputNum === "@") {
                inputNum = window.prompt("请修改默认字体大小：", defWidthN);
                defWidthN = Number(inputNum) ? Number(inputNum) : 24;
                GM_setValue("defWidthN", defWidthN);
                return;
            }
            widthN = Number(inputNum) ? Number(inputNum) : 0;

            widthNFunc();
        }

        function widthNFunc() {
            if (widthN > 0) {
                widthNdata[currentDomain] = widthN;
            } else {
                delete widthNdata[currentDomain];
                widthN = 0;
            }
            fontInterFn();
            document.querySelector(".JqMA-btn-width").textContent = widthN ? (backcolor ? "#" : "") + widthN : "W";

            GM_setValue("widthNdata", widthNdata);
        }

        let speakRate = GM_getValue("speakRate", 1);

        function readStr() {
            const synth = window.speechSynthesis;
            synth.cancel();

            const speakNext = (index) => {

                const wordParagraphs = document.querySelectorAll(".JqMA-inner-word > p");

                if (index >= wordParagraphs.length) return;

                const paragraph = wordParagraphs[index];
                const utterThis = new SpeechSynthesisUtterance(getText(paragraph));
                utterThis.rate = speakRate;

                utterThis.onstart = () => {
                    currentStr = index;

                    wordParagraphs.forEach(p => p.removeAttribute('style'));

                    paragraph.style.cssText = "color:green!important;";

                    innerWordAdd();

                    if (index > wordParagraphs.length - 4) {
                        const visDiv = visibleDiv([9]);
                        pageX.unshift(visDiv.scrollTop);

                        let maxOne;
                        for (const dom of visDiv.querySelectorAll(":not(.JqMA-inner-all)")) {
                            if (!maxOne || dom.offsetHeight > maxOne.offsetHeight) {
                                maxOne = dom;
                            }
                        }
                        maxOne.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end'
                        });
                    }
                };
                utterThis.onend = () => {
                    speakNext(index + 1);
                };
                synth.speak(utterThis);
            };

            speakNext(currentStr);
        }

        function getText(element) {
            if (!(element instanceof Element)) {
                return '';
            }
            let result = '';
            for (const node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    result += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName.toLowerCase() === 'br') {
                        result += '\n　';
                    } else {
                        result += getText(node);
                    }
                }
            }
            return result;
        }

        function readPause() {
            try {
                new SpeechSynthesisUtterance();
            } catch (e) {
                alert("浏览器不支持JS朗读！");
                return;
            }
            let readbtn = document.querySelector(".JqMA-inner-word > a:nth-child(2)");
            if (getText(readbtn) == "暂停") {
                readbtn.textContent = "朗读";
                window.speechSynthesis.cancel();
            } else {
                readbtn.textContent = "暂停";
                readStr();
            }
        }

        function innerWordAdd() {
            const textParts = [];

            docSltAll(textSlt).forEach(element => {
                if (!element.hasAttribute('JqMA-mark-word')) {

                    const clonedElement = element.cloneNode(true);

                    clonedElement.querySelectorAll('style, script, noscript').forEach(el => el.remove());

                    textParts.push(getText(clonedElement));

                    element.setAttribute('JqMA-mark-word', true);
                }
            });
            const processedStr = textParts.join('\n\u3000').replace(/(?:\u00A0|&nbsp;|\t)+|<img[^一-龟，。>]*>/g, ' ').replace(/(?:\n\u3000* *)+/g, '\n\u3000');

            const allStrlist = processedStr.split(/([\S\s]{1,120}(?:$|[^[一-龟0-9A-Za-z\/、“「\u3000 ]))/);

            const endElement = document.querySelector('.JqMA-mark-wordEnd');

            const fragment = document.createDocumentFragment();

            allStrlist.forEach(text => {
                text.replace(/\s+/g, '').length && fragment.appendChild(createElement('p', null, text));
            });

            endElement.parentNode.insertBefore(fragment, endElement);
        }

        const htmlVisText = "html {overflow-y: visible!important;}";

        function appendWord() {
            let pOuter = createElement('p', {
                class: "JqMA-inner-word JqMA-inner-all"
            });
            const pInner = createElement('p', {
                class: "JqMA-mark-wordEnd"
            }, "！阅读结束！");

            publicStyle.textContent += htmlVisText;
            pOuter.appendChild(pInner);

            document.documentElement.prepend(pOuter);

            innerWordAdd();

            document.querySelector(".JqMA-inner-word").addEventListener("click", function(event) {
                if (event.target.tagName === "P" && getText(readbtn) != "朗读") {
                    currentStr = 0;
                    let prevElement = event.target.previousElementSibling;
                    while (prevElement) {
                        if (prevElement.tagName === "P") {
                            currentStr++;
                        }
                        prevElement = prevElement.previousElementSibling;
                    }
                    readStr();
                }
            });
            let readbtn = createElement('a', null, '朗读');
            let downbtn = createElement('a', null, '下载');
            let ratebtn = createElement('a', null, `语速：${speakRate}`);

            const wordElement = document.querySelector(".JqMA-inner-word");
            wordElement.insertBefore(downbtn, wordElement.firstChild);
            wordElement.insertBefore(readbtn, wordElement.firstChild);
            wordElement.insertBefore(ratebtn, wordElement.firstChild);

            readbtn.addEventListener("click", readPause);

            ratebtn.addEventListener("click", function() {
                let inputNum = window.prompt("输入语速：", speakRate);
                if (inputNum === null) return;
                speakRate = inputNum;
                this.textContent = "语速：" + speakRate;
                GM_setValue("speakRate", speakRate);
                if (getText(readbtn) == "朗读") return
                readStr();
            });
            downbtn.addEventListener("click", function() {
                let textContent = "";

                document.querySelectorAll(".JqMA-inner-word > p").forEach(function(pDom) {
                    textContent += pDom.textContent;
                });
                downloadTxt(document.title.replace(/[\/:*?""<>|]+/g, " ").replace(/^\s+|\s+$/g, "") + ".txt", textContent);
            });
            autoScrollBy(visibleDiv([9, -9]), 0, "to");
        }

        let whProp = GM_getValue("whProp", 3.9);

        function picSizeOut(_this) {
            const {
                naturalWidth: natureW,
                naturalHeight: natureH
            } = _this;
            const imgOuterWH = _this.getAttribute("img-outerWH") || 100;

            return Math.min(natureW, natureH) >= picwh &&
                natureW / natureH <= whProp && imgOuterWH >= outerSz;
        }

        function formatStr(_url) {
            if (typeof _url === "string") {
                return _url.trim().replace(/&amp;/g, "&").replace(/\\u002F/g, "/").replace(/\\[/]/g, "/");
            } else {
                return "";
            }
        }

        function decodeStr(_url) {
            if (_url.startsWith('http%') || _url.startsWith('https%')) {
                try {
                    return decodeURIComponent(_url);
                } catch (e) {
                    return _url;
                }
            }
            return _url;
        }

        function delHttp(_url) {
            let httpParams = [];
            try {
                new URL(_url).searchParams.forEach((value) => {
                    if (value.startsWith('http')) {
                        httpParams.push(decodeStr(value));
                    }
                });
            } catch (e) {
                return httpParams;
            }
            return httpParams;
        }

        let preMatches = new Set();
        let firstSpan, pAll;
        const QUOTE_REGEX = /&quot;|['']/g;
        const videoRegex = /https?[:%][^"<>\s|]+\.(?:avi|mp4|mov|m4v|m3u8|wmv|flv|f4v)(?:[?!/&%][^"<>\s|]+)?(?=["<>\s一-龟|]|https?[:%]|$)/gi;
        const videoUrlReg = /(\.|%2E)(avi|m3u8|mp4|mov|m4v|wmv|flv|f4v)([?!/&%#]|$)/i;

        function xiuTan() {
            if (!document.querySelector(".JqMA-btn-hrefAll")) {
                const styles = `
.JqMA-btn-hrefSpan{
margin-left:auto!important;
height:calc(.2vh + .2vw)!important;
width:calc(1vh + 1vw)!important;
background:red!important;
position:static!important;
}.JqMA-btn-hrefAll{
background:none!important;
overflow:scroll!important;
height:auto!important;
width:auto!important;
max-height:calc(5vh + 5vw)!important;
max-width:calc(15vw + 15vh)!important;
bottom:2px!important;
right:0!important;
}.JqMA-btn-hrefAll::-webkit-scrollbar{
display: none!important;
}.JqMA-btn-href{
text-align:left!important;
position:static!important;
width:calc(15vw + 15vh)!important;
}.JqMA-btn-href>.JqMA-btn-hrefA{
background:none!important;
display:inline-block!important;
white-space:nowrap!important;
}`;
                pAll = createElement('p', {
                    class: 'JqMA-btn-all JqMA-btn-hrefAll'
                });
                pAll.appendChild(createElement('style', null, styles));
                pAll.appendChild(createElement('span', {
                    class: 'JqMA-btn-all JqMA-btn-hrefSpan'
                }));
                pAll.appendChild(firstSpan = createElement('a', {
                    href: "https://www.hlsplayer.net/",
                    target: '_blank',
                    style: "margin-left:auto!important; width:calc(6vw + 6vh)!important; text-align:center!important;",
                    class: "JqMA-btn-all JqMA-btn-href"
                }, "Player"));
                document.documentElement.appendChild(pAll);
            }
            let videoSet = new Set();

            document.querySelectorAll("video,video>source").forEach(function(element) {
                const src = element.currentSrc || element.src;
                src && videoSet.add(src);
            });
            let pageSource = document.documentElement.outerHTML;

            const iframeHtmls = GM_getValue("iframeHtml", {});
            Object.values(iframeHtmls).forEach(outerhtml => {
                for (const v of outerhtml.videos) {
                    v && videoSet.add(v);
                }
                pageSource += outerhtml.html;
                for (const entry of outerhtml.entries) {
                    if (videoUrlReg.test(entry)) {
                        videoSet.add(entry);
                    }
                }
            });
            const matches = pageSource.replace(QUOTE_REGEX, '"').match(videoRegex);

            matches && matches.forEach(match => videoSet.add(match));

            const entries = window.performance.getEntries();
            for (const entry of entries) {
                if (videoUrlReg.test(entry.name)) {
                    videoSet.add(entry.name);
                }
            }
            let newVideoSet = new Set();

            for (const url of videoSet) {
                const newI = formatStr(url);
                if (!newI.replace(/[\s/]/g, "").length || /^(?!https?:)[a-z]{3,15}:/.test(newI)) continue;

                const delHtList = delHttp(newI);
                if (delHtList.length) delHtList.forEach(delht => newVideoSet.add(delht));

                if (!delHtList.length || !newI.includes("player")) {
                    newVideoSet.add(newI);
                }
            }
            const fragment = document.createDocumentFragment();
            const videoNum = pAll.children.length;
            let newNum = 0;

            for (const url of newVideoSet) {
                const processedUrl = addLocation(decodeStr(url));
                if (preMatches.has(processedUrl)) continue;

                newNum++;

                preMatches.add(processedUrl);

                const videoP = createElement('p', {
                    class: "JqMA-btn-all JqMA-btn-href"
                });
                videoP.appendChild(createElement('a', {
                    href: processedUrl,
                    style: "width:60%!important;",
                    target: '_blank',
                    class: "JqMA-btn-all JqMA-btn-href JqMA-btn-hrefA",
                }, `${videoNum+newNum-3} ${processedUrl.replace(/.+\/(?=[^/])|(?<=m3u8)\?.+/g, "")} ${document.title}`));

                videoP.appendChild(createElement('a', {
                    href: "https://m3u8.cococut.net/player.html?m3u8=" + encodeURIComponent(processedUrl),
                    style: "width:40%!important; text-align:center!important;",
                    target: '_blank',
                    class: "JqMA-btn-all JqMA-btn-href JqMA-btn-hrefA",
                }, "Play"));
                fragment.appendChild(videoP);
            }
            pAll.insertBefore(fragment, firstSpan);
        }

        function getMinPicwh(_this) {
            return Math.min(_this.naturalWidth, _this.naturalHeight);
        }

        function getPercentW(_this) {
            return parseInt(_this.offsetWidth / window.innerWidth * 100);
        }

        function waitClick(afterFunc) {
            document.head.appendChild(hideAllBtn);

            setTimeout(function() {
                docSltAll("body:not(body *)").forEach(function(_this) {
                    _this.addEventListener('touchstart', tempClickFunc);
                });

                function tempClickFunc(event) {
                    event.preventDefault();

                    docSltAll("body").forEach(function(_this) {
                        _this.removeEventListener('touchstart', tempClickFunc);
                    });
                    document.head.removeChild(hideAllBtn);

                    afterFunc(event);
                }
            }, 100);
        }

        function btnOuterSzClick() {

            let inputNum = window.prompt(`请输入过滤尺寸：${outerSz}`);
            if (Number(inputNum) || inputNum === "0") {
                outerSz = Number(inputNum);
                if (outerSz < minOuterSz) outerSz = minOuterSz;
                outerSz_run();
            }
        }

        function outerSz_run() {

            if (outerSz < 0) outerSz = 0;

            if (picZ) {
                picImgFilter();
            }
            document.querySelector(".JqMA-btn-outerSz").textContent = outerSz;

            setValLoc("outerSz", outerSz);
        }

        function btnPicwhClick() {
            let inputNum = window.prompt(`请输入 过滤尺寸：（@ = 修改默认，${picwh}）`);
            if (/^\d+$/.test(inputNum)) {

                picwh = Number(inputNum);
                if (picwh < minPicwh) picwh = minPicwh;

                picImgFilter();

            } else if (inputNum === "@") {

                inputNum = window.prompt(`请输入 过滤宽高比，最小过滤尺寸，最小过滤宽度，最大转高清尺寸：（推荐：3.9，100，10，500）`, [whProp, minPicwh, minOuterSz, minPicHD]);
                if (/^[\d.,]+$/.test(inputNum)) {
                    whProp = Number(inputNum.split(",")[0]);
                    minPicwh = Number(inputNum.split(",")[1]);
                    minOuterSz = Number(inputNum.split(",")[2]);
                    minPicHD = Number(inputNum.split(",")[3]);

                    picImgFilter();

                    GM_setValue("whProp", whProp);
                    GM_setValue("minPicwh", minPicwh);
                    GM_setValue("minOuterSz", minOuterSz);
                    GM_setValue("minPicHD", minPicHD);
                }
            }
        }

        function picImgFilter() {

            if (picwh < 0) picwh = 0;

            if (picZ) {
                document.querySelectorAll(".JqMA-inner-pic > .JqMA-mark-imgLoaded").forEach((_this) => {
                    _this.classList.toggle("JqMA-css-smallPic", !picSizeOut(_this));
                });
            }
            document.querySelector(".JqMA-btn-pic").textContent = picwh;

            setValLoc("picwh", picwh);
        }

        function btnPicClick(event) {
            const btn = event.target;
            const innerPic = document.querySelector(".JqMA-inner-pic");
            if (innerPic) {
                innerPic.remove();
                pageX.unshift(visibleDiv([9, -9]).scrollTop);
                removePicClass();
                picZ = 0;
                waitClick(function(event) {
                    let _target = event.target;
                    let _this = _target;
                    const srcArr = new Set();
                    function getImgSrc(_this){
                        if (_this.matches("img")) {
                            srcArr.add(_this.currentSrc || _this.src);
                        } else if (_this.matches("video")) {
                            if (_this.poster) srcArr.add(_this.poster);
                        }
                        const bgUrls = window.getComputedStyle(_this).backgroundImage.matchAll(/url\(['"]?(.*?)['"]?\)/g);
                        [...bgUrls].forEach(match => match[1] && srcArr.add(match[1]));
                    }
                    getImgSrc(_this);
                    if(srcArr.size==0){
                        [..._this. querySelectorAll("*")].forEach(getImgSrc);
                    }else{
                        _this=_this.parentElement;
                    }
                    for(let i=0;!srcArr.size && _this.parentElement && i<3;i++){
                        _this=_this.parentElement;
                        [..._this.querySelectorAll("*")].forEach(getImgSrc);
                    }
                    const selector = getSelector(srcArr.size ? _this : _target);
                    const inputNum = window.prompt(`空白=全选\n修改选择器：${selector}`, imgSlt.length ? imgSlt : selector);
                    if (inputNum == "所有域名") {
                        const resultData = changeDataFunc(imgSltData, "");
                        if (resultData)[imgSltData, imgSlt] = resultData;
                    } else if (typeof inputNum === "string") {
                        imgSlt = inputNum;
                        if (imgSlt === "") {
                            delete imgSltData[currentDomain];
                        } else {
                            imgSltData[currentDomain] = imgSlt;
                        }
                        picZ = 1;
                        imgInterFn();
                    } else if (inputNum === null) {
                        return;
                    }
                    GM_setValue("imgSltData", imgSltData);
                    if (picZ) {
                        picZData[currentDomain] = picZ;
                    } else {
                        delete picZData[currentDomain];
                    }
                    btn.style.setProperty("color", picZ ? "green" : "white", "important");
                    GM_setValue("picZData", picZData);
                });
            } else {
                picZ = 1;
                imgInterFn();
            }
            if (picZ) {
                picZData[currentDomain] = picZ;
            } else {
                delete picZData[currentDomain];
            }
            btn.style.setProperty("color", picZ ? "green" : "white", "important");
            GM_setValue("picZData", picZData);
        }
        let xScrDirect = true;

        function scrollPicLoad() {

            const _picZ = picZ;
            picZ = 0;

            const visDiv = visibleDiv([9]);
            pageX.unshift(visDiv.scrollTop);

            let maxOne;
            for (const dom of visDiv.querySelectorAll(":not(.JqMA-inner-all)")) {
                if (!maxOne || dom.offsetHeight > maxOne.offsetHeight) {
                    maxOne = dom;
                }
            }
            maxOne.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
            xScrollDiv([9, -9]).forEach((elet) => {
                let maxX;
                for (const dom of elet.querySelectorAll("*")) {
                    if (!maxX || dom.offsetWidth > maxX.offsetWidth) {
                        maxX = dom;
                    }
                }
                maxX.scrollIntoView({
                    behavior: 'smooth',
                    inline: xScrDirect ? 'end' : 'start'
                });
            });
            setTimeout(() => {
                xScrDirect = xScrDirect == false;
                if (_picZ) {
                    picZ = 1;
                }
            }, 1100);
        }

        function removePicClass() {
            document.querySelectorAll(".pagetual_pageBar").forEach((_this) => {
                _this.classList.remove("JqMA-mark-pageNext");
            });
            preImgArr = [new Set(), new Set(), new Set()];

            const innerPic_1 = document.querySelector(".JqMA-inner-pic");
            innerPic_1 && innerPic_1.remove();
        }

        function addLocation(_href) {
            try {
                return new URL(_href, currentDomain).href;
            } catch (e) {
                return _href;
            }
        }

        function getImgList(dataObj, _this, preImgNum) {

            const imgList = [];

            dataObj.forEach(item => {
                item = formatStr(item);
                if (!item.replace(/[\s/]/g, "").length) return;
                item = addLocation(decodeStr(item));

                if (preImgArr[preImgNum].has(item)) return;
                preImgArr[preImgNum].add(item);

                const newImg = createElement('img', {
                    src: item,
                    loading: 'lazy',
                    width: '300',
                    height: '100',
                    decoding: 'async'
                });
                const _newA = document.createElement('a');

                newImg.addEventListener('load', function() {
                    imgLoadError(newImg, _newA);

                    newImg.classList.add("JqMA-mark-imgLoaded");
                });
                newImg.addEventListener('error', function() {
                    imgLoadError(newImg, _newA);
                });
                imgList.push(newImg);

                if (_this) {
                    newImg.setAttribute('img-outerWH', getPercentW(_this));

                    _this.addEventListener('load', function() {
                        const _percW = getPercentW(_this);

                        newImg.setAttribute('img-outerWH', _percW);

                        _newA.textContent = `${getMinPicwh(newImg)} ${_percW}`;

                        newImg.classList.toggle("JqMA-css-smallPic", !picSizeOut(newImg));
                    });
                    _newA.addEventListener("click", () => scrollOrClick(newImg, _this));

                    newImg.addEventListener("click", function() {
                        if (!Dhide) {
                            scrollOrClick(newImg, _this);
                        }
                    });
                } else {
                    newImg.setAttribute('img-outerWH', 10);
                }
                imgList.push(_newA);
            });
            return imgList;
        }

        function scrollOrClick(newImg, _this) {

            const initialPosition = _this.getBoundingClientRect().top;

            _this.scrollIntoView({
                block: "center",
                behavior: 'auto'
            });
            setTimeout(() => _this.scrollIntoView({
                block: "center",
                behavior: 'auto'
            }), 300);
            if (_this.getBoundingClientRect().top == initialPosition) {
                simulateClick(_this);
            }
            pageX.unshift(newImg);
        }

        let [moodNumData, moodNum] = getDataValue("moodNumData", "auto");

        let moodText;
        let preImgArr = [new Set(), new Set(), new Set()];

        const imgRegex_1 = /https?[:%][^"<>\s|]+\.(?:xbm|tif|pjp|jpe?g|tiff|gif|jfif|webp|png|bmp|pjpeg|avif)(?:[?!/&%][^"<>\s|]+)?(?=["<>\s一-龟|]|https?[:%]|$)/gi

        const imgRegex_2 = /((?<=")[a-z]*\/|https?[:%])[^"<>\s|]+\.(?:xbm|tif|pjp|jpe?g|tiff|gif|jfif|webp|png|bmp|pjpeg|avif)(?:[?!/&%][^"<>\s|]+)?(?=["<>\s|]|https?[:%]|$)/i

        let pageNext_0, pageNext_1, pageNext_2, innerPic;

        function imgInterFn() {

            if (!document.querySelector(".JqMA-inner-pic")) {
                const newP = createElement('p', {
                    class: "JqMA-inner-pic JqMA-inner-all"
                });
                publicStyle.textContent += htmlVisText;

                const moodchange = createElement('p', {
                    style: "background:green!important;",
                    class: `JqMA-mark-pageNum`
                }, "模式切换：" + moodNum);

                if (moodNum != "auto") {
                    moodText = `html .JqMA-inner-pic>img{width:${moodNum}!important;}`;
                    publicStyle.textContent += moodText;
                }
                moodchange.addEventListener("click", function() {
                    const theStr = prompt(`${moodText} 默认：auto 可选：1～100%`, moodNum);
                    if (!theStr) return;
                    moodNum = theStr;
                    publicStyle.textContent = publicStyle.textContent.replace(moodText, "");
                    if (moodNum != "auto") {
                        moodNum = moodNum.replace(/%?$/,"%");
                        moodText = `html .JqMA-inner-pic>img{width:${moodNum}!important;}`;
                        publicStyle.textContent += moodText;
                        moodNumData[currentDomain] = moodNum;
                    } else {
                        delete moodNumData[currentDomain];
                    }
                    moodchange.textContent = "模式切换：" + moodNum;
                    GM_setValue("moodNumData", moodNumData);
                });
                newP.appendChild(moodchange);

                const textContents = ["深度搜索", "可见元素", "所有图片"];
                textContents.forEach((textContent, index) => {
                    newP.appendChild(createElement('p', {
                        style: "background:green!important;",
                        class: `JqMA-mark-pageNext JqMA-mark-pageNext_${index} JqMA-mark-pageNum`
                    }, textContent));
                });
                document.documentElement.prepend(newP);
            }
            pageNext_0 = document.querySelector(".JqMA-mark-pageNext_0");
            pageNext_1 = document.querySelector(".JqMA-mark-pageNext_1");
            pageNext_2 = document.querySelector(".JqMA-mark-pageNext_2");
            innerPic = document.querySelector(".JqMA-inner-pic");

            const imgArr_0 = [];
            const imgArr_1 = [];

            docSltAll(imgSlt + " *").forEach(function(_this) {
                if (_this.classList.contains("pagetual_pageBar")) {
                    if (!_this.classList.contains("JqMA-mark-pageNext")) {
                        _this.classList.add("JqMA-mark-pageNext");

                        if (DSImg.includes('1') && (!imgArr_0.length || !imgArr_0[imgArr_0.length - 1].classList.contains('JqMA-mark-pageNext'))) {
                            imgArr_0.push(createElement('p', {
                                class: "JqMA-mark-pageNext"
                            }));
                        }
                        if (DSImg.includes('2') && (!imgArr_1.length || !imgArr_1[imgArr_1.length - 1].classList.contains('JqMA-mark-pageNext'))) {
                            imgArr_1.push(createElement('p', {
                                class: "JqMA-mark-pageNext"
                            }));
                        }
                    }
                    return true;
                }
                const srcArr = [];
                if (_this.matches("img:not(.JqMA-inner-pic>*)")) {
                    srcArr.push(_this.currentSrc || _this.src);
                } else if (_this.matches("video")) {
                    if (_this.poster) srcArr.push(_this.poster);
                }
                const bgUrls = window.getComputedStyle(_this).backgroundImage
                    .matchAll(/url\(['"]?(.*?)['"]?\)/g);

                Array.from(bgUrls).forEach(match => match[1] && srcArr.push(match[1]));

                if (srcArr.length) {
                    if (DSImg.includes('1')) {
                        const imgList = getImgList(srcArr, _this, 0);
                        if (imgList.length) imgArr_0.push(...imgList);
                    }
                    if (DSImg.includes('2')) {
                        const fragmentParts = [];
                        const parentLink = _this.closest('a');
                        if (parentLink) {
                            const linkClone = parentLink.cloneNode();
                            linkClone.style.cssText = '';
                            fragmentParts.push(linkClone.outerHTML);
                        }
                        const elementClone = _this.cloneNode();
                        ['style', 'src', 'poster'].forEach(attr => elementClone.removeAttribute(attr));
                        fragmentParts.push(elementClone.outerHTML);
                        const imageUrlMatch = fragmentParts.join('').replace(QUOTE_REGEX, '"').match(imgRegex_2)?.[0];
                        if (imageUrlMatch) {
                            const newImages = getImgList([imageUrlMatch], _this, 1);
                            if (newImages.length) imgArr_1.push(...newImages);
                        }
                    }
                }
            });
            if (imgArr_0.length) {
                const fragment0 = document.createDocumentFragment();
                imgArr_0.forEach(imgElement => fragment0.appendChild(imgElement));
                pageNext_2.parentNode.insertBefore(fragment0, pageNext_2);
            }
            if (imgArr_1.length) {
                const fragment1 = document.createDocumentFragment();
                imgArr_1.forEach(imgElement => fragment1.appendChild(imgElement));
                pageNext_1.parentNode.insertBefore(fragment1, pageNext_1);
            }
            if (DSImg.includes('3')) {
                const iframeHtmls = GM_getValue("iframeHtml", {});
                const htmlArray = Object.values(iframeHtmls);
                const imageUrls = htmlArray.flatMap(data => [...(data.imgs || []), ...(data.posters || [])]);
                const allHtmlContent = document.documentElement.outerHTML +
                    htmlArray.map(data => data.html || '').join('');
                const allHtmlImg = allHtmlContent.replace(QUOTE_REGEX, '"').match(imgRegex_1);
                if (allHtmlImg) imageUrls.push(...allHtmlImg);

                const imgList = getImgList(imageUrls, false, 2);
                if (imgList.length) {
                    const fragment = document.createDocumentFragment();
                    imgList.forEach(_img => fragment.appendChild(_img));
                    innerPic.appendChild(fragment);
                }
            }
            picImgCount(pageNext_0, pageNext_1, pageNext_2);
        }

        function imgLoadError(elet, _newA) {

            picImgCount(pageNext_0, pageNext_1, pageNext_2);

            let oldNatureH = elet.naturalHeight;
            let oldNatureW = elet.naturalWidth;
            let minWH = Math.min(oldNatureW, oldNatureH);

            if (minWH < minPicHD) {
                let thisSrcList = picHD(elet.currentSrc),
                    promiseArray = [];

                for (let i = 0; i < thisSrcList.length; i++) {
                    promiseArray.push(checkImgExists(thisSrcList[i]).catch(err => console.log(err)));
                }
                Promise.all(promiseArray).then(function(data) {
                    for (let i = 0; i < data.length; i++) {
                        let resH = data[i];
                        if (resH.naturalHeight > oldNatureH || resH.naturalWidth > oldNatureW) {
                            elet.setAttribute("src", resH.src);
                            return;
                        }
                    }
                });
            }
            setTimeout(function() {
                elet.classList.toggle("JqMA-css-smallPic", !picSizeOut(elet));

                if (_newA) _newA.textContent = `${minWH} ${elet.getAttribute("img-outerWH")}`;
            }, 100);
        }

        function prevAll(pageNext_1, _seletor) {

            let siblings = Array.from(pageNext_1.parentNode.children);

            let imgElements = siblings.slice(0, siblings.indexOf(pageNext_1)).filter(function(sibling) {
                return sibling.matches(_seletor);
            });
            return imgElements;
        }

        let picImgTime;

        function picImgCount(pageNext_0, pageNext_1, pageNext_2) {

            clearTimeout(picImgTime);

            picImgTime = setTimeout(function() {
                const picImgLen = document.querySelectorAll(".JqMA-inner-pic > img:not(.JqMA-css-smallPic)").length;
                const keJian_Img = prevAll(pageNext_1, "img:not(.JqMA-css-smallPic)").length;
                const search_len = prevAll(pageNext_2, "img:not(.JqMA-css-smallPic)").length;

                pageNext_0.textContent = `深度：${keJian_Img} `;
                pageNext_0.appendChild(createElement("a", {
                    id: "JqMA-mark-pageNext_1"
                }, `可见：${search_len - keJian_Img} `));
                pageNext_0.appendChild(createElement("a", {
                    id: "JqMA-mark-pageNext_2"
                }, `所有：${picImgLen - search_len} `));
                pageNext_0.appendChild(createElement("a", {
                    id: "JqMA-mark-lastOne"
                }, "最后"));
            }, 400);
        }

        function picHD(oldSrc) {
            let thisSrc = oldSrc,
                thisSrcList = [];

            if (picReplace.indexOf("`") != -1) {
                let numberToRe = /^@/.test(picReplace) ? 1 : 0,
                    picRepArr = picReplace.replace(/^@/, "").split("`");

                for (let i = 0; i < parseInt(picRepArr.length / 2); i++) {
                    thisSrc = thisSrc.replace(numberToRe ? new RegExp(picRepArr[2 * i].replace(/(?<![{])\d(?![}])/g, "[0-9]")) : picRepArr[2 * i], picRepArr[2 * i + 1]);
                }
                thisSrcList.push(thisSrc);
            }
            thisSrcList.push(oldSrc.replace(/-\d{2,4}x\d{2,4}(?=[.-])/, ""));

            thisSrcList.push(oldSrc.replace(/^(?=data:)(.+?)[^A-Za-z0-9+/=>;]+$/, "$1"));

            let delHtList = delHttp(oldSrc);
            if (delHtList.length) thisSrcList.push(...delHtList);

            if (!/.https?[:%]/.test(oldSrc)) {
                thisSrcList.push(oldSrc.replace(/^([^?]+?)&.*$/, "$1"));
            }
            let newSrcList = [];
            for (let i = 0; i < thisSrcList.length; i++) {
                thisSrc = thisSrcList[i];
                if (thisSrc != oldSrc) {
                    newSrcList.push(thisSrc);
                }
            }
            return newSrcList;
        }
        const picAimgText1 = `
html .JqMA-inner-pic>a{
height:0!important;
border:0!important;
}`;
        const picAimgText2 = `
html .JqMA-btn-all{
display:block!important;
}html .JqMA-btn-del{
opacity:1!important;
}`;

        function delHide() {
            if (Dhide) {
                if (publicStyle.textContent.includes(picAimgText2)) {
                    publicStyle.textContent = publicStyle.textContent.replace(picAimgText2, picAimgText1);
                } else {
                    publicStyle.textContent += picAimgText1;
                }
            } else {
                if (publicStyle.textContent.includes(picAimgText1)) {
                    publicStyle.textContent = publicStyle.textContent.replace(picAimgText1, picAimgText2);
                } else {
                    publicStyle.textContent += picAimgText2;
                }
                xiuTan();
            }
        }

        function btnDelClick() {
            Dhide = Dhide ? 0 : 1;

            delHide();

            setValLoc("Dhide", Dhide);
        }

        let nextScrollTop = getValLoc("nextScrollTop", 0);

        function getNextPage(hrefSplit) {
            let pNumber = Number(hrefSplit[2].split(/[^\d]/)[0]) + 1;
            let newHref = hrefSplit[0] + hrefSplit[1] + pNumber + hrefSplit[2].replace(/^\d+/, "");
            return newHref;
        }

        function openHref(newHref) {
            if (openBlk) {
                GM_openInTab(newHref,{active:true,insert:true,setParent:true});
            } else {
                location.href = newHref;
            }
        }

        function aOpenBlank() {

            docSltAll("head").forEach(function(elet) {
                const baseId = "JqMA-mark-openNew";
                !elet.querySelector(`#${baseId}`) && elet.appendChild(createElement('base', {id:baseId,target:"_blank",rel:"noopener noreferrer"}));
            });
            docSltAll('a[target]').forEach(link => {
                link.removeAttribute('target');
            });
        }

        function btnBlankClick() {
            openBlk = openBlk ? 0 : 1;

            document.querySelector(".JqMA-btn-blank").style.setProperty("color", openBlk ? "green" : null, "important");

            if (openBlk) {
                aOpenBlank();
                openBlkData[currentDomain] = openBlk;
            } else {
                delete openBlkData[currentDomain];

                docSltAll("head > base#JqMA-mark-openNew").forEach(_this => _this.remove());
            }
            setValLoc("openBlkData", openBlkData);
        }

        let fullBodyText;

        function fullScreen() {
            if (document.fullscreenElement) return;

            document.documentElement.requestFullscreen();

            fullBodyText = `
.JqMA-inner-all,body{
width:${Drotate_W}vw!important;
max-width:none!important;
min-width:none!important;
}`;
            publicStyle.textContent += fullBodyText;

            screen.orientation.lock = hengPin;
            screen.orientation.lock('landscape');
        }

        let Drotate = getValLoc("Drotate", 0);
        let Drotate_W = getValLoc("Drotate_W", 100);

        function scrollRun() {

            Dscroll = Dscroll ? 0 : 1;
            clearInterval(timeDown);

            document.querySelector(".JqMA-btn-Ju").style.setProperty("color", Dscroll ? "green" : null, "important");
            if (Dscroll) {
                timeDown = setInterval(function() {
                    autoScrollBy(visibleDiv(direction > 0 ? [9] : [-9], false), direction * scrollJu * window.innerHeight * .05);
                }, 810);
                GM_setValue("scrollJu", scrollJu);
            }
        }

        function btnJuClick() {
            scrollRun();
            setValLoc("Dscroll", Dscroll);
        }
    })();
}