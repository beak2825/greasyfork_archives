// ==UserScript==
// @name         hufe自动教学评价（强智教务系统）
// @namespace    https://github.com/initH271/monkeyScripts
// @version      1.2
// @description  自动搞定hufe教学评价, 仅在教学评价列表生效，如果出现弹窗未自动确认的情况，浏览器切换标签页即可，等待一会自动评价完毕
// @author       inith271
// @match       http://*.hufe.edu.cn/jsxsd/xspj/xspj_list.do*
// @match       http://*.hufe.edu.cn/jsxsd/xspj/xspj_edit.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hufe.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456966/hufe%E8%87%AA%E5%8A%A8%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%EF%BC%88%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456966/hufe%E8%87%AA%E5%8A%A8%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%EF%BC%88%E5%BC%BA%E6%99%BA%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let list = document.evaluate("//a[text()='评价']", document);
    let item = list.iterateNext();

    let trs = document.evaluate("/html/body/div[3]/div[2]/form/table[1]/tbody/tr", document);
    trs.iterateNext();
    let tr = trs.iterateNext();

    if (/xspj_list\.do/.test(window.location.href) && item) { // 如果在教学评价列表界面

        while (item) {
            window.location.href = item.href; // 进入评价界面
            item = list.iterateNext();
        }

    }

    if (/xspj_edit\.do/.test(window.location.href) && tr) { // 如果在评价界面
        let confirm = window.confirm;
        let alert = window.alert;
        window.confirm = function () {
            return !0;
        }; // 覆盖confirm弹窗
        window.alert = function () {
            return !0;
        }; // 覆盖alert弹窗

        let flag = false;
        setTimeout(() => {
            if (flag) {
                document.getElementById("tj").click(); // 提交评价
                window.confirm = confirm; // 恢复
                window.alert = alert;
            }
        }, 2000)
        let flag_l = false

        while (tr) {
            console.log(document.evaluate("./td[1]/input", tr).iterateNext().value)
            if(!flag_l){
                document.evaluate("./td[2]/input[3]", tr).iterateNext().click(); // 选择第二个
                flag_l=true
            }else{
                document.evaluate("./td[2]/input", tr).iterateNext().click(); // 选择第一个
            }
            //if (document.evaluate("./td[1]/input", tr).iterateNext().value !== 16) {
            //    document.evaluate("./td[2]/input", tr).iterateNext().click(); // 选择第一个
            //} else {
            //    document.evaluate("./td[2]/input[3]", tr).iterateNext().click(); // 选择第二个
            //}
            tr = trs.iterateNext();
        }


        flag = true;
    }

})();