// ==UserScript==
// @name         [niconico video] Add the "Add My List" button to mylist page
// @name:ja      [ニコニコ動画] マイリストページからマイリストするボタンを追加
// @description  Add the "Add My List" button to niconico video mylist page
// @description:ja マイリストページからマイリストするボタンを追加
// @namespace    masshiro.blog
// @version      20200412
// @author       masshiro
// @license      MIT License
// @match        http://www.nicovideo.jp/mylist/*
// @match        https://www.nicovideo.jp/mylist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27463/%5Bniconico%20video%5D%20Add%20the%20%22Add%20My%20List%22%20button%20to%20mylist%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/27463/%5Bniconico%20video%5D%20Add%20the%20%22Add%20My%20List%22%20button%20to%20mylist%20page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var addButtons = function () {
        var span = document.createElement('span');
        span.style='color:#F00;text-decoration:underline;cursor:pointer';
        span.innerHTML='追加';

        var a = document.createElement('a');
        a.className = 'addmylist';
        a.appendChild(span);

        a.addEventListener('click',function () {
            window.open('http://www.nicovideo.jp/mylist_add/video/' + encodeURIComponent(document.querySelectorAll('.SYS_box_item')[0].querySelectorAll('a')[0].getAttribute('href').replace('watch/','')), 'nicomylistadd', 'width=500, height=400, menubar=no, scrollbars=no');
        },false);

        Array.prototype.forEach.call(document.querySelectorAll('.SYS_box_item_buttons p'), function(item,i) {
            if(typeof item.querySelectorAll('a.addmylist')[0] === 'undefined'){
                var as = a.cloneNode(true);
                as.addEventListener('click',function () {
                    window.open('http://www.nicovideo.jp/mylist_add/video/' + encodeURIComponent(document.querySelectorAll('.SYS_box_item')[i].querySelectorAll('a')[0].getAttribute('href').replace('watch/','')), 'nicomylistadd', 'width=500, height=400, menubar=no, scrollbars=no');
                },false);
                item.appendChild(as);
            }
        });
    };
    
    var DOMObserverTimer = false;
    var DOMObserverConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };
    var DOMObserver = new MutationObserver(function () {
        if (DOMObserverTimer !== 'false') {
            clearTimeout(DOMObserverTimer);
        }
        DOMObserverTimer = setTimeout(function () {
            DOMObserver.disconnect();
            addButtons();
            DOMObserver.observe(document.body, DOMObserverConfig);
        }, 100);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);

})();