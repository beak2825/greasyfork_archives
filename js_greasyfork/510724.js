// ==UserScript==
// @name         Test_auto reply
// @namespace    https://github.com/ewigl/hus
// @version      1.0
// @description  Test_自动回复_防止原作者删库
// @author       Jack Ou
// @license      MIT
// @homepage     https://github.com/ewigl/hus
// @match        http*://www.hifini.com/thread-*.htm
// @match        http*://*.lanzn.com/*
// @icon         https://www.hifini.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510724/Test_auto%20reply.user.js
// @updateURL https://update.greasyfork.org/scripts/510724/Test_auto%20reply.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // 常量
    const constants = {
        ASIDE_CLASS: 'aside',

        QUICK_REPLY_BUTTON_ID: 'hus_quick_reply_button',
        QUICK_REPLY_FORM_ID: 'quick_reply_form',
        QUICK_REPLY_INPUT_ID: 'message',
        QUICK_REPLY_SUBMIT_ID: 'submit',

        NON_REPLY_CLASS: 'alert-warning',
        REPLIED_CLASS: 'alert-success',

        DOWNLOAD_LINKS_PANEL_ID: 'hus_download_links_panel',

        BAIDU_HOST: 'pan.baidu.com',
        LANZOU_HOST: 'lanzn.com',

        URL_PARAMS_PWD: 'pwd',
        LANZOU_PWD_INPUT_ID: 'pwd',

        USER_LOGIN_URL: '/user-login.htm',
    }

    // 自定义样式
    const styleCSS = `
    #${constants.QUICK_REPLY_BUTTON_ID} {
        position: sticky;
        top: 16px;
    }

    #${constants.DOWNLOAD_LINKS_PANEL_ID} {
        position: sticky;
        top: 60px;
    }
    `

    // 应用自定义样式
    GM_addStyle(styleCSS)

    // 默认配置
    const config = {
        // 回复内容
        replies: ['666', 'Good', 'Nice', 'Thanks', '给力', '谢谢', '谢谢分享', '谢谢大佬', '感谢', '感谢分享', '感谢大佬'],
    }

    // 工具
    const utils = {
        // 获取随机回复（replies）
        getRandomReply() {
            return config.replies[Math.floor(Math.random() * config.replies.length)]
        },
        // 判断当前帖是否已回复
        isReplied() {
            return $(`.${constants.REPLIED_CLASS}`).length > 0
        },
        isBaiduOrLanzou(url) {
            if (url.includes(constants.BAIDU_HOST)) {
                return '百度'
            } else if (url.includes(constants.LANZOU_HOST)) {
                return '蓝奏'
            }
            return '未知'
        },
        isInLanzouSite() {
            return location.host.includes(constants.LANZOU_HOST)
        },
        // “解密”提取码
        getHiddenPwd(element) {
            // 若无子元素，则无“加密”
            if ($(element).children().length === 0) {
                return $(element).text().trim().replace('提取码', '').replace(':', '').replace('：', '')
            }

            // 若有子元素，则有“加密”
            let pwd = ''

            $(element)
                .find('span')
                .each((_index, innerElement) => {
                    if (!($(innerElement).css('display') === 'none')) {
                        pwd += $(innerElement).text()
                    }
                })

            return pwd
        },
        getLinkItems() {
            let netDiskLinks = utils.getAllNetDiskLinks()
            let pwds = utils.getAllPwds()

            // 若链接与密码数量不等，则抛错（暂定）
            if (netDiskLinks.length !== pwds.length) {
                throw new Error('HIFINI User Script: netDiskLinks.length !== pwds.length')
            }

            return netDiskLinks.map((link, index) => {
                return {
                    // split 以兼容不规范 url
                    link: link.split('?')[0] + '?pwd=' + pwds[index],
                    pwd: pwds[index],
                    type: utils.isBaiduOrLanzou(link),
                }
            })
        },
        // 获取页面内所有（a 标签）网盘链接（百度、蓝奏）
        getAllNetDiskLinks() {
            return $(`a[href*="${constants.BAIDU_HOST}"], a[href*="${constants.LANZOU_HOST}"]`)
                .toArray()
                .map((element) => {
                    return element.href
                })
        },
        // 获取页面内所有提取码（alert-success）
        getAllPwds() {
            let pwdElements = $(`.${constants.REPLIED_CLASS}`)

            let pwdArray = []

            pwdElements.each((_index, element) => {
                utils.getHiddenPwd(element) && pwdArray.push(utils.getHiddenPwd(element))
            })

            return pwdArray
        },
    }

    const operation = {
        // 快速回复当前帖，模拟点击操作方式。
        quickReply() {
            const replyInputDom = $(`#${constants.QUICK_REPLY_INPUT_ID}`)
            const submitButtonDom = $(`#${constants.QUICK_REPLY_SUBMIT_ID}`)

            if (replyInputDom.length) {
                replyInputDom.focus()
                replyInputDom.val(utils.getRandomReply())

                submitButtonDom.click()

                //   or
                //   $("#quick_reply_form").submit();
            } else {
                console.log('Need to Login.')
                window.location.href = constants.USER_LOGIN_URL
            }

            // 可选， Ajax 方式
            // To do, or not to do, that is the question.
        },
    }

    const initAction = {
        addQuickReplyButton() {
            const quickReplyButtonDom = `<a id="${constants.QUICK_REPLY_BUTTON_ID}" class="btn btn-light btn-block mb-3"> 自动回复 </a>`
            $(`.${constants.ASIDE_CLASS}`).append(quickReplyButtonDom)

            $(document).on('click', `#${constants.QUICK_REPLY_BUTTON_ID}`, operation.quickReply)
        },
        addNetDiskLinksPanel() {
            let linkItems = utils.getLinkItems()

            let linksDom = ''

            linkItems.forEach((item) => {
                linksDom += `
                <a class="btn btn-light btn-block" href="${item.link}" target="_blank"> ${item.type} / ${item.pwd} </a>`
            })

            const downloadPanelDom = `
            <div id="${constants.DOWNLOAD_LINKS_PANEL_ID}" class="card">
                <div class="m-3 text-center">
                    ${linksDom}
                </div>
            </div>
            `

            $(`.${constants.ASIDE_CLASS}`).append(downloadPanelDom)
        },
        autoFillLanzouPwd() {
            const urlParams = new URLSearchParams(window.location.search)

            if (urlParams.has(constants.URL_PARAMS_PWD)) {
                let pwd = urlParams.get(constants.URL_PARAMS_PWD)

                $(`#${constants.LANZOU_PWD_INPUT_ID}`).val(pwd)
            }
        },
    }

    // Main
    const main = {
        init() {
            if (utils.isInLanzouSite()) {
                // 自动填充蓝奏网盘提取码
                initAction.autoFillLanzouPwd()
            } else {
                initAction.addQuickReplyButton()

                utils.isReplied() && initAction.addNetDiskLinksPanel()
            }

            console.log('HIFINI User Script is ready.')
        },
    }

    main.init()
})()
