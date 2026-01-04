// ==UserScript==
// @name         ADHD超级视觉文字布局
// @namespace    https://adhd-visual-helper
// @version      2.0
// @description  超夸张的文字布局，日式美感，强烈视觉冲击
// @author       Claude for ADHD Helper
// @run-at       document-end
// @match        https://*/*
// @match        http://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546833/ADHD%E8%B6%85%E7%BA%A7%E8%A7%86%E8%A7%89%E6%96%87%E5%AD%97%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/546833/ADHD%E8%B6%85%E7%BA%A7%E8%A7%86%E8%A7%89%E6%96%87%E5%AD%97%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 引入外部字体 - 使用Google Fonts的思源黑体（免费的类苹方字体）
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // 添加超级夸张的样式
    GM_addStyle(`
        /* 导入字体 */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
        
        /* 全局字体设置 */
        * {
            font-family: 'Noto Sans SC', -apple-system, "PingFang SC", 
                         "Helvetica Neue", "Microsoft YaHei", sans-serif !important;
        }
        
        /* 超级夸张的首字母 - 日式风格 */
        p::first-letter,
        div > p::first-letter,
        article p::first-letter {
            font-size: 8em !important;  /* 超级大！ */
            font-weight: 900 !important;
            float: left !important;
            line-height: 0.7 !important;
            margin: -0.1em 0.05em -0.2em -0.05em !important;
            background: linear-gradient(135deg, #FF006E, #FB5607, #FFBE0B, #8338EC) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.3) !important;
            animation: mega-pulse 1.5s ease-in-out infinite !important;
            transform: rotate(-5deg) !important;
        }
        
        /* 标题超级动感 - 日本街头风格 */
        h1 {
            font-size: 4em !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: -3px !important;
            background: linear-gradient(45deg, #FF006E, #8338EC, #3A86FF) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            animation: crazy-shake 0.5s ease-in-out infinite alternate !important;
            transform: skew(-5deg) !important;
            text-shadow: 
                3px 3px 0px #FFB700,
                6px 6px 0px #FF006E,
                9px 9px 0px #8338EC !important;
        }
        
        h2 {
            font-size: 3em !important;
            font-weight: 800 !important;
            color: #FF006E !important;
            animation: wave-text 2s ease-in-out infinite !important;
            text-decoration: underline wavy #FFBE0B !important;
            text-underline-offset: 5px !important;
            text-decoration-thickness: 3px !important;
        }
        
        h3, h4, h5, h6 {
            font-size: 2em !important;
            animation: bounce-rotate 2s ease-in-out infinite !important;
            color: #3A86FF !important;
            display: inline-block !important;
            padding: 10px 20px !important;
            background: rgba(255,190,11,0.2) !important;
            border-left: 8px solid #FF006E !important;
            border-radius: 0 20px 20px 0 !important;
        }
        
        /* 段落文字跳动效果 */
        p {
            line-height: 2.2 !important;
            font-size: 1.2em !important;
            animation: text-float 4s ease-in-out infinite !important;
        }
        
        /* 每个字都有自己的动画 */
        p span {
            display: inline-block !important;
            animation: individual-bounce 2s ease-in-out infinite !important;
        }
        
        /* 链接超级醒目 */
        a {
            color: #FF006E !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            position: relative !important;
            padding: 5px 10px !important;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,0,110,0.2) 50%, 
                transparent 100%) !important;
            animation: link-glow 1s ease infinite !important;
        }
        
        a::after {
            content: "→" !important;
            margin-left: 5px !important;
            font-size: 1.2em !important;
            animation: arrow-bounce 0.5s ease infinite !important;
        }
        
        a:hover {
            transform: scale(1.3) rotate(3deg) !important;
            background: #FFBE0B !important;
            color: #000 !important;
            box-shadow: 0 0 20px #FFBE0B !important;
        }
        
        /* 强调文字超级夸张 */
        strong, b {
            font-size: 1.5em !important;
            padding: 5px 15px !important;
            background: #FF006E !important;
            color: white !important;
            transform: rotate(-2deg) !important;
            display: inline-block !important;
            animation: strong-pulse 0.8s ease infinite !important;
            box-shadow: 5px 5px 0 #FFB700 !important;
            border-radius: 5px !important;
        }
        
        em, i {
            font-size: 1.3em !important;
            color: #8338EC !important;
            font-style: normal !important;
            font-weight: 900 !important;
            text-decoration: underline dotted #FFBE0B !important;
            text-underline-offset: 3px !important;
            animation: em-wave 1s ease infinite !important;
        }
        
        /* 列表项超级动感 */
        li {
            font-size: 1.2em !important;
            margin: 20px 0 !important;
            padding-left: 30px !important;
            position: relative !important;
            animation: list-swing 3s ease-in-out infinite !important;
        }
        
        li::before {
            content: "★" !important;
            position: absolute !important;
            left: 0 !important;
            font-size: 1.5em !important;
            color: #FF006E !important;
            animation: star-spin 2s linear infinite !important;
        }
        
        /* 超级动画定义 */
        @keyframes mega-pulse {
            0%, 100% {
                transform: scale(1) rotate(-5deg);
                filter: hue-rotate(0deg);
            }
            50% {
                transform: scale(1.2) rotate(5deg);
                filter: hue-rotate(180deg);
            }
        }
        
        @keyframes crazy-shake {
            0% { transform: skew(-5deg) translateX(0); }
            25% { transform: skew(5deg) translateX(-5px); }
            50% { transform: skew(-5deg) translateX(5px); }
            75% { transform: skew(5deg) translateX(-5px); }
            100% { transform: skew(-5deg) translateX(0); }
        }
        
        @keyframes wave-text {
            0%, 100% { transform: translateY(0) rotateZ(0deg); }
            25% { transform: translateY(-10px) rotateZ(-2deg); }
            75% { transform: translateY(10px) rotateZ(2deg); }
        }
        
        @keyframes bounce-rotate {
            0%, 100% { 
                transform: translateY(0) rotate(0deg) scale(1);
            }
            25% { 
                transform: translateY(-15px) rotate(-5deg) scale(1.1);
            }
            75% { 
                transform: translateY(5px) rotate(5deg) scale(0.95);
            }
        }
        
        @keyframes text-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes individual-bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.05); }
        }
        
        @keyframes link-glow {
            0%, 100% { 
                box-shadow: 0 0 5px rgba(255,0,110,0.5);
            }
            50% { 
                box-shadow: 0 0 20px rgba(255,0,110,0.8);
            }
        }
        
        @keyframes arrow-bounce {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
        }
        
        @keyframes strong-pulse {
            0%, 100% { 
                transform: rotate(-2deg) scale(1);
                box-shadow: 5px 5px 0 #FFB700;
            }
            50% { 
                transform: rotate(2deg) scale(1.1);
                box-shadow: 8px 8px 0 #FF006E;
            }
        }
        
        @keyframes em-wave {
            0%, 100% { transform: skewY(0deg); }
            25% { transform: skewY(-5deg); }
            75% { transform: skewY(5deg); }
        }
        
        @keyframes list-swing {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes star-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* 选中文字效果 */
        ::selection {
            background: #FF006E !important;
            color: #FFBE0B !important;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
        }
        
        /* 滚动条美化 */
        ::-webkit-scrollbar {
            width: 15px !important;
        }
        
        ::-webkit-scrollbar-track {
            background: linear-gradient(45deg, #FFB700, #FF006E) !important;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #8338EC !important;
            border-radius: 10px !important;
            border: 2px solid #FFBE0B !important;
        }
        
        /* 图片悬浮效果 */
        img {
            transition: all 0.3s ease !important;
            border: 5px solid transparent !important;
        }
        
        img:hover {
            transform: scale(1.1) rotate(3deg) !important;
            border: 5px solid #FF006E !important;
            box-shadow: 0 0 30px rgba(255,0,110,0.5) !important;
        }
        
        /* 代码块美化 */
        code, pre {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: #FFBE0B !important;
            padding: 15px !important;
            border-radius: 10px !important;
            font-size: 1.2em !important;
            animation: code-glow 2s ease infinite !important;
        }
        
        @keyframes code-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(102,126,234,0.5); }
            50% { box-shadow: 0 0 30px rgba(118,75,162,0.8); }
        }
        
        /* 表格动感设计 */
        table {
            border-collapse: separate !important;
            border-spacing: 10px !important;
            animation: table-float 3s ease-in-out infinite !important;
        }
        
        @keyframes table-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        td, th {
            background: linear-gradient(45deg, rgba(255,190,11,0.3), rgba(255,0,110,0.3)) !important;
            padding: 15px !important;
            border-radius: 10px !important;
            font-size: 1.1em !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
        }
        
        td:hover, th:hover {
            transform: scale(1.1) rotate(-2deg) !important;
            background: #FF006E !important;
            color: white !important;
            box-shadow: 0 10px 20px rgba(255,0,110,0.5) !important;
        }
    `);

    // 为每个段落的文字添加独立动画
    function wrapTextInSpans() {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.children.length === 0 && p.textContent.length < 500) { // 避免处理过长文本
                const words = p.textContent.split(' ');
                p.innerHTML = words.map((word, index) => 
                    `<span style="animation-delay: ${index * 0.1}s">${word}</span>`
                ).join(' ');
            }
        });
    }

    // 添加随机颜色变化
    function addRandomColors() {
        const colors = ['#FF006E', '#FB5607', '#FFBE0B', '#06FFD', '#8338EC', '#3A86FF'];
        
        setInterval(() => {
            const headings = document.querySelectorAll('h1, h2, h3');
            headings.forEach(h => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                h.style.borderColor = randomColor;
            });
        }, 3000);
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        wrapTextInSpans();
        addRandomColors();
        console.log('🎨 ADHD超级视觉布局已启用！享受视觉盛宴！');
    });

    // 监听动态内容
    const observer = new MutationObserver(function(mutations) {
        setTimeout(wrapTextInSpans, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();