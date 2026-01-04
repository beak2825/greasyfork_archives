// ==UserScript==
// @name         NGA Red List
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  参考V2EX的RedList做一个NGA版。在个人主页增加了一个拉红的功能，之后在帖子列表和详情页面被拉红的人的帖子或回复会标红显示。
// @author       nyanpasus
// @match        *://nga.178.com/*
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/414198/NGA%20Red%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/414198/NGA%20Red%20List.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    // Your code here...
    let profileUid;
    let listName = 'nga-red-list';
    let uidList = GM_getValue(listName, "");
    let redList = uidList.split(';');
    let url = document.URL;
    let path = location.pathname;
    let buttonName = 'redButton';

    setTimeout(function() {
        function redsb() {
            let uidList = GM_getValue(listName, "");
            let redList = uidList.split(';');
            if (redList.indexOf(profileUid) >= 0) {
                GM_setValue(listName, uidList.replace(';' + profileUid, ''));
            } else {
                GM_setValue(listName, uidList + ';' + profileUid);
            }
            document.getElementById(buttonName).innerText = GM_getValue(listName, '').split(';').indexOf(profileUid) >= 0 ? '[取消拉红]' : '[拉红对方]';
        }

        if (path.startsWith('/thread.php')) {
            let homeList = document.getElementsByClassName('author');
            let len = homeList.length;
            for (let index = 0; index < len; index++) {
                let uid = homeList[index].title.split(' ')[1];
                if (redList.indexOf(uid) >= 0) {
                    homeList[index].parentElement.previousElementSibling.style.cssText += "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
                    homeList[index].parentElement.style.cssText += "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
                }
            }
        } else if (path.startsWith('/read.php')) {
            let commentList = document.getElementsByName('uid');
            let len = commentList.length;
            for (let index = 0; index < len; index++) {
                let uid = commentList[index].innerText;
                if (redList.indexOf(uid) >= 0) {
                    commentList[index].parentElement.parentElement.parentElement.style.cssText += "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
                    commentList[index].parentElement.parentElement.parentElement.nextElementSibling.style.cssText += "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
                }
            }
        } else if (path.startsWith('/nuke.php')) {
            console.info("abc");
            profileUid = document.getElementsByClassName('info')[0].firstElementChild.lastElementChild.innerText.split(':')[1].trim();
            let buttonContainer = document.getElementsByClassName('actions')[0];
            let constructLi = document.createElement('li');
            constructLi.setAttribute('style','padding-right: 5px;');
            let constructSpan = document.createElement('span');
            let constructA = document.createElement('a');
            constructA.setAttribute('href','javascript:void(0)');
            constructA.setAttribute('id', buttonName);
            constructA.innerText = redList.indexOf(profileUid) >= 0 ? '[取消拉红]' : '[拉红对方]';
            let lastDiv = document.getElementsByClassName(' clear')[4];
            constructSpan.appendChild(constructA);
            constructLi.appendChild(constructSpan);
            buttonContainer.insertBefore(constructLi, lastDiv);
            document.getElementById(buttonName).onclick= redsb;
        }
    }, 1000);
})();