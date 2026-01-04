// ==UserScript==
// @name         Emby Local PotPlayer Launcher (Moke)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Fixed version with reliable button injection
// @author       Moke
// @match        *://*/web/index.html
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/531412/Emby%20Local%20PotPlayer%20Launcher%20%28Moke%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531412/Emby%20Local%20PotPlayer%20Launcher%20%28Moke%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 配置对象
    const config = {
        buttonId: "embyLocalPotPlayerBtn",
        buttonClass: "detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary",
        buttonIcon: "icon-PotPlayer",
        buttonText: "本地PotPlayer",
        debugMode: false,
        potPlayerIconUrl: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-PotPlayer.webp",
        maxInitAttempts: 10,
        initDelay: 500,
        buttonTimeout: 3000
    };

    let initAttempts = 0;

    // 2. 工具函数
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        log(...args) {
            if (config.debugMode) {
                console.log(...args);
            }
        },
        
        error(...args) {
            console.error(...args);
        }
    };

    // 1. 添加 canPlayLocally 函数定义
    function canPlayLocally(itemInfo) {
        if (!itemInfo || !itemInfo.MediaSources || itemInfo.MediaSources.length === 0) {
            return false;
        }
        return itemInfo.MediaSources.some(source => source.Path && source.Path.length > 0 && 
            /^[a-zA-Z]:\\/.test(source.Path));
    }

    // 2. 修改 init 函数中的错误处理
    function init() {
        try {
            let playBtns = document.getElementById(config.buttonId);
            if (playBtns) {
                playBtns.remove();
            }
            
            let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
            if (!mainDetailButtons) {
                if (config.debugMode) {
                    console.log("未找到按钮容器，稍后重试");
                }
                return;
            }

            const buttonHtml = `
                <button id="${config.buttonId}"
                        type="button"
                        class="${config.buttonClass}"
                        title="使用本地PotPlayer播放 (请确保已安装PotPlayer并注册了协议处理程序)"
                        style="margin-left: 8px">
                    <div class="detailButton-content">
                        <i class="md-icon detailButton-icon button-icon button-icon-left ${config.buttonIcon}">　</i>
                        <span class="button-text">${config.buttonText}</span>
                    </div>
                </button>
            `;

            mainDetailButtons.insertAdjacentHTML('beforeend', buttonHtml);
            
            const button = document.getElementById(config.buttonId);
            if (button) {
                const iconElement = button.querySelector(`.${config.buttonIcon}`);
                if (iconElement) {
                    iconElement.style.cssText += `background: url(${config.potPlayerIconUrl}) no-repeat;background-size: 100% 100%;font-size: 1.4em`;
                }
                
                // 移除旧的事件监听器（如果有）
                button.removeEventListener('click', launchLocalPotPlayer);
                
                // 添加新的事件监听器
                button.addEventListener('click', launchLocalPotPlayer);
                
                // 添加额外的点击反馈
                button.addEventListener('mousedown', function() {
                    this.style.opacity = '0.7';
                });
                
                button.addEventListener('mouseup', function() {
                    this.style.opacity = '1';
                });
                
                if (config.debugMode) {
                    console.log("按钮已成功添加并绑定事件");
                }

                // 检查当前媒体是否支持本地播放
                const itemId = window.location.hash.match(/id=([^&]+)/)?.[1];
                if (itemId) {
                    ApiClient.getItem(ApiClient._serverInfo.UserId, itemId)
                        .then(itemInfo => {
                            if (button && itemInfo) {
                                button.style.display = canPlayLocally(itemInfo) ? '' : 'none';
                            }
                        })
                        .catch(error => {
                            console.error("检查媒体播放能力时出错:", error);
                            if (button) {
                                button.style.display = 'none';
                            }
                        });
                }
            }
        } catch (error) {
            console.error("初始化过程出错:", error);
        }
    }

    // 4. 显示检查函数
    function showFlag() {
        let mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
        if (!mainDetailButtons) {
            return false;
        }
        let videoElement = document.querySelector("div[is='emby-scroller']:not(.hide) .selectVideoContainer");
        if (videoElement && videoElement.classList.contains("hide")) {
            return false;
        }
        let audioElement = document.querySelector("div[is='emby-scroller']:not(.hide) .selectAudioContainer");
        return !(audioElement && audioElement.classList.contains("hide"));
    }

    // 3. 修改事件监听逻辑
    document.addEventListener("viewbeforeshow", function (e) {
        try {
            if (e.detail?.contextPath?.startsWith("/item?id=")) {
                if (config.debugMode) {
                    console.log("检测到项目页面加载:", e.detail.contextPath);
                }
                
                // 使用更可靠的方式等待DOM准备好
                const checkAndInit = () => {
                    if (showFlag()) {
                        if (config.debugMode) {
                            console.log("DOM已准备好，初始化按钮");
                        }
                        init();
                        return true;
                    }
                    return false;
                };
                
                // 立即尝试一次
                if (!checkAndInit()) {
                    // 如果失败，设置观察器和定时器
                    const observer = new MutationObserver(() => {
                        if (checkAndInit()) {
                            observer.disconnect();
                        }
                    });
                    
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    
                    // 设置备用定时器，确保按钮最终会被添加
                    let attempts = 0;
                    const maxAttempts = 10;
                    const interval = setInterval(() => {
                        attempts++;
                        if (checkAndInit() || attempts >= maxAttempts) {
                            clearInterval(interval);
                            observer.disconnect();
                            
                            if (attempts >= maxAttempts && config.debugMode) {
                                console.log("达到最大尝试次数，停止尝试初始化按钮");
                            }
                        }
                    }, 500);
                }
            }
        } catch (error) {
            console.error("viewbeforeshow 事件处理出错:", error);
        }
    });

    function normalizePath(path) {
        // 解码路径并统一分隔符
        let decodedPath = decodeURIComponent(path)
            .replace(/\//g, '\\')
            .replace(/^file:\/\//, '');
        
        // 检查是否是有效的Windows路径
        if (!/^[a-zA-Z]:\\/.test(decodedPath)) {
            throw new Error("无效的本地路径");
        }
        
        if (config.debugMode) {
            console.log("规范化后的路径:", decodedPath);
        }
        
        return decodedPath;
    }

    async function launchPlayer(decodedPath, button) {
        const buttonText = button.querySelector('.button-text');
        
        try {
            // 规范化路径
            const normalizedPath = decodedPath
                .replace(/\//g, '\\')  // 统一使用反斜杠
                .replace(/^\\+|\\+$/g, ''); // 移除开头和结尾的斜杠
            
            // 使用自定义协议
            const encodedPath = encodeURIComponent(normalizedPath);
            const customUrl = `embyplayer://${encodedPath}`;
            
            if (config.debugMode) {
                console.log("原始路径:", decodedPath);
                console.log("规范化路径:", normalizedPath);
                console.log("编码后路径:", encodedPath);
                console.log("完整协议URL:", customUrl);
            }
            
            // 使用 window.open 在当前窗口打开URL
            window.open(customUrl, "_self");
            buttonText.textContent = "已启动";
            return true;
        } catch (error) {
            throw new Error(`启动失败: ${error.message}`);
        }
    }

    async function getLocalFilePath() {
        try {
            // 从URL获取itemId
            const itemId = window.location.hash.match(/id=([^&]+)/)?.[1];
            if (!itemId) {
                throw new Error("无法获取项目ID");
            }

            if (config.debugMode) {
                console.log("正在获取媒体信息，itemId:", itemId);
            }

            // 获取用户ID和项目信息
            const userId = ApiClient._serverInfo.UserId;
            const itemInfo = await ApiClient.getItem(userId, itemId);

            if (config.debugMode) {
                console.log("获取到的项目信息:", itemInfo);
            }

            // 检查媒体源
            if (!itemInfo?.MediaSources?.length) {
                console.error("媒体源信息不完整:", itemInfo);
                throw new Error("没有可用的媒体源");
            }

            // 获取选中的媒体源
            const selectElement = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSource");
            let mediaSource;

            if (selectElement?.value) {
                mediaSource = itemInfo.MediaSources.find(m => m.Id === selectElement.value);
                if (config.debugMode) {
                    console.log("使用选中的媒体源:", {
                        selectedValue: selectElement.value,
                        mediaSource: mediaSource
                    });
                }
            }

            // 如果没有找到选中的媒体源，使用第一个可用的媒体源
            if (!mediaSource) {
                mediaSource = itemInfo.MediaSources[0];
                if (config.debugMode) {
                    console.log("使用默认媒体源:", mediaSource);
                }
            }

            // 检查媒体源路径
            if (!mediaSource?.Path) {
                if (config.debugMode) {
                    console.log("完整的媒体源信息:", mediaSource);
                    console.log("可用的媒体源列表:", itemInfo.MediaSources);
                }
                throw new Error("媒体源没有本地路径信息");
            }

            // 检查路径格式
            const path = mediaSource.Path;
            if (config.debugMode) {
                console.log("原始媒体路径:", path);
            }

            // 检查是否是网络路径
            if (path.startsWith('http://') || path.startsWith('https://')) {
                throw new Error("不支持网络路径，请确保媒体文件在本地可访问");
            }

            // 检查路径是否包含必要的驱动器信息（Windows路径）
            if (!/^[a-zA-Z]:\\/.test(path)) {
                throw new Error("无效的本地路径格式");
            }

            return path;

        } catch (error) {
            console.error("获取本地路径详细错误:", {
                error: error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    // 修改 launchLocalPotPlayer 函数中的错误处理
    function launchLocalPotPlayer(event) {
        // 阻止事件冒泡和默认行为
        event.preventDefault();
        event.stopPropagation();
        
        if (config.debugMode) {
            console.log("按钮被点击");
        }
        
        const button = this;
        const buttonText = button.querySelector('.button-text');
        
        // 防止重复点击
        if (button.getAttribute('data-processing') === 'true') {
            if (config.debugMode) {
                console.log("按钮正在处理中，忽略重复点击");
            }
            return;
        }
        
        button.setAttribute('data-processing', 'true');
        
        const handleLaunch = async () => {
            try {
                button.disabled = true;
                buttonText.textContent = "启动中...";
                
                if (config.debugMode) {
                    console.log("开始处理启动逻辑");
                }

                const localPath = await getLocalFilePath();
                
                if (!localPath) {
                    throw new Error("无法获取媒体路径");
                }

                if (config.debugMode) {
                    console.log("获取到的本地路径:", localPath);
                }

                const decodedPath = normalizePath(localPath);
                if (config.debugMode) {
                    console.log("处理后的路径:", decodedPath);
                }
                
                const success = await launchPlayer(decodedPath, button);
                if (!success) {
                    throw new Error("启动失败");
                }
            } catch (error) {
                console.error("启动失败:", error);
                // 显示更友好的错误信息
                let errorMessage = error.message;
                if (errorMessage.includes("媒体源没有本地路径信息")) {
                    errorMessage = "该媒体不支持本地播放";
                }
                buttonText.textContent = `失败: ${errorMessage}`;
            } finally {
                setTimeout(() => {
                    button.disabled = false;
                    button.setAttribute('data-processing', 'false');
                    buttonText.textContent = config.buttonText;
                }, 3000);
            }
        };

        handleLaunch().catch(error => {
            console.error("处理启动时发生错误:", error);
            button.setAttribute('data-processing', 'false');
        });
    }

    // 初始立即执行
    setTimeout(init, 1000);
    console.log("脚本初始化开始...");
})();