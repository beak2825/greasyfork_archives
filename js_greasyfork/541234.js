// ==UserScript==
// @name         网易云音乐网页版脚本
// @namespace    http://tampermonkey.net/
// @version      29.0
// @description  解锁网页完全歌单，来自公开音源.更改权限
// @author       YourName & Gemini
// @match        *://music.163.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541234/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%BD%91%E9%A1%B5%E7%89%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541234/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%BD%91%E9%A1%B5%E7%89%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 新增: 设置Cookie ---
    // 强制将 os cookie 设置为 'pc'，以获取桌面端体验
    document.cookie = 'os=pc; domain=.music.163.com; path=/; max-age=31536000';

    function log(message, ...args) {
        console.log(`[NCM Unlocker v28.0]`, message, ...args);
    }

    // --- 权限修改器 ---
    function Privileger() {
        const P = this;
        const levelData = {};
        P.levelData = levelData;
        P.fix = fix;

        function fix(privilege) {
            if (!privilege) return false;

            const RATES = {
                'none': 0,
                'standard': 128000,
                'exhigh': 320000,
                'lossless': 999000,
            };

            const dlLevel = privilege.downloadMaxBrLevel;
            const dlRate = RATES[dlLevel];
            const plLevel = privilege.playMaxBrLevel;
            const plRate = RATES[plLevel];
            privilege.dlLevel = dlLevel; // Download
            privilege.dl = dlRate;       // Download
            privilege.plLevel = plLevel; // Play
            privilege.pl = plRate;       // Play
            privilege.st = 0;            // Copyright
            levelData[privilege.id] = {dlLevel, dlRate, plLevel, plRate};

            return true;
        }
    }

    // 创建Privileger实例
    const PV = new Privileger();

    // --- API注入 ---
    const APIHooker = {
        hooks: [],
        originalOpen: XMLHttpRequest.prototype.open,
        originalSend: XMLHttpRequest.prototype.send,

        hook: function(urlMatcher, dealer) {
            this.hooks.push({ matcher: urlMatcher, dealer: dealer });
        },

        init: function() {
            const self = this;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this._hook = self.hooks.find(h => h.matcher.test(url));
                return self.originalOpen.apply(this, [method, url, ...args]);
            };

            XMLHttpRequest.prototype.send = function(...sendArgs) {
                if (this._hook) {
                    const hook = this._hook;
                    let originalOnReadyStateChange = this.onreadystatechange;

                    this.onreadystatechange = function(...progressArgs) {
                        if (this.readyState === 4 && this.status === 200) {
                            hook.dealer(this, originalOnReadyStateChange, progressArgs);
                        } else if (originalOnReadyStateChange) {
                            originalOnReadyStateChange.apply(this, progressArgs);
                        }
                    };
                }
                return self.originalSend.apply(this, sendArgs);
            };
        }
    };

    // --- 核心逻辑 ---
    function main() {
        APIHooker.init();
        log('Cookie "os=pc" 已设置，注入器已初始化。');

        const requestState = {};

        // --- 预加载数据处理 ---
        // 处理页面变化
        log('设置页面变化监听器...');

        // 任务管理
        const tasks = [];
        let intervalId = null;

        function addTask(task) {
            if (!tasks.includes(task)) {
                tasks.push(task);
                if (!intervalId) {
                    intervalId = setInterval(runTasks, 50);
                    log(`任务调度器启动，当前任务数: ${tasks.length}`);
                }
            }
        }

        function removeTask(task) {
            const index = tasks.indexOf(task);
            if (index !== -1) {
                tasks.splice(index, 1);
                log(`任务已移除，剩余任务数: ${tasks.length}`);
                if (tasks.length === 0 && intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                    log('任务调度器已停止');
                }
            }
        }

        function runTasks() {
            tasks.forEach(task => task());
        }

        // 页面变化检测器
        function pageChangeDetecter() {
            const iframe = document.getElementById('g_iframe');
            if (!iframe || !iframe.contentWindow || !iframe.contentWindow.location) {
                return;
            }

            const currentUrl = iframe.contentWindow.location.href;

            if (pageChangeDetecter.lastUrl !== currentUrl) {
                log(`检测到页面变化: ${pageChangeDetecter.lastUrl} -> ${currentUrl}`);
                deliverPageFuncs(pageChangeDetecter.lastUrl, currentUrl);
                pageChangeDetecter.lastUrl = currentUrl;
            }
        }
        pageChangeDetecter.lastUrl = '';

        // 注入iframe
        function inject_iframe() {
            const ifr = document.getElementById('g_iframe');
            if (!ifr) {
                return;
            }

            if (ifr.contentWindow && ifr.contentDocument &&
                ifr.contentWindow.location &&
                ifr.contentWindow.location.host === 'music.163.com') {

                const currentUrl = ifr.contentWindow.location.href;
                log(`iframe已加载: ${currentUrl}`);

                if (pageChangeDetecter.lastUrl !== currentUrl) {
                    deliverPageFuncs(pageChangeDetecter.lastUrl, currentUrl);
                    pageChangeDetecter.lastUrl = currentUrl;
                }

                // 监听iframe内容变化
                const observer = new MutationObserver((mutations) => {
                    pageChangeDetecter();
                });

                observer.observe(ifr.contentDocument.body || ifr.contentDocument.documentElement, {
                    childList: true,
                    subtree: true
                });

                log('已设置iframe内容变化监听');

                // 监听hash变化
                window.addEventListener('hashchange', () => {
                    log('检测到hash变化');
                    setTimeout(pageChangeDetecter, 100);
                });

                removeTask(inject_iframe);
                addTask(pageChangeDetecter);
            }
        }

        // 分发页面处理函数
        function deliverPageFuncs(href, new_href) {
            log(`处理页面变化: ${new_href}`);

            const pageFuncs = [
                {
                    reg: /^https?:\/\/music\.163\.com\/(?:#\/)?artist(?:\?.*)?$/,
                    func: replacePredata,
                    name: 'replacePredata (artist)'
                },
                {
                    reg: /^https?:\/\/music\.163\.com\/(?:#\/)?album(?:\?.*)?$/,
                    func: replacePredata,
                    name: 'replacePredata (album)'
                },
                {
                    reg: /^https?:\/\/music\.163\.com\/(?:#\/)?discover\/toplist(?:\?.*)?$/,
                    func: replacePredata,
                    name: 'replacePredata (toplist)'
                },
                {
                    reg: /^https?:\/\/music\.163\.com\/.*playlist.*$/,
                    func: replacePredata_encoded,
                    name: 'replacePredata_encoded (playlist)'
                }
            ];

            let matched = false;

            for (const pageFunc of pageFuncs) {
                if (pageFunc.reg.test(new_href)) {
                    matched = true;
                    log(`匹配到页面处理函数: ${pageFunc.name}`);

                    setTimeout(() => {
                        try {
                            log(`执行页面处理函数: ${pageFunc.name}`);
                            pageFunc.func();
                        } catch (e) {
                            log(`❌ 页面处理函数执行失败: ${pageFunc.name}`, e);
                        }
                    }, 100);
                }
            }

            if (!matched) {
                log('没有匹配的页面处理函数');
            }
        }

        // 启动页面监控
        log('启动页面监控...');
        addTask(inject_iframe);

        // --- 权限绕过 ---
        // 拦截歌曲详情API
        APIHooker.hook(
            /\/weapi\/v3\/song\/detail/,
            (xhr, originalCallback, callbackArgs) => {
                try {
                    let data = JSON.parse(xhr.responseText);
                    let modified = false;

                    // 修改歌曲权限
                    if (data.privileges && data.privileges.length > 0) {
                        data.privileges.forEach(privilege => {
                            if (PV.fix(privilege)) {
                                modified = true;
                            }
                        });

                        if (modified) {
                            log('✅ 歌曲详情权限已修改');
                            rewriteResponse(xhr, data);
                        }
                    }
                } catch(e) {
                    log('❌ 修改歌曲详情权限失败', e);
                }

                if (originalCallback) originalCallback.apply(xhr, callbackArgs);
            }
        );

        // 拦截播放记录API
        APIHooker.hook(
            /\/weapi\/v1\/play\/record/,
            (xhr, originalCallback, callbackArgs) => {
                try {
                    let data = JSON.parse(xhr.responseText);
                    let modified = false;

                    // 修改所有数据中的权限
                    if (data.allData) {
                        data.allData.forEach(item => {
                            if (item.song && item.song.privilege) {
                                if (PV.fix(item.song.privilege)) {
                                    modified = true;
                                }
                            }
                        });
                    }

                    // 修改周数据中的权限
                    if (data.weekData) {
                        data.weekData.forEach(item => {
                            if (item.song && item.song.privilege) {
                                if (PV.fix(item.song.privilege)) {
                                    modified = true;
                                }
                            }
                        });
                    }

                    // 重写响应
                    if (modified) {
                        log('✅ 播放记录权限已修改');
                        rewriteResponse(xhr, data);
                    }
                } catch(e) {
                    log('❌ 修改播放记录权限失败', e);
                }

                if (originalCallback) originalCallback.apply(xhr, callbackArgs);
            }
        );

        // 拦截歌单详情API (更精确的匹配)
        APIHooker.hook(
            /\/weapi\/v6\/playlist\/detail/,
            (xhr, originalCallback, callbackArgs) => {
                try {
                    let data = JSON.parse(xhr.responseText);
                    let modified = false;

                    // 修改歌单中所有歌曲的权限
                    if (data.privileges && data.privileges.length > 0) {
                        data.privileges.forEach(privilege => {
                            if (PV.fix(privilege)) {
                                modified = true;
                            }
                        });
                    }

                    // 检查是否有tracks数据并修改
                    if (data.playlist && data.playlist.tracks) {
                        data.playlist.tracks.forEach(track => {
                            if (track.privilege && PV.fix(track.privilege)) {
                                modified = true;
                            }
                        });
                    }

                    if (modified) {
                        log('✅ 歌单详情权限已修改');
                        rewriteResponse(xhr, data);
                    }
                } catch(e) {
                    log('❌ 修改歌单详情权限失败', e);
                }

                if (originalCallback) originalCallback.apply(xhr, callbackArgs);
            }
        );

        // --- 音源注入 ---
        APIHooker.hook(/\/weapi\/song\/enhance\/player\/url\/v1/, (xhr, originalCallback, callbackArgs) => {
            let originalResponse;
            try { originalResponse = JSON.parse(xhr.responseText); } catch (e) {
                if (originalCallback) originalCallback.apply(xhr, callbackArgs); return;
            }

            const songData = originalResponse.data[0];
            if (!songData || !songData.id || (songData.url && songData.code === 200)) {
                if (originalCallback) originalCallback.apply(xhr, callbackArgs); return;
            }

            if (requestState[songData.id] === 'processing') return;
            requestState[songData.id] = 'processing';

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://wyy-api-three.vercel.app/song/url?id=${songData.id}&quality=320k`,
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const customData = JSON.parse(response.responseText);
                            const customUrl = customData.url;
                            if (customUrl) {
                                const fakeResponse = {
                                    data: [{
                                        ...songData,
                                        url: customUrl,
                                        br: 320000,
                                        code: 200,
                                        type: 'mp3',
                                        fee: 0,
                                        md5: '0',
                                        level: 'exhigh',
                                        flag: 0
                                    }],
                                    code: 200
                                };
                                rewriteResponse(xhr, fakeResponse);
                                log(`✅ 音源注入成功 (ID: ${songData.id})`);
                            }
                        }
                    } catch (e) { log('❌ 音源注入失败', e); }
                    if (originalCallback) originalCallback.apply(xhr, callbackArgs);
                    setTimeout(() => delete requestState[songData.id], 500);
                },
                onerror: function(e) {
                    log('❌ 音源请求失败', e);
                    if (originalCallback) originalCallback.apply(xhr, callbackArgs);
                    setTimeout(() => delete requestState[songData.id], 500);
                }
            });
        });
    }

    // --- 预加载数据处理函数 ---
    // 处理普通预加载数据
    function replacePredata() {
        log('开始处理普通预加载数据...');

        const iframe = document.getElementById('g_iframe');
        if (!iframe) {
            log('⏳ 未找到iframe，等待...');
            setTimeout(replacePredata, 50);
            return;
        }

        const oDoc = iframe.contentDocument;
        if (!oDoc) {
            log('⏳ 未找到iframe文档，等待...');
            setTimeout(replacePredata, 50);
            return;
        }

        log('iframe文档已找到，开始查找预加载数据...');

        // 尝试钩住Element.prototype.getElementsByTagName
        try {
            log('尝试钩住getElementsByTagName...');
            const originalGetElementsByTagName = Element.prototype.getElementsByTagName;

            Element.prototype.getElementsByTagName = function(tagName) {
                const result = originalGetElementsByTagName.call(this, tagName);

                try {
                    if (this.id === 'song-list-pre-cache' && tagName === 'textarea') {
                        log('✅ 捕获到song-list-pre-cache的textarea查询');
                        setTimeout(() => {
                            try {
                                const elmData = this.querySelector('textarea');
                                if (elmData) {
                                    log('找到textarea元素，尝试处理普通预加载数据...');
                                    changeValue(elmData);
                                }
                            } catch (e) {
                                log('❌ 处理textarea时出错:', e);
                            }
                        }, 0);
                    }
                } catch (e) {
                    log('❌ getElementsByTagName钩子出错:', e);
                }

                return result;
            };

            log('✅ 成功钩住getElementsByTagName');

            // 10秒后恢复原始方法
            setTimeout(() => {
                if (Element.prototype.getElementsByTagName !== originalGetElementsByTagName) {
                    Element.prototype.getElementsByTagName = originalGetElementsByTagName;
                    log('✅ 已恢复原始getElementsByTagName');
                }
            }, 10000);
        } catch (e) {
            log('❌ 钩住getElementsByTagName失败:', e);
        }

        // 直接查找元素
        const elmData = oDoc.getElementById('song-list-pre-data');
        if (!elmData) {
            // 数据元素未找到，检查是否已经处理过
            if (oDoc.querySelector('#song-list-pre-cache table')) {
                // 太晚了，数据已经被处理
                log('❌ 预加载数据处理失败：数据已被处理');
            } else {
                // 数据尚未加载，等待并尝试钩住getElementsByTagName
                log('⏳ 预加载数据未找到，等待加载...');

                // 创建MutationObserver监听DOM变化
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes) {
                            for (const node of mutation.addedNodes) {
                                if (node.id === 'song-list-pre-data') {
                                    observer.disconnect();
                                    log('✅ MutationObserver找到预加载数据');
                                    changeValue(node);
                                    return;
                                }
                            }
                        }
                    }
                });

                // 开始观察
                observer.observe(oDoc.body || oDoc.documentElement, {
                    childList: true,
                    subtree: true
                });

                // 设置超时，防止无限等待
                setTimeout(() => {
                    observer.disconnect();
                    log('⚠️ 预加载数据处理超时');
                }, 10000);
            }
            return;
        } else {
            // 找到数据元素，直接修改
            log('✅ 直接找到预加载数据，修改中...');
            changeValue(elmData);
        }

        function changeValue(elmData) {
            try {
                log('开始处理预加载数据:', elmData.value.substring(0, 100) + '...');
                const list = JSON.parse(elmData.value);

                if (!Array.isArray(list)) {
                    log('❌ 预加载数据不是数组');
                    return;
                }

                log(`找到预加载数据数组，长度: ${list.length}`);
                let modified = false;

                list.forEach((song, index) => {
                    if (song.privilege) {
                        log(`处理第${index}首歌曲权限...`);
                        if (PV.fix(song.privilege)) {
                            modified = true;
                        }
                    } else {
                        log(`第${index}首歌曲没有privilege属性`);
                    }
                });

                if (modified) {
                    elmData.value = JSON.stringify(list);
                    log('✅ 预加载数据权限已成功修改');
                } else {
                    log('⚠️ 没有找到需要修改的权限数据');
                }
            } catch (e) {
                log('❌ 预加载数据处理失败:', e);
            }
        }
    }

    // 处理加密的预加载数据
    function replacePredata_encoded() {
        log('开始处理加密预加载数据...');

        const iframe = document.getElementById('g_iframe');
        if (!iframe) {
            log('⏳ 未找到iframe，等待...');
            setTimeout(replacePredata_encoded, 50);
            return;
        }

        const oDoc = iframe.contentDocument;
        const oWin = iframe.contentWindow;
        if (!oDoc) {
            log('⏳ 未找到iframe文档，等待...');
            setTimeout(replacePredata_encoded, 50);
            return;
        }

        log('iframe文档已找到，开始查找预加载数据...');

        // 尝试钩住Element.prototype.getElementsByTagName
        try {
            log('尝试钩住getElementsByTagName...');
            const originalGetElementsByTagName = Element.prototype.getElementsByTagName;

            Element.prototype.getElementsByTagName = function(tagName) {
                const result = originalGetElementsByTagName.call(this, tagName);

                try {
                    if (this.id === 'song-list-pre-cache' && tagName === 'textarea') {
                        log('✅ 捕获到song-list-pre-cache的textarea查询');
                        setTimeout(() => {
                            try {
                                const elmData = this.querySelector('textarea');
                                if (elmData) {
                                    log('找到textarea元素，尝试处理加密数据...');
                                    changeValue(elmData);
                                }
                            } catch (e) {
                                log('❌ 处理textarea时出错:', e);
                            }
                        }, 0);
                    }
                } catch (e) {
                    log('❌ getElementsByTagName钩子出错:', e);
                }

                return result;
            };

            log('✅ 成功钩住getElementsByTagName');

            // 10秒后恢复原始方法
            setTimeout(() => {
                if (Element.prototype.getElementsByTagName !== originalGetElementsByTagName) {
                    Element.prototype.getElementsByTagName = originalGetElementsByTagName;
                    log('✅ 已恢复原始getElementsByTagName');
                }
            }, 10000);
        } catch (e) {
            log('❌ 钩住getElementsByTagName失败:', e);
        }

        // 直接查找元素
        const elmData = oDoc.getElementById('song-list-pre-data');
        if (elmData) {
            log('✅ 直接找到加密预加载数据，准备处理...');
            changeValue(elmData);
        }

        // 同时尝试钩住JSON.parse以确保捕获所有可能的数据
        hookJSONParse();

        function changeValue(elmData) {
            try {
                log('开始处理加密数据...');

                // 尝试获取解密函数
                try {
                    log('尝试获取解密函数...');
                    // 查找NEJ.P函数
                    if (!unsafeWindow.NEJ || !unsafeWindow.NEJ.P) {
                        log('❌ 未找到NEJ.P函数，无法解密');
                        return;
                    }

                    // 查找解密函数
                    const decode = Object.values(unsafeWindow.NEJ.P('nej.u')).find(f =>
                        f && typeof f === 'function' && f.toString().match(/function\([a-z0-9]+,[a-z0-9]+\)\{return [a-z0-9]+\.[a-z0-9]+\([a-z0-9]+\.[a-z0-9]+\([a-z0-9]+\),[a-z0-9]+\)\}/i)
                    );

                    if (!decode) {
                        log('❌ 未找到解密函数');
                        return;
                    }

                    log('✅ 找到解密函数');

                    // 查找请求函数
                    const request = Object.values(unsafeWindow.NEJ.P('nej.j')).find(f =>
                        f && typeof f === 'function' && f.toString().includes('.replace("api","weapi")')
                    );

                    if (!request) {
                        log('❌ 未找到请求函数');
                        return;
                    }

                    log('✅ 找到请求函数');

                    // 获取加密参数
                    let encrypStr, position;
                    request("/m/api/encryption/param/get", {
                        sync: true,
                        type: "json",
                        query: {},
                        method: "get",
                        onload: function(data) {
                            log('获取加密参数成功:', data);
                            encrypStr = data.encrypStr;
                            position = parseInt(data.position, 10);
                        },
                        onerror: function(e) {
                            log('❌ 获取加密参数失败:', e);
                        }
                    });

                    if (!encrypStr || position === undefined) {
                        log('❌ 加密参数无效');
                        return;
                    }

                    log(`✅ 获取加密参数成功: position=${position}, encrypStr长度=${encrypStr.length}`);

                    // 处理加密字符串
                    const str = elmData.value.slice(0, position) + elmData.value.slice(position + encrypStr.length);
                    log('处理加密字符串完成');

                    // 获取解密密钥
                    const imgElement = oDoc.querySelector('#m-playlist .j-img');
                    if (!imgElement) {
                        log('❌ 未找到图片元素，无法获取密钥');
                        return;
                    }

                    const imgKey = imgElement.dataset.key;
                    if (!imgKey) {
                        log('❌ 图片元素没有data-key属性');
                        return;
                    }

                    const linkElement = oDoc.querySelector('#song-list-pre-cache a');
                    if (!linkElement) {
                        log('❌ 未找到链接元素，无法获取密钥');
                        return;
                    }

                    const href = linkElement.getAttribute('href');
                    if (!href || href.length < 12) {
                        log('❌ 链接元素href属性无效');
                        return;
                    }

                    const key = 'undefined' + imgKey + href.slice(9, 12);
                    log('✅ 获取解密密钥成功:', key);

                    // 解密数据
                    const decrypt = (str, key) => decode(str, key);
                    const text = decodeURIComponent(decrypt(str, key));
                    log('✅ 解密数据成功');

                    // 解析JSON
                    const data = JSON.parse(text);
                    if (!Array.isArray(data)) {
                        log('❌ 解密后的数据不是数组');
                        return;
                    }

                    log(`✅ 解析JSON成功，数组长度: ${data.length}`);

                    // 修改权限
                    let modified = false;
                    data.forEach((song, index) => {
                        // 检查pv属性（歌单页面使用pv而不是privilege）
                        if (song.pv) {
                            log(`处理第${index}首歌曲pv权限...`);
                            if (PV.fix(song.pv)) {
                                modified = true;
                            }
                        } else {
                            log(`第${index}首歌曲没有pv属性`);
                        }
                    });

                    if (modified) {
                        log('✅ 修改权限成功，准备钩住JSON.parse...');

                        // 钩住JSON.parse以替换解析结果 - 完全使用MyFreeMP3.js中的实现
                        const hooker = new Hooker();
                        const id = hooker.hook(oWin, 'JSON.parse', false, false, {
                            dealer: function(_this, args) {
                                if (args[0] === text) {
                                    hooker.map[id].config.hook_return.value = data;
                                    hooker.unhook(id);
                                    log('✅ JSON.parse钩子已卸载，返回修改后的数据');
                                    log(data);
                                }
                                return [_this, args];
                            }
                        }).id;
                        log('✅ JSON.parse已成功钩住');
                    } else {
                        log('⚠️ 没有找到需要修改的权限数据');
                    }
                } catch (e) {
                    log('❌ 解密数据失败:', e);
                }
            } catch (e) {
                log('❌ 处理加密数据过程中出错:', e);
            }
        }

        function hookJSONParse() {
            try {
                log('设置通用JSON.parse钩子...');

                // 此函数不再需要，因为我们使用Hooker类来处理JSON.parse
                // 保留此函数仅为兼容性，但不执行任何操作
                log('✅ 使用Hooker类代替通用JSON.parse钩子');
            } catch (e) {
                log('❌ JSON.parse钩子设置失败:', e);
            }
        }
    }

    // 辅助函数：重写XHR响应
    function rewriteResponse(xhr, json) {
        const response = JSON.stringify(json);
        const propDesc = {
            value: response,
            writable: false,
            configurable: true,
            enumerable: true
        };
        Object.defineProperties(xhr, {
            'response': propDesc,
            'responseText': propDesc
        });
    }

    if (document.body) { main(); } else { new MutationObserver((_, obs) => { if (document.body) { obs.disconnect(); main(); } }).observe(document.documentElement, { childList: true }); }
})();

function Hooker() {
    const H = this;
    const makeid = idmaker();
    const map = H.map = {};
    H.hook = hook;
    H.unhook = unhook;

    function hook(base, path, log=false, apply_debugger=false, hook_return=false) {
        // target
        path = arrPath(path);
        let parent = base;
        for (let i = 0; i < path.length - 1; i++) {
            const prop = path[i];
            parent = parent[prop];
        }
        const prop = path[path.length-1];
        const target = parent[prop];

        // Only hook functions
        if (typeof target !== 'function') {
            throw new TypeError('hooker.hook: Hook functions only');
        }
        // Check args valid
        if (hook_return) {
            if (typeof hook_return !== 'object' || hook_return === null) {
                throw new TypeError('hooker.hook: Argument hook_return should be false or an object');
            }
            if (!hook_return.hasOwnProperty('value') && typeof hook_return.dealer !== 'function') {
                throw new TypeError('hooker.hook: Argument hook_return should contain one of following properties: value, dealer');
            }
            if (hook_return.hasOwnProperty('value') && typeof hook_return.dealer === 'function') {
                throw new TypeError('hooker.hook: Argument hook_return should not contain both of following properties: value, dealer');
            }
        }

        // hooker function
        const hooker = function hooker() {
            let _this = this === H ? null : this;
            let args = Array.from(arguments);
            const config = map[id].config;
            const hook_return = config.hook_return;

            // hook functions
            config.log && console.log([base, path.join('.')], _this, args);
            if (config.apply_debugger) {debugger;}
            if (hook_return && typeof hook_return.dealer === 'function') {
                [_this, args] = hook_return.dealer(_this, args);
            }

            // continue stack
            return hook_return && hook_return.hasOwnProperty('value') ? hook_return.value : target.apply(_this, args);
        }
        parent[prop] = hooker;

        // Id
        const id = makeid();
        map[id] = {
            id: id,
            prop: prop,
            parent: parent,
            target: target,
            hooker: hooker,
            config: {
                log: log,
                apply_debugger: apply_debugger,
                hook_return: hook_return
            }
        };

        return map[id];
    }

    function unhook(id) {
        // unhook
        try {
            const hookObj = map[id];
            hookObj.parent[hookObj.prop] = hookObj.target;
            delete map[id];
        } catch(err) {
            console.error(err);
            log(LogLevel.Error, 'unhook error');
        }
    }

    function arrPath(path) {
        return Array.isArray(path) ? path : path.split('.')
    }

    function idmaker() {
        let i = 0;
        return function() {
            return i++;
        }
    }
}