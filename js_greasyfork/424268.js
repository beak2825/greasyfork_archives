// ==UserScript==
// @name         macpeers优化
// @namespace    https://greasyfork.org/zh-CN/scripts/424268
// @version      0.5
// @description  macpeers自动对下载地址做超链接, 方便点击, 验证码和密码均支持点击复制到剪贴板
// @author       zhenhappy<q505507538@gmail.com>
// @icon         https://hkmacpeers-1259420093.file.myqcloud.com/favicon.ico
// @match        https://www.macpeers.net/*
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @require      https://unpkg.com/clipboard/dist/clipboard.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424268/macpeers%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424268/macpeers%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    console.log('macpeers>>>>>>>>')
    var t = setInterval(function () {
        try {
            var content = $('.post_content .STYLE2, .post_content .STYLE5')
            if (content.length > 0) {
                console.log('找到下载地址, 正在处理下载链接...')
                var _url, url, _code, code, _password, password
                $.each(content, function( index, value ) {
                    _url = /(http.*?)\s/g.exec($(this).text())
                    console.log(_url)
                    _code = /提取码.*?(\w+)\s*/g.exec($(this).text())
                    _password = /解压密码.*?(\w+)\s*/g.exec($(this).text())
                    if (_url && _url.length > 1 && _code && _code.length > 1) {
                        url = _url[1]
                        console.log('url:', url)
                        code = _code[1]
                        console.log('code:', code)
                        if (code) {
                            $(this).html('链接: <a href="' + url + '#' + code + '" target="' + url + '#' + code + '" rel="nofollow noopener noreferrer">' + url + '</a> 提取码: <span style="cursor: pointer;" id="code" data-clipboard-target="#code">'+code+'</span>')
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
                })
            } else throw(Error('未找到元素'))
            clearInterval(t)
            console.log('<<<<<<<<macpeers')
        } catch (e) {
            if ((e.message !== '未找到元素')) console.error('macpeers优化出错', e)
        }
    }, 500)
})()