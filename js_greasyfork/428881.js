// ==UserScript==
// @name         去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  韩迷TV网站去广告
// @author       You
// @match        https://www.hmtv.me/*
// @icon         https://www.google.com/s2/favicons?domain=hmtv.me
// @include      *//www.hmtv.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428881/%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/428881/%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    console.log("开始运行脚本！")
    var left = document.getElementById('HMcoupletDivleft');
    var right = document.getElementById('HMcoupletDivright');
    var note = document.getElementById('note');
    var note_parent = note.parentNode;
    var left_right_Parent = left.parentNode;
    left_right_Parent.removeChild(left);
    left_right_Parent.removeChild(right);
    note_parent.removeChild(note);
    document.getElementsByName('__main_iframe__').forEach(item=>{
        var delNode = item.parentNode;
        var parent = delNode.parentNode
        parent.removeChild(delNode)
    })
    // Your code here...
};