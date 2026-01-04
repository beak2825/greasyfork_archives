// ==UserScript==
// @name         豆瓣小组自动删除回复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动删除回复
// @author       nabe
// @match        *://www.douban.com/group/topic/*
//@grant none
// @downloadURL https://update.greasyfork.org/scripts/404711/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/404711/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let editOpts = $('.topic-admin-opts')
    const tid = location.href.match(/topic\/(\d+)\//)[1]
    const ck = get_cookie("ck")
    if (editOpts.children().length > 0) {
        editOpts.append('<span class="fleft" style="color:#ff0000;font-weight:bold;"><a id="auto-del">删除当页评论</a></span>')
        const $autoDel = $('#auto-del')
        $autoDel.click(function(e){
            e.stopImmediatePropagation()
            if (confirm('确定删除当前页面所有回复吗？')) {
                $.each($('.topic-reply li'), function(i, e) {
                    let cid = $(e).data('cid')
                    $.post(`https://www.douban.com/group/topic/${tid}/remove_comment?cid=${cid}`, {
                        ck: ck,
                        cid: cid,
                        reason: 0,
                        other: '',
                        submit: '确定'
                    }, function(data) {
                        console.log(data)
                        console.log('删除评论成功：' + cid)
                    })
                })
                setTimeout(location.reload(), 5000);
            }
        })
    }
})();