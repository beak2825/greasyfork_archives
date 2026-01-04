// ==UserScript==
// @name         UESTC一键健康打卡报体温
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  登录后点击研究生健康系统即可完成打卡
// @author       Ravenclaw
// @match        http*://eportal.uestc.edu.cn/jkdkapp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420332/UESTC%E4%B8%80%E9%94%AE%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E6%8A%A5%E4%BD%93%E6%B8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/420332/UESTC%E4%B8%80%E9%94%AE%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E6%8A%A5%E4%BD%93%E6%B8%A9.meta.js
// ==/UserScript==

/*
0.3: 修复健康打卡wid
0.4: 学校改成https了，更新一下
*/


function get_today() {
	let d = new Date();
    let y = String(d.getFullYear())

    let m = String(d.getMonth()+1);
    if (m.length == 1)
        m = '0' + m;

    let day = String(d.getDate());
    if (day.length == 1)
        day = '0' + day;

    return `${y}-${m}-${day}`;

}


function uuid() {
    return '求实求真xxxxxxxx4xxxyxxxxxxxxxxx大气大为'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function encode_params(params) {
	if (params.length == 0) return '';

	let fields = [];
	for (let k in params) {
		fields.push(`${k}=${params[k]}`);
	}
	return encodeURI(fields.join('&'));
}

function request_post(url, data, headers={}) {
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest()
		xhr.open('POST', url);
		for (let key in headers) {
			xhr.setRequestHeader(key, headers[key])
		}
		xhr.onerror = function() {
			reject(xhr.response);
		}
		xhr.onload = function() {
			if (xhr.status == 200) {
				resolve(xhr.responseText)
			} else {
				reject(xhr.response);
			}
		}
		xhr.send(data);
	})
}

function request_get(url, headers={}) {
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', url)
		for (let key in headers) {
			xhr.setRequestHeader(key, headers[key])
		}
		xhr.onerror = function() {
			reject(xhr.response);
		}
		xhr.onload = function() {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(xhr.response);
			}
		}
		xhr.send();
	})
}

// 获取上次健康打卡数据，其中有用户信息
function get_last_checkin_info(stu_id) {
	// TODO, cache the user info to avoid redundant requests
	return new Promise(function(resolve, reject) {
		// 通过访问上一次健康打卡页面获取用户信息
		let url = '//eportal.uestc.edu.cn/jkdkapp/sys/lwReportEpidemicStu/modules/dailyReport/getMyDailyReportDatas.do'

		let data = {
			'USER_ID':stu_id,
			'pageSize':1,
			'pageNumber':1
		}
		let header = {
			'Content-Type':'application/x-www-form-urlencoded'
		}
		request_post(url, encode_params(data), header)
			.then(function(resp) {
				let info = JSON.parse(resp)
				console.log('got user info')
				resolve(info['datas']['getMyDailyReportDatas']['rows']['0'])
			})
			.catch(function(err) {
				reject(err)
			})
	});
}

function temp_checkin(time, stu_info) {
	let url = '//eportal.uestc.edu.cn/jkdkapp/sys/lwReportEpidemicStu/modules/tempReport/T_REPORT_TEMPERATURE_YJS_SAVE.do'
	let temp_form = {
		'WID': '',
		'CZZ': '',
		'CZZXM': '',
		'CZRQ': '',
		'USER_ID': stu_info['USER_ID'],
		'USER_NAME': stu_info['USER_NAME'],
		'DEPT_CODE': stu_info['DEPT_CODE'],
		'DEPT_NAME': stu_info['DEPT_NAME'],
		'NEED_DATE': get_today(),
		'DAY_TIME': time,
		'TEMPERATURE': 36.5
	}
	let header = {'Content-Type':'application/x-www-form-urlencoded'}
	request_post(url, encode_params(temp_form), header)
		.then(function(resp) {
			console.log(`temp ${time} success`);
		})
		.catch(function(err) {
			console.log(`temp ${time} failed!!!`);
		})
}

function temp_checkin_all(stu_id) {
	get_last_checkin_info(stu_id)
		.then(function(info) {
			for (let i = 1 ; i <= 3 ; i++) {
				temp_checkin(i, info)
			}
		})
		.catch(function(err) {
			console.log('error getting user info for ' + stu_id)
			console.log(err)
		})
}

function health_checkin(stu_id) {
	let url = '//eportal.uestc.edu.cn/jkdkapp/sys/lwReportEpidemicStu/modules/dailyReport/T_REPORT_EPIDEMIC_CHECKIN_YJS_SAVE.do'
	get_last_checkin_info(stu_id)
		.then(function(info) {
			info['NEED_CHECKIN_DATE'] = get_today()
			info['NEED_DATE'] = get_today()
			info['CZRQ'] = get_today();
			info['REMARK'] = '';
            info['WID'] = uuid();

			let header = {'Content-Type':'application/x-www-form-urlencoded'}
			request_post(url, encode_params(info), header)
				.then(function(resp) {
					console.log(resp)
					console.log('success checkin')
				})
				.catch(function(err) {
					console.log(err)
					console.log('failed to checkin')
				})
		})
		.catch(function(err) {
			console.log('error getting user info for ' + stu_id)
			console.log(err)
		})
}

// 检测是否已经打过卡了
function health_checkin_safe(stu_id) {
	get_last_checkin_info(stu_id)
		.then(function(info) {
			let entry = info.datas.getMyDailyReportDatas.rows[0];
			if (entry['NEED_DATE'] == get_today()) {
				// 打过卡了
				console.log('already checked in. abort')
			} else {
				// 没打卡
				health_checkin(stu_id);
			}
		})
		.catch(function(err) {
			console.log('failed to checkin')
		})
}

function get_stu_id() {
    return new Promise(function(resolve, reject){
        request_get('//eportal.uestc.edu.cn/jsonp/userDesktopInfo.json')
            .then(function(resp){
            let stu_info = JSON.parse(resp);
            console.log('user name: ' + stu_info.userName);
            resolve(stu_info.userId)
        }).catch(function(err){
            reject(err);
        });
    });
}

// TODO avoid re-checkin
(function() {
    'use strict';
    // 通过比较上次执行的日期，判断是否执行签到操作
    const lastCheckKey = 'uestc_last_checkin';
    let lastCheckin = localStorage.getItem(lastCheckKey)
    let today = get_today();

    if (lastCheckin == null || lastCheckin < today) {
        console.log('checkin')
        get_stu_id().then((stu_id) => {
            health_checkin(stu_id);
            temp_checkin_all(stu_id);
            localStorage.setItem(lastCheckKey, today);
        })
    } else {
        console.log('checked in. do nothing')
    }
})();