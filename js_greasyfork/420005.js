// ==UserScript==
// @name         zhihu optimizer
// @namespace    https://github.com/Kyouichirou
// @version      3.5.4.3
// @description  now, I can say this is the best GM script for zhihu!
// @author       HLA
// @run-at       document-start
// @match        https://*.zhihu.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_download
// @grant        GM_saveTab
// @grant        GM_info
// @grant        window.onurlchange
// @grant        window.close
// @connect      www.zhihu.com
// @connect      lens.zhihu.com
// @connect      api.zhihu.com
// @connect      cn.bing.com
// @connect      img.meituan.net
// @connect      www.cnblogs.com
// @require      https://cdn.staticfile.org/xlsx/0.10.0/xlsx.core.min.js
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @compatible   chrome 80+
// @license      MIT
// @noframes
// @note         cent browser(https://www.centbrowser.com/) is recommended, and edeg browser is not recommended, too bloated and jumbled
// @note         just test on chrome 80+
// @downloadURL https://update.greasyfork.org/scripts/420005/zhihu%20optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/420005/zhihu%20optimizer.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const Assist_info_URL = {
        shortcuts:
            "https://img.meituan.net/csc/df2540f418efadc25e0562df5924bb8b193354.png",
        usermanual:
            "https://github.com/Kyouichirou/D7E1293/blob/main/Tmapermonkey/zhihu_optimizer_manual.md",
        feedback:
            "https://greasyfork.org/zh-CN/scripts/420005-zhihu-optimizer/feedback",
        github: "https://github.com/Kyouichirou",
        greasyfork:
            "https://greasyfork.org/zh-CN/scripts/420005-zhihu-optimizer",
        cmd_help:
            "https://img.meituan.net/csc/5409e56911b74b0fa3e8e0e3fc40c62587055.png",
        search_help:
            "https://img.meituan.net/csc/29bae0a159923ec0c3f196326b6e3a2816319.png",
        Overview:
            "https://img.meituan.net/csc/083a417e5e990b04248baf5912a24ca2333972.png",
    };
    const blackKey = [
        "\u5171\u9752\u56e2",
        "\u4e60\u4e3b\u5e2d",
        "\u6bdb\u4e3b\u5e2d",
        "\u8096\u6218",
        "\u7559\u5b66\u4e2d\u4ecb",
        "\u65b0\u534e\u793e",
        "\u4eba\u6c11\u65e5\u62a5",
        "\u5149\u660e\u7f51",
        "\u5fb7\u4e91\u793e",
        "\u6597\u7f57\u5927\u9646",
        "\u592e\u89c6\u65b0\u95fb",
        "\u4eba\u6c11\u7684\u540d\u4e49",
        "\u5171\u4ea7\u515a",
        "\u5f20\u827a\u5174",
        "\u6c88\u9038",
        "\u6731\u4e00\u9f99",
        "\u8fea\u4e3d\u70ed\u5df4",
        "\u738b\u4e00\u535a",
        "\u6613\u70ca\u5343\u73ba",
        "\u91d1\u707f\u8363",
        "\u66fe\u4ed5\u5f3a",
        "\u738b\u4fca\u51ef",
        "\u9a81\u8bdd\u4e00\u4e0b",
        "\u90fd\u5e02\u5c0f\u8bf4",
        "\u8a00\u60c5\u5c0f\u8bf4",
        "\u803d\u7f8e\u5c0f\u8bf4",
        "\u6bdb\u6cfd\u4e1c",
    ];
    let blackName = null;
    let blackTopicAndQuestion = null;
    let collect_Answers = null;
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
    const colorful_Console = {
        //this function is adpated from jianshu.com
        colors: {
            warning: "#F73E3E",
            Tips: "#327662",
            info: "#1475b2",
        },
        main(info, bc) {
            const t = info.title,
                c = info.content,
                a = [
                    "%c ".concat(t, " %c ").concat(c, " "),
                    "padding: 1px; border-radius: 3px 0 0 3px; color: #fff; font-size: 12px; background: ".concat(
                        "#606060",
                        ";"
                    ),
                    "padding: 1px; border-radius: 0 3px 3px 0; color: #fff; font-size: 12px; background: ".concat(
                        bc,
                        ";"
                    ),
                ];
            (function () {
                let e;
                window.console &&
                    "function" === typeof window.console.log &&
                    (e = console).log.apply(e, arguments);
            }.apply(null, a),
                a);
        },
    };
    const installTips = {
        //first time run, open the usermanual webpage
        e(mode) {
            Notification(
                mode
                    ? "important update"
                    : "thanks for installing, please read user manual carefully",
                "Tips",
                6000
            );
            GM_setValue("initial", "3.5");
            GM_setValue("installeddate", Date.now());
            GM_openInTab(Assist_info_URL.usermanual, { insert: true });
            setTimeout(
                () => GM_openInTab(Assist_info_URL.shortcuts, { insert: true }),
                300
            );
        },
        main() {
            const i = GM_getValue("initial");
            if (i === true) this.e(true);
            else if (!i) this.e();
        },
    };
    const getSelection = () => {
        const select = window.getSelection();
        return select ? select.toString().trim() : null;
    };
    //clear zero-width character
    const clear_zero_width = (text) =>
        text.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");
    const escapeBlank = (target) => {
        const type = typeof target;
        if (type === "object") {
            const entries = Object.entries(target);
            for (const [key, value] of entries)
                target[key] = value.replace(/\s/g, "&nbsp;");
        } else {
            target = target.replace(/\s/g, "&nbsp;");
        }
        return target;
    };
    const escapeHTML = (s) => {
        const reg = /“|&|’|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return typeof s !== "string"
            ? s
            : s.replace(reg, ($0) => {
                  let c = $0.charCodeAt(0),
                      r = ["&#"];
                  c = c == 0x20 ? 0xa0 : c;
                  r.push(c);
                  r.push(";");
                  return r.join("");
              });
    };
    //cut out part of title with specified length, take care of chinese character & english character
    const titleSlice = (str) => {
        let length = 0;
        let newstr = "";
        for (const e of str) {
            length += e.charCodeAt(0).toString(16).length === 4 ? 2 : 1;
            newstr += e;
            if (length > 27) return `${newstr}...`;
        }
        return newstr;
    };
    const createButton = (name, title, otherButton = "", position = "left") => {
        title = escapeBlank(title);
        const html = `
            <div
                id = "assist-button-container"
                >
                <style>
                    button.assist-button {
                        border-radius: 0 1px 1px 0;
                        border: rgb(247, 232, 176) solid 1.2px;
                        display: inline-block;
                        margin-top: 4px;
                        font-size: 14px;
                        height: 28px;
                        width: 75px;
                        box-shadow: 3px 4px 1px #888888;
                        justify-content: center;
                    }
                    div#assist-button-container {
                        opacity: 0.15;
                        ${position}: 4%;
                        width: 60px;
                        flex-direction: column;
                        position: fixed;
                        bottom: 7%;
                    }
                    div#assist-button-container:hover {
                        opacity: 1;
                        transition: opacity 2s;
                    }
                </style>
                ${otherButton}
                <button class="assist-button block" style="color: black;" title=${title}>${name}</button>
            </div>`;
        document.documentElement.insertAdjacentHTML("beforeend", html);
    };
    const createPopup = (wtime = 3) => {
        const html = `
        <div id="autoscroll-tips">
            <style>
                div#autoscroll-tips {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 10000;
                    overflow: hidden;
                    -webkit-transition: background-color 0.2s ease-in-out;
                    transition: background-color 0.2s ease-in-out;
                }
                .autoscroll-tips_content {
                    position: fixed;
                    top: 45%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: lightgray;
                    width: 240px;
                    height: 120px;
                    border: 1px solid #b9d5ff;
                }
            </style>
            <div class="autoscroll-tips_content">
                <div class="autotips_content" style="margin: 5px 5px 5px 5px">
                    <h2 style="text-align: center">Auto Scroll Mode</h2>
                    <hr />
                    <p style="text-align: center">${wtime}s, auto load next page</p>
                    <div
                        class="auto_button"
                        style="
                            text-align: center;
                            letter-spacing: 25px;
                            margin-top: 12px;
                        "
                    >
                        <style>
                            button {
                                width: 60px;
                                height: 24px;
                                box-shadow: 1px 2px 1px #888888;
                            }
                        </style>
                        <button title="load next page immediately">OK</button>
                        <button title="cancel load next page">Cancel</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", html);
    };
    /*
    unfinished project
    directly block some ad information url requests
    loaded_article, control the quantity of loaded articles
    salt_article, zhihu's paid_content
    class, extends, super, class Inheritance, subclass
    */
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        open(...args) {
            // keep the js of init.js from accessing continuously the url: zhihu-web-analytics.zhihu.com
            if (args.length > 1 && args[1].includes("/logs/batch"))
                (args[1] = "http://127.0.0.1"), (args[2] = true);
            return super.open(...args);
        }
    };
    const fetch_intercept = {
        intercept() {
            const fetch = unsafeWindow.fetch;
            unsafeWindow.fetch = (...args) =>
                (async (args) => {
                    const url = args[0];
                    const ad_list = [
                        "/commercial",
                        "include=ad_type",
                        "/read_count_statistics",
                        "/events/r",
                        "/top_search",
                        "/preset_words",
                        "/scan_info",
                        "/logs/batch",
                        "/paid_content",
                        "/market/rhea/questions",
                    ];
                    const article_api = "/api/v4/questions/";
                    url.includes(article_api) && (this.loaded_articles += 1);
                    return ad_list.some((e) => url.includes(e))
                        ? {
                              // keep the js of init.js from accessing continuously the object
                              status: 204,
                              headers: {
                                  get() {
                                      return null;
                                  },
                              },
                              text() {
                                  throw new SyntaxError("some error");
                              },
                          }
                        : await fetch(...args);
                })(args);
        },
        // response, response.clone().json(), copy the response to new obj, the response can only be read once
        // check if the answer is paid content(salt)
        check_salt(response) {
            response
                .then((result) => this.check_content(result))
                .catch(() => console.log("error, no content"));
        },
        check_content(result) {
            for (const a in result) {
                const obj = result[a];
                const name = Object.prototype.toString.call(obj);
                if (name === "[object Array]") {
                    if (a === "data") {
                        for (const e of obj) {
                            if (e.type === "knowledge_result") {
                                const item = e["answer_obj"];
                                if (item) {
                                    const id = item["id"];
                                    id &&
                                        !this.salt_articles.includes(id) &&
                                        this.salt_articles.push(id);
                                }
                            }
                        }
                        return;
                    }
                } else if (name === "[object Object]") this.check_content(obj);
            }
        },
        loaded_articles: 0,
        salt_articles: null,
        initial(index = 0) {
            index > 0 && (this.salt_articles = []);
            this.intercept();
        },
    };
    /*
    convert image to base64 code
    just support a little type of image, chrome, don't support image/gif type
    support type, test on this site: https://kangax.github.io/jstests/toDataUrl_mime_type_test/
    */
    const imageConvertor = {
        canvas(image, format, quality) {
            const canvas = document.createElement("canvas");
            const context2D = canvas.getContext("2d");
            context2D.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            context2D.drawImage(image, 0, 0);
            return canvas.toDataURL("image/" + format, quality);
            //0-1, default: 0.92, the quality of pic
        },
        main(imgURL, format = "webp", quality = 0.92) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = imgURL;
                img.crossOrigin = "";
                img.onload = () => resolve(this.canvas(img, format, quality));
                img.onerror = (err) => reject(err);
            });
        },
    };
    const Download_module = (url, filename, timeout = 3000) => {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: filename,
                timeout: timeout,
                onload: () => resolve(true),
                onerror: (err) => {
                    console.log(err);
                    reject(null);
                },
                ontimeout: () => reject("timeout error"),
            });
        });
    };
    const image_base64_download = (url, filename) => {
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        a.remove();
        a = null;
    };
    const xmlHTTPRequest = (
        url,
        time = 2500,
        responeType = "json",
        rType = false
    ) => {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: time,
                responseType: responeType,
                onload: (response) => {
                    if (response.status == 200) {
                        if (rType) {
                            //after redirect, get the final URL
                            resolve(response.finalUrl);
                        } else {
                            resolve(response.response);
                        }
                    } else {
                        console.log(`err: code ${response.status}`);
                        reject("request data error");
                    }
                },
                onerror: (e) => {
                    console.log(e);
                    reject("something error");
                },
                ontimeout: (e) => {
                    console.log(e);
                    reject("timeout error");
                },
            });
        });
    };
    const column_Home = {
        item_index: 0,
        single_Content_request(type, id, node, info) {
            const types = {
                0: "answers",
                1: "questions",
                2: "articles",
            };
            const name = types[type];
            if (!name) return;
            const args = `include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,attachment,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question,excerpt,is_labeled,paid_info,paid_info_content,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp,is_recognized;data[*].mark_infos[*].url;data[*].author.follower_count,badge[*].topics;data[*].settings.table_of_content.enabled`;
            const api = `https://www.zhihu.com/api/v4/${name}/${id}?${args}`;
            xmlHTTPRequest(api).then(
                (json) => {
                    typeof json === "string" && (json = JSON.parse(json));
                    node.insertAdjacentHTML(
                        "afterbegin",
                        this.item_Raw(json, this.item_index, info)
                    );
                    this.item_index += 1;
                },
                (err) => {
                    const index =
                        zhihu.Column.home_Module.loaded_list.indexOf(id);
                    index > -1 &&
                        zhihu.Column.home_Module.loaded_list.splice(index, 1);
                    colorful_Console.main(
                        { title: id, content: "failed to request data" },
                        colorful_Console.colors.warning
                    );
                    console.log(err);
                }
            );
        },
        time_Format(date) {
            return (
                `0${date.getHours()}`.slice(-2) +
                ":" +
                `0${date.getMinutes()}`.slice(-2)
            );
        },
        item_Raw(json, index, info) {
            const author = json.author;
            const ct = (json.created_time || json.created) * 1000;
            const mt = (json.updated_time || json.created) * 1000;
            const c = new Date(ct);
            const m = new Date(mt);
            const html = `
            <div class="List-item" tabindex="0">
                <div
                    class="ContentItem AnswerItem"
                    data-za-index=${index}
                    name=${json.id}
                    itemprop="suggestedAnswer"
                    itemtype="http://schema.org/Answer"
                    itemscope=""
                    data-za-detail-view-path-module=${json.type}
                    data-za-detail-view-path-index=${index}
                >
                    <div class="ContentItem-meta">
                        <h2 class="ContentItem-title">
                            <div
                                itemprop="zhihu:question"
                                itemtype="http://schema.org/Question"
                                itemscope=""
                            >
                                <meta
                                    itemprop="url"
                                    content=${info.url}
                                /><meta itemprop="name" content=${
                                    info.title
                                }/><a
                                    target="_blank"
                                    data-za-detail-view-element_name="Title"
                                    href=${info.url}
                                    >${info.title}</a
                                >
                            </div>
                        </h2>
                        <hr>
                        <br>
                        <div
                            class="AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related"
                            itemprop="author"
                            itemscope=""
                            itemtype="http://schema.org/Person"
                        >
                            <meta itemprop="name" content=${author.name} /><meta
                                itemprop="image"
                                content=${author.avatar_url}
                            /><meta
                                itemprop="url"
                                content=https://www.zhihu.com/${
                                    author.is_org ? "org" : "people"
                                }/${author.url_token}
                            /><span
                                class="UserLink AuthorInfo-avatarWrapper"
                                ><div class="Popover">
                                    <div
                                        id="Popover77-toggle"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-owns="Popover77-content"
                                    >
                                        <a
                                            class="UserLink-link"
                                            data-za-detail-view-element_name="User"
                                            target="_blank"
                                            href=https://www.zhihu.com/${
                                                author.is_org ? "org" : "people"
                                            }/${author.url_token}
                                            ><img
                                                class="Avatar AuthorInfo-avatar"
                                                width="38"
                                                height="38"
                                                src=${json.author.avatar_url}
                                                srcset="
                                                    ${json.author.avatar_url} 2x
                                                "
                                                alt=${json.author.name}
                                        /></a>
                                    </div></div
                            ></span>
                            <div class="AuthorInfo-content">
                                <div class="AuthorInfo-head">
                                    <span class="UserLink AuthorInfo-name"
                                        ><div class="Popover">
                                            <div
                                                id="Popover78-toggle"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                aria-owns="Popover78-content"
                                            >
                                                <a
                                                    class="UserLink-link"
                                                    data-za-detail-view-element_name="User"
                                                    target="_blank"
                                                    href=https://www.zhihu.com/${
                                                        author.is_org
                                                            ? "org"
                                                            : "people"
                                                    }/${author.url_token}
                                                    >${json.author.name}</a
                                                >
                                            </div>
                                        </div></span
                                    >
                                </div>
                                <div class="AuthorInfo-detail">
                                    <div class="AuthorInfo-badge">
                                        <div class="ztext AuthorInfo-badgeText">
                                            ${json.author.headline}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="LabelContainer-wrapper"></div>
                    </div>
                    <meta
                        itemprop="dateCreated"
                        content=${c.toISOString()}
                    /><meta
                        itemprop="dateModified"
                        content=${m.toISOString()}
                    />
                    <div class="RichContent is-collapsed RichContent--unescapable">
                        <div class="RichContent-inner" style="max-height: 400px">
                            <span
                                class="RichText ztext CopyrightRichText-richText"
                                itemprop="text"
                            >${json.content}</span>
                        </div>
                        <button
                            type="button"
                            class="Button ContentItem-rightButton ContentItem-expandButton Button--plain"
                        >
                            展开阅读全文<span
                                style="display: inline-flex; align-items: center"
                                >&#8203;<svg
                                    class="Zi Zi--ArrowDown ContentItem-arrowIcon"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path
                                        d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z"
                                        fill-rule="evenodd"
                                    ></path></svg
                            ></span>
                        </button>
                        <div class="time_module">
                            <span data-tooltip="发布于 ${zhihu.Column.timeStampconvertor(
                                ct
                            )} ${this.time_Format(
                c
            )}">编辑于 ${zhihu.Column.timeStampconvertor(mt)}</span>
                        </div>
                    </div>
                </div>
            </div>`;
            return html;
        },
    };
    //hidden element = false
    const elementVisible = {
        getElementTop(obj) {
            let top = 0;
            while (obj) {
                top += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return top;
        },
        check(wh, element, offset) {
            const tp = this.getElementTop(element);
            return tp + element.clientHeight > offset && offset + wh > tp;
        },
        main(fNode, args) {
            const offset = fNode.scrollTop;
            const wh = window.innerHeight;
            const type = Object.prototype.toString.call(args);
            if (type === "[object HTMLCollection]") {
                for (const e of args) if (this.check(wh, e, offset)) return e;
                return null;
            } else return this.check(wh, args, offset);
        },
    };
    const change_Title = (title) => {
        const chs = document.head.children;
        for (const c of chs) {
            if (c.localName === "title") {
                c.innerHTML = title;
                document.title = title;
                break;
            }
        }
    };
    const get_Title = () => {
        const title = document.title;
        return title.endsWith("- 知乎")
            ? title.slice(0, title.length - 5)
            : title;
    };
    class Database {
        /*
        dname: name of database;
        tname: name of table;
        mode: read or read&write;
        */
        constructor(dbname, tbname = "", rwmode = false, version = 1) {
            this.dbopen =
                version === 1
                    ? indexedDB.open(dbname)
                    : indexedDB.open(dbname, version);
            this.RWmode = rwmode ? "readwrite" : "readonly";
            this.tbname = tbname;
            const getIndex = (fieldname) => this.Table.index(fieldname);
        }
        Initialize() {
            return new Promise((resolve, reject) => {
                //if the db does not exist, this event will fired firstly;
                //adjust the version of db, which can trigger this event => create/delete table or create/delete index (must lauch from this event);
                this.dbopen.onupgradeneeded = (e) => {
                    this.store = e.target.result;
                    this.updateEvent = true;
                    this.storeEvent();
                    resolve(0);
                };
                this.dbopen.onsuccess = () => {
                    if (this.store) return;
                    this.updateEvent = false;
                    this.store = this.dbopen.result;
                    this.storeEvent();
                    resolve(1);
                };
                this.dbopen.onerror = (e) => {
                    console.log(e);
                    reject("error");
                };
                /*
                The event handler for the blocked event.
                This event is triggered when the upgradeneeded event should be triggered _
                because of a version change but the database is still in use (i.e. not closed) somewhere,
                even after the versionchange event was sent.
                */
                this.dbopen.onblocked = () => {
                    console.log("please close others tab to update database");
                    reject("conflict");
                };
                this.dbopen.onversionchange = (e) =>
                    console.log("The version of this database has changed");
            });
        }
        createTable(keyPath) {
            if (this.updateEvent) {
                const index = keyPath
                    ? { keyPath: keyPath }
                    : { autoIncrement: true };
                this.store.createObjectStore(this.tbname, index);
            }
        }
        createNewTable(keyPath) {
            return new Promise((resolve, reject) => {
                this.version = this.store.version + 1;
                this.store.close();
                if (this.storeErr) {
                    reject("database generates some unknow error");
                    return;
                }
                this.dbopen = indexedDB.open(this.store.name, this.version);
                this.Initialize().then(
                    () => {
                        this.createTable(keyPath);
                        resolve(true);
                    },
                    () => reject("database initial fail")
                );
            });
        }
        storeEvent() {
            this.store.onclose = () => console.log("closing...");
            this.store.onerror = () => (this.storeErr = true);
        }
        get checkTable() {
            return this.store.objectStoreNames.contains(this.tbname);
        }
        get Tablenames() {
            return this.store.objectStoreNames;
        }
        get DBname() {
            return this.store.name;
        }
        get Indexnames() {
            return this.Table.indexNames;
        }
        get DBversion() {
            return this.store.version;
        }
        get Datacount() {
            return new Promise((resolve, reject) => {
                const req = this.Table.count();
                req.onsuccess = (e) =>
                    resolve({
                        count: e.target.result,
                        name: e.target.source.name,
                    });
                req.onerror = (e) => reject(e);
            });
        }
        //take care the transaction, must make sure the transaction is alive when you need deal with something continually
        get Table() {
            const transaction = this.store.transaction(
                [this.tbname],
                this.RWmode
            );
            const table = transaction.objectStore(this.tbname);
            transaction.onerror = () =>
                console.log("warning, error on transaction");
            return table;
        }
        rollback() {
            this.transaction && this.transaction.abort();
        }
        read(keyPath) {
            return new Promise((resolve, reject) => {
                const request = this.Table.get(keyPath);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject("error");
            });
        }
        batchCheck(tables, keyPath) {
            return new Promise((resolve) => {
                const arr = [];
                for (const t of tables) {
                    const transaction = this.store.transaction(
                        this.store.objectStoreNames,
                        this.RWmode
                    );
                    const table = transaction.objectStore(t);
                    const rq = new Promise((reso, rej) => {
                        const req = table.get(keyPath);
                        req.onsuccess = () => reso(req.result);
                        req.onerror = () => rej("error");
                    });
                    arr.push(rq);
                }
                Promise.allSettled(arr).then((results) => {
                    resolve(
                        results.map((r) =>
                            r.status === "rejected" ? null : r.value
                        )
                    );
                });
            });
        }
        add(info) {
            return new Promise((resolve, reject) => {
                const op = this.Table.add(info);
                op.onsuccess = () => resolve(true);
                op.onerror = (e) => {
                    console.log(e);
                    reject("error");
                };
            });
        }
        getAll(tables) {
            return new Promise((resolve) => {
                const arr = [];
                for (const t of tables) {
                    const transaction = this.store.transaction(
                        this.store.objectStoreNames,
                        this.RWmode
                    );
                    const table = transaction.objectStore(t);
                    const rq = new Promise((reso, rej) => {
                        const req = table.getAll();
                        req.onsuccess = (e) =>
                            reso({
                                name: e.target.source.name,
                                data: e.target.result,
                            });
                        req.onerror = () => rej(t);
                    });
                    arr.push(rq);
                }
                Promise.allSettled(arr).then((results) => resolve(results));
            });
        }
        updateRecord(keyPath) {
            return new Promise((resolve, reject) => {
                this.read(keyPath).then(
                    (result) => {
                        if (result) {
                            result.visitTime = Date.now();
                            let times = result.visitTimes;
                            result.visitTimes = times ? ++times : 2;
                            this.update(result).then(
                                () => resolve(true),
                                (err) => reject(err)
                            );
                        } else resolve(true);
                    },
                    (err) => reject(err)
                );
            });
        }
        update(info, keyPath, mode = false) {
            //if db has contained the item, will update the info; if it does not, a new item is added
            return new Promise((resolve, reject) => {
                //keep cursor
                if (mode) {
                    this.read(info[keyPath]).then(
                        (result) => {
                            if (!result) {
                                this.add(info).then(
                                    () => resolve(true),
                                    (err) => reject(info)
                                );
                            } else {
                                const op = this.Table.put(
                                    Object.assign(result, info)
                                );
                                op.onsuccess = () => resolve(true);
                                op.onerror = (e) => {
                                    console.log(e);
                                    reject(info);
                                };
                            }
                        },
                        (err) => console.log(err)
                    );
                } else {
                    const op = this.Table.put(info);
                    op.onsuccess = () => resolve(true);
                    op.onerror = (e) => {
                        console.log(e);
                        reject(info);
                    };
                }
            });
        }
        clear() {
            this.Table.clear();
        }
        //must have primary key
        deleteiTems(keyPath) {
            return new Promise((resolve, reject) => {
                const op = this.Table.delete(keyPath);
                op.onsuccess = () => {
                    console.log("delete item successfully");
                    resolve(true);
                };
                op.onerror = (e) => {
                    console.log(e);
                    reject("error");
                };
            });
        }
        //note: create a index must lauch from onupgradeneeded event; we need triggle update event
        createIndex(indexName, keyPath, objectParameters) {
            if (!this.updateEvent) {
                console.log("this function must be through onupgradeneeded");
                return;
            }
            this.table.createIndex(indexName, keyPath, objectParameters);
        }
        deleTable() {
            if (!this.updateEvent) {
                console.log("this function must be through onupgradeneeded");
                return;
            }
            this.dbopen.deleteObjectStore(this.tbname);
        }
        deleIndex(indexName) {
            if (!this.updateEvent) {
                console.log("this function must be through onupgradeneeded");
                return;
            }
            this.table.deleteIndex(indexName);
        }
        close() {
            //The connection is not actually closed until all transactions created using this connection are complete
            this.store.close();
        }
        static deleDB(dbname) {
            return new Promise((resolve, reject) => {
                const DBDeleteRequest = window.indexedDB.deleteDatabase(dbname);
                DBDeleteRequest.onerror = (e) => {
                    console.log(e);
                    reject("error");
                };
                DBDeleteRequest.onsuccess = () => {
                    console.log("success");
                    resolve(true);
                };
            });
        }
    }
    const dataBaseInstance = {
        db: null,
        auto_tags() {
            const tags = document.getElementsByClassName("Tag-content");
            const arr = [];
            for (const tag of tags) {
                const text = tag.innerText.trim();
                text && arr.push(text);
            }
            return arr.length > 0 ? arr.join(" ") : null;
        },
        additem(columnID, node, pid) {
            const info = {};
            info.pid = pid || this.pid;
            info.update = Date.now();
            info.excerpt = "";
            info.visitTimes = 1;
            info.visitTime = info.update;
            const content_id = node
                ? "RichText ztext CopyrightRichText-richText"
                : "RichText ztext Post-RichText";
            node = node || document.body;
            const contentholder = node.getElementsByClassName(content_id);
            if (contentholder.length > 0) {
                const chs = contentholder[0].childNodes;
                let excerpt = "";
                //take some data as this article's digest
                let ic = 0;
                for (const node of chs) {
                    if (node.localName === "p") {
                        excerpt += node.innerText;
                        if (excerpt.length > 300) {
                            excerpt = excerpt.slice(0, 300);
                            break;
                        }
                    }
                    ic++;
                    if (ic > 5) break;
                }
                info.excerpt = excerpt;
            }
            info.userName = "";
            info.userID = "";
            const user = node.getElementsByClassName(
                "UserLink AuthorInfo-name"
            );
            if (user.length > 0) {
                const link = user[0].getElementsByTagName("a");
                if (link.length > 0) {
                    const p = link[0].pathname;
                    info.userID = p.slice(p.lastIndexOf("/") + 1);
                    info.userName = link[0].text;
                }
            }
            info.ColumnID = columnID || "";
            const defaultV = this.auto_tags() || "A B";
            const p = prompt(
                "please input some tags about this article, like: javascript python; multiple tags use blank space to isolate",
                defaultV
            );
            let tags = [];
            if (p && p !== defaultV && p.trim()) {
                const tmp = p.split(" ");
                for (let e of tmp) {
                    e = e.trim();
                    e && tags.push(e);
                }
            }
            const note = prompt(
                "you can input something to highlight this article, eg: this article is about advantage python usage"
            );
            info.tags = tags;
            info.note = note || "";
            info.title = get_Title();
            this.db.update(info, "pid", false).then(
                () =>
                    Notification(
                        "add this article to collection successfully",
                        "Tips"
                    ),
                () =>
                    Notification(
                        "add this aritcle to collection fail",
                        "Warning"
                    )
            );
        },
        fold(info) {
            this.db.update(info, "name", true).then(
                () => console.log("this answer has been folded"),
                () => console.log("add this anser to folded list fail")
            );
        },
        get DBname() {
            return this.db.DBname;
        },
        get Table() {
            return this.db.Table;
        },
        batchCheck(tableNames) {
            const pid = this.pid;
            return new Promise((resolve) =>
                this.db
                    .batchCheck(tableNames, pid)
                    .then((results) => resolve(results))
            );
        },
        updateRecord(keyPath) {
            const pid = keyPath || this.pid;
            this.db.updateRecord(pid).then(
                () => console.log("update record finished"),
                (err) => console.log(err)
            );
        },
        check(keyPath) {
            const pid = keyPath || this.pid;
            return new Promise((resolve, reject) => {
                this.db.read(pid).then(
                    (result) => resolve(result),
                    (err) => reject(err)
                );
            });
        },
        get pid() {
            return location.pathname.slice(3);
        },
        dele(mode, keyPath) {
            const pid = keyPath || this.pid;
            this.db.deleteiTems(pid).then(
                () =>
                    mode &&
                    Notification(
                        `the article of ${pid} has been deleted from collection successfully`,
                        "Tips"
                    ),
                () => mode && Notification("delete article fail")
            );
        },
        update(info) {
            return this.db.update(info);
        },
        /**
         * @param {String} name
         */
        set TableName(name) {
            this.db.tbname = name;
        },
        close() {
            this.db && this.db.close();
            this.db = null;
        },
        getdataCount(tables) {
            return new Promise((resolve) => {
                const arr = tables.map((t) => {
                    this.TableName = t;
                    return this.db.Datacount;
                });
                Promise.allSettled(arr).then((results) => resolve(results));
            });
        },
        getAll(tables) {
            return new Promise((resolve) =>
                this.db.getAll(tables).then((result) => resolve(result))
            );
        },
        initial(tableNames, mode = false, keyPath = "pid") {
            return new Promise((resolve, reject) => {
                if (!Array.isArray(tableNames)) {
                    reject("this parameter must be array");
                    return;
                }
                const dbname = "zhihuDatabase";
                const db = new Database(
                    dbname,
                    tableNames.length === 1 ? tableNames[0] : "",
                    mode
                );
                this.db = db;
                db.Initialize().then(
                    (result) => {
                        if (result === 0) {
                            for (const table of tableNames) {
                                db.tbname = table;
                                db.createTable(keyPath);
                            }
                        }
                        resolve(result);
                    },
                    (err) => reject(err)
                );
            });
        },
    };
    const data2Excel = {
        s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        },
        sheet2blob(sheet, sheetName) {
            sheetName = sheetName || "sheet1";
            const workbook = {
                SheetNames: [sheetName],
                Sheets: {},
            };
            workbook.Sheets[sheetName] = sheet;
            const wopts = {
                bookType: "xlsx",
                bookSST: false,
                type: "binary",
            };
            const wbout = XLSX.write(workbook, wopts);
            const blob = new Blob([this.s2ab(wbout)], {
                type: "application/octet-stream",
            });
            // string to ArrayBuffer
            return blob;
        },
        openDownloadDialog(url, saveName) {
            if (typeof url == "object" && url instanceof Blob)
                url = URL.createObjectURL(url);
            let aLink = document.createElement("a");
            aLink.href = url;
            aLink.download = saveName || "";
            let event;
            if (window.MouseEvent) event = new MouseEvent("click");
            else {
                event = document.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click",
                    true,
                    false,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                );
            }
            aLink.dispatchEvent(event);
            URL.revokeObjectURL(url);
        },
        json_toExcel(data, wbname, shname) {
            const sheet = XLSX.utils.json_to_sheet(data);
            this.openDownloadDialog(
                this.sheet2blob(sheet, shname),
                `${wbname}.xlsx`
            );
        },
        // dic => sheet, if set the header, the columns' name should been put the first place.
        dic_toExcel(data, wbname, shname = "data") {
            const sheet = XLSX.utils.aoa_to_sheet(Object.entries(data));
            this.openDownloadDialog(
                this.sheet2blob(sheet, shname),
                `${wbname}.xlsx`
            );
        },
    };
    const control_pannel = {
        collect() {
            console.log("wait a few seconds, data is retrieving...");
            dataBaseInstance.getAll(["collection"]).then((results) => {
                const result = results[0];
                if (!result) {
                    console.log("no data");
                    return;
                }
                if (result.status === "fulfilled") {
                    const data = result.value.data;
                    for (const e of data) {
                        const tags = e.tags;
                        if (tags && Array.isArray(tags))
                            e.tags = tags.join(";");
                    }
                    data2Excel.json_toExcel(data, "collection_" + Date.now());
                    console.log(
                        "successfully retrieved all collected articles"
                    );
                } else console.log("failed to retrieve data");
            });
        },
    };
    const control_pannel_init = () => {
        unsafeWindow.optimizer = {
            collect: null,
        };
        let time_id = null;
        Object.defineProperty(unsafeWindow.optimizer, "collect", {
            enumerable: true,
            configurable: true,
            get() {
                return "input: 'optimier.collect = true;' || download all collected articles as excel file";
            },
            set(value) {
                if (value === true) {
                    time_id && clearTimeout(time_id);
                    time_id = setTimeout(() => control_pannel.collect(), 300);
                }
            },
        });
    };
    const MangeData = {
        importData: {
            isRunning: false,
            create(mode) {
                const html = `
                <div
                    id="read_local_text"
                    style="
                        background: lightgray;
                        width: 360px;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        height: 360px;
                        border: 1px solid #ccc !important;
                        box-shadow: 1px 1px 4px #888888;
                    "
                >
                    <h2 style="text-align: center; margin: 5px">IndexedDB Data Import</h2>
                    <hr />
                    <input
                        type="file"
                        class="read-local-txt-input"
                        id="readTxt"
                        accept=".txt"
                        ${mode ? 'multiple="multiple"' : ""}
                        style="margin-top: 35%; margin-left: 25%"
                    />
                </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
                this.event(mode);
            },
            notice(filename) {
                colorful_Console.main(
                    {
                        tilte: "DB import data",
                        content: `this file(${filename}) does not match current DB`,
                    },
                    colorful_Console.colors.warning
                );
            },
            checkFile_format(json, filename, lists) {
                if (!json || !lists.includes(json.name)) {
                    this.notice(filename);
                    return null;
                }
                const data = json.data;
                if (!data || !Array.isArray(data) || data.length === 0) {
                    this.notice(filename);
                    return null;
                }
                return data;
            },
            remove() {
                this.timeID && clearTimeout(this.timeID, (this.timeID = null));
                this.node && (this.node.remove(), (this.node = null));
            },
            node: null,
            timeID: null,
            read_file(file, lists) {
                return new Promise((resolve, reject) => {
                    const r = new FileReader();
                    //default encode is UTF-8;
                    r.readAsText(file);
                    r.onload = (e) => {
                        const result = e.target.result;
                        if (!result) {
                            reject(file.name);
                            return;
                        }
                        try {
                            const json = JSON.parse(result);
                            const data = this.checkFile_format(
                                json,
                                file.name,
                                lists
                            );
                            if (!data) {
                                reject(file.name);
                                return;
                            }
                            const tname = json.name;
                            dataBaseInstance.TableName = tname;
                            const arr = data.map((e) =>
                                dataBaseInstance.update(e)
                            );
                            Promise.allSettled(arr).then((results) => {
                                results.forEach((e) => {
                                    if (e.status === "rejected") {
                                        const r = e.value;
                                        r &&
                                            colorful_Console.main(
                                                {
                                                    title: "DB put data",
                                                    content: `ID of ${r.name} has failed to import`,
                                                },
                                                colorful_Console.colors.warning
                                            );
                                    }
                                });
                                Notification(
                                    `the data(${tname}) import operation has completed`,
                                    "Tips",
                                    3500
                                );
                                resolve(file.name);
                            });
                        } catch (error) {
                            console.log(error);
                            reject(file.name);
                        }
                    };
                    r.onerror = (e) => {
                        console.log(e);
                        reject(file.name);
                    };
                });
            },
            loadFile(e, lists) {
                this.isRunning = true;
                const arr = [];
                for (const file of e.target.files)
                    arr.push(this.read_file(file, lists));
                Promise.allSettled(arr).then((results) => {
                    results.forEach((e) =>
                        console.log(
                            e.status === "rejected"
                                ? `failed to import file(${e.value}) to DB`
                                : `import file(${e.value}) to DB successfully`
                        )
                    );
                    this.timeID = setTimeout(
                        () => ((this.timeID = null), this.remove()),
                        1200
                    );
                    Notification(
                        "the operation import data to DB has finished",
                        "Tips"
                    );
                    this.isRunning = false;
                });
            },
            event(mode) {
                this.node = document.getElementById("read_local_text");
                let i = this.node.getElementsByTagName("input")[0];
                i.onchange = (e) => {
                    if (e.target.files.length === 0) return;
                    if (
                        !confirm(
                            "take care! are you sure to start importing data?"
                        )
                    )
                        return;
                    const lists = mode
                        ? ["collection", "preference"]
                        : ["foldedAnswer"];
                    this.loadFile(e, lists);
                };
                i = null;
            },
            main(mode) {
                !this.isRunning && this.node
                    ? this.remove()
                    : this.create(mode);
            },
        },
        exportData: {
            _download(text, filename) {
                const a = document.createElement("a");
                a.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
                );
                a.setAttribute("download", filename);
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            },
            _getData(tables) {
                dataBaseInstance.getAll(tables).then((results) => {
                    let i = 0;
                    for (const result of results) {
                        if (result.status === "rejected") {
                            Notification(
                                `the operation of backup DB(${result.value}) data fail`,
                                "Warning"
                            );
                            continue;
                        }
                        if (result.value.data.length === 0) {
                            Notification(
                                `the database(${result.value.name}) has not yet stored the data`,
                                "DB Tips"
                            );
                        }
                        setTimeout(
                            () =>
                                this._download(
                                    JSON.stringify(result.value),
                                    `DB_Backup_${
                                        result.value.name
                                    }_${Date.now()}.txt`
                                ),
                            i
                        );
                        i += 2000;
                    }
                });
            },
            _QAwebPage() {
                this._getData(["foldedAnswer"]);
            },
            _columnPage() {
                this._getData(["collection", "preference"]);
            },
            main(mode = true) {
                mode ? this._QAwebPage() : this._columnPage();
            },
        },
    };
    const zhihu = {
        /*
        these original functions of zhihu webpage will be failed in reader mode, so need to be rebuilt
        rebuild:
        1. gif player;
        2. video player;
        3. show raw picture
        add:
        1. picture viewer, continually open the raw picture in viewer mode;
        2. time clock
        note:
        the source of video come from v-list2, which has some problems, need escape ?
        */
        qaReader: {
            time_module: {
                /*
                1. adapted from https://zyjacya-in-love.github.io/flipclock-webpage/#
                2. html and css is adopted, and some codes have been reedited or cutted;
                3. rebuild js, the original js is too big, intricate or complicated;
                */
                get formated_Time() {
                    const time = this.Date_format;
                    const info = {};
                    info.hour = time.h;
                    this.time_arr = [...time.string];
                    info.before = this.time_arr.map((e) =>
                        e === "0" ? "9" : (parseInt(e) - 1).toString()
                    );
                    return info;
                },
                time_arr: null,
                create_Module(className, value) {
                    const html = `
                        <li class=${className}>
                            <a href="#"
                                ><div class="up">
                                    <div class="shadow"></div>
                                    <div class="inn">${value}</div>
                                </div>
                                <div class="down">
                                    <div class="shadow"></div>
                                    <div class="inn">${value}</div>
                                </div></a
                            >
                        </li>`;
                    return html;
                },
                removeClassname(node) {
                    node.className = "";
                },
                addNewClassName(node, newName) {
                    node.className = newName;
                },
                exe(clname, node, e, index) {
                    const ul = node.getElementsByClassName(clname)[0];
                    this.removeClassname(ul.firstElementChild);
                    this.addNewClassName(
                        ul.lastElementChild,
                        "flip-clock-before"
                    );
                    ul.insertAdjacentHTML(
                        "beforeend",
                        this.create_Module("flip-clock-active", e)
                    );
                    ul.firstElementChild.remove();
                    this.time_arr[index] = e;
                },
                f0(node, e, index) {
                    this.exe("flip ahour", node, e, index);
                },
                f1(node, e, index) {
                    this.exe("flip bhour", node, e, index);
                },
                f2(node, e, index) {
                    this.exe("flip play aminute", node, e, index);
                },
                firstRun: false,
                f3(node, e, index) {
                    this.exe("flip play bminute", node, e, index);
                    this.firstRun = true;
                },
                change_time_status(node, value) {
                    const a = node
                        .getElementsByClassName("flip-clock-meridium")[0]
                        .getElementsByTagName("a")[0];
                    a.innerText = value;
                    this.currentHour = value;
                },
                clock() {
                    const css = `
                        <style>
                            .clock {
                                width: auto;
                                zoom: 0.6;
                            }
                            .flip-clock-dot {
                                background: #ccc;
                            }
                            .flip-clock-meridium a {
                                color: #ccc;
                            }
                            #box {
                                display: table;
                            }
                            #content {
                                text-align: center;
                                display: table-cell;
                                vertical-align: middle;
                            }
                        </style>
                        <style>
                            .flip-clock-wrapper * {
                                -webkit-box-sizing: border-box;
                                -moz-box-sizing: border-box;
                                -ms-box-sizing: border-box;
                                -o-box-sizing: border-box;
                                box-sizing: border-box;
                                -webkit-backface-visibility: hidden;
                                -moz-backface-visibility: hidden;
                                -ms-backface-visibility: hidden;
                                -o-backface-visibility: hidden;
                                backface-visibility: hidden;
                            }
                            .flip-clock-wrapper a {
                                cursor: pointer;
                                text-decoration: none;
                                color: #ccc;
                            }
                            .flip-clock-wrapper a:hover {
                                color: #fff;
                            }
                            .flip-clock-wrapper ul {
                                list-style: none;
                            }
                            .flip-clock-wrapper.clearfix:before,
                            .flip-clock-wrapper.clearfix:after {
                                content: " ";
                                display: table;
                            }
                            .flip-clock-wrapper.clearfix:after {
                                clear: both;
                            }
                            .flip-clock-wrapper.clearfix {
                                *zoom: 1;
                            } /* Main */
                            .flip-clock-wrapper {
                                font: normal 11px "Helvetica Neue", Helvetica, sans-serif;
                                -webkit-user-select: none;
                            }
                            .flip-clock-meridium {
                                background: none !important;
                                box-shadow: 0 0 0 !important;
                                font-size: 36px !important;
                            }
                            .flip-clock-meridium a {
                                color: #313333;
                            }
                            .flip-clock-wrapper {
                                text-align: center;
                                position: relative;
                                width: 100%;
                                margin: 1em;
                            }
                            .flip-clock-wrapper:before,
                            .flip-clock-wrapper:after {
                                content: " "; /* 1 */
                                display: table; /* 2 */
                            }
                            .flip-clock-wrapper:after {
                                clear: both;
                            } /* Skeleton */
                            .flip-clock-wrapper ul {
                                position: relative;
                                float: left;
                                margin: 5px;
                                width: 60px;
                                height: 90px;
                                font-size: 80px;
                                font-weight: bold;
                                line-height: 87px;
                                border-radius: 6px;
                                background: #000;
                            }
                            .flip-clock-wrapper ul li {
                                z-index: 1;
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                line-height: 87px;
                                text-decoration: none !important;
                            }
                            .flip-clock-wrapper ul li:first-child {
                                z-index: 2;
                            }
                            .flip-clock-wrapper ul li a {
                                display: block;
                                height: 100%;
                                -webkit-perspective: 200px;
                                -moz-perspective: 200px;
                                perspective: 200px;
                                margin: 0 !important;
                                overflow: visible !important;
                                cursor: default !important;
                            }
                            .flip-clock-wrapper ul li a div {
                                z-index: 1;
                                position: absolute;
                                left: 0;
                                width: 100%;
                                height: 50%;
                                font-size: 80px;
                                overflow: hidden;
                                outline: 1px solid transparent;
                            }
                            .flip-clock-wrapper ul li a div .shadow {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                z-index: 2;
                            }
                            .flip-clock-wrapper ul li a div.up {
                                -webkit-transform-origin: 50% 100%;
                                -moz-transform-origin: 50% 100%;
                                -ms-transform-origin: 50% 100%;
                                -o-transform-origin: 50% 100%;
                                transform-origin: 50% 100%;
                                top: -0.1px;
                            }
                            .flip-clock-wrapper ul li a div.up:after {
                                content: "";
                                position: absolute;
                                top: 44px;
                                left: 0;
                                z-index: 5;
                                width: 100%;
                                height: 3px;
                                background-color: #000;
                                background-color: rgba(0, 0, 0, 0.4);
                            }
                            .flip-clock-wrapper ul li a div.down {
                                -webkit-transform-origin: 50% 0;
                                -moz-transform-origin: 50% 0;
                                -ms-transform-origin: 50% 0;
                                -o-transform-origin: 50% 0;
                                transform-origin: 50% 0;
                                bottom: 0;
                                border-bottom-left-radius: 6px;
                                border-bottom-right-radius: 6px;
                            }
                            .flip-clock-wrapper ul li a div div.inn {
                                position: absolute;
                                left: 0;
                                z-index: 1;
                                width: 100%;
                                height: 200%;
                                color: #ccc;
                                text-shadow: 0 1px 2px #000;
                                text-align: center;
                                background-color: #333;
                                border-radius: 6px;
                                font-size: 70px;
                            }
                            .flip-clock-wrapper ul li a div.up div.inn {
                                top: 0;
                            }
                            .flip-clock-wrapper ul li a div.down div.inn {
                                bottom: 0;
                            } /* PLAY */
                            .flip-clock-wrapper ul.play li.flip-clock-before {
                                z-index: 3;
                            }
                            .flip-clock-wrapper .flip {
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
                            }
                            .flip-clock-wrapper ul.play li.flip-clock-active {
                                -webkit-animation: asd 0.01s 0.49s linear both;
                                -moz-animation: asd 0.01s 0.49s linear both;
                                animation: asd 0.01s 0.49s linear both;
                                z-index: 5;
                            }
                            .flip-clock-divider {
                                float: left;
                                display: inline-block;
                                position: relative;
                                width: 20px;
                                height: 100px;
                            }
                            .flip-clock-divider:first-child {
                                width: 0;
                            }
                            .flip-clock-dot {
                                display: block;
                                background: #323434;
                                width: 10px;
                                height: 10px;
                                position: absolute;
                                border-radius: 50%;
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                                left: 5px;
                            }
                            .flip-clock-divider .flip-clock-label {
                                position: absolute;
                                top: -1.5em;
                                right: -86px;
                                color: black;
                                text-shadow: none;
                            }
                            .flip-clock-divider.minutes .flip-clock-label {
                                right: -88px;
                            }
                            .flip-clock-divider.seconds .flip-clock-label {
                                right: -91px;
                            }
                            .flip-clock-dot.top {
                                top: 30px;
                            }
                            .flip-clock-dot.bottom {
                                bottom: 30px;
                            }
                            @-webkit-keyframes asd {
                                0% {
                                    z-index: 2;
                                }
                                100% {
                                    z-index: 4;
                                }
                            }
                            @-moz-keyframes asd {
                                0% {
                                    z-index: 2;
                                }
                                100% {
                                    z-index: 4;
                                }
                            }
                            @-o-keyframes asd {
                                0% {
                                    z-index: 2;
                                }
                                100% {
                                    z-index: 4;
                                }
                            }
                            @keyframes asd {
                                0% {
                                    z-index: 2;
                                }
                                100% {
                                    z-index: 4;
                                }
                            }
                            .flip-clock-wrapper ul.play li.flip-clock-active .down {
                                z-index: 2;
                                -webkit-animation: turn 0.5s 0.5s linear both;
                                -moz-animation: turn 0.5s 0.5s linear both;
                                animation: turn 0.5s 0.5s linear both;
                            }
                            @-webkit-keyframes turn {
                                0% {
                                    -webkit-transform: rotateX(90deg);
                                }
                                100% {
                                    -webkit-transform: rotateX(0deg);
                                }
                            }
                            @-moz-keyframes turn {
                                0% {
                                    -moz-transform: rotateX(90deg);
                                }
                                100% {
                                    -moz-transform: rotateX(0deg);
                                }
                            }
                            @-o-keyframes turn {
                                0% {
                                    -o-transform: rotateX(90deg);
                                }
                                100% {
                                    -o-transform: rotateX(0deg);
                                }
                            }
                            @keyframes turn {
                                0% {
                                    transform: rotateX(90deg);
                                }
                                100% {
                                    transform: rotateX(0deg);
                                }
                            }
                            .flip-clock-wrapper ul.play li.flip-clock-before .up {
                                z-index: 2;
                                -webkit-animation: turn2 0.5s linear both;
                                -moz-animation: turn2 0.5s linear both;
                                animation: turn2 0.5s linear both;
                            }
                            @-webkit-keyframes turn2 {
                                0% {
                                    -webkit-transform: rotateX(0deg);
                                }
                                100% {
                                    -webkit-transform: rotateX(-90deg);
                                }
                            }
                            @-moz-keyframes turn2 {
                                0% {
                                    -moz-transform: rotateX(0deg);
                                }
                                100% {
                                    -moz-transform: rotateX(-90deg);
                                }
                            }
                            @-o-keyframes turn2 {
                                0% {
                                    -o-transform: rotateX(0deg);
                                }
                                100% {
                                    -o-transform: rotateX(-90deg);
                                }
                            }
                            @keyframes turn2 {
                                0% {
                                    transform: rotateX(0deg);
                                }
                                100% {
                                    transform: rotateX(-90deg);
                                }
                            }
                            .flip-clock-wrapper ul li.flip-clock-active {
                                z-index: 3;
                            } /* SHADOW */
                            .flip-clock-wrapper ul.play li.flip-clock-before .up .shadow {
                                background: -moz-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: -webkit-gradient(
                                    linear,
                                    left top,
                                    left bottom,
                                    color-stop(0%, rgba(0, 0, 0, 0.1)),
                                    color-stop(100%, black)
                                );
                                background: linear, top, rgba(0, 0, 0, 0.1) 0%, black 100%;
                                background: -o-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: -ms-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: linear, to bottom, rgba(0, 0, 0, 0.1) 0%, black 100%;
                                -webkit-animation: show 0.5s linear both;
                                -moz-animation: show 0.5s linear both;
                                animation: show 0.5s linear both;
                            }
                            .flip-clock-wrapper ul.play li.flip-clock-active .up .shadow {
                                background: -moz-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: -webkit-gradient(
                                    linear,
                                    left top,
                                    left bottom,
                                    color-stop(0%, rgba(0, 0, 0, 0.1)),
                                    color-stop(100%, black)
                                );
                                background: linear, top, rgba(0, 0, 0, 0.1) 0%, black 100%;
                                background: -o-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: -ms-linear-gradient(
                                    top,
                                    rgba(0, 0, 0, 0.1) 0%,
                                    black 100%
                                );
                                background: linear, to bottom, rgba(0, 0, 0, 0.1) 0%, black 100%;
                                -webkit-animation: hide 0.5s 0.3s linear both;
                                -moz-animation: hide 0.5s 0.3s linear both;
                                animation: hide 0.5s 0.3s linear both;
                            } /*DOWN*/
                            .flip-clock-wrapper ul.play li.flip-clock-before .down .shadow {
                                background: -moz-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: -webkit-gradient(
                                    linear,
                                    left top,
                                    left bottom,
                                    color-stop(0%, black),
                                    color-stop(100%, rgba(0, 0, 0, 0.1))
                                );
                                background: linear, top, black 0%, rgba(0, 0, 0, 0.1) 100%;
                                background: -o-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: -ms-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: linear, to bottom, black 0%, rgba(0, 0, 0, 0.1) 100%;
                                -webkit-animation: show 0.5s linear both;
                                -moz-animation: show 0.5s linear both;
                                animation: show 0.5s linear both;
                            }
                            .flip-clock-wrapper ul.play li.flip-clock-active .down .shadow {
                                background: -moz-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: -webkit-gradient(
                                    linear,
                                    left top,
                                    left bottom,
                                    color-stop(0%, black),
                                    color-stop(100%, rgba(0, 0, 0, 0.1))
                                );
                                background: linear, top, black 0%, rgba(0, 0, 0, 0.1) 100%;
                                background: -o-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: -ms-linear-gradient(
                                    top,
                                    black 0%,
                                    rgba(0, 0, 0, 0.1) 100%
                                );
                                background: linear, to bottom, black 0%, rgba(0, 0, 0, 0.1) 100%;
                                -webkit-animation: hide 0.5s 0.3s linear both;
                                -moz-animation: hide 0.5s 0.3s linear both;
                                animation: hide 0.5s 0.2s linear both;
                            }
                            @-webkit-keyframes show {
                                0% {
                                    opacity: 0;
                                }
                                100% {
                                    opacity: 1;
                                }
                            }
                            @-moz-keyframes show {
                                0% {
                                    opacity: 0;
                                }
                                100% {
                                    opacity: 1;
                                }
                            }
                            @-o-keyframes show {
                                0% {
                                    opacity: 0;
                                }
                                100% {
                                    opacity: 1;
                                }
                            }
                            @keyframes show {
                                0% {
                                    opacity: 0;
                                }
                                100% {
                                    opacity: 1;
                                }
                            }
                            @-webkit-keyframes hide {
                                0% {
                                    opacity: 1;
                                }
                                100% {
                                    opacity: 0;
                                }
                            }
                            @-moz-keyframes hide {
                                0% {
                                    opacity: 1;
                                }
                                100% {
                                    opacity: 0;
                                }
                            }
                            @-o-keyframes hide {
                                0% {
                                    opacity: 1;
                                }
                                100% {
                                    opacity: 0;
                                }
                            }
                            @keyframes hide {
                                0% {
                                    opacity: 1;
                                }
                                100% {
                                    opacity: 0;
                                }
                            }
                        </style>`;
                    const info = this.formated_Time;
                    const pref = "flip-clock-";
                    const html = `
                    <div
                        id="clock_box"
                        style="
                            top: 2%;
                            width: 20%;
                            float: left;
                            left: 50px;
                            z-index: 1000;
                            position: fixed;
                        "
                    >
                        ${css}
                        <div id="content">
                            <div class="clock flip-clock-wrapper" id="flipclock">
                                <span class="flip-clock-divider"
                                    ><span class="flip-clock-label"></span
                                    ><span class="flip-clock-dot top"></span
                                    ><span class="flip-clock-dot bottom"></span
                                ></span>
                                <ul class="flip ahour">${this.create_Module(
                                    pref + "before",
                                    info.before[0]
                                )}${this.create_Module(
                        pref + "active",
                        this.time_arr[0]
                    )}</ul>
                                <ul class="flip bhour">${this.create_Module(
                                    pref + "before",
                                    info.before[1]
                                )}${this.create_Module(
                        pref + "active",
                        this.time_arr[1]
                    )}</ul>
                                <span class="flip-clock-divider"
                                    ><span class="flip-clock-label"></span
                                    ><span class="flip-clock-dot top"></span
                                    ><span class="flip-clock-dot bottom"></span
                                ></span>
                                <ul class="flip play aminute">${this.create_Module(
                                    pref + "before",
                                    info.before[2]
                                )}${this.create_Module(
                        pref + "active",
                        this.time_arr[2]
                    )}</ul>
                                <ul class="flip play bminute">${this.create_Module(
                                    pref + "before",
                                    info.before[3]
                                )}${this.create_Module(
                        pref + "active",
                        this.time_arr[3]
                    )}</ul>
                                <ul class="flip-clock-meridium">
                                    <li><a href="#">${(this.currentHour =
                                        this.getCurrentHour_status(
                                            info.hour
                                        ))}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
                    document.body.insertAdjacentHTML("beforeend", html);
                    this.event();
                },
                getCurrentHour_status(hour) {
                    return hour > 11 ? "PM" : "AM";
                },
                currentHour: "",
                get Date_format() {
                    const date = new Date();
                    const h = date.getHours();
                    const hs = "".slice.call(`0${h.toString()}`, -2);
                    const ms = "".slice.call(
                        `0${date.getMinutes().toString()}`,
                        -2
                    );
                    return { h: h, string: hs + ms };
                },
                change(node) {
                    const time = this.Date_format;
                    [...time.string].forEach(
                        (s, index) =>
                            s !== this.time_arr[index] &&
                            this["f" + index](node, s, index)
                    );
                    const ts = this.getCurrentHour_status(time.h);
                    ts !== this.currentHour &&
                        this.change_time_status(node, ts);
                },
                get clock_box() {
                    return document.getElementById("clock_box");
                },
                event() {
                    setTimeout(() => {
                        const clock = this.clock_box;
                        let id = setInterval(() => {
                            !this.paused && this.change(clock);
                            if (this.firstRun) {
                                clearInterval(id);
                                setInterval(
                                    () => !this.paused && this.change(clock),
                                    60 * 1000
                                );
                            }
                        }, 1000);
                    }, 0);
                },
                /**
                 * @param {boolean} e
                 */
                set clock_paused(e) {
                    const box = this.clock_box;
                    box.style.display = e ? "none" : "block";
                    !e && this.change(box);
                    this.paused = e;
                },
                paused: false,
                main() {
                    this.clock();
                },
            },
            firstly: true,
            readerMode: false,
            get_article_title(node) {
                return node.getElementsByClassName("ContentItem-title")[0]
                    .innerText;
            },
            Reader(node) {
                /*
                1. adapted from http://www.360doc.com/
                2. css and html is adopted;
                3. rebuild js
                */
                const bgc = GM_getValue("articleBackground");
                const arr = new Array(7);
                let color = "#FFF";
                let bgcimg = "";
                if (bgc) {
                    for (let i = 1; i < 8; i++)
                        arr[i - 1] = bgc === `a_color${i}` ? " cur" : "";
                    if (bgc === "a_color7") {
                        const bgcM = `background-image: url(https://www.cnblogs.com/skins/coffee/images/bg_body.gif);`;
                        bgcimg = `background-image: url(${GM_getValue(
                            "readerbgimg"
                        )});`;
                        bgcimg.length < 50 &&
                            ((bgcimg = bgcM),
                            GM_setValue("readerbgimg_mark", false));
                    } else color = this.colors_list(bgc);
                } else {
                    arr.fill("", 0);
                    arr[5] = " cur";
                }
                let title = "";
                if (this.no_scroll) title = this.get_article_title(node);
                else {
                    title = get_Title();
                }
                const bgpic = GM_getValue("bgpreader");
                const meta = node.getElementsByClassName(
                    "AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related"
                );
                const mBackup =
                    '<div class="AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related" itemprop="author" itemscope="" itemtype="http://schema.org/Person">No_data</div>';
                const content = node.getElementsByClassName(
                    "RichText ztext CopyrightRichText-richText"
                );
                const cBackup = "No_data";
                const html = `
                <div
                    id="artfullscreen"
                    class="artfullscreen__"
                    tabindex="-1"
                    style="display: block; height: -webkit-fill-available; background-image: ${
                        bgpic ? `url(${bgpic})` : "none"
                    };"
                >
                    <style type="text/css">
                        div#artfullscreen {
                            width: 100%;
                            height: 100%;
                            background: #e3e3e3;
                            z-index: 999;
                            position: fixed;
                            left: 0;
                            top: 0;
                            text-align: left;
                            overflow: auto;
                            display: block;
                        }
                        div#artfullscreen__box {
                            padding: 32px 60px;
                            height: auto;
                            overflow: hidden;
                            background: ${color};
                            ${bgcimg}
                            box-shadow: 0 0 6px #999;
                            display: table;
                            margin: 20px auto;
                            min-height: 95%;
                        }
                        div#artfullscreen__box_scr {
                            word-break: break-word;
                            height: auto;
                            font-size: 16px;
                            color: #2f2f2f;
                            line-height: 1.5;
                            position: relative;
                        }
                        h2#titiletext {
                            font-size: 30px;
                            font-family: simhei;
                            color: #000;
                            line-height: 40px;
                            margin: 0 0 30px 0;
                            overflow: hidden;
                            text-align: left;
                            word-break: break-all;
                        }
                        section.end_article:before {
                            background: url(https://static.zhihu.com/heifetz/assets/bg@2x.033e5b2d.png)
                                repeat-x;
                            background-size: 20px 450px;
                            content: "";
                            height: 140px;
                            left: 0;
                            position: absolute;
                            width: 100%;
                        }
                    </style>
                    <div
                        id="artfullscreen__box"
                        class="artfullscreen__box"
                        style="width: 930px"
                    >
                        <div class="artfullscreen__box_scr" id="artfullscreen__box_scr">
                            <table style="width: 656px">
                                <tbody>
                                    <tr>
                                        <td id="artContent" style="max-width: 1000px">
                                            <h2 id="titiletext">
                                                ${title}
                                            </h2>
                                            ${
                                                meta.length > 0
                                                    ? meta[0].outerHTML
                                                    : mBackup
                                            }
                                            <hr>
                                            <div
                                                style="
                                                    width: 1200px;
                                                    margin: 0;
                                                    padding: 0;
                                                    height: 0;
                                                "
                                            ></div>
                                            <span class="RichText ztext CopyrightRichText-richText" itemprop="text" style="display: block; min-height: ${Math.floor(
                                                window.innerHeight * 0.52
                                            )}px;"></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <section
                                class="end_article"
                                data-role="outer"
                                mpa-from-tpl="t"
                                style="margin-top: 25px"
                            >
                                <section
                                    mpa-from-tpl="t"
                                    style="border-width: 0px; border-style: none; border-color: initial"
                                >
                                    <section mpa-from-tpl="t" style="color: rgb(51, 141, 175)">
                                        <section mpa-from-tpl="t" style="text-align: center">
                                            <section
                                                mpa-from-tpl="t"
                                                style="
                                                    margin-right: auto;
                                                    margin-left: auto;
                                                    width: 30px;
                                                    display: inline-block;
                                                "
                                            >
                                                <img
                                                    data-ratio="2.25"
                                                    data-w="44"
                                                    data-width="100%"
                                                    style="
                                                        display: block;
                                                        width: 30px !important;
                                                        height: auto !important;
                                                        visibility: visible !important;
                                                    "
                                                    _width="30px"
                                                    src="data:image/webp;base64,UklGRtQEAABXRUJQVlA4WAoAAAAQAAAAKwAAYgAAQUxQSFIEAAABoEVtmyFJett2d43RRk312LZto8a2bdu2bdu2bduKi47sExmL64iYADR2D9AopqiXPlXGW9C2+9O0aLtQpEPXIrdFcXQd1u39NDS13O6XcwuaZvqzj1NWXLRoLJozqxMZPHSYJPpSdi2lSqDhdLGQwCW+KRa6a7BhhBt0rMj6fpi/4RaQoSc5v/mZ10jkAvd+oaQbiun57rdzgPLloXQL835uB5LXAI8X7U1r+i4NUDYU3DuXNCmYdxuBqEIAM2ubs6MMoge4FfcBagubKXYRmmOlF+TIAFD3YQozau6pHtrKDgG5AVxa3vAxIUpUxHVAN8iSJIHDjzGY+EmAU7vlJMlEwtrrPUyYNd3q7Bg27gbRfoD3bpEN9TUEgMe+ha5RALlEekwUpxLg6R3jDaSeEYGPuvF/M0oIDgWKDg+v+zSVMhexDqmH1QmGHao36MYPb2W1jjeWRaQCu3gwvBAH/ZXtzYpDAvc4B8hYPzscu4FqV1ENaVxK5JbLOxVZYuLXhUl8szoasGq6ohO9stmRWi3IHfsJq5r8olPm8RL/jBg6z3+E2ue1Qmv0l8SnMqLnbDVzBTQc4wn4ZcPQcbzwVRIipkLt38GALdKId5NRulqUBN9qThBYwsnItZmvkjRzr9mQF8iMYdntcSg91N/bQ+ZdxMGgoyiLUm8xEsPc2ZEX2ZwRtdPXORm4lveWZJo2AUo5KvmzDcNcpQD8Ws8oT7HPs1FZeV15i0GVVIDHU7GgyZgjIr+S1QNwleVpCuBcvLK9iGvVD25Kvg/DsH2WBNKcYhUqU7zpYhDZlERW+lBGSdEyfgb2UolhSbCSwimR+/RyT0SKK/1QWtdqUKUDxoFrPjmpaZ3OYHB8IqiSH4WWqnSLl9lGkMhSgxxV1H1Hv3KyCS0TMeRRGCqHn8hcZbgkaHWIQfwjYUWl10fbkMOTJG1HYJhLZEBpUREV9aapZH4xg1ZrolA7cmww8rhVSP2O3bOheOMYDKdMluQQ11B+65HRnsIJ6ovRqD883iD7HoCuwo6J1yoYzJ0DFBGNMFPsNLhXDPyFHVNfbJZVeArMnY65F7bL1q6HVEswed1+2b3S0KWCWZMPSgo8ccGjuLNZnWVzz4KnC2bnWSm5PQgd3eeEAAF/bVowoBjQ9Ct6Fi0O7D2rSWBecBK9NSHcF5vIpIuzF32Euy7A2Rdo/HuLRslFe43KiliNJgs0vqDVq3EaWSajcUy8Ts78H/R1g/w9HTSJnePvLj5AaIjk0DZTHNpOmSAaW+f/LZ5gp2hn0DlCBQSlmL9r6J6/bkBGYUcacvtdkBogkKWLgdjXM5AmfSkyYaLYTEyzHa+Q3xDHMXP8r77dKrc+J2svRJwphITDDCH7K6pAppk3A5QlzCN2pYYU40Q+qDvgy3sIreKhjDz7FvVuUV2shgotK4sMtnbj1lrUgXdai4+YnbFWDUreaNuoqitm+5w409EGkJTEA1ZQOCBcAAAAcAQAnQEqLABjAD/9/v9/v7+2siwyCAPwP4lAGl0El7/GXCMPKbeEVZYcdyAA/rZXCbsO/EYZ22oUgntl2WUGQzlukL35hSeZcNpu+BEnH/cG+RlZ7AO2i62abAA="
                                                    crossorigin="anonymous"
                                                    alt="Image"
                                                    data-fail="0"
                                                />
                                            </section>
                                            <section mpa-from-tpl="t" style="font-size: 14px">
                                                —<span
                                                    data-brushtype="text"
                                                    style="padding-right: 5px; padding-left: 5px"
                                                    >END</span
                                                >—
                                            </section>
                                        </section>
                                    </section>
                                </section>
                                <p><br /></p>
                            </section>
                        </div>
                    </div>
                </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
                setTimeout(() => {
                    const f = this.full;
                    f.getElementsByClassName(
                        "RichText ztext CopyrightRichText-richText"
                    )[0].innerHTML =
                        content.length > 0 ? content[0].innerHTML : cBackup;
                    this.Navigator();
                    this.toolBar(arr);
                    this.creatEvent(f);
                }, 50);
            },
            Navigator() {
                //this css adapted from @vizo, https://greasyfork.org/zh-CN/scripts/373008-%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96sp
                const [statusl, titlel] = this.prevNode
                    ? ["", "previous answer"]
                    : [" disa", "no more content"];
                const [statusr, titler] = this.nextNode
                    ? ["", "next answer"]
                    : [" disa", "no more content"];
                const html = `
                        <<div id="reader_navigator">
                            <style type="text/css">
                                .readerpage-l,
                                .readerpage-r {
                                    width: 300px;
                                    height: 500px;
                                    overflow: hidden;
                                    cursor: pointer;
                                    position: fixed;
                                    top: 0;
                                    bottom: 0;
                                    margin: auto;
                                    z-index: 1000;
                                }
                                .readerpage-l.disa,
                                .readerpage-r.disa {
                                    cursor: not-allowed;
                                }
                                .readerpage-l:hover,
                                .readerpage-r:hover {
                                    background: rgba(100, 100, 100, 0.03);
                                }
                                .readerpage-l::before,
                                .readerpage-r::before {
                                    content: '';
                                    width: 100px;
                                    height: 100px;
                                    border-left: 2px solid #ADAFB0;
                                    border-bottom: 2px solid #ADAFB0;
                                    position: absolute;
                                    top: 0;
                                    bottom: 0;
                                    margin: auto;
                                }
                                .readerpage-l:hover::before,
                                .readerpage-r:hover::before {
                                    border-color: #fff;
                                }
                                .readerpage-l {
                                    left: 0;
                                }
                                .readerpage-l::before {
                                    left: 45%;
                                    transform: rotate(45deg);
                                }
                                .readerpage-r {
                                    right: 0;
                                }
                                .readerpage-r::before {
                                    right: 45%;
                                    transform: rotate(225deg);
                                }
                                @media (max-width: 1280px) {
                                    .readerpage-l,
                                    .readerpage-r {
                                        width: 150px;
                                    }
                                }
                            </style>
                            <div class="readerpage-l${statusl}" title=${escapeBlank(
                    titlel
                )}></div>
                            <div class="readerpage-r${statusr}" title=${escapeBlank(
                    titler
                )}></div>
                        </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
            },
            check_answer_collected(qid, aid) {
                return collect_Answers.length === 0
                    ? false
                    : collect_Answers.some((e) =>
                          e.qid === qid
                              ? e.data.some((n) => n.aid === aid)
                              : false
                      );
            },
            change_Collected(tool, result) {
                const b =
                    tool.lastElementChild.lastElementChild
                        .previousElementSibling.previousElementSibling;
                const cl = b.className;
                const tmp = cl.endsWith(" on")
                    ? result
                        ? null
                        : cl.slice(0, cl.length - 3)
                    : result
                    ? cl + " on"
                    : null;
                if (tmp) {
                    b.className = tmp;
                    b.title = tmp.endsWith(" on")
                        ? `cancel the collection of ${this.content_type}`
                        : `add the ${this.content_type} to collection`;
                }
                tool = null;
            },
            check_article_collected(tool, aid) {
                dataBaseInstance.TableName = "collection";
                dataBaseInstance.check(aid).then(
                    (result) => this.change_Collected(tool, result),
                    () =>
                        colorful_Console(
                            {
                                title: "Warning:",
                                content: "failed to check article collection",
                            },
                            colorful_Console.colors.warning
                        )
                );
            },
            get_pocket_ico(f) {
                return f
                    ? "data:image/webp;base64,UklGRnwEAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSMUDAAABoGttm9ra+eYfsCTbAotleYeZk4qTGzhlGCpmTtpcQFZ6ZqrOvoR0qU8f5qRi2KhZSx5JYznpI8KBG0mOUt19ZJhjA8wXsBZrBQtxIRhAREM1DVbKGONCEGwgb+qR8jwFKwkpiRFr4VIpATtxPwh834WlJo4SfI1QjgJsvVhEU9jC3NYAuHKmM27LPE2TWNii/KmjCEw6jh+Gwg4/z4M0S4Xl7Sicuq5kTCmoKE6EDUFRBBBZkUkbnDT2GXMmnASASZrncpiwqkIAsqgKOYxX5BEDmBLMPI2iKo3iGO8q2TktMQpwVjsrhxuibqoqNt+PdytZ1pUEsd6P8Dk6mvnznnLWTOs6o+Fvoq4rBzjtxO2G7nv00ftu7+quRx595K72A26+AmBtVqucMKxpfVpw6cl/9GZqTt2yLnBVkN0ki+7Z0/p4M2mtX+Ir2xCu2tMHzaY6PNIvhpVdwLCrD3TTbHa70Uf698vALHPaP7oxstkVfagfgbCC44Q+XmdjH+pXwC25vUWPwgdg/2f0f4GPts7JrbO7UJbcN94hqaUV/NHx7l7sLG2c+OPxAepVNezwNP++EVHLusfmGg6q0/io805WddHdZh0G+EWVjDxvZVXlAuCu4N6MzbMiHH3ey6JIBfc9QZ4fJlmwhXUj8ywOA49hEkSJv5V1J9Mk8glQLQvaIuQFQZIltIUb2fqGy8hzMc+KVG7nKXOPk4TxRuW23oiz7rx179jSvO1bNw+NvW62vm63vm/8F/cti5c1jW6OjnXTWO2b9gzEqOOo9Zj79lC0/vRXfdh6xN+NwTyMS380PLDuNmIo94PjvJ8Mj4ZFRNdjMRz0eSSG0+9xnjIYGzebvNEdLT15dp1hm+zGypLbWppOXvArQq8v+sV00/JxtJI2MHH1njZWyZHW9/PTVnmv3eCmX4w/hY3e10/NT1/a2NtZvKf3jprjA+MVi7rXsjo9uOgnvX/cHO/pb4PJalkN2y3reP6JNnQvOBDVdU7d1KWL874yivrjOpBXL4uuO31DXiYc4oVTv/+0ew2MeqPlMiUj5bKU4Ehf/uzPb948GwR4VZkJM9zoW5IsJjCAginQOd2wLBMCZF4aJ0mACt1OVW6exRxgkmiioKJFaHwMB8AIHQV5HrNO39QtiDpVOcki4GyiiEnHmQc+g5X8LIuSrLclY/19WzBzHMlAyvGmlgFmcRwvBCwlZ54jN+9bwzCaM2zS+K7hQk2kbea+HwQzW0vV6ZsZSEpu2Rm7Dk08z7Ez53yg9ycbiIitCxRWNXWfCwBWUDggkAAAABAGAJ0BKkAAQAA//f7/f7+/t7IuEkxz8D+JaQANj8ImUrf0+gklgPogA0QMNUEJ7ufWDDUoyfbyAADM/9OIuT8zVXHQEz9GERQz6D+Z2WY1H89EFBYpFxQabQln+zAJuu5JdnmGILbGTkWvT7K3/qiKohH9n5X17smtGsW3pSOYgFzfI+596XJeZjAGd4AAAA=="
                    : "data:image/webp;base64,UklGRpYFAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSLUEAAABoGvbthrL2ZdUKlVJKhDDq9dmxsyRhyPOmKm5zcx2xh/QkZmZ/QHtjswQMjMz3jFUuldH/QUR4UiSpLipqT6gFTsQBF/AslhTIJSQkgGc864+dfaUMSak5KDAvZHHHc9zQCqpFGecNQjlOBK0EkEYBsEQxBq4jhRLpOM6ANXZbDoCFTZsBCAcdzQWVPw4juaSihOMXIeDKdcNJhNJI0jTME5iSWxPJ6PhUDHmOHCm80hSCLMshEyyRFFw43nAmDsQXAIYxGmqupkUxQSAyopMdeNl6ZQBzJGs/TOyIm91jgmzopVF1OqAW6/UrmgVN1MU8/bzhNmTsioUOLO+IhAwahz4lu4sGVVV0j1QvaoqXGBxzEmtWnvuuWtPMuvUzeduPrV5wbEHAqxJXaeUcT6qFuF+T/yi+9Xfrx+/7GCdcdogm57+p94BdbuoqeE4uMm2c0+0n7Wf3HLqmXf8o/WNk4IWMDyp9dYIgAhDQfpbQh84/Df94/5gxCx+0duTcuHGq6uxoJS7sljxcJPWWyBJCByj9blYU9V1PQOtVFlV6SG/6a0QRE7S+kQETSKAbJ3v8p2+D4zOSYgbSkVlVNf57t/3RKzWyVJysnTPH/qxNlydYbSUGs52/0E/0IdzwxhoSwww+0E/0QshYEoM/O/1EzOHyNqmAQGLtMD/Tj8RVYqEOHd5m4DN7hg8MFspKUaBgdWumNyHqi66nSyCtW3s2mPFKSuL7Q6FxUKc1KZDW+wwVVSZOc26DAiyIoJBl2a6gCqKVAJiKIU3Zn6STYRJp+10A5VlsRSBJ7kXTKIkhIVOW7McBag0mU9Cj2EQTqMANjqtMw4aUHE0DTjgNMx4H0rVE+6FYZREnNzIlxIbybIxZNwbwk+yWBEvyfhoKf0S3xNcofWg3HhQZ4CWPR4kmDluhye36I5hj3Fr+242tuiMRcJ3Q/5uu2K187slzhsnQ9jCwBkgLHbMG9R5ayOEPYADgJla5y36vOkpew575p3tFwDc1DJv9pm3S25GYJ1e1qNW+8/ba8PVjJtZr/X/L32r9RNWW+tG33Urt0Vvxn6fd9isW/3XTWvWQ2B3wx21biJoSLkt0qoqdwBYrcuqLiyBVVnWZd63cWZzCZstgkvNWGV1VarBnr3X3ZJBiCvMWH0qL2oJZH0edKLW53nKeNply3T4Ys44Q9Bn3J6l9Vo4rJUrg4LD6t5faf0UIDH8Vj8ZU7+bdVpfB2Dj8qxY1KnVYXho4+MCOOAPffd0UVIcpQf/on958q7n/m/dMausqmI13Kc5+dpd9374vz4Di6rodljUo/N1u9ZBANOqMlVFlQ+xx6e6VS8Ao7LMTI19Q5rFHCe+/O13X287EhxoLMuYt5KXuYLEyn2ffvfduze5YPCKPJHtCNkwiJI5AwN83zeXckzyPOKASvPWj+SA5/tO+5cO02QuAKY4HzhwprMJA1pDxRIgTNM5s+2bWKtD3Pijolko2MDhTLmuHwYMpAqSZBolEXnfFo5dVzFwx/VGxADj+Xw+IwZQY89V/fetk8nUZ+iz8V0ipDNQ1PhBEIZjqsox9s0MXClB3BkPXT7wPJemEKJj788pcN5aeIQk9cm8FgBWUDggugAAANAHAJ0BKkAAQAA//f7/f7+6v7+oFA1T8D+JaQANi0QOJXBoKdiIBnAXCgp3qen7fvtcKjwNXA2QZ6PBbFK72dug46kcWHwAAMz/04i5PzOGoTXtS3giZtgpUNd3SnJzoqXXuqkHfniGeO/uELS/XADxhhv9u+5dWGtFF45Pg0DNnKK/whETOV627vbgsGVivDelEzAjy5AudHYhB0mtYPO9IG9//Mdp96HrUJ6XPQxCD4st5f1lGCgAAA==";
            },
            get check_pocket() {
                const recent = GM_getValue("recent");
                return (
                    recent &&
                    Array.isArray(recent) &&
                    recent.length > 0 &&
                    recent.some(
                        (r) => r.url.endsWith(`/${this.aid}`) && r.type === "p"
                    )
                );
            },
            toolBar(arr) {
                let collected = false;
                collect_Answers = GM_getValue("collect_a");
                collect_Answers && Array.isArray(collect_Answers)
                    ? this.content_type === "answer" &&
                      (collected = this.check_answer_collected(
                          this.qid,
                          this.aid
                      ))
                    : (collect_Answers = []);
                const is_pocket = this.check_pocket;
                const gifBase64 = `
                data:image/gif;base64,R0lGODlhDQANAKIGABYcHwIEBP3///P7//T7/xccH////wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3QzgxQkMzRUZGNDExRTVBQ0VCQTYwQ0ZDNzdGMDlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ3QzgxQkM0RUZGNDExRTVBQ0VCQTYwQ0ZDNzdGMDlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDdDODFCQzFFRkY0MTFFNUFDRUJBNjBDRkM3N0YwOUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDdDODFCQzJFRkY0MTFFNUFDRUJBNjBDRkM3N0YwOUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAAGACwAAAAADQANAAADHWi63P7QlKgKoRbfFVpmA7B8TWgAQ0QUKSVQcGwkADs=`;
                const jpgBase64 = `
                data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAICAgICAgICAgICAgICAwQDAgIDBAUEBAQEBAUGBQUFBQUFBgYGBgcGBgYICAkJCAgLCwsLCwsLCwsLCwsLCwv/2wBDAQMDAwUEBQgGBggMCggKDA4NDQ0NDg4LCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwv/wgARCAARABEDAREAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAYHA//EABoBAAICAwAAAAAAAAAAAAAAAAAFAQQCAwb/2gAMAwEAAhADEAAAAbK7GNBQUtl+lsVGiDqpjeWAEBlP/8QAGBABAAMBAAAAAAAAAAAAAAAAAwABEyD/2gAIAQEAAQUChmecAAsQALDj/8QAHBEAAgICAwAAAAAAAAAAAAAAAQIDIQASEBEg/9oACAEDAQE/Acdj2b4kkbY2cjjXUV5//8QAHREAAgEEAwAAAAAAAAAAAAAAAQIAAxESIRAgMf/aAAgBAgEBPwGlSTAaHkvwiLiNRnN+v//EAB8QAQACAQMFAAAAAAAAAAAAAAECAwARElEQICIyQf/aAAgBAQAGPwLIeEPU+dKVpqVhHV2nGUrTUrCOrtOO3//EAB0QAQACAQUBAAAAAAAAAAAAAAEAEWEQICExUYH/2gAIAQEAAT8hAo4OohVlsaeaIwCSxaYjrYkRVGJ92f/aAAwDAQACAAMAAAAQymQkH//EAB4RAAEEAQUAAAAAAAAAAAAAAAEAEDFBESFRYXHB/9oACAEDAQE/EEHrJ9YcYmNndEEwgVwsMK7b/8QAHREBAAEDBQAAAAAAAAAAAAAAATEAEUEQICFRYf/aAAgBAgEBPxBisTB1Sr6OuCDHlFfLLnb/AP/EAB0QAQACAQUBAAAAAAAAAAAAAAEAESEQMVGBwdH/2gAIAQEAAT8Qz/bZqO2ZVlUZWp0xz9iiEVWy3HpfXglVsqyiOevIffNP/9k=`;
                const html = `
                <div
                    class="artfullscreen_toolbar"
                    id="artfullscreen_toolbar"
                    style="z-index: 9999; left: 1540px"
                >
                    <style type="text/css">
                        .artfullscreen_toolbar {
                            width: 24px;
                            height: 166px;
                            position: fixed;
                            top: 15px;
                        }
                        a#artfullscreen_closer {
                            color: #4a4a4a;
                            width: 30px;
                            height: 24px;
                            line-height: 24px;
                            text-align: center;
                            display: block;
                            font-size: 28px;
                            font-weight: bold;
                            text-decoration: none;
                            float: right;
                        }
                        .artfullscreen_toolbar>div {
                            height: 19px;
                            clear: both;
                            padding: 18px 3px 0 0;
                        }
                        .artfullscreen_toolbar .a_colorlist,.artfullscreen_toolbar .fschange {
                            box-shadow: 0 0 5px #ccc;
                        }
                        .artfullscreen_toolbar .fschange input {
                            margin-right: 2px;
                        }
                        .artfullscreen_toolbar .a_bgcolor {
                            margin-left: 0;
                        }
                        .a_colorlist {
                            z-index: 2;
                            width: 146px;
                            height: 35px;
                            border: 1px solid #cbcbcb;
                            background: #fff;
                            position: absolute;
                            right: 38px;
                            top: 30px;
                            text-align: center;
                            display: none;
                        }
                        .a_colorlist span {
                            display: inline-block;
                            width: 13px;
                            height: 13px;
                            overflow: hidden;
                            border: solid 1px #cbcbcb;
                            margin: 10px 1px 0;
                            cursor: pointer;
                            font-size: 12px;
                        }
                        .a_colorlist img {
                            vertical-align: top;
                            visibility: hidden;
                        }
                        .a_colorlist .cur img {
                            visibility: visible !important;
                        }
                        .a_color1 {
                            background: #E3EDCD !important;
                        }
                        .a_color2 {
                            background: #f5f1e6 !important;
                        }
                        .a_color3 {
                            background: #B6B6B6 !important;
                        }
                        .a_color4 {
                            background: #FFF2E2 !important;
                        }
                        .a_color5 {
                            background: #FAF9DE !important;
                        }
                        .a_color6 {
                            background: #FFF !important;
                        }
                        .a_color7 {
                            background: #EC9857 !important;
                        }
                        button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel.on {
                            color: #00a1d6;
                        }
                    </style>
                    <a href="#" class="artfullscreen_closer" id="artfullscreen_closer" title="exit reader">×</a>
                    <div class="d1">
                        <div class="a_bgcolor">
                            <img src=${jpgBase64} style="height: 20px; width:20px; margin-left: -1px;" />
                            <div class="a_colorlist" style="display: none">
                                <span class="a_color1${arr[0]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color2${arr[1]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color3${arr[2]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color4${arr[3]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color5${arr[4]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color6${arr[5]}">
                                    <img src=${gifBase64}
                                /></span>
                                <span class="a_color7${
                                    arr[6]
                                }" title="background image">
                                    <img src=${gifBase64}
                                /></span>
                            </div>
                        </div>
                    </div>
                    <div class="background_image_c">
                        <style>
                        i {
                            height: 20px;
                            width: 24px;
                            margin-left: -3px;
                        }
                        </style>
                        <i
                            class="disable_bgp"
                            title="disable background image"
                            style="
                                content: url(data:image/webp;base64,UklGRoYDAABXRUJQVlA4WAoAAAAQAAAAHwAAHAAAQUxQSHQAAAABcFpt27I8//+jkUyFSiM6K9gC7lJtA/dsg5AYg/wvgLu+T6RFxASAH5uO5SceANMbMwdgRMn8PdK0Em1tZ93itCFtBHRP219312/GgNPv+zW0+qYJ0fD+k+6WsY4+HKqKDGwt/WVTMUNac9WWs5IDVE3FW1ZQOCDsAgAAEBMAnQEqIAAdAAAAACWwAnTKEcDejcULpl2z/UDKBOSf7v9wG8AdJrzAfrt+wHvj9IB+pvWAegB+lfpX/q78F37aeiVS3Hsf4vZKz6h+M37K/5XUAfzb8lPyAzgL4j/fPyZ1FH8KNdP/afyA94v+c+0D3AfOHsG/x7+T/2H+lftv++fgl9CX9QDs1vSZ+2lIhDZEVPHFNXIeCcu1zz9q8EAA/ph619ye+i1z6yyB0W87w+sCb5ZfdRcyc+R/5xg/b3qq74A2JFBK4oWD9CpSr+Ztv/y2Ot1EI+tWF7OhfJgOslb8PiByA2R7J5IaVWDUZ4Lp+1dTne+D5XLV1PIJD4Cu2pPd7KigzixVtmMYzbJ7w9h/3d6SfxWDZ3U5GF3PsT+z5nRwSy5/+MXnmME6vjxj7h28b/+uWsCcq+Ds5GpqUhmzmIPu76Yfx2+Ph/hLrwA/bXE8M4y/DzQ/HFAwGXT3RfFh+B+NUT56NGSG/+LWeS90TXFnUj0oqDPOkWnmuWd0oxkzC7d+zj8kG4l9Q3wRDqMeuVTCBSXqhhWzh9eNz5v0R1QZcGjOB+UZiZpJu//Bq8nbAiSJ2/84bD/lRPfGmNnK9b5rLA1XPpxbL1Gw5L+YPE+7T2Vezk/h3vgpXB6yRfJp1XLXt1W99QcN7frmmdNaf+1Qbfdu+Z2W///GR///XwuSiM+qdGrebPsv09Ep2R3wqB+ChHXV/Z/Pm6AFfwg/06j/9M0s9Ay8gN2DYM47L3GeOEEizlAjOmD60Ql7z5XxBB6gjW0OHLVnSR5bh3OdqByY55iesx/gZA/GDlEwwVUDiRvI/Q49LjNowizJ8DmvJca1/996hAmt74v/g62d//9zG53dUXQnYzMRblNZdkPS18XiBAXbSFA89qKun+xtcdgV8oSKcuZQOCcPwuQYwh8Q13z/ZB/m45acyK1RPyZvf6s6/nA6AzC8AntaLnfUn1SZ7Pu+do4aPlIVeeZ/uxZf9AAAAA==);
                            "
                            >disable</i
                        >
                        <i
                            class="change_bgp"
                            title="click to change background image"
                            style="
                                margin-top: 10px;
                                content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAdCAMAAAD8QJ61AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC7lBMVEVUXnMAAABTX3QmuZk5k4lAhYNUXnNSXHFPWm9QWm9TXXJUXnNSXHFPWm9OWG5SWXA8jockuZgmuZkmuZkmuZlQWm8muZlTXXJibH93gJB3f5Bwg5AzrZYmuZlUXnNRW3BMVmxMVWxJX3ApsZYmuZklupkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZkmuZltdoiSmaaRmaaQl6Vlb4Hu8vPu8vLv8vPp7e9/h5fCx86aoa2boq6aoq6Zoa6aoa7M0dbp7u9/h5bv8/OdpLBQWnBRW3FXYHBucW1lam5SXHFRXHGwtr/r7/CeprFeZXK0pmTnzFzcw16PimpUXnOxt8BQWnKGhGvw01r01lr211rZwl5lanBTXXNPWnKSjWnz1VrjyV1rb29RW3JpbXDUvl/111ry1VqvomVXYHNSYHRRYXRVXXNxc26WkGmNiWpeZnEug30oiX9NZXVRXHNTXnNUXXNTX3MygHwSn4UQoYUjjoBKaHZSYXRPaHc2e3sTnoQRoIUfkoFHa3ZSY3U6kYgwpZFMb3pVXXJVXnM7d3oUnYQek4JGbHdPZ3c3l4smuZklupowppFLcHo+c3kXmoMclYJCbneyt8BNbXkyoY8mupkrq5Mbn4cQoIURoYUVpYkXqYwfn4iUwr7o7e6Ah5dKcXslupkhtJUVpIgWpoofsZIkt5cluZg2vaBxzLllho+fpbFSW3FIdX0tqpMhs5QUpIgYqIsluZkhuJctqZJBfX8rr5UjtpZYybFAwqbu8fOLw7wttJgsvJwtu5wotZgispQkuJhLxarV8etfy7QjuJju8fLO6eS649u749u849yz4dhHwqgnuZkuvJ2y5tup49csu5yOlqPl6evm6evn6ezo6ezU5ONDwKU1vqB+1sPU8etDwqYqupuK2cjX8uyW3c7Y8u1v0bxv0Lvc9O+Z3s8oupo+waQwvJ4AAADeSjEoAAAAOnRSTlMAAAAAAABXmJaWlz1rlWlob8cbZJSVlZD79vb3/pYlQD8/Q8F+VPjpNQn5cgERjd9xBwMue6WibyQCvMTnBAAAAAFiS0dEAf8CLd4AAAAJcEhZcwAAAOAAAADgANVYzlwAAAAHdElNRQflAxQFDi8hH0i1AAAB5klEQVQoz2NgwA8YGRjY2DlwAE4ubpACditrG+zA1o4HpIDX2t7BERuwd3LmAyuwsXdxdXP38HRDA17ePlAFvn7+AYFBwSGoIDQsHK4gIjQyKjomNg4VxCMpSEhMSk5JTUvHqSAjMzkrOTsHt4LcvPyCwqJiqExJaRm6gpD08orKKqgBpdU1tWXoCuLS6+rq4xpA8o1NzS2tbWXoCoCgob0DqKKxs6u7u6WntwxDQUNf/4SJkyZPmdoNBC3TppehKSibMXPW7Dlz581v6QarWLBwEYqCssVLls6atXTZ8hVg+ZWrVq9Zu249QkHZhjkbZwHB0k2bQfJbtm6btX3Hzl38TMxgBbv37N0HlgeC/Qe6uw9uA7EOHT4iwAJREHH0GEwepGLzcQjrxElBIbCCU6fPnD2HAOcvgKUvXrp85aowSIH1tes3biLArdt3Lt49d+jQvfsPHs4SASoQffT4yVMk8Oz5i6svH1y5+Or1m4uzxIAKxCUkUYCUtMzGt+/ef/j46eKsWbJABXLyCihAUUl51qG7n798/QZ0iAozlqzAqqoG9OP3H4dmzVLXYGZgRAfMzJpiQL3bgfJa2jpYFABV6Oqpgzyqb2DIjE0BUIWRsYmpmbkFMzMzIzYFQBVANZYgkpERAD5ALwr/BIDTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA3LTE5VDAzOjM5OjE1KzAwOjAwWtAmGAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMS0wOFQxOTo1ODo0NSswMDowMK/WnNEAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAAGN0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAg092D3AAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTgzLkFwggAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAyMDTpS4EtAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1NDY5Nzc1MjWQd5nhAAAAEXRFWHRUaHVtYjo6U2l6ZQA4NzU5QtkK76oAAABadEVYdFRodW1iOjpVUkkAZmlsZTovLy9kYXRhL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzEyMC8xMjAxNzc1LnBuZzSiONMAAAAASUVORK5CYII=);
                            "
                            >change</i
                        >
                        <button
                            style="margin-left: -5px;margin-top: 10px;"
                            class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel${
                                collected ? " on" : ""
                            }"
                            type="button"
                            title=${escapeBlank(
                                collected
                                    ? `cancel the collection of ${this.content_type}`
                                    : `add the ${this.content_type} to collection`
                            )}
                        >
                            <span style="display: inline-flex; align-items: center"
                                >&#8203;<svg
                                    class="Zi Zi--Star Button-zi"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    width="2.0em"
                                    height="2.0em"
                                >
                                    <path
                                        d="M5.515 19.64l.918-5.355-3.89-3.792c-.926-.902-.639-1.784.64-1.97L8.56 7.74l2.404-4.871c.572-1.16 1.5-1.16 2.072 0L15.44 7.74l5.377.782c1.28.186 1.566 1.068.64 1.97l-3.89 3.793.918 5.354c.219 1.274-.532 1.82-1.676 1.218L12 18.33l-4.808 2.528c-1.145.602-1.896.056-1.677-1.218z"
                                        fill-rule="evenodd"
                                    ></path></svg
                            ></span>
                        </button>
                        <i
                            class="read_it_later ${is_pocket ? " on" : ""}"
                            title="read it later"
                            style="
                                height: 30px;
                                display: block;
                                margin-top: 10px;
                                content: url(${this.get_pocket_ico(is_pocket)});
                            "
                            >Pocket</i
                        >
                        <i
                            class="load_more"
                            title="load more answers"
                            style="
                                display: none;
                                margin-top: 10px;
                                content: url(data:image/webp;base64,UklGRigBAABXRUJQVlA4TBwBAAAvP8APEFDcto3D/cc+pF35HhABt9r2Os0niZKSDrv2Dmxg6nvFENAzCkkW8AwMQR/qXEuOdP7vVeC2jTI4hhw+gn4ClWRF7lEURWplwUlDiXVynZJivw24mpHIwuhopZBcMxpsbAzUoMhWjkaLhTlxVz8APKwLSpl0Jg3QTPoSxdoDgB/XiZEPQAgGHBOlRHpPQAjAU09SckeAhQB8tCUKOUEVzKzCvyVJUUzwYmb2gimTWPqHysxChRMpXcIdGpgZKlzILEAaNHBQaIZgZuQCFQEE7m1k7guCAWYNbiGrkA0EBxQBG1JC3g1aQBHwZf6AzDPOg4w6yrzQ5MBAOp9pIN1ooFP3Vu3vrbG4t9N3I597N7ff7f1/4yNQAg==);
                            "
                            >load</i
                        >
                    </div>
                </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
                this.toolBar_event();
            },
            color_chooser_display(e, display) {
                const target = e.target;
                const localName = target.localName;
                const c =
                    localName === "img"
                        ? target.nextElementSibling
                        : target.lastElementChild;
                c.style.display = display;
            },
            colors_list(name) {
                const colors = {
                    a_color1: "#E3EDCD",
                    a_color2: "#f5f1e6",
                    a_color3: "#B6B6B6",
                    a_color4: "#FFF2E2",
                    a_color5: "#FAF9DE",
                    a_color6: "#FFF",
                };
                const color = colors[name];
                return color ? color : "#FFF";
            },
            timeID: null,
            toolBar_event() {
                setTimeout(() => {
                    let tool = this.Toolbar;
                    let bg = tool.getElementsByClassName("a_bgcolor")[0];
                    bg.onmouseenter = (e) => {
                        if (this.timeID) {
                            clearTimeout(this.timeID);
                            this.timeID = null;
                        }
                        this.color_chooser_display(e, "block");
                    };
                    bg.onmouseleave = (e) =>
                        (this.timeID = setTimeout(() => {
                            this.timeID = null;
                            this.color_chooser_display(e, "none");
                        }, 300));
                    bg = null;
                    let closer = tool.getElementsByClassName(
                        "artfullscreen_closer"
                    )[0];
                    closer.onclick = (e) => {
                        if (
                            this.autoScroll.scrollState ||
                            !this.load_content_finished
                        )
                            return;
                        let node = e.target.parentNode;
                        let ic = 0;
                        let cn = node.className;
                        while (cn !== "artfullscreen_toolbar") {
                            node = node.parentNode;
                            if (!node || ic > 4) {
                                node = null;
                                break;
                            }
                            cn = node.className;
                            ic++;
                        }
                        node && (node.style.display = "none");
                        this.ShowOrExit(false);
                    };
                    let colorlist =
                        tool.getElementsByClassName("a_colorlist")[0];
                    colorlist.onclick = (e) => {
                        const target = e.target;
                        const className = target.className;
                        if (
                            className &&
                            className.startsWith("a_color") &&
                            !className.endsWith("cur")
                        ) {
                            const nodes = target.parentNode.children;
                            for (const node of nodes) {
                                const cn = node.className;
                                if (cn.endsWith("cur")) {
                                    node.className = cn.slice(0, cn.length - 4);
                                    break;
                                }
                            }
                            target.className = className + " cur";
                            const box =
                                document.getElementById("artfullscreen__box");
                            if (className === "a_color7") {
                                const img = GM_getValue("readerbgimg");
                                box.style.backgroundImage =
                                    (img && `url(${img})`) ||
                                    "url(https://www.cnblogs.com/skins/coffee/images/bg_body.gif)";
                            } else {
                                box.style.backgroundImage = "none";
                                box.style.background =
                                    this.colors_list(className);
                            }
                            GM_setValue("articleBackground", className);
                        }
                    };
                    tool.lastElementChild.onclick = (e) => {
                        let name = e.target.className;
                        let t = null;
                        if (!name || typeof name !== "string") {
                            const path = e.path;
                            for (const p of path) {
                                const n = p.className;
                                if (
                                    n &&
                                    typeof n === "string" &&
                                    n.startsWith("Button")
                                ) {
                                    t = p;
                                    name = n.endsWith(" on")
                                        ? "remove_collect"
                                        : "collect";
                                    break;
                                }
                            }
                        } else if (name) {
                            if (name.startsWith("Button")) {
                                t = e.target;
                                name = name.endsWith(" on")
                                    ? "remove_collect"
                                    : "collect";
                            } else if (name.startsWith("read_")) {
                                t = e.target;
                                name = "read_it_later";
                            }
                        }
                        name && this[name](t);
                    };
                    if (this.content_type === "article")
                        this.check_article_collected(tool, this.aid);
                    else tool = null;
                    colorlist = null;
                    closer = null;
                    const i = GM_getValue("bgpindex");
                    this.picIndex = i ? i : 0;
                }, 50);
            },
            content_type: null,
            check_Answers(qid) {
                return collect_Answers.findIndex((e) => e.qid === qid);
            },
            Redirect: {
                remove(type, href) {
                    this.columnsModule.recentModule.remove(type, href);
                },
                collect(node, pid) {
                    dataBaseInstance.TableName = "collection";
                    dataBaseInstance.additem(
                        this.home_Module.current_Column_id,
                        node,
                        pid
                    );
                },
                log(config) {
                    this.columnsModule.recentModule.log("c", config);
                },
            },
            remove_pocket(mode) {
                const href =
                    this.content_type === "answer"
                        ? `https://www.zhihu.com/question/${this.qid}/answer/${this.aid}`
                        : `https://zhuanlan.zhihu.com/p/${this.aid}`;
                if (mode) {
                    const config = {};
                    config.type = "p";
                    config.url = href;
                    config.update = Date.now();
                    config.title = get_Title();
                    this.Redirect.log.call(zhihu.Column, config);
                } else this.Redirect.remove.call(zhihu.Column, "p", href);
            },
            change_pocket_status() {
                const f = this.check_pocket;
                const tool = this.Toolbar;
                const p =
                    tool.lastElementChild.lastElementChild
                        .previousElementSibling;
                const cl = p.className;
                const tmp = cl.endsWith(" on")
                    ? f
                        ? null
                        : cl.slice(0, cl.length - 3)
                    : f
                    ? cl + " on"
                    : null;
                if (tmp) {
                    p.className = tmp;
                    p.style.content = `url(${this.get_pocket_ico(
                        tmp.endsWith(" on")
                    )})`;
                }
            },
            read_it_later(target) {
                const cl = target.className;
                const f = cl.endsWith(" on");
                target.style.content = `url(${this.get_pocket_ico(!f)})`;
                target.className = f ? cl.slice(0, cl.length - 3) : `${cl} on`;
                this.remove_pocket(!f);
            },
            collect(target) {
                const config = {};
                config.type = "c";
                const upt = Date.now();
                if (this.content_type === "answer") {
                    const index = this.check_Answers(this.qid);
                    const pref = "https://www.zhihu.com/question/";
                    if (index > -1) {
                        const c = collect_Answers[index];
                        const data = c.data;
                        if (!data.some((e) => e.aid === this.aid))
                            data.push({ aid: this.aid, update: upt });
                        config.title = c.title;
                        config.url = `${pref}${c.qid}/answer/${this.aid}`;
                    } else {
                        const info = {};
                        config.title = info.title = get_Title();
                        info.qid = this.qid;
                        info.data = [];
                        info.data.push({ aid: this.aid, update: upt });
                        config.url = `${pref}${this.qid}/answer/${this.aid}`;
                        collect_Answers.push(info);
                    }
                    GM_setValue("collect_a", collect_Answers);
                } else if (this.content_type === "article") {
                    this.Redirect.collect.call(
                        zhihu.Column,
                        this.curNode,
                        this.aid
                    );
                    config.url = `https://zhuanlan.zhihu.com/p/${this.aid}`;
                    config.title = get_Title();
                }
                config.update = upt;
                this.Redirect.log.call(zhihu.Column, config);
                this.change_collect_status(target, true);
            },
            change_collect_status(target, mode) {
                const className = target.className;
                target.title = mode
                    ? `cancel the collection of ${this.content_type}`
                    : `add the ${this.content_type} to collection`;
                target.className = mode
                    ? className + " on"
                    : className.slice(0, className.length - 3);
            },
            remove_collect(target) {
                if (
                    !confirm(
                        `are you sure want to remove this ${this.content_type}`
                    )
                )
                    return;
                let href = "";
                if (this.content_type === "answer") {
                    const index = this.check_Answers(this.qid);
                    if (index > -1) {
                        const data = collect_Answers[index].data;
                        if (data.length > 1) {
                            const i = data.findIndex((e) => e.aid === this.aid);
                            i > -1 && data.splice(i, 1);
                        } else collect_Answers.splice(index, 1);
                        GM_setValue("collect_a", collect_Answers);
                    }
                    href = `https://www.zhihu.com/question/${this.qid}/answer/${this.aid}`;
                } else if (this.content_type === "article") {
                    dataBaseInstance.TableName = "collection";
                    dataBaseInstance.dele(false, this.aid);
                    href = `https://zhuanlan.zhihu.com/p/${this.aid}`;
                }
                this.change_collect_status(target, false);
                this.Redirect.remove.call(zhihu.Column, "c", href);
            },
            picIndex: 0,
            disable_bgp() {
                this.full.style.backgroundImage = "none";
                this.picIndex = 0;
                GM_setValue("bgpindex", this.picIndex);
                GM_setValue("bgpreader", "");
            },
            change_bgp_timeID: null,
            change_bgp() {
                this.change_bgp_timeID && clearTimeout(this.change_bgp_timeID);
                this.change_bgp_timeID = setTimeout(() => {
                    this.change_bgp_timeID = null;
                    const pics = [
                        "d40e6fbabe339af2f9cc1b9a0c49b97c212417",
                        "50bfb5a296779e17d2901c6d13eb15cf215229",
                        "02ed4231ffac5cb7553df89a8ef6b3c4122737",
                        "826d9cecc220b11c5502f247ff046387247423",
                        "02f8f662ea840da01a9645fc2d18d3ac170812",
                        "f2a5e663cce16208e9e85c9a4bec502a101513",
                        "a3dc87ca1d8021f5091acf288c4fe0a4154893",
                    ];
                    const pref = "https://img.meituan.net/csc/";
                    const suffix = ".jpg";
                    this.backgroundImage_cache.reader(
                        this.full,
                        pref + pics[this.picIndex] + suffix
                    );
                    this.picIndex + 1 === pics.length
                        ? (this.picIndex = 0)
                        : (this.picIndex += 1);
                    GM_setValue("bgpindex", this.picIndex);
                }, 300);
            },
            load_more() {
                if (this.isRunning) return;
                this.try_status = false;
                this.isRunning = true;
                this.simulation_scroll(this.full, this.curNode, true);
                this.scroll_record = 0;
            },
            /**
             * @param {boolean} mode
             */
            set display_load_more(mode) {
                if (this.load_more_status === mode) return;
                this.Toolbar.lastElementChild.lastElementChild.style.display =
                    mode ? "block" : "none";
                this.load_more_status = mode;
            },
            get_video_info(v, video_id) {
                const api = `https://lens.zhihu.com/api/v4/videos/${video_id}`;
                xmlHTTPRequest(api).then(
                    (json) => {
                        typeof json === "string" && (json = JSON.parse(json));
                        let videoURL = "";
                        const vlb = json.playlist;
                        const keys = Object.keys(vlb);
                        let back = "";
                        for (const k of keys) {
                            if (k === "HD" || k === "FHD") {
                                videoURL = vlb[k].play_url;
                                break;
                            } else back = vlb[k].play_url;
                        }
                        if (!videoURL && !back) return;
                        else if (!videoURL) videoURL = back;
                        const picURL = json.cover_url;
                        this.replace_Video(v, picURL, videoURL);
                    },
                    (err) => console.log(err)
                );
            },
            get_video_ID(v) {
                let set = v.dataset.zaExtraModule;
                if (!set) set = v.dataset.zaModuleInfo;
                if (!set) return;
                typeof set === "string" && (set = JSON.parse(set));
                const content = set.card.content;
                if (content.is_playable === false) {
                    console.log("current video is not playable");
                    return;
                }
                this.get_video_info(v, content.video_id);
            },
            rawVideo_html(picURL, videoURL) {
                const html = `
                <img class="_video_cover" src=${picURL} style="object-fit: cover; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 1;" />
                <video preload="metadata" width="100%" height="-webkit-fill-available" controls="">
                    <source
                        src=${videoURL}
                        type="video/mp4"
                    />
                </video>
                <div
                    class="_player_ico"
                    style="
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 2;
                    "
                >
                    <div class="_play_ico" style="width: 50px; height: 50px">
                        <span class="_play_ico_content"
                            ><svg viewBox="0 0 72 72" class="_ico_content">
                                <g fill="none" fill-rule="evenodd">
                                    <circle
                                        cx="36"
                                        cy="36"
                                        r="36"
                                        fill="#FFF"
                                        fill-opacity=".95"
                                    ></circle>
                                    <path
                                        fill="#444"
                                        fill-rule="nonzero"
                                        d="M50.8350169,37.0602664 L29.4767217,49.9693832 C28.900608,50.3175908 28.1558807,50.1251285 27.8133266,49.5395068 C27.701749,49.3487566 27.6428571,49.1309436 27.6428571,48.9090213 L27.6428571,23.0907876 C27.6428571,22.4094644 28.1862113,21.8571429 28.8564727,21.8571429 C29.0747919,21.8571429 29.2890685,21.9170066 29.4767217,22.0304257 L50.8350169,34.9395425 C51.4111306,35.28775 51.6004681,36.0447682 51.257914,36.6303899 C51.154433,36.8072984 51.0090531,36.9550776 50.8350169,37.0602664 Z"
                                    ></path>
                                </g></svg
                        ></span>
                    </div>
                </div>`;
                return html;
            },
            replace_Video(v, picURL, videoURL) {
                let player = v.getElementsByClassName("VideoCard-player");
                if (player.length > 0) {
                    const html = this.rawVideo_html(picURL, videoURL, false);
                    player[0].children.length === 0
                        ? player[0].insertAdjacentHTML("afterbegin", html)
                        : (player[0].innerHTML = html);
                } else {
                    player = v.getElementsByClassName(
                        "ZVideoLinkCard-playerContainer"
                    );
                    if (player.length > 0) {
                        const html = this.rawVideo_html(picURL, videoURL, true);
                        player[0].style.paddingBottom = 0;
                        player[0].children.length === 0
                            ? player[0].insertAdjacentHTML("afterbegin", html)
                            : (player[0].innerHTML = html);
                    } else console.log("warning, the id of player is null");
                }
            },
            //click image to show the raw pic
            imgClick: {
                create(node, info) {
                    const html = `
                            <div class="ImageView is-active" style="padding-bottom: 10px">
                                <div class="ImageView-inner" style="overflow: auto">
                                    <img
                                        src=${info.url}
                                        class="ImageView-img"
                                        alt="preview"
                                        style="
                                            width: ${info.width};
                                            transform: ${info.transform};
                                            opacity: 1;
                                        "
                                    />
                                </div>
                            </div>`;
                    node.insertAdjacentHTML("beforeend", html);
                },
                imgPosition(info, target) {
                    const rw = target.dataset.rawwidth * 1;
                    const rh = target.dataset.rawheight * 1;
                    const owh = window.outerHeight * 1;
                    const wh = window.innerHeight * 1;
                    const ww = window.innerWidth * 1;
                    const sww = ww * 0.98;
                    const tw = target.width * 1;
                    const th = target.height * 1;
                    const xw = (ww - tw) / 2;
                    let sc = 0;
                    let yh = 0;
                    //if the width of raw pic is bigger than 98% width of window
                    if (rw > sww) {
                        sc = sww / tw;
                    } else {
                        sc = rw / tw;
                    }
                    if (rh > owh) {
                        //if the height is bigger than width
                        yh = rh > rw ? (rh - th) / 2 : (xw * th) / tw;
                    } else {
                        yh = (wh - th) / 2;
                    }
                    //margin
                    if (yh > wh) {
                        yh = yh / 2;
                        while (yh > wh) yh = yh / 2;
                    } else yh += 5;
                    info.transform = `translate(${xw}px, ${yh}px) scale(${sc.toFixed(
                        4
                    )})`;
                    info.width = `${tw}px`;
                },
                isExist: false,
                restore(n) {
                    //retore the status of navigator
                    const l = n.children[1];
                    const r = n.children[2];
                    l.className !== this.lbackupNav[0] &&
                        (l.className = this.lbackupNav[0]);
                    r.className !== this.rbackupNav[0] &&
                        (r.className = this.rbackupNav[0]);
                    l.title = this.lbackupNav[1];
                    r.title = this.rbackupNav[1];
                    n = null;
                },
                remove(n) {
                    if (!this.isExist) return;
                    this.ImageView.parentNode.parentNode.remove();
                    this.isExist = false;
                    this.currentPicURL = null;
                    this.restore(n);
                    this.imgList = null;
                    this.rbackupNav = null;
                    this.lbackupNav = null;
                    this.ImageView = null;
                    this.toolBar_display(true);
                },
                currentPicURL: null,
                ImageView: null,
                toolBar_display(mode) {
                    const tool = document.getElementById(
                        "artfullscreen_toolbar"
                    );
                    tool && (tool.style.display = mode ? "block" : "none");
                },
                showRawPic(box, target, n) {
                    const url = target.dataset.original;
                    if (!url) return;
                    const info = {};
                    info.url = url;
                    this.imgPosition(info, target);
                    this.create(box, info);
                    this.isExist = true;
                    setTimeout(() => {
                        const viewer =
                            box.getElementsByClassName("ImageView-inner");
                        if (viewer.length > 0)
                            this.ImageView = viewer[0].firstElementChild;
                    }, 10);
                    this.toolBar_display(false);
                    this.currentPicURL = url;
                    this.imgNav(box, n);
                },
                rbackupNav: null,
                lbackupNav: null,
                imgList: null,
                backUP(node, arr) {
                    arr.push(node.className);
                    arr.push(node.title);
                },
                imgNav(box, n) {
                    const imgs = box.getElementsByTagName("img");
                    this.imgList = [];
                    this.rbackupNav = [];
                    this.lbackupNav = [];
                    for (const img of imgs)
                        img.className.endsWith("lazy") &&
                            img.dataset.original &&
                            this.imgList.push(img);
                    const [titlel, namel, titler, namer] =
                        this.imgList.length === 1
                            ? [
                                  "no more picture",
                                  "readerpage-l disa",
                                  "no more picture",
                                  "readerpage-r disa",
                              ]
                            : [
                                  "previous picture",
                                  "readerpage-l",
                                  "next picture",
                                  "readerpage-r",
                              ];
                    const l = n.children[1];
                    const r = n.children[2];
                    this.backUP(l, this.lbackupNav);
                    this.backUP(r, this.rbackupNav);
                    l.title = titlel;
                    this.lbackupNav[0] !== namel && (l.className = namel);
                    r.title = titler;
                    this.rbackupNav[0] !== namer && (r.className = namer);
                },
                change_time_id: null,
                changPic(mode, show_status, f) {
                    this.change_time_id && clearTimeout(this.change_time_id);
                    this.change_time_id = setTimeout(() => {
                        this.change_time_id = null;
                        if (!this.ImageView) {
                            console.log(
                                "warning, the viewer of picture is null"
                            );
                            return;
                        }
                        const i = this.imgList.length - 1;
                        if (i === 0) return;
                        const index = this.imgList.findIndex(
                            (img) => img.dataset.original === this.currentPicURL
                        );
                        if ((index === i && mode) || (index === 0 && !mode)) {
                            show_status.main(
                                show_status.node ? null : f,
                                "no more picture"
                            );
                            return;
                        }
                        const imge = this.imgList[mode ? index + 1 : index - 1];
                        const url = imge.dataset.original;
                        this.currentPicURL = url;
                        const info = {};
                        this.imgPosition(info, imge);
                        this.ImageView.style.width = info.width;
                        this.ImageView.style.transform = info.transform;
                        this.ImageView.src = url;
                    }, 300);
                },
                no_mp4_giflist: null,
                gif_time_id: null,
                GifPlay(target, className) {
                    /*
                    some gifs are actually mp4 videos;
                    must check the gif whether has mp4 video
                    */
                    this.gif_time_id && clearTimeout(this.gif_time_id);
                    this.gif_time_id = setTimeout(() => {
                        this.gif_time_id = null;
                        if (className.endsWith("gif2mp4")) {
                            this.gif_pNode_className(target, !target.paused);
                            target.paused ? target.play() : target.pause();
                            return;
                        }
                        const url = target.src;
                        const reg = /(?<=-)\w+(?=_)/;
                        const match = url.match(reg);
                        if (!match) {
                            console.log("get id of gif pic fail");
                            return;
                        }
                        const id = match[0];
                        if (this.no_mp4_giflist) {
                            if (this.no_mp4_giflist.includes(id)) {
                                this.Gif_Pic(url, target);
                                return;
                            }
                        } else this.no_mp4_giflist = [];
                        this.Gif_MP4(id).then(
                            (src) => {
                                if (!src) {
                                    this.no_mp4_giflist.push(id);
                                    this.Gif_Pic(url, target);
                                    return;
                                }
                                target.insertAdjacentHTML(
                                    "beforebegin",
                                    this.gif_vidoe_raw(src, url)
                                );
                                setTimeout(() => {
                                    this.gif_pNode_className(target, false);
                                    target.previousElementSibling.play();
                                    target.className =
                                        className + " GifPlayer-gif2mp4Image";
                                }, 50);
                            },
                            () =>
                                Notification(
                                    "get the play url of gif_mp4 fail",
                                    "Reader Tips"
                                )
                        );
                    }, 300);
                },
                gif_pNode_className(target, mode) {
                    target.parentNode.className =
                        "GifPlayer" + (mode ? "" : " isPlaying");
                },
                gif_vidoe_raw(src, pic) {
                    const html = `
                        <video
                            class="ztext-gif GifPlayer-gif2mp4"
                            src=${src}"
                            data-thumbnail=${pic}
                            poster=${pic}
                            data-size="normal"
                            preload="metadata"
                            loop=""
                            playsinline=""
                            style="width: auto !important; height: auto !important;"
                        ></video>`;
                    return html;
                },
                Gif_Pic(url, target) {
                    const [a, b] = url.includes(".webp")
                        ? [".webp", ".jpg"]
                        : [".jpg", ".webp"];
                    target.src = url.replace(a, b);
                    this.gif_pNode_className(target, a === ".webp");
                },
                Gif_MP4(id) {
                    return new Promise((resolve, reject) => {
                        const api = `https://api.zhihu.com/gif2mp4/v2-${id}`;
                        xmlHTTPRequest(api).then(
                            (json) => {
                                typeof json === "string" &&
                                    (json = JSON.parse(json));
                                const plist = json.playlist;
                                let src = "";
                                let b = "";
                                for (const e of Object.keys(plist)) {
                                    if (e === "SD") {
                                        src = plist[e].play_url;
                                        break;
                                    } else b = plist[e].play_url;
                                }
                                resolve(src ? src : b);
                            },
                            (err) => {
                                console.log(err);
                                reject(null);
                            }
                        );
                    });
                },
                video_Play(video) {
                    video.nextElementSibling.style.display = "none";
                    video.previousElementSibling.style.display = "none";
                    video.play();
                },
                event(node, n, scroll) {
                    setTimeout(() => {
                        const box = node.lastElementChild;
                        box.onclick = (e) => {
                            if (scroll.scrollState) return;
                            const target = e.target;
                            const className = target.className;
                            if (className && typeof className === "string") {
                                if (className.endsWith("lazy"))
                                    this.showRawPic(box, target, n);
                                else if (className.startsWith("ztext-gif"))
                                    this.GifPlay(target, className);
                                else if (className === "_video_cover")
                                    this.video_Play(target.nextElementSibling);
                                else this.remove(n);
                            } else {
                                const localName = target.localName;
                                if (localName) {
                                    if (
                                        localName === "path" ||
                                        localName === "circle"
                                    ) {
                                        const paths = e.path;
                                        for (const p of paths) {
                                            if (p.className === "_player_ico") {
                                                this.video_Play(
                                                    p.previousElementSibling
                                                );
                                                break;
                                            }
                                        }
                                    } else if (
                                        localName === "img" &&
                                        target.dataset.original
                                    )
                                        this.showRawPic(box, target, n);
                                }
                            }
                        };
                    }, 100);
                },
            },
            scrollListen: false,
            video_list: null,
            loadedList: null,
            getVideo_element(f) {
                //if the video element is visible, load data
                if (this.video_list) {
                    this.video_list = null;
                    this.loadedList = null;
                }
                const videoas = f.getElementsByClassName("RichText-video");
                const videobs = f.getElementsByClassName("ZVideoLinkCard");
                const a = videoas.length;
                const b = videobs.length;
                if (a + b === 0) return;
                this.video_list = [];
                for (let k = 0; k < a; k++)
                    elementVisible.main(f, videoas[k])
                        ? this.get_video_ID(videoas[k])
                        : this.video_list.push(videoas[k]);
                for (let k = 0; k < b; k++)
                    elementVisible.main(f, videobs[k])
                        ? this.get_video_ID(videobs[k])
                        : this.video_list.push(videobs[k]);
                const i = this.video_list.length;
                if (i > 0) {
                    this.loadedList = new Array(i);
                    !this.scrollListen && this.scrollEvent(f);
                } else this.video_list = null;
            },
            scrollEvent(f) {
                let unfinished = false;
                let cache = 0;
                f.onscroll = () => {
                    cache += 1;
                    if (
                        cache < 5 ||
                        unfinished ||
                        !this.video_list ||
                        !this.loadedList
                    )
                        return;
                    cache = 0;
                    unfinished = true;
                    this.video_list.forEach((v, index) => {
                        if (!this.loadedList[index]) {
                            if (elementVisible.main(f, v)) {
                                this.loadedList[index] = true;
                                this.get_video_ID(v);
                            } else this.loadedList[index] = false;
                        }
                    });
                    if (this.loadedList.every((e) => e)) {
                        this.loadedList = null;
                        this.video_list = null;
                    }
                    unfinished = false;
                };
                this.scrollListen = true;
            },
            collected_answer_sync() {
                GM_addValueChangeListener(
                    "collect_a",
                    (name, oldValue, newValue, remote) =>
                        remote && (collect_Answers = newValue)
                );
            },
            creatEvent(f) {
                const n = this.nav;
                n.children[1].onclick = () => this.Previous(f);
                n.children[2].onclick = () => this.Next(f);
                this.loadLazy(f);
                this.answer_card_module.initial(f);
                this.imgClick.event(f, n, this.autoScroll);
                this.getVideo_element(f);
                setTimeout(() => this.time_module.main(), 300);
                this.backgroundImage_cache.article();
                this.collected_answer_sync();
            },
            turnPage: {
                main(mode, node) {
                    const overlap = 100;
                    const wh = window.innerHeight;
                    let height = wh - overlap;
                    height < 0 && (height = 0);
                    let top = node.scrollTop;
                    if (mode) top += height;
                    else top < height ? (top = 0) : (top -= height);
                    node.scrollTo(0, top);
                },
                start(mode, node) {
                    window.requestAnimationFrame(
                        this.main.bind(this, mode, node)
                    );
                },
            },
            autoScroll: {
                stepTime: 40,
                keyCount: 1,
                scrollState: false,
                scrollTime: null,
                scrollPos: null,
                node: null,
                pageScroll(TimeStamp) {
                    if (!this.scrollState) return;
                    const position = this.node.scrollTop;
                    if (this.scrollTime) {
                        this.scrollPos =
                            this.scrollPos !== null
                                ? this.scrollPos +
                                  (TimeStamp - this.scrollTime) / this.stepTime
                                : position;
                        this.node.scrollTo(0, this.scrollPos);
                    }
                    this.scrollTime = TimeStamp;
                    const h = this.node.scrollHeight - window.innerHeight;
                    position < h
                        ? window.requestAnimationFrame(
                              this.pageScroll.bind(this)
                          )
                        : this.stopScroll(true);
                },
                autoReader: null,
                scrollEnd: false,
                autoButton_event() {
                    createPopup(5);
                    const tips = document.getElementById("autoscroll-tips");
                    let buttons = tips.getElementsByTagName("button");
                    const id = setTimeout(() => {
                        tips.remove();
                        !this.auto_pause && this.autoReader();
                    }, 5000);
                    buttons[0].onclick = () => {
                        clearTimeout(id);
                        clearTimeout(this.timeID);
                        tips.remove();
                        !this.auto_pause && this.autoReader();
                    };
                    buttons[1].onclick = () => {
                        clearTimeout(id);
                        clearTimeout(this.timeID);
                        this.timeID = null;
                        tips.remove();
                    };
                    buttons = null;
                },
                timeID: null,
                auto_pause: false,
                remain_time: 0,
                stopScroll(mode) {
                    if (this.scrollState) {
                        this.scrollPos = null;
                        this.scrollTime = null;
                        this.scrollState = false;
                        this.keyCount = 1;
                        if (mode && this.autoReader && !this.scrollEnd) {
                            if (this.auto_pause) return;
                            const stop = Date.now();
                            const gap = Math.floor(
                                (stop - this.stopwatch) / 1000
                            );
                            const wtime =
                                gap < 30
                                    ? 2000
                                    : gap > 60 && gap < 90
                                    ? 3000
                                    : gap > 180
                                    ? 5500
                                    : 4000;
                            gap > 180
                                ? this.autoButton_event()
                                : setTimeout(
                                      () =>
                                          !this.auto_pause && this.autoReader(),
                                      wtime + this.remain_time
                                  );
                            this.timeID = setTimeout(() => {
                                this.timeID = null;
                                if (this.auto_pause) return;
                                this.keyCount = 2;
                                this.start();
                            }, wtime + this.remain_time + 3500);
                        } else {
                            this.timeID && clearTimeout(this.timeID);
                            this.timeID = null;
                            !this.autoReader && (this.node = null);
                            this.remain_time = 0;
                        }
                        this.stopwatch = 0;
                    }
                },
                speedUP() {
                    this.scrollState && this.stepTime < 10
                        ? (this.stepTime = 5)
                        : (this.stepTime -= 5);
                },
                slowDown() {
                    this.scrollState && this.stepTime > 100
                        ? (this.stepTime = 100)
                        : (this.stepTime += 5);
                },
                stopwatch: 0,
                startID: null,
                is_nurse: false,
                start() {
                    if (this.is_nurse) return;
                    this.keyCount += 1;
                    if (this.keyCount % 2 === 0) return;
                    if (this.scrollState) this.stopScroll(false);
                    else {
                        if (this.timeID) {
                            if (this.autoReader) return;
                            else clearTimeout(this.timeID);
                        }
                        this.stopwatch = Date.now();
                        this.scrollState = true;
                        !this.node &&
                            (this.node =
                                document.getElementById("artfullscreen"));
                        this.startID && clearTimeout(this.startID);
                        this.startID = setTimeout(() => {
                            this.startID = null;
                            window.requestAnimationFrame(
                                this.pageScroll.bind(this)
                            );
                        }, 600);
                    }
                },
            },
            scroll: {
                toTop(node) {
                    let hTop = node.scrollTop;
                    if (hTop === 0) return;
                    const rate = 8;
                    let sid = 0;
                    const scrollToTop = () => {
                        hTop = node.scrollTop;
                        if (hTop > 0) {
                            sid = window.requestAnimationFrame(scrollToTop);
                            node.scrollTo(0, hTop - hTop / rate);
                        } else {
                            sid !== 0 && window.cancelAnimationFrame(sid);
                        }
                    };
                    scrollToTop();
                },
                toBottom(node) {
                    let sid = 0;
                    let shTop = 0;
                    const initial = 100;
                    const scrollToBottom = () => {
                        const hTop = node.scrollTop || initial;
                        if (hTop !== shTop) {
                            shTop = hTop;
                            sid = window.requestAnimationFrame(scrollToBottom);
                            node.scrollTo(0, hTop + hTop);
                        } else {
                            sid !== 0 && window.cancelAnimationFrame(sid);
                            sid = 0;
                        }
                    };
                    scrollToBottom();
                },
            },
            autoReader_mode: false,
            autoReader() {
                if (this.autoReader_mode) {
                    this.autoReader_mode = false;
                    this.show_status.istimeout = true;
                    this.show_status.main(
                        null,
                        "auto reader mode has ben cancelled"
                    );
                    this.autoScroll.autoReader = null;
                    this.autoScroll.auto_pause = false;
                    this.autoScroll.node = null;
                    this.auto_pause_mode = false;
                } else {
                    this.show_status.main(this.full, "Auto Mode", 0, 0, false);
                    this.autoReader_mode = true;
                    this.autoScroll.autoReader = this.Next.bind(this);
                }
            },
            auto_pause_mode: false,
            auto_pause() {
                this.autoScroll.auto_pause = this.auto_pause_mode =
                    !this.auto_pause_mode;
                this.show_status.auto_scroll_change(
                    this.auto_pause_mode ? "Auto Mode_Paused" : "Auto Mode"
                );
                this.auto_pause_mode && (this.autoScroll.remain_time = 0);
            },
            keyEvent(keyCode, shift) {
                this.imgClick.isExist
                    ? keyCode === 37
                        ? this.Previous()
                        : keyCode === 39
                        ? this.Next()
                        : null
                    : shift
                    ? keyCode === 65
                        ? this.autoReader()
                        : null
                    : keyCode === 65
                    ? this.autoReader_mode && this.auto_pause()
                    : keyCode === 84
                    ? !this.autoScroll.scrollState &&
                      this.scroll.toTop(this.full)
                    : keyCode === 78
                    ? !this.autoScroll.scrollState &&
                      this.turnPage.start(true, this.full)
                    : keyCode === 85
                    ? !this.autoScroll.scrollState &&
                      this.turnPage.start(false, this.full)
                    : keyCode === 82
                    ? !this.autoScroll.scrollState &&
                      this.scroll.toBottom(this.full)
                    : keyCode === 192
                    ? this.autoScroll.start()
                    : keyCode === 187
                    ? this.autoScroll.speedUP()
                    : keyCode === 189
                    ? this.autoScroll.slowDown()
                    : keyCode === 37
                    ? this.Previous()
                    : keyCode === 39
                    ? this.Next()
                    : keyCode === 27
                    ? this.ShowOrExit(false)
                    : zhihu.multiSearch.main(keyCode);
            },
            changeNav(node) {
                const pre = node.children[1];
                const pName = pre.className;
                const [npName, titlel] = this.prevNode
                    ? ["readerpage-l", "previous answer"]
                    : ["readerpage-l disa", "no more content"];
                if (pName !== npName) {
                    pre.className = npName;
                    pre.title = titlel;
                }
                const next = node.children[2];
                const nextName = next.className;
                const [nnextName, titler] = this.nextNode
                    ? ["readerpage-r", "next answer"]
                    : ["readerpage-r disa", "no more content"];
                if (nextName !== nnextName) {
                    next.className = nnextName;
                    next.title = titler;
                }
            },
            getAnswerID(node) {
                let first = node.firstElementChild;
                if (first.className !== "ContentItem AnswerItem")
                    first = this.getAnswerItem(node);
                if (!first) {
                    console.log("warning, the structure of node has changed");
                    return null;
                }
                const ats = first.attributes;
                if (ats)
                    for (const a of ats) if (a.name === "name") return a.value;
            },
            /**
             * @param {any} node
             */
            set answerID(node) {
                this.aid = this.getAnswerID(node);
            },
            // trigger the scroll event to load more answers;
            simulation_scroll(f, node, mode = false) {
                setTimeout(() => {
                    this.overFlow = false;
                    f.style.overflow = "hidden";
                    node.scrollIntoView();
                    setTimeout(() => {
                        (this.scroll_record < 5 || mode) &&
                            window.scrollTo(0, 0.98 * this.DDSH);
                        setTimeout(() => {
                            this.scroll_record -= 1;
                            this.navPannel = this.curNode = node;
                            const time =
                                this.allAnswser_loaded || this.nextNode
                                    ? 50
                                    : 650;
                            setTimeout(() => {
                                this.overFlow = true;
                                f.style.overflow = "auto";
                                this.isRunning = false;
                                mode
                                    ? this.nextNode &&
                                      Notification(
                                          "load more answers successfully",
                                          "Tips"
                                      )
                                    : f.focus();
                            }, time);
                        }, 350);
                    }, 350);
                }, 60);
            },
            isRunning: false,
            scroll_record: 0,
            chang_time_id: null,
            //settimeout => prevent too many times of operation
            changeContent(node, mode = true) {
                this.chang_time_id && clearTimeout(this.chang_time_id);
                this.chang_time_id = setTimeout(() => {
                    this.chang_time_id = null;
                    if (
                        (!this.autoReader_mode && this.autoScroll.node) ||
                        this.isRunning
                    )
                        return;
                    this.isRunning = true;
                    const cName = "RichText ztext CopyrightRichText-richText";
                    const aName =
                        "AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related";
                    const f = this.full;
                    const content = node.getElementsByClassName(cName);
                    const author = node.getElementsByClassName(aName);
                    const cn = f.getElementsByClassName(cName)[0];
                    if (content.length > 0) {
                        cn.innerHTML = content[0].innerHTML;
                        this.autoReader_mode &&
                            this.setRemainTime(content[0].innerText.length);
                    } else cn.innerHTML = "No data";
                    f.getElementsByClassName(aName)[0].innerHTML =
                        author.length > 0 ? author[0].innerHTML : "No data";
                    if (mode) {
                        this.answerID = node;
                        this.isSimple_page || this.allAnswser_loaded
                            ? (this.navPannel = this.curNode = node)
                            : this.simulation_scroll(f, node);
                    } else this.ShowOrExit(true);
                    if (this.no_scroll) {
                        f.getElementsByTagName("h2")[0].innerText =
                            this.get_article_title(node);
                        this.set_current_Type(node);
                    }
                    this.content_type === "answer"
                        ? this.change_Collected(
                              this.Toolbar,
                              this.check_answer_collected(this.qid, this.aid)
                          )
                        : this.check_article_collected(this.Toolbar, this.aid);
                    this.change_pocket_status();
                    this.loadLazy(f);
                    this.answer_card_module.initial(f);
                    this.getVideo_element(f);
                    setTimeout(() => {
                        f.scrollTo(0, 0);
                        (this.allAnswser_loaded ||
                            !mode ||
                            this.isSimple_page) &&
                            ((this.isRunning = false), f.focus());
                    }, 50);
                }, 300);
            },
            setRemainTime(len) {
                if (
                    this.auto_pause_mode ||
                    this.full.scrollHeight > window.innerHeight
                )
                    return;
                const w =
                    len < 30
                        ? 500
                        : len < 50
                        ? 1000
                        : len < 100
                        ? 1500
                        : (len / 100) * 500 + 1500;
                this.autoScroll.remain_time = w > 6000 ? 6000 : w;
            },
            Next(f) {
                if (!this.load_content_finished) return;
                this.imgClick.isExist
                    ? this.imgClick.changPic(true, this.show_status, f)
                    : this.nextNode
                    ? (this.changeContent(this.nextNode),
                      this.autoReader_mode &&
                          (this.autoScroll.scrollEnd = false))
                    : this.autoReader_mode &&
                      (this.autoScroll.scrollEnd = true);
            },
            Previous(f) {
                if (!this.load_content_finished) return;
                this.imgClick.isExist
                    ? this.imgClick.changPic(false, this.show_status, f)
                    : this.prevNode &&
                      (this.autoReader_mode &&
                          (this.autoScroll.scrollEnd = false),
                      this.changeContent(this.prevNode));
            },
            get nav() {
                return document.getElementById("reader_navigator");
            },
            get full() {
                return document.getElementById("artfullscreen");
            },
            /**
             * @param {boolean} mode
             */
            set Element_display(mode) {
                const display = mode ? "block" : "none";
                const n = this.nav;
                n && (n.style.display = display);
                const f = this.full;
                f && (f.style.display = display);
                const tool = this.Toolbar;
                tool && (tool.style.display = display);
                this.time_module.clock_paused = !mode;
            },
            ShowOrExit(mode) {
                if (!mode && (this.isRunning || this.autoScroll.scrollState))
                    return;
                this.Element_display = mode;
                if (mode) return;
                /*
                exit reader mode, then move to the position of current node
                wait the reader is hidden, scroll to current answer
                */
                this.overFlow = false;
                this.readerMode = mode;
                if (document.title === "出了一点问题") {
                    confirm("the webpage has crashed, is reload?") &&
                        location.reload();
                    return;
                }
                this.curNode.offsetTop !== window.pageYOffset &&
                    (this.isSimple_page ||
                        this.nextNode ||
                        this.allAnswser_loaded) &&
                    setTimeout(() => this.curNode.scrollIntoView(), 300);
                this.no_scroll
                    ? change_Title("IGNORANCE IS STRENGTH")
                    : this.ctrl_click.call(zhihu, false);
            },
            // load lazy pic
            loadLazy(node) {
                const imgs = node.getElementsByTagName("img");
                for (const img of imgs) {
                    const name = img.className;
                    name &&
                        name.endsWith("lazy") &&
                        img.src.startsWith("data:image/svg+xml") &&
                        (img.src = img.dataset.actualsrc);
                }
            },
            // load the answer card information
            answer_card_module: {
                card_raw(info, href) {
                    const html = `
                        <div class="RichText-LinkCardContainer">
                            <a
                                target="_blank"
                                href="${href}"
                                data-draft-node="block"
                                data-draft-type="link-card"
                                data-text="${info.title}"
                                class="LinkCard new css-1wr1m8"
                                data-za-detail-view-id="172"
                                ><span class="LinkCard-contents"
                                    ><span class="LinkCard-title two-line"
                                        >${info.title}</span
                                    ><span class="LinkCard-desc"
                                        >${info.voteup_count} 赞同 · ${info.comment_count} 评论<span class="LinkCard-tag">回答</span></span
                                    ></span
                                ></a
                            >
                        </div>`;
                    return html;
                },
                load_card_info(curls, cnodes) {
                    const api = `https://www.zhihu.com/api/v4/link_card_infos?urls=${curls.join(
                        ","
                    )}`;
                    xmlHTTPRequest(api).then(
                        (json) => {
                            if (typeof result === "string")
                                json = JSON.parse(json);
                            cnodes.forEach((c) => {
                                const info = json[c.url];
                                if (info)
                                    c.node.outerHTML = this.card_raw(
                                        info,
                                        c.url
                                    );
                            });
                        },
                        () => console.log("failed to load answer card info")
                    );
                },
                external_raw(info, href) {
                    const url = href.includes("link.zhihu.com/?target=")
                        ? href.split("link.zhihu.com/?target=")[1]
                        : href;
                    const html = `
                        <div class="RichText-LinkCardContainer">
                            <a
                                target="_blank"
                                href="${url}"
                                data-draft-node="block"
                                data-draft-type="link-card"
                                data-text="${info.text}"
                                class="LinkCard new css-1wr1m8"
                                data-image="${info.image}"
                                data-image-width="1920"
                                data-image-height="1080"
                                data-za-detail-view-id="${info.zaDetailViewId}"
                                ><span class="LinkCard-contents"
                                    ><span class="LinkCard-title two-line"
                                        >${info.text}</span
                                    ><span class="LinkCard-desc"
                                        ><span style="display: inline-flex; align-items: center"
                                            >&ZeroWidthSpace;<svg
                                                class="Zi Zi--InsertLink"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                width="14"
                                                height="14"
                                            >
                                                <path
                                                    d="M13.414 4.222a4.5 4.5 0 1 1 6.364 6.364l-3.005 3.005a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 0 1 0-.707l3.005-3.005a2.5 2.5 0 1 0-3.536-3.536l-3.005 3.005a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 0 1 0-.707l3.005-3.005zm-6.187 6.187a.5.5 0 0 1 .638-.058l.07.058.706.707a.5.5 0 0 1 .058.638l-.058.07-3.005 3.004a2.5 2.5 0 0 0 3.405 3.658l.13-.122 3.006-3.005a.5.5 0 0 1 .638-.058l.069.058.707.707a.5.5 0 0 1 .058.638l-.058.069-3.005 3.005a4.5 4.5 0 0 1-6.524-6.196l.16-.168 3.005-3.005zm8.132-3.182a.25.25 0 0 1 .353 0l1.061 1.06a.25.25 0 0 1 0 .354l-8.132 8.132a.25.25 0 0 1-.353 0l-1.061-1.06a.25.25 0 0 1 0-.354l8.132-8.132z"
                                                ></path></svg></span
                                        >${url}</span
                                    ></span
                                ><span class="LinkCard-image" style="height: 60px"
                                    ><img
                                        src="${info.image}"
                                        alt="" /></span
                            ></a>
                        </div>`;
                    return html;
                },
                check_data(a, node, href) {
                    // some card have contained the information
                    const info = a[0].dataset;
                    if (info.image) {
                        node.outerHTML = this.external_raw(
                            info,
                            decodeURIComponent(href)
                        );
                        return true;
                    }
                    return false;
                },
                get_card_answer(node) {
                    const cards = node.getElementsByClassName(
                        "RichText-LinkCardContainer"
                    );
                    if (cards.length === 0) return;
                    const curls = [];
                    const cnodes = [];
                    for (const card of cards) {
                        if (
                            card.getElementsByClassName(
                                "LinkCard-title loading"
                            ).length === 0
                        )
                            continue;
                        const a = card.getElementsByTagName("a");
                        if (a.length > 0) {
                            const href = a[0].href;
                            if (!href || this.check_data(a, card, href))
                                continue;
                            cnodes.push({ url: href, node: card });
                            curls.push(href);
                        }
                    }
                    curls.length > 0 && this.load_card_info(curls, cnodes);
                },
                initial(node) {
                    this.get_card_answer(node);
                },
            },
            /**
             * @param {boolean} mode
             */
            set overFlow(mode) {
                document.documentElement.style.overflow = mode
                    ? "hidden"
                    : "auto";
            },
            getAnswerItem(node) {
                const item = node.getElementsByClassName(
                    "ContentItem AnswerItem"
                );
                return item.length > 0 ? item[0] : null;
            },
            //check the item whether is blocked
            blockCheck(arg) {
                if (
                    Object.prototype.toString.call(arg) ===
                    "[object HTMLCollection]"
                ) {
                    for (const e of arg) {
                        if (e.style.display === "none") continue;
                        const item = this.getAnswerItem(e);
                        if (item && item.style.display === "none") continue;
                        return e;
                    }
                } else {
                    if (arg.style.display === "none") return null;
                    const item = this.getAnswerItem(arg);
                    if (item && item.style.display === "none") return null;
                    else return arg;
                }
            },
            show_status: {
                node: null,
                show(f, tips, info) {
                    const html = `
                        <div
                            id="load_status"
                            style="
                                top: 0%;
                                z-index: 1000;
                                position: fixed;
                                height: 24px;
                                width: 50%;
                                font-size: 14px;
                                font-weight: 500;
                                margin-left: 25%;
                                text-align: center;
                                color: ${info.color};
                                background: ${info.bgc};
                                opacity: 0.8;
                                box-shadow: 0 0 15px #FFBB59;
                            "
                        >
                        ${info.text + tips}...
                        </div>`;
                    this.remove();
                    const anode = document.createElement("div");
                    f.appendChild(anode);
                    anode.outerHTML = html;
                    setTimeout(() => (this.node = f.lastElementChild), 0);
                },
                remove() {
                    if (this.node) {
                        this.timeID && clearTimeout(this.timeID);
                        this.node.remove();
                        this.node = null;
                        this.timeID = null;
                        this.istimeout = true;
                        this.backText = "";
                        this.backColor = "";
                    }
                },
                backText: "",
                backColor: "",
                changeTips(tips, time, info) {
                    if (this.node) {
                        if (this.istimeout) this.timeout(time);
                        else {
                            this.backText = this.node.innerText;
                            this.backColor = this.node.style.background;
                            this.timeID = setTimeout(() => {
                                this.timeID = null;
                                this.node.innerText = this.backText;
                                this.node.style.background = this.backColor;
                            }, time);
                        }
                        this.node.innerText = tips;
                        this.node.style.background = info.bgc;
                    }
                },
                auto_scroll_change(tips) {
                    this.node.innerText = tips;
                },
                timeout(time) {
                    this.timeID && clearTimeout(this.timeID);
                    this.timeID = setTimeout(
                        () => ((this.timeID = null), this.remove()),
                        time
                    );
                },
                timeID: null,
                istimeout: true,
                main(f, tips, type = 1, time = 2500, istimeout = true) {
                    const types = {
                        0: {
                            text: "",
                            bgc: "#FFBB59",
                            color: "#0A0A0D",
                        },
                        1: {
                            text: "Tips: ",
                            bgc: "#E1B5BA",
                            color: "#0A0A0D",
                        },
                        2: {
                            text: "Warning: ",
                            bgc: "#FF3300",
                            color: "#0A0A0D",
                        },
                    };
                    const info = types[type];
                    f
                        ? this.show(f, tips, info)
                        : this.changeTips(info.text + tips, time, info);
                    this.istimeout &&
                        (this.istimeout = istimeout) &&
                        this.timeout(time);
                },
            },
            get Toolbar() {
                return document.getElementById("artfullscreen_toolbar");
            },
            allAnswser_loaded: false,
            try_status: false,
            load_more_status: false,
            /**
             * @param {{ parentNode: any; }} pnode
             */
            set navPannel(pnode) {
                //---------------------------------------check if the node has pre and next node
                const className = pnode.className;
                if (className === "QuestionAnswer-content") {
                    this.prevNode = null;
                    const list = document.getElementsByClassName("List-item");
                    this.nextNode =
                        list.length > 0 ? this.blockCheck(list) : null;
                } else {
                    let next = pnode.nextElementSibling;
                    this.nextNode = null;
                    if (next) {
                        let nextName = next.className;
                        const arr = ["Pc-word", "List-item"];
                        let a = arr.indexOf(nextName);
                        let b = null;
                        while (a > -1) {
                            if (a === 0) {
                                b = next.nextElementSibling;
                                next.remove();
                                next = b;
                            }
                            if (this.blockCheck(next)) {
                                this.nextNode = next;
                                break;
                            } else {
                                next = next.nextElementSibling;
                                if (!next) break;
                                nextName = next.className;
                                a = arr.indexOf(nextName);
                            }
                        }
                    }
                    let pre = pnode.previousElementSibling;
                    this.prevNode = null;
                    if (pre) {
                        let pName = pre.className;
                        if (pName === "List-header") {
                            const c = document.getElementsByClassName(
                                "QuestionAnswer-content"
                            );
                            this.prevNode =
                                c.length > 0 ? this.blockCheck(c[0]) : null;
                        } else {
                            const arr = ["Pc-word", "List-item"];
                            let a = arr.indexOf(pName);
                            let b = null;
                            while (a > -1) {
                                if (a === 0) {
                                    b = pre.previousElementSibling;
                                    pre.remove();
                                    pre = b;
                                }
                                if (this.blockCheck(pre)) {
                                    this.prevNode = pre;
                                    break;
                                } else {
                                    pre = pre.previousElementSibling;
                                    if (!pre) break;
                                    pName = pre.className;
                                    a = arr.indexOf(pName);
                                }
                            }
                        }
                    }
                }
                if (
                    this.allAnswser_loaded ||
                    (!this.nextNode &&
                        (this.isSimple_page ||
                            (this.allAnswser_loaded = this.is_scrollBottom)))
                ) {
                    this.isShowTips &&
                        this.show_status.main(
                            this.show_status.node ? null : this.full,
                            "all answers have been loaded"
                        );
                    this.isShowTips = false;
                } else if (!(this.nextNode || this.try_status)) {
                    window.scrollTo(0, 0.75 * this.DDSH);
                    setTimeout(() => {
                        window.scrollTo(0, 0.98 * this.DDSH);
                        setTimeout(
                            () => (
                                (this.try_status = true),
                                (this.navPannel = pnode)
                            ),
                            300
                        );
                    }, 300);
                    return;
                }
                this.changeNav(this.nav);
                !this.isSimple_page &&
                    (this.display_load_more = !this.nextNode);
            },
            removeADs() {
                const ads = document.getElementsByClassName("Pc-word");
                let i = ads.length;
                if (i > 0) for (i; i--; ) ads[i].remove();
            },
            backgroundImage_cache: {
                _request(url) {
                    return new Promise((resolve, reject) => {
                        xmlHTTPRequest(url, 2500, "blob").then(
                            (blob) => {
                                const file = new FileReader();
                                file.readAsDataURL(blob);
                                file.onload = (result) =>
                                    result.target.readyState === 2
                                        ? resolve(result.target.result)
                                        : reject("file state");
                                file.onerror = (err) => {
                                    console.log(err);
                                    reject("file err");
                                };
                            },
                            (err) => {
                                console.log(err);
                                reject("xml err");
                            }
                        );
                    });
                },
                reader(f, url) {
                    this._request(url).then(
                        (base64) => {
                            f.style.backgroundImage = `url(${base64})`;
                            GM_setValue("bgpreader", base64);
                            colorful_Console.main(
                                {
                                    title: "changeBGP",
                                    content:
                                        "background image has been cached successfully",
                                },
                                colorful_Console.colors.Tips
                            );
                        },
                        () =>
                            Notification(
                                "failed to get background image",
                                "Warning"
                            )
                    );
                },
                try_status: false,
                article(back) {
                    if (GM_getValue("readerbgimg_mark")) return;
                    const url =
                        back ||
                        "https://www.cnblogs.com/skins/coffee/images/bg_body.gif";
                    this._request(url).then(
                        (base64) => {
                            GM_setValue("readerbgimg", base64);
                            GM_setValue("readerbgimg_mark", true);
                            console.log(
                                "background image has been cached successfully"
                            );
                        },
                        (err) => {
                            if (err.startsWith("file")) return;
                            if (this.try_status) {
                                colorful_Console(
                                    {
                                        title: "warning:",
                                        content:
                                            "failed to cach article background image",
                                    },
                                    colorful_Console.colors.warning
                                );
                                return;
                            }
                            this.try_status = true;
                            const b =
                                "https://img.meituan.net/csc/decb7d168d512de5341614a7e22b26e848725.gif";
                            this.article(b);
                        }
                    );
                },
            },
            nextNode: null,
            prevNode: null,
            curNode: null,
            aid: null,
            qid: null,
            isSimple_page: false,
            isShowTips: false,
            initial_id: null,
            ctrl_click(mode) {
                this.Filter.isReader = mode;
                !(mode || location.href.endsWith("#")) &&
                    (this.Filter.is_jump = true);
            },
            get is_scrollBottom() {
                return (
                    document.getElementsByClassName(
                        "Button QuestionAnswers-answerButton Button--blue Button--spread"
                    ).length > 0
                );
            },
            get DDSH() {
                return document.documentElement.scrollHeight;
            },
            initial_set(p) {
                setTimeout(() => {
                    this.overFlow = true;
                    this.navPannel = p;
                }, 100);
            },
            Change(node, aid) {
                aid === this.aid
                    ? this.ShowOrExit(true)
                    : this.changeContent(node, false);
            },
            load_content_finished: true,
            no_scroll: false,
            set_current_Type(node, aid) {
                const a = node
                    .getElementsByClassName("ContentItem-title")[0]
                    .getElementsByTagName("a")[0];
                if (!aid || (aid && this.aid !== aid)) {
                    const href = a.href;
                    this.content_type = href.includes("zhuanlan")
                        ? "article"
                        : href.includes("daily")
                        ? "daily"
                        : "answer";
                    this.qid =
                        this.content_type === "answer"
                            ? href.match(/(?<=question\/)\d+/)[0]
                            : null;
                }
                change_Title(a.innerText);
            },
            main(pnode, aid, mode = false) {
                this.initial_id && clearTimeout(this.initial_id);
                this.initial_id = setTimeout(() => {
                    this.initial_id = null;
                    this.load_content_finished = false;
                    if (this.no_scroll) {
                        this.set_current_Type(pnode, aid);
                        this.isSimple_page = true;
                    } else {
                        const pathname = location.pathname;
                        if (this.firstly) {
                            this.content_type = "answer";
                            this.qid = pathname.match(/(?<=question\/)\d+/)[0];
                        }
                        this.isSimple_page = pathname.includes("/answer/");
                        this.removeADs();
                        this.ctrl_click.call(zhihu, true);
                    }
                    this.curNode =
                        pnode.className === "ContentItem AnswerItem"
                            ? pnode.parentNode.parentNode
                            : pnode;
                    this.firstly ? this.Reader(pnode) : this.Change(pnode, aid);
                    this.aid = aid;
                    if (this.isSimple_page) this.initial_set(this.curNode);
                    else {
                        if ((this.allAnswser_loaded = this.is_scrollBottom))
                            this.initial_set(this.curNode);
                        else {
                            setTimeout(() => {
                                window.scrollTo(0, 0.75 * this.DDSH);
                                setTimeout(
                                    () => this.initial_set(this.curNode),
                                    300
                                );
                            }, 100);
                        }
                    }
                    this.firstly = false;
                    this.readerMode = true;
                    this.isShowTips = true;
                    mode && (this.autoScroll.is_nurse = true);
                    setTimeout(() => {
                        this.full.focus();
                        if (mode) {
                            this.autoScroll.is_nurse = false;
                            this.autoReader();
                            this.autoScroll.keyCount = 2;
                            this.autoScroll.start();
                            this.load_content_finished = true;
                        } else this.load_content_finished = true;
                    }, 1500);
                    //shift focus to reader, whick can make navigator control key can scroll the page
                }, 300);
            },
        },
        getData() {
            blackName = GM_getValue("blackname");
            if (blackName && Array.isArray(blackName)) {
                if (blackName.length > 0) {
                    const bn = GM_getValue("clear_blackname");
                    if (!bn) {
                        blackName = blackName.map((e) => clear_zero_width(e));
                        GM_setValue("blackname", blackName);
                        GM_setValue("clear_blackname", true);
                    }
                }
            } else blackName = [];
            blackTopicAndQuestion = GM_getValue("blacktopicAndquestion");
            (!blackTopicAndQuestion || !Array.isArray(blackTopicAndQuestion)) &&
                (blackTopicAndQuestion = []);
        },
        clipboardClear: {
            clear(text) {
                const cs = [
                    /。/g,
                    /：/g,
                    /；/g,
                    /？/g,
                    /！/g,
                    /（/g,
                    /）/g,
                    /“/g,
                    /”/g,
                    /、/g,
                    /，/g,
                    /《/g,
                    /》/g,
                ];
                const es = [
                    ". ",
                    ": ",
                    "; ",
                    "? ",
                    "! ",
                    "(",
                    ")",
                    '"',
                    '"',
                    ", ",
                    ", ",
                    "<",
                    ">",
                ];
                cs.forEach((s, i) => (text = text.replace(s, es[i])));
                this.write(text);
            },
            write(text) {
                window.navigator.clipboard.writeText(text);
            },
            replace_ZH: true,
            event() {
                this.replace_ZH =
                    GM_getValue("clipboard") === false ? false : true;
                document.oncopy = (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const copytext = getSelection();
                    copytext &&
                        (this.replace_ZH
                            ? this.clear(copytext)
                            : this.write(copytext));
                };
            },
        },
        turnPage: {
            main(mode) {
                const overlap = 100;
                const wh = window.innerHeight;
                let height = wh - overlap;
                height < 0 && (height = 0);
                let top =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    window.pageYOffset;
                if (mode) top += height;
                else top < height ? (top = 0) : (top -= height);
                window.scrollTo(0, top);
            },
            start(mode) {
                //n => scroll down ; u => scroll top
                window.requestAnimationFrame(this.main.bind(this, mode));
            },
        },
        scroll: {
            toTop() {
                let hTop =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                if (hTop === 0) return;
                const rate = 8;
                let sid = 0;
                const scrollToTop = () => {
                    hTop =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop;
                    if (hTop > 0) {
                        sid = window.requestAnimationFrame(scrollToTop);
                        window.scrollTo(0, hTop - hTop / rate);
                    } else {
                        sid !== 0 && window.cancelAnimationFrame(sid);
                    }
                };
                scrollToTop();
            },
            toBottom() {
                //take care this, if the webpage adopts waterfall flow design
                const height =
                    document.documentElement.scrollHeight ||
                    document.body.scrollHeight;
                const sTop =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                if (sTop >= height) return;
                let sid = 0;
                let shTop = 0;
                let rate = 6;
                const initial = 100;
                const scrollToBottom = () => {
                    const hTop =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        initial;
                    if (hTop < height && hTop > shTop) {
                        shTop = hTop;
                        sid = window.requestAnimationFrame(scrollToBottom);
                        window.scrollTo(0, hTop + hTop / rate);
                        rate += 0.2;
                    } else {
                        sid !== 0 && window.cancelAnimationFrame(sid);
                        sid = 0;
                        rate = 6;
                    }
                };
                scrollToBottom();
            },
        },
        multiSearch: {
            main(keyCode, keyword) {
                const Names = {
                    65: "AboutMe",
                    68: "Douban",
                    71: "Google",
                    73: "Install",
                    72: "Github",
                    77: "MDN",
                    66: "BiliBili",
                    90: "Zhihu",
                    80: "Python",
                    69: "Ecosia",
                    1002: "Douban_movie",
                    1001: "Douban_book",
                };
                const methods = {
                    Protocols: "https://",
                    string_length(str) {
                        const lg = [...str].reduce(
                            (length, e) =>
                                (length +=
                                    e.charCodeAt(0).toString(16).length === 4
                                        ? 2
                                        : 1),
                            0
                        );
                        return Math.floor(lg / 2);
                    },
                    Search(url, parameter = "") {
                        //baidu restrict the length of search keyword is 38;
                        const select = keyword || getSelection();
                        if (!select) return;
                        else {
                            const reg = /[\u4e00-\u9fa5]/;
                            const f = reg.test(select);
                            if (
                                f
                                    ? this.string_length(select) > 38
                                    : select.length > 76
                            ) {
                                Notification(
                                    "the length of keyword is too long",
                                    "Tips"
                                );
                                return;
                            }
                            if (f && blackKey.includes(select)) {
                                Notification(
                                    "your keyword contains rubbish word; don't search rubbish",
                                    "Warning",
                                    3500
                                );
                                colorful_Console.main(
                                    { title: "rubbish:", content: select },
                                    colorful_Console.colors.warning
                                );
                                return;
                            }
                        }
                        url += encodeURIComponent(select);
                        GM_openInTab(this.Protocols + url + parameter, {
                            insert: true,
                            active: true,
                        });
                    },
                    Douban_movie() {
                        this.Search(
                            "search.douban.com/movie/subject_search?search_text=",
                            "&cat=1002"
                        );
                    },
                    Douban_book() {
                        this.Search(
                            "search.douban.com/book/subject_search?search_text=",
                            "&cat=1001"
                        );
                    },
                    Ecosia() {
                        this.Search("www.ecosia.org/search?q=");
                    },
                    Google() {
                        this.Search("www.bing.com/search?q=");
                    },
                    Douban() {
                        this.Search("www.douban.com/search?q=");
                    },
                    Zhihu() {
                        this.Search("www.zhihu.com/search?q=", "&type=content");
                    },
                    MDN() {
                        this.Search("developer.mozilla.org/zh-CN/search?q=");
                    },
                    Github() {
                        this.Search("github.com/search?q=");
                    },
                    BiliBili() {
                        this.Search("search.bilibili.com/all?keyword=");
                    },
                    Install() {
                        this.Search("pypi.org/search/?q=");
                    },
                    Python() {
                        this.Search(
                            "docs.python.org/zh-cn/3/search.html?q=",
                            "&check_keywords=yes&area=default"
                        );
                    },
                    AboutMe() {
                        zhihu.shade.Support.main();
                    },
                };
                const name = Names[keyCode];
                name && methods[name]();
            },
            checkCode(c) {
                const code = c.charCodeAt(0);
                return code > 97 && code < 123
                    ? code - 32
                    : code > 65 && code < 91
                    ? code
                    : 0;
            },
            get Searchbar() {
                const header =
                    document.getElementsByClassName("Sticky AppHeader");
                if (header.length === 0) return "";
                const input = header[0].getElementsByTagName("input");
                return input.length === 0 ? "" : input[0].defaultValue.trim();
            },
            m(keyword) {
                const reg = /(?<=-)([a-z]|d[bm])\s/gi;
                const m = (
                    keyword.slice(-2, -1) === "-" ? `${keyword} ` : keyword
                ).match(reg);
                return m ? (m.length === 0 ? m[0] : [...new Set(m)]) : null;
            },
            last_time_s: "",
            site() {
                let keyword = prompt(
                    "support z, d, g, h, m, b, p, e,db, dm: like: z python; (search in zhihu); default: g",
                    getSelection() || this.Searchbar || this.last_time_s
                );
                if (!keyword || !(keyword = keyword.trim())) return true;
                this.last_time_s = keyword;
                if (keyword[0] === "$") {
                    keyword = keyword.slice(1);
                    const ms = this.m(keyword);
                    if (ms) {
                        const wreg = /(?<=-([a-z]|d[bm])\s)(?!-).+(?=[\s-\b])/i;
                        const tmp = (
                            keyword.slice(-2, -1) === "-"
                                ? keyword
                                : `${keyword} `
                        ).match(wreg);
                        if (tmp) {
                            ms.forEach((e, index) => {
                                setTimeout(() => {
                                    let c = this.checkCode(e);
                                    c &&
                                        (c =
                                            c === 68
                                                ? e[1]
                                                    ? e[1].toLowerCase() === "b"
                                                        ? 1001
                                                        : 1002
                                                    : c
                                                : c) &&
                                        this.main(c, tmp[0]);
                                }, index * 350);
                            });
                        } else Notification("failed to get keyword", "Warning");
                        return true;
                    }
                }
                const tmp = keyword.slice(0, 3).toLowerCase();
                const i = ["db ", "dm "].indexOf(tmp);
                if (i > -1) {
                    this.main(i === 0 ? 1001 : 1002, keyword.slice(3).trim());
                    return;
                }
                const reg = /[a-z]\s/i;
                const code = this.checkCode(keyword[0]);
                code && keyword.match(reg)
                    ? this.main(code, keyword.slice(2).trim())
                    : this.main(71, keyword);
                return true;
            },
        },
        noteHighlight: {
            editable: false,
            disableSiderbar(pevent) {
                const column = document.getElementById("column_lists");
                if (column) column.style.pointerEvents = pevent;
            },
            EditDoc(status) {
                const [edit, tips, pevent] = this.editable
                    ? ["inherit", "exit", "inherit"]
                    : ["true", "enter", "none"];
                document.body.contentEditable = edit;
                Notification(tips + " page editable mode", "Editable");
                this.disableSiderbar(pevent);
                this.editable = !this.editable;
                this.editable
                    ? status.create("Editable Mode")
                    : status.remove();
            },
            get Selection() {
                return window.getSelection();
            },
            setMark(text, type) {
                return `<mark class="AssistantMark ${type}">${text}</mark>`;
            },
            get createElement() {
                return document.createElement("markspan");
            },
            appendNewNode(node, type) {
                const text = node.nodeValue;
                const span = this.createElement;
                node.parentNode.replaceChild(span, node);
                span.outerHTML = this.setMark(text, type);
            },
            getTextNode(node, type) {
                node.nodeType === 3 && this.appendNewNode(node, type);
            },
            Marker(keyCode) {
                const cname = {
                    82: "red",
                    89: "yellow",
                    80: "purple",
                    71: "green",
                };
                const type = cname[keyCode];
                if (!type) return;
                const select = this.Selection;
                if (!select.anchorNode || select.isCollapsed) return;
                let i = select.rangeCount;
                const r = select.getRangeAt(--i);
                let start = r.startContainer;
                const end = r.endContainer;
                const offs = r.startOffset;
                const offe = r.endOffset;
                let nodeValue = r.startContainer.nodeValue;
                if (start !== end) {
                    //start part
                    let next = start.nextSibling;
                    let p = start.parentNode;
                    if (!p.className.startsWith("AssistantMark")) {
                        const text = nodeValue.slice(offs);
                        const span = this.createElement;
                        p.replaceChild(span, start);
                        span.outerHTML =
                            nodeValue.slice(0, offs) + this.setMark(text, type);
                    }
                    //mid part
                    while (true) {
                        if (next) {
                            start = next;
                        } else {
                            next = p.nextSibling;
                            while (!next) {
                                p = p.parentNode;
                                next = p.nextSibling;
                            }
                            start = next;
                        }
                        //get the deepest level node
                        while (start.childNodes.length > 0)
                            start = start.childNodes[0];
                        if (start === end) break;
                        p = start.parentNode;
                        next = p.nextSibling;
                        !p.className.startsWith("AssistantMark") &&
                            this.getTextNode(start, type);
                    }
                    //end part
                    nodeValue = start.nodeValue;
                    start = start.parentNode;
                    if (start.className.startsWith("AssistantMark")) return;
                    const text = nodeValue.slice(0, offe);
                    const epan = this.createElement;
                    start.replaceChild(epan, end);
                    epan.outerHTML =
                        this.setMark(text, type) + nodeValue.slice(offe);
                } else {
                    //all value in one node;
                    const text = nodeValue.slice(offs, offe);
                    const span = this.createElement;
                    start.parentNode.replaceChild(span, start);
                    span.outerHTML =
                        nodeValue.slice(0, offs) +
                        this.setMark(text, type) +
                        nodeValue.slice(offe);
                }
            },
            Restore(node) {
                const p = node.parentNode;
                if (p.className.startsWith("AssistantMark")) {
                    p.parentNode.innerHTML = p.parentNode.innerText;
                    return true;
                }
                return false;
            },
            removeMark() {
                const select = this.Selection;
                if (!select.anchorNode || select.isCollapsed) return;
                let i = select.rangeCount;
                const r = select.getRangeAt(--i);
                let start = r.startContainer;
                const end = r.endContainer;
                if (start !== end) {
                    let t = start.nodeType;
                    if (t !== 3 && r.collapsed) {
                        const nodes =
                            start.getElementsByClassName("AssistantMark");
                        let i = nodes.length;
                        if (i > 0) {
                            for (i; i--; ) {
                                const p = nodes[i].parentNode;
                                p.innerhHTML = p.innerText;
                            }
                        }
                        return;
                    }
                    while (start.childNodes.length > 0)
                        start = start.childNodes[0];
                    let p = start.parentNode.parentNode;
                    let next = start.nextSibling;
                    let result = this.Restore(start);
                    //if this is mark node, will be removed, so we need get the parentnode to backup, if it is not mark node, restore the parentnode
                    !result && (p = start.parentNode);
                    while (true) {
                        if (next) {
                            start = next;
                        } else {
                            next = p.nextSibling;
                            while (!next) {
                                p = p.parentNode;
                                next = p.nextSibling;
                            }
                            start = next;
                        }
                        while (start.childNodes.length > 0)
                            start = start.childNodes[0];
                        if (start === end) break;
                        p = start.parentNode.parentNode;
                        next = start.nextSibling;
                        result = this.Restore(start);
                        !result && (p = start.parentNode);
                    }
                }
                this.Restore(start);
            },
        },
        autoScroll: {
            stepTime: 40,
            keyCount: 1,
            scrollState: false,
            scrollTime: null,
            scrollPos: null,
            bottom: 100,
            zhuanlanAuto_mode: false,
            pageScroll(TimeStamp) {
                const position =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    window.pageYOffset;
                if (this.scrollTime) {
                    this.scrollPos =
                        this.scrollPos !== null
                            ? this.scrollPos +
                              (TimeStamp - this.scrollTime) / this.stepTime
                            : position;
                    window.scrollTo(0, this.scrollPos);
                }
                this.scrollTime = TimeStamp;
                if (this.scrollState) {
                    let h =
                        document.documentElement.scrollHeight ||
                        document.body.scrollHeight;
                    h = h - window.innerHeight - this.bottom;
                    position < h
                        ? window.requestAnimationFrame(
                              this.pageScroll.bind(this)
                          )
                        : this.stopScroll(true);
                }
            },
            disableEvent(mode) {
                const h = document.getElementsByClassName(
                    "RichText ztext Post-RichText"
                );
                if (h.length === 0) return;
                h[0].style.pointerEvents = mode ? "none" : "inherit";
            },
            show_status: {
                node: null,
                show(tips) {
                    const html = `
                        <div
                            id="load_status"
                            style="
                                top: 0%;
                                z-index: 1000;
                                position: fixed;
                                height: 24px;
                                width: 50%;
                                font-size: 14px;
                                font-weight: 500;
                                margin-left: 25%;
                                text-align: center;
                                background: #FFBB59;
                                opacity: 0.8;
                                box-shadow: 0 0 15px #FFBB59;
                            "
                        >
                        Tips: ${tips}...
                        </div>`;
                    const anode = document.createElement("div");
                    document.documentElement.appendChild(anode);
                    anode.outerHTML = html;
                    setTimeout(
                        () =>
                            (this.node =
                                document.documentElement.lastElementChild),
                        0
                    );
                },
                remove() {
                    if (this.node) {
                        this.node.remove();
                        this.node = null;
                    }
                },
                create(tips) {
                    this.show(tips);
                },
            },
            zhuanlanAuto() {
                if (!this.zhuanlanAuto_mode && zhihu.Column.targetIndex === 0) {
                    Notification("current article is not in left menu");
                    return;
                }
                this.zhuanlanAuto_mode = !this.zhuanlanAuto_mode;
                const text = `${
                    this.zhuanlanAuto_mode ? "enter" : "exit"
                } autoscroll mode`;
                Notification(text, "Tips");
                this.zhuanlanAuto_mode
                    ? this.show_status.create("Auto Mode")
                    : this.show_status.remove();
            },
            get article_lists() {
                const c = document.getElementById("column_lists");
                if (!c) return null;
                const a = c.getElementsByClassName("article_lists");
                return a.length === 0 ? null : a[0].children;
            },
            nextPage() {
                const ch = this.article_lists;
                if (!ch) return;
                const i = zhihu.Column.targetIndex;
                if (ch.length === 0 || i === ch.length) {
                    Notification(
                        "no more content, have reach the last page of current menu",
                        "tips"
                    );
                    return;
                }
                ch[i].children[2].click();
                setTimeout(() => {
                    this.keyCount = 2;
                    this.start();
                }, 2500);
            },
            //0-9 => click target article;
            key_Click(keyCode) {
                const ch = this.article_lists;
                let index = keyCode - 47;
                if (index > ch.length) return;
                ch[--index].children[2].click();
            },
            key_next_Pre(keyCode) {
                const c = document.getElementById("column_lists");
                if (!c) return;
                const n = c.getElementsByClassName("nav button");
                let i = keyCode - 188;
                n.length > 0 &&
                    (i === 0
                        ? n[0].children[i].click()
                        : n[0].children[--i].click());
            },
            popup() {
                createPopup();
                const tips = document.getElementById("autoscroll-tips");
                let buttons = tips.getElementsByTagName("button");
                const id = setTimeout(() => {
                    tips.remove();
                    zhihu.scroll.toTop();
                    this.nextPage();
                }, 3500);
                buttons[0].onclick = () => {
                    clearTimeout(id);
                    tips.remove();
                    zhihu.scroll.toTop();
                    this.nextPage();
                };
                buttons[1].onclick = () => {
                    clearTimeout(id);
                    tips.remove();
                };
                buttons = null;
            },
            stopScroll(mode = false) {
                if (this.scrollState) {
                    this.scrollPos = null;
                    this.scrollTime = null;
                    this.scrollState = false;
                    this.keyCount = 1;
                }
                if (mode) {
                    this.disableEvent(false);
                    this.zhuanlanAuto_mode &&
                        setTimeout(() => this.popup(), 1500);
                }
            },
            speedUP() {
                this.stepTime < 10 ? (this.stepTime = 5) : (this.stepTime -= 5);
            },
            slowDown() {
                this.stepTime > 100
                    ? (this.stepTime = 100)
                    : (this.stepTime += 5);
            },
            start() {
                this.keyCount += 1;
                if (this.keyCount % 2 === 0) return;
                this.scrollState
                    ? (this.stopScroll(), this.disableEvent(false))
                    : ((this.scrollState = true),
                      this.disableEvent(true),
                      window.requestAnimationFrame(this.pageScroll.bind(this)));
            },
            noColorful() {
                const color = GM_getValue("nocolofultext");
                if (color) {
                    GM_setValue("nocolofultext", false);
                    const text = "the feature of colorful text has been enable";
                    zhihu.colorAssistant.main();
                    Notification(text, "Tips");
                } else {
                    if (!confirm("disable colorful text?")) return;
                    GM_setValue("nocolofultext", true);
                    const text = "colorful text has been disable";
                    Notification(text, "Tips");
                    confirm("reload current webpage?") &&
                        (sessionStorage.clear(), location.reload());
                }
            },
            Others(keyCode, shift, auto) {
                shift
                    ? keyCode === 67
                        ? this.noteHighlight.removeMark()
                        : keyCode === 219
                        ? auto
                            ? Notification(
                                  "please exit auto mode firstly",
                                  "Tips"
                              )
                            : this.Column.pagePrint(this.autoScroll.show_status)
                        : keyCode === 70
                        ? !this.autoScroll.scrollState && this.Column.follow()
                        : keyCode === 76
                        ? this.Column.columnsModule.recentModule.log("p")
                        : keyCode === 83
                        ? this.Column.subscribe()
                        : keyCode === 68
                        ? this._top_Picture.main()
                        : this.noteHighlight.Marker(keyCode)
                    : keyCode === 113
                    ? !this.autoScroll.scrollState &&
                      this.noteHighlight.EditDoc(this.autoScroll.show_status)
                    : keyCode === 78
                    ? !this.autoScroll.scrollState && this.turnPage.start(true)
                    : keyCode === 84
                    ? !this.autoScroll.scrollState && this.scroll.toTop()
                    : keyCode === 82
                    ? !this.autoScroll.scrollState && this.scroll.toBottom()
                    : keyCode === 85
                    ? !this.autoScroll.scrollState && this.turnPage.start(false)
                    : this.multiSearch.main(keyCode);
            },
            check_common_key(shift, keyCode) {
                return this.common_KeyEevnt(shift, keyCode, 5);
            },
            key_conflict(keyCode, shift) {
                return (
                    68 === keyCode || (shift && [85, 71, 67].includes(keyCode))
                );
            },
            keyBoardEvent() {
                document.addEventListener(
                    "keydown",
                    (e) => {
                        const keyCode = e.keyCode;
                        if (e.ctrlKey || e.altKey) return;
                        const className = e.target.className;
                        if (
                            (className &&
                                typeof className === "string" &&
                                className.includes("DraftEditor")) ||
                            e.target.localName === "input"
                        )
                            return;
                        const shift = e.shiftKey;
                        if (this.key_conflict(keyCode, shift)) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        if (this.check_common_key.call(zhihu, shift, keyCode))
                            return;
                        shift
                            ? keyCode === 65
                                ? zhihu.Column.modePrint
                                    ? Notification(
                                          "please exit print mode firstly",
                                          "Tips"
                                      )
                                    : this.zhuanlanAuto()
                                : keyCode === 66
                                ? !this.scrollState &&
                                  MangeData.exportData.main(false)
                                : keyCode === 84
                                ? this.noColorful()
                                : keyCode === 73
                                ? !this.scrollState &&
                                  MangeData.importData.main(true)
                                : this.Others.call(
                                      zhihu,
                                      keyCode,
                                      shift,
                                      this.zhuanlanAuto_mode
                                  )
                            : keyCode === 192
                            ? this.start()
                            : keyCode === 187
                            ? this.speedUP()
                            : keyCode === 189
                            ? this.slowDown()
                            : keyCode > 47 && keyCode < 58
                            ? !this.scrollState && this.key_Click(keyCode)
                            : keyCode === 188 || keyCode === 190
                            ? this.key_next_Pre(keyCode)
                            : this.Others.call(zhihu, keyCode);
                    },
                    true
                );
            },
        },
        shade: {
            Support: {
                interval: 0,
                support: null,
                tips: null,
                opacity: null,
                opacityChange(opacity) {
                    const target =
                        document.getElementById("screen_shade_cover");
                    target &&
                        (this.opacity === null
                            ? (this.opacity = target.style.opacity)
                            : target.style.opacity !== opacity) &&
                        (target.style.opacity = opacity);
                },
                share_weibo() {
                    const url = `https%3A%2F%2Fservice.weibo.com%2Fshare%2Fshare.php%3Furl%3D${
                        Assist_info_URL.greasyfork
                    }%26title%3D%E4%B9%9F%E8%AE%B8%E8%BF%99%E6%98%AF%E9%92%88%E5%AF%B9%E7%9F%A5%E4%B9%8E%E6%9C%80%E6%A3%92%E7%9A%84GM%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC...%26summery%3Dundefined%26pic%3D${
                        Assist_info_URL.Overview
                    }%23_loginLayer_${Date.now()}`;
                    GM_openInTab(decodeURIComponent(url), {
                        insert: true,
                        active: true,
                    });
                },
                creatPopup() {
                    this.opacityChange(0);
                    const mt = -5;
                    const html = `
                        <div
                            id="support_me"
                            style="
                                background: darkgray;
                                text-align: justify;
                                width: 700px;
                                font-size: 16px;
                                height: 468px;
                                position: fixed;
                                top:50%;
                                left:50%;
                                transform: translate(-50%,-50%);
                                z-index: 100000;
                            "
                        >
                            <div style="padding: 2.5%; font-weight: bold; font-size: 18px">
                                Support Me!
                                <span
                                    class="shorts_cut"
                                    style="font-size: 12px; font-weight: normal; float: right"
                                >
                                    <i
                                        title="Share with your friends. Share to Weibo"
                                        style="
                                            margin-right: 10px;
                                            content: url(data:image/webp;base64,UklGRpQCAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSEMBAAABkEPbtqk95/f/V7Zt23Zl2zaS1lZl26pS2bYr2/Y+Y+Q56COCgdu2jaiO2/cP+i+zXHX64v4ZERp0AWD82uukmvO+3RuPfgUehyrQ9wk1IZnsF//iBzZyXBc+YX4SIWLSP7XMmLrBa6VMZnwBGNgp0gDwDQ/aiB8uYv5XGSInRGxXrHmJc3r+QK9I9htIbCbD1IEpgx7k9RGJOnexQlD4haXtXPaGmflLCh3hOjrF23/L/AKAla6vp1vIojtYS+T9itVYQwUT9Sx/YowMz0KVRiIiw9MP3Gmc1bUpnohIV5/MXkPdAuy1Fv2rH2oxzhsLDmmANsEH1tAqAWtZFgmeaVEuWKfBHSNB8DdW27cUEn9K7fKtkkgyvqnyJJtkijml7Psya5JNN3/PZ5YJD+Z6knKmBZO2nbh48cL+FQORevQ/RQBWUDggKgEAABAIAJ0BKiAAIAA+/WipUCsmI6K3+qgBYB+JbACxJUFQHfiEFfHwGtsBz7HoA/8d83ERurTFFC3XZ2heLuM8uASQPJxgagYfSgAA/v2cFsCNurXRc76P3X8TWo+3Y/VxyyWC6vvnBd8IvPf6RtM/8uS/R1yLg/YXbeGP9/pJeHLqqU7JoNtefw+pVV97nOvsWQJyUnS6nhPSsAJa1sZCngcrLW25R+z6rRjIPo44BNoN0ortQPag126JEaPfYnYBbOX189JyQGTTDrvlXpC6ORWp/9If1o/tepDtm0Ny7XIxyeW7kJPb/5QPomjRA/ZkCh9LmA/qnF0ZaQT9FyXh/bcczDvYLv7sf9OvhZFybe+VPu5BxB1hzqUXJZrQP3ModfJenTfZMJeAAAA=);
                                        "
                                    ></i>
                                    <a
                                        href=${Assist_info_URL.shortcuts}
                                        target="_blank"
                                        title="shortcuts diagram"
                                        style="color: #2b638b"
                                        >Shortcuts</a
                                    >
                                    <span> || Version: ${GM_info.script.version}</span>
                                </span>
                            </div>
                            <div style="font-style: italic; font-size: 16px; padding-left: 2%">
                                Make Thing Better &amp;&amp; Simpler!
                                <img
                                    src="data:image/png;base64,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GEuv6XUAs4ZuQ4CCK840bndhAoCprELkC6QkFHzJHG5R+v2/y78BmfVhpxDogDsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDctMTlUMDM6Mzk6MjArMDA6MDCGZw5cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA4VDE3OjI5OjQxKzAwOjAwZ4bKzwAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA2NLzgqYQAAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANjRET2kJAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1NDY5Njg1ODEI9oyUAAAAEXRFWHRUaHVtYjo6U2l6ZQAxMzU2QtzgBkMAAABYdEVYdFRodW1iOjpVUkkAZmlsZTovLy9kYXRhL3d3d3Jvb3Qvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzU2LzU2Mjk0OC5wbmdNCDr0AAAAAElFTkSuQmCC"
                                    style="
                                        float: left;
                                        height: 42px;
                                        width: 42px;
                                        margin: -10px 4px 0 0px;
                                    "
                                />
                            </div>
                            <div
                                class="support_img"
                                style="padding-top: 4%; width: 100%; padding-left: 7.5%"
                            >
                                <div class="qrCode">
                                    <img
                                        src="data:image/webp;base64,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"
                                    />
                                </div>
                            </div>
                            <div class="timeout" style="font-size: 12px; padding: 3%">
                                15s, this Tips will be automatically closed or can you just click
                            </div>
                            <a
                                href=${Assist_info_URL.usermanual}
                                target="blank"
                                style="margin: ${mt}px 10px 0px 0px; float: right; font-size: 14px"
                                title="user manual"
                            >
                                Github: Kyouichirou
                            </a>
                        </div>`;
                    document.documentElement.insertAdjacentHTML(
                        "beforeend",
                        html
                    );
                    this.support = document.getElementById("support_me");
                    this.tips =
                        this.support.getElementsByClassName("timeout")[0];
                    let time = 15;
                    this.interval = setInterval(() => {
                        time--;
                        this.tips.innerText = `${time}s, this Tips will be automatically closed or you can just click`;
                        time === 0 && this.remove();
                    }, 1000);
                    this.support.onclick = (e) =>
                        e.target.localName === "i"
                            ? this.share_weibo()
                            : e.target.localName !== "a" &&
                              setTimeout(() => this.remove(), 120);
                },
                remove() {
                    clearInterval(this.interval);
                    this.opacityChange(this.opacity);
                    this.opacity = null;
                    this.interval = null;
                    this.support.remove();
                    this.support = null;
                    this.tips = null;
                },
                main() {
                    this.support ? this.remove() : this.creatPopup();
                },
            },
            cover(color, opacity = 0.5) {
                const html = `
                    <div
                        id="screen_shade_cover"
                        style="
                            transition: opacity 0.1s ease 0s;
                            z-index: 10000000;
                            margin: 0;
                            border-radius: 0;
                            padding: 0;
                            background: ${color};
                            pointer-events: none;
                            position: fixed;
                            top: -10%;
                            right: -10%;
                            width: 120%;
                            height: 120%;
                            opacity: ${opacity};
                            mix-blend-mode: multiply;
                            display: block;
                        "
                    ></div>`;
                const cnode = document.documentElement;
                cnode && cnode.insertAdjacentHTML("afterbegin", html);
            },
            menu(e) {
                const target = document.getElementById("screen_shade_cover");
                target &&
                    target.style.background !== this[e] &&
                    (target.style.background = this[e]) &&
                    arguments.length === 2 &&
                    GM_setValue("color", e);
                GM_deleteValue("tmp_cover");
            },
            get opacity() {
                const date = new Date();
                const m = date.getMonth();
                const h = date.getHours();
                const [start, a] = m > 9 ? [15, 0.08] : [16, 0.12];
                let opacity =
                    h > 20
                        ? h > 22
                            ? 0.6
                            : 0.5
                        : h < 8
                        ? 0.65
                        : h > start
                        ? h === 18
                            ? 0.35
                            : h === 19
                            ? 0.45
                            : h === 20
                            ? 0.5
                            : 0.3
                        : 0.15;
                return (opacity += opacity < 0.2 ? 0 : a);
            },
            opacityMonitor() {
                const opacity = GM_getValue("opacity");
                const target = document.getElementById("screen_shade_cover");
                target &&
                    opacity &&
                    target.style.opacity !== opacity &&
                    (target.style.opacity = opacity);
            },
            supportID: null,
            SupportMenu() {
                this.supportID = GM_registerMenuCommand(
                    "Support || Donation",
                    this.Support.main.bind(this.Support),
                    "d4"
                );
            },
            disableShade: {
                id: null,
                cmenu() {
                    this.id = GM_registerMenuCommand(
                        "Switch",
                        this.func.bind(this),
                        "s5"
                    );
                },
                rmenu() {
                    GM_unregisterMenuCommand(this.id);
                },
                func() {
                    const target =
                        document.getElementById("screen_shade_cover");
                    target &&
                        (target.style.display =
                            target.style.display === "block"
                                ? "none"
                                : "block");
                },
            },
            menuID: null,
            Switchfunc() {
                const target = document.getElementById("screen_shade_cover");
                let result = false;
                if (target) {
                    if (arguments.length > 0 && !arguments[0]) return;
                    target.remove();
                    result = true;
                    this.disableShade.rmenu();
                    let i = this.menuID.length;
                    GM_removeValueChangeListener(this.opacitylistenID);
                    GM_removeValueChangeListener(this.colorlistenID);
                    for (i; i--; ) GM_unregisterMenuCommand(this.menuID[i]);
                    this.menuID = null;
                } else {
                    //rebuild menu
                    if (arguments.length > 0 && arguments[0]) return;
                    if (this.menuID) return;
                    GM_unregisterMenuCommand(this.switchID);
                    GM_unregisterMenuCommand(this.supportID);
                    this.createShade();
                    this.SwitchMenu();
                    this.SupportMenu();
                }
                arguments.length === 0 && GM_setValue("turnoff", result);
            },
            switchID: null,
            SwitchMenu() {
                this.switchID = GM_registerMenuCommand(
                    "Turn(On/Off)",
                    this.Switchfunc.bind(this),
                    "t6"
                );
            },
            turnoffID: null,
            start() {
                !GM_getValue("turnoff") && this.createShade();
                this.SwitchMenu();
                this.SupportMenu();
                this.turnoffID = GM_addValueChangeListener(
                    "turnoff",
                    (name, oldValue, newValue, remote) => {
                        if (!remote || oldValue === newValue) return;
                        this.Switchfunc(newValue, true);
                    }
                );
            },
            colorlistenID: null,
            opacitylistenID: null,
            get tmp_cover() {
                const tc = GM_getValue("tmp_cover");
                if (!tc) return null;
                if (tc.status !== "a") return null;
                const u = tc.update;
                if (!u) return null;
                const r = tc.rtime;
                if (!r) return null;
                if (Date.now() - u > r) return null;
                return tc;
            },
            sing_protect: false,
            tmp_c(color) {
                const c = document.getElementById("screen_shade_cover");
                c.style.background = color;
            },
            createShade() {
                const colors = {
                    yellow: "rgb(247, 232, 176)",
                    green: "rgb(202 ,232, 207)",
                    grey: "rgb(182, 182, 182)",
                    olive: "rgb(207, 230, 161)",
                };
                const tc = this.tmp_cover;
                let color = GM_getValue("color");
                color && (color = colors[color]);
                tc && tc.color && (color = tc.color);
                if (!color) {
                    const h = new Date().getHours();
                    color = h > 8 && h < 17 ? colors.yellow : colors.grey;
                }
                const opacity =
                    (tc && tc.opacity && tc.opacity) || this.opacity;
                this.cover(color, opacity);
                const UpperCase = (e) =>
                    e.slice(0, 1).toUpperCase() + e.slice(1);
                this.menuID = [];
                for (const c of Object.entries(colors)) {
                    const id = GM_registerMenuCommand(
                        UpperCase(c[0]),
                        this.menu.bind(colors, c[0], true),
                        c[0]
                    );
                    this.menuID.push(id);
                }
                //note, who is the "this" in the GM_registerMenuCommand? take care of "this", must bind (function => this)
                this.colorlistenID = GM_addValueChangeListener(
                    "color",
                    (name, oldValue, newValue, remote) => {
                        if (
                            !remote ||
                            oldValue === newValue ||
                            this.sing_protect
                        )
                            return;
                        newValue.startsWith("#")
                            ? this.tmp_c(newValue)
                            : this.menu.call(colors, newValue);
                    }
                );
                GM_setValue("opacity", opacity);
                this.opacitylistenID = GM_addValueChangeListener(
                    "opacity",
                    (name, oldValue, newValue, remote) =>
                        remote &&
                        !this.sing_protect &&
                        oldValue !== newValue &&
                        this.opacityMonitor()
                );
                this.disableShade.cmenu();
                !tc && GM_deleteValue("tmp_cover");
            },
        },
        settings_Popup: {
            /*
            1. adopted from https://greasyfork.org/zh-CN/scripts/27752-searchenginejump
            2. part of html and css is adpoted;
            */
            node: null,
            create() {
                const html = `
                <div
                    id="settingLayerMask"
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: stretch;
                        opacity: 1;
                    "
                >
                    <style>
                        #settingLayerMask {
                            display: none;
                            justify-content: center;
                            align-items: center;
                            position: fixed;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            background-color: rgba(0, 0, 0, 0.5);
                            z-index: 200000000;
                            overflow: auto;
                            font-family: arial, sans-serif;
                            min-height: 100%;
                            font-size: 16px;
                            transition: 0.5s;
                            opacity: 0;
                            user-select: none;
                            -moz-user-select: none;
                            padding-bottom: 80px;
                            box-sizing: border-box;
                        }
                        #settingLayer {
                            height: 360px;
                            display: flex;
                            flex-wrap: wrap;
                            padding: 20px;
                            margin: 0px 25px 50px 5px;
                            background-color: #fff;
                            border-radius: 4px;
                            position: absolute;
                            min-width: 700px;
                            transition: 0.5s;
                        }
                        span.drag {
                            display: block;
                            position: relative;
                        }
                        span.sej-engine {
                            background-color: #ccc;
                            border-radius: 2px;
                            width: 100%;
                            box-sizing: border-box;
                            cursor: pointer;
                            line-height: 2;
                            display: inline-block;
                            margin: 0 0px 0 0;
                            border: none;
                            padding: 0 6px;
                            font-weight: 500;
                            color: #333 !important;
                            transition: background-color 0.15s ease-in-out;
                        }
                        #btnEle {
                            position: absolute;
                            width: 100%;
                            bottom: 4px;
                            right: 0;
                            background: #fff;
                            border-radius: 4px;
                        }
                        #btnEle > div {
                            width: 100%;
                            margin-bottom: -100%;
                            display: flex;
                            justify-content: space-around;
                            background: #eff4f8;
                            border-radius: 4px;
                        }
                        #btnEle .feedback {
                            border-color: #aaa;
                        }
                        #btnEle span {
                            display: inline-block;
                            background: #eff4f8;
                            border: 1px solid #3abdc1;
                            margin: 12px auto 10px;
                            color: #3abdc1;
                            padding: 5px 10px;
                            border-radius: 4px;
                            cursor: pointer;
                            outline: none;
                            transition: 0.3s;
                        }
                        #btnEle a {
                            color: #999;
                            text-decoration: none;
                        }
                        #xin-close {
                            background: white;
                            color: #3abdc1;
                            line-height: 20px;
                            text-align: center;
                            height: 20px;
                            width: 20px;
                            text-align: center;
                            font-size: 20px;
                            padding: 10px;
                            border: 3px solid #3abdc1;
                            border-radius: 50%;
                            transition: 0.5s;
                            top: -20px;
                            right: -20px;
                            position: absolute;
                        }
                        #xin-close::before {
                            content: "\\2716";
                        }
                    </style>
                    <div
                        id="settingLayer"
                        style="top: 45%; left: 50%; transform: translate(-50%, -50%)"
                    >
                        <div class="setting_content" style="margin-left: 5%"></div>
                        <div id="btnEle">
                            <div class="btnEleLayer">
                                <span class="feedback"
                                    ><a
                                        target="_blank"
                                        href=${Assist_info_URL.greasyfork}
                                        >Greasyfork</a
                                    ></span
                                ><span class="feedback"
                                    ><a
                                        target="_blank"
                                        title="user manual"
                                        href=${Assist_info_URL.usermanual}
                                        >GitHub</a
                                    ></span
                                ><span class="feedback"
                                    ><a
                                        target="_blank"
                                        href=${Assist_info_URL.shortcuts}
                                        >Shortcuts</a
                                    ></span
                                ><span class="feedback"
                                ><a
                                    target="_blank"
                                    href=${Assist_info_URL.feedback}
                                    >Feedback</a
                                ></span
                                >
                                <span id="xin-save" title="save &amp; close">Save&Close</span>
                            </div>
                        </div>
                        <span id="xin-close" title="close"></span>
                    </div>
                </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
                this.event();
            },
            event() {
                setTimeout(() => {
                    this.node = document.getElementById("settingLayerMask");
                    this.node.onclick = (e) => {
                        const id = e.target.id;
                        id && id.includes("close") && this.remove();
                    };
                }, 50);
            },
            remove() {
                if (this.node) {
                    this.node.remove();
                    this.node = null;
                }
            },
            main() {
                this.node ? this.remove() : this.create();
            },
        },
        white_noise: {
            get Index() {
                const index = GM_getValue("white_noise");
                return typeof index === "number" ? index : 0;
            },
            get_musice(index) {
                const audio_sources = [
                    "rain_sound_1",
                    "rain_sound_2",
                    "white_noise_1",
                    "river_stream_1",
                    "campfire_1",
                    "winter_traffic_1",
                    "ocean_waves_1",
                    "blizzard_1",
                    "forest_wind_1",
                    "crickets_1",
                ];
                const pref = "https://noizzze.com/audio/";
                const suffix = ".mp3";
                const f = index > audio_sources.length - 1;
                f && GM_setValue("white_noise", 0);
                return pref + audio_sources[f ? 0 : index] + suffix;
            },
            audio_ctrl: {
                audio: null,
                volume: 0,
                play_pause() {
                    this.audio && this.audio.paused
                        ? this.audio.play()
                        : this.audio.pause();
                    return true;
                },
                voice_up_down(e) {
                    if (!this.audio) return true;
                    let vx = this.volume;
                    if (e) {
                        if (vx >= 1) return true;
                        vx += 0.1;
                    } else {
                        if (vx <= 0) return true;
                        vx -= 0.1;
                    }
                    this.audio.volume = vx;
                    this.volume = vx;
                    return true;
                },
            },
            set_audio(audio, mode = false) {
                audio.loop = true;
                this.audio_ctrl.volume = audio.volume;
                audio.oncanplay = () => (mode ? (mode = false) : audio.play());
                audio.onerror = (e) => {
                    console.log(e);
                    Notification(
                        "failed to load mp3 of white noise",
                        "Warning"
                    );
                };
            },
            just_audio() {
                const audio = document.createElement("audio");
                audio.src = this.get_musice(this.Index);
                this.set_audio(audio);
                Notification("create audio successfully", "Tips");
                this.audio_ctrl.audio = audio;
            },
            destroy_audio() {
                if (this.audio_ctrl.audio) {
                    this.audio_ctrl.audio.pause();
                    this.audio_ctrl.audio = null;
                    Notification("the audio has been destroyed", "Tips");
                } else this.just_audio();
                return true;
            },
            create(node) {
                const html = `
                    <div class="white_noise" style="position: absolute; margin-left: -35%; opacity:0.6;">
                    <button
                        style="
                            background-image: url(https://img.meituan.net/csc/e360823b460fab14d02bbb9b56fb55825756.png);
                            display: inline-flex;
                            font-size: 12px;
                            text-align: center;
                            cursor: pointer;
                            border: 0.5px solid lightgray;
                            border-radius: 3px;
                            height: 25px;
                            width: 52px;
                            margin-right: 10px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: contain;
                        "
                        title="change style of white noise"
                    >
                    </button>
                    <audio
                        class="rain_sound_1 allaudio"
                        controls="controls"
                        style="position: absolute; height: 28px; width: 216px"
                    >
                        <source
                            src=${this.get_musice(this.Index)}
                            type="audio/mpeg"
                        />
                    </audio>
                </div>`;
                node.insertAdjacentHTML("afterbegin", html);
                this.event(node);
            },
            change_music(mode) {
                if (!this.audio_ctrl.audio) return true;
                const index = this.Index + 1;
                this.audio_ctrl.audio.src = this.get_musice(index);
                GM_setValue("white_noise", index);
                mode &&
                    Notification("change style of white noise successfully");
                return true;
            },
            event(node) {
                setTimeout(() => {
                    let f = node.firstElementChild.firstElementChild;
                    f.onclick = () => this.change_music();
                    const audio = f.nextElementSibling;
                    this.set_audio(audio, true);
                    this.audio_ctrl.audio = audio;
                    f = null;
                }, 50);
            },
        },
        create_settings(node) {
            const html = `
            <i
                class="my_settings"
                title="settings"
                style="
                    content: url(data:image/webp;base64,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);
                    height: 28px;
                    width: 28px;
                    margin-left: 120%;
                    position: absolute;
                    border: 1px solid #06f;
                "
            ></i>`;
            let f = node.previousElementSibling.getElementsByClassName(
                "ColumnPageHeader-Button"
            )[0];
            let n = f.firstElementChild;
            n.innerText = "Note";
            n.title = "right mouse click to open note";
            n.oncontextmenu = (e) => {
                e.preventDefault();
                this.settings_Popup.main();
            };
            n = null;
            f.insertAdjacentHTML("afterend", html);
            setTimeout(() => {
                f.nextElementSibling.onclick = (e) =>
                    this.settings_Popup.main();
                this.white_noise.create(f.parentNode);
                f = null;
            }, 50);
        },
        column_homePage(mode) {
            // 这个css被从页面移除掉了
            const css = `
            <link
                rel="stylesheet"
                type="text/css"
                href="https://static.zhihu.com/heifetz/main.shared_a7b367b7bf06fb0fc5585fec26d0675bd42be57e_CSS.216a26f4.9e02bee3c14871521874.css"
                crossorigin="anonymous"
            />`;
            document.head.insertAdjacentHTML("beforeend", css);
            const ch = document.getElementsByClassName("ColumnHome")[0];
            let chs = ch.children;
            let i = chs.length;
            if (i === 0) {
                colorful_Console.main(
                    {
                        title: "warning",
                        content: "failed to get target element",
                    },
                    colorful_Console.colors.warning
                );
                return;
            }
            for (i; i--; ) {
                if (chs[i].className === "ColumnHomeTop") break;
                else chs[i].remove();
            }
            let k = chs[i].children.length;
            for (k; k--; ) chs[i].children[k].remove();
            ch.style.display = "block";
            if (mode) {
                const r = GM_getValue("recent");
                if (!this.Column.home_Module.loaded_list)
                    this.Column.home_Module.loaded_list = [];
                if (r && Array.isArray(r) && r.length > 0) {
                    r.forEach((e) => {
                        const url = e.url;
                        const id = url.slice(url.lastIndexOf("/") + 1);
                        if (
                            !zhihu.Column.home_Module.loaded_list.includes(id)
                        ) {
                            this.Column.home_Module.loaded_list.push(id);
                            column_Home.single_Content_request(
                                url.includes("answer") ? 0 : 2,
                                id,
                                chs[i],
                                e
                            );
                        }
                    });
                }
            }
            const targetElements = this.Filter.getTagetElements(1);
            this.qaReader.no_scroll = true;
            chs[i].onclick = (e) => {
                const target = e.target;
                const item = this.Filter.check_click_all(
                    target.className,
                    target.localName,
                    target,
                    targetElements
                );
                if (!item) return;
                this.qaReader.main(item, this.Filter.foldAnswer.getid(item));
            };
            this.create_settings(chs[i]);
            chs = null;
            this.QASkeyBoardEvent(9);
            unsafeWindow.addEventListener("visibilitychange", () =>
                this.visibleChange()
            );
            this.rightMouse_OpenQ(9);
        },
        antiRedirect() {
            // only those links can be capture, which has the attribute of classname with ' external' ?
            // some problems in video tag
            const links = Object.getOwnPropertyDescriptors(
                HTMLAnchorElement.prototype
            ).href;
            Object.defineProperty(HTMLAnchorElement.prototype, "href", {
                ...links,
                get() {
                    const href = decodeURIComponent(links.get.call(this));
                    const tmp = href.split("link.zhihu.com/?target=");
                    if (tmp.length > 1) {
                        this.href = tmp[1];
                        return tmp[1];
                    }
                    return href;
                },
            });
        },
        //if has logined or the login window is not loaded(or be blocked) when the page is loaded;
        hasLogin: false,
        is_delayed: false,
        antiLogin() {
            /*
            note:
            the timing of the js injection is uncertain, and for some reason the injection maybe late,
            so that the occurrence of the event cannot be accurately captured
            don't use dom load event =>
            most of zhihu webpages require login
            */
            let mo = new MutationObserver((events) => {
                if (this.hasLogin) {
                    mo.disconnect();
                    mo = null;
                    document.documentElement.style.overflow = "auto";
                    return;
                }
                events.forEach((e) =>
                    e.addedNodes.forEach((node) => {
                        const type = node.nodeType;
                        if (
                            (type === 1 || type === 9 || type === 11) &&
                            node.getElementsByClassName("signFlowModal")
                                .length > 0
                        ) {
                            node.style.display = "none";
                            setTimeout(() => {
                                this.is_delayed = false;
                                mo.disconnect();
                                mo = null;
                                node.remove();
                                document.documentElement.style.overflow =
                                    "auto";
                            }, 0);
                        }
                    })
                );
            });
            document.body
                ? mo.observe(document.body, { childList: true })
                : (document.onreadystatechange = () =>
                      mo && mo.observe(document.body, { childList: true }));
            setTimeout(() => (this.is_delayed = true), 10000);
        },
        //the original js(int.js) of zhihu, which will cause stuck autoscroll
        anti_setInterval() {
            unsafeWindow.setInterval = new Proxy(unsafeWindow.setInterval, {
                apply: (target, thisArg, args) => {
                    const f = args[0];
                    let fn = "";
                    f && (fn = f.name);
                    fn &&
                        fn === "i" &&
                        args[1] === 2000 &&
                        (args[1] = 10000000);
                    return target.apply(thisArg, args);
                },
            });
        },
        Filter: {
            /*
            1. userName
            2. question
            3. answer
            4. article
            5. content keyword
            */
            //click the ico of button
            svgCheck(node, targetElements) {
                let pnode = node.parentNode;
                if (pnode.className === targetElements.buttonClass)
                    return pnode;
                else {
                    pnode = pnode.parentNode;
                    let className = pnode.className;
                    let ic = 0;
                    while (className !== targetElements.buttonClass) {
                        pnode = pnode.parentNode;
                        if (!node || ic > 3) return null;
                        className = pnode.className;
                        ic++;
                    }
                    return pnode;
                }
            },
            getiTem(target, targetElements) {
                let item = target.parentNode;
                if (item.className === targetElements.itemClass) {
                    return item;
                } else {
                    item = item.parentNode;
                    let ic = 0;
                    let className = item.className;
                    while (className !== targetElements.itemClass) {
                        item = item.parentNode;
                        if (!item || ic > 3) return null;
                        className = item.className;
                        ic++;
                    }
                    return item;
                }
            },
            //get the url id of the answer || article
            getTargetID(item) {
                const a = item.getElementsByTagName("a");
                if (a.length === 0) return null;
                const pathname = a[0].pathname;
                return pathname.slice(pathname.lastIndexOf("/") + 1);
            },
            /*
            0, normal
            1, searchpage => check username
            2, click => check all content
            3, article page => check expand
            if the item has been checked, return
            */
            get Topic_question_ID() {
                const href = location.href;
                const reg = /(?<=(question|topic)\/)\d+/;
                const match = href.match(reg);
                if (!match) return null;
                return match[0];
            },
            Topic_questionButton(targetElements) {
                const header_line = (event, mode) => {
                    let question = null;
                    if (event) {
                        const path = event.path;
                        for (const e of path) {
                            if (e.className === targetElements.headerID) {
                                question = e;
                                break;
                            }
                        }
                    } else {
                        question = document.getElementsByClassName(
                            targetElements.headerID
                        )[0];
                    }
                    if (!question) return;
                    const h = question.getElementsByClassName(
                        targetElements.headerTitle
                    );
                    if (h.length === 0) return;
                    h[0].style.textDecoration = mode ? "line-through" : "none";
                };
                let q = document.getElementsByClassName(
                    targetElements.inserButtonID
                );
                if (q.length === 0) return;
                const id = this.Topic_question_ID;
                if (!id) return;
                let mode = false;
                const type = targetElements.index === 2 ? "topic" : "question";
                let [name, title] = (mode = blackTopicAndQuestion.some(
                    (e) => e.id === id
                ))
                    ? ["Remove", `remove the ${type} from block list`]
                    : ["Block", `add the ${type} to block list`];
                const html = `
                <button
                    title=${escapeBlank(title)}
                    style="
                        font-size: 14px;
                        height: 22px;
                        width: 60px;
                        margin-left: 10px;
                        box-shadow: 1px 1px 4px #888888;
                    "
                >
                    ${name}
                </button>`;
                let button = document.createElement("button");
                q[0].insertAdjacentElement("beforeend", button);
                button.outerHTML = html;
                q[0].lastChild.onclick = function (event) {
                    if (mode) {
                        const index = blackTopicAndQuestion.findIndex(
                            (e) => e.id === id
                        );
                        if (index > -1) {
                            blackTopicAndQuestion.splice(index, 1);
                            GM_setValue(
                                targetElements.blockValueName,
                                blackTopicAndQuestion
                            );
                        }
                    } else {
                        if (blackTopicAndQuestion.some((e) => e.id === id))
                            return;
                        const info = {};
                        info.id = id;
                        info.type = type;
                        info.update = Date.now();
                        blackTopicAndQuestion.push(info);
                        GM_setValue(
                            targetElements.blockValueName,
                            blackTopicAndQuestion
                        );
                    }
                    mode = !mode;
                    [name, title] = mode
                        ? ["Remove", `remove the ${type} from block list`]
                        : ["Block", `add the ${type} to block list`];
                    this.title = title;
                    this.innerText = name;
                    header_line(event, mode);
                };
                button = null;
                q = null;
                mode && header_line(null, true);
                GM_addValueChangeListener(
                    targetElements.blockValueName,
                    (name, oldValue, newValue, remote) =>
                        remote && (blackTopicAndQuestion = newValue)
                );
            },
            get_content_element(item, targetElements) {
                const content = item.getElementsByClassName(
                    targetElements.contentID
                );
                return content.length === 0 ? null : content[0];
            },
            content_check(item, targetElements, node) {
                const content =
                    node || this.get_content_element(item, targetElements);
                if (!content) return false;
                const text = content.innerText;
                return text.length > 2500
                    ? false
                    : blackKey.some((e) => {
                          if (text.includes(e)) {
                              colorful_Console.main(
                                  {
                                      title: "content block:",
                                      content: "rubbish word " + e,
                                  },
                                  colorful_Console.colors.warning
                              );
                              this.hidden_item(item, targetElements);
                              return true;
                          }
                          return false;
                      });
            },
            hidden_item(item, targetElements) {
                (item.className === "ContentItem AnswerItem"
                    ? targetElements.index === 3
                        ? item.parentNode.parentNode
                        : item.parentNode
                    : item
                ).style.display = "none";
            },
            user_check(item, targetElements) {
                const user = item.getElementsByClassName(targetElements.userID);
                if (user.length === 0) {
                    colorful_Console.main(
                        { title: "anonymous user", content: "no user info" },
                        colorful_Console.colors.info
                    );
                    return false;
                }
                const i = user.length - 1;
                const name = user[i > 1 ? 1 : i].innerText;
                if (!name) return false;
                const nwname = clear_zero_width(name);
                const result = blackName.includes(nwname);
                if (result) {
                    colorful_Console.main(
                        { title: "Blocked User", content: nwname },
                        colorful_Console.colors.warning
                    );
                    this.hidden_item(item, targetElements);
                }
                return result;
            },
            search_check(item, targetElements) {
                const content = this.get_content_element(item, targetElements);
                if (!content) return false;
                let user = content.firstElementChild.innerText;
                if (!user) return false;
                user = clear_zero_width(user);
                if (blackName.includes(user)) {
                    colorful_Console.main(
                        { title: "Blocked User", content: user },
                        colorful_Console.colors.warning
                    );
                    this.hidden_item(item, targetElements);
                    return true;
                }
                return this.content_check(item, targetElements, content);
            },
            get_main_element(item) {
                return item.className === "ContentItem AnswerItem"
                    ? item
                    : item.getElementsByClassName("ContentItem AnswerItem")[0];
            },
            check_Hot(item) {
                const hot_list = ["TimeBox-MainContent", "MinorHotSpot"];
                return hot_list.some(
                    (e) => item.getElementsByClassName(e).length > 0
                );
            },
            check_salt(item) {
                return (
                    item.getElementsByClassName(
                        "KfeCollection-OrdinaryLabel-content"
                    ) > 0
                );
            },
            check(item, targetElements) {
                const i = targetElements.index;
                if (i === 3 && this.check_Hot(item)) {
                    if (this.is_simple_search) {
                        const items = item.getElementsByClassName(
                            targetElements.itemClass
                        );
                        for (const it of items) this.check(it, targetElements);
                    }
                    return;
                }
                const tmp = this.get_main_element(item);
                (tmp
                    ? !(i === 3
                          ? this.search_check(tmp, targetElements)
                          : this.user_check(tmp, targetElements) ||
                            this.content_check(tmp, targetElements))
                    : true) &&
                    this.dbInitial &&
                    (i < 2
                        ? this.foldAnswer.check(tmp)
                        : this.foldAnswer.Three.main(
                              item,
                              i === 3 && this.is_simple_search
                          ));
            },
            /*
            1. URL change, for example, forward or backward, ...disable MutationObserver
            2. URL match specific zone;
            */
            checkURL(targetElements) {
                const href = location.href;
                return targetElements.index < 2
                    ? true
                    : (targetElements.index === 2 &&
                          !href
                              .slice(href.lastIndexOf("/topic/") + 7)
                              .includes("/")) ||
                          targetElements.zone.some((e) => href.includes(e));
            },
            clickCheck(item, targetElements) {
                /*
                without userid when in the search page, if the answer is not expanded
                the content only has the abstract section, if in search page and topic page
                check the content, and record the cheched status;
                */
                const id = this.foldAnswer.getid(item);
                (id ? !this.checked_list.includes(id) : true) &&
                    setTimeout(
                        () =>
                            !this.content_check(item, targetElements) &&
                            this.checked_list.push(id),
                        350
                    );
            },
            //check the content when the content expanded
            colorIndicator: {
                lasttarget: null,
                index: 0,
                change: false,
                stat: false,
                color(target) {
                    if (!this.stat) return;
                    this.restore();
                    const colors = ["green", "red", "blue", "purple"];
                    target.style.color = colors[this.index];
                    target.style.fontSize = "16px";
                    target.style.letterSpacing = "0.3px";
                    if (target.style.fontWeight !== 600) {
                        target.style.fontWeight = 600;
                        this.change = true;
                    } else this.change = false;
                    this.index > 2 ? (this.index = 0) : (this.index += 1);
                    this.lasttarget = target;
                },
                restore() {
                    if (this.lasttarget) {
                        this.lasttarget.style.color = "";
                        this.lasttarget.style.fontSize = "";
                        this.lasttarget.style.letterSpacing = "";
                        if (this.change)
                            this.lasttarget.style.fontWeight = "normal";
                        this.lasttarget = null;
                    }
                },
            },
            isReader: false,
            auto_load_reader: false,
            is_scroll_state: false,
            check_click_all(className, localName, target, targetElements) {
                if (className === targetElements.buttonClass) {
                    return this.getiTem(target, targetElements);
                    //click the ico of expand button
                } else if (localName === "svg") {
                    const button = this.svgCheck(target, targetElements);
                    if (button) return this.getiTem(button, targetElements);
                    //click the answer, the content will be automatically expanded
                }
                return null;
            },
            search_clear(target) {
                if (
                    target.localName === "a" &&
                    target.search.includes("&hybrid_search")
                ) {
                    const href = target.href.split("&search_source");
                    if (href.length > 1) {
                        const a = href[0] + "&type=content";
                        GM_openInTab(a, {
                            insert: true,
                            active: true,
                        });
                        target.href = a;
                    }
                    return true;
                }
                return false;
            },
            clickMonitor(node, targetElements) {
                if (this.isMonitor) return;
                const tags = ["blockquote", "p", "br", "li"];
                this.colorIndicator.stat = GM_getValue("highlight");
                if (!node) return;
                node.onclick = (e) => {
                    //when open reader mode, if create click event of document, no node
                    const target = e.target;
                    if (this.search_clear(target)) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        return;
                    }
                    if (this.isReader) return;
                    let limit = true;
                    if (targetElements.index < 2)
                        limit = e.path.some(
                            (a) => a.className === targetElements.header
                        );
                    const localName = target.localName;
                    if (limit && tags.includes(localName)) {
                        if (target.style.color || this.foldAnswer.editableMode)
                            return;
                        this.colorIndicator.color(target);
                        return;
                    }
                    this.colorIndicator.restore();
                    const className = target.className;
                    //take care of svg element, the classname
                    if (
                        className &&
                        typeof className === "string" &&
                        className.startsWith("fold") &&
                        this.dbInitial
                    ) {
                        if (targetElements.index < 2) {
                            const ends = [
                                "block",
                                "temp",
                                "element",
                                "select",
                                "edit",
                                "reader",
                            ];
                            !this.is_scroll_state &&
                                ends.some((e) => className.endsWith(e)) &&
                                !this.auto_load_reader &&
                                this.foldAnswer.buttonclick(target);
                        } else {
                            const ends = [
                                "question",
                                "topic",
                                "element",
                                "temp",
                                "answer",
                                "article",
                            ];
                            !this.is_scroll_state &&
                                ends.some((e) => className.endsWith(e)) &&
                                !this.auto_load_reader &&
                                this.foldAnswer.Three.btnClick(target);
                        }
                        return;
                    }
                    //click the expand button, the rich node has contained all content in q & a webpage;
                    if (targetElements.index < 2) return;
                    //-----------------------------------------------
                    let item = this.check_click_all(
                        className,
                        localName,
                        target,
                        targetElements
                    );
                    if (!item) {
                        if (className !== targetElements.expand) return;
                        for (const node of e.path) {
                            const className = node.className;
                            if (
                                className === targetElements.itemClass ||
                                className === targetElements.answerID
                            ) {
                                item = node;
                                break;
                            }
                        }
                    }
                    if (item) this.clickCheck(item, targetElements);
                    else {
                        //some internal url with redirect paramter, the antiredirect function does not treat
                        const path = e.path;
                        let ic = 0;
                        for (const c of path) {
                            if (c.localName === "a") {
                                const cl = c.className;
                                if (
                                    cl &&
                                    typeof cl === "string" &&
                                    !cl.endsWith("external")
                                ) {
                                    const s = c.search;
                                    if (s.startsWith("?target=")) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation();
                                        const h = s.slice(s.indexof("=") + 1);
                                        c.href = h;
                                        window.open(h, "_blank");
                                        break;
                                    }
                                }
                            }
                            ic++;
                            if (ic > 4) break;
                        }
                    }
                };
            },
            topicAndquestion(targetElements, info, index) {
                const items =
                    document.getElementsByClassName("ContentItem-meta");
                let n = items.length;
                for (n; n--; ) {
                    const item = items[n];
                    const a = item.getElementsByClassName("UserLink-link");
                    let i = a.length;
                    if (i > 0) {
                        const username = a[--i].innerText;
                        if (username === info.username) {
                            const t = this.getiTem(item, targetElements);
                            t &&
                                (index === 0
                                    ? this.setDisplay(t.parentNode, info)
                                    : this.setDisplay(t, info));
                        }
                    }
                }
            },
            setDisplay(t, info) {
                info.mode === "block"
                    ? t.style.display !== "none" && (t.style.display = "none")
                    : t.style.display === "none" && (t.style.display = "block");
            },
            userChange(index) {
                const info = GM_getValue("blacknamechange");
                if (!info) return;
                const targetElements = this.getTagetElements(
                    index === 0 ? 1 : index
                );
                index === 0 &&
                    (targetElements.itemClass = "ContentItem AnswerItem");
                if (!this.checkURL(targetElements)) return;
                if (index === 3) {
                    const items = document.getElementsByClassName(
                        targetElements.itemClass
                    );
                    let n = items.length;
                    for (n; n--; ) {
                        const item = items[n];
                        const a = item.getElementsByClassName(
                            targetElements.userID
                        );
                        let i = a.length;
                        if (i > 0) {
                            const name = a[--i].innerText;
                            name === info.username &&
                                this.setDisplay(item, info);
                        } else {
                            const content = item.getElementsByClassName(
                                targetElements.contentID
                            );
                            if (content.length === 0) continue;
                            const text = content[0].innerText;
                            const name = text.startsWith("匿名用户：")
                                ? ""
                                : text.slice(0, text.indexOf("："));
                            name &&
                                name === info.username &&
                                this.setDisplay(item, info);
                        }
                    }
                } else this.topicAndquestion(targetElements, info, index);
            },
            //standby, commmunication between others and column
            connectColumn() {
                const r = GM_getValue("removearticleA");
                if (r && Array.isArray(r) && r.length > 0) {
                    for (const e of r) dataBaseInstance.dele(false, e);
                    GM_setValue("removearticleA", "");
                }
                const b = GM_getValue("blockarticleA");
                if (b && Array.isArray(b) && b.length > 0) {
                    for (const e of b) dataBaseInstance.fold(e);
                    GM_setValue("blockarticleA", "");
                }
                GM_addValueChangeListener(
                    "blockarticleA",
                    (name, oldValue, newValue, remote) => {
                        if (remote) {
                            dataBaseInstance.fold(newValue[0]);
                            GM_setValue("blockarticleA", "");
                        }
                    }
                );
                GM_addValueChangeListener(
                    "removearticleA",
                    (name, oldValue, newValue, remote) => {
                        if (remote) {
                            dataBaseInstance.dele(false, newValue[0]);
                            GM_setValue("removearticleA", "");
                        }
                    }
                );
                this.is_connect = true;
            },
            simple_search(item) {
                const arr = [
                    "RelevantQuery",
                    "KfeCollection-PcCollegeCard-wrapper",
                    "ContentItem ZvideoItem",
                    "SearchClubCard",
                    "ContentItem-extra",
                    "SearchItem-userTitleWrapper",
                ];
                for (const e of arr) {
                    if (item.getElementsByClassName(e).length > 0) {
                        item.className = `${item.className} hidden`;
                        item.style.display = "none";
                        break;
                    }
                }
            },
            monitor(targetElements, node) {
                //only in answer || question webpage, the muta will note be destroyed, without need to rebuilded;
                const mo = new MutationObserver((e) => {
                    e.forEach((item) =>
                        item.addedNodes.length > 0 &&
                        item.addedNodes[0].className ===
                            targetElements.itemClass
                            ? this.check(item.addedNodes[0], targetElements)
                            : targetElements.index === 3 &&
                              this.is_simple_search &&
                              this.simple_search(item.addedNodes[0])
                    );
                    targetElements.index === 1 &&
                        e.length > 2 &&
                        this.reader_sync();
                });
                mo.observe(node.parentNode, { childList: true });
            },
            getTagetElements(index) {
                const pos = {
                    0: "answerPage",
                    1: "questionPage",
                    2: "topicPage",
                    3: "searchPage",
                };
                const targetElements = this[pos[index]](index);
                return targetElements;
            },
            dbInitial: false,
            reader_sync: null,
            checked_list: null,
            is_simple_search: false,
            main(index, reader_sync) {
                this.foldAnswer.initial().then((r) => {
                    index > 1 && (this.checked_list = []);
                    this.dbInitial = r;
                    this.reader_sync = reader_sync;
                    const targetElements = this.getTagetElements(index);
                    index !== 0 && this.firstRun(targetElements);
                    index !== 3 && this.Topic_questionButton(targetElements);
                    const w =
                        window.onurlchange === null
                            ? window
                            : unsafeWindow.onurlchange === null
                            ? unsafeWindow
                            : null;
                    w &&
                        w.addEventListener("urlchange", () =>
                            this.backwardORforward(targetElements)
                        );
                    this.connectColumn();
                    !this.isMonitor &&
                        this.clickMonitor(
                            document.getElementById(targetElements.mainID),
                            targetElements
                        );
                });
            },
            is_jump: false,
            bf_time_id: null,
            backwardORforward(targetElements) {
                //monitor forward or backward, this operation maybe not fire dom change event
                if (this.is_jump) {
                    this.is_jump = false;
                    return;
                }
                this.bf_time_id && clearTimeout(this.bf_time_id);
                this.bf_time_id = setTimeout(() => {
                    this.bf_time_id = null;
                    this.firstRun(targetElements);
                }, 350);
            },
            is_update: false,
            search_items() {
                return document.getElementsByClassName("List")[0]
                    .firstElementChild.children;
            },
            common_items(cl) {
                return document.getElementsByClassName(cl);
            },
            get_items(cl, ic, n, mode, targetElements, w) {
                setTimeout(() => {
                    const items = this[w](cl);
                    const i = items.length;
                    if (i > n || ic > 20) {
                        if (i === 0) {
                            colorful_Console.main(
                                {
                                    title: "info:",
                                    content: "failed to get items",
                                },
                                colorful_Console.colors.info
                            );
                            return;
                        }
                        for (const item of items)
                            this.check(item, targetElements, 0);
                        mode && this.monitor(targetElements, items[0]);
                    } else this.get_items(cl, ++ic, n, mode, targetElements, w);
                }, 50 + 5 * ic);
            },
            firstRun(targetElements) {
                if (!this.checkURL(targetElements)) return;
                let n = 4;
                let cl = "";
                let mode = true;
                const i = targetElements.index;
                if (i === 3 && this.is_simple_search) {
                    this.get_items(
                        cl,
                        0,
                        n,
                        mode,
                        targetElements,
                        "search_items"
                    );
                    return;
                }
                if (i > 1) cl = targetElements.itemClass;
                else {
                    const p = location.pathname;
                    const a = p.includes("/answers/");
                    cl = !(n = p.includes("/answer/") ? 0 : 4)
                        ? targetElements.header
                        : targetElements.itemClass;
                    mode = this.is_update ? !a : true;
                    this.is_update = a;
                    targetElements.index = n === 0 ? 0 : 1;
                    if (this.is_update && !mode) return;
                }
                this.get_items(cl, 0, n, mode, targetElements, "common_items");
            },
            isMonitor: false,
            answerPage() {
                const targetElements = this.questionPage(1);
                const items = document.getElementsByClassName(
                    targetElements.header
                );
                for (const item of items)
                    this.check(item.parentNode, targetElements, 0);
                this.clickMonitor(document, targetElements);
                this.isMonitor = true;
                return targetElements;
            },
            questionPage(index) {
                const targetElements = {
                    buttonClass:
                        "Button ContentItem-rightButton ContentItem-expandButton Button--plain",
                    itemClass: "List-item",
                    mainID: "QuestionAnswers-answers",
                    contentID: "RichText ztext CopyrightRichText-richText",
                    userID: "UserLink-link",
                    backupClass: "Question-main",
                    header: "ContentItem AnswerItem",
                    headerID: "QuestionHeader",
                    headerTitle: "QuestionHeader-title",
                    expand: "RichText ztext CopyrightRichText-richText",
                    answerID: "ContentItem AnswerItem",
                    inserID: "LabelContainer-wrapper",
                    blockValueName: "blacktopicAndquestion",
                    inserButtonID: "QuestionHeaderActions",
                    index: index,
                };
                return targetElements;
            },
            searchPage(index) {
                const nocontent = document.getElementsByClassName(
                    "SearchNoContent-title"
                );
                if (nocontent.length > 0) return null;
                const targetElements = {
                    buttonClass: "Button ContentItem-more Button--plain",
                    itemClass: "Card SearchResult-Card",
                    mainID: "SearchMain",
                    contentID: "RichText ztext CopyrightRichText-richText",
                    expand: "RichContent-inner",
                    userID: "UserLink-link",
                    zone: ["type=content"],
                    index: index,
                };
                return targetElements;
            },
            topicPage(index) {
                const targetElements = {
                    buttonClass: "Button ContentItem-more Button--plain",
                    itemClass: "List-item TopicFeedItem",
                    mainID: "TopicMain",
                    userID: "UserLink-link",
                    headerID: "ContentItem-head",
                    headerTitle: "ContentItem-title",
                    contentID: "RichText ztext CopyrightRichText-richText",
                    expand: "RichContent-inner",
                    inserButtonID: "TopicActions",
                    zone: ["/top-answers", "/hot", "newest"],
                    blockValueName: "blacktopicAndquestion",
                    index: index,
                };
                return targetElements;
            },
            foldAnswer: {
                Three: {
                    initialR: false,
                    btnClick(button) {
                        const text = button.innerText;
                        if (text.startsWith("show")) {
                            this.showFold(button);
                        } else {
                            let bid = "";
                            if (text !== "Fold") {
                                bid = this.getbid(button);
                                if (!bid) return;
                            }
                            this[text](button, bid);
                        }
                    },
                    getbid(button) {
                        const attrs = button.attributes;
                        if (!attrs) return null;
                        for (const e of attrs)
                            if (e.name === "bid") return e.value;
                        return null;
                    },
                    Answer_Article(button, bid, type, n, t, from = "") {
                        const p = button.parentNode.parentNode;
                        const user = p.getElementsByClassName("UserLink-link");
                        let i = user.length - 1;
                        const info = {};
                        info.userID = "";
                        info.userName = "";
                        if (i > 0) {
                            i = i > 1 ? 1 : i;
                            info.userName = user[i].innerText;
                            const pn = user[i].pathname;
                            info.userID = pn.slice(pn.lastIndexOf("/") + 1);
                        }
                        info.from = from;
                        info.name = bid;
                        info.update = Date.now();
                        info.type = type;
                        dataBaseInstance.fold(info);
                        this.changeBtn(button, n, t);
                    },
                    changeBtn(button, n, t) {
                        button.innerText = n;
                        button.title = t;
                        this.Fold(button, "show blocked");
                    },
                    Question_Topic(button, bid, type, n, t) {
                        if (blackTopicAndQuestion.some((e) => e.id === bid))
                            return;
                        const info = {};
                        info.id = bid;
                        info.type = type;
                        info.update = Date.now();
                        blackTopicAndQuestion.push(info);
                        GM_setValue(
                            "blacktopicAndquestion",
                            blackTopicAndQuestion
                        );
                        this.changeBtn(button, n, t);
                    },
                    Answer(button, bid) {
                        const from = this.getbid(button.nextElementSibling);
                        this.Answer_Article(
                            button,
                            bid,
                            "answer",
                            "Remove",
                            "unblock the answer",
                            from ? from : ""
                        );
                    },
                    Question(button, bid) {
                        this.Question_Topic(
                            button,
                            bid,
                            "question",
                            "Remove",
                            "unblock the question"
                        );
                    },
                    Article(button, bid) {
                        this.Answer_Article(
                            button,
                            bid,
                            "article",
                            "Remove",
                            "unblock the article"
                        );
                        let b = GM_getValue("blockarticleB");
                        if (b && Array.isArray(b)) {
                            for (const e of b) if (e.pid === bid) return;
                        } else b = [];
                        const r = GM_getValue("removearticleB");
                        if (r && Array.isArray(r)) {
                            const i = r.indexOf(bid);
                            if (i > -1) {
                                r.splice(i, 1);
                                GM_setValue("removearticleB", r);
                            }
                        }
                        const info = {};
                        info.userID = "";
                        info.from = "";
                        info.pid = bid;
                        info.value = 0;
                        info.update = Date.now();
                        b.push(info);
                        GM_setValue("blockarticleB", b);
                    },
                    Topic(button, bid) {
                        this.Question_Topic(
                            button,
                            bid,
                            "topic",
                            "Remove",
                            "unblock the topic"
                        );
                    },
                    Remove(button, bid) {
                        const className = button.className;
                        const method = {
                            changeBtn(n, t) {
                                button.innerText = n;
                                button.title = t;
                                button.parentNode.previousElementSibling.innerText =
                                    "show folded";
                            },
                            answer() {
                                dataBaseInstance.dele(false, bid);
                                this.changeBtn("Answer", "block the answer");
                            },
                            remove() {
                                let i = -1;
                                for (const e of blackTopicAndQuestion) {
                                    i++;
                                    if (e.id === bid) break;
                                }
                                if (i < 0) return;
                                blackTopicAndQuestion.splice(i, 1);
                                GM_setValue(
                                    "blacktopicAndquestion",
                                    blackTopicAndQuestion
                                );
                            },
                            topic() {
                                this.remove();
                                this.changeBtn("Topic", "block the topic");
                            },
                            article() {
                                dataBaseInstance.dele(false, bid);
                                this.changeBtn("Article", "block the article");
                                let r = GM_getValue("removearticleB");
                                if (r && Array.isArray(r) && r.length > 0) {
                                    if (r.includes(bid)) return;
                                } else r = [];
                                const b = GM_getValue("blockarticleB");
                                if (b && Array.isArray(b)) {
                                    const i = b.findIndex((e) => e.pid === bid);
                                    if (i > -1) {
                                        b.splice(i, 1);
                                        GM_setValue("blockarticleB", b);
                                    }
                                }
                                r.push(bid);
                                GM_setValue("removearticleB", r);
                            },
                            question() {
                                this.remove();
                                this.changeBtn(
                                    "Question",
                                    "block the question"
                                );
                            },
                        };
                        const n = className.slice(className.indexOf("_") + 1);
                        method[n]();
                    },
                    Fold(button, n = "") {
                        const p = button.parentNode;
                        p.previousElementSibling.style.display = "block";
                        p.nextElementSibling.style.display = "none";
                        p.style.display = "none";
                        n && (p.previousElementSibling.innerText = n);
                    },
                    showFold(button) {
                        button.style.display = "none";
                        const n = button.nextElementSibling;
                        if (!n) return;
                        n.style.display = "grid";
                        n.nextElementSibling.style.display = "block";
                    },
                    simple_search_hide(item) {
                        item.className = `${item.className} hidden`;
                        item.style.display = "none";
                    },
                    check_simple_search(p) {
                        const arr = [
                            "/zvideo/",
                            "/lives/",
                            "/club/",
                            "/market/",
                            "/people/",
                        ];
                        return arr.some((e) => p.includes(e));
                    },
                    market_ad(item) {
                        const arr = [
                            "RelevantQuery",
                            "KfeCollection-PcCollegeCard-wrapper",
                            "ContentItem ZvideoItem",
                            "SearchClubCard",
                            "ContentItem-extra",
                            "SearchItem-userTitleWrapper",
                        ];
                        for (const e of arr) {
                            if (item.getElementsByClassName(e).length > 0) {
                                this.simple_search_hide(item);
                                break;
                            }
                        }
                    },
                    getInfo(item, mode) {
                        const title = item.getElementsByTagName("h2");
                        if (title.length === 0) {
                            mode && this.market_ad(item);
                            return null;
                        }
                        if (mode && title[0].innerText === "相关搜索") {
                            this.simple_search_hide(item);
                            return null;
                        }
                        const a = title[0].getElementsByTagName("a");
                        if (a.length === 0) {
                            mode && this.market_ad(item);
                            return null;
                        }
                        const text = a[0].innerText;
                        if (
                            text &&
                            blackKey.some((e) => {
                                if (text.includes(e)) {
                                    item.style.display = "none";
                                    colorful_Console.main(
                                        {
                                            title: "Blocked title: ",
                                            content: "rubbish word " + e,
                                        },
                                        colorful_Console.colors.warning
                                    );
                                    return true;
                                }
                                return false;
                            })
                        )
                            return null;
                        const p = a[0].pathname;
                        if (mode && this.check_simple_search(p)) {
                            this.simple_search_hide(item);
                            return null;
                        }
                        const info = {};
                        info.cblock = false;
                        info.ablcok = false;
                        info.qblock = false;
                        info.tblock = false;
                        const flags = ["/question", "/p/", "/topic"];
                        const index = flags.findIndex((e) => p.includes(e));
                        if (index === 0) {
                            info.type = "answer";
                            const tmp = p.split("/");
                            if (tmp.length !== 5) return null;
                            info.qid = tmp[2];
                            info.aid = tmp[4];
                        } else if (index === 1) {
                            info.type = "column";
                            info.cid = p.slice(p.lastIndexOf("/") + 1);
                        } else if (index === 2) {
                            info.type = "topic";
                            info.tid = p.slice(p.lastIndexOf("/") + 1);
                        } else return null;
                        return info;
                    },
                    btnRaw(c, t, n, b) {
                        return `<button class="fold_${c}" title=${escapeBlank(
                            t
                        )} bid=${b}>${n}</button>`;
                    },
                    foldRaw(arr, info, adisplay, bdisplay, name) {
                        const d = JSON.stringify(info);
                        return `
                            <div
                                class="fold_element"
                                title="the ${info.type} has been folded"
                                data-info=${d}
                                style="display:${adisplay};"
                            >
                                show ${name}
                            </div>
                                <div class="hidden_fold" data-info=${d} style="display:${bdisplay};">
                                ${arr.join("")}
                                <button class="fold_temp" title="temporarily fold the item">Fold</button>
                            </div>`;
                    },
                    checkAnswerOrArticle(id) {
                        return new Promise((resolve, reject) => {
                            dataBaseInstance.check(id).then(
                                (result) => resolve(result),
                                (err) => {
                                    console.log(err);
                                    reject();
                                }
                            );
                        });
                    },
                    checkTAndQ(id) {
                        return blackTopicAndQuestion.some((e) => e.id === id);
                    },
                    answer(item, info) {
                        const exe = (r) => {
                            const f = this.checkTAndQ(info.qid);
                            const html = [];
                            info.qblock = f;
                            info.ablcok = r;
                            (r || f) && this.hide_content(item);
                            let [t, n] = r
                                ? ["unblock", "Remove"]
                                : ["block", "Answer"];
                            html.push(
                                this.btnRaw(
                                    "answer",
                                    t + " the answer",
                                    n,
                                    info.aid
                                )
                            );
                            [t, n] = f
                                ? ["unblock", "Remove"]
                                : ["block", "Question"];
                            html.push(
                                this.btnRaw(
                                    "question",
                                    t + " the question",
                                    n,
                                    info.qid
                                )
                            );
                            const [a, b, name] =
                                r || f
                                    ? ["grid", "none", "blocked"]
                                    : ["none", "grid", "folded"];
                            item.insertAdjacentHTML(
                                "afterbegin",
                                this.foldRaw(html, info, a, b, name)
                            );
                        };
                        this.initialR
                            ? this.checkAnswerOrArticle(info.aid).then(
                                  (r) => exe(r),
                                  () => console.log("check blocked answer fail")
                              )
                            : exe(false);
                    },
                    hide_content(item) {
                        item.firstChild.style.display = "none";
                    },
                    column(item, info) {
                        const exe = (r) => {
                            info.cblock = r;
                            r && this.hide_content(item);
                            const [t, n, a, b, name] = r
                                ? [
                                      "unblock",
                                      "Remove",
                                      "grid",
                                      "none",
                                      "blocked",
                                  ]
                                : [
                                      "block",
                                      "Article",
                                      "none",
                                      "grid",
                                      "folded",
                                  ];
                            item.insertAdjacentHTML(
                                "afterbegin",
                                this.foldRaw(
                                    [
                                        this.btnRaw(
                                            "article",
                                            t + " the article",
                                            n,
                                            info.cid
                                        ),
                                    ],
                                    info,
                                    a,
                                    b,
                                    name
                                )
                            );
                        };
                        this.initialR
                            ? this.checkAnswerOrArticle(info.cid).then(
                                  (r) => exe(r),
                                  () =>
                                      console.log("check blocked article fail")
                              )
                            : exe(false);
                    },
                    topic(item, info) {
                        const f = this.checkTAndQ(info.tid);
                        info.tblock = f;
                        f && this.hide_content(item);
                        const [t, n, a, b, name] = f
                            ? ["unblock", "Remove", "block", "none", "blocked"]
                            : ["block", "Topic", "none", "grid", "folded"];
                        item.insertAdjacentHTML(
                            "afterbegin",
                            this.foldRaw(
                                [
                                    this.btnRaw(
                                        "topic",
                                        t + " the topic",
                                        n,
                                        info.tid
                                    ),
                                ],
                                info,
                                a,
                                b,
                                name
                            )
                        );
                    },
                    main(item, mode) {
                        const info = this.getInfo(item, mode);
                        if (!info) return;
                        this[info.type](item, info);
                    },
                },
                //---------------------------------------------------------------------------------------
                buttonclick(button) {
                    const text = button.innerText;
                    text.startsWith("show")
                        ? this.showFold(button, text)
                        : this[text](button);
                },
                getcontent(button, pnode) {
                    const p = pnode || this.getpNode(button);
                    if (!p) return null;
                    const expand = p.getElementsByClassName(
                        "Button ContentItem-rightButton ContentItem-expandButton Button--plain"
                    );
                    if (expand.length > 0) expand[0].click();
                    const ele = p.getElementsByClassName(
                        "RichText ztext CopyrightRichText-richText"
                    );
                    return ele.length === 0 ? null : ele[0];
                },
                editableMode: false,
                Edit(button) {
                    const ele = this.getcontent(button);
                    if (!ele) return;
                    this.editableMode = true;
                    ele.contentEditable = true;
                    button.innerText = "Exit";
                    button.title = "exit editable mode";
                },
                Reader(button) {
                    if (this.editableMode) {
                        Notification("please exit editable mode", "Tips");
                        return;
                    }
                    const pnode = this.getpNode(button);
                    if (!pnode) return;
                    const aid = this.getid(pnode);
                    if (!aid) return;
                    zhihu.qaReader.main(pnode, aid);
                },
                Exit(button) {
                    const ele = this.getcontent(button);
                    if (!ele) return;
                    this.editableMode = false;
                    ele.contentEditable = false;
                    button.innerText = "Edit";
                    button.title = "edit the answer";
                },
                Select(button) {
                    if (this.editableMode) {
                        Notification("please exit editable mode", "Tips");
                        return;
                    }
                    const ele = this.getcontent(button);
                    if (!ele) return;
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    const range = new Range();
                    range.selectNodeContents(ele);
                    selection.addRange(range);
                },
                getid(item) {
                    const tmp =
                        item.className === "ContentItem AnswerItem"
                            ? item
                            : item.getElementsByClassName(
                                  "ContentItem AnswerItem"
                              )[0];
                    if (!tmp) return null;
                    const attrs = tmp.attributes;
                    if (!attrs) return null;
                    for (const a of attrs)
                        if (a.name === "name") return a.value;
                    return null;
                },
                getpNode(button) {
                    let pnode = button.parentNode;
                    let ic = 0;
                    while (pnode.className !== "ContentItem AnswerItem") {
                        pnode = pnode.parentNode;
                        ic++;
                        if (ic > 4 || !pnode) return null;
                    }
                    return pnode;
                },
                get from() {
                    const p = location.pathname;
                    const reg = /(?<=question\/)\d+/;
                    const m = p.match(reg);
                    return m ? m[0] : "";
                },
                Block(button, type = "answer") {
                    const p = this.getpNode(button);
                    if (!p) return;
                    const id = this.getid(p);
                    if (!id) return;
                    const info = {};
                    const user = p.getElementsByClassName("UserLink-link");
                    let i = user.length - 1;
                    if (i > 0) {
                        i = i > 1 ? 1 : i;
                        info.userName = user[i].innerText;
                        const pn = user[i].pathname;
                        info.userID = pn.slice(pn.lastIndexOf("/") + 1);
                    }
                    info.name = id;
                    info.update = Date.now();
                    info.type = type;
                    info.from = this.from;
                    dataBaseInstance.fold(info);
                    button.innerText = "Remove";
                    button.title = "remove the answer from block list";
                    this.insertShowFolded(p, "blocked");
                },
                Remove(button) {
                    //show temp button
                    const p = this.getpNode(button);
                    if (!p) return;
                    const id = this.getid(p);
                    if (!id) return;
                    dataBaseInstance.dele(false, id);
                    button.innerText = "Block";
                    button.title = "fold the answer forever";
                },
                Fold(button) {
                    const p = this.getpNode(button);
                    if (!p) return;
                    this.insertShowFolded(p, "folded");
                },
                showFold(button, text) {
                    const next = button.nextElementSibling;
                    next.style.display = "block";
                    button.style.display = "none";
                    if (text.endsWith("blocked")) this.insertButton(next, true);
                },
                check(item) {
                    if (!item) return;
                    if (this.initialR === 0) {
                        this.insertButton(item);
                        return;
                    }
                    const id = this.getid(item);
                    if (!id) return;
                    dataBaseInstance.check(id).then(
                        (r) => {
                            r
                                ? this.insertShowFolded(item, "blocked")
                                : this.insertButton(item);
                        },
                        (err) => console.log(err)
                    );
                },
                initialR: 0,
                initial() {
                    return new Promise((resolve) => {
                        const tables = ["foldedAnswer"];
                        dataBaseInstance.initial(tables, true, "name").then(
                            (result) => {
                                resolve(true),
                                    (this.Three.initialR = this.initialR =
                                        result);
                            },
                            (err) => {
                                console.log(err);
                                resolve(false);
                            }
                        );
                    });
                },
                insertShowFolded(item, name) {
                    //if it has already contained this element , to hide or show
                    const f =
                        item.parentNode.getElementsByClassName("fold_element");
                    if (f.length === 0) {
                        const html = `
                        <div
                            class="fold_element"
                            title="the answer has been folded"
                        >
                            show ${name}
                        </div>`;
                        item.insertAdjacentHTML("beforebegin", html);
                        item.style.display = "none";
                    } else {
                        item.style.display = "none";
                        f[0].style.display = "block";
                        f[0].innerText = `show ${name}`;
                    }
                },
                insertButton(item, mode = false) {
                    const h = item.getElementsByClassName("hidden_fold");
                    if (h.length === 0) {
                        const obutton = `
                            <button class="fold_temp" title="temporarily fold the answer">Fold</button>
                            <button class="fold_edit" title="edit the answer">Edit</button>
                            <button class="fold_select" title="select the answer">Select</button>
                            <button class="fold_reader" title="open the answer in reader" style="color: #F3752C; margin-right: 12px;">Reader</button>`;
                        const html = `
                        <div class="hidden_fold">
                            <button class="fold_block" title="fold the answer forever">Block</button>
                            ${obutton}
                        </div>`;
                        const r = `
                        <div class="hidden_fold">
                            <button class="fold_block" title="remove the answer from block list">Remove</button>
                            ${obutton}
                        </div>`;
                        item.firstElementChild.lastElementChild.insertAdjacentHTML(
                            "beforebegin",
                            mode ? r : html
                        );
                    }
                },
            },
        },
        searchPage: {
            is_simple_search: false,
            get search_simple() {
                let simple = "";
                const common = `
                    .RelevantQuery,
                    .KfeCollection-PcCollegeCard-wrapper,
                    .ContentItem.ZvideoItem,
                    .SearchClubCard{display: none !important;}`;
                for (let i = 2; i < 10; i++)
                    simple += `.SearchTabs-actions li.Tabs-item.Tabs-item--noMeta:nth-of-type(${i}),`;
                return simple + common;
            },
            get raw() {
                //html & css, adaped from bilibili
                const [c, t] = this.is_simple_search
                    ? [" on", escapeBlank("restore normal mode")]
                    : [
                          "",
                          escapeHTML(
                              "remove other items, just keep question, topic, article"
                          ),
                      ];
                const html = `
                <div class="simple_header" title=${t}>
                    <style>
                        .next-button {
                            font-size: 12px;
                            color: #999;
                            line-height: 22px;
                            cursor: pointer;
                        }
                        .next-button .txt {
                            margin-right: 8px;
                            vertical-align: middle;
                        }
                        .next-button .switch-button.on {
                            border: 1px solid #00a1d6;
                            background: #00a1d6;
                        }
                        .next-button .switch-button {
                            margin: 0;
                            display: inline-block;
                            position: relative;
                            width: 30px;
                            height: 20px;
                            border: 1px solid #ccc;
                            outline: none;
                            border-radius: 10px;
                            box-sizing: border-box;
                            background: #ccc;
                            cursor: pointer;
                            transition: border-color 0.2s, background-color 0.2s;
                            vertical-align: middle;
                        }
                        .next-button .switch-button.on:after {
                            left: 11px;
                        }
                        .next-button .switch-button:after {
                            content: "";
                            position: absolute;
                            top: 1px;
                            left: 1px;
                            border-radius: 100%;
                            width: 16px;
                            height: 16px;
                            background-color: #fff;
                            transition: all 0.2s;
                        }
                    </style>
                    <span class="next-button"
                        ><span class="txt">Simple Mode</span><span class="switch-button${c}"></span
                    ></span>
                </div>`;
                return html;
            },
            getPos(node) {
                const search =
                    node.getElementsByClassName("SearchTabs-actions");
                if (search.length === 0) {
                    colorful_Console.main(
                        {
                            title: "Warning:",
                            content:
                                "search page does not get the target element",
                        },
                        colorful_Console.colors.warning
                    );
                    return null;
                }
                return search;
            },
            buttons: null,
            main() {
                const search = this.getPos(document);
                if (!search) return;
                const i = search.length;
                const html = this.raw;
                this.buttons = [];
                if (i > 1) for (const c of search) this.click_event(c, html);
                else {
                    this.click_event(search[0], html);
                    this.monitor();
                }
            },
            monitor() {
                let mo = new MutationObserver((e) => {
                    if (e.length === 1 && e[0].addedNodes.length === 1) {
                        const newNode = e[0].addedNodes[0];
                        if (newNode.className.startsWith("PageHeader")) {
                            const search = this.getPos(newNode);
                            if (!search) return;
                            mo.disconnect();
                            mo = null;
                            this.click_event(search[0], this.raw);
                        }
                    }
                });
                mo.observe(
                    document.getElementsByClassName("Sticky AppHeader")[0]
                        .lastElementChild,
                    { childList: true }
                );
            },
            get _list() {
                const list = document.getElementsByClassName("List");
                return list.length > 0
                    ? list[0].firstElementChild.children
                    : null;
            },
            pNode_hide() {
                const arr = [
                    "RelevantQuery",
                    "KfeCollection-PcCollegeCard-wrapper",
                    "ContentItem ZvideoItem",
                    "SearchClubCard",
                    "ContentItem-extra",
                    "SearchItem-userTitleWrapper",
                ];
                const list = this._list;
                if (!list) return;
                for (const l of list) {
                    for (const e of arr) {
                        if (l.getElementsByClassName(e).length > 0) {
                            l.className = `${l.className} hidden`;
                            l.style.display = "none";
                            break;
                        }
                    }
                }
            },
            pNode_show() {
                const list = this._list;
                if (!list) return;
                for (const l of list) {
                    const c = l.className;
                    if (c && c.endsWith(" hidden")) {
                        l.className = c.slice(0, -7);
                        l.style.display = "block";
                    }
                }
            },
            click_event(c, html) {
                c.insertAdjacentHTML("beforeend", html);
                setTimeout(() => {
                    let timeid = null;
                    const node =
                        c.lastElementChild.lastElementChild.lastElementChild;
                    this.buttons.push(node);
                    node.onclick = (e) => {
                        timeid && clearTimeout(timeid);
                        timeid = setTimeout(() => {
                            timeid = null;
                            let f = false;
                            const className = e.target.className;
                            let newName = "";
                            if (className.endsWith(" on")) {
                                if (this.id) {
                                    const style = document.getElementById(
                                        this.id
                                    );
                                    this.pNode_show();
                                    style && style.remove();
                                    this.id = null;
                                }
                                newName = className.slice(
                                    0,
                                    className.length - 3
                                );
                            } else {
                                this.id = GM_addStyle(this.search_simple).id;
                                f = true;
                                newName = className + " on";
                                this.pNode_hide();
                            }
                            this.buttons.forEach(
                                (e) => (e.className = newName)
                            );
                            this.is_simple_search = f;
                            GM_setValue("simplesearch", f);
                        }, 300);
                    };
                }, 0);
            },
            id: null,
            add(common, inpustyle, search, topicAndquestion, ad, bgi) {
                GM_addStyle(
                    common + inpustyle + search + topicAndquestion + ad + bgi
                );
                (this.is_simple_search = GM_getValue("simplesearch")) &&
                    (this.id = GM_addStyle(this.search_simple).id);
            },
        },
        body_img_update: null,
        body_image() {
            const bgi = this.commander.bgi.get;
            let s = "";
            if (bgi && (s = bgi.status) && s !== "tmp") {
                const url =
                    s === "auto"
                        ? (this.body_img_update = bgi) && bgi.url
                        : s === "fixed" && GM_getValue("fixed_image");
                return url ? `body{background-image: url(${url});}` : "";
            }
            return "";
        },
        addStyle(index) {
            const common = `
                .css-1hwwfws,
                .css-1ynzxqw,
                .ModalExp-content{display: none !important;}
                span.RichText.ztext.CopyrightRichText-richText{text-align: justify !important;}
                body{background-attachment: fixed !important;text-shadow: #a9a9a9 0.025em 0.015em 0.02em;}`;
            const showfold = `
                .fold_element{
                    max-height: 24px;
                    margin-left: 45%;
                    margin-top: 3px;
                    width: 100px;
                    text-align: center;
                    border: 1px solid #ccc !important;
                }`;
            const contentstyle = `
                ${showfold}
                .hidden_fold:hover {
                     opacity: 1;
                     transition: opacity 2s;
                }
                .hidden_fold{opacity: 0.15;}
                .hidden_fold button {
                    float: right;
                    border: 1px solid #ccc!important;
                    box-shadow: 1px 1px 4px #888888;
                    height: 21px;
                    font-size: 14px;
                    width: 54px;
                    border-radius: 5px;
                }
                div.Question-mainColumn{
                    margin: auto !important;
                    width: 100% !important;
                    max-width: 1000px !important;
                    min-width: 1000px !important;
                }
                .RichContent.RichContent--unescapable{width: 100% !important;}
                figure{max-width: 70% !important;}
                .RichContent-inner{
                    line-height: 30px !important;
                    margin: 35px 0px !important;
                    padding: 25px 30px !important;
                    border: 6px dashed rgba(133,144,166,0.2) !important;
                    border-radius: 6px !important;
                }
                .Comments{padding: 12px !important; margin: 60px !important;}`;
            const inpustyle = `
                input::-webkit-input-placeholder {
                    font-size: 0px !important;
                    text-align: right;
                }`;
            const search = `
                .SearchResult-Card{opacity: 0.95 !important;}
                .SearchMain{width: 930px !important;}
                .SearchSideBar,
                .Card.TopSearch{display: none !important;}
                .KfeCollection-PcCollegeCard-wrapper,
                .List-item{border: 1px solid transparent;}
                .List-item{position: inherit !important;}
                .KfeCollection-PcCollegeCard-wrapper:hover,
                .List-item:hover {
                    border: 1px solid #B9D5FF;
                    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.10);
                }`;
            const topicAndquestion = `
                ${showfold}
                .hidden_fold {
                    opacity: 0.15;
                    float: right;
                }
                .hidden_fold:hover {
                     opacity: 1;
                     transition: opacity 2s;
                }
                .hidden_fold button {
                    border: 1px solid #ccc!important;
                    box-shadow: 1px 1px 0px #888888;
                    height: 18px;
                    font-size: 12px;
                    width: 54px;
                    border-radius: 5px;
                    margin-top: 2px;
                }`;
            const topic = `
                .ContentLayout{width: 100% !important;}
                .ContentLayout-mainColumn{
                    margin-left: 23%;
                    width: 930px !important;
                }
                .ContentLayout-sideColumn{
                    margin-right: 15%;
                }
                .List-item.TopicFeedItem{border: 1px solid transparent;}
                .List-item.TopicFeedItem:hover {
                    border: 1px solid #B9D5FF;
                    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.10);
                }`;
            const ad = `
                .css-1ynzxqw,
                a[href*="u.jd.com"],
                .Pc-word,
                .RichText-ADLinkCardContainer,
                .MCNLinkCard,
                .RichText-MCNLinkCardContainer,
                div.Question-sideColumn,.Kanshan-container,
                span.LinkCard-content.LinkCard-ecommerceLoadingCard,
                .RichText-MCNLinkCardContainer{display: none !important;}`;
            index === 3
                ? this.searchPage.add(
                      common,
                      inpustyle,
                      search,
                      topicAndquestion,
                      ad,
                      this.body_image()
                  )
                : GM_addStyle(
                      common +
                          (index < 2
                              ? contentstyle +
                                inpustyle +
                                this.body_image() +
                                ad
                              : index === 2
                              ? inpustyle +
                                topicAndquestion +
                                topic +
                                this.body_image() +
                                ad
                              : inpustyle)
                  );
        },
        clearStorage() {
            const rubbish = {};
            rubbish.timeStamp = Date.now();
            rubbish.words = [];
            //localstorage must storage this info to ensure the history show
            for (let i = 0; i < 5; i++)
                rubbish.words.push({ displayQuery: "", query: "" });
            localStorage.setItem("search::top-search", JSON.stringify(rubbish));
            localStorage.setItem("search:preset_words", "");
            localStorage.setItem("zap:SharedSession", "");
        },
        /*
        disable blank search hot word;
        disable show hot seach result;
        clear placeholder
        导致Promise出现错误
        */
        inputBox: {
            box: null,
            monitor(index, visibleChange) {
                this.box = document.getElementsByTagName("input")[0];
                this.box.placeholder = "";
                index > 3 &&
                    unsafeWindow.addEventListener(
                        "popstate",
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                        true
                    );
                unsafeWindow.addEventListener(
                    "visibilitychange",
                    (e) => {
                        e.preventDefault();
                        this.box.placeholder = "";
                        e.stopPropagation();
                        index < 4 && visibleChange(document.hidden);
                    },
                    true
                );
                let button = document.getElementsByClassName(
                    "Button SearchBar-searchButton Button--primary"
                );
                if (button.length > 0) {
                    button[0].onclick = (e) => {
                        if (this.box.value.length === 0) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    };
                }
                button = null;
                this.box.addEventListener(
                    "keydown",
                    (fuckzhihu) => {
                        if (fuckzhihu.keyCode !== 13) return;
                        if (
                            this.box.value.length === 0 ||
                            this.box.value.trim().length === 0
                        ) {
                            fuckzhihu.preventDefault();
                            fuckzhihu.stopImmediatePropagation();
                            fuckzhihu.stopPropagation();
                        } else {
                            if (
                                blackKey.some((e) => this.box.value.includes(e))
                            ) {
                                Notification(
                                    "keyword contains rubbish word",
                                    "Warning"
                                );
                                return;
                            }
                            const url = `https://www.zhihu.com/search?q=${this.box.value}&type=content`;
                            window.open(url, "_blank");
                        }
                    },
                    true
                );
                this.box.onfocus = () => {
                    this.box.value.length === 0 && (this.box.placeholder = "");
                    localStorage.setItem("zap:SharedSession", "");
                };
                this.box.onblur = () => (this.box.placeholder = "");
                this.firstRun();
            },
            firstRun() {
                let mo = new MutationObserver((e) => {
                    if (e.length !== 1 || e[0].addedNodes.length !== 1) return;
                    const target = e[0].addedNodes[0];
                    const p = target.getElementsByClassName("Popover-content");
                    if (p.length === 0) return;
                    const tmp =
                        p[0].getElementsByClassName("AutoComplete-group");
                    if (tmp.length === 0) return;
                    this.AutoComplete = tmp[0];
                    if (p[0].innerText.startsWith("搜索发现"))
                        this.AutoComplete.style.display = "none";
                    mo.disconnect();
                    mo = null;
                    this.secondRun(p[0].parentNode);
                });
                mo.observe(document.body, { childList: true });
            },
            AutoComplete: null,
            secondRun(target) {
                const mo = new MutationObserver((e) => {
                    if (e.length === 1) {
                        if (e[0].addedNodes.length !== 1) {
                            this.AutoComplete = null;
                            return;
                        }
                        const t = e[0].addedNodes[0];
                        this.AutoComplete =
                            t.getElementsByClassName("AutoComplete-group")[0];
                        if (t.innerText.startsWith("搜索发现"))
                            this.AutoComplete.style.display = "none";
                    } else {
                        const style =
                            this.box.value.length > 0 ? "inline" : "none";
                        this.AutoComplete.style.display !== style &&
                            (this.AutoComplete.style.display = style);
                    }
                });
                mo.observe(target, { childList: true, subtree: true });
            },
        },
        ErrorAutoClose() {
            const w = document.getElementsByClassName("PostIndex-warning");
            if (w.length === 0) return;
            const h = document.createElement("h2");
            w[0].insertAdjacentElement("afterbegin", h);
            setTimeout(() => window.close(), 6100);
            let time = 5;
            const dot = ".";
            h.innerText = `5s, current web will be automatically closed.....`;
            let id = setInterval(() => {
                time--;
                h.innerText = `${time}s, current web will be automatically closed${dot.repeat(
                    time
                )}`;
                if (time === 0) clearInterval(id);
            }, 1000);
        },
        zhuanlanStyle(mode) {
            //font, the pic of header, main content, sidebar, main content letter spacing, comment zone, ..
            //@media print, print preview, make the background-color can view when save webpage as pdf file
            const article = `
                mark.AssistantMark.red{background-color: rgba(255, 128, 128, 0.65) !important;box-shadow: rgb(255, 128, 128) 0px 1.2px;border-radius: 0.2em !important;}
                mark.AssistantMark.yellow{background-color: rgba(255, 250, 90, 1) !important;box-shadow: rgb(255, 255, 170) 0px 1.2px;border-radius: 0.2em !important;}
                mark.AssistantMark.green{background-color: rgba(170, 235, 140, 0.8) !important;box-shadow: rgb(170, 255, 170) 0px 2.2px;border-radius: 0.2em !important;}
                mark.AssistantMark.purple{background-color: rgba(255, 170, 255, 0.8) !important;box-shadow: rgb(255, 170, 255) 0px 1.2px;border-radius: 0.2em !important;}
                @media print {
                    mark.AssistantMark { box-shadow: unset !important; -webkit-print-color-adjust: exact !important; }
                    .CornerButtons,
                    div#load_status,
                    .toc-bar.toc-bar--collapsed,
                    div#assist-button-container {display : none;}
                    #column_lists {display : none !important;}
                }
                body{text-shadow: #a9a9a9 0.025em 0.015em 0.02em;}
                .TitleImage{width: 500px !important}
                .Post-Main .Post-RichText{text-align: justify !important;}
                .Post-SideActions{left: calc(50vw - 560px) !important;}
                .RichText.ztext.Post-RichText{letter-spacing: 0.1px;}
                .Sticky.RichContent-actions.is-fixed.is-bottom{position: inherit !important}
                .Comments-container,
                .Post-RichTextContainer{width: 900px !important;}
                .highlight{
                    box-shadow: rgb(170, 170, 170) 0px 0px 4px 0px;
                    box-sizing: border-box !important;
                    overflow-wrap: break-word !important;
                }
                ${
                    mode === 0 && GM_getValue("topnopicture")
                        ? ".TitleImage,"
                        : ""
                }
                a[href*="u.jd.com"],
                .RichText-MCNLinkCardContainer,
                .Post-RichTextContainer .Catalog.isCatalogV2,
                span.LinkCard-content.LinkCard-ecommerceLoadingCard,
                .css-1ynzxqw,
                .RichText-MCNLinkCardContainer{display: none !important}`;
            const list = `.Card:nth-of-type(3),.Card:last-child,.css-8txec3{width: 900px !important;}`;
            const home = `
                .RichContent.is-collapsed{cursor: default !important;}
                .List-item {
                    margin-top: 8px;
                    position: relative;
                    padding: 16px 20px;
                    width: 1000px;
                    margin-left: 23%;
                    box-shadow: 0 1px 3px rgba(18,18,18,.1);
                    border: 1px solid #B9D5FF;
                }
                .ColumnHomeTop{
                    position: relative !important;
                    height: -webkit-fill-available !important;
                }
                .css-1hwwfws{display: none !important;}`;
            if (mode < 2) {
                if (mode === 0) {
                    if (document.title.startsWith("该内容暂无法显示")) {
                        window.onload = () => this.ErrorAutoClose();
                        return;
                    }
                    const r = GM_getValue("reader");
                    if (r) {
                        GM_addStyle(
                            article + this.Column.clearPage(0).join("")
                        );
                        this.Column.readerMode = true;
                    } else GM_addStyle(article);
                    this.Column.isZhuanlan = true;
                } else {
                    document.title = "IGNORANCE IS STRENGTH";
                    Object.defineProperty(document, "title", {
                        writable: true,
                        enumerable: true,
                        configurable: true,
                    });
                    this.Column.is_column_home = true;
                    GM_addStyle(home);
                }
                window.onload = () => {
                    if (mode === 0) {
                        this.colorAssistant.main();
                        this.Column.main(0);
                        this.autoScroll.keyBoardEvent();
                        unsafeWindow.addEventListener("visibilitychange", () =>
                            this.visibleChange(document.hidden)
                        );
                        control_pannel_init();
                    } else this.column_homePage(this.Column.main(1));
                    setTimeout(() => this.show_Total.main(true), 30000);
                    this.key_ctrl_sync(true);
                };
            } else {
                GM_addStyle(list);
                this.Column.main(2);
            }
        },
        Column: {
            isZhuanlan: false,
            is_column_home: false,
            authorID: "",
            authorName: "",
            get ColumnDetail() {
                const header = document.getElementsByClassName(
                    "ColumnLink ColumnPageHeader-TitleColumn"
                );
                if (header.length === 0) {
                    this.columnName = "";
                    this.columnID = "";
                    return false;
                }
                const href = header[0].href;
                this.columnID = href.slice(href.lastIndexOf("/") + 1);
                this.columnName = header[0].innerText;
                const post = document.getElementsByClassName("Post-Author");
                if (post.length > 0) {
                    const user =
                        post[0].getElementsByClassName("UserLink-link");
                    const i = user.length - 1;
                    const p = user[i].pathname;
                    this.authorName = user[i].innerText;
                    this.authorID = p.slice(p.lastIndexOf("/") + 1);
                }
                return true;
            },
            updateAuthor(author) {
                const html = `
                <div
                    class="AuthorInfo"
                    itemprop="author"
                    itemscope=""
                    itemtype="http://schema.org/Person"
                >
                    <meta itemprop="name" content=${author.name} /><meta
                        itemprop="image"
                        content=${author.avatar_url}
                    /><meta
                        itemprop="url"
                        content=https://www.zhihu.com/people/${author.url_token}
                    /><meta itemprop="zhihu:followerCount" content="3287" /><span
                        class="UserLink AuthorInfo-avatarWrapper"
                        ><div class="Popover">
                            <div
                                id="Popover8-toggle"
                                aria-haspopup="true"
                                aria-expanded="false"
                                aria-owns="Popover8-content"
                            >
                                <a
                                    class="UserLink-link"
                                    data-za-detail-view-element_name="User"
                                    target="_blank"
                                    href="//www.zhihu.com/people/${author.url_token}"
                                    ><img
                                        class="Avatar Avatar--round AuthorInfo-avatar"
                                        width="38"
                                        height="38"
                                        src=${author.avatar_url}
                                        srcset=${author.avatar_url}
                                        alt=${author.name}
                                /></a>
                            </div></div
                    ></span>
                    <div class="AuthorInfo-content">
                        <div class="AuthorInfo-head">
                            <span class="UserLink AuthorInfo-name"
                                ><div class="Popover">
                                    <div
                                        id="Popover9-toggle"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-owns="Popover9-content"
                                    >
                                        <a
                                            class="UserLink-link"
                                            data-za-detail-view-element_name="User"
                                            target="_blank"
                                            href="//www.zhihu.com/people/${author.url_token}"
                                            >${author.name}</a
                                        >
                                    </div>
                                </div></span
                            >
                        </div>
                        <div class="AuthorInfo-detail">
                            <div class="AuthorInfo-badge">
                                <div class="ztext AuthorInfo-badgeText">
                                    ${author.headline}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                const authorNode =
                    document.getElementsByClassName("AuthorInfo");
                if (authorNode.length > 0) authorNode[0].outerHTML = html;
                this.authorID = author.url_token;
                this.authorName = author.name;
            },
            //column homepage
            subscribeOrfollow() {
                if (!this.ColumnDetail) return;
                let fn = "follow";
                let sn = "subscribe";
                const f = GM_getValue(fn);
                if (f && Array.isArray(f))
                    f.some((e) => this.columnID === e.columnID) &&
                        (fn = "remove");
                const s = GM_getValue(sn);
                if (s && Array.isArray(s))
                    s.some((e) => this.columnID === e.columnID) &&
                        (sn = "remove");
                let [a, b] =
                    fn === "remove" ? ["remove", "from"] : ["add", "to"];
                const ft = `${a}&nbsp;the&nbsp;column&nbsp;${b}&nbsp;follow&nbsp;list`;
                [a, b] = sn === "remove" ? ["remove", "from"] : ["add", "to"];
                const st = `${a}&nbsp;the&nbsp;column&nbsp;${b}&nbsp;subscribe&nbsp;list`;
                const html = `
                <div class="assistant-button" style="margin-left: 15px">
                    <style type="text/css">
                        .assistant-button button {
                            box-shadow: 1px 1px 2px #848484;
                            height: 24px;
                            border: 1px solid #ccc !important;
                            border-radius: 8px;
                        }
                    </style>
                    <button class="follow" style="width: 80px; margin-right: 5px;color: #2196F3;" title=${ft}>
                        ${fn}
                    </button>
                    <button class="subscribe" style="width: 90px" title=${st}>${sn}</button>
                </div>`;
                //const bhtml = `<button class="block" style="width: 70px" title="block the column">block</button>`;
                const user = document.getElementsByClassName(
                    "AuthorInfo AuthorInfo--plain"
                );
                if (user.length === 0) return;
                user[0].parentNode.insertAdjacentHTML("beforeend", html);
                let buttons =
                    document.getElementsByClassName("assistant-button")[0]
                        .children;
                const exe = (button, mode) => {
                    const name = button.innerText;
                    if (name === "remove") {
                        const vname = mode === 1 ? "follow" : "subscribe";
                        const arr = GM_getValue(vname);
                        if (arr && Array.isArray(arr)) {
                            const index = arr.findIndex(
                                (e) => e.columnID === this.columnID
                            );
                            if (index > -1) {
                                arr.splice(index, 1);
                                GM_setValue(vname, arr);
                                if (mode === 1 && this.columnsModule.node)
                                    this.columnsModule.database = arr;
                            }
                            Notification(`un${vname} successfully`, "Tips");
                        }
                        button.innerText = vname;
                        button.title = `add the column to ${vname} list`;
                    } else {
                        if (mode === 1) {
                            const i = this.follow(true);
                            if (i !== 1) {
                                button.innerText = "remove";
                                button.title =
                                    "remove the column from follow list";
                            }
                        } else {
                            this.subscribe();
                            button.innerText = "remove";
                            button.title =
                                "remove the column from subscribe list";
                        }
                    }
                };
                buttons[1].onclick = function () {
                    exe(this, 1);
                };
                buttons[2].onclick = function () {
                    exe(this, 2);
                };
                /*
                buttons[3].onclick =function () {
                    exe(this, 3);
                }
                */
                buttons = null;
            },
            //shift + f
            follow(mode) {
                if (!this.columnID) return;
                let f = GM_getValue("follow");
                if (f && Array.isArray(f)) {
                    let index = 0;
                    for (const e of f) {
                        if (this.columnID === e.columnID) {
                            const c = confirm(
                                `you have already followed this column on ${this.timeStampconvertor(
                                    e.update
                                )}, is unfollow this column?`
                            );
                            if (!c) return 0;
                            f.splice(index, 1);
                            GM_setValue("follow", f);
                            Notification(
                                "unfollow this column successfully",
                                "Tips"
                            );
                            return 1;
                        }
                        index++;
                    }
                } else f = [];
                const p = prompt(
                    "please input some tags about this column, like: javascript python; multiple tags use blank space to isolate",
                    "javascript python"
                );
                let tags = [];
                if (p && p.trim()) {
                    const tmp = p.split(" ");
                    for (let e of tmp) {
                        e = e.trim();
                        e && tags.push(e);
                    }
                }
                if (tags.length === 0 && !mode) {
                    const top = document.getElementsByClassName(
                        "TopicList Post-Topics"
                    );
                    if (top.length > 0) {
                        const topic = top[0].children;
                        for (const e of topic) tags.push(e.innerText);
                    }
                }
                const info = {};
                info.columnID = this.columnID;
                info.update = Date.now();
                info.columnName = this.columnName;
                info.tags = tags;
                f.push(info);
                this.columnsModule.node && (this.columnsModule.database = f);
                GM_setValue("follow", f);
                Notification(
                    "you have followed this column successfully",
                    "Tips",
                    3500
                );
                return 2;
            },
            //shift + s
            subscribe() {
                if (!this.columnID) return;
                let s = GM_getValue("subscribe");
                if (s && Array.isArray(s)) {
                    let i = 0;
                    for (const e of s) {
                        if (e.columnID === this.columnID) {
                            s.splice(i, 1);
                            break;
                        }
                    }
                } else s = [];
                const i = s.length;
                const info = {};
                info.columnID = this.columnID;
                info.update = Date.now();
                info.columnName = this.columnName;
                if (i === 0) {
                    s.push(info);
                } else {
                    i === 10 && s.pop();
                    s.unshift(info);
                }
                GM_setValue("subscribe", s);
                Notification(
                    "you have subscribed this column successfully",
                    "Tips",
                    3500
                );
            },
            Tabs: {
                get GUID() {
                    // blob:https://xxx.com/+ uuid
                    const link = URL.createObjectURL(new Blob());
                    const blob = link.toString();
                    URL.revokeObjectURL(link);
                    return blob.substr(blob.lastIndexOf("/") + 1);
                },
                save(columnID) {
                    //if currentb window does't close, when reflesh page or open new url in current window(how to detect the change ?)
                    //if open new url in same tab, how to change the uuid?
                    GM_getTab((tab) => {
                        const uuid = this.GUID;
                        tab.id = uuid;
                        tab.columnID = columnID;
                        tab.title = document.title;
                        sessionStorage.setItem("uuid", uuid);
                        GM_saveTab(tab);
                    });
                },
                check(columnID) {
                    return new Promise((resolve) => {
                        GM_getTabs((tabs) => {
                            if (tabs) {
                                //when open a new tab with "_blank" method, this tab will carry the session data of origin tab
                                const uuid = sessionStorage.getItem("uuid");
                                if (!uuid) {
                                    resolve(false);
                                } else {
                                    const tablist = Object.values(tabs);
                                    const title = document.title;
                                    const f = tablist.some(
                                        (e) =>
                                            e.columnID === columnID &&
                                            uuid === e.id &&
                                            e.titlle !== title
                                    );
                                    resolve(f);
                                }
                            } else resolve(false);
                        });
                    });
                },
            },
            tocMenu: {
                change: false,
                appendNode(toc) {
                    if (toc.className.endsWith("collapsed")) return;
                    const header =
                        document.getElementsByClassName("Post-Header");
                    if (header.length === 0) {
                        console.log("the header has been remove");
                        return;
                    }
                    header[0].appendChild(toc);
                    toc.style.position = "sticky";
                    toc.style.width = "900px";
                    this.change = true;
                },
                restoreNode(toc) {
                    if (!this.change) return;
                    document.body.append(toc);
                    toc.removeAttribute("style");
                    this.change = false;
                },
                main(mode) {
                    const toc = document.getElementById("toc-bar");
                    toc &&
                        (mode ? this.restoreNode(toc) : this.appendNode(toc));
                },
            },
            titleChange: false,
            clearPage(mode = 0) {
                const ids = [
                    "Post-Sub Post-NormalSub",
                    "Post-Author",
                    "span.Voters button",
                    "ColumnPageHeader-Wrapper",
                    "Post-SideActions",
                    "Sticky RichContent-actions is-bottom",
                ];
                if (mode === 0) {
                    const reg = /\s/g;
                    const css = ids.map(
                        (e) =>
                            `${
                                e.startsWith("span")
                                    ? e
                                    : `.${e.replace(reg, ".")}`
                            }{display: none;}`
                    );
                    return css;
                } else {
                    const style = mode === 1 ? "block" : "none";
                    ids.forEach((e) => {
                        const tmp = e.startsWith("span");
                        tmp &&
                            (e = e.slice(e.indexOf(".") + 1, e.indexOf(" ")));
                        const t = document.getElementsByClassName(e);
                        t.length > 0 &&
                            (tmp
                                ? (t[0].firstChild.style.display = style)
                                : (t[0].style.display = style));
                    });
                }
            },
            // load all lazy images in 'print' mode
            load_all_lazy_img() {
                const content = document.getElementsByClassName(
                    "RichText ztext Post-RichText"
                );
                if (content.length === 0) return;
                const imgs = content[0].querySelectorAll("img.lazy");
                for (const img of imgs) {
                    const src = img.src;
                    if (
                        src &&
                        src.startsWith(
                            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'"
                        )
                    ) {
                        const org =
                            img.dataset["original"] || img.dataset["actualsrc"];
                        if (org) {
                            const i = org.lastIndexOf("_");
                            img.src =
                                i < 0
                                    ? org
                                    : org.slice(0, i + 1) +
                                      "720w" +
                                      org.slice(org.lastIndexOf("."));
                        }
                    }
                }
            },
            titleAlign() {
                if (this.modePrint && !this.titleChange) return;
                const title = document.getElementsByClassName("Post-Title");
                if (title.length === 0) return;
                if (this.modePrint) {
                    title[0].removeAttribute("style");
                } else {
                    if (title[0].innerText.length > 28) return;
                    title[0].style.textAlign = "center";
                }
                this.titleChange = !this.titleChange;
            },
            modePrint: false,
            time_print_id: null,
            pagePrint(status) {
                // wait the the load of lazy img
                Notification(
                    `${this.modePrint ? "exit" : "enter"} print mode`,
                    "Print",
                    3500
                );
                !this.readerMode && this.clearPage(this.modePrint ? 1 : 2);
                this.tocMenu.main(this.modePrint);
                this.titleAlign();
                if (!this.modePrint) {
                    this.load_all_lazy_img();
                    this.time_print_id && clearTimeout(this.time_print_id);
                    this.time_print_id = setTimeout(() => {
                        this.time_print_id = null;
                        window.print();
                    }, 350);
                }
                this.modePrint = !this.modePrint;
                this.modePrint ? status.create("Print Mode") : status.remove();
            },
            Framework() {
                const html = `
                <div
                    id="column_lists"
                    style="
                        top: 54px;
                        width: 380px;
                        font-size: 14px;
                        box-sizing: border-box;
                        padding: 0 10px 10px 0;
                        box-shadow: 0 1px 3px #ddd;
                        border-radius: 4px;
                        transition: width 0.2s ease;
                        color: #333;
                        background: #fefefe;
                        -moz-user-select: none;
                        -webkit-user-select: none;
                        user-select: none;
                        display: flex;
                        z-index: 1;
                        position: absolute;
                        left: 2%;
                    "
                >
                    <style type="text/css">
                        button.button {
                            margin: 15px 0px 5px 0px;
                            width: 60px;
                            height: 24px;
                            border-radius: 3px;
                            box-shadow: 1px 2px 5px #888888;
                        }
                        div#column_lists .list.num {
                            color: #fff;
                            width: 18px;
                            height: 18px;
                            text-align: center;
                            line-height: 18px;
                            background: #fff;
                            border-radius: 2px;
                            display: inline-block;
                            background: #00a1d6;
                        }
                        div#column_lists ul a:hover{
                            color: blue;
                        }
                        div#column_lists ul {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: block;
                            line-height: 1.9;
                        }
                        div#column_lists .header{
                            font-weight: bold;
                            font-size: 16px;
                        }
                    </style>
                    <span
                        class="right_column"
                        style="margin-left: 5%; margin-top: 5px; width: 100%"
                    >
                        <span class="header current column">
                            <a
                                class="column name"
                                href= https://www.zhihu.com/column/${
                                    this.columnID
                                }
                                target="_blank"
                                title=${
                                    this.isZhuanlan
                                        ? ""
                                        : escapeBlank("random column")
                                }
                                >${this.columnName}</a
                            >
                            <span class="tips" style="
                                float: right;
                                font-size: 14px;
                                font-weight: normal;
                            "></span>
                            <hr style="width: 340px" />
                        </span>
                        <ul
                            class="article_lists"
                        >
                        </ul>
                        <div class="nav button">
                            <button class="button last" title="previous page">Pre</button>
                            <button class="button next" title="next page">Next</button>
                            <button class="button hide" title="hide the menu">Hide</button>
                            <button class="button more" title="show more content">More</button>
                            <select class="select-pages" size="1" name="pageslist" style="margin-left: 20px; margin-top: 16px; height: 24px; position: absolute; width: 60px;box-shadow: 1px 2px 5px #888888;">
                                <option value="0" selected>pages</option>
                            </select>
                        </div>
                    </span>
                </div>`;
                document.body.insertAdjacentHTML("beforeend", html);
            },
            timeStampconvertor(timestamp) {
                if (!timestamp) return "undefined";
                if (typeof timestamp === "number") {
                    const s = timestamp.toString();
                    if (s.length === 10) timestamp *= 1000;
                    else if (s.length !== 13) return "undefined";
                } else {
                    if (timestamp.length === 10) {
                        timestamp = parseInt(timestamp);
                        timestamp *= 1000;
                    } else if (timestamp.length === 13)
                        timestamp = parseInt(timestamp);
                    else return "";
                }
                const date = new Date(timestamp);
                const y = date.getFullYear() + "-";
                const gm = date.getMonth();
                const m = (gm + 1 < 10 ? "0" + (gm + 1) : gm + 1) + "-";
                let d = date.getDate();
                d = d < 10 ? "0" + d : d;
                return y + m + d;
            },
            backupInfo: null,
            next: null,
            previous: null,
            index: 1,
            rqReady: false,
            requestData(url) {
                if (this.rqReady) {
                    Notification("please request data slowly...", "Tips");
                    return;
                }
                this.rqReady = true;
                xmlHTTPRequest(url).then(
                    (json) => {
                        typeof json === "string" && (json = JSON.parse(json));
                        const data = json.data;
                        let id = this.isReverse ? data.length : 1;
                        const html = [];
                        this.backupInfo = [];
                        const tips =
                            "click&nbsp;me,&nbsp;show&nbsp;the&nbsp;content&nbsp;in&nbsp;current&nbsp;webpage";
                        const HREF = location.href;
                        for (const e of data) {
                            const type = e.type;
                            if (type !== "article" && type !== "answer")
                                continue;
                            const info = {};
                            info.id = id;
                            let time = e.updated;
                            let title = e.title;
                            let className = '"list_date"';
                            let question = "";
                            info.url = e.url;
                            const tmp = {};
                            let fontWeight = "";
                            if (!time) {
                                time = e.updated_time;
                                className = "list_date_question";
                                title = e.question.title;
                                question =
                                    "this&nbsp;is&nbsp;a&nbsp;question&nbsp;page,&nbsp;do&nbsp;not&nbsp;show&nbsp;in&nbsp;current&nbsp;page";
                                info.url = `https://www.zhihu.com/question/${e.question.id}/answer/${e.id}`;
                            } else {
                                HREF === info.url &&
                                    ((fontWeight =
                                        ' style="font-weight:bold;"'),
                                    (this.targetIndex = id));
                                tmp.author = e.author;
                            }
                            info.excerpt = escapeHTML(
                                `${title} <摘要>: ` + e.excerpt
                            );
                            info.updated = this.timeStampconvertor(time);
                            info.ctitle = escapeHTML(title);
                            title = titleSlice(title);
                            title = escapeHTML(title);
                            info.title = title;
                            html.push(
                                this.liTagRaw(
                                    info,
                                    question || tips,
                                    className,
                                    fontWeight
                                )
                            );
                            if (!question) {
                                tmp.content = e.content;
                                tmp.title = e.title;
                            }
                            this.backupInfo.push(tmp);
                            this.isReverse ? id-- : id++;
                        }
                        if (this.isReverse) {
                            this.backupInfo.reverse();
                            html.reverse();
                        }
                        const pag = json.paging;
                        const totals = pag.totals;
                        this.appendNode(html, totals);
                        this.previous = this.isReverse
                            ? pag.is_end
                                ? ""
                                : pag.next
                            : pag.is_start
                            ? ""
                            : pag.previous;
                        this.next = this.isReverse
                            ? pag.is_start
                                ? ""
                                : pag.previous
                            : pag.is_end
                            ? ""
                            : pag.next;
                        this.rqReady = false;
                    },
                    (err) => {
                        console.log(err);
                        this.rqReady = false;
                    }
                );
            },
            firstAdd: true,
            selectRaw(index, name) {
                return `<option value=${index}>${name}</option>`;
            },
            total_pages: 0,
            isReverse: false,
            //pages list
            appendSelect(node, pages, mode = false) {
                const select = node.getElementsByClassName("select-pages");
                if (select.length === 0) return;
                this.total_pages = Math.ceil(pages / 10);
                const end = this.total_pages > 30 ? 31 : this.total_pages + 1;
                const html = [];
                for (let index = 1; index < end; index++)
                    html.push(this.selectRaw(index, index));
                if (this.total_pages > 1)
                    html.push(this.selectRaw(html.length + 1, "reverse"));
                select[0].insertAdjacentHTML("beforeend", html.join(""));
                const optionNum = select[0].length + 1;
                const [ds, dh] =
                    optionNum < 9
                        ? [optionNum, 15 * optionNum + "px"]
                        : [8, "120px"];
                select[0].onmousedown = function () {
                    this.size = ds;
                    this.style.height = dh;
                };
                select[0].onblur = function () {
                    this.style.height = "24px";
                    this.size = 1;
                };
                //execute
                const exe = (opt) => {
                    if (this.total_pages === 1) return;
                    const i = opt.value * 1;
                    const tmp = i === this.total_pages + 1;
                    if (tmp) {
                        if (this.isReverse) return;
                        this.isReverse = tmp;
                        this.index = 1;
                        opt.value = 1;
                    } else {
                        if (i === 0) {
                            if (this.isReverse) {
                                this.isReverse = false;
                                this.index = 1;
                                opt.value = 1;
                            } else {
                                return;
                            }
                        } else this.index = i;
                    }
                    if (mode) {
                        Reflect.apply(this.homePage.add, this, [
                            this.homePage.initial,
                            "f",
                            true,
                        ]);
                    } else {
                        const m = this.isReverse
                            ? this.total_pages - this.index
                            : this.index - 1;
                        const URL = `http://www.zhihu.com/api/v4/columns/${
                            this.columnID
                        }/items?limit=10&offset=${10 * m}`;
                        this.requestData(URL);
                    }
                };
                select[0].onchange = function () {
                    this.size = 1;
                    this.style.height = "24px";
                    exe(this);
                };
            },
            changeSelect(mode) {
                this.index += mode ? 1 : -1;
                const column = document.getElementById("column_lists");
                const select = column.getElementsByTagName("select")[0];
                select.value = this.index;
            },
            appendNode(html, totals, mode = false) {
                const column = document.getElementById("column_lists");
                if (!column) {
                    console.log("the module of column has been deleted");
                    return;
                }
                const lists = column.getElementsByClassName("article_lists")[0];
                this.firstAdd
                    ? (lists.insertAdjacentHTML("afterbegin", html.join("")),
                      this.appendSelect(column, totals, mode),
                      this.clickEvent(column, mode))
                    : (lists.innerHTML = html.join(""));
                this.firstAdd = false;
            },
            liTagRaw(info, title, className = "list_date", fontWeight = "") {
                const html = `
                <li${fontWeight}>
                    <span class="list num">${info.id}</span>
                    <a
                        href=${info.url}
                        target="_blank"
                        ctitle=${info.ctitle}
                        title=${info.excerpt}>${info.title}</a
                    >
                    <span class=${className} style="float: right" title=${title}>${info.updated}</span>
                </li>`;
                return html;
            },
            nextPage: false,
            tipsTimeout: null,
            showTips(tips) {
                const column = document.getElementById("column_lists");
                if (!column) return;
                const tipNode = column.getElementsByClassName("tips")[0];
                tipNode.innerText = tips;
                this.tipsTimeout && clearTimeout(this.tipsTimeout);
                this.tipsTimeout = setTimeout(() => {
                    tipNode.innerText = "";
                    this.tipsTimeout = null;
                }, 2000);
            },
            /*
            need add new function => simple mode and content mode, if it is simple mode, all page direct show the menu of column?
            */
            followCursor: null,
            homePage: {
                follow: null,
                get ColumnID() {
                    const i = Math.floor(Math.random() * this.follow.length);
                    return this.follow[i].columnID;
                },
                get initial() {
                    this.follow = GM_getValue("follow");
                    if (
                        !this.follow ||
                        !Array.isArray(this.follow) ||
                        this.follow.length === 0
                    )
                        return false;
                    return this.follow;
                },
                add(follow, direction, page) {
                    if (!follow) return;
                    setTimeout(() => {
                        const html = [];
                        const k = follow.length;
                        if (this.isReverse) {
                            this.followCursor = (this.index - 1) * 10 - 1;
                        } else {
                            if (page) {
                                this.followCursor = k - (this.index - 1) * 10;
                            } else {
                                if (this.followCursor === null) {
                                    this.followCursor = k;
                                } else {
                                    if (direction === "r")
                                        this.followCursor += 20;
                                    if (this.followCursor > k)
                                        this.followCursor = k;
                                }
                            }
                        }
                        const className = "list_date_follow";
                        const title = "follow&nbsp;date";
                        let id = 1;
                        const prefix = "https://www.zhihu.com/column/";
                        const methods = {
                            r() {
                                this.followCursor += 1;
                                return this.followCursor < k;
                            },
                            f() {
                                this.followCursor -= 1;
                                return this.followCursor > -1;
                            },
                        };
                        const func = this.isReverse ? "r" : "f";
                        while (methods[func].call(this)) {
                            const e = follow[this.followCursor];
                            const info = {};
                            info.ctitle = e.columnName;
                            info.title = escapeHTML(e.columnName);
                            info.updated = this.timeStampconvertor(e.update);
                            info.excerpt = e.tags.join(";&nbsp;");
                            info.url = prefix + e.columnID;
                            info.id = id;
                            html.push(this.liTagRaw(info, title, className));
                            id++;
                            if (id > 10) break;
                        }
                        this.appendNode(html, k, true);
                        this.previous = this.isReverse
                            ? this.index - 1
                            : !(this.followCursor + id - 1 === k);
                        this.next = this.isReverse
                            ? this.index === Math.ceil(k / 10)
                                ? 0
                                : 1
                            : this.followCursor > -1;
                        this.homePage.follow = null;
                    }, 0);
                },
            },
            home_Module: {
                loaded_list: null,
                current_Column_id: null,
                home_request: {
                    pre: null,
                    next: null,
                    is_loaded: true,
                    index: 0,
                    firstly: true,
                    request(url, node) {
                        return new Promise((resolve, reject) => {
                            this.is_loaded = false;
                            xmlHTTPRequest(url).then(
                                (json) => {
                                    const data = json.data;
                                    const arr = [];
                                    for (const d of data) {
                                        const type = d.type;
                                        if (
                                            !(
                                                type === "article" ||
                                                type === "answer"
                                            )
                                        )
                                            continue;
                                        const info = {};
                                        info.url =
                                            d.url ||
                                            "https://www.zhihu.com/question/" +
                                                d.question.id +
                                                "/answer/" +
                                                d.id;
                                        info.title =
                                            d.title || d.question.title;
                                        arr.push(
                                            column_Home.item_Raw(
                                                d,
                                                this.index,
                                                info
                                            )
                                        );
                                        this.index += 1;
                                        column_Home.item_index += 1;
                                    }
                                    this.firstly
                                        ? (node.innerHTML = arr.join(""))
                                        : node.insertAdjacentHTML(
                                              "afterbegin",
                                              arr.join("")
                                          );
                                    this.firstly = false;
                                    const p = json.paging;
                                    this.pre = p.is_start ? null : p.previous;
                                    this.next = p.is_end ? null : p.next;
                                    this.is_loaded = true;
                                    resolve(true);
                                },
                                (err) => {
                                    console.log(err);
                                    this.is_loaded = true;
                                    reject(null);
                                }
                            );
                        });
                    },
                },
                home_nextButton() {
                    if (
                        !this.home_request.is_loaded ||
                        Reflect.get(zhihu.autoScroll, "scrollState")
                    )
                        return;
                    if (!this.home_request.next) {
                        Notification("no more data", "Tips");
                        return;
                    }
                    this.home_request
                        .request(this.home_request.next, this.Node)
                        .then(() => zhihu.scroll.toTop());
                },
                home_DB_initial() {
                    !this.loaded_list && (this.loaded_list = []);
                    this.loaded_qlist = [];
                    dataBaseInstance.initial(["collection"], true).then(
                        () => {},
                        () =>
                            Notification(
                                "database initialization failed",
                                "Warning"
                            )
                    );
                },
                is_create_button: false,
                create_home_button() {
                    createButton("Next", "", "", "right");
                    setTimeout(() => {
                        let button = document.getElementById(
                            "assist-button-container"
                        );
                        button.onclick = () => this.home_nextButton();
                        button = null;
                    }, 0);
                    this.is_create_button = true;
                },
                get Node() {
                    return document.getElementsByClassName("ColumnHomeTop")[0];
                },
                get_full_title(a) {
                    const attributes = a.attributes;
                    for (const e of attributes)
                        if (e.name === "ctitle") return e.value;
                    return "";
                },
                loaded_qlist: null,
                li_set_blod(t) {
                    this.cancel_li_bold(t);
                    t.parentNode.style.fontWeight = "bold";
                },
                get_article_list(t) {
                    let p = t.parentNode;
                    let cn = p.className;
                    if (cn === "article_lists") return p;
                    else {
                        p = p.parentNode;
                        cn = p.className;
                        let ic = 0;
                        while (cn !== "article_lists") {
                            p = p.previousElementSibling;
                            if (!p || ic > 4) return null;
                            cn = p.className;
                            ic++;
                        }
                        return p;
                    }
                },
                cancel_li_bold(t) {
                    const p = this.get_article_list(t.parentNode);
                    if (!p) return;
                    const cs = p.children;
                    for (const c of cs) {
                        if (c.style.fontWeight === "bold") {
                            c.style.fontWeight = "normal";
                            break;
                        }
                    }
                },
                home_click(href, target, mode) {
                    if (!this.home_request.is_loaded) return;
                    const id = href.slice(href.lastIndexOf("/") + 1);
                    const pos = ["answer", "zhuanlan", "column", "question"];
                    const index = pos.findIndex((e) => href.includes(e));
                    if (index === 2) {
                        if (this.current_Column_id === id) return;
                        this.home_request.pre = null;
                        this.home_request.next = null;
                        this.home_request.firstly = true;
                        this.current_Column_id = id;
                        const url = `https://www.zhihu.com/api/v4/columns/${id}/items?limit=5&offset=0`;
                        this.home_request.request(url, this.Node);
                        !this.is_create_button && this.create_home_button();
                        column_Home.item_index = 0;
                        this.home_request.index = 0;
                        this.loaded_list.length = 0;
                        this.loaded_qlist.length = 0;
                        mode
                            ? this.li_set_blod(target)
                            : this.cancel_li_bold(target);
                    } else if (index < 2) {
                        if (this.loaded_list.includes(id)) return;
                        this.current_article_id = id;
                        this.current_Column_id = null;
                        const info = {};
                        info.title = this.get_full_title(target);
                        info.url = href;
                        this.loaded_list.push(id);
                        column_Home.single_Content_request(
                            index === 0 ? 0 : 2,
                            id,
                            this.Node,
                            info
                        );
                    } else {
                        if (this.loaded_qlist.includes(id)) return;
                        this.loaded_qlist.push(id);
                        const index = collect_Answers.findIndex(
                            (e) => e.qid === id
                        );
                        if (index > -1) {
                            const c = collect_Answers[index];
                            const title = c.title;
                            const data = c.data;
                            for (const d of data) {
                                if (this.loaded_list.includes(d.aid)) continue;
                                this.loaded_list.push(d.aid);
                                const info = {};
                                info.title = title;
                                info.url =
                                    "https://www.zhihu.com/question/" +
                                    id +
                                    "/answer/" +
                                    d.aid;
                                column_Home.single_Content_request(
                                    0,
                                    d.aid,
                                    this.Node,
                                    info
                                );
                            }
                        }
                    }
                },
            },
            targetIndex: 0,
            clickEvent(node, mode = false) {
                let buttons =
                    node.getElementsByClassName("nav button")[0].children;
                let article = node.getElementsByTagName("ul")[0];
                let aid = 0;
                //prevent click too fast
                let isReady = false;
                //show content in current page;
                let article_time_id = null;
                article.onclick = (e) => {
                    //if under autoscroll mode, => not allow to click
                    article_time_id && clearTimeout(article_time_id);
                    article_time_id = setTimeout(() => {
                        article_time_id = null;
                        if (
                            Reflect.get(zhihu.autoScroll, "scrollState") ||
                            Reflect.get(zhihu.noteHighlight, "editable")
                        )
                            return;
                        if (isReady) {
                            Notification("please operate slowly...", "Tips");
                            return;
                        }
                        const t = e.target;
                        const href = t.previousElementSibling.href;
                        if (location.href === href) return;
                        const className = t.className;
                        if (className === "list_date_follow") {
                            if (this.is_column_home) {
                                this.home_Module.home_click(
                                    href,
                                    t.previousElementSibling,
                                    true
                                );
                                return;
                            }
                            sessionStorage.clear();
                            window.open(href, "_self");
                        } else if (className !== "list_date") return;
                        const content = document.getElementsByClassName(
                            "RichText ztext Post-RichText"
                        );
                        if (content.length === 0) return;
                        const p = e.path;
                        let ic = 0;
                        for (const e of p) {
                            if (e.localName === "li") {
                                let id = e.children[0].innerText;
                                id *= 1;
                                if (id === aid) return;
                                aid = id;
                                break;
                            }
                            if (ic > 2) return;
                            ic++;
                        }
                        isReady = true;
                        const i = aid - 1;
                        const title =
                            document.getElementsByClassName("Post-Title");
                        title.length > 0 &&
                            (title[0].innerText = this.backupInfo[i].title);
                        content[0].innerHTML = this.backupInfo[i].content;
                        zhihu.colorAssistant.main();
                        window.history.replaceState(null, null, href);
                        document.title = `${this.backupInfo[i].title} - 知乎`;
                        //refresh the menu
                        const toc = document.getElementById("toc-bar");
                        if (toc) {
                            const refresh = toc.getElementsByClassName(
                                "toc-bar__refresh toc-bar__icon-btn"
                            );
                            refresh.length > 0 && refresh[0].click();
                        }
                        const author = this.backupInfo[i].author;
                        if (author && this.authorID !== author.url_token)
                            this.updateAuthor(author);
                        let pnode = e.target.parentNode;
                        let j = 0;
                        while (pnode.localName !== "li") {
                            pnode = pnode.parentNode;
                            j++;
                            if (j > 2) break;
                        }
                        j < 3 && (pnode.style.fontWeight = "bold");
                        if (this.targetIndex > 0) {
                            pnode.parentNode.children[
                                this.targetIndex - 1
                            ].style.fontWeight = "normal";
                        }
                        this.targetIndex = aid;
                        this.reInject();
                        isReady = false;
                        const links = content[0].getElementsByTagName("a");
                        for (const link of links) {
                            const href = decodeURIComponent(link.href).split(
                                "link.zhihu.com/?target="
                            );
                            if (href.length > 1) link.href = href[1];
                        }
                    }, 300);
                };
                article = null;
                //last page
                let isCollapsed = false;
                let change_time_id = null;
                buttons[0].onclick = () => {
                    change_time_id && clearTimeout(change_time_id);
                    change_time_id = setTimeout(() => {
                        change_time_id = null;
                        !isCollapsed &&
                            (this.previous
                                ? (mode
                                      ? Reflect.apply(this.homePage.add, this, [
                                            this.homePage.initial,
                                            "r",
                                            false,
                                        ])
                                      : this.requestData(this.previous),
                                  (aid = 0),
                                  this.changeSelect(false))
                                : this.showTips("no more content"));
                    }, 300);
                };
                //next page
                let change_time_id_a;
                buttons[1].onclick = () => {
                    change_time_id_a && clearTimeout(change_time_id_a);
                    change_time_id_a = setTimeout(() => {
                        change_time_id_a = null;
                        !isCollapsed &&
                            (this.next
                                ? (mode
                                      ? Reflect.apply(this.homePage.add, this, [
                                            this.homePage.initial,
                                            "f",
                                            false,
                                        ])
                                      : this.requestData(this.next),
                                  (aid = 0),
                                  this.changeSelect(true))
                                : this.showTips("no more content"));
                    }, 300);
                };
                //hide the sidebar
                buttons[2].onclick = function () {
                    const [style, text, title] = isCollapsed
                        ? ["block", "Hide", "hide the menu"]
                        : ["none", "Expand", "show the menu"];
                    this.parentNode.parentNode.children[1].style.display =
                        style;
                    const more = this.parentNode.nextElementSibling;
                    if (more) {
                        more.style.display = style;
                        more.nextElementSibling.style.display = style;
                    }
                    this.innerText = text;
                    this.title = title;
                    isCollapsed = !isCollapsed;
                };
                let addnew = true;
                const createModule = (button) => {
                    const sub = GM_getValue("subscribe");
                    if (addnew) {
                        this.columnsModule.liTagRaw = this.liTagRaw;
                        this.columnsModule.isZhuanlan = this.isZhuanlan;
                        this.columnsModule.is_column_home = this.is_column_home;
                        this.columnsModule.timeStampconvertor =
                            this.timeStampconvertor;
                        if (this.is_column_home)
                            this.columnsModule.home = this.home_Module;
                    }
                    let html = null;
                    let text = "";
                    if (sub && Array.isArray(sub)) {
                        let id = 1;
                        const prefix = "https://www.zhihu.com/column/";
                        const title = "subscribe&nbsp;time";
                        html = sub.map((e) => {
                            const info = {};
                            info.id = id;
                            info.url = prefix + e.columnID;
                            info.updated = this.timeStampconvertor(e.update);
                            info.title = e.columnName;
                            info.ctitle = escapeHTML(e.columnName);
                            info.excerpt = "";
                            id++;
                            return this.liTagRaw(info, title);
                        });
                        text = "Subscribe";
                    } else text = "no more data";
                    addnew
                        ? this.columnsModule.main(
                              button,
                              html,
                              text,
                              escapeBlank(
                                  this.isZhuanlan
                                      ? "column/article search"
                                      : this.is_column_home
                                      ? "column/article/answer search"
                                      : "column/article search"
                              )
                          )
                        : this.columnsModule.appendNewNode(html, text);
                    addnew = false;
                };
                buttons[3].onclick = function () {
                    !isCollapsed && createModule(this);
                };
                //if webpage is column home, expand this menu
                mode && createModule(buttons[3]);
                buttons = null;
            },
            columnsModule: {
                recentModule: {
                    log(type, config) {
                        //history, pocket, recent collect: h, c, p
                        const href = (config && config.url) || location.href;
                        let r = GM_getValue("recent");
                        if (r && Array.isArray(r)) {
                            const index = r.findIndex((e) => e.url === href);
                            if (index > -1) {
                                if (index === 0 && r[index].type === type)
                                    return;
                                r.splice(index, 1);
                            }
                        } else r = [];
                        let info = {};
                        if (config) info = config;
                        else {
                            info.title = get_Title();
                            info.update = Date.now();
                            info.type = type;
                            info.url = href;
                        }
                        const i = r.length;
                        if (i === 0) {
                            r.push(info);
                        } else {
                            if (i === 10) r.pop();
                            r.unshift(info);
                        }
                        GM_setValue("recent", r);
                        type === "p" &&
                            Notification(
                                "add current article to read later successfully",
                                "Tips"
                            );
                    },
                    remove(type, url) {
                        const href = url || location.href;
                        const r = GM_getValue("recent");
                        if (r && Array.isArray(r)) {
                            const index = r.findIndex((e) => e.url === href);
                            if (index > -1 && r[index].type === type) {
                                r.splice(index, 1);
                                GM_setValue("recent", r);
                            }
                        }
                    },
                    addnew: true,
                    read(node, liTagRaw, timeStampconvertor, home) {
                        const r = GM_getValue("recent");
                        if (!r || !Array.isArray(r) || r.length === 0) return;
                        const html = r.map((e) => {
                            const info = {};
                            const type = e.type;
                            info.updated = timeStampconvertor(e.update);
                            info.id = type;
                            info.excerpt = "";
                            info.url = e.url;
                            info.ctitle = escapeHTML(e.title);
                            info.title = titleSlice(e.title);
                            const title =
                                "recent&nbsp;" +
                                (type === "h"
                                    ? "read&nbsp;history"
                                    : type === "c"
                                    ? "collection"
                                    : "pocket");
                            return liTagRaw(info, title);
                        });
                        let ul = node.getElementsByTagName("ul")[0];
                        const pre = ul.previousElementSibling;
                        pre.style.display =
                            html.length === 0 ? "block" : "none";
                        ul.innerHTML = html.join("");
                        if (this.addnew) {
                            ul.onclick = (e) => {
                                if (e.target.className === "list_date") {
                                    if (
                                        Reflect.get(
                                            zhihu.autoScroll,
                                            "scrollState"
                                        )
                                    )
                                        return;
                                    const a =
                                        e.target.previousElementSibling.href;
                                    if (home) {
                                        home.home_click(
                                            a,
                                            e.target.previousElementSibling
                                        );
                                        return;
                                    }
                                    location.href !== a &&
                                        (sessionStorage.clear(),
                                        window.open(a, "_self"));
                                }
                            };
                        }
                        ul = null;
                    },
                    main(node, liTagRaw, timeStampconvertor, home) {
                        const n = node.nextElementSibling;
                        this.read(n, liTagRaw, timeStampconvertor, home);
                        let button =
                            n.getElementsByClassName("button refresh")[0];
                        button.onclick = () =>
                            this.read(n, liTagRaw, timeStampconvertor, home);
                        button = null;
                    },
                },
                database: null,
                node: null,
                liTagRaw: null,
                home: null,
                addNewModule(text, placeholder) {
                    const html = `
                        <div class="more columns">
                            <hr>
                            <div class="search module" style="margin-bottom: 10px">
                                <input
                                    type="text"
                                    placeholder=${placeholder}
                                    style="height: 24px; width: 250px"
                                />
                                <button class="button search" style="margin-left: 11px;">Search</button>
                            </div>
                            <hr>
                            <span class="header columns">${text}</span>
                            <ul class="columns list">
                            </ul>
                        </div>
                        <div class="recently-activity">
                            <hr>
                            <span class="header columns"
                                >Recent
                                <button
                                    class="button refresh"
                                    style="margin-top: 5px; margin-left: 210px; font-weight: normal"
                                    title="refresh recent content"
                                >
                                    refresh
                                </button>
                            </span>
                            <hr>
                            <span class="header columns">no recent data</span>
                            <ul style="height: 120px; overflow: auto;"></ul>
                        </div>`;
                    const column = document.getElementById("column_lists");
                    if (column)
                        column.children[1].insertAdjacentHTML(
                            "beforeend",
                            html
                        );
                },
                appendNewNode(html, text = "", node) {
                    let pnode = node || this.node;
                    pnode = pnode.parentNode.nextElementSibling;
                    const ul = pnode.getElementsByTagName("ul")[0];
                    ul.innerHTML = html.join("");
                    text && (pnode.children[3].innerText = text);
                },
                checkInlcudes(e, key) {
                    if (e.columnName.includes(key)) return true;
                    return e.tags.some((t) =>
                        key.length > t.length
                            ? key.includes(t)
                            : t.includes(key)
                    );
                },
                timeStampconvertor: null,
                commandFormat(str) {
                    const treg = /(?<=\$)[dmhyw][<>=][0-9]+/g;
                    const areg = /(?<=\$)a=\(.+\)/g;
                    const preg = /(?<=\$)p=[0-9]{5,}/g;
                    const t = str.match(treg);
                    const p = str.match(preg);
                    if (t && p) return null;
                    const a = str.match(areg);
                    if (p && a) return null;
                    if (!(a || p || t)) return null;
                    const sigs = ["=", ">", "<"];
                    const sign = {
                        0: "equal",
                        1: "great",
                        2: "less",
                    };
                    const type = {};
                    if (t) {
                        let cm = "";
                        let ecount = 0;
                        let lcount = 0;
                        let gcount = 0;
                        for (const e of t) {
                            if (cm && cm !== e[0]) return null;
                            if (!type[e[0]]) type[e[0]] = {};
                            if (type[e[0]]) {
                                const sg = e[1];
                                const index = sigs.findIndex((e) => e === sg);
                                if (index === 0) {
                                    ecount++;
                                    if (ecount > 1) return null;
                                } else if (index === 1) {
                                    gcount++;
                                    if (gcount > 1) return null;
                                } else {
                                    lcount++;
                                    if (lcount > 1) return null;
                                }
                                const n = sign[index];
                                if (type[e[0]][n]) return null;
                                type[e[0]][n] = e.slice(2);
                            }
                        }
                        if (a) {
                            if (a.length > 1) return null;
                            const tmp = a[0];
                            type[tmp[0]] = tmp
                                .slice(3, tmp.length - 1)
                                .split(" ");
                        }
                    } else if (p) {
                        if (p.length > 1) return null;
                        const tmp = p[0];
                        type[tmp[0]] = tmp.slice(2);
                    } else if (a) {
                        if (a.length > 1) return null;
                        const tmp = a[0];
                        type[tmp[0]] = tmp.slice(3, tmp.length - 1).split(" ");
                    }
                    return type;
                },
                //search box query command execute
                ExecuteFunc: {
                    Resultshow(e, i, liTagRaw, timeStampconvertor) {
                        const info = {};
                        info.id = i;
                        info.ctitle = escapeHTML(e.title);
                        info.title = titleSlice(e.title);
                        info.excerpt = escapeHTML(e.excerpt);
                        info.updated = timeStampconvertor(e.update);
                        const title = escapeBlank("collect time");
                        const prefix = "/p/";
                        info.url = prefix + e.pid;
                        return liTagRaw(info, title);
                    },
                    less(a, b) {
                        return a < b;
                    },
                    equal(a, b) {
                        return a === b;
                    },
                    great(a, b) {
                        return a > b;
                    },
                    get now() {
                        return Date.now();
                    },
                    get nowDate() {
                        return new Date();
                    },
                    getUpdate(update) {
                        return new Date(update);
                    },
                    w(value, mode, info) {
                        const now = this.now;
                        const time = info.update;
                        const week = (now - time) / (86400000 * 7);
                        return this[mode](week, value * 1);
                    },
                    d(value, mode, info) {
                        const now = this.now;
                        const time = info.update;
                        const day = (now - time) / 86400000;
                        return this[mode](day, value * 1);
                    },
                    m(value, mode, info) {
                        const endDate = this.nowDate;
                        const beginDate = this.getUpdate(info.update);
                        const month =
                            endDate.getFullYear() * 12 +
                            endDate.getMonth() -
                            (beginDate.getFullYear() * 12 +
                                beginDate.getMonth());
                        return this[mode](month, value * 1);
                    },
                    y(value, mode, info) {
                        const endDate = this.nowDate;
                        const beginDate = this.getUpdate(info.update);
                        const year =
                            endDate.getFullYear() * 12 +
                            endDate.getMonth() -
                            (beginDate.getFullYear() * 12 +
                                beginDate.getMonth()) /
                                12;
                        return this[mode](year, value * 1);
                    },
                    h(value, mode, info) {
                        const now = this.now;
                        const time = info.update;
                        const hour = (now - time) / (1000 * 60 * 60);
                        return this[mode](hour, value * 1);
                    },
                    a(value, info) {
                        const content =
                            info.title +
                            " | " +
                            info.tags.join("") +
                            info.excerpt;
                        return value.some((v) => content.includes(v));
                    },
                    search(table, fs, liTagRaw, timeStampconvertor) {
                        return new Promise((resolve, reject) => {
                            let ic = 0;
                            const html = [];
                            const cur = table.openCursor(null, "next");
                            cur.onsuccess = (e) => {
                                const cursor = e.target.result;
                                if (cursor) {
                                    const info = cursor.value;
                                    const result = fs.every((f) => f(info));
                                    if (result) {
                                        ic++;
                                        info.ctitle = escapeHTML(info.title);
                                        info.title = titleSlice(info.title);
                                        html.push(
                                            this.Resultshow(
                                                info,
                                                ic,
                                                liTagRaw,
                                                timeStampconvertor
                                            )
                                        );
                                    }
                                    if (ic === 10) {
                                        resolve(html);
                                    } else {
                                        cursor.continue();
                                    }
                                } else {
                                    resolve(html);
                                }
                            };
                            cur.onerror = (e) => {
                                console.log(e);
                                reject("open db cursor fail");
                            };
                        });
                    },
                    funcs(
                        type,
                        liTagRaw,
                        timeStampconvertor,
                        node,
                        appendNewNode
                    ) {
                        const fs = [];
                        const keys = Object.keys(type);
                        for (const f of keys) {
                            const tmp = type[f];
                            if (Array.isArray(tmp) || typeof tmp !== "object") {
                                if (f === "p") {
                                    dataBaseInstance.check(tmp).then(
                                        (r) => {
                                            const html = [];
                                            if (r) {
                                                r.ctitle = escapeHTML(r.title);
                                                r.title = titleSlice(r.title);
                                                html.push(
                                                    this.Resultshow(
                                                        r,
                                                        1,
                                                        liTagRaw,
                                                        timeStampconvertor
                                                    )
                                                );
                                            }
                                            appendNewNode(
                                                html,
                                                html.length === 0
                                                    ? "no search result"
                                                    : "article search results",
                                                node
                                            );
                                        },
                                        (err) => console.log(err)
                                    );
                                    return;
                                }
                                fs.push(this[f].bind(this, tmp));
                                continue;
                            }
                            const tk = Object.keys(tmp);
                            for (const e of tk)
                                fs.push(this[f].bind(this, tmp[e], e));
                        }
                        return fs;
                    },
                    main(
                        table,
                        type,
                        liTagRaw,
                        timeStampconvertor,
                        node,
                        appendNewNode
                    ) {
                        const fs = this.funcs(
                            type,
                            liTagRaw,
                            timeStampconvertor,
                            node,
                            appendNewNode
                        );
                        if (!fs || fs.length === 0) return;
                        this.search(
                            table,
                            fs,
                            liTagRaw,
                            timeStampconvertor
                        ).then(
                            (html) => {
                                appendNewNode(
                                    html,
                                    html.length === 0
                                        ? "no search result"
                                        : "article search results",
                                    node
                                );
                            },
                            (err) => console.log(err)
                        );
                    },
                },
                initialDatabase(type) {
                    if (!type) return;
                    dataBaseInstance.TableName = "collection";
                    this.ExecuteFunc.main(
                        dataBaseInstance.Table,
                        type,
                        this.liTagRaw,
                        this.timeStampconvertor,
                        this.node,
                        this.appendNewNode
                    );
                },
                _answer_check(title, arr) {
                    return arr.some((e) =>
                        title.length > e.length
                            ? title.includes(e)
                            : e.includes(title)
                    );
                },
                search_Anwsers(key) {
                    const html = [];
                    if (
                        collect_Answers.length === 0 ||
                        !(key[1] === "=" || key[1] === " ")
                    )
                        return html;
                    key = key.slice(2).trim();
                    if (!key) return html;
                    const tmp = key.split(" ");
                    let i = 0;
                    const title = escapeBlank("last active time");
                    const pref = "https://www.zhihu.com/question/";
                    for (const e of collect_Answers) {
                        if (this._answer_check(e.title, tmp)) {
                            i++;
                            const info = {};
                            info.id = i;
                            info.ctitle = e.title;
                            info.title = titleSlice(e.title);
                            info.excerpt = e.data.length;
                            info.updated = this.timeStampconvertor(
                                e.data[0].update
                            );
                            info.url = pref + e.qid;
                            html.push(this.liTagRaw(info, title));
                            if (i === 10) break;
                        }
                    }
                    return html;
                },
                isZhuanlan: false,
                is_column_home: false,
                searchDatabase(key) {
                    if (
                        (key.charAt(0) === "$" && this.isZhuanlan) ||
                        (this.is_column_home && key.length > 2)
                    ) {
                        const cm = ["a", "p", "d", "m", "y", "h", "w", "q"];
                        const f = key.charAt(1).toLowerCase();
                        const index = cm.indexOf(f);
                        if (index === cm.length - 1) {
                            if (!collect_Answers)
                                collect_Answers = GM_getValue("collect_a");
                            if (
                                !(
                                    collect_Answers &&
                                    Array.isArray(collect_Answers)
                                )
                            )
                                collect_Answers = [];
                            const html = this.search_Anwsers(key);
                            this.appendNewNode(
                                html,
                                html.length === 0
                                    ? "no search result"
                                    : "answer search results"
                            );
                            return true;
                        } else if (index > -1) {
                            this.initialDatabase(this.commandFormat(key));
                            return true;
                        }
                    }
                    return false;
                },
                search(key) {
                    //search follow columns & collection of article
                    if (this.searchDatabase(key)) return;
                    let i = 0;
                    const html = [];
                    const prefix = "https://www.zhihu.com/column/";
                    const title = "follow&nbsp;time";
                    for (const e of this.database) {
                        if (this.checkInlcudes(e, key)) {
                            i++;
                            const info = {};
                            info.id = i;
                            info.ctitle = e.columnName;
                            info.title = titleSlice(e.columnName);
                            info.excerpt = e.tags.join(";&nbsp;");
                            info.updated = this.timeStampconvertor(e.update);
                            info.url = prefix + e.columnID;
                            html.push(this.liTagRaw(info, title));
                            if (i === 10) break;
                        }
                    }
                    this.appendNewNode(
                        html,
                        html.length === 0
                            ? "no search result"
                            : "column search results"
                    );
                },
                event() {
                    const p = this.node.parentNode.nextElementSibling;
                    const input = p.getElementsByTagName("input")[0];
                    input.onkeydown = (e) => {
                        if (e.keyCode !== 13) return;
                        const key = input.value.trim();
                        key.length > 1 && this.search(key);
                    };
                    let button = p.getElementsByClassName("button search")[0];
                    button.onclick = () => {
                        const key = input.value.trim();
                        key.length > 1 && this.search(key);
                    };
                    button = null;
                    let ul = p.getElementsByTagName("ul")[0];
                    ul.onclick = (e) => {
                        if (e.target.className === "list_date") {
                            const a = e.target.previousElementSibling.href;
                            if (this.home) {
                                this.home.home_click(
                                    a,
                                    e.target.previousElementSibling
                                );
                                return;
                            }
                            location.href !== a && window.open(a, "_self");
                        }
                    };
                    ul = null;
                    this.recentModule.main(
                        p,
                        this.liTagRaw,
                        this.timeStampconvertor,
                        this.home
                    );
                },
                main(node, html, text, placeholder) {
                    this.node = node;
                    this.addNewModule(text, placeholder);
                    html && this.appendNewNode(html);
                    this.database = GM_getValue("follow");
                    if (!this.database || !Array.isArray(this.database))
                        this.database = [];
                    this.event();
                    GM_addValueChangeListener(
                        "follow",
                        (name, oldValue, newValue, remote) =>
                            remote && (this.database = newValue)
                    );
                },
            },
            assistNewModule: {
                preferenceModule(ainfo, binfo) {
                    const html = `
                    <div class="article_attitude" style="margin-left: 23px;">
                        <i
                            class="like"
                            style="
                                display: ${ainfo.ldisplay};
                                width: 26px;
                                content: url(data:image/webp;base64,UklGRoQBAABXRUJQVlA4IHgBAACQCACdASogAB8APm0ukUakIqGhKA1QgA2JaQATIBYgOyI1I/+d+2b49NA3z97A/6i/5f7VTVdqWUnQ+1B4fpukJQWsIUl77RwBlh9AYAD+/zKmH7r/7EJor7FchRHELu3xLyzt7tJsA4Kzo9o+jvdvg5F0PPnJ9h0T6ZLB/b/rf/u1ZNAgIjiz+e0teMM3r/7DFRJvl0h7Fp4PhhsogsSnsOevchiVl0v6jl73n1FPJaHvKz9qfJjC7VQCJTZ5/BAH9nF7hT/zjn+4fX8wnMmQGU9umlNySGfj4UGkhjkHpIds5Roy6Pi8eUA5zXCS8zCLf44zw/qXPgWSHfCrt+fmUapijvBoIn63X72ltR/wx3tHDi5gRr/wpBL8ERY3qmeKlMEBs9Km2Kg7BwpkKE4XNXjYQXuHn5bv7F0uxIKi2Ubgl/XO+BoeBlATzvrM24XeHW2/tv3nQ/z/wzbte4iSl5C3+7TrtUmPDs/XPieOK13LuZjgAAAA);
                                height: 26px;
                                margin-bottom: 5px;
                            "
                            title=${ainfo.ltitle}
                        ></i>
                        <i
                            class="dislike"
                            style="
                                content: url(data:image/webp;base64,UklGRmYBAABXRUJQVlA4IFoBAACQCQCdASogACAAPm0qkkWkIqGYDAYAQAbEtIAJ5c+RfUB0rJ7j9kpzPfcf1XiiNSX5s/7v5gPbD3Bv1F/0K6nH9glbEGQcDYiAI3S+NfKqNr+EMSyQAP7yUv/+QvpX0Z+oaIucX4be+hsni+QhcLK0f/ugn01LW17/NrkTFet/XNw/o/5+bPpPA3v7Ic8/NjVb4alH/V1LUJBkL7kko/v//XOzDfCaCoDzemP+zPNtC3dB6keXLJVpBMrLJgNzY/VUAKf+1SSCB/5BD/4Nf+lylTxAGWJl0/1twWPbOMbH0d+MQkF0fSsPqqBRpvc6FNf+PClifyl4OpWwfxGKiMm1C7O8/w0vDlPCbbwR4FKhQKuj2Fyul9WITHFC4fpzSNIBC39ZlySnghJRgDgCo/P+f9205ENaW+9XKyYLte/Gddtc43354MKLVHwYv44znVWV8gcjChTAAAAA);
                                display: ${ainfo.ddisplay};
                                width: 24px;
                                height: 24px;
                            "
                            title=${ainfo.dtitle}
                        ></i>
                    </div>
                    <button class="assist-button collect" style="color: black;" title=${binfo.title}>${binfo.name}</button>`;
                    return html;
                },
                create(module) {
                    const node = document.getElementById(
                        "assist-button-container"
                    );
                    node.children[0].insertAdjacentHTML("afterend", module);
                    return node;
                },
                //open db with r&w mode, if this db is not exist then create db
                main() {
                    return new Promise((resolve) => {
                        const tables = ["collection", "preference"];
                        dataBaseInstance.initial(tables, true).then(
                            (result) => {
                                const ainfo = {};
                                ainfo.ltitle = "like this article";
                                ainfo.ldisplay = "block";
                                ainfo.ddisplay = "block";
                                ainfo.dtitle = "dislike this article";
                                const binfo = {};
                                binfo.title = "add this article to collection";
                                binfo.name = "Collect";
                                if (result === 0) {
                                    resolve(
                                        this.create(
                                            this.preferenceModule(
                                                escapeBlank(ainfo),
                                                escapeBlank(binfo)
                                            )
                                        )
                                    );
                                } else {
                                    dataBaseInstance
                                        .batchCheck(tables)
                                        .then((results) => {
                                            const c = results[0];
                                            if (c) {
                                                binfo.title =
                                                    "remove this acticle from collection list";
                                                binfo.name = "Remove";
                                            }
                                            if (results[1]) {
                                                const pref = results[1].value;
                                                if (pref === 1) {
                                                    ainfo.ltitle =
                                                        "cancel like this article";
                                                    ainfo.ddisplay = "none";
                                                } else if (pref === 0) {
                                                    ainfo.dtitle =
                                                        "cancel dislike this article";
                                                    ainfo.ldisplay = "none";
                                                }
                                            }
                                            resolve(
                                                this.create(
                                                    this.preferenceModule(
                                                        escapeBlank(ainfo),
                                                        escapeBlank(binfo)
                                                    )
                                                )
                                            );
                                        });
                                }
                            },
                            (err) => {
                                console.log(err);
                                resolve(null);
                            }
                        );
                    });
                },
            },
            syncData(mode, newValue) {
                dataBaseInstance.TableName = "preference";
                mode
                    ? dataBaseInstance.update(newValue[0])
                    : dataBaseInstance.dele(false, newValue[0]);
            },
            communication() {
                const monitor = () => {
                    GM_addValueChangeListener(
                        "blockarticleB",
                        (name, oldValue, newValue, remote) => {
                            if (remote) {
                                this.syncData(true, newValue);
                                GM_setValue("blockarticleB", "");
                            }
                        }
                    );
                    GM_addValueChangeListener(
                        "removearticleB",
                        (name, oldValue, newValue, remote) => {
                            if (remote) {
                                this.syncData(false, newValue);
                                GM_setValue("removearticleB", "");
                            }
                        }
                    );
                };
                const r = GM_getValue("removearticleB");
                const b = GM_getValue("blockarticleB");
                if (r || b) {
                    dataBaseInstance.TableName = "preference";
                    if (r && Array.isArray(r) && r.length > 0) {
                        for (const e of r) dataBaseInstance.dele(false, e);
                        GM_setValue("removearticleB", "");
                    }
                    if (b && Array.isArray(b) && b.length > 0) {
                        for (const e of b) dataBaseInstance.update(e);
                        GM_setValue("blockarticleB", "");
                    }
                    monitor();
                } else monitor();
            },
            creatAssistantEvent(node, mode) {
                const Button = (button, m) => {
                    if (m) {
                        if (!this.readerMode) return;
                        this.createFrame();
                        button.style.display = "none";
                        mode = false;
                    } else {
                        let text = "";
                        let style = "";
                        const column = document.getElementById("column_lists");
                        let i = 0;
                        let title = "";
                        if (this.readerMode) {
                            text = "Reader";
                            style = "none";
                            title = "enter";
                            if (column) column.style.display = style;
                            i = 1;
                            //show content;
                        } else {
                            style = "block";
                            text = "Exit";
                            title = "exit";
                            if (column) {
                                column.style.display = style;
                            } else {
                                //hide content
                                this.Tabs.check(this.columnID).then(
                                    (result) => !result && this.createFrame()
                                );
                            }
                            i = 2;
                        }
                        !this.modePrint && this.clearPage(i);
                        button.title = `${title} the reader mode`;
                        button.innerText = text;
                        this.readerMode = !this.readerMode;
                        GM_setValue("reader", this.readerMode);
                        mode &&
                            (button.previousElementSibling.style.display =
                                style);
                    }
                };
                let i = node.children.length;
                //reder
                node.children[--i].onclick = function () {
                    Button(this, false);
                };
                //menu
                if (mode) {
                    node.children[--i].onclick = function () {
                        Button(this, true);
                    };
                }
                //collection
                let cReady = false;
                const collectionClick = (button) => {
                    if (cReady) return;
                    cReady = true;
                    dataBaseInstance.TableName = "collection";
                    const text = button.innerText;
                    let s = "",
                        t = "";
                    if (text === "Remove") {
                        s = "Collect";
                        t = "add this article to collection list";
                        dataBaseInstance.dele(true);
                        this.columnsModule.recentModule.remove("c");
                    } else {
                        s = "Remove";
                        t = "remove this article frome collection list";
                        dataBaseInstance.additem(this.columnID);
                        this.columnsModule.recentModule.log("c");
                    }
                    button.innerText = s;
                    button.title = t;
                    cReady = false;
                };
                node.children[--i].onclick = function () {
                    collectionClick(this);
                };
                //pref
                const cm = (mode) => {
                    const bid = location.pathname.slice(3);
                    if (mode) {
                        let b = GM_getValue("blockarticleA");
                        if (b && Array.isArray(b)) {
                            for (const e of b) if (e.name === bid) return;
                        } else b = [];
                        const r = GM_getValue("removearticleA");
                        if (r && Array.isArray(r)) {
                            const i = r.indexOf(bid);
                            if (i > -1) {
                                r.splice(i, 1);
                                GM_setValue("removearticleA", r);
                            }
                        }
                        const info = {};
                        info.name = bid;
                        info.type = "article";
                        info.from = this.columnID;
                        info.update = Date.now();
                        info.userID = this.authorID;
                        info.userName = this.authorName;
                        b.push(info);
                        GM_setValue("blockarticleA", b);
                    } else {
                        let r = GM_getValue("removearticleA");
                        if (r && Array.isArray(r) && r.length > 0) {
                            if (r.includes(bid)) return;
                        } else r = [];
                        const b = GM_getValue("blockarticleA");
                        if (b && Array.isArray(b)) {
                            const i = b.findIndex((e) => e.name === bid);
                            if (i > -1) {
                                b.splice(i, 1);
                                GM_setValue("blockarticleA", b);
                            }
                        }
                        r.push(bid);
                        GM_setValue("removearticleA", r);
                    }
                };
                let pReady = false;
                const prefclick = (button, other, mode) => {
                    if (pReady) return;
                    pReady = true;
                    dataBaseInstance.TableName = "preference";
                    let title = "";
                    let f = false;
                    let cl = false;
                    if (other.style.display === "none") {
                        dataBaseInstance.dele(false);
                        title = `${mode ? "like" : "dislike"} this article`;
                        other.style.display = "block";
                        cl = mode;
                    } else {
                        const info = {};
                        info.pid = dataBaseInstance.pid;
                        info.update = Date.now();
                        info.userID = this.authorID;
                        info.from = this.columnID;
                        info.value = mode ? 1 : 0;
                        dataBaseInstance.update(info);
                        title = `cancel ${
                            mode ? "like" : "dislike"
                        } this article`;
                        other.style.display = "none";
                        f = !mode;
                    }
                    button.title = title;
                    !cl && cm(f);
                    pReady = false;
                };
                node.children[--i].onclick = (e) => {
                    const target = e.target;
                    const className = target.className;
                    if (className === "like")
                        prefclick(target, target.nextElementSibling, true);
                    else if (className === "dislike")
                        prefclick(target, target.previousElementSibling, false);
                };
            },
            recordID: null,
            dataRecord() {
                this.recordID && clearTimeout(this.recordID);
                this.recordID = setTimeout(() => {
                    this.recordID = null;
                    const pid = dataBaseInstance.pid;
                    dataBaseInstance.TableName = "collection";
                    dataBaseInstance.updateRecord(pid);
                    if (this.columnID) {
                        const f = GM_getValue("follow");
                        if (f && Array.isArray(f) && f.length > 0) {
                            for (const e of f) {
                                if (e.columnID === this.columnID) {
                                    e.visitTime = Date.now();
                                    let times = e.visitTimes;
                                    e.visitTimes = times ? ++times : 2;
                                    GM_setValue("follow", f);
                                    break;
                                }
                            }
                        }
                    }
                }, 15000);
            },
            reInject() {
                let assist = document.getElementById("assist-button-container");
                if (assist) {
                    assist.remove();
                    assist = null;
                }
                this.injectButton();
            },
            injectButton(mode) {
                const name = this.readerMode ? "Exit" : "Reader";
                const mbutton =
                    '<button class="assist-button siderbar" style="color: black;" title="show the siderbar">Menu</button>';
                createButton(
                    name,
                    (this.readerMode ? "exit " : "enter ") + "the reader mode",
                    mode ? mbutton : "",
                    "right"
                );
                this.assistNewModule
                    .main()
                    .then(
                        (node) => node && this.creatAssistantEvent(node, mode)
                    );
                this.dataRecord();
            },
            readerMode: false,
            createFrame() {
                if (this.columnID) {
                    this.Framework();
                    //const pinURL = `https://www.zhihu.com/api/v4/columns/${this.columnID}/pinned-items`;
                    const url = `https://www.zhihu.com/api/v4/columns/${this.columnID}/items`;
                    this.requestData(url);
                    this.Tabs.save(this.columnID);
                }
            },
            columnID: null,
            columnName: null,
            no_Article(mode) {
                const f = this.homePage.initial;
                if (f) {
                    this.columnID = this.homePage.ColumnID;
                    this.columnName = "Follow";
                    this.Framework();
                    Reflect.apply(this.homePage.add, this, [f, "f", false]);
                    mode === 1 && this.home_Module.home_DB_initial();
                } else
                    colorful_Console.main(
                        {
                            title: "warning",
                            content: "sidebar initiation failed",
                        },
                        colorful_Console.colors.warning
                    );
                return f;
            },
            main(mode = 0) {
                if (mode > 0) {
                    let f = false;
                    mode === 2
                        ? (window.onload = () => (
                              this.no_Article(mode), this.subscribeOrfollow()
                          ))
                        : (f = this.no_Article(mode));
                    return f;
                }
                if (this.ColumnDetail) {
                    if (this.readerMode)
                        this.Tabs.check(this.columnID).then((result) =>
                            result
                                ? this.injectButton(true)
                                : (this.createFrame(), this.injectButton())
                        );
                    else this.injectButton();
                } else this.injectButton();
                setTimeout(() => this.communication(), 5000);
            },
        },
        colorAssistant: {
            index: 0,
            arr: null,
            blue: true,
            grad: 5,
            get rgbRed() {
                this.index -= this.grad;
                if (this.index < 0 || this.index > 255) {
                    this.index = 0;
                    this.blue = true;
                    this.grad < 0 && (this.grad *= -1);
                }
                const s =
                    this.index > 233
                        ? 5
                        : this.index > 182
                        ? 4
                        : this.index > 120
                        ? 3
                        : this.index > 88
                        ? 2
                        : this.index > 35
                        ? 1
                        : 0;
                return `rgb(${this.index}, ${s}, 0)`;
            },
            redc: false,
            get rgbBlue() {
                this.index += this.grad;
                if (this.index > 255) {
                    this.blue = false;
                    if (this.redc) {
                        this.index = 0;
                        this.grad *= -1;
                        this.redc = false;
                    } else {
                        this.grad < 0 && (this.grad *= -1);
                        this.index = 255;
                        this.redc = true;
                    }
                }
                return `rgb(0, 0, ${this.index})`;
            },
            get textColor() {
                return this.blue ? this.rgbBlue : this.rgbRed;
            },
            setColor(text, color) {
                return `<colorspan class="color-node" style="color: ${color} !important;">${text}</colorspan>`;
            },
            setcolorGrad(tlength) {
                // according the length of string to set the color's gap
                this.grad =
                    tlength > 500
                        ? 1
                        : tlength > 300
                        ? 2
                        : tlength > 180
                        ? 3
                        : tlength > 120
                        ? 4
                        : tlength > 80
                        ? 5
                        : 6;
            },
            num: 0,
            textDetach(text) {
                // detach the text to single charactor
                this.setcolorGrad(text.length);
                const reg = /((\d+[\.-\/]\d+([\.-\/]\d+)?)|\d{2,}|[a-z]{2,})/gi;
                let result = null;
                let start = 0;
                let end = 0;
                let tmp = "";
                result = reg.exec(text);
                const numaColors = ["green", "#8B008B"];
                if (result) {
                    while (result) {
                        tmp = result[0];
                        end = reg.lastIndex - tmp.length;
                        for (start; start < end; start++)
                            this.arr.push(
                                this.setColor(text[start], this.textColor)
                            );
                        start = reg.lastIndex;
                        this.arr.push(this.setColor(tmp, numaColors[this.num]));
                        this.num = this.num ^ 1;
                        result = reg.exec(text);
                    }
                    end = text.length;
                    for (start; start < end; start++)
                        this.arr.push(
                            this.setColor(text[start], this.textColor)
                        );
                } else {
                    for (let t of text)
                        this.arr.push(this.setColor(t, this.textColor));
                }
            },
            nodeCount: 0,
            getItem(node) {
                // those tags will be ignored
                const localName = node.localName;
                const tags = [
                    "a",
                    "br",
                    "b",
                    "span",
                    "code",
                    "strong",
                    "u",
                    "sup",
                    "br",
                ];
                if (localName && tags.includes(localName)) {
                    this.arr.push(node.outerHTML);
                    this.nodeCount += 1;
                    return;
                } else {
                    const className = node.className;
                    if (className && className === "UserLink") {
                        this.arr.push(node.outerHTML);
                        this.nodeCount += 1;
                        return;
                    }
                }
                if (node.childNodes.length === 0) {
                    const text = node.nodeValue;
                    text && this.textDetach(text);
                } else {
                    // this is a trick, no traversal of textnode, maybe some nodes will lost content, take care
                    for (const item of node.childNodes) this.getItem(item);
                    this.arr.length > 0 &&
                        node.childNodes.length - this.nodeCount <
                            this.nodeCount + 2 &&
                        (node.innerHTML = this.arr.join(""));
                    this.arr = [];
                }
            },
            resetColor() {
                this.blue = !this.blue;
                this.index = this.blue ? 0 : 255;
            },
            codeHighlight(node) {
                const keywords = [
                    "abstract",
                    "arguments",
                    "await",
                    "boolean",
                    "break",
                    "byte",
                    "case",
                    "catch",
                    "char",
                    "class",
                    "const",
                    "continue",
                    "debugger",
                    "default",
                    "delete",
                    "do",
                    "double",
                    "else",
                    "enum",
                    "eval",
                    "export",
                    "extends",
                    "false",
                    "final",
                    "finally",
                    "float",
                    "for",
                    "function",
                    "goto",
                    "if",
                    "implements",
                    "import",
                    "in",
                    "instanceof",
                    "int",
                    "interface",
                    "let",
                    "long",
                    "native",
                    "new",
                    "null",
                    "package",
                    "private",
                    "protected",
                    "public",
                    "return",
                    "short",
                    "static",
                    "super",
                    "switch",
                    "synchronized",
                    "this",
                    "throw",
                    "throws",
                    "transient",
                    "true",
                    "try",
                    "typeof",
                    "var",
                    "void",
                    "volatile",
                    "while",
                    "with",
                    "yield",
                ];
                node.title = "Ctrl + Right mouse button to copy this code";
                const code = node.getElementsByClassName("language-text");
                if (code.length === 0 || code[0].childNodes.length > 1) return;
                let html = code[0].innerHTML;
                const reg = /(["'])(.+?)(["'])/g;
                const keyReg = /([a-z]+(?=[\s\(]))/g;
                const i = html.length;
                const h = (match, color) =>
                    `<hgclass class="hgColor" style="color:${color} !important;">${match}</hgclass>`;
                html = html.replace(
                    reg,
                    (e) => e[0] + h(e.slice(1, -1), "#FA842B") + e.slice(-1)
                );
                html = html.replace(keyReg, (e) => {
                    if (e && keywords.includes(e))
                        return h(e, "rgb(0, 0, 252)");
                    return e;
                });
                const Reg = /\/\//g;
                html = html.replace(Reg, (e) => h(e, "green"));
                i !== html.length && (code[0].innerHTML = html);
            },
            rightClickCopyCode: {
                checkCodeZone(target) {
                    if (target.className === "highlight") {
                        return target;
                    }
                    let p = target.parentNode;
                    let className = p.className;
                    let i = 0;
                    while (className !== "highlight") {
                        p = p.parentNode;
                        if (!p || i > 2) return null;
                        className = p.className;
                        i++;
                    }
                    return p;
                },
                exe(e) {
                    const code = this.checkCodeZone(e.target);
                    if (code) {
                        e.preventDefault();
                        zhihu.clipboardClear.clear(code.innerText);
                        Notification(
                            "this code has been copied to clipboard",
                            "clipboard"
                        );
                    }
                },
                main(node) {
                    //if directly use oncontextmenu, which will corrupt the mouse contextmenus
                    node.addEventListener(
                        "contextmenu",
                        (e) => e.button === 2 && e.ctrlKey && this.exe(e),
                        true
                    );
                },
            },
            main() {
                if (GM_getValue("nocolofultext")) return;
                let holder = document.getElementsByClassName(
                    "RichText ztext Post-RichText"
                );
                if (holder.length === 0) {
                    console.log("get content fail");
                    return;
                }
                holder = holder[0];
                // text is too long
                const t_length = holder.innerText.length;

                if (t_length < 9000) {
                    let code = false;
                    this.blue = Math.ceil(Math.random() * 100) % 2 === 0;
                    !this.blue && (this.index = 255);
                    const tags = ["p", "ul", "li", "ol", "blockquote"];
                    const textNode = [];
                    let i = -1;
                    for (const node of holder.childNodes) {
                        i++;
                        const type = node.nodeType;
                        //text node deal with separately
                        if (type === 3) {
                            textNode.push(i);
                            continue;
                        } else if (!tags.includes(node.tagName.toLowerCase())) {
                            //the continuity of content is interrupted, reset the color;
                            this.resetColor();
                            if (node.className === "highlight") {
                                this.codeHighlight(node);
                                code = true;
                            }
                            continue;
                        }
                        this.arr = [];
                        this.nodeCount = 0;
                        this.getItem(node);
                    }
                    i = textNode.length;
                    if (i > 0) {
                        for (i; i--; ) {
                            let node = holder.childNodes[textNode[i]];
                            const text = node.nodeValue;
                            if (text) {
                                this.arr = [];
                                this.textDetach(text);
                                const iNode =
                                    document.createElement("colorspan");
                                holder.insertBefore(iNode, node);
                                iNode.outerHTML = this.arr.join("");
                                node.remove();
                            }
                        }
                    }
                    this.arr = null;
                    code && this.rightClickCopyCode.main(holder);
                } else {
                    const codes = holder.getElementsByClassName("highlight");
                    if (codes.length > 0) {
                        for (const node of codes) this.codeHighlight(node);
                        this.rightClickCopyCode.main(holder);
                    }
                }
            },
        },
        userPage: {
            username: null,
            changeTitle(mode) {
                const title = document.getElementsByClassName(
                    "ProfileHeader-contentHead"
                );
                if (title.length === 0) return;
                title[0].style.textDecoration =
                    mode === "Block" ? "none" : "line-through";
            },
            userManage(mode) {
                let text = "";
                const info = {};
                if (mode === "Block") {
                    info.mode = "block";
                    blackName.push(this.username);
                    text = "add user to blackname successfully";
                } else {
                    info.mode = "unblock";
                    const i = blackName.indexOf(this.username);
                    i > -1 && blackName.splice(i, 1);
                    text = "remove user from blackname successfully";
                }
                info.username = this.username;
                GM_setValue("blacknamechange", info);
                GM_setValue("blackname", blackName);
                Notification(text, "blackName");
            },
            injectButton(name) {
                createButton(name, name + " this user");
                let assist = document.getElementById("assist-button-container");
                assist.children[1].onclick = (e) => {
                    const button = e.target;
                    const n = button.innerText;
                    this.userManage(n);
                    button.innerText = n === "Block" ? "unBlock" : "Block";
                    this.changeTitle(button.innerText);
                    this.title = button.innerText + " this user";
                };
                assist = null;
                name === "unBlock" && this.changeTitle(name);
            },
            changeButton(mode) {
                const button = document.getElementById(
                    "assist-button-container"
                );
                if (!button) return;
                const name = button.children[1].innerText;
                if ((mode && name === "unBlock") || (!mode && name === "Block"))
                    return;
                button.children[1].innerText = blackName.includes(this.name)
                    ? "unBlock"
                    : "Block";
            },
            main() {
                const profile =
                    document.getElementsByClassName("ProfileHeader-name");
                if (profile.length === 0) {
                    console.log("get usename id fail");
                    return;
                }
                const user = profile[0].innerText;
                if (!user) {
                    console.log("failed to get the user name");
                    return;
                }
                this.username = clear_zero_width(user);
                this.username &&
                    this.injectButton(
                        blackName.includes(this.username) ? "unBlock" : "Block"
                    );
            },
        },
        click_Highlight() {
            let h = GM_getValue("highlight");
            h = !h;
            GM_setValue("highlight", h);
            Notification(
                `the feature of "click to highlight content" has been ${
                    h ? "enable" : "disable"
                }`,
                "Tips"
            );
            this.Filter.colorIndicator.stat = h;
            !h && this.Filter.colorIndicator.restore();
        },
        key_ctrl_clip() {
            let c = GM_getValue("clipboard");
            c = !(c === false ? false : true);
            GM_setValue("clipboard", c);
            Notification(
                `the feature of "clipboard clear" has been ${
                    c ? "enable" : "disable"
                }`,
                "Tips"
            );
            this.clipboardClear.replace_ZH = c;
            return true;
        },
        _top_Picture: {
            display(p) {
                const i = document.getElementsByClassName("TitleImage");
                if (i.length === 0) return;
                i[0].style.display = p ? "none" : "block";
            },
            main() {
                let p = GM_getValue("topnopicture");
                p = !p;
                GM_setValue("topnopicture", p);
                this.display(p);
                Notification(
                    `${p ? "disable" : "enable"} top picture of article`,
                    "Tips"
                );
            },
        },
        key_ctrl_sync(mode) {
            GM_addValueChangeListener(
                "clipboard",
                (name, oldValue, newValue, remote) =>
                    remote && (this.clipboardClear.replace_ZH = newValue)
            );
            GM_addValueChangeListener(
                "clear_close",
                (name, oldValue, newValue, remote) =>
                    remote && newValue && window.close()
            );
            mode
                ? GM_addValueChangeListener(
                      "topnopicture",
                      (name, oldValue, newValue, remote) =>
                          remote && this._top_Picture.display(newValue)
                  )
                : GM_addValueChangeListener(
                      "highlight",
                      (name, oldValue, newValue, remote) =>
                          remote &&
                          ((this.Filter.colorIndicator.stat = newValue),
                          !newValue && this.Filter.colorIndicator.restore())
                  );
        },
        key_open_Reader(mode = false) {
            if (this.autoScroll.scrollState) return;
            const items = document.getElementsByClassName(
                "ContentItem AnswerItem"
            );
            const e = elementVisible.main(document.documentElement, items);
            e && this.qaReader.main(e, this.Filter.foldAnswer.getid(e), mode);
        },
        show_Total: {
            _common() {
                const c = colorful_Console.colors.info;
                let date = GM_getValue("installeddate");
                const script = GM_info.script;
                if (!date) {
                    date = Date.now();
                    GM_setValue("installeddate", date);
                }
                colorful_Console.main(
                    {
                        title: "JS Author:",
                        content: script.author,
                    },
                    c
                );
                colorful_Console.main(
                    {
                        title: "Current Version:",
                        content: script.version,
                    },
                    c
                );
                colorful_Console.main(
                    {
                        title: "Installed Date:",
                        content: new Date(date).toString(),
                    },
                    c
                );
                colorful_Console.main(
                    {
                        title: "LastModified:",
                        content: new Date(script.lastModified).toString(),
                    },
                    c
                );
                colorful_Console.main(
                    {
                        title: "Service Time:",
                        content:
                            "This JS has provided you with more than " +
                            ((Date.now() - date) / 1000 / 60 / 60 / 24).toFixed(
                                0
                            ) +
                            " Days of service",
                    },
                    c
                );
            },
            _zhuanlan(result) {
                const c = colorful_Console.colors.info;
                const title =
                    result.name === "collection"
                        ? "collected articles: "
                        : "like/dislike articles:";
                colorful_Console.main(
                    {
                        title: title,
                        content: result.count,
                    },
                    c
                );
            },
            _other(result) {
                const c = colorful_Console.colors.warning;
                colorful_Console.main(
                    { title: "Black Keywords:", content: blackKey.length },
                    c
                );
                colorful_Console.main(
                    { title: "Blocked Users:", content: blackName.length },
                    c
                );
                colorful_Console.main(
                    {
                        title: "Blocked Questions/Topics:",
                        content: blackTopicAndQuestion.length,
                    },
                    c
                );
                colorful_Console.main(
                    {
                        title: "Blocked Answers/Articles:",
                        content: result.count,
                    },
                    c
                );
            },
            main(mode) {
                if (!dataBaseInstance.db) return;
                dataBaseInstance
                    .getdataCount(
                        mode ? ["collection", "preference"] : ["foldedAnswer"]
                    )
                    .then((results) => {
                        results.forEach((e) =>
                            e.status !== "rejected" && mode
                                ? this._zhuanlan(e.value)
                                : this._other(e.value)
                        );
                        this._common();
                    });
            },
        },
        commander: {
            bgi: {
                bing_image(bgi, mode) {
                    return new Promise((resolve, reject) => {
                        let index = bgi.index || 0;
                        index += mode ? 1 : 0;
                        bgi.index = index > 7 ? 0 : index;
                        bgi.atime = Date.now();
                        const api = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${bgi.index}&n=1&pid=hp`;
                        xmlHTTPRequest(api).then(
                            (json) => resolve(json.images[0].url),
                            (err) => {
                                reject(null);
                                console.log(err);
                                Notification(
                                    "failed to get image from bing",
                                    "Warning"
                                );
                            }
                        );
                    });
                },
                timeID: null,
                auto_update(bgi) {
                    const a = bgi.atime;
                    if (a && Date.now() - a < 1000 * 60 * 60 * 24) {
                        bgi = null;
                        return;
                    }
                    this.timeID = setTimeout(() => {
                        bgi.index = 0;
                        this.timeID = null;
                        this._i(bgi, 0);
                    }, 3000);
                },
                name: "bgi_image",
                get get() {
                    return GM_getValue(this.name);
                },
                /**
                 * @param {object} v
                 */
                set set(v) {
                    GM_setValue(this.name, v);
                },
                get_base64_fileType(url) {
                    return url.slice(url.indexOf("/") + 1, url.indexOf(";"));
                },
                d() {
                    const bgi = this.get;
                    if (!bgi) return;
                    const url = Reflect.get(bgi, "url");
                    if (url) {
                        const reg = /\.(ico|gif|png|jpe?g)/;
                        let r = null;
                        let filename = "";
                        let m = false;
                        if (
                            url.startsWith("data:image") ||
                            (r = url.match(reg))
                        ) {
                            if (r) {
                                filename =
                                    "zhihu_bgi_image_" + Date.now() + r[0];
                            } else {
                                m = true;
                                filename =
                                    "zhihu_bgi_image_" +
                                    Date.now() +
                                    this.get_base64_fileType(url);
                            }
                        } else {
                            xmlHTTPRequest(url, 30000, "blob").then(
                                (blob) => {
                                    const file = new FileReader();
                                    file.readAsDataURL(blob);
                                    file.onload = (result) => {
                                        if (result.target.readyState === 2) {
                                            filename =
                                                "zhihu_bgi_image_" +
                                                Date.now() +
                                                this.get_base64_fileType(url);
                                            image_base64_download(
                                                result.target.result,
                                                filename
                                            );
                                        }
                                    };
                                    file.onerror = (e) => {
                                        console.log(e);
                                        Notification(
                                            "failed to convert file to base64",
                                            "Warning"
                                        );
                                    };
                                },
                                (err) => {
                                    console.log(err);
                                    Notification(
                                        "failed to donwload background image"
                                    );
                                }
                            );
                            return;
                        }
                        m
                            ? image_base64_download(url, filename)
                            : Download_module(url, filename, 30000).then(
                                  () =>
                                      colorful_Console.main(
                                          {
                                              title: "download:",
                                              content:
                                                  "download image successfully",
                                          },
                                          colorful_Console.colors.info
                                      ),
                                  (err) =>
                                      Notification(
                                          `fialed to download image; ${
                                              err ? `, ${err}` : ""
                                          }`,
                                          "Warning"
                                      )
                              );
                    }
                },
                /**
                 * @param {String} url
                 */
                set body_img(url) {
                    document.body.style.backgroundImage =
                        url === "none" ? "none" : `url(${url})`;
                },
                get is_body_image() {
                    return document.body.style.backgroundImage;
                },
                /**
                 * @param {string} base64
                 */
                set image_cache(base64) {
                    GM_setValue("fixed_image", base64);
                },
                dele_image_cache() {
                    GM_deleteValue("fixed_image");
                },
                f(cm) {
                    const bgi = this.get;
                    if (bgi && bgi.url && this.is_body_image) {
                        bgi.status = "fixed";
                        const reg = /\.(jpe?g|webp)/;
                        const m = bgi.url.match(reg);
                        if (m) {
                            const reg = /(?<=-f\s?)(0\.)?\d+(\.\d+)?/;
                            const mc = cm.match(reg);
                            let ro = 0;
                            const c_ratio = mc
                                ? (ro = mc[0] * 1) > 1
                                    ? 1
                                    : ro < 0.3
                                    ? 0.3
                                    : ro
                                : 0.3;
                            imageConvertor
                                .main(bgi.url, "webp", c_ratio)
                                .then((base64) => {
                                    this.body_img = base64;
                                    this.image_cache = base64;
                                    this.set = bgi;
                                    colorful_Console.main(
                                        {
                                            title: "cached image",
                                            content:
                                                "cached image successfully",
                                        },
                                        colorful_Console.colors.info
                                    );
                                    Notification(
                                        "change setup successfully",
                                        "Tips"
                                    );
                                }),
                                () => {
                                    colorful_Console.main(
                                        {
                                            title: "cached image",
                                            content:
                                                "failed to cache background iamge",
                                        },
                                        colorful_Console.colors.warning
                                    );
                                    Notification(
                                        "failed to set up image",
                                        "Warning",
                                        3500
                                    );
                                };
                        } else
                            Notification(
                                "compression does not support the format of current image",
                                "Tips",
                                3500
                            );
                    } else
                        Notification(
                            "you need set up background iamge firstly",
                            "Tips"
                        );
                },
                t() {
                    let bgi = this.get;
                    if (bgi) {
                        const at = bgi.atime;
                        const st = bgi.status;
                        if (at && bgi.url && st) {
                            if (
                                st === "auto" &&
                                Date.now() - at < 1000 * 60 * 60 * 24
                            ) {
                                bgi.status = "tmp";
                                !this.is_body_image &&
                                    (this.body_img = bgi.url);
                                this.set = bgi;
                                this.dele_image_cache();
                                return;
                            }
                        }
                    } else bgi = {};
                    this.bing_image(bgi).then((url) => {
                        this.body_img = bgi.url = `https://cn.bing.com${url}`;
                        bgi.status = "tmp";
                        this.set = bgi;
                        this.dele_image_cache();
                    });
                },
                s() {
                    const bgi = this.get;
                    if (!bgi) {
                        Notification(
                            "you need setup background image firstly",
                            "Tips"
                        );
                        return;
                    }
                    this.bing_image(bgi, true).then((url) => {
                        bgi.status = "auto";
                        this.body_img = bgi.url = `https://cn.bing.com${url}`;
                        this.set = bgi;
                        this.dele_image_cache();
                    });
                },
                r(type) {
                    const bgp = GM_getValue("bgpreader");
                    if (!bgp) {
                        Notification(
                            "you have not set up the backgorund iamge of reader"
                        );
                        return;
                    }
                    const bgi = this.get || {};
                    bgi.status = type === true ? "tmp" : "reader";
                    this.set = bgi;
                    this.body_img = bgp;
                    this.dele_image_cache();
                },
                o() {
                    this.body_img = "none";
                    GM_deleteValue(this.name);
                    this.dele_image_cache();
                },
                //type -tmp
                u(cm, type) {
                    const m = cm.match(/https.+(?=\s)?/g);
                    if (!m) {
                        Notification(
                            "your image url does not match rule",
                            "Warning"
                        );
                        return;
                    }
                    const url = m[0];
                    const bgi = this.get || {};
                    bgi.status = type ? "tmp" : "self";
                    bgi.url = url;
                    this.set = bgi;
                    this.body_img = url;
                    this.dele_image_cache();
                },
                _i(bgi, index) {
                    this.bing_image(bgi, index).then((url) => {
                        bgi.status = "auto";
                        this.body_img = bgi.url = `https://cn.bing.com${url}`;
                        this.set = bgi;
                        bgi = null;
                        this.dele_image_cache();
                    });
                },
                i() {
                    let bgi = this.get;
                    if (bgi) {
                        const at = bgi.atime;
                        if (at) {
                            const url = bgi.url;
                            if (url && Date.now() - at > 1000 * 60 * 60 * 24) {
                                bgi.status = "auto";
                                !this.is_body_image && (this.body_img = url);
                                this.set = bgi;
                                this.dele_image_cache();
                                return;
                            }
                        }
                    } else bgi = {};
                    bgi.index = 0;
                    this._i(bgi, 0);
                },
                no_match_tips() {
                    Notification(
                        "please check the command, which does not match the rule",
                        "Warning"
                    );
                },
                cm_format(cm) {
                    this.timeID && clearTimeout(this.timeID);
                    cm = cm.slice(3);
                    if (cm) {
                        const reg = /(?<=\s-)[tosdfur]/g;
                        const m = cm.match(reg);
                        if (!m) {
                            this.no_match_tips();
                            return;
                        }
                        if (m.length === 1) this[m[0]](cm);
                        else {
                            const arr = [...new Set(m)];
                            const i = arr.length;
                            if (i === 1) this[arr[0]](cm);
                            else if (i > 2) this.no_match_tips();
                            else {
                                //only use -t this paramter with -u or -t
                                let f = arr.indexOf("t");
                                if (f < 0) {
                                    this.no_match_tips();
                                    return;
                                }
                                const cn = f === 0 ? arr[1] : arr[0];
                                if (!(cn === "u" || cn === "r")) {
                                    this.no_match_tips();
                                    return;
                                }
                                this[cn](cm, true);
                            }
                        }
                    } else this.i();
                },
                main(cm, index) {
                    index > 3
                        ? Notification(
                              "current webpage does not support this feature",
                              "Tips"
                          )
                        : this.cm_format(cm);
                },
            },
            fold: {
                main() {
                    return "Button ContentItem-action ContentItem-rightButton Button--plain";
                },
            },
            expand: {
                main(index) {
                    return index > 1
                        ? "Button ContentItem-more Button--plain"
                        : "Button ContentItem-rightButton ContentItem-expandButton Button--plain";
                },
            },
            f_e: {
                c(item, name) {
                    const button = item.getElementsByClassName(name);
                    button.length > 0 && button[0].click();
                },
                main(name) {
                    const buttons = document.body.getElementsByClassName(name);
                    if (buttons.length < 6) {
                        let i = buttons.length;
                        for (i; i--; ) buttons[i].click();
                        return;
                    }
                    const items = document.body.getElementsByClassName(
                        "ContentItem AnswerItem"
                    );
                    let i = items.length;
                    if (i === 0) return;
                    else if (i < 6) {
                        for (i; i--; ) this.c(items[i], name);
                    } else {
                        let index = 0;
                        for (const item of items) {
                            if (
                                elementVisible.main(
                                    document.documentElement,
                                    item
                                )
                            )
                                break;
                            index++;
                        }
                        let start = index - 2;
                        start < 0 && (start = 0);
                        let end = start + 4;
                        if (end > --i) {
                            start = start - (end - i);
                            end = i;
                        }
                        start--;
                        for (end; end > start; end--) this.c(items[end], name);
                    }
                },
            },
            light: {
                get cover() {
                    return document.getElementById("screen_shade_cover");
                },
                set_opacity(co, v) {
                    co.style.opacity = v;
                },
                set_color(co, c) {
                    co.style.background = c;
                },
                /**
                 * @param {any} v
                 */
                set set(v) {
                    GM_setValue(this.name, v);
                },
                name: "tmp_cover",
                get get() {
                    return GM_getValue(this.name);
                },
                a(cm, tc) {
                    tc.status = "a";
                    return true;
                },
                item_no_match(name) {
                    Notification(
                        `the format of ${name} does not match rule`,
                        "Tips"
                    );
                },
                c(cm, tc, co) {
                    const reg = /#\w{3,6}/;
                    const m = cm.match(reg);
                    if (!m) {
                        this.item_no_match("color");
                        return false;
                    }
                    this.set_color(co, m[0]);
                    tc.color = m[0];
                    return true;
                },
                o(cm, tc, co) {
                    const reg = /(?<=-o\s?)(0\.)?\d+(\.\d+)?/;
                    const m = cm.match(reg);
                    if (!m) {
                        this.item_no_match("opacity");
                        return false;
                    }
                    let v = m[0] * 1;
                    v > 1 && (v = 1);
                    this.set_opacity(co, v);
                    tc.opacity = v;
                    return true;
                },
                t(cm, tc) {
                    const reg = /(?<=-t\s?)(0\.)?\d+(\.\d+)?/;
                    const m = cm.match(reg);
                    if (!m) {
                        this.item_no_match("time");
                        return false;
                    }
                    let v = m[0] * 1;
                    v > 24 && (v = 24);
                    tc.rtime = v * 60 * 60 * 1000;
                    return true;
                },
                _s(funcs, cm, type) {
                    const c = this.cover;
                    if (!c) {
                        Notification(
                            "the dom of cover has been removed",
                            "Tips"
                        );
                        return;
                    }
                    const tc = {};
                    tc.status = type ? "a" : "s";
                    tc.update = Date.now();
                    funcs.forEach((e) => this[e](cm, tc, c));
                    type && this.set_sync(funcs, tc);
                },
                set_o(tc) {
                    GM_setValue("opacity", tc.opacity);
                },
                set_c(tc) {
                    GM_setValue("color", tc.color);
                },
                set_sync(funcs, tc) {
                    funcs.forEach((e) => {
                        const n = this[`set_${e}`];
                        n && n(tc);
                    });
                    this.set = tc;
                },
                no_match_tips() {
                    Notification(
                        "please check the command, which does not match the rule",
                        "Warning"
                    );
                },
                cm_format(cm) {
                    cm = cm.slice("light".length);
                    this._is_single = true;
                    if (cm) {
                        const reg = /(?<=\s-)[acot]/g;
                        const m = cm.match(reg);
                        if (!m) {
                            this.no_match_tips();
                            return;
                        }
                        const arr = [...new Set(m)];
                        const a = arr.includes("a");
                        const t = arr.includes("t");
                        const i = arr.length;
                        if ((t && !a) || i > 3 || (i === 1 && (a || t))) {
                            this.no_match_tips();
                            return;
                        }
                        this._s(arr, cm, a);
                        this._is_single = !a;
                    }
                },
                _is_single: false,
                main(cm) {
                    this.cm_format(cm);
                },
            },
            last_time_cm: "",
            help: {
                a() {
                    const ts = Object.values(Assist_info_URL);
                    ts.forEach(
                        (a, index) =>
                            (a.includes("meituan") || a.endsWith(".md")) &&
                            setTimeout(() =>
                                GM_openInTab(
                                    a,
                                    { insert: true, active: true },
                                    index * 300
                                )
                            )
                    );
                },
                i() {
                    GM_openInTab(Assist_info_URL.cmd_help, {
                        insert: true,
                        active: true,
                    });
                },
                main(cm) {
                    cm = cm.slice(4);
                    if (cm) {
                        const reg = /\s-a/;
                        cm.match(reg) && this.a();
                    }
                    this.i();
                },
            },
            reset: {
                get_confirm(name) {
                    return confirm(`are you sure want to clear the ${name}`);
                },
                get_warning(name) {
                    if (!this.get_confirm(name)) return false;
                    return confirm(
                        "this operation will clear your important data, continue?"
                    );
                },
                get close_confirm() {
                    return confirm(
                        "this operation needs close other tab(page) of zhihu, continue?"
                    );
                },
                success() {
                    Notification("operation is completed", "Tips");
                },
                c() {
                    if (!this.get_confirm("cookie")) return;
                    const c = document.cookie;
                    if (c) {
                        const keys = c.match(/[^ =;]+(?=\=)/g);
                        if (keys) {
                            const domains = [
                                ".zhihu.com",
                                "www.zhihu.com",
                                "zhuanlan.zhihu.com, api.zhihu.com",
                            ];
                            keys.forEach((e) =>
                                domains.forEach(
                                    (d) =>
                                        (document.cookie =
                                            e +
                                            `=0; expires=Sat, 4 Jun 1989 12:00:00 GMT; path=/; domain=${d}`)
                                )
                            );
                        }
                    }
                    this.success();
                },
                s() {
                    if (!this.get_confirm("sessionStorage")) return;
                    sessionStorage.clear();
                    this.success();
                },
                l() {
                    if (!this.get_confirm("localStorage")) return;
                    localStorage.clear();
                    this.success();
                },
                alert() {
                    alert("current webpage need restart");
                    GM_setValue("clear_close", false);
                    setTimeout(() => window.close(), 50);
                },
                is_d: false,
                is_close: false,
                close_sync() {
                    GM_setValue("clear_close", true);
                    this.is_close = true;
                },
                d() {
                    if (
                        !this.get_warning("IndexedDB") ||
                        (!this.is_close && !this.close_confirm)
                    )
                        return;
                    !this.is_close && this.close_sync();
                    this.is_d = true;
                    setTimeout(() => {
                        dataBaseInstance.close();
                        setTimeout(() => Database.deleDB("zhihuDatabase"), 300);
                    }, 300);
                    this.success();
                },
                is_t: false,
                t() {
                    if (
                        !this.get_warning("Tampermonkey") ||
                        (!this.is_close && !this.close_confirm)
                    )
                        return;
                    !this.is_close && this.close_sync();
                    this.is_t = true;
                    const items = GM_listValues();
                    items &&
                        setTimeout(
                            () => items.forEach((e) => GM_deleteValue(e)),
                            300
                        );
                    this.success();
                },
                fail() {
                    Notification("your cmd does not match the rule", "Tips");
                },
                main(cm) {
                    cm = cm.slice(5);
                    if (cm) {
                        const reg = /(?<=\s-)[sldtc]/g;
                        const m = cm.match(reg);
                        m
                            ? [...new Set(m)].forEach((e) => this[e]())
                            : this.fail();
                        (this.is_d || this.is_t) &&
                            setTimeout(
                                () => this.alert(),
                                this.is_d ? 1200 : 300
                            );
                        this.is_t = this.is_d = false;
                    } else this.fail();
                },
            },
            monkey: {
                get eid() {
                    const id = GM_getValue("monkey_id");
                    if (id) return id;
                    const ua = this.ua;
                    ua.includes("Edg")
                        ? "iikmkjmpaadaobahmlepeloendndfphd"
                        : ua.includes("Chrome")
                        ? "dhdgffkkebhmkfjojejmpbldmpobfkfo"
                        : "";
                },
                get ua() {
                    return navigator.userAgent;
                },
                get uuid() {
                    return GM_info.script.uuid;
                },
                set eid(eid) {
                    GM_setValue("monkey_id", eid);
                    Notification("set eid successfully", "Tips");
                },
                open(url, mode) {
                    GM_openInTab(
                        url,
                        mode ? { insert: true } : { insert: true, active: true }
                    );
                },
                notice() {
                    this.open("chrome://extensions/", true);
                    alert("you need set the id of tampermonkey firstly");
                },
                fail() {
                    Notification("your cmd does not match the rule", "Tips");
                },
                i() {
                    const eid = this.eid;
                    eid
                        ? this.open(`chrome-extension://${eid}/options.html`)
                        : this.notice();
                },
                e(cm) {
                    const reg = /[a-z]{32}/;
                    const m = cm.match(reg);
                    m ? (this.eid = m[0]) : this.fail();
                },
                s() {
                    const eid = this.eid;
                    eid
                        ? this.open(
                              `chrome-extension://${eid}/options.html#nav=${this.uuid}+storage`
                          )
                        : this.notice();
                },
                o() {
                    const eid = this.eid;
                    eid
                        ? this.open(
                              `chrome-extension://${eid}/options.html#nav=settings`
                          )
                        : this.notice();
                },
                main(cm) {
                    cm = cm.slice(6);
                    if (cm) {
                        const reg = /(?<=\s-)[soe]/g;
                        const m = cm.match(reg);
                        !m || m.length > 1
                            ? this.fail()
                            : m[0] === "e"
                            ? this.e(cm)
                            : this[m[0]]();
                    } else this.i();
                },
            },
            main(index) {
                let cm = prompt(
                    "please input cmd string, e.g.:$+ fold, ligth, expand, bgi, reset, help",
                    this.last_time_cm || "$"
                );
                if (!cm || cm.length < 2 || !(cm = cm.trim()) || cm[0] !== "$")
                    return true;
                cm = cm.slice(1).toLowerCase().trim();
                if (!cm) return true;
                const cms = [
                    "bgi",
                    "light",
                    "help",
                    "reset",
                    "monkey",
                    "fold",
                    "expand",
                ];
                const r = cms.findIndex((e) => cm.startsWith(e));
                r < 0
                    ? this.reset.fail()
                    : r < 5
                    ? this[cms[r]].main(cm, index)
                    : index > 3
                    ? Notification(
                          "current webpage does not support this feature",
                          "Tips"
                      )
                    : this.f_e.main(this[cms[r]].main(index));
                this.last_time_cm = `$${cm}`;
                return true;
            },
        },
        //the origin keyboard event of zhihu
        key_conflict(keyCode, shift) {
            return 68 === keyCode || (shift && [71, 85].includes(keyCode));
        },
        common_KeyEevnt(shift, keyCode, index = -1) {
            /*
            open user manual webpage;
            open shortcuts webpage;
            enable/disable convert chinese letter to english letter;
            multi search;
            white noise control
            */
            if (shift) {
                const url =
                    keyCode === 85
                        ? Assist_info_URL.usermanual
                        : keyCode === 75
                        ? Assist_info_URL.shortcuts
                        : keyCode === 69
                        ? this.key_ctrl_clip()
                        : keyCode === 77
                        ? this.multiSearch.site()
                        : keyCode === 87
                        ? index !== 9 && this.white_noise.destroy_audio()
                        : keyCode === 86
                        ? this.white_noise.audio_ctrl.play_pause()
                        : keyCode === 187
                        ? this.white_noise.audio_ctrl.voice_up_down(true)
                        : keyCode === 189
                        ? this.white_noise.audio_ctrl.voice_up_down(false)
                        : keyCode === 90
                        ? this.white_noise.change_music(true)
                        : keyCode === 88
                        ? "https://zhuanlan.zhihu.com/"
                        : keyCode === 81
                        ? (this.commander.main(index) &&
                              (this.shade.sing_protect =
                                  this.commander.light._is_single)) ||
                          true
                        : null;
                if (url) {
                    typeof url === "string" &&
                        GM_openInTab(url, { insert: true, active: true });
                    return true;
                }
            }
            return false;
        },
        auto_load_Reader: {
            get setup() {
                return GM_getValue("autoloadreader");
            },
            get nsetup() {
                return GM_getValue("nursereader");
            },
            main() {
                let a = this.setup;
                a = !a;
                GM_setValue("autoloadreader", a);
                Notification(
                    a
                        ? "enabled automatic reading mode successfully"
                        : "has diabled automatic reading mode",
                    "Tips"
                );
            },
            nurse() {
                let n = this.nsetup;
                n = !n;
                GM_setValue("nursereader", n);
                Notification(
                    n
                        ? "enabled nurse reading mode successfully"
                        : "has diabled automatic nurse reading mode",
                    "Tips"
                );
            },
            timeID: null,
            cancel() {
                clearTimeout(this.auto_load_Reader.timeID);
                this.Filter.auto_load_reader = false;
                this.auto_load_Reader.timeID = null;
            },
            start(mode) {
                Notification(
                    "5s, automatically load reader page; click to cancel",
                    "Tips",
                    5000,
                    this.auto_load_Reader.cancel.bind(this)
                );
                this.auto_load_Reader.timeID = setTimeout(() => {
                    this.Filter.auto_load_reader = false;
                    this.auto_load_Reader.timeID = null;
                    this.key_open_Reader(mode);
                }, 5300);
                this.Filter.auto_load_reader = true;
            },
        },
        QASkeyBoardEvent(index) {
            /*
            when in autoloaded reader mode, block keyevent if the autoloaded is progressing;
            */
            document.addEventListener(
                "keydown",
                (e) => {
                    if (
                        e.ctrlKey ||
                        e.altKey ||
                        e.target.localName === "input" ||
                        this.auto_load_Reader.timeID
                    )
                        return;
                    const className = e.target.className;
                    if (
                        className &&
                        typeof className === "string" &&
                        className.includes("DraftEditor")
                    )
                        return;
                    const shift = e.shiftKey;
                    const keyCode = e.keyCode;
                    if (this.key_conflict(keyCode, shift)) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    if (this.common_KeyEevnt(shift, keyCode, index)) return;
                    const r = this.qaReader.readerMode;
                    r
                        ? this.qaReader.keyEvent(keyCode, shift)
                        : shift
                        ? keyCode === 72
                            ? this.click_Highlight()
                            : keyCode === 82
                            ? index < 2 && this.key_open_Reader(false)
                            : keyCode === 66
                            ? index < 9 &&
                              !this.autoScroll.scrollState &&
                              MangeData.exportData.main(true)
                            : keyCode === 73
                            ? index < 9 &&
                              !this.autoScroll.scrollState &&
                              MangeData.importData.main(false)
                            : keyCode === 68
                            ? index < 2 && this.auto_load_Reader.main()
                            : keyCode === 78
                            ? index < 2 && this.auto_load_Reader.nurse()
                            : null
                        : keyCode === 192
                        ? (this.autoScroll.start(),
                          (this.Filter.is_scroll_state =
                              this.autoScroll.scrollState))
                        : keyCode === 187
                        ? this.autoScroll.speedUP()
                        : keyCode === 189
                        ? this.autoScroll.slowDown()
                        : keyCode === 78
                        ? !this.autoScroll.scrollState &&
                          this.turnPage.start(true)
                        : keyCode === 84
                        ? !this.autoScroll.scrollState && this.scroll.toTop()
                        : keyCode === 82
                        ? index < 2 &&
                          location.pathname.includes("/answer/") &&
                          !this.autoScroll.scrollState &&
                          this.scroll.toBottom()
                        : keyCode === 85
                        ? !this.autoScroll.scrollState &&
                          this.turnPage.start(false)
                        : this.multiSearch.main(keyCode);
                },
                true
            );
        },
        right_click_F_E: {
            get_contentNode(node) {
                return node.className === "ContentItem AnswerItem"
                    ? node
                    : node.parentNode.parentNode;
            },
            fold_item(node, className) {
                const button =
                    this.get_contentNode(node).getElementsByClassName(
                        className
                    );
                button.length > 0 && button[0].click();
            },
            get_m_node(node) {
                const tmp = node.getElementsByClassName("RichContent-inner");
                return tmp.length === 0 ? null : tmp[0];
            },
            button_display(node, mode) {
                const b = this.get_button(node);
                b && (b.style.display = mode ? "block" : "none");
            },
            zhuanlan_fold(node) {
                const m = this.get_m_node(node);
                if (m) {
                    m.style.maxHeight = "400px";
                    m.parentNode.className =
                        "RichContent is-collapsed RichContent--unescapable";
                    this.button_display(node, true);
                }
            },
            load_lazy_img(node) {
                const imgs = node.getElementsByTagName("img");
                for (const i of imgs) {
                    if (i.currentSrc.startsWith("data:image/svg")) {
                        const src = i.dataset.original || i.dataset.actualsrc;
                        src && (i.src = src);
                    }
                }
            },
            get_button(node) {
                const button = node.getElementsByClassName(
                    "Button ContentItem-rightButton ContentItem-expandButton Button--plain"
                );
                return button.length === 0 ? null : button[0];
            },
            zhuanlan_expand(node, mode) {
                const m = this.get_m_node(node);
                if (m) {
                    m.removeAttribute("style");
                    m.parentNode.className =
                        "RichContent RichContent--unescapable";
                    !mode && this.load_lazy_img(node);
                    this.button_display(node, false);
                }
            },
            zhuanlan_E_F(p) {
                let node = this.get_contentNode(p);
                node.className !== "ContentItem AnswerItem" &&
                    (node = node.parentNode);
                const tmp = node.dataset.is_show;
                tmp
                    ? this.zhuanlan_fold(node)
                    : tmp === false
                    ? this.zhuanlan_expand(node, true)
                    : this.zhuanlan_expand(node, false);
                node.dataset.is_show = !tmp;
                tmp && node.parentNode.scrollIntoView();
            },
        },
        rightMouse_OpenQ(index) {
            //open the specific url in search webpage or topic webpage directly
            document.oncontextmenu = (e) => {
                if (e.shiftKey) {
                    const pt = e.path;
                    let i = 0;
                    for (const p of pt) {
                        let cn = "";
                        if (p.localName === "a") {
                            const pos = ["/answer/", "/topic/"];
                            const index = pos.findIndex((o) =>
                                p.pathname.includes(o)
                            );
                            if (index > -1) {
                                e.preventDefault();
                                const href = p.href;
                                GM_openInTab(
                                    index === 0
                                        ? href.slice(
                                              0,
                                              href.lastIndexOf(pos[index])
                                          )
                                        : `${href}/top-answers`,
                                    {
                                        insert: true,
                                        active: true,
                                    }
                                );
                            }
                            break;
                        } else if ((cn = p.className) && cn) {
                            if (this.qaReader.readerMode) return;
                            if (
                                cn ===
                                    "RichText ztext CopyrightRichText-richText" ||
                                cn === "ContentItem AnswerItem"
                            ) {
                                e.preventDefault();
                                index === 9
                                    ? this.right_click_F_E.zhuanlan_E_F(p)
                                    : this.right_click_F_E.fold_item(
                                          p,
                                          this.commander.fold.main()
                                      );
                                break;
                            } else if (
                                cn.endsWith(
                                    "Button--withIcon Button--withLabel"
                                )
                            ) {
                                e.preventDefault();
                                break;
                                if (index < 2) {
                                }
                            }
                        } else if (i > 6) break;
                        i++;
                    }
                } else if (e.ctrlKey)
                    this.colorAssistant.rightClickCopyCode.exe(e);
            };
        },
        original_status: false,
        visible_time_id: null,
        visibleChange(mode) {
            /*
            switch the webpage(tab), control(start or pause the scroll) the scroll state
            */
            this.visible_time_id && clearTimeout(this.visible_time_id);
            if (this.qaReader.readerMode) {
                if (mode) {
                    this.original_status = this.qaReader.autoScroll.scrollState;
                    this.original_status &&
                        this.qaReader.autoScroll.stopScroll(false);
                } else if (this.original_status) {
                    this.visible_time_id = setTimeout(() => {
                        this.visible_time_id = null;
                        this.qaReader.autoScroll.keyCount = 2;
                        this.qaReader.autoScroll.start();
                    }, 300);
                }
            } else {
                if (mode) {
                    this.original_status = this.autoScroll.scrollState;
                    this.original_status && this.autoScroll.stopScroll(false);
                } else if (this.original_status) {
                    this.visible_time_id = setTimeout(() => {
                        this.visible_time_id = null;
                        this.autoScroll.keyCount = 2;
                        this.autoScroll.start();
                    }, 600);
                }
            }
        },
        Filter_Reader_sync() {
            this.qaReader.readerMode && (this.qaReader.scroll_record += 3);
        },
        hide_search_sync(filter) {
            let b = this.searchPage.is_simple_search;
            Object.defineProperty(this.searchPage, "is_simple_search", {
                enumerable: true,
                configurable: true,
                set(v) {
                    filter.is_simple_search = b = v;
                },
                get() {
                    return b;
                },
            });
            return b;
        },
        add_reader_button() {
            const html = `
                <i
                    class="reader_mode_ico"
                    title="open current answer in reader mode"
                    style="
                        content: url(data:image/webp;base64,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);
                        right: 10%;
                        width: 45px;
                        height: 55px;
                        position: fixed;
                        bottom: 12%;
                    "
                ></i>`;
            document.body.insertAdjacentHTML("beforeend", html);
            setTimeout(
                () =>
                    (document.body.getElementsByClassName(
                        "reader_mode_ico"
                    )[0].onclick = () =>
                        !this.auto_load_Reader.timeID &&
                        this.key_open_Reader()),
                0
            );
        },
        pageOfQA(index, href) {
            //inject as soon as possible; maybe, need to concern about some conflict between eventlisteners and MutationObserver
            this.addStyle(index);
            this.clearStorage();
            window.onload = () => {
                if (index !== 8) {
                    this.getData();
                    this.blackUserMonitor(index);
                    (index < 4
                        ? !(index === 1 && href.endsWith("/waiting"))
                        : false) &&
                        setTimeout(() => {
                            this.Filter.is_simple_search =
                                this.searchPage.is_simple_search;
                            this.Filter.main(
                                index,
                                this.Filter_Reader_sync.bind(this)
                            );
                            this.QASkeyBoardEvent(index);
                            setTimeout(
                                () => this.show_Total.main(false),
                                30000
                            );
                            this.key_ctrl_sync(false);
                            this.rightMouse_OpenQ(index);
                            index < 2
                                ? setTimeout(() => {
                                      this.add_reader_button();
                                      let n = false;
                                      ((n = this.auto_load_Reader.nsetup) ||
                                          this.auto_load_Reader.setup) &&
                                          this.auto_load_Reader.start.call(
                                              this,
                                              n
                                          );
                                  }, 300)
                                : index === 3 &&
                                  (this.searchPage.main(),
                                  this.hide_search_sync(this.Filter));
                            this.body_img_update &&
                                this.commander.bgi.auto_update(
                                    this.body_img_update
                                );
                        }, 100);
                    (index === 6 || index === 7) && this.userPage.main();
                }
                this.inputBox.monitor(
                    index,
                    index < 4 ? this.visibleChange.bind(this) : null
                );
            };
        },
        blackUserMonitor(index) {
            GM_addValueChangeListener(
                "blackname",
                (name, oldValue, newValue, remote) => {
                    if (!remote) return;
                    //mode => add user to blockname
                    blackName = newValue;
                    if (index === 6 || index === 7) {
                        const mode =
                            !oldValue || oldValue.length < newValue.length;
                        this.userPage.changeButton(mode);
                    } else this.Filter.userChange(index);
                }
            );
        },
        pre_Check(content) {
            blackKey.some((e) => content.includes(e)) &&
                confirm(
                    "The link you are currently visiting contains rubbish, close the tab?"
                ) &&
                window.close();
        },
        remove_noise(href) {
            const tmp = href.slice(href.lastIndexOf("com/") + 4);
            if (tmp && !tmp.includes("/")) {
                const noise = ["?", "#"];
                const arr = noise.map((e) => href.lastIndexOf(e));
                const index = Math.min(...arr);
                if (index > 0) return href.slice(0, index);
            }
            return href;
        },
        start() {
            let href = location.href;
            const excludes = ["/write", "/api/", "/api"];
            if (excludes.some((e) => href.includes(e))) return;
            fetch_intercept.initial();
            this.anti_setInterval();
            const search = location.search;
            search &&
                search.length > 2 &&
                this.pre_Check(decodeURIComponent(search));
            const includes = [
                "/answer/",
                "/question/",
                "/topic/",
                "/search",
                "/column",
                "/zhuanlan",
                "/people/",
                "/org/",
                "/www",
            ];
            const index = includes.findIndex((e) => href.includes(e));
            let z = false;
            let f = false;
            (
                (z = index === 5) && (href = this.remove_noise(href))
                    ? (!(f = href.endsWith("zhihu.com/")) &&
                          this.pre_Check(document.title)) ||
                      z
                    : index === 4
            )
                ? this.zhuanlanStyle(z && href.includes("/p/") ? 0 : f ? 1 : 2)
                : (this.pre_Check(document.title), this.pageOfQA(index, href));
            this.antiRedirect();
            this.antiLogin();
            this.shade.start();
            setTimeout(() => !this.is_delayed && (this.hasLogin = true), 15000);
            this.clipboardClear.event();
            setTimeout(() => installTips.main(), 3000);
        },
    };
    zhihu.start();
})();
