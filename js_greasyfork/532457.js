// ==UserScript==
// @name         sewerpt-label
// @namespace    http://tampermonkey.net/
// @version      0.8.5
// @description  检查PT站种子页面的标签是否正确设置
// @author       fnyfree/ai
// @match        https://sewerpt.com/details.php?id=*
// @grant        none
// @icon         https://sewerpt.com/favicon.ico
// @license      MTT
// @downloadURL https://update.greasyfork.org/scripts/532457/sewerpt-label.user.js
// @updateURL https://update.greasyfork.org/scripts/532457/sewerpt-label.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 缓存变量
    let cachedMediaInfo = null;
    let cachedTagRow = null;
    let cachedTorrentType = null;
    let cachedFileCount = null;
    let cachedSubtitle = null;
    let cachedCurrentTags = null;
    let cachedKdescrContent = null;

    const floatingBox = document.createElement('div');
    floatingBox.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 320px; max-height: 400px; overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.95); border: 1px solid #ccc; border-radius: 5px;
        padding: 10px; font-size: 14px; z-index: 9999; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);`;
    document.body.appendChild(floatingBox);

    const titleElement = document.createElement('h3');
    titleElement.textContent = '标签检查结果';
    titleElement.style.cssText = 'margin-top: 0; text-align: center;';
    floatingBox.appendChild(titleElement);

    const resultArea = document.createElement('div');
    floatingBox.appendChild(resultArea);

    function getMediaInfo() {
        if (cachedMediaInfo !== null) return cachedMediaInfo;
        const fieldsets = document.querySelectorAll('fieldset');
        const mediaInfoPatterns = [
            /Video[\s\S]*?ID\s*[:：]/i, /General[\s\S]*?Complete\s*name/i,
            /Video[\s\S]*?Format\s*[:：]/i, /Video[\s\S]*?Duration[\s\S]*?Bit\s*rate/i
        ];
        for (const fieldset of fieldsets) {
            const content = fieldset.textContent || fieldset.innerText || '';
            if (mediaInfoPatterns.some(pattern => pattern.test(content))) {
                const pre = fieldset.querySelector('pre');
                cachedMediaInfo = pre ? (pre.textContent || pre.innerText || '') : content;
                return cachedMediaInfo;
            }
        }
        for (const fieldset of fieldsets) {
            const legend = fieldset.querySelector('legend');
            if (legend && legend.textContent.trim() === '引用') {
                const content = fieldset.textContent || fieldset.innerText || '';
                if ((content.includes('Video') && content.includes('Audio')) &&
                    (content.includes('Format') || content.includes('Codec')) &&
                    (content.includes('Bit rate') || content.includes('Duration'))) {
                    const pre = fieldset.querySelector('pre');
                    cachedMediaInfo = pre ? (pre.textContent || pre.innerText || '') : content;
                    return cachedMediaInfo;
                }
            }
        }
        cachedMediaInfo = '';
        return cachedMediaInfo;
    }

    function getKdescrContent() {
        if (cachedKdescrContent !== null) return cachedKdescrContent;
        const kdescrElement = document.getElementById('kdescr');
        cachedKdescrContent = kdescrElement ? (kdescrElement.textContent || kdescrElement.innerText || '') : '';
        return cachedKdescrContent;
    }

    function getVideoTrack(mediaInfo) {
        const match = mediaInfo.match(/Video[\s\S]*?(?=Audio|Text|Menu|$)/i);
        return match ? match[0] : '';
    }

    function getAudioTracks(mediaInfo) {
        const individualTracks = mediaInfo.match(/Audio\s*#\d+[\s\S]*?(?=Audio\s*#\d+|Video|Menu|Text|$)/gi);
        if (individualTracks && individualTracks.length > 0) return individualTracks;
        return mediaInfo.match(/Audio[\s\S]*?(?=Video|Menu|Text|$)/gi) || [];
    }

    function getTextTracks(mediaInfo) {
        return mediaInfo.match(/Text\s*#\d+[\s\S]*?(?=Text\s*#\d+|Video|Audio|Menu|$)/gi) || [];
    }

    function getSubtitle() {
        if (cachedSubtitle !== null) return cachedSubtitle;
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const headerCell = row.querySelector('td.rowhead');
            if (headerCell && headerCell.textContent.trim() === '副标题') {
                cachedSubtitle = row.querySelector('td.rowfollow').textContent.trim();
                return cachedSubtitle;
            }
        }
        cachedSubtitle = '';
        return cachedSubtitle;
    }

    function getCurrentTags() {
        if (cachedCurrentTags !== null) return cachedCurrentTags;
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const headerCell = row.querySelector('td.rowhead');
            if (headerCell && headerCell.textContent.trim() === '标签') {
                cachedCurrentTags = Array.from(row.querySelectorAll('span')).map(span => span.textContent.trim());
                return cachedCurrentTags;
            }
        }
        cachedCurrentTags = [];
        return cachedCurrentTags;
    }

    function getTagRow() {
        if (cachedTagRow !== null) return cachedTagRow;
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const headerCell = row.querySelector('td.rowhead');
            if (headerCell && headerCell.textContent.trim() === '标签') {
                cachedTagRow = row;
                return cachedTagRow;
            }
        }
        return null;
    }

    function getTorrentType() {
        if (cachedTorrentType !== null) return cachedTorrentType;
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const headerCell = row.querySelector('td.rowhead');
            if (headerCell && headerCell.textContent.trim() === '基本信息') {
                const contentCell = row.querySelector('td.rowfollow');
                if (contentCell) {
                    const typePatterns = [
                        /类型[:：]\s*(.*?)($|\s{2,})/i, /类型[:：]\s*(.*?)(&nbsp;|$)/i,
                        /类型\s*[:：]\s*([\u4e00-\u9fa5a-zA-Z\s\/]+)/i
                    ];
                    const text = contentCell.textContent;
                    for (const pattern of typePatterns) {
                        const match = text.match(pattern);
                        if (match && match[1]) {
                            cachedTorrentType = match[1].trim();
                            return cachedTorrentType;
                        }
                    }
                    if (text.includes('电影') || text.includes('Movies')) {
                        cachedTorrentType = '电影 / Movies';
                        return cachedTorrentType;
                    }
                }
            }
        }
        cachedTorrentType = '';
        return cachedTorrentType;
    }

    function isMovieType(type) {
        return /电影|Movies|movie|film/i.test(type);
    }

    function getTorrentFileCount() {
        if (cachedFileCount !== null) return cachedFileCount;
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const headerCell = row.querySelector('td.rowhead');
            if (headerCell && headerCell.textContent.trim() === '种子文件') {
                const contentCell = row.querySelector('td.rowfollow');
                if (contentCell) {
                    const text = contentCell.textContent;
                    if (/单个文件|只有一个文件|仅有一个文件|1个文件/i.test(text)) return 1;
                    const patterns = [
                        /文件数[:：]\s*(\d+)个文件/i, /(\d+)个文件/i,
                        /文件数[:：]\s*(\d+)/i, /共\s*(\d+)\s*个文件/i
                    ];
                    for (const pattern of patterns) {
                        const match = text.match(pattern);
                        if (match && match[1]) {
                            cachedFileCount = parseInt(match[1]);
                            return cachedFileCount;
                        }
                    }
                }
            }
        }
        cachedFileCount = null;
        return cachedFileCount;
    }

    function checkFileCount() {
        const torrentType = getTorrentType();
        const fileCount = getTorrentFileCount();
        if (fileCount === null) {
            return { should: null, is: null, fileCount: '未知', isValid: true, torrentType: torrentType };
        }
        const isMovie = isMovieType(torrentType);
        return {
            should: isMovie ? 1 : null, is: fileCount, fileCount: fileCount.toString(),
            isValid: !isMovie || fileCount === 1, torrentType: torrentType
        };
    }

    function checkMandarin(mediaInfo) {
        const audioTracks = getAudioTracks(mediaInfo);
        let result = { found: false, details: [] };

        if (audioTracks.length > 0) {
            for (const track of audioTracks) {
                if (/(汉语普通话|普通话|国语|mandarin|putonghua)/i.test(track)) {
                    const match = track.match(/(汉语普通话|普通话|国语|mandarin|putonghua)/i);
                    result.found = true;
                    result.details.push(match ? match[0] : "国语音轨");
                    // Continue to check other tracks for more details, but found is set.
                } else if (/(粵語|粤语|cantonese|廣東話)/i.test(track) ||
                           /title\s*[:：][^\n]*?(粵語|粤语|cantonese|廣東話)/i.test(track)) {
                    // Skip Cantonese tracks for Mandarin detection based on "Chinese" language tag
                    continue;
                } else if (/language\s*[:：]\s*chinese(?!\s*subtitle)/i.test(track)) {
                    const match = track.match(/language\s*[:：]\s*chinese(?!\s*subtitle)/i);
                    result.found = true;
                    result.details.push(match ? match[0] : "Language: Chinese");
                }
            }
            if (result.found) { // If any track was identified as Mandarin/Chinese
                return result;
            }
            // If specific tracks analyzed and none are Mandarin, proceed to kdescr check
            // (No fallback to mediaInfo overall check if tracks were found)
        } else { // audioTracks.length === 0 (No specific audio tracks could be parsed)
            // Fallback to checking the entire mediaInfo string
            if (/音频\s*[:：]\s*国语|国语配音|国语发音|国语对白/i.test(mediaInfo)) {
                const match = mediaInfo.match(/(音频\s*[:：]\s*国语|国语配音|国语发音|国语对白)/i);
                result.found = true;
                result.details.push(match ? match[0] : "国语音频 (MediaInfo整体)");
                return result;
            }
            const hasChineseIndicator = /language\s*[:：]\s*chinese(?!\s*subtitle)/i.test(mediaInfo);
            const hasCantoneseIndicator = /粵語|粤语|cantonese|廣東話/i.test(mediaInfo);
            if (hasChineseIndicator && !hasCantoneseIndicator) {
                const match = mediaInfo.match(/language\s*[:：]\s*chinese(?!\s*subtitle)/i);
                result.found = true;
                result.details.push(match ? match[0] : "Language: Chinese (MediaInfo整体)");
                return result;
            }
        }

        // If still not found, check kdescr (this part runs if tracks existed but none were Chinese, or if no tracks and mediaInfo overall also not Chinese)
        // This means result.found is still false at this point.
        const kdescrContent = getKdescrContent();
        const kdescrHasMandarin = /语\s*言\s*[:：\s]*汉\s*语\s*普\s*通\s*话/i.test(kdescrContent);

        if (kdescrHasMandarin) {
            let mediaInfoHasAudioLanguage = false;
            if (audioTracks.length > 0) {
                for (const track of audioTracks) {
                    if (/Language\s*[:：]/i.test(track)) {
                        mediaInfoHasAudioLanguage = true;
                        break;
                    }
                }
            } else { // No audio tracks parsed from mediaInfo
                if (/Audio[\s\S]*?Language\s*[:：]/i.test(mediaInfo)) {
                     mediaInfoHasAudioLanguage = true;
                }
            }

            if (!mediaInfoHasAudioLanguage) {
                result.found = true;
                result.details.push("kdescr含汉语普通话，MediaInfo无音轨语言");
            }
        }
        return result;
    }

    function checkCantonese(mediaInfo) {
        const audioTracks = getAudioTracks(mediaInfo);
        const result = { found: false, details: [] };
        if (audioTracks.length === 0) {
            const patterns = [/(粵語|粤语|cantonese|廣東話)/i, /(音频\s*[:：]\s*粤语|粤语配音|粤语发音)/i];
            for (const pattern of patterns) {
                const match = mediaInfo.match(pattern);
                if (match) { result.found = true; result.details.push(match[0]); break; }
            }
            return result;
        }
        for (const track of audioTracks) {
            if (/(粵語|粤语|cantonese|廣東話)/i.test(track)) {
                const match = track.match(/(粵語|粤语|cantonese|廣東話)/i);
                result.found = true; result.details.push(match ? match[0] : "粤语音轨"); continue;
            }
            if (/title\s*[:：][^\n]*?(粵語|粤语|cantonese|廣東話)/i.test(track)) {
                const match = track.match(/title\s*[:：][^\n]*?(粵語|粤语|cantonese|廣東話)/i);
                result.found = true; result.details.push(match ? match[0] : "粤语标题");
            }
        }
        return result;
    }

    function checkChineseSubtitles(mediaInfo) {
        const textBlocks = getTextTracks(mediaInfo);
        const result = { found: false, details: [] };
        for (const block of textBlocks) {
            const titleMatch = block.match(/Title\s*[:：]\s*([^\r\n]+)/i);
            if (titleMatch) {
                const subtitleTitle = titleMatch[1];
                if (/(简体|简中|中英|中文|简体中文|中字)/i.test(subtitleTitle)) {
                    result.found = true; result.details.push(`字幕标题: ${subtitleTitle}`); continue;
                }
            }
            const langMatch = block.match(/Language\s*[:：]\s*([^\r\n]+)/i);
            if (langMatch) {
                const lang = langMatch[1];
                if (/(Chinese|中文)/i.test(lang) && !/(Traditional|繁体|繁體)/i.test(lang)) {
                    result.found = true; result.details.push(`字幕语言: ${lang}`); continue;
                }
            }
            const otherPatterns = [/(Chinese.*?Simplified|简体中文|中文字幕|简体字幕|内嵌中字|内封中字)/i];
            for (const pattern of otherPatterns) {
                const match = block.match(pattern);
                if (match) { result.found = true; result.details.push(match[0]); break; }
            }
        }
        const subtitlePatterns = [
            /(subtitle|字幕|subtitles)\s*[:：][^\r\n]*?(简体|简中|中文|中英)/i, /内嵌中字|内封中字|中文字幕|简体中文/i,
            /Language\s*[:：]\s*Chinese(?!\s*(?:Traditional|繁体|繁體))/i, /PGS[\s\S]*?Title\s*[:：][^\r\n]*?(简体|中文|中英)/i
        ];
        for (const pattern of subtitlePatterns) {
            const match = mediaInfo.match(pattern);
            if (match && !result.found) { result.found = true; result.details.push(match[0]); break; }
        }
        return result;
    }

    function checkHDR(mediaInfo) {
        const videoTrack = getVideoTrack(mediaInfo);
        const result = { found: false, details: [] };
        const content = videoTrack || mediaInfo;
        const strongHdrPatterns = [
            {regex: /hdr\s*format\s*[:：][^\r\n]*/i}, {regex: /dolby\s*vision/i}, {regex: /hdr10\+/i},
            {regex: /color\s*primaries\s*[:：]\s*bt\.2020[^\r\n]*/i}, {regex: /transfer\s*characteristics\s*[:：]\s*pq[^\r\n]*/i},
            {regex: /mastering\s*display\s*luminance[^\r\n]*/i}
        ];
        for (const {regex} of strongHdrPatterns) {
            const match = content.match(regex);
            if (match) { result.found = true; result.details.push(match[0]); return result; }
        }
        const bitDepthMatch = content.match(/bit\s*depth\s*[:：]\s*10\s*bits[^\r\n]*/i);
        const has10BitDepth = bitDepthMatch !== null;
        const hdrFeaturePatterns = [/hdr10[^\r\n]*/i, /mastering\s*display[^\r\n]*/i, /bt\.2020[^\r\n]*/i];
        let hdrFeatureMatch = null;
        for (const pattern of hdrFeaturePatterns) {
            const match = content.match(pattern);
            if (match) { hdrFeatureMatch = match[0]; break; }
        }
        if (has10BitDepth && hdrFeatureMatch) {
            result.found = true;
            if (bitDepthMatch) result.details.push(bitDepthMatch[0]);
            if (hdrFeatureMatch) result.details.push(hdrFeatureMatch);
        }
        return result;
    }

    function checkComplete(subtitleText) {
        return /(全\d+集|全\d+季|全集|完结|全剧终|完整版|合集)/i.test(subtitleText);
    }

    function parseBitrateToMbps(valueStr, unitStr) {
        const bitrate = parseFloat(valueStr.replace(/[\s,]/g, ''));
        return unitStr.toLowerCase().includes('kb') ? (bitrate / 1000) : bitrate;
    }

    function checkHighBitrate(mediaInfo) {
        const HIGH_BITRATE_THRESHOLD = 10;
        const result = { found: false, details: [], value: 0 };
        const bitratePatterns = [
            { source: getVideoTrack(mediaInfo), regex: /bit\s*rate\s*[:：]\s*([\d\s\.,]+)\s*(kb\/s|mb\/s|kbps|mbps)/i, name: "视频轨道比特率" },
            { source: mediaInfo, regex: /overall\s*bit\s*rate\s*[:：]\s*([\d\s\.,]+)\s*(kb\/s|mb\/s|kbps|mbps)/i, name: "整体比特率" },
            { source: mediaInfo, regex: /(\d[\d\s\.,]*)\s*(kb\/s|mb\/s|kbps|mbps)/i, name: "识别到的比特率" }
        ];
        for (const pattern of bitratePatterns) {
            if (!pattern.source) continue;
            const match = pattern.source.match(pattern.regex);
            if (match) {
                const mbps = parseBitrateToMbps(match[1], match[2]);
                if (mbps > HIGH_BITRATE_THRESHOLD) {
                    result.found = true; result.value = mbps;
                    result.details.push(`${pattern.name}: ${match[1]} ${match[2]} (${mbps.toFixed(2)} Mb/s)`);
                    return result;
                }
            }
        }
        return result;
    }

    function checkEpisodes(subtitleText, isComplete) {
        if (isComplete) return false;
        return /(第\d+集|第\d+-\d+集|EP\d+|E\d+|第\d+话)/i.test(subtitleText);
    }

    function checkTags() {
        const mediaInfo = getMediaInfo();
        const subtitleText = getSubtitle();
        const currentTags = getCurrentTags();
        const torrentType = getTorrentType();
        const isMovie = isMovieType(torrentType);
        const isComplete = checkComplete(subtitleText);

        const results = {
            '国语': { should: checkMandarin(mediaInfo).found, is: currentTags.includes('国语'), details: checkMandarin(mediaInfo).details },
            '粤语': { should: checkCantonese(mediaInfo).found, is: currentTags.includes('粤语'), details: checkCantonese(mediaInfo).details },
            '中字': { should: checkChineseSubtitles(mediaInfo).found, is: currentTags.includes('中字'), details: checkChineseSubtitles(mediaInfo).details },
            'HDR': { should: checkHDR(mediaInfo).found, is: currentTags.includes('HDR'), details: checkHDR(mediaInfo).details },
            '完结': { should: isComplete, is: currentTags.includes('完结') },
            '分集': { should: checkEpisodes(subtitleText, isComplete), is: currentTags.includes('分集') }
        };
        if (!isMovie) {
            const highBitrateResult = checkHighBitrate(mediaInfo);
            results['高码率'] = { should: highBitrateResult.found, is: currentTags.includes('高码率'), details: highBitrateResult.details, value: highBitrateResult.value };
        }
        const fileCountResult = checkFileCount();
        if (fileCountResult.should !== null || fileCountResult.is !== null) {
            results['文件数'] = fileCountResult;
        }
        return results;
    }

    function displayResults(results) {
        resultArea.innerHTML = '';
        let hasProblems = false; let needsManualCheck = false;
        for (const [tag, result] of Object.entries(results)) {
            const resultItem = document.createElement('div'); resultItem.style.cssText = 'margin-bottom: 8px;';
            const tagContainer = document.createElement('div'); tagContainer.style.cssText = 'display: flex; justify-content: space-between;';
            const tagSpan = document.createElement('span'); tagSpan.textContent = tag + ':'; tagSpan.style.fontWeight = 'bold';
            tagContainer.appendChild(tagSpan);
            const statusSpan = document.createElement('span');
            if (tag === '文件数') {
                const isMovie = result.torrentType ? isMovieType(result.torrentType) : false;
                if (result.is === null) statusSpan.innerHTML = `无法获取文件数`;
                else if (!isMovie) statusSpan.innerHTML = `共${result.fileCount}个文件 (${result.torrentType || '未知类型'})`;
                else if (result.isValid) statusSpan.innerHTML = `<span style="color: green">✓</span> 共${result.fileCount}个文件 (电影类型)`;
                else { statusSpan.innerHTML = `<span style="color: red">✗</span> 共${result.fileCount}个文件，电影类型应为1个文件`; hasProblems = true; }
            } else {
                if (result.should === result.is) {
                    statusSpan.innerHTML = `<span style="color: green">✓</span> ${result.should ? '已正确勾选' : '已正确不勾选'}`;
                    if (result.should && result.details && result.details.length > 0) {
                        const detailsDiv = document.createElement('div'); detailsDiv.style.cssText = 'margin-top: 3px; margin-left: 20px; padding: 3px; background: #f5f5f5; border: 1px solid #eee; border-radius: 3px; font-size: 12px;';
                        const displayDetails = result.details.slice(0, 3);
                        if (displayDetails.length > 0) {
                            detailsDiv.innerHTML = displayDetails.map(detail => `<div>• ${detail}</div>`).join('');
                            if (result.details.length > 3) detailsDiv.innerHTML += `<div>• ... 等${result.details.length}条信息</div>`;
                            resultItem.appendChild(detailsDiv);
                        }
                    }
                } else {
                    if (result.is && !result.should) {
                        if (tag === '中字') { statusSpan.innerHTML = `<span style="color: red">✗</span> <span style="background-color: #fff3cd; padding: 2px 5px; border-radius: 3px;">手动检查: 可能存在硬字幕或MediaInfo信息非标准</span>`; needsManualCheck = true; }
                        else { statusSpan.innerHTML = `<span style="color: red">✗</span> 应该不勾选`; hasProblems = true; }
                    } else {
                        statusSpan.innerHTML = `<span style="color: red">✗</span> ${result.should ? '应该勾选' : '应该不勾选'}`;
                        if (result.should && !result.is && result.details && result.details.length > 0) {
                            const detailsDiv = document.createElement('div'); detailsDiv.style.cssText = 'margin-top: 3px; margin-left: 20px; padding: 3px; background: #f5f5f5; border: 1px solid #eee; border-radius: 3px; font-size: 12px;';
                            const displayDetails = result.details.slice(0, 3);
                            detailsDiv.innerHTML = displayDetails.map(detail => `<div>• ${detail}</div>`).join('');
                            if (result.details.length > 3) detailsDiv.innerHTML += `<div>• ... 等${result.details.length}条信息</div>`;
                            resultItem.appendChild(detailsDiv);
                        }
                    }
                    hasProblems = true;
                }
            }
            tagContainer.appendChild(statusSpan); resultItem.appendChild(tagContainer); resultArea.appendChild(resultItem);
        }
        if (!document.getElementById('tag-check-style')) {
            const style = document.createElement('style'); style.id = 'tag-check-style';
            style.textContent = `@keyframes flashError{0%{background-color:white}50%{background-color:#ffcccc}100%{background-color:white}} @keyframes flashSuccess{0%{background-color:white}50%{background-color:#ccffcc}100%{background-color:white}} @keyframes flashWarning{0%{background-color:white}50%{background-color:#fff3cd}100%{background-color:white}}`;
            document.head.appendChild(style);
        }
        const tagRow = getTagRow();
        if (tagRow) {
            if (hasProblems) tagRow.style.animation = needsManualCheck ? 'flashWarning 1s infinite' : 'flashError 1s infinite';
            else { tagRow.style.animation = 'flashSuccess 1s infinite'; setTimeout(() => { tagRow.style.animation = ''; }, 5000); }
        }
        const conclusion = document.createElement('div'); conclusion.style.cssText = 'margin-top: 10px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center;';
        if (hasProblems) conclusion.innerHTML = needsManualCheck ? '<strong style="color:#856404;background-color:#fff3cd;padding:3px 8px;border-radius:3px;">请手动检查标签和硬字幕!</strong>' : '<strong style="color:red">标签设置有误，请修正!</strong>';
        else conclusion.innerHTML = '<strong style="color:green">标签设置正确!</strong>';
        resultArea.appendChild(conclusion);
    }

    const closeButton = document.createElement('button'); closeButton.textContent = '关闭';
    closeButton.style.cssText = `position:absolute;top:5px;right:5px;padding:2px 5px;background:#f0f0f0;border:1px solid #ccc;border-radius:3px;cursor:pointer;`;
    closeButton.onclick = function() { floatingBox.style.display = 'none'; const tagRow = getTagRow(); if (tagRow) tagRow.style.animation = ''; };
    floatingBox.appendChild(closeButton);

    const recheckButton = document.createElement('button'); recheckButton.textContent = '重新检查';
    recheckButton.style.cssText = `display:block;margin:10px auto;padding:5px 10px;background:#4CAF50;color:white;border:none;border-radius:3px;cursor:pointer;`;
    recheckButton.onclick = main;
    floatingBox.appendChild(recheckButton);

    const debugButton = document.createElement('button'); debugButton.textContent = '显示调试信息';
    debugButton.style.cssText = `display:block;margin:5px auto;padding:3px 6px;background:#2196F3;color:white;border:none;border-radius:3px;cursor:pointer;font-size:12px;`;
    debugButton.onclick = function() {
        const mediaInfo = getMediaInfo(); const audioTracks = getAudioTracks(mediaInfo); const textTracks = getTextTracks(mediaInfo);
        const videoTrack = getVideoTrack(mediaInfo); const torrentType = getTorrentType(); const fileCount = getTorrentFileCount();
        const isMovie = isMovieType(torrentType); const kdescrContent = getKdescrContent();
        let debugInfo = document.createElement('div'); debugInfo.style.cssText = 'margin-top:10px;border-top:1px dashed #ccc;padding-top:10px;font-size:12px;';
        debugInfo.innerHTML = `
            <div><strong>MediaInfo识别结果:</strong> ${mediaInfo ? '成功' : '失败'}</div> <div><strong>kdescr内容获取:</strong> ${kdescrContent ? '成功' : '失败'}</div>
            <div><strong>视频轨道:</strong> ${videoTrack ? '已找到' : '未找到'}</div> <div><strong>找到的音轨数:</strong> ${audioTracks.length}</div>
            <div><strong>找到的字幕轨数:</strong> ${textTracks.length}</div>
            <div style="margin-top:5px;"><strong>HDR检测:</strong> ${checkHDR(mediaInfo).found?'是':'否'}</div> <div style="margin-top:5px;"><strong>高码率检测:</strong> ${checkHighBitrate(mediaInfo).found?'是':'否'}</div>
            <div style="margin-top:5px;"><strong>中字检测:</strong> ${checkChineseSubtitles(mediaInfo).found?'是':'否'}</div> <div style="margin-top:5px;"><strong>种子类型:</strong> ${torrentType||'未知'}</div>
            <div style="margin-top:5px;"><strong>文件数量:</strong> ${fileCount!==null?fileCount+'个文件':'未知'}</div>
            <div style="margin-top:5px;"><strong>文件数检查:</strong> ${fileCount===null?'无法获取文件数':!isMovie?`非电影类型，文件数为${fileCount}`:fileCount===1?'<span style="color:green">✓</span> 电影类型且文件数为1':'<span style="color:red">✗</span> 电影类型但文件数不为1'}</div>`;
        if (videoTrack) {
            const videoInfo = document.createElement('div'); videoInfo.style.cssText = 'margin-top:5px;'; videoInfo.innerHTML = `<strong>视频轨道内容预览:</strong>`;
            const videoDiv = document.createElement('div'); videoDiv.style.cssText = 'margin-top:3px;padding:3px;background:#f5f5f5;border:1px solid #eee;max-height:100px;overflow-y:auto;';
            videoDiv.textContent = videoTrack.substring(0,300)+(videoTrack.length>300?'...':''); videoInfo.appendChild(videoDiv); debugInfo.appendChild(videoInfo);
        }
        const bitrateInfo = document.createElement('div'); bitrateInfo.style.cssText = 'margin-top:5px;'; bitrateInfo.innerHTML = `<strong>比特率匹配调试:</strong>`;
        if (videoTrack) {
            const bitrateMatch = videoTrack.match(/bit\s*rate\s*[:：]\s*([\d\s\.,]+)\s*(kb\/s|mb\/s|kbps|mbps)/i);
            const matchDiv = document.createElement('div'); matchDiv.style.cssText = 'margin-top:3px;';
            if (bitrateMatch) { const mbps = parseBitrateToMbps(bitrateMatch[1],bitrateMatch[2]); matchDiv.innerHTML = `<span style="color:green">✓</span> 视频轨道比特率匹配成功: ${bitrateMatch[1]} ${bitrateMatch[2]} (约 ${mbps.toFixed(2)} Mb/s, ${mbps>10?'高码率':'非高码率'})`; }
            else { matchDiv.innerHTML = `<span style="color:red">✗</span> 未在视频轨道中找到比特率`; }
            bitrateInfo.appendChild(matchDiv);
        }
        const overallMatch = mediaInfo.match(/overall\s*bit\s*rate\s*[:：]\s*([\d\s\.,]+)\s*(kb\/s|mb\/s|kbps|mbps)/i);
        if (overallMatch) {
            const overallDiv = document.createElement('div'); overallDiv.style.cssText = 'margin-top:3px;'; const mbps = parseBitrateToMbps(overallMatch[1],overallMatch[2]);
            overallDiv.innerHTML = `<span style="color:green">✓</span> 整体比特率匹配成功: ${overallMatch[1]} ${overallMatch[2]} (约 ${mbps.toFixed(2)} Mb/s, ${mbps>10?'高码率':'非高码率'})`;
            bitrateInfo.appendChild(overallDiv);
        }
        const genericMatch = mediaInfo.match(/(\d[\d\s\.,]*)\s*(kb\/s|mb\/s|kbps|mbps)/i);
        if (genericMatch) {
            const genericDiv = document.createElement('div'); genericDiv.style.cssText = 'margin-top:3px;'; const mbps = parseBitrateToMbps(genericMatch[1],genericMatch[2]);
            genericDiv.innerHTML = `<span style="color:blue">i</span> 通用比特率匹配: ${genericMatch[1]} ${genericMatch[2]} (约 ${mbps.toFixed(2)} Mb/s, ${mbps>10?'高码率':'非高码率'})`;
            bitrateInfo.appendChild(genericDiv);
        }
        debugInfo.appendChild(bitrateInfo);
        const mediaInfoPreview = document.createElement('div'); mediaInfoPreview.style.cssText = 'margin-top:5px;'; mediaInfoPreview.innerHTML = `<strong>MediaInfo预览 (前1000字符):</strong>`;
        const previewContent = document.createElement('div'); previewContent.style.cssText = 'margin-top:3px;padding:3px;background:#f5f5f5;border:1px solid #eee;max-height:200px;overflow-y:auto;white-space:pre-wrap;font-family:monospace;font-size:10px;';
        previewContent.textContent = mediaInfo.substring(0,1000)+(mediaInfo.length>1000?'...':''); mediaInfoPreview.appendChild(previewContent); debugInfo.appendChild(mediaInfoPreview);
        const kdescrPreview = document.createElement('div'); kdescrPreview.style.cssText = 'margin-top:5px;'; kdescrPreview.innerHTML = `<strong>kdescr内容预览 (前500字符):</strong>`;
        const kdescrContentPreview = document.createElement('div'); kdescrContentPreview.style.cssText = 'margin-top:3px;padding:3px;background:#f5f5f5;border:1px solid #eee;max-height:100px;overflow-y:auto;white-space:pre-wrap;font-family:monospace;font-size:10px;';
        kdescrContentPreview.textContent = kdescrContent.substring(0,500)+(kdescrContent.length>500?'...':''); kdescrPreview.appendChild(kdescrContentPreview); debugInfo.appendChild(kdescrPreview);
        resultArea.appendChild(debugInfo);
    };
    floatingBox.appendChild(debugButton);

    function clearCache() {
        cachedMediaInfo = null; cachedTagRow = null; cachedTorrentType = null; cachedFileCount = null;
        cachedSubtitle = null; cachedCurrentTags = null; cachedKdescrContent = null;
    }

    function main() {
        try {
            clearCache();
            const results = checkTags();
            displayResults(results);
        } catch (error) {
            console.error('Tag check error:', error);
            resultArea.innerHTML = `<div style="color:red;padding:10px;background-color:#fff0f0;border:1px solid #ffcccc;border-radius:3px;"><strong>检查过程中出错:</strong> ${error.message||'未知错误'}<br><br><small>如果问题持续存在，请刷新页面或联系开发者。</small></div>`;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(main, 500));
    else setTimeout(main, 500);
})();