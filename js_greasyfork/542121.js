// ==UserScript==
// @name          あの頃の自作TCGアシスタント
// @namespace     http://tampermonkey.net/
// @version       1.8.1 // バージョンを更新
// @description   unityroomの『あの頃の自作TCG』をより深く、より楽しくプレイするための様々な機能を提供します。（Replitバックエンド版）
// @author        Omezi
// @match         https://unityroom.com/games/anokorotcg*
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.deleteValue
// @grant         GM.listValues
// @grant         GM.xmlHttpRequest
// @grant         GM_addStyle
// @connect       generativelanguage.googleapis.com
// @connect       omezi42.github.io
// @connect       anokoro-tcg-api.onrender.com
// @connect       *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542121/%E3%81%82%E3%81%AE%E9%A0%83%E3%81%AE%E8%87%AA%E4%BD%9CTCG%E3%82%A2%E3%82%B7%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542121/%E3%81%82%E3%81%AE%E9%A0%83%E3%81%AE%E8%87%AA%E4%BD%9CTCG%E3%82%A2%E3%82%B7%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================================
    // 0. 環境設定・定数
    // ====================================================================

    // ★★★ ここにデプロイしたReplit WebサーバーのURLを貼り付けてください ★★★
    const REPLIT_WEB_APP_URL = 'https://anokoro-tcg-api.onrender.com';

    // === 画像ファイルのベースURL設定 ===
    const CARD_IMAGE_BASE_URL = "https://omezi42.github.io/tcg-assistant-images/images/cards/";
    const DEFAULT_PLACEHOLDER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    // CSS変数定義 (変更なし)
    GM_addStyle(`
        /* css/style.css */
        :root {
            --sidebar-width: 500px;
            --icon-button-size: 60px;
            --toggle-button-size: 50px;
            --menu-expanded-width: var(--icon-button-size);
            --menu-collapsed-width: 0px;
            --total-menu-width-when-expanded: calc(var(--icon-button-size));
        }
        #tcg-right-menu-container {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: width 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease, border-radius 0.3s ease;
            padding-bottom: calc(var(--toggle-button-size) + 10px);
            box-sizing: border-box;
            width: var(--toggle-button-size);
            background-color: transparent;
            box-shadow: none;
            border-radius: 0;
            padding-top: 0;
        }
        #tcg-right-menu-container.expanded {
            width: calc(var(--icon-button-size) + 20px);
            background-color: #333;
            padding-top: 10px;
            box-shadow: -3px 0 8px rgba(0,0,0,0.6);
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        .tcg-menu-icons-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            flex-grow: 1;
            width: var(--menu-expanded-width);
            overflow: hidden;
            transition: opacity 0.3s ease;
            opacity: 1;
            pointer-events: auto;
            box-sizing: border-box;
        }
        .tcg-menu-icons-wrapper.hidden {
            opacity: 0;
            pointer-events: none;
        }
        .tcg-menu-icons-wrapper.visible {
            opacity: 1;
            pointer-events: auto;
        }
        .tcg-menu-icon {
            background: none;
            border: none;
            color: #f0f0f0;
            font-size: 28px;
            padding: 10px;
            cursor: pointer;
            width: var(--icon-button-size);
            height: var(--icon-button-size);
            text-align: center;
            transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
        }
        .tcg-menu-icon:hover {
            background-color: #444;
            color: white;
            transform: scale(1.05);
        }
        .tcg-menu-icon.active {
            background-color: #007bff;
            color: white;
            box-shadow: inset 0 0 8px rgba(0, 123, 255, 0.5);
        }
        .tcg-menu-toggle-button {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #333;
            border: none;
            color: #f0f0f0;
            font-size: 28px;
            cursor: pointer;
            padding: 10px;
            width: var(--toggle-button-size);
            height: var(--toggle-button-size);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
            border-radius: 10px 0 0 10px;
            box-sizing: border-box;
        }
        .tcg-menu-toggle-button:hover {
            background-color: #444;
            color: white;
            transform: scale(1.05);
        }
        #tcg-content-area {
            position: fixed;
            top: 0;
            right: calc(-1 * var(--sidebar-width));
            width: var(--sidebar-width);
            height: 100%;
            background-color: #ffffff;
            color: #222;
            z-index: 9990;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            transition: right 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
            overflow-y: hidden;
            border-left: 2px solid #e0e0e0;
            box-shadow: -5px 0 15px rgba(0,0,0,0.3);
        }
        #tcg-content-area.active {
            right: 0;
        }
        @media (max-width: 768px) {
            :root {
                --sidebar-width: 80vw;
            }
        }
        @media (max-width: 480px) {
            :root {
                --sidebar-width: 100vw;
                --icon-button-size: 50px;
                --toggle-button-size: 40px;
                --menu-expanded-width: var(--icon-button-size);
                --total-menu-width-when-expanded: calc(var(--icon-button-size));
            }
            .tcg-menu-icon {
                font-size: 24px;
                padding: 8px;
            }
            .tcg-menu-toggle-button {
                font-size: 24px;
                padding: 8px;
            }
            .rate-match-actions button {
                font-size: 14px;
                padding: 10px 12px;
            }
            .section-title {
                font-size: 1.4em;
            }
        }
        #tcg-sections-wrapper {
            flex-grow: 1;
            padding: 25px;
            overflow-y: auto;
            position: relative;
        }
        .tcg-section {
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            padding-top: 10px;
        }
        .tcg-section.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        .section-title {
            color: #5cb85c;
            margin-bottom: 25px;
            font-size: 2.2em;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        h3 {
            color: #007bff;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.6em;
        }
        h4 {
            color: #ffc107;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        #tcg-custom-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        #tcg-custom-dialog-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .tcg-modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        #tcg-modal-content.show .tcg-modal-content {
            transform: scale(1);
        }
        .tcg-modal-content h3 {
            color: #5cb85c;
            margin-bottom: 20px;
        }
        .tcg-modal-content p {
            font-size: 1.1em;
            margin-bottom: 25px;
            color: #555;
        }
        .tcg-modal-content button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.2s ease;
        }
        .tcg-modal-content button:hover {
            background-color: #0056b3;
        }
        .rate-match-info {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin-top: 20px;
        }
        .rate-match-info .info-box {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 15px 20px;
            text-align: left;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rate-match-info .info-box h3 {
            color: #007bff;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        .rate-match-info .info-box p {
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            margin-top: 0;
            margin-bottom: 5px;
        }
        #matching-button {
            display: block;
            width: calc(100% - 40px);
            margin: 20px auto;
            padding: 15px 25px;
            background-color: #5cb85c;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.5em;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 10px rgba(0,0,0,0.3);
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
        #matching-button:hover {
            background-color: #449d44;
            transform: translateY(-3px);
        }
        #matching-status {
            text-align: center;
            margin-top: 20px;
            font-size: 1.2em;
            font-weight: bold;
            color: #555;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #007bff;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .rate-match-section-content {
            margin-top: 30px;
        }
        .rate-match-section-content h3 {
            margin-top: 20px;
            font-size: 1.5em;
        }
        .rate-match-actions {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 25px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .rate-match-actions button {
            flex: 1;
            min-width: 120px;
            background-color: #ffc107;
            color: black;
            border: none;
            padding: 12px 15px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 15px;
            font-weight: bold;
            box-shadow: 0 3px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease, transform 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .rate-match-actions button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .rate-match-actions button.win {
            background-color: #28a745;
            color: white;
        }
        .rate-match-actions button.lose {
            background-color: #dc3545;
            color: white;
        }
        .chat-fixed-phrases {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .chat-fixed-phrases button {
            background-color: #e9ecef;
            color: #495057;
            border: 1px solid #ced4da;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background-color 0.2s ease;
        }
        .chat-fixed-phrases button:hover {
            background-color: #dee2e6;
        }
        #screenshot-button {
            background-color: #17a2b8;
            color: white;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease;
        }
        #screenshot-button:hover {
            background-color: #138496;
        }
        #screenshot-area {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
            min-height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fcfcfc;
            border-radius: 10px;
        }
        #screenshot-area img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #memo-text-area {
            width: calc(100% - 20px);
            padding: 10px;
            margin-top: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 1em;
            min-height: 120px;
            resize: vertical;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }
        #save-memo-button {
            background-color: #5cb85c;
            color: white;
            border: none;
            padding: 12px 25px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 16px;
            margin-top: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease;
        }
        #save-memo-button:hover {
            background-color: #449d44;
        }
        #saved-memos-list {
            list-style: none;
            padding: 0;
            margin-top: 30px;
        }
        .saved-memo-item {
            background-color: #f0f8ff;
            border: 1px solid #d0e0f0;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 10px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            position: relative;
            padding-right: 40px;
            word-wrap: break-word;
        }
        .saved-memo-item strong {
            color: #007bff;
            display: block;
            margin-bottom: 5px;
            font-size: 0.9em;
        }
        .delete-memo-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #dc3545;
            font-size: 1.2em;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .delete-memo-button:hover {
            color: #a71d2a;
        }
        .edit-memo-button {
            position: absolute;
            top: 10px;
            right: 40px;
            background: none;
            border: none;
            color: #17a2b8;
            font-size: 1.2em;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .edit-memo-button:hover {
            color: #138496;
        }
        .memo-filter-area {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            margin-top: 20px;
        }
        .memo-filter-area input {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .memo-filter-area button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
        }
        .memo-filter-area button:hover {
            background-color: #0056b3;
        }
        #screenshot-overlay .tcg-modal-content > div:last-child {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        .search-filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f8f8;
            border: 1px solid #eee;
            border-radius: 10px;
        }
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .filter-group label {
            font-weight: bold;
            color: #555;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .filter-group input[type="text"],
        .filter-group input[type="number"],
        .filter-group select {
            padding: 8px;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-size: 0.9em;
            width: 100%;
            box-sizing: border-box;
        }
        .filter-group span {
            align-self: center;
            font-weight: bold;
            color: #777;
        }
        #search-input {
            width: calc(100% - 22px);
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 1.1em;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }
        #perform-search-button {
            background-color: #6f42c1;
            color: white;
            border: none;
            padding: 12px 25px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease;
        }
        #perform-search-button:hover {
            background-color: #5f37a8;
        }
        #search-results {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            padding: 20px;
            min-height: 150px;
            margin-top: 30px;
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }
        #search-results ul {
            list-style: disc;
            padding-left: 25px;
        }
        #search-results li {
            margin-bottom: 8px;
        }
        .autocomplete-suggestions {
            border: 1px solid #ddd;
            max-height: 150px;
            overflow-y: auto;
            background-color: white;
            position: absolute;
            width: calc(100% - 50px);
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-radius: 5px;
        }
        .autocomplete-suggestions div {
            padding: 8px 10px;
            cursor: pointer;
        }
        .autocomplete-suggestions div:hover {
            background-color: #f0f0f0;
        }
        .card-detail-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            padding: 25px;
            z-index: 10003;
            max-width: 500px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
        }
        .card-detail-popup h3 {
            color: #007bff;
            margin-top: 0;
        }
        .card-detail-popup button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
        }
        .card-detail-popup button:hover {
            background-color: #5a6268;
        }
        .minigame-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .minigame-list button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 15px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .minigame-list button:hover {
            background-color: #5a6268;
            transform: translateY(-3px);
        }
        .quiz-container {
            background-color: #f8f8f8;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 20px;
            text-align: center;
        }
        .quiz-container h3 {
            color: #5cb85c;
            margin-bottom: 20px;
        }
        .quiz-hint-area {
            background-color: #e9ecef;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            min-height: 80px;
            text-align: left;
            font-size: 1.1em;
            color: #495057;
            white-space: pre-wrap;
        }
        .quiz-image-area {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            height: 250px;
        }
        /* Canvasを削除し、imgタグを追加 */
        .quiz-image-area img {
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .quiz-input-area {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            justify-content: center;
        }
        .quiz-input-area input[type="text"] {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 1em;
            max-width: 300px;
        }
        .quiz-input-area button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.2s ease;
        }
        .quiz-input-area button:hover {
            background-color: #0056b3;
        }
        .quiz-result-area {
            margin-top: 20px;
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
        }
        .quiz-result-area.correct {
            color: #28a745;
        }
        .quiz-result-area.incorrect {
            color: #dc3545;
        }
        .quiz-answer-display {
            margin-top: 15px;
            font-size: 1.1em;
            color: #555;
        }
        .quiz-controls {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .quiz-controls button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.2s ease;
        }
        .quiz-controls button:hover {
            background-color: #5a6268;
        }
        .battle-record-tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 5px;
            flex-wrap: wrap;
        }
        .battle-record-tab-button {
            background-color: #f0f2f5;
            color: #555;
            border: 1px solid #e0e0e0;
            border-bottom: none;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            transition: background-color 0.2s ease, color 0.2s ease;
            flex-grow: 1;
            text-align: center;
            min-width: 120px;
        }
        .battle-record-tab-button:hover {
            background-color: #e0e0e0;
        }
        .battle-record-tab-button.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
            box-shadow: 0 -2px 5px rgba(0,123,255,0.2);
        }
        .battle-record-tab-content {
            display: none;
            padding: 15px 0;
        }
        .battle-record-tab-content.active {
            display: block;
        }
        .battle-record-form, .deck-management-section {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            margin-top: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .battle-record-form label, .deck-management-section label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
        }
        .battle-record-form input[type="text"],
        .battle-record-form input[type="number"],
        .battle-record-form select,
        .battle-record-form textarea,
        .deck-management-section input[type="text"],
        .deck-management-section select,
        .deck-management-section input[type="file"] {
            width: calc(100% - 20px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 1em;
            box-sizing: border-box;
        }
        .battle-record-form button, .deck-management-section button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 1em;
            font-weight: bold;
            transition: background-color 0.2s ease;
        }
        .battle-record-form button:hover {
            background-color: #218838;
        }
        .deck-management-section h4 {
            margin-top: 25px;
            color: #007bff;
        }
        #registered-decks-list {
            list-style: none;
            padding: 0;
            margin-top: 15px;
        }
        #registered-decks-list li {
            background-color: #e9f7ef;
            border: 1px solid #c9e6d3;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #registered-decks-list .delete-registered-deck-button {
            background: none;
            border: none;
            color: #dc3545;
            font-size: 1.1em;
            cursor: pointer;
            padding: 5px;
        }
        .delete-registered-deck-button:hover {
            color: #a71d2a;
        }
        #battle-stats {
            background-color: #f0f8ff;
            border: 1px solid #d0e0f0;
            border-radius: 12px;
            padding: 20px;
            margin-top: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        #battle-stats p {
            font-size: 1.1em;
            margin-bottom: 5px;
            color: #333;
        }
        #battle-stats h4 {
            color: #007bff;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        #battle-stats ul {
            list-style: none;
            padding: 0;
            margin-left: 10px;
        }
        #battle-stats li {
            margin-bottom: 3px;
            color: #444;
        }
        .chart-placeholder {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background-color: #e9ecef;
            border-radius: 8px;
        }
        .chart-placeholder img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
        }
        #battle-records-list {
            list-style: none;
            padding: 0;
            margin-top: 0;
        }
        .battle-record-item {
            background-color: #e6f7ff;
            border: 1px solid #b3e0ff;
            padding: 15px;
            margin-bottom: 12px;
            border-radius: 10px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            position: relative;
            padding-right: 40px;
            word-wrap: break-word;
        }
        .battle-record-item strong {
            color: #0056b3;
            display: block;
            margin-bottom: 5px;
            font-size: 0.9em;
        }
        .battle-record-item .delete-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #dc3545;
            font-size: 1.1em;
            cursor: pointer;
        }
        .battle-record-item .delete-button:hover {
            color: #a71d2a;
        }
        .deck-analysis-section button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            border-radius: 8px;
            font-size: 1em;
            font-weight: bold;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .deck-analysis-section button:hover {
            background-color: #0056b3;
        }
    `);

    // HTMLコンテンツの定義 (変更なし)
    const HTML_CONTENTS = {
        popup: `
            <div id="tcg-right-menu-container">
                <div class="tcg-menu-icons-wrapper">
                    <button class="tcg-menu-icon" data-section="home" title="ホーム"><i class="fas fa-home"></i></button>
                    <button class="tcg-menu-icon" data-section="rateMatch" title="レート戦"><i class="fas fa-fist-raised"></i></button>
                    <button class="tcg-menu-icon" data-section="memo" title="メモ"><i class="fas fa-clipboard"></i></button>
                    <button class="tcg-menu-icon" data-section="search" title="検索"><i class="fas fa-search"></i></button>
                    <button class="tcg-menu-icon" data-section="minigames" title="ミニゲーム"><i class="fas fa-gamepad"></i></button>
                    <button class="tcg-menu-icon" data-section="battleRecord" title="戦いの記録"><i class="fas fa-trophy"></i></button>
                </div>
                <button class="tcg-menu-toggle-button" id="tcg-menu-toggle-button" title="メニューを隠す/表示">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <div id="tcg-content-area">
                <div id="tcg-sections-wrapper">
                    <div id="tcg-home-section" class="tcg-section"></div>
                    <div id="tcg-rateMatch-section" class="tcg-section"></div>
                    <div id="tcg-memo-section" class="tcg-section"></div>
                    <div id="tcg-search-section" class="tcg-section"></div>
                    <div id="tcg-minigames-section" class="tcg-section"></div>
                    <div id="tcg-battleRecord-section" class="tcg-section"></div>
                </div>
            </div>

            <div id="tcg-custom-dialog-overlay" class="tcg-modal-overlay" style="display: none;">
                <div class="tcg-modal-content">
                    <h3 id="tcg-dialog-title"></h3>
                    <p id="tcg-dialog-message"></p>
                    <button id="tcg-dialog-ok-button">OK</button>
                    <button id="tcg-dialog-cancel-button" style="margin-left: 10px; background-color: #6c757d; display: none;">キャンセル</button>
                </div>
            </div>
        `,
        home: `
            <h2 class="section-title">ホーム</h2>
            <p>あの頃の自作TCGアシスタントへようこそ！</p>
            <p>この拡張機能は、unityroomの『あの頃の自作TCG』をより深く、より楽しくプレイするための様々な機能を提供します。</p>
            <p>ゲーム体験を拡張し、あなたの戦略をサポートします！</p>
            <p>新しい機能や改善にご期待ください！</p>

            <h3>拡張機能でできること</h3>

            <div class="feature-section">
                <h4><i class="fas fa-fist-raised"></i> レート戦のサポート</h4>
                <p>現在のレートやマッチング状況をリアルタイムで確認できます。対戦相手とのチャット機能や、勝利・敗北の報告もスムーズに行えます。</p>
            </div>

            <div class="feature-section">
                <h4><i class="fas fa-clipboard"></i> 戦略メモ機能</h4>
                <p>対戦中の気づきやアイデアをすぐにメモできます。スクリーンショット機能で、盤面状況を記録することも可能です。</p>
            </div>

            <div class="feature-section">
                <h4><i class="fas fa-search"></i> カード検索機能</h4>
                <p>あいまい検索や、カードタイプ・収録セットによる絞り込み検索で、目的のカード情報を素早く見つけられます。カードの詳細情報も一目で確認できます。</p>
            </div>

            <div class="feature-section">
                <h4><i class="fas fa-gamepad"></i> ミニゲームで息抜き</h4>
                <p>カード名当てクイズやイラストクイズなど、ちょっとした時間に楽しめるミニゲームで気分転換しましょう。</p>
            </div>

            <div class="feature-section">
                <h4><i class="fas fa-trophy"></i> 戦いの記録</h4>
                <p>自分のデッキと相手のデッキ、そして勝敗を記録し、戦績を管理できます。あなたの成長を可視化し、次の戦略に活かしましょう。</p>
            </div>

            <p style="margin-top: 30px; text-align: center; font-style: italic; color: #666;">
                この拡張機能は、あなたの『あの頃の自作TCG』ライフをより豊かにするために開発されています。
            </p>

            <h3>役立つリンク集</h3>
            <ul>
                <li><a href="https://unityroom.com/games/anokorotcg" target="_blank">『あの頃の自作TCG』ゲーム本体</a></li>
                <li><a href="https://anokorotcg-arena.vercel.app/" target="_blank">『あの頃の自作TCG』アリーナ</a></li>
                <li><a href="https://w.atwiki.jp/anokorotcg/" target="_blank">非公式Wiki</a></li>
                <li><a href="https://discord.gg/2rz3JpTbrA" target="_blank">公式Discord</a></li>
            </ul>
        `,
        rateMatch: `
            <h2 class="section-title">レート戦</h2>
            <div class="rate-match-info">
                <div class="info-box">
                    <h3>現在のレート</h3>
                    <p id="rate-display">1500</p>
                </div>
                <div class="info-box">
                    <h3>あなたのID</h3>
                    <p id="user-id-display">未ログイン</p>
                </div>
            </div>

            <div id="pre-match-ui">
                <button id="matching-button">オンラインマッチング</button>
                <h3>プレイヤー名設定</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                    <input type="text" id="display-name-input" placeholder="新しいプレイヤー名を入力" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                    <button id="save-display-name-button" style="background-color: #5cb85c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">保存</button>
                </div>
                <h3>対戦履歴</h3>
                <ul id="match-history-list">
                </ul>
                <h3>ランキング</h3>
                <ul id="leaderboard-list">
                    <li>ランキングを読み込み中...</li>
                </ul>
            </div>

            <div id="matching-status" style="display: none;">
                <p>対戦相手を検索中...</p>
                <div class="spinner"></div>
                <button id="cancel-matching-button" class="cancel-button">マッチングキャンセル</button>
            </div>

            <div id="post-match-ui" style="display: none;">
                <h4>チャット</h4>
                <div id="chat-messages" style="height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background-color: #f9f9f9; border-radius: 8px;">
                    <p><strong>[システム]:</strong> 対戦が始まりました！</p>
                </div>
                <div class="chat-fixed-phrases">
                    <button class="chat-phrase-button">よろしくお願いします！</button>
                    <button class="chat-phrase-button">ナイスゲームでした！</button>
                    <button class="chat-phrase-button">GG</button>
                    <button class="chat-phrase-button">対戦ありがとうございました！</button>
                </div>
                <div style="display: flex; gap: 5px;">
                    <input type="text" id="chat-input" placeholder="メッセージを入力..." style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                    <button id="send-chat-button" style="background-color: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">送信</button>
                </div>
                <h4>対戦結果報告</h4>
                <div class="rate-match-actions">
                    <button id="win-button" class="win"><i class="fas fa-check-circle"></i> 勝利</button>
                    <button id="lose-button" class="lose"><i class="fas fa-times-circle"></i> 敗北</button>
                    <button id="cancel-button"><i class="fas fa-stop-circle"></i> 対戦中止</button>
                </div>
            </div>
        `,
        memo: `
            <h2 class="section-title">メモ</h2>
            <p>対戦中の気づきやアイデアを保存できます。</p>
            <div id="screenshot-area">
                <p>スクリーンショットがここに表示されます。（画像をここに貼り付けることもできます - Ctrl+V / Cmd-V）</p>
            </div>
            <textarea id="memo-text-area" placeholder="メモを入力してください..." rows="5"></textarea>
            <button id="save-memo-button"><i class="fas fa-save"></i> メモを保存</button>
            <h3>過去のメモ</h3>
            <div class="memo-filter-area">
                <input type="text" id="memo-search-input" placeholder="メモを検索...">
                <button id="memo-search-button"><i class="fas fa-filter"></i> フィルタ</button>
            </div>
            <ul id="saved-memos-list">
            </ul>
        `,
        search: `
            <h2 class="section-title">検索</h2>
            <p>「あいまい検索」や「世界観からの検索」などを実装。</p>
            <div class="search-filters">
                <div class="filter-group">
                    <label for="search-text-target"><i class="fas fa-font"></i> テキスト対象:</label>
                    <select id="search-text-target">
                        <option value="all">全て</option>
                        <option value="name">カード名</option>
                        <option value="effect">効果</option>
                        <option value="lore">世界観</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="search-filter-type"><i class="fas fa-tags"></i> タイプ:</label>
                    <select id="search-filter-type">
                        <option value="">全て</option>
                        <option value="モンスター">モンスター</option>
                        <option value="魔法">魔法</option>
                        <option value="罠">罠</option>
                        <option value="エネルギー">エネルギー</option>
                        <option value="フィールド">フィールド</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="search-filter-set"><i class="fas fa-box"></i> セット:</label>
                    <select id="search-filter-set">
                        <option value="">全て</option>
                    </select>
                </div>
            </div>
            <div style="position: relative;">
                <input type="text" id="search-input" placeholder="キーワードで検索...">
                <div id="autocomplete-suggestions" class="autocomplete-suggestions" style="display: none;"></div>
            </div>
            <button id="perform-search-button"><i class="fas fa-search"></i> 検索実行</button>
            <div id="search-results">
            </div>
        `,
        minigames: `
            <h2 class="section-title">ミニゲーム</h2>
            <p>ミニゲームで息抜き！</p>
            <div class="minigame-list">
                <button id="quiz-card-name"><i class="fas fa-question-circle"></i> カード名当てクイズ</button>
                <button id="quiz-illustration-enlarge"><i class="fas fa-image"></i> イラスト拡大クイズ</button>
                <button id="quiz-illustration-silhouette"><i class="fas fa-palette"></i> イラストシルエットクイズ</button>
                <button id="quiz-illustration-mosaic"><i class="fas fa-th-large"></i> イラストモザイク化クイズ</button>
            </div>

            <div id="quiz-display-area" class="quiz-container" style="display: none;">
                <h3 id="quiz-title"></h3>
                <div class="quiz-hint-area" id="quiz-hint-area"></div>
                <div class="quiz-image-area" id="quiz-image-area">
                    <!-- 表示用のimgタグ -->
                    <img id="quiz-display-image" class="quiz-image" alt="クイズ画像" style="display: none; max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                </div>
                <div class="quiz-input-area">
                    <input type="text" id="quiz-answer-input" placeholder="カード名を入力">
                    <button id="quiz-submit-button">解答</button>
                </div>
                <div class="quiz-result-area" id="quiz-result-area"></div>
                <div class="quiz-answer-display" id="quiz-answer-display"></div>
                <div class="quiz-controls">
                    <button id="quiz-next-button" style="display: none;">次のヒント/問題</button>
                    <button id="quiz-reset-button">リセット</button>
                </div>
            </div>
        `,
        battleRecord: `
            <h2 class="section-title">戦いの記録</h2>
            <p>対戦記録とデッキの勝率を管理できます。</p>

            <div class="battle-record-tabs">
                <button class="battle-record-tab-button active" data-tab="new-record"><i class="fas fa-plus-circle"></i> 新しい対戦記録</button>
                <button class="battle-record-tab-button" data-tab="deck-management"><i class="fas fa-layer-group"></i> デッキ管理</button>
                <button class="battle-record-tab-button" data-tab="stats-summary"><i class="fas fa-chart-bar"></i> 集計結果</button>
                <button class="battle-record-tab-button" data-tab="past-records"><i class="fas fa-history"></i> 過去の対戦記録</button>
            </div>

            <div id="battle-record-tab-new-record" class="battle-record-tab-content active">
                <div class="battle-record-form">
                    <label for="my-deck-select">自分のデッキ名:</label>
                    <select id="my-deck-select">
                        <option value="">登録済みデッキから選択</option>
                    </select>

                    <label for="opponent-deck-select">相手のデッキ名:</label>
                    <select id="opponent-deck-select">
                        <option value="">登録済みデッキから選択</option>
                    </select>

                    <label for="win-loss-select">勝敗:</label>
                    <select id="win-loss-select">
                        <option value="win">勝利</option>
                        <option value="lose">敗北</option>
                    </select>

                    <label for="first-second-select">先攻/後攻:</label>
                    <select id="first-second-select">
                        <option value="">選択してください</option>
                        <option value="first">先攻</option>
                        <option value="second">後攻</option>
                    </select>

                    <label for="notes-textarea">特記事項 (任意):</label>
                    <textarea id="notes-textarea" placeholder="メモや反省点など" rows="3"></textarea>

                    <button id="save-battle-record-button"><i class="fas fa-save"></i> 記録を保存</button>
                </div>
            </div>

            <div id="battle-record-tab-deck-management" class="battle-record-tab-content">
                <div class="deck-management-section">
                    <div class="deck-register-form">
                        <label for="new-deck-name">デッキ名:</label>
                        <input type="text" id="new-deck-name" placeholder="新しいデッキ名">
                        <label for="new-deck-type">デッキタイプ:</label>
                        <select id="new-deck-type">
                            <option value="">選択してください</option>
                            <option value="アグロ">アグロ</option>
                            <option value="コントロール">コントロール</option>
                            <option value="ミッドレンジ">ミッドレンジ</option>
                            <option value="コンボ">コンボ</option>
                            <option value="その他">その他</option>
                        </select>
                        <button id="register-deck-button"><i class="fas fa-plus"></i> デッキを登録</button>
                    </div>
                    <h4>登録済みデッキリスト</h4>
                    <ul id="registered-decks-list">
                        <li>まだ登録されたデッキがありません。</li>
                    </ul>
                </div>
            </div>

            <div id="battle-record-tab-stats-summary" class="battle-record-tab-content">
                <div id="battle-stats">
                    <p>総対戦数: <span id="total-games">0</span></p>
                    <p>勝利数: <span id="total-wins">0</span></p>
                    <p>敗北数: <span id="total-losses">0</span></p>
                    <p>勝率: <span id="win-rate">0.00%</span></p>
                    <p>先攻勝率: <span id="first-win-rate">0.00%</span></p>
                    <p>後攻勝率: <span id="second-win-rate">0.00%</span></p>

                    <h4>自分のデッキタイプ別勝率</h4>
                    <div id="my-deck-type-win-rates">
                    </div>
                    <h4>相手のデッキタイプ別勝率</h4>
                    <div id="opponent-deck-type-win-rates">
                    </div>

                    <h4><i class="fas fa-dice-d20"></i> デッキ別詳細分析</h4>
                    <label for="selected-deck-for-stats">デッキを選択:</label>
                    <select id="selected-deck-for-stats">
                        <option value="">全てのデッキ</option>
                    </select>
                    <div id="selected-deck-stats-detail">
                    </div>
                </div>
            </div>

            <div id="battle-record-tab-past-records" class="battle-record-tab-content">
                <h3><i class="fas fa-history"></i> 過去の対戦記録リスト</h3>
                <ul id="battle-records-list">
                    <li>まだ対戦記録がありません。</li>
                </ul>
            </div>
        `,
        options: `
            <!DOCTYPE html>
            <html>
            <head>
                <title>TCGアシスタント設定</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        width: 400px;
                        padding: 20px;
                        background-color: #f0f2f5;
                        color: #333;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                        border-radius: 10px;
                        margin: 20px auto;
                        text-align: center;
                    }
                    h1 {
                        color: #28a745;
                        margin-bottom: 20px;
                        border-bottom: 1px solid #e0e0e0;
                        padding-bottom: 10px;
                    }
                    p {
                        font-size: 1.1em;
                        color: #555;
                    }
                    .info-box {
                        background-color: #e6f7ff;
                        border: 1px solid #b3e0ff;
                        border-radius: 8px;
                        padding: 15px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>あの頃の自作TCGアシスタント設定</h1>
                <p>このページは現在開発中です。</p>
                <div class="info-box">
                    <p>今後、通知設定やUIテーマの変更などのオプションがここに追加される予定です。</p>
                </div>
            </body>
            </html>
        `
    };

    const ALL_CARDS_DATA = [
  {
    "name": "スライム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「様々な場所に生息するジェル上の生物。友好的で他の種族の個体と協力するシーンも目にすることができる。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「ス」です。"
    ],
    "image_filename": "Slime"
  },
  {
    "name": "剣ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「一般的なゴブリンの戦闘兵。ほぼ自身の身長と同じ長さの剣を振るい、勇敢に戦う。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「剣」です。"
    ],
    "image_filename": "SwordGoblin"
  },
  {
    "name": "ウミガメ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「エース海と呼ばれる海に生息するカメ。頑丈な甲羅と推進力を得る丈夫な前足により敵を寄せ付けない。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「ウ」です。"
    ],
    "image_filename": "SeaTurtle"
  },
  {
    "name": "ゴーレム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別はゴーレムです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「太古の文明の防御装置として造られた兵器。森林のあちこちに残骸があり、今でも突如起動する個体がある。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「ゴ」です。"
    ],
    "image_filename": "Golem"
  },
  {
    "name": "ドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「大きな翼と鋭い爪、長い尻尾を持つドラゴン。実は空を飛ぶことが少なく目撃情報があまり無い。噂では森林の地下空洞に住んでいるとされている。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「ド」です。"
    ],
    "image_filename": "Dragon"
  },
  {
    "name": "テントウムシ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコ,虫です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「多くの場所に存在する虫。背中の星の数は品種によって異なる。」です。",
      "このカードの効果は、「破壊時、1枚引く。」です。",
      "このカードの1文字目は、「テ」です。"
    ],
    "image_filename": "Ladybug"
  },
  {
    "name": "ウサギ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「森に生息する長い耳を持つ動物。可愛らしい見た目から、ペットにする人が後を絶たない。」です。",
      "このカードの効果は、「場に出た時、自分を300回復。」です。",
      "このカードの1文字目は、「ウ」です。"
    ],
    "image_filename": "Rabbit"
  },
  {
    "name": "ガーゴイル",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水,像です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「屋根に取り付けられる像。雨の時に水流を整えるために設置される。まれに動く個体もいるのだとか……。」です。",
      "このカードの効果は、「攻撃できない。相手のモンスターはプレイヤーに攻撃できない。」です。",
      "このカードの1文字目は、「ガ」です。"
    ],
    "image_filename": "Gargoyle"
  },
  {
    "name": "シカ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「大きな角を持つ動物。基本的に逃げる姿勢を見せる臆病さを持つが、実は野生界の王を虎視眈々と狙っている。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。」です。",
      "このカードの1文字目は、「シ」です。"
    ],
    "image_filename": "Deer"
  },
  {
    "name": "ミノタウロス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は巨人です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「牛の頭を持つ人型の化物。大きな斧と盾を持ち、パワフルな近接戦闘を行う。立派な角は戦闘用ではなく、自身のアピールに使われる。」です。",
      "このカードの効果は、「モンスターへの攻撃時、相手に（これのパワー-それのパワー）ダメージ。」です。",
      "このカードの1文字目は、「ミ」です。"
    ],
    "image_filename": "Minotaur"
  },
  {
    "name": "休息",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「500, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「旅人の譲れない時間。」です。",
      "このカードの効果は、「自分を500回復。1枚引く。」です。",
      "このカードの1文字目は、「休」です。"
    ],
    "image_filename": "Rest"
  },
  {
    "name": "落石",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 900」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「山の怒りが希望を打ち砕く。」です。",
      "このカードの効果は、「相手のモンスター1体に900ダメージ。」です。",
      "このカードの1文字目は、「落」です。"
    ],
    "image_filename": "Rockfall"
  },
  {
    "name": "知識の波",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「知は無限をもたらす。」です。",
      "このカードの効果は、「2枚引く。」です。",
      "このカードの1文字目は、「知」です。"
    ],
    "image_filename": "WaveOfKnowledge"
  },
  {
    "name": "魔術書",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「全てはここから。」です。",
      "このカードの効果は、「1枚引く。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "MagicBook"
  },
  {
    "name": "火の輪",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「700」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「焼き尽くすまで留まることはない。」です。",
      "このカードの効果は、「相手に700ダメージ。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "RingOfFire"
  },
  {
    "name": "氷の雨",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「400」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「凍てつく涙が降り注ぐ。」です。",
      "このカードの効果は、「相手のモンスター全てを-400。」です。",
      "このカードの1文字目は、「氷」です。"
    ],
    "image_filename": "IceRain"
  },
  {
    "name": "霧中",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「400」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「音と光が吸い込まれ、自らさえも見失う。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時]相手に400ダメージ。」です。",
      "このカードの1文字目は、「霧」です。"
    ],
    "image_filename": "InTheFog"
  },
  {
    "name": "藪蛇",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「400」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「運命は見えざる場所で決まっている。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時]それを-400。」です。",
      "このカードの1文字目は、「藪」です。"
    ],
    "image_filename": "BushSnake"
  },
  {
    "name": "傷薬",
    "info": [
      "このカードは罠です。",
      "この罠は自分がダメージを受けた時に発動します。",
      "このカードのテキストに含まれる数値は、「700」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「これを塗ればドラゴンにかじられても平気！…たぶん。」です。",
      "このカードの効果は、「[自分がダメージを受けた時]自分を700回復。」です。",
      "このカードの1文字目は、「傷」です。"
    ],
    "image_filename": "HealingPotion"
  },
  {
    "name": "盗み",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「気づいた時にはすでに手遅れ。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時]1枚引く。」です。",
      "このカードの1文字目は、「盗」です。"
    ],
    "image_filename": "Theft"
  },
  {
    "name": "冒険者",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「あなたがこの世界に降り立った時、仮にヒトの体を受け取っていたなら、どのような人生を歩むのだろうか。」です。",
      "このカードの効果は、「自分のターン終了時、これを+100。」です。",
      "このカードの1文字目は、「冒」です。"
    ],
    "image_filename": "Adventurer"
  },
  {
    "name": "石鎚の鍛治師",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「見たこともない村に足を踏み入れ、入念な準備をするだろう。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから[装備]か「武装強化」1枚までを手札に加える。（2）自分のデッキから[装備]か「武装強化」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「石」です。"
    ],
    "image_filename": "StoneHammerBlacksmith"
  },
  {
    "name": "魔石の精霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は妖精です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「言葉の無い案内人に助けを求める時もあるだろう。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから1コスト以下の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "MagicStoneSpirit"
  },
  {
    "name": "熟達の女騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「偶然の出会いが、旅路を進む力になる時があるかもしれない。」です。",
      "このカードの効果は、「場に出た時、相手の2コスト以下のモンスター1体を破壊する。（2）これは「相手のターン終了時まで攻撃されない。」を持つ。」です。",
      "このカードの1文字目は、「熟」です。"
    ],
    "image_filename": "SkilledFemaleKnight"
  },
  {
    "name": "遺跡の護り手",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「時には恐怖を覚えることもあるだろう。」です。",
      "このカードの効果は、「相手のモンスターは相手の攻撃済みのモンスターがいるなら攻撃できない。（1ターン中に1回までしか攻撃できない。攻撃済みのモンスターが場から離れたら攻撃できる。）（8）自分のデッキから「遺跡の護り手」1体までを出す。」です。",
      "このカードの1文字目は、「遺」です。"
    ],
    "image_filename": "RuinsGuardian"
  },
  {
    "name": "再起の天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は光,天使です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「人知を超えた力に包まれ、無限の可能性が目の前に訪れることさえ珍しくはないかもしれない。」です。",
      "このカードの効果は、「場に出た時、自分のモンスター全てをアンタップする。（3）自分の捨て札からモンスター1枚までを手札に加える。」です。",
      "このカードの1文字目は、「再」です。"
    ],
    "image_filename": "AngelOfRebirth"
  },
  {
    "name": "ゼウス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは10です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は雷,神です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「あなたが持つその全てが、世界の理を塗り替えることになる鍵になり得るのだ。」です。",
      "このカードの効果は、「場に出た時、これのみが場にいるなら、これは「場に出たターンでも攻撃できる。」を持つ。（相手のモンスターも参照する）（これをタップ）他のモンスター全てを破壊する。」です。",
      "このカードの1文字目は、「ゼ」です。"
    ],
    "image_filename": "Zeus"
  },
  {
    "name": "石の剣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 300」です。",
      "このカードの種別は装備です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「未来を切り開くための一歩。」です。",
      "このカードの効果は、「[ヒト]か[騎士]1体を+300。」です。",
      "このカードの1文字目は、「石」です。"
    ],
    "image_filename": "StoneSword"
  },
  {
    "name": "討伐依頼",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 3」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「真の目的を見失ってはいけない。」です。",
      "このカードの効果は、「モンスター1体は「破壊時、相手は3枚引く。」を持つ。」です。",
      "このカードの1文字目は、「討」です。"
    ],
    "image_filename": "SubjugationRequest"
  },
  {
    "name": "緑の大地",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1, 3」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、プレイヤーレベルです。",
      "このカードの世界観は、「道を進むことだけが、前進を意味する訳では無い。」です。",
      "このカードの効果は、「自分のデッキからエネルギー1枚までをタップして出す。自分は3枚引く。」です。",
      "このカードの1文字目は、「緑」です。"
    ],
    "image_filename": "GreenLand"
  },
  {
    "name": "焦げスライム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「主に火山地帯に生息するスライム。元々敵の多い種だが、環境までもが襲いかかる過酷な環境であるため警戒心が強い。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。」です。",
      "このカードの1文字目は、「焦」です。"
    ],
    "image_filename": "ScorchedSlime"
  },
  {
    "name": "採掘ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「武器加工用の鉱石を調達するゴブリン。なぜか噴火頻度が高い火山を好み、噴火に巻き込まれて命を落とす者が後を絶たない。」です。",
      "このカードの効果は、「（これを破壊する）デッキから\"火山弾\"1枚を手札に加える。」です。",
      "このカードの1文字目は、「採」です。"
    ],
    "image_filename": "MiningGoblin"
  },
  {
    "name": "悪戯フェアリー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は妖精です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「出会った生物に悪戯を仕掛けた後、数分前までの記憶を消す魔法を使い、それを自分の存在ごと抹消する妖精。そのせいか姿があまり認知されていない。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。場に出た時、相手のモンスター1体の効果を消す。」です。",
      "このカードの1文字目は、「悪」です。"
    ],
    "image_filename": "MischievousFairy"
  },
  {
    "name": "血の鎌使い",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別はヒト,悪魔です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「非人道的な戦い方をしていた戦士が、死神と契約し悪魔へと姿を変え強大な力を手にした姿。鎌にこびりついた血は洗われることはない。」です。",
      "このカードの効果は、「攻撃時、自分に500ダメージ。」です。",
      "このカードの1文字目は、「血」です。"
    ],
    "image_filename": "BloodScytheWielder"
  },
  {
    "name": "火の魔法使い",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は火,ヒトです。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「元は魔法族の村の定食屋で働いていた。ある時火を自在に操る能力があることに気付き料理長にまで昇進したものの、その後魔法使いとしての道を選んだ。」です。",
      "このカードの効果は、「場に出た時、相手に500ダメージ。（3）デッキから[火]1枚を手札に加える。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "FireMage"
  },
  {
    "name": "魔法陣詠唱機",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「誰もが魔法陣を扱えるようにと造られた機械。旧式の戦闘兵器を改造しており、攻撃機能と移動能力に制限をかけることでエネルギーを魔法陣生成に集中させる。」です。",
      "このカードの効果は、「攻撃できない。（これをタップ）デッキから2コスト以下のモンスター1体を出す。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "MagicCircleChanter"
  },
  {
    "name": "炎の精霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は火,妖精です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「温度の高い場所を好む精霊。体の形を自在に変化させ敵に素早く接近する。生命維持に多くのエネルギーを必要とし、かなり好戦的である。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。攻撃時、相手に300ダメージ。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameSpirit"
  },
  {
    "name": "ブレイズドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は火,ドラゴンです。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「火山の直下、マグマ流れる地底を住処とする。巨大な熱放散機関は、過剰なエネルギーを捨てて休眠期間に入る目的で使われるが、攻撃手段として用いる様子も目撃されている。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体に1000ダメージ。（これをタップ）相手に700ダメージ。」です。",
      "このカードの1文字目は、「ブ」です。"
    ],
    "image_filename": "BlazeDragon"
  },
  {
    "name": "火山弾",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 500」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「活発な火山活動を続けるペトラ山は、その昔多くの生物を焼き払った。」です。",
      "このカードの効果は、「相手か相手のモンスター1体に500ダメージ。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "VolcanicBomb"
  },
  {
    "name": "補給物資",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「500, 3」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、str01-灼熱竜の咆哮です。",
      "このカードの世界観は、「険しい道が続く登山ではこれがなければ命を落としたも同然である。」です。",
      "このカードの効果は、「自分のモンスター全てを+500。3枚引く。」です。",
      "このカードの1文字目は、「補」です。"
    ],
    "image_filename": "Supplies"
  },
  {
    "name": "水の精霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は水,妖精です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「水辺で集団生活をする精霊。他の精霊と比べて知性が高く友好的であり、旅人とのコミュニケーションを楽しむこともある。」です。",
      "このカードの効果は、「場に出た時、1枚引く。」です。",
      "このカードの1文字目は、「水」です。"
    ],
    "image_filename": "WaterSpirit"
  },
  {
    "name": "魔力炉",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は火,機械です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「古代の戦闘兵器の心臓部を改造して作られた装置。火力をエネルギーに変換する機構が組み込まれている。」です。",
      "このカードの効果は、「攻撃できない。攻撃されない。自分のターン終了時、1枚引く。（3）1枚引く。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "ManaFurnace"
  },
  {
    "name": "金貨の悪魔",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は悪魔です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「ヒトからキラキラしたものを奪う悪魔。その中でも特に金貨に興味を示し、貨幣での取引を理解している。金貨さえ用意すれば、取引に応じてくれることもあるのだとか。」です。",
      "このカードの効果は、「（2）自分に500ダメージ、デッキからエネルギー1枚をタップ状態でチャージする。（5）自分を1000回復。」です。",
      "このカードの1文字目は、「金」です。"
    ],
    "image_filename": "GoldCoinDemon"
  },
  {
    "name": "歪な氷像",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは9です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は水,ゴーレムです。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「大氷原に生息する巨大なゴーレム。コアの魔力により氷を吸着させることで身体を保つ。吹雪で視界が悪い時期では、その巨大さ故に氷山と見分けがつかない。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。場に出た時と破壊時、ランダムな相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「歪」です。"
    ],
    "image_filename": "DistortedIceStatue"
  },
  {
    "name": "転換",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「その火は水から生まれることもある。」です。",
      "このカードの効果は、「自分のエネルギー1枚を破壊する。デッキからエネルギー1枚をタップ状態でチャージする。」です。",
      "このカードの1文字目は、「転」です。"
    ],
    "image_filename": "Conversion"
  },
  {
    "name": "拡散炎",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「300」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「火の魔術の原点、そして到達点。」です。",
      "このカードの効果は、「相手のモンスター全てに300ダメージ。」です。",
      "このカードの1文字目は、「拡」です。"
    ],
    "image_filename": "SpreadingFlame"
  },
  {
    "name": "緑化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「誰も気には留めないところで、繁栄への道は進んでいる。」です。",
      "このカードの効果は、「デッキからエネルギー1枚をタップ状態でチャージする。1枚引く。」です。",
      "このカードの1文字目は、「緑」です。"
    ],
    "image_filename": "Greening"
  },
  {
    "name": "森焼き",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 700, 2」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「火の不始末は命の不始末。」です。",
      "このカードの効果は、「相手のモンスター1体に700ダメージ。これを2回行う。」です。",
      "このカードの1文字目は、「森」です。"
    ],
    "image_filename": "ForestBurning"
  },
  {
    "name": "繁茂する根",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターの攻撃時に発動します。",
      "このカードのテキストに含まれる数値は、「500」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「それは冷たい絶望だけを残す。」です。",
      "このカードの効果は、「[相手のモンスターの攻撃時]自分を500回復。自分のモンスター全てを全回復。」です。",
      "このカードの1文字目は、「繁」です。"
    ],
    "image_filename": "ThrivingRoots"
  },
  {
    "name": "氷壁",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターの攻撃時に発動します。",
      "このカードのテキストに含まれる数値は、「0, 1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、str02-立ちはだかる氷像です。",
      "このカードの世界観は、「弱き者を救い悪しき者を大地に還す。」です。",
      "このカードの効果は、「[相手のモンスターの攻撃時]それが与えるダメージを0にする。1枚引く。」です。",
      "このカードの1文字目は、「氷」です。"
    ],
    "image_filename": "IceWall"
  },
  {
    "name": "チビドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「生まれたばかりのドラゴン。種類によって骨格や模様は千差万別。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「チ」です。"
    ],
    "image_filename": "ChibiDragon"
  },
  {
    "name": "刃尾の竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「尻尾の先端に骨と同じ素材でできた刃を持つドラゴン。飛行能力はあまり高くなく普段は木の上で生活をする。」です。",
      "このカードの効果は、「（2）相手に300ダメージ。」です。",
      "このカードの1文字目は、「刃」です。"
    ],
    "image_filename": "BladeTailDragon"
  },
  {
    "name": "竜術師",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「幼いころに両親を亡くし、野生の竜と生活を共にするが、他の種族との戦闘により竜までもを失う。そのことから竜術師として修行を始め、禁断の竜術の習得を目指す。」です。",
      "このカードの効果は、「手札の[竜術]のコスト-1。場に出た時、デッキから[竜術]1枚を手札に加える。」です。",
      "このカードの1文字目は、「竜」です。"
    ],
    "image_filename": "DragonSorcerer"
  },
  {
    "name": "毒沼の竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は毒,ドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「森林地帯の内部に存在する毒沼に生息するドラゴン。特殊な外皮と毒を分解する成分を持ち、沼の毒を戦闘手段として用いる。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体を-300。（7）相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「毒」です。"
    ],
    "image_filename": "PoisonSwampDragon"
  },
  {
    "name": "鋼翼の竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「金属質な鱗を持つドラゴン。羽と体の一部が硬質化しており、他の生物や環境から身を守ることができる。」です。",
      "このカードの効果は、「これが受けるダメージを-300。」です。",
      "このカードの1文字目は、「鋼」です。"
    ],
    "image_filename": "SteelWingDragon"
  },
  {
    "name": "アイスドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は水,ドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「氷雪地帯を縄張りとするドラゴン。高い運動能力を持ちつつ、吹雪や雨を味方に奇襲を仕掛ける戦略性の高い戦闘を行う。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。場に出た時、2枚引く。」です。",
      "このカードの1文字目は、「ア」です。"
    ],
    "image_filename": "IceDragon"
  },
  {
    "name": "バーンドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は火,ドラゴンです。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「かなり高度な空まで飛ぶことができる強靭な体力を持つドラゴン。炎を吐くことができるが、基本的にはその図体を活かした格闘を行う。」です。",
      "このカードの効果は、「攻撃されない。場に出たターンでも攻撃できる。」です。",
      "このカードの1文字目は、「バ」です。"
    ],
    "image_filename": "BurnDragon"
  },
  {
    "name": "呼竜術",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は竜術です。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「その詞は大いなる力を呼ぶ。」です。",
      "このカードの効果は、「デッキから[ドラゴン]1枚を手札に加える。」です。",
      "このカードの1文字目は、「呼」です。"
    ],
    "image_filename": "DragonCallingArt"
  },
  {
    "name": "活竜術",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 300」です。",
      "このカードの種別は竜術です。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「その詞は覇気を纏わせる。」です。",
      "このカードの効果は、「（自分の[ドラゴン]の数×1）枚引く。自分を（自分の[ドラゴン]の数×300）回復。」です。",
      "このカードの1文字目は、「活」です。"
    ],
    "image_filename": "DragonActivationArt"
  },
  {
    "name": "波竜術",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「600, 600」です。",
      "このカードの種別は竜術です。",
      "このカードの収録セットは、str03-古の竜術です。",
      "このカードの世界観は、「その詞は咆哮を嵐へと変える。」です。",
      "このカードの効果は、「相手のモンスター全てに600ダメージ。自分の[ドラゴン]が場にいるなら、相手に600ダメージ。」です。",
      "このカードの1文字目は、「波」です。"
    ],
    "image_filename": "DragonWaveArt"
  },
  {
    "name": "王国の槍騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「王国の部隊に所属する騎士。槍と盾を標準装備としており、リーチと防御力で白兵戦を優位に進める。」です。",
      "このカードの効果は、「アンタップ中は攻撃されない。」です。",
      "このカードの1文字目は、「王」です。"
    ],
    "image_filename": "KingdomSpearKnight"
  },
  {
    "name": "王国の弓騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「王国の部隊に所属する、弓を持つ騎士。戦地に赴き弓矢での戦闘を行う他、拠点や砦の防衛も行う。」です。",
      "このカードの効果は、「（これをタップ）相手のモンスター1体に（これのパワー×1）ダメージ。」です。",
      "このカードの1文字目は、「王」です。"
    ],
    "image_filename": "KingdomBowKnight"
  },
  {
    "name": "銅剣の騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「銅剣を持つ王国の傭兵。正規部隊との判別をつけるため、それらと外観の異なる武器と鎧を持つ。」です。",
      "このカードの効果は、「（2）これを+300。」です。",
      "このカードの1文字目は、「銅」です。"
    ],
    "image_filename": "CopperSwordKnight"
  },
  {
    "name": "部隊指揮官",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「前線部隊で指揮を取る騎士。戦況を汲み取り、最適な戦闘手段を支持しつつ自らも剣を振るう。」です。",
      "このカードの効果は、「場に出た時、自分の[騎士]1体を+300。（3）デッキから2コスト以下の[騎士]1体を出す。」です。",
      "このカードの1文字目は、「部」です。"
    ],
    "image_filename": "UnitCommander"
  },
  {
    "name": "王国の参謀",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「数多の戦法から戦に最適なものを支持する元戦闘部隊の長。戦闘計画の思考だけでなく、騎士の指導補助も行う。」です。",
      "このカードの効果は、「場に出た時、デッキから[戦法]1枚を手札に加える。（これをタップ）デッキから[戦法]1枚を手札に加える。」です。",
      "このカードの1文字目は、「王」です。"
    ],
    "image_filename": "KingdomStrategist"
  },
  {
    "name": "王国の騎士団長",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「王国騎士団の長。実は複数の騎士団をまとめている者もいる。また、騎士団の規模が大きい場合中間役の指揮官が存在することもある。王国の試験に合格しなければ団長の紋章は得られない。」です。",
      "このカードの効果は、「場に出た時、手札かデッキから2コスト以下の[騎士]2体までを出す。（4）相手のモンスター1体に（自分のモンスターの数×300）ダメージ。」です。",
      "このカードの1文字目は、「王」です。"
    ],
    "image_filename": "KingdomKnightCommander"
  },
  {
    "name": "整備",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は戦法です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「何事もまずは準備から。」です。",
      "このカードの効果は、「自分のモンスター1体を全回復。1枚引く。」です。",
      "このカードの1文字目は、「整」です。"
    ],
    "image_filename": "Maintenance"
  },
  {
    "name": "集団戦法",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 300」です。",
      "このカードの種別は戦法です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「団結こそが最大の武器である。」です。",
      "このカードの効果は、「相手のモンスター1体に（自分のモンスターの数×300）ダメージ。」です。",
      "このカードの1文字目は、「集」です。"
    ],
    "image_filename": "GroupStrategy"
  },
  {
    "name": "武装強化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 600」です。",
      "このカードの種別は戦法です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「鋼の鎧に宿るは、勝利への渇望。」です。",
      "このカードの効果は、「自分のモンスター1体を+600。」です。",
      "このカードの1文字目は、「武」です。"
    ],
    "image_filename": "ArmedEnhancement"
  },
  {
    "name": "崖上からの奇襲",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「3, 1, 1」です。",
      "このカードの種別は戦法です。",
      "このカードの収録セットは、str04-王国騎士団です。",
      "このカードの世界観は、「目に見えるものだけが全てではない。」です。",
      "このカードの効果は、「手札かデッキから3コスト以下の[騎士]1体を出す。ランダムな相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「崖」です。"
    ],
    "image_filename": "CliffsideAmbush"
  },
  {
    "name": "羊歯の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「シダ植物に擬態した魔物。体がとても軽く、葉のような翼で滑空移動する。」です。",
      "このカードの効果は、「破壊時、1枚引く。」です。",
      "このカードの1文字目は、「羊」です。"
    ],
    "image_filename": "FernMonster"
  },
  {
    "name": "裂爪のラプトル",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「素早い動きが特徴の小型の恐竜。群れで生活をし、他の恐竜や動物を捕食する。」です。",
      "このカードの効果は、「（自分の他の[恐竜][獣]1体を破壊）相手のモンスター1体に500ダメージ。」です。",
      "このカードの1文字目は、「裂」です。"
    ],
    "image_filename": "RaptorOfTornClaws"
  },
  {
    "name": "古代樹の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「遥か昔から存在する品種の樹に宿った魔物。地面に根付いており、大地のエネルギーを吸収して成長する。」です。",
      "このカードの効果は、「攻撃できない。（1）デッキからエネルギー1枚を手札に加える。」です。",
      "このカードの1文字目は、「古」です。"
    ],
    "image_filename": "AncientTreeMonster"
  },
  {
    "name": "翠の古代魚",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「翠の鱗が特徴の古代魚。巨大な個体が多く、活発に活動する。」です。",
      "このカードの効果は、「破壊時、自分を300回復、1枚引く。」です。",
      "このカードの1文字目は、「翠」です。"
    ],
    "image_filename": "EmeraldAncientFish"
  },
  {
    "name": "鉄鎧のアンキロ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「丈夫な鎧のような甲羅をまとった恐竜。天敵から身を守る手段として、ハンマーのような尻尾も持っている。」です。",
      "このカードの効果は、「これが受けるダメージ-300。（自分の他の[植物]1体を破壊）2枚引く。」です。",
      "このカードの1文字目は、「鉄」です。"
    ],
    "image_filename": "IronArmoredAnkylo"
  },
  {
    "name": "堅盾のトリケラ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「大きなフリルと長い角で身を守る草食の恐竜。基本的におとなしい性格だが戦闘能力は高い。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。（自分の他の[植物]1体を破壊）これを+300、自分を700回復。」です。",
      "このカードの1文字目は、「堅」です。"
    ],
    "image_filename": "SolidShieldTricera"
  },
  {
    "name": "刀羽のプテラ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「巨大な翼を持つ翼竜。厳密には恐竜ではない。魚を主食とする、鳥のような生態をしている。」です。",
      "このカードの効果は、「攻撃されない。（自分の他の[魚]1体を破壊）相手に500ダメージ。」です。",
      "このカードの1文字目は、「刀」です。"
    ],
    "image_filename": "BladeWingPtera"
  },
  {
    "name": "暴牙のティラノ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「生態系の頂点に位置する恐竜。肉食で気性が荒く、様々な恐竜や動物を襲う。」です。",
      "このカードの効果は、「（自分の他の[恐竜][獣]1体を破壊）これを+300、これに「場に出たターンでも攻撃できる。」を与える。（9）相手に1400ダメージ。」です。",
      "このカードの1文字目は、「暴」です。"
    ],
    "image_filename": "FierceFangTyranno"
  },
  {
    "name": "招かれざる恐怖",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1000」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「恐怖からは隠れきれない。」です。",
      "このカードの効果は、「[恐竜]が場に無い時は使えない。相手のモンスター1体に1000ダメージ。」です。",
      "このカードの1文字目は、「招」です。"
    ],
    "image_filename": "UninvitedTerror"
  },
  {
    "name": "悪意の芽吹",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、str05-太古の覇者です。",
      "このカードの世界観は、「敵は知らず知らずに増えている。」です。",
      "このカードの効果は、「デッキから1コスト以下の[植物]2体までを出す。」です。",
      "このカードの1文字目は、「悪」です。"
    ],
    "image_filename": "SproutOfMalice"
  },
  {
    "name": "ブレードゾンビ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はゾンビです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「亡者が謎のウイルスに感染して蘇った姿。死因となった武器を持つ習性がある。」です。",
      "このカードの効果は、「場に出た時、自分のモンスター1体にカウンター2個を乗せる。」です。",
      "このカードの1文字目は、「ブ」です。"
    ],
    "image_filename": "BladeZombie"
  },
  {
    "name": "ポイズンゾンビ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は毒,ゾンビです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「謎のウイルスが元より毒性のあるキノコに感染し、それを食した人がゾンビとなった。片腕は死後に腐り落ちた。」です。",
      "このカードの効果は、「モンスターとの戦闘時、これのパワーの代わりにそれのパワーで戦闘する。」です。",
      "このカードの1文字目は、「ポ」です。"
    ],
    "image_filename": "PoisonZombie"
  },
  {
    "name": "ボムゾンビ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はゾンビです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「爆薬実験を行う人工島に生息するゾンビ。同種でないと分かった途端に爆弾を投げつけてくる。」です。",
      "このカードの効果は、「（カウンター4）ランダムな相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「ボ」です。"
    ],
    "image_filename": "BombZombie"
  },
  {
    "name": "ネクロマンサー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は闇,ヒトです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「物心がついた時には既に両親がおらず、町外れの通りで飢え死にしそうなところを天使に助けられた。数ある魔法から蘇生魔術を授かり、孤独を埋めて生活している。」です。",
      "このカードの効果は、「場に出た時、自分の捨て札から1コスト以下のモンスター1体までを場に出す。（8）自分の捨て札からモンスター1体までを場に出す。」です。",
      "このカードの1文字目は、「ネ」です。"
    ],
    "image_filename": "Necromancer"
  },
  {
    "name": "アックスゾンビ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はゾンビです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「木こりがゾンビとなった姿。生前から使用していた斧を武器とし、驚異の速度で追いかけてくる。」です。",
      "このカードの効果は、「場に出た時、これにカウンター1個を乗せる。（カウンター1）相手のモンスター1体に400ダメージ。」です。",
      "このカードの1文字目は、「ア」です。"
    ],
    "image_filename": "AxeZombie"
  },
  {
    "name": "ゾンビドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別はドラゴン,ゾンビです。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「謎のウイルスに感染した竜。竜の種類は様々。体が常に腐り続けているため、まともに動くことができる時間に限りがある。」です。",
      "このカードの効果は、「カウンターがある時攻撃できない。場に出た時、これにカウンター2個を乗せる。（自分の他の[ゾンビ]1体を破壊）これのカウンター1個を除く、1枚引く。」です。",
      "このカードの1文字目は、「ゾ」です。"
    ],
    "image_filename": "ZombieDragon"
  },
  {
    "name": "死体漁り",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「求めているものは菌だっただろうか。」です。",
      "このカードの効果は、「自分の[ゾンビ]モンスターが場にない時は使えない。自分のモンスター1体を破壊する。2枚引く。」です。",
      "このカードの1文字目は、「死」です。"
    ],
    "image_filename": "CorpseScavenger"
  },
  {
    "name": "増殖研究",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は闇,毒です。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「真実は闇の中。」です。",
      "このカードの効果は、「自分のモンスター全てにカウンター1個を乗せる。自分は1枚引く。」です。",
      "このカードの1文字目は、「増」です。"
    ],
    "image_filename": "ProliferationResearch"
  },
  {
    "name": "紫月昇り",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「1, 5」です。",
      "このカードの種別は闇,月です。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「多くはそれを死月とも呼ぶ。」です。",
      "このカードの効果は、「自分の捨て札から1コスト以下のモンスター5体までを出す。」です。",
      "このカードの1文字目は、「紫」です。"
    ],
    "image_filename": "PurpleMoonRising"
  },
  {
    "name": "蠢く墓場",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「3, 1, 1」です。",
      "このカードの種別は墓です。",
      "このカードの収録セットは、str06-屍の行進です。",
      "このカードの世界観は、「「今日は左から2番目と5番目に賭けるよ。」」です。",
      "このカードの効果は、「自分のターン開始時、自分のデッキの上3枚を捨てる、自分の捨て札から1コスト以下の[ゾンビ]1体までを出す。」です。",
      "このカードの1文字目は、「蠢」です。"
    ],
    "image_filename": "CrawlingGraveyard"
  },
  {
    "name": "棒ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「棒きれで戦うゴブリン。戦闘能力は低く、最低限の装備しか与えられていない。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「棒」です。"
    ],
    "image_filename": "StickGoblin"
  },
  {
    "name": "石ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「石を投げるゴブリン。棒切れより石を投げる方が優秀だと判断され、少し高級な装備を持たせてもらっている。」です。",
      "このカードの効果は、「（これをタップ）相手か相手のモンスター1体に100ダメージ。」です。",
      "このカードの1文字目は、「石」です。"
    ],
    "image_filename": "StoneGoblin"
  },
  {
    "name": "短剣の騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「短剣を持つ騎士。騎士団には所属しておらず、村の護衛やハンターとして雇われる。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「短」です。"
    ],
    "image_filename": "DaggerKnight"
  },
  {
    "name": "コウモリ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコです。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「洞窟のような暗い場所に生息する生き物。吸血をすることで栄養を補給する。寿命が短い。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体に100ダメージ、自分を100回復。」です。",
      "このカードの1文字目は、「コ」です。"
    ],
    "image_filename": "Bat"
  },
  {
    "name": "はりねずみ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコ,罠使いです。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「針を持つ小型の生き物。小型ながら抵抗する意思が強い。愛玩用として飼われることもある。」です。",
      "このカードの効果は、「場に出た時、デッキから「はりトラップ」1枚を手札に加える。」です。",
      "このカードの1文字目は、「は」です。"
    ],
    "image_filename": "Hedgehog"
  },
  {
    "name": "燃えトカゲ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「発火する粘液を蓄えているトカゲ。外敵から身を守るためだけでなく、攻撃手段としても火を用いる。たまに自ら焼けてしまうことも。」です。",
      "このカードの効果は、「場に出た時、自分のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「燃」です。"
    ],
    "image_filename": "BurningLizard"
  },
  {
    "name": "働きアリ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコ,虫です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「女王蟻の元で働く小さなアリ。集団で行動するが、働き加減にはばらつきがある。」です。",
      "このカードの効果は、「（2）デッキから「働きアリ」1体を出す。」です。",
      "このカードの1文字目は、「働」です。"
    ],
    "image_filename": "WorkerAnt"
  },
  {
    "name": "かたい貝",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「川を出た先に生息する貝。攻撃性は皆無で、主に海藻を食べて生きている。殻はとてつもなく硬い。」です。",
      "このカードの効果は、「攻撃できない。」です。",
      "このカードの1文字目は、「か」です。"
    ],
    "image_filename": "HardShell"
  },
  {
    "name": "イノシシ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「強力な突進をする獣。パワフルだが森には天敵が多く、こちらから襲わない限り相手をしない。最近は狩りの的になっている。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「イ」です。"
    ],
    "image_filename": "WildBoar"
  },
  {
    "name": "戦闘兵器：C",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、cs01-新天地_グループ1です。",
      "このカードの世界観は、「作業用機械に大砲を付けた戦闘兵器。森での作業に使われ、安価な作りで大量生産が可能である。地域によってカラーリングが異なる。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「戦」です。"
    ],
    "image_filename": "CombatWeaponC"
  },
  {
    "name": "飛びナイフ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はザコです。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「浮遊移動するナイフ形の魔物。人に捨てられたナイフが復讐のために意志を持ったとされているが、それは全くの嘘であり、単にナイフに似た形状をしているだけである。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。」です。",
      "このカードの1文字目は、「飛」です。"
    ],
    "image_filename": "FlyingKnife"
  },
  {
    "name": "旗持ちの騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「指揮を取る旗を携えた騎士。階級的には一般兵より少し高い程度で、自ら戦闘することがほとんど。」です。",
      "このカードの効果は、「場に出た時、手札かデッキから1コスト以下の[騎士]1体を出す。」です。",
      "このカードの1文字目は、「旗」です。"
    ],
    "image_filename": "FlagBearerKnight"
  },
  {
    "name": "フェアリー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は妖精です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「平和な地域に生息する友好的な妖精。羽はあるものの、エネルギー無しでは飛ぶことができない。」です。",
      "このカードの効果は、「場に出た時、デッキからエネルギー1枚を手札に加える、自分を200回復。」です。",
      "このカードの1文字目は、「フ」です。"
    ],
    "image_filename": "Fairy"
  },
  {
    "name": "サソリ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「毒を持つ節足動物。太古から存在する歴史の長い生物で種類も豊富だが、強力な毒を持つ種類はわずか。」です。",
      "このカードの効果は、「モンスターとの戦闘時、これのパワーの代わりにそれのパワーで戦闘する。」です。",
      "このカードの1文字目は、「サ」です。"
    ],
    "image_filename": "Scorpion"
  },
  {
    "name": "子供オーガ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はオーガです。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「パワフルなオーガの子供。自分より大きい丸太を武器とすることが多く、乱暴な性格。個体数が少ないのであまり見ることはない。」です。",
      "このカードの効果は、「（2）自分のエネルギー1枚を破壊する、相手のモンスター1体に600ダメージ。」です。",
      "このカードの1文字目は、「子」です。"
    ],
    "image_filename": "ChildOgre"
  },
  {
    "name": "木の宝箱",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は悪魔です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「あらゆるところに放置されている宝箱。過去の冒険者が残した物が入っていることもあれば、冒険者そのものが入っていることもあるのだとか……。」です。",
      "このカードの効果は、「攻撃できない。破壊時、自分に500ダメージ、2枚引く。」です。",
      "このカードの1文字目は、「木」です。"
    ],
    "image_filename": "WoodenTreasureChest"
  },
  {
    "name": "ヘビ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「毒を持つ爬虫類。見るからに危険な色をしている場合が多く、近寄らないほうが良い。」です。",
      "このカードの効果は、「モンスターとの戦闘時、これのパワーの代わりにそれのパワーで戦闘する。」です。",
      "このカードの1文字目は、「ヘ」です。"
    ],
    "image_filename": "Snake"
  },
  {
    "name": "黒い花",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は植物,罠使いです。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「夜中になると動く花。普段は地面に根付いているが、より豊かな土壌を求めて移動する。かなり俊敏に動く。」です。",
      "このカードの効果は、「場に出た時、（罠全ての数）枚引く、罠全てを破壊する。」です。",
      "このカードの1文字目は、「黒」です。"
    ],
    "image_filename": "BlackFlower"
  },
  {
    "name": "草の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「草のような見た目をした魔物。植物と成分はほぼ同じだが、筋肉繊維を持ち魔物に近い。薄い爪で対象を切り裂いて捕食する。」です。",
      "このカードの効果は、「攻撃されない。（5）相手のモンスター1体に「攻撃できない。」を与える。」です。",
      "このカードの1文字目は、「草」です。"
    ],
    "image_filename": "GrassMonster"
  },
  {
    "name": "斧の戦士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は地,ヒトです。",
      "このカードの収録セットは、cs01-新天地_グループ2です。",
      "このカードの世界観は、「戦士に職を変えた元木こり。卓越した斧の扱いで魔物討伐に勤しむ。お酒が大好き。」です。",
      "このカードの効果は、「[地]エネルギーが無い時は使えない。モンスターへの攻撃時、相手に（これのパワー-それのパワー）ダメージ。」です。",
      "このカードの1文字目は、「斧」です。"
    ],
    "image_filename": "AxeWarrior"
  },
  {
    "name": "オオカミ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「イヌのようなフォルムを持つ動物。集団での狩猟を得意としており、群れで活動する様子がよく見られる。」です。",
      "このカードの効果は、「場に出た時、相手のタップ中のモンスター1体に600ダメージ。」です。",
      "このカードの1文字目は、「オ」です。"
    ],
    "image_filename": "Wolf"
  },
  {
    "name": "自立機カメラマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「クローラーを持つ偵察型の機械。戦争時に利用されていた機械だが、オーナーを失った今でも撮影をし続けている。」です。",
      "このカードの効果は、「場に出た時、相手の手札全てを公開する。（これを破壊する）捨て札から[部品]1枚を手札に加える。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousCameraMan"
  },
  {
    "name": "戦車ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「戦車に乗ったゴブリン。頑丈なつくりをしており、突撃して対象を攻撃できる他、防御手段としても優れている。動力は下っ端のゴブリン。」です。",
      "このカードの効果は、「場に出た時、手札かデッキから2コスト以下の[ゴブリン]1体を出す。（3）デッキから2コスト以下の[ゴブリン]1体を出す。」です。",
      "このカードの1文字目は、「戦」です。"
    ],
    "image_filename": "TankGoblin"
  },
  {
    "name": "夜の騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は闇,騎士です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「深夜に活動する騎士。戦闘をするというよりも、暗殺に近い戦術で一方的に敵を狩る。村では悪魔だと噂されている。」です。",
      "このカードの効果は、「（3）自分のモンスター1体を破壊する、相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「夜」です。"
    ],
    "image_filename": "NightKnight"
  },
  {
    "name": "獣使い",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「獣を従えて生活をするヒト。狩猟用の動物はあまり得意ではなく、どちらかと言うとペット担当。」です。",
      "このカードの効果は、「場に出た時、自分の[獣]全てを+300。（2）デッキから[獣]1枚を手札に加える。」です。",
      "このカードの1文字目は、「獣」です。"
    ],
    "image_filename": "BeastTamer"
  },
  {
    "name": "林道の亡霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は幽霊です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「村の周辺で見かける亡霊。敵を呪いにより葬る。気づけば囲まれていることも。」です。",
      "このカードの効果は、「場に出た時、相手に200ダメージ。（1）手札かデッキから「林道の亡霊」1体を出す。」です。",
      "このカードの1文字目は、「林」です。"
    ],
    "image_filename": "ForestPathSpecter"
  },
  {
    "name": "苔のゴーレム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は地,ゴーレムです。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「苔むした岩が主成分のゴーレム。個体により大小も生息地域も様々。生命維持に必要なエネルギー消費量が多い。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「苔」です。"
    ],
    "image_filename": "MossGolem"
  },
  {
    "name": "新緑の石碑",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は遺物です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「遥か昔から存在する遺物の一つで、解読不可能な文字の羅列が刻まれている。訪れるものすべてに平等な加護を与える。」です。",
      "このカードの効果は、「攻撃できない。攻撃されない。（これをタップ）1枚引く。（これをタップ）デッキからエネルギー1枚を手札に加える。」です。",
      "このカードの1文字目は、「新」です。"
    ],
    "image_filename": "VerdantStele"
  },
  {
    "name": "オーガ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別はオーガです。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「ありとあらゆるものを攻撃する狂暴な種族。木製の棍棒を振り回し獲物を倒す。稀に同種族にも攻撃を行う。」です。",
      "このカードの効果は、「場に出た時、他のランダムなモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「オ」です。"
    ],
    "image_filename": "Ogre"
  },
  {
    "name": "魂宿りの巨剣",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は闇,装備です。",
      "このカードの収録セットは、cs01-新天地_グループ3です。",
      "このカードの世界観は、「以前この地で命を落とした戦士の巨剣。屠った敵の怨念や大地に眠る霊が宿り、自ら動くようになった。」です。",
      "このカードの効果は、「（これを破壊する）自分の[ヒト][悪魔]1体を+1000。」です。",
      "このカードの1文字目は、「魂」です。"
    ],
    "image_filename": "SoulDwellingGreatsword"
  },
  {
    "name": "戦闘兵器：B",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「二つの交換式のブレードを装備した兵器。戦闘の他、伐採のような作業にも使われる。」です。",
      "このカードの効果は、「1ターンに2回攻撃できる。」です。",
      "このカードの1文字目は、「戦」です。"
    ],
    "image_filename": "CombatWeaponB"
  },
  {
    "name": "ワイバーン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別はワイバーンです。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「足が発達した大型の飛竜。飛行して移動することもあるが、ほとんどが地上で生活をしている。広い場所を好み、旧神殿の個体は「番人」とも言われている。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。」です。",
      "このカードの1文字目は、「ワ」です。"
    ],
    "image_filename": "Wyvern"
  },
  {
    "name": "森の脅威",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は地,虫です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「森の奥地に住む巨大な蜘蛛の怪物。糸で獲物を拘束し、巣で食料として備蓄する。」です。",
      "このカードの効果は、「[地]エネルギーが無い時は使えない。場に出た時、相手のモンスター1体に「攻撃できない。」を与える。」です。",
      "このカードの1文字目は、「森」です。"
    ],
    "image_filename": "ForestThreat"
  },
  {
    "name": "平穏の使者",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「遠方から来た旅する使者。争いを無くすために、平等を理念に活動している。」です。",
      "このカードの効果は、「場に出た時、モンスター全てを=600。（イコール：数値…パワーをその数値に変更する。）」です。",
      "このカードの1文字目は、「平」です。"
    ],
    "image_filename": "EmissaryOfPeace"
  },
  {
    "name": "大蛇",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「森の生態系の頂点に位置する蛇。巨大な体を維持するために頻繁に狩りを行う。森の脅威とは敵対関係にある。」です。",
      "このカードの効果は、「モンスターとの戦闘時、これのパワーの代わりにそれのパワーで戦闘する。（これをタップ）デッキから「ヘビ」1体を出す。」です。",
      "このカードの1文字目は、「大」です。"
    ],
    "image_filename": "GreatSerpent"
  },
  {
    "name": "火薬の悪魔",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は悪魔です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「山のふもとにある拠点で活動する悪魔。火薬の扱いに長け、製造から戦闘までを一貫して行う。」です。",
      "このカードの効果は、「場に出た時、デッキから「爆発」1枚を手札に加える。エネルギー+5。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "GunpowderDemon"
  },
  {
    "name": "ファイアドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は火,ドラゴンです。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「ベース地方の空の守り手。強力な火炎攻撃で敵を焼き尽くす。敵が少なく、徐々に個体数を伸ばしている。」です。",
      "このカードの効果は、「場に出た時、相手と相手のモンスター全てに700ダメージ。（4）相手か相手のモンスター1体に700ダメージ。」です。",
      "このカードの1文字目は、「フ」です。"
    ],
    "image_filename": "FireDragon"
  },
  {
    "name": "岩の人形",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは8です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別はゴーレムです。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「一般的に岩の人形と呼ばれているが金属でできている。巨大で頑丈な体で攻撃を受け止め標的を押しつぶす。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「岩」です。"
    ],
    "image_filename": "RockDoll"
  },
  {
    "name": "回生の天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは8です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は光,天使です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「気まぐれで下界に降り立ち、生物を蘇生させる天使。天界の中でも地位が高い。最近はインナーカラーを入れることにハマっている。」です。",
      "このカードの効果は、「場に出た時、自分の捨て札から「回生の天使」以外のモンスター1体までを出す。（6）自分を1000回復。」です。",
      "このカードの1文字目は、「回」です。"
    ],
    "image_filename": "AngelOfRebirth"
  },
  {
    "name": "山脈崩し",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは9です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は地,神です。",
      "このカードの収録セットは、cs01-新天地_グループ4です。",
      "このカードの世界観は、「数百年に一度姿を見せると言われている大地の神。誰も目にしたことはないが、遥か昔に山を断ち現在の地形を作ったとされる記録が残っている。」です。",
      "このカードの効果は、「相手のモンスターは攻撃できない。」です。",
      "このカードの1文字目は、「山」です。"
    ],
    "image_filename": "MountainBreaker"
  },
  {
    "name": "古びた駆動部品",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は部品です。",
      "このカードの収録セットは、cs01-新天地_グループ５です。",
      "このカードの世界観は、「ただの鉄屑が世界を動かす。」です。",
      "このカードの効果は、「自分の[機械]1体を全回復。」です。",
      "このカードの1文字目は、「古」です。"
    ],
    "image_filename": "OldDrivingPart"
  },
  {
    "name": "古びた検知部品",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は部品です。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「正確無比な目は、今ではもう何も捉えられない。」です。",
      "このカードの効果は、「自分の[機械]1体を全回復。」です。",
      "このカードの1文字目は、「古」です。"
    ],
    "image_filename": "OldDetectionPart"
  },
  {
    "name": "魔力の小瓶",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「たった一滴が奇跡を生む。」です。",
      "このカードの効果は、「デッキからエネルギー1枚を手札に加える。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "VialOfMagic"
  },
  {
    "name": "火花",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「300」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「その一閃は戦いの予告。」です。",
      "このカードの効果は、「相手に300ダメージ。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "Spark"
  },
  {
    "name": "成長",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「昨日の自分を超えること。」です。",
      "このカードの効果は、「自分のモンスター1体を+200。」です。",
      "このカードの1文字目は、「成」です。"
    ],
    "image_filename": "Growth"
  },
  {
    "name": "点火",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 400」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「逃げる準備も忘れずに。」です。",
      "このカードの効果は、「相手のモンスター1体に400ダメージ。」です。",
      "このカードの1文字目は、「点」です。"
    ],
    "image_filename": "Ignition"
  },
  {
    "name": "徴兵",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「2, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「未来の希望を創る者へと。」です。",
      "このカードの効果は、「デッキから2コスト以下の[騎士]1枚を手札に加える。」です。",
      "このカードの1文字目は、「徴」です。"
    ],
    "image_filename": "Conscription"
  },
  {
    "name": "弱者の結束",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 100」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「小さな声が大きな叫びとなる。」です。",
      "このカードの効果は、「自分の1コスト以下のモンスター全てを+100。」です。",
      "このカードの1文字目は、「弱」です。"
    ],
    "image_filename": "WeaklingsUnity"
  },
  {
    "name": "還元",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「自然のリズムの中で。」です。",
      "このカードの効果は、「自分のエネルギー1枚を破壊する。2枚引く。」です。",
      "このカードの1文字目は、「還」です。"
    ],
    "image_filename": "Reduction"
  },
  {
    "name": "毒殺",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、cs01-新天地_グループ5です。",
      "このカードの世界観は、「それは微笑みの裏側。」です。",
      "このカードの効果は、「相手の[ヒト]1体を破壊する。」です。",
      "このカードの1文字目は、「毒」です。"
    ],
    "image_filename": "PoisonKill"
  },
  {
    "name": "回転刃",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 700」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「奏でるは死の旋律。」です。",
      "このカードの効果は、「相手のランダムなモンスター1体に700ダメージ。」です。",
      "このカードの1文字目は、「回」です。"
    ],
    "image_filename": "SpinningBlade"
  },
  {
    "name": "凶暴化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「500, 1, 500」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「忍び寄る恐怖の影。」です。",
      "このカードの効果は、「自分に500ダメージ。自分の[獣]1体を+500。」です。",
      "このカードの1文字目は、「凶」です。"
    ],
    "image_filename": "Feralization"
  },
  {
    "name": "闇の誘惑",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「理性の崩壊。」です。",
      "このカードの効果は、「1枚捨てる。デッキから[闇]の魔法1枚を手札に加える。」です。",
      "このカードの1文字目は、「闇」です。"
    ],
    "image_filename": "DarkTemptation"
  },
  {
    "name": "畏怖の紋章",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 400」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「恐れと崇拝が交錯する証。」です。",
      "このカードの効果は、「相手のモンスター1体を-400。」です。",
      "このカードの1文字目は、「畏」です。"
    ],
    "image_filename": "CrestOfAwe"
  },
  {
    "name": "突風",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は風です。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「大自然の前では、まるで儚き夢である。」です。",
      "このカードの効果は、「相手の罠全てを破壊する。」です。",
      "このカードの1文字目は、「突」です。"
    ],
    "image_filename": "Gust"
  },
  {
    "name": "ゴブリン突撃！",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「2, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「危なーい！」です。",
      "このカードの効果は、「デッキから2コスト以下の[ゴブリン]1体を出す。」です。",
      "このカードの1文字目は、「ゴ」です。"
    ],
    "image_filename": "GoblinCharge!"
  },
  {
    "name": "酸性雨",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 200, 4」です。",
      "このカードの種別は水,毒です。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「命を溶かして存在を証明すること。」です。",
      "このカードの効果は、「相手のランダムなモンスター1体を-200。これを4回行う。」です。",
      "このカードの1文字目は、「酸」です。"
    ],
    "image_filename": "AcidRain"
  },
  {
    "name": "風化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「大地を撫でる風は真実を咎める。」です。",
      "このカードの効果は、「モンスター全ての効果を消す。」です。",
      "このカードの1文字目は、「風」です。"
    ],
    "image_filename": "Weathering"
  },
  {
    "name": "呪術の仮面",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1500, 1」です。",
      "このカードの種別は闇,装備です。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「その一瞬は永遠の苦を生む。」です。",
      "このカードの効果は、「相手の1500パワー以上のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「呪」です。"
    ],
    "image_filename": "CursedMask"
  },
  {
    "name": "翼落とし",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は風です。",
      "このカードの収録セットは、cs01-新天地_グループ6です。",
      "このカードの世界観は、「空が大地へと還る。」です。",
      "このカードの効果は、「相手の[ドラゴン][鳥][ハーピー][グリフォン][ペガサス]1体を破壊する。」です。",
      "このカードの1文字目は、「翼」です。"
    ],
    "image_filename": "WingCutter"
  },
  {
    "name": "泉の水瓶",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1200」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「古の誓いを紡ぎ、旅人の心を清める。」です。",
      "このカードの効果は、「自分を1200回復。」です。",
      "このカードの1文字目は、「泉」です。"
    ],
    "image_filename": "SpringWaterVase"
  },
  {
    "name": "ザコ魔法陣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「運命の悪戯。」です。",
      "このカードの効果は、「デッキから[ザコ]2体までを出す。」です。",
      "このカードの1文字目は、「ザ」です。"
    ],
    "image_filename": "MinionMagicCircle"
  },
  {
    "name": "開花",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「3」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「可能性の覚醒。」です。",
      "このカードの効果は、「[植物]が場に無い時は使えない。3枚引く。」です。",
      "このカードの1文字目は、「開」です。"
    ],
    "image_filename": "Blooming"
  },
  {
    "name": "神秘への遭遇",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「無形の存在がささやく。」です。",
      "このカードの効果は、「デッキから[遺物]1体を出す。」です。",
      "このカードの1文字目は、「神」です。"
    ],
    "image_filename": "EncounterWithMystery"
  },
  {
    "name": "爆発",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「シンプル・イズ・ベスト」です。",
      "このカードの効果は、「相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「爆」です。"
    ],
    "image_filename": "Explosion"
  },
  {
    "name": "無の創造",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「静寂が形となる。」です。",
      "このカードの効果は、「デッキから効果の無いモンスター1体を出す。」です。",
      "このカードの1文字目は、「無」です。"
    ],
    "image_filename": "CreationFromNothing"
  },
  {
    "name": "掌握",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「流れゆく時間を捕らえる芸術。」です。",
      "このカードの効果は、「相手のエネルギー1枚を破壊する。1枚引く。」です。",
      "このカードの1文字目は、「掌」です。"
    ],
    "image_filename": "Grasp"
  },
  {
    "name": "巨大な門",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは7です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は門です。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「そこは夢と現実の狭間。」です。",
      "このカードの効果は、「手札からモンスター1体を出す。」です。",
      "このカードの1文字目は、「巨」です。"
    ],
    "image_filename": "GiantGate"
  },
  {
    "name": "天啓",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは7です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「宇宙の真理をその手に。」です。",
      "このカードの効果は、「自分は上限まで引く。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "Revelation"
  },
  {
    "name": "災厄",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは9です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ7です。",
      "このカードの世界観は、「塵一つ無く。」です。",
      "このカードの効果は、「モンスター全てを破壊する。」です。",
      "このカードの1文字目は、「災」です。"
    ],
    "image_filename": "Calamity"
  },
  {
    "name": "はりトラップ",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「500」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「小さな抵抗。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時]それに500ダメージ。」です。",
      "このカードの1文字目は、「は」です。"
    ],
    "image_filename": "NeedleTrap"
  },
  {
    "name": "落とし穴",
    "info": [
      "このカードは罠です。",
      "この罠は相手の2コスト以下のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「無防備の罪。」です。",
      "このカードの効果は、「[相手の2コスト以下のモンスターが場に出た時]それを破壊する。」です。",
      "このカードの1文字目は、「落」です。"
    ],
    "image_filename": "Pitfall"
  },
  {
    "name": "鈍化",
    "info": [
      "このカードは罠です。",
      "この罠は相手の「場に出たターンでも攻撃できる。」を持つモンスターが場に出た時に発動します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「時間の分解。」です。",
      "このカードの効果は、「[相手の「場に出たターンでも攻撃できる。」を持つモンスターが場に出た時]それの効果を消す。」です。",
      "このカードの1文字目は、「鈍」です。"
    ],
    "image_filename": "Dulling"
  },
  {
    "name": "抵抗",
    "info": [
      "このカードは罠です。",
      "この罠は相手の魔法の使用時に発動します。",
      "このカードのテキストに含まれる数値は、「200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「抵抗こそが真の力を引き出す鍵である。」です。",
      "このカードの効果は、「[相手の魔法の使用時]自分のモンスター全てを+200。」です。",
      "このカードの1文字目は、「抵」です。"
    ],
    "image_filename": "Resistance"
  },
  {
    "name": "籠罠",
    "info": [
      "このカードは罠です。",
      "この罠は相手の[ザコ]が場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「あっという間に。」です。",
      "このカードの効果は、「[相手の[ザコ]が場に出た時]2枚引く。」です。",
      "このカードの1文字目は、「籠」です。"
    ],
    "image_filename": "CageTrap"
  },
  {
    "name": "ドローエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「何かを得る時何かを失う。」です。",
      "このカードの効果は、「これはタップ状態で場に出る。チャージ時、1枚引く、1枚捨てる。」です。",
      "このカードの1文字目は、「ド」です。"
    ],
    "image_filename": "DrawEnergy"
  },
  {
    "name": "ダメージエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「事前準備。」です。",
      "このカードの効果は、「これはタップ状態で場に出る。チャージ時、相手のモンスター1体に200ダメージ。」です。",
      "このカードの1文字目は、「ダ」です。"
    ],
    "image_filename": "DamageEnergy"
  },
  {
    "name": "ヒールエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「小さな幸せ。」です。",
      "このカードの効果は、「これはタップ状態で場に出る。チャージ時、自分を200回復。」です。",
      "このカードの1文字目は、「ヒ」です。"
    ],
    "image_filename": "HealEnergy"
  },
  {
    "name": "パワーエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「潜在能力。」です。",
      "このカードの効果は、「これはタップ状態で場に出る。チャージ時、自分のモンスター1体を+200。」です。",
      "このカードの1文字目は、「パ」です。"
    ],
    "image_filename": "PowerEnergy"
  },
  {
    "name": "フォレストエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は地です。",
      "このカードの収録セットは、cs01-新天地_グループ8です。",
      "このカードの世界観は、「それは大地の加護。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。これはタップ状態で場に出る。」です。",
      "このカードの1文字目は、「フ」です。"
    ],
    "image_filename": "ForestEnergy"
  },
  {
    "name": "蒼魚",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「キュリアス海に生息する一般的によく知られる魚。体色が美しくなる前の段階で食用として捕獲されるため、綺麗に色付くことを多くの人が知らない。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「蒼」です。"
    ],
    "image_filename": "BlueFish"
  },
  {
    "name": "紅魚",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「キュリアス海に生息する一般的によく知られる魚。海の中で目立つ色彩をしており、尚且つ泳ぎが遅いため天敵が多い。」です。",
      "このカードの効果は、「場に出た時、相手に100ダメージ。」です。",
      "このカードの1文字目は、「紅」です。"
    ],
    "image_filename": "RedFish"
  },
  {
    "name": "焼き魚",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は魚です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「様々な魚が見られるキュリアス地方の食卓において、最もよく出る主菜。そのためか街の食堂やレストランでメニューに無いこともしばしば。」です。",
      "このカードの効果は、「攻撃できない。破壊時、自分は1枚引く。」です。",
      "このカードの1文字目は、「焼」です。"
    ],
    "image_filename": "GrilledFish"
  },
  {
    "name": "篝火の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は火,幽霊です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「地下洞窟の道中に住む幽霊。篝火に擬態し、自らの火で襲ってくる。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから3コスト以下の[火]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「篝」です。"
    ],
    "image_filename": "BonfireGhost"
  },
  {
    "name": "釣り人",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「多くの村民が漁師として生計を立てているが、趣味としてそれを楽しむ人もいる。最近は湖での釣りが流行している。」です。",
      "このカードの効果は、「自分のターン開始時、自分のデッキから「釣果」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「釣」です。"
    ],
    "image_filename": "Fisherman"
  },
  {
    "name": "自立機ジャンクマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコ,機械です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「何かしらの役割を持っていたが、今では走ることしかままならず、カメラも機能していないため部品取りとして狙われる野生の機械。」です。",
      "このカードの効果は、「（これを破壊）自分のデッキから名前に「古びた」を含むカード1枚までを手札に加える。（これを破壊）自分の捨て札から[部品]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousJunkman"
  },
  {
    "name": "爆発魚",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は火,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「死に際に鱗と鱗の摩擦により小さな爆発を起こす魚。その身は美味だが、火魔法の扱いに長けた調理師でなければ怪我をする。」です。",
      "このカードの効果は、「破壊時、モンスター全てに300ダメージ。」です。",
      "このカードの1文字目は、「爆」です。"
    ],
    "image_filename": "ExplodingFish"
  },
  {
    "name": "コバンザメ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「大きな魚に吸着して移動する魚。その習性により、釣った魚にくっついていることも。」です。",
      "このカードの効果は、「場に出た時、自分の名前に「鮫」を含むモンスターが場にいるなら、自分のエネルギー+2。」です。",
      "このカードの1文字目は、「コ」です。"
    ],
    "image_filename": "Remora"
  },
  {
    "name": "水の魔法使い",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は水,ヒトです。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「幼少期から水魔法を学習していた魔法使い。勉強熱心では無かったが、一時期危ない目にあったことから、自らを守る術として鍛錬し直した。」です。",
      "このカードの効果は、「（これをタップ）自分は1枚引く。（3）自分のデッキから[水]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「水」です。"
    ],
    "image_filename": "WaterMage"
  },
  {
    "name": "水鉄砲ゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、cs02-未開地_グループ1です。",
      "このカードの世界観は、「海を楽しみに来た一人ぼっちのゴブリン。水鉄砲のパワーがあり過ぎて周りから嫌われている。」です。",
      "このカードの効果は、「（自分の手札から[水]1枚を捨てる）モンスター1体に300ダメージ。」です。",
      "このカードの1文字目は、「水」です。"
    ],
    "image_filename": "WaterGunGoblin"
  },
  {
    "name": "海風の略奪者",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒト,海賊です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「大きな船で航海をしながら商船を襲い、物品を奪って生活するならず者。取り締まりの厳しい昨今では、奪取計画を素早く実行するため、軽装備が基本である。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。相手への攻撃時、自分は1枚引く。」です。",
      "このカードの1文字目は、「海」です。"
    ],
    "image_filename": "SeaWindMarauder"
  },
  {
    "name": "エレメンタルエルフ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はエルフです。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「森に住む妖精の一種だが、ヒトに近い種族とされている。宝石を利用した魔力捜査に長けている。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから種別を持つエネルギー1枚までを手札に加える。（これをタップ）自分のエネルギー+1。」です。",
      "このカードの1文字目は、「エ」です。"
    ],
    "image_filename": "ElementalElf"
  },
  {
    "name": "シビレナマズ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は雷,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「森林にある川や池などに生息するナマズ。電気を攻撃手段として用いるが、自分もちょっと痺れている。」です。",
      "このカードの効果は、「（これをタップ）これに500ダメージ、[水]1体に1000ダメージ。（これを破壊）[水]1体を破壊する。」です。",
      "このカードの1文字目は、「シ」です。"
    ],
    "image_filename": "ElectricCatfish"
  },
  {
    "name": "宝石姫サファイア",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は宝石,人魚です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「海底の奥底に存在する城に住む人魚。「平穏」を司り、魔石の力を利用して戦場の鎮静化を図る。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。場に出た時、自分のライフが相手より2000以上低いなら、他のモンスター全ては「攻撃できない。」を持つ。」です。",
      "このカードの1文字目は、「宝」です。"
    ],
    "image_filename": "JewelPrincessSapphire"
  },
  {
    "name": "雷鳴の天馬",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は雷,ペガサスです。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「雲上に生息し、雷を操るペガサス。誰も手に届かない場所を好み、地上で見かけることは無い。」です。",
      "このカードの効果は、「攻撃されない。場に出た時、自分のデッキから[雷]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「雷」です。"
    ],
    "image_filename": "ThunderPegasus"
  },
  {
    "name": "盾鋏の蟹",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「海辺に生息する重量級の蟹。頑丈で重い爪は自身で動かすことさえ難しく、その為大量に食事を行う必要がある。」です。",
      "このカードの効果は、「場に出た時と攻撃時、相手のデッキの上から2枚を捨てる。」です。",
      "このカードの1文字目は、「盾」です。"
    ],
    "image_filename": "ShieldPincerCrab"
  },
  {
    "name": "人喰い鮫",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「年に数回、釣り人を襲う事件が報告される凶悪な鮫。圧倒的な運動能力を持ち、その姿を見たときにはもう手遅れだとされている。」です。",
      "このカードの効果は、「場に出た時、自分の[海]が場にあるなら、これを+300。（2）自分の[海]が場にあるなら、[ヒト]1体を破壊する。」です。",
      "このカードの1文字目は、「人」です。"
    ],
    "image_filename": "ManEatingShark"
  },
  {
    "name": "自立機タイヤマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「大きな車輪を持ち、様々な対象に突進するだけの機械。今では直進することしかできない。」です。",
      "このカードの効果は、「プレイヤーに攻撃できない。場に出たターンでも攻撃できる。（これを破壊）自分の捨て札から[部品]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousTireMan"
  },
  {
    "name": "弩弓の騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「岸壁の大きな砦で弩弓を放つ騎士。装填速度こそ遅いものの、確実に対象に当てる。」です。",
      "このカードの効果は、「モンスターとの戦闘時、これのパワーの代わりに0パワーで戦闘する。（これをタップ）相手のモンスター1体に（これのパワー×1）ダメージ。」です。",
      "このカードの1文字目は、「弩」です。"
    ],
    "image_filename": "CrossbowKnight"
  },
  {
    "name": "疑似餌付き",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ2です。",
      "このカードの世界観は、「深い海の底で、疑似餌器官により獲物を誘って捕食する魚。疑似餌は同種の意思疎通にも使われる。」です。",
      "このカードの効果は、「相手のモンスターはこれにしか攻撃できない。」です。",
      "このカードの1文字目は、「疑」です。"
    ],
    "image_filename": "LureEquipped"
  },
  {
    "name": "笑うエイ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「度々網にかかる中型のエイ。笑っているように見えるだけではあるものの、愛らしいとされ人気は高い。」です。",
      "このカードの効果は、「相手は魔法を使えない。」です。",
      "このカードの1文字目は、「笑」です。"
    ],
    "image_filename": "LaughingRay"
  },
  {
    "name": "大槍角の鮫",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は水,魚です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「硬い繊維でできた角を持つ鮫。荒れた海域で目撃情報が挙がり、同種同士でも争いをしているのだとか。」です。",
      "このカードの効果は、「[水]エネルギーが無い時は使えない。場に出た時、自分の[海]が場にあるなら、[地]1体を破壊する。」です。",
      "このカードの1文字目は、「大」です。"
    ],
    "image_filename": "GreatSpearhornShark"
  },
  {
    "name": "海賊船",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は海賊です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「キュリアス海にも出没する海賊の船。いくつかの派閥が存在するためか、旗の紋章は様々。」です。",
      "このカードの効果は、「破壊時、自分は2枚引く。（2）自分の手札かデッキから3コスト以下の[海賊]1体までを出す。」です。",
      "このカードの1文字目は、「海」です。"
    ],
    "image_filename": "PirateShip"
  },
  {
    "name": "洞窟の悪魔",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は闇,悪魔です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「地下洞窟の外れ道に生息する悪魔。元は悪魔城の幹部をしていたが、他の種族との大戦争にて敗北。現在は隠居生活をしている。」です。",
      "このカードの効果は、「（これをタップ）自分に500ダメージ、3コスト以下のモンスター1体を破壊する、自分は1枚引く。」です。",
      "このカードの1文字目は、「洞」です。"
    ],
    "image_filename": "CaveDemon"
  },
  {
    "name": "砂浜のゴーレム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別はゴーレムです。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「砂浜に忘れされられた城にゴーレムのコアが宿った姿。様々な場所を価値の無い砂場に変えてしまう。」です。",
      "このカードの効果は、「場に出た時、相手のフィールドを破壊する。（3）相手のフィールドを破壊する。」です。",
      "このカードの1文字目は、「砂」です。"
    ],
    "image_filename": "SandBeachGolem"
  },
  {
    "name": "深青の大鯨",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は水,獣です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「キュリアス海の主とも言える存在。長い寿命で海の歴史を取り込み続けている。」です。",
      "このカードの効果は、「相手の効果で選ばれない。場に出た時、自分の手札から1枚を公開する、自分のデッキからそれと同名のカード2枚までを手札に加える。」です。",
      "このカードの1文字目は、「深」です。"
    ],
    "image_filename": "DeepBlueGreatWhale"
  },
  {
    "name": "自律機シップマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「高度な思考制御システムを持つ船。多くの機械やその部品を取り込み、常に装甲を増し続けている。」です。",
      "このカードの効果は、「（これを破壊）自分の捨て札から名前に「自立機」を含むモンスター2体までを出す。（自分の手札から[部品]1枚を捨てる）これを+500。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousShipman"
  },
  {
    "name": "深海の禍根",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「海の怒りとも呼ばれる巨大な蛸型の怪物。姿を現した後には魚の一匹すら残らない静かな海だけが残る。」です。",
      "このカードの効果は、「自分の[海]が場にある時は相手の効果で選ばれない。場に出た時、自分の[海]が場にあるなら、他のモンスター1体をデッキの下に戻す。」です。",
      "このカードの1文字目は、「深」です。"
    ],
    "image_filename": "DeepSeaScourge"
  },
  {
    "name": "封印されし悪魔像",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは8です。",
      "このモンスターのパワーは901~1200です。",
      "このカードの種別は闇,悪魔です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「長い地下洞窟の末端にある広場に封印された悪魔。強固な鎖と魔力が年々弱まり、死者の魂を密かに吸収し続ける。」です。",
      "このカードの効果は、「[闇]エネルギーが無い時は使えない。相手の効果で選ばれない。攻撃できない。自分のターン終了時、これを+（自分の捨て札の数×100）。（3）これの効果を消す。」です。",
      "このカードの1文字目は、「封」です。"
    ],
    "image_filename": "SealedDemonStatue"
  },
  {
    "name": "雷神",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは8です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は雷,神です。",
      "このカードの収録セットは、cs02-未開地_グループ3です。",
      "このカードの世界観は、「伝承にしか記載のない詳細不明の神。雷を巧みに操り、天災を引き起こすとされている。」です。",
      "このカードの効果は、「攻撃されない。自分の手札の[雷]の魔法のコスト=0。場に出た時、自分のデッキから[雷]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「雷」です。"
    ],
    "image_filename": "ThunderGod"
  },
  {
    "name": "海底探査",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「最初の発見者になること。」です。",
      "このカードの効果は、「自分のデッキから1枚捨てる。自分の[海]が場にあるなら、自分は1枚引く。」です。",
      "このカードの1文字目は、「海」です。"
    ],
    "image_filename": "UnderwaterExploration"
  },
  {
    "name": "釣果",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「釣り人の誇り。」です。",
      "このカードの効果は、「自分のデッキから[魚]か「自立機タイヤマン」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「釣」です。"
    ],
    "image_filename": "FishingHaul"
  },
  {
    "name": "光のカーテン",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「色づいたのは未知の領域。」です。",
      "このカードの効果は、「自分のデッキからフィールド1枚までを手札に加える。」です。",
      "このカードの1文字目は、「光」です。"
    ],
    "image_filename": "CurtainOfLight"
  },
  {
    "name": "縛り上げ",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 300」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「自由とは程遠い。」です。",
      "このカードの効果は、「「攻撃できない。」を持つモンスター1体を破壊する。自分を300回復。」です。",
      "このカードの1文字目は、「縛」です。"
    ],
    "image_filename": "Binding"
  },
  {
    "name": "階級制度",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「3, 1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「冷徹な注文。」です。",
      "このカードの効果は、「3コスト以下のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「階」です。"
    ],
    "image_filename": "Hierarchy"
  },
  {
    "name": "魚群魔法陣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 3, 2, 1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「主役は一人だけでは無い。」です。",
      "このカードの効果は、「自分のデッキから1コスト以下の[魚]3体までを出す。自分の[海]が場にあるなら、自分のデッキから2コスト以下の[魚]1体までを出す。」です。",
      "このカードの1文字目は、「魚」です。"
    ],
    "image_filename": "FishSchoolMagicCircle"
  },
  {
    "name": "混濁",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「最後に見た景色を覚えているか。」です。",
      "このカードの効果は、「[水]エネルギーが無い時は使えない。モンスター1体を手札に戻す。」です。",
      "このカードの1文字目は、「混」です。"
    ],
    "image_filename": "Turbidity"
  },
  {
    "name": "絶望の招来",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「500, 1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「既に影ではなく、絶望そのもの。」です。",
      "このカードの効果は、「[闇]エネルギーが無い時は使えない。自分に500ダメージ。自分のデッキから[悪魔]1体までを出す。」です。",
      "このカードの1文字目は、「絶」です。"
    ],
    "image_filename": "SummonDespair"
  },
  {
    "name": "轟雷",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は雷です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「水をも焦がしつくす。」です。",
      "このカードの効果は、「[水]と[機械]全てを破壊する。」です。",
      "このカードの1文字目は、「轟」です。"
    ],
    "image_filename": "RoaringThunder"
  },
  {
    "name": "人魚の涙",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「3, 2000, 1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ4です。",
      "このカードの世界観は、「自己犠牲の慈愛。」です。",
      "このカードの効果は、「自分のエネルギー+3。自分のライフが相手より2000以上低いなら、自分のデッキからカード1枚までを手札に加える。」です。",
      "このカードの1文字目は、「人」です。"
    ],
    "image_filename": "MermaidTears"
  },
  {
    "name": "大胆な潜伏",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時、自分の[海に発動します。",
      "このカードのテキストに含まれる数値は、「600」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「急いでいるのなら、シンプルな手法を勧めよう。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時、自分の[海]が場にあるなら] それに600ダメージ。」です。",
      "このカードの1文字目は、「大」です。"
    ],
    "image_filename": "BoldInfiltration"
  },
  {
    "name": "災いの渦潮",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時、自分の[海に発動します。",
      "このカードのテキストに含まれる数値は、「400」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「修正と改竄で出来ている。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時、自分の[海]が場にあるなら] モンスター全てに400ダメージ。」です。",
      "このカードの1文字目は、「災」です。"
    ],
    "image_filename": "WhirlpoolOfCalamity"
  },
  {
    "name": "月宿る海",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「100, 100」です。",
      "このカードの種別は海,月です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「月光が力を抱きしめる。」です。",
      "このカードの効果は、「場に出た時、自分の[水]と[光]全てを+100。自分の[水]か[光]が場に出た時、それを+100。」です。",
      "このカードの1文字目は、「月」です。"
    ],
    "image_filename": "MoonlitSea"
  },
  {
    "name": "崖上の防衛砦",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1, 100」です。",
      "このカードの種別は戦地です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「不動であり不屈。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから1コスト以下の[騎士]1体までを出す。相手のターン開始時、自分の[騎士]全てを+100。」です。",
      "このカードの1文字目は、「崖」です。"
    ],
    "image_filename": "CliffsideFortress"
  },
  {
    "name": "キュリアス海",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は海です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「生命が生まれ、生命が還る場所。」です。",
      "このカードの効果は、「自分のターン中に1回、自分の[水]が場に出た時、自分は1枚引く。」です。",
      "このカードの1文字目は、「キ」です。"
    ],
    "image_filename": "CuriousSea"
  },
  {
    "name": "マリンエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「それは大海の加護。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。これはタップして場に出る。」です。",
      "このカードの1文字目は、「マ」です。"
    ],
    "image_filename": "MarineEnergy"
  },
  {
    "name": "ダークエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「それは暗闇の加護。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。これはタップして場に出る。」です。",
      "このカードの1文字目は、「ダ」です。"
    ],
    "image_filename": "DarkEnergy"
  },
  {
    "name": "グランドエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「それは大地の鼓動。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「グ」です。"
    ],
    "image_filename": "GrandEnergy"
  },
  {
    "name": "ハイドロエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「それは大海の鼓動。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「ハ」です。"
    ],
    "image_filename": "HydroEnergy"
  },
  {
    "name": "レイヴンエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、cs02-未開地_グループ5です。",
      "このカードの世界観は、「それは暗闇の鼓動。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「レ」です。"
    ],
    "image_filename": "RavenEnergy"
  },
  {
    "name": "桜小鳥",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は鳥です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「火山付近の幼虫を食べる鳥。飛ぶのは下手だが飛ぶこと自体は好きなのでよく木に登って降りることができなくなる。普段は走って移動している。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「桜」です。"
    ],
    "image_filename": "CherryBlossomBird"
  },
  {
    "name": "幸運を呼ぶ鳥",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は光,鳥です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「雲の上にも出現する羽の長い鳥。絶滅危惧種であり、この鳥を目にした者はその日幸運が訪れると言われている。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから1コスト以下の[光]の魔法1枚までを手札に加える、自分を100回復。」です。",
      "このカードの1文字目は、「幸」です。"
    ],
    "image_filename": "LuckyBird"
  },
  {
    "name": "鍵の精霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は光,妖精です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「巨大な門を開けるために必要な鍵に魂が宿った。セキュリティの問題で4つに分裂したため、全ての精霊が集まらなければ門は開かない。」です。",
      "このカードの効果は、「場に出た時、自分の「鍵の精霊」が4体場にいるなら、自分の手札からモンスター1体までを出す。」です。",
      "このカードの1文字目は、「鍵」です。"
    ],
    "image_filename": "KeySpirit"
  },
  {
    "name": "おちゃめな魔法使い",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はヒトです。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「火山近くの街にある、温泉旅館の娘。深夜に浴場を掃除していた時、寝ながら宙に浮いたモップを操っていることに気づき、魔法の習得を始めた。」です。",
      "このカードの効果は、「（1）50%の確率で、自分のデッキから魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「お」です。"
    ],
    "image_filename": "PlayfulMage"
  },
  {
    "name": "天使スライム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は光,ザコです。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「スライムが天に召された後、どこか寂しさを覚え地に舞い戻ってきた姿。出会ったスライムに笑顔を振りまきつつ、もうそこに戻れないことを心の中で悲しみ続ける。」です。",
      "このカードの効果は、「場に出た時、自分の捨て札から「スライム」1体までを出す。（これをタップ）自分の名前に「スライム」を含むモンスター全てを+100。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "AngelSlime"
  },
  {
    "name": "ソラトビペンギン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は鳥です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「微速ながら空を飛ぶことができるペンギン。住む場所を気候の変化によって変える、渡り鳥のような性格を持つ。」です。",
      "このカードの効果は、「相手のターン終了時まで攻撃されない。（3）自分のモンスター全ては「相手のターン終了時まで攻撃されない。」を持つ。」です。",
      "このカードの1文字目は、「ソ」です。"
    ],
    "image_filename": "FlyingPenguin"
  },
  {
    "name": "山麓の補給兵",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はヒト,騎士です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「火山の麓で補給活動をする騎士。そこそこ大きな街があり拠点としても発達しているため、尋常では無い量の物資が届き、それに辟易している。」です。",
      "このカードの効果は、「場に出た時、以下から1つまでを選ぶ。・自分は1枚引く。・自分のデッキから「補給物資」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「山」です。"
    ],
    "image_filename": "FoothillSupplySoldier"
  },
  {
    "name": "誓いの天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は光,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「ディエティの天使。より上位の共鳴術を授かり、予測された未来通り儀式を行う。」です。",
      "このカードの効果は、「場に出た時、自分のデッキか捨て札から「共鳴」か共鳴召喚を必要とするモンスター1枚までを手札に加える。（これをタップ）共鳴召喚を行う。」です。",
      "このカードの1文字目は、「誓」です。"
    ],
    "image_filename": "AngelOfOath"
  },
  {
    "name": "風読みのハーピー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は風,ハーピーです。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「ディエティ山から少し離れた森に住むハーピー。素早い動きと高い視力で敵や罠を察知し、味方に知らせる。」です。",
      "このカードの効果は、「相手の罠は発動しない。」です。",
      "このカードの1文字目は、「風」です。"
    ],
    "image_filename": "WindReadingHarpy"
  },
  {
    "name": "炎剣の騎士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は火,ヒト,騎士です。",
      "このカードの収録セットは、cs03-共鳴地_グループ1です。",
      "このカードの世界観は、「火炎の術を取り込み強化された騎士。魔法の威力の高さに飲み込まれず、武器として火と剣を扱うにはそれなりの技量が必要である。」です。",
      "このカードの効果は、「共鳴召喚：[騎士],[火]の魔法。場に出た時、相手のモンスターか相手に600ダメージ。（これをタップ）自分のデッキから[火]か[戦法]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameSwordKnight"
  },
  {
    "name": "鳥飼いの魔女",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は闇,ヒトです。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「小さなバードショップを営む魔女。隠れて死んだ鳥の魂を用いた実験をしており、最終的には自身が鳥と同化することを目標としている。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから2コスト以下の[鳥]1体までを出す。（3）モンスター1体に（自分の捨て札の[鳥]の枚数×300）ダメージ。」です。",
      "このカードの1文字目は、「鳥」です。"
    ],
    "image_filename": "BirdTamingWitch"
  },
  {
    "name": "戒律の僧",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は光,ヒトです。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「天界に住む僧侶。光の防御術を多く習得しており、天空城への不法侵入者に対処する仕事をしている。」です。",
      "このカードの効果は、「自分の[光]エネルギーが無い時は使えない。「自分のターン開始時」「自分のターン終了時」の効果は発動しない。（1）自分は1枚引く、相手は1枚引く。」です。",
      "このカードの1文字目は、「戒」です。"
    ],
    "image_filename": "MonkOfPrecepts"
  },
  {
    "name": "竜討毒の鳥",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は毒,鳥です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「竜との戦闘で勝ち残り続けてきた大きい鳥。体内に蓄えた強力な毒は、攻撃手段以外に捕食されたときにも機能する。」です。",
      "このカードの効果は、「場に出た時、以下から1つまでを選ぶ。・[ドラゴン]1体を破壊する。・他のモンスター1体を-400。」です。",
      "このカードの1文字目は、「竜」です。"
    ],
    "image_filename": "DragonSlayingPoisonBird"
  },
  {
    "name": "宝石姫ルビー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は宝石,人魚です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「改定の奥底に存在する城に住む人魚。「復讐」を司り、魔石の力を利用して戦場を灰にする。」です。",
      "このカードの効果は、「自分のターン開始時、相手に300ダメージ。場に出た時、自分のライフが相手より2000以上低いなら、相手に1000ダメージ。」です。",
      "このカードの1文字目は、「宝」です。"
    ],
    "image_filename": "JewelPrincessRuby"
  },
  {
    "name": "宝石姫トパーズ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は宝石,人魚です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「改定の奥底に存在する城に住む人魚。「慈愛」を司り、魔石の力を利用して味方の修復を行う。」です。",
      "このカードの効果は、「自分のターン開始時、自分を300回復。場に出た時、自分のライフが相手より2000以上低いなら、自分は3枚引く。」です。",
      "このカードの1文字目は、「宝」です。"
    ],
    "image_filename": "JewelPrincessTopaz"
  },
  {
    "name": "大翼のハーピー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は風,ハーピーです。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「森に住むハーピーの長。他の個体より翼が大きく、運動性能が高い。」です。",
      "このカードの効果は、「相手の罠は発動しない。」です。",
      "このカードの1文字目は、「大」です。"
    ],
    "image_filename": "GreatWingedHarpy"
  },
  {
    "name": "炎天使ジダ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は火,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「ディエティの天使。天界の入り口の警備、度々脅威となるファビトの悪魔への攻撃を担当する。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。場に出た時、自分の捨て札から[火]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameAngelZida"
  },
  {
    "name": "光天使ナディ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は光,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「ディエティの天使。下界で起こった事象の報告と、新しい光魔法の研究を役割とする。」です。",
      "このカードの効果は、「場に出た時、自分の捨て札から[光]の魔法1枚までを手札に加える、自分の捨て札から1コスト以下のモンスター1体までを出す。」です。",
      "このカードの1文字目は、「光」です。"
    ],
    "image_filename": "LightAngelNadi"
  },
  {
    "name": "雲のゴーレム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水,ゴーレムです。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「水蒸気を本体とするゴーレム。力尽きた時に体を構成する金属の輪が地上に落ちるが、街ではそれが高値で取引されているのだとか。」です。",
      "このカードの効果は、「自分の手札の効果の無いモンスターのコスト-1。場に出た時、他のモンスター1体の効果を消す。」です。",
      "このカードの1文字目は、「雲」です。"
    ],
    "image_filename": "CloudGolem"
  },
  {
    "name": "鮮赤の不死鳥",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は火,鳥です。",
      "このカードの収録セットは、cs03-共鳴地_グループ2です。",
      "このカードの世界観は、「火山に住む燃え盛る鳥。体のほとんどが火炎で出来ており、何度でも蘇ることができる。街のシンボルとしても扱われている。」です。",
      "このカードの効果は、「捨て札にある時、自分のターン開始時、自分の[火]エネルギーが3枚以上場にあるなら、自分の捨て札から[火,鳥]1体までを出す。」です。",
      "このカードの1文字目は、「鮮」です。"
    ],
    "image_filename": "VermilionPhoenix"
  },
  {
    "name": "火炎式魔力砲",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は火,機械です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「魔力を弾丸に変換して支援砲撃を行う機械。旧式と異なり巨大な脚があるため攻撃地点の移動も可能となった。」です。",
      "このカードの効果は、「自分の[火]エネルギーが無い時は使えない。自分の[火]か[機械]モンスターが場に出た時、相手に500ダメージ。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "FlamingMagicCannon"
  },
  {
    "name": "ホワイトグリフォン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別はグリフォンです。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「ディエティの聖域と呼ばれる遺跡を縄張りとしているグリフォン。強力な戦闘力を持つため、自然と遺跡を守る役割として機能している。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。相手のモンスターはプレイヤーを攻撃できない。破壊時、相手は3枚引く。」です。",
      "このカードの1文字目は、「ホ」です。"
    ],
    "image_filename": "WhiteGriffin"
  },
  {
    "name": "ブラックグリフォン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別はグリフォンです。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「ディエティの聖域と呼ばれる遺跡を縄張りとしているグリフォン。対となる白い個体よりも穏やかであるが、激昂時の凶暴さは計り知れない。」です。",
      "このカードの効果は、「場に出た時、自分は3枚引く。破壊時、相手は3枚引く。」です。",
      "このカードの1文字目は、「ブ」です。"
    ],
    "image_filename": "BlackGriffin"
  },
  {
    "name": "祈りの天使像",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は像です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「聖域の中央広場にたたずむ天使像。遥か昔、広場は祭事や祈祷を行う場所であったが、今は瓦礫溢れる廃墟と化している。」です。",
      "このカードの効果は、「攻撃できない。攻撃されない。場に出た時、自分のデッキか捨て札から「共鳴」か共鳴召喚を必要とするモンスター1枚までを手札に加える。自分の手札の魔法のコスト-1。（これをタップ）共鳴召喚を行う。」です。",
      "このカードの1文字目は、「祈」です。"
    ],
    "image_filename": "PrayingAngelStatue"
  },
  {
    "name": "月光の天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は闇,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「ディエティの天使。度重なる戦争により破壊された地域から移住した後、大天使の下で護衛を行う。」です。",
      "このカードの効果は、「場に出た時、自分の[月]フィールドが場にあるなら、相手のエネルギー1枚を破壊する。（2）自分のデッキか捨て札から[月]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「月」です。"
    ],
    "image_filename": "MoonlightAngel"
  },
  {
    "name": "破邪の天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は光,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「ディエティの天使。ファビドでの戦闘を有利に進めるため、闇の消滅術を多く習得した。」です。",
      "このカードの効果は、「これはコスト-（[闇]モンスターの数）して使用される。場に出た時、相手に（[闇]のモンスターの数×300）ダメージ、[闇]のモンスター全てを破壊する。」です。",
      "このカードの1文字目は、「破」です。"
    ],
    "image_filename": "EvilSlayingAngel"
  },
  {
    "name": "火口のヌシ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は火,魚です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「ディエティ山の噴火時にのみ現れる巨大魚。寝床を形成する際に溶岩が撒き散らされ、街に大きな被害を与える。」です。",
      "このカードの効果は、「共鳴召喚：3コスト以上の[魚]、[火]の魔法。場に出た時、相手のモンスター1体に1000ダメージ、これを3回行う。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "CraterLord"
  },
  {
    "name": "天鎧騎士シエロ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は光,ヒト,騎士です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「天界に伝わる聖剣の力を得た騎士。大天使と光竜の加護を得ることで、高い飛翔能力と結界による防御性能を有する。」です。",
      "このカードの効果は、「共鳴召喚：3コスト以上の[騎士],「天竜剣」。相手の効果で選ばれない。場に出た時、自分のデッキか捨て札から[ドラゴン]1枚までを手札に加える、自分は2枚引く。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "SkyArmoredKnightCielo"
  },
  {
    "name": "天鎧竜ウラノス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は光,ドラゴンです。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「天界に伝わる聖剣の力を得た竜。大天使と光戦士の加護を得ることで、戦地を自ら切り開く突破力を手に入れた。」です。",
      "このカードの効果は、「共鳴召喚：5コスト以上の[ドラゴン],「天竜剣」。相手のモンスターはこれにしか攻撃できない。場に出た時、自分のデッキから[騎士]1体までを出す。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "SkyArmoredDragonUranus"
  },
  {
    "name": "燃天の熾天使",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は火,光,天使です。",
      "このカードの収録セットは、cs03-共鳴地_グループ3です。",
      "このカードの世界観は、「火と光の天使が共鳴し、神に近い存在となった姿。天界最高位しか扱えない強力な鎮圧魔法を扱い、戦地の邪を一掃する。」です。",
      "このカードの効果は、「共鳴召喚：「炎天使ジダ」「光天使ナディ」。場に出たターンでも攻撃できる。場に出た時、相手のモンスター1体を捨てる、自分の捨て札からカード1枚までを手札に加える。」です。",
      "このカードの1文字目は、「燃」です。"
    ],
    "image_filename": "BurningSkySeraph"
  },
  {
    "name": "共鳴",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は光,召喚術です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「光と影、生と死、そして始まりと終わり。」です。",
      "このカードの効果は、「共鳴召喚を行う。共鳴召喚に成功したなら、自分は1枚引く。（自分の手札から共鳴条件のカード全てが手札にあるカード1枚を選び、共鳴条件の手札をデッキの下に戻し、コストを支払い使用する。）」です。",
      "このカードの1文字目は、「共」です。"
    ],
    "image_filename": "Resonance"
  },
  {
    "name": "光の蝕み",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「いつしか闇を呼び覚ます。」です。",
      "このカードの効果は、「モンスター1体の効果を消す。」です。",
      "このカードの1文字目は、「光」です。"
    ],
    "image_filename": "ErosionOfLight"
  },
  {
    "name": "弱者の爆発",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「2, 1」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「その命も散り際も一瞬。」です。",
      "このカードの効果は、「2コスト以下のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「弱」です。"
    ],
    "image_filename": "WeaklingsExplosion"
  },
  {
    "name": "安息の導き",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「600, 1」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「長き旅路の終わり。」です。",
      "このカードの効果は、「自分を600回復。自分のデッキから[天使]か[妖精]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「安」です。"
    ],
    "image_filename": "GuidanceToRest"
  },
  {
    "name": "灰の大地",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「ただ記憶の一部となった日。」です。",
      "このカードの効果は、「相手のフィールドを破壊する。」です。",
      "このカードの1文字目は、「灰」です。"
    ],
    "image_filename": "AshyLand"
  },
  {
    "name": "天竜剣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 500, 1, 300」です。",
      "このカードの種別は装備です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「その刃は星をも穿つ。」です。",
      "このカードの効果は、「相手のモンスター1体に500ダメージ。自分の[騎士]か[ドラゴン]1体を+300。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "SkyDragonSword"
  },
  {
    "name": "焼却",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「メリークリスマス！」です。",
      "このカードの効果は、「自分の手札が無い時は使えない。自分の手札から1枚を捨てる。モンスター1体を破壊する。」です。",
      "このカードの1文字目は、「焼」です。"
    ],
    "image_filename": "Incineration"
  },
  {
    "name": "完全燃焼",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「余力は不要。」です。",
      "このカードの効果は、「自分の[火]1体を×2。」です。",
      "このカードの1文字目は、「完」です。"
    ],
    "image_filename": "CompleteCombustion"
  },
  {
    "name": "裁きの日",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「3」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「全ての罪が、いま裁かれる。」です。",
      "このカードの効果は、「自分の[光]エネルギーが3枚以上場にあるなら、モンスター全てを捨てる。」です。",
      "このカードの1文字目は、「裁」です。"
    ],
    "image_filename": "DayOfJudgment"
  },
  {
    "name": "輝化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ4です。",
      "このカードの世界観は、「死ではなく、自由になること。」です。",
      "このカードの効果は、「モンスター1体を捨てる。自分は1枚引く。」です。",
      "このカードの1文字目は、「輝」です。"
    ],
    "image_filename": "Glorification"
  },
  {
    "name": "星になる",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時、自分のエネルギーが3以上あるならに発動します。",
      "このカードのテキストに含まれる数値は、「3」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「「彼女は絵画の一筆となったのさ。」」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時、自分のエネルギーが3以上あるなら]そのモンスターを破壊する。」です。",
      "このカードの1文字目は、「星」です。"
    ],
    "image_filename": "BecomeAStar"
  },
  {
    "name": "力の吸収",
    "info": [
      "このカードは罠です。",
      "この罠は相手のモンスターが場に出た時、自分のエネルギーが3以上あるならに発動します。",
      "このカードのテキストに含まれる数値は、「3, 700, 2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「強者の意思さえ養分となる。」です。",
      "このカードの効果は、「[相手のモンスターが場に出た時、自分のエネルギーが3以上あるなら]それを-700。自分は2枚引く。」です。",
      "このカードの1文字目は、「力」です。"
    ],
    "image_filename": "PowerAbsorption"
  },
  {
    "name": "極彩鳥の巣",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「2, 1, 2, 1」です。",
      "このカードの種別は森,巣です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「そこには、まだ見ぬ色が眠っている。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから2コスト以下の[鳥]1枚までを手札に加える。自分のターン開始時、自分の手札から2コスト以下の[鳥]1体までを出す。」です。",
      "このカードの1文字目は、「極」です。"
    ],
    "image_filename": "NestOfIridescentBirds"
  },
  {
    "name": "天界の泉",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 300, 300」です。",
      "このカードの種別は空,泉です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「水面に映るは永遠の静寂。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから[天使]か[妖精]1枚までを手札に加える。自分の[天使]か[妖精]が場に出た時、それを+300、自分を300回復。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "HeavenlySpring"
  },
  {
    "name": "ディエティの月明",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 1, 400」です。",
      "このカードの種別は月です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「真実を照らす。」です。",
      "このカードの効果は、「自分のターンに1回、自分の[光]か[闇]のモンスターが場に出た時、相手のモンスター1体を-400。」です。",
      "このカードの1文字目は、「デ」です。"
    ],
    "image_filename": "DeityMoonlight"
  },
  {
    "name": "ボルケーノエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「それは灼熱の加護。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。これはタップして場に出る。」です。",
      "このカードの1文字目は、「ボ」です。"
    ],
    "image_filename": "VolcanoEnergy"
  },
  {
    "name": "ヘヴンエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「それは天光の加護。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。これはタップして場に出る。」です。",
      "このカードの1文字目は、「ヘ」です。"
    ],
    "image_filename": "HeavenEnergy"
  },
  {
    "name": "ラヴァエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「それは赤熱の鼓動。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「ラ」です。"
    ],
    "image_filename": "LavaEnergy"
  },
  {
    "name": "サンエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は光です。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「それは日輪の鼓動。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「サ」です。"
    ],
    "image_filename": "SunEnergy"
  },
  {
    "name": "オーバーエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+2します。",
      "このカードのテキストに含まれる数値は、「6」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、cs03-共鳴地_グループ5です。",
      "このカードの世界観は、「内なる渇望。」です。",
      "このカードの効果は、「これはタップして場に出る。場に出た時、自分のエネルギーが6枚以下なら、これを破壊する。」です。",
      "このカードの1文字目は、「オ」です。"
    ],
    "image_filename": "OverEnergy"
  },
  {
    "name": "古びた地図",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs01-旅支度です。",
      "このカードの世界観は、「未知を知る。」です。",
      "このカードの効果は、「デッキから「ノーマルエネルギー」1枚を手札に加える。」です。",
      "このカードの1文字目は、「古」です。"
    ],
    "image_filename": "OldMap"
  },
  {
    "name": "初級魔法の教え",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs01-旅支度です。",
      "このカードの世界観は、「小さな呪文でも、大きな力を秘めている。」です。",
      "このカードの効果は、「デッキから1コスト以下の魔法1枚を手札に加える。」です。",
      "このカードの1文字目は、「初」です。"
    ],
    "image_filename": "BasicMagicTeachings"
  },
  {
    "name": "錆のランタン",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 2, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs01-旅支度です。",
      "このカードの世界観は、「錆びた灯りが揺れるとき、眠りし声が囁く。」です。",
      "このカードの効果は、「1枚引く。自分のモンスターが2体以上場にいるなら、1枚引く。」です。",
      "このカードの1文字目は、「錆」です。"
    ],
    "image_filename": "RustyLantern"
  },
  {
    "name": "融解",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「やがて循環の一部となる。」です。",
      "このカードの効果は、「自分の手札から「ノーマルエネルギー」1枚を捨てる。自分は2枚引く。」です。",
      "このカードの1文字目は、「融」です。"
    ],
    "image_filename": "Melting"
  },
  {
    "name": "闇討ち",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 700」です。",
      "このカードの種別は闇,戦法です。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「残るは静寂のみ。」です。",
      "このカードの効果は、「相手のタップ中のモンスター1体に700ダメージ。」です。",
      "このカードの1文字目は、「闇」です。"
    ],
    "image_filename": "Ambush"
  },
  {
    "name": "追放",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「二度と輝くことは無い。」です。",
      "このカードの効果は、「いずれかのモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「追」です。"
    ],
    "image_filename": "Exile"
  },
  {
    "name": "網罠",
    "info": [
      "このカードは罠です。",
      "この罠は相手の2コスト以下のモンスターが場に出た時に発動します。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「「いつもとは違う道を来てみたんだ。そうしたら、空に続く場所だったみたい。」」です。",
      "このカードの効果は、「相手の2コスト以下のモンスターが場に出た時、それを破壊する。」です。",
      "このカードの1文字目は、「網」です。"
    ],
    "image_filename": "NetTrap"
  },
  {
    "name": "リチャージエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「スマートな進行。」です。",
      "このカードの効果は、「場に出た時、自分の手札から1枚捨てる、自分は1枚引く。」です。",
      "このカードの1文字目は、「リ」です。"
    ],
    "image_filename": "RechargeEnergy"
  },
  {
    "name": "インパクトエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「まずは火傷から？」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体に200ダメージ。」です。",
      "このカードの1文字目は、「イ」です。"
    ],
    "image_filename": "ImpactEnergy"
  },
  {
    "name": "キュアエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「300」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「安らぎの一時。」です。",
      "このカードの効果は、「場に出た時、自分を300回復。」です。",
      "このカードの1文字目は、「キ」です。"
    ],
    "image_filename": "CureEnergy"
  },
  {
    "name": "ブレイブエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「1, 200」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs02-魔術指南です。",
      "このカードの世界観は、「何かを乗り越えること。」です。",
      "このカードの効果は、「場に出た時、自分のモンスター1体を+200。」です。",
      "このカードの1文字目は、「ブ」です。"
    ],
    "image_filename": "BraveEnergy"
  },
  {
    "name": "銀雪の灰竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水,ドラゴンです。",
      "このカードの収録セットは、mcs03-銀雪の伝承です。",
      "このカードの世界観は、「ディエティ山に突如現れた氷翼種の竜。気が荒いため積極的に縄張りを増やそうとする傾向にある。命の危機を感じた時、自らごと封じ込めるほどの氷のブレスをする。」です。",
      "このカードの効果は、「（1）これが「攻撃できない。」を持たないなら、モンスター1体に900ダメージ。これは「攻撃できない。」を持つ。（2）自分のデッキから名前に「銀雪」を含む魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「銀」です。"
    ],
    "image_filename": "SilverSnowAshDragon"
  },
  {
    "name": "銀雪の白竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水,ドラゴンです。",
      "このカードの収録セットは、mcs03-銀雪の伝承です。",
      "このカードの世界観は、「ディエティ山を守る氷翼種の竜。見回りを定期的に行い、新たな脅威があればそれの排除を行う。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。場に出た時、「攻撃できない。」を持つモンスター1体に900ダメージ。（2）自分のデッキから名前に「銀雪」を含む魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「銀」です。"
    ],
    "image_filename": "SilverSnowWhiteDragon"
  },
  {
    "name": "銀雪の蒼竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は水,ドラゴンです。",
      "このカードの収録セットは、mcs03-銀雪の伝承です。",
      "このカードの世界観は、「ディエティ山を守る氷翼種の竜。山の途中にある洞窟付近や山頂近くなどにのみ生息し、他の竜が以上を見つけたときに協力してそれれを排除する。」です。",
      "このカードの効果は、「場に出た時、3コスト以下のモンスター全ては「自分のターン終了時まで攻撃できない。」を持つ。（2）自分のデッキから名前に「銀雪」を含む魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「銀」です。"
    ],
    "image_filename": "SilverSnowAzureDragon"
  },
  {
    "name": "白魔の訪れ",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、mcs03-銀雪の伝承です。",
      "このカードの世界観は、「悪しき者、雪中に墜ちる。」です。",
      "このカードの効果は、「自分のデッキから[水,ドラゴン]1枚までを手札に加える。自分の[水,ドラゴン]が場にいるなら、モンスター1体は「自分のターン終了時まで攻撃できない。」を持つ。」です。",
      "このカードの1文字目は、「白」です。"
    ],
    "image_filename": "WhiteMagicArrival"
  },
  {
    "name": "銀雪夜",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは7です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は水です。",
      "このカードの収録セットは、mcs03-銀雪の伝承です。",
      "このカードの世界観は、「白き暗黒。」です。",
      "このカードの効果は、「相手のモンスター全ては「自分のターン終了時まで攻撃できない。」を持つ。」です。",
      "このカードの1文字目は、「銀」です。"
    ],
    "image_filename": "SilverSnowNight"
  },
  {
    "name": "碑獣ガリル",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は地,獣です。",
      "このカードの収録セットは、mcs04-碑獣の追憶です。",
      "このカードの世界観は、「緑の構造物に憑依された獣。脅威に対して隙を付くように翻弄し、威嚇するようプログラムされている。」です。",
      "このカードの効果は、「相手の効果で選ばれない。自分のターン終了時、これを破壊する、自分のデッキから4コスト以下の[地]1体までを出す。」です。",
      "このカードの1文字目は、「碑」です。"
    ],
    "image_filename": "MonumentBeastGalil"
  },
  {
    "name": "碑獣アリオール",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は地,鳥です。",
      "このカードの収録セットは、mcs04-碑獣の追憶です。",
      "このカードの世界観は、「緑の構造物に憑依された鳥。脅威の攻撃を積極的に回避し、疲労を狙うようプログラムされている。」です。",
      "このカードの効果は、「攻撃されない。自分のターン終了時、これを破壊する、自分のデッキから4コスト以下の[地]1体までを出す。」です。",
      "このカードの1文字目は、「碑」です。"
    ],
    "image_filename": "MonumentBeastAriol"
  },
  {
    "name": "碑獣ヴィファル",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は地,獣です。",
      "このカードの収録セットは、mcs04-碑獣の追憶です。",
      "このカードの世界観は、「緑の構造物に憑依された獣。脅威に対して巨大な体で防衛するようにプログラムされている。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。自分のターン終了時、これを破壊する、自分のデッキから4コスト以下の[地]1体までを出す。」です。",
      "このカードの1文字目は、「碑」です。"
    ],
    "image_filename": "MonumentBeastVifall"
  },
  {
    "name": "碑獣タイタン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは12です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は地,ゴーレムです。",
      "このカードの収録セットは、mcs04-碑獣の追憶です。",
      "このカードの世界観は、「緑の構造物が無数に集合し生成された防衛システム。脅威が完全に停止するまで攻撃をし続けるようにプログラムされている。」です。",
      "このカードの効果は、「これはコスト-（自分の捨て札の[地]の枚数×1）して使用される。場に出た時、他のモンスター1体を捨てる。（3）これは「相手の効果で選ばれない。」を持つ。（場のモンスターを捨てる…捨て札に置かれ、破壊時に発動する効果は発動しません。）」です。",
      "このカードの1文字目は、「碑」です。"
    ],
    "image_filename": "MonumentBeastTitan"
  },
  {
    "name": "碑獣の刻石",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は地,遺物です。",
      "このカードの収録セットは、mcs04-碑獣の追憶です。",
      "このカードの世界観は、「遙か昔に栄えた文明による生成物。石のように佇んでいるが脅威を検知すると無数に離散し、周囲の生物に憑依する。」です。",
      "このカードの効果は、「攻撃できない。（これをタップ）[地]1体を＋300。（これを破壊）自分のデッキから4コスト以下の[地]1体までを出す。」です。",
      "このカードの1文字目は、「碑」です。"
    ],
    "image_filename": "MonumentBeastEngravedStone"
  },
  {
    "name": "炎鱗の鮫",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は火,魚です。",
      "このカードの収録セットは、mcs05-炎鱗の舞踏です。",
      "このカードの世界観は、「ドレープ海域の一部に生息する炎鱗を持つ鮫。漁に大きな被害をもたらすため、狩猟対象に指定されている。」です。",
      "このカードの効果は、「破壊時、相手に300ダメージ。（自分の手札から[火]1枚を捨てる）相手に100ダメージ。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameScaleShark"
  },
  {
    "name": "炎鱗狩りの剣士",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は火,ヒトです。",
      "このカードの収録セットは、mcs05-炎鱗の舞踏です。",
      "このカードの世界観は、「炎鱗を持つ生物を狩り、それを利用して生活している剣士。多彩な武器を操る技術の他、扱いの難しい炎鱗武具をコントロールする力も求められる。」です。",
      "このカードの効果は、「場に出た時、モンスター1体に（自分の捨て札の[火]の枚数×100）ダメージ、自分の捨て札に[火]が5枚以上あるなら、これは「場に出たターンでも攻撃できる。」を持つ。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameScaleHunterSwordsman"
  },
  {
    "name": "炎鱗竜プロクス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は火,ワイバーンです。",
      "このカードの収録セットは、mcs05-炎鱗の舞踏です。",
      "このカードの世界観は、「ドレープ山に生息する翼竜。近年個体数を伸ばし、家畜を襲い街を焼くために討伐依頼が出ている。」です。",
      "このカードの効果は、「破壊時、相手に（自分の捨て札の[火]の枚数×100）ダメージ。（自分の手札から[火]1枚を捨てる）モンスター全てに200ダメージ。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameScaleDragonProx"
  },
  {
    "name": "炎鱗の選別",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 1, 1」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、mcs05-炎鱗の舞踏です。",
      "このカードの世界観は、「腕の良い鍛冶屋は二の次であろう。」です。",
      "このカードの効果は、「自分の手札に他の[火]が無い時は使えない。自分の手札から[火]1枚を捨てる。自分のデッキから「炎鱗の選別」1枚までを手札に加える。自分は1枚引く。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameScaleSelection"
  },
  {
    "name": "炎鱗双剣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1, 1, 2」です。",
      "このカードの種別は火,装備です。",
      "このカードの収録セットは、mcs05-炎鱗の舞踏です。",
      "このカードの世界観は、「大地を焼き、天を焦がす。」です。",
      "このカードの効果は、「自分の[火,ヒト]1体は「1ターンに2回攻撃できる。」を持つ。」です。",
      "このカードの1文字目は、「炎」です。"
    ],
    "image_filename": "FlameScaleTwinBlades"
  },
  {
    "name": "糸動奇 箱",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は地,機械です。",
      "このカードの収録セットは、mcs06-糸動の弦楽です。",
      "このカードの世界観は、「工房内での資材運搬と、加工指示を行う小型の機械。二本の脚は移動の他にマニュピレーターとしても使われる。」です。",
      "このカードの効果は、「場に出た時と（2）、自分のデッキから名前に「糸動」を含むモンスター1枚までを手札に加える。」です。",
      "このカードの1文字目は、「糸」です。"
    ],
    "image_filename": "ThreadedBox"
  },
  {
    "name": "糸動奇 柱",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は地,機械です。",
      "このカードの収録セットは、mcs06-糸動の弦楽です。",
      "このカードの世界観は、「様々な加工や製造を担う木製の機械。脚はあるが動くことはほとんど無く、ひたすら同じ動作をする。」です。",
      "このカードの効果は、「（3）自分のデッキから2コスト以下の[地,機械]1体までを出す。（3）モンスター1体に600ダメージ。」です。",
      "このカードの1文字目は、「糸」です。"
    ],
    "image_filename": "ThreadedPillar"
  },
  {
    "name": "糸動奇 環",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は地,機械です。",
      "このカードの収録セットは、mcs06-糸動の弦楽です。",
      "このカードの世界観は、「工房外で巡回や素材調達を行う機械。動作制御糸を作るための植物や、機械に取り込む魂を持つヒトを回収する。」です。",
      "このカードの効果は、「自分の[地,機械]が場に出た時、自分のエネルギー+1。（4）自分のデッキから3コスト以下の[地,機械]1体までを出す。（4）[ヒト]全てを破壊する。」です。",
      "このカードの1文字目は、「糸」です。"
    ],
    "image_filename": "ThreadedRing"
  },
  {
    "name": "屍動鬼",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは9です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は妖怪,機械です。",
      "このカードの収録セットは、mcs06-糸動の弦楽です。",
      "このカードの世界観は、「工房内で捨てられた古い素材や魂が、妖怪の術により凶悪な機械となった姿。妖怪自身も取り込まれており、破壊衝動のままに暴れ、糸により生命を拘束する。」です。",
      "このカードの効果は、「これはコスト-（自分の[地,機械]の数×1）して使用される。相手のモンスターはこれにしか攻撃できない。相手は（）効果を使えない。場に出た時、6コスト以下のモンスター全てを破壊する。」です。",
      "このカードの1文字目は、「屍」です。"
    ],
    "image_filename": "CorpseDemon"
  },
  {
    "name": "糸動源",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は部品です。",
      "このカードの収録セットは、mcs06-糸動の弦楽です。",
      "このカードの世界観は、「操られているのか、それとも操っているのか。」です。",
      "このカードの効果は、「自分の[地,機械]1体は「自分のターン終了時まで、これの（）効果のエネルギー=1。」を持つ。」です。",
      "このカードの1文字目は、「糸」です。"
    ],
    "image_filename": "ThreadedSource"
  },
  {
    "name": "翠鱗のパラサウロロフス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は恐竜です。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「1コストの恐竜が欲しくて書いたけど、思ったより存在感があって没にしたんだって！」です。",
      "このカードの効果は、「（自分の他の[植物]1体を破壊）自分の手札かデッキから「翠鱗のパラサウロロフス」1体までを出す。」です。",
      "このカードの1文字目は、「翠」です。"
    ],
    "image_filename": "EmeraldScaleParasaurolophus"
  },
  {
    "name": "プラスラッシャー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は算数,機械です。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「世界観に合わなくて没にしちゃったんだって！ちゃんとプラスになってるトコとかカワイイんだけどな…？」です。",
      "このカードの効果は、「自分の[機械]が場に出た時、これを+200。（2）自分のデッキから[算数,機械]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「プ」です。"
    ],
    "image_filename": "PlusSlasher"
  },
  {
    "name": "デカスライム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別はザコです。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「元々は天使になった時に出すモンスターだったけど、システム的にやめたみたい。腕が生えてるのはちょっとキモカワイイ…かも…」です。",
      "このカードの効果は、「場に出た時、自分の手札から「スライム」1体までを出す。（自分の他の「スライム」1体を破壊）これを+300。」です。",
      "このカードの1文字目は、「デ」です。"
    ],
    "image_filename": "GiantSlime"
  },
  {
    "name": "マイナスナイパー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は算数,機械です。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「プラスラッシャーと同じく世界観の都合でやめたみたい。まだまだありそうだね、こんなの！」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体を-1000。（2）自分のデッキから[算数,機械]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「マ」です。"
    ],
    "image_filename": "MinusSniper"
  },
  {
    "name": "解体遊び",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「1, 2」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「私も何かをバラして遊んで戻せなくて、ママに怒られちゃったことあるな～。」です。",
      "このカードの効果は、「自分の[機械]か[玩具]モンスターが場に無い時は使えない。自分の[機械]か[玩具]1体を破壊する。自分のデッキから[部品]2枚までを手札に加える。」です。",
      "このカードの1文字目は、「解」です。"
    ],
    "image_filename": "DismantlingPlay"
  },
  {
    "name": "幽体化",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、mcs07-気まぐれ箱vol1です。",
      "このカードの世界観は、「幽霊にも使えちゃうのが没の理由なんだって。伊吹ってそういうトコ細かい人間だね～。」です。",
      "このカードの効果は、「モンスター1体は「相手のターン終了時まで攻撃されない。」を持つ。自分は1枚引く。」です。",
      "このカードの1文字目は、「幽」です。"
    ],
    "image_filename": "Etherealization"
  },
  {
    "name": "ヒツジ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、des01-闘争本能_グループ1です。",
      "このカードの世界観は、「主に家畜として飼われる動物。体毛の他、角や肉までもが取引されている。」です。",
      "このカードの効果は、「相手の効果で選ばれない。（1）自分の[獣]が2体以上場にいるなら、1枚引く。」です。",
      "このカードの1文字目は、「ヒ」です。"
    ],
    "image_filename": "Sheep"
  },
  {
    "name": "カバ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は水,獣です。",
      "このカードの収録セットは、des01-闘争本能_グループ1です。",
      "このカードの世界観は、「水辺に生息する大型の獣。一見大人しそうな動物に見えるが、怒った時は手がつけられない。」です。",
      "このカードの効果は、「（3）自分のエネルギーが7枚以上場にあるなら、相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「カ」です。"
    ],
    "image_filename": "Hippopotamus"
  },
  {
    "name": "陽光の獅子",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、des01-闘争本能_グループ1です。",
      "このカードの世界観は、「草原地帯に住む、サバンナの王とも呼ばれる獣。複数のメスとグループを作り、連携して狩りを行う。」です。",
      "このカードの効果は、「アンタップ中は攻撃されない。場に出た時、相手のモンスターが2体以上場にいるなら、これに「場に出たターンでも攻撃できる。」を与える。」です。",
      "このカードの1文字目は、「陽」です。"
    ],
    "image_filename": "SunlightLion"
  },
  {
    "name": "万緑の巨象",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は獣です。",
      "このカードの収録セットは、des01-闘争本能_グループ1です。",
      "このカードの世界観は、「巨大な体を持つ草食動物。その迫力はライオンすらも寄せ付けない。」です。",
      "このカードの効果は、「相手の効果で選ばれない。自分のターン終了時、自分を300回復。」です。",
      "このカードの1文字目は、「万」です。"
    ],
    "image_filename": "VerdantElephant"
  },
  {
    "name": "角笛",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、des01-闘争本能_グループ1です。",
      "このカードの世界観は、「解き放つは野生の魂。」です。",
      "このカードの効果は、「1枚捨てる。デッキから[獣]1枚を手札に加える。」です。",
      "このカードの1文字目は、「角」です。"
    ],
    "image_filename": "Horn"
  },
  {
    "name": "白詰草の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、des01-闘争本能_グループ2です。",
      "このカードの世界観は、「空中を浮遊する植物の魔物。個体によって葉のような羽の枚数が異なる場合がある。」です。",
      "このカードの効果は、「場に出た時、50%の確率でこれを+300。（1）自分を200回復。」です。",
      "このカードの1文字目は、「白」です。"
    ],
    "image_filename": "WhiteCloverMonster"
  },
  {
    "name": "原始の種",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は地,植物です。",
      "このカードの収録セットは、des01-闘争本能_グループ2です。",
      "このカードの世界観は、「滅多に見ることのない、地表に露出した種。硬い根で構成され、その頂点部には種類不明の種子が付着している。」です。",
      "このカードの効果は、「攻撃できない。攻撃されない。（2）デッキから[植物]1枚を手札に加える。（6）手札かデッキから[植物]1体を出す。」です。",
      "このカードの1文字目は、「原」です。"
    ],
    "image_filename": "AncientSeed"
  },
  {
    "name": "碧い花",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は植物,罠使いです。",
      "このカードの収録セットは、des01-闘争本能_グループ2です。",
      "このカードの世界観は、「根を足のようにして動く花。花の色によって生態が異なる。碧い個体は土壌を探査する他、動物やその死骸に直接器官を接続して栄養を摂取することもある。」です。",
      "このカードの効果は、「場に出た時、自分を（相手のモンスターの最大パワー×1）回復。（2）自分の罠が場にあるなら、自分を700回復。」です。",
      "このカードの1文字目は、「碧」です。"
    ],
    "image_filename": "AzureFlower"
  },
  {
    "name": "蝿取草の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、des01-闘争本能_グループ2です。",
      "このカードの世界観は、「飛行して狩りを行う植物の魔物。植物の中でも最大級の体を持ち、ありとあらゆる虫を襲う。目は口の中に存在し、捕食される者は最後に恐怖の視線に囚われながら息絶える。」です。",
      "このカードの効果は、「攻撃されない。場に出た時、これを+（[虫]の数×300）、[虫]全てを破壊する。」です。",
      "このカードの1文字目は、「蝿」です。"
    ],
    "image_filename": "VenusFlytrapMonster"
  },
  {
    "name": "無限の恵沢",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「300, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、des01-闘争本能_グループ2です。",
      "このカードの世界観は、「千を知るならば、一を理解するだけで良い。」です。",
      "このカードの効果は、「自分の[植物]全てを+300、エネルギー+（自分の[植物]の数×1）。」です。",
      "このカードの1文字目は、「無」です。"
    ],
    "image_filename": "InfiniteBlessings"
  },
  {
    "name": "無形の霊術師",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は闇,幽霊です。",
      "このカードの収録セットは、des01-闘争本能_グループ3です。",
      "このカードの世界観は、「禁術実験を進める過程で、自ら幽霊に成り果てた霊術師。数多くの召喚魔法を習得しているが、それを生み出すには犠牲が伴う。」です。",
      "このカードの効果は、「（1）自分のモンスター1体を破壊する。デッキから名前に「魔法陣」を含むカード1枚を手札に加える。」です。",
      "このカードの1文字目は、「無」です。"
    ],
    "image_filename": "FormlessSpiritSorcerer"
  },
  {
    "name": "供物魔法陣",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、des01-闘争本能_グループ3です。",
      "このカードの世界観は、「血と骨、そして意思を捧げよ。」です。",
      "このカードの効果は、「[闇]が場に無い時は使えない。デッキから1コスト以下のモンスター1体を「攻撃できない。」を与えて出す。」です。",
      "このカードの1文字目は、「供」です。"
    ],
    "image_filename": "OfferingMagicCircle"
  },
  {
    "name": "人形の一撃",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1, 500」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、des01-闘争本能_グループ3です。",
      "このカードの世界観は、「山を割り、空を破く。」です。",
      "このカードの効果は、「[ゴーレム]が場に無い時は使えない。相手のモンスター1体を破壊する。相手に500ダメージ。」です。",
      "このカードの1文字目は、「人」です。"
    ],
    "image_filename": "DollStrike"
  },
  {
    "name": "古びた加速部品",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は部品です。",
      "このカードの収録セットは、des01-闘争本能_グループ3です。",
      "このカードの世界観は、「その意思は錆びない。」です。",
      "このカードの効果は、「自分の[機械]1体に「場に出たターンでも攻撃できる。」を与える。」です。",
      "このカードの1文字目は、「古」です。"
    ],
    "image_filename": "OldAccelerationPart"
  },
  {
    "name": "毒波",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは9です。",
      "このカードのテキストに含まれる数値は、「2000」です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、des01-闘争本能_グループ3です。",
      "このカードの世界観は、「大気までもが穢れていく。」です。",
      "このカードの効果は、「[毒]が場に無い時は使えない。相手のモンスター全てを-2000。」です。",
      "このカードの1文字目は、「毒」です。"
    ],
    "image_filename": "PoisonWave"
  },
  {
    "name": "丸太のゴーレム",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は地,ゴーレムです。",
      "このカードの収録セットは、des01-闘争本能_グループ4です。",
      "このカードの世界観は、「人工的に造られたゴーレム。村の作業の手伝いや防衛に使用される。素材が安価であり、貧しい村でも見かけることがある。」です。",
      "このカードの効果は、「[地]エネルギーが無い時は使えない。場に出た時、手札からエネルギー1枚をタップして出す。」です。",
      "このカードの1文字目は、「丸」です。"
    ],
    "image_filename": "LogGolem"
  },
  {
    "name": "怪力の甲虫",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は地,虫です。",
      "このカードの収録セットは、des01-闘争本能_グループ4です。",
      "このカードの世界観は、「大型動物程度のサイズを持つ甲虫。巨大な角は鋼のように硬く、格上を撃退できるほどの威力を持つ。」です。",
      "このカードの効果は、「[地]エネルギーが無い時は使えない。場に出た時、相手の7コスト以上のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「怪」です。"
    ],
    "image_filename": "MightyBeetle"
  },
  {
    "name": "紅蓮球",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1, 1, 1200」です。",
      "このカードの種別は火です。",
      "このカードの収録セットは、des01-闘争本能_グループ4です。",
      "このカードの世界観は、「全てを焼き尽くす覚悟の象徴。」です。",
      "このカードの効果は、「手札が無い時は使えない。1枚捨てる。相手か相手のモンスター1体に1200ダメージ。」です。",
      "このカードの1文字目は、「紅」です。"
    ],
    "image_filename": "CrimsonOrb"
  },
  {
    "name": "帯電の矢",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1, 300」です。",
      "このカードの種別は雷です。",
      "このカードの収録セットは、des01-闘争本能_グループ4です。",
      "このカードの世界観は、「痛みは伝播する。」です。",
      "このカードの効果は、「相手のタップ中のモンスター1体を破壊する。相手のタップ中のモンスター全てに300ダメージ。」です。",
      "このカードの1文字目は、「帯」です。"
    ],
    "image_filename": "ElectrifiedArrow"
  },
  {
    "name": "毒入り傷薬",
    "info": [
      "このカードは罠です。",
      "この罠は相手が回復した時に発動します。",
      "このカードのテキストに含まれる数値は、「600」です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、des01-闘争本能_グループ4です。",
      "このカードの世界観は、「思わぬサプライズ。」です。",
      "このカードの効果は、「[相手が回復した時]相手に600ダメージ。」です。",
      "このカードの1文字目は、「毒」です。"
    ],
    "image_filename": "PoisonedHealingPotion"
  },
  {
    "name": "自立機スイッチマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は機械,部品です。",
      "このカードの収録セットは、des02-秘匿区域_グループ1です。",
      "このカードの世界観は、「大きなスイッチに動力のオンオフが集約されている粗末な機械。一度走り出してしまうと燃料と熱により爆発してしまう。」です。",
      "このカードの効果は、「（これを破壊）相手のランダムなモンスター1体に200ダメージ。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousSwitchman"
  },
  {
    "name": "自立機トラックマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、des02-秘匿区域_グループ1です。",
      "このカードの世界観は、「物資運搬用コンテナを運ぶための駆動輪付きの台車。大昔の大戦において、物資が少なくなった際は運搬後に台車ごと部品として扱われた。」です。",
      "このカードの効果は、「場に出た時、自分の[機械]が2体以上場にいるなら、自分は1枚引く。これをタップ）自分のデッキから[部品]1枚までを手札に加える。これを破壊）自分の捨て札から[部品]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousTruckman"
  },
  {
    "name": "自律機フォースマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、des02-秘匿区域_グループ1です。",
      "このカードの世界観は、「クローラーとエンジンにより稼働する機械。元はアームがあったが他の用途により消滅し、他の機械に軸を接続することで動力を提供している。」です。",
      "このカードの効果は、「場に出た時、自分のデッキからエネルギー1枚までを手札に加える。自分の手札の[部品]1枚を捨てる）自分のエネルギー+1。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousForceMan"
  },
  {
    "name": "自律機パイルマン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は機械です。",
      "このカードの収録セットは、des02-秘匿区域_グループ1です。",
      "このカードの世界観は、「射出杭を持つ大型の機械。戦闘機や掘削機として使われた。大戦末期の機体は自らの杭の反動に耐えられない使い捨てのような作りで、すぐ壊れていた。」です。",
      "このカードの効果は、「自分のターン終了時、これを破壊する。自分の手札の[部品]1枚を捨てる）モンスター1体を破壊する。」です。",
      "このカードの1文字目は、「自」です。"
    ],
    "image_filename": "AutonomousPileMan"
  },
  {
    "name": "緊急発進台",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、des02-秘匿区域_グループ1です。",
      "このカードの世界観は、「帰ってくるまでが戦争だ。」です。",
      "このカードの効果は、「自分の手札から[機械]1体までを「自分のターン終了時、これを破壊する。」を持たせて出す。」です。",
      "このカードの1文字目は、「緊」です。"
    ],
    "image_filename": "EmergencyLaunchPad"
  },
  {
    "name": "手鏡の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は幽霊です。",
      "このカードの収録セットは、des02-秘匿区域_グループ2です。",
      "このカードの世界観は、「鏡の世界に住む幽霊。手鏡は所有者の存在を近くで感じることができるため、寂しがり屋の幽霊に人気。」です。",
      "このカードの効果は、「場に出た時、他のモンスター1体に100ダメージ。自分の手札かデッキから「手鏡の幽霊」1体までを出す。」です。",
      "このカードの1文字目は、「手」です。"
    ],
    "image_filename": "HandMirrorGhost"
  },
  {
    "name": "樹葉の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は地,幽霊です。",
      "このカードの収録セットは、des02-秘匿区域_グループ2です。",
      "このカードの世界観は、「ヒトが作った葉っぱの山から生まれる幽霊。綺麗な緑を取り戻し、森林へと帰っていくことが多い。」です。",
      "このカードの効果は、「場に出た時、自分は1枚引く、自分の捨て札1枚をデッキの下に戻す。自分の手札かデッキから「樹葉の幽霊」1体までを出す。」です。",
      "このカードの1文字目は、「樹」です。"
    ],
    "image_filename": "TreeLeafGhost"
  },
  {
    "name": "湖畔の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は水,幽霊です。",
      "このカードの収録セットは、des02-秘匿区域_グループ2です。",
      "このカードの世界観は、「キュリアス村の湖付近に出没する。落とした指輪や農具などの金属により体を固めている。」です。",
      "このカードの効果は、「場に出た時、自分の[幽霊]が2体以上場にいるなら、自分は2枚引く。自分の手札かデッキから「湖畔の幽霊」1体までを出す。自分のターン終了時、[火]全てを破壊する。」です。",
      "このカードの1文字目は、「湖」です。"
    ],
    "image_filename": "LakesideGhost"
  },
  {
    "name": "大盾の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は幽霊,装備です。",
      "このカードの収録セットは、des02-秘匿区域_グループ2です。",
      "このカードの世界観は、「敗戦した王国の門番が倒れた姿。何者も守れなかった後悔により盾に意思が灯った。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。場に出た時、自分の手札かデッキから「大盾の幽霊」1体までを出す。これを破壊）自分の同名が2体以上場にいるモンスター全てを+200。」です。",
      "このカードの1文字目は、「大」です。"
    ],
    "image_filename": "GreatShieldGhost"
  },
  {
    "name": "霊魂の世",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは7です。",
      "このカードのテキストに含まれる数値は、「5, 1, 1」です。",
      "このカードの種別は空です。",
      "このカードの収録セットは、des02-秘匿区域_グループ2です。",
      "このカードの世界観は、「あの世はすぐ底にある。」です。",
      "このカードの効果は、「場に出た時、自分の手札かデッキから5コスト以下の[幽霊]1体までを出す。自分のターン終了時、自分の手札かデッキから同名が場にいるモンスター1体までを出す。」です。",
      "このカードの1文字目は、「霊」です。"
    ],
    "image_filename": "SpiritWorld"
  },
  {
    "name": "蒸気機関の古代機",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は水,機械です。",
      "このカードの収録セットは、des02-秘匿区域_グループ3です。",
      "このカードの世界観は、「長年放置されていた古代技術を持つアーティファクト。細かな構造や行動法則を知る者はいない。」です。",
      "このカードの効果は、「自分の[水]エネルギーが無い時は使えない。相手に攻撃できない。これの効果は消えない。」です。",
      "このカードの1文字目は、「蒸」です。"
    ],
    "image_filename": "SteamEngineAncientMachine"
  },
  {
    "name": "リヴァイアサン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1201～1500です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、des02-秘匿区域_グループ3です。",
      "このカードの世界観は、「大昔から存在する海の覇者。海底遺跡の石版に記載されているほど昔から存在する怪物で、自ら大海を作り出し、敵とみなしたもの全てを飲み込む。」です。",
      "このカードの効果は、「自分の[水]エネルギーが無い時は使えない。場に出た時、自分のデッキから[海]1枚までを出す。これをタップ）他のモンスター全てに1200ダメージ。」です。",
      "このカードの1文字目は、「リ」です。"
    ],
    "image_filename": "Leviathan"
  },
  {
    "name": "呪書の悪魔",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は闇,悪魔です。",
      "このカードの収録セットは、des02-秘匿区域_グループ3です。",
      "このカードの世界観は、「コミュニケーションを苦手とし、本ばかりを読んでいた悪魔。以前悪魔の階級制度により暗殺されかけて以来、自らを守る術どころか暗殺術を身につけてしまった。」です。",
      "このカードの効果は、「自分の[闇]エネルギーが無い時は使えない。場に出た時、自分に500ダメージ、相手の手札全てを公開する、相手の手札1枚を捨てる。」です。",
      "このカードの1文字目は、「呪」です。"
    ],
    "image_filename": "CursedBookDemon"
  },
  {
    "name": "禁忌の錬成",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、des02-秘匿区域_グループ3です。",
      "このカードの世界観は、「創り出した生命はオリジナルと言えるか。」です。",
      "このカードの効果は、「自分の[闇]エネルギーが無い時は使えない。自分の捨て札からモンスター1枚までを手札に加える。」です。",
      "このカードの1文字目は、「禁」です。"
    ],
    "image_filename": "ForbiddenAlchemy"
  },
  {
    "name": "海賊砲",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「200」です。",
      "このカードの種別は戦地です。",
      "このカードの収録セットは、des02-秘匿区域_グループ3です。",
      "このカードの世界観は、「景気よく一発かましましょー！　－元気の良い海賊嬢」です。",
      "このカードの効果は、「自分の[海賊]が場に出た時、相手に200ダメージ。」です。",
      "このカードの1文字目は、「海」です。"
    ],
    "image_filename": "PirateCannon"
  },
  {
    "name": "兵隊アリ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別はザコ,虫です。",
      "このカードの収録セットは、des02-秘匿区域_グループ4です。",
      "このカードの世界観は、「女王蟻のために巣を守るアリ。たまに戦っているフリをするだけの者もいる。」です。",
      "このカードの効果は、「自分の名前に「蟻」を含むモンスターが場にいるなら、モンスター1体に600ダメージ。」です。",
      "このカードの1文字目は、「兵」です。"
    ],
    "image_filename": "SoldierAnt"
  },
  {
    "name": "女王蟻",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は地,虫です。",
      "このカードの収録セットは、des02-秘匿区域_グループ4です。",
      "このカードの世界観は、「アリの繁殖を一手に引き受ける女王としてのアリ。巣の最奥にいる事で外敵から守られている。」です。",
      "このカードの効果は、「攻撃できない。攻撃されない。場に出た時と自分のターン開始時と自分のターン終了時、自分のデッキから1コスト以下の[虫]1体までを出す。これをタップ）自分の[虫]1体を+300。」です。",
      "このカードの1文字目は、「女」です。"
    ],
    "image_filename": "QueenAnt"
  },
  {
    "name": "原石杖の魔術師",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は地,ヒトです。",
      "このカードの収録セットは、des02-秘匿区域_グループ4です。",
      "このカードの世界観は、「宝石の術「石輝術」を習得中の魔法使い。実際の宝石を消費する魔法のため経済的に余裕がなく、レストランで働いている。」です。",
      "このカードの効果は、「自分の手札の[宝石]のコスト-1。（これを破壊する）相手のモンスター1体に600ダメージ、自分のデッキから[宝石]2枚までを手札に加える。」です。",
      "このカードの1文字目は、「原」です。"
    ],
    "image_filename": "RawStoneStaffMage"
  },
  {
    "name": "還り門の森",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1, 100」です。",
      "このカードの種別は森です。",
      "このカードの収録セットは、des02-秘匿区域_グループ4です。",
      "このカードの世界観は、「一度しか通ることの無い人生を。」です。",
      "このカードの効果は、「自分のターン開始時、自分の捨て札のモンスター1枚をデッキの下に戻す。自分の[獣]が場に出た時、それを+100。」です。",
      "このカードの1文字目は、「還」です。"
    ],
    "image_filename": "ReturningGateForest"
  },
  {
    "name": "魔術書庫",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1, 1」です。",
      "このカードの種別は書庫です。",
      "このカードの収録セットは、des02-秘匿区域_グループ4です。",
      "このカードの世界観は、「知こそが極上の魔法。」です。",
      "このカードの効果は、「場に出た時、自分のデッキから魔法1枚までを手札に加える。自分の魔法の使用時、自分は1枚引く。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "MagicLibrary"
  },
  {
    "name": "白蛇",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[2025新年特典]滅多に見ることが出来ないヘビ。神の遣いとされているが、実際はほとんどの個体がヒトが足を踏み入れない山奥に生息しているだけである。」です。",
      "このカードの効果は、「これの名前は「ヘビ」としても扱う。場に出たとき、自分のデッキから名前に「ヘビ」か「蛇」を含むカード1枚までを手札に加える。」です。",
      "このカードの1文字目は、「白」です。"
    ],
    "image_filename": "WhiteSnake"
  },
  {
    "name": "赤蛇",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は毒です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[2025新年特典]滅多に見ることが出来ないヘビ。白蛇の変異種であり、より珍しい生物とされている。これをシンボルとしている街も存在する。」です。",
      "このカードの効果は、「これの名前は「ヘビ」としても扱う。（これをタップ）自分の[毒]が2体以上場にいるなら、相手のモンスター1体を-300。」です。",
      "このカードの1文字目は、「赤」です。"
    ],
    "image_filename": "RedSnake"
  },
  {
    "name": "絵画の幽霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は幽霊,図工です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[2024ハロウィン特典]誰もいない洋館に放置された絵画の中の幽霊。色を消す筆を操作し、外界から周囲の色を消し続けている。訪れた者が恐怖のあまりその絵筆で幽霊ごと消し去ると、瞬く間に実体化して襲う。」です。",
      "このカードの効果は、「攻撃できない。（2）モンスター1体の効果を消す。」です。",
      "このカードの1文字目は、「絵」です。"
    ],
    "image_filename": "PaintingGhost"
  },
  {
    "name": "南瓜の魔物",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は植物です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[2024ハロウィン特典]催事の後に捨てられた装飾済みの南瓜が、怨念により復活した姿。蔓で捉えた獲物を眺めて優越感に浸る。」です。",
      "このカードの効果は、「相手のモンスターはプレイヤーに攻撃できない。場に出た時、自分は（相手の「攻撃できない。」を持つモンスターの数×1）枚引く。」です。",
      "このカードの1文字目は、「南」です。"
    ],
    "image_filename": "PumpkinMonster"
  },
  {
    "name": "甘誘の悪魔",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は悪魔です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[2025バレンタイン特典]万物を誘惑する劇薬菓子を作り出す悪魔。それを望みの者に渡すと必ず縁が結ばれるが、代わりに大切な何かを失うのだとか。」です。",
      "このカードの効果は、「自分がダメージを受けた時、自分は1枚引く。（これをタップ）自分に2000ダメージ。自分のデッキからモンスター1体までを手札に加える。」です。",
      "このカードの1文字目は、「甘」です。"
    ],
    "image_filename": "SweetTemptationDemon"
  },
  {
    "name": "スマッシュエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「5, 1, 300」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「指先で触れるだけ。」です。",
      "このカードの効果は、「これはタップして場に出る。場に出た時、自分のエネルギーが5枚以上場にあるなら、相手のモンスター1体に300ダメージ。」です。",
      "このカードの1文字目は、「ス」です。"
    ],
    "image_filename": "SmashEnergy"
  },
  {
    "name": "ブーストエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに含まれる数値は、「5, 1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「可能性への加速。」です。",
      "このカードの効果は、「これはタップして場に出る。場に出た時、自分のエネルギーが5枚以上場にあるなら、自分は1枚引く。」です。",
      "このカードの1文字目は、「ブ」です。"
    ],
    "image_filename": "BoostEnergy"
  },
  {
    "name": "彩戦紙トパーズ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は騎士,図工です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「オーバー・テクニック。」です。",
      "このカードの効果は、「場に出た時、自分の捨て札から魔法1枚までを手札に加える。（2）自分のデッキから「色彩共鳴」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「彩」です。"
    ],
    "image_filename": "ColorBattlePaperTopaz"
  },
  {
    "name": "彩戦紙インディゴ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は騎士,図工です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「アキバ・タワー建設計画。」です。",
      "このカードの効果は、「場に出た時、自分の手札から魔法1枚を公開する、自分のデッキか捨て札からそれと同名のカード1枚までを手札に加える。（2）自分のデッキから「色彩共鳴」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「彩」です。"
    ],
    "image_filename": "ColorBattlePaperIndigo"
  },
  {
    "name": "彩戦紙マゼンタ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は騎士,図工です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「四天王。攻め担当。」です。",
      "このカードの効果は、「相手が受けるダメージ+200。場に出た時、相手に200ダメージ。（2）自分のデッキから「色彩共鳴」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「彩」です。"
    ],
    "image_filename": "ColorBattlePaperMagenta"
  },
  {
    "name": "彩戦紙ネイビー",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は騎士,図工です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「井の中の蛙のようなもの。」です。",
      "このカードの効果は、「相手の手札の魔法のコスト+1。場に出た時、自分は1枚引く。（2）自分のデッキから「色彩共鳴」1枚までを手札に加える。」です。",
      "このカードの1文字目は、「彩」です。"
    ],
    "image_filename": "ColorBattlePaperNavy"
  },
  {
    "name": "極彩戦紙アマル",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは901～1200です。",
      "このカードの種別は騎士,図工です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「やがて満ちる。やがて腐る。ただそれだけ。」です。",
      "このカードの効果は、「共鳴召喚：「彩戦紙トパーズ」、「彩戦紙インディゴ」。自分のターン開始時、自分のエネルギー＋（これのカウンター×1）。自分のターン終了時、これにカウンターを（自分の残りエネルギー×1）個乗せる。」です。",
      "このカードの1文字目は、「極」です。"
    ],
    "image_filename": "IridescentBattlePaperAmar"
  },
  {
    "name": "色彩共鳴",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは0です。",
      "このカードのテキストに含まれる数値は、「2」です。",
      "このカードの種別は図工,召喚術です。",
      "このカードの収録セットは、mcs08-彩衣の衝撃です。",
      "このカードの世界観は、「始まりは一滴。」です。",
      "このカードの効果は、「場の自分の[図工]モンスターも共鳴条件として扱うことができる共鳴召喚を行う。それに[図工]のモンスターで成功したなら、自分のデッキから[図工]2枚までを手札に加える。」です。",
      "このカードの1文字目は、「色」です。"
    ],
    "image_filename": "ColorResonance"
  },
  {
    "name": "傘化け",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「敗れて壊れた傘に魂が宿った妖怪。うっかり手に取ると襲われる。」です。",
      "このカードの効果は、「場に出た時、これを+300;（3）自分の捨て札から「傘化け」1体までを出す。」です。",
      "このカードの1文字目は、「傘」です。"
    ],
    "image_filename": "UmbrellaGhost"
  },
  {
    "name": "酒呑童子",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「多くの妖怪を使役する妖怪。基本的に酒を呑んでいるだけなので嫌われている。」です。",
      "このカードの効果は、「自分のデッキが縦向きの時は使えない;場に出た時、自分のデッキの向きを変える;（これをタップ）自分の[妖怪]1体の「場に出た時」の効果をコピーする。」です。",
      "このカードの1文字目は、「酒」です。"
    ],
    "image_filename": "ShutenDozi"
  },
  {
    "name": "鵺",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は雷,妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「夜間、恐怖を覚える鳴き声と共に現れる妖怪。雷の多い時期に現れる。」です。",
      "このカードの効果は、「場に出た時、相手のタップ中のモンスター1体に400ダメージ;自分のターン終了時、自分のデッキの向きを変える。」です。",
      "このカードの1文字目は、「鵺」です。"
    ],
    "image_filename": "Nue"
  },
  {
    "name": "雪女",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は水,妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「吹雪を吐くことができる氷雪の妖怪。一部の地域では神とされることも。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体は「自分のターン終了時まで攻撃できない。」を持つ;（これをタップ）自分のデッキから[水]の魔法1枚までを手札に加える。」です。",
      "このカードの1文字目は、「雪」です。"
    ],
    "image_filename": "YukiOnna"
  },
  {
    "name": "火車",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は火,妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「火がついた車輪と鬼の面を持ち、死骸を漁る幽霊。持ち去った身体はどこかに貯蓄されている。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体に600ダメージ;自分の他の[火]か[妖怪]のモンスターが場に出た時、相手のモンスター1体に200ダメージ。」です。",
      "このカードの1文字目は、「火」です。"
    ],
    "image_filename": "Kasha"
  },
  {
    "name": "ぬらりひょん",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は闇,妖怪です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「ただ単純にヒトをからかって遊んでいるだけの無害な妖怪に見えるが、裏では百鬼夜行の先頭に立ち、多くの妖怪を従えている存在でもある。」です。",
      "このカードの効果は、「場に出た時、自分のデッキか捨て札から[妖怪]か「百鬼夜行」1枚までを手札に加える;（7）自分のデッキか捨て札から[妖怪]1体までを出す。」です。",
      "このカードの1文字目は、「ぬ」です。"
    ],
    "image_filename": "Nurarihyon"
  },
  {
    "name": "月迎え",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は闇,月です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「月こそ道標（しるべ）なり。」です。",
      "このカードの効果は、「自分のデッキの向きを変える;自分のデッキか捨て札から[妖怪]1枚までを手札に加える。」です。",
      "このカードの1文字目は、「月」です。"
    ],
    "image_filename": "MoonWelcome"
  },
  {
    "name": "丸太騙し",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「我が目こそ、最も欺かれしものなりけり。」です。",
      "このカードの効果は、「自分のデッキの向きを変える;自分のモンスター1体を手札に戻す。」です。",
      "このカードの1文字目は、「丸」です。"
    ],
    "image_filename": "LogDeception"
  },
  {
    "name": "宵闇の水面",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは4です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は水,闇です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「ひとたび落ちれば、元のかたちに戻ることなし。」です。",
      "このカードの効果は、「自分のデッキが縦向きの時は使えない;自分のデッキの向きを変える;モンスター1体をデッキの下に戻す。」です。",
      "このカードの1文字目は、「宵」です。"
    ],
    "image_filename": "TwilightSurface"
  },
  {
    "name": "百鬼夜行",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは7です。",
      "このカードのテキストに含まれる数値は、「3, 2, 4, 2, 1, 300」です。",
      "このカードの種別は闇です。",
      "このカードの収録セットは、str07-怪の饗宴です。",
      "このカードの世界観は、「一夜の夢か、はた真（まこと）の怪か。」です。",
      "このカードの効果は、「自分のデッキか捨て札から3コスト以下の[妖怪]2体までを出す;自分の4コスト以上の[妖怪]が場にいるなら、自分のデッキか捨て札から2コスト以下の[妖怪]1体までを出す;自分の[妖怪]全てを+300。」です。",
      "このカードの1文字目は、「百」です。"
    ],
    "image_filename": "HyakkiYagyo"
  },
  {
    "name": "尖晶石の人形",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は宝石,ゴーレムです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[一周年記念]尖晶石でできた魔力を栄養とするゴーレム。本体が割れても新しい尖晶石に手足を貼り付けて再生する。」です。",
      "このカードの効果は、「場に出た時、以下からランダムに1つ行う。自分の[宝石]が2体以上場にいるなら、全て行う。①これを+300。②自分は1枚引く。」です。",
      "このカードの1文字目は、「尖」です。"
    ],
    "image_filename": "SpinelDoll"
  },
  {
    "name": "尖晶石の精霊",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは301～600です。",
      "このカードの種別は宝石,妖精です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[一周年記念]尖晶石でできた体を操る精霊。動物のような形態を取り足で走っているように見えるが、移動する際は浮遊している。」です。",
      "このカードの効果は、「場に出た時、以下からランダムに1つ行う。自分の[宝石]が2体以上場にいるなら、全て行う。①これは「場に出たターンでも攻撃できる。」を持つ。②自分を500回復。」です。",
      "このカードの1文字目は、「尖」です。"
    ],
    "image_filename": "SpinelSpirit"
  },
  {
    "name": "煌めく尖晶石",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1, 2, 1」です。",
      "このカードの種別は宝石です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「[一周年記念]それが照らし出す未来は美しいか？」です。",
      "このカードの効果は、「自分のデッキから名前に「尖晶石」を含むカード1枚までを手札に加える。自分の[宝石]が2体以上場にいるなら、自分は1枚引く。」です。",
      "このカードの1文字目は、「煌」です。"
    ],
    "image_filename": "SparklingSpinel"
  },
  {
    "name": "ノーマルエネルギー",
    "info": [
      "このカードはエネルギーです。",
      "このエネルギーは+1します。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、ベーシックです。",
      "このカードの世界観は、「どこにでもあるが、無からは生み出すことのできない世界の動力。」です。",
      "このカードの効果は、「※このカードは何枚でもデッキに入れる事ができる。」です。",
      "このカードの1文字目は、「ノ」です。"
    ],
    "image_filename": "NormalEnergy"
  },
  {
    "name": "ハンドレッドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は光,ドラゴンです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「とにかく100という数字が大好きな竜。とても長い。翼はなく根性で飛んでいる。」です。",
      "このカードの効果は、「（1）相手のモンスター全てに100ダメージ、相手に100ダメージ、自分を100回復。」です。",
      "このカードの1文字目は、「ハ」です。"
    ],
    "image_filename": "HundredDragon"
  },
  {
    "name": "惨然槍の邪竜",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは9です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は闇,ドラゴンです。",
      "このカードの収録セットは､プロモーションです。",
      "このカードの世界観は、「戦死者の武器が捨てられる場所､通称\"槍塚\"に住み､様々な武具を体に纏わせている竜｡」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる｡ 場に出た時､これを+（自分の捨て札の[装備]の数×300）する。」です。",
      "このカードの1文字目は、「惨」です。"
    ],
    "image_filename": "TragicSpearEvilDragon"
  },
  {
    "name": "レインボーマジシャン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは601～900です。",
      "このカードの種別は人,宝石です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「元はディエティ王室御用達の宝石商の娘。幼い頃から宝石に興味を持ち、単なる石以上の奇跡を引き起こす「石輝術」を操る。現在はより強力な力を秘めた原石を求めて、世界各地を点々としている。」です。",
      "このカードの効果は、「自分の手札の[地]と[火]と[水]と[風]と[雷]と[光]と[闇]のコスト-1。場に出た時、自分のデッキか捨て札から[地]か[火]か[水]か[風]か[雷]か[光]か[闇]1枚を手札に加える。」です。",
      "このカードの1文字目は、「レ」です"
    ],
    "image_filename": "RainbowMagician"
  },
  {
    "name": "死神の石柱",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは901~1200です。",
      "このカードの種別は闇,遺物です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「死神が自らの鎌ごと封印された石柱。ただしその鎌の呪いは未だ衰えていない。」です。",
      "このカードの効果は、「4コスト以上のモンスターは攻撃できない。(これをタップ）他の4コスト以上のモンスター1体を破壊する。」",
      "このカードの1文字目は、「死」です"
    ],
    "image_filename": "ReaperStonePillar"
  },
  {
    "name": "サウザンドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは10です。",
      "このモンスターのパワーは901~1200です。",
      "このカードの種別は光,ドラゴンです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「とにかく千という数字が大好きな竜。勝負事になると確実な力を発揮する。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター全てに1000ダメージ、相手に（相手の体力-1000）ダメージ、自分を1000回復。」",
      "このカードの1文字目は、「サ」です"
    ],
    "image_filename": "ThousandDragon"
  },
  {
    "name": "蟻司令官",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1~300です。",
      "このカードの種別は地,虫です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「女王蟻の右腕として働くアリ。全てのアリに指示を出し戦わせる。」です。",
      "このカードの効果は、「攻撃できない。場に出た時と（3）、自分のデッキから[虫]1体までを「場に出た時、これを手札に戻す。」を持たせて出す。」",
      "このカードの1文字目は、「蟻」です"
    ],
    "image_filename": "AntCommander"
  },
  {
    "name": "船霊逆浪海域",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は「1,1,2」です。",
      "このカードの種別は海,幽霊です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「結局それは意味のあるものになったのか？それはわからない」です。",
      "このカードの効果は、「自分の[水]のモンスターが場に出た時、相手のデッキの上1枚を捨てる。場に出た時、相手のモンスター1体を手札に戻す。これを2回行う。」です。",
      "このカードの1文字目は、「船」です"
    ],
    "image_filename": "ShipSpiritReverseWaveSeaArea"
  },
  {
    "name": "トライデントマスター",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1～300です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「普段は深海の都に住む神の使い手。激しい争いが起きるとそれを鎮めに現れる。彼女が持つ槍の三叉には、それぞれ違う力が宿っているのだとか。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。場に出た時と攻撃時、3枚引く。」です。",
      "このカードの1文字目は、「ト」です"
    ],
    "image_filename": "TridentMaster"
  },
  {
    "name": "彼岸の魔女 リリィ",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは200です。",
      "このカードの種別は火,妖精です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「彼岸花の咲く野に座す、忘れられた小さな灯。燃える花は、誰にも届かぬ想いの残り火。」です。",
      "このカードの効果は、「エネルギーはタップして場に出る。捨て札にある時、自分のターン開始時、自分の捨て札から「彼岸の魔女 リリィ」1体までを出す。（1）自分は1枚引く、自分の手札から1枚を捨てる。」です。",
      "このカードの1文字目は、「彼」です。"
    ],
    "image_filename": "HiganWitchLily"
  },
  {
    "name": "消耗品",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは6です。",
      "このカードのテキストに含まれる数値は、「99」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「縹渺な未来も、すべて捨てる。」です。",
      "このカードの効果は、「自分のデッキから99枚までを捨てる。」です。",
      "このカードの1文字目は、「消」です。"
    ],
    "image_filename": "Consumables"
  },
  {
    "name": "ゾンビレックス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは1です。",
      "このモンスターのパワーは1500です。",
      "このカードの種別は恐竜,ゾンビです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「謎のウィルスで蘇った恐竜。非常に凶暴で目についた生物を見境なく飲み込む。」です。",
      "このカードの効果は、「カウンターが7個以下の時は攻撃できない、これの効果は消えない。場のモンスターの破壊時、これにカウンターを1つ乗せる。攻撃時、これのカウンターが8個以上なら、自分の捨て札から5コスト以下のモンスター1体までを出す。」です。",
      "このカードの1文字目は、「ゾ」です。"
    ],
    "image_filename": "ZombieRex"
  },
  {
    "name": "天逆鉾の破片",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは1です。",
      "このカードの種別は遺物です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「世界を作り出した神器の破片。長い時間が経っているため、とても脆い。世界を作る効果は失われ、無に帰すだけになってしまった。」です。",
      "このカードの効果は、「場に出た時、他のモンスター全てを破壊する。自分のモンスターが場に出た時、それを-300。これは魔法の効果を受けない。（7）これを+1999、これの効果を消す。」です。",
      "このカードの1文字目は、「天」です。"
    ],
    "image_filename": "FragmentOfAmanosakahoko"
  },
  {
    "name": "亞の祠",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「200, 500, 1」です。",
      "このカードの種別は森です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「あの山のあの森の奥にある場所に亜の祠がある。あの山では昔、大きな土砂崩れがおきてな。あの山の神様の祟りだと恐れたご先祖様が建てたそうな。それからというもの、あの山で災害は起きていないという。…どうした？急に顔が青ざめて？…まさか…お前………！『亜の祠』壊したんか…！？」です。",
      "このカードの効果は、「自分のターン開始時、自分を200回復。破壊時、自分に500ダメージ。（これを破壊）自分のエネルギー+1。」です。",
      "このカードの1文字目は、「亞」です。"
    ],
    "image_filename": "A_Shrine"
  },
  {
    "name": "仮面英雄バンブート",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは900です。",
      "このカードの種別はヒト,植物です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「大地の力を身に纏い、皆の笑顔と地球の自然を守るため、日々魑魅魍魎と死闘を繰り広げる伝説の英雄。「ブート・スカーレット」と言われる紅の炎はあらゆる闇を祓う光となる。」です。",
      "このカードの効果は、「共鳴召喚：[ヒト]、[植物]。相手の効果で選ばれない。これが受けるダメージ-300。（自分の種別を持つエネルギー1枚を破壊）か(自分の手札から種別を持つエネルギー1枚を破壊）これを+300。」です。",
      "このカードの1文字目は、「仮」です。"
    ],
    "image_filename": "MaskedHeroBamboot"
  },
  {
    "name": "海賊長ヴァルロス",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは500です。",
      "このカードの種別はヒト,海賊です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「キュリアス海に蔓延る海賊の女団長。銃も剣も、その腕は一流。相方の羽を集めてスカートを作ったが、どうやら彼もそれに気づいているらしい。」です。",
      "このカードの効果は、「場に出たターンでも攻撃できる。場に出た時、自分の捨て札が7枚以上あるなら、自分のエネルギー+3。（3）これが場に出たターンなら、これを+500、さらに自分の捨て札に[海賊]が1枚以上あるなら、相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「海」です。"
    ],
    "image_filename": "PirateCaptainValros"
  },
  {
    "name": "魔石を統べる精霊王",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは16です。",
      "このモンスターのパワーは2000です。",
      "このカードの種別は妖精です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「それは魔法の世界を統べる存在」です。",
      "このカードの効果は、「これはコスト-（自分の捨て札の魔法の枚数）して使用され、自分の魔法はコスト-（自分の名前に「魔石」を含むモンスターの数）して使用される。場に出た時、自分の手札かデッキか捨て札から「魔石の精霊」1体までを出す。」です。",
      "このカードの1文字目は、「魔」です。"
    ],
    "image_filename": "SpiritKingOfMagicStones"
  },
  {
    "name": "豊穣の女神",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは4です。",
      "このモンスターのパワーは1000です。",
      "このカードの種別は地,神です。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「ファビドの隠された楽園に住む豊穣の神。生命力を増幅させる能力を持ち、万物に命を吹き込むことも可能。」です。",
      "このカードの効果は、「場に出た時、自分のデッキからエネルギー1枚までを出す。（4）自分のデッキからエネルギー1枚までを出す、自分を300回復。」です。",
      "このカードの1文字目は、「豊」です。"
    ],
    "image_filename": "GoddessOfFertility"
  },
  {
    "name": "栄華の花園",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは2です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は門,花畑です。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「誰の祈りが私を呼んだのだろう。」です。",
      "このカードの効果は、「自分のターン開始時と自分のターン終了時と自分の[植物]のモンスターが場に出た時、自分は1枚引く。」です。",
      "このカードの1文字目は、「栄」です。"
    ],
    "image_filename": "GardenOfGlory"
  },
  {
    "name": "魂の復元",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「その躰は本物か、その命は真実か。」です。",
      "このカードの効果は、「自分のモンスターが場に無いなら、自分の捨て札からモンスター1体までを出す。」です。",
      "このカードの1文字目は、「魂」です。"
    ],
    "image_filename": "SoulRestoration"
  },
  {
    "name": "双鋏型掘削機",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは900です。",
      "このカードの種別は地,水,機械です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「蟹を模した掘削機。ヒト知れず地下や海底を掘り進める。」です。",
      "このカードの効果は、「攻撃されない。場に出た時と（2）、相手のデッキの上1枚を捨てる、相手のモンスター1体を-600。」です。",
      "このカードの1文字目は、「双」です。"
    ],
    "image_filename": "TwinScissorExcavator"
  },
  {
    "name": "かわいいあざらし",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは2です。",
      "このモンスターのパワーは500です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「見ての通りかわいいあざらし 謎の力で敵を粉砕するがなぜそうなるのか自分もよく分かってないらしい」です。",
      "このカードの効果は、「プレイヤーに攻撃できない。カードの破壊時、それを破壊する代わりにデッキの下に戻す。（これをタップ）相手のモンスター1体を-500。」です。",
      "このカードの1文字目は、「か」です。"
    ],
    "image_filename": "CuteSeal"
  },
  {
    "name": "超臨界",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは7です。",
      "このカードのテキストに含まれる数値は、「100, 2, 1000」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「汝、勇気を示せ」です。",
      "このカードの効果は、「自分のライフ=100。自分の2コスト以下のモンスター全てを破壊する。自分のモンスター全てを+1000。自分のモンスター全ての効果を消す。」です。",
      "このカードの1文字目は、「超」です。"
    ],
    "image_filename": "Supercritical"
  },
  {
    "name": "命の天樹",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1200です。",
      "このカードの種別は植物,神です。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「古代書に記された架空の浮遊樹。世界のありとあらゆる生命が生まれ、還る場所。」です。",
      "このカードの効果は、「攻撃できない。これが受けるダメージ=0。自分のターン開始時、自分の手札かデッキか捨て札からモンスター1体までを出す。」です。",
      "このカードの1文字目は、「命」です。"
    ],
    "image_filename": "CelestialTreeOfLife"
  },
  {
    "name": "悪魔な注文",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは5です。",
      "このカードのテキストに含まれる数値は、「200, 3, 400, 500」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「アパレイユは言うまでもなく、スリーズにまで手を抜かないこと。クレーム・シャンティの温度管理が行き届いているかなんて、食べる前から分かるわ。」です。",
      "このカードの効果は、「相手の手札全てを公開する。相手の手札から1枚を捨てる。自分のモンスター全てを+200。自分は3枚引く。自分を400回復。相手のモンスター全てに500ダメージ。」です。",
      "このカードの1文字目は、「悪」です。"
    ],
    "image_filename": "DemonicOrder"
  },
  {
    "name": "超爆発",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは3です。",
      "このカードのテキストに数値は含まれません。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「爆弾がいっぱいあったらつよい。」です。",
      "このカードの効果は、「モンスターと罠とフィールド全てを破壊する。」です。",
      "このカードの1文字目は、「超」です。"
    ],
    "image_filename": "SuperExplosion"
  },
  {
    "name": "怪物蟹",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは6です。",
      "このモンスターのパワーは1800です。",
      "このカードの種別は水です。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「船よりも大きい蟹。必殺技「ブルーシザー」は相手がグーだとしても負けない。」です。",
      "このカードの効果は、「場に出た時、相手のデッキから1枚を捨てる。（自分の手札から[水]1枚を捨てる）相手のデッキの上1枚を捨てる。」です。",
      "このカードの1文字目は、「怪」です。"
    ],
    "image_filename": "MonsterCrab"
  },
  {
    "name": "クリスタルドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1500です。",
      "このカードの種別は宝石,ドラゴンです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「自身が鉱山となったドラゴン。必殺技「クリスタルレイン」で無限のエネルギーを生み出す。」です。",
      "このカードの効果は、「場に出た時、自分のエネルギー+7。」です。",
      "このカードの1文字目は、「ク」です。"
    ],
    "image_filename": "CrystalDragon"
  },
  {
    "name": "信じる心",
    "info": [
      "このカードは魔法です。",
      "このカードのコストは1です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は無いです。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「幸せな嘘なら、それは真実にもなり得る。」です。",
      "このカードの効果は、「自分のデッキからカード1枚を手札に加える。」です。",
      "このカードの1文字目は、「信」です。"
    ],
    "image_filename": "BelievingHeart"
  },
  {
    "name": "マスターゴブリン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは3です。",
      "このモンスターのパワーは1200です。",
      "このカードの種別はゴブリンです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「ゴブリンのトップ。必殺技「マスタースラッシュ」で相手を圧倒する。」です。",
      "このカードの効果は、「」です。",
      "このカードの1文字目は、「マ」です。"
    ],
    "image_filename": "MasterGoblin"
  },
  {
    "name": "絶対神",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは7です。",
      "このモンスターのパワーは1500です。",
      "このカードの種別は神です。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「すべてを知る神様。必殺技「ゴッドシールド」であらゆるダメージを受けずに戦う。たまに殴る。」です。",
      "このカードの効果は、「これが受けるダメージ=0。場に出た時、相手のモンスター1体を捨てる。」です。",
      "このカードの1文字目は、「絶」です。"
    ],
    "image_filename": "AbsoluteGod"
  },
  {
    "name": "スーパードラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは9です。",
      "このモンスターのパワーは9999です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「最強のドラゴン。必殺技「スーパーブラスト」で敵を消し炭にする。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター全てを破壊する。」です。",
      "このカードの1文字目は、「ス」です。"
    ],
    "image_filename": "SuperDragon"
  },
  {
    "name": "ギガドラゴン",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは5です。",
      "このモンスターのパワーは2000です。",
      "このカードの種別はドラゴンです。",
      "このカードの収録セットは、s1-オリカです。",
      "このカードの世界観は、「デカくてつよい。必殺技「ギガスタンプ」であらゆる敵をぺちゃんこにする。」です。",
      "このカードの効果は、「場に出た時、相手のモンスター1体を破壊する。」です。",
      "このカードの1文字目は、「ギ」です。"
    ],
    "image_filename": "GigaDragon"
  },
  {
    "name": "輪廻転生",
    "info": [
      "このカードはフィールドです。",
      "このカードのコストは7です。",
      "このカードのテキストに含まれる数値は、「1」です。",
      "このカードの種別は空です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「誰しもがこの輪からは逃れられない。そう、あなたも…」です。",
      "このカードの効果は、「場に出た時と自分のターン開始時、自分の捨て札からモンスター1体までを「自分のターン終了時、これを破壊する。」を持たせて出す。」です。",
      "このカードの1文字目は、「輪」です。"
    ],
    "image_filename": "Reincarnation"
  },
  {
    "name": "最終兵器：MS",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは14です。",
      "このモンスターのパワーは1501以上です。",
      "このカードの種別は闇,機械です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「陰の者たちの最高傑作。始動。」です。",
      "このカードの効果は、「これは使用以外で場に出せない。これはコスト-（自分の捨て札の[部品]の枚数）して使用される。相手の「場に出た時」の効果は発動しない。場に出た時、他のモンスター全てを破壊する。」です。",
      "このカードの1文字目は、「最」です。"
    ],
    "image_filename": "UltimateWeaponMS"
  },
  {
    "name": "かにもぐら先輩",
    "info": [
      "このカードはモンスターです。",
      "このカードのコストは0です。",
      "このモンスターのパワーは1~300です。",
      "このカードの種別は地です。",
      "このカードの収録セットは、プロモーションです。",
      "このカードの世界観は、「突然変異で手に蟹のはさみがついてしまったもぐらの魔物。仲間からは慕われており、親しみを込めて先輩と呼ばれている。」です。",
      "このカードの効果は、「相手のモンスターはこれにしか攻撃できない。攻撃時、相手のデッキの上から1枚を捨てる。」です。",
      "このカードの1文字目は、「最」です。"
    ],
    "image_filename": "TheVenerableMolecrab"
  }
]; // <<<<<< ここに cards.json の内容を貼り付けてください！

    // ====================================================================
    // 1. グローバル変数とユーティリティ関数
    // ====================================================================

    let currentUserId = null;
    let isSidebarOpen = false;
    let isMenuIconsVisible = true;
    const SIDEBAR_WIDTH = 500;
    const MENU_ICON_SIZE = 60;
    const TOGGLE_BUTTON_SIZE = 50;
    let uiInjected = false;
    let currentMatchingTimeout = null;
    let isUserMatching = false;
    let currentMatchInfo = null;
    let currentMatchDocId = null;
    let lastChatTimestamp = 0;
    let matchmakingPollingInterval = null;
    let chatPollingInterval = null;

    /**
     * 文字列内のバッククォートをエスケープするヘルパー関数。
     * HTMLテンプレートリテラル内にユーザー入力の文字列を安全に挿入するために使用します。
     * @param {string} str - エスケープする文字列。
     * @returns {string} エスケープされた文字列。
     */
    function escapeBackticks(str) {
        if (str === null || str === undefined) {
            return '';
        }
        return String(str).replace(/`/g, '\\`');
    }

    /**
     * カスタムアラート/確認ダイアログを表示します。
     * この関数はグローバルスコープ (window) に公開されます。
     * @param {string} title - ダイアログのタイトル。
     * @param {string} message - ダイアログに表示するメッセージ。
     * @param {boolean} isConfirm - 確認ダイアログかどうか (trueの場合、OKとキャンセルボタンが表示されます)。
     * @returns {Promise<boolean>} - OKがクリックされた場合はtrue、キャンセルがクリックされた場合はfalseを解決するPromise。
     */
    window.showCustomDialog = function(title, message, isConfirm = false) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('tcg-custom-dialog-overlay');
            const dialogTitle = document.getElementById('tcg-dialog-title');
            const dialogMessage = document.getElementById('tcg-dialog-message');
            const okButton = document.getElementById('tcg-dialog-ok-button');
            const cancelButton = document.getElementById('tcg-dialog-cancel-button');

            if (!overlay || !dialogTitle || !dialogMessage || !okButton || !cancelButton) {
                console.error("Custom dialog elements not found. Cannot show dialog.");
                return resolve(false);
            }

            dialogTitle.textContent = title;
            dialogMessage.innerHTML = message;
            cancelButton.style.display = isConfirm ? 'inline-block' : 'none';

            const newOkButton = okButton.cloneNode(true);
            okButton.parentNode.replaceChild(newOkButton, okButton);
            const newCancelButton = cancelButton.cloneNode(true);
            cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);

            newOkButton.addEventListener('click', () => {
                overlay.classList.remove('show');
                overlay.addEventListener('transitionend', () => overlay.style.display = 'none', { once: true });
                resolve(true);
            });

            if (isConfirm) {
                newCancelButton.addEventListener('click', () => {
                    overlay.classList.remove('show');
                    overlay.addEventListener('transitionend', () => overlay.style.display = 'none', { once: true });
                    resolve(false);
                });
            }

            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        });
    };

    // GM.setValue / GM.getValue のラッパー関数 (Promiseを返す)
    const storage = {
        get: async (keys) => {
            const result = {};
            for (const key of keys) {
                result[key] = await GM.getValue(key, undefined);
            }
            return result;
        },
        set: async (items) => {
            for (const key in items) {
                await GM.setValue(key, items[key]);
            }
        }
    };

// anokoro-tcg-assistant.js の一部

/**
 * Replit/Render Webサーバーにリクエストを送信するヘルパー関数。
 * @param {string} endpoint - サーバーのAPIエンドポイント（例: '/getUserProfile'）。
 * @param {object} payload - リクエストボディとして送信するデータ。
 * @returns {Promise<object>} サーバーからのレスポンスデータ。
 */
async function callReplitApi(endpoint, payload = {}) {
    if (!REPLIT_WEB_APP_URL || REPLIT_WEB_APP_URL === 'YOUR_REPLIT_WEB_APP_URL_HERE') {
        await window.showCustomDialog('エラー', 'バックエンドURLが設定されていません。Tampermonkeyスクリプトの`REPLIT_WEB_APP_URL`を更新してください。');
        throw new Error('Backend Web App URL is not set.');
    }

    // ユーザーIDを自動的にペイロードに追加
    if (!payload.userId && currentUserId) {
        payload.userId = currentUserId;
    }

    // URLを構築するロジックを修正 (スラッシュの重複防止)
    const baseUrl = REPLIT_WEB_APP_URL.endsWith('/') ? REPLIT_WEB_APP_URL.slice(0, -1) : REPLIT_WEB_APP_URL;
    const url = `${baseUrl}${endpoint}`;

    console.log(`Calling Backend API: ${url} with payload:`, payload);

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "POST", // APIはPOSTで統一
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                try {
                    // レスポンスが空文字列の場合、JSON.parseはエラーになるためチェック
                    if (!response.responseText) {
                        console.warn(`API response for ${endpoint} was empty.`);
                        // 空の応答も成功として扱うか、エラーとして扱うかはAPIの設計による
                        // ここでは、成功だがデータなしとして解決
                        return resolve({ success: true, data: null, message: "Empty response from server." });
                    }
                    const res = JSON.parse(response.responseText);
                    if (res.success) {
                        resolve(res.data);
                    } else {
                        console.error(`Backend API Error for endpoint ${endpoint}:`, res.error);
                        reject(new Error(res.error || `Backend API failed for endpoint ${endpoint}`));
                    }
                } catch (e) {
                    console.error(`Failed to parse Backend API response for endpoint ${endpoint}:`, response.responseText, e);
                    // HTMLエラーページが返ってきた場合もここで捕捉
                    const errorMessage = `Failed to parse Backend API response: ${response.responseText.substring(0, 100)}... (Not valid JSON)`;
                    reject(new Error(errorMessage));
                }
            },
            onerror: function(error) {
                // errorオブジェクトから詳細なメッセージを取得し、より具体的なエラーを返す
                const errorMessage = `Network error or Backend server error: ${error.statusText || error.responseText || error.message || 'Unknown network error'}`;
                console.error(`GM.xmlHttpRequest Error for endpoint ${endpoint}:`, error, errorMessage);
                reject(new Error(errorMessage));
            }
        });
    });
}

    // ====================================================================
    // 2. ユーザーID初期化
    // ====================================================================

    /**
     * ユーザーIDを初期化します。
     * 永続化のためにGM.setValue/GM.getValueを使用します。
     */
    async function initializeUserId() {
        console.log("Initializing user ID...");
        const result = await storage.get(['currentUserId']);
        if (result.currentUserId) {
            currentUserId = result.currentUserId;
            console.log("Loaded existing user ID:", currentUserId);
        } else {
            // 新規ユーザーの場合、ランダムなUUIDを生成して保存
            currentUserId = crypto.randomUUID();
            await storage.set({ currentUserId: currentUserId });
            console.log("Generated new user ID:", currentUserId);
        }
        // 認証が準備できたことを通知するカスタムイベントを発火 (FirebaseAuthReadyの代わり)
        document.dispatchEvent(new CustomEvent('userIdReady'));
        console.log("User ID ready. Dispatching userIdReady event.");
    }


    // ====================================================================
    // 3. UIの注入とメインロジック
    // ====================================================================

    /**
     * メニューアイコンの表示状態を更新する関数
     * isMenuIconsVisibleの状態に基づいて、メニューコンテナの幅とアイコンラッパーの表示を制御します。
     */
    function updateMenuIconsVisibility() {
        const menuContainer = document.getElementById('tcg-right-menu-container');
        const menuIconsWrapper = menuContainer ? menuContainer.querySelector('.tcg-menu-icons-wrapper') : null;
        const toggleButton = document.getElementById('tcg-menu-toggle-button');
        const toggleIcon = toggleButton ? toggleButton.querySelector('i') : null;

        if (!menuContainer || !menuIconsWrapper || !toggleButton) {
            console.warn("Menu visibility elements not found for update. UI might not be fully loaded yet.");
            return;
        }

        if (isMenuIconsVisible) { // アイコンを表示し、コンテナを展開
            menuContainer.classList.remove('collapsed');
            menuContainer.classList.add('expanded');
            menuIconsWrapper.classList.remove('hidden'); // hiddenクラスを削除
            menuIconsWrapper.classList.add('visible');   // visibleクラスを追加
            toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right'); // 右矢印
        } else { // アイコンを隠し、コンテナを格納
            menuContainer.classList.remove('expanded');
            menuContainer.classList.add('collapsed');
            menuIconsWrapper.classList.remove('visible'); // visibleクラスを削除
            menuIconsWrapper.classList.add('hidden');    // hiddenクラスを追加
            toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left'); // 左矢印
        }
    }

    /**
     * 右サイドメニュー（アイコン群）を作成・挿入し、イベントリスナーを設定します。
     * この関数はUIがDOMに挿入された後に一度だけ呼び出されます。
     */
    async function createRightSideMenuAndAttachListeners() {
        const menuContainer = document.getElementById('tcg-right-menu-container');
        if (!menuContainer) {
            console.error("tcg-right-menu-container not found after UI injection. Cannot attach menu listeners.");
            return;
        }

        const menuIconsWrapper = menuContainer.querySelector('.tcg-menu-icons-wrapper');
        const menuIcons = menuIconsWrapper.querySelectorAll('.tcg-menu-icon');
        const toggleButton = document.getElementById('tcg-menu-toggle-button');

        // 各メニューアイコンにクリックイベントリスナーを設定
        menuIcons.forEach(iconButton => {
            iconButton.removeEventListener('click', handleMenuIconClick); // 以前のリスナーを削除
            iconButton.addEventListener('click', handleMenuIconClick);
        });

        // トグルボタンのイベントリスナーを設定
        toggleButton.removeEventListener('click', handleMenuToggleButtonClick); // 以前のリスナーを削除
        toggleButton.addEventListener('click', handleMenuToggleButtonClick);

        // メニューアイコンの表示状態をロードし、初期状態を適用
        const result = await storage.get(['isMenuIconsVisible']);
        isMenuIconsVisible = result.isMenuIconsVisible !== undefined ? result.isMenuIconsVisible : true;
        updateMenuIconsVisibility();

        // サイドバーの開閉状態とアクティブなセクションをロードし、UIを初期化
        const storedState = await storage.get(['isSidebarOpen', 'activeSection', 'isMenuIconsVisible']);
        isSidebarOpen = storedState.isSidebarOpen !== undefined ? storedState.isSidebarOpen : false;
        const activeSection = storedState.activeSection || 'home'; // デフォルトはホーム
        isMenuIconsVisible = storedState.isMenuIconsVisible !== undefined ? storedState.isMenuIconsVisible : isSidebarOpen;

        const contentArea = document.getElementById('tcg-content-area');
        const gameCanvas = document.querySelector('canvas#unity-canvas'); // ゲームのcanvas要素

        // まず、すべてのメニューアイコンのアクティブ状態をリセット
        menuIcons.forEach(btn => btn.classList.remove('active'));

        // メニューコンテナの初期状態を適用
        updateMenuIconsVisibility();

        if (isSidebarOpen) {
            if (contentArea) {
                contentArea.classList.add('active');
                contentArea.style.right = '0px';
            }
            if (gameCanvas) {
                gameCanvas.style.display = 'block';
            }
            document.body.classList.remove('game-focused-mode');
            showSection(activeSection); // アクティブなセクションのコンテンツを表示
            const initialActiveIcon = menuContainer.querySelector(`.tcg-menu-icon[data-section="${activeSection}"]`);
            if (initialActiveIcon) {
                initialActiveIcon.classList.add('active');
            }
        } else {
            if (contentArea) {
                contentArea.classList.remove('active');
                contentArea.style.right = `-${SIDEBAR_WIDTH}px`;
            }
            if (gameCanvas) {
                gameCanvas.style.display = 'block';
            }
            document.body.classList.remove('game-focused-mode');
            const initialActiveIcon = menuContainer.querySelector(`.tcg-menu-icon[data-section="${activeSection}"]`);
            if (initialActiveIcon) {
                initialActiveIcon.classList.add('active');
            }
        }
    }

    // メニューアイコンクリックハンドラ
    function handleMenuIconClick(event) {
        const sectionId = event.currentTarget.dataset.section;
        // アリーナボタンがクリックされたら新しいタブで開く
        if (sectionId === 'arena') {
            window.open('https://anokorotcg-arena.vercel.app/', '_blank');
            return; // サイドバーは開かない
        }
        toggleContentArea(sectionId);
    }

    // メニュー開閉トグルボタンクリックハンドラ
    async function handleMenuToggleButtonClick() {
        isMenuIconsVisible = !isMenuIconsVisible;
        updateMenuIconsVisibility();
        await storage.set({ isMenuIconsVisible: isMenuIconsVisible });
    }


    /**
     * コンテンツエリアの表示/非表示を切り替えます。
     * @param {string} sectionId - 表示するセクションのID。
     * @param {boolean} forceOpenSidebar - サイドバーが閉じている場合でも強制的に開くかどうか
     */
    async function toggleContentArea(sectionId, forceOpenSidebar = false) {
        const contentArea = document.getElementById('tcg-content-area');
        const rightMenuContainer = document.getElementById('tcg-right-menu-container');
        const gameCanvas = document.querySelector('canvas#unity-canvas');
        const menuIcons = rightMenuContainer ? rightMenuContainer.querySelectorAll('.tcg-menu-icon') : [];

        if (!contentArea || !rightMenuContainer) return;

        const currentActiveIcon = rightMenuContainer.querySelector('.tcg-menu-icon.active');
        const clickedIcon = rightMenuContainer.querySelector(`.tcg-menu-icon[data-section="${sectionId}"]`);

        // すべてのメニューアイコンのアクティブ状態を解除
        menuIcons.forEach(btn => btn.classList.remove('active'));

        // クリックされたアイコンが既にアクティブで、かつサイドバーが開いている場合は閉じる
        const isContentAreaActive = contentArea.classList.contains('active');
        const isSameIconAlreadyActiveAndClicked = isContentAreaActive && (currentActiveIcon && currentActiveIcon.dataset.section === sectionId);

        if (isSameIconAlreadyActiveAndClicked && !forceOpenSidebar) { // forceOpenSidebar が true の場合は閉じない
            contentArea.classList.remove('active');
            contentArea.style.right = `-${SIDEBAR_WIDTH}px`;
            isMenuIconsVisible = false;
            updateMenuIconsVisibility();
            if (gameCanvas) gameCanvas.style.display = 'block';
            document.body.classList.remove('game-focused-mode');
            isSidebarOpen = false;
            await storage.set({ isSidebarOpen: isSidebarOpen, isMenuIconsVisible: isMenuIconsVisible });
        } else {
            // サイドバーを開く、または別のセクションに切り替える
            contentArea.classList.add('active');
            contentArea.style.right = '0px';
            isMenuIconsVisible = true;
            updateMenuIconsVisibility();
            if (gameCanvas) gameCanvas.style.display = 'block';
            document.body.classList.remove('game-focused-mode');
            isSidebarOpen = true;
            await storage.set({ isSidebarOpen: isSidebarOpen, activeSection: sectionId, isMenuIconsVisible: isMenuIconsVisible });

            showSection(sectionId); // ターゲットセクションのコンテンツを表示

            if (clickedIcon) {
                clickedIcon.classList.add('active');
            }
        }
    }

    /**
     * 指定されたセクションを表示し、他のセクションを非表示にします。
     * @param {string} sectionId - 表示するセクションのID (例: "home", "rateMatch")。
     */
    async function showSection(sectionId) {
        // アリーナセクションはHTMLとしてロードしない
        if (sectionId === 'arena') {
            console.log("Arena section is handled by opening a new tab. No HTML to load.");
            return;
        }

        // すべてのセクションを非アクティブにする
        document.querySelectorAll('.tcg-section').forEach(section => {
            section.classList.remove('active');
        });

        // ターゲットセクションのコンテナ
        const tcgSectionsWrapper = document.getElementById('tcg-sections-wrapper');
        let targetSection = document.getElementById(`tcg-${sectionId}-section`);

        // セクションコンテナが存在しない場合は動的に作成
        if (!targetSection) {
            targetSection = document.createElement('div');
            targetSection.id = `tcg-${sectionId}-section`;
            targetSection.className = 'tcg-section';
            if (tcgSectionsWrapper) {
                tcgSectionsWrapper.appendChild(targetSection);
            } else {
                console.error("tcg-sections-wrapper not found. Cannot append new section.");
                return;
            }
        }

        // セクションのHTMLをロード
        const htmlContent = HTML_CONTENTS[sectionId];
        if (htmlContent) {
            try {
                targetSection.innerHTML = htmlContent;
            } catch (e) {
                console.error(`Error setting innerHTML for section ${sectionId}:`, e);
                targetSection.innerHTML = `<p style="color: red;">セクションの読み込み中にエラーが発生しました: ${escapeBackticks(e.message)}</p>`;
                return;
            }
        } else {
            console.error(`HTML content for section ${sectionId} not found.`);
            targetSection.innerHTML = `<p style="color: red;">セクションの読み込みに失敗しました: ${sectionId}<br>コンテンツが見つかりません。</p>`;
            return;
        }

        // 各セクションのJavaScriptを初期化
        const initFunctionName = `init${sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Section`;

        // DOMが更新された後にイベントリスナーを再アタッチするため、setTimeoutを使用
        setTimeout(() => {
            if (typeof window[initFunctionName] === 'function') {
                console.log(`Calling ${initFunctionName} for section ${sectionId}.`);
                window[initFunctionName]();
            } else {
                console.warn(`Initialization function ${initFunctionName} not found for section ${sectionId}.`);
            }
        }, 0);

        // 指定されたセクションをアクティブにする
        targetSection.classList.add('active');

        // アクティブなセクションを保存
        await storage.set({ activeSection: sectionId });
    }

    /**
     * 拡張機能の各種機能を初期化し、イベントリスナーを設定します。
     * この関数は一度だけ呼び出されます。
     */
    async function initializeExtensionFeatures() {
        console.log("Initializing extension features...");
        // allCards は ALL_CARDS_DATA から直接取得
        window.allCards = ALL_CARDS_DATA;
        if (!Array.isArray(window.allCards) || window.allCards.length === 0) {
            console.warn("カードデータが空または無効です。一部機能が制限される可能性があります。");
        } else {
            console.log(`${window.allCards.length} cards loaded into window.allCards.`);
        }
    }

    /**
     * 拡張機能のUIをウェブページに挿入します。
     * この関数は一度だけ実行されることを保証します。
     */
    async function injectUIIntoPage() {
        if (uiInjected) {
            return;
        }

        try {
            // UIのHTML構造をHTML_CONTENTS.popupから取得
            const uiHtml = HTML_CONTENTS.popup;

            // 一時的なコンテナを作成し、HTMLコンテンツを解析
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = uiHtml;

            // bodyの既存コンテンツを保持しつつ、UIを挿入する
            // bodyの直下に追加することで、ゲームのcanvas要素などと共存させます。
            while (tempDiv.firstChild) {
                document.body.appendChild(tempDiv.firstChild);
            }

            // Font AwesomeのCSSを注入してアイコンを使用できるようにします。
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(link);

            uiInjected = true;
            console.log("UI injected into page. Elements referenced.");

            await initializeUserId(); // ユーザーIDの初期化

            createRightSideMenuAndAttachListeners();
            initializeExtensionFeatures();

            const result = await storage.get(['activeSection']);
            const activeSection = result.activeSection || 'home';
            showSection(activeSection);

        } catch (error) {
            console.error("Failed to inject UI into page:", error);
        }
    }

    // DOMが完全にロードされるのを待ってから要素を注入し、機能を初期化します。
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectUIIntoPage();
        });
    } else {
        injectUIIntoPage();
    }

    // ====================================================================
    // 4. セクションごとのロジック (Replit API連携に修正)
    //    各init関数は showSection から直接呼び出されます。
    // ====================================================================

    // === home.js の内容 ===
    window.initHomeSection = async function() {
        console.log("Home section initialized.");
        // allCards は ALL_CARDS_DATA としてグローバルに利用可能
        // showCustomDialog もグローバル関数として定義されている
        // ここにHomeセクション固有のJSロジックがあれば記述
        // 現在はHTMLに直接記述されているため、特別な要素操作は不要
    };

    // === rateMatch.js の内容 (Replit API連携に修正) ===
    window.initRateMatchSection = async function() {
        console.log("RateMatch section initialized.");

        // ユーザーIDが利用可能になるまで待機
        if (!currentUserId) {
            console.log("User ID not yet ready. Waiting for userIdReady event...");
            await new Promise(resolve => document.addEventListener('userIdReady', resolve, { once: true }));
            console.log("User ID is now ready:", currentUserId);
        }

        // === レート戦セクションのロジック ===
        // 各要素を関数内で取得
        const matchingButton = document.getElementById('matching-button');
        const cancelMatchingButton = document.getElementById('cancel-matching-button');
        const matchingStatusDiv = document.getElementById('matching-status');
        const preMatchUiDiv = document.getElementById('pre-match-ui');
        const postMatchUiDiv = document.getElementById('post-match-ui');
        const matchHistoryList = document.getElementById('match-history-list');

        const chatInput = document.getElementById('chat-input');
        const sendChatButton = document.getElementById('send-chat-button');
        const chatMessagesDiv = document.getElementById('chat-messages');
        const chatPhraseButtons = document.querySelectorAll('.chat-phrase-button');

        const winButton = document.getElementById('win-button');
        const loseButton = document.getElementById('lose-button');
        const cancelButton = document.getElementById('cancel-button');

        const rateDisplay = document.getElementById('rate-display'); // レート表示要素
        const userIdDisplay = document.getElementById('user-id-display'); // ユーザーID表示要素
        const leaderboardList = document.getElementById('leaderboard-list'); // ランキング表示要素
        const displayNameInput = document.getElementById('display-name-input'); // プレイヤー名入力要素
        const saveDisplayNameButton = document.getElementById('save-display-name-button'); // プレイヤー名保存ボタン

        let currentRate = 1500; // 仮の初期レート (Replit DBからロードされる)
        let currentMatchmakingDocId = null; // 現在のアクティブなマッチのID (Replit DBではMatchID)
        let lastChatTimestamp = 0; // 最後に取得したチャットメッセージのタイムスタンプ
        let isSendingChat = false; // チャット送信中のフラグ

        // ユーザーIDを表示
        if (userIdDisplay) {
            userIdDisplay.textContent = currentUserId || '取得中...';
            document.addEventListener('userIdReady', () => {
                userIdDisplay.textContent = currentUserId;
                loadUserProfile(); // 認証後、ユーザープロファイルをロード
                updateLeaderboard(); // 認証後、ランキングを更新
            });
        }

        // 初期状態ではマッチング後UIを非表示に
        if (postMatchUiDiv) {
            postMatchUiDiv.style.display = 'none';
        }

        // ユーザープロファイルをロードし、レートと表示名を更新する関数
        const loadUserProfile = async () => {
            if (!currentUserId || !rateDisplay || !displayNameInput) return;
            try {
                const response = await callReplitApi('/getUserProfile', { userId: currentUserId });
                const userData = response; // Replitサーバーから直接データが返る

                currentRate = userData.rate || 1500;
                rateDisplay.textContent = currentRate;
                displayNameInput.value = userData.displayName || `Player_${currentUserId.substring(0, 8)}`;
                userIdDisplay.textContent = userData.displayName || currentUserId; // 表示名があればそちらを使用
                console.log("User profile loaded:", userData);

            } catch (error) {
                console.error("Error loading user profile:", error);
                await window.showCustomDialog('エラー', `ユーザープロファイルの読み込みに失敗しました: ${error.message}`);
            }
        };

        // ランキングを更新する関数
        const updateLeaderboard = async () => {
            if (!leaderboardList) return;
            leaderboardList.innerHTML = '<li>ランキングを読み込み中...</li>';
            try {
                const response = await callReplitApi('/getLeaderboard');
                const leaderboardData = response.leaderboard;

                if (!leaderboardData || leaderboardData.length === 0) {
                    leaderboardList.innerHTML = '<li>まだランキングデータがありません。</li>';
                    return;
                }
                leaderboardList.innerHTML = '';
                leaderboardData.forEach((user, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${index + 1}. ${escapeBackticks(user.displayName)} - Rate: ${user.rate} (${user.wins}勝/${user.losses}敗)`;
                    leaderboardList.appendChild(listItem);
                });
            } catch (error) {
                console.error("Error updating leaderboard:", error);
                leaderboardList.innerHTML = '<li>ランキングの読み込み中にエラーが発生しました。</li>';
            }
        };

        // ストレージから対戦履歴を読み込む関数 (ローカルストレージ用)
        const loadMatchHistory = async () => {
            if (!matchHistoryList) return;
            const result = await storage.get(['matchHistory']);
            const history = result.matchHistory || [];
            matchHistoryList.innerHTML = ''; // クリア
            if (history.length === 0) {
                matchHistoryList.innerHTML = '<li>まだ対戦履歴がありません。</li>';
            } else {
                history.forEach(record => {
                    const listItem = document.createElement('li');
                    listItem.textContent = escapeBackticks(record);
                    matchHistoryList.appendChild(listItem);
                });
            }
        };

        // 対戦履歴を保存する関数 (ローカルストレージ用)
        const saveMatchHistory = async (record) => {
            const result = await storage.get(['matchHistory']);
            const history = result.matchHistory || [];
            history.unshift(record); // 最新のものを先頭に追加
            if (history.length > 10) { // 履歴を最新10件に制限
                history.pop();
            }
            await storage.set({matchHistory: history});
            loadMatchHistory(); // 保存後に再読み込み
        };

        // マッチング状態を更新し、UIを更新する
        const updateMatchingUI = async () => {
            // 要素を確実に取得
            const preMatchUiDiv = document.getElementById('pre-match-ui');
            const matchingStatusDiv = document.getElementById('matching-status');
            const postMatchUiDiv = document.getElementById('post-match-ui');

            if (!preMatchUiDiv || !matchingStatusDiv || !postMatchUiDiv) {
                console.warn("Matching UI elements not found for update. Skipping UI update.");
                return;
            }

            console.log("updateMatchingUI called. isUserMatching:", isUserMatching, "currentMatchInfo:", currentMatchInfo);

            // 全てのUI要素を非表示にする
            preMatchUiDiv.style.display = 'none';
            matchingStatusDiv.style.display = 'none';
            postMatchUiDiv.style.display = 'none';

            if (isUserMatching) {
                // マッチング中のUIを表示
                matchingStatusDiv.style.display = 'flex';
            } else if (currentMatchInfo && currentMatchInfo.status === 'in-progress') {
        postMatchUiDiv.style.display = 'block';
        if (chatMessagesDiv) {
            // currentMatchInfo.player1Id と currentMatchInfo.player2Id を使用
            const opponentId = currentMatchInfo.player1Id === currentUserId ? currentMatchInfo.player2Id : currentMatchInfo.player1Id;
            try {
                const opponentProfile = await callReplitApi('/getUserProfile', { userId: opponentId });
                const opponentDisplayName = opponentProfile.displayName || opponentId;

                chatMessagesDiv.innerHTML = `
                    <p><strong>[システム]:</strong> 対戦相手が見つかりました！${escapeBackticks(opponentDisplayName)}</p>
                    <p><strong>[システム]:</strong> 対戦が始まりました！</p>
                `;
                chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
            } catch (error) {
                console.error("Failed to get opponent display name in updateMatchingUI:", error); // エラーログを詳細化
                chatMessagesDiv.innerHTML = `
                    <p><strong>[システム]:</strong> 対戦相手が見つかりました！(名前取得失敗)</p>
                    <p><strong>[システム]:</strong> 対戦が始まりました！</p>
                `;
            }
        }
    } else {
                // マッチング中でない、かつマッチも成立していない通常のUI
                preMatchUiDiv.style.display = 'block';
            }
        };

        // チャットメッセージをUIに表示する関数
        const displayChatMessage = async (senderId, message) => { // async に変更
            if (!chatMessagesDiv) return;
            const messageElement = document.createElement('p');

            let senderDisplayName = senderId;
            if (senderId === currentUserId) {
                senderDisplayName = 'あなた';
            } else {
                // 相手の表示名を取得
                try {
                    const opponentProfile = await callReplitApi('/getUserProfile', { userId: senderId });
                    senderDisplayName = opponentProfile.displayName || `相手プレイヤー (${senderId.substring(0, 8)}...)`;
                } catch (error) {
                    console.error("Failed to get sender display name for chat:", error);
                    senderDisplayName = `相手プレイヤー (${senderId.substring(0, 8)}...)`;
                }
            }

            messageElement.innerHTML = `<strong>[${escapeBackticks(senderDisplayName)}]:</strong> ${escapeBackticks(message)}`; // メッセージをエスケープ
            chatMessagesDiv.appendChild(messageElement);
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight; // スクロールを一番下へ
        };

        // マッチング状態をリセットするヘルパー関数
        const resetMatchmakingState = () => {
            isUserMatching = false;
            currentMatchInfo = null;
            currentMatchDocId = null;
            lastChatTimestamp = 0; // チャットタイムスタンプをリセット
            if (matchmakingPollingInterval) {
                clearInterval(matchmakingPollingInterval);
                matchmakingPollingInterval = null;
            }
            if (chatPollingInterval) {
                clearInterval(chatPollingInterval);
                chatPollingInterval = null;
            }
            console.log("Matchmaking state reset.");
        };

        // マッチング状態をポーリングする
        const pollMatchStatus = async () => {
    if (!currentUserId) return;
    try {
        const response = await callReplitApi('/checkMatchStatus', { userId: currentUserId });
        console.log("Poll Match Status Response:", response);

        if (response.status === 'matched' && response.matchInfo) {
            // サーバーから返された最新のmatchInfoをcurrentMatchInfoに設定
            if (!currentMatchInfo || currentMatchInfo.matchId !== response.matchInfo.matchId) {
                await window.showCustomDialog('対戦相手決定', `対戦相手が見つかりました！`);
            }
            currentMatchInfo = response.matchInfo;
            currentMatchDocId = response.matchInfo.matchId;
            isUserMatching = false;
            updateMatchingUI();
            startChatPolling();
            if (matchmakingPollingInterval) {
                clearInterval(matchmakingPollingInterval);
                matchmakingPollingInterval = null;
            }
            console.log("Match established and polling stopped for matchmaking.");
        } else if (response.status === 'none') {
            // サーバー側で対戦が終了している場合、クライアントの状態もリセット
            if (isUserMatching || currentMatchInfo) { // マッチング中か、対戦中だった場合のみメッセージ
                await window.showCustomDialog('対戦終了/キャンセル', response.message || '対戦が終了またはキャンセルされました。');
            }
            resetMatchmakingState();
            updateMatchingUI();
            loadUserProfile(); // レートとランキングを更新
            updateLeaderboard();
        }
        // 'waiting' の場合は何もしない（ポーリングを続ける）
    } catch (error) {
        console.error("Error polling match status:", error);
        // ポーリングエラーは頻繁に起こりうるため、ダイアログは出さない方が良い場合も
        // await window.showCustomDialog('エラー', `マッチング状態の確認中にエラーが発生しました: ${error.message}`);
        resetMatchmakingState(); // エラー時も状態をリセットして、再試行可能な状態にする
        updateMatchingUI();
    }
};

        // チャットメッセージをポーリングする
        const pollChatMessages = async () => {
            if (!currentMatchDocId) return;
            try {
                const response = await callReplitApi('/getChatMessages', {
                    matchId: currentMatchDocId,
                    lastTimestamp: lastChatTimestamp
                });
                if (response.messages && response.messages.length > 0) {
                    // 受信したメッセージをタイムスタンプでソートする（念のため）
                    response.messages.sort((a, b) => a.timestamp - b.timestamp);

                    response.messages.forEach(msg => {
                        // lastChatTimestampより新しいメッセージのみ表示
                        // Replitサーバー側で timestamp がミリ秒まで正確に記録され、ここでは数値として扱われる前提
                        if (msg.timestamp > lastChatTimestamp) {
                            displayChatMessage(msg.senderId, msg.message);
                            lastChatTimestamp = msg.timestamp; // 最新のタイムスタンプを更新
                        }
                    });
                }
            } catch (error) {
                console.error("Error polling chat messages:", error);
                // チャットのポーリングエラーは致命的ではないので、ダイアログは出さない
            }
        };

        const startChatPolling = () => {
            if (chatPollingInterval) clearInterval(chatPollingInterval);
            chatPollingInterval = setInterval(pollChatMessages, 1000); // 1秒ごとにチャットをポーリング
            console.log("Started polling for chat messages.");
        };

        // イベントハンドラ関数
        async function handleMatchingButtonClick() {
            if (!currentUserId || !displayNameInput) {
                await window.showCustomDialog('エラー', 'ユーザーIDが取得できません。しばらく待ってから再度お試しください。');
                return;
            }
            if (isUserMatching) {
                await window.showCustomDialog('エラー', "すでにマッチング中です。");
                return;
            }
            if (currentMatchInfo) {
                await window.showCustomDialog('エラー', "現在、対戦中です。");
                return;
            }

            isUserMatching = true;
            updateMatchingUI(); // UIをマッチング中状態に更新

            requestAnimationFrame(async () => {
                await window.showCustomDialog('オンラインマッチング開始', '対戦相手を検索中です...');
            });

            try {
                // 既存のポーリングなどをクリーンアップ
                resetMatchmakingState(); // これで isUserMatching も false になるので、直後に true に再設定

                isUserMatching = true; // マッチング中状態を維持

                const response = await callReplitApi('/handleMatchmaking', {
            userId: currentUserId,
            displayName: displayNameInput.value
        });
        console.log("Handle Matchmaking Response:", response);

        if (response.status === 'matched' && response.matchId) {
            currentMatchInfo = {
                matchId: response.matchId,
                // ★★★ ここでplayer1Idとplayer2Idをresponseから取得 ★★★
                player1Id: response.player1Id,
                player2Id: response.player2Id,
                status: 'in-progress'
            };
            currentMatchDocId = response.matchId;
            isUserMatching = false;
            await window.showCustomDialog('対戦相手決定', `対戦相手が見つかりました！`);
            updateMatchingUI();
            startChatPolling();
        } else if (response.status === 'waiting') {
                    await window.showCustomDialog('マッチング待機', '対戦相手を検索中です。しばらくお待ちください。');
                    // 待機状態なので、マッチング状態のポーリングを開始
                    if (matchmakingPollingInterval) clearInterval(matchmakingPollingInterval);
                    matchmakingPollingInterval = setInterval(pollMatchStatus, 3000); // 3秒ごとにポーリング
                    console.log("Started polling for matchmaking status.");
                } else {
                    await window.showCustomDialog('エラー', `マッチング開始に失敗しました: ${response.message || '不明なエラー'}`);
                    resetMatchmakingState();
                    updateMatchingUI();
                }
            } catch (error) {
                console.error("Error starting matchmaking:", error);
                await window.showCustomDialog('エラー', `マッチング開始に失敗しました: ${error.message}`);
                resetMatchmakingState();
                updateMatchingUI();
            }
        }

        async function handleCancelMatchingButtonClick() {
    const confirmed = await window.showCustomDialog('マッチングキャンセル', 'マッチングをキャンセルしますか？', true);
    if (confirmed) {
        if (!currentUserId) {
            await window.showCustomDialog('エラー', 'ユーザーIDが利用できません。');
            return;
        }

        console.log("Attempting to cancel matchmaking...");
        console.log("Current matchmaking state: isUserMatching =", isUserMatching, "currentMatchInfo =", currentMatchInfo);

        let response; // response変数をtryブロックの外で宣言
        try {
            response = await callReplitApi('/cancelMatchmaking', { userId: currentUserId });
            console.log("Replit cancelMatchmaking response:", response);

            if (response.success) {
                await window.showCustomDialog('キャンセル完了', 'マッチングをキャンセルしました。');
            } else {
                await window.showCustomDialog('エラー', `マッチングキャンセルに失敗しました: ${response.message || '不明なエラー'}`);
            }
            await pollMatchStatus();
            updateMatchingUI();
        } catch (error) {
            console.error("Error cancelling matchmaking:", error);
            await window.showCustomDialog('エラー', `マッチングキャンセルに失敗しました: ${error.message}`);
            await pollMatchStatus();
            updateMatchingUI();
        }
    }
}
        async function handleSendChatButtonClick() {
            if (isSendingChat) {
                console.log("Chat message already sending, ignoring click.");
                return; // 送信中は重複して処理しない
            }

            const message = chatInput.value.trim();
            if (!message) {
                // メッセージが空の場合は何もせず、エラーも表示しない
                return;
            }

            if (!currentMatchDocId || !currentUserId) {
                await window.showCustomDialog('エラー', 'チャットを送信できません。対戦中ではありません。');
                return;
            }

            isSendingChat = true; // 送信開始
            sendChatButton.disabled = true; // ボタンを無効化
            chatInput.value = ''; // 先に入力欄をクリア（UI上の即時フィードバック）

            try {
                await callReplitApi('/sendChatMessage', {
                    matchId: currentMatchDocId,
                    senderId: currentUserId,
                    message: message
                });
                // 送信成功。実際の表示はpollChatMessagesが担当するため、ここでは特別な表示は不要。
                console.log("Chat message sent successfully.");
            } catch (error) {
                console.error("Error sending chat message:", error);
                await window.showCustomDialog('エラー', `メッセージの送信に失敗しました: ${error.message}`);
                // エラー時は、クリアした入力欄にメッセージを戻すことも検討（ユーザー体験のため）
                // chatInput.value = message;
            } finally {
                isSendingChat = false; // 送信完了
                sendChatButton.disabled = false; // ボタンを有効化
            }
        }

        function handleChatInputKeypress(e) {
            if (e.key === 'Enter') {
                sendChatButton.click();
            }
        }

        function handleChatPhraseButtonClick(event) {
            if (chatInput && sendChatButton) {
                chatInput.value = event.currentTarget.textContent;
                sendChatButton.click();
            }
        }

        async function reportMatchResult(result) {
    // ... (省略) ...
    try {
        const response = await callReplitApi('/reportMatchResult', {
            matchId: currentMatchDocId,
            reporterId: currentUserId,
            result: result
        });
        console.log("Report Match Result Response:", response);

        if (response.success) {
            if (response.message.includes('Waiting for opponent')) {
                await window.showCustomDialog('結果報告', '結果を報告しました。相手の結果を待っています...');
            } else if (response.message.includes('Match completed')) {
                await window.showCustomDialog('対戦結果完了', `対戦が終了しました！<br>レート変動: ${response.rateChange > 0 ? '+' : ''}${response.rateChange}`);
                resetMatchmakingState();
                updateMatchingUI();
                loadUserProfile();
                updateLeaderboard();
            } else if (response.message.includes('Match cancelled')) {
                await window.showCustomDialog('対戦中止完了', '対戦が中止されました。');
                resetMatchmakingState();
                updateMatchingUI();
                loadUserProfile();
                updateLeaderboard();
            }
        } else {
            await window.showCustomDialog('エラー', `結果報告に失敗しました: ${response.error || '不明なエラー'}`);
        }
    } catch (error) {
        console.error("Error reporting match result:", error);
        await window.showCustomDialog('エラー', `結果報告に失敗しました: ${error.message}`);
    }
}
        async function handleWinButtonClick() { await reportMatchResult('win'); }
        async function handleLoseButtonClick() { await reportMatchResult('lose'); }

        async function handleCancelBattleButtonClick() {
    const confirmed = await window.showCustomDialog('対戦中止', '対戦を中止しますか？<br>この操作はレートに影響しません。', true);
    if (!confirmed) return;

    if (!currentMatchDocId || !currentMatchInfo || !currentUserId) {
        await window.showCustomDialog('エラー', '対戦中ではありません。');
        return;
    }

    let response; // response変数をtryブロックの外で宣言
    try {
        response = await callReplitApi('/reportMatchResult', {
            matchId: currentMatchDocId,
            reporterId: currentUserId,
            result: 'cancel'
        });
        console.log("Cancel Battle Response:", response);

        if (response.success) {
            await window.showCustomDialog('対戦中止完了', '対戦を中止しました。');
            resetMatchmakingState();
            updateMatchingUI();
            loadUserProfile();
            updateLeaderboard();
        } else {
            await window.showCustomDialog('エラー', `対戦中止に失敗しました: ${response.error || '不明なエラー'}`);
        }
    } catch (error) {
        console.error("Error cancelling match:", error);
        await window.showCustomDialog('エラー', `対戦中止に失敗しました: ${error.message}`);
    }
}
        // プレイヤー名保存ボタンのイベントハンドラ
        async function handleSaveDisplayNameButtonClick() {
            if (!displayNameInput || !currentUserId) return;
            const newDisplayName = displayNameInput.value.trim();

            if (!newDisplayName) {
                await window.showCustomDialog('エラー', 'プレイヤー名を入力してください。');
                return;
            }
            if (newDisplayName.length > 20) { // 例: 20文字まで
                await window.showCustomDialog('エラー', 'プレイヤー名は20文字以内で入力してください。');
                return;
            }

            try {
                await callReplitApi('/updateDisplayName', {
                    userId: currentUserId,
                    newDisplayName: newDisplayName
                });
                await window.showCustomDialog('保存完了', `プレイヤー名を「${escapeBackticks(newDisplayName)}」に更新しました！`);
                loadUserProfile(); // 表示を更新
                updateLeaderboard(); // ランキングを更新
            } catch (error) {
                console.error("Error saving display name:", error);
                await window.showCustomDialog('エラー', `プレイヤー名の保存に失敗しました: ${error.message}`);
            }
        }


        // イベントリスナーを再アタッチ
        if (matchingButton) {
            matchingButton.removeEventListener('click', handleMatchingButtonClick);
            matchingButton.addEventListener('click', handleMatchingButtonClick);
        }
        if (cancelMatchingButton) {
            cancelMatchingButton.removeEventListener('click', handleCancelMatchingButtonClick);
            cancelMatchingButton.addEventListener('click', handleCancelMatchingButtonClick);
        }
        if (sendChatButton) {
            sendChatButton.removeEventListener('click', handleSendChatButtonClick);
            sendChatButton.addEventListener('click', handleSendChatButtonClick);
            if (chatInput) {
                chatInput.removeEventListener('keypress', handleChatInputKeypress);
                chatInput.addEventListener('keypress', handleChatInputKeypress);
            }
        }
        chatPhraseButtons.forEach(button => {
            button.removeEventListener('click', handleChatPhraseButtonClick);
            button.addEventListener('click', handleChatPhraseButtonClick);
        });
        if (winButton) {
            winButton.removeEventListener('click', handleWinButtonClick);
            winButton.addEventListener('click', handleWinButtonClick);
        }
        if (loseButton) {
            loseButton.removeEventListener('click', handleLoseButtonClick);
            loseButton.addEventListener('click', handleLoseButtonClick);
        }
        if (cancelButton) {
            cancelButton.removeEventListener('click', handleCancelBattleButtonClick);
            cancelButton.addEventListener('click', handleCancelBattleButtonClick);
        }
        if (saveDisplayNameButton) { // 新しいボタンのイベントリスナー
            saveDisplayNameButton.removeEventListener('click', handleSaveDisplayNameButtonClick);
            saveDisplayNameButton.addEventListener('click', handleSaveDisplayNameButtonClick);
        }


        // 初期ロード時にユーザープロファイル、履歴、ランキングをロード
        await loadUserProfile(); // 初期レート表示とプロファイルロード
        await loadMatchHistory(); // ローカル対戦履歴
        await updateLeaderboard(); // ランキングの初期表示
        // ★★★ レート戦セクション初期化時に、現在のマッチング状態をReplitサーバーから取得してUIを更新 ★★★
        await pollMatchStatus();
        updateMatchingUI(); // pollMatchStatusの結果に基づいてUIを更新
    };

    // === memo.js の内容 ===
    window.initMemoSection = async function() {
        console.log("Memo section initialized.");

        // === メモセクションのロジック ===
        // 各要素を関数内で取得
        const saveMemoButton = document.getElementById('save-memo-button');
        const memoTextArea = document.getElementById('memo-text-area');
        const savedMemosList = document.getElementById('saved-memos-list');
        const screenshotArea = document.getElementById('screenshot-area');
        const memoSearchInput = document.getElementById('memo-search-input');
        const memoSearchButton = document.getElementById('memo-search-button');
        let editingMemoIndex = -1; // 編集中のメモのインデックス

        // 保存されたメモを読み込む関数
        const loadMemos = async (filterQuery = '') => {
            if (!savedMemosList) return;
            const result = await storage.get(['savedMemos']);
            const memos = result.savedMemos || [];
            savedMemosList.innerHTML = ''; // リストをクリア

            const filteredMemos = memos.filter(memo =>
                escapeBackticks(memo.content).toLowerCase().includes(escapeBackticks(filterQuery).toLowerCase()) ||
                escapeBackticks(memo.timestamp).includes(escapeBackticks(filterQuery))
            );

            if (filteredMemos.length === 0) {
                savedMemosList.innerHTML = '<li>まだメモがありません。</li>';
            } else {
                // 新しいメモが常に先頭に来るように逆順に表示
                [...filteredMemos].reverse().forEach((memo) => {
                    // 元の配列におけるインデックスを計算
                    const originalIndex = memos.findIndex(m => m.timestamp === memo.timestamp && m.content === memo.content);
                    const memoItem = document.createElement('li');
                    memoItem.className = 'saved-memo-item';

                    memoItem.innerHTML = `
                        <strong>${escapeBackticks(memo.timestamp)}</strong>: ${escapeBackticks(memo.content)}
                        <button class="delete-memo-button" data-original-index="${originalIndex}" title="削除"><i class="fas fa-trash-alt"></i></button>
                        <button class="edit-memo-button" data-original-index="${originalIndex}" title="編集"><i class="fas fa-edit"></i></button>
                        ${memo.screenshotUrl ? `<br><img src="${escapeBackticks(memo.screenshotUrl)}" alt="スクリーンショット" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;">` : ''}
                    `;
                    savedMemosList.appendChild(memoItem);
                });
                // 削除ボタンのイベントリスナーを設定
                savedMemosList.querySelectorAll('.delete-memo-button').forEach(button => {
                    button.removeEventListener('click', handleDeleteMemoClick); // 既存のリスナーを削除
                    button.addEventListener('click', handleDeleteMemoClick);
                });
                // 編集ボタンのイベントリスナーを設定
                savedMemosList.querySelectorAll('.edit-memo-button').forEach(button => {
                    button.removeEventListener('click', handleEditMemoClick); // 既存のリスナーを削除
                    button.addEventListener('click', handleEditMemoClick);
                });
            }
        };

        // メモを削除する関数
        const deleteMemo = async (originalIndex) => {
            const result = await storage.get(['savedMemos']);
            let memos = result.savedMemos || [];
            if (originalIndex > -1 && originalIndex < memos.length) {
                memos.splice(originalIndex, 1);
                await storage.set({savedMemos: memos});
                await window.showCustomDialog('削除完了', 'メモを削除しました。');
                if (memoSearchInput) loadMemos(memoSearchInput.value.trim());
            }
        };

        // メモを編集する関数
        const editMemo = async (originalIndex) => {
            if (!memoTextArea) return;
            const result = await storage.get(['savedMemos']);
            const memos = result.savedMemos || [];
            if (originalIndex > -1 && originalIndex < memos.length) {
                const memoToEdit = memos[originalIndex];
                memoTextArea.value = memoToEdit.content;
                // スクリーンショットも表示
                if (memoToEdit.screenshotUrl && screenshotArea) {
                    screenshotArea.innerHTML = `<img src="${escapeBackticks(memoToEdit.screenshotUrl)}" alt="Screenshot">`;
                } else if (screenshotArea) {
                    screenshotArea.innerHTML = '<p>スクリーンショットがここに表示されます。（画像をここに貼り付けることもできます - Ctrl+V / Cmd-V）</p>';
                }
                editingMemoIndex = originalIndex;
                await window.showCustomDialog('メモ編集', 'メモを編集モードにしました。内容を変更して「メモを保存」ボタンを押してください。');
            }
        };

        // イベントハンドラ関数
        async function handleDeleteMemoClick(event) {
            // Corrected: Use dataset.originalIndex for camelCase access
            const originalIndexToDelete = parseInt(event.currentTarget.dataset.originalIndex);
            const confirmed = await window.showCustomDialog('メモ削除', 'このメモを削除しますか？', true);
            if (confirmed) {
                deleteMemo(originalIndexToDelete);
            }
        }

        function handleEditMemoClick(event) {
            // Corrected: Use dataset.originalIndex for camelCase access
            const originalIndexToEdit = parseInt(event.currentTarget.dataset.originalIndex);
            editMemo(originalIndexToEdit);
        }

        // スクリーンショットボタンのクリックハンドラは削除
        // async function handleScreenshotButtonClick() {
        //     chrome.runtime.sendMessage({ action: "captureScreenshot" });
        // }

        async function handleSaveMemoButtonClick() {
            if (!memoTextArea || !screenshotArea) return;
            const memoContent = memoTextArea.value.trim();
            const currentScreenshot = screenshotArea.querySelector('img');
            const screenshotUrl = currentScreenshot ? currentScreenshot.src : null;

            if (memoContent || screenshotUrl) {
                const result = await storage.get(['savedMemos']);
                let memos = result.savedMemos || [];
                const timestamp = new Date().toLocaleString();

                if (editingMemoIndex !== -1) {
                    memos[editingMemoIndex].content = memoContent;
                    memos[editingMemoIndex].timestamp = timestamp;
                    memos[editingMemoIndex].screenshotUrl = screenshotUrl;
                    editingMemoIndex = -1;
                    await window.showCustomDialog('保存完了', 'メモを更新しました！');
                } else {
                    memos.push({ timestamp, content: memoContent, screenshotUrl });
                    await window.showCustomDialog('保存完了', 'メモを保存しました！');
                }

                await storage.set({ savedMemos: memos });
                if (memoTextArea) memoTextArea.value = '';
                if (screenshotArea) screenshotArea.innerHTML = '<p>スクリーンショットがここに表示されます。（画像をここに貼り付けることもできます - Ctrl+V / Cmd-V）</p>';
                if (memoSearchInput) loadMemos(memoSearchInput.value.trim());
            } else {
                await window.showCustomDialog('エラー', 'メモ内容が空か、スクリーンショットがありません。');
            }
        }

        function handleMemoSearchButtonClick() {
            if (memoSearchInput) {
                const query = memoSearchInput.value.trim();
                loadMemos(query);
            }
        }

        function handleMemoSearchInputKeypress(e) {
            if (e.key === 'Enter') {
                if (memoSearchButton) memoSearchButton.click();
            }
        }

        // main.jsから発火されるカスタムイベントをリッスン (このイベントはmain.jsから削除されるため、将来的には不要になる)
        document.removeEventListener('screenshotCropped', handleScreenshotCropped); // 既存のリスナーを削除
        document.addEventListener('screenshotCropped', handleScreenshotCropped);

        function handleScreenshotCropped(event) {
            if (screenshotArea) {
                screenshotArea.innerHTML = `<img src="${escapeBackticks(event.detail.imageUrl)}" alt="Cropped Screenshot">`;
            }
        }

        // 画像貼り付けイベントリスナーを追加
        if (screenshotArea) {
            screenshotArea.removeEventListener('paste', handleImagePaste); // 重複防止
            screenshotArea.addEventListener('paste', handleImagePaste);
        }

        function handleImagePaste(event) {
            const items = event.clipboardData.items;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const imageUrl = e.target.result;
                        if (screenshotArea) {
                            screenshotArea.innerHTML = `<img src="${escapeBackticks(imageUrl)}" alt="Pasted Image">`;
                            await window.showCustomDialog('貼り付け完了', '画像をメモエリアに貼り付けました。');
                        }
                    };
                    reader.readAsDataURL(blob);
                    return;
                }
            }
            window.showCustomDialog('貼り付け失敗', 'クリップボードに画像がありませんでした。');
        }


        // イベントリスナーを再アタッチ
        // if (screenshotButton) { // スクリーンショットボタンは削除
        //     screenshotButton.removeEventListener('click', handleScreenshotButtonClick);
        //     screenshotButton.addEventListener('click', handleScreenshotButtonClick);
        // }

        if (saveMemoButton) {
            saveMemoButton.removeEventListener('click', handleSaveMemoButtonClick);
            saveMemoButton.addEventListener('click', handleSaveMemoButtonClick);
        }

        if (memoSearchButton) {
            memoSearchButton.removeEventListener('click', handleMemoSearchButtonClick);
            memoSearchButton.addEventListener('click', handleMemoSearchButtonClick);
        }
        if (memoSearchInput) {
            memoSearchInput.removeEventListener('keypress', handleMemoSearchInputKeypress);
            memoSearchInput.addEventListener('keypress', handleMemoSearchInputKeypress);
        }

        loadMemos();
    }; // End of initMemoSection

    // === search.js の内容 ===
    window.initSearchSection = async function() {
        console.log("Search section initialized.");

        // === 検索セクションのロジック ===
        // 各要素を関数内で取得
        const searchInput = document.getElementById('search-input');
        const performSearchButton = document.getElementById('perform-search-button');
        const searchResults = document.getElementById('search-results');
        const searchFilterType = document.getElementById('search-filter-type');
        const searchFilterSet = document.getElementById('search-filter-set');
        const searchTextTarget = document.getElementById('search-text-target');

        const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');

        // fuzzyThreshold を initSearchSection のスコープ内で定義
        const fuzzyThreshold = 2; // 許容する誤字脱字の閾値 (例: 2文字までの違いを許容)

        /**
         * オートコンプリートの候補がクリックされたときのハンドラ
         * @param {Event} event - クリックイベント
         */
        function handleAutocompleteSuggestionClick(event) {
            searchInput.value = event.currentTarget.textContent;
            autocompleteSuggestions.style.display = 'none';
            performSearchButton.click(); // オートコンプリート選択後、検索を実行
        }

        // 検索フィルターのセットオプションを動的に追加
        function populateSearchFilters() {
            const sets = new Set();
            // window.allCards を使用
            if (window.allCards) {
                window.allCards.forEach(card => {
                    if (card.info && card.info.length > 0) {
                        const setInfo = card.info.find(info => info.startsWith('このカードの収録セットは、'));
                        if (setInfo) {
                            const setName = setInfo.replace('このカードの収録セットは、', '').replace('です。', '');
                            sets.add(setName);
                        }
                    }
                });
            }
            if (searchFilterSet) {
                searchFilterSet.innerHTML = '<option value="">全て</option>';
                Array.from(sets).sort().forEach(set => {
                    const option = document.createElement('option');
                    option.value = set;
                    option.textContent = set;
                    searchFilterSet.appendChild(option);
                });
            }
        }

        /**
         * カード情報を正規化するヘルパー関数
         * @param {string} text - 正規化する文字列
         * @returns {string} 正規化された文字列
         */
        function normalizeText(text) {
            // nullまたはundefinedの場合に備えて空文字列を返す
            if (text === null || text === undefined) {
                return '';
            }
            // 半角カタカナを全角カタカナに変換
            text = String(text).replace(/[\uFF61-\uFF9F]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) + 0x20);
            });
            // 全角ひらがなを全角カタカナに変換
            text = text.replace(/[\u3041-\u3096]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) + 0x60);
            });
            // スペースを削除
            text = text.replace(/\s+/g, '');
            return text.toLowerCase();
        }

        /**
         * レーベンシュタイン距離を計算する関数 (あいまい検索用)
         * @param {string} s1 - 文字列1
         * @param {string} s2 - 文字列2
         * @returns {number} レーベンシュタイン距離
         */
        function levenshteinDistance(s1, s2) {
            s1 = normalizeText(s1);
            s2 = normalizeText(s2);

            const m = s1.length;
            const n = s2.length;
            const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

            for (let i = 0; i <= m; i++) dp[i][0] = i;
            for (let j = 0; j <= n; j++) dp[0][j] = j;

            for (let i = 1; i <= m; i++) {
                for (let j = 1; j <= n; j++) {
                    const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,       // deletion
                        dp[i][j - 1] + 1,       // insertion
                        dp[i - 1][j - 1] + cost // substitution
                    );
                }
                // 検索クエリが長すぎる場合、パフォーマンスのために早期終了
                if (dp[i][n] > fuzzyThreshold + 1) { // fuzzyThreshold は外側のスコープで定義されている
                    return Infinity;
                }
            }
            return dp[m][n];
        }

        /**
         * カード検索を実行する関数
         * @param {string} query - 検索クエリ
         * @param {string} textTarget - テキスト検索対象 ('all', 'name', 'effect', 'lore')
         * @param {string} typeFilter - カードタイプフィルター
         * @param {string} setFilter - 収録セットフィルター
         */
        async function performCardSearch(query, textTarget, typeFilter, setFilter) {
            if (!searchResults) return;
            searchResults.innerHTML = '<p><div class="spinner"></div> 検索中...</p>'; // ローディングスピナー表示

            const normalizedQuery = normalizeText(query);
            // fuzzyThreshold は initSearchSection のスコープで定義されているため、ここで再定義は不要

            let exactMatches = [];
            let fuzzyMatches = [];

            window.allCards.forEach(card => { // window.allCards を使用
                let cardText = '';
                switch (textTarget) {
                    case 'name':
                        cardText = card.name;
                        break;
                    case 'effect':
                        cardText = card.info.find(info => info.startsWith("このカードの効果は、「")) || '';
                        break;
                    case 'lore':
                        cardText = card.info.find(info => info.startsWith("このカードの世界観は、「")) || '';
                        break;
                    case 'all':
                    default:
                        cardText = card.name + ' ' + card.info.join(' ');
                        break;
                }

                const normalizedCardText = normalizeText(cardText);
                const distance = levenshteinDistance(cardText, normalizedQuery);

                // タイプフィルター
                const matchesType = !typeFilter || card.info.some(info => info.includes(`このカードは${typeFilter}`));

                // セットフィルター
                const matchesSet = !setFilter || card.info.some(info => info.includes(`このカードの収録セットは、${setFilter}`));

                if (matchesType && matchesSet) {
                    if (normalizedCardText.includes(normalizedQuery) && query.length > 0) {
                        exactMatches.push(card);
                    } else if (distance <= fuzzyThreshold && query.length > 0) {
                        fuzzyMatches.push({ card: card, distance: distance });
                    }
                }
            });

            // 距離でソート
            fuzzyMatches.sort((a, b) => a.distance - b.distance);

            let resultsHtml = '';

            if (exactMatches.length > 0) {
                resultsHtml += `<p>「<strong>${escapeBackticks(query || '全てのカード')}</strong>」の検索結果 (${exactMatches.length}件):</p><ul>`;
                exactMatches.forEach(card => {
                    resultsHtml += `<li><a href="#" class="card-name-link" data-card-name="${escapeBackticks(card.name)}"><strong>${escapeBackticks(card.name)}</strong></a><br>`;
                    card.info.forEach(info => {
                        if (info.startsWith("このカードの効果は、「")) {
                            resultsHtml += `<strong>効果:</strong> ${escapeBackticks(info.replace("このカードの効果は、「", "").replace("」です。", ""))}<br>`;
                        } else if (info.startsWith("このカードの世界観は、「")) {
                            resultsHtml += `<strong>世界観:</strong> ${escapeBackticks(info.replace("このカードの世界観は、「", "").replace("」です。", ""))}<br>`;
                        }
                    });
                    resultsHtml += `</li>`;
                });
                resultsHtml += `</ul>`;
            } else {
                resultsHtml += '<p>検索結果が見つかりませんでした。</p>';
            }

            // AI生成の代わりに、あいまい検索結果を「もしかして？」として表示
            if (exactMatches.length === 0 && fuzzyMatches.length > 0) {
                resultsHtml += `<h4 style="margin-top: 20px;">もしかして？ (あいまい検索結果)</h4><ul>`;
                fuzzyMatches.slice(0, 5).forEach(match => { // 5件まで表示
                    const card = match.card;
                    resultsHtml += `<li><a href="#" class="card-name-link" data-card-name="${escapeBackticks(card.name)}"><strong>${escapeBackticks(card.name)}</strong></a> (距離: ${match.distance})<br>`;
                    card.info.forEach(info => {
                        if (info.startsWith("このカードの効果は、「")) {
                            resultsHtml += `<strong>効果:</strong> ${escapeBackticks(info.replace("このカードの効果は、「", "").replace("」です。", ""))}<br>`;
                        } else if (info.startsWith("このカードの世界観は、「")) {
                            resultsHtml += `<strong>世界観:</strong> ${escapeBackticks(info.replace("このカードの世界観は、「", "").replace("」です。", ""))}<br>`;
                        }
                    });
                    resultsHtml += `</li>`;
                });
                resultsHtml += `</ul>`;
            }

            searchResults.innerHTML = resultsHtml;

            // カード名リンクにイベントリスナーを追加
            searchResults.querySelectorAll('.card-name-link').forEach(link => {
                link.removeEventListener('click', handleCardNameLinkClick); // 既存のリスナーを削除
                link.addEventListener('click', handleCardNameLinkClick);
            });
        }

        // カード詳細を表示するポップアップ
        function displayCardDetails(cardName) {
            const card = window.allCards.find(c => c.name === cardName); // window.allCards を使用
            if (!card) {
                window.showCustomDialog('エラー', 'カード詳細が見つかりませんでした。');
                return;
            }

            const detailHtml = `
                <h3>${escapeBackticks(card.name)}</h3>
                <ul>
                    ${card.info.map(info => `<li>${escapeBackticks(info)}</li>`).join('')}
                </ul>
                <button id="close-card-detail-popup">閉じる</button>
            `;

            const popup = document.createElement('div');
            popup.className = 'card-detail-popup';
            popup.innerHTML = detailHtml;
            document.body.appendChild(popup);

            popup.querySelector('#close-card-detail-popup').removeEventListener('click', handleCloseCardDetailPopupClick); // 既存のリスナーを削除
            popup.querySelector('#close-card-detail-popup').addEventListener('click', handleCloseCardDetailPopupClick);
        }

        // イベントハンドラ関数
        function handleCardNameLinkClick(e) {
            e.preventDefault();
            const cardName = e.target.dataset.cardName;
            displayCardDetails(cardName);
        }

        function handleCloseCardDetailPopupClick(e) {
            e.target.closest('.card-detail-popup').remove();
        }

        function handlePerformSearchButtonClick() {
            if (!searchInput || !searchTextTarget || !searchFilterType || !searchFilterSet) return;
            const query = searchInput.value.trim();
            const textTarget = searchTextTarget.value;
            const typeFilter = searchFilterType.value;
            const setFilter = searchFilterSet.value;

            if (query || typeFilter || setFilter) {
                performCardSearch(query, textTarget, typeFilter, setFilter);
            } else {
                if (searchResults) searchResults.innerHTML = '<p>検索キーワードまたはフィルターを入力してください。</p>';
            }
        }

        function handleSearchInputInput() {
            const query = searchInput.value.trim().toLowerCase();
            autocompleteSuggestions.innerHTML = '';

            if (query.length > 0) {
                const suggestions = window.allCards.filter(card => // window.allCards を使用
                    card.name.toLowerCase().includes(query)
                ).map(card => card.name);

                if (suggestions.length > 0) {
                    autocompleteSuggestions.style.display = 'block';
                    suggestions.slice(0, 5).forEach(suggestion => {
                        const div = document.createElement('div');
                        div.textContent = escapeBackticks(suggestion);
                        div.removeEventListener('click', handleAutocompleteSuggestionClick); // 既存のリスナーを削除
                        div.addEventListener('click', handleAutocompleteSuggestionClick);
                        autocompleteSuggestions.appendChild(div);
                    });
                } else {
                    autocompleteSuggestions.style.display = 'none';
                }
            } else {
                autocompleteSuggestions.style.display = 'none';
            }
        }

        function handleAutocompleteSuggestionClick(event) {
            searchInput.value = event.currentTarget.textContent;
            autocompleteSuggestions.style.display = 'none';
            performSearchButton.click(); // オートコンプリート選択後、検索を実行
        }

        function handleSearchInputBlur() {
            setTimeout(() => {
                if (autocompleteSuggestions) autocompleteSuggestions.style.display = 'none';
            }, 100); // クリックイベントが発火するのを待つ
        }

        // イベントリスナーを再アタッチ
        if (performSearchButton) {
            performSearchButton.removeEventListener('click', handlePerformSearchButtonClick);
            performSearchButton.addEventListener('click', handlePerformSearchButtonClick);
        }
        if (searchInput) {
            searchInput.removeEventListener('input', handleSearchInputInput);
            searchInput.addEventListener('input', handleSearchInputInput);
            searchInput.removeEventListener('blur', handleSearchInputBlur);
            searchInput.addEventListener('blur', handleSearchInputBlur);
        }

        // 検索フィルターを初期化
        populateSearchFilters();
    }; // End of initSearchSection

    // === minigames.js の内容 ===
    window.initMinigamesSection = async function() {
        console.log("Minigames section initialized.");

        // 各要素を関数内で取得
        const quizDisplayArea = document.getElementById('quiz-display-area');
        const quizTitle = document.getElementById('quiz-title');
        const quizHintArea = document.getElementById('quiz-hint-area');
        const quizDisplayImage = document.getElementById('quiz-display-image'); // imgタグ
        const quizAnswerInput = document.getElementById('quiz-answer-input');
        const quizSubmitButton = document.getElementById('quiz-submit-button');
        const quizResultArea = document.getElementById('quiz-result-area');
        const quizAnswerDisplay = document.getElementById('quiz-answer-display');
        const quizNextButton = document.getElementById('quiz-next-button');
        const quizResetButton = document.getElementById('quiz-reset-button');

        let currentQuizCard = null;
        let currentQuizType = null;
        let quizHintCount = 0;
        const maxHints = 2; // ヒントの最大数

        const minigameButtons = {
            cardName: document.getElementById('quiz-card-name'),
            illustrationEnlarge: document.getElementById('quiz-illustration-enlarge'),
            illustrationSilhouette: document.getElementById('quiz-illustration-silhouette'),
            illustrationMosaic: document.getElementById('quiz-illustration-mosaic')
        };

        const quizTypeTitles = {
            cardName: "カード名当てクイズ",
            illustrationEnlarge: "イラスト拡大クイズ",
            illustrationSilhouette: "イラストシルエットクイズ",
            illustrationMosaic: "イラストモザイク化クイズ"
        };

        /**
         * 新しいクイズを開始します。
         * @param {string} quizType - クイズのタイプ ('cardName', 'illustrationEnlarge', etc.)
         */
        async function startNewQuiz(quizType) {
            if (!window.allCards || window.allCards.length === 0) {
                await window.showCustomDialog('エラー', 'カードデータがロードされていません。カードデータが空でないか確認してください。');
                return;
            }

            resetQuizUI();
            currentQuizType = quizType;
            quizHintCount = 0;
            quizDisplayArea.style.display = 'block';
            quizTitle.textContent = quizTypeTitles[quizType] || "クイズ";

            // ランダムなカードを選択
            const randomIndex = Math.floor(Math.random() * window.allCards.length);
            currentQuizCard = window.allCards[randomIndex];
            console.log(`Selected card for quiz: ${currentQuizCard.name}`); // デバッグ用

            await generateQuizContent();
            quizNextButton.style.display = 'inline-block'; // ヒント/次の問題ボタンを表示
            quizSubmitButton.style.display = 'inline-block';
            quizAnswerInput.style.display = 'inline-block';
        }

        /**
         * クイズ内容を生成し表示します。
         */
        async function generateQuizContent() {
            quizHintArea.textContent = "";
            quizDisplayImage.style.display = 'none'; // 画像を一旦非表示

            if (currentQuizCard && currentQuizType) {
                switch (currentQuizType) {
                    case 'cardName':
                        displayCardNameQuiz();
                        break;
                    case 'illustrationEnlarge':
                        await displayIllustrationQuiz('enlarge');
                        break;
                    case 'illustrationSilhouette':
                        await displayIllustrationQuiz('silhouette');
                        break;
                    case 'illustrationMosaic':
                        await displayIllustrationQuiz('mosaic');
                        break;
                }
            }
        }

        function displayCardNameQuiz() {
            // カード名当てクイズでは画像は使用せず、ヒントで情報を出す
            quizDisplayImage.style.display = 'none'; // 画像を非表示
            quizHintArea.textContent = `このカードのヒント: \n`;
            if (quizHintCount >= 0) {
                const typeInfo = currentQuizCard.info.find(info => info.includes('このカードは'));
                if (typeInfo) quizHintArea.textContent += `タイプ: ${typeInfo.replace('このカードは', '').replace('です。', '')}\n`;
            }
            if (quizHintCount >= 1) {
                const effectInfo = currentQuizCard.info.find(info => info.startsWith('このカードの効果は、「'));
                if (effectInfo) quizHintArea.textContent += `効果: ${effectInfo.replace('このカードの効果は、「', '').replace('」です。', '')}\n`;
            }
            if (quizHintCount >= 2) {
                const loreInfo = currentQuizCard.info.find(info => info.startsWith('このカードの世界観は、「'));
                if (loreInfo) quizHintArea.textContent += `世界観: ${loreInfo.replace('このカードの世界観は、「', '').replace('」です。', '')}\n`;
            }

            // ヒントボタンのテキストを更新
            if (quizHintCount < maxHints) {
                quizNextButton.textContent = `次のヒント (${quizHintCount + 1}/${maxHints})`;
            } else {
                quizNextButton.textContent = '次の問題へ';
            }
        }

        async function displayIllustrationQuiz(mode) {
            const imageUrl = CARD_IMAGE_BASE_URL + (currentQuizCard.image_filename || currentQuizCard.name + '.png');
            quizDisplayImage.src = imageUrl; // imgタグのsrcを設定
            quizDisplayImage.style.display = 'block';

            // 画像のロードを待ってからフィルタを適用
            quizDisplayImage.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = quizDisplayImage.naturalWidth;
                canvas.height = quizDisplayImage.naturalHeight;

                ctx.drawImage(quizDisplayImage, 0, 0);

                if (mode === 'silhouette') {
                    // シルエット化: 黒で塗りつぶす
                    ctx.globalCompositeOperation = 'source-atop'; // 既存の画像に重ねて描画
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalCompositeOperation = 'source-over'; // 元に戻す
                } else if (mode === 'mosaic') {
                    // モザイク化: 簡易的なピクセル化
                    const pixelSize = 20 - (quizHintCount * 5); // ヒントが進むごとに粗さを軽減
                    ctx.imageSmoothingEnabled = false; // アンチエイリアス無効
                    ctx.drawImage(canvas, 0, 0, canvas.width / pixelSize, canvas.height / pixelSize);
                    ctx.drawImage(canvas, 0, 0, canvas.width / pixelSize, canvas.height / pixelSize, 0, 0, canvas.width, canvas.height);

                } else if (mode === 'enlarge') {
                    // 拡大: ランダムな領域を切り取る（ヒントが進むごとに表示範囲を広げる）
                    const zoomLevel = 1 + (quizHintCount * 0.5); // ヒントが進むごとに拡大率を下げ、全体が見えるように
                    const cropWidth = canvas.width / zoomLevel;
                    const cropHeight = canvas.height / zoomLevel;

                    const startX = Math.random() * (canvas.width - cropWidth);
                    const startY = Math.random() * (canvas.height - cropHeight);

                    const imageData = ctx.getImageData(startX, startY, cropWidth, cropHeight);
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
                    ctx.putImageData(imageData, 0, 0); // 切り取った部分を左上から描画
                    ctx.drawImage(canvas, 0, 0, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height); // 拡大して全体に描画
                }
                quizDisplayImage.src = canvas.toDataURL(); // 処理後の画像をimgタグに設定
            };
            quizDisplayImage.onerror = () => {
                quizDisplayImage.src = DEFAULT_PLACEHOLDER_IMAGE;
                quizHintArea.textContent = "画像を読み込めませんでした。URLを確認してください。";
            };

            // ヒントボタンのテキストを更新
            if (quizHintCount < maxHints) {
                quizNextButton.textContent = `ヒントを表示 (${quizHintCount + 1}/${maxHints})`;
            } else {
                quizNextButton.textContent = '次の問題へ';
            }
        }


        /**
         * クイズのUIをリセットします。
         */
        function resetQuizUI() {
            quizDisplayArea.style.display = 'none';
            quizAnswerInput.value = '';
            quizResultArea.textContent = '';
            quizResultArea.className = 'quiz-result-area';
            quizAnswerDisplay.textContent = '';
            quizHintArea.textContent = '';
            quizNextButton.style.display = 'none';
            quizSubmitButton.style.display = 'none';
            quizAnswerInput.style.display = 'none';
            quizDisplayImage.src = "";
            quizDisplayImage.style.display = 'none';
            currentQuizCard = null;
            currentQuizType = null;
            quizHintCount = 0;
        }

        /**
         * 解答をチェックします。
         */
        function checkAnswer() {
            if (!currentQuizCard || !quizAnswerInput) return;

            const userAnswer = quizAnswerInput.value.trim();
            const correctAnswer = currentQuizCard.name.trim();

            if (normalizeText(userAnswer) === normalizeText(correctAnswer)) {
                quizResultArea.textContent = '正解！';
                quizResultArea.classList.add('correct');
                quizResultArea.classList.remove('incorrect');
                quizNextButton.textContent = '次の問題へ';
                quizAnswerDisplay.textContent = `正解は「${escapeBackticks(correctAnswer)}」でした！`; // 正解時も表示
                quizNextButton.style.display = 'inline-block';
                quizSubmitButton.style.display = 'none'; // 解答ボタンを非表示
                quizAnswerInput.style.display = 'none'; // 入力欄を非表示
            } else {
                quizResultArea.textContent = '不正解…';
                quizResultArea.classList.add('incorrect');
                quizResultArea.classList.remove('correct');
                quizAnswerDisplay.textContent = `正解は「${escapeBackticks(correctAnswer)}」でした。`;
                quizNextButton.textContent = '次の問題へ';
                quizNextButton.style.display = 'inline-block';
                quizSubmitButton.style.display = 'none'; // 解答ボタンを非表示
                quizAnswerInput.style.display = 'none'; // 入力欄を非表示
            }
        }

        // イベントリスナー設定
        if (minigameButtons.cardName) {
            minigameButtons.cardName.removeEventListener('click', () => startNewQuiz('cardName'));
            minigameButtons.cardName.addEventListener('click', () => startNewQuiz('cardName'));
        }
        if (minigameButtons.illustrationEnlarge) {
            minigameButtons.illustrationEnlarge.removeEventListener('click', () => startNewQuiz('illustrationEnlarge'));
            minigameButtons.illustrationEnlarge.addEventListener('click', () => startNewQuiz('illustrationEnlarge'));
        }
        if (minigameButtons.illustrationSilhouette) {
            minigameButtons.illustrationSilhouette.removeEventListener('click', () => startNewQuiz('illustrationSilhouette'));
            minigameButtons.illustrationSilhouette.addEventListener('click', () => startNewQuiz('illustrationSilhouette'));
        }
        if (minigameButtons.illustrationMosaic) {
            minigameButtons.illustrationMosaic.removeEventListener('click', () => startNewQuiz('illustrationMosaic'));
            minigameButtons.illustrationMosaic.addEventListener('click', () => startNewQuiz('illustrationMosaic'));
        }

        if (quizSubmitButton) {
            quizSubmitButton.removeEventListener('click', checkAnswer);
            quizSubmitButton.addEventListener('click', checkAnswer);
        }
        if (quizAnswerInput) {
            quizAnswerInput.removeEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
            quizAnswerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
        }
        if (quizNextButton) {
            quizNextButton.removeEventListener('click', () => {
                if (quizHintCount < maxHints && currentQuizType === 'cardName') {
                    quizHintCount++;
                    generateQuizContent(); // カード名当てクイズはヒント
                } else if (quizHintCount < maxHints && currentQuizType && currentQuizType.startsWith('illustration')) {
                    quizHintCount++;
                    generateQuizContent(); // イラストクイズもヒント
                } else {
                    startNewQuiz(currentQuizType); // 次の問題
                }
            });
            quizNextButton.addEventListener('click', () => {
                if (quizHintCount < maxHints && currentQuizType === 'cardName') {
                    quizHintCount++;
                    generateQuizContent(); // カード名当てクイズはヒント
                } else if (quizHintCount < maxHints && currentQuizType && currentQuizType.startsWith('illustration')) {
                    quizHintCount++;
                    generateQuizContent(); // イラストクイズもヒント
                } else {
                    startNewQuiz(currentQuizType); // 次の問題
                }
            });
        }
        if (quizResetButton) {
            quizResetButton.removeEventListener('click', resetQuizUI);
            quizResetButton.addEventListener('click', resetQuizUI);
        }
    }; // End of initMinigamesSection

    // === battleRecord.js の内容 ===
    window.initBattleRecordSection = async function() {
        console.log("BattleRecord section initialized.");

        // === 戦いの記録セクションのロジック ===
        // 各要素を関数内で取得
        const myDeckSelect = document.getElementById('my-deck-select');
        const opponentDeckSelect = document.getElementById('opponent-deck-select');
        const winLossSelect = document.getElementById('win-loss-select');
        const firstSecondSelect = document.getElementById('first-second-select');
        const notesTextarea = document.getElementById('notes-textarea');
        const saveBattleRecordButton = document.getElementById('save-battle-record-button');

        const selectedDeckForStats = document.getElementById('selected-deck-for-stats');
        const selectedDeckStatsDetail = document.getElementById('selected-deck-stats-detail');

        const newDeckNameInput = document.getElementById('new-deck-name');
        const newDeckTypeSelect = document.getElementById('new-deck-type');
        const registerDeckButton = document.getElementById('register-deck-button');

        let battleRecordTabButtons = document.querySelectorAll('.battle-record-tab-button');
        let battleRecordTabContents = document.querySelectorAll('.battle-record-tab-content');

        // 戦績をロードして集計を更新する関数
        const loadBattleRecords = async () => {
            const result = await storage.get(['battleRecords']);
            const records = result.battleRecords || [];
            const battleRecordsList = document.getElementById('battle-records-list');
            const totalGamesSpan = document.getElementById('total-games');
            const totalWinsSpan = document.getElementById('total-wins');
            const totalLossesSpan = document.getElementById('total-losses');
            const winRateSpan = document.getElementById('win-rate');
            const firstWinRateSpan = document.getElementById('first-win-rate');
            const secondWinRateSpan = document.getElementById('second-win-rate');
            const myDeckTypeWinRatesDiv = document.getElementById('my-deck-type-win-rates');
            const opponentDeckTypeWinRatesDiv = document.getElementById('opponent-deck-type-win-rates');

            if (!battleRecordsList) return;

            battleRecordsList.innerHTML = '';

            let totalGames = records.length;
            let totalWins = 0;
            let totalLosses = 0;
            let firstGames = 0;
            let firstWins = 0;
            let secondGames = 0;
            let secondWins = 0;
            const myDeckTypeStats = {};
            const opponentDeckTypeStats = {};

            records.forEach(record => {
                if (record.result === 'win') {
                    totalWins++;
                } else {
                    totalLosses++;
                }

                if (record.firstSecond === 'first') {
                    firstGames++;
                    if (record.result === 'win') {
                        firstWins++;
                    }
                } else if (record.firstSecond === 'second') {
                    secondGames++;
                    if (record.result === 'win') {
                        secondWins++;
                    }
                }

                if (record.myDeckType) {
                    if (!myDeckTypeStats[record.myDeckType]) {
                        myDeckTypeStats[record.myDeckType] = { total: 0, wins: 0 };
                    }
                    myDeckTypeStats[record.myDeckType].total++;
                    if (record.result === 'win') {
                        myDeckTypeStats[record.myDeckType].wins++;
                    }
                }

                if (record.opponentDeckType) {
                    if (!opponentDeckTypeStats[record.opponentDeckType]) {
                        opponentDeckTypeStats[record.opponentDeckType] = { total: 0, wins: 0 };
                    }
                    opponentDeckTypeStats[record.opponentDeckType].total++;
                    // 相手のデッキタイプに対する勝率は、自分がそのデッキタイプに勝った数
                    if (record.result === 'win') {
                        opponentDeckTypeStats[record.opponentDeckType].wins++;
                    }
                }
            });

            if (totalGamesSpan) totalGamesSpan.textContent = totalGames;
            if (totalWinsSpan) totalWinsSpan.textContent = totalWins;
            if (totalLossesSpan) totalLossesSpan.textContent = totalLosses;
            if (winRateSpan) winRateSpan.textContent = totalGames > 0 ? `${(totalWins / totalGames * 100).toFixed(2)}%` : '0.00%';
            if (firstWinRateSpan) firstWinRateSpan.textContent = firstGames > 0 ? `${(firstWins / firstGames * 100).toFixed(2)}%` : '0.00%';
            if (secondWinRateSpan) secondWinRateSpan.textContent = secondGames > 0 ? `${(secondWins / secondGames * 100).toFixed(2)}%` : '0.00%';

            let myDeckTypeHtml = '<ul>';
            const sortedMyDeckTypes = Object.keys(myDeckTypeStats).sort();
            if (sortedMyDeckTypes.length === 0) {
                myDeckTypeHtml += '<li>データがありません。</li>';
            } else {
                sortedMyDeckTypes.forEach(type => {
                    const stats = myDeckTypeStats[type];
                    const rate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(2) : '0.00';
                    myDeckTypeHtml += `<li>${escapeBackticks(type)}: ${rate}% (${stats.wins} / ${stats.total})</li>`;
                });
                myDeckTypeHtml += `</ul>`;
            }
            if (myDeckTypeWinRatesDiv) myDeckTypeWinRatesDiv.innerHTML = myDeckTypeHtml;

            let opponentDeckTypeHtml = '<ul>';
            const sortedOpponentDeckTypes = Object.keys(opponentDeckTypeStats).sort();
            if (sortedOpponentDeckTypes.length === 0) {
                opponentDeckTypeHtml += '<li>データがありません。</li>';
            } else {
                sortedOpponentDeckTypes.forEach(type => {
                    const stats = opponentDeckTypeStats[type];
                    const rate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(2) : '0.00';
                    opponentDeckTypeHtml += `<li>vs ${escapeBackticks(type)}: ${rate}% (${stats.wins}勝 / ${stats.total}戦)</li>`;
                });
                opponentDeckTypeHtml += `</ul>`;
            }
            if (opponentDeckTypeWinRatesDiv) opponentDeckTypeWinRatesDiv.innerHTML = opponentDeckTypeHtml;


            if (records.length === 0) {
                battleRecordsList.innerHTML = '<li>まだ対戦記録がありません。</li>';
            } else {
                battleRecordsList.innerHTML = '';
                // 最新が上に来るように逆順に表示するが、data-indexは元の配列のインデックスを保持
                [...records].reverse().forEach((record, reverseIndex) => {
                    // 元の配列におけるインデックスを計算
                    const originalIndex = records.length - 1 - reverseIndex;
                    const listItem = document.createElement('li');
                    listItem.className = 'battle-record-item';
                    listItem.innerHTML = `
                                <strong>${escapeBackticks(record.timestamp)}</strong><br>
                                自分のデッキ: ${escapeBackticks(record.myDeck)} (${escapeBackticks(record.myDeckType || '不明')})<br>
                                相手のデッキ: ${escapeBackticks(record.opponentDeck)} (${escapeBackticks(record.opponentDeckType || '不明')})<br>
                                結果: ${record.result === 'win' ? '勝利' : '敗北'} (${record.firstSecond === 'first' ? '先攻' : record.firstSecond === 'second' ? '後攻' : '不明'})<br>
                                ${record.notes ? `メモ: ${escapeBackticks(record.notes)}<br>` : ''}
                                <button class="delete-button" data-index="${originalIndex}" title="削除"><i class="fas fa-trash-alt"></i></button>
                            `;
                    battleRecordsList.appendChild(listItem);
                });

                battleRecordsList.querySelectorAll('.delete-button').forEach(button => {
                    button.removeEventListener('click', handleDeleteBattleRecordClick); // 既存のリスナーを削除
                    button.addEventListener('click', handleDeleteBattleRecordClick);
                });
            }
            updateSelectedDeckStatsDropdown();
        };

        // 戦績を削除する関数
        const deleteBattleRecord = async (index) => {
            const result = await storage.get(['battleRecords']);
            let records = result.battleRecords || [];
            if (index > -1 && index < records.length) {
                records.splice(index, 1);
                await storage.set({ battleRecords: records });
                await window.showCustomDialog('削除完了', '対戦記録を削除しました。');
                loadBattleRecords();
            }
        };

        // 登録済みデッキをロードして表示する関数
        const loadRegisteredDecks = async () => {
            const result = await storage.get(['registeredDecks']);
            const decks = result.registeredDecks || [];
            const registeredDecksList = document.getElementById('registered-decks-list');
            const myDeckSelect = document.getElementById('my-deck-select');
            const opponentDeckSelect = document.getElementById('opponent-deck-select');

            if (!registeredDecksList || !myDeckSelect || !opponentDeckSelect) return;

            registeredDecksList.innerHTML = '';

            myDeckSelect.innerHTML = '<option value="">登録済みデッキから選択</option>';
            opponentDeckSelect.innerHTML = '<option value="">登録済みデッキから選択</option>';

            if (decks.length === 0) {
                registeredDecksList.innerHTML = '<li>まだ登録されたデッキがありません。</li>';
            } else {
                decks.sort((a, b) => a.name.localeCompare(b.name)).forEach((deck, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        ${escapeBackticks(deck.name)} (${escapeBackticks(deck.type)})
                        <button class="delete-registered-deck-button" data-index="${index}" title="削除"><i class="fas fa-trash-alt"></i></button>
                    `;
                    registeredDecksList.appendChild(listItem);

                    const optionMy = document.createElement('option');
                    optionMy.value = deck.name;
                    optionMy.textContent = `${escapeBackticks(deck.name)} (${escapeBackticks(deck.type)})`;
                    myDeckSelect.appendChild(optionMy);

                    const optionOpponent = document.createElement('option');
                    optionOpponent.value = deck.name;
                    optionOpponent.textContent = `${escapeBackticks(deck.name)} (${escapeBackticks(deck.type)})`;
                    opponentDeckSelect.appendChild(optionOpponent);
                });

                registeredDecksList.querySelectorAll('.delete-registered-deck-button').forEach(button => {
                    button.removeEventListener('click', handleDeleteRegisteredDeckClick);
                    button.addEventListener('click', handleDeleteRegisteredDeckClick);
                });
            }
            updateSelectedDeckStatsDropdown();
        };

        // 登録済みデッキを削除する関数
        const deleteRegisteredDeck = async (index) => {
            const result = await storage.get(['registeredDecks']);
            let decks = result.registeredDecks || [];
            if (index > -1 && index < decks.length) {
                decks.splice(index, 1);
                await storage.set({ registeredDecks: decks });
                await window.showCustomDialog('削除完了', 'デッキを削除しました。');
                loadRegisteredDecks();
                loadBattleRecords();
            }
        };

        // デッキ別詳細分析のドロップダウンを更新
        const updateSelectedDeckStatsDropdown = async () => {
            const selectedDeckForStats = document.getElementById('selected-deck-for-stats');
            if (!selectedDeckForStats) return;

            const result = await storage.get(['registeredDecks']);
            const decks = result.registeredDecks || [];
            selectedDeckForStats.innerHTML = '<option value="">全てのデッキ</option>';
            decks.sort((a, b) => a.name.localeCompare(b.name)).forEach(deck => {
                const option = document.createElement('option');
                option.value = deck.name;
                option.textContent = `${escapeBackticks(deck.name)} (${escapeBackticks(deck.type)})`;
                selectedDeckForStats.appendChild(option);
            });
            displaySelectedDeckStats(selectedDeckForStats.value);
        };

        // 選択されたデッキの詳細な勝率を表示
        const displaySelectedDeckStats = async (deckName) => {
            const result = await storage.get(['battleRecords']);
            const records = result.battleRecords || [];
            const selectedDeckStatsDetail = document.getElementById('selected-deck-stats-detail');
            if (!selectedDeckStatsDetail) return;

            let html = '';

            if (!deckName) {
                selectedDeckStatsDetail.innerHTML = '<p>デッキを選択して詳細な勝率を表示します。</p>';
                return;
            }

            const gamesAsMyDeck = records.filter(record => record.myDeck === deckName);
            const gamesAsOpponentDeck = records.filter(record => record.opponentDeck === deckName);

            let myDeckTotal = gamesAsMyDeck.length;
            let myDeckWins = gamesAsMyDeck.filter(record => record.result === 'win').length;
            let myDeckWinRate = myDeckTotal > 0 ? ((myDeckWins / myDeckTotal) * 100).toFixed(2) : '0.00';

            html += `<h4>「${escapeBackticks(deckName)}」の統計 (自分のデッキとして使用時)</h4>`;
            html += `<p>総対戦数: ${myDeckTotal}</p>`;
            html += `<p>勝利数: ${myDeckWins}</p>`;
            html += `<p>勝率: ${myDeckWinRate}%</p>`;

            if (myDeckTotal > 0) {
                html += `<h5>相手デッキタイプ別勝率</h5><ul>`;
                const opponentTypes = {};
                gamesAsMyDeck.forEach(record => {
                    if (!opponentTypes[record.opponentDeckType]) {
                        opponentTypes[record.opponentDeckType] = { total: 0, wins: 0 };
                    }
                    opponentTypes[record.opponentDeckType].total++;
                    if (record.result === 'win') {
                        opponentTypes[record.opponentDeckType].wins++;
                    }
                });
                for (const type in opponentTypes) {
                    const stats = opponentTypes[type];
                    const rate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(2) : '0.00';
                    html += `<li>vs ${escapeBackticks(type)}: ${rate}% (${stats.wins}勝 / ${stats.total}戦)</li>`;
                }
                html += `</ul>`;
            }

            let opponentDeckTotal = gamesAsOpponentDeck.length;
            let opponentDeckWins = gamesAsOpponentDeck.filter(record => record.result === 'win').length; // 相手が勝った数 (自分が負けた数)
            let opponentDeckLosses = gamesAsOpponentDeck.filter(record => record.result === 'lose').length; // 相手が負けた数 (自分が勝った数)
            let opponentDeckWinRate = opponentDeckTotal > 0 ? ((opponentDeckWins / opponentDeckTotal) * 100).toFixed(2) : '0.00';

            html += `<h4>「${escapeBackticks(deckName)}」の統計 (相手のデッキとして使用時)</h4>`;
            html += `<p>総対戦数: ${opponentDeckTotal}</p>`;
            html += `<p>相手勝利数: ${opponentDeckWins} (自分が負けた数)</p>`;
            html += `<p>相手勝率: ${opponentDeckWinRate}%</p>`;
            selectedDeckStatsDetail.innerHTML = html;
        };

        // タブ切り替え関数
        function showBattleRecordTab(tabId) {
            // 関数内で要素を再取得
            battleRecordTabButtons = document.querySelectorAll('.battle-record-tab-button');
            battleRecordTabContents = document.querySelectorAll('.battle-record-tab-content');

            if (!battleRecordTabButtons.length || !battleRecordTabContents.length) return;

            battleRecordTabButtons.forEach(button => {
                if (button.dataset.tab === tabId) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            battleRecordTabContents.forEach(content => {
                if (content.id === `battle-record-tab-${tabId}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            // 各タブに切り替わった際にデータを再ロード
            if (tabId === 'stats-summary') {
                loadBattleRecords(); // 勝率集計を再ロード
                updateSelectedDeckStatsDropdown(); // デッキ選択ドロップダウンも更新
            } else if (tabId === 'deck-management') {
                loadRegisteredDecks(); // デッキリストを再ロード
            } else if (tabId === 'past-records') {
                loadBattleRecords(); // 過去の記録リストも更新
            }
        }


        // イベントハンドラ関数
        async function handleSaveBattleRecordClick() {
            if (!myDeckSelect || !opponentDeckSelect || !winLossSelect || !firstSecondSelect || !notesTextarea) return;
            const myDeck = myDeckSelect.value;
            const opponentDeck = opponentDeckSelect.value;
            const myDeckType = myDeckSelect.value ? myDeckSelect.options[myDeckSelect.selectedIndex].textContent.match(/\((.*?)\)/)?.[1] || '' : '';
            const opponentDeckType = opponentDeckSelect.value ? opponentDeckSelect.options[opponentDeckSelect.selectedIndex].textContent.match(/\((.*?)\)/)?.[1] || '' : '';

            const result = winLossSelect.value;
            const firstSecond = firstSecondSelect.value;
            const notes = notesTextarea.value.trim();

            if (!myDeck || !opponentDeck || !result || !firstSecond) {
                await window.showCustomDialog('エラー', '自分のデッキ名、相手のデッキ名、勝敗、先攻/後攻は必須です。');
                return;
            }

            const newRecord = {
                timestamp: new Date().toLocaleString(),
                myDeck: myDeck,
                myDeckType: myDeckType,
                opponentDeck: opponentDeck,
                opponentDeckType: opponentDeckType,
                result: result,
                firstSecond: firstSecond,
                notes: notes
            };

            const res = await storage.get(['battleRecords']);
            const records = res.battleRecords || [];
            records.push(newRecord);
            await storage.set({ battleRecords: records });
            await window.showCustomDialog('保存完了', '対戦記録を保存しました！');
            if (myDeckSelect) myDeckSelect.value = '';
            if (opponentDeckSelect) opponentDeckSelect.value = '';
            if (winLossSelect) winLossSelect.value = 'win';
            if (firstSecondSelect) firstSecondSelect.value = '';
            if (notesTextarea) notesTextarea.value = '';
            loadBattleRecords();
        }

        async function handleRegisterDeckClick() {
            if (!newDeckNameInput || !newDeckTypeSelect) return;
            const deckName = newDeckNameInput.value.trim();
            const deckType = newDeckTypeSelect.value;

            if (!deckName || !deckType) {
                await window.showCustomDialog('エラー', 'デッキ名とデッキタイプは必須です。');
                return;
            }

            const result = await storage.get(['registeredDecks']);
            const decks = result.registeredDecks || [];
            if (decks.some(deck => deck.name === deckName)) {
                await window.showCustomDialog('エラー', '同じ名前のデッキが既に登録されています。');
                return;
            }

            decks.push({ name: deckName, type: deckType });
            await storage.set({ registeredDecks: decks });
            await window.showCustomDialog('登録完了', `デッキ「${escapeBackticks(deckName)}」を登録しました！`);
            if (newDeckNameInput) newDeckNameInput.value = '';
            if (newDeckTypeSelect) newDeckTypeSelect.value = '';
            loadRegisteredDecks();
        }

        async function handleDeleteBattleRecordClick(event) {
            const indexToDelete = parseInt(event.currentTarget.dataset.index);
            const confirmed = await window.showCustomDialog('記録削除', 'この対戦記録を削除しますか？', true);
            if (confirmed) {
                deleteBattleRecord(indexToDelete);
            }
        }

        async function handleDeleteRegisteredDeckClick(event) {
            const indexToDelete = parseInt(event.currentTarget.dataset.index);
            const confirmed = await window.showCustomDialog('デッキ削除', 'このデッキを登録リストから削除しますか？', true);
            if (confirmed) {
                deleteRegisteredDeck(indexToDelete);
            }
        }

        function handleMyDeckSelectChange(event) { /* ... */ }
        function handleOpponentDeckSelectChange(event) { /* ... */ }
        function handleSelectedDeckForStatsChange(event) {
            displaySelectedDeckStats(event.target.value);
        }

        // イベントリスナーを再アタッチ
        if (saveBattleRecordButton) {
            saveBattleRecordButton.removeEventListener('click', handleSaveBattleRecordClick);
            saveBattleRecordButton.addEventListener('click', handleSaveBattleRecordClick);
        }
        if (registerDeckButton) {
            registerDeckButton.removeEventListener('click', handleRegisterDeckClick);
            registerDeckButton.addEventListener('click', handleRegisterDeckClick);
        }
        if (myDeckSelect) {
            myDeckSelect.removeEventListener('change', handleMyDeckSelectChange);
            myDeckSelect.addEventListener('change', handleMyDeckSelectChange);
        }
        if (opponentDeckSelect) {
            opponentDeckSelect.removeEventListener('change', handleOpponentDeckSelectChange);
            opponentDeckSelect.addEventListener('change', handleOpponentDeckSelectChange);
        }
        if (selectedDeckForStats) {
            selectedDeckForStats.removeEventListener('change', handleSelectedDeckForStatsChange);
            selectedDeckForStats.addEventListener('change', handleSelectedDeckForStatsChange);
        }

        // タブボタンのイベントリスナーをここで設定
        battleRecordTabButtons.forEach(button => {
            button.removeEventListener('click', handleBattleRecordTabClick);
            button.addEventListener('click', handleBattleRecordTabClick);
        });

        function handleBattleRecordTabClick(event) {
            showBattleRecordTab(event.currentTarget.dataset.tab);
        }

        // 初回ロード時に各データをロード
        loadRegisteredDecks();
        loadBattleRecords();

        // デフォルトで「新しい対戦記録」タブを表示
        showBattleRecordTab('new-record');
    };

})();
