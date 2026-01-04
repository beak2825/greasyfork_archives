// ==UserScript==
// @name         清水河畔工具
// @namespace    https://greasyfork.org/zh-CN/users/672362-zhenger233
// @version      0.3.2
// @description  1.清水河畔帖子详情页面下滑至底部自动翻页 2.黑名单 3. 随便看看
// @author       Zhenger233
// @match        *://bbs.uestc.edu.cn/forum.php?mod=viewthread*
// @grant        none
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/408024/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/408024/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var setting = {
        autoGetNewPost: true,
        enableBlocklist: true,
        blocklist: []
    }
    var xmlhttp = new XMLHttpRequest();
    var argsPage = window.location.search.substr(1).match(new RegExp("(^|&)page=([^&]*)(&|$)", "i"));
    var nowPage = argsPage === null ? 1 : +argsPage[2];
    var thisURL = window.location.href;
    var maxPage;
    if (document.getElementsByClassName('nxt').length === 0) maxPage = 1;
    else maxPage = +document.getElementsByClassName('nxt')[0].previousElementSibling.innerText.replace(' / ', '').replace(' 页', '');
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //document.getElementById('postlistreply').previousElementSibling.appendChild(new DOMParser().parseFromString(xmlhttp.responseText, 'text/html').getElementById('postlist'));
            var p = new DOMParser().parseFromString(xmlhttp.responseText, 'text/html').getElementsByClassName('plhin');
            let newDiv = document.createElement("div");
            for (var i = 0; i < p.length;){
                 newDiv.append(p[i]);
            }
            document.getElementById('postlistreply').previousElementSibling.append(newDiv);

            preProcess();
            blockSomebody();
        }
    };
    var send1 = function () {
        if (nowPage < maxPage) {
            console.log('send', nowPage);
            xmlhttp.open('GET', thisURL.replace(/&page=[0-9]*/, '').replace(/#.*/, '') + '&page=' + String(++nowPage), false);
            xmlhttp.send();
        }
    };
    document.onscroll = function () {
        document.getElementById('postlistreply').getBoundingClientRect().y < 666 ? send1() : {};
    };

    var blockSomebody = function (somebody) {
        if (setting.enableBlocklist) {
            if (typeof somebody == 'string')
                for (let i of document.getElementsByClassName(somebody)) i.hidden = true;
            else if (typeof somebody == 'undefined') {
                for (let id of setting.blocklist)
                    for (let i of document.getElementsByClassName(id)) i.hidden = true;
            }
        }

    }

    var preProcess = function () {
        let pls = document.getElementsByClassName('pl bm');
        let pll = pls.length;
        for (let i = 0; i < pll - 1; i++) {
            if (pls[i].getElementsByClassName('blockClass').length) continue;
            let ps = Array.from(pls[i].childNodes);
            // ps.shift(); ps.shift(); ps.shift(); ps.shift(); ps.pop(); ps.pop();
            for (let j = 0; j < ps.length; j++) {
                if (ps[j].nodeType != 1 || ps[j].getElementsByClassName('xw1').length == 0) continue;
                let thisID = ps[j].getElementsByClassName('xw1')[0].href.substr(47);
                ps[j].className = thisID;
                let blockSpan = document.createElement('span');
                blockSpan.innerText = '|';
                blockSpan.className = 'pipe';
                let blocktext = document.createElement('a');
                blocktext.className = 'blockClass';
                blocktext.innerText = '不看该作者';
                blocktext.onclick = function () {
                    if (confirm('将该用户加入黑名单？')) {
                        setting.blocklist.push(thisID);
                        blockSomebody(thisID);
                    }
                }
                ps[j].getElementsByClassName('pipe')[0].parentNode.append(blockSpan, blocktext);
            }
        }
    }

    preProcess();
    var a = document.createElement('a');
    a.href=`forum.php?mod=viewthread&tid=${0|Math.random()*2270060}`
    a.innerText='随便看看';
    var s = document.createElement('span');
    s.appendChild(a);
    var l = document.querySelector("#toptb > div.z");
    l.appendChild(s);
    // Your code here...
})();