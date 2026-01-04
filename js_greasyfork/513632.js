// ==UserScript==
// @name         douban blacklist manage
// @version      0.0.3
// @description  add button to douban to delete follower
// @author       harryhare, ✌
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/**
// @grant        none
// @namespace https://greasyfork.org/users/1384897
// @downloadURL https://update.greasyfork.org/scripts/513632/douban%20blacklist%20manage.user.js
// @updateURL https://update.greasyfork.org/scripts/513632/douban%20blacklist%20manage.meta.js
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
let isBanningActive = false; // 用于标记拉黑操作是否在进行中
let stopBan = false; // 用于停止拉黑操作


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

function addBlacklistAllButton() {
    let dogShape = document.createElement('div');
    dogShape.innerHTML = `
        <div style="position: relative; width: 80px; height: 80px; background-color: #f9d3b4; border-radius: 50%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; font-size: 12px; font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif; color: white; font-weight: bold; display: flex; justify-content: center; align-items: center; padding: 5px;">
            爱护<br>棉花小狗计划
        </div>
        <div style="position: absolute; top: -8px; left: 4px; width: 25px; height: 25px; background-color: #fce6d6; border-radius: 50%;"></div>
        <div style="position: absolute; top: -8px; right: 4px; width: 25px; height: 25px; background-color: #fce6d6; border-radius: 50%;"></div>
    `;
    dogShape.style = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        z-index: 1000;
        text-align: center;
        font-size: 12px;
        color: #333;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        line-height: 1.4;
        background-color: #fdebd0;
        padding: 15px;
        border-radius: 50%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    `;

    // 添加悬停效果
    dogShape.onmouseover = function() {
       dogShape.style.transform = "scale(1.1)";
    };
    dogShape.onmouseout = function() {
        dogShape.style.transform = "scale(1)";
    };

    let button = document.createElement('button');
    button.innerHTML = "拉黑所有小组成员";
    button.style = `
        position: fixed;
        bottom: 20px;
        right: 10px;
        z-index: 1000;
        background-color: #f78f8f;  
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 16px;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease, transform 0.2s ease;
    `;

    button.onmouseover = function() {
        button.style.backgroundColor = "#d86a6a";
        button.style.transform = "translateY(-2px)";
    };

    button.onmouseout = function() {
        button.style.backgroundColor = "#f78f8f";
        button.style.transform = "translateY(0)";
    };

    button.onclick = async function() {
        if (confirm("你确定要拉黑该小组所有成员吗？这可能需要一些时间。")) {
            await ban_all_members_in_group();
        }
    };

    // 将狗狗提示文本和按钮添加到页面
    document.body.appendChild(dogShape);
    document.body.appendChild(button);
}

async function ban_all_members_in_group() {
    console.log("开始拉黑该小组所有成员...");
    let current_page = getCurrentPage();
    let total_members_banned = parseInt(sessionStorage.getItem("total_members_banned") || "0");
    let members_per_page = 36;

    while (true) {
        // 检查当前页面是否依旧是小组成员页面，如果不是则停止操作
        if (!isGroupMemberPage()) {
            console.log("已经离开小组成员页面，停止拉黑操作");
            clearBanState(); // 清空sessionStorage并停止
            break;
        }

        console.log(`正在拉黑第 ${current_page + 1} 页的成员`);
        document.querySelector('button').innerHTML = `正在拉黑第 ${current_page + 1} 页...`;

        let members_banned_on_page = await ban_all_members_on_page();
        total_members_banned += members_banned_on_page;

        document.querySelector('button').innerHTML = `已拉黑 ${total_members_banned} 位成员 (第 ${current_page + 1} 页)`;

        // 检查是否有下一页
        let next_button = document.querySelector("span.next a");
        if (!next_button || members_banned_on_page < members_per_page) {
            console.log("所有页面已处理完毕");
            clearBanState(); // 清空sessionStorage
            document.querySelector('button').innerHTML = "拉黑所有小组成员";
            break;
        }

        // 保存当前页码和总数到sessionStorage
        sessionStorage.setItem("current_page", current_page + 1);
        sessionStorage.setItem("total_members_banned", total_members_banned);

        next_button.click();
        await sleep(2000);
        return;
    }
}

async function ban_all_members_on_page() {
    console.log("拉黑当前页面的所有成员");
    let items = document.querySelectorAll("li.member-item .name a");
    let members_banned = 0;

    for (let i = 0; i < items.length; i++) {
        let user_name = items[i].href.split("/people/")[1].replace("/", "");
        console.log(`正在拉黑: ${user_name}`);

        try {
            await ban_simple(user_name);
            members_banned++;
            console.log(`成功拉黑: ${user_name}`);
        } catch (error) {
            console.warn(`无法拉黑${error.message}`);
            // 继续下一个用户
        }

        await sleep(interval);
    }

    return members_banned;
}

// 检查当前页面是否是小组成员页面
function isGroupMemberPage() {
    const member_list_reg = /^https:\/\/www\.douban\.com\/group\/\d+\/members/;
    return member_list_reg.test(window.location.href);
}

function clearBanState() {
    sessionStorage.removeItem("current_page");
    sessionStorage.removeItem("total_members_banned");

    let groupBanButton = document.querySelector('button#group-ban-button');
    if (groupBanButton) {
        groupBanButton.innerHTML = "拉黑所有小组成员";
    }
}

// 页面加载时自动从sessionStorage恢复状态并继续拉黑
window.onload = async function () {
    let saved_page = sessionStorage.getItem("current_page");
    if (saved_page && isGroupMemberPage()) {
        console.log(`恢复到第 ${saved_page} 页`);
        await ban_all_members_in_group();
    } else {
        clearBanState();
    }
};

// 获取当前页码
function getCurrentPage() {
    let urlParams = new URLSearchParams(window.location.search);
    let start = urlParams.get("start") || "0";
    return Math.floor(parseInt(start) / 36);
}

function addBlacklistAllButtonForTopic() {
    let dogShape = document.createElement('div');
    dogShape.innerHTML = `
        <div style="position: relative; width: 80px; height: 80px; background-color: #f9d3b4; border-radius: 50%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; font-size: 12px; font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif; color: white; font-weight: bold; display: flex; justify-content: center; align-items: center; padding: 5px;">
            请勿<br>踹棉花小狗
        </div>
        <div style="position: absolute; top: -8px; left: 4px; width: 25px; height: 25px; background-color: #fce6d6; border-radius: 50%;"></div>
        <div style="position: absolute; top: -8px; right: 4px; width: 25px; height: 25px; background-color: #fce6d6; border-radius: 50%;"></div>
    `;
    dogShape.style = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        z-index: 1000;
        text-align: center;
        font-size: 12px;
        color: #333;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        line-height: 1.4;
        background-color: #fdebd0;
        padding: 15px;
        border-radius: 50%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    `;

    // 添加悬停效果
    dogShape.onmouseover = function() {
       dogShape.style.transform = "scale(1.1)";
    };
    dogShape.onmouseout = function() {
        dogShape.style.transform = "scale(1)";
    };

    let button = document.createElement('button');
    button.innerHTML = "拉黑所有回复的人";
    button.style = `
        position: fixed;
        bottom: 20px;
        right: 10px;
        z-index: 9999;
        background-color: #f78f8f;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 16px;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease, transform 0.2s ease;
    `;

    button.onmouseover = function () {
        button.style.backgroundColor = "#d86a6a";
        button.style.transform = "translateY(-2px)";
    };

    button.onmouseout = function () {
        button.style.backgroundColor = "#f78f8f";
        button.style.transform = "translateY(0)";
    };

    button.onclick = async function () {
        if (confirm("你确定要拉黑该帖子中的所有回复者吗？")) {
            await ban_all_reply_users();
        }
    };

    document.body.appendChild(dogShape);
    document.body.appendChild(button);
}

async function ban_all_reply_users() {
    console.log("开始拉黑帖子中的所有回复者...");

    let total_banned = 0;

    // 先处理主贴作者
    try {
        let topic_author = document.querySelector("#topic-content > div.topic-doc > h3 > span.from > a");
        if (topic_author) {
            let author_name = topic_author.href.split("/people/")[1].replace("/", "");
            console.log(`正在拉黑贴主: ${author_name}`);
            await ban_simple(author_name);
            total_banned++;
            await sleep(interval);
        }
    } catch (error) {
        console.warn(`无法拉黑贴主: ${error.message}`);
    }

    // 然后处理所有回复者
    let items = document.querySelectorAll("li.comment-item"); // 获取所有回复
    for (let i = 0; i < items.length; i++) {
        try {
            let user_name = items[i].querySelector(".user-face a").href.split("/people/")[1].replace("/", "");
            console.log(`正在拉黑回复者: ${user_name}`);
            await ban_simple(user_name);
            total_banned++;
            await sleep(interval);
        } catch (error) {
            console.warn(`无法拉黑回复者: ${error.message}`);
        }
    }

    alert(`已成功拉黑${total_banned}位用户`);
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
    const member_list_reg = /^https:\/\/www\.douban\.com\/group\/[a-zA-Z0-9_-]+\/members/;

    let page_mode = "None";
    if (status_reg.test(page)) {
        page_mode = "status";
    } else if (note_reg.test(page)) {
        page_mode = "node";
    } else if (group_reg.test(page)) {
        page_mode = "group";
    } else if (member_list_reg.test(page)) {
        page_mode = "members";
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
            addBlacklistAllButtonForTopic();
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

    if (page_mode === "members") {
        addBlacklistAllButton();
    }
})();
