// ==UserScript==
// @name         Youtube自动选择中文翻译字幕
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Youtube自动点击中文翻译字幕
// @author       大奶瓜
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414213/Youtube%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/414213/Youtube%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(() => {
    const lcc_log = log => { console.log(`%clcc_log--->`, "color: #66b2ff; font-style: italic; background-color: #001e3c ;padding: 5px 10px;font-size:20px;border-radius:10px"); console.log(log) };
    const $ = el => document.querySelector(el)
    const $$ = el => document.querySelectorAll(el)

    const translate = () => {
        const trans_flag = GM_getValue("trans_flag", true)

        // 设置菜单按钮点击器
        const clickActive = (clickBtn, role = "menuitemradio",) => {
            for (const node of $$(`[role=${role}]`)) {
                if (node.innerText.trim().includes(clickBtn)) {
                    node.click()
                    return
                }
            }
        }
        const ccBtnT = $('.ytp-subtitles-button[aria-pressed="true"]')
        const ccBtnF = $('.ytp-subtitles-button[aria-pressed="false"]')
        const noSub = $('.ytp-subtitles-button[aria-pressed="false"][title="无法显示字幕"]')
        if (noSub !== null) return
        if (ccBtnT === null && ccBtnF === null) return
        // 字幕按钮
        if (ccBtnF) ccBtnF.click()
        if (!trans_flag) return
        // 设置按钮
        $('.ytp-settings-button').click()
        // 设置菜单按钮
        clickActive("字幕", "menuitem")
        clickActive("中文（简体）")
        clickActive("中文（中国）")
        clickActive("自动翻译")
        clickActive("中文（简体）")
    }
    // 创建一个循环定时器
    const trans_interval = setInterval(() => {
        // 一直循环，一直到找到video元素为止，然后把事件添加上去
        const videoNode = $('video')
        if (videoNode) {
            clearInterval(trans_interval)
            translate()
            videoNode.addEventListener('loadeddata', translate, false)
        }
    }, 500)
    // 创建一个循环定时器
    const btn_interval = setInterval(() => {
        const menu_container = $("#menu-container")
        if (menu_container) {
            clearInterval(btn_interval)
            const trans_flag = GM_getValue("trans_flag", true)
            const change_trans = document.createElement('div')
            const change_input = document.createElement('input')
            const change_lable = document.createElement('lable')
            change_lable.style.color = "var(--yt-button-icon-button-text-color,var(--yt-spec-text-secondary))";
            change_lable.style.fontSize = "var(--ytd-tab-system_-_font-size)";
            Object.assign(change_trans.style, { display: "flex", paddingRight: "8px" })
            change_trans.id = "change_trans"
            change_input.type = "checkbox"
            if (trans_flag) {
                change_input.checked = true
                change_lable.innerHTML = "翻译开启"
            } else {
                change_input.checked = false
                change_lable.innerHTML = "翻译关闭"
            }
            change_trans.onclick = e => {
                const trans_flag = GM_getValue("trans_flag", true)
                if (trans_flag != change_input.checked) {
                    GM_setValue("trans_flag", change_input.checked)
                    if (!trans_flag) {
                        change_input.checked = true
                        change_lable.innerHTML = "翻译开启"
                    } else {
                        change_input.checked = false
                        change_lable.innerHTML = "翻译关闭"
                    }
                    window.location.reload()
                    //if(confirm("是否更新当前视频的翻译状态？\n点击确定：当前网页会刷新，当前视频翻译状态会切换\n点击取消：不会刷新，翻译状态从下一个视频生效")) window.location.reload()
                }
            }
            change_trans.appendChild(change_input)
            change_trans.appendChild(change_lable)
            menu_container.parentNode.insertBefore(change_trans, menu_container)
        }
    }, 1000)
})()