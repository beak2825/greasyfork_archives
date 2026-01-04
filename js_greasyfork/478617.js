// ==UserScript==
// @name         Replace ID Number on XTRF Vendor portal
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  replace ID number on XTRF vendor protal when create invoices
// @author       LL
// @match        https://portal.toppandigital.com/vendors/*
// @match        https://*.xtrf.eu/vendors/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toppandigital.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478617/Replace%20ID%20Number%20on%20XTRF%20Vendor%20portal.user.js
// @updateURL https://update.greasyfork.org/scripts/478617/Replace%20ID%20Number%20on%20XTRF%20Vendor%20portal.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let modifiedNodes = 0; // 记录已经修改的节点数

    function modifyJobNumberDisplay() {
        const nodes = document.querySelectorAll("td[data-title*='INVOICES.NEW_INVOICE.COLUMN.JOB_NUMBER']");
        nodes.forEach((node) => {
            const $scope = window.angular.element(node).scope();
            if ($scope && $scope.job && $scope.job.overview) {
                node.textContent = $scope.job.overview.idNumber;
                modifiedNodes++; // 增加已经修改的节点数
            }
        });

        // 停止条件：例如，当修改了至少一个节点，并且页面上有一个特定的字符
        if (modifiedNodes > 0 && document.body.textContent.includes('»')) {
            clearInterval(intervalID);
        }
    }

    const intervalID = setInterval(modifyJobNumberDisplay, 1000); // 每秒检查一次
})();
