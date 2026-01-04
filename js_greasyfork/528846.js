// ==UserScript==
// @name         Đăng Nhanh TTV v2
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Đăng truyện nhanh TTV với nhiều tính năng mới và tự động tách chương - phiên bản tối ưu
// @author       HA
// @match        https://tangthuvien.net/dang-chuong/story/*
// @match        https://tangthuvien.net/danh-sach-chuong/story/*
// @grant        none
// @required     https://code.jquery.com/jquery-3.2.1.min.js
// @icon         https://tangthuvien.net/images/icon-favico.png
// @copyright    2021-2023, by HA
// @license      AGPL-3.0-only
// @collaborator HA
// @downloadURL https://update.greasyfork.org/scripts/528846/%C4%90%C4%83ng%20Nhanh%20TTV%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/528846/%C4%90%C4%83ng%20Nhanh%20TTV%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const HEADER_SIGN = "";
    const FOOTER_SIGN = "";
    const dăngnhanhTTV = {
        CONFIG: {
            YEAR_ALIVE: 2021,
            MAX_CHAPTER_POST: 10,
            MIN_CHARACTERS: 3000,
            MAX_CHARACTERS: 20000,
            SAFE_CHARACTERS: 15000
        },
        STATE: {
            CHAP_NUMBER: 1,
            CHAP_STT: 1,
            CHAP_SERIAL: 1,
            CHAP_NUMBER_ORIGINAL: 1,
            CHAP_STT_ORIGINAL: 1,
            CHAP_SERIAL_ORIGINAL: 1
        },
        ELEMENTS: {
            qpContent: null,
            qpButtonSubmit: null,
            qpButtonRemoveEmpty: null,
            qpn: null,
            characterCount: null
        },
        init: function() {
            try {
                const me = this;
                if (this.handleRedirects()) {
                    return;
                }
                this.initializeChapterValues();
                this.createInterface();
                this.addStyles();
                this.cacheElements();
                this.registerEvents();
                this.createListAddChapter(true);
                jQuery('#qpNumberOfChapter').attr('max', me.CONFIG.MAX_CHAPTER_POST);
                this.ELEMENTS.qpContent.focus();
            } catch (e) {
                console.error("Lỗi khởi tạo:", e);
            }
        },
        handleRedirects: function() {
            if (window.location.href.includes('tangthuvien.net/message/successchapter')) {
                setTimeout(function() {
                    const previousUrl = document.referrer;
                    if (previousUrl.includes('/dang-chuong/story/')) {
                        const matches = previousUrl.match(/\/dang-chuong\/story\/(\d+)/);
                        if (matches && matches[1]) {
                            window.location.href = 'https://tangthuvien.net/dang-chuong/story/' + matches[1];
                        }
                    }
                }, 3000);
                return true;
            } else if (window.location.href.includes('/story/') && window.location.href.includes('/danh-sach-chuong')) {
                setTimeout(function() {
                    const matches = window.location.href.match(/\/story\/(\d+)/);
                    if (matches && matches[1]) {
                        window.location.href = 'https://tangthuvien.net/dang-chuong/story/' + matches[1];
                    }
                }, 3000);
                return true;
            }
            return false;
        },
        cacheElements: function() {
            this.ELEMENTS.qpContent = jQuery("#qpContent");
            this.ELEMENTS.qpButtonSubmit = jQuery("#qpButtonSubmit");
            this.ELEMENTS.qpButtonRemoveEmpty = jQuery("#qpButtonRemoveEmpty");
            this.ELEMENTS.qpn = jQuery("#qpn");
            this.ELEMENTS.characterCount = jQuery(".character-count");
        },
        initializeChapterValues: function() {
            const chap_number = parseInt(jQuery('#chap_number').val());
            let chap_stt = parseInt(jQuery('.chap_stt1').val());
            let chap_serial = parseInt(jQuery('.chap_serial').val());
            if (parseInt(jQuery('#chap_stt').val()) > chap_stt) {
                chap_stt = parseInt(jQuery('#chap_stt').val());
            }
            if (parseInt(jQuery('#chap_serial').val()) > chap_serial) {
                chap_serial = parseInt(jQuery('#chap_serial').val());
            }
            this.STATE.CHAP_NUMBER = this.STATE.CHAP_NUMBER_ORIGINAL = chap_number;
            this.STATE.CHAP_STT = this.STATE.CHAP_STT_ORIGINAL = chap_stt;
            this.STATE.CHAP_SERIAL = this.STATE.CHAP_SERIAL_ORIGINAL = chap_serial;
        },
        addNewChapter: function() {
            const me = this;
            if ((me.STATE.CHAP_NUMBER + 1) <= me.CONFIG.MAX_CHAPTER_POST) {
                me.updateChapNumber(true);
                const chap_vol = parseInt(jQuery('.chap_vol').val());
                const chap_vol_name = jQuery('.chap_vol_name').val();
                const html = `
                <div data-gen="MK_GEN" id="COUNT_CHAP_${me.STATE.CHAP_NUMBER}_MK">
                    <div class="col-xs-12 form-group"></div>
                    <div class="form-group">
                        <label class="col-sm-2" for="chap_stt">STT</label>
                        <div class="col-sm-8">
                            <input class="form-control" required name="chap_stt[${me.STATE.CHAP_NUMBER}]" value="${me.STATE.CHAP_STT}" placeholder="Số thứ tự của chương" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="chap_number">Chương thứ..</label>
                        <div class="col-sm-8">
                            <input value="${me.STATE.CHAP_SERIAL}" required class="form-control" name="chap_number[${me.STATE.CHAP_NUMBER}]" placeholder="Chương thứ.. (1,2,3..)" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="chap_name">Quyển số</label>
                        <div class="col-sm-8">
                            <input class="form-control" name="vol[${me.STATE.CHAP_NUMBER}]" placeholder="Quyển số" type="number" value="${chap_vol}" required/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="chap_name">Tên quyển</label>
                        <div class="col-sm-8">
                            <input class="form-control chap_vol_name" name="vol_name[${me.STATE.CHAP_NUMBER}]" placeholder="Tên quyển" type="text" value="${chap_vol_name}" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="chap_name">Tên chương</label>
                        <div class="col-sm-8">
                            <input required class="form-control" name="chap_name[${me.STATE.CHAP_NUMBER}]" placeholder="Tên chương" type="text"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="introduce">Nội dung</label>
                        <div class="col-sm-8">
                            <textarea maxlength="75000" style="color:#000;font-weight: 400;" required class="form-control" name="introduce[${me.STATE.CHAP_NUMBER}]" rows="20" placeholder="Nội dung" type="text"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2" for="adv">Quảng cáo</label>
                        <div class="col-sm-8">
                            <textarea maxlength="1000" class="form-control" name="adv[${me.STATE.CHAP_NUMBER}]" placeholder="Quảng cáo" type="text"></textarea>
                        </div>
                    </div>
                </div>`;
                jQuery('#add-chap').before(html);
            } else {
                const chapterLeft = Math.max(0, me.CONFIG.MAX_CHAPTER_POST - me.STATE.CHAP_NUMBER);
                alert(`Bạn nên đăng tối đa ${me.CONFIG.MAX_CHAPTER_POST} chương một lần, số chương đã tạo ${me.STATE.CHAP_NUMBER} chương, bạn có thể đăng thêm ${chapterLeft} chương nữa.`);
            }
        },
        createListAddChapter: function(isSilent) {
            const me = this;
            const chapterAdd = parseInt(jQuery("#qpNumberOfChapter").val());

            if ((me.STATE.CHAP_NUMBER + chapterAdd) <= me.CONFIG.MAX_CHAPTER_POST) {
                for (let i = 0; i < chapterAdd; i++) {
                    me.addNewChapter();
                }
                if (!isSilent) {
                    alert(`Đã tạo thêm ${chapterAdd} chương, hãy copy và dán nội dung cần đăng.`);
                }
            } else {
                alert(`Bạn nên đăng tối đa ${me.CONFIG.MAX_CHAPTER_POST} chương một lần, số chương đã tạo ${me.STATE.CHAP_NUMBER} chương, bạn có thể đăng thêm ${me.CONFIG.MAX_CHAPTER_POST - me.STATE.CHAP_NUMBER} chương nữa.`);
            }
        },
        removeLastedPost: function() {
            const me = this;
            jQuery(`#COUNT_CHAP_${me.STATE.CHAP_NUMBER}_MK`).remove();
            me.updateChapNumber();
        },
        updateChapNumber: function(isAdd) {
            const me = this;
            try {
                if (isAdd) {
                    let chap_stt = parseInt(jQuery('.chap_stt1').val());
                    let chap_serial = parseInt(jQuery('.chap_serial').val());
                    if (parseInt(jQuery('#chap_stt').val()) > chap_stt) {
                        chap_stt = parseInt(jQuery('#chap_stt').val());
                    }
                    if (parseInt(jQuery('#chap_serial').val()) > chap_serial) {
                        chap_serial = parseInt(jQuery('#chap_serial').val());
                    }
                    me.STATE.CHAP_STT = chap_stt;
                    me.STATE.CHAP_SERIAL = chap_serial;
                    me.STATE.CHAP_NUMBER++;
                    me.STATE.CHAP_STT++;
                    me.STATE.CHAP_SERIAL++;
                } else {
                    if (me.STATE.CHAP_NUMBER > me.STATE.CHAP_NUMBER_ORIGINAL) {
                        me.STATE.CHAP_NUMBER--;
                    }
                    if (me.STATE.CHAP_STT > me.STATE.CHAP_STT_ORIGINAL) {
                        me.STATE.CHAP_STT--;
                    }
                    if (me.STATE.CHAP_SERIAL > me.STATE.CHAP_SERIAL_ORIGINAL) {
                        me.STATE.CHAP_SERIAL--;
                    }
                }
                jQuery('#chap_number').val(me.STATE.CHAP_NUMBER);
                jQuery('#chap_stt').val(me.STATE.CHAP_STT);
                jQuery('#chap_serial').val(me.STATE.CHAP_SERIAL);
                jQuery('#countNumberPost').text(me.STATE.CHAP_NUMBER);
            } catch (e) {
                console.error("Lỗi cập nhật số chương:", e);
            }
        },
        createInterface: function() {
            const html = `
            <div id="HA">
                <div class="form-group"></div>
                <center>
                    <h3 style="color: #4285f4; margin-bottom: 15px; font-weight: 600;">📝 CÔNG CỤ ĐĂNG NHANH</h3>
                </center>
                <center>
                    <h4><span id="short-chapter-warning" style="display:none; color:#ea4335; padding: 8px; background-color: #ffebee; border-radius: 6px;"></span></h4>
                </center>
                <div class="form-group">
                    <textarea placeholder="Nội dung truyện (Dán vào đây để tự động tách chương)" id="qpContent" class="form-control" rows="5"></textarea>
                    <div class="character-count" style="text-align: right; font-size: 11px; color: #666; margin-top: 3px;">Số ký tự: 0</div>
                    <div class="form-group" id="qpAdv" class="form-control" rows="2"></div>
                    <div class="form-group" style="display: flex; justify-content: space-between; margin-top: 15px;">
                        <div>
                            <button type="button" id="qpButtonSubmit" class="btn btn-success">📤 Đăng chương</button>
                        </div>
                        <div>
                            <button type="button" id="qpButtonRemoveEmpty" class="btn btn-danger" style="display: none;">Xóa chương trống</button>
                            <button type="button" id="qpButtonAddEmpty" class="btn btn-outline">Xóa chương trống</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <span id="qpn" style="margin:0px 15px;font-weight:500"></span>
                    </div>
                </div>
                <div class="hidden-config-section" style="display:none;height:0;overflow:hidden;visibility:hidden;">
                    <h4></h4>
                    <div class="form-group">
                        <input type="text" id="qpSplitValue" class="form-control" value="/[c|C]hương\\s?\\d+\\s?:?\\s?/">
                    </div>
                    <div class="form-group" id="qpSplitValueReplace"></div>
                    <div class="form-group">
                        <input type="number" placeholder="Thêm" value="9" id="qpNumberOfChapter" class="form-control">
                    </div>
                </div>
            </div>`;
            jQuery(".list-in-user").before(html);
        },
        addStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                #HA { 
                    background-color: #ffffff !important;
                    padding: 20px;
                    color: #333333 !important;
                    border-radius: 12px;
                    margin-bottom: 15px;
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    max-width: 400px;
                    z-index: 9999;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    font-family: "Segoe UI", Roboto, Arial, sans-serif;
                    transition: all 0.3s ease;
                }
                #HA > .form-group > div {
                    font-size: 14px;
                    color: #333333 !important;
                }
                #HA > p {
                    font-size: 14px;
                    color: #333333 !important;
                    text-align: right;
                }
                #HA .HA-option {
                    padding: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    background-color: #f8f9fa;
                }
                #HA .HA-option-label {
                    width: 100%;
                    background-color: #4285f4;
                    color: white;
                    padding: 10px;
                    border-radius: 6px;
                    margin: 0 0 10px 0;
                    font-weight: 500;
                }
                #qpn {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-top: 15px;
                    font-size: 13px;
                    padding: 10px;
                    background-color: #f5f8ff;
                    border-radius: 8px;
                }
                .hidden-element, .hidden-config-section {
                    display: none !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    visibility: hidden !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    position: absolute !important;
                    left: -9999px !important;
                }
                @keyframes blink-red {
                    0% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); }
                    50% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
                    100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); }
                }
                textarea[style*='border: 3px solid red'] {
                    animation: blink-red 2s infinite;
                    border: 2px solid #ea4335 !important;
                    border-radius: 8px !important;
                    background-color: rgba(255, 235, 238, 0.2) !important;
                }
                #short-chapter-warning {
                    animation: blink-red 2s infinite;
                    display: inline-block;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .form-control {
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    padding: 10px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                .form-control:focus {
                    border-color: #4285f4;
                    box-shadow: 0 0 5px rgba(66, 133, 244, 0.3);
                    outline: none;
                }
                .character-count, .chapter-character-count {
                    text-align: right;
                    font-size: 14px;
                    color: #666;
                    margin-top: 5px;
                    padding-right: 8px;
                    font-family: "Segoe UI", Roboto, Arial, sans-serif;
                    font-weight: 600;
                }
                .btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    font-size: 14px;
                    margin: 5px;
                }
                .btn-success {
                    background-color: #4285f4;
                    color: white;
                }
                .btn-success:hover {
                    background-color: #3367d6;
                }
                .btn-danger {
                    background-color: #f5f5f5;
                    color: #333333;
                    border: 1px solid #ccc;
                    font-weight: normal;
                }
                .btn-danger:hover {
                    background-color: #e9e9e9;
                    color: #333333;
                    border: 1px solid #bbb;
                }
                .btn-default {
                    background-color: #f1f3f4;
                    color: #333333;
                }
                .btn-default:hover {
                    background-color: #e8eaed;
                }
                /* Styles for summary sections */
                .summary-section {
                    padding: 6px 8px;
                    margin-bottom: 5px;
                    border-radius: 4px;
                    background-color: #ffffff;
                    border-left: 3px solid #4285f4;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    font-size: 12px;
                }
                .summary-section.warning {
                    border-left-color: #fbbc05;
                    background-color: #fffde7;
                }
                .summary-section.error {
                    border-left-color: #ea4335;
                    background-color: #fef2f2;
                }
                .summary-label {
                    font-weight: 600;
                    color: #202124;
                    display: inline-block;
                    min-width: 110px;
                    font-size: 12px;
                }
                .summary-value {
                    color: #3c4043;
                    font-weight: 500;
                    font-size: 12px;
                }
                .summary-details {
                    margin: 2px 0 2px 8px;
                    padding: 2px 0 2px 6px;
                    border-left: 2px solid #e0e0e0;
                    font-size: 11px;
                }
                .detail-item {
                    padding: 1px 0;
                    color: #5f6368;
                    font-size: 11px;
                }
                #qpn {
                    max-height: 250px;
                    overflow-y: auto;
                    margin-top: 10px;
                    font-size: 12px;
                    padding: 8px;
                    background-color: #f5f8ff;
                    border-radius: 6px;
                }
            `;
            document.head.appendChild(style);
            setTimeout(function() {
                const elementsToHide = [
                    document.querySelector('.hidden-config-section'),
                    document.getElementById('qpSplitValue'),
                    document.getElementById('qpSplitValueReplace'),
                    document.getElementById('qpNumberOfChapter')
                ];
                elementsToHide.forEach(function(el) {
                    if (el) {
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.height = '0px';
                        el.style.overflow = 'hidden';
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        el.setAttribute('aria-hidden', 'true');
                    }
                });
            }, 100);
        },
        registerEvents: function() {
            const me = this;
            this.ELEMENTS.qpContent.on("input", function() {
                me.updateCharacterCount(jQuery(this).val().length, me.ELEMENTS.characterCount);
            });
            jQuery(document).on("input", "[name^=introduce]", function() {
                const text = jQuery(this).val().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim();
                const charCount = text.length;
                let charCountElement = jQuery(this).next('.chapter-character-count');
                if (charCountElement.length === 0) {
                    charCountElement = jQuery('<div class="chapter-character-count" style="text-align: right; font-size: 11px; margin-top: 3px; padding-right: 5px;"></div>');
                    jQuery(this).after(charCountElement);
                }
                me.updateCharacterCount(charCount, charCountElement);
            });
            this.ELEMENTS.qpContent.on("paste", function(e) {
                jQuery(this).val("");
                me.showProcessingNotification();
                setTimeout(function() {
                    const text = me.ELEMENTS.qpContent.val();
                    me.updateCharacterCount(text.length, me.ELEMENTS.characterCount);
                }, 100);
                setTimeout(function() {
                    me.splitChapters();
                    jQuery("#processing-notification").fadeOut(300, function() {
                        jQuery(this).remove();
                    });
                    me.showCompletionNotification();
                }, 500);
            });
            jQuery('#qpButtonRemoveEmpty').on('click', function(e) {
                e.preventDefault();
                me.removeEmptyList();
            });
            jQuery('#qpButtonAddEmpty').on('click', function(e) {
                e.preventDefault();
                me.addNewChapter();
            });
            this.ELEMENTS.qpButtonSubmit.on('click', function(e) {
                e.preventDefault();
                const titles = jQuery("[name^=chap_name]");
                const contents = jQuery("[name^=introduce]");
                const advs = jQuery("[name^=adv]");
                const advContent = jQuery("#qpAdv").val();
                const st = jQuery('#qpSplitValueReplace').val().trim();
                me.fillEmptyForms(titles, contents, advs, advContent, st);
                jQuery('form button[type=submit]')[0].click();
            });
        },
        showProcessingNotification: function() {
            const processingMsg = jQuery("<div>", {
                id: "processing-notification",
                text: "Đang xử lý tách chương...",
                css: {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "8px",
                    zIndex: "10000",
                    fontSize: "16px",
                    fontWeight: "500",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }
            });
            jQuery("body").append(processingMsg);
        },
        showCompletionNotification: function() {
            const completeMsg = jQuery("<div>", {
                id: "complete-notification",
                html: "<span style='font-size:18px;margin-right:8px;'>✅</span> Đã tách chương tự động!",
                css: {
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    zIndex: "10000",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center"
                }
            });
            jQuery("body").append(completeMsg);
            completeMsg.fadeIn(300).delay(2000).fadeOut(500, function() {
                jQuery(this).remove();
            });
        },
        updateCharacterCount: function(charCount, element) {
            if (element === this.ELEMENTS.characterCount) {
                element.html("<strong style='font-size: 14px;'>Số ký tự: " + charCount.toLocaleString('vi-VN') + "</strong>");
            } else {
                element.html("<strong style='font-size: 14px;'>Số ký tự: " + charCount.toLocaleString('vi-VN') + "/20.000</strong>");
            }
            if (charCount < this.CONFIG.MIN_CHARACTERS) {
                element.css("color", "#ea4335");
            } else if (charCount > this.CONFIG.MAX_CHARACTERS) {
                element.css("color", "#fbbc05");
            } else {
                element.css("color", "#34a853");
            }
        },
        ucFirst: function(str) {
            if (str && typeof str === 'string' && str.length > 0) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            return str;
        },
        copyToClipboard: function(text) {
            navigator.clipboard.writeText(text).catch(err => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            });
        },
        removeEmptyList: function() {
            try {
                const me = this;
                const titles = jQuery("[name^=chap_name]");
                const contents = jQuery("[name^=introduce]");
                let count = 0;
                this.ELEMENTS.qpn.html('');
                if (titles && titles.length) {
                    for (let i = 0; i < titles.length; i++) {
                        const t = titles[i];
                        const c = contents[i];
                        if (t && (!t.value || (c && !c.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                            if (t.parentElement.parentElement.parentElement.tagName != 'FORM') {
                                t.parentElement.parentElement.parentElement.remove();
                            }
                            me.updateChapNumber();
                            count++;
                        }
                    }
                }
                alert('Đã loại bỏ ' + count + ' chương trống. Đã có thể nhấn Đăng chương');
                const updatedTitles = jQuery("[name^=chap_name]");
                const updatedContents = jQuery("[name^=introduce]");
                const updatedAdvs = jQuery("[name^=adv]");
                const advContent = jQuery("#qpAdv").val();
                const st = jQuery('#qpSplitValueReplace').val().trim();
                let stillHasEmptyChapters = false;
                for (let i = 0; i < updatedTitles.length; i++) {
                    const t = updatedTitles[i];
                    const c = updatedContents[i];
                    if (t && (!t.value || (c && !c.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                        stillHasEmptyChapters = true;
                        break;
                    }
                }
                if (stillHasEmptyChapters) {
                    this.ELEMENTS.qpButtonRemoveEmpty.show();
                    jQuery('#qpButtonAddEmpty').hide();
                } else {
                    this.ELEMENTS.qpButtonRemoveEmpty.hide();
                    jQuery('#qpButtonAddEmpty').show();
                }
                me.fillEmptyForms(updatedTitles, updatedContents, updatedAdvs, advContent, st);
            } catch (e) {
                console.error("Lỗi khi xóa chương trống:", e);
            }
        },
        fillEmptyForms: function(titles, contents, advs, advContent, st) {
            try {
                const maxIterations = 3;
                let iteration = 0;
                let hasEmptyForms = true;
                while (hasEmptyForms && iteration < maxIterations) {
                    hasEmptyForms = false;
                    for (let i = 0; i < titles.length; i++) {
                        const currentTitle = titles[i];
                        const currentContent = contents[i];

                        if (currentTitle && (!currentTitle.value || (currentContent && !currentContent.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                            hasEmptyForms = true;

                            let foundNextValid = false;
                            for (let j = i + 1; j < titles.length; j++) {
                                const nextTitle = titles[j];
                                const nextContent = contents[j];

                                if (nextTitle && nextTitle.value && nextContent && nextContent.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()) {
                                    currentTitle.value = nextTitle.value;
                                    currentContent.value = nextContent.value;

                                    if (advs && advs[i]) {
                                        advs[i].value = advs[j] ? advs[j].value : advContent;
                                    }

                                    nextTitle.value = "";
                                    nextContent.value = "";

                                    if (advs && advs[j]) {
                                        advs[j].value = "";
                                    }

                                    foundNextValid = true;
                                    break;
                                }
                            }
                        }
                    }
                    iteration++;
                }
                let emptyFormCount = 0;
                for (let i = 0; i < titles.length; i++) {
                    const currentTitle = titles[i];
                    const currentContent = contents[i];
                    if (currentTitle && (!currentTitle.value || (currentContent && !currentContent.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                        emptyFormCount++;
                    }
                }
                if (emptyFormCount > 0) {
                    this.ELEMENTS.qpn.html(this.ELEMENTS.qpn.html() + `<br><b style='color:red'>Cảnh báo: Vẫn còn ${emptyFormCount} chương trống.</b>`);
                    this.ELEMENTS.qpButtonRemoveEmpty.show();
                    jQuery('#qpButtonAddEmpty').hide();
                } else {
                    this.ELEMENTS.qpButtonRemoveEmpty.hide();
                    jQuery('#qpButtonAddEmpty').show();
                }
            } catch (e) {
                console.error("Lỗi khi đẩy chương lên form trống:", e);
            }
        },
        splitChapters: function() {
            try {
                const me = this;
                window.shortChapterNotified = false;
                const warningEl = document.getElementById('short-chapter-warning');
                if (warningEl) {
                    warningEl.style.display = 'none';
                }
                const mainContentText = this.ELEMENTS.qpContent.val();
                const mainContentLength = mainContentText.length;
                this.updateCharacterCount(mainContentLength, this.ELEMENTS.characterCount);
                const content = this.ELEMENTS.qpContent.val();
                const st = jQuery('#qpSplitValueReplace').val().trim();
                const advContent = jQuery("#qpAdv").val();
                const lines = content.split('\n');
                const chapters = [];
                let currentChapter = [];
                const regex = /^\s*[Cc]hương\s*\d+\s*:/;
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.match(regex)) {
                        if (currentChapter.length > 0) {
                            chapters.push(currentChapter.join('\n'));
                            currentChapter = [];
                        }
                        currentChapter.push(line);
                    } else {
                        currentChapter.push(line);
                    }
                }
                if (currentChapter.length > 0) {
                    chapters.push(currentChapter.join('\n'));
                }
                const filteredChapters = chapters.filter(function(chapter) {
                    const lines = chapter.split('\n');
                    return lines.some(function(line, index) {
                        return index > 0 && line.trim().length > 0;
                    });
                });
                let i = 0;
                const processedChapters = [];

                while (i < filteredChapters.length) {
                    if (filteredChapters[i].length > this.CONFIG.MAX_CHARACTERS) {
                        const largeChapter = filteredChapters[i];
                        const lines = largeChapter.split('\n');
                        const chapterTitle = lines.shift();
                        const contentToSplit = lines.join('\n');
                        const contentLength = contentToSplit.length;
                        const numSubChapters = Math.ceil(contentLength / this.CONFIG.SAFE_CHARACTERS);
                        const chunkSize = Math.floor(contentLength / numSubChapters);
                        let startPos = 0;
                        for (let j = 0; j < numSubChapters; j++) {
                            let endPos = (j === numSubChapters - 1) ? contentLength : startPos + chunkSize;
                            if (j < numSubChapters - 1) {
                                const lookAhead = Math.min(200, contentLength - endPos);
                                const segment = contentToSplit.substring(endPos, endPos + lookAhead);
                                const sentenceEnd = segment.search(/[.!?][^.!?]*$/);
                                if (sentenceEnd !== -1) {
                                    endPos += sentenceEnd + 1;
                                }
                            }
                            const subContent = contentToSplit.substring(startPos, endPos);
                            const subTitle = `${chapterTitle.trim()} (Phần ${j + 1}/${numSubChapters})`;
                            processedChapters.push(subTitle + "\n" + subContent);
                            startPos = endPos;
                        }
                    } else {
                        processedChapters.push(filteredChapters[i]);
                    }
                    i++;
                }
                const titles = jQuery("[name^=chap_name]");
                const contents = jQuery("[name^=introduce]");
                const advs = jQuery("[name^=adv]");
                let validChapters = 0;
                const shortChapters = [];
                const splitChapterGroups = [];
                const duplicateTitles = [];
                const titleMap = {};
                for (let i = 0; i < Math.min(processedChapters.length, titles.length); i++) {
                    const chapterLines = processedChapters[i].split('\n');
                    const title = chapterLines.shift().trim();
                    const content = chapterLines.join('\n');
                    if (content) {
                        validChapters++;
                        let processedTitle = title;
                        if (title.includes(':')) {
                            processedTitle = title.split(':').slice(1).join(':').trim();
                        }
                        processedTitle = this.ucFirst(processedTitle);
                        if (processedTitle.toLowerCase().startsWith(st.toLowerCase())) {
                            titles[i].value = processedTitle;
                        } else {
                            titles[i].value = st + " " + processedTitle;
                        }
                        contents[i].value = HEADER_SIGN + "\r\n" + content + "\r\n" + FOOTER_SIGN;
                        advs[i].value = advContent;
                        const contentWithoutEmpty = content.split('\n')
                            .filter(line => line.trim().length > 0)
                            .join('\n');
                        const charCount = contentWithoutEmpty.length;
                        let charCountElement = jQuery(contents[i]).next('.chapter-character-count');
                        if (charCountElement.length === 0) {
                            charCountElement = jQuery('<div class="chapter-character-count" style="text-align: right; font-size: 11px; margin-top: 3px; padding-right: 5px;"></div>');
                            jQuery(contents[i]).after(charCountElement);
                        }
                        this.updateCharacterCount(charCount, charCountElement);
                        if (charCount < this.CONFIG.MIN_CHARACTERS) {
                            contents[i].style.border = '3px solid red';
                            shortChapters.push(title);
                        }
                        const titleText = titles[i].value.toLowerCase();
                        if (titleMap[titleText]) {
                            duplicateTitles.push(titles[i].value);
                        } else {
                            titleMap[titleText] = true;
                        }
                        if (title.includes(" (Phần ")) {
                            const parts = title.match(/\(Phần (\d+)\/(\d+)\)/);
                            if (parts && parts[2] && parts[1] === "1") {
                                const chapterName = title.replace(/\s*\(Phần \d+\/\d+\)/, "");
                                splitChapterGroups.push({
                                    name: chapterName,
                                    totalParts: parseInt(parts[2])
                                });
                            }
                        }
                    }
                }
                const totalProcessedChapters = processedChapters.length;
                let splitChaptersCount = 0;
                let largeChapterCount = 0;
                let totalParts = 0;
                for (let i = 0; i < processedChapters.length; i++) {
                    const firstLine = processedChapters[i].split('\n')[0];
                    if (firstLine && firstLine.includes(" (Phần ")) {
                        splitChaptersCount++;
                        const parts = firstLine.match(/\(Phần (\d+)\/(\d+)\)/);
                        if (parts && parts[2]) {
                            const totalPartsInChapter = parseInt(parts[2]);
                            if (parts[1] === "1") {
                                largeChapterCount++;
                                totalParts += totalPartsInChapter;
                            }
                        }
                    }
                }
                if (processedChapters.length > titles.length) {
                    const remainingContent = processedChapters.slice(titles.length).join("\n\n");
                    this.copyToClipboard(remainingContent);
                }
                let detailedSummary = "";
                detailedSummary += `<div class='summary-section' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Tổng số chương:</span> <span class='summary-value'>${totalProcessedChapters}</span></div>`;
                detailedSummary += `<div class='summary-section' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Đã xử lý:</span> <span class='summary-value'>${Math.min(processedChapters.length, titles.length)} chương</span></div>`;

                if (processedChapters.length > titles.length) {
                    detailedSummary += `<div class='summary-section' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Đã lưu vào Clipboard:</span> <span class='summary-value'>${processedChapters.length - titles.length} chương</span></div>`;
                }
                if (largeChapterCount > 0) {
                    detailedSummary += `<div class='summary-section warning' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Chương dài:</span> <span class='summary-value'>${largeChapterCount} chia thành ${totalParts} phần</span></div>`;

                    if (splitChapterGroups.length > 0 && splitChapterGroups.length <= 3) {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < splitChapterGroups.length; i++) {
                            const chapterMatch = splitChapterGroups[i].name.match(/[Cc]hương\s*(\d+):/);
                            const chapterNum = chapterMatch ? chapterMatch[0] : "Chương";
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${chapterNum} chia thành ${splitChapterGroups[i].totalParts} phần</div>`;
                        }
                        detailedSummary += `</div>`;
                    } else if (splitChapterGroups.length > 3) {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < 3; i++) {
                            const chapterMatch = splitChapterGroups[i].name.match(/[Cc]hương\s*(\d+):/);
                            const chapterNum = chapterMatch ? chapterMatch[0] : "Chương";
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${chapterNum} chia thành ${splitChapterGroups[i].totalParts} phần</div>`;
                        }
                        detailedSummary += `<div class='detail-item' style='padding:1px 0'>... và ${splitChapterGroups.length - 3} chương khác</div>`;
                        detailedSummary += `</div>`;
                    }
                }
                if (duplicateTitles.length > 0) {
                    detailedSummary += `<div class='summary-section error' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Chương trùng lặp:</span> <span class='summary-value'>${duplicateTitles.length} chương</span></div>`;
                    if (duplicateTitles.length <= 3) {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < duplicateTitles.length; i++) {
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${duplicateTitles[i]}</div>`;
                        }
                        detailedSummary += `</div>`;
                    } else {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < 3; i++) {
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${duplicateTitles[i]}</div>`;
                        }
                        detailedSummary += `<div class='detail-item' style='padding:1px 0'>... và ${duplicateTitles.length - 3} chương khác</div>`;
                        detailedSummary += `</div>`;
                    }
                }
                if (shortChapters.length > 0) {
                    detailedSummary += `<div class='summary-section error' style='font-size:12px;padding:6px 8px;margin-bottom:5px'><span class='summary-label'>Chương ngắn:</span> <span class='summary-value'>${shortChapters.length} chương</span></div>`;
                    if (shortChapters.length <= 3) {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < shortChapters.length; i++) {
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${shortChapters[i]}</div>`;
                        }
                        detailedSummary += `</div>`;
                    } else {
                        detailedSummary += `<div class='summary-details' style='font-size:11px;margin:2px 0 2px 8px;padding:2px 0 2px 6px'>`;
                        for (let i = 0; i < 3; i++) {
                            detailedSummary += `<div class='detail-item' style='padding:1px 0'>${shortChapters[i]}</div>`;
                        }
                        detailedSummary += `<div class='detail-item' style='padding:1px 0'>... và ${shortChapters.length - 3} chương khác</div>`;
                        detailedSummary += `</div>`;
                    }
                }
                const mainSummary = `Đã xử lý ${totalProcessedChapters} chương\nĐã lấy ${Math.min(processedChapters.length, titles.length)} chương` 
                    + (processedChapters.length > titles.length ? `\nĐã lưu ${processedChapters.length - titles.length} chương vào Clipboard` : '');
                this.ELEMENTS.qpContent.val(mainSummary);
                this.ELEMENTS.qpn.html(detailedSummary);
                this.ELEMENTS.qpButtonSubmit.removeClass("btn-disable").addClass("btn-success");
                let emptyChaptersExist = false;
                for (let i = 0; i < titles.length; i++) {
                    const currentTitle = titles[i];
                    const currentContent = contents[i];
                    if (currentTitle && (!currentTitle.value || (currentContent && !currentContent.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                        emptyChaptersExist = true;
                        break;
                    }
                }
                let hasEmptyChapters = false;
                for (let i = 0; i < titles.length; i++) {
                    const t = titles[i];
                    const c = contents[i];
                    if (t && (!t.value || (c && !c.value.trim().replace(HEADER_SIGN, '').replace(FOOTER_SIGN, '').trim()))) {
                        hasEmptyChapters = true;
                        break;
                    }
                }
                if (hasEmptyChapters) {
                    me.ELEMENTS.qpButtonRemoveEmpty.show();
                    jQuery('#qpButtonAddEmpty').hide();
                } else {
                    me.ELEMENTS.qpButtonRemoveEmpty.hide();
                    jQuery('#qpButtonAddEmpty').show();
                }
            } catch (e) {
                console.error("Lỗi khi tách chương:", e);
                this.ELEMENTS.qpn.html(`<div class='summary-section error'><span class='summary-label'>Lỗi:</span> <span class='summary-value'>${e}</span></div>`).addClass("text-danger");
            }
        }
    };
    dăngnhanhTTV.init();
})();