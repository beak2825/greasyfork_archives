// ==UserScript==
// @name         武神传说多开插件V1
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  自定义武神传说多开登录脚本，带设置界面
// @author       灰风&大智障改第二版（作者为武神角色名）
// @license      MIT
// @match        http://www.beijuhao.cn:13000/*
// @match        http://mush.fun/*
// @match        http://wsmud.aize.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aize.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542511/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4%E5%A4%9A%E5%BC%80%E6%8F%92%E4%BB%B6V1.user.js
// @updateURL https://update.greasyfork.org/scripts/542511/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4%E5%A4%9A%E5%BC%80%E6%8F%92%E4%BB%B6V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        IFRAME_SRC: 'mush.fun',
        TIMEOUT: 1e18,
        POLL_INTERVAL: 50
    };

    class SettingsManager {
        constructor() {
            this.isReconnectEnabled = localStorage.getItem('reconnectEnabled') === 'true';
        }

        saveReconnectSetting(value) {
            this.isReconnectEnabled = value;
            localStorage.setItem('reconnectEnabled', value);
        }

        getRoles() {
            return JSON.parse(localStorage.getItem('customRoles') || '[]');
        }

        getGroups() {
            return JSON.parse(localStorage.getItem('customGroups') || '{}');
        }

        saveGroups(groups) {
            localStorage.setItem('customGroups', JSON.stringify(groups));
        }
    }

    class Utility {
        static sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static async waitFor(condition, timeout = CONFIG.TIMEOUT) {
            let elapsed = 0;
            while (!condition() && elapsed < timeout) {
                elapsed += CONFIG.POLL_INTERVAL;
                await Utility.sleep(CONFIG.POLL_INTERVAL);
            }
            return condition();
        }

        static extractDomain(url) {
            const match = url.match(/http:\/\/([^\/]+)\//i);
            return match ? match[1] : '';
        }
    }

    class LoginHandler {
        constructor(settings) {
            this.settings = settings;
        }

        async loginMushFun({ id, p, s, u }) {
            //console.log('设置登录 cookie:', { p, s, u });
            document.cookie = `p=${p}; path=/; max-age=3600`;
            document.cookie = `s=${s}; path=/; max-age=3600`;
            document.cookie = `u=${u}; path=/; max-age=3600`;

            await Utility.sleep(2000); // 等待页面加载
            let retries = 3;
            let roleItem = null;
            while (retries > 0) {
                await Utility.waitFor(() => document.querySelector(`.role-item[roleid="${id}"]`), 10000);
                roleItem = document.querySelector(`.role-item[roleid="${id}"]`);
                if (roleItem) break;
                console.log(`角色 ${id} 未找到，重新设置 cookie并重试`);
                document.cookie = `p=${p}; path=/; max-age=3600`;
                document.cookie = `s=${s}; path=/; max-age=3600`;
                document.cookie = `u=${u}; path=/; max-age=3600`;
                await Utility.sleep(2000);
                retries--;
            }

            if (!roleItem) {
                console.error(`角色 ${id} 未找到`);
                return;
            }

            console.log(`找到角色 ${id}，执行点击`);
            roleItem.click();
            await Utility.sleep(1000);

            const selectRole = document.querySelector('.panel_item[command=SelectRole]');
            if (!selectRole) {
                console.error('未找到 SelectRole 按钮');
                return;
            }
            //console.log('执行 SelectRole 点击');
            selectRole.click();
            await Utility.sleep(1500);
            //console.log('发送 finished 消息');
            window.parent.postMessage('finished', '*');
        }

        async handleReconnect() {
            if (!this.settings.isReconnectEnabled) return;

            console.log('启动重连程序');
            await Utility.waitFor(() => typeof unsafeWindow !== 'undefined' &&
                                    unsafeWindow.G &&
                                    unsafeWindow.G.id);

            const isDisconnected = () => {
                const contentMessage = document.getElementsByClassName('content-message')[0];
                const nodes = contentMessage?.childNodes[0]?.childNodes;
                return nodes &&
                       nodes[nodes.length - 1].textContent === '\n' &&
                       nodes[nodes.length - 2].textContent === '你的连接中断了...';
            };

            while (this.settings.isReconnectEnabled) {
                await Utility.waitFor(isDisconnected);
                const scoreButton = document.querySelector('span[command=score]');
                if (scoreButton) {
                    scoreButton.click();
                    document.getElementsByClassName('content-message')[0]
                        .childNodes[0].childNodes.slice(-2)[0].innerText += '重连中';
                } else {
                    console.log('未找到属性按钮');
                }
            }
        }
    }

    class UIManager {
        static createIframeWindow(count) {
            const box = document.createElement('div');
            box.className = 'big_box';
            box.id = `box${count}`;

            const iframe = document.createElement('iframe');
            iframe.id = `f${count}`;
            iframe.src = `http://${CONFIG.IFRAME_SRC}/`;
            iframe.width = '20%';

            const cover = document.createElement('div');
            cover.className = 'disable';
            cover.id = `cover${count}`;
            cover.innerHTML = count.toString();
            cover.onclick = () => {
                cover.className = 'disable';
                box.className = 'big_box';
            };

            box.appendChild(iframe);
            box.appendChild(cover);
            document.getElementById('iframeArea').appendChild(box);
        }

        static createInitialButtons(showSettings, createGroupButton) {
            const float = document.getElementById('float');
            float.innerHTML = '';

            const topRow = document.createElement('div');
            topRow.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';

            const bottomRow = document.createElement('div');
            bottomRow.style.cssText = 'display: flex; gap: 10px;';

            const createButton = (id, text, onClick) => {
                const button = document.createElement('button');
                button.id = id;
                button.innerHTML = text;
                button.className = 'float';
                button.onclick = onClick;
                return button;
            };

            topRow.appendChild(createButton('buttonSettings', '设置', showSettings));
            float.appendChild(topRow);
            float.appendChild(bottomRow);

            createGroupButton(bottomRow);
            return { topRow, bottomRow };
        }

        static createControlButtons(count, topRow) {
            const createButton = (id, text, onClick) => {
                const button = document.createElement('button');
                button.id = id;
                button.innerHTML = text;
                button.className = 'float';
                button.onclick = onClick;
                return button;
            };

            topRow.innerHTML = '';
            topRow.appendChild(createButton('buttonMax', '全部最大化', () => {
                for (let i = 1; i <= count; i++) {
                    document.getElementById(`box${i}`).className = 'big_box';
                    document.getElementById(`cover${i}`).className = 'disable';
                }
            }));

            topRow.appendChild(createButton('buttonMin', '全部最小化', () => {
                for (let i = 1; i <= count; i++) {
                    document.getElementById(`box${i}`).className = 'small_box';
                    document.getElementById(`cover${i}`).className = 'cover';
                    document.getElementById(`box${i}`).style.height = '';
                }
            }));

            topRow.appendChild(createButton('buttonSettings', '设置', () => {
                if (!document.querySelector('.settings-panel')) {
                    new SettingsUI(settings, (groups) => multiLogin.updateGroupButtons(groups, settings.getRoles(), document.getElementById('float').querySelectorAll('div')[1])).createSettingsPanel();
                }
            }));
        }
    }

    class SettingsUI {
        constructor(settings, updateGroupButtons) {
            this.settings = settings;
            this.updateGroupButtons = updateGroupButtons;
        }

        createSettingsPanel() {
            if (document.querySelector('.settings-panel')) return;

            const div = document.createElement('div');
            div.className = 'settings-panel';
            div.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
                border: 1px solid #3498db;
                z-index: 1000;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            div.innerHTML = `
                <h3 style="color: #3498db;">设置</h3>
                <label><input type="checkbox" id="reconnectToggle" ${this.settings.isReconnectEnabled ? 'checked' : ''} style="margin-right: 5px;"> 启用自动重连</label><br><br>
                <h4 style="color: #3498db;">自定义分组</h4>
                <input type="text" id="groupName" placeholder="分组名称" style="background: #34495e; color: #ecf0f1; border: 1px solid #3498db; padding: 5px; border-radius: 4px;"><br>
                <input type="text" id="groupRoles" placeholder="角色名称，用逗号分隔" style="background: #34495e; color: #ecf0f1; border: 1px solid #3498db; padding: 5px; border-radius: 4px; margin-top: 5px;"><br>
                <button id="addGroup" style="background: #3498db; color: #ecf0f1; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">添加分组</button><br><br>
                <h4 style="color: #3498db;">现有分组</h4>
                <div id="groupList"></div><br>
                <h4 style="color: #3498db;">角色管理</h4>
                <input type="file" id="importRoles" accept=".json" style="margin-top: 10px;"><br>
                <button id="exportRoles" style="background: #2ecc71; color: #ecf0f1; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; margin-right: 10px;">导出角色</button>
                <h4 style="color: #3498db;">分组管理</h4>
                <input type="file" id="importGroups" accept=".json" style="margin-top: 10px;"><br>
                <button id="exportGroups" style="background: #2ecc71; color: #ecf0f1; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; margin-right: 10px;">导出分组</button>
                <button id="closeSettings" style="background: #e74c3c; color: #ecf0f1; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">关闭</button>
            `;
            document.body.appendChild(div);
            this.attachEventHandlers(div);
            this.updateGroupList();
        }

        attachEventHandlers(div) {
            const groups = this.settings.getGroups();

            document.getElementById('addGroup').onclick = () => {
                const groupName = document.getElementById('groupName').value.trim();
                const roles = document.getElementById('groupRoles').value.split(',').map(r => r.trim());
                if (groupName && roles.length > 0) {
                    groups[groupName] = roles;
                    this.settings.saveGroups(groups);
                    this.updateGroupList();
                    this.updateGroupButtons(groups);
                }
            };

            document.getElementById('exportRoles').onclick = () => {
                const roles = this.settings.getRoles();
                const blob = new Blob([JSON.stringify(roles, null, 2)], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'roles.json';
                a.click();
                URL.revokeObjectURL(url);
            };

            document.getElementById('importRoles').onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            localStorage.setItem('customRoles', e.target.result);
                            alert('角色导入成功！');
                        } catch (error) {
                            alert('角色导入失败：' + error.message);
                        }
                    };
                    reader.readAsText(file);
                }
            };

            document.getElementById('importGroups').onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            this.settings.saveGroups(JSON.parse(e.target.result));
                            this.updateGroupList();
                            this.updateGroupButtons(this.settings.getGroups());
                            alert('分组导入成功！');
                        } catch (error) {
                            alert('分组导入失败：' + error.message);
                        }
                    };
                    reader.readAsText(file);
                }
            };

            document.getElementById('exportGroups').onclick = () => {
                const blob = new Blob([JSON.stringify(groups, null, 2)], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'custom_groups.json';
                a.click();
                URL.revokeObjectURL(url);
            };

            document.getElementById('closeSettings').onclick = () => div.remove();
            document.getElementById('reconnectToggle').onchange = (e) =>
                this.settings.saveReconnectSetting(e.target.checked);

            window.deleteGroup = (groupName) => {
                delete groups[groupName];
                this.settings.saveGroups(groups);
                this.updateGroupList();
                this.updateGroupButtons(groups);
            };
        }

        updateGroupList() {
            const groupList = document.getElementById('groupList');
            groupList.innerHTML = '';
            const groups = this.settings.getGroups();
            for (const groupName in groups) {
                const div = document.createElement('div');
                div.style.marginBottom = '5px';
                div.innerHTML = `${groupName}: ${groups[groupName].join(', ')}
                    <button onclick="deleteGroup('${groupName}')" style="background: #e74c3c; color: #ecf0f1; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer;">删除</button>`;
                groupList.appendChild(div);
            }
        }
    }

    class MultiLoginManager {
        constructor(settings, loginHandler) {
            this.settings = settings;
            this.loginHandler = loginHandler;
        }

        async processSingleLogin(name, count, roles) {
            let ready = false;
            let finished = false;

            const messageHandler = (event) => {
                console.log('收到消息:', event.data);
                if (event.data === 'ready') {
                    ready = true;
                    console.log(`Iframe ${count} 已准备就绪`);
                }
                if (event.data === 'finished') {
                    finished = true;
                    console.log(`Iframe ${count} 登录完成`);
                }
            };

            window.addEventListener('message', messageHandler);
            try {
                const role = roles.find(r => r.name === name);
                if (!role) {
                    console.error(`未找到角色: ${name}`);
                    return;
                }

                UIManager.createIframeWindow(count);
                console.log(`创建 iframe ${count}, 等待就绪`);
                await Utility.waitFor(() => ready, 15000);
                if (!ready) {
                    console.error(`Iframe ${count} 未在规定时间内就绪`);
                    return;
                }
                console.log('发送角色数据:', role);
                document.getElementById(`f${count}`).contentWindow.postMessage(role, '*');
                await Utility.waitFor(() => finished, 20000);
                if (!finished) {
                    console.error(`Iframe ${count} 未在规定时间内完成登录`);
                    return;
                }
                //console.log(`窗口${count} 登录完成`);
            } catch (error) {
                console.error(`登录失败 for ${name}:`, error);
            } finally {
                window.removeEventListener('message', messageHandler);
            }
        }

        async handleLogin(group, roles, topRow, bottomRow) {
            console.log('开始登录，分组:', group);
            document.getElementById('aid').value = 0;
            document.getElementById('opa').click();
            bottomRow.innerHTML = '';
            UIManager.createControlButtons(group.length, topRow);

            let count = 0;
            for (const name of group) {
                await this.processSingleLogin(name, ++count, roles);
            }
        }

        updateGroupButtons(groups, roles, bottomRow) {
            bottomRow.innerHTML = '';
            for (const groupName in groups) {
                const button = document.createElement('button');
                button.className = 'float';
                button.innerText = groupName;
                button.onclick = () => this.handleLogin(
                    groups[groupName],
                    roles,
                    document.getElementById('float').querySelectorAll('div')[0],
                    bottomRow
                );
                bottomRow.appendChild(button);
            }
        }
    }

    const settings = new SettingsManager();
    const loginHandler = new LoginHandler(settings);
    const multiLogin = new MultiLoginManager(settings, loginHandler);

    async function main() {
        const currentDomain = Utility.extractDomain(document.location.href);
        console.log(`当前域名: ${currentDomain}`);

        if (currentDomain === CONFIG.IFRAME_SRC) {
            window.addEventListener('message', (event) => {
                if (event.data.id && event.data.p && event.data.s && event.data.u) {
                    //console.log('收到登录数据:', event.data);
                    loginHandler.loginMushFun(event.data);
                }
            }, false);
            //console.log('发送 ready 消息');
            window.parent.postMessage('ready', '*');
            loginHandler.handleReconnect();
        }

        if (currentDomain === 'wsmud.aize.org') {
            await Utility.waitFor(() => document.getElementById('float'));
            const roles = settings.getRoles();
            const groups = settings.getGroups();
            const { topRow, bottomRow } = UIManager.createInitialButtons(
                () => {
                    if (!document.querySelector('.settings-panel')) {
                        new SettingsUI(settings, (groups) => multiLogin.updateGroupButtons(groups, roles, bottomRow)).createSettingsPanel();
                    }
                },
                (bottomRow) => multiLogin.updateGroupButtons(groups, roles, bottomRow)
            );
        }
    }

    main().catch(console.error);
})();

