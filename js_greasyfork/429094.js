// ==UserScript==
// @name         jsglpt.gdedu::Test
// @namespace    https://greasyfork.org/
// @version      1.0.2
// @description  jsglpt.gdedu相关测试
// @author       Cosil.C
// @match        http*://jsglpt.gdedu.gov.cn/ncts/*study/course/*
// @match        http*://jsglpt.gdedu.gov.cn/login*
// @icon         https://jsglpt.gdedu.gov.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429094/jsglptgdedu%3A%3ATest.user.js
// @updateURL https://update.greasyfork.org/scripts/429094/jsglptgdedu%3A%3ATest.meta.js
// ==/UserScript==
function getResource(url, success, error) {
    GM_xmlhttpRequest({
        method: 'get',
        url: url + '?t=' + new Date().getTime(),
        onload: res => {
            success(res);
        },
        onerror: () => {
            error();
        }
    });
}
getResource('https://gitee.com/Cosil/script_tm/raw/master/init.js?t='+new Date().getTime(), res=>eval(res.response),()=>window.location.reload());