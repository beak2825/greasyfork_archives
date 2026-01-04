// ==UserScript==
// @name QCC Network Monitor Styles
// @namespace github.com/yourusername/qcc-network-monitor
// @version 1.0.0
// @description Enhanced network monitoring styles for QCC Network Monitor userscript
// @author EDDIE
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/543383/QCC%20Network%20Monitor%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/543383/QCC%20Network%20Monitor%20Styles.meta.js
// ==/UserScript==

(function() {
let css = `.nm-floating-container {
    position: fixed;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    pointer-events: auto;
}

.nm-code-block {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    margin: 8px 0;
    overflow: hidden;
}

.nm-code-header {
    background: #e9ecef;
    padding: 8px 12px;
    border-bottom: 1px solid #dee2e6;
    font-size: 12px;
    color: #6c757d;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nm-code-content {
    max-height: 300px;
    overflow: auto;
    position: relative;
}

.nm-line-numbers {
    position: absolute;
    left: 0;
    top: 0;
    padding: 12px 8px;
    background: #f1f3f4;
    border-right: 1px solid #dee2e6;
    color: #6c757d;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    user-select: none;
    min-width: 40px;
    text-align: right;
}

.nm-code-pre.with-lines {
    padding-left: 60px;
}

.nm-copy-code-btn {
    padding: 4px 8px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.nm-copy-code-btn:hover {
    background: #5a6268;
}

.nm-floating-container.dragging {
    transition: none;
}

.nm-floating-container.hidden-left {
    transform: translateX(-75%) !important;
    opacity: 0.3 !important;
}

.nm-floating-container.hidden-right {
    transform: translateX(75%) !important;
    opacity: 0.3 !important;
}

.nm-floating-ball {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    pointer-events: auto;
}

.nm-floating-ball:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.15);
}

.nm-floating-ball:active {
    transform: scale(0.95);
}

.nm-floating-container.dragging .nm-floating-ball {
    width: 40px;
    height: 40px;
    opacity: 0.8;
}

.nm-counter {
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
    pointer-events: none;
}

.nm-floating-container.dragging .nm-counter {
    font-size: 10px;
}

.nm-more-buttons {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
}

.nm-floating-container:hover .nm-more-buttons {
    opacity: 1;
    visibility: visible;
}

.nm-floating-container.dragging .nm-more-buttons {
    opacity: 0 !important;
    visibility: hidden !important;
}

.nm-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    border: none;
    outline: none;
    pointer-events: auto;
}

.nm-btn:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.nm-btn svg {
    width: 18px;
    height: 18px;
    fill: #666;
    pointer-events: none;
}

.nm-config-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1);
    z-index: 2147483648;
    min-width: 400px;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
}

.nm-config-panel.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.nm-config-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nm-config-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.nm-close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
    pointer-events: auto;
}

.nm-close-btn:hover {
    background: #e5e7eb;
}

.nm-config-content {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
}

.nm-config-item {
    margin-bottom: 20px;
}

.nm-config-item:last-child {
    margin-bottom: 0;
}

.nm-config-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.nm-config-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
}

.nm-config-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.nm-config-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nm-config-checkbox input {
    width: 16px;
    height: 16px;
}

.nm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2147483647;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: auto;
}

.nm-overlay.show {
    opacity: 1;
}

.nm-details-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1);
    z-index: 2147483648;
    width: 90vw;
    max-width: 800px;
    max-height: 80vh;
    overflow: hidden;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
}

.nm-details-panel.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

.nm-details-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nm-details-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.nm-details-content {
    max-height: 60vh;
    overflow-y: auto;
    padding: 0;
}

.nm-request-item {
    padding: 16px 24px;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s ease;
}

.nm-request-item:hover {
    background: #f9fafb;
}

.nm-request-item:last-child {
    border-bottom: none;
}

.nm-request-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.nm-request-method {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin-right: 8px;
}

.nm-method-get { background: #dcfce7; color: #166534; }
.nm-method-post { background: #fef3c7; color: #92400e; }
.nm-method-put { background: #dbeafe; color: #1e40af; }
.nm-method-delete { background: #fecaca; color: #991b1b; }
.nm-method-patch { background: #e0e7ff; color: #3730a3; }

.nm-request-url {
    color: #1f2937;
    font-weight: 500;
    font-size: 13px;
    flex: 1;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
    position: relative;
}

.nm-request-url:hover {
    overflow: visible;
    white-space: normal;
    word-break: break-all;
    background: #f9fafb;
    padding: 4px 8px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
}

.nm-response-size {
    display: inline-block;
    padding: 2px 6px;
    background: #f3f4f6;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 500;
    color: #6b7280;
    margin-left: 8px;
}

.nm-response-size.large {
    background: #fef3c7;
    color: #92400e;
}

.nm-response-size.small {
    background: #dcfce7;
    color: #166534;
}

.nm-request-actions {
    display: flex;
    gap: 8px;
}

.nm-copy-btn {
    padding: 4px 8px;
    background: #f3f4f6;
    border: none;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.2s ease;
    pointer-events: auto;
}

.nm-copy-btn:hover {
    background: #e5e7eb;
}

.nm-request-info {
    color: #6b7280;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nm-request-status {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nm-status-success { color: #10b981; }
.nm-status-error { color: #ef4444; }
.nm-status-pending { color: #f59e0b; }

.nm-request-details {
    margin-top: 8px;
    padding: 8px;
    background: #f9fafb;
    border-radius: 4px;
    font-size: 11px;
    color: #6b7280;
    display: none;
}

.nm-request-item.expanded .nm-request-details {
    display: block;
}

.nm-expand-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 11px;
    padding: 2px 4px;
    pointer-events: auto;
}

.nm-expand-btn:hover {
    color: #374151;
}

@keyframes nm-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.nm-floating-ball.loading {
    animation: nm-pulse 1.5s ease-in-out infinite;
}

.nm-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 2147483649;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    pointer-events: auto;
}

.nm-toast.show {
    opacity: 1;
    transform: translateX(0);
}

.nm-debug-info {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 2147483646;
    display: none;
}

.nm-debug-info.show {
    display: block;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
