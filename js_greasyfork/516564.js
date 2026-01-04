// ==UserScript==
// @name         UCAS SEP 系统自动教评
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  UCAS的SEP系统自动教评，此脚本能够帮助您自动评价，支持课程评价与教师评价
// @author       tylzh97, Yana-Hangabina
// @match        https://xkcts.ucas.ac.cn/evaluate/*
// @license      MIT
// @require      https://fastly.jsdelivr.net/npm/jquery@1.8.3/tmp/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/516564/UCAS%20SEP%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/516564/UCAS%20SEP%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

/*
介绍：
纯JS打卡脚本，能够自动化完成教评全五星好评

V0.1 2020年12月04日
手动点击需要评价的课程或老师，即可自动评价并且跳转到未评价系统界面。

V0.2 2020年12月04日
在教评界面, 点击帅气小哥头像, 即可实现全自动打卡

V0.2.1 2020年12月04日
bug修复

V0.2.4 2023年01月01日
bug修复

V0.2.5 2024年11月9日
fix: 匹配新的教评系统地址
revert: 去除了自建OCR后端依赖
fix: 使用逆向第三方OCR API
improvement: 支持OCR失败滚动至验证码位置
feat: 支持教评内容自定义
feat: 支持筛选一键教评项
refactor: 重构代码

*/

'use strict';

(function () {
    const CONFIG = {
        STORAGE_KEY: 'ucas-evaluation-settings',
        LOCAL_STORAGE_KEY: 'ucas-evaluation-progress',
        API_URL:
            'https://api.textin.com/home/user_trial_ocr?service=text_recognize_3d1',
        API_URL: '',
        DEFAULT_SETTINGS: {
            teacher: {
                item_1403: '治学严谨、备课充分、讲课认真、因材施教',
                item_1404: '治学严谨、备课充分、讲课认真、因材施教',
            },
            course: {
                item_1355: '课程与作业有助于我的能力的提高',
                item_1356: '课程与作业有助于我的能力的提高',
                item_1357: '课程与作业有助于我的能力的提高',
                item_1358: '课程与作业有助于我的能力的提高',
                item_1359: '课程与作业有助于我的能力的提高',
                checkboxes: ['1367', '1368', '1369', '1370', '1371', '1372'],
            },
        },
    };

    const CSS_STYLES = `
        .settings-panel {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 1000;
            max-height: 80vh;
            overflow-y: auto;
            width: 600px;
        }
        .settings-panel div.settings-header {
            display: flex;
            justify-content: space-between;
        }
        .settings-panel h3 {
            margin: 0 0 15px;
            color: #333;
        }
        .settings-panel button.close {
        }
        .settings-panel textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .settings-panel label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        .settings-panel .checkbox-group {
            margin-bottom: 15px;
        }
        .settings-panel .checkbox-item {
            margin-right: 15px;
            display: inline-block;
        }
        .settings-panel .button-group {
            text-align: right;
            margin-top: 15px;
        }
        .settings-panel button {
            padding: 8px 15px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .settings-panel button.save {
            background: #4caf50;
            color: white;
        }
        .settings-panel button.reset {
            background: #f44336;
            color: white;
        }
        .settings-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        .toast-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 2000;
            animation: fadeInOut 2s ease-in-out;
            pointer-events: none;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            15% { opacity: 1; transform: translate(-50%, 0); }
            85% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .floating-alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        }
        .alert-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #856404;
        }
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
    `;

    const SETTINGS_PANEL_TEMPLATE = `
        <div class="settings-overlay"></div>
        <div class="settings-panel">
            <div class="settings-header">
                <h3>自定义评价内容</h3>
                <button class="close">❌</button>
            </div>
            <div>
                <h4>教师评价设置</h4>
                <label for="item_1403_custom">这位老师的教学你最喜欢什么？</label>
                <textarea id="item_1403_custom" rows="3"></textarea>
                <label for="item_1404_custom">您对老师有哪些意见和建议？</label>
                <textarea id="item_1404_custom" rows="3"></textarea>
                <h4>课程评价设置</h4>
                <label for="item_1355_custom">这门课程我最喜欢什么？</label>
                <textarea id="item_1355_custom" rows="3"></textarea>
                <label for="item_1356_custom">我认为本课程应从哪些方面需要进一步改进和提高？</label>
                <textarea id="item_1356_custom" rows="3"></textarea>
                <label for="item_1357_custom">我平均每周在这门课程上花费多少小时？</label>
                <textarea id="item_1357_custom" rows="3"></textarea>
                <label for="item_1358_custom">在参与这门课之前，我对这个学科领域兴趣如何？</label>
                <textarea id="item_1358_custom" rows="3"></textarea>
                <label for="item_1359_custom">我对该课程的课堂参与？</label>
                <textarea id="item_1359_custom" rows="3"></textarea>
                <div class="checkbox-group">
                    <label>修读原因（多选）：</label>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1367" value="1367">导师要求</div>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1368" value="1368">自己需求和兴趣</div>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1369" value="1369">核心课要求</div>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1370" value="1370">口碑好</div>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1371" value="1371">时间适宜</div>
                    <div class="checkbox-item"><input type="checkbox" id="checkbox_1372" value="1372">具有挑战性</div>
                </div>
            </div>
            <div class="button-group">
                <button class="reset">重置默认</button>
                <button class="save">保存设置</button>
            </div>
        </div>
    `;

    class OCRService {
        static async getBase64Image(img) {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL('image/png');
        }

        static base64ToBinary(base64String) {
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            return new Uint8Array(byteNumbers).buffer;
        }

        static async recognizeText(img) {
            const imageData = await this.getBase64Image(img);
            const binaryData = this.base64ToBinary(
                imageData.replace('data:image/png;base64,', '')
            );

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'cache-control': 'no-cache',
                    'sec-fetch-dest': 'empty',
                    token: '',
                },
                body: binaryData,
            });

            const data = await response.json();

            if (data.code === 431) {
                throw new Error('API请求次数超限，请手动填写验证码');
            }
            if (data.code !== 200 || !data.data?.result?.lines?.length) {
                throw new Error('OCR识别失败，请刷新页面重试');
            }

            return data.data.result.lines[0].text;
        }
    }

    class UIComponents {
        static injectStyles() {
            const style = document.createElement('style');
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }

        static showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 2000);
        }

        static createIconButton(text, icon) {
            const button = document.createElement('button');
            button.className = 'auto-evaluate-button';
            button.style.cssText = 'background: #fff; border: 1px solid #ddd; cursor: pointer; padding: 5px 10px; display: flex; align-items: center; gap: 10px; transition: all 0.3s; border-radius: 4px;';
            button.innerHTML = `<span>${icon}</span><span>${text}</span>`;
            return button;
        }

        static createSettingsButton() {
            return this.createIconButton('教评内容也支持自定义哦', '⚙️');
        }

        static createSettingsPanel() {
            const panelContainer = document.createElement('div');
            panelContainer.innerHTML = SETTINGS_PANEL_TEMPLATE;
            return panelContainer;
        }

        static addTableCheckboxes(table) {
            const headerRow = table.querySelector('thead tr');
            const newHeader = document.createElement('th');
            newHeader.textContent = '一键教评';
            headerRow.insertBefore(newHeader, headerRow.firstChild);

            table.querySelectorAll('tbody tr').forEach((row) => {
                const newCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.cursor = 'pointer';

                const operationCell = row.querySelector('td:last-child');
                const evaluateButton = operationCell.querySelector('a.btn');

                if (evaluateButton && evaluateButton.innerText.trim() === '评估') {
                    checkbox.checked = true;
                    checkbox.title = window.location.href.includes('course')
                        ? '点击取消选中以跳过该课程的评估'
                        : '点击取消选中以跳过该教师的评估';
                } else {
                    checkbox.disabled = true;
                    checkbox.style.opacity = '0.5';
                    checkbox.title = window.location.href.includes('course')
                        ? '已评估该课程'
                        : '已评估该教师';
                }

                newCell.appendChild(checkbox);
                row.insertBefore(newCell, row.firstChild);
            });
        }

        static createFloatingAlert(message) {
            const alert = document.createElement('div');
            alert.className = 'floating-alert';
            alert.innerHTML = `
                <div class="alert-content">
                    <span>${message}</span>
                    <button class="alert-close">×</button>
                </div>
            `;

            alert.querySelector('.alert-close').onclick = () => {
                document.body.removeChild(alert);
            };

            document.body.appendChild(alert);
        }
    }

    class SettingsManager {
        static loadSettings() {
            const settings = JSON.parse(
                localStorage.getItem(CONFIG.STORAGE_KEY) || '{}'
            );
            return {
                teacher: settings.teacher || CONFIG.DEFAULT_SETTINGS.teacher,
                course: settings.course || CONFIG.DEFAULT_SETTINGS.course,
            };
        }

        static saveSettings(settings) {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(settings));
        }

        static resetSettings() {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
        }
    }

    class EvaluationForm {
        static fillForm() {
            const settings = SettingsManager.loadSettings();
            const isTeacherPage = window.location.href.includes('evaluateTeacher');

            document
                .querySelectorAll('[name^="item_"][value="5"]')
                .forEach((radio) => (radio.checked = true));

            document.querySelectorAll('textarea[name^="item_"]').forEach((textarea) => {
                const id = textarea.id;
                const value =
                    settings.teacher[id] ||
                    settings.course[id] ||
                    CONFIG.DEFAULT_SETTINGS.teacher[id] ||
                    CONFIG.DEFAULT_SETTINGS.course[id];
                if (value) textarea.value = value;
            });

            if (!isTeacherPage) {
                document.querySelector('input[name^="radio_"]').checked = true;

                const checkboxes =
                    settings.course.checkboxes ||
                    CONFIG.DEFAULT_SETTINGS.course.checkboxes;
                checkboxes.forEach((id) => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }

        static async handleCaptcha(inputId, imgId) {
            const input = document.getElementById(inputId);
            const image = document.getElementById(imgId);

            try {
                const text = await OCRService.recognizeText(image);
                input.value = text;
                document.getElementById('sb1').click();
                $('[value=ok]').click();
            } catch (error) {
                image.scrollIntoView({ behavior: 'smooth', block: 'center' });
                UIComponents.createFloatingAlert(error.message);
                input.focus();
            }
        }
    }

    class AutoEvaluation {
        static init() {
            $(document).ready(() => {
                if (this.isErrorPage()) {
                    alert('上次提交出错，请刷新页面以重新使用脚本');
                    return;
                }

                if (this.isEvaluationListPage()) {
                    this.initEvaluationList();
                } else {
                    this.initEvaluationForm();
                }
            });
        }

        static isErrorPage() {
            const errorContent = document.querySelector('#jbox-content');
            return errorContent?.textContent.includes('验证码');
        }

        static isEvaluationListPage() {
            return (
                window.location.href.includes('evaluate/course') ||
                window.location.href.includes('evaluate/teacher')
            );
        }

        static initEvaluationList() {
            const title = document.querySelector('.span12');
            if (!title) {
                alert('页面加载出错');
                return;
            }

            title.style.height = '75px';
            title.firstElementChild.style.cssText =
                'float:left; line-height: 75px;';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText =
                'float: right; padding-right: 30px; display: flex; align-items: center; gap: 15px;';

            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText =
                'display: flex; flex-direction: column; gap: 8px; align-items: flex-start;';

            const evaluateButton = UIComponents.createIconButton('为什么不试试一键教评呢', '🚀');
            evaluateButton.onclick = this.handleAutoEvaluate.bind(this);

            const settingsButton = UIComponents.createSettingsButton();
            settingsButton.onclick = this.handleSettingsClick.bind(this);

            buttonGroup.appendChild(evaluateButton);
            buttonGroup.appendChild(settingsButton);

            const img = document.createElement('img');
            img.width = 75;
            img.src =
                'https://qiniu.maikebuke.com/006fLFOwgy1gygew6aw8cj30qc0qcn24.jpg';

            buttonContainer.appendChild(buttonGroup);
            buttonContainer.appendChild(img);

            title.appendChild(buttonContainer);

            UIComponents.injectStyles();
            const settingsPanel = UIComponents.createSettingsPanel();
            document.body.appendChild(settingsPanel);

            const table = document.querySelector('.table');
            if (table) {
                UIComponents.addTableCheckboxes(table);
            }

            this.bindSettingsPanelEvents(settingsPanel);

            // 检测是否存在成功提交的提示信息
            const successMessage = document.getElementById('messageBoxSuccess');
            if (successMessage) {
                // 如果存在提示信息，继续自动评价
                this.continueEvaluation();
            } else {
                // 否则，清除自动评价标志
                localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify({ goon: 0 }));
            }
        }

        static handleAutoEvaluate() {
            localStorage.setItem(
                CONFIG.LOCAL_STORAGE_KEY,
                JSON.stringify({ goon: 1 })
            );
            this.continueEvaluation();
        }

        static continueEvaluation() {
            const progress = JSON.parse(
                localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY)
            );
            if (!progress?.goon) return;

            const buttons = document.querySelectorAll('td a[class^="btn"]');
            const nextButton = Array.from(buttons).find((button) => {
                const row = button.closest('tr');
                const checkbox = row.querySelector('td:first-child input[type="checkbox"]');
                return button.innerText.trim() === '评估' && checkbox?.checked;
            });

            if (nextButton) {
                nextButton.click();
            } else {
                localStorage.setItem(
                    CONFIG.LOCAL_STORAGE_KEY,
                    JSON.stringify({ goon: 0 })
                );
                setTimeout(() => alert('评价完成'), 3000);
            }
        }

        static handleSettingsClick() {
            const settings = SettingsManager.loadSettings();
            const panel = document.querySelector('.settings-panel');
            const overlay = document.querySelector('.settings-overlay');

            this.fillSettingsPanel(settings);

            panel.style.display = 'block';
            overlay.style.display = 'block';
        }

        static fillSettingsPanel(settings) {
            ['1403', '1404'].forEach((id) => {
                document.getElementById(`item_${id}_custom`).value =
                    settings.teacher[`item_${id}`] || '';
            });

            ['1355', '1356', '1357', '1358', '1359'].forEach((id) => {
                document.getElementById(`item_${id}_custom`).value =
                    settings.course[`item_${id}`] || '';
            });

            const checkboxes =
                settings.course.checkboxes ||
                CONFIG.DEFAULT_SETTINGS.course.checkboxes;
            checkboxes.forEach((value) => {
                const checkbox = document.getElementById(`checkbox_${value}`);
                if (checkbox) checkbox.checked = true;
            });
        }

        static bindSettingsPanelEvents(panel) {
            panel.querySelector('.save').addEventListener('click', () => {
                const settings = {
                    teacher: {},
                    course: { checkboxes: [] },
                };

                ['1403', '1404'].forEach((id) => {
                    settings.teacher[`item_${id}`] = document.getElementById(
                        `item_${id}_custom`
                    ).value;
                });

                ['1355', '1356', '1357', '1358', '1359'].forEach((id) => {
                    settings.course[`item_${id}`] = document.getElementById(
                        `item_${id}_custom`
                    ).value;
                });

                document
                    .querySelectorAll('.checkbox-item input:checked')
                    .forEach((cb) => settings.course.checkboxes.push(cb.value));

                SettingsManager.saveSettings(settings);
                this.closeSettingsPanel(panel);
                UIComponents.showToast('✅ 设置已保存');
            });

            panel.querySelector('.reset').addEventListener('click', () => {
                if (confirm('确定要重置为默认设置吗？')) {
                    SettingsManager.resetSettings();
                    this.fillSettingsPanel(SettingsManager.loadSettings());
                    UIComponents.showToast('↩️ 已恢复默认设置');
                }
            });

            const closePanel = () => this.closeSettingsPanel(panel);
            panel.querySelector('.close').addEventListener('click', closePanel);
            panel.querySelector('.settings-overlay').addEventListener('click', closePanel);
        }

        static closeSettingsPanel(panel) {
            panel.querySelector('.settings-panel').style.display = 'none';
            panel.querySelector('.settings-overlay').style.display = 'none';
        }

        static initEvaluationForm() {
            EvaluationForm.fillForm();
            EvaluationForm.handleCaptcha('adminValidateCode', 'adminValidateImg');
        }
    }

    AutoEvaluation.init();
})();
