// ==UserScript==
// @name         TTV Auto Upload
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Công cụ đăng chương hiện đại cho Tàng Thư Viện với UI/UX được tối ưu
// @author       HA
// @match        https://tangthuvien.net/dang-chuong/story/*
// @match        https://tangthuvien.net/danh-sach-chuong/story/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @required     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/529207/TTV%20Auto%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/529207/TTV%20Auto%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('/danh-sach-chuong/story/')) {
        const storyId = window.location.pathname.split('/').pop();
        setTimeout(() => {
            window.location.href = `https://tangthuvien.net/dang-chuong/story/${storyId}`;
        }, 3000);
        return;
    }

    const HEADER_SIGN = "";
    const FOOTER_SIGN = "";
    const MAX_CHAPTER_POST = 10;
    GM_addStyle(`
        /* Vị trí và giao diện của công cụ đăng nhanh */
        #modern-uploader {
            background: linear-gradient(145deg, #ffffff, #f5f8ff);
            padding: 28px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            position: fixed;
            right: 25px;
            top: 50%;
            transform: translateY(-50%);
            width: 450px;
            max-height: 92vh;
            overflow-y: auto;
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #e0e0e0;
            transition: all 0.3s ease;
        }
        #modern-uploader:hover {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }
        #modern-uploader::-webkit-scrollbar {
            width: 8px;
        }
        #modern-uploader::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 8px;
        }
        #modern-uploader::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #4285f4, #34a853);
            border-radius: 8px;
        }
        #modern-uploader::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #1a73e8, #27833c);
        }
        @keyframes shortChapterBlink {
            0% { background-color: rgba(255, 0, 0, 0.1); }
            50% { background-color: rgba(255, 0, 0, 0.2); }
            100% { background-color: rgba(255, 0, 0, 0.1); }
        }
        textarea[name^="introduce"] {
            transition: all 0.3s ease;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
        }
        textarea[name^="introduce"].short-chapter {
            animation: shortChapterBlink 1s infinite;
            border: 2px solid #ff0000 !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
        .chapter-character-count {
            text-align: right;
            font-size: 12px;
            margin-top: 10px;
            color: #666;
            font-weight: 500;
        }
        .short-chapters-warning {
            color: #ff0000;
            font-weight: bold;
            animation: shortChapterBlink 1s infinite;
        }

        .button-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 14px;
            margin-top: 24px;
            flex-wrap: wrap;
        }
        #modern-uploader .btn {
            padding: 12px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 6px;
        }
        #modern-uploader .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 10px rgba(0,0,0,0.15);
        }
        #modern-uploader .btn:active {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #modern-uploader .btn-primary {
            background: linear-gradient(140deg, #4285f4, #1a73e8);
            color: white;
        }
        #modern-uploader .btn-success {
            background: linear-gradient(140deg, #34a853, #27833c);
            color: white;
        }
        #modern-uploader .btn-danger {
            background: linear-gradient(140deg, #ea4335, #d32f2f);
            color: white;
        }
        #modern-uploader .btn-secondary {
            background: linear-gradient(140deg, #9e9e9e, #757575);
            color: white;
        }
        #modern-uploader .btn-warning {
            background: linear-gradient(140deg, #fbbc05, #f5a623);
            color: #212529;
        }
        #modern-uploader .btn-info {
            background: linear-gradient(140deg, #17a2b8, #0097a7);
            color: white;
        }
        #modern-uploader .form-control {
            width: 100%;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 10px;
            margin-bottom: 18px;
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #modern-uploader .form-control:focus {
            border-color: #4285f4;
            outline: none;
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
        }
        #modern-uploader .loading-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        }
        #modern-uploader .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #ffffff;
            animation: spin 1s linear infinite;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* Checkbox tự động */
        #modern-uploader .checkbox-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            background: linear-gradient(145deg, #f8f9fa, #f1f3f5);
            border-radius: 12px;
            padding: 14px;
            border: 1px solid #e9ecef;
            position: relative;
            overflow: hidden;
        }
        #modern-uploader .checkbox-container::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 3px;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335);
            opacity: 0.7;
        }
        #qpOptionLoop {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #4285f4;
        }
        /* Header styling */
        #modern-uploader .text-center {
            text-align: center;
        }
        #modern-uploader .uploader-header {
            margin-bottom: 25px;
            position: relative;
        }
        #modern-uploader .uploader-header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #4285f4, transparent);
            border-radius: 3px;
        }
        #modern-uploader h3 {
            color: #4285f4;
            font-weight: 700;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 0;
            padding: 0;
            letter-spacing: 0.5px;
        }
        /* Notification styling */
        #modern-uploader .notification-container {
            width: 100%;
            padding: 14px 0;
            margin-top: 18px;
            text-align: left;
            border-top: 1px solid rgba(0,0,0,0.06);
        }
        #modern-uploader .notification-success,
        #modern-uploader .notification-error,
        #modern-uploader .notification-warning,
        #modern-uploader .notification-info {
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            display: inline-block;
            max-width: 100%;
            margin: 0;
            word-break: break-word;
            animation: fadeInUp 0.4s ease;
            line-height: 1.5;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #modern-uploader .notification-success {
            background: linear-gradient(145deg, #e8f5e9, #c8e6c9);
            color: #2e7d32;
            border-left: 4px solid #4caf50;
        }
        #modern-uploader .notification-error {
            background: linear-gradient(145deg, #ffebee, #ffcdd2);
            color: #c62828;
            border-left: 4px solid #f44336;
        }
        #modern-uploader .notification-warning {
            background: linear-gradient(145deg, #fff8e1, #ffecb3);
            color: #f57f17;
            border-left: 4px solid #ffb300;
        }
        #modern-uploader .notification-info {
            background: linear-gradient(145deg, #e3f2fd, #bbdefb);
            color: #1565c0;
            border-left: 4px solid #2196f3;
        }
        /* Google-style waves */
        @keyframes wave-animation {
            0% {transform: translateX(-100%);}
            100% {transform: translateX(100%);}
        }
        #modern-uploader .wave-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            overflow: hidden;
            z-index: 1;
        }
        #modern-uploader .wave-bottom::after {
            content: '';
            position: absolute;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(66, 133, 244, 0.3), transparent);
            animation: wave-animation 2s infinite linear;
        }
    `);

    function showNotification(message, type) {
        jQuery('#modern-uploader .notification-container').remove();
        const container = jQuery("<div>", {
            class: "notification-container"
        });
        const notification = jQuery("<div>", {
            class: `notification-${type}`
        });
        const lines = message.split('\n');
        lines.forEach((line, index) => {
            notification.append(jQuery("<div>").html(line));
        });
        container.append(notification);
        jQuery("#modern-uploader .button-container").after(container);
        notification.fadeIn(300);
    }

    function createChapterHTML(chapNum) {
        const chap_vol = parseInt(jQuery('.chap_vol').val()) || 1;
        const chap_vol_name = jQuery('.chap_vol_name').val() || '';
        return `
        <div data-gen="MK_GEN" id="COUNT_CHAP_${chapNum}_MK">
            <div class="col-xs-12 form-group"></div>
            <div class="form-group">
                <label class="col-sm-2" for="chap_stt">STT</label>
                <div class="col-sm-8">
                    <input class="form-control" required name="chap_stt[${chapNum}]" value="${dangNhanhTTV.STATE.CHAP_STT}" placeholder="Số thứ tự của chương" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="chap_number">Chương thứ..</label>
                <div class="col-sm-8">
                    <input value="${dangNhanhTTV.STATE.CHAP_SERIAL}" required class="form-control" name="chap_number[${chapNum}]" placeholder="Chương thứ.. (1,2,3..)" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="chap_name">Quyển số</label>
                <div class="col-sm-8">
                    <input class="form-control" name="vol[${chapNum}]" placeholder="Quyển số" type="number" value="${chap_vol}" required/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="chap_name">Tên quyển</label>
                <div class="col-sm-8">
                    <input class="form-control chap_vol_name" name="vol_name[${chapNum}]" placeholder="Tên quyển" type="text" value="${chap_vol_name}" />
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="chap_name">Tên chương</label>
                <div class="col-sm-8">
                    <input required class="form-control" name="chap_name[${chapNum}]" placeholder="Tên chương" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="introduce">Nội dung</label>
                <div class="col-sm-8">
                    <textarea maxlength="75000" style="color:#000;font-weight: 400;" required class="form-control" name="introduce[${chapNum}]" rows="20" placeholder="Nội dung" type="text"></textarea>
                    <div class="chapter-character-count"></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2" for="adv">Quảng cáo</label>
                <div class="col-sm-8">
                    <textarea maxlength="1000" class="form-control" name="adv[${chapNum}]" placeholder="Quảng cáo" type="text"></textarea>
                </div>
            </div>
        </div>`;
    }

    function setupCharacterCounter() {
        jQuery(document).on("input", "[name^=introduce]", function() {
            const text = jQuery(this).val();
            const charCount = text.length;
            let charCountElement = jQuery(this).next('.chapter-character-count');
            if (charCountElement.length === 0) {
                charCountElement = jQuery('<div class="chapter-character-count"></div>');
                jQuery(this).after(charCountElement);
            }
            if(charCount < 3000) {
                jQuery(this).addClass('short-chapter');
                charCountElement.html(`<span class="short-chapters-warning">${charCount.toLocaleString()}/40.000 ký tự</span>`);
            } else {
                jQuery(this).removeClass('short-chapter');
                if(charCount > 40000) {
                    charCountElement.html(`<span style="color: #fbbc05;">${charCount.toLocaleString()}/40.000 ký tự</span>`);
                } else {
                    charCountElement.html(`<span style="color: #34a853;">${charCount.toLocaleString()}/40.000 ký tự</span>`);
                }
            }
        });
    }

    function validateChapterLengths() {
        let hasError = false;
        jQuery('form[name="postChapForm"] .chapter-detail').each(function() {
            const form = this;
            const contentTextarea = form.querySelector('textarea[name^="introduce"]');
            const content = contentTextarea.value;
            if (content.length < 3000) {
                jQuery(contentTextarea).addClass('short-chapter');
                let warningIcon = form.querySelector('.warning-icon');
                if (!warningIcon) {
                    warningIcon = document.createElement('div');
                    warningIcon.className = 'warning-icon';
                    warningIcon.innerHTML = '⚠️';
                    contentTextarea.parentNode.appendChild(warningIcon);
                }
                hasError = true;
            } else {
                jQuery(contentTextarea).removeClass('short-chapter');
                const warningIcon = form.querySelector('.warning-icon');
                if (warningIcon) {
                    warningIcon.remove();
                }
            }
        });
        return !hasError;
    }

    const dangNhanhTTV = {
        STATE: {
            CHAP_NUMBER: 1,
            CHAP_STT: 1,
            CHAP_SERIAL: 1,
            CHAP_NUMBER_ORIGINAL: 1,
            CHAP_STT_ORIGINAL: 1,
            CHAP_SERIAL_ORIGINAL: 1,
            AUTO_POST: false,
            TOTAL_CHAPTERS: 0,
            POSTED_CHAPTERS: 0
        },
        ELEMENTS: {
            qpContent: null,
            qpButtonSubmit: null,
            qpButtonRemoveEmpty: null,
            qpButtonReset: null,
            qpButtonPaste: null,
            qpButtonAutoPost: null,
            qpOptionLoop: null
        },
        init: function() {
            try {
                console.log('[TTV-DEBUG] Script bắt đầu khởi tạo...');
                console.log('[TTV-DEBUG] Phiên bản script: 3.0');
                this.initializeChapterValues();
                console.log('[TTV-DEBUG] Đã khởi tạo giá trị chương');

                // Khôi phục trạng thái tự động đăng
                this.loadAutoPostState();
                console.log('[TTV-DEBUG] Đã khôi phục trạng thái tự động đăng');

                this.createInterface();
                console.log('[TTV-DEBUG] Đã tạo giao diện');
                this.cacheElements();
                console.log('[TTV-DEBUG] Đã cache các elements');
                this.registerEvents();
                console.log('[TTV-DEBUG] Đã đăng ký các events');
                console.log('[TTV-DEBUG] Script đã khởi động thành công');
                showNotification('Công cụ đã chạy thành công', 'success');

                // Cập nhật hiển thị nút tự động đăng
                if (this.STATE.AUTO_POST) {
                    this.ELEMENTS.qpButtonAutoPost.text(`🔄 TỰ ĐỘNG (${this.STATE.POSTED_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS})`);
                    this.ELEMENTS.qpButtonAutoPost.removeClass('btn-warning').addClass('btn-info');
                }

                // Khôi phục trạng thái chế độ tự động đăng
                const isAutoMode = localStorage.getItem('TTV_AUTO_MODE') === 'true';
                if (isAutoMode) {
                    this.ELEMENTS.qpOptionLoop.prop('checked', true);
                    this.toggleAutoMode(); // Áp dụng giao diện theo chế độ
                }
            } catch (e) {
                console.error('[TTV-ERROR] Lỗi khởi tạo:', e);
                showNotification('Có lỗi khi khởi tạo Script', 'error');
            }
        },

        loadAutoPostState: function() {
            // Khôi phục trạng thái tự động đăng từ localStorage
            const autoPost = localStorage.getItem('TTV_AUTO_POST') === 'true';
            this.STATE.AUTO_POST = autoPost;

            if (autoPost) {
                this.STATE.TOTAL_CHAPTERS = parseInt(localStorage.getItem('TTV_TOTAL_CHAPTERS') || '0');
                this.STATE.POSTED_CHAPTERS = parseInt(localStorage.getItem('TTV_POSTED_CHAPTERS') || '0');

                console.log(`[TTV-DEBUG] Khôi phục tự động đăng: ${this.STATE.POSTED_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS}`);
            }
        },

        createInterface: function() {
            const html = `
            <div id="modern-uploader">
                <div class="uploader-header">
                    <h3>📚 CÔNG CỤ ĐĂNG CHƯƠNG</h3>
                </div>
                <div class="form-group">
                    <textarea placeholder="Nội dung truyện (Dán vào đây để tự động tách chương)" id="qpContent" class="form-control" rows="5"></textarea>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="qpOptionLoop">
                    <label for="qpOptionLoop" style="color: #1a73e8; font-weight: 600; margin-left: 8px;">Chế độ tự động đăng</label>
                </div>
                <div class="button-container">
                    <button class="btn btn-primary" id="qpButtonPaste">📋 Dán nội dung</button>
                    <button class="btn btn-success" id="qpButtonSubmit">📤 Đăng chương</button>
                    <button class="btn btn-danger" id="qpButtonRemoveEmpty" style="display: none;">🗑️ Ẩn chương trống</button>
                    <button class="btn btn-warning" id="qpButtonAutoPost" style="display: none;">🔄 TỰ ĐỘNG (TẮT)</button>
                    <button class="btn btn-secondary" id="qpButtonReset" style="display: none;">🔁 Reset đếm</button>
                </div>
                <div class="notification-container"></div>
                <div class="wave-bottom"></div>
            </div>`;

            jQuery(".list-in-user").before(html);
        },

        initializeChapterValues: function() {
            try {
                const chap_number = parseInt(jQuery('#chap_number').val());
                let chap_stt = parseInt(jQuery('.chap_stt1').val());
                let chap_serial = parseInt(jQuery('.chap_serial').val());

                if (parseInt(jQuery('#chap_stt').val()) > chap_stt) {
                    chap_stt = parseInt(jQuery('#chap_stt').val());
                }
                if (parseInt(jQuery('#chap_serial').val()) > chap_serial) {
                    chap_serial = parseInt(jQuery('#chap_serial').val());
                }

                this.STATE.CHAP_NUMBER = this.STATE.CHAP_NUMBER_ORIGINAL = chap_number || 1;
                this.STATE.CHAP_STT = this.STATE.CHAP_STT_ORIGINAL = chap_stt || 1;
                this.STATE.CHAP_SERIAL = this.STATE.CHAP_SERIAL_ORIGINAL = chap_serial || 1;
            } catch (e) {
                console.error("Error initializing chapter values:", e);
            }
        },

        cacheElements: function() {
            this.ELEMENTS.qpContent = jQuery("#qpContent");
            this.ELEMENTS.qpButtonSubmit = jQuery("#qpButtonSubmit");
            this.ELEMENTS.qpButtonRemoveEmpty = jQuery("#qpButtonRemoveEmpty");
            this.ELEMENTS.qpButtonPaste = jQuery("#qpButtonPaste");
            this.ELEMENTS.qpButtonAutoPost = jQuery("#qpButtonAutoPost");
            this.ELEMENTS.qpButtonReset = jQuery("#qpButtonReset");
            this.ELEMENTS.qpOptionLoop = jQuery("#qpOptionLoop");
        },

        registerEvents: function() {
            this.ELEMENTS.qpContent.on("paste", this.handlePaste.bind(this));
            this.ELEMENTS.qpButtonRemoveEmpty.on('click', this.removeEmptyChapters.bind(this));
            this.ELEMENTS.qpButtonSubmit.on('click', this.submitChapters.bind(this));
            this.ELEMENTS.qpButtonPaste.on('click', this.handlePasteButton.bind(this));
            this.ELEMENTS.qpButtonAutoPost.on('click', this.toggleAutoPost.bind(this));
            this.ELEMENTS.qpButtonReset.on('click', this.resetAutoPost.bind(this));
            this.ELEMENTS.qpOptionLoop.on('change', this.toggleAutoMode.bind(this));
            setupCharacterCounter();

            // Kiểm tra và bắt đầu tự động đăng nếu đã bật
            if (window.location.href.includes('/dang-chuong/story/')) {
                setTimeout(() => {
                    if (this.STATE.AUTO_POST && this.STATE.POSTED_CHAPTERS < this.STATE.TOTAL_CHAPTERS) {
                        this.runAutoPostSequence();
                    }
                }, 2000);
            }
        },

        handlePasteButton: function() {
            this.showLoading();
            navigator.clipboard.readText()
                .then(text => {
                    this.ELEMENTS.qpContent.val(text);
                    setTimeout(() => {
                        this.performAction();
                        this.hideLoading();
                    }, 100);
                })
                .catch(err => {
                    console.error('Không thể đọc dữ liệu từ clipboard:', err);
                    this.hideLoading();
                    showNotification('Không thể truy cập clipboard. Vui lòng dán trực tiếp vào ô nội dung.', 'error');
                });
        },

        handlePaste: function(e) {
            e.preventDefault();
            this.ELEMENTS.qpContent.val("");
            this.showLoading();
            const pastedText = e.originalEvent.clipboardData.getData('text');
            this.ELEMENTS.qpContent.val(pastedText);
            setTimeout(() => {
                this.performAction();
                this.hideLoading();
            }, 100);
        },

        performAction: function() {
            try {
                console.log("Starting performAction");
                var text = this.ELEMENTS.qpContent.val();

                if (!text) {
                    showNotification('Không có nội dung để tách chương', 'error');
                    return 0;
                }
                var debugOutput = [];
                var chapters = [];
                var lines = text.split('\n');
                var currentChapter = [];
                var lastTitle = null;
                debugOutput.push("=== Processing Text ===");
                debugOutput.push(`Total lines: ${lines.length}`);
                debugOutput.push("=== Line Analysis ===");
                function visualizeWhitespace(str) {
                    return str.split('').map(c => {
                        if (c === '\t') return '\\t';
                        if (c === ' ') return '·';
                        if (c === '\n') return '\\n';
                        return c;
                    }).join('');
                }

                // Hàm lấy mã chương dựa vào tiêu đề
                function getChapterCode(title) {
                    // Lấy số chương + tên chương, bỏ qua các ký tự đặc biệt
                    const match = title.match(/[Cc]hương\s*(\d+)\s*:/);
                    if (!match) return title.trim();
                    const chapterNum = match[1];
                    return `chap_${chapterNum}`;
                }

                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    let isChapterTitle = /^\t[Cc]hương\s*\d+\s*:/.test(line) || /^\s{4,}[Cc]hương\s*\d+\s*:/.test(line);
                    debugOutput.push(`Line ${i}: ${visualizeWhitespace(line.substring(0, 50))}${line.length > 50 ? '...' : ''}`);
                    debugOutput.push(`  Is chapter: ${isChapterTitle}`);

                    if (isChapterTitle) {
                        // Lấy mã chương để so sánh
                        const currentChapterCode = getChapterCode(line);
                        const lastTitleCode = lastTitle ? getChapterCode(lastTitle) : null;

                        if (currentChapter.length > 0) {
                            // Kiểm tra nếu chương hiện tại khác chương trước đó
                            if (currentChapterCode !== lastTitleCode) {
                                chapters.push(currentChapter.join('\n'));
                                currentChapter = [line];
                                lastTitle = line;
                                debugOutput.push(`  -> New chapter started: ${currentChapterCode}`);
                            } else {
                                debugOutput.push(`  -> Skipped duplicate chapter: ${currentChapterCode}`);
                                // Không cần thêm dòng này vào chapter hiện tại vì nó là tiêu đề trùng lặp
                            }
                        } else {
                            currentChapter = [line];
                            lastTitle = line;
                            debugOutput.push(`  -> First chapter started: ${currentChapterCode}`);
                        }
                    } else if (currentChapter.length > 0) {
                        currentChapter.push(line);
                    }
                }
                if (currentChapter.length > 0) {
                    chapters.push(currentChapter.join('\n'));
                    debugOutput.push("-> Added final chapter");
                }
                debugOutput.push("=== Results ===");
                debugOutput.push(`Found ${chapters.length} chapters`);
                const processedChapters = [];
                for (let i = 0; i < chapters.length; i++) {
                    const chapterLines = chapters[i].split('\n');
                    const title = chapterLines.shift().trim();
                    const chapterText = chapterLines.join('\n');
                    const charCount = chapterText.length;
                    debugOutput.push(`Chapter ${i+1} character count: ${charCount}`);
                    if (charCount > 40000) {
                        const parts = Math.ceil(charCount / 40000);
                        debugOutput.push(`Splitting into ${parts} parts`);
                        const charsPerPart = Math.ceil(charCount / parts);
                        debugOutput.push(`Characters per part: ~${charsPerPart}`);
                        let currentText = chapterText;
                        let totalProcessed = 0;
                        for (let part = 0; part < parts; part++) {
                            const isLastPart = part === parts - 1;
                            const targetSize = isLastPart ? currentText.length : charsPerPart;
                            let endPos = Math.min(targetSize, currentText.length);
                            if (!isLastPart && endPos < currentText.length) {
                                const nextParagraph = currentText.indexOf('\n\n', endPos - 500);
                                if (nextParagraph !== -1 && nextParagraph < endPos + 500) {
                                    endPos = nextParagraph + 2;
                                } else {
                                    const sentenceEnd = Math.max(
                                        currentText.lastIndexOf('. ', endPos),
                                        currentText.lastIndexOf('! ', endPos),
                                        currentText.lastIndexOf('? ', endPos)
                                    );
                                    if (sentenceEnd !== -1 && sentenceEnd > endPos - 500) {
                                        endPos = sentenceEnd + 2;
                                    }
                                }
                            }
                            const partContent = currentText.substring(0, endPos);
                            totalProcessed += partContent.length;
                            currentText = currentText.substring(endPos);
                            let chapterTitle = title;
                            if (title.includes(':')) {
                                chapterTitle = title.substring(title.indexOf(':') + 1).trim();
                            }
                            let newTitle = `${title} (Phần ${part+1}/${parts})`;
                            processedChapters.push(newTitle + '\n' + partContent);
                            debugOutput.push(`Part ${part+1}: ${partContent.length} chars`);
                        }
                        debugOutput.push(`Total processed: ${totalProcessed}/${charCount} chars`);
                    } else {
                        processedChapters.push(chapters[i]);
                    }
                }
                debugOutput.push(`After processing: ${processedChapters.length} chapters`);
                const chaptersToFill = processedChapters.slice(0, MAX_CHAPTER_POST);
                const remainingChapters = processedChapters.slice(MAX_CHAPTER_POST);
                var titles = jQuery("input[name^='chap_name']");
                var contents = jQuery("textarea[name^='introduce']");
                var advs = jQuery("textarea[name^='adv']");
                debugOutput.push(`Forms found: ${titles.length}`);
                if (processedChapters.length === 0) {
                    showNotification('Không tìm thấy chương nào', 'error');
                    jQuery('#debug-output').text(debugOutput.join('\n'));
                    return;
                }
                if (remainingChapters.length > 0) {
                    debugOutput.push(`${remainingChapters.length} chapters will be copied to clipboard`);
                }
                const neededForms = chaptersToFill.length - titles.length;
                if (neededForms > 0 && titles.length < MAX_CHAPTER_POST) {
                    debugOutput.push(`Need to add ${neededForms} more forms`);
                    for (let i = 0; i < neededForms && (titles.length + i) < MAX_CHAPTER_POST; i++) {
                        this.addNewChapter();
                    }
                    titles = jQuery("input[name^='chap_name']");
                    contents = jQuery("textarea[name^='introduce']");
                    advs = jQuery("textarea[name^='adv']");
                }
                debugOutput.push(`Filling ${chaptersToFill.length} chapters into forms`);
                jQuery.each(titles, function(k, v) {
                    if (k < chaptersToFill.length) {
                        var content = chaptersToFill[k].split('\n');
                        var title = content.shift().trim();
                        var chapterTitle = title;
                        if (title.includes(':')) {
                            chapterTitle = title.substring(title.indexOf(':') + 1).trim();
                        }
                        debugOutput.push(`\nFilling chapter ${k + 1}:`);
                        debugOutput.push(`Original title: ${title}`);
                        debugOutput.push(`Extracted title: ${chapterTitle}`);
                        debugOutput.push(`Content length: ${content.length} lines`);
                        if (!chapterTitle || chapterTitle.trim() === '') {
                            chapterTitle = "Vô đề";
                            debugOutput.push(`Empty title detected, using default: ${chapterTitle}`);
                        }
                        titles[k].value = chapterTitle;
                        contents[k].value = HEADER_SIGN + "\r\n" + content.join('\n') + "\r\n" + FOOTER_SIGN;
                        if (advs[k]) advs[k].value = "";
                        jQuery(contents[k]).trigger('input');
                    }
                });
                if (remainingChapters.length > 0) {
                    try {
                        const clipboardContent = remainingChapters.map(chap => {
                            const lines = chap.trim().split('\n');
                            if (lines.length > 0) {
                                if (!lines[0].startsWith('\t')) {
                                    lines[0] = '\t' + lines[0];
                                }
                            }
                            return lines.join('\n');
                        }).join('\n\n---CHAPTER_SEPARATOR---\n\n');
                        let splitChapters = 0;
                        let shortChapters = 0;
                        let shortChapterDetails = [];
                        let longChapterDetails = [];
                        for (let i = 0; i < chapters.length; i++) {
                            const chapterLines = chapters[i].split('\n');
                            const title = chapterLines.shift().trim();
                            const chapterText = chapterLines.join('\n');
                            if (chapterText.length > 40000) {
                                splitChapters++;
                                const partsCount = Math.ceil(chapterText.length / 40000);
                                longChapterDetails.push({
                                    title: title,
                                    parts: partsCount
                                });
                            }
                            if (chapterText.length < 3000) {
                                shortChapters++;
                                shortChapterDetails.push({
                                    title: title,
                                    length: chapterText.length
                                });
                            }
                        }
                        const splittedChaptersCount = processedChapters.length - (chapters.length - splitChapters);
                        let message = '';
                        message = message.concat(`📝 Đã xử lý ${processedChapters.length} Chương\n`);
                        message = message.concat(`📝 Đã nhập ${Math.min(processedChapters.length, MAX_CHAPTER_POST)} Chương\n`);

                        if (remainingChapters.length > 0) {
                            message = message.concat(`📋 Đã lưu lại ${remainingChapters.length} Chương\n`);
                        }
                        if (splitChapters > 0) {
                            message = message.concat(`📑 Có ${splitChapters} Chương đã chia thành ${splittedChaptersCount} Chương\n`);
                            longChapterDetails.forEach(chapter => {
                                let chapterName = chapter.title;
                                if (chapterName.includes(':')) {
                                    chapterName = chapterName.trim();
                                }
                                message = message.concat(` - ${chapterName}: ${chapter.parts} Chương\n`);
                            });
                        }
                        if (shortChapters > 0) {
                            message = message.concat(`⚠️<span class="short-chapters-warning">Có ${shortChapters} chương dưới 3000 ký tự</span>\n`);
                            shortChapterDetails.forEach(chapter => {
                                let chapterName = chapter.title;
                                if (chapterName.includes(':')) {
                                    chapterName = chapterName.trim();
                                }
                                message = message.concat(`<span class="short-chapters-warning"> - ${chapterName}: có ${chapter.length.toLocaleString()} ký tự</span>\n`);
                            });
                        }
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(clipboardContent)
                                .then(() => {
                                    debugOutput.push(`📋Đã lưu lại ${remainingChapters.length} Chương\n`);
                                    showNotification(message, remainingChapters.length > 0 ? 'warning' : 'success');
                                })
                                .catch(err => {
                                    throw err;
                                });
                        } else {
                            const tempTextarea = document.createElement('textarea');
                            tempTextarea.style.position = 'fixed';
                            tempTextarea.style.top = '0';
                            tempTextarea.style.left = '0';
                            tempTextarea.style.width = '2em';
                            tempTextarea.style.height = '2em';
                            tempTextarea.style.opacity = '0';
                            tempTextarea.style.pointerEvents = 'none';
                            tempTextarea.value = clipboardContent;
                            document.body.appendChild(tempTextarea);
                            tempTextarea.focus();
                            tempTextarea.select();
                            const successful = document.execCommand('copy');
                            document.body.removeChild(tempTextarea);
                            if (!successful) {
                                throw new Error('Không thể sao chép vào clipboard');
                            }
                            debugOutput.push(`Đã sao chép ${remainingChapters.length} chương vào clipboard (execCommand)`);
                            showNotification(message, 'success');
                        }
                    } catch (err) {
                        console.error('Lỗi khi sao chép vào clipboard:', err);
                        debugOutput.push(`Lỗi khi sao chép vào clipboard: ${err.message}`);
                        showNotification('Không thể sao chép vào clipboard. Vui lòng thử lại.', 'error');
                        const manualCopyArea = document.createElement('div');
                        manualCopyArea.style.position = 'fixed';
                        manualCopyArea.style.top = '50%';
                        manualCopyArea.style.left = '50%';
                        manualCopyArea.style.transform = 'translate(-50%, -50%)';
                        manualCopyArea.style.backgroundColor = 'white';
                        manualCopyArea.style.padding = '20px';
                        manualCopyArea.style.borderRadius = '8px';
                        manualCopyArea.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        manualCopyArea.style.zIndex = '10000';
                        manualCopyArea.style.maxWidth = '80%';
                        manualCopyArea.style.maxHeight = '80%';
                        manualCopyArea.style.overflow = 'auto';
                        manualCopyArea.innerHTML = `
                            <h3 style="margin-top: 0;">Sao chép thủ công</h3>
                            <p>Không thể sao chép tự động. Vui lòng chọn toàn bộ nội dung bên dưới và sao chép (Ctrl+C):</p>
                            <textarea style="width: 100%; height: 300px; padding: 10px;">${clipboardContent}</textarea>
                            <div style="text-align: right; margin-top: 10px;">
                                <button id="closeManualCopy" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Đóng</button>
                            </div>
                        `;
                        document.body.appendChild(manualCopyArea);
                        document.getElementById('closeManualCopy').addEventListener('click', () => {
                            document.body.removeChild(manualCopyArea);
                        });
                    }
                }
                this.ELEMENTS.qpButtonSubmit.removeClass("btn-disable").addClass("btn-success");
                this.ELEMENTS.qpContent.val("Đã xử lý xong");
                if (remainingChapters.length === 0) {
                    let splitChapters = 0;
                    let shortChapters = 0;
                    let shortChapterDetails = [];
                    let longChapterDetails = [];
                    for (let i = 0; i < chapters.length; i++) {
                        const chapterLines = chapters[i].split('\n');
                        const title = chapterLines.shift().trim();
                        const chapterText = chapterLines.join('\n');
                        if (chapterText.length > 40000) {
                            splitChapters++;
                            const partsCount = Math.ceil(chapterText.length / 40000);
                            longChapterDetails.push({
                                title: title,
                                parts: partsCount
                            });
                        }
                        if (chapterText.length < 3000) {
                            shortChapters++;
                            shortChapterDetails.push({
                                title: title,
                                length: chapterText.length
                            });
                        }
                    }
                    const splittedChaptersCount = processedChapters.length - (chapters.length - splitChapters);
                    let message = '';
                    message = message.concat(`📝 Đã xử lý ${processedChapters.length} Chương\n`);
                    message = message.concat(`📝 Đã nhập ${Math.min(processedChapters.length, MAX_CHAPTER_POST)} Chương\n`);
                    if (splitChapters > 0) {
                        message = message.concat(`📑 Có ${splitChapters} Chương dài chia thành ${splittedChaptersCount} Chương\n`);
                        longChapterDetails.forEach(chapter => {
                            let chapterName = chapter.title;
                            if (chapterName.includes(':')) {
                                chapterName = chapterName.trim();
                            }
                            message = message.concat(` - ${chapterName}: ${chapter.parts} Chương\n`);
                        });
                    }
                    if (shortChapters > 0) {
                        message = message.concat(`⚠️<span class="short-chapters-warning">Có ${shortChapters} chương dưới 3000 ký tự</span>\n`);
                        shortChapterDetails.forEach(chapter => {
                            let chapterName = chapter.title;
                            if (chapterName.includes(':')) {
                                chapterName = chapterName.trim();
                            }
                            message = message.concat(`<span class="short-chapters-warning"> - ${chapterName}: có ${chapter.length.toLocaleString()} ký tự</span>\n`);
                        });
                    }
                    showNotification(message, 'success');
                }
                jQuery('#debug-output').text(debugOutput.join('\n'));
                return processedChapters.length;
            } catch (e) {
                console.error("Error in performAction:", e);
                showNotification('Có lỗi khi tách chương', 'error');
                return 0;
            }
        },

        removeEmptyChapters: function() {
            const forms = document.querySelectorAll('[data-gen="MK_GEN"]');
            let removed = 0;

            forms.forEach(form => {
                const content = form.querySelector('textarea[name^="introduce"]').value.trim();
                if (!content) {
                    form.remove();
                    removed++;
                    this.updateChapNumber(false);
                }
            });
            showNotification(`🧹 Đã xử lý ${forms.length} chương, xóa ${removed} chương trống`, 'info');
        },

        toggleAutoPost: function() {
            this.STATE.AUTO_POST = !this.STATE.AUTO_POST;

            if (this.STATE.AUTO_POST) {
                // Lưu trạng thái tự động đăng vào localStorage
                localStorage.setItem('TTV_AUTO_POST', 'true');
                this.STATE.TOTAL_CHAPTERS = parseInt(prompt("Nhập tổng số lần tự động đăng:", "10")) || 0;
                this.STATE.POSTED_CHAPTERS = parseInt(localStorage.getItem('TTV_POSTED_CHAPTERS') || '0');

                localStorage.setItem('TTV_TOTAL_CHAPTERS', this.STATE.TOTAL_CHAPTERS.toString());

                this.ELEMENTS.qpButtonAutoPost.text(`🔄 TỰ ĐỘNG (${this.STATE.POSTED_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS})`);
                this.ELEMENTS.qpButtonAutoPost.removeClass('btn-warning').addClass('btn-info');

                showNotification(`✅ Đã bật tự động đăng (${this.STATE.POSTED_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS})`, 'success');

                // Bắt đầu quy trình tự động
                if (window.location.href.includes('/dang-chuong/story/')) {
                    setTimeout(() => this.runAutoPostSequence(), 2000);
                }
            } else {
                // Tắt tự động đăng
                localStorage.setItem('TTV_AUTO_POST', 'false');
                // Reset số lần đã đăng về 0
                this.STATE.POSTED_CHAPTERS = 0;
                localStorage.setItem('TTV_POSTED_CHAPTERS', '0');
                // Reset tổng số lần đăng về 0
                this.STATE.TOTAL_CHAPTERS = 0;
                localStorage.setItem('TTV_TOTAL_CHAPTERS', '0');
                this.ELEMENTS.qpButtonAutoPost.text('🔄 TỰ ĐỘNG (TẮT)');
                this.ELEMENTS.qpButtonAutoPost.removeClass('btn-info').addClass('btn-warning');
                showNotification('❌ Đã tắt tự động đăng và reset số lần đăng', 'info');
            }
        },

        runAutoPostSequence: function() {
            // Kiểm tra trước khi chạy tự động
            if (this.STATE.POSTED_CHAPTERS >= this.STATE.TOTAL_CHAPTERS) {
                // Reset trạng thái tự động nếu đã hoàn thành
                this.STATE.AUTO_POST = false;
                localStorage.setItem('TTV_AUTO_POST', 'false');
                this.ELEMENTS.qpButtonAutoPost.text('🔄 TỰ ĐỘNG (TẮT)');
                this.ELEMENTS.qpButtonAutoPost.removeClass('btn-info').addClass('btn-warning');

                // Reset số lần đã đăng
                this.STATE.POSTED_CHAPTERS = 0;
                localStorage.setItem('TTV_POSTED_CHAPTERS', '0');

                showNotification(`🎉 Đã hoàn thành tự động đăng ${this.STATE.TOTAL_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS} chương và đã reset số lần đăng`, 'success');
                return;
            }

            if (!this.STATE.AUTO_POST) {
                return;
            }

            // Tự động nhấn nút Paste sau 2 giây
            setTimeout(() => {
                if (this.STATE.AUTO_POST) {
                    this.handlePasteButton();

                    // Tự động nhấn nút Đăng chương sau 3 giây
                    setTimeout(() => {
                        if (this.STATE.AUTO_POST) {
                            this.submitChapters();
                        }
                    }, 3000);
                }
            }, 2000);
        },

        submitChapters: function() {
            if (!validateChapterLengths()) {
                showNotification('⚠️ Có chương có độ dài dưới 3000 ký tự. Vui lòng kiểm tra lại.', 'error');
                return;
            }
            this.showLoading();
            document.querySelector('form[name="postChapForm"] button[type="submit"]').click();

            if (this.STATE.AUTO_POST) {
                // Cập nhật số chương đã đăng
                this.STATE.POSTED_CHAPTERS++;
                localStorage.setItem('TTV_POSTED_CHAPTERS', this.STATE.POSTED_CHAPTERS.toString());

                // Kiểm tra và tắt tự động đăng nếu đã đủ số chương
                if (this.STATE.POSTED_CHAPTERS >= this.STATE.TOTAL_CHAPTERS) {
                    this.STATE.AUTO_POST = false;
                    localStorage.setItem('TTV_AUTO_POST', 'false');
                    this.ELEMENTS.qpButtonAutoPost.text('🔄 TỰ ĐỘNG (TẮT)');
                    this.ELEMENTS.qpButtonAutoPost.removeClass('btn-info').addClass('btn-warning');

                    // Reset số lần đã đăng
                    this.STATE.POSTED_CHAPTERS = 0;
                    localStorage.setItem('TTV_POSTED_CHAPTERS', '0');

                    setTimeout(() => {
                        showNotification(`🎉 Đã hoàn thành tự động đăng ${this.STATE.TOTAL_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS} chương và đã reset số lần đăng`, 'success');
                    }, 3000);
                } else {
                    // Cập nhật hiển thị số chương đã đăng
                    this.ELEMENTS.qpButtonAutoPost.text(`🔄 TỰ ĐỘNG (${this.STATE.POSTED_CHAPTERS}/${this.STATE.TOTAL_CHAPTERS})`);
                }
            }

            setTimeout(() => this.hideLoading(), 2000);
        },

        addNewChapter: function() {
            if ((this.STATE.CHAP_NUMBER + 1) <= MAX_CHAPTER_POST) {
                this.updateChapNumber(true);
                const html = createChapterHTML(this.STATE.CHAP_NUMBER);
                jQuery('#add-chap').before(html);
                setupCharacterCounter();
            } else {
                showNotification(`⚠️ Chỉ có thể đăng tối đa ${MAX_CHAPTER_POST} chương một lần`, 'warning');
            }
        },

        updateChapNumber: function(isAdd) {
            try{
                if (isAdd) {
                    let maxStt = 0;
                    let maxSerial = 0;
                    jQuery('input[name^="chap_stt"]').each(function() {
                        const val = parseInt(jQuery(this).val()) || 0;
                        maxStt = Math.max(maxStt, val);
                    });
                    jQuery('input[name^="chap_number"]').each(function() {
                        const val = parseInt(jQuery(this).val()) || 0;
                        maxSerial = Math.max(maxSerial, val);
                    });
                    const chapStt = parseInt(jQuery('.chap_stt1').val()) || 0;
                    const chapSerial = parseInt(jQuery('.chap_serial').val()) || 0;
                    maxStt = Math.max(maxStt, chapStt);
                    maxSerial = Math.max(maxSerial, chapSerial);
                    this.STATE.CHAP_STT = maxStt + 1;
                    this.STATE.CHAP_SERIAL = maxSerial + 1;
                    this.STATE.CHAP_NUMBER++;
                } else {
                    if (this.STATE.CHAP_NUMBER > this.STATE.CHAP_NUMBER_ORIGINAL) {
                        this.STATE.CHAP_NUMBER--;
                    }
                    if (this.STATE.CHAP_STT > this.STATE.CHAP_STT_ORIGINAL) {
                        this.STATE.CHAP_STT--;
                    }
                    if (this.STATE.CHAP_SERIAL > this.STATE.CHAP_SERIAL_ORIGINAL) {
                        this.STATE.CHAP_SERIAL--;
                    }
                }
                jQuery('#chap_number').val(this.STATE.CHAP_NUMBER);
                jQuery('#chap_stt').val(this.STATE.CHAP_STT);
                jQuery('#chap_serial').val(this.STATE.CHAP_SERIAL);
                jQuery('#countNumberPost').text(this.STATE.CHAP_NUMBER);
            } catch (e) {
                console.log("Lỗi: " + e);
            }
        },

        showLoading: function() {
            const loading = jQuery("<div>", {
                class: "loading-overlay",
                html: "<div class='loading-spinner'></div>"
            });
            jQuery("body").append(loading);
        },

        hideLoading: function() {
            jQuery(".loading-overlay").remove();
        },

        resetAutoPost: function() {
            this.STATE.TOTAL_CHAPTERS = 0;
            this.STATE.POSTED_CHAPTERS = 0;
            localStorage.removeItem('TTV_TOTAL_CHAPTERS');
            localStorage.removeItem('TTV_POSTED_CHAPTERS');
            this.ELEMENTS.qpButtonAutoPost.text('🔄 TỰ ĐỘNG (TẮT)');
            this.ELEMENTS.qpButtonAutoPost.removeClass('btn-info').addClass('btn-warning');
            showNotification('🔄 Đã reset số lần tự động đăng', 'info');
        },

        toggleAutoMode: function() {
            const isAutoMode = this.ELEMENTS.qpOptionLoop.is(':checked');

            if (isAutoMode) {
                // Hiển thị nút tự động đăng và reset, ẩn nút paste và đăng chương
                this.ELEMENTS.qpButtonAutoPost.show();
                this.ELEMENTS.qpButtonReset.show();
                this.ELEMENTS.qpButtonPaste.hide();
                this.ELEMENTS.qpButtonSubmit.hide();

                showNotification('🔄 Đã bật chế độ tự động', 'info');
            } else {
                // Hiển thị nút paste và đăng chương, ẩn nút tự động đăng và reset
                this.ELEMENTS.qpButtonAutoPost.hide();
                this.ELEMENTS.qpButtonReset.hide();
                this.ELEMENTS.qpButtonPaste.show();
                this.ELEMENTS.qpButtonSubmit.show();

                showNotification('❌ Đã tắt chế độ tự động', 'info');
            }

            // Lưu trạng thái vào localStorage
            localStorage.setItem('TTV_AUTO_MODE', isAutoMode.toString());
        }
    };
    dangNhanhTTV.init();
})();
