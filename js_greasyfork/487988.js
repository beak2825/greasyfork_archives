// ==UserScript==
// @name         NGA优化摸鱼体验插件-自动同步数据
// @namespace    https://github.com/lifegpc/userscript/tree/master/NGA_BBS_plugins/AutoSyncData
// @version      1.0.4
// @author       lifegpc
// @description  通过WebDAV自动同步数据
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @require      https://unpkg.com/blueimp-md5@2.19.0/js/md5.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/487988/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/487988/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    const AutoSyncData = {
        name: 'AutoSyncData',
        title: '自动同步数据',
        desc: '通过WebDAV自动同步数据',
        settings: [{
            key: 'url',
            title: 'WebDAV地址',
            default: ''
        }, {
            key: 'username',
            title: 'WebDAV账号',
            default: ''
        }, {
            key: 'password',
            title: 'WebDAV密码',
            default: ''
        }, {
            key: 'backupKeywordsList',
            title: '备份关键词列表',
            default: true
        }, {
            key: 'keywordsListFileName',
            title: '关键词列表文件名',
            default: 'nga_bbs_script_data_keywords_list.json'
        }, {
            key: 'backupBanList',
            title: '备份黑名单列表',
            default: true
        }, {
            key: 'banListFileName',
            title: '黑名单列表文件名',
            default: 'nga_bbs_script_data_ban_list.json'
        }, {
            key: 'backupMarkList',
            title: '备份标记名单列表',
            default: true
        }, {
            key: 'markListFileName',
            title: '标记名单列表文件名',
            default: 'nga_bbs_script_data_mark_list.json'
        }, {
            key: 'metaFileName',
            title: '元数据文件名',
            default: 'nga_bbs_script_autosync_meta.json'
        }, {
            key: 'checkInterval',
            title: '检查间隔（单位：分）',
            default: 5
        }],
        buttons: [{
            title: '检查连接',
            action: 'testConnections'
        }, {
            title: '备份',
            action: 'backup'
        }, {
            title: '还原',
            action: 'restore'
        }],
        lastCheckInfo: {},
        beforeSaveSettingFunc(settings) {
            if (settings['checkInterval'] < 0) {
                return '检查间隔不能小于0。'
            }
            if (settings['keywordsListFileName'] == '') {
                return '关键词列表文件名不能为空。'
            }
            if (settings['banListFileName'] == '') {
                return '黑名单列表文件名不能为空。'
            }
            if (settings['markListFileName'] == '') {
                return '标记名单列表文件名不能为空。'
            }
            if (settings['metaFileName'] == '') {
                return '元数据文件名不能为空。'
            }
        },
        initFunc() {
            if (typeof this.pluginSettings['backupKeywordsList'] === 'string') {
                this.pluginSettings['backupKeywordsList'] = true
            }
            if (typeof this.pluginSettings['keywordsListFileName'] !== 'string' || this.pluginSettings['keywordsListFileName'] === '') {
                this.pluginSettings['keywordsListFileName'] = 'nga_bbs_script_data_keywords_list.json'
            }
            if (typeof this.pluginSettings['backupBanList'] === 'string') {
                this.pluginSettings['backupBanList'] = true
            }
            if (typeof this.pluginSettings['banListFileName'] !== 'string' || this.pluginSettings['banListFileName'] === '') {
                this.pluginSettings['banListFileName'] = 'nga_bbs_script_data_ban_list.json'
            }
            if (typeof this.pluginSettings['backupMarkList'] === 'string') {
                this.pluginSettings['backupMarkList'] = true
            }
            if (typeof this.pluginSettings['markListFileName'] !== 'string' || this.pluginSettings['markListFileName'] === '') {
                this.pluginSettings['markListFileName'] = 'nga_bbs_script_data_mark_list.json'
            }
            if (typeof this.pluginSettings['metaFileName'] !== 'string' || this.pluginSettings['metaFileName'] === '') {
                this.pluginSettings['metaFileName'] = 'nga_bbs_script_autosync_meta.json'
            }
            if (typeof this.pluginSettings['checkInterval'] !== 'number' || this.pluginSettings['checkInterval'] < 0) {
                this.pluginSettings['checkInterval'] = 5
            }
            try {
                this.lastCheckInfo = JSON.parse(this.mainScript.getValue("lifegpc__AutoSyncData_lastCheckInfo") ?? "{}");
            } catch (e) {
                this.printLog('读取上次检查信息失败', 'err');
                console.error(e);
            }
        },
        postProcFunc() {
            if (this.pluginInputs['url'].val()) {
                const _this = this;
                const handler = async () => {
                    const lastCheckTime = _this.lastCheckInfo['lastCheckTime'];
                    let lastCheckInfoChanged = false;
                    try {
                        if (typeof lastCheckTime !== 'number' || lastCheckTime + _this.pluginSettings['checkInterval'] * 60 * 1000 < Date.now()) {
                            const re = await _this.request({
                                method: 'GET',
                                path: _this.pluginSettings['metaFileName']
                            });
                            if (re == null) {
                                await _this.backup(true);
                                return;
                            }
                            const latestMeta = JSON.parse(re.responseText);
                            const localMeta = _this.lastCheckInfo['meta'] || {};
                            if (latestMeta.backupBanList) {
                                if (latestMeta.banListMd5 !== localMeta.banListMd5) {
                                    const filename = latestMeta.banListFileName;
                                    const banListStr = (await _this.request({
                                        method: 'GET',
                                        path: filename
                                    })).responseText;
                                    const banList = JSON.parse(banListStr);
                                    _this.mainScript.getModule('MarkAndBan').banList = banList;
                                    _this.mainScript.setValue("hld__NGA_ban_list", banListStr);
                                    _this.mainScript.popNotification('黑名单列表已更新');
                                    lastCheckInfoChanged = true;
                                }
                            }
                            if (latestMeta.backupKeywordsList) {
                                if (latestMeta.keywordsListMd5 !== localMeta.keywordsListMd5) {
                                    const filename = latestMeta.keywordsListFileName;
                                    const keywordsListStr = (await _this.request({
                                        method: 'GET',
                                        path: filename
                                    })).responseText;
                                    const keywordsList = JSON.parse(keywordsListStr);
                                    _this.mainScript.getModule('KeywordsBlock').keywordsList = keywordsList;
                                    _this.mainScript.setValue("hld__NGA_keywords_list", keywordsListStr);
                                    _this.mainScript.popNotification('关键词列表已更新');
                                    lastCheckInfoChanged = true;
                                }
                            }
                            if (latestMeta.backupMarkList) {
                                if (latestMeta.markListMd5 !== localMeta.markListMd5) {
                                    const filename = latestMeta.markListFileName;
                                    const markListStr = (await _this.request({
                                        method: 'GET',
                                        path: filename
                                    })).responseText;
                                    const markList = JSON.parse(markListStr);
                                    _this.mainScript.getModule('MarkAndBan').markList = markList;
                                    _this.mainScript.setValue("hld__NGA_mark_list", markListStr);
                                    _this.mainScript.popNotification('标记名单列表已更新');
                                    lastCheckInfoChanged = true;
                                }
                            }
                            _this.lastCheckInfo['meta'] = latestMeta;
                            lastCheckInfoChanged = true;
                            _this.lastCheckInfo['lastCheckTime'] = Date.now();
                        }
                        let metaChanged = false;
                        if (_this.pluginSettings['backupBanList']) {
                            const banList = _this.mainScript.getModule('MarkAndBan').banList;
                            const banListStr = JSON.stringify(banList);
                            const filename = _this.pluginSettings['banListFileName'];
                            const md5Sum = md5(banListStr);
                            const meta = _this.lastCheckInfo['meta'] || {};
                            if (md5Sum !== meta['banListMd5']) {
                                await _this.request({
                                    method: 'PUT',
                                    path: filename,
                                    data: banListStr
                                })
                                meta['banListMd5'] = md5Sum;
                                meta['banListModifiedTime'] = Date.now();
                                lastCheckInfoChanged = true;
                                metaChanged = true;
                                _this.mainScript.popNotification('已备份黑名单列表')
                            }
                        }
                        if (_this.pluginSettings['backupKeywordsList']) {
                            const keywordsList = _this.mainScript.getModule('KeywordsBlock').keywordsList;
                            const keywordsListStr = JSON.stringify(keywordsList);
                            const filename = _this.pluginSettings['keywordsListFileName'];
                            const md5Sum = md5(keywordsListStr);
                            const meta = _this.lastCheckInfo['meta'] || {};
                            if (md5Sum !== meta['keywordsListMd5']) {
                                await _this.request({
                                    method: 'PUT',
                                    path: filename,
                                    data: keywordsListStr
                                })
                                meta['keywordsListMd5'] = md5Sum;
                                meta['keywordsListModifiedTime'] = Date.now();
                                lastCheckInfoChanged = true;
                                metaChanged = true;
                                _this.mainScript.popNotification('已备份关键词列表')
                            }
                        }
                        if (_this.pluginSettings['backupMarkList']) {
                            const markList = _this.mainScript.getModule('MarkAndBan').markList;
                            const markListStr = JSON.stringify(markList);
                            const filename = _this.pluginSettings['markListFileName'];
                            const md5Sum = md5(markListStr);
                            const meta = _this.lastCheckInfo['meta'] || {};
                            if (md5Sum !== meta['markListMd5']) {
                                await _this.request({
                                    method: 'PUT',
                                    path: filename,
                                    data: markListStr
                                })
                                meta['markListMd5'] = md5Sum;
                                meta['markListModifiedTime'] = Date.now();
                                lastCheckInfoChanged = true;
                                metaChanged = true;
                                _this.mainScript.popNotification('已备份标记名单列表')
                            }
                        }
                        if (metaChanged) {
                            await _this.request({
                                method: 'PUT',
                                path: _this.pluginSettings['metaFileName'],
                                data: JSON.stringify(_this.lastCheckInfo['meta'])
                            });
                            _this.mainScript.popNotification('数据已同步');
                        }
                    } catch (e) {
                        _this.mainScript.printLog('检查连接失败');
                        console.log(e);
                    } finally {
                        try {
                            if (lastCheckInfoChanged) {
                                _this.mainScript.setValue("lifegpc__AutoSyncData_lastCheckInfo", JSON.stringify(_this.lastCheckInfo));
                            }
                        } catch (e) {
                            _this.mainScript.printLog('保存检查信息失败');
                            console.error(e);
                        }
                        setTimeout(handler, 1000);
                    }
                }
                this.timeout = setTimeout(handler, 1000);
            }
        },
        // 请求构造
        request({ method, path = '', headers, ...config }) {
            // 获取输入框的当前的值
            let url = this.pluginInputs['url'].val().trim()
            url[url.length - 1] !== '/' && (url += '/')
            const username = this.pluginInputs['username'].val().trim()
            const password = this.pluginInputs['password'].val().trim()
            this.buttons.forEach(button => button.$el.attr('disabled', true))
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url: url + path,
                    headers: {
                        authorization: 'Basic ' + btoa(`${username}:${password}`),
                        'Cache-control': 'no-cache',
                        ...headers
                    },
                    ...config,
                    onload: response => {
                        this.buttons.forEach(button => button.$el.removeAttr('disabled'))
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response)
                        } else {
                            if (method == 'GET' && response.status == 404) {
                                resolve(null);
                                return;
                            }
                            this.mainScript.popMsg(`WebDAV请求失败! 状态码: ${response.status} ${response.statusText}`, 'err')
                        }
                    },
                    onerror: error => {
                        reject(error);
                        this.buttons.forEach(button => button.$el.removeAttr('disabled'))
                        this.mainScript.popMsg(`WebDAV请求失败!${error}`);
                    }
                })
            })
        },
        // 获取文件列表
        getFileList() {
            return new Promise((resolve, reject) => {
                this.request({
                    method: 'PROPFIND',
                    headers: { depth: 1 }
                })
                    .then(res => {
                        let files = []
                        let path = res.responseText.match(/(?<=<d:href>).*?(?=<\/d:href>)/gi)
                        path.forEach(p => {
                            const filename = p.split('/').pop();
                            files.push(filename);
                        })
                        resolve(files)
                    })
            })
        },
        // 测试连通性
        async testConnections() {
            await this.getFileList()
            this.mainScript.popMsg('连接成功！同步配置看起来没问题')
        },
        // 备份配置
        async backup(saveMeta = false) {
            const meta = {
                backupBanList: this.pluginSettings['backupBanList'],
                backupKeywordsList: this.pluginSettings['backupKeywordsList'],
                backupMarkList: this.pluginSettings['backupMarkList'],
                banListFileName: this.pluginSettings['banListFileName'],
                banListMd5: '',
                keywordsListFileName: this.pluginSettings['keywordsListFileName'],
                keywordsListMd5: '',
                markListFileName: this.pluginSettings['markListFileName'],
                markListMd5: '',
                backupTime: Date.now(),
            };
            const bmeta = this.lastCheckInfo['meta'] || {};
            if (meta.backupBanList) {
                const banList = this.mainScript.getModule('MarkAndBan').banList;
                const banListStr = JSON.stringify(banList);
                const filename = meta.banListFileName;
                meta.banListMd5 = md5(banListStr);
                meta.banListModifiedTime = bmeta['banListModifiedTime'] || Date.now();
                await this.request({
                    method: 'PUT',
                    path: filename,
                    data: banListStr
                })
            }
            if (meta.backupKeywordsList) {
                const keywordsList = this.mainScript.getModule('KeywordsBlock').keywordsList;
                const keywordsListStr = JSON.stringify(keywordsList);
                const filename = meta.keywordsListFileName;
                meta.keywordsListMd5 = md5(keywordsListStr);
                meta.keywordsListModifiedTime = bmeta['keywordsListModifiedTime'] || Date.now();
                await this.request({
                    method: 'PUT',
                    path: filename,
                    data: keywordsListStr
                })
            }
            if (meta.backupMarkList) {
                const markList = this.mainScript.getModule('MarkAndBan').markList;
                const markListStr = JSON.stringify(markList);
                const filename = meta.markListFileName;
                meta.markListMd5 = md5(markListStr);
                meta.markListModifiedTime = bmeta['markListModifiedTime'] || Date.now();
                await this.request({
                    method: 'PUT',
                    path: filename,
                    data: markListStr
                })
            }
            const metaStr = JSON.stringify(meta);
            const filename = this.pluginSettings['metaFileName'];
            await this.request({
                method: 'PUT',
                path: filename,
                data: metaStr
            })
            this.mainScript.popMsg(`备份成功`)
            if (saveMeta) {
                this.lastCheckInfo['meta'] = meta;
                this.lastCheckInfo['lastCheckTime'] = Date.now();
                this.mainScript.setValue("lifegpc__AutoSyncData_lastCheckInfo", JSON.stringify(this.lastCheckInfo));
            }
        },
        async restore() {
            const filename = this.pluginSettings['metaFileName'];
            const meta = JSON.parse((await this.request({
                method: 'GET',
                path: filename
            })).responseText);
            if (meta.backupBanList) {
                const banList = this.mainScript.getModule('MarkAndBan').banList;
                const banListStr = JSON.stringify(banList);
                if (meta.banListMd5 !== md5(banListStr)) {
                    const filename = meta.banListFileName;
                    const banListStr = (await this.request({
                        method: 'GET',
                        path: filename
                    })).responseText;
                    const banList = JSON.parse(banListStr);
                    this.mainScript.getModule('MarkAndBan').banList = banList;
                    this.mainScript.setValue("hld__NGA_ban_list", banListStr);
                    this.mainScript.popNotification('黑名单列表已还原');
                }
            }
            if (meta.backupKeywordsList) {
                const keywordsList = this.mainScript.getModule('KeywordsBlock').keywordsList;
                const keywordsListStr = JSON.stringify(keywordsList);
                if (meta.keywordsListMd5 !== md5(keywordsListStr)) {
                    const filename = meta.keywordsListFileName;
                    const keywordsListStr = (await this.request({
                        method: 'GET',
                        path: filename
                    })).responseText;
                    const keywordsList = JSON.parse(keywordsListStr);
                    this.mainScript.getModule('KeywordsBlock').keywordsList = keywordsList;
                    this.mainScript.setValue("hld__NGA_keywords_list", keywordsListStr);
                    this.mainScript.popNotification('关键词列表已还原');
                }
            }
            if (meta.backupMarkList) {
                const markList = this.mainScript.getModule('MarkAndBan').markList;
                const markListStr = JSON.stringify(markList);
                if (meta.markListMd5 !== md5(markListStr)) {
                    const filename = meta.markListFileName;
                    const markListStr = (await this.request({
                        method: 'GET',
                        path: filename
                    })).responseText;
                    const markList = JSON.parse(markListStr);
                    this.mainScript.getModule('MarkAndBan').markList = markList;
                    this.mainScript.setValue("hld__NGA_mark_list", markListStr);
                    this.mainScript.popNotification('标记名单列表已还原');
                }
            }
            this.mainScript.popMsg(`还原成功`)
        }
    }
    registerPlugin(AutoSyncData)

})(function (plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});
