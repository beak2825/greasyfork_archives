// ==UserScript==
// @name         政务设计系统脚本
// @version      2.7
// @description  政务设计系统同步OA需求脚本
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfo_splitdetail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejy/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejy/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejy/demandbasicinfo_splitdetail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandchangeinfo/demandchangeinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandchangeinfo/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandchangeinfo/demandbasicinfo_splitdetail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejs/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejs/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejs/demandbasicinfo_splitdetail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandbasicinfo_splitdetail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanageznsb/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanageznsb/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanageznsb/demandbasicinfo_splitdetail?*
// @grant        none
// @namespace https://greasyfork.org/users/1047091
// @downloadURL https://update.greasyfork.org/scripts/492913/%E6%94%BF%E5%8A%A1%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492913/%E6%94%BF%E5%8A%A1%E8%AE%BE%E8%AE%A1%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 脚本地址（时间戳每次获取最新）
    const SERVER_URL = "https://192.168.207.136:8199/workplatform_update";
    const SCRIPT_URL = SERVER_URL + "/xmgxh/cr-latest-script.js?v=" + Date.now();

    // 直接加载最新脚本
    function loadLatestScript() {
        fetch(SCRIPT_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.text();
            })
            .then(scriptContent => {
                const script = document.createElement('script');
                script.textContent = scriptContent;
                script.id = "cr-latest-script";
                script.dataset.serverUrl = SERVER_URL;
                document.head.appendChild(script);
                console.log('动态脚本加载成功');
            })
            .catch(error => {
                console.error('动态脚本加载失败:', error);
            });
    }

    // 启动
    loadLatestScript();
})();