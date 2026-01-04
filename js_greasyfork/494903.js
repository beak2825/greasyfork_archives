// ==UserScript==
// @name         Humoruniv Simple Blind
// @namespace    http://tampermonkey.net/
// @author       십갈
// @version      2.9
// @description  간편한 블라인드 강화 기능
// @match        https://web.humoruniv.com/*
// @exclude      https://web.humoruniv.com/board/humor/list.html?table=face*
// @exclude      https://web.humoruniv.com/board/humor/list.html?table=fashion*
// @exclude      https://web.humoruniv.com/cr/cr_list.html*
// @exclude      https://web.humoruniv.com/board/humor/report_ok.html?*
// @exclude      https://web.humoruniv.com/board/humor/cash_info.html?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/494903/Humoruniv%20Simple%20Blind.user.js
// @updateURL https://update.greasyfork.org/scripts/494903/Humoruniv%20Simple%20Blind.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Prevent the script from running in iframes
    if (window.self !== window.top) {
        return;
    }

    const memosKey = 'userMemos';
    const memoVisibilityKey = 'memoVisibility';
    let memos = GM_getValue(memosKey, []);
    let memoVisible = GM_getValue(memoVisibilityKey, true);
    let currentPage = 0;
    const memosPerPage = 5;

    // Create memo container
    const memoContainer = document.createElement('div');
    memoContainer.style.position = 'fixed';
    memoContainer.style.top = '10px';
    memoContainer.style.right = '10px';
    memoContainer.style.width = '200px';
    memoContainer.style.border = '1px solid #ccc';
    memoContainer.style.backgroundColor = '#f9f9f9';
    memoContainer.style.zIndex = '10000';
    memoContainer.style.padding = '10px';
    memoContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    memoContainer.style.maxHeight = '300px';
    memoContainer.style.overflow = 'auto';
    memoContainer.style.display = memoVisible ? 'block' : 'none';
    memoContainer.style.borderRadius = '8px';

    // Create memo input
    const memoInput = document.createElement('input');
    memoInput.type = 'text';
    memoInput.style.width = 'calc(100% - 22px)';
    memoInput.style.marginBottom = '10px';
    memoInput.style.border = '2px solid #007BFF'; // Blue border
    memoInput.style.backgroundColor = '#E9F7FF';  // Light blue background
    memoInput.style.padding = '5px';              // Add padding for better visibility
    memoInput.style.borderRadius = '4px';         // Rounded corners
    memoContainer.appendChild(memoInput);

    // Create add button
    const addButton = document.createElement('button');
    addButton.textContent = '추가';
    addButton.style.marginRight = '10px';
    addButton.style.padding = '5px 10px';
    addButton.style.backgroundColor = '#007BFF';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '14px';
    memoContainer.appendChild(addButton);

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = '삭제 저장';
    saveButton.style.padding = '5px 10px';
    saveButton.style.backgroundColor = '#28a745';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.fontSize = '14px';
    memoContainer.appendChild(saveButton);

    // Create hide button
    const hideButton = document.createElement('button');
    hideButton.textContent = '숨기기';
    hideButton.style.padding = '5px 10px';
    hideButton.style.backgroundColor = '#6c757d';
    hideButton.style.color = 'white';
    hideButton.style.border = 'none';
    hideButton.style.borderRadius = '4px';
    hideButton.style.cursor = 'pointer';
    hideButton.style.fontSize = '14px';
    memoContainer.appendChild(hideButton);

    // Create message display
    const messageDisplay = document.createElement('div');
    messageDisplay.style.color = 'red';
    messageDisplay.style.marginBottom = '10px';
    memoContainer.appendChild(messageDisplay);

    // Create memo list container
    const memoListContainer = document.createElement('div');
    memoContainer.appendChild(memoListContainer);

    // Create pagination controls
    const paginationControls = document.createElement('div');
    paginationControls.style.display = 'flex';
    paginationControls.style.justifyContent = 'space-between';
    paginationControls.style.alignItems = 'center'; // Align items vertically
    paginationControls.style.marginTop = '10px';

    const prevButton = document.createElement('button');
    prevButton.textContent = '<<<';
    prevButton.style.padding = '5px 10px';
    prevButton.style.backgroundColor = '#007BFF';
    prevButton.style.color = 'white';
    prevButton.style.border = 'none';
    prevButton.style.borderRadius = '4px';
    prevButton.style.cursor = 'pointer';
    prevButton.style.fontSize = '14px';
    prevButton.disabled = true;
    paginationControls.appendChild(prevButton);

    const pageIndicator = document.createElement('span');
    pageIndicator.style.fontSize = '14px';
    paginationControls.appendChild(pageIndicator);

    const nextButton = document.createElement('button');
    nextButton.textContent = '>>>';
    nextButton.style.padding = '5px 10px';
    nextButton.style.backgroundColor = '#007BFF';
    nextButton.style.color = 'white';
    nextButton.style.border = 'none';
    nextButton.style.borderRadius = '4px';
    nextButton.style.cursor = 'pointer';
    nextButton.style.fontSize = '14px';
    nextButton.disabled = true;
    paginationControls.appendChild(nextButton);

    memoContainer.appendChild(paginationControls);

    // Create show button
    const showButton = document.createElement('button');
    showButton.textContent = '블라인드';
    showButton.style.position = 'fixed';
    showButton.style.top = '10px';
    showButton.style.right = '10px';
    showButton.style.padding = '10px 20px';
    showButton.style.backgroundColor = '#28a745';
    showButton.style.color = 'white';
    showButton.style.border = 'none';
    showButton.style.borderRadius = '4px';
    showButton.style.cursor = 'pointer';
    showButton.style.fontSize = '14px';
    showButton.style.display = memoVisible ? 'none' : 'block';

    // Create memo count display
    const memoCountDisplay = document.createElement('span');
    memoCountDisplay.style.position = 'fixed';
    memoCountDisplay.style.top = '40px';
    memoCountDisplay.style.right = '10px';
    memoCountDisplay.style.padding = '2px 5px';
    memoCountDisplay.style.backgroundColor = '#dc3545';
    memoCountDisplay.style.color = 'white';
    memoCountDisplay.style.borderRadius = '4px';
    memoCountDisplay.style.fontSize = '12px';
    memoCountDisplay.style.display = memoVisible ? 'none' : 'block';
    memoCountDisplay.textContent = memos.length;

    document.body.appendChild(showButton);
    document.body.appendChild(memoContainer);
    document.body.appendChild(memoCountDisplay);

    const commentBlindContainer = document.createElement('div');
    commentBlindContainer.style.position = 'fixed';
    commentBlindContainer.style.bottom = '10px';
    commentBlindContainer.style.right = '10px';
    commentBlindContainer.style.width = '200px';
    commentBlindContainer.style.border = '1px solid #ccc';
    commentBlindContainer.style.backgroundColor = '#f9f9f9';
    commentBlindContainer.style.zIndex = '10000';
    commentBlindContainer.style.padding = '10px';
    commentBlindContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    commentBlindContainer.style.borderRadius = '8px';
    commentBlindContainer.innerHTML = `
            <button id="showAllButton" style="padding: 5px 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">모두 보기</button>
            <button id="hideAllButton" style="padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">모두 가리기</button>
        `;
    document.body.appendChild(commentBlindContainer);

    document.getElementById('showAllButton').addEventListener('click', showAll);
    document.getElementById('hideAllButton').addEventListener('click', hideAll);

    function updateMemoList() {
        memoListContainer.innerHTML = '';
        const start = currentPage * memosPerPage;
        const end = Math.min(start + memosPerPage, memos.length);
        const currentMemos = memos.slice(start, end);

        currentMemos.forEach((memo, index) => {
            const memoItem = document.createElement('div');
            memoItem.style.display = 'flex';
            memoItem.style.alignItems = 'center';
            memoItem.style.marginBottom = '5px';

            const memoCheckbox = document.createElement('input');
            memoCheckbox.type = 'checkbox';
            memoCheckbox.style.marginRight = '10px';
            memoCheckbox.style.zoom = 1.5;
            memoCheckbox.checked = true;
            memoCheckbox.addEventListener('change', () => {
                if (memoCheckbox.checked) {
                    memos[start + index] = memo;
                } else {
                    memos[start + index] = null;
                }
            });

            const memoText = document.createElement('span');
            memoText.textContent = memo;

            memoItem.appendChild(memoCheckbox);
            memoItem.appendChild(memoText);
            memoListContainer.appendChild(memoItem);
        });
    }

    function updatePaginationControls() {
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = (currentPage + 1) * memosPerPage >= memos.length;
        const totalPages = Math.max(1, Math.ceil(memos.length / memosPerPage));
        pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
    }

    function addMemo() {
        const newMemo = memoInput.value.trim(); // Use value instead of textContent
        if (newMemo === '') return;
        if (memos.includes(newMemo)) {
            if (checkboxClicked === true) {
                messageDisplay.textContent = '';
            } else {
                messageDisplay.textContent = '이미 등록된 사용자입니다.';
            }
        } else {
            messageDisplay.textContent = '';
            memos.unshift(newMemo);
            GM_setValue(memosKey, memos);
            updateMemoList();
            updatePaginationControls();
            applyFilter(); // Reapply filter to ensure new memos have the checkboxes
        }
        memoInput.value = '';
    }

    addButton.addEventListener('click', addMemo); // Pass function reference instead of calling it
    memoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addMemo();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateMemoList();
            updatePaginationControls();
        }
    });

    nextButton.addEventListener('click', () => {
        if ((currentPage + 1) * memosPerPage < memos.length) {
            currentPage++;
            updateMemoList();
            updatePaginationControls();
        }
    });

    saveButton.addEventListener('click', () => {
        memos = memos.filter(memo => memo !== null);
        GM_setValue(memosKey, memos);
        updateMemoList();
        updatePaginationControls();
        applyFilter();
        memoCountDisplay.textContent = memos.length;
    });

    hideButton.addEventListener('click', () => {
        memoContainer.style.display = 'none';
        showButton.style.display = 'block';
        memoCountDisplay.style.display = 'block';
        GM_setValue(memoVisibilityKey, false);
    });

    showButton.addEventListener('click', () => {
        memoContainer.style.display = 'block';
        showButton.style.display = 'none';
        memoCountDisplay.style.display = 'none';
        GM_setValue(memoVisibilityKey, true);
    });

    var checkboxClicked
    function applyFilter() {
        if (window.location.href.includes('https://web.humoruniv.com/user/blind_list.html')
            || ((window.location.href.includes('st=name') || window.location.href.includes('st=subject')) && !window.location.href.includes('read.html'))) {
            return;
        }
        checkboxClicked = false;
        document.querySelectorAll('span.hu_nick_txt').forEach(span => {
            let spanText = span.textContent.trim();
            if (spanText.length === 0) {
                spanText = [...span.querySelectorAll('span')].find(child => child.textContent.length > 0).textContent.trim();
            }
            if (!span.closest('#profile_table > tbody > tr') && !span.closest('span.nick > span > span') && !span.closest('#login_box_mem > dl > dd.a > span > span > span')) {
                var toggleCheckboxHTML;
                let closestTr = span.closest('tr');
                if (closestTr) {
                    if (window.location.href.includes('list.html')) {
                        closestTr = closestTr.closest('tbody').closest('tr');
                    }
                    if (memos.includes(spanText)) {
                        const listBestBox = closestTr.querySelector('td > div#list_best_box');
                        const tdsToHide = listBestBox ? Array.from(closestTr.querySelectorAll('td')).slice(1, 3) : Array.from(closestTr.querySelectorAll('td')).slice(0, 3);
                        tdsToHide.forEach(td => {
                            if (!td.querySelector('.blind-overlay')) {
                                const overlay = document.createElement('div');
                                overlay.className = 'blind-overlay';
                                overlay.style.position = 'absolute';
                                overlay.style.top = '0';
                                overlay.style.left = '0';
                                overlay.style.width = '100%';
                                overlay.style.height = '100%';
                                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.97)'; // Set opacity to 97%
                                overlay.style.pointerEvents = 'none';
                                td.style.position = 'relative';
                                td.appendChild(overlay);
                            }
                        });
                        // Check if checkboxes already exist
                        if (!closestTr.querySelector('.toggle-hide-checkbox')) {
                            toggleCheckboxHTML = `
                             <tz><br><input type="checkbox" class="toggle-hide-checkbox"><label>보기</label></tz>
                            `
                            if (!closestTr.querySelector('.toggle-blind-checkbox')) {
                                toggleCheckboxHTML = `
                                <tz><br><input type="checkbox" class="toggle-blind-checkbox" checked><label>블라</label></tz>
                            ` + toggleCheckboxHTML;
                            } else {
                                closestTr.querySelector('.toggle-blind-checkbox').checked = true;
                            }
                            closestTr.children[3].children[1].insertAdjacentHTML('beforeend', toggleCheckboxHTML);

                            const toggleHideCheckbox = closestTr.querySelector('.toggle-hide-checkbox');
                            if (toggleHideCheckbox && toggleHideCheckbox.getAttribute('listener') !== 'true') {
                                toggleHideCheckbox.addEventListener('change', (e) => {
                                    const elementChanged = e.target;
                                    elementChanged.setAttribute('listener', 'true')
                                    const isChecked = toggleHideCheckbox.checked;
                                    tdsToHide.forEach(td => {
                                        const overlay = td.querySelector('.blind-overlay');
                                        if (overlay) {
                                            overlay.style.display = isChecked ? 'none' : 'block';
                                        }
                                    });
                                });
                            }
                        }
                    } else if (closestTr.querySelector('.toggle-hide-checkbox')) {
                        closestTr.querySelector('tz:nth-child(2)').remove()
                        const tdsToHide = Array.from(closestTr.querySelectorAll('td')).slice(0, 3);
                        tdsToHide.forEach(td => {
                            if (td.querySelector('.blind-overlay')) {
                                td.querySelector('.blind-overlay').remove()
                            }
                        });
                        closestTr.querySelector('.toggle-blind-checkbox').checked = false;
                    } else if (!closestTr.querySelector('.toggle-blind-checkbox')) {
                        toggleCheckboxHTML = `
                                <tz><br><input type="checkbox" class="toggle-blind-checkbox"><label>블라</label></tz>
                            `;
                        closestTr.children[3].children[1].insertAdjacentHTML('beforeend', toggleCheckboxHTML);
                        closestTr.querySelector('.toggle-blind-checkbox').checked = false;

                    } else {
                        closestTr.querySelector('.toggle-blind-checkbox').checked = false;
                    }
                    const toggleBlindCheckbox = closestTr.querySelector('.toggle-blind-checkbox');
                    if (toggleBlindCheckbox && toggleBlindCheckbox.getAttribute('listener') !== 'true') {
                        toggleBlindCheckbox.addEventListener('change', (e) => {
                            checkboxClicked = true;
                            const elementChanged = e.target;
                            elementChanged.setAttribute('listener', 'true')
                            const isChecked = toggleBlindCheckbox.checked;
                            if (isChecked) {
                                const span = toggleBlindCheckbox.closest('tr').querySelector('span.hu_nick_txt');
                                let spanText = span.textContent.trim();
                                if (spanText.length === 0) {
                                    spanText = [...span.querySelectorAll('span')].find(child => child.textContent.length > 0).textContent.trim();
                                }
                                console.log(spanText);
                                memoInput.value = spanText;
                                addMemo();
                            } else {
                                memos = memos.filter(memo => memo !== spanText);
                                GM_setValue(memosKey, memos);
                                updateMemoList();
                                updatePaginationControls();
                                applyFilter();
                            }
                        });

                    }
                }
            }
        });
    }

    function showAll() {
        document.querySelectorAll('.blind-overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
        document.querySelectorAll('.toggle-hide-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });
    }

    function hideAll() {
        document.querySelectorAll('.toggle-hide-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        });
    }

    // Initialize the memo list, pagination controls, and apply filter
    updateMemoList();
    updatePaginationControls();
    applyFilter();

    // Listen for changes to memos and re-apply filter if necessary
    GM_addValueChangeListener(memosKey, () => {
        memos = GM_getValue(memosKey, []);
        updateMemoList();
        applyFilter();
        memoCountDisplay.textContent = memos.length;
    });
})();
