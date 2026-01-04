// ==UserScript==
// @name         Hostloc 帖子签名屏蔽工具
// @namespace    https://github.com/FlyxFly
// @version      0.3.0
// @description  根据关键字和用户名屏蔽帖子，根据用户名屏蔽签名
// @author       kiwi, Tongyi Lingma
// @match        https://hostloc.com/forum-*
// @match        https://hostloc.com/thread-*
// @match        https://hostloc.com/forum.php?mod=viewthread&tid=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant        GM_download
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/435442/Hostloc%20%E5%B8%96%E5%AD%90%E7%AD%BE%E5%90%8D%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435442/Hostloc%20%E5%B8%96%E5%AD%90%E7%AD%BE%E5%90%8D%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除数组中的空元素
    if (!Array.prototype.trim) {
        Array.prototype.trim = function() {
            return this.filter(x => x);
        };
    }

    // 查询数组是否存在某个值，忽略大小写
    if (!Array.prototype.contains) {
        Array.prototype.contains = function(target) {
            return this.some(item => item.toUpperCase().includes(target.toUpperCase()));
        };
    }

    class HostLocBlocker {
        constructor() {
            this.config = {
                blockedUser: [],
                blockedKeyword: [],
                blockedSignatureUser: []
            };
            this.dataKeys = ['blockedUser', 'blockedKeyword', 'blockedSignatureUser'];
            this.contentStorage = [];
            this.localStorageKey = 'hostlocBlockPlugin';
        }

        saveToLocal() {
            const toBeStored = {
                timestamp: new Date().getTime(),
                data: this.config
            };
            localStorage.setItem(this.localStorageKey, JSON.stringify(toBeStored));
        }

        restoreFromLocal() {
            const data = localStorage.getItem(this.localStorageKey);
            if (!data) {
                this.saveToLocal();
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                const keys = ['blockedUser', 'blockedKeyword', 'blockedSignatureUser'];
                
                if (keys.every(key => jsonData.data.hasOwnProperty(key))) {
                    this.config = jsonData.data;
                } else {
                    this.saveToLocal();
                }
            } catch (e) {
                this.saveToLocal();
            }
        }

        hideFromList() {
            const { blockedKeyword, blockedUser } = this.config;
            document.querySelectorAll('#threadlisttableid tbody').forEach(item => {
                if (item.id.includes('normalthread')) {
                    const title = item.querySelector('a.s.xst').innerText;
                    
                    // 根据关键字屏蔽
                    if (blockedKeyword.some(keyword => title.toUpperCase().includes(keyword.toUpperCase()))) {
                        item.style.display = 'none';
                        return;
                    }

                    // 根据用户名屏蔽
                    const nameA = item.querySelectorAll('td.by')[0].querySelector('a');
                    if (nameA) {
                        const userName = nameA.innerText.trim().toUpperCase();
                        if (blockedUser.contains(userName)) {
                            item.style.display = 'none';
                        }
                    }
                }
            });
        }

        hideReplyAndSignature() {
            const { blockedSignatureUser, blockedKeyword, blockedUser } = this.config;
            document.querySelectorAll('#postlist>div').forEach(post => {
                if (!post.id.includes('post_')) return;

                const userLink = post.querySelector('a.xw1');
                if (userLink) {
                    const userName = userLink.innerText.trim();
                    
                    // 根据用户名屏蔽发帖
                    if (blockedUser.includes(userName)) {
                        post.style.display = 'none';
                        return;
                    }

                    // 根据用户名屏蔽签名
                    if (blockedSignatureUser.includes(userName) && post.querySelector('div.sign')) {
                        const signature = post.querySelector('div.sign');
                        const contentText = signature.innerText;
                        const contentHTML = signature.innerHTML;
                        const storageKey = post.id + 'signature';
                        this.contentStorage[storageKey] = contentHTML;
                        signature.innerHTML = `<span style="font-style:italic;font-size:10px;color:gray" class="hidden-by-script" data-restore-key="${storageKey}" title="${contentText}">已屏蔽,鼠标移到此处查看内容,点击还原内容</span>`;
                    }
                }

                // 根据关键字屏蔽发帖内容
                post.querySelectorAll('td').forEach(td => {
                    if (td.id.includes('postmessage_')) {
                        const content = td.innerText;
                        for (let i = blockedKeyword.length - 1; i >= 0; i--) {
                            if (content.toUpperCase().includes(blockedKeyword[i].toUpperCase())) {
                                const contentHTML = td.innerHTML;
                                const contentText = td.innerText;
                                this.contentStorage[post.id] = contentHTML;
                                td.innerHTML = `<span style="font-style:italic;font-size:10px;color:gray" class="hidden-by-script" data-restore-key="${post.id}" title="${contentText}">已屏蔽，鼠标移到此处查看内容,点击还原内容</span>`;
                                break;
                            }
                        }
                    }
                });
            });
        }

        addSettingButton() {
            const p = document.querySelectorAll('#um p')[1];
            p.appendChild(this.htmlToElement(`<span class="pipe">|</span>`));
            p.appendChild(this.htmlToElement(`<a class="showmenu" id="show-block-panel">屏蔽名单设置</a>`));
        }

        htmlToElement(html) {
            const template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }

        addSettingPanel() {
            const div = document.createElement('div');
            div.id = 'hostloc-blocker-panel-wrapper';
            div.innerHTML = `
                <div id="hostloc-blocker-panel" class="modal">
                    <div class="modal-title">
                        <p>Hostloc 屏蔽插件设置面板</p>
                    </div>
                    <div class="modal-content">
                        <div class="columns">
                            <div class="column">
                                <label>屏蔽发帖</label>
                                <p class="help">每行一个<strong>区分大小写</strong></p>
                                <textarea name="blocked-user" id="blocked-user" cols="15" rows="10"></textarea>
                            </div>
                            <div class="column">
                                <label>屏蔽签名</label>
                                <p class="help">每行一个,<strong>区分大小写</strong></p>
                                <textarea name="blocked-signature-user" id="blocked-signature-user" cols="15" rows="10"></textarea>
                            </div>
                            <div class="column">
                                <label>屏蔽关键字</label>
                                <p class="help">每行一个，<strong>不分大小写</strong></p>
                                <textarea name="blocked-keyword" id="blocked-keyword" cols="15" rows="10"></textarea>
                            </div>
                        </div>
                        
                        <div class="url-loader">
                            <label>从URL加载配置</label>
                            <div class="url-loader-controls">
                                <input type="text" name="config-url" placeholder="输入配置文件URL">
                                <button class="load-url">加载</button>
                            </div>
                        </div>
                        
                        <div class="file-controls">
                            <button class="export-config">导出配置</button>
                            <input type="file" id="import-config" accept=".json" hidden>
                            <button class="import-config">导入配置</button>
                        </div>
                    </div>
                
                    <div class="modal-footer">
                        <button class="save">保存并关闭</button>
                        <p class="help">保存后刷新页面生效</p>
                    </div>
                </div>
                
                <style>
                    #hostloc-blocker-panel {
                        display: none;
                        background-color: white;
                        position: fixed;
                        left: 50%;
                        top: 100px;
                        transform: translateX(-50%);
                        padding: 20px;
                        width: 600px;
                        border-radius: 10px;
                        font-family:"Microsoft Yahei",Georgia, 'Times New Roman', Times, serif;
                        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
                        z-index: 9999;
                    }

                    #hostloc-blocker-panel.is-active {
                        display: block;
                    }
            
                    #hostloc-blocker-panel .modal-content p {
                        margin-bottom: 0;
                    }
            
                    #hostloc-blocker-panel ::-webkit-scrollbar {
                        width: 10px;
                    }
            
                    #hostloc-blocker-panel .columns {
                        margin-top: 10px;
                        display: flex;
                        justify-content: space-between;
                    }
                    
                    #hostloc-blocker-panel .column {
                        width: 32%;
                    }
            
                    #hostloc-blocker-panel label {
                        font-weight: 700;
                        font-size: 15px;
                    }
            
                    #hostloc-blocker-panel .modal-title {
                        text-align: center;
                        border-bottom: 1px solid rgb(238, 238, 238);
                    }
            
                    #hostloc-blocker-panel .modal-content {
                        padding-bottom: 20px;
                        border-bottom: 1px solid rgb(238, 238, 238);
                    }
                    
                    #hostloc-blocker-panel .modal-content .help {
                        color: rgb(43, 43, 43);
                        font-size: 11px;
                        margin-top: 0;
                    }
                    
                    #hostloc-blocker-panel .url-loader {
                        margin-top: 15px;
                    }
                    
                    #hostloc-blocker-panel .url-loader-controls {
                        display: flex;
                        margin-top: 5px;
                    }
                    
                    #hostloc-blocker-panel .url-loader-controls input {
                        flex: 1;
                        margin-right: 10px;
                    }
                    
                    #hostloc-blocker-panel .file-controls {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 15px;
                    }
                    
                    #hostloc-blocker-panel .file-controls button {
                        width: 48%;
                    }
            
                    #hostloc-blocker-panel .modal-content textarea, 
                    #hostloc-blocker-panel .modal-content input {
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        color: #363636;
                        border-color: 1px solid #b5b5b5;
                        font-size: 15px;
                        padding: 5px;
                    }
                    
                    #hostloc-blocker-panel textarea:hover, 
                    #hostloc-blocker-panel input:hover {
                        border-color: #b5b5b5;
                    }
                    
                    #hostloc-blocker-panel textarea:focus, 
                    #hostloc-blocker-panel input:focus {
                        outline: none;
                    }
            
                    #hostloc-blocker-panel .modal-footer {
                        padding: 15px 30px 0;
                        text-align: right;
                    }
            
                    #hostloc-blocker-panel .modal-footer button,
                    #hostloc-blocker-panel .url-loader-controls button,
                    #hostloc-blocker-panel .file-controls button {
                        padding: 8px 15px;
                        border-color: #235994;
                        background-color: #06C;
                        color: #FFF;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>`;
            document.body.appendChild(div);
        }

        addPanelEvents() {
            const panel = document.querySelector('#hostloc-blocker-panel');
            const saveButton = panel.querySelector('.save');
            const textareaBlockedUser = panel.querySelector('textarea[name="blocked-user"]');
            const textareaBlockedSignatureUser = panel.querySelector('textarea[name="blocked-signature-user"]');
            const textareaBlockedKeyword = panel.querySelector('textarea[name="blocked-keyword"]');
            const openPanelLink = document.querySelector('#show-block-panel');
            const loadUrlButton = panel.querySelector('.load-url');
            const configUrlInput = panel.querySelector('input[name="config-url"]');
            const exportButton = panel.querySelector('.export-config');
            const importButton = panel.querySelector('.import-config');
            const importFileInput = panel.querySelector('#import-config');

            // 阻止面板点击事件冒泡
            panel.addEventListener('click', event => {
                event.stopPropagation();
            });

            // 点击页面其他地方关闭面板
            document.body.addEventListener('click', () => {
                panel.classList.remove('is-active');
            });

            // 打开设置面板
            openPanelLink.addEventListener('click', event => {
                event.stopPropagation();
                textareaBlockedKeyword.value = this.config.blockedKeyword.join('\n');
                textareaBlockedSignatureUser.value = this.config.blockedSignatureUser.join('\n');
                textareaBlockedUser.value = this.config.blockedUser.join('\n');
                panel.classList.add('is-active');
            });

            // 保存配置
            saveButton.addEventListener('click', () => {
                this.config.blockedKeyword = textareaBlockedKeyword.value.split('\n').trim();
                this.config.blockedSignatureUser = textareaBlockedSignatureUser.value.split('\n').trim();
                this.config.blockedUser = textareaBlockedUser.value.split('\n').trim();
                
                this.saveToLocal();
                this.startBlockProcess();
                panel.classList.remove('is-active');
            });

            // 从URL加载配置
            loadUrlButton.addEventListener('click', () => {
                const url = configUrlInput.value.trim();
                if (!url) {
                    swal('请输入有效的URL', '', 'warning');
                    return;
                }

                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('网络响应错误');
                        return response.json();
                    })
                    .then(data => {
                        if (this.validateConfig(data)) {
                            this.config = data;
                            textareaBlockedKeyword.value = this.config.blockedKeyword.join('\n');
                            textareaBlockedSignatureUser.value = this.config.blockedSignatureUser.join('\n');
                            textareaBlockedUser.value = this.config.blockedUser.join('\n');
                            swal('配置加载成功', '', 'success');
                        } else {
                            swal('配置文件格式不正确', '缺少必要字段', 'error');
                        }
                    })
                    .catch(error => {
                        swal('加载失败', error.message, 'error');
                    });
            });

            // 导出配置
            exportButton.addEventListener('click', () => {
                const dataStr = JSON.stringify(this.config, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = 'loc-bitches.json';
                link.click();
            });

            // 触发文件选择
            importButton.addEventListener('click', () => {
                importFileInput.click();
            });

            // 导入配置文件
            importFileInput.addEventListener('change', event => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = e => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (this.validateConfig(data)) {
                            this.config = data;
                            textareaBlockedKeyword.value = this.config.blockedKeyword.join('\n');
                            textareaBlockedSignatureUser.value = this.config.blockedSignatureUser.join('\n');
                            textareaBlockedUser.value = this.config.blockedUser.join('\n');
                            saveButton.click();
                            swal('配置导入成功', '', 'success');
                            
                        } else {
                            swal('配置文件格式不正确', '缺少必要字段', 'error');
                        }
                    } catch (error) {
                        swal('文件解析失败', error.message, 'error');
                    }
                };
                reader.readAsText(file);
                event.target.value = ''; // 重置input以便下次选择同一文件
            });
        }

        // 验证配置文件结构
        validateConfig(config) {
            return this.dataKeys.every(key => 
                config.hasOwnProperty(key) && Array.isArray(config[key])
            );
        }

        startBlockProcess() {
            if (location.href.includes('forum')) {
                this.hideFromList();
            }

            if (location.href.includes('thread')) {
                this.hideReplyAndSignature();
            }

            // 监听点击事件，恢复被屏蔽的签名和帖子
            if (location.href.includes('thread')) {
                document.querySelector('#postlist').addEventListener('click', e => {
                    const item = e.target;
                    if (item.classList.contains('hidden-by-script')) {
                        item.innerHTML = this.contentStorage[item.dataset.restoreKey];
                        item.title = '';
                        item.style = '';
                    }
                });
            }
        }

        init() {
            this.addSettingPanel();
            this.addSettingButton();
            this.addPanelEvents();
            this.restoreFromLocal();
            this.startBlockProcess();
        }
    }

    const app = new HostLocBlocker();
    app.init();
})();