// ==UserScript==
// @name         B端及中控台管理一些操作
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  B端管理台中跳转、添加讲师、进入中控台等操作
// @author       You
// @match        https://admin.xiaoe-tech.com/*
// @match        https://*/p/t/free/v1/live/live_sales/sales*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498818/B%E7%AB%AF%E5%8F%8A%E4%B8%AD%E6%8E%A7%E5%8F%B0%E7%AE%A1%E7%90%86%E4%B8%80%E4%BA%9B%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/498818/B%E7%AB%AF%E5%8F%8A%E4%B8%AD%E6%8E%A7%E5%8F%B0%E7%AE%A1%E7%90%86%E4%B8%80%E4%BA%9B%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    "use strict";
    function debounce(func, wait) {
        if (wait === void 0) {
            wait = 200;
        }
        var timeout;
        return function() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            clearTimeout(timeout);
            timeout = setTimeout((function() {
                func.apply(_this, args);
            }), wait);
        };
    }
    var addToastStyles = function() {
        var style = document.createElement("style");
        style.innerHTML = "\n    .gm-toast {\n      position: fixed;\n      top: 0;\n      left: 50%;\n      transform: translateX(-50%);\n      background-color: rgba(0, 0, 0, 0.7);\n      color: #fff;\n      padding: 10px 20px;\n      border-radius: 5px;\n      font-size: 14px;\n      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);\n      z-index: 9999;\n      opacity: 0;\n      white-space: nowrap;\n      transition: all 0.3s ease, transform 0.3s ease;\n    }\n    .gm-toast.show {\n      opacity: 1;\n      top: 10vh;\n      transform: translate(-50%, 0);\n    }\n  ";
        document.head.appendChild(style);
    };
    var showToast = function(message, duration) {
        if (duration === void 0) {
            duration = 3e3;
        }
        var toast = document.createElement("div");
        toast.className = "gm-toast";
        toast.textContent = message;
        document.body.appendChild(toast);
        window.getComputedStyle(toast).opacity;
        toast.classList.add("show");
        setTimeout((function() {
            toast.classList.remove("show");
            setTimeout((function() {
                toast.remove();
            }), 300);
        }), duration);
    };
    addToastStyles();
    var getRandomColor = function() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    var openUrl = function(url, isOpen) {
        if (!isOpen) {
            location.href = url;
        } else {
            open(url);
        }
    };
    var AddHtml = function(_a, cb) {
        var obj_arr = _a.obj_arr, html = _a.html, style = _a.style, item_html = _a.item_html, all_item_html = _a.all_item_html;
        if (cb === void 0) {
            cb = function() {};
        }
        var show_html = html, html_box_style = style, btn_box_style = "", all_html = "";
        for (var i = 0; i < obj_arr.length; i++) {
            all_html += '\n        <div id="item-'.concat(i, '" class="label-div" style="background-color:').concat(getRandomColor(), '"">').concat(obj_arr[i].name, "\n            <div>").concat(obj_arr[i].name, "</div>\n        </div>\n\n        ");
            var color = getRandomColor();
            btn_box_style += "\n    .show-div #item-".concat(i, " div {\n        background: linear-gradient(to right, ").concat(color, ", ").concat(color, ") no-repeat left center;\n        background-size: 0 100%;\n    }\n    ");
        }
        if (all_item_html) {
            all_html = all_item_html;
        }
        if (item_html) {
            all_html += item_html;
        }
        if (!show_html) {
            show_html = '\n            <div class="show-div">\n                ctrl+enter\n                <div id="show-btn" style="background-color:'.concat(getRandomColor(), '">open</div>\n                <div id="show-box">\n                    ').concat(all_html, "\n                </div>\n            </div>\n        ");
        }
        var html_style = document.createElement("style");
        html_style.innerHTML = "\n        .show-div {\n            font-size: 20px;\n            position: fixed;\n            bottom: 66px;\n            right: 16px;\n            z-index: 200000;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            font-size: 12px;\n        }\n        .show-div #show-btn {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            color: white;\n            font-size: 12px;\n            width: 50px;\n            height: 24px;\n            cursor: pointer;\n            margin-bottom: 12px;\n            border-radius: 8px\n        }\n        .show-div #show-box {\n            display: none;\n            flex-direction: column;\n            max-height: 500px;\n            overflow-y: overlay;\n        }\n        .show-div .label-div {\n            display: inline-flex;\n            flex-direction: column;\n            justify-content: center;\n            align-items: center;\n            padding: 6px;\n            color: white;\n            min-width: 72px;\n            min-height: 48px;\n            border-radius: 12px;\n            text-decoration: none;\n            margin-bottom: 12px;\n            cursor: pointer;\n            overflow: hidden;\n            position: relative;\n        }\n        .show-div .label-div div {\n            position: absolute;\n            top: 0;\n            left: 0;\n            right: 0;\n            bottom: 0;\n            display: inline-flex;\n            flex-direction: column;\n            justify-content: center;\n            align-items: center;\n            transition: all 1s;\n            background-size: 0% 100%;\n            background-position-x: left;\n        }\n        ".concat(btn_box_style, "\n        .show-div #show-box .label-div div:hover {\n            -webkit-animation: btnAnimation 1s infinite;\n        }\n        @-webkit-keyframes btnAnimation{\n            0%{\n              background-size: 0% 100%;\n              background-position-x: left;\n            }\n            49.9%{\n              background-size: 100% 100%;\n              background-position-x: left;\n            }\n            50%{\n              background-size: 100% 100%;\n              background-position-x: right;\n            }\n            99.9%{\n              background-size: 0% 100%;\n              background-position-x: right;\n            }\n            100%{\n              background-size: 0% 100%;\n              background-position-x: left;\n            }\n        }\n        /* 滚动条 */\n        .show-div ::-webkit-scrollbar {\n            width: 6px !important;\n            height: 6px !important;\n            background-color: rgba(0,0,0,0) !important;\n        }\n    \n        .show-div :hover::-webkit-scrollbar-thumb {\n            border-radius:3px !important;\n            background-color: #E5E5E5 !important;\n            transition: all .4s ease !important;\n            -moz-transition: all .4s ease !important;\n            -webkit-transition: all .4s ease !important;\n            -o-transition: all .4s ease !important;\n        }\n    \n        .show-div ::-webkit-scrollbar-thumb:hover {\n            border-radius: 3px !important;\n            background-color: #999999 !important;\n            transition: all .4s ease !important;\n            -moz-transition: all .4s ease !important;\n            -webkit-transition: all .4s ease !important;\n            -o-transition: all .4s ease !important;\n        }\n    ");
        html_style.innerHTML += html_box_style;
        var html_show_status = false;
        document.head.appendChild(html_style);
        document.body.insertAdjacentHTML("afterbegin", show_html);
        if (!all_item_html) {
            var btn_dom_1 = document.getElementById("show-btn");
            var scroll_dom_1 = document.getElementById("show-box");
            var handlerFun_1 = function() {
                html_show_status = !html_show_status;
                scroll_dom_1.style.display = html_show_status === true ? "flex" : "none";
                btn_dom_1.innerHTML = html_show_status === true ? "close" : "open";
            };
            document.body.addEventListener("keydown", (function(event) {
                if (event.ctrlKey && event.key === "Enter") {
                    handlerFun_1();
                }
            }));
            btn_dom_1.addEventListener("click", handlerFun_1);
        }
        setTimeout((function() {
            if (!all_item_html || item_html) {
                var _loop_1 = function(i) {
                    if (obj_arr[i].path) {
                        document.getElementById("item-".concat(i)).addEventListener("click", (function() {
                            openUrl(obj_arr[i].path, obj_arr[i].open);
                        }));
                    }
                };
                for (var i = 0; i < obj_arr.length; i++) {
                    _loop_1(i);
                }
            }
            cb();
        }), 50);
    };
    var insertCSS = function(cssStyle) {
        var style = document.createElement("style");
        var theHead = document.head || document.getElementsByTagName("head")[0];
        style.appendChild(document.createTextNode(cssStyle));
        theHead.appendChild(style);
    };
    var getFormData = function(target, targetKey) {
        var formData = new FormData;
        if (Array.isArray(target)) {
            target.forEach((function(item, index) {
                Object.entries(item).forEach((function(_a) {
                    var key = _a[0], value = _a[1];
                    if (Array.isArray(value)) {
                        value.forEach((function(subValue, subIndex) {
                            formData.append("".concat(targetKey, "[").concat(index, "][").concat(key, "][").concat(subIndex, "]"), subValue);
                        }));
                    } else if (value instanceof Object && !(value instanceof File)) {
                        formData.append("".concat(targetKey, "[").concat(index, "][").concat(key, "]"), JSON.stringify(value));
                    } else {
                        formData.append("".concat(targetKey, "[").concat(index, "][").concat(key, "]"), value);
                    }
                }));
            }));
        } else {
            Object.entries(target).forEach((function(_a) {
                var key = _a[0], value = _a[1];
                formData.append(key, value);
            }));
        }
        return formData;
    };
    var requestMethod = function(url, params, method, headers) {
        if (url === void 0) {
            url = "";
        }
        if (params === void 0) {
            params = {};
        }
        if (method === void 0) {
            method = "POST";
        }
        if (headers === void 0) {
            headers = {
                "Content-Type": "application/json"
            };
        }
        return new Promise((function(resolve, reject) {
            fetch(url, {
                method: method,
                headers: headers,
                body: params
            }).then((function(response) {
                return response.json();
            })).then((function(data) {
                resolve(data);
                console.error("POST 请求成功:", data);
            })).catch((function(error) {
                reject(error);
                console.error("POST 请求失败:", error);
            }));
        }));
    };
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
    var toast = debounce(showToast, 200);
    var app_id = window.__app_id || window.APPID || "";
    var url = window.location.href;
    var liveId = "";
    var obj_arr = [ {
        name: "账号设置",
        path: "https://admin.xiaoe-tech.com/t/account_auth#/accountDetail?page_type=0"
    }, {
        name: "店铺中控台",
        path: "https://".concat(app_id, ".h5.xiaoeknow.com/p/t/free/v1/live/live_sales/sales"),
        open: true
    }, {
        name: "获取b端验证码",
        path: "https://ops.xiaoe-tools.com/#/log/index?deploy_env=pro&provider=volce&topicId=d91bfc08-adb6-4a71-b741-e8d2eb7dac00&query=params%3A%22content%22%20AND%20%28NOT%20target_url%3A%22xe.Ucloud.sms.record.get%22%20AND%20params%3A%2213388888888%22%29&time=now-10m,now",
        open: true
    } ];
    var input_arr = [ {
        name: "进入中控台详情",
        path: "https://".concat(app_id, ".h5.xiaoeknow.com/p/t/free/v1/live/live_sales/sales#/detail?id=live_id")
    }, {
        name: "进入直播详情",
        path: "https://admin.xiaoe-tech.com/t/live#/detail?id=live_id&tab=basicInfo"
    } ];
    var getShowItem = function() {
        if (url.includes("admin") && url.includes("/live") && url.includes("id=")) {
            liveId = url.match(/[?&]id=(l_.*?)(&|$)/)[1];
            var salesItem = {
                name: "当前中控台直播间",
                path: "https://".concat(app_id, ".h5.xiaoeknow.com/p/t/free/v1/live/live_sales/sales#/detail?id=").concat(liveId),
                open: true
            };
            obj_arr.push(salesItem);
            var guestItem = [ {
                name: "添加讲师",
                type: "addGuest"
            }, {
                name: "移除讲师",
                type: "deleteGuest"
            } ];
            input_arr.push.apply(input_arr, guestItem);
        }
    };
    getShowItem();
    var item_html = "";
    for (var i = 0; i < input_arr.length; i++) {
        item_html += '\n    <div id="input-box-item-'.concat(i, '" class="label-div" style="background-color:').concat(getRandomColor(), '"">\n        ').concat(input_arr[i].name, '\n        <input id="input-item-').concat(i, '" class="label-input" placeholder="请输入').concat(input_arr[i].name.slice(2)).concat(input_arr[i].type ? "讲师昵称" : "ID", '" />\n    </div>\n\n    ');
    }
    var style = "\n    .label-input {\n        width: 228px;\n        margin-top: 4px;\n        height: 32px;\n        padding: 0 8px;\n        border: 1px solid #e5e5e5;\n        border-radius: 5px;\n        font-size: 14px;\n        color: #333;\n        outline: none;\n        box-sizing: border-box;\n    }\n";
    var addGuest = function(searchName) {
        var getParams = getFormData({
            alive_id: liveId,
            search: searchName,
            page: "1"
        });
        requestMethod("https://admin.xiaoe-tech.com/alive_b/get_all_guest_list", getParams, "POST", {}).then((function(res) {
            var code = res.code, searchData = res.data, msg = res.msg;
            if (code === 0 && searchData.length > 0) {
                var getGuestParams = getFormData({
                    id: liveId
                });
                requestMethod("https://admin.xiaoe-tech.com/alive_b/get_added_guest_list", getGuestParams, "POST", {}).then((function(res) {
                    var code = res.code, addedData = res.data, msg = res.msg;
                    if (code === 0) {
                        var searchGuestData = searchData.map((function(item) {
                            var user_id = item.user_id, phone = item.phone, comment_name = item.comment_name, wx_nickname = item.wx_nickname;
                            return {
                                alive_id: liveId,
                                role_name: "讲师",
                                user_name: wx_nickname,
                                comment_name: comment_name,
                                user_id: user_id,
                                is_can_exceptional: 1,
                                role_type: 1,
                                phone: phone,
                                is_send_red_packet: 0,
                                red_packet_amount: 0
                            };
                        }));
                        addedData.push.apply(addedData, searchGuestData);
                        var addedParams = getFormData(addedData, "params");
                        addedParams.append("alive_id", liveId);
                        requestMethod("https://admin.xiaoe-tech.com/alive_b/save_added_guest", addedParams, "POST", {}).then((function(res) {
                            var code = res.code, msg = res.msg;
                            if (code === 0) {
                                showToast("添加成功");
                            } else {
                                showToast(msg || "添加失败");
                            }
                        }));
                    } else {
                        showToast(msg || "获取已添加讲师列表失败");
                    }
                }));
            } else {
                showToast(msg || searchData.length === 0 ? "店铺无该讲师，请自行邀请" : "获取讲师列表失败");
            }
        }));
    };
    var deleteGuest = function(searchName) {
        var getParams = getFormData({
            id: liveId
        });
        requestMethod("https://admin.xiaoe-tech.com/alive_b/get_added_guest_list", getParams, "POST", {}).then((function(res) {
            var code = res.code, searchData = res.data, msg = res.msg;
            if (code === 0) {
                var deleteList = searchData.filter((function(item) {
                    return item.user_name.includes(searchName);
                }));
                if (deleteList.length === 0) showToast("该直播间没有相关讲师可进行移除");
                deleteList.forEach((function(item, index) {
                    var user_id = item.user_id, id = item.id;
                    var getGuestParams = getFormData({
                        token: id,
                        alive_id: liveId,
                        user_id: user_id
                    });
                    requestMethod("https://admin.xiaoe-tech.com/alive_b/delete_added_guest", getGuestParams, "POST", {}).then((function(res) {
                        var code = res.code, msg = res.msg;
                        if (code === 0) {
                            toast("移除成功");
                        } else {
                            showToast(msg || "移除失败");
                        }
                    }));
                }));
            } else {
                showToast(msg || "获取讲师列表失败");
            }
        }));
    };
    var cb = function() {
        var _a;
        var handlerFunc = function(e, itemDom, arrItem) {
            if (e instanceof KeyboardEvent) {
                if (e.key && e.key !== "Enter") return;
            }
            if (arrItem.type === "addGuest") {
                addGuest(itemDom.value);
            } else if (arrItem.type === "deleteGuest") {
                deleteGuest(itemDom.value);
            } else {
                if (itemDom.value.length <= 16) {
                    alert("请输入正确的直播间ID");
                    return;
                }
                var url_1 = arrItem.path.replace(/live_id/g, itemDom.value);
                open(url_1);
            }
        };
        var _loop_1 = function(i) {
            var itemDom = document.getElementById("input-item-".concat(i));
            var btnDom = document.getElementById("input-box-item-".concat(i));
            if ((_a = input_arr[i].type) === null || _a === void 0 ? void 0 : _a.includes("Guest")) {
                itemDom.value = "羽仔";
            }
            itemDom.addEventListener("keydown", (function(e) {
                handlerFunc(e, itemDom, input_arr[i]);
            }));
            itemDom.addEventListener("click", (function(e) {
                e.stopPropagation();
            }));
            btnDom.addEventListener("click", (function(e) {
                handlerFunc(e, itemDom, input_arr[i]);
            }));
        };
        for (var i = 0; i < input_arr.length; i++) {
            _loop_1(i);
        }
    };
    AddHtml({
        obj_arr: obj_arr,
        item_html: item_html,
        style: style
    }, cb);
    addXMLRequestCallback("https://captcha.xiaoeknow.com", "/api/get_sms_code", (function(xhr) {
        var arrItem = obj_arr.find((function(item) {
            return item.name === "获取b端验证码";
        }));
        arrItem.path = arrItem.path.replace(/13388888888/g, JSON.parse(xhr.requestBody).phone);
    }));
})();