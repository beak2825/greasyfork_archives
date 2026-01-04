// ==UserScript==
// @name         高亮个别用户的弹幕
// @namespace    http://tampermonkey.net/
// @version      0.7.26
// @description  高亮个别用户的弹幕, 有时候找一些特殊人物(其他直播主出现在直播房间)用
// @author       Eric Lam
// @include      https://sc.chinaz.com/tag_yinxiao/tongzhi.html
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @include      /https?:\/\/eric2788\.github\.io\/scriptsettings\/highlight-user(\/)?/
// @include      /https?:\/\/eric2788\.neeemooo\.com\/scriptsettings\/highlight-user(\/)?/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=1045452
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-start
// @connect      api.bilibili.com
// @website      https://eric2788.github.io/scriptsettings/highlight-user
// @homepage     https://eric2788.neeemooo.com/scriptsettings/highlight-user
// @downloadURL https://update.greasyfork.org/scripts/418195/%E9%AB%98%E4%BA%AE%E4%B8%AA%E5%88%AB%E7%94%A8%E6%88%B7%E7%9A%84%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/418195/%E9%AB%98%E4%BA%AE%E4%B8%AA%E5%88%AB%E7%94%A8%E6%88%B7%E7%9A%84%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const defaultSettings = {
        highlightUsers: [
            396024008, // 日本兄贵
            604890122, // 日本兄贵
            623441609, // 凤玲天天 (DD)
            1618670884, // 日本兄贵
            406805563, // 乙女音
            2299184, // 古守
            198297, // 冰糖
            1576121 // paryi
        ],
        settings: {
            color: '#FFFF00',
            opacity: 1.0,
            playAudio: false,
            playAudioDanmu: false,
            join_notify_duration: 5000,
            join_notify_position: "bottom-left",
            volume: {
                danmu: 1.0,
                join: 1.0
            }
        }
    }

    const defaultSounds = {
        join: '//downsc.chinaz.net/Files/DownLoad/sound1/201911/12221.mp3',
        danmu: '//downsc.chinaz.net/Files/DownLoad/sound1/202003/12643.mp3'
    }

    const storage = GM_getValue('settings', defaultSettings)
    const sounds = GM_getValue('sounds', defaultSounds)
    const { highlightUsers, settings: currentSettings } = storage
    const settings = { ...defaultSettings.settings, ...currentSettings }
    console.debug(highlightUsers)
    console.debug(settings)


    async function generateWbi() {
        const url = 'https://api.bilibili.com/x/web-interface/nav';
        // get wbi keys
        const data = await GM.xmlHttpRequest({
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'Referer': 'https://www.bilibili.com',
                'Origin': 'https://www.bilibili.com'
            },
            url
        });

        console.log(`response for ${url}: ${data?.response ?? data}`);
        const res = JSON.parse(data.response);

        const { img_url, sub_url } = res.data.wbi_img;

        const img_key = img_url.substring(img_url.lastIndexOf('/') + 1, img_url.length).split('.')[0];
        const sub_key = sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.length).split('.')[0]

        const mixinKeyEncTab = [
            46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
            33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
            61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
            36, 20, 34, 44, 52
        ]

        const orig = img_key + sub_key;

        let temp = ''
        mixinKeyEncTab.forEach((n) => {
            temp += orig[n]
        })

        return temp.slice(0, 32)
    }

    // ==== check update
    const { key, update } = GM_getValue('wbi_salt', { key: '', update: new Date('1970/01/01') });
    const now = new Date();

    // over a day
    if (!key || Math.abs(now - update) > (86400 * 1000)) {
        const wbiKey = await generateWbi();
        console.info('wbi key salt updated: '+wbiKey);
        GM_setValue('wbi_salt', { key: wbiKey, update: now });
    }
    // ====


    // gener w_rid
    /* reference
    def w_rid():  # 每次请求生成w_rid参数
      wts = str(int(time.time()))  # 时间戳
      c = "72136226c6a73669787ee4fd02a74c27"  # 尾部固定值，根据imgKey,subKey计算得出
      b = "mid=" + uid + "&platform=web&token=&web_location=1550101"
      a = b + "&wts=" + wts + c  # mid + platform + token + web_location + 时间戳wts + 一个固定值
      return hashlib.md5(a.encode(encoding='utf-8')).hexdigest()
    */
    function w_rid(uid, wts) {
        const { key: c } = GM_getValue('wbi_salt')
        const b = "mid=" + uid + "&platform=web&token=&web_location=1550101"
        const a = b + "&wts=" + wts + c  // mid + platform + token + web_location + 时间戳wts + 一个固定值
        const m = md5.create()
        m.update(a)
        return m.hex()
    }

    async function requestUserInfo(mid) {
        let error = null;
        const baseUrls = [
            () => `https://api.bilibili.com/x/space/acc/info?mid=${mid}&jsonp=jsonp`, // 已經失效
            () => `https://api.bilibili.com/x/space/wbi/acc/info?mid=${mid}&jsonp=jsonp`, // 已經失效
            () => {
                const now = Math.round(Date.now() / 1000);
                return `https://api.bilibili.com/x/space/wbi/acc/info?platform=web&token=&web_location=1550101&wts=${now}&mid=${mid}&w_rid=${w_rid(mid, now)}&dm_cover_img_str=ahwidhawihdai`
            }
        ]
        for (const base of baseUrls) {
            try {
                const url = base();
                console.info(`正在使用 ${url} 進行請求...`)
                return await webRequest(url)
            } catch (err) {
                console.error(`請求時出現錯誤: ${err?.message ?? err}`);
                console.warn(`嘗試使用下一個API`)
                error = err;
            }
        }
        console.warn('沒有可以使用的下一個API，將拋出錯誤')
        throw error;
    }

    if (location.origin == 'https://live.bilibili.com') {
        console.log('using highlight filter')

        function hexToNum(color) {
            const hex = color.substr(1)
            return parseInt(hex, 16)
        }

        $(document.head).append(`<link href="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css" rel="stylesheet" />`)

        const audio = {
            join: new Audio(sounds.join),
            danmu: new Audio(sounds.danmu)
        }
        audio.join.volume = settings.volume.join
        audio.danmu.volume = settings.volume.danmu
        const highlights = new Set()
        const highlightsMapper = new Map()
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": `toast-${settings.join_notify_position}`,
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": `${settings.join_notify_duration}`,
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        const elements = ['.danmaku-item-container']

        async function launch() {
            console.debug('launching highlight filter...')
            while (!unsafeWindow.bliveproxy) {
                console.log('cannot not find bliveproxy, wait one second')
                await sleep(1000)
            }
            while (!elements.some(s => $(s).length > 0)) {
                console.log('cannot not find element, wait one second')
                await sleep(1000)
            }

            function handleUserEnter(uid, uname) {
                console.debug(`user enter: ${uid} (${uname})`)
                if (!highlightUsers.includes(uid)) return
                console.log(`name: ${uname} has enter this live room`)
                toastr.info(`你所关注的用户 ${uname} 已进入此直播间。`, `噔噔咚!`)
                if (settings.playAudio) audio.join.play()
            }

            console.debug('bliveproxy injected.')
            unsafeWindow.bliveproxy.addCommandHandler('DANMU_MSG', command => {
                // console.log(command);
                const userId = command.info[2][0]
                console.debug(`user send danmu: ${userId}`)
                if (!highlightUsers.includes(userId)) return
                console.debug('detected highlighted user: ' + userId)

                // /* 新版直播间无法改写弹幕信息 👇 -> 刪除 dm_v2 後成功
                command.info[0][13] = "{}" // 把那些圖片彈幕打回原形
                if (settings.color) {
                    command.info[0][3] = hexToNum(settings.color)
                }
                command.info[1] += `(${command.info[2][1]})`
                console.debug(`converted danmaku: ${command.info[1]}`)
                highlights.add(command.info[1])

                // trying to delete this field to make edit happen
                delete command.dm_v2;

                // */
                // highlightsMapper.set(command.info[1], command.info[2][1]);
                if (settings.playAudioDanmu) audio.danmu.play()
            })
            unsafeWindow.bliveproxy.addCommandHandler('INTERACT_WORD', ({ data }) => {
                const { uid, uname } = data
                handleUserEnter(uid, uname)
            })
            unsafeWindow.bliveproxy.addCommandHandler('ENTRY_EFFECT', async ({ data }) => {
                const { uid } = data
                if (!highlightUsers.includes(uid)) return
                let username;
                try {
                    const cache = GM_getValue(uid, null)
                    if (cache != null && cache.name != `无法索取用户资讯`) {
                        username = cache.name
                    } else {
                        const { name } = await requestUserInfo(uid)
                        username = name
                    }
                    console.debug(`成功辨别舰长 ${uid} 名称为 ${name}`)
                } catch (err) {
                    console.error(`索取大航海用户资讯错误: ${err}`)
                    console.warn(`将使用 uid 作为名称`)
                    username = `(UID: ${uid})`
                }
                handleUserEnter(uid, username)
            })
            if (settings.opacity) {
                const config = { attributes: false, childList: true, subtree: true }
                function danmakuCheckCallback(mutationsList) {
                    for (const mu of mutationsList) {
                        for (const node of mu.addedNodes) {
                            console.log('node', node);
                            const danmaku = node?.innerText?.trim() ?? node?.data?.trim()
                            console.log('danmaku', danmaku)
                            if (danmaku === undefined || danmaku === '') continue
                            if (!highlights.has(danmaku)) continue
                            // if (!highlightsMapper.has(danmaku)) continue;
                            // const user = highlightsMapper.get(danmaku);
                            // console.debug('highlighting danmaku: ', danmaku, ' with user: ', user)
                            const n = node.innerText !== undefined ? node : node.parentElement
                            const jimaku = $(n)
                            jimaku.css('opacity', `${settings.opacity}`)
                            //jimaku.css('color', `${settings.color}`)
                            //jimaku.text(`${danmaku}(${user})`);
                            highlights.delete(danmaku)
                            // highlightsMapper.delete(danmaku)
                        }
                    }
                }
                const danmakuObserver = new MutationObserver((mu, obs) => danmakuCheckCallback(mu))
                danmakuObserver.observe($('.danmaku-item-container')[0], config)
            }
        }

        await launch()
    } else if (["https://eric2788.github.io", "https://eric2788.neeemooo.com", "http://127.0.0.1:5500"].includes(location.origin)) {
        while (!unsafeWindow.mdui) {
            console.debug('cannot find mdui, wait one second')
            await sleep(1000)
        }
        const $ = mdui.$
        async function appendUser(userId, prompt = false) {
            if ($(`#${userId}`).length > 0) {
                mdui.alert('该用户已在列表内')
                return false
            }
            try {
                const lastUpdate = GM_getValue('last.update', new Date())
                const haveData = GM_getValue(userId, null) != null
                const today = new Date()
                if (!haveData || Math.abs(today - lastUpdate) > (86400 * 1000 * 7)) {
                    console.log('cache outdated, updating user info...')
                    const { name, face } = await requestUserInfo(userId)
                    GM_setValue(userId, { name, face })
                    GM_setValue('last.update', new Date())
                    console.log('user info updated and saved to cache.')
                } else {
                    console.log('loading user info from cache.')
                }
                const { name, face } = GM_getValue(userId, { name: `无法索取用户资讯`, face: '' })
                $('#hightlight-users').append(`
                    <label class="mdui-list-item mdui-ripple">
                        <div class="mdui-checkbox">
                            <input type="checkbox" id="${userId}"/>
                            <i class="mdui-checkbox-icon"></i>
                        </div>
                        <div class="mdui-list-item-avatar"><img src="${face}"/></div>
                        <div class="mdui-list-item-content">${name} (${userId})</div>
                   </label>
                `)
                return true;
            } catch (err) {
                console.warn(err)
                if (!!err.code) {
                    const { name, face } = GM_getValue(userId, { name: `无法索取用户资讯`, face: 'https://i0.hdslb.com/bfs/face/member/noface.jpg' })
                    const add = () => {
                      $('#hightlight-users').append(`
                        <label class="mdui-list-item mdui-ripple">
                          <div class="mdui-checkbox">
                            <input type="checkbox" id="${userId}"/>
                            <i class="mdui-checkbox-icon"></i>
                          </div>
                          <div class="mdui-list-item-avatar"><img src="${face}"/></div>
                          <div class="mdui-list-item-content">${name} (UID: ${userId})</div>
                        </label>
                      `)
                    }
                    if (prompt) {
                      const res = await new Promise((res,) => {
                         mdui.dialog({
                          title: `无法索取 ${userId} 的用户资讯`,
                          content: `错误信息: ${err.message}(${err.code}), 是否要强制添加？`,
                          buttons: [
                              {
                                text: '强制添加',
                                bold: true,
                                onClick: () => {
                                  add()
                                  res(true)
                                }
                              },
                              {
                                text: '取消'
                              }
                          ],
                          onClosed: () => res(false)
                         })
                      })
                      return res;
                    } else {
                      add()
                      return true;
                    }
                } else {
                    mdui.alert(`无法索取 ${userId} 的用户资讯: ${err.message}`)
                    return false;
                }
            } finally {
                $(`#${userId}`).on('change', e => {
                    if (getTicked().length > 0) {
                        $('#delete-btn').show()
                    } else {
                        $('#delete-btn').hide()
                    }
                })
            }
        }


        function getTicked() {
            return $('#hightlight-users').find('.mdui-checkbox > input').filter((i, e) => $(e).prop('checked')).map((i, e) => $(e).attr('id'))
        }

        $('#delete-btn').on('click', e => {
            getTicked().each((i, id) => $(`#${id}`).parents('.mdui-list-item').remove())
            GM_setValue('settings', getSettings())
            mdui.snackbar('删除并保存成功')
            $('#delete-btn').hide()
        })

        $('#user-add').on('keypress', async (e) => {
            if (e.which != 13) return
            if (!$('#user-add')[0].checkValidity()) return
            if (await appendUser(e.target.value, true)) {
                GM_setValue('settings', getSettings())
                mdui.snackbar('新增并保存成功')
                e.target.value = ''
            }
        });

        $('#save-btn').on('click', e => {
            if (!$('form')[0].checkValidity()) {
                mdui.snackbar('保存失败，请检查格式或漏填')
                return
            }
            GM_setValue('settings', getSettings())
            mdui.snackbar('保存成功')
        })

        $('#try-listen-join').on('click', () => {
            const audio = new Audio(sounds.join)
            audio.volume = parseVolume('#volume-join')
            $('#try-listen-join').attr('disabled', '')
            audio.addEventListener('canplaythrough', () => {
                audio.play()
                $('#try-listen-join').removeAttr('disabled')
            })
        })

        $('#try-listen-danmu').on('click', () => {
            const audio = new Audio(sounds.danmu)
            audio.volume = parseVolume('#volume-danmu')
            $('#try-listen-danmu').attr('disabled', '')
            audio.addEventListener('canplaythrough', () => {
                audio.play()
                $('#try-listen-danmu').removeAttr('disabled')
            })
        })

        const joinNotifyPosSelect = new mdui.Select('#join-notify-position', { position: 'bottom' })


        $('#import-setting').on('click', async () => {
            try {
                const area = $('#setting-area').val()
                const { highlightUsers, settings: currentSettings } = JSON.parse(area)
                const settings = { ...defaultSettings.settings, ...currentSettings }
                $('.mdui-list-item').remove() // clear old data
                await initializeSettings({ highlightUsers, settings })
                mdui.snackbar('设定档导入成功，请记得按下保存')
                $('#setting-area').val('')
            } catch (err) {
                console.error(err)
                mdui.snackbar('设定档导入失败，请检查格式有没有错误')
            }
        })

        $('#export-setting').on('click', () => {
            const area = JSON.stringify(getSettings())
            $('#setting-area').val(area)
            const text = $('#setting-area')[0]
            text.select();
            text.setSelectionRange(0, 99999);
            document.execCommand("copy")
            mdui.snackbar('设定档已导出并复制成功')
            $('#setting-area').val('')
        })

        async function initializeSettings({ highlightUsers, settings }) {
            await Promise.all(highlightUsers.map((id) => appendUser(id)))
            $('#opacity')[0].valueAsNumber = settings.opacity
            $('#color').val(settings.color)
            $('#color-picker').val(settings.color)
            $('#color-picker-btn').css('color', settings.color)
            $('#play-audio').prop('checked', settings.playAudio)
            $('#play-audio-danmu').prop('checked', settings.playAudioDanmu)
            $('#join-notify-duration')[0].valueAsNumber = settings.join_notify_duration
            $('#join-notify-position').val(settings.join_notify_position)
            $('#volume-danmu').val(settings.volume.danmu * 100)
            $('#volume-join').val(settings.volume.join * 100)
            mdui.updateSliders()
            joinNotifyPosSelect.handleUpdate()
            $('#list-loading').hide()
        }

        await initializeSettings({ highlightUsers, settings })

        function getSettings() {
            const users = new Set()
            $('#hightlight-users').find('.mdui-checkbox > input').map((i, e) => parseInt($(e).attr('id'))).filter((i, e) => !!e).each((i, e) => users.add(e))
            const settings = {
                opacity: $('#opacity')[0].valueAsNumber,
                color: $('#color')[0].checkValidity() ? $('#color').val() : '',
                playAudio: $('#play-audio').prop('checked'),
                playAudioDanmu: $('#play-audio-danmu').prop('checked'),
                join_notify_duration: $('#join-notify-duration')[0].valueAsNumber,
                join_notify_position: $('#join-notify-position').val(),
                volume: {
                    danmu: parseVolume('#volume-danmu'),
                    join: parseVolume('#volume-join')
                }
            }
            return { highlightUsers: [...users], settings }
        }

        function parseVolume(element) {
            const val = $(element)[0].value
            if (val == 0) return 0.0
            return parseFloat((val / 100).toFixed(2)) || 1.0
        }

    } else if (location.origin === 'https://sc.chinaz.com') {
        while ($('div.audio-class').length == 0) {
            await sleep(1000)
        }
        $('div.audio-class').empty();
        $('div.audio-class')
            .append(`<a href="javascript: void(0)" id="danmu-select">选为弹幕通知</a>`)
            .append('<a href="javascript: void(0)" id="join-select">选为进入通知</a>')
        $('a#danmu-select').on('click', e => {
            e.preventDefault();
            if (!window.confirm('确定选择为弹幕通知音效?')) return
            const url = $(e.target).parents('.audio-item').children('audio').attr('src')
            if (!url) {
                alert('选择失败，无效的URL')
                return
            }
            sounds.danmu = url
            GM_setValue('sounds', sounds)
            alert('设置成功')
        })

        $('a#join-select').on('click', e => {
            e.preventDefault();
            if (!window.confirm('确定选择为进入通知音效?')) return
            const url = $(e.target).parents('.audio-item').children('audio').attr('src')
            if (!url) {
                alert('选择失败，无效的URL')
                return
            }
            sounds.join = url
            GM_setValue('sounds', sounds)
            alert('设置成功')
        })
    }
})().catch(console.error);

async function webRequest(url) {
    const data = await GM.xmlHttpRequest({
        method: "GET",
        headers: {
            'Content-type': 'application/json',
            'Referer': 'https://www.bilibili.com',
            'Origin': 'https://www.bilibili.com',
            'User-Agent': 'Mozilla/5.0',
        },
        url
    })
    console.log(`response for ${url}: ${data?.response ?? data}`);
    const res = JSON.parse(data.response)
    if (res.code !== 0) throw res
    return res.data
}

async function sleep(ms) {
    return new Promise((res,) => setTimeout(res, ms))
}
