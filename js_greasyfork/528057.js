// ==UserScript==
// @name         网易云音乐云盘清理工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动清理网易云音乐云盘中的日文/韩文/百家讲坛/英文/特定字符等内容
// @author       Your name
// @match        https://music.163.com/*
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528057/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%BA%91%E7%9B%98%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/528057/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%BA%91%E7%9B%98%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 基础工具函数
    const weapi = (object) => {
        const iv = "0102030405060708";
        const presetKey = "0CoJUm6Qyw8W8jud";
        const base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB
-----END PUBLIC KEY-----`;
        
        const aesEncrypt = (text, key, iv2) => {
            let cipher = forge.cipher.createCipher("AES-CBC", key);
            cipher.start({ iv: iv2 });
            cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(text)));
            cipher.finish();
            let encrypted = cipher.output;
            return forge.util.encode64(encrypted.getBytes());
        };
        
        const rsaEncrypt = (str, key) => {
            const forgePublicKey = forge.pki.publicKeyFromPem(key);
            const encrypted = forgePublicKey.encrypt(str, "NONE");
            return forge.util.bytesToHex(encrypted);
        };
        
        const text = JSON.stringify(object);
        let secretKey = "";
        for (let i = 0; i < 16; i++) {
            secretKey += base62.charAt(Math.round(Math.random() * 61));
        }
        return {
            params: aesEncrypt(
                aesEncrypt(text, presetKey, iv),
                secretKey,
                iv
            ),
            encSecKey: rsaEncrypt(secretKey.split("").reverse().join(""), publicKey)
        };
    };
    
    // API请求函数
    const weapiRequest = (url, config) => {
        let data = config.data || {};
        let csrfToken = document.cookie.match(/_csrf=([^(;|$)]+)/);
        data.csrf_token = csrfToken ? csrfToken[1] : "";
        const encRes = weapi(data);
        
        const details = {
            url: url.replace("api", "weapi") + `?csrf_token=${data.csrf_token}`,
            method: "POST",
            responseType: "json",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: `params=${encodeURIComponent(encRes.params)}&encSecKey=${encodeURIComponent(encRes.encSecKey)}`,
            onload: (res) => {
                config.onload(res.response);
            },
            onerror: config.onerror
        };
        
        GM_xmlhttpRequest(details);
    };
    
    // 显示提示
    const showTips = (tip, type) => {
        if (unsafeWindow.g_showTipCard) {
            unsafeWindow.g_showTipCard({
                tip,
                type
            });
        } else {
            Swal.fire({
                title: tip,
                icon: type === 1 ? 'success' : 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };
    
    // 创建按钮
    const createBigButton = (desc, parent, appendWay) => {
        let btn = document.createElement("a");
        btn.className = "u-btn2 u-btn2-1";
        let btnDesc = document.createElement("i");
        btnDesc.innerHTML = desc;
        btn.appendChild(btnDesc);
        btn.style.margin = "5px";
        if (appendWay === 1) {
            parent.appendChild(btn);
        } else {
            parent.insertBefore(btn, parent.lastChild);
        }
        return btn;
    };
    
    // 创建社交图标样式的按钮
    const createSocialButton = (desc, parent) => {
        let li = document.createElement("li");
        let btn = document.createElement("a");
        btn.className = "u-btn2 u-btn2-1";
        btn.style.margin = "0 5px";
        btn.style.padding = "0 10px";
        btn.style.lineHeight = "24px";
        btn.style.fontSize = "12px";
        btn.style.color = "#fff";
        btn.style.backgroundColor = "#C20C0C";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.display = "inline-block";
        btn.innerHTML = desc;
        li.appendChild(btn);
        parent.appendChild(li);
        return btn;
    };
    
    // 云盘清理类
    class CloudCleaner {
        constructor() {
            this.deletedCount = 0;
            this.isPaused = false;
            this.currentOffset = 0;
            this.songIds = [];
            this.options = {
                deleteJapanese: true,
                deleteKorean: true,
                deleteBJJT: true,
                deleteEnglish: false, // 默认不删除英文歌曲
                deleteCustomText: false, // 默认不启用特定字符删除
                customText: '', // 用户输入的特定字符
                deleteRussian: false, // 删除俄文歌曲
                deleteArabic: false, // 删除阿拉伯文歌曲
                deleteThai: false, // 删除泰文歌曲
                deleteVietnamese: false, // 删除越南文歌曲
                deleteInstrumental: false, // 删除纯音乐/伴奏
                deleteCover: false, // 删除翻唱歌曲
                deleteLive: false, // 删除现场版/Live
                deleteLowBitrate: false, // 删除低比特率歌曲
                deleteShortDuration: false, // 删除短时长歌曲
                deleteBlacklistArtists: false, // 删除特定歌手的歌曲
                blacklistArtists: '', // 特定歌手黑名单
                deleteBlacklistAlbums: false, // 删除特定专辑的歌曲
                blacklistAlbums: '', // 特定专辑黑名单
                deleteDuplicates: false, // 删除重复歌曲
                deleteFileFormats: false, // 删除特定文件格式的歌曲
                fileFormats: '', // 特定文件格式
                deleteYear: false, // 删除特定年份的歌曲
                year: '' // 特定年份
            };
            this.seenSongs = new Set(); // 用于检测重复歌曲
        }
        
        start() {
            // 显示选项对话框
            Swal.fire({
                title: '云盘清理选项',
                html: `
                    <div style="text-align: left; margin-bottom: 15px;">
                        <label><input type="checkbox" id="delete-japanese" checked> 删除日文歌曲</label><br>
                        <label><input type="checkbox" id="delete-korean" checked> 删除韩文歌曲</label><br>
                        <label><input type="checkbox" id="delete-bjjt" checked> 删除百家讲坛</label><br>
                        <label><input type="checkbox" id="delete-english"> 删除英文歌曲</label><br>
                        <label><input type="checkbox" id="delete-custom-text"> 删除包含以下字符的歌曲</label><br>
                        <input type="text" id="custom-text" placeholder="例如：Act 2" style="margin-top: 5px;"><br>
                        <label><input type="checkbox" id="delete-russian"> 删除俄文歌曲</label><br>
                        <label><input type="checkbox" id="delete-arabic"> 删除阿拉伯文歌曲</label><br>
                        <label><input type="checkbox" id="delete-thai"> 删除泰文歌曲</label><br>
                        <label><input type="checkbox" id="delete-vietnamese"> 删除越南文歌曲</label><br>
                        <label><input type="checkbox" id="delete-instrumental"> 删除纯音乐/伴奏</label><br>
                        <label><input type="checkbox" id="delete-cover"> 删除翻唱歌曲</label><br>
                        <label><input type="checkbox" id="delete-live"> 删除现场版/Live</label><br>
                        <label><input type="checkbox" id="delete-low-bitrate"> 删除低比特率歌曲（<192kbps）</label><br>
                        <label><input type="checkbox" id="delete-short-duration"> 删除短时长歌曲（<30秒）</label><br>
                        <label><input type="checkbox" id="delete-blacklist-artists"> 删除特定歌手的歌曲</label><br>
                        <input type="text" id="blacklist-artists" placeholder="例如：歌手A,歌手B" style="margin-top: 5px;"><br>
                        <label><input type="checkbox" id="delete-blacklist-albums"> 删除特定专辑的歌曲</label><br>
                        <input type="text" id="blacklist-albums" placeholder="例如：专辑A,专辑B" style="margin-top: 5px;"><br>
                        <label><input type="checkbox" id="delete-duplicates"> 删除重复歌曲</label><br>
                        <label><input type="checkbox" id="delete-file-formats"> 删除特定文件格式的歌曲</label><br>
                        <input type="text" id="file-formats" placeholder="例如：mp3,flac" style="margin-top: 5px;"><br>
                        <label><input type="checkbox" id="delete-year"> 删除特定年份的歌曲</label><br>
                        <input type="text" id="year" placeholder="例如：2020" style="margin-top: 5px;">
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '开始清理',
                cancelButtonText: '取消',
                preConfirm: () => {
                    return {
                        deleteJapanese: document.getElementById('delete-japanese').checked,
                        deleteKorean: document.getElementById('delete-korean').checked,
                        deleteBJJT: document.getElementById('delete-bjjt').checked,
                        deleteEnglish: document.getElementById('delete-english').checked,
                        deleteCustomText: document.getElementById('delete-custom-text').checked,
                        customText: document.getElementById('custom-text').value.trim(),
                        deleteRussian: document.getElementById('delete-russian').checked,
                        deleteArabic: document.getElementById('delete-arabic').checked,
                        deleteThai: document.getElementById('delete-thai').checked,
                        deleteVietnamese: document.getElementById('delete-vietnamese').checked,
                        deleteInstrumental: document.getElementById('delete-instrumental').checked,
                        deleteCover: document.getElementById('delete-cover').checked,
                        deleteLive: document.getElementById('delete-live').checked,
                        deleteLowBitrate: document.getElementById('delete-low-bitrate').checked,
                        deleteShortDuration: document.getElementById('delete-short-duration').checked,
                        deleteBlacklistArtists: document.getElementById('delete-blacklist-artists').checked,
                        blacklistArtists: document.getElementById('blacklist-artists').value.trim(),
                        deleteBlacklistAlbums: document.getElementById('delete-blacklist-albums').checked,
                        blacklistAlbums: document.getElementById('blacklist-albums').value.trim(),
                        deleteDuplicates: document.getElementById('delete-duplicates').checked,
                        deleteFileFormats: document.getElementById('delete-file-formats').checked,
                        fileFormats: document.getElementById('file-formats').value.trim(),
                        deleteYear: document.getElementById('delete-year').checked,
                        year: document.getElementById('year').value.trim()
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.options = result.value;
                    this.startCleaning();
                }
            });
        }
        
        startCleaning() {
            this.deletedCount = 0;
            this.isPaused = false;
            this.currentOffset = 0;
            this.songIds = [];
            this.seenSongs.clear();
            
            Swal.fire({
                title: '云盘清理中',
                html: '正在扫描云盘歌曲...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                cancelButtonText: '暂停',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                    const cancelButton = Swal.getCancelButton();
                    cancelButton.style.display = 'inline-block';
                    cancelButton.addEventListener('click', () => {
                        this.togglePause();
                    });
                }
            });
            
            this.fetchCloudSongInfoSub(0, []);
        }
        
        togglePause() {
            this.isPaused = !this.isPaused;
            
            if (this.isPaused) {
                // 暂停状态
                Swal.update({
                    title: '云盘清理已暂停',
                    html: `已扫描到第${this.currentOffset}首歌曲<br>已删除${this.deletedCount}首歌曲`,
                    showCancelButton: true,
                    showConfirmButton: true,
                    cancelButtonText: '继续',
                    confirmButtonText: '结束清理'
                });
                
                Swal.getCancelButton().addEventListener('click', () => {
                    this.togglePause();
                });
                
                Swal.getConfirmButton().addEventListener('click', () => {
                    Swal.fire({
                        title: '云盘清理已终止',
                        html: `共删除了${this.deletedCount}首歌曲`,
                        icon: 'info'
                    });
                });
            } else {
                // 继续状态
                Swal.fire({
                    title: '云盘清理中',
                    html: `正在扫描第${this.currentOffset + 1}到${this.currentOffset + 1000}首云盘歌曲<br>已删除${this.deletedCount}首歌曲`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: true,
                    cancelButtonText: '暂停',
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                        const cancelButton = Swal.getCancelButton();
                        cancelButton.style.display = 'inline-block';
                        cancelButton.addEventListener('click', () => {
                            this.togglePause();
                        });
                    }
                });
                
                // 继续扫描
                this.fetchCloudSongInfoSub(this.currentOffset, this.songIds);
            }
        }
        
        fetchCloudSongInfoSub(offset, songIds) {
            if (this.isPaused) {
                return;
            }
            
            this.currentOffset = offset;
            this.songIds = songIds;
            
            let cleaner = this;
            weapiRequest("/api/v1/cloud/get", {
                data: {
                    limit: 1000,
                    offset
                },
                onload: (res) => {
                    if (cleaner.isPaused) {
                        return;
                    }
                    
                    // 记录总数
                    cleaner.totalCount = res.count;
                    
                    Swal.update({
                        html: `正在扫描第${offset + 1}到${Math.min(offset + 1000, res.count)}首云盘歌曲<br>已删除${cleaner.deletedCount}首歌曲`
                    });
                    
                    // 创建一个删除队列，避免同时发送太多请求
                    let deleteQueue = [];
                    
                    res.data.forEach((song) => {
                        const songNameLower = song.songName.toLowerCase();
                        const artistNameLower = song.artist.toLowerCase();
                        const albumNameLower = song.album.toLowerCase();
                        const fileNameLower = song.fileName.toLowerCase();
                        
                        // 根据选项应用删除规则
                        if (this.options.deleteBJJT && songNameLower.includes("百家讲坛")) {
                            console.log("删除百家讲坛", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        if (this.options.deleteJapanese && /[\u3040-\u309F\u30A0-\u30FF]/.test(song.songName)) {
                            console.log("删除日文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        if (this.options.deleteKorean && /[\uAC00-\uD7AF]/.test(song.songName)) {
                            console.log("删除韩文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        if (this.options.deleteEnglish && 
                            /^[a-zA-Z0-9\s\-_,.'"!?&()[\]{}:;\/\\|<>+=*#$%@^`~]+$/.test(song.songName) && 
                            /[a-zA-Z]/.test(song.songName)) {
                            console.log("删除英文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除包含特定字符的歌曲（不区分大小写）
                        if (this.options.deleteCustomText && this.options.customText && 
                            songNameLower.includes(this.options.customText.toLowerCase())) {
                            console.log(`删除包含特定字符 "${this.options.customText}" 的歌曲`, song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除俄文歌曲
                        if (this.options.deleteRussian && /[\u0400-\u04FF]/.test(song.songName)) {
                            console.log("删除俄文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除阿拉伯文歌曲
                        if (this.options.deleteArabic && /[\u0600-\u06FF]/.test(song.songName)) {
                            console.log("删除阿拉伯文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除泰文歌曲
                        if (this.options.deleteThai && /[\u0E00-\u0E7F]/.test(song.songName)) {
                            console.log("删除泰文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除越南文歌曲
                        if (this.options.deleteVietnamese && /[\u1E00-\u1EFF]/.test(song.songName)) {
                            console.log("删除越南文", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除纯音乐/伴奏
                        if (this.options.deleteInstrumental && 
                            (songNameLower.includes("纯音乐") || songNameLower.includes("伴奏") || songNameLower.includes("instrumental"))) {
                            console.log("删除纯音乐/伴奏", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除翻唱歌曲
                        if (this.options.deleteCover && 
                            (songNameLower.includes("翻唱") || songNameLower.includes("cover"))) {
                            console.log("删除翻唱歌曲", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除现场版/Live
                        if (this.options.deleteLive && 
                            (songNameLower.includes("现场版") || songNameLower.includes("live"))) {
                            console.log("删除现场版歌曲", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除低比特率歌曲
                        if (this.options.deleteLowBitrate && song.bitrate < 192) {
                            console.log("删除低比特率歌曲", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除短时长歌曲
                        if (this.options.deleteShortDuration && song.duration < 30) {
                            console.log("删除短时长歌曲", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                        
                        // 删除特定歌手的歌曲
                        if (this.options.deleteBlacklistArtists && this.options.blacklistArtists) {
                            const blacklistArtists = this.options.blacklistArtists.split(',').map(artist => artist.trim().toLowerCase());
                            if (blacklistArtists.some(artist => artistNameLower.includes(artist))) {
                                console.log("删除特定歌手的歌曲", song.songName);
                                deleteQueue.push(song.simpleSong.id);
                                return;
                            }
                        }
                        
                        // 删除特定专辑的歌曲
                        if (this.options.deleteBlacklistAlbums && this.options.blacklistAlbums) {
                            const blacklistAlbums = this.options.blacklistAlbums.split(',').map(album => album.trim().toLowerCase());
                            if (blacklistAlbums.some(album => albumNameLower.includes(album))) {
                                console.log("删除特定专辑的歌曲", song.songName);
                                deleteQueue.push(song.simpleSong.id);
                                return;
                            }
                        }
                        
                        // 删除重复歌曲
                        if (this.options.deleteDuplicates) {
                            if (this.seenSongs.has(song.songName)) {
                                console.log("删除重复歌曲", song.songName);
                                deleteQueue.push(song.simpleSong.id);
                                return;
                            }
                            this.seenSongs.add(song.songName);
                        }
                        
                        // 删除特定文件格式的歌曲
                        if (this.options.deleteFileFormats && this.options.fileFormats) {
                            const fileFormats = this.options.fileFormats.split(',').map(format => format.trim().toLowerCase());
                            if (fileFormats.some(format => fileNameLower.endsWith(format))) {
                                console.log("删除特定文件格式的歌曲", song.songName);
                                deleteQueue.push(song.simpleSong.id);
                                return;
                            }
                        }
                        
                        // 删除特定年份的歌曲
                        if (this.options.deleteYear && this.options.year && song.year < parseInt(this.options.year)) {
                            console.log("删除特定年份的歌曲", song.songName);
                            deleteQueue.push(song.simpleSong.id);
                            return;
                        }
                    });
                    
                    // 处理删除队列
                    const processQueue = () => {
                        if (deleteQueue.length > 0 && !cleaner.isPaused) {
                            const songId = deleteQueue.shift();
                            cleaner.deleteSong(songId);
                            // 延迟处理下一个，避免请求过快
                            setTimeout(processQueue, 300);
                        }
                    };
                    
                    // 开始处理队列
                    processQueue();
                    
                    // 检查是否继续扫描
                    if (res.hasMore && offset < 250000) {
                        // 延迟一点时间再请求下一批，给删除操作留出时间
                        setTimeout(() => {
                            if (!cleaner.isPaused) {
                                cleaner.fetchCloudSongInfoSub(offset + 1000, songIds);
                            }
                        }, 1000);
                    } else {
                        // 等待所有删除操作完成
                        const checkComplete = setInterval(() => {
                            if (deleteQueue.length === 0) {
                                clearInterval(checkComplete);
                                Swal.fire({
                                    title: '云盘清理完成',
                                    html: `共删除了${cleaner.deletedCount}首歌曲`,
                                    icon: 'success'
                                });
                            }
                        }, 1000);
                    }
                }
            });
        }
        
        deleteSong(songId) {
            let cleaner = this;
            weapiRequest("/api/cloud/del", {
                data: {
                    songIds: JSON.stringify([songId])
                },
                onload: (res) => {
                    if (res.code === 200) {
                        console.log("删除成功", songId);
                        cleaner.deletedCount++;
                        
                        // 实时更新弹窗中的删除计数
                        if (!cleaner.isPaused) {
                            Swal.update({
                                html: `正在扫描第${cleaner.currentOffset + 1}到${Math.min(cleaner.currentOffset + 1000, cleaner.totalCount || 0)}首云盘歌曲<br>已删除${cleaner.deletedCount}首歌曲`
                            });
                        }
                    } else {
                        console.error("删除失败", songId, res);
                    }
                }
            });
        }
    }
    
    // 添加按钮到社交图标区域
    const addCleanButtonToSocial = () => {
        // 等待社交图标区域加载
        const checkInterval = setInterval(() => {
            const socialArea = document.querySelector('.u-logo.u-logo-s.f-cb');
            
            if (socialArea) {
                clearInterval(checkInterval);
                
                // 创建云盘清理按钮
                let btnClean = createSocialButton("云盘清理", socialArea);
                btnClean.addEventListener("click", () => {
                    const cleaner = new CloudCleaner();
                    cleaner.start();
                });
                
                console.log('云盘清理按钮已添加到社交图标区域');
            }
        }, 500);
    };
    
    // 添加按钮到用户主页
    const addCleanButton = () => {
        // 检查是否在用户主页
        if (window.location.href.includes('music.163.com/#/user/home') || 
            window.location.href.includes('music.163.com/user/home')) {
            
            // 添加到社交图标区域
            addCleanButtonToSocial();
            
            // 也可以添加到操作区域
            const checkInterval = setInterval(() => {
                const operationArea = document.querySelector('.g-wrap7');
                
                if (operationArea) {
                    clearInterval(checkInterval);
                    
                    // 创建云盘清理按钮
                    let btnClean = createBigButton("云盘清理", operationArea, 2);
                    btnClean.addEventListener("click", () => {
                        const cleaner = new CloudCleaner();
                        cleaner.start();
                    });
                    
                    console.log('云盘清理按钮已添加到操作区域');
                }
            }, 500);
        }
    };
    
    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 加载forge库
        const script = document.createElement('script');
        script.src = 'https://fastly.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js';
        script.onload = function() {
            addCleanButton();
        };
        document.head.appendChild(script);
    });
})();