// ==UserScript==
// @name         微博WAP版助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从微博WAP版跳转到PC版或触屏版
// @author       andriasw, snomiao
// @match        https://weibo.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412664/%E5%BE%AE%E5%8D%9AWAP%E7%89%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/412664/%E5%BE%AE%E5%8D%9AWAP%E7%89%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url=window.location.href;
    var urlPC='https://weibo.com/';
    var urlM='https://m.weibo.cn/';

    const a = (text, link) => { // thx snomiao
        var a = document.createElement("a");
        a.innerText=text; a.classList.add('nl'); a.href=link;
        var txt = document.createTextNode("|");
        document.querySelector('.n').children[2].parentElement.appendChild(txt)
        document.querySelector('.n').children[2].parentElement.appendChild(a)
    }

    const btn = (link=urlPC, m=urlM, repost=0) => {
        var tailPC = (repost)?'?type=repost':'';
        var tailM = (repost)?'#repost':'';
        a("PC版", link+tailPC)
        a("触屏版", m+tailM)
    } // Add link on page to PC version

    // Homepage, profile page or specific Weibo page?
    if(document.title === '我的首页') btn(); // Do nothing if on homepage.
    else {
        const uidRe=/\?uid=(\d+)/;

        if(document.getElementsByClassName('ut').length) {
            const uid = 'u/'+document.getElementsByClassName('ut')[0].innerHTML.match(uidRe)[1]; // The class 'ut' also appears in the homepage, hence line 34 to exclude homepage first.
            btn(urlPC+uid, urlM+uid);
        }

        else if(document.getElementById('M_') !== null) { // The corresponding element that contains uid...
            const weiboID = url.match(/\/(comment|repost)\/(\w+)(\/|\?)?/)[2];
            const uid = document.getElementById('M_').innerHTML.match(uidRe)[1]+'/';
            btn(urlPC+uid+weiboID, urlM+'status/'+weiboID, url.indexOf("/repost/")!=-1);
        }
    }

})();