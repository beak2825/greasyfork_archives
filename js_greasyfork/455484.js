// ==UserScript==
// @name         bilibili - 搜索过滤up
// @version      2.1.0
// @description  搜索页增搜索过滤up
// @author       会飞的蛋蛋面
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/element-ui@2.15.13/lib/index.min.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/455484/bilibili%20-%20%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4up.user.js
// @updateURL https://update.greasyfork.org/scripts/455484/bilibili%20-%20%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4up.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STYLE_URL = 'https://cdn.jsdelivr.net/npm/element-ui@2.15.13/lib/theme-chalk/index.min.css';
    const STORAGE_KEY = 'ignoredUpList';
    const TOOLBAR_SELECTOR = '.flex_center';
    const RESULTS_SELECTOR = '.search-page-wrapper';
    const AUTHOR_SELECTOR = '.bili-video-card__info--author';
    const CARD_SELECTOR = '.bili-video-card';
    const SEARCH_INPUT_SELECTOR = '.search-input-wrap.flex_between';
    const PANEL_TEMPLATE = `
        <div id="biliFilterUpApp" class="flex_between" style="padding-left:20px;">
            <i class="el-icon-delete" @click="inputVisible=!inputVisible" style="padding-right:20px;font-size:20px;"></i>
            <template v-if="inputVisible">
                <el-input placeholder="up name" v-model="submitUpName" @keyup.enter.native="saveUp">
                    <el-select v-model="fuzzyMode" slot="prepend" style="width:80px">
                        <el-option label="精准" value="0"></el-option>
                        <el-option label="模糊" value="1"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-upload" size="small" @click="saveUp">提交</el-button>
                </el-input>
                <i class="el-icon-toilet-paper" style="padding-left:20px;font-size:20px;" @click="filterDialogVisible=true"></i>
            </template>
            <el-dialog title="过滤列表" :visible.sync="filterDialogVisible" width="30%" append-to-body>
                <el-table :data="ignoredUpList">
                    <el-table-column property="upName" label="up"></el-table-column>
                    <el-table-column label="模式">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.fuzzyMode === '0'">精准</el-tag>
                            <el-tag v-else>模糊</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="deleteUp(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </div>
    `;

    function injectElementUI() {
        if (document.querySelector(`link[href="${STYLE_URL}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = STYLE_URL;
        document.head.appendChild(link);
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) {
                resolve(existing);
                return;
            }

            const observer = new MutationObserver(() => {
                const target = document.querySelector(selector);
                if (target) {
                    observer.disconnect();
                    resolve(target);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    const storage = {
        load() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch (_) {
                return [];
            }
        },
        save(list) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        },
    };

    function mountApp() {
        new Vue({
            el: '#biliFilterUpApp',
            data: {
                inputVisible: false,
                filterDialogVisible: false,
                submitUpName: '',
                fuzzyMode: '0',
                ignoredUpList: [],
                resultObserver: null,
            },
            mounted() {
                this.refreshList();
                this.observeResult();
            },
            beforeDestroy() {
                if (this.resultObserver) this.resultObserver.disconnect();
            },
            methods: {
                refreshList() {
                    this.ignoredUpList = storage.load();
                    this.filterUpName();
                },
                saveUp() {
                    const name = this.submitUpName.trim();
                    if (!name) {
                        this.$message.warning('up name不能为空');
                        return;
                    }
                    const duplicated = this.ignoredUpList.some(
                        item => item.upName === name && item.fuzzyMode === this.fuzzyMode,
                    );
                    if (duplicated) {
                        this.$message.info('已存在相同规则');
                        return;
                    }
                    const nextList = [...this.ignoredUpList, { upName: name, fuzzyMode: this.fuzzyMode }];
                    this.persist(nextList);
                    this.submitUpName = '';
                    this.$message.success('保存成功');
                    this.filterUpName();
                },
                deleteUp(row) {
                    const nextList = this.ignoredUpList.filter(
                        item => item.upName !== row.upName || item.fuzzyMode !== row.fuzzyMode,
                    );
                    this.persist(nextList);
                    this.filterUpName();
                },
                persist(list) {
                    this.ignoredUpList = list;
                    storage.save(list);
                },
                observeResult() {
                    waitForElement(RESULTS_SELECTOR).then(container => {
                        if (this.resultObserver) this.resultObserver.disconnect();
                        this.filterUpName();
                        this.resultObserver = new MutationObserver(() => this.filterUpName());
                        this.resultObserver.observe(container, { childList: true, subtree: true });
                    });
                },
                filterUpName() {
                    if (!this.ignoredUpList.length) return;
                    const nodes = document.querySelectorAll(AUTHOR_SELECTOR);
                    nodes.forEach(node => {
                        const currentName = node.textContent.trim();
                        const match = this.ignoredUpList.some(rule =>
                            rule.fuzzyMode === '1' ? currentName.includes(rule.upName) : currentName === rule.upName,
                        );
                        if (match) {
                            const card = node.closest(CARD_SELECTOR);
                            if (card) card.remove();
                        }
                    });
                },
            },
        });
    }

    injectElementUI();
    waitForElement(TOOLBAR_SELECTOR).then(container => {
        const searchInput = document.querySelector(SEARCH_INPUT_SELECTOR);
        if (searchInput) searchInput.style.margin = '0';
        container.insertAdjacentHTML('beforeend', PANEL_TEMPLATE);
        mountApp();
    });
})();
