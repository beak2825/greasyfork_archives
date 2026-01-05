// ==UserScript==
// @name         Colorful Glasses
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  改变网页背景颜色（Changing the background color of web）
// @author       Zz
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/27904/Colorful%20Glasses.user.js
// @updateURL https://update.greasyfork.org/scripts/27904/Colorful%20Glasses.meta.js
// ==/UserScript==

var canvas = document.createElement('canvas');
var r = GM_getValue('r', 0);
var g = GM_getValue('g', 0);
var b = GM_getValue('b', 0);
var a = GM_getValue('a', 0.1);

GM_registerMenuCommand("改变背景颜色", function(){
    var color = prompt("请输入RGB颜色值和透明度，中间用逗号隔开，例如绿豆沙色 199,238,206,0.5","");
    var colors = color.split(',');
    if (colors.length == 4) {
        r = colors[0];
        GM_setValue('r',r);
        g = colors[1];
        GM_setValue('g',g);
        b = colors[2];
        GM_setValue('b',b);
        a = colors[3];
        GM_setValue('a',a);
        canvas.getContext('2d').fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        canvas.getContext('2d').clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
        canvas.getContext('2d').fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
    } else {
        alert("您输入的格式不对哦");
    }
});

GM_registerMenuCommand("默认背景颜色", function(){
    GM_setValue('r',0);
    GM_setValue('g',0);
    GM_setValue('b',0);
    GM_setValue('a',0.1);
    canvas.getContext('2d').fillStyle = 'rgba(0,0,0,0.1)';
    canvas.getContext('2d').clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
    canvas.getContext('2d').fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
});

canvas.style.position = 'fixed';
canvas.style.pointerEvents = 'none';
canvas.style.minWidth = '100%';
canvas.style.minHeight = '100%';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = 'auto';
canvas.style.height = 'auto';
canvas.style.zIndex = 10000;
var context = canvas.getContext('2d');
context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
context.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
document.body.insertBefore(canvas, document.body.firstChild);
