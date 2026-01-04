// ==UserScript==
// @name         douban one click blacklist
// @namespace    https://github.com/harryhare/
// @version      0.0.4
// @description  add button to douban to delete follower
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424517/douban%20one%20click%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/424517/douban%20one%20click%20blacklist.meta.js
// ==/UserScript==

var buttons_map = {};//userid,buttons list
var user_id_map = {};
var blacklist_set = new Set();
var ck = "";
var page_url = "";
const url_ban = "https://www.douban.com/j/contact/addtoblacklist";
const url_unban = "https://www.douban.com/j/contact/unban";

//time delay
var interval = 2000;
var interval_id;


const ban_text = "加入黑名单";
const unban_text = "移出黑名单";
const banning_text = "正在加入黑名单...";
const unbanning_text = "正在移出黑名单...";
const error_text = "失败请重试";


function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

async function ban_simple(user_name) {
    let user_id = await get_real_user_id(user_name);
    var xmlhttp = new XMLHttpRequest();
    var data = "people=" + user_id + "&ck=" + ck;
    xmlhttp.open("POST", url_ban, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onload = function () {
        if (this.status === 200) {
            console.log(`拉黑${user_name}成功`);
        } else {
            console.log(`拉黑${user_name}失败`);
        }
    };
    xmlhttp.onerror = function () {
        console.log(`拉黑${user_name}失败`);
    };
    xmlhttp.send(data);
}

async function ban(user_name, node) {
    let user_id = await get_real_user_id(user_name);
    var xmlhttp = new XMLHttpRequest();
    var url = url_ban;
    var data = "people=" + user_id + "&ck=" + ck;
    console.log('ban:', data);
    node.innerHTML = banning_text;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                //node.innerHTML = "已加入黑名单";
                let buttons = buttons_map[user_name];
                blacklist_set.add(user_name);
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].innerHTML = unban_text;
                }
            } else {
                node.innerHTML = error_text;
            }
        }
    };
    xmlhttp.send(data);
}

async function unban(user_name, node) {
    let user_id = await get_real_user_id(user_name);
    var xmlhttp = new XMLHttpRequest();
    var url = url_unban;
    var data = "people=" + user_id + "&ck=" + ck;
    console.log('unban:', data);
    node.innerHTML = unbanning_text;
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                //node.innerHTML = "已加入黑名单";
                let buttons = buttons_map[user_name];
                blacklist_set.delete(user_name);
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].innerHTML = ban_text;
                }
            } else {
                node.innerHTML = error_text;
            }
        }
    };
    xmlhttp.send(data);
}

async function add_to_blacklist(e) {
    if (e.target.innerHTML === unban_text) {
        await unban(e.target.getAttribute("user-id"), e.target);
    } else {
        await ban(e.target.getAttribute("user-id"), e.target);
    }
}

function get_blacklist_button(user_id, style) {
    let b = document.createElement('a');
    b.setAttribute("user-id", user_id);
    if (blacklist_set.has(user_id)) {
        b.innerHTML = unban_text;
    } else {
        b.innerHTML = ban_text;
    }
    b.style = style;
    b.onclick = add_to_blacklist;
    if (user_id in buttons_map) {
        buttons_map[user_id].push(b);
    } else {
        buttons_map[user_id] = [b];
    }
    return b
}

function check_user_link(href) {
    const status_reg = /https:\/\/www\.douban\.com\/people\/[^\/]+\/?$/;
    return status_reg.test(href);
}

function get_user_id_from_url(href) {
    if (href[href.length - 1] === "/") {
        href = href.substr(0, href.length - 1)
    }
    const j = href.lastIndexOf("/");
    return href.substr(j + 1, href.length - j);
}

// 评论，日志和广播
function process_comment() {
    function process_item(item) {
        let a = item.children[0];
        let href = a.href;
        let name = a.title;
        let user_id = get_user_id_from_url(a.href);
        let b = get_blacklist_button(user_id, "margin-left:10px");
        // 如果回复已被投诉则没有投诉那一排按钮
        let action_bars = item.parentElement.querySelectorAll("div.action-bar-group");
        if (action_bars.length > 0) {
            action_bars[0].append(b);
        }
    }

    let items = document.querySelectorAll("div.item .meta-header");
    for (let i = 0; i < items.length; i++) {
        process_item(items[i]);
    }

    function callback(records) {
        records.map(function (record) {
            if (record.addedNodes.length !== 0) {
                for (var i = 0; i < record.addedNodes.length; i++) {
                    var node = record.addedNodes[i];
                    if (node.className === "item reply-item") {//meta-head不行
                        //console.log(node);
                        var items = node.querySelectorAll("div.item .meta-header");
                        //console.log(items);
                        for (let i = 0; i < items.length; i++) {
                            process_item(items[i]);
                        }
                    }
                }
            }
        });
    }

    var mo = new MutationObserver(callback);

    var option = {
        'childList': true,
        'subtree': true,
    };

    mo.observe(document.body, option);
}

// 小组 回复
function process_comment_group() {
    let items = document.querySelectorAll("div.operation-div");
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let user_id = item.id;
        let b = get_blacklist_button(user_id, "color: #aaa; margin-right:10px");
        let containers = item.querySelectorAll("div.operation-more");
        if(containers.length>0) {
            containers[0].append(b);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function makeRequest(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}


async function get_real_user_id(user_name) {
    const user_id_reg = /^\d{6,}$/;
    if (user_id_reg.test(user_name)) {
        return user_name;
    }
    if (user_name in user_id_map) {
        return user_id_map[user_name];
    }
    let url = `https://www.douban.com/people/${user_name}/`;
    let response = await makeRequest(url);
    let parser = new window.DOMParser();
    let xmlDoc = parser.parseFromString(response, "text/html");
    let user_id = xmlDoc.querySelector("div.user-opt a").id;

    if (user_id === "ban-cancel") {
        const user_id_reg2 = /\d{6,}/;
        let div = xmlDoc.querySelector("div.user-opt script");
        user_id = user_id_reg2.exec(div.text)[0];
    }
    user_id_map[user_name] = user_id;
    return user_id;
}


async function do_blacklist_page(url, t) {
    let response = await makeRequest(url);
    let parser = new window.DOMParser();
    let xmlDoc = parser.parseFromString(response, "text/html");
    let items = xmlDoc.querySelectorAll("li div.content");
    let str = t.innerHTML;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let a = item.children[0];
        // 如果不是 https://www.douban/people/xxx 的形式，那么就是匿名用户
        if (check_user_link(a.href) === false) {
            continue;
        }
        let user_id = get_user_id_from_url(a.href);
        //console.log(`拉黑${user_id}`);
        await ban_simple(user_id);
        t.innerHTML = `${str}, 该页已完成 ${i + 1}/${items.length}`;
        await sleep(interval);
    }
    return items.length;// 返回该页的人数
}

async function do_blacklist_all_status_like(e) {
    let b = e.target;
    console.log("blacklist all...");
    for (let i = 0; ; i += 20) {
        b.innerHTML = `正在拉黑第 ${i / 20 + 1} 页`;
        let url = `${page_url}?start=${i}&tab=like#like`;
        let n = await do_blacklist_page(url, e.target);
        if (n === 0) {
            b.innerHTML = `已全部拉黑`;
            break;
        } else if (n === -1) {
            b.innerHTML = '失败请重试';
            break;
        }
        await sleep(interval);
    }
}

async function do_blacklist_all_note_like(e) {
    let b = e.target;
    console.log("blacklist all...");
    for (let i = 0; ; i += 100) {
        b.innerHTML = `正在拉黑第 ${i / 100 + 1} 页`;
        let url = `${page_url}?start=${i}&type=like#sep`;
        let n = await do_blacklist_page(url, e.target);
        if (n === 0) {
            b.innerHTML = `已全部拉黑`;
            break;
        } else if (n === -1) {
            b.innerHTML = '失败请重试';
            break;
        }
    }
}

async function do_blacklist_all_note_donate(e) {
    let b = e.target;
    console.log("blacklist all...");
    for (let i = 0; ; i += 100) {
        b.innerHTML = `正在拉黑第 ${i / 100 + 1} 页`;
        let url = `${page_url}?start=${i}&type=donate#sep`;
        let n = await do_blacklist_page(url, e.target);
        if (n === 0) {
            b.innerHTML = `已全部拉黑`;
            break;
        } else if (n === -1) {
            b.innerHTML = '失败请重试';
            break;
        }
    }
}

// 打赏 - 日志
function process_note_donate() {
    let tabs = document.querySelector("div.tabs");
    let b = document.createElement('a');
    b.innerHTML = "一键拉黑所有赞赏的人";
    b.style = "float: right; font-size: 13px; line-height: 1.2; color: #fff; background:#bbb; opacity: 1;";
    // b.onmouseover = (e) => {
    //     e.target.style.opacity = 1;
    // };
    // b.onmouseout = (e) => {
    //     e.target.style.opacity = 0;
    // };
    b.onclick = do_blacklist_all_note_donate;
    tabs.append(b);
}

// 点赞 - 日志
function process_note_like() {
    let tabs = document.querySelector("div.tabs");
    let b = document.createElement('a');
    b.innerHTML = "一键拉黑所有点赞的人";
    b.style = "float: right; font-size: 13px; line-height: 1.2; color: #fff; background:#bbb; opacity: 1;";
    // b.onmouseover = (e) => {
    //     e.target.style.opacity = 1;
    // };
    // b.onmouseout = (e) => {
    //     e.target.style.opacity = 0;
    // };
    b.onclick = do_blacklist_all_note_like;
    tabs.append(b);
}

// 点赞 - 广播
function process_status_like() {
    let tabs = document.querySelector("div.tabs");
    let b = document.createElement('a');
    b.innerHTML = "一键拉黑所有点赞的人";
    b.style = "float: right; font-size: 13px; line-height: 1.2; color: #fff; background:#bbb; opacity: 1;";
    // b.onmouseover = (e) => {
    //     e.target.style.opacity = 1;
    // };
    // b.onmouseout = (e) => {
    //     e.target.style.opacity = 0;
    // };
    b.onclick = do_blacklist_all_status_like;
    tabs.append(b);
}

// 转发 - 广播
function process_reshare() {
    let items = document.querySelectorAll("li .content");
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let a = item.children[0];
        let user_id = get_user_id_from_url(a.href);
        let b = get_blacklist_button(user_id, "margin-left:10px");
        b.className = "go-status";
        item.insertBefore(b, item.children[2]);
    }
}

// 转发 - 日志
function process_rec() {
    let items = document.querySelectorAll("li .content");
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let a = item.children[0];
        let user_id = get_user_id_from_url(a.href);
        let b = get_blacklist_button(
            user_id,
            "position: absolute; top: 10px; right: 140px; color: #fff; background:#bbb; opacity: 0;"
        );
        b.onmouseover = (e) => {
            e.target.style.opacity = 1;
        };
        b.onmouseout = (e) => {
            e.target.style.opacity = 0;
        };
        item.insertBefore(b, item.children[2]);
    }
}

// 收藏-日志, 日志的收藏是动态加载的
function process_note_collect() {
    function process_item(item) {
        let a = item.children[0];
        let user_id = get_user_id_from_url(a.href);
        let b = get_blacklist_button(
            user_id,
            "position: absolute; top: 10px; right: 140px; color: #fff; background:#bbb; opacity: 0;"
        );
        b.onmouseover = (e) => {
            e.target.style.opacity = 1;
        };
        b.onmouseout = (e) => {
            e.target.style.opacity = 0;
        };
        item.insertBefore(b, item.children[2]);
    }

    let items = document.querySelectorAll("li div.content");
    for (let i = 0; i < items.length; i++) {
        process_item(items[i]);
    }

    function callback(records) {
        records.map(function (record) {
            if (record.addedNodes.length !== 0) {
                for (var i = 0; i < record.addedNodes.length; i++) {
                    var node = record.addedNodes[i];
                    //console.log(node.tagName);
                    if (node.tagName && node.tagName.toLowerCase() === "ul") {
                        //console.log(node);
                        var items = node.querySelectorAll("li div.content");
                        //console.log(items);
                        for (let i = 0; i < items.length; i++) {
                            process_item(items[i]);
                        }
                    }
                }
            }
        });
    }

    var mo = new MutationObserver(callback);

    var option = {
        'childList': true,
        'subtree': true,
    };
    mo.observe(document.body, option);

}

// 收藏-广播,广播的收藏也是动态的
function process_status_collect() {
    function process_item(item) {
        let a = item.children[0];
        let user_id = get_user_id_from_url(a.href);
        let b = get_blacklist_button(
            user_id,
            "float: right; color: #fff; background:#bbb; opacity: 0;"
        );
        b.onmouseover = (e) => {
            e.target.style.opacity = 1;
        };
        b.onmouseout = (e) => {
            e.target.style.opacity = 0;
        };
        item.append(b);
    }

    let items = document.querySelectorAll("li div.content");
    for (let i = 0; i < items.length; i++) {
        process_item(items[i]);
    }

    function callback(records) {
        records.map(function (record) {
            if (record.addedNodes.length !== 0) {
                for (var i = 0; i < record.addedNodes.length; i++) {
                    var node = record.addedNodes[i];
                    //console.log(node.tagName);
                    if (node.tagName && node.tagName.toLowerCase() === "ul") {
                        //console.log(node);
                        var items = node.querySelectorAll("li div.content");
                        //console.log(items);
                        for (let i = 0; i < items.length; i++) {
                            process_item(items[i]);
                        }
                    }
                }
            }
        });
    }

    var mo = new MutationObserver(callback);

    var option = {
        'childList': true,
        'subtree': true,
    };
    mo.observe(document.body, option);
}

(function () {
    'use strict';

    ck = getCookie("ck");
    let url = window.location.href;
    url = url.replace("#sep", "");
    let i = url.indexOf("?");
    if (i === -1) {
        i = url.length;
    }
    const page = url.substr(0, i);
    const arg = url.substr(i + 1, url.length - i);
    const status_reg = /^https:\/\/www\.douban\.com\/people\/[^\/]+\/status\/\d+\/$/;
    const note_reg = /^https:\/\/www\.douban\.com\/note\/\d+\/$/;
    const group_reg = /^https:\/\/www\.douban\.com\/group\/topic\/\d+\/$/;
    let page_mode = "None";
    if (status_reg.test(page)) {
        page_mode = "status";
    } else if (note_reg.test(page)) {
        page_mode = "node";
    } else if (group_reg.test(page)) {
        page_mode = "group";
    } else {
        return;
    }
    page_url = page;

    let tab_mode = "comment";
    if (arg.indexOf("comment") !== -1) {
        tab_mode = "comment";
    } else if (arg.indexOf("type=like") !== -1) {
        tab_mode = "note_like";
    } else if (arg.indexOf("tab=like") !== -1) {
        tab_mode = "status_like";
    } else if (arg.indexOf("tab=reshare") !== -1) {
        tab_mode = "reshare"; //for status
    } else if (arg.indexOf("type=rec") !== -1) {
        tab_mode = "rec"; // for note
    } else if (arg.indexOf("type=collect") !== -1) {
        tab_mode = "note_collect";
    } else if (arg.indexOf("tab=collect") !== -1) {
        tab_mode = "status_collect";
    } else if (arg.indexOf("type=donate") !== -1) {
        tab_mode = "note_donate";
    }

    console.log(tab_mode);
    if (tab_mode === "comment") {
        if (page_mode === "group") {
            process_comment_group();
        } else {
            process_comment();
        }
    } else if (tab_mode === "note_like") {
        process_note_like();
    } else if (tab_mode === "status_like") {
        process_status_like();
    } else if (tab_mode === "reshare") {
        process_reshare();
    } else if (tab_mode === "rec") {
        process_rec();
    } else if (tab_mode === "note_collect") {
        process_note_collect();
    } else if (tab_mode === "status_collect") {
        process_status_collect();
    } else if (tab_mode === "note_donate") {
        process_note_donate();
    }
})();