// ==UserScript==
// @name         TarotChina 增强脚本
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  增加标注牌名称、增加自动重定向VIP
// @author       YourName
// @match        *://www.tarotchina.net/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546554/TarotChina%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546554/TarotChina%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 核心配置 ====================
    // 绝对正确的塔罗牌顺序（严格按网站实际文件命名排序）
    const TAROT_MAP = [
        // 大阿尔卡纳（0-21）
        '愚人', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车',
        '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
        '高塔', '星星', '月亮', '太阳', '审判', '世界',

        // 小阿尔卡纳 - 宝剑（50-63）
        '宝剑1', '宝剑2', '宝剑3', '宝剑4', '宝剑5', '宝剑6',
        '宝剑7', '宝剑8', '宝剑9', '宝剑10',
        '宝剑侍从', '宝剑骑士', '宝剑皇后', '宝剑国王',

        // 小阿尔卡纳 - 权杖（22-35）【宫廷牌→数字牌】
        '权杖1', '权杖2', '权杖3', '权杖4', '权杖5', '权杖6',
        '权杖7', '权杖8', '权杖9', '权杖10',
        '权杖侍从', '权杖骑士', '权杖皇后', '权杖国王',

        // 小阿尔卡纳 - 圣杯（36-49）
        '圣杯1', '圣杯2', '圣杯3', '圣杯4', '圣杯5', '圣杯6',
        '圣杯7', '圣杯8', '圣杯9', '圣杯10',
        '圣杯侍从', '圣杯骑士', '圣杯皇后', '圣杯国王',

        // 小阿尔卡纳 - 星币（64-77）
        '星币1', '星币2', '星币3', '星币4', '星币5', '星币6',
        '星币7', '星币8', '星币9', '星币10',
        '星币侍从', '星币骑士', '星币皇后', '星币国王'
    ];

    // ==================== 样式注入 ====================
    GM_addStyle(`
        .tarot-annotation {
            position: absolute;
            bottom: 8px;
            left: 8px;
            background: rgba(0, 0, 0, 0.85);
            color: #ffeb3b; /* 高对比度黄色 */
            padding: 4px 8px;
            border-radius: 4px;
            font-family: "微软雅黑", "PingFang SC", sans-serif;
            font-size: 12px;
            font-weight: bold;
            pointer-events: none;
            z-index: 999999;
            white-space: nowrap;
            text-shadow: 0 0 2px rgba(0,0,0,0.8);
        }
        .tarot-image-container {
            position: relative !important;
            display: inline-block !important; /* 确保容器包裹图片 */
        }
    `);

    // ==================== 核心功能 ====================
    let isProcessing = false; // 防止重复处理
    let tiaoguo = 0;

    // 精准获取塔罗牌图片的容器（关键改进）
    const getTarotContainers = () => {
        return document.querySelectorAll('.elementor-widget-image');
    };

    // 处理单张图片的标注
    const processImage = (container, img, index) => {
        try {
            // 过滤非塔罗牌图片（根据实际URL特征调整）
            const src = img.src.toLowerCase();
            if (!src.includes('freecompress')) {
                GM_log('跳过非塔罗牌图片:', src);
                tiaoguo += 1;
                return;
            }

            // 验证映射表索引有效性
            if (index >= TAROT_MAP.length) {
                GM_log('索引超出映射表范围:', index);
                return;
            }

            const cardName = TAROT_MAP[index];
            GM_log('处理图片:', src, '→ 牌名:', cardName);

            // 创建/更新标注元素
            let annotation = container.querySelector('.tarot-annotation');
            if (!annotation) {
                annotation = document.createElement('div');
                annotation.className = 'tarot-annotation';
                container.appendChild(annotation);
            }
            annotation.textContent = cardName;

            // 强制更新容器样式（防止动态加载导致的定位问题）
            container.style.position = 'relative';
            container.style.display = 'inline-block';
        } catch (error) {
            GM_log('处理图片时出错:', error);
        }
    };

    // 主处理函数（使用MutationObserver监听DOM变化）
    const processAllTarotImages = () => {
        if (isProcessing) return;
        isProcessing = true;

        GM_log('开始扫描塔罗牌图片...');
        const containers = getTarotContainers();
        GM_log('找到容器数量:', containers.length);

        containers.forEach((container, containerIndex) => {
            const img = container.querySelector('img');
            if (!img) {
                GM_log('容器无图片:', container);
                return;
            }

            // 关键：通过图片在容器中的顺序确定索引（而非全局索引）
            //const allImages = Array.from(getTarotContainers()).map(c => c.querySelector('img'));
            //const imageIndex = allImages.indexOf(img);
            //GM_log(`处理容器 ${containerIndex} → 图片全局索引: ${imageIndex}`);

            //processImage(container, img, imageIndex);
            processImage(container, img, containerIndex - tiaoguo);
        });

        isProcessing = false;
        GM_log('本次处理完成');
    };


    // 初始执行一次（处理首屏内容）
    window.addEventListener('load', () => {
        setTimeout(processAllTarotImages, 100); // 等待首屏完全加载
    });

    // 保留原重定向功能
    // 解析当前URL
    const url = new URL(window.location.href);

    // 检查路径是否包含"vip"（区分大小写）
    if (url.pathname.includes('vip')) {
        // 记录原始路径用于循环检测
        let originalPath = url.pathname;
        // 替换路径中的所有"vip"片段（全局替换）
        let newPath = originalPath.replace(/vip/g, '');

        // 防止无限重定向：仅当新路径与原路径不同时才跳转
        if (newPath !== originalPath) {
            // 更新路径并生成新URL
            url.pathname = newPath;
            const redirectUrl = url.toString();

            // 执行重定向（使用replace避免历史记录冗余）
            window.location.replace(redirectUrl);
        }
    }
    redirectToNonVipUrl();
})();