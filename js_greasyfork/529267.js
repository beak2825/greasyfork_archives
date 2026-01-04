// ==UserScript==
// @name         Text Summarizer with Gemini API
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Summarize selected text using Gemini 2.0 Flash API with enhanced features
// @author       Hà Trọng Nguyễn
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @homepageURL  https://github.com/htrnguyen
// @supportURL   https://github.com/htrnguyen/Text-Summarizer-with-Gemini-API/issues
// @icon         https://github.com/htrnguyen/User-Scripts/raw/main/Text-Summarizer-with-Gemini-API/text-summarizer-logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529267/Text%20Summarizer%20with%20Gemini%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/529267/Text%20Summarizer%20with%20Gemini%20API.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // Khai báo biến toàn cục
    let API_KEY = GM_getValue('geminiApiKey', '') || ''
    let shortcutKey = GM_getValue('shortcutKey', 't')
    let modifierKeys = JSON.parse(GM_getValue('modifierKeys', '["Alt"]')) || [
        'Alt',
    ]
    let currentPopup = null
    let currentRequest = null
    let isDragging = false
    let isResizing = false
    let offsetX, offsetY, resizeOffsetX, initialWidth
    let isProcessing = false // Biến khóa để ngăn spam

    // Hàm khởi tạo
    function initialize() {
        if (!API_KEY) {
            showPopup('Cài đặt', getSettingsContent())
        }
        setupEventListeners()
    }

    // Thiết lập các sự kiện
    function setupEventListeners() {
        document.addEventListener('keydown', handleKeydown)
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('Cài đặt Text Summarizer', () =>
                showPopup('Cài đặt', getSettingsContent())
            )
            GM_registerMenuCommand('Lịch sử tóm tắt', () => {
                const history = JSON.parse(GM_getValue('summaryHistory', '[]'))
                if (history.length === 0) {
                    showPopup('Lịch sử tóm tắt', 'Chưa có tóm tắt nào!')
                    return
                }
                const historyContent = history
                    .map(
                        (item, index) => `
                    <div class="history-item">
                        <strong>${index + 1}. ${item.timestamp}</strong><br>
                        <strong>Văn bản gốc:</strong> ${item.text}<br>
                        <strong>Tóm tắt:</strong><br>${item.summary}<br><br>
                    </div>
                `
                    )
                    .join('')
                showPopup('Lịch sử tóm tắt', historyContent)
            })
        }
    }

    // Kiểm tra phím tắt
    function checkShortcut(e) {
        const key = e.key.toLowerCase()
        const modifiers = modifierKeys.map((mod) => mod.toLowerCase())
        const currentModifiers = []
        if (e.altKey) currentModifiers.push('alt')
        if (e.ctrlKey) currentModifiers.push('ctrl')
        if (e.shiftKey) currentModifiers.push('shift')
        return (
            key === shortcutKey &&
            currentModifiers.sort().join(',') === modifiers.sort().join(',')
        )
    }

    // Xử lý phím tắt và ESC
    function handleKeydown(e) {
        if (checkShortcut(e)) {
            e.preventDefault()
            // Ngăn spam nếu đang xử lý
            if (isProcessing) return
            isProcessing = true
            const selectedText = window.getSelection().toString().trim()
            if (selectedText) {
                summarizeText(selectedText)
            } else {
                showPopup(
                    'Lỗi',
                    'Vui lòng chọn một đoạn văn bản để tóm tắt nhé!',
                    2000
                )
            }
        } else if (e.key === 'Escape' && currentPopup) {
            closeAllPopups(true) // Đóng thủ công với animation
        }
    }

    // Gửi yêu cầu đến Gemini API
    function summarizeText(text) {
        const maxLength = 10000
        if (text.length > maxLength) {
            showPopup(
                'Lỗi',
                `Văn bản quá dài (${text.length} ký tự). Vui lòng chọn đoạn văn dưới ${maxLength} ký tự!`,
                2000
            )
            return
        }
        closeAllPopups() // Xóa ngay không animation
        showLoader()
        if (currentRequest) {
            currentRequest.abort()
        }
        const prompt = `Tóm tắt nội dung sau đây một cách chi tiết và đầy đủ, đảm bảo giữ lại tất cả ý chính và chi tiết quan trọng mà không lược bỏ bất kỳ thông tin nào. Kết quả cần được trình bày với xuống dòng và bố cục hợp lý để dễ đọc, rõ ràng. Chỉ bao gồm thông tin cần tóm tắt, không thêm phần thừa như 'dưới đây là tóm tắt' hoặc lời dẫn. Định dạng trả về là văn bản thông thường, không sử dụng markdown. Bạn có thể sử dụng các biểu tượng emoji để làm dấu chấm, số thứ tự hoặc gạch đầu dòng, nhưng hãy hạn chế và sử dụng một cách tinh tế. Nội dung cần tóm tắt là: ${text}`
        currentRequest = GM_xmlhttpRequest({
            method: 'POST',
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                contents: [{parts: [{text: prompt}]}],
            }),
            timeout: 10000,
            onload: function (response) {
                hideLoader()
                const data = JSON.parse(response.responseText)
                if (data.candidates && data.candidates.length > 0) {
                    const summary =
                        data.candidates[0].content.parts[0].text ||
                        'Không thể tóm tắt được nội dung này!'
                    let history = JSON.parse(
                        GM_getValue('summaryHistory', '[]')
                    )
                    history.unshift({
                        text: text.substring(0, 50) + '...',
                        summary,
                        timestamp: new Date().toLocaleString(),
                    })
                    if (history.length > 5) history.pop()
                    GM_setValue('summaryHistory', JSON.stringify(history))
                    showPopup('Tóm tắt', summary)
                } else if (data.error) {
                    showPopup(
                        'Lỗi',
                        `Có lỗi từ API: ${data.error.message}`,
                        5000
                    )
                } else {
                    showPopup(
                        'Lỗi',
                        'Phản hồi từ API không hợp lệ. Hãy thử lại!',
                        5000
                    )
                }
                currentRequest = null
                isProcessing = false // Mở khóa sau khi hoàn thành
            },
            onerror: function (error) {
                hideLoader()
                showPopup(
                    'Lỗi',
                    `Lỗi kết nối: ${
                        error.statusText || 'Không xác định'
                    }. Kiểm tra mạng hoặc API key!`,
                    5000
                )
                currentRequest = null
                isProcessing = false
            },
            ontimeout: function () {
                hideLoader()
                showPopup(
                    'Lỗi',
                    'Yêu cầu timeout. Vui lòng kiểm tra kết nối hoặc thử lại!',
                    5000
                )
                currentRequest = null
                isProcessing = false
            },
        })
    }

    // Hiển thị popup duy nhất
    function showPopup(title, content, autoClose = 0) {
        // Xóa popup cũ ngay lập tức
        closeAllPopups()
        currentPopup = document.createElement('div')
        currentPopup.className = 'summarizer-popup'
        currentPopup.innerHTML = `
            <div class="popup-header">
                <h2>${title}</h2>
                <div class="header-actions">
                    ${
                        title === 'Tóm tắt'
                            ? '<button class="copy-btn" title="Sao chép">📋</button>'
                            : ''
                    }
                    <button class="close-btn">×</button>
                </div>
            </div>
            <div class="${
                title === 'Tóm tắt' ? 'popup-content-summary' : 'popup-content'
            }">${content}</div>
            ${title === 'Tóm tắt' ? '' : '<div class="resize-handle"></div>'}
        `
        document.body.appendChild(currentPopup)

        // Hiệu ứng mở
        currentPopup.style.opacity = '0'
        currentPopup.style.transform = 'translate(-50%, -50%) scale(0.95)'
        requestAnimationFrame(() => {
            currentPopup.style.transition =
                'opacity 0.15s ease-out, transform 0.15s ease-out'
            currentPopup.style.opacity = '1'
            currentPopup.style.transform = 'translate(-50%, -50%) scale(1)'
        })

        currentPopup
            .querySelector('.close-btn')
            .addEventListener('click', () => closeAllPopups(true))

        if (title === 'Tóm tắt') {
            const copyBtn = currentPopup.querySelector('.copy-btn')
            copyBtn.addEventListener('click', () => {
                navigator.clipboard
                    .writeText(content)
                    .then(() => {
                        copyBtn.title = 'Đã sao chép!'
                        setTimeout(() => (copyBtn.title = 'Sao chép'), 2000)
                    })
                    .catch((err) => {
                        showPopup('Lỗi', 'Không thể sao chép: ' + err.message)
                    })
            })
        }

        if (title === 'Cài đặt') {
            const saveBtn = currentPopup.querySelector('.save-btn')
            if (saveBtn) saveBtn.addEventListener('click', saveSettings)
            const checkBtn = currentPopup.querySelector('.check-btn')
            checkBtn.addEventListener('click', () => {
                const testApiKey = document
                    .getElementById('apiKeyInput')
                    .value.trim()
                if (!testApiKey) {
                    showPopup('Lỗi', 'Vui lòng nhập API key để kiểm tra!')
                    return
                }
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${testApiKey}`,
                    headers: {'Content-Type': 'application/json'},
                    data: JSON.stringify({
                        contents: [{parts: [{text: 'Test'}]}],
                    }),
                    onload: function (response) {
                        const data = JSON.parse(response.responseText)
                        if (data.candidates) {
                            showPopup('Thành công', 'API key hợp lệ!')
                        } else {
                            showPopup(
                                'Lỗi',
                                'API key không hợp lệ. Vui lòng kiểm tra lại!'
                            )
                        }
                    },
                    onerror: function () {
                        showPopup(
                            'Lỗi',
                            'Không thể kiểm tra API key. Kiểm tra mạng hoặc key!'
                        )
                    },
                })
            })
        }

        const header = currentPopup.querySelector('.popup-header')
        header.addEventListener('mousedown', startDrag)
        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', stopDrag)

        const resizeHandle = currentPopup.querySelector('.resize-handle')
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', startResize)
            document.addEventListener('mousemove', resize)
            document.addEventListener('mouseup', stopResize)
        }

        document.body.style.pointerEvents = 'none'
        currentPopup.style.pointerEvents = 'auto'

        if (autoClose > 0) {
            setTimeout(() => {
                closeAllPopups(true) // Đóng với animation
                isProcessing = false // Mở khóa sau khi tự động đóng
            }, autoClose)
        }
    }

    // Đóng tất cả popup và loader
    function closeAllPopups(withAnimation = false) {
        if (currentPopup) {
            if (withAnimation) {
                // Đóng với animation (khi người dùng đóng thủ công)
                currentPopup.style.transition =
                    'opacity 0.15s ease-out, transform 0.15s ease-out'
                currentPopup.style.opacity = '0'
                currentPopup.style.transform =
                    'translate(-50%, -50%) scale(0.95)'
                setTimeout(() => {
                    currentPopup.remove()
                    currentPopup = null
                    document.body.style.pointerEvents = 'auto'
                    document.removeEventListener('mousemove', drag)
                    document.removeEventListener('mouseup', stopDrag)
                    document.removeEventListener('mousemove', resize)
                    document.removeEventListener('mouseup', stopResize)
                }, 150)
            } else {
                // Xóa ngay không animation (khi tạo popup mới)
                currentPopup.remove()
                currentPopup = null
                document.body.style.pointerEvents = 'auto'
                document.removeEventListener('mousemove', drag)
                document.removeEventListener('mouseup', stopDrag)
                document.removeEventListener('mousemove', resize)
                document.removeEventListener('mouseup', stopResize)
            }
        }
        hideLoader()
    }

    // Lấy nội dung cài đặt
    function getSettingsContent() {
        return `
            <div class="settings-container">
                <div class="settings-item">
                    <label>API Key:</label>
                    <div class="api-key-container">
                        <input type="text" id="apiKeyInput" placeholder="Dán API key vào đây" value="${API_KEY}" />
                        <button class="check-btn">Kiểm tra</button>
                    </div>
                </div>
                <div class="settings-item instruction">
                    <span>Lấy key tại: <a href="https://aistudio.google.com/apikey" target="_blank">Google AI Studio</a></span>
                </div>
                <div class="settings-item shortcut-section">
                    <label>Phím tắt:</label>
                    <div class="shortcut-controls">
                        <label><input type="radio" name="modifier" value="Alt" ${
                            modifierKeys.includes('Alt') ? 'checked' : ''
                        }> Alt</label>
                        <label><input type="radio" name="modifier" value="Ctrl" ${
                            modifierKeys.includes('Ctrl') ? 'checked' : ''
                        }> Ctrl</label>
                        <label><input type="radio" name="modifier" value="Shift" ${
                            modifierKeys.includes('Shift') ? 'checked' : ''
                        }> Shift</label>
                        <input type="text" id="shortcutKey" maxlength="1" placeholder="T" value="${shortcutKey.toUpperCase()}" />
                    </div>
                </div>
                <div class="settings-item button-container">
                    <button class="save-btn">
                        <svg class="save-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                        </svg>
                        Lưu
                    </button>
                </div>
            </div>
        `
    }

    // Lưu cài đặt và làm mới trang
    function saveSettings() {
        const apiKey = document.getElementById('apiKeyInput').value.trim()
        const selectedModifier = document.querySelector(
            'input[name="modifier"]:checked'
        )
        shortcutKey = document
            .getElementById('shortcutKey')
            .value.trim()
            .toLowerCase()

        if (!apiKey) {
            showPopup('Lỗi', 'Bạn chưa nhập API key! Hãy nhập để tiếp tục.')
            return
        }
        if (!shortcutKey) {
            showPopup('Lỗi', 'Bạn chưa nhập phím tắt! Hãy nhập một ký tự.')
            return
        }
        if (!selectedModifier) {
            showPopup(
                'Lỗi',
                'Bạn chưa chọn phím bổ trợ! Chọn Alt, Ctrl hoặc Shift.'
            )
            return
        }

        modifierKeys = [selectedModifier.value]
        GM_setValue('geminiApiKey', apiKey)
        GM_setValue('shortcutKey', shortcutKey)
        GM_setValue('modifierKeys', JSON.stringify(modifierKeys))
        API_KEY = apiKey
        closeAllPopups()
        showPopup(
            'Thành công',
            'Cài đặt đã được lưu! Trang sẽ làm mới sau 1 giây.'
        )
        setTimeout(() => location.reload(), 1000)
    }

    // Xử lý kéo popup
    function startDrag(e) {
        isDragging = true
        offsetX = e.clientX - currentPopup.offsetLeft
        offsetY = e.clientY - currentPopup.offsetTop
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault()
            currentPopup.style.left = `${e.clientX - offsetX}px`
            currentPopup.style.top = `${e.clientY - offsetY}px`
        }
    }

    function stopDrag() {
        isDragging = false
    }

    // Xử lý thay đổi kích thước (chỉ chiều ngang)
    function startResize(e) {
        isResizing = true
        initialWidth = currentPopup.offsetWidth
        resizeOffsetX = e.clientX - currentPopup.offsetLeft
    }

    function resize(e) {
        if (isResizing) {
            const newWidth =
                initialWidth +
                (e.clientX - (currentPopup.offsetLeft + resizeOffsetX))
            currentPopup.style.width = `${Math.max(newWidth, 400)}px`
        }
    }

    function stopResize() {
        isResizing = false
    }

    // Loader
    function showLoader() {
        const loader = document.createElement('div')
        loader.className = 'summarizer-loader'
        loader.innerHTML = '<div class="spinner"></div>'
        document.body.appendChild(loader)
    }

    function hideLoader() {
        const loader = document.querySelector('.summarizer-loader')
        if (loader) loader.remove()
    }

    // CSS
    const style = document.createElement('style')
    style.innerHTML = `
        .summarizer-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            min-width: 400px;
            height: 400px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            will-change: opacity, transform;
        }
        .popup-header {
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: #fff;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            flex-shrink: 0;
        }
        .popup-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            line-height: 1.0;
        }
        .header-actions {
            display: flex;
            gap: 12px;
        }
        .header-actions button {
            background: none;
            border: none;
            color: #fff;
            font-size: 22px;
            cursor: pointer;
            transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        }
        .header-actions button:hover {
            transform: scale(1.1);
            opacity: 0.9;
        }
        .copy-btn {
            font-size: 18px;
            padding: 2px;
            margin-left: 10px;
        }
        .popup-content {
            padding: 15px;
            font-size: 15px;
            color: #444;
            line-height: 1.2;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .popup-content-summary {
            padding: 15px;
            font-size: 15px;
            color: #444;
            line-height: 1.6;
            overflow-y: auto;
            white-space: pre-wrap;
            flex-grow: 1;
        }
        .settings-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .settings-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }
        .settings-item label {
            font-weight: 600;
            color: #333;
            line-height: 1.2;
        }
        .settings-item input[type="text"] {
            width: 80%;
            max-width: 300px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            text-align: center;
            background: #f9f9f9;
            transition: border-color 0.15s ease-out;
        }
        .settings-item input[type="text"]:focus {
            border-color: #4A90E2;
            outline: none;
        }
        .api-key-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .check-btn {
            padding: 8px;
            width: 80%;
            max-width: 300px;
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }
        .check-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
        }
        .instruction {
            font-size: 13px;
            color: #666;
            line-height: 1.2;
        }
        .instruction a {
            color: #4A90E2;
            text-decoration: none;
            transition: color 0.15s ease-out;
        }
        .instruction a:hover {
            color: #357ABD;
            text-decoration: underline;
        }
        .shortcut-section {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }
        .shortcut-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .shortcut-controls label {
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 14px;
            font-weight: 400;
            color: #444;
        }
        .shortcut-controls input[type="radio"] {
            margin: 0;
        }
        .shortcut-controls input[type="text"] {
            width: 40px;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            text-align: center;
            background: #f9f9f9;
            transition: border-color 0.15s ease-out;
        }
        .shortcut-controls input[type="text"]:focus {
            border-color: #4A90E2;
            outline: none;
        }
        .button-container {
            margin-top: 10px;
        }
        .save-btn {
            padding: 8px 20px;
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }
        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
        }
        .save-icon {
            width: 16px;
            height: 16px;
        }
        .history-item {
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
            font-size: 14px;
            color: #444;
        }
        .history-item:last-child {
            border-bottom: none;
        }
        .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: #4A90E2;
            cursor: se-resize;
            border-bottom-right-radius: 12px;
            transition: background 0.15s ease-out;
        }
        .resize-handle:hover {
            background: #357ABD;
        }
        .summarizer-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .spinner {
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top: 5px solid #4A90E2;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `
    document.head.appendChild(style)

    // Thêm font Roboto
    const fontLink = document.createElement('link')
    fontLink.href =
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    // Khởi chạy script
    initialize()
})()
