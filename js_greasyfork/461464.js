// ==UserScript==
// @name         B 站直播自动换牌子 (切窗口自动换)
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  B 站进入直播间时自动换上主播对应的牌子
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461464/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90%20%28%E5%88%87%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E6%8D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461464/B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90%20%28%E5%88%87%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E6%8D%A2%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';
	// 换牌子
	const wear = (medal_id, token) => {
		const xhr = new XMLHttpRequest()
		xhr.responseType = 'json'
		xhr.withCredentials=true
		xhr.open("POST","https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear")
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
		xhr.send(`medal_id=${medal_id}&csrf_token=${token}&csrf=${token}`)
	}

	// 获取Cookies
	const get_cookies = () => {
		let cookies = {}
		let cookies_array = document.cookie.split('; ')
		for (const prop of cookies_array) {
			let [k, v] = prop.split('=')
			cookies[k] = v
		}
		return cookies;
	}

	// 获取直播间详细信息
	const get_info = (liveroom_id) => {
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
	const get_medal_list = (uid) => {
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

	const cookies = get_cookies();
	const csrfToken = cookies['bili_jct'];
	const liveroomId = parseInt(window.location.pathname.split('/').pop());
    const userInfo = await get_info(liveroomId);
    const userId = userInfo.data.info.uid;
    const upId = userInfo.data.medal.up_medal.uid;

    // 获取直播间牌子
    const medalId = await get_medal_list(userId).then(res => {
		for (const prop of res.data.list) {
			if (upId == prop['medal_info']['target_id']) {
                return prop['medal_info']['medal_id']
            }
		}
	});

    console.info(`Lengyue Medal: user ${userId}, room ${liveroomId}, up ${upId}, medal ${medalId}`);

    const getInfoAndWear = async () => {
        const userInfo = await get_info(liveroomId);
        const weared = userInfo.data.medal.curr_weared.target_id;

        if (weared != upId) {
            wear(medalId, csrfToken);
            console.info(`Lengyue Medal: weared`);
        }
    }

    await getInfoAndWear();

    const getMedalStatus = async (loading, go_wear) => {
        const medalContent = document.querySelector("div.medal-section > span > div > div > span.fans-medal-content");
        const level = document.querySelector("div.medal-section > span > div > div.fans-medal-level");
        if (loading) medalContent.innerText = "Loading";

        const userInfo = await get_info(userId);
        const currentMedal = userInfo.data.medal.curr_weared;
        medalContent.innerText = currentMedal.medal_name;
        level.innerText = currentMedal.level;

        if (go_wear && currentMedal.target_id != upId) {
            wear(medalId, csrfToken);
            console.info(`Lengyue Medal: weared`);

            await getMedalStatus();
        }
    };

    window.addEventListener('focus', () => getMedalStatus(true, true));
    setInterval(() => getMedalStatus(false, false), 5*1000);
})();
