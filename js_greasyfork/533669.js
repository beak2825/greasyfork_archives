// ==UserScript==
// @name         Sekai Viewer Story Translator (KR) - Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  Translates Sekai Viewer story assets from Japanese to Korean using Gemini API.
// @author       You
// @match        https://sekai.best/storyreader-live2d/*
// @match        https://sekai.best/storyreader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sekai.best
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533669/Sekai%20Viewer%20Story%20Translator%20%28KR%29%20-%20Tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/533669/Sekai%20Viewer%20Story%20Translator%20%28KR%29%20-%20Tampermonkey.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    console.log("Sekai Translator Script: Initializing...");

    // --- 설정값 관리 (비동기 로드) ---
    const config = {
        apiKey: await GM_getValue('geminiApiKey', ''),
        isEnabled: await GM_getValue('isTranslationEnabled', true)
    };

    // --- UI 생성 및 관리 함수 ---
    function createSettingsUI() {
        if (document.getElementById('sekai-translator-settings-ui')) {
            const ui = document.getElementById('sekai-translator-settings-ui');
            if(ui) ui.style.display = 'flex';
            return;
        }
        console.log("Sekai Translator Script: Creating settings UI elements...");

        GM_addStyle(`
            /* --- 기존 스타일 시작 (변경 없음) --- */
            #sekai-translator-settings-ui {
                position: fixed; top: 0; left: 0; width: 100%;
                background-color: rgba(40, 40, 40, 0.95); color: white;
                padding: 10px 20px; z-index: 99999; font-family: sans-serif;
                font-size: 14px; display: flex; align-items: center;
                justify-content: space-between; /* 기본은 양쪽 정렬 */
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                box-sizing: border-box; border-bottom: 1px solid #555;
                flex-wrap: wrap; /* !!!! 추가: 기본적으로 줄바꿈 허용 !!!! */
                gap: 10px; /* 요소들 사이 기본 간격 */
            }
            #sekai-translator-settings-ui .panel {
                 display: flex; align-items: center; gap: 10px; /* 간격 약간 줄임 */
                 flex-wrap: wrap; /* 패널 내부 요소도 줄바꿈 허용 */
             }
            /* API 키 입력 필드의 최소 너비 제거 또는 조정 */
            #sekai-translator-settings-ui input[type="text"] {
                padding: 6px 10px; border: 1px solid #555; background-color: #333;
                color: white;
                /* min-width: 350px; */ /* !!!! 제거 또는 줄임 !!!! */
                flex-grow: 1; /* 가능한 공간 차지하도록 */
                min-width: 200px; /* 최소 너비는 유지 (선택 사항) */
                border-radius: 4px; box-sizing: border-box;
            }
            #sekai-translator-settings-ui button {
                padding: 6px 12px; cursor: pointer; background-color: #4CAF50;
                color: white; border: none; border-radius: 4px; white-space: nowrap;
                 flex-shrink: 0; /* 버튼 크기 줄어들지 않도록 */
            }
            #sekai-translator-settings-ui button:hover { opacity: 0.9; }
            #sekai-translator-settings-ui .status-message { font-size: 0.9em; margin-left: 5px; min-width: 100px; text-align: left; flex-basis: 100%; order: 3; /* 상태 메시지는 줄바꿈 시 아래로 */ }
            #sekai-translator-settings-ui a { color: #87CEEB; text-decoration: none; white-space: nowrap; }
            #sekai-translator-settings-ui a:hover { text-decoration: underline; }
            #sekai-translator-settings-ui .switch-container { display: flex; align-items: center; margin-left: auto; /* 스위치는 오른쪽으로 밀기 (기본) */ }
            #sekai-translator-settings-ui .switch { position: relative; display: inline-block; width: 40px; height: 20px; margin-left: 8px; }
            #sekai-translator-settings-ui .switch input { opacity: 0; width: 0; height: 0; }
            #sekai-translator-settings-ui .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 20px; transition: .4s; }
            #sekai-translator-settings-ui .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s; }
            #sekai-translator-settings-ui input:checked + .slider { background-color: #2196F3; }
            #sekai-translator-settings-ui input:checked + .slider:before { transform: translateX(20px); }
            #sekai-translator-settings-ui .close-button { background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; padding: 0 5px; line-height: 1; margin-left: 10px; }
            #sekai-translator-settings-ui .close-button:hover { color: white; }
             /* 키 발급 링크 스타일 */
            #sekai-translator-settings-ui span > a { flex-shrink: 0; margin-left: 5px;}
             /* --- 기존 스타일 끝 --- */


            /* !!!! --- 미디어 쿼리 시작 --- !!!! */
            /* 화면 너비가 768px 이하일 때 적용될 스타일 */
            @media (max-width: 768px) {
                #sekai-translator-settings-ui {
                    flex-direction: column; /* 세로 쌓기 */
                    align-items: stretch; /* 항목들 너비 채우기 */
                    padding: 10px; /* 패딩 줄이기 */
                    gap: 8px; /* 세로 간격 */
                }
                #sekai-translator-settings-ui .panel {
                    width: 100%; /* 패널 너비 100% */
                    gap: 8px; /* 내부 요소 간격 줄이기 */
                    justify-content: flex-start; /* 왼쪽 정렬 */
                }
                #sekai-translator-settings-ui input[type="text"] {
                    min-width: 150px; /* 모바일 최소 너비 */
                    flex-basis: auto; /* 너비 자동 조절 */
                }
                 #sekai-translator-settings-ui .status-message {
                     margin-left: 0; /* 왼쪽 여백 제거 */
                     margin-top: 5px; /* 위쪽 여백 추가 */
                     order: 0; /* 순서 원래대로 (필요시 조절) */
                     flex-basis: auto; /* 너비 자동 */
                 }
                 #sekai-translator-settings-ui .switch-container {
                     margin-left: 0; /* 자동 마진 제거 */
                     /* 필요하다면 오른쪽 패널 내 다른 요소들과의 정렬 조정 */
                     justify-content: flex-end; /* 오른쪽 정렬 시도 */
                     width: 100%;
                 }
                 #sekai-translator-settings-ui .close-button {
                     order: 1; /* 닫기 버튼을 스위치보다 앞으로 (선택적) */
                 }

            }
            /* !!!! --- 미디어 쿼리 끝 --- !!!! */
        `);

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'sekai-translator-settings-ui';

        const leftPanel = document.createElement('div');
        leftPanel.className = 'panel';
        leftPanel.innerHTML = `
            <label for="gmApiKeyInput">Gemini API Key:</label>
            <input type="text" id="gmApiKeyInput" placeholder="API 키 입력 후 Enter 또는 저장 버튼 클릭">
            <button id="gmSaveApiKeyBtn">저장</button>
            <span id="gmApiStatus" class="status-message"></span>
            <span><a href="https://aistudio.google.com/app/apikey?hl=ko" target="_blank" title="Get API Key">키 발급</a></span>
        `;
        settingsDiv.appendChild(leftPanel);

        const rightPanel = document.createElement('div');
        rightPanel.className = 'panel';
        rightPanel.innerHTML = `
            <div class="switch-container">
                <label for="gmEnableSwitch">번역 활성화</label>
                <label class="switch">
                  <input type="checkbox" id="gmEnableSwitch">
                  <span class="slider"></span>
                </label>
            </div>
            <button id="gmCloseSettingsBtn" class="close-button" title="설정 창 닫기">×</button>
        `;
        settingsDiv.appendChild(rightPanel);

        if (document.body) {
             document.body.appendChild(settingsDiv);
        } else {
             document.addEventListener('DOMContentLoaded', () => {
                 if (!document.getElementById('sekai-translator-settings-ui')) {
                      document.body.appendChild(settingsDiv);
                 }
             });
        }

        const apiKeyInput = document.getElementById('gmApiKeyInput');
        const saveButton = document.getElementById('gmSaveApiKeyBtn');
        const statusSpan = document.getElementById('gmApiStatus');
        const enableSwitch = document.getElementById('gmEnableSwitch');
        const closeButton = document.getElementById('gmCloseSettingsBtn');

        apiKeyInput.value = config.apiKey;
        enableSwitch.checked = config.isEnabled;
        if (!config.apiKey) {
            statusSpan.textContent = 'API 키를 입력하세요.';
            statusSpan.style.color = 'orange';
        }

        const saveApiKey = async () => { /* ... 이전과 동일 ... */
            const newApiKey = apiKeyInput.value.trim();
            if (!newApiKey) { statusSpan.textContent = 'API 키를 입력하세요.'; statusSpan.style.color = 'orange'; return; }
            await GM_setValue('geminiApiKey', newApiKey);
            config.apiKey = newApiKey;
            console.log('Sekai Translator Script: API Key saved.');
            statusSpan.textContent = 'API 키 저장됨!'; statusSpan.style.color = 'lightgreen';
            setTimeout(() => { statusSpan.textContent = ''; }, 2000);
        };
        const handleEnableSwitchChange = async () => { /* ... 이전과 동일 ... */
             const isEnabled = enableSwitch.checked;
             await GM_setValue('isTranslationEnabled', isEnabled);
             config.isEnabled = isEnabled;
             console.log(`Sekai Translator Script: Translation ${isEnabled ? 'ENABLED' : 'DISABLED'}. Refresh page to apply changes.`);
             statusSpan.textContent = `번역 ${isEnabled ? '활성화' : '비활성화'}됨 (페이지 새로고침 필요)`; statusSpan.style.color = 'lightblue';
             setTimeout(() => { statusSpan.textContent = ''; }, 3000);
        };

        saveButton.onclick = saveApiKey;
        apiKeyInput.onkeydown = (e) => { if (e.key === 'Enter') { saveApiKey(); } };
        enableSwitch.onchange = handleEnableSwitchChange;
        closeButton.onclick = () => {
             const ui = document.getElementById('sekai-translator-settings-ui');
             if(ui) ui.style.display = 'none';
        };
    }

     // --- 설정 UI 토글 버튼 생성 함수 ---
    function createSettingsToggleButton() {
        if (document.getElementById('sekai-translator-toggle-button')) return;
        console.log("Sekai Translator Script: Creating settings toggle button...");

        GM_addStyle(`
            #sekai-translator-toggle-button {
                position: fixed; bottom: 20px; right: 20px; z-index: 99998;
                padding: 8px 12px; background-color: rgba(0, 0, 0, 0.7); color: white;
                border: 1px solid #666; border-radius: 5px; cursor: pointer;
                font-size: 13px; opacity: 0.8; transition: opacity 0.3s, background-color 0.3s;
            }
            #sekai-translator-toggle-button:hover { opacity: 1.0; background-color: rgba(0, 0, 0, 0.9); }
        `);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'sekai-translator-toggle-button';
        toggleButton.textContent = '⚙️ 번역 설정';

        toggleButton.onclick = () => {
            console.log("Sekai Translator Script: Toggle button clicked.");
            let settingsUI = document.getElementById('sekai-translator-settings-ui');
            if (!settingsUI) {
                console.log("Sekai Translator Script: Settings UI not found, creating...");
                createSettingsUI();
                settingsUI = document.getElementById('sekai-translator-settings-ui');
                if (settingsUI) {
                    console.log("Sekai Translator Script: Settings UI created and showing.");
                    settingsUI.style.display = 'flex';
                } else { console.error("Sekai Translator Script: Failed to create settings UI!"); }
            } else {
                if (settingsUI.style.display === 'none') {
                    console.log("Sekai Translator Script: Showing existing settings UI.");
                    settingsUI.style.display = 'flex';
                } else {
                    console.log("Sekai Translator Script: Hiding existing settings UI.");
                    settingsUI.style.display = 'none';
                }
            }
        };

        if (document.body) { document.body.appendChild(toggleButton); }
        else { document.addEventListener('DOMContentLoaded', () => { if (!document.getElementById('sekai-translator-toggle-button')) { document.body.appendChild(toggleButton); } }); }
    }

    // --- DOM 로드 완료 후 UI 초기화 ---
    function initializeUIAndButton() {
        if (window.self === window.top) {
             createSettingsToggleButton(); // 버튼은 항상 생성
             if (!config.apiKey) { // API 키 없으면 UI도 바로 생성 및 표시
                createSettingsUI();
                 const settingsUI = document.getElementById('sekai-translator-settings-ui');
                 if(settingsUI) settingsUI.style.display = 'flex';
             }
        }
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeUIAndButton); }
    else { initializeUIAndButton(); }


    // --- 번역 기능 활성화 및 API 키 확인 ---
    if (!config.isEnabled) { console.log("Sekai Translator Script: Translation is DISABLED."); return; }
    if (!config.apiKey) { console.warn("Sekai Translator Script: API Key is missing. Translation inactive."); return; }

    console.log("Sekai Translator Script: Translation is ENABLED and API Key found. Hooking XHR...");

    // --- XHR 가로채기 로직 ---
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    const xhrStates = new WeakMap();
    const targetAssetUrlPattern = /storage\.sekai\.best\/sekai-jp-assets\/(scenario\/|character\/(member\/res\d+_no\d+\/|card_story\/scenario\/)|event_story\/.*\/scenario\/|virtual_live\/.*\/scenario\/).*\.asset$/i;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) { /* ... 이전과 동일 ... */
      let isTarget = false;
      if (typeof url === 'string' && targetAssetUrlPattern.test(url)) { isTarget = true; }
      xhrStates.set(this, { url: url, method: method, isTarget: isTarget, async: rest.length > 0 ? rest[0] !== false : true });
      return originalXhrOpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function(...args) { /* ... 이전과 동일 ... */
      const state = xhrStates.get(this);
      if (state && state.isTarget && config.isEnabled && config.apiKey) {
        console.log('Sekai Translator [XHR]: Intercepted send() for target asset pattern:', state.url);
        console.log('Sekai Translator [XHR]: Blocking original request and re-fetching manually...');
        processManually(this, state.url, state.method);
        return;
      } else { return originalXhrSend.apply(this, args); }
    };

    // --- 수동 처리 함수 ---
    async function processManually(xhrInstance, url, method) { /* ... 시작 부분 확인 로직 동일 ... */
      if (!config.isEnabled || !config.apiKey) { /* ... 비활성화 또는 API 키 없음 처리 ... */ return; }
      try {
        console.log(`Sekai Translator [Manual Fetch]: Fetching ${url} via GM_xmlhttpRequest...`);
        const response = await new Promise((resolve, reject) => { GM_xmlhttpRequest({ /* ... GM_xmlhttpRequest 설정 ... */
            method: method.toUpperCase(), url: url, responseType: 'text',
            onload: res => (res.status >= 200 && res.status < 300) ? resolve(res) : reject(new Error(`GM_xmlhttpRequest failed: ${res.status}`)),
            onerror: res => reject(new Error(`GM_xmlhttpRequest error: ${res.error}`)),
            ontimeout: () => reject(new Error('GM_xmlhttpRequest timed out.'))
        }); });
        const originalTextData = response.responseText;
        console.log("Sekai Translator [Manual Fetch]: Original data fetched.");

        const textsToTranslate = extractJapaneseTextsFromAsset(originalTextData, url); // !!!! 수정 필요 !!!!
        let modifiedTextData = originalTextData;

        if (textsToTranslate && textsToTranslate.length > 0) {
          console.log(`Sekai Translator [Manual Fetch]: Found ${textsToTranslate.length} texts to translate.`);
          try {
            const translatedTexts = await requestTranslationViaGmXhr(textsToTranslate); // API 호출 함수 사용
            modifiedTextData = replaceJapaneseWithKorean(originalTextData, textsToTranslate, translatedTexts, url); // !!!! 수정 필요 !!!!
            console.log("Sekai Translator [Manual Fetch]: Text replaced with translation.");
          } catch (translationError) { console.error('Sekai Translator [Manual Fetch]: Translation/replacement failed:', translationError); }
        } else { console.log('Sekai Translator [Manual Fetch]: No Japanese text found to translate.'); }

        // XHR 상태 업데이트 및 이벤트 디스패치
        console.log("Sekai Translator [Manual Fetch]: Manually setting XHR properties and dispatching events...");
        Object.defineProperties(xhrInstance, { /* ... 상태 설정 ... */
          readyState: { value: 4, writable: true, configurable: true }, status: { value: response.status, writable: true, configurable: true },
          statusText: { value: response.statusText, writable: true, configurable: true }, response: { value: modifiedTextData, writable: true, configurable: true },
          responseText: { value: modifiedTextData, writable: true, configurable: true }, responseURL: { value: response.finalUrl || url, writable: true, configurable: true }
        });
        // 이벤트 디스패치
        if (typeof xhrInstance.onreadystatechange === 'function') { try { xhrInstance.onreadystatechange(); } catch (e) {}}
        if (typeof xhrInstance.onload === 'function') { try { xhrInstance.onload(); } catch (e) {}}
        if (typeof xhrInstance.onloadend === 'function') { try { xhrInstance.onloadend(); } catch (e) {}}
        console.log("Sekai Translator [Manual Fetch]: Manual processing complete.");
      } catch (error) { /* ... 오류 처리 ... */
        console.error('Sekai Translator [Manual Fetch]: Error during manual processing:', error);
        Object.defineProperties(xhrInstance, { /* ... 오류 상태 설정 ... */ });
        if (typeof xhrInstance.onerror === 'function') { try { xhrInstance.onerror(); } catch (e) {}}
        if (typeof xhrInstance.onloadend === 'function') { try { xhrInstance.onloadend(); } catch (e) {}}
      }
    }

    // --- Gemini API 호출 함수 (GM_xmlhttpRequest 사용) ---
    async function requestTranslationViaGmXhr(texts) {
        if (!config.apiKey) throw new Error("API Key is missing.");
        if (!texts || texts.length === 0) return [];

        const modelName = "gemini-2.0-flash";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`;
        const delimiter = "<--SEP-->";
        const combinedTextPrompt = texts.join(delimiter);
        const prompt = `This is Project Sekai's script. Please translate each of the following Japanese texts (separated by "${delimiter}") into Korean. Respond with only the translated Korean texts, also separated by "${delimiter}. Please remain all ${delimiter}". Include no other explanatory text or markdown formatting.\n\n--- Japanese Texts Start ---\n${combinedTextPrompt}\n--- Japanese Texts End ---`;

        // !!!! 요청 본문 형식 "그대로" 사용 !!!!
        const requestBody = {
          contents: [{ parts: [{ text: prompt }] }]
          // generationConfig, safetySettings 등은 API 기본값 사용 (필요시 추가)
        };

        console.log(`Sekai Translator [GM_XHR]: Sending request to Gemini API (${modelName})...`);
        // console.log("Sekai Translator [GM_XHR]: Request Body:", JSON.stringify(requestBody, null, 2)); // 디버깅 필요시 주석 해제

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url: apiUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(requestBody),
                responseType: 'json', timeout: 60000,
                onload: function(response) {
                    // ... (응답 처리 및 개수 검증 로직은 이전과 동일) ...
                     if (response.status === 200 && response.response) {
                        console.log("Sekai Translator [GM_XHR]: Received response from Gemini API.");
                        const resultData = response.response;
                        let combinedTranslatedText = "";
                        try {
                            combinedTranslatedText = resultData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                            if (!combinedTranslatedText) { throw new Error('Translation text not found in API response.'); }
                            const translatedTexts = combinedTranslatedText.split(delimiter).map(t => t.trim().replace(/^["|]*(.*?)["]|]*$/g, '$1'));
                            if (translatedTexts.length !== texts.length) {
                                console.warn(`Count mismatch: ${translatedTexts.length}/${texts.length}.`);
                                reject(new Error(`Translation count mismatch: ${translatedTexts.length}/${texts.length}`));
                            } else {
                                console.log("Sekai Translator [GM_XHR]: Translation successful.");
                                resolve(translatedTexts);
                            }
                        } catch (parseError) { reject(new Error('Failed to parse translation result.')); }
                    } else { reject(new Error(`Gemini API error: ${response.status} - ${response.responseText}`)); }
                },
                onerror: res => reject(new Error(`Network error: ${res.error}`)),
                ontimeout: () => reject(new Error('Gemini API request timed out.'))
            });
        });
    }

    function extractJapaneseTextsFromAsset(textData, url) { /* ... 이전 로직 또는 수정된 로직 ... */
         console.log(`Sekai Translator: Extracting Japanese text from ${url} (Robust approach needed!)`);
        if (!textData) return []; let japaneseTexts = [];
        try {
            const regex = /^\s*"(WindowDisplayName|Body|Name|Thought|serif|Message)"\s*:\s*"(.*?)",?$/gm;
            let match;
            while ((match = regex.exec(textData)) !== null) {
                let extracted = match[2];
                if (extracted && extracted.length > 0 && /\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u.test(extracted)) {
                    extracted = extracted.replace(/\\n/g, '\n');
                    japaneseTexts.push(extracted);
                }
            }
             // console.log(`Sekai Translator: Extracted ${japaneseTexts.length} texts using regex.`);
        } catch (e) { console.error("Sekai Translator: Error during text extraction:", e); }
        console.log(`Sekai Translator: Finished extraction. Found ${japaneseTexts.length} texts.`);
        return japaneseTexts;
    }
    function replaceJapaneseWithKorean(originalTextData, originalJapanese, translatedKorean, url) { /* ... 이전 로직 또는 수정된 로직 ... */
         console.log(`Sekai Translator: Replacing text in ${url} (Robust approach needed!)`);
        let modifiedText = originalTextData;
        if (!originalJapanese || !translatedKorean || originalJapanese.length !== translatedKorean.length) {
            console.warn(`Sekai Translator: Mismatch text count (${originalJapanese?.length}/${translatedKorean?.length}). Returning original data.`);
            return originalTextData;
        }
        try {
            let k_idx = 0;
            const regex = /^(\s*"(?:WindowDisplayName|Body|Name|Thought|serif|Message)"\s*:\s*")(.*?)("?,?)$/gm;
            modifiedText = originalTextData.replace(regex, (match, prefix, originalValue, suffix) => {
                 if (k_idx < originalJapanese.length && originalValue === originalJapanese[k_idx].replace(/\n/g, '\\n')) {
                     if (k_idx < translatedKorean.length) {
                         const translatedEscaped = translatedKorean[k_idx].replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
                         k_idx++;
                         return prefix + translatedEscaped + suffix;
                     } else { return match; }
                 }
                 return match;
            });
             if (k_idx < originalJapanese.length) { console.warn(`Replacement warning: ${originalJapanese.length - k_idx} items were not replaced.`); }
        } catch (e) { console.error("Sekai Translator: Error during text replacement:", e); return originalTextData; }
        console.log("Sekai Translator: Text replacement finished.");
        return modifiedText;
    }

})(); // 즉시 실행 함수 끝