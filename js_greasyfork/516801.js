// ==UserScript==
// @name         [哔哩哔哩直播]---弹幕反诈与防河蟹
// @version      3.7.1
// @description  本脚本会提示你在直播间发送的弹幕是否被秒删，被什么秒删，有助于用户规避河蟹词，避免看似发了弹幕结果主播根本看不到，不被发送成功的谎言所欺骗！
// @author       Asuna
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL 3.0
// @match        *://live.bilibili.com/1*
// @match        *://live.bilibili.com/2*
// @match        *://live.bilibili.com/3*
// @match        *://live.bilibili.com/4*
// @match        *://live.bilibili.com/5*
// @match        *://live.bilibili.com/6*
// @match        *://live.bilibili.com/7*
// @match        *://live.bilibili.com/8*
// @match        *://live.bilibili.com/9*
// @match        *://live.bilibili.com/blanc/1*
// @match        *://live.bilibili.com/blanc/2*
// @match        *://live.bilibili.com/blanc/3*
// @match        *://live.bilibili.com/blanc/4*
// @match        *://live.bilibili.com/blanc/5*
// @match        *://live.bilibili.com/blanc/6*
// @match        *://live.bilibili.com/blanc/7*
// @match        *://live.bilibili.com/blanc/8*
// @match        *://live.bilibili.com/blanc/9*
// @run-at       document-start
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/segmentit@2.0.3/dist/umd/segmentit.min.js
// @namespace https://greasyfork.org/users/1390050
// @downloadURL https://update.greasyfork.org/scripts/516801/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D---%E5%BC%B9%E5%B9%95%E5%8F%8D%E8%AF%88%E4%B8%8E%E9%98%B2%E6%B2%B3%E8%9F%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/516801/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D---%E5%BC%B9%E5%B9%95%E5%8F%8D%E8%AF%88%E4%B8%8E%E9%98%B2%E6%B2%B3%E8%9F%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //全局配置选项
    const globalConfig = {
        // 高级功能开关：true=启用所有功能，false=仅基础检测
        advancedFeaturesEnabled: true,

        // 脚本配置
        msgTime: 7000,              // 脚本加载消息计时器
        exp: 1,                      // 弹幕同屏发送次数，默认为1
        successSend: true,           // 发送成功的回调开关，如不需要启用则填写false

        // 弹幕样式配置
        banColorSystem: "#90EE90",   // 系统屏蔽弹幕颜色
        banColorUser: "deepskyblue", // 主播屏蔽弹幕颜色
        successColor: "DarkCyan",    // 成功颜色
        errorColor: "Crimson",       // 错误颜色

        // 弹幕显示位置
        dmLeft: '-16%',              // 默认固定从左侧开始滚动的位置
        dmTop: '50%',                // 弹幕距离顶部的位置，如果想要随机可以替换为：${Math.random() * 100}%
        dmFontSize: '36px',          // 弹幕字号

        // 弹幕提示消息
        banSystemMsg: "发送失败：你的弹幕被系统秒删，修改关键词后重新发吧",
        banUserMsg: "发送失败：你的弹幕被主播删除，看来主播不喜欢某些关键词",
        successLoadMsg: "弹幕反诈与防河蟹脚本加载完毕！",
        successMsg: "恭喜，你的弹幕正常显示！",
        errorMsg: "[弹幕反诈] use window mode (your userscript extensions not support unsafeWindow)",
        errorSendMsg: "发送失败：捕获到的未知错误，详情请检查控制台输出日志！"
    };

    // 敏感词管理器初始化配置
    // 此处的所有配置仅限高级功能生效，如关闭了高级选项请忽略
    const sensitiveWordsConfig = {
        // 默认配置参数，仅在初始化时有效，初始化配置修改此处
        defaultConfig: {
            // 是否启用敏感词检测
            enabled: true,
            // 是否区分大小写
            caseSensitive: false,
            // 是否启用模糊匹配
            fuzzyMatch: true,
            // 是否启用分词器测试
            enableSegmentationTest: false,
            // 是否默认显示弹幕记录板
            showLogBoxByDefault: true,
            // 弹幕记录板容量限制
            logBoxCapacity: 50,
            // 默认导出格式：'txt' 或 'csv'
            exportFormat: 'csv',
            // 敏感词库最大容量限制
            maxWordsCapacity: 1000,
            // 默认敏感词列表
            words: [
                '敏感', '违规', '不当', '禁止', '限制', '屏蔽', '过滤',
                '政治', '色情', '暴力', '赌博', '毒品', '诈骗', '传销', '邪教',
                '反动', '分裂', '恐怖', '极端', '仇恨', '歧视', '侮辱', '诽谤'
            ]
        },
        // 敏感词高亮样式
        highlightStyle: {
            backgroundColor: '#ffeb3b',
            color: '#d32f2f',
            fontWeight: 'bold',
            padding: '1px 2px',
            borderRadius: '2px',
            textShadow: '0 0 2px rgba(255, 0, 0, 0.3)'
        },
        // 当前运行时配置（用户自定义，会从本地存储中更新，修改默认参数请勿修改此处）
        words: [],
        enabled: true,
        caseSensitive: false,
        fuzzyMatch: true,
        enableSegmentationTest: false,
        showLogBoxByDefault: true,
        logBoxCapacity: 50,
        exportFormat: 'csv'
    };

    // 控制台样式化输出工具
    const consoleStyle = {
        // 成功类型：绿色渐变
        success: function(message) {
            console.log(
                `%c✅ ${message}`,
                'color: #fff; background: linear-gradient(270deg, #986fee, #8695e6, #68b7dd, #18d7d3); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;'
            );
        },
        // 错误类型：红色渐变
        error: function(message) {
            console.log(
                `%c❌ ${message}`,
                'color: #fff; background: linear-gradient(270deg, #ff6b6b, #ff8e8e, #ffa5a5); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;'
            );
        },
        // 警告类型：橙色渐变
        warning: function(message) {
            console.log(
                `%c⚠️ ${message}`,
                'color: #fff; background: linear-gradient(270deg, #ff9800, #ffb84d, #ffcc80); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;'
            );
        },
        // 信息类型：蓝色渐变
        info: function(message) {
            console.log(
                `%cℹ️ ${message}`,
                'color: #fff; background: linear-gradient(270deg, #2196f3, #64b5f6, #90caf9); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;'
            );
        }
    };

    // Segmentit分词器测试功能
    let segmentit = null;
    let segmentitLoaded = false;

    // 初始化segmentit分词器
    function initSegmentit() {
        if (segmentitLoaded) return;

        try {
            // 检查segmentit是否可用
            if (typeof Segmentit !== 'undefined' && Segmentit.Segment && Segmentit.useDefault) {
                segmentit = Segmentit.useDefault(new Segmentit.Segment());
                segmentitLoaded = true;
                consoleStyle.success("Segmentit分词器初始化完成");
            } else {
                consoleStyle.error("Segmentit分词器未加载");
            }
        } catch (error) {
            console.error("初始化Segmentit分词器时出错:", error);
        }
    }

    // 确保分词器可用的函数
    function ensureSegmentitReady() {
        if (!segmentitLoaded) {
            initSegmentit();
        }
        return segmentitLoaded && segmentit && segmentit.doSegment;
    }

    function testSegmentitSegmentation(text) {
        if (!text) return;

        // 检查是否启用了分词器测试，如未启用则不执行分词输出
        if (!sensitiveWordsConfig.enableSegmentationTest) {
            return;
        }

        try {
            // 检查segmentit是否可用
            if (segmentitLoaded && segmentit && segmentit.doSegment) {
                const segments = segmentit.doSegment(text);
                // 提取分词结果
                const words = segments.map(item => item.w);
                console.log("=== Segmentit分词测试 ===");
                console.log("弹幕内容:", text);
                console.log("分词结果:", words);
                console.log("分词数量:", words.length);
                console.log("详细结果:", segments);
                console.log("========================");
                return words;
            } else {
                console.log("=== Segmentit分词测试 ===");
                console.log("弹幕内容:", text);
                console.log("segmentit分词器未就绪，使用简单分词:", text.split(''));
                console.log("========================");
                return text.split('');
            }
        } catch (error) {
            console.error("segmentit分词测试出错:", error);
            console.log("=== Segmentit分词测试 ===");
            console.log("弹幕内容:", text);
            console.log("分词失败，使用简单分词:", text.split(''));
            console.log("========================");
            return text.split('');
        }
    }

    // 重置所有选项到默认配置
    function resetToDefaultConfig() {
        sensitiveWordsConfig.enabled = sensitiveWordsConfig.defaultConfig.enabled;
        sensitiveWordsConfig.caseSensitive = sensitiveWordsConfig.defaultConfig.caseSensitive;
        sensitiveWordsConfig.fuzzyMatch = sensitiveWordsConfig.defaultConfig.fuzzyMatch;
        sensitiveWordsConfig.enableSegmentationTest = sensitiveWordsConfig.defaultConfig.enableSegmentationTest;
        sensitiveWordsConfig.showLogBoxByDefault = sensitiveWordsConfig.defaultConfig.showLogBoxByDefault;
        sensitiveWordsConfig.logBoxCapacity = sensitiveWordsConfig.defaultConfig.logBoxCapacity;
        sensitiveWordsConfig.exportFormat = sensitiveWordsConfig.defaultConfig.exportFormat;
        sensitiveWordsConfig.words = [...sensitiveWordsConfig.defaultConfig.words];
    }

    // 敏感词管理器
    const sensitiveWordManager = {
        // 获取敏感词列表
        getWords() {
            const saved = localStorage.getItem('danmu_sensitive_words');
            if (saved) {
                try {
                    const config = JSON.parse(saved);
                    return config.words || sensitiveWordsConfig.defaultConfig.words;
                } catch (e) {
                    consoleStyle.warning('解析本地敏感词配置失败，使用系统默认配置');
                    return sensitiveWordsConfig.defaultConfig.words;
                }
            }
            // 如果localStorage中没有数据，返回初始初始化的词汇配置
            return sensitiveWordsConfig.defaultConfig.words;
        },

        // 保存敏感词列表
        saveWords(words) {
            const config = {
                words: words,
                enabled: sensitiveWordsConfig.enabled,
                caseSensitive: sensitiveWordsConfig.caseSensitive,
                fuzzyMatch: sensitiveWordsConfig.fuzzyMatch,
                enableSegmentationTest: sensitiveWordsConfig.enableSegmentationTest,
                showLogBoxByDefault: sensitiveWordsConfig.showLogBoxByDefault,
                logBoxCapacity: sensitiveWordsConfig.logBoxCapacity,
                exportFormat: sensitiveWordsConfig.exportFormat
            };
            localStorage.setItem('danmu_sensitive_words', JSON.stringify(config));
        },

        // 添加敏感词
        addWord(word) {
            const words = this.getWords();
            const maxCapacity = sensitiveWordsConfig.defaultConfig.maxWordsCapacity;

            // 检查是否已存在
            if (words.includes(word)) {
                return false;
            }

            // 检查容量限制并打印到控制台日志
            if (words.length >= maxCapacity) {
                consoleStyle.warning(`敏感词库已达到最大容量限制 (${maxCapacity}个)，无法添加更多敏感词`);
                return false;
            }

            words.push(word);
            this.saveWords(words);
            return true;
        },

        // 删除敏感词
        removeWord(word) {
            const words = this.getWords();
            const index = words.indexOf(word);
            if (index > -1) {
                words.splice(index, 1);
                this.saveWords(words);
                return true;
            }
            return false;
        },

        // 检测敏感词
        detectSensitiveWords(text) {
            if (!globalConfig.advancedFeaturesEnabled) return [];
            if (!sensitiveWordsConfig.enabled || !text) return [];
            if (text.length > 80) return []; // 忽略超长文本扫描，弹幕最多一次性发40字，不能一次发这么多出来

            const words = this.getWords();
            if (words.length === 0) return []; // 空词库保护，跳过扫描

            const detectedWords = [];
            const textToCheck = sensitiveWordsConfig.caseSensitive ? text : text.toLowerCase();

            if (sensitiveWordsConfig.fuzzyMatch) {
                // 模糊匹配：检查是否包含敏感词，处理重叠情况
                words.forEach(word => {
                    const wordToCheck = sensitiveWordsConfig.caseSensitive ? word : word.toLowerCase();
                    let searchIndex = 0;

                    // 查找所有匹配的位置，限制检测数量最多为8个
                    while (searchIndex < textToCheck.length && detectedWords.length < 8) {
                        const foundIndex = textToCheck.indexOf(wordToCheck, searchIndex);
                        if (foundIndex === -1) break;

                        detectedWords.push({
                            word: word,
                            originalWord: word,
                            startIndex: foundIndex,
                            endIndex: foundIndex + wordToCheck.length
                        });

                        searchIndex = foundIndex + 1;
                    }
                });

                // 去重：移除重叠的检测结果，保留较长的敏感词
                const filteredWords = this.removeOverlappingDetections(detectedWords);
                detectedWords.length = 0; // 清空原数组
                detectedWords.push(...filteredWords); // 添加过滤后的结果
            } else {
                // 精确匹配：使用分词器进行分词后精确匹配
                if (ensureSegmentitReady()) {
                    try {
                        const segments = segmentit.doSegment(text);
                        console.log("精确匹配模式 - 分词结果:", segments.map(s => s.w));

                        // 对每个敏感词检查是否在分词结果中
                        words.forEach(word => {
                            const wordToCheck = sensitiveWordsConfig.caseSensitive ? word : word.toLowerCase();
                            segments.forEach((segment, index) => {
                                const segmentToCheck = sensitiveWordsConfig.caseSensitive ? segment.w : segment.w.toLowerCase();

                                // 精确匹配：分词结果必须完全等于敏感词
                                if (segmentToCheck === wordToCheck) {
                                    console.log(`精确匹配检测到敏感词: "${word}" 在分词: "${segment.w}"`);
                                    detectedWords.push({
                                        word: word,
                                        originalWord: word,
                                        segment: segment.w,
                                        segmentIndex: index,
                                        startIndex: text.indexOf(segment.w),
                                        endIndex: text.indexOf(segment.w) + segment.w.length
                                    });
                                }
                            });
                        });
                    } catch (error) {
                        console.error("精确匹配分词出错:", error);
                    }
                } else {
                    consoleStyle.error("分词器未就绪，精确匹配功能不可用");
                }
            }

            return detectedWords;
        },

        // 移除重叠的检测结果，保留较长的敏感词
        removeOverlappingDetections(detectedWords) {
            if (detectedWords.length <= 1) return [...detectedWords];

            // 按开始位置排序
            detectedWords.sort((a, b) => a.startIndex - b.startIndex);

            const result = [detectedWords[0]]; // 直接添加第一个

            for (let i = 1; i < detectedWords.length; i++) {
                const current = detectedWords[i];
                const last = result[result.length - 1];

                // 检查是否重叠
                if (current.startIndex >= last.endIndex) {
                    // 不重叠：直接添加
                    result.push(current);
                } else {
                    // 重叠：保留较长的
                    if (current.endIndex - current.startIndex > last.endIndex - last.startIndex) {
                        result[result.length - 1] = current;
                    }
                }
            }

            return result;
        },

        // 高亮敏感词
        highlightSensitiveWords(text, detectedWords = null) {
            const words = detectedWords || this.detectSensitiveWords(text);
            if (words.length === 0) return text;

            // 按位置排序，从后往前替换避免位置偏移
            words.sort((a, b) => b.startIndex - a.startIndex);

            let highlightedText = text;
            words.forEach(item => {
                const before = highlightedText.substring(0, item.startIndex);
                const sensitive = highlightedText.substring(item.startIndex, item.endIndex);
                const after = highlightedText.substring(item.endIndex);

                const highlightSpan = `<span style="background-color: ${sensitiveWordsConfig.highlightStyle.backgroundColor}; color: ${sensitiveWordsConfig.highlightStyle.color}; font-weight: ${sensitiveWordsConfig.highlightStyle.fontWeight}; padding: ${sensitiveWordsConfig.highlightStyle.padding}; border-radius: ${sensitiveWordsConfig.highlightStyle.borderRadius}; text-shadow: ${sensitiveWordsConfig.highlightStyle.textShadow};">${sensitive}</span>`;

                highlightedText = before + highlightSpan + after;
            });

            return highlightedText;
        }
    };

    // 创建浮动文本框用于记录被拦截的弹幕
    function createDanmuLogBox() {
        // 防止重复创建：检查是否已经存在记录板
        const existingLogBox = document.getElementById('danmu-log-box');
        if (existingLogBox) {
            // 如果记录板已存在，直接返回现有实例
            return existingLogBox;
        }

        // 检查页面环境：确保 document.body 存在（页面已加载）
        if (!document.body) {
            consoleStyle.warning('页面未加载完成，延迟创建记录板');
            // 如果 body 不存在，延迟创建
            setTimeout(() => {
                if (document.body && !document.getElementById('danmu-log-box')) {
                    createDanmuLogBox();
                }
            }, 500);
            return null;
        }

        // 检查是否存在 #live-player 元素，这是真实直播间的标识
        // 如果不存在，说明可能是活动页（外层页面），不创建记录板
        const livePlayerDiv = document.getElementById('live-player');
        if (!livePlayerDiv) {
            // 检查是否在 iframe 中
            try {
                // 如果在 iframe 中且顶层窗口也有 live-player，说明是嵌套场景
                // 此时只在 iframe 内的真实直播间创建记录板
                if (window.self !== window.top) {
                    // 在 iframe 中，但没有 live-player，说明不是真实直播间，不创建
                    consoleStyle.info('检测到 iframe 嵌套，但当前页面不是真实直播间，跳过创建记录板');
                    return null;
                } else {
                    // 不在 iframe 中，但没有 live-player，可能是活动页，不创建
                    consoleStyle.info('当前页面没有 live-player 元素，跳过创建记录板（可能是活动页）');
                    return null;
                }
            } catch (e) {
                // 跨域限制，无法访问 window.top，保守处理：不创建
                consoleStyle.warning('无法判断页面环境，跳过创建记录板');
                return null;
            }
        }

        const logBox = document.createElement('div');
        logBox.id = 'danmu-log-box';
        logBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            height: 250px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 2px solid #00a1d6;
            border-radius: 12px;
            padding: 15px;
            font-size: 12px;
            z-index: 10000;
            font-family: 'Microsoft YaHei', sans-serif;
            overflow: hidden;
            resize: both;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 添加标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #00a1d6;
            background: linear-gradient(90deg, rgba(0, 161, 214, 0.1), transparent);
            border-radius: 8px 8px 0 0;
            padding: 8px 12px;
            margin: -15px -15px 10px -15px;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        const title = document.createElement('span');
        title.textContent = '弹幕记录板';
        title.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            color: #00a1d6;
            text-shadow: 0 0 8px rgba(0, 161, 214, 0.5);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空';
        clearBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #e53e3e);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 清空按钮悬停效果
        clearBtn.onmouseenter = () => {
            clearBtn.style.transform = 'scale(1.05)';
            clearBtn.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.4)';
        };
        clearBtn.onmouseleave = () => {
            clearBtn.style.transform = 'scale(1)';
            clearBtn.style.boxShadow = '0 2px 6px rgba(255, 107, 107, 0.3)';
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
            transition: all 0.2s ease;
            margin-left: 5px;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 保存按钮悬停效果
        saveBtn.onmouseenter = () => {
            saveBtn.style.transform = 'scale(1.05)';
            saveBtn.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.4)';
        };
        saveBtn.onmouseleave = () => {
            saveBtn.style.transform = 'scale(1)';
            saveBtn.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.3)';
        };

        const sensitiveBtn = document.createElement('button');
        sensitiveBtn.textContent = '敏感词';
        sensitiveBtn.style.cssText = `
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
            transition: all 0.2s ease;
            margin-left: 5px;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 敏感词按钮悬停效果
        sensitiveBtn.onmouseenter = () => {
            sensitiveBtn.style.transform = 'scale(1.05)';
            sensitiveBtn.style.boxShadow = '0 4px 8px rgba(255, 152, 0, 0.4)';
        };
        sensitiveBtn.onmouseleave = () => {
            sensitiveBtn.style.transform = 'scale(1)';
            sensitiveBtn.style.boxShadow = '0 2px 6px rgba(255, 152, 0, 0.3)';
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: linear-gradient(135deg, #666, #555);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(102, 102, 102, 0.3);
            transition: all 0.2s ease;
            margin-left: 5px;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 关闭按钮悬停效果
        closeBtn.onmouseenter = () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 4px 8px rgba(102, 102, 102, 0.4)';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = '0 2px 6px rgba(102, 102, 102, 0.3)';
        };

        titleBar.appendChild(title);
        titleBar.appendChild(clearBtn);
        titleBar.appendChild(saveBtn);
        titleBar.appendChild(sensitiveBtn);
        titleBar.appendChild(closeBtn);

        // 添加内容区域
        const contentArea = document.createElement('div');
        contentArea.id = 'danmu-log-content';
        contentArea.style.cssText = `
            height: calc(100% - 40px);
            overflow-y: auto;
            word-wrap: break-word;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
            border-radius: 8px;
            padding: 10px;
            border: 1px solid rgba(0, 161, 214, 0.2);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        `;

        // 添加自定义滚动条样式
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #danmu-log-content::-webkit-scrollbar {
                width: 8px;
            }
            
            #danmu-log-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                margin: 2px;
            }
            
            #danmu-log-content::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #00a1d6, #0088cc);
                border-radius: 4px;
                border: 1px solid rgba(0, 161, 214, 0.3);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            #danmu-log-content::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #0088cc, #006699);
                box-shadow: 0 0 8px rgba(0, 161, 214, 0.4);
                transform: scale(1.1);
            }
            
            #danmu-log-content::-webkit-scrollbar-thumb:active {
                background: linear-gradient(135deg, #006699, #004466);
            }
            
            #danmu-log-content::-webkit-scrollbar-corner {
                background: transparent;
            }
            
            /* Firefox 滚动条样式 */
            #danmu-log-content {
                scrollbar-width: thin;
                scrollbar-color: #00a1d6 rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(scrollbarStyle);

        logBox.appendChild(titleBar);
        logBox.appendChild(contentArea);
        document.body.appendChild(logBox);

        // 更新保存按钮文本显示当前导出格式
        updateSaveButtonText();

        // 绑定事件
        clearBtn.onclick = () => {
            // 检查是否有记录
            if (contentArea.children.length === 0) {
                showNotification('没有记录可清空！', 'warning', 2000);
                return;
            }

            // 二级确认
            if (confirm('确定要清空所有弹幕记录吗？\n\n此操作不可撤销！')) {
                contentArea.innerHTML = '';
                showNotification('弹幕记录已清空！', 'success', 2000);
            }
        };

        saveBtn.onclick = () => {
            saveDanmuLogs(contentArea, saveBtn);
        };

        sensitiveBtn.onclick = () => {
            showSensitiveWordManager();
        };

        closeBtn.onclick = () => {
            logBox.style.display = 'none';
            // 添加重新打开功能
            logBox.setAttribute('data-closed', 'true');
        };

        // 添加拖拽功能 - 优化版本
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let dragThrottleTimer = null;

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titleBar || titleBar.contains(e.target)) {
                isDragging = true;
                // 启用硬件加速
                logBox.style.willChange = 'transform';
            }
        }

        function drag(e) {
            if (isDragging) {
                // 使用requestAnimationFrame节流，避免频繁DOM更新
                if (dragThrottleTimer) return;

                dragThrottleTimer = requestAnimationFrame(() => {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    // 使用transform3d启用硬件加速
                    logBox.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                    dragThrottleTimer = null;
                });
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            // 清理节流定时器
            if (dragThrottleTimer) {
                cancelAnimationFrame(dragThrottleTimer);
                dragThrottleTimer = null;
            }
            // 禁用硬件加速以节省资源
            logBox.style.willChange = 'auto';
        }

        return logBox;
    }

    // 配置选项UI管理
    const configUI = {
        enableCheckbox: null,
        caseCheckbox: null,
        fuzzyCheckbox: null,
        showLogBoxCheckbox: null,
        segmentationCheckbox: null,
        capacityInput: null,
        exportFormatSelect: null,

        // 初始化配置选项UI
        init(enableCheckbox, caseCheckbox, fuzzyCheckbox, showLogBoxCheckbox, segmentationCheckbox, capacityInput, exportFormatSelect) {
            this.enableCheckbox = enableCheckbox;
            this.caseCheckbox = caseCheckbox;
            this.fuzzyCheckbox = fuzzyCheckbox;
            this.showLogBoxCheckbox = showLogBoxCheckbox;
            this.segmentationCheckbox = segmentationCheckbox;
            this.capacityInput = capacityInput;
            this.exportFormatSelect = exportFormatSelect;
        },

        // 重置配置选项UI到默认状态
        resetToDefault() {
            if (this.enableCheckbox) this.enableCheckbox.checked = sensitiveWordsConfig.defaultConfig.enabled;
            if (this.caseCheckbox) this.caseCheckbox.checked = sensitiveWordsConfig.defaultConfig.caseSensitive;
            if (this.fuzzyCheckbox) this.fuzzyCheckbox.checked = sensitiveWordsConfig.defaultConfig.fuzzyMatch;
            if (this.showLogBoxCheckbox) this.showLogBoxCheckbox.checked = sensitiveWordsConfig.defaultConfig.showLogBoxByDefault;
            if (this.segmentationCheckbox) this.segmentationCheckbox.checked = sensitiveWordsConfig.defaultConfig.enableSegmentationTest;
            if (this.capacityInput) this.capacityInput.value = sensitiveWordsConfig.defaultConfig.logBoxCapacity;
            if (this.exportFormatSelect) this.exportFormatSelect.value = sensitiveWordsConfig.defaultConfig.exportFormat;
        }
    };

    // 敏感词管理界面
    function showSensitiveWordManager() {
        // 检查是否已经存在管理界面
        let managerModal = document.getElementById('sensitive-word-manager');
        if (managerModal) {
            managerModal.style.display = 'block';
            // 每次打开时清空输入框
            const addInput = managerModal.querySelector('input[type="text"]');
            if (addInput) {
                addInput.value = '';
            }
            return;
        }

        // 创建模态框
        managerModal = document.createElement('div');
        managerModal.id = 'sensitive-word-manager';
        managerModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 20000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建管理面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
            border: 2px solid #00a1d6;
            border-radius: 12px;
            padding: 20px;
            width: 500px;
            max-height: 95vh;
            overflow-y: auto;
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            position: relative;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 添加自定义勾选框样式
        const checkboxStyle = document.createElement('style');
        checkboxStyle.textContent = `
            #sensitive-word-manager input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                width: 18px;
                height: 18px;
                border: 2px solid rgba(0, 161, 214, 0.6);
                border-radius: 4px;
                background: linear-gradient(135deg, #333, #2a2a2a);
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            #sensitive-word-manager input[type="checkbox"]:hover {
                border-color: #00a1d6;
                box-shadow: 0 0 8px rgba(0, 161, 214, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3);
                transform: scale(1.05);
            }
            
            #sensitive-word-manager input[type="checkbox"]:checked {
                background: linear-gradient(135deg, #00a1d6, #0088cc);
                border-color: #00a1d6;
                box-shadow: 0 0 12px rgba(0, 161, 214, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            #sensitive-word-manager input[type="checkbox"]:checked::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
                text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
            }
            
            #sensitive-word-manager input[type="checkbox"]:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(0, 161, 214, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            #sensitive-word-manager label {
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                transition: color 0.2s ease;
            }
            
            #sensitive-word-manager label:hover {
                color: #00a1d6;
            }
        `;
        document.head.appendChild(checkboxStyle);

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #00a1d6;
            cursor: move;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            background: linear-gradient(90deg, rgba(0, 161, 214, 0.1), transparent);
            border-radius: 8px 8px 0 0;
            padding: 10px 15px;
            margin: -20px -20px 15px -20px;
        `;

        const title = document.createElement('h3');
        title.textContent = '敏感词管理';
        title.style.margin = '0';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #e53e3e);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 添加悬停效果
        closeBtn.onmouseenter = () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.5)';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
        };

        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);

        // 添加敏感词区域
        const addSection = document.createElement('div');
        addSection.style.cssText = `
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
            border-radius: 8px;
            border: 1px solid rgba(0, 161, 214, 0.3);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        const addLabel = document.createElement('label');
        addLabel.textContent = '添加敏感词:';
        addLabel.style.display = 'block';
        addLabel.style.marginBottom = '5px';

        const addInput = document.createElement('input');
        addInput.type = 'text';
        addInput.placeholder = '输入要添加的敏感词';
        addInput.style.cssText = `
            width: 70%;
            padding: 10px 15px;
            border: 2px solid rgba(0, 161, 214, 0.5);
            border-radius: 8px;
            background: linear-gradient(135deg, #333, #2a2a2a);
            color: white;
            margin-right: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        `;

        // 输入框焦点效果
        addInput.onfocus = () => {
            addInput.style.borderColor = '#00a1d6';
            addInput.style.boxShadow = '0 0 0 3px rgba(0, 161, 214, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };
        addInput.onblur = () => {
            addInput.style.borderColor = 'rgba(0, 161, 214, 0.5)';
            addInput.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };

        const addBtn = document.createElement('button');
        addBtn.textContent = '添加';
        addBtn.style.cssText = `
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 添加按钮悬停效果
        addBtn.onmouseenter = () => {
            addBtn.style.transform = 'translateY(-2px)';
            addBtn.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
        };
        addBtn.onmouseleave = () => {
            addBtn.style.transform = 'translateY(0)';
            addBtn.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
        };

        addSection.appendChild(addLabel);
        addSection.appendChild(addInput);
        addSection.appendChild(addBtn);

        // 敏感词列表区域
        const listSection = document.createElement('div');
        listSection.style.cssText = `
            margin-bottom: 20px;
        `;

        const listLabel = document.createElement('label');
        listLabel.textContent = '当前敏感词列表:';
        listLabel.style.display = 'block';
        listLabel.style.marginBottom = '10px';

        const wordList = document.createElement('div');
        wordList.id = 'sensitive-word-list';
        wordList.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border: 2px solid rgba(0, 161, 214, 0.3);
            border-radius: 8px;
            padding: 15px;
            background: linear-gradient(135deg, #333, #2a2a2a);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 为敏感词列表添加自定义滚动条样式
        const sensitiveWordScrollbarStyle = document.createElement('style');
        sensitiveWordScrollbarStyle.textContent = `
            #sensitive-word-list::-webkit-scrollbar {
                width: 8px;
            }
            
            #sensitive-word-list::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                margin: 2px;
            }
            
            #sensitive-word-list::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #00a1d6, #0088cc);
                border-radius: 4px;
                border: 1px solid rgba(0, 161, 214, 0.3);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            #sensitive-word-list::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #0088cc, #006699);
                box-shadow: 0 0 8px rgba(0, 161, 214, 0.4);
                transform: scale(1.1);
            }
            
            #sensitive-word-list::-webkit-scrollbar-thumb:active {
                background: linear-gradient(135deg, #006699, #004466);
            }
            
            #sensitive-word-list::-webkit-scrollbar-corner {
                background: transparent;
            }
            
            /* Firefox 滚动条样式 */
            #sensitive-word-list {
                scrollbar-width: thin;
                scrollbar-color: #00a1d6 rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(sensitiveWordScrollbarStyle);

        listSection.appendChild(listLabel);
        listSection.appendChild(wordList);

        // 配置区域
        const configSection = document.createElement('div');
        configSection.style.cssText = `
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
            border-radius: 8px;
            border: 1px solid rgba(0, 161, 214, 0.3);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        const configLabel = document.createElement('label');
        configLabel.textContent = '检测配置:';
        configLabel.style.display = 'block';
        configLabel.style.marginBottom = '10px';

        const enableCheckbox = document.createElement('input');
        enableCheckbox.type = 'checkbox';
        enableCheckbox.id = 'enable-sensitive-check';
        enableCheckbox.checked = sensitiveWordsConfig.enabled;

        const enableLabel = document.createElement('label');
        enableLabel.htmlFor = 'enable-sensitive-check';
        enableLabel.textContent = '启用敏感词检测';
        enableLabel.style.marginLeft = '5px';

        const caseCheckbox = document.createElement('input');
        caseCheckbox.type = 'checkbox';
        caseCheckbox.id = 'case-sensitive-check';
        caseCheckbox.checked = sensitiveWordsConfig.caseSensitive;

        const caseLabel = document.createElement('label');
        caseLabel.htmlFor = 'case-sensitive-check';
        caseLabel.textContent = '区分大小写';
        caseLabel.style.marginLeft = '5px';

        const fuzzyCheckbox = document.createElement('input');
        fuzzyCheckbox.type = 'checkbox';
        fuzzyCheckbox.id = 'fuzzy-match-check';
        fuzzyCheckbox.checked = sensitiveWordsConfig.fuzzyMatch;

        const fuzzyLabel = document.createElement('label');
        fuzzyLabel.htmlFor = 'fuzzy-match-check';
        fuzzyLabel.textContent = '模糊匹配';
        fuzzyLabel.style.marginLeft = '5px';

        const showLogBoxCheckbox = document.createElement('input');
        showLogBoxCheckbox.type = 'checkbox';
        showLogBoxCheckbox.id = 'show-logbox-check';
        showLogBoxCheckbox.checked = sensitiveWordsConfig.showLogBoxByDefault;

        const showLogBoxLabel = document.createElement('label');
        showLogBoxLabel.htmlFor = 'show-logbox-check';
        showLogBoxLabel.textContent = '页面加载立即显示记录板';
        showLogBoxLabel.style.marginLeft = '5px';

        const segmentationCheckbox = document.createElement('input');
        segmentationCheckbox.type = 'checkbox';
        segmentationCheckbox.id = 'segmentation-test-check';
        segmentationCheckbox.checked = sensitiveWordsConfig.enableSegmentationTest;

        const segmentationLabel = document.createElement('label');
        segmentationLabel.htmlFor = 'segmentation-test-check';
        segmentationLabel.textContent = '启用分词器结果输出';
        segmentationLabel.style.marginLeft = '5px';

        // 添加容量配置
        const capacityLabel = document.createElement('label');
        capacityLabel.textContent = '弹幕记录板容量:';
        capacityLabel.style.display = 'block';
        capacityLabel.style.marginTop = '10px';
        capacityLabel.style.marginBottom = '5px';

        const capacityInput = document.createElement('input');
        capacityInput.type = 'number';
        capacityInput.id = 'logbox-capacity-input';
        capacityInput.min = '10';
        capacityInput.max = '1000';
        capacityInput.value = sensitiveWordsConfig.logBoxCapacity;
        capacityInput.style.cssText = `
            width: 80px;
            padding: 8px 12px;
            border: 2px solid rgba(0, 161, 214, 0.5);
            border-radius: 6px;
            background: linear-gradient(135deg, #333, #2a2a2a);
            color: white;
            margin-right: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        `;

        // 输入框焦点效果
        capacityInput.onfocus = () => {
            capacityInput.style.borderColor = '#00a1d6';
            capacityInput.style.boxShadow = '0 0 0 3px rgba(0, 161, 214, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };
        capacityInput.onblur = () => {
            capacityInput.style.borderColor = 'rgba(0, 161, 214, 0.5)';
            capacityInput.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };

        const capacityUnitLabel = document.createElement('span');
        capacityUnitLabel.textContent = '条记录';
        capacityUnitLabel.style.color = '#888';
        capacityUnitLabel.style.fontSize = '12px';

        // 添加导出格式配置
        const exportFormatLabel = document.createElement('label');
        exportFormatLabel.textContent = '导出格式:';
        exportFormatLabel.style.display = 'block';
        exportFormatLabel.style.marginTop = '15px';
        exportFormatLabel.style.marginBottom = '5px';

        const exportFormatSelect = document.createElement('select');
        exportFormatSelect.id = 'export-format-select';
        exportFormatSelect.style.cssText = `
            width: 125px;
            padding: 8px 12px;
            border: 2px solid rgba(0, 161, 214, 0.5);
            border-radius: 6px;
            background: linear-gradient(135deg, #333, #2a2a2a);
            color: white;
            margin-right: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 添加自定义下拉选项样式 - 只解决文字看不清的问题
        const selectStyle = document.createElement('style');
        selectStyle.textContent = `
            #export-format-select option {
                background: #2c2c2c !important;
                color: white !important;
                padding: 8px 12px;
            }
        `;
        document.head.appendChild(selectStyle);

        // 添加选项
        const txtOption = document.createElement('option');
        txtOption.value = 'txt';
        txtOption.textContent = '📄 TXT格式';

        const csvOption = document.createElement('option');
        csvOption.value = 'csv';
        csvOption.textContent = '📊 CSV格式';

        exportFormatSelect.appendChild(txtOption);
        exportFormatSelect.appendChild(csvOption);

        // 设置默认值（在添加选项之后）
        exportFormatSelect.value = sensitiveWordsConfig.exportFormat;

        // 选择器焦点效果
        exportFormatSelect.onfocus = () => {
            exportFormatSelect.style.borderColor = '#00a1d6';
            exportFormatSelect.style.boxShadow = '0 0 0 3px rgba(0, 161, 214, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };
        exportFormatSelect.onblur = () => {
            exportFormatSelect.style.borderColor = 'rgba(0, 161, 214, 0.5)';
            exportFormatSelect.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        };

        const exportFormatDesc = document.createElement('span');
        exportFormatDesc.textContent = 'TXT: 传统文本格式 | CSV: 表格数据格式';
        exportFormatDesc.style.color = '#888';
        exportFormatDesc.style.fontSize = '11px';
        exportFormatDesc.style.marginLeft = '10px';

        configSection.appendChild(configLabel);
        configSection.appendChild(enableCheckbox);
        configSection.appendChild(enableLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(caseCheckbox);
        configSection.appendChild(caseLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(fuzzyCheckbox);
        configSection.appendChild(fuzzyLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(showLogBoxCheckbox);
        configSection.appendChild(showLogBoxLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(segmentationCheckbox);
        configSection.appendChild(segmentationLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(capacityLabel);
        configSection.appendChild(capacityInput);
        configSection.appendChild(capacityUnitLabel);
        configSection.appendChild(document.createElement('br'));
        configSection.appendChild(exportFormatLabel);
        configSection.appendChild(exportFormatSelect);
        configSection.appendChild(exportFormatDesc);

        // 初始化配置选项UI管理器
        configUI.init(enableCheckbox, caseCheckbox, fuzzyCheckbox, showLogBoxCheckbox, segmentationCheckbox, capacityInput, exportFormatSelect);

        // 操作按钮区域
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        `;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置默认';
        resetBtn.style.cssText = `
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 重置按钮悬停效果
        resetBtn.onmouseenter = () => {
            resetBtn.style.transform = 'translateY(-2px)';
            resetBtn.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)';
        };
        resetBtn.onmouseleave = () => {
            resetBtn.style.transform = 'translateY(0)';
            resetBtn.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
        };

        const saveConfigBtn = document.createElement('button');
        saveConfigBtn.textContent = '保存配置';
        saveConfigBtn.style.cssText = `
            background: linear-gradient(135deg, #2196F3, #1976d2);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
            transition: all 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        `;

        // 保存按钮悬停效果
        saveConfigBtn.onmouseenter = () => {
            saveConfigBtn.style.transform = 'translateY(-2px)';
            saveConfigBtn.style.boxShadow = '0 6px 16px rgba(33, 150, 243, 0.4)';
        };
        saveConfigBtn.onmouseleave = () => {
            saveConfigBtn.style.transform = 'translateY(0)';
            saveConfigBtn.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
        };

        buttonSection.appendChild(resetBtn);
        buttonSection.appendChild(saveConfigBtn);

        // 组装面板
        panel.appendChild(titleBar);
        panel.appendChild(addSection);
        panel.appendChild(listSection);
        panel.appendChild(configSection);
        panel.appendChild(buttonSection);
        managerModal.appendChild(panel);
        document.body.appendChild(managerModal);

        // 更新敏感词列表显示
        function updateWordList() {
            const words = sensitiveWordManager.getWords();
            const maxCapacity = sensitiveWordsConfig.defaultConfig.maxWordsCapacity;
            const currentCount = words.length;
            const remainingCount = maxCapacity - currentCount;

            wordList.innerHTML = '';

            // 添加容量信息显示
            const capacityInfo = document.createElement('div');

            // 动态计算容量阈值
            const warningThreshold = Math.ceil(maxCapacity * 0.3);  // 剩余30%
            const alertThreshold = Math.ceil(maxCapacity * 0.05);  // 剩余5%

            capacityInfo.style.cssText = `
                padding: 8px 15px;
                margin-bottom: 10px;
                background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
                border-radius: 6px;
                border: 1px solid rgba(33, 150, 243, 0.3);
                font-size: 12px;
                color: #2196F3;
                text-align: center;
            `;

            if (remainingCount <= alertThreshold) {
                // 空间严重不足，红色严重警告
                capacityInfo.style.color = '#f44336';
                capacityInfo.style.background = 'linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))';
                capacityInfo.style.borderColor = 'rgba(244, 67, 54, 0.3)';
            } else if (remainingCount <= warningThreshold) {
                // 空间不足，即将达到阈值，橙色提醒
                capacityInfo.style.color = '#ff9800';
                capacityInfo.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))';
                capacityInfo.style.borderColor = 'rgba(255, 152, 0, 0.3)';
            }

            capacityInfo.textContent = `词库容量: ${currentCount}/${maxCapacity} (剩余 ${remainingCount} 个)`;
            wordList.appendChild(capacityInfo);

            if (words.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.cssText = 'color: #888; text-align: center; padding: 20px;';
                emptyDiv.textContent = '暂无敏感词';
                wordList.appendChild(emptyDiv);
                return;
            }

            words.forEach(word => {
                const wordItem = document.createElement('div');
                wordItem.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 15px;
                    margin: 8px 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    border-radius: 8px;
                    border: 1px solid rgba(0, 161, 214, 0.2);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                `;

                // 列表项悬停效果
                wordItem.onmouseenter = () => {
                    wordItem.style.transform = 'translateX(5px)';
                    wordItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    wordItem.style.borderColor = 'rgba(0, 161, 214, 0.5)';
                };
                wordItem.onmouseleave = () => {
                    wordItem.style.transform = 'translateX(0)';
                    wordItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    wordItem.style.borderColor = 'rgba(0, 161, 214, 0.2)';
                };

                const wordText = document.createElement('span');
                wordText.textContent = word;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除';
                deleteBtn.style.cssText = `
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);
                    transition: all 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                `;

                // 删除按钮悬停效果
                deleteBtn.onmouseenter = () => {
                    deleteBtn.style.transform = 'scale(1.05)';
                    deleteBtn.style.boxShadow = '0 4px 8px rgba(244, 67, 54, 0.4)';
                };
                deleteBtn.onmouseleave = () => {
                    deleteBtn.style.transform = 'scale(1)';
                    deleteBtn.style.boxShadow = '0 2px 6px rgba(244, 67, 54, 0.3)';
                };

                deleteBtn.onclick = () => {
                    if (confirm(`确定要删除敏感词"${word}"吗？`)) {
                        if (sensitiveWordManager.removeWord(word)) {
                            updateWordList();
                            showNotification('敏感词删除成功！', 'success');
                        } else {
                            showNotification('删除失败！', 'error');
                        }
                    }
                };

                wordItem.appendChild(wordText);
                wordItem.appendChild(deleteBtn);
                wordList.appendChild(wordItem);
            });
        }

        // 添加拖拽功能
        let isDraggingPanel = false;
        let currentPanelX;
        let currentPanelY;
        let initialPanelX;
        let initialPanelY;
        let xPanelOffset = 0;
        let yPanelOffset = 0;
        let dragPanelThrottleTimer = null;

        titleBar.addEventListener('mousedown', dragPanelStart);
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', dragPanelEnd);

        function dragPanelStart(e) {
            initialPanelX = e.clientX - xPanelOffset;
            initialPanelY = e.clientY - yPanelOffset;

            if (e.target === titleBar || titleBar.contains(e.target)) {
                isDraggingPanel = true;
                panel.style.willChange = 'transform';
            }
        }

        function dragPanel(e) {
            if (isDraggingPanel) {
                if (dragPanelThrottleTimer) return;

                dragPanelThrottleTimer = requestAnimationFrame(() => {
                    e.preventDefault();
                    currentPanelX = e.clientX - initialPanelX;
                    currentPanelY = e.clientY - initialPanelY;

                    xPanelOffset = currentPanelX;
                    yPanelOffset = currentPanelY;

                    panel.style.transform = `translate3d(${currentPanelX}px, ${currentPanelY}px, 0)`;
                    dragPanelThrottleTimer = null;
                });
            }
        }

        function dragPanelEnd(e) {
            initialPanelX = currentPanelX;
            initialPanelY = currentPanelY;
            isDraggingPanel = false;
            if (dragPanelThrottleTimer) {
                cancelAnimationFrame(dragPanelThrottleTimer);
                dragPanelThrottleTimer = null;
            }
            panel.style.willChange = 'auto';
        }

        // 绑定事件
        addBtn.onclick = () => {
            const word = addInput.value.trim();
            if (!word) {
                showNotification('内容不能为空！', 'error');
                return;
            }

            const result = sensitiveWordManager.addWord(word);
            if (result === true) {
                addInput.value = '';
                updateWordList();
                showNotification('敏感词添加成功！', 'success');
            } else {
                // 检查是否是容量限制导致的失败
                const words = sensitiveWordManager.getWords();
                const maxCapacity = sensitiveWordsConfig.defaultConfig.maxWordsCapacity;
                if (words.length >= maxCapacity) {
                    showNotification(`词库已达最大容量限制 (${maxCapacity}个)，无法添加更多敏感词！`, 'error');
                } else {
                    showNotification('该敏感词已存在！', 'warning');
                }
            }
        };

        addInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // 防止表单提交等默认行为
                addBtn.click();
            }
        });

        resetBtn.onclick = () => {
            if (confirm('确定要重置为默认敏感词列表吗？\n\n这将清除所有自定义敏感词和本地配置！')) {
                // 清空本地保存的敏感词配置
                localStorage.removeItem('danmu_sensitive_words');

                // 重置敏感词配置对象到默认状态
                resetToDefaultConfig()

                // 重置敏感词管理器到默认状态
                sensitiveWordManager.saveWords(sensitiveWordsConfig.words);

                // 重置配置选项UI到默认状态
                configUI.resetToDefault();

                // 强制刷新敏感词列表显示
                updateWordList();

                // 清空输入框
                addInput.value = '';

                showNotification('重置默认设置成功！', 'success');
            }
        };

        saveConfigBtn.onclick = () => {
            sensitiveWordsConfig.enabled = enableCheckbox.checked;
            sensitiveWordsConfig.caseSensitive = caseCheckbox.checked;
            sensitiveWordsConfig.fuzzyMatch = fuzzyCheckbox.checked;
            sensitiveWordsConfig.showLogBoxByDefault = showLogBoxCheckbox.checked;
            sensitiveWordsConfig.enableSegmentationTest = segmentationCheckbox.checked;
            sensitiveWordsConfig.exportFormat = exportFormatSelect.value;

            // 验证并设置容量值
            const capacityValue = parseInt(capacityInput.value);
            if (capacityValue >= 10 && capacityValue <= 1000) {
                sensitiveWordsConfig.logBoxCapacity = capacityValue;
            } else {
                showNotification('容量值必须在10-1000之间！', 'warning', 3000);
                return;
            }

            // 保存配置到localStorage
            const config = {
                words: sensitiveWordManager.getWords(),
                enabled: sensitiveWordsConfig.enabled,
                caseSensitive: sensitiveWordsConfig.caseSensitive,
                fuzzyMatch: sensitiveWordsConfig.fuzzyMatch,
                enableSegmentationTest: sensitiveWordsConfig.enableSegmentationTest,
                showLogBoxByDefault: sensitiveWordsConfig.showLogBoxByDefault,
                logBoxCapacity: sensitiveWordsConfig.logBoxCapacity,
                exportFormat: sensitiveWordsConfig.exportFormat
            };
            localStorage.setItem('danmu_sensitive_words', JSON.stringify(config));

            // 如果弹幕记录板显示配置发生变化，需要重新创建或隐藏弹幕记录板
            const logBox = document.getElementById('danmu-log-box');
            if (sensitiveWordsConfig.showLogBoxByDefault) {
                // 如果启用默认显示，确保弹幕记录板存在并显示，只有在真实直播间页面（有 live-player）才创建
                if (!logBox) {
                    const livePlayerDiv = document.getElementById('live-player');
                    if (livePlayerDiv) {
                        createDanmuLogBox();
                    } else {
                        showNotification('当前页面不是真实直播间，无法创建记录板', 'warning', 3000);
                    }
                } else {
                    logBox.style.display = 'block';
                    logBox.removeAttribute('data-closed');
                }
            } else {
                // 如果禁用默认显示，隐藏弹幕记录板
                if (logBox) {
                    logBox.style.display = 'none';
                    logBox.setAttribute('data-closed', 'true');
                }
            }

            // 显示保存成功提示
            showSaveSuccessNotification();

            // 更新保存按钮文本
            updateSaveButtonText();
        };

        // 清空输入框的函数
        function clearInput() {
            addInput.value = '';
        }

        closeBtn.onclick = () => {
            managerModal.style.display = 'none';
            clearInput();
        };

        managerModal.onclick = (e) => {
            if (e.target === managerModal) {
                managerModal.style.display = 'none';
                clearInput();
            }
        };

        // 初始化显示
        updateWordList();
    }

    // 统一的通知函数
    function showNotification(message, type = 'info', duration = 3000) {
        // 检查是否已存在通知
        let notification = document.getElementById('unified-notification');
        if (notification) {
            notification.remove();
        }

        // 根据类型设置样式
        let bgColor, borderColor, icon;
        switch (type) {
            case 'success':
                bgColor = 'linear-gradient(135deg, #4CAF50, #45a049)';
                borderColor = '#2e7d32';
                icon = '✅';
                break;
            case 'error':
                bgColor = 'linear-gradient(135deg, #f44336, #d32f2f)';
                borderColor = '#b71c1c';
                icon = '❌';
                break;
            case 'warning':
                bgColor = 'linear-gradient(135deg, #ff9800, #f57c00)';
                borderColor = '#e65100';
                icon = '⚠️';
                break;
            default:
                bgColor = 'linear-gradient(135deg, #2196F3, #1976d2)';
                borderColor = '#0d47a1';
                icon = 'ℹ️';
        }

        // 创建通知元素
        notification = document.createElement('div');
        notification.id = 'unified-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 30000;
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            border: 2px solid ${borderColor};
            animation: slideDown 0.3s ease-out;
            user-select: none;
            pointer-events: auto;
            cursor: pointer;
        `;

        // 添加CSS动画（如果还没有添加）
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        notification.innerHTML = `${icon} ${message}`;
        document.body.appendChild(notification);

        // 自动消失
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);

        // 点击通知也可以关闭
        notification.onclick = () => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        };
    }

    // 显示保存成功通知（保持兼容性）
    function showSaveSuccessNotification() {
        showNotification('配置保存成功！', 'success', 5000);
    }

    // 统一的标题处理函数：清理标题并解析为主播名和直播名
    function processPageTitle(title) {
        if (!title) return { streamer: '', streamName: '', cleanTitle: '' };

        // 1. 去除无用的平台后缀
        const platformSuffixes = [
            ' - 哔哩哔哩直播，二次元弹幕直播平台',
            ' - 哔哩哔哩直播',
            ' - bilibili直播',
            ' - B站直播',
            ' - 哔哩哔哩',
            ' - bilibili',
            ' - B站',
            ' - 直播',
            ' - Live',
            ' - LIVE'
        ];

        let cleanTitle = title.trim();
        for (const suffix of platformSuffixes.sort((a, b) => b.length - a.length)) {
            if (cleanTitle.endsWith(suffix)) {
                cleanTitle = cleanTitle.slice(0, -suffix.length).trim();
                break;
            }
        }

        // 2. 解析主播名和直播名
        const parts = cleanTitle.split(' - ');
        let streamer = '', streamName = '';

        if (parts.length >= 2) {
            streamer = parts[parts.length - 1].trim();
            streamName = parts.slice(0, -1).join(' - ').trim();
        } else if (cleanTitle.length <= 10) {
            streamer = cleanTitle;
        } else {
            streamName = cleanTitle;
        }

        // 3. 清理文件名中的特殊字符
        const sanitize = (text) => {
            if (!text) return '';
            return text
                .replace(/[<>:"/\\|?*\s]+/g, '_')  // 替换特殊字符和空格
                .replace(/_{2,}/g, '_')            // 合并连续下划线
                .replace(/^_|_$/g, '')             // 去除首尾下划线
                .substring(0, 30);                // 限制长度
        };

        return {
            streamer: sanitize(streamer),
            streamName: sanitize(streamName),
            cleanTitle: cleanTitle
        };
    }

    // CSV转义函数 - 处理CSV中的特殊字符
    function escapeCsvField(field) {
        if (field === null || field === undefined) return '';

        const str = String(field);
        // 如果包含逗号、引号或换行符，需要用引号包围并转义内部引号
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    // 格式化时间戳为更友好的格式
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    // 生成进度条可视化
    function generateProgressBar(current, total, length = 20) {
        if (total === 0) return '█'.repeat(length);
        const filled = Math.round((current / total) * length);
        return '█'.repeat(filled) + '░'.repeat(length - filled);
    }

    // 保存弹幕记录到TXT文件 - 原纯文本文件版本
    function saveDanmuLogsToTxt(contentArea, saveBtn) {
        const entries = contentArea.children;
        if (entries.length === 0) {
            showNotification('没有弹幕记录可保存！', 'warning', 3000);
            return;
        }

        // 使用StringBuilder模式优化字符串拼接 - 简化排版
        const titleInfo = processPageTitle(document.title);
        const saveContent = [
            '================================================',
            '                弹幕记录保存文件',
            '================================================',
            '',
            '📅 保存时间: ' + new Date().toLocaleString(),
            '🎮 直播名称: ' + (titleInfo.streamName || '未知'),
            '👤 主播名称: ' + (titleInfo.streamer || '未知'),
            '📊 记录总数: ' + entries.length + ' 条',
            '',
            '================================================',
            '                    详细记录',
            '================================================',
            ''
        ];

        // 统计信息
        let systemCount = 0;
        let userCount = 0;
        let normalCount = 0;

        // 使用更高效的遍历方式
        Array.from(entries).forEach(entry => {
            const timeDiv = entry.querySelector('div:nth-child(1)');
            const typeDiv = entry.querySelector('div:nth-child(2)');

            if (!timeDiv || !typeDiv) return;

            const type = typeDiv.textContent;
            const time = timeDiv.textContent;

            // 检查是否有敏感词div（第3个div）
            const sensitiveDiv = entry.querySelector('div:nth-child(3)');
            let contentDiv, sensitiveWordsInfo = '';

            if (sensitiveDiv && sensitiveDiv.textContent.includes('检测到敏感词')) {
                // 有敏感词的情况：第3个div是敏感词，第4个div是内容
                contentDiv = entry.querySelector('div:nth-child(4)');
                sensitiveWordsInfo = sensitiveDiv.textContent.replace('⚠️ 检测到敏感词: ', '');
            } else {
                // 没有敏感词的情况：第3个div就是内容
                contentDiv = entry.querySelector('div:nth-child(3)');
            }

            if (!contentDiv) return;

            // 获取弹幕内容，需要去除HTML标签但保留文本内容
            let content = contentDiv.innerHTML;
            // 去除HTML标签，保留纯文本内容
            content = content.replace(/<[^>]*>/g, '');

            // 统计数量
            if (type.includes('系统屏蔽')) systemCount++;
            else if (type.includes('主播屏蔽')) userCount++;
            else if (type.includes('正常显示')) normalCount++;

            // 根据类型选择图标和颜色标识
            let typeIcon, typeColor;
            if (type.includes('系统屏蔽')) {
                typeIcon = '🚫';
                typeColor = '[系统屏蔽]';
            } else if (type.includes('主播屏蔽')) {
                typeIcon = '⚠️';
                typeColor = '[主播屏蔽]';
            } else {
                typeIcon = '✅';
                typeColor = '[正常显示]';
            }

            // 添加简化的弹幕记录格式
            saveContent.push('----------------------------------------');
            saveContent.push(`${typeIcon} ${typeColor} | 🕐 ${time}`);
            saveContent.push('----------------------------------------');
            saveContent.push('📝 弹幕内容:');

            // 处理长文本换行
            const maxLineLength = 50; // 每行最大字符数
            const lines = content.match(new RegExp(`.{1,${maxLineLength}}`, 'g')) || [content];
            lines.forEach(line => {
                saveContent.push(`   ${line}`);
            });

            // 如果有敏感词信息，添加到保存内容中
            if (sensitiveWordsInfo) {
                saveContent.push('');
                saveContent.push(`🔍 敏感词: ${sensitiveWordsInfo}`);
            }

            saveContent.push('');
        });

        // 添加统计信息 - 优化显示，使用百分比和固定长度进度条
        saveContent.push('================================================');
        saveContent.push('                    统计信息');
        saveContent.push('================================================');
        saveContent.push('');
        saveContent.push('📊 弹幕类型统计:');

        // 计算百分比
        const total = entries.length;
        const systemPercent = total > 0 ? Math.round((systemCount / total) * 100) : 0;
        const userPercent = total > 0 ? Math.round((userCount / total) * 100) : 0;
        const normalPercent = total > 0 ? Math.round((normalCount / total) * 100) : 0;

        // 固定长度进度条（20个字符）
        const maxBarLength = 20;
        const systemBarLength = Math.round((systemCount / Math.max(total, 1)) * maxBarLength);
        const userBarLength = Math.round((userCount / Math.max(total, 1)) * maxBarLength);
        const normalBarLength = Math.round((normalCount / Math.max(total, 1)) * maxBarLength);

        saveContent.push('🚫 系统屏蔽: ' + String(systemCount).padStart(3) + ' 条 (' + String(systemPercent).padStart(3) + '%) ' + '█'.repeat(systemBarLength) + ' '.repeat(maxBarLength - systemBarLength));
        saveContent.push('⚠️ 主播屏蔽: ' + String(userCount).padStart(3) + ' 条 (' + String(userPercent).padStart(3) + '%) ' + '█'.repeat(userBarLength) + ' '.repeat(maxBarLength - userBarLength));
        saveContent.push('✅ 正常显示: ' + String(normalCount).padStart(3) + ' 条 (' + String(normalPercent).padStart(3) + '%) ' + '█'.repeat(normalBarLength) + ' '.repeat(maxBarLength - normalBarLength));
        saveContent.push('');
        saveContent.push(`📈 总计: ${entries.length} 条弹幕记录`);
        saveContent.push('');
        saveContent.push('================================================');
        saveContent.push('                感谢使用弹幕反诈脚本');
        saveContent.push('================================================');

        // 创建下载链接 - 优化内存使用
        const blob = new Blob([saveContent.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // 生成文件名：主播_直播名_时间
        const now = new Date();
        const timePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

        const { streamer, streamName } = titleInfo;
        let filename;
        if (streamer && streamName) {
            filename = `${streamer}_${streamName}_${timePart}.txt`;
        } else if (streamer) {
            filename = `${streamer}_${timePart}.txt`;
        } else if (streamName) {
            filename = `${streamName}_${timePart}.txt`;
        } else {
            filename = `弹幕记录_${timePart}.txt`;
        }
        a.download = filename;
        a.style.display = 'none'; // 避免闪烁
        document.body.appendChild(a);
        a.click();

        // 立即清理DOM和URL
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        // 显示保存成功提示
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '已保存';
        saveBtn.style.background = 'linear-gradient(135deg, #2196F3, #1976d2)';
        showNotification('弹幕记录TXT文件保存成功！', 'success', 2000);
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        }, 2000);
    }

    // 保存弹幕记录到CSV文件 - 美化版本
    function saveDanmuLogsToCsv(contentArea, saveBtn) {
        const entries = contentArea.children;
        if (entries.length === 0) {
            showNotification('没有弹幕记录可保存！', 'warning', 3000);
            return;
        }

        // 显示导出进度
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '导出中...';
        saveBtn.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
        saveBtn.disabled = true;

        // 使用setTimeout让UI更新
        setTimeout(() => {
            try {
                const titleInfo = processPageTitle(document.title);
                const saveTime = new Date();
                const formattedSaveTime = formatTimestamp(saveTime);

                // 美化CSV表头 - 添加更多有用信息
                const csvRows = [
                    // 文件信息头部
                    ['弹幕反诈与防河蟹 - 数据导出报告', '', '', '', '', '', ''],
                    ['导出时间', formattedSaveTime, '', '', '', '', ''],
                    ['直播名称', titleInfo.streamName || '未知', '', '', '', '', ''],
                    ['主播名称', titleInfo.streamer || '未知', '', '', '', '', ''],
                    ['记录总数', entries.length + ' 条', '', '', '', '', ''],
                    ['', '', '', '', '', '', ''], // 空行分隔

                    // 数据表头
                    ['序号', '发送时间', '弹幕状态', '弹幕内容', '敏感词检测', '内容长度', '备注']
                ];

                // 统计信息
                let systemCount = 0;
                let userCount = 0;
                let normalCount = 0;
                let totalLength = 0;
                let systemLength = 0;
                let userLength = 0;
                let normalLength = 0;

                // 遍历弹幕记录并转换为美化CSV格式
                Array.from(entries).forEach((entry, index) => {
                    const timeDiv = entry.querySelector('div:nth-child(1)');
                    const typeDiv = entry.querySelector('div:nth-child(2)');

                    if (!timeDiv || !typeDiv) return;

                    const type = typeDiv.textContent;
                    const time = timeDiv.textContent;

                    // 检查是否有敏感词div（第3个div）
                    const sensitiveDiv = entry.querySelector('div:nth-child(3)');
                    let contentDiv, sensitiveWordsInfo = '';

                    if (sensitiveDiv && sensitiveDiv.textContent.includes('检测到敏感词')) {
                        // 有敏感词的情况：第3个div是敏感词，第4个div是内容
                        contentDiv = entry.querySelector('div:nth-child(4)');
                        sensitiveWordsInfo = sensitiveDiv.textContent.replace('⚠️ 检测到敏感词: ', '');
                    } else {
                        // 没有敏感词的情况：第3个div就是内容
                        contentDiv = entry.querySelector('div:nth-child(3)');
                    }

                    if (!contentDiv) return;

                    // 获取弹幕内容，需要去除HTML标签但保留文本内容
                    let content = contentDiv.innerHTML;
                    // 去除HTML标签，保留纯文本内容
                    content = content.replace(/<[^>]*>/g, '');

                    // 统计数量和长度
                    if (type.includes('系统屏蔽')) {
                        systemCount++;
                        systemLength += content.length;
                    } else if (type.includes('主播屏蔽')) {
                        userCount++;
                        userLength += content.length;
                    } else if (type.includes('正常显示')) {
                        normalCount++;
                        normalLength += content.length;
                    }
                    totalLength += content.length;

                    // 美化类型标识
                    let typeLabel, remark;
                    if (type.includes('系统屏蔽')) {
                        typeLabel = '🚫 系统屏蔽';
                        remark = '被系统自动过滤';
                    } else if (type.includes('主播屏蔽')) {
                        typeLabel = '⚠️ 主播屏蔽';
                        remark = '被主播手动删除';
                    } else {
                        typeLabel = '✅ 正常显示';
                        remark = '成功发送并显示';
                    }

                    // 敏感词检测结果美化
                    let sensitiveResult;
                    if (sensitiveWordsInfo) {
                        const wordCount = sensitiveWordsInfo.split(',').length;
                        sensitiveResult = `🔍 检测到 ${wordCount} 个敏感词: ${sensitiveWordsInfo}`;
                    } else {
                        sensitiveResult = '✅ 无敏感词';
                    }

                    // 添加美化CSV行数据
                    csvRows.push([
                        index + 1, // 序号
                        time, // 发送时间
                        typeLabel, // 弹幕状态
                        content, // 弹幕内容
                        sensitiveResult, // 敏感词检测
                        content.length + ' 字符', // 内容长度
                        remark // 备注
                    ]);
                });

                // 添加美化统计信息区域
                csvRows.push([]); // 空行分隔
                csvRows.push(['📊 数据统计与分析', '', '', '', '', '', '']);
                csvRows.push(['', '', '', '', '', '', '']);

                // 详细统计
                const total = entries.length;
                const systemPercent = total > 0 ? Math.round((systemCount / total) * 100) : 0;
                const userPercent = total > 0 ? Math.round((userCount / total) * 100) : 0;
                const normalPercent = total > 0 ? Math.round((normalCount / total) * 100) : 0;

                // 计算各类型的平均长度
                const systemAvgLength = systemCount > 0 ? Math.round(systemLength / systemCount) : 0;
                const userAvgLength = userCount > 0 ? Math.round(userLength / userCount) : 0;
                const normalAvgLength = normalCount > 0 ? Math.round(normalLength / normalCount) : 0;
                const totalAvgLength = total > 0 ? Math.round(totalLength / total) : 0;

                csvRows.push(['统计项目', '数量', '百分比', '进度条', '平均长度', '备注', '']);
                csvRows.push([
                    '🚫 系统屏蔽',
                    systemCount + ' 条',
                    systemPercent + '%',
                    generateProgressBar(systemCount, total),
                    systemAvgLength + ' 字符',
                    '被系统自动过滤的弹幕',
                    ''
                ]);
                csvRows.push([
                    '⚠️ 主播屏蔽',
                    userCount + ' 条',
                    userPercent + '%',
                    generateProgressBar(userCount, total),
                    userAvgLength + ' 字符',
                    '被主播手动删除的弹幕',
                    ''
                ]);
                csvRows.push([
                    '✅ 正常显示',
                    normalCount + ' 条',
                    normalPercent + '%',
                    generateProgressBar(normalCount, total),
                    normalAvgLength + ' 字符',
                    '成功发送并显示的弹幕',
                    ''
                ]);
                csvRows.push(['', '', '', '', '', '', '']);
                csvRows.push(['📈 汇总信息', '', '', '', '', '', '']);
                csvRows.push(['总弹幕数', total + ' 条', '', '', '', '', '']);
                csvRows.push(['总字符数', totalLength + ' 字符', '', '', '', '', '']);
                csvRows.push(['平均长度', totalAvgLength + ' 字符/条', '', '', '', '', '']);
                csvRows.push(['屏蔽率', Math.round(((systemCount + userCount) / total) * 100) + '%', '', '', '', '', '']);
                csvRows.push(['成功率', normalPercent + '%', '', '', '', '', '']);

                // 添加分析建议
                csvRows.push([]);
                csvRows.push(['💡 数据分析建议', '', '', '', '', '', '']);
                if (systemCount > userCount) {
                    csvRows.push(['系统屏蔽较多', '建议检查弹幕内容是否包含系统敏感词，可通过二分切割查找敏感词', '', '', '', '', '']);
                }
                if (userCount > systemCount) {
                    csvRows.push(['主播屏蔽较多', '建议了解主播的屏蔽规则，可通过二分切割查找关键词', '', '', '', '', '']);
                }
                if (normalPercent > 80) {
                    csvRows.push(['发送成功率较高', '弹幕发送策略较为有效，继续保持', '', '', '', '', '']);
                } else {
                    csvRows.push(['发送成功率较低', '建议优化弹幕内容策略，合理使用敏感词过滤', '', '', '', '', '']);
                }

                // 添加文件尾部信息
                csvRows.push([]);
                csvRows.push(['========================================', '', '', '', '', '', '']);
                csvRows.push(['感谢使用弹幕反诈与防河蟹脚本', '', '', '', '', '', '']);
                csvRows.push(['数据格式: CSV (UTF-8 with BOM)', '', '', '', '', '', '']);
                csvRows.push(['========================================', '', '', '', '', '', '']);

                // 将CSV数据转换为字符串
                const csvContent = csvRows.map(row =>
                    row.map(field => escapeCsvField(field)).join(',')
                ).join('\n');

                // 添加BOM以支持Excel正确显示中文
                const bom = '\uFEFF';
                const csvWithBom = bom + csvContent;

                // 创建下载链接 - 优化内存使用
                const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                // 美化文件名生成
                const now = new Date();
                const dateStr = now.toLocaleDateString('zh-CN').replace(/\//g, '-');
                const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false }).replace(/:/g, '-');

                const { streamer, streamName } = titleInfo;
                let filename;
                if (streamer && streamName) {
                    filename = `${streamer}_${streamName}_${dateStr}_${timeStr}.csv`;
                } else if (streamer) {
                    filename = `${streamer}_${dateStr}_${timeStr}.csv`;
                } else if (streamName) {
                    filename = `${streamName}_${dateStr}_${timeStr}.csv`;
                } else {
                    filename = `弹幕记录_${dateStr}_${timeStr}.csv`;
                }

                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                // 立即清理DOM和URL
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);

                // 显示成功提示
                saveBtn.textContent = '✅ 导出完成';
                saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                showNotification(`CSV文件导出成功！共导出 ${total} 条记录`, 'success', 3000);

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    saveBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('CSV导出失败:', error);
                saveBtn.textContent = '❌ 导出失败';
                saveBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                showNotification('CSV导出失败，请重试！', 'error', 3000);

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    saveBtn.disabled = false;
                }, 3000);
            }
        }, 100);
    }

    // 主导出函数 - 根据配置选择导出格式
    function saveDanmuLogs(contentArea, saveBtn) {
        const exportFormat = sensitiveWordsConfig.exportFormat || 'csv';

        if (exportFormat === 'txt') {
            saveDanmuLogsToTxt(contentArea, saveBtn);
        } else {
            saveDanmuLogsToCsv(contentArea, saveBtn);
        }
    }

    // 更新保存按钮文本显示当前导出格式
    function updateSaveButtonText() {
        // 更精确地选择保存按钮 - 它是第3个按钮（清空、保存、敏感词、关闭）
        const saveBtn = document.querySelector('#danmu-log-box button:nth-child(3)');
        if (saveBtn && saveBtn.textContent.includes('保存')) {
            const exportFormat = sensitiveWordsConfig.exportFormat || 'csv';
            const formatIcon = exportFormat === 'txt' ? '📄' : '📊';
            const formatText = exportFormat === 'txt' ? 'TXT' : 'CSV';
            saveBtn.textContent = `${formatIcon} 保存(${formatText})`;
        }
    }

    // 添加全局清理函数
    function cleanup() {
        // 清理DOM缓存
        domCache.clearCache();

        // 清理URL缓存
        urlCache.clear();

        // 清理所有动画定时器
        const animatedElements = document.querySelectorAll('[style*="will-change"]');
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });

        consoleStyle.info('[弹幕反诈] 检测到页面关闭，资源清理已完成');
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanup);

    // DOM缓存对象
    const domCache = {
        logBox: null,
        contentArea: null,
        getLogBox() {
            // 首先检查DOM中是否已存在记录板
            const existingLogBox = document.getElementById('danmu-log-box');
            if (existingLogBox) {
                this.logBox = existingLogBox;
                return this.logBox;
            }

            // 如果缓存中没有且DOM中也没有，尝试创建
            if (!this.logBox) {
                this.logBox = createDanmuLogBox();
            }

            return this.logBox;
        },
        getContentArea() {
            if (!this.contentArea) {
                this.contentArea = document.getElementById('danmu-log-content');
            }
            return this.contentArea;
        },
        clearCache() {
            this.logBox = null;
            this.contentArea = null;
        }
    };

    // 类型配置缓存
    const typeConfig = {
        system: { text: '系统屏蔽', color: '#ff6b6b' },
        user: { text: '主播屏蔽', color: '#ffa500' },
        normal: { text: '正常显示', color: '#00ff00' }
    };

    // 记录弹幕到文本框 - 优化版本，支持敏感词高亮
    function logDanmuToBox(content, type) {
        // 检查全局开关
        if (!globalConfig.advancedFeaturesEnabled) return;

        const logBox = domCache.getLogBox();

        // 如果记录板不存在，直接返回（可能页面未加载完成）
        if (!logBox) {
            return;
        }

        if (logBox.getAttribute('data-closed') === 'true') {
            // 如果弹幕框被关闭，重新显示
            logBox.style.display = 'block';
            logBox.removeAttribute('data-closed');
        }

        const contentArea = domCache.getContentArea();
        const timestamp = new Date().toLocaleTimeString();
        const config = typeConfig[type] || typeConfig.normal;

        // 检测敏感词并高亮显示
        // 对于正常弹幕（type === 'normal'），直接跳过所有检测，使用原始内容
        let highlightedContent = content;
        let detectedWords = [];

        // 弹幕内容被系统活主播屏蔽，对弹幕进行敏感词检测
        if (type === 'system' || type === 'user') {
            detectedWords = sensitiveWordManager.detectSensitiveWords(content);
            highlightedContent = sensitiveWordManager.highlightSensitiveWords(content, detectedWords);
        }

        // 使用DocumentFragment批量操作DOM
        const fragment = document.createDocumentFragment();
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin-bottom: 8px;
            padding: 12px;
            border-left: 4px solid ${config.color};
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
            border-radius: 8px;
            border: 1px solid rgba(0, 161, 214, 0.2);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        `;

        // 弹幕记录项悬停效果
        logEntry.onmouseenter = () => {
            logEntry.style.transform = 'translateX(3px)';
            logEntry.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            logEntry.style.borderColor = 'rgba(0, 161, 214, 0.5)';
        };
        logEntry.onmouseleave = () => {
            logEntry.style.transform = 'translateX(0)';
            logEntry.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            logEntry.style.borderColor = 'rgba(0, 161, 214, 0.2)';
        };

        // 构建弹幕信息显示
        let danmuInfo = `
            <div style="font-size: 11px; color: #00a1d6; font-weight: bold; margin-bottom: 4px; text-shadow: 0 0 4px rgba(0, 161, 214, 0.3);">${timestamp}</div>
            <div style="color: ${config.color}; font-weight: bold; font-size: 12px; margin-bottom: 6px; text-shadow: 0 0 4px ${config.color}40;">[${config.text}]</div>
        `;

        // 如果有敏感词，添加敏感词提示
        if (detectedWords.length > 0) {
            const sensitiveWordsList = detectedWords.map(item => item.word).join(', ');
            danmuInfo += `<div style="font-size: 10px; color: #ff9800; margin: 4px 0; padding: 4px 8px; background: rgba(255, 152, 0, 0.1); border-radius: 4px; border-left: 3px solid #ff9800; font-weight: bold; text-shadow: 0 0 4px rgba(255, 152, 0, 0.3);">⚠️ 检测到敏感词: ${sensitiveWordsList}</div>`;
        }

        // 添加弹幕内容（支持HTML高亮）
        danmuInfo += `<div style="word-break: break-all; font-size: 13px; line-height: 1.4; margin-top: 6px; padding: 6px 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; border: 1px solid rgba(0, 161, 214, 0.1);">${highlightedContent}</div>`;

        logEntry.innerHTML = danmuInfo;

        fragment.appendChild(logEntry);
        contentArea.appendChild(fragment);
        contentArea.scrollTop = contentArea.scrollHeight;

        // 优化记录数量限制 - 批量删除旧记录
        const entries = contentArea.children;
        const maxCapacity = sensitiveWordsConfig.logBoxCapacity || sensitiveWordsConfig.defaultConfig.logBoxCapacity;
        if (entries.length > maxCapacity) {
            const toRemove = Array.from(entries).slice(0, entries.length - maxCapacity);
            toRemove.forEach(entry => entry.remove());
        }
    }


    // 从本地存储初始化敏感词配置
    function initSensitiveWordsConfig() {
        // 如果高级功能关闭，直接返回，不读取配置
        if (!globalConfig.advancedFeaturesEnabled) {
            consoleStyle.info('检测到高级功能关闭，使用基础检测模式')
            return;
        }

        const saved = localStorage.getItem('danmu_sensitive_words');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                sensitiveWordsConfig.enabled = config.enabled !== undefined ? config.enabled : sensitiveWordsConfig.defaultConfig.enabled;
                sensitiveWordsConfig.caseSensitive = config.caseSensitive !== undefined ? config.caseSensitive : sensitiveWordsConfig.defaultConfig.caseSensitive;
                sensitiveWordsConfig.fuzzyMatch = config.fuzzyMatch !== undefined ? config.fuzzyMatch : sensitiveWordsConfig.defaultConfig.fuzzyMatch;
                sensitiveWordsConfig.enableSegmentationTest = config.enableSegmentationTest !== undefined ? config.enableSegmentationTest : sensitiveWordsConfig.defaultConfig.enableSegmentationTest;
                sensitiveWordsConfig.showLogBoxByDefault = config.showLogBoxByDefault !== undefined ? config.showLogBoxByDefault : sensitiveWordsConfig.defaultConfig.showLogBoxByDefault;
                sensitiveWordsConfig.logBoxCapacity = config.logBoxCapacity !== undefined ? config.logBoxCapacity : sensitiveWordsConfig.defaultConfig.logBoxCapacity;
                sensitiveWordsConfig.exportFormat = config.exportFormat !== undefined ? config.exportFormat : sensitiveWordsConfig.defaultConfig.exportFormat;
                if (config.words && Array.isArray(config.words)) {
                    sensitiveWordsConfig.words = config.words;
                }
            } catch (e) {
                consoleStyle.warning('解析敏感词配置失败，使用默认配置');
                // 如果解析失败，清除损坏的配置
                localStorage.removeItem('danmu_sensitive_words');
            }
        } else {
            // 如果没有保存的配置，确保使用默认值
            resetToDefaultConfig()
        }
    }

    // 初始化配置
    initSensitiveWordsConfig();

    // 根据全局开关和配置决定是否默认显示弹幕记录板
    if (globalConfig.advancedFeaturesEnabled && sensitiveWordsConfig.showLogBoxByDefault) {
        // 延迟创建弹幕记录板，确保页面加载完成
        // 使用 DOMContentLoaded 或延迟执行，确保页面元素已加载
        const initLogBox = () => {
            // 再次检查是否应该创建（检查 live-player 元素）
            const livePlayerDiv = document.getElementById('live-player');
            if (livePlayerDiv) {
                createDanmuLogBox();
            } else {
                // 如果页面还在加载，再等待一段时间
                if (document.readyState === 'loading') {
                    setTimeout(initLogBox, 500);
                }
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLogBox);
        } else {
            setTimeout(initLogBox, 1000);
        }
    }

    // 检查是否在正确的页面环境（有 #live-player 元素）
    // 避免在天选时刻弹窗等 iframe 中显示加载消息和处理弹幕
    function isInValidLiveRoom() {
        try {
            // 检查是否存在 #live-player 元素
            const livePlayerDiv = document.getElementById('live-player');
            if (!livePlayerDiv) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        consoleStyle.success(`弹幕反诈脚本已加载 | ${globalConfig.successLoadMsg}`);
        // 只在真实直播间页面显示加载成功消息
        if (isInValidLiveRoom()) {
            setTimeout(() => {
               showFloatingMessage(globalConfig.successLoadMsg, globalConfig.successColor);
            }, globalConfig.msgTime);
        }
        windowCtx = self.unsafeWindow;
    } else {
        consoleStyle.error(`unsafeWindow模式不可用 | ${globalConfig.errorMsg}`);
        // 只在真实直播间页面显示错误消息
        if (isInValidLiveRoom()) {
            setTimeout(() => {
               showFloatingMessage(globalConfig.errorMsg, globalConfig.errorColor);
            }, globalConfig.msgTime);
        }
    }

    // 初始化segmentit分词器
    if (globalConfig.advancedFeaturesEnabled) {
        setTimeout(() => {
            initSegmentit();
        }, 1000);
    }

    // 优化URL检查 - 使用正则表达式和缓存
    const SEND_DM_URL_REGEX = /api\.live\.bilibili\.com\/msg\/send/;
    const urlCache = new Map();

    function checkSendDm(url) {
        if (!url) return false;

        // 使用缓存避免重复计算
        if (urlCache.has(url)) {
            return urlCache.get(url);
        }

        const result = SEND_DM_URL_REGEX.test(url);
        urlCache.set(url, result);

        // 限制缓存大小，避免内存泄漏
        if (urlCache.size > 100) {
            const firstKey = urlCache.keys().next().value;
            urlCache.delete(firstKey);
        }

        return result;
    }

    function showFloatingMessage(message, color) {
        const div = document.createElement('div');
        div.textContent = message;
        div.style.cssText = `
            position: fixed;
            top: ${globalConfig.dmTop};
            left: ${globalConfig.dmLeft};
            color: ${color};
            font-size: ${globalConfig.dmFontSize};
            z-index: 9999;
            white-space: nowrap;
            will-change: transform;
            transform: translateZ(0);
            pointer-events: none;
        `;
        document.body.appendChild(div);

        // 使用更高效的动画实现
        let startTime = null;
        const animationDuration = 10000; // 10秒动画
        const startLeft = -16; // 起始位置
        const endLeft = 100; // 结束位置

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            if (progress >= 1) {
                div.remove();
                return;
            }

            // 使用缓动函数让动画更自然
            const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const currentLeft = startLeft + (endLeft - startLeft) * easeProgress;

            div.style.transform = `translate3d(${currentLeft}%, 0, 0)`;
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        // 备用清理机制
        setTimeout(() => {
            if (div.parentNode) {
                div.remove();
            }
        }, animationDuration + 1000);
    }

    // 异步处理弹幕响应数据
    async function processDanmuResponse(data, originalResponse, resolve, reject) {
        try {
            // 检查是否在正确的页面环境
            if (!isInValidLiveRoom()) {
                // 不在真实直播间页面，不处理
                resolve(originalResponse);
                return;
            }

            // 在修改数据前提取弹幕内容
            if (data.data && data.data.mode_info && data.data.mode_info.extra) {
                try {
                    const extraData = JSON.parse(data.data.mode_info.extra);
                    if (extraData.content) {
                        // 对所有弹幕进行segmentit分词测试
                        testSegmentitSegmentation(extraData.content);

                        // 根据屏蔽类型进行针对性输出
                        if (data.msg === "f") {
                            console.log("系统屏蔽弹幕:", extraData.content);
                            logDanmuToBox(extraData.content, 'system');
                        } else if (data.msg === "k") {
                            console.log("主播屏蔽弹幕:", extraData.content);
                            logDanmuToBox(extraData.content, 'user');
                        } else {
                            console.log("正常弹幕:", extraData.content);
                            logDanmuToBox(extraData.content, 'normal');
                        }
                    }
                } catch (e) {
                    console.log("解析弹幕内容失败:", e);
                }
            }

            // 处理响应数据
            if (data.code === 0 && data.msg === "f") {
                for(let i = 0; i < globalConfig.exp; i++){
                    showFloatingMessage(globalConfig.banSystemMsg, globalConfig.banColorSystem);
                }
                data.code = -101;
                data.message = "你的弹幕没发出去，你被骗了，系统干的";
                data.ttl = 1;
                delete data.msg;
                delete data.data;
            } else if (data.code === 0 && data.msg === "k") {
                for(let i = 0; i < globalConfig.exp; i++){
                    showFloatingMessage(globalConfig.banUserMsg, globalConfig.banColorUser);
                }
                data.code = -101;
                data.message = "你的弹幕没发出去，你被骗了，主播干的";
                data.ttl = 1;
                delete data.msg;
                delete data.data;
            } else {
                console.log("恭喜，您的弹幕正常显示！");
                if(globalConfig.successSend === true){
                    showFloatingMessage(globalConfig.successMsg, globalConfig.successColor);
                }
            }

            const body = JSON.stringify(data);
            const newRes = new Response(body, {
                status: originalResponse.status,
                statusText: originalResponse.statusText,
                headers: originalResponse.headers
            });
            resolve(newRes);
        } catch (error) {
            console.error("处理弹幕响应时出错:", error);
            showFloatingMessage(globalConfig.errorSendMsg, globalConfig.errorColor);
            reject(error);
        }
    }

    const originFetchBLDMAF = windowCtx.fetch;
    windowCtx.fetch = (...arg) => {
        // 检查是否在正确的页面环境
        if (!isInValidLiveRoom()) {
            // 不在真实直播间页面，直接调用原始 fetch
            return originFetchBLDMAF(...arg);
        }

        let arg0 = arg[0];
        let url = "";
        switch (typeof arg0) {
            case "object":
                url = arg0.url;
                break;
            case "string":
                url = arg0;
                break;
            default:
                break;
        }

        if (checkSendDm(url)) {
            return new Promise((resolve, reject) => {
                originFetchBLDMAF(...arg).then(async r => {
                    try {
                        // 使用clone()避免消费原始响应
                        const clonedResponse = r.clone();
                        const data = await clonedResponse.json();
                        await processDanmuResponse(data, r, resolve, reject);
                    } catch (e) {
                        console.error("处理弹幕请求时出错:", e);
                        showFloatingMessage(globalConfig.errorSendMsg, globalConfig.errorColor);
                        reject(e);
                    }
                }).catch(e => {
                    console.error("弹幕请求失败:", e);
                    showFloatingMessage(globalConfig.errorSendMsg, globalConfig.errorColor);
                    reject(e);
                });
            });
        } else {
            return originFetchBLDMAF(...arg);
        }
    };
})();
