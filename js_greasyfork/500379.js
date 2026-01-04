// ==UserScript==
// @name         OA product branch check
// @namespace    http://tampermonkey.net/
// @version      2024-07-25-1
// @description  oa check
// @author       wkk
// @match        https://jenkins.fintopia.tech/view/Genius%20+%20BZB/job/WP/job/empower-build-deploy/build?delay=0sec
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fintopia.tech
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500379/OA%20product%20branch%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/500379/OA%20product%20branch%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Q("form:contains('RELEASE_BRANCH')").find("input[value='RELEASE_BRANCH']").next().blur(function() {
        let regex1 = new RegExp("^releases/lep_" + getNowFormatDate() + "$");
        if (regex1.test(this.value)) {
            this.style.border = '1px solid black';
            return;
        }
        this.style.border = '1px solid red';
        alert("请选择正确的发布分支");
    })
    //这种方法仅适用于单个的script标签
    //获取当前日期函数
    function getNowFormatDate() {
        let date = new Date(),
            year = date.getFullYear(), //获取完整的年份(4位)
            month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
            strDate = date.getDate() // 获取当前日(1-31)
        if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
        if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
        return `${year}${month}${strDate}`
    }
})();