// ==UserScript==
// @name         DolbyAutoTools 助手
// @namespace    https://www.hddolby.com/
// @version      1.2.1
// @description  自动提取 TMDb 信息、识别编码格式和下拉选项
// @match        https://www.hddolby.com/upload.php
// @match        https://www.hddolby.com/details.php*
// @match        https://www.hddolby.com/usercp.php*
// @grant        GM_xmlhttpRequest
// @connect      taskapi.orcinusorca.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536857/DolbyAutoTools%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536857/DolbyAutoTools%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * DolbyAutoTools 助手 - 优化版
 * 功能：自动提取 TMDb 信息、识别编码格式和下拉选项
 * 版本：1.1.5
 */

(function () {
    'use strict';

    // --------------------------
    // 配置区域
    // --------------------------
    const CONFIG = {
        // 映射表配置
        maps: {
            resolution: {
                '4320p': '6', '8k': '6',
                '2160p': '1', '4k': '1',
                '1080p': '2',
                '1080i': '3',
                '720p': '4'
            },
            codec: {
                'h.265': '2', 'hevc': '2',
                'h.264': '1', 'avc': '1',
                'vvc': '13',
                'av1': '11',
                'vp9': '12',
                'avs3': '14',
                'avs+': '15',
                'avs2': '16',
                'vc-1': '5',
                'mpeg-2': '6'
            },
            audioCodec: {
                'dts-hd ma': '1',
                'dts-hd': '1',
                'truehd': '2',
                'dts-x': '15',
                'lpcm': '3',
                'dts': '4',
                'eac3': '14', 'ddp': '14', 
                'ac3': '5', 'dd': '5',
                'aac': '6',
                'opus': '13',
                'flac': '7',
                'ape': '8',
                'wav': '9',
                'mp3': '10',
                'm4a': '11',
                'av3a': '16',
                'avsa': '17',
                'mpeg': '18'
            },
            team: {
                'dream': '1',
                'dbtv': '10',
                'qhstudio': '12',
                'cornermv': '13',
                'telesto': '14',
                'mteam': '2',
                'wiki': '4',
                'frds': '7',
                'hdo': '9',
                'beast': '11',
                'chd': '5',
                'cmct': '6',
                'pthome': '3'
            },
            medium: {
                'remux': '3',
                'uhd': '1',
                'blu-ray': '2', 'bluray': '2', 'bdrip': '2',
                'encode': '10',
                'web-dl': '6', 'webrip': '7', 'webdl': '6',
                'feed': '12',
                'hdtv': '5',
                'hd dvd': '4', 'hddvd': '4',
                'dvd': '8',
                'cd': '9'
            }
        },
        // 官方制作组列表
        officialTeams: ['dream', 'dbtv', 'qhstudio', 'cornermv'],
        // 正则表达式
            regex: {
                title: /TMDb Title:\s*(.+)/,
                url: /TMDb URL:\s*(.+)/,
                audioChannels: /\b([a-z0-9]+)\s+([2-8])\s([01])(?=[^\d]|$)/ig,
                bitrate: /Video.*?(\d+\.\d+)\s*Mb\/s/i,
                teamMatch: /-([^\s-]+)$/,
                mediaInfo: /Mediainfo:\s*([\s\S]*?)(?:\n\s*[Ss]creenshot:|$)/i,
                screenshots: /Screenshot:\s*([\s\S]*?)Screenshot_Finish/i,
                allToRemove: /MediaInfo:[\s\S]*?Screenshot_Finish\s*/i
            },
        // 类别关键词
        categoryKeywords: {
            documentary: ['纪录'],
            animation: ['动画'],
            realityShow: ['真人秀'],
            tvSeries: ['剧情', '喜剧', 'Sci-Fi & Fantasy', '犯罪']
        },
        // 配置键名
        configKey: 'dolbyAutoToolsConfig',
        // 默认配置
        defaultConfig: {
            autoCheckOfficial: true,
            highBitrateThreshold: 10
        }
    };

    // --------------------------
    // DOM 元素缓存
    // --------------------------
    const DOM = {
        get descrBox() { return document.querySelector('#descr'); },
        get nameInput() { return document.querySelector('#name'); },
        get smallDescr() { return document.querySelector('input[name="small_descr"]'); },
        get tmdbUrl() { return document.querySelector('input[name="tmdb_url"]'); },
        get officialCheckbox() { return document.querySelector('input[name="officialteam"]'); },
        get tagGfCheckbox() { return document.querySelector('input#tag_gf[name="tags[]"][value="gf"]'); },
        get tagWjCheckbox() { return document.querySelector('input#tag_wj[name="tags[]"][value="wj"]'); },
        get tagHdrmCheckbox() { return document.querySelector('input#tag_hdrm[name="tags[]"][value="hdrm"]'); },
        get tagHdr10Checkbox() { return document.querySelector('input#tag_hdr10[name="tags[]"][value="hdr10"]'); },
        get tagZzCheckbox() { return document.querySelector('input#tag_zz[name="tags[]"][value="zz"]'); },
        get tagKoCheckbox() { return document.querySelector('input#tag_ko[name="tags[]"][value="ko"]'); },
        get tagJaCheckbox() { return document.querySelector('input#tag_ja[name="tags[]"][value="ja"]'); },
        get tagHqCheckbox() { return document.querySelector('input#tag_hq[name="tags[]"][value="hq"]'); },
        get typeSelect() { return document.querySelector('select[name="type"]#browsecat'); },
        get mediaInfoTextarea() { return document.querySelector('textarea[name="media_info"]'); },
        get screenshotsTextarea() { return document.querySelector('textarea[name="screenshots"]'); }
    };

    // --------------------------
    // 工具函数
    // --------------------------
    /**
     * 获取用户配置
     * @returns {Object} 用户配置对象
     */
    function getUserConfig() {
        try {
            const config = JSON.parse(localStorage.getItem(CONFIG.configKey) || '{}');
            return { ...CONFIG.defaultConfig, ...config };
        } catch (error) {
            console.error('获取用户配置失败:', error);
            return { ...CONFIG.defaultConfig };
        }
    }

    /**
     * 设置复选框状态
     * @param {HTMLElement|null} checkbox - 复选框元素
     * @param {boolean} checked - 是否勾选
     */
    function setCheckboxState(checkbox, checked) {
        if (checkbox) {
            checkbox.checked = checked;
        }
    }

    /**
     * 根据映射表选择下拉菜单选项
     * @param {Object} map - 映射表
     * @param {string} selectName - 下拉菜单名称
     * @param {string} [nameOverride] - 覆盖使用的名称
     */
    function selectByMap(map, selectName, nameOverride) {
        const name = nameOverride || DOM.nameInput?.value?.toLowerCase() || '';
        const select = document.querySelector(`select[name="${selectName}"]`);
        if (!select) return;

        // 针对 team_sel，只识别最后一个'-'后面的内容
        if (selectName === 'team_sel') {
            const teamMatch = name.match(CONFIG.regex.teamMatch);
            if (teamMatch) {
                const teamKey = teamMatch[1];
                for (const [key, value] of Object.entries(map)) {
                    if (teamKey.includes(key)) {
                        select.value = value;
                        break;
                    }
                }
                return;
            }
        }

        // 其他情况逻辑
        for (const [key, value] of Object.entries(map)) {
            if (name.includes(key)) {
                select.value = value;
                break;
            }
        }
    }

    /**
     * 显示通知
     * @param {string} message - 消息内容
     * @param {string} [type='success'] - 消息类型 ('success', 'error', 'info')
     */
    function showNotification(message, type = 'success') {
        // 移除已有的通知
        document.querySelectorAll('.dolby-notification').forEach(elem => elem.remove());

        const notification = document.createElement('div');
        notification.className = `dolby-notification ${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.transition = 'opacity 0.3s ease';

        // 设置背景色
        if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#3498db';
        } else {
            notification.style.backgroundColor = '#2ecc71';
        }

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // --------------------------
    // 核心功能
    // --------------------------
    /**
     * 处理标签勾选
     * @param {string} name - 文件名
     * @param {string} descrText - 描述文本
     * @param {Object} config - 用户配置
     */
    function processTags(name, descrText, config) {
        const lowerName = name.toLowerCase();
        const lowerDescr = descrText.toLowerCase();

        // 官方制作组自动勾选
        if (config.autoCheckOfficial) {
            const isOfficial = CONFIG.officialTeams.some(team => lowerName.includes(team));
            setCheckboxState(DOM.officialCheckbox, isOfficial);
            setCheckboxState(DOM.tagGfCheckbox, isOfficial);
        }

        // 勾选 tag_wj 如果 name 包含 complete
        setCheckboxState(DOM.tagWjCheckbox, lowerName.includes('complete'));

        // 勾选 HDR 相关标签
        let hdr10PlusChecked = false;
        if (DOM.tagHdrmCheckbox) {
            // 检查文件名中的HDR10+标记
            hdr10PlusChecked = lowerName.includes('hdr10+') || 
                              lowerName.includes('hdr10p');
            
            // 如果文件名中没有，使用多行处理检查MediaInfo中的transfer characteristics和其他HDR10+相关信息
            if (!hdr10PlusChecked) {
                const lines = lowerDescr.split(/[\n\r]+/);
                for (let i = 0; i < lines.length; i++) {
                    // 检查HDR格式相关行
                    if (lines[i].includes('transfer characteristics') || 
                        lines[i].includes('hdr format') || 
                        lines[i].includes('hdr_format_compatibility')) {
                        // 检查该特性行后面几行是否包含HDR10+相关标记
                        for (let j = 0; j <= 10 && i + j < lines.length; j++) {
                            if (lines[i+j].includes('st.2094-10') || 
                                lines[i+j].includes('st.2094-40') || 
                                lines[i+j].includes('smpte st 2094 app 4') ||
                                lines[i+j].includes('hdr10+')) {
                                hdr10PlusChecked = true;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            
            setCheckboxState(DOM.tagHdrmCheckbox, hdr10PlusChecked);
        }

        if (DOM.tagHdr10Checkbox && !hdr10PlusChecked) {
            // 检查文件名中的HDR标记
            let hasHDR = lowerName.includes('hdr');
            
            // 如果文件名中没有，使用多行处理检查MediaInfo中的transfer characteristics
            if (!hasHDR) {
                const lines = lowerDescr.split(/[\n\r]+/);
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('transfer characteristics')) {
                        // 检查该特性行后面几行是否包含HDR相关标记
                        for (let j = 0; j <= 5 && i + j < lines.length; j++) {
                            if (lines[i+j].includes('st.2084') || lines[i+j].includes('smpte 2084')) {
                                hasHDR = true;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            
            setCheckboxState(DOM.tagHdr10Checkbox, hasHDR);
        }

        // 勾选 tag_zz 如果简介里字幕含有 zh
        if (DOM.tagZzCheckbox) {
            // 检查标准字幕标记或MediaInfo中的Text流
            // 使用更可靠的分割方式
            const lines = lowerDescr.split(/[\n\r]+/);
            
            // 改进的匹配逻辑：处理多行的MediaInfo信息
            let hasZhSubtitle = false;
            
            // 标准字幕标记检查
            hasZhSubtitle = lines.some(line => {
                return (line.includes('subtitles') || line.includes('字幕')) && 
                       (line.includes('zh') || line.includes('cmn'));
            });
            
            // 如果标准检查未通过，检查MediaInfo Text流（多行处理）
            if (!hasZhSubtitle) {
                // 查找所有Text流起始行
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('text #')) {
                        // 检查该Text流后面的几行是否包含中文语言信息
                        for (let j = 1; j <= 10 && i + j < lines.length; j++) {
                            if ((lines[i+j].includes('language') || lines[i+j].includes('语言')) &&
                                (lines[i+j].includes('cmn') || lines[i+j].includes('chi'))) {
                                hasZhSubtitle = true;
                                break;
                            }
                            // 如果遇到下一个流类型，停止检查
                            if (lines[i+j].includes('video') || lines[i+j].includes('audio') || 
                                lines[i+j].includes('general') || lines[i+j].includes('text #')) {
                                break;
                            }
                        }
                        if (hasZhSubtitle) break;
                    }
                }
            }
            
            setCheckboxState(DOM.tagZzCheckbox, hasZhSubtitle);
        }

        // 勾选语言相关标签
        if (DOM.tagKoCheckbox || DOM.tagJaCheckbox) {
            // 使用更可靠的分割方式
            const lines = lowerDescr.split(/[\n\r]+/);

            if (DOM.tagKoCheckbox) {
                // 检查标准音频标记
                let hasKoAudio = lines.some(line => {
                    return (line.startsWith('audio') || line.includes('音频')) && line.includes('ko');
                });
                
                // 如果标准检查未通过，使用更改进的多行处理检查MediaInfo中的Audio流
                if (!hasKoAudio) {
                    let inAudioSection = false;
                    
                    for (const line of lines) {
                        // 检测是否进入音频部分（支持有#号和无#号的Audio流）
                        if (line.trim().startsWith('audio')) {
                            inAudioSection = true;
                        }
                        // 如果在音频部分并且找到了语言代码
                        if (inAudioSection && ((line.includes('language') || line.includes('语言')) && line.includes('ko'))) {
                            hasKoAudio = true;
                            break;
                        }
                        // 检测是否离开音频部分
                        if (inAudioSection && line.trim() && !line.startsWith(' ') && !line.startsWith('audio')) {
                            inAudioSection = false;
                        }
                    }
                }
                
                setCheckboxState(DOM.tagKoCheckbox, hasKoAudio);
            }

            if (DOM.tagJaCheckbox) {
                // 检查标准音频标记
                let hasJaAudio = lines.some(line => {
                    return (line.startsWith('audio') || line.includes('音频')) && line.includes('ja');
                });
                
                // 如果标准检查未通过，使用更改进的多行处理检查MediaInfo中的Audio流
                if (!hasJaAudio) {
                    let inAudioSection = false;
                    
                    for (const line of lines) {
                        // 检测是否进入音频部分（支持有#号和无#号的Audio流）
                        if (line.trim().startsWith('audio')) {
                            inAudioSection = true;
                        }
                        // 如果在音频部分并且找到了语言代码
                        if (inAudioSection && ((line.includes('language') || line.includes('语言')) && line.includes('ja'))) {
                            hasJaAudio = true;
                            break;
                        }
                        // 检测是否离开音频部分
                        if (inAudioSection && line.trim() && !line.startsWith(' ') && !line.startsWith('audio')) {
                            inAudioSection = false;
                        }
                    }
                }
                
                setCheckboxState(DOM.tagJaCheckbox, hasJaAudio);
            }
        }

        // 检测视频码率并勾选高码率标签
        if (DOM.tagHqCheckbox) {
            let hasHighBitrate = false;
            // 使用多行处理检查MediaInfo中的码率信息
            const lines = lowerDescr.split(/[\n\r]+/);
            const bitrateRegex = /bit rate\s*:\s*(\d+(?:\.\d+)?)\s*(?:mb\/s|kb\/s)/;
            
            for (let i = 0; i < lines.length; i++) {
                // 检查是否为视频流相关的码率信息
                if ((lines[i].includes('video') || lines[i].includes('video #')) && i < lines.length - 10) {
                    // 检查视频流后面的10行内是否有码率信息
                    for (let j = 0; j <= 10 && i + j < lines.length; j++) {
                        const bitrateMatch = lines[i+j].match(bitrateRegex);
                        if (bitrateMatch && !isNaN(bitrateMatch[1])) {
                            const bitrateValue = parseFloat(bitrateMatch[1]);
                            // 检查单位是Mb/s还是Kb/s
                            const isKbps = bitrateMatch[0].includes('kb/s');
                            const bitrate = isKbps ? bitrateValue / 1000 : bitrateValue;
                            if (bitrate > config.highBitrateThreshold) {
                                hasHighBitrate = true;
                                break;
                            }
                        }
                    }
                    if (hasHighBitrate) break;
                }
            }
            
            // 如果在视频流中没有找到，尝试在整个文本中查找
            if (!hasHighBitrate) {
                const bitrateMatch = lowerDescr.match(bitrateRegex);
                if (bitrateMatch && !isNaN(bitrateMatch[1])) {
                    const bitrateValue = parseFloat(bitrateMatch[1]);
                    const isKbps = bitrateMatch[0].includes('kb/s');
                    const bitrate = isKbps ? bitrateValue / 1000 : bitrateValue;
                    hasHighBitrate = bitrate > config.highBitrateThreshold;
                }
                // 如果MediaInfo中没有找到，回退到原始方法
                else if (descrText.match(CONFIG.regex.bitrate)) {
                    const bitrateMatchOriginal = descrText.match(CONFIG.regex.bitrate);
                    if (bitrateMatchOriginal && !isNaN(bitrateMatchOriginal[1])) {
                        const bitrate = parseFloat(bitrateMatchOriginal[1]);
                        hasHighBitrate = bitrate > config.highBitrateThreshold;
                    }
                }
            }
            setCheckboxState(DOM.tagHqCheckbox, hasHighBitrate);
        }
    }

    /**
     * 选择媒体类型
     * @param {string} descrText - 描述文本
     * @param {string} tmdbUrl - TMDb URL
     */
    function selectMediaType(descrText, tmdbUrl) {
        if (!DOM.typeSelect) return;

        // 收集所有类别行 - 使用更可靠的分割方式
        const categoryLines = descrText.split(/[\n\r]+/).filter(line =>
            line.includes('◎类　　别') || line.includes('类别')
        ).join(' ');

        // 统一小写处理
        const categoryText = categoryLines.toLowerCase();

        // 优先级顺序：纪录片 > 动画 > 剧情+tv > 真人秀 > 电影
        if (CONFIG.categoryKeywords.documentary.some(keyword => categoryText.includes(keyword))) {
            DOM.typeSelect.value = "404";
        } else if (CONFIG.categoryKeywords.animation.some(keyword => categoryText.includes(keyword))) {
            DOM.typeSelect.value = "405";
        } else if (CONFIG.categoryKeywords.realityShow.some(keyword => categoryText.includes(keyword))) {
            DOM.typeSelect.value = "403";
        } else {
            const isTVSeries = CONFIG.categoryKeywords.tvSeries.some(keyword => categoryText.includes(keyword));
            if (isTVSeries && /\/tv\//.test(tmdbUrl)) {
                DOM.typeSelect.value = "402";
            } else {
                // 不包含 真人秀/纪录/动画 且 tmdbUrl 含 /movie/
                const excludeKeywords = [...CONFIG.categoryKeywords.documentary, ...CONFIG.categoryKeywords.animation, ...CONFIG.categoryKeywords.realityShow];
                const hasExclude = excludeKeywords.some(keyword => categoryText.includes(keyword));
                if (!hasExclude && /\/movie\//.test(tmdbUrl)) {
                    DOM.typeSelect.value = "401";
                }
            }
        }
    }

    /**
     * 处理点击事件
     */
    function handleClick() {
        try {
            if (!DOM.descrBox) {
                showNotification('未找到描述框元素', 'error');
                return;
            }

            const config = getUserConfig();
            let text = DOM.descrBox.value.trimStart();

            // 提取 TMDb 信息
            const titleMatch = text.match(CONFIG.regex.title);
            const urlMatch = text.match(CONFIG.regex.url);
            const tmdbUrlValue = urlMatch ? urlMatch[1].trim() : '';

            if (titleMatch) {
                const title = titleMatch[1].trim();
                if (DOM.smallDescr) DOM.smallDescr.value = title;
            }

            if (DOM.tmdbUrl) {
                DOM.tmdbUrl.value = tmdbUrlValue;
            }

            // 先保存原始文本用于提取
            const originalText = text;
            // 优先按“UUID: xxx”格式提取草稿ID
            const uuidLineRegex = /UUID:\s*([0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})/i;
            const uuidLineMatch = originalText.match(uuidLineRegex);
            if (uuidLineMatch) {
                localStorage.setItem('dolbyDraftUUID', uuidLineMatch[1]);
            } else {
                // 回退到纯UUID匹配
                const uuidMatch = originalText.match(/[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/);
                if (uuidMatch) {
                    localStorage.setItem('dolbyDraftUUID', uuidMatch[0]);
                }
            }
            
            // 提取 MediaInfo 内容
            const mediaInfoMatch = originalText.match(CONFIG.regex.mediaInfo);
            const mediaInfoContent = mediaInfoMatch ? mediaInfoMatch[1].trim() : '';
            
            // 提取 Screenshot 内容并填写到 textarea
            const screenshotsMatch = originalText.match(CONFIG.regex.screenshots);
            if (screenshotsMatch && DOM.screenshotsTextarea) {
                const screenshotContent = screenshotsMatch[1].trim();
                DOM.screenshotsTextarea.value = screenshotContent;
            }

            // 清理描述文本
            text = text.replace(/[\s\S]*TMDb Format:.*\n?/i, '').trimStart();
            
            // 删除描述中的 UUID 行（格式：UUID: xxxxx）
            text = text.replace(/^\s*UUID:\s*[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}\s*$/img, '').trimStart();
            
            // 使用组合正则表达式一次性删除MediaInfo和Screenshot部分（包括Screenshot_Finish标记）
            if (CONFIG.regex.allToRemove) {
                text = text.replace(CONFIG.regex.allToRemove, '').trimStart();
            } else {
                if (mediaInfoMatch) {
                    text = text.replace(CONFIG.regex.mediaInfo, '').trimStart();
                }
                if (screenshotsMatch) {
                    text = text.replace(CONFIG.regex.screenshots, '').trimStart();
                }
            }
            DOM.descrBox.value = text;

            // 自动识别选项
            selectByMap(CONFIG.maps.resolution, 'standard_sel');
            selectByMap(CONFIG.maps.codec, 'codec_sel');
            selectByMap(CONFIG.maps.audioCodec, 'audiocodec_sel');
            selectByMap(CONFIG.maps.team, 'team_sel');
            selectByMap(CONFIG.maps.medium, 'medium_sel');

            // 处理音频声道格式
            if (DOM.nameInput && DOM.nameInput.value) {
                DOM.nameInput.value = DOM.nameInput.value.replace(
                    CONFIG.regex.audioChannels,
                    (match, codec, ch1, ch2) => `${codec} ${ch1}.${ch2}`
                );
            }

            // 处理标签勾选 - 使用原始文本和MediaInfo内容
            const name = DOM.nameInput?.value || '';
            // 先创建一个包含原始文本和MediaInfo的组合文本用于标签匹配
            const combinedText = text + '\n' + mediaInfoContent;
            processTags(name, combinedText, config);
            
            // 最后将MediaInfo内容填写到textarea
            if (mediaInfoContent && DOM.mediaInfoTextarea) {
                DOM.mediaInfoTextarea.value = mediaInfoContent;
            }

            // 选择媒体类型
            selectMediaType(text, tmdbUrlValue);

            showNotification('处理完成！');
        } catch (error) {
            console.error('DolbyAutoTools 错误:', error);
            showNotification('处理失败: ' + error.message, 'error');
        }
    }

    /**
     * 创建按钮
     */
    function createButton() {
        if (!DOM.descrBox) {
            console.warn('未找到描述框元素，无法创建按钮');
            return;
        }

        const row = DOM.descrBox.closest('td');
        if (!row) return;

        // 检查是否已存在按钮
        if (document.querySelector('.dolby-auto-tools-button')) return;

        const button = document.createElement('button');
        button.className = 'dolby-auto-tools-button';
        button.textContent = '处理信息';
        button.type = 'button';
        button.style.margin = '5px 0';
        button.style.padding = '4px 10px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', handleClick);
        row.appendChild(button);

        // Api-Token 输入与保存
        const tokenContainer = document.createElement('div');
        tokenContainer.style.marginTop = '6px';
        tokenContainer.style.display = 'flex';
        tokenContainer.style.gap = '6px';
        tokenContainer.style.alignItems = 'center';
    
        const tokenLabel = document.createElement('span');
        tokenLabel.textContent = 'Api-Token';
        tokenLabel.style.fontSize = '12px';
    
        const tokenInput = document.createElement('input');
        tokenInput.type = 'password';
        tokenInput.placeholder = '输入 API Token';
        tokenInput.value = localStorage.getItem('dolbyApiToken') || '';
        tokenInput.style.flex = '1';
        tokenInput.style.padding = '3px 6px';
    
        const saveTokenBtn = document.createElement('button');
        saveTokenBtn.type = 'button';
        saveTokenBtn.textContent = '保存 Token';
        saveTokenBtn.style.padding = '4px 6px';
        saveTokenBtn.addEventListener('click', () => {
            const token = tokenInput.value.trim();
            localStorage.setItem('dolbyApiToken', token);
            showNotification(token ? 'Api-Token 已保存' : 'Api-Token 已清空');
        });
    
        tokenContainer.appendChild(tokenLabel);
        tokenContainer.appendChild(tokenInput);
        tokenContainer.appendChild(saveTokenBtn);
        row.appendChild(tokenContainer);
    
        // API 地址输入与保存
        const apiContainer = document.createElement('div');
        apiContainer.style.marginTop = '6px';
        apiContainer.style.display = 'flex';
        apiContainer.style.gap = '6px';
        apiContainer.style.alignItems = 'center';
    
        const apiLabel = document.createElement('span');
        apiLabel.textContent = 'API 地址';
        apiLabel.style.fontSize = '12px';
    
        const apiInput = document.createElement('input');
        apiInput.type = 'text';
        apiInput.placeholder = 'http://localhost:8080/api/media/release';
        apiInput.value = localStorage.getItem('dolbyApiBaseUrl') || 'http://localhost:8080/api/media/release';
        apiInput.style.flex = '1';
        apiInput.style.padding = '3px 6px';
    
        const saveApiBtn = document.createElement('button');
        saveApiBtn.type = 'button';
        saveApiBtn.textContent = '保存地址';
        saveApiBtn.style.padding = '4px 6px';
        saveApiBtn.addEventListener('click', () => {
            const base = apiInput.value.trim();
            localStorage.setItem('dolbyApiBaseUrl', base);
            showNotification(base ? 'API 地址已保存' : 'API 地址已清空');
        });
    
        apiContainer.appendChild(apiLabel);
        apiContainer.appendChild(apiInput);
        apiContainer.appendChild(saveApiBtn);
        row.appendChild(apiContainer);
    }

    function initDetailsAutoPublish() {
        try {
            if (!location.pathname.includes('/details.php')) return;
            const params = new URLSearchParams(window.location.search);
            const uploaded = params.get('uploaded');
            const torrentId = params.get('id');
    
            if (uploaded === '1' && torrentId) {
                const apiToken = getStoredApiToken();
                const draftId = getStoredDraftUUID();
                if (!apiToken) {
                    showNotification('未配置 Api-Token，无法自动发布','error');
                    return;
                }
                if (!draftId) {
                    showNotification('未记下草稿 UUID，无法自动发布','error');
                    return;
                }
                publishMediaRelease(draftId, torrentId, apiToken);
            }
        } catch (e) {
            console.error('详情页自动发布错误:', e);
        }
    }

    // 使用延迟执行避免阻塞页面加载
    window.addEventListener('load', () => {
        setTimeout(createButton, 100);
        // 详情页自动发布
        setTimeout(initDetailsAutoPublish, 100);
        setTimeout(initBindSettings, 100);
    });

    // 添加键盘快捷键支持 (Alt+D)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            const button = document.querySelector('.dolby-auto-tools-button');
            if (button) button.click();
        }
    });
})();


// 发布 API 调用与详情页自动发布
// --------------------------
function getStoredApiToken() {
    return localStorage.getItem('dolbyApiToken') || '';
}

function getStoredDraftUUID() {
    return localStorage.getItem('dolbyDraftUUID') || '';
}

function getStoredApiBase() {
    return localStorage.getItem('dolbyApiBaseUrl') || 'http://163.61.31.171:8080/api/media/release';
}

function publishMediaRelease(draftId, torrentId, apiToken) {
    const base = (getStoredApiBase() || '').replace(/\/+$/, '');
    const url = `${base}/${encodeURIComponent(draftId)}/publish`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Api-Token ${apiToken}`
    };
    const payload = { torrentId: Number(torrentId) };

    if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
            method: 'PATCH',
            url,
            headers,
            data: JSON.stringify(payload),
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    showNotification('媒体发布成功！');
                } else {
                    showNotification(`发布失败：HTTP ${response.status}`,'error');
                }
            },
            onerror: function (error) {
                showNotification('发布失败：网络错误','error');
                console.error('发布 API 错误:', error);
            }
        });
    } else {
        fetch(url, { method: 'PATCH', headers, body: JSON.stringify(payload) })
            .then(res => {
                if (res.ok) {
                    showNotification('媒体发布成功！');
                } else {
                    return res.text().then(t => { throw new Error(`HTTP ${res.status}: ${t}`); });
                }
            })
            .catch(err => {
                showNotification('发布失败：' + err.message,'error');
                console.error('发布 API 错误:', err);
            });
    }
}

function initBindSettings() {
    try {
        const u = new URL(location.href);
        if (u.hostname !== 'www.hddolby.com') return;
        if (u.pathname !== '/usercp.php') return;
        if (u.searchParams.get('action') !== 'bind') return;
        renderBindApiSettings();
    } catch (_) {}
}

function renderBindApiSettings() {
    const outer = document.querySelector('#outer') || document.body;
    const wrap = document.createElement('table');
    wrap.className = 'main';
    wrap.style.width = '940px';
    wrap.cellPadding = '5';
    wrap.cellSpacing = '0';
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.className = 'embedded';
    const box = document.createElement('div');
    box.className = 'outer';
    box.style.padding = '14px';
    box.style.margin = '10px auto';
    box.style.borderRadius = '0px';
    const title = document.createElement('h2');
    title.className = 'text';
    title.style.fontSize = '14px';
    title.textContent = 'DolbyAutoTools API 设置';
    const formTable = document.createElement('table');
    formTable.className = 'main';
    formTable.style.width = '100%';
    formTable.cellPadding = '5';
    formTable.cellSpacing = '0';

    const row1 = document.createElement('tr');
    const r1c1 = document.createElement('td');
    r1c1.className = 'text';
    r1c1.style.width = '120px';
    r1c1.style.textAlign = 'right';
    r1c1.textContent = 'API 地址';
    const r1c2 = document.createElement('td');
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.style.width = '95%';
    urlInput.value = localStorage.getItem('dolbyApiBaseUrl') || 'http://163.61.31.171:8080/api/media/release';
    r1c2.appendChild(urlInput);
    row1.appendChild(r1c1);
    row1.appendChild(r1c2);

    const row2 = document.createElement('tr');
    const r2c1 = document.createElement('td');
    r2c1.className = 'text';
    r2c1.style.textAlign = 'right';
    r2c1.textContent = 'Api-Token';
    const r2c2 = document.createElement('td');
    const tokenInput = document.createElement('input');
    tokenInput.type = 'password';
    tokenInput.style.width = '95%';
    tokenInput.value = localStorage.getItem('dolbyApiToken') || '';
    r2c2.appendChild(tokenInput);
    row2.appendChild(r2c1);
    row2.appendChild(r2c2);

    const row3 = document.createElement('tr');
    const r3c1 = document.createElement('td');
    r3c1.className = 'text';
    const r3c2 = document.createElement('td');
    const saveBtn = document.createElement('input');
    saveBtn.type = 'button';
    saveBtn.value = '保存';
    const testBtn = document.createElement('input');
    testBtn.type = 'button';
    testBtn.value = '测试';
    const msg = document.createElement('span');
    msg.style.marginLeft = '10px';
    saveBtn.onclick = () => {
        const base = urlInput.value.trim();
        const token = tokenInput.value.trim();
        localStorage.setItem('dolbyApiBaseUrl', base);
        localStorage.setItem('dolbyApiToken', token);
        msg.textContent = '已保存';
        showNotification('API 设置已保存');
    };
    testBtn.onclick = () => {
        const base = (urlInput.value.trim() || localStorage.getItem('dolbyApiBaseUrl') || '').replace(/\/+$/, '');
        const url = base ? `${base}/health` : '';
        const token = (tokenInput.value.trim() || localStorage.getItem('dolbyApiToken') || '');
        if (!url) { msg.textContent = '请先填写 API 地址'; return; }
        const headers = Object.assign({ 'Accept': 'application/json' }, (token ? { 'Authorization': `Api-Token ${token}` } : {}));
        if (typeof GM_xmlhttpRequest === 'function') {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers,
                onload: (r) => { msg.textContent = `测试返回: ${r.status}`; },
                onerror: () => { msg.textContent = '测试失败'; }
            });
        } else {
            fetch(url, { method: 'GET', headers })
                .then(res => { msg.textContent = `测试返回: ${res.status}`; })
                .catch(() => { msg.textContent = '测试失败'; });
        }
    };
    r3c2.appendChild(saveBtn);
    r3c2.appendChild(testBtn);
    r3c2.appendChild(msg);
    row3.appendChild(r3c1);
    row3.appendChild(r3c2);

    formTable.appendChild(row1);
    formTable.appendChild(row2);
    formTable.appendChild(row3);
    box.appendChild(title);
    box.appendChild(formTable);
    td.appendChild(box);
    tr.appendChild(td);
    tbody.appendChild(tr);
    wrap.appendChild(tbody);
    outer.appendChild(wrap);
}