// ==UserScript==
// @name         [哔哩哔哩] BiliBili Live Auto Medal
// @description  哔哩哔哩-直播-自动更换粉丝勋章
// @namespace    https://danor.app/
// @version      0.1.0-20211121
// @author       Nuogz
// @license      LGPL-3.0-or-later
// @grant        none
// @include      *live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/435871/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%5D%20BiliBili%20Live%20Auto%20Medal.user.js
// @updateURL https://update.greasyfork.org/scripts/435871/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%5D%20BiliBili%20Live%20Auto%20Medal.meta.js
// ==/UserScript==

const getMedals = async (page = 1) => {
	const result = await (await fetch(`https://api.live.bilibili.com/xlive/app-ucenter/v1/user/GetMyMedals?page=${page}&page_size=10`, { credentials: 'include' })).json();

	return [
		result?.data?.items,
		result?.data?.page_info?.total_page,
	];
};

const getMedalsAll = async () => {
	try {
		const [medalsAll, total] = await getMedals();

		if(total === undefined) { return console.error('获取[粉丝勋章列表]失败'); }
		else if(total === 0) { return console.error('你似乎没有任何[粉丝勋章]'); }
		else if(total > 1) {
			let page = 1;

			while(++page <= total) {
				medalsAll.push(...(await getMedals(page))[0]);
			}
		}

		return medalsAll;
	}
	catch(error) {
		console.error(`获取[粉丝勋章列表]错误，${error?.message || error}`);
	}
};

(async () => {
	const idRoom = ~~location.pathname.match(/^\/(\d+)$/)?.[1];
	if(!idRoom) { return console.error('获取[房间ID]失败'); }


	const medalsAll = await getMedalsAll();


	const idMedal = medalsAll.find(medal => medal.roomid == idRoom)?.medal_id;
	if(!idMedal) { return console.error('未找到当前房间[粉丝勋章]'); }


	const csrf = document.cookie.split('; ').find(cookie => /^bili_jct=.*?$/.test(cookie))?.match(/^bili_jct=(.*?)$/)?.[1];
	if(!csrf) { return console.error('未找到[csrf]'); }


	const resultWear = await (await fetch('https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear', {
		method: 'post',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		},
		body: Object.entries({ csrf_token: csrf, csrf, medal_id: idMedal }).map(([k, v]) => `${k}=${v}`).join('&')
	})).json();


	if(resultWear?.code === 0) {
		console.log('自动更换[粉丝勋章]成功');

		const domMedal = document.querySelector('.medal-item-margin');

		if(domMedal) {
			domMedal.click();

			setTimeout(() => domMedal.click(), 100);
		}
	}
	else {
		console.error(`自动更换[粉丝勋章]失败，${resultWear?.message}，${resultWear?.code}`);
	}
})();