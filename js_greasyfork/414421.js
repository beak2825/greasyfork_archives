"use strict";
// ==UserScript==
// @name         波乐脚本
// @namespace    http://tampermonkey.net/
// @version      2021.04.17
// @description  去除广告、缓存图片
// @author       You
// @match        *.bmhl.xyz/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @webRequest   [{"selector": "*.200ps.com:10016/*", "action": "cancel"}, {"selector": "*.cnzz.*", "action": "cancel"}, {"selector": "*.adfangxiang.*", "action": "cancel"}, {"selector":"https://ads.*.xyz/*","action":"cancel"}, {"selector":"https://www.google-analytics.com/*","action":"cancel"}, {"selector":"https://www.googletagmanager.com/*","action":"cancel"}]
// @run-at       document-start
// @icon         data:image/x-icon;base64,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
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @connect      yobl.xyz
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/414421/%E6%B3%A2%E4%B9%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/414421/%E6%B3%A2%E4%B9%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/*
2021.04.17 去广告功能合并到另一个脚本，所以这个脚本不具有去广告功能，不过只是简单注释
webRequest 用于禁止相应url资源的加载
2021.03.06 合并 去广告脚本 及 图片缓存脚本
2021.03.05 网站更改域名，由于各脚本版本混乱，不知道哪个脚本是最新的，导致错误更新图片缓存脚本，无法正常使用*/
const Always_Replace = true; // 总是替换图片地址，无论图片是否正常加载
const Upload_Image = false; // 上传图片
const Exist_Image = true; // 判断图片
const Base64_Image = true; // 替换时不使用 url ，而使用 base64 作为 src
// @ts-ignore
const _self = unsafeWindow;
// @ts-ignore
const $ = window.jQuery;
// @ts-ignore
_self.$_ = $;
const server_host = "http://192.168.5.191";
const path = "Bole";
const get_img = '/get_file?path=' + path + '&url=';
const judge_path = "/file_exist";
const upload_path = "/upload";
const status_path = "/status";
// (function () {
//     'use strict';
//     /*
//     2020.04.14 去除 开通VIP无广告 元素，取消图片预加载功能
//     */
//     /*
//     .: 选择class
//     #: 选择id
//     */
//     GM_addStyle('#b13223,#index_content_ad,#index_aside,#aside_cat_ad_bottom,#cat_intro_first_ad,#cat_intro_second_ad,#adDisabledBtn {display: none!important;}');
//     GM_addStyle('qq,ins {display: none!important;}');
//     GM_addStyle('.interstitial_ad,.vertical_mobile_ad,.appdownload_ad {display: none!important;}');
//     document.addEventListener('DOMContentLoaded', (event) => {
//         var scripts = document.scripts;
//         for (let d = 0; d < scripts.length; d++) {
//             if (/analytics.js|asyncjs.php|googletagmanager/.test(scripts[d].src) == true) {
//                 let pN = scripts[d].parentNode;
//                 if (pN) {
//                     pN.removeChild(scripts[d]);
//                 }
//             }
//         }
//         var a = document.querySelectorAll('a');
//         for (let b = 0; b < a.length; b++) {
//             if (a[b].text == '继续阅读') {
//                 window.location.reload()
//             }
//         }
//         var vertical_mobile_ad = document.querySelectorAll('div[id="dtad"],div[class="vertical_mobile_ad"],div[class="appdownload_ad"],qq,ins,div[id="adDisabledBtn"]');
//         for (let c = 0; c < vertical_mobile_ad.length; c++) {
//             let pN = vertical_mobile_ad[c].parentNode;
//             if (pN) {
//                 pN.removeChild(vertical_mobile_ad[c]);
//             }
//         }
//     });
// })();
(function () {
    // 替换图片
    $(function () {
        let reader_wrapper = document.getElementById('reader_wrapper');
        if (reader_wrapper !== null) {
            // 先遍历图片元素，把已经加载的替换掉
            // 再使用 MutationObserver 监控元素变化
            reader_wrapper.querySelectorAll(".comic_canvas [type='image']").forEach(
            // @ts-ignore
            (ele, index) => {
                let url = ele.src;
                if (url === window.location.href) {
                    // src 为空，未加载，监听元素
                    let observer = new MutationObserver(function (mutationList, observer) {
                        mutationList.forEach((mutation) => {
                            switch (mutation.type) {
                                case "attributes":
                                    // @ts-ignore
                                    let target = mutation.target;
                                    let attrName = mutation.attributeName;
                                    let src = target.src;
                                    if (attrName != "src") {
                                        return;
                                    }
                                    observer.disconnect();
                                    if (judge_url(src) === false) {
                                        return;
                                    }
                                    if (src.indexOf(server_host) != -1 || src == location.href) {
                                        return;
                                    }
                                    replace_url(src, ele);
                            }
                        });
                    });
                    let observerOptions = {
                        attributes: true,
                        subtree: true
                    };
                    observer.observe(ele, observerOptions);
                }
                else {
                    // src 为图片地址，已加载，替换地址
                    replace_url(url, ele);
                }
            });
        }
    });
    // 判断图片及上传图片
    $(function () {
        // @ts-ignore
        $(_self._pics).each(function (index, value) {
            // @ts-ignore
            if (judge_url(value) === true && Exist_Image === true) {
                // 判断服务器是否已经有图片
                GM_xmlhttpRequest({
                    method: "GET",
                    url: server_host + judge_path + "?path=" + path + "&url=" + encodeURIComponent(value)
                });
            }
        });
    });
})();
function replace_url(url, ele) {
    let src = encodeURIComponent(url);
    if (Base64_Image === true && Always_Replace === true) {
        url = server_host + get_img + src + "&b64=1";
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (resp) {
                if (resp.status == 200) {
                    let base64Data = resp.responseText;
                    ele.src = base64Data;
                }
            }
        });
    }
    else if (Always_Replace === true) {
        url = server_host + get_img + src;
        ele.src = url;
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
