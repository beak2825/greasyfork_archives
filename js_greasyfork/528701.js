// ==UserScript==
// @name         网易云音乐云盘清理工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动清理网易云音乐云盘中的日文/韩文/百家讲坛/英文/短歌曲等内容，支持导出同名歌曲列表
// @author       Your name
// @match        https://music.163.com/*
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @require      https://fastly.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @run-at       document-start
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/528701/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%BA%91%E7%9B%98%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/528701/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%BA%91%E7%9B%98%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
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
                deleteEnglish: false,
                minDuration: 0,
                deleteShortSongs: false
            };
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
                        <label><input type="checkbox" id="deleteShortSongs"> 删除短歌曲（小于指定时长）</label><br>
                        <label><input type="number" id="minDuration" value="${this.options.minDuration / 1000}" style="width: 60px; margin-left: 10px;"> 最小时长（秒）</label>
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
                        deleteShortSongs: document.getElementById('deleteShortSongs').checked,
                        minDuration: document.getElementById('minDuration').value * 1000
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.options = result.value;
                    console.log("设置的选项:", this.options);

                    // 显示进度弹窗
                    Swal.fire({
                        title: '云盘清理中',
                        html: '正在扫描云盘歌曲...',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: '暂停',
                        didOpen: () => {
                            Swal.showLoading();
                            this.fetchCloudSongInfoSub(0, []);
                        },
                        willClose: () => {
                            this.isPaused = true;
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            this.isPaused = true;
                            Swal.fire({
                                title: '已暂停',
                                html: `已删除${this.deletedCount}首歌曲`,
                                icon: 'info',
                                confirmButtonText: '继续',
                                showCancelButton: true,
                                cancelButtonText: '结束'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.isPaused = false;
                                    this.start();
                                }
                            });
                        }
                    });
                }
            });
        }

        fetchCloudSongInfoSub(offset, songIds) {
            this.currentOffset = offset;
            let cleaner = this;

            weapiRequest("/api/v1/cloud/get", {
                data: {
                    limit: 1000,
                    offset: offset
                },
                onload: function(res) {
                    if (res.code !== 200) {
            Swal.fire({
                            title: '获取云盘歌曲失败',
                            text: JSON.stringify(res),
                            icon: 'error'
                        });
                        return;
                    }

                    // 记录总数
                    cleaner.totalCount = res.count;

                    Swal.update({
                        html: `正在扫描第${offset + 1}到${Math.min(offset + 1000, res.count)}首云盘歌曲<br>已删除${cleaner.deletedCount}首歌曲`
                    });

                    // 处理歌曲
                    cleaner.processSongs(res.data);

                    // 检查是否继续扫描
                    if (res.hasMore && offset < 250000 && !cleaner.isPaused) {
                        // 延迟一点时间再请求下一批
                        setTimeout(() => {
                            cleaner.fetchCloudSongInfoSub(offset + 1000, songIds);
                        }, 1000);
                    } else {
                        // 扫描完成
                        setTimeout(() => {
                            if (!cleaner.isPaused) {
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

        processSongs(songs) {
            // 创建删除队列
            const deleteQueue = [];

            songs.forEach((song) => {
                // 打印歌曲信息，用于调试
                console.log("处理歌曲:", song.songName, "ID:", song.simpleSong.id);

                // 根据选项应用删除规则
                if (this.options.deleteBJJT && song.songName.includes("百家讲坛")) {
                    console.log("删除百家讲坛", song.songName);
                    // 保存歌曲信息到删除队列
                    deleteQueue.push({
                        id: song.simpleSong.id,
                        name: song.songName,
                        reason: "百家讲坛"
                    });
                    return;
                }

                if (this.options.deleteJapanese && /[\u3040-\u309F\u30A0-\u30FF]/.test(song.songName)) {
                    console.log("删除日文", song.songName);
                    // 保存歌曲信息到删除队列
                    deleteQueue.push({
                        id: song.simpleSong.id,
                        name: song.songName,
                        reason: "日文"
                    });
                    return;
                }

                if (this.options.deleteKorean && /[\uAC00-\uD7AF]/.test(song.songName)) {
                    console.log("删除韩文", song.songName);
                    // 保存歌曲信息到删除队列
                    deleteQueue.push({
                        id: song.simpleSong.id,
                        name: song.songName,
                        reason: "韩文"
                    });
                    return;
                }

                // 修改英文歌曲检测规则，要求至少包含一个英文字母
                if (this.options.deleteEnglish &&
                    /^[a-zA-Z0-9\s\-_,.'"!?&()[\]{}:;\/\\|<>+=*#$%@^`~]+$/.test(song.songName) &&
                    /[a-zA-Z]/.test(song.songName)) {
                    console.log("删除英文", song.songName);
                    // 保存歌曲信息到删除队列
                    deleteQueue.push({
                        id: song.simpleSong.id,
                        name: song.songName,
                        reason: "英文"
                    });
                    return;
                }

                // 添加时长检测
                if (this.options.deleteShortSongs) {
                    // 检查歌曲时长属性是否存在
                    if (!song.simpleSong || typeof song.simpleSong.dt === 'undefined') {
                        console.error("歌曲缺少时长信息:", song);
                        return;
                    }

                    console.log("检查短歌曲:", song.songName,
                                "时长:", song.simpleSong.dt, "毫秒",
                                "最小时长设置:", this.options.minDuration, "毫秒",
                                "是否小于最小时长:", song.simpleSong.dt < this.options.minDuration);

                    if (song.simpleSong.dt < this.options.minDuration) {
                        console.log("删除短歌曲", song.songName, "时长:", song.simpleSong.dt, "毫秒", this.duringTimeDesc(song.simpleSong.dt));
                        // 保存歌曲信息到删除队列
                        deleteQueue.push({
                            id: song.simpleSong.id,
                            name: song.songName,
                            reason: "短歌曲",
                            duration: song.simpleSong.dt
                        });
                        return;
                    }
                }
            });

            console.log("删除队列长度:", deleteQueue.length);

            // 处理删除队列
            const processQueue = () => {
                if (deleteQueue.length > 0 && !this.isPaused) {
                    const songInfo = deleteQueue.shift();
                    console.log("从队列中取出歌曲:", songInfo.name, "ID:", songInfo.id);
                    this.deleteSong(songInfo);
                    // 延迟处理下一个，避免请求过快
                    setTimeout(processQueue, 300);
                }
            };

            // 开始处理队列
            processQueue();
        }

        deleteSong(songInfo) {
            console.log("准备删除歌曲:", songInfo.name, "ID:", songInfo.id);

            weapiRequest("/api/cloud/del", {
                data: {
                    songIds: JSON.stringify([songInfo.id])
                },
                onload: (res) => {
                    if (res.code === 200) {
                        this.deletedCount++;

                        // 根据删除原因输出不同的日志
                        if (songInfo.reason === "短歌曲") {
                            console.log("删除成功", songInfo.name, "时长:", songInfo.duration, "毫秒", this.duringTimeDesc(songInfo.duration));
                        } else {
                            console.log("删除成功", songInfo.name, `(${songInfo.reason})`);
                        }

                        // 实时更新弹窗中的删除计数
                        if (!this.isPaused && Swal.isVisible()) {
                            Swal.update({
                                html: `正在扫描第${this.currentOffset + 1}到${Math.min(this.currentOffset + 1000, this.totalCount || 0)}首云盘歌曲<br>已删除${this.deletedCount}首歌曲`
                            });
                        }
                    } else {
                        console.error("删除失败", songInfo.name, res);
                    }
                }
            });
        }

        duringTimeDesc(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                return `${days}天${hours % 24}小时${minutes % 60}分钟${seconds % 60}秒`;
            } else if (hours > 0) {
                return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
            } else if (minutes > 0) {
                return `${minutes}分钟${seconds % 60}秒`;
            } else {
                return `${seconds}秒`;
            }
        }
    }

    // 同名歌曲查找类
    class DuplicateSongFinder {
        constructor() {
            this.allSongs = [];
            this.duplicates = [];
            this.currentOffset = 0;
            this.totalCount = 0;
            this.isScanning = false;
        }

        start() {
            if (this.isScanning) {
                showTips("正在扫描中，请稍候", 0);
                return;
            }

            // 显示范围选择对话框
            Swal.fire({
                title: '设置扫描范围',
                html: `
                    <div style="text-align: left; margin-bottom: 15px;">
                        <label>起始位置: <input type="number" id="startOffset" value="0" min="0" style="width: 100px;"></label><br>
                        <label>结束位置: <input type="number" id="endOffset" value="1000" min="1" style="width: 100px;"></label><br>
                        <small>（设置为0表示扫描全部）</small>
                        <hr>
                        <div style="margin-top: 10px;">排序方式:</div>
                        <label><input type="radio" name="sortBy" value="count" checked> 按同名歌曲数量排序</label><br>
                        <label><input type="radio" name="sortBy" value="duration"> 按歌曲时长排序</label><br>
                        <label><input type="radio" name="sortBy" value="fileSize"> 按文件大小排序</label><br>
                        <label><input type="radio" name="sortBy" value="popularity"> 按热度排序</label><br>
                        <label><input type="radio" name="sortBy" value="status"> 按版权状态排序</label><br>
                        <label><input type="radio" name="sortBy" value="fee"> 按收费类型排序</label><br>
                        <label><input type="radio" name="sortBy" value="fileType"> 按文件类型排序</label><br>
                        <label><input type="radio" name="sortBy" value="publishTime"> 按发布时间排序</label><br>
                        <label><input type="checkbox" id="sortDesc" checked> 降序排列（从大到小）</label>
                        <hr>
                        <div style="margin-top: 10px;">删除设置:</div>
                        <label>每组保留前 <input type="number" id="keepTopN" value="1" min="0" style="width: 60px;"> 首歌曲，提取其余歌曲ID</label>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '开始扫描',
                cancelButtonText: '取消',
                preConfirm: () => {
                    return {
                        startOffset: parseInt(document.getElementById('startOffset').value) || 0,
                        endOffset: parseInt(document.getElementById('endOffset').value) || 0,
                        sortBy: document.querySelector('input[name="sortBy"]:checked').value,
                        sortDesc: document.getElementById('sortDesc').checked,
                        keepTopN: parseInt(document.getElementById('keepTopN').value) || 1
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.isScanning = true;
                    this.allSongs = [];
                    this.duplicates = [];
                    this.currentOffset = result.value.startOffset;
                    this.endOffset = result.value.endOffset;
                    this.sortOptions = {
                        sortBy: result.value.sortBy,
                        sortDesc: result.value.sortDesc
                    };
                    this.keepTopN = result.value.keepTopN;

                    Swal.fire({
                        title: '查找同名歌曲',
                        html: '正在扫描云盘歌曲...',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        didOpen: () => {
                            Swal.showLoading();
                            this.fetchCloudSongs(this.currentOffset);
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            this.isScanning = false;
                            showTips("已取消扫描", 0);
                        }
                    });
                }
            });
        }

        fetchCloudSongs(offset) {
            this.currentOffset = offset;

            weapiRequest("/api/v1/cloud/get", {
                data: {
                    limit: 1000,
                    offset: offset
                },
                onload: (res) => {
                    if (res.code !== 200) {
                        this.isScanning = false;
                        Swal.fire({
                            title: '获取云盘歌曲失败',
                            text: JSON.stringify(res),
                            icon: 'error'
                        });
                        return;
                    }

                    // 记录总数
                    this.totalCount = res.count;

                    // 更新进度
                    Swal.update({
                        html: `正在扫描第${offset + 1}到${Math.min(offset + 1000, res.count)}首云盘歌曲<br>已找到${this.duplicates.length}组同名歌曲`
                    });

                    // 添加歌曲到列表
                    this.allSongs = this.allSongs.concat(res.data);

                    // 检查是否继续扫描
                    const shouldContinue = res.hasMore &&
                                          offset < 250000 &&
                                          this.isScanning &&
                                          (this.endOffset === 0 || offset + 1000 < this.endOffset);

                    if (shouldContinue) {
                        // 延迟一点时间再请求下一批
                        setTimeout(() => {
                            this.fetchCloudSongs(offset + 1000);
                        }, 1000);
                    } else {
                        // 扫描完成，开始查找同名歌曲
                        this.findDuplicates();
                    }
                }
            });
        }

        findDuplicates() {
            Swal.update({
                html: '正在分析同名歌曲...'
            });

            // 按歌曲名称分组
            const songGroups = {};

            this.allSongs.forEach(song => {
                const name = song.songName.trim();
                if (!songGroups[name]) {
                    songGroups[name] = [];
                }
                songGroups[name].push(song);
            });

            // 找出有多个同名歌曲的组
            for (const name in songGroups) {
                if (songGroups[name].length > 1) {
                    this.duplicates.push({
                        name: name,
                        songs: songGroups[name]
                    });
                }
            }

            // 首先按同名歌曲数量排序
            this.duplicates.sort((a, b) => b.songs.length - a.songs.length);

            // 对每组内的歌曲进行排序
            this.duplicates.forEach(group => {
                this.sortSongsInGroup(group.songs);
            });

            // 生成报告
            this.generateReport();
        }

        sortSongsInGroup(songs) {
            const { sortBy, sortDesc } = this.sortOptions;
            const direction = sortDesc ? -1 : 1;

            switch (sortBy) {
                case 'duration':
                    songs.sort((a, b) => direction * (a.simpleSong.dt - b.simpleSong.dt));
                    break;
                case 'fileSize':
                    songs.sort((a, b) => direction * (a.fileSize - b.fileSize));
                    break;
                case 'popularity':
                    songs.sort((a, b) => {
                        const popA = a.simpleSong.pop || 0;
                        const popB = b.simpleSong.pop || 0;
                        return direction * (popA - popB);
                    });
                    break;
                case 'status':
                    songs.sort((a, b) => {
                        const stA = a.simpleSong.privilege?.st || 0;
                        const stB = b.simpleSong.privilege?.st || 0;
                        return direction * (stA - stB);
                    });
                    break;
                case 'fee':
                    songs.sort((a, b) => {
                        const feeA = a.simpleSong.privilege?.fee || 0;
                        const feeB = b.simpleSong.privilege?.fee || 0;
                        return direction * (feeA - feeB);
                    });
                    break;
                case 'fileType':
                    songs.sort((a, b) => {
                        const typeA = a.fileName.split('.').pop().toLowerCase() || '';
                        const typeB = b.fileName.split('.').pop().toLowerCase() || '';
                        return direction * typeA.localeCompare(typeB);
                    });
                    break;
                case 'publishTime':
                    songs.sort((a, b) => {
                        const timeA = a.simpleSong.publishTime || 0;
                        const timeB = b.simpleSong.publishTime || 0;
                        return direction * (timeA - timeB);
                    });
                    break;
                // 默认按数量排序，但组内不需要额外排序
                case 'count':
                default:
                    break;
            }
        }

        generateReport() {
            if (this.duplicates.length === 0) {
                this.isScanning = false;
                Swal.fire({
                    title: '扫描完成',
                    text: '未找到同名歌曲',
                    icon: 'info'
                });
                return;
            }

            // 获取排序方式的中文描述
            const sortByText = {
                'count': '同名歌曲数量',
                'duration': '歌曲时长',
                'fileSize': '文件大小',
                'popularity': '热度',
                'status': '版权状态',
                'fee': '收费类型',
                'fileType': '文件类型',
                'publishTime': '发布时间'
            }[this.sortOptions.sortBy];

            const sortOrderText = this.sortOptions.sortDesc ? '降序' : '升序';

            // 生成报告文本
            let reportText = `网易云音乐云盘同名歌曲报告\n`;
            reportText += `扫描时间: ${new Date().toLocaleString()}\n`;
            reportText += `扫描范围: ${this.currentOffset - this.allSongs.length + 1} - ${this.currentOffset}\n`;
            reportText += `排序方式: 按${sortByText}${sortOrderText}\n`;
            reportText += `共找到 ${this.duplicates.length} 组同名歌曲\n\n`;

            // 提取需要删除的歌曲ID
            let idsToDelete = [];
            this.duplicates.forEach(group => {
                if (group.songs.length > this.keepTopN) {
                    // 只提取排名在keepTopN之后的歌曲ID
                    const songsToDelete = group.songs.slice(this.keepTopN);
                    songsToDelete.forEach(song => {
                        idsToDelete.push(song.simpleSong.id);
                    });
                }
            });

            // 添加需要删除的ID列表
            if (idsToDelete.length > 0) {
                reportText += `以下是每组保留前${this.keepTopN}首后，其余歌曲的ID列表（共${idsToDelete.length}首）：\n`;
                reportText += idsToDelete.join(',') + '\n\n';

                // 添加批量删除的提示
                reportText += `您可以使用以下API删除这些歌曲：\n`;
                reportText += `/api/cloud/del 参数: {songIds: [${idsToDelete.join(',')}]}\n\n`;
                    } else {
                reportText += `没有需要删除的歌曲（每组已保留前${this.keepTopN}首）\n\n`;
            }

            // 添加详细的同名歌曲信息
            reportText += `==== 同名歌曲详细信息 ====\n\n`;

            this.duplicates.forEach((group, index) => {
                reportText += `${index + 1}. 歌曲名: ${group.name} (${group.songs.length}首)\n`;

                group.songs.forEach((song, songIndex) => {
                    // 标记是否保留
                    const keepMark = songIndex < this.keepTopN ? "[保留]" : "[可删除]";

                    const artist = song.artist || '未知艺术家';
                    const album = song.album || '未知专辑';
                    const fileSize = this.formatFileSize(song.fileSize);
                    const bitrate = Math.floor(song.bitrate / 1000);
                    const duration = this.formatDuration(song.simpleSong.dt);
                    const popularity = song.simpleSong.pop || '未知';

                    // 添加新的信息
                    const status = song.simpleSong.privilege?.st || '未知';
                    const statusText = status < 0 ? '无版权' : '有版权';

                    const fee = song.simpleSong.privilege?.fee || '未知';
                    let feeText = '未知';
                    switch(fee) {
                        case 0: feeText = '免费'; break;
                        case 1: feeText = 'VIP'; break;
                        case 4: feeText = '付费专辑'; break;
                        case 8: feeText = '低音质免费'; break;
                        default: feeText = `类型${fee}`; break;
                    }

                    const fileType = song.fileName.split('.').pop().toLowerCase() || '未知';

                    const publishTime = song.simpleSong.publishTime ? new Date(song.simpleSong.publishTime).toLocaleDateString() : '未知';

                    reportText += `   ${songIndex + 1}. ${keepMark} ID: ${song.simpleSong.id}, 艺术家: ${artist}, 专辑: ${album}\n`;
                    reportText += `      大小: ${fileSize}, 比特率: ${bitrate}kbps, 时长: ${duration}, 热度: ${popularity}\n`;
                    reportText += `      版权: ${statusText}(${status}), 收费: ${feeText}, 文件类型: ${fileType}, 发布时间: ${publishTime}\n`;
                });

                reportText += '\n';
            });

            // 下载报告
            this.downloadReport(reportText);

            // 显示完成消息
            this.isScanning = false;
            Swal.fire({
                title: '扫描完成',
                html: `找到 ${this.duplicates.length} 组同名歌曲，可删除 ${idsToDelete.length} 首<br>报告已下载到您的电脑`,
                icon: 'success'
            });
        }

        downloadReport(text) {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // 获取排序方式的简短描述
            const sortByShort = {
                'count': '数量',
                'duration': '时长',
                'fileSize': '大小',
                'popularity': '热度',
                'status': '版权',
                'fee': '收费',
                'fileType': '类型',
                'publishTime': '时间'
            }[this.sortOptions.sortBy];

            const sortOrderShort = this.sortOptions.sortDesc ? '降序' : '升序';

            // 在文件名中包含排序方式和范围信息
            const startPos = this.currentOffset - this.allSongs.length + 1;
            const endPos = this.currentOffset;
            const rangeInfo = startPos === 0 ? '全部' : `${startPos}-${endPos}`;

            const filename = `网易云音乐云盘同名歌曲_${sortByShort}${sortOrderShort}_${rangeInfo}_${new Date().toISOString().slice(0, 10)}.txt`;

            GM_download({
                url: url,
                name: filename,
                saveAs: true,
                onload: () => {
                    URL.revokeObjectURL(url);
                }
            });
        }

        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        formatDuration(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

                // 创建查找同名歌曲按钮
                let btnFindDuplicates = createSocialButton("查找同名歌曲", socialArea);
                btnFindDuplicates.style.backgroundColor = "#4CAF50";
                btnFindDuplicates.addEventListener("click", () => {
                    const finder = new DuplicateSongFinder();
                    finder.start();
                });

                console.log('云盘工具按钮已添加到社交图标区域');
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

                    // 创建查找同名歌曲按钮
                    let btnFindDuplicates = createBigButton("查找同名歌曲", operationArea, 2);
                    btnFindDuplicates.addEventListener("click", () => {
                        const finder = new DuplicateSongFinder();
                        finder.start();
                    });

                    console.log('云盘工具按钮已添加到操作区域');
                }
            }, 500);
        }
    };

    // 页面加载完成后添加按钮
    window.addEventListener('load', () => {
            addCleanButton();
    });
})();

