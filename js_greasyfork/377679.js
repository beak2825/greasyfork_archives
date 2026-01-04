// ==UserScript==
// @name         自动签到(个人自用）
// @version      0.1.0
// @description  乱七八糟的网站签到。
// @author       XXXX
// @match        *://*hdsky.me/*
// @match        *://www.smzdm.com/
// @match        *://youyun666.com/user
// @match        *://xddlcsy.com/user
// @match        *://rabbitpro.net/user
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/246564
// @downloadURL https://update.greasyfork.org/scripts/377679/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/377679/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%28%E4%B8%AA%E4%BA%BA%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cur_url = window.location.href;
    var btn = null;
    //alert(btn.text);
    //获取ID>>getElementById
    //获取class>>getElementsByClassName，class一个html页面可能重复，所以是数组
    //什么值得买
    if (cur_url.indexOf("www.smzdm.com") != -1) {
        btn = document.getElementsByClassName('J_punch')[0];
        //判断是否已经签到
        if (btn.text == "签到领奖") {
            btn.click();
        }
    }

    //hdsky.me 有验证码废弃
    /*
    if (cur_url.indexOf("hdsky.me") != -1) {
        btn = document.getElementById('showup');
        //判断是否已经签到
        if (btn.text == "签到") {
            btn.click();
        }
    }
    */

    //梯子网站
    if (cur_url.indexOf("rabbitpro") != -1) {
        //btn = document.getElementById('checkin-div');
        btn = document.getElementsByClassName('btn btn-icon icon-left btn-primary')[0];
        //判断是否已经签到
        if (btn.text == " 每日签到") {
            btn.click();
        }
    }
    if (cur_url.indexOf("xddlcsy") != -1) {//rabbitpro副域名
        //btn = document.getElementById('checkin-div');
        btn = document.getElementsByClassName('btn btn-icon icon-left btn-primary')[0];
        //判断是否已经签到
        if (btn.text == " 每日签到") {
            btn.click();
        }
    }
    //v2ex签到，
    if (cur_url.indexOf("v2ex.com/mission/daily") != -1) {
		btn = document.getElementsByClassName('super normal button')[0];
		//判断是否已经签到
		if (btn.value == "领取 X 铜币") {
			btn.click();
		}
    }

})();