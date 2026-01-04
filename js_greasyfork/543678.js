// ==UserScript==
// @name         2025最新_微信公众号媒体文件批量下载器（公众号：掌心向暖）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  一键批量下载微信公众号文章中的摘要、封面、图片、视频和音频文件，适用普通长文和小绿书
// @author       You
// @match        https://mp.weixin.qq.com/s/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/543678/2025%E6%9C%80%E6%96%B0_%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%AA%92%E4%BD%93%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%9A%E6%8E%8C%E5%BF%83%E5%90%91%E6%9A%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543678/2025%E6%9C%80%E6%96%B0_%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%AA%92%E4%BD%93%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%9A%E6%8E%8C%E5%BF%83%E5%90%91%E6%9A%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 字符串违规字符替换函数
    function sanitizeFilename(input) {
        if (!input) {
            return "";
        }

        // 定义字符替换映射表
        const charMapping = {
            '\\': '＼',  // 反斜杠替换为全角反斜杠
            '/': '／',   // 斜杠替换为全角斜杠
            ':': '：',   // 冒号替换为全角冒号
            '*': '＊',   // 星号替换为全角星号
            '?': '？',   // 问号替换为全角问号
            '"': '"',    // 双引号替换为全角双引号
            '<': '＜',   // 小于号替换为全角小于号
            '>': '＞',   // 大于号替换为全角大于号
            '|': '｜'    // 竖线替换为全角竖线
        };

        // 执行字符替换
        let result = input;
        for (const [illegalChar, legalChar] of Object.entries(charMapping)) {
            result = result.replace(new RegExp('\\' + illegalChar, 'g'), legalChar);
        }

        // 移除制表符和换行符（保留空格）
        result = result.replace(/\t/g, '');  // 移除制表符
        result = result.replace(/\n/g, '');  // 移除换行符
        result = result.replace(/\r/g, '');  // 移除回车符

        return result;
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        init();
    });

    function init() {
        // 创建按钮容器
        createButtons();
    }

    // 创建扫描媒体和一键下载按钮
    function createButtons() {
        // 创建按钮容器 - 固定在页面右侧
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'mediaDownloadContainer';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
            width: 150px;
            text-align: center;
        `;

        // 扫描媒体按钮
        const scanButton = document.createElement('button');
        scanButton.textContent = '扫描媒体';
        scanButton.style.cssText = `
            width: 100%;
            margin: 8px 0;
            padding: 10px 15px;
            background: #1aad19;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        `;
        scanButton.onclick = scanMedia;

        // 添加悬停效果
        scanButton.onmouseover = function() {
            this.style.background = '#16941a';
        };
        scanButton.onmouseout = function() {
            this.style.background = '#1aad19';
        };

        // 一键下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '一键下载';
        downloadButton.style.cssText = `
            width: 100%;
            margin: 8px 0;
            padding: 10px 15px;
            background: #576b95;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        `;
        downloadButton.onclick = downloadAllMedia;

        // 添加悬停效果
        downloadButton.onmouseover = function() {
            this.style.background = '#4a5a82';
        };
        downloadButton.onmouseout = function() {
            this.style.background = '#576b95';
        };

        // 进度显示区域
        const progressDiv = document.createElement('div');
        progressDiv.id = 'downloadProgress';
        progressDiv.style.cssText = `
            margin: 10px 0;
            padding: 8px;
            font-size: 12px;
            color: #666;
            background: #f8f8f8;
            border-radius: 4px;
            line-height: 1.4;
            word-wrap: break-word;
            display: none;
        `;

        buttonContainer.appendChild(scanButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(progressDiv);

        // 将按钮容器添加到页面
        document.body.appendChild(buttonContainer);

        console.log('媒体下载器按钮已创建在页面右侧');
    }

    // 扫描媒体文件
    function scanMedia() {
        const summary = getSummary();
        const cover = getCoverImage();
        const images = getImages();
        const videos = getVideos();
        const audios = getAudios();

        const progressDiv = document.getElementById('downloadProgress');
        progressDiv.style.display = 'block';
        progressDiv.innerHTML = `
            <div><strong>扫描结果：</strong></div>
            <div>摘要：${summary ? '1 个' : '0 个'}</div>
            <div>封面：${cover.length} 张</div>
            <div>图片：${images.length} 张</div>
            <div>视频：${videos.length} 个</div>
            <div>音频：${audios.length} 个</div>
        `;

        console.log('扫描结果:', { summary, cover, images, videos, audios });

        // 3秒后自动隐藏扫描结果
        setTimeout(() => {
            progressDiv.style.display = 'none';
        }, 3000);
    }

    // 获取所有图片（修改后的逻辑，兼容两种类型的文章）
    function getImages() {
        const images = [];
        const imageUrls = []; // 用于去重

        // 方式1：针对包含视频类型的文章 - 从js_content区域获取图片
        const jsContent = document.getElementById('js_content');
        if (jsContent) {
            const imgElements = jsContent.getElementsByTagName('img');

            for (let i = 0; i < imgElements.length; i++) {
                const img = imgElements[i];

                // 过滤条件
                if (img.getAttribute('data-w') === '64') continue;
                if (img.closest('.swiper_indicator_wrp_pc')) continue;

                let imgUrl = '';
                // 优先使用dataset.src，然后使用src
                if (img.dataset.src) {
                    imgUrl = img.dataset.src;
                } else if (img.src && !img.src.startsWith('data:')) {
                    imgUrl = img.src;
                    // 处理微信资源链接
                    imgUrl = imgUrl.replace("//res.wx.qq.com/mmbizwap", "http://res.wx.qq.com/mmbizwap");
                }

                // 去重检查
                if (!imgUrl || imageUrls.includes(imgUrl)) continue;
                imageUrls.push(imgUrl);

                // 根据URL判断图片格式
                let extension = '.jpg'; // 默认jpg
                if (imgUrl.indexOf('wx_fmt=gif') > 0 || imgUrl.indexOf('mmbiz_gif') > 0) {
                    extension = '.gif';
                } else if (imgUrl.indexOf('wx_fmt=png') > 0 || imgUrl.indexOf('mmbiz_png') > 0) {
                    extension = '.png';
                } else if (imgUrl.indexOf('wx_fmt=bmp') > 0 || imgUrl.indexOf('mmbiz_bmp') > 0) {
                    extension = '.bmp';
                } else if (imgUrl.indexOf('wx_fmt=webp') > 0 || imgUrl.indexOf('mmbiz_webp') > 0) {
                    extension = '.webp';
                }

                images.push({
                    url: imgUrl,
                    filename: `image_${images.length + 1}${extension}`
                });
            }

            // 如果从js_content找到了图片，直接返回
            if (images.length > 0) {
                return images;
            }
        }

        // 方式2：针对小绿书类型的文章 - 查找 .swiper_item_img 下的图片
        const swiperImages = document.querySelectorAll('.swiper_item_img img');
        if (swiperImages.length > 0) {
            swiperImages.forEach(img => {
                if (img.src && !imageUrls.includes(img.src)) {
                    imageUrls.push(img.src);

                    // 获取图片扩展名
                    let extension = getImageExtension(img.src);

                    images.push({
                        url: img.src,
                        filename: `image_${images.length + 1}.${extension}`
                    });
                }
            });

            // 如果从swiper找到了图片，直接返回
            if (images.length > 0) {
                return images;
            }
        }

        // 方式3：通用方法 - 如果以上两种方式都没找到图片
        const allImgElements = document.querySelectorAll('img');

        allImgElements.forEach((img) => {
            // 过滤条件
            if (img.getAttribute('data-w') === '64') return;
            if (img.closest('.swiper_indicator_wrp_pc')) return;
            if (!img.src || img.src.startsWith('data:')) return;

            // 去重检查
            if (imageUrls.includes(img.src)) return;
            imageUrls.push(img.src);

            // 获取图片后缀
            let extension = '.png'; // 默认png
            const srcUrl = img.src;
            if (srcUrl.includes('.jpg') || srcUrl.includes('.jpeg')) {
                extension = '.jpg';
            } else if (srcUrl.includes('.gif')) {
                extension = '.gif';
            } else if (srcUrl.includes('.webp')) {
                extension = '.webp';
            }

            images.push({
                url: srcUrl,
                filename: `image_${images.length + 1}${extension}`
            });
        });

        return images;
    }

    // 获取图片扩展名（从参考脚本中提取的函数）
    function getImageExtension(url) {
        const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        if (match) {
            return match[1].toLowerCase();
        }

        // 检查微信图片URL中的格式参数
        if (url.includes('wx_fmt=')) {
            const formatMatch = url.match(/wx_fmt=([a-zA-Z0-9]+)/);
            if (formatMatch) {
                return formatMatch[1].toLowerCase();
            }
        }

        return 'jpg'; // 默认扩展名
    }

    // 获取所有视频
    function getVideos() {
        const videos = [];
        const videoElements = document.querySelectorAll('video');

        videoElements.forEach((video, index) => {
            let videoUrl = video.src;

            // 如果video标签没有src，查找source标签
            if (!videoUrl) {
                const source = video.querySelector('source');
                if (source) {
                    videoUrl = source.src;
                }
            }

            // 只处理微信视频链接
            if (videoUrl && videoUrl.includes('mpvideo.qpic.cn')) {
                videos.push({
                    url: videoUrl,
                    filename: `video_${index + 1}.mp4`
                });
            }
        });

        return videos;
    }

    // 获取所有音频（修改后的逻辑）
    function getAudios() {
        const audios = [];
        const audioUrls = []; // 用于去重

        // 方法1：查找具有voice_encode_fileid属性的元素
        const voiceElements = document.querySelectorAll('[voice_encode_fileid]');
        voiceElements.forEach((element, index) => {
            const voiceId = element.getAttribute('voice_encode_fileid');
            if (voiceId) {
                const audioUrl = `https://res.wx.qq.com/voice/getvoice?mediaid=${voiceId}`;

                // 去重检查
                if (!audioUrls.includes(audioUrl)) {
                    audioUrls.push(audioUrl);
                    audios.push({
                        url: audioUrl,
                        filename: `audio_${audios.length + 1}.mp3`
                    });
                }
            }
        });

        // 方法2：查找audio标签中的微信语音链接（作为备用方法）
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach((audio, index) => {
            if (audio.src && audio.src.includes('res.wx.qq.com/voice')) {
                // 去重检查
                if (!audioUrls.includes(audio.src)) {
                    audioUrls.push(audio.src);
                    audios.push({
                        url: audio.src,
                        filename: `audio_${audios.length + 1}.mp3`
                    });
                }
            }
        });

        console.log('音频识别结果:', audios);
        return audios;
    }

    // 获取文章封面
    function getCoverImage() {
        const coverMeta = document.querySelector('meta[property="twitter:image"]');
        if (coverMeta && coverMeta.content) {
            const coverUrl = coverMeta.content;
            // 使用我们已有的函数来判断图片扩展名
            const extension = getImageExtension(coverUrl);
            return [{
                url: coverUrl,
                // 命名为 封面，使其在文件中排序靠前
                filename: `封面.${extension}`
            }];
        }
        return []; // 如果没找到，返回空数组
    }

    // 获取文章摘要
    function getSummary() {
        const summaryMeta = document.querySelector('meta[name="description"]');
        if (summaryMeta && summaryMeta.content) {
            return summaryMeta.content;
        }
        return null; // 如果没找到，返回null
    }

    // 下载单个文件
    async function downloadFile(url, filename) {
        try {
            // 尝试直接fetch
            let response = await fetch(url);

            // 如果跨域失败，尝试通过代理或其他方式
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            return { filename, blob, success: true };
        } catch (error) {
            console.error(`下载失败: ${filename}`, error);

            // 尝试使用代理方式下载
            try {
                const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
                const response = await fetch(proxyUrl);
                const blob = await response.blob();
                return { filename, blob, success: true };
            } catch (proxyError) {
                console.error(`代理下载也失败: ${filename}`, proxyError);
                return { filename, success: false, error: error.message };
            }
        }
    }

    // 批量下载所有媒体文件
    async function downloadAllMedia() {
        const progressDiv = document.getElementById('downloadProgress');
        progressDiv.style.display = 'block';
        progressDiv.innerHTML = '正在准备下载...';

        // 1. 获取所有媒体
        const cover = getCoverImage();
        const images = getImages();
        const videos = getVideos();
        const audios = getAudios();

        // 2. 合并并去重媒体文件
        const combinedFiles = [...cover, ...images, ...videos, ...audios];
        const uniqueFilesMap = new Map();
        combinedFiles.forEach(file => {
            if (!uniqueFilesMap.has(file.url)) {
                uniqueFilesMap.set(file.url, file);
            }
        });
        const allFiles = Array.from(uniqueFilesMap.values());


        if (allFiles.length === 0) {
            progressDiv.innerHTML = '未找到可下载的媒体文件';
            setTimeout(() => {
                progressDiv.style.display = 'none';
            }, 3000);
            return;
        }

        // 创建JSZip实例
        const zip = new JSZip();

        // 新增：获取摘要并直接添加到压缩包
        const summaryText = getSummary();
        if (summaryText) {
            zip.file("摘要.txt", summaryText);
        }

        let downloadedCount = 0;
        let failedCount = 0;

        progressDiv.innerHTML = `开始下载 ${allFiles.length} 个媒体文件...`;

        // 并发下载文件
        const downloadPromises = allFiles.map(async (file, index) => {
            const result = await downloadFile(file.url, file.filename);

            if (result.success) {
                zip.file(result.filename, result.blob);
                downloadedCount++;
            } else {
                failedCount++;
                console.error(`文件下载失败: ${file.filename}`);
            }

            // 更新进度
            progressDiv.innerHTML = `
                下载进度: ${downloadedCount + failedCount}/${allFiles.length}<br>
                成功: ${downloadedCount} 个<br>
                失败: ${failedCount} 个
            `;

            return result;
        });

        // 等待所有下载完成
        await Promise.all(downloadPromises);

        if (downloadedCount === 0) {
            progressDiv.innerHTML = '所有媒体文件下载失败，请检查网络连接';
            setTimeout(() => {
                progressDiv.style.display = 'none';
            }, 5000);
            return;
        }

        // 生成压缩包
        progressDiv.innerHTML = '正在生成压缩包...';

        try {
            const zipContent = await zip.generateAsync({ type: 'blob' });

            // 获取页面标题并应用字符替换规则作为压缩包名称
            const title = sanitizeFilename(document.title);
            const zipFilename = `${title}.zip`;

            // 下载压缩包
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipContent);
            link.download = zipFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            progressDiv.innerHTML = `
                <div><strong>下载完成！</strong></div>
                <div>成功: ${downloadedCount} 个媒体</div>
                ${failedCount > 0 ? `<div>失败: ${failedCount} 个</div>` : ''}
                ${summaryText ? `<div>摘要: 1 个</div>` : ''}
                <div>压缩包: ${zipFilename}</div>
            `;

            // 5秒后自动隐藏完成信息
            setTimeout(() => {
                progressDiv.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error('生成压缩包失败:', error);
            progressDiv.innerHTML = '生成压缩包失败，请重试';
            setTimeout(() => {
                progressDiv.style.display = 'none';
            }, 3000);
        }
    }

})();