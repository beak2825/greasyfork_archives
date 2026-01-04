// ==UserScript==
// @name         适配sis论坛手机端浏览
// @namespace    sexbbsmobileview
// @version      0.11
// @description  将sexinsex的PC端适配手机端浏览
// @author       You
// @match        *://sexinsex.net/*
// @match        *://gapipi.com/*
// @match        *://3d3d3d.net/*
// @match        *://bobo123.one/*
// @match        *://abc1abc1.com/*
// @match        *://stepco.xyz/*
// @match        *://twinai.xyz/*
// @match        *://d44.icu/*
// @match        *://sisav.club/*
// @match        *://v2r.club/*
// @match        *://sisav.one/*
// @match        *://stepncafe.com/*
// @match        *://catsis.info/*
// @match        *://67896789.cc/*
// @match        *://1e2e3e.me/*
// @match        *://t1t1t1.me/*
// @match        *://t2t2t2.me/*
// @match        *://t3t3t3.me/*
// @match        *://1e2e3e.me/*
// @match        *://gababa.me/*
// @match        *://qinkan.cc/*
// @match        *://h1h1h1.info/*
// @match        *://k1k1k1.info/*
// @match        *://g1g1g1.info/*
// @match        *://a1a1a1.live/*
// @match        *://a2a2a2.live/*
// @match        *://a3a3a3.live/*
// @match        *://kgkgkg.live/*
// @match        *://nenene.live/*
// @match        *://06image.com/*
// @match        *://gygygy.live/*
// @match        *://bababa.live/*
// @match        *://bububu.live/*
// @match        *://gagaga.live/*
// @match        *://hehehe.live/*
// @match        *://bluerocks.cc/*
// @match        *://174.127.195.176/*
// @match        *://174.127.195.178/*
// @match        *://174.127.195.201/*
// @match        *://174.127.195.183/*
// @match        *://174.127.195.66/*
// @match        *://174.127.195.69/*
// @match        *://174.127.195.98/*
// @match        *://174.127.195.102/*
// @match        *://174.127.195.186/*
// @match        *://174.127.195.188/*
// @match        *://174.127.195.173/*
// @match        *://174.127.195.171/*
// @match        *://174.127.195.166/*
// @match        *://174.127.195.187/*
// @match        *://174.127.195.182/*
// @match        *://174.127.195.184/*
// @match        *://kakaka.me/*
// @match        *://sasasa.me/*
// @match        *://1314365.me/*
// @match        *://hots.me/*
// @match        *://4meda.com/*
// @match        *://thatsucks.info/*
// @match        *://3651314.me/*
// @match        *://174.127.195.213/*
// @match        *://174.127.195.190/*
// @match        *://174.127.195.198/*
// @match        *://174.127.195.205/*
// @match        *://174.127.195.228/*
// @match        *://1dizhi.me/*
// @match        *://2dizhi.me/*
// @match        *://3dizhi.me/*
// @match        *://sendmyurl.com/*
// @match        *://diablos.cc/*
// @match        *://vr1p.com/*
// @match        *://popopo.me/*
// @match        *://a.1g2g3g.com/*
// @match        *://a.1u2u3u4u.com/*
// @match        *://b.1c2c3c.com/*
// @match        *://b.1c2c3c4c.com/*
// @match        *://c.1s2s3s.com/*
// @match        *://d.1y2y3y.com/*
// @match        *://a.1y2y3y4y.com/*
// @match        *://e.1v2v3v.com/*
// @match        *://1c2c3c4c.com/*
// @match        *://nihao1.me/*
// @match        *://nihao2.me/*
// @match        *://nihao3.me/*
// @match        *://yinmm.net/*
// @match        *://yx51.net/*
// @match        *://wowowo.me/*
// @match        *://yayaya.me/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480295/%E9%80%82%E9%85%8Dsis%E8%AE%BA%E5%9D%9B%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480295/%E9%80%82%E9%85%8Dsis%E8%AE%BA%E5%9D%9B%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    

    initmain();
    function initmain() { 
        appendMetaTag();       
        appendStyle();
        removeAdElements();
        addmessage();
    }

    function appendMetaTag() {
        var metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'viewport');
        metaTag.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        document.head.appendChild(metaTag);
    }

    function appendStyle() {
       var stylecss = `
        .hideaaaaa {
            display: none !important;
        }
        .box{
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .legend{
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        .postcontent img{
            max-width: 100% !important;
        }
        body{
            padding:0px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            font-size: 14px;
        }
        th.common,th.lock,th.new,th.hot{
            padding:12px 10px !important;
        }
        .forumlist tbody th.new{
            background-image: none !important;
        }
        .postoptions,td.folder,td.nums,td.lastpost,.ad_column,.ad_text,.headactions,.category,.separation,#recommendlist,
        td.postauthor,td.icon,td.author,#footer{
            display: none !important;
        }
        #menu,#menu2 {
            height: auto !important;
            display: inline-block !important;
            background-size: cover !important;
        }
        #nav a:first-child {
            font-size: 24px !important;
            display: block !important;
            margin: 8px 5px !important;
            color: #021498 !important;
        }
        #nav a#creditlist {
            font-size: 14px !important;
            display:inline !important;
            color: #222 !important;
            margin:0 !important;
        }
        `;

        if (isMobile()) {
            GM_addStyle(stylecss);
            var style = document.createElement('style');
            style.innerHTML = stylecss;
            document.body.appendChild(style);
        }

    }


    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function removeAdElements() {

        removeAndCheck('.ad_column');
        removeAndCheck('.ad_text');
        removeAndCheck('[id^="ad_intercat_"]');
        removeAndCheck('[id^="ad_thread"]');
        removeAndCheck('[id^="ad_footer"]');
        if (isMobile()) {

            removeAndCheck('#header');
            removeAndCheck('.headactions');
            removeAndCheck('.category');

            addHideClass('td.nums');
            addHideClass('td.lastpost');
            addHideClass('td.folder');
            addHideClass('td.icon');
            addHideClass('td.author');
            addHideClass('.separation');
            addHideClass('#recommendlist');
            addHideClass('td.postauthor');
        }
    }

    function removeAndCheck(...selectors) {
        selectors.forEach(selector => {
            var elements = document.querySelectorAll(selector);
            elements.forEach(element => element.parentNode.removeChild(element));
        });

        selectors.forEach(selector => {
            var removedElements = document.querySelectorAll(selector);
            if (removedElements.length === 0) {
                console.log(`成功移除 ${selector} 元素`);
            } else {
                console.log(`未能完全移除 ${selector} 元素`);
            }
        });
    }

    function addHideClass(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            element.classList.add('hideaaaaa');
        });
    }


    function addmessage() {
        var messageElement = document.querySelector('#message');
        if(!messageElement) return;
        var h1Element = document.querySelector('h1');
        var h1text = h1Element.innerText;
        var messages = [
            "非常感谢你的分享，受益匪浅！",
            "你的经验分享真是太好了，非常实用！",
            "感谢你的无私分享，让我收获颇丰！",
            "你的分享真是及时雨，牛逼，再接再厉！",
            "感谢你的分享，让我对这方面有了更深入的了解！",
            "你的分享真是太精彩了，让我大开眼界！",
            "非常感谢你的分享，让我看到了新的可能！",
            "你的分享真是让人大开眼界，非常感激！",
            "非常感谢你的无私奉献，让我收获颇丰！",
            "你的分享真是让我受益匪浅，非常感激！",
            "非常感谢你的无私奉献，让我看到了新的可能！",
            "感谢你的无私分享，让我收获颇丰！",
            "非常感谢你的分享，让我看到了新的可能！",
            "感谢你的精彩分享，学习了！"
        ];

        messageElement.value = h1text +'，'+ messages[Math.floor(Math.random() * messages.length)];
    }


})();