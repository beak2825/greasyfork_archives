// ==UserScript==
// @name         Gooboo存档同步(WebDAV)
// @version      1.2
// @description  游戏存档WebDAV 上传和下载，适用于使用 localStorage 存储存档的网页游戏。
// @author       zding
// @match        *://*/gooboo/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/762887
// @downloadURL https://update.greasyfork.org/scripts/527895/Gooboo%E5%AD%98%E6%A1%A3%E5%90%8C%E6%AD%A5%28WebDAV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527895/Gooboo%E5%AD%98%E6%A1%A3%E5%90%8C%E6%AD%A5%28WebDAV%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认值
    const defaultUrl = 'https://dav.jianguoyun.com/dav'; //示例用的是坚果云的免费webdav
    const defaultUsername = 'Username';
    const defaultPassword = 'password';
    const defaultBackupCount = 5;
    const domain = window.location.hostname;
    const gamesavesDirectory = 'Gamesaves'
    const webdavDirectory = domain + '_saves'; // WebDAV 上的目录，模式使用当前域名_saves
    const defaultShowFloatingPanel = true;
    const defaultKeysToBackup = 'goobooSavefile'; //备份的key名称


    let url = GM_getValue('url', defaultUrl);
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let username = GM_getValue('username', defaultUsername);
    let password = GM_getValue('password', defaultPassword);
    let backupCount = GM_getValue('backupCount', defaultBackupCount);
    let showFloatingPanel = GM_getValue('showFloatingPanel', defaultShowFloatingPanel);
    showFloatingPanel = (typeof showFloatingPanel === 'string') ? (showFloatingPanel === 'true') : showFloatingPanel;
    let keysToBackup = GM_getValue('keysToBackup', defaultKeysToBackup);
    let webdavInitialized = false;

    class UI {
        constructor() {
            this.createSettingsPage();
            this.addStyles();
        }

        addStyles() {
            GM_addStyle(`
            .gooboo-ui-container {
                font-family: 'Arial', sans-serif;
                color: #333;
            }

            .gooboo-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .gooboo-modal-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                width: 70%;
                max-width: 350px;
            }

            .gooboo-modal-message {
                margin-bottom: 15px;
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
            }

            .gooboo-modal-button-container {
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            .gooboo-modal-button {
                padding: 10px 20px;
                background-color: #007bff; /* 蓝色主色调 */
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }

            .gooboo-modal-button:hover {
                background-color: #0056b3; /* 鼠标悬停时的颜色 */
            }

            .gooboo-modal-button.cancel {
                background-color: #6c757d
            }

            .gooboo-modal-button.cancel:hover {
                background-color: #5a6268;
            }


            .gooboo-settings-page {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1001;
                display: none;
                justify-content: center;
                align-items: center;
            }

            .gooboo-settings-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                width: 80%;
                max-width: 600px;
            }

            .gooboo-settings-label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }

            .gooboo-settings-input {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 14px;
            }

            .gooboo-settings-button-container {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }

            .gooboo-settings-button {
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }

            .gooboo-settings-button:hover {
                background-color: #0056b3;
            }

            .gooboo-settings-button.cancel {
                background-color: #6c757d;
            }

            .gooboo-settings-button.cancel:hover {
                background-color: #5a6268;
            }


            .gooboo-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            .gooboo-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .gooboo-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }

            .gooboo-slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .gooboo-slider {
                background-color: #2196F3;
            }

            input:focus + .gooboo-slider {
                box-shadow: 0 0 1px #2196F3;
            }

            input:checked + .gooboo-slider:before {
                transform: translateX(26px);
            }

            /* Rounded sliders */
            .gooboo-slider.round {
                border-radius: 34px;
            }

            .gooboo-slider.round:before {
                border-radius: 50%;
            }


            .gooboo-floating-panel {
                position: fixed;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                z-index: 999;
                display: flex;
                align-items: center;
            }
            .gooboo-floating-arrow {
                width: 30px;
                height: 30px;
                color: #007bff;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0 5px 5px 0;
                font-size: 1.2em;
            }
            .gooboo-floating-menu {
                display: none;
                flex-direction: column;
                background-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                border-radius: 5px;
                padding: 10px;
                backdrop-filter: blur(5px);
            }
            .gooboo-floating-menu button {
                padding: 8px 15px;
                margin: 5px 0;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .gooboo-floating-menu button:hover {
                background-color: #076ddc;
            }

            .gooboo-floating-menu.active {
                display: flex;
            }


            @media (max-width: 600px) {
                .gooboo-settings-content {
                    width: 95%;
                }
            }


            .gooboo-modal-content select {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            body {
                min-height: 100vh;
            }
        `);
        }

        createSettingsPage() {
            this.settingsPage = document.createElement('div');
            this.settingsPage.className = 'gooboo-settings-page';

            this.settingsContent = document.createElement('div');
            this.settingsContent.className = 'gooboo-settings-content';

            this.urlLabel = document.createElement('label');
            this.urlLabel.className = 'gooboo-settings-label';
            this.urlLabel.textContent = 'WebDAV URL:';
            this.urlInput = document.createElement('input');
            this.urlInput.className = 'gooboo-settings-input';
            this.urlInput.type = 'text';
            this.urlInput.value = url;

            this.usernameLabel = document.createElement('label');
            this.usernameLabel.className = 'gooboo-settings-label';
            this.usernameLabel.textContent = 'WebDAV 用户名:';
            this.usernameInput = document.createElement('input');
            this.usernameInput.className = 'gooboo-settings-input';
            this.usernameInput.type = 'text';
            this.usernameInput.value = username;

            this.passwordLabel = document.createElement('label');
            this.passwordLabel.className = 'gooboo-settings-label';
            this.passwordLabel.textContent = 'WebDAV 密码:';
            this.passwordInput = document.createElement('input');
            this.passwordInput.className = 'gooboo-settings-input';
            this.passwordInput.type = 'password';
            this.passwordInput.value = password;

            this.backupCountLabel = document.createElement('label');
            this.backupCountLabel.className = 'gooboo-settings-label';
            this.backupCountLabel.textContent = '备份数量:';
            this.backupCountInput = document.createElement('input');
            this.backupCountInput.className = 'gooboo-settings-input';
            this.backupCountInput.type = 'number';
            this.backupCountInput.value = backupCount;
            this.keysToBackupLabel = document.createElement('label');
            this.keysToBackupLabel.className = 'gooboo-settings-label';
            this.keysToBackupLabel.textContent = '要备份的 Key 名 (空格分隔):';
            this.keysToBackupInput = document.createElement('input');
            this.keysToBackupInput.className = 'gooboo-settings-input';
            this.keysToBackupInput.type = 'text';
            this.keysToBackupInput.value = keysToBackup;

            // 显示悬浮面板 开关
            this.showFloatingPanelLabel = document.createElement('label');
            this.showFloatingPanelLabel.className = 'gooboo-settings-label';
            this.showFloatingPanelLabel.textContent = '显示悬浮面板:';
            this.showFloatingPanelSwitch = document.createElement('label');
            this.showFloatingPanelSwitch.className = 'gooboo-switch';
            this.showFloatingPanelInput = document.createElement('input');
            this.showFloatingPanelInput.type = 'checkbox';
            this.showFloatingPanelInput.checked = showFloatingPanel;
            this.showFloatingPanelSlider = document.createElement('span');
            this.showFloatingPanelSlider.className = 'gooboo-slider round';
            this.showFloatingPanelSwitch.appendChild(this.showFloatingPanelInput);
            this.showFloatingPanelSwitch.appendChild(this.showFloatingPanelSlider);

            this.saveButton = document.createElement('button');
            this.saveButton.className = 'gooboo-settings-button';
            this.saveButton.textContent = '保存';
            this.saveButton.addEventListener('click', () => this.saveSettings());

            this.cancelButton = document.createElement('button');
            this.cancelButton.className = 'gooboo-settings-button cancel';
            this.cancelButton.textContent = '取消';
            this.cancelButton.addEventListener('click', () => this.closeSettingsPage());

            this.settingsContent.appendChild(this.urlLabel);
            this.settingsContent.appendChild(this.urlInput);
            this.settingsContent.appendChild(this.usernameLabel);
            this.settingsContent.appendChild(this.usernameInput);
            this.settingsContent.appendChild(this.passwordLabel);
            this.settingsContent.appendChild(this.passwordInput);
            this.settingsContent.appendChild(this.backupCountLabel);
            this.settingsContent.appendChild(this.backupCountInput);
            this.settingsContent.appendChild(this.keysToBackupLabel);
            this.settingsContent.appendChild(this.keysToBackupInput);
            this.settingsContent.appendChild(this.showFloatingPanelLabel);
            this.settingsContent.appendChild(this.showFloatingPanelSwitch);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.marginTop = '10px';

            buttonContainer.appendChild(this.saveButton);
            buttonContainer.appendChild(this.cancelButton);

            this.settingsContent.appendChild(buttonContainer);
            this.settingsPage.appendChild(this.settingsContent);
            document.body.appendChild(this.settingsPage);
        }

        saveSettings() {
            url = this.urlInput.value;
            if (url.endsWith('/')) {
                url = url.slice(0, -1);
            }
            username = this.usernameInput.value;
            password = this.passwordInput.value;
            backupCount = parseInt(this.backupCountInput.value, 10);
            showFloatingPanel = this.showFloatingPanelInput.checked;
            keysToBackup = this.keysToBackupInput.value;


            GM_setValue('url', url);
            GM_setValue('username', username);
            GM_setValue('password', password);
            GM_setValue('backupCount', backupCount);
            GM_setValue('keysToBackup', keysToBackup);
            GM_setValue('showFloatingPanel', showFloatingPanel);


            webdavClient.url = url;
            webdavClient.username = username;
            webdavClient.password = password;

            this.closeSettingsPage();
            this.showAlert('设置已保存');
            webdavInitialized = false;
            initializeWebDAV();
            this.reloadFloatingElements();
        }

        reloadFloatingElements() {
            if (floatingPanelContainer) {
                floatingPanelContainer.remove();
                floatingPanelContainer = null;
            }

            if (showFloatingPanel) {
                createFloatingPanel();
            }
        }

        closeSettingsPage() {
            this.settingsPage.style.display = 'none';
        }

        showSettingsPage() {
            this.settingsPage.style.display = 'flex';
        }

        showAlert(message) {
            alert(message);
        }

        showModal(message, content, onConfirm, onCancel, showCancel = false) {
            const modal = document.createElement('div');
            modal.className = 'gooboo-modal';
            modal.style.display = 'flex';

            const modalContent = document.createElement('div');
            modalContent.className = 'gooboo-modal-content';

            const messageElement = document.createElement('p');
            messageElement.className = 'gooboo-modal-message';
            messageElement.textContent = message;
            modalContent.appendChild(messageElement);

            if (content) {
                modalContent.appendChild(content);
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'gooboo-modal-button-container';

            const confirmButton = document.createElement('button');
            confirmButton.className = 'gooboo-modal-button';
            confirmButton.textContent = '确定';
            confirmButton.addEventListener('click', () => {
                modal.style.display = 'none';
                if (onConfirm) {
                    onConfirm();
                }
                modal.remove();
            });
            buttonContainer.appendChild(confirmButton);

            if (showCancel) {
                const cancelButton = document.createElement('button');
                cancelButton.className = 'gooboo-modal-button cancel';
                cancelButton.textContent = '取消';
                cancelButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    if (onCancel) {
                        onCancel();
                    }
                    modal.remove();
                });
                buttonContainer.appendChild(cancelButton);
            }

            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        }

        createModal(message, content, onConfirm, onCancel, showCancel) {
            const modal = document.createElement('div');
            modal.className = 'custom-modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'custom-modal-content';

            const messageElement = document.createElement('p');
            messageElement.textContent = message;

            modalContent.appendChild(messageElement);

            if (content) {
                modalContent.appendChild(content);
            }

            const confirmButton = document.createElement('button');
            confirmButton.className = 'custom-modal-button';
            confirmButton.textContent = '确定';
            confirmButton.addEventListener('click', () => {
                modal.style.display = 'none';
                if (onConfirm) {
                    onConfirm();
                }
            });

            modalContent.appendChild(confirmButton);

            if (showCancel) {
                const cancelButton = document.createElement('button');
                cancelButton.className = 'custom-modal-button';
                cancelButton.textContent = '取消';
                cancelButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                    if (onCancel) {
                        onCancel();
                    }
                });
                modalContent.appendChild(cancelButton);
            }


            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            return modal;
        }
    }
    const ui = new UI();

    class WebDAVClient {
        constructor(url, username, password, webdavDirectory, gamesavesDirectory) {
            this.url = url;
            this.username = username;
            this.password = password;
            this.webdavDirectory = webdavDirectory;
            this.gamesavesDirectory = gamesavesDirectory;
            this.directoriesEnsured = false;
        }

        request({method, path='', headers, data}) {
            return new Promise((resolve, reject) => {
                const fullPath = this.url + '/' + this.gamesavesDirectory + '/' + this.webdavDirectory + '/' + path;
                GM_xmlhttpRequest({
                    method: method,
                    url: fullPath,
                    headers: {
                        authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
                        ...headers
                    },
                    data: data,
                    onload: response => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else {
                            console.error(`WebDAV 请求失败！状态码: ${response.status} ${response.statusText}，URL: ${fullPath}`);
                            reject({
                                status: response.status,
                                message: `WebDAV 请求失败！状态码: ${response.status} ${response.statusText}，URL: ${fullPath}`
                            });
                        }
                    },
                    onerror: (error) => {
                        console.error("GM_xmlhttpRequest error:", error);
                        reject({
                            status: 0,
                            message: "GM_xmlhttpRequest error:" + error
                        });
                    }
                });
            });
        }

        async checkDirectoryExists(directory) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PROPFIND',
                    url: this.url + '/' + directory,
                    headers: {
                        authorization: 'Basic ' + btoa(`${this.username}:${this.password}`),
                        'Depth': 0
                    },
                    onload: function(response) {
                        if (response.status === 207) {
                            resolve(true); // 目录存在
                        } else if (response.status === 404) {
                            resolve(false); // 目录不存在
                        } else {
                            console.error(`PROPFIND 失败，状态码: ${response.status}`);
                            reject({
                                status: response.status,
                                message: `PROPFIND 失败，状态码: ${response.status}`
                            });
                        }
                    },
                    onerror: function(error) {
                        console.error('PROPFIND 请求失败:', error);
                        reject({
                            status: 0,
                            message: 'PROPFIND 请求失败:' + error
                        });
                    }
                });
            });
        }

        createDirectory(directory) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'MKCOL',
                    url: this.url + '/' + directory,
                    headers: {
                        authorization: 'Basic ' + btoa(`${this.username}:${this.password}`)
                    },
                    onload: function(response) {
                        if (response.status === 201) {
                            console.log(`目录 ${directory} 创建成功`);
                            resolve();
                        } else {
                            console.error(`创建目录 ${directory} 失败，状态码: ${response.status}`);
                            reject({
                                status: response.status,
                                message: `创建目录 ${directory} 失败，状态码: ${response.status}`
                            });
                        }
                    },
                    onerror: function(error) {
                        console.error(`创建目录 ${directory} 请求失败:`, error);
                        reject({
                            status: 0,
                            message: `创建目录 ${directory} 请求失败:` + error
                        });
                    }
                });
            });
        }

        async ensureDirectoriesExist() {
            if (this.directoriesEnsured) return;
            try {
                const gamesavesExists = await this.checkDirectoryExists(this.gamesavesDirectory);
                if (!gamesavesExists) {
                    await this.createDirectory(this.gamesavesDirectory);
                }

                const webdavDirFullPath = this.gamesavesDirectory + '/' + this.webdavDirectory;
                const webdavDirectoryExists = await this.checkDirectoryExists(webdavDirFullPath);
                if (!webdavDirectoryExists) {
                    await this.createDirectory(webdavDirFullPath);
                }
                this.directoriesEnsured = true;
            } catch (error) {
                console.error("创建目录结构出错:", error);
                throw error;
            }
        }

        async getFileList() {
            try {
                const res = await this.request({
                    method: 'PROPFIND',
                    headers: {depth: 1}
                });
                let files = [];
                let path = res.responseText.match(/(?<=<d:href>).*?(?=<\/d:href>)/gi);

                if (path) {
                    path.forEach(p => {
                        const prefix = '/dav/' + this.gamesavesDirectory + '/' + this.webdavDirectory + "/";

                        if (p.startsWith(prefix)) {
                            const filename = p.substring(prefix.length);
                            if (filename && filename.endsWith('.json')) {
                                files.push(filename);
                            }
                        }
                    });
                }

                files.sort().reverse();
                return files;
            } catch (error) {
                console.error("Error getting file list:", error);
                return [];
            }
        }

        deleteFile(filename) {
            return this.request({
                method: 'DELETE',
                path: filename
            }).then(() => {
                console.log(`Deleted file: ${filename}`);
            }).catch(error => {
                console.error(`Error deleting file: ${filename}`, error);
                throw error;
            });
        }

        async uploadFile(filename, data) {
            const jsonData = JSON.stringify(data);
            try {
                await this.request({
                    method: 'PUT',
                    path: filename,
                    data: jsonData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (uploadError) {
                console.error(`上传文件 ${filename} 失败:`, uploadError);
                throw uploadError;
            }
        }

        downloadFile(filename) {
            return this.request({
                method: 'GET',
                path: filename
            }).then(res => {
                try {
                    return JSON.parse(res.responseText);
                } catch (error) {
                    console.error("JSON 解析失败:", error);
                    throw error;
                }
            }).catch(error => {
                console.error("Error downloading config:", error);
                throw error;
            });
        }

        handleWebDAVError(error, filename) {
            let message;
            if (error.status === 401 || error.status === 403) {
                message = `操作失败: 账户密码错误或无权限。请检查 WebDAV 用户名和密码是否正确。`;
            } else if (error.status === 0) {
                message = `操作失败: 无法连接到 WebDAV 服务器。请检查网络连接或 WebDAV URL 是否正确（当前: ${this.url}）。`;
            } else {
                message = `操作失败: 服务器返回错误 (状态码: ${error.status})。请检查 WebDAV 服务状态或稍后重试。`;
            }
            if (filename) {
                message += `\n涉及文件: ${filename}`;
            }
            ui.showModal(message);
        }
    }

    const webdavClient = new WebDAVClient(url, username, password, webdavDirectory, gamesavesDirectory);


    function createModal(message, content, onConfirm, onCancel, showCancel) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'custom-modal-content';

        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        modalContent.appendChild(messageElement);

        if (content) {
            modalContent.appendChild(content);
        }

        const confirmButton = document.createElement('button');
        confirmButton.className = 'custom-modal-button';
        confirmButton.textContent = '确定';
        confirmButton.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onConfirm) {
                onConfirm();
            }
        });

        modalContent.appendChild(confirmButton);

        if (showCancel) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'custom-modal-button';
            cancelButton.textContent = '取消';
            cancelButton.addEventListener('click', () => {
                modal.style.display = 'none';
                if (onCancel) {
                    onCancel();
                }
            });
            modalContent.appendChild(cancelButton);
        }


        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        return modal;
    }


    async function uploadSave() {
        if (!webdavInitialized) {
            initializeWebDAV();
        }
        try {
            const currentDate = getCurrentDate();
            const filename = "gamesave_" + currentDate + ".json";
            const saveData = {};

            const keysToBackupList = keysToBackup.split(' ').filter(key => key.trim() !== '');

            await new Promise(resolve => {
                setTimeout(() => {
                    keysToBackupList.forEach(key => {
                        const value = localStorage.getItem(key);
                        if (value !== null) {
                            saveData[key] = value;
                        }
                    });
                    resolve();
                }, 0);
            });

            const data = JSON.stringify(saveData);
            await webdavClient.uploadFile(filename, data);

            console.log(`游戏存档文件 [${filename}] 上传成功。`);
            ui.showModal("指定存档上传完成!", null, async () => {
                await cleanupOldBackups();
            });
        } catch (error) {
            console.error("上传游戏存档文件出错:", error);
            ui.showModal(`上传游戏存档文件出错: ${error.message || '未知错误'}。`);
        }
    }

    async function getMatchingDates() {
        const files = await webdavClient.getFileList();
        const dateRegex = /gamesave_(\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2})\.json/;
        const matchingDates = files.map(file => {
            const match = file.match(dateRegex);
            return match ? match[1] : null;
        }).filter(date => date !== null);

        return matchingDates;
    }

    async function downloadLatestConfig() {
        if (!webdavInitialized) {
            initializeWebDAV();
        }
        try {
            const matchingDates = await getMatchingDates();

            if (matchingDates.length === 0) {
                ui.showModal("没有找到匹配的存档日期!");
                return;
            }
            const latestDate = matchingDates.sort((a, b) => {
                const dateA = new Date(a.replace(/_/g, '-'));
                const dateB = new Date(b.replace(/_/g, '-'));
                return dateB - dateA;
            })[0];

            if (!latestDate) {
                ui.showModal("没有找到最新的存档日期!");
                return;
            }

            const filename = "gamesave_" + latestDate + ".json";
            try {
                const configData = await webdavClient.downloadFile(filename);
                await setLocalStorageFromJSON(configData);
                ui.showModal(`${latestDate} 存档下载成功!`, null, () => {
                    window.location.reload();
                });
            } catch (error) {
                console.warn(`下载配置文件 [${filename}] 出错:`, error);
                webdavClient.handleWebDAVError(error, filename);
            }
        } catch (error) {
            console.error("下载最新配置文件出错:", error);
            ui.showModal("下载最新配置文件出错! 请检查控制台。");
        }
    }

    async function downloadSpecificConfig() {
        if (!webdavInitialized) {
            initializeWebDAV();
        }
        const matchingDates = await getMatchingDates();

        if (matchingDates.length === 0) {
            ui.showModal("没有找到匹配的存档日期!");
            return;
        }

        const select = document.createElement('select');
        select.className = 'custom-select';
        matchingDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            select.appendChild(option);
        });

        ui.showModal("选择要下载的存档日期:", select, async () => {
            const selectedDate = select.value;
            const filename = "gamesave_" + selectedDate + ".json";

            try {
                const configData = await webdavClient.downloadFile(filename);
                await setLocalStorageFromJSON(configData);
                 ui.showModal(`${selectedDate} 存档下载成功!`, null, () => {
                    window.location.reload();
                });
            } catch (error) {
                console.warn(`下载配置文件 [${filename}] 出错:`, error);
                webdavClient.handleWebDAVError(error, filename);
            }
        }, () => {}, true);
    }

    async function cleanupOldBackups() {
        try {
            const files = await webdavClient.getFileList();
            const dateRegex = /gamesave_(\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2})\.json/;
            const saveFiles = files.filter(file => dateRegex.test(file));
            saveFiles.sort().reverse();

            const filesToDelete = saveFiles.slice(backupCount);

            console.log(`需要删除的旧存档数量: ${filesToDelete.length}`);
            console.log(filesToDelete);
            for (const filename of filesToDelete) {
                try {
                    await webdavClient.deleteFile(filename);
                } catch (error) {
                    console.warn(`删除文件 [${filename}] 出错:`, error);
                    webdavClient.handleWebDAVError(error, filename);
                }

            }

            if (filesToDelete.length > 0) {
            } else {
                console.log(`没有需要删除的旧存档。`);
            }
        } catch (error) {
            console.error("清理旧存档出错:", error);
            ui.showModal("清理旧存档出错! 请检查控制台。");
        }
    }

    async function setLocalStorageFromJSON(configData) {
        try {
            for (const key in configData) {
                if (configData.hasOwnProperty(key)) {
                    localStorage.setItem(key, configData[key]);
                }
            }
        } catch (error) {
            console.error("设置 localStorage 失败:", error);
            throw error;
        }
    }

    function getCurrentDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const chinaTime = new Date(utc + (3600000 * 8));

        const year = chinaTime.getFullYear();
        const month = (chinaTime.getMonth() + 1).toString().padStart(2, '0');
        const day = chinaTime.getDate().toString().padStart(2, '0');
        const hours = chinaTime.getHours().toString().padStart(2, '0');
        const minutes = chinaTime.getMinutes().toString().padStart(2, '0');
        const seconds = chinaTime.getSeconds().toString().padStart(2, '0');

        return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
    }

    function initializeWebDAV() {
        if (webdavInitialized) {
            console.log("WebDAV 已经初始化过，跳过。");
            return;
        }

        webdavClient.ensureDirectoriesExist().then(() => {
            console.log("WebDAV 目录初始化完成");
            function initialize() {
                console.log("WebDAV 初始化完成。");

                unsafeWindow.WebDAV = {
                    downloadLatest: downloadLatestConfig,
                    list: webdavClient.getFileList,
                    upload: uploadSave,
                    downloadSpecific: downloadSpecificConfig
                };
            }

            initialize();
            webdavInitialized = true; // 设置标志为已初始化
        }).catch(error => {
            ui.showModal("WebDAV 目录初始化失败: " + error.message);
        });
    }

    let floatingPanelContainer;
    function createFloatingPanel() {
        floatingPanelContainer = document.createElement('div');
        floatingPanelContainer.className = 'gooboo-floating-panel';

        const arrowButton = document.createElement('button');
        arrowButton.className = 'gooboo-floating-arrow';
        arrowButton.innerHTML = '▶';

        const menuContainer = document.createElement('div');
        menuContainer.className = 'gooboo-floating-menu';

        const uploadButton = document.createElement('button');
        uploadButton.textContent = '上传';
        uploadButton.addEventListener('click', uploadSave);
        menuContainer.appendChild(uploadButton);

        const latestButton = document.createElement('button');
        latestButton.textContent = '最新';
        latestButton.addEventListener('click', downloadLatestConfig);
        menuContainer.appendChild(latestButton);

        const listButton = document.createElement('button');
        listButton.textContent = '列表';
        listButton.addEventListener('click', downloadSpecificConfig);
        menuContainer.appendChild(listButton);

        const settingsButton = document.createElement('button');
        settingsButton.textContent = '设置';
        settingsButton.addEventListener('click', () => {
            ui.showSettingsPage();
        });
        menuContainer.appendChild(settingsButton);

        floatingPanelContainer.appendChild(menuContainer);
        floatingPanelContainer.appendChild(arrowButton);

        document.body.appendChild(floatingPanelContainer);

        arrowButton.addEventListener('click', toggleMenu);
        arrowButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 防止触摸事件触发点击
            toggleMenu();
        }, { passive: false });

        function toggleMenu() {
            const isActive = menuContainer.classList.toggle('active');
            if (isActive) {
                document.addEventListener('click', closeMenuOnOutside);
                document.addEventListener('touchstart', closeMenuOnOutside);
            } else {
                document.removeEventListener('click', closeMenuOnOutside);
                document.removeEventListener('touchstart', closeMenuOnOutside);
            }
        }

        function closeMenuOnOutside(event) {
            if (!floatingPanelContainer.contains(event.target)) {
                menuContainer.classList.remove('active');
                document.removeEventListener('click', closeMenuOnOutside);
                document.removeEventListener('touchstart', closeMenuOnOutside);
            }
        }
    }

    window.addEventListener('load', () => {
        if (showFloatingPanel) {
            createFloatingPanel();
        }
    });

    GM_registerMenuCommand("Gooboo 设置", () => {
        ui.showSettingsPage();
    });
    GM_registerMenuCommand("上传所有存档", uploadSave);
    GM_registerMenuCommand("下载最新配置", downloadLatestConfig);
    GM_registerMenuCommand("下载指定配置", downloadSpecificConfig);

})();
