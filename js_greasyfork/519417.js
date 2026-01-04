// ==UserScript==
// @name         Bolt Prompt Selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add prompt selector for bolt.new
// @author       Your name
// @match        https://bolt.new/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519417/Bolt%20Prompt%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/519417/Bolt%20Prompt%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        // 清理已存在的元素
        const cleanup = () => {
            const existingTooltip = document.querySelector('.prompt-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
        };
        cleanup();

        // 检查是否已注入
        if (document.querySelector('.prompt-container')) {
            return;
        }

        // 检查必要的DOM元素
        const targetElement = document.querySelector('.z-prompt');
        if (!targetElement) {
            console.log('Target element not found, waiting...');
            return;
        }

        const textarea = document.querySelector('textarea.w-full');
        if (!textarea) {
            console.log('Textarea not found, waiting...');
            return;
        }

        const promptList = [
        {
            title: "DRY原则和数据视图分离",
            prompt: "遵循DRY(Don't Repeat Yourself)原则，将数据逻辑与视图逻辑分离。使用专门的数据层处理状态和业务逻辑，通过props或context传递给视图组件。",
            group: "Architecture"
        },
        {
            title: "类型定义优先",
            prompt: "在实现具体功能前，优先定义完整的TypeScript类型和接口。包括API响应类型、组件Props类型、状态类型等。",
            group: "Architecture"
        },
        {
            title: "模块化开发",
            prompt: "将代码按功能模块化，每个模块应该是独立的、可测试的单元。",
            group: "Architecture"
        },
        {
            title: "Shadcn UI优先",
            prompt: "优先使用Shadcn UI组件库构建界面。避免重复造轮子。",
            group: "UI"
        },
        {
            title: "响应式设计规范",
            prompt: "使用Tailwind的响应式前缀(sm:、md:、lg:)构建响应式布局。移动端优先，确保在各种设备上都有良好的显示效果。",
            group: "UI"
        },
        {
            title: "主题定制规范",
            prompt: "在globals.css中集中管理主题变量。使用Shadcn UI的主题系统，通过CSS变量统一管理颜色、字体等样式。",
            group: "UI"
        },
        {
            title: "表单字段验证",
            prompt: "使用Zod进行表单验证，为每个表单创建专门的验证schema。必填字段使用.required()，可选字段使用.optional()。错误信息应该明确友好。",
            group: "Form"
        },
        {
            title: "表单布局规范",
            prompt: "表单采用紧凑(compact)布局，简单input字段同行显示，最多两列。较复杂的字段独占一行。",
            group: "Form"
        },
        {
            title: "表单状态管理",
            prompt: "使用React Hook Form管理表单状态。实现实时验证、提交处理、错误展示等完整表单生命周期。",
            group: "Form"
        },
        {
            title: "Server Components优先",
            prompt: "优先使用Server Components处理数据获取。合理使用use server和use client指令。避免不必要的客户端渲染。",
            group: "Data"
        },
        {
            title: "缓存策略",
            prompt: "根据数据特点设置合适的缓存策略。使用Next.js的缓存API。实现适当的重验证机制。",
            group: "Data"
        },
        {
            title: "元数据管理",
            prompt: "使用Next.js的Metadata API管理SEO元数据。在layout.tsx和page.tsx中设置动态metadata。确保title、description等关键标签完整。",
            group: "SEO"
        },
        {
            title: "结构化数据",
            prompt: "实现JSON-LD结构化数据。针对不同类型的页面(文章、商品、评论等)使用对应的Schema标记。验证结构化数据的正确性。",
            group: "SEO"
        },
        {
            title: "语义化HTML",
            prompt: "使用语义化的HTML标签构建页面结构。合理使用heading层级(h1-h6)。使用article、section、nav等语义化标签标识内容区域。",
            group: "SEO"
        },
        {
            title: "图片优化SEO",
            prompt: "图片添加有意义的alt文本。使用Next.js的Image组件自动优化图片。考虑使用srcset提供响应式图片。添加图片的width和height避免布局偏移。",
            group: "SEO"
        },
        {
            title: "性能优化SEO",
            prompt: "确保核心Web指标(Core Web Vitals)达标。包括LCP、FID、CLS等指标的优化。使用next/dynamic实现代码分割。",
            group: "SEO"
        },
        {
            title: "国际化SEO",
            prompt: "使用i18next实现多语言支持，语言文件存储在app/i18n/locales文件夹中。添加合适的hreflang标签。考虑内容的本地化需求。",
            group: "SEO"
        },
        {
            title: "统一错误处理",
            prompt: "实现统一的错误边界处理组件。API调用使用try-catch包装，展示友好的错误提示。记录错误日志便于追踪。",
            group: "Error"
        },
        {
            title: "加载状态处理",
            prompt: "实现统一的加载状态组件。使用Suspense和loading.tsx处理路由切换。接口调用时展示适当的加载提示。",
            group: "Error"
        },
        {
            title: "图片优化",
            prompt: "使用Next.js的Image组件处理图片。设置合适的宽高、质量参数。使用BlurHash等技术优化加载体验。",
            group: "Performance"
        },
        {
            title: "状态管理优化",
            prompt: "合理使用React状态管理。局部状态用useState，跨组件状态用Context，复杂状态考虑使用Zustand等轻量级方案。",
            group: "Performance"
        },
        {
            title: "Code Splitting",
            prompt: "使用Next.js的动态导入功能(dynamic import)实现代码分割。路由级别的组件默认分割，大型组件或库考虑按需加载。",
            group: "Performance"
        }
    ].map(item => ({ ...item, selected: false }));

        // 创建容器
        const container = document.createElement('div');
        container.classList.add('prompt-container');
        container.style.cssText = 'width:502px;max-height:300px;overflow-y:auto;background:#1a1a1a;padding:8px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-family:system-ui,-apple-system;scrollbar-width:thin;scrollbar-color:#4a4a4a #1a1a1a;opacity:0;transform:translateY(-10px);transition:all 0.2s ease;display:none;';
        container.onscroll = (e) => e.stopPropagation();

        // 创建tooltip
        const tooltip = document.createElement('div');
        tooltip.classList.add('prompt-tooltip');
        tooltip.style.cssText = `
            position: fixed;
            padding: 8px 12px;
            background: #2d2d2d;
            border: 1px solid #404040;
            border-radius: 6px;
            font-size: 13px;
            color: #e5e7eb;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            pointer-events: none;
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 0.2s, transform 0.2s;
            z-index: 9999;
            line-height: 1.5;
            font-family: system-ui, -apple-system;
            word-break: break-word;
        `;
        document.body.appendChild(tooltip);

        // 辅助函数：设置textarea的值
        const setTextareaValue = (textarea, value) => {
            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                nativeInputValueSetter.call(textarea, value);
                const event = new Event('input', { bubbles: true });
                textarea.dispatchEvent(event);
            } catch (error) {
                console.error('Error setting textarea value:', error);
            }
        };

        // 按组分类
        const groups = promptList.reduce((acc, item) => {
            if (!acc[item.group]) {
                acc[item.group] = [];
            }
            acc[item.group].push(item);
            return acc;
        }, {});

        // 渲染按钮
        const renderButtons = () => {
            try {
                Object.entries(groups).forEach(([groupName, items]) => {
                    const groupDiv = document.createElement('div');
                    groupDiv.style.cssText = 'margin:4px 0;';

                    const groupLabel = document.createElement('div');
                    groupLabel.textContent = groupName;
                    groupLabel.style.cssText = 'color:#6b7280;font-size:12px;padding:0 4px;margin-bottom:2px;';
                    groupDiv.appendChild(groupLabel);

                    const buttonsContainer = document.createElement('div');
                    buttonsContainer.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:4px;';

                    items.forEach(item => {
                        const button = document.createElement('button');
                        button.textContent = item.title;

                        const getButtonStyles = (isSelected, isHovered = false) => `
                            display:block;
                            width:100%;
                            padding:6px 10px;
                            border:1px solid ${isSelected ? '#4CAF50' : '#333'};
                            border-radius:4px;
                            background:${isSelected ? '#1b4a1f' : isHovered ? '#2f2f2f' : '#242424'};
                            color:${isSelected ? '#4CAF50' : '#e5e7eb'};
                            font-size:13px;
                            text-align:left;
                            cursor:${isSelected ? 'not-allowed' : 'pointer'};
                            transition:all 0.2s;
                            white-space:nowrap;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            opacity:${isSelected ? '0.8' : '1'};
                        `;

                        button.style.cssText = getButtonStyles(item.selected);

                        // Hover events for tooltip
                        button.addEventListener('mouseenter', (e) => {
                            const rect = e.target.getBoundingClientRect();
                            tooltip.textContent = item.prompt;
                            tooltip.style.opacity = '1';
                            tooltip.style.transform = 'translateY(0)';

                            // Calculate best position
                            const tooltipRect = tooltip.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const spaceAbove = rect.top;

                            if (spaceBelow >= tooltipRect.height + 8) {
                                tooltip.style.top = `${rect.bottom + 8}px`;
                            } else if (spaceAbove >= tooltipRect.height + 8) {
                                tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
                            } else {
                                tooltip.style.top = `${window.innerHeight/2 - tooltipRect.height/2}px`;
                            }

                            let left = rect.left;
                            if (left + tooltipRect.width > window.innerWidth - 20) {
                                left = window.innerWidth - tooltipRect.width - 20;
                            }
                            tooltip.style.left = `${Math.max(20, left)}px`;
                        });

                        button.addEventListener('mouseleave', () => {
                            tooltip.style.opacity = '0';
                            tooltip.style.transform = 'translateY(4px)';
                        });

                        button.onmouseover = () => !item.selected && (button.style.cssText = getButtonStyles(item.selected, true));
                        button.onmouseout = () => !item.selected && (button.style.cssText = getButtonStyles(item.selected));

                        button.onclick = (e) => {
                            if (item.selected) return;
                            e.stopPropagation();
                            const textarea = document.querySelector('textarea.w-full');
                            if (textarea) {
                                const currentValue = textarea.value;
                                setTextareaValue(textarea, currentValue + (currentValue && currentValue.trim() ? '  ' : '') + item.prompt);
                                item.selected = true;
                                button.style.cssText = getButtonStyles(true);
                            }
                        };

                        buttonsContainer.appendChild(button);
                    });

                    groupDiv.appendChild(buttonsContainer);
                    container.appendChild(groupDiv);
                });
            } catch (error) {
                console.error('Error rendering buttons:', error);
            }
        };

        // 初始渲染
        renderButtons();

        // 插入容器
        targetElement.insertBefore(container, targetElement.firstChild);

        // 显示/隐藏容器的函数
        const showContainer = () => {
            container.style.display = 'block';
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 10);
        };

        const hideContainer = () => {
            promptList.forEach(item => item.selected = false);
            container.innerHTML = '';
            renderButtons();
            container.style.opacity = '0';
            container.style.transform = 'translateY(-10px)';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(4px)';
            setTimeout(() => {
                container.style.display = 'none';
            }, 200);
        };

        // 事件监听
        textarea.addEventListener('focus', showContainer);
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && e.target !== textarea) {
                hideContainer();
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations, obs) => {
        const targetElement = document.querySelector('.z-prompt');
        if (targetElement) {
            init();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();