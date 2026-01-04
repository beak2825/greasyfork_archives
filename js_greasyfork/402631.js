// ==UserScript==
// @name        我的签到
// @namespace   Violentmonkey Scripts
// @match       *://*.zt.wps.cn/*
// @match       *://*.52pojie.cn/*
// @match       *://*.bbs.sunwy.org/*
// @grant       none
// @version     0.1
// @author      heham
// @description 我的签到集合
// @require     https://code.jquery.com/jquery-latest.min.js
// @require     https://unpkg.com/axios/dist/axios.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/fetch/3.0.0/fetch.min.js
// @downloadURL https://update.greasyfork.org/scripts/402631/%E6%88%91%E7%9A%84%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/402631/%E6%88%91%E7%9A%84%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var $ = $ || window.$
	//52pojie
    if(window.location.host=="www.52pojie.cn"){
        var qdimg = $("img[src$='qds.png']");
        if(qdimg) {
        $.get("https://www.52pojie.cn/home.php?mod=task&do=apply&id=2");
	    GM_log('sign');   
        }
    }

	//阳光网驿
	if(window.location.host=="bbs.sunwy.org"){
	    var qdimg = $("img[src$='qdtb.gif']");
        if(qdimg) {
        $.post("http://bbs.sunwy.org/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1&formhash=e1bf0290&qdxq=kx&qdmode=3&todaysay=&fastreply=0");
        GM_log('sign');
        }
	}
    //WPS会员签到
	if(window.location.host=="zt.wps.cn"){

exports.run = async function() {
var { status, data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/get_question', { maxRedirects: 0, validateStatus: s => true });
    if (status == 302) throw '需要登录';
    let answer = 1;
    for (let i = 0; i < data.data.options.length; i++) {
        let row = data.data.options[i];
        if (/WPS/.test(row)) {
            answer = i + 1;
            break;
        }
    }
    var { data } = await axios.post('https://zt.wps.cn/2018/clock_in/api/answer', { answer });
    if (data.result != 'ok') throw data.msg;
    var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/clock_in');
    if (data.msg == '已打卡') return '已打卡';
    if (data.msg == '不在打卡时间内') return '不在打卡时间内';
    if (data.result != 'ok') throw data.msg;
};

exports.check = async function() {
var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/sign_up?sid=0&from=&csource=');
    return data.msg == '已参加挑战' || data.result == 'ok';
};


	}
})();