// ==UserScript==
// @name         教师学习平台刷课
// @namespace    http://tampermonkey.net/
// @version      2023-12-27
// @description  教师学习平台刷课，跳过弹窗
// @author       aizhaiyu
// @match        *://cas.study.bcvet.com.cn/proj/studentwork/study.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bcvet.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483221/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/483221/%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

function override() {
    console.log("脚本执行成功");
    this.openTishi = function openTishi(second) {
        ;
        if (second == randomTime)
        {
            console.log("跳过成功");
            updateStudyTime(0);
            setRandomTipTime();
        }
    }
}

window.addEventListener('load', function() {
    setTimeout(override, 5000);
});
