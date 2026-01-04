// ==UserScript==
// @name         GitHub Repo Tree Generator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Generate, filter, and share a clean directory tree for any GitHub repo
// @author       Azad-sl
// @homepage     https://github.com/Azad-sl/GitTree
// @license      MIT
// @match        https://github.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/544254/GitHub%20Repo%20Tree%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/544254/GitHub%20Repo%20Tree%20Generator.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        /* 弹窗样式 */
        .gittree-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .gittree-modal-content {
            background-color: white;
            border-radius: 18px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 2rem;
            position: relative;
        }
        .gittree-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6e6e73;
        }
        .gittree-close-btn:hover {
            color: #1d1d1f;
        }
        /* GitHub页面上的按钮样式 */
        .gittree-btn {
            background-color: #238636;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 5px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            margin-left: 8px;
        }
        .gittree-btn:hover {
            background-color: #2ea043;
        }
        /* GitTree应用样式 */
        .gittree-container {
            box-sizing: border-box;
            position: relative;
            width: 100%;
            max-width: 800px;
            background-color: #fff;
            border: 1px solid #d2d2d7;
            border-radius: 18px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
            padding: 2rem 2.5rem 2.5rem;
        }
        .gittree-container h1 {
            text-align: center;
            font-size: 2rem;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 0.5rem;
        }
        .gittree-container .subtitle {
            text-align: center;
            font-size: 1rem;
            color: #6e6e73;
            margin-bottom: 2rem;
        }
        .gittree-container pre#gittree-result {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 0.9rem;
            color: #1d1d1f;
            white-space: pre;
            padding: 1.5rem;
            margin: 0;
            max-height: 50vh;
            overflow: auto;
            line-height: 1.6;
            background-color: #fff;
        }
        .gittree-container pre#gittree-result.error {
            color: #d73a49;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            white-space: normal;
        }
        .gittree-container .input-wrapper {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .gittree-container input[type=text],
        .gittree-container input[type=number] {
            padding: 0.8rem 1rem;
            font-size: 1rem;
            border: 1px solid #d2d2d7;
            border-radius: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            background-color: #fff;
            color: #1d1d1f;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gittree-container input[type=text] {
            flex-grow: 1;
        }
        .gittree-container input[type=text]:focus,
        .gittree-container input[type=number]:focus {
            border-color: #007aff;
            box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.2);
            outline: 0;
        }
        .gittree-container button#gittree-generateBtn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            color: #fff;
            background-color: #007aff;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.1s;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }
        .gittree-container button#gittree-generateBtn:hover {
            background-color: #0071e3;
        }
        .gittree-container button#gittree-generateBtn:active {
            transform: scale(0.98);
        }
        .gittree-container button#gittree-generateBtn:disabled {
            background-color: #a0a0a0;
            cursor: not-allowed;
            opacity: 0.8;
        }
        .gittree-container .spinner {
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            border-top-color: #fff;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .gittree-container .options-row {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            align-items: center;
        }
        .gittree-container .lang-toggle {
            display: flex;
            align-items: center;
            background-color: #f6f8fa;
            border-radius: 20px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
        }
        .gittree-container .lang-option {
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 0.85rem;
            font-weight: 500;
            color: #6e6e73;
            transition: all 0.2s;
        }
        .gittree-container .lang-option.active {
            background-color: #fff;
            color: #1d1d1f;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .gittree-container .advanced-options {
            margin-left: auto;
        }
        .gittree-container .advanced-options summary {
            cursor: pointer;
            color: #6e6e73;
            font-size: 0.9rem;
            font-weight: 500;
            list-style-position: expert;
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
        }
        .gittree-container .advanced-options summary:hover {
            background-color: #f0f0f0;
        }
        .gittree-container .advanced-options-grid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
            margin-top: 0.75rem;
            align-items: center;
        }
        .gittree-container .advanced-options label {
            color: #6e6e73;
            font-size: 0.9rem;
        }
        .gittree-container input#gittree-depthInput {
            width: 70px;
            text-align: center;
        }
        .gittree-container input#gittree-excludeInput {
            width: 100%;
            box-sizing: border-box;
        }
        .gittree-container .result-wrapper {
            margin-top: 2rem;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            overflow: hidden;
        }
        .gittree-container .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            background-color: #f0f0f0;
            border-bottom: 1px solid #d2d2d7;
        }
        .gittree-container .header-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .gittree-container .header-group button {
            background: none;
            border: none;
            padding: 0.3rem 0.5rem;
            cursor: pointer;
            color: #6e6e73;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            border-radius: 6px;
            transition: background-color 0.2s, color 0.2s;
        }
        .gittree-container .header-group button:hover {
            background-color: #e0e0e0;
            color: #1d1d1f;
        }
        .gittree-container .header-group button svg {
            width: 18px;
            height: 18px;
            stroke-width: 1.8;
        }
        .gittree-container .view-modes button.active {
            color: #007aff;
            background-color: rgba(0, 122, 255, 0.15);
        }
        .gittree-container .header-group button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .gittree-container #gittree-copyBtn .copy-icon {
            width: 1em;
            height: 1em;
            stroke-width: 2;
            vertical-align: middle;
        }
        #gittree-image-card-container {
            position: absolute;
            left: -9999px;
            top: -9999px;
            padding: 4rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        #gittree-image-card-container .macos-window {
            width: 800px;
            background-color: #2e2e2e;
            border-radius: 10px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            padding-bottom: 20px;
            border: 1px solid #444;
        }
        #gittree-image-card-container .title-bar {
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0 15px;
            border-bottom: 1px solid #404040;
        }
        #gittree-image-card-container .traffic-lights {
            position: absolute;
            left: 15px;
            display: flex;
            gap: 8px;
        }
        #gittree-image-card-container .light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        #gittree-image-card-container .light.red {
            background-color: #ff5f56;
        }
        #gittree-image-card-container .light.yellow {
            background-color: #ffbd2e;
        }
        #gittree-image-card-container .light.green {
            background-color: #27c93f;
        }
        #gittree-image-card-container .title-text {
            color: #b0b0b0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
        }
        #gittree-image-card-container .card-content {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 14px;
            color: #e0e0e0;
            white-space: pre;
            padding: 20px;
            max-height: 80vh;
            overflow: auto;
            line-height: 1.6;
        }
        /* 样式选择器 */
        .gittree-style-selector {
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        .gittree-style-selector label {
            display: block;
            margin-bottom: 0.5rem;
            color: #6e6e73;
            font-size: 0.9rem;
        }
        .gittree-style-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        .gittree-style-option {
            border: 2px solid #d2d2d7;
            border-radius: 10px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            background-color: #fff;
            display: flex;
            flex-direction: column;
        }
        .gittree-style-option:hover {
            border-color: #007aff;
            box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
        }
        .gittree-style-option.selected {
            border-color: #007aff;
            background-color: rgba(0, 122, 255, 0.05);
        }
        .gittree-style-option h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            color: #1d1d1f;
        }
        .gittree-style-option p {
            margin: 0;
            font-size: 0.85rem;
            color: #6e6e73;
            flex-grow: 1;
        }
        .gittree-style-option .preview {
            height: 100px;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: #586069;
        }
        /* GitHub项目分享卡片样式 - macOS风格 */
        #gittree-repo-card-container {
            position: absolute;
            left: -9999px;
            top: -9999px;
            width: 800px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        #gittree-repo-card-container.macos-style {
            background-color: #1e1e1e;
            border-radius: 16px;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
        }
        #gittree-repo-card-container.macos-style .card-header {
            background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
            padding: 28px;
            color: white;
            position: relative;
            border-bottom: 1px solid #333;
        }
        #gittree-repo-card-container.macos-style .card-header::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 15px;
            display: flex;
            gap: 8px;
        }
        #gittree-repo-card-container.macos-style .card-header::before .light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
        }
        #gittree-repo-card-container.macos-style .card-header::before .light.red {
            background-color: #ff5f56;
        }
        #gittree-repo-card-container.macos-style .card-header::before .light.yellow {
            background-color: #ffbd2e;
        }
        #gittree-repo-card-container.macos-style .card-header::before .light.green {
            background-color: #27c93f;
        }
        #gittree-repo-card-container.macos-style .repo-title {
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        #gittree-repo-card-container.macos-style .repo-title .github-icon {
            width: 30px;
            height: 30px;
            margin-right: 12px;
            fill: white;
        }
        #gittree-repo-card-container.macos-style .repo-description {
            font-size: 16px;
            font-weight: 400;
            margin: 0;
            opacity: 0.9;
            line-height: 1.5;
            text-align: center;
            color: #e0e0e0;
        }
        #gittree-repo-card-container.macos-style .card-body {
            display: flex;
            padding: 28px;
            background-color: #1e1e1e;
            color: #e0e0e0;
        }
        #gittree-repo-card-container.macos-style .repo-info {
            flex: 1;
        }
        #gittree-repo-card-container.macos-style .repo-stats {
            display: flex;
            margin-bottom: 24px;
            gap: 24px;
        }
        #gittree-repo-card-container.macos-style .stat-item {
            display: flex;
            align-items: center;
            font-size: 18px;
            color: #e0e0e0;
        }
        #gittree-repo-card-container.macos-style .stat-item svg {
            width: 22px;
            height: 22px;
            margin-right: 8px;
            fill: #b0b0b0;
        }
        #gittree-repo-card-container.macos-style .repo-languages {
            margin-bottom: 24px;
        }
        #gittree-repo-card-container.macos-style .repo-languages h3 {
            font-size: 18px;
            margin: 0 0 12px 0;
            color: #e0e0e0;
        }
        #gittree-repo-card-container.macos-style .language-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        #gittree-repo-card-container.macos-style .language-item {
            display: flex;
            align-items: center;
            background-color: #2a2a2a;
            border-radius: 20px;
            padding: 6px 14px;
            font-size: 14px;
            color: #e0e0e0;
            border: 1px solid #333;
        }
        #gittree-repo-card-container.macos-style .language-color {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin-right: 8px;
        }
        #gittree-repo-card-container.macos-style .qr-code {
            width: 160px;
            height: 160px;
            background-color: white;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        #gittree-repo-card-container.macos-style .qr-code canvas {
            max-width: 100%;
            max-height: 100%;
        }
        #gittree-repo-card-container.macos-style .card-footer {
            background-color: #2a2a2a;
            padding: 16px 28px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #gittree-repo-card-container.macos-style .generated-at {
            font-size: 12px;
            color: #b0b0b0;
        }
        #gittree-repo-card-container.macos-style .watermark {
            font-size: 12px;
            color: #b0b0b0;
            display: flex;
            align-items: center;
        }
        #gittree-repo-card-container.macos-style .watermark svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            fill: #b0b0b0;
        }
        /* GitHub项目分享卡片样式 - 现代简约风格 */
        #gittree-repo-card-container.modern-style {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: none;
        }
        #gittree-repo-card-container.modern-style .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        #gittree-repo-card-container.modern-style .card-header::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            transform: rotate(30deg);
        }
        #gittree-repo-card-container.modern-style .repo-title {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 14px 0;
            letter-spacing: -0.5px;
            position: relative;
            z-index: 1;
        }
        #gittree-repo-card-container.modern-style .repo-title .github-icon {
            display: none;
        }
        #gittree-repo-card-container.modern-style .repo-description {
            font-size: 18px;
            font-weight: 400;
            margin: 0;
            opacity: 0.95;
            line-height: 1.5;
            max-width: 80%;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        #gittree-repo-card-container.modern-style .card-body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px;
        }
        #gittree-repo-card-container.modern-style .repo-info {
            width: 100%;
            margin-bottom: 24px;
        }
        #gittree-repo-card-container.modern-style .repo-stats {
            display: flex;
            justify-content: center;
            margin-bottom: 28px;
            gap: 40px;
        }
        #gittree-repo-card-container.modern-style .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            color: #24292e;
        }
        #gittree-repo-card-container.modern-style .stat-item svg {
            width: 28px;
            height: 28px;
            margin-bottom: 10px;
            fill: #667eea;
        }
        #gittree-repo-card-container.modern-style .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
        }
        #gittree-repo-card-container.modern-style .stat-label {
            font-size: 14px;
            color: #6e6e73;
            margin-top: 4px;
        }
        #gittree-repo-card-container.modern-style .repo-languages {
            width: 100%;
            margin-bottom: 28px;
        }
        #gittree-repo-card-container.modern-style .repo-languages h3 {
            font-size: 20px;
            margin: 0 0 16px 0;
            color: #24292e;
            text-align: center;
            font-weight: 600;
        }
        #gittree-repo-card-container.modern-style .language-list {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        #gittree-repo-card-container.modern-style .language-item {
            display: flex;
            align-items: center;
            background-color: white;
            border-radius: 24px;
            padding: 8px 16px;
            font-size: 14px;
            color: #24292e;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #gittree-repo-card-container.modern-style .language-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
        #gittree-repo-card-container.modern-style .language-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin-right: 8px;
        }
        #gittree-repo-card-container.modern-style .qr-code {
            width: 150px;
            height: 150px;
            background-color: white;
            border-radius: 16px;
            padding: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        #gittree-repo-card-container.modern-style .qr-code:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }
        #gittree-repo-card-container.modern-style .qr-code canvas {
            max-width: 100%;
            max-height: 100%;
        }
        #gittree-repo-card-container.modern-style .card-footer {
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            padding: 18px 32px;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #gittree-repo-card-container.modern-style .generated-at {
            font-size: 12px;
            color: #6e6e73;
        }
        #gittree-repo-card-container.modern-style .watermark {
            font-size: 12px;
            color: #6e6e73;
            display: flex;
            align-items: center;
            font-weight: 500;
        }
        #gittree-repo-card-container.modern-style .watermark svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            fill: #667eea;
        }
        /* GitHub项目分享卡片样式 - GitHub风格 */
        #gittree-repo-card-container.github-style {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e1e4e8;
        }
        #gittree-repo-card-container.github-style .card-header {
            background-color: #24292e;
            padding: 20px;
            color: white;
            border-bottom: 1px solid #e1e4e8;
        }
        #gittree-repo-card-container.github-style .repo-title {
            font-size: 22px;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
        }
        #gittree-repo-card-container.github-style .repo-title .github-icon {
            width: 26px;
            height: 26px;
            margin-right: 10px;
            fill: white;
        }
        #gittree-repo-card-container.github-style .repo-description {
            font-size: 15px;
            font-weight: 400;
            margin: 10px 0 0 0;
            opacity: 0.9;
            line-height: 1.5;
        }
        #gittree-repo-card-container.github-style .card-body {
            display: flex;
            padding: 20px;
        }
        #gittree-repo-card-container.github-style .repo-info {
            flex: 1;
        }
        #gittree-repo-card-container.github-style .repo-stats {
            display: flex;
            margin-bottom: 20px;
            gap: 20px;
        }
        #gittree-repo-card-container.github-style .stat-item {
            display: flex;
            align-items: center;
            font-size: 15px;
            color: #586069;
        }
        #gittree-repo-card-container.github-style .stat-item svg {
            width: 18px;
            height: 18px;
            margin-right: 6px;
            fill: #586069;
        }
        #gittree-repo-card-container.github-style .repo-languages {
            margin-bottom: 20px;
        }
        #gittree-repo-card-container.github-style .repo-languages h3 {
            font-size: 16px;
            margin: 0 0 10px 0;
            color: #24292e;
            font-weight: 600;
        }
        #gittree-repo-card-container.github-style .language-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        #gittree-repo-card-container.github-style .language-item {
            display: flex;
            align-items: center;
            background-color: #f1f8ff;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 13px;
            color: #0366d6;
            transition: background-color 0.2s;
        }
        #gittree-repo-card-container.github-style .language-item:hover {
            background-color: #e6f3ff;
        }
        #gittree-repo-card-container.github-style .language-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 6px;
        }
        #gittree-repo-card-container.github-style .qr-code {
            width: 130px;
            height: 130px;
            background-color: white;
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        #gittree-repo-card-container.github-style .qr-code canvas {
            max-width: 100%;
            max-height: 100%;
        }
        #gittree-repo-card-container.github-style .card-footer {
            background-color: #f6f8fa;
            padding: 14px 20px;
            border-top: 1px solid #e1e4e8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #gittree-repo-card-container.github-style .generated-at {
            font-size: 12px;
            color: #586069;
        }
        #gittree-repo-card-container.github-style .watermark {
            font-size: 12px;
            color: #586069;
            display: flex;
            align-items: center;
        }
        #gittree-repo-card-container.github-style .watermark svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            fill: #586069;
        }
        /* GitHub项目分享卡片样式 - Material Design风格 */
        #gittree-repo-card-container.material-style {
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: none;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        #gittree-repo-card-container.material-style .card-header {
            background-color: #4285f4;
            padding: 24px 24px 32px;
            color: white;
            position: relative;
        }
        #gittree-repo-card-container.material-style .card-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background: linear-gradient(to bottom, rgba(66, 133, 244, 0), rgba(66, 133, 244, 0.1));
        }
        #gittree-repo-card-container.material-style .repo-title {
            font-size: 28px;
            font-weight: 500;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
        }
        #gittree-repo-card-container.material-style .repo-title .github-icon {
            width: 32px;
            height: 32px;
            margin-right: 12px;
            fill: white;
        }
        #gittree-repo-card-container.material-style .repo-description {
            font-size: 16px;
            font-weight: 400;
            margin: 0;
            opacity: 0.9;
            line-height: 1.5;
        }
        #gittree-repo-card-container.material-style .card-body {
            display: flex;
            padding: 24px;
            background-color: #fff;
        }
        #gittree-repo-card-container.material-style .repo-info {
            flex: 1;
            padding-right: 24px;
        }
        #gittree-repo-card-container.material-style .repo-stats {
            display: flex;
            margin-bottom: 24px;
            gap: 24px;
        }
        #gittree-repo-card-container.material-style .stat-item {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #5f6368;
        }
        #gittree-repo-card-container.material-style .stat-item svg {
            width: 22px;
            height: 22px;
            margin-right: 8px;
            fill: #5f6368;
        }
        #gittree-repo-card-container.material-style .repo-languages {
            margin-bottom: 24px;
        }
        #gittree-repo-card-container.material-style .repo-languages h3 {
            font-size: 18px;
            margin: 0 0 12px 0;
            color: #202124;
            font-weight: 500;
        }
        #gittree-repo-card-container.material-style .language-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        #gittree-repo-card-container.material-style .language-item {
            display: flex;
            align-items: center;
            background-color: #f1f3f4;
            border-radius: 16px;
            padding: 6px 14px;
            font-size: 14px;
            color: #202124;
            transition: background-color 0.2s;
        }
        #gittree-repo-card-container.material-style .language-item:hover {
            background-color: #e8eaed;
        }
        #gittree-repo-card-container.material-style .language-color {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin-right: 8px;
        }
        #gittree-repo-card-container.material-style .qr-code {
            width: 140px;
            height: 140px;
            background-color: white;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #dadce0;
        }
        #gittree-repo-card-container.material-style .qr-code canvas {
            max-width: 100%;
            max-height: 100%;
        }
        #gittree-repo-card-container.material-style .card-footer {
            background-color: #f8f9fa;
            padding: 16px 24px;
            border-top: 1px solid #dadce0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #gittree-repo-card-container.material-style .generated-at {
            font-size: 12px;
            color: #5f6368;
        }
        #gittree-repo-card-container.material-style .watermark {
            font-size: 12px;
            color: #5f6368;
            display: flex;
            align-items: center;
        }
        #gittree-repo-card-container.material-style .watermark svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            fill: #5f6368;
        }
        @media (max-width: 768px) {
            .gittree-container {
                padding: 1.5rem;
                border: none;
                border-radius: 0;
                box-shadow: none;
                background-color: #f3f3f8;
            }
            .gittree-container h1 {
                font-size: 1.5rem;
            }
            .gittree-container .subtitle {
                font-size: 0.9rem;
                margin-bottom: 2rem;
            }
            .gittree-container .input-wrapper {
                flex-direction: column;
            }
            .gittree-container button#gittree-generateBtn {
                padding: 1rem;
            }
            .gittree-container .options-row {
                flex-direction: column;
                align-items: stretch;
            }
            .gittree-container .advanced-options {
                margin-left: 0;
                margin-top: 1rem;
            }
            .gittree-container .advanced-options-grid {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
            .gittree-container .advanced-options-grid label[for="gittree-depthInput"] {
                margin-top: 0.5rem;
            }
            .gittree-container .result-header {
                flex-direction: column;
                align-items: stretch;
                gap: 0.75rem;
            }
            .gittree-container .header-group {
                justify-content: space-around;
            }
            .gittree-container .export-tools button span {
                display: none;
            }
            .gittree-container .export-tools button {
                padding: 0.5rem;
            }
            .gittree-style-options {
                grid-template-columns: 1fr;
            }
        }
.gittree-container footer {
    text-align: center;
    margin-top: 3rem;
    padding-bottom: 1rem;
    color: #6e6e73;
    font-size: 0.875rem;
}
.gittree-container footer a {
    color: #1d1d1f;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
}
.gittree-container footer a:hover {
    color: #007aff;
    text-decoration: underline;
}
.gittree-container footer .github-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
.gittree-container footer p {
    margin: 0.5rem 0 0;
}
/* 使用说明样式 */
.gittree-instructions {
    margin-top: 1rem;
    border: 1px solid #d2d2d7;
    border-radius: 8px;
    padding: 0.5rem;
}
.gittree-instructions summary {
    cursor: pointer;
    font-weight: 500;
    color: #24292e;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
}
.gittree-instructions summary:hover {
    background-color: #f6f8fa;
}
.gittree-instructions-content {
    padding: 1rem;
    border-top: 1px solid #d2d2d7;
    margin-top: 0.5rem;
    text-align: left;
}
.gittree-instructions-content h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #24292e;
    font-size: 1rem;
}
.gittree-instructions-content ol, .gittree-instructions-content ul {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
}
.gittree-instructions-content li {
    margin-bottom: 0.3rem;
    line-height: 1.5;
}
.gittree-instructions-content .lang-section {
    margin-bottom: 1.5rem;
}
.gittree-instructions-content .lang-section:last-child {
    margin-bottom: 0;
}
.gittree-instructions-content .lang-divider {
    border-top: 1px dashed #d2d2d7;
    margin: 1rem 0;
    padding-top: 1rem;
}
    `);
    function addGitTreeButton() {
        const actionsContainer = document.querySelector('.pagehead-actions');
        if (!actionsContainer) return;
        const gitTreeBtn = document.createElement('button');
        gitTreeBtn.className = 'gittree-btn';
        gitTreeBtn.textContent = 'Generate Tree';
        gitTreeBtn.addEventListener('click', showGitTreeModal);
        actionsContainer.appendChild(gitTreeBtn);
    }
    function showGitTreeModal() {
        const currentRepoUrl = window.location.href;
        const modal = document.createElement('div');
        modal.className = 'gittree-modal';
        const modalContent = document.createElement('div');
        modalContent.className = 'gittree-modal-content';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'gittree-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        const gitTreeContainer = document.createElement('div');
        gitTreeContainer.className = 'gittree-container';
        gitTreeContainer.innerHTML = `
            <h1>GitHub Repo Tree Generator</h1>
            <p class="subtitle">Generate, filter, and share a clean directory tree for any public GitHub repo.</p>
            <div class="input-wrapper">
              <input type="text" id="gittree-repoUrl" placeholder="e.g., https://github.com/Azad-sl/GitTree" value="${currentRepoUrl}">
              <button id="gittree-generateBtn"><span id="gittree-btn-text">Generate</span></button>
            </div>
            <div class="options-row">
              <div class="lang-toggle" id="gittree-lang-toggle">
                <div class="lang-option active" data-lang="en">EN</div>
                <div class="lang-option" data-lang="zh">中文</div>
              </div>
              <details class="advanced-options">
                <summary>Advanced Options</summary>
                <div class="advanced-options-grid">
                  <label for="gittree-excludeInput">Exclude items (comma-separated, \`*\` supported):</label>
                  <label for="gittree-depthInput">Max Depth:</label>
                  <input type="text" id="gittree-excludeInput" placeholder="e.g., node_modules, dist, *.log">
                  <input type="number" id="gittree-depthInput" min="1" placeholder="∞">
                </div>
              </details>
            </div>
            <div class="result-wrapper">
              <div class="result-header">
                <div class="header-group view-modes">
                  <button id="gittree-view-all" class="active" title="Full View"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M14 9h7m-7 6h7M4 9h1m-1 6h1"/></svg> <span>All</span></button>
                  <button id="gittree-view-folders" title="Folders Only"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> <span>Folders</span></button>
                </div>
                <div class="header-group export-tools">
                  <button id="gittree-downloadBatBtn" title="Generate .bat script (Windows)" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg> <span id="gittree-downloadBatText">.bat</span></button>
                  <button id="gittree-downloadShBtn" title="Generate .sh script (macOS/Linux)" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg> <span>.sh</span></button>
                  <button id="gittree-copyMdBtn" title="Copy as Markdown" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg> <span id="gittree-copyMdText">Markdown</span></button>
                  <button id="gittree-exportBtn" title="Export as Image" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> <span id="gittree-exportText">Export</span></button>
                  <button id="gittree-generateRepoCardBtn" title="Generate Repo Card" disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="11" y2="17"></line></svg> <span id="gittree-generateRepoCardText">Card</span></button>
                  <button id="gittree-copyBtn" title="Copy to Clipboard" disabled><svg class="copy-icon" id="gittree-copy-icon-clipboard" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><svg class="copy-icon" id="gittree-copy-icon-check" style="display:none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg> <span id="gittree-copy-text">Copy</span></button>
                </div>
              </div>
              <pre id="gittree-result">Generated tree will be displayed here...</pre>
            </div>
            <div class="gittree-style-selector">
                <label for="gittree-card-style">Choose Card Style:</label>
                <div class="gittree-style-options">
                    <div class="gittree-style-option selected" data-style="macos">
                        <h4>macOS Style</h4>
                        <p>Classic macOS window design with dark theme</p>
                    </div>
                    <div class="gittree-style-option" data-style="modern">
                        <h4>Modern Style</h4>
                        <p>Clean and modern gradient design</p>
                    </div>
                    <div class="gittree-style-option" data-style="github">
                        <h4>GitHub Style</h4>
                        <p>Authentic GitHub repository look</p>
                    </div>
                    <div class="gittree-style-option" data-style="material">
                        <h4>Material Design</h4>
                        <p>Google's Material Design with clean aesthetics</p>
                    </div>
                </div>
            </div>
<footer>
    <p>Open-sourced on <a href="https://github.com/Azad-sl/GitTree" target="_blank" rel="noopener noreferrer"><svg class="github-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg> Azad-sl / GitTree</a></p>
    <details class="gittree-instructions">
        <summary>使用说明 / Instructions</summary>
        <div class="gittree-instructions-content">
            <div class="lang-section">
                <h3>如何使用 GitTree</h3>
                <ol>
                    <li>在输入框中输入 GitHub 仓库的 URL</li>
                    <li>点击"Generate"按钮生成目录树</li>
                    <li>使用"Advanced Options"可以设置排除项和最大深度</li>
                    <li>使用"All"和"Folders"按钮切换查看模式</li>
                    <li>使用顶部按钮可以复制、导出或生成仓库卡片</li>
                </ol>
                <h3>功能说明</h3>
                <ul>
                    <li><strong>.bat / .sh</strong>: 生成创建目录结构的脚本文件</li>
                    <li><strong>Markdown</strong>: 复制为 Markdown 格式</li>
                    <li><strong>Export</strong>: 导出目录树为图片</li>
                    <li><strong>Card</strong>: 生成并导出仓库信息卡片，支持多种主题样式</li>
                    <li><strong>Copy</strong>: 复制目录树到剪贴板</li>
                </ul>
            </div>
            <div class="lang-divider"></div>
            <div class="lang-section">
                <h3>How to Use GitTree</h3>
                <ol>
                    <li>Enter the GitHub repository URL in the input box</li>
                    <li>Click the "Generate" button to generate the directory tree</li>
                    <li>Use "Advanced Options" to set exclusions and maximum depth</li>
                    <li>Use "All" and "Folders" buttons to switch view modes</li>
                    <li>Use the top buttons to copy, export, or generate repository cards</li>
                </ol>
                <h3>Feature Description</h3>
                <ul>
                    <li><strong>.bat / .sh</strong>: Generate script files to create directory structure</li>
                    <li><strong>Markdown</strong>: Copy as Markdown format</li>
                    <li><strong>Export</strong>: Export directory tree as an image</li>
                    <li><strong>Card</strong>: Generate and export repository information card, support multiple theme styles</li>
                    <li><strong>Copy</strong>: Copy directory tree to clipboard</li>
                </ul>
            </div>
        </div>
    </details>
</footer>
        `;
        const imageCardContainer = document.createElement('div');
        imageCardContainer.id = 'gittree-image-card-container';
        imageCardContainer.innerHTML = `
            <div class="macos-window">
                <div class="title-bar">
                    <div class="traffic-lights">
                        <div class="light red"></div>
                        <div class="light yellow"></div>
                        <div class="light green"></div>
                    </div>
                    <div class="title-text"></div>
                </div>
                <pre class="card-content"></pre>
            </div>
        `;
        const repoCardContainer = document.createElement('div');
        repoCardContainer.id = 'gittree-repo-card-container';
        repoCardContainer.innerHTML = `
            <div class="card-header">
                <h2 class="repo-title">
                    <svg class="github-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    <span class="repo-name">Repository Name</span>
                </h2>
                <p class="repo-description">Repository description will be displayed here.</p>
            </div>
            <div class="card-body">
                <div class="repo-info">
                    <div class="repo-stats">
                        <div class="stat-item">
                            <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                            </svg>
                            <span class="stars-count">0</span>
                        </div>
                        <div class="stat-item">
                            <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                            </svg>
                            <span class="forks-count">0</span>
                        </div>
                    </div>
                    <div class="repo-languages">
                        <h3>Primary Languages</h3>
                        <div class="language-list">
                            <div class="language-item">
                                <span class="language-color" style="background-color: #3572A5;"></span>
                                <span class="language-name">Python</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="qr-code" id="gittree-qrcode"></div>
            </div>
            <div class="card-footer">
                <div class="generated-at">Generated on <span class="date"></span></div>
                <div class="watermark">
                    <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    <span>GitTree</span>
                </div>
            </div>
        `;
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(gitTreeContainer);
        modalContent.appendChild(imageCardContainer);
        modalContent.appendChild(repoCardContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        initGitTreeApp();
    }
    function initGitTreeApp() {
        const translations = {
            en: {
                pageTitle: "GitTree - GitHub Repo Tree Generator",
                mainTitle: "GitHub Repo Tree Generator",
                subtitle: "Generate, filter, and share a clean directory tree for any public GitHub repo.",
                repoUrl: "e.g., https://github.com/Azad-sl/GitTree",
                generate: "Generate",
                advancedOptions: "Advanced Options",
                excludeLabel: "Exclude items (comma-separated, `*` supported):",
                depthLabel: "Max Depth:",
                excludeInput: "e.g., node_modules, dist, *.log",
                resultPlaceholder: "Generated tree will be displayed here...",
                viewAll: "Full View",
                viewFolders: "Folders Only",
                downloadBat: "Generate .bat script (Windows)",
                downloadSh: "Generate .sh script (macOS/Linux)",
                copyMd: "Copy as Markdown",
                export: "Export as Image",
                generateRepoCard: "Generate Repo Card",
                copy: "Copy to Clipboard",
                exportBtn: "Export",
                cardBtn: "Card",
                copyBtn: "Copy",
                copied: "Copied!",
                exporting: "Exporting...",
                generatingCard: "Generating Card...",
                errorPrefix: "❌ Error: ",
                enterURL: "Please enter a GitHub repository URL.",
                invalidURL: "Invalid GitHub repository URL. Please check the format.",
                repoNotFound: "Repository or branch not found. Please check the URL.",
                apiLimit: "API rate limit exceeded. Please wait a moment and try again.",
                fetchFailed: "Failed to fetch tree data: ",
                fetchRepoInfoFailed: "Failed to fetch repository info: ",
                fetchLanguagesFailed: "Failed to fetch repository languages: ",
                noContent: "No items to display. Please check your filter conditions.",
                copyFailed: "Copy failed. Your browser might not support it or permission denied.",
                exportFailed: "Exporting image failed. Check console for details.",
                generateCardFailed: "Generating card failed. Please close the window and try again later or check console for details.",
                noBatContent: "No content to create.",
                cardStyleLabel: "Choose Card Style:",
                macosStyle: "macOS Style",
                macosStyleDesc: "Classic macOS window design with dark theme",
                modernStyle: "Modern Style",
                modernStyleDesc: "Clean and modern gradient design",
                githubStyle: "GitHub Style",
                githubStyleDesc: "Authentic GitHub repository look",
                materialStyle: "Material Design",
                materialStyleDesc: "Google's Material Design with clean aesthetics"
            },
            zh: {
                pageTitle: "GitTree - GitHub仓库树生成器",
                mainTitle: "GitHub仓库树生成器",
                subtitle: "为任何公共GitHub仓库生成、过滤和分享清晰的目录树。",
                repoUrl: "例如：https://github.com/Azad-sl/GitTree",
                generate: "生成",
                advancedOptions: "高级选项",
                excludeLabel: "排除项目（逗号分隔，支持`*`）:",
                depthLabel: "最大深度:",
                excludeInput: "例如：node_modules, dist, *.log",
                resultPlaceholder: "生成的目录树将显示在这里...",
                viewAll: "完整",
                viewFolders: "仅文件夹",
                downloadBat: ".bat脚本（Windows）",
                downloadSh: ".sh脚本（macOS/Linux）",
                copyMd: "md格式",
                export: "导出为图片",
                generateRepoCard: "生成仓库卡片",
                copy: "复制到剪贴板",
                exportBtn: "导出",
                cardBtn: "项目卡片",
                copyBtn: "复制",
                copied: "已复制!",
                exporting: "导出中...",
                generatingCard: "生成卡片中...",
                errorPrefix: "❌ 错误: ",
                enterURL: "请输入GitHub仓库URL。",
                invalidURL: "无效的GitHub仓库URL。请检查格式。",
                repoNotFound: "仓库或分支未找到。请检查URL。",
                apiLimit: "API速率限制已超过。请稍等片刻再试。",
                fetchFailed: "获取树数据失败: ",
                fetchRepoInfoFailed: "获取仓库信息失败: ",
                fetchLanguagesFailed: "获取仓库语言失败: ",
                noContent: "没有可显示的项目。请检查您的过滤条件。",
                copyFailed: "复制失败。您的浏览器可能不支持或权限被拒绝。",
                exportFailed: "导出图片失败。请检查控制台获取详细信息。",
                generateCardFailed: "生成卡片失败。请关闭窗口后重试，或检查控制台获取详细信息。",
                noBatContent: "没有内容可创建。",
                cardStyleLabel: "选择分享卡片样式:",
                macosStyle: "macOS风格",
                macosStyleDesc: "经典的macOS窗口设计，采用深色主题",
                modernStyle: "现代风格",
                modernStyleDesc: "干净现代的渐变设计",
                githubStyle: "GitHub风格",
                githubStyleDesc: "真实的GitHub仓库外观",
                materialStyle: "Material设计",
                materialStyleDesc: "谷歌Material设计，具有简洁的美学"
            }
        };
        let currentLang = 'en';
        const resultDiv = document.getElementById('gittree-result');
        const repoUrlInput = document.getElementById('gittree-repoUrl');
        const generateBtn = document.getElementById('gittree-generateBtn');
        const excludeInput = document.getElementById('gittree-excludeInput');
        const depthInput = document.getElementById('gittree-depthInput');
        const copyBtn = document.getElementById('gittree-copyBtn');
        const copyMdBtn = document.getElementById('gittree-copyMdBtn');
        const exportBtn = document.getElementById('gittree-exportBtn');
        const generateRepoCardBtn = document.getElementById('gittree-generateRepoCardBtn');
        const downloadBatBtn = document.getElementById('gittree-downloadBatBtn');
        const downloadShBtn = document.getElementById('gittree-downloadShBtn');
        const viewAllBtn = document.getElementById('gittree-view-all');
        const viewFoldersBtn = document.getElementById('gittree-view-folders');
        const btnText = document.getElementById('gittree-btn-text');
        const copyText = document.getElementById('gittree-copy-text');
        const copyMdText = document.getElementById('gittree-copyMdText');
        const exportText = document.getElementById('gittree-exportText');
        const generateRepoCardText = document.getElementById('gittree-generateRepoCardText');
        const iconClipboard = document.getElementById('gittree-copy-icon-clipboard');
        const iconCheck = document.getElementById('gittree-copy-icon-check');
        const langToggle = document.getElementById('gittree-lang-toggle');
        let fullTreeData = [];
        let currentRepoInfo = null;
        let currentRepoDetails = null;
        let currentRepoLanguages = null;
        let hasResultForCopy = false;
        let currentViewMode = "all";
        let selectedCardStyle = "macos";
        function updateLanguage(lang) {
            currentLang = lang;
            document.querySelector('.gittree-container h1').textContent = translations[lang].mainTitle;
            document.querySelector('.gittree-container .subtitle').textContent = translations[lang].subtitle;
            repoUrlInput.placeholder = translations[lang].repoUrl;
            btnText.textContent = translations[lang].generate;
            document.querySelector('.advanced-options summary').textContent = translations[lang].advancedOptions;
            document.querySelector('label[for="gittree-excludeInput"]').textContent = translations[lang].excludeLabel;
            document.querySelector('label[for="gittree-depthInput"]').textContent = translations[lang].depthLabel;
            excludeInput.placeholder = translations[lang].excludeInput;
            resultDiv.textContent = translations[lang].resultPlaceholder;
            viewAllBtn.querySelector('span').textContent = translations[lang].viewAll;
            viewFoldersBtn.querySelector('span').textContent = translations[lang].viewFolders;
            copyText.textContent = translations[lang].copyBtn;
            copyMdText.textContent = translations[lang].copyMd;
            exportText.textContent = translations[lang].exportBtn;
            generateRepoCardText.textContent = translations[lang].cardBtn;
            document.querySelector('.gittree-style-selector label').textContent = translations[lang].cardStyleLabel;
            const styleOptions = document.querySelectorAll('.gittree-style-option');
            styleOptions[0].querySelector('h4').textContent = translations[lang].macosStyle;
            styleOptions[0].querySelector('p').textContent = translations[lang].macosStyleDesc;
            styleOptions[1].querySelector('h4').textContent = translations[lang].modernStyle;
            styleOptions[1].querySelector('p').textContent = translations[lang].modernStyleDesc;
            styleOptions[2].querySelector('h4').textContent = translations[lang].githubStyle;
            styleOptions[2].querySelector('p').textContent = translations[lang].githubStyleDesc;
            styleOptions[3].querySelector('h4').textContent = translations[lang].materialStyle;
            styleOptions[3].querySelector('p').textContent = translations[lang].materialStyleDesc;
        }
        function setShareButtonsState(enabled) {
            hasResultForCopy = enabled;
            [copyBtn, exportBtn, copyMdBtn, downloadBatBtn, downloadShBtn, generateRepoCardBtn].forEach(btn => btn.disabled = !enabled);
        }
        function generateShContent() {
            if (!currentRepoInfo || fullTreeData.length === 0) return '';
            const rootDir = currentRepoInfo.repo;
            const filteredItems = filterTree(fullTreeData, excludeInput.value.split(',').map(p => p.trim()).filter(Boolean), parseInt(depthInput.value, 10) || Infinity, currentViewMode);
            const commands = [
                '#!/bin/bash',
                '# Generated by GitTree',
                '',
                `echo "Creating directory structure for '${rootDir}'..."`,
                `mkdir -p "${rootDir}"`,
                `cd "${rootDir}"`,
                ''
            ];
            const dirsToCreate = new Set();
            const filesToCreate = new Set();
            for (const item of filteredItems) {
                if (item.type === 'tree') {
                    dirsToCreate.add(item.path);
                } else if (item.type === 'blob') {
                    const lastSlash = item.path.lastIndexOf('/');
                    if (lastSlash > -1) {
                       dirsToCreate.add(item.path.substring(0, lastSlash));
                    }
                    filesToCreate.add(item.path);
                }
            }
            if (dirsToCreate.size > 0) {
                commands.push('# Creating directories...');
                dirsToCreate.forEach(dir => commands.push(`mkdir -p "${dir}"`));
                commands.push('');
            }
            if (filesToCreate.size > 0) {
                commands.push('# Creating files...');
                filesToCreate.forEach(file => commands.push(`touch "${file}"`));
                commands.push('');
            }
            commands.push(`echo "Directory structure for '${rootDir}' created successfully!"`);
            return commands.join('\n');
        }
        function generateBatContent() {
            if (!currentRepoInfo || fullTreeData.length === 0) return '';
            const rootDir = currentRepoInfo.repo;
            const filteredItems = filterTree(fullTreeData, excludeInput.value.split(',').map(p => p.trim()).filter(Boolean), parseInt(depthInput.value, 10) || Infinity, currentViewMode);
            const commands = ['@echo off', 'chcp 65001 > nul', `echo Creating directory structure for ${rootDir}...`, `if not exist "${rootDir}" ( md "${rootDir}" )`, `cd "${rootDir}"`, ''];
            filteredItems.sort((a,b) => a.path.localeCompare(b.path));
            for (const item of filteredItems) {
                const windowsPath = item.path.replace(/\//g, '\\');
                if (item.type === 'tree') {
                    commands.push(`if not exist "${windowsPath}" ( md "${windowsPath}" )`);
                } else if (item.type === 'blob') {
                    const lastBackslash = windowsPath.lastIndexOf('\\');
                    if (lastBackslash > -1) {
                        const dir = windowsPath.substring(0, lastBackslash);
                        commands.push(`if not exist "${dir}" ( md "${dir}" )`);
                    }
                    commands.push(`if not exist "${windowsPath}" ( type NUL > "${windowsPath}" )`);
                }
            }
            commands.push('', 'echo.', `echo Directory structure for "${rootDir}" created successfully!`, 'pause');
            return commands.join('\r\n');
        }
        function parseGitHubUrl(url) {
            const match = /https?:\/\/github\.com\/([^\/]+)\/([^\/\s]+)/.exec(url);
            return match ? { owner: match[1], repo: match[2].replace(".git", ""), branch: "main" } : null;
        }
        function showError(messageKey) {
            let message = translations[currentLang][messageKey] || messageKey;
            if (messageKey.startsWith('fetchFailed') || messageKey.startsWith('fetchRepoInfoFailed') || messageKey.startsWith('fetchLanguagesFailed')) {
                let prefix = '';
                if (messageKey.startsWith('fetchFailed')) {
                    prefix = translations[currentLang].fetchFailed;
                } else if (messageKey.startsWith('fetchRepoInfoFailed')) {
                    prefix = translations[currentLang].fetchRepoInfoFailed;
                } else if (messageKey.startsWith('fetchLanguagesFailed')) {
                    prefix = translations[currentLang].fetchLanguagesFailed;
                }
                message = prefix + messageKey.replace(/^(fetchFailed|fetchRepoInfoFailed|fetchLanguagesFailed)/, '');
            }
            resultDiv.textContent = translations[currentLang].errorPrefix + message;
            resultDiv.className = "error";
        }
        function showSuccess(text) {
            resultDiv.textContent = text;
            resultDiv.className = "";
        }
        function setLoading(isLoading) {
            generateBtn.disabled = isLoading;
            if (isLoading) {
                btnText.textContent = "";
                const spinner = document.createElement("span");
                spinner.className = "spinner";
                generateBtn.prepend(spinner);
            } else {
                btnText.textContent = translations[currentLang].generate;
                const spinner = generateBtn.querySelector(".spinner");
                if (spinner) spinner.remove();
            }
        }
        async function fetchTreeData(owner, repo, branch) {
            let response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
            if (response.status === 404) {
                console.log("Branch 'main' not found, trying 'master'");
                response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
            }
            if (!response.ok) {
                if (response.status === 404) throw new Error('repoNotFound');
                if (response.status === 403) throw new Error('apiLimit');
                throw new Error('fetchFailed' + response.statusText);
            }
            const data = await response.json();
            if (data.truncated) {
                alert("Warning: The file list is too large and has been truncated by the GitHub API. The generated tree may be incomplete.");
            }
            return data.tree;
        }
        async function fetchRepoDetails(owner, repo) {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('repoNotFound');
                if (response.status === 403) throw new Error('apiLimit');
                throw new Error('fetchRepoInfoFailed' + response.statusText);
            }
            return response.json();
        }
        async function fetchRepoLanguages(owner, repo) {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('repoNotFound');
                if (response.status === 403) throw new Error('apiLimit');
                throw new Error('fetchLanguagesFailed' + response.statusText);
            }
            return response.json();
        }
        function filterTree(tree, excludePatterns, maxDepth, viewMode) {
            return tree.filter(item => {
                const depth = item.path.split('/').length;
                if (depth > maxDepth) return false;
                const isExcluded = excludePatterns.some(pattern => {
                    if (pattern.startsWith('*.')) {
                        return item.path.endsWith(pattern.substring(1));
                    }
                    return item.path.split('/').includes(pattern);
                });
                if (isExcluded) return false;
                if (viewMode === 'folders' && item.type !== 'tree') return false;
                return true;
            });
        }
        function buildTreeString(repoName, tree, maxDepth) {
            if (!tree || tree.length === 0) return translations[currentLang].noContent;
            const root = {};
            tree.forEach(item => {
                let path = item.path.split('/');
                let currentLevel = root;
                for (let i = 0; i < path.length; i++) {
                    let part = path[i];
                    if (!currentLevel[part]) {
                        currentLevel[part] = (i === path.length - 1 && item.type === 'blob') ? null : {};
                    }
                    currentLevel = currentLevel[part];
                }
            });
            let treeString = `${repoName}/\n`;
            const build = (node, prefix = "", level = 1) => {
                const entries = Object.keys(node).sort((a, b) => {
                    const aIsDir = node[a] !== null;
                    const bIsDir = node[b] !== null;
                    if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
                    return a.localeCompare(b);
                });
                entries.forEach((entry, index) => {
                    const isLast = index === entries.length - 1;
                    const connector = isLast ? "└── " : "├── ";
                    treeString += `${prefix}${connector}${entry}\n`;
                    const child = node[entry];
                    if (child !== null && level < maxDepth) {
                        const newPrefix = prefix + (isLast ? "    " : "│   ");
                        build(child, newPrefix, level + 1);
                    }
                });
            };
            build(root);
            return treeString.trim();
        }
        function renderTree() {
            if (!currentRepoInfo) return;
            const excludePatterns = excludeInput.value.split(',').map(p => p.trim()).filter(Boolean);
            const maxDepth = parseInt(depthInput.value, 10) || Infinity;
            const filteredTree = filterTree(fullTreeData, excludePatterns, maxDepth, currentViewMode);
            const treeString = buildTreeString(currentRepoInfo.repo, filteredTree, maxDepth);
            showSuccess(treeString);
            if (filteredTree.length > 0) {
                setShareButtonsState(true);
            } else {
                setShareButtonsState(false);
            }
        }
        function setViewMode(mode) {
            if (currentViewMode === mode) return;
            currentViewMode = mode;
            viewAllBtn.classList.toggle("active", mode === "all");
            viewFoldersBtn.classList.toggle("active", mode === "folders");
            if (hasResultForCopy) {
                renderTree();
            }
        }
        async function handleGenerationWrapper() {
            setShareButtonsState(false);
            const url = repoUrlInput.value.trim();
            if (!url) {
                showError('enterURL');
                return;
            }
            currentRepoInfo = parseGitHubUrl(url);
            if (!currentRepoInfo) {
                showError('invalidURL');
                return;
            }
            setLoading(true);
            try {
                const rawTree = await fetchTreeData(currentRepoInfo.owner, currentRepoInfo.repo, currentRepoInfo.branch);
                fullTreeData = rawTree;
                try {
                    currentRepoDetails = await fetchRepoDetails(currentRepoInfo.owner, currentRepoInfo.repo);
                } catch (error) {
                    console.error("Failed to fetch repo details:", error);
                    currentRepoDetails = null;
                }
                try {
                    currentRepoLanguages = await fetchRepoLanguages(currentRepoInfo.owner, currentRepoInfo.repo);
                } catch (error) {
                    console.error("Failed to fetch repo languages:", error);
                    currentRepoLanguages = null;
                }
                renderTree();
            } catch (error) {
                showError(error.message);
                fullTreeData = [];
                currentRepoInfo = null;
                currentRepoDetails = null;
                currentRepoLanguages = null;
            } finally {
                setLoading(false);
            }
        }
        // 生成二维码
        function generateQRCode(container, url) {
            container.innerHTML = '';
            new QRCode(container, {
                text: url,
                width: 140,
                height: 140,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        // 生成并导出GitHub项目分享卡片
        async function generateAndExportRepoCard() {
            if (!currentRepoInfo || !currentRepoDetails) {
                alert("Repository information not available. Please generate the tree first.");
                return;
            }
            generateRepoCardText.textContent = translations[currentLang].generatingCard;
            generateRepoCardBtn.disabled = true;
            try {
                const repoCardContainer = document.getElementById("gittree-repo-card-container");
                const repoName = repoCardContainer.querySelector('.repo-name');
                const repoDescription = repoCardContainer.querySelector('.repo-description');
                const starsCount = repoCardContainer.querySelector('.stars-count');
                const forksCount = repoCardContainer.querySelector('.forks-count');
                const languageList = repoCardContainer.querySelector('.language-list');
                const qrCodeContainer = document.getElementById('gittree-qrcode');
                const generatedDate = repoCardContainer.querySelector('.date');
                repoCardContainer.className = '';
                repoCardContainer.classList.add(selectedCardStyle + '-style');
                repoName.textContent = `${currentRepoDetails.owner.login}/${currentRepoDetails.name}`;
                repoDescription.textContent = currentRepoDetails.description || "No description available.";
                if (selectedCardStyle === 'modern') {
                    const statItems = repoCardContainer.querySelectorAll('.stat-item');
                    statItems[0].innerHTML = `
                        <svg viewBox="0 0 16 16" version="1.1" width="24" height="24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                        </svg>
                        <span class="stat-value">${currentRepoDetails.stargazers_count}</span>
                        <span class="stat-label">${currentLang === 'zh' ? '星标' : 'Stars'}</span>
                    `;
                    statItems[1].innerHTML = `
                        <svg viewBox="0 0 16 16" version="1.1" width="24" height="24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                        </svg>
                        <span class="stat-value">${currentRepoDetails.forks_count}</span>
                        <span class="stat-label">${currentLang === 'zh' ? '分支' : 'Forks'}</span>
                    `;
                } else {
                    starsCount.textContent = currentRepoDetails.stargazers_count;
                    forksCount.textContent = currentRepoDetails.forks_count;
                }
                languageList.innerHTML = '';
                if (currentRepoLanguages && Object.keys(currentRepoLanguages).length > 0) {
                    const languagesArray = Object.entries(currentRepoLanguages)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10); // 只取前10种语言
                    // 常见编程语言的颜色映射
                    const languageColors = {
                        'JavaScript': '#f1e05a',
                        'TypeScript': '#2b7489',
                        'Python': '#3572A5',
                        'Java': '#b07219',
                        'C++': '#f34b7d',
                        'C': '#555555',
                        'Go': '#00ADD8',
                        'Rust': '#dea584',
                        'PHP': '#4F5D95',
                        'Ruby': '#701516',
                        'Swift': '#ffac45',
                        'Kotlin': '#F18E33',
                        'HTML': '#e34c26',
                        'CSS': '#563d7c',
                        'Shell': '#89e051',
                        'Vue': '#2c3e50',
                        'Dart': '#00B4AB',
                        'Objective-C': '#438eff',
                        'Scala': '#c22d40',
                        'C#': '#239120',
                        'Perl': '#0298c3',
                        'Elixir': '#6e4a7e',
                        'Haskell': '#5e5086',
                        'Lua': '#000080',
                        'Clojure': '#db5855',
                        'CoffeeScript': '#244776',
                        'PowerShell': '#012456',
                        'Groovy': '#e69f56',
                        'Julia': '#a270ba',
                        'Crystal': '#000100',
                        'R': '#198ce7',
                        'MATLAB': '#e16737',
                        'Dockerfile': '#384d54',
                        'Makefile': '#427819',
                        'Assembly': '#6E4C13',
                        'Jupyter Notebook': '#DA5B0B'
                    };
                    languagesArray.forEach(([lang, bytes]) => {
                        const langItem = document.createElement('div');
                        langItem.className = 'language-item';
                        const langColor = document.createElement('span');
                        langColor.className = 'language-color';
                        langColor.style.backgroundColor = languageColors[lang] || '#cccccc';
                        const langName = document.createElement('span');
                        langName.className = 'language-name';
                        langName.textContent = lang;
                        langItem.appendChild(langColor);
                        langItem.appendChild(langName);
                        languageList.appendChild(langItem);
                    });
                } else {
                    const langItem = document.createElement('div');
                    langItem.className = 'language-item';
                    langItem.innerHTML = `<span class="language-name">${currentLang === 'zh' ? '未指定' : 'Not specified'}</span>`;
                    languageList.appendChild(langItem);
                }
                // 生成二维码
                generateQRCode(qrCodeContainer, currentRepoDetails.html_url);
                // 更新生成日期
                const now = new Date();
                generatedDate.textContent = now.toLocaleDateString();
                // 导出为图片
                const canvas = await html2canvas(repoCardContainer, {
                    useCORS: true,
                    backgroundColor: null,
                    scale: 2
                });
                const link = document.createElement("a");
                link.download = `${currentRepoDetails.name}-repo-card.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            } catch (error) {
                console.error("Generating card failed:", error);
                alert(translations[currentLang].generateCardFailed);
            } finally {
                generateRepoCardText.textContent = translations[currentLang].cardBtn;
                generateRepoCardBtn.disabled = false;
            }
        }
        function initStyleSelector() {
            const styleOptions = document.querySelectorAll('.gittree-style-option');
            styleOptions.forEach(option => {
                option.addEventListener('click', () => {
                    styleOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    selectedCardStyle = option.getAttribute('data-style');
                });
            });
        }
        function initLangToggle() {
            const langOptions = langToggle.querySelectorAll('.lang-option');
            langOptions.forEach(option => {
                option.addEventListener('click', () => {
                    langOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    updateLanguage(option.getAttribute('data-lang'));
                });
            });
        }
        generateBtn.addEventListener("click", handleGenerationWrapper);
        repoUrlInput.addEventListener("keydown", e => { if (e.key === "Enter") handleGenerationWrapper(); });
        viewAllBtn.addEventListener("click", () => setViewMode("all"));
        viewFoldersBtn.addEventListener("click", () => setViewMode("folders"));
        copyBtn.addEventListener("click", () => {
            if (!hasResultForCopy) return;
            GM_setClipboard(resultDiv.innerText).then(() => {
                copyText.textContent = translations[currentLang].copied;
                iconClipboard.style.display = "none";
                iconCheck.style.display = "inline-block";
                setTimeout(() => {
                    copyText.textContent = translations[currentLang].copyBtn;
                    iconClipboard.style.display = "inline-block";
                    iconCheck.style.display = "none";
                }, 2000);
            }).catch(e => {
                console.error("Copy failed:", e);
                alert(translations[currentLang].copyFailed);
            });
        });
        copyMdBtn.addEventListener('click', () => {
            if (!hasResultForCopy) return;
            const content = "```\n" + resultDiv.innerText + "\n```";
            GM_setClipboard(content).then(() => {
                const originalText = copyMdText.textContent;
                copyMdText.textContent = translations[currentLang].copied;
                setTimeout(() => {
                    copyMdText.textContent = originalText;
                }, 2000);
            }).catch(e => {
                console.error("Copy Markdown failed:", e);
                alert(translations[currentLang].copyFailed);
            });
        });
        exportBtn.addEventListener('click', async () => {
            if (!hasResultForCopy) return;
            exportText.textContent = translations[currentLang].exporting;
            exportBtn.disabled = true;
            const imageCardContainer = document.getElementById("gittree-image-card-container");
            const titleText = imageCardContainer.querySelector(".title-text");
            const cardContent = imageCardContainer.querySelector(".card-content");
            try {
                cardContent.style.maxHeight = "none";
                titleText.textContent = `${currentRepoInfo.owner}/${currentRepoInfo.repo}`;
                cardContent.textContent = resultDiv.textContent;
                const canvas = await html2canvas(imageCardContainer, {
                    useCORS: true,
                    backgroundColor: null
                });
                const link = document.createElement("a");
                link.download = `${currentRepoInfo.repo}-tree.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            } catch (error) {
                console.error("Exporting image failed:", error);
                alert(translations[currentLang].exportFailed);
            } finally {
                cardContent.style.maxHeight = "";
                exportText.textContent = translations[currentLang].exportBtn;
                exportBtn.disabled = false;
            }
        });
        generateRepoCardBtn.addEventListener('click', generateAndExportRepoCard);
        downloadBatBtn.addEventListener('click', () => {
            if (!hasResultForCopy || !currentRepoInfo) return;
            const content = generateBatContent();
            if (!content) {
                alert(translations[currentLang].noBatContent);
                return;
            }
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `create_${currentRepoInfo.repo}_structure.bat`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
        downloadShBtn.addEventListener('click', () => {
            if (!hasResultForCopy || !currentRepoInfo) return;
            const content = generateShContent();
            if (!content) {
                alert(translations[currentLang].noBatContent);
                return;
            }
            const blob = new Blob([content], { type: 'application/x-shellscript' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `create_${currentRepoInfo.repo}_structure.sh`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
        initStyleSelector();
        initLangToggle();
    }
    window.addEventListener('load', () => {
        addGitTreeButton();
    });
})();