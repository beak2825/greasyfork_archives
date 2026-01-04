// ==UserScript==
// @name         微博一键清空
// @namespace    https://github.com/hbc007/weibo-cleaner
// @version      1.0
// @description  微博一键清空[动态|关注|粉丝|收藏]
// @author       hbc007
// @license      GNU GPLv3
// @match        https://weibo.com
// @match        https://weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439457/%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/439457/%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var GlobalInfo = null;
    var cookie = null;
    var wbVersion = null;

    function updateInfo(info) {
        if (GlobalInfo == null) {
            return;
        }
        console.log(info);
        GlobalInfo.innerText = info;
    }
    function getXSRFToken(cookieStr) {
        var cookieItems = cookieStr.split('; ');
        for (var i = 0, len = cookieItems.length; i < len; i++) {
            var item = cookieItems[i];
            var itemArr = item.split('=');
            if (itemArr[0] === 'XSRF-TOKEN') {
                return itemArr[1];
            }
        }
    }
    function getWB(uid, callback, last_id = 0) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "get",
                url: "/ajax/statuses/mymblog?feature=0&uid=" + uid + "&since_id=" + last_id,
                headers: {
                    "Accept": "application/json",
                    "Cookie": cookie,
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        var data = JSON.parse(res.responseText);
                        var wblist = data.data.list;
                        if (wblist == null || wblist.length == 0) {
                            location.reload();
                            return;
                        }
                        for (var i = 0, len = wblist.length, id = 0; i < len; i++) {
                            id = wblist[i].id;
                            last_id = id;
                            callback(id);
                        }
                        getWB(uid, callback, last_id);
                    } else {
                        updateInfo("请求失败：" + res.status + "请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }
    function destroyWB(id) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "post",
                url: "/ajax/statuses/destroy",
                data: "{\"id\":\"" + id + "\"}",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                    "Cookie": cookie,
                    "accept": "application/json, text/plain, */*",
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        updateInfo("删除成功：" + id);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }
    function getFollows(uid, callback, page = 1) {
        if (wbVersion != 6) {
            alert("由于微博限制，“清空关注”功能需切换到“旧版”微博，请在设置中切换");
            return -1;
        }
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "get",
                url: "https://weibo.com/p/1005053026435753/myfollow?Pl_Official_RelationMyfollow__88_page=" + page,
                headers: {
                    "Accept": "application/json",
                    "Cookie": cookie,
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        var data = res.responseText;
                        var uidset = new Set(data.match(/(?<=uid=)([a-z0-9:]+)/g));
                        uidset.delete(uid)
                        if (uidset.size == 0) {
                            location.reload();
                            return;
                        }
                        for (var id of uidset) {
                            callback(id);
                        }
                        page += 1;
                        setTimeout(() => {
                            getFollows(uid, callback, page);
                        }, 100);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }

    function destroyFollow(id) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "post",
                url: "/aj/f/unfollow?ajwvr=6&__rnd=" + new Date().getTime(),
                data: "refer_sort=relationManage&location=page_100505_myfollow&refer_flag=unfollow&uid=" + encodeURIComponent(id),
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "Cookie": cookie,
                    "accept": "*/*",
                    "origin": "https://weibo.com",
                    "sec-fetch-site": "same-origin",
                    "x-xsrf-token": xsrfToken,
                    "referer": window.location.href,
                },
                onload: (res) => {
                    if (res.status === 200) {
                        updateInfo("删除成功：" + id);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }


    function getFans(uid, callback, page = 1) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "get",
                url: "https://weibo.com/ajax/friendships/friends?uid=" + uid + "&relate=fans&count=20&page=" + page + "&type=fans&fansSortType=fansCount",
                headers: {
                    "Accept": "application/json",
                    "Cookie": cookie,
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        var data = JSON.parse(res.responseText);
                        var userlist = data.users;
                        if (userlist == null || userlist.length == 0) {
                            location.reload();
                            return;
                        }
                        for (var i = 0, len = userlist.length, id = 0; i < len; i++) {
                            id = userlist[i].id;
                            callback(id);
                        }
                        page += 1;
                        setTimeout(() => { getFans(uid, callback, page) }, 100);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }

    function destroyFan(id) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "post",
                url: "/ajax/profile/destroyFollowers",
                data: "{\"uid\":\"" + id + "\"}",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                    "Cookie": cookie,
                    "accept": "application/json, text/plain, */*",
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        updateInfo("删除成功：" + id);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }

    function getFavorite(uid, callback, page = 1) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "get",
                url: "/ajax/favorites/all_fav?uid=" + uid + "&page=" + page,
                headers: {
                    "Accept": "application/json",
                    "Cookie": cookie,
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        var data = JSON.parse(res.responseText);
                        var favlist = data.data;
                        if (favlist.length == 0) {
                            location.reload();
                            return;
                        }
                        for (var i = 0, len = favlist.length, id = 0; i < len; i++) {
                            id = favlist[i].id;
                            callback(id);
                        }
                        page += 1;
                        setTimeout(() => { getFavorite(uid, callback, page) }, 100);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }

    function destroyFavorite(id) {
        var xsrfToken = getXSRFToken(cookie);
        GM_xmlhttpRequest(
            {
                method: "post",
                url: "/ajax/statuses/destoryFavorites",
                data: "{\"id\":\"" + id + "\"}",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                    "Cookie": cookie,
                    "accept": "application/json, text/plain, */*",
                    "x-xsrf-token": xsrfToken
                },
                onload: (res) => {
                    if (res.status === 200) {
                        updateInfo("删除成功：" + id);
                    } else {
                        updateInfo("请求失败[" + res.status + "]：请手动刷新页面，稍后再试");
                    }
                },
            }
        );
    }

    function getUid() {
        var url, uid = null;
        try {
            url = document.getElementsByClassName('woo-box-flex woo-tab-nav')[0].lastElementChild.href;
            uid = url.match(/(?<=u\/)\d+/)[0];
            wbVersion = 7;
        } catch (e) {
            console.log('error: not new weibo')
        }
        try {
            url = document.getElementsByClassName('gn_nav_list')[0].lastElementChild.firstElementChild.href;
            uid = url.match(/(?<=weibo.com\/)\d+/)[0];
            wbVersion = 6;
        } catch (e) {
            console.log('error: not old weibo')
        }
        console.log('wbVersion', wbVersion);
        return uid;
    }
    function init() {
        cookie = document.cookie;
        var uid = getUid();
        let mask = document.createElement('div');
        mask.style.color = 'white';
        mask.style.position = 'fixed';
        mask.style.top = '0';
        mask.style.left = '0';
        mask.style.width = '100%';
        mask.style.height = '100%';
        mask.style.background = 'rgba(128,128,128,0.5)';
        mask.style.zIndex = '9999';
        mask.style.lineHeight = '100vh';
        mask.style.fontSize = '50px';
        mask.style.textAlign = 'center';
        mask.style.textShadow = '0 0 10px black';
        mask.style.display = 'none';
        mask.innerText = '正在清理中，请勿刷新页面';
        GlobalInfo = document.createElement('div');
        GlobalInfo.style.position = 'fixed';
        GlobalInfo.style.bottom = '10%';
        GlobalInfo.style.left = '0';
        GlobalInfo.style.width = '100%';
        GlobalInfo.style.textAlign = 'center';
        GlobalInfo.style.zIndex = '10000';
        GlobalInfo.style.textShadow = '0 0 15px blue';
        GlobalInfo.style.fontSize = '16px';
        GlobalInfo.style.color = 'white';

        function showMask() {
            mask.style.display = 'block';
        }

        let container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "0";
        container.style.left = "0";
        container.style.zIndex = "9999";

        let clrWBbtn = document.createElement("button");
        clrWBbtn.innerHTML = "清空微博";
        clrWBbtn.onclick = () => {
            getWB(uid, destroyWB);
            showMask();
        };
        container.append(clrWBbtn);
        container.append(document.createElement("br"));

        let clrFollowBtn = document.createElement("button");
        clrFollowBtn.innerHTML = "清空关注";
        clrFollowBtn.onclick = () => {
            if (getFollows(uid, destroyFollow) != -1) {
                showMask();
            }
        };
        container.append(clrFollowBtn);
        container.append(document.createElement("br"));

        let clrFanBtn = document.createElement("button");
        clrFanBtn.innerHTML = "清空粉丝";
        clrFanBtn.onclick = () => {
            getFans(uid, destroyFan);
            showMask();
        };
        container.append(clrFanBtn);
        container.append(document.createElement("br"));

        let clrFavBtn = document.createElement("button");
        clrFavBtn.innerHTML = "清空收藏";
        clrFavBtn.onclick = () => {
            getFavorite(uid, destroyFavorite);
            showMask();
        };
        container.append(clrFavBtn);

        document.body.append(container);
        document.body.append(mask);
        document.body.append(GlobalInfo);
    }
    window.addEventListener('load', () => { init(); });
})();
