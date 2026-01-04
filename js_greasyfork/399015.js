// ==UserScript==
// @name         Steam买买买
// @namespace    https://greasyfork.org/users/471937
// @version      0.8.0
// @description  在软锁区游戏商店页面自动显示widget、社区与愿望单链接
// @author       油油
// @match        store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steamdb.info
// @downloadURL https://update.greasyfork.org/scripts/399015/Steam%E4%B9%B0%E4%B9%B0%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/399015/Steam%E4%B9%B0%E4%B9%B0%E4%B9%B0.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    var url_path = location.pathname.split('/'),
        game_id = url_path[url_path.indexOf('app') + 1],
        user_id, game_title, game_image,
        game_subs, game_bundles, game_dlcs,
        steamdb_url = `https://steamdb.info/app/${game_id}/subs/`,
        tmp;

    // 绑定全局变量
    var $ = unsafeWindow.jQuery,
        AddToWishlist = unsafeWindow.AddToWishlist,
        ShowConfirmDialog = unsafeWindow.ShowConfirmDialog,
        ViewProductPage = unsafeWindow.ViewProductPage,
        sessionid = unsafeWindow.g_sessionID

    // 分域名处理
    switch (url_path[1]) {
        case 'widget':
        case 'sub': // 不作处理
            return
        case 'agecheck':
            // 自动agegate
            tmp = document.getElementsByClassName('agegate_birthday_selector')
            if (tmp.length) {
                document.getElementById('ageDay').value = 1
                document.getElementById('ageMonth').value = 'January'
                document.getElementById('ageYear').value = 1901
                ViewProductPage()
            }
        case 'app':
            match_user()
            if (game_id) anti_lock()
            break
    }

    // 匹配用户主页
    function match_user() {
        tmp = $('a.user_avatar').attr('href')
        if (tmp) user_id = tmp.match(/(id|profiles)\/.+?\//)[0]
    }

    // 反锁区
    function anti_lock() {
        tmp = $('#error_box')
        if (tmp[0]) {
            tmp.html('')// 清除原始内容

            // widget iframe
            add_frame(`${location.origin}/widget/${game_id}`, tmp)
            var img_panel, sub_panel
            tmp.append($('<div>').css({ width: '100%', display: 'flex' })
                .append(img_panel = $('<div>'))
                .append(sub_panel = $('<div>').css({ display: 'flex', 'flex-direction': 'column' }))
            )

            // 查询按钮
            var btn_div = $('<div>')
            tmp.append(btn_div)
            add_btn('添加到愿望单', () => {
                AddToWishlist(game_id)
                var wishlist_url = `/wishlist/${user_id}#sort=dateadded`
                if (game_title) wishlist_url += '&term=' + encodeURI(game_title)
                window.open(wishlist_url)
            }, btn_div)
            add_btn('社区中心', `https://steamcommunity.com/app/${game_id}/`, btn_div)

            // SteamDB查询信息
            query_steamDB(page => {
                // 匹配信息
                var title = page.find('.pagehead h1'),
                    icon = page.find('.row.app-row .span4 img'),
                    sub_tables = page.find('#subs table'),
                    dlc_tables = page.find('#dlc table')
                game_title = title.text()
                game_image = icon[0]
                for (var i = 0; i < sub_tables.length; i++) {// 搜索游戏sub+礼包
                    var table = sub_tables[i]
                    switch (table.rows[0].cells[0].innerText.toUpperCase()) {
                        case 'SUBID': // Sub
                            game_subs = iter_steamdb_table(table)
                            break
                        case 'ID': // Bundle
                            game_bundles = iter_steamdb_table(table)
                            break
                    }
                }
                if (dlc_tables.length > 0) game_dlcs = iter_steamdb_table(dlc_tables[0]) // 搜索游戏DLC

                // 写入信息
                if (game_title)
                    $('.pageheader').html(document.title = `买买买: ${game_title}`)
                else
                    $('.pageheader').parent().append(
                        $('<a>').attr('title', 'SteamDB').attr('href', steamdb_url).html('若页面未成功加载购买按钮，可尝试点击该链接后刷新')
                    )
                if (game_image) img_panel.append(
                    $('<a>').attr('title', 'SteamDB').attr('href', steamdb_url).append(game_image)
                )
                add_links('Sub列表', game_subs, '/sub/@/', sub_panel)
                add_links('DLC列表', game_dlcs, '/app/@/', sub_panel)
                add_links('礼包列表', game_bundles, '/bundle/@/', sub_panel)

                // 插入直接购买按钮
                game_subs.forEach(sub => {
                    add_cart_form(sub[0])
                    add_btn(
                        '购买' + sub[1], `javascript:addToCart(${sub[0]})`,
                        btn_div, { class: 'btnv6_green_white_innerfade btn_medium', title: `ID: ${sub[0]}` }
                    )
                })
            })
        }
    }

    // 添加按钮
    function add_btn(text, action, pool, assign = {}) {
        var btn = $('<a>').append($('<span>').append(text))
            .addClass('btnv6_blue_blue_innerfade btn_medium')
            .attr(assign)
        pool.append(btn)
        if (typeof action == 'function') btn.on('click', action)
        else btn.attr('href', action)
    }

    // 添加iframe
    function add_frame(url, pool) {
        var loader
        pool.append(
            loader = $('<iframe>').css('width', '100%')
                .attr('src', url)
                .on('load', () => {
                    var ifr = loader[0]
                    if ($(ifr.contentWindow.document).find('img').length)
                        ifr.style.height = `${ifr.contentWindow.document.body.scrollHeight}px`
                    else ifr.parentNode.removeChild(ifr)
                })
        )
    }

    // 批量添加按钮(DLC、礼包、Sub)
    function add_links(title, data, link_fmt, pool) {
        if (!(data && data.length > 0)) return
        pool.append(title)
        data.forEach(sub => add_btn(
            sub[1], link_fmt.replace(/@/g, sub[0]),
            pool, { class: 'btnv6_blue_hoverfade btn_small', title: `ID: ${sub[0]}` }
        ))
    }

    // SteamDB查询游戏信息
    var cached_page = null
    function query_steamDB(callback) {
        if (cached_page) callback(cached_page)
        else GM_xmlhttpRequest({
            method: 'GET',
            url: steamdb_url,
            onload: response => {
                var page = $(response.responseText)
                callback(cached_page = page)
            }
        })
    }

    // 迭代查询SteamDB package表格
    function iter_steamdb_table(table) {
        var res = []
        for (var tbody of table.tBodies) for (var row of tbody.rows) {
            row = row.cells
            if ($(row[1]).find('a').length > 0) res.push([
                row[0].innerText, // ID
                row[1].innerText, // 标题
            ])
        }
        return res
    }

    // 插入购物车表单
    function add_cart_form(subid) {
        $('body').append($('<form>')
            .attr({ name: `add_to_cart_${subid}`, action: '/cart/', method: 'POST', target: '_blank' })
            .append($('<input>').attr({ type: 'hidden', name: 'sessionid', value: sessionid }))
            .append($('<input>').attr({ type: 'hidden', name: 'action', value: "add_to_cart" }))
            .append($('<input>').attr({ type: 'hidden', name: 'subid', value: subid }))
        )
    }
});