// ==UserScript==
// @name         获取通用自动化模板
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取通用自动化模板，描述不和名称相同
// @author       You
// @match        *://*.qq.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444025/%E8%8E%B7%E5%8F%96%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%8C%96%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/444025/%E8%8E%B7%E5%8F%96%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%8C%96%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.getCodeModel = () => {
        const authName = 'witcherliu';
        var code = `
class {caseName}(Wwopen_web_uiTestCase):
    """
    @desc: {desc}
    @auth:  {auth}
    @caseID: {caseID}
    @priority: {level}
    @status: Ready
    @account:
    """
    owner = "{auth}"
    timeout = 5
    priority = Wwopen_web_uiTestCase.EnumPriority.{codeLevel}
    status = Wwopen_web_uiTestCase.EnumStatus.Ready

    def run_test(self):
        self.login('web_open_new', True)
        `;
        var selectRow = SpreadsheetApp.view.canvas.normalSelectData.activeRow;
        var descArray = [];
        for (var i = 0; i < 5; i++) {
            descArray.push(SpreadsheetApp.view.canvas.tableView.getCellViewAtPosition(selectRow, i).content)
        }
        var descStr = descArray.join(' - ');
        code = code.replaceAll('{desc}', descStr);
        var caseName = SpreadsheetApp.view.canvas.tableView.getCellViewAtPosition(selectRow, 12).content.split('.').pop();
        code = code.replaceAll('{caseName}', caseName);
        code = code.replaceAll('{auth}', authName);
        var level = SpreadsheetApp.view.canvas.tableView.getCellViewAtPosition(selectRow, 5).content.split('.').pop();
        var codeLevel = 'Normal';
        switch (level.toLowerCase()) {
            case 'p0':
                codeLevel = 'BVT';
                break;
            case 'p1':
                codeLevel = 'High';
                break;
            case 'p2':
                codeLevel = 'Normal';
                break;
            case 'p3':
                codeLevel = 'Low';
                break;
        }
        code = code.replaceAll('{level}', level);
        code = code.replaceAll('{codeLevel}', codeLevel);
        var caseId = SpreadsheetApp.view.canvas.tableView.getCellViewAtPosition(selectRow, 13).content.split('.').pop();
        code = code.replaceAll('{caseID}', caseId);

        const newTab = window.open('', '_blank', '');
        newTab.document.open('text/html', 'replace');
        newTab.opener = null
        newTab.document.write(`<textarea style='width: 1000px; height: 1000px'>${code}</textarea>`);
        newTab.document.close();
    }
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.keyCode === 13) {
            console.log('alt+enter');
            getCodeModel();
        }
    });
})();
