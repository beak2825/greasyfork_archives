"use strict";
// ==UserScript==
// @name         comic cache
// @namespace    http://tampermonkey.net/
// @version      2021.05.21.1
// @description  缓存图片
// @author       You
// @match        *://boylove.cc/home/book/capter/id/*
// @match        *://boylove.house/home/book/capter/id/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @webRequest   [{"selector": "*.cnzz.*", "action": "cancel"}, {"selector":"https://www.googletagmanager.com/*","action":"cancel"}]
// @run-at       document-start
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4VlNKuJZTo7sXE/U3FhO8txYTfLpXE/U21dNjttZTSoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/gFUG7l1PlOFaTvzoW0//7V1Q/91YTf/kWk7/7FxP/91YTf/lW0/86l1PlP+AVQYAAAAAAAAAAAAAAAD/gFUG6FxOvMBQR/+4TUb/vk9H/75PR/+1TUX/wlFI/+JaTf+3TUb/vE9H/7xPRv/NVEq8/4BVBgAAAAAAAAAA9V9TlONuZP/39PT/wq+w/5hXVP/Nubr/9/T0/9bKy//Yzc3/9/T0/97U1P+XcnP/s0xG/+9dUZQAAAAA/2VTKvNfUfzuZVf//////9XJyf+aREH/t3l2/+vl5f//////9PHx//Xy8v+KZ2n/tExG/+hbT//0X1L8819TKvNfUI72YFL/919S//n39//k3Nz/jGlq/8i3uP/It7j/xrW2/72pqv/8+/v//////6yTlP++T0f/9F5R/+9fUI7zYFHU+WFS//dfUv/t5eX/8u/v/4xqa//DsbL/w7Gy/8Oxsv/DsbL/w7Gy/8Oxsv+fgoP/tU1G//ZgUv/vXVDU+F9T8vpgUv/3X1L/r4WE/6qQkf+liYr/8u7u/9jMzP/t6Oj/3NHS/+rk5f/f1db/0MLC/7FLRf/3X1L/7l1R8vphU/L8YVP/+GBR//Lt7f/r5eX/pYmK/+rk5P/Brq//49ra/8e2t//e1dX/y7y9/8/Bwf+yTEX/919S//NeUvL7YVPU/GJT/+1oXP//////zsDB/5RcWv/IuLn/yLi5/8i4uf/IuLn/yLi5/8i4uf+XeHn/w1BI//ZfUf/4YFPU/2JUjvxiU//nX1P/p4mJ/5d4ef+dVVH//////+nj4/+ihYf/ooWH/87Awf//////m31//+dbT//2YFL//WJUjv9lUyr/Y1T8+2FT//v6+v/e1dX/nlRS///////v6+v/vKip/7yoqf/c0tP//////5t9f//oW07/+mFT/P9lUyoAAAAA/2JUlOxyZv//////x7a2/7RZVP/v6+v/6eLi/9THyP/Ux8j/4djZ/+/r6/+VdXf/6FtO//1iVJQAAAAAAAAAAP+AVQbwXlG8wVBH/8FQR//nW07/0VRL/9FUS//RVEv/0FRL/85US//PVEr/0FRL//hhUrz/gFUGAAAAAAAAAAAAAAAA/4BVBv9iVJT/Y1T8/2JT//9iU///YlP//2JT//9iU///YlP//2NU/P9iVJT/gFUGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/2VTKv9iVI7/YlTU/2NU8v9jVPL/YlTU/2JUjv9lUyoAAAAAAAAAAAAAAAAAAAAA+B8AAOAHAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAgAEAAMADAADgBwAA+B8AAA==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/423114/comic%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/423114/comic%20cache.meta.js
// ==/UserScript==
const host = "http://192.168.5.191";
const get_file = "/get_file";
const exist_file = "/file_exist";
const urlHash = {
    boylove_cc: [
        "boylove.cc/home/book/capter/id",
        "boylove.house/home/book/capter/id"
    ]
};
class boylove_cc {
    constructor(base64, load_now) {
        this.path = "BoyLove";
        this.get_file = `${get_file}?path=${this.path}&url=`;
        this.exist_file = `${exist_file}?path=${this.path}&url=`;
        this.base64 = false;
        this.load_now = false;
        this.base64 = base64;
        this.load_now = load_now;
    }
    replace_url() {
        const this_ = this;
        document.querySelectorAll(".lazy").forEach(
        // @ts-ignore
        function (value, key) {
            let url = value.getAttribute("data-original") || "";
            if (!url || equal_data_url(url) == true) {
                return;
            }
            url = window.location.origin + url;
            if (judge_url(url) == true && url.indexOf(host) == -1) {
                // 将图片换为加载图，由脚本统一加载图片
                value.setAttribute("data-original", "/static/images/load.png");
                value.src = "/static/images/load.png";
                if (this_.base64 == false) {
                    let r_url = `${host}${this_.get_file}${encodeURIComponent(url)}`;
                    value.setAttribute("data-original", url);
                    value.src = r_url;
                }
                else {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${host}${this_.get_file}${encodeURIComponent(url)}&b64=1`,
                        onload: function (resp) {
                            value.setAttribute("data-original", resp.responseText);
                            value.src = resp.responseText;
                        }
                    });
                }
            }
        });
    }
    request_file() {
        const this_ = this;
        document.querySelectorAll(".lazy").forEach(
        // @ts-ignore
        function (value, key) {
            let url = value.getAttribute("data-original") || "";
            if (!url || equal_data_url(url) == true) {
                return;
            }
            url = window.location.origin + url;
            if (judge_url(url) == true && url.indexOf(host) == -1) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${host}${this_.exist_file}${encodeURIComponent(url)}`
                });
            }
        });
    }
}
function judge_url(url) {
    // 判断是否URL
    url = url || '';
    try {
        new URL(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
function equal_url(urls) {
    let u = window.location.href;
    for (let i of urls) {
        if (u.indexOf(i) != -1) {
            return true;
        }
    }
    return false;
}
// 用于判断数据是否是 data base64 ，依据是开头前5个字符 data:
function equal_data_url(data) {
    return data.slice(0, 5) == "data:";
}
if (equal_url(urlHash.boylove_cc)) {
    let blc = new boylove_cc(true, true);
    document.addEventListener('DOMContentLoaded', function () {
        blc.request_file();
        blc.replace_url();
    }, false);
}
