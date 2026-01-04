// ==UserScript==
// @name         qidian
// @namespace    http://tampermonkey.net/
// @description	 起点，q开启换装，w关闭换装，a上一章，s下一章
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match			https://vipreader.qidian.com/chapter*
// @include			https://vipreader.qidian.com/chapter*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409868/qidian.user.js
// @updateURL https://update.greasyfork.org/scripts/409868/qidian.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $prevHref = document.querySelector('#j_chapterPrev')
    var $nextHref = document.querySelector('#j_chapterNext')
    var $favicon1 = document.querySelector('link[rel="shortcut icon"]');
    var $favicon2 = document.querySelector('link[rel="Bookmark"]');
    localStorage.setItem('qidianTitle', document.title)
    localStorage.setItem('qidianIconhref1', encodeURIComponent($favicon1.href))
    localStorage.setItem('qidianIconhref2', encodeURIComponent($favicon2.href))
    var format = function () {
        document.getElementsByTagName('body')[0].setAttribute('style', 'background:#fff;zoom:1')
        document.getElementById('readHeader').setAttribute('style', 'display:none')
        document.getElementsByClassName('crumbs-nav')[0].setAttribute('style', 'display:none')
        document.getElementById('j_leftBarList').setAttribute('style', 'display:none')
        document.getElementById('j_rightBarList').setAttribute('style', 'display:none')
        document.getElementsByClassName('text-wrap')[0].setAttribute('style', 'background:#fff;border:none')
        document.getElementsByClassName('section-comment-wrap')[0].setAttribute('style', 'background:#fff')
        document.getElementsByClassName('read-btn-box')[0].setAttribute('style', 'display:none')
        document.getElementsByClassName('chapter-control')[0].setAttribute('style', 'background:#fff')
        GM_addStyle('.review-count {background: #fff !important;color:#999 !important}')
        document.title = 'react'
        $favicon1.href = 'https://qidian.gtimg.com/qd/images/read.qidian.com/body_base_bg.5988a.png'
        $favicon2.href = 'https://qidian.gtimg.com/qd/images/read.qidian.com/body_base_bg.5988a.png'
    }
    var reset = function () {
        document.getElementsByTagName('body')[0].setAttribute('style', 'zoom:1')
        document.getElementById('readHeader').removeAttribute('style')
        document.getElementsByClassName('crumbs-nav')[0].removeAttribute('style')
        document.getElementById('j_leftBarList').removeAttribute('style')
        document.getElementById('j_rightBarList').removeAttribute('style')
        document.getElementsByClassName('text-wrap')[0].removeAttribute('style')
        document.getElementsByClassName('section-comment-wrap')[0].removeAttribute('style')
        document.getElementsByClassName('read-btn-box')[0].removeAttribute('style')
        document.getElementsByClassName('chapter-control')[0].removeAttribute('style')
        GM_addStyle('.review-count {background: #ddd;color:#999}')
        document.title = localStorage.getItem('qidianTitle')
        $favicon1.href = decodeURIComponent(localStorage.getItem('qidianIconhref1'))
        $favicon2.href = decodeURIComponent(localStorage.getItem('qidianIconhref2'))
    }
    document.onkeypress = function (event) {
        if (document.readyState != "interactive" &&
            document.readyState != "complete") {
            return;
        }
        var keycode = event.which || event.keyCode;
        if (keycode == 81 || keycode == 113) { //开启
            localStorage.setItem('qidianStyle', 'open')
            format()
        }
        if (keycode == 87 || keycode == 119) {
            localStorage.setItem('qidianStyle', 'close')
            reset()
        }
        if (keycode == 64 || keycode == 97) { //上一章
            window.location = $prevHref.href
        }
        if (keycode == 83 || keycode == 115) {//下一章
           window.location = $nextHref.href
        }
    };
    var qidianStyle = localStorage.getItem('qidianStyle')
    if (document.readyState != "interactive" && document.readyState != "complete") {
        document.onreadystatechange = function () {
            if (document.readyState == "interactive" || document.readyState == "complete") {
                setTimeout(function () {
                    if (qidianStyle == 'open') {
                        format()
                    } else {
                        reset()
                    }
                }, 55);
            }
        };
    } else {
        if (qidianStyle == 'open') {
            format()
        } else {
            reset()
        }
    }
})();