// ==UserScript==
// @name        吃掉小鹿乃
// @namespace   Violentmonkey Scripts
// @license     @
// @match       https://xingye.me/game/eatkano/*
// @match       http://app.mczyz.xyz/cdxln/
// @match       https://deyi233.github.io/EatRui/index.html
// @match       https://eafoo.github.io/Eafoo/
// @match       https://eafoo.github.io/eatcat/
// @version     1.6
// @author      -
// @description 2021/12/22 上午10:35:13
// @downloadURL https://update.greasyfork.org/scripts/439048/%E5%90%83%E6%8E%89%E5%B0%8F%E9%B9%BF%E4%B9%83.user.js
// @updateURL https://update.greasyfork.org/scripts/439048/%E5%90%83%E6%8E%89%E5%B0%8F%E9%B9%BF%E4%B9%83.meta.js
// ==/UserScript==
var GameLayerBG = document.getElementById('GameLayerBG');
var body = document.getElementsByTagName('body');
body = body[0];
var butt = document.createElement("button");
butt.setAttribute("id", "djks");
butt.setAttribute("style", "z-index: 9999999;width: 120px;height: 70px;position: fixed;top: 40%");
body.appendChild(butt);

var djks = document.getElementById('djks');
djks.innerHTML = '点击开始';
djks.onclick = function () {
    fkdyb = document.getElementById('GameLayer1-0').offsetWidth / 2;
    var qbfk = document.querySelectorAll('#GameLayerBG>.GameLayer>.block');
    var fs = prompt("输入你需要的分");
    for (var j = 0; j <= fs / (qbfk.length/4); j++) {
        if (j == 0) {
            if (fs < ((qbfk.length/4)-1)) {
                fs++;
                wg(1, fs);
                break;
            } else {
                wg(1, (qbfk.length/4));
            }
        } else if (!(j + 1 > fs / (qbfk.length/4) && (fs - ((qbfk.length/4)-1)) % (qbfk.length/4) != 0)) {
            wg(0, (qbfk.length/4));
        } else {
            wg(0, (fs - ((qbfk.length/4)-1)) - ((qbfk.length/4) * (j - 1)));
        }
    }
}

function wg(i, k) {
    i *= 4;
    k *= 4;
    for (; i < k; i++) {
        var qbfk = document.querySelectorAll('#GameLayerBG>.GameLayer>.block');
        if (!(qbfk[i].className == 'block' || qbfk[i].className == 'block bl')) {
            var ev = document.createEvent('HTMLEvents');
            ev.clientX = (((document.documentElement.clientWidth - GameLayerBG.offsetWidth) / 2) + (GameLayerBG.offsetWidth * (((i % 4) + 1) / 4))) - fkdyb;
            ev.clientY = GameLayerBG.offsetHeight * (5 / 6);
            // console.log(ev.clientX+","+ev.clientY);
            ev.initEvent('mousedown', true, true);
            GameLayerBG.dispatchEvent(ev);
            ev.initEvent('touchstart', true, true);
            GameLayerBG.dispatchEvent(ev);
        }
    }
}