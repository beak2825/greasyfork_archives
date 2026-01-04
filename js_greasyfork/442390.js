// ==UserScript==
// @name           ANT TikTok 导入助手
// @description    此插件用来收集 TikTok 视频数据
// @author         BikeKoala
// @contributor    BikeKoala
// @version        0.1.12
// @license        MIT
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_addStyle
// @grant          unsafeWindow
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.js
// @require        https://cdn.staticfile.org/jqueryui/1.12.1/jquery-ui.min.js
// @resource       jQueryUICSS https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/jquery-ui.css
// @resource       jQueryUIIconSet1 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_f08000_256x240.png
// @resource       jQueryUIIconSet2 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_c47a23_256x240.png
// @resource       jQueryUIIconSet3 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_f35f07_256x240.png
// @include        https://www.tiktok.com/*
// @icon           https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at         document-start
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/442390/ANT%20TikTok%20%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/442390/ANT%20TikTok%20%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义基础变量
const mApiBase = 'http://10.10.0.11:3004/leaf'
const mBtn1Id = '_dcf_tiktok_task_btn'
const mBtn2Id = '_dcf_tiktok_tmpl_btn'
const mDialogId = '_dcf_tiktok_dialog'
const mStorageCateKey = '_dcf_tiktok_cate'
const mMaxDuration = 600
const mCateOptions = ['萌宠搞笑', '真人搞笑']
const mPlatform = 'tiktok'
const mItems = new Map()

// 定义基础方法
function parseLink(mode = 0) {
    const matched = location.href.match(/https:\/\/www\.tiktok\.com\/@[a-z0-9._]+\/video\/(\d{19,20})/)
    if (!matched) return ''
    return matched[mode]
}

function getCate() {
    return localStorage.getItem(mStorageCateKey) || mCateOptions[0]
}

function setCate(value) {
    localStorage.setItem(mStorageCateKey, value)
    return value
}

function getItem() {
    const html = document.getElementById('sigi-persisted-data').innerHTML
    eval(html)
    if (window.SIGI_STATE && window.SIGI_STATE.ItemModule) {
        Object.values(window.SIGI_STATE.ItemModule).map(item => mItems.set(item.id, item))
    }

    const vid = parseLink(1)
    return mItems.get(vid)
}

function showToast(msg, duration = 3000) {
	const m = document.createElement('div')
	m.innerHTML = msg
	m.style.cssText = 'font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;'
	document.body.appendChild(m)
	setTimeout(function () {
		const d = 0.5
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
		m.style.opacity = '0'
		setTimeout(function() {
			document.body.removeChild(m)
		}, d * 1000);
	}, duration)
}

function request(method, path, params = null, data = null) {
    const url = mApiBase + path + (params ? '?' + $.param(params) : '')
    data = data ? JSON.stringify(data): ''
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: (response) => {
                if (response.status >= 200 && response.status < 400) {
                    const ret = JSON.parse(response.responseText)
                    if (ret.code === 200) {
                        resolve(ret.data)
                    } else {
                        showToast('接口失败：' + ret.message)
                        reject(ret.message)
                    }
                } else {
                    showToast('接口失败：' + response.responseText)
                    reject()
                }
            },
            onabort: () => {
                showToast('接口失败')
                reject()
            },
            onerror: () => {
                showToast('接口失败')
                reject('接口请求失败')
            },
            ontimeout: () => {
                showToast('接口超时')
                reject()
            }
        })
    })
}

function getVideoTaskStatus() {
    const link = parseLink()
    const cate = getCate()
    return new Promise((resolve, reject) => {
        request('GET', '', { platform: mPlatform, link, cate })
            .then(v => resolve(v.status))
            .catch(e => reject(e))
    })
}

function createVideoTask() {
    const link = parseLink()
    const cate = getCate()
    const item = getItem()
    const html = JSON.stringify(item)

    return new Promise((resolve, reject) => {
        request('POST', '', null, { platform: mPlatform, link, cate, html })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}

function cancelVideoTask() {
    const link = parseLink()
    const cate = getCate()
    return new Promise((resolve, reject) => {
        request('DELETE', '', { platform: mPlatform, link, cate })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}

function showButton1() {
    const $container = $('[data-e2e="browse-video"]')
    $container.before(`
        <div id="${mBtn1Id}" style="position: fixed; left: 27px; top: 85px; width: 25px; height: 25px; cursor: pointer; color: white; font-weight: bold; text-align: center; line-height: 24px;"></div>
    `)
}

function modifyButton1(platform) {
    const colours = { create: '#C95819', cancel: 'orange' }
    const signs = { create: '+', cancel: '-' }
    $('#' + mBtn1Id)
        .css('display', 'block')
        .css('background', colours[platform])
        .data('platform', platform)
        .html(signs[platform])
}

function showButton2() {
    const cate = getCate()
    const $container = $('[data-e2e="browse-video"]')
    $container.before(`
      <div id="${mBtn2Id}" style="position: fixed; left: 27px; top: 115px; width: 25px; background: #C95819; cursor: pointer; color: white; text-align: center; line-height: 25px; word-break:break-all;">${cate}</div>
    `);
}

function modifyButton2(cate) {
    $('#' + mBtn2Id).html(cate)
}

function initButton1() {
    const _checkAndModifyButton1 = () => {
        getVideoTaskStatus()
            .then(v => modifyButton1(['stopped', 'canceled'].includes(v) ? 'create' : 'cancel'))
            // .catch(() => modifyButton1('create'))
            .catch(() => {
                modifyButton1('create')

                // NOTE 自动点击创建
                // $('#' + mBtn1Id).click()
            })
    }

    // 初始化按钮状态
    showButton1()
    _checkAndModifyButton1()

    // 监听按钮点击事件
    $('#' + mBtn1Id).click(function (e) {
        e.stopPropagation()

        const platform = $(this).data('platform')
        if (platform === 'create') {
            const duration = $('video')[0].duration
            if (duration > mMaxDuration) {
                return showToast(`视频时长应小于 ${mMaxDuration}s`)
            }

            createVideoTask().then(v => {
                if (v) {
                    setTimeout(modifyButton1('cancel'), 1000)
                    showToast('提交成功，任务稍后开始')
                } else {
                    showToast('提交失败，任务已经创建')
                }
            })
        }
        if (platform === 'cancel') {
            cancelVideoTask().then(v => {
                if (v) {
                    setTimeout(modifyButton1('create'), 1000)
                    showToast('取消成功，好险！')
                } else {
                    showToast('取消失败，任务已经完成或正在执行中')
                }
            })
        }
    })
}

function initButton2() {
    // 初始化按钮状态
    showButton2()

    // 监听按钮点击事件
    $('#' + mBtn2Id).click(function (e) {
        e.stopPropagation()

        const $dialog = $(`#${mDialogId}`)
        $dialog.dialog('open')

        const cate = getCate()
        $(`#${mDialogId} input`).each(function (i, elem) {
            if (elem.value === cate) {
                $(elem).focus()
            }
        })
    })
}

function initJqueryUI() {
    let css = GM_getResourceText('jQueryUICSS')
    const resourceNameMap = {
        'images\/ui-icons_f08000_256x240\.png': 'jQueryUIIconSet1',
        'images\/ui-icons_c47a23_256x240\.png': 'jQueryUIIconSet2',
        'images\/ui-icons_f35f07_256x240\.png': 'jQueryUIIconSet3',
        'images\/ui-bg_inset-soft_100_f4f0ec_1x100\.png': '',
        'images\/ui-bg_glass_25_cb842e_1x400\.png': '',
        'images\/ui-bg_glass_70_ede4d4_1x400\.png': '',
        'images\/ui-bg_glass_100_f5f0e5_1x400\.png': '',
        'images\/ui-bg_highlight-hard_100_f4f0ec_1x100\.png': ''
    }
    $.each(resourceNameMap, function (pattern, resourceName) {
        css = css.replace(new RegExp(pattern, 'g'), GM_getResourceURL(resourceName))
    })

    GM_addStyle(css)
    GM_addStyle(`.ui-dialog { z-index: 9999; }`)
    GM_addStyle(`.ui-checkboxradio-radio-label.ui-checkboxradio-checked .ui-icon { box-sizing: content-box; ! important; }`);
    GM_addStyle(`.ui-dialog-content { margin-top: 15px; }`);
    GM_addStyle(`.ui-checkboxradio-label { margin-bottom: 7px; }`);
}

function initCateDialog() {
    let inputsHtml = ''
    for (const text of mCateOptions) {
        inputsHtml += `<label><input type="radio" name="cate" value="${text}"> ${text}</input></label>`
    }
    $('body').append(`<div id="${mDialogId}" style="display: none;" title="视频类型">${inputsHtml}</div>`)
    $(`#${mDialogId} input`).checkboxradio()

    const cate = getCate()
    $(`#${mDialogId} input`).each(function (i, elem) {
        if (elem.value === cate) {
            $(elem).attr('checked','checked').button('refresh')
        }
    })

    $('#' + mDialogId).dialog({
        autoOpen: false,
        buttons: {
            OK: function () {
                const cate = $(`#${mDialogId} input[name="cate"]:checked`).val()
                setCate(cate)
                modifyButton2(cate)
                $(this).dialog('close')
            }
        }
    })
}

// hook fetch 请求
// 实现动态视频数据的抓取
function initFetchHook() {
    const originFetch = fetch
    const targetUrls = [
        'https://t.tiktok.com/api/search/general/full',
        'https://t.tiktok.com/api/search/item/full',
        'https://t.tiktok.com/api/post/item_list',
        'https://t.tiktok.com/api/music/item_list',
        'https://t.tiktok.com/api/challenge/item_list',
        'https://us.tiktok.com/api/search/general/full',
        'https://us.tiktok.com/api/search/item/full',
        'https://us.tiktok.com/api/post/item_list',
        'https://us.tiktok.com/api/music/item_list',
        'https://us.tiktok.com/api/challenge/item_list',
    ]
    unsafeWindow.fetch = (...arg) => {
        const url = arg[0].url || arg[0] // 兼容 mac & windows
        const targetUrl = targetUrls.filter(v => url.startsWith(v))[0]
        if (!targetUrl) return originFetch(...arg)
        console.log(1100, url)

        let resLast
        return originFetch(...arg).then(res => {
            resLast = res.clone()
            return res.json()
        }).then(data => {
            console.log(1111, data)
            const itemList = data.itemList || data.item_list
            if (itemList) {
                itemList.map(item => mItems.set(item.id, item))
            }
            return resLast
        })
    }
}

// 正式开始
initFetchHook()
setInterval(() => {
    if (!parseLink()) return // 确保 当前链接 为视频详情页
    if (document.getElementById(mBtn1Id)) return // 确保 按钮只展示一次
    if (document.querySelectorAll('[data-e2e="browse-video"]').length === 0) return // 确保 详情页 单页类型

    if (!document.getElementById(mDialogId)) {
        initJqueryUI()
        initCateDialog()
    }
    if (getItem()) {
        initButton1()
        initButton2()
    }
}, 1000)





