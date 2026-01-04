// ==UserScript==
// @name         csdn_optimizer
// @namespace    https://github.com/Kyouichirou
// @version      1.4.1
// @description  make csdn better
// @author       HLA
// @include      /https:\/\/(\w+\.)?\w+\.csdn\.net.*/
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// @run-at       document-start
// @license      MIT
// @compatiable  chrome; just test on chrome 80+
// @noframes
// @icon        https://blog.csdn.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/431533/csdn_optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/431533/csdn_optimizer.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const Notification = (
        content = "",
        title = "",
        duration = 2500,
        cfunc,
        ofunc
    ) => {
        GM_notification({
            text: content,
            title: title,
            timeout: duration,
            onclick: cfunc,
            ondone: ofunc,
        });
    };
    const escapeHTML_Blank = (html) => html.replace(/\s/g, "&nbsp;");
    const CSDN = {
        input: {
            get article() {
                const bgp = `data:image/webp;base64,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`;
                return `
                div#article_content{
                    height: auto !important;
                }
                .article-header-box {background-color: transparent !important;}
                .blog-content-box {background-image: url(${bgp}) !important;}
                .comment-box .comment-list-container .comment-list-box {
                    overflow: auto !important;
                    max-height: none !important;
                }
                #content_views pre code,
                #content_views pre{user-select: unset !important;}
                #content_views span {background-color: transparent !important;}
                .toolbar-advert,
                div.hide-article-box,
                #csdn-redpack,
                div#recommendAdBox,
                .hljs-button.signin,
                #blogColumnPayAdvert,
                .opt-box.text-center,
                img.comment-sofa-flag,
                .recommend-item-box.recommend-download-box.clearfix,
                .recommend-item-box.type_download.clearfix,
                .recommend-item-box.type_course.clearfix,
                .recommend-item-box.recommend-other-item-box.type_download,
                .recommend-item-box.recommend-other-item-box.type_discussion_topic,
                .recommend-item-box.recommend-other-item-box.type_course,
                .recommend-item-box.type_download.clearfix,
                .recommend-item-box.baiduSearch,`;
            },
            placeholder(mode) {
                GM_addStyle(`
                    input::-webkit-input-placeholder {
                        font-size: 0px;
                        text-align: right;
                    }
                    ${mode ? this.article : ""}
                    .login-box,
                    .login-mark,
                    .passport-login-container,
                    .csdn-side-toolbar,
                    .toolbar-search-hot {
                        display: none !important;
                    }
                `);
            },
            dropmenu() {
                let input = document.getElementsByClassName(
                    "toolbar-search onlySearch"
                );
                if (input.length > 0) {
                    const m = new MutationObserver((records) => {
                        for (const e of records) {
                            if (e.addedNodes.length > 0) {
                                for (const a of e.addedNodes) {
                                    if (
                                        a.className ===
                                        "toolbar-search-drop-menu "
                                    ) {
                                        a.remove();
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    });
                    m.observe(input[0], { childList: true });
                    unsafeWindow.addEventListener(
                        "visibilitychange",
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                        true
                    );
                    let boxs = input[0].getElementsByTagName("input");
                    let buttons = input[0].getElementsByTagName("button");
                    if (boxs.length > 0 && buttons.length > 0) {
                        const box = boxs[0];
                        buttons[0].addEventListener(
                            "click",
                            (e) => {
                                if (!box.value) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                }
                            },
                            true
                        );
                        box.addEventListener(
                            "keydown",
                            (e) => {
                                if (!box.value) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                }
                            },
                            true
                        );
                        buttons = null;
                        boxs = null;
                    }
                    input = null;
                }
            },
        },
        antiRedirect() {
            const links = Object.getOwnPropertyDescriptors(
                HTMLAnchorElement.prototype
            ).href;
            const trackids = ["?utm_", "utm_source", "?ops_request"];
            Object.defineProperty(HTMLAnchorElement.prototype, "href", {
                ...links,
                get() {
                    const href = decodeURIComponent(links.get.call(this));
                    for (const id of trackids) {
                        const tmp = href.split(id);
                        if (tmp.length > 1) {
                            this.href = tmp[1];
                            return tmp[1];
                        }
                    }
                    return href;
                },
            });
        },
        antiLeech() {
            // if those pictures are not from csdn
            const content = document.getElementById("content_views");
            if (!content) return;
            const imgs = content.getElementsByTagName("img");
            const hosts = ["csdnimg.cn", "csdn.net"];
            for (const img of imgs) {
                const src = img.src;
                if (src && !hosts.some((e) => src.includes(e))) {
                    img.setAttribute("referrerPolicy", "no-referrer");
                    img.src = img.src + "?";
                }
            }
        },
        comment: {
            // covert the link of text to href
            textTolink(text) {
                const reg =
                    /((http|https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g;
                return reg.test(text)
                    ? text.replace(
                          reg,
                          "<a href='$1' target='_blank' style='color: #00a0e9;width: 360px;display: inline;'>$1</a>"
                      )
                    : null;
            },
            text_convertor() {
                const snc = document.getElementsByClassName("new-comment");
                for (const e of snc) {
                    if (!e.innerHTML.includes("href")) {
                        const s = this.textTolink(e.textContent);
                        s && (e.innerHTML = s);
                    }
                }
            },
        },
        menus: {
            s_id: null,
            r_id: null,
            n_id: null,
            reader_style: null,
            simple_style: null,
            create_simple_style(m = true) {
                if (this.simple_style) return;
                this.reset_reader();
                let i = 7;
                let t = "";
                const none_display = `
                    div#asideCustom,
                    div#asideNewComments,
                    div#asideNewNps{display: none !important;}`;
                const sider_bar = `
                    aside.blog_container_aside,
                    div#rightAside{opacity: 0.1;}
                    aside.blog_container_aside:hover{
                        opacity: 1;
                        transition: opacity 3s;
                    }
                    div#rightAside:hover{
                        opacity: 1;
                        transition: opacity 3s;
                    }`;
                for (i; i > 1; i--)
                    t += `.csdn-toolbar-fl.toolbar-menus > li:nth-of-type(${i}),`;
                this.simple_style = GM_addStyle(
                    t +
                        ".toolbar-btn.toolbar-btn-vip.csdn-toolbar-fl {visibility: hidden !important;}" +
                        none_display +
                        (m ? sider_bar : "")
                );
            },
            create_reader_style() {
                if (this.reader_style) return;
                this.reset_simple();
                const sty = `
                    #csdn-toolbar,
                    aside.blog_container_aside,
                    .aside-box.kind_person.d-flex.flex-column,
                    .comment-box,
                    .first-recommend-box,
                    .second-recommend-box,
                    .recommend-box.insert-baidu-box,
                    .recommend-tit-mod {display: none ! important;}
                `;
                this.reader_style = GM_addStyle(sty);
            },
            simple_action() {
                if (this.s_id) {
                    GM_unregisterMenuCommand(this.s_id);
                    this.s_id = null;
                }
                GM_setValue("mode", "s");
                this.create_simple_style();
                this.reader();
                this.normal();
            },
            reader_action() {
                if (this.r_id) {
                    GM_unregisterMenuCommand(this.r_id);
                    this.r_id = null;
                }
                GM_setValue("mode", "r");
                this.create_reader_style();
                this.simple();
                this.normal();
            },
            reset_simple() {
                if (this.simple_style) {
                    this.simple_style.remove();
                    this.simple_style = null;
                }
            },
            reset_reader() {
                if (this.reader_style) {
                    this.reader_style.remove();
                    this.reader_style = null;
                }
            },
            normal_action() {
                if (this.n_id) {
                    GM_unregisterMenuCommand(this.n_id);
                    this.n_id = null;
                }
                GM_setValue("mode", "");
                this.reset_reader();
                this.reset_simple();
                this.simple();
                this.reader();
            },
            simple() {
                !this.s_id &&
                    (this.s_id = GM_registerMenuCommand(
                        "Simple Mode",
                        this.simple_action.bind(this)
                    ));
            },
            reader() {
                !this.r_id &&
                    (this.r_id = GM_registerMenuCommand(
                        "Reader Mode",
                        this.reader_action.bind(this)
                    ));
            },
            normal() {
                !this.n_id &&
                    (this.n_id = GM_registerMenuCommand(
                        "Normal Mode",
                        this.normal_action.bind(this)
                    ));
            },
            create(m) {
                const mode = GM_getValue("mode");
                if (!m && mode) {
                    this.create_simple_style(m);
                    return;
                }
                if (mode) {
                    if (mode === "r") {
                        this.simple();
                        this.create_reader_style();
                    } else {
                        this.reader();
                        this.create_simple_style();
                    }
                    this.normal();
                } else {
                    this.simple();
                    this.reader();
                }
            },
        },
        code: {
            // ctrl + right mouse => copy the code directly
            clipboard(text) {
                if (!text) {
                    Notification("failed to get the content of code");
                    return;
                }
                try {
                    try {
                        navigator.clipboard.writeText(text);
                    } catch (err) {
                        console.log(err);
                        GM_setClipboard(text, "text");
                    }
                    Notification("the code has been copied to clipboard");
                } catch (err) {
                    console.log(err);
                    Notification("some error on copy the code");
                }
            },
            get_code(node) {
                const num = node.getElementsByClassName("pre-numbering");
                if (num.length > 0) {
                    let text = "";
                    for (const e of node.childNodes) {
                        if (e.className === "pre-numbering") continue;
                        text += e.innerText;
                    }
                    return text;
                }
                return node.innerText;
            },
            event() {
                const pres = document.getElementsByTagName("pre");
                for (const pre of pres)
                    pre.title = "Ctrl + Right mouse button to copy this code";
                pres.length > 0 &&
                    document.addEventListener("contextmenu", (e) => {
                        if (e.ctrlKey) {
                            for (const p of e.path) {
                                if (p.localName === "pre") {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    const text = this.get_code(p);
                                    this.clipboard(text);
                                    break;
                                }
                            }
                        }
                    });
            },
        },
        anti_prevent_copy() {
            // disable initialization of csdn copy event(this feature will add copyrigth content to the data of copy)
            unsafeWindow.csdn = {};
            Object.defineProperty(unsafeWindow.csdn, "copyright", {
                value: null,
            });
        },
        anti_click_redirect() {
            // anti track what you click
            document.addEventListener(
                "click",
                (e) => {
                    let ic = 0;
                    for (const a of e.path) {
                        if (a.localName === "a") {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            const href = a.href;
                            if (href) {
                                const trackids = [
                                    "?utm_",
                                    "utm_source",
                                    "?ops_request",
                                ];
                                const index = trackids.findIndex((e) =>
                                    href.includes(e)
                                );
                                GM_openInTab(
                                    index < 0 ? href : href.slice(0, index),
                                    {
                                        insert: true,
                                        active: true,
                                    }
                                );
                            }
                            break;
                        } else if (ic > 2) break;
                        ic++;
                    }
                },
                true
            );
        },
        clear_bottom() {
            // clear the bottom zone that displays some relative articles
            const b = document.getElementsByClassName(
                "recommend-box insert-baidu-box"
            );
            const rubbish = [
                "\u534e\u4e3a",
                "CSDN\u8d44\u8baf",
                "CSDNnew",
                "\u5927\u5b66\u751f",
                "\u5e94\u5c4a\u751f",
                "\u6bd5\u4e1a\u751f",
                "\u79c1\u6d3b",
                "\u6708\u85aa",
                "\u5e74\u85aa",
                "\u8df3\u69fd",
                "\u5de5\u8d44",
                "\u4e8b\u4e1a",
                "\u5de5\u7a0b\u5e08",
                "\u85aa\u8d44",
                "\u517c\u804c",
                "\u7c89\u4e1d",
                "\u627e\u5de5\u4f5c",
                "\u7b80\u5386",
                "\u9762\u8bd5",
                "\u540c\u4e8b",
                "\u4f17\u5305",
                "HR",
                "\u85aa\u6c34",
                "\u5916\u5305",
                "\u79bb\u804c",
                "\u8fbe\u5185",
            ];
            if (b.length > 0) {
                const items = b[0].getElementsByClassName(
                    "recommend-item-box type_blog clearfix"
                );
                let i = items.length;
                const trackids = ["?utm_", "utm_source", "?ops_request"];
                for (i; i--; ) {
                    const text = items[i].innerText;
                    if (text && rubbish.some((e) => text.includes(e))) {
                        items[i].remove();
                        continue;
                    }
                    const links = items[i].getElementsByTagName("a");
                    let fr = false;
                    for (const a of links) {
                        let href = a.href;
                        if (href && href.startsWith("http")) {
                            const index = trackids.findIndex((e) =>
                                href.includes(e)
                            );
                            index > 0 && (href = href.slice(0, index));
                            if (href.includes("/article/") || !this.blackLists)
                                continue;
                            const i = href.lastIndexOf("/");
                            if (i > 0) {
                                const id = href.slice(i + 1);
                                if (this.blackLists.includes(id)) {
                                    fr = true;
                                    break;
                                }
                            }
                            index > 0 && (a.href = href);
                        }
                    }
                    fr && items[i].remove();
                }
            }
            this.blackLists = null;
        },
        user_manage: {
            // block some rubbish author
            create_button(mode) {
                const postion = document.getElementsByClassName(
                    "user-profile-operate-btn"
                );
                const [color, name, title] = mode
                    ? ["black", "unBlock", "unblock this author"]
                    : ["red", "Block", "block this author"];
                if (postion.length === 0) {
                    const button = `
                    <button
                        style="
                            margin-left: 158px;
                            width: 65px;
                            opacity: 0.95;
                            font-size: 14px;
                            line-height: 20px;
                            text-align: center;
                            cursor: pointer;
                            color: ${color};
                            background: none;
                            border: 1px solid;
                            border-radius: 3px;
                        "
                        title=${escapeHTML_Blank(title)}
                    >
                        ${name}
                    </button>`;
                    const user = document.getElementsByClassName(
                        "user-info d-flex flex-column profile-intro-name-box"
                    );
                    if (user.length === 0)
                        console.log("failed to get the postion of button");
                    else {
                        user[0].insertAdjacentHTML("beforeend", button);
                        setTimeout(
                            () =>
                                (user[0].lastElementChild.onclick = (e) =>
                                    this.click_event(e.target)),
                            250
                        );
                    }
                } else {
                    const button = `
                    <button class="block" style="
                        width: 92px;
                        height: 32px;
                        color: ${color};
                        font-size: 15px;
                        cursor: pointer;
                        border-radius: 20px;
                        opacity: 0.95;
                        border: 1px solid #999aaa;
                    " title=${escapeHTML_Blank(title)}>${name}</button>`;
                    postion[0].insertAdjacentHTML("afterbegin", button);
                    setTimeout(
                        () =>
                            (postion[0].firstElementChild.onclick = (e) =>
                                this.click_event(e.target)),
                        350
                    );
                }
            },
            click_event(target) {
                debugger;
                let blackLists = GM_getValue("block");
                if (target.innerText === "Block") {
                    if (blackLists) {
                        if (!blackLists.includes(this.id)) {
                            blackLists.push(this.id);
                            GM_setValue("block", blackLists);
                        }
                    } else {
                        blackLists = [];
                        blackLists.push(this.id);
                        GM_setValue("block", blackLists);
                    }
                    target.innerText = "unBlock";
                    target.title = "unblock this author";
                    target.style.color = "black";
                } else {
                    if (blackLists) {
                        const index = blackLists.indexOf(this.id);
                        if (index > -1) {
                            blackLists.splice(index, 1);
                            GM_setValue("block", blackLists);
                        }
                    }
                    target.innerText = "Block";
                    target.title = "block this author";
                    target.style.color = "red";
                }
            },
            id: null,
            main(mode, id) {
                this.create_button(mode);
                this.id = id;
            },
        },
        blackLists: null,
        get_block() {
            this.blackLists = GM_getValue("block");
        },
        start() {
            const href = location.href;
            const f = href.includes("/article/");
            this.antiRedirect();
            this.input.placeholder(f);
            this.anti_prevent_copy();
            //unsafewindow, some page can not capture the event.
            window.onload = () => {
                if (f) {
                    this.get_block();
                    this.antiLeech();
                    this.code.event();
                    this.anti_click_redirect();
                    this.comment.text_convertor();
                    setTimeout(() => this.clear_bottom(), 330);
                } else {
                    const regs = [
                        /https:\/\/blog\.csdn\.net\/(\w+)($|\/|\/category\w+\.html|\?type=[a-z]+)/,
                        /https:\/\/(\w+)\.blog\.csdn\.net(\/|$)/,
                    ];
                    let id = null;
                    for (const reg of regs) {
                        const ms = href.match(reg);
                        if (ms && ms.length > 1) {
                            id = ms[1];
                            break;
                        }
                    }
                    if (id) {
                        this.get_block();
                        const mode =
                            this.blackLists && this.blackLists.includes(id);
                        this.user_manage.main(mode, id);
                        this.blackLists = null;
                        this.anti_click_redirect();
                    } else if (href.endsWith(".net/"))
                        this.anti_click_redirect();
                }
                this.input.dropmenu();
            };
            this.menus.create(f);
        },
    };
    CSDN.start();
})();
