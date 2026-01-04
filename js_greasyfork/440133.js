// ==UserScript==
// @name           [实验] 抖音解说视频导入助手
// @description    此插件用来收集抖音视频数据
// @author         BikeKoala
// @contributor    BikeKoala
// @version        0.1.3
// @license        MIT
// @connect        *
// @grant          GM_xmlhttpRequest
// @require        https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://www.douyin.com/video/*
// @icon           https://sf1-scmcdn-tos.pstatp.com/goofy/ies/douyin_web/public/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/440133/%5B%E5%AE%9E%E9%AA%8C%5D%20%E6%8A%96%E9%9F%B3%E8%A7%A3%E8%AF%B4%E8%A7%86%E9%A2%91%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440133/%5B%E5%AE%9E%E9%AA%8C%5D%20%E6%8A%96%E9%9F%B3%E8%A7%A3%E8%AF%B4%E8%A7%86%E9%A2%91%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 定义基础变量
const btn1Id = '_dcf_lab_dyfilm_task_btn'
const btn2Id = '_dcf_lab_dyfilm_tmpl_btn'
const storageTemplaeKey = '_dcf_lab_dyfilm_template'
const apiBase = 'http://10.10.0.10:3002/2202/dyfilm'

// 定义基础方法
function parseLink() {
    const matched = location.href.match(/https\:\/\/www\.douyin\.com\/video\/(\d{19,20})/)
    return matched[0]
}
function getTemplate() {
    return Number(localStorage.getItem(storageTemplaeKey) || 0)
}
function setTemplate(value) {
    if (value === null) return getTemplate()
    value = Number(value)
    value = isNaN(value) ? 0 : value
    localStorage.setItem(storageTemplaeKey, value)
    return value
}
function getWebdata() {
    return JSON.parse(decodeURIComponent(document.getElementById('RENDER_DATA').innerHTML))[38]
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
    const url = apiBase + path + (params ? '?' + $.param(params) : '')
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
    const template = getTemplate()
    return new Promise((resolve, reject) => {
        request('GET', '/task', { link, template })
            .then(v => resolve(v.status))
            .catch(e => reject(e))
    })
}
function createVideoTask() {
    const link = parseLink()
    const template = getTemplate()
    const webdata = getWebdata()
    if (!link.endsWith(webdata.awemeId)) {
        location.reload()
        return new Promise(() => {})
    }
    const html = JSON.stringify(webdata)

    return new Promise((resolve, reject) => {
        request('POST', '/task', null, { link, template, html })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}
function cancelVideoTask() {
    const link = parseLink()
    const template = getTemplate()
    return new Promise((resolve, reject) => {
        request('DELETE', '/task', { link, template })
            .then(v => resolve(v))
            .catch(e => reject(e))
    })
}
function showButton1() {
    const $container = $('.videoWrap').parent().parent().parent().parent()
    $container.parent().css('overflow', 'visible')
    $container.before(`
      <div id="${btn1Id}" style="display: hidden; position: relative; left: -30px; margin-top: 10px; width: 25px; height: 25px; cursor: pointer; color: white; font-weight: bold; text-align: center; line-height: 24px;"></div>
    `);
}
function modifyButton1(action) {
    const colours = { create: '#fe2c55', cancel: 'orange' }
    const signs = { create: '+', cancel: '-' }
    $('#' + btn1Id)
        .css('display', 'block')
        .css('background', colours[action])
        .data('action', action)
        .html(signs[action])
}
function showButton2() {
    const template = getTemplate()
    const $container = $('.videoWrap').parent().parent().parent().parent()
    $container.parent().css('overflow', 'visible')
    $container.before(`
      <div id="${btn2Id}" style="position: relative; left: -30px; top: 5px; width: 25px; height: 25px; background: #fe2c55; cursor: pointer; color: white; text-align: center; line-height: 25px;">${template}</div>
    `);
}
function modifyButton2(template) {
    $('#' + btn2Id).html(template)
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
    $(window).on('click', _checkAndModifyButton1)    // 点击事件（切换视频）
    _checkAndModifyButton1()

    // 监听按钮点击事件
    $('#' + btn1Id).click(function () {
        const action = $(this).data('action')
        if (action === 'create') {
            createVideoTask().then(v => {
                if (v) {
                    setTimeout(modifyButton1('cancel'), 1000)
                    showToast('提交成功，任务稍后开始')
                } else {
                    showToast('提交失败，任务已经创建')
                }
            })
        }
        if (action === 'cancel') {
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
    $('#' + btn2Id).click(function () {
        let value = getTemplate()
        value = prompt('模板 ID', value)
        value = setTemplate(value)
        modifyButton2(value)
    })
}

// 正式开始
$(document).ready(function () {
    initButton1() // 触发任务
    initButton2() // 设置模板
})