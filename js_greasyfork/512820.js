// ==UserScript==
// @name        替换当前页所有图片的src
// @namespace   http://tampermonkey.net/
// @match       *://localhost:*/*
// @match       *://www.cbadvert.com/*
// @match       *://*javdb*.com/*
// @match       *://javdb*.com/*
// @match       *://javdb.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @version     1.0.1
// @author      slowFever
// @description 替换当前页所有图片的src，鼠标移过图片时，显示原始图片，一键切换/复原！
// @icon        data:image/png;base64,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
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/512820/%E6%9B%BF%E6%8D%A2%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E7%9A%84src.user.js
// @updateURL https://update.greasyfork.org/scripts/512820/%E6%9B%BF%E6%8D%A2%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E7%9A%84src.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化面板
    initPanel();

    // 节点池
    const nodesList = {
        'button': document.querySelector('#operation .status-button'),
        'images': document.querySelectorAll('img')
    }

    /**
     * @description 添加样式到页面
     * @returns {void}
     */
    function addStyle() {
        let style = document.createElement('style');
        style.innerHTML = `
            #operation {
                position: fixed;
                top: 25%;
                left: 0;
                -webkit-transform: translateY(-50%);
                -moz-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                -o-transform: translateY(-50%);
                transform: translateY(-50%);
                padding: 5px;
                z-index: 999999;
                pointer-events: none;
            }

            #operation .operation-wrap {
                -webkit-transform: translateX(-90%);
                -moz-transform: translateX(-90%);
                -ms-transform: translateX(-90%);
                -o-transform: translateX(-90%);
                transform: translateX(-90%);
                -webkit-transition: 0.5s;
                -o-transition: 0.5s;
                -moz-transition: 0.5s;
                transition: 0.5s;
                pointer-events: auto;
            }
            
            #operation button {
                outline: none;
                cursor: pointer;
                border: none;
                padding: 0.9rem 3rem;
                margin: 0;
                font-family: inherit;
                font-size: inherit;
                position: relative;
                display: inline-block;
                letter-spacing: 0.05rem;
                font-weight: 700;
                font-size: 17px;
                border-radius: 500px;
                overflow: hidden;
                background: rgb(32, 156, 238);
                color: #000;
            }
            
            #operation button span {
                position: relative;
                z-index: 10;
                -webkit-transition: color 1s;
                -o-transition: color 1s;
                -moz-transition: color 1s;
                transition: color 1s;
            }
            
            #operation button:hover span {
                color: ghostwhite;
            }
            
            #operation button::before,
            #operation button::after {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
            }
            
            #operation button::before {
                content: "";
                background: linear-gradient(120deg, rgba(255,255,255,0.7), rgba(0,191,255,0.4));
                width: 120%;
                left: -10%;
                -webkit-transform: skew(30deg);
                -moz-transform: skew(30deg);
                -ms-transform: skew(30deg);
                -o-transform: skew(30deg);
                transform: skew(30deg);
                -webkit-transition: -webkit-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
                transition: -webkit-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
                -o-transition: -o-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
                -moz-transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1), -moz-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
                transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
                transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1), -webkit-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1), -moz-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1), -o-transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
            }
            
            #operation button:hover::before {
                -webkit-transform: translate3d(100%, 0, 0);
                -moz-transform: translate3d(100%, 0, 0);
                transform: translate3d(100%, 0, 0);
            }
            
            #operation .operation-wrap:hover {
                -webkit-transform: translateX(0) !important;
                -moz-transform: translateX(0) !important;
                -ms-transform: translateX(0) !important;
                -o-transform: translateX(0) !important;
                transform: translateX(0) !important;
            }
            
        `;
        document.head.appendChild(style);
    }

    /**
     * @description 创建操作面板
     * @returns {void}
     */
    function createPanel() {
        const panelHTML = `
        <div id="operation">
            <div class="operation-wrap">
                <button class="status-button">
                    <span>hide</span>
                </button>
            </div>
        </div>
    `;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = panelHTML;
        console.log(wrapper.firstElementChild);
        document.body.appendChild(wrapper.firstElementChild);
    }

    /**
     * @description 初始化操作面板
     * @returns {void}
     */
    function initPanel() {
        addStyle();
        createPanel();
    }

    // 获取本地存储的状态
    let isReplacingImages = GM_getValue('isReplacingImages', false);

    // 根据本地存储的状态，初始化面板
    if (isReplacingImages) {
        replaceImagesWithCanvasText();
        nodesList.button.innerHTML = '<span>show</span>';
    } else {
        restoreOriginalImages();
        nodesList.button.innerHTML = '<span>hide</span>';
    }

    // 监听按钮的点击事件
    nodesList.button.addEventListener('click', () => {
        isReplacingImages = !isReplacingImages;
        GM_setValue('isReplacingImages', isReplacingImages); // 保存状态
        if (isReplacingImages) {
            replaceImagesWithCanvasText();
            nodesList.button.innerHTML = '<span>show</span>';
            GM_notification('图片已被替换', '操作成功');
        } else {
            // 调用函数，替换页面上的所有图片
            restoreOriginalImages();
            nodesList.button.innerHTML = '<span>hide</span>';
            GM_notification('原始图片已恢复', '操作成功');
        }
    })

    // 存储链接模式的数组
    const urlPatterns = [
        /:\/\/.*javdb.*\.com\//,
    ];

    /**
     * @description 检查当前 URL 是否匹配任意一个模式
     * @param {Array<RegExp>} patterns 链接模式数组
     * @returns {boolean} 是否匹配
     */
    function matchesUrlPattern(patterns) {
        return patterns.some(pattern => pattern.test(window.location.href));
    }

    // 监听当前页面 URL，替换图片
    if (matchesUrlPattern(urlPatterns)) {
        console.log('URL 匹配，自动执行脚本')

        // 改变 isReplacingImages 的值
        isReplacingImages = true;
        GM_setValue('isReplacingImages', isReplacingImages);

        window.addEventListener('load', () => {
            replaceImagesWithCanvasText();
            GM_notification('图片已被替换', '操作成功');
        });
    }

    /**
     * @description 替换页面上的所有图片为带有自定义文本的 Canvas 图像
     * @param {string} [text='18+'] - 显示在 Canvas 上的文本
     * @param {string} [circleColor='red'] - 圆圈的颜色
     * @param {string} [textColor='white'] - 文本的颜色
     * @param {string} [backgroundColor='gray'] - 背景颜色
     * @param {number} [transitionTime=0.5] - 过渡时间（秒）
     * @returns {void}
     */
    function replaceImagesWithCanvasText(text = '18+', circleColor = 'red', textColor = 'white', backgroundColor = 'gray', transitionTime = 0.5) {
        console.log(`脚本挂载成功，获取到${nodesList.images.length}张图片，当前版本：${GM_info.script.version}`);
        nodesList.images.forEach(img_node => {
            if (!img_node.dataset.originalSrc) {
                // 保存原始图片的 src
                img_node.dataset.originalSrc = img_node.src; // 存储在 data-original-src 属性中
            }

            // 创建一个新的 Image 对象以加载原始图片
            const originalImage = new Image();
            originalImage.src = img_node.dataset.originalSrc;

            originalImage.onload = () => {
                // 获取原图的宽高
                const width = originalImage.width;
                const height = originalImage.height;

                // 创建一个 canvas 元素
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                // 在 canvas 上绘制新图片
                const ctx = canvas.getContext('2d');

                // 绘制灰色背景
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);

                // 绘制红色圆圈
                const radius = Math.min(width, height) / 4; // 圆圈半径
                ctx.fillStyle = circleColor;
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
                ctx.fill();

                // 绘制白色边框
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#fff';
                ctx.stroke();

                // 绘制白色文字
                ctx.fillStyle = textColor;
                ctx.font = `${radius * 0.8}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, width / 2, height / 2);

                // 将 canvas 转换为 data URL
                const newSrc = canvas.toDataURL();

                // 设置 img_node 的 src 为新的图片
                img_node.src = newSrc;

                // 设置渐隐效果
                img_node.style.transition = `opacity ${transitionTime}s`;
                img_node.style.opacity = 1;

                img_node.addEventListener('mouseover', () => {
                    if (isReplacingImages) {
                        img_node.style.opacity = 0; // 渐隐新图片
                        setTimeout(() => {
                            img_node.src = img_node.dataset.originalSrc; // 替换为原始图片 src
                            img_node.style.opacity = 1; // 渐显原始图片
                        }, transitionTime * 1000); // 设置一个延迟，与过渡时间匹配
                    }
                });

                img_node.addEventListener('mouseout', () => {
                    if (isReplacingImages) {
                        img_node.style.opacity = 0; // 渐隐原始图片
                        setTimeout(() => {
                            img_node.src = newSrc; // 重新设置为新图片 src
                            img_node.style.opacity = 1; // 渐显新图片
                        }, transitionTime * 1000); // 设置一个延迟，与过渡时间匹配
                    }
                });
            };
        });
    }

    /**
     * @description 还原图片
     * @returns {void}
     */
    function restoreOriginalImages() {
        nodesList.images.forEach(img_node => {
            if (img_node.dataset.originalSrc) {
                img_node.src = img_node.dataset.originalSrc;
            }
        });
        // console.log('已恢复原始图片');
    }
})();
