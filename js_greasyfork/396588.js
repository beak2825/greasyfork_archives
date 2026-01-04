// ==UserScript==
// @name            Twitter ARPLS
// @description     معالجة نص التغريدة بالتدقيق الإملائي والتشكيل وغيرها من الأدوات
// @version         1.2.4
// @author          @RAKAN938
// @namespace       https://twitter.com/rakan938
// @match           https://twitter.com/*
// @match           https://mobile.twitter.com/*
// @connect         tahadz.com
// @connect         alsharekh.org
// @connect         sahehly.com
// @connect         ummulqura.org.sa
// @require         https://code.jquery.com/jquery-latest.js
// @require         https://unpkg.com/popper.js@1
// @require         https://unpkg.com/tippy.js@5
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js
// @resource        __CSS_THEME_TIP https://unpkg.com/tippy.js@5.1.4/themes/light-border.css
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/396588/Twitter%20ARPLS.user.js
// @updateURL https://update.greasyfork.org/scripts/396588/Twitter%20ARPLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.fn.selectText = function() {
        var range, selection;
        return this.each(function() {
            if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(this);
                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(this);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    };

    $.fn.clsAddDel = function(_b, ...args) {
         var _arg = [];
         for (var i = 0; i < args.length; ++i) _arg[i] = args[i].substr(1);
         return _b ? this.addClass(_arg.join(' ')) : this.removeClass(_arg.join(' '));
    };

    $.fn.textInHtml = function () {
         var tm = $("<pre />").html($(this).html());
         tm.find("div").contents().replaceWith(function() { return "\n" + this.innerHTML; });
         return tm.text();
    };

    $.fn.htmlWithoutStyle = function () {
         var tm = $("<pre />").html($(this).html());
         tm.find(cls.incorrect_word).replaceWith(function() { return $(this).text(); });
         tm.find(cls.insertion_word).clsAddDel(evn.add, cls.insertion_word_dis);
         return tm.html();
    };

    $.fn.pEvent = function(_b) {
         return this.css('pointer-events', (_b ? 'auto' : 'none'));
    };

    $.fn.fontS = function(_p) {
         return this.css('font-size', _p + 'px');
    };

    String.prototype.removeTashkeel = function () {
         return this.regexpReplace(rgx.tashkeelAll, '');
    };

    String.prototype.removeTatweel = function () {
         return this.regexpReplace(rgx.tatweel, '');
    };

    String.prototype.dontArbicSpaceToSpace = function () {
         return this.regexpReplace(rgx.dontArabicAllSpace(), ' ');
    };

    String.prototype.regexpReplace = function (_r, _t) {
         return this.replace(new RegExp(_r, 'g'), _t);
    };

    moment.defineLocale('en-rakan938', {
        parentLocale: 'en',
        months : ['Muharram', 'Safar', 'Rabī\' Al-Awwal', 'Rabī\' Al-Alkhir', 'Jumada Al-Awwal', 'Jumada Al-Alkhir', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu Al-Qa\'dah', 'Dhu Al-Hijjah']
    });

    moment.defineLocale('ar-rakan938', {
        parentLocale: 'ar',
        months : ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
        meridiemParse: /صباحًا|مساءً/,
        isPM : function (input) {return 'مساءً' === input;},
        meridiem : function (hour, minute, isLower) {return (hour < 12) ? 'صباحًا' : 'مساءً';}
    });
    //=======================================================================================================================
    var thm = 'light-border', elmTwet, msgInterval, xhrAjax, htmlShrink,
    jsonInsertion, hijriInsertion, lastUpdateInsertion, alertOpenInput, htmlUndotted;
    window.tippyMainInstances = [], window.tippyCopyInstances = [], window.tippySpellcheckInstances = [], window.tippyInsertionInstances = [];

    var lngAR = {
         iconSmile: 'إضافة رمز تعبيري',
         msgPaste: 'بعد النسخ: أضغط دائمًا لصق (Ctrl+V) لتطبيق التغييرات',
         msgRestSettings: 'هل تريد بالتأكيد استعادة الإعدادات الافتراضية؟',
         copyClipboard: 'سيتم نسخ النص الجديد للحافظة',
         neverShowAgain: 'عدم الإظهار مرة أخرى',
         ok: '፧፧ موافق',
         close: '፧፧ إغلاق',
         menu: '፧፧ القائمة',
         cancel: '፧፧ إلغاء الأمر',
         copy: '፧፧ نسخ',
         shrink: '፧፧ تقليص',
         spellcheck: '፧፧ تدقيق إملائي - عربي',
         tashkeel: '፧፧ تشكيل',
         insertion: '፧፧ إدراج',
         undotted: '፧፧ مسح التنقيط',
         settings: '፧፧ إعدادات',
         upFont: '፧፧ تكبير حجم الخط',
         downFont: '፧፧ تصغير حجم الخط',
         restFont: '፧፧ استعادة حجم الخط الافتراضي',
         libraries: '፧፧ المكتبات',
         emptyText: 'الرجاء كتابة نص عربي!',
         pleaseWait: 'الرجاء الانتظار...',
         restSettings: '፧፧ استعادة الإعدادات الافتراضية',
         devTitle: '፧፧ فكرة, تصميم وتطوير',
         devAccount: '፧፧ حساب المطوّر',
         succeedSpellcheck: 'تم التدقيق الإملائي بنجاح',
         succeedTashkeel: 'تم التشكيل بنجاح',
         succeedShrink: 'تم التقليص بنجاح',
         succeedInsertion: 'تم الإدراج بنجاح',
         succeedUndotted: 'تم مسح التنقيط بنجاح',
         failSpellcheck: 'خطأ, لم يتم التدقيق الإملائي!',
         failTashkeel: 'خطأ, لم يتم التشكيل!',
         failShrink: 'خطأ, لم يتم التقليص!',
         failInsertion: 'خطأ, لم يتم الإدراج!',
         failUndotted: 'خطأ, لم يتم مسح التنقيط!',
         selectWord: 'اختر الكلمة الصحيحة',
         dateTitle: 'التاريخ',
         timeTitle: 'الوقت',
         codeTitle: 'الرمز: ',
         willReplaced: 'سيُستبدل',
         b: 'بـ',
         titleInsertion: 'أكتب في التغريدة رمز أو أكثر لاستبداله بما يوافقه:',
         WriteFormat: 'أكتب الصيغة',
         hijriSettings: '፧፧ التاريخ الهجري',
         hijri: 'هجري',
         gregorian: 'ميلادي',
         arabic: 'عربي',
         einglish: 'إنجليزي',
         applyAll: 'تطبيق على الكل',
         defaultFormat: 'اعتمادها كصيغة افتراضية',
         replaceAlways: 'استبدل الرمز بالنص المدخل دائمًا'
    }

    var cls = {
        sty: '#rakan938_arpls_style',
        btn: '.rakan938_arpls_btn',
        tip: '.rakan938_arpls_tip',
        wap: '.rakan938_arpls_wap',
        man: '.rakan938_arpls_man',
        hed: '.rakan938_arpls_hed',
        ico: '.rakan938_arpls_ico',
        nav: '.rakan938_arpls_nav',
        cnt: '.rakan938_arpls_cnt',
        txt: '.rakan938_arpls_txt',
        tit: '.rakan938_arpls_tit',
        hed_btns: '.rakan938_arpls_hed_btns',
        hed_sprite: '.rakan938_arpls_hed_sprite',
        material_ico: '.material-icons',
        select_ico: '.rakan938_arpls_selct_ico',
        hover_ico: '.rakan938_arpls_hover_ico',
        chosse_ico: '.rakan938_arpls_chosse_ico',
        dis_ico: '.rakan938_arpls_dis',
        btnOk: '.rakan938_arpls_btn_ok',
        btnClose: '.rakan938_arpls_btn_close',
        btnMenu: '.rakan938_arpls_btn_menu',
        wait: '.rakan938_arpls_wait',
        wait_ico: '.rakan938_arpls_wait_ico',
        wait_txt: '.rakan938_arpls_wait_txt',
        wait_ext: '.rakan938_arpls_wait_ext',
        nav_undotted: '.rakan938_arpls_nav_undotted',
        nav_shrink: '.rakan938_arpls_nav_shrink',
        nav_spellcheck: '.rakan938_arpls_nav_spellcheck',
        nav_tashkeel: '.rakan938_arpls_nav_tashkeel',
        nav_insertion: '.rakan938_arpls_nav_insertion',
        nav_settings: '.rakan938_arpls_nav_settings',
        ico_main: '.rakan938_arpls_ico_main',
        hover_main: '.rakan938_arpls_ico_main_hover',
        background_even: '.rakan938_arpls_background_even',
        subpopup: '.rakan938_arpls_subpopup',
        subpopup_hed: '.rakan938_arpls_subpopup_hed',
        copy_oky: '.rakan938_arpls_copy_oky',
        copy_ext: '.rakan938_arpls_copy_ext',
        settings: '.rakan938_arpls_settings',
        settings_both: '.rakan938_arpls_settings_both',
        settings_both_title: '.rakan938_arpls_settings_both_title',
        settings_both_btn: '.rakan938_arpls_settings_both_btn',
        settings_title: '.rakan938_arpls_settings_title',
        settings_link: '.rakan938_arpls_settings_link',
        settings_link_last: '.rakan938_arpls_settings_link_last',
        settings_btn_rest: '.rakan938_arpls_settings_btn_rest',
        settings_btn_account: '.rakan938_arpls_settings_btn_account',
        msg: '.rakan938_arpls_msg',
        msg_txt: '.rakan938_arpls_msg_txt',
        msg_img: '.rakan938_arpls_msg_img',
        msg_ico: '.rakan938_arpls_msg_ico',
        finsh: '.rakan938_arpls_finsh',
        zoom_up: '.rakan938_arpls_zoom_up',
        zoom_down: '.rakan938_arpls_zoom_down',
        zoom_rest: '.rakan938_arpls_zoom_rest',
        incorrect_word: '.rakan938_arpls_incorrect_word',
        incorrect_popup: '.rakan938_arpls_incorrect_popup',
        incorrect_title: '.rakan938_arpls_incorrect_title',
        incorrect_table: '.rakan938_arpls_incorrect_table',
        incorrect_table_word_old: '.rakan938_arpls_incorrect_table_word_old',
        insertion: '.rakan938_arpls_insertion',
        insertion_empty: '.rakan938_arpls_insertion_empty',
        insertion_empty_item: '.rakan938_arpls_insertion_empty_item',
        insertion_empty_item_ow: '.rakan938_arpls_insertion_empty_item_ow',
        insertion_word: '.rakan938_arpls_insertion_word',
        insertion_word_dis: '.rakan938_arpls_insertion_word_dis',
        insertion_popup: '.rakan938_arpls_insertion_popup',
        insertion_popup_sel: '.rakan938_arpls_insertion_popup_sel'
    };

    var twit = {
         icoMain: 'div[aria-label="'+lngAR.iconSmile+'"]',
         modalHeader: 'div[aria-labelledby="modal-header"]',
         clsElmTwit: '.public-DraftEditor-content'
    };

    var key = {
         copy: 'rakan938_arpls_key_msg_copy',
         paste: 'rakan938_arpls_key_msg_paste',
         insertion: 'rakan938_arpls_key_jsn_insertion',
         navSort: 'rakan938_arpls_key_jsn_nav_sort'
    }

    var clr = {
        back_deft: '255, 255, 255',
        text_deft: '51, 51, 51',
        prim_deft: '29, 161, 242',
        prim_clor: '1.00',
        cl_shadow: '0.90',
        icon_brdr: '0.50',
        text_scnd: '0.40',
        back_slct: '0.20',
        hovr_brdr: '0.10',
        back_prim: '0.08',
        msg_error: 'darkred',
        msg_faild: 'darkorange',
        msg_doney: 'darkgreen',
        msg_await: 'darkblue'
    };

    var siz = {
        box_wid: 300,
        box_hig: 150,
        nav_wid: 40,
        ico_svg: 21,
        cnr: {bx: 4, mn: 50},
        bar: 30,
        brd: 1,
        pdg: 5,
        scr: {nav: 5, cnt: 8},
        fnt: {tit: 12, txt: 14}
    };

    var tim = {
         chk: 1000,
         msgDoney: 1000,
         msgFaild: 3000,
         run: 10,
         cpy: 100,
         xhr: 30000
    };

    var ico = {
         main: 'M23 7V1h-6v2H7V1H1v6h2v10H1v6h6v-2h10v2h6v-6h-2V7h2zM3 3h2v2H3V3zm2 18H3v-2h2v2zm12-2H7v-2H5V7h2V5h10v2h2v10h-2v2zm4 2h-2v-2h2v2zM19 5V3h2v2h-2zm-5.27 9h-3.49l-.73 2H7.89l3.4-9h1.4l3.41 9h-1.63l-.74-2zm-3.04-1.26h2.61L12 8.91l-1.31 3.83z',
         close: 'M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42z',
         ok: 'M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0L9 16.2z',
         copy: 'M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z',
         menu: 'M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z',
         spellcheck: 'M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3zm-6.02-5L8.5 5.48L10.57 11H6.43zm15.16.59l-8.09 8.09L9.83 16l-1.41 1.41l5.09 5.09L23 13l-1.41-1.41z',
         tashkeel: 'M2 6h12v2H2zm0 4h12v2H2zm0 4h8v2H2zm14.01 3L13 14l-1.5 1.5l4.51 4.5L23 13l-1.5-1.5z',
         insertion: 'M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z',
         shrink: 'M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21L18 19.73L3.55 5.27L3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68l2.1 2.1L14.21 8H20V5H6z',
         undotted: 'M14 7c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1zm-.2 4.48l.2.02c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5l.02.2c.09.67.61 1.19 1.28 1.28zM14 3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5s-.5.22-.5.5s.22.5.5.5zm-4 0c.28 0 .5-.22.5-.5s-.22-.5-.5-.5s-.5.22-.5.5s.22.5.5.5zm11 7c.28 0 .5-.22.5-.5s-.22-.5-.5-.5s-.5.22-.5.5s.22.5.5.5zM10 7c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1zm8 8c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1zm0-4c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1zm0-4c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1zm-4 13.5c-.28 0-.5.22-.5.5s.22.5.5.5s.5-.22.5-.5s-.22-.5-.5-.5zM2.5 5.27l3.78 3.78L6 9c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1c0-.1-.03-.19-.06-.28l2.81 2.81c-.71.11-1.25.73-1.25 1.47c0 .83.67 1.5 1.5 1.5c.74 0 1.36-.54 1.47-1.25l2.81 2.81A.875.875 0 0 0 14 17c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1c0-.1-.03-.19-.06-.28l3.78 3.78L20 20.23L3.77 4L2.5 5.27zM10 17c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1zm11-3.5c-.28 0-.5.22-.5.5s.22.5.5.5s.5-.22.5-.5s-.22-.5-.5-.5zM6 13c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1zM3 9.5c-.28 0-.5.22-.5.5s.22.5.5.5s.5-.22.5-.5s-.22-.5-.5-.5zm7 11c-.28 0-.5.22-.5.5s.22.5.5.5s.5-.22.5-.5s-.22-.5-.5-.5zM6 17c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1zm-3-3.5c-.28 0-.5.22-.5.5s.22.5.5.5s.5-.22.5-.5s-.22-.5-.5-.5z',
         settings: 'M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z',
         error: 'M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z',
         done: 'M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5l8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8z',
         fail: 'M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
         wait: 'M6 2v6h.01L6 8.01L10 12l-4 4l.01.01H6V22h12v-5.99h-.01L18 16l-4-4l4-3.99l-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4l4 4zm-4-5l-4-4V4h8v3.5l-4 4z',
         zoomIn: 'M18 4l-3 3h2v13h2V7h2l-3-3zm-6.2 11.5v-5l2.2-.9V7.5L3 12.25v1.5l11 4.75v-2.1l-2.2-.9zM4.98 13L10 11.13v3.74L4.98 13z',
         zoomOut: 'M6 19.73l-3-3h2V4.27h2v12.46h2l-3 3m8-10.35v3.75l5.03-1.88L14 9.38M21 12l-11 4.73v-2.06l2.19-.94V8.77L10 7.83V5.77l11 4.73V12z',
         rest: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z'
    };

    var atr = {
         processAjax: 'process-ajax',
         dataTitle: 'data-title',
         dataId: 'data-id',
         dataOld: 'data-old',
         dataIncorrect: 'data-incorrect',
         dataCode: 'data-code',
         dataType: 'data-type',
         dataFormat: 'data-format',
         dataLang: 'data-lang',
         dataAll: 'data-all',
         dataDefault: 'data-default',
         dateHijri: 'date-H',
         dateGregorian: 'date-G',
         langAR: 'ar',
         langEN: 'en',
         time: 'time',
         word: 'w'
    };

    var chg = {
         date: {old: '{خخ}', new: 'DD-MM-YYYY'},
         time: {old: '{قق}', new: 'hh%3Amm%20A'},
         qaf : {old: '{ق}', new: 'ݠ'},
         feh : {old: '{ف}', new: 'ڤ'},
         beh : {old: '{ب}', new: 'پ'},
         jeem: {old: '{ج}', new: 'چ'},
         quas: {old: '{(}', new: '﴿'},
         quae: {old: '{)}', new: '﴾'}
    };

    var evn = {
         process: '1',
         cancel: '0',
         succeed: true,
         faild: false,
         add: true,
         del: false,
         addHeight: true,
         delHeight: false,
         remove: true,
         apply: false,
         yes: '1',
         no: '0',
         msgWait: 0,
         msgError: 1,
         msgFaild: 2,
         msgDone: 3,
         overflowNone: 0,
         overflowHidden: 1,
         overflowAuto: 2,
         change: 0,
         done: 1,
         key: 2
    };

    var rgx = {
         tashkeelAll: '[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E4\u06EA-\u06ED\u0670\u06E7\u06E8]+',
         tatweel: '[\u0640]+',
         dashLine: '_+',
         tagOut: '(?![^<>]*>)',
         arabicMap: '\u0600-\u06FF',
         arabicChr: '\u0620-\u0652',
         arabicMos: '[\u0622-\u064A\u0671-\u0673\u0675-\u06D3\u06FA-\u06FC\u0620\u066E\u066F\u06D5\u06EE\u06EF\u06FF]',
         messagesTwitter: '^https?:\\/\\/twitter\\.com\\/messages\\/',
         dlEnterSpace: '[_\\n\\s]+',
         escapeRE: '[\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]]',
         dontArabicAllSpace: function dontArabicAllSpace(){return '[^'+this.arabicMap+'\\s]+';},
         arabicAllR: function arabicAllR(){return '['+this.arabicMap+']+';},
         dotRepeat: function dotRepeat(){return this.tagOut+'([.]+){2}';},
         dontRepeat: function dontRepeat(){return this.tagOut+'([^\u002F-\u0039\u0041-\u005A\u0061-\u007A\u0620-\u063F\u0641-\u064A\u0660-\u0669])\\1+';},
         htmlEntities: function htmlEntities(){return this.tagOut+'(&(nbsp|lt|gt|amp|quot|apos|cent|pound|yen|euro|copy|reg);)\\1+';},
         dontTatweel: function dontTatweel(){return this.tagOut+this.tatweel;},
         findPhrase: function findPhrase(_s){return '([^'+this.arabicChr+'#_])'+this.tagOut+'('+escapeRegExp(_s)+')([^'+this.arabicChr+'])';},
         findWord: function findWord(_s){return '([^'+this.arabicMap+'])'+this.tagOut+'('+escapeRegExp(_s)+')([^'+this.arabicMap+'])';},
         findAny: function findAny(_s){return this.tagOut+'('+escapeRegExp(_s)+')';},
         fixNoon: function fixNoon(){return this.tagOut+'(\u0646)('+this.arabicMos+'|'+this.tashkeelAll+this.arabicMos+')';}
    };

    var defaultJsonInsertion = '['
        + '{"title":"'+lngAR.dateTitle+'","code":"'+chg.date.old+'","format":"'+chg.date.new+'","type":"'+atr.dateGregorian+'","lang":"'+atr.langAR+'"},'
        + '{"title":"'+lngAR.timeTitle+'","code":"'+chg.time.old+'","format":"'+chg.time.new+'","type":"'+atr.time+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.qaf.new+')","code":"'+chg.qaf.old+'","format":"'+chg.qaf.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.feh.new+')","code":"'+chg.feh.old+'","format":"'+chg.feh.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.beh.new+')","code":"'+chg.beh.old+'","format":"'+chg.beh.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.jeem.new+')","code":"'+chg.jeem.old+'","format":"'+chg.jeem.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.quas.new+')","code":"'+chg.quas.old+'","format":"'+chg.quas.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"},'
        + '{"title":"('+chg.quae.new+')","code":"'+chg.quae.old+'","format":"'+chg.quae.new+'","type":"'+atr.word+'","lang":"'+atr.langAR+'"}'
    + ']';

    var sty = ""
              + ".tippy-content{padding:0px 0px;}"
              + '.tippy-tooltip.'+thm+'-theme{border-color:'+opCol(clr.icon_brdr)+';}'
              + cls.tip+"{display:none;}"
              + cls.wap+"{"+hiGWid(siz.box_hig, siz.box_wid, evn.overflowNone, evn.addHeight)+" font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',sans-serif;}"
              + cls.man+"::after{content:''; clear:both; display:table;}"
              + cls.hed+"{background:"+opCol(clr.back_prim)+"; border-bottom:"+opCol(clr.icon_brdr)+" "+siz.brd+"px dashed; border-top-left-radius:"+siz.cnr.bx+"px; border-top-right-radius:"+siz.cnr.bx+"px; float:left; "+hiGWid((siz.bar - siz.brd), siz.box_wid, evn.overflowHidden, evn.addHeight)+"}"
              + cls.tit+"{font-size:"+siz.fnt.tit+"px; float:right; padding:"+siz.pdg+"px; "+hiGWid((siz.bar - siz.brd), (siz.box_wid - ((siz.bar * 3) + (siz.brd + 1) + (siz.pdg * 2))), evn.overflowHidden, evn.addHeight)+" color:"+opCol(clr.text_scnd)+";}"
              + cls.hed_btns+"{float:left; "+hiGWid((siz.bar - siz.brd), (siz.bar * 3), evn.overflowHidden, evn.addHeight)+" display:flex;}"
              + cls.hed_sprite+"{float:left; "+hiGWid((siz.bar - siz.brd), siz.brd, evn.overflowHidden, evn.addHeight)+" border-left:"+opCol(clr.hovr_brdr)+" "+siz.brd+"px solid;}"
              + cls.material_ico+"{fill:"+opCol(clr.icon_brdr)+"; width:100%; height:100%; min-height:"+siz.bar+"px; cursor:pointer; display:grid; align-items:center;}"
              + cls.ico_main+"{fill:"+opCol(clr.prim_clor)+";}"
              + cls.hover_main+"{background:"+opCol(clr.hovr_brdr)+"; transition:all 0.5s ease; border-radius:"+siz.cnr.mn+"px;}"
              + cls.select_ico+"{fill:"+opCol(clr.prim_clor)+"; background:"+opCol(clr.back_slct)+";}"
              + cls.hover_ico+"{fill:"+opCol(clr.prim_clor)+"; background:"+opCol(clr.hovr_brdr)+";}"
              + cls.dis_ico+"{fill:"+opCol(clr.hovr_brdr)+"; cursor:auto; pointer-events:none;}"
              + cls.nav+"{background:"+opCol(clr.back_prim)+"; border-left:"+opCol(clr.icon_brdr)+" "+siz.brd+"px dashed; border-bottom-right-radius:"+siz.cnr.bx+"px; float:right; "+hiGWid((siz.box_hig - siz.bar), (siz.nav_wid - siz.brd), evn.overflowAuto, evn.addHeight)+" display:grid;}"
              + wScrollbar(cls.nav, opCol(clr.back_slct), opCol(clr.text_scnd), 0, siz.scr.nav)
              + cls.cnt+"{font-size:"+siz.fnt.txt+"px; color:rgb("+clr.text_deft+"); background:rgb("+clr.back_deft+"); border-bottom-left-radius:"+siz.cnr.bx+"px; float:left; "+hiGWid(((siz.box_hig - siz.bar) - 1), (siz.box_wid - siz.nav_wid), evn.overflowAuto, evn.addHeight)+"}"
              + wScrollbar(cls.cnt, opCol(clr.back_prim), opCol(clr.text_scnd), 1, siz.scr.cnt)
              + cls.txt+"{padding:"+siz.pdg+"px; text-align:justify;}"
              + cls.background_even+"{background:"+opCol(clr.back_prim)+";}"
              + cls.subpopup+" input[type='checkbox']{vertical-align:middle; margin:"+siz.pdg+"px;}"
              + cls.subpopup+" input[type='text']{width:-webkit-fill-available; direction:ltr;}"
              + cls.subpopup+" i{"+hiGWid(siz.bar, siz.bar, evn.overflowNone, evn.addHeight)+"}"
              + cls.subpopup+" h3{margin:0;}"
              + cls.subpopup+" div:not("+cls.subpopup_hed+"):not("+cls.insertion_popup_sel+"):not("+cls.incorrect_title+"):not("+cls.incorrect_table+"){padding:"+siz.pdg+"px;}"
              + cls.subpopup_hed+"{border-top-left-radius:"+siz.cnr.bx+"px; border-top-right-radius:"+siz.cnr.bx+"px; display:flex; justify-content:flex-end;}"
              + cls.settings+"{display:none; background:rgb("+clr.back_deft+"); "+hiGWid(((siz.box_hig - siz.bar) - 1), (siz.box_wid - siz.nav_wid), evn.overflowAuto, evn.addHeight)+" position:absolute; top:"+siz.bar+"px; left:0px; border-bottom-left-radius:"+siz.cnr.bx+"px;}"
              + wScrollbar(cls.settings, opCol(clr.back_prim), opCol(clr.text_scnd), 1, siz.scr.cnt)
              + cls.settings+" a{text-decoration:none; color:"+opCol(clr.prim_clor)+";}"
              + cls.settings+" a:hover{text-decoration:underline;}"
              + cls.settings_both+"{padding:"+siz.pdg+"px; clear:both; display:table;}"
              + cls.settings_both_title+"{float:right; font-weight:bold; display:flex; align-items:center;}"
              + cls.settings_both_btn+"{font-size:"+siz.fnt.tit+"px; fill:"+opCol(clr.prim_clor)+"; cursor:pointer; direction:ltr; float:left; display:flex; align-items:center; justify-content:center; border-radius:"+siz.cnr.bx+"px; border:"+opCol(clr.icon_brdr)+" "+siz.brd+"px solid;}"
              + cls.settings_title+"{font-weight:bold; padding:"+siz.pdg+"px;}"
              + cls.settings_link+"{direction:ltr; padding:0px "+siz.pdg+"px 0px "+siz.pdg+"px;}"
              + cls.settings_link_last+"{direction:ltr; padding:0px "+siz.pdg+"px "+siz.pdg+"px "+siz.pdg+"px;}"
              + cls.msg+"{display:none; z-index:9999; color:rgb("+clr.back_deft+"); border-bottom-left-radius:"+siz.cnr.bx+"px; "+hiGWid(siz.bar, ((siz.box_wid - siz.nav_wid) - 2), evn.overflowNone, evn.addHeight)+" position:absolute; top:"+((siz.box_hig - siz.bar) - 1)+"px; left:1px;}"
              + cls.msg+" span{display:grid; align-items:center;}"
              + cls.msg+" i{fill:rgb("+clr.back_deft+") !important;}"
              + cls.msg_txt+"{float:right; "+hiGWid(siz.bar, (((siz.box_wid - siz.nav_wid) - 2) - (siz.bar * 2)  - (siz.pdg * 2)), evn.overflowAuto, evn.addHeight)+" padding-left:"+siz.pdg+"px; padding-right:"+siz.pdg+"px;}"
              + cls.msg_img+"{float:right; pointer-events:none;}"
              + cls.msg_ico+"{float:left;}"
              + cls.msg_img+", "+cls.msg_ico+"{"+hiGWid(siz.bar, siz.bar, evn.overflowHidden, evn.addHeight)+" justify-content:center;}"
              + cls.incorrect_word+"{color:"+clr.msg_error+"; border-bottom:"+siz.brd+"px dotted "+clr.msg_error+"; cursor:pointer;}"
              + cls.incorrect_popup+"{background:rgb("+clr.back_deft+"); "+hiGWid(siz.box_hig, (siz.box_hig - siz.bar), evn.overflowNone, evn.delHeight)+" border-radius:"+siz.cnr.bx+"px; position:relative; padding-bottom:"+siz.brd+"px;}"
              + cls.incorrect_title+"{background:"+opCol(clr.back_prim)+"; color:"+opCol(clr.text_scnd)+"; "+hiGWid((siz.bar - siz.brd), (siz.box_hig - siz.bar), evn.overflowHidden, evn.addHeight)+" font-size:"+siz.fnt.tit+"px; border-bottom:"+opCol(clr.icon_brdr)+" "+siz.brd+"px dashed; border-top-left-radius:"+siz.cnr.bx+"px; border-top-right-radius:"+siz.cnr.bx+"px; display:grid; align-items:center;}"
              + cls.incorrect_title+" span{padding:"+siz.pdg+"px;}"
              + cls.incorrect_table+"{"+hiGWid((siz.box_hig - siz.bar), (siz.box_hig - siz.bar), evn.overflowAuto, evn.delHeight)+" border-bottom-left-radius:"+siz.cnr.bx+"px; border-bottom-right-radius:"+siz.cnr.bx+"px;}"
              + wScrollbar(cls.incorrect_table, opCol(clr.back_prim), opCol(clr.text_scnd), 1, siz.scr.cnt)
              + cls.incorrect_table+" table{width:100%; border-collapse:collapse;}"
              + cls.incorrect_table+" table tbody td{padding:"+siz.pdg+"px; cursor:pointer;}"
              + cls.incorrect_table+" table tbody tr:nth-child(odd) td{background:transparent;}"
              + cls.incorrect_table+" table tbody tr:nth-child(even) td{background:"+opCol(clr.back_prim)+";}"
              + cls.incorrect_table_word_old+"{color:"+opCol(clr.back_slct)+";}"
              + cls.insertion_empty_item+"{display:flex; margin:0 "+siz.pdg+"px 0 "+siz.pdg+"px;}"
              + cls.insertion_empty_item_ow+"{overflow:auto; width:30%;}"
              + wScrollbar(cls.insertion_empty_item_ow, opCol(clr.back_prim), opCol(clr.text_scnd), 0, siz.scr.nav)
              + cls.insertion_word+"{border:"+siz.brd+"px dotted "+clr.msg_faild+"; cursor:pointer;}"
              + cls.insertion_word_dis+"{border:none !important; cursor:none !important; pointer-events:none !important;}"
              + cls.insertion+"{display:none; background:"+opCol(clr.cl_shadow, clr.text_deft)+"; color:rgb("+clr.back_deft+"); "+hiGWid((siz.box_hig - siz.bar - (siz.pdg * 2) - 1), (siz.box_wid - siz.nav_wid - (siz.pdg * 2) - 2), evn.overflowAuto, evn.addHeight)+" top:"+siz.bar+"px; left:1px; position:absolute; border-bottom-left-radius:"+siz.cnr.bx+"px; padding:"+siz.pdg+"px;}"
              + wScrollbar(cls.insertion, opCol(clr.back_prim), opCol(clr.text_scnd), 1, siz.scr.cnt)
              + cls.insertion_popup+"{text-align:right; direction:rtl; width:"+(siz.box_hig + siz.nav_wid)+"px;}"
              + cls.insertion_popup+" "+cls.subpopup_hed+" span{"+hiGWid(siz.bar, ((siz.box_hig + siz.nav_wid) - (siz.bar * 2) - (siz.pdg * 2)), evn.overflowHidden, evn.addHeight)+" display:flex; align-items:center;}"
              + cls.insertion_popup_sel+"{text-align:center; display:flex;}"
              + cls.insertion_popup_sel+" span{cursor:pointer; width:50%; padding:5px;}"
              + cls.insertion_popup_sel+" span:first-of-type{float:right;}"
              + cls.insertion_popup_sel+" span:last-of-type{float:left;}"
     ;
    //=======================================================================================================================
    GM_addStyle(GM_getResourceText("__CSS_THEME_TIP"));
    GM_addStyle(sty);
    //=======================================================================================================================
    function changeAllColor(_ths){
         if($(cls.sty).length) return;
         var _rgba = rgbaAccount(_ths);
         if(_rgba === null) return;
         var _imx = ' !important';
         var _rgb = _rgba[0]+', '+_rgba[1]+', '+_rgba[2];
         var _css = ''
               + '.tippy-tooltip.'+thm+'-theme{border-color:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + cls.hed+'{background:'+opCol(clr.back_prim, _rgb)+_imx+'; border-bottom-color:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + cls.tit+'{color:'+opCol(clr.text_scnd, _rgb)+_imx+';}'
               + cls.material_ico+'{fill:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + cls.ico_main+'{fill:'+opCol(clr.prim_clor, _rgb)+_imx+';}'
               + cls.hover_main+'{background:'+opCol(clr.hovr_brdr, _rgb)+_imx+';}'
               + cls.select_ico+'{fill:'+opCol(clr.prim_clor, _rgb)+_imx+'; background:'+opCol(clr.back_slct, _rgb)+_imx+';}'
               + cls.hover_ico+'{fill:'+opCol(clr.prim_clor, _rgb)+_imx+'; background:'+opCol(clr.hovr_brdr, _rgb)+_imx+';}'
               + cls.dis_ico+'{fill:'+opCol(clr.hovr_brdr, _rgb)+_imx+';}'
               + cls.nav+'{background:'+opCol(clr.back_prim, _rgb)+_imx+'; border-left-color:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + cls.background_even+'{background:'+opCol(clr.back_prim, _rgb)+_imx+';}'
               + wScrollbar(cls.nav, (opCol(clr.back_slct, _rgb) + _imx), (opCol(clr.text_scnd, _rgb) + _imx), 0, 0)
               + wScrollbar(cls.cnt, (opCol(clr.back_prim, _rgb) + _imx), (opCol(clr.text_scnd, _rgb) + _imx), 0, 0)
               + wScrollbar(cls.settings, (opCol(clr.back_prim, _rgb) + _imx), (opCol(clr.text_scnd, _rgb) + _imx), 0, 0)
               + wScrollbar(cls.insertion, (opCol(clr.back_prim, _rgb) + _imx), (opCol(clr.text_scnd, _rgb) + _imx), 0, 0)
               + cls.settings+'{color:'+opCol(clr.prim_clor, _rgb)+_imx+';}'
               + cls.settings+' a{color:'+opCol(clr.prim_clor, _rgb)+_imx+';}'
               + cls.settings_both_btn+'{fill:'+opCol(clr.prim_clor, _rgb)+_imx+'; border-color:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + cls.hed_sprite+'{border-left-color:'+opCol(clr.hovr_brdr, _rgb)+_imx+';}'
               + cls.incorrect_title+'{color:'+opCol(clr.text_scnd, _rgb)+_imx+'; background:'+opCol(clr.back_prim, _rgb)+_imx+'; border-bottom-color:'+opCol(clr.icon_brdr, _rgb)+_imx+';}'
               + wScrollbar(cls.incorrect_table, (opCol(clr.back_prim, _rgb) + _imx), (opCol(clr.text_scnd, _rgb) + _imx), 0, 0)
               + cls.incorrect_table+' table tbody tr:nth-child(even) td{background:'+opCol(clr.back_prim, _rgb)+_imx+';}'
               + cls.incorrect_table_word_old+'{color:'+opCol(clr.back_slct, _rgb)+_imx+';}'
         ;
         $('<style id="'+dotCls(cls.sty)+'">'+_css+'</style>').appendTo('head');
    }

    function rgbaAccount(_ths){
         if(_ths !== null && _ths !== undefined) {
            var _clr = $(_ths).css('color');
            if(_clr !== null && _clr !== undefined) {
                if(unEmptyText(_clr)){
                    var _rgba = colorValues(_clr);
                    if(_rgba !== null && _rgba !== undefined) {
                        return _rgba;
                    }
                }
            }
         }
         return null;
    }
    //=======================================================================================================================
    setInterval(function(){
         $(twit.icoMain).each(function(){
              var _ths = $(this).parent();
              var _pnt = _ths.parent();
              if(! _pnt.find(cls.btn).length){
                   var _elm = _ths.clone().clsAddDel(evn.add, cls.btn);
                   changeAllColor(_elm.find('svg'));
                   labelMain(_elm, _ths);
                   _elm.find('svg').replaceWith("<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico_main)+"'>"+htmlSVG(ico.main)+"</i>");
                   _pnt.append(_elm);
                   dropdownMain($(this));
              }
         });
    }, tim.chk);

    function labelMain(_el, _ths){
         var _elm;
         _el.find('div').each(
              function () {
                   if(unEmptyText($(this).attr('aria-label'))) {
                        _elm = $(this);
                        _elm.attr('aria-label', 'Twitter ARPLS');
                        return false;
                   }
              }
         );
         if(new RegExp(rgx.messagesTwitter).test(window.location)){
              _ths.css('float', 'left').parent().css('display', 'table');
              if(_elm !== null && _elm !== undefined) _elm.css('justify-content', 'center');
         }
    }

    function dropdownMain(_ths){
         htmlMain();
         const insSC = tippy(cls.btn, {
              theme: thm,
              maxWidth: siz.box_wid,
              trigger: 'click',
              interactive: true,
              popperOptions: {positionFixed: true},
              appendTo: document.body,
              flipOnUpdate: true,
              inlinePositioning: true,
              distance: 0,
              content: $(cls.tip).eq(0).html(),
              onShown(instance){showPopupMain(_ths);},
              onHide(instance) {return hidePopupMain();}
         });
         window.tippyMainInstances = tippyMainInstances.concat(insSC);
    }

    function htmlMain(){
        if($(cls.tip).length) return;
        var _htm = ""
               + "<div class='"+dotCls(cls.tip)+"'>"
                    + "<div class='"+dotCls(cls.wap)+"'>"
                         + "<div class='"+dotCls(cls.man)+"'>"
                              + htmlHedMain()
                              + htmlNav()
                              + htmlCntMain()
                         + "</div>"
                    + "</div>"
               + "</div>";
        $('body').append(_htm);
        initEventAll();
    }

    function htmlHedMain(){
         return ""
               + "<div class='"+dotCls(cls.hed)+"'>"
                    + "<div class='"+dotCls(cls.tit)+"'></div>"
                    + "<div class='"+dotCls(cls.hed_btns)+"'>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.dis_ico)+" "+dotCls(cls.btnMenu)+"' "+atr.dataTitle+"='"+lngAR.menu+"'>"+htmlSVG(ico.menu)+"</i>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.dis_ico)+" "+dotCls(cls.btnOk)+"' "+atr.dataTitle+"='"+lngAR.copy+"'>"+htmlSVG(ico.copy)+"</i>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.btnClose)+"' "+atr.dataTitle+"='"+lngAR.close+"'>"+htmlSVG(ico.close)+"</i>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.hed_sprite)+"'></div>"
               + "</div>";
    }

    function htmlCntMain(){
         return ""
               + "<div class='"+dotCls(cls.cnt)+"'>"
                    + "<div class='"+dotCls(cls.txt)+"' contenteditable='false'></div>"
                    + htmlSettings()
                    + htmlMsg()
                    + popupInsertionEmpty()
               + "</div>";
    }

    function hidePopupMain(){
         $(cls.ico_main).parent().parent().clsAddDel(evn.del, cls.hover_main);
         $(cls.ico).attr(atr.processAjax, evn.cancel).clsAddDel(evn.del, cls.select_ico, cls.hover_ico, cls.chosse_ico);
         $(cls.tit).text("");
         elmTxt().attr('contenteditable', 'false').fontS(siz.fnt.txt).html("");
         $(cls.settings).hide();
         $(cls.insertion).hide();
         stopAjax();
         xhrAjax = null;
         htmlShrink = null;
         hijriInsertion = null;
         alertOpenInput = false;
         htmlUndotted = null;
         return true;
    }

    function showPopupMain(_ths){
         msgRest();
         elmTwet = elmTweet(_ths);
         if(elmTwet !== null && elmTwet !== undefined){
              if(! new RegExp(rgx.arabicAllR()).test(elmTwet.text())){
                   elmTxt().html('');
                   msgCall(evn.msgError, '');
              }else{
                   elmTxt().html(elmTwet.html());
              }
         }
         dropdownCopy();
         dropdownMenu();
         sortNav();
    }

    function elmTweet(_ths){
         try {
              var pn = _ths.parents('div');
              for(var i = 0; i < pn.length; i++){
                   var el = pn.eq(i).find(twit.clsElmTwit);
                   if(el.length) return el;
              }
         } catch (e) {}
         return null;
    }

    function initEventAll(){
         initEventMain();
         initEventNav();
         initEventCopy();
         initEventMenu();
         initEventSpellcheck();
         initEventInsertion();
         initEventMsg();
         initEventSettings();
    }

    function initEventMain(){
         $('body')
         .on("click", cls.btnClose, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              tippyMainInstances.forEach(instance => {instance.hide();});
         })
         .on("click", cls.btnOk, function(e){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              $(this).clsAddDel(evn.del, cls.hover_ico).clsAddDel(evn.add, cls.select_ico);
              checkCopy();
         })
         .on("mouseenter", cls.ico_main, function(){
              $(this).parent().parent().clsAddDel(evn.add, cls.hover_main);
         })
         .on("mouseleave", cls.ico_main, function(){
              if($('.tippy-content').length < 1) $(this).parent().parent().clsAddDel(evn.del, cls.hover_main);
         })
         .on("mouseenter", cls.ico + ", " + cls.copy_oky + ", " + cls.copy_ext, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(! $(this).hasClass(dotCls(cls.select_ico))) $(this).clsAddDel(evn.add, cls.hover_ico);
              $(cls.tit).text($(this).attr(atr.dataTitle));
         })
         .on("mouseleave", cls.ico + ", " + cls.copy_oky + ", " + cls.copy_ext, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              $(this).clsAddDel(evn.del, cls.hover_ico);
              $(cls.tit).text("");
         });
    }
    //=======================================================================================================================
    function dropdownMenu(){
         tippy(cls.btnMenu, {
              theme: thm,
              trigger: 'click',
              interactive: true,
              popperOptions: {positionFixed: true},
              flipOnUpdate: true,
              inlinePositioning: true,
              placement: 'top-start',
              distance: 0,
              content: htmlMenu(),
              onShown(instance){
                   $(cls.btnMenu).clsAddDel(evn.del, cls.hover_ico).clsAddDel(evn.add, cls.select_ico);
                   $(cls.ico + ":not("+cls.btnClose+", "+cls.btnMenu+", "+cls.subpopup+" *)").clsAddDel(evn.add, cls.dis_ico).pEvent(evn.del);
              },
              onHide(instance) {
                   $(cls.btnMenu).clsAddDel(evn.del, cls.select_ico);
                   $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
                   return true;
              }
         });
    }

    function htmlMenu(){
         return ""
               + "<div class='"+dotCls(cls.subpopup)+"' style='display:flex;align-items:center;'>"
                    + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.zoom_up)+"' "+atr.dataTitle+"='"+lngAR.upFont+"'>"+htmlSVG(ico.zoomIn)+"</i>"
                    + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.zoom_down)+"' "+atr.dataTitle+"='"+lngAR.downFont+"'>"+htmlSVG(ico.zoomOut)+"</i>"
                    + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.zoom_rest)+"' "+atr.dataTitle+"='"+lngAR.restFont+"'>"+htmlSVG(ico.rest)+"</i>"
               + "</div>";
    }

    function initEventMenu(){
         $('body')
         .on("click", cls.zoom_up, function(){
              elmTxt().fontS((parseFloat(elmTxt().css('font-size')) * 1.2));
         })
         .on("click", cls.zoom_down, function(){
              elmTxt().fontS((parseFloat(elmTxt().css('font-size')) * 0.8));
         })
         .on("click", cls.zoom_rest, function(){
              elmTxt().fontS(siz.fnt.txt);
         });
    }
    //=======================================================================================================================
    function cancelAllNav(_c){
         if(_c !== cls.nav_undotted) removeNavUndotted(evn.apply);
         if(_c !== cls.nav_shrink) removeNavShrink(evn.apply);
         if(_c !== cls.nav_spellcheck) removeNavSpellcheck(evn.apply);
         if(_c !== cls.nav_tashkeel) removeNavTashkeel(evn.apply);
         if(_c !== cls.nav_insertion) removeNavInsertion(evn.apply);
    }

    function toggleNav(_ths){
         if($(_ths).hasClass(dotCls(cls.chosse_ico))){
              $(_ths).clsAddDel(evn.del, cls.chosse_ico, cls.select_ico).clsAddDel(evn.add, cls.hover_ico);
              $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
              return false;
           }else{
              $(_ths).clsAddDel(evn.del, cls.hover_ico).clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
              $(cls.ico + ":not("+cls.btnClose+", "+_ths+", "+cls.settings+" *)").clsAddDel(evn.add, cls.dis_ico).pEvent(evn.del);
              return true;
         }
    }

    function removeNav(_ths, _callback) {
         if(_callback !== undefined) _callback();
         $(_ths).attr(atr.processAjax, evn.cancel).clsAddDel(evn.del, cls.select_ico, cls.chosse_ico, cls.finsh);
         $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
    }

    function icoNav(_c){
         var _fun = function (_c, _l, _i) {
              return "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.dis_ico)+" "+dotCls(_c)+"' "+atr.processAjax+"='"+evn.cancel+"' "+atr.dataTitle+"='"+_l+"'>"+htmlSVG(_i)+"</i>";
         }
         switch (_c) {
               case cls.nav_undotted: return _fun(_c, lngAR.undotted, ico.undotted);
               case cls.nav_shrink: return _fun(_c, lngAR.shrink, ico.shrink);
               case cls.nav_spellcheck: return _fun(_c, lngAR.spellcheck, ico.spellcheck);
               case cls.nav_tashkeel: return _fun(_c, lngAR.tashkeel, ico.tashkeel);
               case cls.nav_insertion: return _fun(_c, lngAR.insertion, ico.insertion);
               case cls.nav_settings: return _fun(_c, lngAR.settings, ico.settings);
         }
    }

    function htmlNav(){
         return ""
               + "<div class='"+dotCls(cls.nav)+"'>"
                    + icoNav(cls.nav_undotted)
                    + icoNav(cls.nav_shrink)
                    + icoNav(cls.nav_spellcheck)
                    + icoNav(cls.nav_tashkeel)
                    + icoNav(cls.nav_insertion)
                    + icoNav(cls.nav_settings)
               + "</div>";
    }

    function defSortNav(){
         return '['
               + '{"name":"'+cls.nav_undotted+'","clicked":0}'
               + ',{"name":"'+cls.nav_shrink+'","clicked":0}'
               + ',{"name":"'+cls.nav_spellcheck+'","clicked":0}'
               + ',{"name":"'+cls.nav_tashkeel+'","clicked":0}'
               + ',{"name":"'+cls.nav_insertion+'","clicked":0}'
          + ']';
    }

    function newNav(){
         return [cls.nav_undotted];
    }

    function updateJsonNav(_jsn){
         var _arr = [];
         $.each(newNav(),function(_i, _v){if(_jsn.indexOf(_v) === -1) _arr[_i] = _v;});
         if(_arr.length){
              var _j = JSON.parse(_jsn);
              $.each(_arr,function(_i, _v){_j.push(JSON.parse('{"name":"'+_v+'","clicked":0}'));});
              var _sj = JSON.stringify(_j);
              GM.setValue(key.navSort, _sj);
              _jsn = _sj;
         }
         return _jsn;
    }

    function sortNav(){
         (async () => {
               var _jsn = await GM.getValue(key.navSort, defSortNav());
               _jsn = updateJsonNav(_jsn);
               var _sort = JSON.parse(_jsn), _arr = [];
               _sort.sort(function(a, b) {
                    var x = a.clicked, y = b.clicked;
                    return (x < y) ? -1 :( x > y) ? 1 : 0;
               });
               $.each(_sort, function() {_arr.push($(this.name).eq(0));});
               $(cls.nav + " i:not("+cls.nav_settings+")").remove();
               $.each(_arr, function() {$(cls.nav).prepend(this);});
         })();
    }

    function clickedNav(_c){
         (async () => {
               var _j = await GM.getValue(key.navSort, defSortNav());
               var _jsn = JSON.parse(_j);
               $.each(_jsn, function(_i, _v) {
                    if(_v.name === _c){
                         _v.clicked = parseInt(_v.clicked + 1, 36);
                         return false;
                    }
               });
               GM.setValue(key.navSort, JSON.stringify(_jsn));
         })();
    }

    function initEventNav(){
         $('body')
         .on("click", cls.nav_shrink, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_shrink)){
                   applyShrink();
              }else{
                   removeNavShrink(evn.remove);
              }
         })
         .on("click", cls.nav_spellcheck, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_spellcheck)){
                   applySpellcheck();
              }else{
                   removeNavSpellcheck(evn.remove);
              }
         })
         .on("click", cls.nav_tashkeel, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_tashkeel)){
                   applyTashkeel();
              }else{
                   removeNavTashkeel(evn.remove);
              }
         })
         .on("click", cls.nav_insertion, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_insertion)){
                   applyInsertion();
              }else{
                   removeNavInsertion(evn.remove);
              }
         })
         .on("click", cls.nav_undotted, function(){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_undotted)){
                   applyUndotted();
              }else{
                   removeNavUndotted(evn.remove);
              }
         })
         .on("click", cls.nav_settings, function(e){
              if($(this).hasClass(dotCls(cls.dis_ico))) return;
              if(toggleNav(cls.nav_settings)){
                   $(cls.settings).show();
              }else{
                   $(cls.settings).hide();
              }
         });
    }
    //=======================================================================================================================
    function dropdownCopy(){
         const insSC = tippy(cls.btnOk, {
              theme: thm,
              trigger: 'click',
              interactive: true,
              popperOptions: {positionFixed: true},
              flipOnUpdate: true,
              inlinePositioning: true,
              distance: 0,
              content: htmlCopy(),
              onShown(instance){
                   $(cls.ico + ":not("+cls.btnClose+", "+cls.btnOk+")").clsAddDel(evn.add, cls.dis_ico).pEvent(evn.del);
              },
              onHide(instance) {
                   $(cls.btnOk).clsAddDel(evn.del, cls.select_ico, cls.hover_ico);
                   $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
                   $(cls.subpopup + " input[name='_copy']").prop('checked', false);
                  return true;
              }
         });
         window.tippyCopyInstances = tippyCopyInstances.concat(insSC);
         tippyCopyInstances.forEach(instance => {instance.enable();});
    }

    function checkCopy(){
         (async () => {
              var KeyMsgCopy = await GM.getValue(key.copy, false);
              if(KeyMsgCopy){
                   tippyCopyInstances.forEach(instance => {instance.disable();});
                   setCopy();
              }
         })();
    }

    function confirmPaste(){
         (async () => {
             var KeyMsgPaste = await GM.getValue(key.paste, false);
             if(! KeyMsgPaste){
                  if (confirm(lngAR.msgPaste)) GM.setValue(key.paste, true);
             }
         })();
    }

    function setCopy(){
         setTimeout(function () {
              elmTxt().attr('contenteditable', 'true').selectText();
              setTimeout(function () {
                   document.execCommand('selectAll', false, null);
                   document.execCommand('copy', false, null);
                   tippyCopyInstances.forEach(instance => {instance.hide();});
                   tippyMainInstances.forEach(instance => {instance.hide();});
                   setTimeout(function () {
                        elmTwet.focus();
                        document.execCommand('selectAll', false, null);
                        tippyMainInstances.forEach(instance => {instance.hide();});
                        confirmPaste();
                   }, tim.cpy);
              }, tim.cpy);
         }, tim.cpy);
    }

    function htmlCopy(){
         return ""
               + "<div class='"+dotCls(cls.subpopup)+"'>"
                    + "<div class='"+dotCls(cls.subpopup_hed)+"'>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.copy_ext)+"' "+atr.dataTitle+"='"+lngAR.cancel+"'>"+htmlSVG(ico.close)+"</i>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.copy_oky)+"' "+atr.dataTitle+"='"+lngAR.ok+"'>"+htmlSVG(ico.ok)+"</i>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.background_even)+"'>"
                         + "<h3>"+lngAR.copyClipboard+"</h3>"
                    + "</div>"
                    + "<div>"
                         + "<label><input type='checkbox' name='_copy'><span>"+lngAR.neverShowAgain+"</span></label>"
                    + "</div>";
               + "</div>";
    }

    function initEventCopy(){
         $('body')
         .on("click", cls.copy_ext, function(){
              tippyCopyInstances.forEach(instance => {instance.hide();});
         })
         .on("click", cls.copy_oky, function(){
              if($(cls.subpopup + " input[name='_copy']").prop("checked")) GM.setValue(key.copy, true);
              setCopy();
         });
    }
    //=======================================================================================================================
    function applyShrink(){
         var _oldHtml = elmTxt().htmlWithoutStyle();
         msgCall(evn.msgWait, '');
         startAjax(cls.nav_shrink);
         try{
             if(checkAjax(cls.nav_shrink)){
                   elmTxt().find('*').each(
                        function (_i1, _t1) {
                            if($(_t1).text().trim().length < 1){
                                 $(this).remove();
                            }
                        }
                   );
                   replaceTxt(rgx.dotRepeat(), '\u060C');
                   replaceTxt(rgx.dontRepeat(), '$1');
                   replaceTxt(rgx.htmlEntities(), '$1');
                   replaceTxt(rgx.dontTatweel(), '');
                   var wordMap = {
                        'جل جلاله' : 'ﷻ',
                        'جلى جلاله' : 'ﷻ',
                        'بسم الله الرحمن الرحيم' : '﷽',
                        'بسم الله' : '﷽',
                        'صلى الله عليه وسلم' : 'ﷺ',
                        'اللهم صلي وسلم عليه' : 'ﷺ',
                        'اللهم صل وسلم عليه' : 'ﷺ',
                        'اللهم صلي عليه' : 'ﷺ',
                        'اللهم صل عليه' : 'ﷺ',
                        'ريال' : '﷼',
                        'محمد' : 'ﷴ',
                        'رسول' : 'ﷶ',
                        'الله' : 'ﷲ'
                   };
                   $.each(wordMap, function(_i, _v){
                        replaceTxt(rgx.findPhrase(_i), '$1'+_v+'$3');
                   });
                   htmlShrink = _oldHtml;
                   cancelAllNav(cls.nav_shrink);
                   clickedNav(cls.nav_shrink);
                   finshAjax(cls.nav_shrink, evn.succeed, lngAR.succeedShrink);
             }
         }catch(_err) {
             finshAjax(cls.nav_shrink, evn.faild, lngAR.failShrink);
         }
    }

    function removeNavShrink(_b){
         var _f = function(){
              if(htmlShrink !== null) elmTxt().html(htmlShrink);
         };
         removeNav(cls.nav_shrink, (_b ? _f : undefined));
    }
    //=======================================================================================================================
    function applySpellcheck(){
         msgCall(evn.msgWait, '');
         startAjax(cls.nav_spellcheck);
         spellcheckAlSharekh(function(_html){
              if(unEmptyText(_html)){
                   resultSpellcheck(_html);
             }else{
                  spellcheckMishkal(function(_html){
                       if(unEmptyText(_html)){
                            resultSpellcheck(_html);
                       }else{
                            finshAjax(cls.nav_spellcheck, evn.faild, lngAR.failSpellcheck);
                       }
                  });
             }
         });
    }

    function spellcheckAlSharekh(_callback){
         try{
              xhrAjax = GM.xmlHttpRequest({
                   method: 'GET',
                   url: 'https://sahehly.com',
                   headers: {'Content-Type': 'application/xhtml+xml;charset=UTF-8'},
                   timeout: tim.xhr,
                   onload: function(_resA) {
                        try{
                             if(! unEmptyText(_resA.responseText)) _callback(null);
                             var _resultA = new RegExp("<script src=\"(main.+?)\"[^>]*?>", "gi").exec(_resA.responseText);
                             if(! unEmptyText(_resultA[1])) _callback(null);
                             xhrAjax = GM.xmlHttpRequest({
                                  method: 'GET',
                                  url: 'https://sahehly.com/'+_resultA[1],
                                  headers: {'Content-Type': 'application/xhtml+xml;charset=UTF-8'},
                                  timeout: tim.xhr,
                                  onload: function(_resB) {
                                       try{
                                            if(! unEmptyText(_resB.responseText)) _callback(null);
                                            var _resultB = RegExp("Authorization[\s]*:[\s]*\"([^\"]*?)\"", "gi").exec(_resB.responseText);
                                            if(! unEmptyText(_resultB[1])) _callback(null);
                                            xhrAjax = GM.xmlHttpRequest({
                                                 method: 'POST',
                                                 url: 'https://cwg.sahehly.com/Diac/Sahehly',
                                                 data: '{"type":"SWeb","word":"'+texNeat()+'","gFlag":true}',
                                                 headers: {
                                                      'Content-Type': 'application/json;charset=UTF-8',
                                                      'Authorization': _resultB[1]
                                                 },
                                                 timeout: tim.xhr,
                                                 onload: function(_resC) {
                                                      try{
                                                           if(! unEmptyText(_resC.responseText)) _callback(null);
                                                           var _elm = elmTxt().clone();
                                                           $.each($.parseJSON(_resC.responseText).wordPositions, function (_i, _v) {
                                                                if(! unEmptyText(_v.word.removeTatweel().removeTashkeel().dontArbicSpaceToSpace())) return;
                                                                var _wrongWord = _v.wrongWord;
                                                                if(! unEmptyText(_wrongWord.removeTatweel().removeTashkeel().dontArbicSpaceToSpace())) return;
                                                                _v.suggetions.unshift(_v.word);
                                                                _v.suggetions.push(_wrongWord);
                                                                var _suggetionStrings = _v.suggetions.filter((_fv, _fi, _fa) => _fa.indexOf(_fv) === _fi).join(';');
                                                                if(! unEmptyText(_suggetionStrings.removeTatweel().removeTashkeel().dontArbicSpaceToSpace())) return;
                                                                replaceTxtSpellcheck(
                                                                     _elm,
                                                                     rgx.findWord(_wrongWord),
                                                                     '$1'+
                                                                     '<span class="'+dotCls(cls.incorrect_word)+' '+dotCls(cls.ico)+'" '+atr.dataOld+'="'+_wrongWord+'" '+atr.dataIncorrect+'="'+_suggetionStrings+'" '+atr.dataId+'="'+dotCls(cls.incorrect_word)+'_'+_i+'">' +
                                                                            _wrongWord +
                                                                     '</span>' +
                                                                     '$3'
                                                                );
                                                           });
                                                           _callback(_elm.html());
                                                      }catch(_err) {
                                                           _callback(null);
                                                      }
                                                 },
                                                 ontimeout: function(){_callback(null);},
                                                 onerror: function(){_callback(null);}
                                            });
                                       }catch(_err) {
                                            _callback(null);
                                       }
                                  },
                                  ontimeout: function(){_callback(null);},
                                  onerror: function(){_callback(null);}
                             });
                        }catch(_err) {
                             _callback(null);
                        }
                   },
                   ontimeout: function(){_callback(null);},
                   onerror: function(){_callback(null);}
              });
         }catch(_err) {
              _callback(null);
         }
    }

    function spellcheckMishkal(_callback){
         try{
              xhrAjax = GM.xmlHttpRequest({
                   method: 'GET',
                   url: 'https://tahadz.com/cgi-bin/mishkal.cgi/ajaxGet?text='+encodeURIComponent(texNeat())+'&action=SpellCheck&order=0&lastmark=1',
                   headers: {
                        'Content-Type': 'application/x-javascript;charset=UTF-8',
                        'Accept' : 'application/json'
                   },
                   timeout: tim.xhr,
                   onload: function(_res) {
                        try{
                             var _elm = elmTxt().clone();
                             var _result = true;
                             $.each($.parseJSON(_res.responseText).result, function (_i, _v) {
                                  var chosen = _v.chosen;
                                  if(chosen.toLowerCase() === 'taha' || chosen.toLowerCase() === 'zerrouki') {
                                      _result = false;
                                      return false;
                                  }
                                  if(! unEmptyText(chosen.removeTatweel().removeTashkeel().dontArbicSpaceToSpace())) return;
                                  var suggest = _v.suggest;
                                  if(! unEmptyText(suggest.removeTatweel().removeTashkeel().dontArbicSpaceToSpace())) return;
                                  suggest = suggest.split(new RegExp(';', 'g')).filter(e => e !== chosen);
                                  suggest = [...new Set(suggest)];
                                  if(suggest.length < 1) return;
                                  suggest = suggest.join(';') + ";" + chosen;
                                  replaceTxtSpellcheck(
                                       _elm,
                                       rgx.findWord(chosen),
                                       '$1'+
                                       '<span class="'+dotCls(cls.incorrect_word)+' '+dotCls(cls.ico)+'" '+atr.dataOld+'="'+chosen+'" '+atr.dataIncorrect+'="'+suggest+'" '+atr.dataId+'="'+dotCls(cls.incorrect_word)+'_'+_i+'">' +
                                              chosen +
                                       '</span>' +
                                       '$3'
                                  );
                             });
                             if(_result){
                                  _callback(_elm.html());
                             }else{
                                  _callback(null);
                             }
                        }catch(_err) {
                             _callback(null);
                        }
                   },
                   ontimeout: function(){_callback(null);},
                   onerror: function(){_callback(null);}
              });
         }catch(_err) {
              _callback(null);
         }
    }

    function resultSpellcheck(_html){
         if(checkAjax(cls.nav_spellcheck)){
             elmTxt().html(_html);
             dropdownSpellcheck();
             cancelAllNav(cls.nav_spellcheck);
             clickedNav(cls.nav_spellcheck);
             finshAjax(cls.nav_spellcheck, evn.succeed, lngAR.succeedSpellcheck);
         }
    }

    function replaceTxtSpellcheck(_em, _rx, _to){
         _em.find('*').each(
             function (_i, _t) {
                   $(this).html(
                        function (_k, _x) {
                             return _x.regexpReplace(_rx, _to);
                        }
                   );
             }
         );
    }

    function dropdownSpellcheck(){
         const insSC = tippy(cls.incorrect_word, {
              theme: thm,
              trigger: 'click',
              interactive: true,
              popperOptions: {positionFixed: true},
              flipOnUpdate: true,
              inlinePositioning: true,
              sticky: true,
              content: htmlSpellcheck(),
              onShown(instance){
                   $(instance.reference).clsAddDel(evn.add, cls.select_ico);
                   var _id = $(instance.reference).attr(atr.dataId);
                   var _dataOld = $(instance.reference).attr(atr.dataOld);
                   var _suggest = $(instance.reference).attr(atr.dataIncorrect).split(new RegExp(';', 'g'));
                   var _html = '';
                   $.each(_suggest, function (_i, _v) {
                        _html += '<tr'+(_dataOld === _v ? ' class="'+dotCls(cls.incorrect_table_word_old)+'"' : '')+'>' +
                                        '<td class="" '+atr.dataId+'="'+_id+'">'+_v+'</td>' +
                                 '</tr>';
                   });
                   $('.tippy-content').find(cls.incorrect_table + ' tbody').html(_html);
              },
              onHide(instance) {
                   $(instance.reference).clsAddDel(evn.del, cls.select_ico);
                   return true;
              }
         });
         window.tippySpellcheckInstances = tippySpellcheckInstances.concat(insSC);
    }

    function elmIncorrectWord(_ths){
         return $(cls.incorrect_word+'['+atr.dataId+'="'+$(_ths).attr(atr.dataId)+'"]');
    }

    function removeNavSpellcheck(_b){
         removeNav(cls.nav_spellcheck, function(){
              $(cls.incorrect_word).replaceWith(function() { return _b ? $(this).attr(atr.dataOld) : $(this).text(); });
         });
    }

    function htmlSpellcheck(){
         return ""
              + "<div class='"+dotCls(cls.subpopup)+" "+dotCls(cls.incorrect_popup)+"'>"
                   + "<div class='"+dotCls(cls.incorrect_title)+"'><span>"+lngAR.selectWord+"</span></div>"
                   + "<div class='"+dotCls(cls.incorrect_table)+"'>"
                        + "<table>"
                             + "<tbody></tbody>"
                        + "</table>"
                   + "</div>"
              + "</div>";
    }

    function initEventSpellcheck(){
         $('body')
         .on("click", cls.incorrect_table + " td", function(){
              elmIncorrectWord(this).text($(this).text()).css('border-bottom', 'hidden');
              if(elmIncorrectWord(this).attr(atr.dataOld) === $(this).text()){
                   elmIncorrectWord(this).css('border-bottom', '');
              }else{
                   elmIncorrectWord(this).css('border-bottom', 'hidden');
              }
              tippySpellcheckInstances.forEach(instance => {instance.hide();});
         })
         .on("mouseenter", cls.incorrect_table + " tr", function(){
              $(this).clsAddDel(evn.add, cls.select_ico);
         })
         .on("mouseleave", cls.incorrect_table + " tr", function(){
              $(this).clsAddDel(evn.del, cls.select_ico);
         });
    }
    //=======================================================================================================================
    function applyTashkeel(){
         msgCall(evn.msgWait, '');
         startAjax(cls.nav_tashkeel);
         tashkeelAlSharekh(function(_val){
              if(unEmptyText(_val)){
                   resultTashkeel(cls.nav_tashkeel, _val);
             }else{
                  tashkeelMishkal(function(_val){
                       if(unEmptyText(_val)){
                            resultTashkeel(cls.nav_tashkeel, _val);
                       }else{
                            finshAjax(cls.nav_tashkeel, evn.faild, lngAR.failTashkeel);
                       }
                  });
             }
         });
    }

    function tashkeelAlSharekh(_callback){
         try{
              xhrAjax = GM.xmlHttpRequest({
                   method: 'GET',
                   url: 'https://tashkeel.alsharekh.org',
                   headers: {'Content-Type': 'application/xhtml+xml;charset=UTF-8'},
                   timeout: tim.xhr,
                   onload: function(_resA) {
                        try{
                             if(! unEmptyText(_resA.responseText)) _callback(null);
                             var _resultA = new RegExp("<script src=\"(main.+?)\"[^>]*?>", "gi").exec(_resA.responseText);
                             if(! unEmptyText(_resultA[1])) _callback(null);
                             xhrAjax = GM.xmlHttpRequest({
                                  method: 'GET',
                                  url: 'https://tashkeel.alsharekh.org/'+_resultA[1],
                                  headers: {'Content-Type': 'application/xhtml+xml;charset=UTF-8'},
                                  timeout: tim.xhr,
                                  onload: function(_resB) {
                                       try{
                                            if(! unEmptyText(_resB.responseText)) _callback(null);
                                            var _resultB = RegExp("Authorization[\s]*:[\s]*\"([^\"]*?)\"", "gi").exec(_resB.responseText);
                                            if(! unEmptyText(_resultB[1])) _callback(null);
                                            xhrAjax = GM.xmlHttpRequest({
                                                 method: 'POST',
                                                 url: 'https://diac.alsharekh.org/Diac/DiacText',
                                                 data: '{"word":"'+texNeat()+'","type":1,"source":"Web"}',
                                                 headers: {
                                                      'Content-Type': 'application/json;charset=UTF-8',
                                                      'Authorization': _resultB[1]
                                                 },
                                                 timeout: tim.xhr,
                                                 onload: function(_resC) {
                                                      try{
                                                           if(! unEmptyText(_resC.responseText)) _callback(null);
                                                           var _diacWord = $.parseJSON(_resC.responseText).diacWord;
                                                           if(! unEmptyText(_diacWord)) _callback(null);
                                                           var _text = $("<div/>").html(_diacWord).text();
                                                           if(! unEmptyText(_text)) _callback(null);
                                                           _callback(_text);
                                                      }catch(_err) {
                                                           _callback(null);
                                                      }
                                                 },
                                                 ontimeout: function(){_callback(null);},
                                                 onerror: function(){_callback(null);}
                                            });
                                       }catch(_err) {
                                            _callback(null);
                                       }
                                  },
                                  ontimeout: function(){_callback(null);},
                                  onerror: function(){_callback(null);}
                             });
                        }catch(_err) {
                             _callback(null);
                        }
                   },
                   ontimeout: function(){_callback(null);},
                   onerror: function(){_callback(null);}
              });
         }catch(_err) {
              _callback(null);
         }
    }

    function tashkeelMishkal(_callback){
         try{
             xhrAjax = GM.xmlHttpRequest({
                  method: 'GET',
                  url: 'https://tahadz.com/cgi-bin/mishkal.cgi/ajaxGet?text='+encodeURIComponent(texNeat())+'&action=Tashkeel2&order=0&lastmark=1',
                  headers: {
                       'Content-Type': 'application/x-javascript;charset=UTF-8',
                       'Accept' : 'application/json'
                  },
                  timeout: tim.xhr,
                  onload: function(_res) {
                       try{
                            var _result = '';
                            $.each($.parseJSON(_res.responseText).result, function (_i, _v) {
                                 _result += _v.chosen + ' ';
                                 if(_v.chosen.toLowerCase() === 'taha' || _v.chosen.toLowerCase() === 'zerrouki'){
                                      _result = '';
                                      return false;
                                 }
                            });
                            _callback(_result.regexpReplace(rgx.dlEnterSpace, ' ').trim());
                       }catch(_err) {
                            _callback(null);
                       }
                  },
                  ontimeout: function(){_callback(null);},
                  onerror: function(){_callback(null);}
             });
         }catch(_err) {
             _callback(null);
         }
    }

    function resultTashkeel(_ths, _val){
         if(checkAjax(_ths)){
              var _html = elmTxt().html().removeTatweel().removeTashkeel();
              elmTxt().html(_html);
              $.each(
                   _val.split(' '),
                   function(_i, _v) {
                        replaceTxt(rgx.findWord(_v.removeTashkeel()), '$1'+_v+'$3');
                   }
              );
              cancelAllNav(_ths);
              clickedNav(_ths);
              finshAjax(_ths, evn.succeed, lngAR.succeedTashkeel);
         }
    }

    function removeNavTashkeel(_b){
         var _f = function(){
              elmTxt().html(elmTxt().html().removeTatweel().removeTashkeel());
         };
         removeNav(cls.nav_tashkeel, (_b ? _f : undefined));
    }
    //=======================================================================================================================
    function removeNavInsertion(_b){
         if(_b){
              removeNav(cls.nav_insertion, function(){
                  $(cls.insertion).hide();
                  $(cls.insertion_word).replaceWith(function() { return $(this).attr(atr.dataCode); });
             });
        }else{
             $(cls.insertion_word).clsAddDel(evn.add, cls.insertion_word_dis);
             removeNav(cls.nav_insertion);
        }
    }

    function applyInsertion(){
         (async () => {
              jsonInsertion = await GM.getValue(key.insertion, defaultJsonInsertion);
              try{
                   if($(cls.insertion_word).length){
                        $(cls.insertion_word).clsAddDel(evn.del, cls.insertion_word_dis);
                        okyInsertion();
                        return;
                   }
                   if(checkInsertion()){
                        $(cls.insertion).hide();
                        msgCall(evn.msgWait, '');
                        startAjax(cls.nav_insertion);
                        try {
                             if(checkHijriInsertion()){
                                  if(unEmptyText(hijriInsertion)){
                                       okyInsertion(hijriInsertion);
                                  }else{
                                       ajaxHijriInsertion(function(_val){okyInsertion(_val);});
                                  }
                             }else{
                                  okyInsertion(null);
                             }
                        } catch (_err) {
                             finshAjax(cls.nav_insertion, evn.faild, lngAR.failInsertion);
                        }
                   }else{
                        tableInsertionEmpty();
                        $(cls.insertion).show();
                   }
             }catch(_err) {}
         })();
    }

    function okyInsertion(_val){
         if(_val !== undefined) replaceInsertion(_val);
         dropdownInsertion();
         cancelAllNav(cls.nav_insertion);
         clickedNav(cls.nav_insertion);
         finshAjax(cls.nav_insertion, evn.succeed, lngAR.succeedInsertion);
    }

    function ajaxHijriInsertion(_callback){
         try{
             xhrAjax = GM.xmlHttpRequest({
                  method: 'GET',
                  url: 'http://www.ummulqura.org.sa',
                  headers: {'Content-Type': 'text/html;charset=UTF-8'},
                  timeout: tim.xhr,
                  onload: function(_res) {
                       try{
                            var _d = $(_res.responseText).find('span[id$=_lblHDay]').text();
                            var _m = $(_res.responseText).find('span[id$=_lblHMonthNumber]').text();
                            var _y = $(_res.responseText).find('span[id$=_lblHYear]').text();
                            hijriInsertion = (_d + '-' + (_m - 1) + '-' + _y);
                            _callback(hijriInsertion);
                       }catch(_err) {
                            _callback(null);
                       }
                  },
                  ontimeout: function(){_callback(null);},
                  onerror: function(){_callback(null);}
             });
         }catch(_err) {
             _callback(null);
         }
    }

    function dropdownInsertion(){
         const insSC = tippy(cls.insertion_word, {
              theme: thm,
              trigger: 'click',
              interactive: true,
              popperOptions: {positionFixed: true},
              flipOnUpdate: true,
              inlinePositioning: true,
              sticky: true,
              content: popupInsertionWord(),
              onShown(instance) { showPopupInsertion(instance); },
              onHide(instance) { return hidePopupInsertion(instance); }
         });
         window.tippyInsertionInstances = tippyInsertionInstances.concat(insSC);
    }

    function showPopupInsertion(instance){
         $(instance.reference).clsAddDel(evn.add, cls.select_ico);
         var _elm = $(instance.reference);
         var _cls_sel = (cls.insertion_popup + " " + cls.insertion_popup_sel);
         var _cls_put = (cls.insertion_popup + " input");
         var _cls_spn = (_cls_sel + " span");
         var _cls_dtH = (_cls_spn + "["+atr.dataType+"='"+atr.dateHijri+"']");
         var _code = _elm.attr(atr.dataCode);
         var _format = _elm.attr(atr.dataFormat);
         var _type = _elm.attr(atr.dataType);
         var _lang = _elm.attr(atr.dataLang);
         $(cls.insertion_popup + " " + cls.subpopup_hed + " span").text(lngAR.codeTitle + _code);
         $(_cls_put + "[type='text']").val(decodeURIComponent(_format)).attr(atr.dataCode, _code);
         $(_cls_spn).clsAddDel(evn.del, cls.select_ico, cls.chosse_ico);
         if(_type === atr.word){
              $(_cls_sel).hide();
              $(_cls_put + "["+atr.dataDefault+"]").parent().find("span").text(lngAR.replaceAlways);
              $(cls.insertion_popup + " " + cls.background_even + " input[type='text']").attr('placeholder', '');
         }else if(_type === atr.time){
              $(_cls_dtH).parent().hide();
         }else{
              $(_cls_dtH).parent().show();
              if(! unEmptyText(hijriInsertion)) ajaxHijriInsertion(function(_val){hijriInsertion = _val;});
              if(_type === atr.dateHijri){
                   $(_cls_dtH).clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
              }else{
                   $(_cls_spn + "["+atr.dataType+"='"+atr.dateGregorian+"']").clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
              }
         }
         if(_lang === atr.langAR){
              $(_cls_spn + "["+atr.dataLang+"='"+atr.langAR+"']").clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
         }else{
              $(_cls_spn + "["+atr.dataLang+"='"+atr.langEN+"']").clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
         }
         $(_cls_put + "[type='checkbox']").prop('checked', false);
         $(_cls_put + "["+atr.dataAll+"]").attr(atr.dataAll, evn.no);
         $(_cls_put + "["+atr.dataDefault+"]").attr(atr.dataDefault, evn.no);
    }

    function hidePopupInsertion(instance){
         cancelInsertion();
         $(instance.reference).clsAddDel(evn.del, cls.select_ico);
         setTimeout(function(){try{if(xhrAjax !== null) xhrAjax.abort();}catch(_err){}},tim.run);
         return true;
    }

    function replaceInsertion(_hj){
         $.each(
              $.parseJSON(jsonInsertion),
              function(_i, _v) {
                   replaceTxt(
                        rgx.findAny(_v.code),
                        '<span '
                              + 'class="'+dotCls(cls.insertion_word)+' '+dotCls(cls.ico)+'" '
                              + atr.dataFormat + '="'+_v.format+'" '
                              + atr.dataType + '="'+_v.type+'" '
                              + atr.dataLang + '="'+_v.lang+'" '
                              + atr.dataCode + '="$1">'
                              + formatInsertion(_v.type, _v.lang, _v.format, _hj)
                         + '</span>'
                   );
              }
         );
    }

    function formatInsertion(_type, _lang, _format, _hj){
         if(_type === atr.word){
              return decodeURIComponent(_format);
         }
         if(_type === atr.time && _lang === atr.langAR){
              return moment().locale(atr.langAR+'-rakan938').format(decodeURIComponent(_format));
         }
         if(_type === atr.dateHijri && unEmptyText(_hj)){
              try{
                   var _h = _hj.split('-');
                   return moment().year(_h[2]).month(_h[1]).date(_h[0]).locale(_lang+'-rakan938').format(decodeURIComponent(_format));
              } catch (e) {
                   return moment().locale(_lang).format(decodeURIComponent(_format));
              }
         }
         return moment().locale(_lang).format(decodeURIComponent(_format));
    }

    function checkHijriInsertion(){
         var _r = false;
         try {
              $.each($.parseJSON(jsonInsertion), function(_i, _v) {
                   if(_v.type === atr.dateHijri){
                        _r = new RegExp(escapeRegExp(_v.code)).test(elmTxt().text());
                        return false;
                   }
             });
         } catch (e) {}
         return _r;
    }

    function checkInsertion(){
         var _code = regxCodeInsertion();
         if(unEmptyText(_code)){
              return new RegExp(_code).test(elmTxt().text());
         }else{
              return false;
         }
    }

    function regxCodeInsertion(){
         try {
              var _code = '';
              $.each($.parseJSON(jsonInsertion), function(_i, _v) {_code += '(' + escapeRegExp(_v.code) + ')|';});
              if(unEmptyText(_code)) return _code.substr(0, (_code.length - 1));
         } catch (e) {}
         return '';
    }

    function updateInsertion(_b){
         var _code = chg.time.old, _format = 'hh:mm A', _type = atr.time, _lang = atr.langAR, _save = evn.no, _all = evn.no;
         var _format_val = $(cls.insertion_popup + " input[type='text']").val();
         if(_b === evn.key && lastUpdateInsertion === _format_val) return;
         if(! unEmptyText(_format_val)) return;
         lastUpdateInsertion = _format_val;
         if(unEmptyText(_format_val)) _format = _format_val;
         var _code_val = $(cls.insertion_popup + " input[type='text']").attr(atr.dataCode);
         if(unEmptyText(_code_val)) _code = _code_val;
         $(cls.insertion_popup_sel + " " + cls.chosse_ico).each(function() {
              if(unEmptyText($(this).attr(atr.dataType))) _type = $(this).attr(atr.dataType);
              if(unEmptyText($(this).attr(atr.dataLang))) _lang = $(this).attr(atr.dataLang);
         });
         if($(cls.insertion_popup_sel).eq(1).is(":hidden")) _type = atr.word;
         $(cls.insertion_popup + " input[type='checkbox']").each(function() {
              var _save_val = $(this).attr(atr.dataDefault);
              var _all_val = $(this).attr(atr.dataAll);
              if(unEmptyText(_save_val)) _save =_save_val;
              if(unEmptyText(_all_val)) _all =_all_val;
         });
         var _formatInsertion = formatInsertion(_type, _lang, _format, (_type === atr.dateHijri ?  hijriInsertion : null));
         if(_b === evn.done){
              if(_all === evn.yes){
                   $(cls.insertion_word + "["+atr.dataCode+"='"+_code+"']")
                         .text(_formatInsertion)
                         .attr(atr.dataFormat, encodeURIComponent(_format))
                         .attr(atr.dataType, _type)
                         .attr(atr.dataLang, _lang)
                    ;
              }else{
                   $(cls.insertion_word + cls.select_ico)
                         .text(_formatInsertion)
                         .attr(atr.dataFormat, encodeURIComponent(_format))
                         .attr(atr.dataType, _type)
                         .attr(atr.dataLang, _lang)
                    ;
              }
              if(_save === evn.yes){
                   //console.log('UPDATE JSON');
                   var _jsn = JSON.parse(jsonInsertion);
                   $.each(_jsn, function(_i, _v) {
                        if(_v.code === _code){
                             _v.format = encodeURIComponent(_format);
                             _v.type = _type;
                             _v.lang = _lang;
                             if(_v.type === atr.word){
                                  _v.title = encodeURIComponent('('+_format+')');
                             }
                             return false;
                        }
                   });
                   jsonInsertion = JSON.stringify(_jsn);
                   GM.setValue(key.insertion, jsonInsertion);
              }
              tippyInsertionInstances.forEach(instance => {instance.hide();});
         }else{
              $(cls.insertion_word + cls.select_ico).text(_formatInsertion);
         }
    }

    function cancelInsertion(){
         try{
              var _elm = $(cls.insertion_word + cls.select_ico);
              var _type = _elm.attr(atr.dataType);
             _elm.text(
                  formatInsertion(
                       _type,
                       _elm.attr(atr.dataLang),
                       _elm.attr(atr.dataFormat),
                       (_type === atr.dateHijri ?  hijriInsertion : null)
                  )
             );
         }catch(_err){}
    }

    function initEventInsertion(){
         $('body')
         .on("click", cls.insertion_popup_sel + " span:not("+cls.chosse_ico+")", function(){
              $(this).parent().find('span').clsAddDel(evn.del, cls.hover_ico, cls.select_ico, cls.chosse_ico);
              $(this).clsAddDel(evn.add, cls.select_ico, cls.chosse_ico);
              updateInsertion(evn.change);
         })
         .on("click", cls.insertion_popup + " " + cls.material_ico, function(){
              if($(this).attr(atr.dataTitle) === lngAR.cancel){
                   tippyInsertionInstances.forEach(instance => {instance.hide();});
              }else if($(this).attr(atr.dataTitle) === lngAR.ok){
                   updateInsertion(evn.done);
              }
         })
         .on("click", cls.insertion_popup + " input[type='text']", function(){
              if(alertOpenInput) return;
              if($(twit.modalHeader).length) openInput(this);
         })
         .on("change", cls.insertion_popup + " input[type='checkbox']", function(){
              if(unEmptyText($(this).attr(atr.dataAll))) $(this).attr(atr.dataAll, $(this).prop("checked") ? evn.yes : evn.no);
              if(unEmptyText($(this).attr(atr.dataDefault))) $(this).attr(atr.dataDefault, $(this).prop("checked") ? evn.yes : evn.no);
         })
         .on("keyup", cls.insertion_popup + " input[type='text']", function(){
              updateInsertion(evn.key);
         })
         .on("paste cut", cls.insertion_popup + " input[type='text']", function(){
              setTimeout(function(){updateInsertion(evn.key);},tim.run);
         })
         .on("mouseenter", cls.insertion_popup_sel + " span:not("+cls.chosse_ico+")", function(){
              $(this).clsAddDel(evn.add, cls.hover_ico);
         })
         .on("mouseleave", cls.insertion_popup_sel + " span:not("+cls.chosse_ico+")", function(){
              $(this).clsAddDel(evn.del, cls.hover_ico);
         });
    }

    function tableInsertionEmpty(){
        (async () => {
            try{
                jsonInsertion = await GM.getValue(key.insertion, defaultJsonInsertion);
                $(cls.insertion_empty).empty();
                $.each($.parseJSON(jsonInsertion), function(_i, _v) {
                    var _dv = "<p><div class='"+dotCls(cls.insertion_empty_item)+"'>"
                        + "<div class='"+dotCls(cls.insertion_empty_item_ow)+"'>"+decodeURIComponent(_v.code)+"</div>"
                        + "<div class='"+dotCls(cls.insertion_empty_item_ow)+"' style='text-align:center; margin:0 "+siz.pdg+"px 0 "+siz.pdg+"px;'>"+lngAR.willReplaced+"</div>"
                        + "<div class='"+dotCls(cls.insertion_empty_item_ow)+"' style='text-align:left; width:40% !important;'>"+lngAR.b+decodeURIComponent(_v.title)+"</div>"
                    + '</div>';
                    $(_dv).appendTo(cls.insertion_empty);
                });
            } catch (e) {}
        })();
    }

    function popupInsertionEmpty(){
         return ""
               + "<div class='"+dotCls(cls.insertion)+"'>"
                    + "<span style='font-weight:bold;'>"+lngAR.titleInsertion+"</span>"
                    + "<div class='"+dotCls(cls.insertion_empty)+"' />"
               + "</div>";
    }

    function popupInsertionWord(){
         return ""
               + "<div class='"+dotCls(cls.subpopup)+" "+dotCls(cls.insertion_popup)+"'>"
                    + "<div class='"+dotCls(cls.subpopup_hed)+"'>"
                         + "<span></span>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+"' "+atr.dataTitle+"='"+lngAR.cancel+"'>"+htmlSVG(ico.close)+"</i>"
                         + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+"' "+atr.dataTitle+"='"+lngAR.ok+"'>"+htmlSVG(ico.ok)+"</i>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.background_even)+"'>"
                         + "<input "+atr.dataCode+"='' type='text' value='' placeholder='"+lngAR.WriteFormat+"'>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.insertion_popup_sel)+"'>"
                         + "<span "+atr.dataType+"='"+atr.dateHijri+"'>"+lngAR.hijri+"</span>"
                         + "<span "+atr.dataType+"='"+atr.dateGregorian+"'>"+lngAR.gregorian+"</span>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.insertion_popup_sel)+"'>"
                         + "<span "+atr.dataLang+"='"+atr.langAR+"'>"+lngAR.arabic+"</span>"
                         + "<span "+atr.dataLang+"='"+atr.langEN+"'>"+lngAR.einglish+"</span>"
                    + "</div>"
                    + "<div class='"+dotCls(cls.background_even)+"'>"
                         + "<label><input type='checkbox' "+atr.dataAll+"='"+evn.no+"'><span>"+lngAR.applyAll+"</span></label>"
                    + "</div>"
                    + "<div>"
                         + "<label><input type='checkbox' "+atr.dataDefault+"='"+evn.no+"'><span>"+lngAR.defaultFormat+"</span></label>"
                    + "</div>"
               + "</div>";
    }
    //=======================================================================================================================
    function applyUndotted(){
         var _oldHtml = elmTxt().htmlWithoutStyle();
         msgCall(evn.msgWait, '');
         startAjax(cls.nav_undotted);
         try{
              htmlUndotted = _oldHtml;
              var dotlessMap = {
                   '\u0628':'\u066E',
                   '\u062A':'\u066E',
                   '\u062B':'\u066E',
                   '\u0630':'\u062F',
                   '\u0632':'\u0631',
                   '\u062C':'\u062D',
                   '\u062E':'\u062D',
                   '\u0634':'\u0633',
                   '\u0636':'\u0635',
                   '\u0638':'\u0637',
                   '\u063A':'\u0639',
                   '\u0642':'\u066F',
                   '\u0643':'\u06AA',
                   '\u0641':'\u06A1',
                   '\u064A':'\u0649',
                   '\u0629':'\u0647',
                   '\u0646':'\u06BA',
                   '\u0625':'\u0627',
                   '\u0623':'\u0627',
                   '\u0622':'\u0627',
                   '\u0626':'\u0649',
                   '\u0624':'\u0648'
              };
              replaceTxt(rgx.fixNoon(), '\u066E$2');
              $.each(dotlessMap, function(_i, _v){replaceTxt(rgx.findAny(_i), _v);});
              cancelAllNav(cls.nav_undotted);
              clickedNav(cls.nav_undotted);
              finshAjax(cls.nav_undotted, evn.succeed, lngAR.succeedUndotted);
         }catch(_err) {
             finshAjax(cls.nav_undotted, evn.faild, lngAR.failUndotted);
         }
    }

    function removeNavUndotted(_b){
         var _f = function(){
              if(htmlUndotted !== null) elmTxt().html(htmlUndotted);
         };
         removeNav(cls.nav_undotted, (_b ? _f : undefined));
    }
    //=======================================================================================================================
    function startAjax(_c){
         $(_c).attr(atr.processAjax, evn.process).clsAddDel(evn.del, cls.finsh).clsAddDel(evn.add, cls.dis_ico).pEvent(evn.del);
    }

    function checkAjax(_c) {
         return $(_c).attr(atr.processAjax) === evn.process;
    }

    function stopAjax(){
        try{if(xhrAjax !== null) xhrAjax.abort();}catch(_err){}
        msgRest();
        $(cls.chosse_ico + ':not('+cls.finsh+')').clsAddDel(evn.del, cls.hover_ico, cls.select_ico, cls.chosse_ico);
        $(cls.ico).attr(atr.processAjax, evn.cancel).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
    }

    function finshAjax(_ths, _b, _tit){
         if(! checkAjax(_ths)) return;
         $(_ths).pEvent(evn.add).attr(atr.processAjax, evn.cancel);
         $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
         if(_b === evn.succeed){
              $(_ths).clsAddDel(evn.add, cls.finsh);
              msgCall(evn.msgDone, _tit);
         }else{
              $(_ths).clsAddDel(evn.del, cls.select_ico, cls.chosse_ico);
              msgCall(evn.msgFaild, _tit);
         }
    }
    //=======================================================================================================================
    function msgRest(){
         $(cls.msg).hide();
         $(cls.ico).clsAddDel(evn.del, cls.dis_ico).pEvent(evn.add);
         $(cls.wap).unbind('click');
         $(cls.msg_ico).unbind('click').show();
         clearInterval(msgInterval);
    }

    function msgCall(_typ, _tit){
         msgRest();
         var _ico, _col, _ext, _hid, _tim, _txt, _cll;
         switch (_typ) {
               case evn.msgError:
                    _col = clr.msg_error;
                    _ico = ico.error;
                    _hid = null;
                    _tim = 0;
                    _ext = lngAR.close;
                    _txt = lngAR.emptyText;
                    _cll = function(){msgRest();};
                    break;
               case evn.msgFaild:
                    _col = clr.msg_faild;
                    _ico = ico.fail;
                    _hid = cls.wap;
                    _tim = tim.msgFaild;
                    _ext = lngAR.close;
                    _txt = _tit;
                    _cll = function(){msgRest();};
                    break;
               case evn.msgDone:
                    _col = clr.msg_doney;
                    _ico = ico.done;
                    _hid = cls.wap;
                    _tim = tim.msgDoney;
                    _ext = lngAR.close;
                    _txt = _tit;
                    _cll = function(){msgRest();};
                    break;
              default:
                    _col = clr.msg_await;
                    _ico = ico.wait;
                    _hid = cls.msg_ico;
                    _tim = 0;
                    _ext = lngAR.cancel;
                    _txt = lngAR.pleaseWait;
                    _cll = function(){stopAjax();};
                    break;
         }
         $(cls.ico + ":not("+cls.btnClose+")").clsAddDel(evn.add, cls.dis_ico).pEvent(evn.del);
         $(cls.msg).css('background', _col);
         $(cls.msg_img + ' i').html(htmlSVG(_ico));
         $(cls.msg_txt).text(_txt);
         $(cls.msg_ico).attr(atr.dataTitle, _ext);
         if(_hid !== null){
              $(cls.msg_ico).show();
              $(_hid).click(function(){setTimeout(function(){_cll();},tim.run);});
         }else{
              $(cls.msg_ico).hide();
         }
         if(_tim > 0){
              msgInterval = setInterval(function(){setTimeout(function(){_cll();},tim.run);}, _tim);
         }
         $(cls.msg).show();
    }

    function htmlMsg(){
         return ""
               + "<div class='"+dotCls(cls.msg)+"'>"
                    + "<span class='"+dotCls(cls.msg_img)+"'><i class='"+dotCls(cls.material_ico)+"'></i></span>"
                    + "<span class='"+dotCls(cls.msg_txt)+"'></span>"
                    + "<span class='"+dotCls(cls.msg_ico)+"' "+atr.dataTitle+"='"+lngAR.cancel+"'><i class='"+dotCls(cls.material_ico)+"'>"+htmlSVG(ico.close)+"</i></span>"
               + "</div>";
    }

    function initEventMsg(){
         $('body')
         .on("mouseenter", cls.msg_ico, function(){
              $(cls.tit).text($(this).attr(atr.dataTitle));
         })
         .on("mouseleave", cls.msg_ico, function(){
              $(cls.tit).text("");
         });
    }
    //=======================================================================================================================
    function htmlSettings(){
         var   wh_1 = hiGWid(siz.bar, (siz.box_wid - siz.nav_wid - siz.nav_wid - (siz.pdg * 4) + 1), evn.overflowAuto, evn.addHeight),
               wh_2 = hiGWid(siz.bar, (siz.nav_wid - siz.brd), evn.overflowHidden, evn.addHeight),
               wh_3 = hiGWid(siz.bar, (siz.box_wid - siz.nav_wid - (siz.nav_wid * 2) - (siz.pdg * 4) + 1), evn.overflowAuto, evn.addHeight),
               wh_4 = hiGWid(siz.bar, ((siz.nav_wid * 2) - 1), evn.overflowHidden, evn.addHeight);
         return ""
               + "<div class='"+dotCls(cls.settings)+"'>"
                    + "<div class='"+dotCls(cls.settings_both)+" "+dotCls(cls.background_even)+"'>"
                         + "<div class='"+dotCls(cls.settings_both_title)+"' style='"+wh_1+"'>"+lngAR.restSettings+"</div>"
                         + "<div class='"+dotCls(cls.settings_both_btn)+"' style='"+wh_2+"'>"
                              + "<i class='"+dotCls(cls.material_ico)+" "+dotCls(cls.ico)+" "+dotCls(cls.settings_btn_rest)+"' "+atr.dataTitle+"='"+lngAR.ok+"'>"+htmlSVG(ico.ok)+"</i>"
                         + "</div>"
                    + "</div>"

                    + "<div class='"+dotCls(cls.settings_title)+"'>"+lngAR.libraries+"</div>"
                    + "<div class='"+dotCls(cls.settings_link)+"'>－ <a target='_blank' href='https://jquery.com'>JQuery</a></div>"
                    + "<div class='"+dotCls(cls.settings_link)+"'>－ <a target='_blank' href='https://atomiks.github.io/tippyjs'>TippyJs</a></div>"
                    + "<div class='"+dotCls(cls.settings_link_last)+"'>－ <a target='_blank' href='https://momentjs.com'>MomentJs</a></div>"

                    + "<div class='"+dotCls(cls.background_even)+" "+dotCls(cls.settings_title)+"'>"+lngAR.spellcheck+"</div>"
                    + "<div class='"+dotCls(cls.background_even)+" "+dotCls(cls.settings_link_last)+"'>－ <a target='_blank' href='https://sahehly.com'>https://sahehly.com</a></div>"
                    + "<div class='"+dotCls(cls.background_even)+" "+dotCls(cls.settings_link_last)+"'>－ <a target='_blank' href='http://www.tahadz.com/mishkal'>http://www.tahadz.com/mishkal</a></div>"

                    + "<div class='"+dotCls(cls.settings_title)+"'>"+lngAR.tashkeel+"</div>"
                    + "<div class='"+dotCls(cls.settings_link)+"'>－ <a target='_blank' href='https://tashkeel.alsharekh.org'>https://tashkeel.alsharekh.org</a></div>"
                    + "<div class='"+dotCls(cls.settings_link_last)+"'>－ <a target='_blank' href='http://www.tahadz.com/mishkal'>http://www.tahadz.com/mishkal</a></div>"

                    + "<div class='"+dotCls(cls.background_even)+" "+dotCls(cls.settings_title)+"'>"+lngAR.hijriSettings+"</div>"
                    + "<div class='"+dotCls(cls.background_even)+" "+dotCls(cls.settings_link_last)+"'>－ <a target='_blank' href='http://www.ummulqura.org.sa'>Umm Al-Qura</a></div>"

                    + "<div class='"+dotCls(cls.settings_both)+"'>"
                         + "<div class='"+dotCls(cls.settings_both_title)+"' style='"+wh_3+"'>"+lngAR.devTitle+"</div>"
                         + "<div class='"+dotCls(cls.settings_both_btn)+" "+dotCls(cls.ico)+" "+dotCls(cls.settings_btn_account)+"' style='"+wh_4+"' "+atr.dataTitle+"='"+lngAR.devAccount+"'>@RAKAN938</div>"
                    + "</div>"
               + "</div>";
    }

    function restSettings(){
         if (confirm(lngAR.msgRestSettings)){
              (async () => {
                   await GM.deleteValue(key.copy);
                   await GM.deleteValue(key.paste);
                   await GM.deleteValue(key.insertion);
                   await GM.deleteValue(key.navSort);
                   tippyMainInstances.forEach(instance => {instance.hide();});
              })();
         }
    }

    function initEventSettings(){
         $('body')
         .on("click", cls.settings_btn_rest, function(){
              restSettings();
         })
         .on("click", cls.settings_btn_account, function(){
              window.location.href = '/RAKAN938';
         });
    }
    //=======================================================================================================================
    function escapeRegExp(_str) {
         return _str.replace(new RegExp(rgx.escapeRE, 'g'), '\\$&');
    }

    function unEmptyText(_str){
         if(_str === null) return false;
         if(_str === undefined) return false;
         if(typeof _str === 'undefined') return false;
         if(_str.length === 0) return false;
         if(_str.trim().length === 0) return false;
         return true;
    }

    function colorValues(e){if(e){if("transparent"===e.toLowerCase())return[0,0,0,0];if("#"===e[0])return e.length<7&&(e="#"+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]+(e.length>4?e[4]+e[4]:"")),[parseInt(e.substr(1,2),16),parseInt(e.substr(3,2),16),parseInt(e.substr(5,2),16),e.length>7?parseInt(e.substr(7,2),16)/255:1];if(-1===e.indexOf("rgb")){var r=document.body.appendChild(document.createElement("fictum")),t="rgb(1, 2, 3)";if(r.style.color=t,r.style.color!==t)return;if(r.style.color=e,r.style.color===t||""===r.style.color)return;e=getComputedStyle(r).color,document.body.removeChild(r)}return 0===e.indexOf("rgb")?(-1===e.indexOf("rgba")&&(e+=",1"),e.match(/[\.\d]+/g).map(function(e){return+e})):void 0}}

    function wScrollbar(c, b1, b2, n, w){
         var wd = (c + '::-webkit-scrollbar{width:' + w + 'px; height:' + w + 'px;}');
         var ws = function(t1, t2){
              return c + '::-webkit-scrollbar-' + t1 + '{background:' + t2 + ';' + (n ? 'border-bottom-left-radius:' + siz.cnr.bx + 'px;' : '') + '}';
         };
         return (w > 0 ? wd : '') + ws('track', b1) + ws('thumb', b2);
    }

    function hiGWid(h, w, o, hp){
         var hv = (hp ? ("height:" + h + "px; ") : "") + "max-height:" + h + "px; ";
         var wv = "width:" + w + "px; max-width:" + w + "px;";
         var ov = (o === evn.overflowHidden ? ' overflow:hidden;' : (o === evn.overflowAuto ? ' overflow:auto;' : ''));
         return hv + wv + ov;
    }

    function dotCls(tx){
        return tx.substr(1);
    }

    function opCol(op, tx){
         return 'rgba('+(tx !== undefined ? tx : clr.prim_deft)+', '+op+')';
    }

    function texNeat(){
         return elmTxt()
                .textInHtml()
                .regexpReplace(rgx.dashLine, ' ')
                .removeTatweel()
                .removeTashkeel()
                .dontArbicSpaceToSpace()
                .regexpReplace(rgx.dlEnterSpace, ' ')
                .trim();
    }

    function replaceTxt(_rx, _to){
         elmTxt().find('*').each(
              function (_i, _t) {
                   $(this).html(
                        function (_k, _x) {
                             return _x.regexpReplace(_rx, _to);
                        }
                   );
              }
         );
    }

    function elmTxt(){
         return $('.tippy-content').find(cls.txt).eq(0);
    }

    function openInput(_ths){
         $(twit.modalHeader).find('[tabindex="0"]').attr('tabindex', '-1');
         alert(lngAR.WriteFormat);
         alertOpenInput = true;
         $(twit.modalHeader).find(twit.clsElmTwit).attr('tabindex', '0');
         setTimeout(function(){$(_ths).focus();},tim.run);
    }

    function htmlSVG(_d){
         return "<svg width='"+siz.ico_svg+"' height='"+siz.ico_svg+"' "
               + "style='margin:auto; -ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);' "
               + "preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='"+_d+"'/></svg>";
    }
    //=======================================================================================================================

})();
