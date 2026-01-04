// ==UserScript==
// @name         Humoruniv Auto Refresh & Simple blind
// @namespace    http://tampermonkey.net/
// @version      2.46
// @description  자동 새로고침 (옵션 및 블라인드 탭 추가)
// @author       십갈
// @match        https://web.humoruniv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=humoruniv.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/495106/Humoruniv%20Auto%20Refresh%20%20Simple%20blind.user.js
// @updateURL https://update.greasyfork.org/scripts/495106/Humoruniv%20Auto%20Refresh%20%20Simple%20blind.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.self !== window.top) {
        return;
    }

    const settings = {
        autoRefresh: GM_getValue('autoRefresh', true),
        blinkEffect: GM_getValue('blinkEffect', true),
        blindList: GM_getValue('blindList', {}).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {})
    };

    function saveSettings() {
        GM_setValue('autoRefresh', settings.autoRefresh);
        GM_setValue('blinkEffect', settings.blinkEffect);
        GM_setValue('blindList', Object.keys(settings.blindList));
    }

    function resetBlindValues() {
        Object.keys(settings.blindList).forEach(key => {
            settings.blindList[key] = 0;
        });
    }

    function updateBlindListDisplay() {
        const blindList = document.getElementById('blindList');
        const currentPage = parseInt(document.getElementById('currentPage').value, 10);
        const itemsPerPage = 10;
        const keys = Object.keys(settings.blindList);
        const totalPages = Math.max(Math.ceil(keys.length / itemsPerPage), 1);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const pageItems = keys.slice(startIndex, endIndex).map(key => `<li class="mui-list-item ${settings.blindList[key] ? 'red' : ''}" data-key="${key}">${key}</li>`);
        blindList.innerHTML = pageItems.join('');
        document.getElementById('totalPages').textContent = `/ ${totalPages}`;
        seeViewAll();
    }

    function seeButtonVisible(tr) {
        const span = tr.querySelector('span.hu_nick_txt');
        if (!span) return;
        let textContent = span.textContent.trim();
        if (textContent.length === 0) {
            textContent = [...span.querySelectorAll('span')].find(child => child.textContent.length > 0).textContent.trim();
        }
        const viewButton = tr.querySelector('button.view-button');
        if (viewButton) {
            if (settings.blindList.hasOwnProperty(textContent)) {
                viewButton.classList.remove('hidden-button');
                viewButton.classList.add('revealed-button');
                targetOverlay(tr, 'block')
            } else {
                viewButton.classList.remove('revealed-button');
                viewButton.classList.add('hidden-button');
                targetOverlay(tr, 'none')
            }
        }
    }

    const settingsPanelHTML = `
        <div id="settingsPanel" class="mui-panel">
            <div class="mui-tabs">
                <button id="settingsTab" class="mui-tab mui-active">옵션</button>
                <button id="blindTab" class="mui-tab">블라인드</button>
            </div>
            <div id="optionsContent" class="mui-tab-content">
                <label class="mui-checkbox">
                    <input type="checkbox" id="autoRefresh" ${settings.autoRefresh ? 'checked' : ''}>
                    자동 새로고침
                </label><br>
                <label class="mui-checkbox">
                    <input type="checkbox" id="blinkEffect" ${settings.blinkEffect ? 'checked' : ''}>
                    반짝임 효과
                </label><br>
                <button id="saveSettings" class="mui-btn mui-btn--primary mui-btn--raised">저장</button>
            </div>
            <div id="blindContent" class="mui-tab-content" style="display: none;">
                <div class="mui-pagination">
                    <button id="prevPage" class="mui-btn mui-btn--primary mui-pagination-button"><font size=1>이전</font></button>
                    <input type="text" id="currentPage" value="1" class="mui-input mui-pagination-input">
                    <span id="totalPages">/ 1</span>
                    <button id="nextPage" class="mui-btn mui-btn--primary mui-pagination-button"><font size=1>다음</font></button>&nbsp;&nbsp;
                    <button id="deleteBlind" class="mui-btn mui-btn-primary"><font size=2>삭제</font></button>
                </div>
                <ul id="blindList" class="mui-list"></ul>
            </div>
        </div>
        <div id="settingsButton" class="mui-fab" text-align: center><font size=6>⋮</font></div>
    `;

    GM_addStyle(`
        .mui-panel {
            display: none;
            position: fixed;
            top: 50px;
            right: 50px;
            width: 230px;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .mui-tabs {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
        }
        .mui-tab {
            flex: 1;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            background: #f5f5f5;
            border: none;
            outline: none;
            border-bottom: 2px solid transparent;
            color: #333;
            border-radius: 8px 8px 0 0;
        }
        .mui-active {
            background: white;
            border-bottom: 2px solid #007bff;
        }
        .mui-tab-content {
            padding: 10px 0;
            color: #333;
        }
        .mui-checkbox {
            display: block;
            margin: 10px 0;
        }
        .mui-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .mui-list-item {
            border: 1px solid #e0e0e0;
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            background: #fafafa;
            color: #333;
        }
        .mui-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
        }
        .mui-fab {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .mui-btn {
            margin: 0 5px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .mui-btn:hover {
            background: #0056b3;
        }
        .mui-input {
            margin: 0 5px;
            padding: 5px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            outline: none;
            width: 40px;
            text-align: center;
            color: #333;
            background: #fafafa;
        }
        .hidden-button {
            visibility: hidden;
        }
        .revealed-button {
            visibility: visible;
        }
        .red {
            background-color: #ff1744;
            color: white;
        }
        .mui-button {
            margin: 2px;
            padding: 2px 5px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            outline: none;
            display: inline-block;
            font-size: 10px;
        }
        .mui-button + .mui-button {
            margin-left: 5px;
        }
        .mui-pagination-button {
            border-radius: 4px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `);

    document.body.insertAdjacentHTML('beforeend', settingsPanelHTML);

    document.getElementById('settingsButton').addEventListener('click', () => {
        const panel = document.getElementById('settingsPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'none') {
            resetBlindValues();
            saveSettings();
        }
    });

    document.getElementById('settingsTab').addEventListener('click', () => {
        document.getElementById('optionsContent').style.display = 'block';
        document.getElementById('blindContent').style.display = 'none';
        document.getElementById('settingsTab').classList.add('mui-active');
        document.getElementById('blindTab').classList.remove('mui-active');
    });

    document.getElementById('blindTab').addEventListener('click', () => {
        document.getElementById('optionsContent').style.display = 'none';
        document.getElementById('blindContent').style.display = 'block';
        document.getElementById('settingsTab').classList.remove('mui-active');
        document.getElementById('blindTab').classList.add('mui-active');
        updateBlindListDisplay();
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        settings.autoRefresh = document.getElementById('autoRefresh').checked;
        settings.blinkEffect = document.getElementById('blinkEffect').checked;
        saveSettings();
        alert('설정이 저장되었습니다.');
    });

    document.getElementById('blindList').addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'LI' && target.dataset.key) {
            const key = target.dataset.key;
            settings.blindList[key] = settings.blindList[key] === 0 ? 1 : 0;
            target.classList.toggle('red', settings.blindList[key]);
            saveSettings();
        }
    });

    document.getElementById('deleteBlind').addEventListener('click', () => {
        Object.keys(settings.blindList).forEach(key => {
            if (settings.blindList[key]) {
                delete settings.blindList[key];
            }
        });
        updateBlindListDisplay();
        saveSettings();
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        let currentPage = parseInt(document.getElementById('currentPage').value, 10);
        if (currentPage > 1) {
            document.getElementById('currentPage').value = currentPage - 1;
            updateBlindListDisplay();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        let currentPage = parseInt(document.getElementById('currentPage').value, 10);
        let totalPages = Math.max(Math.ceil(Object.keys(settings.blindList).length / 10), 1);
        if (currentPage < totalPages) {
            document.getElementById('currentPage').value = currentPage + 1;
            updateBlindListDisplay();
        }
    });

    const remotePageUrl = location.href;
    const maxChildNodes = 20;
    let shouldSync = settings.autoRefresh;
    let initialAdded = false;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink-light {
            0%, 100% { background-color: transparent; }
            50% { background-color: #007bff; }
        }
        .blink-light {
            animation: blink-light 0.5s ease-in-out 10;
        }
        @keyframes blink-dark {
            0%, 100% { background-color: transparent; }
            50% { background-color: #007bff; }
        }
        .blink-dark {
            animation: blink-dark 0.5s ease-in-out 10;
        }
        .hidden-button {
            visibility: hidden;
        }
        .revealed-button {
            visibility: visible;
        }
    `;
    document.head.appendChild(style);

    function getBlinkClass() {
        const darkThemeMatch = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return darkThemeMatch ? 'blink-dark' : 'blink-light';
    }

    function syncElements(remoteDoc) {
        if (shouldSync) {
            syncSection('#post_list > tbody', remoteDoc, syncNodesWithFIFO);
            refreshAdditionalElements(remoteDoc);
        }
    }

    function syncSection(selector, remoteDoc, syncFunction) {
        const currentElement = document.querySelector(selector);
        const remoteElement = remoteDoc.querySelector(selector);

        if (currentElement && remoteElement) {
            syncFunction(currentElement, remoteElement);
        }
    }

    function getCurrentFirstChildIdNumber(currentElement) {
        const firstChild = currentElement.querySelector('tr');
        if (firstChild && firstChild.id) {
            const match = firstChild.id.match(/li_chk_pdswait-(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        }
        return 0;
    }

    function syncNodesWithFIFO(currentNode, remoteNode) {
        try {
            const currentFirstIdNumber = getCurrentFirstChildIdNumber(currentNode);
            const remoteChildren = Array.from(remoteNode.querySelectorAll(':scope > tr'));

            const newChildren = remoteChildren.filter(child => {
                const match = child.id.match(/li_chk_pdswait-(\d+)/);
                const remoteIdNumber = match ? parseInt(match[1], 10) : 0;
                return remoteIdNumber > currentFirstIdNumber;
            });

            newChildren.reverse().forEach(newChild => {
                const clonedChild = newChild.cloneNode(true);
                addButtons(clonedChild);
                addOverlay(clonedChild, 'none');
                let targetSpan = clonedChild.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span span') ||
                    clonedChild.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span');
                let userName = targetSpan ? targetSpan.textContent.trim() : null;
                if (userName) {
                    addOverlay(clonedChild, 'none');
                    if (settings.blindList.hasOwnProperty(userName)) {
                        targetOverlay(clonedChild, 'block')
                        seeButtonVisible(clonedChild)
                    }
                }
                currentNode.insertBefore(clonedChild, currentNode.firstChild);
                const nextSibling = newChild.nextElementSibling;
                if (nextSibling && nextSibling.tagName.toLowerCase() === 'script') {
                    const clonedScript = nextSibling.cloneNode(true);
                    currentNode.insertBefore(clonedScript, currentNode.firstChild.nextSibling);
                }
            });

            const trChildren = Array.from(currentNode.querySelectorAll(':scope > tr'));
            while (trChildren.length > maxChildNodes) {
                const lastChild = trChildren.pop();
                if (lastChild && currentNode.contains(lastChild)) {
                    const nextSibling = lastChild.nextElementSibling;
                    if (nextSibling && nextSibling.tagName.toLowerCase() === 'script' &&
                        currentNode.contains(nextSibling)) {
                        currentNode.removeChild(nextSibling);
                    }
                    if (currentNode.contains(lastChild)) {
                        currentNode.removeChild(lastChild);
                    }
                }
            }

            refreshRemainingNodes(currentNode, remoteNode);
        } catch (error) {
            console.error('Error in syncNodesWithFIFO:', error);
        }
    }

    function refreshRemainingNodes(currentNode, remoteNode) {
        try {
            const currentChildren = Array.from(currentNode.querySelectorAll(':scope > tr'));
            const remoteChildren = Array.from(remoteNode.querySelectorAll(':scope > tr'));

            currentChildren.forEach((currentChild) => {
                const remoteChild = remoteChildren.find(remote => remote.id === currentChild.id);
                const textContent = currentChild.querySelector('td.li_icn').textContent.trim();
                const isInBlindList = settings.blindList.hasOwnProperty(textContent);

                if (remoteChild) {
                    const currentChildChildren = Array.from(currentChild.children);
                    const remoteChildChildren = Array.from(remoteChild.children);

                    [1, 4, 5, 6].forEach(childIndex => {
                        if (childIndex === 1) {
                            const currentChildNode = currentChildChildren[childIndex];
                            const remoteChildNode = remoteChildChildren[childIndex];
                            if (currentChildNode && remoteChildNode && currentChildNode.textContent !== remoteChildNode.textContent) {
                                currentChildNode.querySelector('td.li_sbj > a').innerHTML = remoteChildNode.querySelector('td.li_sbj > a').innerHTML;
                                if (settings.blinkEffect && !isInBlindList) {
                                    blinkElement(currentChildNode);
                                }
                            }
                        } else {
                            const currentChildNode = currentChildChildren[childIndex];
                            const remoteChildNode = remoteChildChildren[childIndex];
                            if (currentChildNode && remoteChildNode && currentChildNode.textContent !== remoteChildNode.textContent) {
                                currentChildNode.innerHTML = remoteChildNode.innerHTML;
                                if (settings.blinkEffect && !isInBlindList) {
                                    blinkElement(currentChildNode);
                                }
                            }
                        }
                    });
                } else {
                    const nextSibling = currentChild.nextElementSibling;
                    if (nextSibling && nextSibling.tagName.toLowerCase() === 'script' &&
                        currentNode.contains(nextSibling)) {
                        currentNode.removeChild(nextSibling);
                    }
                    currentChild.remove();
                }
            });
        } catch (error) {
            console.error('Error in refreshRemainingNodes:', error);
        }
    }

    function blinkElement(element) {
        const blinkClass = getBlinkClass();
        element.classList.add(blinkClass);
        setTimeout(() => {
            element.classList.remove(blinkClass);
        }, 2000);
    }

    function addButtons(trElement) {
        if (trElement) {
            const fourthChild = trElement.children[3];
            if (!fourthChild) {
                return;
            }
            const blindButton = document.createElement('button');
            const viewButton = document.createElement('button');

            blindButton.textContent = '블라';
            viewButton.textContent = '보기';
            viewButton.classList.add('hidden-button', 'view-button');

            blindButton.classList.add('mui-button');
            viewButton.classList.add('mui-button');

            console.log('블라,보기 버튼 설치 완료')

            blindButton.addEventListener('click', () => {
                var targetSpan
                let commentList = trElement.childElementCount === 6
                if (commentList) {
                    targetSpan = trElement.querySelector('td:nth-child(2) > span > span') || trElement.querySelector('td:nth-child(2) > div:nth-child(2) > span > span');
                } else {
                    targetSpan = trElement.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span span') ||
                        trElement.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span');
                }
                let userName = targetSpan.textContent.trim();
                console.log('당신의 이름은 : ' + userName)
                if (userName && settings.blindList.hasOwnProperty(userName)) {
                    delete settings.blindList[userName];
                    console.log('blind delete');
                    if (commentList) {
                        document.querySelectorAll('#cmt_wrap_box > table > tbody > tr').forEach((tr) => {
                            let targetSpanN = tr.querySelector('div span span span') || tr.querySelector('div span span');
                            let userNameN = targetSpanN ? targetSpanN.textContent.trim() : null;
                            if (userNameN === userName) {
                                targetOverlay(tr, 'none');

                            }
                        });
                    } else {
                        document.querySelectorAll('#post_list > tbody > tr').forEach((tr) => {
                            let targetSpanN = tr.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span span') ||
                                tr.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span');
                            let userNameN = targetSpanN ? targetSpanN.textContent.trim() : null;
                            if (userNameN === userName) {
                                targetOverlay(tr, 'none');
                            }
                        })
                    }
                } else if (userName && !settings.blindList.hasOwnProperty(userName)) {

                    settings.blindList[userName] = 0;
                    if (commentList) {
                        document.querySelectorAll('#cmt_wrap_box > table > tbody > tr').forEach((tr) => {
                            let targetSpanN = tr.querySelector('div span span span') || tr.querySelector('div span span');
                            let userNameN = targetSpanN ? targetSpanN.textContent.trim() : null;
                            if (userNameN === userName) {
                                targetOverlay(tr, 'block');
                            }
                        });
                    } else {
                        document.querySelectorAll('#post_list > tbody > tr').forEach((tr) => {
                            let targetSpanN = tr.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span span') ||
                                tr.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span');
                            let userNameN = targetSpanN ? targetSpanN.textContent.trim() : null;
                            if (userNameN === userName) {
                                targetOverlay(tr, 'block');
                            }
                        });
                    }
                }
                updateBlindListDisplay();
                saveSettings();
            });
            console.log('블라 이벤트 리스너 설치 완료')

            viewButton.addEventListener('click', () => {
                const overlays = trElement.querySelectorAll('.overlay');


                if (trElement.children.length === 6 && trElement.querySelector('#list_best_box')) {
                    var overlayArray = [...trElement.querySelectorAll('.overlay')].slice(1);
                } else {
                    var overlayArray = [...trElement.querySelectorAll('.overlay')];
                }
                overlayArray.forEach(overlay => {
                    if (overlay.style.display === 'none') {
                        overlay.style.display = 'block';
                    } else {
                        overlay.style.display = 'none';
                    }
                });


            });
            fourthChild.appendChild(blindButton);
            fourthChild.appendChild(viewButton);
            if (trElement.childElementCount === 6) {
                viewButton.insertAdjacentHTML('beforebegin', '<br>')
            }




            console.log('보기 이벤트 리스너 설치 완료')
        }
    }



    function addOverlay(trElement, status) {
        [0, 1, 2].forEach(i => {
            if (trElement.children[i] && !trElement.children[i].querySelector('.overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.style.position = 'absolute';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.97)';
                overlay.style.zIndex = '1000';
                trElement.children[i].style.position = 'relative';
                trElement.children[i].appendChild(overlay);
                overlay.style.display = status;
            }
        });
    }

    function toggleOverlay(trElement) {
        const overlays = trElement.querySelectorAll('.overlay');
        overlays.forEach(overlay => {
            if (overlay.style.display === 'none') {
                overlay.style.display = 'block';
            } else {
                overlay.style.display = 'none';
            }
        });
    }

    function targetOverlay(trElement, status) {
        var overlays
        if (trElement.children.length === 6 && trElement.querySelector('#list_best_box')) {
            overlays = [...trElement.querySelectorAll('.overlay')].slice(1);
        } else {
            overlays = [...trElement.querySelectorAll('.overlay')];
        }
        overlays.forEach(overlay => {
            overlay.style.display = status;
        });
    }

    function refreshAdditionalElements(remoteDoc) {
        try {
            const selectors = [
                '#login_box_mem > dl > dd:nth-child(3) > a',
                '#login_box_mem > dl > dd:nth-child(2) > a',
                '#bbs_best'
            ];
            selectors.forEach(selector => {
                const currentElement = document.querySelector(selector);
                const remoteElement = remoteDoc.querySelector(selector);
                if (currentElement && remoteElement) {
                    currentElement.innerHTML = remoteElement.innerHTML;
                }
            });

            const iframe = document.querySelector('#list_right_idx > div:nth-child(2) > iframe');
            if (iframe) {
                iframe.addEventListener('load', () => {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeRemoteDoc = remoteDoc.querySelector('#list_right_idx > div:nth-child(2) > iframe').contentDocument || remoteDoc.querySelector('#list_right_idx > div:nth-child(2) > iframe').contentWindow.document;
                    const iframeCurrentElement = iframeDocument.querySelector('#wrap_right_list_new2 > div.df.wrap_sub_best_new');
                    const iframeRemoteElement = iframeRemoteDoc.querySelector('#wrap_right_list_new2 > div.df.wrap_sub_best_new');
                    if (iframeCurrentElement && iframeRemoteElement) {
                        iframeCurrentElement.innerHTML = iframeRemoteElement.innerHTML;
                    }
                });
            }
        } catch (error) {
            console.error('Error in refreshAdditionalElements:', error);
        }
    }

    function fetchAndSyncRemotePage() {
        if (settings.autoRefresh && restricted()) {
            fetch(remotePageUrl, {
                headers: {
                    'Content-Type': 'text/html; charset=euc-kr'
                }
            })
                .then(response => response.arrayBuffer())
                .then(buffer => {
                const decoder = new TextDecoder('euc-kr');
                const html = decoder.decode(buffer);
                const parser = new DOMParser();
                const remoteDoc = parser.parseFromString(html, 'text/html');
                syncElements(remoteDoc);
            })
                .catch(error => console.error('Error fetching remote page:', error));
        }
    }

    function observeIframe() {
        const observer = new MutationObserver(() => {
            const balloonIframe = document.querySelector('iframe[name="balloon"]');
            shouldSync = settings.autoRefresh && !balloonIframe;
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function restricted() {
        const url = location.href;
        if (url.includes('&st=')){
            return false;
        } else {
            return true;
        }
    }

    function seeViewAll() {
        document.querySelectorAll('#post_list > tbody > tr').forEach(seeButtonVisible);
        console.log('대자에 보기버튼 추가');
        document.querySelectorAll('#cmt_wrap_box > table > tbody > tr').forEach(seeButtonVisible);
        console.log('답글에 보기버튼 추가');
    }

    if (!initialAdded) {
        seeViewAll();
        initialAdded = true;
        console.log('초기화 성공');
    }

    // 댓글 창인 경우
    document.querySelectorAll('#cmt_wrap_box > table > tbody > tr').forEach((trElement) => {
        addButtons(trElement)
        let targetSpan = trElement.querySelector('div span span span') || trElement.querySelector('div span span');
        let userName = targetSpan ? targetSpan.textContent.trim() : null;
        if (userName) {
            addOverlay(trElement, 'none');
            if (settings.blindList.hasOwnProperty(userName)) {
                targetOverlay(trElement, 'block')
                seeButtonVisible(trElement)
            }
        }
    })

    // 글 인 경우
    document.querySelectorAll('#post_list > tbody > tr').forEach((trElement) => {

        addButtons(trElement)
        let targetSpan = trElement.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span span') ||
            trElement.querySelector('td:nth-child(3) table tbody tr td:nth-child(2) span span');
        let userName = targetSpan ? targetSpan.textContent.trim() : null;
        if (userName) {
            addOverlay(trElement, 'none');
            if (settings.blindList.hasOwnProperty(userName)) {
                targetOverlay(trElement, 'block')
                seeButtonVisible(trElement)
            }
        }
    })


    updateBlindListDisplay();

    window.addEventListener('load', () => {
        observeIframe();
        setInterval(fetchAndSyncRemotePage, 5000);
    });
})();
