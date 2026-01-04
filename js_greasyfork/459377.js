// ==UserScript==
// @name         Bilidown联动脚本[音频mp3🎵，视频mp4📹，弹幕xml，ass🌴，封面🌾]
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  脚本负责获取音频，工具负责视频封面弹幕等等，相互联动，互相增强，好耶ヽ(✿ﾟ▽ﾟ)ノ
// @author       王子周棋洛
// @match        https://www.bilibili.com/video/*
// @icon         data:image/webp;base64,UklGRkoEAABXRUJQVlA4WAoAAAAwAAAAPwAAPwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZBTFBIoAAAAAFfoDaSDTr9kEn/UrmORERgqJdeT4zgpta2N3kpvwT2vncJ2etDlRAJkRAdkdAAefX7doaI/k+AJK1zTKOR3ieYT97EcH+aVhBe4GkOkmI6u5IgUT8dr2hK51EyjHm6EuLG5xYyr0N+96kins78P8p7nyrKGp/bIfYKMT6EKZ1HwVDUHlekmM6uIEgCO5CkGHqbCsKLUsxXer/ObaKRJAFWUDggtAEAAFAMAJ0BKkAAQAA/gbrNXrYxKSaoGAyqwDAJQBqv5i4QYRFzT/ewe1mJ22KucUYMTsK3jwwkf8stqz7QBvQGk6vMjaTmq2ViEiSLAR1tyBqGQgiVl9OQAsS9pi/vVcuzN4zM37Byu/vzBSbAANtKZ5uayFBaFvRGroBkEeijKjuBHPFsLGenK/cmNDrTzifuCSIJ/7i/iN3mTpvr+VDTxfR+AndcIgd4ITIALC+kAtGhEY+84lcBrJGGTL8sctYdjSwyxEymZswKkLHIQau61+hOR8OfHc9zjTsE1th9tHAMR4HsE2DBQYVAXK74u6HvEXONvCPNf+Ah+DAPYogluF+in3FCd0ceF2p704DGdxYqBDrVldeuslKulMg8w50VpbgiNKl4kAQ18A4yjKYOMrTZuNCp11UNCtSvjM9tCe1GXxDQY3fuAy24FtQaL12glbmxTCFblu/ZpuLBTgSCu1LCzsOLWdEZQAgrnNmoJkd4DzQjKGVrf4d1lQJiEfYQUxaBrK6syg07hhCi2hajnkjUg/XGWBJiQX5OvF7FLrdmlLZeCOW3tese1rensTisK4VgAAA=
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459377/Bilidown%E8%81%94%E5%8A%A8%E8%84%9A%E6%9C%AC%5B%E9%9F%B3%E9%A2%91mp3%F0%9F%8E%B5%EF%BC%8C%E8%A7%86%E9%A2%91mp4%F0%9F%93%B9%EF%BC%8C%E5%BC%B9%E5%B9%95xml%EF%BC%8Cass%F0%9F%8C%B4%EF%BC%8C%E5%B0%81%E9%9D%A2%F0%9F%8C%BE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/459377/Bilidown%E8%81%94%E5%8A%A8%E8%84%9A%E6%9C%AC%5B%E9%9F%B3%E9%A2%91mp3%F0%9F%8E%B5%EF%BC%8C%E8%A7%86%E9%A2%91mp4%F0%9F%93%B9%EF%BC%8C%E5%BC%B9%E5%B9%95xml%EF%BC%8Cass%F0%9F%8C%B4%EF%BC%8C%E5%B0%81%E9%9D%A2%F0%9F%8C%BE%5D.meta.js
// ==/UserScript==

(function () {
    let printLog = true
    const log = window.console.log
    window.console.log = (...args) => printLog && log.apply(window.console, args)
    let audioState = 'pending'
    let retryCounter = 0
    let my_xhr = null
    const currentVersion = GM_info.script.version
    let remoteVersion = null
    const updateUrl = 'https://update.greasyfork.org/scripts/459377/Bilidown%E8%81%94%E5%8A%A8%E8%84%9A%E6%9C%AC%5B%E9%9F%B3%E9%A2%91mp3%F0%9F%8E%B5%EF%BC%8C%E8%A7%86%E9%A2%91mp4%F0%9F%93%B9%EF%BC%8C%E5%BC%B9%E5%B9%95xml%EF%BC%8Cass%F0%9F%8C%B4%EF%BC%8C%E5%B0%81%E9%9D%A2%F0%9F%8C%BE%5D.meta.js?t=' + new Date().getTime()
    const localStorageMap = {
        '封面': 'bilidown_script_cover',
        '音频': 'bilidown_script_audio',
        '视频': 'bilidown_script_video',
        'bilidown客户端': 'bilidown_script_launch'
    }

    const $ = (el) => document.querySelector(el)
    const checkElExist = (c) => $(`.${c}`)
    const chooseEl = () => document.querySelectorAll('.video-info-detail-list') || document.querySelectorAll('.video-data')
    const renderBtn = () => Object.keys(localStorageMap).forEach(k => renderBtnLogic(`bilidown_script_btn bilidown_script_${k}_btn`, k))
    const mount = (el, containers) => containers.forEach(item => item.appendChild(el))
    const resetAudioAbout = (btn) => { btn.textContent = '音频'; audioState = 'pending'; }
    const removeAllBtn = () => Object.keys(localStorageMap).forEach(k => $(`.bilidown_script_${k}_btn`) && $(`.bilidown_script_${k}_btn`).remove())
    const injectStyle = (className, css) => {
        if (checkElExist(className)) return
        let style = document.createElement('style')
        style.className = className
        style.innerText = css
        document.head.appendChild(style)
    }
    // inject edit native style
    injectStyle('bilidown_script_eidt_native_2024', '.video-info-container{margin-bottom:6px}.video-info-detail-list{flex-wrap:wrap!important;height:44px!important}')
    const coverEvent = () => window.open(__INITIAL_STATE__.videoData.pic, '_blank')
    const videoEvent = () => location.href && window.open(`http://zhouql.vip/bilidown/?${location.href}`, '_blank')
    const launchEvent = () => location.href && window.open(`bilidown://parser?link=${location.href}`)
    const aduioEvent = (btn, e) => {
        e.preventDefault()
        if (audioState === 'pending') {
            audioState = 'active'
            const url = `https://api.bilibili.com/x/player/playurl?avid=${__INITIAL_STATE__.aid}&bvid=${__INITIAL_STATE__.bvid}&cid=${__INITIAL_STATE__.cidMap[__INITIAL_STATE__.bvid].cids[__INITIAL_STATE__.p]}&fnval=4048`
            fetch(url).then(resp => resp.json()).then(i => {
                my_xhr = new XMLHttpRequest()
                my_xhr.responseType = 'blob'
                my_xhr.open('GET', i.data.dash.audio[0].base_url, true)
                my_xhr.onprogress = event => btn.textContent = `下载中 ${parseInt((event.loaded / event.total) * 100)}%`
                my_xhr.onload = () => {
                    if (my_xhr.status !== 200) resetAudioAbout(btn)
                    const reader = new FileReader()
                    reader.readAsDataURL(my_xhr.response)
                    reader.onload = e => {
                        const a = document.createElement('a')
                        a.download = `${$('.video-title').textContent || "Hello World"}.mp3`
                        a.href = e.target.result
                        document.documentElement.appendChild(a)
                        a.click()
                        a.remove()
                        my_xhr = null
                        resetAudioAbout(btn)
                    }
                }
                my_xhr.onerror = () => resetAudioAbout(btn)
                my_xhr.onabort = () => resetAudioAbout(btn)
                my_xhr.ontimeout = () => resetAudioAbout(btn)
                my_xhr.send()
            })
        } else {
            my_xhr.abort()
            btn.textContent = '已取消下载'
            setTimeout(() => resetAudioAbout(btn), 1000)
        }
    }

    let updateCheck = async () => {
        try {
            const resp = await fetch(updateUrl)
            const text = await resp.text()
            if (!text) return false
            let arr = text.split('\n')
            for (let i = 0; i < arr.length; i++) {
                if (!arr[i].includes('@version')) continue
                remoteVersion = arr[i].split('version')[1].trim()
                if (currentVersion != remoteVersion) return true
            }
            return false
        } catch (e) {
            return false
        }
    }

    let toggleDialog = () => {
        let dialog = $('.bilidown_script_system_dialog')
        dialog.style.display = dialog.style.display === 'block' ? 'none' : 'block'
        if (dialog.style.display === 'block') echoDialogChecked()
    }

    let echoDialogChecked = () => {
        Object.values(localStorageMap).forEach((v, i) => {
            let value = JSON.parse(localStorage.getItem(v))
            if (value && value === true) {
                document.querySelectorAll('.bilidown_script_system__dialog__content label input')[i].checked = true
            }
        })
    }

    let renderBtnLogic = (className, text) => {
        let key = JSON.parse(localStorage.getItem(localStorageMap[text]))
        if (key && key === true) {
            let btn = document.createElement('button')
            registerEvent(btn, text)
            btn.textContent = text
            btn.className = className
            mount(btn, chooseEl())
        }
    }

    let registerEvent = (btn, text) => {
        if (!localStorageMap.hasOwnProperty(text)) return
        btn.addEventListener('click', e => {
            if (text === '封面') {
                coverEvent(e)
            } else if (text === '音频') {
                aduioEvent(btn, e)
            } else if (text === '视频') {
                videoEvent(e)
            } else if (text === 'bilidown客户端') {
                launchEvent(e)
            }
        })
    }

    let renderDialog = () => {
        if (checkElExist('bilidown_script_system_dialog')) return
        let target = document.createElement('div')
        target.className = 'bilidown_script_system_dialog'
        target.innerHTML = `<div class="bilidown_script_system__dialog__header"><div class="title"><img src="data:image/webp;base64,UklGRkoEAABXRUJQVlA4WAoAAAAwAAAAPwAAPwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZBTFBIoAAAAAFfoDaSDTr9kEn/UrmORERgqJdeT4zgpta2N3kpvwT2vncJ2etDlRAJkRAdkdAAefX7doaI/k+AJK1zTKOR3ieYT97EcH+aVhBe4GkOkmI6u5IgUT8dr2hK51EyjHm6EuLG5xYyr0N+96kins78P8p7nyrKGp/bIfYKMT6EKZ1HwVDUHlekmM6uIEgCO5CkGHqbCsKLUsxXer/ObaKRJAFWUDggtAEAAFAMAJ0BKkAAQAA/gbrNXrYxKSaoGAyqwDAJQBqv5i4QYRFzT/ewe1mJ22KucUYMTsK3jwwkf8stqz7QBvQGk6vMjaTmq2ViEiSLAR1tyBqGQgiVl9OQAsS9pi/vVcuzN4zM37Byu/vzBSbAANtKZ5uayFBaFvRGroBkEeijKjuBHPFsLGenK/cmNDrTzifuCSIJ/7i/iN3mTpvr+VDTxfR+AndcIgd4ITIALC+kAtGhEY+84lcBrJGGTL8sctYdjSwyxEymZswKkLHIQau61+hOR8OfHc9zjTsE1th9tHAMR4HsE2DBQYVAXK74u6HvEXONvCPNf+Ah+DAPYogluF+in3FCd0ceF2p704DGdxYqBDrVldeuslKulMg8w50VpbgiNKl4kAQ18A4yjKYOMrTZuNCp11UNCtSvjM9tCe1GXxDQY3fuAy24FtQaL12glbmxTCFblu/ZpuLBTgSCu1LCzsOLWdEZQAgrnNmoJkd4DzQjKGVrf4d1lQJiEfYQUxaBrK6syg07hhCi2hajnkjUg/XGWBJiQX5OvF7FLrdmlLZeCOW3tese1rensTisK4VgAAA="                alt=""><a href="https://greasyfork.org/zh-CN/scripts/459377" target="_blank">bilidown联动脚本</a></div><div class="close"><svg t="1721872624289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"                p-id="5584" width="64" height="64"><path                    d="M240.512 180.181333l271.530667 271.488 271.530666-271.488a42.666667 42.666667 0 0 1 56.32-3.541333l4.010667 3.541333a42.666667 42.666667 0 0 1 0 60.330667l-271.530667 271.530667 271.530667 271.530666a42.666667 42.666667 0 0 1-56.32 63.872l-4.010667-3.541333-271.530666-271.530667-271.530667 271.530667-4.010667 3.541333a42.666667 42.666667 0 0 1-56.32-63.872l271.488-271.530666-271.488-271.530667a42.666667 42.666667 0 0 1 60.330667-60.330667z"                    fill="#000000" p-id="5585"></path></svg></div></div><div class="bilidown_script_system__dialog__content"><ul><li><label id="cover"><span>封面</span><input type="checkbox" name="封面"></label></li><li><label id="audio"><span>音频</span><input type="checkbox" name="音频"></label></li><li><label id="video"><span>视频</span><input type="checkbox" name="视频"></label></li><li><label id="bilidown-pc"><span>bilidown客户端<a href="https://zhouql.vip/bilidown/pc/"                            target="_blank">[安装]</a></span><input type="checkbox" name="bilidown客户端"></label></li></ul></div>`
        mount(target, chooseEl())
        let closeDialog = $('.bilidown_script_system__dialog__header .close')
        closeDialog.addEventListener('click', e => toggleDialog())
        document.querySelectorAll('.bilidown_script_system__dialog__content label input').forEach(label => {
            label.addEventListener('click', e => {
                localStorage.setItem(localStorageMap[e.target.name], e.target.checked)
                removeAllBtn()
                renderBtn()
            })
        })
    }

    let renderSystemBtn = () => {
        if (checkElExist('bilidown_script_system_btn')) return
        let btn = document.createElement('button')
        btn.textContent = '设置'
        btn.className = 'bilidown_script_btn bilidown_script_system_btn'
        btn.addEventListener('click', e => toggleDialog())
        mount(btn, chooseEl())
    }

    let render = (retryNum = 5) => {
        (async function check(c) {
            if (c < 1) {
                console.error('bilidown script render timeout, stopped.')
                return
            }
            if (checkElExist('bpx-player-ctrl-playbackrate-menu')) {
                retryCounter === 0 && console.log('bilidown script rendering...')
                injectStyle('bilidown_script_style_2024', `.bilidown_script_btn{background-color:#0071e3;border:0;color:#fff;border-radius:100px;cursor:pointer;padding:0 6px;font-size:12px;margin:0 2px}.bilidown_script_system_dialog{width:280px;border:1px solid #ccc;padding:12px 16px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background-color:#fafafa;border-radius:4px;user-select:none;display:none;z-index:99999}.bilidown_script_system__dialog__header{display:flex;align-items:center;justify-content:space-between}.bilidown_script_system__dialog__header .title{display:flex;align-items:center;flex:1}.bilidown_script_system__dialog__header a{font-size:15px;text-decoration:none;color:#232323;transition:all .1s;flex:1;margin-right:30px}.bilidown_script_system__dialog__header img{height:18px;width:18px;margin-right:4px}.bilidown_script_system__dialog__header a:hover{color:#0071e3}.bilidown_script_system__dialog__header .close{display:flex;align-items:center;justify-content:center;cursor:pointer}.bilidown_script_system__dialog__header .close svg{width:16px;height:16px}.bilidown_script_system__dialog__content{margin-top:10px}.bilidown_script_system__dialog__content ul li{list-style:none;font-size:13px;margin:16px 0}.bilidown_script_system__dialog__content ul li:last-child{margin:0}.bilidown_script_system__dialog__content ul li label{display:flex;align-items:center;justify-content:space-between;cursor:pointer;color:#454545;}.bilidown_script_system__dialog__content ul li label a{color:#0071e3;pointer-events:all}.bilidown_script_system__dialog__content ul li span{pointer-events:none}.bilidown_script_system__dialog__content ul li input{margin-right:2px}.new_version{position:relative}.new_version::after{content:'';display:inline-block;position:absolute;width:9px;height:9px;border-radius:50%;background-color:#fc3c4a;top:0;left:-10px}.system_btn_new_version::after{right:0;left:initial}`)
                renderDialog()
                renderSystemBtn()
                removeAllBtn()
                renderBtn()
                console.log('bilidown script render success.')
                if (retryCounter === 0) {
                    const hasNewVersion = await updateCheck()
                    console.log(`bilidown new version result: ${hasNewVersion}`)
                    if (hasNewVersion) {
                        $('.bilidown_script_system__dialog__header a').textContent = `[新版本${remoteVersion}，点我更新]`
                        $('.bilidown_script_system__dialog__header a').classList.add('new_version')
                        $('.bilidown_script_system_btn').classList.add('new_version')
                        $('.bilidown_script_system_btn').classList.add('system_btn_new_version')
                    }
                }
                if (retryCounter++ < 6) {
                    console.log(`bilidown script render confirm${retryCounter}.`);
                    setTimeout(() => render(), 1000)
                }
            } else {
                console.log(`bilidown script waiting render${c}...`)
                setTimeout(() => check(c - 1), 1000)
            }
        })(retryNum)
    }
    window.onload = () => render(15)
})();