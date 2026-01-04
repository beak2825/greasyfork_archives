// ==UserScript==
// @name         分割伝票自動反映
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  伝票分割時に元伝票・分割先に伝票番号を作業欄へ自動反映(確認チェック + 入荷待ち も反映)
// @match        https://main.next-engine.com/Userjyuchu/jyuchuInp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537804/%E5%88%86%E5%89%B2%E4%BC%9D%E7%A5%A8%E8%87%AA%E5%8B%95%E5%8F%8D%E6%98%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/537804/%E5%88%86%E5%89%B2%E4%BC%9D%E7%A5%A8%E8%87%AA%E5%8B%95%E5%8F%8D%E6%98%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[分割伝票自動反映] スクリプト開始');

    function denpyoBunkatsuAutoReflect() {
        const OLD_KEY = 'bunkatsu_auto_jyuchu_denpyo_no_old';
        const NEW_KEY = 'bunkatsu_auto_jyuchu_denpyo_no_new';
        const FLAG_KEY = 'bunkatsu_auto_update_flag';

        window.addEventListener('load', () => {
            const observer = new MutationObserver((mutations, obs) => {
                const btn = document.getElementById('ne_dlg_btn2_bunkatuDlg');
                if (btn) {
                    btn.addEventListener('click', () => {
                        // 全キーを一度削除
                        localStorage.removeItem(OLD_KEY);
                        localStorage.removeItem(NEW_KEY);
                        localStorage.removeItem(FLAG_KEY);
                        // 現在の伝票番号をOLD_KEYとして保存
                        const inputElem = document.getElementById('jyuchu_denpyo_no');
                        const oldVal = inputElem ? inputElem.value : '';
                        if (oldVal) {
                            localStorage.setItem(OLD_KEY, oldVal);
                            console.log('[分割伝票自動反映] OLD_KEYセット:', oldVal);
                        } else {
                            console.log('[分割伝票自動反映] 伝票番号取得失敗（分割実行時）');
                        }
                    });
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });

        window.addEventListener('load', () => {
            const inputElem = document.getElementById('jyuchu_denpyo_no');
            const oldVal = localStorage.getItem(OLD_KEY);
            if (inputElem && oldVal) {
                const newVal = inputElem.value;
                if (newVal && newVal !== oldVal) {
                    // NEW_KEYを保存
                    localStorage.setItem(NEW_KEY, newVal);
                    localStorage.setItem(FLAG_KEY, Date.now().toString());
                    console.log('[分割伝票自動反映] NEW_KEYセット:', newVal);

                    let retry = 0;
                    const maxRetry = 20;
                    const interval = 250;
                    const doMark = () => {
                        let success = true;

                        const chk = document.getElementById('chk_kakunin_check_kbn');
                        if (chk && !chk.checked) {
                            chk.checked = true;
                            chk.dispatchEvent(new Event('change', { bubbles: true }));
                            console.log('[分割伝票自動反映] NEW側: チェックボックスON');
                        }
                        if (!chk) {
                            success = false;
                            console.log('[分割伝票自動反映] NEW側: チェックボックス未検出 リトライ', retry);
                        }

                        const tagArea = document.getElementById('jyuchu_tag');
                        let tagEdited = false;
                        if (tagArea) {
                            const addTag = '[入荷待ち]';
                            let currentTag = tagArea.value || '';
                            if (!currentTag.includes(addTag)) {
                                tagArea.value = currentTag + addTag;
                                tagArea.dispatchEvent(new Event('input', { bubbles: true }));
                                tagArea.dispatchEvent(new Event('change', { bubbles: true }));
                                tagEdited = true;
                                console.log('[分割伝票自動反映] NEW側: タグ欄追記', {before: currentTag, after: tagArea.value});
                            } else {
                                console.log('[分割伝票自動反映] NEW側: タグ欄既に[入荷待ち]含む');
                            }
                        }
                        if (!tagArea) {
                            success = false;
                            console.log('[分割伝票自動反映] NEW側: タグ欄未検出 リトライ', retry);
                        }

                        if (tagEdited) {
                            const editBtn = document.querySelector('a[onclick*="Element.show(\'jyuchu_tag\'"]');
                            if (editBtn) {
                                editBtn.click();
                                console.log('[分割伝票自動反映] NEW側: 編集ボタン自動クリック');
                            }
                            setTimeout(() => {
                                const closeBtn = document.querySelector('a[onclick*="tagshow()"]');
                                if (closeBtn) {
                                    closeBtn.click();
                                    console.log('[分割伝票自動反映] NEW側: 閉じるボタン自動クリック');
                                }
                            }, 10);
                        }

                        if (!success && retry < maxRetry) {
                            retry++;
                            setTimeout(doMark, interval);
                        }
                        if (success) {
                            setTimeout(() => {
                                reflectDenpyo();
                                localStorage.removeItem(OLD_KEY);
                                localStorage.removeItem(NEW_KEY);
                                console.log('[分割伝票自動反映] NEW側: キー削除完了');
                            }, 50);
                            console.log('[分割伝票自動反映] NEW側: すべて完了');
                        }
                    };
                    doMark();
                } else {
                    console.log('[分割伝票自動反映] NEW側: 伝票番号がOLDと同じ、NEW処理をスキップ');
                }
            }
        });

        window.addEventListener('storage', (event) => {
            if (event.key === FLAG_KEY) {
                console.log('[分割伝票自動反映] storageイベント受信、reflectDenpyo()実行');
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

        async function reflectDenpyo() {
            const textarea = document.getElementById('sagyosya_ran');
            if (!textarea) {
                console.log('[分割伝票自動反映] 履歴欄(sagyosya_ran)が見つかりません');
                return;
            }

            const oldVal = localStorage.getItem(OLD_KEY) || '';
            const newVal = localStorage.getItem(NEW_KEY) || '';
            console.log('[分割伝票自動反映] reflectDenpyo 実行', {oldVal, newVal});

            const oldLine = oldVal ? `（元伝: ${oldVal}）` : '';
            const newLine = newVal ? `${getTodayDate()}（分割: ${newVal}）` : '';

            const lines = [oldLine, newLine].filter(line => line !== '');

            if (lines.length === 0) {
                console.log('[分割伝票自動反映] reflectDenpyo: lines.length === 0 何も追記しません');
                return;
            }

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
            console.log('[分割伝票自動反映] 履歴欄追記 完了:', combinedText);
        }
    }

    denpyoBunkatsuAutoReflect();

})();
