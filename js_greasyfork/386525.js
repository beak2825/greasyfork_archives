// ==UserScript==
// @name         码云助手
// @namespace    tag:URI
// @version      1.0.3
// @description  查看 pull request 时自动切换到双栏对比和全屏
// @author       kizi
// @match        https://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386525/%E7%A0%81%E4%BA%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386525/%E7%A0%81%E4%BA%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
    'use strick'

    var GiteeUtil = {
        addParallel : function() {
            var prlinks = $('#git-pull-requests a.title')
            for (var i in prlinks) {
                var link = prlinks[i]
                link.href += '?view=parallel'
            }
        },

        fullscreen : function() {
            var e = $('#fullscreen-btn')
                  , b = $('body')
                  , t = e.data('mode')
                  , n = e.find('i')
                  , i = e.find('.tips')
                  , o = window._web_tips || {}
                  , a = o.fullscreenTips || '全屏'
                  , r = o.fullscreenExitTips || '退出全屏';
            t = !t,
            t ? (e.addClass('active'),
            i.text(r),
            n.addClass('fa-compress').removeClass('fa-expand'),
            b.addClass('fullscreen-mode'),
            b.trigger('fullscreenchange', !0)) : (e.removeClass('active'),
            i.text(a),
            n.addClass('fa-expand').removeClass('fa-compress'),
            b.removeClass('fullscreen-mode'),
            b.trigger('fullscreenchange', !1)),
            e.data('mode', t)
        },

        redirectParallelView : function() {
            location.href += '?view=parallel'
        }
    }

    if (location.href.indexOf('/pulls?') > 0) {
        GiteeUtil.addParallel()
    }
    else if (location.href.indexOf('?view=parallel') > 0) {
        GiteeUtil.fullscreen()
    }
    else if (location.href.indexOf('/pulls/') > 0) {
        GiteeUtil.redirectParallelView()
    }
})()
