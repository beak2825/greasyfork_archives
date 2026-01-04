// ==UserScript==
// @name         大模型中文翻译助手
// @name:en      LLM powered WebPage Translator to Chinese
// @namespace    http://tampermonkey.net/
// @version      2.3.3
// @description  选中文本后调用 OpenAI Compatible API 将其翻译为中文，支持历史记录、收藏夹及整页翻译
// @description:en Select text and call OpenAI Compatible API to translate it to Chinese, supports history, favorites and full page translation
// @author       tzh
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530093/%E5%A4%A7%E6%A8%A1%E5%9E%8B%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530093/%E5%A4%A7%E6%A8%A1%E5%9E%8B%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Core Application Architecture
     * 
     * This refactored translator script follows a modular architecture with clear separation of concerns:
     * 1. Config - Application settings and configuration management
     * 2. State - Global state management with a pub/sub pattern
     * 3. API - API service for communication with LLM services
     * 4. UI - User interface components
     * 5. Utils - Utility functions
     * 6. Core - Core application logic and workflow
     */

    /**
     * Config Module - Manages application settings
     */
    const Config = (function() {
        // Default settings
        const defaultSettings = {
            apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
            apiKey: '',
            model: 'deepseek-chat',
            systemPrompt: '你是一个翻译助手。我会为你提供待翻译的文本，以及之前已经翻译过的上下文（如果有）。请参考这些上下文，将文本准确地翻译成中文，保持原文的意思、风格和格式。在充分保留原文意思的情况下使用符合中文习惯的表达。只返回翻译结果，不需要解释。',
            wordExplanationPrompt: '你是一个词汇解释助手。请解释我提供的英语单词或短语。如果是单个单词，请提供音标、多种常见意思、词性分类以及每种意思下的例句。对于短语，请解释其含义和用法，并提供例句。所有内容都需要用中文解释，并使用HTML格式化，以便清晰易读。请为每个例句提供简洁的中文翻译，翻译要准确传达原句含义。返回格式示例：<div class="word-header"><h3>单词或短语</h3><div class="phonetic">/音标/</div></div><div class="meanings"><div class="meaning"><span class="part-of-speech">词性</span>: 意思解释<div class="example">例句<div class="example-translation">例句翻译</div></div></div></div>',
            useStreaming: false,
            temperature: 0.3,
            maxHistoryItems: 50,
            maxFavoritesItems: 100,
            showSourceLanguage: false,
            autoDetectLanguage: true,
            detectArticleContent: true,
            contextSize: 3,
            useTranslationContext: true,
            fullPageTranslationSelector: 'body',
            fullPageMaxSegmentLength: 2000,
            excludeSelectors: 'script, style, noscript, iframe, img, svg, canvas',
            apiConfigs: [
                {
                    name: 'DeepSeek',
                    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
                    apiKey: '',
                    model: 'deepseek-chat',
                }
            ],
            currentApiIndex: 0,
            currentTab: 'general',
        };

        // Current settings
        let settings = GM_getValue('translatorSettings', defaultSettings);
        
        // Public methods
        return {
            // Initialize settings
            init: () => {
                // Reload settings from storage
                settings = GM_getValue('translatorSettings', defaultSettings);
                
                // Sync API settings
                Config.syncApiSettings();
                return settings;
            },
            
            getSettings: () => settings,
            getSetting: (key) => {
                if(settings[key]){
                    return settings[key]
                }else{
                    settings[key] = defaultSettings[key];
                    GM_setValue('translatorSettings', settings);
                    return defaultSettings[key]
                }
            },
            
            // Updates a specific setting
            updateSetting: (key, value) => {
                settings[key] = value;
                GM_setValue('translatorSettings', settings);
                return settings;
            },
            
            // Updates multiple settings at once
            updateSettings: (newSettings) => {
                settings = { ...settings, ...newSettings };
                GM_setValue('translatorSettings', settings);
                return settings;
            },
            
            // Syncs API settings from the current API config
            syncApiSettings: () => {
                if (settings.apiConfigs && settings.apiConfigs.length > 0 && 
                    settings.currentApiIndex >= 0 && 
                    settings.currentApiIndex < settings.apiConfigs.length) {
                    
                    const currentApi = settings.apiConfigs[settings.currentApiIndex];
                    
                    settings.apiEndpoint = currentApi.apiEndpoint;
                    settings.apiKey = currentApi.apiKey;
                    settings.model = currentApi.model;
                    
                    GM_setValue('translatorSettings', settings);
                }
            }
        };
    })();

    /**
     * State Module - Global state management with pub/sub pattern
     */
    const State = (function() {
        // Private state object
        const state = {
            translationHistory: GM_getValue('translationHistory', []),
            translationFavorites: GM_getValue('translationFavorites', []),
            activeTranslateButton: null,
            lastSelectedText: '',
            lastSelectionRect: null,
            isTranslatingFullPage: false,
            isTranslationPaused: false,
            isStopped: false,
            isShowingTranslation: true,
            translationSegments: [],
            lastTranslatedIndex: -1,
            originalTexts: [],
            translationCache: GM_getValue('translationCache', {}),
            isApplyingCache: false,
            cacheApplied: false,
            debugMode: true
        };
        
        // Store subscribers for each state property
        const subscribers = {};
        
        // Store component-specific subscriptions for cleanup
        const componentSubscriptions = {};
        
        // Getter for state properties
        const get = (key) => {
            return state[key];
        };
        
        // Setter for state properties
        const set = (key, value) => {
            // Skip if value hasn't changed
            if (state[key] === value) return value;
            
            // Update state
            const oldValue = state[key];
            state[key] = value;
            
            // Save persistent state to GM storage
            if (key === 'translationHistory' || key === 'translationFavorites' || key === 'translationCache') {
                GM_setValue(key, value);
            }
            
            // Notify subscribers
            if (subscribers[key]) {
                subscribers[key].forEach(callback => {
                    try {
                        callback(value, oldValue);
                    } catch (err) {
                        console.error(`Error in state subscriber for ${key}:`, err);
                    }
                });
            }
            
            return value;
        };
        
        // Subscribe to state changes
        const subscribe = (key, callback) => {
            if (!subscribers[key]) {
                subscribers[key] = [];
            }
            
            subscribers[key].push(callback);
            
            // Return unsubscribe function
            return () => {
                if (subscribers[key]) {
                    subscribers[key] = subscribers[key].filter(cb => cb !== callback);
                }
            };
        };
        
        // Subscribe to multiple state properties
        const subscribeMultiple = (keys, callback) => {
            const unsubscribers = keys.map(key => subscribe(key, callback));
            
            // Return a function that unsubscribes from all
            return () => {
                unsubscribers.forEach(unsubscribe => unsubscribe());
            };
        };
        
        // Register component subscriptions for easy cleanup
        const registerComponent = (componentId) => {
            if (!componentSubscriptions[componentId]) {
                componentSubscriptions[componentId] = [];
            }
            
            return {
                subscribe: (key, callback) => {
                    const unsubscribe = subscribe(key, callback);
                    componentSubscriptions[componentId].push(unsubscribe);
                    return unsubscribe;
                },
                subscribeMultiple: (keys, callback) => {
                    const unsubscribe = subscribeMultiple(keys, callback);
                    componentSubscriptions[componentId].push(unsubscribe);
                    return unsubscribe;
                },
                cleanup: () => {
                    if (componentSubscriptions[componentId]) {
                        componentSubscriptions[componentId].forEach(unsubscribe => unsubscribe());
                        componentSubscriptions[componentId] = [];
                    }
                }
            };
        };
        
        // Debug log function
        const debugLog = (...args) => {
            if (state.debugMode) {
                console.log('[Translator]', ...args);
            }
        };
        
        return {
            get,
            set,
            subscribe,
            subscribeMultiple,
            registerComponent,
            debugLog
        };
    })();

    /**
     * API Module - Handles communication with LLM services
     */
    const API = (function() {
        // Track API errors and delays
        let consecutiveErrors = 0;
        let currentDelay = 0;
        let defaultDelay = 50; // Default delay between API calls
        let maxDelay = 5000; // Maximum delay between API calls
        
        // Reset errors when successful
        const resetErrorState = () => {
            consecutiveErrors = 0;
            currentDelay = defaultDelay;
        };
        
        // Handle API errors and adjust delay if needed
        const handleApiError = (error) => {
            consecutiveErrors++;
            
            // Increase delay after multiple consecutive errors (likely rate limiting)
            if (consecutiveErrors >= 3) {
                // Exponential backoff - increase delay but cap at maximum
                currentDelay = Math.min(maxDelay, currentDelay * 1.5 || defaultDelay * 2);
                
                // Append rate limiting information to error
                const delayInSeconds = (currentDelay / 1000).toFixed(1);
                error.message += ` (已自动增加延迟至${delayInSeconds}秒以减少API负载)`;
                
                // Notify through State for UI to display
                State.set('apiDelay', currentDelay);
            }
            
            return error;
        };
        
        // Wait for the current delay
        const applyDelay = async () => {
            if (currentDelay > 0) {
                await new Promise(resolve => setTimeout(resolve, currentDelay));
            }
        };
        
        // Translate text using OpenAI-compatible API
        const translateText = async (text, options = {}) => {
            // Default options
            const defaults = {
                isWordExplanationMode: false,
                useContext: Config.getSetting('useTranslationContext'),
                context: null,
                retryWithoutStreaming: false,
                onProgress: null
            };
            
            // Merge defaults with provided options
            const settings = { ...defaults, ...options };
            
            // Get configuration
            const apiKey = Config.getSetting('apiKey');
            const apiEndpoint = Config.getSetting('apiEndpoint');
            const model = Config.getSetting('model');
            const temperature = Config.getSetting('temperature');
            const useStreaming = settings.retryWithoutStreaming ? false : Config.getSetting('useStreaming');
            
            // Validate API key
            if (!apiKey) {
                throw new Error('API密钥未设置，请在设置面板中配置API密钥');
            }
            
            // Prepare prompt based on mode
            const systemPrompt = settings.isWordExplanationMode 
                ? Config.getSetting('wordExplanationPrompt') 
                : Config.getSetting('systemPrompt');
            
            // Prepare messages for the API
            const messages = [
                { role: 'system', content: systemPrompt }
            ];
            
            // Add context messages if available and enabled
            if (settings.useContext && settings.context && settings.context.length > 0) {
                // Add context messages in pairs (original + translation)
                settings.context.forEach(item => {
                    messages.push({ role: 'user', content: item.source });
                    messages.push({ role: 'assistant', content: item.translation });
                });
            }
            
            // Add the current text to translate
            messages.push({ role: 'user', content: text });
            
            // Prepare request data
            const requestData = {
                model: model,
                messages: messages,
                temperature: parseFloat(temperature),
                stream: useStreaming
            };
            
            State.debugLog('API Request:', {
                endpoint: apiEndpoint,
                data: requestData,
                streaming: useStreaming
            });
            
            // Apply delay before API call if needed
            await applyDelay();
            
            try {
                let result;
                
                // Handle non-streaming response
                if (!useStreaming) {
                    result = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: apiEndpoint,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            data: JSON.stringify(requestData),
                            onload: function(response) {
                                try {
                                    if (response.status >= 200 && response.status < 300) {
                                        const data = JSON.parse(response.responseText);
                                        if (data.choices && data.choices[0] && data.choices[0].message) {
                                            resolve(data.choices[0].message.content);
                                        } else {
                                            reject(new Error('API响应格式不正确，无法获取翻译结果'));
                                        }
                                    } else {
                                        let errorMsg = '翻译请求失败';
                                        try {
                                            const errorData = JSON.parse(response.responseText);
                                            errorMsg = errorData.error?.message || errorMsg;
                                        } catch (e) {
                                            // If parsing fails, use the status text
                                            errorMsg = `翻译请求失败: ${response.statusText}`;
                                        }
                                        reject(new Error(errorMsg));
                                    }
                                } catch (e) {
                                    reject(new Error(`处理API响应时出错: ${e.message}`));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`API请求出错: ${error.statusText || '未知错误'}`));
                            },
                            ontimeout: function() {
                                reject(new Error('API请求超时'));
                            }
                        });
                    });
                } else {
                    // Handle streaming response
                    result = await new Promise((resolve, reject) => {
                        let translatedText = '';
                        let isFirstChunk = true;
                        
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: apiEndpoint,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`
                            },
                            data: JSON.stringify(requestData),
                            onloadstart: function() {
                                State.debugLog('Streaming request started');
                            },
                            onprogress: function(response) {
                                try {
                                    // Parse SSE data
                                    const chunks = response.responseText.split('\n\n');
                                    let newContent = '';
                                    
                                    // Process each chunk
                                    for (let i = 0; i < chunks.length; i++) {
                                        const chunk = chunks[i].trim();
                                        if (!chunk || chunk === 'data: [DONE]') continue;
                                        
                                        if (chunk.startsWith('data: ')) {
                                            try {
                                                const data = JSON.parse(chunk.substring(6));
                                                if (data.choices && data.choices[0]) {
                                                    const content = data.choices[0].delta?.content || '';
                                                    if (content) {
                                                        newContent += content;
                                                    }
                                                }
                                            } catch (e) {
                                                State.debugLog('Error parsing chunk:', chunk, e);
                                            }
                                        }
                                    }
                                    
                                    // Update translated text
                                    translatedText += newContent;
                                    
                                    // Call progress callback if provided
                                    if (settings.onProgress && newContent) {
                                        settings.onProgress({
                                            text: translatedText,
                                            isFirstChunk: isFirstChunk
                                        });
                                        isFirstChunk = false;
                                    }
                                } catch (e) {
                                    State.debugLog('Error processing streaming response:', e);
                                }
                            },
                            onload: function(response) {
                                if (response.status >= 200 && response.status < 300) {
                                    resolve(translatedText);
                                } else {
                                    let errorMsg = '翻译请求失败';
                                    try {
                                        const errorData = JSON.parse(response.responseText);
                                        errorMsg = errorData.error?.message || errorMsg;
                                    } catch (e) {
                                        errorMsg = `翻译请求失败: ${response.statusText}`;
                                    }
                                    reject(new Error(errorMsg));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`API请求出错: ${error.statusText || '未知错误'}`));
                            },
                            ontimeout: function() {
                                reject(new Error('API请求超时'));
                            }
                        });
                    });
                }
                
                // Reset error state on successful translation
                resetErrorState();
                
                return result;
            } catch (error) {
                // Handle API error and adjust delay
                throw handleApiError(error);
            }
        };
        
        // Retry translation with fallback options
        const retryTranslation = async (text, options = {}) => {
            try {
                return await translateText(text, options);
            } catch (error) {
                State.debugLog('Translation failed, retrying with fallbacks:', error);
                
                // First fallback: try without streaming if enabled
                if (!options.retryWithoutStreaming && Config.getSetting('useStreaming')) {
                    try {
                        return await translateText(text, { ...options, retryWithoutStreaming: true });
                    } catch (streamingError) {
                        State.debugLog('Retry without streaming failed:', streamingError);
                    }
                }
                
                // Second fallback: try without context if enabled
                if (options.useContext && options.context && options.context.length > 0) {
                    try {
                        State.debugLog('Retrying without context');
                        return await translateText(text, { 
                            ...options, 
                            useContext: false, 
                            context: null, 
                            retryWithoutStreaming: true 
                        });
                    } catch (contextError) {
                        State.debugLog('Retry without context failed:', contextError);
                    }
                }
                
                // Third fallback: try with a different API if available
                const apiConfigs = Config.getSetting('apiConfigs');
                const currentApiIndex = Config.getSetting('currentApiIndex');
                
                if (apiConfigs.length > 1) {
                    // Find an alternative API
                    const alternativeIndex = (currentApiIndex + 1) % apiConfigs.length;
                    
                    try {
                        // Temporarily switch API
                        Config.updateSetting('currentApiIndex', alternativeIndex);
                        Config.syncApiSettings();
                        
                        State.debugLog(`Retrying with alternative API: ${apiConfigs[alternativeIndex].name}`);
                        
                        // Make the request with new API
                        const result = await translateText(text, { 
                            ...options, 
                            retryWithoutStreaming: true // Always use non-streaming for fallback
                        });
                        
                        // Switch back to the original API
                        Config.updateSetting('currentApiIndex', currentApiIndex);
                        Config.syncApiSettings();
                        
                        return result;
                    } catch (apiError) {
                        // Restore original API settings on error
                        Config.updateSetting('currentApiIndex', currentApiIndex);
                        Config.syncApiSettings();
                        
                        State.debugLog('Retry with alternative API failed:', apiError);
                    }
                }
                
                // All retries failed - throw the original error
                throw error;
            }
        };
        
        // Get current API status for monitoring
        const getApiStatus = () => {
            return {
                consecutiveErrors,
                currentDelay,
                isRateLimited: consecutiveErrors >= 3
            };
        };
        
        return {
            translateText,
            retryTranslation,
            getApiStatus
        };
    })();

    /**
     * UI Module - User interface components
     */
    const UI = (function() {
        // UI Components
        const components = {
            translateButton: {
                element: null,
                explanationElement: null,
                
                create: (isExplanationMode = false) => {
                    // Create button if it doesn't exist
                    if (!components.translateButton.element) {
                        const button = document.createElement('div');
                        button.className = 'translate-button';
                        button.style.cssText = `
                            position: absolute;
                            background-color: #4285f4;
                            color: white;
                            border-radius: 4px;
                            padding: 8px 12px;
                            font-size: 14px;
                            cursor: pointer;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                            z-index: 9999;
                            user-select: none;
                            display: flex;
                            align-items: center;
                            font-family: Arial, sans-serif;
                        `;
                        button.innerHTML = `
                            <span class="translate-icon" style="margin-right: 6px;">🌐</span>
                            <span class="translate-text">翻译</span>
                        `;
                        
                        // Add click event listener
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const selectedText = State.get('lastSelectedText');
                            const rect = State.get('lastSelectionRect');
                            
                            if (selectedText && rect) {
                                // Set active button
                                State.set('activeTranslateButton', button);
                                
                                // Show translation popup
                                components.translationPopup.show(selectedText, rect, isExplanationMode);
                            }
                        });
                        
                        document.body.appendChild(button);
                        components.translateButton.element = button;
                    }
                    
                    // Update button text based on mode
                    const textElement = components.translateButton.element.querySelector('.translate-text');
                    if (textElement) {
                        textElement.textContent = isExplanationMode ? '解释' : '翻译';
                    }
                    
                    return components.translateButton.element;
                },
                
                show: (rect) => {
                    const button = components.translateButton.create();
                    
                    // Position button near the selection
                    const scrollX = window.scrollX || window.pageXOffset;
                    const scrollY = window.scrollY || window.pageYOffset;
                    
                    // Position at the end of the selection
                    let left = rect.right + scrollX;
                    let top = rect.bottom + scrollY;
                    
                    // Set position
                    button.style.left = `${left}px`;
                    button.style.top = `${top}px`;
                    button.style.display = 'flex';
                    
                    // Create word explanation button for short English phrases
                    const text = State.get('lastSelectedText');
                    if (Utils.isShortPhrase(text)) {
                        if (!components.translateButton.explanationElement) {
                            const explanationBtn = document.createElement('div');
                            explanationBtn.className = 'translate-button explanation-button';
                            explanationBtn.style.cssText = `
                                position: absolute;
                                background-color: #fbbc05;
                                color: white;
                                border-radius: 4px;
                                padding: 8px 12px;
                                font-size: 14px;
                                cursor: pointer;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                                z-index: 9999;
                                user-select: none;
                                display: flex;
                                align-items: center;
                                font-family: Arial, sans-serif;
                            `;
                            explanationBtn.innerHTML = `
                                <span class="translate-icon" style="margin-right: 6px;">📚</span>
                                <span class="translate-text">解释</span>
                            `;
                            
                            explanationBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Always get the current selected text when explanation button is clicked
                                const currentText = State.get('lastSelectedText');
                                const rect = State.get('lastSelectionRect');
                                components.translationPopup.show(currentText, rect, true);
                            });
                            
                            document.body.appendChild(explanationBtn);
                            components.translateButton.explanationElement = explanationBtn;
                        }
                        
                        // Position the explanation button below the main button
                        const btnRect = button.getBoundingClientRect();
                        const explanationBtn = components.translateButton.explanationElement;
                        explanationBtn.style.left = `${left}px`;
                        explanationBtn.style.top = `${top + btnRect.height + 5}px`;
                        explanationBtn.style.display = 'flex';
                    } else if (components.translateButton.explanationElement) {
                        components.translateButton.explanationElement.style.display = 'none';
                    }
                },
                
                hide: () => {
                    if (components.translateButton.element) {
                        components.translateButton.element.style.display = 'none';
                    }
                    
                    if (components.translateButton.explanationElement) {
                        components.translateButton.explanationElement.style.display = 'none';
                    }
                }
            },
            
            translationPopup: {
                element: null,
                
                create: () => {
                    if (!components.translationPopup.element) {
                        const popup = document.createElement('div');
                        popup.className = 'translation-popup';
                        popup.style.cssText = `
                            position: absolute;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                            padding: 15px;
                            z-index: 9998;
                            max-width: 500px;
                            min-width: 300px;
                            max-height: 80vh;
                            overflow-y: auto;
                            display: none;
                            font-family: Arial, sans-serif;
                            line-height: 1.5;
                            color: #333;
                        `;
                        
                        // Create popup header
                        const header = document.createElement('div');
                        header.className = 'popup-header';
                        header.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 10px;
                            padding-bottom: 10px;
                            border-bottom: 1px solid #eee;
                            cursor: move;
                        `;
                        
                        // Create title
                        const title = document.createElement('div');
                        title.className = 'popup-title';
                        title.style.cssText = 'font-weight: bold; font-size: 16px;';
                        title.textContent = '翻译结果';
                        
                        // Create controls
                        const controls = document.createElement('div');
                        controls.className = 'popup-controls';
                        controls.style.cssText = 'display: flex; gap: 8px;';
                        
                        // Create buttons
                        const btnStyle = 'background: none; border: none; cursor: pointer; font-size: 16px; padding: 0;';
                        
                        const favoriteBtn = document.createElement('button');
                        favoriteBtn.className = 'popup-favorite-btn';
                        favoriteBtn.innerHTML = '⭐';
                        favoriteBtn.title = '添加到收藏';
                        favoriteBtn.style.cssText = btnStyle;
                        favoriteBtn.addEventListener('click', () => {
                            const text = components.translationPopup.element.querySelector('.original-text').textContent;
                            const translation = components.translationPopup.element.querySelector('.translation-text').innerHTML;
                            
                            Core.favoritesManager.add(text, translation);
                            
                            favoriteBtn.innerHTML = '✓';
                            setTimeout(() => { favoriteBtn.innerHTML = '⭐'; }, 1000);
                        });
                        
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'popup-copy-btn';
                        copyBtn.innerHTML = '📋';
                        copyBtn.title = '复制翻译结果';
                        copyBtn.style.cssText = btnStyle;
                        copyBtn.addEventListener('click', () => {
                            const translation = components.translationPopup.element.querySelector('.translation-text').textContent;
                            navigator.clipboard.writeText(translation);
                            
                            copyBtn.innerHTML = '✓';
                            setTimeout(() => { copyBtn.innerHTML = '📋'; }, 1000);
                        });
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.className = 'popup-close-btn';
                        closeBtn.innerHTML = '✖';
                        closeBtn.title = '关闭';
                        closeBtn.style.cssText = btnStyle;
                        closeBtn.addEventListener('click', () => {
                            components.translationPopup.hide();
                        });
                        
                        // Add buttons to controls
                        controls.appendChild(favoriteBtn);
                        controls.appendChild(copyBtn);
                        controls.appendChild(closeBtn);
                        
                        // Add title and controls to header
                        header.appendChild(title);
                        header.appendChild(controls);
                        
                        // Create content container
                        const content = document.createElement('div');
                        content.className = 'popup-content';
                        
                        // Create original text area
                        const originalText = document.createElement('div');
                        originalText.className = 'original-text';
                        originalText.style.cssText = `
                            margin-bottom: 10px;
                            padding: 10px;
                            background-color: #f5f5f5;
                            border-radius: 4px;
                            font-size: 14px;
                            white-space: pre-wrap;
                            word-break: break-word;
                            display: none;
                        `;
                        
                        // Create translation area
                        const translationText = document.createElement('div');
                        translationText.className = 'translation-text';
                        translationText.style.cssText = `
                            font-size: 16px;
                            white-space: pre-wrap;
                            word-break: break-word;
                        `;
                        
                        // Create loading animation
                        const loading = document.createElement('div');
                        loading.className = 'loading-animation';
                        loading.style.cssText = 'display: none; text-align: center; padding: 20px 0;';
                        loading.innerHTML = `
                            <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; 
                            border-top: 3px solid #4285f4; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                        `;
                        
                        // Create error message area
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.style.cssText = 'color: #d93025; font-size: 14px; margin-top: 10px; display: none;';
                        
                        // Add elements to content
                        content.appendChild(originalText);
                        content.appendChild(translationText);
                        content.appendChild(loading);
                        content.appendChild(errorMsg);
                        
                        // Add header and content to popup
                        popup.appendChild(header);
                        popup.appendChild(content);
                        
                        // Add popup to document
                        document.body.appendChild(popup);
                        components.translationPopup.element = popup;
                        
                        // Add draggability
                        components.translationPopup.makeDraggable(popup, header);
                    }
                    
                    return components.translationPopup.element;
                },
                
                makeDraggable: (element, handle) => {
                    let isDragging = false;
                    let startX, startY;
                    let startLeft, startTop;
                    
                    // Function to handle the start of dragging
                    const onMouseDown = (e) => {
                        // Ignore if clicked on control buttons
                        if (e.target.closest('.popup-controls')) {
                            return;
                        }
                        
                        e.preventDefault();
                        
                        // Get initial positions
                        isDragging = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        
                        // Get current element position, including scroll offset
                        const rect = element.getBoundingClientRect();
                        const scrollX = window.scrollX || window.pageXOffset;
                        const scrollY = window.scrollY || window.pageYOffset;
                        startLeft = rect.left + scrollX;
                        startTop = rect.top + scrollY;
                        
                        // Add move and up listeners
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                        
                        // Change cursor to grabbing
                        handle.style.cursor = 'grabbing';
                    };
                    
                    // Function to handle dragging movement
                    const onMouseMove = (e) => {
                        if (!isDragging) return;
                        
                        e.preventDefault();
                        
                        // Calculate the new position
                        const deltaX = e.clientX - startX;
                        const deltaY = e.clientY - startY;
                        
                        // New position (absolute to the document)
                        const newLeft = startLeft + deltaX;
                        const newTop = startTop + deltaY;
                        
                        // Set the new position
                        element.style.left = `${newLeft}px`;
                        element.style.top = `${newTop}px`;
                    };
                    
                    // Function to handle the end of dragging
                    const onMouseUp = () => {
                        isDragging = false;
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        
                        // Restore cursor
                        handle.style.cursor = 'move';
                    };
                    
                    // Add mouse down listener to handle
                    handle.addEventListener('mousedown', onMouseDown);
                    
                    // Return cleanup function
                    return () => {
                        handle.removeEventListener('mousedown', onMouseDown);
                    };
                },
                
                show: async (text, rect, isExplanationMode = false) => {
                    const popup = components.translationPopup.create();
                    
                    // Set popup title
                    const title = popup.querySelector('.popup-title');
                    title.textContent = isExplanationMode ? '词汇解释' : '翻译结果';
                    
                    // Set original text
                    const originalTextElem = popup.querySelector('.original-text');
                    originalTextElem.textContent = text;
                    
                    // Show original text if enabled
                    if (Config.getSetting('showSourceLanguage')) {
                        originalTextElem.style.display = 'block';
                    } else {
                        originalTextElem.style.display = 'none';
                    }
                    
                    // Clear previous translation
                    const translationElem = popup.querySelector('.translation-text');
                    translationElem.innerHTML = '';
                    
                    // Apply different styles based on mode
                    if (isExplanationMode) {
                        translationElem.style.cssText = `
                            font-size: 14px;
                            white-space: normal;
                            word-break: break-word;
                            line-height: 1.5;
                        `;
                        
                        // Add specific styles for explanation mode content
                        const style = document.createElement('style');
                        style.textContent = `
                            .translation-text .word-header {
                                margin-bottom: 8px;
                            }
                            .translation-text .word-header h3 {
                                margin: 0 0 4px 0;
                                font-size: 18px;
                            }
                            .translation-text .phonetic {
                                color: #666;
                                font-style: italic;
                                margin-bottom: 8px;
                            }
                            .translation-text .meanings {
                                margin-bottom: 8px;
                            }
                            .translation-text .meaning {
                                margin-bottom: 8px;
                            }
                            .translation-text .part-of-speech {
                                font-weight: bold;
                                color: #333;
                            }
                            .translation-text .example {
                                margin: 4px 0 4px 12px;
                                color: #555;
                                font-style: italic;
                            }
                            .translation-text .example-translation {
                                color: #666;
                                margin-top: 2px;
                            }
                        `;
                        
                        // Only add the style if it doesn't exist yet
                        if (!document.querySelector('style#explanation-styles')) {
                            style.id = 'explanation-styles';
                            document.head.appendChild(style);
                        }
                    } else {
                        translationElem.style.cssText = `
                            font-size: 16px;
                            white-space: pre-wrap;
                            word-break: break-word;
                        `;
                    }
                    
                    // Show loading animation
                    const loadingElem = popup.querySelector('.loading-animation');
                    loadingElem.style.display = 'block';
                    
                    // Hide error message
                    const errorElem = popup.querySelector('.error-message');
                    errorElem.style.display = 'none';
                    
                    // Position popup
                    const scrollX = window.scrollX || window.pageXOffset;
                    const scrollY = window.scrollY || window.pageYOffset;
                    
                    let left = rect.left + scrollX;
                    let top = rect.bottom + scrollY + 10;
                    
                    popup.style.left = `${left}px`;
                    popup.style.top = `${top}px`;
                    popup.style.display = 'block';
                    
                    try {
                        // Simple progress callback
                        const onProgress = (data) => {
                            loadingElem.style.display = 'none';
                            translationElem.innerHTML = data.text;
                        };
                        
                        // Call the API to translate
                        const translation = await API.retryTranslation(text, {
                            isWordExplanationMode: isExplanationMode,
                            onProgress: onProgress
                        });
                        
                        // Hide loading and show translation
                        loadingElem.style.display = 'none';
                        translationElem.innerHTML = translation;
                        
                        // Adjust the popup height to not exceed screen height
                        setTimeout(() => {
                            const viewportHeight = window.innerHeight;
                            const popupRect = popup.getBoundingClientRect();
                            
                            if (popupRect.height > viewportHeight * 0.8) {
                                popup.style.height = `${viewportHeight * 0.8}px`;
                                translationElem.style.maxHeight = `${viewportHeight * 0.6}px`;
                                translationElem.style.overflowY = 'auto';
                            }
                        }, 100);
                        
                        // Add to history
                        Core.historyManager.add(text, translation);
                        
                    } catch (error) {
                        // Hide loading animation
                        loadingElem.style.display = 'none';
                        
                        // Show error message
                        errorElem.textContent = `翻译出错: ${error.message}`;
                        errorElem.style.display = 'block';
                        
                        State.debugLog('Translation error:', error);
                    }
                },
                
                hide: () => {
                    if (components.translationPopup.element) {
                        components.translationPopup.element.style.display = 'none';
                    }
                    
                    // Also hide translate button
                    components.translateButton.hide();
                }
            },
            
            pageControls: {
                element: null,
                progressElement: null,
                statusElement: null,
                stateManager: null,
                
                create: () => {
                    if (!components.pageControls.element) {
                        // Create main panel
                        const panel = document.createElement('div');
                        panel.className = 'page-translation-controls';
                        panel.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            padding: 15px;
                            z-index: 9999;
                            font-family: Arial, sans-serif;
                            display: none;
                            flex-direction: column;
                            gap: 10px;
                            min-width: 220px;
                        `;
                        
                        // Create header
                        const header = document.createElement('div');
                        header.innerHTML = `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="font-weight: bold;">页面翻译</span>
                                <button style="background:none; border:none; cursor:pointer; font-size: 16px;">✖</button>
                            </div>
                        `;
                        
                        // Create status element
                        const statusElement = document.createElement('div');
                        statusElement.className = 'translation-status';
                        statusElement.style.cssText = `
                            font-size: 13px;
                            color: #666;
                            margin-bottom: 5px;
                            display: none;
                        `;
                        statusElement.textContent = '准备翻译...';
                        
                        // Create progress bar
                        const progressBar = document.createElement('div');
                        progressBar.style.cssText = 'background:#f0f0f0; height:6px; margin:5px 0; border-radius:3px;';
                        
                        const progressIndicator = document.createElement('div');
                        progressIndicator.style.cssText = 'background:#4285f4; height:100%; width:0%; transition:width 0.3s;';
                        progressBar.appendChild(progressIndicator);
                        
                        const progressText = document.createElement('div');
                        progressText.innerHTML = '<span>翻译进度</span><span class="progress-percentage">0%</span>';
                        progressText.style.cssText = 'display:flex; justify-content:space-between; font-size:12px;';
                        
                        // Create buttons
                        const buttons = document.createElement('div');
                        buttons.style.cssText = 'display:flex; gap:8px; margin-top:10px;';
                        
                        const pauseBtn = document.createElement('button');
                        pauseBtn.textContent = '暂停';
                        pauseBtn.style.cssText = 'flex:1; padding:8px; background:#f5f5f5; border:none; border-radius:4px; cursor:pointer;';
                        
                        const stopBtn = document.createElement('button');
                        stopBtn.textContent = '停止';
                        stopBtn.style.cssText = 'flex:1; padding:8px; background:#ff5252; color:white; border:none; border-radius:4px; cursor:pointer;';
                        
                        const restoreBtn = document.createElement('button');
                        restoreBtn.textContent = '恢复原文';
                        restoreBtn.style.cssText = 'flex:1; padding:8px; background:#f5f5f5; border:none; border-radius:4px; cursor:pointer;';
                        
                        buttons.appendChild(pauseBtn);
                        buttons.appendChild(stopBtn);
                        buttons.appendChild(restoreBtn);
                        
                        // Create secondary buttons
                        const secondaryButtons = document.createElement('div');
                        secondaryButtons.style.cssText = 'display:flex; gap:8px; margin-top:8px;';
                        
                        const retranslateBtn = document.createElement('button');
                        retranslateBtn.textContent = '重新翻译';
                        retranslateBtn.title = '忽略缓存，重新翻译整个页面';
                        retranslateBtn.style.cssText = 'flex:1; padding:8px; background:#5cb85c; color:white; border:none; border-radius:4px; cursor:pointer;';
                        
                        secondaryButtons.appendChild(retranslateBtn);
                        
                        // Create statistics element
                        const statsElement = document.createElement('div');
                        statsElement.className = 'translation-stats';
                        statsElement.style.cssText = `
                            font-size: 12px;
                            color: #666;
                            margin-top: 8px;
                        `;
                        
                        // Add all elements to panel
                        panel.appendChild(header);
                        panel.appendChild(statusElement);
                        panel.appendChild(progressText);
                        panel.appendChild(progressBar);
                        panel.appendChild(buttons);
                        panel.appendChild(secondaryButtons);
                        panel.appendChild(statsElement);
                        
                        // Add event listeners
                        header.querySelector('button').addEventListener('click', () => {
                            Core.restoreOriginalText(true);
                            components.pageControls.hide();
                        });
                        
                        pauseBtn.addEventListener('click', () => {
                            const isPaused = State.get('isTranslationPaused');
                            State.set('isTranslationPaused', !isPaused);
                        });
                        
                        stopBtn.addEventListener('click', () => {
                            if (State.get('isTranslatingFullPage')) {
                                Core.stopTranslation();
                            }
                        });
                        
                        restoreBtn.addEventListener('click', () => {
                            const isShowingTranslation = State.get('isShowingTranslation');
                            State.set('isShowingTranslation', !isShowingTranslation);
                            
                            if (isShowingTranslation) {
                                Core.restoreOriginalText(false);
                            } else {
                                Core.showTranslation();
                            }
                        });
                        
                        retranslateBtn.addEventListener('click', () => {
                            if (!State.get('isTranslatingFullPage')) {
                                // Show confirmation dialog if we have cached translations
                                const segments = State.get('translationSegments');
                                const hasCachedTranslations = segments && segments.length > 0 && segments.some(s => s.fromCache);
                                
                                if (hasCachedTranslations) {
                                    if (confirm('确定要忽略缓存重新翻译整个页面吗？这可能需要更长时间。')) {
                                        Core.translateFullPage({ forceRetranslate: true });
                                    }
                                } else {
                                    Core.translateFullPage({ forceRetranslate: true });
                                }
                            }
                        });
                        
                        // Make panel draggable
                        let isDragging = false;
                        let dragOffsetX = 0;
                        let dragOffsetY = 0;
                        
                        const headerElement = header.querySelector('div');
                        headerElement.style.cursor = 'move';
                        
                        headerElement.addEventListener('mousedown', e => {
                            if (e.target.tagName === 'BUTTON') return;
                            
                            e.preventDefault();
                            isDragging = true;
                            
                            const rect = panel.getBoundingClientRect();
                            dragOffsetX = e.clientX - rect.left;
                            dragOffsetY = e.clientY - rect.top;
                            
                            document.addEventListener('mousemove', handleDrag);
                            document.addEventListener('mouseup', stopDrag);
                        });
                        
                        const handleDrag = e => {
                            if (!isDragging) return;
                            
                            const x = e.clientX - dragOffsetX;
                            const y = e.clientY - dragOffsetY;
                            
                            panel.style.left = `${x}px`;
                            panel.style.top = `${y}px`;
                            panel.style.right = 'auto';
                        };
                        
                        const stopDrag = () => {
                            isDragging = false;
                            document.removeEventListener('mousemove', handleDrag);
                            document.removeEventListener('mouseup', stopDrag);
                        };
                        
                        // Store references
                        components.pageControls.element = panel;
                        components.pageControls.progressElement = {
                            indicator: progressIndicator,
                            percentage: progressText.querySelector('.progress-percentage'),
                            pauseButton: pauseBtn,
                            stopButton: stopBtn,
                            restoreButton: restoreBtn
                        };
                        components.pageControls.statusElement = statusElement;
                        components.pageControls.statsElement = statsElement;
                        
                        document.body.appendChild(panel);
                    }
                    
                    return components.pageControls.element;
                },
                
                setupStateSubscriptions: () => {
                    // Clear any previous subscriptions
                    if (components.pageControls.stateManager) {
                        components.pageControls.stateManager.cleanup();
                    }
                    
                    // Create new state manager for this component
                    const stateManager = State.registerComponent('pageControls');
                    components.pageControls.stateManager = stateManager;
                    
                    // Subscribe to translation paused state
                    stateManager.subscribe('isTranslationPaused', isPaused => {
                        const { pauseButton } = components.pageControls.progressElement;
                        const statusElement = components.pageControls.statusElement;
                        
                        // Only update if translation is in progress
                        if (State.get('isTranslatingFullPage')) {
                            if (isPaused) {
                                pauseButton.textContent = '继续';
                                statusElement.textContent = '翻译已暂停';
                            } else {
                                pauseButton.textContent = '暂停';
                                
                                const index = State.get('lastTranslatedIndex');
                                const segments = State.get('translationSegments');
                                if (segments && segments.length > 0) {
                                    statusElement.textContent = `正在翻译 (${index + 1}/${segments.length})`;
                                    
                                    // If paused, resume translation
                                    if (index >= 0 && index < segments.length - 1) {
                                        Core.translateNextSegment(index + 1);
                                    }
                                }
                            }
                        } else {
                            // Translation is not in progress, ensure button is in correct state
                            pauseButton.disabled = true;
                            pauseButton.textContent = '暂停';
                        }
                    });
                    
                    // Subscribe to translation progress
                    stateManager.subscribe('lastTranslatedIndex', index => {
                        const segments = State.get('translationSegments');
                        if (!segments || segments.length === 0) return;
                        
                        // 精确计算已翻译的段落，确保包括所有已处理的段落
                        const translatedCount = segments.filter(s => s.translation || s.error).length;
                        
                        // 如果翻译已经完成，强制显示100%
                        let progress, percent;
                        if (!State.get('isTranslatingFullPage') && !State.get('isTranslationPaused')) {
                            // 翻译已完成状态，显示100%
                            progress = 1;
                            percent = 100;
                        } else {
                            // 正常计算进度
                            progress = translatedCount / segments.length;
                            percent = Math.round(progress * 100);
                        }
                        
                        // Update progress bar
                        const { indicator, percentage } = components.pageControls.progressElement;
                        indicator.style.width = `${percent}%`;
                        percentage.textContent = `${percent}% (${translatedCount}/${segments.length})`;
                        
                        // Update status text based on translated count
                        if (!State.get('isTranslationPaused')) {
                            if (!State.get('isTranslatingFullPage')) {
                                components.pageControls.statusElement.textContent = `翻译完成`;
                            } else {
                                components.pageControls.statusElement.textContent = `正在翻译 (${translatedCount}/${segments.length})`;
                            }
                        }
                        
                        // Update stats
                        components.pageControls.updateStats(segments);
                    });
                    
                    // Subscribe to translation state changes
                    stateManager.subscribe('isTranslatingFullPage', isTranslating => {
                        const { pauseButton, stopButton, restoreButton } = components.pageControls.progressElement;
                        const statusElement = components.pageControls.statusElement;
                        const controlsPanel = components.pageControls.element;
                        
                        if (!controlsPanel) return; // Safety check
                        
                        const retranslateBtn = controlsPanel.querySelector('button[title="忽略缓存，重新翻译整个页面"]');
                        
                        // Update button states
                        pauseButton.disabled = !isTranslating;
                        stopButton.disabled = !isTranslating;
                        if (retranslateBtn) {
                            retranslateBtn.disabled = isTranslating;
                            retranslateBtn.style.opacity = isTranslating ? '0.5' : '1';
                        }
                        
                        // If stopping/completing translation
                        if (!isTranslating) {
                            pauseButton.disabled = true;
                            stopButton.disabled = true;
                            restoreButton.disabled = false;
                            
                            // Reset pause state when translation completes
                            if (State.get('isTranslationPaused')) {
                                State.set('isTranslationPaused', false);
                            }
                            
                            if (State.get('isStopped')) {
                                statusElement.textContent = '翻译已停止';
                            } else {
                                statusElement.textContent = '翻译完成';
                                statusElement.style.color = '#4CAF50';
                            }
                            
                            // Final stats update
                            const segments = State.get('translationSegments');
                            if (segments && segments.length > 0) {
                                components.pageControls.updateStats(segments);
                            }
                        }
                    });
                    
                    // Subscribe to showing translation state
                    stateManager.subscribe('isShowingTranslation', isShowing => {
                        const { restoreButton } = components.pageControls.progressElement;
                        restoreButton.textContent = isShowing ? '恢复原文' : '显示译文';
                    });
                    
                    // Subscribe to stopped state
                    stateManager.subscribe('isStopped', isStopped => {
                        if (isStopped) {
                            components.pageControls.statusElement.textContent = '翻译已停止';
                            components.pageControls.statusElement.style.color = '';
                        }
                    });
                    
                    // Subscribe to API delay changes
                    stateManager.subscribe('apiDelay', delay => {
                        if (delay > 0) {
                            const delaySeconds = (delay / 1000).toFixed(1);
                            components.pageControls.statusElement.textContent = 
                                `延迟增加至${delaySeconds}秒（API限流保护）`;
                        }
                    });
                },
                
                show: () => {
                    const panel = components.pageControls.create();
                    panel.style.display = 'flex';
                    
                    // Reset progress UI elements
                    const statusElement = components.pageControls.statusElement;
                    statusElement.style.display = 'block';
                    statusElement.textContent = '准备翻译...';
                    statusElement.style.color = '';
                    
                    // Reset progress bar
                    const { indicator, percentage, pauseButton, stopButton } = components.pageControls.progressElement;
                    indicator.style.width = '0%';
                    percentage.textContent = '0% (0/0)';
                    
                    // Reset pause and stop button states
                    pauseButton.textContent = '暂停';
                    pauseButton.disabled = false;
                    stopButton.disabled = false;
                    
                    // Clear stats
                    if (components.pageControls.statsElement) {
                        components.pageControls.statsElement.textContent = '';
                    }
                    
                    // Set up state subscriptions
                    components.pageControls.setupStateSubscriptions();
                    
                    // Reset translation states in the UI
                    State.set('isShowingTranslation', true);
                },
                
                hide: () => {
                    if (components.pageControls.element) {
                        components.pageControls.element.style.display = 'none';
                        
                        // Clean up subscriptions to prevent memory leaks
                        if (components.pageControls.stateManager) {
                            components.pageControls.stateManager.cleanup();
                        }
                    }
                },
                
                updateStats: segments => {
                    if (!components.pageControls.statsElement) return;
                    
                    // Count successes, errors, and pending
                    let success = 0;
                    let error = 0;
                    let pending = 0;
                    let cached = 0;
                    
                    segments.forEach(segment => {
                        if (segment.translation && !segment.error) {
                            if (segment.fromCache) {
                                cached++;
                            } else {
                                success++;
                            }
                        } else if (segment.error) {
                            error++;
                        } else {
                            // 段落无翻译也无错误时，视为等待中
                            if (State.get('isTranslatingFullPage') && !State.get('isStopped')) {
                                pending++;
                            }
                        }
                    });
                    
                    // 确保显示总数的准确性
                    const total = success + cached + error + pending;
                    
                    // Only show non-zero values
                    let stats = [];
                    if (success) stats.push(`${success} 翻译成功`);
                    if (cached) stats.push(`${cached} 来自缓存`);
                    if (error) stats.push(`${error} 失败`);
                    if (pending) stats.push(`${pending} 等待中`);
                    
                    // 添加完成比例
                    if (segments.length > 0) {
                        const completedPercent = Math.round((success + cached + error) / segments.length * 100);
                        stats.push(`总完成率 ${completedPercent}%`);
                    }
                    
                    // If translation is complete/stopped but no stats, show a default message
                    if (stats.length === 0 && !State.get('isTranslatingFullPage')) {
                        stats.push('翻译已完成');
                    }
                    
                    components.pageControls.statsElement.textContent = stats.join(' · ');
                }
            },
            
            settingsPanel: {
                element: null,
                apiForm: null,
                
                create: () => {
                    if (!components.settingsPanel.element) {
                        // Create panel
                        const panel = document.createElement('div');
                        panel.className = 'translator-settings-panel';
                        panel.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 500px;
                            max-width: 90%;
                            background: white;
                            box-shadow: 0 0 20px rgba(0,0,0,0.3);
                            border-radius: 8px;
                            z-index: 10000;
                            font-family: Arial, sans-serif;
                            display: none;
                            flex-direction: column;
                            max-height: 90vh;
                            overflow: hidden;
                        `;
                        
                        // Create tabs
                        const tabsContainer = document.createElement('div');
                        tabsContainer.style.cssText = 'display: flex; border-bottom: 1px solid #eee;';
                        
                        const generalTab = document.createElement('button');
                        generalTab.textContent = '翻译设置';
                        generalTab.dataset.tab = 'general';
                        generalTab.style.cssText = 'flex: 1; padding: 12px; border: none; background: none; cursor: pointer; border-bottom: 2px solid #4285f4; color: #4285f4;';
                        
                        const apiTab = document.createElement('button');
                        apiTab.textContent = 'API 管理';
                        apiTab.dataset.tab = 'api';
                        apiTab.style.cssText = 'flex: 1; padding: 12px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent;';
                        
                        tabsContainer.appendChild(generalTab);
                        tabsContainer.appendChild(apiTab);
                        panel.appendChild(tabsContainer);
                        
                        // Create content container
                        const contentContainer = document.createElement('div');
                        contentContainer.style.cssText = 'flex: 1; overflow-y: auto;';
                        
                        // Create general settings content
                        const generalContent = document.createElement('div');
                        generalContent.dataset.tabContent = 'general';
                        generalContent.style.cssText = 'display: block; padding: 20px;';
                        
                        generalContent.innerHTML = `
                            <h3 style="margin-top: 0; margin-bottom: 15px;">通用设置</h3>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">系统提示词：</label>
                                <textarea id="setting-systemPrompt" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;"></textarea>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">用于指导翻译模型如何翻译文本</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">单词解释提示词：</label>
                                <textarea id="setting-wordExplanationPrompt" style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;"></textarea>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">用于指导如何解释单词或短语</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" id="setting-showSourceLanguage">
                                    <span style="margin-left: 8px;">显示原文</span>
                                </label>
                                <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 24px;">启用后将在翻译结果上方显示原文</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" id="setting-useStreaming">
                                    <span style="margin-left: 8px;">启用流式响应（实时显示翻译）</span>
                                </label>
                                <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 24px;">如果遇到翻译失败问题，可以尝试关闭此选项</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" id="setting-useTranslationContext">
                                    <span style="margin-left: 8px;">启用翻译上下文</span>
                                </label>
                                <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 24px;">启用后将使用之前翻译过的内容作为上下文，提高翻译连贯性</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">上下文数量：</label>
                                <input type="number" id="setting-contextSize" min="1" max="10" style="width: 60px; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">使用前面已翻译段落作为上下文提升翻译连贯性，建议设置1-5之间</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">随机性（Temperature）：</label>
                                <div style="display: flex; align-items: center;">
                                    <input type="range" id="setting-temperature" min="0" max="1" step="0.1" style="flex: 1;">
                                    <span id="temperature-value" style="margin-left: 10px; min-width: 30px; text-align: right;"></span>
                                </div>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">值越低翻译越准确，值越高结果越有创意</div>
                            </div>
                            
                            <h3 style="margin-top: 25px; margin-bottom: 15px;">整页翻译设置</h3>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: flex; align-items: center;">
                                    <input type="checkbox" id="setting-detectArticleContent">
                                    <span style="margin-left: 8px;">智能识别文章主体内容</span>
                                </label>
                                <div style="font-size: 12px; color: #666; margin-top: 5px; margin-left: 24px;">启用后将自动识别文章主要内容区域，避免翻译无关内容</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">整页翻译选择器：</label>
                                <input type="text" id="setting-fullPageTranslationSelector" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">CSS选择器，用于指定翻译哪些区域的内容</div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">排除翻译的元素：</label>
                                <input type="text" id="setting-excludeSelectors" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">CSS选择器，指定要排除翻译的元素</div>
                            </div>
                        `;
                        
                        // Create API settings content
                        const apiContent = document.createElement('div');
                        apiContent.dataset.tabContent = 'api';
                        apiContent.style.cssText = 'display: none; padding: 20px;';
                        apiContent.innerHTML = '<h3 style="margin-top: 0;">API 设置</h3>';
                        
                        // Create API list container
                        const apiListContainer = document.createElement('div');
                        apiListContainer.id = 'api-list-container';
                        
                        // Create "Add API" button
                        const addApiButton = document.createElement('button');
                        addApiButton.textContent = '+ 添加新API';
                        addApiButton.style.cssText = 'width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 15px;';
                        addApiButton.addEventListener('click', () => {
                            components.settingsPanel.showApiForm();
                        });
                        
                        apiContent.appendChild(addApiButton);
                        apiContent.appendChild(apiListContainer);
                        
                        // Add content to container
                        contentContainer.appendChild(generalContent);
                        contentContainer.appendChild(apiContent);
                        panel.appendChild(contentContainer);
                        
                        // Create footer with buttons
                        const footer = document.createElement('div');
                        footer.style.cssText = 'padding: 15px 20px; border-top: 1px solid #eee; text-align: right;';
                        
                        const cancelButton = document.createElement('button');
                        cancelButton.textContent = '取消';
                        cancelButton.style.cssText = 'margin-right: 10px; padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;';
                        cancelButton.addEventListener('click', () => {
                            components.settingsPanel.hide();
                        });
                        
                        const saveButton = document.createElement('button');
                        saveButton.textContent = '保存';
                        saveButton.style.cssText = 'padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;';
                        saveButton.addEventListener('click', () => {
                            // Get form values from general tab
                            const newSettings = {
                                systemPrompt: generalContent.querySelector('#setting-systemPrompt').value,
                                wordExplanationPrompt: generalContent.querySelector('#setting-wordExplanationPrompt').value,
                                showSourceLanguage: generalContent.querySelector('#setting-showSourceLanguage').checked,
                                useStreaming: generalContent.querySelector('#setting-useStreaming').checked,
                                useTranslationContext: generalContent.querySelector('#setting-useTranslationContext').checked,
                                contextSize: parseInt(generalContent.querySelector('#setting-contextSize').value) || 3,
                                temperature: parseFloat(generalContent.querySelector('#setting-temperature').value),
                                detectArticleContent: generalContent.querySelector('#setting-detectArticleContent').checked,
                                fullPageTranslationSelector: generalContent.querySelector('#setting-fullPageTranslationSelector').value,
                                excludeSelectors: generalContent.querySelector('#setting-excludeSelectors').value
                            };
                            
                            // Update settings
                            Config.updateSettings(newSettings);
                            
                            // Sync API settings if needed
                            Config.syncApiSettings();
                            
                            // Hide panel
                            components.settingsPanel.hide();
                        });
                        
                        footer.appendChild(cancelButton);
                        footer.appendChild(saveButton);
                        panel.appendChild(footer);
                        
                        // Add tab switching event listeners
                        [generalTab, apiTab].forEach(tab => {
                            tab.addEventListener('click', () => {
                                const tabName = tab.dataset.tab;
                                
                                // Update tab styling
                                [generalTab, apiTab].forEach(t => {
                                    if (t.dataset.tab === tabName) {
                                        t.style.borderBottom = '2px solid #4285f4';
                                        t.style.color = '#4285f4';
                                    } else {
                                        t.style.borderBottom = '2px solid transparent';
                                        t.style.color = 'inherit';
                                    }
                                });
                                
                                // Show/hide content
                                contentContainer.querySelectorAll('[data-tab-content]').forEach(content => {
                                    if (content.dataset.tabContent === tabName) {
                                        content.style.display = 'block';
                                    } else {
                                        content.style.display = 'none';
                                    }
                                });
                                
                                // Update API list if showing API tab
                                if (tabName === 'api') {
                                    components.settingsPanel.updateApiList();
                                }
                            });
                        });
                        
                        // Temperature slider
                        const temperatureSlider = generalContent.querySelector('#setting-temperature');
                        const temperatureValue = generalContent.querySelector('#temperature-value');
                        temperatureSlider.addEventListener('input', () => {
                            temperatureValue.textContent = temperatureSlider.value;
                        });
                        
                        // Store reference
                        components.settingsPanel.element = panel;
                        document.body.appendChild(panel);
                    }
                    
                    return components.settingsPanel.element;
                },
                
                createApiForm: () => {
                    if (!components.settingsPanel.apiForm) {
                        const form = document.createElement('div');
                        form.className = 'api-form';
                        form.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: white;
                            z-index: 1;
                            display: none;
                            flex-direction: column;
                        `;
                        
                        // Form header
                        const header = document.createElement('div');
                        header.style.cssText = 'padding: 15px 20px; border-bottom: 1px solid #eee;';
                        
                        const title = document.createElement('h3');
                        title.id = 'api-form-title';
                        title.textContent = '添加API';
                        title.style.margin = '0';
                        
                        header.appendChild(title);
                        form.appendChild(header);
                        
                        // Form content
                        const content = document.createElement('div');
                        content.style.cssText = 'flex: 1; overflow-y: auto; padding: 20px;';
                        
                        // Hidden index field for editing
                        const indexField = document.createElement('input');
                        indexField.type = 'hidden';
                        indexField.id = 'api-form-index';
                        indexField.value = '-1';
                        
                        // Form fields
                        content.innerHTML = `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">API 名称：</label>
                                <input type="text" id="api-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="例如：OpenAI、Azure、DeepSeek">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">API 端点：</label>
                                <input type="text" id="api-endpoint" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="例如：https://api.openai.com/v1/chat/completions">
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">API 密钥：</label>
                                <input type="password" id="api-key" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="输入您的API密钥">
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">编辑现有API时，如不需要修改密钥请留空</div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">模型名称：</label>
                                <input type="text" id="api-model" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="例如：gpt-3.5-turbo">
                            </div>
                        `;
                        
                        content.insertBefore(indexField, content.firstChild);
                        form.appendChild(content);
                        
                        // Form footer
                        const footer = document.createElement('div');
                        footer.style.cssText = 'padding: 15px 20px; border-top: 1px solid #eee; text-align: right;';
                        
                        const cancelButton = document.createElement('button');
                        cancelButton.textContent = '取消';
                        cancelButton.style.cssText = 'margin-right: 10px; padding: 8px 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;';
                        cancelButton.addEventListener('click', () => {
                            components.settingsPanel.hideApiForm();
                        });
                        
                        const saveButton = document.createElement('button');
                        saveButton.textContent = '保存';
                        saveButton.style.cssText = 'padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;';
                        saveButton.addEventListener('click', () => {
                            // Get form values
                            const index = parseInt(indexField.value);
                            const name = content.querySelector('#api-name').value.trim();
                            const endpoint = content.querySelector('#api-endpoint').value.trim();
                            const key = content.querySelector('#api-key').value.trim();
                            const model = content.querySelector('#api-model').value.trim();
                            
                            // Validate inputs
                            if (!name || !endpoint || !model) {
                                alert('请填写所有必填字段');
                                return;
                            }
                            
                            // Get current API configs
                            const apiConfigs = Config.getSetting('apiConfigs');
                            
                            // Create new API config
                            const apiConfig = {
                                name,
                                apiEndpoint: endpoint,
                                model
                            };
                            
                            // Only update API key if provided
                            if (key) {
                                apiConfig.apiKey = key;
                            } else if (index !== -1) {
                                // Keep existing key when editing
                                apiConfig.apiKey = apiConfigs[index].apiKey;
                            } else {
                                // New API must have a key
                                alert('请提供API密钥');
                                return;
                            }
                            
                            // Add or update API config
                            if (index === -1) {
                                // Add new API
                                apiConfigs.push(apiConfig);
                            } else {
                                // Update existing API
                                apiConfigs[index] = apiConfig;
                            }
                            
                            // Update settings
                            Config.updateSetting('apiConfigs', apiConfigs);
                            
                            // Hide form
                            components.settingsPanel.hideApiForm();
                            
                            // Update API list
                            components.settingsPanel.updateApiList();
                        });
                        
                        footer.appendChild(cancelButton);
                        footer.appendChild(saveButton);
                        form.appendChild(footer);
                        
                        // Store reference
                        components.settingsPanel.apiForm = form;
                        components.settingsPanel.element.appendChild(form);
                    }
                    
                    return components.settingsPanel.apiForm;
                },
                
                show: () => {
                    const panel = components.settingsPanel.create();
                    
                    // Get current settings
                    const settings = Config.getSettings();
                    
                    // Update general settings form
                    const generalContent = panel.querySelector('[data-tab-content="general"]');
                    
                    generalContent.querySelector('#setting-systemPrompt').value = settings.systemPrompt;
                    generalContent.querySelector('#setting-wordExplanationPrompt').value = settings.wordExplanationPrompt;
                    generalContent.querySelector('#setting-showSourceLanguage').checked = settings.showSourceLanguage;
                    generalContent.querySelector('#setting-useStreaming').checked = settings.useStreaming;
                    generalContent.querySelector('#setting-useTranslationContext').checked = settings.useTranslationContext;
                    generalContent.querySelector('#setting-contextSize').value = settings.contextSize;
                    generalContent.querySelector('#setting-temperature').value = settings.temperature;
                    generalContent.querySelector('#temperature-value').textContent = settings.temperature;
                    generalContent.querySelector('#setting-detectArticleContent').checked = settings.detectArticleContent;
                    generalContent.querySelector('#setting-fullPageTranslationSelector').value = settings.fullPageTranslationSelector;
                    generalContent.querySelector('#setting-excludeSelectors').value = settings.excludeSelectors;
                    
                    // Update API list
                    components.settingsPanel.updateApiList();
                    
                    // Show panel
                    panel.style.display = 'flex';
                },
                
                hide: () => {
                    if (components.settingsPanel.element) {
                        components.settingsPanel.element.style.display = 'none';
                    }
                    
                    // Also hide API form if open
                    components.settingsPanel.hideApiForm();
                },
                
                showApiForm: (editIndex = -1) => {
                    // Create API form if it doesn't exist
                    const form = components.settingsPanel.createApiForm();
                    
                    // Set form title
                    const title = form.querySelector('#api-form-title');
                    title.textContent = editIndex === -1 ? '添加API' : '编辑API';
                    
                    // Set hidden index field
                    const indexField = form.querySelector('#api-form-index');
                    indexField.value = editIndex;
                    
                    // Clear form fields
                    form.querySelector('#api-name').value = '';
                    form.querySelector('#api-endpoint').value = '';
                    form.querySelector('#api-key').value = '';
                    form.querySelector('#api-model').value = '';
                    
                    // Fill form fields if editing
                    if (editIndex !== -1) {
                        const apiConfigs = Config.getSetting('apiConfigs');
                        const api = apiConfigs[editIndex];
                        
                        form.querySelector('#api-name').value = api.name;
                        form.querySelector('#api-endpoint').value = api.apiEndpoint;
                        form.querySelector('#api-model').value = api.model;
                    }
                    
                    // Show form
                    form.style.display = 'flex';
                },
                
                hideApiForm: () => {
                    if (components.settingsPanel.apiForm) {
                        components.settingsPanel.apiForm.style.display = 'none';
                    }
                },
                
                updateApiList: () => {
                    const panel = components.settingsPanel.element;
                    if (!panel) return;
                    
                    const apiListContainer = panel.querySelector('#api-list-container');
                    if (!apiListContainer) return;
                    
                    // Clear existing content
                    apiListContainer.innerHTML = '';
                    
                    // Get API configs
                    const apiConfigs = Config.getSetting('apiConfigs');
                    const currentApiIndex = Config.getSetting('currentApiIndex');
                    
                    // No APIs
                    if (apiConfigs.length === 0) {
                        apiListContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">暂无API配置</div>';
                        return;
                    }
                    
                    // Create API items
                    apiConfigs.forEach((api, index) => {
                        const isActive = index === currentApiIndex;
                        
                        const item = document.createElement('div');
                        item.className = 'api-item';
                        item.style.cssText = `
                            margin-bottom: 15px;
                            padding: 15px;
                            border: 1px solid ${isActive ? '#4285f4' : '#ddd'};
                            border-radius: 4px;
                            position: relative;
                            background-color: ${isActive ? '#f0f8ff' : 'white'};
                        `;
                        
                        // API info
                        item.innerHTML = `
                            <div style="margin-bottom: 8px;"><strong>名称：</strong> <span>${api.name}</span></div>
                            <div style="margin-bottom: 8px;"><strong>端点：</strong> <span>${api.apiEndpoint}</span></div>
                            <div style="margin-bottom: 8px;"><strong>密钥：</strong> <span>${api.apiKey ? '******' + api.apiKey.substring(api.apiKey.length - 4) : '未设置'}</span></div>
                            <div><strong>模型：</strong> <span>${api.model}</span></div>
                        `;
                        
                        // Buttons container
                        const buttons = document.createElement('div');
                        buttons.style.cssText = 'position: absolute; top: 15px; right: 15px;';
                        
                        // Add button for setting as active (if not already active)
                        if (!isActive) {
                            const useButton = document.createElement('button');
                            useButton.textContent = '使用';
                            useButton.style.cssText = 'margin-right: 8px; padding: 4px 8px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;';
                            useButton.addEventListener('click', () => {
                                Config.updateSetting('currentApiIndex', index);
                                Config.syncApiSettings();
                                components.settingsPanel.updateApiList();
                            });
                            buttons.appendChild(useButton);
                        } else {
                            const activeLabel = document.createElement('span');
                            activeLabel.textContent = '✓ 当前使用';
                            activeLabel.style.cssText = 'color: #4CAF50; font-weight: 500; margin-right: 8px;';
                            buttons.appendChild(activeLabel);
                        }
                        
                        // Edit button
                        const editButton = document.createElement('button');
                        editButton.textContent = '编辑';
                        editButton.style.cssText = 'margin-right: 8px; padding: 4px 8px; background-color: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;';
                        editButton.addEventListener('click', () => {
                            components.settingsPanel.showApiForm(index);
                        });
                        buttons.appendChild(editButton);
                        
                        // Delete button (only if there are multiple APIs)
                        if (apiConfigs.length > 1) {
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = '删除';
                            deleteButton.style.cssText = 'padding: 4px 8px; background-color: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;';
                            deleteButton.addEventListener('click', () => {
                                if (confirm('确定要删除此API配置吗？')) {
                                    // Remove API config
                                    apiConfigs.splice(index, 1);
                                    
                                    // Update current index if needed
                                    if (currentApiIndex >= apiConfigs.length) {
                                        Config.updateSetting('currentApiIndex', apiConfigs.length - 1);
                                    } else if (index === currentApiIndex) {
                                        Config.updateSetting('currentApiIndex', 0);
                                    }
                                    
                                    // Update settings
                                    Config.updateSetting('apiConfigs', apiConfigs);
                                    Config.syncApiSettings();
                                    
                                    // Update API list
                                    components.settingsPanel.updateApiList();
                                }
                            });
                            buttons.appendChild(deleteButton);
                        }
                        
                        item.appendChild(buttons);
                        apiListContainer.appendChild(item);
                    });
                }
            },
            
            historyPanel: {
                element: null,
                visible: false,
                
                create: () => {
                    if (!components.historyPanel.element) {
                        // Create panel
                        const panel = document.createElement('div');
                        panel.className = 'translator-history-panel';
                        panel.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 500px;
                            max-width: 90%;
                            max-height: 90vh;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 0 20px rgba(0,0,0,0.3);
                            z-index: 10000;
                            display: none;
                            flex-direction: column;
                            font-family: Arial, sans-serif;
                            overflow: hidden;
                        `;
                        
                        // Header
                        const header = document.createElement('div');
                        header.style.cssText = `
                            padding: 15px;
                            border-bottom: 1px solid #eee;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        `;
                        
                        const title = document.createElement('h3');
                        title.textContent = '翻译历史';
                        title.style.margin = '0';
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.innerHTML = '✖';
                        closeBtn.style.cssText = 'background: none; border: none; font-size: 16px; cursor: pointer;';
                        closeBtn.addEventListener('click', () => components.historyPanel.hide());
                        
                        header.appendChild(title);
                        header.appendChild(closeBtn);
                        panel.appendChild(header);
                        
                        // Content
                        const content = document.createElement('div');
                        content.className = 'history-items';
                        content.style.cssText = 'flex: 1; overflow-y: auto; padding: 0 15px; max-height: 70vh;';
                        panel.appendChild(content);
                        
                        // Footer
                        const footer = document.createElement('div');
                        footer.style.cssText = 'padding: 10px 15px; border-top: 1px solid #eee; text-align: right;';
                        
                        const clearBtn = document.createElement('button');
                        clearBtn.textContent = '清空历史';
                        clearBtn.style.cssText = 'padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
                        clearBtn.addEventListener('click', () => {
                            if (confirm('确定要清空所有历史记录吗？')) {
                                Core.historyManager.clear();
                                components.historyPanel.update();
                            }
                        });
                        
                        footer.appendChild(clearBtn);
                        panel.appendChild(footer);
                        
                        // Add to document
                        document.body.appendChild(panel);
                        components.historyPanel.element = panel;
                    }
                    
                    return components.historyPanel.element;
                },
                
                show: () => {
                    const panel = components.historyPanel.create();
                    components.historyPanel.update();
                    panel.style.display = 'flex';
                    components.historyPanel.visible = true;
                },
                
                hide: () => {
                    if (components.historyPanel.element) {
                        components.historyPanel.element.style.display = 'none';
                        components.historyPanel.visible = false;
                    }
                },
                
                isVisible: () => components.historyPanel.visible,
                
                update: () => {
                    const panel = components.historyPanel.element;
                    if (!panel) return;
                    
                    const content = panel.querySelector('.history-items');
                    if (!content) return;
                    
                    // Clear content
                    content.innerHTML = '';
                    
                    // Get history
                    const history = State.get('translationHistory');
                    
                    if (history.length === 0) {
                        content.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">暂无历史记录</div>';
                        return;
                    }
                    
                    // Create items in reverse order (newest first)
                    for (let i = history.length - 1; i >= 0; i--) {
                        const item = history[i];
                        const date = new Date(item.timestamp);
                        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                        
                        const historyItem = document.createElement('div');
                        historyItem.className = 'history-item';
                        historyItem.style.cssText = 'padding: 15px 0; border-bottom: 1px solid #eee; position: relative;';
                        
                        historyItem.innerHTML = `
                            <div style="color: #999; font-size: 12px; margin-bottom: 5px;">${dateStr}</div>
                            <div style="margin-bottom: 8px; font-weight: bold;">${item.source}</div>
                            <div>${item.translation}</div>
                        `;
                        
                        // Add to favorites button
                        const favButton = document.createElement('button');
                        favButton.innerHTML = '⭐';
                        favButton.title = '添加到收藏';
                        favButton.style.cssText = 'position: absolute; top: 15px; right: 0; background: none; border: none; font-size: 16px; cursor: pointer;';
                        favButton.addEventListener('click', () => {
                            Core.favoritesManager.add(item.source, item.translation);
                            favButton.innerHTML = '✓';
                            setTimeout(() => { favButton.innerHTML = '⭐'; }, 1000);
                        });
                        
                        historyItem.appendChild(favButton);
                        content.appendChild(historyItem);
                    }
                }
            },
            
            favoritesPanel: {
                element: null,
                visible: false,
                
                create: () => {
                    if (!components.favoritesPanel.element) {
                        // Create panel
                        const panel = document.createElement('div');
                        panel.className = 'translator-favorites-panel';
                        panel.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 500px;
                            max-width: 90%;
                            max-height: 90vh;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 0 20px rgba(0,0,0,0.3);
                            z-index: 10000;
                            display: none;
                            flex-direction: column;
                            font-family: Arial, sans-serif;
                            overflow: hidden;
                        `;
                        
                        // Header
                        const header = document.createElement('div');
                        header.style.cssText = `
                            padding: 15px;
                            border-bottom: 1px solid #eee;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        `;
                        
                        const title = document.createElement('h3');
                        title.textContent = '收藏夹';
                        title.style.margin = '0';
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.innerHTML = '✖';
                        closeBtn.style.cssText = 'background: none; border: none; font-size: 16px; cursor: pointer;';
                        closeBtn.addEventListener('click', () => components.favoritesPanel.hide());
                        
                        header.appendChild(title);
                        header.appendChild(closeBtn);
                        panel.appendChild(header);
                        
                        // Content
                        const content = document.createElement('div');
                        content.className = 'favorite-items';
                        content.style.cssText = 'flex: 1; overflow-y: auto; padding: 0 15px; max-height: 70vh;';
                        panel.appendChild(content);
                        
                        // Footer
                        const footer = document.createElement('div');
                        footer.style.cssText = 'padding: 10px 15px; border-top: 1px solid #eee; text-align: right;';
                        
                        const clearBtn = document.createElement('button');
                        clearBtn.textContent = '清空收藏';
                        clearBtn.style.cssText = 'padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
                        clearBtn.addEventListener('click', () => {
                            if (confirm('确定要清空所有收藏吗？')) {
                                Core.favoritesManager.clear();
                                components.favoritesPanel.update();
                            }
                        });
                        
                        footer.appendChild(clearBtn);
                        panel.appendChild(footer);
                        
                        // Add to document
                        document.body.appendChild(panel);
                        components.favoritesPanel.element = panel;
                    }
                    
                    return components.favoritesPanel.element;
                },
                
                show: () => {
                    const panel = components.favoritesPanel.create();
                    components.favoritesPanel.update();
                    panel.style.display = 'flex';
                    components.favoritesPanel.visible = true;
                },
                
                hide: () => {
                    if (components.favoritesPanel.element) {
                        components.favoritesPanel.element.style.display = 'none';
                        components.favoritesPanel.visible = false;
                    }
                },
                
                isVisible: () => components.favoritesPanel.visible,
                
                update: () => {
                    const panel = components.favoritesPanel.element;
                    if (!panel) return;
                    
                    const content = panel.querySelector('.favorite-items');
                    if (!content) return;
                    
                    // Clear content
                    content.innerHTML = '';
                    
                    // Get favorites
                    const favorites = State.get('translationFavorites');
                    
                    if (favorites.length === 0) {
                        content.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">暂无收藏</div>';
                        return;
                    }
                    
                    // Create items in reverse order (newest first)
                    for (let i = favorites.length - 1; i >= 0; i--) {
                        const item = favorites[i];
                        const date = new Date(item.timestamp);
                        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                        
                        const favoriteItem = document.createElement('div');
                        favoriteItem.className = 'favorite-item';
                        favoriteItem.style.cssText = 'padding: 15px 0; border-bottom: 1px solid #eee; position: relative;';
                        
                        favoriteItem.innerHTML = `
                            <div style="color: #999; font-size: 12px; margin-bottom: 5px;">${dateStr}</div>
                            <div style="margin-bottom: 8px; font-weight: bold;">${item.source}</div>
                            <div>${item.translation}</div>
                        `;
                        
                        // Remove from favorites button
                        const removeButton = document.createElement('button');
                        removeButton.innerHTML = '✖';
                        removeButton.title = '移除收藏';
                        removeButton.style.cssText = 'position: absolute; top: 15px; right: 0; background: none; border: none; font-size: 16px; cursor: pointer;';
                        removeButton.addEventListener('click', () => {
                            Core.favoritesManager.remove(item.source);
                            components.favoritesPanel.update();
                        });
                        
                        favoriteItem.appendChild(removeButton);
                        content.appendChild(favoriteItem);
                    }
                }
            },
            
            // Bottom page buttons
            bottomButtons: {
                element: null,
                stateManager: null,
                
                create: () => {
                    if (!components.bottomButtons.element) {
                        // Create container
                        const container = document.createElement('div');
                        container.className = 'translator-bottom-buttons';
                        container.style.cssText = `
                            position: fixed;
                            bottom: 20px;
                            right: 20px;
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            z-index: 9995;
                        `;
                        
                        // Settings button
                        const settingsBtn = document.createElement('button');
                        settingsBtn.innerHTML = '⚙️';
                        settingsBtn.title = '设置';
                        settingsBtn.style.cssText = `
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            background-color: white;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        settingsBtn.addEventListener('click', () => {
                            UI.components.settingsPanel.show();
                        });
                        
                        // History button
                        const historyBtn = document.createElement('button');
                        historyBtn.innerHTML = '📜';
                        historyBtn.title = '翻译历史';
                        historyBtn.style.cssText = `
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            background-color: white;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        historyBtn.addEventListener('click', () => {
                            UI.components.historyPanel.show();
                        });
                        
                        // Favorites button
                        const favoritesBtn = document.createElement('button');
                        favoritesBtn.innerHTML = '⭐';
                        favoritesBtn.title = '收藏夹';
                        favoritesBtn.style.cssText = `
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            background-color: white;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        favoritesBtn.addEventListener('click', () => {
                            UI.components.favoritesPanel.show();
                        });
                        
                        // Translate page button
                        const translatePageBtn = document.createElement('button');
                        translatePageBtn.innerHTML = '🌐';
                        translatePageBtn.title = '翻译整页 (长按重新翻译)';
                        translatePageBtn.style.cssText = `
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            background-color: white;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            border: none;
                            font-size: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        
                        // Track press duration for the long press
                        let pressTimer;
                        let isLongPress = false;
                        
                        translatePageBtn.addEventListener('mousedown', () => {
                            isLongPress = false;
                            pressTimer = setTimeout(() => {
                                isLongPress = true;
                                // Visual feedback
                                translatePageBtn.style.backgroundColor = '#5cb85c';
                                translatePageBtn.style.color = 'white';
                            }, 800); // Long press threshold: 800ms
                        });
                        
                        translatePageBtn.addEventListener('mouseup', () => {
                            clearTimeout(pressTimer);
                            // Reset style if it was changed
                            if (isLongPress) {
                                translatePageBtn.style.backgroundColor = 'white';
                                translatePageBtn.style.color = 'inherit';
                            }
                            
                            if (!State.get('isTranslatingFullPage')) {
                                if (isLongPress) {
                                    // Long press - force re-translation
                                    const segments = State.get('translationSegments');
                                    const hasCachedTranslations = segments && segments.length > 0 && segments.some(s => s.fromCache);
                                    
                                    if (hasCachedTranslations) {
                                        if (confirm('确定要忽略缓存重新翻译整个页面吗？这可能需要更长时间。')) {
                                            Core.translateFullPage({ forceRetranslate: true }).catch(error => {
                                                alert(`翻译整页失败: ${error.message}`);
                                            });
                                        }
                                    } else {
                                        Core.translateFullPage({ forceRetranslate: true }).catch(error => {
                                            alert(`翻译整页失败: ${error.message}`);
                                        });
                                    }
                                } else {
                                    // Normal click - regular translation
                                    Core.translateFullPage().catch(error => {
                                        alert(`翻译整页失败: ${error.message}`);
                                    });
                                }
                            }
                        });
                        
                        // Cancel long press if mouse leaves the button
                        translatePageBtn.addEventListener('mouseout', () => {
                            clearTimeout(pressTimer);
                            // Reset style if needed
                            if (isLongPress) {
                                translatePageBtn.style.backgroundColor = 'white';
                                translatePageBtn.style.color = 'inherit';
                                isLongPress = false;
                            }
                        });
                        
                        // Add buttons to container
                        container.appendChild(translatePageBtn);
                        container.appendChild(historyBtn);
                        container.appendChild(favoritesBtn);
                        container.appendChild(settingsBtn);
                        
                        // Store element references
                        components.bottomButtons.element = container;
                        components.bottomButtons.translateButton = translatePageBtn;
                        
                        // Add to document
                        document.body.appendChild(container);
                    }
                    
                    return components.bottomButtons.element;
                },
                
                setupStateSubscriptions: () => {
                    // Clean up existing subscriptions
                    if (components.bottomButtons.stateManager) {
                        components.bottomButtons.stateManager.cleanup();
                    }
                    
                    // Create state manager for this component
                    const stateManager = State.registerComponent('bottomButtons');
                    components.bottomButtons.stateManager = stateManager;
                    
                    // Subscribe to translation state
                    stateManager.subscribe('isTranslatingFullPage', isTranslating => {
                        const translateBtn = components.bottomButtons.translateButton;
                        if (translateBtn) {
                            translateBtn.disabled = isTranslating;
                            translateBtn.style.opacity = isTranslating ? '0.5' : '1';
                            translateBtn.style.cursor = isTranslating ? 'not-allowed' : 'pointer';
                        }
                    });
                },
                
                show: () => {
                    const buttons = components.bottomButtons.create();
                    buttons.style.display = 'flex';
                    
                    // Set up state subscriptions
                    components.bottomButtons.setupStateSubscriptions();
                },
                
                hide: () => {
                    if (components.bottomButtons.element) {
                        components.bottomButtons.element.style.display = 'none';
                        
                        // Clean up subscriptions
                        if (components.bottomButtons.stateManager) {
                            components.bottomButtons.stateManager.cleanup();
                        }
                    }
                }
            }
        };
        
        // Initialize UI
        const init = () => {
            // Setup selection event listeners
            document.addEventListener('mouseup', (e) => {
                // Don't show translate button if clicked in a popup
                if (e.target.closest('.translation-popup')) {
                    return;
                }
                
                // Get selected text
                const selection = window.getSelection();
                const text = selection.toString().trim();
                
                // Hide translate button if no text is selected
                if (text.length === 0) {
                    components.translateButton.hide();
                    return;
                }
                
                // Get selection rectangle
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                // Update state
                State.set('lastSelectedText', text);
                State.set('lastSelectionRect', rect);
                
                // Show translate button
                components.translateButton.show(rect);
            });
            
            // Hide translate button when clicking outside
            document.addEventListener('mousedown', (e) => {
                // Don't hide if clicked on translate button or popup
                if (e.target.closest('.translate-button') || e.target.closest('.translation-popup')) {
                    return;
                }
                
                components.translateButton.hide();
            });
            
            // Show bottom buttons
            components.bottomButtons.show();
        };
        
        return {
            init,
            components
        };
    })();

    /**
     * Utils Module - Utility functions
     */
    const Utils = (function() {
        // Language detection
        const detectLanguage = (text) => {
                const chineseRegex = /[\u4e00-\u9fa5]/;
                const englishRegex = /[a-zA-ZàâäéèêëîïôöùûüÿçœæäöüßÄÖÜáéíóúñ]/;
                const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
                const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF]/;

                if (chineseRegex.test(text)) return '中文';
                else if (englishRegex.test(text)) return '欧语' ;
                else if (japaneseRegex.test(text)) return '日语' ;
                else if (koreanRegex.test(text)) return '韩语' ;
                else return('未知');
        };
        
        // HTML utilities
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        const decodeHtmlEntities = (text) => {
            const div = document.createElement('div');
            div.innerHTML = text;
            return div.textContent;
        };
        
        // Text processing utilities
        const isShortPhrase = (text) => {
            // Check if the text is a short English phrase (for word explanation mode)
            const trimmedText = text.trim();
            const words = trimmedText.split(/\s+/);

            const lang = detectLanguage(text)

            if (lang == "欧语" || lang == "未知"){
                return (
                    
                    words.length <= 5 && 
                    trimmedText.length < 30
                );
            }else if(lang == "日语" || lang == "韩语"){
                return (
                    trimmedText.length < 15
                );
            }
            
            // Short phrase has at most 5 words and is less than 30 characters
          
        };
        
        // Text node extraction for page content
        const extractTextNodesFromElement = (element, textSegments = [], depth = 0, excludeSelectors = null) => {
            // Skip if element is null or invalid
            if (!element) return textSegments;
            
            // Skip excluded elements
            if (excludeSelectors && element.matches && element.matches(excludeSelectors)) {
                return textSegments;
            }
            
            try {
                // For element nodes
                if (element.nodeType === Node.ELEMENT_NODE) {
                    // Skip hidden elements and non-content elements
                    try {
                        const style = window.getComputedStyle(element);
                        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                            return textSegments;
                        }
                    } catch (e) {
                        // Ignore style errors
                    }
                    
                    // Skip script, style, and other non-content elements
                    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) {
                        return textSegments;
                    }
                    
                    // Special handling for headings to keep their structure
                    if (/^H[1-6]$/.test(element.tagName) && element.textContent.trim()) {
                        textSegments.push({
                            node: element,
                            text: element.textContent.trim(),
                            depth: depth,
                            isHeading: true,
                            element: element
                        });
                        return textSegments;
                    }
                    
                    // Process paragraphs and blocks that contain simple content
                    // Check if this is a simple text block with basic formatting
                    if (['P', 'DIV', 'LI', 'TD', 'SPAN'].includes(element.tagName) && 
                        element.textContent.trim() && 
                        !element.querySelector('div, p, section, article, h1, h2, h3, h4, h5, h6, ul, ol, table, img, figure')) {
                        
                        textSegments.push({
                            node: element,
                            text: element.textContent.trim(),
                            depth: depth,
                            isFormattedElement: true,
                            element: element
                        });
                        return textSegments;
                    }
                    
                    // Process img elements - skip img elements completely
                    if (element.tagName === 'IMG') {
                        return textSegments;
                    }
                    
                    // Recursively process all child nodes
                    for (let i = 0; i < element.childNodes.length; i++) {
                        const child = element.childNodes[i];
                        extractTextNodesFromElement(child, textSegments, depth + 1, excludeSelectors);
                    }
                }
                // Process text nodes
                else if (element.nodeType === Node.TEXT_NODE) {
                    const text = element.textContent.trim();
                    if (text) {
                        textSegments.push({
                            node: element,
                            text: text,
                            depth: depth,
                            parent: element.parentElement
                        });
                    }
                }
            } catch (error) {
                console.warn("Error processing element:", error);
            }
            
            return textSegments;
        };
        
        // Merge text segments into manageable chunks
        const mergeTextSegments = (textSegments, maxLength = 2000) => {
            if (!textSegments || textSegments.length === 0) {
                return [];
            }
            
            const merged = [];
            let currentSegment = {
                nodes: [],
                text: '',
                translation: null,
                error: null
            };
            
            // Sort segments by document position when possible
            textSegments.sort((a, b) => {
                // If both are regular nodes, compare document position
                if (a.node && b.node && !a.isHeading && !b.isHeading && !a.isFormattedElement && !b.isFormattedElement) {
                    return a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
                }
                // Special handling for headings and formatted elements - preserve their order
                return 0;
            });
            
            for (const segment of textSegments) {
                // Start a new segment for headings and formatted elements
                if (segment.isHeading || segment.isFormattedElement || 
                    (currentSegment.text.length + segment.text.length > maxLength && currentSegment.nodes.length > 0)) {
                    
                    if (currentSegment.nodes.length > 0) {
                        merged.push(currentSegment);
                    }
                    
                    // Create a dedicated segment for headings and formatted elements
                    if (segment.isHeading || segment.isFormattedElement) {
                        merged.push({
                            nodes: [segment],
                            text: segment.text,
                            translation: null,
                            error: null,
                            isHeading: segment.isHeading,
                            isFormattedElement: segment.isFormattedElement
                        });
                        
                        // Start fresh for next segment
                        currentSegment = {
                            nodes: [],
                            text: '',
                            translation: null,
                            error: null
                        };
                        continue;
                    } else {
                        // Regular new segment
                        currentSegment = {
                            nodes: [],
                            text: '',
                            translation: null,
                            error: null
                        };
                    }
                }
                
                // Add the segment to the current merged segment
                currentSegment.nodes.push(segment);
                
                // Add a space if the current segment is not empty
                if (currentSegment.text.length > 0) {
                    currentSegment.text += ' ';
                }
                
                currentSegment.text += segment.text;
            }
            
            // Push the last segment if it's not empty
            if (currentSegment.nodes.length > 0) {
                merged.push(currentSegment);
            }
            
            return merged;
        };
        
        // Extract page content for translation
        const extractPageContent = () => {
            const selector = Config.getSetting('fullPageTranslationSelector');
            const excludeSelectors = Config.getSetting('excludeSelectors');
            const maxLength = Config.getSetting('fullPageMaxSegmentLength');
            
            let elements = [];
            try {
                elements = document.querySelectorAll(selector);
            } catch (e) {
                throw new Error(`选择器语法错误: ${e.message}`);
            }
            
            if (elements.length === 0) {
                throw new Error(`未找到匹配选择器 "${selector}" 的元素`);
            }
            
            // Extract text nodes from all matching elements
            let allTextNodes = [];
            elements.forEach(element => {
                const textNodes = extractTextNodesFromElement(element, [], 0, excludeSelectors);
                allTextNodes = allTextNodes.concat(textNodes);
            });
            
            // If no text nodes found
            if (allTextNodes.length === 0) {
                throw new Error('未找到可翻译的文本内容');
            }
            
            // Merge text nodes into segments
            return mergeTextSegments(allTextNodes, maxLength);
        };
        
        // Detect main content of the page
        const detectMainContent = () => {
            // Try to find the main content area of the page
            const possibleSelectors = [
                'article', 'main', '.article', '.post', '.content', '#content',
                '[role="main"]', '.main-content', '#main-content', '.post-content',
                '.entry-content', '.article-content', '.story', '.body'
            ];
            
            // Check if any of the selectors exist on the page
            for (const selector of possibleSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    // Find the element with the most text content
                    let bestElement = null;
                    let maxTextLength = 0;
                    
                    elements.forEach(element => {
                        const textLength = element.textContent.trim().length;
                        if (textLength > maxTextLength) {
                            maxTextLength = textLength;
                            bestElement = element;
                        }
                    });
                    
                    if (bestElement && maxTextLength > 500) {
                        return bestElement;
                    }
                }
            }
            
            // If no specific content area found, analyze paragraphs
            const paragraphs = document.querySelectorAll('p');
            if (paragraphs.length > 5) {
                // Group nearby paragraphs to find content clusters
                const clusters = [];
                let currentCluster = null;
                let lastRect = null;
                
                paragraphs.forEach(p => {
                    const rect = p.getBoundingClientRect();
                    const text = p.textContent.trim();
                    
                    // Skip empty paragraphs
                    if (text.length < 20) return;
                    
                    // Start a new cluster if needed
                    if (!currentCluster || !lastRect || Math.abs(rect.top - lastRect.bottom) > 100) {
                        if (currentCluster) {
                            clusters.push(currentCluster);
                        }
                        currentCluster = {
                            elements: [p],
                            textLength: text.length
                        };
                    } else {
                        // Add to current cluster
                        currentCluster.elements.push(p);
                        currentCluster.textLength += text.length;
                    }
                    
                    lastRect = rect;
                });
                
                // Add the last cluster
                if (currentCluster) {
                    clusters.push(currentCluster);
                }
                
                // Find the cluster with the most text
                let bestCluster = null;
                let maxClusterTextLength = 0;
                
                clusters.forEach(cluster => {
                    if (cluster.textLength > maxClusterTextLength) {
                        maxClusterTextLength = cluster.textLength;
                        bestCluster = cluster;
                    }
                });
                
                if (bestCluster && bestCluster.elements.length > 0) {
                    // Find common ancestor of elements in best cluster
                    const firstElement = bestCluster.elements[0];
                    let commonAncestor = firstElement.parentElement;
                    
                    // Go up the DOM tree to find an ancestor that contains at least 80% of the cluster's elements
                    while (commonAncestor && commonAncestor !== document.body) {
                        let containedCount = 0;
                        bestCluster.elements.forEach(el => {
                            if (commonAncestor.contains(el)) {
                                containedCount++;
                            }
                        });
                        
                        if (containedCount >= bestCluster.elements.length * 0.8) {
                            return commonAncestor;
                        }
                        
                        commonAncestor = commonAncestor.parentElement;
                    }
                    
                    // Fallback to the first paragraph's parent if no good common ancestor
                    return firstElement.parentElement;
                }
            }
            
            // Default to body if nothing better found
            return document.body;
        };
        
        return {
            detectLanguage,
            escapeHtml,
            decodeHtmlEntities,
            isShortPhrase: isShortPhrase,
            extractTextNodesFromElement,
            mergeTextSegments,
            extractPageContent,
            detectMainContent
        };
    })();

    /**
     * Core Module - Main application logic
     */
    const Core = (function() {
        // Private cache for tracking initialization
        let isInitialized = false;
        
        // Translation favorites and history management
        const historyManager = {
            add: (source, translation) => {
                // Add to history
                const history = State.get('translationHistory');
                
                // Create history item
                const item = {
                    source,
                    translation,
                    timestamp: Date.now()
                };
                
                // Add to the beginning
                const newHistory = [item, ...history.filter(h => h.source !== source)];
                
                // Limit history size
                const maxHistorySize = Config.getSetting('historySize');
                if (newHistory.length > maxHistorySize) {
                    newHistory.length = maxHistorySize;
                }
                
                // Update state
                State.set('translationHistory', newHistory);
            },
            
            clear: () => {
                State.set('translationHistory', []);
            }
        };
        
        // Translation favorites management
        const favoritesManager = {
            add: (source, translation) => {
                const favorites = State.get('translationFavorites');
                
                // Create favorite item
                const item = {
                    source,
                    translation,
                    timestamp: Date.now()
                };
                
                // Add to the beginning if not already exists
                const newFavorites = [item, ...favorites.filter(f => f.source !== source)];
                
                // Update state
                State.set('translationFavorites', newFavorites);
            },
            
            remove: (source) => {
                const favorites = State.get('translationFavorites');
                
                // Filter out the item
                const newFavorites = favorites.filter(f => f.source !== source);
                
                // Update state
                State.set('translationFavorites', newFavorites);
            },
            
            clear: () => {
                State.set('translationFavorites', []);
            },
            
            isFavorite: (source) => {
                const favorites = State.get('translationFavorites');
                return favorites.some(f => f.source === source);
            }
        };
        
        // Translation cache management
        const cacheManager = {
            add: (source, translation) => {
                // 修改缓存策略：对于短文本（小于3字符）的特殊处理
                // 1) 如果文本太长，仍然不缓存
                if (source.length > 10000) return;
                
                // 2) 对于极短文本，我们缓存它但添加特殊标记
                const isShortText = source.length < 3;
                
                State.debugLog('Adding to cache:', source, translation, isShortText ? '(短文本)' : '');
                // Get existing cache
                const cache = State.get('translationCache');
                
                // Add to cache with timestamp
                cache[source] = {
                    translation,
                    timestamp: Date.now(),
                    isShortText // 标记是否为短文本
                };
                
                // Prune cache if it's too large
                cacheManager.prune();
                
                // Update state
                State.set('translationCache', cache);
            },
            
            get: (source) => {
                const cache = State.get('translationCache');
                return cache[source] ? cache[source].translation : null;
            },
            
            clear: () => {
                State.set('translationCache', {});
            },
            
            prune: () => {
                const cache = State.get('translationCache');
                const maxCacheSize = Config.getSetting('maxCacheSize');
                const maxCacheAge = Config.getSetting('maxCacheAge') * 24 * 60 * 60 * 1000; // Convert days to milliseconds
                
                // If cache is not too large, just return
                if (Object.keys(cache).length <= maxCacheSize) return;
                
                // Get all entries with timestamps
                const entries = Object.entries(cache).map(([source, data]) => ({
                    source,
                    timestamp: data.timestamp || 0
                }));
                
                // Remove old entries beyond max age
                const now = Date.now();
                const recentEntries = entries.filter(e => now - e.timestamp <= maxCacheAge);
                
                // If we're still over the limit, remove least recently used
                if (recentEntries.length > maxCacheSize) {
                    // Sort by timestamp (oldest first)
                    recentEntries.sort((a, b) => a.timestamp - b.timestamp);
                    
                    // Keep only the newest entries
                    recentEntries.length = maxCacheSize;
                }
                
                // Create new cache with only the entries we want to keep
                const newCache = {};
                recentEntries.forEach(e => {
                    newCache[e.source] = cache[e.source];
                });
                
                // Update state
                State.set('translationCache', newCache);
            },
            
            // Apply cached translations to current segments
            apply: async () => {
                const segments = State.get('translationSegments');
                if (!segments || segments.length === 0) return false;
                
                // Set cache application state
                State.set('isApplyingCache', true);
                State.set('isStopped', false);
                State.set('isTranslatingFullPage', true); // Ensure we're in translating state
                
                let appliedCount = 0;
                
                // Try to apply cached translations
                for (let i = 0; i < segments.length; i++) {
                    const segment = segments[i];
                    const cachedTranslation = cacheManager.get(segment.text);
                    
                    if (cachedTranslation) {
                        segment.translation = cachedTranslation;
                        segment.fromCache = true;
                        appliedCount++;
                        
                        // Apply translation to DOM immediately for this segment
                        applyTranslationToSegment(segment);
                        
                        // 更新进度，在每个缓存段落应用后触发进度更新
                        State.set('lastTranslatedIndex', i);
                    }
                }
                
                // Done applying cache - set state to finished
                State.set('isApplyingCache', false);
                State.set('cacheApplied', appliedCount > 0);
                
                // 完成缓存应用后，再次更新进度以确保UI正确反映当前状态
                if (appliedCount > 0) {
                    State.set('lastTranslatedIndex', segments.findIndex(s => !s.translation && !s.error));
                
                    // If we applied all segments from cache, mark as complete
                    const allSegmentsTranslated = segments.every(s => s.translation || s.error);
                    if (allSegmentsTranslated) {
                        // All segments are translated from cache, stop the translation process
                        State.set('isTranslatingFullPage', false);
                        
                        // Ensure UI shows complete status
                        const statusElement = UI.components.pageControls.statusElement;
                        if (statusElement) {
                            statusElement.textContent = '翻译完成 (全部来自缓存)';
                            statusElement.style.color = '#4CAF50';
                        }
                    }
                }
                
                return appliedCount > 0;
            }
        };
        
        // Initialize the application
        const init = () => {
            if (isInitialized) return;
            
            // Initialize all modules
            Config.init();
            UI.init();
            
            // Register menu commands
            GM_registerMenuCommand('翻译设置', () => {
                UI.components.settingsPanel.show();
            });
            
            GM_registerMenuCommand('翻译历史', () => {
                UI.components.historyPanel.show();
            });
            
            GM_registerMenuCommand('翻译收藏夹', () => {
                UI.components.favoritesPanel.show();
            });
            
            GM_registerMenuCommand('翻译整页', () => {
                Core.translateFullPage().catch(error => {
                    alert(`翻译整页失败: ${error.message}`);
                });
            });
            
            // Set up global state change handlers
            State.subscribe('translationHistory', () => {
                if (UI.components.historyPanel) {
                    UI.components.historyPanel.update();
                }
            });
            
            State.subscribe('translationFavorites', () => {
                if (UI.components.favoritesPanel) {
                    UI.components.favoritesPanel.update();
                }
            });
            
            isInitialized = true;
            State.debugLog('Translator initialized');
        };
        
        // Translation functionality
        const translateSelectedText = async (text, rect, isExplanationMode = false) => {
            if (!text || text.trim().length === 0) return;
            
            try {
                // Get translation context if enabled
                let context = null;
                if (Config.getSetting('useTranslationContext')) {
                    const history = State.get('translationHistory');
                    const contextSize = Config.getSetting('contextSize');
                    context = history.slice(-contextSize).map(item => ({
                        source: item.source,
                        translation: item.translation
                    }));
                }
                
                // Perform translation
                const translation = await API.retryTranslation(text, {
                    isWordExplanationMode: isExplanationMode,
                    context
                });
                
                // Add to history
                historyManager.add(text, translation);
                
                // Add to cache
                cacheManager.add(text, translation);
                
                return translation;
            } catch (error) {
                State.debugLog('Translation error:', error);
                throw error;
            }
        };
        
        const translateFullPage = async (options = {}) => {
            // Default options
            const defaultOptions = {
                forceRetranslate: false, // Whether to force re-translation even when cache is available
            };
            
            const opts = {...defaultOptions, ...options};
            
            // If translation is already in progress, don't start a new one
            if (State.get('isTranslatingFullPage')) {
                return;
            }
            
            // If we have previously translated segments, check whether to restart
            const existingSegments = State.get('translationSegments');
            if (existingSegments && existingSegments.length > 0) {
                // We're restarting a translation - reset everything
                restoreOriginalText(true);
            }
            
            try {
                // Set translation state
                State.set('isTranslatingFullPage', true);
                State.set('isTranslationPaused', false);
                State.set('isStopped', false);
                State.set('lastTranslatedIndex', -1);
                State.set('isShowingTranslation', true);
                
                // Extract content for translation
                let segments;
                
                if (Config.getSetting('detectArticleContent')) {
                    // Detect main content area
                    const mainContent = Utils.detectMainContent();
                    
                    // Override selector temporarily to target the main content
                    const originalSelector = Config.getSetting('fullPageTranslationSelector');
                    
                    // Create a unique selector for the detected element
                    let tempId = 'translator-detected-content-' + Date.now();
                    mainContent.id = tempId;
                    
                    Config.updateSetting('fullPageTranslationSelector', '#' + tempId);
                    segments = Utils.extractPageContent();
                    
                    // Restore original selector
                    Config.updateSetting('fullPageTranslationSelector', originalSelector);
                    
                    // Remove temporary ID
                    mainContent.removeAttribute('id');
                } else {
                    // Use configured selector
                    segments = Utils.extractPageContent();
                }
                
                // Store segments and original texts
                State.set('translationSegments', segments);
                State.set('originalTexts', segments.map(s => s.text));
                
                // Show translation controls
                UI.components.pageControls.show();
                
                // Check if we should apply cache or force re-translation
                if (!opts.forceRetranslate) {
                    // Attempt to apply translations from cache
                    const cacheApplied = await cacheManager.apply();
                    
                    // Start translating uncached segments if needed
                    if (cacheApplied) {
                        // Start translating from where cache left off
                        const untranslatedIndex = segments.findIndex(s => !s.translation && !s.error);
                        if (untranslatedIndex !== -1) {
                            await translateNextSegment(untranslatedIndex);
                        }
                    } else {
                        // No cache applied, start from beginning
                        await translateNextSegment(0);
                    }
                } else {
                    // Force re-translation - ignore cache and start from beginning
                    segments.forEach(segment => {
                        // Clear previous translations but keep the text
                        segment.translation = null;
                        segment.error = null;
                        segment.fromCache = false;
                        segment.pending = false;
                    });
                    
                    // Start translating from beginning
                    await translateNextSegment(0);
                }
                
                return true;
            } catch (error) {
                State.set('isTranslatingFullPage', false);
                State.debugLog('Full page translation error:', error);
                throw error;
            }
        };
        
        // Translate the next segment in a full page translation
        const translateNextSegment = async (index) => {
            const segments = State.get('translationSegments');
            
            // Check if index is valid
            if (index < 0 || index >= segments.length) {
                // 处理无效索引的情况，通常意味着已经翻译完成所有段落
                // 更新最后翻译的索引为最大值，确保进度为100%
                State.set('lastTranslatedIndex', segments.length - 1);
                State.set('isTranslatingFullPage', false);
                
                // 更新状态为完成
                const statusElement = UI.components.pageControls.statusElement;
                if (statusElement) {
                    statusElement.textContent = '翻译完成';
                    statusElement.style.color = '#4CAF50';
                }
                
                // 手动强制更新进度显示为100%
                const { indicator, percentage } = UI.components.pageControls.progressElement;
                indicator.style.width = '100%';
                percentage.textContent = `100% (${segments.length}/${segments.length})`;
                
                // Final stats update
                UI.components.pageControls.updateStats(segments);
                
                return;
            }
            
            // Check if translation is paused or stopped
            if (State.get('isTranslationPaused') || State.get('isStopped')) {
                return;
            }
            
            try {
                const segment = segments[index];
                
                // Skip already translated segments
                if (segment.translation || segment.error) {
                    // Continue with next segment
                    if (index < segments.length - 1) {
                        translateNextSegment(index + 1);
                    } else {
                        // Translation complete
                        // 确保最后一个段落也被计入进度
                        State.set('lastTranslatedIndex', segments.length - 1);
                        State.set('isTranslatingFullPage', false);
                        
                        // Update status when translation is actually complete
                        const statusElement = UI.components.pageControls.statusElement;
                        if (statusElement) {
                            statusElement.textContent = '翻译完成';
                            statusElement.style.color = '#4CAF50';
                        }
                        
                        // 手动强制更新进度显示为100%
                        const { indicator, percentage } = UI.components.pageControls.progressElement;
                        indicator.style.width = '100%';
                        percentage.textContent = `100% (${segments.length}/${segments.length})`;
                        
                        // Final stats update
                        UI.components.pageControls.updateStats(segments);
                    }
                    return;
                }
                
                // Update progress
                State.set('lastTranslatedIndex', index);
                
                // Get context from previous segments if enabled
                let context = null;
                if (Config.getSetting('useTranslationContext')) {
                    const contextSize = Config.getSetting('contextSize');
                    context = [];
                    
                    // Get context from previous segments
                    for (let i = Math.max(0, index - contextSize); i < index; i++) {
                        if (segments[i].translation) {
                            context.push({
                                source: segments[i].text,
                                translation: segments[i].translation
                            });
                        }
                    }
                }
                
                // Translate segment
                const translation = await API.retryTranslation(segment.text, { context });
                
                // Update segment with translation
                segment.translation = translation;
                // Explicitly mark as not pending
                segment.pending = false;
                
                // Add or update cache
                if (segment.fromCache) {
                    // This was previously from cache but now we have a new translation
                    segment.fromCache = false;
                }
                cacheManager.add(segment.text, translation);
                
                // Apply translations to DOM if we're showing them
                if (State.get('isShowingTranslation')) {
                    applyTranslationToSegment(segment);
                }
                
                // Continue with next segment
                if (index < segments.length - 1) {
                    translateNextSegment(index + 1);
                } else {
                    // Translation complete
                    // 确保最后一个段落也被计入进度
                    State.set('lastTranslatedIndex', segments.length - 1);
                    State.set('isTranslatingFullPage', false);
                    
                    // Update status when translation is actually complete
                    const statusElement = UI.components.pageControls.statusElement;
                    if (statusElement) {
                        statusElement.textContent = '翻译完成';
                        statusElement.style.color = '#4CAF50';
                    }
                    
                    // 手动强制更新进度显示为100%
                    const { indicator, percentage } = UI.components.pageControls.progressElement;
                    indicator.style.width = '100%';
                    percentage.textContent = `100% (${segments.length}/${segments.length})`;
                    
                    // Final stats update
                    UI.components.pageControls.updateStats(segments);
                }
            } catch (error) {
                // Mark segment as having an error
                segments[index].error = error.message;
                // Explicitly mark as not pending
                segments[index].pending = false;
                
                // Continue with next segment
                if (index < segments.length - 1) {
                    translateNextSegment(index + 1);
                } else {
                    // Translation complete even with errors
                    // 确保最后一个段落也被计入进度计算
                    State.set('lastTranslatedIndex', segments.length - 1);
                    State.set('isTranslatingFullPage', false);
                    
                    // Update status when translation is actually complete
                    const statusElement = UI.components.pageControls.statusElement;
                    if (statusElement) {
                        statusElement.textContent = '翻译完成';
                        statusElement.style.color = '#4CAF50';
                    }
                    
                    // 手动强制更新进度显示为100%
                    const { indicator, percentage } = UI.components.pageControls.progressElement;
                    indicator.style.width = '100%';
                    percentage.textContent = `100% (${segments.length}/${segments.length})`;
                    
                    // Final stats update
                    UI.components.pageControls.updateStats(segments);
                }
            }
        };
        
        // Stop translation but preserve the progress
        const stopTranslation = () => {
            State.set('isStopped', true);
            State.set('isTranslatingFullPage', false);
            
            // Reset pause state when translation is stopped
            if (State.get('isTranslationPaused')) {
                State.set('isTranslationPaused', false);
            }
            
            // Update status
            const statusElement = UI.components.pageControls.statusElement;
            if (statusElement) {
                statusElement.textContent = '翻译已停止';
                statusElement.style.color = '';
            }
            
            // 确保已翻译部分的进度正确反映
            const segments = State.get('translationSegments');
            if (segments && segments.length > 0) {
                // 设置最后翻译索引以触发进度更新
                const lastTranslated = segments.reduce((max, segment, idx) => 
                    (segment.translation || segment.error) ? idx : max, -1);
                
                if (lastTranslated >= 0) {
                    State.set('lastTranslatedIndex', lastTranslated);
                }
                
                // Final stats update
                UI.components.pageControls.updateStats(segments);
            }
        };
        
        // Apply translation to a segment
        const applyTranslationToSegment = (segment) => {
            if (!segment.translation) return;
            
            if (segment.isHeading || segment.isFormattedElement) {
                // For headings and formatted elements
                const firstNode = segment.nodes[0];
                const element = firstNode.element;
                
                if (element) {
                    if (Config.getSetting('showSourceLanguage')) {
                        // Style the original
                        element.style.color = '#999';
                        element.style.fontStyle = 'italic';
                        element.style.marginBottom = '5px';
                        
                        // Find or create translation element
                        let translationElement = element.nextSibling;
                        if (!translationElement || !translationElement.classList || !translationElement.classList.contains('translated-text')) {
                            // Create new element
                            translationElement = document.createElement('div');
                            translationElement.className = 'translated-text';
                            translationElement.style.cssText = 'color: #333; font-style: normal;';
                            
                            // Clone the element to preserve its structure but with translated text
                            const clonedElement = element.cloneNode(true);
                            // Replace all text nodes in the clone with translated text
                            replaceTextInElement(clonedElement, segment.translation);
                            translationElement.innerHTML = clonedElement.innerHTML;
                            
                            element.parentNode.insertBefore(translationElement, element.nextSibling);
                        } else {
                            // Show existing translation
                            translationElement.style.display = '';
                        }
                    } else {
                        // Store original HTML
                        if (!element.getAttribute('data-original-text')) {
                            element.setAttribute('data-original-text', element.innerHTML);
                        }
                        
                        // Replace all text nodes in the element with translated text
                        // This preserves HTML structure including links
                        replaceTextInElement(element, segment.translation);
                    }
                }
            } else {
                // Apply translation to each individual text node
                segment.nodes.forEach(nodeInfo => {
                    const originalNode = nodeInfo.node;
                    
                    // Create the translation span
                    const translationSpan = document.createElement('span');
                    translationSpan.className = 'translated-text';
                    translationSpan.style.cssText = 'color: #333; font-style: normal;';
                    translationSpan.textContent = segment.translation;
                    
                    // Replace original text with translation
                    if (originalNode && originalNode.parentNode) {
                        if (Config.getSetting('showSourceLanguage')) {
                            // Create original text span
                            const originalSpan = document.createElement('span');
                            originalSpan.className = 'original-text';
                            originalSpan.style.cssText = 'color: #999; font-style: italic; margin-right: 5px;';
                            originalSpan.textContent = originalNode.textContent;
                            
                            // Insert original and translation
                            originalNode.parentNode.insertBefore(translationSpan, originalNode);
                            originalNode.parentNode.insertBefore(originalSpan, translationSpan);
                        } else {
                            // Just insert translation
                            originalNode.parentNode.insertBefore(translationSpan, originalNode);
                        }
                        
                        // Hide original node
                        if (originalNode.style) {
                            originalNode.style.display = 'none';
                        }
                    }
                });
            }
        };
        
        // Helper function to replace text in an element while preserving structure
        const replaceTextInElement = (element, translation) => {
            const textNodes = [];
            
            // Extract all text nodes from the element
            const extractTextNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.trim()) {
                        textNodes.push(node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(extractTextNodes);
                }
            };
            
            extractTextNodes(element);
            
            // If there's only one text node, directly replace it
            if (textNodes.length === 1) {
                textNodes[0].textContent = translation;
                return;
            }
            
            // For multiple text nodes, distribute translation proportionally
            const totalOriginalLength = textNodes.reduce(
                (sum, node) => sum + node.textContent.trim().length, 0);
            
            if (totalOriginalLength > 0) {
                let startPos = 0;
                for (let i = 0; i < textNodes.length; i++) {
                    const node = textNodes[i];
                    const nodeText = node.textContent.trim();
                    
                    if (nodeText.length > 0) {
                        // Calculate ratio for this node
                        const ratio = nodeText.length / totalOriginalLength;
                        // Calculate text length for this node
                        const chunkLength = Math.round(translation.length * ratio);
                        
                        // Extract portion of translation
                        let chunk;
                        if (i === textNodes.length - 1) {
                            // Last node gets remainder
                            chunk = translation.substring(startPos);
                        } else {
                            // Other nodes get proportional amount
                            chunk = translation.substring(startPos, startPos + chunkLength);
                            startPos += chunkLength;
                        }
                        
                        // Update node text
                        node.textContent = chunk;
                    }
                }
            } else {
                // Fallback: put all translation in first text node if found
                if (textNodes.length > 0) {
                    textNodes[0].textContent = translation;
                    for (let i = 1; i < textNodes.length; i++) {
                        textNodes[i].textContent = '';
                    }
                }
            }
        };
        
        // Toggle to show translations (opposite of restoreOriginalText)
        const showTranslation = (removeControls = false) => {
            const segments = State.get('translationSegments');
            
            if (!segments || segments.length === 0) {
                return;
            }
            
            // Show each segment's translation
            segments.forEach(segment => {
                if (!segment.translation) return;
                
                if (segment.isHeading || segment.isFormattedElement) {
                    // For headings and formatted elements
                    const firstNode = segment.nodes[0];
                    const element = firstNode.element;
                    
                    if (element) {
                        const originalText = element.getAttribute('data-original-text');
                        
                        if (Config.getSetting('showSourceLanguage')) {
                            // Style the original
                            element.style.color = '#999';
                            element.style.fontStyle = 'italic';
                            element.style.marginBottom = '5px';
                            
                            // Find or create the translation element
                            let translationElement = element.nextSibling;
                            if (!translationElement || !translationElement.classList || !translationElement.classList.contains('translated-text')) {
                                // Translation element doesn't exist, create it
                                translationElement = document.createElement('div');
                                translationElement.className = 'translated-text';
                                translationElement.style.cssText = 'color: #333; font-style: normal;';
                                
                                // Clone the element to preserve its structure but with translated text
                                const clonedElement = element.cloneNode(true);
                                // Replace all text nodes in the clone with translated text
                                replaceTextInElement(clonedElement, segment.translation);
                                translationElement.innerHTML = clonedElement.innerHTML;
                                
                                element.parentNode.insertBefore(translationElement, element.nextSibling);
                            } else {
                                // Show existing translation
                                translationElement.style.display = '';
                            }
                        } else {
                            // Replace content even if originalText is not set yet
                            if (!originalText) {
                                // Store original content if not already stored
                                element.setAttribute('data-original-text', element.innerHTML);
                            }
                            
                            // Replace all text nodes in the element with translated text
                            // This preserves HTML structure including links
                            replaceTextInElement(element, segment.translation);
                        }
                    }
                } else {
                    // For regular text nodes
                    if (!segment.nodes) return;
                    
                    segment.nodes.forEach(nodeInfo => {
                        if (!nodeInfo) return;
                        
                        const originalNode = nodeInfo.node;
                        
                        if (originalNode && originalNode.parentNode) {
                            // Show original node
                            if (originalNode.style) {
                                originalNode.style.display = '';
                            }
                            
                            // Remove or hide translation elements
                            let sibling = originalNode.previousSibling;
                            while (sibling) {
                                const prevSibling = sibling.previousSibling;
                                if (sibling.classList && 
                                    (sibling.classList.contains('translated-text') || 
                                     sibling.classList.contains('original-text'))) {
                                    
                                    if (removeControls && sibling.parentNode) {
                                        sibling.parentNode.removeChild(sibling);
                                    } else if (sibling.style) {
                                        sibling.style.display = 'none';
                                    }
                                }
                                sibling = prevSibling;
                            }
                        }
                    });
                }
            });
        };
        
        // Restore original text for a full page translation
        const restoreOriginalText = (removeControls = false) => {
            const segments = State.get('translationSegments');
            
            if (!segments || segments.length === 0) {
                return;
            }
            
            // Restore each segment
            segments.forEach(segment => {
                if (segment.isHeading || segment.isFormattedElement) {
                    // For headings and formatted elements
                    const firstNode = segment.nodes[0];
                    const element = firstNode.element;
                    
                    if (element) {
                        // Restore original style
                        if (element.style) {
                            element.style.color = '';
                            element.style.fontStyle = '';
                            element.style.marginBottom = '';
                        }
                        
                        // Restore original content if replaced
                        const originalText = element.getAttribute('data-original-text');
                        if (originalText) {
                            element.innerHTML = originalText;
                            element.removeAttribute('data-original-text');
                        }
                        
                        // Hide translation element if it was added separately
                        if (Config.getSetting('showSourceLanguage')) {
                            const nextSibling = element.nextSibling;
                            if (nextSibling && nextSibling.className === 'translated-text' && nextSibling.style) {
                                nextSibling.style.display = 'none';
                            }
                        }
                    }
                } else {
                    // For regular text nodes
                    if (!segment.nodes) return;
                    
                    segment.nodes.forEach(nodeInfo => {
                        if (!nodeInfo) return;
                        
                        const originalNode = nodeInfo.node;
                        
                        if (originalNode && originalNode.parentNode) {
                            // Show original node
                            if (originalNode.style) {
                                originalNode.style.display = '';
                            }
                            
                            // Remove or hide translation elements
                            let sibling = originalNode.previousSibling;
                            while (sibling) {
                                const prevSibling = sibling.previousSibling;
                                if (sibling.classList && 
                                    (sibling.classList.contains('translated-text') || 
                                     sibling.classList.contains('original-text'))) {
                                    
                                    if (removeControls && sibling.parentNode) {
                                        sibling.parentNode.removeChild(sibling);
                                    } else if (sibling.style) {
                                        sibling.style.display = 'none';
                                    }
                                }
                                sibling = prevSibling;
                            }
                        }
                    });
                }
            });
            
            // Update state
            State.set('isShowingTranslation', false);
            
            // Remove page controls if requested
            if (removeControls) {
                UI.components.pageControls.hide();
            }
        };
        
        return {
            init,
            translateSelectedText,
            translateFullPage,
            translateNextSegment,
            stopTranslation,
            showTranslation,
            restoreOriginalText,
            applyTranslationToSegment,
            historyManager,
            favoritesManager,
            cacheManager
        };
    })();

    // Initialize the application
    Core.init();
})(); 