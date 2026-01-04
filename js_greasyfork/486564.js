// ==UserScript==
// @name         V2 非本人 显示正常比例2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  实名认证增加批量提交按钮
// @author       You
// @match        https://live-media-monitor.wemomo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wemomo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486564/V2%20%E9%9D%9E%E6%9C%AC%E4%BA%BA%20%E6%98%BE%E7%A4%BA%E6%AD%A3%E5%B8%B8%E6%AF%94%E4%BE%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/486564/V2%20%E9%9D%9E%E6%9C%AC%E4%BA%BA%20%E6%98%BE%E7%A4%BA%E6%AD%A3%E5%B8%B8%E6%AF%94%E4%BE%8B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

function mh() {

    // V2 非本人 批量

    var myhead = document.querySelector('.q-table__bottom')
    //document.querySelector('.q-form')
    var button1 = document.createElement("button");
    button1.id = 'fbrbohui'
    button1.innerHTML = '批量异常';
    // button1.onclick = zuoButton
    button1.style.marginRight = '250px'
    button1.style.height = '50px'
    button1.style.position = 'absolute'
    button1.style.right = '0px'
    button1.style.zIndex = 3
    button1.style.backgroundColor = 'red'
    if (myhead) {
        myhead.appendChild(button1);
    }

    var button2 = document.createElement("button");
    button2.id = 'fbrpass'
    button2.innerHTML = '批量无异常';
    //  button2.onclick = youButton
    button2.style.marginRight = '150px'
    button2.style.height = '50px'
    button2.style.position = 'absolute'
    button2.style.right = '0px'
    button2.style.zIndex = 3
    if (myhead) {
        myhead.appendChild(button2);

    }

    document.querySelectorAll('.expand-info').forEach(function (item) {
        item.style.padding = 0
    })
    document.querySelector('form').style.display = 'none'

    function bili() {
        var timg = document.querySelectorAll('div.expand-info div:nth-child(1) div.con-img:nth-child(1) img')
        for (let i = 0; i < timg.length; i++) {
            document.querySelectorAll('div.expand-info div:nth-child(1) div.con-img:nth-child(1)')[i].style.width = 180 * timg[i].naturalWidth / timg[i].naturalHeight + 'px'
        }

        function zuoButton() {
            document.querySelectorAll('tr td button:nth-child(1)').forEach(function (item) {
                setTimeout(item.click(), 1000)

            })
        }
        function youButton() {
            document.querySelectorAll('tr td button:nth-child(2)').forEach(function (item) {
                setTimeout(item.click(), 1000)

            })
        }
        document.querySelector('#fbrbohui').onclick = zuoButton
        document.querySelector('#fbrpass').onclick = youButton
    }

    //V2 非本人 实名认证正常比例显示

    setInterval(bili, 800)
}

window.onload = function() {
    if (window.location.href.indexOf('abnormalNewAnchor') > -1) {
        mh()
    }
}


    // Your code here...
})();