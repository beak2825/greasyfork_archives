// ==UserScript==
// @name         图床助手
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  各PT站发种/转种时一键转存、上传图片到指定图床并自动填充链接，支持多图床、BBCode、清空截图等功能
// @author       jzbqy
// @match        https://springsunday.net/upload.php*
// @match        https://springsunday.net/edit.php?id=*
// @match        https://piggo.me/upload.php
// @match        https://piggo.me/edit.php?id=*
// @match        https://*/upload*
// @match        https://*/edit.php?id=*
// @match        https://*/offers*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.pixhost.to
// @connect      freeimage.host
// @connect      img.seedvault.cn
// @connect      www.picgo.net
// @connect      api.imgbb.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/542018/%E5%9B%BE%E5%BA%8A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542018/%E5%9B%BE%E5%BA%8A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SITE_KEY = location.host;

    // PicGo本地hash缓存相关
    const PICGO_CACHE_KEY = 'picgo_hash_cache';
    const PICGO_CACHE_TIME_KEY = 'picgo_hash_cache_time';
    const PICGO_CACHE_EXPIRE = 1000 * 60 * 60 * 24 * 183; // 半年

    async function getConfig() {
        const config = {
            host: await GM_getValue('img_host', 'pixhost'),
            pixhost_token: await GM_getValue('pixhost_token', ''),
            freeimage_token: await GM_getValue('freeimage_token', ''),
            agsv_token: await GM_getValue('agsv_token', ''),
            agsv_email: await GM_getValue('agsv_email', ''),
            agsv_pwd: await GM_getValue('agsv_pwd', ''),
            picgo_token: await GM_getValue('picgo_token', ''),
            imgbb_token: await GM_getValue('imgbb_token', ''),
            bbcode: await GM_getValue('bbcode_' + SITE_KEY, SITE_KEY === 'springsunday.net' ? false : true)
        };
        console.log('[图床助手] 获取配置', {
            host: config.host,
            picgo_token: config.picgo_token ? '***(长度:' + config.picgo_token.length + ')' : 'empty',
            bbcode: config.bbcode
        });
        return config;
    }
    async function setConfig(obj) {
        await GM_setValue('img_host', obj.host);
        await GM_setValue('pixhost_token', obj.pixhost_token || '');
        await GM_setValue('freeimage_token', obj.freeimage_token || '');
        await GM_setValue('agsv_token', obj.agsv_token || '');
        await GM_setValue('agsv_email', obj.agsv_email || '');
        await GM_setValue('agsv_pwd', obj.agsv_pwd || '');
        await GM_setValue('picgo_token', obj.picgo_token || '');
        await GM_setValue('imgbb_token', obj.imgbb_token || '');
        await GM_setValue('bbcode_' + SITE_KEY, obj.bbcode);
    }

    function extractImageLinks(text) {
        const imgTagRegex = /\[img\](.*?)\[\/img\]/gi;
        const urlRegex = /(https?:\/\/[^\s\[\]]+\.(?:jpg|jpeg|png|gif))/gi;
        let links = [];
        let match;
        while ((match = imgTagRegex.exec(text)) !== null) {
            links.push(match[1]);
        }
        let textNoImg = text.replace(imgTagRegex, '');
        while ((match = urlRegex.exec(textNoImg)) !== null) {
            links.push(match[1]);
        }
        return Array.from(new Set(links));
    }

    function thumbToBig(th_url) {
        return th_url.replace(/^https:\/\/t(\d+)\.pixhost\.to\/thumbs\//, 'https://img$1.pixhost.to/images/');
    }

    function uploadRemoteToPixhost(url, cb) {
        const cleanUrl = url.replace(/^\[img\](.*)\[\/img\]$/i, '$1');
        GM_xmlhttpRequest({
            method: "GET",
            url: cleanUrl,
            responseType: "blob",
            onload: function(resp) {
                let blob = resp.response;
                let filename = cleanUrl.split('/').pop().split('?')[0] || 'image.jpg';
                if (!/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
                    const mimeToExt = {
                        'image/jpeg': '.jpg',
                        'image/png': '.png',
                        'image/gif': '.gif'
                    };
                    const ext = mimeToExt[blob.type] || '.jpg';
                    filename = filename + ext;
                }
                sendPixhostMultipart(blob, filename, cb);
            },
            onerror: function() { cb('下载失败', null); }
        });
    }

    function uploadLocalToPixhost(file, cb) {
        sendPixhostMultipart(file, file.name, cb);
    }

    function sendPixhostMultipart(fileBlob, filename, cb) {
        let form = new FormData();
        form.append("content_type", "0");
        form.append("max_th_size", "420");
        form.append("img", fileBlob, filename);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.pixhost.to/images",
            data: form,
            responseType: "json",
            headers: {
                "Accept": "application/json"
            },
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.th_url) {
                    r.response.th_url = r.response.th_url.replace(/^http:/, 'https:');
                    r.response.show_url = r.response.show_url.replace(/^http:/, 'https:');
                    cb(null, r.response);
                } else {
                    cb('上传失败', null);
                }
            },
            onerror: function(e) {
                cb('上传失败', null);
            }
        });
    }

    function uploadRemoteToFreeimage(url, apiKey, cb) {
        let form = new FormData();
        form.append('key', apiKey);
        form.append('action', 'upload');
        form.append('source', url);
        form.append('format', 'json');
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://freeimage.host/api/1/upload",
            data: form,
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.status_code === 200 && r.response.image && r.response.image.url) {
                    cb(null, r.response);
                } else {
                    cb('上传失败', r.response || null);
                }
            },
            onerror: function(e) {
                cb('上传失败', null);
            }
        });
    }

    function uploadLocalToFreeimage(file, apiKey, cb) {
        let form = new FormData();
        form.append('key', apiKey);
        form.append('action', 'upload');
        form.append('source', file, file.name);
        form.append('format', 'json');
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://freeimage.host/api/1/upload",
            data: form,
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.status_code === 200 && r.response.image && r.response.image.url) {
                    cb(null, r.response);
                } else {
                    cb('上传失败', r.response || null);
                }
            },
            onerror: function(e) {
                cb('上传失败', null);
            }
        });
    }

    function uploadRemoteToAGSV(url, token, cb) {
        const cleanUrl = url.replace(/^\[img\](.*)\[\/img\]$/i, '$1');
        GM_xmlhttpRequest({
            method: "GET",
            url: cleanUrl,
            responseType: "blob",
            onload: function(resp) {
                let blob = resp.response;
                let filename = cleanUrl.split('/').pop().split('?')[0] || 'image.jpg';
                let form = new FormData();
                form.append('file', blob, filename);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://img.seedvault.cn/api/v1/upload",
                    data: form,
                    headers: {
                        'Authorization': token ? 'Bearer ' + token : undefined,
                        'Accept': 'application/json'
                    },
                    responseType: "json",
                    onload: function(r) {
                        if (r.status === 200 && r.response && r.response.status && r.response.data && r.response.data.links && r.response.data.links.url) {
                            cb(null, r.response);
                        } else {
                            cb('上传失败', null);
                        }
                    },
                    onerror: function() { cb('上传失败', null); }
                });
            },
            onerror: function() { cb('下载失败', null); }
        });
    }

    function uploadLocalToAGSV(file, token, cb) {
        let form = new FormData();
        form.append('file', file, file.name);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://img.seedvault.cn/api/v1/upload",
            data: form,
            headers: {
                'Authorization': token ? 'Bearer ' + token : undefined,
                'Accept': 'application/json'
            },
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.status && r.response.data && r.response.data.links && r.response.data.links.url) {
                    cb(null, r.response);
                } else {
                    cb('上传失败', null);
                }
            },
            onerror: function() { cb('上传失败', null); }
        });
    }

    // PicGo远程转存：先下载再上传（因为PicGo不支持远程URL上传）
    async function uploadRemoteToPicGo(url, apiKey, cb) {
        console.log('[图床助手] PicGo远程转存开始', {url, apiKey: apiKey ? '***' : 'empty'});
        await autoCleanPicGoCache();
        try {
            const cleanUrl = url.replace(/^\[img\](.*)\[\/img\]$/i, '$1');
            console.log('[图床助手] PicGo清理后URL', cleanUrl);
            let file = await downloadImageAsFile(cleanUrl);
            console.log('[图床助手] PicGo下载文件成功', {fileName: file.name, fileSize: file.size});
            let hash = await getFileHash(file);
            let cache = await getPicGoCache();
            if (cache[hash]) {
                console.log('[图床助手] PicGo缓存命中', cache[hash]);
                cb(null, { image: { url: cache[hash] } });
                return;
            }
            console.log('[图床助手] PicGo缓存未命中，开始上传');
            uploadLocalToPicGo(file, apiKey, async (err, resp) => {
                if (!err && resp && resp.image && resp.image.url) {
                    console.log('[图床助手] PicGo上传成功，保存缓存', resp.image.url);
                    cache[hash] = resp.image.url;
                    await setPicGoCache(cache);
                    cb(null, resp);
                } else if (!err && resp && (!resp.image || !resp.image.url)) {
                    console.warn('[图床助手] PicGo已存在但无链接');
                    alert('PicGo图床已存在该图片，但本地缓存已清除，无法获取图片链接！');
                    cb('PicGo已存在但无链接', null);
                } else {
                    console.error('[图床助手] PicGo上传失败', {err, resp});
                    cb(err, resp);
                }
            });
        } catch (e) {
            console.error('[图床助手] PicGo远程转存异常', e);
            cb(e.toString(), null);
        }
    }
    function uploadLocalToPicGo(file, apiKey, cb) {
        console.log('[图床助手] PicGo本地上传开始', {fileName: file.name, fileSize: file.size, apiKey: apiKey ? '***' : 'empty'});
        let form = new FormData();
        form.append('source', file, file.name);
        form.append('format', 'json');
        console.log('[图床助手] PicGo本地请求参数', {fileName: file.name, format: 'json'});
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.picgo.net/api/1/upload",
            data: form,
            headers: {
                'X-API-Key': apiKey
            },
            responseType: "json",
            onload: function(r) {
                console.log('[图床助手] PicGo本地上传响应', {status: r.status, response: r.response});
                if (r.status === 200 && r.response && r.response.status_code === 200 && r.response.image && r.response.image.url) {
                    console.log('[图床助手] PicGo本地上传成功', r.response.image.url);
                    cb(null, r.response);
                } else {
                    console.error('[图床助手] PicGo本地上传失败', r);
                    cb('上传失败', null);
                }
            },
            onerror: function(e) {
                console.error('[图床助手] PicGo本地上传请求失败', e);
                cb('上传失败', null);
            }
        });
    }

    function uploadRemoteToImgbb(url, apiKey, cb) {
        const cleanUrl = url.replace(/^\[img\](.*)\[\/img\]$/i, '$1');
        let form = new FormData();
        form.append('key', apiKey);
        form.append('image', cleanUrl);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.imgbb.com/1/upload",
            data: form,
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.data && r.response.data.url) {
                    cb(null, r.response);
                } else {
                    cb('上传失败', null);
                }
            },
            onerror: function() { cb('上传失败', null); }
        });
    }

    function uploadLocalToImgbb(file, apiKey, cb) {
        let form = new FormData();
        form.append('key', apiKey);
        form.append('image', file, file.name);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.imgbb.com/1/upload",
            data: form,
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.data && r.response.data.url) {
                    cb(null, r.response);
                } else {
                    cb('上传失败', null);
                }
            },
            onerror: function() { cb('上传失败', null); }
        });
    }



    function getAGSVToken(email, pwd, cb) {
        let form = new FormData();
        form.append('email', email);
        form.append('password', pwd);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://img.seedvault.cn/api/v1/tokens",
            data: form,
            headers: {
                'Accept': 'application/json'
            },
            responseType: "json",
            onload: function(r) {
                if (r.status === 200 && r.response && r.response.status && r.response.data && r.response.data.token) {
                    cb(null, r.response.data.token);
                } else {
                    cb(r.response && r.response.message ? r.response.message : '获取失败', null);
                }
            },
            onerror: function() { cb('获取失败', null); }
        });
    }

    function toggleBBCode(text) {
        let lines = text.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length === 0) return '';
        let hasBBCode = lines.filter(line => /^\[img\].*\[\/img\]$/.test(line)).length > lines.length / 2;
        if (hasBBCode) {
            return lines.map(line => line.replace(/^\[img\](.*?)\[\/img\]$/, '$1')).join('\n');
        } else {
            return lines.map(line => /^\[img\].*\[\/img\]$/.test(line) ? line : `[img]${line}[/img]`).join('\n');
        }
    }

    function downloadImageAsFile(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(resp) {
                    if (resp.status === 200) {
                        let filename = url.split('/').pop().split('?')[0] || 'image.jpg';
                        let file = new File([resp.response], filename, {type: resp.response.type || 'image/jpeg'});
                        resolve(file);
                    } else {
                        reject('下载失败');
                    }
                },
                onerror: function() { reject('下载失败'); }
            });
        });
    }

    async function getPicGoCache() {
        let cache = await GM_getValue(PICGO_CACHE_KEY, '{}');
        try { return JSON.parse(cache); } catch { return {}; }
    }

    async function setPicGoCache(obj) {
        await GM_setValue(PICGO_CACHE_KEY, JSON.stringify(obj));
        await GM_setValue(PICGO_CACHE_TIME_KEY, Date.now());
    }

    async function autoCleanPicGoCache() {
        let last = await GM_getValue(PICGO_CACHE_TIME_KEY, 0);
        if (Date.now() - last > PICGO_CACHE_EXPIRE) {
            await setPicGoCache({});
        }
    }

    async function getFileHash(file) {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function uploadRemoteToPicGoByDownload(url, apiKey, cb) {
        await autoCleanPicGoCache();
        try {
            let file = await downloadImageAsFile(url);
            let hash = await getFileHash(file);
            let cache = await getPicGoCache();
            if (cache[hash]) {
                cb(null, { image: { url: cache[hash] } });
                return;
            }
            uploadLocalToPicGo(file, apiKey, async (err, resp) => {
                if (!err && resp && resp.image && resp.image.url) {
                    cache[hash] = resp.image.url;
                    await setPicGoCache(cache);
                    cb(null, resp);
                } else if (!err && resp && (!resp.image || !resp.image.url)) {
                    alert('PicGo图床已存在该图片，但本地缓存已清除，无法获取图片链接！');
                    cb('PicGo已存在但无链接', null);
                } else {
                    cb(err, resp);
                }
            });
        } catch (e) {
            cb(e, null);
        }
    }

    function addPixhostBtns(textarea, isShotBox, isPosterBox) {
        if (textarea.dataset.pixhostBtns) return;
        textarea.dataset.pixhostBtns = "1";

        let btnDiv = document.createElement('div');
        btnDiv.style.marginTop = '5px';
        btnDiv.style.marginBottom = '5px';
        btnDiv.style.display = 'flex';
        btnDiv.style.alignItems = 'center';

        let btn1 = document.createElement('button');
        btn1.type = 'button';
        btn1.textContent = '一键转存到图床';
        btn1.className = 'btn';
        btn1.style.marginRight = '4px';

        let btn2 = document.createElement('button');
        btn2.type = 'button';
        btn2.textContent = '上传本地图片到图床';
        btn2.className = 'btn';
        btn2.style.marginRight = '4px';

        let clearBtn = null, toggleBBBtn = null, settingBtn = null, bbcodeBox = null;
        if (isShotBox) {
            clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.textContent = '清空截图链接';
            clearBtn.className = 'btn';
            clearBtn.style.marginRight = '4px';
            clearBtn.onclick = function() {
                textarea.value = '';
            };

            toggleBBBtn = document.createElement('button');
            toggleBBBtn.type = 'button';
            toggleBBBtn.textContent = '批量加/去BBCode';
            toggleBBBtn.className = 'btn';
            toggleBBBtn.style.marginRight = '4px';
            toggleBBBtn.onclick = function() {
                let shotBox = document.getElementById('url_vimages');
                let posterBox = document.getElementById('url_poster');
                if (shotBox) shotBox.value = toggleBBCode(shotBox.value);
                if (posterBox) posterBox.value = toggleBBCode(posterBox.value);
            };

            settingBtn = document.createElement('button');
            settingBtn.type = 'button';
            settingBtn.textContent = '图床设置';
            settingBtn.className = 'btn';
            settingBtn.style.marginRight = '4px';
            settingBtn.onclick = createSettingPanel;

            bbcodeBox = document.createElement('label');
            bbcodeBox.style.marginRight = '8px';
            let box = document.createElement('input');
            box.type = 'checkbox';
            box.style.verticalAlign = 'middle';
            box.id = 'bbcode-checkbox';
            bbcodeBox.appendChild(box);
            bbcodeBox.appendChild(document.createTextNode('使用BBCode'));
        }

        btn1.onclick = async function() {
            let cfg = await getConfig();
            let text = textarea.value;
            let links = extractImageLinks(text);
            if (links.length === 0) {
                alert('未检测到图片链接');
                return;
            }
            btn1.disabled = true;
            btn1.textContent = '正在转存...';
            let results = [];
            for (let i = 0; i < links.length; i++) {
                btn1.textContent = `正在转存(${i+1}/${links.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadRemoteToPixhost(links[i], (err, resp) => {
                            if (!err && resp) {
                                results.push(thumbToBig(resp.th_url));
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadRemoteToFreeimage(links[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.image.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadRemoteToAGSV(links[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.data.links.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] 选择PicGo图床进行远程上传', {link: links[i], token: cfg.picgo_token ? '***' : 'empty'});
                        uploadRemoteToPicGo(links[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] PicGo远程上传回调', {err, resp});
                            if (!err && resp) {
                                results.push(resp.image.url);
                                console.log('[图床助手] PicGo上传成功，添加到结果', resp.image.url);
                            } else {
                                console.error('[图床助手] PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadRemoteToImgbb(links[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.data.url);
                            }
                            resolve();
                        });
                    }
                });
            }
            if ((isShotBox && bbcodeBox && bbcodeBox.firstChild.checked) ||
                (isPosterBox && document.getElementById('bbcode-checkbox') && document.getElementById('bbcode-checkbox').checked)) {
                results = results.map(url => `[img]${url}[/img]`);
            }
            textarea.value = results.join('\n');
            btn1.textContent = '一键转存到图床';
            btn1.disabled = false;
        };

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/gif';
        fileInput.multiple = true;
        fileInput.style.display = 'none';

        btn2.onclick = function() { fileInput.click(); };
        fileInput.onchange = async function() {
            let cfg = await getConfig();
            let files = Array.from(fileInput.files);
            if (files.length === 0) return;
            btn2.disabled = true;
            btn2.textContent = '正在上传...';
            let results = textarea.value ? textarea.value.split('\n') : [];
            for (let i = 0; i < files.length; i++) {
                btn2.textContent = `正在上传(${i+1}/${files.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadLocalToPixhost(files[i], (err, resp) => {
                            if (!err && resp) {
                                results.push(thumbToBig(resp.th_url));
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadLocalToFreeimage(files[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.image.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadLocalToAGSV(files[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.data.links.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] 选择PicGo图床进行本地上传', {fileName: files[i].name, token: cfg.picgo_token ? '***' : 'empty'});
                        uploadLocalToPicGo(files[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] PicGo本地上传回调', {err, resp});
                            if (!err && resp) {
                                results.push(resp.image.url);
                                console.log('[图床助手] PicGo上传成功，添加到结果', resp.image.url);
                            } else {
                                console.error('[图床助手] PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadLocalToImgbb(files[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp) {
                                results.push(resp.data.url);
                            }
                            resolve();
                        });
                    }
                });
            }
            if ((isShotBox && bbcodeBox && bbcodeBox.firstChild.checked) ||
                (isPosterBox && document.getElementById('bbcode-checkbox') && document.getElementById('bbcode-checkbox').checked)) {
                results = results.map(url => url.startsWith('[img]') ? url : `[img]${url}[/img]`);
            }
            textarea.value = results.join('\n');
            btn2.textContent = '上传本地图片到图床';
            btn2.disabled = false;
            fileInput.value = '';
        };

        btnDiv.appendChild(btn1);
        btnDiv.appendChild(btn2);
        btnDiv.appendChild(fileInput);
        if (isShotBox && clearBtn) btnDiv.appendChild(clearBtn);
        if (isShotBox && toggleBBBtn) btnDiv.appendChild(toggleBBBtn);
        if (isShotBox && settingBtn) btnDiv.appendChild(settingBtn);
        if (isShotBox && bbcodeBox) btnDiv.appendChild(bbcodeBox);

        textarea.parentNode.insertBefore(btnDiv, textarea.nextSibling);

        if (isShotBox && bbcodeBox) {
            getConfig().then(cfg => {
                bbcodeBox.firstChild.checked = !!cfg.bbcode;
            });
            bbcodeBox.firstChild.onchange = function() {
                getConfig().then(cfg => {
                    setConfig({...cfg, bbcode: bbcodeBox.firstChild.checked});
                });
            };
        }
    }

    function createSettingPanel() {
        if (document.getElementById('imgbed-setting-panel')) return;
        let panel = document.createElement('div');
        panel.id = 'imgbed-setting-panel';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.zIndex = 9999;
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        panel.style.padding = '20px 30px 20px 20px';
        panel.style.minWidth = '400px';

        panel.innerHTML = `
            <div style="font-size:16px;font-weight:bold;margin-bottom:6px;">图床设置</div>
            <div style="margin-bottom:10px;">
                <label>选择图床：
                    <select id="imgbed-host-select" style="margin-left:8px;">
                        <option value="pixhost">Pixhost</option>
                        <option value="freeimage">Freeimage</option>
                        <option value="agsv">AGSV公开图床</option>
                        <option value="picgo">PicGo</option>
                        <option value="imgbb">Imgbb</option>
                    </select>
                </label>
            </div>
            <div id="pixhost-token-row" style="margin-bottom:10px;display:none;">
                <label>Pixhost API Key（留空）：<input id="pixhost-token-input" type="text" style="width:200px;margin-left:8px;" /></label>
            </div>
            <div id="freeimage-token-row" style="margin-bottom:10px;display:none;">
                <label>Freeimage API Key：<input id="freeimage-token-input" type="text" style="width:200px;margin-left:8px;" /></label>
            </div>
            <div id="agsv-token-row" style="margin-bottom:10px;display:none;">
                <label>AGSV Token：<input id="agsv-token-input" type="text" style="width:200px;margin-left:8px;" /></label>
            </div>
            <div id="agsv-auth-row" style="display:none;margin-bottom:10px;">
                <label>邮箱：<input id="agsv-email-input" type="text" style="width:140px;margin-left:8px;" /></label><br>
                <label>密码：<input id="agsv-pwd-input" type="password" style="width:140px;margin-left:8px;" /></label>
                <button id="agsv-get-token-btn" class="btn" style="margin-left:10px;">获取Token</button>
            </div>
            <div id="picgo-token-row" style="margin-bottom:10px;display:none;">
                <label>PicGo API Key：<input id="picgo-token-input" type="text" style="width:200px;margin-left:8px;" /></label>
            </div>
            <div id="imgbb-token-row" style="margin-bottom:10px;display:none;">
                <label>Imgbb API Key：<input id="imgbb-token-input" type="text" style="width:200px;margin-left:8px;" /></label>
            </div>
            <div style="margin-bottom:10px;color:#888;font-size:12px;">
                Pixhost图床无需API令牌。其他图床请自行注册，并根据提示获取API令牌或Token<br>
                Freeimage图床需在菜单（menu）中获取API Key，<a href="https://freeimage.host/" target="_blank">Freeimage图床官网</a><br>
                AGSV公开图床需通过已注册的账号密码获取Token，<a href="https://img.seedvault.cn/" target="_blank">AGSV公开图床官网</a><br>
                PicGo图床需在个人设置页获取API Key，<a href="https://www.picgo.net/" target="_blank">PicGo图床官网</a><br>
                Imgbb图床需在个人设置页获取API Key，<a href="https://imgbb.com/" target="_blank">Imgbb图床官网</a>
            </div>
            <div>
                <button id="imgbed-save-btn" class="btn" style="margin-right:10px;">保存</button>
                <button id="imgbed-cancel-btn" class="btn">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);

        getConfig().then(cfg => {
            document.getElementById('imgbed-host-select').value = cfg.host;
            document.getElementById('pixhost-token-input').value = cfg.pixhost_token || '';
            document.getElementById('freeimage-token-input').value = cfg.freeimage_token || '';
            document.getElementById('agsv-token-input').value = cfg.agsv_token || '';
            document.getElementById('agsv-email-input').value = cfg.agsv_email || '';
            document.getElementById('agsv-pwd-input').value = cfg.agsv_pwd || '';
            document.getElementById('picgo-token-input').value = cfg.picgo_token || '';
            document.getElementById('imgbb-token-input').value = cfg.imgbb_token || '';
            updateTokenRow();
        });
        document.getElementById('imgbed-host-select').onchange = updateTokenRow;
        function updateTokenRow() {
            let host = document.getElementById('imgbed-host-select').value;
            document.getElementById('pixhost-token-row').style.display = 'none';
            document.getElementById('freeimage-token-row').style.display = host === 'freeimage' ? '' : 'none';
            document.getElementById('agsv-token-row').style.display = host === 'agsv' ? '' : 'none';
            document.getElementById('agsv-auth-row').style.display = host === 'agsv' ? '' : 'none';
            document.getElementById('picgo-token-row').style.display = host === 'picgo' ? '' : 'none';
            document.getElementById('imgbb-token-row').style.display = host === 'imgbb' ? '' : 'none';
        }
        document.getElementById('agsv-get-token-btn').onclick = function() {
            let email = document.getElementById('agsv-email-input').value.trim();
            let pwd = document.getElementById('agsv-pwd-input').value;
            if (!email || !pwd) {
                alert('请填写邮箱和密码');
                return;
            }
            document.getElementById('agsv-get-token-btn').disabled = true;
            document.getElementById('agsv-get-token-btn').textContent = '获取中...';
            getAGSVToken(email, pwd, (err, token) => {
                document.getElementById('agsv-get-token-btn').disabled = false;
                document.getElementById('agsv-get-token-btn').textContent = '获取Token';
                if (err) {
                    alert('获取失败：' + err);
                } else {
                    document.getElementById('agsv-token-input').value = token;
                    alert('Token获取成功！');
                }
            });
        };

        document.getElementById('imgbed-save-btn').onclick = async function() {
            let host = document.getElementById('imgbed-host-select').value;
            let pixhost_token = document.getElementById('pixhost-token-input').value;
            let freeimage_token = document.getElementById('freeimage-token-input').value;
            let agsv_token = document.getElementById('agsv-token-input').value;
            let agsv_email = document.getElementById('agsv-email-input').value.trim();
            let agsv_pwd = document.getElementById('agsv-pwd-input').value;
            let picgo_token = document.getElementById('picgo-token-input').value;
            let imgbb_token = document.getElementById('imgbb-token-input').value;
            if (host === 'freeimage' && !freeimage_token) {
                alert('Freeimage 需要API Key！');
                return;
            }
            if (host === 'agsv' && !agsv_token) {
                alert('AGSV 需要Token！');
                return;
            }
            if (host === 'picgo' && !picgo_token) {
                alert('PicGo 需要API Key！');
                return;
            }
            if (host === 'imgbb' && !imgbb_token) {
                alert('Imgbb 需要API Key！');
                return;
            }
            await setConfig({
                host,
                pixhost_token,
                freeimage_token,
                agsv_token,
                agsv_email,
                agsv_pwd,
                picgo_token,
                imgbb_token,
                bbcode: await GM_getValue('bbcode_' + SITE_KEY, SITE_KEY === 'springsunday.net' ? false : true)
            });
            panel.remove();
        };
        document.getElementById('imgbed-cancel-btn').onclick = function() {
            panel.remove();
        };
    }

    function autoAddBtns() {
        let shotBox = document.getElementById('url_vimages');
        let posterBox = document.getElementById('url_poster');
        let descrBox = document.getElementById('descr');

        if (shotBox) addPixhostBtns(shotBox, true, false);
        if (posterBox) addPixhostBtns(posterBox, false, true);

        if (descrBox && location.host === 'piggo.me') {
            addPixhostBtnsForPiggo(descrBox);
        }
    }

    function addPixhostBtnsForPiggo(textarea) {
        if (textarea.dataset.pixhostBtns) return;
        textarea.dataset.pixhostBtns = "1";

        let previewBtn = document.getElementById('edittorrent-descr-btn-preview')
            || document.getElementById('upload-descr-btn-preview')
            || document.getElementById('upload-descr-btn-edit');

        let btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.alignItems = 'center';
        btnRow.style.marginTop = '5px';
        btnRow.style.marginBottom = '5px';

        let btnDiv = document.createElement('div');
        btnDiv.style.display = 'inline-flex';
        btnDiv.style.alignItems = 'center';
        btnDiv.style.marginRight = '10px';

        let btn1 = document.createElement('button');
        btn1.type = 'button';
        btn1.textContent = '一键转存到图床';
        btn1.className = 'btn';
        btn1.style.marginRight = '4px';

        let btn2 = document.createElement('button');
        btn2.type = 'button';
        btn2.textContent = '上传本地图片到图床';
        btn2.className = 'btn';
        btn2.style.marginRight = '4px';

        let clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = '清空截图链接';
        clearBtn.className = 'btn';
        clearBtn.style.marginRight = '4px';
        clearBtn.onclick = function() {
            let lines = textarea.value.split('\n');
            let imgIdx = -1;
            for (let i = 0; i < lines.length; i++) {
                if (/^\[img\]https?:\/\/.+\.(jpg|jpeg|png|gif)\[\/img\]$/i.test(lines[i].trim())) {
                    imgIdx = i;
                    break;
                }
            }
            let newLines = lines.filter((line, idx) => {
                if (idx === imgIdx) return true;
                if (/^\[img\]https?:\/\/.+\.(jpg|jpeg|png|gif)\[\/img\]$/i.test(line.trim())) {
                    return false;
                }
                return true;
            });
            textarea.value = newLines.join('\n');
        };

        let toggleBBBtn = document.createElement('button');
        toggleBBBtn.type = 'button';
        toggleBBBtn.textContent = '批量加/去BBCode';
        toggleBBBtn.className = 'btn';
        toggleBBBtn.style.marginRight = '4px';
        toggleBBBtn.onclick = function() {
            let lines = textarea.value.split('\n');
            let newLines = lines.map(line => {
                if (/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(line.trim())) {
                    return `[img]${line.trim()}[/img]`;
                } else if (/^\[img\]https?:\/\/.+\.(jpg|jpeg|png|gif)\[\/img\]$/i.test(line.trim())) {
                    return line.trim().replace(/^\[img\](.+)\[\/img\]$/i, '$1');
                }
                return line;
            });
            textarea.value = newLines.join('\n');
        };

        let settingBtn = document.createElement('button');
        settingBtn.type = 'button';
        settingBtn.textContent = '图床设置';
        settingBtn.className = 'btn';
        settingBtn.style.marginRight = '4px';
        settingBtn.onclick = createSettingPanel;

        let bbcodeBox = document.createElement('label');
        bbcodeBox.style.marginLeft = '10px';
        bbcodeBox.style.display = 'inline-flex';
        bbcodeBox.style.alignItems = 'center';
        let box = document.createElement('input');
        box.type = 'checkbox';
        box.style.verticalAlign = 'middle';
        box.id = 'bbcode-checkbox';
        bbcodeBox.appendChild(box);
        bbcodeBox.appendChild(document.createTextNode('使用BBCode'));

        btn1.onclick = async function() {
            let cfg = await getConfig();
            let text = textarea.value;
            let links = extractImageLinks(text);
            if (links.length === 0) {
                alert('未检测到图片链接');
                return;
            }
            btn1.disabled = true;
            btn1.textContent = '正在转存...';

            let originalText = text;
            let newLinks = [];

            for (let i = 0; i < links.length; i++) {
                btn1.textContent = `正在转存(${i+1}/${links.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadRemoteToPixhost(links[i], (err, resp) => {
                            if (!err && resp) {
                                newLinks.push({
                                    old: links[i],
                                    new: thumbToBig(resp.th_url)
                                });
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadRemoteToFreeimage(links[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp) {
                                newLinks.push({
                                    old: links[i],
                                    new: resp.image.url
                                });
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadRemoteToAGSV(links[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp) {
                                newLinks.push({
                                    old: links[i],
                                    new: resp.data.links.url
                                });
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] Piggo页面PicGo远程上传', {link: links[i], token: cfg.picgo_token ? '***' : 'empty'});
                        uploadRemoteToPicGo(links[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] Piggo页面PicGo远程上传回调', {err, resp});
                            if (!err && resp) {
                                newLinks.push({
                                    old: links[i],
                                    new: resp.image.url
                                });
                                console.log('[图床助手] Piggo页面PicGo上传成功', resp.image.url);
                            } else {
                                console.error('[图床助手] Piggo页面PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadRemoteToImgbb(links[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp) {
                                newLinks.push({
                                    old: links[i],
                                    new: resp.data.url
                                });
                            }
                            resolve();
                        });
                    }
                });
            }

            let newText = originalText;
            for (let link of newLinks) {
                let newUrl = link.new;
                if (bbcodeBox.firstChild.checked) {
                    newUrl = `[img]${newUrl}[/img]`;
                }
                newText = newText.replace(new RegExp(`\\[img\\]${link.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[/img\\]`, 'g'), newUrl);
                newText = newText.replace(new RegExp(link.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
            }

            textarea.value = newText;
            btn1.textContent = '一键转存到图床';
            btn1.disabled = false;
        };

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/gif';
        fileInput.multiple = true;
        fileInput.style.display = 'none';

        btn2.onclick = function() { fileInput.click(); };
        fileInput.onchange = async function() {
            let cfg = await getConfig();
            let files = Array.from(fileInput.files);
            if (files.length === 0) return;
            btn2.disabled = true;
            btn2.textContent = '正在上传...';

            let currentText = textarea.value;
            let newUrls = [];

            for (let i = 0; i < files.length; i++) {
                btn2.textContent = `正在上传(${i+1}/${files.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadLocalToPixhost(files[i], (err, resp) => {
                            if (!err && resp) {
                                newUrls.push(thumbToBig(resp.th_url));
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadLocalToFreeimage(files[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp) {
                                newUrls.push(resp.image.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadLocalToAGSV(files[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp) {
                                newUrls.push(resp.data.links.url);
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] Piggo页面PicGo本地上传', {fileName: files[i].name, token: cfg.picgo_token ? '***' : 'empty'});
                        uploadLocalToPicGo(files[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] Piggo页面PicGo本地上传回调', {err, resp});
                            if (!err && resp) {
                                newUrls.push(resp.image.url);
                                console.log('[图床助手] Piggo页面PicGo上传成功', resp.image.url);
                            } else {
                                console.error('[图床助手] Piggo页面PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadLocalToImgbb(files[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp) {
                                newUrls.push(resp.data.url);
                            }
                            resolve();
                        });
                    }
                });
            }

            let newLines = [];
            for (let url of newUrls) {
                if (bbcodeBox.firstChild.checked) {
                    newLines.push(`[img]${url}[/img]`);
                } else {
                    newLines.push(url);
                }
            }

            if (currentText && !currentText.endsWith('\n')) {
                currentText += '\n';
            }
            textarea.value = currentText + newLines.join('\n');

            btn2.textContent = '上传本地图片到图床';
            btn2.disabled = false;
            fileInput.value = '';
        };

        btnDiv.appendChild(btn1);
        btnDiv.appendChild(btn2);
        btnDiv.appendChild(clearBtn);
        btnDiv.appendChild(toggleBBBtn);
        btnDiv.appendChild(settingBtn);
        btnDiv.appendChild(fileInput);

        btnRow.appendChild(btnDiv);
        if (previewBtn) {
            btnRow.appendChild(previewBtn);
        }
        btnRow.appendChild(bbcodeBox);

        let td = textarea.closest('td');
        btnRow.className = 'piggo-imgbed-btnrow';
        btnRow.style.width = '100%';
        btnRow.style.display = 'flex';
        btnRow.style.alignItems = 'center';
        if (td) {
            td.appendChild(btnRow);
        } else {
            textarea.parentNode.insertBefore(btnRow, textarea.nextSibling);
        }

        getConfig().then(cfg => {
            bbcodeBox.firstChild.checked = !!cfg.bbcode;
        });
        bbcodeBox.firstChild.onchange = function() {
            getConfig().then(cfg => {
                setConfig({...cfg, bbcode: bbcodeBox.firstChild.checked});
            });
        };
    }

    function isGeneralUploadPage() {
        const host = location.host;
        const path = location.pathname;
        const isTarget = !host.endsWith('springsunday.net') && !host.endsWith('piggo.me') &&
            (/\/upload\.php($|\?)/.test(path) || (/\/edit\.php$/.test(path) && /[?&]id=\d*/.test(location.search)));
        return isTarget;
    }

    function savePanelPos(key, pos) {
        try { localStorage.setItem(key, JSON.stringify(pos)); } catch(e) {}
    }
    function loadPanelPos(key, def) {
        try { return JSON.parse(localStorage.getItem(key)) || def; } catch(e) { return def; }
    }

    function extractPosterAndShots() {
        let selectors = [
            'textarea[name="descr"]',
            'textarea[name="description"]',
            'textarea#descr',
            'textarea#description',
            'textarea',
            '[contenteditable="true"]',
            'iframe'
        ];
        let text = '';
        for (let sel of selectors) {
            let el = document.querySelector(sel);
            if (el) {
                if (el.tagName === 'IFRAME') {
                    try {
                        text = el.contentDocument.body.innerHTML;
                    } catch(e) {}
                } else if (el.isContentEditable) {
                    text = el.innerHTML || el.textContent;
                } else {
                    text = el.value || el.textContent;
                }
                if (text) break;
            }
        }
        let imgTagRegex = /\[img\][^\[]+?\[\/img\]/gi;
        let urlRegex = /(https?:\/\/[^\s\[\]]+\.(?:jpg|jpeg|png|gif))/gi;
        let links = [];
        let match;
        let bbcodeMatches = text.match(imgTagRegex);
        if (bbcodeMatches) links.push(...bbcodeMatches);
        let textNoBB = text.replace(imgTagRegex, '');
        while ((match = urlRegex.exec(textNoBB)) !== null) {
            links.push(match[1]);
        }
        return Array.from(new Set(links));
    }

    let imgbedExtractedLinks = null;
    function createFloatingPanel() {
        if (document.getElementById('imgbed-floating-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'imgbed-floating-panel';
        panel.style.position = 'fixed';
        let pos = loadPanelPos('imgbed-floating-panel-pos', {
            left: Math.max((window.innerWidth-650)/2, 0),
            top: Math.max((window.innerHeight-402)/2, 0),
            width: 650,
            height: 402
        });
        panel.style.left = pos.left + 'px';
        panel.style.top = pos.top + 'px';
        panel.style.width = (pos.width||650) + 'px';
        panel.style.height = (pos.height||402) + 'px';
        panel.style.minHeight = '402px';
        panel.style.zIndex = 99999;
        panel.style.background = 'rgba(255,255,255,0.98)';
        panel.style.border = '1.5px solid #aaa';
        panel.style.borderRadius = '10px';
        panel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
        panel.style.padding = '20px 20px 5px 20px';
        panel.style.minWidth = '650px';
        panel.style.maxWidth = '98vw';
        panel.style.userSelect = 'none';
        panel.style.resize = 'both';
        panel.style.overflow = 'auto';
        panel.innerHTML = `
            <div style="position:relative;">
                <div id="imgbed-drag-header" style="font-size:17px;font-weight:bold;margin-bottom:12px;cursor:move;">图床助手</div>
                <button id="imgbed-close-x-btn" style="position:absolute;top:-5px;right:-5px;width:40px;height:40px;border:none;background:transparent;color:#000;border-radius:50%;cursor:pointer;font-size:24px;line-height:1;">×</button>
            </div>
            <div style="margin-bottom:12px;display:flex;align-items:center;">
                <button id="imgbed-clear-pre-btn" class="btn" style="margin-right:6px;">清空</button>
                <label style="font-size:14px;">转存前图片链接：</label><br>
            </div>
            <textarea id="imgbed-poster-shots" style="width:99%;height:110px;font-size:13px;margin-top:-8px;resize:vertical;"></textarea>
            <div style="margin-bottom:12px;display:flex;align-items:center;">
                <button id="imgbed-clear-post-btn" class="btn" style="margin-right:6px;">清空</button>
                <label style="font-size:14px;">转存后图片链接：</label><br>
            </div>
            <textarea id="imgbed-uploaded-links" style="width:99%;height:110px;font-size:13px;margin-top:-8px;resize:vertical;"></textarea>
            <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
                <button id="imgbed-transfer-btn" class="btn" style="flex:1 1 120px;min-width:120px;font-size:13px;padding:6px 8px;">一键转存到图床</button>
                <button id="imgbed-upload-btn" class="btn" style="flex:1 1 140px;min-width:140px;font-size:13px;padding:6px 8px;">上传本地图片到图床</button>
                <button id="imgbed-toggle-bbcode-btn" class="btn" style="flex:1 1 130px;min-width:130px;font-size:13px;padding:6px 8px;">批量加/去BBCode</button>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
                <button id="imgbed-setting-btn" class="btn" style="flex:1 1 110px;min-width:110px;font-size:13px;padding:6px 8px;">图床设置</button>
                <button id="imgbed-close-btn" class="btn" style="flex:1 1 110px;min-width:110px;font-size:13px;padding:6px 8px;">关闭窗口</button>
                <label style="margin-left:10px;display:inline-flex;align-items:center;font-size:13px;">
                    <input type="checkbox" id="imgbed-bbcode-checkbox" style="vertical-align:middle;">使用BBCode
                </label>
            </div>
            <input type="file" id="imgbed-file-input" accept="image/jpeg,image/png,image/gif" multiple style="display:none;">
        `;
        document.body.appendChild(panel);

        let isDown = false, offsetX = 0, offsetY = 0;
        const header = panel.querySelector('#imgbed-drag-header');
        header.onmousedown = function(e) {
            isDown = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
        };
        window.addEventListener('mousemove', movePanel);
        window.addEventListener('mouseup', upPanel);
        function movePanel(e) {
            if (!isDown) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        }
        function upPanel() {
            if (isDown) {
                savePanelPos('imgbed-floating-panel-pos', {left:panel.offsetLeft,top:panel.offsetTop,width:panel.offsetWidth,height:panel.offsetHeight});
            }
            isDown = false;
            document.body.style.userSelect = '';
        }
        panel.addEventListener('mouseup', function() {
            savePanelPos('imgbed-floating-panel-pos', {left:panel.offsetLeft,top:panel.offsetTop,width:panel.offsetWidth,height:panel.offsetHeight});
        });

        panel.querySelector('#imgbed-close-btn').onclick = ()=>panel.remove();
        panel.querySelector('#imgbed-close-x-btn').onclick = ()=>panel.remove();
        panel.querySelector('#imgbed-setting-btn').onclick = function() {
            let setting = document.getElementById('imgbed-setting-panel');
            if (setting) { setting.remove(); return; }
            createSettingPanel();
            setTimeout(()=>{
                let setting = document.getElementById('imgbed-setting-panel');
                if (setting) {
                    let spos = loadPanelPos('imgbed-setting-panel-pos', {left:window.innerWidth/2-200,top:window.innerHeight/2-120});
                    setting.style.zIndex = 100000;
                    setting.style.left = spos.left + 'px';
                    setting.style.top = spos.top + 'px';
                    setting.style.position = 'fixed';
                    // 拖动
                    let drag = false, dx=0,dy=0;
                    setting.onmousedown = function(e){ drag=true; dx=e.clientX-setting.offsetLeft; dy=e.clientY-setting.offsetTop; };
                    window.addEventListener('mousemove', moveSetting);
                    window.addEventListener('mouseup', upSetting);
                    function moveSetting(e){
                        if(!drag) return;
                        setting.style.left = (e.clientX-dx)+ 'px';
                        setting.style.top = (e.clientY-dy)+ 'px';
                    }
                    function upSetting(){ drag=false; }
                }
            }, 10);
        };

        if (imgbedExtractedLinks === null) {
            imgbedExtractedLinks = extractPosterAndShots();
        }
        panel.querySelector('#imgbed-poster-shots').value = imgbedExtractedLinks.join('\n');

        panel.querySelector('#imgbed-clear-pre-btn').onclick = function() {
            panel.querySelector('#imgbed-poster-shots').value = '';
        };
        panel.querySelector('#imgbed-clear-post-btn').onclick = function() {
            panel.querySelector('#imgbed-uploaded-links').value = '';
        };

        panel.querySelector('#imgbed-transfer-btn').onclick = async function() {
            const textarea = panel.querySelector('#imgbed-poster-shots');
            const out = panel.querySelector('#imgbed-uploaded-links');
            let cfg = await getConfig();
            let imgLinks = textarea.value.split(/\s+/).filter(Boolean);
            let results = [];
            for (let i = 0; i < imgLinks.length; i++) {
                panel.querySelector('#imgbed-transfer-btn').textContent = `转存中(${i+1}/${imgLinks.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadRemoteToPixhost(imgLinks[i], (err, resp) => {
                            if (!err && resp) results.push(thumbToBig(resp.th_url));
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadRemoteToFreeimage(imgLinks[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp && resp.image && resp.image.url) results.push(resp.image.url);
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadRemoteToAGSV(imgLinks[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp && resp.data && resp.data.links && resp.data.links.url) results.push(resp.data.links.url);
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] 浮动面板PicGo远程上传', {link: imgLinks[i], token: cfg.picgo_token ? '***' : 'empty'});
                        uploadRemoteToPicGo(imgLinks[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] 浮动面板PicGo远程上传回调', {err, resp});
                            if (!err && resp && resp.image && resp.image.url) {
                                results.push(resp.image.url);
                                console.log('[图床助手] 浮动面板PicGo上传成功', resp.image.url);
                            } else {
                                console.error('[图床助手] 浮动面板PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadRemoteToImgbb(imgLinks[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp && resp.data && resp.data.url) results.push(resp.data.url);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            }
            if (panel.querySelector('#imgbed-bbcode-checkbox').checked) {
                results = results.map(url => `[img]${url}[/img]`);
            }
            out.value = results.join('\n');
            panel.querySelector('#imgbed-transfer-btn').textContent = '一键转存到图床';
        };

        const fileInput = panel.querySelector('#imgbed-file-input');
        panel.querySelector('#imgbed-upload-btn').onclick = function() { fileInput.click(); };
        fileInput.onchange = async function() {
            let cfg = await getConfig();
            let files = Array.from(fileInput.files);
            if (files.length === 0) return;
            let out = panel.querySelector('#imgbed-uploaded-links');
            let results = out.value ? out.value.split('\n') : [];
            for (let i = 0; i < files.length; i++) {
                panel.querySelector('#imgbed-upload-btn').textContent = `上传中(${i+1}/${files.length})...`;
                await new Promise((resolve) => {
                    if (cfg.host === 'pixhost') {
                        uploadLocalToPixhost(files[i], (err, resp) => {
                            if (!err && resp) results.push(thumbToBig(resp.th_url));
                            resolve();
                        });
                    } else if (cfg.host === 'freeimage') {
                        uploadLocalToFreeimage(files[i], cfg.freeimage_token, (err, resp) => {
                            if (!err && resp && resp.image && resp.image.url) results.push(resp.image.url);
                            resolve();
                        });
                    } else if (cfg.host === 'agsv') {
                        uploadLocalToAGSV(files[i], cfg.agsv_token, (err, resp) => {
                            if (!err && resp && resp.data && resp.data.links && resp.data.links.url) results.push(resp.data.links.url);
                            resolve();
                        });
                    } else if (cfg.host === 'picgo') {
                        console.log('[图床助手] 浮动面板PicGo本地上传', {fileName: files[i].name, token: cfg.picgo_token ? '***' : 'empty'});
                        uploadLocalToPicGo(files[i], cfg.picgo_token, (err, resp) => {
                            console.log('[图床助手] 浮动面板PicGo本地上传回调', {err, resp});
                            if (!err && resp) {
                                results.push(resp.image.url);
                                console.log('[图床助手] 浮动面板PicGo上传成功', resp.image.url);
                            } else {
                                console.error('[图床助手] 浮动面板PicGo上传失败', {err, resp});
                            }
                            resolve();
                        });
                    } else if (cfg.host === 'imgbb') {
                        uploadLocalToImgbb(files[i], cfg.imgbb_token, (err, resp) => {
                            if (!err && resp) results.push(resp.data.url);
                            resolve();
                        });
                    }
                });
            }
            if (panel.querySelector('#imgbed-bbcode-checkbox').checked) {
                results = results.map(url => `[img]${url}[/img]`);
            }
            out.value = results.join('\n');
            panel.querySelector('#imgbed-upload-btn').textContent = '上传本地图片到图床';
            fileInput.value = '';
        };

        panel.querySelector('#imgbed-toggle-bbcode-btn').onclick = function() {
            let pre = panel.querySelector('#imgbed-poster-shots');
            let post = panel.querySelector('#imgbed-uploaded-links');
            [pre, post].forEach(textarea => {
                let lines = textarea.value.split('\n');
                let newLines = lines.map(line => {
                    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(line.trim())) {
                        return `[img]${line.trim()}[/img]`;
                    } else if (/^\[img\]https?:\/\/.+\.(jpg|jpeg|png|gif)\[\/img\]$/i.test(line.trim())) {
                        return line.trim().replace(/^\[img\](.+)\[\/img\]$/i, '$1');
                    }
                    return line;
                });
                textarea.value = newLines.join('\n');
            });
        };

        getConfig().then(cfg => {
            panel.querySelector('#imgbed-bbcode-checkbox').checked = !!cfg.bbcode;
        });
        panel.querySelector('#imgbed-bbcode-checkbox').onchange = function() {
            getConfig().then(cfg => {
                setConfig({...cfg, bbcode: panel.querySelector('#imgbed-bbcode-checkbox').checked});
            });
        };
    }

    function createFloatingIcon() {
        if (document.getElementById('imgbed-floating-icon')) return;
        const icon = document.createElement('div');
        icon.id = 'imgbed-floating-icon';
        icon.title = '图床助手';
        icon.style.position = 'fixed';
        icon.style.top = '300px';
        icon.style.left = '15px';
        icon.style.zIndex = 99998;
        icon.style.width = '48px';
        icon.style.height = '48px';
        icon.style.background = 'linear-gradient(135deg,#f7f7fa 60%,#e0e0e0 100%)';
        icon.style.border = '1.5px solid #aaa';
        icon.style.borderRadius = '50%';
        icon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.13)';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.cursor = 'pointer';
        icon.style.userSelect = 'none';
        icon.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#fff" stroke="#888" stroke-width="2"></circle><text x="16" y="22" text-anchor="middle" font-size="18" font-family="微软雅黑,Arial" fill="#888">图</text></svg>`;
        document.body.appendChild(icon);

        let pos = loadPanelPos('imgbed-floating-icon-pos', {left:15,top:300});
        icon.style.left = pos.left + 'px';
        icon.style.top = pos.top + 'px';

        let isDown = false, offsetX = 0, offsetY = 0, moved = false;
        icon.addEventListener('mousedown', function(e) {
            isDown = true;
            moved = false;
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            moved = true;
            icon.style.left = (e.clientX - offsetX) + 'px';
            icon.style.top = (e.clientY - offsetY) + 'px';
        });
        window.addEventListener('mouseup', function() {
            if (isDown) {
                savePanelPos('imgbed-floating-icon-pos', {left:icon.offsetLeft,top:icon.offsetTop});
            }
            isDown = false;
            document.body.style.userSelect = '';
        });

        icon.addEventListener('click', function(e) {
            if (moved) return;
            if (!document.getElementById('imgbed-floating-panel')) {
                createFloatingPanel();
            } else {
                let panel = document.getElementById('imgbed-floating-panel');
                panel.style.display = (panel.style.display === 'none' ? '' : 'none');
            }
        });
    }

    if (isGeneralUploadPage()) {
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', createFloatingIcon);
        } else {
            createFloatingIcon();
        }
    }

    autoAddBtns();
})();