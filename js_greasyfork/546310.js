// ==UserScript==
// @name         ComfyUI Font and Style Customizer
// @name:ja      ComfyUI フォント・スタイル調整スクリプト
// @namespace    https://greasyfork.org/ja/users/1091033-zalucas
// @version      1.0.1
// @description  Customizes the font size and styles of various elements in the ComfyUI interface for better readability.
// @description:ja ComfyUIの文字サイズやスタイルを調整し、見やすさを向上させるスクリプトです。
// @author       ai
// @match        http://127.0.0.1:8188/*
// @match        http://localhost:*/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/546310/ComfyUI%20Font%20and%20Style%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/546310/ComfyUI%20Font%20and%20Style%20Customizer.meta.js
// ==/UserScript==

/*
 * https://comfyui-wiki.com/ja/faq/how-to-change-font-size
 * ↑で紹介されているテーマをエクスポート→編集→インポートで行うプロパティ指定（の一部分）と、user.cssで行っていた指定を合わせてやるスクリプトです
 * 具体的なサイズ等は設定箇所をお好みで変更してください
 *
 * 設定は下記の「★★★ 設定箇所 ★★★」で囲まれた2つのセクションで行います。
 *
 */

(function() {
    'use strict';

    // ===================================================================================
    // ★★★ 設定箇所 1/2 ★★★
    // Canvas要素のスタイル設定 (JavaScript)
    // -----------------------------------------------------------------------------------
    // ここでは、LiteGraphがCanvasに直接描画するノード、線、文字などの見た目を調整します。
    // ===================================================================================
    function applyLiteGraphMods() {
        // フォント (ノードタイトルやスロット名など)
        window.LiteGraph.NODE_FONT = 'PlemolJP35'; // (Default: 'Arial')

        // ノードタイトルのスタイル
        window.LiteGraph.NODE_TEXT_SIZE = 20; // ノードタイトルのフォントサイズ (Default: 14)
        window.LiteGraph.NODE_TITLE_HEIGHT = 35; // ノードタイトルの高さ (Default: 30)
        window.LiteGraph.NODE_TITLE_TEXT_Y = 25; // タイトル表示位置の垂直方向オフセット (Default: 20)

        // ノード内部のスタイル
        window.LiteGraph.NODE_SUBTEXT_SIZE = 17; // ウィジェット内の文字サイズ（影響は多岐に渡る） (Default: 12)
        window.LiteGraph.NODE_SLOT_HEIGHT = 25; // 各スロット(入出力端子)の高さ（文字サイズに合わせて少し広げないとギチギチになる） (Default: 20)
        window.LiteGraph.NODE_WIDGET_HEIGHT = 25; // ウィジェット(モデル名表示など)の高さ (Default: 20)

        // プロパティはこちらを参考にして追加: https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/src/lib/litegraph/src/LiteGraphGlobal.ts
    }


    // ===================================================================================
    // ★★★ 設定箇所 2/2 ★★★
    // HTML要素のスタイル設定 (CSS)
    // -----------------------------------------------------------------------------------
    // ここでは、通常のHTML要素（プロンプト入力欄、右クリックメニューなど）のスタイルを
    // CSSで調整します。
    // ===================================================================================
    const customCSS = `
        /* プロンプト等の複数行入力欄 (Prompt text area) */
        .comfy-multiline-input {
            font-size: 22px !important;
            font-family: PlemolJP35 !important;
            padding: 0px 10px !important;
        }

        /* ノードやグループのタイトル変更中の入力欄 (Node/Group title editor) */
        .group-title-editor,
        .node-title-editor {
            font-size: 150% !important;
            height: 50px !important;
        }

        /* 右クリックメニューと、モデル名等をクリックした時に出る選択メニュー (Right-click context menu) */
        .litecontextmenu .litemenu-entry,
        .litegraph.litecontextmenu input {
            font-size: 17px !important;
            font-family: PlemolJP35 !important;
            padding: 3px !important;
        }

        /* ウィジェットの値をクリックした時のダイアログ (Widget value dialog, e.g., for seed number) */
        .litegraph .graphdialog .value {
            font-size: 17px !important;
            font-family: PlemolJP35 !important;
            padding: 3px !important;
        }

        /* Markdown Note (表示時) (Markdown Note node - view mode) */
        .comfy-markdown .tiptap {
            font-size: 200% !important;
            font-family: PlemolJP35 !important;
            padding: 10px !important;
        }

        /* Markdown Note (編集中) (Markdown Note node - edit mode) */
        .comfy-markdown.editing textarea {
            font-size: 200% !important;
            font-family: PlemolJP35 !important;
            padding: 10px !important;
        }

    `;


    // ===================================================================================
    // 以下、スクリプトの実行ロジック (通常は編集不要です)
    // Below is the script's execution logic. (No modification is usually needed)
    // ===================================================================================

    'use strict';
    let cssInjected = false;

    // ComfyUIの初期化が完了するのを待ってから設定を適用するための処理
    const readyCheckInterval = setInterval(() => {
        // --- CSSの適用処理 ---
        if (!cssInjected && document.head) {
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.innerHTML = customCSS;
            document.head.appendChild(styleElement);
            cssInjected = true;
            console.log('[ComfyUI-Customizer] Custom CSS has been injected.');
        }

        // --- LiteGraphのプロパティ変更処理 ---
        if (typeof window.LiteGraph !== 'undefined' && window.app && window.app.canvas) {
            clearInterval(readyCheckInterval); // 監視を停止

            console.log('[ComfyUI-Customizer] LiteGraph object found. Overriding settings...');
            applyLiteGraphMods();

            // 設定を反映させるために再描画をトリガー
            if (window.app && window.app.canvas) {
                console.log('[ComfyUI-Customizer] Triggering redraw...');
                window.app.canvas.draw(true, true);
            }
        }
    }, 100); // 100ミリ秒ごとにチェック
})();