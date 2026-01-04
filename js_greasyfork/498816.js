// ==UserScript==
// @license MIT
// @name         gitlab的常用项目列表
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  小鹅内部直播常用gitlab工程的跳转，勿外传
// @author       You
// @match        https://talkcheap.xiaoeknow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoeknow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498816/gitlab%E7%9A%84%E5%B8%B8%E7%94%A8%E9%A1%B9%E7%9B%AE%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498816/gitlab%E7%9A%84%E5%B8%B8%E7%94%A8%E9%A1%B9%E7%9B%AE%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    "use strict";
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
    var baseUrl = "https://talkcheap.xiaoeknow.com";
    var obj_arr = [ {
        name: "live-h5",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-h5")
    }, {
        name: "live-sales",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-sales")
    }, {
        name: "live-admin",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-admin")
    }, {
        name: "live-admin-next",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-admin-next")
    }, {
        name: "live-pc",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-pc")
    }, {
        name: "live_pc_client",
        path: "".concat(baseUrl, "/AliveDev/live_pc_client")
    }, {
        name: "live-mp",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-mp")
    }, {
        name: "live_room_teacher",
        path: "".concat(baseUrl, "/XiaoeFE/live_room_teacher")
    }, {
        name: "live-client-components-mono",
        path: "".concat(baseUrl, "/AliveDev/live-client-components-mono")
    }, {
        name: "micro_live_analysis",
        path: "".concat(baseUrl, "/dataCenter/micro_live_analysis")
    }, {
        name: "live-c-marketing",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-c-marketing")
    }, {
        name: "live-invite",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-invite")
    }, {
        name: "live-marketing",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-marketing")
    }, {
        name: "live-mp-comp",
        path: "".concat(baseUrl, "/AliveDev/LiveFE/live-mp-comp")
    }, {
        name: "xiaoe_mp_npm",
        path: "".concat(baseUrl, "/XiaoeFE/xiaoe_mp_npm")
    }, {
        name: "data_big_screen",
        path: "".concat(baseUrl, "/dataCenter/DataFe/data_big_screen")
    }, {
        name: "micro_live_analysis",
        path: "".concat(baseUrl, "/dataCenter/micro_live_analysis")
    }, {
        name: "live-admin-marketing-component",
        path: "".concat(baseUrl, "/AliveDev/live-admin-marketing-component")
    }, {
        name: "live_integration_management",
        path: "".concat(baseUrl, "/dataCenter/DataFe/live_integration_management")
    }, {
        name: "live-h5-app-components",
        path: "".concat(baseUrl, "/AliveDev/live-h5-app-components")
    }, {
        name: "data_analysis",
        path: "".concat(baseUrl, "/XiaoeFE/data_analysis")
    } ];
    AddHtml({
        obj_arr: obj_arr
    });
})();