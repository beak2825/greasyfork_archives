// ==UserScript==
// @name         bilibili倍速快捷键【增强】+记忆
// @namespace    tonyu_balabala_03e6ea
// @version      1.6
// @description  bilibili倍速快捷键+记忆(可自定义设置快捷键，自定义一个额外倍速按钮，设置记忆模式)
// @author       Tony
// @icon          data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0iemh1emhhbi1pY29uIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMuNzMyNTIgMi42NzA5NEMzLjMzMjI5IDIuMjg0ODQgMy4zMzIyOSAxLjY0MzczIDMuNzMyNTIgMS4yNTc2NEM0LjExMjkxIDAuODkwNjg0IDQuNzE1NTIgMC44OTA2ODQgNS4wOTU5MSAxLjI1NzY0TDcuMjE3MjMgMy4zMDQwM0M3LjI3NzQ5IDMuMzYyMTggNy4zMjg2OSAzLjQyNjEgNy4zNzA4MSAzLjQ5NDA3SDEwLjU3ODlDMTAuNjIxMSAzLjQyNjEgMTAuNjcyMyAzLjM2MjE4IDEwLjczMjUgMy4zMDQwM0wxMi44NTM4IDEuMjU3NjRDMTMuMjM0MiAwLjg5MDY4NCAxMy44MzY4IDAuODkwNjg0IDE0LjIxNzIgMS4yNTc2NEMxNC42MTc1IDEuNjQzNzMgMTQuNjE3NSAyLjI4NDg0IDE0LjIxNzIgMi42NzA5NEwxMy4zNjQgMy40OTQwN0gxNEMxNi4yMDkxIDMuNDk0MDcgMTggNS4yODQ5MyAxOCA3LjQ5NDA3VjEyLjk5OTZDMTggMTUuMjA4NyAxNi4yMDkxIDE2Ljk5OTYgMTQgMTYuOTk5Nkg0QzEuNzkwODYgMTYuOTk5NiAwIDE1LjIwODcgMCAxMi45OTk2VjcuNDk0MDZDMCA1LjI4NDkyIDEuNzkwODYgMy40OTQwNyA0IDMuNDk0MDdINC41ODU3OUwzLjczMjUyIDIuNjcwOTRaTTQgNS40MjM0M0MyLjg5NTQzIDUuNDIzNDMgMiA2LjMxODg2IDIgNy40MjM0M1YxMy4wNzAyQzIgMTQuMTc0OCAyLjg5NTQzIDE1LjA3MDIgNCAxNS4wNzAySDE0QzE1LjEwNDYgMTUuMDcwMiAxNiAxNC4xNzQ4IDE2IDEzLjA3MDJWNy40MjM0M0MxNiA2LjMxODg2IDE1LjEwNDYgNS40MjM0MyAxNCA1LjQyMzQzSDRaTTUgOS4zMTc0N0M1IDguNzY1MTkgNS40NDc3MiA4LjMxNzQ3IDYgOC4zMTc0N0M2LjU1MjI4IDguMzE3NDcgNyA4Ljc2NTE5IDcgOS4zMTc0N1YxMC4yMTE1QzcgMTAuNzYzOCA2LjU1MjI4IDExLjIxMTUgNiAxMS4yMTE1QzUuNDQ3NzIgMTEuMjExNSA1IDEwLjc2MzggNSAxMC4yMTE1VjkuMzE3NDdaTTEyIDguMzE3NDdDMTEuNDQ3NyA4LjMxNzQ3IDExIDguNzY1MTkgMTEgOS4zMTc0N1YxMC4yMTE1QzExIDEwLjc2MzggMTEuNDQ3NyAxMS4yMTE1IDEyIDExLjIxMTVDMTIuNTUyMyAxMS4yMTE1IDEzIDEwLjc2MzggMTMgMTAuMjExNVY5LjMxNzQ3QzEzIDguNzY1MTkgMTIuNTUyMyA4LjMxNzQ3IDEyIDguMzE3NDdaIiBmaWxsPSIjMDBhZWVjIj48L3BhdGg+PC9zdmc+
// @license       MIT
// @match        *://*.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/445705/bilibili%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE%E3%80%90%E5%A2%9E%E5%BC%BA%E3%80%91%2B%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/445705/bilibili%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE%E3%80%90%E5%A2%9E%E5%BC%BA%E3%80%91%2B%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hasObserve = false
    let isCusSpeed = GM_getValue('tony_is_cus_spd', false)
    let count = 0
    let defaultSpd = 1
    let callbackTimer
    let vdos
    let spdMemoryMode = GM_getValue('tony_spd_memory_mode', '2')
    let spdKCSettings = []
    let spdKCSettingKeys = ['tony_spd2_KC', 'tony_spd1p5_KC', 'tony_spd1p25_KC', 'tony_spd1_KC', 'tony_spd0p75_KC', 'tony_spd0p5_KC', 'tony_spdcus_KC']
    let spdKCSettingDefaultVals = [66, 86, 67, 71, 72, 74, 75]
    let spdKNames = []
    let spdKNameKeys = ['tony_spd2_KC_name', 'tony_spd1p5_KC_name', 'tony_spd1p25_KC_name', 'tony_spd1_KC_name', 'tony_spd0p75_KC_name', 'tony_spd0p5_KC_name', 'tony_spdcus_KC_name']
    let spdKNameDefaultVals = ['b', 'v', 'c', 'g', 'h', 'j', 'k']
    // spd2_KC_enable, spd1p5_KC_enable, spd1p25_KC_enable, spd1_KC_enable, spd0p75_KC_enable, spd0p5_KC_enable
    let spdEnableSettings = []
    let spdEnableSettingKeys = ['tony_spd2_KC_enable', 'tony_spd1p5_KC_enable', 'tony_spd1p25_KC_enable', 'tony_spd1_KC_enable', 'tony_spd0p75_KC_enable', 'tony_spd0p5_KC_enable', 'tony_spdcus_KC_enable']
    let spdEnableSettingDefaultVals = [true, true, false, false, false, false, true]
    for(let i =0;i<spdKCSettingKeys.length;i++) {
        spdKCSettings.push(GM_getValue(spdKCSettingKeys[i], spdKCSettingDefaultVals[i]))
    }
    for(let i =0;i<spdKNameKeys.length;i++) {
        spdKNames.push(GM_getValue(spdKNameKeys[i], spdKNameDefaultVals[i]))
    }
    for(let i= 0;i<spdEnableSettingKeys.length;i++) {
        spdEnableSettings.push(GM_getValue(spdEnableSettingKeys[i], spdEnableSettingDefaultVals[i]))
    }
    let cusSpd = GM_getValue('tony_spd_cus', 3)
    let speedList = [2, 1.5, 1.25, 1, 0.75, 0.5]
    let originalSpdListLength = speedList.length
    speedList.push(cusSpd)
    let spd = GM_getValue('tony_spd', 1)
    let bvdos = getVdos()
    if(bvdos.length>0) defaultSpd = bvdos[0].playbackRate
    function getVdos() {
        let vdos = document.querySelectorAll(".bpx-player-video-wrap bwp-video")
        if(vdos.length > 0) return vdos
        vdos = document.querySelectorAll(".bpx-player-video-wrap video")
//         if(vdos.length > 0) return vdos
//         vdos = document.getElementsByTagName('bwp-video')
//         if(vdos.length > 0) return vdos
//         vdos = document.getElementsByTagName('video')
        return vdos
    }
    function getSettingList() {
        let settingList = document.querySelectorAll(".squirtle-setting-panel-wrap>.squirtle-single-select")
        if(settingList.length==0) settingList = document.querySelectorAll(".bpx-player-ctrl-setting-menu-left .bpx-player-ctrl-setting-mirror")
        return settingList
    }
    function getBeisuList() {
        let beisuList = document.getElementsByClassName("bilibili-player-video-btn-speed-menu-list")
        if(beisuList.length==0) {
            beisuList = document.querySelectorAll(".squirtle-speed-select-list>.squirtle-select-item ")
        }
        if(beisuList.length==0) {
            beisuList = document.querySelectorAll(".edu-player-speed-list>.edu-player-speed-item")
        }
        if(beisuList.length==0) {
            beisuList = document.querySelectorAll(".bpx-player-ctrl-playbackrate-menu>.bpx-player-ctrl-playbackrate-menu-item")
        }
        return beisuList
    }
    function changeSpeed(beisuList, spd) {
        switch(spd) {
            case 2:
                beisuList[0].click()
                break
            case 1.5:
                beisuList[1].click()
                break
            case 1.25:
                beisuList[2].click()
                break
            case 1:
                beisuList[3].click()
                break
            case 0.75:
                beisuList[4].click()
                break
            case 0.5:
                beisuList[5].click()
                break
            case cusSpd:
                beisuList[6].click()
                break
            default:
                break
        }
    }
    function setPlaybackRate1(beisuList, vdo1) {
        let intervalCount = 0
        let myInterval
        myInterval = setInterval(() => {
            intervalCount++
            if(intervalCount>40 || vdo1.playbackRate === 1) {
                let temSpd = spd
                changeSpeed(beisuList, 1)
                changeSpeed(beisuList, temSpd)
                intervalCount = 0
                clearInterval(myInterval)
            }
        },100)
    }
    // video元素有变动及时绑定play监听
    function initObserver() {
        //let vdos = getVdos()
        let bpxPlayerVideoWraps = document.getElementsByClassName("bpx-player-video-wrap")
        //let config = {attributes: true, attributeFilter:['src']}
        let myConfig = {childList:true}

        function myObserveCallback(mutationsList, observer) {
            let vdoTagChanged = false
            for(let i = 0;i<mutationsList.length; i++) {
                let mutationRcd = mutationsList[i]
                for(let j = 0;j<mutationRcd.addedNodes.length; j++) {
                    let addedNode = mutationRcd.addedNodes[j]
                    if(addedNode.nodeName === "VIDEO" || addedNode.nodeName === "BWP-VIDEO") {
                        vdoTagChanged = true
                        break
                    }
                }
                for(let k = 0;k<mutationRcd.removedNodes.length; k++) {
                    let removedNode = mutationRcd.removedNodes[k]
                    if(removedNode.nodeName === "VIDEO" || removedNode.nodeName === "BWP-VIDEO") {
                        vdoTagChanged = true
                        break
                    }
                }
            }
            if(vdoTagChanged) {
                if(vdos.length>0) vdos[0].removeEventListener('play', vdoPlayHandler)
                vdos = getVdos()
                if(vdos.length>0) {
                    vdoPlayHandler = getVdoPlayHandler(vdos[0])
                    vdos[0].addEventListener('play', vdoPlayHandler)
                    vdoPlayHandler()
                }
            }
        }

        if(bpxPlayerVideoWraps.length>0) {
            const observer = new MutationObserver(myObserveCallback)
            observer.observe(bpxPlayerVideoWraps[0], myConfig)
            hasObserve = true
        }
        count++
        if(count<=20 && !hasObserve) setTimeout(initObserver, 1000)
    }
    initObserver()

    // 全局记忆
    if(spdMemoryMode==='2') defaultSpd = spd
    else {
        spd = defaultSpd
        GM_setValue('tony_spd',defaultSpd)
    }
    let cusBeisuMenu
    let initSpdCnt = 0
    let hasAddVdoListener = false
    let hasAddMenuListener = false
    let hasConfirmSpd = false
    let hasAddSettingMenu =false
    let oldSrc = ''
    let vdoPlayTimer
    // 监听视频组件变化

    // 视频播放监听回调函数
    let vdoPlayHandler
    function getVdoPlayHandler(vdo) {
        return function() {
            clearTimeout(vdoPlayTimer)
            vdoPlayTimer = setTimeout(function() {
                //视频开始播放
                if(oldSrc !== vdo.src) {
                    let bsList = getBeisuList()
                    if(bsList.length>0) {
                        // 每次初始倍速为1
                        if(spdMemoryMode === '3') spd = 1
                        // 默认 当前页面记忆倍速(页面刷新丢失记忆) 或 全局记忆
                        changeSpeed(bsList, spd)
                        setPlaybackRate1(bsList, vdo)
                    }
                    oldSrc =vdo.src
                }
            },100)
        }
    }
    function initSpeedAndListener() {
        let beisuList = getBeisuList()
        initSpdCnt++
        vdos = getVdos()
        let settingList = getSettingList()
        if(spdMemoryMode === '1' || spdMemoryMode === '2' || spdMemoryMode ==='3') {
            // 尝试持续监听视频play来判断切换
            if(vdos.length>0 && !hasAddVdoListener) {
                vdoPlayHandler = getVdoPlayHandler(vdos[0])
                vdos[0].addEventListener('play', vdoPlayHandler)
                hasAddVdoListener = true
            }
        } else if(vdos.length>0 && !hasAddVdoListener) {
            hasAddVdoListener = true
        }
        if(beisuList.length>0 && !hasAddMenuListener) {
            cusBeisuMenu = beisuList[0].cloneNode(true)
            let settingMenu = document.createElement('div')
            let beisuMenuUl = beisuList[0].parentNode
            settingMenu.className = beisuMenuUl.className
            settingMenu.setAttribute('style', 'height: 36px;line-height: 36px;cursor: pointer;margin-left:70px;user-select:none;')
            settingMenu.innerText = '设置'
            settingMenu.addEventListener('click',showSetting)
            cusBeisuMenu.setAttribute('data-value', cusSpd)
            cusBeisuMenu.innerText = cusSpd%1>0?(cusSpd+'x'):(cusSpd+'.0x')
            beisuList[0].parentNode.appendChild(cusBeisuMenu)
            beisuMenuUl.parentNode.appendChild(settingMenu)

            beisuList = getBeisuList()
            function getMenuClickHandler(i) {
                return function() {
                    spd = speedList[i]
                    //console.log('spd', spd)
                    GM_setValue('tony_spd',spd)
                    if(i>= originalSpdListLength) {
                        isCusSpeed = true
                        let vdos = getVdos()
                        if(vdos.length>0) vdos[0].playbackRate = spd
                    } else {isCusSpeed = false}
                    GM_setValue('tony_is_cus_spd', isCusSpeed)
                    let bpxPlayerCtrlPlaybackrateResults = document.getElementsByClassName('bpx-player-ctrl-playbackrate-result')
                    if(bpxPlayerCtrlPlaybackrateResults.length>0) bpxPlayerCtrlPlaybackrateResults[0].innerText = spd%1>0?(spd+'x'):(spd===1?'倍速':spd+'.0x')
                }
            }
            for(let i = 0;i<beisuList.length;i++) {
                beisuList[i].addEventListener('click', getMenuClickHandler(i))
            }
            hasAddMenuListener = true
            changeSpeed(beisuList, spd)
        }

        if(settingList.length>0 && !hasAddSettingMenu) {
            let settingBox = settingList[0].parentNode
            let spdSettingMenu = document.createElement('div')

            if(settingList[0].className.indexOf('bui-switch')!==-1) {
                spdSettingMenu.className = 'bui bui-switch'
                spdSettingMenu.setAttribute('style', 'height:32px;line-height:32px;width:100%;')
                let heightBox = settingList[0].parentNode.parentNode
                heightBox.style.height = parseInt(heightBox.style.height)+32+'px'
                let outHeightBox = heightBox.parentNode.parentNode
                outHeightBox.style.height = parseInt(outHeightBox.style.height)+32+'px'
            } else if(settingList[0].className.indexOf('squirtle-single-select')!==-1) {
                spdSettingMenu.className = 'squirtle-single-select'
            } else {
                spdSettingMenu.className = settingList[0].className
            }
            spdSettingMenu.innerText = '倍速设置'
            spdSettingMenu.addEventListener('click',showSetting)
            settingBox.appendChild(spdSettingMenu)
            hasAddSettingMenu = true
        }

        if(initSpdCnt<=40 && (!hasAddMenuListener || !hasAddVdoListener || !hasAddSettingMenu)) {
            setTimeout(initSpeedAndListener,500)
        }
        if(hasAddMenuListener && hasAddVdoListener && !hasConfirmSpd) {
            setPlaybackRate1(beisuList, vdos[0])
            hasConfirmSpd = true
        }
    }
    initSpeedAndListener()

    // 节流标志
    let flag = false
    document.addEventListener('keydown', function(e){
        var target = e.target || {},
            isInput = ("INPUT" == target.tagName || "TEXTAREA" == target.tagName || "SELECT" == target.tagName || "EMBED" == target.tagName);
        // 如果是文本输入元素，或者不是一个真实的元素
        if(isInput || !target.tagName) return;
        // 如果是一个虚假的输入元素
        if(target && target.getAttribute && target.getAttribute('role') === 'textbox') return;
        if(flag) return
        flag = true
        setTimeout(() => {
            flag = false
        },100)
        let beisuList = getBeisuList()
        for(let i=0;i<spdKCSettings.length;i++) {
            if(e.keyCode == spdKCSettings[i] && beisuList.length!==0) {
                if(spdEnableSettings[i]) {
                    if(spd === speedList[i]) {
                        beisuList[3].click()
                    } else {
                        beisuList[i].click()
                    }
                }
                break
            }
        }
    });
    let hasSettingShow = false
    function showSetting() {
        if(hasSettingShow) return
        let settingBox = document.createElement("div");
        settingBox.setAttribute("style", `position: fixed !important;
        top: 10px !important;
        left: 50% !important;
        z-index:2147483647 !important;
        `)
        let contentBox = document.createElement('div')
        contentBox.setAttribute("style", `box-shadow: 0 0 10px rgba(100, 100, 100, 0.2) !important;
        max-height: calc(100vh - 60px) !important;
        max-width: 80vw !important;
        overflow: auto !important;
        background-color: rgb(235, 235, 235) !important;
        text-align: center !important;
        font-size: 13px !important;
        border-radius: 16px !important;
        white-space: nowrap;
        padding: 10px 16px 10px 16px !important;
        margin-left: -50% !important;
        margin-right: 50% !important;
        z-index:2147483647 !important;
        box-sizing: content-box !important;
        border: 2px solid rgb(100 100 100 / 10%) !important;
        `)
        if('backdropFilter' in document.documentElement.style) {
            contentBox.style.backgroundColor = 'rgba(235, 235, 235, 0.8)'
            contentBox.style.backdropFilter = 'saturate(50%) blur(14px)'
            //contentBox.style.transform = 'translateZ(0)'
        }
        if(getComputedStyle) {
            let fontFml = getComputedStyle(document.body, null)['font-family']
            if(fontFml) contentBox.style.fontFamily = fontFml
        }
        let settingContent = document.createElement('div')
        settingContent.setAttribute('style', 'font-weight: 600 !important;')

        let MemorySettingTitle = document.createElement('div')
        //MemorySettingTitle.setAttribute('style', 'margin-top:10px;')
        MemorySettingTitle.innerText = '倍速记忆模式'
        settingContent.appendChild(MemorySettingTitle)

        let spdMemoryModeSelector = document.createElement('select')
        spdMemoryModeSelector.setAttribute('style', 'margin-top:10px;padding:3px 10px;border:2px solid rgb(168,168,168);border-radius:10px;cursor:pointer;')
        let spdMemoryModeOption1 = document.createElement('option')
        spdMemoryModeOption1.value = '1'
        spdMemoryModeOption1.innerText = '仅当前页面记忆倍速'
        spdMemoryModeOption1.selected = spdMemoryMode==='1'
        let spdMemoryModeOption2 = document.createElement('option')
        spdMemoryModeOption2.value = '2'
        spdMemoryModeOption2.innerText = '全局记忆倍速'
        spdMemoryModeOption2.selected = spdMemoryMode==='2'
        let spdMemoryModeOption3 = document.createElement('option')
        spdMemoryModeOption3.value = '3'
        spdMemoryModeOption3.innerText = '每次初始倍速为1(不记忆)'
        spdMemoryModeOption3.selected = spdMemoryMode==='3'
        let spdMemoryModeOption4 = document.createElement('option')
        spdMemoryModeOption4.value = '4'
        spdMemoryModeOption4.innerText = '什么都不做'
        spdMemoryModeOption4.selected = spdMemoryMode==='4'
        spdMemoryModeSelector.appendChild(spdMemoryModeOption1)
        spdMemoryModeSelector.appendChild(spdMemoryModeOption2)
        spdMemoryModeSelector.appendChild(spdMemoryModeOption3)
        spdMemoryModeSelector.appendChild(spdMemoryModeOption4)
        spdMemoryModeSelector.addEventListener('change', function() {
            spdMemoryMode = spdMemoryModeSelector.value
            GM_setValue('tony_spd_memory_mode', spdMemoryMode)
        })
        settingContent.appendChild(spdMemoryModeSelector)

        let cusSpdTitle = document.createElement('div')
        cusSpdTitle.setAttribute('style', 'margin-top:10px;')
        cusSpdTitle.innerText = '自定义倍速键设置'
        settingContent.appendChild(cusSpdTitle)

        let cusSpdSettingBox = document.createElement('div')
        cusSpdSettingBox.setAttribute('style', 'margin-top:10px;')
        let cusSpdSettingBtnBox = document.createElement('div')
        cusSpdSettingBtnBox.setAttribute('style', 'display:none;margin-top:8px;')
        let cusSpdSettingBtnOK = document.createElement('button')
        let cusSpdSettingBtnCancel = document.createElement('button')
        let cusSpdInput = document.createElement('input')
        cusSpdInput.setAttribute('type', 'number')
        cusSpdInput.setAttribute('style', 'max-width:100px;padding:5px 10px;border:2px solid rgb(168,168,168);border-radius:10px;')
        cusSpdInput.value = cusSpd
        let oldCusSpd
        cusSpdInput.addEventListener('focus', function() {
            oldCusSpd = cusSpd
            cusSpdSettingBtnBox.style.display = 'block'
        })

        cusSpdSettingBtnOK.innerText = '确认'
        cusSpdSettingBtnOK.setAttribute('style', 'padding:8px 10px;border:0;color:white;background-color:rgb(25,207,20);border-radius:28px;cursor:pointer;')
        cusSpdSettingBtnOK.addEventListener('click', function() {
            let oldCusSpd = cusSpd
            let temCusSpd = parseFloat(cusSpdInput.value)
            if(!temCusSpd || temCusSpd<=0 || temCusSpd>16) {
                cusSpdInput.value = cusSpd
                cusSpdSettingBtnBox.style.display = 'none'
                return
            }
            cusSpd = temCusSpd
            GM_setValue('tony_spd_cus', cusSpd)
            speedList[speedList.length-1] = cusSpd
            if(cusBeisuMenu) {
                cusBeisuMenu.setAttribute('data-value', cusSpd)
                cusBeisuMenu.innerText = cusSpd%1>0?(cusSpd+'x'):(cusSpd+'.0x')
                if(isCusSpeed && oldCusSpd!==cusSpd) cusBeisuMenu.click()
            }
            speedSettingBtns[speedSettingBtns.length-1].innerText = cusSpd
            if(speedSettingBtns[speedSettingBtns.length-1].style.backgroundColor === 'rgb(50, 130, 236)') speedSettingBtns[speedSettingBtns.length-1].click()
            cusSpdSettingBtnBox.style.display = 'none'
        })

        cusSpdSettingBtnCancel.innerText = '取消'
        cusSpdSettingBtnCancel.setAttribute('style', 'margin-right:6px;padding:8px 10px;border:0;color:white;background-color:rgb(243,97,128);border-radius:28px;cursor:pointer;')
        cusSpdSettingBtnCancel.addEventListener('click', function() {
            cusSpdInput.value = cusSpd
            cusSpdSettingBtnBox.style.display = 'none'
        })
        cusSpdSettingBox.appendChild(cusSpdInput)
        cusSpdSettingBtnBox.appendChild(cusSpdSettingBtnCancel)
        cusSpdSettingBtnBox.appendChild(cusSpdSettingBtnOK)
        cusSpdSettingBox.appendChild(cusSpdSettingBtnBox)
        settingContent.appendChild(cusSpdSettingBox)

        let KCSettingTitle = document.createElement('div')
        KCSettingTitle.setAttribute('style', 'margin-top:10px;')
        KCSettingTitle.innerText = '倍速快捷键设置'
        settingContent.appendChild(KCSettingTitle)

        let KCBox = document.createElement('div')
        KCBox.setAttribute('style', 'margin-top:10px;')

        let settingBtnBox = document.createElement('div')
        settingBtnBox.setAttribute('style', 'margin-top:10px;')
        let speedSettingBtns = []
        for(let i = 0; i < speedList.length; i++) {
            let speedSettingBtn = document.createElement('button')
            speedSettingBtns.push(speedSettingBtn)
            speedSettingBtn.setAttribute('style', 'margin:0 3px;padding:8px 10px;min-width:38px;border:0;color:white;background-color:rgb(100,100,100);border-radius:28px;cursor:pointer;')
            speedSettingBtn.innerText = speedList[i]
            speedSettingBtn.addEventListener('click', function() {
                for(let j = 0; j<speedList.length;j++) {
                    if(j===i) speedSettingBtns[j].style.backgroundColor = 'rgb(50,130,236)'
                    else speedSettingBtns[j].style.backgroundColor = 'rgb(100,100,100)'
                }

                let KCSwitch = document.createElement('input')
                KCSwitch.setAttribute('style', 'vertical-align: middle;')
                let switchTip = document.createElement('span')
                switchTip.setAttribute('style', 'vertical-align: middle;')
                KCSwitch.setAttribute('type', 'checkbox')
                KCSwitch.checked = spdEnableSettings[i]
                switchTip.innerText = speedList[i]+'倍速快捷键 '+(spdEnableSettings[i]?'启用':'关闭')
                KCSwitch.addEventListener('change', function() {
                    spdEnableSettings[i] = KCSwitch.checked
                    switchTip.innerText = speedList[i]+'倍速快捷键 '+(spdEnableSettings[i]?'启用':'关闭')
                    GM_setValue(spdEnableSettingKeys[i], KCSwitch.checked)
                })

                let KCSettingBox = document.createElement('div')
                KCSettingBox.setAttribute('style', 'margin-top:10px;')

                let KNameTitle = document.createElement('span')
                KNameTitle.innerText = speedList[i]+'倍速快捷键（点击修改→）:'
                KNameTitle.setAttribute('style', 'margin-right:6px;')
                let KCSettingBtnBox = document.createElement('div')
                KCSettingBtnBox.setAttribute('style', 'display:none;margin-top:8px;')
                let KCSettingBtnOK = document.createElement('button')
                let KCSettingBtnCancel = document.createElement('button')
                let KName = document.createElement('button')
                KName.innerText = spdKNames[i]
                KName.setAttribute('style', 'padding:6px 14px;border-radius:28px;color:rgb(5,107,0);background-color:rgb(240,240,240);border:2px solid rgb(150,150,150);cursor:pointer;')
                let clickSpdKC = spdKCSettings[i]
                let clickSpdKName = spdKNames[i]
                function keyupHandler(e) {
                    e.stopPropagation()
                    clickSpdKC = e.keyCode
                    clickSpdKName = e.key
                    KName.innerText = clickSpdKName
                }
                function kNameClickHandler() {
                    clickSpdKC = spdKCSettings[i]
                    clickSpdKName = spdKNames[i]
                    KName.innerText = '请按键ヾ(•ω•`)o'
                    document.addEventListener('keydown', keyupHandler, true)
                    KName.removeEventListener('click', kNameClickHandler)
                    KCSettingBtnBox.style.display = 'block'
                    KName.focus()
                }
                KName.addEventListener('click', kNameClickHandler)

                KCSettingBtnOK.innerText = '确认'
                KCSettingBtnOK.setAttribute('style', 'padding:8px 10px;border:0;color:white;background-color:rgb(25,207,20);border-radius:28px;cursor:pointer;')
                KCSettingBtnOK.addEventListener('click', function() {
                    spdKCSettings[i] = clickSpdKC
                    spdKNames[i] = clickSpdKName
                    GM_setValue(spdKCSettingKeys[i], clickSpdKC)
                    GM_setValue(spdKNameKeys[i], clickSpdKName)
                    KName.innerText = spdKNames[i]
                    document.removeEventListener('keydown', keyupHandler, true)
                    KName.addEventListener('click', kNameClickHandler)
                    KCSettingBtnBox.style.display = 'none'
                })

                KCSettingBtnCancel.innerText = '取消'
                KCSettingBtnCancel.setAttribute('style', 'margin-right:6px;padding:8px 10px;border:0;color:white;background-color:rgb(243,97,128);border-radius:28px;cursor:pointer;')
                KCSettingBtnCancel.addEventListener('click', function() {
                    KName.innerText = spdKNames[i]
//                     let clickSpdKC = spdKCSettings[i]
//                     let clickSpdKName = spdKNames[i]
                    document.removeEventListener('keydown', keyupHandler, true)
                    KName.addEventListener('click', kNameClickHandler)
                    KCSettingBtnBox.style.display = 'none'
                })
                KCSettingBox.appendChild(KNameTitle)
                KCSettingBox.appendChild(KName)
                KCSettingBtnBox.appendChild(KCSettingBtnCancel)
                KCSettingBtnBox.appendChild(KCSettingBtnOK)
                KCSettingBox.appendChild(KCSettingBtnBox)

                KCBox.innerHTML = ''
                KCBox.appendChild(switchTip)
                KCBox.appendChild(KCSwitch)
                KCBox.appendChild(KCSettingBox)

            })
            settingBtnBox.appendChild(speedSettingBtn)
        }
        settingContent.appendChild(settingBtnBox)

        settingContent.appendChild(KCBox)

        let hideBtnBox = document.createElement('div')
        hideBtnBox.setAttribute('style', 'margin-top:10px;')
        let hideBtn = document.createElement('button')
        hideBtn.innerText = '关闭面板'
        hideBtn.setAttribute('style', 'padding:8px 10px;border:0;color:white;background-color:rgb(50,130,236);border-radius:28px;cursor:pointer;')
        hideBtn.addEventListener('click', function() {
            document.documentElement.removeChild(settingBox)
            hasSettingShow = false
        })
        hideBtnBox.appendChild(hideBtn)
        settingContent.appendChild(hideBtnBox)

        let appreciateBtnBox = document.createElement('div')
        appreciateBtnBox.setAttribute('style', 'margin-top:10px;')
        let appreciateImg
        let appreciateBtn = document.createElement('button')
        appreciateBtn.innerText = '支持作者'
        appreciateBtn.setAttribute('style', 'padding:8px 10px;border:0;color:white;background-color:rgb(213, 183, 123);border-radius:28px;cursor:pointer;')
        let appreciateCancelBtnBox = document.createElement('div')
        appreciateCancelBtnBox.setAttribute('style', 'margin-top:10px;')
        let appreciateCancelBtn = document.createElement('button')
        appreciateCancelBtn.innerText = '∧'
        appreciateCancelBtn.setAttribute('style', 'padding:5px 10px;border:0;color:white;background-color:rgb(160, 160, 160);border-radius:28px;cursor:pointer;')
        appreciateCancelBtnBox.appendChild(appreciateCancelBtn)
        function appreciateCancelBtnClickHandler() {
            settingContent.removeChild(appreciateImg)
            settingContent.removeChild(appreciateCancelBtnBox)
            appreciateBtn.addEventListener('click', appreciateBtnClickHandler)
        }
        appreciateCancelBtn.addEventListener('click', appreciateCancelBtnClickHandler)
        function appreciateBtnClickHandler() {
            appreciateImg = document.createElement('img')
            appreciateImg.src = 'data:image/jpeg;base64,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'
            appreciateImg.alt = '支持作者'
            appreciateImg.setAttribute('style', 'margin-top:10px;max-width:240px;max-height:320px;min-width:180px;min-height:240px;border-radius:10px;')
            settingContent.insertBefore(appreciateImg, settingTip)
            settingContent.insertBefore(appreciateCancelBtnBox, settingTip)
            appreciateBtn.removeEventListener('click', appreciateBtnClickHandler)
        }
        appreciateBtn.addEventListener('click', appreciateBtnClickHandler)
        appreciateBtnBox.appendChild(appreciateBtn)
        settingContent.appendChild(appreciateBtnBox)

        let settingTip = document.createElement('div')
        settingTip.setAttribute('style', 'margin-top:10px;')
        settingTip.innerText = '设置完成后刷新页面，以确保生效'
        settingContent.appendChild(settingTip)

        contentBox.appendChild(settingContent)
        settingBox.appendChild(contentBox)
        document.documentElement.appendChild(settingBox)
        hasSettingShow = true
        speedSettingBtns[0].click()
    }
    GM_registerMenuCommand('设置',showSetting)
})();