// ==UserScript==
// @name         複写後の処理の自動化
// @namespace    http://tampermonkey.net/
// @version      1.04
// @license      MIT
// @description  複写後に色々な処理の実行を自動化
// @match        https://main.next-engine.com/Userjyuchu/jyuchuInp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536770/%E8%A4%87%E5%86%99%E5%BE%8C%E3%81%AE%E5%87%A6%E7%90%86%E3%81%AE%E8%87%AA%E5%8B%95%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/536770/%E8%A4%87%E5%86%99%E5%BE%8C%E3%81%AE%E5%87%A6%E7%90%86%E3%81%AE%E8%87%AA%E5%8B%95%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OLD_KEY = 'jyuchu_denpyo_no_old';
    const NEW_KEY = 'jyuchu_denpyo_no';
    const FLAG_KEY = 'update_flag';

    window.addEventListener('load', () => {
        console.log(`初期化後OLD${OLD_KEY}の値:`, localStorage.getItem(OLD_KEY));
        localStorage.removeItem(NEW_KEY);
        console.log(`初期化後のNEW${NEW_KEY}の値:`, localStorage.getItem(NEW_KEY));

        const inputElem = document.getElementById('jyuchu_denpyo_no');
        if (!inputElem) return;

        let lastVal = '';
        let wasEmpty = true;
        let initialized = false;

        setTimeout(() => {
            initialized = true;
        }, 1000);

        setInterval(() => {
            const currentVal = inputElem.value;

            if (currentVal === '') {
                wasEmpty = true;
            } else {
                if (initialized && wasEmpty && currentVal !== lastVal) {
                    localStorage.setItem(NEW_KEY, currentVal);
                    console.log('★ newValを保存しました（空文字検知後の新規入力）:', currentVal);
                    wasEmpty = false;
                }
            }
            lastVal = currentVal;
        }, 500);

        function oldValSaveHandler() {
            const currentVal = inputElem.value || '';
            if (currentVal) {
                localStorage.setItem(OLD_KEY, currentVal);
                console.log('★ oldValを保存しました:', currentVal);
                console.log('現在の newVal:', localStorage.getItem(NEW_KEY));
                console.log('現在の oldVal:', localStorage.getItem(OLD_KEY));
            }
        }

        const observer = new MutationObserver((mutations, obs) => {
            const btn = document.getElementById('ne_dlg_btn1_hukusyaDlg');
            if (btn) {
                btn.addEventListener('click', () => {
                    oldValSaveHandler();
                    addReflectButton();
                });

                console.log('ボタン要素（MutationObserver）:', btn);
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    window.addEventListener('storage', (event) => {
        if (event.key === FLAG_KEY) {
            reflectDenpyo();
        }
    });

    function getTodayDate() {
        const date = new Date();
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const jstDate = new Date(utc + (9 * 60 * 60000));
        const mm = String(jstDate.getMonth() + 1).padStart(2, '0');
        const dd = String(jstDate.getDate()).padStart(2, '0');
        return `${mm}/${dd}`;
    }

    async function reflectDenpyo(myDenpyo) {
        const textarea = document.getElementById('sagyosya_ran');
        if (!textarea) {
            console.warn('reflectDenpyo: textareaが見つかりません');
            return;
        }

        const oldVal = localStorage.getItem(OLD_KEY) || '';
        const newVal = localStorage.getItem(NEW_KEY) || '';

        const oldLine = oldVal ? `（元伝: ${oldVal}）` : '';
        const newLine = newVal ? `${getTodayDate()}（複写: ${newVal}）` : '';

        const lines = [oldLine, newLine].filter(line => line !== '');

        if (lines.length === 0) return;

        const existingText = textarea.value || '';

        let combinedText = lines.join('\n') + (existingText ? '\n' + existingText : '');

        const jyuchuInput = document.getElementById('jyuchu_denpyo_no');
        if (jyuchuInput) {
            const currentVal = jyuchuInput.value;
            if (currentVal) {
                const textLines = combinedText.split('\n');
                const filteredLines = textLines.filter(line => !line.includes(currentVal));
                combinedText = filteredLines.join('\n');
            }
        }

        textarea.value = combinedText;
    }

    function addReflectButton() {
        const targetTd = document.querySelector('#jyuyou_check_head td.group_head');

        const button = document.createElement('button');
        button.textContent = '複写処理';
        Object.assign(button.style, {
            position: 'absolute',
            top: '0',
            right: '95px',
            minWidth: '0',
            width: 'auto',
            fontSize: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            zIndex: 1000,
        });

        targetTd.style.position = 'relative';
        targetTd.appendChild(button);

        button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            button.remove();

            resetFormFields();
            resetTable();

            const messageDiv = document.createElement('div');
            messageDiv.textContent = '新規登録を押して複写自動処理を続行します';
            Object.assign(messageDiv.style, {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                zIndex: 10000,
                boxShadow: '0 0 6px rgba(0,0,0,0.3)',
            });

            document.body.appendChild(messageDiv);

            await waitForJyuchuDenpyoNo();

            messageDiv.remove();

            localStorage.setItem(FLAG_KEY, Date.now().toString());
            await reflectDenpyo();
            handleNumberInput();

        });

    }

    function resetFormFields() {
        const resetIds = [
            'syohin_kin', 'zei_kin', 'tesuryo_kin', 'hasou_kin', 'sonota_kin', 'point', 'goukei_kin'
        ];

        const select = document.getElementById('siharai_kbn');
        if (select) {
            select.value = '99';
            select.dispatchEvent(new Event('change'));
            console.log('★ 支払区分を「99:支払済」に設定しました。');
        }

        resetIds.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.value = '0';
                elem.dispatchEvent(new Event('input'));
                elem.dispatchEvent(new Event('change'));
                console.log(`★ ${id} を0にリセットしました。`);
            }
        });
    }

    const handleNumberInput = (val) => {
        const popupButton = document.getElementById('show-jidousousin-btn');
        if (!popupButton) {
            console.warn('⚠ show-jidousousin-btn が見つかりません。');
            return;
        }
        popupButton.click();
        console.log('★ ポップアップ開放ボタンをクリックしました。');

        const maxWaitMs = 5000;
        const intervalMs = 200;
        let waited = 0;

        const waitForPopupAndOperate = () => {
            const stopMailCheckbox = document.getElementById('stop_mail_j');
            const registerButton = document.getElementById('ne_dlg_btn1_ne_Dialog');
            const closeButton = document.getElementById('ne_dlg_btn0_ne_Dialog');

            if (stopMailCheckbox && registerButton && closeButton) {
                if (!stopMailCheckbox.checked) {
                    stopMailCheckbox.click();
                    console.log('★ stop_mail_j チェックボックスをオンにしました。');
                    registerButton.click();
                    console.log('★ 登録ボタンをクリックしました。');
                } else {
                    console.log('★ stop_mail_j チェックボックスはすでにオンです。');
                    closeButton.click();
                    console.log('★ 閉じるボタンをクリックしました。');
                }

            } else {
                if (waited >= maxWaitMs) {
                    console.warn('⚠ ポップアップ内の要素が見つかりません。');
                    return;
                }
                waited += intervalMs;
                setTimeout(waitForPopupAndOperate, intervalMs);
            }
        };

        setTimeout(waitForPopupAndOperate, intervalMs);
    };

    function waitForJyuchuDenpyoNo(interval = 100) {
        return new Promise((resolve) => {
            const check = () => {
                const val = document.getElementById('jyuchu_denpyo_no')?.value;
                if (val && val.trim() !== '') {
                    console.log('★ 受注伝票番号が入力されました：', val);
                    resolve();
                } else {
                    setTimeout(check, interval);
                }
            };

            check();
        });
    }

    const simulateInputChange = (input, value) => {
        console.log('▶ simulateInputChange 開始');

        input.focus();
        input.value = value;

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        const parentCell = input.closest('td');
        if (parentCell) {
            input.blur();
            parentCell.textContent = value;
        }

        console.log('◀ simulateInputChange 終了');
    };

    const resetTable = () => {
        console.log('▶ resetTable 開始');

        const table = document.getElementById('jyuchuMeisai_tablene_table');
        if (!table) {
            console.warn('⚠ jyuchuMeisai_tablene_table が見つかりません。');
            return;
        }

        const rows = Array.from(table.rows);
        if (rows.length < 2) {
            console.log('  テーブルの行数が足りません');
            return;
        }

        const headerTexts = Array.from(rows[0].cells).map(cell => cell.textContent.trim());
        const targetIndices = ['売単価', '小計'].map(col => headerTexts.indexOf(col)).filter(i => i !== -1);
        console.log('  対象列インデックス:', targetIndices);

        if (targetIndices.length === 0) {
            console.warn('⚠ 対象列が見つかりません（売単価・小計）。');
            return;
        }

        let delay = 0;
        rows.slice(1).forEach((row, rowIndex) => {
            targetIndices.forEach(index => {
                const cell = row.cells[index];
                if (!cell) {
                    console.warn(`  行${rowIndex + 1}、列${index}のセルが見つかりません`);
                    return;
                }

                setTimeout(() => {
                    console.log(`  行${rowIndex + 1}、列${index}のセルをクリック`);
                    cell.click();

                    setTimeout(() => {
                        const editInput = cell.querySelector('input[type="text"]:not([readonly])');
                        if (!editInput) {
                            console.warn(`  行${rowIndex + 1}、列${index}の編集用入力欄が見つかりません`);
                            return;
                        }
                        console.log(`  行${rowIndex + 1}、列${index}の入力欄に0をセット`);
                        simulateInputChange(editInput, '0');
                    }, 150);
                }, delay);

                delay += 400;
            });
        });

    };
}
)();
