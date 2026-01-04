// ==UserScript==
// @name         red list
// @namespace    https://greasyfork.org/zh-CN/scripts/388742-red-list
// @version      0.2.7
// @description  世界是由各种各样的人组成的，当你拉黑某个沙雕，你也屏蔽了世界的一部分信息，世界也就变得不再完整。怎么办？拉红他！拉红之后，他依然会出现在你的视线里，但是会被标记，以提示这是你认为的一个沙雕。
// @author       taxayd
// @match        *://*.v2ex.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/388742/red%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/388742/red%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username_in_infopage;
    let listName = 'red-list';
    let strlist = GM_getValue(listName, "");
    let redlist = strlist.split(';');
    let url = document.URL;
    let path = location.pathname
    let buttonName = 'redbutton';

// delete all
//GM_deleteValue('red-list');console.log('list:' + GM_getValue('red-list', 'empty'));return;

    function redthis() {
        let strlist = GM_getValue(listName, "");
        let redlist = strlist.split(';');
        // console.log('redlist:' + redlist, 'username_in_infopage:' + username_in_infopage, 'strlist:' + strlist);
        if (redlist.indexOf(username_in_infopage) >= 0) {
            GM_setValue(listName, strlist.replace(';' + username_in_infopage, ''));
        } else {
            GM_setValue(listName, strlist + ';' + username_in_infopage);
        }
        document.getElementById(buttonName).value = GM_getValue(listName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Unred' : 'Red';
        // console.log('strlist:' + GM_getValue(listName, ""));
    }

    if (path == '/' || path.startsWith('/go/') || path.startsWith('/tag/'))
    {
        // 首页及类首页
        let home_list = document.getElementsByClassName('topic_info');
        let len = home_list.length;
        for(let i=0; i<len; i++) {
            let username = path === '/' || path.startsWith('/tag/') ? home_list[i].children[2] : home_list[i].children[0];
            if (redlist.indexOf(username.innerText) >= 0) {
                // console.log('in red list: ' + username.innerText);
                home_list[i].parentElement.parentElement.parentElement.parentElement.parentElement.style = "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
            }
        }
    } else if (path.startsWith('/t/')) {
        // 帖子详情页
        let comments = document.getElementsByClassName('cell');
        let len = comments.length;
        for(let i=0; i<len; i++) {
            if (comments[i].id.substr(0, 2) != 'r_') {
                continue;
            }
            let username = comments[i].getElementsByTagName('strong')[0];
            if (redlist.indexOf(username.innerText) >= 0) {
                // console.log('in red list: ' + username.innerText);
                comments[i].style = "background-image:url(https://i.loli.net/2019/06/09/5cfbebdfd083a19907.png);background-size:contain;";
            }
        }
    } else if (path.startsWith('/member/')) {
        // 个人主页
        username_in_infopage = document.getElementsByTagName('h1')[0].innerText;
        // let button = document.getElementsByClassName('fr')[0];
        let button_container = document.getElementsByTagName('input')[1].parentElement;
        let red = document.createElement('input');
        red.setAttribute('type', 'button');
        red.setAttribute('id', buttonName);
        red.setAttribute('value', redlist.indexOf(username_in_infopage)>=0 ? 'Unred' : 'Red');
        red.setAttribute('class', 'super normal button');
        button_container.appendChild(red);
        document.getElementById(buttonName).onclick = redthis;
    }
})();
