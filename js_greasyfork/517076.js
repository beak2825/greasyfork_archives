// ==UserScript==
// @name        팸코 뎃글콘 + 본문콘
// @namespace   Violentmonkey Scripts
// @match        *://*.fmkorea.com/*
// @grant       none
// @version     1.4
// @author      -
// @description 팸코 뎃글콘을 쉽게 쓸수 있게 해줍니다 이제 뎃글콘을 본문에서도 쓸수 있습니다
// @downloadURL https://update.greasyfork.org/scripts/517076/%ED%8C%B8%EC%BD%94%20%EB%8E%83%EA%B8%80%EC%BD%98%20%2B%20%EB%B3%B8%EB%AC%B8%EC%BD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/517076/%ED%8C%B8%EC%BD%94%20%EB%8E%83%EA%B8%80%EC%BD%98%20%2B%20%EB%B3%B8%EB%AC%B8%EC%BD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

// 상수 정의
const CONSTANTS = {
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
    SHEET_CONFIG: [
        { name: 'Sheet1', displayName: '이름없음' },
        { name: 'Sheet2', displayName: '이름없음' },
        { name: 'Sheet3', displayName: '이름없음' },
        { name: 'Sheet4', displayName: '이름없음' },
        { name: 'Sheet5', displayName: '이름없음' },
    ],
    GRID_COLORS: ['#f0f0f0', '#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec'],
    CELL_SIZE: 50,
    GRID_COLS: 10
};

// 로컬 스토리지 관리를 위한 유틸리티
const storageUtils = {
    saveRecentEmoticon(url) {
        try {
            const recent = JSON.parse(localStorage.getItem('recentEmoticons') || '[]');
            const index = recent.indexOf(url);
            if (index > -1) {
                recent.splice(index, 1);
            }
            recent.unshift(url);
            localStorage.setItem('recentEmoticons', JSON.stringify(recent.slice(0, 20)));
        } catch (error) {
            console.error('Failed to save recent emoticon:', error);
        }
    },

    getRecentEmoticons() {
        try {
            return JSON.parse(localStorage.getItem('recentEmoticons') || '[]');
        } catch (error) {
            console.error('Failed to get recent emoticons:', error);
            return [];
        }
    }
};

// 유틸리티 함수들
const utils = {
    createElementWithStyles: (tag, styles = {}) => {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        return element;
    },

    addHideScrollbarStyles: (element) => {
        Object.assign(element.style, {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
        });
        element.style.cssText += '::-webkit-scrollbar { display: none; }';
        return element;
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// 스프레드시트 데이터 fetcher
class SpreadsheetDataFetcher {
    static async fetchData(spreadsheetId, sheetName) {
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

        try {
            const response = await fetch(url);
            const text = await response.text();
            const jsonData = JSON.parse(text.substring(47).slice(0, -2));

            return jsonData.table.rows
                .filter(row => row.c && row.c[0] && row.c[0].v)
                .map(row => row.c[0].v);
        } catch (error) {
            console.error(`Failed to fetch ${sheetName} data:`, error);
            return [];
        }
    }
}

// 미디어 셀 컴포넌트
class MediaCell {
    constructor(url, index, cols) {
        this.url = url;
        this.index = index;
        this.cols = cols;
        this.element = this.createElement();
    }

    createElement() {
        const cell = utils.createElementWithStyles('div', {
            width: `${CONSTANTS.CELL_SIZE}px`,
            height: `${CONSTANTS.CELL_SIZE}px`,
            backgroundColor: CONSTANTS.GRID_COLORS[Math.floor(this.index / this.cols) % CONSTANTS.GRID_COLORS.length],
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
            transition: 'all 0.3s ease',
            zIndex: '1'
        });

        const mediaElement = this.createImageElement();
        cell.appendChild(mediaElement);

        this.addEventListeners(cell);
        return cell;
    }

    createImageElement() {
        const img = utils.createElementWithStyles('img', {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '0',
            left: '0',
            transition: 'all 0.3s ease'
        });

        img.src = this.url;
        img.alt = '이미지';

        img.onerror = () => this.handleMediaError(img);
        return img;
    }

    handleMediaError(mediaElement) {
        mediaElement.style.display = 'none';
        const errorText = utils.createElementWithStyles('div', {
            fontSize: '10px',
            color: '#999'
        });
        errorText.textContent = '이미지 없음';
        this.element.appendChild(errorText);
    }

    addEventListeners(cell) {
        cell.addEventListener('mouseover', () => this.handleMouseOver(cell));
        cell.addEventListener('mouseout', () => this.handleMouseOut(cell));
        cell.addEventListener('click', () => this.handleClick());
    }

    handleMouseOver(cell) {
        Object.assign(cell.style, {
            backgroundColor: '#e0e0e0',
            cursor: 'pointer',
            opacity: '0.9',
            transform: 'scale(2)',
            zIndex: '2'
        });
    }

    handleMouseOut(cell) {
        Object.assign(cell.style, {
            backgroundColor: CONSTANTS.GRID_COLORS[Math.floor(this.index / this.cols) % CONSTANTS.GRID_COLORS.length],
            opacity: '1',
            transform: 'scale(1)',
            zIndex: '1'
        });
    }
  handleClick() {

        storageUtils.saveRecentEmoticon(this.url);

        // XpressEditor 처리
        const xpressEditor = document.querySelector('.xpress-editor');
        if (xpressEditor) {
            const editorFrame = xpressEditor.querySelector('iframe');
            if (editorFrame && editorFrame.contentWindow) {
                const doc = editorFrame.contentWindow.document;
                const bodyElement = doc.getElementById('___body');

                if (bodyElement) {
                    const mediaTag = `<img src="${this.url}" style="max-width: 100%;" />`;

                    // 현재 선택 영역 가져오기
                    const selection = editorFrame.contentWindow.getSelection();

                    if (selection.rangeCount > 0) {
                        // 현재 커서 위치의 range 가져오기
                        const range = selection.getRangeAt(0);

                        // 새로운 컨텐츠 생성
                        const newContent = doc.createElement('div');
                        newContent.innerHTML = `<p>${mediaTag}</p><p><br /></p>`;

                        // 새 컨텐츠의 노드들을 순서대로 삽입
                        Array.from(newContent.childNodes).forEach(node => {
                            range.insertNode(node);
                            range.setStartAfter(node);
                        });

                    } else {
                        // 선택 영역이 없는 경우 본문 끝에 추가
                        const newContent = doc.createElement('div');
                        newContent.innerHTML = `<p>${mediaTag}</p><p><br /></p>`;
                        bodyElement.append(...newContent.childNodes);
                    }
                }
            }
        }

        // 기존 댓글창 처리
        const textarea = document.querySelector('.fdb_lst_ul #re_cmt textarea') ||
                        document.querySelector('.cmt_editor textarea');

        if (textarea) {
            textarea.value = this.url;
            textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

            if (textarea.hasAttribute('data-autogrow')) {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }

            setTimeout(() => {
                const submitButton = document.querySelector('input.bd_btn.keyup_alt');
                if (submitButton) {
                    submitButton.click();
                }
            }, 100);
        }

        // 모달 닫기
        const modal = document.querySelector('.emotion-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// 모달 컴포넌트
class EmotionModal {
    constructor() {
        this.modal = this.createModal();
        this.modalContent = this.createModalContent();
        this.button = this.createButton();
        this.initialize();
        this.initializeXpressEditorButton();
    }

    async initialize() {
        try {
            const gridData = await this.fetchAllSheetData();
            if (gridData.length === 0) {
                console.log('No images to display');
                return;
            }

            this.setupModalContent(gridData);
            this.setupEventListeners();
            this.updateButtonPosition();

            document.body.appendChild(this.button);
            document.body.appendChild(this.modal);
        } catch (error) {
            console.error('Failed to initialize emotion modal:', error);
        }
    }

    async fetchAllSheetData() {
        const gridData = await Promise.all(
            CONSTANTS.SHEET_CONFIG.map(sheet =>
                SpreadsheetDataFetcher.fetchData(CONSTANTS.SPREADSHEET_ID, sheet.name)
            )
        );

        return CONSTANTS.SHEET_CONFIG
            .map((config, index) => ({
                data: gridData[index],
                config: config
            }))
            .filter(item => item.data.length > 0);
    }

    createModal() {
        const modal = utils.addHideScrollbarStyles(
            utils.createElementWithStyles('div', {
                display: 'none',
                position: 'fixed',
                zIndex: '1000',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                overflowY: 'scroll'
            })
        );
        modal.className = 'emotion-modal';
        return modal;
    }

    createModalContent() {
        return utils.addHideScrollbarStyles(
            utils.createElementWithStyles('div', {
                backgroundColor: '#fefefe',
                margin: '5% auto',
                marginBottom: '5%',
                padding: '15px',
                border: '1px solid #888',
                width: '80%',
                maxWidth: '600px',
                borderRadius: '5px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'scroll'
            })
        );
    }

    createButton() {
        const button = utils.createElementWithStyles('button', {
            position: 'fixed',
            zIndex: '1000',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        });
        button.textContent = '댓글콘';
        return button;
    }

    // Xpress 에디터 버튼 초기화
    initializeXpressEditorButton() {
        const editor = document.querySelector('.xpress-editor');

        if (editor) {
            const toolDiv = editor.querySelector('.tool');

            if (toolDiv) {
                const eighthChild = toolDiv.children[7];

                if (eighthChild) {
                    const newUl = document.createElement('ul');
                    const newLi = document.createElement('li');
                    const newSpan = document.createElement('span');

                    newSpan.textContent = '댓글콘';
                    newSpan.style.height = '21px';
                    newSpan.style.width = '60px';
                    newSpan.style.display = 'inline-block';
                    newSpan.style.cursor = 'pointer';

                    // 클릭 이벤트 추가
                    newSpan.addEventListener('click', () => {
                        this.modal.style.display = 'block';
                    });

                    newLi.appendChild(newSpan);
                    newUl.appendChild(newLi);
                    eighthChild.after(newUl);
                }
            }
        }
    }

    setupModalContent(gridData) {
        // 상단 헤더 컨테이너 생성
        const headerContainer = utils.createElementWithStyles('div', {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '15px'
        });

        // 제목 생성
        const title = utils.createElementWithStyles('h3', {
            margin: '0',
            padding: '0'
        });
        title.textContent = '댓글콘';

        // 스프레드시트 링크 생성
        const spreadsheetLink = utils.createElementWithStyles('a', {
            display: 'flex',
            alignItems: 'center',
            padding: '5px 10px',
            backgroundColor: '#34A853',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        });

        // 구글 시트 아이콘 SVG
        const sheetIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style="margin-right: 5px;" fill="white">
                <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3M19 19H5V5H19V19M17 17H7V7H17V17M15 15H9V13H15V15M15 11H9V9H15V11Z"/>
            </svg>
        `;

        spreadsheetLink.innerHTML = `${sheetIcon} 시트 바로가기`;
        spreadsheetLink.href = `https://docs.google.com/spreadsheets/d/${CONSTANTS.SPREADSHEET_ID}`;
        spreadsheetLink.target = '_blank';
        spreadsheetLink.rel = 'noopener noreferrer';

        // 마우스 오버 효과
        spreadsheetLink.addEventListener('mouseover', () => {
            spreadsheetLink.style.backgroundColor = '#2E9548';
        });
        spreadsheetLink.addEventListener('mouseout', () => {
            spreadsheetLink.style.backgroundColor = '#34A853';
        });

        // 헤더에 요소들 추가
        headerContainer.appendChild(title);
        headerContainer.appendChild(spreadsheetLink);

        const mainContainer = this.createMainContainer();

        // 최근 사용 섹션 추가
        const recentEmoticons = storageUtils.getRecentEmoticons();
        if (recentEmoticons.length > 0) {
            const recentSection = {
                data: recentEmoticons,
                config: { displayName: '최근 사용' }
            };
            mainContainer.appendChild(this.createGridSection(recentSection));
            mainContainer.appendChild(this.createDivider());
        }

        // 기존 그리드 데이터 추가
        gridData.forEach((item, index) => {
            if (index > 0) {
                mainContainer.appendChild(this.createDivider());
            }
            mainContainer.appendChild(this.createGridSection(item));
        });

        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(headerContainer);
        this.modalContent.appendChild(mainContainer);
        this.modal.appendChild(this.modalContent);
    }

    createMainContainer() {
        return utils.addHideScrollbarStyles(
            utils.createElementWithStyles('div', {
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                alignItems: 'center',
                width: '100%',
                overflowX: 'hidden',
                overflowY: 'scroll'
            })
        );
    }

    createDivider() {
        return utils.createElementWithStyles('hr', {
            width: '90%',
            margin: '8px auto'
        });
    }

    createGridSection(item) {
        const section = utils.createElementWithStyles('div', {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });

        const label = this.createSectionLabel(item);
        const grid = this.createGrid(item.data);

        section.appendChild(label);
        section.appendChild(grid);
        return section;
    }

    createSectionLabel(item) {
        const label = utils.createElementWithStyles('div', {
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '4px',
            backgroundColor: item.config.displayName === '최근 사용' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '3px',
            marginBottom: '8px',
            width: '100%',
            textAlign: 'center'
        });
        label.textContent = item.config.displayName === '최근 사용' ?
            '최근 사용' :
            `${item.config.displayName} (${item.data.length}개)`;
        return label;
    }

    createGrid(contents) {
        const grid = utils.createElementWithStyles('div', {
            display: 'grid',
            gridTemplateColumns: `repeat(${CONSTANTS.GRID_COLS}, ${CONSTANTS.CELL_SIZE}px)`,
            gap: '3px',
            justifyContent: 'center',
            padding: '8px',
            transition: 'all 0.3s ease'
        });

        contents.forEach((url, index) => {
            const cell = new MediaCell(url, index, CONSTANTS.GRID_COLS);
            grid.appendChild(cell.element);
        });

        return grid;
    }

    setupEventListeners() {
        // 기존 이벤트 리스너들
        this.button.addEventListener('click', () => this.modal.style.display = 'block');
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });

        // 스프레드시트 단축키 추가
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault(); // 기본 동작 방지
                window.open(`https://docs.google.com/spreadsheets/d/${CONSTANTS.SPREADSHEET_ID}`, '_blank');
            }
        });

        const debouncedUpdatePosition = utils.debounce(() => this.updateButtonPosition(), 100);
        window.addEventListener('scroll', debouncedUpdatePosition);
        window.addEventListener('resize', debouncedUpdatePosition);

        this.observeDOMChanges();
    }

    updateButtonPosition() {
        const content = document.querySelector('.rd_nav.img_tx.fr.m_btn_wrp');
        if (!content) {
            console.error('Navigation element not found');
            return;
        }

        const contentRect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (contentRect.bottom <= windowHeight) {
            this.button.style.top = `${contentRect.bottom - 140}px`;
            this.button.style.right = `${window.innerWidth - contentRect.right - 66}px`;
        }
    }

    observeDOMChanges() {
        const observer = new MutationObserver(() => {
            const commentSection = document.querySelector('.rd_ft_nav.clear');
            this.button.style.display = commentSection ? 'block' : 'none';
            if (commentSection) {
                this.updateButtonPosition();
            }

});

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 애플리케이션 초기화
function initializeApp() {
    const commentSection = document.querySelector('.rd_ft_nav.clear');
    if (commentSection) {
        new EmotionModal();
    } else {
        console.log('Comment section not found. Button will be created only if XpressEditor exists.');
        const xpressEditor = document.querySelector('.xpress-editor');
        if (xpressEditor) {
            new EmotionModal();
        }
    }
}

// 핫키 설정
document.addEventListener('keydown', (e) => {
    // Alt + E로 이모티콘 모달 열기
    if (e.altKey && e.key.toLowerCase() === 'e') {
        const modal = document.querySelector('.emotion-modal');
        if (modal) {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        }
    }
});

// 스크립트 실행
(() => {
    // DOM이 완전히 로드된 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
})();

})();