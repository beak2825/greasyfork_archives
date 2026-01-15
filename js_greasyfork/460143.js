// ==UserScript==
// @name         淘宝详情、天猫详情，主图、主图视频、SKU图一键打包下载，淘宝链接、天猫链接精简
// @version      2026.01.15
// @description  一键打包下载详情、主图、SKU和视频，集成到淘宝侧边栏
// @author       Suren_Chan
// @match        https://detail.tmall.com/*
// @match        https://item.taobao.com/*
// @match        https://chaoshi.detail.tmall.com/*
// @match        https://detail.tmall.hk/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/786427
// @downloadURL https://update.greasyfork.org/scripts/460143/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%EF%BC%8C%E4%B8%BB%E5%9B%BE%E3%80%81%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E3%80%81SKU%E5%9B%BE%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E3%80%81%E5%A4%A9%E7%8C%AB%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/460143/%E6%B7%98%E5%AE%9D%E8%AF%A6%E6%83%85%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AF%A6%E6%83%85%EF%BC%8C%E4%B8%BB%E5%9B%BE%E3%80%81%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E3%80%81SKU%E5%9B%BE%E4%B8%80%E9%94%AE%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E3%80%81%E5%A4%A9%E7%8C%AB%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        MIN_SKU_WIDTH: 700,         // SKU图片最小宽度要求
        MIN_DETAIL_WIDTH: 700,      // 详情图片最小宽度要求
        LONG_IMAGE_WIDTH: 790,      // 长图生成的宽度
        SCROLL_STEP: 500,           // 每次滚动的像素数
        SCROLL_INTERVAL: 100,       // 滚动间隔时间(ms)
        SCROLL_WAIT: 500,           // 滚动完成后的等待时间(ms)
        IMAGE_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp', '.gif']  // 支持的图片格式
    };

    // 状态管理器 - 用于存储和管理商品数据
    class ProductData {
        constructor() {
            this.name = '';            // 商品名称
            this.mainVideo = null;     // 主图视频URL
            this.mainImages = [];      // 主图URL数组
            this.skuImages = [];       // SKU图片URL数组
            this.skuNames = [];        // SKU名称数组，与skuImages一一对应
            this.detailImages = [];    // 详情图片URL数组
            this.zip = new JSZip();    // JSZip实例，用于创建压缩包
            this.hasVideoTabClicked = false;  // 视频标签是否已被点击
        }

        // 重置所有数据
        reset() {
            this.name = '';
            this.mainVideo = null;
            this.mainImages = [];
            this.skuImages = [];
            this.skuNames = [];
            this.detailImages = [];
            this.zip = new JSZip();
        }

        // 获取所有商品数据
        async fetchAll() {
            // 滚动页面以加载所有内容
            await this.scrollAndLoad();
            // 获取商品名称
            this.getName();
            // 获取主图视频
            this.getMainVideo();
            // 获取主图
            this.getMainImages();
            // 获取SKU图片（异步）
            await this.getSKUImages();
            // 获取详情图片
            this.getDetailImages();
        }

        // 获取商品名称
        getName() {
            const title = document.querySelector('title')?.textContent || '';
            // 清理标题中的非法字符
            this.name = title.replace(/\|/g, '_').trim();
            return this.name;
        }

        // 获取主图视频URL
        getMainVideo() {
            const videoSelectors = [
                '#videox-video-el',  // 视频元素ID
                'video[src]',        // 所有带src的video标签
                'video source'       // video标签内的source元素
            ];
            
            // 遍历所有可能的选择器
            for (const selector of videoSelectors) {
                const element = document.querySelector(selector);
                if (element?.src) {
                    this.mainVideo = element.src;
                    break;
                }
            }
            return this.mainVideo;
        }

        // 获取主图
        getMainImages() {
            const selectors = [
                'ul[class*="thumbnails--"] img',  // 缩略图列表
                'div.img-list-wrapper img',       // 图片列表包装器
                '[class*="thumbnailPic--"]'       // 缩略图类名
            ];
            
            const images = new Set();  // 使用Set去重
            
            // 遍历所有选择器查找图片
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(img => {
                    if (img.src) {
                        const cleanUrl = this.cleanImageUrl(img.src);
                        if (cleanUrl) images.add(cleanUrl);
                    }
                });
            });
            
            this.mainImages = Array.from(images);
            return this.mainImages;
        }

        // 获取SKU图片
        async getSKUImages() {
            this.skuImages = [];
            this.skuNames = [];
            
            // 根据HTML结构查找SKU项目
            const skuItems = this.findSkuItems();
            
            if (skuItems.length === 0) {
                console.log('未找到SKU项目');
                return [];
            }
            
            const promises = [];
            
            // 处理每个SKU项目
            skuItems.forEach((item, index) => {
                // 跳过禁用项
                if (item.getAttribute('data-disabled') === 'true' || 
                    item.className.includes('isDisabled')) {
                    return;
                }
                
                // 查找SKU图片
                const img = item.querySelector('[class*="valueItemImg--"]');
                if (!img?.src) return;
                
                // 处理SKU图片
                const promise = this.processSKUImage(img.src, item, index);
                promises.push(promise);
            });
            
            // 等待所有图片处理完成
            await Promise.all(promises);
            console.log(`提取完成，共 ${this.skuImages.length} 个符合条件的SKU`);
            return this.skuImages;
        }

        // 查找SKU项目
        findSkuItems() {
            // 根据HTML结构查找SKU项目
            const selectors = [
                '[class*="valueItem--"]',      // SKU值项
                '[class*="valueItemBig--"]',   // 大SKU项
                'div[class*="sku-item"]',      // SKU项目div
                'li[class*="spec-item"]'       // 规格项
            ];
            
            const skuItems = [];
            const seen = new Set();  // 用于去重
            
            selectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(item => {
                        if (!seen.has(item)) {
                            seen.add(item);
                            
                            // 检查是否包含图片
                            const hasImg = item.className.includes('hasImg') ||
                                         item.querySelector('[class*="valueItemImg--"]') ||
                                         item.querySelector('img');
                                         
                            if (hasImg) {
                                skuItems.push(item);
                            }
                        }
                    });
                } catch (e) {
                    console.warn(`选择器 ${selector} 查询失败:`, e);
                }
            });
            
            return skuItems;
        }

        // 处理单个SKU图片
        async processSKUImage(src, item, index) {
            return new Promise(resolve => {
                const imgUrl = this.cleanImageUrl(src, true);
                if (!imgUrl) {
                    resolve();
                    return;
                }
                
                // 创建Image对象以获取图片尺寸
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = imgUrl;
                
                // 图片加载完成
                img.onload = () => {
                    // 检查图片宽度是否符合要求
                    if (img.width >= CONFIG.MIN_SKU_WIDTH) {
                        // 查找SKU名称
                        const textElement = item.querySelector('[class*="valueItemText--"]');
                        let name = textElement?.title || textElement?.textContent || `SKU_${index}`;
                        name = this.sanitizeFileName(name);
                        
                        // 添加到数组
                        this.skuImages.push(imgUrl);
                        this.skuNames.push(name);
                        
                        console.log(`添加SKU: ${name} - ${img.width}×${img.height}像素`);
                    } else {
                        console.log(`跳过SKU: 宽度 ${img.width}像素 < ${CONFIG.MIN_SKU_WIDTH}像素`);
                    }
                    resolve();
                };
                
                // 图片加载失败
                img.onerror = () => {
                    console.warn(`SKU图片加载失败: ${imgUrl}`);
                    resolve();
                };
                
                // 设置超时
                setTimeout(() => {
                    if (!img.complete) {
                        console.warn(`SKU图片加载超时: ${imgUrl}`);
                        resolve();
                    }
                }, 5000);
            });
        }

        // 获取详情图片
        getDetailImages() {
            // 根据HTML结构查找详情容器
            const detailSelectors = [
                '.desc-root',           // 描述根元素
                '.content-detail',      // 内容详情
                '[class*="desc-"]',     // 描述相关类
                '[class*="detail-"]'    // 详情相关类
            ];
            
            // 查找详情内容区域
            let contentDiv = null;
            for (const selector of detailSelectors) {
                contentDiv = document.querySelector(selector);
                if (contentDiv) break;
            }
            
            if (!contentDiv) {
                console.log('未找到详情内容区域');
                this.detailImages = [];
                return this.detailImages;
            }
            
            // 收集详情图片
            const images = new Set();
            contentDiv.querySelectorAll('img').forEach(img => {
                if (img.src && img.width >= CONFIG.MIN_DETAIL_WIDTH) {
                    const cleanUrl = img.src.split('?')[0];
                    if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        images.add(cleanUrl);
                    }
                }
            });
            
            this.detailImages = Array.from(images);
            console.log(`找到 ${this.detailImages.length} 张详情图片`);
            return this.detailImages;
        }

        // 清理图片URL，去除尺寸参数等
        cleanImageUrl(url, keepFirstExtensionOnly = false) {
            if (!url) return '';
            
            let cleaned = url.replace(/_[^_]*$/, '')
                            .replace(/(_\d+x\d+\.\w+)|(_q\d+\.\w+)/gi, '')
                            .replace(/_[^\.]*$/, '');
            
            // 如果只需要第一个扩展名
            if (keepFirstExtensionOnly) {
                for (const ext of CONFIG.IMAGE_EXTENSIONS) {
                    const extIndex = cleaned.indexOf(ext);
                    if (extIndex !== -1) {
                        cleaned = cleaned.substring(0, extIndex + ext.length);
                        break;
                    }
                }
            }
            
            // 确保URL有扩展名
            if (cleaned && !cleaned.match(/\.\w+$/i)) {
                cleaned += '.jpg';
            }
            
            return cleaned;
        }

        // 清理文件名，移除非法字符
        sanitizeFileName(name) {
            return name.replace(/[<>:"/\\|?*]/g, '_')
                       .replace(/\s+/g, '_')
                       .trim()
                       .substring(0, 100);
        }

        // 滚动页面以加载所有内容
        async scrollAndLoad() {
            return new Promise(resolve => {
                const step = CONFIG.SCROLL_STEP;
                const interval = CONFIG.SCROLL_INTERVAL;
                let currentScroll = 0;
                
                // 主页面滚动
                const scrollMainPage = () => {
                    const scrollInterval = setInterval(() => {
                        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                        
                        if (scrollHeight <= clientHeight) {
                            clearInterval(scrollInterval);
                            // 主页面滚动完成后，滚动指定的div
                            scrollTargetDiv().then(resolve);
                            return;
                        }
                        
                        currentScroll += step;
                        if (currentScroll < scrollHeight - clientHeight) {
                            window.scrollTo(0, currentScroll);
                        } else {
                            clearInterval(scrollInterval);
                            // 滚动回顶部
                            setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                // 主页面滚动完成后，滚动指定的div
                                scrollTargetDiv().then(resolve);
                            }, 100);
                        }
                    }, interval);
                };

                // 滚动指定的SKU面板div
                async function scrollTargetDiv() {
                    return new Promise(resolveDiv => {
                        // 查找需要滚动的div
                        const targetDiv = document.getElementById('tbpcDetail_SkuPanelBody');
                        if (!targetDiv) {
                            console.log('未找到需要滚动的SKU面板div');
                            resolveDiv();
                            return;
                        }

                        console.log('开始滚动SKU面板div');
                        let divScrollTop = 0;
                        const divScrollStep = 200; // 每次滚动200像素
                        
                        const divScrollInterval = setInterval(() => {
                            const divScrollHeight = targetDiv.scrollHeight;
                            const divClientHeight = targetDiv.clientHeight;
                            
                            // 如果已经滚动到底部或div不需要滚动
                            if (divScrollHeight <= divClientHeight || 
                                divScrollTop >= divScrollHeight - divClientHeight) {
                                clearInterval(divScrollInterval);
                                // 等待一段时间让内容完全加载
                                setTimeout(() => {
                                    console.log('SKU面板div滚动完成');
                                    resolveDiv();
                                }, CONFIG.SCROLL_WAIT);
                                return;
                            }
                            
                            // 滚动div
                            divScrollTop += divScrollStep;
                            targetDiv.scrollTop = divScrollTop;
                        }, 50); // 较快的滚动间隔
                    });
                }

                // 开始滚动主页面
                scrollMainPage();
            });
        }

        // 创建详情长图
        async createLongImage() {
            if (this.detailImages.length === 0) return null;
            
            const canvas = document.createElement('canvas');
            canvas.width = CONFIG.LONG_IMAGE_WIDTH;
            
            const imageBitmaps = [];
            let totalHeight = 0;
            
            try {
                // 加载所有详情图片
                for (const imgSrc of this.detailImages) {
                    try {
                        const response = await Utils.fetchWithRetry(imgSrc);
                        const blob = await response.blob();
                        const imageBitmap = await createImageBitmap(blob);
                        imageBitmaps.push(imageBitmap);
                        // 计算等比缩放后的高度
                        totalHeight += imageBitmap.height * (CONFIG.LONG_IMAGE_WIDTH / imageBitmap.width);
                    } catch (error) {
                        console.warn(`图片加载失败 ${imgSrc}:`, error);
                        continue;
                    }
                }
                
                if (imageBitmaps.length === 0) {
                    console.warn('没有图片成功加载');
                    return null;
                }
                
                // 设置canvas高度
                canvas.height = totalHeight;
                const ctx = canvas.getContext('2d');
                let currentY = 0;
                
                // 绘制所有图片
                for (const img of imageBitmaps) {
                    const height = img.height * (CONFIG.LONG_IMAGE_WIDTH / img.width);
                    ctx.drawImage(img, 0, currentY, CONFIG.LONG_IMAGE_WIDTH, height);
                    currentY += height;
                }
                
                // 返回图片blob
                return new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/png');
                });
            } catch (error) {
                console.error('创建长图失败:', error);
                return null;
            }
        }
    }

    // 烟花效果类
    class Fireworks {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
            this.isActive = false;
        }

        // 显示烟花
        show() {
            if (this.isActive) return;
            this.isActive = true;
            
            // 创建全屏canvas
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
                pointer-events: none;
                background: transparent;
            `;
            document.body.appendChild(this.canvas);
            
            // 设置canvas尺寸
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            
            // 获取上下文
            this.ctx = this.canvas.getContext('2d');
            
            // 创建多个烟花
            for (let i = 0; i < 5; i++) {
                setTimeout(() => this.createFirework(), i * 300);
            }
            
            // 开始动画
            this.animate();
            
            // 10秒后自动移除
            setTimeout(() => this.hide(), 10000);
        }

        // 调整canvas尺寸
        resizeCanvas() {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        }

        // 创建烟花
        createFirework() {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.5;
            const colors = [
                '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
                '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
                '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
                '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
            ];
            
            // 创建爆炸粒子
            const particleCount = 150 + Math.random() * 100;
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: x,
                    y: y,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 5 + 2,
                    angle: Math.random() * Math.PI * 2,
                    friction: 0.95,
                    gravity: 0.2,
                    opacity: 1,
                    decay: Math.random() * 0.02 + 0.005,
                    spark: Math.random() > 0.5
                });
            }
        }

        // 动画循环
        animate() {
            if (!this.isActive) return;
            
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 更新和绘制粒子
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // 更新位置
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed + p.gravity;
                
                // 应用摩擦力和重力
                p.speed *= p.friction;
                p.gravity += 0.05;
                p.opacity -= p.decay;
                
                // 绘制粒子
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fillStyle = p.color;
                
                if (p.spark) {
                    // 绘制星形火花
                    this.ctx.beginPath();
                    for (let j = 0; j < 5; j++) {
                        this.ctx.lineTo(
                            p.x + Math.cos(j * Math.PI * 0.4) * p.radius,
                            p.y + Math.sin(j * Math.PI * 0.4) * p.radius
                        );
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                } else {
                    // 绘制圆形粒子
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // 移除透明度为0的粒子
                if (p.opacity <= 0) {
                    this.particles.splice(i, 1);
                }
            }
            
            // 如果还有粒子，继续动画
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(() => this.animate());
            } else {
                this.hide();
            }
        }

        // 隐藏烟花
        hide() {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            this.particles = [];
        }
    }

    // 进度面板类
    class ProgressPanel {
        constructor() {
            this.container = null;
            this.videoCount = 0;
            this.mainImageCount = 0;
            this.skuCount = 0;
            this.detailCount = 0;
            this.operationLog = [];
        }

        // 创建进度面板
        create() {
            if (this.container) {
                this.show();
                return;
            }

            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
                z-index: 99998;
                font-family: 'Microsoft YaHei', sans-serif;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
                display: none;
            `;

            // 创建头部
            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px 30px;
                position: relative;
            `;

            const title = document.createElement('h2');
            title.textContent = '商品资源下载器';
            title.style.cssText = `
                margin: 0;
                font-size: 24px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            `;
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
                closeBtn.style.transform = 'rotate(90deg)';
            });
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                closeBtn.style.transform = 'rotate(0deg)';
            });
            closeBtn.addEventListener('click', () => this.hide());

            // 统计数据
            const stats = this.createStatsPanel();
            
            header.appendChild(title);
            header.appendChild(closeBtn);
            header.appendChild(stats);

            // 创建进度条
            const progressSection = document.createElement('div');
            progressSection.style.cssText = `
                padding: 30px;
            `;

            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 20px;
                background: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
                margin-top: 10px;
            `;

            this.progressFill = document.createElement('div');
            this.progressFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                transition: width 0.3s ease;
                position: relative;
            `;

            this.progressText = document.createElement('div');
            this.progressText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            `;
            this.progressText.textContent = '0.00%';

            // 创建操作日志
            const logSection = document.createElement('div');
            logSection.style.cssText = `
                padding: 0 30px 30px;
            `;

            const logTitle = document.createElement('h3');
            logTitle.textContent = '操作日志';
            logTitle.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
                font-size: 16px;
            `;

            this.logContainer = document.createElement('div');
            this.logContainer.style.cssText = `
                height: 150px;
                overflow-y: auto;
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                font-size: 13px;
                color: #666;
                line-height: 1.5;
                border: 1px solid #eaeaea;
            `;

            // 组装所有部件
            progressBar.appendChild(this.progressFill);
            progressBar.appendChild(this.progressText);
            
            progressSection.innerHTML = '<div style="color: #666; margin-bottom: 10px;">下载进度</div>';
            progressSection.appendChild(progressBar);
            
            logSection.appendChild(logTitle);
            logSection.appendChild(this.logContainer);

            this.container.appendChild(header);
            this.container.appendChild(progressSection);
            this.container.appendChild(logSection);

            document.body.appendChild(this.container);
            this.show();
        }

        // 创建统计数据面板
        createStatsPanel() {
            const stats = document.createElement('div');
            stats.style.cssText = `
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-top: 20px;
            `;

            const statItems = [
                { id: 'video-stat', icon: '🎥', label: '视频' },
                { id: 'main-stat', icon: '🖼️', label: '主图' },
                { id: 'sku-stat', icon: '🎨', label: 'SKU' },
                { id: 'detail-stat', icon: '📋', label: '详情' }
            ];

            statItems.forEach(item => {
                const stat = document.createElement('div');
                stat.id = item.id;
                stat.style.cssText = `
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    backdrop-filter: blur(5px);
                `;

                const icon = document.createElement('div');
                icon.textContent = item.icon;
                icon.style.cssText = `
                    font-size: 24px;
                    margin-bottom: 5px;
                `;

                const count = document.createElement('div');
                count.className = 'stat-count';
                count.textContent = '0';
                count.style.cssText = `
                    font-size: 28px;
                    font-weight: bold;
                    margin: 5px 0;
                `;

                const label = document.createElement('div');
                label.textContent = item.label;
                label.style.cssText = `
                    font-size: 14px;
                    opacity: 0.9;
                `;

                stat.appendChild(icon);
                stat.appendChild(count);
                stat.appendChild(label);
                stats.appendChild(stat);
            });

            return stats;
        }

        // 更新统计数据
        updateStats(video = 0, main = 0, sku = 0, detail = 0) {
            this.videoCount = video;
            this.mainImageCount = main;
            this.skuCount = sku;
            this.detailCount = detail;

            const elements = {
                'video-stat': video,
                'main-stat': main,
                'sku-stat': sku,
                'detail-stat': detail
            };

            Object.entries(elements).forEach(([id, count]) => {
                const element = document.getElementById(id);
                if (element) {
                    const countElement = element.querySelector('.stat-count');
                    if (countElement) {
                        countElement.textContent = count;
                        
                        // 添加动画效果
                        countElement.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            countElement.style.transform = 'scale(1)';
                        }, 300);
                    }
                }
            });
        }

        // 更新进度
        updateProgress(percentage, text = null) {
            if (!this.progressFill) return;
            
            const percent = Math.min(100, Math.max(0, percentage));
            this.progressFill.style.width = `${percent}%`;
            this.progressText.textContent = `${percent.toFixed(2)}%`;
            
            if (text) {
                this.addLog(text);
            }
        }

        // 添加日志
        addLog(message) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                margin-bottom: 5px;
                padding: 5px 0;
                border-bottom: 1px dashed #eee;
                animation: fadeIn 0.3s;
            `;
            
            logEntry.innerHTML = `<span style="color: #888; margin-right: 10px;">${timestamp}</span>${message}`;
            
            this.operationLog.push(message);
            this.logContainer.appendChild(logEntry);
            
            // 自动滚动到底部
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
            
            // 添加CSS动画
            if (!document.querySelector('#log-animation')) {
                const style = document.createElement('style');
                style.id = 'log-animation';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // 显示面板
        show() {
            if (this.container) {
                this.container.style.display = 'block';
            }
        }

        // 隐藏面板
        hide() {
            if (this.container) {
                this.container.style.display = 'none';
            }
        }

        // 重置面板
        reset() {
            this.updateStats(0, 0, 0, 0);
            this.updateProgress(0, '准备开始下载...');
            this.operationLog = [];
            if (this.logContainer) {
                this.logContainer.innerHTML = '';
            }
        }
    }

    // 工具函数类
    class Utils {
        // 清理URL，移除多余参数
        static cleanUrl() {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            const offerId = params.get('offerId');
            let simplifiedUrl;
            
            if (offerId) {
                simplifiedUrl = `${window.location.origin}/offer/${offerId}.html`;
            } else if (id) {
                simplifiedUrl = `${window.location.origin}/item.htm?id=${id}`;
            } else {
                const currentPath = window.location.pathname;
                const pathWithoutExtension = currentPath.substring(0, currentPath.lastIndexOf('.'));
                simplifiedUrl = pathWithoutExtension ? `${pathWithoutExtension}.html` : window.location.href;
            }
            
            // 更新URL但不刷新页面
            if (simplifiedUrl && simplifiedUrl !== window.location.href) {
                window.history.replaceState({}, '', simplifiedUrl);
            }
        }

        // 激活视频标签
        static activateVideoTab() {
            // 查找视频标签
            const videoTabs = document.querySelectorAll('[class*="switchTabsItem--"]');
            for (const tab of videoTabs) {
                const text = tab.textContent?.trim() || '';
                if (text === '视频' && 
                    !tab.className.includes('switchTabsItemSelect')) {
                    tab.click();
                    return true;
                }
            }
            return false;
        }

        // 带重试的fetch请求
        static async fetchWithRetry(url, retries = 2) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url);
                    if (response.ok) return response;
                    
                    if (i === retries - 1) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                } catch (error) {
                    if (i === retries - 1) throw error;
                    // 指数退避
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
            throw new Error(`Failed to fetch ${url} after ${retries} retries`);
        }
    }

    // UI管理器 - 负责创建和管理用户界面
    class UIManager {
        constructor() {
            this.progressContainer = null;  // 进度条容器
            this.progressFill = null;       // 进度条填充部分
            this.progressText = null;       // 进度文本
            this.sidebarContainer = null;   // 侧边栏容器
        }

        // 创建下载按钮
        createDownloadButtons() {
            // 首先尝试注入到淘宝侧边栏
            if (this.injectToToolbar()) {
                return;
            }
            
            // 如果注入失败，创建独立的按钮容器
            const container = document.createElement('div');
            container.id = 'download-buttons-container';
            container.style.cssText = `
                position: fixed;
                width: 56px;
                height: 200px;
                background-color: #fff;
                right: 0px;
                top: 200px;
                z-index: 9999;
                border-radius: 18px 0 0 18px;
                box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 8px 0;
            `;
            
            const buttons = [
                {
                    id: 'download-all',
                    text: '打包',
                    icon: this.getPackageIcon(),
                    onClick: () => downloadAll()
                },
                {
                    id: 'download-video',
                    text: '视频',
                    icon: this.getVideoIcon(),
                    onClick: () => downloadVideo()
                },
                {
                    id: 'download-long',
                    text: '长版',
                    icon: this.getLongIcon(),
                    onClick: () => downloadLongImage()
                }
            ];
            
            // 创建所有按钮
            buttons.forEach(buttonInfo => {
                const button = this.createButton(buttonInfo);
                container.appendChild(button);
            });
            
            document.body.appendChild(container);
        }

        // 注入到淘宝工具栏
        injectToToolbar() {
            try {
                const toolbar = document.querySelector('.tb-toolkit-new, .tb-toolkit-list-new');
                if (!toolbar) {
                    console.log('未找到淘宝工具栏，使用独立按钮');
                    return false;
                }

                // 创建下载按钮项
                const downloadButtons = [
                    { id: 'download-all', text: '打包下载', icon: '📦' },
                    { id: 'download-video', text: '下载视频', icon: '🎥' },
                    { id: 'download-long', text: '下载长图', icon: '🖼️' }
                ];

                // 插入到工具栏最前面
                downloadButtons.forEach((btn, index) => {
                    const item = document.createElement('div');
                    item.className = 'toolkit-item-new toolkit-item-link';
                    item.setAttribute('data-name', btn.id);
                    item.setAttribute('data-label', btn.text);
                    item.style.order = -index; // 确保在最前面
                    
                    item.innerHTML = `
                        <a href="javascript:void(0)" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                            <i class="toolkit-icon" style="background-image: none; font-size: 24px; line-height: 1;">${btn.icon}</i>
                            <span class="toolkit-label" style="font-size: 12px; margin-top: 4px;">${btn.text}</span>
                        </a>
                    `;
                    
                    // 添加点击事件
                    const link = item.querySelector('a');
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        switch(btn.id) {
                            case 'download-all':
                                downloadAll();
                                break;
                            case 'download-video':
                                downloadVideo();
                                break;
                            case 'download-long':
                                downloadLongImage();
                                break;
                        }
                    });

                    // 插入到工具栏开始位置
                    if (index === 0) {
                        toolbar.insertBefore(item, toolbar.firstChild);
                    } else {
                        const firstItem = toolbar.querySelector('.toolkit-item-new');
                        if (firstItem) {
                            toolbar.insertBefore(item, firstItem);
                        } else {
                            toolbar.appendChild(item);
                        }
                    }
                });

                console.log('成功注入到淘宝工具栏');
                return true;
            } catch (error) {
                console.warn('注入到工具栏失败:', error);
                return false;
            }
        }

        // 创建单个按钮
        createButton({ id, text, icon, onClick }) {
            const button = document.createElement('div');
            button.id = id;
            button.style.cssText = `
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #2196F3;
                font-size: 14px;
                font-family: '微软雅黑';
                text-align: center;
                margin: 4px 0;
                user-select: none;
                transition: transform 0.2s;
            `;
            
            button.innerHTML = `
                ${icon}
                <p style="margin-top: 4px;">${text}</p>
            `;
            
            // 绑定事件
            button.addEventListener('click', onClick);
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
            
            return button;
        }

        // 创建进度条
        createProgressBar() {
            if (this.progressContainer) {
                this.progressContainer.style.display = 'block';
                return;
            }
            
            this.progressContainer = document.createElement('div');
            this.progressContainer.style.cssText = `
                position: fixed;
                width: 500px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 255, 255, 0.95);
                padding: 20px;
                border-radius: 20px;
                z-index: 10000;
                border: 2px solid #666;
                box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
                display: none;
            `;
            
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 20px;
                background-color: #eee;
                position: relative;
                border-radius: 10px;
                border: 2px solid white;
                overflow: hidden;
            `;
            
            // 进度填充部分
            this.progressFill = document.createElement('div');
            this.progressFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #2196F3, #21CBF3);
                border-radius: 10px;
                transition: width 0.3s ease;
            `;
            
            // 进度文本
            this.progressText = document.createElement('div');
            this.progressText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #2196F3;
                font-family: '微软雅黑';
                font-weight: 600;
                font-size: 16px;
                text-shadow: 1px 1px 2px white;
            `;
            this.progressText.textContent = '正在下载...';
            
            progressBar.appendChild(this.progressFill);
            progressBar.appendChild(this.progressText);
            this.progressContainer.appendChild(progressBar);
            document.body.appendChild(this.progressContainer);
        }

        // 更新进度
        updateProgress(percentage, text = null) {
            if (this.progressFill) {
                this.progressFill.style.width = `${Math.min(100, percentage)}%`;
            }
            if (text && this.progressText) {
                this.progressText.textContent = text;
            }
        }

        // 隐藏进度条
        hideProgress() {
            if (this.progressContainer) {
                this.progressContainer.style.display = 'none';
            }
        }

        // 显示警告框
        showAlert(message) {
            alert(message);
        }

        // 打包图标
        getPackageIcon() {
            return `<svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M423.59 868.83c-81.81 0.13-163.63 0.46-245.44 0.27-28.08-0.06-52-20.51-51.11-52.68 1.48-55.13 0.43-110.33 0.36-165.5 0-6.06-0.54-12.12-0.82-18.17 5.39-4.18 11.71-2.43 17.62-2.46q112.14-0.42 224.29-0.55c18.05 4.46 36.41 1.39 54.61 2.18zM898.46 630.74v183.73c0 33.56-18.76 54.27-52.27 54.51-80.87 0.6-161.74 0-242.62-0.15V632.77c17.58-2.69 35.58 1.94 53-3 12.11 0.15 24.22 0.41 36.34 0.45q102.79 0.29 205.55 0.52z" fill="#7DCE3B"></path><path d="M127.18 393.53q0-91.95 0.08-183.89c0.06-33.8 18.77-52.52 53-52.59q121.41-0.23 242.84-0.06 0.11 118.72 0.2 237.43-144.62 0.12-289.25 0.2c-2.3 0-4.59-0.71-6.87-1.09zM604 157h237.63c38.71 0 56.71 18.06 56.67 56.71q-0.08 90-0.28 180a71.38 71.38 0 0 1-8.32 1q-142.95-0.06-285.91-0.23z" fill="#55C6F6"></path><path d="M603.56 632.77v236.06H423.59q-0.24-118.46-0.49-236.91c2.43-35 0.68-70.07 0.91-105.11 0.06-9 1.67-13.52 12.2-13.43q76.44 0.69 152.9 0c9.38-0.07 11.91 3.25 11.79 12.19-0.43 30.85-0.24 61.72-0.09 92.58 0.03 4.97-1.71 10.44 2.75 14.62z" fill="#FCAF43"></path></svg>`;
        }

        // 视频图标
        getVideoIcon() {
            return `<svg viewBox="0 0 1119 1024" width="24" height="24"><path d="M1017.090227 295.25786c-10.599114-5.396878-22.038724-5.197812-29.678402 0.663551-33.686248 25.807691-69.433926 53.084041-106.530823 81.395529a2075.873545 2075.873545 0 0 0-17.982219-167.705756c-2.393206-15.836739-16.743591-29.722639-31.792917-30.877218C599.093217 161.229504 367.076144 166.161896 135.063495 193.526719c-15.044902 1.809281-30.483511 15.593437-34.079954 30.656034-45.227603 191.87669-45.227603 383.75338 0 575.63007 3.596444 15.062597 19.035052 28.851176 34.079954 30.660458 232.012649 27.369247 464.029722 32.297215 696.042371 14.797176 15.044902-1.159002 29.399711-15.040478 31.792917-30.877217a2075.869122 2075.869122 0 0 0 17.982219-167.696909c37.096897 28.307065 72.844575 55.583415 106.530823 81.386682 7.644102 5.861363 19.074865 6.069275 29.678402 0.667974 10.59469-5.405725 18.482094-15.407643 20.114428-25.82981 19.902092-127.277836 19.902092-254.560095 0-381.837931-1.632334-10.417743-9.524162-20.419661-20.114428-25.825386z" fill="#9094D1"></path><path d="M359.210859 364.912969c1.344796-28.72289 21.530002-40.193466 44.891404-25.117598 72.349124 46.545857 148.153135 95.303548 224.054466 143.71177 24.639842 15.708452 24.639842 41.272842 0 56.976871-75.905755 48.417069-151.709766 97.179185-224.054466 143.729465-23.365825 15.071444-43.546608 3.600867-44.891404-25.117599a3412.281974 3412.281974 0 0 1 0-294.182909z" fill="#D3D4ED"></path></svg>`;
        }

        // 长图图标
        getLongIcon() {
            return `<svg viewBox="0 0 1086 1024" width="24" height="24"><path d="M900.43416 917.897521c0.048485-0.110193 0.079339-0.224793 0.123416-0.330579 0.498072-1.190083 0.978512-2.393388 1.38843-3.640771a2762.671074 2762.671074 0 0 0 141.342148-844.535537c0.25124-24.46281-16.581818-44.169697-37.117355-43.988981l-606.078237 3.517355c-20.54876 0.180716-37.082094 15.202204-37.276033 33.525069a2082.058402 2082.058402 0 0 1-60.614876 477.78292c-0.603857 2.446281-1.216529 4.883747-1.829201 7.32562a2060.751515 2060.751515 0 0 1-8.930028 34.48595l-0.740496 2.697521a2093.443526 2093.443526 0 0 1-9.128374 32.634711c-0.652342 2.269972-1.295868 4.535537-1.957025 6.80551a2123.415978 2123.415978 0 0 1-10.018733 33.313498c-0.727273 2.336088-1.467769 4.676584-2.199449 7.012672a2058.653444 2058.653444 0 0 1-11.094215 34.433058c-5.769697 17.317906 4.998347 36.848485 24.36584 43.711295l571.918458 200.630303a31.444628 31.444628 0 0 0 5.906336 1.419284 32.678788 32.678788 0 0 0 10.195041-0.09697l0.793389-0.141047a36.949862 36.949862 0 0 0 10.89146-3.944903 42.574105 42.574105 0 0 0 9.56033-7.136089 47.360882 47.360882 0 0 0 7.316805-9.335537l0.484848-0.815427c0.987328-1.705785 1.899725-3.468871 2.697521-5.328925z" fill="#A5E0C9"></path></svg>`;
        }
    }

    // 全局实例
    const productData = new ProductData();
    const uiManager = new UIManager();
    const progressPanel = new ProgressPanel();
    const fireworks = new Fireworks();

    // 下载所有内容
    async function downloadAll() {
        try {
            // 显示进度面板
            progressPanel.reset();
            progressPanel.create();
            progressPanel.addLog('开始采集商品数据...');
            
            // 显示旧的进度条
            uiManager.createProgressBar();
            uiManager.updateProgress(5, '准备中...');
            
            // 重置并获取数据
            productData.reset();
            await productData.fetchAll();
            
            // 更新统计数据
            progressPanel.updateStats(
                productData.mainVideo ? 1 : 0,
                productData.mainImages.length,
                productData.skuImages.length,
                productData.detailImages.length
            );
            
            progressPanel.addLog(`商品名称: ${productData.name}`);
            progressPanel.addLog(`找到 ${productData.mainVideo ? 1 : 0} 个视频`);
            progressPanel.addLog(`找到 ${productData.mainImages.length} 张主图`);
            progressPanel.addLog(`找到 ${productData.skuImages.length} 个SKU图片`);
            progressPanel.addLog(`找到 ${productData.detailImages.length} 张详情图片`);
            
            // 确保有商品名称
            if (!productData.name) {
                productData.getName();
                if (!productData.name) {
                    productData.name = '未命名商品';
                }
            }
            
            // 计算总文件数
            const totalFiles = 
                (productData.mainVideo ? 1 : 0) + 
                productData.mainImages.length + 
                productData.skuImages.length + 
                productData.detailImages.length;
            
            progressPanel.addLog(`开始下载 ${totalFiles} 个文件...`);
            
            let processedFiles = 0;
            
            // 处理主视频
            uiManager.updateProgress(15, '处理主视频...');
            progressPanel.updateProgress(15, '处理主视频...');
            if (productData.mainVideo) {
                try {
                    const response = await Utils.fetchWithRetry(productData.mainVideo);
                    const videoBlob = await response.blob();
                    productData.zip.folder("主图").file("主图视频.mp4", videoBlob);
                    processedFiles++;
                    progressPanel.addLog('主视频下载成功');
                } catch (error) {
                    console.warn('主视频下载失败:', error);
                    progressPanel.addLog(`主视频下载失败: ${error.message}`);
                }
            }
            
            // 下载主图
            uiManager.updateProgress(30, '下载主图...');
            progressPanel.updateProgress(30, '下载主图...');
            const mainImageFolder = productData.zip.folder("主图");
            for (let i = 0; i < productData.mainImages.length; i++) {
                try {
                    const response = await Utils.fetchWithRetry(productData.mainImages[i]);
                    const blob = await response.blob();
                    const ext = productData.mainImages[i].split('.').pop() || 'jpg';
                    mainImageFolder.file(`主图${i + 1}.${ext}`, blob);
                    processedFiles++;
                    progressPanel.addLog(`主图${i + 1}下载成功`);
                } catch (error) {
                    console.warn(`主图${i + 1}下载失败:`, error);
                    progressPanel.addLog(`主图${i + 1}下载失败: ${error.message}`);
                }
                
                // 更新进度
                const progress = 30 + (45 - 30) * (i + 1) / Math.max(productData.mainImages.length, 1);
                uiManager.updateProgress(progress);
                progressPanel.updateProgress(progress);
            }
            
            // 下载SKU图片
            uiManager.updateProgress(45, '下载SKU图片...');
            progressPanel.updateProgress(45, '下载SKU图片...');
            if (productData.skuImages.length > 0) {
                const skuFolder = productData.zip.folder("SKU");
                for (let i = 0; i < productData.skuImages.length; i++) {
                    try {
                        const response = await Utils.fetchWithRetry(productData.skuImages[i]);
                        const blob = await response.blob();
                        const fileName = `${productData.skuNames[i] || `SKU_${i+1}`}.${productData.skuImages[i].split('.').pop()}`;
                        skuFolder.file(fileName, blob);
                        processedFiles++;
                        progressPanel.addLog(`SKU图片${productData.skuNames[i] || i+1}下载成功`);
                    } catch (error) {
                        console.warn(`SKU图片${i + 1}下载失败:`, error);
                        progressPanel.addLog(`SKU图片${i + 1}下载失败: ${error.message}`);
                    }
                    
                    // 更新进度
                    const progress = 45 + (60 - 45) * (i + 1) / Math.max(productData.skuImages.length, 1);
                    uiManager.updateProgress(progress);
                    progressPanel.updateProgress(progress);
                }
            }
            
            // 下载详情图片
            uiManager.updateProgress(60, '下载详情图片...');
            progressPanel.updateProgress(60, '下载详情图片...');
            if (productData.detailImages.length > 0) {
                const slicesFolder = productData.zip.folder("切片");
                for (let i = 0; i < productData.detailImages.length; i++) {
                    try {
                        const response = await Utils.fetchWithRetry(productData.detailImages[i]);
                        const blob = await response.blob();
                        // 使用三位数编号
                        const paddedIndex = (i + 1).toString().padStart(3, '0');
                        const ext = productData.detailImages[i].split('.').pop() || 'jpg';
                        slicesFolder.file(`image${paddedIndex}.${ext}`, blob);
                        processedFiles++;
                        progressPanel.addLog(`详情图片${i + 1}下载成功`);
                    } catch (error) {
                        console.warn(`详情图片${i + 1}下载失败:`, error);
                        progressPanel.addLog(`详情图片${i + 1}下载失败: ${error.message}`);
                    }
                    
                    // 更新进度
                    const progress = 60 + (80 - 60) * (i + 1) / Math.max(productData.detailImages.length, 1);
                    uiManager.updateProgress(progress);
                    progressPanel.updateProgress(progress);
                }
            }
            
            // 生成长图
            uiManager.updateProgress(80, '生成长图...');
            progressPanel.updateProgress(80, '生成长图...');
            const longImageBlob = await productData.createLongImage();
            if (longImageBlob) {
                productData.zip.file(`${productData.name}.png`, longImageBlob);
                progressPanel.addLog('长图生成成功');
            } else {
                progressPanel.addLog('长图生成失败');
            }
            
            // 生成压缩包
            uiManager.updateProgress(90, '生成压缩包...');
            progressPanel.updateProgress(90, '生成压缩包...');
            const zipBlob = await productData.zip.generateAsync({ 
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 }
            });
            
            // 保存文件
            uiManager.updateProgress(95, '保存文件...');
            progressPanel.updateProgress(95, '保存文件...');
            saveAs(zipBlob, `${productData.name}.zip`);
            
            // 完成
            uiManager.updateProgress(100, '下载完成！');
            progressPanel.updateProgress(100, '下载完成！');
            progressPanel.addLog(`下载完成！共成功下载 ${processedFiles}/${totalFiles} 个文件`);
            
            // 显示烟花
            setTimeout(() => {
                fireworks.show();
                setTimeout(() => {
                    uiManager.hideProgress();
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('下载失败:', error);
            uiManager.showAlert(`下载失败: ${error.message}`);
            progressPanel.addLog(`下载失败: ${error.message}`);
            uiManager.hideProgress();
        }
    }

    // 仅下载视频
    async function downloadVideo() {
        try {
            // 显示进度面板
            progressPanel.reset();
            progressPanel.create();
            progressPanel.addLog('开始下载视频...');
            
            // 重置数据并获取视频信息
            productData.reset();
            productData.getName();
            productData.getMainVideo();
            
            if (!productData.mainVideo) {
                progressPanel.addLog('没有找到主图视频');
                uiManager.showAlert('没有找到主图视频');
                return;
            }
            
            progressPanel.updateStats(1, 0, 0, 0);
            progressPanel.addLog(`找到视频: ${productData.mainVideo}`);
            
            // 显示进度条
            uiManager.createProgressBar();
            uiManager.updateProgress(50, '下载视频中...');
            progressPanel.updateProgress(50, '下载视频中...');
            
            // 下载视频
            const response = await Utils.fetchWithRetry(productData.mainVideo);
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            
            // 创建下载链接并触发下载
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = `${productData.name || 'video'}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL对象
            URL.revokeObjectURL(videoUrl);
            uiManager.updateProgress(100, '下载完成！');
            progressPanel.updateProgress(100, '视频下载完成！');
            progressPanel.addLog('视频下载完成');
            
            // 显示烟花
            setTimeout(() => {
                fireworks.show();
                setTimeout(() => {
                    uiManager.hideProgress();
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('视频下载失败:', error);
            uiManager.showAlert('视频下载失败');
            progressPanel.addLog(`视频下载失败: ${error.message}`);
            uiManager.hideProgress();
        }
    }

    // 下载长图
    async function downloadLongImage() {
        try {
            // 显示进度面板
            progressPanel.reset();
            progressPanel.create();
            progressPanel.addLog('开始生成长图...');
            
            uiManager.createProgressBar();
            uiManager.updateProgress(20, '滚动加载页面...');
            progressPanel.updateProgress(20, '滚动加载页面...');
            
            // 重置并加载数据
            productData.reset();
            await productData.scrollAndLoad();
            await new Promise(resolve => setTimeout(resolve, CONFIG.SCROLL_WAIT));
            
            // 获取商品名称和详情图片
            productData.getName();
            productData.getDetailImages();
            
            progressPanel.updateStats(0, 0, 0, productData.detailImages.length);
            progressPanel.addLog(`找到 ${productData.detailImages.length} 张详情图片`);
            
            if (productData.detailImages.length === 0) {
                progressPanel.addLog('没有找到详情图片');
                uiManager.showAlert('没有找到详情图片');
                return;
            }
            
            // 生成长图
            uiManager.updateProgress(60, '生成长图...');
            progressPanel.updateProgress(60, '生成长图...');
            const longImageBlob = await productData.createLongImage();
            
            if (!longImageBlob) {
                progressPanel.addLog('生成长图失败');
                uiManager.showAlert('生成长图失败');
                return;
            }
            
            // 保存长图
            uiManager.updateProgress(90, '保存文件...');
            progressPanel.updateProgress(90, '保存文件...');
            const imageUrl = URL.createObjectURL(longImageBlob);
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${productData.name || 'long-image'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL对象
            URL.revokeObjectURL(imageUrl);
            uiManager.updateProgress(100, '下载完成！');
            progressPanel.updateProgress(100, '长图下载完成！');
            progressPanel.addLog('长图下载完成');
            
            // 显示烟花
            setTimeout(() => {
                fireworks.show();
                setTimeout(() => {
                    uiManager.hideProgress();
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('长图下载失败:', error);
            uiManager.showAlert('长图下载失败');
            progressPanel.addLog(`长图下载失败: ${error.message}`);
            uiManager.hideProgress();
        }
    }

    // 初始化函数
    function init() {
        // 清理URL
        Utils.cleanUrl();
        
        // 延迟激活视频标签，等待页面加载完成
        setTimeout(() => {
            Utils.activateVideoTab();
        }, 1000);
        
        // 创建下载按钮
        uiManager.createDownloadButtons();
        
        // 监听URL变化
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                Utils.cleanUrl();
            }
        });
        
        // 监听DOM变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        // 如果文档还在加载，等待加载完成
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果文档已经加载完成，直接初始化
        init();
    }

})();