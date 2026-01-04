// ==UserScript==
// @name         AcFun 自动换头像框
// @namespace    https://github.com/DaddyTrap
// @version      0.1
// @description  有很多头像框能用，所以就是想切着玩
// @author       PlusC
// @match        https://*.acfun.cn/*
// @icon         https://cdn.aixifan.com/ico/favicon.ico
// @connect      www.acfun.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476553/AcFun%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E5%A4%B4%E5%83%8F%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/476553/AcFun%20%E8%87%AA%E5%8A%A8%E6%8D%A2%E5%A4%B4%E5%83%8F%E6%A1%86.meta.js
// ==/UserScript==

// 脚本内出现的 "SAF" / "saf" 是 switch avatar frame 的意思，仅用于区分命名

(function() {
    'use strict';

    const NAV_ITEM_HTML = `<a href="javascript:void(0)" class="ac-member-navigation-item"><span class="ac-icon"><i class="iconfont"></i></span>切换头像框设置</a>`

    // source: https://stackoverflow.com/a/35385518
    /**
     * @param {String} HTML representing a single element
     * @return {HTMLElement}
     */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    const SETTING_DIALOG_HTML = `
    <div class="saf-modal">
        <div class="saf-modal-content">
            <form>
                <label>输入在哪些头像框id中轮换 (每行一个id)</label><br>
                <textarea name="frame_list" id="saf-input-frame-list" cols="30" rows="10"></textarea><br>
                <input type="checkbox" name="random_switch" id="saf-input-random-switch">
                <label>是否随机切换 (不勾选表示按顺序轮换)</label><br>
                <label>切换间隔 (分钟为单位)</label>
                <input type="text" name="switch_interval" id="saf-input-switch-interval"><br>
            </form>
            <button id="saf-confirm-setting">确定</button>
        </div>
    </div>
    `

    const SETTING_STYLE = `
        /* The Modal (background) */
        .saf-modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }

        /* Modal Content/Box */
        .saf-modal-content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
        }
    `

    /**
     * Find setting in dialog and save
     * @param {HTMLElement} settingDialog The dialog element.
     */
    function confirmCurrentSetting(settingDialog) {
        const frameListStr = settingDialog.querySelector('#saf-input-frame-list').value
        const frameList = frameListStr.split(/\r?\n/).map((e)=>parseInt(e))
        const isRandom = settingDialog.querySelector("#saf-input-random-switch").checked
        const switchIntervalStr = settingDialog.querySelector("#saf-input-switch-interval").value
        const switchInterval = parseFloat(switchIntervalStr)
        if (frameList.length <= 0) {
            alert(`当前选用头像框列表为空！请检查后再确定`)
            return
        }
        if (switchInterval < 5) {
            alert(`间隔时间设置为5分钟以上吧~`)
            return
        }
        // 尽量恢复一下上次轮换的状态
        // 如果老的轮换到的头像框id能在新列表中找到了，则将新index定位到该位置
        const oldIndex = GM_getValue('currIndex', null)
        const oldFrameList = GM_getValue('frameList', null)
        let newCurrIndex = 0
        if (oldIndex !== null && oldFrameList !== null) {
            const oldFrameId = oldFrameList[oldIndex]
            const tempNewIndex = frameList.indexOf(oldFrameId)
            if (tempNewIndex >= 0) {
                newCurrIndex = tempNewIndex
            }
        }
        GM_setValue('currIndex', newCurrIndex)
        GM_setValue('frameList', frameList)
        GM_setValue('isRandom', isRandom)
        GM_setValue('switchInterval', switchInterval)
        settingDialog.style.display = 'none'
        alert('切头像框设置完成！')
    }

    function loadSetttingToUI(settingDialog) {
        const frameList = GM_getValue('frameList', [])
        const isRandom = GM_getValue('isRandom', false)
        const switchInterval = GM_getValue('switchInterval', 60)
        settingDialog.querySelector('#saf-input-frame-list').value = frameList.join('\n')
        settingDialog.querySelector("#saf-input-random-switch").checked = isRandom
        settingDialog.querySelector("#saf-input-switch-interval").value = switchInterval
    }

    function createSettingUI() {
        console.log('[SAF] createSettingUI')
        GM_addStyle(SETTING_STYLE)
        const navbar = document.querySelector('.ac-member-navigation')
        const navItem = htmlToElement(NAV_ITEM_HTML)
        navbar.appendChild(navItem)
        const dialog = htmlToElement(SETTING_DIALOG_HTML)
        loadSetttingToUI(dialog)
        document.body.appendChild(dialog)
        // 侧边栏按钮点击事件
        navItem.addEventListener('click', () => {
            dialog.style.display = 'block'
        })
        // dialog外被点击时关闭dialog
        // TODO: 二次确认防止手误
        window.addEventListener('click', (event) => {
            if (event.target == dialog) {
                dialog.style.display = 'none'
            }
        })
        // dialog确认按钮
        dialog.querySelector('#saf-confirm-setting').addEventListener('click', () => {
            confirmCurrentSetting(dialog)
        })
    }

    function doSwitchFrame() {
        const frameList = GM_getValue('frameList', [])
        if (frameList.length <= 0) {
            console.log('[SAF] frameList is empty, skip switch frame')
            return
        }
        const isRandom = GM_getValue('isRandom', false)
        const currIndex = GM_getValue('currIndex', 0)
        let nextIndex = 0
        if (!isRandom) {
            // 非随机，则取下一个
            nextIndex = (currIndex + 1) % frameList.length
        } else {
            // 随机
            nextIndex = Math.floor(Math.random() * frameList.length)
        }
        const nextFrameId = frameList[nextIndex]
        const nowTs = Date.now()
        GM_setValue('lastSwitchTs', nowTs)
        console.log(`[SAF] Ready to send request !!! data: productId=${nextFrameId}`)
        // const formData = new FormData()
        // formData.append('productId', nextFrameId)
        GM_xmlhttpRequest({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.acfun.cn',
                'Referer': 'https://www.acfun.cn/member/mall?tab=items',
            },
            url: 'https://www.acfun.cn/rest/pc-direct/shop/useItem',
            data: `productId=${nextFrameId}`,
            onload: (response) => {
                console.debug(response)
                GM_setValue('currIndex', nextIndex)
            }
        })
    }

    // 每次访问页面都调用，检查是否达到切换间隔，到时间了才会真正切头像
    function trySwitchFrame() {
        console.log('[SAF] trySwitchFrame')
        const lastSwitchTs = GM_getValue('lastSwitchTs', 0)
        const nowTs = Date.now()
        const switchInterval = GM_getValue('switchInterval', null)
        if (typeof(switchInterval) !== 'number') {
            console.log('[SAF] switchInterval not set, skip switch frame')
            return
        }
        if (nowTs - lastSwitchTs <= switchInterval * 60 * 1000) {
            // 间隔还没到
            console.log(`[SAF] interval: ${switchInterval} (${switchInterval * 60 * 1000}), delta: ${nowTs - lastSwitchTs}`)
            return
        }
        doSwitchFrame()
    }

    function safOnload() {
        console.log('[SAF] Switch Avatar Frame Onload !!')
        trySwitchFrame()
        if (window.location.pathname.startsWith('/member')) {
            createSettingUI()
        }
    }

    window.addEventListener('load', safOnload)

    console.log(`[SAF] All set values:
currIndex: ${GM_getValue('currIndex', null)}
frameList: ${GM_getValue('frameList', null)}
isRandom: ${GM_getValue('isRandom', null)}
switchInterval: ${GM_getValue('switchInterval', null)}
lastSwitchTs: ${GM_getValue('lastSwitchTs', null)}
`)

})();
