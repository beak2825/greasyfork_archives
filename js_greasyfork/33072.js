// ==UserScript==
// @name        培训机构提醒
// @namespace   xx_nova
// @description 招聘网站培训机构提醒
// @include     http*://www.lagou.com/jobs/*
// @include     http*://www.lagou.com/gongsi/*
// @include     http*://*.huibo.com/*.html*
// @include     http*://*.zhaopin.com/*.htm*
// @exclude     http*://special.zhaopin.com/*
// @include     http*://www.liepin.com/job/*.shtml*
// @include     http*://www.liepin.com/company/*
// @include     http*://jobs.51job.com/*.html*
// @include     http*://*.58.com/*.shtml*
// @exclude     http*://*.58.com/job.shtml*
// @include     /^https?://qy\.58\.com/\d+/*/

// @version     1.2
// @grant       GM_getResourceText
// @resource    dadi_pxjg_page_url https://www.xudadi.com/android/340.html
// @downloadURL https://update.greasyfork.org/scripts/33072/%E5%9F%B9%E8%AE%AD%E6%9C%BA%E6%9E%84%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/33072/%E5%9F%B9%E8%AE%AD%E6%9C%BA%E6%9E%84%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
(function () {
    var dadi_pxjg_page = GM_getResourceText('dadi_pxjg_page_url');
    var filter_words = [
        '重庆市', '重庆', '北京市', '北京', '上海市', '上海', '深圳市', '深圳',
        '网络', '科技', '信息', '技术', '咨询', '计算机', '系统', '软件', '工程',
        '地产', '物业', '广告', '文化', '传播', '传媒', '教育', '交流', '服务',
        '商贸', '商务', '人才', '商业', '管理', '股份', '发展', '有限',
        '实业', '集团','分公司', '公司',
        '招聘信息', '招聘',
        '（', '）', '(', ')',
    ];
    var year = new Date().getFullYear();
    var websites = ['lagou.com', 'huibo.com', 'zhaopin.com', 'liepin.com',
                    '51job.com', '58.com'];
    var website = document.domain;
    for (var i=0; i<websites.length; i++) {
        if (website.indexOf(websites[i]) != -1) {
            website = websites[i];
            break;
        }
    }
    var gongsi = "";
    
    switch(website)
    {
        case "lagou.com":
            if(document.URL.indexOf("gongsi") != -1){
                gongsi = document.title.split('_') [0].split('【') [1];
            } else if(document.URL.indexOf("jobs") != -1){
                gongsi = document.title.split('-') [1];
            }
            break;
        case "huibo.com":
            if(document.URL.indexOf("qiye") != -1){
                gongsi = document.title.split('_') [0];
            } else {
                gongsi = document.title.split('_') [1].split('-') [0];
            }
            break;
        case "zhaopin.com":
            if(document.URL.indexOf("company") != -1){
                gongsi = document.title.split('_') [0];
            } else if(document.URL.indexOf("jobs") != -1){
                gongsi = document.title.split('】') [0].split('_') [1];
            }
            break;
        case "liepin.com":
            filter_words.push(year, '最新');
            if(document.URL.indexOf("company") != -1){
                gongsi = document.title.split('】') [0].split('【') [1];
            } else if(document.URL.indexOf("job") != -1){
                gongsi = document.title.split('】') [1].split('-') [0];
            }
            break;
        case "51job.com":
            if(document.URL.indexOf("all") != -1){
                gongsi = document.title.split('【') [1].split('_') [0];
            } else {
                gongsi = document.title.split('】') [0].split('_') [2];
            }
            break;
        case "58.com":
            filter_words.push('2017', year, '最新');
            if(document.URL.indexOf(".shtml") != -1){
                gongsi = document.title.split('_') [1].split(' ') [0];
            } else {
                gongsi = document.title.split('_') [0];
            }
            break;
        default:
            return;
    }
    
    for (var j = 0; j < filter_words.length; j++) {
        gongsi = gongsi.replace(filter_words[j], '');
    }
    if (gongsi !== '' && dadi_pxjg_page.indexOf(gongsi) != - 1) {
        alert('小心！可能是培训机构！详情：https://www.xudadi.com/android/340.html');
    }
}) ();
