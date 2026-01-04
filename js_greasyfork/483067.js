"use strict";
// ==UserScript==
// @name         69shuba auto 書簽
// @namespace    Paul-16098
// @version      3.3.50.2
// @description  自動書籤,更改css,可以在看書頁找到作者連結
// @author       Paul-16098
// #region mate_match
// #tag 69shux.com
// @match        https://69shux.com/txt/*/*
// @match        https://69shux.com/txt/*/end.html
// @match        https://69shux.com/book/*.htm*
// @match        https://69shux.com/modules/article/bookcase.php
// #tag www.69shu.top
// @match        https://www.69shu.top/txt/*/*
// @match        https://www.69shu.top/txt/*/end.html
// @match        https://www.69shu.top/book/*.htm*
// @match        https://www.69shu.top/modules/article/bookcase.php
// #tag www.69shu.cx
// @match        https://www.69shu.cx/txt/*/*
// @match        https://www.69shu.cx/txt/*/end.html
// @match        https://www.69shu.cx/book/*.htm*
// @match        https://www.69shu.cx/modules/article/bookcase.php
// #tag 69shuba.cx
// @match        https://69shuba.cx/txt/*/*
// @match        https://69shuba.cx/txt/*/end.html
// @match        https://69shuba.cx/book/*.htm*
// @match        https://69shuba.cx/modules/article/bookcase.php
// #tag www.69shuba.pro
// @match        https://www.69shuba.pro/txt/*/*
// @match        https://www.69shuba.pro/txt/*/end.html
// @match        https://www.69shuba.pro/book/*.htm*
// @match        https://www.69shuba.pro/modules/article/bookcase.php
// #endregion mate_match
// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL https://update.greasyfork.org/scripts/483067/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483067/69shuba%20auto%20%E6%9B%B8%E7%B0%BD.meta.js
// ==/UserScript==
/* ==UserConfig==
config:
  is_end_close:
    title: 在結束頁時是否自動關閉
    description: 在結束頁時是否自動關閉
    type: checkbox
    default: true
  is_hook_alert:
    title: 是否劫持alert
    description: 是否劫持alert
    type: checkbox
    default: true
  auto_add_bookcase:
    title: 自動書籤
    description: 自動書籤
    type: checkbox
    default: true
---
debug:
  debug_log:
    title: debug log
    description: debug log
    type: checkbox
    default: false
 ==/UserConfig== */
// https://github.com/scriptscat/scriptcat/issues/264
// ToDo 希望支持// @grant        window.close
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
const debug_log = GM_getValue("debug.debug_log", false);
const is_end_close = GM_getValue("config.is_end_close", true);
const auto_add_bookcase = GM_getValue("config.auto_add_bookcase", true);
const is_hook_alert = GM_getValue("config.is_hook_alert", true);
const hook_alert_blockade = GM_getValue("config.hook_alert_blockade", [
    ["添加成功"],
    ["删除成功!"],
]);
const _unsafeWindow = (_a = unsafeWindow !== null && unsafeWindow !== void 0 ? unsafeWindow : globalThis) !== null && _a !== void 0 ? _a : window; //兼容 ios userscripts 的寫法
let _GM_addStyle;
if (typeof GM_addStyle !== "undefined") {
    _GM_addStyle = GM_addStyle;
}
else if (typeof GM !== "undefined" && typeof GM.addStyle !== "undefined") {
    _GM_addStyle = GM.addStyle;
}
else {
    _GM_addStyle = (cssStr) => {
        let styleEle = document.createElement("style");
        styleEle.classList.add("_GM_addStyle");
        styleEle.innerHTML = cssStr;
        document.head.appendChild(styleEle);
        return styleEle;
    };
}
if (debug_log) {
    console.log("set func remove start");
}
function remove_ele(...args) {
    try {
        if (args && args.length > 0) {
            args.forEach((args) => {
                if (debug_log) {
                    console.log("args: ", args);
                    console.log("document.querySelectorAll(args): ", document.querySelectorAll(args));
                }
                if (document.querySelector(args)) {
                    document.querySelectorAll(args).forEach((ele) => {
                        ele.remove();
                    });
                }
            });
        }
        else {
            throw new Error("fn remove error, args is not a array or args.length =< 0");
        }
    }
    catch (e) {
        console.error(e);
        return [false, args, e];
    }
    return [true, args];
}
if (debug_log) {
    console.log("set func remove end\n", remove_ele);
}
let data = {
    is_69shux: (host = window.location.host) => {
        return host === "69shux.com";
    },
    is_bookshelf: (pathname = window.location.pathname) => {
        return pathname === "/modules/article/bookcase.php";
    },
    book: {
        get_aid: (href = window.location.href) => {
            var _a;
            let aid;
            if (
            // @ts-expect-error
            typeof bookinfo !== "undefined" &&
                // @ts-expect-error
                bookinfo != (undefined || null || void 0)) {
                // @ts-expect-error
                aid = (_a = bookinfo.articleid) !== null && _a !== void 0 ? _a : href.split("/")[4];
            }
            else {
                aid = href.split("/")[4];
            }
            return aid;
        },
        get_cid: (href = window.location.href) => {
            var _a;
            let cid;
            if (
            // @ts-expect-error
            typeof bookinfo !== "undefined" &&
                // @ts-expect-error
                bookinfo != (undefined || null || void 0)) {
                // @ts-expect-error
                cid = (_a = bookinfo.chapterid) !== null && _a !== void 0 ? _a : href.split("/")[5];
            }
            else {
                cid = href.split("/")[5];
            }
            return cid;
        },
        pattern: /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/txt\/[0-9]+\/(?!end)[0-9]+$/gm,
        is: (href = window.location.href) => {
            return data.book.pattern.test(href);
        },
    },
    info: {
        pattern: /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/book\/[0-9]+\.htm$/gm,
        is: (href = window.location.href) => {
            return data.info.pattern.test(href);
        },
    },
    end: {
        pattern: /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/txt\/[0-9]+\/end\.html$/gm,
        is: (href = window.location.href) => {
            return data.end.pattern.test(href) || data.info.pattern.test(href);
        },
    },
    get_next_page_url: (this_pg_url = window.location.href) => {
        let href = "";
        let ele = document.querySelector("div.page1 > a:nth-child(4)");
        if (ele !== (undefined || null)) {
            if (ele.href !== (undefined || null)) {
                href = ele.href;
            }
        }
        else {
            console.error(new Error("網頁未載入完成|the page is not loaded"));
        }
        return href !== null && href !== void 0 ? href : this_pg_url;
    },
    is_next_end: {
        is: () => {
            return data.book.is(data.get_next_page_url()) === false;
        },
    },
};
if (GM_getValue("config.is_hook_alert", true)) {
    // #tag hook_alert
    const _alert = alert;
    _unsafeWindow.alert = (...message) => {
        let blockade = hook_alert_blockade;
        let r = false;
        let n = 0;
        blockade.forEach((blockade_ele) => {
            n++;
            if (JSON.stringify(message) === JSON.stringify(blockade_ele) ||
                JSON.stringify(blockade_ele) === "*") {
                console.log("hook alert: ", message);
                r = true;
            }
        });
        if (r === false) {
            if (debug_log) {
                console.log("alert: ", message);
            }
            _alert(...message);
        }
    };
}
let ele = [];
if (data.book.is()) {
    // #tag is_book
    if (debug_log) {
        console.log("book");
    }
    if (debug_log) {
        console.log("_GM_addStyle start");
    }
    _GM_addStyle(`#title {
    font-size: large;
    font-weight: bold;
    color: #000;
  }
  
  .container {
    margin: 0px !important;
    min-height: 0px !important;
    width: 100% !important;
    max-width: none !important;
  }
  
  .mybox {
    padding: 0px;
    margin: 0px;
  }
  `);
    if (debug_log) {
        console.log("_GM_addStyle end");
    }
    remove_ele(".mytitle", ".top_Scroll", "#pagefootermenu", "body > div.container > div > div.yueduad1", "#goTopBtn", "#pageheadermenu", "body > div.container > div.yuedutuijian.light");
    if (auto_add_bookcase) {
        (_b = document.querySelector("#a_addbookcase")) === null || _b === void 0 ? void 0 : _b.click();
    }
    else if (debug_log) {
        console.log("auto_bookcase !== true");
    }
    let author = "undefined";
    if (
    // @ts-expect-error
    typeof bookinfo === "undefined" ||
        // @ts-expect-error
        bookinfo != (undefined || null || void 0)) {
        author =
            (_e = (_d = (_c = document
                .querySelector("body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim().split(" ")[1]) !== null && _e !== void 0 ? _e : "undefined"; // 網站原有的變量
    }
    let aElement = document.createElement("a");
    aElement.href = `${window.location.origin}/modules/article/author.php?author=${author}`;
    aElement.textContent = author;
    aElement.style.color = "#007ead";
    // let divElement: HTMLDivElement = document.querySelector(
    //   "#txtright"
    // ) as HTMLDivElement;
    // divElement.textContent = "";
    // divElement.appendChild(aElement);
    let title = document.querySelector("body > div.container > div.mybox > div.tools");
    // 創建新的 <a> 元素
    let link = document.createElement("a");
    // 設置 <a> 元素的內容為 bookinfo.articlename
    if (
    // @ts-expect-error
    typeof bookinfo != "undefined" &&
        // @ts-expect-error
        bookinfo != (undefined || null || void 0)) {
        if (debug_log) {
            console.log("user bookinfo.articlename");
        }
        link.innerHTML =
            // @ts-expect-error
            (_f = bookinfo.articlename) !== null && _f !== void 0 ? _f : document.querySelector("head > title").innerHTML.split("-")[0];
    }
    else {
        if (debug_log) {
            console.log("from head>title get title");
        }
        link.innerHTML = document
            .querySelector("head > title")
            .innerHTML.split("-")[0];
    }
    // 添加 <a> 元素的類名為 "userjs_add"
    link.classList.add("userjs_add");
    // 設置 <a> 元素的 id 為 "title"
    link.id = "title";
    // 設置 <a> 元素的 href
    link.href = `${window.location.origin}/book/${data.book.get_aid()}.htm`;
    // 將 <a> 元素插入到 title 的父元素中
    (_g = title.parentNode) === null || _g === void 0 ? void 0 : _g.replaceChild(link, title);
}
if (data.info.is()) {
    // #tag is_info
    if (debug_log) {
        console.log("info");
    }
    (_h = document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a")) === null || _h === void 0 ? void 0 : _h.click();
    document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(2) > a").style.color = "#007ead";
    document.querySelector("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(3) > a").style.color = "#007ead";
}
if (data.end.is()) {
    // #tag is_end
    if (debug_log) {
        console.log("end");
    }
    if (is_end_close) {
        window.close();
    }
}
if (data.is_next_end.is()) {
    // #tag is_next_end
    if (debug_log) {
        console.log("next_is_end");
    }
    document.addEventListener("keydown", function (e) {
        if (!e.repeat) {
            switch (true) {
                case e.key === "ArrowRight": {
                    if (debug_log) {
                        console.log('(e.key === "ArrowRight") === true');
                    }
                    if (auto_add_bookcase) {
                        document.querySelector("#a_addbookcase").click();
                    }
                    else if (debug_log) {
                        console.log("auto_bookcase !== true");
                    }
                    if (is_end_close) {
                        window.close();
                    }
                    break;
                }
                default: {
                    if (debug_log) {
                        console.log("e: ", e);
                    }
                    break;
                }
            }
        }
    });
    (_j = document.querySelector("body > div.container > div.mybox > div.page1 > a:nth-child(4)")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", function () {
        var _a;
        if (debug_log) {
            console.log("click");
        }
        if (auto_add_bookcase) {
            (_a = document.querySelector("#a_addbookcase")) === null || _a === void 0 ? void 0 : _a.click();
        }
        else if (debug_log) {
            console.log("auto_bookcase !== true");
        }
        if (is_end_close) {
            window.close();
        }
    });
}
if (data.is_bookshelf()) {
    // #tag is_bookshelf
    let n = 0;
    let updata_url = [];
    let block = false;
    let block_aid_list = GM_getValue("Block_cid_list", []);
    let block_aid_list_n = 0;
    let all_updata_label = document.querySelectorAll(".newbox2 h3 label");
    all_updata_label.forEach((up_data_label) => {
        n++;
        let url = Array.from(up_data_label.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".newright > a.btn.btn-tp"))[0].href;
        let url_aid = new URLSearchParams(url).get("aid");
        block_aid_list.forEach((l_aid) => {
            if (l_aid == "*") {
                block_aid_list_n++;
                block = true;
                return false;
            }
            if (l_aid == url_aid) {
                block_aid_list_n++;
                block = true;
                return false;
            }
        });
        if (block === false) {
            updata_url.push(url);
            return true;
        }
    });
    let MenuId__open_updata_url = GM_registerMenuCommand(`${n === 0 ? "沒有" : `有${n}個`}更新${n === 0
        ? ""
        : block_aid_list_n === 0
            ? ",點擊全部打開"
            : `,點擊打開${n - block_aid_list_n}個`}`, () => {
        updata_url.forEach((value) => {
            GM_openInTab(value);
        });
        GM_unregisterMenuCommand(MenuId__open_updata_url);
    });
}
//#region GM_registerMenuCommand
GM_registerMenuCommand(`debug log: ${debug_log}`, () => {
    if (debug_log) {
        GM_setValue("debug.debug_log", false);
    }
    else {
        GM_setValue("debug.debug_log", true);
    }
    window.location.reload();
});
GM_registerMenuCommand(`auto add bookcase: ${auto_add_bookcase}`, () => {
    if (auto_add_bookcase) {
        GM_setValue("config.auto_add_bookcase", false);
    }
    else {
        GM_setValue("config.auto_add_bookcase", true);
    }
    window.location.reload();
});
GM_registerMenuCommand(`is end close: ${is_end_close}`, () => {
    if (is_end_close) {
        GM_setValue("config.is_end_close", false);
    }
    else {
        GM_setValue("config.is_end_close", true);
    }
    window.location.reload();
});
GM_registerMenuCommand(`is hook alert: ${is_hook_alert}`, () => {
    if (is_hook_alert) {
        GM_setValue("config.is_hook_alert", false);
    }
    else {
        GM_setValue("config.is_hook_alert", true);
    }
    window.location.reload();
});
//#endregion GM_registerMenuCommand
//# sourceMappingURL=69shuba%20auto%20%E6%9B%B8%E7%B0%BD.user.js.map