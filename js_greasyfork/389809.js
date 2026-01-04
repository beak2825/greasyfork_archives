// ==UserScript==
// @name         141助手
// @namespace    https://141jav.com
// @version      3.7
// @description  测试
// @author       tuite
// @match        https://www.141jav.com/**
// @match        https://www.busfan.ink/**
// @match        https://pmvhaven.com/video/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389809/141%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389809/141%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    if (location.hostname == 'pmvhaven.com') {
        setTimeout(function() {
            let v = document.querySelector('#VideoPlayer').src
            v = v == '' ? document.querySelector('#VideoPlayer source').src : v
            document.querySelector('a').href = v
        }, 1500)
        return
    }

    if (location.hostname == 'www.busfan.ink') {
        console.log('busfan.ink-------------------------')
        setTimeout(function() {
            let n = document.querySelector('h3').innerText
            let code = n.split(' ')[0].toLowerCase()
            document.querySelector('h3').innerHTML = `<a href="https://www.njav.com/en/xvideos/${code}">${n}</a>`
        }, 1500)
        return
    }

    var jiagang = function (a, i) {
        var s = a.innerText.trim().split('');
        var n = a.innerText.search(/\d/);
        s.splice(n, 0, '-');
        a.href = 'https://www.busfan.ink/' + s.join('');
        // a.href = 'https://javdb.com/search?f=all&q=' + s.join('');
        a.insertAdjacentHTML('afterend', '<a href="https://www.javdatabase.com/movies/' + s.join('').toLowerCase() + '/">JDATA</a>&nbsp;');
        a.insertAdjacentHTML('afterend', '<a href="https://www.dmm.co.jp/mono/-/search/=/searchstr=' + a.innerText + '/">FANZA</a>');
    }

    document.querySelectorAll('.title.is-4.is-spaced a').forEach(jiagang)

    document.body.insertAdjacentHTML('beforebegin', `<button type="button" style="position: fixed; right: 0; top: 20%; height: 700px; width: 90px;" onclick="document.getElementsByClassName('pagination-next')[0].click()">Next</button>`)

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            // 在这里执行你想要的操作
            if (document.getElementById('next')) document.getElementById('next').click()
            else document.getElementsByClassName('pagination-next')[0].click()
        }
    });

    setInterval(function() {

        let noPage = document.querySelectorAll('h4').values().some(h => h.innerText === '404 Page Not Found!')
        if (noPage) {
            window.location.href = 'https://javmenu.com/zh' + window.location.pathname
        }
    }, 500);
})();

