// ==UserScript==
// @name         Alert弹窗拦截
// @namespace    https://www.aoaostar.com
// @version      0.1
// @description  某些网站会弹出alert弹窗很烦人，可以直接拦截输出到控制台
// @author       Pluto
// @license      GPL3.0
// @match        *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.aoaostar.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab

// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/454552/Alert%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/454552/Alert%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if(contain_platform()){
        unsafeWindow.alert = function(e){
            console.log(e)
        }
    }

    const MenuCommands = [
        {
            title: `${!contain_platform() ? '🍀 添加' : '🍁 删除'}网站`,
            func: function () {
                const b = contain_platform();
                let platforms_data = new Set(GM_getValue('platforms_data', []))
                !b ? platforms_data.add(document.domain) : platforms_data.delete(document.domain)
                GM_setValue('platforms_data', [...platforms_data])
                notification(`${b ? '删除' : '添加'}网站成功`)
                location.reload()
            }
        },
        {
            title: "💬 反馈 & 建议 [Github]",
            func: function () {
                GM_openInTab("https://github.com/aoaostar/cdn/issues")
            }
        },
    ]
    register_menu_command()

    function register_menu_command() {
        for (const command of MenuCommands) {
            GM_registerMenuCommand(command.title, command.func)
        }
    }

    function contain_platform() {
        return new Set(GM_getValue('platforms_data', [])).has(document.domain)
    }

    function notification(message) {
        GM_notification({
            text: message,
            timeout: 4000,
        })
    }

})();
