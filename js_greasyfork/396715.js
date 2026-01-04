// ==UserScript==
// @name         小宇宙控制台
// @namespace    https://www.weibo.com/timeline4arthur
// @version      0.4.6
// @description  try to take over the world!
// @author       timeline4arthur
// @match        https://m.weibo.cn/*
// @match        https://s.weibo.com/*
// @match        https://weibo.com/*
// @match        https://api.weibo.com/chat*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/396715/%E5%B0%8F%E5%AE%87%E5%AE%99%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396715/%E5%B0%8F%E5%AE%87%E5%AE%99%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_addStyle(`
    .lite-menu-box {
        position: fixed;
        overflow: hidden;
        top: 3.8rem;
        right: .35rem;
        z-index: 9999;
    }
    .lite-menu {
        height: 50px;
        width: 50px;
        background-image: url('data:image/png;base64,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')
    }
    .lite-btn {
        font-size: .6875rem;
        height: 1.8rem;
        line-height: 1.8rem;
        text-align: center;
        background: white;
        border: 1px solid #c8c8c8;
    }
    .lite-dialog {
        position: fixed;
        width: 300px;
        height: 400px;
        top: 50%;
        left: 50%;
        margin-top: -200px;
        margin-left: -150px;
        background: white;
        border: 1px solid #c8c8c8;
        z-index: 996;
        text-align:center;
    }
    .lite-dialog-top {
        margin: 4px;
        margin-top: 5%;
    }
    .lite-dialog-textarea {
        width: 88%;
        height: 280px;
    }
    .lite-dialog-input {
        width: 88%;
    }
    .lite-dialog-btn {
        margin: 4px;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .highlight-liked {
        background-color: #99cf99;
    }
    .highlight-like {
        background-color: #cf9999;
    }
    .arthur-sub-cmt {
        background-color: #9999cf;
    }
    .s-color-aqua {
        background-color: aqua;
    }
    `);

    const keyWords = ["厌", "逼", "恶", "婊", "压番", "耽丑", "卖腐", "麦麸",
        "美国", "夜店", "水烟", "红利", "资源", "太子", "捧", "捶", "女", "团队",
        "娜瑟", "娜娜", "oynn", "王一博", "wyb", "吴亦凡", "wyf", "签", "cp",
        "张静仪", "zjy", "王鹤棣", "whd", "河堤"];
    const dataSourceGroup = "反黑组";
    let names = GM_getValue(dataSourceGroup, { qz: [], timestamp: 0 }).qz;
    console.log("names: ", names.length);
    //const uid = [6416499365, 6193512424, 7304960691];
    const like2Comment = function () {
        const likes = document.getElementsByClassName("timeline4arthur");
        const n = likes.length;
        let count = 0;
        document.getElementById("log_btn").innerHTML = count + "/" + n;
        for (let i = 0; i < n; i++) {
            setTimeout(function () {
                count++;
                document.getElementById("log_btn").innerHTML = count + "/" + n;
                console.log(count + "/" + n);
                likes[0].click();
                likes[0].classList.remove("timeline4arthur");
                num--;

                //finished
                if (i == n - 1) refresh4Comment();
            }, i * (Math.floor(Math.random() * 2) + 2) * 1000); //2-4秒
        }
    }

    let copy_cmt_url_flag = false;
    let copy_cmt_url_index = 0;
    let sub_cmt_urls = [];
    let sub_cmts = [];
    const getCommentsUrl = function () {
        copy_cmt_url_flag = true;
        sub_cmts = document.getElementsByClassName("arthur-sub-cmt");
        copyCmtUrlNext(0);
    }
    const copyCmtUrlNext = function () {
        if (copy_cmt_url_flag && copy_cmt_url_index < sub_cmts.length) {
            console.log('copy cmt url', copy_cmt_url_index);
            setTimeout(function () {
                sub_cmts[copy_cmt_url_index].click();
            }, 1000);
        } else {
            console.log(sub_cmt_urls);
            const text = document.getElementById("text-msg-box");
            text.value = sub_cmt_urls.join("\n");
            visi("div-msg-box");
            copy_cmt_url_flag = false;
            copy_cmt_url_index = 0;
            sub_cmt_urls = [];
            sub_cmts = [];
        }
    }

    let num = 0;
    const refresh4Comment = function () {
        const comments = document.getElementsByClassName("m-box-col m-box-dir m-box-center lite-line");
        num = 0;
        for (let i = 0; i < comments.length; i++) {
            processCommentNode(comments[i]);
        }
        document.getElementById("log_btn").innerHTML = "0/" + num;
    }
    const getCommentNames = function () {
        let sets = new Set();
        Array.prototype.forEach.call(document.getElementsByClassName("lite-page-list"), function (el) {
            sets.add(el.getElementsByTagName("h4")[0].innerText);
        });
        let names = "";
        sets.forEach(s => { names += s + "\n" })
        //console.log(sets.size, names);
        document.getElementById("div-user-names").innerText = sets.size + "\n" + names;
    }
    const copySpamURL = function (rid) {
        if (rid < 0) return;
        const info = document.getElementById("input-spam-url" + rid);
        if (info) {
            info.type = "text";
            info.value = "https://service.account.weibo.com/reportspamobile?rid="
                + rid + "&type=1&from=20000";
            console.log(info.value);
            info.select();
            info.setSelectionRange(0, 999)
            document.execCommand("copy");
            document.getElementById("log_btn").innerHTML = "已复制";
        }
    }

    const visi = function (id) {
        var x = document.getElementById(id);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
    const processCommentNode = function (node) {
        if (node.querySelector("h4")) {
            const name = node.querySelector("h4").innerText;
            if (names.includes(name)) {
                const iconf_like = node.querySelector("i.lite-iconf-like");
                if (iconf_like) {
                    console.log(name);
                    iconf_like.parentElement.classList.add("timeline4arthur");
                    num++;
                    document.getElementById("log_btn").innerHTML = "0/" + num;
                    node.querySelector("div.m-text-box").classList.add("highlight-like");
                } else {
                    node.querySelector("div.m-text-box").classList.add("highlight-liked");
                }

                const cmt_sub_txt = node.querySelector("span.total");
                if (cmt_sub_txt)
                    cmt_sub_txt.classList.add("arthur-sub-cmt");
            }
        }
    }
    const createDivBtn = function (name, id, listener) {
        const btn = document.createElement("div");
        btn.innerHTML = name;
        btn.id = id;
        btn.classList.add("cursor-pointer");
        btn.classList.add("lite-btn");
        if (listener) btn.addEventListener('click', listener);
        btn.style.display = "block";
        return btn;
    }
    const createDialog = function () {
        const dialog = document.createElement("div");
        dialog.id = "div-dialog-box";
        dialog.classList.add("lite-dialog");
        dialog.style.display = "none";

        const datasource = document.createElement("button");
        datasource.innerText = "显示本地数据并检查更新";
        datasource.id = "btn-datasource";
        datasource.classList.add("lite-dialog-top");
        datasource.addEventListener("click", getDataSource);
        dialog.appendChild(datasource);

        const clear = document.createElement("button");
        clear.innerText = "清空本地缓存";
        clear.id = "btn-clear";
        clear.classList.add("lite-dialog-top");
        clear.addEventListener("click", clearLocalData);
        dialog.appendChild(clear);

        const text = document.createElement("textarea");
        text.id = "text-dialog-box";
        text.classList.add("lite-dialog-textarea");
        dialog.appendChild(text);

        const token = document.createElement("input");
        token.type = "text";
        token.id = "input-token";
        token.value = "-管理员口令-";
        token.classList.add("lite-dialog-input");
        dialog.appendChild(token);

        const download = document.createElement("button");
        download.innerText = "下载";
        download.id = "btn-download";
        download.classList.add("lite-dialog-btn");
        download.disabled = true;
        download.addEventListener("click", getNames);
        dialog.appendChild(download);
        const upload = document.createElement("button");
        upload.innerText = "上传";
        upload.classList.add("lite-dialog-btn");
        upload.addEventListener("click", updateNames);
        dialog.appendChild(upload);

        return dialog;
    }

    const createMessageBox = function () {
        const dialog = document.createElement("div");
        dialog.id = "div-msg-box";
        dialog.classList.add("lite-dialog");
        dialog.style.display = "none";

        const clear = document.createElement("button");
        clear.innerText = "关闭";
        clear.id = "btn-msg-close";
        clear.classList.add("lite-dialog-btn");
        clear.addEventListener("click", function() {
            document.getElementById("div-msg-box").style.display = "none";
        });
        dialog.appendChild(clear);

        const text = document.createElement("textarea");
        text.id = "text-msg-box";
        text.classList.add("lite-dialog-textarea");
        dialog.appendChild(text);
        return dialog;
    }

    const mobilePageListener = function () {
        const head_tag = document.querySelector("div.m-text-box");
        const spam_btn = document.getElementById("get_spam_link_btn");
        if (head_tag) {
            const a_tag = head_tag.getElementsByTagName("a")[0];
            if (a_tag) {
                const regex = /[0-9]{15,}/;
                const rid = regex.exec(window.location.href)[0];
                if (rid && rid > 0) {
                    const input_spam = document.createElement("input");
                    input_spam.id = "input-spam-url" + rid;
                    input_spam.type = "hidden";
                    head_tag.appendChild(input_spam);
                    spam_btn.addEventListener("click", function () { copySpamURL(rid) });
                }
                let auth_user = true;
                //uid.forEach(id => { if (a_tag.href.indexOf(id) > -1 || auth_user) { auth_user = true; } })
                if (auth_user) {
                    const info = document.createElement("DIV");
                    info.id = "div-user-names";
                    head_tag.appendChild(info);
                }
            }
        }

        refresh4Comment();
        var commentObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach((node) => {
                    processCommentNode(node);
                })
            })
        })
        commentObserver.observe(document.querySelector("div.comment-content"), { childList: true })
        document.getElementById("div-page-group").style.display = "block";
        document.getElementById("div-common-group").style.display = "block";

        //cmt-sub-txt
        var subCmtObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach((node) => {
                    //processCommentNode(node);
                    console.log('added', typeof (node), node);
                    if (node.innerText && node.querySelector('div.lite-bot-link')) { //查看原微博
                        console.log('copy', window.location.href);
                        if (copy_cmt_url_flag) {
                            setTimeout(function () {
                                let msg = "";
                                if (node.querySelector("h4.m-text-cut")
                                    && node.querySelector("h4.m-text-cut").innerText) {
                                    msg = node.querySelector("h4.m-text-cut").innerText + ": ";
                                }
                                msg += window.location.href;
                                sub_cmt_urls.push(msg);
                                node.querySelector('i.m-font-arrow-left').click();
                            }, 1000);
                        }
                    }
                })
                m.removedNodes.forEach((node) => {
                    //processCommentNode(node);
                    console.log('removed', typeof (node), node);
                    if (node.innerText && node.querySelector('div.lite-bot-link')) {
                        console.log('back to main page');
                        if (copy_cmt_url_flag) {
                            copy_cmt_url_index++;
                            copyCmtUrlNext();
                        }
                    }
                })
            })
        })
        subCmtObserver.observe(document.querySelector("div.lite-page-wrap"), { childList: true })
    }

    const mobileNonePageListener = function () {
        document.getElementById("div-page-group").style.display = "none";
        document.getElementById("div-common-group").style.display = "block";
    }

    const mobileFunction = function () {
        const hd = document.createElement("div");
        hd.classList.add("lite-menu");
        hd.classList.add("cursor-pointer");
        hd.addEventListener("click", function () {
            if (document.querySelector("div.lite-page-wrap"))
                visi("div-page-group");
            else
                document.getElementById("div-page-group").style.display = "none";
            visi("div-common-group");
        });
        const pageGroup = document.createElement("div");
        pageGroup.id = "div-page-group";
        pageGroup.appendChild(createDivBtn("👍点赞", "click_like_btn", like2Comment));
        pageGroup.appendChild(createDivBtn("🤬举报", "get_spam_link_btn", null));
        pageGroup.appendChild(createDivBtn("💬名单", "get_comment_names_btn", getCommentNames));
        const commonGroup = document.createElement("div");
        commonGroup.id = "div-common-group";
        commonGroup.appendChild(createDivBtn("☁️同步", "click_dl_names_btn", function () { visi("div-dialog-box") }));
        commonGroup.appendChild(createDivBtn("🐒捞评", "click_sub_cmt_btn", getCommentsUrl));
        commonGroup.appendChild(createDivBtn("", "log_btn", null));

        const box = document.createElement("div");
        box.id = "div-menu-box";
        box.classList.add("lite-menu-box");
        box.appendChild(hd);
        box.appendChild(pageGroup);
        box.appendChild(commonGroup);

        //dialog
        box.appendChild(createDialog());
        box.appendChild(createMessageBox());

        //document.body.appendChild(box);
        //document.querySelector("div.lite-page-wrap").appendChild(box);
        document.querySelector("div.m-container-max").appendChild(box);
        if (document.querySelector("div.lite-page-wrap"))
            mobilePageListener();
        else
            mobileNonePageListener();

        var pageObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach((node) => {
                    const clsName = node.className;
                    if (clsName && clsName.indexOf("lite-page-wrap") > -1) {
                        console.log("in page");
                        mobilePageListener();
                    } else {
                        console.log("not in page");
                        mobileNonePageListener();
                    }
                })
            })
        })
        pageObserver.observe(document.querySelector("div.m-container-max"), { childList: true })
    }

    const desktopSearchFunction = function () {
        const cards = document.getElementsByClassName("card-wrap");
        for (let i = 0; i < cards.length; i++) {
            const rid = cards[i].getAttribute("mid");
            const head = cards[i].getElementsByClassName("info")[0];
            if (rid && head) {
                const input_spam = document.createElement("input");
                input_spam.id = "input-spam-url" + rid;
                input_spam.type = "hidden";
                head.appendChild(input_spam);
                const btn = document.createElement("button");
                btn.id = "btn-spam-url" + rid;
                btn.innerHTML = "复制举报链接";
                btn.addEventListener("click", function () { copySpamURL(rid) });
                head.appendChild(btn);
            }
            const content = cards[i].querySelector("div.content");
            if (content) {
                const txts = content.getElementsByClassName("txt");
                for (let p = 0; p < txts.length; p++) {
                    for (let q = 0; q < keyWords.length; q++)
                        txts[p].innerHTML = txts[p].innerHTML.replace(keyWords[q], "<em class='s-color-aqua'>" + keyWords[q] + "</em>")
                }
            }
        }
    }

    const desktopCommentLikeFunction = function () {
        const hd = document.createElement("div");
        hd.classList.add("lite-menu");
        hd.classList.add("cursor-pointer");
        hd.addEventListener("click", function () {
            document.getElementById("div-page-group").style.display = "none";
        });
        const pageGroup = document.createElement("div");
        pageGroup.id = "div-page-group";
        pageGroup.appendChild(createDivBtn("💉注入", "click_inject_comment_btn", function() {
            const dialog = document.querySelector(".W_layer[id^='likeDialog_']");
            if (dialog) {
                const title = dialog.querySelector('div.W_layer_title');
                const input_uid = document.createElement("input");
                input_uid.id = "input-uid-list";
                input_uid.type = "hidden";
                input_uid.value = "";
                title.appendChild(input_uid);
                const auto_click = document.createElement("button");
                auto_click.id = "btn-auto-click";
                auto_click.innerHTML = " - 自动翻页 - ";
                auto_click.addEventListener("click", autoClick);
                title.appendChild(auto_click);
                const btn = document.createElement("button");
                btn.id = "btn-uid-list";
                btn.innerHTML = " - 复制uid - ";
                btn.addEventListener("click", copyUid);
                title.appendChild(btn);
                const span_sum = document.createElement("span");
                span_sum.id = "sum-uid-list";
                span_sum.innerHTML = "uid数量:0";
                title.appendChild(span_sum);
                loadUid();

                new MutationObserver(function (mutations) {
                    mutations.forEach(function (m) {
                        m.addedNodes.forEach((node) => {
                            const clsName = node.className;
                            if (clsName && clsName == "WB_emotion") loadUid();
                        })
                    })
                }).observe(dialog.querySelector("div[node-type='inner']"), { childList: true });
            } else {
                alert("找不到内赞对话框");
            }
            document.getElementById("log_btn").innerHTML = "";
        }));
        pageGroup.appendChild(createDivBtn("", "log_btn", null));

        const box = document.createElement("div");
        box.id = "div-menu-box";
        box.classList.add("lite-menu-box");
        box.appendChild(hd);
        box.appendChild(pageGroup);
        document.querySelector("body").appendChild(box);
        const outer = document.querySelector("div[node-type='outer']");
        if(outer && outer.style) outer.style.zIndex = 999;
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach((node) => {
                    if(node.style && node.getAttribute("node-type") == "outer") node.style.zIndex = 999;
                })
            })
        }).observe(document.querySelector("body"), { childList: true });
    }

    const desktopChatFunction = function () {
        const dialog = createChatDialog();
        document.querySelector("#app > .chat").appendChild(dialog);

        setTimeout(chatKeepAlive, 5000);
        setTimeout(chatAutoSend, 5000);
    }

    const desktopMygroupFunction = function () {
        const dialog = createRefreshDialog();
        document.querySelector("#app").appendChild(dialog);

        // 分析weibo
        lastFeedId = GM_getValue("lastFeedId") ?? "";
        setTimeout(fetchFeed, 5000);
        // 定时刷新
        refresh();
    }

    let lastFeedId = "";
    const feeds = [];
    const toSend = [];
    const mygroupKeywords = ['陈飞宇','阿瑟'];
    const fetchFeed = function() {
        console.log('lastFeedId', lastFeedId);

        let lastFeedIdIncluded = false;
        let bottomElementPosition = 0;
        document.querySelectorAll('div.vue-recycle-scroller__item-view').forEach(f => {
            const position = Number(f.style.transform.replace('translateY(','').replace('px)',''));
            const href = f.querySelector('header > div > div > :nth-child(2) a').href;
            const user = f.querySelector('header div a span').innerText;
            const id = href.substring(href.lastIndexOf('/') + 1)
            const feed = f.querySelector('.wbpro-feed-content').innerText;
            if (mygroupKeywords.filter(e => feed.includes(e)).length > 0 && id > lastFeedId) {
                toSend.push(href);
            }
            feeds.push({position, href, id, feed});
            console.log(position, user, id, feed);
            if (position > bottomElementPosition) {
                bottomElementPosition = position;
            }
            if (lastFeedId <= id) {
                console.log('find lastFeedId', lastFeedId);
                lastFeedIdIncluded = true;
            }
        });

        if (feeds.length < 50 && !lastFeedIdIncluded && bottomElementPosition > 0) {
            // 下拉
            console.log('scrollTo', bottomElementPosition);
            window.scrollTo(0, bottomElementPosition);
            setTimeout(function () {
                fetchFeed();
            }, 5000);
        } else {
            console.log(new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" }), 'ended');
            const ids = feeds.map(e => e.id).sort().reverse();
            if (ids[0] > lastFeedId) {
                if(toSend.length > 0) {
                    const list = GM_getValue("toSend") ?? [];
                    list.push(...toSend);
                    GM_setValue("toSend", list);
                    console.log("toSend", list);
                }

                console.log('set lastFeedId', ids[0]);
                GM_setValue("lastFeedId", ids[0]);
            }
        }
    }

    const refresh = function () {
        setTimeout(function () {
            const now = Date.now();
            if(now > lastRefeshTime + refreshSecond) {
                GM_setValue("lastRefeshTime", now)
                window.location.reload(1);
            } else {
                const note = document.getElementById('p-refresh-text-id');
                note.innerText = "距离下次刷新还有" + Math.round((lastRefeshTime + refreshSecond - now) / 1000) + "秒";
                refresh();
            }
        }, 1000);
    }

    const chatKeepAlive = function () {
        console.log("chatKeepAlive");
        const clientIdElement = document.getElementById("input-client-id");
        const sourceIdElement = document.getElementById("input-source-id");
        const uidElement = document.getElementById("input-uid-id");
        if (clientIdElement.value.trim() && sourceIdElement.value.trim() && uidElement.value.trim()) {
            sendChat("chatKeepAlive at " + new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" }), uidElement.value.trim());
        } else {
            console.log("chatKeepAlive: 参数不全");
        }
        setTimeout(chatKeepAlive, 1000 * 60 * 15);
    }

    const chatAutoSend = function () {
        console.log("chatAutoSend");
        const clientIdElement = document.getElementById("input-client-id");
        const sourceIdElement = document.getElementById("input-source-id");
        const uidElement = document.getElementById("input-uid-id");
        if (clientIdElement.value.trim() && sourceIdElement.value.trim() && uidElement.value.trim()) {
            const list = GM_getValue("toSend") ?? [];
            console.log("toSend", list);
            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    setTimeout(function(){ 
                        sendChat(array[i], uidElement.value.trim());
                    }, 1000 + i * 1000);  
                }
                GM_setValue("toSend", []);
            }
        } else {
            console.log("chatAutoSend: 参数不全");
        }
        setTimeout(chatAutoSend, 1000 * 60);
    }

    const autoClick = function() {
        const next = document.querySelector(".W_layer[id^='likeDialog_'] a.page.next")
        if (next) {
            next.click();
            setTimeout(function () {
                autoClick();
            }, 1500);
        } else {
            alert("找不到下一页按钮");
        }
    }

    const loadUid = function () {
        const dialog = document.querySelector(".W_layer[id^='likeDialog_']");
        if(!dialog) return;
        const input_uid = document.getElementById("input-uid-list");
        const span_sum = document.getElementById("sum-uid-list");
        if(!input_uid || !span_sum) return;

        let uid_list = "";
        let uid_sum = Number(span_sum.innerHTML.replace("uid数量:",""));
        dialog.querySelectorAll('ul.emotion_list li a').forEach(e => {
            uid_sum ++;
            // uid_list += e.querySelector("img").getAttribute("alt") 
            //     + "(" + e.href.replace("https://weibo.com/u/","").replace("https://weibo.com/","") + ") ";
            uid_list += e.href.replace("https://weibo.com/u/","").replace("https://weibo.com/","") + ",";
        });
        if(uid_list) input_uid.value += uid_list;
        if(uid_sum) span_sum.innerHTML = "uid数量:" + uid_sum;
        console.log("loadUid", uid_sum, uid_list);
    }

    const copyUid = function () {
        const list = document.getElementById("input-uid-list");
        if (list) {
            list.type = "text";
            console.log(list.value);
            list.select();
            list.setSelectionRange(0, 99999)
            document.execCommand("copy");
            document.getElementById("log_btn").innerHTML = "已复制";
        }
    }

    const clearLocalData = function () {
        GM_setValue(dataSourceGroup, { qz: [], timestamp: 0 });
        names = [];
        formatNamesInText(names);
    }

    const formatNamesInText = function (names) {
        const text = document.getElementById("text-dialog-box");
        text.value = names.join("\n");
    }

    const getDataSource = function () {
        formatNamesInText(names);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://leon-26f5d0.service.tcloudbase.com/4f9741be4162",
            headers: {
                "config-uid": unsafeWindow.config.uid
            },
            onload: function (response) {
                console.log(response.status, response.responseText);
                const list = JSON.parse(response.responseText);
                const local = GM_getValue(dataSourceGroup, { qz: [], timestamp: 0 });
                const datasource = document.getElementById("btn-datasource");
                const btn = document.getElementById("btn-download");
                datasource.innerText = "当前没有可用更新";
                btn.disabled = true;
                list.forEach(s => {
                    if (s.name == dataSourceGroup && local.timestamp < s.timestamp) {
                        datasource.innerText = "可更新👇下载👇";
                        btn.disabled = false;
                    }
                });
            }
        });
    }
    const updateNames = function () {
        const token = document.getElementById("input-token");
        const regex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;
        const expArr = regex.exec(token.value);
        if (expArr && expArr[0]) {
            const text = document.getElementById("text-dialog-box").value;
            let list = [];
            text.split("\n").forEach(t => { if (t.trim().length > 0) { list.push(t.trim()); } });
            if (list.length == 0) { return; }
            const postData = JSON.stringify({ token: token.value, qz: list });
            console.log(postData);
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://leon-26f5d0.service.tcloudbase.com/892f26556ef4",
                data: postData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "config-uid": unsafeWindow.config.uid
                },
                onload: function (response) {
                    console.log(response.status, response.responseText);
                    token.value = response.responseText;
                }
            });
        } else {
            token.value = "错误的口令";
        }
    }
    const getNames = function () {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://leon-26f5d0.service.tcloudbase.com/4090ff05b43c?name=" + dataSourceGroup,
            headers: {
                "config-uid": unsafeWindow.config.uid
            },
            onload: function (response) {
                console.log(response.status, response.responseText);
                const list = JSON.parse(response.responseText);
                if (Array.isArray(list)) {
                    formatNamesInText(list);
                    GM_setValue(dataSourceGroup, { qz: list, timestamp: new Date().getTime() });
                } else {
                    const token = document.getElementById("input-token");
                    token.value = list;
                }
            }
        });
    }

    const sendChat = function (text, chatId) {
        const clientIdElement = document.getElementById("input-client-id");
        const sourceIdElement = document.getElementById("input-source-id");
        if (clientIdElement.value.trim() && sourceIdElement.value.trim()) {
            const clientId = clientIdElement.value.trim();
            const source = sourceIdElement.value.trim();
            const postData = `setTimeout=50&content=${text}&id=${chatId}&media_type=0&annotations=%7B%22webchat%22%3A1%2C%22clientid%22%3A%22${clientId}%22%7D&is_encoded=0&source=${source}`;
            console.log(postData);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/webim/groupchat/send_message.json', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(new Date(), this.status, xhr.responseText);
                    const obj = JSON.parse(xhr.responseText);
                    if(obj?.id && obj?.gid) {
                        console.log('response',obj.gid, obj.id);
                        const note = document.getElementById("p-node-id");
                        note.style.color = 'green'
                        note.innerText = "message" + obj.id + " created at " + new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" });
                        // GM_setValue("chat-id", chatId);
                        // GM_setValue("chat-source", source);
                        // GM_setValue("chat-client", clientId);
                    } else {
                        const note = document.getElementById("p-node-id");
                        note.style.color = 'red'
                        note.innerText = "红色:测试失效" + new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" });
                    }
    
                }
            };
            xhr.send(postData);
        } else {
            alert("请输入参数: clientId, source");
        }
    }

    const sendChatUser = function (text, uid) {
        const clientIdElement = document.getElementById("input-client-id");
        const sourceIdElement = document.getElementById("input-source-id");
        if (clientIdElement.value.trim() && sourceIdElement.value.trim()) {
            const clientId = clientIdElement.value.trim();
            const source = sourceIdElement.value.trim();
            const postData = `text=${text}&uid=${uid}&extensions=%7B%22clientid%22%3A%22${clientId}%22%7D&is_encoded=0&decodetime=1&source=${source}`;
            console.log(postData);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/webim/2/direct_messages/new.json', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(new Date(), this.status, xhr.responseText);
                    const obj = JSON.parse(xhr.responseText);
                    if(obj?.created_at && obj?.id) {
                        console.log('response',obj.created_at, obj.id);
                        const note = document.getElementById("p-node-id");
                        note.style.color = 'green'
                        note.innerText = "message" + obj.id + " created at " + new Date(obj.created_at).toLocaleString('zh', { timeZone: "Asia/Shanghai" });
                    } else {
                        const note = document.getElementById("p-node-id");
                        note.style.color = 'red'
                        note.innerText = "红色:测试失效" + new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" });
                    }
    
                }
            };
            xhr.send(postData);
        } else {
            alert("请输入参数: clientId, source");
        }
    }

    let refreshSecond = 1000 * 60 * 10;
    let lastRefeshTime = 0;
    const createRefreshDialog = function () {
        const dialog = document.createElement("div");
        dialog.id = "div-refresh-dialog-box";
        dialog.classList.add("lite-dialog");
        dialog.style.zIndex = 99999;
        dialog.style.display = "block";
        dialog.style.height = "100px";

        const note = document.createElement("p");
        note.id = "p-refresh-text-id";
        note.style.fontSize = 32;
        note.innerText = "距离下次刷新还有" + (refreshSecond / 1000) + "秒";
        dialog.appendChild(note);

        const btnTestClientId = document.createElement("button");
        btnTestClientId.innerText = "立即刷新";
        btnTestClientId.id = "btn-refresh";
        btnTestClientId.type = "button";
        btnTestClientId.classList.add("lite-dialog-top");
        btnTestClientId.addEventListener("click", function () {
            GM_setValue("lastRefeshTime", Date.now())
            window.location.reload(1);
        });
        dialog.appendChild(btnTestClientId);

        lastRefeshTime = GM_getValue("lastRefeshTime");

        return dialog;
    }

    const createChatDialog = function () {
        const dialog = document.createElement("div");
        dialog.id = "div-chat-dialog-box";
        dialog.classList.add("lite-dialog");
        dialog.style.zIndex = 99999;
        dialog.style.display = "block";
        dialog.style.height = "160px";

        const btnTestClientId = document.createElement("button");
        btnTestClientId.innerText = "测试clientId按钮🔘";
        btnTestClientId.id = "btn-test-client-id";
        btnTestClientId.type = "button";
        btnTestClientId.classList.add("lite-dialog-top");
        btnTestClientId.addEventListener("click", function () {
            const uidElement = document.getElementById("input-uid-id");
            if (uidElement.value.trim()) {
                sendChat("测试消息 at " + new Date().toLocaleString('zh', { timeZone: "Asia/Shanghai" }), uidElement.value.trim());
            } else {
                alert("请输入参数: uid");
            }
        });
        dialog.appendChild(btnTestClientId);

        const source = document.createElement("input");
        source.type = "text";
        source.placeholder = "-- 输入source --";
        source.style = "margin: 6px;";
        source.id = "input-source-id";
        source.classList.add("lite-dialog-input");
        dialog.appendChild(source);

        const uid = document.createElement("input");
        uid.type = "text";
        uid.placeholder = "-- uid --";
        uid.style = "margin: 6px;";
        uid.id = "input-uid-id";
        uid.classList.add("lite-dialog-input");
        dialog.appendChild(uid);

        const token = document.createElement("input");
        token.type = "text";
        token.placeholder = "-- 输入client id --";
        token.style = "margin: 6px;";
        token.id = "input-client-id";
        token.classList.add("lite-dialog-input");
        dialog.appendChild(token);

        const note = document.createElement("p");
        note.id = "p-node-id";
        note.style.color = 'red'
        note.innerText = "红色:配置失效";
        dialog.appendChild(note);

        return dialog;
    }

    const injectDom = function () {
        console.log("menu injectDom");
        if (window.location.href.includes("m.weibo.cn")
            && document.querySelector("div.m-container-max")) {
            setTimeout(mobileFunction, 1000);
        } else if (window.location.href.includes("s.weibo.com")
            && document.getElementsByClassName("card-wrap").length > 0) {
            setTimeout(desktopSearchFunction, 1000);
        } else if (window.location.href.includes("weibo.com")
            && document.querySelector(".W_layer[id^='likeDialog_']")) {
            setTimeout(desktopCommentLikeFunction, 1000);
        } else if (window.location.href.includes("api.weibo.com/chat")
            && document.querySelector('#app > .chat')) {
            setTimeout(desktopChatFunction, 1000);
        } else if (window.location.href.includes("weibo.com/mygroups?gid=11001")) {
            setTimeout(desktopMygroupFunction, 1000);
        } else {
            setTimeout(injectDom, 1000);
        }
    }
    injectDom();

    window.addEventListener("load", () => {
        //firefox does not always work.
        console.log("menu load");
    });
})();
