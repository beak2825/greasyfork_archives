// ==UserScript==
// @name           [实验] DCF 抖音文字封面导入助手
// @description    此插件用来收集抖音视频封面
// @author         BikeKoala
// @contributor    BikeKoala
// @connect        *
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include        https://www.douyin.com/video/*
// @include        http://media.gzdcf.cn:3002/*
// @version        0.1.4
// @icon           https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/432386/%5B%E5%AE%9E%E9%AA%8C%5D%20DCF%20%E6%8A%96%E9%9F%B3%E6%96%87%E5%AD%97%E5%B0%81%E9%9D%A2%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432386/%5B%E5%AE%9E%E9%AA%8C%5D%20DCF%20%E6%8A%96%E9%9F%B3%E6%96%87%E5%AD%97%E5%B0%81%E9%9D%A2%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义基础变量
const btnId = '_lab_douyin_task_create_btn'

// 定义基础方法
function parseLink() {
    const matched = location.href.match(/https\:\/\/www\.douyin\.com\/video\/(\d{19,20})/)
    return matched[0]
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
function request(method, path, params = {}, data = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url: 'http://10.10.0.10:3002/2109/makedy' + path + '?' + $.param(params),
            data,
            headers: {
                'Accept': 'application/json'
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
function getVideoTaskStatus(link) {
    return new Promise((resolve, reject) => {
        request('GET', '/task', { link })
            .then(v => resolve(v.status))
            .catch(e => reject(e))
    })
}
function createVideoTask(link) {
    return new Promise((resolve, reject) => {
        request('POST', '/task', { link })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}
function cancelVideoTask(link) {
    return new Promise((resolve, reject) => {
        request('DELETE', '/task', { link })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}
function initButton() {
    const $container = $('.videoWrap').parent().parent().parent().parent()
    $container.parent().css('overflow', 'visible')
    $container.before(`
      <div id="${btnId}" style="display: hidden; position: relative; left: -30px; width: 25px; height: 25px; cursor: pointer; color: white; font-weight: bold; text-align: center; line-height: 25px;"></div>
    `);
}
function updateButton(action) {
    const colours = { create: 'gray', cancel: 'orange' }
    const signs = { create: '+', cancel: '-' }
    $('#' + btnId)
        .css('display', 'block')
        .css('background', colours[action])
        .data('action', action)
        .html(signs[action])
}
function init() {
    getVideoTaskStatus(link)
        .then(v => updateButton(['stopped', 'canceled'].includes(v) ? 'create' : 'cancel'))
        .catch(() => updateButton('create'))
}

// 正式开始
let link = parseLink()
$(document).ready(function () {
    const _checkAndUpdateButton = () => {
        link = parseLink()
        getVideoTaskStatus(link)
            .then(v => updateButton(['stopped', 'canceled'].includes(v) ? 'create' : 'cancel'))
            .catch(() => updateButton('create'))
    }

    // 初始化按钮状态
    initButton()
    _checkAndUpdateButton()
    $(window).on('click', _checkAndUpdateButton) // 点击事件（切换视频）
    $(window).on('popstate', _checkAndUpdateButton) // 浏览器后退/前进

    // 监听按钮点击事件
    $('#' + btnId).click(function () {
        const action = $(this).data('action')
        if (action === 'create') {
            createVideoTask(link).then(v => {
                if (v) {
                    updateButton('cancel')
                    showToast('提交成功，任务稍后开始')
                } else {
                    showToast('提交失败，任务已经创建')
                }
            })
        }
        if (action === 'cancel') {
            cancelVideoTask(link).then(v => {
                if (v) {
                    updateButton('create')
                    showToast('取消成功，好险！')
                } else {
                    showToast('取消失败，任务已经完成或正在执行中')
                }
            })
        }
    })
})