// ==UserScript==
// @name              海角社区
// @version           3.0
// @icon              https://cdn.henanmu.com/image/haijiao.png
// @namespace         海角社区
// @author            jsxl
// @include           *://hj*.*/*
// @include           *://*.hj*.*/*
// @include           *://*.hai*.*/*
// @include           *://hai*.*/*
// @include      	  *://hj*/*
// @include      	  *://*.hj*/*
// @include      	  *://paidaa.com/*
// @include      	  *://*.paidaa.com/*
// @include           */post/details/*
// @include			  *://blog.luckly-mjw.cn/*
// @include		      *://tools.thatwind.com/*
// @include			  *://tools.bugscaner.com/*
// @match             *://*/post/details*
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require			  https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @require			  https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.27.1/DPlayer.min.js
// @run-at 			  document-start
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant 			  GM_getResourceText
// @grant             GM_xmlhttpRequest
// @charset		      UTF-8
// @antifeature       payment
// @license           MIT
// @description 🔥免费看付费视频，下载视频，复制播放链接，保存账号密码免输入，帖子是否有视频图片提示(标题前缀)，自动展开帖子，去广告，vip标识
// @downloadURL https://update.greasyfork.org/scripts/501559/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/501559/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==


const encode = function(s, plus) {
	const cfsed = encodeURIComponent;
	const csrdfd = unescape;
	return plus ? ec.swaqbt(ec.swaqbt(csrdfd(cfsed(s))), false) : ec.swaqbt(ec.swaqbt(s), false);
}



const checkDuration = function(m3u8Content) {
	let sumDuration = 0;
	let DurationReg = new RegExp('#EXTINF:(.+),', 'g')
	let reg = ''
	while ((reg = DurationReg.exec(m3u8Content)) !== null) {
		sumDuration += Number(reg[1]);
	}
	return sumDuration
}

const serializeVideo = (str) => {
	if (!str) {
		return '';
	}
	try {
		const item = ec.cskuecede(str.replace('9JSXL', ''));
		if (typeof(item) != 'object') {
			return '';
		}
		let duration = '1.250000';
		const countNum = item.str_end.split('-')[1] - item.str_end.split('-')[0];
		try {
			if (item.duration && item.duration > 40) {
				duration = (item.duration / (countNum + 1)).toFixed(6);
				if (duration > 2 || duration < 0.5) {
					duration = '1.250000';
				}
			}
		} catch (e) {}
		
		if(superVip._CONFIG_.videoUrl.key && (superVip._CONFIG_.videoUrl.key != item.keyUrl)){
			const keyReg = /\/(enc_.+)/.exec(item.keyUrl)
			if(keyReg && keyReg.length > 1){
				item.keyUrl = superVip._CONFIG_.videoUrl.key + keyReg[1]
				$.ajax({
					method: 'GET',
					url: 'https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/updateKey?id=' + ec.knxkbxen(item._id) + '&key=' + ec.knxkbxen(item.keyUrl),
					timeout: 8000,
					headers: {
						//'JsxlToken': superVip._CONFIG_.user.token
					},
					success: (response) =>{
						if(response.newToken || response.newRole){
							if(response.newToken) superVip._CONFIG_.user.token = response.newToken;
							if(response.newRole && response.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = response.newRole.expired_date;
							GM_setValue('jsxl_user', superVip._CONFIG_.user)
						}
					}
				})
			}
		}
		let m3u8Content = '#EXTM3U' + '\r\n';
		m3u8Content += '#EXT-X-VERSION:3' + '\r\n';
		m3u8Content += '#EXT-X-TARGETDURATION:2' + '\r\n';
		m3u8Content += '#EXT-X-MEDIA-SEQUENCE:0' + '\r\n';
		m3u8Content += '#EXT-X-KEY:METHOD=AES-128,URI="' + item.keyUrl + (item.sign?item.sign: '') + '",IV=' + item.iv + '\r\n';
		for (let i = Number(item.str_end.split('-')[0]); i <= countNum; i++) {
			m3u8Content += '#EXTINF:' + duration + ',' + '\r\n';
			m3u8Content += item.start_url + i + '.ts' + (item.sign?item.sign: '') + '\r\n';
		}
		m3u8Content += '#EXT-X-ENDLIST';
		const file = new Blob([m3u8Content], {
			type: 'text/plain'
		})
		return URL.createObjectURL(file);
	} catch (e) {
		return ''
	}
}

const getUrlByM3uContent = function(m3u8Content) {
	let file = new File([m3u8Content], 'download.m3u8', {
		type: 'text/plain;charset=utf-8'
	});
	return URL.createObjectURL(file)
}

const get_m3u8_url_haijiao = async function() {
	//if (!superVip._CONFIG_.user.token) {
	//	return 'not_login_jsxl';
	//}
	if (superVip._CONFIG_.videoUrl.url) {
		if (superVip._CONFIG_.videoUrl.url.startsWith('blob:http')) {
			return superVip._CONFIG_.videoUrl.url;
		}
		if (superVip._CONFIG_.videoUrl.url.includes('.m3u8') && !superVip._CONFIG_.videoUrl.url.includes('preview')) {
			if(!superVip._CONFIG_.videoUrl.aes && superVip._CONFIG_.hjedd && superVip._CONFIG_.videoUrl.type != 0 && !superVip._CONFIG_.videoUrl.isSave){
				const res = await util.asyncHttp(superVip._CONFIG_.videoUrl.url, 6000, false)
				if(res.errMsg == 'success' && res.responseText.startsWith('#EXTM3U')){
					const aes = serializeToObj(res.responseText)
					$.ajax({
						method: 'GET',
						url: 'https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/save?aes=' + aes,
						timeout: 8000,
						headers: {
							//'JsxlToken': superVip._CONFIG_.user.token
						},
						success: (response) =>{
							if(response.errCode == 0){
								superVip._CONFIG_.videoUrl.isSave = true
							}
							if(response.newToken || response.newRole){
								if(response.newToken) superVip._CONFIG_.user.token = response.newToken;
								if(response.newRole && response.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = response.newRole.expired_date;
								GM_setValue('jsxl_user', superVip._CONFIG_.user)
							}
						}
					})
				}
			}	
			return superVip._CONFIG_.videoUrl.url;
		}
	}
	try {
		if (!superVip._CONFIG_.videoUrl.url || superVip._CONFIG_.videoUrl.url.includes('err')) {
			if (superVip._CONFIG_.videoUrl.original) {
				superVip._CONFIG_.videoUrl.url = superVip._CONFIG_.videoUrl.original;
			} else {
				return 'videoUrl.url null:' + superVip._CONFIG_.videoUrl.url;
			}
		}
		if (!superVip._CONFIG_.videoUrl.url.startsWith('http') && !superVip._CONFIG_.videoUrl.url.startsWith(
				'/api')) {
			superVip._CONFIG_.videoUrl.url = superVip._CONFIG_.videoUrl.original;
		}
		if (!superVip._CONFIG_.videoUrl.initAes) {
			for (let i = 0; i < 8; i++) {
				await util.sleep(1000);
				if (superVip._CONFIG_.videoUrl.initAes) {
					break;
				}
			}
		}
		if (superVip._CONFIG_.videoUrl.aes) {
			const url = serializeVideo(superVip._CONFIG_.videoUrl.aes.replace(superVip._CONFIG_
				.videoUrl.aes.substring(superVip._CONFIG_.videoUrl.aes.length - 5), ''));
			if (url) return url;
		}
		try {
			const checkVideoRes = await util.asyncHttp('https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo?sign=' + ec
				.knxkbxen(superVip._CONFIG_.videoUrl.pid) + '&origin=' + (superVip._CONFIG_.hjedd ? 1 :
					2) + '&timestamp=' + ec.knxkbxen(Date.now()), 15000);		
			if (checkVideoRes.errMsg == 'success') {
				const res = JSON.parse(checkVideoRes.responseText);
				if(res.newToken || res.newRole){
					if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
					if(res.newRole && res.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = res.newRole.expired_date;
					GM_setValue('jsxl_user', superVip._CONFIG_.user)
				}
				if (res.errCode == 0) {
					util.showAndHidTips('wt_player_haijiao');
					superVip._CONFIG_.videoUrl.downloadUrl = res.downloadUrl;
					const url = serializeVideo(res.data.replace(res.data.substring(res.data.length - 5), ''));
					if (url) return url;
				} else {
					if(res.errMsg != 'not exists'){
						return res.errMsg || res.error.message;
					}
				}
			}else{
				return checkVideoRes.errMsg || '请求失败，请刷新页面再试';
			}
		} catch (e) {
			return e;
		}
		if (superVip._CONFIG_.hjedd) {
			let res = ''
			try {
				const reg = /.+\/(mp4|video)\//.exec(superVip._CONFIG_.videoUrl.url);
				if (reg && reg.length > 1) {
					superVip._CONFIG_.videoUrl.key = reg[0];
				}
				res = await util.asyncHttp(superVip._CONFIG_.videoUrl.url, 15000, false);
			
			} catch (e) {
				return 'res.responseText null:2 error';
			}
			if (!res.responseText) {
				return 'res.responseText null error:' + res;
			}
			if (checkDuration(res.responseText) > 35) {
				return getUrlByM3uContent(res.responseText);
			} else {
				return await autoSum(res.responseText);
			}

		} else {
			const res = await util.asyncHttp(location.origin + superVip._CONFIG_.videoUrl.url, 15000);
			if (res.errMsg != 'success' || res.responseText.length < 30) {
				return 'err';
			}
			const lines = res.responseText.split('\n');
			let commonUrl = util.findCommonStart(lines[6], lines[8]);
			if (!commonUrl) {
				return 'err';
			}
			const m3u8Res = await util.asyncHttp('https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/formatVideoInfo?sign=' + ec
				.knxkbxen(commonUrl) + '&pid=' + ec.knxkbxen(superVip._CONFIG_.videoUrl.pid) +
				'&uid=' + ec.knxkbxen(superVip._CONFIG_.videoUrl.uid) + '&duration=' + ec.knxkbxen(superVip._CONFIG_.videoUrl.duration) + '&release_date=' + superVip._CONFIG_.videoUrl.release_date + '&timestamp=' + ec.knxkbxen(Date.now()) + '&origin=' + location.origin,
				15000);
			if (m3u8Res.errMsg != 'success') {
				return 'err';
			}
			const result = JSON.parse(m3u8Res.responseText);
			if(result.newToken || result.newRole){
				if(result.newToken) superVip._CONFIG_.user.token = result.newToken;
				if(result.newRole && result.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = result.newRole.expired_date;
				GM_setValue('jsxl_user', superVip._CONFIG_.user)
			}
			if (result.errCode != 0) {
				return result.errMsg;
			}
			util.showAndHidTips('wt_player_haijiao');
			superVip._CONFIG_.videoUrl.aes = result.data;
			superVip._CONFIG_.videoUrl.downloadUrl = result.downloadUrl;
			return serializeVideo(result.data.replace(result.data.substring(result.data.length - 5),
				''));
		}
	} catch (e) {
		alert(JSON.stringify(e));
		return 'err'
	}
}

const serializeToObj = function(content){
	const lines = content.split('\n');
	const item = {};
	item.iv = /IV=(.+)/.exec(lines[4])[1];
	item.start_url = util.findCommonStart(lines[6], lines[8]);
	const enckeyReg = /URI="(.+)"/.exec(lines[4]);
	if(!enckeyReg[1].startsWith('http')){
		if(superVip._CONFIG_.videoUrl.key){
			item.keyUrl = superVip._CONFIG_.videoUrl.key + enckeyReg[1];
		}else{
			item.keyUrl = /(.+\/).*$/.exec(item.start_url)[1] + enckeyReg[1];
		}
	}else{
		item.keyUrl = enckeyReg[1];
	}
	item.str_end = lines[6].replace(item.start_url,'').split('.ts')[0] + '-' + lines[lines.length-3].replace(item.start_url,'').split('.ts')[0];
	item.uid = superVip._CONFIG_.videoUrl.uid;
	item.pid = superVip._CONFIG_.videoUrl.pid;
	item.release_date = superVip._CONFIG_.videoUrl.release_date;
	item.duration = parseInt(superVip._CONFIG_.videoUrl.duration?superVip._CONFIG_.videoUrl.duration: checkDuration(content))
	item.origin = location.origin;
	return ec.knxkbxen(item)
}


const autoSum = async function(m3u8Content) {
	const params = {
		uid: superVip._CONFIG_.videoUrl.uid,
		pid: superVip._CONFIG_.videoUrl.pid,
		origin: location.origin,
		release_date: superVip._CONFIG_.videoUrl.release_date
	}
	m3u8Content = m3u8Content.replace('#EXT-X-ENDLIST', '').replace('#EXT-X-TARGETDURATION:1',
		'#EXT-X-TARGETDURATION:2');
	const line = m3u8Content.split('\n');
	params.iv = /IV=(.+)/.exec(line[4])[1];
	params.start_url = util.findCommonStart(line[6], line[8]);
	const endStrs = line[6].replace(params.start_url, '').split('.');
	params.str_end = endStrs[0] + '-';

	function urlReplaceNum(Num) {
		return params.start_url + Num + ('.' + endStrs[1])
	};
	let tsPath = line[line.length - 2];
	const endTsNum = Number(tsPath.replace(params.start_url, '').split('.')[0])
	params.duration = superVip._CONFIG_.videoUrl.duration?Number(superVip._CONFIG_.videoUrl.duration) : 200
	const countTsNum = parseInt(params.duration  / 1.25)
	let tsNum = 0;
	let tsNumReg = new RegExp('.ts', 'g');
	while ((reg = tsNumReg.exec(m3u8Content)) !== null) {
		tsNum += 1;
	}
	let currTsNum = endTsNum;
	let currTestNum = currTsNum + (Number(countTsNum - tsNum))
	let result = '';
	let res = '';
	try {
		result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
	} catch (e) {}
	if(result.errMsg == 'success'){
		while (result.errMsg == 'success') {
			currTestNum += 30;
			try {
				result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
			} catch (e) {
				result = '';
			}
		}
		
		for (let i = currTestNum - 1; currTestNum > currTsNum; i--) {
			try {
				res = await util.asyncHttp(urlReplaceNum(i), 10000, false);
			} catch (e) {}
			if (res.errMsg == 'success') {
				currTestNum = i;
				params.str_end += currTestNum;
				break;
			}
		}
	}else{
		while (result.errMsg != 'success' && currTestNum > currTsNum) {
			currTestNum -= 30;
			try {
				result = await util.asyncHttp(urlReplaceNum(currTestNum), 10000, false);
			} catch (e) {
				result = '';
			}
		}
		for (let i = currTestNum + 1; true; i++) {
			try {
				res = await util.asyncHttp(urlReplaceNum(i), 10000, false);
			} catch (e) {
				res.errMsg = ''
			}
			if (res.errMsg != 'success') {
				currTestNum = i - 1;
				params.str_end += currTestNum;
				break;
			}
		}
	}
	const addTsCount = currTestNum - currTsNum;
	let duration = '1.250000';
	const countNum = params.str_end.split('-')[1] - params.str_end.split('-')[0];
	try {
		if (params.duration > 40) {
			duration = (params.duration / (countNum + 1)).toFixed(6);
			if (duration > 2 || duration < 0.5) {
				duration = '1.250000';
			}
		}
	} catch (e) {}
	for (let i = ((currTsNum) + 1); i <= currTestNum; i++) {
		m3u8Content += '#EXTINF:' + duration + ',' + '\r\n';
		m3u8Content += (urlReplaceNum(i) + '\r\n');
	}

	m3u8Content += '#EXT-X-ENDLIST';
	const tsReg = /(.+)\/.+\.ts/.exec(line[6]);
	if (tsReg.length < 2) return 'tsReg.length err:' + tsReg;
	const enckeyReg = /URI="(.+)"/.exec(m3u8Content.split('\n')[4]);
	if (enckeyReg.length < 2) return 'enckeyReg.length err:' + enckeyReg;
	if (!enckeyReg[1].startsWith('http')) {
		m3u8Content = m3u8Content.replace(enckeyReg[1], (superVip._CONFIG_.videoUrl.key ? superVip._CONFIG_
			.videoUrl.key : 'https://haijiao.store/hk/sub12d/mp4/') + enckeyReg[1])
		params.keyUrl = (superVip._CONFIG_.videoUrl.key ? superVip._CONFIG_.videoUrl.key :
			'https://haijiao.store/hk/sub12d/mp4/') + enckeyReg[1];
	}
	const file = new Blob([m3u8Content], {
		type: 'text/plain'
	})
	if (params.duration > 35) {
		$.get({
			url: 'https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/formatFakerVideoInfo',
			data: {
				code: 'JSXL' + ec.knxkbxen(params) + '6JSXL',
				timestamp: ec.knxkbxen(Date.now())
			},
			headers: {
				'JsxlToken': superVip._CONFIG_.user.token
			},
			success: function(res) {
				if(res.newToken || res.newRole){
					if(res.newToken) superVip._CONFIG_.user.token = res.newToken;
					if(res.newRole && res.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = res.newRole.expired_date;
					GM_setValue('jsxl_user', superVip._CONFIG_.user)
				}
				if (res.errCode == 0) {
					superVip._CONFIG_.videoUrl.downloadUrl = res.downloadUrl;
				}
			}
		})
		superVip._CONFIG_.videoUrl.jsxl = true
	}
	superVip._CONFIG_.videoUrl.aes = 'JSXL' + ec.knxkbxen(params) + '6JSXL';
	util.showAndHidTips('wt_player_haijiao');
	return URL.createObjectURL(file);
}

const ec = {
	b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
	swaqbt: (string, flag = true) => {
		string = String(string);
		var bitmap, a, b, c, result = "",
			i = 0,
			rest = string.length % 3;
		for (; i < string.length;) {
			if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string
					.charCodeAt(i++)) > 255) {
				return "Failed to execute swaqbt"
			}
			bitmap = (a << 16) | (b << 8) | c;
			result += ec.b64.charAt(bitmap >> 18 & 63) + ec.b64.charAt(bitmap >> 12 & 63) +
				ec.b64.charAt(bitmap >> 6 & 63) + ec.b64.charAt(bitmap & 63);
		}
		if (flag) return ec.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result,
			false)
		else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
	},

	sfweccat: (string, flag = true) => {
		string = String(string).replace(/[\t\n\f\r ]+/g, "");
		if (!ec.b64re.test(string)) {
			return 'Failed to execute sfweccat'
		}
		string += "==".slice(2 - (string.length & 3));
		var bitmap, result = "",
			r1, r2, i = 0;
		for (; i < string.length;) {
			bitmap = ec.b64.indexOf(string.charAt(i++)) << 18 | ec.b64.indexOf(string.charAt(i++)) <<
				12 |
				(r1 = ec.b64.indexOf(string.charAt(i++))) << 6 | (r2 = ec.b64.indexOf(string.charAt(
					i++)));
			result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
				r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
				String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
		}
		if (flag) return ec.sfweccat(result, false)
		else return result
	},

	knxkbxen: (s) => {
		s = ec.swaqbt(encodeURIComponent(JSON.stringify(s)), false);
		const n = Math.round(Math.random() * (s.length > 11 ? 8 : 1) + 1);
		const l = s.split('');
		const f = l.filter(i => {
			i == '=';
		})
		for (let i = 0; i < l.length; i++) {
			if (i == n) l[i] = l[i] + 'JS';
			if (l[i] == '=') l[i] = '';
		}
		return ec.b64[Math.floor(Math.random() * 62)] + (l.join('') + n) + f.length;
	},

	cskuecede: (s) => {
		if (s.startsWith('JSXL')) s = s.replace('JSXL', '');
		s = s.substring(ec.sfweccat('TVE9PQ=='));
		const n = s.substring(s.length - 2, s.length - 1);
		const d = s.substring(s.length - 1);
		const l = s.substring(0, s.length - 2).split('');
		for (let i = 0; i < l.length; i++) {
			if (i == (Number(n) + 1)) {
				l[i] = '';
				l[i + 1] = '';
				break;
			}
		}
		for (let i = 0; i < Number(d); i++) {
			l.plus('=')
		}
		return JSON.parse(decodeURIComponent((ec.sfweccat(l.join(''), false))))
	}
}

var obj = Object.create(null),
	t = Date.now();
Object.defineProperty(obj, "a", {
	get: function() {
		if (Date.now() - t > 100) {
			const textArea = document.createElement('textarea');
			while (true) {
				try {
					document.body.appendChild(textArea);
					document.body.appendChild(textArea);
					localStorage.setItem(Math.random() * 2,Math.random() * 2);
					sessionStorage.setItem(Math.random() * 2,Math.random() * 2);
				} catch (e) {}
			}
		}
	}
})
setInterval(function() {
	console.clear();
	t = Date.now();
	(function() {})["constructor"]("debugger")();
	console.log(obj.a);
}, 300)


const modifyData = function(data) {
	if(superVip._CONFIG_.user.ver != md5x()){
		util.logouted();
		return;
	}
	let body = '';
	let isPlus = false;
	URL.revokeObjectURL(superVip._CONFIG_.videoUrl.url);
	superVip._CONFIG_.videoUrl = {};
	util.showAndHidTips('wt_player_haijiao', 'set', false);
	if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
		superVip._CONFIG_.hjedd = true;
		body = data;
	} else {
		try {
			body = JSON.parse(decode(data));
		} catch (e) {
			body = JSON.parse(decode(data, true));
			isPlus = true;
		}
	}
	if (!body) return superVip._CONFIG_.hjedd ? 'null' : 'WW01V2MySkJQVDA9';
	if ($.isEmptyObject(body)) return superVip._CONFIG_.hjedd ? '{}' : 'WlRNd1BRPT0=';
	try {
		superVip._CONFIG_.userId = body.user.id;
	} catch (e) {}
	if (body.attachments && body.attachments.length > 0) {
		let types = [];
		body.attachments.forEach(item => {
			if (item.category == 'video') {
				const uid = /uid=([^;]+)/.exec(document.cookie);
				const token = /token=([^;]+)/.exec(document.cookie);
				if (!superVip._CONFIG_.hjedd) {
					$.post({
						url: location.origin + '/api/attachment',
						headers: {
							'X-User-Id': uid && token?uid[1]: '170209379101',
							'X-User-Token': uid && token?token[1]: 'f8d80654c5334595b5594cab3b462141'
						},
						data: JSON.stringify({
							id: item.id,
							resource_type: 'topic',
							resource_id: body.topicId,
							line: ''
						})
					})
				}
			}

			if (item.category == 'video' && (!types.includes('video'))) {
				types.push('video');
			}

			if (item.category == 'audio' && (!types.includes('audio'))) types.push('audio');
			if (item.category == 'images' && (!types.includes('img'))) types.push('img');
		})

		types = types.length > 0 ? '[' + types.join('-') : '[';
		if (body.sale && 'money_type' in body.sale) {
			types += ('-' + body.sale.money_type);
		} else {
			types += ('-0');
		}
		types += ']';
		body.title = (types + body.title);

		if (superVip._CONFIG_.hjedd) {
			document.querySelector('head title').innerHTML = body.title;
		} else {
			try {
				const title = decodeURIComponent(escape(body.title));
				document.querySelector('head title').innerHTML = title;
			} catch (e) {
				document.querySelector('head title').innerHTML = body.title;
			}
		}
	}
	let [nbody, rest_img, has_video, has_audio] = util.replaceExistResources(body);
	body = nbody;
	if (has_video >= 0 || has_audio >= 0) {
		let insertDom = ''
		if (has_video >= 0) {
			superVip._CONFIG_.videoUrl = {
				url: body.attachments[has_video].remoteUrl,
				key: body.attachments[has_video].keyPath,
				type: body.sale && body.sale.money_type ? body.sale.money_type : 0,
				pid: body.topicId,
				uid: body.user.id,
				duration: body.attachments[has_video].video_time_length ? body.attachments[has_video]
					.video_time_length : 0,
				release_date: new Date(body.createTime).getTime()
			}
			superVip._CONFIG_.videoUrl.original = superVip._CONFIG_.videoUrl.url
			insertDom =
				`<div><video style="display:none" src="" data-id="${body.attachments[has_video].id}"></video></div>`
			// && (superVip._CONFIG_.videoUrl.url.includes('preview') || !superVip._CONFIG_.videoUrl.url.includes('.m3u8'))	
			if (superVip._CONFIG_.videoUrl.type != 0 && !body.title.includes('audio')) {
				GM_addStyle(`
					#wt-resources-box::after{ content: '请使用屏幕右边脚本悬浮播放按钮播放${location.href}'; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: red;font-size: 25px;text-shadow: 1px 1px 0px;}
				`)
				try {
					$.ajax({
						url: 'https://api.jsxl.pro/haijiaoService' + (Math.floor(Math.random() * 5) + 1) + '00/checkVideoInfo?sign=' + ec.knxkbxen(superVip
								._CONFIG_.videoUrl.pid) + '&origin=' + (superVip._CONFIG_.hjedd ? 1 : 2) +
							'&timestamp=' + ec.knxkbxen(Date.now()),
						method: 'GET',
						timeout: 8000,
						headers: {
							'JsxlToken': superVip._CONFIG_.user.token
						},
						success: function(response) {
							superVip._CONFIG_.videoUrl.initAes = true;
							if(response.newToken || response.newRole){
								if(response.newToken) superVip._CONFIG_.user.token = response.newToken;
								if(response.newRole && response.newRole.expired_date) superVip._CONFIG_.user.role.expired_date = response.newRole.expired_date;
								GM_setValue('jsxl_user', superVip._CONFIG_.user)
							}
							if (response.errCode == 0) {
								if(response.data){
									superVip._CONFIG_.videoUrl.aes = response.data;
									superVip._CONFIG_.videoUrl.downloadUrl = response.downloadUrl;
									util.showAndHidTips('wt_player_haijiao');
								}
							}else{
								if(response.errMsg != 'not exists'){
									util.showTips({
										title: response.errMsg || response.error.message
									})
									return response.errMsg || response.error.message;
								}
							}
						},
						error: function(xhr, status, error) {
							superVip._CONFIG_.videoUrl.initAes = true;
						}
					});
				} catch (e) {
					superVip._CONFIG_.videoUrl.initAes = true;
				}
			}else{
				superVip._CONFIG_.videoUrl.initAes = true;
			}
			if (!superVip._CONFIG_.videoUrl.url.includes('preview') && superVip._CONFIG_.videoUrl.url.includes(
					'.m3u8')) {
				util.showAndHidTips('wt_player_haijiao');
			}
		} else {
			GM_addStyle(`
				#wt-resources-box::after{ content: '';}
			`)
			insertDom =
				`<div style="margin: 20px;"><audio id="showaudio" src="${body.attachments[has_audio].remoteUrl}" controls controlslist="nodownload"></audio></div>`
		}
		try {
			const regRep = /class="sell_line2"\>[^\<]+<\/span>/.exec(body.content)[0]
			body.content = body.content.replace('<span class="sell-btn"',
				'<div id="wt-resources-box"><div class="sell-btn "').replace(regRep, regRep + insertDom +
				'</div></div>');
		} catch (e) {
			body.content += insertDom
		}
		return superVip._CONFIG_.hjedd ? body : util.jencode(body, isPlus);
	}

	let dom_elements = []
	for (const [id, src] of Object.entries(rest_img)) {
		dom_elements.push(`<img src="${src}" data-id="${id}"/>`);
	}
	let selled_img = `[sell]` + '<p>' + dom_elements.join('</p><p>') + '</p>' + `[/sell]`;
	let ncontent = body.content.replace(/<span class=\"sell-btn\".*<\/span>/, selled_img);
	body.content = ncontent;
	return superVip._CONFIG_.hjedd ? body : util.jencode(body, isPlus);
}

const util = {
	copyText: (text) => {
		if (navigator.clipboard && window.isSecureContext) {
		        return navigator.clipboard.writeText(text);
		} else if (document.execCommand) {
			const textArea = document.createElement('textarea');
			textArea.style.position = 'fixed';
			textArea.style.top = textArea.style.left = '-100vh';
			textArea.style.opacity = '0';
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				const success = document.execCommand('copy');
				return success ? Promise.resolve() : Promise.reject();
			} catch (err) {
				return Promise.reject(err);
			} finally {
				textArea.remove();
			}
		} else {
			return Promise.reject(new Error('Clipboard API not supported and execCommand not available.'));
		}
	},

	logined: () => {
		$("#wt-my img").addClass('margin-left')
		$('#wt-my img').attr('src', superVip._CONFIG_.user.avatar)
		$('#wt-set-box .user-box-container .user-info').css('display', 'flex')
		$('#wt-set-box .user-box-container .user-info img').attr('src', superVip._CONFIG_.user.avatar)
		$('#wt-set-box .user-box-container .user-info .nickname').html(superVip._CONFIG_.user.nickname)
		$('#wt-set-box .user-box-container .user-info .username').html(superVip._CONFIG_.user.username)
	},

	logouted: (msg) => {
		superVip._CONFIG_.user = '';
		$("#wt-my img").removeClass('margin-left')
		$('#wt-my img').attr('src',
			'https://cdn.jsxl.cc/image/null_square.png')
		$('#wt-set-box .user-box-container .user-info').css('display', 'none')
		GM_setValue('jsxl_user', '')
		if(msg){
			util.showTips({
				title: '请重新登录，errMsg:' + msg
			})
		}
	},

	showAndHidTips: (name, op = 'set', val = true) => {
		let tips = GM_getValue('wt_tips', {})
		if (!tips) tips = {}
		if (op == 'set') {
			tips[name] = val
			GM_setValue('wt_tips', tips)
			if (val) $('.' + name).addClass('tips-yuan')
			else $('.' + name).removeClass('tips-yuan')
			return true
		} else {
			return tips[name] ? true : false
		}
	},

	findCommonStart: (str1, str2) => {
		let common = '';
		const minLength = Math.min(str1.length, str2.length);
		for (let i = 0; i < minLength; i++) {
			if (str1[i] === str2[i]) {
				common += str1[i];
			} else {
				break;
			}
		}
		return common;
	},

	findTargetElement: (targetContainer, maxTryTime = 30) => {
		const body = window.document;
		let tabContainer;
		let tryTime = 0;
		let startTimestamp;
		return new Promise((resolve, reject) => {
			function tryFindElement(timestamp) {
				if (!startTimestamp) {
					startTimestamp = timestamp;
				}
				const elapsedTime = timestamp - startTimestamp;
				if (elapsedTime >= 500) {
					console.log("find element：" + targetContainer + "，this" + tryTime + "num")
					tabContainer = body.querySelector(targetContainer)
					if (tabContainer) {
						resolve(tabContainer)
					} else if (++tryTime === maxTryTime) {
						reject()
					} else {
						startTimestamp = timestamp
					}
				}
				if (!tabContainer && tryTime < maxTryTime) {
					requestAnimationFrame(tryFindElement);
				}
			}
			requestAnimationFrame(tryFindElement);
		});
	},

	replaceExistResources: (body) => {
		let attachments = body.attachments;
		let all_img = {};
		let has_video = -1;
		let has_audio = -1;
		for (var i = 0; i < attachments.length; i++) {
			var atta = attachments[i];
			if (atta.category === 'images') {
				all_img[atta.id] = atta.remoteUrl;
			}
			if (atta.category === 'audio') {
				has_audio = i;
				return [body, undefined, undefined, has_audio];
			}
			if (atta.category === 'video') {
				has_video = i;
				return [body, undefined, has_video, undefined];
			}
		}
		return [body, all_img, has_video];
	},

	sleep: (time) => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res()
			}, time)
		})
	},

	showTips: (item = {}) => {
		$('#wt-maxindex-mask').css('display', 'block');
		$("#wt-tips-box").removeClass('hid-set-box');
		$("#wt-tips-box").addClass('show-set-box');
		$('#wt-tips-box .btn-box').empty()
		$('#wt-tips-box .btn-box').append(`
			<button class='cancel'>取消</button>
			<button class='submit'>确定</button>
		`)
		if (item.title) $('#wt-tips-box .content').html(item.title);
		if (item.doubt) $('#wt-tips-box .btn-box .cancel').css('display', 'block');
		if (item.confirm) $('#wt-tips-box .btn-box .submit').html(item.confirm);
		if (item.hidConfirm) {
			$('#wt-tips-box .submit').css('display', 'none');
		} else {
			$('#wt-tips-box .submit').css('display', 'block');
		}
		$('#wt-tips-box .btn-box .submit').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none');
			$("#wt-tips-box").removeClass('show-set-box');
			$("#wt-tips-box").addClass('hid-set-box');
			if (item.success) item.success(true);
		})
		$('#wt-tips-box .btn-box .cancel').on('click', () => {
			$('#wt-maxindex-mask').css('display', 'none');
			$("#wt-tips-box").removeClass('show-set-box');
			$("#wt-tips-box").addClass('hid-set-box');
			if (item.success) item.success(false);
		})
	},

	showDownLoadWindow: (show = true, msg) => {
		if (!show) {
			$('#wt-mask-box').css('display', 'none');
			$("#wt-download-box").removeClass('show-set-box');
			$("#wt-download-box").addClass('hid-set-box');
			return
		}
		$('#wt-mask-box').css('display', 'block');
		const downloadUrl = superVip._CONFIG_.videoUrl.downloadUrlSign;
		if (!document.querySelector('#wt-download-box')) {
			let items = `<li class="item" data-url="${downloadUrl}" data-type="copy" style="background-color: #fc4884;color:#e0e0e0;">复制链接</li>`
			superVip._CONFIG_.downUtils.forEach((item, index) => {
				items += `
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + downloadUrl}">${item.title}</li>
				`
			})
			$('body').append(`
				<div id="wt-download-box">
					<div class="close"></div>
					<div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟)': '特长的视频链接有效期60分钟，请尽快使用。'}</div>
					<ul>${items}</ul>
				</div>
			`)
		} else {
			$('#wt-download-box').empty()
			let items = `<li class="item" data-url="${downloadUrl}" data-type="copy" style="background-color: #fc4884;color:#e0e0e0;">复制链接</li>`
			superVip._CONFIG_.downUtils.forEach((item, index) => {
				items += `
					<li class="item" data-url="${item.url + (item.isAppend?'':'?m3u8=') + downloadUrl}">${item.title}</li>
				`
			})
			$('#wt-download-box').append(`<view class="close"></view><div class="tips">* ${msg?msg + '(刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟)': '刷新页面或打开其它帖子链接将丢失，特长的链接有效期60分钟'}</div><ul>${items}</ul>`)
		}
		if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'iPhone'){
			$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://apps.apple.com/cn/app/m3u8-mpjex/id6449724938">苹果视频下载软件</li>`
		}
		if(superVip._CONFIG_.isMobile && superVip._CONFIG_.isMobile[0] == 'Android'){
			$('#wt-download-box ul')[0].innerHTML += `<li class="item" data-open="1" data-url="https://wwjf.lanzoul.com/isifQ18id4fa">安卓视频下载软件(密3y3a)</li>`
		}
		
		$("#wt-download-box").removeClass('hid-set-box');
		$("#wt-download-box").addClass('show-set-box');
		$("#wt-download-box .item").on('click', function(e) {
			const url = e.target.dataset.url
			if(e.target.dataset.type == 'copy'){
				if(url){
					util.copyText(url).then(res => {
						util.showTips({
							title: '视频地址复制成功，请尽快使用'
						})
					}).catch(err =>{
						util.showTips({
							title: '复制失败，请通过下面在线下载再复制输入框内的视频地址'
						})
					})
				}else{
					util.showTips({
						title: '抱歉，未检测到视频'
					})
				}
				return;
			}
			if (!url || !url.includes('.m3u8') && e.target.dataset.open != 1) {
				util.showTips({
					title: '抱歉，未检测到视频，还继续前往吗?',
					doubt: true,
					success: (res) => {
						if (res) {
							window.open(url)
						}
					}
				})
			} else {
				window.open(url);
			}
		})
		$("#wt-download-box .close").on('click', function() {
			$("#wt-mask-box").click()
		})
	},

	formatTitle: (data) => {
		if (!data) return data
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
		} else {
			data = JSON.parse(decode(data))
		}
		
		if (!data || data == 'null') return superVip._CONFIG_.hjedd ? 'null' : 'WW01V2MySkJQVDA9'
		if (!data.results) {
			data.results = JSON.parse(JSON.stringify(data))
			data.isList = true
		}
		data.results.forEach(item => {
			let types = []
			if (item.hasVideo && !superVip._CONFIG_.hjedd) types.push('video')
			if (item.hasAudio && !superVip._CONFIG_.hjedd) types.push('audio')
			if (item.hasPic && !superVip._CONFIG_.hjedd) types.push('img')
			if (item.attachments && item.attachments.length > 0) {
				let imgCount = 0
				item.attachments.forEach(item => {
					if (item.category == 'video' && (!types.includes('video'))) types.push(
						'video')
					if (item.category == 'audio' && (!types.includes('audio'))) types.push(
						'audio')
					if (item.category == 'images') {
						if (!types.includes('img')) types.push('img')
						imgCount++
					}
				})
				if (superVip._CONFIG_.hjedd && (imgCount > 2) && !types.includes('video')) types
					.push('?')
			}

			types = types.length > 0 ? '[' + types.join('-') : '[';
			if ('money_type' in item) {
				types += ('-' + item.money_type);
			} else {
				types += ('-0');
			}
			types += ']';
			item.title = (types + item.title);

		})
		if (superVip._CONFIG_.hjedd) {
			return data.isList ? data.isList : data
		} else {
			return data.isList ? util.jencode(data.results) : util.jencode(data)
		}
	},

	lastingToken: (data) => {
		if (!data) return data;
		let info = ''
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
			info = data
		} else {
			info = JSON.parse(decode(data))
		}
		const user = info.user ? info.user : info
		user.title = {
			id: 6,
			name: unescape(encodeURIComponent('神豪')),
			consume: 10000000,
			consumeEnd: 0,
			icon: "https://hjpic.hjpfe1.com/hjstore/system/node/usertitle6.png?ver=1654590235"
		}
		user.vip = 4
		user.famous = true
		return superVip._CONFIG_.hjedd ? info : util.jencode(info)
	},

	formatVideo: (data) => {
		if (!data) return data
		let video = ''
		if (superVip._CONFIG_.hjedd || typeof(data) == 'object') {
			superVip._CONFIG_.hjedd = true
			video = data
		} else {
			video = JSON.parse(decode(data))
		}
		video.type = 1
		video.amount = 0
		video.money_type = 0
		video.vip = 0
		if (video.remoteUrl && !video.remoteUrl.startsWith('http')) {
			if (window.location.href.includes('videoplay')) {
				//短视频待修
				// video.remoteUrl = util.getM3u8Path(video.remoteUrl)
				// superVip._CONFIG_.videoUrl = video.remoteUrl
			} else {
				superVip._CONFIG_.videoUrl.url = video.remoteUrl
				if (superVip._CONFIG_.videoUrl.type == 0 && video.remoteUrl) {
					util.showAndHidTips('wt_player_haijiao');
				}
			}
		}
		return superVip._CONFIG_.hjedd ? video : util.jencode(video)
	},

	checkUpdate: async (check) => {
		const autoUpdatedVersionDate = GM_getValue('auto_updated_date', 0)
		if (autoUpdatedVersionDate > Date.now() && !check) return {
			errCode: 100,
			errMsg: '检测更新频率限制'
		}
		if (check && GM_getValue('updated_next_date', 0) > Date.now()) return {
			errCode: 200,
			errMsg: '请在 ' + new Date(GM_getValue('updated_next_date', 0)).toLocaleString() + ' 后再检查更新'
		}
		GM_setValue('updated_next_date', Date.now() + 600000)
		const result = await util.asyncHttp('https://api.jsxl.pro/openHttp' + (Math.floor(Math.random() * 2) + 1) + '00/updateCheck?name=haijiao&version=' + superVip._CONFIG_.version)
		if (result.errMsg == 'success') {
			GM_setValue('auto_updated_date', Date.now() + 18000000)
			const res = JSON.parse(result.responseText)
			if ((res.update_msg && res.is_update) || res.errMsg || res.notify_all) {
				let msgInfo = ''
				if (res.notify_all) msgInfo += '<p>-  ' + res.notify_all + '<p/>'
				if (res.errMsg) msgInfo += '<p>-  ' + res.errMsg + '<p/>'
				if (res.is_update && res.update_msg) msgInfo += res.update_msg
				const historyNotify = GM_getValue('notify')
				if (check || !historyNotify || historyNotify.msgInfo.replace(/id\=\d+/, '') != msgInfo
					.replace(/id\=\d+/, '')) {
					util.showNotify({
						title: msgInfo,
						success: () => {
							if (res) {
								superVip._CONFIG_.showNotify = false
							}
						}
					})
					util.showAndHidTips('wt_my_notify')
				}
				
				if (msgInfo && msgInfo.replace(/\s*/g, "").length > 0){
					GM_setValue('notify', {
						date: new Date().setHours(0, 0, 0, 0),
						msgInfo
					})
				}
			}
			
			if (!res.is_update){
				return { errCode: 200, errMsg: '当前版本 ' + superVip._CONFIG_.version + ' 已经是最新版本'}
			}else{
				return { errCode: 0, errMsg: 'ok'}
			}
		}else{
			return { errCode: 100, errMsg: '检测更新失败'}
		}
	},

	showNotify: (item = {}) => {
		$("#wt-notify-box").removeClass('hid-notify-box')
		$("#wt-notify-box").addClass('show-notify-box')
		let version = superVip._CONFIG_.version
		const v = /当前脚本版本 (\d\.\d\.\d\.{0,1}\d{0,2})/.exec(item.title)
		if (v) item.title = item.title.replace(v[1], version)
		if (item.title) $('#wt-notify-box .content').html(item.title + (version ?
			'<div style="text-align: right;color: #ccc;font-size: 10px;margin-top: 10px;">v ' +
			version + '</div>' : ''))
		superVip._CONFIG_.showNotify = true
		$('#wt-notify-box a').on('click', (e) => {
			e.stopPropagation()
		})
		$('#wt-notify-box').on('click', () => {
			$("#wt-notify-box").removeClass('show-notify-box')
			$("#wt-notify-box").addClass('hid-notify-box')
			superVip._CONFIG_.showNotify = false
			if (item.success) item.success(true)
		})
	}
}

const superVip = (function() {
	const _CONFIG_ = {
		isMobile: navigator.userAgent.match(
			/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i),
		vipBoxId: 'wt-vip-jx-box' + Math.ceil(Math.random() * 100000000),
		version: '2.7.8',
		videoUrl: {},
		downUtils: [
			{ title: '在线下载1(适合电脑)', url: 'http://tools.bugscaner.com/m3u8.html', isAppend: false},
			{ title: '在线下载2(适合电脑)', url: 'https://tools.thatwind.com/tool/m3u8downloader#m3u8=', isAppend: true},
			{ title: '在线下载3(适合电脑)', url: 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=', isAppend: true}
		]
	}
	
	class BaseConsumer {
		constructor(body) {
			this.parse = () => {
				setTimeout(() => {
					util.checkUpdate()
				}, 1500)
				this.interceptHttp()
				util.findTargetElement('body').then(container => {
					container.style.overflowY = 'auto !important';
					this.generateElement(container).then(
						container => this.bindEvent(container))
				})
			}
		}

		interceptHttp() {
			const originOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function(method, url) {
				this.ontimeout = function() {
					window.location.reload()
				}
				if (/\/api\/comment\/reply$/.test(url)) {
					this._scope_url = url
				}
				if (_CONFIG_.user && _CONFIG_.user.token) {
					if (/\/api\/banner\/banner_list/.test(url)) {
						this.abort()
					}
					if (/\/api\/topic\/hot\/topics\?/.test(url)) {
						const xhr = this;;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/search/.test(url)) {
						;
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/\d+/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = modifyData(res.data)
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									alert(e)
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/attachment/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (res.data) {
										const body = JSON.parse(decode(res.data, superVip))
										res.data = util.formatVideo(res.data);
									}
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');;
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/\/api\/topic\/(node\/(topics|news)|idol_list)/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatTitle(res.data)
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
					
					if (/\/api\/user\/(info\/(\d+))|current/.exec(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									const regRes = /\/api\/user\/(info\/(\d+))|current/
										.exec(
											url);
									const uid = sessionStorage.getItem('uid');
									if (regRes.length > 2 && (regRes[2] && regRes[2] != uid) && res.message.includes('禁')) {
										const user =  {
											'isFavorite': false,
											'likeCount': 12,
											'user': {
												'id': parseInt(regRes[2]),
												'nickname': '被封禁账号',
												'avatar': '0',
												'description': `该账号已被封禁`,
												'topicCount': 100,
												'videoCount': 0,
												'commentCount': 303,
												'fansCount': 57,
												'favoriteCount': 39,
												'status': 0,
												'sex': 1,
												'vip': 0,
												'vipExpiresTime': '0001-01-01 00:00:00',
												'certified': false,
												'certVideo': false,
												'certProfessor': false,
												'famous': false,
												'forbidden': false,
												'tags': null,
												'role': 0,
												'popularity': 10,
												'diamondConsume': 0,
												'title': {
													'id': 0,
													'name': '',
													'consume': 0,
													'consumeEnd': 0,
													'icon': "https://hjpic.hjpfe1.com/hjstore/system/node/usertitle2.png?ver=1654590917"
												},
												'friendStatus': false,
												'voiceStatus': false,
												'videoStatus': false,
												'voiceMoneyType': 0,
												'voiceAmount': 0,
												'videoMoneyType': 0,
												'videoAmount': 0,
												'depositMoney': 0
											}
										}
										res.isEncrypted = true;
										res.errorCode = 0;
										res.success = true;
										res.message = "";
										res.data = util.jencode(user, 'plus');
										util.showTips({
											title: '此博主已被海角官方封禁，是否前往盗版海角查看此封禁博主帖子?',
											doubt: true,
											success: (res)=>{
												if(res){
													window.open(location.href.replace(/:\/\/([^/]+)/.exec(location.href)[1],'hjqq4.top'));
												}
											}
										})
									}
									if(regRes[2] == uid || location.href.includes('/user/myinfo')){
										res.data = util.lastingToken(res.data);
									}
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/api\/login\/signin/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (res.success) {
										const username = document.querySelector(
											'input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]'
											).value
										const pwd = document.querySelector(
											'input[type="password"]').value
										if (username && pwd) {
											GM_setValue('haijiao_userpwd', {
												username,
												pwd
											})
										}
										util.findTargetElement(
												'.van-dialog__cancel,.el-button--small', 7)
											.then(res => {
												res.click()
											})
									} else {
										util.showTips({
											title: res.message
										})
									}
									res.data = util.lastingToken(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						});
					}
		
					if (/api\/video\/checkVideoCanPlay/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									res.data = util.formatVideo(res.data);
									return JSON.stringify(res, `utf-8`);
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
		
					if (/api\/login\/signup/.test(url)) {
						const xhr = this;
						const getter = Object.getOwnPropertyDescriptor(
							XMLHttpRequest.prototype,
							"response"
						).get;
						Object.defineProperty(xhr, "responseText", {
							get: () => {
								let result = getter.call(xhr);
								try {
									let res = JSON.parse(result, `utf-8`);
									if (!res.success) {
										util.showTips({
											title: res.message
										})
									}
									return result
								} catch (e) {
									console.log('发生异常! 解析失败!');
									console.log(e);
									return result;
								}
							},
						})
					}
				}
				originOpen.call(this, method, url);
			};
		
			const oldSend = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function(...args) {
				if (this._scope_url && args.length > 0) {
					try {
						args[0] = args[0].replace(args[0].match(/"content":"<p>(.+)<\/p>",/)[1], util
							.decoat(
								'JUU2JTg0JTlGJUU4JUIwJUEyJUU1JThEJTlBJUU0JUI4JUJCJUU1JTg4JTg2JUU0JUJBJUFCJUVGJUJDJThDJUU1JUE1JUIzJUU0JUI4JUJCJUU3JTlDJTlGJUU2JTk4JUFGJUU2JTlFJTgxJUU1JTkzJTgxJUU1JUIwJUE0JUU3JTg5JUE5JUVGJUJDJThDJUU2JTlDJTlCJUU1JThEJTlBJUU0JUI4JUJCJUU2JThDJTgxJUU3JUJCJUFEJUU2JTlCJUI0JUU2JTk2JUIw'
								))
					} catch (e) {
						console.log(e)
					}
				}
				return oldSend.call(this, ...args)
			};
		}

		generateElement(container) {
			GM_addStyle(`
				@font-face {
				  font-family: 'iconfont';  /* Project id 3913561 */
				  src: url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.woff2?t=1696210493672') format('woff2'),
				       url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.woff?t=1696210493672') format('woff'),
				       url('//at.alicdn.com/t/c/font_3913561_cpe13fwca8.ttf?t=1696210493672') format('truetype');
				}
				.iconfont {
				    font-family: "iconfont" !important;
				    font-size: 16px;
				    font-style: normal;
		            font-weight: 400 !important;
				    -webkit-font-smoothing: antialiased;
				    -moz-osx-font-smoothing: grayscale;
				}
				@keyframes showSetBox {
					0% {
						transform: translate(-50%,-50%) scale(0);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(1);
					}
				}
				@keyframes hidSetBox {
					0% {
						transform: translate(-50%,-50%) scale(1);
					}
					80% {
						transform: translate(-50%,-50%) scale(1.1);
					}
					100% {
						transform: translate(-50%,-50%) scale(0);
					}
				}
				@keyframes colorAnima {
					0%{
						background-color: #f0f0f0;
						color: #5d5d5d;
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						background-color: #ff6022;;
						color: white;
						transform: scale(1);
					}
				}
				@keyframes showNotifyBox {
					0% {
						transform: translate(-50%,-100%) scale(0);
					}
					80% {
						transform: translate(-50%,35px) scale(1.1);
					}
					100% {
						transform: translate(-50%,35px) scale(1);
					}
				}
				@keyframes hidNotifyBox {
					0% {
						transform: translate(-50%,35px) scale(1.1);
					}
					80% {
						transform: translate(-50%,35px) scale(1);
					}
					100% {
						transform: translate(-50%,-100%) scale(0);
					}
				}
				@keyframes scale {
					0%{
						transform: scale(1);
					}
					50%{
						transform: scale(1.1);
					}
					100%{
						transform: scale(1);
					}
				}
				@keyframes circletokLeft {
				    0%,100% {
				        left: 0px;
				        width: 12px;
				        height: 12px;
				        z-index: 0;
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 8px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 22px;
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 8px;
				        transform: scale(1)
				    }
				}
				@keyframes circletokRight {
				    0%,100% {
				        top: 3px;
				        left: 22px;
				        width: 12px;
				        height: 12px;
				        z-index: 0
				    }
				    25% {
				        height: 15px;
				        width: 15px;
				        z-index: 1;
				        left: 24px;
				        transform: scale(1)
				    }
				    50% {
				        width: 12px;
				        height: 12px;
				        left: 0px;
				    }
				    75% {
				        width: 10px;
				        height: 10px;
				        left: 24px;
				        transform: scale(1)
				    }
				}
				.color-anima{
					animation: colorAnima .3s ease 1 forwards;
				}
				.btn-anima{
					animation: scale .3s ease 1 forwards;
				}
				.login-btn::after,.login-form-button::after{content:'(如点登录后没反应，请关闭脚本再试)';color:#e91e63;margin-left:5px;font-size: 10px;}
				.scroll-btn,.el-message-box,.van-toast,.el-message,.v-modal,.publicContainer,.containeradvertising,#home .btnbox,#home .addbox,.topbanmer,.bannerliststyle,.ishide,#jsxl-box,#jsxl-mask{display:none !important;z-index:-99999 !important;opacity: 0!important;width :0 !important;}
				#wt-resources-box{position: relative; border: 1px dashed #ec8181;background: #fff4f4;}
				.sell-btn{border:none !important;margin-top:20px;}
				.margin-left{ margin-left: 0 !important;}
				.show-set-box{ animation: showSetBox 0.3s ease 1 forwards;}
				.hid-set-box{ animation: hidSetBox 0.3s ease 1 forwards;}
				.show-notify-box{ animation: showNotifyBox 0.3s ease 1 forwards;}
				.hid-notify-box{ animation: hidNotifyBox 0.3s ease 1 forwards;}
				#wt-loading-box{display: none;position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 100000;background-color: #0000004d;}
				#wt-loading-box .loading{position: absolute;width: 35px;height: 17px;top: 50%;left: 50%;transform: translate(-50%,-50%);}
				#wt-loading-box .loading::before,
				#wt-loading-box .loading::after{position: absolute;content: "";top: 3px;background-color: #ffe60f;width: 14px;height: 14px;border-radius: 20px;mix-blend-mode: multiply;animation: circletokLeft 1.2s linear infinite;}
				#wt-loading-box .loading::after{animation: circletokRight 1.2s linear infinite;background-color: #4de8f4;}
				#wt-left-show{ position: fixed;left: 20px;top: 50%;transform: translateY(-50%);z-index: 9999;transition: all 0.3s ease;}
				#wt-left-show i {color: #5f5b5b;font-size: 24px;color: #E91E63;text-shadow: #E91E63 2px 2px 12px;font-size: 25px;margin-left: -1px;}
				#wt-${_CONFIG_.vipBoxId}{
					position: fixed;
					top: 50%;
					transform: translate(0, -50%);
					right: 10px;
					width: 46px;
					border-radius: 30px;
					background: rgb(64 64 64 / 81%);
					box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);
					z-index: 9999;
					transition: all 0.3s ease;
				}
				#wt-${_CONFIG_.vipBoxId} .item{position: relative;height: 60px;}
				.tips-yuan::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #5ef464;}
				.tips-yuan-err::before{ position: absolute; content: '';top: 12px; right: 6px;width: 8px;height: 8px; border-radius: 10px; background-color: #f83f32;}
				#wt-${_CONFIG_.vipBoxId} .item:not(:last-child)::after{position: absolute;bottom: 0;left: 22.5%;content: '';width: 55%;height: 2px;background-color: #fff;}
				#wt-${_CONFIG_.vipBoxId} .item .iconfont,#wt-${_CONFIG_.vipBoxId} .item img{position: absolute;top:50%;left:50%;transform: translate(-50%,-50%)}
				#wt-login-box .close,#wt-set-box .close,#wt-notify-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-login-box .close::before,#wt-login-box .close::after,#wt-set-box .close::before,#wt-set-box .close::after,#wt-notify-box .close::before,#wt-notify-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 12px;height: 2px;border-radius: 1px;background-color: #6a6a6a;transform: translate(-50%,-50%) rotate(45deg);visibility: visible;}
				#wt-login-box .close::after,#wt-set-box .close::after,#wt-notify-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-${_CONFIG_.vipBoxId} .absolute-center{ position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
				#wt-${_CONFIG_.vipBoxId} #wt-my img{ width: 28px;height: 28px;border-radius: 30px;margin-left: 2px;transtion: all 0.3s ease;}
				#wt-${_CONFIG_.vipBoxId} #wt-my-set i {color: white;font-size: 24px;text-shadow: 2px 2px 14px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-down i {color: white;font-size: 24px;text-shadow: 2px 2px 15px #ffffff;font-family: 'iconfont';}
				#wt-${_CONFIG_.vipBoxId} #wt-my-notify i {color: white;font-size: 23px;padding: 10px 1px;text-shadow: 2px 2px 12px #ffffff;}
				#wt-${_CONFIG_.vipBoxId} #wt-hid-box i {color: white;font-size: 24px;text-shadow: 2px 2px 12px #ffffff;font-size: 25px;margin-left: -1px;}
				.wt-player-btn-box .player-btn{ position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width: 20%}
				.wt-player-btn-box .tips{ position: absolute;bottom: 20px;left:50%;transform: translateX(-50%);color: #FFC107;width: 80%;text-align: center;font-size: 15px;font-weight: 500;}
				#wt-mask-box,#wt-maxindex-mask{display:none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 10000; background-color: #00000057;}
				#wt-maxindex-mask{z-index: 90000;display:none;}
				#wt-set-box{ position:fixed; top:50%;left:50%; transform: translate(-50%,-50%) scale(0);overflow: hidden;background-color: white;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);border-radius: 12px;z-index: 10010;padding: 10px 15px;padding-right: 5px;box-sizing: border-box;}
				#wt-set-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #2196F3;z-index: -1;opacity: 0.7;bottom: 0;transform: translate(-40%,58%);}
				#wt-set-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;top: 0;right: 0;transform: translate(22%,-53%);}
				#wt-set-box .selected-box .selected{ background-color: #ff6022;color: white;}
				#wt-set-box .user-box-container{display: none;letter-spacing: 1px;}
				#wt-set-box .user-box-container .update{display: inline-block; padding: 0 10px; height: 28px;line-height: 28px;background-color: #f1f1f1;color: #545454; border-radius: 30px;border: none;font-size: 10px;float: right;margin-right: 5px;}
				#wt-set-box .info-box{display:flex;height: 50px;align-items: center;}
				#wt-set-box .info-box .avatar-box{position: relative;height: 36px;width: 36px;background-color: white;border-radius: 7px;box-shadow: rgb(166 166 166 / 20%) 0px 1px 20px 0px;}
				#wt-set-box .user-box .title{text-align: center;font-weight: 600;font-size: 16px;color: #3a3a3a;}
				#wt-set-box .user-box .desc{flex: 8;font-size: 10px;color: #5d5d5d;margin: 0 10px;}
				#wt-set-box .user-box .avatar{position: absolute; width: 36px;height:36px;border-radius: 30px;border-radius: 7px;font-size: 0;}
				#wt-set-box .user-box .user-info{ position: relative; left: -5px; display: flex;align-items: center;margin-bottom: 4px;background-color: #f1f1f1;border-radius: 11px;padding: 7px;}
				#wt-set-box .user-box .user-info .info{margin-left: 10px;}
				#wt-set-box .user-box .user-info .info .nickname{color: #676767;font-size: 12px;}
				#wt-set-box .user-box .user-info .info .username{color: #b9b9b9;font-size: 10px;margin-top: 2px;}
				#wt-set-box .user-box .user-info .logout{position: absolute;font-size: 0;right: 12px;}
				#wt-set-box .user-box .user-info .logout button{padding: 0 10px;height: 28px;background-color: #615b5b;border-radius: 30px;color: white;border: none;font-size: 10px;}
				#wt-set-box .user-box .apps-container{ height: 330px; overflow: auto; margin-bottom: 10px;}
				#wt-tips-box,#wt-download-box{ position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);overflow: hidden;width: 240px;min-height:130px;background-color: white;border-radius:12px;z-index: 95000;padding:10px 15px;}
				#wt-tips-box,#wt-download-box .tips{ font-size: 10px;margin-top: 30px;color: #E91E63;letter-spacing: 1px;}
				#wt-tips-box .title{font-size: 16px;text-align: center;font-weight: 600;}
				#wt-tips-box .content{text-align: center;margin: 14px 0;font-size: 12px;color: #2a2a2a;font-weight: 500;word-break: break-word;}
				#wt-tips-box .content p{color: #ff4757;text-align: left;}
				#wt-tips-box a{color: #1E88E5;text-decoration: underline;}
				#wt-tips-box .btn-box{display:flex;justify-content: space-around;}
				#wt-tips-box .btn-box button{min-width: 60px;height: 28px;background-color: #ec407a;border-radius: 30px;color: white;border: none;font-size: 12px;}
				#wt-tips-box .btn-box .cancel{display: none;background-color: #eee;color:#2a2a2a}
				#wt-tips-box .logo{position: absolute;top: 9%;left: 1%; color: #dbdbdb; font-size: 11px;transform: rotate(-15deg);text-align: center;}
				#wt-tips-box .version{position: absolute;top: 9%; right: 10%;transform: rotate(-15deg);color: #dbdbdb;}
				#wt-notify-box {position: fixed;top: 2%;left: 50%;transform:translate(-50%,-100%) scale(0);overflow: hidden;width: 80%;min-height: 75px;letter-spacing: 1px;background-color: white;color:#2a2a2a;border-radius: 15px;box-shadow: 0 15px 30px rgba(0, 0, 0, .15);z-index: 95000;}
				#wt-notify-box::after{ content:'';position: absolute;width: 250px;height: 250px;border-radius: 200px;background-color: #03A9F4;z-index: -1;opacity: 0.7;bottom: 0;left: 0;transform: translate(-50%,85%);}
				#wt-notify-box .title{ text-align: center;height: 35px; line-height: 35px;font-size: 15px;font-weight: 600; color: #E91E63;}
				#wt-notify-box .content{ color: #3a3a3a;padding: 10px 15px;font-size: 12px;}
				#wt-notify-box .content a{color: #1E88E5;text-decoration: underline;}
				#wt-notify-box .content p{margin-bottom: 5px;}
				.wt-player-btn-box{ position:absolute;top:0;left:0;right:0;bottom:0;z-index: 9998;background-color: #0000004d;}
				#wt-video-container{display: none; position:fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: 9998;background-color: black;}
				#wt-video-container .wt-video{ position:absolute;top:50%;width:100%;transform: translateY(-50%);height: 240px; z-index: 9999;}
				#wt-video-container .wt-video video{width:100%;height: 100%;}
				#wt-video-container .player-tips{position: fixed ;bottom: 10% ;left:50%; transform: translateX(-50%);font-size: 16px;letter-spacing: 2px;white-space: nowrap;padding: 10px;text-wrap: wrap;width: 80%;color: #04b20b;}
				.dplayer-controller{bottom: 30px !important;}
				.main-player{height: 300px;}
				.dplayer.dplayer-hide-controller .dplayer-controller{ opacity: 0 !important;transform: translateY(200%) !important;}
				.wt-close-btn{ font-size: 15px;position: absolute;top: 40px;left: 25px;color: white;}
				#wt-download-box{ z-index: 10010;}
				#wt-download-box .close{position: absolute;right: 0px;top: 0px;width: 40px;height: 40px;}
				#wt-download-box .close::before,#wt-download-box .close::after{position: absolute;left: 50%;top: 50%;content: '';width: 14px;height: 2px;border-radius: 1px;background-color: #adadad;transform: translate(-50%,-50%) rotate(45deg);}
				#wt-download-box .close::after,#wt-download-box .close::after{transform: translate(-50%,-50%) rotate(-45deg);}
				#wt-download-box::before{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #e91e63;z-index: -1;opacity: 0.7;top: 0;left: 0;transform: translate(-38%,-40%);}
				#wt-download-box::after{content:'';position: absolute;width: 150px;height: 150px;border-radius: 100px;background-color: #FFC107;z-index: -1;opacity: 0.7;bottom: 0;right: 0;transform: translate(62%,30%);}
				#wt-download-box ul li{ height: 38px;line-height: 38px;font-size: 11px;text-align: center;color:#909090;font-weight: 500;background-color: white;box-shadow: rgb(166 166 166 / 20%) 0px 1px 5px 1px;margin: 18px 30px;border-radius: 40px;}
				`)
			if (_CONFIG_.isMobile) {
				GM_addStyle(`
		            #wt-set-box {width:72%;}
		        `);
			}
			let scripts = '';
			if(_CONFIG_.user && _CONFIG_.user.scripts){
				_CONFIG_.user.scripts.forEach((item, index) => {
					scripts += `
						<div class="info-box" data-index="${index}">
							<div class="avatar-box">
								<img class="avatar" src="${item.icon}"/>
							</div>
							<div class="desc">
								<text>${item.desc}</text>
							</div>
						</div>
					`;
				})
			}
			$(container).append(`
		        <div id="wt-${_CONFIG_.vipBoxId}">
				    <div id="wt-my" class="item wt_my_haijiao">
						<img src="https://cdn.jsxl.cc/image/null_square.png"></img>
				    </div>
				    <div id="wt-my-set" class="item wt_player_haijiao">
					    <i class="iconfont">&#xec05;</i>
				    </div>
					<div id="wt-my-down" class="item wt_my_down_haijiao">
					    <i class="iconfont">&#xec09;</i>
					</div>
					<div id="wt-my-notify" class="item wt_my_notify" style="padding: 0 11px;">
					    <i class="iconfont">&#xec08;</i>
					</div>
				    <div id="wt-hid-box" class="item">
					    <i class="iconfont">&#xec06;</i>
				    </div>
			    </div>
			    <div id="wt-left-show" style="transform: translate(-60px,-50%);padding: 10px;">
					<i class="iconfont">&#xe704;</i>
			    </div>
				<div id="wt-mask-box"></div>
				<div id="wt-set-box">
					<div class="close"></div>
					<div class="line-box" style="display:none">
					</div>
					<div class="user-box-container">
						<div class="user-box">
							<div class="title" style="margin-bottom: 10px">及时行乐插件库</div>
							<div class="user-info">
								<div class="avatar" style="position: relative;">
									<img src="https://cdn.jsxl.cc/image/null_square.png" style="width: 100%;height: 100%;border-radius: 8px;"></img>
								</div>
								<div class="info">
									<div class="nickname">请登录</div>
									<div class="username">xxxxxxxxxx</div>
								</div>
								<div class="logout">
									<button>退出登录</button>
								</div>
							</div>
							<div class="apps-container"> ${scripts}</div>
							<boutton class="update">检查更新</boutton>
						</div>
					</div>
				</div>
				<div id="wt-loading-box">
					<div class="loading"></div>
				</div>
				<div id="wt-maxindex-mask"></div>
				<div id="wt-tips-box">
					<div class="title">提示</div>
					<div class="content"></div>
					<div class="btn-box">
						<button class='cancel'>取消</button>
						<button class='submit'>确定</button>
					</div>
					<div class="logo"><p>@https://vip.jsxl.cc</p></div>
					<div class="version"><p>v ${superVip._CONFIG_.version}</p></div>
				</div>
				<div id="wt-notify-box">
					<div class="close"></div>
					<div class="title">通知</div>
					<div class="content"></div>
				</div>
				<div id="wt-video-container">
					<div class="wt-close-btn">
						<i class="van-icon van-icon-close"></i>
						<span style="margin-left: 5px;">退出播放</span>
					</div>
					<div class="wt-video">
						<video id="wt-video" controls></video>
					</div>
					<div class="player-tips">如卡顿最好开梯子进行播放，理论上会流畅些(梯子也分三六九等，一般贵的理论上网速更好)，卡顿也可下载后再播放</div>
				</div>
		    `)
			if (_CONFIG_.user && _CONFIG_.user.avatar) {
				util.logined()
			}
			return new Promise((resolve, reject) => resolve(container));
		}

		bindEvent(container) {
			const vipBox = $(`#wt-${_CONFIG_.vipBoxId}`)
			if (GM_getValue('haijiao_hid_controller', null)) {
				vipBox.css("transform", "translate(125%, -50%)")
				$('#wt-left-show').css("transform", "translate(0, -50%)")
			}

			vipBox.find("#wt-my").on("click", () => {
				if (_CONFIG_.user) {
					$('#wt-mask-box').css('display', 'block')
					$("#wt-set-box .user-box-container").css('display', 'block')
					$("#wt-set-box").removeClass('hid-set-box')
					$("#wt-set-box").addClass('show-set-box')
					$('#wt-set-box .user-box-container .nickname').html(_CONFIG_.user.nickname)
				} else {
					util.addLogin()
					$('#wt-login-mask').css('display','block')
					$("#wt-login-box").removeClass('hid-set-box')
					$("#wt-login-box").addClass('show-set-box')
					const jsxl_login_pwd = GM_getValue('jsxl_login_pwd','')
					if(jsxl_login_pwd){
						const username = jsxl_login_pwd.substring(0,jsxl_login_pwd.indexOf('+'));
						let pwd = jsxl_login_pwd.substring(jsxl_login_pwd.indexOf('+') + 1, jsxl_login_pwd.length).substring(0,8);
						$("#wt-login-box input")[0].value = username;
						$("#wt-login-box input")[1].value = pwd;
					}
				}
			})

			vipBox.find("#wt-my-set").on("click", async () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if (!_CONFIG_.videoUrl.url) {
					$('#wt-loading-box').css('display', 'block')
					for (let i = 0; i < 5; i++) {
						await util.sleep(1000)
						if (_CONFIG_.videoUrl.url) {
							$('#wt-loading-box').css('display', 'none')
							break
						}
					}
					$('#wt-loading-box').css('display', 'none')
				}
				if(!_CONFIG_.hjedd){
					if(!_CONFIG_.videoUrl.aes){
						$('#wt-loading-box').css('display', 'block')
						for (let i = 0; i < 5; i++) {
							await util.sleep(1000)
							if (_CONFIG_.videoUrl.aes) {
								$('#wt-loading-box').css('display', 'none')
								break
							}
						}
						$('#wt-loading-box').css('display', 'none')
					}
					if(_CONFIG_.videoUrl.aes){
						$('#wt-video-container').css('display', 'block')
						$("#wt-hid-box").click()
						$('#wt-video-container .wt-video').css('height', '100%')
						$('#wt-video-container .wt-close-btn').css('z-index', '99999')
						$('.wt-video').empty()
						$('.wt-video').append(`
							<iframe id="myFrame" style="width:100%;height:100%;border: none;" src="https://video.jsxl.pro/?aes=` + _CONFIG_.videoUrl.aes +`" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
						`)
						return
					}
				}
				if (_CONFIG_.videoUrl.url) {
					$('#wt-video-container').css('display', 'block')
					$("#wt-hid-box").click()
					if (_CONFIG_.videoUrl.type != 0) {
						if (!_CONFIG_.videoUrl.url || !_CONFIG_.videoUrl.url.startsWith('blob:http')) {
							util.showTips({
								title: location.href + '</br>此视频可能还未被解析，正在解析中请勿操作。。。</br>如解析时长大于1分钟请考虑开梯子再试</br>及时行乐脚本唯一网站https://vip.jsxl.cc',
								hidConfirm: true
							})
							await util.sleep(500)
						}
						_CONFIG_.videoUrl.url = await get_m3u8_url_haijiao()
						if (!_CONFIG_.videoUrl.url || !_CONFIG_.videoUrl.url.includes('http')) {
							if (_CONFIG_.videoUrl.url.includes('通知:') || _CONFIG_.videoUrl.url
								.includes('最新版本')) {
								util.showTips({
									title: _CONFIG_.videoUrl.url
								})
							} else {
								util.showTips({
									title: _CONFIG_.videoUrl.url + '</br>' + location
										.href + '</br>抱歉，解析失败，如有问题或需梯子推荐请联系发电网站https://vip.jsxl.cc中售后联系方式'
								})
							}
							return;
						}
						$('#wt-tips-box .btn-box .submit').click()
					}
					
					if(_CONFIG_.hjedd){
						if (_CONFIG_.isMobile && _CONFIG_.isMobile[0] == 'iPhone') {
							$('.wt-video').empty()
							$('.wt-video').append(`
								<video controls width="100%" height="100%">
								    <source src="${_CONFIG_.videoUrl.url}" type="application/x-mpegURL">
								</video>
							`)
						} else {
							const video = document.querySelector('.wt-video #wt-video')
							_CONFIG_.hls_dp = new Hls()
							_CONFIG_.hls_dp.loadSource(_CONFIG_.videoUrl.url)
							_CONFIG_.hls_dp.attachMedia(video)
							_CONFIG_.hls_dp.on(Hls.Events.MANIFEST_PARSED, function() {
								video.play()
							})
						}
					}else{
						$('#wt-video-container .wt-video').css('height', '100%')
						$('#wt-video-container .wt-close-btn').css('z-index', '99999')
						$('.wt-video').empty()
						$('.wt-video').append(`
							<iframe id="myFrame" style="width:100%;height:100%;border: none;" src="https://video.jsxl.pro/?aes=` + _CONFIG_.videoUrl.aes +`" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
						`)
					}
				}
				if (!_CONFIG_.videoUrl.url) {
					if(_CONFIG_.videoUrl.type == 0){
						util.showTips({
							title: location.href +
								'</br>此帖子似乎是免费视频，请登录海角账号后使用海角自带的进行播放'
						})
					}else{
						util.showTips({
							title: location.href +
								'</br>抱歉未检测到帖子视频，请关掉其它脚本再试，或苹果用Focus浏览器，安卓用Via浏览器再试'
						})
					}
				}
			})

			$('#wt-video-container div').on('click', function(e) {
				e.stopPropagation()
			})

			$('.wt-close-btn').on('click', function() {
				$('#wt-video-container').css('display', 'none')
				if(_CONFIG_.hjedd){
					var videos = document.querySelectorAll('video');
					videos.forEach(function(video) {
						// video.volume = 0.0
						video.pause();
					});
					if (_CONFIG_.hls_dp) _CONFIG_.hls_dp.destroy()
				}else{
					$('.wt-video').empty()
				}
				$("#wt-left-show").click();
			})

			vipBox.find("#wt-my-down").on("click", () => {
				if (!_CONFIG_.user) {
					$("#wt-my").click()
					return
				}
				if(_CONFIG_.user.login_type != 'username_pwd'){
					util.showTips({
						title: '抱歉，登录码登入没有下载权限，请在vip.jsxl.cc网站发电后使用账号+密码登入'
					})
					return;
				}
				if(_CONFIG_.videoUrl.downloadUrlSign){
					util.showDownLoadWindow();
					return;
				}
				if (_CONFIG_.videoUrl.url) {
					if(_CONFIG_.user && _CONFIG_.user.stopDownload || (_CONFIG_.user.role.useDownloadNum == _CONFIG_.user.role.maxDownloadNum) ){
						util.showTips({
							title: '抱歉，今日下载次数' + _CONFIG_.user.role.maxDownloadNum + '次已经用完，请明日再下载</br>(该jsxl账号其它登录码共享次数)'
						})
						return;
					}
					if (_CONFIG_.videoUrl.type == 0 || (_CONFIG_.videoUrl.url.endsWith('.m3u8') && !
							_CONFIG_.videoUrl.url.includes('preview')) || _CONFIG_.videoUrl
						.downloadUrl) {
						util.showTips({
							title: '为了脚本的稳定现已日限下载</br>(当前账号日限' + _CONFIG_.user.role.maxDownloadNum +'次，已使用' + _CONFIG_.user.role.useDownloadNum +'次，永久会员比非永久次数多)，</br>您确定要消耗一次次数来获取视频链接吗(如失败不计数)?',
							doubt: true,
							success: async (confirm) => {
								if (confirm) {
									try {
										$('#wt-loading-box').css('display', 'block')
										await util.sleep(300);
										const res = await util.asyncHttp(
											'https://api.jsxl.pro/openDownload' + (Math.floor(Math.random() * 3) + 1) + '00/signDownload?downloadUrl=' +
											(_CONFIG_.videoUrl.downloadUrl ?
												_CONFIG_.videoUrl.downloadUrl :
												_CONFIG_.videoUrl.url) +
											'&isDownload=' + (_CONFIG_.videoUrl
												.downloadUrl ? 1 : 0) +
											'&videoType=' + _CONFIG_.videoUrl.type +
											'&hjedd=' + (_CONFIG_.hjedd ? 1 : 0) +
											'&origin=' + location.origin + '&app=海角社区')
										$('#wt-loading-box').css('display', 'none')
										if (res.errMsg == 'success') {
											const result = JSON.parse(res.responseText)
											if (result.errCode != 0) {
												throw new Error(result.errMsg)
											}
											if(result.newToken) _CONFIG_.user.token = result.newToken;
											if(result.newRole && result.newRole.expired_date) _CONFIG_.user.role.expired_date = result.newRole.expired_date;
											_CONFIG_.user.role.useDownloadNum = result.useDownloadNum
											_CONFIG_.videoUrl.downloadUrlSign = result.data
											util.showDownLoadWindow(true, result.errMsg);
											GM_setValue('jsxl_user', _CONFIG_.user);
										} else {
											$('#wt-loading-box').css('display', 'none')
											util.showTips({
												title: _CONFIG_.videoUrl.url +
													'</br>' + location.href +
													'</br>' + res.errMsg
											})
										}
									} catch (e) {
										console.log(e)
										$('#wt-loading-box').css('display', 'none')
										util.showTips({
											title: e.message +
												'</br>' + location.href +
												'</br>获取下载链接失败'
										})
										if(e.message.includes('明日再下载')){
											_CONFIG_.user.stopDownload = true
											_CONFIG_.user.role.useDownloadNum = _CONFIG_.user.role.maxDownloadNum
											GM_setValue('jsxl_user', _CONFIG_.user);
										}
									}
								}
							}
						})
						return;
					}
				}

				if (_CONFIG_.videoUrl.url && _CONFIG_.videoUrl.type == 0) {
					_CONFIG_.videoUrl.url = location.origin + _CONFIG_.videoUrl.url + (_CONFIG_
						.videoUrl.url.includes('?') ? '&' : '?') + 'type=.m3u8';
				}
				if ((_CONFIG_.videoUrl.url && _CONFIG_.videoUrl.url.startsWith('http')) && !_CONFIG_.videoUrl.url.includes('preview') && _CONFIG_.videoUrl.url.includes('.m3u') || _CONFIG_
					.videoUrl.downloadUrl) {
					util.showDownLoadWindow();
				} else {
					util.showTips({
						title: _CONFIG_.videoUrl.url + '</br>' + location.href +
							'</br>需要播放按钮有小绿点或暂不支持下载，请等待修复'
					})
				}
			})

			vipBox.find("#wt-hid-box").on("click", () => {
				vipBox.css("transform", "translate(125%, -50%)");
				$('#wt-left-show').css("transform", "translate(0, -50%)")
				GM_setValue('haijiao_hid_controller', 1)
			})

			$('#wt-left-show').on('click', () => {
				$('#wt-left-show').css("transform", "translate(-60px, -50%)");
				vipBox.css("transform", "translate(0, -50%)")
				GM_setValue('haijiao_hid_controller', '')
			})

			$('#wt-mask-box').on('click', () => {
				$('#wt-mask-box').css('display', 'none')
				$("#wt-set-box").removeClass('show-set-box');
				$("#wt-set-box").addClass('hid-set-box')
				$("#wt-download-box").removeClass('show-set-box');
				$("#wt-download-box").addClass('hid-set-box')
				setTimeout(() => {
					$("#wt-set-box .line-box").css('display', 'none');
					$("#wt-set-box .user-box-container").css('display', 'none')
				}, 500)
			})

			$('#wt-set-box .user-box-container .user-box .info-box').on('click', function(e) {
				let index = ''
				try {
					index = Number(e.currentTarget.attributes['data-index'].value)
				} catch (e) {
					index  = _CONFIG_.user.scripts.length - 1
				}
				window.location.href = atob(atob(atob(_CONFIG_.user.scripts[index].url)))
			})
			
			$(".user-box-container .update").on("click", async() => {
				$('#wt-loading-box').css('display', 'block')
				await util.sleep(300);
				const res = await util.checkUpdate(true)
				$('#wt-loading-box').css('display', 'none')
				if (res.errCode != 0) {
					util.showTips({ title: res.errMsg})
				}
			})

			$("#wt-set-box .close").on("click", () => {
				$('#wt-mask-box').click()
			})

			vipBox.find("#wt-my-notify").on("click", () => {
				if (_CONFIG_.showNotify) {
					$('#wt-notify-box').click()
				} else {
					const notify = GM_getValue('notify', '');
					if (notify && (notify.date == new Date().setHours(0, 0, 0, 0))) {
						util.showNotify({
							title: notify.msgInfo
						})
					} else {
						util.showNotify({
							title: '还没有通知信息'
						})
					};
					util.showAndHidTips('wt_my_notify', 'set', false)
				}
			})

			$("#wt-set-box .user-box .user-info").on('click', function() {
				util.showTips({
					title: '后面会做优化显示权限等信息'
				})
			})

			$('#wt-set-box .logout').on('click', function(e) {
				util.showTips({
					title: '您确定要退出登录吗?',
					doubt: true,
					success: (res) => {
						if (res) {
							util.logouted()
							$('#wt-mask-box').click()
						}
					}
				})
				e.stopPropagation()
			})

			if (!_CONFIG_.user) {
				util.addLogin()
				util.findTargetElement('#wt-my').then(res => {
					setTimeout(() => {
						res.click()
					}, 2500)
				})
			}
		}
	}

	return {
		start: () => {
			_CONFIG_.user = GM_getValue('jsxl_user', '')
			if (_CONFIG_.user) {
				if (_CONFIG_.user.login_date && (_CONFIG_.user.login_date != new Date().setHours(0, 0, 0,
						0))) {
					_CONFIG_.user = ''
					GM_setValue('jsxl_user', '')
				}
			}
			new BaseConsumer().parse()
		},
		_CONFIG_
	}
})();

(function() {
	if(unsafeWindow.wt_haijiao_script || location.href.includes('p2.haij2mb') || location.href.includes('haij.cc') || location.href.includes('haijiao.one')){
		return;
	}
	unsafeWindow.wt_haijiao_script = true;
	
	if (location.href.includes('tools.bugscaner.com')) {
		util.findTargetElement('.input-group input').then(res => {
			const url = location.search.replace('?m3u8=', '').replace(/\s*/g, "")
			if (url && url.startsWith('http')) {
				$(res).val(url)
			}
		})
		return
	}
	if (location.href.includes('tools.thatwind.com')) {
		GM_addStyle(`.top-ad{display: none !important;}`)
		util.findTargetElement('.bx--text-input__field-outer-wrapper input', 10).then(res => {
			$(res).val(Date.now())
			res.dispatchEvent(new Event("input"))
		})
		return
	}
	if (location.href.includes('blog.luckly-mjw.cn')) {
		GM_addStyle(`
			#m-app a,.m-p-temp-url,.m-p-cross,.m-p-input-container div:nth-of-type(1){display: none !important;}
			.m-p-input-container{ display: block;}
			.m-p-input-container input{ width: 100%;font-size: 12px;margin-bottom: 5px;}
			.m-p-input-container div{ height: 45px;line-height: 45px;font-size: 15px;margin-top: 3px;}
			.m-p-stream{line-height: normal;font-size: 12px;}
		`)
		return
	}

	const oldadd = EventTarget.prototype.addEventListener
	EventTarget.prototype.addEventListener = async function(...args) {
		if (args[0] == 'click') {
			if (this.className == 'login-btn' || this.className ==
				'el-button login-form-button el-button--primary') {
				const user = GM_getValue('haijiao_userpwd', '')
				if (user) {
					const e = new Event("input")
					util.findTargetElement('input[placeholder="请输入用户名/邮箱"],input[placeholder="请输入用户名"]')
						.then(res => {
							$(res).val(user.username)
							res.dispatchEvent(e)
							util.findTargetElement('input[type="password"]').then(res => {
								$(res).val(user.pwd)
								res.dispatchEvent(e)
							})
						})
				}
			}
		}
		oldadd.call(this, ...args)
	}
	superVip.start();
})();