// ==UserScript==
// @name        Arca.live 미니멀 EXIF 뷰어
// @namespace   https://github.com/gemini-exif-viewer
// @match       https://arca.live/*
// @version     1.3.0
// @author      AI Assistant (Gemini)
// @description Arca.live에서 이미지를 클릭하면 깔끔한 팝업으로 EXIF 정보를 보여줍니다. (GM_xmlhttpRequest 사용)
// @require     https://greasyfork.org/scripts/452821-upng-js/code/UPNGjs.js?version=1103227
// @require     https://cdn.jsdelivr.net/npm/casestry-exif-library@2.0.3/dist/exif-library.min.js
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/537088/Arcalive%20%EB%AF%B8%EB%8B%88%EB%A9%80%20EXIF%20%EB%B7%B0%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/537088/Arcalive%20%EB%AF%B8%EB%8B%88%EB%A9%80%20EXIF%20%EB%B7%B0%EC%96%B4.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- 스타일(CSS) 정의 ---
    const modalCSS = /* css */`
        #exif-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 99998;
            display: none; /* 기본 숨김 */
            justify-content: center;
            align-items: center;
            font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
        }
        #exif-modal-content {
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 99999;
            position: relative;
        }
        #exif-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.8em;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
            line-height: 1;
        }
        #exif-modal-close:hover {
            color: #333;
        }
        #exif-modal-title {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .exif-section {
            margin-bottom: 20px;
        }
        .exif-section h3 {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 10px;
            color: #555;
        }
        .exif-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            font-size: 0.9em;
            line-height: 1.6;
        }
        .exif-grid-item {
            background-color: #f9f9f9;
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 3px solid #007bff;
        }
        .exif-grid-item strong {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 3px;
        }
        .exif-grid-item span {
            color: #666;
            word-break: break-all;
        }
        #exif-prompt-box, #exif-negative-box {
            font-size: 0.85em;
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid #ddd;
            line-height: 1.5;
            color: #444;
            word-break: break-word;
        }
        #exif-raw-box {
            font-size: 0.8em;
            background-color: #2d2d2d;
            color: #c7c7c7;
            padding: 15px;
            border-radius: 5px;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap; /* 자동 줄바꿈 */
            word-break: break-all;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        .exif-buttons-container {
            margin-top: 15px;
            text-align: right; /* 버튼들을 오른쪽으로 정렬 */
        }
        #exif-copy-button, #exif-view-original-button {
            display: inline-block;
            margin-left: 10px; /* 버튼 사이 간격 */
            padding: 8px 15px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background-color 0.2s ease;
        }
        #exif-view-original-button {
            background-color: #007bff; /* 다른 색상 */
        }
        #exif-copy-button:hover {
            background-color: #218838;
        }
        #exif-view-original-button:hover {
            background-color: #0056b3;
        }
        #exif-copy-button.copied {
            background-color: #007bff;
        }
        .exif-loading {
            font-size: 1.2em;
            text-align: center;
            color: #555;
        }
        #exif-message { /* 일반 메시지 및 'EXIF 정보 없음'에 사용 */
            font-size: 1.1em;
            font-weight: bold;
            text-align: center;
            color: #555;
            padding: 20px;
        }
    `;
    GM_addStyle(modalCSS);

    // --- 모달(팝업창) 생성 및 제어 ---
    let overlay, modalContent, closeButton;
    let currentImageUrl = ''; // 원본 이미지 URL 저장을 위한 변수

    function createModal() {
        overlay = document.createElement('div');
        overlay.id = 'exif-modal-overlay';

        modalContent = document.createElement('div');
        modalContent.id = 'exif-modal-content';

        closeButton = document.createElement('span');
        closeButton.id = 'exif-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = hideModal;

        modalContent.appendChild(closeButton);
        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) hideModal();
        };
    }

    function showModal(contentHtml) {
        if (!overlay) createModal();
        modalContent.innerHTML = ''; // Clear previous content
        modalContent.appendChild(closeButton); // Re-add close button
        modalContent.insertAdjacentHTML('beforeend', contentHtml);
        overlay.style.display = 'flex';
    }

    function hideModal() {
        if (overlay) overlay.style.display = 'none';
    }

    function showLoading() {
        showModal('<div id="exif-modal-title">이미지 정보 로드 중...</div><div class="exif-loading">잠시만 기다려 주세요... ⚙️</div>');
    }

    // --- EXIF 처리 로직 ---
    function blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    async function extractImageMetadata(blob, type) {
        try {
            const base64 = await blobToBase64(blob);
            let metadata = {};
            switch (type) {
                case "image/jpeg":
                case "image/webp": {
                    const exif = exifLib.load(base64);
                    // A1111 parameters
                    const parameters = exif.Exif?.[37510]?.replace("UNICODE", "").replaceAll("\u0000", "");
                    if (parameters) {
                        metadata.parameters = parameters;
                    } else {
                        // 다른 일반적인 EXIF 정보도 추출 (예: Camera, Date, FNumber 등)
                        for (const tag in exif.Exif) {
                            if (typeof exif.Exif[tag] === 'string' || typeof exif.Exif[tag] === 'number') {
                                // 태그 이름으로 변환하여 저장 (선택적으로)
                                // 간단하게 태그 번호와 값만 저장
                                metadata[`Exif_${tag}`] = exif.Exif[tag];
                            }
                        }
                        for (const tag in exif.Image) {
                             if (typeof exif.Image[tag] === 'string' || typeof exif.Image[tag] === 'number') {
                                metadata[`Image_${tag}`] = exif.Image[tag];
                            }
                        }
                    }
                    break;
                }
                case "image/png": {
                    const arrayBuffer = await blob.arrayBuffer();
                    const chunks = UPNG.decode(arrayBuffer);
                    const parameters = chunks.tabs.tEXt?.parameters || chunks.tabs.iTXt?.parameters;
                    const description = chunks.tabs.tEXt?.Description || chunks.tabs.iTXt?.Description;
                    const comment = chunks.tabs.tEXt?.Comment || chunks.tabs.iTXt?.Comment;
                    if (parameters) { // A1111 형식
                        metadata.parameters = parameters;
                    } else if (description) { // NovelAI 또는 다른 PNG 텍스트 청크
                        metadata.Description = description;
                        metadata.Comment = comment;
                    }
                    break;
                }
            }
            return Object.keys(metadata).length > 0 ? metadata : null; // 추출된 메타데이터가 있으면 반환
        } catch (error) {
            console.error("EXIF 추출 오류:", error);
            return null;
        }
    }

    function parseMetadata(exif) {
        if (!exif) return null;

        let parsedData = {
            rawMetadata: JSON.stringify(exif, null, 2), // 모든 EXIF를 일단 raw로 저장
            isAIImage: false,
            prompt: "정보 없음",
            negativePrompt: "정보 없음",
            details: {}
        };

        try {
            if (exif.parameters) { // A1111 형식
                parsedData.isAIImage = true;
                parsedData.rawMetadata = exif.parameters; // A1111은 parameters 자체가 원본 데이터
                const params = exif.parameters;
                const negPromptIndex = params.indexOf("Negative prompt:");
                const stepsIndex = params.indexOf("Steps:");

                if (negPromptIndex > -1) {
                    parsedData.prompt = params.substring(0, negPromptIndex).trim();
                    parsedData.negativePrompt = params.substring(negPromptIndex + 16, stepsIndex).trim();
                } else {
                    parsedData.prompt = params.substring(0, stepsIndex).trim();
                }

                const details = params.substring(stepsIndex);
                const pairs = details.split(', ');
                pairs.forEach(pair => {
                    const [key, ...value] = pair.split(': ');
                    if (key && value.length > 0) {
                        parsedData.details[key.trim()] = value.join(': ').trim();
                    }
                });
                parsedData.details.Software = parsedData.details.Software || "A1111 WebUI";

            } else if (exif.Description) { // NovelAI 또는 다른 PNG 텍스트 청크
                // NovelAI 여부 판단 강화 (Comment에 JSON 형태가 있는지)
                if (exif.Comment) {
                    try {
                        const commentJson = JSON.parse(exif.Comment);
                        if (commentJson.uc || commentJson.steps || commentJson.sampler) {
                            parsedData.isAIImage = true;
                            parsedData.prompt = exif.Description;
                            parsedData.negativePrompt = commentJson.uc || "정보 없음";
                            parsedData.details.Steps = commentJson.steps;
                            parsedData.details.Sampler = commentJson.sampler;
                            parsedData.details["CFG scale"] = commentJson.scale;
                            parsedData.details.Seed = commentJson.seed;
                            parsedData.details.Software = "NovelAI";
                        }
                    } catch (e) {
                        // Comment가 JSON이 아니거나 NovelAI 형식이 아니면 일반 Description으로 처리
                        parsedData.prompt = exif.Description;
                        parsedData.details.Software = "Unknown (PNG Description)";
                    }
                } else {
                    parsedData.prompt = exif.Description;
                    parsedData.details.Software = "Unknown (PNG Description)";
                }
            } else { // 일반 EXIF 정보 (parameters, Description 없음)
                parsedData.isAIImage = false;
                parsedData.prompt = "AI 프롬프트 정보 없음"; // AI 프롬프트는 없음을 명확히
                parsedData.negativePrompt = "AI 프롬프트 정보 없음";
                // 일반 EXIF 정보들을 details에 추가
                for (const key in exif) {
                    // 'Exif_' 또는 'Image_' 접두사를 제거하여 보기 좋게 만듦
                    const readableKey = key.replace(/^(Exif|Image)_/, '');
                    parsedData.details[readableKey] = exif[key];
                }
            }
        } catch (error) {
            console.error("메타데이터 파싱 오류:", error);
            parsedData.prompt = "EXIF 파싱 오류";
            parsedData.negativePrompt = "EXIF 파싱 오류";
            parsedData.rawMetadata = JSON.stringify(exif, null, 2); // 오류 시에도 rawMetadata는 보존
        }
        return parsedData;
    }

    // --- GM_xmlhttpRequest를 사용하여 이미지 로드 ---
    function fetchImageBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { 'Referer': 'https://arca.live/' },
                responseType: 'blob', // Blob으로 응답 받기
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.response); // 성공 시 Blob 반환
                    } else {
                        reject(new Error(`이미지 로드 실패: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`네트워크 오류: ${error.statusText || 'Unknown'}`));
                },
                ontimeout: function() {
                    reject(new Error("요청 시간 초과"));
                }
            });
        });
    }

    async function fetchAndExtract(url) {
        showLoading();
        currentImageUrl = url.replace("ac.namu.la", "ac-o.namu.la").replace("&type=orig", "") + "&type=orig"; // 원본 URL 저장

        try {
            const blob = await fetchImageBlob(currentImageUrl);
            const type = blob.type;

            if (!/image\/(jpeg|png|webp)/.test(type)) {
                // 지원하지 않는 이미지 형식이라도 원본 보기 기능은 제공
                displayModal({ rawMetadata: "지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP만 EXIF 정보 확인 가능)", isAIImage: false, prompt: "정보 없음", negativePrompt: "정보 없음", details: {} }, true);
                return;
            }

            const exifData = await extractImageMetadata(blob, type);
            const parsedData = parseMetadata(exifData);

            displayModal(parsedData, false); // EXIF 유무와 상관없이 모달 표시

        } catch (error) {
            console.error("이미지 처리 오류:", error);
            // 오류 발생 시에도 최소한 원본 보기 버튼은 유지
            displayModal({ rawMetadata: `이미지 로드 및 처리 중 오류 발생: ${error.message}`, isAIImage: false, prompt: "정보 없음", negativePrompt: "정보 없음", details: {} }, true);
        }
    }

    // --- 모달 내용 표시 ---
    function displayModal(data, hasErrorOrNoSupportedExif = false) {
        let contentHtml = '';

        if (hasErrorOrNoSupportedExif || !data || (!data.rawMetadata && !data.prompt)) {
            // EXIF 정보가 없거나 지원되지 않는 형식, 또는 오류 발생 시
            contentHtml = /* html */`
                <div id="exif-modal-title">🖼️ 이미지 정보</div>
                <div id="exif-message">EXIF 정보를 찾을 수 없거나 지원되지 않는 형식입니다. 😢</div>
                <div class="exif-buttons-container" style="text-align: center;">
                    <button id="exif-view-original-button">원본 이미지 보기</button>
                </div>
            `;
        } else {
            // EXIF 정보가 있는 경우 (AI 그림 형식 여부와 무관)
            contentHtml += /* html */`
                <div id="exif-modal-title">🖼️ 이미지 정보</div>
            `;

            // AI 그림 형식일 경우에만 프롬프트 및 부정 프롬프트 표시
            if (data.isAIImage) {
                contentHtml += /* html */`
                    <div class="exif-section">
                        <h3>긍정 프롬프트</h3>
                        <div id="exif-prompt-box">${data.prompt || '정보 없음'}</div>
                    </div>
                    <div class="exif-section">
                        <h3>부정 프롬프트</h3>
                        <div id="exif-negative-box">${data.negativePrompt || '정보 없음'}</div>
                    </div>
                `;
            }

            // 모든 상세 정보 (AI 정보든 일반 EXIF 정보든)
            const detailKeys = Object.keys(data.details).sort(); // 키를 정렬하여 일관성 유지
            if (detailKeys.length > 0) {
                contentHtml += /* html */`
                    <div class="exif-section">
                        <h3>세부 정보</h3>
                        <div class="exif-grid">
                `;
                detailKeys.forEach(key => {
                    contentHtml += `<div class="exif-grid-item"><strong>${key}:</strong> <span>${data.details[key]}</span></div>`;
                });
                contentHtml += /* html */`
                        </div>
                    </div>
                `;
            } else if (!data.isAIImage) { // AI 이미지가 아닌데 details도 없으면
                contentHtml += /* html */`
                    <div class="exif-section">
                        <div id="exif-message">추출할 수 있는 세부 EXIF 정보가 없습니다.</div>
                    </div>
                `;
            }


            contentHtml += /* html */`
                <div class="exif-section">
                    <h3>원본 데이터 (Raw)</h3>
                    <div id="exif-raw-box">${data.rawMetadata || '원본 데이터 없음'}</div>
                    <div class="exif-buttons-container">
                        <button id="exif-copy-button">원본 데이터 복사</button>
                        <button id="exif-view-original-button">원본 이미지 보기</button>
                    </div>
                </div>
            `;
        }

        showModal(contentHtml);

        // 버튼 이벤트 리스너는 항상 추가 (모달 내용이 바뀌므로 새로 찾아야 함)
        const copyButton = document.getElementById('exif-copy-button');
        const rawBox = document.getElementById('exif-raw-box');
        if (copyButton && rawBox) {
            copyButton.onclick = () => {
                GM_setClipboard(rawBox.textContent, 'text');
                copyButton.textContent = '복사 완료! ✅';
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.textContent = '원본 데이터 복사';
                    copyButton.classList.remove('copied');
                }, 1500);
            };
        }

        const viewOriginalButton = document.getElementById('exif-view-original-button');
        if (viewOriginalButton) {
            viewOriginalButton.onclick = () => {
                if (currentImageUrl) {
                    window.open(currentImageUrl, '_blank');
                }
            };
        }
    }

    // --- Arca.live 이미지 클릭 감지 ---
    document.addEventListener('click', (event) => {
        let target = event.target;
        let imageUrl = '';

        // 썸네일 이미지 클릭 시 (data-src 속성을 가진 경우)
        if (target.tagName === 'IMG' && target.dataset.src) {
            imageUrl = target.dataset.src;
        }

        // 일반 이미지 클릭 시 또는 data-src가 없는 경우 (부모 a 태그의 href 확인)
        if (!imageUrl && target.tagName === 'IMG') {
            let link = target.closest('a[href*="&type=orig"]');
            if (link) {
                imageUrl = link.href;
            }
        }

        if (imageUrl) {
            event.preventDefault();
            event.stopPropagation();
            fetchAndExtract(imageUrl);
        }
    }, true);

    console.log("Arca.live 미니멀 EXIF 뷰어 (GM_xmlhttpRequest) 활성화됨.");

})();