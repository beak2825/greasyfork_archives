// ==UserScript==
// @name         B站直播间自动换牌子
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  B站直播间助手
// @author       残云cyun
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438787/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/438787/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = {
        default: false,     // 是否携带默认牌子
        medal_id: 185810,   // 默认带的牌子id
    }

	// 换牌子
	let wear = (medal_id, token) => {
		const xhr = new XMLHttpRequest()
		xhr.responseType = 'json'
		xhr.withCredentials=true
		xhr.open("POST","https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear")
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xhr.send(`medal_id=${medal_id}&csrf_token=${token}&csrf=${token}`)
	}

	// 获取Cookies
	let get_cookies = () => {
		let cookies = {}
		let cookies_array = document.cookie.split('; ')
		for (const prop of cookies_array) {
			let [k, v] = prop.split('=')
			cookies[k] = v
		}
		return cookies;
	}

	// 获取直播间详细信息
	let get_info = (liveroom_id) => {
		return new Promise((res, rej) => {
			let xhr = new XMLHttpRequest()
			xhr.responseType = 'json'
			xhr.withCredentials = true
			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4) {
					if(xhr.status === 200) {
						res(xhr.response)
					}else {
						rej('error')
					}
				}
			}
			xhr.open("GET", `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${liveroom_id}&from=0`)
			xhr.send()
		})
	}

	// 获取牌子列表
	let get_medal_list = (uid) => {
		return new Promise((res, rej) => {
			const xhr = new XMLHttpRequest()
			xhr.responseType = 'json'
			xhr.withCredentials = true
			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4) {
					if(xhr.status === 200) {
						res(xhr.response)
					}else {
						rej('error')
					}
				}
			}
			xhr.open("GET", `https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id=${uid}`)
			xhr.send()
		})
	}

	// 获取直播间标题
	let get_liveroom_title = (up_uid) => {
		return new Promise((res, rej) => {
			const xhr = new XMLHttpRequest()
			xhr.responseType = 'json'
			xhr.withCredentials = true
			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4) {
					if(xhr.status === 200) {
						res(xhr.response)
					}else {
						rej('error')
					}
				}
			}
			xhr.open("GET", `https://api.bilibili.com/x/space/wbi/acc/info?mid=${up_uid}`)
			xhr.send()
		})
	}

	let cookies = get_cookies()
	let csrf_token = cookies['bili_jct']
	let liveroom_id = window.location.pathname.split('/').pop()

	let info = null
	get_info(liveroom_id).then(res => {
		info = res
		return get_medal_list(res['data']['info']['uid'])
	}).then(res => {
		let list = res['data']['list']
		let up_uid = info['data']['medal']['up_medal']['uid']

		let weared = false
		for (const prop of list) {
			let medal_id = prop['medal_info']['medal_id']
			let target_id = prop['medal_info']['target_id']
			if(target_id === up_uid) {
				wear(medal_id, csrf_token)
				weared = true
                break
            }
        }

        // 没有该主播的牌子
        if(!weared && settings.default) {
            wear(settings.medal_id, csrf_token)
        }

        // 实时更新直播间标题
        setInterval(() => {
            get_liveroom_title(up_uid)
                .then(res => {
                let title = res["data"]["live_room"]["title"]

                document.title = title
                document.querySelector(".live-title div div").innerText = title
            })
        }, 10000)
    })
})();