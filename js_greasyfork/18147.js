// ==UserScript==
// @name            xiamp4.com Copy to Clipboard
// @name:zh-CN  xiamp4复制到剪贴板
// @namespace    http://xiamp4.com
// @version          0.1
// @description     Copy Multiple Links to Clipboard
// @description:zh-CN 复制多个链接到剪贴板
// @author           notXX
// @match           http://www.xiamp4.com/*
// @grant            GM_setClipboard 
// @grant            unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/18147/xiamp4com%20Copy%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/18147/xiamp4com%20Copy%20to%20Clipboard.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function CopyLink(n) { // 复制链接
    return (function(){
        function _(addr) {
            address.push(decodeURIComponent(addr.value));
        }
        //console.log(this);
        var address = [],
            checked = false,
            addrs = [].slice.apply(document.getElementsByName('CopyAddr' + (n + 1) + ''));
        addrs.forEach(function(addr) {
            if (!addr.checked) return;
            checked = true;
            _(addr);
        });
        if (!checked) {
            addrs.forEach(_);
            this.innerText = '已复制全部链接';
        } else {
            this.innerText = '已复制选中链接';
        }
        //console.log(address);
        GM_setClipboard(address.join('\n'));
    });
}

function CopyThunderLink(n) { // 复制迅雷链接
    return (function(){
        function _(addr) {
            //address.push(decodeURIComponent(addr.value));
            var li = addr.parentNode.parentNode,
                link = li.getElementsByClassName('d5')[0];
            address.push(link.href);
        }
        //console.log(this);
        var address = [],
            checked = false,
            addrs = [].slice.apply(document.getElementsByName('CopyAddr' + (n + 1) + ''));
        addrs.forEach(function(addr) {
            if (!addr.checked) return;
            checked = true;
            _(addr);
        });
        if (!checked) {
            addrs.forEach(_);
            this.innerText = '已复制全部链接';
        } else {
            this.innerText = '已复制选中链接';
        }
        //console.log(address);
        GM_setClipboard(address.join('\n'));
    });
}

var boxes = [].slice.apply(document.getElementsByClassName("ckbox"));
boxes.forEach(function(box, i) {
    var buttons = [].slice.apply(box.getElementsByTagName("a"));
    //console.log(buttons);
    if (buttons.length !== 4) return;
    var copyEd2k = buttons[0], // 复制链接
        copyThunder = buttons[1]; // 复制迅雷链接
    copyEd2k.removeAttribute("onclick");
    copyEd2k.innerText = '复制链接';
    copyEd2k.onclick = CopyLink(i);
    copyThunder.removeAttribute("onclick");
    copyThunder.innerText = '复制迅雷链接';
    copyThunder.onclick = CopyThunderLink(i);
});