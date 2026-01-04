// ==UserScript==
// @name         PT 站自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  PT 站自动签到-
// @author       iuroc
// @match        *://1ptba.com/*
// @match        *://52pt.site/*
// @match        *://pt.soulvoice.club/*
// @match        *://www.pttime.org/*
// @match        *://rousi.zip/*
// @match        *://hdpt.xyz/*
// @match        *://carpt.net/*
// @match        *://ptvicomo.net/*
// @match        *://hdfans.org/*
// @match        *://www.hdkyl.in/*
// @match        *://hdhome.org/*
// @match        *://raingfh.top/*
// @match        *://hdchina.org/*
// @match        *://pterclub.com/*
// @match        *://lemonhd.org/*
// @match        *://www.pthome.net/*
// @match        *://pt.btschool.club/*
// @match        *://www.hddolby.com/*
// @match        *://hdzone.me/*
// @match        *://hddisk.life/*
// @match        *://discfan.net/*
// @match        *://www.hdarea.co/*
// @match        *://hdcity.city/*
// @match        *://dhcmusic.xyz/*
// @match        *://totheglory.im/*
// @match        *://www.nicept.net/*
// @match        *://yingk.com/*
// @match        *://hdstreet.club/*
// @match        *://moecat.best/*
// @match        *://pt.hd4fans.org/*
// @match        *://www.haidan.video/*
// @match        *://hdtime.org/*
// @match        *://audiences.me/*
// @match        *://*.tjupt.org/*
// @match        *://*.oshen.win/*
// @match        *://*.sharkpt.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1ptba.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513324/PT%20%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/513324/PT%20%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 当日最新的键名
    const date = new Date()
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-qiandao`
    // 象岛专属，判断当日是否已经签到
    if (localStorage.getItem(key) == 'true' && location.hostname == 'ptvicomo.net') return
    // 52 PT 专属，防止多次刷新
    if (location.pathname == '/bakatest.php') return
    // 象岛专属，添加当日最新签到记录
    if (location.hostname == 'ptvicomo.net') {
        // 清除往日签到记录，准备添加当日最新签到记录
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.match(/^\d{4}-\d{1,2}-\d{1,2}-qiandao$/)) localStorage.removeItem(key)
        }
        localStorage.setItem(key, true)
    }
    [...document.querySelectorAll('a')].filter(e => e.textContent.match(/签到.魔力|每日签到/) && (!!(e.offsetParent) || location.hostname == 'ptvicomo.net')).forEach(e => e.click())
})();