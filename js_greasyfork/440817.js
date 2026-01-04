// ==UserScript==
// @name           ANT 抖音导入助手
// @description    此插件用来收集抖音视频数据
// @author         BikeKoala
// @contributor    BikeKoala
// @version        0.1.7
// @license        MIT
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_addStyle
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.js
// @require        https://cdn.staticfile.org/jqueryui/1.12.1/jquery-ui.min.js
// @resource       jQueryUICSS https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/jquery-ui.css
// @resource       jQueryUIIconSet1 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_f08000_256x240.png
// @resource       jQueryUIIconSet2 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_c47a23_256x240.png
// @resource       jQueryUIIconSet3 https://cdn.staticfile.org/jqueryui/1.12.1/themes/humanity/images/ui-icons_f35f07_256x240.png
// @include        https://www.douyin.com/video/*
// @icon           https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/440817/ANT%20%E6%8A%96%E9%9F%B3%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440817/ANT%20%E6%8A%96%E9%9F%B3%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义基础变量
// const mApiBase = 'http://10.10.0.11:3004/leaf'
const mApiBase = 'http://ant.ueelink.cn:4004/leaf'
const mBtn1Id = '_dcf_ant_task_btn'
const mBtn2Id = '_dcf_ant_tmpl_btn'
const mDialogId = '_dcf_ant_dialog'
const mStorageCateKey = '_dcf_ant_cate'
const mMaxDuration = 600
const mCateOptions = ['萌宠搞笑', '美女跳舞']
const mPlatform = 'douyin'

// 定义基础方法
function parseLink() {
    const matched = location.href.match(/https\:\/\/www\.douyin\.com\/video\/(\d{19,20})/)
    return matched[0]
}

function getCate() {
    return localStorage.getItem(mStorageCateKey) || mCateOptions[0]
}

function setCate(value) {
    localStorage.setItem(mStorageCateKey, value)
    return value
}

function getWebdata() {
    const data = JSON.parse(decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML))
    const id = Object.keys(data).filter(v => {
        const id = parseInt(v)
        if (!isNaN(id)) return id > 1
    })[0]
    return data[id]
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
    const webdata = getWebdata()
    if (!link.endsWith(webdata.awemeId)) {
        location.reload()
        return new Promise(() => {})
    }
    const html = JSON.stringify(webdata)

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
    const $container = $('.videoWrap').parent().parent().parent().parent()
    $container.parent().css('overflow', 'visible')
    $container.before(`
      <div id="${mBtn1Id}" style="display: hidden; position: relative; left: -30px; margin-top: 10px; width: 25px; height: 25px; cursor: pointer; color: white; font-weight: bold; text-align: center; line-height: 24px;"></div>
    `);
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
    const $container = $('.videoWrap').parent().parent().parent().parent()
    $container.parent().css('overflow', 'visible')
    $container.before(`
      <div id="${mBtn2Id}" style="position: relative; left: -30px; top: 5px; width: 25px; background: #C95819; cursor: pointer; color: white; text-align: center; line-height: 25px; word-break:break-all;">${cate}</div>
    `);
}

function modifyButton2(cate) {
    $('#' + mBtn2Id).html(cate)
}

function initButton1() {
    const _checkAndModifyButton1 = () => {
        getVideoTaskStatus()
            .then(v => modifyButton1(['stopped', 'canceled'].includes(v) ? 'create' : 'cancel'))
            .catch(() => modifyButton1('create'))
    }

    // 初始化按钮状态
    showButton1()
    $(window).on('popstate', _checkAndModifyButton1) // 浏览器后退/前进
    $('#root').on('click', _checkAndModifyButton1)   // 点击事件（切换视频）
    _checkAndModifyButton1()

    // 监听按钮点击事件
    $('#' + mBtn1Id).click(function () {
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
    $('#' + mBtn2Id).click(function () {
        const cate = getCate()
        $(`#${mDialogId}`).dialog('open')
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
    GM_addStyle(`.ui-checkboxradio-radio-label.ui-checkboxradio-checked .ui-icon { box-sizing: content-box; ! important; }`);
    GM_addStyle(`.ui-dialog-content { margin-top: 15px; }`);
    GM_addStyle(`.ui-checkboxradio-label { margin-bottom: 7px; }`);
}

function initCateDialog() {
    let inputsHtml = ''
    for (const text of mCateOptions) {
        inputsHtml += `<label><input type="radio" name="cate" value="${text}"> ${text}</input></label>`
    }
    $('body').append(`<div id="${mDialogId}" title="视频类型">${inputsHtml}</div>`)
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

// 正式开始
$(document).ready(function () {
    initJqueryUI()
    initCateDialog()
    initButton1()
    initButton2()
})