// ==UserScript==
// @name         개념글 수동 등록 스크립트(모바일 웹)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  모바일 디시인사이드 게시글 하단에 '개념글 등록'과 '설정' 버튼을 추가합니다.
// @author       실고추
// @match        https://m.dcinside.com/board/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543220/%EA%B0%9C%EB%85%90%EA%B8%80%20%EC%88%98%EB%8F%99%20%EB%93%B1%EB%A1%9D%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%28%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%9B%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543220/%EA%B0%9C%EB%85%90%EA%B8%80%20%EC%88%98%EB%8F%99%20%EB%93%B1%EB%A1%9D%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%28%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EC%9B%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 기본 설정값 ---
    const DEFAULT_SETTINGS = {
        minRecomCount: 5,
        finalRecomCount: 100,
        useAllDecom: false,
        nonRecomTopics: ['30', '60'],
        useNonRecommDown: false,
        nonRecommDownCnt: 20,
        useVoteRecommend: false // '추천을 이용해 개념글로 등록' 기본값
    };

    // --- 유틸리티 함수 ---
    function getHiddenInputValue(name) {
        const input = document.querySelector(`input[name="${name}"]`);
        return (input && input.value) ? input.value : null;
    }

    // --- 설정 UI 생성 및 관리 ---
    async function setupSettingsUI() {
        let settings = JSON.parse(await GM_getValue('mobileConceptSettings', JSON.stringify(DEFAULT_SETTINGS)));

        const modalHTML = `
            <div id="gm-mobile-settings-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9998;"></div>
            <div id="gm-mobile-settings-modal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; border-radius:12px; box-shadow:0 5px 15px rgba(0,0,0,0.3); z-index:9999; width:90%; max-width:500px;">
                <h2 style="margin:0; padding: 15px 20px; font-size:17px; font-weight:bold; border-bottom:1px solid #eee;">개념글 등록 설정</h2>
                <div id="gm-mobile-settings-content" style="padding:20px; max-height: 70vh; overflow-y: auto;">
                    <div style="margin-bottom:15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                        <input type="checkbox" id="gm-use-vote" style="vertical-align:middle; width:18px; height:18px; accent-color: #3b71ca; border: 1px solid #adb5bd !important; appearance: checkbox !important; -webkit-appearance: checkbox !important;">
                        <label for="gm-use-vote" style="cursor:pointer; font-weight:bold; vertical-align:middle; font-size:15px;">추천을 이용해 개념글로 등록</label>
                        <p style="font-size:12px; color:#6c757d; margin-top:5px; margin-left:23px;">(이미 추천한 게시글에선 작동하지 않습니다.)</p>
                    </div>
                    <div style="margin-bottom:15px;">
                        <label for="gm-min-recom" style="display:block; margin-bottom:8px; font-weight:500; font-size:14px;">최소 추천 수 (5 ~ 100)</label>
                        <input type="number" id="gm-min-recom" min="5" max="100" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:16px;">
                    </div>
                    <div style="margin-bottom:15px;">
                        <label for="gm-final-recom" style="display:block; margin-bottom:8px; font-weight:500; font-size:14px;">최종 추천 수 (5 ~ 100)</label>
                        <input type="number" id="gm-final-recom" min="5" max="100" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:16px;">
                    </div>
                    <div style="margin-bottom:15px; border-top: 1px solid #eee; padding-top: 15px;">
                        <p style="display:block; margin-bottom:10px; font-weight:500; font-size:14px;">비추천 미사용 말머리 <span style="font-weight:normal; color:#6c757d;">(최대 3개)</span></p>
                        <div style="margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <input type="checkbox" id="gm-all-decom" style="vertical-align:middle; width:18px; height:18px; accent-color: #3b71ca; border: 1px solid #adb5bd !important; appearance: checkbox !important; -webkit-appearance: checkbox !important;">
                            <label for="gm-all-decom" style="cursor:pointer; font-weight:bold; vertical-align:middle; font-size:15px;">비추천 전체 활성화</label>
                        </div>
                        <div id="gm-topic-list" style="max-height:150px; overflow-y:auto; border:1px solid #eee; padding:10px; border-radius:8px;"></div>
                    </div>
                    <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
                        <div style="margin-bottom:10px;">
                            <input type="checkbox" id="gm-use-non-recom-down" style="vertical-align:middle; width:18px; height:18px; accent-color: #3b71ca; border: 1px solid #adb5bd !important; appearance: checkbox !important; -webkit-appearance: checkbox !important;">
                            <label for="gm-use-non-recom-down" style="cursor:pointer; font-weight:bold; vertical-align:middle; font-size:15px;">비추천으로 개념글 내리기 사용</label>
                        </div>
                        <div style="margin-bottom:15px;" id="gm-non-recom-down-cnt-wrapper">
                            <label for="gm-non-recom-down-cnt" style="display:block; margin-bottom:8px; font-weight:500; font-size:14px;">개념글 해제 비추천 수</label>
                            <input type="number" id="gm-non-recom-down-cnt" min="1" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:16px;">
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:10px; padding: 0 20px 20px 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <button id="gm-mobile-settings-close" style="flex:1; padding:12px; background:#6c757d; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">닫기</button>
                    <button id="gm-mobile-settings-save" style="flex:1; padding:12px; background:#3b71ca; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px; font-weight:bold;">저장</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('gm-mobile-settings-modal');
        const overlay = document.getElementById('gm-mobile-settings-overlay');
        const openSettingsButton = document.createElement('button');
        const useVoteCheckbox = document.getElementById('gm-use-vote');
        const allDecomCheckbox = document.getElementById('gm-all-decom');
        const topicListContainer = document.getElementById('gm-topic-list');
        const useNonRecommDownCheckbox = document.getElementById('gm-use-non-recom-down');
        const nonRecommDownCntWrapper = document.getElementById('gm-non-recom-down-cnt-wrapper');
        const nonRecommDownCntInput = document.getElementById('gm-non-recom-down-cnt');

        function toggleTopicList(disabled) {
            topicListContainer.style.opacity = disabled ? '0.5' : '1';
            topicListContainer.querySelectorAll('input').forEach(input => input.disabled = disabled);
        }
        function toggleNonRecomDownCnt(disabled) {
            nonRecommDownCntWrapper.style.opacity = disabled ? '0.5' : '1';
            nonRecommDownCntInput.disabled = disabled;
        }

        allDecomCheckbox.addEventListener('change', (e) => toggleTopicList(e.target.checked));
        useNonRecommDownCheckbox.addEventListener('change', (e) => toggleNonRecomDownCnt(!e.target.checked));

        openSettingsButton.type = 'button';
        openSettingsButton.className = 'btn-jusline-gray';
        openSettingsButton.innerText = '설정';

        openSettingsButton.onclick = () => {
            topicListContainer.innerHTML = '';
            const topicElements = document.querySelectorAll('select.mal-sel option');

            if (topicElements.length > 0) {
                topicElements.forEach(opt => {
                    if (opt.value === "0") return;
                    const isChecked = settings.nonRecomTopics.includes(opt.value);
                    topicListContainer.insertAdjacentHTML('beforeend', `<div style="margin-bottom:8px; font-size:15px;"><input type="checkbox" id="gm-mobile-topic-${opt.value}" value="${opt.value}" ${isChecked ? 'checked' : ''} style="width:16px; height:16px; vertical-align:middle; margin-right:5px; accent-color: #3b71ca; border: 1px solid #adb5bd !important; appearance: checkbox !important; -webkit-appearance: checkbox !important;"><label for="gm-mobile-topic-${opt.value}" style="cursor:pointer; vertical-align:middle;">${opt.innerText}</label></div>`);
                });
            } else {
                topicListContainer.innerText = '이 갤러리에는 말머리 기능이 없습니다.';
            }

            useVoteCheckbox.checked = settings.useVoteRecommend;
            document.getElementById('gm-min-recom').value = settings.minRecomCount;
            document.getElementById('gm-final-recom').value = settings.finalRecomCount;
            allDecomCheckbox.checked = settings.useAllDecom;
            useNonRecommDownCheckbox.checked = settings.useNonRecommDown;
            document.getElementById('gm-non-recom-down-cnt').value = settings.nonRecommDownCnt;
            toggleTopicList(settings.useAllDecom);
            toggleNonRecomDownCnt(!settings.useNonRecommDown);

            modal.style.display = 'block';
            overlay.style.display = 'block';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };
        document.getElementById('gm-mobile-settings-close').onclick = closeModal;
        overlay.onclick = closeModal;

        document.getElementById('gm-mobile-settings-save').onclick = async () => {
            const newMinRecom = parseInt(document.getElementById('gm-min-recom').value, 10);
            const newFinalRecom = parseInt(document.getElementById('gm-final-recom').value, 10);
            const newUseNonRecommDown = useNonRecommDownCheckbox.checked;
            const newNonRecommDownCnt = parseInt(document.getElementById('gm-non-recom-down-cnt').value, 10);

            if (isNaN(newMinRecom) || isNaN(newFinalRecom)) { alert('추천 수는 숫자여야 합니다.'); return; }
            if (newMinRecom < 5 || newMinRecom > 100 || newFinalRecom < 5 || newFinalRecom > 100) { alert('추천 수는 5에서 100 사이의 값이어야 합니다.'); return; }
            if (newMinRecom > newFinalRecom) { alert('최소 추천 수는 최종 추천 수보다 클 수 없습니다.'); return; }
            if (newUseNonRecommDown && (isNaN(newNonRecommDownCnt) || newNonRecommDownCnt < 1)) { alert('개념글 해제 비추천 수는 1 이상의 숫자여야 합니다.'); return; }

            const selectedTopics = Array.from(document.querySelectorAll('#gm-topic-list input:checked')).map(cb => cb.value);
            if (!allDecomCheckbox.checked && selectedTopics.length > 3) { alert('비추천 미사용 말머리는 최대 3개까지만 선택할 수 있습니다.'); return; }

            const newSettings = {
                useVoteRecommend: useVoteCheckbox.checked,
                minRecomCount: newMinRecom,
                finalRecomCount: newFinalRecom,
                useAllDecom: allDecomCheckbox.checked,
                nonRecomTopics: selectedTopics,
                useNonRecommDown: newUseNonRecommDown,
                nonRecommDownCnt: newNonRecommDownCnt
            };

            await GM_setValue('mobileConceptSettings', JSON.stringify(newSettings));
            settings = newSettings;
            alert('설정이 저장되었습니다.');
            closeModal();
        };

        return openSettingsButton;
    }

    // --- 메인 기능 실행 ---
    const tryAddButtonInterval = setInterval(async () => {
        const buttonArea = document.getElementById('view_btn_area');
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

        if (buttonArea && csrfToken) {
            clearInterval(tryAddButtonInterval);
            if (document.getElementById('gm-mobile-script-buttons')) return;

            try {
                const conKeyResponse = await fetch('https://m.dcinside.com/ajax/access', {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: 'token_verify=managerskill'
                });
                const conKeyResult = await conKeyResponse.json();
                if (!conKeyResult.result || !conKeyResult.Block_key) {
                    throw new Error('con_key(Block_key)를 받아오지 못했습니다. 매니저 권한이 있는지 확인해주세요.');
                }
                const conKey = conKeyResult.Block_key;

                const scriptButtonContainer = document.createElement('div');
                scriptButtonContainer.id = 'gm-mobile-script-buttons';
                scriptButtonContainer.className = 'btn-justify-area';
                scriptButtonContainer.style.marginTop = '8px';

                const settingsButton = await setupSettingsUI();
                const recommendButton = document.createElement('button');
                recommendButton.id = 'gm-mobile-concept-button';
                recommendButton.type = 'button';
                recommendButton.className = 'btn-jusline-inblue';
                recommendButton.innerText = '개념글 등록';
                recommendButton.style.color = '#4CAF50';
                recommendButton.style.borderColor = '#4CAF50';

                recommendButton.onclick = async function() {
                    const settings = JSON.parse(await GM_getValue('mobileConceptSettings', JSON.stringify(DEFAULT_SETTINGS)));
                    const galleryId = getHiddenInputValue('id');
                    const postNo = getHiddenInputValue('no');

                    if (!galleryId || !postNo) {
                        alert("개념글 등록에 필요한 기본 정보(id, no)를 찾지 못했습니다.");
                        return;
                    }

                    const recommendCountElement = document.querySelector(".reco-cnt");
                    if (recommendCountElement) {
                        const recommendCount = parseInt(recommendCountElement.innerText, 10);
                        if (recommendCount < settings.minRecomCount) {
                            alert(`추천 수가 ${settings.minRecomCount}개 미만(${recommendCount}개)이라 등록할 수 없습니다.`);
                            return;
                        }
                    }

                    if (document.querySelector("button[onclick*='recomm_rel']")) {
                        alert('이미 개념글로 등록된 게시물입니다.');
                        return;
                    }

                    if (!confirm(`[${postNo}] 게시글을 개념글로 등록하시겠습니까?`)) { return; }

                    try {
                        const setGalleryRecomRules = async (recomCount) => {
                            const payload = new URLSearchParams();
                            const useNonRecommValue = (settings.useAllDecom || settings.nonRecomTopics.length > 0) ? '1' : '0';
                            payload.append('recommCnt', recomCount);
                            payload.append('useNonRecomm', useNonRecommValue);
                            payload.append('useNonRecommDown', settings.useNonRecommDown ? '1' : '0');
                            payload.append('nonRecommDownCnt', settings.nonRecommDownCnt);
                            if (!settings.useAllDecom && useNonRecommValue === '1') {
                                settings.nonRecomTopics.forEach(topicId => payload.append('nonRecommendation[]', topicId));
                            }
                            const response = await fetch(`https://m.dcinside.com/management/minor/recomm/${galleryId}`, {
                                method: 'POST', headers: {'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest'}, body: payload
                            });
                            if (!response.ok) throw new Error(`추천수 설정(${recomCount}) 실패`);
                        };

                        await setGalleryRecomRules(settings.minRecomCount);

                        try {
                            if (settings.useVoteRecommend) {
                                // 추천으로 등록 방식 (기존 '조용한' 방식)
                                const votePayload = new URLSearchParams({ type: 'recommend_join', id: galleryId, no: postNo });
                                const voteResponse = await fetch('https://m.dcinside.com/ajax/recommend', {
                                    method: 'POST', headers: {'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest'}, body: votePayload
                                });
                                if (!voteResponse.ok) throw new Error('추천을 통한 개념글 등록 실패');
                            } else {
                                // 관리자 권한으로 등록 방식
                                const ctrlPayload = new URLSearchParams({ id: galleryId, no: postNo, con_key: conKey, type: 'recommend_join' });
                                const ctrlResponse = await fetch('https://m.dcinside.com/minor/manager-boardctrl', {
                                    method: 'POST', headers: {'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest'}, body: ctrlPayload
                                });
                                const ctrlResult = await ctrlResponse.json();
                                if (!ctrlResult.result) throw new Error(ctrlResult.cause || '알 수 없는 오류');
                            }
                        } catch (step2Error) {
                            console.error(`2단계(개념글 지정) 실패, 3단계를 계속 진행합니다: ${step2Error.message}`);
                        }

                        await setGalleryRecomRules(settings.finalRecomCount);

                        alert('개념글 등록이 완료되었습니다.\n페이지를 새로고침합니다.');
                        window.location.reload();

                    } catch (error) {
                        alert(`개념글 등록 요청 중 오류가 발생했습니다.\n\n${error.message}`);
                        console.log("오류가 발생하여 추천수 설정 복구를 시도합니다.");
                        await setGalleryRecomRules(settings.finalRecomCount);
                    }
                };

                scriptButtonContainer.appendChild(settingsButton);
                scriptButtonContainer.appendChild(recommendButton);
                buttonArea.after(scriptButtonContainer);

            } catch (error) {
                console.error('[개념글 등록 스크립트] 초기화 실패:', error.message);
            }
        }
    }, 500);
})();