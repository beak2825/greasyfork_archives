// ==UserScript==
// @name         广东省教师继续教育信息管理平台公需课刷课::jsglpt.gdedu
// @namespace    https://greasyfork.org/
// @version      2.01
// @description  广东省教师继续教育信息管理平台公需课刷课
// @author       Cosil.C
// @match        http*://jsglpt.gdedu.gov.cn/ncts/*study/course/*
// @match        http*://jsglpt.gdedu.gov.cn/login*
// @icon         https://jsglpt.gdedu.gov.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429479/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE%3A%3Ajsglptgdedu.user.js
// @updateURL https://update.greasyfork.org/scripts/429479/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E5%88%B7%E8%AF%BE%3A%3Ajsglptgdedu.meta.js
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
getResource('https://gitee.com/Cosil/script_tm/raw/master/init.js', res=>eval(res.response),()=>window.location.reload());