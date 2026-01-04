// ==UserScript==
// @name         游戏年轮下载优化
// @namespace    https://greasyfork.org/zh-CN/scripts/421664
// @version      1.4
// @author       zhenhappy<q505507538@gmail.com>
// @description  游戏年轮自动对下载地址做超链接, 方便点击, 验证码和密码均支持点击复制到剪贴板, 遇到未评论的会自动评论
// @icon         https://www.2023game.com/resources/img/favicon.ico
// @match        http*://www.2023game.com/*
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @require      https://unpkg.com/clipboard/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/421664/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421664/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E4%B8%8B%E8%BD%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    console.log('游戏年轮下载优化>>>>>>>>')
    var t = setInterval(function () {
        try {
            if ($('.head_box').html()) {
                if ($('header').html()) {
                    $('header > .hd_top, header > .nav_togg').remove()
                    $('header').css ({
                        height: '80px'
                    })
                    $('header').find('nav, .vg_list, .vg_logo > a').css ({
                        height: '80px'
                    })
                    $('header').find('.vg_logo > a').css({
                        backgroundPositionY: '-10px'
                    })
                    $('header').find('.vg_list > li').css({
                        height: '40px',
                        lineHeight: '40px',
                        marginBottom: '0'
                    })
                }
                if ($('.ver_nav').html()) {
                    $('.ver_nav').remove()
                }
            } else throw(Error('未找到元素'))
            if ($('#chakan').html() && $('#pl-520am-f-saytext')) {
                var _url, url, isBaidu, _code, code, _password, password
                $.each($('#chakan p'), function( index, value ) {
                    console.log($(this).text())
                    _url = /(pan\.baidu\.com.*?)\s/g.exec($(this).text())
                    console.log('_url: ', _url)
                    isBaidu = /pan\.baidu\.com/.test($(this).text())
                    _code = /提取码.*([A-Za-z0-9]{4})/g.exec($(this).text())
                    console.log('_code: ', _code)
                    _password = /解压密码：(.+)/g.exec($(this).text())
                    console.log('_password: ', _password)
                    if (isBaidu) {
                        if (_url && _url.length > 1) {
                            url = 'https://' + _url[1]
                            console.log('url:', url)
                            if (url) {
                                $('#chakan p').eq(0).html('链接：<a style="border: none;text-decoration: none;" href="' + url + '" target="_blank">' + url + '</a>')
                            }
                        }
                        if (_code && _code.length > 1) {
                            code = _code[1]
                            console.log('code:', code)
                            if (code) {
                                $('#chakan p').eq(0).html('链接：<a style="border: none;text-decoration: none;" href="' + url + '#' + code + '" target="_blank">' + url + '</a> 提取码：<span style="cursor: pointer;" id="code" data-clipboard-target="#code">'+code+'</span>')
                                //$(this).html('提取码：<span style="cursor: pointer;" id="code" data-clipboard-target="#code">'+code+'</span>')
                                new ClipboardJS('#code')
                            }
                        }
                        if (_password && _password.length > 1) {
                            password = _password[1]
                            console.log('password:', password)
                            if (password) {
                                $(this).html('解压密码：<span style="cursor: pointer;" id="password" data-clipboard-target="#password">'+password+'</span>')
                                new ClipboardJS('#password')
                            }
                        }
                    }
                    if (/发表评论后/g.test($(this).text())) {
                        console.log('发表评论后')
                        $('#pl-520am-f-saytext').val('感谢分享')
                        $('#pl-submit-btn-main').click()
                        window.location.reload()
                    }
                })
            } else throw(Error('未找到元素'))
            if ($('.main_body').html()) {
                $('.main_body').css({
                    paddingLeft: '0'
                })
                if ($('.vg_main').html()) {
                    $('.vg_main').css({
                        paddingTop: '80px'
                    })
                }
                if ($('.main_right').html()) {
                    $('.main_right').remove()
                }
                if ($('.main_left').html()) {
                    if ($('.listad').html()) $('.listad').remove()
                    $('.main_left').css({
                        width: '100%',
                        margin: '0 auto',
                        maxWidth: 'unset'
                    })
                    $('.main_left > .bread_crumb_nav').css({
                        width: '100%'
                    })
                    $('.main_left > .article').css({
                        width: '100%'
                    })
                    $('.front_content iframe').css({
                        display: 'block',
                        margin: '0 auto',
                        maxWidth: '700px'
                    })
                    $('.topicContent table td').css({
                        background: 'none'
                    })
                    $('.topicContent table td a').css({
                        border: 'none'
                    })
                }
            } else throw(Error('未找到元素'))
            if ($('footer').html()) {
                $('footer').remove()
            } else throw(Error('未找到元素'))
            if ($('.topicContent > script').length > 0) {
                $('.topicContent > script').eq(0).nextAll().remove()
            } else throw(Error('未找到元素'))
            if ($('.fot_box').html()) {
                $('.fot_box').remove()
            } else throw(Error('未找到元素'))
            clearInterval(t)
            console.log('<<<<<<<<游戏年轮下载优化')
        } catch (e) {
            if ((e.message !== '未找到元素')) console.error('游戏年轮下载优化出错', e)
        }
    }, 500)
})()