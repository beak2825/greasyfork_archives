// ==UserScript==
// @name         SnapAny 全能媒体下载器 (Zero V5.0 负边距修正版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  【UI修正】校准指令理解，使用负外边距(margin-top: -20px)将主面板强制上移20像素，实现用户预期的视觉效果。
// @author       Zero (全域系统工程师AI)
// @match        https://snapany.com/zh*
// @icon         https://snapany.com/favicon.ico
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542271/SnapAny%20%E5%85%A8%E8%83%BD%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28Zero%20V50%20%E8%B4%9F%E8%BE%B9%E8%B7%9D%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542271/SnapAny%20%E5%85%A8%E8%83%BD%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28Zero%20V50%20%E8%B4%9F%E8%BE%B9%E8%B7%9D%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 零号AI核心：配置与常量 (与V4.9一致)
    // =================================================================================
    const 选择器_结果容器 = 'div.flex.h-full.flex-col.justify-center.gap-4.p-6';
    const 选择器_作品文案 = '.text-center.text-sm.font-medium';
    const 选择器_媒体链接 = 'a[download]';
    const 注入面板ID = 'zero-downloader-panel';
    const 图片域名特征 = 'douyinpic.com';
    const 模态框ID = 'zero-modal-player';

    // =================================================================================
    // 零号AI核心：注入自定义样式 (V5.0 修正)
    // =================================================================================
    GM_addStyle(`
        /* [V5.0 修正] 使用负外边距强制上移 */
        #${注入面板ID} { border: 2px dashed #007bff; border-radius: 8px; padding: 15px; margin-top: -20px; background-color: #f8f9fa; }
        #${注入面板ID} h3 { margin-top: 0; margin-bottom: 15px; text-align: center; color: #333; font-weight: bold; }
        .zero-控制区 { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-top: 1px solid #dee2e6; margin-top: 15px; }
        .zero-下载按钮 { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.3s; }
        .zero-下载按钮:disabled { background-color: #cccccc; cursor: not-allowed; }
        .zero-全选标签 { font-size: 16px; cursor: pointer; display: flex; align-items: center; }
        .zero-全选复选框 { margin-right: 8px; width: 18px; height: 18px; cursor: pointer; }
        .zero-预览区 { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
        .zero-媒体项 { position: relative; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; background-color: #000; cursor: pointer; }
        .zero-媒体项 img, .zero-媒体项 video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .zero-媒体复选框 { position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; cursor: pointer; z-index: 10; background-color: rgba(255, 255, 255, 0.7); border: 1px solid #999; border-radius: 3px; }
        #${模态框ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); z-index: 9999; display: flex; justify-content: center; align-items: center; }
        #${模态框ID} .modal-content { position: relative; max-width: 90vw; max-height: 90vh; }
        #${模态框ID} video { width: 100%; height: 100%; outline: none; }
        #${模态框ID} .close-button { position: absolute; top: -30px; right: 0; font-size: 30px; color: #fff; cursor: pointer; line-height: 1; font-family: Arial, sans-serif; }
    `);

    // =================================================================================
    // 零号AI核心：页内沙箱播放器 (与V4.9一致)
    // =================================================================================
    function 打开页内播放器(媒体) {
        if (document.getElementById(模态框ID)) return;
        const modal = document.createElement('div');
        modal.id = 模态框ID;
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        const video = document.createElement('video');
        video.src = 媒体.downloadUrl;
        video.controls = true;
        video.autoplay = true;
        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '&times;';
        closeButton.title = '关闭 (Esc)';
        modalContent.appendChild(closeButton);
        modalContent.appendChild(video);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        const closeModal = () => {
            document.removeEventListener('keydown', handleEsc);
            modal.remove();
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', handleEsc);
        video.focus();
    }

    // =================================================================================
    // 零号AI核心：通用媒体面板构建器 (与V4.9一致)
    // =================================================================================
    function 构建通用媒体面板(锚点元素, 媒体对象列表) {
        if (!媒体对象列表 || 媒体对象列表.length === 0) return;
        const 总面板 = document.createElement('div');
        总面板.id = 注入面板ID;
        总面板.innerHTML = `<h3>零号AI · 全能媒体下载器</h3>`;
        const 预览区 = document.createElement('div');
        预览区.className = 'zero-预览区';
        总面板.appendChild(预览区);
        媒体对象列表.forEach(媒体 => {
            const 媒体项 = document.createElement('div');
            媒体项.className = 'zero-媒体项';
            媒体项.title = '点击或双击可全屏预览';
            媒体项.addEventListener('click', () => 打开页内播放器(媒体));
            if (媒体.type === 'video') {
                const 视频元素 = document.createElement('video');
                视频元素.src = 媒体.downloadUrl;
                视频元素.poster = 媒体.previewUrl;
                视频元素.preload = 'metadata';
                媒体项.appendChild(视频元素);
            } else {
                const 图片元素 = document.createElement('img');
                图片元素.src = 媒体.previewUrl;
                媒体项.appendChild(图片元素);
            }
            const 复选框 = document.createElement('input');
            复选框.type = 'checkbox';
            复选框.className = 'zero-媒体复选框';
            复选框.checked = true;
            复选框.dataset.downloadUrl = 媒体.downloadUrl;
            复选框.dataset.filename = 媒体.filename;
            复选框.addEventListener('click', (e) => e.stopPropagation());
            媒体项.appendChild(复选框);
            预览区.appendChild(媒体项);
        });
        const 控制区 = document.createElement('div');
        控制区.className = 'zero-控制区';
        const 全选标签 = document.createElement('label');
        全选标签.className = 'zero-全选标签';
        const 全选复选框 = document.createElement('input');
        全选复选框.type = 'checkbox';
        全选复选框.className = 'zero-全选复选框';
        全选复选框.checked = true;
        全选标签.appendChild(全选复选框);
        全选标签.append(` 全选/反选 (${媒体对象列表.length})`);
        const 下载按钮 = document.createElement('button');
        下载按钮.className = 'zero-下载按钮';
        控制区.appendChild(全选标签);
        控制区.appendChild(下载按钮);
        总面板.appendChild(控制区);
        锚点元素.parentNode.insertBefore(总面板, 锚点元素);
        const 更新下载按钮状态 = () => {
            const 选中复选框列表 = 预览区.querySelectorAll('.zero-媒体复选框:checked');
            const 选中数量 = 选中复选框列表.length;
            下载按钮.textContent = `下载选中 (${选中数量})`;
            下载按钮.disabled = 选中数量 === 0;
            全选复选框.checked = 选中数量 > 0 && 选中数量 === 媒体对象列表.length;
            全选复选框.indeterminate = 选中数量 > 0 && 选中数量 < 媒体对象列表.length;
        };
        全选复选框.addEventListener('change', () => {
            预览区.querySelectorAll('.zero-媒体复选框').forEach(cb => { cb.checked = 全选复选框.checked; });
            更新下载按钮状态();
        });
        预览区.querySelectorAll('.zero-媒体复选框').forEach(cb => cb.addEventListener('change', 更新下载按钮状态));
        下载按钮.addEventListener('click', () => {
            const 选中列表 = 预览区.querySelectorAll('.zero-媒体复选框:checked');
            选中列表.forEach((cb, i) => { setTimeout(() => { GM_download({ url: cb.dataset.downloadUrl, name: cb.dataset.filename }); }, i * 200); });
            下载按钮.textContent = '下载任务已启动...';
            下载按钮.disabled = true;
            setTimeout(更新下载按钮状态, 3000);
        });
        更新下载按钮状态();
    }

    // =================================================================================
    // 零号AI核心：内容解析与分发器 (与V4.9一致)
    // =================================================================================
    function 处理解析结果(结果容器) {
        if (document.getElementById(注入面板ID)) return;
        const 媒体链接元素列表 = Array.from(结果容器.querySelectorAll(选择器_媒体链接));
        if (媒体链接元素列表.length === 0) return;
        const 文案元素 = 结果容器.querySelector(选择器_作品文案);
        const 基础文件名 = 文案元素 ? 文案元素.textContent.trim().replace(/[\\?%*:|"<>]/g, '_') : 'SnapAny下载';
        let 媒体对象列表 = [];
        const 主媒体链接元素 = 媒体链接元素列表.find(el => !el.href.includes(图片域名特征) || el.download.match(/\.(mp4|mov|webm|mp3|m4a)$/i));
        if (主媒体链接元素) {
            const 封面图链接元素 = 媒体链接元素列表.find(el => el !== 主媒体链接元素 && (el.href.includes(图片域名特征) || el.download.match(/\.(jpg|jpeg|png|webp)$/i)));
            const 原始文件名 = 主媒体链接元素.download || 'media.file';
            const 文件扩展名 = 原始文件名.includes('.') ? 原始文件名.substring(原始文件名.lastIndexOf('.')) : '.mp4';
            媒体对象列表.push({ type: 'video', previewUrl: 封面图链接元素 ? 封面图链接元素.href : '', downloadUrl: 主媒体链接元素.href, filename: `${基础文件名}${文件扩展名}` });
        } else {
            const 图片URL集合 = new Set(媒体链接元素列表.map(el => el.href));
            let 索引 = 0;
            图片URL集合.forEach(url => {
                媒体对象列表.push({ type: 'image', previewUrl: url, downloadUrl: url, filename: `${基础文件名}_${String(++索引).padStart(2, '0')}.jpg` });
            });
        }
        结果容器.style.display = 'none';
        构建通用媒体面板(结果容器, 媒体对象列表);
    }

    // =================================================================================
    // 零号AI核心：启动入口与DOM监视 (与V4.9一致)
    // =================================================================================
    console.log('[零号AI] SnapAny全能媒体下载器 V5.0 (负边距修正版) 已启动...');
    const 观察器 = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const 结果容器 = document.querySelector(选择器_结果容器);
                if (结果容器 && !document.getElementById(注入面板ID) && window.getComputedStyle(结果容器).display !== 'none') {
                    处理解析结果(结果容器);
                }
            }
        }
    });
    观察器.observe(document.body, { childList: true, subtree: true });

})();
