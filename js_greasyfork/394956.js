// ==UserScript==
// @name         HostLoc Block
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  hostloc block list
// @author       Golang
// @include      /https://www.hostloc.com/forum/
// @include      /https://www.hostloc.com/thread/
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/394956/HostLoc%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/394956/HostLoc%20Block.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let bl = localStorage.getItem('BlockList')

    if (location.href.indexOf('forum') > -1) {
        $("tbody[id^='normalthread']").each((i, e) => {
            let a = $(e).find('cite > a').first()
            let href = a.attr('href')
            let uid = href.match(/\d+/)[0]
            if (bl != null && bl.indexOf(uid) > -1) {
                $(e).remove()
            }
        })
    }

    if (location.href.indexOf('thread') > -1) {
        let bl = localStorage.getItem('BlockList')

        $('.authi > .xw1').each((i, e) => {
            let b = $('<a class="xi1" href="javascript:void(0);" style="float:right;margin-right:10px;">block</a>')
            $(e).after(b)
            let href = $(e).attr("href")
            let uid = href.match(/\d+/)[0]

            if (bl != null && bl.indexOf(uid) > -1) {
                $(e).parentsUntil("#postlist").last().remove()
            } else {
                b.click(() => {
                    let bl = localStorage.getItem('BlockList')
                    bl = bl ? `${list}|${uid}` : `${Date.now()}|${uid}`
                    localStorage.setItem('BlockList', bl)
                    location.reload()
                })
            }
        })
    }
})();