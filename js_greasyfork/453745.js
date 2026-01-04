// ==UserScript==
// @name         SideBarButtonLibrary
// @namespace    
// @version      2.0.0
// @description  SideBarButtonLibrary 是一个轻量级的 JavaScript 库，用于创建可展开和收起的侧边栏按钮容器，支持自定义吸附方向（左、右、上、下）、按钮排列方式（水平或垂直）以及样式，适用于快速构建侧边栏工具栏或导航菜单。
// @author       otc
// @match        *
// @license MIT
// ==/UserScript==

const SideBarButtonLibrary = (function() {
    // 默认配置
    const defaultConfig = {
        // 容器默认样式
        container: {
            width: '5px',               // 收起时宽度/高度
            expandedWidth: '150px',     // 展开时宽度
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            transition: 'width 0.3s ease',
            className: 'sidebar-button-container', // 默认类名
            position: 'left',           // 吸附位置：left/right/top/bottom
            flexDirection: 'column'     // 排列方向：row/column
        },
        // 按钮默认样式
        buttonStyles: {
            width: '140px',
            background: '#007bff',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            hoverBackground: '#0056b3', // 悬停背景颜色
            defaultBackground: '#007bff' // 默认背景颜色
        },
        // 删除按钮默认样式
        deleteButtonStyles: {
            right: '-30px',             // 收起时位置
            expandedRight: '10px',      // 展开时位置
            background: 'rgba(222, 55, 48, 0.8)',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'right 0.3s ease',
            padding: '5px 10px',        // 默认内边距
            fontSize: '14px',          // 默认字体大小
            border: 'none'             // 默认边框样式
        },
        // 动作延迟
        hoverDelay: 500,   // 悬停后展开延迟
        hideDelay: 1000    // 移出后收起延迟
    };

    // 私有函数：获取默认容器样式
    function getDefaultContainerStyles(config) {
        const baseStyles = {
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            zIndex: 10000,
            backgroundColor: config.container.backgroundColor,
            transition: config.container.transition
        };

        // 根据吸附位置调整样式
        switch (config.container.position) {
            case 'left':
                baseStyles.left = '0';
                baseStyles.top = '0';
                baseStyles.height = '100%';
                baseStyles.width = config.container.width;
                break;
            case 'right':
                baseStyles.right = '0';
                baseStyles.top = '0';
                baseStyles.height = '100%';
                baseStyles.width = config.container.width;
                break;
            case 'top':
                baseStyles.top = '0';
                baseStyles.left = '0';
                baseStyles.width = '100%';
                baseStyles.height = config.container.width;
                break;
            case 'bottom':
                baseStyles.bottom = '0';
                baseStyles.left = '0';
                baseStyles.width = '100%';
                baseStyles.height = config.container.width;
                break;
        }

        return baseStyles;
    }

    // 私有函数：创建或获取容器
    function getOrCreateButtonContainer(config) {
        let container = document.querySelector(`.${config.container.className}`);
        if (!container) {
            container = document.createElement('div');
            container.className = config.container.className;

            const styles = getDefaultContainerStyles(config);
            for (const [key, value] of Object.entries(styles)) {
                container.style[key] = value;
            }

            // 设置按钮排列方向
            container.style.flexDirection = config.container.flexDirection;

            // 创建删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '<span class="button-text">×</span>';
            deleteButton.style.position = 'absolute';

            // 根据吸附位置调整删除按钮的位置
            switch (config.container.position) {
                case 'left':
                case 'right':
                    deleteButton.style.top = '10px';
                    deleteButton.style.right = config.deleteButtonStyles.right;
                    break;
                case 'top':
                    deleteButton.style.right = '10px';
                    deleteButton.style.bottom = config.deleteButtonStyles.expandedRight;
                    break;
                case 'bottom':
                    deleteButton.style.right = '10px';
                    deleteButton.style.top = config.deleteButtonStyles.expandedRight;
                    break;
            }

            // 应用用户自定义的删除按钮样式
            const deleteStyles = { ...defaultConfig.deleteButtonStyles, ...config.deleteButtonStyles };
            for (const [key, value] of Object.entries(deleteStyles)) {
                deleteButton.style[key] = value;
            }

            deleteButton.addEventListener('click', () => {
                container.remove();
            });

            container.appendChild(deleteButton);

            // 鼠标悬停事件
            container.addEventListener('mouseenter', () => {
                clearTimeout(container.expandTimeout);
                clearTimeout(container.hideTimeout);

                container.expandTimeout = setTimeout(() => {
                    if (config.container.position === 'left' || config.container.position === 'right') {
                        container.style.width = config.container.expandedWidth;
                    } else {
                        container.style.height = config.container.expandedWidth;
                    }
                    deleteButton.style.right = config.deleteButtonStyles.expandedRight;
                    container.querySelectorAll('.button-text').forEach(text => {
                        text.style.opacity = 1;
                    });
                }, config.hoverDelay);
            });

            // 鼠标移出事件
            container.addEventListener('mouseleave', () => {
                clearTimeout(container.expandTimeout);

                container.hideTimeout = setTimeout(() => {
                    if (config.container.position === 'left' || config.container.position === 'right') {
                        container.style.width = config.container.width;
                    } else {
                        container.style.height = config.container.width;
                    }
                    deleteButton.style.right = config.deleteButtonStyles.right;
                    container.querySelectorAll('.button-text').forEach(text => {
                        text.style.opacity = 0;
                    });
                }, config.hideDelay);
            });

            document.body.appendChild(container);
        }
        return container;
    }

    // 公开接口：创建按钮
    function createButtons(buttons, config = {}) {
        const finalConfig = { ...defaultConfig, ...config };
        const container = getOrCreateButtonContainer(finalConfig);

        buttons.forEach((button, index) => {
            const buttonElement = document.createElement('button');
            buttonElement.innerHTML = `<span class="button-text">${button.name}</span>`;
            buttonElement.style.margin = '2px 0';
            buttonElement.style.width = finalConfig.buttonStyles.width;
            buttonElement.style.border = 'none';
            buttonElement.style.background = finalConfig.buttonStyles.defaultBackground;
            buttonElement.style.color = finalConfig.buttonStyles.color;
            buttonElement.style.borderRadius = finalConfig.buttonStyles.borderRadius;
            buttonElement.style.fontSize = finalConfig.buttonStyles.fontSize;
            buttonElement.style.cursor = finalConfig.buttonStyles.cursor;
            buttonElement.style.transition = finalConfig.buttonStyles.transition;

            const buttonText = buttonElement.querySelector('.button-text');
            buttonText.style.opacity = 0;
            buttonText.style.transition = 'opacity 0.3s ease';

            // 使用配置中的悬停和默认样式
            buttonElement.addEventListener('mouseover', () => {
                buttonElement.style.background = finalConfig.buttonStyles.hoverBackground;
            });
            buttonElement.addEventListener('mouseout', () => {
                buttonElement.style.background = finalConfig.buttonStyles.defaultBackground;
            });

            buttonElement.addEventListener('click', button.func);

            container.appendChild(buttonElement);
        });
    }

    // 暴露公共接口
    return {
        createButtons: createButtons
    };
})();

// 使用示例
// SideBarButtonLibrary.createButtons([
//     { name: 'Button 1', func: () => alert('Button 1 clicked') },
//     { name: 'Button 2', func: () => alert('Button 2 clicked') }
// ], {
//     container: {
//         width: '5px',               // 自定义收起宽度/高度
//         expandedWidth: '200px',     // 自定义展开宽度
//         backgroundColor: 'rgba(0, 0, 0, 0.2)', // 自定义背景颜色
//         className: 'my-custom-sidebar-container', // 自定义容器类名
//         position: 'top',            // 吸附到顶部
//         flexDirection: 'row'        // 按钮水平排列
//     },
//     buttonStyles: {
//         width: '180px',             // 自定义按钮宽度
//         background: '#ff5722',      // 自定义按钮默认背景
//         hoverBackground: '#cc4400', // 自定义按钮悬停背景
//         defaultBackground: '#ff5722' // 自定义按钮默认背景
//     },
//     deleteButtonStyles: {
//         right: '-40px',             // 自定义收起时删除按钮位置
//         expandedRight: '20px',      // 自定义展开时删除按钮位置
//         background: 'rgba(255, 0, 0, 0.8)', // 自定义删除按钮背景颜色
//         color: '#000'               // 自定义删除按钮字体颜色
//     },
//     hoverDelay: 300,                // 自定义悬停延迟
//     hideDelay: 800                  // 自定义隐藏延迟
// });