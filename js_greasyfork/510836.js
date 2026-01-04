// ==UserScript==
// @name         devops的页面标签自动改名
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  Devops平台根据内容修改标签名称，方便浏览器中标签页管理
// @author       QP
// @match        https://devops.ztn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ztn.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510836/devops%E7%9A%84%E9%A1%B5%E9%9D%A2%E6%A0%87%E7%AD%BE%E8%87%AA%E5%8A%A8%E6%94%B9%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/510836/devops%E7%9A%84%E9%A1%B5%E9%9D%A2%E6%A0%87%E7%AD%BE%E8%87%AA%E5%8A%A8%E6%94%B9%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let updateInterval = 2000; // 2秒更新一次
    let selector = '.title-content span[class=title]';
    const routes = [
        {'path': '/console/project/*/projectHome', 'name': '首页'},
        {'path': '/console/vteam/*/twDemand', 'name': '需求列表'},
        {'path': '/console/vteam/*/twTask', 'name': '任务列表'},
        {'path': '/console/vteam/*/twBug', 'name': '缺陷列表'},
        {'path': '/console/vteam/*/iteration', 'name': '迭代列表'},
        {'path': '/console/vteam/*/testManager', 'name': '提测'},
        {'path': '/console/pipeline/*/', 'name': '流水线'},
        {'path': '/console/ctest/*/task', 'name': '测试任务'},
        {'path': '/console/ctest/*/testScheme', 'name': '测试方案'},
        {'path': '/console/ctest/*/testCase', 'name': '测试执行'},
        {'path': '/console/ctest/*/execute', 'name': '用例执行'},
        {'path': '/console/ctest/*/progress', 'name': '测试进度'},
        {'path': '/console/ctest/*/testReport', 'name': '测试报告'},
    ];
    const mappings = {xe8ea7: 'FCIS库存',f39507: 'FRMS资源', x4ca14: 'SOV运营', r5103e: 'DAS数据', fc7a33: 'FPS财务',
                      u6ad6b: 'FDS头程', q2f0ba: 'PSC仓配', b9f157: 'BSC基础', ic9bdb: 'ODS订单', yf841d: 'CUS客户',
                      u6d3bb: 'OWMS仓库', b0ac0b: 'FDA站点', c4f4ea: 'CPWS永兴', b80b05: 'FFMS国内', s86fa2: 'OWMS仓库',
                      k64352: 'TCMS转运', j38163: 'TCS1税金', faadac: 'TOMS转运', c8d874: 'EL交易',
                      v84cd5: 'GD谷仓', h5936d: 'WCS仓库'};

    function getProject(uri, mappings) {
        // 提取uri中的关键部分
        const uriParts = uri.split('/');
        const key = uriParts[3];
        return mappings[key];
    }

    function getUriName(uri, routes, mappings) {
        const mappedKey = getProject(uri, mappings);

        // 匹配路径
        let routeName = '';
        for (let route of routes) {
            const routePattern = route.path.replace('*', key);
            if (uri.startsWith(routePattern)) {
                routeName = route.name;
                break;
            }
        }

        return `${mappedKey}-${routeName}`;
    }

    function updateTitle() {
        var iframeElement = document.getElementById('iframe-box');
        var iframeDocument = iframeElement.contentWindow.document;
        let element = iframeDocument.querySelector(selector);
        console.log('获取成功1', element);
        if (element) {
           console.log('标题', element.textContent);
           document.title = 'Dev ' + getProject(location.pathname, mappings) + ':' + element.textContent;
        } else {
            let title = '';
            switch(location.pathname) {
                case '/console/platform/entry':
                    title = '首页';
                    break;
                default:
                    title = '';
            }
            if (title === '') {
                title = getUriName(location.pathname, routes, mappings);
            }
            document.title = 'Dev ' + title || '--';
        }
    }

    if(window.top===window.self){
        setInterval(updateTitle, updateInterval);

        // 首次初始化
        updateTitle();
    }
})();