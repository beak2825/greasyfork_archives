// ==UserScript==
// @name         Rapidbooru
// @name:ko      Rapidbooru
// @namespace    Violentmonkey Scripts
// @match        *://danbooru.donmai.us/*
// @grant        none
// @version      250710.2
// @author       -
// @license      MIT
// @description  이미지/태그 우클릭 프리뷰 기능, 편리한 태그 복사
// @icon         https://i.imgur.com/FxoAjfI.png
// @downloadURL https://update.greasyfork.org/scripts/540546/Rapidbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/540546/Rapidbooru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 프리뷰 및 관련 태그 페이지에서 사용할 태그 리스트
    let selectedTags = [];
    let relatedPageSelectedTags = [];
    // [추가] 사이드바 태그 선택 임시 리스트
    let sidebarSelectedTags = [];

    // 태그 카테고리별 색상 매핑 (사이드바 태그 컨테이너용)
    const tagColors = {
        artist: '#e67e22',
        copyright: '#2980b9',
        character: '#8e44ad',
        general: '#2ecc71',
        meta: '#95a5a6'
    };

    // CSS 스타일 추가
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #rapidbooru-settings-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--rapidbooru-accent-color);
                border: none;
                border-radius: 50%;
                color: var(--rapidbooru-text-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10002;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            #rapidbooru-settings-btn:hover {
                background: var(--rapidbooru-accent-hover-color);
                transform: translateY(-2px);
            }

            /* Consolas 폰트 적용 */
            * {
                font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace !important;
            }

            /* 버튼 스타일 개선 */
            .ui-button, button, input[type="submit"], input[type="button"], .button {
                background: linear-gradient(135deg, var(--rapidbooru-accent-color) 0%, var(--rapidbooru-accent-hover-color) 100%) !important;
                border: none !important;
                border-radius: 6px !important;
                color: var(--rapidbooru-text-color) !important;
                padding: 8px 16px !important;
                margin: 4px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                font-weight: 500 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            }

            .ui-button:hover, button:hover, input[type="submit"]:hover, input[type="button"]:hover, .button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
                background: linear-gradient(135deg, var(--rapidbooru-accent-hover-color) 0%, var(--rapidbooru-accent-color) 100%) !important;
            }

            /* 네비게이션 버튼 정렬 */
            .navbar, .nav, .navigation {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                flex-wrap: wrap !important;
            }

            /* 검색 폼 정렬 */
            .search-form, #search-form {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin: 10px 0 !important;
            }

            /* 페이지네이션 정렬 */
            .paginator, .pagination {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 4px !important;
                margin: 20px 0 !important;
            }

            /* 프리뷰 오버레이 스타일 */
            .rapidbooru-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .rapidbooru-overlay.show {
                opacity: 1;
            }

            .rapidbooru-preview {
                width: 75vw;
                height: 75vh;
                background: var(--rapidbooru-bg-color);
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                display: flex;
                overflow: hidden;
                position: relative;
            }

            .rapidbooru-close,
            .rapidbooru-newtab {
                position: absolute;
                top: 15px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                border: none;
                color: var(--rapidbooru-text-color);
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10001;
                transition: background 0.3s ease;
            }
            .rapidbooru-close:hover,
            .rapidbooru-newtab:hover {
                background: rgba(255,255,255,0.3);
            }
            .rapidbooru-close {
                right: 15px;
            }
            .rapidbooru-newtab {
                right: 61px;
            }
            .rapidbooru-newtab svg {
                display: block;
            }

            .rapidbooru-tags {
                width: 40%;
                padding: 20px;
                background: var(--rapidbooru-secondary-bg-color);
                overflow-y: auto;
                border-right: 1px solid var(--rapidbooru-border-color);
            }

            .rapidbooru-content {
                width: 60%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                position: relative;
            }

            .rapidbooru-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }

            .rapidbooru-wiki {
                width: 100%;
                height: 80%;
                border: none;
                border-radius: 8px;
                background: white;
            }

            .rapidbooru-buttons {
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
            }

            .rapidbooru-btn {
                background: linear-gradient(135deg, var(--rapidbooru-accent-color) 0%, var(--rapidbooru-accent-hover-color) 100%);
                border: none;
                border-radius: 6px;
                color: var(--rapidbooru-text-color);
                padding: 10px 20px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            }

            .rapidbooru-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                background: linear-gradient(135deg, var(--rapidbooru-accent-hover-color) 0%, var(--rapidbooru-accent-color) 100%);
            }

            /* 태그 카테고리 박스 스타일 */
            .rapidbooru-category-box {
                margin-bottom: 10px;
                padding: 8px 12px;
                background: var(--rapidbooru-secondary-bg-color);
                border-radius: 4px;
                border-left: 4px solid var(--rapidbooru-accent-color);
                font-size: 12px;
                color: var(--rapidbooru-text-color);
                font-family: 'Consolas', monospace;
                min-height: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rapidbooru-category-tags-wrapper {
                flex-grow: 1;
                word-break: break-word;
            }

            .rapidbooru-category-copy-btn {
                flex-shrink: 0;
                width: 28px;
                height: 28px;
                background: #555 !important;
                padding: 0 !important;
                margin: 0 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: none !important;
            }

            .rapidbooru-category-copy-btn:hover {
                background: #666 !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
            }

            .rapidbooru-category-copy-btn.copied,
            .rapidbooru-category-copy-btn.copied:hover {
                background: #28a745 !important;
                transform: translateY(0) !important;
            }

            .rapidbooru-category-copy-btn svg {
                width: 16px;
                height: 16px;
                fill: var(--rapidbooru-text-color);
            }

            .rapidbooru-category-label {
                color: var(--rapidbooru-accent-color);
                font-weight: bold;
                margin-right: 5px;
            }

            /* 태그 버튼 스타일 */
            .rapidbooru-tag-button {
                display: inline-block;
                background: var(--rapidbooru-border-color);
                color: var(--rapidbooru-text-color);
                padding: 6px 10px;
                margin: 3px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                font-family: 'Consolas', monospace;
                user-select: none;
                text-decoration: none;
            }

            .rapidbooru-tag-button:hover {
                background: #555;
                transform: translateY(-1px);
            }

            .rapidbooru-tag-button.selected {
                background: var(--rapidbooru-accent-color);
                border-color: var(--rapidbooru-accent-hover-color);
                box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            }

            .rapidbooru-tag-button.selected:hover {
                background: var(--rapidbooru-accent-hover-color);
            }

            /* 카테고리 태그(artist/style/character) 링크는 선택 효과 없음 */
            .rapidbooru-category-tags-wrapper a.rapidbooru-tag-button.selected {
                background: var(--rapidbooru-border-color) !important;
                border-color: transparent !important;
                box-shadow: none !important;
            }
            .rapidbooru-category-tags-wrapper a.rapidbooru-tag-button:hover {
                background: #555 !important;
            }

            /* 메인 태그 컨테이너 */
            .rapidbooru-main-tags {
                background: var(--rapidbooru-bg-color);
                padding: 15px;
                border-radius: 6px;
                margin-top: 10px;
                max-height: 200px;
                overflow-y: auto;
            }

            /* 복사 버튼 개선 */
            .rapidbooru-copy-btn {
                margin-top: 15px;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                border: none;
                color: var(--rapidbooru-text-color);
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Consolas', monospace;
                font-weight: 500;
                transition: all 0.3s ease;
                width: 100%;
            }

            .rapidbooru-copy-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
                background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
            }

            .rapidbooru-copy-btn.copied {
                background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            }

            /* 액션 버튼 컨테이너 */
            .rapidbooru-action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            .rapidbooru-action-buttons .rapidbooru-copy-btn {
                width: auto; /* Override width */
                flex-grow: 1; /* Allow buttons to grow */
            }

            /* Related Tags 페이지용 태그 버튼 스타일 */
            #rapidbooru-related-tags-buttons .rapidbooru-tag-button {
                background: #fbeded;
                color: #495057;
                border: 1px solid #f5b8b8;
                padding: 4px 8px;
                margin: 2px;
            }

            #rapidbooru-related-tags-buttons .rapidbooru-tag-button.selected {
                background: #f5b8b8;
                color: #212529;
                border-color: #e5a7a7;
            }

            /* I'm Feeling Lucky! 버튼 스타일 */
            #rapidbooru-lucky-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10003;
                width: 180px;
                height: 50px;
                background: var(--rapidbooru-accent-color, #8454cc);
                color: var(--rapidbooru-text-color, #fff);
                border: none;
                border-radius: 25px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                font-weight: bold;
                font-size: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                gap: 8px;
            }

            #rapidbooru-lucky-btn:hover {
                background: var(--rapidbooru-accent-hover-color, #56687a);
            }

            #rapidbooru-lucky-btn:disabled {
                background: #aaa;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // 태그를 카테고리별로 분류하는 함수
    function categorizeTags(tags, postData) {
        const categories = {
            artist: [],
            copyright: [],
            character: [],
            general: [],
            meta: []
        };

        if (postData) {
            // API 데이터에서 카테고리 정보 사용
            const tagString = postData.tag_string || '';
            const artistTags = postData.tag_string_artist ? postData.tag_string_artist.split(' ') : [];
            const copyrightTags = postData.tag_string_copyright ? postData.tag_string_copyright.split(' ') : [];
            const characterTags = postData.tag_string_character ? postData.tag_string_character.split(' ') : [];
            const generalTags = postData.tag_string_general ? postData.tag_string_general.split(' ') : [];
            const metaTags = postData.tag_string_meta ? postData.tag_string_meta.split(' ') : [];

            categories.artist = artistTags.filter(tag => tag.length > 0);
            categories.copyright = copyrightTags.filter(tag => tag.length > 0);
            categories.character = characterTags.filter(tag => tag.length > 0);
            categories.general = generalTags.filter(tag => tag.length > 0);
            categories.meta = metaTags.filter(tag => tag.length > 0);
        } else {
            // 기본적으로 모든 태그를 general로 분류
            categories.general = tags.filter(tag => tag.length > 0);
        }

        return categories;
    }

    // 태그 버튼들을 생성하는 함수
    function createTagButtons(tags) {
        const container = document.createElement('div');
        container.className = 'rapidbooru-main-tags';

        tags.forEach((tag, index) => {
            const button = document.createElement('span');
            button.className = 'rapidbooru-tag-button';
            button.textContent = tag.replace(/_/g, ' ') + (index < tags.length - 1 ? ', ' : '');
            button.dataset.tag = tag.replace(/_/g, ' ') + (index < tags.length - 1 ? ', ' : '');

            button.addEventListener('click', function() {
                const tagText = this.dataset.tag;

                if (this.classList.contains('selected')) {
                    // 선택 해제
                    this.classList.remove('selected');
                    const index = selectedTags.indexOf(tagText);
                    if (index > -1) {
                        selectedTags.splice(index, 1);
                    }
                } else {
                    // 선택
                    this.classList.add('selected');
                    selectedTags.push(tagText);
                }
            });

            container.appendChild(button);
        });

        return container;
    }

    // 카테고리 태그 링크들을 생성하는 함수
    function createCategoryTagLinks(categoryName, tags) {
        const box = document.createElement('div');
        box.className = 'rapidbooru-category-box';

        const tagsWrapper = document.createElement('div');
        tagsWrapper.className = 'rapidbooru-category-tags-wrapper';

        const label = document.createElement('span');
        label.className = 'rapidbooru-category-label';
        label.textContent = `${categoryName}:`;
        // [추가] 카테고리별 색상 적용
        if (categoryName === 'artist') label.style.color = '#dd5555';
        else if (categoryName === 'copyright') label.style.color = '#8454cc';
        else if (categoryName === 'character') label.style.color = '#2ab367';

        tagsWrapper.appendChild(label);

        if (tags.length === 0) {
            const noneText = document.createTextNode(' None');
            tagsWrapper.appendChild(noneText);
        } else {
            tags.forEach((tag, index) => {
                const link = document.createElement('a');
                link.className = 'rapidbooru-tag-button';

                const displayTag = tag.replace(/_/g, ' ');
                const urlTag = tag;

                link.textContent = displayTag + (index < tags.length - 1 ? ', ' : '');
                link.href = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(urlTag)}`;
                link.target = '_blank';
                link.onclick = (e) => e.stopPropagation();

                tagsWrapper.appendChild(link);
            });
        }

        box.appendChild(tagsWrapper);

        if (tags.length > 0) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'rapidbooru-category-copy-btn';
            copyBtn.title = `Copy "${categoryName}" tags`;
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            `;

            copyBtn.onclick = (e) => {
                e.stopPropagation();
                const tagsText = tags.map(t => t.replace(/_/g, ' ')).join(', ');
                const textToCopy = `${categoryName}:${tagsText}`;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    `;
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `
                            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        `;
                    }, 1500);
                });
            };
            box.appendChild(copyBtn);
        }

        return box;
    }

    // 이미지 프리뷰 기능
    function createImagePreview(imageUrl, tags, postId, postData = null) {
        // 기존 프리뷰 오버레이 제거 (설정 패널은 제외)
        document.querySelectorAll('.rapidbooru-overlay').forEach(overlay => {
            if (overlay.id !== 'rapidbooru-settings-panel') {
                overlay.remove();
            }
        });

        // 선택된 태그 리스트 초기화
        selectedTags = [];

        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'rapidbooru-overlay';

        // 프리뷰 컨테이너 생성
        const preview = document.createElement('div');
        preview.className = 'rapidbooru-preview';

        // [추가] 새 탭 버튼 생성 (이미지 프리뷰용)
        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'rapidbooru-newtab';
        newTabBtn.title = 'Open post in new tab';
        newTabBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="6" fill="none" stroke="white" stroke-width="2"/>
                <path d="M9 15L15 9M15 9H10M15 9V14" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        newTabBtn.onclick = (e) => {
            e.stopPropagation();
            if (postId) {
                window.open(`https://danbooru.donmai.us/posts/${postId}`, '_blank');
            }
        };

        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.className = 'rapidbooru-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            selectedTags = [];
            overlay.remove();
        };

        // 태그 섹션
        const tagsSection = document.createElement('div');
        tagsSection.className = 'rapidbooru-tags';
        tagsSection.innerHTML = `<h3 style="color: var(--rapidbooru-text-color); margin-bottom: 15px;">Tags</h3>`;

        if (tags && tags.length > 0) {
            // 태그 분류
            const categorizedTags = categorizeTags(tags, postData);

            // Artist, Copyright, Character 태그들을 버튼으로 생성
            tagsSection.appendChild(createCategoryTagLinks('artist', categorizedTags.artist));
            tagsSection.appendChild(createCategoryTagLinks('copyright', categorizedTags.copyright));
            tagsSection.appendChild(createCategoryTagLinks('character', categorizedTags.character));

            // General 태그 버튼들
            if (categorizedTags.general.length > 0) {
                const generalLabel = document.createElement('h4');
                generalLabel.style.cssText = `color: var(--rapidbooru-text-color); margin: 15px 0 10px 0; font-size: 14px;`;
                generalLabel.textContent = 'General Tags (Click to select):';
                tagsSection.appendChild(generalLabel);

                const tagButtons = createTagButtons(categorizedTags.general);
                tagsSection.appendChild(tagButtons);
            }

            // 버튼 컨테이너
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'rapidbooru-action-buttons';

            // Select All 버튼 추가 (General 태그가 있을 경우)
            if (categorizedTags.general.length > 0) {
                const selectAllBtn = document.createElement('button');
                selectAllBtn.textContent = 'Select All';
                selectAllBtn.className = 'rapidbooru-copy-btn';
                selectAllBtn.style.background = 'linear-gradient(135deg, #56687a 0%, #3c4a58 100%)';
                selectAllBtn.style.flexGrow = '0';
                selectAllBtn.onclick = () => {
                    // General 태그(span)만 선택/해제
                    const allTagButtons = tagsSection.querySelectorAll('.rapidbooru-main-tags .rapidbooru-tag-button');
                    const shouldSelectAll = Array.from(allTagButtons).some(btn => !btn.classList.contains('selected'));

                    allTagButtons.forEach(button => {
                        const tagText = button.dataset.tag;
                        const isSelected = button.classList.contains('selected');
                        if (shouldSelectAll) {
                            if (!isSelected) {
                                button.classList.add('selected');
                                selectedTags.push(tagText);
                            }
                        } else {
                            if (isSelected) {
                                button.classList.remove('selected');
                                const index = selectedTags.indexOf(tagText);
                                if (index > -1) {
                                    selectedTags.splice(index, 1);
                                }
                            }
                        }
                    });
                    selectedTags = [...new Set(selectedTags)];
                    selectAllBtn.textContent = shouldSelectAll ? 'Deselect All' : 'Select All';
                };
                buttonContainer.appendChild(selectAllBtn);
            }

            // 복사 버튼
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy Selected Tags';
            copyBtn.className = 'rapidbooru-copy-btn';
            copyBtn.onclick = () => {
                const selectedText = selectedTags.join('');
                if (selectedText) {
                    navigator.clipboard.writeText(selectedText.trim().replace(/,$/, ''));
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => { copyBtn.textContent = 'Copy Selected Tags'; copyBtn.classList.remove('copied'); }, 2000);
                }
            };
            buttonContainer.appendChild(copyBtn);
            tagsSection.appendChild(buttonContainer);
        } else {
            tagsSection.innerHTML += '<p style="color: #ccc;">태그 정보를 불러올 수 없습니다.</p>';
        }

        // 이미지 섹션
        const contentSection = document.createElement('div');
        contentSection.className = 'rapidbooru-content';

        // 미디어 요소 생성 (이미지, 비디오, GIF 지원)
        let mediaElement;
        const fileExtension = imageUrl.split('.').pop().toLowerCase();

        if (fileExtension === 'mp4' || fileExtension === 'webm') {
            // 비디오 파일
            mediaElement = document.createElement('video');
            mediaElement.controls = true;
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
        } else {
            // 이미지 파일 (png, jpg, webp, gif 포함)
            mediaElement = document.createElement('img');
            mediaElement.alt = 'Preview Image';
        }

        mediaElement.className = 'rapidbooru-image';
        mediaElement.src = imageUrl;

        contentSection.appendChild(mediaElement);

        // 조립
        preview.appendChild(newTabBtn); // [추가] 새 탭 버튼을 닫기 버튼 왼쪽에 추가
        preview.appendChild(closeBtn);
        preview.appendChild(tagsSection);
        preview.appendChild(contentSection);
        overlay.appendChild(preview);

        // 이벤트 리스너
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                selectedTags = [];
                overlay.remove();
            }
        };

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                selectedTags = [];
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });

        // DOM에 추가
        document.body.appendChild(overlay);

        // 애니메이션
        setTimeout(() => overlay.classList.add('show'), 10);
    }

    // 썸네일에서 이미지 정보 추출 (원본 URL 가져오기 개선)
    function extractImageInfo(thumbnail) {
        let imageUrl = '';
        let tags = [];
        let postId = '';

        // 포스트 ID 추출
        const link = thumbnail.closest('a') || thumbnail.querySelector('a');
        if (link && link.href) {
            const match = link.href.match(/\/posts\/(\d+)/);
            if (match) {
                postId = match[1];
            }
        }

        // 링크에서 ID를 찾지 못한 경우, data-id 속성에서 가져오기 시도
        // 포스트 페이지의 원본 이미지를 처리하는 데 핵심적인 부분
        if (!postId && thumbnail.dataset.id) {
            postId = thumbnail.dataset.id;
        }

        // 이미지 URL 찾기 - 원본 이미지 URL 추출
        const img = thumbnail.querySelector('img');
        if (img && postId) {
            // Danbooru API를 통해 원본 이미지 URL 가져오기
            fetch(`https://danbooru.donmai.us/posts/${postId}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data.file_url) {
                        // 원본 파일 URL 사용
                        imageUrl = data.file_url;
                        if (data.tag_string) {
                            tags = data.tag_string.split(' ');
                        }
                        createImagePreview(imageUrl, tags, postId, data);
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch post data:', error);
                    // 실패 시 썸네일 URL 사용
                    const src = img.src;
                    if (src.includes('preview')) {
                        imageUrl = src.replace('/preview/', '/original/').replace('preview_', '');
                    } else {
                        imageUrl = src;
                    }
                    createImagePreview(imageUrl, tags, postId);
                });
            return null; // API 호출로 처리하므로 null 반환
        }

        // API 호출 실패 시 기존 방식 사용
        if (img) {
            const src = img.src;
            if (src.includes('preview')) {
                imageUrl = src.replace('/preview/', '/original/').replace('preview_', '');
            } else {
                imageUrl = src;
            }
        }

        // 태그 정보 추출 (data 속성이나 클래스에서)
        const tagElements = thumbnail.querySelectorAll('[data-tags]');
        if (tagElements.length > 0) {
            tagElements.forEach(el => {
                const tagData = el.getAttribute('data-tags');
                if (tagData) {
                    tags = tags.concat(tagData.split(' '));
                }
            });
        }

        // 부모 요소에서 태그 정보 찾기
        let parent = thumbnail.closest('[data-tags]');
        if (parent) {
            const tagData = parent.getAttribute('data-tags');
            if (tagData) {
                tags = tagData.split(' ');
            }
        }

        return { imageUrl, tags, postId };
    }

    // 썸네일 우클릭 이벤트 설정
    function setupImagePreview() {
        document.addEventListener('contextmenu', function(e) {
            // 이미지 썸네일인지 확인
            const thumbnail = e.target.closest('.post-preview') ||
                            e.target.closest('.post-thumbnail') ||
                            e.target.closest('[data-id]') ||
                            (e.target.tagName === 'IMG' && e.target.closest('a[href*="/posts/"]'));

            if (thumbnail) {
                e.preventDefault();

                const result = extractImageInfo(thumbnail);

                // API 호출이 아닌 경우에만 직접 프리뷰 생성
                if (result && result.imageUrl) {
                    createImagePreview(result.imageUrl, result.tags, result.postId);
                }
            }
        });
    }

    // 태그 프리뷰 기능
    function createTagPreview(tagName) {
        // 기존 프리뷰 오버레이 제거 (설정 패널은 제외)
        document.querySelectorAll('.rapidbooru-overlay').forEach(overlay => {
            if (overlay.id !== 'rapidbooru-settings-panel') {
                overlay.remove();
            }
        });

        // 태그명에서 공백을 언더스코어로 변환
        const formattedTag = tagName.replace(/\s+/g, '_');
        const searchOrder = rapidbooruSettings.searchOrder || 'Jaccard';
        const wikiUrl = `https://danbooru.donmai.us/wiki_pages/${encodeURIComponent(formattedTag)}`;
        const charUrl = `https://danbooru.donmai.us/related_tag?commit=Search&search%5Bcategory%5D=Character&search%5Border%5D=${searchOrder}&search%5Bquery%5D=${encodeURIComponent(formattedTag)}`;
        const genUrl = `https://danbooru.donmai.us/related_tag?commit=Search&search%5Bcategory%5D=General&search%5Border%5D=${searchOrder}&search%5Bquery%5D=${encodeURIComponent(formattedTag)}`;

        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'rapidbooru-overlay';

        // 프리뷰 컨테이너 생성
        const preview = document.createElement('div');
        preview.className = 'rapidbooru-preview';

        // [추가] 새 탭 버튼 생성 (태그 프리뷰용)
        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'rapidbooru-newtab';
        newTabBtn.title = 'Open wiki page in new tab';
        newTabBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="6" fill="none" stroke="white" stroke-width="2"/>
                <path d="M9 15L15 9M15 9H10M15 9V14" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        newTabBtn.onclick = (e) => {
            e.stopPropagation();
            window.open(`https://danbooru.donmai.us/wiki_pages/${encodeURIComponent(formattedTag)}`, '_blank');
        };

        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.className = 'rapidbooru-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => overlay.remove();

        // 컨텐츠 섹션 (위키 iframe)
        const contentSection = document.createElement('div');
        contentSection.className = 'rapidbooru-content';
        contentSection.style.width = '100%';
        contentSection.style.position = 'relative';

        // 위키 제목
        const title = document.createElement('h2');
        title.style.color = 'white';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        title.textContent = `Tag: ${tagName}`;

        // 위키 iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'rapidbooru-wiki';
        iframe.src = wikiUrl;
        iframe.style.width = '100%';
        iframe.style.height = 'calc(100% - 100px)';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.style.background = 'white';

        // 버튼 컨테이너
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'rapidbooru-buttons';

        // Char 버튼
        const charBtn = document.createElement('a');
        charBtn.className = 'rapidbooru-btn';
        charBtn.textContent = 'Char';
        charBtn.href = charUrl;
        charBtn.target = '_blank';
        charBtn.onclick = (e) => {
            e.stopPropagation();
        };

        // Gen 버튼
        const genBtn = document.createElement('a');
        genBtn.className = 'rapidbooru-btn';
        genBtn.textContent = 'Gen';
        genBtn.href = genUrl;
        genBtn.target = '_blank';
        genBtn.onclick = (e) => {
            e.stopPropagation();
        };

        buttonsContainer.appendChild(charBtn);
        buttonsContainer.appendChild(genBtn);

        // 조립
        contentSection.appendChild(title);
        contentSection.appendChild(iframe);
        contentSection.appendChild(buttonsContainer);

        preview.appendChild(newTabBtn); // [추가] 새 탭 버튼을 닫기 버튼 왼쪽에 추가
        preview.appendChild(closeBtn);
        preview.appendChild(contentSection);
        overlay.appendChild(preview);

        // 이벤트 리스너
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });

        // DOM에 추가
        document.body.appendChild(overlay);

        // 애니메이션
        setTimeout(() => overlay.classList.add('show'), 10);
    }

    // 태그 요소 감지 및 우클릭 이벤트 설정
    function setupTagPreview() {
        document.addEventListener('contextmenu', function(e) {
            // 태그 요소인지 확인
            const tagElement = e.target.closest('.tag') ||
                             e.target.closest('.tag-type-0') ||
                             e.target.closest('.tag-type-1') ||
                             e.target.closest('.tag-type-3') ||
                             e.target.closest('.tag-type-4') ||
                             e.target.closest('.tag-type-5') ||
                             e.target.closest('[data-tag-name]') ||
                             (e.target.classList && (
                                 e.target.classList.contains('tag') ||
                                 e.target.classList.contains('tag-link') ||
                                 e.target.classList.contains('search-tag')
                             ));

            if (tagElement) {
                // 이미지 썸네일이 아닌 경우에만 태그 프리뷰 실행
                const isImageThumbnail = e.target.closest('.post-preview') ||
                                       e.target.closest('.post-thumbnail') ||
                                       e.target.closest('[data-id]') ||
                                       (e.target.tagName === 'IMG' && e.target.closest('a[href*="/posts/"]'));

                if (!isImageThumbnail) {
                    e.preventDefault();

                    // 태그명 추출
                    let tagName = '';

                    // data-tag-name 속성에서 추출
                    if (tagElement.hasAttribute('data-tag-name')) {
                        tagName = tagElement.getAttribute('data-tag-name');
                    }
                    // href에서 추출
                    else if (tagElement.href && tagElement.href.includes('tags=')) {
                        const match = tagElement.href.match(/tags=([^&]+)/);
                        if (match) {
                            tagName = decodeURIComponent(match[1]);
                        }
                    }
                    // 텍스트 내용에서 추출
                    else {
                        tagName = tagElement.textContent.trim();
                        // 태그 앞의 숫자나 기호 제거
                        tagName = tagName.replace(/^\d+\s*/, '').replace(/^[?!+-]\s*/, '');
                    }

                    if (tagName) {
                        createTagPreview(tagName);
                    }
                }
            }
        });
    }

    // Debounce function to limit the rate at which a function gets called.
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Related tags 화면 기능
    function setupRelatedTagsFeature() {
        // Related tags 페이지인지 확인
        if (!window.location.pathname.includes('/related_tag')) {
            return;
        }

        // 삽입 위치 결정: 검색 결과 테이블 위
        const resultsTable = document.querySelector('table.striped');
        if (resultsTable) {
            insertRelatedTagsUI(resultsTable, 'before');
        } else {
            // 테이블이 없으면 기존 방식대로 검색 폼 뒤에 삽입 (폴백)
            const searchForm = document.querySelector('form') || document.querySelector('.search-form');
            if (searchForm) {
                insertRelatedTagsUI(searchForm, 'after');
            } else {
                const searchButton = document.querySelector('input[type="submit"]') ||
                                   Array.from(document.querySelectorAll('input')).find(input =>
                                       input.type === 'submit' || input.value === 'Search'
                                   );
                if (searchButton && searchButton.parentElement) {
                    insertRelatedTagsUI(searchButton.parentElement, 'after');
                }
            }
        }

        // Debounce the update function to prevent performance issues
        const debouncedUpdate = debounce(updateRelatedTagsList, 300);

        // 페이지 변화 감지하여 태그 목록 업데이트
        const observer = new MutationObserver(function(mutations) {
            // Call the debounced function once per batch of mutations.
            debouncedUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 초기 태그 목록 업데이트
        setTimeout(updateRelatedTagsList, 500);
    }

    function insertRelatedTagsUI(targetElement, position = 'after') {
        // 이미 추가된 컨테이너가 있는지 확인
        if (document.getElementById('rapidbooru-related-tags-container')) {
            return;
        }

        // 컨테이너 생성
        const container = document.createElement('div');
        container.id = 'rapidbooru-related-tags-container';
        container.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            background: #f5b8b8;
            border: 1px solid #e5a7a7;
            color: #212529;
        `;

        // 제목 추가
        const title = document.createElement('h4');
        title.textContent = 'Top 20 Related Tags (Click to select)';
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: #212529;
            font-family: 'Consolas', monospace;
            font-size: 16px;
        `;

        // 태그 버튼들이 들어갈 컨테이너
        const tagsContainer = document.createElement('div');
        tagsContainer.id = 'rapidbooru-related-tags-buttons';
        tagsContainer.className = 'rapidbooru-main-tags';
        tagsContainer.style.cssText = `
            background: #ffdddd;
            max-height: none;
            padding: 10px;
            border: 1px solid #f5b8b8;
            min-height: 60px;
            border-radius: 4px;
            margin-bottom: 10px;
        `;

        // 버튼 컨테이너
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'rapidbooru-action-buttons';
        buttonContainer.style.marginTop = '0';

        // Select All 버튼 생성
        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = 'Select All';
        selectAllButton.type = 'button';
        selectAllButton.className = 'rapidbooru-copy-btn';
        selectAllButton.style.background = 'linear-gradient(135deg, #56687a 0%, #3c4a58 100%)';
        selectAllButton.style.flexGrow = '0';
        selectAllButton.onclick = function() {
            const allTagButtons = tagsContainer.querySelectorAll('.rapidbooru-tag-button');
            if (allTagButtons.length === 0) return;

            const shouldSelectAll = Array.from(allTagButtons).some(btn => !btn.classList.contains('selected'));

            allTagButtons.forEach(button => {
                const tagText = button.dataset.tag;
                const isSelected = button.classList.contains('selected');

                if (shouldSelectAll) {
                    if (!isSelected) {
                        button.classList.add('selected');
                        relatedPageSelectedTags.push(tagText);
                    }
                } else {
                    if (isSelected) {
                        button.classList.remove('selected');
                        const index = relatedPageSelectedTags.indexOf(tagText);
                        if (index > -1) {
                            relatedPageSelectedTags.splice(index, 1);
                        }
                    }
                }
            });
            relatedPageSelectedTags = [...new Set(relatedPageSelectedTags)];
            this.textContent = shouldSelectAll ? 'Deselect All' : 'Select All';
        };

        // 복사 버튼
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Selected';
        copyButton.type = 'button';
        copyButton.className = 'rapidbooru-copy-btn';
        copyButton.style.flexGrow = '0';
        copyButton.onclick = function() {
            if (relatedPageSelectedTags.length > 0) {
                navigator.clipboard.writeText(relatedPageSelectedTags.join(', ')).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    setTimeout(() => { copyButton.textContent = originalText; copyButton.classList.remove('copied'); }, 2000);
                });
            }
        };

        // 조립
        container.appendChild(title);
        container.appendChild(tagsContainer);
        buttonContainer.appendChild(selectAllButton);
        buttonContainer.appendChild(copyButton);
        container.appendChild(buttonContainer);

        // 위치에 따라 삽입
        if (position === 'before') {
            targetElement.parentNode.insertBefore(container, targetElement);
        } else { // 'after'
            if (targetElement.nextSibling) {
                targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
            } else {
                targetElement.parentNode.appendChild(container);
            }
        }
    }

    function updateRelatedTagsList() {
        const tagsContainer = document.getElementById('rapidbooru-related-tags-buttons');
        if (!tagsContainer) {
            return;
        }

        // 검색 결과 영역에서 태그 링크들 찾기 (더 정확한 선택자 사용)
        const tagLinks = [];

        // 방법 1: 자동완성 드롭다운에서 태그 추출
        const autocompleteItems = document.querySelectorAll('.ui-menu-item a, .autocomplete-item a');
        if (autocompleteItems.length > 0) {
            autocompleteItems.forEach(item => {
                if (item.textContent.trim()) {
                    tagLinks.push(item);
                }
            });
        }

        // 방법 2: 검색 결과 테이블이나 리스트에서 태그 추출
        if (tagLinks.length === 0) {
            const resultLinks = document.querySelectorAll('table a, .search-results a, .tag-list a');
            resultLinks.forEach(link => {
                const text = link.textContent.trim();
                const href = link.href;

                // 태그 링크인지 확인 (숫자로 시작하지 않고, 특정 패턴 제외)
                if (text &&
                    !href.includes('/wiki') &&
                    !href.includes('/artists') &&
                    !href.includes('/pools') &&
                    !href.includes('/forum') &&
                    !href.includes('/users') &&
                    !text.match(/^(Terms|Privacy|Contact|Help|More|Login|Posts|Comments)$/i) &&
                    (href.includes('tags=') || href.includes('/posts?') || text.includes('_') || text.includes(' '))) {
                    tagLinks.push(link);
                }
            });
        }

        // 방법 3: 현재 페이지의 모든 링크에서 태그 패턴 찾기
        if (tagLinks.length === 0) {
            const allLinks = document.querySelectorAll('a');
            allLinks.forEach(link => {
                const text = link.textContent.trim();
                const href = link.href;

                // 태그 패턴 매칭 (언더스코어 포함, 괄호 포함 등)
                if (text &&
                    (text.includes('_') || text.match(/\([^)]+\)/)) &&
                    !href.includes('/wiki') &&
                    !href.includes('/artists') &&
                    !href.includes('/pools') &&
                    !href.includes('/forum') &&
                    !href.includes('/users') &&
                    !text.match(/^(Terms|Privacy|Contact|Help|More|Login|Posts|Comments|Danbooru)$/i)) {
                    tagLinks.push(link);
                }
            });
        }

        // 상위 20개 태그 추출 및 포맷팅
        const topTags = tagLinks.slice(0, 20).map(link => {
            let tagName = link.textContent.trim();

            // 숫자나 기타 정보 제거 (태그명만 추출)
            tagName = tagName.replace(/^\d+\s*/, '').replace(/\s*\d+$/, '').replace(/\s*\(\d+\)$/, '');

            // '_'를 띄어쓰기로 변환
            return tagName.replace(/_/g, ' ');
        }).filter(tag => tag.length > 0 && tag.length < 100); // 너무 긴 텍스트 제외

        const uniqueTags = [...new Set(topTags)].slice(0, 20);

        // 이미 렌더링된 태그와 새로 가져온 태그를 비교합니다.
        const currentTagButtons = tagsContainer.querySelectorAll('.rapidbooru-tag-button');
        const currentTags = Array.from(currentTagButtons).map(btn => btn.dataset.tag);

        // 태그 목록에 변화가 없으면 함수를 종료하여, 사용자의 태그 선택 상태가
        // 계속 초기화되는 현상이 방지합니다.
        if (uniqueTags.length === currentTags.length && uniqueTags.every((tag, i) => tag === currentTags[i])) {
            return;
        }

        // 이전 상태 초기화
        tagsContainer.innerHTML = '';
        relatedPageSelectedTags = [];
        const selectAllBtn = document.querySelector('#rapidbooru-related-tags-container button');
        if (selectAllBtn && selectAllBtn.textContent.includes('Deselect')) {
            selectAllBtn.textContent = 'Select All';
        }

        if (uniqueTags.length > 0) {
            uniqueTags.forEach((tag, index) => {
                const button = document.createElement('span');
                button.className = 'rapidbooru-tag-button';
                button.textContent = tag + (index < uniqueTags.length - 1 ? ', ' : '');
                button.dataset.tag = tag;

                button.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    if (this.classList.contains('selected')) {
                        relatedPageSelectedTags.push(this.dataset.tag);
                    } else {
                        const tagIndex = relatedPageSelectedTags.indexOf(this.dataset.tag);
                        if (tagIndex > -1) relatedPageSelectedTags.splice(tagIndex, 1);
                    }
                });
                tagsContainer.appendChild(button);
            });
        } else {
            tagsContainer.textContent = 'No related tags found. Please perform a search first.';
        }
    }

    // [추가] 사이드바 태그 버튼형 리스트 기능
    function setupSidebarTagButtonList() {
        const path = window.location.pathname;
        if (
            path === '/' ||
            path.startsWith('/posts') ||
            path.startsWith('/wiki_pages')
        ) {
            // 사이드바 컨테이너(태그 리스트의 부모)를 강제로 찾음
            let sidebar = document.querySelector('.sidebar') || document.querySelector('.aside') || document.querySelector('#sidebar') || document.querySelector('.side-menu') || document.body;
            // 기존 태그 리스트(ul, .tag-list 등) 완전히 숨기기
            const tagListCandidates = sidebar.querySelectorAll('.tag-list, .sidebar-section .tag-list, #tag-list, ul[data-category], .sidebar-section, .sidebar');
            tagListCandidates.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.margin = '0';
                el.style.padding = '0';
            });
            // 실제 태그 리스트 컨테이너를 찾음 (최초로 발견되는 것)
            let tagListContainer = null;
            for (const el of tagListCandidates) {
                if (el.matches('.tag-list, .sidebar-section .tag-list, #tag-list, ul[data-category]')) {
                    tagListContainer = el;
                    break;
                }
            }
            // 이미 생성된 경우 중복 생성 방지
            if (document.getElementById('rapidbooru-sidebar-taglist')) return;
            // 태그 정보 추출 함수 (카테고리별)
            function extractSidebarTags() {
                const categories = { artist: [], copyright: [], character: [], general: [], meta: [] };
                // ul[data-category] 우선
                const uls = sidebar.querySelectorAll('ul[data-category]');
                if (uls.length > 0) {
                    uls.forEach(ul => {
                        const cat = ul.getAttribute('data-category');
                        let key = '';
                        if (cat === '0') key = 'general';
                        else if (cat === '1') key = 'artist';
                        else if (cat === '3') key = 'copyright';
                        else if (cat === '4') key = 'character';
                        else if (cat === '5') key = 'meta';
                        else return;
                        ul.querySelectorAll('li').forEach(li => {
                            // 실제 태그명과 카운트 파싱 (danbooru 구조에 맞춤)
                            const tagA = li.querySelector('a.search-tag');
                            const countSpan = li.querySelector('span.post-count');
                            if (!tagA) return;
                            const tag = tagA.textContent.trim();
                            const count = countSpan ? countSpan.textContent.trim() : '';
                            if (tag) categories[key].push({ tag, count });
                        });
                    });
                } else {
                    // li.tag-type-x
                    sidebar.querySelectorAll('li, .tag-type-0, .tag-type-1, .tag-type-3, .tag-type-4, .tag-type-5').forEach(li => {
                        let key = '';
                        if (li.classList.contains('tag-type-0')) key = 'general';
                        else if (li.classList.contains('tag-type-1')) key = 'artist';
                        else if (li.classList.contains('tag-type-3')) key = 'copyright';
                        else if (li.classList.contains('tag-type-4')) key = 'character';
                        else if (li.classList.contains('tag-type-5')) key = 'meta';
                        else return;
                        const tagA = li.querySelector('a.search-tag');
                        const countSpan = li.querySelector('span.post-count');
                        if (!tagA) return;
                        const tag = tagA.textContent.trim();
                        const count = countSpan ? countSpan.textContent.trim() : '';
                        if (tag) categories[key].push({ tag, count });
                    });
                }
                return categories;
            }
            // 태그 버튼 생성 함수
            function createSidebarTagButtons(categories) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.gap = '0px';
                ['artist', 'copyright', 'character', 'general', 'meta'].forEach(cat => {
                    categories[cat].forEach(({ tag, count }) => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'rapidbooru-sidebar-tag-btn';
                        btn.textContent = tag;
                        btn.dataset.tag = tag;
                        btn.dataset.category = cat;
                        btn.style.background = tagColors[cat].normal;
                        btn.style.color = '#ffffff';
                        btn.style.border = 'none';
                        btn.style.borderRadius = '4px';
                        btn.style.margin = '0 0 4px 0';
                        btn.style.padding = '6px 10px';
                        btn.style.fontSize = '13px';
                        btn.style.textAlign = 'left';
                        btn.style.cursor = 'pointer';
                        btn.style.transition = 'background 0.2s';
                        btn.style.userSelect = 'none';
                        btn.style.width = '100%';
                        btn.style.boxShadow = 'none';
                        btn.style.position = 'relative';
                        // 태그 오른쪽 끝에 count 표시
                        if (count) {
                            const countSpan = document.createElement('span');
                            countSpan.textContent = count;
                            countSpan.style.position = 'absolute';
                            countSpan.style.right = '12px';
                            countSpan.style.top = '50%';
                            countSpan.style.transform = 'translateY(-50%)';
                            countSpan.style.color = '#ffffff';
                            countSpan.style.fontSize = '12px';
                            countSpan.style.pointerEvents = 'none';
                            btn.appendChild(countSpan);
                        }
                        // 좌클릭: 선택/해제
                        btn.addEventListener('click', function(e) {
                            if (e.button !== 0) return;
                            e.preventDefault();
                            if (btn.classList.contains('selected')) {
                                btn.classList.remove('selected');
                                btn.style.background = tagColors[cat].normal;
                                const idx = sidebarSelectedTags.indexOf(tag);
                                if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                            } else {
                                btn.classList.add('selected');
                                btn.style.background = tagColors[cat].selected;
                                sidebarSelectedTags.push(tag);
                            }
                            sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                        });
                        // 가운데 클릭: 새 탭으로 검색
                        btn.addEventListener('mousedown', function(e) {
                            if (e.button === 1) {
                                e.preventDefault();
                                const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tag.replace(/\s/g, '_'))}`;
                                window.open(url, '_blank');
                            }
                        });
                        // 우클릭: 태그 프리뷰
                        btn.addEventListener('contextmenu', function(e) {
                            e.preventDefault();
                            createTagPreview(tag);
                        });
                        // 드래그 다중 선택 지원
                        btn.addEventListener('mouseenter', function(e) {
                            if (window.__rapidbooru_sidebar_dragging) {
                                if (!btn.classList.contains('selected')) {
                                    btn.classList.add('selected');
                                    btn.style.background = tagColors[cat].selected;
                                    sidebarSelectedTags.push(tag);
                                    sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                                } else {
                                    btn.classList.remove('selected');
                                    btn.style.background = tagColors[cat].normal;
                                    const idx = sidebarSelectedTags.indexOf(tag);
                                    if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                                }
                            }
                        });
                        wrapper.appendChild(btn);
                    });
                });
                return wrapper;
            }

            // 사이드바에 삽입할 컨테이너 생성
            const sidebarBox = document.createElement('div');
            sidebarBox.id = 'rapidbooru-sidebar-taglist';
            sidebarBox.style.margin = '24px 0 0 0';
            sidebarBox.style.padding = '12px 8px 12px 8px';
            sidebarBox.style.background = '#474756'; // 배경색 지정
            sidebarBox.style.borderRadius = '8px';
            sidebarBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            sidebarBox.style.display = 'flex';
            sidebarBox.style.flexDirection = 'column';
            sidebarBox.style.alignItems = 'stretch';
            sidebarBox.style.maxHeight = '70vh';
            sidebarBox.style.overflowY = 'auto';
            sidebarBox.style.minWidth = '120px';

            // 버튼 컨테이너(Select All, Copy)
            const topBtnBox = document.createElement('div');
            topBtnBox.style.display = 'flex';
            topBtnBox.style.gap = '8px';
            topBtnBox.style.marginBottom = '12px';

            // Select All 버튼
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.textContent = 'Select All';
            selectAllBtn.className = 'rapidbooru-copy-btn';
            selectAllBtn.style.background = 'linear-gradient(135deg, #56687a 0%, #3c4a58 100%)';
            selectAllBtn.style.flexGrow = '1';
            selectAllBtn.style.fontSize = '13px';
            selectAllBtn.style.padding = '6px 0';
            selectAllBtn.addEventListener('click', function() {
                const btns = sidebarBox.querySelectorAll('.rapidbooru-sidebar-tag-btn');
                const shouldSelectAll = Array.from(btns).some(btn => !btn.classList.contains('selected'));
                btns.forEach(btn => {
                    const tag = btn.dataset.tag;
                    const cat = btn.dataset.category;
                    if (shouldSelectAll) {
                        if (!btn.classList.contains('selected')) {
                            btn.classList.add('selected');
                            btn.style.background = tagColors[cat].selected;
                            sidebarSelectedTags.push(tag);
                        }
                    } else {
                        if (btn.classList.contains('selected')) {
                            btn.classList.remove('selected');
                            btn.style.background = tagColors[cat].normal;
                            const idx = sidebarSelectedTags.indexOf(tag);
                            if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                        }
                    }
                });
                sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                selectAllBtn.textContent = shouldSelectAll ? 'Deselect All' : 'Select All';
            });

            // Copy Selected Tags 버튼
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.textContent = 'Copy Selected Tags';
            copyBtn.className = 'rapidbooru-copy-btn';
            copyBtn.style.flexGrow = '1';
            copyBtn.style.fontSize = '13px';
            copyBtn.style.padding = '6px 0';
            copyBtn.addEventListener('click', function() {
                if (sidebarSelectedTags.length > 0) {
                    const str = sidebarSelectedTags.join(', ');
                    navigator.clipboard.writeText(str).then(() => {
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy Selected Tags';
                            copyBtn.classList.remove('copied');
                        }, 1500);
                    });
                }
            });

            topBtnBox.appendChild(selectAllBtn);
            topBtnBox.appendChild(copyBtn);

            // 태그 버튼 리스트 생성
            const categories = extractSidebarTags();
            const tagBtnList = createSidebarTagButtons(categories);

            // 드래그 다중 선택 지원
            sidebarBox.addEventListener('mousedown', function(e) {
                if (e.target.classList.contains('rapidbooru-sidebar-tag-btn') && e.button === 0) {
                    window.__rapidbooru_sidebar_dragging = true;
                }
            });
            sidebarBox.addEventListener('mouseup', function() {
                window.__rapidbooru_sidebar_dragging = false;
            });
            sidebarBox.addEventListener('mouseleave', function() {
                window.__rapidbooru_sidebar_dragging = false;
            });

            // 조립
            sidebarBox.appendChild(topBtnBox);
            sidebarBox.appendChild(tagBtnList);

            // 사이드바에 삽입 (기존 태그 리스트 바로 위에)
            if (tagListContainer && tagListContainer.parentNode) {
                tagListContainer.parentNode.insertBefore(sidebarBox, tagListContainer);
            } else {
                // 태그 리스트가 없으면 sidebar 맨 앞에 삽입
                sidebar.insertBefore(sidebarBox, sidebar.firstChild);
            }

            // 스타일 추가 (카테고리별 버튼 색상)
            const style = document.createElement('style');
            style.textContent = `
                .rapidbooru-sidebar-tag-btn.selected[data-category="artist"] { background: #7a0a2c !important; }
                .rapidbooru-sidebar-tag-btn[data-category="artist"] { background: #dd5555 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="copyright"] { background: #2d0766 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="copyright"] { background: #8454cc !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="character"] { background: #04472d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="character"] { background: #2ab367 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="general"] { background: #10164d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="general"] { background: #47799c !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="meta"] { background: #1f1c03 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="meta"] { background: #79722a !important; }
                .rapidbooru-sidebar-tag-btn { outline: none; }
                .rapidbooru-sidebar-tag-btn:active { filter: brightness(0.95); }
            `;
            document.head.appendChild(style);
        }
    }

    // [수정] 태그 그룹 페이지용 태그 버튼 컨테이너 기능 (본문만 변환, Copy 버튼 위치 개선)
    function setupTagGroupPageTagButtons() {
        // 태그 그룹 페이지인지 확인
        if (!/^\/wiki_pages\/tag_group%3A/i.test(window.location.pathname)) return;
        // 본문 컨테이너(id/class 모두 대응)
        const mainContent = document.querySelector('#wiki-page-body.prose') || document.querySelector('.wiki-page-body') || document.querySelector('.content') || document.body;
        if (!mainContent) return;
        // 본문 내 <ul>만 수집 (직계/하위 모두)
        const ulList = Array.from(mainContent.querySelectorAll('ul'));
        if (ulList.length === 0) return;
        // 선택된 태그 임시 리스트
        let tagGroupSelectedTags = [];
        // 스타일 재사용
        const tagColors = {
            artist: { normal: '#dd5555', selected: '#7a0a2c' },
            copyright: { normal: '#8454cc', selected: '#2d0766' },
            character: { normal: '#2ab367', selected: '#04472d' },
            general: { normal: '#47799c', selected: '#10164d' },
            meta: { normal: '#79722a', selected: '#1f1c03' }
        };
        // 태그 타입 추출 함수
        function getTagType(a) {
            if (a.classList.contains('tag-type-1')) return 'artist';
            if (a.classList.contains('tag-type-3')) return 'copyright';
            if (a.classList.contains('tag-type-4')) return 'character';
            if (a.classList.contains('tag-type-5')) return 'meta';
            return 'general';
        }
        // 태그 버튼 컨테이너 생성 함수
        function createTagGroupButtonContainer(tagObjs) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexWrap = 'wrap';
            wrapper.style.gap = '6px';
            wrapper.style.background = '#474756';
            wrapper.style.borderRadius = '8px';
            wrapper.style.padding = '12px 8px';
            wrapper.style.margin = '16px 0';
            wrapper.style.minWidth = '120px';
            tagObjs.forEach(({ tag, type }) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'rapidbooru-sidebar-tag-btn';
                btn.textContent = tag;
                btn.dataset.tag = tag;
                btn.dataset.category = type;
                btn.style.background = tagColors[type].normal;
                btn.style.color = '#fff';
                btn.style.border = 'none';
                btn.style.borderRadius = '4px';
                btn.style.padding = '6px 10px';
                btn.style.fontSize = '13px';
                btn.style.textAlign = 'left';
                btn.style.cursor = 'pointer';
                btn.style.transition = 'background 0.2s';
                btn.style.userSelect = 'none';
                btn.style.boxShadow = 'none';
                btn.style.position = 'relative';
                btn.style.margin = '0 0 4px 0';
                btn.style.width = 'auto';
                // 좌클릭: 선택/해제
                btn.addEventListener('click', function(e) {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    if (btn.classList.contains('selected')) {
                        btn.classList.remove('selected');
                        btn.style.background = tagColors[type].normal;
                        const idx = tagGroupSelectedTags.indexOf(tag);
                        if (idx > -1) tagGroupSelectedTags.splice(idx, 1);
                    } else {
                        btn.classList.add('selected');
                        btn.style.background = tagColors[type].selected;
                        tagGroupSelectedTags.push(tag);
                    }
                    tagGroupSelectedTags = [...new Set(tagGroupSelectedTags)];
                });
                // 가운데 클릭: 새 탭으로 검색
                btn.addEventListener('mousedown', function(e) {
                    if (e.button === 1) {
                        e.preventDefault();
                        const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tag.replace(/\s/g, '_'))}`;
                        window.open(url, '_blank');
                    }
                });
                // 우클릭: 태그 프리뷰
                btn.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    if (typeof createTagPreview === 'function') createTagPreview(tag);
                });
                wrapper.appendChild(btn);
            });
            return wrapper;
        }
        // 기존 <ul>을 버튼 컨테이너로 교체 (본문 내에서만)
        ulList.forEach(ul => {
            // <ul> 내 <li> -> <a> 추출
            const tagObjs = Array.from(ul.querySelectorAll('li a')).map(a => ({
                tag: a.textContent.trim(),
                type: getTagType(a)
            })).filter(obj => obj.tag.length > 0);
            // 컨테이너 생성
            const btnContainer = createTagGroupButtonContainer(tagObjs);
            ul.parentNode.insertBefore(btnContainer, ul);
            ul.remove();
        });
        // Copy Selected Tags 버튼 생성 (본문 맨 위)
        if (!mainContent.querySelector('.rapidbooru-taggroup-copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.textContent = 'Copy Selected Tags';
            copyBtn.className = 'rapidbooru-copy-btn rapidbooru-taggroup-copy-btn';
            copyBtn.style.margin = '0 0 18px 0';
            copyBtn.style.display = 'block';
            copyBtn.style.fontSize = '15px';
            copyBtn.addEventListener('click', function() {
                if (tagGroupSelectedTags.length > 0) {
                    const str = tagGroupSelectedTags.join(', ');
                    navigator.clipboard.writeText(str).then(() => {
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy Selected Tags';
                            copyBtn.classList.remove('copied');
                        }, 1500);
                    });
                }
            });
            // 본문 맨 앞에 삽입
            mainContent.insertBefore(copyBtn, mainContent.firstChild);
        }
        // 스타일 추가 (카테고리별 버튼 색상)
        if (!document.getElementById('rapidbooru-taggroup-style')) {
            const style = document.createElement('style');
            style.id = 'rapidbooru-taggroup-style';
            style.textContent = `
                .rapidbooru-sidebar-tag-btn.selected[data-category="artist"] { background: #7a0a2c !important; }
                .rapidbooru-sidebar-tag-btn[data-category="artist"] { background: #dd5555 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="copyright"] { background: #2d0766 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="copyright"] { background: #8454cc !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="character"] { background: #04472d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="character"] { background: #2ab367 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="general"] { background: #10164d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="general"] { background: #47799c !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="meta"] { background: #1f1c03 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="meta"] { background: #79722a !important; }
                .rapidbooru-sidebar-tag-btn { outline: none; }
                .rapidbooru-sidebar-tag-btn:active { filter: brightness(0.95); }
            `;
            document.head.appendChild(style);
        }
    }

    // [추가] I'm Feeling Lucky 버튼 생성 및 기능
    function addLuckyButton() {
        // 메인 페이지에서만 표시
        if (window.location.pathname !== '/' && window.location.pathname !== '/posts') return;
        if (document.getElementById('rapidbooru-lucky-btn')) return;

        const luckyBtn = document.createElement('button');
        luckyBtn.id = 'rapidbooru-lucky-btn';
        luckyBtn.textContent = "I'm Feeling Lucky!";
        luckyBtn.style.position = 'fixed';
        luckyBtn.style.top = '20px';
        luckyBtn.style.right = '20px';
        luckyBtn.style.zIndex = '10003';
        luckyBtn.style.width = '180px';
        luckyBtn.style.height = '50px';
        luckyBtn.style.background = 'var(--rapidbooru-accent-color, #8454cc)';
        luckyBtn.style.color = 'var(--rapidbooru-text-color, #fff)';
        luckyBtn.style.border = 'none';
        luckyBtn.style.borderRadius = '25px';
        luckyBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        luckyBtn.style.fontWeight = 'bold';
        luckyBtn.style.fontSize = '16px';
        luckyBtn.style.cursor = 'pointer';
        luckyBtn.style.display = 'flex';
        luckyBtn.style.alignItems = 'center';
        luckyBtn.style.justifyContent = 'center';
        luckyBtn.style.transition = 'all 0.3s';
        luckyBtn.style.gap = '8px';

        luckyBtn.addEventListener('mouseenter', () => {
            luckyBtn.style.background = 'var(--rapidbooru-accent-hover-color, #56687a)';
        });
        luckyBtn.addEventListener('mouseleave', () => {
            luckyBtn.style.background = 'var(--rapidbooru-accent-color, #8454cc)';
        });

        luckyBtn.onclick = async function() {
            luckyBtn.disabled = true;
            luckyBtn.textContent = 'Loading...';
            try {
                // 최신 포스트 ID 가져오기
                const resp = await fetch('https://danbooru.donmai.us/posts.json?limit=1&only=id');
                const data = await resp.json();
                if (data && data.length > 0 && data[0].id) {
                    let luckyIndex = data[0].id;
                    // 100만 개 전 범위 내 난수
                    const min = Math.max(1, luckyIndex - 2000000);
                    luckyIndex = Math.floor(Math.random() * (luckyIndex - min + 1)) + min;
                    window.open(`https://danbooru.donmai.us/posts/${luckyIndex}`, '_blank');
                } else {
                    alert('최신 포스트 ID를 가져올 수 없습니다.');
                }
            } catch (e) {
                alert('네트워크 오류로 시도에 실패했습니다.');
            }
            luckyBtn.disabled = false;
            luckyBtn.textContent = "I'm Feeling Lucky!";
        };
        document.body.appendChild(luckyBtn);
    }

    // 태그를 복사하는 함수
    function copyTags(tags) {
        const tagsText = tags.map(t => t.replace(/_/g, ' ')).join(', ');
        navigator.clipboard.writeText(tagsText).then(() => {
            alert('Tags copied to clipboard: ' + tagsText);
        }, (err) => {
            console.error('Error copying tags: ', err);
        });
    }

    // [추가] 사이드바 태그 버튼형 리스트 기능
    function setupSidebarTagButtonList() {
        const path = window.location.pathname;
        if (
            path === '/' ||
            path.startsWith('/posts') ||
            path.startsWith('/wiki_pages')
        ) {
            // 사이드바 컨테이너(태그 리스트의 부모)를 강제로 찾음
            let sidebar = document.querySelector('.sidebar') || document.querySelector('.aside') || document.querySelector('#sidebar') || document.querySelector('.side-menu') || document.body;
            // 기존 태그 리스트(ul, .tag-list 등) 완전히 숨기기
            const tagListCandidates = sidebar.querySelectorAll('.tag-list, .sidebar-section .tag-list, #tag-list, ul[data-category], .sidebar-section, .sidebar');
            tagListCandidates.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.margin = '0';
                el.style.padding = '0';
            });
            // 실제 태그 리스트 컨테이너를 찾음 (최초로 발견되는 것)
            let tagListContainer = null;
            for (const el of tagListCandidates) {
                if (el.matches('.tag-list, .sidebar-section .tag-list, #tag-list, ul[data-category]')) {
                    tagListContainer = el;
                    break;
                }
            }
            // 이미 생성된 경우 중복 생성 방지
            if (document.getElementById('rapidbooru-sidebar-taglist')) return;
            // 태그 정보 추출 함수 (카테고리별)
            function extractSidebarTags() {
                const categories = { artist: [], copyright: [], character: [], general: [], meta: [] };
                // ul[data-category] 우선
                const uls = sidebar.querySelectorAll('ul[data-category]');
                if (uls.length > 0) {
                    uls.forEach(ul => {
                        const cat = ul.getAttribute('data-category');
                        let key = '';
                        if (cat === '0') key = 'general';
                        else if (cat === '1') key = 'artist';
                        else if (cat === '3') key = 'copyright';
                        else if (cat === '4') key = 'character';
                        else if (cat === '5') key = 'meta';
                        else return;
                        ul.querySelectorAll('li').forEach(li => {
                            // 실제 태그명과 카운트 파싱 (danbooru 구조에 맞춤)
                            const tagA = li.querySelector('a.search-tag');
                            const countSpan = li.querySelector('span.post-count');
                            if (!tagA) return;
                            const tag = tagA.textContent.trim();
                            const count = countSpan ? countSpan.textContent.trim() : '';
                            if (tag) categories[key].push({ tag, count });
                        });
                    });
                } else {
                    // li.tag-type-x
                    sidebar.querySelectorAll('li, .tag-type-0, .tag-type-1, .tag-type-3, .tag-type-4, .tag-type-5').forEach(li => {
                        let key = '';
                        if (li.classList.contains('tag-type-0')) key = 'general';
                        else if (li.classList.contains('tag-type-1')) key = 'artist';
                        else if (li.classList.contains('tag-type-3')) key = 'copyright';
                        else if (li.classList.contains('tag-type-4')) key = 'character';
                        else if (li.classList.contains('tag-type-5')) key = 'meta';
                        else return;
                        const tagA = li.querySelector('a.search-tag');
                        const countSpan = li.querySelector('span.post-count');
                        if (!tagA) return;
                        const tag = tagA.textContent.trim();
                        const count = countSpan ? countSpan.textContent.trim() : '';
                        if (tag) categories[key].push({ tag, count });
                    });
                }
                return categories;
            }
            // 태그 버튼 생성 함수
            function createSidebarTagButtons(categories) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.gap = '0px';
                ['artist', 'copyright', 'character', 'general', 'meta'].forEach(cat => {
                    categories[cat].forEach(({ tag, count }) => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'rapidbooru-sidebar-tag-btn';
                        btn.textContent = tag;
                        btn.dataset.tag = tag;
                        btn.dataset.category = cat;
                        btn.style.background = tagColors[cat].normal;
                        btn.style.color = '#ffffff';
                        btn.style.border = 'none';
                        btn.style.borderRadius = '4px';
                        btn.style.margin = '0 0 4px 0';
                        btn.style.padding = '6px 10px';
                        btn.style.fontSize = '13px';
                        btn.style.textAlign = 'left';
                        btn.style.cursor = 'pointer';
                        btn.style.transition = 'background 0.2s';
                        btn.style.userSelect = 'none';
                        btn.style.width = '100%';
                        btn.style.boxShadow = 'none';
                        btn.style.position = 'relative';
                        // 태그 오른쪽 끝에 count 표시
                        if (count) {
                            const countSpan = document.createElement('span');
                            countSpan.textContent = count;
                            countSpan.style.position = 'absolute';
                            countSpan.style.right = '12px';
                            countSpan.style.top = '50%';
                            countSpan.style.transform = 'translateY(-50%)';
                            countSpan.style.color = '#ffffff';
                            countSpan.style.fontSize = '12px';
                            countSpan.style.pointerEvents = 'none';
                            btn.appendChild(countSpan);
                        }
                        // 좌클릭: 선택/해제
                        btn.addEventListener('click', function(e) {
                            if (e.button !== 0) return;
                            e.preventDefault();
                            if (btn.classList.contains('selected')) {
                                btn.classList.remove('selected');
                                btn.style.background = tagColors[cat].normal;
                                const idx = sidebarSelectedTags.indexOf(tag);
                                if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                            } else {
                                btn.classList.add('selected');
                                btn.style.background = tagColors[cat].selected;
                                sidebarSelectedTags.push(tag);
                            }
                            sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                        });
                        // 가운데 클릭: 새 탭으로 검색
                        btn.addEventListener('mousedown', function(e) {
                            if (e.button === 1) {
                                e.preventDefault();
                                const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tag.replace(/\s/g, '_'))}`;
                                window.open(url, '_blank');
                            }
                        });
                        // 우클릭: 태그 프리뷰
                        btn.addEventListener('contextmenu', function(e) {
                            e.preventDefault();
                            createTagPreview(tag);
                        });
                        // 드래그 다중 선택 지원
                        btn.addEventListener('mouseenter', function(e) {
                            if (window.__rapidbooru_sidebar_dragging) {
                                if (!btn.classList.contains('selected')) {
                                    btn.classList.add('selected');
                                    btn.style.background = tagColors[cat].selected;
                                    sidebarSelectedTags.push(tag);
                                    sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                                } else {
                                    btn.classList.remove('selected');
                                    btn.style.background = tagColors[cat].normal;
                                    const idx = sidebarSelectedTags.indexOf(tag);
                                    if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                                }
                            }
                        });
                        wrapper.appendChild(btn);
                    });
                });
                return wrapper;
            }

            // 사이드바에 삽입할 컨테이너 생성
            const sidebarBox = document.createElement('div');
            sidebarBox.id = 'rapidbooru-sidebar-taglist';
            sidebarBox.style.margin = '24px 0 0 0';
            sidebarBox.style.padding = '12px 8px 12px 8px';
            sidebarBox.style.background = '#474756'; // 배경색 지정
            sidebarBox.style.borderRadius = '8px';
            sidebarBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            sidebarBox.style.display = 'flex';
            sidebarBox.style.flexDirection = 'column';
            sidebarBox.style.alignItems = 'stretch';
            sidebarBox.style.maxHeight = '70vh';
            sidebarBox.style.overflowY = 'auto';
            sidebarBox.style.minWidth = '120px';

            // 버튼 컨테이너(Select All, Copy)
            const topBtnBox = document.createElement('div');
            topBtnBox.style.display = 'flex';
            topBtnBox.style.gap = '8px';
            topBtnBox.style.marginBottom = '12px';

            // Select All 버튼
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.textContent = 'Select All';
            selectAllBtn.className = 'rapidbooru-copy-btn';
            selectAllBtn.style.background = 'linear-gradient(135deg, #56687a 0%, #3c4a58 100%)';
            selectAllBtn.style.flexGrow = '1';
            selectAllBtn.style.fontSize = '13px';
            selectAllBtn.style.padding = '6px 0';
            selectAllBtn.addEventListener('click', function() {
                const btns = sidebarBox.querySelectorAll('.rapidbooru-sidebar-tag-btn');
                const shouldSelectAll = Array.from(btns).some(btn => !btn.classList.contains('selected'));
                btns.forEach(btn => {
                    const tag = btn.dataset.tag;
                    const cat = btn.dataset.category;
                    if (shouldSelectAll) {
                        if (!btn.classList.contains('selected')) {
                            btn.classList.add('selected');
                            btn.style.background = tagColors[cat].selected;
                            sidebarSelectedTags.push(tag);
                        }
                    } else {
                        if (btn.classList.contains('selected')) {
                            btn.classList.remove('selected');
                            btn.style.background = tagColors[cat].normal;
                            const idx = sidebarSelectedTags.indexOf(tag);
                            if (idx > -1) sidebarSelectedTags.splice(idx, 1);
                        }
                    }
                });
                sidebarSelectedTags = [...new Set(sidebarSelectedTags)];
                selectAllBtn.textContent = shouldSelectAll ? 'Deselect All' : 'Select All';
            });

            // Copy Selected Tags 버튼
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.textContent = 'Copy Selected Tags';
            copyBtn.className = 'rapidbooru-copy-btn';
            copyBtn.style.flexGrow = '1';
            copyBtn.style.fontSize = '13px';
            copyBtn.style.padding = '6px 0';
            copyBtn.addEventListener('click', function() {
                if (sidebarSelectedTags.length > 0) {
                    const str = sidebarSelectedTags.join(', ');
                    navigator.clipboard.writeText(str).then(() => {
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy Selected Tags';
                            copyBtn.classList.remove('copied');
                        }, 1500);
                    });
                }
            });

            topBtnBox.appendChild(selectAllBtn);
            topBtnBox.appendChild(copyBtn);

            // 태그 버튼 리스트 생성
            const categories = extractSidebarTags();
            const tagBtnList = createSidebarTagButtons(categories);

            // 드래그 다중 선택 지원
            sidebarBox.addEventListener('mousedown', function(e) {
                if (e.target.classList.contains('rapidbooru-sidebar-tag-btn') && e.button === 0) {
                    window.__rapidbooru_sidebar_dragging = true;
                }
            });
            sidebarBox.addEventListener('mouseup', function() {
                window.__rapidbooru_sidebar_dragging = false;
            });
            sidebarBox.addEventListener('mouseleave', function() {
                window.__rapidbooru_sidebar_dragging = false;
            });

            // 조립
            sidebarBox.appendChild(topBtnBox);
            sidebarBox.appendChild(tagBtnList);

            // 사이드바에 삽입 (기존 태그 리스트 바로 위에)
            if (tagListContainer && tagListContainer.parentNode) {
                tagListContainer.parentNode.insertBefore(sidebarBox, tagListContainer);
            } else {
                // 태그 리스트가 없으면 sidebar 맨 앞에 삽입
                sidebar.insertBefore(sidebarBox, sidebar.firstChild);
            }

            // 스타일 추가 (카테고리별 버튼 색상)
            const style = document.createElement('style');
            style.textContent = `
                .rapidbooru-sidebar-tag-btn.selected[data-category="artist"] { background: #7a0a2c !important; }
                .rapidbooru-sidebar-tag-btn[data-category="artist"] { background: #dd5555 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="copyright"] { background: #2d0766 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="copyright"] { background: #8454cc !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="character"] { background: #04472d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="character"] { background: #2ab367 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="general"] { background: #10164d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="general"] { background: #47799c !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="meta"] { background: #1f1c03 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="meta"] { background: #79722a !important; }
                .rapidbooru-sidebar-tag-btn { outline: none; }
                .rapidbooru-sidebar-tag-btn:active { filter: brightness(0.95); }
            `;
            document.head.appendChild(style);
        }
    }

    // [수정] 태그 그룹 페이지용 태그 버튼 컨테이너 기능 (본문만 변환, Copy 버튼 위치 개선)
    function setupTagGroupPageTagButtons() {
        // 태그 그룹 페이지인지 확인
        if (!/^\/wiki_pages\/tag_group%3A/i.test(window.location.pathname)) return;
        // 본문 컨테이너(id/class 모두 대응)
        const mainContent = document.querySelector('#wiki-page-body.prose') || document.querySelector('.wiki-page-body') || document.querySelector('.content') || document.body;
        if (!mainContent) return;
        // 본문 내 <ul>만 수집 (직계/하위 모두)
        const ulList = Array.from(mainContent.querySelectorAll('ul'));
        if (ulList.length === 0) return;
        // 선택된 태그 임시 리스트
        let tagGroupSelectedTags = [];
        // 스타일 재사용
        const tagColors = {
            artist: { normal: '#dd5555', selected: '#7a0a2c' },
            copyright: { normal: '#8454cc', selected: '#2d0766' },
            character: { normal: '#2ab367', selected: '#04472d' },
            general: { normal: '#47799c', selected: '#10164d' },
            meta: { normal: '#79722a', selected: '#1f1c03' }
        };
        // 태그 타입 추출 함수
        function getTagType(a) {
            if (a.classList.contains('tag-type-1')) return 'artist';
            if (a.classList.contains('tag-type-3')) return 'copyright';
            if (a.classList.contains('tag-type-4')) return 'character';
            if (a.classList.contains('tag-type-5')) return 'meta';
            return 'general';
        }
        // 태그 버튼 컨테이너 생성 함수
        function createTagGroupButtonContainer(tagObjs) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexWrap = 'wrap';
            wrapper.style.gap = '6px';
            wrapper.style.background = '#474756';
            wrapper.style.borderRadius = '8px';
            wrapper.style.padding = '12px 8px';
            wrapper.style.margin = '16px 0';
            wrapper.style.minWidth = '120px';
            tagObjs.forEach(({ tag, type }) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'rapidbooru-sidebar-tag-btn';
                btn.textContent = tag;
                btn.dataset.tag = tag;
                btn.dataset.category = type;
                btn.style.background = tagColors[type].normal;
                btn.style.color = '#fff';
                btn.style.border = 'none';
                btn.style.borderRadius = '4px';
                btn.style.padding = '6px 10px';
                btn.style.fontSize = '13px';
                btn.style.textAlign = 'left';
                btn.style.cursor = 'pointer';
                btn.style.transition = 'background 0.2s';
                btn.style.userSelect = 'none';
                btn.style.boxShadow = 'none';
                btn.style.position = 'relative';
                btn.style.margin = '0 0 4px 0';
                btn.style.width = 'auto';
                // 좌클릭: 선택/해제
                btn.addEventListener('click', function(e) {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    if (btn.classList.contains('selected')) {
                        btn.classList.remove('selected');
                        btn.style.background = tagColors[type].normal;
                        const idx = tagGroupSelectedTags.indexOf(tag);
                        if (idx > -1) tagGroupSelectedTags.splice(idx, 1);
                    } else {
                        btn.classList.add('selected');
                        btn.style.background = tagColors[type].selected;
                        tagGroupSelectedTags.push(tag);
                    }
                    tagGroupSelectedTags = [...new Set(tagGroupSelectedTags)];
                });
                // 가운데 클릭: 새 탭으로 검색
                btn.addEventListener('mousedown', function(e) {
                    if (e.button === 1) {
                        e.preventDefault();
                        const url = `https://danbooru.donmai.us/posts?tags=${encodeURIComponent(tag.replace(/\s/g, '_'))}`;
                        window.open(url, '_blank');
                    }
                });
                // 우클릭: 태그 프리뷰
                btn.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    if (typeof createTagPreview === 'function') createTagPreview(tag);
                });
                wrapper.appendChild(btn);
            });
            return wrapper;
        }
        // 기존 <ul>을 버튼 컨테이너로 교체 (본문 내에서만)
        ulList.forEach(ul => {
            // <ul> 내 <li> -> <a> 추출
            const tagObjs = Array.from(ul.querySelectorAll('li a')).map(a => ({
                tag: a.textContent.trim(),
                type: getTagType(a)
            })).filter(obj => obj.tag.length > 0);
            // 컨테이너 생성
            const btnContainer = createTagGroupButtonContainer(tagObjs);
            ul.parentNode.insertBefore(btnContainer, ul);
            ul.remove();
        });
        // Copy Selected Tags 버튼 생성 (본문 맨 위)
        if (!mainContent.querySelector('.rapidbooru-taggroup-copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.textContent = 'Copy Selected Tags';
            copyBtn.className = 'rapidbooru-copy-btn rapidbooru-taggroup-copy-btn';
            copyBtn.style.margin = '0 0 18px 0';
            copyBtn.style.display = 'block';
            copyBtn.style.fontSize = '15px';
            copyBtn.addEventListener('click', function() {
                if (tagGroupSelectedTags.length > 0) {
                    const str = tagGroupSelectedTags.join(', ');
                    navigator.clipboard.writeText(str).then(() => {
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy Selected Tags';
                            copyBtn.classList.remove('copied');
                        }, 1500);
                    });
                }
            });
            // 본문 맨 앞에 삽입
            mainContent.insertBefore(copyBtn, mainContent.firstChild);
        }
        // 스타일 추가 (카테고리별 버튼 색상)
        if (!document.getElementById('rapidbooru-taggroup-style')) {
            const style = document.createElement('style');
            style.id = 'rapidbooru-taggroup-style';
            style.textContent = `
                .rapidbooru-sidebar-tag-btn.selected[data-category="artist"] { background: #7a0a2c !important; }
                .rapidbooru-sidebar-tag-btn[data-category="artist"] { background: #dd5555 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="copyright"] { background: #2d0766 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="copyright"] { background: #8454cc !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="character"] { background: #04472d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="character"] { background: #2ab367 !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="general"] { background: #10164d !important; }
                .rapidbooru-sidebar-tag-btn[data-category="general"] { background: #47799c !important; }
                .rapidbooru-sidebar-tag-btn.selected[data-category="meta"] { background: #1f1c03 !important; }
                .rapidbooru-sidebar-tag-btn[data-category="meta"] { background: #79722a !important; }
                .rapidbooru-sidebar-tag-btn { outline: none; }
                .rapidbooru-sidebar-tag-btn:active { filter: brightness(0.95); }
            `;
            document.head.appendChild(style);
        }
    }

    // [추가] 테마 및 기능 설정
    const rapidbooruSettings = {
        '--rapidbooru-bg-color': '#2a2a2a',
        '--rapidbooru-secondary-bg-color': '#1a1a1a',
        '--rapidbooru-accent-color': '#667eea',
        '--rapidbooru-accent-hover-color': '#5a6fd8',
        '--rapidbooru-text-color': '#ffffff',
        '--rapidbooru-border-color': '#444',
        'searchOrder': 'Jaccard',
    };

    function applySettings(settings) {
        const styleId = 'rapidbooru-theme-styles';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        const cssVariables = Object.entries(settings)
            .filter(([key]) => key.startsWith('--'))
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');
        styleElement.textContent = `:root { ${cssVariables} }`;
    }

    function saveSettings(settings) {
        Object.assign(rapidbooruSettings, settings); // Update global settings object
        localStorage.setItem('rapidbooru_settings', JSON.stringify(rapidbooruSettings));
        applySettings(rapidbooruSettings);
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('rapidbooru_settings');
        if (savedSettings) {
            try {
                Object.assign(rapidbooruSettings, JSON.parse(savedSettings));
            } catch (e) {
                console.error('Rapidbooru: Failed to parse settings', e);
                localStorage.removeItem('rapidbooru_settings');
            }
        }
        applySettings(rapidbooruSettings);
    }

    function createSettingsPanel() {
        const panelId = 'rapidbooru-settings-panel';
        if (document.getElementById(panelId)) return;

        const panel = document.createElement('div');
        panel.id = panelId;
        panel.className = 'rapidbooru-overlay';
        panel.style.display = 'none'; // Initially hidden
        panel.style.zIndex = '10003'; // Ensure panel is on top of the button

        const content = document.createElement('div');
        content.className = 'rapidbooru-preview';
        content.style.flexDirection = 'column';
        content.style.width = '400px';
        content.style.height = 'auto';
        content.style.padding = '20px';
        content.style.background = 'var(--rapidbooru-bg-color)';
        content.style.color = 'var(--rapidbooru-text-color)';

        const title = document.createElement('h3');
        title.textContent = 'Settings';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';

        const hidePanel = () => {
            panel.classList.remove('show'); // Start fade-out animation
            // After transition, hide the element completely
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300); // Must match CSS transition duration
        };

        const form = document.createElement('div');
        form.style.display = 'grid';
        form.style.gridTemplateColumns = 'auto 1fr';
        form.style.gap = '15px';
        form.style.alignItems = 'center';

        const createColorInput = (label, key) => {
            const labelEl = document.createElement('label');
            labelEl.textContent = label;

            const inputEl = document.createElement('input');
            inputEl.type = 'color';
            inputEl.value = rapidbooruSettings[key];
            inputEl.dataset.key = key;
            inputEl.style.width = '100px';
            inputEl.style.height = '40px';
            inputEl.style.border = 'none';
            inputEl.style.padding = '0';
            inputEl.style.background = 'none';
            inputEl.style.cursor = 'pointer';

            form.appendChild(labelEl);
            form.appendChild(inputEl);
        };

        createColorInput('프리뷰 창 배경', '--rapidbooru-bg-color');
        createColorInput('프리뷰 창 사이드', '--rapidbooru-secondary-bg-color');
        createColorInput('메인 버튼1', '--rapidbooru-accent-color');
        createColorInput('메인 버튼2', '--rapidbooru-accent-hover-color');
        createColorInput('글자', '--rapidbooru-text-color');
        createColorInput('테두리', '--rapidbooru-border-color');

        // [추가] 검색 방식 드롭다운
        const createSelectInput = (label, key, options) => {
            const labelEl = document.createElement('label');
            labelEl.textContent = label;

            const selectEl = document.createElement('select');
            selectEl.dataset.key = key;
            selectEl.style.width = '100px';
            selectEl.style.height = '40px';
            selectEl.style.padding = '5px';
            selectEl.style.background = 'var(--rapidbooru-secondary-bg-color)';
            selectEl.style.color = 'var(--rapidbooru-text-color)';
            selectEl.style.border = `1px solid var(--rapidbooru-border-color)`;
            selectEl.style.borderRadius = '4px';

            options.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt;
                optionEl.textContent = opt;
                selectEl.appendChild(optionEl);
            });

            form.appendChild(labelEl);
            form.appendChild(selectEl);
        };

        createSelectInput('검색 방식', 'searchOrder', ['Jaccard', 'Frequency']);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '20px';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'rapidbooru-btn';
        saveBtn.onclick = () => {
            const newSettings = { ...rapidbooruSettings };
            form.querySelectorAll('[data-key]').forEach(input => {
                newSettings[input.dataset.key] = input.value;
            });
            saveSettings(newSettings);
            hidePanel();
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'rapidbooru-btn';
        closeBtn.style.background = '#aaa';
        closeBtn.onclick = () => {
            hidePanel();
        };

        buttonContainer.appendChild(closeBtn);
        buttonContainer.appendChild(saveBtn);

        // [여기서부터 추가] 초기화 버튼
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'rapidbooru-btn';
        resetBtn.style.position = 'absolute';
        resetBtn.style.left = '24px';
        resetBtn.style.bottom = '24px';
        resetBtn.style.background = '#e74c3c';
        resetBtn.style.color = '#fff';
        resetBtn.style.display = 'flex';
        resetBtn.style.alignItems = 'center';
        resetBtn.style.gap = '6px';
        resetBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;">
                <path d="M12 5V2L7 7l5 5V8c3.31 0 6 2.69 6 6 0 3.31-2.69 6-6 6s-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor"/>
            </svg>
            Reset
        `;
        // 기본값 정의
        const rapidbooruDefaultSettings = {
            '--rapidbooru-bg-color': '#2a2a2a',
            '--rapidbooru-secondary-bg-color': '#1a1a1a',
            '--rapidbooru-accent-color': '#667eea',
            '--rapidbooru-accent-hover-color': '#5a6fd8',
            '--rapidbooru-text-color': '#ffffff',
            '--rapidbooru-border-color': '#444',
            'searchOrder': 'Jaccard',
        };
        resetBtn.onclick = () => {
            saveSettings({ ...rapidbooruDefaultSettings });
            // 폼 값도 즉시 반영
            Object.entries(rapidbooruDefaultSettings).forEach(([key, value]) => {
                const input = panel.querySelector(`[data-key="${key}"]`);
                if (input) input.value = value;
            });
        };
        // content에 상대적 위치를 위해 position:relative 적용
        content.style.position = 'relative';
        content.appendChild(resetBtn);
        // [여기까지 추가]

        content.appendChild(title);
        content.appendChild(form);
        content.appendChild(buttonContainer);
        panel.appendChild(content);

        panel.onclick = (e) => {
            if (e.target === panel) {
                hidePanel();
            }
        };

        document.body.appendChild(panel);
    }

    function createSettingsButton() {
        const btn = document.createElement('button');
        btn.id = 'rapidbooru-settings-btn';
        btn.title = 'Rapidbooru Settings';
        btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c.04.32.07.65.07.98s-.03.66-.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="currentColor"/>
        </svg>`;

        btn.onclick = () => {
            const panel = document.getElementById('rapidbooru-settings-panel');
            if (panel) {
                panel.style.display = 'flex'; // Make it visible
                setTimeout(() => panel.classList.add('show'), 10); // Add 'show' to trigger fade-in
                // Populate form with current settings from the global object
                Object.entries(rapidbooruSettings).forEach(([key, value]) => {
                    const input = panel.querySelector(`[data-key="${key}"]`);
                    if (input) {
                        input.value = value;
                    }
                });
            }
        };

        document.body.appendChild(btn);
    }

    // 초기화
    function init() {
        loadSettings();
        addStyles();
        addLuckyButton();
        setupImagePreview();
        setupTagPreview();
        setupRelatedTagsFeature();
        setupSidebarTagButtonList(); // [추가] 사이드바 태그 버튼형 리스트
        setupTagGroupPageTagButtons(); // [추가] 태그 그룹 페이지용 태그 버튼 컨테이너
        createSettingsPanel();
        createSettingsButton();
        console.log('Rapidbooru script loaded');
    }

    // DOM이 로드되면 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();