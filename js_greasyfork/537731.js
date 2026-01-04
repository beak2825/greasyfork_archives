// ==UserScript==
// @name             디시인사이드 갤스코프
// @name:ko          디시인사이드 갤스코프
// @namespace        https://gallog.dcinside.com/appetite8514
// @author           우왁굳(유튜버) 마이너 갤러리
// @version          2.0.8-release
// @description      갤러리 내 고정닉 비율 및 소수 인원의 게시글 점유율 파악 + 갤러리 감정 분석 및 AI 요약 + 글리젠 속도 파악 + 지표 그래프 + 작성글 검색
// @description:ko   갤러리 내 고정닉 비율 및 소수 인원의 게시글 점유율 파악 + 갤러리 감정 분석 및 AI 요약 + 글리젠 속도 파악 + 지표 그래프 + 작성글 검색
// @match            https://gall.dcinside.com/*/board/lists*
// @match            https://gall.dcinside.com/board/lists*
// @grant            GM_xmlhttpRequest
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @grant            GM_listValues
// @grant            GM_deleteValue
// @icon             https://i.imgur.com/JPUBQQd.png
// @run-at           document-end
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/537731/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EC%8A%A4%EC%BD%94%ED%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/537731/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EC%8A%A4%EC%BD%94%ED%94%84.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function makeDraggable(element, options) {
        let isDragging = false;
        let startX, startY, offsetX, offsetY;

        const handle = options?.handle || element;

        const dragMouseDown = (e) => {
            if (e.button !== 0) return;
            e.preventDefault();

            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;

            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        };

        const elementDrag = (e) => {
            e.preventDefault();
            if (!isDragging && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) {
                isDragging = true;
                if (options.onDragStart) options.onDragStart();
            }

            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                const docWidth = document.documentElement.clientWidth;
                const docHeight = document.documentElement.clientHeight;
                const elRect = element.getBoundingClientRect();

                newLeft = Math.max(0, Math.min(newLeft, docWidth - elRect.width));
                newTop = Math.max(0, Math.min(newTop, docHeight - elRect.height));

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            }
        };

        const closeDragElement = (e) => {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);

            if (isDragging) {
                const finalPosition = { top: element.style.top, left: element.style.left };
                if (options.storageKey) {
                    GM_setValue(options.storageKey, JSON.stringify(finalPosition));
                }
                if (options.onDragEnd) options.onDragEnd();
            } else {
                if (options.onClick) options.onClick(e);
            }
            isDragging = false;
        };

        handle.addEventListener('mousedown', dragMouseDown);
    }

    async function applySavedPosition(element, storageKey) {
        try {
            const savedPosition = await GM_getValue(storageKey, null);
            if (savedPosition) {
                const pos = JSON.parse(savedPosition);
                element.style.top = pos.top;
                element.style.left = pos.left;
            }
        } catch (e) {
            console.error(`[Gallscope] Failed to apply saved position for ${storageKey}:`, e);
            await GM_setValue(storageKey, null);
        }
    }
    /**
     * @class TooltipManager
     * @description Handles creation, display, and events for tooltips.
     */
    class TooltipManager {
        #config;
        #tooltipElement;

        constructor(config) {
            this.#config = config;
            this.#tooltipElement = null;
        }

        #getOrCreateElement() {
            if (this.#tooltipElement) return this.#tooltipElement;
            const el = document.createElement('div');
            el.id = this.#config.UI.TOOLTIP_ID;
            document.body.appendChild(el);
            this.#tooltipElement = el;
            return el;
        }

        show(event, htmlContent) {
            const tooltip = this.#getOrCreateElement();
            tooltip.innerHTML = htmlContent;
            tooltip.style.visibility = 'hidden';
            tooltip.style.display = 'block';
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.display = '';
            tooltip.style.visibility = '';
            tooltip.classList.add('visible');

            let x = event.clientX + window.scrollX + 15;
            let y = event.clientY + window.scrollY + 15;
            if (x + tooltipRect.width > window.innerWidth + window.scrollX - 10) {
                x = event.clientX + window.scrollX - tooltipRect.width - 15;
            }
            if (y + tooltipRect.height > window.innerHeight + window.scrollY - 10) {
                y = event.clientY + window.scrollY - tooltipRect.height - 15;
            }
            tooltip.style.left = `${Math.max(5, x)}px`;
            tooltip.style.top = `${Math.max(5, y)}px`;
        }

        hide() {
            this.#tooltipElement?.classList.remove('visible');
        }
    }

    /**
     * @class ModalManager
     * @description Handles creation and management of all modals in the application.
     */
    class ModalManager {
        #config;
        #state;
        #eventHandlers;
        #uiManager;

        #summaryModal;
        #graphModal;
        #scopeInputModal;
        #userPostsModal;
        #aiUserAnalysisModal;

        constructor(config, state, eventHandlers, uiManager) {
            this.#config = config;
            this.#state = state;
            this.#eventHandlers = eventHandlers;
            this.#uiManager = uiManager;

            this.#summaryModal = null;
            this.#graphModal = null;
            this.#scopeInputModal = null;
            this.#userPostsModal = null;
            this.#aiUserAnalysisModal = null;
        }

        #createAndAppendElement(tagName, id, className) {
            const el = document.createElement(tagName);
            if (id) el.id = id;
            if (className) el.className = className;
            document.body.appendChild(el);
            return el;
        }

        #_createModal(id, title) {
            const modal = this.#createAndAppendElement('div', id, 'gallscope-modal-base');
            modal.innerHTML = `
                <div class="modal-header">
                    <div class="modal-title"><img src="${this.#config.ICON_URL}" class="modal-icon"><span>${title}</span></div>
                    <button class="close-btn">×</button>
                </div>
                <div class="modal-content"></div>
                <div class="modal-footer" style="display: none;"></div>
            `;
            modal.dataset.defaultTitle = title;
            modal.querySelector('.close-btn').onclick = () => (modal.style.display = 'none');
            this.#uiManager.updateTheme();
            return modal;
        }

        #getOrCreateSummaryModal = () => this.#summaryModal ?? (this.#summaryModal = this.#_createModal(this.#config.UI.AI_MODAL_ID, 'AI 요약'));
        #getOrCreateGraphModal = () => this.#graphModal ?? (this.#graphModal = this.#_createModal(this.#config.UI.GRAPH_MODAL_ID, '스코프 분석 그래프'));
        #getOrCreateScopeInputModal = () => this.#scopeInputModal ?? (this.#scopeInputModal = this.#_createModal(this.#config.UI.SCOPE_INPUT_MODAL_ID, '스코프 확장'));
        #getOrCreateUserPostsModal = () => {
            if (this.#userPostsModal) return this.#userPostsModal;

            const modal = this.#_createModal(this.#config.UI.USER_POSTS_MODAL_ID, '유저 작성글');
            this.#userPostsModal = modal;
            this.#state.userPostsModalElement = modal;
            return modal;
        };
        #getOrCreateAIUserAnalysisModal = (title) => {
            let modal = this.#aiUserAnalysisModal;
            if (!modal) {
                modal = this.#_createModal(this.#config.UI.AI_USER_ANALYSIS_MODAL_ID, title);
                modal.style.maxWidth = '600px';
                this.#aiUserAnalysisModal = modal;
            }
            modal.querySelector('.modal-header .modal-title > span').textContent = title;
            return modal;
        };

        show(content, options = {}) {
            const { modalType = 'summary', title = null, footerContent = null, onFooterMount = null } = options;
            this.#eventHandlers.log('ModalManager', `모달 표시 요청. 타입: ${modalType}, 제목: ${title || '기본값'}`);

            let modal;
            switch (modalType) {
                case 'summary':
                    modal = this.#getOrCreateSummaryModal();
                    break;
                default:
                    modal = this.#getOrCreateSummaryModal();
            }

            const titleEl = modal.querySelector('.modal-header .modal-title > span');
            if (titleEl) {
                titleEl.textContent = title || modal.dataset.defaultTitle || '';
            }
            modal.querySelector('.modal-content').innerHTML = content;

            const footerEl = modal.querySelector('.modal-footer');
            if (footerEl) {
                if (footerContent) {
                    footerEl.innerHTML = footerContent;
                    footerEl.style.display = 'flex';
                    if (onFooterMount) onFooterMount(modal);
                } else {
                    footerEl.style.display = 'none';
                    footerEl.innerHTML = '';
                }
            }
            modal.style.display = 'block';
        }

        hide(modalType = 'summary') {
            if (modalType === 'summary' && this.#summaryModal) this.#summaryModal.style.display = 'none';
        }

        hideScopeInput() {
            if (this.#scopeInputModal) this.#scopeInputModal.style.display = 'none';
        }

        renderSummary(apiResponse) {
            const modal = this.#getOrCreateSummaryModal();
            const modalContentEl = modal.querySelector('.modal-content');
            const summaryText = apiResponse.candidates?.[0]?.content?.parts?.[0]?.text.trim();
            let html = '';

            if (summaryText) {
                const lines = summaryText.split('\n').filter(line => line.trim() !== '');
                const intro = lines.length > 0 ? `<p>${lines[0]}</p>` : '';
                const itemsHtml = lines.slice(1).map(line => {
                    const idRegex = /\(대표글 ID: (\d+)\)/;
                    const match = line.match(idRegex);
                    if (match?.[1]) {
                        const postNo = match[1];
                        const galleryId = new URLSearchParams(window.location.search).get('id');
                        const postLink = galleryId ? `${window.location.pathname.replace(/\/lists\/?/, '/view/')}?id=${galleryId}&no=${postNo}&page=1` : '#';
                        const linkHtml = `<a href="${postLink}" target="_blank" rel="noopener noreferrer" class="main-link">(대표글 링크)</a>`;
                        return `<li>${line.replace(idRegex, '').replace(/^\d+\.\s*-?\s*/, '').trim().replace(/ \./g, '.')}  ${linkHtml}</li>`;
                    }
                    return `<li>${line.replace(/^\d+\.\s*-?\s*/, '')}</li>`;
                }).join('');
                const listHtml = itemsHtml ? `<ol style="margin-top: 10px; line-height: 1.5; list-style-type: decimal !important; padding-left: 15px;">${itemsHtml}</ol>` : '';
                const footerHtml = `<hr><div class="modal-footer-inline"><button id="gallscopeCopyBtn" style="display: none;"></button><div class="modal-credits-inline"><small>Powered by Google Gemini (${this.#state.selectedGeminiModel})</small><small>${this.#eventHandlers.getFormattedTimestamp()} by 갤스코프</small></div></div>`;
                html = `${intro}${listHtml}${footerHtml}`;
                modalContentEl.innerHTML = html;
                this.#eventHandlers.onSetupCopyButton(summaryText);
            } else {
                if (apiResponse.error) html = `<p style="color:red;"><strong>API 오류:</strong> ${apiResponse.error.message} (코드: ${apiResponse.error.code})</p><p>API 키가 유효한지, 사용량 한도를 초과하지 않았는지, 또는 선택된 모델(${this.#state.selectedGeminiModel})에 대한 접근 권한이 있는지 확인해주세요.</p><small>API 오류: The model is overloaded. Please try again later. 가 뜬다면, 모델을 변경해보세요.</small>`;
                else if (apiResponse.candidates?.[0]?.finishReason === "SAFETY") html = `<p style="color:orange;"><strong>요약 생성 중단 (SAFETY):</strong> Gemini API가 안전상의 이유로 응답 생성을 중단했습니다.</p><pre>${JSON.stringify(apiResponse.candidates[0].safetyRatings, null, 2)}</pre>`;
                else html = '<p style="color:red;">Gemini AI로부터 유효한 요약을 받지 못했습니다.</p><pre>' + JSON.stringify(apiResponse, null, 2) + '</pre>';
                modalContentEl.innerHTML = html;
            }
            modal.style.display = 'block';
        }

        showGraph(data) {
            this.#eventHandlers.log('ModalManager', '그래프 모달 표시 요청. 데이터 포인트:', data.length);
            const modal = this.#getOrCreateGraphModal();
            modal.querySelector('.modal-content').innerHTML = '<canvas id="gallscopeChartCanvas"></canvas>';
            modal.style.display = 'block';
            const ctx = modal.querySelector('#gallscopeChartCanvas').getContext('2d');

            const isDark = this.#uiManager.isDarkMode();
            const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const tickColor = isDark ? '#ccc' : '#666';
            const axisTitleColor = isDark ? '#e0e0e0' : '#444';
            const legendTxtColor = isDark ? '#e8e8e8' : '#333';
            const chartTitleColor = isDark ? '#f0f0f0' : '#222';
            const font = '"Pretendard", sans-serif';

            const pad = n => String(n).padStart(2, '0');
            const today = new Date();
            const labels = data.map(d => {
                const date = d.timestamp;
                return date.toDateString() === today.toDateString() ?
                    `${pad(date.getHours())}:${pad(date.getMinutes())}` :
                `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
            });

            const now = new Date();
            const timestampText = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} Powered by 갤스코프`;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: '고정닉 농도',
                        data: data.map(d => d.fixedNickRatio),
                        borderColor: '#36a2eb',
                        backgroundColor: '#36a2eb80',
                        yAxisID: 'y_ratio',
                        tension: 0.1
                    }, {
                        label: '갤 망령 지수(정규화)',
                        data: data.map(d => d.normalizedGpi),
                        borderColor: '#ff6384',
                        backgroundColor: '#ff638480',
                        yAxisID: 'y_ratio',
                        tension: 0.1
                    }, {
                        label: '글 리젠 속도(PPM)',
                        data: data.map(d => d.ppm),
                        borderColor: '#ffce56',
                        backgroundColor: '#ffce5680',
                        yAxisID: 'y_ppm',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `${this.#uiManager.getGalleryName()} 갤러리 지표 변화`,
                            color: chartTitleColor,
                            font: {
                                size: 18,
                                family: font
                            }
                        },
                        legend: {
                            labels: {
                                color: legendTxtColor,
                                font: {
                                    family: font,
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            titleColor: legendTxtColor,
                            bodyColor: legendTxtColor,
                            backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(250,250,250,0.9)',
                            borderColor: isDark ? 'rgba(200,200,200,0.2)' : 'rgba(100,100,100,0.2)',
                            borderWidth: 1,
                            padding: 10,
                            titleFont: {
                                family: font,
                                size: 13
                            },
                            bodyFont: {
                                family: font,
                                size: 12
                            },
                            callbacks: {
                                label: ctx => `${ctx.dataset.label ?? ''}: ${ctx.parsed.y !== null ? (ctx.dataset.yAxisID === 'y_ppm' ? ctx.parsed.y.toFixed(2) : `${(ctx.parsed.y * 100).toFixed(1)}%`) : ''}`
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: timestampText,
                                color: axisTitleColor,
                                font: {
                                    family: font,
                                    size: 13
                                }
                            },
                            ticks: {
                                color: tickColor,
                                font: {
                                    family: font,
                                    size: 12
                                }
                            },
                            grid: {
                                color: gridColor
                            }
                        },
                        y_ratio: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            min: 0,
                            max: 1,
                            title: {
                                display: true,
                                text: '비율 (%), 집중도',
                                color: axisTitleColor,
                                font: {
                                    family: font,
                                    size: 13
                                }
                            },
                            ticks: {
                                color: tickColor,
                                callback: val => `${(val * 100).toFixed(0)}%`,
                                font: {
                                    family: font,
                                    size: 12
                                }
                            },
                            grid: {
                                color: gridColor
                            }
                        },
                        y_ppm: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            min: 0,
                            title: {
                                display: true,
                                text: '글/분 (PPM)',
                                color: axisTitleColor,
                                font: {
                                    family: font,
                                    size: 13
                                }
                            },
                            ticks: {
                                color: tickColor,
                                font: {
                                    family: font,
                                    size: 12
                                }
                            },
                            grid: {
                                drawOnChartArea: false,
                                color: gridColor
                            }
                        }
                    }
                }
            });
        }

        showUserPosts(targetUserInfo, posts, startPage, endPage, isLoading = false) {
            this.#eventHandlers.log('ModalManager', `유저 작성글 팝업 표시. 유저: ${targetUserInfo?.titleDisplay || '정보 없음'}, 글 개수: ${posts.length}, 로딩 중: ${isLoading}`);
            const modal = this.#getOrCreateUserPostsModal();
            const titleSpan = modal.querySelector('.modal-title > span');
            const contentDiv = modal.querySelector('.modal-content');

            const titleDisplay = targetUserInfo?.titleDisplay || '알 수 없는 유저';
            titleSpan.textContent = `${titleDisplay}의 작성글 (${startPage} ~ ${endPage}페이지)`;

            let footer = modal.querySelector('.modal-footer');
            if (!footer) {
                footer = document.createElement('div');
                footer.className = 'modal-footer';
                modal.appendChild(footer);
            }

            if (isLoading) {
                contentDiv.innerHTML = `<p>게시물을 불러오는 중... (0%)</p><small>페이지 양에 따라 시간이 소요될 수 있습니다.</small>`;
                footer.style.display = 'none';
            } else {
                if (posts.length === 0) {
                    contentDiv.innerHTML = '<p>해당 범위에서 유저가 작성한 글을 찾지 못했습니다.</p>';
                    footer.style.display = 'none';
                } else {
                    const galleryId = new URLSearchParams(window.location.search).get('id');
                    const basePath = window.location.pathname.replace(/\/lists\/?/, '/view/');
                    let listHtml = `<p>총 ${posts.length}개의 글을 찾았습니다. (최대 ${this.#config.CONSTANTS.MAX_USER_POSTS_TO_DISPLAY}개 표시)</p><ul class="user-posts-list">`;

                    for (const post of posts) {
                        const postDate = post.timestamp ? ((d, p) => `${d.getFullYear().toString().slice(-2)}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`)(new Date(post.timestamp), n => String(n).padStart(2, '0')) : '날짜 없음';
                        const postViewUrl = (galleryId && post.post_no) ? `${basePath}?id=${galleryId}&no=${post.post_no}` : '#';
                        const escapedTitle = this.#eventHandlers.escapeHtml(post.title || '제목 없음');
                        listHtml += `<li style="margin-bottom: 5px;"><a href="${postViewUrl}" target="_blank" rel="noopener noreferrer">${escapedTitle}</a><small style="opacity: 0.7;">(글번호: ${post.post_no}, ${postDate}, 조회: ${post.views}, 추천: ${post.reco})</small></li>`;
                    }
                    contentDiv.innerHTML = listHtml + '</ul>';

                    footer.style.display = 'flex';
                    footer.innerHTML = `<button id="${this.#config.UI.ANALYZE_USER_BUTTON_ID}" class="ai-summary-btn">AI 유저 분석</button>`;
                    document.getElementById(this.#config.UI.ANALYZE_USER_BUTTON_ID)?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const postTitles = posts.map(p => p.title).filter(Boolean);
                        if (postTitles.length > 0) {
                            this.#eventHandlers.onAnalyzeUserRequest(targetUserInfo, postTitles);
                        } else {
                            alert('분석할 게시글 제목이 없습니다.');
                        }
                    });
                }
            }
            modal.style.display = 'block';
            this.#uiManager.updateTheme();
        }

        showAIUserAnalysis(targetUserInfo, content, isLoading = false) {
            let headerTitle = 'AI 유저 분석 결과';
            if (targetUserInfo) {
                if (targetUserInfo.isDirectSearch) {
                    headerTitle = `${targetUserInfo.displayName} 분석 결과`;
                } else {
                    const idPart = targetUserInfo.filterKey ? targetUserInfo.filterKey.split(':').pop() : '';
                    const displayName = targetUserInfo.displayName || idPart;
                    headerTitle = (displayName && idPart && displayName.toLowerCase() !== idPart.toLowerCase()) ?
                        `${displayName}(${idPart}) 분석 결과` :
                    `${displayName} 분석 결과`;
                }
            }

            const modal = this.#getOrCreateAIUserAnalysisModal(headerTitle);
            const contentDiv = modal.querySelector('.modal-content');

            if (isLoading) {
                contentDiv.innerHTML = `<p style="text-align: left;">AI가 유저를 분석하고 있습니다...<br>잠시만 기다려주세요.</p>`;
            } else {
                const analysisListItems = content.split('\n').filter(line => line.trim() !== '')
                .map(line => `<li>${this.#eventHandlers.escapeHtml(line.replace(/^\d+\.\s*/, ''))}</li>`).join('');

                const resultContainer = `<ol class="ai-analysis-list">${analysisListItems}</ol><small class="modal-credits-inline">※ AI의 팩폭입니다. 과몰입 금지. 긁?</small>`;
                const footerHTML = `
                    <hr>
                    <div class="modal-footer-inline">
                        <button id="gallscopeCopyAIResultBtn" class="gallscope-copy-btn">결과 복사</button>
                        <div class="modal-credits-inline">
                            <small>Powered by Google Gemini (${this.#state.selectedGeminiModel})</small>
                            <small>${this.#eventHandlers.getFormattedTimestamp()} by 갤스코프</small>
                        </div>
                    </div>`;

                contentDiv.innerHTML = resultContainer + footerHTML;

                const copyBtn = document.getElementById('gallscopeCopyAIResultBtn');
                if (copyBtn) {
                    copyBtn.onclick = () => {
                        const modalHeaderTitle = modal.querySelector('.modal-header .modal-title > span')?.textContent || '유저 분석 결과';
                        const targetUserDisplay = modalHeaderTitle.replace(' 분석 결과', '').trim();

                        const disclaimer = '※ AI의 팩폭입니다. 과몰입 금지. 긁?';
                        const credits = `${this.#eventHandlers.getFormattedTimestamp()} Powered by 갤스코프`;

                        const formattedContent = content.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => `• ${line.replace(/^\d+\.\s*/, '')}`)
                        .join('\n');

                        const textToCopy = [
                            `${targetUserDisplay} 분석결과`,
                            '----------------',
                            formattedContent,
                            '----------------',
                            disclaimer,
                            credits
                        ].join('\n');

                        navigator.clipboard.writeText(textToCopy).then(() => {
                            copyBtn.textContent = '복사 완료!';
                            setTimeout(() => {
                                copyBtn.textContent = '결과 복사';
                            }, 2000);
                        }).catch(err => {
                            console.error('Copy failed:', err);
                            copyBtn.textContent = '복사 실패';
                        });
                    };
                }
            }
            modal.style.display = 'block';
            this.#uiManager.updateTheme();
        }

        hideAIUserAnalysis() {
            if (this.#aiUserAnalysisModal) {
                this.#aiUserAnalysisModal.style.display = 'none';
            }
        }

        showScopeInput() {
            this.#eventHandlers.log('ModalManager', '스코프 확장 입력 모달 표시 요청.');
            const modal = this.#getOrCreateScopeInputModal();

            let modalTitleText = '스코프 확장',
                graphCheckboxDisplay = '',
                isFocusMode = false;
            let targetUserText = '';

            if (this.#state.isUserSpecificScopeMode && this.#state.currentUserScopeTarget) {
                isFocusMode = true;
                modalTitleText = '집중 스코프';
                graphCheckboxDisplay = 'none';
                const {
                    displayName,
                    filterKey,
                    isDirectSearch
                } = this.#state.currentUserScopeTarget;
                if (isDirectSearch) {
                    targetUserText = `${displayName}`;
                } else {
                    const cleanedFilterKey = filterKey.replace(/^(id:|ip:|uid:)/, "");
                    targetUserText = `${displayName || filterKey}(${cleanedFilterKey})`;
                }
            }

            modal.classList.toggle('gallscope-focus-mode', isFocusMode);
            modal.querySelector('.modal-header .modal-title > span').textContent = modalTitleText;
            modal.querySelector('.modal-content').innerHTML = this.#uiManager.renderScopeInputModalContent(targetUserText, graphCheckboxDisplay);

            modal.style.display = 'block';
            this.#uiManager.updateTheme();

            const startInput = document.getElementById('scopeStartPageInput');
            const endInput = document.getElementById('scopeEndPageInput');
            const graphCheckbox = document.getElementById('scopeGraphCheckbox');
            const limit = this.#config.CONSTANTS.MAX_SCOPE_PAGES_LIMIT;

            const onConfirm = () => {
                const start = parseInt(startInput.value, 10);
                const end = parseInt(endInput.value, 10);

                if (isNaN(start) || isNaN(end) || start < 1 || end < 1) return alert("페이지 번호는 1 이상의 숫자만 입력해야 합니다.");
                if (start > end) return alert("시작 페이지 번호는 종료 페이지 번호보다 클 수 없습니다.");

                const count = end - start + 1;
                if (count > limit) return alert(`한 번에 최대 ${limit}페이지까지만 분석할 수 있습니다.\n요청하신 페이지 수: ${count}개`);

                this.hideScopeInput();

                if (this.#state.isUserSpecificScopeMode && this.#state.currentUserScopeTarget) {
                    this.#eventHandlers.onFetchUserPostsInScope(this.#state.currentUserScopeTarget, start, end);
                } else {
                    const genGraph = (graphCheckbox && graphCheckboxDisplay !== 'none') ? graphCheckbox.checked : false;
                    this.#eventHandlers.onFetchAndAnalyzeMultiplePages(start, end, genGraph);
                }
                this.#uiManager.resetScopeMode();
            };

            const onCancel = () => {
                this.hideScopeInput();
                this.#uiManager.resetScopeMode();
            };

            document.getElementById('scopeConfirmBtn').onclick = onConfirm;
            document.getElementById('scopeCancelBtn').onclick = onCancel;
            modal.querySelector('.close-btn').onclick = onCancel;
        }
    }

    /**
     * @class UIManager
     * @description Handles all DOM manipulations, UI rendering, and user interactions.
     */
    class UIManager {
        #config;
        #state;
        #eventHandlers;
        #log;
        #tooltipManager;

        constructor(config, state, eventHandlers, log, tooltipManager) {
            this.#config = config;
            this.#state = state;
            this.#state.lastRenderedStats = {};
            this.#eventHandlers = eventHandlers;
            this.#log = log || (() => {});
            this.#tooltipManager = tooltipManager;
        }

        getPostRows() {
            const allRows = [...document.querySelectorAll(this.#config.SELECTORS.POST_ROW)];
            const filteredRows = allRows.filter(tr => !this.isNoticeRow(tr));
            this.#log(`게시물 행 탐색: 총 ${allRows.length}개 발견, 공지 제외 후 ${filteredRows.length}개.`);
            return filteredRows;
        }

        isNoticeRow(tr) {
            const noticeNumEl = tr.querySelector(this.#config.SELECTORS.POST_NOTICE_NUM);
            if (noticeNumEl?.textContent === '공지') return true;
            const subjectText = tr.querySelector(this.#config.SELECTORS.POST_SUBJECT)?.textContent;
            return subjectText?.includes('공지') || subjectText?.includes('고정');
        }

        getGalleryName() {
            return document.getElementById('gallery_name')?.value ?? 'Unknown';
        }

        isDarkMode() {
            return !!document.getElementById('css-darkmode');
        }

        updateTheme() {
            const isDark = this.isDarkMode();
            document.body.classList.toggle('gallscope-dark-theme', isDark);
            document.body.classList.toggle('gallscope-light-theme', !isDark);
            if (this.#state.analysisBoxElement && Object.keys(this.#state.lastCalculatedStats).length > 0) {
                this.renderAnalysisBox(this.#state.lastCalculatedStats);
            }
        }

        injectStyles() {
            if (document.getElementById('gallscope-styles')) return;
            const css = `
            @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css'); .gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID}{color:#333;background-color:#fff;border:1px solid #ddd;box-shadow:0 3px 12px rgba(0,0,0,.15)}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .header{color:#000}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .arrow{opacity:.7;color:#555}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .sub .icon{opacity:.8}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .details .detail-line{opacity:.85;color:#444}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .sub.sub-speed .speed-value{color:#a5a5a5;font-weight:700}.gallscope-light-theme #${this.#config.UI.TOOLTIP_ID}{background-color:#f9f9f9;color:#222;border:1px solid #bbb;box-shadow:0 2px 8px rgba(0,0,0,.2)}.gallscope-light-theme #${this.#config.UI.TOOLTIP_ID} h4{color:#000;border-bottom:1px solid #ccc}.gallscope-light-theme #${this.#config.UI.TOOLTIP_ID} strong{color:#000}.gallscope-light-theme #${this.#config.UI.TOOLTIP_ID} hr{border-top:1px solid #ccc}.gallscope-light-theme #${this.#config.UI.TOOLTIP_ID} small{opacity:.8}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .fixed-text-header>span:first-child,.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .gpi-text-header>span:first-child>span:first-child,.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-sentiment-text-header>span:first-child>span:first-child{color:#333}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn{background-color:#f8f9fa;color:#212529;border:1px solid #dee2e6;box-shadow:0 1px 2px rgba(0,0,0,.05)}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn:hover{background-color:#e9ecef;border-color:#ced4da;box-shadow:0 1px 3px rgba(0,0,0,.07)}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn{background-color:#f1f3f5;color:#495057;border:1px solid #dee2e6}.gallscope-light-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn:hover{background-color:#e9ecef}.gallscope-light-theme #gallscopeCopyBtn{border:1px solid #ccc;background-color:transparent;color:#555}.gallscope-light-theme #gallscopeCopyBtn:hover{background-color:#f1f3f5;border-color:#bbb}.gallscope-light-theme .sentiment-bar-container{border-color:#e0e0e0}.gallscope-light-theme .sentiment-bar-segment.positive{background-color:#28a745}.gallscope-light-theme .sentiment-bar-segment.neutral{background-color:#6c757d}.gallscope-light-theme .sentiment-bar-segment.negative{background-color:#dc3545}.gallscope-light-theme .gallscope-modal-base{background-color:#fff;color:#333;border:1px solid #ccc}.gallscope-light-theme .gallscope-modal-base .modal-header{border-bottom:1px solid #ddd}.gallscope-light-theme .gallscope-modal-base .close-btn{color:#aaa}.gallscope-light-theme .gallscope-modal-base .close-btn:hover{color:#000}.gallscope-light-theme .gallscope-modal-base .modal-content hr{border-top:1px solid #ccc}.gallscope-light-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-page-input{border-color:#ccc}.gallscope-light-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-confirm-btn{background-color:#007bff;color:#fff}.gallscope-light-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-cancel-btn{background-color:#f1f3f5;color:#333;border:1px solid #ddd}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID}{color:#e8e8e8;background-color:#2c2d30;border:1px solid #4a4b4f;box-shadow:0 3px 12px rgba(0,0,0,.4)}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .header{color:#fff}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .arrow{opacity:.8;color:#b0b0b0}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .sub .icon{opacity:.85}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .details .detail-line{opacity:.9;color:#e0e0e0}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .sub.sub-speed .speed-value{color:#a5a5a5;font-weight:700}.gallscope-dark-theme #${this.#config.UI.TOOLTIP_ID}{background-color:#222325;color:#d0d0d0;border:1px solid #3a3b3f;box-shadow:0 2px 8px rgba(0,0,0,.45)}.gallscope-dark-theme #${this.#config.UI.TOOLTIP_ID} h4{color:#fff;border-bottom:1px solid #444549}.gallscope-dark-theme #${this.#config.UI.TOOLTIP_ID} strong{color:#f0f0f0}.gallscope-dark-theme #${this.#config.UI.TOOLTIP_ID} hr{border-top:1px solid #444549}.gallscope-dark-theme #${this.#config.UI.TOOLTIP_ID} small{opacity:.85}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn{background-color:#343a40;color:#f8f9fa;border:1px solid #495057;box-shadow:0 1px 2px rgba(0,0,0,.15)}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn:hover{background-color:#495057;border-color:#5a6268;box-shadow:0 1px 3px rgba(0,0,0,.2)}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn-container{border-top:1px solid #444549}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn{background-color:#3a3b3f;color:#e8e8e8;border:1px solid #4a4b4f}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn:hover{background-color:#4a4b4f}.gallscope-dark-theme #gallscopeCopyBtn{border:1px solid #555;background-color:transparent;color:#ccc}.gallscope-dark-theme #gallscopeCopyBtn:hover{background-color:#3a3b3f;border-color:#666;color:#fff}.gallscope-dark-theme .sentiment-bar-container{border-color:#555}.gallscope-dark-theme .sentiment-bar-segment.positive{background-color:#59a224}.gallscope-dark-theme .sentiment-bar-segment.neutral{background-color:#666}.gallscope-dark-theme .sentiment-bar-segment.negative{background-color:#fd5d5d}.gallscope-dark-theme .gallscope-modal-base{background-color:#2c2d30;color:#e8e8e8;border:1px solid #4a4b4f}.gallscope-dark-theme .gallscope-modal-base .modal-header{border-bottom:1px solid #444549}.gallscope-dark-theme .gallscope-modal-base .close-btn{color:#bbb}.gallscope-dark-theme .gallscope-modal-base .close-btn:hover{color:#fff}.gallscope-dark-theme .gallscope-modal-base .modal-content hr{border-top:1px solid #444549}.gallscope-dark-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-page-input{border-color:#555}.gallscope-dark-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-confirm-btn{background-color:#0d6efd;color:#fff}.gallscope-dark-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-cancel-btn{background-color:#495057;color:#f1f3f5;border:1px solid #5a6268} #${this.#config.UI.SCOPE_BOX_ID}{position:fixed;z-index:20000;padding:14px 18px;border-radius:7px;font-family:"Pretendard",sans-serif;cursor:default;user-select:none;opacity:.97;transition:max-height .35s ease-in-out;white-space:nowrap;line-height:1.55;font-size:13.5px;will-change:top,left;}#${this.#config.UI.SCOPE_BOX_ID} .header{display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:16px;margin-left:-2px;cursor:move}#${this.#config.UI.SCOPE_BOX_ID} .header-main{display:flex;align-items:center}#${this.#config.UI.SCOPE_BOX_ID} .arrow{width:1.2em;text-align:center;margin-left:12px;font-size:.9em;transition:transform .25s ease-in-out;cursor:pointer;will-change:top,left;}#${this.#config.UI.SCOPE_BOX_ID} .header-icon{margin-right:9px;font-size:1.05em}#${this.#config.UI.SCOPE_BOX_ID} .details{font-size:14px;padding-left:0;max-height:0;opacity:0;overflow:hidden;transition:max-height .35s cubic-bezier(.4,0,.2,1),opacity .3s ease-in-out,margin-top .35s cubic-bezier(.4,0,.2,1)}#${this.#config.UI.SCOPE_BOX_ID}.expanded .details{opacity:1}#${this.#config.UI.SCOPE_BOX_ID} .speed-text-header{display:block}#${this.#config.UI.SCOPE_BOX_ID} .sub{font-weight:700;font-size:1.02em;display:flex;align-items:center;margin-bottom:5px;padding-left:6px}#${this.#config.UI.SCOPE_BOX_ID} .details .detail-line{margin-bottom:5px;padding-left:13px;font-size:.95em}#${this.#config.UI.SCOPE_BOX_ID} .details div:last-child{margin-bottom:0}#${this.#config.UI.SCOPE_BOX_ID} .sub.sub-speed{display:block;text-align:right;margin-bottom:0}.status-tag{font-weight:700;padding:0 1px} #${this.#config.UI.TOOLTIP_ID}{position:absolute;z-index:21000;border-radius:6px;padding:10px 14px;font-size:13px;line-height:1.5;max-width:315px;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .15s ease-out,visibility 0s linear .15s}#${this.#config.UI.TOOLTIP_ID}.visible{opacity:.98;visibility:visible;transition:opacity .15s ease-out}#${this.#config.UI.TOOLTIP_ID} h4{font-size:14.5px;font-weight:600;margin:0 0 7px;padding-bottom:5px;overflow-wrap:break-word}#${this.#config.UI.TOOLTIP_ID} p{margin:0 0 5px;overflow-wrap:break-word;word-break:keep-all}#${this.#config.UI.TOOLTIP_ID} strong{font-weight:600}#${this.#config.UI.TOOLTIP_ID} hr{border:none;margin:7px 0}#${this.#config.UI.TOOLTIP_ID} small{font-size:.92em;display:block;line-height:1.4;overflow-wrap:break-word;word-break:keep-all} #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn-container{margin-top:12px;padding-top:12px;border-top:1px solid #eee;padding-left:0;padding-bottom:1px}.gallscope-dark-theme #${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn-container{border-top-color:#444549}#${this.#config.UI.SCOPE_BOX_ID} .expand-scope-btn-container{padding-left:0;padding-bottom:1px}#${this.#config.UI.SCOPE_BOX_ID} .ai-summary-btn{display:block;width:100%;padding:8px 0;font-family:"Pretendard",sans-serif;font-size:13.5px;font-weight:500;border-radius:5px;cursor:pointer;text-align:center;transition:all .2s ease-in-out}#${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn{padding:2px 6px;font-size:12px;border-radius:4px;cursor:pointer;font-family:"Pretendard",sans-serif;font-weight:500;transition:background-color .2s ease-in-out}#${this.#config.UI.SCOPE_BOX_ID} .ai-analysis-btn:disabled{cursor:not-allowed;opacity:.6} .gallscope-modal-base{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:190000;width:90%;border-radius:8px;box-shadow:0 5px 20px rgba(0,0,0,.3);padding:0;display:none;font-family:"Pretendard",sans-serif}.gallscope-modal-base .modal-header{padding:12px 18px;font-size:18px;font-weight:700;display:flex;justify-content:space-between;align-items:center}.gallscope-modal-base .modal-header .modal-title{display:flex;align-items:center;font-weight:600}.gallscope-modal-base .modal-icon{width:36px;height:36px;margin-right:8px;border-radius:6px;opacity:.95}.gallscope-modal-base .modal-content{padding:15px 18px;max-height:80vh;overflow-y:auto;display:flex;flex-direction:column;font-size:14px;line-height:1.6;word-break:keep-all}.gallscope-modal-base .modal-content .main-link{color:#00aaff;text-decoration:none;font-weight:700}.gallscope-modal-base .modal-content .main-link:hover{color:#0088ff}.gallscope-modal-base .modal-content hr{width:100%;border:none;margin:7px 0}.gallscope-modal-base .modal-content .api-key-guidance{white-space:normal;line-height:1.3}.gallscope-modal-base .modal-content .api-key-guidance p{line-height:1.3;margin-bottom:5px}.gallscope-modal-base .modal-content .api-key-guidance hr{margin:8px 0}.gallscope-modal-base .modal-content .api-key-guidance h4{font-size:1em;font-weight:600;line-height:1.3;margin:10px 0 3px}.gallscope-modal-base .modal-content .api-key-guidance ol{padding-left:18px;margin:3px 0 8px;line-height:1.25}.gallscope-modal-base .modal-content .api-key-guidance ol li{margin-bottom:2px}.gallscope-modal-base .close-btn{background:none;border:none;font-size:24px;font-weight:700;cursor:pointer;padding:0 5px} .modal-footer-inline{display:flex;justify-content:space-between;align-items:center}.modal-credits-inline{display:flex;flex-direction:column;align-items:flex-end;opacity:.7}.modal-credits-inline small{text-align:right}#gallscopeCopyBtn{padding:5px 12px;font-size:13px;border-radius:5px;cursor:pointer;font-family:"Pretendard",sans-serif;font-weight:500;transition:all .2s ease-in-out} #${this.#config.UI.AI_MODAL_ID}{max-width:600px}#${this.#config.UI.SCOPE_INPUT_MODAL_ID}{max-width:420px;z-index:22001}#${this.#config.UI.GRAPH_MODAL_ID}{max-width:950px!important;z-index:19000}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-content{padding:20px 25px;font-size:14px;line-height:1.6}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-content{display:flex;flex-direction:column;text-align:center}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-content p{font-size:.95em;opacity:.9;margin-top:0}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-input-group{display:flex;justify-content:center;align-items:center;margin:30px 0}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-page-input{width:80px;padding:8px 10px;text-align:center;border:1px solid;border-radius:5px;font-size:1.1em;background-color:transparent;color:inherit;-moz-appearance:textfield}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-page-input::-webkit-outer-spin-button,#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-page-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-input-separator{margin:0 10px;font-size:1.2em;opacity:.8}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-footer{display:flex;justify-content:space-between;align-items:center}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-options{display:flex;text-align:left;gap:5px}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-buttons{display:flex;justify-content:flex-end;gap:10px}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-confirm-btn,#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-cancel-btn{padding:8px 16px;border:none;border-radius:5px;cursor:pointer;font-weight:500;transition:background-color .2s ease}.gallscope-light-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-confirm-btn:hover{background-color:#0056b3}.gallscope-light-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-cancel-btn:hover{background-color:#e9ecef}.gallscope-dark-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-confirm-btn:hover{background-color:#0b5ed7}.gallscope-dark-theme #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .modal-cancel-btn:hover{background-color:#5a6268} #gallscopeProgressContainer{margin-top:8px;padding:2px 0}.gallscope-progress-wrapper{position:relative;height:20px;background-color:#e9ecef;border-radius:5px;overflow:hidden}.gallscope-progress-bar{width:0;height:100%;background-color:#007bff;transition:width .3s ease-in-out}.gallscope-progress-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:12px;font-weight:600;text-shadow:1px 1px 2px rgba(0,0,0,.5)}#gallscopeProgressMessage{display:none;text-align:center;font-weight:500}.gallscope-light-theme #gallscopeProgressMessage{color:#212529}.gallscope-dark-theme #gallscopeProgressMessage{color:#f8f9fa}.gallscope-dark-theme .gallscope-progress-wrapper{background-color:#495057}.gallscope-dark-theme .gallscope-progress-bar{background-color:#0d6efd}.gallscope-dark-theme .gallscope-progress-text{color:#f8f9fa} #${this.#config.UI.SCOPE_BOX_ID} .ai-sentiment-detail{display:flex;flex-direction:row;align-items:center;padding-left:0}.sentiment-bar-container{display:flex;width:100%;height:18px;border-radius:4px;overflow:hidden;margin-bottom:0;border:1px solid transparent}.sentiment-bar-segment{height:100%;transition:width .3s ease-in-out;display:flex;align-items:center;justify-content:center;color:white;font-size:.9em;font-weight:500;overflow:hidden;white-space:nowrap;text-shadow:1px 1px 1px rgba(0,0,0,.4)} #${this.#config.UI.USER_POSTS_MODAL_ID}{max-width:500px}#${this.#config.UI.USER_POSTS_MODAL_ID} .modal-content p{margin-bottom:10px}#${this.#config.UI.USER_POSTS_MODAL_ID} ul{counter-reset:list-number;list-style:none;padding-left:0}#${this.#config.UI.USER_POSTS_MODAL_ID} ul>li{display:flex;flex-direction:column;counter-increment:list-number;position:relative;padding-left:2em;margin-bottom:5px}#${this.#config.UI.USER_POSTS_MODAL_ID} ul>li::before{content:counter(list-number) ".";position:absolute;left:0;top:0;width:1.5em;text-align:right;font-weight:600}.gallscope-light-theme #${this.#config.UI.USER_POSTS_MODAL_ID} ul>li::before{color:#444}.gallscope-dark-theme #${this.#config.UI.USER_POSTS_MODAL_ID} ul>li::before{color:#ccc}#${this.#config.UI.USER_POSTS_MODAL_ID} ul>li a{color:#00aaff;text-decoration:none}#${this.#config.UI.USER_POSTS_MODAL_ID} ul>li a:hover{color:#0088ff} #${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-footer{display:flex;justify-content:space-between;align-items:center}.gallscope-dark-theme .gallscope-scope-extension-li{background-color:#3b4890}.gallscope-light-theme .gallscope-scope-extension-li{background-color:#3b4890}#${this.#config.UI.SCOPE_INPUT_MODAL_ID}.gallscope-focus-mode .scope-modal-footer{justify-content:space-between}#${this.#config.UI.SCOPE_INPUT_MODAL_ID} .scope-modal-buttons{display:flex;gap:10px} #gallscopeUserSearchContainer{display:inline-flex;margin-top:5px;vertical-align:middle}#gallscopeUserInput{height:27px;border-radius:4px;padding:0 8px;font-size:12px;font-family:"Pretendard",sans-serif;width:150px;transition:border-color .2s}#gallscopeUserSearchBtn{height:27px;border-radius:4px;border:none;padding:0 10px;margin-left:4px;cursor:pointer;font-weight:600;font-size:14px;transition:background-color .2s}#gallscopeUserInput:focus{outline:none}.gallscope-light-theme #gallscopeUserInput{border:1px solid #ccc;background-color:#fff;color:#333}.gallscope-light-theme #gallscopeUserInput:focus{border-color:#007bff}.gallscope-light-theme #gallscopeUserSearchBtn{background-color:#f1f3f5;color:#495057}.gallscope-light-theme #gallscopeUserSearchBtn:hover{background-color:#e9ecef}.gallscope-dark-theme #gallscopeUserInput{border:1px solid #555;background-color:#2c2d30;color:#e8e8e8}.gallscope-dark-theme #gallscopeUserInput:focus{border-color:#0d6efd}.gallscope-dark-theme #gallscopeUserSearchBtn{background-color:#3a3b3f;color:#e8e8e8}.gallscope-dark-theme #gallscopeUserSearchBtn:hover{background-color:#4a4b4f} #gallscopeUserSearchContainer{vertical-align:top!important}#gallscopeUserSearchDesc{font-size:11px;opacity:.7;margin-bottom:2px;padding-left:2px}#gallscopeUserInput{height:25px;width:110px;padding:0 7px;font-size:12px}#gallscopeUserSearchBtn.modal-confirm-btn{height:25px;padding:0 10px;margin-left:4px;font-size:12px;border-radius:4px;border:none;cursor:pointer;font-weight:600;transition:background-color .2s}.gallscope-light-theme #gallscopeUserSearchBtn.modal-confirm-btn{background-color:#007bff;color:#fff}.gallscope-light-theme #gallscopeUserSearchBtn.modal-confirm-btn:hover{background-color:#0056b3}.gallscope-dark-theme #gallscopeUserSearchBtn.modal-confirm-btn{background-color:#0d6efd;color:#fff}.gallscope-dark-theme #gallscopeUserSearchBtn.modal-confirm-btn:hover{background-color:#0b5ed7} .gallscope-modal-base .modal-footer{padding:12px 18px;display:flex;justify-content:flex-end;align-items:center}.gallscope-light-theme .gallscope-modal-base .modal-footer{border-top:1px solid #ddd}.gallscope-dark-theme .gallscope-modal-base .modal-footer{border-top:1px solid #444549}#${this.#config.UI.USER_POSTS_MODAL_ID} .modal-footer .ai-summary-btn{display:block;width:auto;padding:8px 20px;font-family:"Pretendard",sans-serif;font-size:13.5px;font-weight:500;border-radius:5px;cursor:pointer;text-align:center;transition:all .2s ease-in-out;border:1px solid transparent}.gallscope-light-theme #${this.#config.UI.USER_POSTS_MODAL_ID} .modal-footer .ai-summary-btn{background-color:#f8f9fa;color:#212529;border-color:#dee2e6}.gallscope-light-theme #${this.#config.UI.USER_POSTS_MODAL_ID} .modal-footer .ai-summary-btn:hover{background-color:#e9ecef;border-color:#ced4da}.gallscope-dark-theme #${this.#config.UI.USER_POSTS_MODAL_ID} .modal-footer .ai-summary-btn{background-color:#343a40;color:#f8f9fa;border-color:#495057}.gallscope-dark-theme #${this.#config.UI.USER_POSTS_MODAL_ID} .modal-footer .ai-summary-btn:hover{background-color:#495057;border-color:#5a6268}#${this.#config.UI.USER_POSTS_MODAL_ID} .user-posts-list{list-style-type:decimal;max-height:60vh;overflow-y:auto}#${this.#config.UI.AI_USER_ANALYSIS_MODAL_ID} .ai-analysis-list{list-style-type:decimal;padding-left:1.5em;margin:0;font-size:14px;line-height:1.6}#${this.#config.UI.AI_USER_ANALYSIS_MODAL_ID} .ai-analysis-list li:last-child{margin-bottom:0}.modal-footer-inline{display:flex;justify-content:space-between;align-items:center}.gallscope-copy-btn{padding:5px 12px;font-size:13px;border-radius:5px;cursor:pointer;font-family:"Pretendard",sans-serif;font-weight:500;transition:all .2s ease-in-out}.gallscope-light-theme .gallscope-copy-btn{border:1px solid #ccc;background-color:transparent;color:#555}.gallscope-light-theme .gallscope-copy-btn:hover{background-color:#f1f3f5;border-color:#bbb}.gallscope-dark-theme .gallscope-copy-btn{border:1px solid #555;background-color:transparent;color:#ccc}.gallscope-dark-theme .gallscope-copy-btn:hover{background-color:#3a3b3f;border-color:#666;color:#fff} #${this.#config.UI.TOGGLE_BUTTON_ID} { position: fixed; bottom: 25px; right: 25px; width: 42px; height: 42px; background-color: var(--userscope-bg-dark, #fff); background-image: url(${this.#config.ICON_URL}); background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 50%; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; z-index: 10000; transition: transform .2s ease, box-shadow .2s ease; overflow: hidden; } #${this.#config.UI.TOGGLE_BUTTON_ID}:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); } .gallscope-dark-theme #${this.#config.UI.TOGGLE_BUTTON_ID} { background-color: #2c2d30; border-color: #4a4b4f; }

            /* --- <<<< 새롭게 추가/변경된 하이라이트 스타일 시작 >>>> --- */

            .gallscope-light-theme {
                --gallscope-highlight-bg: #eaf2ff; /* 연한 푸른색 배경 */
                --gallscope-highlight-border: #c0d8ff; /* 살짝 진한 푸른색 테두리 */
            }
            .gallscope-dark-theme {
                --gallscope-highlight-bg: rgba(100, 160, 255, 0.35); /* 희미한 푸른빛 배경 */
                --gallscope-highlight-border: rgba(120, 180, 255, 0.3); /* 은은한 푸른색 테두리 */
            }

            .${this.#config.UI.NEW_USER_HIGHLIGHT_CLASS} .nickname {
                background-color: var(--gallscope-highlight-bg);
                border: 1px solid var(--gallscope-highlight-border);
                border-radius: 4px;
                padding: 1px 4px;
                margin: -2px -5px; /* 패딩/테두리로 인한 레이아웃 밀림 방지 */
                display: inline-block;
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }

            /* --- <<<< 새롭게 추가/변경된 하이라이트 스타일 종료 >>>> --- */
            `.replace(/\s+/g, ' ').trim();
            const styleEl = document.createElement('style');
            styleEl.id = 'gallscope-styles';
            styleEl.textContent = css;
            document.head.appendChild(styleEl);
        }

        getOrCreateAnalysisBox() {
            if (this.#state.analysisBoxElement) return this.#state.analysisBoxElement;
            const box = document.createElement('div');
            box.id = this.#config.UI.SCOPE_BOX_ID;

            const aiBtnHTML = this.#config.AI_SUMMARY_FEATURE_ENABLED ? `<div class="ai-summary-btn-container"><button id="${this.#config.UI.AI_SUMMARY_BUTTON_ID}" class="ai-summary-btn">AI 요약</button></div>` : '';
            const progressHTML = `<div id="gallscopeProgressContainer" style="display: none;"><div id="gallscopeProgressWrapper" class="gallscope-progress-wrapper"><div id="gallscopeProgressBar" class="gallscope-progress-bar"></div><span id="gallscopeProgressText" class="gallscope-progress-text">0%</span></div><div id="gallscopeProgressMessage"></div></div>`;
            const expandBtnHTML = `<div id="gallscopeExpandContainer" class="expand-scope-btn-container" style="margin-top: 8px;"><button id="gallscopeExpandScopeBtn" class="ai-summary-btn">스코프 확장</button></div>`;
            box.innerHTML = `<div class="header"><div class="header-main"><span class="header-icon"></span><span class="header-text"></span></div><span class="arrow">▼</span></div><div class="details"><div class="sub sub-speed"><small class="speed-text-header tooltip-trigger" id="gallscope-speed-info-trigger"></small></div><div class="sub sub-fixed"><span class="fixed-text-header"></span></div><div class="detail-line fixed-detail-fixed tooltip-trigger" id="gallscope-fixed-header-trigger"></div><div class="sub sub-gpi"><span class="gpi-text-header"></span></div><div class="detail-line gpi-detail tooltip-trigger" id="gallscope-gpi-detail-trigger"></div><div class="sub sub-ai-sentiment"><span class="ai-sentiment-text-header"></span></div><div class="detail-line ai-sentiment-detail"></div>${aiBtnHTML}${expandBtnHTML}${progressHTML}</div>`;

            document.body.appendChild(box);
            this.#state.analysisBoxElement = box;
            this.#state.boxElements = {
                headerIcon: box.querySelector('.header-icon'),
                headerText: box.querySelector('.header-text'),
                arrow: box.querySelector('.arrow'),
                details: box.querySelector('.details'),
                fixedTextHeader: box.querySelector('.fixed-text-header'),
                fixedDetailFixed: box.querySelector('.fixed-detail-fixed'),
                gpiTextHeader: box.querySelector('.gpi-text-header'),
                gpiDetail: box.querySelector('.gpi-detail'),
                speedTextHeader: box.querySelector('.speed-text-header'),
                aiSentimentTextHeader: box.querySelector('.ai-sentiment-text-header'),
                aiSentimentDetail: box.querySelector('.ai-sentiment-detail'),
            };

            if (this.#config.AI_SUMMARY_FEATURE_ENABLED) {
                document.getElementById(this.#config.UI.AI_SUMMARY_BUTTON_ID)?.addEventListener('click', e => {
                    e.stopPropagation();
                    this.#eventHandlers.onFetchAISummary();
                });
            }

            const expandScopeBtn = document.getElementById('gallscopeExpandScopeBtn');
            if (expandScopeBtn) {
                expandScopeBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    this.#eventHandlers.onShowScopeInput();
                });
                expandScopeBtn.onmouseenter = e => this.#tooltipManager.show(e, `<h4>스코프 확장 분석 ⓘ</h4><p>클릭하여 분석할 페이지 범위를 직접 지정하고,<br>더 넓은 범위의 고정닉 농도 및 GPI를 분석합니다.</p><hr><small>※ 분석 시 다소 시간이 소요될 수 있습니다.</small>`);
                expandScopeBtn.onmouseleave = () => this.#tooltipManager.hide();
            }

            this.updateTheme();
            box.addEventListener('click', (event) => {
                if (!this.#state.wasDragging && !event.target.closest('.tooltip-trigger, .ai-summary-btn, .ai-analysis-btn')) {
                    this.#toggleExpand();
                }
            });
            this.#setupDragAndDrop();
            return box;
        }

        #toggleExpand() {
            this.#state.isBoxExpanded = !this.#state.isBoxExpanded;
            const {
                analysisBoxElement: box,
                boxElements
            } = this.#state;
            if (!box || !boxElements) return;

            GM_setValue(this.#config.UI.GALLSCOPE_BOX_EXPANDED_ID, this.#state.isBoxExpanded);

            box.classList.toggle('expanded', this.#state.isBoxExpanded);
            boxElements.arrow.textContent = this.#state.isBoxExpanded ? '▲' : '▼';
            const detailsDiv = boxElements.details;
            detailsDiv.style.maxHeight = this.#state.isBoxExpanded ? `${detailsDiv.scrollHeight}px` : '0';
            setTimeout(() => this.repositionBox(), 50);
        }

        applyInitialExpandState() {
            const {
                analysisBoxElement: box,
                boxElements
            } = this.#state;
            if (!box || !boxElements || !this.#state.isBoxExpanded) return;

            box.classList.add('expanded');
            boxElements.arrow.textContent = '▲';
            const detailsDiv = boxElements.details;

            setTimeout(() => {
                if (this.#state.isBoxExpanded) {
                    detailsDiv.style.maxHeight = `${detailsDiv.scrollHeight}px`;
                }
            }, 0);
        }

        #setupDragAndDrop() {
            const box = this.#state.analysisBoxElement;
            if (!box) return;

            const header = box.querySelector('.header');

            makeDraggable(box, {
                handle: header,
                storageKey: this.#config.UI.GALLSCOPE_BOX_POSITION_ID,
                onDragStart: () => {
                    this.#state.wasDragging = true;
                },
                onDragEnd: () => {
                    this.#state.isBoxMovedByUser = true;
                    this.#state.userBoxPosition = { top: box.style.top, left: box.style.left };

                    setTimeout(() => {
                        this.#state.wasDragging = false;
                    }, 0);
                }
            });
        }

        renderToggleButton(clickHandler) {
            if (document.getElementById(this.#config.UI.TOGGLE_BUTTON_ID)) return;
            const button = document.createElement('div');
            button.id = this.#config.UI.TOGGLE_BUTTON_ID;
            button.title = '갤스코프 보이기/숨기기 (드래그하여 이동)';
            document.body.appendChild(button);

            applySavedPosition(button, this.#config.UI.GALLSCOPE_TOGGLE_BUTTON_POSITION_ID);

            makeDraggable(button, {
                storageKey: this.#config.UI.GALLSCOPE_TOGGLE_BUTTON_POSITION_ID,
                onClick: clickHandler
            });

            this.#log('UI', '드래그 가능한 토글 버튼 렌더링 완료.');
        }

        setBoxVisibility(visible) {
            if (this.#state.analysisBoxElement) {
                this.#state.analysisBoxElement.style.display = visible ? 'block' : 'none';
            }
        }

        renderAnalysisBox(stats) {
            this.#log('분석 박스 렌더링 요청. 전달된 통계:', stats);
            if (!this.#state.analysisBoxElement || !this.#state.boxElements || !stats || Object.keys(stats).length === 0) {
                this.#log('렌더링 조건 미충족으로 중단.');
                return;
            }

            const lastStats = this.#state.lastRenderedStats || {};

            this.#renderBoxHeaderIfChanged(stats, lastStats);
            this.#renderFixedNickSectionIfChanged(stats, lastStats);
            this.#renderGpiSectionIfChanged(stats, lastStats);
            this.#renderSpeedSectionIfChanged(stats, lastStats);
            this.#renderAiSectionIfChanged(stats, lastStats);

            this.#setupTooltips(stats);

            this.#state.lastRenderedStats = { ...stats
                                            };

            if (this.#state.isBoxExpanded) {
                const detailsDiv = this.#state.boxElements.details;
                if (detailsDiv.style.maxHeight !== '0px') {
                    detailsDiv.style.maxHeight = `${detailsDiv.scrollHeight}px`;
                }
            }
        }

        #renderBoxHeaderIfChanged(stats, lastStats) {
            if (stats.healthStage === lastStats.healthStage) return;

            this.#log('UI Update: Box Header');
            const healthStatus = this.#config.STATUS_LEVELS[stats.healthStage];
            this.#state.boxElements.headerIcon.textContent = `${healthStatus.icon} `;
            this.#state.boxElements.headerText.innerHTML = `<span id="gallscope-health-trigger" class="tooltip-trigger">갤러리 상태</span> <span class="status-tag" style="color:${healthStatus.textColor};">${healthStatus.tag}</span>`;
        }

        #renderFixedNickSectionIfChanged(stats, lastStats) {
            const {
                fixedTextHeader,
                fixedDetailFixed
            } = this.#state.boxElements;

            if (stats.fixedNickRatioStage !== lastStats.fixedNickRatioStage || stats.scopeLabel !== lastStats.scopeLabel) {
                this.#log('UI Update: Fixed Nick Header');
                const fixedNickStatus = this.#config.STATUS_LEVELS[stats.fixedNickRatioStage];
                const scopeLabel = stats.scopeLabel ? ` <span style="font-size:0.9em; opacity: 0.7;">(${stats.scopeLabel})</span>` : '';
                fixedTextHeader.innerHTML = `<span><span id="gallscope-fixed-nick-info-trigger" class="tooltip-trigger">고정닉 농도 -</span> </span><span class="status-tag" style="color:${fixedNickStatus.textColor};">${fixedNickStatus.tag}</span>${scopeLabel}`;
            }

            if (stats.fixedPostRatio !== lastStats.fixedPostRatio) {
                this.#log('UI Update: Fixed Nick Detail');
                fixedDetailFixed.textContent = `고정닉 ${(stats.fixedPostRatio * 100).toFixed(1)}% (${stats.fixedPostCount}개)`;
            }
        }

        #renderGpiSectionIfChanged(stats, lastStats) {
            const {
                gpiTextHeader,
                gpiDetail
            } = this.#state.boxElements;

            if (stats.gpiStage !== lastStats.gpiStage || stats.scopeLabel !== lastStats.scopeLabel) {
                this.#log('UI Update: GPI Header');
                const gpiStatus = this.#config.STATUS_LEVELS[stats.gpiStage];
                const scopeLabel = stats.scopeLabel ? ` <span style="font-size:0.9em; opacity: 0.7;">(${stats.scopeLabel})</span>` : '';
                gpiTextHeader.innerHTML = `<span><span id="gallscope-gpi-trigger" class="tooltip-trigger">갤 망령 지수 -</span> </span><span class="status-tag" style="color:${gpiStatus.textColor};">${gpiStatus.tag}</span>${scopeLabel}`;
            }

            const gpiDetailRelevantValuesChanged =
                  stats.gpi !== lastStats.gpi ||
                  stats.multiPostUserCount !== lastStats.multiPostUserCount ||
                  stats.totalPostCount !== lastStats.totalPostCount ||
                  stats.scopeLabel !== lastStats.scopeLabel;

            if (gpiDetailRelevantValuesChanged) {
                this.#log('UI Update: GPI Detail');
                const topNPostersForDetail = stats.topPosters?.slice(0, 5) ?? [];
                let gpiDetailText = "다중 작성자 정보 없음";

                if (stats.multiPostUserCount > 0) {
                    if (stats.scopeLabel && topNPostersForDetail.length > 0) {
                        const topNPostCount = topNPostersForDetail.reduce((s, p) => s + p.count, 0);
                        const topNPercentage = Math.floor((topNPostCount / stats.totalPostCount) * 100);
                        gpiDetailText = `상위 ${topNPostersForDetail.length}명이 전체의 ${topNPercentage}% 작성`;
                    } else {
                        const multiPostPercentage = Math.floor((stats.multiPostCount / stats.totalPostCount) * 100);
                        gpiDetailText = `페이지의 ${multiPostPercentage}%를 ${stats.multiPostUserCount}명이 작성`;
                    }
                }
                gpiDetail.textContent = gpiDetailText;
            }
        }

        #renderSpeedSectionIfChanged(stats, lastStats) {
            const currentPpm = stats.speed?.ppm;
            const lastPpm = lastStats.speed?.ppm;
            if (currentPpm === lastPpm) return;

            this.#log('UI Update: Speed Section');
            const speedHeaderEl = this.#state.boxElements.speedTextHeader;
            if (!speedHeaderEl) return;

            if (stats.speed?.ppm && !stats.speed.insufficientData) {
                speedHeaderEl.innerHTML = `<span id="gallscope-speed-info-trigger" class="tooltip-trigger speed-value">글 리젠 <span style="letter-spacing: -0.05em;">${stats.speed.ppm.toFixed(1)} 개/분</span></span>`;
            } else {
                speedHeaderEl.innerHTML = `<span id="gallscope-speed-info-trigger" class="tooltip-trigger">글 리젠 -</span> <span class="speed-value">측정불가</span>`;
            }
        }

        #renderAiSectionIfChanged(stats, lastStats) {
            if (stats.aiSentimentStage === lastStats.aiSentimentStage && this.#state.isAIFetching === (lastStats.isAIFetching ?? false)) {
                return;
            }
            this.#log('UI Update: AI Section');

            const aiStatus = stats.aiSentimentStage === -1 ?
                  {
                      tag: '미측정',
                      icon: '⚪',
                      textColor: this.isDarkMode() ? '#999' : '#666'
                  } :
            this.#config.STATUS_LEVELS[stats.aiSentimentStage];

            this.#state.boxElements.aiSentimentTextHeader.innerHTML = `<span><span id="gallscope-ai-info-trigger" class="tooltip-trigger">AI 측정 농도 -</span> </span><span class="status-tag" style="color:${aiStatus.textColor};">${aiStatus.tag}</span>`;
            const aiDetailEl = this.#state.boxElements.aiSentimentDetail;

            if (this.#state.isAIFetching) {
                aiDetailEl.innerHTML = '<div style="text-align:left; width:100%;">AI 분석 중...</div>';
            } else if (stats.aiSentimentStage !== -1) {
                this.#renderSentimentBar(aiDetailEl, stats);
            } else {
                this.#renderSentimentAnalysisButton(aiDetailEl);
            }
        }

        #renderSentimentBar(container, stats) {
            const {
                MIN_PERCENT_FOR_TEXT_IN_BAR
            } = this.#config.CONSTANTS;
            const p = parseFloat((stats.aiPositiveRatio * 100).toFixed(1));
            const nu = parseFloat((stats.aiNeutralRatio * 100).toFixed(1));
            const ng = parseFloat((stats.aiNegativeRatio * 100).toFixed(1));

            const pTxt = p >= MIN_PERCENT_FOR_TEXT_IN_BAR ? `${Math.round(p)}%` : '';
            const nuTxt = nu >= MIN_PERCENT_FOR_TEXT_IN_BAR ? `${Math.round(nu)}%` : '';
            const ngTxt = ng >= MIN_PERCENT_FOR_TEXT_IN_BAR ? `${Math.round(ng)}%` : '';

            container.innerHTML = `<div class="sentiment-bar-container tooltip-trigger" id="gallscope-ai-sentiment-trigger">
                <div class="sentiment-bar-segment positive" style="width: ${p}%;">${pTxt}</div>
                <div class="sentiment-bar-segment neutral" style="width: ${nu}%;">${nuTxt}</div>
                <div class="sentiment-bar-segment negative" style="width: ${ng}%;">${ngTxt}</div>
            </div>`;
        }

        #renderSentimentAnalysisButton(container) {
            container.innerHTML = `<button id="${this.#config.UI.AI_ANALYSIS_BUTTON_ID}" class="ai-analysis-btn">측정 시작</button>`;
            const btn = document.getElementById(this.#config.UI.AI_ANALYSIS_BUTTON_ID);
            if (btn) {
                btn.addEventListener('click', e => {
                    e.stopPropagation();
                    this.#eventHandlers.onFetchAISentiment();
                });
            }
        }

        repositionBox() {
            if (this.#state.isBoxMovedByUser) return;
            const {
                analysisBoxElement: box,
                tableAnchorElement: anchor
            } = this.#state;
            if (!box || !anchor) return;
            const rect = anchor.getBoundingClientRect();
            box.style.top = `${rect.top + window.scrollY - 37}px`;
            box.style.left = `${rect.left + window.scrollX - box.offsetWidth - 14}px`;
        }

        #setupTooltips(stats) {
            const provider = this.#eventHandlers.getTooltipContentProvider(stats);
            [{
                id: 'gallscope-health-trigger',
                getHtml: provider.getHealthTooltipHTML
            }, {
                id: 'gallscope-fixed-nick-info-trigger',
                getHtml: provider.getFixedNickInfoTooltipHTML
            }, {
                id: 'gallscope-gpi-trigger',
                getHtml: provider.getGpiTooltipHTML
            }, {
                id: 'gallscope-gpi-detail-trigger',
                getHtml: provider.getTopPostersTooltipHTML
            }, {
                id: 'gallscope-fixed-header-trigger',
                getHtml: provider.getFixedNickDetailTooltipHTML
            }, {
                id: 'gallscope-speed-info-trigger',
                getHtml: provider.getSpeedDetailTooltipHTML
            }, {
                id: 'gallscope-ai-info-trigger',
                getHtml: provider.getAiInfoTooltipHTML
            }, {
                id: 'gallscope-ai-sentiment-trigger',
                getHtml: provider.getAiSentimentTooltipHTML
            }].forEach(({
                id,
                getHtml
            }) => {
                const el = document.getElementById(id);
                if (el) {
                    el.onmouseenter = e => this.#tooltipManager.show(e, getHtml(stats));
                    el.onmouseleave = () => this.#tooltipManager.hide();
                }
            });
        }

        injectUserSearchUI(searchHandler) {
            if (document.getElementById('gallscopeUserSearchContainer')) return;
            const leftContainer = document.querySelector('.page_head .fl');
            if (!leftContainer) {
                this.#log('UI 삽입 실패: 기준 요소 .page_head .fl 을 찾을 수 없습니다.');
                return;
            }

            const container = document.createElement('div');
            container.id = 'gallscopeUserSearchContainer';
            container.style.cssText = 'display: inline-flex; flex-direction: column; margin-left: 10px; vertical-align: middle;';
            container.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <input type="text" id="gallscopeUserInput" placeholder="식별코드 또는 IP 검색">
                    <button id="gallscopeUserSearchBtn" class="modal-confirm-btn" title="해당 유저의 작성글 검색">검색</button>
                </div>`;
            leftContainer.appendChild(container);

            const inputEl = document.getElementById('gallscopeUserInput');
            const buttonEl = document.getElementById('gallscopeUserSearchBtn');

            buttonEl?.addEventListener('click', searchHandler);
            inputEl?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchHandler();
                }
            });
            this.#log('페이지 내 작성글 검색 UI 삽입 완료.');
        }

        resetScopeMode() {
            this.#state.isUserSpecificScopeMode = false;
            this.#state.currentUserScopeTarget = null;
            if (this.#state.scopeInputModalElement) {
                this.#state.scopeInputModalElement.classList.remove('gallscope-focus-mode');
            }
        }

        renderScopeInputModalContent(targetUserText, graphCheckboxDisplay) {
            return `
            <div class="scope-modal-content">
                <div style="font-weight:700; font-size:15px;">스코프 범위 설정</div><p>분석할 페이지 범위를 직접 입력해주세요.</p>
                <div class="scope-input-group">
                    <input type="number" id="scopeStartPageInput" value="1" min="1" class="scope-page-input">
                    <span class="scope-input-separator">-</span>
                    <input type="number" id="scopeEndPageInput" value="20" min="1" class="scope-page-input">
                </div>
                <div class="scope-modal-footer">
                    <div style="display: ${targetUserText ? 'block' : 'none'}; font-size:13px; text-align:left; flex-grow:1;">대상: ${targetUserText || ''}</div>
                    <div class="scope-modal-options" style="display: ${graphCheckboxDisplay};">
                        <input type="checkbox" id="scopeGraphCheckbox" style="vertical-align: middle;" checked>
                        <label for="scopeGraphCheckbox" style="vertical-align: middle; cursor: pointer; font-size: 13px;">통계 그래프 생성</label>
                    </div>
                    <div class="scope-modal-buttons">
                        <button id="scopeConfirmBtn" class="modal-confirm-btn">확인</button><button id="scopeCancelBtn" class="modal-cancel-btn">취소</button>
                    </div>
                </div>
            </div>`;
        }

        initMultiPageProgressUI() {
            document.getElementById('gallscopeExpandContainer')?.style.setProperty('display', 'none');
            document.getElementById('gallscopeProgressContainer')?.style.setProperty('display', 'block');
            this.updateMultiPageProgressUI(0);
        }

        updateMultiPageProgressUI(percent, message = '') {
            const progressBar = document.getElementById('gallscopeProgressBar');
            const progressText = document.getElementById('gallscopeProgressText');
            const progressMessageEl = document.getElementById('gallscopeProgressMessage');
            const progressWrapper = document.getElementById('gallscopeProgressWrapper');

            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressText) progressText.textContent = `${Math.round(percent)}%`;
            if (progressMessageEl) {
                progressMessageEl.textContent = message;
                progressMessageEl.style.display = message ? 'block' : 'none';
                if (progressWrapper) progressWrapper.style.display = message ? 'none' : 'block';
            }
        }

        async finalizeMultiPageProgressUI(message, duration) {
            if (message) {
                this.updateMultiPageProgressUI(100, message);
                await this.#eventHandlers.sleep(duration);
            }
            document.getElementById('gallscopeExpandContainer')?.style.setProperty('display', 'block');
            document.getElementById('gallscopeProgressContainer')?.style.setProperty('display', 'none');
            if (this.#state.isBoxExpanded && this.#state.boxElements?.details) {
                const detailsDiv = this.#state.boxElements.details;
                detailsDiv.style.maxHeight = `${detailsDiv.scrollHeight}px`;
            }
        }
    }

    /**
     * @class StatisticsCalculator
     * @description Handles pure data calculation for gallery statistics.
     */
    class StatisticsCalculator {
        #config;
        #utils;
        #log;

        constructor(config, utils, log) {
            this.#config = config;
            this.#utils = utils;
            this.#log = log || (() => {});
        }

        getWriterInfo(tr) {
            const writerTd = tr.querySelector(this.#config.SELECTORS.POST_WRITER);
            if (!writerTd) return {
                type: this.#config.CONSTANTS.USER_TYPES.UNKNOWN,
                key: 'unknown',
                name: 'Unknown'
            };

            const {
                USER_TYPES,
                USER_TYPE_ICON
            } = this.#config.CONSTANTS;
            const img = writerTd.querySelector('img');
            const file = img?.src.split('/').pop().split('?')[0].toLowerCase();
            let type = file ? (file === USER_TYPE_ICON.SEMI_FIXED ? USER_TYPES.SEMI : USER_TYPES.FIXED) : USER_TYPES.GUEST;

            const ip = writerTd.dataset.ip?.trim();
            const uid = writerTd.dataset.uid?.trim();
            const nickname = (writerTd.querySelector('.nickname em') ?? writerTd.querySelector('.nickname'))?.textContent.trim();

            let key = uid ? `id:${uid}` : (ip ? `ip:${ip}` : `misc:${tr.dataset.no ?? Math.random()}`);
            let displayName = '유동';

            if (type === USER_TYPES.FIXED || type === USER_TYPES.SEMI) {
                displayName = nickname ?? '고정닉/반고닉';
                if (uid) displayName += ` (${uid})`;
                else if (ip && type === USER_TYPES.SEMI) displayName += ` (${ip})`;
            } else if (type === USER_TYPES.GUEST) {
                displayName = (nickname && nickname !== ip) ? `${nickname} (${ip ?? 'IP 없음'})` : (ip ?? nickname ?? '유동');
            } else {
                displayName = key;
            }
            return {
                type,
                key,
                name: displayName
            };
        }

        getPostData(tr) {
            const titleEl = tr.querySelector(this.#config.SELECTORS.POST_TITLE);
            if (!titleEl) return null;

            const clonedTitleEl = titleEl.cloneNode(true);
            clonedTitleEl.querySelector(this.#config.SELECTORS.POST_REPLY_NUM)?.remove();
            clonedTitleEl.querySelector(this.#config.SELECTORS.POST_ICON_IMG)?.remove();

            return {
                post_no: tr.dataset.no,
                title: clonedTitleEl.textContent.trim() || '제목 없음',
                views: tr.querySelector(this.#config.SELECTORS.POST_VIEWS)?.textContent.trim() ?? '0',
                reco: tr.querySelector(this.#config.SELECTORS.POST_RECOMMEND)?.textContent.trim() ?? '0',
                timestamp: tr.querySelector(this.#config.SELECTORS.POST_DATE)?.title ?? null
            };
        }

        calculate(postRows) {
            this.#log(`게시물 ${postRows.length}개에 대한 통계 계산 시작.`);
            const totalPostCount = postRows.length;
            if (totalPostCount === 0) return null;

            const postsData = postRows.map(tr => this.getPostData(tr)).filter(Boolean);
            const userPostData = new Map();
            let guestPostCount = 0,
                semiFixedPostCount = 0,
                fixedPostCount = 0;

            for (const tr of postRows) {
                const writer = this.getWriterInfo(tr);
                const userData = userPostData.get(writer.key);
                if (userData) userData.count++;
                else userPostData.set(writer.key, {
                    count: 1,
                    name: writer.name,
                    type: writer.type
                });

                if (writer.type === this.#config.CONSTANTS.USER_TYPES.GUEST) guestPostCount++;
                else if (writer.type === this.#config.CONSTANTS.USER_TYPES.SEMI) semiFixedPostCount++;
                else if (writer.type === this.#config.CONSTANTS.USER_TYPES.FIXED) fixedPostCount++;
            }

            const allPosterStats = [...userPostData.values()];
            const originalGpi = totalPostCount > 0 ? allPosterStats.reduce((acc, p) => acc + (p.count / totalPostCount) ** 2, 0) : 0;
            const gpiScalingFactor = Math.min(1, totalPostCount / this.#config.CONSTANTS.GPI_MIN_POST_THRESHOLD);
            let gpi = originalGpi * gpiScalingFactor;

            const multiPosters = allPosterStats.filter(p => p.count > 1);
            const multiPostCount = multiPosters.reduce((sum, p) => sum + p.count, 0);
            const multiPostUserCount = multiPosters.length;
            if (multiPostUserCount === 0) gpi = 0;

            const sortedMultiPosters = [...multiPosters].sort((a, b) => b.count - a.count);
            const topPosters = sortedMultiPosters.slice(0, 5);
            const otherPosters = sortedMultiPosters.slice(5);
            const otherMultiPostCount = otherPosters.reduce((sum, p) => sum + p.count, 0);
            const otherMultiPostUserCount = otherPosters.length;

            const fixedPostRatio = totalPostCount > 0 ? fixedPostCount / totalPostCount : 0;
            const fixedNickRatioStage = this.getFixedNickRatioStage(fixedPostRatio);
            const gpiStage = this.getGpiStage(gpi);

            const result = {
                guestPostCount,
                semiFixedPostCount,
                fixedPostCount,
                totalPostCount,
                guestPostRatio: totalPostCount > 0 ? guestPostCount / totalPostCount : 0,
                semiFixedPostRatio: totalPostCount > 0 ? semiFixedPostCount / totalPostCount : 0,
                fixedPostRatio,
                multiPostCount,
                multiPostUserCount,
                gpi,
                normalizedGpi: this.normalizeGpi(gpi),
                originalGpi,
                gpiScalingFactor,
                multiPostersSorted: sortedMultiPosters,
                topPosters,
                otherMultiPostCount,
                otherMultiPostUserCount,
                fixedNickRatioStage,
                gpiStage,
                healthStage: this.calculateHealthStage_WeightedAverage(gpiStage, fixedNickRatioStage, -1),
                speed: this.#calculateSpeedStats(postsData),
                aiSentimentStage: -1,
                aiSentimentSummary: '측정 전',
                aiChaosIndex: 0,
                aiPositiveRatio: 0,
                aiNegativeRatio: 0,
                aiNeutralRatio: 0,
                aiPositiveCount: 0,
                aiNegativeCount: 0,
                aiNeutralCount: 0,
                positive_titles: [],
                negative_titles: [],
                neutral_titles: []
            };
            this.#log('계산 완료된 통계:', result);
            return result;
        }

        getFixedNickRatioStage(ratio) {
            return (ratio >= 0.75) ? 3 : (ratio >= 0.6) ? 2 : (ratio >= 0.45) ? 1 : 0;
        }

        getGpiStage(gpi) {
            return (gpi >= 0.080) ? 3 : (gpi >= 0.055) ? 2 : (gpi >= 0.04) ? 1 : 0;
        }

        calculateHealthStage_WeightedAverage(gpiStage, fixedNickRatioStage, aiStage) {
            const weights = {
                gpi: 0.5,
                ai: 0.3,
                fixedNick: 0.2
            };
            let score;
            if (aiStage === -1) {
                const totalWeight = weights.gpi + weights.fixedNick;
                score = (gpiStage * (weights.gpi / totalWeight)) + (fixedNickRatioStage * (weights.fixedNick / totalWeight));
            } else {
                score = (gpiStage * weights.gpi) + (aiStage * weights.ai) + (fixedNickRatioStage * weights.fixedNick);
            }
            return Math.min(3, Math.round(score));
        }

        normalizeGpi(gpiValue) {
            const points = this.#config.CONSTANTS.GPI_NORMALIZATION_POINTS;
            if (gpiValue <= points[0].gpi) return points[0].normalized;
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i],
                      p2 = points[i + 1];
                if (gpiValue <= p2.gpi) {
                    const gpiRange = p2.gpi - p1.gpi,
                          normalizedRange = p2.normalized - p1.normalized;
                    return gpiRange === 0 ? p1.normalized : p1.normalized + ((gpiValue - p1.gpi) / gpiRange) * normalizedRange;
                }
            }
            return points[points.length - 1].normalized;
        }

        #calculateSpeedStats(postsData) {
            const timestamps = postsData.map(p => p.timestamp).filter(Boolean).map(ts => new Date(ts)).sort((a, b) => a - b);
            if (timestamps.length < 2) return {
                ppm: 0,
                insufficientData: true,
                note: "데이터 2개 미만"
            };

            if (timestamps.length < 5) {
                const first = timestamps[0],
                      last = timestamps[timestamps.length - 1];
                let spanSec = (last - first) / 1000;
                if (spanSec < 1) spanSec = 1;
                return {
                    ppm: (timestamps.length / spanSec) * 60,
                    firstPostTime: first,
                    lastPostTime: last,
                    timeSpanInSeconds: spanSec,
                    note: "IQR 미적용 (데이터 부족)"
                };
            }

            const timesInMs = timestamps.map(t => t.getTime());
            const getPercentile = (arr, p) => {
                if (arr.length === 0) return 0;
                const idx = (p / 100) * (arr.length - 1);
                if (Number.isInteger(idx)) return arr[idx];
                const l = Math.floor(idx),
                      u = Math.ceil(idx),
                      w = idx - l;
                return arr[l] * (1 - w) + arr[u] * w;
            };

            const q1 = getPercentile(timesInMs, 25),
                  q3 = getPercentile(timesInMs, 75);
            const iqr = q3 - q1,
                  iqrMult = 1.0;
            const lowerB = q1 - iqrMult * iqr,
                  upperB = q3 + iqrMult * iqr;

            const filteredTimestamps = timestamps.filter(t => t.getTime() >= lowerB && t.getTime() <= upperB);
            if (filteredTimestamps.length < 2) return {
                ppm: 0,
                insufficientData: true,
                note: "이상치 제거 후 데이터 2개 미만"
            };

            const first = filteredTimestamps[0],
                  last = filteredTimestamps[filteredTimestamps.length - 1];
            let spanSec = (last - first) / 1000;
            if (spanSec < 1) spanSec = 1;
            const ppm = (filteredTimestamps.length / spanSec) * 60;
            const outliersRemoved = timestamps.length - filteredTimestamps.length;
            return {
                ppm,
                firstPostTime: first,
                lastPostTime: last,
                timeSpanInSeconds: spanSec,
                note: `IQR 적용${outliersRemoved > 0 ? `, 이상치 ${outliersRemoved}개 제거` : ''}`
            };
        }

        updateStatsWithSentiment(currentStats, analysisResult) {
            this.#log('AI 감정 분석 결과로 통계 업데이트 시작. 분석된 제목 수:', analysisResult.results.length);
            const {
                POSITIVE,
                NEGATIVE,
                NEUTRAL
            } = this.#config.CONSTANTS.SENTIMENT_TYPES;
            const counts = {
                [POSITIVE]: 0,
                [NEGATIVE]: 0,
                [NEUTRAL]: 0
            };
            const titles = {
                [POSITIVE]: [],
                [NEGATIVE]: [],
                [NEUTRAL]: []
            };

            analysisResult.results.forEach(({
                sentiment,
                title
            }) => {
                if (sentiment in counts) {
                    counts[sentiment]++;
                    if (titles[sentiment].length < 3) titles[sentiment].push(title);
                }
            });

            const totalAnalyzed = counts[POSITIVE] + counts[NEGATIVE] + counts[NEUTRAL];
            if (totalAnalyzed === 0) {
                this.#log('분석할 유효한 감정 데이터가 없어 업데이트를 중단합니다.');
                return currentStats;
            }

            const pRatio = counts[POSITIVE] / totalAnalyzed;
            const nRatio = counts[NEGATIVE] / totalAnalyzed;
            const polarization = pRatio * nRatio * 0.5;
            const chaosIndex = nRatio + polarization;
            const getChaosStage = idx => (idx >= 0.65) ? 3 : (idx >= 0.45) ? 2 : (idx >= 0.25) ? 1 : 0;

            const aiSentimentStage = getChaosStage(chaosIndex);
            const healthStage = this.calculateHealthStage_WeightedAverage(currentStats.gpiStage, currentStats.fixedNickRatioStage, aiSentimentStage);

            const newStats = {
                ...currentStats,
                aiSentimentStage,
                aiChaosIndex: chaosIndex,
                aiPolarizationFactor: polarization,
                aiSentimentSummary: `긍정 ${(pRatio * 100).toFixed(1)}% | 부정 ${(nRatio * 100).toFixed(1)}%`,
                aiPositiveRatio: pRatio,
                aiNegativeRatio: nRatio,
                aiNeutralRatio: counts[NEUTRAL] / totalAnalyzed,
                aiPositiveCount: counts[POSITIVE],
                aiNegativeCount: counts[NEGATIVE],
                aiNeutralCount: counts[NEUTRAL],
                positive_titles: titles[POSITIVE],
                negative_titles: titles[NEGATIVE],
                neutral_titles: titles[NEUTRAL],
                healthStage
            };

            this.#log('감정 분석 통계 업데이트 완료:', newStats);
            return newStats;
        }
    }

    /**
     * @class ApiClient
     * @description Handles external API communications, specifically with Google's Gemini API.
     */
    class ApiClient {
        #config;
        #log;

        constructor(config, log) {
            this.#config = config;
            this.#log = log || (() => {});
        }

        fetchGeminiAPI(prompt, model, apiKey, options = {}) {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                safetySettings: ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
                .map(category => ({
                    category,
                    threshold: "BLOCK_NONE"
                }))
            };
            const generationConfig = {};
            if (options.mimeType) generationConfig.response_mime_type = options.mimeType;
            if (options.schema) generationConfig.response_schema = options.schema;
            if (Object.keys(generationConfig).length > 0) payload.generationConfig = generationConfig;

            this.#log(`Gemini API 요청 전송... 모델: ${model}, MimeType: ${options.mimeType || 'default'}`);
            this.#log('API 요청 페이로드(prompt 제외):', { ...payload,
                                                  contents: [{
                                                      parts: [{
                                                          text: '...prompt 생략...'
                                                      }]
                                                  }]
                                                 });

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: apiUrl,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(payload),
                    onload: response => {
                        try {
                            const parsedResponse = JSON.parse(response.responseText);
                            this.#log('API 응답 성공:', parsedResponse);
                            resolve(parsedResponse);
                        } catch (e) {
                            this.#log('API 응답 JSON 파싱 실패:', e);
                            reject({
                                error: {
                                    message: "Failed to parse API response."
                                }
                            });
                        }
                    },
                    onerror: error => {
                        this.#log('API 네트워크 요청 오류:', error);
                        reject({
                            error: {
                                message: "Network request failed. 재설치 후 스크립트를 허용하세요."
                            }
                        });
                    }
                });
            });
        }
    }

    /**
     * @class PromptBuilder
     * @description Creates structured prompts for the AI model.
     */
    class PromptBuilder {
        #galleryName;

        constructor(galleryName) {
            this.#galleryName = galleryName;
        }

        createSummaryPrompt(postsData) {
            const instructions = `당신은 DCinside '${this.#galleryName}' 갤러리의 동향을 분석하는 전문가입니다.\n제공되는 최근 게시물 목록 데이터를 분석하여, 현재 갤러리에서 가장 중요하고 화제가 되는 '핵심 떡밥' 3가지를 식별하고 요약해주세요.\n\n**분석 가이드라인:**\n1.  **중요도 판단**: '조회수'와 '추천수'가 높은 게시물은 중요한 주제이므로 최우선으로 주목해야 합니다.\n2.  **대표글 인용**: 각 핵심 떡밥을 요약할 때, 가장 대표적인 게시물 하나를 골라 **반드시 \`(대표글 ID: {post_no})\` 형식으로 그 게시물의 고유 ID를 포함시켜야 합니다.** {post_no} 부분에는 해당 게시물의 실제 숫자 ID를 넣어야 합니다.\n\n**출력 형식:**\n1. 3가지 핵심 떡밥을 개조식(음슴체)으로 세 줄로 작성 해주세요.\n2. 마크다운 문법은 절대 사용하지 마세요.\n3. 최종 출력은 '${this.#galleryName} 갤러리 현재 페이지 핵심 떡밥 요약입니다.\\n' 문장으로 시작해야 합니다.`;
            const postListStr = postsData.map(p => `- ID: ${p.post_no}, 제목: ${p.title}, 조회수: ${p.views}, 추천수: ${p.reco}`).join('\\n');
            return `${instructions}\n\n**분석할 게시물 데이터 (최근 ${postsData.length}개):**\n${postListStr}\n\n**핵심 떡밥 요약:**`;
        }

        createSentimentAnalysisPrompt(posts, sentimentTypes) {
            const {
                POSITIVE,
                NEGATIVE,
                NEUTRAL
            } = sentimentTypes;
            return `You are an expert sentiment analyst for the DCinside "${this.#galleryName}" gallery.\nAnalyze the sentiment of the following posts based on their title, view count, and recommendation count.\nYour analysis must classify each post's sentiment as one of these exact values: "${POSITIVE}", "${NEGATIVE}", or "${NEUTRAL}".\n\n**Analysis Guidelines:**\n- A neutral-looking title with high views and recommendations likely has a strong underlying sentiment.\n- A negative title with high recommendations indicates a significant, widely-agreed-upon issue.\n- Titles containing laughter cues (e.g., "ㅋㅋ", "ㅋㅋㅋㅋ") are generally "${POSITIVE}".\n\nAnalyze this data:\n[\n${posts.map(p => JSON.stringify(p)).join(',\n')}\n]`;
        }

        createAIPersonalityPrompt(postTitles) {
            return `너는 디시 '${this.#galleryName}' 갤러리 20년차 유저다. 웬만한 건 다 꿰뚫어 보지만 말을 아끼는 편이야. 한마디 툭 던져도 그게 정곡을 찌르는 팩트지. 아래 유저 글 목록 보고, 이 유저가 어떤 유형인지 최대한 객관적으로 관찰해서 딱 세 줄로 요약해봐. 쓸데없는 미사여구는 빼고, 보이는 그대로 무심하게. 첫 줄은 핵심 특징, 두 번째 줄은 글쓰기 패턴, 세 번째 줄은 결론. 출력은 정확히 **세 줄**이어야 해.
단, 출력에 특수문자를 사용해선 안 돼. 너무 나쁜 말은 하지 말아줘. 갤러리 유저를 비하하는 단어를 사용해선 안 돼.

**분석할 게시물 제목 목록:**
[
"${postTitles.slice(0, 200).join('",\n"')}"
]
`;
        }
    }

    /**
     * @class ReportGenerator
     * @description Generates a formatted text report from statistics.
     */
    class ReportGenerator {
        #config;
        #stats;
        #utils;
        #galleryName;
        #summaryText;

        constructor(config, utils, stats, galleryName, summaryText = '') {
            this.#config = config;
            this.#utils = utils;
            this.#stats = stats;
            this.#galleryName = galleryName;
            this.#summaryText = summaryText;
        }

        generate() {
            const header = this.#_getReportHeader();
            const fixedNick = this.#_getReportFixedNickSection();
            const gpi = this.#_getReportGpiSection();
            const topPosters = this.#_getReportTopPostersSection();
            const speed = this.#_getReportSpeedSection();
            const ai = this.#_getReportAiSection();
            const summary = this.#_getReportAiSummary();
            const topN = this.#stats.topPosters?.length ?? 0;

            const aiNote = `\n--------------------------------------------------\n* AI 분석은 스크립트 실행 시점의 페이지만을 기준으로 합니다.`;

            return `${header}\n\n--- 👤 고정닉 농도 ---\n${fixedNick}\n\n--- 👻 갤 망령 지수 (GPI) ---\n${gpi}\n\n--- 📝 주요 작성자 (상위 ${topN}명) ---\n${topPosters}\n\n--- ⏰ 글 리젠 속도 ---\n${speed}${aiNote}\n\n--- 💡 AI 감정 분석 (현재 페이지) ---\n${ai}\n\n--- 📄 AI 핵심 요약 (현재 페이지) ---\n${summary}\n\n(Powered by 갤스코프)`;
        }

        #_getReportHeader() {
            const { healthStage } = this.#stats;
            const healthStatus = this.#config.STATUS_LEVELS[healthStage];
            const targetScope = this.#stats.scopeLabel ? `(${this.#stats.scopeLabel.replace(/<[^>]*>/g, '')})` : '(현재 페이지)';
            const target = `분석 대상: ${this.#galleryName} 갤러리 ${targetScope}`;
            const interpretations = this.#config.TEXTS.REPORT_HEALTH_INTERPRETATIONS;
            return `[📊 갤스코프 분석 결과 📊]\n- 분석 시간: ${this.#utils.getFormattedTimestamp()}\n- ${target}\n- 종합 상태: [ ${healthStatus.tag} (단계 ${healthStage}) ]\n  (해석: ${interpretations[healthStage]})`;
        }


        #_getReportFixedNickSection() {
            const {
                fixedNickRatioStage,
                guestPostRatio,
                semiFixedPostRatio,
                fixedPostRatio,
                guestPostCount,
                semiFixedPostCount,
                fixedPostCount
            } = this.#stats;
            const fixedNickStatus = this.#config.STATUS_LEVELS[fixedNickRatioStage];
            const guestPart = `유동 ${this.#utils.formatPercent(guestPostRatio)}(${guestPostCount}개)`;
            const semiPart = `반고닉 ${this.#utils.formatPercent(semiFixedPostRatio)}(${semiFixedPostCount}개)`;
            const fixedPart = `고정닉 ${this.#utils.formatPercent(fixedPostRatio)}(${fixedPostCount}개)`;
            return `- 상태: ${fixedNickStatus.tag} (단계 ${fixedNickRatioStage})\n- 고정닉 비율: [ ${this.#utils.formatPercent(fixedPostRatio)} ]\n- 구성: ${guestPart} | ${semiPart} | ${fixedPart}`;
        }

        #_getReportGpiSection() {
            const { gpiStage, normalizedGpi, topPosters, totalPostCount, isGpiAveraged, gpiScalingFactor } = this.#stats;
            const gpiStatus = this.#config.STATUS_LEVELS[gpiStage];
            const normGpiPercent = (normalizedGpi * 100).toFixed(0);

            const interpretations = this.#config.TEXTS.REPORT_GPI_INTERPRETATIONS;
            const interpretation = normalizedGpi >= 0.75 ? interpretations.high : normalizedGpi >= 0.50 ? interpretations.mediumHigh : normalizedGpi >= 0.25 ? interpretations.medium : interpretations.low;

            let posterInfo = "상위 작성자 정보 없음";
            if (topPosters.length > 0) {
                const topNCount = topPosters.reduce((s, p) => s + p.count, 0);
                const topNPercent = totalPostCount > 0 ? Math.floor((topNCount / totalPostCount) * 100) : 0;
                posterInfo = `집중도: 상위 ${topPosters.length}명이 전체 글의 ${topNPercent}%(${topNCount}개)를 작성.`;
            }

            const lines = [
                `- 상태: ${gpiStatus.tag} (단계 ${gpiStage})`,
                `- 정규화 GPI 값: [ 약 ${normGpiPercent}% ]`,
                `  (해석: ${interpretation})`,
                `- ${posterInfo}`
            ];

            if (!isGpiAveraged && gpiScalingFactor < 1) {
                lines.push(`  (※ 표본 부족으로 보정 가중치 ${Math.round(gpiScalingFactor * 100)}% 적용됨)`);
            }
            return lines.join('\n');
        }

        #_getReportTopPostersSection() {
            const {
                topPosters,
                otherMultiPostUserCount,
                otherMultiPostCount,
                totalPostCount,
                multiPostCount,
                multiPostUserCount
            } = this.#stats;
            if (!topPosters?.length) return '2개 이상 작성자 없음';
            let text = topPosters.map(p => `- ${this.#utils.maskWriterInfo(p.name)}: ${p.count}개`).join('\n');
            if (otherMultiPostUserCount > 0) text += `\n- 그 외 ${otherMultiPostUserCount}명이 ${otherMultiPostCount}개 작성`;
            if (multiPostUserCount > 0) text += `\n(총 ${totalPostCount}개 중 ${multiPostCount}개를 ${multiPostUserCount}명이 작성)`;
            return text;
        }

        #_getReportSpeedSection() {
            const {
                speed,
                totalPostCount
            } = this.#stats;
            if (!speed?.ppm) return '글 리젠 속도: 측정 불가 또는 데이터 부족';

            let durationInfo = '';
            if (speed.firstPostTime && speed.lastPostTime) {
                const firstDate = speed.firstPostTime;
                const lastDate = speed.lastPostTime;

                const pad = n => String(n).padStart(2, '0');
                const fmtTimeOnly = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
                const fmtDateTime = d => `${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${fmtTimeOnly(d)}`;

                const areOnSameDay = firstDate.toDateString() === lastDate.toDateString();

                const first = areOnSameDay ? fmtTimeOnly(firstDate) : fmtDateTime(firstDate);
                const last = areOnSameDay ? fmtTimeOnly(lastDate) : fmtDateTime(lastDate);

                const totalSec = Math.max(1, Math.round(speed.timeSpanInSeconds));
                const hours = Math.floor(totalSec / 3600);
                const minutes = Math.floor((totalSec % 3600) / 60);

                let timeSpan = '';
                if (hours > 0) timeSpan += `${hours}시간 `;
                if (minutes > 0 || hours > 0) timeSpan += `${minutes}분`;
                if (!timeSpan) timeSpan = `${totalSec}초`;

                durationInfo = `\n- 분석 기간: ${first} ~ ${last} (약 ${timeSpan.trim()})`;
            }
            return `- 분당 게시물 수: [ ${speed.ppm.toFixed(1)}개/분 ]${durationInfo}\n- 분석된 게시물: ${totalPostCount}개`;
        }

        #_getReportAiSection() {
            const { aiSentimentStage, aiChaosIndex, positive_titles, negative_titles, neutral_titles } = this.#stats;
            if (aiSentimentStage === -1) return '(미측정)';

            const aiStatus = this.#config.STATUS_LEVELS[aiSentimentStage];
            const interpretations = this.#config.TEXTS.REPORT_AI_INTERPRETATIONS;
            const interpretation = interpretations[aiSentimentStage];
            const fmtList = (label, titles) => {
                if (!titles?.length) return '';
                const titleLines = titles.map(t => `    - ${t}`).join('\n');
                return `\n\n  ${label}:\n${titleLines}`;
            };
            let text = `- 상태: ${aiStatus.tag} (단계 ${aiSentimentStage})\n- 혼란 지수: [ ${aiChaosIndex.toFixed(3)} ]\n  (해석: ${interpretation})`;
            text += fmtList('주요 긍정적 게시물', positive_titles);
            text += fmtList('주요 부정적 게시물', negative_titles);
            text += fmtList('주요 중립적 게시물', neutral_titles);
            return text;
        }

        #_getReportAiSummary() {
            if (!this.#summaryText) return '(AI 요약 정보 없음)';
            return this.#summaryText.split('\n').filter(l => l.trim()).slice(1)
                .map((l, i) => `${i + 1}. ${l.replace(/\(대표글 ID: \d+\)/, '').replace(/^\d+\.\s*-?\s*/, '').trim().replace(/ \./g, '.')}`)
                .join('\n');
        }
    }

    /**
     * @class Gallscope
     * @description Main controller for the Gallscope userscript. Orchestrates all modules.
     */
    class Gallscope {
        #config;
        #state;
        #utils;
        #uiManager;
        #tooltipManager;
        #modalManager;
        #calculator;
        #apiClient;
        #promptBuilder;

        constructor(config, state, utils, UIManager, StatisticsCalculator, ApiClient, TooltipManager, ModalManager) {
            this.#config = config;
            this.#state = state;
            this.#utils = utils;

            const eventHandlers = this.#createEventHandlers();

            this.#tooltipManager = new TooltipManager(config);
            this.#uiManager = new UIManager(config, state, eventHandlers, this.#utils.log, this.#tooltipManager);
            this.#modalManager = new ModalManager(config, state, eventHandlers, this.#uiManager);
            this.#calculator = new StatisticsCalculator(config, utils, this.#utils.log);
            this.#apiClient = new ApiClient(config, this.#utils.log);
            this.#promptBuilder = null;
        }

        #createEventHandlers() {
            return {
                log: this.#utils.log,
                onFetchAISummary: this.fetchAISummary.bind(this),
                onFetchAISentiment: this.fetchAndRenderAISentiment.bind(this),
                onFetchAndAnalyzeMultiplePages: this.fetchAndAnalyzeMultiplePages.bind(this),
                onFetchUserPostsInScope: this.fetchAndDisplayUserPostsInScope.bind(this),
                getTooltipContentProvider: this.getTooltipContentProvider.bind(this),
                onSetupCopyButton: this.setupCopyButton.bind(this),
                getFormattedTimestamp: this.#utils.getFormattedTimestamp,
                sleep: this.#utils.sleep,
                onAnalyzeUserRequest: this.analyzeUserWithAI.bind(this),
                escapeHtml: this.#utils.escapeHtml,
                onShowScopeInput: () => this.#modalManager.showScopeInput()
            };
        }


        async init() {
            await this.#runCacheMigration(); // 2.1.0 부터 삭제할 것
            this.#utils.log('Core', '갤스코프 초기화 시작...');
            this.#preloadResources();
            if (!document.querySelector(this.#config.SELECTORS.POST_ROW)) {
                this.#utils.log('Core', '게시물 목록을 찾을 수 없어 200ms 후 재시도합니다.');
                return setTimeout(() => this.init(), 200);
            }
            this.#setupUserPopupObserver();
            this.#state.chartJsLoadPromise = this.#loadChartJs().catch(e => console.error('[Gallscope] Chart.js 로딩 중 심각한 오류 발생', e));

            await this.#loadPersistentState();

            this.#promptBuilder = new PromptBuilder(this.#uiManager.getGalleryName());
            this.#uiManager.injectStyles();
            this.#uiManager.updateTheme();
            await this.#setupMenuCommands();

            this.#uiManager.renderToggleButton(this.#handleToggleClick.bind(this));

            if (this.#state.isBoxVisible) {
                this.#showBoxAndAnalyze();
            }

            this.#setupObserversAndListeners();
            this.#utils.log('Core', '갤스코프 초기화 완료.');
        }
        #showBoxAndAnalyze() {
            if (!this.#state.analysisBoxElement) {
                this.runAnalysis();
            } else {
                this.#uiManager.setBoxVisibility(true);
            }
        }

        async #handleToggleClick() {
            this.#state.isBoxVisible = !this.#state.isBoxVisible;
            this.#utils.log('Core', `분석 박스 표시 상태 변경: ${this.#state.isBoxVisible}`);

            await GM_setValue(this.#config.UI.GALLSCOPE_BOX_VISIBILITY_ID, this.#state.isBoxVisible);

            if (this.#state.isBoxVisible) {
                this.#showBoxAndAnalyze();
            } else {
                this.#uiManager.setBoxVisibility(false);
            }
        }
        async #loadPersistentState() {
            try {
                const savedPosition = await GM_getValue(this.#config.UI.GALLSCOPE_BOX_POSITION_ID, null);
                if (savedPosition) {
                    this.#state.userBoxPosition = JSON.parse(savedPosition);
                    this.#state.isBoxMovedByUser = true;
                }
            } catch (e) {
                this.#utils.log('Core', '저장된 위치를 불러오는 데 실패했습니다.', e);
                await GM_setValue(this.#config.UI.GALLSCOPE_BOX_POSITION_ID, null);
            }

            this.#state.isBoxExpanded = await GM_getValue(this.#config.UI.GALLSCOPE_BOX_EXPANDED_ID, false);
            this.#utils.log('Core', `박스 펼침 상태 로드: ${this.#state.isBoxExpanded}`);

            this.#state.isBoxVisible = await GM_getValue(this.#config.UI.GALLSCOPE_BOX_VISIBILITY_ID, true);
            this.#state.geminiApiKey = await GM_getValue(this.#config.API.GEMINI_API_KEY_ID, '');
            this.#state.selectedGeminiModel = await GM_getValue(this.#config.API.GEMINI_MODEL_ID, this.#config.API.DEFAULT_GEMINI_MODEL);
            this.#utils.log('Core', `API 키 로드: ${this.#state.geminiApiKey ? '있음' : '없음'}, 모델: ${this.#state.selectedGeminiModel}`);
        }

        async #setupMenuCommands() {
            if (typeof GM_registerMenuCommand !== 'function') return;

            GM_registerMenuCommand("Gemini API 키 설정", async () => {
                const currentKey = await GM_getValue(this.#config.API.GEMINI_API_KEY_ID, '');
                const newKey = prompt(`Gemini API 키를 입력하세요.\n비워두고 확인 시 삭제됩니다.\n현재 설정된 키: ${currentKey ? `${currentKey.substring(0, 7)}...` : '없음'}`, currentKey);
                if (newKey !== null) {
                    const trimmedKey = newKey.trim();
                    await GM_setValue(this.#config.API.GEMINI_API_KEY_ID, trimmedKey);
                    this.#state.geminiApiKey = trimmedKey;
                    alert(trimmedKey ? "Gemini API 키가 저장되었습니다." : "Gemini API 키가 삭제되었습니다.");
                }
            });

            GM_registerMenuCommand("Gemini 모델 선택", async () => {
                const {
                    DEFAULT_GEMINI_MODEL,
                    AVAILABLE_MODELS,
                    GEMINI_MODEL_ID
                } = this.#config.API;
                const currentModel = await GM_getValue(GEMINI_MODEL_ID, DEFAULT_GEMINI_MODEL);
                const promptMessage = `사용할 Gemini 모델을 선택하거나 직접 입력하세요:\n(현재: ${currentModel})\n\n${AVAILABLE_MODELS.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n번호 또는 모델 이름을 입력하세요. ('gemini-2.0-flash' 권장)`;
                const selection = prompt(promptMessage, currentModel);
                if (selection?.trim()) {
                    const selectedIndex = parseInt(selection, 10) - 1;
                    const newModel = (selectedIndex >= 0 && selectedIndex < AVAILABLE_MODELS.length) ? AVAILABLE_MODELS[selectedIndex] : selection.trim();
                    await GM_setValue(GEMINI_MODEL_ID, newModel);
                    this.#state.selectedGeminiModel = newModel;
                    alert(`Gemini 모델이 '${newModel}'로 설정되었습니다.`);
                }
            });

            GM_registerMenuCommand("갤스코프 위치 초기화", async () => {
                await GM_setValue(this.#config.UI.GALLSCOPE_BOX_POSITION_ID, null);
                this.#state.isBoxMovedByUser = false;
                this.#state.userBoxPosition = null;
                if (this.#state.analysisBoxElement) this.#uiManager.repositionBox();

                await GM_setValue(this.#config.UI.GALLSCOPE_TOGGLE_BUTTON_POSITION_ID, null);
                const toggleBtn = document.getElementById(this.#config.UI.TOGGLE_BUTTON_ID);
                if (toggleBtn) {
                    toggleBtn.style.top = '';
                    toggleBtn.style.left = '';
                }

                alert("갤스코프 분석창과 토글 버튼의 위치가 초기화되었습니다.");
            });

            const updateCacheToggleMenu = async () => {
                if (this.#state.cacheToggleMenuId) {
                    GM_unregisterMenuCommand(this.#state.cacheToggleMenuId);
                }

                const isEnabled = await GM_getValue(this.#config.CONSTANTS.CACHE_HIGHLIGHT_ENABLED_KEY, true);
                this.#state.isCacheHighlightEnabled = isEnabled;

                const menuText = `새 유저 하이라이트: ${isEnabled ? '✅ 켬' : '❌ 끔'}`;

                this.#state.cacheToggleMenuId = GM_registerMenuCommand(menuText, async () => {
                    const newStatus = !this.#state.isCacheHighlightEnabled;
                    await GM_setValue(this.#config.CONSTANTS.CACHE_HIGHLIGHT_ENABLED_KEY, newStatus);
                    this.#state.isCacheHighlightEnabled = newStatus;

                    alert(`새 유저 하이라이트 기능이 '${newStatus ? '켬' : '끔'}' 상태로 변경되었습니다.`);
                    updateCacheToggleMenu();
                });
            };

            await updateCacheToggleMenu();

            const updateExpirationMenu = async () => {
                if (this.#state.cacheExpirationMenuId) {
                    GM_unregisterMenuCommand(this.#state.cacheExpirationMenuId);
                }
                const currentDays = await GM_getValue(
                    this.#config.CONSTANTS.CACHE_EXPIRATION_DAYS_KEY,
                    this.#config.CONSTANTS.DEFAULT_CACHE_EXPIRATION_DAYS
                );

                const menuText = `새 유저 하이라이트 기간 설정 (현재: ${currentDays}일)`;
                this.#state.cacheExpirationMenuId = GM_registerMenuCommand(menuText, async () => {
                    const newDays = prompt(`새로운 유저로 감지할 기간(일)을 입력하세요.\n이 기간이 지나면 활동이 없던 유저는 '새로운 유저'로 다시 표시됩니다.\n(기본값: 15, 현재: ${currentDays}일, 최소 2일)`, currentDays);

                    if (newDays !== null && !isNaN(parseInt(newDays, 10))) {
                        let days = parseInt(newDays, 10);
                        if (days < 2) {
                            alert("최소 2일 이상으로 설정해야 합니다. 2일로 자동 조정됩니다.");
                            days = 2;
                        }

                        await GM_setValue(this.#config.CONSTANTS.CACHE_EXPIRATION_DAYS_KEY, days);
                        alert(`하이라이트 기간이 ${days}일로 설정되었습니다.`);
                        updateExpirationMenu();
                    } else if (newDays !== null) {
                        alert("유효한 숫자를 입력해주세요.");
                    }
                });
            };

            await updateExpirationMenu();
            GM_registerMenuCommand("저장된 식별코드(IP) 목록 확인하기", async () => {
                try {
                    const allKeys = await GM_listValues();
                    const userCacheKeys = allKeys.filter(key =>
                                                         key.startsWith(this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX)
                                                        );

                    if (userCacheKeys.length === 0) {
                        alert("갤스코프에 저장된 유저 식별코드 캐시가 없습니다.");
                        return;
                    }

                    console.group("[갤스코프] 저장된 식별코드(IP) 목록 (v3 - 배열 형식)");

                    for (const key of userCacheKeys) {
                        const userCacheArray = await GM_getValue(key, []);
                        const galleryId = key.replace(this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX, '');

                        const userKeyList = userCacheArray.map(userArray => userArray[0]);

                        console.log(`%c■ ${galleryId} 갤러리 (${userKeyList.length}개 저장됨)`,
                                    "font-weight: bold;",
                                   );
                        console.log(userKeyList);
                    }

                    console.groupEnd();
                    alert("F12 개발자 콘솔에서 저장된 모든 유저 식별코드 목록을 확인하세요.");

                } catch (e) {
                    console.error("[갤스코프] 캐시 데이터를 불러오는 중 오류가 발생:", e);
                }
            });

            GM_registerMenuCommand("현재 갤러리 캐시 초기화", async () => {
                const galleryId = new URLSearchParams(window.location.search).get('id');
                if (!galleryId) {
                    alert("갤러리 페이지에서만 사용할 수 있습니다.");
                    return;
                }
                if (confirm(`정말로 '${galleryId}' 갤러리의 새로운 유저 감지 캐시를 모두 삭제하시겠습니까?`)) {
                    const cacheKey = `${this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX}${galleryId}`;
                    await GM_deleteValue(cacheKey);
                    alert(`'${galleryId}' 갤러리의 캐시가 초기화되었습니다. 다음 페이지 로드 시 모든 유저가 새 유저로 감지됩니다.`);
                }
            });
        }

        #setupObserversAndListeners() {
            const postListElement = document.querySelector(this.#config.SELECTORS.POST_ROW)?.parentNode;
            if (postListElement) {
                new MutationObserver(() => {
                    clearTimeout(this.#state.debounceTimers.analysis);
                    this.#state.debounceTimers.analysis = setTimeout(() => this.runAnalysis(), 150);
                }).observe(postListElement, {
                    childList: true
                });
            }
            new MutationObserver(() => {
                this.#uiManager.updateTheme();
                if (this.#state.analysisBoxElement && this.#state.lastCalculatedStats) this.#uiManager.renderAnalysisBox(this.#state.lastCalculatedStats);
            }).observe(document.head, {
                childList: true,
                subtree: true
            });

            window.addEventListener('resize', () => {
                clearTimeout(this.#state.debounceTimers.resize);
                this.#state.debounceTimers.resize = setTimeout(() => {
                    if (!this.#state.isBoxMovedByUser) this.#uiManager.repositionBox();
                }, 100);
            }, {
                passive: true
            });
        }

        #setupUserPopupObserver() {
            const postListContainer = document.querySelector(this.#config.SELECTORS.POST_ROW)?.parentNode;
            if (!postListContainer) {
                this.#utils.log('Observer', 'User popup observer: Post list container not found. Observer not started.');
                return;
            }
            const observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const popupUl = node.matches?.(this.#config.SELECTORS.USER_POPUP_UL) ?
                                      node : node.querySelector?.(this.#config.SELECTORS.USER_POPUP_UL);
                                if (popupUl) this.#addScopeMenuItemToPopup(popupUl);
                            }
                        });
                    }
                }
            });
            observer.observe(postListContainer, {
                childList: true,
                subtree: true
            });
            this.#utils.log('Observer', `User popup observer started for:`, postListContainer);
        }

        #addScopeMenuItemToPopup(popupUlElement) {
            const {
                SCOPE_EXTENSION_MENU_ITEM_CLASS
            } = this.#config.UI;
            if (!popupUlElement || popupUlElement.querySelector(`.${SCOPE_EXTENSION_MENU_ITEM_CLASS}`)) return;
            popupUlElement.appendChild(this.#createNewScopeMenuItem());
        }

        #createNewScopeMenuItem() {
            const {
                SCOPE_EXTENSION_MENU_ITEM_CLASS,
                SCOPE_EXTENSION_MENU_ITEM_TEXT
            } = this.#config.UI;
            const li = document.createElement('li');
            li.className = `bg_jingrey ${SCOPE_EXTENSION_MENU_ITEM_CLASS}`;
            li.innerHTML = `<a style="font-weight:600;" href="javascript:void(0);" title="갤스코프로 해당 유저의 작성글 범위 확장 분석">${SCOPE_EXTENSION_MENU_ITEM_TEXT}<em class="sp_img icon_go"></em></a>`;

            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                const popupUl = li.closest(this.#config.SELECTORS.USER_POPUP_UL);
                if (!popupUl) return this.#utils.log("UserScope", "오류: 유저 팝업 UL을 찾을 수 없습니다.");

                const extractFromUbSave = type => {
                    const link = popupUl.querySelector(`a[href*="ub_save_conf_one"][href*="'${type}'"]`);
                    const match = link?.href.match(new RegExp(`ub_save_conf_one\\([^,]+,\\s*[^,]+,\\s*[^,]+,\\s*'${type}',\\s*'([^']+)'\\)`));
                    return match?.[1] ?? null;
                };

                const rawId = extractFromUbSave('id');
                const rawNick = extractFromUbSave('nick');
                let displayName = rawNick ? decodeURIComponent(rawNick) : null;
                const writerTd = popupUl.closest('td.gall_writer.ub-writer');
                const extractedIp = writerTd?.dataset.ip?.trim() || null;

                let filterKey = null;
                if (rawId) {
                    filterKey = `id:${rawId}`;
                    displayName = displayName || rawId;
                } else if (extractedIp) {
                    filterKey = `ip:${extractedIp}`;
                    displayName = displayName || extractedIp;
                } else {
                    const gallogLink = popupUl.querySelector("a[href*='//gallog.dcinside.com/']");
                    const gallogMatch = gallogLink?.href.match(/\/\/gallog\.dcinside\.com\/([^/?]+)/);
                    if (gallogMatch?.[1]) {
                        filterKey = `id:${gallogMatch[1]}`;
                        displayName = displayName || gallogMatch[1];
                    }
                }

                if (filterKey && displayName) {
                    this.#handleUserScopeExtensionRequest({
                        filterKey,
                        displayName
                    });
                } else {
                    alert('대상 유저 정보를 정확히 식별하지 못했습니다.');
                }
            });
            return li;
        }

        _handleUserSearchRequest() {
            const userInputEl = document.getElementById('gallscopeUserInput');
            const userInput = userInputEl?.value.trim();
            if (!userInput) return alert("검색할 ID 또는 IP를 입력해주세요.");

            const filterKey = /^\d{1,3}(\.\d{1,3})+$/.test(userInput) ? `ip:${userInput}` : `id:${userInput}`;
            userInputEl.value = '';
            this.#handleUserScopeExtensionRequest({
                filterKey,
                displayName: userInput,
                isDirectSearch: true
            });
        }

        #handleUserScopeExtensionRequest(targetUserInfo) {
            this.#utils.log('UserScope', '집중 스코프 요청 처리. 대상 유저:', targetUserInfo);
            this.#state.isUserSpecificScopeMode = true;
            this.#state.currentUserScopeTarget = targetUserInfo;
            this.#modalManager.showScopeInput();
        }

        async #loadChartJs() {
            if (window.Chart) return;
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = this.#config.CHARTJS_CDN_URL;
                script.onload = () => {
                    this.#utils.log('Core', 'Chart.js 라이브러리 로드 완료.');
                    resolve();
                };
                script.onerror = () => {
                    console.error('[Gallscope] Chart.js 라이브러리 로드 실패.');
                    reject(new Error('Chart.js load failed'));
                };
                document.head.appendChild(script);
            });
        }

        async #highlightNewUsers(postRows) {
            try {
                const galleryId = new URLSearchParams(window.location.search).get('id');
                if (!galleryId) return;

                const cacheKey = `${this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX}${galleryId}`;

                if (!this.#state.sessionCache || this.#state.sessionCache.galleryId !== galleryId) {
                    const knownUsersData = await GM_getValue(cacheKey, []);
                    this.#state.sessionCache = {
                        galleryId: galleryId,
                        userMap: new Map(knownUsersData.map(user => [user[0], {
                            firstSeen: user[1],
                            lastSeen: user[2],
                            postCount: user[3]
                        }])),
                        isDirty: false
                    };
                    this.#utils.log('Cache', `${galleryId} 갤러리 캐시를 새로 로드했습니다. (${this.#state.sessionCache.userMap.size}개)`);
                }
                const { userMap } = this.#state.sessionCache;

                const currentPostsMap = new Map();
                postRows.forEach(tr => {
                    const writerInfo = this.#calculator.getWriterInfo(tr);
                    if (writerInfo.key !== 'unknown') {
                        if (!currentPostsMap.has(writerInfo.key)) {
                            currentPostsMap.set(writerInfo.key, []);
                        }
                        const writerTd = tr.querySelector(this.#config.SELECTORS.POST_WRITER);
                        if (writerTd) currentPostsMap.get(writerInfo.key).push(writerTd);
                    }
                });

                const currentUniqueKeys = [...currentPostsMap.keys()];
                const newlyFoundKeys = currentUniqueKeys.filter(key => !userMap.has(key));

                const totalUniqueUsersCount = currentUniqueKeys.length;
                if (totalUniqueUsersCount > 0) {
                    const newUserRatio = newlyFoundKeys.length / totalUniqueUsersCount;
                    if (newUserRatio <= this.#config.CONSTANTS.NEW_USER_HIGHLIGHT_THRESHOLD) {
                        this.#utils.log('NewUser', `${newlyFoundKeys.length}/${totalUniqueUsersCount} (${(newUserRatio * 100).toFixed(1)}%) - 하이라이트 활성화`);
                        newlyFoundKeys.forEach(key => {
                            const elements = currentPostsMap.get(key);
                            elements.forEach(el => {
                                el.classList.add(this.#config.UI.NEW_USER_HIGHLIGHT_CLASS);
                            });
                        });
                    } else {
                        this.#utils.log('NewUser', `새 유저 비율(${(newUserRatio * 100).toFixed(1)}%)이 임계값(${this.#config.CONSTANTS.NEW_USER_HIGHLIGHT_THRESHOLD * 100}%)을 초과하여 하이라이트를 건너뜁니다.`);
                    }
                }

                const now = Math.floor(Date.now() / 1000);
                let newUsersFoundOnPage = false;

                currentUniqueKeys.forEach(key => {
                    if (userMap.has(key)) {
                        const userData = userMap.get(key);
                        if (now - userData.lastSeen > 60) {
                            userData.lastSeen = now;
                            this.#state.sessionCache.isDirty = true;
                        }
                        userData.postCount++;
                    } else {
                        userMap.set(key, { firstSeen: now, lastSeen: now, postCount: 1 });
                        newUsersFoundOnPage = true;
                    }
                });

                if (newUsersFoundOnPage) {
                    this.#state.sessionCache.isDirty = true;
                }

                await this.#pruneAndSaveCacheIfNeeded(galleryId);

            } catch (e) {
                console.error('[Gallscope] 새로운 유저 감지 기능 중 오류 발생:', e);
            }
        }

        async #pruneAndSaveCacheIfNeeded(galleryId) {
            if (!this.#state.sessionCache || !this.#state.sessionCache.isDirty) {
                return;
            }

            const PRUNING_INTERVAL_HOURS = 1;
            const lastPruningTimeKey = `${this.#config.CONSTANTS.LAST_PRUNING_TIME_PREFIX}${galleryId}`;
            const lastPruningTime = await GM_getValue(lastPruningTimeKey, 0);
            const now = Math.floor(Date.now() / 1000);

            if ((now - lastPruningTime) < PRUNING_INTERVAL_HOURS * 60 * 60) {
                const cacheKey = `${this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX}${galleryId}`;
                let userList = [...this.#state.sessionCache.userMap.entries()].map(([key, data]) =>
                                                                                   [key, data.firstSeen, data.lastSeen, data.postCount]);
                await GM_setValue(cacheKey, userList);
                this.#state.sessionCache.isDirty = false;
                this.#utils.log('CacheSave', `[스로틀링] 정리 없이 캐시 저장만 수행 (${userList.length}개)`);
                return;
            }

            this.#utils.log('CachePruning', `캐시 정리 작업 시작... (마지막 정리 후 ${PRUNING_INTERVAL_HOURS}시간 이상 경과)`);

            let updatedUserList = [...this.#state.sessionCache.userMap.entries()].map(([key, data]) =>
                                                                                      [key, data.firstSeen, data.lastSeen, data.postCount]);

            const expirationDays = await GM_getValue(
                this.#config.CONSTANTS.CACHE_EXPIRATION_DAYS_KEY,
                this.#config.CONSTANTS.DEFAULT_CACHE_EXPIRATION_DAYS
            );

            const GENERAL_EXPIRATION_SECONDS = expirationDays * 24 * 60 * 60;
            const LOW_ACTIVITY_EXPIRATION_SECONDS = this.#config.CONSTANTS.LOW_ACTIVITY_EXPIRATION_HOURS * 60 * 60;
            const LOW_ACTIVITY_POST_THRESHOLD = this.#config.CONSTANTS.LOW_ACTIVITY_POST_THRESHOLD;

            const initialSize = updatedUserList.length;
            let finalUserList = updatedUserList.filter(user => {
                const lastSeen = user[2];
                const postCount = user[3];
                const timeSinceLastSeen = now - lastSeen;

                if (postCount < LOW_ACTIVITY_POST_THRESHOLD && timeSinceLastSeen > LOW_ACTIVITY_EXPIRATION_SECONDS) {
                    return false;
                }
                if (timeSinceLastSeen > GENERAL_EXPIRATION_SECONDS) {
                    return false;
                }
                return true;
            });
            this.#utils.log('CachePruning', `정리 결과: ${initialSize}명 -> ${finalUserList.length}명`);

            const MAX_CACHE_SIZE = this.#config.CONSTANTS.KNOWN_USERS_CACHE_SIZE;
            if (finalUserList.length > MAX_CACHE_SIZE) {
                finalUserList.sort((a, b) => b[2] - a[2]);
                finalUserList = finalUserList.slice(0, MAX_CACHE_SIZE);
            }

            const cacheKey = `${this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX}${galleryId}`;
            await GM_setValue(cacheKey, finalUserList);
            await GM_setValue(lastPruningTimeKey, now);

            this.#state.sessionCache.isDirty = false;
            this.#utils.log('CachePruning', `캐시 정리 및 저장 완료 (${finalUserList.length}개)`);
        }

        async runAnalysis() {
            this.#uiManager.injectUserSearchUI(this._handleUserSearchRequest.bind(this));
            this.#utils.log('Analysis', '분석 실행.');
            const postRows = this.#uiManager.getPostRows();
            const box = this.#uiManager.getOrCreateAnalysisBox();

            if (postRows.length === 0 || !this.#state.isBoxVisible) {
                this.#utils.log('Analysis', '분석할 게시물이 없거나 박스가 숨김 상태이므로 종료합니다.');
                if (box) box.style.display = 'none';
                return;
            }

            if(box) box.style.display = 'block';

            this.#uiManager.applyInitialExpandState();

            const stats = this.#calculator.calculate(postRows);
            if (!stats) return this.#utils.log('Analysis', '통계 계산 결과가 없어 종료합니다.');

            this.#state.lastCalculatedStats = stats;
            this.#state.tableAnchorElement ??= postRows[0]?.closest('table');
            this.#uiManager.renderAnalysisBox(stats);

            if (this.#state.isCacheHighlightEnabled) {
                await this.#highlightNewUsers(postRows);
            }

            if (this.#state.isBoxMovedByUser && this.#state.userBoxPosition) {
                const {
                    top,
                    left
                } = this.#state.userBoxPosition;
                box.style.top = top;
                box.style.left = left;
            } else {
                this.#uiManager.repositionBox();
            }
        }

        async fetchAISummary() {
            this.#utils.log('AI Summary', 'AI 요약 요청 시작.');
            if (!this.#state.geminiApiKey) {
                return this.#modalManager.show(this.#getAPIKeyGuidanceHTML(), {
                    modalType: 'summary',
                    title: 'AI 요약 - API 키 필요',
                    footerContent: this.#getAPIKeyInputFooterHTML(),
                    onFooterMount: (modal) => {
                        modal.querySelector('#gallscopeApiKeySaveBtn')
                            .addEventListener('click', () => this.#handleApiKeySave(modal));
                        modal.querySelector('#gallscopeApiKeyInput')
                            .addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') this.#handleApiKeySave(modal);
                        });
                    }
                });
            }
            this.#modalManager.show(`<p>Gemini AI (${this.#state.selectedGeminiModel}) 요약을 생성 중입니다... 잠시만 기다려주세요.</p><small>결과가 나오기까지 다소 시간이 소요될 수 있습니다.</small>`);

            const postRows = this.#uiManager.getPostRows();
            const postsData = postRows.slice(0, 50).map(tr => this.#calculator.getPostData(tr)).filter(p => p?.post_no);
            if (postsData.length === 0) return this.#modalManager.show('<p>요약할 게시글이 없습니다.</p>');

            const prompt = this.#promptBuilder.createSummaryPrompt(postsData);
            try {
                const data = await this.#_fetchGeminiWithRetries(prompt, this.#state.selectedGeminiModel, this.#state.geminiApiKey);
                this.#modalManager.renderSummary(data);
            } catch (error) {
                this.#modalManager.show(`<p style="color:red;">Gemini AI 요약 요청 중 오류가 발생했습니다: ${error.error?.message ?? 'Unknown error'}</p>`);
            }
        }

        async #_fetchGeminiWithRetries(prompt, model, apiKey, options = {}) {
            for (let i = 0; i < this.#config.API.API_MAX_RETRIES; i++) {
                try {
                    const data = await this.#apiClient.fetchGeminiAPI(prompt, model, apiKey, options);
                    if (data.error?.code === 503) throw data;
                    return data;
                } catch (error) {
                    const isRetryable = error.error?.code === 503 || error.message?.includes('Malformed') || error.message?.includes('Invalid JSON');
                    if (isRetryable && i < this.#config.API.API_MAX_RETRIES - 1) {
                        const waitTime = (i + 1) * this.#config.API.API_RETRY_BACKOFF_SECONDS;
                        this.#modalManager.show(`<p>AI 서버 응답 오류. ${waitTime}초 후 재시도... (${i + 1}/${this.#config.API.API_MAX_RETRIES})</p>`);
                        await this.#utils.sleep(waitTime * 1000);
                    } else {
                        throw error;
                    }
                }
            }
        }

        async fetchAndRenderAISentiment() {
            this.#utils.log('AI Sentiment', 'AI 감정 분석 요청 시작.');
            if (!this.#state.geminiApiKey) {
                return this.#modalManager.show(this.#getAPIKeyGuidanceHTML(), {
                    modalType: 'summary',
                    title: 'AI 측정 - API 키 필요',
                    footerContent: this.#getAPIKeyInputFooterHTML(),
                    onFooterMount: (modal) => {
                        modal.querySelector('#gallscopeApiKeySaveBtn')
                            .addEventListener('click', () => this.#handleApiKeySave(modal));
                        modal.querySelector('#gallscopeApiKeyInput')
                            .addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') this.#handleApiKeySave(modal);
                        });
                    }
                });
            }

            this.#state.isAIFetching = true;
            this.#uiManager.renderAnalysisBox(this.#state.lastCalculatedStats);

            const postsForSentiment = this.#uiManager.getPostRows()
            .map(tr => this.#calculator.getPostData(tr)).filter(Boolean)
            .map(p => ({
                title: p.title,
                views: parseInt(p.views, 10),
                reco: parseInt(p.reco, 10)
            }));

            if (postsForSentiment.length === 0) {
                this.#state.isAIFetching = false;
                this.#uiManager.renderAnalysisBox(this.#state.lastCalculatedStats);
                return alert('분석할 게시글이 없습니다.');
            }

            const prompt = this.#promptBuilder.createSentimentAnalysisPrompt(postsForSentiment, this.#config.CONSTANTS.SENTIMENT_TYPES);
            const sentimentSchema = {
                type: 'object',
                properties: {
                    'results': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                'title': {
                                    type: 'string'
                                },
                                'sentiment': {
                                    type: 'string',
                                    enum: Object.values(this.#config.CONSTANTS.SENTIMENT_TYPES)
                                }
                            },
                            required: ['title', 'sentiment']
                        }
                    }
                },
                required: ['results']
            };

            try {
                const response = await this.#_fetchGeminiWithRetries(prompt, this.#state.selectedGeminiModel, this.#state.geminiApiKey, {
                    mimeType: 'application/json',
                    schema: sentimentSchema
                });
                const analysisResult = JSON.parse(response.candidates?.[0]?.content?.parts?.[0]?.text);

                if (analysisResult?.results) {
                    const newStats = this.#calculator.updateStatsWithSentiment(this.#state.lastCalculatedStats, analysisResult);
                    this.#state.lastCalculatedStats = newStats;
                    this.#logSentimentAnalysisDetails(analysisResult, newStats);
                } else {
                    throw new Error("AI 분석 결과가 비어있거나 'results' 속성이 없습니다.");
                }
            } catch (finalError) {
                this.#utils.log('AI Sentiment', '최종 오류가 발생했습니다:', finalError);
                alert('AI 감정 분석에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.');
            } finally {
                this.#state.isAIFetching = false;
                this.#uiManager.renderAnalysisBox(this.#state.lastCalculatedStats);
            }
        }

        #logSentimentAnalysisDetails(analysisResult, stats) {
            console.groupCollapsed(`[Gallscope] AI Sentiment Analysis Log (${this.#utils.getFormattedTimestamp()})`);
            const items = {
                positive: [],
                negative: [],
                neutral: []
            };
            analysisResult.results.forEach(item => {
                if (items[item.sentiment]) items[item.sentiment].push(item.title);
            });
            ['positive', 'negative', 'neutral'].forEach(type => {
                const count = stats[`ai${type.charAt(0).toUpperCase() + type.slice(1)}Count`];
                if (count > 0) {
                    const color = type === 'positive' ? '#19e650' : type === 'negative' ? '#dc3545' : '#62a2e3';
                    console.log(`%c--- ${type.toUpperCase()} (${count}개) ---`, `color: ${color}; font-weight: bold;`);
                    items[type].forEach(title => console.log(title));
                }
            });
            console.groupEnd();
        }

        async fetchAndAnalyzeMultiplePages(startPage, endPage, generateGraph = false) {
            this.#utils.log('MultiPage', `스코프 확장 분석 시작: ${startPage}~${endPage} 페이지, 그래프: ${generateGraph}`);
            this.#uiManager.initMultiPageProgressUI();

            const totalPages = endPage - startPage + 1;
            const pagesToFetch = Array.from({
                length: totalPages
            }, (_, i) => startPage + i);
            const results = {
                allPostRows: [],
                gpiScores: [],
                graphData: [],
                failedPages: []
            };

            try {
                await this.#_runMultiPageAnalysisWorkflow(pagesToFetch, results);
                this.#_finalizeMultiPageAnalysis(results, startPage, endPage, generateGraph);
            } catch (error) {
                console.error('[Gallscope] 스코프 확장 분석 중 심각한 오류 발생:', error);
                await this.#uiManager.finalizeMultiPageProgressUI('분석 중 오류가 발생했습니다.', 3000);
                this.runAnalysis();
            }
        }

        async #_runMultiPageAnalysisWorkflow(pagesToFetch, results) {
            const galleryId = new URLSearchParams(window.location.search).get('id');
            const baseUrl = window.location.href.split('?')[0];

            for (let i = 0; i < pagesToFetch.length; i += this.#config.CONSTANTS.MULTI_PAGE_FETCH_CHUNK_SIZE) {
                const chunk = pagesToFetch.slice(i, i + this.#config.CONSTANTS.MULTI_PAGE_FETCH_CHUNK_SIZE);
                const pageResults = await Promise.all(
                    chunk.map(page => this.#_fetchAndParsePage(baseUrl, galleryId, page, true))
                );

                pageResults.forEach(result => this.#_processMultiPageChunkResult(result, results));
                this.#uiManager.updateMultiPageProgressUI(((i + chunk.length) / pagesToFetch.length) * 100);
            }
        }

        async #_fetchAndParsePage(baseUrl, galleryId, pageNum, forGraph) {
            const url = `${baseUrl}?id=${galleryId}&page=${pageNum}`;
            try {
                const res = await new Promise((resolve, reject) => GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    timeout: this.#config.CONSTANTS.MULTI_PAGE_FETCH_TIMEOUT_MS,
                    onload: res => resolve(res),
                    onerror: err => reject(err),
                    ontimeout: () => reject(new Error('Timeout'))
                }));

                if (res.status !== 200) throw new Error(`HTTP status ${res.status}`);

                const parser = new DOMParser();
                const doc = parser.parseFromString(res.responseText, "text/html");
                const postRows = [...doc.querySelectorAll(this.#config.SELECTORS.POST_ROW)].filter(tr => !this.#uiManager.isNoticeRow(tr));

                if (postRows.length === 0) return {
                    page: pageNum,
                    status: 'success_empty',
                    postRows: []
                };

                const pageStats = this.#calculator.calculate(postRows);
                let graphDataPoint = null;
                if (forGraph && pageStats?.speed?.lastPostTime) {
                    graphDataPoint = {
                        page: pageNum,
                        timestamp: pageStats.speed.lastPostTime,
                        fixedNickRatio: pageStats.fixedPostRatio,
                        gpi: pageStats.gpi,
                        normalizedGpi: pageStats.normalizedGpi,
                        ppm: pageStats.speed.insufficientData ? 0 : pageStats.speed.ppm
                    };
                }

                return {
                    page: pageNum,
                    status: 'success',
                    postRows,
                    gpiScore: pageStats.gpi,
                    graphDataPoint
                };
            } catch (error) {
                return {
                    page: pageNum,
                    status: 'failed',
                    error
                };
            }
        }

        #_processMultiPageChunkResult(result, aggregatedResults) {
            if (result.status === 'success') {
                aggregatedResults.allPostRows.push(...result.postRows);
                if (result.gpiScore !== undefined) aggregatedResults.gpiScores.push(result.gpiScore);
                if (result.graphDataPoint) aggregatedResults.graphData.push(result.graphDataPoint);
            } else if (result.status !== 'success_empty') {
                aggregatedResults.failedPages.push({
                    page: result.page,
                    reason: result.error.message
                });
            }
        }

        #_finalizeMultiPageAnalysis(results, startPage, endPage, generateGraph) {
            const {
                allPostRows,
                gpiScores,
                graphData,
                failedPages
            } = results;
            const totalPages = endPage - startPage + 1;
            const successfulPages = totalPages - failedPages.length;

            if (allPostRows.length === 0) {
                this.#uiManager.finalizeMultiPageProgressUI(`${startPage}~${endPage} 페이지에서 분석 가능한 게시물을 찾지 못했습니다.`, 3000);
                return this.runAnalysis();
            }

            const expandedStats = this.#calculator.calculate(allPostRows);
            if (gpiScores.length > 0) {
                const avgGpi = gpiScores.reduce((sum, score) => sum + score, 0) / gpiScores.length;
                expandedStats.gpi = avgGpi;
                expandedStats.gpiStage = this.#calculator.getGpiStage(avgGpi);
                expandedStats.normalizedGpi = this.#calculator.normalizeGpi(avgGpi);
                expandedStats.isGpiAveraged = true;
            }

            const previousAIStats = {};
            if (this.#state.lastCalculatedStats.aiSentimentStage !== -1) {
                const aiKeys = [
                    'aiSentimentStage', 'aiChaosIndex', 'aiPolarizationFactor', 'aiSentimentSummary',
                    'aiPositiveRatio', 'aiNegativeRatio', 'aiNeutralRatio',
                    'aiPositiveCount', 'aiNegativeCount', 'aiNeutralCount',
                    'positive_titles', 'negative_titles', 'neutral_titles'
                ];
                aiKeys.forEach(key => {
                    if (this.#state.lastCalculatedStats[key] !== undefined) {
                        previousAIStats[key] = this.#state.lastCalculatedStats[key];
                    }
                });
            }

            Object.assign(expandedStats, previousAIStats);

            expandedStats.healthStage = this.#calculator.calculateHealthStage_WeightedAverage(
                expandedStats.gpiStage,
                expandedStats.fixedNickRatioStage,
                expandedStats.aiSentimentStage ?? -1
            );

            expandedStats.scopeLabel = `${startPage}-${endPage}p`;

            this.#state.lastCalculatedStats = expandedStats;
            this.#uiManager.renderAnalysisBox(expandedStats);

            const finalMsg = failedPages.length > 0 ? `${successfulPages}/${totalPages} 페이지 분석 완료 (일부 실패)` : '분석 완료!';
            this.#uiManager.finalizeMultiPageProgressUI(finalMsg, failedPages.length > 0 ? 2000 : 1000);

            if (generateGraph && graphData.length > 1) {
                graphData.sort((a, b) => a.timestamp - b.timestamp);
                this.#modalManager.showGraph(graphData);
            } else if (generateGraph) {
                alert(`그래프를 생성하기에는 유효한 데이터가 부족합니다.`);
            }
        }

        async #runCacheMigration() { // 2.1.0 부터 삭제할 것
            const OLD_CACHE_PREFIX = 'gallscope_known_users_v2_lru';
            const NEW_CACHE_PREFIX = this.#config.CONSTANTS.KNOWN_USERS_CACHE_PREFIX;

            const migratedFlagKey = 'gallscope_cache_migrated_to_v3';
            const migrated = await GM_getValue(migratedFlagKey, false);
            if (migrated) return;

            this.#utils.log('CacheMigration', '이전 버전 캐시 마이그레이션을 시작합니다...');
            const allKeys = await GM_listValues();
            const oldCacheKeys = allKeys.filter(key => key.startsWith(OLD_CACHE_PREFIX));

            if (oldCacheKeys.length === 0) {
                await GM_setValue(migratedFlagKey, true);
                this.#utils.log('CacheMigration', '마이그레이션할 이전 캐시가 없습니다.');
                return;
            }

            const now_seconds = Math.floor(Date.now() / 1000);

            for (const oldKey of oldCacheKeys) {
                try {
                    const oldCacheObjects = await GM_getValue(oldKey, []);
                    if (oldCacheObjects.length > 0 && typeof oldCacheObjects[0] === 'object' && oldCacheObjects[0] !== null) {
                        const newCacheArray = oldCacheObjects.map(obj => [
                            obj.key,
                            Math.floor(obj.ts / 1000),
                            now_seconds,
                            1
                        ]);

                        const newKey = oldKey.replace(OLD_CACHE_PREFIX, NEW_CACHE_PREFIX);
                        await GM_setValue(newKey, newCacheArray);
                        await GM_deleteValue(oldKey);
                        this.#utils.log('CacheMigration', `${oldKey} -> ${newKey} 마이그레이션 완료 (${newCacheArray.length}개 항목)`);
                    } else {
                        await GM_deleteValue(oldKey);
                    }
                } catch (e) {
                    console.error(`[Gallscope] 캐시 마이그레이션 중 오류 발생 (${oldKey}):`, e);
                }
            }

            await GM_setValue(migratedFlagKey, true);
            this.#utils.log('CacheMigration', '모든 캐시 마이그레이션이 완료되었습니다.');
        }

        async fetchAndDisplayUserPostsInScope(targetUserInfo, startPage, endPage) {
            if (!targetUserInfo?.filterKey || !targetUserInfo.displayName) {
                alert("사용자 정보가 올바르지 않아 분석을 시작할 수 없습니다.");
                return;
            }

            try {
                targetUserInfo.displayName = decodeURIComponent(targetUserInfo.displayName);
            } catch (e) {
                this.#utils.log('UserScope', `DisplayName 디코딩 실패: ${targetUserInfo.displayName}`, e);
            }

            const idPart = targetUserInfo.filterKey.split(':').pop();
            const titleDisplay = (targetUserInfo.displayName.toLowerCase() !== idPart.toLowerCase()) ?
                  `${targetUserInfo.displayName}(${idPart})` :
            targetUserInfo.displayName;

            const finalTargetUserInfo = {
                ...targetUserInfo,
                titleDisplay,
            };

            this.#utils.log('UserScope', `유저 스코프 확장 분석 시작. 유저: ${finalTargetUserInfo.titleDisplay}, 범위: ${startPage}-${endPage}`);
            this.#modalManager.showUserPosts(finalTargetUserInfo, [], startPage, endPage, true);

            const allPosts = [];
            const failedPages = [];
            const analysisTimeout = new Promise((_, reject) =>
                                                setTimeout(() => reject(new Error('USER_POST_ANALYSIS_TIMEOUT')), this.#config.CONSTANTS.MULTI_PAGE_ANALYSIS_TIMEOUT_MS)
                                               );

            try {
                const analysisPromise = this.#_runUserPostFetchWorkflow(finalTargetUserInfo, startPage, endPage, allPosts, failedPages);
                await Promise.race([analysisPromise, analysisTimeout]);
            } catch (error) {
                if (error.message === 'USER_POST_ANALYSIS_TIMEOUT') {
                    alert(`유저 글 분석 시간이 너무 오래 걸려 중단되었습니다.`);
                } else {
                    alert('분석 중 예상치 못한 오류가 발생했습니다.');
                    console.error('[Gallscope] User post analysis error:', error);
                }
            } finally {
                if (failedPages.length > 0) {
                    this.#utils.log('UserScope', `분석 실패 페이지 (${failedPages.length}개):`, failedPages);
                }
                this.#modalManager.showUserPosts(finalTargetUserInfo, allPosts.sort((a, b) => b.post_no - a.post_no), startPage, endPage, false);
            }
        }

        async #_runUserPostFetchWorkflow(targetUserInfo, startPage, endPage, allPosts, failedPages) {
            const galleryId = new URLSearchParams(window.location.search).get('id');
            if (!galleryId) {
                failedPages.push({
                    page: 'N/A',
                    reason: '갤러리 ID를 찾을 수 없음'
                });
                return;
            }
            const baseUrl = window.location.href.split('?')[0];
            const pagesToFetch = Array.from({
                length: endPage - startPage + 1
            }, (_, i) => startPage + i);
            let processedPageCount = 0;

            for (let i = 0; i < pagesToFetch.length; i += this.#config.CONSTANTS.MULTI_PAGE_FETCH_CHUNK_SIZE) {
                if (allPosts.length >= this.#config.CONSTANTS.MAX_USER_POSTS_TO_DISPLAY) {
                    this.#utils.log('UserScope', '최대 게시물 수 도달, 검색 조기 종료.');
                    break;
                }

                const chunk = pagesToFetch.slice(i, i + this.#config.CONSTANTS.MULTI_PAGE_FETCH_CHUNK_SIZE);
                const pagePromises = chunk.map(pageNum =>
                                               this.#_fetchAndParsePage(baseUrl, galleryId, pageNum, false)
                                               .catch(err => ({
                    page: pageNum,
                    status: 'failed',
                    error: err
                }))
                                              );

                const chunkResults = await Promise.all(pagePromises);

                for (const result of chunkResults) {
                    processedPageCount++;
                    if (result.status === 'success') {
                        const foundOnPage = result.postRows
                        .filter(tr => this.#calculator.getWriterInfo(tr)?.key === targetUserInfo.filterKey)
                        .map(tr => this.#calculator.getPostData(tr)).filter(Boolean);
                        allPosts.push(...foundOnPage);
                    } else if (result.status !== 'success_empty') {
                        failedPages.push({
                            page: result.page,
                            reason: result.error?.message || 'Unknown error'
                        });
                    }
                }

                const progressPercent = (processedPageCount / pagesToFetch.length) * 100;
                const modalContent = this.#state.userPostsModalElement?.querySelector('.modal-content p:first-child');
                if (modalContent) {
                    modalContent.textContent = `게시물을 불러오는 중... (${Math.round(progressPercent)}%)`;
                }
            }
        }

        async analyzeUserWithAI(targetUserInfo, postTitles) {
            this.#utils.log('AI User Analysis', `분석 요청. 유저: ${targetUserInfo.displayName}, 게시글 수: ${postTitles.length}`);
            if (!this.#state.geminiApiKey) return alert('Gemini API 키를 먼저 설정해야 합니다.');
            if (postTitles.length < 5) return alert('분석할 게시글이 너무 적습니다. (최소 5개 필요)');

            this.#modalManager.showAIUserAnalysis(targetUserInfo, '', true);
            const prompt = this.#promptBuilder.createAIPersonalityPrompt(postTitles);

            try {
                const response = await this.#apiClient.fetchGeminiAPI(prompt, this.#state.selectedGeminiModel, this.#state.geminiApiKey);
                const analysisText = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (analysisText) {
                    this.#modalManager.showAIUserAnalysis(targetUserInfo, analysisText.trim());
                } else {
                    const errorMessage = response.error ? `API 오류: ${response.error.message}` : 'AI로부터 유효한 응답을 받지 못했습니다.';
                    this.#modalManager.showAIUserAnalysis(targetUserInfo, `분석에 실패했습니다.\n\n${errorMessage}`);
                }
            } catch (error) {
                this.#modalManager.showAIUserAnalysis(targetUserInfo, `분석 중 오류가 발생했습니다.\n\n${error.message}`);
            }
        }

        #getAPIKeyGuidanceHTML() {
            return `<div class="api-key-guidance"><p style="color:red;"><strong>Gemini API 키가 설정되지 않았습니다.</strong></p><p>스크립트를 사용하려면 API 키가 필요합니다. 아래 절차에 따라 키를 발급받고 설정해주세요.</p><hr><h4>Gemini API 키 발급 및 설정 방법:</h4><ol><li>1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: #1e73be;">Google AI Studio(클릭)</a>에 접속하여 Google 계정으로 로그인합니다.</li><li>2. 'API 키 만들기(Create API key)' 버튼을 클릭합니다.</li><li>3. 새 프로젝트를 만들거나 기존 프로젝트를 선택하여 API 키를 생성합니다.</li><li>4. 생성된 API 키를 복사합니다.</li><li>5. 브라우저의 Tampermonkey 확장 프로그램 아이콘을 클릭합니다.</li><li>6. 현재 스크립트 이름 아래에 있는 <strong>'Gemini API 키 설정'</strong> 메뉴를 선택합니다.</li><li>7. 나타나는 입력창에 복사한 API 키를 붙여넣고 '확인'을 누릅니다.</li></ol><p>키 설정 후 다시 요약 버튼을 눌러주세요.</p></div>`;
        }
        #getAPIKeyInputFooterHTML() {
            return `
                <div style="width: 100%; display: flex; align-items: center; gap: 8px;">
                    <input type="text" id="gallscopeApiKeyInput" placeholder="여기에 Gemini API 키를 붙여넣으세요" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <button id="gallscopeApiKeySaveBtn" class="modal-confirm-btn" style="padding: 8px 12px;">저장</button>
                </div>
            `;
        }
        async #handleApiKeySave(modal) {
            const input = modal.querySelector('#gallscopeApiKeyInput');
            const saveBtn = modal.querySelector('#gallscopeApiKeySaveBtn');
            const newKey = input.value.trim();

            if (!newKey) {
                alert('API 키를 입력해주세요.');
                return;
            }

            try {
                await GM_setValue(this.#config.API.GEMINI_API_KEY_ID, newKey);

                this.#state.geminiApiKey = newKey;
                saveBtn.textContent = '저장됨!';
                saveBtn.disabled = true;
                input.disabled = true;
                alert('API 키가 성공적으로 저장되었습니다. 이제 AI 기능을 사용할 수 있습니다.');

                setTimeout(() => {
                    this.#modalManager.hide('summary');
                }, 1500);

            } catch (err) {
                console.error('[Gallscope] API 키 저장 실패:', err);
                alert('API 키 저장 중 오류가 발생했습니다.');
            }
        }
        #preloadResources() {
            const resource = {
                href: this.#config.ICON_URL,
                as: 'image'
            };
            if (document.querySelector(`link[rel="preload"][href="${resource.href}"]`)) return;
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
            this.#utils.log('Core', 'Essential resources preloaded.');
        }

        getTooltipContentProvider(stats) {
            const {
                STATUS_LEVELS
            } = this.#config;
            const {
                GPI_MIN_POST_THRESHOLD,
                GPI_NORMALIZATION_POINTS
            } = this.#config.CONSTANTS;
            const self = this;
            return {
                getHealthTooltipHTML: stats => {
                    const {
                        fixedNickRatioStage,
                        gpiStage,
                        healthStage,
                        aiSentimentStage,
                        aiNegativeRatio
                    } = stats;
                    const fixedStatus = STATUS_LEVELS[fixedNickRatioStage],
                          gpiStatus = STATUS_LEVELS[gpiStage],
                          healthStatus = STATUS_LEVELS[healthStage];
                    const aiStatusLine = (aiSentimentStage !== -1) ? `<p>AI 측정 농도: <strong>${STATUS_LEVELS[aiSentimentStage].tag}</strong> (단계 ${aiSentimentStage}, 부정 ${self.#utils.formatPercent(aiNegativeRatio)})</p>` : `<p>AI 측정 농도: <strong style="color: #999;">미측정</strong></p>`;
                    const weights = {
                        gpi: 0.5,
                        ai: 0.3,
                        fixedNick: 0.2
                    };
                    let calcHTML;
                    if (aiSentimentStage === -1) {
                        const totalW = weights.gpi + weights.fixedNick,
                              gpiW = (weights.gpi / totalW).toFixed(3),
                              fixedW = (weights.fixedNick / totalW).toFixed(3);
                        const score = (gpiStage * gpiW) + (fixedNickRatioStage * fixedW);
                        calcHTML = `<p style="margin-bottom: 5px;"><strong>종합 점수 계산 (가중치 재조정)</strong></p><small>(GPI ${gpiStage} × ${gpiW}) + (고정닉 ${fixedNickRatioStage} × ${fixedW}) = <strong>${score.toFixed(2)}점</strong></small><p style="margin-top:8px;">${score.toFixed(2)}점 → 반올림 → <strong>최종 ${healthStage}단계</strong></p>`;
                    } else {
                        const score = (gpiStage * weights.gpi) + (aiSentimentStage * weights.ai) + (fixedNickRatioStage * weights.fixedNick);
                        calcHTML = `<p style="margin-bottom: 5px;"><strong>종합 점수 계산</strong></p><small>(GPI ${gpiStage}×${weights.gpi}) + (AI ${aiSentimentStage}×${weights.ai}) + (고정닉 ${fixedNickRatioStage}×${weights.fixedNick}) = <strong>${score.toFixed(2)}점</strong></small><p style="margin-top:8px;">${score.toFixed(2)}점 → 반올림 → <strong>최종 ${healthStage}단계</strong></p>`;
                    }
                    return `<h4>갤러리 상태 판정 근거 ⓘ</h4><p>고정닉 농도: <strong>${fixedStatus.tag}</strong> (단계 ${fixedNickRatioStage})</p><p>갤 망령 지수(GPI): <strong>${gpiStatus.tag}</strong> (단계 ${gpiStage})</p>${aiStatusLine}<hr>${calcHTML}<hr><p><strong>최종 상태: ${healthStatus.tag}</strong> (단계 ${healthStage})</p>`;
                },
                getFixedNickInfoTooltipHTML: stats => {
                    const fixedNickStatus = STATUS_LEVELS[stats.fixedNickRatioStage];
                    const descText = stats.scopeLabel ? `${stats.scopeLabel} 범위 게시글 중 고정닉이<br>작성한 글의 비율을 나타냅니다.` : '현재 페이지 게시글 중 고정닉이<br>작성한 글의 비율을 나타냅니다.';
                    return `<h4>고정닉 농도 ⓘ</h4><p>${descText}</p><p><strong>현재 비율: ${self.#utils.formatPercent(stats.fixedPostRatio)}</strong> <span style="white-space: nowrap;">(상태: ${fixedNickStatus.tag}, 단계 ${stats.fixedNickRatioStage})</span></p><hr><p style="margin-bottom: 3px;"><strong>판정 기준 (고정닉 비율):</strong></p><small>45% 미만: <strong style="color:${STATUS_LEVELS[0].textColor};">${STATUS_LEVELS[0].tag}</strong><br>45% - 60%: <strong style="color:${STATUS_LEVELS[1].textColor};">${STATUS_LEVELS[1].tag}</strong><br>60% - 75%: <strong style="color:${STATUS_LEVELS[2].textColor};">${STATUS_LEVELS[2].tag}</strong><br>75% 이상: <strong style="color:${STATUS_LEVELS[3].textColor};">${STATUS_LEVELS[3].tag}</strong></small>`;
                },
                getGpiTooltipHTML: stats => {
                    const gpiStatus = STATUS_LEVELS[stats.gpiStage],
                          normGpiPercent = (stats.normalizedGpi * 100).toFixed(0);
                    let html = `<h4>갤 망령 지수 (GPI; Gallery Phantom Index) ⓘ</h4>`;
                    if (stats.isGpiAveraged) html += `<p>여러 페이지 분석 시, GPI는 각 페이지별 소수 유저의 게시글 집중도를 개별 계산한 후 평균낸 값입니다. 이를 통해 해당 구간의 <strong>평균적인 망령 농도</strong>를 보여줍니다.</p><hr><p><strong>상대적 집중도: 약 ${normGpiPercent}% 스케일</strong> <span style="white-space: nowrap;">(상태: ${gpiStatus.tag})</span></p><p><small style="display:block; margin-top:5px;">평균 GPI: ${stats.gpi.toFixed(4)}<br>계산식: (Σ 페이지별 GPI) / (총 페이지 수)</small></p>`;
                    else {
                        html += `<p>현재 페이지에서 소수 유저의 게시글 집중도를 나타냅니다. 높을수록 특정 유저들이 많은 글을 작성함을 의미합니다.</p><hr><p><strong>상대적 집중도: 약 ${normGpiPercent}% 스케일</strong> <span style="white-space: nowrap;">(상태: ${gpiStatus.tag})</span></p><p><small style="display:block; margin-top:5px;">현재 GPI: ${stats.gpi.toFixed(4)}<br>계산식: Σ ( (개별 유저 작성글 수 / 전체 글 수)²) </small></p>`;
                        if (stats.gpiScalingFactor < 1 && !stats.scopeLabel) html += `<hr><p style="margin-bottom: 3px;"><strong style="color: #fd7e14;">⚠️ 표본 부족 조정됨</strong></p><small>현재 총 게시글 수가 ${GPI_MIN_POST_THRESHOLD}개 미만으로 신뢰도가 낮아, 지수에 보정 가중치(${Math.round(stats.gpiScalingFactor * 100)}%)가 적용되었습니다.</small><small>보정 전 GPI: ${stats.originalGpi.toFixed(4)}</small>`;
                    }
                    html += `<hr><p style="margin: 8px 0 3px 0; font-size: 0.95em;"><strong>단계 판정 기준 (GPI 정규화 값):</strong></p><small>${(GPI_NORMALIZATION_POINTS[1].normalized * 100).toFixed(0)}% 미만: <strong style="color:${STATUS_LEVELS[0].textColor};">${STATUS_LEVELS[0].tag}</strong><br>${(GPI_NORMALIZATION_POINTS[1].normalized * 100).toFixed(0)}% ~ ${(GPI_NORMALIZATION_POINTS[2].normalized * 100).toFixed(0)}%: <strong style="color:${STATUS_LEVELS[1].textColor};">${STATUS_LEVELS[1].tag}</strong><br>${(GPI_NORMALIZATION_POINTS[2].normalized * 100).toFixed(0)}% ~ ${(GPI_NORMALIZATION_POINTS[3].normalized * 100).toFixed(0)}%: <strong style="color:${STATUS_LEVELS[2].textColor};">${STATUS_LEVELS[2].tag}</strong><br>${(GPI_NORMALIZATION_POINTS[3].normalized * 100).toFixed(0)}% 이상: <strong style="color:${STATUS_LEVELS[3].textColor};">${STATUS_LEVELS[3].tag}</strong></small>`;
                    return html;
                },
                getTopPostersTooltipHTML: stats => {
                    if (!stats.topPosters?.length) return `<h4>상세 작성자 정보</h4><p>2개 이상 작성자 없음</p>`;
                    const isLight = !self.#uiManager.isDarkMode();
                    let html = `<h4>상세 작성자 정보 (상위 ${stats.topPosters.length}명)</h4>`;
                    stats.topPosters.forEach(p => {
                        const dName = p.name.length > 35 ? `${p.name.substring(0,32)}...` : p.name;
                        let color = p.type === self.#config.CONSTANTS.USER_TYPES.FIXED ? (isLight ? '#CD853F' : '#FFD700') : (p.type === self.#config.CONSTANTS.USER_TYPES.SEMI ? (isLight ? '#2E8B57' : '#90EE90') : (isLight ? '#4682B4' : '#ADD8E6'));
                        html += `<p><strong style="color: ${color};">${self.#utils.escapeHtml(dName)}</strong> - ${p.count}개</p>`;
                    });
                    html += `<hr>${stats.otherMultiPostUserCount > 0 ? `<small>그 외 ${stats.otherMultiPostUserCount}명이 ${stats.otherMultiPostCount}개 작성</small>`:''}<small>(${stats.totalPostCount}개 중 ${stats.multiPostCount}개를 ${stats.multiPostUserCount}명이 작성)</small><hr><small style="display: block; text-align: right;">${self.#utils.getFormattedTimestamp()} by 갤스코프</small><small style="display: block; text-align: right;">${self.#uiManager.getGalleryName()} 갤러리</small>`;
                    return html;
                },
                getFixedNickDetailTooltipHTML: stats => `<h4>고정닉 농도 상세</h4><p>유동: <strong>${self.#utils.formatPercent(stats.guestPostRatio)}</strong> (${stats.guestPostCount}개)</p><p>반고닉: <strong>${self.#utils.formatPercent(stats.semiFixedPostRatio)}</strong> (${stats.semiFixedPostCount}개)</p><p>고정닉: <strong>${self.#utils.formatPercent(stats.fixedPostRatio)}</strong> (${stats.fixedPostCount}개)</p><hr><small>총 ${stats.totalPostCount}개 게시물 기준</small><hr><small style="display: block; text-align: right;">by 갤스코프</small><small style="display: block; text-align: right;">${self.#utils.getFormattedTimestamp()}</small><small style="display: block; text-align: right;">${self.#uiManager.getGalleryName()} 갤러리</small>`,
                getSpeedDetailTooltipHTML: stats => {
                    if (!stats.speed || stats.speed.insufficientData || !stats.speed.firstPostTime) return `<h4>글 리젠 속도 상세 정보 ⓘ</h4><p>시간 정보가 있는 게시물이 2개 미만이거나<br>시간 간격이 없어 속도를 계산할 수 없습니다.</p>`;
                    const {
                        ppm,
                        firstPostTime: first,
                        lastPostTime: last,
                        timeSpanInSeconds: span
                    } = stats.speed;
                    const pad = n => String(n).padStart(2, '0'),
                          fmtTime = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
                          fmtDate = d => `${pad(d.getMonth()+1)}/${pad(d.getDate())}`;
                    const sameDate = first.toDateString() === last.toDateString();
                    const firstDisp = sameDate ? fmtTime(first) : `${fmtDate(first)} ${fmtTime(first)}`,
                          lastDisp = sameDate ? fmtTime(last) : `${fmtDate(last)} ${fmtTime(last)}`;
                    const totalSec = Math.max(1, Math.round(span)),
                          spanFmt = `${Math.floor(totalSec/60)}분 ${totalSec%60}초`;
                    const avgInt = stats.totalPostCount > 1 ? span / (stats.totalPostCount - 1) : 0;
                    return `<h4>글 리젠 속도 상세 정보 ⓘ</h4><p><strong>분석된 시간:</strong><br>  ${firstDisp} ~ ${lastDisp} (${spanFmt})</p><p><strong>총 게시물 수:</strong> ${stats.totalPostCount}개</p><p><strong>평균 작성 간격:</strong> ${avgInt > 0 ? `${avgInt.toFixed(1)}초` : '계산 불가'}</p><hr><p><strong>계산식:</strong> ${stats.totalPostCount}개 / ${spanFmt} → 분당 ${ppm.toFixed(1)}개</p>`;
                },
                getAiInfoTooltipHTML: stats => {
                    if (stats.aiSentimentStage === -1) return `<h4>AI 측정 농도 ⓘ</h4><p>게시물 제목의 긍정/부정 감정을 분석하여<br>갤러리의 혼란 지수를 파악하는 지표입니다.</p><p>'측정 시작'을 눌러 분석을 진행해주세요.</p><hr><p style="margin-bottom: 3px;"><strong>판정 기준 (갤러리 혼란 지수):</strong></p><small>0.25 미만: <strong style="color:${STATUS_LEVELS[0].textColor};">${STATUS_LEVELS[0].tag}</strong><br>0.25 - 0.45: <strong style="color:${STATUS_LEVELS[1].textColor};">${STATUS_LEVELS[1].tag}</strong><br>0.45 - 0.65: <strong style="color:${STATUS_LEVELS[2].textColor};">${STATUS_LEVELS[2].tag}</strong><br>0.65 이상: <strong style="color:${STATUS_LEVELS[3].textColor};">${STATUS_LEVELS[3].tag}</strong></small>`;
                    return `<h4>AI 측정 농도 ⓘ</h4><p>갤러리의 부정적인 분위기와 분쟁 수준을<br>종합하여 위험도(혼란 지수)를 판정합니다.</p><hr><p style="margin-bottom: 3px;"><strong>갤러리 혼란 지수: ${stats.aiChaosIndex.toFixed(3)}</strong> (최종 ${stats.aiSentimentStage}단계)</p><small>계산식: 부정 비율 + (양극화 지수)<br>양극화 지수 = (긍정 비율) * (부정 비율) * 0.5<br><strong>${stats.aiNegativeRatio.toFixed(3)}</strong> + (<strong>${stats.aiPolarizationFactor.toFixed(3)}</strong>) = <strong>${stats.aiChaosIndex.toFixed(3)}</strong></small><hr><p style="margin-bottom: 3px;"><strong>판정 기준 (갤러리 혼란 지수):</strong></p><small>0.25 미만: <strong style="color:${STATUS_LEVELS[0].textColor};">${STATUS_LEVELS[0].tag}</strong><br>0.25 - 0.45: <strong style="color:${STATUS_LEVELS[1].textColor};">${STATUS_LEVELS[1].tag}</strong><br>0.45 - 0.65: <strong style="color:${STATUS_LEVELS[2].textColor};">${STATUS_LEVELS[2].tag}</strong><br>0.65 이상: <strong style="color:${STATUS_LEVELS[3].textColor};">${STATUS_LEVELS[3].tag}</strong></small>`;
                },
                getAiSentimentTooltipHTML: stats => {
                    if (stats.aiSentimentStage === -1) return `<h4>AI 측정 농도 상세</h4><p>'측정 시작' 버튼을 눌러 분석해주세요.</p>`;
                    const createList = (label, titles) => (!titles?.length) ? '' : `<div style="margin-top: 8px;"><p style="margin: 0 0 3px 0;"><strong>${label}:</strong></p><ul style="margin: 0; padding-left: 18px; font-size: 0.95em; list-style-type: disc;">${titles.map(t=>`<li>${self.#utils.escapeHtml(t)}</li>`).join('')}</ul></div>`;
                    const pList = createList('주요 긍정적 게시물', stats.positive_titles),
                          nList = createList('주요 부정적 게시물', stats.negative_titles);
                    return `<h4>AI 감정 분석 상세 데이터</h4><p style="margin-bottom: 8px;">긍정: <strong>${self.#utils.formatPercent(stats.aiPositiveRatio)} (${stats.aiPositiveCount}개)</strong><br>부정: <strong>${self.#utils.formatPercent(stats.aiNegativeRatio)} (${stats.aiNegativeCount}개)</strong><br>중립: <strong>${self.#utils.formatPercent(stats.aiNeutralRatio)} (${stats.aiNeutralCount}개)</strong></p>${(pList||nList)?'<hr>':''}${pList}${nList}<hr><small style="display: block; text-align: right;">${self.#utils.getFormattedTimestamp()} by 갤스코프</small><small style="display: block; text-align: right;">${self.#uiManager.getGalleryName()} 갤러리</small>`;
                },
            };
        }

        setupCopyButton(summaryText) {
            const copyBtn = document.getElementById('gallscopeCopyBtn');
            if (!copyBtn) return;
            copyBtn.style.display = 'block';
            copyBtn.textContent = '갤스코프 결과 복사';
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                const reportGenerator = new ReportGenerator(this.#config, this.#utils, this.#state.lastCalculatedStats, this.#uiManager.getGalleryName(), summaryText);
                const reportText = reportGenerator.generate();
                navigator.clipboard.writeText(reportText)
                    .then(() => {
                    copyBtn.textContent = '복사 완료!';
                    setTimeout(() => {
                        copyBtn.textContent = '갤스코프 결과 복사';
                    }, this.#config.CONSTANTS.COPY_SUCCESS_MESSAGE_DURATION);
                })
                    .catch(err => {
                    copyBtn.textContent = '복사 실패';
                    console.error('Gallscope: Failed to copy text: ', err);
                });
            };
        }
    }

    // --- Script Entry Point ---

    const config = {
        DEBUG_MODE: false,
        AI_SUMMARY_FEATURE_ENABLED: true,
        ICON_URL: 'https://i.imgur.com/JPUBQQd.png',
        CHARTJS_CDN_URL: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js',
        DRAG_EVENTS: {
            START: 'mousedown',
            MOVE: 'mousemove',
            END: 'mouseup'
        },

        API: {
            GEMINI_API_KEY_ID: 'GEMINI_API_KEY_DCIMON_V2',
            GEMINI_MODEL_ID: 'GEMINI_MODEL_DCIMON_V1',
            DEFAULT_GEMINI_MODEL: 'gemini-2.0-flash',
            AVAILABLE_MODELS: ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite-preview-06-17'],
            API_MAX_RETRIES: 3,
            API_RETRY_BACKOFF_SECONDS: 2,
        },

        SELECTORS: {
            POST_ROW: 'tr.ub-content.us-post',
            POST_NOTICE_NUM: 'td.gall_num',
            POST_SUBJECT: 'td.gall_subject',
            POST_WRITER: 'td.gall_writer',
            POST_TITLE: 'td.gall_tit.ub-word > a',
            POST_VIEWS: 'td.gall_count',
            POST_RECOMMEND: 'td.gall_recommend',
            POST_REPLY_NUM: 'a.reply_numbox',
            POST_ICON_IMG: 'em.icon_img',
            POST_DATE: 'td.gall_date',
            USER_POPUP_UL: 'ul.user_data_list',
        },

        UI: {
            SCOPE_BOX_ID: 'gallscopeBox',
            TOOLTIP_ID: 'gallscopeTooltip',
            AI_MODAL_ID: 'gallscopeAIModal',
            SCOPE_INPUT_MODAL_ID: 'gallscopeScopeInputModal',
            GRAPH_MODAL_ID: 'gallscopeGraphModal',
            USER_POSTS_MODAL_ID: 'gallscopeUserPostsModal',
            AI_USER_ANALYSIS_MODAL_ID: 'gallscopeAIUserAnalysisModal',
            AI_SUMMARY_BUTTON_ID: 'gallscopeAISummaryBtn',
            AI_ANALYSIS_BUTTON_ID: 'gallscopeAIAnaBtn',
            ANALYZE_USER_BUTTON_ID: 'gallscopeAnalyzeUserBtn',
            SCOPE_EXTENSION_MENU_ITEM_CLASS: 'gallscope-scope-extension-li',
            SCOPE_EXTENSION_MENU_ITEM_TEXT: '집중 스코프',
            GALLSCOPE_BOX_POSITION_ID: 'gallscopeBoxPosition',
            GALLSCOPE_BOX_EXPANDED_ID: 'gallscopeBoxExpanded',
            TOGGLE_BUTTON_ID: 'gallscope-toggle-btn',
            GALLSCOPE_BOX_VISIBILITY_ID: 'gallscopeBoxVisibility_v2',
            GALLSCOPE_TOGGLE_BUTTON_POSITION_ID: 'gallscopeToggleButtonPosition',
            NEW_USER_HIGHLIGHT_CLASS: 'gallscope-new-user-highlight',
        },

        CONSTANTS: {
            USER_TYPE_ICON: {
                SEMI_FIXED: 'nik.gif'
            },
            USER_TYPES: {
                FIXED: 'fixed',
                SEMI: 'semi',
                GUEST: 'guest',
                UNKNOWN: 'unknown'
            },
            SENTIMENT_TYPES: {
                POSITIVE: 'positive',
                NEGATIVE: 'negative',
                NEUTRAL: 'neutral'
            },
            GPI_MIN_POST_THRESHOLD: 25,
            MAX_SCOPE_PAGES_LIMIT: 200,
            MULTI_PAGE_FETCH_CHUNK_SIZE: 5,
            MULTI_PAGE_FETCH_CHUNK_DELAY: 300,
            COPY_SUCCESS_MESSAGE_DURATION: 2000,
            MULTI_PAGE_FETCH_RETRY_COUNT: 2,
            MULTI_PAGE_FETCH_TIMEOUT_MS: 8000,
            MULTI_PAGE_ANALYSIS_TIMEOUT_MS: 120000,
            MIN_PERCENT_FOR_TEXT_IN_BAR: 15,
            MAX_USER_POSTS_TO_DISPLAY: 200,
            GPI_NORMALIZATION_POINTS: [{
                gpi: 0.000,
                normalized: 0.00
            }, {
                gpi: 0.040,
                normalized: 0.25
            }, {
                gpi: 0.055,
                normalized: 0.50
            }, {
                gpi: 0.080,
                normalized: 0.75
            }, {
                gpi: 0.150,
                normalized: 1.00
            }, ],
            KNOWN_USERS_CACHE_PREFIX: 'gallscope_known_users_v2_lru',
            KNOWN_USERS_CACHE_SIZE: 10000,
            NEW_USER_HIGHLIGHT_THRESHOLD: 0.8,
            KNOWN_USERS_EXPIRATION_DAYS: 15,
            CACHE_HIGHLIGHT_ENABLED_KEY: 'gallscope_cache_highlight_enabled',
            CACHE_EXPIRATION_DAYS_KEY: 'gallscope_cache_expiration_days',
            DEFAULT_CACHE_EXPIRATION_DAYS: 15,
            LOW_ACTIVITY_POST_THRESHOLD: 5,
            LOW_ACTIVITY_EXPIRATION_HOURS: 48,
            LAST_PRUNING_TIME_PREFIX: 'gallscope_last_pruning_time_',
        },

        STATUS_LEVELS: [{
            tag: '양호',
            icon: '🟢',
            textColor: '#19e650'
        }, {
            tag: '주의',
            icon: '🟡',
            textColor: '#ffc107'
        }, {
            tag: '경계',
            icon: '🟠',
            textColor: '#fd7e14'
        }, {
            tag: '심각',
            icon: '🔴',
            textColor: '#dc3545'
        }],
        TEXTS: {
            REPORT_HEALTH_INTERPRETATIONS: [
                '매우 안정적이고 활발한 상태입니다.',
                '일부 소수 유저의 활동이 두드러지기 시작하는 단계입니다.',
                '소수 유저의 점유율이 높고, 잠재적인 분쟁 위험이 있습니다.',
                '갤러리가 소수 인원에 의해 주도되고 있으며, 매우 높은 주의가 필요합니다.'
            ],
            REPORT_GPI_INTERPRETATIONS: {
                high: '소수 유저의 글 점유율이 매우 높은 상태입니다.',
                mediumHigh: '소수 유저의 글 점유율이 다소 높은 편입니다.',
                medium: '소수 유저의 글 점유율이 보통 수준입니다.',
                low: '다양한 유저가 글을 작성하는 건강한 상태입니다.'
            },
            REPORT_AI_INTERPRETATIONS: [
                '긍정/부정 여론이 적고 안정적인 상태입니다.',
                '부정적 여론이 일부 존재하나, 대체로 안정적입니다.',
                '부정적 여론이 상당수 존재하며, 분쟁 가능성이 있습니다.',
                '부정적 여론이 지배적이며, 갤러리 분위기가 매우 혼란합니다.'
            ]
        }
    };

    const state = {
        geminiApiKey: '',
        selectedGeminiModel: config.API.DEFAULT_GEMINI_MODEL,
        analysisBoxElement: null,
        boxElements: null,
        tooltipElement: null,
        aiModalElement: null,
        scopeInputModalElement: null,
        tableAnchorElement: null,
        isBoxExpanded: false,
        isBoxMovedByUser: false,
        userBoxPosition: null,
        isBoxVisible: true,
        lastCalculatedStats: {},
        debounceTimers: {
            analysis: null,
            resize: null
        },
        isAIFetching: false,
        chartJsLoadPromise: null,
        graphModalElement: null,
        isUserSpecificScopeMode: false,
        currentUserScopeTarget: null,
        userPostsModalElement: null,
        wasDragging: false,
        cacheExpirationMenuId: null,
        dragStartX: 0,
        dragStartY: 0,
        sessionCache: null,
        aiUserAnalysisModalElement: null,
        isCacheHighlightEnabled: false,
    };

    const utils = {
        log: (context, ...messages) => {
            if (config.DEBUG_MODE) console.log(`[Gallscope]${context ? `[${context}]` : ''}`, ...messages);
        },
        formatPercent: n => `${(n * 100).toFixed(1)}%`,
        getFormattedTimestamp: () => new Date().toLocaleString('sv-SE').replace(' ', ' ').substring(0, 16).replace('T', ' '),
        maskWriterInfo: (fullName) => {
            const namePart = fullName.trim();
            const match = namePart.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
            const maskOctet = octetStr => (!octetStr) ? '' : (octetStr.length === 1) ? '*' : `${octetStr.slice(0, -1)}*`;
            const isTwoOctetIP = str => typeof str === 'string' && str.split('.').length === 2 && str.split('.').every(part => part.length > 0 && /^\d+$/.test(part));

            if (!match) {
                if (isTwoOctetIP(namePart)) {
                    const octets = namePart.split('.');
                    return `${maskOctet(octets[0])}.${maskOctet(octets[1])}`;
                }
                if (namePart.length <= 1) return namePart;
                return namePart.length === 2 ? `${namePart[0]}*` : namePart.substring(0, 2) + '*'.repeat(namePart.length - 2);
            }

            const [, name, id] = match;
            let maskedName = name.length <= 1 ? name : (name.length === 2 ? `${name[0]}*` : name.substring(0, 2) + '*'.repeat(name.length - 2));
            let maskedId;
            if (isTwoOctetIP(id)) {
                const octets = id.split('.');
                maskedId = `${maskOctet(octets[0])}.${maskOctet(octets[1])}`;
            } else {
                maskedId = id.length <= 3 ? id : id.substring(0, 3) + '*'.repeat(id.length - 3);
            }
            return `${maskedName} (${maskedId})`;
        },
        sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
        escapeHtml: text => {
            if (typeof text !== 'string') return text;
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        },
    };

    const gallscope = new Gallscope(
        config,
        state,
        utils,
        UIManager,
        StatisticsCalculator,
        ApiClient,
        TooltipManager,
        ModalManager
    );

    gallscope.init();
})();