// ==UserScript==
// @name         傲星英华学堂网课助手
// @namespace    https://yinghuaonline.aoaostar.com
// @version      2.4.3
// @description  英华学堂在线网课全自动挂机脚本，支持验证码识别
// @author       Pluto
// @icon         https://www.aoaostar.com/favicon.ico
// @license      GPL-3.0 License
// @supportURL   https://www.aoaostar.com
// @homepageURL  https://github.com/aoaostar
// @connect *
// @match */*
// @webRequest   {"selector": "*static/user/js/video.js*", "action": "cancel"}
// @grant  GM_addElement
// @grant  GM_setValue
// @grant  GM_getValue
// @grant  GM_registerMenuCommand
// @grant  GM_unregisterMenuCommand
// @grant  GM_xmlhttpRequest
// @grant  GM_notification
// @grant  GM_listValues
// @grant  GM_info
// @grant  GM_log
// @grant  GM_addStyle
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require https://greasyfork.org/scripts/447800/code/ckplayer.js
// @require https://greasyfork.org/scripts/447799/code/aoaostar-yinghua-main.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/439148/%E5%82%B2%E6%98%9F%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439148/%E5%82%B2%E6%98%9F%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    $(function () {
        if (!contain_platform()) {
            return
        }
        // 去除烦人的第一次登录信息框
        const layer_close = setInterval(() => {
            if ($('.layui-layer-content').text().includes("您可能是第一次登录系统")) {
                layer.closeAll()
                clearInterval(layer_close)
            }
        }, 500)

        if (window.location.pathname.match('/user/node')) {
            //初始化面板
            init_panel()
            aoaostar_main()
        }
        if (window.location.pathname.match('/user/login') && GM_getValue('menu_force_login', true)) {
            GM_addStyle('#code_row{display:none;}')
            $('#login-title').text('学生登录（已开启封号强登）')
            $('#loginForm > .list > .item:last-child').html(`<div class="inpbox">
                                <input type="button" class="btn" id="force_login" value="强制登录"/>
                            </div>`)
            $("#loginForm").off()
            $('#force_login').click(force_login)
            // 监听回车
            $("#password").keydown((e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $('#force_login').click()
                }
            })
        }
    })
    const MenuCommands = [
        {
            title: (GM_getValue('menu_force_login', true) ? '✅' : '❌') + " 强制登录（封号强登）",
            func: function () {
                GM_setValue('menu_force_login', !GM_getValue('menu_force_login', true))
                notification('切换成功')
                location.reload()
            }
        },
        {
            title: (low_consumption_mode_enabled() ? '✅' : '❌') + " 省流模式",
            func: function () {
                GM_setValue('menu_low_consumption_mode', !low_consumption_mode_enabled())
                notification('切换成功')
                location.reload()
            }
        },
        {
            title: `${!contain_platform() ? '🍀 添加' : '🍁 删除'}平台`,
            func: function () {
                const b = contain_platform();
                let platforms_data = new Set(GM_getValue('platforms_data', []))
                !b ? platforms_data.add(document.domain) : platforms_data.delete(document.domain)
                GM_setValue('platforms_data', [...platforms_data])
                notification(`${b ? '删除' : '添加'}平台成功`)
                location.reload()
            }
        },
        {
            title: "💬 反馈 & 建议 [Github]",
            func: function () {
                window.open("https://github.com/aoaostar/cdn/issues")
            }
        },
    ]

    register_menu_command()

    function register_menu_command() {
        for (const command of MenuCommands) {
            GM_registerMenuCommand(command.title, command.func)
        }
    }

    function force_login() {
        const username = $('#username').val() || '';
        const password = $('#password').val() || '';
        const schoolId = $('#schoolId').val() || '';
        if ($('#remember').is(':checked') && window.localStorage) {
            localStorage.setItem("schoolId", schoolId);
            localStorage.setItem("userName", username);
            localStorage.setItem("passWord", password);
            localStorage.setItem("remember", '1');
        }
        let data = {
            platform: 'Android',
            username: username,
            password: password,
            pushId: '140fe1da9e67b9c14a7',
            schoolId: schoolId,
            imgSign: '533560501d19cc30271a850810b09e3e',
            imgCode: 'cryd',
        }
        let formData = new FormData();
        for (const dataKey in data) {
            formData.append(dataKey, data[dataKey])
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: '/api/login.json',
            data: formData,
            onload: function (response) {

                if (response.readyState === 4 && response.status === 200) {
                    const content = JSON.parse(response.responseText);
                    if (content.status) {
                        let domainArr = document.domain.split('.')
                        let domain = document.domain
                        if (domainArr.length > 2) {
                            domain = domainArr.slice(1).join('.')
                        }
                        document.cookie = `token=${encodeURIComponent(content.result.data.token)}; domain=${domain}; path=/`
                        notification("强制登录成功")
                        window.location.href = '/user'
                    } else {
                        notification("登录失败！" + content.msg)
                    }
                }

            }
        })
    }

    function init_panel() {
        GM_addElement('link', {
            href: "//cdn.aoaostar.com/yinghuaonline/style.css?v=" + GM_info.script.version,
            rel: 'stylesheet'
        });

        const el = `<span class="aoaostar-drawer-guide" style="">👈</span>
<div class="aoaostar" style="display: none">
    <div class="info">
        <div class="title">
            <h1>傲星英华学堂网课助手</h1>
            <a class="link" href="https://www.aoaostar.com" target="_blank">https://www.aoaostar.com</a>
        </div>
        <div class="flex justify-center">
            <a class="tag" href="https://github.com/aoaostar" target="_blank">
                <span>作者</span><span>Pluto</span>
            </a>   
            <a class="tag" href="https://github.com/aoaostar/cdn/tree/master/yinghuaonline" target="_blank">
                <span>版本号</span><span>v${GM_info.script.version || '获取失败'}</span>
            </a>   
        </div>
        <div class="flex justify-center">
            <div class="tag">
                <span>当前课程ID</span><span id="course-id">正在获取</span>
            </div>
            <div class="tag">
                <span>当前章节ID</span><span id="node-id">正在获取</span>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="tag">
                <span>视频总数</span><span id="node-count">正在获取</span>
            </div>
            <div class="tag">
                <span>视频时长</span><span id="course-duration">正在获取</span>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="tag">
                <span>当前第n个视频</span><span id="node-index">正在获取</span>
            </div>
            <div class="tag">
                <span>剩余视频</span><span id="node-surplus">正在获取</span>
            </div>
        </div>
        <div class="tag justify-center">
            <span>课程名称</span><span id="course-title">正在获取</span>
        </div>
        <div class="flex justify-center">
            <div class="tag">
                <span>状态</span><span id="node-status">正在获取</span>
            </div>
            <div class="tag">
                <span>进度</span><span id="node-progress">正在获取</span>
            </div>
        </div>
    </div>
    <div class="tab">
          <div class="title">
            <div class="active" data-tab="output">当前日志</div>
            <div data-tab="log">脚本日志</div>
        </div>
        <div class="content">
            <div class="output"></div>
            <div class="log hidden"></div>
        </div>
    </div>
</div>`
        $(document.body).append(el)

        $('.aoaostar .tab .title>div').click(e => {
            $('.aoaostar .tab .title>div').removeClass('active')
            const tab = $(e.target).data('tab');
            $(e.target).addClass('active')
            $('.tab .content > div').addClass('hidden')
            $('.tab .content .' + tab).removeClass('hidden')
        })
    }
})()