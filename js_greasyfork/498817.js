// ==UserScript==
// @license MIT
// @name         b端复制打开某个直播链接
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  小鹅管理台直播列表复制链接——勿外传
// @author       You
// @match        https://admin.xiaoe-tech.com/t/live*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498817/b%E7%AB%AF%E5%A4%8D%E5%88%B6%E6%89%93%E5%BC%80%E6%9F%90%E4%B8%AA%E7%9B%B4%E6%92%AD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/498817/b%E7%AB%AF%E5%A4%8D%E5%88%B6%E6%89%93%E5%BC%80%E6%9F%90%E4%B8%AA%E7%9B%B4%E6%92%AD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
    "use strict";
    var sendCallback = function(xhr, domain, requestUrl, cb) {
        if (domain === void 0) {
            domain = "";
        }
        if (requestUrl === void 0) {
            requestUrl = "";
        }
        if (cb === void 0) {
            cb = function() {};
        }
        xhr.addEventListener("load", (function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var url = xhr.responseURL.split(domain)[1];
                var routerUrl = (url === null || url === void 0 ? void 0 : url.includes("?")) ? url.split("?")[0] : url;
                switch (routerUrl) {
                  case requestUrl:
                    cb(xhr);
                    break;

                  default:
                    break;
                }
            }
        }));
        xhr.addEventListener("progress", (function() {}));
    };
    var xhrCallbacks = null;
    var addXMLRequestCallback = function(domain, requestUrl, cb) {
        if (domain === void 0) {
            domain = "";
        }
        if (requestUrl === void 0) {
            requestUrl = "";
        }
        if (cb === void 0) {
            cb = function() {};
        }
        xhrCallbacks = function(xhr) {
            sendCallback(xhr, domain, requestUrl, cb);
        };
        var oldSend = function() {};
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            this.requestBody = body;
            if (xhrCallbacks) {
                xhrCallbacks(this);
            }
            oldSend.apply(this, arguments);
        };
    };
    function getShareBtn(data, isDetail) {
        var htmlStyle = document.createElement("style");
        htmlStyle.innerHTML = "\n            .script-share-btn {\n                display: flex;\n                justify-content: center;\n                align-items: center;\n                height: 22px;\n                padding: 0 4px;\n                border-radius: 4px;\n                color: white;\n                background-color: rgb(240 181 103 / 70%);\n                position: absolute;\n                left: 0;\n                top: 0;\n                font-size: 12px;\n                cursor: pointer;\n                z-index: 2000;\n            }\n            .open-btn {\n                top: 24px;\n            }\n        ";
        document.head.appendChild(htmlStyle);
        setTimeout((function() {
            var handlerFunc = function(data, index, name) {
                var copyBtnBox = '<div id="copy-btn-'.concat(index, '" class="script-share-btn">H5复制链接</div>');
                var openBtnBox = '<div id="open-btn-'.concat(index, '" class="script-share-btn open-btn">H5打开链接</div>');
                var shareUrl = "https://".concat(data.app_id, ".h5.xiaoeknow.com/v2/course/alive/").concat(data.id, "?app_id=").concat(data.app_id, "&alive_mode=").concat(data.alive_mode, "&pro_id=&type=2");
                var parentDom = document.getElementsByClassName(name)[index];
                parentDom.style.position = "relative";
                parentDom.insertAdjacentHTML("afterbegin", copyBtnBox);
                parentDom.insertAdjacentHTML("afterbegin", openBtnBox);
                var copyBtnDom = document.getElementById("copy-btn-".concat(index));
                var openBtnDom = document.getElementById("open-btn-".concat(index));
                copyBtnDom.addEventListener("click", (function() {
                    navigator.clipboard.writeText(shareUrl);
                    copyBtnDom.innerHTML = "H5复制成功";
                    setTimeout((function() {
                        copyBtnDom.innerHTML = "H5复制链接";
                    }), 1e3);
                }));
                openBtnDom.addEventListener("click", (function() {
                    open(shareUrl);
                }));
            };
            if (isDetail) {
                Object.assign(data, {
                    app_id: window.__app_id
                });
                handlerFunc(data, 0, "header-left-area");
            } else {
                for (var i = 0; i < data.length; i++) {
                    handlerFunc(data[i], i + data.length, "infoImgOptionsNew");
                }
            }
        }), 1e3);
    }
    var isDetail = window.location.href.includes("id");
    var domain = "https://admin.xiaoe-tech.com";
    var requestUrl = isDetail ? "/alive_b/alive_rough_info" : "/xe.live.bff_b/manage/list/1.0.0";
    addXMLRequestCallback(domain, requestUrl, (function(xhr) {
        var _a = JSON.parse(xhr.response), code = _a.code, data = _a.data;
        if (code === 0) {
            getShareBtn(isDetail ? data : data.live_list, isDetail);
        }
    }));
})();