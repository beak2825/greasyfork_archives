// ==UserScript==
// @name        网页通用验证码识别
// @namespace    http://tampermonkey.net/
// @version 4.0
// @description  解放眼睛和双手，自动识别并填入数字，字母（支持大小写）,文字验证码。
// @author       哈士奇

// @include        http://*
// @include        https://*
// @license        MIT

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://unpkg.com/vue@2.6.12/dist/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @resource elementUIcss https://unpkg.com/element-ui/lib/theme-chalk/index.css

// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/440083/%E7%BD%91%E9%A1%B5%E9%80%9A%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/440083/%E7%BD%91%E9%A1%B5%E9%80%9A%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {
    // GM_setValue('tipsConfig',"")
    var elementUIcss = GM_getResourceText("elementUIcss");
    var routePrefix = 'http://1.95.154.26:7000'
    GM_addStyle(elementUIcss);

    function getStyle(el) {
        // 获取元素样式
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, null);
        } else {
            return el.currentStyle;
        }
    }

    function init() {
        //简化各种api和初始化全局变量
        CUR_URL = window.location.href;
        DOMAIN = CUR_URL.split("//")[1].split("/")[0];
        SLIDE_STORE_KEY = "husky_" + "slidePath" + location.host;
        NORMAL_STORE_KEY = "husky_" + "normalPath" + location.host;
        selector = document.querySelector.bind(document);
        selectorAll = document.querySelectorAll.bind(document);
        getItem = localStorage.getItem.bind(localStorage);
        setItem = localStorage.setItem.bind(localStorage);
    }

    function getNumber(str) {
        return Number(str.split(".")[0].replace(/[^0-9]/gi, ""));
    }

    function isNumber(value) {
        if (!value && value !== 0) {
            return false;
        }
        value = Number(value);
        return typeof value === "number" && !isNaN(value);
    }

    function getEleTransform(el) {
        const style = window.getComputedStyle(el, null);
        var transform =
            style.getPropertyValue("-webkit-transform") ||
            style.getPropertyValue("-moz-transform") ||
            style.getPropertyValue("-ms-transform") ||
            style.getPropertyValue("-o-transform") ||
            style.getPropertyValue("transform") ||
            "null";
        return transform && transform.split(",")[4];
    }

    class Captcha {
        // 识别网页中的验证码
        constructor() {
            this.imgCache = [];
            this.inputTags = [];
            this.recommendPath = {};
            this.checkTimer = null;
            this.listenLoadSuccess = false;

            window.addEventListener("load", async () => {
                this.listenLoadSuccess = true;
                this.init();
            });
            setTimeout(() => {
                if (!this.listenLoadSuccess) {
                    this.listenLoadSuccess = true;
                    this.init();
                }
            }, 5000);
        }

        doCheckTask() {
            this.findCaptcha();
            // this.checkSlideCaptcha();
        }
        init() {
            if (blackListCheck()) {
                return;
            }
            this.manualLocateCaptcha();
            this.doCheckTask();

            const MutationObserver =
                window.MutationObserver ||
                window.WebKitMutationObserver ||
                window.MozMutationObserver;
            const body = document.body;

            const Observer = new MutationObserver((mutations, instance) => {
                if (blackListCheck()) {
                    return;
                }
                for (let i = 0; i < mutations.length; i++) {
                    const el = mutations[i].target;
                    const tagName = mutations[i].target.tagName.toLowerCase();
                    let checkList = [];
                    checkList.push(el.getAttribute("id"));
                    checkList.push(el.className);
                    checkList.push(el.getAttribute("alt"));
                    checkList.push(el.getAttribute("src"));
                    checkList.push(el.getAttribute("name"));
                    checkList = checkList.filter((item) => item);

                    for (let x = 0; x < checkList.length; x++) {
                        if (
                            /.*(code|captcha|验证码|login|点击|verify|yzm|yanzhengma|滑块|拖动|拼图|yidun|slide).*/im.test(
                                checkList[x].toString().toLowerCase()
                            ) ||
                            tagName === "img" ||
                            tagName === "iframe"
                        ) {
                            if (!this.checkTimer) {
                                this.checkTimer = setTimeout(() => {
                                    this.doCheckTask();
                                }, 0);
                            } else {
                                window.clearTimeout(this.checkTimer);
                                this.checkTimer = setTimeout(() => {
                                    this.doCheckTask();
                                }, 2000);
                            }
                            return;
                        }
                    }
                }
            });
            Observer.observe(body, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
        dataURLtoFile(dataURL, filename = "captcha.jpg") {
            //  base64转图片文件
            var arr = dataURL.split(","),
                mime =
                    (arr[0].match(/:(.*?);/) && arr[0].match(/:(.*?);/)[1]) ||
                    "image/png",
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }
        async getRecommendPath() {
            let requestUrl =
                routePrefix + "/cssPath?href=" +
                location.href.split("?")[0];
            try {
                GM_xmlhttpRequest({
                    method: "get",
                    url: requestUrl,
                    onload: async (res) => {
                        if (res.status === 200 && res.response) {
                            let data = (res.response && JSON.parse(res.response)) || {};
                            const { path, recommendTimes = 0 } = data;
                            if (path && recommendTimes) {
                                let inputSelector = path.split("$$")[0];
                                let imgSelector = path.split("$$")[1];
                                if (
                                    selector(inputSelector) &&
                                    selector(imgSelector) &&
                                    selector(imgSelector).getAttribute("src") &&
                                    selector(inputSelector).getAttribute("type") === "text"
                                ) {
                                    let dataURL = await this.handleImg(selector(imgSelector));
                                    try {
                                        if (!this.hasRequest(dataURL, { record: true })) {
                                            let code = await this.request(
                                                this.dataURLtoFile(dataURL),
                                                this.cssPath(selector(inputSelector)) +
                                                "$$" +
                                                this.cssPath(selector(imgSelector)),
                                                selector(imgSelector).getAttribute("src")
                                            );
                                            if (code) {
                                                selector(inputSelector).value = code;
                                                if (typeof Vue !== "undefined") {
                                                    new Vue().$message.success("获取验证码成功");
                                                }
                                                console.log("正在使用共享验证码功能获取验证码");
                                            } else {
                                                console.error("验证码为空，请检查图片是否正确");
                                            }
                                        }
                                    } catch (error) {
                                        console.log(error);
                                        // if (typeof Vue !== "undefined") {
                                        //     new Vue().$message.error("获取验证码失败");
                                        // }
                                    }
                                }
                            }
                        }
                    },
                    onerror: function (err) {
                        console.log("推荐路径请求失败:" + err);
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }
        getCaptchaFeature(el) {
            // 获取验证码特征
            let checkList = [];
            checkList.push(el.getAttribute("id"));
            checkList.push(el.className);
            checkList.push(el.getAttribute("alt"));
            checkList.push(el.getAttribute("src"));
            checkList.push(el.getAttribute("name"));

            return checkList;
        }
        cssPath = (el) => {
            // 获取元素css path
            if (!(el instanceof Element)) return;
            var path = [];
            while (el.nodeType === Node.ELEMENT_NODE) {
                var selector = el.nodeName.toLowerCase();
                if (el.id) {
                    selector += "#" + el.id;
                    path.unshift(selector);
                    break;
                } else {
                    var sib = el,
                        nth = 1;
                    while ((sib = sib.previousElementSibling)) {
                        if (sib.nodeName.toLowerCase() == selector) nth++;
                    }
                    if (nth != 1) selector += ":nth-of-type(" + nth + ")";
                }
                path.unshift(selector);
                el = el.parentNode;
            }
            return path.join(" > ");
        };

        manualLocateCaptcha() {
            let imgs = [];
            let inputTags = [];
            let cssPathStore = {};
            let finish = false;
            this.vue = new Vue();
            this.isIframe = top !== self;
            var onTagClick = (e) => {
                let el = e.target;
                let tagName = el.tagName;
                if (tagName.toLowerCase() === "input") {
                    let type = el.getAttribute("type");
                    if (type && type !== "text") {
                        this.vue.$message.error(
                            "提醒：当前点击输入框type=" + type + ",请选择文本输入框"
                        );
                    } else {
                        cssPathStore.input = this.cssPath(el);
                        this.vue.$message.success("您已成功选择输入框");
                    }
                } else {
                    cssPathStore.img = this.cssPath(el);
                    this.vue.$message.success("您已成功选择验证码图片");
                }
                if (cssPathStore.input && cssPathStore.img) {
                    GM_setValue(NORMAL_STORE_KEY, JSON.stringify(cssPathStore));
                    imgs.forEach((img) => {
                        img && img.removeEventListener("click", onTagClick);
                    }, false);
                    inputTags.forEach((input) => {
                        input.removeEventListener("click", onTagClick);
                    }, false);
                    setTimeout(() => {
                        this.vue.$message.success("选择完毕，赶快试试吧");
                        captchaInstance.doCheckTask();
                    }, 3000);
                    finish = true;
                }
            };
            var onMenuClick = (e) => {
                if (this.isIframe) {
                    alert("当前脚本处于iframe中，暂不支持该操作，快让作者优化吧");
                    return;
                }
                finish = false;
                cssPathStore = {};
                GM_deleteValue(NORMAL_STORE_KEY);
                this.vue.$alert("接下来请点击验证码图片和输入框", "操作提示", {
                    confirmButtonText: "确定",
                    callback: () => {
                        setTimeout(() => {
                            imgs.forEach((img) => {
                                img && img.removeEventListener("click", onTagClick);
                            }, false);
                            inputTags.forEach((input) => {
                                input.removeEventListener("click", onTagClick);
                            }, false);
                            if (!finish) {
                                this.vue.$notify.success({
                                    title: "提示",
                                    message: "已退出手动选择验证码模式。",
                                    offset: 100,
                                });
                            }
                        }, 20000);
                    },
                });

                // alert("请点击验证码和输入框各一次。");
                imgs = [...selectorAll("img")];
                inputTags = [...selectorAll("input")];
                imgs.forEach((img) => {
                    img.addEventListener("click", onTagClick);
                }, false);
                inputTags.forEach((input) => {
                    input.addEventListener("click", onTagClick);
                }, false);
            };
            GM_registerMenuCommand("手动选择验证码和输入框", onMenuClick);
        }
        handleImg(img) {
            return new Promise((resolve, reject) => {
                try {
                    // 图片没设置跨域，可采用图片转canvas转base64的方式
                    let dataURL = null;

                    const action = () => {
                        let canvas = document.createElement("canvas");
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        let ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                        dataURL = canvas.toDataURL("image/png");
                        resolve(dataURL);
                    };
                    if (!img.src.includes(";base64,")) {
                        img.onload = function () {
                            action();
                        };
                        if (img.complete) {
                            action();
                        } else {
                            img.onload = function () {
                                action();
                            };
                        }
                    } else {
                        dataURL = img.src;
                        resolve(dataURL);
                    }
                } catch (error) {
                    console.error("error:" + error);
                    // 这块处理比较复杂，待优化
                    // 图片设置跨域，重新请求图片内容后转base64，相当于替用户点击了“换一张图片”
                    // if (this.times >= 1) {
                    //   return;
                    // }
                    // if (typeof Vue !== "undefined") {
                    //     new Vue().$notify.success({
                    //         title: "温馨提示",
                    //         message: "当前验证码结果可能和图片显示不一致，请放心提交。",
                    //         offset: 100,
                    //     });
                    // }

                    // this.times++;
                    // GM_xmlhttpRequest({
                    //     method: "get",
                    //     url: img.src,
                    //     responseType: "blob",
                    //     onload: (res) => {
                    //         if (res.status === 200) {
                    //             let blob = res.response;
                    //             let fileReader = new FileReader();
                    //             fileReader.onloadend = (e) => {
                    //                 let base64 = e.target.result;
                    //                 resolve(base64);
                    //             };
                    //             fileReader.readAsDataURL(blob);
                    //         } else {
                    //             console.log("图片转换blob失败");
                    //             console.log(res);
                    //             reject();
                    //         }
                    //     },
                    //     onerror: function(err) {
                    //         console.log("图片请求失败:" + err);
                    //         reject();
                    //     },
                    // });
                }
            });
        }
        hasRequest(dataURL, config = {}) {
            let startIndex = config.type === "url" ? 0 : dataURL.length - 100;
            let imgClips = dataURL.slice(startIndex, dataURL.length);
            if (this.imgCache.includes(imgClips)) {
                return true;
            }
            if (config.record) {
                this.imgCache.push(imgClips);
            }
            return false;
        }
        request(file, path, src) {
            try {
                if (!file) {
                    console.error("缺少file参数");
                    return Promise.reject();
                }

                return new Promise((resolve, reject) => {
                    let host = location.href;
                    let href = location.href.split("?")[0].split("#")[0];
                    if (self === top) {
                        host = location.host;
                    }
                    let formData = new FormData();
                    let detail = {
                        // path,
                        // src,
                        // host,
                        href,
                    };
                    formData.append("img", file);
                    formData.append("detail", JSON.stringify(detail));
                    let requestUrl = routePrefix + '/captcha';
                    GM_xmlhttpRequest({
                        method: "post",
                        url: requestUrl,
                        data: formData,
                        onload: function (response) {
                            let res = JSON.parse(response.response) || {};
                            console.log({ res })
                            if (response.status === 429) {
                                let msg = res.msg || '获取验证码失败';
                                let date = new Date().getDate();
                                let tipsConfig = {
                                    date,
                                    times: 1,
                                };
                                let cache =
                                    GM_getValue("tipsConfig") &&
                                    JSON.parse(GM_getValue("tipsConfig"));
                                if (cache && cache.times > 5) {
                                } else {
                                    if (!cache) {
                                        GM_setValue("tipsConfig", JSON.stringify(tipsConfig));
                                    } else {
                                        cache.times = cache.times + 1;
                                        GM_setValue("tipsConfig", JSON.stringify(cache));
                                    }
                                    if (typeof Vue !== "undefined") {
                                        new Vue().$message.error(msg);
                                    }
                                }
                                console.error("获取验证码失败:", res);
                                reject();
                            } else {
                                if (res.data.code) {
                                    resolve(res.data.code);
                                } else {
                                    console.error("获取验证码失败，验证码为空:", response);
                                    reject();
                                }
                            }
                        },
                        onerror: function (err) {
                            console.error(err);
                            reject();
                        },
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
        async findCaptcha() {
            // 先读取用户手动设置的验证码配置
            let cache = GM_getValue(NORMAL_STORE_KEY);
            let captchaPath = cache && JSON.parse(cache);
            if (
                captchaPath &&
                captchaPath.input &&
                captchaPath.img &&
                selector(captchaPath.input) &&
                selector(captchaPath.img)
            ) {
                let dataURL = await this.handleImg(selector(captchaPath.img));
                try {
                    if (!this.hasRequest(dataURL, { record: true })) {
                        let code = await this.request(
                            this.dataURLtoFile(dataURL),
                            this.cssPath(selector(captchaPath.input)) +
                            "$$" +
                            this.cssPath(selector(captchaPath.img)),
                            selector(captchaPath.img).getAttribute("src")
                        );
                        if (code) {
                            selector(captchaPath.input).value = code.trim();
                            console.log("正在使用用户自定义验证码位置数据获取验证码");
                            return;
                        } else {
                            console.error("验证码为空，请检查图片是否正确");
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
                return;
            }
            // 自动寻找验证码和输入框
            let captchaMap = [];
            let imgs = [...selectorAll("img")];
            imgs.forEach((img) => {
                let checkList = [
                    ...this.getCaptchaFeature(img),
                    ...this.getCaptchaFeature(img.parentNode),
                ];
                checkList = checkList.filter((item) => item);
                let isInvalid =
                    ["#", "about:blank"].includes(img.getAttribute("src")) ||
                    !img.getAttribute("src");

                for (let i = 0; i < checkList.length; i++) {
                    if (
                        /.*(code|captcha|验证码|login|点击|verify|yzm|yanzhengma).*/im.test(
                            checkList[i].toLowerCase()
                        ) &&
                        img.width > 30 &&
                        img.width < 150 &&
                        img.height < 80 &&
                        !isInvalid
                    ) {
                        captchaMap.push({ img: img, input: null });
                        break;
                    }
                }
            });
            captchaMap.forEach((item) => {
                let imgEle = item.img;
                let parentNode = imgEle.parentNode;
                for (let i = 0; i < 4; i++) {
                    // 以当前可能是验证码的图片为基点，向上遍历四层查找可能的Input输入框
                    if (!parentNode) {
                        return;
                    }
                    let inputTags = [...parentNode.querySelectorAll("input")];
                    if (inputTags.length) {
                        let input = inputTags.pop();
                        let type = input.getAttribute("type");
                        while (type !== "text" && inputTags.length) {
                            if (type === "password") {
                                break;
                            }
                            input = inputTags.pop();
                            type = input.getAttribute("type");
                        }
                        let inputWidth = getStyle(input).width.replace(/[^0-9]/gi, "");
                        // let inputHeight = getStyle(input).height.replace(/[^0-9]/gi, "");
                        if (!type || (type === "text" && inputWidth > 50)) {
                            // 兼容各种奇葩情况
                            item.input = input;
                            break;
                        }
                        if (type === "password") {
                            // 验证码一般在密码框后面，遍历到密码框了就大概率说明没有验证码
                            break;
                        }
                    }
                    parentNode = parentNode.parentNode;
                }
            });
            // console.log(captchaMap);
            if (!captchaMap.length) {
                const { path, recommendTimes } = this.recommendPath;
                if (path) {
                    let inputSelector = path.split("$$")[0];
                    let imgSelector = path.split("$$")[1];
                    if (selector(inputSelector) && selector(imgSelector)) {
                        let dataURL = await this.handleImg(selector(imgSelector));
                        try {
                            if (!this.hasRequest(dataURL, { record: true })) {
                                selector(inputSelector).value = await this.request(
                                    this.dataURLtoFile(dataURL),
                                    path,
                                    item.img.getAttribute("src")
                                );
                                if (typeof Vue !== "undefined") {
                                    new Vue().$message.success("获取验证码成功");
                                }
                            }
                        } catch (error) {
                            console.log(error);
                            // if (typeof Vue !== "undefined") {
                            //     new Vue().$message.error("获取验证码失败");
                            // }
                        }
                    }
                }
            }
            captchaMap = captchaMap.filter((item) => item.input);
            captchaMap.forEach(async (item, index) => {
                let dataURL = await this.handleImg(item.img);
                try {
                    if (!this.hasRequest(dataURL, { record: true })) {
                        let code = await this.request(
                            this.dataURLtoFile(dataURL),
                            this.cssPath(item.input) + "$$" + this.cssPath(item.img),
                            item.img.getAttribute("src")
                        );
                        if (code) {
                            item.input.value = code;
                            if (typeof Vue !== "undefined") {
                                new Vue().$message.success("获取验证码成功");
                            }
                            console.log("正在使用自动寻找验证码功能获取验证码");
                        } else {
                            if (index === captchaMap.length - 1) {
                                // this.getRecommendPath();
                            }
                            console.error("验证码为空，请检查图片是否正确");
                        }
                    }
                } catch (error) {
                    if (index === captchaMap.length - 1) {
                        // this.getRecommendPath();
                    }
                    console.log(error);
                    // if (typeof Vue !== "undefined") {
                    //     new Vue().$message.error("获取验证码失败");
                    // }
                }
            });
        }
        getImgViaBlob(url) {
            return new Promise((resolve, reject) => {
                try {
                    GM_xmlhttpRequest({
                        method: "get",
                        url,
                        responseType: "blob",
                        onload: (res) => {
                            if (res.status === 200) {
                                let blob = res.response;
                                let fileReader = new FileReader();
                                fileReader.onloadend = (e) => {
                                    let base64 = e.target.result;
                                    if (base64.length > 20) {
                                        resolve(base64);
                                    } else {
                                        alert(
                                            "验证码助手：当前网站验证码图片禁止跨域访问，待作者优化。"
                                        );
                                        handleClearMenuClick();
                                        reject("base64图片长度不够");
                                        throw "getImgViaBlob: base64图片长度不够";
                                    }
                                };
                                fileReader.readAsDataURL(blob);
                            } else {
                                console.log("图片转换blob失败");
                                console.log(res);
                                reject();
                            }
                        },
                        onerror: function (err) {
                            console.log("图片请求失败:" + err);
                            reject();
                        },
                    });
                } catch (error) {
                    console.log(error);
                    reject();
                }
            });
        }
        elDisplay(el) {
            if (!el) {
                return false;
            }

            while (el) {
                if (!(el instanceof Element)) {
                    return true;
                }
                if (getStyle(el).display === "none") {
                    return false;
                }
                el = el.parentNode;
            }
            return true;
        }
        checkSlideCaptcha() {
            const check = async () => {
                const slideCache =
                    (GM_getValue(SLIDE_STORE_KEY) &&
                        JSON.parse(GM_getValue(SLIDE_STORE_KEY))) ||
                    {};
                const { bgImg, targetImg, moveItem } = slideCache;
                if (
                    bgImg &&
                    targetImg &&
                    moveItem &&
                    selector(targetImg) &&
                    selector(bgImg) &&
                    selector(moveItem) &&
                    this.elDisplay(selector(targetImg)) &&
                    this.elDisplay(selector(bgImg)) &&
                    this.elDisplay(selector(moveItem))
                ) {
                    const target_url =
                        selector(targetImg).getAttribute("src") ||
                        getStyle(selector(targetImg))["background-image"].split('"')[1];
                    const bg_url =
                        selector(bgImg).getAttribute("src") ||
                        getStyle(selector(bgImg))["background-image"].split('"')[1];
                    if (!this.hasRequest(target_url, { record: true, type: "url" })) {
                        const target_base64 = await this.getImgViaBlob(target_url);
                        const bg_base64 = await this.getImgViaBlob(bg_url);
                        return new Promise(async (resolve, reject) => {
                            let host = location.href;
                            let href = location.href.split("?")[0].split("#")[0];
                            if (self === top) {
                                host = location.host;
                            }
                            let detail = {
                                path: slideCache,
                                host,
                                href,
                            };
                            let formData = new FormData();
                            let requestUrl = routePrefix + "/slideCaptcha";
                            let targetWidth = getNumber(getStyle(selector(targetImg)).width);
                            let bgWidth = getNumber(getStyle(selector(bgImg)).width);
                            formData.append("target_img", this.dataURLtoFile(target_base64));
                            formData.append("bg_img", this.dataURLtoFile(bg_base64));
                            formData.append("targetWidth", targetWidth);
                            formData.append("bgWidth", bgWidth);
                            formData.append("detail", JSON.stringify(detail));
                            GM_xmlhttpRequest({
                                method: "post",
                                url: requestUrl,
                                data: formData,
                                onload: (response) => {
                                    const data = JSON.parse(response.response);
                                    this.moveSideCaptcha(
                                        selector(targetImg),
                                        selector(moveItem),
                                        data.result.target[0]
                                    );
                                    // resolve()
                                },
                                onerror: function (err) {
                                    console.error(err);
                                    reject();
                                },
                            });
                        });
                    }
                }
            };
            check();
            // const interval = 3000;
            // simulateInterval(check, interval);
        }
        moveSideCaptcha(targetImg, moveItem, distance) {
            if (distance === 0) {
                console.log("distance", distance);
                return;
            }
            var btn = moveItem;
            let target = targetImg;

            let varible = null;
            let targetLeft = Number(getStyle(target).left.replace("px", "")) || 0;
            let targetParentLeft =
                Number(getStyle(target.parentNode).left.replace("px", "")) || 0;
            let targetTransform = Number(getEleTransform(target)) || 0;
            let targetParentTransform =
                Number(getEleTransform(target.parentNode)) || 0;

            var mousedown = document.createEvent("MouseEvents");
            var rect = btn.getBoundingClientRect();
            var x = rect.x;
            var y = rect.y;
            mousedown.initMouseEvent(
                "mousedown",
                true,
                true,
                document.defaultView,
                0,
                x,
                y,
                x,
                y,
                false,
                false,
                false,
                false,
                0,
                null
            );
            btn.dispatchEvent(mousedown);

            var dx = 0;
            var dy = 0;
            var interval = setInterval(function () {
                var mousemove = document.createEvent("MouseEvents");
                var _x = x + dx;
                var _y = y + dy;
                mousemove.initMouseEvent(
                    "mousemove",
                    true,
                    true,
                    document.defaultView,
                    0,
                    _x,
                    _y,
                    _x,
                    _y,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                );
                btn.dispatchEvent(mousemove);
                btn.dispatchEvent(mousemove);

                let newTargetLeft =
                    Number(getStyle(target).left.replace("px", "")) || 0;
                let newTargetParentLeft =
                    Number(getStyle(target.parentNode).left.replace("px", "")) || 0;
                let newTargetTransform = Number(getEleTransform(target)) || 0;
                let newTargetParentTransform =
                    Number(getEleTransform(target.parentNode)) || 0;

                if (newTargetLeft !== targetLeft) {
                    varible = newTargetLeft;
                } else if (newTargetParentLeft !== targetParentLeft) {
                    varible = newTargetParentLeft;
                } else if (newTargetTransform !== targetTransform) {
                    varible = newTargetTransform;
                } else if (newTargetParentTransform != targetParentTransform) {
                    varible = newTargetParentTransform;
                }
                if (varible >= distance) {
                    clearInterval(interval);
                    var mouseup = document.createEvent("MouseEvents");
                    mouseup.initMouseEvent(
                        "mouseup",
                        true,
                        true,
                        document.defaultView,
                        0,
                        _x,
                        _y,
                        _x,
                        _y,
                        false,
                        false,
                        false,
                        false,
                        0,
                        null
                    );
                    setTimeout(() => {
                        btn.dispatchEvent(mouseup);
                    }, Math.ceil(Math.random() * 2000));
                } else {
                    if (dx >= distance - 20) {
                        dx += Math.ceil(Math.random() * 2);
                    } else {
                        dx += Math.ceil(Math.random() * 10);
                    }
                    let sign = Math.random() > 0.5 ? -1 : 1;
                    dy += Math.ceil(Math.random() * 3 * sign);
                }
            }, 10);
            setTimeout(() => {
                clearInterval(interval);
            }, 10000);
        }
    }

    function getEleCssPath(el) {
        // 获取元素css path
        if (!(el instanceof Element)) return;
        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += "#" + el.id;
                path.unshift(selector);
                break;
            } else {
                var sib = el,
                    nth = 1;
                while ((sib = sib.previousElementSibling)) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type(" + nth + ")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }

    function handleSlideMenuClick({ isPostmessage } = {}) {
        if (top === self) {
            alert("请点击滑动验证码的大图片，小图片，滑块。");
        }
        this.vue = new Vue();
        this.isIframe = top !== self;
        GM_deleteValue(SLIDE_STORE_KEY);

        let imgs = [...selectorAll("img")];
        let divTags = [...selectorAll("div")];
        imgs.forEach((img) => {
            img.addEventListener("click", onSlideTagClick);
        }, false);
        divTags.forEach((input) => {
            input.addEventListener("click", onSlideTagClick);
        }, false);

        setTimeout(() => {
            imgs.forEach((img) => {
                img && img.removeEventListener("click", onSlideTagClick);
            }, false);
            divTags.forEach((input) => {
                input.removeEventListener("click", onSlideTagClick);
            }, false);
        }, 30000);

        if (!isPostmessage) {
            if (self === top) {
                const iframes = [...selectorAll("iframe")];
                iframes.forEach((iframe) => {
                    iframe.contentWindow.postMessage(
                        {
                            sign: "husky",
                            action: "handleSlideMenuClick",
                        },
                        "*"
                    );
                });
            } else {
                window.postMessage(
                    {
                        sign: "husky",
                        action: "handleSlideMenuClick",
                    },
                    "*"
                );
            }
        }
    }

    let noticeTimer = 0;

    function notice(msg) {
        if (noticeTimer) {
            clearTimeout(noticeTimer);
        } else {
            setTimeout(() => new Vue().$message.success(msg));
        }
        noticeTimer = setTimeout(() => new Vue().$message.success(msg), 1000);
    }

    var onSlideTagClick = (e) => {
        let el = e.target;
        let tagName = el.tagName.toLowerCase();
        let width = Number(getNumber(getStyle(el).width)) || 0;
        const vue = new Vue();
        let height = Number(getNumber(getStyle(el).height)) || 0;
        let position = getStyle(el).position;
        let pathCache =
            (GM_getValue(SLIDE_STORE_KEY) &&
                JSON.parse(GM_getValue(SLIDE_STORE_KEY))) ||
            {};
        if (tagName === "img") {
            if (width >= height && width > 150) {
                let newValue = { ...pathCache, bgImg: getEleCssPath(el) };
                GM_setValue(SLIDE_STORE_KEY, JSON.stringify(newValue));
                pathCache = newValue;
                notice("您已成功选择大图片");
            } else if (width < 100 && height >= width - 5) {
                let newValue = { ...pathCache, targetImg: getEleCssPath(el) };
                GM_setValue(SLIDE_STORE_KEY, JSON.stringify(newValue));
                pathCache = newValue;
                notice("您已成功选择小图片");
            }
        } else {
            let curEl = el;
            for (let i = 0; i < 3; i++) {
                if (!curEl || curEl === Window) {
                    break;
                }
                position = getStyle(curEl).position;
                let bgUrl = getStyle(curEl)["backgroundImage"];
                width = Number(getNumber(getStyle(curEl).width)) || 0;
                height = Number(getNumber(getStyle(curEl).height)) || 0;

                if (position === "absolute" && width < 100 && height < 100) {
                    let newValue = { ...pathCache, moveItem: getEleCssPath(curEl) };
                    GM_setValue(SLIDE_STORE_KEY, JSON.stringify(newValue));
                    pathCache = newValue;
                    notice("您已成功选择滑块");
                    break;
                }
                let reg = /url\("(.+)"\)/im;

                if (bgUrl && bgUrl.match(reg)) {
                    if (width >= height && width > 150) {
                        let newValue = { ...pathCache, bgImg: getEleCssPath(curEl) };
                        GM_setValue(SLIDE_STORE_KEY, JSON.stringify(newValue));
                        pathCache = newValue;
                        notice("您已成功选择大图片");
                        break;
                    } else if (width < 100 && height >= width - 5) {
                        let newValue = { ...pathCache, targetImg: getEleCssPath(curEl) };
                        GM_setValue(SLIDE_STORE_KEY, JSON.stringify(newValue));
                        pathCache = newValue;
                        notice("您已成功选择小图片");
                        break;
                    }
                }
                curEl = curEl.parentNode;
            }

            curEl = el;
            const firstImg = curEl.querySelector("img");
            firstImg && onSlideTagClick({ target: firstImg });
        }

        const finish = Object.keys(pathCache).filter((item) => item).length == 3;
        if (finish) {
            let imgs = [...selectorAll("img")];
            let divTags = [...selectorAll("div")];
            imgs.forEach((img) => {
                img && img.removeEventListener("click", onSlideTagClick);
            }, false);
            divTags.forEach((div) => {
                div.removeEventListener("click", onSlideTagClick);
            }, false);
            setTimeout(() => {
                vue.$message.success("选择完毕，赶快试试吧");
                captchaInstance.doCheckTask();
            }, 3000);
        }
    };

    // GM_registerMenuCommand("手动定位滑动验证码", handleSlideMenuClick);

    function handleClearMenuClick() {
        GM_listValues().forEach((name) => {
            if (name.includes("husky")) {
                GM_deleteValue(name);
            }
        });
    }

    GM_registerMenuCommand("清空所有验证码配置", handleClearMenuClick);

    function cleanCurrentPage() {
        GM_deleteValue(SLIDE_STORE_KEY);
        GM_deleteValue(NORMAL_STORE_KEY);
    }
    GM_registerMenuCommand("清空当前页面验证码配置", cleanCurrentPage);

    let blackListMenuId = null;

    function blackListCheck() {
        let key = location.host + location.pathname + "_black";
        let data = GM_getValue(key) && JSON.parse(GM_getValue(key));
        if (blackListMenuId) {
            GM_unregisterMenuCommand(blackListMenuId);
        }
        if (data) {
            blackListMenuId = GM_registerMenuCommand(
                "标记当前网站有验证码",
                labelWebsite
            );
        } else {
            blackListMenuId = GM_registerMenuCommand(
                "标记当前网站没有验证码",
                labelWebsite
            );
        }
        return data;
    }

    function labelWebsite() {
        let key = location.host + location.pathname + "_black";
        let data = GM_getValue(key) && JSON.parse(GM_getValue(key));
        if (data) {
            GM_setValue(key, "false");
        } else {
            GM_setValue(key, "true");
        }
        notice(
            "操作成功，" + (data ? "已标记网站有验证码" : "已标记网站没有验证码")
        );
        if (data) {
            captchaInstance = captchaInstance || new Captcha();
            captchaInstance.init();
        }
        blackListCheck();
    }
    blackListCheck();

    var captchaInstance = null;

    function main() {
        window.addEventListener("DOMContentLoaded", function () {
            init();
            captchaInstance = new Captcha();
        });
    }

    const actions = {
        handleSlideMenuClick: handleSlideMenuClick,
    };

    window.addEventListener(
        "message",
        (event) => {
            const { data = {} } = event || {};
            const { sign, action } = data;
            if (sign === "husky") {
                if (action && actions[action]) {
                    actions[action]({ isPostmessage: true });
                }
            }
        },
        false
    );
    main();
})();
