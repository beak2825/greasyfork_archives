// ==UserScript==
// @name         Gemini New Chat Shortcut and QuickAccess Button
// @namespace    dev.kawaidainf.userscript
// @version      1.3
// @description  Geminiのチャット入力欄にフォーカスがあるときにCtrl+Shift+Oで新規チャットを開始し、画面右下に新規チャット用のカスタムアイコンボタンを追加します。
// @author       kawaida
// @match        https://gemini.google.com/*
// @grant        none
// @license      3-clause BSD License
// @downloadURL https://update.greasyfork.org/scripts/538379/Gemini%20New%20Chat%20Shortcut%20and%20QuickAccess%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/538379/Gemini%20New%20Chat%20Shortcut%20and%20QuickAccess%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Google Symbolsフォントを明示的に読み込むためのスタイルを追加する関数。
    // これにより、カスタムボタンでGoogle Symbolsのアイコンが確実に表示されるようにします。
    function loadGoogleSymbolsFont() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
        document.head.appendChild(link);
    }

    // 新規チャットボタンをクリックする共通の関数。
    // キーボードショートカットとカスタムアイコンボタンの両方から呼び出されます。
    function triggerNewChat() {
        // 新規チャットボタンをdata-test-id属性で検索します。
        // これがGeminiのUIで最も安定したセレクタであると見込まれます。
        const newChatButton = document.querySelector('[data-test-id="new-chat-button"] button');

        // もしボタンが見つかったら、クリックイベントをシミュレートします。
        if (newChatButton) {
            newChatButton.click();
            console.log('Geminiの新規チャットボタンがクリックされました。');
        } else {
            // ボタンが見つからなかった場合のメッセージを開発者コンソールに出力します。
            console.log('Geminiの新規チャットボタンが見つかりませんでした。セレクタを確認してください。');
        }
    }

    // カスタムアイコンボタンを作成する関数。
    function createCustomIconButton() {
        // 新しいボタン要素を作成します。
        const customIconButton = document.createElement('button');
        // ボタンにスタイルを適用して、画面の右下隅に固定表示します。
        customIconButton.style.position = 'fixed';    // 画面に固定表示
        customIconButton.style.bottom = '20px';       // 画面下から20pxの位置
        customIconButton.style.right = '20px';        // 画面右から20pxの位置
        customIconButton.style.zIndex = '10000';      // 他の要素の上に表示されるように、高いZ-indexを設定
        customIconButton.style.width = '48px';        // ボタンのサイズ (幅)
        customIconButton.style.height = '48px';       // ボタンのサイズ (高さ)
        customIconButton.style.borderRadius = '50%';  // 円形にする
        customIconButton.style.backgroundColor = '#1a73e8'; // 背景色をGoogle Geminiのテーマカラーに近い青色に設定
        customIconButton.style.border = 'none';       // 枠線をなくす
        customIconButton.style.display = 'flex';      // アイコンを中央に配置するためにflexboxを使用
        customIconButton.style.justifyContent = 'center'; // 水平方向の中央揃え
        customIconButton.style.alignItems = 'center'; // 垂直方向の中央揃え
        customIconButton.style.cursor = 'pointer';    // マウスカーソルをポインターにする
        customIconButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; // 影をつけて立体的に見せる
        customIconButton.style.transition = 'background-color 0.3s ease'; // ホバー時の色変化を滑らかにする

        // マウスがボタンに乗ったときのスタイルを定義します。
        customIconButton.onmouseover = function() {
            customIconButton.style.backgroundColor = '#155bb5'; // 少し濃い青色に変更
        };

        // マウスがボタンから離れたときのスタイルを定義します。
        customIconButton.onmouseout = function() {
            customIconButton.style.backgroundColor = '#1a73e8'; // 元の色に戻す
        };

        // Google Symbolsフォントのアイコン要素を作成します。
        const iconElement = document.createElement('span'); // span要素を使用
        iconElement.className = 'material-symbols-outlined'; // Google Symbolsフォントのクラス名
        iconElement.textContent = 'edit_square'; // アイコンの文字コード（編集アイコン）
        iconElement.style.color = 'white'; // アイコンの色を白色に設定
        iconElement.style.fontSize = '24px'; // アイコンのサイズ
        iconElement.style.lineHeight = '1'; // 行の高さを1にすることで、余計な上下の余白を減らします。
        iconElement.style.userSelect = 'none'; // テキスト選択を無効にします。

        // アイコンをボタンに追加します。
        customIconButton.appendChild(iconElement);

        // ボタンがクリックされたときのイベントリスナーを設定します。
        // triggerNewChat関数を呼び出して新規チャットを開始します。
        customIconButton.onclick = triggerNewChat;

        // 作成したカスタムボタンをページのbody要素に追加します。
        document.body.appendChild(customIconButton);
    }

    // --- ここから既存のキーボードショートカット機能です ---

    // キーボードのイベントを監視します。
    document.addEventListener('keydown', function(event) {
        // Ctrlキー (event.ctrlKey)、Shiftキー (event.shiftKey)、そして 'O' キー (event.code === 'KeyO') が
        // 同時に押されたかを検証します。
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyO') {
            // このショートカットキー（Ctrl+Shift+O）のブラウザによるデフォルトの動作を停止します。
            // これにより、ブラウザの履歴が開くなどの予期せぬ動作を防ぎます。
            event.preventDefault();

            // 共通の新規チャット開始関数を呼び出します。
            triggerNewChat();
        }
    });

    // --- 初期化処理です ---

    // ページが完全に読み込まれる前にGoogle Symbolsフォントを読み込みます。
    loadGoogleSymbolsFont();

    // ページが完全に読み込まれた後にカスタムボタンを作成するようにします。
    window.addEventListener('load', createCustomIconButton);

})();
