// ==UserScript==
// @name         拒绝二维码登录
// @namespace    NoQRCodeLogin
// @version      3.1.1
// @description  QQ、支付宝、京东等网站默认使用账号密码登录，不出现二维码登录界面,可自定义设置在指定网站开启和关闭，有需求或问题请反馈。
// @author       Eva
// @license      GPL
// @match        *://passport.jd.com/*
// @match        *://*.baidu.com/*
// @match        *://*.douban.com/*
// @match        *://passport.suning.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.alipay.com/*
// @match        *://account.aliyun.com/*
// @match        *://*.qq.com/*
// @match        *://*.weiyun.com/*
// @match        *://*.cloud.tencent.com/*
// @match        *://*.qcloud.com/*
// @match        *://mp.weixin.qq.com/*
// @match        *://www.acfun.cn/*
// @match        *://music.163.com/*
// @match        *://you.163.com/*
// @match        *://*.douyu.com/*
// @match        *://*.huya.com/*
// @match        *://*.smzdm.com/*
// @match        *://ipassport.kaola.com/*
// @match        *://login.10086.cn/*
// @match        *://mail.10086.cn/*
// @match        *://*.e.189.cn/*
// @match        *://js.189.cn/*
// @match        *://*.aliyundrive.com/*
// @match        *://passport.csdn.net/*
// @match        *://account.dianping.com/*
// @match        *://etax.chinatax.gov.cn/*
// @match        *://*.115.com/*
// @match        *://*.tianya.cn/*
// @match        *://*.dnspod.cn/*
// @match        *://www.qcc.com/*
// @match        *://mms.pinduoduo.com/*
// @match        *://passport.shop.jd.com/*
// @match        *://*.tyrz.gd.gov.cn/*
// @match        *://*.baixing.com/*
// @match        *://*.passport.sangon.com/*
// @match        *://*.passport.21cnjy.com/*
// @match        *://login.xueanquan.com/*
// @match        *://account.geekbang.org/*
// @match        *://*.icourse163.org/*
// @match        *://*.ziroom.com/*
// @match        *://*.fuwu.nhsa.gov.cn/*
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://www.ouryao.com/*
// @match        *://leetcode.cn/*
// @match        *://home.51cto.com/*
// @match        *://*.manmanbuy.com/*
// @match        *://uc.chinaz.com/*
// @match        *://pan.quark.cn/*
// @match        *://passport.oray.com/*
// @match        *://xueqiu.com/*
// @match        *://www.hqwx.com/*
// @match        *://passport.cbi360.net/*
// @match        *://shb3144.eapps.dingtalkcloud.com/*
// @match        *://oapi.dingtalk.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/37988/%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/37988/%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    // 注册菜单
    GM_registerMenuCommand("拒绝二维码登录开关设置", () => {
        const settings = new Settings()
        settings.show()
    })

    // 定义默认配置
    const settingData = {
        'jd': { 'name': '京东', 'url': 'passport.jd.com', 'enabled': true },
        'baidu': { 'name': '百度', 'url': 'baidu.com', 'enabled': true },
        'douban': { 'name': '豆瓣', 'url': 'douban.com', 'enabled': true },
        'suning': { 'name': '苏宁易购', 'url': 'passport.suning.com', 'enabled': true },
        'zhihu': { 'name': '知乎', 'url': 'zhihu.com', 'enabled': true },
        'alipay': { 'name': '支付宝', 'url': 'alipay.com', 'enabled': true },
        'aliyun': { 'name': '阿里云', 'url': 'account.aliyun.com', 'enabled': true },
        'qq': {
            'name': '腾讯QQ(含微云)',
            'url': ['xui.ptlogin2.qq.com', 'ssl.xui.ptlogin2.qq.com', 'ssl.xui.ptlogin2.weiyun.com', 'ui.ptlogin2.qq.com'],
            'enabled': true
        },
        'qq_support': { 'name': '腾讯兔小巢', 'url': 'support.qq.com', 'enabled': true },
        'tencent_cloud': { 'name': '腾讯云', 'url': ['cloud.tencent.com', 'qcloud.com'], 'enabled': true },
        'qq_exmail': { 'name': '腾讯企业邮箱', 'url': 'exmail.qq.com', 'enabled': true },
        'weixin_pay': { 'name': '微信支付', 'url': 'pay.weixin.qq.com', 'enabled': true },
        'weixin_mp': { 'name': '微信公众平台', 'url': 'mp.weixin.qq.com', 'enabled': true },
        'acfun': { 'name': 'AcFun', 'url': 'www.acfun.cn', 'enabled': true },
        'netease_music': { 'name': '网易云音乐', 'url': 'music.163.com', 'enabled': true },
        'netease_you': { 'name': '网易严选', 'url': 'you.163.com', 'enabled': true },
        'douyu': { 'name': '斗鱼', 'url': 'douyu.com', 'enabled': true },
        'huya': { 'name': '虎牙直播', 'url': 'huya.com', 'enabled': true },
        'smzdm': { 'name': '什么值得买', 'url': 'smzdm.com', 'enabled': true },
        'kaola': { 'name': '考拉海购', 'url': 'ipassport.kaola.com', 'enabled': true },
        '10086': { 'name': '中国移动', 'url': 'login.10086.cn', 'enabled': true },
        '10086_mail': { 'name': '139邮箱', 'url': 'mail.10086.cn', 'enabled': true },
        '189_e': { 'name': '天翼云盘', 'url': 'open.e.189.cn', 'enabled': true },
        '189_js': { 'name': '江苏电信', 'url': 'js.189.cn', 'enabled': true },
        'aliyundrive': { 'name': '阿里云盘', 'url': 'aliyundrive.com', 'enabled': true },
        'csdn': { 'name': 'CSDN', 'url': 'passport.csdn.net', 'enabled': true },
        'dianping': { 'name': '大众点评', 'url': 'account.dianping.com', 'enabled': true },
        'chinatax': { 'name': '自然人电子税务局', 'url': 'etax.chinatax.gov.cn', 'enabled': true },
        '115': { 'name': '115云', 'url': '115.com', 'enabled': true },
        'tianya': { 'name': '天涯社区', 'url': 'tianya.cn', 'enabled': true },
        'dnspod': { 'name': 'DNSPod', 'url': 'dnspod.cn', 'enabled': true },
        'qcc': { 'name': '企查查', 'url': 'www.qcc.com', 'enabled': true },
        'pinduoduo_mms': { 'name': '拼多多商家', 'url': 'mms.pinduoduo.com', 'enabled': true },
        'jd_shop': { 'name': '京麦', 'url': 'passport.shop.jd.com', 'enabled': true },
        'gd_tyrz': { 'name': '广东统一身份认证', 'url': 'tyrz.gd.gov.cn', 'enabled': true },
        'baixing': { 'name': '百姓网', 'url': 'baixing.com', 'enabled': true },
        'sangon': { 'name': '生工', 'url': 'passport.sangon.com', 'enabled': true },
        '21cnjy': { 'name': '21世纪教育', 'url': 'passport.21cnjy.com', 'enabled': true },
        'xueanquan': { 'name': '学校安全教育平台', 'url': 'login.xueanquan.com', 'enabled': true },
        'geekbang': { 'name': '极客邦科技', 'url': 'account.geekbang.org', 'enabled': true },
        'icourse163': { 'name': '中国大学MOOC', 'url': 'icourse163.org', 'enabled': true },
        'ziroom': { 'name': '自如', 'url': 'ziroom.com', 'enabled': true },
        'nhsa_fuwu': { 'name': '国家医保服务平台', 'url': 'fuwu.nhsa.gov.cn', 'enabled': true },
        'nga': { 'name': 'NGA玩家社群', 'url': ['bbs.nga.cn', 'ngabbs.com', 'nga.178.com'], 'enabled': true },
        'ouryao': { 'name': '蒲公英论坛', 'url': 'ouryao.com', 'enabled': true },
        'leetcode_cn': { 'name': '力扣中国', 'url': 'leetcode.cn', 'enabled': true },
        '51cto': { 'name': '51CTO', 'url': 'home.51cto.com', 'enabled': true },
        'manmanbuy': { 'name': '慢慢买', 'url': ['home.manmanbuy.com', 'home-test.manmanbuy.com'], 'enabled': true },
        'chinaz': { 'name': '站长工具', 'url': 'uc.chinaz.com', 'enabled': true },
        'quark_pan': { 'name': '夸克网盘', 'url': 'pan.quark.cn', 'enabled': true },
        'oray': { 'name': '贝锐', 'url': 'passport.oray.com', 'enabled': true },
        'xueqiu': { 'name': '雪球', 'url': 'xueqiu.com', 'enabled': true },
        'hqwx': { 'name': '环球网校', 'url': 'www.hqwx.com', 'enabled': true },
        'cbi360': { 'name': '建设通', 'url': 'passport.cbi360.net', 'enabled': true },
        'shb': { 'name': '售后宝', 'url': 'shb3144.eapps.dingtalkcloud.com', 'enabled': true },
        'dingtalk_oauth2': { 'name': '钉钉单点登录', 'url': 'oapi.dingtalk.com', 'enabled': true },
    }

    const _main = main()
    // 检查更新当前用户配置，并返回最新用户配置
    const storageData = checkSettingUpdate()
    start()

    function start() {
        const current = window.location.hostname
        let match = false
        for (const key in storageData) {
            const data = storageData[key]
            const url = data.url
            const enabled = data.enabled
            if (Array.isArray(url)) {
                url.forEach(x => {
                    if (current.includes(x)) {
                        console.log("网址：%s 可切换为密码登录,状态：%s", x, enabled ? '启用' : '禁用')
                        match = true
                        if (enabled) _main[key]()
                        return
                    }
                })
                if (match) break
            } else {
                if (current.includes(url)) {
                    console.log("网址：%s 可切换为密码登录,状态：%s", url, enabled ? '启用' : '禁用')
                    if (enabled) _main[key]()
                    break
                }
            }
        }
    }

    function main() {
        return {
            // 京东
            jd() {
                const targetNode = $('.login-box')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('.login-tab-r')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 百度
            baidu() {
                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            const addedNodes = Array.from(mutation.addedNodes)
                            addedNodes.forEach(() => {
                                const btn = $('[id^=TANGRAM__PSP_][id$=__footerULoginBtn]')
                                if (btn.length > 0) {
                                    setTimeout(() => btn.trigger("click"), 100)
                                    // 停止观察
                                    observer.disconnect()
                                }
                            })
                        }
                    }
                })
            },
            // 豆瓣
            douban() {
                const targetNode = $('.account-tab-account')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('on')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 苏宁易购
            suning() {
                const targetNode = $('.pc-login')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('.login-tab .tab-item')[1].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 知乎
            zhihu() {
                const process = () => {
                    const targetNode = $('.SignFlow-tab:contains("密码登录")').map(function () {
                        if ($(this).text() == "密码登录") return this
                    })[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if (!$(targetNode).hasClass('SignFlow-tab--active')) {
                                    targetNode.click()
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                process()

                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList') {
                            const addedNodes = Array.from(mutation.addedNodes)
                            addedNodes.forEach((node) => {
                                if ($(node).find('.SignContainer-content').length > 0) {
                                    process()
                                    // 停止观察
                                    observer.disconnect()
                                }
                            })
                        }
                    }
                })
            },
            // 支付宝
            alipay() {
                // 右上角登录按钮
                const processEntry = () => {
                    const targetNode = $('li[data-status="show_login"]')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if (!$(targetNode).hasClass(' active ')) {
                                    setTimeout(() => targetNode.click(), 150)
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                // 通用
                const processNormal = () => {
                    const targetNode = $('#J-qrcode-target')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).hasClass('qrcode-target-hide')) {
                                    setTimeout(() => targetNode.click(), 500)
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                // iframe 登录
                const processIframe = () => {
                    const targetNode = $('#J_popbox')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).hasClass('stat-login')) {
                                    const iframe = $('#J_loginIframe')
                                    const method = iframe.contents().find('#J-loginFormMethod')
                                    const target = iframe.contents().find('#J-qrcode-target')
                                    if (method.length > 0 && target.length > 0) {
                                        if (target.hasClass('qrcode-target-hide')) {
                                            setTimeout(() => target[0].click(), 500)
                                        }
                                        // 停止观察
                                        observer.disconnect()
                                    }
                                }
                            }
                        }
                    })
                }

                // 收银台
                const excashier = () => {
                    const targetNode = $('#J_tip_qr')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).css('display') === 'block') {
                                    setTimeout(() => $('a[seed="J_tip_qr-switchTipBtn"]')[0].click(), 150)
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                if (matchURL('excashier.alipay.com')) {
                    excashier()
                } else {
                    processEntry()
                    processNormal()
                    processIframe()
                }
            },
            // 阿里云
            aliyun() {
                const targetNode = $('.aliyun-account-consoleicon-user')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).closest('.tabs-item').hasClass('active')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 腾讯 QQ（包含微云）
            qq() {
                const targetNode = $('#bottom_qlogin')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'block') {
                                $('#switcher_plogin')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 腾讯兔小巢
            qq_support() {
                const targetNode = $('.t-checkbox__former')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).prop('checked')) {
                                targetNode.click()
                                setTimeout(() => $('.super_login_qq_link')[0].click(), 0)
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 腾讯云
            tencent_cloud() {
                const process = (observer) => {
                    const btn = $(btnElement)
                    if (btn.length > 0 && !btn.closest('.accsys-tp-tabs__item').hasClass('is-active')) {
                        setTimeout(() => btn.trigger("click"), 100)
                        // 停止观察
                        observer.disconnect()
                        return true
                    }
                    return false
                }

                const targetNode = document.body
                const btnElement = '.accsys-tp-tabs__item-label:contains("邮箱登录")'
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (!process(observer)) {
                            if (mutation.type === 'childList') {
                                const addedNodes = Array.from(mutation.addedNodes)
                                addedNodes.forEach(() => process(observer))
                            }
                        }
                    }
                })
            },
            // 腾讯企业邮箱
            qq_exmail() {
                const targetNode = $('.login_account_pwd_panel')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('.js_show_pwd_panel')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 微信支付
            weixin_pay() {
                const targetNode = $('#IDSwitchAccountLogin')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('selected')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 微信公众平台
            weixin_mp() {
                const targetNode = $('.login__type__container__account')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('.login__type__container__scan a')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // AcFun
            acfun() {
                const targetNode = $('#login')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('login-account')) {
                                $('#login-switch').click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 网易云音乐
            netease_music() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const switchBtn = $(e.target).find('a:contains("选择其他登录模式")')
                    const termBtn = $(e.target).find('#j-official-terms')
                    if (switchBtn.length > 0) {
                        setTimeout(() => switchBtn[0].click(), 0)
                    }

                    if (termBtn.length > 0) {
                        setTimeout(() => {
                            termBtn[0].click()
                            $('a:contains("网易邮箱帐号登录")')[0].click()
                        }, 0)
                    }
                })
            },
            // 网易严选
            netease_you() {
                $('body').bind('DOMNodeInserted', (e) => {
                    if ($(e.target).hasClass('j-yx-loginBox') && $(e.target).css('display') === 'none') {
                        setTimeout(() => $(e.target).find('.j-yx-qrLogin')[0].click(), 1000)
                    }
                })
            },
            // 斗鱼
            douyu() {
                const process = () => {
                    const targetNode = $('.scancode-login')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).hasClass('status-scan')) {
                                    setTimeout(() => $(".scanicon-toLogin")[0].click(), 100)
                                    $(".inputLoginBtn").on('click', () => {
                                        const nickname = $('.loginbox-login-subtype').find('[data-subtype="login-by-nickname"]')
                                        if (nickname && !nickname.hasClass('active')) {
                                            setTimeout(() => nickname[0].click(), 100)
                                        }
                                    })
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }
                process()

                $('body').bind('DOMNodeInserted', (e) => {
                    if ($(e.target).find('.scancode-login').length > 0) {
                        process()
                    }
                })
            },
            // 虎牙直播
            huya() {
                const targetNode = $('#quick-login-wrap')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') != 'none') {
                                $(targetNode).find('.change-login i')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 什么值得买
            smzdm() {
                const targetNode = $('.login')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('.qrcode-change')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 考拉海购
            kaola() {
                const passwordLogin = () => {
                    const targetNode = $('#login')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).hasClass('login-view-sms')) {
                                    $(targetNode).find('.password-login-tab-item')[0].click()
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                const targetNode = $('.icon-sms')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).length > 0) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()

                                passwordLogin()
                            }
                        }
                    }
                })
            },
            // 中国移动
            10086() {
                const targetNode = $('#J_pc')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') != 'none') {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 139 邮箱
            '10086_mail'() {
                const targetNode = $('#Account')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('on')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 天翼云盘
            '189_e'() {
                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            const btn = $(targetNode).find('#tab-pw')
                            if (btn.length > 0 && !btn.hasClass('current')) {
                                btn[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 江苏电信
            '189_js'() {
                const targetNode = $('.login_con.mobile')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') === 'none') {
                                $('#menu1 li')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 阿里云盘
            aliyundrive() {
                const targetNode = $('#login .login-blocks.block0').find(':contains("账号登录")')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).prop("nodeName") == 'A') {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // CSDN
            csdn() {
                const targetNode = $('.login-box-tabs-items')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            const btn = $(targetNode).find('span:contains(密码登录)')
                            if (btn.length > 0) {
                                btn[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 大众点评
            dianping() {
                const passwordLogin = () => {
                    const targetNode = $('.pwd')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($(targetNode).children('div').hasClass('segment-label-grey')) {
                                    targetNode.click()
                                    // 停止观察
                                    observer.disconnect()


                                }
                            }
                        }
                    })
                }

                const targetNode = $('.pc-icon')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).length > 0) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()

                                passwordLogin()
                            }
                        }
                    }
                })
            },
            // 自然人电子税务局
            chinatax() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const login_container = $(e.target).find('.password-login-container')
                    if (login_container.css('display') === 'none') {
                        $('.login-mode-text:contains(密码登录)')[0].click()
                    }
                })
            },
            // 115 云
            115() {
                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        const qrcodeBtn = $('a[lgb-nav="qrcode"]')
                        if (qrcodeBtn.length > 0 && qrcodeBtn.css('display') === 'none') {
                            $('a[lgb-nav="login"]')[0].click()
                            // 停止观察
                            observer.disconnect()
                        }
                    }
                })
            },
            // 天涯社区
            tianya() {
                const process = () => {
                    const targetNode = $('.normal-login-tab')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if ($('#loginWin_content_wrapper').hasClass('loginWin-qrcode-login-wrapper')) {
                                    targetNode.click()
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }

                process()

                $('body').bind('DOMNodeInserted', (e) => {
                    if ($(e.target).find('#loginWin_content_wrapper').length > 0) {
                        process()
                    }
                })
            },
            // DNSPod
            dnspod() {
                const targetNode = $('a[href^="/login/email"]')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).parent('.dp-login__tabitem').hasClass('is-active')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 企查查
            qcc() {
                const login_change = $('.login-change')
                if (login_change.length > 0 && $('.right-c').css('display') === 'none') {
                    login_change.find('img').click()
                }

                const targetNode = $('.login-tab a:contains("密码登录")')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('active')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 拼多多商家
            pinduoduo_mms() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const password_section = $(e.target).find('.password-section')
                    if (password_section.length > 0 && password_section.css('display') === 'none') {
                        setTimeout(() => $('.login-tab').find('.tab-item.last-item')[0].click(), 100)
                    }
                })
            },
            // 京麦
            jd_shop() {
                const targetNode = $('[data-tab-id="form"]')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).hasClass('active')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 广东省统一身份认证平台
            gd_tyrz() {
                const process = (login_link) => {
                    const nav_active = $('.gd-tabs-nav-active span').text()
                    if (nav_active.includes('个人登录')) {
                        login_link[0].click()
                    }
                    if (nav_active.includes('法人登录')) {
                        if ($('.gd-tabs-pane .qr').length > 0)
                            login_link[1].click()
                    }
                }

                const targetNode = $('#app')[0]
                observe(targetNode, (mutations, observer) => {
                    const login_link = $('a:contains(账号密码)')
                    if (login_link.length > 0) {
                        process(login_link)

                        $('.gd-tabs-nav').on('click', () => {
                            process(login_link)
                        })
                        // 停止观察
                        observer.disconnect()
                    }
                }, { subtree: true, attributeFilter: [] })
            },
            // 百姓网
            baixing() {
                const targetNode = $('[href="#mobile"]')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).attr('aria-expanded') != 'true') {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 生工
            sangon() {
                const targetNode = $('.ant-tabs-tab span:contains("密码登录")').map(function () {
                    if ($(this).text() == "密码登录") return this
                })[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).closest('.ant-tabs-tab').hasClass('ant-tabs-tab-active')) {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 21 世纪教育
            '21cnjy'() {
                const targetNode = $('.login-method__tab--ac')[0]
                observe(targetNode, (mutations, observer) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') != 'none') {
                                targetNode.click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    }
                })
            },
            // 学校安全教育平台
            xueanquan() {
                const targetNode = $('#app')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach(() => {
                        const btnElement = $('.codelogin-bto')
                        if (btnElement.length > 0) {
                            btnElement[0].click()
                            // 停止观察
                            observer.disconnect()
                        }
                    })
                })
            },
            // 极客邦科技
            geekbang() {
                $('body').bind('DOMNodeInserted', (e) => {
                    if ($(e.target).hasClass('page-sms-login'))
                        $('a:contains("密码登录")')[0].click()
                })
            },
            // 中国大学 MOOC
            icourse163() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const login = $(e.target).find('.ux-login-set-scan-code_ft_back')
                    if (login.length > 0) login[0].click()
                })
            },
            // 自如
            ziroom() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const login_accont = $(e.target).find('.ziroom-login-accont')
                    if (login_accont.length > 0 && login_accont.css('display') === 'none')
                        setTimeout(() => $('#swichAccontHook')[0].click(), 100)
                })
            },
            // 国家医保服务平台
            nhsa_fuwu() {
                $('body').bind('DOMNodeInserted', (e) => {
                    if ($(e.target).find('.code-wrap').length > 0) {
                        $('#iframe').on('load', () => {
                            $('.other-login')[0].click()
                        })
                    }
                })
            },
            // NGA 玩家社区
            nga() {
                if (matchURL('nuke/account_copy.html?login')) {
                    $('body').bind('DOMNodeInserted', (e) => {
                        const btn = $(e.target).find('a:contains("使用密码登录")')
                        if (btn.length > 0) setTimeout(() => btn[0].click(), 0)
                    })
                }
            },
            // 蒲公英论坛
            ouryao() {
                if (matchURL('plugin.php')) {
                    const targetNode = $('.login-content li:contains("账号登录")')[0]
                    observe(targetNode, (mutations, observer) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes') {
                                if (!$(targetNode).hasClass('layui-this')) {
                                    setTimeout(() => targetNode.click(), 100)
                                    // 停止观察
                                    observer.disconnect()
                                }
                            }
                        }
                    })
                }
            },
            // 力扣中国
            leetcode_cn() {
                $('body').bind('DOMNodeInserted', (e) => {
                    const btn = $(e.target).find('[data-cypress="sign-in-with-password"]')
                    if (btn.length > 0) setTimeout(() => btn[0].click(), 0)
                })
            },
            // 51CTO
            '51cto'() {
                const targetNode = $('#login-wechat')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).css('display') != 'none') {
                                $(targetNode).find('.password_corner')[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                            setTimeout(() => $('.login-type-switch')[1].click(), 100)
                        }
                    })
                })
            },
            // 慢慢买
            manmanbuy() {
                const targetNode = $('#WXAPP')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).closest('.loginWxApp').css('display') === 'block') {
                                $(targetNode)[0].click()
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    })
                })
            },
            // 站长工具
            chinaz() {
                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    const el = $('.account-box')
                    if (el.length > 0 && el.css('display') === 'none') {
                        $('.icon-other-account')[0].click()
                        // 停止观察
                        observer.disconnect()
                    }
                })
            },
            // 夸克网盘
            quark_pan() {
                const targetNode = document.body
                observe(targetNode, (mutations, observer) => {
                    const el = $('.text:contains("手机登录")')
                    if (el.length > 0) {
                        el[0].click()
                        // 停止观察
                        observer.disconnect()
                    }
                })
            },
            // 贝锐
            oray() {
                const targetNode = $('.login-option-item p:contains("帐号/手机")')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).closest('.login-option-item').hasClass('active')) {
                                setTimeout(() => targetNode.click(), 100)
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    })
                })
            },
            // 雪球
            xueqiu() {
                const targetNode = $('#app')[0]
                observe(targetNode, (mutations, observer) => {
                    setTimeout(() => {
                        const el = $('a:contains("账号密码登录")')
                        if (el.length > 0 && !el.hasClass('newLogin_active_2CK')) {
                            el[0].click()
                            // 停止观察
                            observer.disconnect()
                        }
                    }, 200)
                })
            },
            // 环球网校
            hqwx() {
                const targetNode = $('.gedu-wx-qrcode-box')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if (!$(targetNode).css('display') != 'none') {
                                setTimeout(() => $('.gedu-wx-qrcode-login-type-item[data-type="mima"]').click(), 100)
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    })
                })
            },
            // 建设通
            cbi360() {
                const targetNode = $('.login-id-w')[0]
                observe(targetNode, (mutations, observer) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if ($(targetNode).parent().css('display') === 'none') {
                                setTimeout(() => $('.home-content-login-nav').find(':contains("账号密码登录")').click(), 100)
                                // 停止观察
                                observer.disconnect()
                            }
                        }
                    })
                })
            },
            // 售后宝
            shb() {
                const targetNode = $('#app')[0]
                observe(targetNode, (mutations, observer) => {
                    if ($('.login-box').length > 0 && $('.login-box .login-title').css('display') != 'none') {
                        const targetNode = $('#dingtalk-login-frame')[0]
                        observe(targetNode, (mutations, observer) => {
                            const iframe = $('#iframe_dd')
                            if (iframe.length > 0) {
                                $('button.el-button.tips-color.el-button--text').click()
                                // 停止观察
                                observer.disconnect()
                            }
                        })
                        // 停止观察
                        observer.disconnect()
                    }
                })
            },
            // 钉钉 Oauth2 登录
            dingtalk_oauth2() {
                const targetNode = $('a:contains("登录钉钉账号")')[0]
                observe(targetNode, () => {
                    targetNode.click()
                })
            }
        }
    }

    function observe(targetNode, callback, extendConf) {
        if (targetNode) {
            console.log("targetNode", targetNode)
            targetNode.classList.add('temp')
            setTimeout(() => targetNode.classList.remove('temp'), 0)
        }

        // 观察器的配置（需要观察什么变动）
        const defaultConf = { childList: true, attributeFilter: ["class", "style"] }

        const conf = $.extend({}, defaultConf, extendConf)
        if (extendConf) console.log('observer conf', conf)
        if (callback) {
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback)
            // 以上述配置开始观察目标节点
            if (targetNode) observer.observe(targetNode, conf)
        }
    }

    //判断网址是否匹配
    function matchURL(url) {
        return window.location.href.includes(url)
    }

    function setCookie(c_name, value, expireDays) {
        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + expireDays)
        document.cookie = c_name + "=" + escape(value) + ((expireDays == null) ? "" : "expires=" + expireDate.toUTCString() + "path=/")
    }

    function getStorageData() {
        return GM_getValue('NoQRCodeLoginData')
    }

    function setStorageData(value) {
        return GM_setValue('NoQRCodeLoginData', value)
    }

    function deleteStorageData() {
        GM.deleteValue("NoQRCodeLoginData")
    }

    function checkSettingUpdate() {
        // 更新设置
        let needUpate = false
        let storageData = getStorageData()
        // console.log('默认数据', settingData)
        // console.log('用户数据', storageData)
        // 初始化数据
        if (!storageData) {
            needUpate = true
            storageData = settingData
            console.log('初始化用户配置', storageData)
        }

        // 更新数据
        if ($.isPlainObject(storageData)) {
            const settingDataKeys = Object.keys(settingData)
            const storageDataKeys = Object.keys(storageData)
            // 用户配置中比默认配置多的属性，意味着需要删除
            storageDataKeys.filter(key => !settingDataKeys.includes(key)).forEach(key => {
                needUpate = true
                console.log('删除配置', key, storageData[key])
                delete storageData[key]
            })

            for (const item in settingData) {
                const data = storageData[item]
                const defaultData = settingData[item]
                if (data) {
                    // 比较 name 和 url
                    const nameEquals = data.name == defaultData.name
                    const urlEquals = data.url.toString() == defaultData.url.toString()
                    if (!nameEquals) {
                        needUpate = true
                        console.log('更新名称：%s 为 %s', data.name, defaultData.name)
                        data.name = defaultData.name
                    }
                    if (!urlEquals) {
                        needUpate = true
                        console.log('更新[%s]网址：%s 为 %s', data.name, data.url, defaultData.url)
                        data.url = defaultData.url
                    }
                } else {
                    // 没有则新增
                    needUpate = true
                    storageData[item] = defaultData
                    console.log('新增配置', item, storageData[item])
                }
            }
        }

        // 处理旧数据
        if (Array.isArray(storageData)) {
            needUpate = true
            let newStorageData = {}
            for (const item in settingData) {
                const itemName = settingData[item].name
                // 旧数据转换为新数据
                storageData.forEach(data => {
                    if (data.name == itemName) {
                        newStorageData[item] = data
                    }
                })
            }
            storageData = newStorageData
            console.log('更新旧数据格式', storageData)
        }

        if (needUpate) setStorageData(storageData)
        return storageData
    }

    class Settings {
        constructor() {
            this.init()
        }
        mask = $('<div id="settingLayerMask"></div>')
        ele = $('<div id="settingLayer"></div>')
        init() {
            let self = this
            self.addContent()
            self.addGlobalStyle()
            self.mask.append(self.ele)
            $('body').append(self.mask)
            self.ele.click((e) => {
                self.bindClick(e)
                e.stopPropagation()
            })
            self.mask.click(() => self.hide())
            $(document).keyup((e) => {
                if (e.key === "Escape") self.hide()
            })
        }
        addContent() {
            // 各网站开关
            const itemList = $('<div id="itemlist"></div>')
            for (const key in storageData) {
                const item = storageData[key]
                const itemDiv = $('<section class="switch"></section>')
                const checkDiv = $('<div class="checkbox"></div>')
                if (item.enabled) checkDiv.addClass('on')
                itemDiv.append($('<span></span>').text(item.name)).append(checkDiv.append($('<input type="checkbox" />').attr('key', key).attr('name', item.name)).append($('<label class="switchLabel"></label>')))
                itemList.append(itemDiv)
            }
            // 按钮（反馈、保存等）
            const btnEle = $('<div id="btnEle"></div>')
            // Greasyfork 反馈按钮
            const feedbackGreasyforkEle = $('<span class="feedback"></span>').append($('<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/37988-%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95">反馈 Greasy Fork</a>'))
            // 保存按钮
            const saveEle = $('<span id="noqrlogin-save" title="save &amp; close">保存并关闭</span>')
            // 关闭按钮
            const closeEle = $('<span id="noqrlogin-close" title="close 关闭"></span>')
            this.ele.append(itemList).append(btnEle.append($('<div class="btnEleLayer"></div>').append(feedbackGreasyforkEle).append(saveEle))).append(closeEle)
        }
        show() {
            let self = this
            setTimeout(() => self.mask.css('display', 'flex'), 30)
        }
        hide() {
            let self = this
            setTimeout(() => self.mask.css('display', 'none'), 100)
        }
        addGlobalStyle() {
            var globalStyle = ' /* 开关按钮 */\n' +
                '        #itemlist {\n' +
                '            display: flex;\n' +
                '            display: -webkit-flex;\n' +
                '            align-content: center;\n' +
                '            align-items: center;\n' +
                '            justify-content: center;\n' +
                '            flex-flow: row wrap;\n' +
                '        }\n' +
                '\n' +
                '        section {\n' +
                '            float: left;\n' +
                '            width: 200px;\n' +
                '            padding: 6px 20px;\n' +
                '        }\n' +
                '\n' +
                '        .switch span {\n' +
                '            height: 30px;\n' +
                '            line-height: 32px;\n' +
                '            font-size: 16px;\n' +
                '            vertical-align: top;\n' +
                '        }\n' +
                '\n' +
                '        .switch .checkbox {\n' +
                '            float: right;\n' +
                '            padding-top: 4px;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox {\n' +
                '            position: relative;\n' +
                '            display: inline-block;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox:after,\n' +
                '        .checkbox:before {\n' +
                '            -webkit-font-feature-settings: normal;\n' +
                '            -moz-font-feature-settings: normal;\n' +
                '            font-feature-settings: normal;\n' +
                '            -webkit-font-kerning: auto;\n' +
                '            font-kerning: auto;\n' +
                '            -moz-font-language-override: normal;\n' +
                '            font-language-override: normal;\n' +
                '            font-stretch: normal;\n' +
                '            font-style: normal;\n' +
                '            font-synthesis: weight style;\n' +
                '            font-variant: normal;\n' +
                '            font-weight: normal;\n' +
                '            text-rendering: auto;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox label {\n' +
                '            width: 80px;\n' +
                '            height: 24px;\n' +
                '            background: #ccc;\n' +
                '            position: relative;\n' +
                '            display: inline-block;\n' +
                '            border-radius: 46px;\n' +
                '            -webkit-transition: 0.4s;\n' +
                '            transition: 0.4s;\n' +
                '            cursor: pointer;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox label:after {\n' +
                '            content: \'\';\n' +
                '            position: absolute;\n' +
                '            width: 50px;\n' +
                '            height: 50px;\n' +
                '            border-radius: 100%;\n' +
                '            left: 0;\n' +
                '            top: -5px;\n' +
                '            z-index: 2;\n' +
                '            background: #fff;\n' +
                '            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);\n' +
                '            -webkit-transition: 0.4s;\n' +
                '            transition: 0.4s;\n' +
                '            cursor: pointer;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox input {\n' +
                '            display: none;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox.on label:after {\n' +
                '            left: 36px;\n' +
                '        }\n' +
                '\n' +
                '        .checkbox.on label {\n' +
                '            background: #4BD865;\n' +
                '        }\n' +
                '\n' +
                '        .switch .checkbox label {\n' +
                '            width: 60px;\n' +
                '        }\n' +
                '\n' +
                '        .switch .checkbox label:after {\n' +
                '            top: 0;\n' +
                '            width: 24px;\n' +
                '            height: 24px;\n' +
                '        }\n' +
                '\n' +
                '        /* 弹出层 */\n' +
                '        #settingLayerMask {\n' +
                '            display: none;\n' +
                '            justify-content: center;\n' +
                '            align-items: center;\n' +
                '            position: fixed;\n' +
                '            top: 0;\n' +
                '            right: 0;\n' +
                '            bottom: 0;\n' +
                '            left: 0;\n' +
                '            background-color: rgba(0, 0, 0, .5);\n' +
                '            z-index: 200000000;\n' +
                '            overflow: auto;\n' +
                '            font-family: arial, sans-serif;\n' +
                '            min-height: 100%;\n' +
                '            font-size: 16px;\n' +
                '            transition: 0.5s;\n' +
                '            opacity: 1;\n' +
                '            user-select: none;\n' +
                '            -moz-user-select: none;\n' +
                '            padding-bottom: 80px;\n' +
                '            box-sizing: border-box;\n' +
                '        }\n' +
                '\n' +
                '        #settingLayer {\n' +
                '            display: flex;\n' +
                '            flex-wrap: wrap;\n' +
                '            padding: 20px;\n' +
                '            margin: 0px 25px 50px 5px;\n' +
                '            background-color: #fff;\n' +
                '            border-radius: 4px;\n' +
                '            position: absolute;\n' +
                '            width: 60%;\n' +
                '            transition: 0.5s;\n' +
                '        }\n' +
                '\n' +
                '\n' +
                '        #btnEle {\n' +
                '            position: absolute;\n' +
                '            width: 100%;\n' +
                '            bottom: 4px;\n' +
                '            right: 0;\n' +
                '            background: #fff;\n' +
                '            border-radius: 4px;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle span {\n' +
                '            display: inline-block;\n' +
                '            background: #EFF4F8;\n' +
                '            border: 1px solid #3abdc1;\n' +
                '            margin: 12px auto 10px;\n' +
                '            color: #3abdc1;\n' +
                '            padding: 5px 10px;\n' +
                '            border-radius: 4px;\n' +
                '            cursor: pointer;\n' +
                '            outline: none;\n' +
                '            transition: 0.3s;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle a {\n' +
                '            color: #999;\n' +
                '            text-decoration: none;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle a:hover {\n' +
                '            text-decoration: underline;\n' +
                '            color: #ef8957;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle span.feedback:hover {\n' +
                '            border-color: #ef8957;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle span:not(.feedback):hover {\n' +
                '            background: #3ACBDD;\n' +
                '            color: #fff;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle .feedback {\n' +
                '            border-color: #aaa;\n' +
                '        }\n' +
                '\n' +
                '        #btnEle>div {\n' +
                '            width: 100%;\n' +
                '            margin-bottom: -100%;\n' +
                '            display: flex;\n' +
                '            justify-content: space-around;\n' +
                '            background: #EFF4F8;\n' +
                '            border-radius: 4px;\n' +
                '        }\n' +
                '\n' +
                '        /*close button*/\n' +
                '        #noqrlogin-close {\n' +
                '            background: white;\n' +
                '            color: #3ABDC1;\n' +
                '            line-height: 20px;\n' +
                '            text-align: center;\n' +
                '            height: 20px;\n' +
                '            width: 20px;\n' +
                '            font-size: 20px;\n' +
                '            padding: 10px;\n' +
                '            border: 3px solid #3ABDC1;\n' +
                '            border-radius: 50%;\n' +
                '            transition: .5s;\n' +
                '            top: -20px;\n' +
                '            right: -20px;\n' +
                '            position: absolute;\n' +
                '            cursor: pointer;\n' +
                '        }\n' +
                '\n' +
                '        #noqrlogin-close::before {\n' +
                '            content: \'\\2716\';\n' +
                '        }\n' +
                '\n' +
                '        #noqrlogin-close:hover {\n' +
                '            background: indianred;\n' +
                '            border-color: indianred;\n' +
                '            color: #fff;\n' +
                '        }';
            $("<style></style>").text(globalStyle).appendTo($("head"))
        }
        bindClick(e) {
            let self = this
            const targetClass = e.target.className
            const targetid = e.target.id

            // 关闭按钮
            if (targetid == 'noqrlogin-close') {
                self.hide()
            }

            // 保存设置
            if (targetid == 'noqrlogin-save') {
                $('section.switch input').each((i, o) => {
                    const key = $(o).attr('key')
                    const item = storageData[key]
                    if (item) item.enabled = $(o.closest('.checkbox')).hasClass('on')
                })
                setStorageData(storageData)
                self.hide()
            }

            // 切换开关
            if (targetClass == 'switchLabel') {
                const switchEle = $(e.target).closest('.checkbox')
                if (switchEle.hasClass('on')) {
                    switchEle.removeClass('on')
                } else {
                    switchEle.addClass('on')
                }
            }
        }
    }
})()