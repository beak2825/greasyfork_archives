// ==UserScript==
// @name         V2前端优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1,添加手写理由选项
// @author       丁振兴
// @match        https://live-media-monitor.wemomo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wemomo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463883/V2%E5%89%8D%E7%AB%AF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463883/V2%E5%89%8D%E7%AB%AF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function add_handwritten_reason() {

    var 手写理由 = "其他判罚请选择手写理由|不得穿着宗教服饰进行|严禁利用红领巾作为道具|严禁新闻联播等涉政内容|严禁长时间恶意挂机|严禁中出现sm道具|严禁中出现ASMR类表演|不得播放低俗诱惑性歌曲|严禁中演唱播放国歌、红歌|严禁播放禁播歌曲"

    var new_select = document.createElement('SELECT')
    new_select.id = 'show_handwritten_reason'

    var tishilist = 手写理由.split('|')

    tishilist.forEach(function add_tishi(item) {
        var new_opt = document.createElement('option')
        new_opt.text = item
        new_select.add(new_opt)

    })
    // document.querySelector('input[placeholder="可输入详细描述"]').parentElement.append(new_select)

    document.querySelector('input[placeholder="可输入详细描述"]').parentElement.parentElement.parentElement.append(new_select)

    new_select.onchange = function select_value() {
        document.querySelector('input[placeholder="可输入详细描述"]').value = new_select.value
    }
}

function refresh_auto() {
    if (document.querySelector('.q-dialog__inner') && document.querySelector('#show_handwritten_reason') == null) {
        add_handwritten_reason()
    }
}
window.onload = setInterval(refresh_auto, 500)


})();