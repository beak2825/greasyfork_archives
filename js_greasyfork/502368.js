// ==UserScript==
// @name         メモ欄
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  自分用のメモ欄をメインページに作成。縦横軸管理画面にも商品コード毎にメモは共有。本登録後も確認可。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @match        https://starlight.plusnao.co.jp/goods/axisCode*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502368/%E3%83%A1%E3%83%A2%E6%AC%84.user.js
// @updateURL https://update.greasyfork.org/scripts/502368/%E3%83%A1%E3%83%A2%E6%AC%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let memoBoxChanged = false;
    let otherChanges = false;
    let memoVisible = localStorage.getItem('memoVisible') === 'true';
    const isStarlight = window.location.hostname === 'starlight.plusnao.co.jp';

    if (isStarlight) {
        memoVisible = false;
    }

    let splitMode = localStorage.getItem('splitMode') || 'none';

    const memoDiv = document.createElement('div');
    memoDiv.style.position = 'fixed';
    memoDiv.style.bottom = isStarlight ? '0' : '25px';
    memoDiv.style.right = '5px';
    memoDiv.style.zIndex = '1000';
    memoDiv.style.border = '1px solid #ccc';
    memoDiv.style.backgroundColor = '#EEF7FF';
    memoDiv.style.resize = 'both';
    memoDiv.style.overflow = 'hidden';
    memoDiv.style.borderRadius = '5px';
    memoDiv.style.transform = 'scale(-1)';
    memoDiv.style.display = memoVisible ? 'flex' : 'none';
    memoDiv.style.flexDirection = 'column-reverse';
    memoDiv.style.boxSizing = 'border-box';

    const savedWidth = localStorage.getItem('memoBoxWidth') || '500px';
    const savedHeight = localStorage.getItem('memoBoxHeight') || '500px';
    memoDiv.style.width = savedWidth;
    memoDiv.style.height = savedHeight;

    const memoHeader = document.createElement('div');
    memoHeader.textContent = 'Memo';
    memoHeader.style.fontWeight = 'bold';
    memoHeader.style.textAlign = 'center';
    memoHeader.style.position = 'relative';
    memoHeader.style.padding = isStarlight ? '5px 0' : '5px 0';
    memoHeader.style.cursor = 'default';
    memoHeader.style.transform = 'scale(-1)';

    const memoContainer = document.createElement('div');
    memoContainer.style.flex = '1';
    memoContainer.style.display = 'flex';
    memoContainer.style.flexDirection = 'column';
    memoContainer.style.overflow = 'hidden';
    memoContainer.style.transform = 'scale(-1)';

    function simulatePaste(inputElement, text) {
        if (!text.includes('\n')) {
            text += '\n';
        }

        navigator.clipboard.writeText(text).then(() => {
            inputElement.focus();

            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: new DataTransfer()
            });
            pasteEvent.clipboardData.setData('text', text);
            inputElement.dispatchEvent(pasteEvent);
        }).catch(err => {
            console.error('Clipboardへの書き込みに失敗しました:', err);
        });
    }

    function createTextarea(index) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.marginBottom = '5px';

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.resize = 'none';
        textarea.style.boxSizing = 'border-box';

        textarea.style.padding = '3px';
        textarea.placeholder = `Area ${index}`;
        textarea.dataset.index = index;

        let productId;
        if (window.location.hostname === 'starlight.plusnao.co.jp') {
            const params = new URLSearchParams(window.location.search);
            productId = params.get('code');
        } else {
            productId = window.location.pathname.split('/').pop();
        }

        let value;

        if (window.location.hostname === 'starlight.plusnao.co.jp') {
            if (index === 0) {
                value = GM_getValue(`personalMemo-${productId}`, '');
            } else {
                value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
            }
        } else {
            if (index === 0) {
                value = localStorage.getItem(`personalMemo-${productId}`) || '';
                if (value === '') {
                    value = GM_getValue(`personalMemo-@${productId}`, '');
                }
            } else {
                value = localStorage.getItem(`personalMemo-${productId}-${index}`) || '';
                if (value === '') {
                    value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
                }
            }
        }
        textarea.value = value;

        textarea.addEventListener('input', () => {
            if (window.location.hostname !== 'starlight.plusnao.co.jp') {
                if (index === 0) {
                    localStorage.setItem(`personalMemo-${productId}`, textarea.value);
                    GM_setValue(`personalMemo-${productId}`, textarea.value);
                } else {
                    localStorage.setItem(`personalMemo-${productId}-@${index}`, textarea.value);
                    GM_setValue(`personalMemo-${productId}-@${index}`, textarea.value);
                }
            }
            memoBoxChanged = true;
        });

        textarea.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });

        const copyButton = document.createElement('button');
        copyButton.textContent = 'コピー';
        copyButton.style.marginTop = '5px';
        copyButton.style.padding = '9px 6px';
        copyButton.style.fontSize = '12px';
        copyButton.style.border = 'none';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.alignSelf = 'flex-start';

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(textarea.value).then(() => {
                copyButton.textContent = 'コピーしました';
                setTimeout(() => {
                    copyButton.textContent = 'コピー';
                }, 1500);
            }).catch(err => {
                console.error('コピーに失敗しました: ', err);
            });
        });

        const pasteHorizontalButton = document.createElement('button');
        pasteHorizontalButton.textContent = '横軸ペースト';
        pasteHorizontalButton.style.marginTop = '5px';
        pasteHorizontalButton.style.padding = '9px 6px';
        pasteHorizontalButton.style.fontSize = '12px';
        pasteHorizontalButton.style.border = 'none';
        pasteHorizontalButton.style.backgroundColor = '#28a745';
        pasteHorizontalButton.style.color = 'white';
        pasteHorizontalButton.style.borderRadius = '3px';
        pasteHorizontalButton.style.cursor = 'pointer';
        pasteHorizontalButton.style.alignSelf = 'flex-start';

        pasteHorizontalButton.addEventListener('click', () => {
            const targetHorizontalInput = document.querySelector('table:nth-of-type(1) tbody tr td:nth-child(4) input.form-control');
            if (targetHorizontalInput) {
                const textToPaste = textarea.value;
                simulatePaste(targetHorizontalInput, textToPaste);

                pasteHorizontalButton.textContent = 'ペーストしました';
                setTimeout(() => {
                    pasteHorizontalButton.textContent = '横軸ペースト';
                }, 1500);
            }
        });

        const pasteVerticalButton = document.createElement('button');
        pasteVerticalButton.textContent = '縦軸ペースト';
        pasteVerticalButton.style.marginTop = '5px';
        pasteVerticalButton.style.padding = '9px 6px';
        pasteVerticalButton.style.fontSize = '12px';
        pasteVerticalButton.style.border = 'none';
        pasteVerticalButton.style.backgroundColor = '#28a745';
        pasteVerticalButton.style.color = 'white';
        pasteVerticalButton.style.borderRadius = '3px';
        pasteVerticalButton.style.cursor = 'pointer';
        pasteVerticalButton.style.alignSelf = 'flex-start';

        pasteVerticalButton.addEventListener('click', () => {
            const verticalTable = document.querySelectorAll('table')[2];
            const targetVerticalInputs = verticalTable.querySelectorAll('tbody tr td:nth-child(4) input.form-control');

            if (targetVerticalInputs.length > 0) {
                const textToPaste = textarea.value;

                targetVerticalInputs.forEach((input, index) => {
                    if (index === 0) {
                        simulatePaste(input, textToPaste);
                    }
                });

                pasteVerticalButton.textContent = 'ペーストしました';
                setTimeout(() => {
                    pasteVerticalButton.textContent = '縦軸ペースト';
                }, 1500);
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '1px';

        container.appendChild(textarea);
        if (isStarlight) {
            buttonContainer.appendChild(copyButton);
            buttonContainer.appendChild(pasteHorizontalButton);
            buttonContainer.appendChild(pasteVerticalButton);
            container.appendChild(textarea);
            container.appendChild(buttonContainer);
        }
        return container;
    }

    memoDiv.addEventListener('mouseup', () => {
        if (memoVisible) {
            localStorage.setItem('memoBoxWidth', memoDiv.style.width);
            localStorage.setItem('memoBoxHeight', memoDiv.style.height);
            memoBoxChanged = true;
        }
    });

    function updateMemoLayout() {
        memoContainer.innerHTML = '';
        let textareas;

        switch (splitMode) {
            case 'vertical': {
                memoContainer.style.flexDirection = 'column';
                textareas = [createTextarea(0), createTextarea(1)];
                textareas.forEach((container) => {
                    container.style.flex = '1';
                    memoContainer.appendChild(container);
                });
                break;
            }
            case 'horizontal': {
                memoContainer.style.flexDirection = 'row';
                textareas = [createTextarea(0), createTextarea(1)];
                textareas.forEach((container) => {
                    container.style.flex = '1';
                    memoContainer.appendChild(container);
                });
                break;
            }
            case 'grid': {
                memoContainer.style.flexDirection = 'column';
                const row1 = document.createElement('div');
                row1.style.display = 'flex';
                row1.style.flex = '1';
                row1.style.flexDirection = 'row';
                row1.style.overflow = 'hidden';

                const row2 = document.createElement('div');
                row2.style.display = 'flex';
                row2.style.flex = '1';
                row2.style.flexDirection = 'row';
                row2.style.overflow = 'hidden';

                textareas = [createTextarea(0), createTextarea(1), createTextarea(2), createTextarea(3)];
                textareas.forEach((container, index) => {
                    container.style.flex = '1';
                    if (index < 2) row1.appendChild(container);
                    else row2.appendChild(container);
                });

                memoContainer.appendChild(row1);
                memoContainer.appendChild(row2);
                break;
            }
            default: {
                const container = createTextarea(0);
                container.style.height = '100%';
                container.style.width = '100%';
                memoContainer.appendChild(container);
                break;
            }
        }
    }

    const splitButton = document.createElement('button');
    splitButton.textContent = '田';
    splitButton.style.position = 'fixed';
    splitButton.style.top = '5px';
    splitButton.style.right = '30px';
    splitButton.style.zIndex = '1001';
    splitButton.style.padding = '0px 6px';
    splitButton.style.fontSize = '12px';
    splitButton.style.border = 'none';
    splitButton.style.backgroundColor = '#66CCFF';
    splitButton.style.color = '#fff';
    splitButton.style.borderRadius = '3px';
    splitButton.style.cursor = 'pointer';

    splitButton.addEventListener('click', () => {
        switch (splitMode) {
            case 'none':
                splitMode = 'vertical';
                break;
            case 'vertical':
                splitMode = 'horizontal';
                break;
            case 'horizontal':
                splitMode = 'grid';
                break;
            case 'grid':
                splitMode = 'none';
                break;
        }
        localStorage.setItem('splitMode', splitMode);
        updateMemoLayout();
    });

    const buttonStyle = `
    #buttonWrapper {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        pointer-events: none;
    }

    #showButton {
        width: 40px;
        height: 40px;
        background: rgba(102, 204, 102, 0.5);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(102, 204, 102, 0.4);
        border-radius: 50%;
        font-size: 26px;
        font-weight: bold;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        transform-origin: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    }

    #showButton:hover {
        width: 60px;
        height: 60px;
        background: rgba(102, 204, 102, 0.6);
        font-size: 32px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    #showButton:active {
        transform: scale(0.9);
        background: rgba(102, 204, 102, 0.8);
        transition: transform 0.05s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes buttonPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.4) rotate(10deg); }
        100% { transform: scale(1); }
    }

    @keyframes fadeInMemo {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    #showButton.fadeOut {
        animation: fadeOut 0.5s forwards;
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.5); }
    }
`;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = buttonStyle;
    document.head.appendChild(styleElement);

    const wrapper = document.createElement('div');
    wrapper.id = 'buttonWrapper';

    const showButton = document.createElement('button');
    showButton.id = 'showButton';
    showButton.textContent = '＋';
    wrapper.appendChild(showButton);

    const hideButton = document.createElement('button');
    hideButton.textContent = '‐';
    hideButton.style.position = 'fixed';
    hideButton.style.top = '5px';
    hideButton.style.right = '5px';
    hideButton.style.zIndex = '1001';
    hideButton.style.transform = 'scale(-1)';
    hideButton.style.padding = '0px 6px';
    hideButton.style.fontSize = '12px';
    hideButton.style.border = 'none';
    hideButton.style.backgroundColor = '#FF6666';
    hideButton.style.color = '#fff';
    hideButton.style.borderRadius = '3px';
    hideButton.style.cursor = 'pointer';
    hideButton.style.display = memoVisible ? 'block' : 'none';

    memoDiv.style.display = memoVisible ? 'flex' : 'none';
    showButton.style.display = memoVisible ? 'none' : 'block';

    hideButton.addEventListener('click', () => {
        memoVisible = false;
        memoDiv.style.display = 'none';
        hideButton.style.display = 'none';
        showButton.style.display = 'block';
        localStorage.setItem('memoVisible', memoVisible);
        document.body.removeEventListener('click', handleClickOutside);
    });

    showButton.addEventListener('click', () => {
        showButton.style.animation = 'buttonPop 0.5s';

        setTimeout(() => {
            memoVisible = !memoVisible;

            setTimeout(() => {
                memoDiv.style.display = memoVisible ? 'flex' : 'none';
            }, 70);

            hideButton.style.display = memoVisible ? 'block' : 'none';

            if (memoVisible) {
                showButton.classList.add('fadeOut');
                setTimeout(() => {
                    showButton.style.display = 'none';
                }, 70);

                document.body.addEventListener('click', handleClickOutside);
            } else {
                showButton.classList.remove('fadeOut');
                showButton.style.display = 'block';
                showButton.style.opacity = '1';

                document.body.removeEventListener('click', handleClickOutside);
            }

            localStorage.setItem('memoVisible', memoVisible);
        }, 70);
    });


    hideButton.addEventListener('click', () => {
        memoVisible = false;
        memoDiv.style.display = 'none';
        hideButton.style.display = 'none';

        showButton.style.display = 'block';
        showButton.classList.remove('fadeOut');
        showButton.style.opacity = '1';

        localStorage.setItem('memoVisible', memoVisible);

        if (isStarlight) {
            if (memoVisible) {
                document.body.addEventListener('click', handleClickOutside);
            } else {
                document.body.removeEventListener('click', handleClickOutside);
            }
        }
    });

    memoHeader.appendChild(splitButton);
    memoHeader.appendChild(hideButton);
    memoDiv.appendChild(memoHeader);
    memoDiv.appendChild(memoContainer);

    document.body.appendChild(memoDiv);
    document.body.appendChild(wrapper);

    updateMemoLayout();

    window.addEventListener('resize', () => {
        if (memoVisible) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const newWidth = Math.min(parseInt(memoDiv.style.width), windowWidth - 20) + 'px';
            const newHeight = Math.min(parseInt(memoDiv.style.height), windowHeight - 50) + 'px';

            memoDiv.style.width = newWidth;
            memoDiv.style.height = newHeight;
        }
    });

    document.body.addEventListener('input', (event) => {
        if (event.target.closest('textarea')) {
            memoBoxChanged = true;
        } else {
            otherChanges = true;
        }
    });

    const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
            });
        }
    });

    if (isStarlight) {
        let productId = new URLSearchParams(window.location.search).get('code');

        const observer = new MutationObserver(() => {
            const params = new URLSearchParams(window.location.search);
            const newProductId = params.get('code');

            if (newProductId !== productId) {
                productId = newProductId;
                updateMemoLayout();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleClickOutside(event) {
        if (isStarlight && memoVisible && !memoDiv.contains(event.target) && !showButton.contains(event.target)) {
            memoVisible = false;
            memoDiv.style.display = 'none';
            hideButton.style.display = 'none';

            showButton.style.display = 'block';
            showButton.classList.remove('fadeOut');
            showButton.style.opacity = '1';

            localStorage.setItem('memoVisible', memoVisible);

            document.removeEventListener('click', handleClickOutside);
            document.addEventListener('click', handleClickOutside);
        }
    }

    document.addEventListener('click', handleClickOutside);

})();