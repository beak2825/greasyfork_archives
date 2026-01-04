// ==UserScript==
// @name         去掉网站灰色背景！！！
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  实在受不了！于11月30日！支持百度贴吧、QQ、网易、微博、搜狐等待去背景灰色！
// @author       imzhi <yxz_blue@126.com>
// @match        https://*.baidu.com/*
// @match        https://www.qq.com/*
// @match        https://www.163.com/*
// @match        https://www.sohu.com/*
// @match        https://www.sina.com.cn/*
// @match        https://weibo.com/*
// @match        https://www.toutiao.com/*
// @match        https://www.hao123.com/*
// @match        https://www.taobao.com/*
// @match        https://www.jd.com/*
// @match        https://*.1688.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.zhihu.com/*2
// @match        https://www.ifeng.com/*
// @match        http*://www.265.com/*
// @match        http*://www.xinhuanet.com/*
// @match        http*://www.people.com.cn/*
// @match        https://www.huanqiu.com/*
// @match        https://www.cctv.com/*
// @match        https://www.eastmoney.com/*
// @match        http*://www.jrj.com.cn/*
// @match        https://www.thepaper.cn/*
// @match        https://www.youku.com/**
// @match        https://www.4399.com/*
// @match        https://*.58.com/*
// @match        https://www.autohome.com.cn/*
// @match        https://www.smzdm.com/*
// @match        https://www.12306.cn/*
// @match        https://www.tuniu.com/*
// @match        https://www.ctrip.com/*
// @match        https://pixso.cn/*
// @match        https://www.mgtv.com/*
// @match        https://v.qq.com/*
// @match        https://tv.sohu.com/*
// @match        https://youku.com/*
// @match        https://www.youku.com/*
// @match        http*://video.sina.com.cn/*
// @match        http*://www.bilibili.com/*
// @match        http*://www.eastday.com/*
// @match        https://www.hupu.com/*
// @match        https://www.miguvideo.com/*
// @match        https://www.dongqiudi.com/*
// @match        https://www.zhibo8.cc/*
// @match        http*://sports.sina.com.cn/*
// @match        https://36kr.com/*
// @match        http*://www.pconline.com.cn/*
// @match        https://www.pcpop.com/*
// @match        https://www.huxiu.com/*
// @match        https://www.it168.com/*
// @match        https://www.onlinedown.net/*
// @match        http*://www.tgbus.com/*
// @match        http*://www.changyou.com/*
// @match        https://game.qq.com/*
// @match        http*://game.163.com/*
// @match        http*://www.7k7k.com/*
// @match        https://www.qcc.com/*
// @match        https://shenyang.zbj.com/*
// @match        https://www.chinaz.com/*
// @match        https://www.huaweicloud.com/*
// @match        https://www.xiaoe-tech.com/*
// @match        https://www.zhixi.com/*
// @match        https://www.yuque.com/*
// @match        https://www.teambition.com/*
// @match        https://worktile.com/*
// @match        https://www.csdn.net/*
// @match        https://juejin.cn/*
// @match        http*://www.chinaunix.net/*
// @match        https://www.imooc.com/*
// @match        https://www.icourse163.org/*
// @match        https://www.kdocs.cn/*
// @match        https://www.aliyundrive.com/*
// @match        https://www.processon.com/*
// @match        https://*.gougucms.com/*
// @match        https://www.oschina.net/*
// @match        https://www.51job.com/*
// @match        https://www.zhaopin.com/*
// @match        https://www.chinahr.com/*
// @match        https://www.yingjiesheng.com/*
// @match        https://www.cjol.com/*
// @match        https://*.61.com/*
// @match        http*://www.91wan.com/*
// @match        https://www.9game.cn/*
// @match        https://www.2144.cn/*
// @match        https://www.37.com/*
// @match        https://www.lagou.com/*
// @match        https://www.liepin.com/*
// @match        https://you.163.com/*
// @match        https://www.xiaomiyoupin.com/*
// @match        https://www.suning.com/*
// @match        http*://www.dangdang.com/*
// @match        https://www.kaola.com/*
// @match        https://www.vmall.com/*
// @match        https://www.xcar.com.cn/*
// @match        https://www.pcauto.com.cn/*
// @match        https://www.gome.com.cn/*
// @match        https://www.tmall.com/*
// @match        https://www.vip.com/*
// @match        https://www.hihonor.com/cn/*
// @match        http*://www.cheshi.com/*
// @match        https://cnfol.com/*
// @match        https://www.hexun.com/*
// @match        https://mail.qq.com/*
// @match        https://mail.10086.cn/*
// @match        https://*.dxy.cn/*
// @match        https://www.haodf.com/*
// @match        http*://www.39.net/*
// @match        https://cloud.tencent.com/*
// @match        https://music.163.com/*
// @match        https://y.qq.com/*
// @match        https://www.kugou.com/*
// @match        https://music.migu.cn/*
// @match        https://music.91q.com/*
// @match        https://book.qq.com/*
// @match        https://www.jjwxc.net/*
// @match        http*://www.kuwo.cn/*
// @match        https://www.readnovel.com/*
// @match        https://www.hongxiu.com/*
// @match        http*://www.zongheng.com/*
// @match        https://www.qidian.com/*
// @match        https://www.alipay.com/*
// @match        https://*.hujiang.com/*
// @match        https://*.ganji.com/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/455768/%E5%8E%BB%E6%8E%89%E7%BD%91%E7%AB%99%E7%81%B0%E8%89%B2%E8%83%8C%E6%99%AF%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/455768/%E5%8E%BB%E6%8E%89%E7%BD%91%E7%AB%99%E7%81%B0%E8%89%B2%E8%83%8C%E6%99%AF%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('@charset utf-8; ._imzhi_remove_gray_bg { filter: none !important; }');

    addClass(document.querySelector('html'), '_imzhi_remove_gray_bg');
    addClass(document.querySelector('body'), '_imzhi_remove_gray_bg');

    if (location.host === 'weibo.com') {
        addClass(document.querySelector('.grayTheme'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.baidu.com') {
        addClass(document.querySelector('.skin-gray-event'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.sina.com.cn') {
        GM_addStyle('@charset utf-8; body * { filter: none !important; }');
    }

    else if (location.host === 'www.iqiyi.com') {
        setTimeout(() => {
            addClass(document.querySelector('body .gray'), '_imzhi_remove_gray_bg');
        }, 300);
    }

    else if (location.host === 'www.jrj.com.cn') {
        GM_addStyle('@charset utf-8; body * { filter: none !important; }');
    }

    else if (location.host === 'www.thepaper.cn') {
        setTimeout(() => {
            addClass(document.querySelector('html'), '_imzhi_remove_gray_bg');
        }, 300);
    }

    else if (location.host === 'www.mgtv.com') {
        GM_addStyle('@charset utf-8; .page-gray .g-page-channel * { filter: none !important; }');
    }

    else if (location.host === 'v.qq.com') {
        setTimeout(() => {
            addClassAll(document.querySelectorAll('.gray-style-remembrance'), '_imzhi_remove_gray_bg');
        }, 600);
    }

    else if (location.host === 'www.miguvideo.com') {
        addClass(document.querySelector('#sport-channel'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.dongqiudi.com') {
        addClass(document.querySelector('.container'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.tgbus.com') {
        addClass(document.querySelector('#app > .home'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.hexun.com') {
        GM_addStyle('@charset utf-8; div { filter: none !important; }');
    }

    else if (location.host === 'www.cheshi.com') {
        setTimeout(() => {
            document.querySelector('html').style.filter = null;
        }, 300);
    }

    else if (location.host === 'www.jjwxc.net') {
        GM_addStyle('@charset utf-8; body * { filter: none !important; }');
    }

    else if (location.host === 'y.qq.com') {
        addClass(document.querySelector('#app'), '_imzhi_remove_gray_bg');
    }

    else if (location.host === 'www.kugou.com') {
        GM_addStyle('@charset utf-8; .mainPage * { filter: none !important; }');
    }

    else if (location.host === 'www.kuwo.cn') {
        GM_addStyle('@charset utf-8; .gray { filter: none !important; }');
    }

    else if (location.host === 'music.91q.com') {
        GM_addStyle('@charset utf-8; #__layout div { filter: none !important; }');
    }

    else if (location.host.match(/\.ganji\.com$/)) {
        setTimeout(() => {
            addClass(document.querySelector('.home-container'), '_imzhi_remove_gray_bg');
        }, 300);
    }

    function removeClass(ele,cName) {
        var arr1 = ele.className.split(' ');
        var arr2 = cName.split(" ");
        for(var i=0;i<arr2.length;i++)for(var j=arr1.length-1;j>=0;j--)(arr2[i]===arr1[j])&&arr1.splice(j,1)
        ele.className = arr1.join(" ")
    }

    function addClass(ele,cName) {
        console.log('addClassaddClassaddClass', ele);
        var arr = ele.className.split(' ').concat(cName.split(" "));
        for(var i=0;i<arr.length;i++){
            for(var k=arr.length-1;k>i;k--){
                (arr[k]==="")&&arr.splice(k,1);
                (arr[i]===arr[k])&&arr.splice(k,1);
            }
        }
        ele.className = arr.join(" ");
    }

    function addClassAll(ele_arr, cName) {
        console.log('addClassAlladdClassAlladdClassAll', ele_arr);
        for (let ele of ele_arr) {
            addClass(ele, cName);
        }
    }
})();