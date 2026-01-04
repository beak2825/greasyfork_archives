// ==UserScript==
// @name         XD-Enhance
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  优化 PC 端的使用体验！样式美化 / 饼干备注 / 快捷切换饼干
// @author       syrinka
// @match        https://www.nmbxd1.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438164/XD-Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/438164/XD-Enhance.meta.js
// ==/UserScript==
 
var custom_style = '.h-threads-item-reply, .h-threads-item-ref { margin: 12px; width: 100%; border-radius: 16px; } .h-threads-item-reply > .h-threads-item-reply-icon, .h-threads-item-ref > .h-threads-item-reply-icon { display: none !important; } .h-threads-item-reply > .h-threads-item-reply-main, .h-threads-item-ref > .h-threads-item-reply-main { padding: 12px; border-radius: 16px; } .h-threads-item-reply > .h-threads-item-reply-main > .h-threads-info, .h-threads-item-ref > .h-threads-item-reply-main > .h-threads-info { width: 100%; } .h-threads-item-reply > .h-threads-item-reply-main > .h-threads-info > .h-threads-info-id, .h-threads-item-ref > .h-threads-item-reply-main > .h-threads-info > .h-threads-info-id { float: right; } .h-threads-img-box img { margin: 15px !important; } #h-content .uk-container { margin: 0 auto; transform: translate(-75px, 0); } #h-content .uk-pagination { margin: 0px auto; } #h-menu { transition: left 0.4s; height: 100% !important; width: 150px; left: -150px; } #h-menu:hover { left: 0px; } #h-bottom-nav { display: none; } #h-post-form > form > div:nth-child(2) { display: none; } #h-post-form > .h-forum-header { display: none; } .ae-box { display: none; position: fixed; right: 24px; bottom: 24px; font-size: 21px; background: #f0e0d6; padding: 15px; border-radius: 8px; font-family: Consolas; } .ae-cookie { display: block; margin: 5px; } #ae-toast { font-size: 16px; }'
 
 
function toast(msg) {
    $('#ae-toast').html(msg).fadeIn(500)
    setTimeout(function() {
        $('#ae-toast').fadeOut(500)
    }, 2000)
}
 
 
function init_check() {
    if (!GM_getValue('now-cookie', false) || !GM_getValue('cookies', false)) {
        toast('当前饼干信息不明! 请前往饼干列表页面并手动切换一次饼干')
        return false
    }
    return true
}
 
 
function get_desc(id) {
    var c = GM_getValue('cookies', null)
    if (!c || !c[id] || !c[id].desc) {
        return null
    } else {
        return c[id].desc
    }
}
 
 
function iset_desc(id) { // with prompt
    var c = GM_getValue('cookies')
    var ndesc = prompt('新备注:', c[id].desc)
    c[id].desc = ndesc
    GM_setValue('cookies', c)
}
 
 
function switch_cookie(cookie) {
    var url = 'https://www.nmbxd1.com/Member/User/Cookie/switchTo/id/' + cookie.id + '.html'
    $.ajax({
        type: 'get',
        url: url,
        success: function(r, status, xhr) {
            toast('切换成功! 当前饼干为 ' + cookie.name)
            GM_setValue('now-cookie', cookie)
        }
    })
}
 
 
function show_switch_panel() {
    $('#ae-switch-panel').remove() // 删除上次创建的 panel
    if (!init_check()) {
        return
    }
 
    $('body').append('<div id="ae-switch-panel" class="ae-box"></div>')
    var sp = $('#ae-switch-panel')
    sp.fadeIn(500)
 
    sp.on('mouseleave',
        ()=>$('#ae-switch-panel').fadeOut(500)
    )
    var cookies = GM_getValue('cookies', null)
    var nc = GM_getValue('now-cookie', null)
    var nc_id = nc?nc.id:null
    for (var id in cookies){
        var c = cookies[id]
        sp.append(
            '<a class="ae-cookie" title="' + c.desc + '">' + ((id===nc_id)?'● ':'○ ') + c.name + ' - ' + c.desc + '</a>'
        )
        sp.children().eq(-1).data('c', c)
        .on('click',
            function() {sp.fadeOut(500); switch_cookie($(this).data('c'))}
        )
    }
}
 
 
function threads_resolve(index, node) { // 对每个串的格式进行处理
    // 将图片盒移动到正文之后
    var box = $(this).children('.h-threads-img-box').remove()
    $(this).append(box)
}
 
 
function on_cookies_manager() {
    $('th.table-title').after('<th class="ae-table-desc">饼干备注</th>')
    $('tbody>tr>td:nth-child(3)').after('<td></td>')
    $('tbody>tr>td:nth-child(7) a:first-child').before('<a href="#" class="am-btn am-btn-default"><span class="am-icon-tag"></span> 修改备注 </a>')
    // 0       1   2     3         4         5         6
    // 多选框  ID  饼干  饼干备注  有效时间  领取时间  操作
 
    var cookies = {}
    $('tbody>tr').each(function(i, n) {
        var td = $(this).children()
        var id = td.eq(1).text()
        var desc = get_desc(id)
        cookies[id] = {
            id: id,
            name: td.eq(2).children().first().text(),
            desc: desc
        }
        td.eq(3).text(desc)
        td.eq(6).find('a:first-child').data('id', id)
            .on('click', function() {iset_desc($(this).data('id'))})
        td.eq(6).find('a:nth-child(2)').data('cookie', cookies[id]).attr('href', '#').off('click')
            .on('click', function() {switch_cookie($(this).data('cookie'))})
    })
    GM_setValue('cookies', cookies);
    console.log('♦ 饼干信息更新完毕 √')
 
    var nc = GM_getValue('now-cookie', null)
    var info = nc?('当前饼干为 ' + nc.name):('当前饼干信息不明，请手动切换一次饼干')
    $('table').after('<span>' + info + '</span>')
}
 
 
(function() {
    GM_addStyle(custom_style)
    // 插入 toast
    $('body').append('<div id="ae-toast" class="ae-box" style="text-align: center;"></div>')
 
    if (window.location.pathname === "/Member/User/Cookie/index.html") {
        // 饼干管理页面
        on_cookies_manager()
    } else {
        init_check()
 
        $('#h-tool').prepend(
            '<a id="ae-mem-page" href="/Member/User/Index/index.html" title="用户系统" class="h-tool-btn"><i class="uk-icon-home"></i></a>'
        )
        $('#h-tool').append(
            '<a id="ae-switcher-toggle" title="切换饼干" class="h-tool-btn"><i class="uk-icon-paper-plane"></i></a>'
        )
        $('#ae-switcher-toggle').on('click', ()=>show_switch_panel())
        // 处理串样式
        $('.h-threads-item-reply-main').each(threads_resolve)
    }
})();