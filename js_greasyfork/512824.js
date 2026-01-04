// ==UserScript==
// @name         长沙医学院教务系统评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  长医评教
// @author       BILL
// @match        *://*/jsxsd/xspj/xspj_edit.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512824/%E9%95%BF%E6%B2%99%E5%8C%BB%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/512824/%E9%95%BF%E6%B2%99%E5%8C%BB%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
var url = location.pathname;
var evaluationMainPage = "/jsxsd/xspj/xspj_edit.do";

if (url.indexOf(evaluationMainPage) !== -1) {
    const idsToCheck = [
        "pj0601id_1_1", "pj0601id_2_2", "pj0601id_3_1",
        "pj0601id_4_1", "pj0601id_5_2", "pj0601id_6_1",
        "pj0601id_7_1", "pj0601id_8_1", "pj0601id_9_2",
        "pj0601id_10_1", "pj0601id_11_2", "pj0601id_12_1",
        "pj0601id_13_1", "pj0601id_14_1", "pj0601id_15_1",
        "pj0601id_16_2", "pj0601id_17_1"
    ];

    idsToCheck.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.checked = true;
        }
    });

    const resultElement = document.querySelector('#jynr');
    if (resultElement) {
        resultElement.textContent = "暂无";
    }

    const submitButton = document.querySelector('#tj');
    if (submitButton) {
        submitButton.click();}
}
