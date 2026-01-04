// ==UserScript==
// @name         accessibility_盲网快捷键
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.1.6.1
// @description  可访问性优化
// @author       Veg
// @include    http://apk.qt06.com/*
// @include    http://*.amhl.net/*
// @include    http://*tingyouwang.com/*
// @include    http://bbs.amtkjy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36872/accessibility_%E7%9B%B2%E7%BD%91%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/36872/accessibility_%E7%9B%B2%E7%BD%91%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
`use strict`;
const host = window.location.host;
//包含页面所有元素的数组
let allElement = [];
//存储焦点元素的数组下标
let focusElementIndex;
function shortcutKey(k) {
    if (!k.altKey) {
        return false;
    } else {
        //获取页面所有元素，转成数组
        let all = document.all;
        if (all.length !== allElement.length) {
            allElement = Array.prototype.slice.call(all);
        }
        //获取焦点元素的数组下标
        focusElementIndex = allElement.indexOf(document.activeElement);
        if (host === 'bbs.amhl.net' || host === 'www.amhl.net' || host === 'apk.qt06.com' || host === 'tingyouwang.com' || host === 'www.tingyouwang.com' || host === 'bbs.amtkjy.com') {
            accesskey(k);
        }
    }
}
document.addEventListener('keydown', function (k) {
shortcutKey(k);
}, null);

function previousTarget(target, subscriptArray) {
    for (let i = 0, l = target.length || subscriptArray.length; i < l; i++) {
        if (focusElementIndex > subscriptArray[l - 1] || focusElementIndex <= subscriptArray[0]) {
            target[l - 1].focus();
            break;
        }
 else if (focusElementIndex <= subscriptArray[i]) {
            let xv = target.indexOf(target[i]);
            target[xv - 1].focus();
            break;
        }
    }
    return false;
}

function nextTarget(target, subscriptArray) {
    for (let i = 0, l = target.length || subscriptArray.length; i < l; i++) {
        if (focusElementIndex < subscriptArray[i]) {
            let xv = target.indexOf(target[i]);
            target[xv].focus();
            break;
        } else if (focusElementIndex < subscriptArray[0] || focusElementIndex >= subscriptArray[l - 1]) {
            target[0].focus();
            break;
        }
    }
    return false;
}

function accesskey(k) {
    let Xscript = [];
    var xAcc = handleKey('x', 'accesskey-x', Xscript);

    let Zscript = [];
    var zAcc = handleKey('z', 'accesskey-z', Zscript);

    if (k.shiftKey && k.altKey && k.keyCode == 88) {
        previousTarget(xAcc, Xscript);
    }
    if (k.shiftKey && k.altKey && k.keyCode == 90) {
        previousTarget(zAcc, Zscript);
    }
    if (k.shiftKey) return false;
    if (k.altKey && k.keyCode == 88) {
        nextTarget(xAcc, Xscript)
    }
    if (k.altKey && k.keyCode == 90) {
        nextTarget(zAcc, Zscript)
    }
}
var handleKey = function (a, b, c) {
    var d = allElement.filter(function (t) {
        if (t.hasAttribute && t.hasAttribute('accesskey') && t.getAttribute('accesskey') == a ||
            t.classList.contains(b)) {
            if (t.offsetParent !== null) {
                if (!t.classList.contains(b)) {
                    t.classList.add(b);
                    t.removeAttribute('accesskey', '*');
                }
                c.push(allElement.indexOf(t));
                return t;
            }
        }
    });
    return d;
}
})();
