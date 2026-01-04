// ==UserScript==
// @name         TouPiao
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license MIT
// @author       bbyt
// @description 打开B站动态
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468181/TouPiao.user.js
// @updateURL https://update.greasyfork.org/scripts/468181/TouPiao.meta.js
// ==/UserScript==

(function() {
    'use strict';
function tp() {
        const params = new URLSearchParams();
        const data = {
            aid: '486313749',
            csrf: document.cookie.split(';').filter(item => item.indexOf('bili_jct') != -1)[0].split('=')[1],
            votes: '1'
        }
        for (let key in data) {
            params.append(key, data[key])
        }
        fetch("https://music.bilibili.com/x/web/music-open/activity/nextgen/recommend/vote", {
            method: 'post',
            headers: {
                "Cookie": document.cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            mode: "cors",
            credentials: "include",
            body: params
        })
            .then(response => response.text())
            .then(result => alert(result))
            .catch(error => console.log('error', error));

    }
    function init() {
        let hot = document.querySelector('.topic-panel')
        let right = document.querySelector('#app > div.bili-dyn-home--member > aside.right > section.sticky')
        right.style = 'display:flex;flex-direction: column;align-items: center;'
        let button = document.createElement('button')
        button.innerHTML = '投一票'
        button.style = "height:30px;margin-top:20px;background-color:#fff;border:none;border-radius:4px;"
        button.style.width=hot.clientWidth+'px'
        button.addEventListener('click', () => {
            tp()
        })
        right.appendChild(button)
    }
    let sti = setInterval(() => {
        if(document.querySelector('#app > div.bili-dyn-home--member > aside.right > section.sticky')!=null&&document.querySelector('.topic-panel')!=null){
            clearInterval(sti)
            console.log('success Mounted');
            init()
        }
    }, 200);
           

})();