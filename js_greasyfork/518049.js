// ==UserScript==
// @name         AkuvoxGitlabAutoExportEntryFiles
// @namespace    http://www.akuvox.com/
// @version      1.2
// @description  内部使用，外部无效，快捷导出最新室内机词条
// @author       shize
// @match        http://192.168.13.20/main/advance-indoor/-/pipelines/new
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518049/AkuvoxGitlabAutoExportEntryFiles.user.js
// @updateURL https://update.greasyfork.org/scripts/518049/AkuvoxGitlabAutoExportEntryFiles.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function setDisabledFunction() {
        const button = document.querySelector('input[type="submit"][name="commit"][value="运行流水线"]');

        if (button) {
             button.style.display = 'none';
        }
    }

    // 创建按钮
    function setVariableFunction() {
        var button = document.createElement('button');
        button.innerHTML = '室内机词条导出';
        button.className = 'btn btn-info';
        button.style.marginLeft = '0px';

        var formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.appendChild(button);
        } else {
            console.error('未找到表单操作区域');
            return;
        }

        button.addEventListener('click', function() {
            var textarea = document.querySelector('textarea.form-control.js-ci-variable-input-value.js-secret-value.qa-ci-variable-input-value');
            var input = document.querySelector('input.js-ci-variable-input-key.ci-variable-body-item.qa-ci-variable-input-key.form-control.table-section.section-15');

            if (textarea && input) {
                input.value = 'MODE';
                textarea.value = 'exportEntryFiles';
                button.disabled = true;
                button.innerHTML = '请在企业微信接收';

                // 提交
                var submitButton = document.querySelector('input[type="submit"][name="commit"]');
                if (submitButton) {
                    submitButton.click();
                } else {
                    alert('未找到提交按钮');
                }
            } else {
                alert('未找到目标元素');
            }
        });
    }

    setDisabledFunction();
    setVariableFunction();
})();
