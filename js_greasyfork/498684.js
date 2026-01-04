// ==UserScript==
// @name         ModrinthHelper
// @namespace    http://suzunemaiki.moe/
// @version      0.3
// @description  自动获取你的follow列表，并更改搜索页面follow的图标
// @author       SuzuneMaiki
// @match        http*://modrinth.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modrinth.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498684/ModrinthHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/498684/ModrinthHelper.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    let authorization = getCookie('auth-token');
    let divWarning = document.createElement('div');
    var listFollow = await getFollow();
    divWarning.setAttribute('style', 'width:200px;height:100px;position:fixed;top:5px;right:5px;text-align:center;');
    document.body.appendChild(divWarning);
    const config = {
        childList: true,
        attributes: true
    };
    if (!authorization) {
        warning('请先登录');
    } else {
        changeIcon();
        const observer = new MutationObserver(() => {
            changeIcon();
        });
        observer.observe(document.getElementsByClassName('normal-page__content')[0], config);
    }
    //
    async function sendRequest(type, url, state) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open(type, url, true);
            request.setRequestHeader('Authorization', authorization);
            request.send('');
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == state) {
                        if (request.responseText != '') {
                            resolve(JSON.parse(request.responseText));
                        }
                        else resolve({});
                    } else {
                        warning(request.responseText + '\n' + url);
                    }
                }
            };
        });
    }
    function getCookie(key) {
        var reg = new RegExp(key + '=([^;]*)'); // 正则表达式
        var arr = document.cookie.match(reg); // 获取正则匹配后的值
        if (!arr) return null;
        return arr[1]; // 转码并返回值
    }
    //
    async function follow(project) {
        let callback = await sendRequest("POST", 'https://api.modrinth.com/v2/project/' + project + '/follow', 204);
        await getFollow();
        changeIcon();
        warning('关注成功');
    }
    //
    async function unfollow(project) {
        let callback = await sendRequest("DELETE", 'https://api.modrinth.com/v2/project/' + project + '/follow', 204);
        await getFollow();
        changeIcon();
        warning('取消成功');
    }
    //
    async function getFollow() {
        let user = await sendRequest('GET', 'https://api.modrinth.com/v2/user', 200);
        let uid = user.id;
        let arrayFollow = await sendRequest("GET", 'https://api.modrinth.com/v2/user/' + uid + '/follows', 200);
        let oList = {};
        for (let i = 0; i < arrayFollow.length; i++) {
            let slug = arrayFollow[i].slug;
            oList[slug] = arrayFollow[i];
        }
        listFollow = oList;
        warning('获取列表成功');
        return oList;
    }
    //
    function changeIcon() {
        if (!listFollow) { }
        let arrayNodes = document.getElementsByClassName('project-card');
        for (let i = 0; i < arrayNodes.length; i++) {
            let node = arrayNodes[i];
            let nodeTitle = node.getElementsByClassName('title')[0].childNodes[0];
            let slug = nodeTitle.href.split('mod/')[1];
            let boolFind = listFollow[slug];
            let favourite = node.childNodes[5].childNodes[1];
            let icon = document.createElement('a');
            if (boolFind) {
                icon.innerHTML = '❤️';
                icon.onclick = function () {
                    unfollow(slug);
                };
            } else {
                icon.innerHTML = '🤍';
                icon.onclick = function () {
                    follow(slug);
                };
            }
            let replaced = favourite.childNodes[0];
            favourite.replaceChild(icon, replaced);
        }
        warning('替换成功');
    }
    function warning(info) {
        let nodeWarning = document.createElement('div');
        nodeWarning.setAttribute('style', 'width:200px;height:100px;background-color:rgba(255,255,255,0.5);text-align:center;font-size:12px');
        nodeWarning.innerHTML = info + '<p>3秒后自动关闭，或点击关闭此提示</p>';
        nodeWarning.setAttribute('onclick', 'this.remove()');
        //想看log取消注释下面这行
        //divWarning.appendChild(nodeWarning);
        setTimeout(function (object) {
            object.remove();
        }, 3000, nodeWarning);
        //
    }
})();
