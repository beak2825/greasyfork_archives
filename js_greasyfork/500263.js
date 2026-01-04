// ==UserScript==
// @name         jenkin branch check
// @namespace    http://tampermonkey.net/
// @version      2024-07-25-2
// @description  check produce branch
// @author       wkk
// @match        https://jenkins.fintopia.tech/job/WP/job/wms-build-deploy/build?delay=0sec
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fintopia.tech
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500263/jenkin%20branch%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/500263/jenkin%20branch%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Q("form:contains('RELEASE_BRANCH')").find("input[value='RELEASE_BRANCH']").next().blur(function() {
        let regex1 = new RegExp("^releases/wms_" + getNowFormatDate() + "$");
        if (regex1.test(this.value)) {
            this.style.border = '1px solid black';
            return;
        }
        this.style.border = '1px solid red';
        alert("请选择正确的发布分支");
    })
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