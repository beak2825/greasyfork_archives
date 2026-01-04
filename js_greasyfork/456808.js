// ==UserScript==
// @name         FriendShip ComikNet
// @namespace    http://comik.friendship.org.cn/
// @version      Rev-1.4
// @description  一键推送你喜爱的本子给群友！
// @author       BiDuang
// @icon         https://cdn.friendship.org.cn/LightPicture/2022/12/0b9b16affa575184.jpg
// @license      Apache License 2.0

// @match        https://jmcomic2.onl/*
// @match        https://18comic.vip/*
// @match        https://18comic.org/*
// @match        https://jmcomic.me/*
// @match        https://jmcomic1.onl/*
// @match        https://jmcomic.onl/*

// @connect      comic.friendship.org.cn

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456808/FriendShip%20ComikNet.user.js
// @updateURL https://update.greasyfork.org/scripts/456808/FriendShip%20ComikNet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REMOTE_SERVER_URL = "https://comic.friendship.org.cn";

    function sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }

    function resetUser() {
        localStorage.removeItem("username");
        alert("[ComikNet] 分享身份已重置!");
    }

    function comicShare() {
        if (!username) {
            alert("[ComikNet] 你还没有绑定你的用户名!\n请访问一次用户信息页面以绑定!");
            return;
        }
        let title = document.querySelector(".panel-heading").querySelector("h1").textContent;
        let blocks_data = document.querySelector(".col-lg-7").querySelectorAll(".tag-block");
        let cover = document.querySelector(".col-lg-5").querySelector("img").getAttribute("src");
        let serial = document.querySelector("[class=\"absolute train-number\"]").textContent.trim().split("\n")[0].substring(4);
        let intro = document.querySelector("#intro-block").querySelector("[class=\"p-t-5 p-b-5\"]").textContent.trim().substring(3);

        let comic_info = {
            username,
            title,
            cover,
            serial,
            intro,
            author: null,
            characters: null,
            tags: null,
            series: null
        };

        for (let i = 0; i < blocks_data.length; i++) {
            let block_str = blocks_data[i].textContent.trim();

            if (block_str.startsWith("作品： ")) {
                if (block_str.substring(5)) {
                    comic_info.series = block_str.substring(5).split("\n");
                    for (let j = 0; j < comic_info.series.length; j++) {
                        comic_info.series[j] = comic_info.series[j].trim();
                    }
                }
            }
            if (block_str.startsWith("登场人物：")) {
                if (block_str.substring(6)) {
                    comic_info.characters = block_str.substring(6).split("\n");
                    for (let j = 0; j < comic_info.characters.length; j++) {
                        comic_info.characters[j] = comic_info.characters[j].trim();
                    }
                }
            }
            if (block_str.startsWith("标签： ")) {
                if (block_str.substring(6)) {
                    comic_info.tags = block_str.substring(5).split("\n");
                    for (let j = 0; j < comic_info.tags.length; j++) {
                        comic_info.tags[j] = comic_info.tags[j].trim();
                    }
                }
            }
            if (block_str.startsWith("作者： ")) {
                if (block_str.substring(5)) {
                    comic_info.author = block_str.substring(5).split("\n");
                    for (let j = 0; j < comic_info.author.length; j++) {
                        comic_info.author[j] = comic_info.author[j].trim();
                    }
                }
            }
        }

        let resp;
        try {
            resp = GM_xmlhttpRequest({
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                url: REMOTE_SERVER_URL + "/share",
                data: JSON.stringify(comic_info),
                onload: function (res) {
                    if (res.status === 200) {
                        console.log('请求成功');
                        alert(JSON.parse(res.response).data.msg);
                    } else {
                        console.log('请求失败');
                        console.log(res);
                    }
                },
                onerror: function (err) {
                    console.log('请求错误');
                    console.log(err);
                }
            });
        } catch (error) {
            alert(error);
        }

    }

    function removeAllShared() {
        let resp;
        try {
            resp = GM_xmlhttpRequest({
                method: "delete",
                url: REMOTE_SERVER_URL + "/user?username=" + username,
                onload: function (res) {
                    if (res.status === 200) {
                        console.log('请求成功');
                        alert(JSON.parse(res.response).data.msg);
                    } else {
                        console.log('请求失败');
                        console.log(res);
                    }
                },
                onerror: function (err) {
                    console.log('请求错误');
                    console.log(err);
                }
            });
        } catch (error) {
            alert(error);
        }
    }

    let username = localStorage.getItem("username");

    if (location.pathname == "/user" || (location.pathname.startsWith("/user/" + username) && username)) {
        if (!username) {
            username = document.querySelector(".header-personal-right").querySelector(".header-right-username").textContent.substring(1);
            localStorage.setItem("username", username.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
            alert("[Comik Net] 你已成功绑定用户名: " + username);
        }
        let header_menu = document.querySelector(".header-menu");
        let resetBtn = document.createElement("a");
        resetBtn.innerHTML = "[ComikNet] 重置用户名";
        resetBtn.href = "javascript: void (0);";
        resetBtn.onclick = resetUser;
        header_menu.appendChild(resetBtn);

        let panel_parent = document.createElement("div");
        panel_parent.className = "col-md-3";
        let comikNet_panel = document.createElement("div");
        comikNet_panel.className = "panel panel-default user-social";
        let comikNet_panel_title = document.createElement("div");
        comikNet_panel_title.className = "panel-heading title-truncate";
        comikNet_panel_title.innerHTML = "<span>Friendship ComikNet</span>"
        let comikNet_panel_info = document.createElement("div");
        comikNet_panel_info.className = "panel-body";
        comikNet_panel_info.style = "padding: 12px";
        let comikNet_panel_lst = document.createElement("ul");
        let comikNet_penel_lst_removeAllShared = document.createElement("a");
        comikNet_penel_lst_removeAllShared.href = "javascript: void (0);";
        comikNet_penel_lst_removeAllShared.onclick = removeAllShared;
        comikNet_penel_lst_removeAllShared.innerHTML = "<li>删除所有已分享的漫画</li>";
        comikNet_penel_lst_removeAllShared.style = "color:#39c5bb;";
        let comikNet_panel_lst_welcome = document.createElement("p");
        comikNet_panel_lst_welcome.innerHTML = "你好, " + username + ", 欢迎使用 Friendship ComikNet 服务!";
        comikNet_panel_lst.appendChild(comikNet_panel_lst_welcome);
        comikNet_panel_lst.appendChild(comikNet_penel_lst_removeAllShared);
        comikNet_panel_info.appendChild(comikNet_panel_lst);
        comikNet_panel.appendChild(comikNet_panel_title);
        comikNet_panel.appendChild(comikNet_panel_info);
        panel_parent.appendChild(comikNet_panel);

        let main_panel = document.querySelector("#wrapper").querySelector(".container").querySelector(".row");
        main_panel.appendChild(panel_parent);
    }

    if (location.pathname.startsWith("/album/")) {

        let shareBtn = document.createElement("li");
        let shareLink = document.createElement("a");
        shareLink.href = "javascript: void (0);"
        shareLink.onclick = comic_info => comicShare(comic_info);
        shareLink.innerHTML = "分享到 Friendship ComikNet";
        shareBtn.appendChild(shareLink);
        let nav_tab = document.querySelector("[class=\"nav nav-tabs\"]");
        nav_tab.appendChild(shareBtn);
    }

})();