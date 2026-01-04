// ==UserScript==
// @name            B 站网页端直播
// @namespace       ProgramRipper
// @version         0.2.0
// @author          ProgramRipper
// @license         MIT
// @description     在 B 站网页端开播
// @homepage        https://github.com/ProgramRipper/BLiveWeb
// @icon            https://www.bilibili.com/favicon.ico
// @supportURL      https://github.com/ProgramRipper/BLiveWeb/issues
// @match           *://link.bilibili.com/p/center/index
// @connect         api.live.bilibili.com
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/476537/B%20%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/476537/B%20%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==
/* eslint-disable */ /* spell-checker: disable */
// @[ You can find all source codes in GitHub repo ]
var originOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    var _this = this;
    var _a;
    if (async === void 0) { async = true; }
    if (user === void 0) { user = null; }
    if (password === void 0) { password = null; }
    var _b = new URL(url.startsWith("//") ? "https:" + url : url), host = _b.host, pathname = _b.pathname;
    switch (method) {
        case "GET":
            if (host === "api.live.bilibili.com" &&
                pathname === "/xlive/app-blink/v1/live/GetWebLivePermission") {
                var getter_1 = (_a = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "responseText")) === null || _a === void 0 ? void 0 : _a.get;
                Object.defineProperty(this, "responseText", {
                    get: function () {
                        var resp = JSON.parse(getter_1 === null || getter_1 === void 0 ? void 0 : getter_1.call(this));
                        resp.data.allow_live = true;
                        return JSON.stringify(resp);
                    },
                });
            }
            break;
        case "POST":
            if (host === "api.live.bilibili.com" &&
                pathname === "/room/v1/Room/startLive") {
                this.send = function (body) {
                    var searchParams = new URLSearchParams(body);
                    searchParams.set("platform", "ios");
                    XMLHttpRequest.prototype.send.call(_this, searchParams.toString());
                };
            }
            break;
    }
    originOpen.call(this, method, url, async, user, password);
};
