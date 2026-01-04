// ==UserScript==
// @name         [巨量百应]一键联系达人
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  一键联系达人
// @author       windeng
// @match        https://buyin.jinritemai.com/dashboard/servicehall/daren-square
// @match        https://buyin.jinritemai.com/mpa/chat*
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432196/%5B%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%5D%E4%B8%80%E9%94%AE%E8%81%94%E7%B3%BB%E8%BE%BE%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/432196/%5B%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%5D%E4%B8%80%E9%94%AE%E8%81%94%E7%B3%BB%E8%BE%BE%E4%BA%BA.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

async function Sleep(sleepSecs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, sleepSecs * 1000)
    })
}

function DoWithInterval(funcList, sleepSecs) {
    sleepSecs = sleepSecs || 1
    let funcIndex = 0
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (funcIndex >= funcList.length) {
                clearInterval(interval)
                resolve()
                return
            }
            funcList[funcIndex]()
            funcIndex++
        }, sleepSecs * 1000)
    })
}

function WaitUntil(conditionFunc, sleepSecs) {
    sleepSecs = sleepSecs || 1
    return new Promise((resolve, reject) => {
        if (conditionFunc()) resolve()
        let interval = setInterval(() => {
            if (conditionFunc()) {
                clearInterval(interval)
                resolve()
            }
        }, sleepSecs * 1000)
    })
}

// GM_xmlhttpRequest
function Request(url, opt={}) {
	Object.assign(opt, {
		url,
		timeout: 2000,
		responseType: 'json'
	})

	return new Promise((resolve, reject) => {
		/*
		for (let f of ['onerror', 'ontimeout'])
			opt[f] = reject
		*/

		opt.onerror = opt.ontimeout = reject
		opt.onload = resolve

        // console.log('Request', opt)

		GM_xmlhttpRequest(opt)
	}).then(res => {
        if (res.status === 200) return Promise.resolve(res.response)
        else return Promise.reject(res)
    }, err => {
        return Promise.reject(err)
    })
}

function Get(url, opt={}) {
    Object.assign(opt, {
        method: 'GET'
    })
    return Request(url, opt)
}

function Post(url, opt={}) {
    Object.assign(opt, {
        method: 'POST'
    })
    return Request(url, opt)
}

async function GetAccountImInfo(accountId) {
    /*
    {
        "code": 0,
        "st": 0,
        "msg": "",
        "data": {
            "im_id": "***",
            "im_type": 0,
            "biz_account_id": "",
            "avatar": "https://p3.douyinpic.com/img/***",
            "nickname": "***",
            "profile_url": "https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid=***"
        },
        "log_id": "202109101640530101980662104A0899FC"
    }
    */
    return Get(`https://buyin.jinritemai.com/connection/pc/im/account?account_id=${accountId}&account_type=1&account_app_id=1128`)
}

async function AddButtonToDarenCard() {
    await WaitUntil(() => {
        return !!document.querySelector('.daren-square-content-cards')
    })

    let cardList = document.querySelectorAll('.daren-square-content-cards > div.daren-card')
    for (let card of cardList) {
        if (card.querySelector('button[data-item-uid]')) continue

        let uid = card.getAttribute('data-item-uid')
        let btn = document.createElement('button')
        btn.innerText = '联系'
        btn.setAttribute('data-item-uid', uid)
        btn.onclick = async (e) => {
            e.stopPropagation()
            const uid = e.target.getAttribute('data-item-uid')
            let resp = await GetAccountImInfo(uid)
            console.log(resp)
            const url = `https://buyin.jinritemai.com/mpa/chat?friendId=${resp.data.im_id}`
            window.open(url, '_blank')
        }
        card.appendChild(btn)
    }
}

async function darenSquareRun() {
    AddButtonToDarenCard()
}

async function darenSquareMain() {
    if (window.location.href.search('dashboard/servicehall/daren-square') === -1) return

    await WaitUntil(() => {
        return !!document.querySelector('.daren-square-content-cards')
    })

    darenSquareRun()

    let elem = document.querySelector('.daren-square-content-cards')

    let observer = new MutationObserver(function(mutations) {
        // TODO do sth.
        darenSquareRun()
    })

    observer.observe(elem, {
        childList: true,
        subtree: true
    })
}

async function chatMain() {
    if (window.location.href.search('mpa/chat') === -1) return

    // 这样写不进去，先不管
    return

    await WaitUntil(() => {
        return !!document.querySelector('.im-textarea')
    })

    let t = document.querySelector('.im-textarea')
    t.innerText = '您好，我们这里是源头工厂，目前有大量高佣好物货源，可免费提供样品，您那边最近有可以合作的直播排期吗？ '
}

(function() {
    'use strict';

    // Your code here...
    darenSquareMain()
    chatMain()
})();