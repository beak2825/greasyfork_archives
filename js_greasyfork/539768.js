// ==UserScript==
// @name         SUUMO物件非表示マネージャ 🏠
// @name:ja      SUUMO物件非表示マネージャ 🏠
// @name:en      SUUMO Hidden Property Manager 🏠
// @version      3.7.1
// @description         SUUMOの検索結果（建物ごとに表示）で「非表示」ボタンから不要な物件を隠せる！モーダルUIから復活も簡単。保存はローカル。
// @description:ja      SUUMOの検索結果（建物ごとに表示）で「非表示」ボタンから不要な物件を隠せる！モーダルUIから復活も簡単。保存はローカル。
// @description:en      Hide unwanted listings in SUUMO's grouped-by-building search results! Restore via modal UI. Data saved locally.
// @namespace    https://github.com/koyasi777/suumo-hidden-property-manager
// @author       koyasi777
// @match        https://suumo.jp/jj/chintai/ichiran/FR*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/koyasi777/suumo-hidden-property-manager
// @supportURL   https://github.com/koyasi777/suumo-hidden-property-manager/issues
// @icon         https://suumo.jp/front/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/539768/SUUMO%E7%89%A9%E4%BB%B6%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%20%F0%9F%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/539768/SUUMO%E7%89%A9%E4%BB%B6%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%20%F0%9F%8F%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'suumoHiddenProperties';
    const PROPERTY_LI_PREFIX = 'property-li-';
    console.log('SUUMO非表示スクリプト: 実行開始');

    // --- データ管理ロジック (変更なし) ---
    const storage = {
        get: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
        save: (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
        add: (property) => {
            const properties = storage.get();
            if (!properties.some(p => p.id === property.id)) {
                properties.push(property);
                storage.save(properties);
            }
        },
        remove: (propertyId) => {
            let properties = storage.get();
            properties = properties.filter(p => p.id !== propertyId);
            storage.save(properties);
        },
        clear: () => localStorage.removeItem(STORAGE_KEY)
    };

    // --- UI/DOM操作 ---
    const ui = {
        injectCSS: () => {
            GM_addStyle(`
                /* ページスクロールロック用クラス */
                body.hide-modal-open { overflow: hidden; }

                .suumo-control-button {
                    padding: 8px 14px; color: white !important; border: none; cursor: pointer; border-radius: 4px; font-size: 14px; font-weight: bold;
                    font-family: "メイリオ", Meiryo, "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "ＭＳ Ｐゴシック", sans-serif;
                    line-height: 1.2; text-decoration: none !important; display: inline-block; white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: all 0.15s ease-in-out;
                }
                .suumo-control-button:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); filter: brightness(1.1); }
                .suumo-control-button:active { transform: translateY(1px); box-shadow: 0 1px 2px rgba(0,0,0,0.2); filter: brightness(0.95); }
                .suumo-control-button--small { padding: 5px 10px; font-size: 12px; font-weight: normal; }

                .hide-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9998; display: none; }
                .hide-modal-content {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; z-index: 9999; padding: 20px 30px;
                    border-radius: 8px; width: 90%; max-width: 600px; max-height: 80vh; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    display: none; flex-direction: column; overflow: hidden;
                }
                .hide-modal-header { display: flex; justify-content: flex-start; align-items: center; flex-shrink: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                .hide-modal-header h2 { margin: 0; font-family: "メイリオ", Meiryo, sans-serif; }
                .hide-modal-header .suumo-control-button { margin-left: 15px; }
                .hide-modal-close { position: absolute; top: 15px; right: 20px; font-size: 24px; font-weight: bold; cursor: pointer; color: #aaa; z-index: 10; }
                .hide-modal-body { flex-grow: 1; overflow-y: auto; margin-top: 15px; min-height: 0; }
                .hidden-property-list { list-style: none; padding: 0; }
                .hidden-property-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
                .hidden-property-info a { text-decoration: none; color: #0073e6; font-weight: bold; font-family: "メイリオ", Meiryo, sans-serif;}
                .hidden-property-info span { display: block; font-size: 0.9em; color: #555; font-family: "メイリオ", Meiryo, sans-serif;}
                .inquiry.inquiry--top { display: flex; justify-content: space-between; align-items: center; padding-right: 10px; }
            `);
        },
        createControls: () => {
            if (document.getElementById('suumo-hide-controls')) return;
            const targetParent = document.querySelector('.inquiry.inquiry--top');
            if (!targetParent) return;
            const manageButton = document.createElement('button');
            manageButton.type = 'button';
            manageButton.id = 'suumo-hide-controls';
            manageButton.textContent = '非表示リスト管理';
            manageButton.className = 'suumo-control-button';
            manageButton.style.backgroundColor = '#5bc0de';
            manageButton.addEventListener('click', () => ui.toggleModal(true));
            targetParent.appendChild(manageButton);
        },
        createModal: () => {
            if (document.getElementById('hide-modal')) return;
            document.body.insertAdjacentHTML('beforeend', `
                <div id="hide-modal-overlay" class="hide-modal-overlay"></div>
                <div id="hide-modal-content" class="hide-modal-content">
                    <span class="hide-modal-close">&times;</span>
                    <div class="hide-modal-header">
                        <h2>非表示物件リスト</h2>
                        <button id="restore-all-btn" class="suumo-control-button suumo-control-button--small" style="background-color: #f0ad4e;">全復活</button>
                    </div>
                    <div class="hide-modal-body">
                        <ul id="hidden-property-list" class="hidden-property-list"></ul>
                    </div>
                </div>
            `);
            document.getElementById('hide-modal-overlay').addEventListener('click', () => ui.toggleModal(false));
            document.querySelector('#hide-modal-content .hide-modal-close').addEventListener('click', () => ui.toggleModal(false));
            const restoreAllBtn = document.getElementById('restore-all-btn');
            restoreAllBtn.type = 'button';
            restoreAllBtn.addEventListener('click', () => {
                if (confirm('非表示中の全ての物件を復活させますか？')) {
                    const hiddenProperties = storage.get();
                    if(hiddenProperties.length === 0) {
                        alert('非表示の物件はありません。');
                        return;
                    }
                    hiddenProperties.forEach(p => ui.restoreProperty(p.id));
                    storage.clear();
                    ui.populateModal();
                    alert(`${hiddenProperties.length}件の物件を全て復活させました。`);
                }
            });
        },
        populateModal: () => {
            const listElement = document.getElementById('hidden-property-list');
            const hiddenProperties = storage.get();
            listElement.innerHTML = '';
            if (hiddenProperties.length === 0) {
                listElement.innerHTML = '<li>非表示中の物件はありません。</li>';
                return;
            }
            hiddenProperties.forEach(prop => {
                const listItem = document.createElement('li');
                listItem.id = `hidden-item-${prop.id}`;
                listItem.innerHTML = `<div class="hidden-property-info"><a href="${prop.url}" target="_blank" rel="noopener noreferrer">${prop.name}</a><span>${prop.rent}</span></div>`;
                const restoreButton = document.createElement('button');
                restoreButton.type = 'button';
                restoreButton.textContent = '復活';
                restoreButton.className = 'suumo-control-button';
                restoreButton.style.backgroundColor = '#5cb85c';
                restoreButton.addEventListener('click', () => {
                    storage.remove(prop.id);
                    ui.restoreProperty(prop.id);
                    listItem.remove();
                    if (document.querySelectorAll('#hidden-property-list li').length === 0) {
                       listElement.innerHTML = '<li>非表示中の物件はありません。</li>';
                    }
                });
                listItem.appendChild(restoreButton);
                listElement.appendChild(listItem);
            });
        },
        /* ===== ★スクロールロック機能を実装 ===== */
        toggleModal: (show) => {
            const overlay = document.getElementById('hide-modal-overlay');
            const content = document.getElementById('hide-modal-content');
            if (show) {
                document.body.classList.add('hide-modal-open'); // ページスクロールをロック
                ui.populateModal();
                overlay.style.display = 'block';
                content.style.display = 'flex'; // display:flexに戻す
            } else {
                document.body.classList.remove('hide-modal-open'); // ページスクロールのロックを解除
                overlay.style.display = 'none';
                content.style.display = 'none';
            }
        },
        restoreProperty: (propertyId) => {
            const propertyLi = document.getElementById(PROPERTY_LI_PREFIX + propertyId);
            if (propertyLi) {
                propertyLi.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                propertyLi.style.display = 'block';
                setTimeout(() => {
                    propertyLi.style.opacity = '1';
                    propertyLi.style.transform = 'scale(1)';
                }, 10);
            }
        }
    };

    // --- メイン処理ロジック ---
    function processPropertyItems() {
        const hiddenIds = storage.get().map(p => p.id);
        hiddenIds.forEach(hiddenId => {
            const propLi = document.getElementById(PROPERTY_LI_PREFIX + hiddenId);
            if (propLi && propLi.style.display !== 'none') {
                propLi.style.display = 'none';
                propLi.style.opacity = '0';
            }
        });
        const propertyItems = document.querySelectorAll('.cassetteitem:not(.hide-processed)');
        propertyItems.forEach(item => {
            item.classList.add('hide-processed');
            const checkbox = item.querySelector('input.js-single_checkbox[type="checkbox"]');
            const bukkenId = checkbox ? checkbox.value : null;
            if (!bukkenId) return;
            const parentLi = item.closest('li');
            if (!parentLi) return;
            parentLi.id = PROPERTY_LI_PREFIX + bukkenId;
            if (hiddenIds.includes(bukkenId)) {
                if (parentLi.style.display !== 'none') {
                    parentLi.style.display = 'none';
                    parentLi.style.opacity = '0';
                }
                return;
            }
            const buttonContainer = item.querySelector('.cassetteitem_other-col09');
            if (buttonContainer && !buttonContainer.querySelector('.hide-property-button')) {
                const hideButton = document.createElement('button');
                hideButton.type = 'button';
                hideButton.textContent = '非表示';
                hideButton.className = 'suumo-control-button hide-property-button';
                hideButton.style.cssText = 'background-color: #d9534f; margin-top: 5px;';
                hideButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const name = item.querySelector('.cassetteitem_content-title')?.textContent.trim() || '物件名不明';
                    const rent = item.querySelector('.cassetteitem_price--rent')?.textContent.trim() || '賃料不明';
                    const url = item.querySelector('.js-cassette_link_href')?.href || '#';
                    if (confirm(`【${name}】を非表示にしますか？`)) {
                        storage.add({ id: bukkenId, name, rent, url });
                        parentLi.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        parentLi.style.opacity = '0';
                        parentLi.style.transform = 'scale(0.95)';
                        setTimeout(() => { parentLi.style.display = 'none'; }, 400);
                    }
                });
                buttonContainer.appendChild(hideButton);
            }
        });
    }

    // --- 初期化と監視 ---
    function init() {
        ui.injectCSS();
        ui.createModal();
        const observer = new MutationObserver(() => {
            if (!document.getElementById('suumo-hide-controls')) {
                ui.createControls();
            }
            processPropertyItems();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        ui.createControls();
        processPropertyItems();
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
