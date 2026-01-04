// ==UserScript==
// @name         Test_增强与自动点击
// @namespace    https://github.com/ewigl/hus
// @version      1.0
// @description  Test_增强与自动点击_防止原作者删库
// @author       Jack Ou
// @license      MIT
// @homepage     https://github.com/ewigl/hus
// @match        http*://www.hifini.com/thread-*.htm
// @match        http*://*.lanzn.com/*
// @icon         https://www.hifini.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/510835/Test_%E5%A2%9E%E5%BC%BA%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510835/Test_%E5%A2%9E%E5%BC%BA%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
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
        replies: ['666', 'Good', 'Nice', 'Thanks', '给力', '谢谢', '谢谢分享', '谢谢大佬', '感谢', '感谢分享', '感谢大佬'],
    }

    // 工具
    const utils = {
        getRandomReply() {
            return config.replies[Math.floor(Math.random() * config.replies.length)]
        },
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
        getHiddenPwd(element) {
            if ($(element).children().length === 0) {
                return $(element).text().trim().replace('提取码', '').replace(':', '').replace('：', '')
            }
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
            if (netDiskLinks.length !== pwds.length) {
                throw new Error('HIFINI User Script: netDiskLinks.length !== pwds.length')
            }
            return netDiskLinks.map((link, index) => {
                return {
                    link: link.split('?')[0] + '?pwd=' + pwds[index],
                    pwd: pwds[index],
                    type: utils.isBaiduOrLanzou(link),
                }
            })
        },
        getAllNetDiskLinks() {
            return $(`a[href*="${constants.BAIDU_HOST}"], a[href*="${constants.LANZOU_HOST}"]`)
                .toArray()
                .map((element) => {
                    return element.href
                })
        },
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
        quickReply() {
            const replyInputDom = $(`#${constants.QUICK_REPLY_INPUT_ID}`)
            const submitButtonDom = $(`#${constants.QUICK_REPLY_SUBMIT_ID}`)
            if (replyInputDom.length) {
                replyInputDom.focus()
                replyInputDom.val(utils.getRandomReply())
                submitButtonDom.click()
            } else {
                console.log('Need to Login.')
                window.location.href = constants.USER_LOGIN_URL
            }
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

    const main = {
        init() {
            if (utils.isInLanzouSite()) {
                initAction.autoFillLanzouPwd()
            } else {
                initAction.addQuickReplyButton()
                utils.isReplied() && initAction.addNetDiskLinksPanel()
            }
            console.log('HIFINI User Script is ready.')
        },
    }

    // 自动点击VIP按钮
    window.onload = function() {
        var button1 = document.getElementById('dp_code');
        if (button1) {
            button1.click();
        }
        setTimeout(function() {
            var button2 = document.getElementById('lp_code');
            if (button2) {
                button2.click();
            }
        }, 2000);
    };

    main.init()
})()