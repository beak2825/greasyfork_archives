// ==UserScript==
// @name         Grajapa Downloader (Multilingual UI + Status)
// @namespace    http://tampermonkey.net/
// @version      0.5.1 // Incremented version for the CDN change
// @description  Easily download all images from grajapa.shueisha.co.jp with a single click. Features an enhanced UI, real-time status, and language options (EN, JP, CN).
// @author       hg542006810 (Enhanced by AI Assistant & Community)
// @match        https://www.grajapa.shueisha.co.jp/viewerV3_8/*
// @icon         https://www.google.com/s2/favicons?domain=shueisha.co.jp
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538002/Grajapa%20Downloader%20%28Multilingual%20UI%20%2B%20Status%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538002/Grajapa%20Downloader%20%28Multilingual%20UI%20%2B%20Status%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[GRAJAPA DOWNLOADER] Script initialized (v0.5.1)');

    // --- Translations ---
    const translations = {
        en: {
            scriptName: "Grajapa Downloader",
            btnDownload: "Download All Images",
            statusReady: "Status: Ready",
            statusInitializing: "Status: Initializing...",
            statusLocatingAlbums: "Status: Locating image albums...",
            statusProcessingAlbum: "Processing album {current} of {total}...",
            statusProcessingAlbumWait: "Processing album {current} of {total}... Please wait.",
            statusFoundImages: "Found {count} images. Preparing ZIP...",
            statusCreatingZip: "Creating ZIP... {percent}%",
            statusZipProgress: "Compressing: {file}",
            statusZipComplete: "ZIP created! ({count} images) Starting download...",
            statusNoAlbums: "No image albums found (.list-group-item)! Check console and ensure you're on the correct page.",
            statusNoImagesAfterProcessing: "No image URLs found after processing! Check console for errors.",
            statusNoValidBase64Images: "No valid Base64 images found to ZIP! Check console for link types.",
            statusErrorFrame: "Error: Could not find main image frame (.fixed-book-frame).",
            statusErrorZip: "Error creating ZIP! {message}",
            statusErrorIframe: "Error accessing iframe content. Possible cross-origin issue or content not loaded.",
            alertNoAlbums: "No image items found! (Missing '.list-group-item' class). Please check browser console and if you are on the correct page.",
            alertNoImages: "No images found! (After processing items, no image URLs were collected). Please check browser console for errors.",
            alertNoBase64: "No recognizable Base64 images were found to create the ZIP file! Check the console for details on the links found.",
            alertZipError: "Error creating ZIP file! {message}",
            alertZipComplete: "ZIP creation complete. Download starting!",
            langEnglish: "EN",
            langJapanese: "JP",
            langChinese: "CN",
            errorAddingUI: "Failed to initialize script: Could not add UI to the page."
        },
        jp: {
            scriptName: "Grajapaダウンローダー",
            btnDownload: "すべての画像をダウンロード",
            statusReady: "ステータス: 準備完了",
            statusInitializing: "ステータス: 初期化中...",
            statusLocatingAlbums: "ステータス: 画像アルバムを検索中...",
            statusProcessingAlbum: "アルバム {current}/{total} を処理中...",
            statusProcessingAlbumWait: "アルバム {current}/{total} を処理中... しばらくお待ちください。",
            statusFoundImages: "{count}枚の画像が見つかりました。ZIPを準備中...",
            statusCreatingZip: "ZIPを作成中... {percent}%",
            statusZipProgress: "圧縮中: {file}",
            statusZipComplete: "ZIP作成完了！({count}枚の画像) ダウンロードを開始します...",
            statusNoAlbums: "画像アルバムが見つかりません (.list-group-item)！コンソールを確認し、正しいページにいることを確認してください。",
            statusNoImagesAfterProcessing: "処理後に画像URLが見つかりません！コンソールでエラーを確認してください。",
            statusNoValidBase64Images: "ZIPする有効なBase64画像が見つかりません！リンクの種類をコンソールで確認してください。",
            statusErrorFrame: "エラー: メイン画像フレーム (.fixed-book-frame) が見つかりません。",
            statusErrorZip: "ZIP作成エラー！{message}",
            statusErrorIframe: "iframeコンテンツへのアクセスエラー。クロスオリジン問題またはコンテンツ未ロードの可能性があります。",
            alertNoAlbums: "画像アイテムが見つかりません！（'.list-group-item'クラスがありません）。ブラウザのコンソールを確認し、正しいページにいるか確認してください。",
            alertNoImages: "画像が見つかりません！（アイテム処理後、画像URLが収集されませんでした）。ブラウザのコンソールでエラーを確認してください。",
            alertNoBase64: "ZIPファイルを作成するための認識可能なBase64画像が見つかりませんでした！見つかったリンクの詳細はコンソールを確認してください。",
            alertZipError: "ZIPファイル作成エラー！{message}",
            alertZipComplete: "ZIPの作成が完了しました。ダウンロードを開始します！",
            langEnglish: "英語",
            langJapanese: "日本語",
            langChinese: "中国語",
            errorAddingUI: "スクリプトの初期化に失敗しました：UIをページに追加できませんでした。"
        },
        cn: { // Simplified Chinese
            scriptName: "Grajapa 下载器",
            btnDownload: "下载所有图片",
            statusReady: "状态: 准备就绪",
            statusInitializing: "状态: 初始化中...",
            statusLocatingAlbums: "状态: 正在查找图片相册...",
            statusProcessingAlbum: "正在处理相册 {current}/{total}...",
            statusProcessingAlbumWait: "正在处理相册 {current}/{total}... 请稍候。",
            statusFoundImages: "找到 {count} 张图片。正在准备ZIP...",
            statusCreatingZip: "正在创建ZIP... {percent}%",
            statusZipProgress: "正在压缩: {file}",
            statusZipComplete: "ZIP创建完成！({count}张图片) 下载即将开始...",
            statusNoAlbums: "未找到图片相册 (.list-group-item)！请检查控制台并确保您在正确的页面上。",
            statusNoImagesAfterProcessing: "处理后未找到图片URL！请检查控制台中的错误。",
            statusNoValidBase64Images: "未找到可ZIP的有效Base64图片！请在控制台中检查链接类型。",
            statusErrorFrame: "错误: 未找到主图片框 (.fixed-book-frame)。",
            statusErrorZip: "创建ZIP时出错！{message}",
            statusErrorIframe: "访问iframe内容时出错。可能是跨域问题或内容未加载。",
            alertNoAlbums: "未找到图片项目！（缺少'.list-group-item'类）。请检查浏览器控制台，并确认您是否在正确的页面上。",
            alertNoImages: "未找到图片！（处理项目后，未收集到图片URL）。请检查浏览器控制台中的错误。",
            alertNoBase64: "未找到可识别的Base64图片来创建ZIP文件！请检查控制台以获取有关找到的链接的详细信息。",
            alertZipError: "创建ZIP文件时出错！{message}",
            alertZipComplete: "ZIP创建完成。下载即将开始！",
            langEnglish: "英语",
            langJapanese: "日语",
            langChinese: "中文",
            errorAddingUI: "脚本初始化失败：无法将UI添加到页面。"
        }
    };

    let currentLang = localStorage.getItem('grajapaDownloaderLang') || 'en';

    // Helper function to get translated string
    function T(key, replacements = {}) {
        let translatedString = (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || `MISSING_TRANSLATION: ${key}`;
        for (const placeholder in replacements) {
            translatedString = translatedString.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return translatedString;
    }

    // --- UI Elements ---
    var uiContainer, button, statusArea, langButtonContainer;

    function createUI() {
        uiContainer = document.createElement('div');
        uiContainer.id = 'grajapa_downloader_container';

        // Language buttons
        langButtonContainer = document.createElement('div');
        langButtonContainer.id = 'grajapa_lang_selector';

        ['en', 'jp', 'cn'].forEach(langCode => {
            const langButton = document.createElement('button');
            langButton.id = `lang_btn_${langCode}`;
            langButton.textContent = translations[langCode][`lang${langCode.charAt(0).toUpperCase() + langCode.slice(1)}`];
            if (currentLang === langCode) {
                langButton.classList.add('active');
            }
            langButton.addEventListener('click', () => setLanguage(langCode));
            langButtonContainer.appendChild(langButton);
        });
        uiContainer.appendChild(langButtonContainer);

        button = document.createElement('button');
        button.id = 'grajapa_download_button';
        uiContainer.appendChild(button);

        statusArea = document.createElement('div');
        statusArea.id = 'grajapa_status_area';
        uiContainer.appendChild(statusArea);

        applyTranslationsToUI();
    }

    function applyTranslationsToUI() {
        if (!uiContainer) return;

        button.textContent = T('btnDownload');
        statusArea.textContent = T('statusReady');

        ['en', 'jp', 'cn'].forEach(langCode => {
            const langButton = document.getElementById(`lang_btn_${langCode}`);
            if (langButton) {
                langButton.textContent = translations[langCode][`lang${langCode.charAt(0).toUpperCase() + langCode.slice(1)}`];
                if (currentLang === langCode) {
                    langButton.classList.add('active');
                } else {
                    langButton.classList.remove('active');
                }
            }
        });
        if(button.disabled) {
            // Status already set by ongoing process, no need to reset to 'Ready'
        } else {
             statusArea.textContent = T('statusReady');
        }
    }

    function setLanguage(langCode) {
        currentLang = langCode;
        localStorage.setItem('grajapaDownloaderLang', langCode);
        console.log(`[GRAJAPA DOWNLOADER] Language changed to: ${langCode}`);
        applyTranslationsToUI();
        if (!button.disabled) {
            updateStatus('statusReady');
        }
    }

    GM_addStyle(`
        #grajapa_downloader_container {
            position: fixed; z-index: 10000; top: 20px; right: 20px;
            background: #f9f9f9; border: 1px solid #ccc; border-radius: 8px;
            padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif; width: 280px; text-align: center;
        }
        #grajapa_lang_selector {
            margin-bottom: 10px; display: flex; justify-content: space-around;
        }
        #grajapa_lang_selector button {
            background-color: #e0e0e0; color: #333; border: 1px solid #c0c0c0;
            padding: 5px 8px; font-size: 12px; cursor: pointer; border-radius: 4px;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        #grajapa_lang_selector button:hover {
            background-color: #d0d0d0;
        }
        #grajapa_lang_selector button.active {
            background-color: #007bff; color: white; border-color: #0056b3;
            font-weight: bold; box-shadow: 0 0 5px rgba(0,123,255,0.5);
        }
        #grajapa_download_button {
            background-color: #007bff; color: white; border: none;
            padding: 10px 15px; text-align: center; display: block; width: 100%;
            font-size: 16px; margin-bottom: 10px; cursor: pointer;
            border-radius: 5px; transition: background-color 0.3s ease;
        }
        #grajapa_download_button:hover { background-color: #0056b3; }
        #grajapa_download_button:disabled { background-color: #cccccc; cursor: not-allowed; }
        #grajapa_status_area {
            font-size: 13px; color: #333; padding: 8px; border-top: 1px solid #eee;
            margin-top: 5px; min-height: 20px; background-color: #fff; border-radius: 4px;
            word-wrap: break-word;
        }
        #grajapa_status_area.error { color: #D8000C; background-color: #FFD2D2; font-weight: bold; }
        #grajapa_status_area.success { color: #2F855A; background-color: #C6F6D5; font-weight: bold; }
    `);

    function updateStatus(messageKey, type = 'info', replacements = {}) {
        const messageText = T(messageKey, replacements);
        if (statusArea) { // Ensure statusArea exists
            statusArea.textContent = messageText;
            statusArea.className = ''; // Reset class
            if (type === 'error') {
                statusArea.classList.add('error');
            } else if (type === 'success') {
                statusArea.classList.add('success');
            }
        }
        console.log(`[GRAJAPA DOWNLOADER STATUS] ${messageText}`);
    }

    async function handleDownload() {
        if (button) button.disabled = true;
        updateStatus('statusInitializing');
        console.log('[GRAJAPA DOWNLOADER] Download button clicked');

        async function getImages(index, sum, allCollectedImages) {
            updateStatus('statusProcessingAlbum', 'info', { current: index + 1, total: sum });
            console.log(`[GRAJAPA DOWNLOADER] Processing item ${index + 1} of ${sum}`);
            let currentBatchImages = [];
            const listItem = $('.list-group-item')[index];

            if (!listItem) {
                console.error('[GRAJAPA DOWNLOADER] Could not find .list-group-item for index:', index);
                updateStatus('statusNoAlbums', 'error');
                return allCollectedImages;
            }
            listItem.click();

            await new Promise(resolve => setTimeout(resolve, 1500));

            const fixedBookFrames = $('.fixed-book-frame');
            if (fixedBookFrames.length === 0 && index === 0) {
                updateStatus('statusErrorFrame', 'error');
                console.warn('[GRAJAPA DOWNLOADER] No .fixed-book-frame found');
            }

            fixedBookFrames.each(function () {
                $(this).find('iframe').each(function () {
                    try {
                        const iframeContents = $(this).contents();
                        iframeContents.find('image').each(function () {
                            const link = $(this).attr('xlink:href');
                            if (link && allCollectedImages.indexOf(link) === -1 && currentBatchImages.indexOf(link) === -1) {
                                currentBatchImages.push(link);
                            }
                        });
                        iframeContents.find('img').each(function () {
                            const srcLink = $(this).attr('src');
                            if (srcLink && allCollectedImages.indexOf(srcLink) === -1 && currentBatchImages.indexOf(srcLink) === -1) {
                                currentBatchImages.push(srcLink);
                            }
                        });
                    } catch (e) {
                        console.error('[GRAJAPA DOWNLOADER] Error accessing iframe content:', e.message);
                    }
                });
            });

            allCollectedImages = allCollectedImages.concat(currentBatchImages);
            console.log(`[GRAJAPA DOWNLOADER] Images found this round: ${currentBatchImages.length}. Total collected: ${allCollectedImages.length}`);

            if (index + 1 < sum) {
                updateStatus('statusProcessingAlbumWait', 'info', { current: index + 1, total: sum });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return getImages(index + 1, sum, allCollectedImages);
            }
            return allCollectedImages;
        }

        updateStatus('statusLocatingAlbums');
        const itemCount = $('.list-group-item').length;
        console.log(`[GRAJAPA DOWNLOADER] Found items (.list-group-item): ${itemCount}`);

        if (itemCount === 0) {
            updateStatus('statusNoAlbums', 'error');
            alert(T('alertNoAlbums'));
            if (button) button.disabled = false;
            return;
        }

        const images = await getImages(0, itemCount, []);
        console.log(`[GRAJAPA DOWNLOADER] Total images collected after recursion: ${images.length}`);

        if (images.length === 0) {
            updateStatus('statusNoImagesAfterProcessing', 'error');
            alert(T('alertNoImages'));
            if (button) button.disabled = false;
            return;
        }

        updateStatus('statusFoundImages', 'info', { count: images.length });
        const zip = new JSZip();
        const imgFolder = zip.folder('images');
        let validImageCount = 0;

        images.forEach((item) => {
            if (typeof item !== 'string') return;
            let base64Data = '';
            let extension = '';

            if (item.startsWith('data:image/jpeg;base64,')) {
                base64Data = item.replace('data:image/jpeg;base64,', '');
                extension = '.jpeg';
            } else if (item.startsWith('data:image/jpg;base64,')) {
                base64Data = item.replace('data:image/jpg;base64,', '');
                extension = '.jpg';
            } else if (item.startsWith('data:image/png;base64,')) {
                base64Data = item.replace('data:image/png;base64,', '');
                extension = '.png';
            } else {
                console.warn(`[GRAJAPA DOWNLOADER] Unsupported link format or not a known Base64 data URI: ${item}`);
                return;
            }

            if (base64Data && extension) {
                imgFolder.file((validImageCount + 1) + extension, base64Data, { base64: true });
                validImageCount++;
            }
        });

        if (validImageCount === 0) {
            updateStatus('statusNoValidBase64Images', 'error');
            alert(T('alertNoBase64'));
            if (button) button.disabled = false;
            return;
        }

        console.log(`[GRAJAPA DOWNLOADER] Creating ZIP file for ${validImageCount} images.`);
        zip.generateAsync({ type: 'blob' }, (metadata) => {
            updateStatus('statusCreatingZip', 'info', { percent: metadata.percent.toFixed(0) });
            if (metadata.currentFile) {
                console.log(T('statusZipProgress', { file: metadata.currentFile }));
            }
        })
        .then((content) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            let pageTitle = document.title.replace(/[<>:"/\\|?*]+/g, '_').trim() || 'grajapa_images';
            a.download = `${pageTitle}_${Date.now()}.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
            console.log(`[GRAJAPA DOWNLOADER] ZIP file created and download initiated: ${a.download}`);
            updateStatus('statusZipComplete', 'success', { count: validImageCount });
            alert(T('alertZipComplete'));
            setTimeout(() => {
                if (button && !button.disabled) updateStatus('statusReady');
            }, 7000);
        })
        .catch((err) => {
            console.error('[GRAJAPA DOWNLOADER] Error creating ZIP:', err);
            updateStatus('statusErrorZip', 'error', { message: err.message });
            alert(T('alertZipError', { message: err.message }));
        })
        .finally(() => {
            if (button) button.disabled = false;
            // Check current status class to avoid resetting a success/error message immediately to "Ready"
             if (statusArea && !(statusArea.classList.contains('success') || statusArea.classList.contains('error'))) {
                 updateStatus('statusReady');
            }
        });
    }

    function init() {
        createUI();
        if (button) { // Ensure button is created before assigning onclick
             button.onclick = handleDownload;
        }


        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (uiContainer) document.body.appendChild(uiContainer);
                console.log('[GRAJAPA DOWNLOADER] UI added after DOMContentLoaded.');
            });
        } else {
            try {
                if (uiContainer) document.body.appendChild(uiContainer);
                console.log('[GRAJAPA DOWNLOADER] UI added to body.');
            } catch (e) {
                console.error('[GRAJAPA DOWNLOADER] Could not append UI to body:', e);
                alert(T('errorAddingUI'));
            }
        }
    }

    init();

})();