// ==UserScript==
// @name         bilibili vip remover
// @name:zh-CN   bilibili大会员削除
// @namespace    myfreeer
// @version      0.11
// @description  remove the 'become-vip' link, repalce red names to original, and replace emoji to pure text
// @description:zh-CN  去除“成为大会员”链接，将红名替换为原始格式，替换表情为纯文字
// @author       myfreeer
// @match        http://*.bilibili.com/*
// @match        http://*.bilibili.com/
// @match        https://*.bilibili.com/*
// @match        https://*.bilibili.com/
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/23955/bilibili%20vip%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/23955/bilibili%20vip%20remover.meta.js
// ==/UserScript==
//edited from http://javascript.ruanyifeng.com/dom/mutationobserver.html
(function (win) {
    'use strict';

    var listeners = [];
    //var doc = window.document;
    //var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer;

    function ready(selector, fn) {
        // 储存选择器和回调函数
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // 监听document变化
            observer = new MutationObserver(check);

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        // 检查该节点是否已经在DOM中
        check();
    }

    function check() {
        // 检查是否匹配已储存的节点
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            // 检查指定节点是否有匹配
            var elements = document.querySelectorAll(listener.selector);
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                // 确保回调函数只会对该元素调用一次
                //if (!element.ready) {
                //    element.ready = true;
                //    // 对该节点调用回调函数
                listener.fn.call(element, element);
                //}
            }
        }
    }

    // 对外暴露ready
    win.ready = ready;
})(window);

//Compiled by Babel from https://gist.github.com/myfreeer/99111e7f10767770dc399e24bf6ab9b3
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//from https://lvwenhan.com/web-front/374.html
function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' '; //获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '); //将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    var removed = obj_class.replace(' ' + cls + ' ', ' '); //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, ''); //去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed; //替换原来的 class.
    return obj.className;
}

function addStyle(css) {
    if (!css) return false;
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

var obj = JSON.parse(GM_getValue('emoji', '{}'));
var refresh = function refresh() {
    return fetch('https://api.bilibili.com/x/v2/reply/emojis').then(function (e) {
        return e.json();
    }).then(function (json) {
        obj = {};
        if (!json.data) return;
        json.data.forEach(function (a) {
            return a.emojis && a.emojis.forEach(function (e) {
                return e.name && e.url && e.url.match(/^https?/) && (obj[new URL(e.url).pathname] = e.name);
            });
        });
        obj.time = Date.now();
        GM_setValue('emoji', JSON.stringify(obj));
    });
};
if (!(obj.time && Date.now() - 3600 * 1000 * 24 * 7 > obj.time)) refresh();
var img2str = function img2str(e) {
    if (!(e && e.alt && e.src && e.src.match('http'))) return;
    var name = '[' + e.alt + ']';
    var path = new URL(e.src).pathname.replace(/@[0-9]+w_[0-9]+h\.webp$/, '');
    if (path && obj[path]) name = obj[path];
    e.outerHTML = ' ' + name + ' ';
};

var becomevip = document.getElementById('i_menu_become_vip');
if (becomevip) becomevip.remove();
[].concat(_toConsumableArray(document.getElementsByClassName('b-vip-red')), _toConsumableArray(document.getElementsByClassName('vip-red-name'))).map(function (e) {
    return removeClass(e, 'b-vip-red') && removeClass(e, 'vip-red-name');
});
[].concat(_toConsumableArray(document.getElementsByClassName('b-vip-emoji'))).map(function (e) {
    return e.outerHTML = e.alt;
});
[].concat(_toConsumableArray(document.getElementsByClassName('h-vipType'))).map(function (e) {
    return e.remove && e.remove();
});
[].concat(_toConsumableArray(document.querySelectorAll('span.user-auth-subscript'))).map(function (e) {
    return e.remove && e.title.match("大会员") && e.remove();
});
[].concat(_toConsumableArray(document.querySelectorAll('#bbComment > .bb-comment > .comment-list > div > .con > p > img'))).map(img2str);
document.querySelectorAll('a[href="//account.bilibili.com/account/big"]').forEach(function (e) {
  return e.parentNode.className == 'nav-item' && e.parentNode.remove();
});
ready('.b-vip-red', function (e) {
    return removeClass(e, 'b-vip-red');
});
ready('.vip-red-name', function (e) {
    return removeClass(e, 'vip-red-name');
});
ready('.b-vip-emoji', function (e) {
    return e.outerHTML = e.alt;
});
ready('#bbComment > .bb-comment > .comment-list > div > .con > p > img', img2str);
ready('.h-vipType', function (e) {
    return e.remove && e.remove();
});
ready('span.user-auth-subscript', function (e) {
    return e.remove && e.title.match("大会员") && e.remove();
});
ready('.nav-item', function (e) {
  return e.innerHTML.match("account.bilibili.com/account/big") && e.remove();
});
addStyle('.user-auth-subscript{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC61BMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9Kx///ulBLx///ulL/u1JKxv/7/v9Tyv961v9OyP+W3//9/v//vlr/ulH+//////7/zH///v3/xWz/6MX/vVn/+vP/5sG+6/9m0P///fye4f/x+////fv/15r/3KaG2v//0Yv/0IqF2f9r0f9t0v//x3H/2qL/8+Lg9f9q0f/h9v//u1TE7f+Z3///x3L/w2dhzv//0o6J3P/D7P/y+//v+v//vFWd4f9Pyf//+e//+vGZ4P//2Z2i4v951f//zH7/6cZTy/+X3///2J3/yHT/xGpMyP//u1P/26T/+/Vs0v//xm7/+vL/x3D/9+xgzv//zHv/0Yr/wmRezf///fr/vFZo0P//4rb/6MbD7f//vVf/15v/yHP/2qH7/f9Mx/9kz///z4X0/P911f9u0v//0IiD2f/s+f/q+P9p0P+L2/+S3f//1Zb/05Cz6P//wWP//Pn/vVag4v///PvF7v//3qyo5P//1pj/9OL/2Z+h4v9Syf/5/f//xW3/3an/vFSB2P//wmb/9OGl4//v+/9x1P/8/v9dzf/6/f/0+//G7f//x27w+v//9uno+P+y5///47hv0v+16P/m9///9ueP3f//9eX/+O3k9///yXdVy///yXj/1ZX/v12F2v//zYD/1pn/6MT/6cj/6cdPyv//6cX/+fH/4rWT3v+G2f+T3/+w5///4bLVqU8YAAAAS3RSTlMAn7UenB/Y6fr5wa3zcKdNm5n76lgrSuHg0tEYGZRGU1TCWdWWrCBvaqjomE7rUlz1tgMaFhcB2pUVVx2015pHz5IIBUELE0kqQDPKG4W9AAAF/UlEQVR4Xu2ZVXAbVx9HG8cc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) !important}.h-vipType,#i_menu_become_vip{display:none !important}');