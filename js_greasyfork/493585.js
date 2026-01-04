// ==UserScript==
// @name         3DM论坛回复
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license MIT
// @description  点击回复按钮自动回复论坛帖子
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @author       feirnova
// @match        *://bbs.3dmgame.com/thread*
// @match        *://bbs.3dmgame.com/forum.php?mod=viewthread*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493585/3DM%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/493585/3DM%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function ($) {
    'use strict';
    const _$ = $.noConflict()
    const reply = () => {
        const tiz = _$('.t_f')
        const tl = tiz.length
        let rep_txt = ''
        if (tl > 5) {
            const rn = Math.floor(1 + Math.random() * (tl - 1))
            rep_txt = tiz[rn].innerText.replace('\n', '')
        } else {
            const reply_arr = ['谢谢分享，很有用！', '非常感谢', '继续加油，支持', '同意，确实是这样', '我会认真阅读这个帖子的', '6666666666666666666666', '顶顶顶顶顶顶', '111111111111111111111111111111', '任务回复~任务回复~任务回复~111', '支持支持支持支持支持支持支持支持支持支持支持', '看起来还不错啊', '看看有多少人参加']
            const rn = Math.floor(Math.random() * reply_arr.length)
            rep_txt = reply_arr[rn]
        }
        _$('#fastpostmessage').text(rep_txt)
        document.getElementById('fastpostsubmit').click()
    }
    const loadUI = () => {
        const el = _$(`<div id="r-box" style="height:22px;width:300px;z-index:9999999;position:absolute;top:5px;left:230px;padding-top:4px"><btn id="rep_tie" style="color:red;cursor:pointer">回帖</btn></div>`);
        el.children('btn').click(reply);
        _$('body').append(el);
    }

    try {
        loadUI()
    } catch (e) {
    }
})(jQuery);
