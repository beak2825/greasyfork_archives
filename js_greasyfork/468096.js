// ==UserScript==
// @name         网页锁
// @namespace    https://sfkgroup.github.io/
// @version      0.1
// @description  可以对部分网页设置网页锁保护个人隐私(尤其是那些自动登录的网页).
// @author       SFKgroup
// @match        *://*/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/468096/%E7%BD%91%E9%A1%B5%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/468096/%E7%BD%91%E9%A1%B5%E9%94%81.meta.js
// ==/UserScript==

(function () {
    var lock_style = 'blur(25px) grayscale(100%)'
    var ban_list = GM_getValue('bans', [])
    var allow_list = GM_getValue('allow', [])
    var password = GM_getValue('pwd', '159357') // 小键盘上的X

    function set_this_url() {
        let url = window.location.href
        if (ban_list.indexOf(url) >= 0) { return 0 }
        ban_list.push(url)
        GM_setValue('bans', ban_list)
    }

    function set_all_url() {
        let url = window.location.origin + '*'
        if (ban_list.indexOf(url) >= 0) { return 0 }
        ban_list.push(url)
        GM_setValue('bans', ban_list)
    }

    function del_this_url() {
        let url = window.location.href
        var input_key = prompt("请输入访问密钥", "");
        if (input_key == password) {
            if (ban_list.indexOf(url) >= 0) {
                ban_list.splice(ban_list.indexOf(url), 1)
            } else {
                if (allow_list.indexOf(url) >= 0) { return 0 }
                allow_list.push(url)
            }
            GM_log(ban_list, allow_list)
            GM_setValue('bans', ban_list)
            GM_setValue('allow', allow_list)
        } else if (input_key != null) {
            alert('密钥错误.')
        }
    }

    function del_all_url() {
        let url = window.location.origin + '*'
        var input_key = prompt("请输入访问密钥", "");
        if (input_key == password) {
            if (ban_list.indexOf(url) >= 0) {
                ban_list.splice(ban_list.indexOf(url), 1)
            } else {
                if (allow_list.indexOf(url) >= 0) { return 0 }
                allow_list.push(url)
            }
            GM_log(ban_list, allow_list)
            GM_setValue('bans', ban_list)
            GM_setValue('allow', allow_list)
        } else if (input_key != null) {
            alert('密钥错误.')
        }

    }

    function clear_list() {
        var input_key = prompt("请输入访问密钥", "");
        if (input_key == password) {
            ban_list = []
            allow_list = []
            GM_setValue('bans', [])
            GM_setValue('allow', [])

        } else if (input_key != null) {
            alert('密钥错误.')
        }

    }

    function set_key() {
        var input_key = prompt("请输入旧的访问密钥", "");
        if (input_key == password) {
            var input_key = prompt("请输入新的访问密钥", "");
            if (input_key != null && input_key != "") {
                password = input_key
                GM_setValue('pwd', password)
            } else {
                alert('密码不能为空.')
            }
        } else if (input_key != null) {
            alert('密钥错误.')
        }
    }

    if (window.self === window.top) {

        GM_registerMenuCommand("添加本页面", set_this_url, "s");
        GM_registerMenuCommand("添加本网址", set_all_url, "a");
        GM_registerMenuCommand("解锁本页面", del_this_url, "d");
        GM_registerMenuCommand("解锁本网址", del_all_url, "r");
        GM_registerMenuCommand("重置所有列表", clear_list, "c");
        GM_registerMenuCommand("设置访问密钥", set_key, "p");

        var locking = false

        var self_url = window.location.href
        for (let i = 0; i < ban_list.length; i++) {
            if (self_url.search(ban_list[i]) >= 0) {
                if (allow_list.indexOf(self_url) < 0) {
                    document.getElementsByTagName('body')[0].style.filter = lock_style
                    locking = true
                    GM_log('Locked')
                    break
                }
            }
        }

        setTimeout(function () {
            if (locking) {
                for (let k = 0; k < 3; k++) {
                    var input_key = prompt("请输入访问密钥", "");
                    if (input_key == password) {
                        document.getElementsByTagName('body')[0].style.filter = ''
                        GM_log('UnLocked')
                        break
                    } else if (input_key == null) {
                        break
                    } else {
                        alert('密钥错误,还有' + (2 - k) + '次机会.')
                    }
                }
            }
        }, 100)
    }

})();