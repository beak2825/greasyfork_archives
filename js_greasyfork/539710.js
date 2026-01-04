// ==UserScript==
// @name         文章优化打印合集
// @namespace    http://tampermonkey.net/
// @version      3.7.2
// @description  优化CSDN、稀土掘金、知乎专栏、微信公众号、看雪论坛、吾爱论坛和阿里云先知社区文章页面用于打印，移除不必要元素并自动调用打印功能，支持导出PDF
// @author       Sherry
// @match        *://*.csdn.net/*/article/details/*
// @match        *://juejin.cn/post/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.52pojie.cn/thread-*-*-*.html
// @match        *://mp.weixin.qq.com/s/*
// @match        *://bbs.kanxue.com/thread-*.htm*
// @match        *://xz.aliyun.com/t/*
// @match        *://xz.aliyun.com/news/*
// @grant        none
// @run-at       document-end
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C.3iWufqIms_ccabhKcsM4GgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7
// @license      MIT
// @homepage     https://github.com/sherrys2025/ArticlePrintOptimizer
// @supportURL   https://github.com/sherrys2025/ArticlePrintOptimizer/issues
// @downloadURL https://update.greasyfork.org/scripts/539710/%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%89%93%E5%8D%B0%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539710/%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%89%93%E5%8D%B0%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

(function(){
    'use strict';
    
    // 判断当前网站
    const isCSND = location.hostname.includes('csdn.net');
    const isJuejin = location.hostname.includes('juejin.cn');
    const isZhihu = location.hostname.includes('zhuanlan.zhihu.com');
    const is52pojie = location.hostname.includes('52pojie.cn') && location.pathname.includes('/thread-');
    const isWeixin = location.hostname.includes('mp.weixin.qq.com') && location.pathname.includes('/s/');
    const isKanxue = location.hostname.includes('bbs.kanxue.com') && location.pathname.includes('/thread-');
    const isXianzhi = location.hostname.includes('xz.aliyun.com') && (location.pathname.includes('/t/') || location.pathname.includes('/news/'));
    
    // 网站相关配置 - 统一使用蓝色主题
    const siteConfig = {
        csdn: {
            name: 'CSDN',
            color: '#1890ff',
            icon: '📄'
        },
        juejin: {
            name: '掘金',
            color: '#1890ff',
            icon: '📄'
        },
        zhihu: {
            name: '知乎',
            color: '#1890ff',
            icon: '📄'
        },
        pojie: {
            name: '吾爱破解',
            color: '#1890ff',
            icon: '📄'
        },
        weixin: {
            name: '微信公众号',
            color: '#1890ff',
            icon: '📄'
        },
        kanxue: {
            name: '看雪论坛',
            color: '#1890ff',
            icon: '📄'
        },
        xianzhi: {
            name: '先知社区',
            color: '#1890ff',
            icon: '📄'
        }
    };
    
    // 当前网站配置
    let currentSite;
    if (isCSND) {
        currentSite = siteConfig.csdn;
    } else if (isJuejin) {
        currentSite = siteConfig.juejin;
    } else if (isZhihu) {
        currentSite = siteConfig.zhihu;
    } else if (is52pojie) {
        currentSite = siteConfig.pojie;
    } else if (isWeixin) {
        currentSite = siteConfig.weixin;
    } else if (isKanxue) {
        currentSite = siteConfig.kanxue;
    } else if (isXianzhi) {
        currentSite = siteConfig.xianzhi;
    }
    
    // 创建控制面板
    function createControlPanel() {
        // 添加字体
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // 添加全局样式
        const globalStyle = document.createElement('style');
        globalStyle.textContent = `
            #article-print-panel * {
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }
            
            @keyframes ripple-effect {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(globalStyle);
        
        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'article-print-panel';
        panel.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background-color: #fff !important;
            border-radius: 8px !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1) !important;
            z-index: 9999 !important;
            font-size: 14px !important;
            cursor: move !important;
            width: 260px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            transition: all 0.3s ease !important;
            border: 1px solid rgba(0,0,0,0.06) !important;
            max-width: 95vw !important;
        `;
        
        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            background: #1890ff !important;
            color: white !important;
            padding: 16px !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-top-left-radius: 8px !important;
            border-top-right-radius: 8px !important;
            cursor: move !important;
            user-select: none !important;
        `;
        
        const titleText = document.createElement('div');
        titleText.innerHTML = `${currentSite.icon} ${currentSite.name}打印优化`;
        titleText.style.cssText = `
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        `;
        
        // 添加关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            cursor: pointer !important;
            font-size: 14px !important;
            opacity: 0.8 !important;
            transition: all 0.2s !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
        `;
        closeBtn.onmouseover = function() {
            this.style.opacity = '1';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        };
        closeBtn.onmouseout = function() {
            this.style.opacity = '0.8';
            this.style.background = 'transparent';
        };
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            panel.style.display = 'none';
            
            // 添加恢复按钮
            const restoreBtn = document.createElement('div');
            restoreBtn.innerHTML = `${currentSite.icon}`;
            restoreBtn.title = '显示打印面板';
            restoreBtn.style.cssText = `
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                background-color: #1890ff !important;
                color: white !important;
                width: 56px !important;
                height: 56px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.15) !important;
                font-size: 24px !important;
                z-index: 9999 !important;
                transition: all 0.2s !important;
            `;
            restoreBtn.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            };
            restoreBtn.onmouseout = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            };
            restoreBtn.onclick = function() {
                panel.style.display = 'block';
                this.remove();
            };
            document.body.appendChild(restoreBtn);
        };
        
        titleBar.appendChild(titleText);
        titleBar.appendChild(closeBtn);
        
        // 创建按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            padding: 20px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
        `;
        
                    // 创建按钮函数
        function createButton(icon, text, bgColor, onClick) {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.cssText = `
                width: 100% !important;
                height: 48px !important;
                position: relative !important;
                margin-bottom: 2px !important;
            `;
            
            const button = document.createElement('button');
            button.style.cssText = `
                background-color: ${bgColor} !important;
                color: white !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                width: 100% !important;
                height: 100% !important;
                font-size: 16px !important;
                font-weight: 500 !important;
                transition: all 0.2s !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                letter-spacing: 0.5px !important;
            `;
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'icon';
            iconSpan.innerHTML = icon;
            iconSpan.style.cssText = `
                display: inline-block !important;
                width: 24px !important;
                margin-right: 10px !important;
                text-align: center !important;
                font-size: 18px !important;
            `;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'text';
            textSpan.textContent = text;
            textSpan.style.cssText = `
                display: inline-block !important;
            `;
            
            button.appendChild(iconSpan);
            button.appendChild(textSpan);
            
            // 添加涟漪效果
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute !important;
                    background: rgba(255, 255, 255, 0.3) !important;
                    border-radius: 50% !important;
                    pointer-events: none !important;
                    transform: translate(-50%, -50%) !important;
                    animation: ripple-effect 0.6s linear !important;
                `;
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.width = ripple.style.height = `${size}px`;
                
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                onClick();
            });
            
            button.onmouseover = function() {
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                this.style.opacity = '0.9';
            };
            
            button.onmouseout = function() {
                this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                this.style.opacity = '1';
            };
            
            buttonWrapper.appendChild(button);
            return buttonWrapper;
        }
        
        // 创建优化并打印按钮
        const optimizeBtn = createButton('🖨️', '优化并打印', '#1890ff', function() {
            optimizePage(true);
        });
        
        // 创建保存为PDF按钮
        const savePdfBtn = createButton('💾', '保存为PDF', '#1890ff', function() {
            optimizePage(false, true);
        });
        
        // 创建仅优化页面按钮
        const optimizeOnlyBtn = createButton('✨', '仅优化页面', '#52c41a', function() {
            optimizePage(false);
        });
        
        // 创建恢复原页面按钮
        const resetBtn = createButton('🔄', '恢复原页面', '#ff4d4f', function() {
            location.reload();
        });
        
        // 添加按钮到容器
        buttonsContainer.appendChild(optimizeBtn);
        buttonsContainer.appendChild(savePdfBtn);
        buttonsContainer.appendChild(optimizeOnlyBtn);
        buttonsContainer.appendChild(resetBtn);
        
        // 添加版权信息
        const footer = document.createElement('div');
        footer.textContent = '文章优化打印合集 v3.7.2';
        footer.style.cssText = `
            text-align: center !important;
            font-size: 13px !important;
            color: rgba(0, 0, 0, 0.45) !important;
            padding: 0 20px 18px !important;
        `;
        
        // 组装面板
        panel.appendChild(titleBar);
        panel.appendChild(buttonsContainer);
        panel.appendChild(footer);
        
        document.body.appendChild(panel);
        
        // 添加拖拽功能
        makeDraggable(panel, titleBar);
    }
    
    // 辅助函数：调整颜色亮度
    function adjustColor(hex, percent) {
        // 将十六进制颜色转换为RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        // 调整亮度
        r = Math.min(255, Math.max(0, r + percent));
        g = Math.min(255, Math.max(0, g + percent));
        b = Math.min(255, Math.max(0, b + percent));
        
        // 转换回十六进制
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        
        return `#${rHex}${gHex}${bHex}`;
    }
    
    // 使元素可拖拽
    function makeDraggable(element, handle = null) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        const dragHandle = handle || element;
        
        dragHandle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
            
            // 添加拖动时的视觉效果
            element.style.opacity = '0.9';
            element.style.transition = 'none';
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // 不应用任何缩放调整，直接使用原始计算
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }
        
        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
            
            // 恢复视觉效果
            element.style.opacity = '1';
            element.style.transition = 'all 0.3s ease';
        }
    }
    
    // 优化CSDN页面
    function optimizeCSDNPage(autoPrint = false, savePdf = false) {
        // 保存原始标题用于PDF文件名
        const articleTitle = document.title.replace(' - CSDN', '');
        
        // 移除不必要元素
        var articleBox = $("div.article_content");
        articleBox.removeAttr("style");
        $(".hide-preCode-bt").parents(".author-pjw").show();
        $(".hide-preCode-bt").parents("pre").removeClass("set-code-hide");
        $(".hide-preCode-bt").parents(".hide-preCode-box").hide().remove();
        $("#btn-readmore").parent().remove();
        $("#side").remove();
        $(".csdn-side-toolbar, .template-box, .blog-footer-bottom, .left-toolbox, .toolbar-inside").remove();
        $(".comment-box, .recommend-box, .more-toolbox, .article-info-box, .column-group-item").remove();
        $("aside, .tool-box, .recommend-nps-box, .skill-tree-box").remove();
        
        // 修复布局
        $("main").css({
            'display': 'block',
            'float': 'none',
            'margin': '0 auto',
            'padding': '20px'
        });
        
        $("#mainBox").width("100%");
        
        // 修复可能导致第一页空白的问题
        $("body").css({
            'margin': '0',
            'padding': '0',
            'zoom': '0.8',
            'overflow': 'visible'
        });
        
        // 确保文章内容从第一页开始
        $("article").css({
            'page-break-before': 'avoid',
            'margin-top': '0'
        });
        
        // 移除可能导致空白页的元素
        $(".first-page-break").remove();
        
        // 为代码块设置黑色背景
        document.querySelectorAll('pre, code, .code-snippet').forEach(codeBlock => {
            // 不修改其他样式，只设置背景色
            codeBlock.style.backgroundColor = '#1e1e1e';
        });
        
        // 添加代码块样式
        const codeStyle = document.createElement('style');
        codeStyle.textContent = `
            pre, code, .code-snippet, .prism {
                background-color: #1e1e1e !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        `;
        document.head.appendChild(codeStyle);
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.id = 'csdn-print-style';
        printStyle.textContent = `
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                    font-size: 12pt;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                    page-break-inside: avoid;
                }
                
                pre, code, .code-snippet, .prism, table {
                    page-break-inside: avoid;
                    background-color: #1e1e1e !important;
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                img {
                    page-break-inside: avoid;
                    max-width: 100% !important;
                }
                
                a {
                    text-decoration: underline;
                    color: #000;
                }
                
                #article-print-panel {
                    display: none !important;
                }
                
                /* 添加页码 */
                @page {
                    margin: 1cm;
                    @bottom-center {
                        content: "第 " counter(page) " 页，共 " counter(pages) " 页";
                    }
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 优化掘金页面
    function optimizeJuejinPage(autoPrint = false, savePdf = false) {
        // 保存原始标题用于PDF文件名
        const articleTitle = document.querySelector('.article-title')?.textContent || document.title;
        
        // 移除不必要元素
        const elementsToRemove = [
            '.article-suspended-panel', // 悬浮面板
            '.main-header-box', // 顶部导航
            '.article-title-box + div', // 作者信息区域
            '.article-end', // 文章结尾区域
            '.article-catalog', // 目录
            '.article-banner', // 广告横幅
            '.recommended-area', // 推荐区域
            '.comment-box', // 评论区
            '.sidebar', // 侧边栏
            '.extension', // 扩展区域
            '.column-container', // 专栏容器
            '.footer-wrapper', // 页脚
            '.main-header', // 主页头部
            '.article-suspended-panel', // 文章悬浮面板
            '.tag-list-box', // 标签列表
            '.category-course-recommend', // 课程推荐
            '.next-article', // 下一篇文章
            '.extension-banner', // 扩展横幅
            '.author-info-block', // 作者信息
            '.recommend-box', // 推荐框
            '.article-title-box .stat-item', // 文章标题下的统计信息
            '.article-title-box .stat-view-times', // 阅读次数
            '.article-title-box .stat-like', // 点赞
            '.article-title-box .stat-comment', // 评论数
            '.article-title-box .follow-btn', // 关注按钮
            '.article-title-box .follow-btn-wrap', // 关注按钮包装
            '.column-entry-list', // 专栏列表
            '.column-entry', // 专栏条目
            '.suspension-panel', // 悬浮面板
            '.suspension-panel.suspension-panel', // 重复选择器确保移除
            '.article-feedback-wrap', // 文章反馈区域
            '.article-feedback', // 文章反馈
            '.author-block', // 作者块
            '.wechat-banner', // 微信横幅
            '.category-course-recommend', // 课程推荐
            '.category-course-box', // 课程盒子
            '.post-recommend-box', // 文章推荐盒子
            '.post-list-box', // 文章列表盒子
            '.app-open-button', // APP打开按钮
            '.open-button', // 打开按钮
            '.app-download-sidebar-block', // APP下载侧边栏
            '.sticky-block', // 粘性块
            '.sticky-block-box', // 粘性块盒子
            '.login-guide-box', // 登录引导盒子
            '.login-button-wrap', // 登录按钮包装
            '.login-banner', // 登录横幅
            '.article-area > div:last-child', // 文章区域最后一个div（通常是推荐或评论）
            '.article-area > div[data-growing-title]', // 带有growing-title属性的div（通常是广告）
            '.advert-box' // 广告盒子
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
        
        // 修复布局
        const articleArea = document.querySelector('.article-area');
        if (articleArea) {
            articleArea.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                padding: 20px !important;
                margin: 0 auto !important;
                float: none !important;
                box-sizing: border-box !important;
            `;
        }
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 auto !important;
            `;
        }
        
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 auto !important;
            `;
        }
        
        // 扩展代码块宽度
        document.querySelectorAll('pre, code').forEach(el => {
            el.style.maxWidth = '100%';
            el.style.overflow = 'visible';
            el.style.whiteSpace = 'pre-wrap';
        });
        
        // 优化图片显示
        document.querySelectorAll('.article-content img').forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.margin = '10px auto';
            img.style.display = 'block';
            
            // 确保图片在打印时可见
            img.setAttribute('loading', 'eager');
            
            // 添加图片描述作为标题
            const altText = img.getAttribute('alt');
            if (altText && !img.nextElementSibling?.classList.contains('img-caption')) {
                const caption = document.createElement('div');
                caption.className = 'img-caption';
                caption.textContent = altText;
                caption.style.cssText = `
                    text-align: center;
                    color: #666;
                    font-size: 0.9em;
                    margin-bottom: 15px;
                `;
                img.parentNode.insertBefore(caption, img.nextSibling);
            }
        });
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.id = 'juejin-print-style';
        printStyle.textContent = `
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                    font-size: 12pt;
                }
                
                .article-title {
                    font-size: 18pt;
                    margin-bottom: 10px;
                    page-break-after: avoid;
                }
                
                .article-content {
                    font-size: 12pt;
                    line-height: 1.5;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                    page-break-inside: avoid;
                }
                
                pre, code, table {
                    page-break-inside: avoid;
                }
                
                img {
                    page-break-inside: avoid;
                    max-width: 100% !important;
                }
                
                a {
                    text-decoration: underline;
                    color: #000;
                }
                
                #article-print-panel {
                    display: none !important;
                }
                
                /* 确保代码块在打印时正确换行 */
                pre {
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    page-break-inside: avoid !important;
                }
                
                /* 添加页码 */
                @page {
                    margin: 1cm;
                    @bottom-center {
                        content: "第 " counter(page) " 页，共 " counter(pages) " 页";
                    }
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 优化知乎专栏页面
    function optimizeZhihuPage(autoPrint = false, savePdf = false) {
        // 保存原始标题用于PDF文件名
        const articleTitle = document.querySelector('h1.Post-Title')?.textContent || 
                            document.querySelector('.title-image')?.textContent ||
                            document.title;
        
        // 移除不必要元素 - 简化为只删除指定元素
        const elementsToRemove = [
            'header', // 顶部横幅
            'div.Card.AuthorCard', // 作者卡片
            'div.Comments-container.css-plbgu', // 评论容器
            'div.Post-Sub.Post-NormalSub' // 底部相关信息
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
        
        // 优化知乎文章的整体布局结构
        const postRowContent = document.querySelector('.Post-Row-Content');
        if (postRowContent) {
            postRowContent.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                margin: 0 auto !important;
                padding: 0 !important;
            `;
            
            // 优化左侧内容区域，使其居中
            const leftContent = document.querySelector('.Post-Row-Content-left');
            if (leftContent) {
                leftContent.style.cssText = `
                    width: 100% !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    float: none !important;
                    padding: 0 20px !important;
                `;
            }
            
            // 隐藏右侧边栏
            const rightContent = document.querySelector('.Post-Row-Content-right');
            if (rightContent) {
                rightContent.style.display = 'none';
            }
        }
        
        // 优化文章主体内容区
        const mainContent = document.querySelector('.Post-Row-Content-left-article');
        if (mainContent) {
            mainContent.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 20px !important;
                box-sizing: border-box !important;
            `;

            // 处理主内容区域内的图片居中
            mainContent.querySelectorAll('img').forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.margin = '10px auto';
                img.style.display = 'block';
                
                // 修复绝对定位的图片
                if (img.style.position === 'absolute') {
                    img.style.position = 'relative';
                    img.style.inset = 'auto';
                }
                
                img.setAttribute('loading', 'eager'); // 确保图片在打印时可见
            });
            
            // 修复图片容器
            mainContent.querySelectorAll('.css-1ld0bim').forEach(container => {
                container.style.cssText = `
                    margin: 10px 0 !important;
                    text-align: center !important;
                    position: relative !important;
                `;
            });
            
            // 处理文本和段落
            mainContent.querySelectorAll('p').forEach(p => {
                p.style.textAlign = 'left';
                p.style.margin = '1em 0';
                p.style.lineHeight = '1.6';
            });
            
            // 优化标题
            mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
                h.style.textAlign = 'center';
                h.style.margin = '1.2em 0 0.8em 0';
            });
        }
        
        // 兼容其他容器
        let articleContainer = document.querySelector('.Post-RichTextContainer') || 
                             document.querySelector('.RichContent-inner') || 
                             document.querySelector('.Post-RichText');
                             
        if (articleContainer) {
            articleContainer.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            `;
        }
        
        // 调整文章容器
        const postMain = document.querySelector('.Post-Main') || 
                       document.querySelector('.Post-NormalMain');
        if (postMain) {
            postMain.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                padding: 20px !important;
                margin: 0 auto !important;
            `;
        }
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.id = 'zhihu-print-style';
        printStyle.textContent = `
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    font-size: 12pt !important;
                }
                
                .Post-Title, .ArticleHeader-title {
                    font-size: 18pt !important;
                    margin-bottom: 10px !important;
                    page-break-after: avoid !important;
                    text-align: center !important;
                }
                
                .RichText, .RichContent-inner, .Post-Row-Content-left-article {
                    font-size: 12pt !important;
                    line-height: 1.5 !important;
                    text-align: left !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                .Post-Row-Content, .Post-Row-Content-left {
                    width: 100% !important;
                    max-width: 100% !important; 
                    margin: 0 auto !important;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid !important;
                    page-break-inside: avoid !important;
                    text-align: center !important;
                }
                
                pre, code, table, .highlight {
                    page-break-inside: avoid !important;
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                }
                
                img {
                    page-break-inside: avoid !important;
                    max-width: 100% !important;
                    height: auto !important;
                    margin: 10px auto !important;
                    display: block !important;
                    position: relative !important;
                    inset: auto !important;
                }
                
                a {
                    text-decoration: underline !important;
                    color: #000 !important;
                }
                
                #article-print-panel {
                    display: none !important;
                }
                
                .Post-Row-Content-left-article p, .RichText p {
                    text-align: left !important;
                    margin: 1em 0 !important;
                }
                
                .Post-Row-Content-right {
                    display: none !important;
                }
                
                /* 添加页码 */
                @page {
                    margin: 1cm;
                    @bottom-center {
                        content: "第 " counter(page) " 页，共 " counter(pages) " 页";
                    }
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // 显示成功消息
        console.log('知乎文章优化完成，准备打印或保存为PDF');
        
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 优化吾爱论坛页面
    function optimize52pojiePage(autoPrint = false, savePdf = false) {
        // 保存原始标题用于PDF文件名
        const articleTitle = document.querySelector('.ts')?.textContent || 
                           document.title.replace(' - 吾爱破解 - LCG - LSG|安卓破解|病毒分析|www.52pojie.cn', '');
        
        // 移除不必要元素
        const elementsToRemove = [
            '#toptb', // 顶部工具栏
            '#hd', // 顶部横幅区域
            '#nv', // 导航区域
            '#pt', // 面包屑导航
            '#pgt', // 页面导航工具条
            '#footer', // 页脚
            '#ft', // 底部页脚区域
            '.pgs.mtm.mbm.cl', // 分页导航
            '.bm.bml.pbn', // 帖子功能区
            '#postlist > .ad_column', // 广告列
            '.pls', // 用户信息侧边栏
            '.p_pop', // 弹出菜单
            '.bm_c[style="overflow: visible;"]', // 底部广告区域
            '.bm_h', // 底部标题栏
            '.pgbtn', // 翻页按钮
            '.plc .pi', // 帖子信息区
            '.plc .pct .mtw', // 帖子内容上方区域
            '#tap_author_info', // 作者信息标签
            '#tap_author_stat', // 作者统计标签
            '.sign', // 签名档
            '.rate', // 评分区域
            '.plc .po', // 帖子下方操作区
            '#postlistreply', // 回帖区域
            '#relatelink', // 相关链接区域
            '#subjump', // 主题跳转区域
            '#custominfo_pmid', // 自定义信息区域
            '#p_btn', // 按钮区域
            '[id^="comment_"]', // 所有评论
            '.area', // 区域
            '#quickpost', // 快速回复区域
            '.fastlg', // 快速登录区域
            '#f_pst', // 发帖表单
            '.bm.bw0', // 无边框板块
            '.pob', // 帖子操作按钮
            '.avatar', // 头像
            '.authi', // 作者信息
            '[id^="post_rate_div_"]', // 评分div
            '#scrolltop', // 回到顶部按钮
            '.plc > .po', // 帖子下方操作区
            '.psth', // 帖子统计头
            '.tns', // 统计区域
            '#visit_counter', // 访问计数器
            '.main_ad', // 主要广告
            '.bm_c > [id^="postmessage_"] + div', // 帖子内容后的div
            '.tip', // 提示框
            '.paddtop', // 顶部填充
            '.paddimg', // 图片填充
            '.usercss', // 用户css
            '.t_fsz > .bm_c > .pbn', // 帖子内容上方区域
            '.bm_c font', // 特殊样式文字
            '.postactions', // 帖子操作区
            '.adext', // 扩展广告
            '.adtxt', // 文字广告
            '.side_ad', // 侧边广告
            '.threadmod', // 主题模式
            '.threadtools', // 主题工具
            '.locked', // 锁定提示
            '.attach_popup', // 附件弹窗
            '.pattl', // 附件列表
            '.attach_nopermission', // 附件无权限提示
            '.postart', // 帖子起始
            '.appext', // 应用扩展
            '[style*="display:none"]' // 隐藏元素
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
        
        // 找到帖子主要内容
        const postContent = document.querySelector('#postlist');
        if (postContent) {
            postContent.style.cssText = `
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 20px !important;
                box-sizing: border-box !important;
            `;
            
            // 移除帖子中每个回复的用户信息部分，只保留内容
            document.querySelectorAll('#postlist > div').forEach(post => {
                // 移除td.pls (用户信息侧栏)
                const userInfo = post.querySelector('td.pls');
                if (userInfo) userInfo.remove();
                
                // 调整内容区td.plc样式
                const contentArea = post.querySelector('td.plc');
                if (contentArea) {
                    contentArea.style.cssText = `
                        width: 100% !important;
                        float: none !important;
                        display: block !important;
                        background-color: white !important;
                        border: none !important;
                        padding: 20px !important;
                    `;
                    
                    // 移除帖子信息区域
                    const postInfo = contentArea.querySelector('.pi');
                    if (postInfo) postInfo.remove();
                    
                    // 移除额外的操作区域
                    const operations = contentArea.querySelector('.po');
                    if (operations) operations.remove();
                }
            });
            
            // 仅保留楼主的帖子内容
            const allPosts = document.querySelectorAll('#postlist > div');
            if (allPosts.length > 1) {
                for (let i = 1; i < allPosts.length; i++) {
                    allPosts[i].remove();
                }
            }
            
            // 优化帖子内容样式
            document.querySelectorAll('.t_fsz').forEach(content => {
                content.style.cssText = `
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 auto !important;
                    padding: 0 !important;
                    font-size: 16px !important;
                    line-height: 1.6 !important;
                    color: #333 !important;
                `;
            });
            
            // 优化图片显示
            document.querySelectorAll('.t_fsz img').forEach(img => {
                img.style.cssText = `
                    max-width: 90% !important;
                    height: auto !important;
                    margin: 15px auto !important;
                    display: block !important;
                    border: none !important;
                `;
                img.setAttribute('loading', 'eager'); // 确保图片在打印时可见
            });
            
            // 只修改代码块的背景颜色为黑色，保留其他原始样式
            document.querySelectorAll('pre, code, .blockcode').forEach(codeBlock => {
                // 不修改其他样式，只设置背景色
                codeBlock.style.backgroundColor = '#1e1e1e';
            });
            
            // 添加打印时的黑色背景样式
            const codeLayoutStyle = document.createElement('style');
            codeLayoutStyle.textContent = `
                @media print {
                    pre, code, .blockcode {
                        background-color: #1e1e1e !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `;
            document.head.appendChild(codeLayoutStyle);
        }
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.id = '52pojie-print-style';
        printStyle.textContent = `
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    font-size: 12pt !important;
                    background: white !important;
                }
                
                #postlist {
                    width: 100% !important;
                    max-width: 100% !important; 
                    margin: 0 auto !important;
                    padding: 0 !important;
                }
                
                .t_fsz {
                    font-size: 12pt !important;
                    line-height: 1.5 !important;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid !important;
                    page-break-inside: avoid !important;
                }
                
                /* 为代码块应用黑色背景，保留其他原始样式 */
                pre, code, .blockcode {
                    page-break-inside: avoid !important;
                    background-color: #1e1e1e !important;
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                img {
                    page-break-inside: avoid !important;
                    max-width: 90% !important;
                    height: auto !important;
                    margin: 10px auto !important;
                    display: block !important;
                }
                
                a {
                    text-decoration: underline !important;
                    color: #000 !important;
                }
                
                #article-print-panel {
                    display: none !important;
                }
                
                /* 添加页码 */
                @page {
                    margin: 1cm;
                    @bottom-center {
                        content: "第 " counter(page) " 页，共 " counter(pages) " 页";
                    }
                }
                
                /* 隐藏其他不必要元素 */
                table, tr, td {
                    border: none !important;
                    background: none !important;
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // 显示成功消息
        console.log('吾爱破解文章优化完成，准备打印或保存为PDF');
        
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 优化微信公众号文章页面
    function optimizeWeixinPage(autoPrint = false, savePdf = false) {
        // 获取文章标题
        const articleTitle = document.querySelector('#activity-name')?.innerText?.trim() || '微信公众号文章';
        
        // 只删除指定元素
        const elementsToRemove = [
            '.rich_media_tool_area',       // 工具区域
            '.bottom_bar_interaction_wrp'   // 底部交互区域
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
        
        // 为代码块添加打印时的背景色样式
        const codeBlockStyle = document.createElement('style');
        codeBlockStyle.textContent = `
            pre, code, .code-snippet {
                background-color: #1e1e1e !important;
                color: #d4d4d4 !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            pre *, code *, .code-snippet * {
                color: #d4d4d4 !important;
            }
        `;
        document.head.appendChild(codeBlockStyle);
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.id = 'weixin-print-style';
        printStyle.textContent = `
            @media print {
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                #article-print-panel {
                    display: none !important;
                }
                
                /* 确保代码块背景色在打印时显示 */
                pre, code, .code-snippet {
                    background-color: #1e1e1e !important;
                    color: #d4d4d4 !important;
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                pre *, code *, .code-snippet * {
                    color: #d4d4d4 !important;
                }
                
                /* 添加页码 */
                @page {
                    margin: 1cm;
                    @bottom-center {
                        content: "第 " counter(page) " 页，共 " counter(pages) " 页";
                    }
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // 显示成功消息
        console.log('微信公众号文章优化完成，准备打印或保存为PDF');
        
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 优化看雪论坛文章页面
    function optimizeKanxuePage(autoPrint = false, savePdf = false) {
        // 获取文章标题
        const articleTitle = document.querySelector('.thread_subject')?.textContent?.trim() || document.title.replace(' - 看雪论坛', '');
        
        // 删除不必要元素
        const elementsToRemove = [
            '#header', // 顶部导航
            '#headsidetool', // 头部工具栏
            '#lsform', // 搜索表单
            '.bdnav', // 面包屑导航
            '.forum_nav', // 论坛导航
            '#postList > div:not(:first-child)', // 移除所有回帖，只保留原帖
            '#p_btn', // 帖子按钮
            '.pob', // 帖子操作按钮
            '.plc .pi', // 帖子信息
            '.authi', // 作者信息
            '.pls', // 左侧用户信息栏
            '.rate', // 评分区域
            '.sign', // 签名
            '#p_btn', // 按钮区域
            '.comment_inner', // 评论区
            '#footer', // 页脚
            '#post_extras', // 额外内容
            '.ad_column', // 广告
            '.mobile_topic_ad', // 移动话题广告
            '#mn_forum_menu', // 论坛菜单
            '.j_wft_hd_wrapper', // 头部包装
            '#j_p_postlist > div:not(:first-child)', // 只保留原帖
            '.p_reply', // 回复工具条
            '#umenu', // 用户菜单
            '#wp > .wp.a_h', // 顶部隐藏区域
            '#nv_forum + div', // 导航下方不必要的div
            '.pgt', // 分页导航工具
            '.pg', // 分页
            '.bm.bml.pbn', // 帖子功能区
            '#fastpostform', // 快速回复表单
            '.banner-bg', // 横幅背景
            '.post-head', // 帖子头部
            '#post-comment', // 帖子评论区
            '#post_comment', // 评论区
            '#post_head', // 帖子头部
            '.plc > .po', // 帖子下方操作区
            '.post-attach', // 帖子附件
            '.forum-tag-wrap', // 论坛标签包装
            '.user-box', // 用户框
            '.push-status', // 推送状态
            '.btn-post-page', // 帖子页面按钮
            '.userinfo', // 用户信息
            '.post-tail-wrap', // 帖子尾部包装
            '.thread_footer', // 帖子底部
            '.postactions', // 帖子操作区域
            '.message_author', // 帖子作者信息
            '#chatroom-right-sidebar', // 聊天室右侧边栏
            '.hot_recommend', // 热门推荐
            '.kanxue_recom', // 看雪推荐
            '.thread_tags', // 帖子标签
            '.thread_share', // 帖子分享
            '.post_comment', // 帖子评论
            '.thread_option', // 帖子选项
            '.bottom_banner', // 底部横幅
            '.btn_reply', // 回复按钮
            '.reply_msg', // 回复消息
            '#sidebar', // 侧边栏
            '.plc > div[id^="post_rate_div"]', // 评分div
            '.info_bmc', // 附加信息
            'header#header', // 页面头部
            'ol.breadcrumb.mb-3.py-0.small.px-0', // 面包屑导航
            'div.position-fixed.text-center.collection_thumb_left', // 左侧固定元素
            'div.col-lg-3.pr-0.hidden-sm.hidden-md', // 右侧边栏
            'div.card-body.thumb_list_body', // 缩略图列表
            'div.card.px-2.px-md-5.py-5', // 卡片容器
            'div.card.p-1', // 小卡片
            'nav.text-right', // 右侧导航
            'div.container.px-0.pb-3.bbs_footer_start_column', // 页脚开始列
            'footer#footer', // 页脚
            'a.btn.btn-secondary.btn-block.xn-back.my-3.mx-auto', // 返回按钮
            'div.act_go_top', // 返回顶部
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });

        // 重新设置页面结构，强制居中
        const contentArea = document.querySelector('.message') || document.querySelector('.t_fsz') || document.querySelector('.read_post');
        if (contentArea && !document.getElementById('kanxue-center-wrapper')) {
            // 创建居中包装器
            const centerWrapper = document.createElement('div');
            centerWrapper.id = 'kanxue-center-wrapper';
            centerWrapper.style.cssText = `
                max-width: 800px !important;
                margin: 0 auto !important;
                padding: 20px !important;
                background-color: white !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                border-radius: 4px !important;
                box-sizing: border-box !important;
            `;
            
            // 保存原始内容的父元素引用
            const originalParent = contentArea.parentNode;
            
            // 将内容区域移动到新的居中包装器中
            centerWrapper.appendChild(contentArea.cloneNode(true));
            
            // 清除原始页面内容
            document.body.innerHTML = '';
            
            // 添加标题
            if (articleTitle) {
                const titleEl = document.createElement('h1');
                titleEl.textContent = articleTitle;
                titleEl.style.cssText = `
                    font-size: 24px !important;
                    font-weight: bold !important;
                    text-align: center !important;
                    margin: 20px auto !important;
                    padding: 0 !important;
                    color: #333 !important;
                `;
                centerWrapper.insertBefore(titleEl, centerWrapper.firstChild);
            }
            
            // 将居中包装器添加到页面
            document.body.appendChild(centerWrapper);
            
            // 设置页面基本样式
            document.body.style.cssText = `
                margin: 0 !important;
                padding: 0 !important; 
                background-color: #f6f6f6 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
            `;
            
            // 处理代码块，确保黑色背景但保留内部代码的原始颜色
            const codeBlocks = document.querySelectorAll('#kanxue-center-wrapper table.syntaxhighlighter');
            codeBlocks.forEach(block => {
                // 应用黑色背景到语法高亮器容器
                block.style.backgroundColor = '#1e1e1e';
                
                // 确保代码块其他样式适合阅读
                block.style.padding = block.style.padding || '10px';
                block.style.margin = block.style.margin || '10px 0';
                block.style.borderRadius = '3px';
                block.style.whiteSpace = 'pre-wrap';
                block.style.wordWrap = 'break-word';
                block.style.overflowX = 'auto';
                
                // 设置打印时保留背景色和原始文字颜色
                block.style.webkitPrintColorAdjust = 'exact';
                block.style.printColorAdjust = 'exact';
                
                // 确保内部元素也保持正确的颜色
                const codeElements = block.querySelectorAll('*');
                codeElements.forEach(el => {
                    if(el.tagName === 'SPAN' || el.tagName === 'CODE') {
                        // 保留语法高亮的原始颜色
                        el.style.webkitPrintColorAdjust = 'exact';
                        el.style.printColorAdjust = 'exact';
                    }
                });
            });
            
            // 添加说明：保留原有样式
            const stylePreserver = document.createElement('style');
            stylePreserver.textContent = `
                /* 基本样式 */
                #kanxue-center-wrapper {
                    font-family: inherit;
                }
                
                /* 处理代码块样式 - 只对syntaxhighlighter应用黑色背景但保持内部代码原始颜色 */
                #kanxue-center-wrapper table.syntaxhighlighter {
                    background-color: #1e1e1e !important;
                    font-family: Consolas, Monaco, monospace !important;
                    white-space: pre-wrap !important;
                    word-wrap: break-word !important;
                    overflow-x: auto !important;
                    padding: 10px !important;
                    border-radius: 3px !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    border-collapse: collapse !important;
                    width: 100% !important;
                }
                
                /* 保持代码元素的原始颜色 */
                #kanxue-center-wrapper table.syntaxhighlighter * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 修复代码行号显示 */
                #kanxue-center-wrapper table.syntaxhighlighter .gutter {
                    background-color: #333333 !important;
                    border-right: 1px solid #4b4b4b !important;
                    color: #9b9b9b !important;
                    padding: 0 10px !important;
                    min-width: 30px !important;
                    text-align: right !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    display: table-cell !important;
                    vertical-align: top !important;
                }
                
                /* 代码行内容 */
                #kanxue-center-wrapper table.syntaxhighlighter .code {
                    padding-left: 10px !important;
                    vertical-align: top !important;
                    display: table-cell !important;
                }
                
                /* 代码行样式 */
                #kanxue-center-wrapper table.syntaxhighlighter .line {
                    white-space: pre !important;
                    height: auto !important;
                    line-height: 1.5 !important;
                }
                
                /* 确保图片正确显示 */
                #kanxue-center-wrapper img {
                    max-width: 100%;
                    height: auto;
                    margin: 10px 0;
                }
                
                /* 打印样式，确保代码保持黑色背景且保留原始代码配色 */
                @media print {
                    body {
                        background-color: white !important;
                    }
                    #kanxue-center-wrapper {
                        box-shadow: none !important;
                        max-width: 100% !important;
                    }
                    #article-print-panel {
                        display: none !important;
                    }
                    #kanxue-center-wrapper table.syntaxhighlighter {
                        background-color: #1e1e1e !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* 确保行号在打印时也显示 */
                    #kanxue-center-wrapper table.syntaxhighlighter .gutter {
                        display: table-cell !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
                
                /* 保留pre元素中的代码样式 */
                #kanxue-center-wrapper pre {
                    background-color: #1e1e1e !important;
                    border: 1px solid #333 !important;
                    padding: 15px !important;
                    border-radius: 5px !important;
                    margin: 15px 0 !important;
                    overflow-x: auto !important;
                    white-space: pre-wrap !important;
                    word-wrap: break-word !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 行号和代码颜色设置 */
                #kanxue-center-wrapper .hljs {
                    display: block !important;
                    background: #1e1e1e !important;
                    padding: 0.5em !important;
                    color: #dcdcdc !important;
                    overflow-x: auto !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                /* 代码行号显示样式 */
                #kanxue-center-wrapper .hljs-ln {
                    border-collapse: collapse !important;
                    width: 100% !important;
                }
                
                #kanxue-center-wrapper .hljs-ln td {
                    padding: 0 !important;
                    vertical-align: top !important;
                }
                
                #kanxue-center-wrapper .hljs-ln-numbers {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    text-align: right !important;
                    color: #9b9b9b !important;
                    border-right: 1px solid #4b4b4b !important;
                    vertical-align: top !important;
                    padding-right: 8px !important;
                    min-width: 30px !important;
                    display: table-cell !important;
                }
                
                #kanxue-center-wrapper .hljs-ln-code {
                    padding-left: 8px !important;
                }
            `;
            document.head.appendChild(stylePreserver);
            
            // 重新创建控制面板
            createControlPanel();
            
            // 直接执行打印或保存操作
            setTimeout(() => {
                if (autoPrint) {
                    window.print();
                } else if (savePdf) {
                    window.print(); // 用户需在打印对话框中选择"另存为PDF"
                }
            }, 800);
        } else {
            // 如果没有重构页面，直接执行打印
            handlePrintOrSave(autoPrint, savePdf, articleTitle);
        }
    }
    
    // 优化先知社区文章页面
    function optimizeXianzhiPage(autoPrint = false, savePdf = false) {
        // 获取文章标题
        let articleTitle = document.title.replace(' - 先知社区', '');
        if (location.pathname.includes('/news/')) {
            articleTitle = document.querySelector('.article-title')?.textContent?.trim() 
                || document.querySelector('h1')?.textContent?.trim()
                || articleTitle;
        } else {
            articleTitle = document.querySelector('.detail-title')?.textContent?.trim() 
                || articleTitle;
        }
        
        // 按用户建议，直接删除干扰元素
        const elementsToRemove = [
            'div[style*="border-bottom: 1px solid #ededed"][style*="display: flex"][style*="position: fixed"]',
            '.right_container',
            '.detail_share',
            '.detail_comment',
            '.comment_box_quill',
            '.footer',
            '#header',
            '.navbar',
            '.nav',
            '.related-articles',
            '.article-tags',
            '.actions',
            '.recommend',
            '.advertisement'
        ];
        
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element) element.remove();
            });
        });
        
        // 为left_container添加样式
        const leftContainer = document.querySelector('.left_container');
        if (leftContainer) {
            leftContainer.style.position = 'static';
            leftContainer.style.width = '100%';
            leftContainer.style.margin = '0 auto';
        }
        
        // 调整主体内容样式
        const mainContent = document.querySelector('.detail-content') || 
                           document.querySelector('.article-content') || 
                           document.querySelector('.content');
                           
        if (mainContent) {
            mainContent.style.cssText = `
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 20px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
                font-size: 16px !important;
                line-height: 1.8 !important;
                color: #333 !important;
            `;
            
            // 处理图片，确保图片正常显示
            const images = mainContent.querySelectorAll('img');
            images.forEach(img => {
                if (img.src) {
                    img.style.cssText = `
                        max-width: 100% !important;
                        height: auto !important;
                        margin: 10px auto !important;
                        display: block !important;
                    `;
                    // 确保图片加载完成
                    img.loading = 'eager';
                    // 移除可能导致图片显示不全的属性
                    img.removeAttribute('width');
                    img.removeAttribute('height');
                }
            });

            // 处理代码块，确保代码高亮和行号显示正常
            const codeBlocks = mainContent.querySelectorAll('pre, code, .hljs');
            codeBlocks.forEach(block => {
                block.style.cssText = `
                    background-color: #f6f8fa !important;
                    padding: 16px !important;
                    border-radius: 5px !important;
                    font-family: Consolas, Monaco, 'Andale Mono', monospace !important;
                    font-size: 14px !important;
                    line-height: 1.5 !important;
                    overflow-x: auto !important;
                    white-space: pre-wrap !important;
                    word-wrap: break-word !important;
                    max-width: 100% !important;
                    margin: 16px 0 !important;
                    border: 1px solid #e1e4e8 !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                `;
            });
            
            // 处理行号显示
            const lineNumbers = mainContent.querySelectorAll('.gutter, .line-numbers');
            lineNumbers.forEach(lineNum => {
                lineNum.style.cssText = `
                    background-color: #f6f8fa !important;
                    color: #999 !important;
                    border-right: 1px solid #ddd !important;
                    padding-right: 10px !important;
                    text-align: right !important;
                    margin-right: 10px !important;
                    display: table-cell !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    user-select: none !important;
                `;
            });
            
            // 处理表格，确保表格完整显示
            const tables = mainContent.querySelectorAll('table');
            tables.forEach(table => {
                table.style.cssText = `
                    width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    display: block !important;
                    border-collapse: collapse !important;
                    margin: 16px 0 !important;
                `;
            });
        }
        
        // 添加版权信息
        const footer = document.createElement('div');
        footer.textContent = '文章优化打印合集 v3.7.2 | 先知社区';
        footer.style.cssText = `
            text-align: center !important;
            font-size: 12px !important;
            color: rgba(0, 0, 0, 0.45) !important;
            padding: 16px 20px !important;
            margin-top: 32px !important;
            border-top: 1px solid #eee !important;
            max-width: 800px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        `;
        document.body.appendChild(footer);
        
        // 添加打印样式
        const printStyle = document.createElement('style');
        printStyle.textContent = `
            @media print {
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    background-color: white !important;
                }
                @page {
                    margin: 1cm !important;
                }
                .hljs, pre, code {
                    overflow-x: hidden !important;
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                }
                a {
                    text-decoration: none !important;
                }
                a[href]:after {
                    content: " (" attr(href) ")" !important;
                    font-size: 12px !important;
                    color: #666 !important;
                    word-break: break-all !important;
                }
            }
        `;
        document.head.appendChild(printStyle);
        
        // 处理打印或保存
        handlePrintOrSave(autoPrint, savePdf, articleTitle);
    }
    
    // 处理打印或保存PDF
    function handlePrintOrSave(autoPrint = false, savePdf = false, articleTitle = '') {
        // 确保控制面板样式不受页面优化影响
        const panel = document.getElementById('article-print-panel');
        if (panel) {
            // 临时隐藏控制面板
            if (autoPrint || savePdf) {
                panel.style.display = 'none';
                
                // 延迟调用打印功能，确保样式已应用
                setTimeout(function() {
                    if (savePdf) {
                        // 使用浏览器的打印功能，选择"另存为PDF"
                        const printOptions = {
                            filename: `${articleTitle.replace(/[\\/:*?"<>|]/g, '_')}.pdf`,
                        };
                        window.print();
                        // 注意：由于浏览器安全限制，无法自动选择"另存为PDF"选项，
                        // 用户需要在打印对话框中手动选择"另存为PDF"
                    } else if (autoPrint) {
                        window.print();
                    }
                    
                    // 打印完成后显示控制面板
                    setTimeout(function() {
                        panel.style.display = 'block';
                    }, 1000);
                }, 500);
            }
        } else {
            // 如果面板不存在，直接打印
            if (autoPrint || savePdf) {
                setTimeout(function() {
                    window.print();
                }, 500);
            }
        }
    }
    
    // 根据网站选择优化方法
    function optimizePage(autoPrint = false, savePdf = false) {
        if (isCSND) {
            optimizeCSDNPage(autoPrint, savePdf);
        } else if (isJuejin) {
            optimizeJuejinPage(autoPrint, savePdf);
        } else if (isZhihu) {
            optimizeZhihuPage(autoPrint, savePdf);
        } else if (is52pojie) {
            optimize52pojiePage(autoPrint, savePdf);
        } else if (isWeixin) {
            optimizeWeixinPage(autoPrint, savePdf);
        } else if (isKanxue) {
            optimizeKanxuePage(autoPrint, savePdf);
        } else if (isXianzhi) {
            optimizeXianzhiPage(autoPrint, savePdf);
        }
    }
    
    // 等待页面加载完成后创建控制面板
    setTimeout(function() {
        createControlPanel();
    }, 1500);
})(); 