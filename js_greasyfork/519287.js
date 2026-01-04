// ==UserScript==
// @name         🎬 YouTube AI 翻译助手 Pro - 实时翻译+AI配音
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @author wangwangit
// @description  🚀 强大的 YouTube 视频翻译工具 | ✨ 实时英译中 | 🎯 智能AI翻译 | 🔊 自然语音朗读 | 📝 内容智能总结 | 💫 支持多种AI模型和语音引擎 | 🎨 优雅界面设计 | 让观看YouTube视频更轻松愉快!
// @match        *://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      xxxx
// @connect      xxxx
// @connect      api.x.ai
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519287/%F0%9F%8E%AC%20YouTube%20AI%20%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%20Pro%20-%20%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91%2BAI%E9%85%8D%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/519287/%F0%9F%8E%AC%20YouTube%20AI%20%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%20Pro%20-%20%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91%2BAI%E9%85%8D%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 1. 首先声明全局配置变量
    let CONFIG;




    // 配置管理器
    class ConfigManager {
        static CONFIG_KEY = 'youtube_config';

        static getDefaultConfig() {
            return {
                AI_MODELS: {
                    TYPE: 'OPENAI',
                    XAI: {
                        API_KEY: '你的密钥',
                        API_URL: '你的api地址,注意,要携带/v1/chat/completions',
                        MODEL: 'grok-beta',
                        STREAM: false
                    },
                    OPENAI: {
                        API_KEY: '你的密钥',
                        API_URL: '你的api地址,注意,要携带/v1/chat/completions',
                        MODEL: '你想要使用的模型名称',
                        STREAM: true
                    }
                },
                TTS: {
                    TYPE: 'BROWSER',
                    VITS: {
                        BASE_URL: 'xxxx',
                        DEFAULT_VOICE: "char_model/原神/珊瑚宫心海/牌局的形势千变万化，想要获胜的话…有时候也必须兵行险着。.wav"
                    },
                    BROWSER: {
                        RATE: 1.0,
                        PITCH: 1.0,
                        VOLUME: 1.0,
                        VOICE: null
                    }
                },
                CACHE: {
                    AUDIO_SIZE: 500,
                    TRANS_SIZE: 500
                }
            };
        }

        static saveConfig(config) {
            try {
                const configString = JSON.stringify(config);
                localStorage.setItem('youtubeTranslatorConfig', configString);
                console.log('配置已保存:', config);
            } catch (error) {
                console.error('保存配置失败:', error);
            }
        }

        static loadConfig() {
            try {
                const savedConfig = localStorage.getItem('youtubeTranslatorConfig');
                if (savedConfig) {
                    const parsedConfig = JSON.parse(savedConfig);
                    // 合并保存的配置和默认配置
                    CONFIG = {...this.getDefaultConfig(), ...parsedConfig};
                    console.log('已加载保存的配置:', CONFIG);
                }
                return CONFIG;
            } catch (error) {
                console.error('加载配置失败:', error);
                return CONFIG;
            }
        }
    }

        // 初始化默认配置
    CONFIG = ConfigManager.getDefaultConfig();
    // 加载保存的配置
    CONFIG = ConfigManager.loadConfig();
    // 2. 创建基础缓存类
    class BaseCache {

        /**
         * @description: 构造函数，初始化缓存。
         * @param {number} capacity - 缓存容量。
         * @param {string} prefix - 缓存键前缀。
         */
        constructor(capacity, prefix) {
            this.cache = new LRUCache(capacity);
            this.prefix = prefix;
        }

        /**
         * @description: 生成缓存键。
         * @param {string} text - 用于生成缓存键的文本。
         * @param {number} startTime - 开始时间。
         * @return {string} - 生成的缓存键。
         */
        generateCacheKey(startTime) {
            const uid = getUid();
            const key = `${this.prefix}${uid}${startTime}`;

            // console.log('生成缓存键:', {
            //     前缀: this.prefix,
            //     开始时间: startTime,
            //     原始文本: text.slice(0, 30) + '...',
            //     缓存键: key
            // });

            return key;
        }




        /**
         * @description: 将缓存保存到 localStorage。
         * @param {string} storageKey - localStorage 键。
         * @return {Promise<void>}
         * @throws {Error} - 保存缓存失败时抛出异常。
         */
        async saveToStorage(storageKey) {
            try {
                const cacheData = {};
                this.cache.cache.forEach((value, key) => {
                    cacheData[key] = value;
                });

                localStorage.setItem(storageKey, JSON.stringify(cacheData));

                // console.log('cache', '缓存已保存:', {
                //     缓存条目数: Object.keys(cacheData).length,
                //     存储大小: JSON.stringify(cacheData).length + ' bytes'
                // });
            } catch (error) {
                console.log('error', '保存缓存失败:', error);
            }
        }

         /**
         * @description: 从 localStorage 加载缓存。
         * @param {string} storageKey - localStorage 键。
         * @return {Promise<null|object>} - 加载的缓存数据，如果未找到则返回 null。
         * @throws {Error} - 加载缓存失败时抛出异常。
         */
         async loadFromStorage(storageKey) {
            try {
                console.log('loadFromStorage', '开始加载缓存:', storageKey);
                const cacheData = localStorage.getItem(storageKey);
                if (!cacheData) {
                    console.log('warning', '未找到缓存数据');
                    return null;
                }

                const parsedCache = JSON.parse(cacheData);
                Object.entries(parsedCache).forEach(([key, value]) => {
                    this.cache.put(key, value);
                });

                // console.log('success', '已加载缓存:', {
                //     缓存条目数: this.cache.size,
                //     缓存容量: this.cache.capacity
                // });
            } catch (error) {
                console.log('error', '加载缓存失败:', error);
            }
        }



    }

    // LRU缓存实现
    class LRUCache {
        /**
         * @description: 构造函数，初始化LRU缓存。
         * @param {number} capacity - 缓存容量。
         */
        constructor(capacity) {
            this.capacity = capacity;
            this.cache = new Map();

            // 最大历史记录数
            this.maxHistorySize = 10;
        }

        /**
         * @description: 获取缓存值。
         * @param {string} key - 缓存键。
         * @return {any} - 缓存值，如果未找到则返回 null。
         */
        get(key) {
            if (!this.cache.has(key)) return null;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value); // 更新访问时间
            return value;
        }

        /**
         * @description: 设置缓存值。
         * @param {string} key - 缓存键。
         * @param {any} value - 缓存值。
         * @return {void}
         */
        put(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.capacity) {
                // 移除最近最少使用的条目
                this.cache.delete(this.cache.keys().next().value);
            }
            this.cache.set(key, value);
        }

        /**
         * @description: 检查缓存中是否存在键。
         * @param {string} key - 缓存键。
         * @return {boolean} - 如果存在则返回 true，否则返回 false。
         */
        has(key) {
            return this.cache.has(key);
        }

        /**
         * @description: 清空缓存。
         * @return {void}
         */
        clear() {
            this.cache.clear();
        }
    }



    // 音频管理器
    class AudioManager extends BaseCache {
        constructor() {
            super(CONFIG.CACHE.AUDIO_SIZE, 'audio' + getUid());
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.db = null;
            this.dbName = 'YTTranslatorAudio';
            this.storeName = 'audioBuffers';
            this.initDB();

             // 添加浏览器TTS初始化
            this.synth = window.speechSynthesis;
            this.currentUtterance = null;
        }


            /**
         * @description: 停止当前音频播放。
         * @return {void}
         */
        async stopVideo() {
            if (CONFIG.TTS.TYPE === 'BROWSER' && this.currentUtterance) {
                this.synth.cancel();
                this.currentUtterance = null;
                this.isPlaying = false;
            } else if (this.currentSource) {
                try {
                    this.currentSource.stop();
                    this.currentSource.disconnect();
                    this.currentSource = null;
                    this.isPlaying = false;
                    console.log('停止当前音频播放');
                } catch (error) {
                    console.error('停止音频失败:', error);
                }
            }
        }



        /**
         * @description: 处理 SSE 响应
         * @param {string} eventId - 事件ID
         * @return {Promise<string>} - 音频URL
         */
        async handleSSEResponse(eventId) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `${CONFIG.TTS.EDGE.BASE_URL}/call/textToSpeech/${eventId}`, true);
                xhr.setRequestHeader('Accept', 'text/event-stream');
                xhr.setRequestHeader('Cache-Control', 'no-cache');

                let buffer = '';

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 3) {
                        let newData = xhr.responseText.substring(buffer.length);
                        buffer = xhr.responseText;

                        let lines = newData.split('\n');
                        lines.forEach(line => {
                            if (line.startsWith('data:')) {
                                try {
                                    const jsonData = JSON.parse(line.slice(5));
                                    if (Array.isArray(jsonData) && jsonData[0]?.path) {
                                        xhr.abort();
                                        const url = `${CONFIG.TTS.EDGE.BASE_URL}/file=${jsonData[0].path}`;
                                        resolve(url);
                                    }
                                } catch (e) {
                                    console.log('解析SSE数据失败:', e);
                                }
                            }
                        });
                    }
                };

                xhr.onerror = reject;
                xhr.send();

                // 30秒超时
                setTimeout(() => {
                    xhr.abort();
                    reject(new Error('SSE请求超时'));
                }, 300000);
            });
        }

        /**
         * @description: 播放音频。
         * @param {AudioBuffer} buffer - 要播放的 AudioBuffer。
         * @param {number} startTime - 开始时间 (可选)。
         * @return {Promise<void>} - 播放完成的 Promise。
         * @throws {Error} - 播放失败时抛出异常。
         */
        async playAudio(buffer) {
            if (CONFIG.TTS.TYPE === 'BROWSER') {
                return new Promise((resolve, reject) => {
                    try {
                        this.synth.cancel(); // 停止当前播放
                        console.log('浏览器TTS模式下直接返回翻译文本');
                        const utterance = new SpeechSynthesisUtterance(buffer);
                        this.currentUtterance = utterance;

                        // 设置语音参数
                        utterance.lang = 'zh-CN';
                        utterance.rate = CONFIG.TTS.BROWSER.RATE;
                        utterance.pitch = CONFIG.TTS.BROWSER.PITCH;
                        utterance.volume = CONFIG.TTS.BROWSER.VOLUME;

                                        // 设置选中的语音
                        if (CONFIG.TTS.BROWSER.VOICE) {
                            const voices = speechSynthesis.getVoices();
                            const selectedVoice = voices.find(voice =>
                                voice.name === CONFIG.TTS.BROWSER.VOICE.name &&
                                voice.lang === CONFIG.TTS.BROWSER.VOICE.lang
                            );
                            if (selectedVoice) {
                                utterance.voice = selectedVoice;
                            }
                        }


                        utterance.onend = () => {
                            this.isPlaying = false;
                            this.currentUtterance = null;
                            resolve();
                        };

                        utterance.onerror = (error) => {
                            this.isPlaying = false;
                            this.currentUtterance = null;
                            reject(error);
                        };

                        this.isPlaying = true;
                        this.synth.speak(utterance);
                    } catch (error) {
                        this.isPlaying = false;
                        this.currentUtterance = null;
                        reject(error);
                    }
                });
            } else {
                return new Promise((resolve, reject) => {
                    try {
                        //打印当前播放器状态
                        //console.log('当前播放器状态:', this.shouldPlay);
                        // 检查是否应该播放 - 修改逻辑
                        // if (!this.shouldPlay) { // 改为检查 !this.shouldPlay
                        //     console.log('播放已停止，跳过音频播放');
                        //     return resolve(); // 直接返回，不播放音频
                        // }

                        // 停止当前播放
                        // if (this.currentSource) {
                        //     console.log('我要停止当前播放');
                        //     this.stop();
                        // }

                        // 创建新的音频源
                        const source = this.audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(this.audioContext.destination);
                        this.currentSource = source;
                        this.isPlaying = true;

                        // 监听播放完成
                        source.onended = () => {
                            this.isPlaying = false;
                            this.currentSource = null;
                            resolve();
                        };

                        // 开始播放
                        source.start(0);
                    } catch (error) {
                        this.isPlaying = false;
                        this.currentSource = null;
                        reject(error);
                    }
                });
            }
        }



        // 初始化IndexedDB
        async initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, 1);

                request.onerror = () => {
                    console.error('打开数据库失败:', request.error);
                    reject(request.error);
                };
                request.onsuccess = () => {
                    this.db = request.result;
                    console.log('数据库连接成功');
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                        console.log('创建音频缓存存储空间');
                    }
                };
            });
        }

        /**
         * @description: 将 AudioBuffer 序列化为可存储的对象。
         * @param {AudioBuffer} audioBuffer - 要序列化的 AudioBuffer。
         * @return {object} - 序列化后的对象。
         */
        serializeAudioBuffer(audioBuffer) {
            const channelData = [];
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                channelData.push(Array.from(audioBuffer.getChannelData(i)));
            }

            return {
                channelData,
                sampleRate: audioBuffer.sampleRate,
                length: audioBuffer.length,
                duration: audioBuffer.duration,
                numberOfChannels: audioBuffer.numberOfChannels
            };
        }


        /**
         * @description: 将序列化后的对象反序列化为 AudioBuffer。
         * @param {object} data - 序列化后的对象。
         * @return {Promise<AudioBuffer>} - 反序列化后的 AudioBuffer。
         */
        async deserializeAudioBuffer(data) {
            const audioBuffer = this.audioContext.createBuffer(
                data.numberOfChannels,
                data.length,
                data.sampleRate
            );

            for (let i = 0; i < data.numberOfChannels; i++) {
                const channelData = new Float32Array(data.channelData[i]);
                audioBuffer.copyToChannel(channelData, i);
            }

            return audioBuffer;
        }

        /**
         * @description: 将音频数据保存到 IndexedDB。
         * @param {string} key - 缓存键。
         * @param {AudioBuffer} audioBuffer - 要保存的 AudioBuffer。
         * @return {Promise<void>} - 保存完成的 Promise。
         * @throws {Error} - 保存失败时抛出异常。
         */
        async saveToIndexedDB(key, audioBuffer) {
            if (!this.db) await this.initIndexedDB();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const serializedData = this.serializeAudioBuffer(audioBuffer);

                const request = store.put(serializedData, key);

                request.onsuccess = () => {
                    console.log('音频数据已保存到 IndexedDB:', key);
                    resolve();
                };

                request.onerror = () => {
                    console.error('保存音频数据失败:', request.error);
                    reject(request.error);
                };
            });
        }


        // 从 IndexedDB 加载
        async loadFromIndexedDB(key) {
            if (!this.db) await this.initIndexedDB();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(key);

                request.onsuccess = async () => {
                    if (request.result) {
                        try {
                            const audioBuffer = await this.deserializeAudioBuffer(request.result);
                     //       console.log('从 IndexedDB 加载音频数据成功:', key);
                            resolve(audioBuffer);
                        } catch (error) {
                            console.error('反序列化音频数据失败:', error);
                            reject(error);
                        }
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = () => {
                    console.error('加载音频数据失败:', request.error);
                    reject(request.error);
                };
            });
        }


            // 获取音频
        async getAudio(newSubtitles, startTime) {

            if (CONFIG.TTS.TYPE === 'BROWSER') {
                // 浏览器TTS模式下直接返回翻译文本
                return newSubtitles.translation;
            }

            const cacheKey = this.generateCacheKey(startTime);

            // 检查缓存
            try {
                const cached = await this.loadFromIndexedDB(cacheKey);
                if (cached) {
                    console.log('使用缓存的音频:', cacheKey);
                    return cached;
                }
            } catch (error) {
                console.error('读取音频缓存失败:', error);
            }

            // 获取新音频
            try {
                const audioBuffer = await this.fetchAudioWithRetry(newSubtitles.translation, newSubtitles.duration);
                // 保存到缓存
                await this.saveToIndexedDB(cacheKey, audioBuffer);
                return audioBuffer;
            } catch (error) {
                console.error('获取音频失败:', error);
                throw error;
            }
        }


        /**
         * @description: 使用重试机制获取音频。
         * @param {string} text - 要转换为音频的文本。
         * @param {number} duration - 预期音频持续时间。
         * @return {Promise<AudioBuffer|null>} - 获取的 AudioBuffer，如果失败则返回 null。
         */
        async fetchAudioWithRetry(text, duration) {
            console.log('开始获取音频:', {
                文本: text,
                持续时间: duration
            });
            // 添加更细致的语速调整
            const wordsCount = text.length;
            const avgCharDuration = 0.2; // 每个字符的平均时长
            const expectedDuration = wordsCount * avgCharDuration;
            let speed_factor = duration ? expectedDuration / duration : 1.0;

            // 使用更平滑的映射函数
            if (speed_factor < 0.8) {
                speed_factor = 0.8 + (speed_factor / 0.8) * 0.2;
            } else if (speed_factor > 1.2) {
                speed_factor = 1.2 - (1.2 / speed_factor) * 0.2;
            }

            // 添加音频时长验证
            const buffer = await this.fetchAudio(text, speed_factor);
            return buffer;
        }

        /**
         * @description: 获取音频数据。
         * @param {string} text - 要转换为音频的文本。
         * @param {number} speed_factor - 语速因子。
         * @return {Promise<AudioBuffer>} - 获取的 AudioBuffer。
         * @throws {Error} - 获取音频失败时抛出异常。
         */
        async fetchAudio(text, speed_factor = 1.0) {
            if (CONFIG.TTS.TYPE === 'EDGE') {
                return await this.fetchAudioEdge(text);
            } else {
                // 原有的 VITS 方法
                const params = new URLSearchParams({
                    text: text,
                    text_lang: "zh",
                    ref_audio_path: CONFIG.TTS.VITS.DEFAULT_VOICE,
                    prompt_lang: "zh",
                    prompt_text: "牌局的形势千变万化，想要获胜的话…有时候也必须兵行险着。",
                    top_k: "5",
                    top_p: "1",
                    temperature: "0.8",
                    speed_factor: speed_factor,
                    fragment_interval: "0.3"
                });

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `${CONFIG.TTS.VITS.BASE_URL}?${params.toString()}`,
                        responseType: 'arraybuffer',
                        headers: {
                            'Accept': '*/*',
                            'Origin': 'https://xxxx',
                            'Referer': 'https://xxxx'
                        },
                        onload: async (response) => {
                            try {
                                if (response.status !== 200) {
                                    throw new Error(`HTTP Error: ${response.status}`);
                                }
                                const audioBuffer = await this.audioContext.decodeAudioData(response.response);
                                resolve(audioBuffer);
                            } catch (error) {
                                reject(error);
                            }
                        },
                        onerror: reject
                    });
                });
            }
        }

        // 批量预加载音频
        async preloadAudioBatch(subtitles, concurrentLimit = 3) {
            // 创建任务数组
            const tasks = subtitles.map(sub => ({
                text: sub.translation,
                startTime: sub.startTime
            }));

            // 并发控制
            const results = [];
            for (let i = 0; i < subtitles.length; i += concurrentLimit) {
                const batch = subtitles.slice(i, i + concurrentLimit);
                const promises = batch.map(task =>
                    this.getAudio(task, task.startTime)
                        .catch(error => {
                            console.error('音频加载失败:', error);
                            return null;
                        })
                );

                const batchResults = await Promise.all(promises);
                results.push(...batchResults);
                // 简单进度显示
                console.log(`音频加载进度: ${i + batch.length}/${tasks.length}`);
                // 等待500毫秒
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            return results;
        }


    }

    // 添加翻译管理器类
    class TranslationManager extends BaseCache {
        constructor() {
            super(CONFIG.CACHE.TRANS_SIZE, 'trans' + getUid());
            this.hasCache = false; // 添加缓存标志
            this.currentModel = CONFIG.AI_MODELS.TYPE;
            this.newSubtitles = [];
            // 定期保存缓存
          //  setInterval(() => this.saveToStorage('ytTranslatorTransCache' + getUid()), 30000);
            this.loadFromStorage('ytTranslatorTransCache' + getUid());
        }



        // 根据不同模型构建请求体
        buildRequestBody(text, modelConfig) {
            const systemPrompt = `你是一位资深的Netflix字幕翻译专家，精通英汉翻译，对影视作品的文化内涵和语言特点有深刻理解。你的任务是将英文Netflix字幕翻译成自然流畅、符合中文表达习惯的中文字幕，并对字幕进行必要的合并和调整，以提升观众的观影体验。

**输入格式**：
每行字幕格式为："时间戳@@@英文字幕"

**输出格式**：
每行字幕格式为："时间戳@@@合并后的英文字幕@@@合并后的中文翻译"

**翻译流程**：

1. **字幕合并与优化**：
   - 分析连续最多3行的字幕及其上下文，酌情合并：
     - 同一人物的连续短句，构成完整表达。
     - 对前一句的补充说明或解释。
     - 表达并列关系或因果关系的短句。
   - 不合并的情况：
     - 不同人物的对话。
     - 场景切换或情绪转变。
     - 语气词或简短感叹词需单独保留以传达情感。
   - **合并后中文翻译应尽量控制在20-30个汉字之间**。如超过30个汉字，请尝试拆分，并根据句意调整时间戳，确保每句长度合理，避免字幕过长影响观影体验。

2. **翻译要求**：
   - **准确传达**原文的语气、情感、文化背景和潜台词。
   - **译文自然流畅**，符合中文表达习惯。
   - **妥善处理**俚语、习语、文化特定表达、语气词、情感表达等。
   - **保持对话连贯性**，处理好人称代词和指代关系，确保人物语气一致。
   - 避免误译、漏译、错译。

3. **输出规范**：
   - **格式**："时间戳@@@合并后的英文字幕@@@合并后的中文翻译"
   - **每条字幕独立一行**，不添加任何额外注释或说明。
   - **时间戳格式正确**，保留3位小数。

**示例**：

*正面示例*：

输入：
01.234@@@What are you doing?
01.876@@@I'm reading a book.
02.345@@@It's about a detective.

输出：
01.234@@@What are you doing? I'm reading a book. It's about a detective.@@@你在做什么？我在读一本关于侦探的书。

输入：
03.456@@@The car exploded.
04.123@@@Run!

输出：
03.456@@@The car exploded.@@@汽车爆炸了！
04.123@@@Run!@@@快跑！

输入：
05.678@@@He's a real piece of work.
06.345@@@You can say that again.

输出：
05.678@@@He's a real piece of work.@@@他真是个怪胎。
06.345@@@You can say that again.@@@你说得对极了。

*反面示例*：

当合并后中文翻译过长，需要拆分：

输入：
01.234@@@He picked up the phone.
01.876@@@He dialed a number.
02.345@@@And he started talking. It was a long and complicated conversation.

错误输出：
01.234@@@He picked up the phone. He dialed a number. And he started talking. It was a long and complicated conversation.@@@他拿起电话，拨了个号码，然后开始说话。这是一段漫长而复杂的对话。

正确输出：
01.234@@@He picked up the phone. He dialed a number.@@@他拿起电话，拨了个号码。
01.876@@@And he started talking.@@@然后他开始说话。
02.345@@@It was a long and complicated conversation.@@@这是一段漫长而复杂的对话。
	`;

            const baseBody = {
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                model: modelConfig.MODEL,
                temperature: 0.2
            };

            // 只在支持流式的模型中添加 stream 参数

            if (modelConfig.STREAM) {
                baseBody.stream = true;
            }else{
                baseBody.stream = false;
            }

            return baseBody;
        }

            // 从不同模型的响应中提取翻译文本
        extractTranslation(data) {
            const modelConfig = CONFIG.AI_MODELS[this.currentModel];

            if (modelConfig.STREAM) {
                // 流式响应格式
                return data.choices[0]?.delta?.content || '';
            } else {
                // 非流式响应格式
                return data.choices[0]?.message?.content || '';
            }
        }


        // 非流式翻译方法
        async normalTranslation(text) {
            const modelConfig = CONFIG.AI_MODELS[this.currentModel];
            if (!modelConfig) {
                throw new Error(`未找到模型配置: ${this.currentModel}`);
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${modelConfig.API_KEY}`
            };

            const requestBody = this.buildRequestBody(text, modelConfig);

            try {
                const response = await fetch(modelConfig.API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return this.extractTranslation(data);
            } catch (error) {
                console.error('非流式翻译失败:', error);
                throw error;
            }
        }


        // 新增流式翻译方法
        async streamTranslation(text) {
            const modelConfig = CONFIG.AI_MODELS[this.currentModel];
            if (!modelConfig) {
                throw new Error(`未找到模型配置: ${this.currentModel}`);
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${modelConfig.API_KEY}`
            };

            // 根据不同模型构建请求体
            const requestBody = this.buildRequestBody(text, modelConfig);

            try {
                const response = await fetch(modelConfig.API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                let decoder = new TextDecoder();
                let buffer = '';
                let translation = '';

                while (true) {
                    const {value, done} = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, {stream: true});
                    const lines = buffer.split('\n');

                    // 处理完整的行
                    for (let i = 0; i < lines.length - 1; i++) {
                        const line = lines[i].trim();
                        if (!line || line === 'data: [DONE]') continue;

                        if (line.startsWith('data: ')) {
                            const data = JSON.parse(line.slice(5));
                            translation += this.extractTranslation(data);
                        }
                    }

                    // 保留未完成的行
                    buffer = lines[lines.length - 1];
                }

                return translation.trim();
            } catch (error) {
                console.error('流式翻译失败:', error);
                throw error;
            }
        }


            /**
         * @description: 获取字幕总结
         * @param {Array<SubtitleEntry>} subtitles - 字幕数组
         * @return {Promise<string>} - 总结文本
         */
        async getSummary(subtitles) {
            try {
                // 将所有字幕文本合并
                const allText = subtitles
                    .map(sub => `${sub.text}\n${sub.translation || ''}`)
                    .join('\n');

                const prompt = `请用中文总结以下视频内容的要点（不超过300字）：\n\n${allText}`;

                const response = await fetch(this.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.API_KEY}`
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: "system",
                                content: "你是一个专业的视频内容总结专家。请简明扼要地总结视频的主要内容，重点和关键信息。"
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        model: "grok-beta",
                        stream: false,
                        temperature: 0.3
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                console.error('获取总结失败:', error);
                throw error;
            }
        }

        // 批量翻译字幕
        async translateBatch(subtitles) {
            if (!subtitles || subtitles.length === 0) return [];

            // 获取字幕数量
            const subLength = parseInt(localStorage.getItem('subLength' + getUid()) || '0');
            console.log('字幕数量:', subLength);
            // 获取缓存中字幕数量
            const cachedSubLength = this.cache.cache.size;
            console.log('缓存中字幕数量:', cachedSubLength);

            if(cachedSubLength <= subLength && cachedSubLength > 0){
                // 打印缓存信息
                console.log('✅ 使用现有缓存', this.cache.cache);
                return Array.from(this.cache.cache.values()).sort((a, b) => a.startTime - b.startTime);
            }

            try {
                // 将字幕转换为特定格式: 时间点@@@文本
                const formattedSubtitles = subtitles.map(sub =>
                    `${sub.startTime.toFixed(3)}@@@${sub.text}`
                ).join('\n');

                // console.log('开始批量翻译:', {
                //     字幕数量: subtitles.length,
                //     样本: formattedSubtitles
                // });

                const translation = await this.fetchTranslation(formattedSubtitles);
                // 解析翻译结果
                const translationLines = translation.split('\n').filter(line => line.trim());
                console.log('翻译完成:', {
                    翻译结果数: translationLines.length,
                    样本: translationLines
                });




                 // 重置新字幕数组
                this.newSubtitles = [];

                // 遍历翻译结果
                for (let i = 0; i < translationLines.length; i++) {
                    const line = translationLines[i];
                    const [timeStr, oldText, translatedText] = line.split('@@@');
                    if (!timeStr || !oldText || !translatedText) continue;

                    const startTime = parseFloat(timeStr);

                    // 查找这个时间点对应的原字幕
                    const originalSub = subtitles.find(s => Math.abs(s.startTime - startTime) < 0.1);
                    if (!originalSub) continue;

                    // 创建新的字幕条目
                    const newSubtitle = new SubtitleEntry(oldText, startTime, originalSub.duration);
                    newSubtitle.translation = translatedText;

                    // 查找下一个翻译行的时间点（如果存在）
                    // if (i < translationLines.length - 1) {
                    //     const nextLine = translationLines[i + 1];
                    //     const [nextTimeStr] = nextLine.split('@@@');
                    //     const nextTime = parseFloat(nextTimeStr);

                    //     // 查找两个时间点之间的所有原文字幕
                    //     const intermediateSubtitles = subtitles.filter(sub =>
                    //         sub.startTime > startTime &&
                    //         sub.startTime < nextTime
                    //     );

                    //     // 如果存在中间字幕，合并原文
                    //     if (intermediateSubtitles.length > 0) {
                    //         newSubtitle.text = [originalSub.text, ...intermediateSubtitles.map(sub => sub.text)].join(' ');
                    //         // 更新持续时间为最后一个字幕的结束时间
                    //         const lastSub = intermediateSubtitles[intermediateSubtitles.length - 1];
                    //         newSubtitle.duration = (lastSub.startTime + lastSub.duration) - startTime;
                    //     }
                    // }

                    this.newSubtitles.push(newSubtitle);
                }

                // 按时间排序
                this.newSubtitles.sort((a, b) => a.startTime - b.startTime);

                // 调整持续时间，确保不会重叠
                for (let i = 0; i < this.newSubtitles.length - 1; i++) {
                    const currentSub = this.newSubtitles[i];
                    const nextSub = this.newSubtitles[i + 1];

                    if (currentSub.startTime + currentSub.duration > nextSub.startTime) {
                        currentSub.duration = nextSub.startTime - currentSub.startTime;
                    }
                }

                console.log('字幕重构完成:', {
                    原字幕数: subtitles.length,
                    新字幕数: this.newSubtitles.length,
                    样本: this.newSubtitles.slice(0, 3).map(sub => ({
                        时间: sub.startTime,
                        持续: sub.duration,
                        原文: sub.text,
                        译文: sub.translation
                    }))
                });

                // 将翻译结果保存到缓存
                this.newSubtitles.forEach(sub => {
                    this.cache.put(this.generateCacheKey(sub.startTime), sub);
                });

                // 在storage中保存缓存,记录当前字幕数量
                localStorage.setItem('subLength' + getUid(), this.newSubtitles.length);

                // 设置缓存标志
                this.hasCache = true;

                // 返回重构后的字幕数组
                return this.newSubtitles;
            } catch (error) {
                console.error('批量翻译失败:', error);
                throw error;
            }
        }




        // 调用翻译API
       async fetchTranslation(text) {
            console.log('开始翻译:', {
                文本长度: text.length,
                使用模型: this.currentModel,
                是否流式: CONFIG.AI_MODELS[this.currentModel].STREAM,
                具体模型: CONFIG.AI_MODELS[this.currentModel].MODEL
            });

            const MAX_LENGTH = 10000; // 设置单次翻译的最大字符数
            const MIN_SEGMENT_SIZE = 3000; // 最小分段大小
            const DELAY_BETWEEN_REQUESTS = 5000; // 请求间隔5秒

            // 如果文本长度在限制范围内，直接翻译
            if (text.length <= MAX_LENGTH) {
                return CONFIG.AI_MODELS[this.currentModel].STREAM ?
                    await this.streamTranslation(text) :
                    await this.normalTranslation(text);
            }

            try {
                // 将文本按换行符分割成行
                const lines = text.split('\n');
                const segments = [];
                let currentSegment = [];
                let currentLength = 0;

                // 智能分段
                for (const line of lines) {
                    if (currentLength + line.length > MAX_LENGTH ||
                        (currentLength > MIN_SEGMENT_SIZE && line.includes('@@@'))) {
                        if (currentSegment.length > 0) {
                            segments.push(currentSegment.join('\n'));
                            currentSegment = [];
                            currentLength = 0;
                        }
                    }

                    currentSegment.push(line);
                    currentLength += line.length;
                }

                // 添加最后一段
                if (currentSegment.length > 0) {
                    segments.push(currentSegment.join('\n'));
                }

                console.log('文本分段完成:', {
                    总行数: lines.length,
                    分段数: segments.length,
                    各段长度: segments.map(s => s.length)
                });

                // 串行处理所有分段，每次请求之间添加延时
                const translations = [];
                for (let i = 0; i < segments.length; i++) {
                    // 如果不是第一个请求，等待指定时间
                    if (i > 0) {
                        console.log(`等待 ${DELAY_BETWEEN_REQUESTS/1000} 秒后继续下一个请求...`);
                        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
                    }

                    console.log(`开始处理第 ${i + 1}/${segments.length} 段`);
                    const translation = await (CONFIG.AI_MODELS[this.currentModel].STREAM ?
                        this.streamTranslation(segments[i]) :
                        this.normalTranslation(segments[i]));

                    translations.push(translation);
                    console.log(`第 ${i + 1} 段翻译完成`);
                }

                // 合并结果
                const combinedTranslation = translations.join('\n');

                console.log('所有分段翻译完成，合并后行数:', combinedTranslation.split('\n').length);
                return combinedTranslation;

            } catch (error) {
                console.error('分段翻译失败:', error);
                throw error;
            }
        }

    }

    // 添加视频控制器类
    class VideoController {
        constructor() {
            this.player = PlayerManager.getInstance().player;
            this.videoElement = PlayerManager.getInstance().videoElement;
            this.subtitleManager = new SubtitleManager();
            this.isPlaying = false;
            // 打印变量信息
            console.log("VideoController: " ,this.player, this.videoElement, this.subtitleManager)
        }


        // 播放视频
        playVideo() {
            if (this.player && typeof this.player.playVideo === 'function') {
                this.player.playVideo();
                this.isPlaying = true;
                console.log('视频开始播放');
            } else if (this.videoElement) {
                this.videoElement.play();
                this.isPlaying = true;
                console.log('视频开始播放(HTML5)');
            }
        }

        // 暂停视频
        pauseVideo() {
            if (this.player && typeof this.player.pauseVideo === 'function') {
                this.player.pauseVideo();
                this.isPlaying = false;
                console.log('视频已暂停');
            } else if (this.videoElement) {
                this.videoElement.pause();
                this.isPlaying = false;
                console.log('视频已暂停(HTML5)');
            }
        }

        // 获取当前播放时间
        getCurrentTime() {
            if (this.player && typeof this.player.getCurrentTime === 'function') {
                return this.player.getCurrentTime();
            } else if (this.videoElement) {
                return this.videoElement.currentTime;
            }
            return 0;
        }

        // 获取视频状态
        getPlayerState() {
            if (this.player && typeof this.player.getPlayerState === 'function') {
                return this.player.getPlayerState();
            } else if (this.videoElement) {
                return this.videoElement.paused ? 2 : 1; // 1:播放中 2:暂停
            }
            return -1;
        }
    }

    // 主控制器
    class YouTubeTranslator {

        constructor() {
            // 加载配置
            window.CONFIG = ConfigManager.loadConfig();
            this.playerManager = PlayerManager.getInstance();
            this.subtitleManager = new SubtitleManager();
            this.translationManager = new TranslationManager();
            this.audioManager = new AudioManager();
            this.currentVideoId = this.getVideoId();
            this.player = this.playerManager.player;
            this.isPlaying = false;
            //console.log("播放器管理器: " ,this.playerManager.player)
            this.uiManager = null; // 添加 uiManager 属性
            // 上一条播放的字幕时间戳
            this.lastPlayedSubtitleTime = 0;

        }


            /**
         * @description: 处理配置更新
         * @param {string} key - 配置键
         * @param {any} value - 新的配置值
         */
        onConfigUpdate(key, value) {
            console.log('翻译器收到配置更新:', {
                配置项: key,
                新值: value
            });

            // 如果是模型相关的配置更新
            if (key.startsWith('AI_MODELS')) {
                // 更新翻译管理器的当前模型
                if (key === 'AI_MODELS.TYPE') {
                    this.translationManager.currentModel = value;
                    console.log('切换翻译模型:', {
                        新模型: value,
                        模型名称: CONFIG.AI_MODELS[value].MODEL,
                        流式响应: CONFIG.AI_MODELS[value].STREAM
                    });
                }
            }

            // 如果是TTS相关的配置更新
            if (key.startsWith('TTS')) {
                // 可以在这里添加TTS配置更新的处理逻辑
                console.log('TTS配置已更新');
            }
        }

        async generateSummary() {
            try {
                if (!this.subtitleManager.subtitles.length) {
                    throw new Error('没有可用的字幕');
                }
                return await this.translationManager.getSummary(this.subtitleManager.subtitles);
            } catch (error) {
                console.error('生成总结失败:', error);
                throw error;
            }
        }

        // 添加设置 UI 管理器的方法
        setUIManager(uiManager) {
            this.uiManager = uiManager;
        }

        startPeriodicCheck() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }

            this.checkInterval = setInterval(async () => {
                if (!this.isActive) {
                    clearInterval(this.checkInterval);
                    this.checkInterval = null;
                    return;
                }
                //console.log('检查播放状态...');

                try {
                    // 如果当前正在播放音频，跳过这次检查
                    if (this.isPlayingAudio) {
                        return;
                    }
                    const currentTime = this.player.getCurrentTime();
                    // 快3秒
                    // 获取当前时间并加3秒提前量
                    let checkTime = currentTime + 2;
                    //console.log('当前播放时间:', currentTime);
                    // 获取当前时间点的字幕
                    const currentSubtitle = this.subtitleManager.findSubtitleAtTime(checkTime);
                    // 如果当前时间点没有字幕，跳过
                    if (!currentSubtitle) return;

                    if(currentSubtitle.startTime <= this.lastPlayedSubtitleTime){
                        return;
                    }

                    // 检查是否已经播放过这个字幕
                    if (this.lastPlayedSubtitleTime === currentSubtitle.startTime) {
                        return;
                    }

                    // 生成缓存键
                    const cacheKey = this.audioManager.generateCacheKey(
                        currentSubtitle.startTime
                    );

                    // 更新UI显示最近的字幕
                    if (this.uiManager) {
                        this.uiManager.updateSubtitleDisplay(currentSubtitle);
                    }
                    this.lastPlayedSubtitleTime = currentSubtitle.startTime;

                    if (CONFIG.TTS.TYPE === 'BROWSER') {
                         // 设置播放状态
                        this.isPlayingAudio = true;
                      //  console.log('浏览器TTS模式',CONFIG.TTS.BROWSER.VOICE,currentSubtitle);

                        // 播放音频
                        try{
                        await this.audioManager.playAudio(currentSubtitle.translation);
                    } finally {
                        // 确保播放完成后重置状态
                        this.isPlayingAudio = false;
                    }
                    }else{

                        // 从缓存获取音频
                        const cachedAudio = await this.audioManager.loadFromIndexedDB(cacheKey);
                        if (cachedAudio) {
                        // 再次检查状态，防止在加载音频过程中状态发生变化
                        if (this.isPlayingAudio || !this.isActive) {
                            return;
                        }

                        console.log('找到缓存音频，准备播放:', {
                            时间点: currentSubtitle.startTime,
                            原文: currentSubtitle.text,
                            译文: currentSubtitle.translation
                        });
                            // 设置播放状态
                            this.isPlayingAudio = true;


                        try {
                            // 播放音频
                            await this.audioManager.playAudio(cachedAudio);
                            // 记录已播放的字幕时间戳
                            this.lastPlayedSubtitleTime = currentSubtitle.startTime;
                        } finally {
                            // 确保播放完成后重置状态
                            this.isPlayingAudio = false;
                        }
                    }
                }
                } catch (error) {
                    console.error('定期检查出错:', error);
                    this.isPlayingAudio = false;
                }
            }, 1000); // 每秒检查一次
        }


        // 在 startTranslator 方法中添加调用
        async startTranslator() {
            try {
                this.isActive = true;
                console.log('开始启动翻译器...');
                // 开始定时检查任务
                this.startPeriodicCheck();
                console.log('翻译器启动完成');
                this.uiManager.updateStatus('开始播放', 'success');
            } catch (error) {
                console.error('启动失败:', error);
                this.uiManager.updateStatus(`启动失败: ${error.message}`, 'error');
                this.isActive = false;
            }
        }

        // 在 stopTranslator 方法中添加清理
        stopTranslator() {
            console.log('停止翻译器...');
            this.isPlayingAudio = false; // 重置播放状态
            // 清除定时检查
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }


        // 添加翻译所有字幕的方法
        async translateAllSubtitles() {
            try {
                console.log('开始翻译所有字幕...');
                const subtitles = this.subtitleManager.subtitles;
                const newSubtitles = await this.translationManager.translateBatch(subtitles);
                console.log('所有字幕翻译完成,字幕数:', newSubtitles.length);
                // 开始预加载音频
                console.log('开始预加载音频...');
                await this.audioManager.preloadAudioBatch(newSubtitles);
                 // 更新字幕管理器中的字幕数组
                this.subtitleManager.subtitles = newSubtitles;

                console.log('所有字幕翻译和音频加载完成');
                return true;
            } catch (error) {
                console.error('翻译字幕失败:', error);
                throw error;
            }
        }


        async loadSubtitles() {
            if (!this.currentVideoId) {
                throw new Error('未找到视频ID');
            }

            try {
                const hasSubtitles = await this.subtitleManager.loadSubtitles(this.currentVideoId);
                if (!hasSubtitles) {
                    throw new Error('未找到字幕');
                }
                return true;
            } catch (error) {
                console.error('加载字幕失败:', error);
                throw error;
            }
        }

        getVideoId() {
            try {
                // 检查是否在YouTube账户页面
                if (window.location.href.includes('accounts.youtube.com')) {
                    return null;
                }

                // 方法1: 从URL获取
                const url = window.location.href;
                console.log("当前页面URL:", url);

                if (url.includes('youtube.com')) {
                    // 标准观看页面
                    if (url.includes('/watch')) {
                        const urlParams = new URLSearchParams(window.location.search);
                        const videoId = urlParams.get('v');
                        if (videoId) {
                            console.log("从URL参数获取到视频ID:", videoId);
                            return videoId;
                        }
                    }

                    // 短视频格式
                    if (url.includes('/shorts/')) {
                        const matches = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
                        if (matches && matches[1]) {
                            console.log("从shorts URL获取到视频ID:", matches[1]);
                            return matches[1];
                        }
                    }
                }

                // 方法2: 从视频元素获取
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    // 从视频源获取
                    const videoSrc = videoElement.src;
                    if (videoSrc) {
                        const videoIdMatch = videoSrc.match(/\/([a-zA-Z0-9_-]{11})/);
                        if (videoIdMatch && videoIdMatch[1]) {
                            console.log("从视频源获取到视频ID:", videoIdMatch[1]);
                            return videoIdMatch[1];
                        }
                    }

                    // 从播放器容器获取
                    const playerContainer = document.getElementById('movie_player') ||
                                         document.querySelector('.html5-video-player');
                    if (playerContainer) {
                        const dataVideoId = playerContainer.getAttribute('video-id') ||
                                          playerContainer.getAttribute('data-video-id');
                        if (dataVideoId) {
                            console.log("从播放器容器获取到视频ID:", dataVideoId);
                            return dataVideoId;
                        }
                    }
                }

                // 方法3: 从页面元数据获取
                const ytdPlayerConfig = document.querySelector('ytd-player');
                if (ytdPlayerConfig) {
                    const videoData = ytdPlayerConfig.getAttribute('video-id');
                    if (videoData) {
                        console.log("从ytd-player获取到视频ID:", videoData);
                        return videoData;
                    }
                }

                // 方法4: 从页面脚本数据获取
                const scripts = document.getElementsByTagName('script');
                for (const script of scripts) {
                    const content = script.textContent;
                    if (content && content.includes('"videoId"')) {
                        const match = content.match(/"videoId":\s*"([a-zA-Z0-9_-]{11})"/);
                        if (match && match[1]) {
                            console.log("从页面脚本获取到视频ID:", match[1]);
                            return match[1];
                        }
                    }
                }

                // 如果所有方法都失败，等待页面加载完成后重试
                if (document.readyState !== 'complete') {
                    console.log("页面未完全加载，返回null");
                    return null;
                }

                throw new Error('未在当前页面找到有效的YouTube视频');
            } catch (error) {
                console.error('获取视频ID失败:', error);
                return null;
            }
        }
    }

    // 添加播放器管理类（单例模式）
    class PlayerManager {
        constructor() {
            // 如果已经存在实例，直接返回
            if (PlayerManager.instance) {
                return PlayerManager.instance;
            }

            this._player = null;
            this._videoElement = null;
            this._initialized = false;
            PlayerManager.instance = this;
        }

        // 获取实例的静态方法
        static getInstance() {
            if (!PlayerManager.instance) {
                PlayerManager.instance = new PlayerManager();
            }
            return PlayerManager.instance;
        }

        // 初始化播放器
        async initialize() {
            if (this._initialized) {
                return this._player;
            }

            try {
                await this.waitForYouTubePlayer();
                this._initialized = true;
                console.log('播放器管理器初始化成功');
                return this._player;
            } catch (error) {
                console.error('播放器管理器初始化失败:', error);
                throw error;
            }
        }

        // 等待YouTube播放器加载
        async waitForYouTubePlayer() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 20;
                const interval = setInterval(() => {
                    const player = document.querySelector('#movie_player');
                    const videoElement = document.querySelector('video');

                    if (player && typeof player.getCurrentTime === 'function') {
                        clearInterval(interval);
                        this._player = player;
                        this._videoElement = videoElement;
                        console.log('成功获取YouTube播放器');
                        resolve(player);
                    } else if (++attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error('无法获取YouTube播放器'));
                    }
                }, 500);
            });
        }

        // 获取播放器实例
        get player() {
            return this._player;
        }

        // 获取video元素
        get videoElement() {
            return this._videoElement;
        }

        // 检查播放器是否已初始化
        get isInitialized() {
            return this._initialized;
        }
    }


    // 字幕条目类
    class SubtitleEntry {
        constructor(text, startTime, duration) {
            this.text = text;
            this.startTime = startTime;
            this.duration = duration;
            this.translation = null;
            this.audioBuffer = null;
        }
    }

    // 字幕管理器类
    class SubtitleManager {
        constructor() {
            this.subtitles = [];
            this.currentIndex = 0;
        }

        /**
         * @description: 加载字幕。
         * @param {string} videoId - 视频 ID。
         * @return {Promise<boolean>} - 是否成功加载字幕。
         * @throws {Error} - 加载字幕失败时抛出异常。
         */
        async loadSubtitles(videoId) {
            try {
                // 获取页面HTML内容
                const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
                const html = await response.text();

                // 使用正则表达式匹配字幕URL
                const timedTextMatch = html.match(/https:\/\/www\.youtube\.com\/api\/timedtext\?[^"]+/);
                if (!timedTextMatch) {
                    throw new Error('未找到字幕URL');
                }

                // 构建字幕URL
                const url = new URL(timedTextMatch[0].replace(/\\u0026/g, '&'));
                url.searchParams.set('lang', 'en'); // 设置为英文字幕
                const subtitleUrl = url.toString();

                console.log('获取字幕:', subtitleUrl);
                const subtitleResponse = await fetch(subtitleUrl);
                const subtitleXML = await subtitleResponse.text();
               // console.log('字幕XML:', subtitleXML); // 添加日志输出

                // 解析字幕
                const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
                this.subtitles = [];
                let match;

                while ((match = textRegex.exec(subtitleXML)) !== null) {
                    const text = match[1]
                        .replace(/&quot;/g, '"')
                        .replace(/&apos;/g, "'")
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&#39;/g, "'")
                        .replace(/&#34;/g, '"')
                        .replace(/\n/g, ' ')
                        .trim();

                    if (text) {  // 只添加非空文本
                        // 获取开始时间和持续时间
                        const startMatch = match[0].match(/start="([^"]+)"/);
                        const durMatch = match[0].match(/dur="([^"]+)"/);

                        const startTime = startMatch ? parseFloat(startMatch[1]) : 0;
                        const duration = durMatch ? parseFloat(durMatch[1]) : 0;

                        this.subtitles.push(new SubtitleEntry(text, startTime, duration));
                    }
                }
                // 解析完字幕后进行排序
                this.subtitles.sort((a, b) => a.startTime - b.startTime);
                console.log(`成功加载 ${this.subtitles.length} 条字幕`);
                return this.subtitles.length > 0;
            } catch (error) {
                console.error('获取字幕时出错:', error);
                throw error;
            }
        }

        /**
         * @description: 获取指定时间范围内的字幕。
         * @param {number} startTime - 开始时间。
         * @param {number} endTime - 结束时间。
         * @return {Array<SubtitleEntry>} - 指定时间范围内的字幕数组。
         */
        getSubtitlesInRange(startTime, endTime) {
            return this.subtitles.filter(sub =>
                sub.startTime >= startTime && sub.startTime <= endTime
            );
        }

        /**
         * @description: 查找指定时间点对应的字幕。
         * @param {number} time - 时间点。
         * @return {SubtitleEntry|null} - 找到的字幕，如果未找到则返回 null。
         */
        findSubtitleAtTime(time) {
            try {
                // 获取所有字幕的时间点
                const timePoints = this.subtitles.map(sub => ({
                    time: sub.startTime,
                    subtitle: sub
                }));

                // 按时间排序
                timePoints.sort((a, b) => a.time - b.time);

                // 找到小于等于当前时间的最后一条字幕
                let targetSubtitle = null;
                for (let i = timePoints.length - 1; i >= 0; i--) {
                    if (timePoints[i].time <= time) {
                        targetSubtitle = timePoints[i].subtitle;
                        break;
                    }
                }

                if (targetSubtitle) {
                    // console.log('找到目标字幕:', {
                    //     当前时间: time,
                    //     字幕: {
                    //         文本: targetSubtitle.text,
                    //         开始时间: targetSubtitle.startTime,
                    //         持续时间: targetSubtitle.duration
                    //     }
                    // });
                    return targetSubtitle;
                }

                // 如果没有找到小于等于当前时间的字幕，返回第一条字幕
                if (timePoints.length > 0 && time < timePoints[0].time) {
                    const firstSubtitle = timePoints[0].subtitle;
                    console.log('返回第一条字幕:', {
                        当前时间: time,
                        字幕: {
                            文本: firstSubtitle.text,
                            开始时间: firstSubtitle.startTime,
                            持续时间: firstSubtitle.duration
                        }
                    });
                    return firstSubtitle;
                }

                console.log('未找到合适的字幕:', {
                    当前时间: time,
                    字幕总数: this.subtitles.length
                });
                return null;

            } catch (error) {
                console.error('查找字幕时出错:', error);
                return null;
            }
        }

    }








    // UI管理器
    class UIManager {
        constructor(videoController,translator) {
            this.container = null;
            this.statusDisplay = null;
            this.startButton = null;
            this.pauseButton = null;
            this.loadSubtitlesButton = null;

            this.isCollapsed = false;
            this.videoController = videoController;
            this.translator = translator;
            this.lastDisplayedSubtitleId = null; // 添加追踪变量
            this.createConfigPanel();
            this.createUI();

            this.attachEventListeners();

        }




        createUI() {
            // 创建主容器
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 390px;
                background: rgba(33, 33, 33, 0.9);
                border-radius: 8px;
                padding: 15px;
                color: #fff;
                font-family: Arial, sans-serif;
                z-index: 9999;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            `;

            // 创建顶部栏
            const topBar = this.createTopBar();
            this.container.appendChild(topBar);

            // 创建主内容容器
            this.mainContent = document.createElement('div');
            this.mainContent.style.cssText = `
                transition: all 0.3s ease;
            `;

            // 创建控制按钮
            const controls = this.createControls();
            this.mainContent.appendChild(controls);

            // 创建状态显示区域
            this.createStatusDisplay();
            this.mainContent.appendChild(this.statusDisplay);

            // 创建TTS面板
            this.createTTSPanel();

            // 创建并添加总结面板
            this.createSummaryPanel();

            this.container.appendChild(this.mainContent);
            document.body.appendChild(this.container);

            // 创建配置面板
            this.createConfigPanel();

            // 使面板可拖动
            this.makeDraggable(topBar);
        }


        createTTSPanel() {
            const ttsPanel = document.createElement('div');
            ttsPanel.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: rgba(33, 150, 243, 0.1);
                border-radius: 8px;
                border-left: 4px solid #2196F3;
            `;

            // TTS类型选择
            const typeContainer = document.createElement('div');
            typeContainer.style.cssText = `
                margin-bottom: 12px;
                display: flex;
                align-items: center;
            `;

            const typeLabel = document.createElement('label');
            typeLabel.textContent = 'TTS引擎: ';
            typeLabel.style.cssText = `
                color: #fff;
                margin-right: 10px;
                font-size: 14px;
                font-weight: 500;
            `;

            const typeSelect = document.createElement('select');
            typeSelect.style.cssText = `
                padding: 8px 12px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                border: 1px solid rgba(33, 150, 243, 0.3);
                font-size: 14px;
                cursor: pointer;
                outline: none;
                transition: all 0.3s ease;
            `;

            ['BROWSER'].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                if (CONFIG.TTS.TYPE === type) {
                    option.selected = true;
                }
                typeSelect.appendChild(option);
            });

            // 声音选择
            const voiceContainer = document.createElement('div');
            voiceContainer.style.cssText = `
                margin-top: 12px;
                display: flex;
                align-items: center;
            `;

            const voiceLabel = document.createElement('label');
            voiceLabel.textContent = '声音: ';
            voiceLabel.style.cssText = `
                color: #fff;
                margin-right: 10px;
                font-size: 14px;
                font-weight: 500;
            `;

            const voiceSelect = document.createElement('select');
            voiceSelect.style.cssText = `
                padding: 8px 12px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                border: 1px solid rgba(33, 150, 243, 0.3);
                font-size: 14px;
                cursor: pointer;
                outline: none;
                transition: all 0.3s ease;
                width: 200px;
            `;

            // 更新声音选项的函数
            const updateVoiceOptions = () => {
                // 清空现有选项
                while (voiceSelect.firstChild) {
                    voiceSelect.removeChild(voiceSelect.firstChild);
                }

                if (typeSelect.value === 'EDGE') {
                    Object.entries(CONFIG.TTS.EDGE.VOICES).forEach(([id, name]) => {
                        const option = document.createElement('option');
                        option.value = id;
                        option.textContent = name;
                        if (id === CONFIG.TTS.EDGE.DEFAULT_VOICE) {
                            option.selected = true;
                        }
                        voiceSelect.appendChild(option);
                    });
                }

                if (CONFIG.TTS.TYPE === 'VITS') {
                    const option = document.createElement('option');
                    option.value = CONFIG.TTS.VITS.DEFAULT_VOICE;
                    option.textContent = '珊瑚宫心海';
                    option.selected = true;
                    voiceSelect.appendChild(option);
                }
                if (CONFIG.TTS.TYPE === 'BROWSER') {
                    // 浏览器 TTS 模式下获取系统语音列表
                    const populateVoiceList = () => {
                        const voices = speechSynthesis.getVoices();
                        // 过滤只包含 Chinese 的语音
                        const chineseVoices = voices.filter(voice =>
                            voice.lang.toLowerCase().includes('zh-cn')
                        );

                        if (chineseVoices.length === 0) {
                            // 如果没有找到中文语音，添加提示选项
                            const option = document.createElement('option');
                            option.textContent = '未找到中文语音';
                            option.disabled = true;
                            voiceSelect.appendChild(option);
                        } else {
                            chineseVoices.forEach(voice => {
                                const option = document.createElement('option');
                                option.textContent = `${voice.name} (${voice.lang})`;
                                if (voice.default) {
                                    option.textContent += ' — DEFAULT';
                                }
                                option.setAttribute('data-lang', voice.lang);
                                option.setAttribute('data-name', voice.name);
                                voiceSelect.appendChild(option);
                            });

                            // 如果有已保存的语音设置，选中对应选项
                            if (CONFIG.TTS.BROWSER.VOICE) {
                                const savedVoice = Array.from(voiceSelect.options).find(option =>
                                    option.getAttribute('data-name') === CONFIG.TTS.BROWSER.VOICE.name &&
                                    option.getAttribute('data-lang') === CONFIG.TTS.BROWSER.VOICE.lang
                                );
                                if (savedVoice) {
                                    savedVoice.selected = true;
                                }
                            }
                        }

                        // 调试输出
                        console.log('可用的中文语音:', chineseVoices.map(v => ({
                            name: v.name,
                            lang: v.lang,
                            default: v.default
                        })));
                    };

                    // 初始填充语音列表
                    populateVoiceList();

                    // 监听语音列表变化
                    if (typeof speechSynthesis !== 'undefined' &&
                        speechSynthesis.onvoiceschanged !== undefined) {
                        speechSynthesis.onvoiceschanged = populateVoiceList;
                    }

                }
            };

            // 初始化声音选项
            updateVoiceOptions();

            // 添加事件监听器
            typeSelect.addEventListener('change', () => {
                CONFIG.TTS.TYPE = typeSelect.value;
                updateVoiceOptions();
            });

            voiceSelect.addEventListener('change', (e) => {
                const selectedOption = e.target.selectedOptions[0];
                if (typeSelect.value === 'BROWSER') {
                    // 保存选中的浏览器语音信息
                    CONFIG.TTS.BROWSER.VOICE = {
                        name: selectedOption.getAttribute('data-name'),
                        lang: selectedOption.getAttribute('data-lang')
                    };
                } else if (typeSelect.value === 'EDGE') {
                    CONFIG.TTS.EDGE.DEFAULT_VOICE = selectedOption.value;
                } else {
                    CONFIG.TTS.VITS.DEFAULT_VOICE = selectedOption.value;
                }
            });

            // 组装面板
            typeContainer.appendChild(typeLabel);
            typeContainer.appendChild(typeSelect);
            voiceContainer.appendChild(voiceLabel);
            voiceContainer.appendChild(voiceSelect);

            ttsPanel.appendChild(typeContainer);
            ttsPanel.appendChild(voiceContainer);

            // 添加到主内容区域
            if (this.mainContent) {
                this.mainContent.appendChild(ttsPanel);
            }

            // 创建 AI 模型选择面板（移到这里，只创建一次）
        //    this.createAIModelPanel();
        }

        // 分离 AI 模型面板创建为独立方法
        createAIModelPanel() {
            const aiModelPanel = document.createElement('div');
            aiModelPanel.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: rgba(33, 150, 243, 0.1);
                border-radius: 8px;
                border-left: 4px solid #2196F3;
            `;

            const modelContainer = document.createElement('div');
            modelContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            `;

            const modelLabel = document.createElement('label');
            modelLabel.textContent = 'AI 模型: ';
            modelLabel.style.cssText = `
                color: #fff;
                margin-right: 10px;
                font-size: 14px;
                font-weight: 500;
            `;

            const modelSelect = document.createElement('select');
            modelSelect.style.cssText = `
                padding: 8px 12px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                border: 1px solid rgba(33, 150, 243, 0.3);
                font-size: 14px;
                cursor: pointer;
                outline: none;
                transition: all 0.3s ease;
                width: 200px;
            `;

            // 添加可用的 AI 模型选项
            Object.keys(CONFIG.AI_MODELS).forEach(model => {
                if (model !== 'TYPE') {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = `${model} (${CONFIG.AI_MODELS[model].MODEL})`;
                    if (CONFIG.AI_MODELS.TYPE === model) {
                        option.selected = true;
                    }
                    modelSelect.appendChild(option);
                }
            });

            // 添加事件监听器
            modelSelect.addEventListener('change', () => {
                CONFIG.AI_MODELS.TYPE = modelSelect.value;
                this.translator.translationManager.currentModel = modelSelect.value;
                this.updateStatus(`已切换至 ${modelSelect.value} 模型`, 'info');
            });

            // 添加悬停效果
            modelSelect.addEventListener('mouseover', () => {
                modelSelect.style.borderColor = 'rgba(33, 150, 243, 0.6)';
                modelSelect.style.boxShadow = '0 0 5px rgba(33, 150, 243, 0.3)';
            });

            modelSelect.addEventListener('mouseout', () => {
                modelSelect.style.borderColor = 'rgba(33, 150, 243, 0.3)';
                modelSelect.style.boxShadow = 'none';
            });

            modelContainer.appendChild(modelLabel);
            modelContainer.appendChild(modelSelect);
            aiModelPanel.appendChild(modelContainer);

            // 添加到主内容区域
            if (this.mainContent) {
                this.mainContent.appendChild(aiModelPanel);
            }
        }

        createTopBar() {
            const topBar = document.createElement('div');
            topBar.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                cursor: move;
                padding: 5px;
            `;

            // 标题
            const title = document.createElement('div');
            title.textContent = 'YouTube 实时翻译';
            title.style.cssText = `
                font-weight: bold;
                font-size: 14px;
            `;

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 8px;
            `;

            // 折叠按钮
            this.toggleButton = document.createElement('button');
            this.toggleButton.textContent = '↑';
            this.toggleButton.style.cssText = `
                background: none;
                border: none;
                color: #fff;
                cursor: pointer;
                padding: 2px 6px;
                font-size: 14px;
                border-radius: 4px;
                transition: background 0.2s;
            `;

            // 添加配置按钮
            const configButton = document.createElement('button');
            configButton.textContent = '⚙️';
            configButton.style.cssText = `
                background: none;
                border: none;
                color: #fff;
                cursor: pointer;
                padding: 2px 6px;
                font-size: 14px;
                border-radius: 4px;
                transition: background 0.2s;
                margin-right: 8px;
            `;

            configButton.addEventListener('click', () => this.toggleConfigPanel());

            this.toggleButton.addEventListener('click', () => this.toggleCollapse());

            buttonContainer.appendChild(configButton);
            buttonContainer.appendChild(this.toggleButton);
            topBar.appendChild(title);
            topBar.appendChild(buttonContainer);

            return topBar;
        }


        createConfigPanel() {
            this.configPanel = document.createElement('div');
            this.configPanel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                background: rgba(33, 33, 33, 0.95);
                border-radius: 12px;
                padding: 20px;
                color: #fff;
                display: none;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            `;

            // 添加标题和关闭按钮
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;

            const title = document.createElement('h3');
            title.textContent = '配置设置';
            title.style.margin = '0';

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                padding: 0 5px;
            `;
            closeButton.addEventListener('click', () => this.toggleConfigPanel());

            header.appendChild(title);
            header.appendChild(closeButton);
            this.configPanel.appendChild(header);

            // 创建配置选项
            const configSections = [
                {
                    title: 'AI 模型设置',
                    settings: [
                        {
                            type: 'select',
                            label: '模型类型',
                            key: 'AI_MODELS.TYPE',
                            options: ['OPENAI'],
                            value: CONFIG.AI_MODELS.TYPE
                        },
                        {
                            type: 'text',
                            label: 'API密钥',
                            key: 'AI_MODELS.OPENAI.API_KEY',
                            value: CONFIG.AI_MODELS.OPENAI.API_KEY
                        },
                        {
                            type: 'text',
                            label: 'API地址',
                            key: 'AI_MODELS.OPENAI.API_URL',
                            value: CONFIG.AI_MODELS.OPENAI.API_URL
                        },
                        {
                            type: 'text',
                            label: '模型名称',
                            key: 'AI_MODELS.OPENAI.MODEL',
                            value: CONFIG.AI_MODELS.OPENAI.MODEL
                        },
                        {
                            type: 'select',
                            label: '流式响应',
                            key: 'AI_MODELS.OPENAI.STREAM',
                            options: ['true', 'false'],
                            value: CONFIG.AI_MODELS.OPENAI.STREAM.toString()
                        }
                    ]
                }
                // {
                //     title: 'TTS 设置',
                //     settings: [
                //         {
                //             type: 'select',
                //             label: 'TTS引擎',
                //             key: 'TTS.TYPE',
                //             options: ['EDGE', 'VITS', 'BROWSER'],
                //             value: CONFIG.TTS.TYPE
                //         },
                //         {
                //             type: 'select',
                //             label: 'EDGE声音',
                //             key: 'TTS.EDGE.DEFAULT_VOICE',
                //             options: Object.keys(CONFIG.TTS.EDGE.VOICES),
                //             value: CONFIG.TTS.EDGE.DEFAULT_VOICE,
                //             dependsOn: {
                //                 key: 'TTS.TYPE',
                //                 value: 'EDGE'
                //             }
                //         },
                //         {
                //             type: 'select',
                //             label: 'VITS声音',
                //             key: 'TTS.VITS.DEFAULT_VOICE',
                //             options: ['珊瑚宫心海'], // 可以根据实际声音列表扩展
                //             value: CONFIG.TTS.VITS.DEFAULT_VOICE,
                //             dependsOn: {
                //                 key: 'TTS.TYPE',
                //                 value: 'VITS'
                //             }
                //         },
                //         {
                //             type: 'range',
                //             label: '语速',
                //             key: 'TTS.BROWSER.RATE',
                //             min: 0.5,
                //             max: 2,
                //             step: 0.1,
                //             value: CONFIG.TTS.BROWSER.RATE,
                //             dependsOn: {
                //                 key: 'TTS.TYPE',
                //                 value: 'BROWSER'
                //             }
                //         },
                //         {
                //             type: 'range',
                //             label: '音量',
                //             key: 'TTS.BROWSER.VOLUME',
                //             min: 0,
                //             max: 1,
                //             step: 0.1,
                //             value: CONFIG.TTS.BROWSER.VOLUME,
                //             dependsOn: {
                //                 key: 'TTS.TYPE',
                //                 value: 'BROWSER'
                //             }
                //         },
                //         {
                //             type: 'range',
                //             label: '音调',
                //             key: 'TTS.BROWSER.PITCH',
                //             min: 0.5,
                //             max: 2,
                //             step: 0.1,
                //             value: CONFIG.TTS.BROWSER.PITCH,
                //             dependsOn: {
                //                 key: 'TTS.TYPE',
                //                 value: 'BROWSER'
                //             }
                //         }
                //     ]
                // },
                // {
                //     title: '缓存设置',
                //     settings: [
                //         {
                //             type: 'number',
                //             label: '音频缓存大小',
                //             key: 'CACHE.AUDIO_SIZE',
                //             min: 100,
                //             max: 1000,
                //             value: CONFIG.CACHE.AUDIO_SIZE
                //         },
                //         {
                //             type: 'number',
                //             label: '翻译缓存大小',
                //             key: 'CACHE.TRANS_SIZE',
                //             min: 100,
                //             max: 1000,
                //             value: CONFIG.CACHE.TRANS_SIZE
                //         }
                //     ]
                // }
            ];

            configSections.forEach(section => {
                const sectionEl = this.createConfigSection(section);
                this.configPanel.appendChild(sectionEl);
            });

            document.body.appendChild(this.configPanel);
        }


        // 在 updateConfig 方法中添加模型切换的处理
        updateConfig(key, value) {
            // 将点分隔的键转换为嵌套对象访问
            const keys = key.split('.');
            let current = CONFIG;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            // 特殊处理布尔值
            if (value === 'true') value = true;
            if (value === 'false') value = false;

            current[keys[keys.length - 1]] = value;
            // 触发配置更新事件
            document.dispatchEvent(new CustomEvent('configUpdate', {
                detail: { key, value }
            }));

            // 保存配置
            ConfigManager.saveConfig(CONFIG);

            // 打印模型相关的配置变更
            if (key.startsWith('AI_MODELS')) {
                console.log('AI模型配置已更新:', {
                    配置项: key,
                    新值: value,
                    当前模型类型: CONFIG.AI_MODELS.TYPE,
                    模型名称: CONFIG.AI_MODELS[CONFIG.AI_MODELS.TYPE].MODEL,
                    流式响应: CONFIG.AI_MODELS[CONFIG.AI_MODELS.TYPE].STREAM
                });
            }

            // 通知更新 - 添加错误处理
            if (this.translator && typeof this.translator.onConfigUpdate === 'function') {
                this.translator.onConfigUpdate(key, value);
            } else {
                console.warn('翻译器未初始化或不支持配置更新');
            }
        }


        createConfigSection(section) {
            const sectionEl = document.createElement('div');
            sectionEl.style.marginBottom = '20px';

            const title = document.createElement('h4');
            title.textContent = section.title;
            title.style.marginBottom = '10px';
            sectionEl.appendChild(title);

            section.settings.forEach(setting => {
                const settingEl = this.createConfigSetting(setting);
                sectionEl.appendChild(settingEl);
            });

            return sectionEl;
        }

        createConfigSetting(setting) {
            const container = document.createElement('div');
            container.style.cssText = `
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = `
                width: 120px;
                color: #fff;
                font-size: 14px;
            `;

            // 添加依赖关系处理
            if (setting.dependsOn) {
                const updateVisibility = () => {
                    const dependencyValue = this.getConfigValue(setting.dependsOn.key);
                    container.style.display = dependencyValue === setting.dependsOn.value ? 'flex' : 'none';
                };

                // 监听依赖项的变化
                document.addEventListener('configUpdate', (e) => {
                    if (e.detail.key === setting.dependsOn.key) {
                        updateVisibility();
                    }
                });

                // 初始化可见性
                updateVisibility();
            }

            let input;
            switch (setting.type) {
                case 'select':
                    input = document.createElement('select');
                    setting.options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        opt.selected = option === setting.value;
                        // 设置选项样式
                        opt.style.cssText = `
                            background: #2f2f2f;
                            color: #fff;
                            padding: 8px;
                        `;
                        input.appendChild(opt);
                    });
                    // 为select元素添加特殊样式
                    input.style.cssText = `
                        padding: 8px 12px;
                        border-radius: 4px;
                        background: #2f2f2f;
                        color: #fff;
                        border: 1px solid #4CAF50;
                        font-size: 14px;
                        cursor: pointer;
                        outline: none;
                        width: 200px;
                        transition: all 0.3s ease;
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                        background-repeat: no-repeat;
                        background-position: right 8px center;
                        background-size: 16px;
                        padding-right: 32px;
                    `;
                    break;

                case 'text':
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = setting.value;
                    input.style.cssText = `
                        padding: 8px 12px;
                        border-radius: 4px;
                        background: #2f2f2f;
                        color: #fff;
                        border: 1px solid #4CAF50;
                        font-size: 14px;
                        width: 200px;
                        outline: none;
                        transition: all 0.3s ease;
                    `;
                    break;

                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.min = setting.min;
                    input.max = setting.max;
                    input.value = setting.value;
                    input.style.cssText = `
                        padding: 8px 12px;
                        border-radius: 4px;
                        background: #2f2f2f;
                        color: #fff;
                        border: 1px solid #4CAF50;
                        font-size: 14px;
                        width: 200px;
                        outline: none;
                        transition: all 0.3s ease;
                    `;
                    break;

                case 'range':
                    input = document.createElement('input');
                    input.type = 'range';
                    input.min = setting.min;
                    input.max = setting.max;
                    input.step = setting.step;
                    input.value = setting.value;
                    input.style.cssText = `
                        width: 200px;
                        height: 4px;
                        border-radius: 2px;
                        background: #4CAF50;
                        outline: none;
                        opacity: 0.7;
                        transition: all 0.3s ease;
                        -webkit-appearance: none;
                    `;
                    break;
            }

            // 添加悬停效果
            if (setting.type !== 'range') {
                input.addEventListener('mouseover', () => {
                    input.style.borderColor = '#66BB6A';
                    input.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)';
                });

                input.addEventListener('mouseout', () => {
                    input.style.borderColor = '#4CAF50';
                    input.style.boxShadow = 'none';
                });

                input.addEventListener('focus', () => {
                    input.style.borderColor = '#66BB6A';
                    input.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)';
                });

                input.addEventListener('blur', () => {
                    input.style.borderColor = '#4CAF50';
                    input.style.boxShadow = 'none';
                });
            }

            // 为range类型添加特殊样式
            if (setting.type === 'range') {
                input.addEventListener('mouseover', () => {
                    input.style.opacity = '1';
                });

                input.addEventListener('mouseout', () => {
                    input.style.opacity = '0.7';
                });

                // 添加滑块样式
                const styleSheet = document.createElement('style');
                styleSheet.textContent = `
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #fff;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    input[type=range]::-webkit-slider-thumb:hover {
                        background: #e0e0e0;
                        transform: scale(1.1);
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            input.addEventListener('change', (e) => {
                let value = e.target.value;
                if (setting.type === 'number' || setting.type === 'range') {
                    value = parseFloat(value);
                }
                this.updateConfig(setting.key, value);
            });

            container.appendChild(label);
            container.appendChild(input);

            return container;
        }

        toggleConfigPanel() {
            if (!this.configPanel) {
                this.createConfigPanel();
            }
            const isVisible = this.configPanel.style.display === 'block';
            this.configPanel.style.display = isVisible ? 'none' : 'block';
        }


        // 添加获取配置值的辅助方法
        getConfigValue(key) {
            const keys = key.split('.');
            let value = CONFIG;
            for (const k of keys) {
                value = value[k];
            }
            return value;
        }
        createControls() {
            const controls = document.createElement('div');
            controls.style.cssText = `
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            `;

            // 加载字幕按钮
            this.loadSubtitlesButton = this.createButton('加载字幕', '#2196F3');

            // 开始按钮
            this.startButton = this.createButton('开始播放', '#4CAF50');
            this.startButton.disabled = true;
            this.startButton.style.opacity = '0.5';
            this.startButton.style.cursor = 'not-allowed';

            // 暂停按钮
            this.pauseButton = this.createButton('停止播放', '#FF5722');
            this.pauseButton.style.display = 'block';

            // 新增总结按钮
            this.summaryButton = this.createButton('生成总结', '#9C27B0');
            this.summaryButton.style.display = 'block';  // 添加这一行


            controls.appendChild(this.loadSubtitlesButton);
            controls.appendChild(this.startButton);
            controls.appendChild(this.pauseButton);
            controls.appendChild(this.summaryButton);
            return controls;
        }


        createSummaryPanel() {
            this.summaryPanel = document.createElement('div');
            this.summaryPanel.style.cssText = `
                margin-top: 15px;
                padding: 15px;
                background: rgba(156, 39, 176, 0.1);
                border-radius: 8px;
                border-left: 4px solid #9C27B0;
                display: none;
                transition: all 0.3s ease;
            `;

            const title = document.createElement('div');
            title.textContent = '视频内容总结';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #9C27B0;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            // 添加复制按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.style.cssText = `
                background: #9C27B0;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;

            copyButton.addEventListener('mouseover', () => {
                copyButton.style.background = '#7B1FA2';
            });

            copyButton.addEventListener('mouseout', () => {
                copyButton.style.background = '#9C27B0';
            });

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(this.summaryContent.textContent)
                    .then(() => {
                        copyButton.textContent = '已复制';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 2000);
                    })
                    .catch(err => console.error('复制失败:', err));
            });

            title.appendChild(copyButton);

            this.summaryContent = document.createElement('div');
            this.summaryContent.style.cssText = `
                font-size: 14px;
                line-height: 1.6;
                color: #fff;
                white-space: pre-wrap;
                margin-top: 10px;
                max-height: 400px;
                overflow-y: auto;
                padding-right: 10px;
            `;

            // 添加滚动条样式
            this.summaryContent.style.cssText += `
                scrollbar-width: thin;
                scrollbar-color: #9C27B0 rgba(156, 39, 176, 0.1);
            `;

            this.summaryPanel.appendChild(title);
            this.summaryPanel.appendChild(this.summaryContent);
            this.mainContent.appendChild(this.summaryPanel);
        }


        // 添加字幕显示方法
        updateSubtitleDisplay(subtitle) {

                // 生成字幕唯一ID (使用时间戳和文本组合)
            const subtitleId = `${subtitle.startTime}-${subtitle.text}`;

            // 检查是否已经显示过这条字幕
            if (this.lastDisplayedSubtitleId === subtitleId) {
                return; // 如果是相同字幕，直接返回
            }

            const entry = document.createElement('div');
            entry.style.cssText = `
                margin: 10px 0;
                padding: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
                transition: all 0.3s ease;
            `;

            // 添加鼠标悬停效果
            entry.addEventListener('mouseover', () => {
                entry.style.background = 'rgba(255, 255, 255, 0.15)';
                entry.style.transform = 'translateX(5px)';
            });

            entry.addEventListener('mouseout', () => {
                entry.style.background = 'rgba(255, 255, 255, 0.1)';
                entry.style.transform = 'translateX(0)';
            });

            // 显示时间信息
            const timeInfo = document.createElement('div');
            timeInfo.style.cssText = `
                color: #888;
                font-size: 11px;
                margin-bottom: 8px;
                font-family: monospace;
            `;
            timeInfo.textContent = `⏱ ${subtitle.startTime.toFixed(2)}s - ${(subtitle.startTime + subtitle.duration).toFixed(2)}s`;
            entry.appendChild(timeInfo);

            // 显示原文
            const originalText = document.createElement('div');
            originalText.style.cssText = `
                color: #bbb;
                margin: 6px 0;
                font-size: 13px;
                line-height: 1.4;
                padding-left: 20px;
                position: relative;
            `;

            // 创建图标元素
            const originalIcon = document.createElement('span');
            originalIcon.style.cssText = `
                position: absolute;
                left: 0;
            `;
            originalIcon.textContent = '💢';

            // 创建文本元素
            const originalTextContent = document.createElement('span');
            originalTextContent.textContent = subtitle.text;

            originalText.appendChild(originalIcon);
            originalText.appendChild(originalTextContent);
            entry.appendChild(originalText);

            // 显示译文
            if (subtitle.translation) {
                const translatedText = document.createElement('div');
                translatedText.style.cssText = `
                    color: #fff;
                    margin: 6px 0;
                    font-size: 14px;
                    line-height: 1.4;
                    font-weight: 500;
                    padding-left: 20px;
                    position: relative;
                `;

                // 创建译文图标元素
                const translatedIcon = document.createElement('span');
                translatedIcon.style.cssText = `
                    position: absolute;
                    left: 0;
                `;
                translatedIcon.textContent = '🤖';

                // 创建译文文本元素
                const translatedTextContent = document.createElement('span');
                translatedTextContent.textContent = subtitle.translation;

                translatedText.appendChild(translatedIcon);
                translatedText.appendChild(translatedTextContent);
                entry.appendChild(translatedText);
            }

                // 更新最后显示的字幕ID
           this.lastDisplayedSubtitleId = subtitleId;
            this.statusDisplay.appendChild(entry);
            this.statusDisplay.scrollTop = this.statusDisplay.scrollHeight;
        }

        // 添加事件监听器
        attachEventListeners() {
            // 加载字幕按钮事件
            this.loadSubtitlesButton.addEventListener('click', async () => {
                this.loadSubtitlesButton.disabled = true;
                this.loadSubtitlesButton.textContent = '正在加载字幕...';

                try {
                    // 加载字幕
                    await this.translator.loadSubtitles();
                    this.updateStatus(`已加载 ${this.translator.subtitleManager.subtitles.length} 条字幕`, 'success');

                    // 开始翻译
                    this.updateStatus('正在翻译字幕...', 'info');
                    await this.translator.translateAllSubtitles();
                    this.updateStatus('字幕翻译完成', 'success');

                    // 更新UI状态
                    this.loadSubtitlesButton.style.display = 'none';
                    this.summaryButton.style.display = 'block';
                    this.startButton.disabled = false;
                    this.startButton.style.opacity = '1';
                    this.startButton.style.cursor = 'pointer';

                    // 显示翻译样本
                    // const allSubtitles = this.translator.subtitleManager.subtitles;
                    // if (allSubtitles) {
                    //     allSubtitles.forEach(sub => {
                    //         this.updateSubtitleDisplay(sub);
                    //     });
                    // }
                } catch (error) {
                    this.loadSubtitlesButton.disabled = false;
                    this.loadSubtitlesButton.textContent = '重试加载字幕';
                    this.updateStatus(`加载字幕失败: ${error.message}`, 'error');
                }
            });


            // 开始播放按钮事件
            this.startButton.addEventListener('click', async () => {
                try {
                    this.startButton.style.display = 'none';
                    this.pauseButton.style.display = 'block';
                    this.translator.startTranslator();
                    this.videoController.playVideo();
                    //this.updateStatus('开始播放', 'success');
                } catch (error) {
                    this.updateStatus(`播放失败: ${error.message}`, 'error');
                    this.startButton.style.display = 'block';
                    this.pauseButton.style.display = 'none';
                }
            });

            // 暂停按钮事件
            this.pauseButton.addEventListener('click', () => {
                this.pauseButton.style.display = 'none';
                this.startButton.style.display = 'block';
                this.videoController.pauseVideo();
                this.updateStatus('播放已暂停', 'info');
            });

                    // 总结按钮事件
            this.summaryButton.addEventListener('click', async () => {
                try {
                    this.summaryButton.disabled = true;
                    this.summaryButton.textContent = '正在生成总结...';
                    this.updateStatus('正在生成视频内容总结...', 'info');

                    const summary = await this.translator.generateSummary();

                    this.summaryContent.textContent = summary;
                    this.summaryPanel.style.display = 'block';
                    this.updateStatus('总结生成完成', 'success');
                } catch (error) {
                    this.updateStatus(`生成总结失败: ${error.message}`, 'error');
                } finally {
                    this.summaryButton.disabled = false;
                    this.summaryButton.textContent = '生成总结';
                }
            });
        }

        createButton(text, color) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                background: ${color};
                color: white;
                cursor: pointer;
                font-size: 14px;
                flex: 1;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            `;

            button.addEventListener('mouseover', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });

            button.addEventListener('mouseout', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            });

            return button;
        }

        createStatusDisplay() {
            this.statusDisplay = document.createElement('div');
            this.statusDisplay.style.cssText = `
                margin-top: 15px;
                max-height: 450px;
                max-width: 400px;
                overflow-y: auto;
                padding: 10px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.5;
            `;
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            if (this.isCollapsed) {
                this.mainContent.style.display = 'none';
                this.container.style.width = '200px';
                this.toggleButton.textContent = '↓';
            } else {
                this.mainContent.style.display = 'block';
                this.container.style.width = '300px';
                this.toggleButton.textContent = '↑';
            }
        }

        makeDraggable(dragHandle) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            dragHandle.addEventListener('mousedown', (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === dragHandle) {
                    isDragging = true;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;

                    const maxX = window.innerWidth - this.container.offsetWidth;
                    const maxY = window.innerHeight - this.container.offsetHeight;
                    xOffset = Math.min(Math.max(0, xOffset), maxX);
                    yOffset = Math.min(Math.max(0, yOffset), maxY);

                    this.container.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                }
            });

            document.addEventListener('mouseup', () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            });
        }

        updateStatus(message, type = 'info') {
            const entry = document.createElement('div');
            entry.style.cssText = `
                margin-bottom: 8px;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 13px;
                ${type === 'error' ? 'background: rgba(244, 67, 54, 0.2); color: #ff8a80;' : ''}
            `;
            entry.textContent = `${type === 'error' ? '❌ ' : ''}${message}`;
            this.statusDisplay.appendChild(entry);
            this.statusDisplay.scrollTop = this.statusDisplay.scrollHeight;
        }
    }

    // 初始化应用
    async function initializeApp() {
        // 检查是否在YouTube账户页面
        if (window.location.href.includes('accounts.youtube.com')) {
            console.log('在账户页面，跳过初始化');
            return;
        }
        const playerManager = PlayerManager.getInstance();
        await playerManager.initialize();
        // 启动前10秒内每秒检查一次播放状态
        const player = playerManager.player;
        //console.log("播放器信息: " ,player)

        // 创建视频控制器
        const videoController = new VideoController();

        // 创建翻译器
        const translator = new YouTubeTranslator();


        // 创建UI管理器
        const ui = new UIManager(videoController,translator);

        // 设置 UI 管理器
        translator.setUIManager(ui);

        // 获取视频ID
        const videoId = translator.getVideoId();

        if (videoId) {
            console.log('成功获取视频ID: ', videoId);
            let checkCount = 0;
            // 启动前10秒内每秒检查一次播放状态
            const checkInterval = setInterval(() => {
                if (checkCount >= 5) {
                    clearInterval(checkInterval);
                    return;
                }

                if (player && typeof player.getPlayerState === 'function' && player.getPlayerState() === 1) {
                    player.pauseVideo();
                    console.log('视频已自动暂停');
                }

                checkCount++;
            }, 1000);
            translator.initialize().catch(error => {
                console.error('初始化失败:', error);
            });
        } else if (retryCount < maxRetries) {
            console.log(`未获取到视频ID，${retryInterval/1000}秒后重试 (${retryCount + 1}/${maxRetries})`);
            retryCount++;
            setTimeout(tryInitialize, retryInterval);
        } else {
            console.log('达到最大重试次数，初始化失败');
        }

    }


    // 页面加载完成后启动应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    function getUid() {
        try {
            // 检查是否在YouTube账户页面
            if (window.location.href.includes('accounts.youtube.com')) {
                return null;
            }

            // 方法1: 从URL获取
            const url = window.location.href;
            //console.log("当前页面URL:", url);

            if (url.includes('youtube.com')) {
                // 标准观看页面
                if (url.includes('/watch')) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const videoId = urlParams.get('v');
                    if (videoId) {
                       // console.log("从URL参数获取到视频ID:", videoId);
                        return videoId;
                    }
                }

                // 短视频格式
                if (url.includes('/shorts/')) {
                    const matches = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
                    if (matches && matches[1]) {
                        console.log("从shorts URL获取到视频ID:", matches[1]);
                        return matches[1];
                    }
                }
            }

            // 方法2: 从视频元素获取
            const videoElement = document.querySelector('video');
            if (videoElement) {
                // 从视频源获取
                const videoSrc = videoElement.src;
                if (videoSrc) {
                    const videoIdMatch = videoSrc.match(/\/([a-zA-Z0-9_-]{11})/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        console.log("从视频源获取到视频ID:", videoIdMatch[1]);
                        return videoIdMatch[1];
                    }
                }

                // 从播放器容器获取
                const playerContainer = document.getElementById('movie_player') ||
                                     document.querySelector('.html5-video-player');
                if (playerContainer) {
                    const dataVideoId = playerContainer.getAttribute('video-id') ||
                                      playerContainer.getAttribute('data-video-id');
                    if (dataVideoId) {
                        console.log("从播放器容器获取到视频ID:", dataVideoId);
                        return dataVideoId;
                    }
                }
            }

            // 方法3: 从页面元数据获取
            const ytdPlayerConfig = document.querySelector('ytd-player');
            if (ytdPlayerConfig) {
                const videoData = ytdPlayerConfig.getAttribute('video-id');
                if (videoData) {
                    console.log("从ytd-player获取到视频ID:", videoData);
                    return videoData;
                }
            }

            // 方法4: 从页面脚本数据获取
            const scripts = document.getElementsByTagName('script');
            for (const script of scripts) {
                const content = script.textContent;
                if (content && content.includes('"videoId"')) {
                    const match = content.match(/"videoId":\s*"([a-zA-Z0-9_-]{11})"/);
                    if (match && match[1]) {
                        console.log("从页面脚本获取到视频ID:", match[1]);
                        return match[1];
                    }
                }
            }

            // 如果所有方法都失败，等待页面加载完成后重试
            if (document.readyState !== 'complete') {
                console.log("页面未完全加载，返回null");
                return null;
            }

            throw new Error('未在当前页面找到有效的YouTube视频');
        } catch (error) {
            console.error('获取视频ID失败:', error);
            return null;
        }
    }

})();