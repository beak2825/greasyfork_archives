// ==UserScript==
// @name            BT4G Magnet AutoGen
// @namespace       https://ahogek.com
// @version         1.4.4
// @description     自动转换BT4G哈希到磁力链接 | 添加高级搜索选项：分辨率、HDR、编码、杜比音频和模糊搜索 | 删除资源恢复
// @author          AhogeK
// @match           *://*.bt4g.org/*
// @match           *://*.bt4gprx.com/*
// @match           *://*.bt4g.com/*
// @match           *://*.downloadtorrentfile.com/hash/*
// @grant           GM_xmlhttpRequest
// @connect         itorrents.org
// @connect         btcache.me
// @connect         thetorrent.org
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/530876/BT4G%20Magnet%20AutoGen.user.js
// @updateURL https://update.greasyfork.org/scripts/530876/BT4G%20Magnet%20AutoGen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 查找所有磁力链接按钮
    const magnetButtons = document.querySelectorAll('a.btn-primary[href*="downloadtorrentfile.com/hash/"]');

    magnetButtons.forEach(button => {
        // 从URL中提取哈希值
        const url = new URL(button.href);
        const pathParts = url.pathname.split('/');
        const hash = pathParts[pathParts.length - 1].split('?')[0];

        if (hash && hash.length === 40) {
            // 构建真正的磁力链接
            // 修改按钮行为和外观
            button.href = `magnet:?xt=urn:btih:${hash}`;
            button.setAttribute('title', '直接打开磁力链接');
            button.removeAttribute('target'); // 移除新标签页打开

            // 添加新标签，表明这是直接链接
            const badge = document.createElement('span');
            badge.textContent = '直接';
            badge.style.cssText = `
                background-color: #ff5722;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                margin-left: 5px;
                vertical-align: middle;
            `;

            // 在按钮图片后面插入标记
            const img = button.querySelector('img');
            button.insertBefore(badge, img?.nextSibling || null);
        }
    });

    // 寻找所有种子下载按钮
    const torrentButtons = document.querySelectorAll('a.btn-success[href*="downloadtorrentfile.com/hash/"]');

    torrentButtons.forEach(button => {
        // 从URL中提取哈希值
        const url = new URL(button.href);
        const pathParts = url.pathname.split('/');
        const hash = pathParts[pathParts.length - 1].split('?')[0];

        if (hash && hash.length === 40) {
            // 修改按钮为直接下载种子文件
            button.setAttribute('title', '直接下载种子文件');
            button.removeAttribute('target'); // 移除新标签页打开

            // 添加新标签，表明这是直接下载
            const badge = document.createElement('span');
            badge.textContent = '直接';
            badge.style.cssText = `
                background-color: #28a745;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                margin-left: 5px;
                vertical-align: middle;
            `;

            // 在按钮图片后面插入标记
            const img = button.querySelector('img');
            button.insertBefore(badge, img?.nextSibling || null);

            // 添加点击事件监听器
            button.addEventListener('click', function (e) {
                e.preventDefault(); // 阻止默认导航行为

                // 保存原始按钮状态
                const originalText = button.innerHTML;
                const originalWidth = button.offsetWidth;
                button.style.width = `${originalWidth}px`; // 保持按钮宽度不变
                button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 下载中...';
                button.disabled = true;

                // 尝试从多个源下载种子文件
                downloadTorrentFile(hash, [
                    `https://itorrents.org/torrent/${hash.toUpperCase()}.torrent`,
                    `https://btcache.me/torrent/${hash}`,
                    `https://thetorrent.org/${hash}.torrent`
                ], 0, button, originalText);
            });
        }
    });

    // 通过多个来源尝试下载种子文件的函数
    function downloadTorrentFile(hash, urls, index, button, originalText) {
        if (index >= urls.length) {
            // 所有来源都尝试过了，恢复按钮状态并显示错误
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.width = '';

            // 显示错误消息
            showToast('无法下载种子文件，请尝试使用磁力链接', 'danger');
            return;
        }

        // 当前尝试的URL
        const url = urls[index];

        try {
            // 使用GM_xmlhttpRequest获取种子文件
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                timeout: 10000, // 10秒超时
                onload: function (response) {
                    if (response.status === 200) {
                        // 检查响应是否是torrent文件（简单检查）
                        const contentType = response.responseHeaders.match(/content-type:\s*(.*?)(\s|;|$)/i);
                        const isTorrent = contentType && (
                            contentType[1].includes('application/x-bittorrent') ||
                            contentType[1].includes('application/octet-stream')
                        );

                        // 还可以检查文件大小，极小的文件可能是错误页面
                        const hasContent = response.response && response.response.size > 50; // 至少50字节

                        if (isTorrent && hasContent) {
                            // 创建Blob并下载
                            const blob = new Blob([response.response], {
                                type: 'application/x-bittorrent'
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${hash.toLowerCase()}.torrent`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);

                            // 恢复按钮状态
                            button.innerHTML = originalText;
                            button.disabled = false;
                            button.style.width = '';

                            // 显示成功消息
                            showToast('种子文件下载成功！', 'success');
                        } else {
                            // 不是有效的torrent文件，尝试下一个URL
                            downloadTorrentFile(hash, urls, index + 1, button, originalText);
                        }
                    } else {
                        // HTTP错误，尝试下一个URL
                        downloadTorrentFile(hash, urls, index + 1, button, originalText);
                    }
                },
                onerror: function () {
                    // 请求错误，尝试下一个URL
                    console.error(`从 ${url} 下载种子时出错`);
                    downloadTorrentFile(hash, urls, index + 1, button, originalText);
                },
                ontimeout: function () {
                    // 请求超时，尝试下一个URL
                    console.error(`从 ${url} 下载种子超时`);
                    downloadTorrentFile(hash, urls, index + 1, button, originalText);
                }
            });
        } catch (error) {
            // 发生异常，尝试下一个URL
            console.error('下载种子文件时出错:', error);
            downloadTorrentFile(hash, urls, index + 1, button, originalText);
        }
    }

    // 显示通知消息
    function showToast(message, type = 'success') {
        // 创建通知元素
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        // 添加特殊标识符，避免被广告拦截功能删除
        toast.setAttribute('data-bt4g-notification', 'true');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            font-size: 14px;
            transition: opacity 0.3s ease-in-out;
            opacity: 0;
          `;

        // 添加到页面
        document.body.appendChild(toast);

        // 显示通知
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        // 3秒后隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                // 确保元素仍然存在再移除
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
})();

(function () {
    'use strict';

    // 等待DOM完全加载
    window.addEventListener('load', () => {
        // 检查是否在搜索页面
        const searchForm = document.querySelector('form[action="/search"]');
        if (!searchForm) return;

        // 获取搜索输入框
        const searchInput = document.getElementById('search');
        if (!searchInput) return;

        // 检查页面上是否已经存在高级搜索选项容器
        if (document.querySelector('.advanced-search')) {
            console.log('高级搜索选项已存在，跳过创建');
            return;
        }

        // 使用一个全局标识符确保只初始化一次
        if (window.bt4gAdvancedSearchInitialized) return;
        window.bt4gAdvancedSearchInitialized = true;

        // 定义关键字映射表，用于表示各种格式的常见变体
        const keywordMaps = {
            resolution: {
                '720p': ['720p', '720P', 'HD'],
                '1080p': ['1080p', '1080P', 'HD1080P', 'FHD', 'FullHD', '1920x1080'],
                '4K/UHD': ['2160p', '2160P', '4K', '4k', 'UHD', 'UltraHD', '3840x2160', '4096x2160']
            },
            hdr: {
                'HDR': ['HDR'],
                'HDR10': ['HDR10'],
                'HDR10+': ['HDR10+', 'HDR10Plus'],
                'Dolby Vision': ['DV', 'DoVi', 'DolbyVision']
            },
            codec: {
                'H264/AVC': ['H264', '264', 'AVC', 'h264', 'MPEG4AVC', 'x264'],
                'H265/HEVC': ['H265', '265', 'HEVC', 'x265', 'h265'],
                'AV1': ['AV1'],
                'VP9': ['VP9']
            },
            mediaType: {
                'BD': ['BD', 'BLURAY', "BLU", "RAY", 'BDMV', 'BDREMUX', 'REMUX'],
                'WEB-DL': ['WEBDL'],
                'WEB': ['WEB', 'WEBRIP', 'WEBRip'],
                'HDTV': ['HDTV', 'TV'],
                'DVD': ['DVD', 'DVDRIP']
            },
            audio: {
                '杜比': ['Dolby', 'DD', 'DD+', 'DDP', 'DolbyDigital', 'DDP5 1'],
                '杜比全景声': ['Atmos', 'DolbyAtmos'],
                'DTS': ['DTS', 'DTSHD', 'DTSHDMA', 'DTSX'],
                'TrueHD': ['TrueHD', 'TRUEHD', 'TrueHD7']
            }
        };

        // 检测当前主题模式
        const isDarkMode = document.body.classList.contains('dark-mode') ||
            document.documentElement.classList.contains('dark') ||
            document.documentElement.getAttribute('data-bs-theme') === 'dark';

        // 获取URL参数
        const urlParams = new URLSearchParams(window.location.search);

        // 创建高级搜索选项容器，直接放在搜索框下方
        const advancedSearchDiv = document.createElement('div');
        advancedSearchDiv.className = 'advanced-search mb-3 mt-2';
        advancedSearchDiv.setAttribute('data-initialized', 'true');

        // 应用固定样式而非弹出样式
        updateFixedAdvancedSearchStyle(advancedSearchDiv, isDarkMode);

        // 添加到搜索表单之后（不是内部）
        searchForm.parentNode.insertBefore(advancedSearchDiv, searchForm.nextSibling);

        // 创建分辨率选项行
        const resolutionRow = createOptionRow('resolution', '分辨率：', [
            {value: '', label: '任意'},
            {value: '720p', label: '720p/HD'},
            {value: '1080p', label: '1080p/Full HD'},
            {value: '4K/UHD', label: '4K/UHD/2160p'}
        ], isDarkMode);
        advancedSearchDiv.appendChild(resolutionRow);

        // 创建HDR选项行
        const hdrRow = createOptionRow('hdr', 'HDR：', [
            {value: '', label: '任意'},
            {value: 'HDR', label: 'HDR'},
            {value: 'HDR10', label: 'HDR10'},
            {value: 'HDR10+', label: 'HDR10+'},
            {value: 'Dolby Vision', label: 'Dolby Vision/DV'}
        ], isDarkMode);
        advancedSearchDiv.appendChild(hdrRow);

        // 创建编码选项行
        const codecRow = createOptionRow('codec', '编码：', [
            {value: '', label: '任意'},
            {value: 'H264/AVC', label: 'H.264/AVC/x264'},
            {value: 'H265/HEVC', label: 'H.265/HEVC/x265'},
            {value: 'AV1', label: 'AV1'},
            {value: 'VP9', label: 'VP9'}
        ], isDarkMode);
        advancedSearchDiv.appendChild(codecRow);

        // 创建媒体类型选项行
        const mediaTypeRow = createOptionRow('mediaType', '媒体类型：', [
            {value: '', label: '任意'},
            {value: 'BD', label: 'BD/蓝光/REMUX'},
            {value: 'WEB-DL', label: 'WEB-DL'},
            {value: 'WEB', label: 'WEB/WEBRip'},
            {value: 'HDTV', label: 'HDTV'},
            {value: 'DVD', label: 'DVD'}
        ], isDarkMode);
        advancedSearchDiv.appendChild(mediaTypeRow);

        // 创建音频行（包含音频选项和重置按钮）
        const audioRow = document.createElement('div');
        audioRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; width: 100%;';

        // 音频选项部分
        const audioOptions = document.createElement('div');
        audioOptions.style.cssText = 'display: flex; align-items: center;';

        // 创建音频标签
        const audioLabel = document.createElement('span');
        audioLabel.textContent = '音频：';
        audioLabel.style.cssText = 'width: 80px; margin-right: 10px; white-space: nowrap; font-weight: bold;';
        if (isDarkMode) {
            audioLabel.style.color = '#e9ecef';
        } else {
            audioLabel.style.color = '#212529';
        }
        audioOptions.appendChild(audioLabel);

        // 创建音频选项组
        const audioChoices = [
            {value: '', label: '任意'},
            {value: '杜比', label: '杜比/Dolby'},
            {value: '杜比全景声', label: '杜比全景声/Atmos'},
            {value: 'DTS', label: 'DTS系列'},
            {value: 'TrueHD', label: 'TrueHD'}
        ];

        const audioGroup = document.createElement('div');
        audioGroup.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';

        // 添加各个音频选项
        audioChoices.forEach((choice, index) => {
            const id = `audio_${index}`;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'audio';
            radio.id = id;
            radio.value = choice.value;
            radio.className = 'btn-check';
            radio.checked = index === 0;

            const optionLabel = document.createElement('label');
            optionLabel.className = isDarkMode ? 'btn btn-outline-light btn-sm' : 'btn btn-outline-dark btn-sm';
            optionLabel.htmlFor = id;
            optionLabel.textContent = choice.label;

            audioGroup.appendChild(radio);
            audioGroup.appendChild(optionLabel);
        });

        audioOptions.appendChild(audioGroup);

        // 将音频选项部分添加到音频行
        audioRow.appendChild(audioOptions);

        // 创建重置按钮
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.className = isDarkMode ? 'btn btn-outline-light btn-sm' : 'btn btn-outline-dark btn-sm';
        resetButton.textContent = '重置选项';

        // 添加重置按钮的点击事件
        resetButton.addEventListener('click', resetAdvancedOptions);

        // 将重置按钮添加到音频行
        audioRow.appendChild(resetButton);

        // 将音频行添加到高级搜索容器
        advancedSearchDiv.appendChild(audioRow);

        // 设置一个隐藏字段来存储原始查询
        const originalQueryInput = document.createElement('input');
        originalQueryInput.type = 'hidden';
        originalQueryInput.id = 'originalQuery';
        searchForm.appendChild(originalQueryInput);

        // 恢复上次的搜索关键词（如果有）
        const lastSearchQuery = localStorage.getItem('bt4g_original_query') || '';
        if (lastSearchQuery && !urlParams.has('q')) {
            searchInput.value = lastSearchQuery;
        }

        // 存储高级搜索项
        const storeAdvancedSettings = () => {
            const settings = {
                resolution: document.querySelector('input[name="resolution"]:checked')?.value || '',
                hdr: document.querySelector('input[name="hdr"]:checked')?.value || '',
                codec: document.querySelector('input[name="codec"]:checked')?.value || '',
                mediaType: document.querySelector('input[name="mediaType"]:checked')?.value || '',
                audio: document.querySelector('input[name="audio"]:checked')?.value || '',
            };
            localStorage.setItem('bt4g_advanced_settings', JSON.stringify(settings));
        };

        // 恢复高级搜索项
        const restoreAdvancedSettings = () => {
            try {
                const settings = JSON.parse(localStorage.getItem('bt4g_advanced_settings')) || {};
                if (settings.resolution) setRadioValue('resolution', settings.resolution);
                if (settings.hdr) setRadioValue('hdr', settings.hdr);
                if (settings.codec) setRadioValue('codec', settings.codec);
                if (settings.mediaType) setRadioValue('mediaType', settings.mediaType);
                if (settings.audio) setRadioValue('audio', settings.audio);
            } catch (e) {
                console.error('Failed to restore advanced settings:', e);
            }
        };

        // 抽取搜索处理逻辑为独立函数
        function processSearch(e) {
            if (e) {
                e.preventDefault(); // 阻止表单默认提交
            }

            // 获取基本搜索词
            const baseQuery = searchInput.value.trim();

            // 如果搜索词为空，直接提交表单
            if (!baseQuery) {
                searchForm.submit();
                return;
            }

            // 存储原始查询
            localStorage.setItem('bt4g_original_query', baseQuery);
            originalQueryInput.value = baseQuery;

            // 获取选中的选项
            const resolution = document.querySelector('input[name="resolution"]:checked').value;
            const hdr = document.querySelector('input[name="hdr"]:checked').value;
            const codec = document.querySelector('input[name="codec"]:checked').value;
            const mediaType = document.querySelector('input[name="mediaType"]:checked').value;
            const audio = document.querySelector('input[name="audio"]:checked').value;

            // 存储高级搜索设置
            storeAdvancedSettings();

            // 构建搜索查询
            let baseQueryProcessed = baseQuery;
            let advancedConditions = [];

            // 构建高级条件数组
            if (resolution && keywordMaps.resolution[resolution]) {
                const variants = keywordMaps.resolution[resolution];
                if (variants.length > 0) {
                    advancedConditions.push(`(${variants.join('|')})`);
                }
            }

            if (hdr && keywordMaps.hdr[hdr]) {
                const variants = keywordMaps.hdr[hdr];
                if (variants.length > 0) {
                    advancedConditions.push(`(${variants.join('|')})`);
                }
            }

            if (codec && keywordMaps.codec[codec]) {
                const variants = keywordMaps.codec[codec];
                if (variants.length > 0) {
                    advancedConditions.push(`(${variants.join('|')})`);
                }
            }

            if (mediaType && keywordMaps.mediaType[mediaType]) {
                const variants = keywordMaps.mediaType[mediaType];
                if (variants.length > 0) {
                    advancedConditions.push(`(${variants.join('|')})`);
                }
            }

            if (audio && keywordMaps.audio[audio]) {
                const variants = keywordMaps.audio[audio];
                if (variants.length > 0) {
                    advancedConditions.push(`(${variants.join('|')})`);
                }
            }

            // 合并处理后的基本查询和高级条件
            let finalQuery = baseQueryProcessed;
            if (advancedConditions.length > 0) {
                finalQuery += ' ' + advancedConditions.join(' ');
            }

            // 更新搜索框的值
            searchInput.value = finalQuery;

            // 提交表单
            searchForm.submit();
        }

        // 重置高级搜索选项函数
        function resetAdvancedOptions() {
            // 重置所有单选按钮到第一个选项（"任意"）
            ['resolution', 'hdr', 'codec', 'mediaType', 'audio'].forEach(name => {
                const firstOption = document.querySelector(`input[name="${name}"][id="${name}_0"]`);
                if (firstOption) {
                    firstOption.checked = true;
                }
            });

            // 更新本地存储
            const settings = {
                resolution: '',
                hdr: '',
                codec: '',
                mediaType: '',
                audio: '',
            };
            localStorage.setItem('bt4g_advanced_settings', JSON.stringify(settings));
        }

        // 监听表单提交事件
        searchForm.addEventListener('submit', processSearch);

        // 监听搜索输入框的回车键事件
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processSearch(e);
            }
        });

        // 添加搜索结果链接的监听器
        function addResultLinkListeners() {
            // 查找所有可能是搜索结果的链接
            const resultLinks = document.querySelectorAll('a[href^="/magnet/"]');

            resultLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // 在用户点击链接时保存高级搜索设置
                    storeAdvancedSettings();
                });
            });
        }

        // 调用函数添加链接监听器
        // 使用MutationObserver来处理动态加载的内容
        const observer = new MutationObserver(() => {
            addResultLinkListeners();
        });
        observer.observe(document.body, {childList: true, subtree: true});

        // 初始化时也添加一次
        addResultLinkListeners();

        // 始终尝试恢复高级搜索设置，无论页面类型
        restoreAdvancedSettings();

        // 只在搜索结果页恢复原始查询到搜索框
        if (urlParams.has('q')) {
            const originalQuery = localStorage.getItem('bt4g_original_query');
            if (originalQuery) {
                setTimeout(() => {
                    searchInput.value = originalQuery;
                }, 100);
            }
        }

        // 监听主题切换按钮的点击事件
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // 给浏览器一点时间来切换主题
                setTimeout(() => {
                    // 重新检测主题
                    const newDarkMode = document.body.classList.contains('dark-mode') ||
                        document.documentElement.classList.contains('dark') ||
                        document.documentElement.getAttribute('data-bs-theme') === 'dark';

                    // 更新高级搜索样式
                    updateFixedAdvancedSearchStyle(advancedSearchDiv, newDarkMode);

                    // 更新标签样式
                    document.querySelectorAll('.advanced-search label').forEach(label => {
                        if (newDarkMode) {
                            label.className = label.className.replace('btn-outline-dark', 'btn-outline-light');
                        } else {
                            label.className = label.className.replace('btn-outline-light', 'btn-outline-dark');
                        }
                    });

                    // 更新标题样式
                    document.querySelectorAll('.advanced-search span').forEach(span => {
                        if (newDarkMode) {
                            span.style.color = '#e9ecef';
                        } else {
                            span.style.color = '#212529';
                        }
                    });

                    // 更新重置按钮样式
                    resetButton.className = newDarkMode ?
                        'btn btn-outline-light btn-sm' :
                        'btn btn-outline-dark btn-sm';
                }, 100);
            });
        }
    });

    // 创建选项行
    function createOptionRow(name, label, choices, isDarkMode) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px; width: 100%;';

        // 创建标签
        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        labelElement.style.cssText = 'width: 80px; margin-right: 10px; white-space: nowrap;';
        labelElement.style.fontWeight = 'bold';
        if (isDarkMode) {
            labelElement.style.color = '#e9ecef';
        } else {
            labelElement.style.color = '#212529'; // 确保亮色模式下标签文字颜色为深色
        }
        row.appendChild(labelElement);

        // 创建选项组
        const optionsGroup = document.createElement('div');
        optionsGroup.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';

        // 添加各个选项
        choices.forEach((choice, index) => {
            const id = `${name}_${index}`;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.id = id;
            radio.value = choice.value;
            radio.className = 'btn-check';
            radio.checked = index === 0; // 默认选中第一个选项

            const optionLabel = document.createElement('label');
            optionLabel.className = isDarkMode ? 'btn btn-outline-light btn-sm' : 'btn btn-outline-dark btn-sm'; // 改为outline-dark
            optionLabel.htmlFor = id;
            optionLabel.textContent = choice.label;

            optionsGroup.appendChild(radio);
            optionsGroup.appendChild(optionLabel);
        });

        row.appendChild(optionsGroup);
        return row;
    }

    // 辅助函数：设置单选按钮的值
    function setRadioValue(name, value) {
        const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
        let found = false;

        radioButtons.forEach(radio => {
            if (radio.value === value) {
                radio.checked = true;
                found = true;
            }
        });

        // 如果没有找到匹配项，选择"任意"选项
        if (!found && radioButtons.length > 0) {
            radioButtons[0].checked = true;
        }
    }

    // 更新固定式高级搜索面板的样式
    function updateFixedAdvancedSearchStyle(element, isDarkMode) {
        let backgroundColor, textColor, borderColor;

        if (isDarkMode) {
            backgroundColor = '#212529';
            textColor = '#e9ecef';
            borderColor = '#495057';
        } else {
            backgroundColor = '#f8f9fa';
            textColor = '#212529';
            borderColor = '#6c757d'; // 加深边框颜色，增加对比度
        }

        element.style.cssText = `
           display: flex;
           flex-direction: column;
           width: 100%;
           padding: 12px;
           background-color: ${backgroundColor};
           color: ${textColor};
           border: 1px solid ${borderColor};
           border-radius: 5px;
           margin-bottom: 10px;
       `;
    }
})();

// 添加处理被删除内容的直接磁链功能
(function () {
    'use strict';

    // 等待DOM完全加载
    window.addEventListener('load', () => {
        // 检查是否在资源详细页面且内容已被删除
        const paragraphs = document.querySelectorAll('div.col-12 p');
        let deletedContentP = null;

        for (const p of paragraphs) {
            if (p.textContent.includes('On request, content has been deleted')) {
                deletedContentP = p;
                break;
            }
        }

        if (!deletedContentP) {
            return; // 不是删除内容页面，直接返回
        }

        // 尝试从meta标签中获取哈希值
        const metaOgUrl = document.querySelector('meta[property="og:url"]');

        if (!metaOgUrl) {
            return; // 没有找到包含哈希的meta标签
        }

        // 从meta标签的content属性中提取哈希值
        const urlContent = metaOgUrl.getAttribute('content');
        const hashMatch = RegExp(/\/([a-fA-F0-9]{40})(?:\?|$)/).exec(urlContent);

        if (!hashMatch?.[1]) {
            return; // 没有找到有效的40位哈希值
        }

        const hash = hashMatch[1];
        const magnetLink = `magnet:?xt=urn:btih:${hash}`;

        // 检测当前主题模式
        const isDarkMode = document.body.classList.contains('dark-mode') ||
            document.documentElement.classList.contains('dark') ||
            document.documentElement.getAttribute('data-bs-theme') === 'dark';

        // 创建一个容器，用于更好的样式布局
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 20px; text-align: center;';

        // 创建说明文本
        const infoText = document.createElement('p');
        infoText.textContent = '虽然内容显示已删除，但您仍可通过以下方式获取资源：';
        infoText.style.cssText = 'margin-bottom: 10px; font-style: italic; color: ' + (isDarkMode ? '#adb5bd' : '#6c757d');
        buttonContainer.appendChild(infoText);

        // 创建打开磁力链接按钮
        const magnetButton = document.createElement('a');
        magnetButton.href = magnetLink;
        magnetButton.className = 'btn btn-success';
        magnetButton.innerHTML = '🧲 打开磁力链接';
        magnetButton.style.cssText = 'padding: 8px 15px; font-weight: bold;';
        buttonContainer.appendChild(magnetButton);

        // 创建显示磁力链接的元素（方便用户手动复制）
        const hashDisplay = document.createElement('div');
        hashDisplay.textContent = magnetLink;
        hashDisplay.style.cssText = 'margin-top: 10px; font-family: monospace; word-break: break-all; ' +
            'border: 1px solid ' + (isDarkMode ? '#495057' : '#dee2e6') + '; ' +
            'padding: 6px; border-radius: 4px; ' +
            'background-color: ' + (isDarkMode ? '#343a40' : '#f8f9fa') + '; ' +
            'color: ' + (isDarkMode ? '#adb5bd' : '#6c757d') + '; font-size: 0.9em; ' +
            'max-width: 100%; overflow-x: auto; text-align: left; cursor: pointer;';

        // 点击磁力链接文本区域时复制到剪贴板
        hashDisplay.addEventListener('click', function () {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(magnetLink).then(() => {
                    const originalText = hashDisplay.textContent;
                    hashDisplay.textContent = '✅ 已复制到剪贴板';
                    setTimeout(() => {
                        hashDisplay.textContent = originalText;
                    }, 1000);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = magnetLink;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                hashDisplay.addEventListener('click', async function () {
                    try {
                        await navigator.clipboard.writeText(magnetLink);
                        const originalText = hashDisplay.textContent;
                        hashDisplay.textContent = '✅ 已复制到剪贴板';
                        setTimeout(() => {
                            hashDisplay.textContent = originalText;
                        }, 1000);
                    } catch (err) {
                        console.error('复制失败:', err);
                    }
                });

                document.body.removeChild(textArea);
            }
        });

        buttonContainer.appendChild(hashDisplay);

        // 将按钮容器添加到内容已删除的消息所在的div中
        deletedContentP.parentNode.appendChild(buttonContainer);

        // 监听主题切换以更新元素样式
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                // 给浏览器一点时间来切换主题
                setTimeout(() => {
                    // 重新检测主题
                    const newDarkMode = document.body.classList.contains('dark-mode') ||
                        document.documentElement.classList.contains('dark') ||
                        document.documentElement.getAttribute('data-bs-theme') === 'dark';

                    // 更新文本颜色和样式
                    infoText.style.color = newDarkMode ? '#adb5bd' : '#6c757d';
                    hashDisplay.style.color = newDarkMode ? '#adb5bd' : '#6c757d';
                    hashDisplay.style.backgroundColor = newDarkMode ? '#343a40' : '#f8f9fa';
                    hashDisplay.style.borderColor = newDarkMode ? '#495057' : '#dee2e6';
                }, 100);
            });
        }
    });
})();