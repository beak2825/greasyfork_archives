// ==UserScript==
// @name         Wistia Subtitle Translator
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Automatically translate Wistia video subtitles to Chinese using Gemini 2.5 Flash
// @author       liby
// @license      MIT
// @match        https://learn.getdbt.com/*
// @match        https://fast.wistia.com/embed/captions/*.json
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538750/Wistia%20Subtitle%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/538750/Wistia%20Subtitle%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_KEY: GM_getValue('gemini_api_key', ''),
        API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
        BATCH_SIZE: 20,
        TIMEOUTS: {
            WAIT_TRANSLATION: 1000,
            WAIT_CAPTIONS: 2000,
            CAPTION_CHECK: 500,
            PLAYBACK_DELAY: 300,
            MAX_RETRIES: 10
        }
    };

    const SELECTORS = {
        WISTIA_CONTAINERS: '.w-chrome, [id*="wistia_chrome"], .wistia_embed',
        CAPTION_BUTTON: '[data-handle="captionsButton"] button',
        CAPTION_ITEMS: '[data-handle*="captions-menu-item"], [data-handle="captionsMenuItem"], .w-captions-menu-item',
        PLAY_BUTTONS: [
            '[data-handle="smallPlayButton"] button',
            '.w-big-play-button'
        ]
    };

    // Initialize API key
    if (!CONFIG.API_KEY) {
        const apiKey = prompt('Please enter your Gemini API key:');
        if (apiKey) {
            GM_setValue('gemini_api_key', apiKey);
            location.reload();
            return;
        }
    }

    // Global state
    const translationCache = new Map();
    const playedVideos = new Set();
    let translationComplete = false;

    // Utility functions
    const findElement = (container, selectors) => {
        for (const selector of selectors) {
            const element = container.querySelector(selector);
            if (element) return element;
        }
        return null;
    };

    const createPrompt = (textArray) => `<agent>
  <name>Professional Subtitle Translator</name>
  <role>
    You are a specialized translator for technical video subtitles, focusing on data engineering and analytics content.
  </role>
  <instructions>
    - KEEP the original English text EXACTLY as provided
    - ADD Chinese translation separated by "|||" after the English text
    - PRESERVE technical terms like dbt, SQL, Python, API, etc. in English
    - ADD a space between Chinese characters and English words/numbers in the translation
    - ENSURE natural, fluent Chinese that accurately conveys the meaning
    - MAINTAIN the same JSON array structure
    - RETURN ONLY the JSON array, no additional text
  </instructions>
  <caption-format>
    "Original English text|||中文翻译"
  </caption-format>
</agent>

EXAMPLE:
Input: ["Hi everyone.", "So we're talking about who is an analytics engineer?", "Where did this role come from, why is it necessary for data teams."]
Output: ["Hi everyone.|||大家好。", "So we're talking about who is an analytics engineer?|||那么我们来谈谈谁是分析工程师？", "Where did this role come from, why is it necessary for data teams.|||这个角色从何而来，为什么它对数据团队是必要的。"]

TEXT TO TRANSLATE:
${JSON.stringify(textArray)}

Return ONLY the JSON array:`;

    // Translation function
    async function translateWithGemini(textArray) {
        const cacheKey = JSON.stringify(textArray);
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.API_URL}?key=${CONFIG.API_KEY}`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    contents: [{ parts: [{ text: createPrompt(textArray) }] }],
                    generationConfig: { temperature: 0.2, maxOutputTokens: 16384 }
                }),
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        // More flexible response validation
                        const translatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (!translatedText) {
                            console.error('[Wistia Translator] No translation text in API response');
                            resolve(textArray);
                            return;
                        }
                        
                        const jsonMatch = translatedText.match(/\[.*\]/s);
                        
                        if (jsonMatch) {
                            const translatedArray = JSON.parse(jsonMatch[0]);
                            // Replace separator with newlines for display
                            const processedArray = translatedArray.map(text => 
                                text.replace(/\|\|\|/g, '\n')
                            );
                            translationCache.set(cacheKey, processedArray);
                            resolve(processedArray);
                        } else {
                            console.error('[Wistia Translator] No JSON array found in translation response');
                            resolve(textArray);
                        }
                    } catch (error) {
                        console.error('[Wistia Translator] Translation error:', error);
                        resolve(textArray);
                    }
                },
                onerror: () => resolve(textArray)
            });
        });
    }

    // Process subtitles
    async function processSubtitles(subtitleData) {
        if (!subtitleData.captions?.length) return subtitleData;

        for (const caption of subtitleData.captions) {
            if (caption.language !== 'eng' || !caption.hash?.lines) continue;
            
            const { allTexts, lineIndexes } = caption.hash.lines.reduce((acc, line, i) => {
                if (line.text?.length) {
                    const combinedText = line.text.join(' ').trim();
                    if (combinedText) {
                        acc.allTexts.push(combinedText);
                        acc.lineIndexes.push(i);
                    }
                }
                return acc;
            }, { allTexts: [], lineIndexes: [] });

            if (!allTexts.length) continue;

            try {
                const translatedTexts = [];
                for (let i = 0; i < allTexts.length; i += CONFIG.BATCH_SIZE) {
                    const batch = allTexts.slice(i, i + CONFIG.BATCH_SIZE);
                    const batchTranslated = await translateWithGemini(batch);
                    translatedTexts.push(...batchTranslated);
                }
                
                lineIndexes.forEach((lineIndex, i) => {
                    if (i < translatedTexts.length) {
                        caption.hash.lines[lineIndex].text = [translatedTexts[i]];
                    }
                });
            } catch (error) {
                console.error('[Wistia Translator] Translation error:', error);
            }
        }

        return subtitleData;
    }

    // Video control functions
    const isValidVideoContainer = (container) => {
        return container.querySelector('video') && 
               (container.classList.contains('w-chrome') || 
                (container.id && container.id.includes('wistia_chrome')));
    };

    function playVideo(container) {
        const playButton = findElement(container, SELECTORS.PLAY_BUTTONS);
        const video = container.querySelector('video');

        if (playButton) {
            playButton.click();
        } else if (video) {
            video.play();
        }
    }

    function enableCaptionsAndPlay(container) {
        if (!container.id || playedVideos.has(container.id)) return;
        
        playedVideos.add(container.id);
        let retryCount = 0;
        
        const waitForCaptionsReady = () => {
            const captionButton = container.querySelector(SELECTORS.CAPTION_BUTTON);
            
            if (!captionButton) {
                playVideo(container);
                return;
            }

            // Check if captions are already available
            const existingCaptionOptions = container.querySelectorAll(SELECTORS.CAPTION_ITEMS);
            if (existingCaptionOptions.length > 0) {
                setTimeout(() => playVideo(container), CONFIG.TIMEOUTS.PLAYBACK_DELAY);
                return;
            }

            // Open caption menu to check for options
            captionButton.click();
            
            setTimeout(() => {
                const captionOptions = container.querySelectorAll(SELECTORS.CAPTION_ITEMS);
                captionButton.click(); // Close menu
                
                if (captionOptions.length > 0) {
                    setTimeout(() => playVideo(container), CONFIG.TIMEOUTS.PLAYBACK_DELAY);
                } else if (retryCount < CONFIG.TIMEOUTS.MAX_RETRIES) {
                    retryCount++;
                    setTimeout(waitForCaptionsReady, CONFIG.TIMEOUTS.WAIT_CAPTIONS);
                } else {
                    playVideo(container);
                }
            }, CONFIG.TIMEOUTS.CAPTION_CHECK);
        };

        setTimeout(waitForCaptionsReady, CONFIG.TIMEOUTS.WAIT_TRANSLATION);
    }

    function setupVideoControl() {
        const processedVideos = new Set();

        const handleVideo = (container) => {
            if (!container.id || processedVideos.has(container.id) || !isValidVideoContainer(container)) {
                return;
            }
            
            processedVideos.add(container.id);
            
            const video = container.querySelector('video');
            if (video && !video.paused) video.pause();
            
            const waitAndPlay = () => {
                if (translationComplete) {
                    enableCaptionsAndPlay(container);
                } else {
                    setTimeout(waitAndPlay, CONFIG.TIMEOUTS.WAIT_TRANSLATION);
                }
            };
            setTimeout(waitAndPlay, CONFIG.TIMEOUTS.WAIT_CAPTIONS);
        };

        // Monitor for new videos
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelectorAll) {
                        [node, ...node.querySelectorAll(SELECTORS.WISTIA_CONTAINERS)]
                            .filter(isValidVideoContainer)
                            .forEach(container => setTimeout(() => handleVideo(container), 500));
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });

        // Handle existing videos
        setTimeout(() => {
            document.querySelectorAll(SELECTORS.WISTIA_CONTAINERS).forEach(handleVideo);
        }, CONFIG.TIMEOUTS.WAIT_CAPTIONS);
    }

    // Settings UI
    function addSettingsButton() {
        if (document.querySelector('#subtitle-translator-settings')) return;
        
        const button = document.createElement('button');
        Object.assign(button, {
            id: 'subtitle-translator-settings',
            innerHTML: '🌐 字幕翻译设置',
            onclick: () => {
                const action = prompt('Choose action:\n1 - Update API key\n2 - Clear cache', '1');
                if (action === '1') {
                    const newKey = prompt('Enter your Gemini API key:', CONFIG.API_KEY);
                    if (newKey !== null) {
                        GM_setValue('gemini_api_key', newKey);
                        alert('API key updated! Please refresh the page.');
                    }
                } else if (action === '2') {
                    translationCache.clear();
                    alert('Translation cache cleared!');
                }
            }
        });
        
        button.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 10000;
            padding: 8px 12px; background: #007cba; color: white;
            border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
        `;
        
        document.body.appendChild(button);
    }

    // Add CSS for multiline captions
    function addCaptionStyles() {
        if (document.querySelector('#wistia-caption-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'wistia-caption-styles';
        style.textContent = `
            .w-captions-line span {
                white-space: pre-line !important;
                display: inline-block !important;
                text-align: center !important;
                line-height: 1.2 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Intercept subtitle requests
    const originalResponseJson = Response.prototype.json;
    Response.prototype.json = async function() {
        if (this.url?.includes('fast.wistia.com/embed/captions/')) {
            try {
                const originalData = await originalResponseJson.call(this);
                const processedData = await processSubtitles(originalData);
                
                translationComplete = true;
                
                // Add CSS styles for multiline captions
                addCaptionStyles();
                
                // Trigger auto-play for all valid video containers
                setTimeout(() => {
                    document.querySelectorAll(SELECTORS.WISTIA_CONTAINERS).forEach(container => {
                        const video = container.querySelector('video');
                        if (video && video.paused && isValidVideoContainer(container)) {
                            enableCaptionsAndPlay(container);
                        }
                    });
                }, 500);
                
                // Show success indicator
                if (processedData.captions?.length) {
                    setTimeout(() => {
                        const indicator = document.createElement('div');
                        indicator.innerHTML = '✅ 字幕已翻译';
                        indicator.style.cssText = `
                            position: fixed; top: 50px; right: 10px; z-index: 10001;
                            background: #4CAF50; color: white; padding: 5px 10px;
                            border-radius: 4px; font-size: 12px;
                        `;
                        document.body.appendChild(indicator);
                        setTimeout(() => indicator.remove(), 3000);
                    }, 1000);
                }
                
                return processedData;
            } catch (error) {
                console.error('[Wistia Translator] Error processing subtitles:', error);
                translationComplete = true;
                return originalResponseJson.call(this);
            }
        }
        
        return originalResponseJson.call(this);
    };

    // Initialize
    const init = () => {
        addSettingsButton();
        addCaptionStyles();
        setupVideoControl();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();