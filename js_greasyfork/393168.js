// ==UserScript==
// @name         微信公众平台文本修改
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  还需要完善，点击提交审核按钮时，提示需要更新版本号，或者判断只要是艺考要轻松小程序，直接链接到轻松艺考网站，在版本号基础上+1
// @author       Green_book
// @match        https://www.baidu.com/s?wd=Tampermonkey+%E6%80%8E%E4%B9%88%E5%86%99%E8%84%9A%E6%9C%AC&rsv_spt=1&rsv_iqid=0xe64e872700715b21&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=&tn=baiduhome_pg&ch=&rsv_enter=1&rsv_dl=ib&inputT=5702
// @grant        none
// @include      *://mp.weixin.qq.com/*
//// @include      *://mp.weixin.qq.com/wxamp/statistics/ontime?token=*
//// @include      *://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=*
// @downloadURL https://update.greasyfork.org/scripts/393168/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E6%96%87%E6%9C%AC%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/393168/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E6%96%87%E6%9C%AC%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 浏览器内容可编辑
    //document.body.contentEditable="true"

    if (location.pathname === '/wxamp/wacodepage/getcodepage') {
        alert("发版的时候要更新版本号！！！");
        setTimeout(()=>{
            document.getElementsByClassName('mod_default_hd online_version')[0].innerText
                = document.getElementsByClassName('mod_default_hd online_version')[0].innerText.replace('线上版本' ,'线上版本（发版前需要将版本号+1，切记！！！）');
        },1500)
    };

    if (location.pathname === '/wxamp/statistics/ontime') {
        //.replace('pages/index/main.html' ,'小程序首页')
        //.replace('pages/location/main.html' ,'完善信息')
        //.replace('pages/guide/test/main.html' ,'指南首页')
        //.replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
        //.replace('pages/guide/info/main.html' ,'资讯页面')
        //.replace('pages/exam/queryResuilt/main.html' ,'查询成绩')
        //.replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
        //.replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）')
        //.replace('pages/guide/h5Trans/buy/main.html' ,'购买页面')
        //.replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）')
        setTimeout(()=>{
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[1].children[0].innerText
                = document.getElementsByClassName('table')[0].childNodes[1].childNodes[1].childNodes[0].innerText.replace('pages/index/main.html' ,'小程序首页')
                .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
                .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
                .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');

            var index2 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[2].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[2].children[0].innerText = index2;

            var index3 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[3].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[3].children[0].innerText = index3;

            var index4 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[4].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[4].children[0].innerText = index4;

            var index5 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[5].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[5].children[0].innerText = index5;

            var index6 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[6].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[6].children[0].innerText = index6;

            var index7 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[7].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[7].children[0].innerText = index7;

            var index8 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[8].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[8].children[0].innerText = index8;

            var index9 = document.getElementsByClassName('table')[0].childNodes[1].childNodes[9].children[0].innerText.replace('pages/index/main.html' ,'小程序首页')
            .replace('pages/location/main.html' ,'完善信息').replace('pages/guide/test/main.html' ,'指南首页').replace('pages/guide/h5transit/main.html' ,'H5页面（中转页面）')
            .replace('pages/guide/info/main.html' ,'资讯页面').replace('pages/exam/queryResuilt/main.html' ,'查询成绩').replace('pages/exam/infomation/main.html' ,'模拟考报名页面')
            .replace('pages/guide/tongk/main.html' ,'统考指南（H5进入）').replace('pages/guide/h5Trans/buy/main.html' ,'购买页面').replace('pages/guide/tkGuide/main.html' ,'统考指南（小程序进入）');
            document.getElementsByClassName('table')[0].childNodes[1].childNodes[9].children[0].innerText = index9;
        },1000)
};


})();