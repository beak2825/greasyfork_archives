// ==UserScript==
// @name         汽水音乐歌词下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  下载汽水音乐歌词（LRC逐字格式）
// @author       Yanice537
// @match        https://music.douyin.com/qishui/share/track*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537855/%E6%B1%BD%E6%B0%B4%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/537855/%E6%B1%BD%E6%B0%B4%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '下载LRC歌词';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '12px 24px';
        btn.style.background = 'linear-gradient(45deg, #ff2a55, #ff8a00)';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '30px';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '16px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 15px rgba(255, 42, 85, 0.4)';
        btn.style.transition = 'all 0.3s ease';

        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-3px)';
            btn.style.boxShadow = '0 6px 20px rgba(255, 42, 85, 0.6)';
        };

        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 15px rgba(255, 42, 85, 0.4)';
        };

        btn.onclick = downloadLyrics;

        document.body.appendChild(btn);
        return btn;
    }

    // 下载歌词
    async function downloadLyrics() {
        const btn = this;
        const originalText = btn.innerHTML;
        btn.innerHTML = '获取歌词中...';
        btn.disabled = true;

        try {
            // 获取当前页面URL参数
            const urlParams = new URLSearchParams(window.location.search);
            const track_id = urlParams.get('track_id');

            if (!track_id) {
                throw new Error('无法获取歌曲ID');
            }

            // 构建API请求URL
            const apiUrl = `https://music.douyin.com/qishui/share/track?${urlParams.toString()}`;

            // 发送请求获取歌词数据
            const response = await fetch(apiUrl);
            const responseText = await response.text();

            // 获取歌曲元数据
            const { artistName, songTitle, composer, lyricist } = extractMetadata(responseText);

            // 创建文件名
            const filename = `${artistName}-${songTitle}.lrc`.replace(/[\\/:*?"<>|]/g, '');

            // 解析歌词
            let lrcContent = parseLyrics(responseText);

            // 添加元数据到歌词开头
            lrcContent = addMetadataToLyrics(lrcContent, composer, lyricist);

            // 下载文件
            downloadFile(lrcContent, filename);

            btn.innerHTML = '下载成功！';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('歌词下载失败:', error);
            btn.innerHTML = '失败，点击重试';
            btn.disabled = false;

            // 显示错误提示
            showErrorToast(`歌词下载失败: ${error.message}`);
        }
    }

    // 提取歌曲元数据
    function extractMetadata(responseText) {
        // 歌曲名
        const songTitleMatch = responseText.match(/"trackName":"(.*?)"/);
        const songTitle = songTitleMatch ? songTitleMatch[1] : '未知歌曲';

        // 歌手名
        const artistNameMatch = responseText.match(/"artistName":"(.*?)"/);
        const artistName = artistNameMatch ? artistNameMatch[1] : '未知歌手';

        // 作曲
        const composerMatch = responseText.match(/"text":"作曲：(.*?)","startMs":(\d+),"endMs":(\d+)/);
        const composer = composerMatch ? composerMatch[1] : '未知作曲';

        // 作词
        const lyricistMatch = responseText.match(/"text":"作词：(.*?)","startMs":(\d+),"endMs":(\d+)/);
        const lyricist = lyricistMatch ? lyricistMatch[1] : '未知作词';

        return {
            songTitle,
            artistName,
            composer,
            lyricist
        };
    }

    // 添加元数据到歌词开头
    function addMetadataToLyrics(lyrics, composer, lyricist) {
        return `[ar:${composer}]\n` +
            `[ti:${lyricist}]\n\n` +
            lyrics;
    }

    // 解析歌词
    function parseLyrics(responseText) {
        // 使用正则表达式提取逐行歌词
        const lineLyrics = [];
        const lineRegex = /{"text":"(.*?)","startMs":(\d+),"endMs":(\d+)(?=,"words":)/g;
        let lineMatch;

        while ((lineMatch = lineRegex.exec(responseText)) !== null) {
            lineLyrics.push({
                text: lineMatch[1],
                startMs: parseInt(lineMatch[2]),
                endMs: parseInt(lineMatch[3])
            });
        }

        // 提取逐字歌词信息
        const wordLyrics = [];
        const wordRegex = /{"startMs":(\d+),"endMs":(\d+),"text":"(.*?)"}/g;
        let wordMatch;

        while ((wordMatch = wordRegex.exec(responseText)) !== null) {
            wordLyrics.push({
                startMs: parseInt(wordMatch[1]),
                endMs: parseInt(wordMatch[2]),
                text: wordMatch[3]
            });
        }

        // 准备LRC内容
        const lrcContent = [];

        // 处理每一行歌词
        for (const line of lineLyrics) {
            const lineStartMs = line.startMs;
            const lineEndMs = line.endMs;
            const lineText = line.text;

            // 收集属于当前行的逐字歌词
            const lineWords = [];
            for (const word of wordLyrics) {
                if (word.startMs >= lineStartMs && word.startMs <= lineEndMs) {
                    lineWords.push({
                        startMs: word.startMs,
                        text: word.text
                    });
                }
            }

            // 如果没有逐字歌词，使用整行文本
            if (lineWords.length === 0) {
                const timeTag = formatTime(lineStartMs);
                lrcContent.push(`${timeTag}${lineText}`);
            } else {
                // 按时间排序逐字歌词
                lineWords.sort((a, b) => a.startMs - b.startMs);

                // 生成逐字LRC行
                let lineStr = '';
                for (const word of lineWords) {
                    const timeTag = formatTime(word.startMs);
                    lineStr += `${timeTag}${word.text}`;
                }
                lrcContent.push(lineStr);
            }
        }

        return lrcContent.join('\n');
    }

    // 格式化时间标签
    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;
    }

    // 下载文件
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // 显示错误提示
    function showErrorToast(message) {
        let toast = document.getElementById('lyrics-error-toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'lyrics-error-toast';
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#ff2a55';
            toast.style.color = 'white';
            toast.style.padding = '15px 25px';
            toast.style.borderRadius = '8px';
            toast.style.zIndex = '10000';
            toast.style.fontWeight = 'bold';
            toast.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            toast.style.transition = 'opacity 0.3s';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    // 初始化
    window.addEventListener('load', () => {
        createDownloadButton();
    });
})();