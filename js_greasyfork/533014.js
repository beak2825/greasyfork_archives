// ==UserScript==
// @name         東京科学大学理工学部ポータル自動認証システム
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  改良版：自動で学籍番号、パスワード、マトリクス暗号を入力し、低遅延で自動送信します
// @author       https://github.com/catyyy
// @match        https://portal.nap.gsic.titech.ac.jp/GetAccess/Login*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533014/%E6%9D%B1%E4%BA%AC%E7%A7%91%E5%AD%A6%E5%A4%A7%E5%AD%A6%E7%90%86%E5%B7%A5%E5%AD%A6%E9%83%A8%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E8%87%AA%E5%8B%95%E8%AA%8D%E8%A8%BC%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/533014/%E6%9D%B1%E4%BA%AC%E7%A7%91%E5%AD%A6%E5%A4%A7%E5%AD%A6%E7%90%86%E5%B7%A5%E5%AD%A6%E9%83%A8%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E8%87%AA%E5%8B%95%E8%AA%8D%E8%A8%BC%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // スタイル定義
    GM_addStyle(`
        .auth-helper {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 99999;
            min-width: 600px;
            font-family: 'Segoe UI', sans-serif;
        }
        .matrix-container {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 10px;
            margin: 1rem 0;
        }
        .row-labels {
            display: grid;
            gap: 5px;
            grid-template-rows: repeat(7, 45px);
        }
        .row-label {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .matrix-grid {
            display: grid;
            grid-template-columns: repeat(10, 45px);
            grid-auto-rows: 45px;
            gap: 5px;
        }
        .matrix-input {
            width: 100%;
            height: 100%;
            border: 2px solid #ddd;
            text-align: center;
            font-size: 16px;
            text-transform: uppercase;
            transition: all 0.3s;
            border-radius: 4px;
        }
        .matrix-input:focus {
            border-color: #2196F3;
            background: #e3f2fd;
            outline: none;
            box-shadow: 0 2px 6px rgba(33,150,243,0.3);
        }
        .col-labels {
            display: grid;
            grid-template-columns: repeat(10, 45px);
            gap: 5px;
            margin-bottom: 5px;
        }
        .col-label {
            text-align: center;
            font-weight: bold;
            color: #666;
        }
        .auth-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            background: #00C851;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            animation: slideIn 0.3s;
        }
        .auth-toast.error {
            background: #ff4444;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .save-footer {
            margin-top: 1rem;
            text-align: right;
        }
    `);

    // ストレージシステム
    const Storage = {
        getCredentials: () => {
            try {
                return JSON.parse(GM_getValue('auth_creds', '{}'));
            } catch (e) {
                showToast('設定の読み込みに失敗しました', 'error');
                return {};
            }
        },
        saveCredentials: (data) => {
            try {
                GM_setValue('auth_creds', JSON.stringify(data));
                return true;
            } catch (e) {
                showToast('保存に失敗しました: ストレージ容量不足', 'error');
                return false;
            }
        },
        getMatrixMap: () => {
            try {
                const map = JSON.parse(GM_getValue('matrix_map', '{}'));
                return Object.keys(map).length > 0 ? map : null;
            } catch (e) {
                return null;
            }
        },
        saveMatrixMap: (map) => {
            try {
                GM_setValue('matrix_map', JSON.stringify(map));
                return true;
            } catch (e) {
                showToast('マトリクス設定の保存に失敗しました', 'error');
                return false;
            }
        },
        isConfigured: () => {
            const creds = Storage.getCredentials();
            return !!creds.username && !!Storage.getMatrixMap();
        }
    };

    // UIコンポーネント：トーストメッセージ表示
    function showToast(message, type = 'info') {
        const toast = $(`<div class="auth-toast ${type === 'error' ? 'error' : ''}">${message}</div>`);
        $('body').append(toast);
        setTimeout(() => toast.fadeOut(), 2000);
    }

    // ログイン情報設定ウィザード
    function showCredentialWizard() {
        const creds = Storage.getCredentials() || {};
        const html = `
            <div class="auth-helper">
                <h3>🔑 ログイン情報設定</h3>
                <input type="text"
                       id="cred-username"
                       placeholder="学籍番号"
                       value="${creds.username || ''}"
                       style="margin: 8px 0; width: 100%; padding: 8px;">
                <input type="password"
                       id="cred-password"
                       placeholder="パスワード"
                       value="${creds.password || ''}"
                       style="margin: 8px 0; width: 100%; padding: 8px;">
                <div class="save-footer">
                    <button id="save-credentials"
                            style="background: #2196F3; color: white; padding: 8px 16px;">
                        保存して閉じる
                    </button>
                </div>
            </div>
        `;
        const $wrapper = $(html).appendTo('body');

        $('#save-credentials').on('click', function() {
            const data = {
                username: $('#cred-username').val().trim(),
                password: $('#cred-password').val().trim()
            };

            if (!data.username || !data.password) {
                showToast('すべての項目を入力してください', 'error');
                return;
            }

            if (Storage.saveCredentials(data)) {
                showToast('正常に保存されました');
                $wrapper.remove();
                if (!Storage.getMatrixMap()) {
                    showMatrixEditor(true);
                }
            }
        });
    }

    // マトリクスエディタ
    function showMatrixEditor(initialSetup = false) {
        let currentMap = Storage.getMatrixMap() || {};
        const colLabels = ['A','B','C','D','E','F','G','H','I','J'];

        let gridHTML = '';
        gridHTML += `<div class="col-labels">`;
        colLabels.forEach(label => gridHTML += `<div class="col-label">${label}</div>`);
        gridHTML += `</div>`;

        gridHTML += `<div class="matrix-container">`;
        gridHTML += `<div class="row-labels">`;
        for (let row = 1; row <= 7; row++) {
            gridHTML += `<div class="row-label">${row}</div>`;
        }
        gridHTML += `</div>`;

        gridHTML += `<div class="matrix-grid">`;
        for (let row = 1; row <= 7; row++) {
            colLabels.forEach(col => {
                const key = `${col},${row}`;
                gridHTML += `
                    <input type="text"
                           class="matrix-input"
                           data-key="${key}"
                           value="${currentMap[key] || ''}"
                           maxlength="1">
                `;
            });
        }
        gridHTML += `</div></div>`;

        const html = `
            <div class="auth-helper">
                <h3>🔢 マトリクス暗号設定</h3>
                ${gridHTML}
                <div class="save-footer">
                    <button id="save-matrix"
                            style="background: #4CAF50; color: white; padding: 8px 16px;">
                        保存して閉じる
                    </button>
                </div>
                <div style="margin-top:1rem; color:#666; font-size:0.9em;">
                    ※ 入力後自動で次のセルに移動（方向キーも使用可）
                </div>
            </div>
        `;
        const $wrapper = $(html).appendTo('body');
        const $inputs = $wrapper.find('.matrix-input');

        // 入力処理：大文字変換と自動移動
        $inputs.on('input', function() {
            const $input = $(this);
            const value = $input.val().toUpperCase();
            const key = $input.data('key');
            if (!/^[A-Z]$/.test(value)) {
                $input.val('');
                return;
            }
            currentMap[key] = value;
            moveToNextCell($input);
        });

        // キーボードナビゲーション
        $inputs.on('keydown', function(e) {
            const $input = $(this);
            const index = $inputs.index($input);
            const key = e.key.toLowerCase();
            const navigation = {
                arrowright: () => moveFocus(index + 1),
                arrowleft: () => moveFocus(index - 1),
                arrowdown: () => moveFocus(index + 10),
                arrowup: () => moveFocus(index - 10),
                enter: () => {
                    if (initialSetup) return;
                    moveToNextCell($input);
                }
            };
            if (navigation[key]) {
                e.preventDefault();
                navigation[key]();
            }
        });

        // 保存処理
        $('#save-matrix').on('click', function() {
            if (Object.keys(currentMap).length < 10) {
                showToast('少なくとも10セル以上入力してください', 'error');
                return;
            }
            if (Storage.saveMatrixMap(currentMap)) {
                showToast('マトリクス設定を保存しました');
                $wrapper.remove();
                if (initialSetup) {
                    showToast('初期設定が完了しました');
                }
            }
        });

        $inputs.first().focus();
    }

    // ナビゲーション補助
    function moveToNextCell($current) {
        const index = $('.matrix-input').index($current);
        moveFocus(index + 1);
    }
    function moveFocus(newIndex) {
        const $inputs = $('.matrix-input');
        newIndex = Math.max(0, Math.min(newIndex, $inputs.length - 1));
        $inputs.eq(newIndex).focus().select();
    }

    // 自動ログイン：学籍番号とパスワードを入力し、OK ボタンをクリック
    function autoLogin() {
        if (!Storage.isConfigured()) {
            showToast('初期設定が必要です', 'error');
            showCredentialWizard();
            return;
        }
        const creds = Storage.getCredentials();
        const $username = $('input[name="usr_name"]');
        const $password = $('input[name="usr_password"]');
        if ($username.length && $password.length) {
            $username.val(creds.username);
            $password.val(creds.password);
            $('input[name="OK"]').trigger('click');
        }
    }

    // 自動マトリクス入力：id="authentication" 内の各行を走査し、[B,4] 等のラベルに対応する値を入力
    function autoMatrixFill() {
        const matrixMap = Storage.getMatrixMap();
        if (!matrixMap) {
            showToast('マトリクス設定が未保存です', 'error');
            return;
        }
        $('#authentication tr').each(function() {
            const $tr = $(this);
            const labelText = $tr.find('th').first().text().trim();
            const m = labelText.match(/\[\s*([A-J])\s*,\s*(\d)\s*\]/);
            if (m) {
                const key = `${m[1]},${m[2]}`;
                const value = matrixMap[key] || '';
                $tr.find('input[type="password"]').val(value);
            }
        });
        // 入力完了後、500ms 遅延して OK ボタンを自動クリック
        setTimeout(() => {
            $('input[name="OK"]').trigger('click');
        }, 500);
    }

    // 右クリックメニューの登録
    GM_registerMenuCommand("⚙️ ログイン情報設定", () => showCredentialWizard());
    GM_registerMenuCommand("🔣 マトリクス設定", () => showMatrixEditor());

    // ページ読み込み完了時の処理
    $(document).ready(function() {
        if (location.href.includes('Login')) {
            if (Storage.isConfigured()) {
                autoLogin();
            } else {
                showCredentialWizard();
            }
        }
    });

    // すべての onLoad 処理完了後、150ms 遅延して自動マトリクス入力と自動送信を実行
    window.addEventListener('load', () => {
        setTimeout(autoMatrixFill, 150);
    });

})(jQuery);
