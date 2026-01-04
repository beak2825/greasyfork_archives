// ==UserScript==
// @name         PT站自动签到脚本
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在您浏览器页面时，自动为您签到.
// @author       小明
// @match        https://hdtime.org/*
// @match        https://pt.soulvoice.club/torrents.php
// @match        https://pt.btschool.club/*
// @match        https://hdfans.org/*
// @match        https://www.pttime.org/*
// @icon         https://www.xbext.com/icons/favicon-16x16.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455341/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455341/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
//------------------------------------------------------------------------------------------start
	console.log('目前已支持NexusPHP框架网站');
	/**
	 * 修改提示的位置(textPosition)
	 * 0右下角
	 * 1左下角
	 * 2左上角
	 * 3右上角
	 */
	window.textPosition = 0;


	//在这里添添加要签到的网站名称,和签到url,上面match添加的是可以到看签到按钮的页面
	var textUrl = '{ "sites" : [' +
		'{ "name":"hdtime" , "url":"https://hdtime.org/attendance.php" },' +
		'{ "name":"soulvoice" , "url":"https://pt.soulvoice.club/attendance.php" },' +
		'{ "name":"hdfans" , "url":"https://hdfans.org/attendance.php" },' +
		'{ "name":"pttime" , "url":"https://www.pttime.org/attendance.php" },' +
		'{ "name":"btschool" , "url":"https://pt.btschool.club/index.php?action=addbonus" } ]}';

	//console.log(textUrl);
	var obj = JSON.parse(textUrl);
	GM_setValue('sites', obj);
	//console.log(obj);

	var url = window.location.host;
	if(url.indexOf('hdtime') != -1){
		signInfo('hdtime')
	} else if(url.indexOf('soulvoice') != -1){
		signInfo('soulvoice')
	} else if(url.indexOf('btschool') != -1){
		signInfo('btschool')
	} else if(url.indexOf('hdfans') != -1){
		signInfo('hdfans')
	}else{
		// 通用模式1 , 在match添加站点就可以了
		if(document.getElementById('footer')){
			var str = document.getElementById('footer').innerHTML;
			if(str!='' && str !=null && str.indexOf('NexusPHP') != -1){
				console.log('超强模式1 正在签到');
				url = location.protocol +'//' +location.host + '/attendance.php';
				signInfoOriginal(location.host,url);
			}
		}

	}



})();


//--------------函数--------------------start

function geturl(str){
	let obj = GM_getValue('sites');
	obj.sites[1].url;obj.sites[1].name;
	let ulist = obj.sites;
	let len = ulist.length;
	for(let s=len-1;s>=0;s--){
		if(ulist[s].name == str){
			let res = [ulist[s].name,ulist[s].url];
			return res;
		}
	}
	return [];
}

function signInfo(cname){
	var cobj = geturl(cname);
	var name = cobj[0];
	var url = cobj[1];
	signInfoOriginal(name,url);
}

function signInfoOriginal(name,url) {
	//下边的不要动
	var key = 'ptSignDate_2023'+name;
	console.log('key='+key);
	if (GM_getValue(key) == new Date().getDay()){
		//console.log(response);
		console.log(name + ' Signed in.');
		return;
	}

    var xml = new XMLHttpRequest();
    xml.open("GET", url);
    xml.withCredentials = true;
    xml.send();
    xml.onload = e => {
        //var response = JSON.parse(e.currentTarget.response);
        //showTips(response, textPosition
		var textPosition = window.textPosition;
		showTips(name, textPosition);
        GM_setValue(key, new Date().getDay());
		console.log(name + ' sign in succeeded.');
    }
}

/**
 * showTips方法与anim是一个小小的提示框模组
 */

/**
 * code from hsmyldk
 * position
 * 0右下角
 * 1左下角
 * 2左上角
 * 3右上角
 * @param {提示文本} text
 * @param {文本位置} position
 * @param {边框颜色} color
 */
function showTips(text, position, color) {
    if (color == null) color = '#00c8f5';
    if (position == null) position = 0;
    var Msg = document.createElement('div');
    Msg.id = "hsmyldk_signInBox";
    Msg.height = '50px';
    Msg.width = '300px';
    Msg.innerHTML = text;
    var styleText = 'z-index: 1000;background-color: #fff;height: 40px;width: 200px;position: fixed;border-top: 2px solid ' + color + ';border-bottom: 2px solid ' + color + ';text-align: center;font-weight: bold;font-size: 16px;' + (text.length > 10 ? 'line-height: 20px;' : 'line-height: 40px;');
    switch (position) {
        case 1:
            {
                styleText += 'padding-right: 5px;left: -210px;bottom: 230px;border-radius:0 18px 18px 0;border-right: 2px solid ' + color + ';';
                break;
            }
        case 2:
            {
                styleText += 'padding-right: 5px;left: -210px;top: 230px;border-radius:0 18px 18px 0;border-right: 2px solid ' + color + ';';
                break;
            }
        case 3:
            {
                styleText += 'padding-left: 5px;right: -210px;top: 230px;border-radius: 18px 0 0 18px;border-left: 2px solid ' + color + ';';
                break;
            }
        default:
            {
                styleText += 'padding-left: 5px;right: -210px;bottom: 230px;border-radius: 18px 0 0 18px;border-left: 2px solid ' + color + ';';
            }

    }
    Msg.style = styleText;
    document.body.appendChild(Msg);
    anim(document.getElementById('hsmyldk_signInBox'), false);
}

/**
 * code from hsmyldk
 * @param {动画元素} item
 */
function anim(item) {
    /**
     * LorR
     * true 左
     * false 右
     */
    var LorR = false;
    var direction = true;
    var i = item.style.right;
    if (i == null || i == NaN || i.length == 0) {
        i = item.style.left;
        LorR = true;
    }
    if (i == null || i == NaN || i.length == 0) {
        console.log('你有问题');
        return;
    }
    try {
        if (LorR) {
            $(item).animate({ left: '0px' }, 500);
            setTimeout(() => {
                $(item).animate({ left: '-210px' }, 500);
            }, 5500);
        } else {
            $(item).animate({ right: '0px' }, 500);
            setTimeout(() => {
                $(item).animate({ right: '-210px' }, 500);
            }, 5500);
        }
        return;
    } catch (error) {
        console.log('不支持jQuery')
        console.log(e);
    }
    i = parseInt(i.substring(0, i.length - 2));
    var o = i;
    var width = item.style.width;
    width = parseInt(width.substring(0, width.length - 2)) + 20;
    /**
     * o
     * 如果>0就让它=0,i--
     * 如果=0就让它<0,i--
     * 如果<0就让它=0,i++
     */
    if (i < 0) direction = false;
    var interval = setInterval(() => {
        if (LorR) {
            item.style.left = (direction ? --i : ++i) + 'px';
        } else {
            item.style.right = (direction ? --i : ++i) + 'px';
        }
        if (o == 0) {
            if (Math.abs(i) == width) {
                if (interval != null) clearInterval(interval);
                item.remove();
            }
        } else {
            if (i == 0) {
                if (interval != null) clearInterval(interval);
                setTimeout(() => {
                    anim(item);
                }, 5000);
            }
        }
    }, 1);
}

//--------------函数--------------------end