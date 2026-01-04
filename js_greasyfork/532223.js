// ==UserScript==
// @name         Transifex Translator add-on
// @namespace    http://tampermonkey.net/
// @version      3.1.2
// @description  Advanced Automatic Transifex translator
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+CiAgPHRleHQgeD0iNTAlIiB5PSIyOCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgIGZvbnQtZmFtaWx5PSJJbnRlciwgQXJpYWwsIHNhbnMtc2VyaWYiCiAgICAgIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IiMxNTY1YzAiIGZvbnQtd2VpZ2h0PSI3MDAiPkE8L3RleHQ+Cgk8dGV4dCB4PSI1MCUiIHk9IjcyJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIKICAgICAgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBDSksgSlAsIE5vdG8gU2FucyBTQywgIHNhbnMtc2VyaWYiCiAgICAgIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IiMxNTY1YzAiIGZvbnQtd2VpZ2h0PSI3MDAiPuW3qTwvdGV4dD4KPC9zdmc+
// @author       okrauss
// @license      GNU GPLv3
// @match        https://app.transifex.com/*/translate/*
// @match        https://www.transifex.com/*/translate/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532223/Transifex%20Translator%20add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/532223/Transifex%20Translator%20add-on.meta.js
// ==/UserScript==

(function() {

GM_addStyle(`
/* Scroll dropdown */
.txtr-dropdown-menu{max-height:220px;overflow-y:auto;scrollbar-width:thin;}
.txtr-dropdown-menu {
    position: absolute !important;
    z-index: 999999 !important;
}

#txtr-ui {
    overflow: visible !important;
}

.txtr-lang-selector {
    position: relative !important;
    overflow: visible !important;
}

.txtr-dropdown-menu::-webkit-scrollbar{width:6px;}
.txtr-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}

/* === TXTR THEME VARIABLES (LIGHT + DARK) === */
:root {
    --txtr-bg: #ffffff;
    --txtr-bg-alt: #fafafa;
    --txtr-text: #111111;
    --txtr-border: #d0d0d0;
    --txtr-scrollbar-bg: #e1e1e1;
    --txtr-scrollbar-thumb: #b5b5b5;
    --txtr-accent: #1565c0;

    /* Diff colors – Light theme */
    --txtr-diff-added-bg: #e9ffe9;
    --txtr-diff-added-text: #0a5500;
    --txtr-diff-removed-bg: #ffecec;
    --txtr-diff-removed-text: #a00000;
    --txtr-diff-unchanged-bg: #f5f5f5;
}

.txtr-theme-light {
    --txtr-bg: #ffffff;
    --txtr-bg-alt: #fafafa;
    --txtr-text: #111111;
    --txtr-border: #d0d0d0;
    --txtr-scrollbar-bg: #e1e1e1;
    --txtr-scrollbar-thumb: #b5b5b5;
    --txtr-accent: #1565c0;
}

.txtr-theme-dark {
    --txtr-bg: #1b1f23;
    --txtr-bg-alt: #252a30;
    --txtr-text: #e6eef7;
    --txtr-border: #3a3f46;
    --txtr-scrollbar-bg: #2a2f35;
    --txtr-scrollbar-thumb: #4c535c;
    --txtr-accent: #8ab4f8;

    --txtr-diff-removed-bg: #3f1518;
    --txtr-diff-removed-text: #ffbfc3;
    --txtr-diff-added-bg: #1a3320;
    --txtr-diff-added-text: #b4f7c0;
    --txtr-diff-unchanged-bg: #2a2f35;
}

/* Dark mode for What's New - [@version]

What’s New in 3.1

• \*\*\*More\*\*\* additional UI languages
• Translation length counter (Preview vs. original text)

 popup */
.txtr-theme-dark .txtr-whatsnew-popup {
    background: var(--txtr-bg-alt) !important;
    color: var(--txtr-text) !important;
    border-color: var(--txtr-border) !important;
}
.txtr-theme-dark .txtr-whatsnew-popup button,
.txtr-theme-dark .txtr-whatsnew-ok {
    background: var(--txtr-bg) !important;
    color: var(--txtr-text) !important;
    border: 1px solid var(--txtr-border) !important;
}

/* Hide version number in collapsed mode */
#txtr-ui.txtr-collapsed .txtr-version {
    display: none !important;
}


/* === Toggle Fix: OFF → Grey, ON → Blue === */
.txtr-toggle-label > .txtr-toggle-input + .txtr-toggle-slider {
    background: #bbb !important;
}

.txtr-toggle-label > .txtr-toggle-input:checked + .txtr-toggle-slider {
    background: #1565c0 !important;
}

/* === TXTR Dropdown Chevron (real element, sticky, overflow-aware) === */
.txtr-dropdown-menu {
  position: absolute !important;
}


.txtr-dropdown-chevron {
  position: sticky;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  line-height: 1;
  pointer-events: none;
  z-index: 1000000;
  display: none;

  /* visual: visible hint, zero obstruction */
  background: transparent;
  padding: 0;
  opacity: 0.7;
}

/* Light theme */
#txtr-ui.txtr-theme-light .txtr-dropdown-chevron {
  color: rgba(0, 0, 0, 0.45);
}

/* Dark theme */
#txtr-ui.txtr-theme-dark .txtr-dropdown-chevron {
  color: rgba(255, 255, 255, 0.75);
}
`);

    'use strict';

    // Guard against double-injection
    if (window.TXTR_LOADED) return;
    window.TXTR_LOADED = true;

    const TXTR = {};

// =========================================================================
// TXTR Word Counter (Preview vs Transifex) + Tooltip localization
// =========================================================================
TXTR.WordCounter = {
    count(text) {
        if (!text) return 0;
        return text.trim().split(/[\s\u00A0]+/).filter(Boolean).length;
    },

    // Transifex "Size" block counter element
    findTransifexCounter() {
        const els = document.querySelectorAll('.u-color-secondary[data-word][data-words]');
        for (const el of els) {
            const wrap = el.closest('.u-marginBottom-1x');
            if (wrap && wrap.querySelector('.u-color-muted')) return el;
        }
        return els[0] || null;
    }
};

TXTR.__TooltipTexts = {
    en: 'Compares the translated text length with the original text in Transifex',
    he: 'השוואה בין אורך התרגום לבין אורך הטקסט המקורי ב-Transifex',
    es: 'Compara la longitud de la traducción con el texto original en Transifex',
    ru: 'Сравнение длины перевода с исходным текстом в Transifex',
    ar: 'مقارنة طول الترجمة مع النص الأصلي في Transifex',
    uk: 'Порівнює довжину перекладу з оригінальним текстом у Transifex',
    de: 'Vergleicht die Länge der Übersetzung mit dem Originaltext in Transifex',
    fr: 'Compare la longueur de la traduction avec le texte original dans Transifex',
    pt: 'Compara o comprimento da tradução com o texto original no Transifex',
    it: 'Confronta la lunghezza della traduzione con il testo originale in Transifex',
    ms: 'Membandingkan panjang terjemahan dengan teks asal di Transifex',
    tl: 'Ikinukumpara ang haba ng salin sa orihinal na teksto sa Transifex',
    id: 'Membandingkan panjang terjemahan dengan teks asli di Transifex',
    nl: 'Vergelijkt de lengte van de vertaling met de originele tekst in Transifex',
    el: 'Συγκρίνει το μήκος της μετάφρασης με το αρχικό κείμενο στο Transifex',
    fa: 'طول ترجمه را با متن اصلی در Transifex مقایسه می‌کند',
    hi: 'Transifex में मूल पाठ के साथ अनुवाद की लंबाई की तुलना करता है',
    ja: 'Transifex の元のテキストと翻訳文の長さを比較します',
    ko: 'Transifex의 원문과 번역문의 길이를 비교합니다',
    pl: 'Porównuje długość tłumaczenia z oryginalnym tekstem w Transifex',
    th: 'เปรียบเทียบความยาวของคำแปลกับข้อความต้นฉบับใน Transifex',
    tr: 'Çeviri uzunluğunu Transifex’teki orijinal metinle karşılaştırır',
    vi: 'So sánh độ dài bản dịch với văn bản gốc trong Transifex',
    zh: '比较 Transifex 中译文与原文的长度'
};

TXTR.updatePreviewCounterTooltip = function () {
    const uiLang = (TXTR && TXTR.UILang && TXTR.UILang.current) ? TXTR.UILang.current : 'en';
    const text = TXTR.__TooltipTexts[uiLang] || TXTR.__TooltipTexts.en;
    document.querySelectorAll('.txtr-preview-counter .txtr-tip').forEach(tip => {
        tip.textContent = text;
    });
};


// ===== Modern Diff Engine =====
TXTR.DiffModern = {
    container: null,
    init() {
        this.container = document.querySelector('.txtr-diff-modern');
    },
    update() {
        if (!this.container) return;
        const oldText = TXTR.Draft.baselineText || "";
        const newText = (TXTR.Draft.getDraft ? TXTR.Draft.getDraft() : TXTR.Draft.draftText || "");
        if (oldText === newText) {
            this.container.innerHTML = `<div class="txtr-diff-line txtr-diff-neutral">No changes</div>`;
            return;
        }
        this.container.innerHTML = this.buildDiff(oldText, newText);
    },
    buildDiff(oldStr, newStr) {
        const oldLines = oldStr.split(/\r?\n/);
        const newLines = newStr.split(/\r?\n/);
        const max = Math.max(oldLines.length, newLines.length);
        let html = "";
        for (let i=0;i<max;i++){
            const a = oldLines[i] ?? "";
            const b = newLines[i] ?? "";
            if (a === b){
                html += `<div class="txtr-diff-line txtr-diff-neutral">${this.escape(a)}</div>`;
            } else {
                if (a) html += `<div class="txtr-diff-line txtr-diff-remove">- ${this.escape(a)}</div>`;
                if (b) html += `<div class="txtr-diff-line txtr-diff-add">+ ${this.escape(b)}</div>`;
            }
        }
        return html;
    },
    escape(txt){
        return txt.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }
};



    // ===========================================================================
    // TXTR.Storage - LocalStorage management
    // ===========================================================================
    TXTR.Storage = {
        keys: {
            targetLang: 'txtr_targetLang',
            uiLang: 'txtr_uiLang',
            theme: 'txtr_theme',
            autoFlow: 'txtr_autoFlow',
            position: 'txtr_position',
            sizeFull: 'txtr_sizeFull',
            sizeCompact: 'txtr_sizeCompact',
            collapsed: 'txtr_collapsed',
            compactMode: 'txtr_compactMode',
            showDiff: 'txtr_showDiff'
        },
        get(key) {
            return localStorage.getItem(this.keys[key]);
        },
        set(key, value) {
            localStorage.setItem(this.keys[key], value);
        },
        getJSON(key) {
            const val = this.get(key);
            return val ? JSON.parse(val) : null;
        },
        setJSON(key, obj) {
            this.set(key, JSON.stringify(obj));
        }
    };

    // ===========================================================================
    // TXTR.UILang - UI Language localization
    // ===========================================================================
    TXTR.UILang = {
        current: 'en',
        labels: {

            en: {
                TARGET_LANG: 'Target Language',
                UI_LANG: 'UI Language',
                THEME: 'Theme',
                THEME_LIGHT: 'Light',
                THEME_DARK: 'Dark',
                RETRANSLATE: 'Re-translate',
                COPY_CHATGPT: 'Copy & ChatGPT',
                PAUSE_AUTOTR: 'Pause AutoTranslation',
                RESUME_AUTOTR: 'Resume AutoTranslation',
                PAUSE: 'Pause',
                RESUME: 'Resume',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Use This Translation',
                PREVIEW: 'Preview',
                BASELINE: 'Baseline',
                DRAFT: 'Draft',
                SHOW_DIFF: 'Show comparison box',
                DISCLAIMER: 'Notice: This is machine translation. Please verify before saving.',
                STATUS_TRANSLATING: 'Translating...',
                STATUS_SUCCESS: '✓ Done',
                STATUS_COPIED: '✓ Copied',
                STATUS_ERROR: '✗ Error',
                STATUS_PAUSED: 'Auto-translation paused',
                COLLAPSE: 'Collapse',
                EXPAND: 'Expand',
                CLOSE: 'Close',
                DRAG: 'Drag to move',
                FULL_MODE: 'Full',
                COMPACT_MODE: 'Compact'
            },
            he: {
                TARGET_LANG: 'שפת יעד',
                UI_LANG: 'שפת ממשק',
                THEME: 'ערכת נושא',
                THEME_LIGHT: 'בהיר',
                THEME_DARK: 'כהה',
                RETRANSLATE: 'תרגם מחדש',
                COPY_CHATGPT: 'העתק ו-ChatGPT',
                PAUSE_AUTOTR: 'השהה תרגום אוטומטי',
                RESUME_AUTOTR: 'המשך תרגום אוטומטי',
                PAUSE: 'השהה תרגום אוטומטי',
                RESUME: 'המשך תרגום אוטומטי',
                DICTA: 'ניקוד דיקטה',
                USE_TRANSLATION: 'השתמש בתרגום זה',
                PREVIEW: 'תצוגה מקדימה',
                BASELINE: 'בסיס',
                DRAFT: 'טיוטה',
                SHOW_DIFF: 'הצג תיבת השוואה',
                DISCLAIMER: 'שים לב: זהו תרגום מכונה. אנא בדוק לפני השמירה.',
                STATUS_TRANSLATING: 'מתרגם...',
                STATUS_SUCCESS: '✓ הושלם',
                STATUS_COPIED: '✓ הועתק',
                STATUS_ERROR: '✗ שגיאה',
                STATUS_PAUSED: 'התרגום האוטומטי מושהה',
                COLLAPSE: 'כווץ',
                EXPAND: 'הרחב',
                CLOSE: 'סגור',
                DRAG: 'גרור להזזה',
                FULL_MODE: 'מלא',
                COMPACT_MODE: 'קומפקטי'
            },
            es: {
                TARGET_LANG: 'Idioma destino',
                UI_LANG: 'Idioma de interfaz',
                THEME: 'Tema',
                THEME_LIGHT: 'Claro',
                THEME_DARK: 'Oscuro',
                RETRANSLATE: 'Retraducir',
                COPY_CHATGPT: 'Copiar y ChatGPT',
                PAUSE_AUTOTR: 'Pausar traducción automática',
                RESUME_AUTOTR: 'Reanudar traducción automática',
                PAUSE: 'Pausar',
                RESUME: 'Reanudar',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Usar esta traducción',
                PREVIEW: 'Vista previa',
                BASELINE: 'Base',
                DRAFT: 'Borrador',
                SHOW_DIFF: 'Mostrar cuadro de comparación',
                DISCLAIMER: 'Aviso: Esta es una traducción automática. Verifica antes de guardar.',
                STATUS_TRANSLATING: 'Traduciendo...',
                STATUS_SUCCESS: '✓ Listo',
                STATUS_COPIED: '✓ Copiado',
                STATUS_ERROR: '✗ Error',
                STATUS_PAUSED: 'Traducción automática pausada',
                COLLAPSE: 'Colapsar',
                EXPAND: 'Expandir',
                CLOSE: 'Cerrar',
                DRAG: 'Arrastrar para mover',
                FULL_MODE: 'Completo',
                COMPACT_MODE: 'Compacto'
            },
            ru: {
                TARGET_LANG: 'Целевой язык',
                UI_LANG: 'Язык интерфейса',
                THEME: 'Тема',
                THEME_LIGHT: 'Светлая',
                THEME_DARK: 'Тёмная',
                RETRANSLATE: 'Перевести снова',
                COPY_CHATGPT: 'Копировать и ChatGPT',
                PAUSE_AUTOTR: 'Пауза автоперевода',
                RESUME_AUTOTR: 'Возобновить автоперевод',
                PAUSE: 'Пауза',
                RESUME: 'Продолжить',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Использовать этот перевод',
                PREVIEW: 'Предпросмотр',
                BASELINE: 'Исходный',
                DRAFT: 'Черновик',
                SHOW_DIFF: 'Показать окно сравнения',
                DISCLAIMER: 'Внимание: Это машинный перевод. Проверьте перед сохранением.',
                STATUS_TRANSLATING: 'Перевод...',
                STATUS_SUCCESS: '✓ Готово',
                STATUS_COPIED: '✓ Скопировано',
                STATUS_ERROR: '✗ Ошибка',
                STATUS_PAUSED: 'Автоперевод приостановлен',
                COLLAPSE: 'Свернуть',
                EXPAND: 'Развернуть',
                CLOSE: 'Закрыть',
                DRAG: 'Перетащите для перемещения',
                FULL_MODE: 'Полный',
                COMPACT_MODE: 'Компактный'
            },
            ar: {
                TARGET_LANG: 'اللغة المستهدفة',
                UI_LANG: 'لغة الواجهة',
                THEME: 'السمة',
                THEME_LIGHT: 'فاتح',
                THEME_DARK: 'داكن',
                RETRANSLATE: 'إعادة الترجمة',
                COPY_CHATGPT: 'نسخ و ChatGPT',
                PAUSE_AUTOTR: 'إيقاف الترجمة التلقائية مؤقتًا',
                RESUME_AUTOTR: 'استئناف الترجمة التلقائية',
                PAUSE: 'إيقاف مؤقت',
                RESUME: 'استئناف',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'استخدم هذه الترجمة',
                PREVIEW: 'معاينة',
                BASELINE: 'الأساس',
                DRAFT: 'مسودة',
                SHOW_DIFF: 'إظهار مربع المقارنة',
                DISCLAIMER: 'ملاحظة: هذه ترجمة آلية. يرجى التحقق قبل الحفظ.',
                STATUS_TRANSLATING: 'جارٍ الترجمة...',
                STATUS_SUCCESS: '✓ تم',
                STATUS_COPIED: '✓ تم النسخ',
                STATUS_ERROR: '✗ خطأ',
                STATUS_PAUSED: 'الترجمة التلقائية متوقفة',
                COLLAPSE: 'طي',
                EXPAND: 'توسيع',
                CLOSE: 'إغلاق',
                DRAG: 'اسحب للتحريك',
                FULL_MODE: 'كامل',
                COMPACT_MODE: 'مضغوط'
            }
            ,
                        uk: {
                TARGET_LANG: 'Цільова мова',
                UI_LANG: 'Мова інтерфейсу',
                THEME: 'Тема',
                THEME_LIGHT: 'Світла',
                THEME_DARK: 'Темна',
                RETRANSLATE: 'Перекласти знову',
                COPY_CHATGPT: 'Копіювати та ChatGPT',
                PAUSE_AUTOTR: 'Призупинити автопереклад',
                RESUME_AUTOTR: 'Відновити автопереклад',
                PAUSE: 'Пауза',
                RESUME: 'Продовжити',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Використати цей переклад',
                PREVIEW: 'Попередній перегляд',
                BASELINE: 'Базовий текст',
                DRAFT: 'Чернетка',
                SHOW_DIFF: 'Показати вікно порівняння',
                DISCLAIMER: 'Увага: це машинний переклад. Перевірте перед збереженням.',
                STATUS_TRANSLATING: 'Переклад…',
                STATUS_SUCCESS: '✓ Готово',
                STATUS_COPIED: '✓ Скопійовано',
                STATUS_ERROR: '✗ Помилка',
                STATUS_PAUSED: 'Автопереклад призупинено',
                COLLAPSE: 'Згорнути',
                EXPAND: 'Розгорнути',
                CLOSE: 'Закрити',
                DRAG: 'Перетягніть для переміщення',
                FULL_MODE: 'Повний',
                COMPACT_MODE: 'Компактний',
            },
                        de: {
                TARGET_LANG: 'Zielsprache',
                UI_LANG: 'UI-Sprache',
                THEME: 'Theme',
                THEME_LIGHT: 'Hell',
                THEME_DARK: 'Dunkel',
                RETRANSLATE: 'Neu übersetzen',
                COPY_CHATGPT: 'Kopieren & ChatGPT',
                PAUSE_AUTOTR: 'Automatische Übersetzung pausieren',
                RESUME_AUTOTR: 'Automatische Übersetzung fortsetzen',
                PAUSE: 'Pausieren',
                RESUME: 'Fortsetzen',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Diese Übersetzung verwenden',
                PREVIEW: 'Vorschau',
                BASELINE: 'Basis',
                DRAFT: 'Entwurf',
                SHOW_DIFF: 'Vergleich anzeigen',
                DISCLAIMER: 'Hinweis: Dies ist eine maschinelle Übersetzung. Bitte vor dem Speichern prüfen.',
                STATUS_TRANSLATING: 'Übersetze…',
                STATUS_SUCCESS: '✓ Fertig',
                STATUS_COPIED: '✓ Kopiert',
                STATUS_ERROR: '✗ Fehler',
                STATUS_PAUSED: 'Automatische Übersetzung pausiert',
                COLLAPSE: 'Einklappen',
                EXPAND: 'Ausklappen',
                CLOSE: 'Schließen',
                DRAG: 'Zum Bewegen ziehen',
                FULL_MODE: 'Voll',
                COMPACT_MODE: 'Kompakt',
            },
                        fr: {
                TARGET_LANG: 'Langue cible',
                UI_LANG: 'Langue de l’interface',
                THEME: 'Thème',
                THEME_LIGHT: 'Clair',
                THEME_DARK: 'Sombre',
                RETRANSLATE: 'Traduire à nouveau',
                COPY_CHATGPT: 'Copier & ChatGPT',
                PAUSE_AUTOTR: 'Mettre en pause la traduction auto',
                RESUME_AUTOTR: 'Reprendre la traduction auto',
                PAUSE: 'Pause',
                RESUME: 'Reprendre',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Utiliser cette traduction',
                PREVIEW: 'Aperçu',
                BASELINE: 'Référence',
                DRAFT: 'Brouillon',
                SHOW_DIFF: 'Afficher la comparaison',
                DISCLAIMER: 'Attention : traduction automatique. Vérifiez avant d’enregistrer.',
                STATUS_TRANSLATING: 'Traduction…',
                STATUS_SUCCESS: '✓ Terminé',
                STATUS_COPIED: '✓ Copié',
                STATUS_ERROR: '✗ Erreur',
                STATUS_PAUSED: 'Traduction auto en pause',
                COLLAPSE: 'Réduire',
                EXPAND: 'Développer',
                CLOSE: 'Fermer',
                DRAG: 'Glisser pour déplacer',
                FULL_MODE: 'Complet',
                COMPACT_MODE: 'Compact',
            },
                        pt: {
                TARGET_LANG: 'Idioma de destino',
                UI_LANG: 'Idioma da interface',
                THEME: 'Tema',
                THEME_LIGHT: 'Claro',
                THEME_DARK: 'Escuro',
                RETRANSLATE: 'Retraduzir',
                COPY_CHATGPT: 'Copiar & ChatGPT',
                PAUSE_AUTOTR: 'Pausar tradução automática',
                RESUME_AUTOTR: 'Retomar tradução automática',
                PAUSE: 'Pausar',
                RESUME: 'Retomar',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Usar esta tradução',
                PREVIEW: 'Pré-visualização',
                BASELINE: 'Original',
                DRAFT: 'Rascunho',
                SHOW_DIFF: 'Mostrar comparação',
                DISCLAIMER: 'Aviso: tradução automática. Verifique antes de salvar.',
                STATUS_TRANSLATING: 'Traduzindo…',
                STATUS_SUCCESS: '✓ Concluído',
                STATUS_COPIED: '✓ Copiado',
                STATUS_ERROR: '✗ Erro',
                STATUS_PAUSED: 'Tradução automática pausada',
                COLLAPSE: 'Recolher',
                EXPAND: 'Expandir',
                CLOSE: 'Fechar',
                DRAG: 'Arrastar para mover',
                FULL_MODE: 'Completo',
                COMPACT_MODE: 'Compacto',
            },
                        it: {
                TARGET_LANG: 'Lingua di destinazione',
                UI_LANG: 'Lingua dell’interfaccia',
                THEME: 'Tema',
                THEME_LIGHT: 'Chiaro',
                THEME_DARK: 'Scuro',
                RETRANSLATE: 'Ritraduci',
                COPY_CHATGPT: 'Copia & ChatGPT',
                PAUSE_AUTOTR: 'Metti in pausa la traduzione automatica',
                RESUME_AUTOTR: 'Riprendi la traduzione automatica',
                PAUSE: 'Pausa',
                RESUME: 'Riprendi',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Usa questa traduzione',
                PREVIEW: 'Anteprima',
                BASELINE: 'Originale',
                DRAFT: 'Bozza',
                SHOW_DIFF: 'Mostra confronto',
                DISCLAIMER: 'Attenzione: traduzione automatica. Verifica prima di salvare.',
                STATUS_TRANSLATING: 'Traducendo…',
                STATUS_SUCCESS: '✓ Fatto',
                STATUS_COPIED: '✓ Copiato',
                STATUS_ERROR: '✗ Errore',
                STATUS_PAUSED: 'Traduzione auto in pausa',
                COLLAPSE: 'Riduci',
                EXPAND: 'Espandi',
                CLOSE: 'Chiudi',
                DRAG: 'Trascina per spostare',
                FULL_MODE: 'Completo',
                COMPACT_MODE: 'Compatto',
            }
,             tr: {
                TARGET_LANG: 'Hedef Dil',
                UI_LANG: 'Arayüz Dili',
                THEME: 'Tema',
                THEME_LIGHT: 'Açık',
                THEME_DARK: 'Koyu',
                RETRANSLATE: 'Yeniden Çevir',
                COPY_CHATGPT: 'Kopyala & ChatGPT',
                PAUSE_AUTOTR: 'Otomatik Çeviriyi Duraklat',
                RESUME_AUTOTR: 'Otomatik Çeviriyi Sürdür',
                PAUSE: 'Duraklat',
                RESUME: 'Sürdür',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Bu Çeviriyi Kullan',
                PREVIEW: 'Önizleme',
                BASELINE: 'Temel',
                DRAFT: 'Taslak',
                SHOW_DIFF: 'Karşılaştırmayı Göster',
                DISCLAIMER: 'Uyarı: Bu bir makine çevirisidir. Kaydetmeden önce doğrulayın.',
                STATUS_TRANSLATING: 'Çevriliyor…',
                STATUS_SUCCESS: '✓ Tamam',
                STATUS_COPIED: '✓ Kopyalandı',
                STATUS_ERROR: '✗ Hata',
                STATUS_PAUSED: 'Otomatik çeviri duraklatıldı',
                COLLAPSE: 'Daralt',
                EXPAND: 'Genişlet',
                CLOSE: 'Kapat',
                DRAG: 'Taşımak için sürükleyin',
                FULL_MODE: 'Tam',
                COMPACT_MODE: 'Kompakt',
            },
             ms: {
                TARGET_LANG: 'Bahasa Sasaran',
                UI_LANG: 'Bahasa Antara Muka',
                THEME: 'Tema',
                THEME_LIGHT: 'Cerah',
                THEME_DARK: 'Gelap',
                RETRANSLATE: 'Terjemah Semula',
                COPY_CHATGPT: 'Salin & ChatGPT',
                PAUSE_AUTOTR: 'Jeda Terjemahan Automatik',
                RESUME_AUTOTR: 'Sambung Terjemahan Automatik',
                PAUSE: 'Jeda',
                RESUME: 'Sambung',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Guna Terjemahan Ini',
                PREVIEW: 'Pratonton',
                BASELINE: 'Asas',
                DRAFT: 'Draf',
                SHOW_DIFF: 'Tunjukkan Perbandingan',
                DISCLAIMER: 'Perhatian: Ini ialah terjemahan mesin. Sila semak sebelum menyimpan.',
                STATUS_TRANSLATING: 'Menterjemah…',
                STATUS_SUCCESS: '✓ Selesai',
                STATUS_COPIED: '✓ Disalin',
                STATUS_ERROR: '✗ Ralat',
                STATUS_PAUSED: 'Terjemahan automatik dijeda',
                COLLAPSE: 'Lipat',
                EXPAND: 'Kembangkan',
                CLOSE: 'Tutup',
                DRAG: 'Seret untuk mengalih',
                FULL_MODE: 'Penuh',
                COMPACT_MODE: 'Padat',
            },
             tl: {
                TARGET_LANG: 'Target na Wika',
                UI_LANG: 'Wika ng UI',
                THEME: 'Tema',
                THEME_LIGHT: 'Maliwanag',
                THEME_DARK: 'Madilim',
                RETRANSLATE: 'Isalin Muli',
                COPY_CHATGPT: 'Kopya & ChatGPT',
                PAUSE_AUTOTR: 'I-pause ang auto-translation',
                RESUME_AUTOTR: 'Ipagpatuloy ang auto-translation',
                PAUSE: 'I-pause',
                RESUME: 'Ipagpatuloy',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Gamitin ang pagsasaling ito',
                PREVIEW: 'Preview',
                BASELINE: 'Baseline',
                DRAFT: 'Draft',
                SHOW_DIFF: 'Ipakita ang paghahambing',
                DISCLAIMER: 'Paalala: machine translation ito. Suriin muna bago mag-save.',
                STATUS_TRANSLATING: 'Isinasalin…',
                STATUS_SUCCESS: '✓ Tapos',
                STATUS_COPIED: '✓ Nakopya',
                STATUS_ERROR: '✗ Error',
                STATUS_PAUSED: 'Auto-translation naka-pause',
                COLLAPSE: 'I-collapse',
                EXPAND: 'I-expand',
                CLOSE: 'Isara',
                DRAG: 'I-drag para ilipat',
                FULL_MODE: 'Buong mode',
                COMPACT_MODE: 'Compact',
            },
             id: {
                TARGET_LANG: 'Bahasa Target',
                UI_LANG: 'Bahasa UI',
                THEME: 'Tema',
                THEME_LIGHT: 'Terang',
                THEME_DARK: 'Gelap',
                RETRANSLATE: 'Terjemahkan ulang',
                COPY_CHATGPT: 'Salin & ChatGPT',
                PAUSE_AUTOTR: 'Jeda terjemahan otomatis',
                RESUME_AUTOTR: 'Lanjutkan terjemahan otomatis',
                PAUSE: 'Jeda',
                RESUME: 'Lanjutkan',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Gunakan terjemahan ini',
                PREVIEW: 'Pratinjau',
                BASELINE: 'Dasar',
                DRAFT: 'Draf',
                SHOW_DIFF: 'Tampilkan perbandingan',
                DISCLAIMER: 'Perhatian: ini adalah terjemahan mesin. Periksa sebelum menyimpan.',
                STATUS_TRANSLATING: 'Menerjemahkan…',
                STATUS_SUCCESS: '✓ Selesai',
                STATUS_COPIED: '✓ Disalin',
                STATUS_ERROR: '✗ Kesalahan',
                STATUS_PAUSED: 'Terjemahan otomatis dijeda',
                COLLAPSE: 'Ciutkan',
                EXPAND: 'Bentangkan',
                CLOSE: 'Tutup',
                DRAG: 'Seret untuk memindahkan',
                FULL_MODE: 'Penuh',
                COMPACT_MODE: 'Ringkas',
            },
             nl: {
                TARGET_LANG: 'Doeltaal',
                UI_LANG: 'Interface-taal',
                THEME: 'Thema',
                THEME_LIGHT: 'Licht',
                THEME_DARK: 'Donker',
                RETRANSLATE: 'Opnieuw vertalen',
                COPY_CHATGPT: 'Kopiëren & ChatGPT',
                PAUSE_AUTOTR: 'Automatisch vertalen pauzeren',
                RESUME_AUTOTR: 'Automatisch vertalen hervatten',
                PAUSE: 'Pauze',
                RESUME: 'Hervatten',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Deze vertaling gebruiken',
                PREVIEW: 'Voorbeeld',
                BASELINE: 'Baseline',
                DRAFT: 'Concept',
                SHOW_DIFF: 'Vergelijking tonen',
                DISCLAIMER: 'Let op: dit is machinale vertaling. Controleer voor het opslaan.',
                STATUS_TRANSLATING: 'Vertalen…',
                STATUS_SUCCESS: '✓ Gereed',
                STATUS_COPIED: '✓ Gekopieerd',
                STATUS_ERROR: '✗ Fout',
                STATUS_PAUSED: 'Automatisch vertalen gepauzeerd',
                COLLAPSE: 'Inklappen',
                EXPAND: 'Uitklappen',
                CLOSE: 'Sluiten',
                DRAG: 'Verslepen om te verplaatsen',
                FULL_MODE: 'Volledig',
                COMPACT_MODE: 'Compact',
            },

            el: {
                TARGET_LANG: 'Γλώσσα στόχος',
                UI_LANG: 'Γλώσσα διεπαφής',
                THEME: 'Θέμα',
                THEME_LIGHT: 'Φωτεινό',
                THEME_DARK: 'Σκοτεινό',
                RETRANSLATE: 'Επαναμετάφραση',
                COPY_CHATGPT: 'Αντιγραφή & ChatGPT',
                PAUSE_AUTOTR: 'Παύση αυτόματης μετάφρασης',
                RESUME_AUTOTR: 'Συνέχιση αυτόματης μετάφρασης',
                PAUSE: 'Παύση',
                RESUME: 'Συνέχεια',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Χρήση αυτής της μετάφρασης',
                PREVIEW: 'Προεπισκόπηση',
                BASELINE: 'Βάση',
                DRAFT: 'Πρόχειρο',
                SHOW_DIFF: 'Εμφάνιση πλαισίου σύγκρισης',
                DISCLAIMER: 'Προσοχή: Αυτή είναι μηχανική μετάφραση. Ελέγξτε πριν την αποθήκευση.',
                STATUS_TRANSLATING: 'Μετάφραση...',
                STATUS_SUCCESS: '✓ Ολοκληρώθηκε',
                STATUS_COPIED: '✓ Αντιγράφηκε',
                STATUS_ERROR: '✗ Σφάλμα',
                STATUS_PAUSED: 'Η αυτόματη μετάφραση σε παύση',
                COLLAPSE: 'Σύμπτυξη',
                EXPAND: 'Ανάπτυξη',
                CLOSE: 'Κλείσιμο',
                DRAG: 'Σύρετε για μετακίνηση',
                FULL_MODE: 'Πλήρες',
                COMPACT_MODE: 'Συμπαγές'
            },
            fa: {
                TARGET_LANG: 'زبان مقصد',
                UI_LANG: 'زبان رابط کاربری',
                THEME: 'پوسته',
                THEME_LIGHT: 'روشن',
                THEME_DARK: 'تیره',
                RETRANSLATE: 'ترجمه دوباره',
                COPY_CHATGPT: 'کپی و ChatGPT',
                PAUSE_AUTOTR: 'توقف ترجمه خودکار',
                RESUME_AUTOTR: 'ادامه ترجمه خودکار',
                PAUSE: 'توقف',
                RESUME: 'ادامه',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'استفاده از این ترجمه',
                PREVIEW: 'پیش‌نمایش',
                BASELINE: 'مبنای اصلی',
                DRAFT: 'پیش‌نویس',
                SHOW_DIFF: 'نمایش بخش مقایسه',
                DISCLAIMER: 'توجه: این یک ترجمه ماشینی است. لطفاً قبل از ذخیره بررسی کنید.',
                STATUS_TRANSLATING: 'در حال ترجمه...',
                STATUS_SUCCESS: '✓ انجام شد',
                STATUS_COPIED: '✓ کپی شد',
                STATUS_ERROR: '✗ خطا',
                STATUS_PAUSED: 'ترجمه خودکار متوقف شد',
                COLLAPSE: 'جمع‌کردن',
                EXPAND: 'بازکردن',
                CLOSE: 'بستن',
                DRAG: 'برای جابجایی بکشید',
                FULL_MODE: 'کامل',
                COMPACT_MODE: 'فشرده'
            },
            hi: {
                TARGET_LANG: 'लक्षित भाषा',
                UI_LANG: 'इंटरफ़ेस भाषा',
                THEME: 'थीम',
                THEME_LIGHT: 'हल्का',
                THEME_DARK: 'गहरा',
                RETRANSLATE: 'पुनः अनुवाद करें',
                COPY_CHATGPT: 'कॉपी करें और ChatGPT',
                PAUSE_AUTOTR: 'स्वचालित अनुवाद रोकें',
                RESUME_AUTOTR: 'स्वचालित अनुवाद जारी रखें',
                PAUSE: 'रोकें',
                RESUME: 'जारी रखें',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'इस अनुवाद का उपयोग करें',
                PREVIEW: 'पूर्वावलोकन',
                BASELINE: 'आधार',
                DRAFT: 'मसौदा',
                SHOW_DIFF: 'तुलना बॉक्स दिखाएँ',
                DISCLAIMER: 'ध्यान दें: यह मशीन अनुवाद है। सहेजने से पहले जाँच करें।',
                STATUS_TRANSLATING: 'अनुवाद हो रहा है...',
                STATUS_SUCCESS: '✓ पूर्ण',
                STATUS_COPIED: '✓ कॉपी किया गया',
                STATUS_ERROR: '✗ त्रुटि',
                STATUS_PAUSED: 'स्वचालित अनुवाद रुका हुआ है',
                COLLAPSE: 'संकुचित करें',
                EXPAND: 'विस्तारित करें',
                CLOSE: 'बंद करें',
                DRAG: 'खिसकाने के लिए खींचें',
                FULL_MODE: 'पूर्ण',
                COMPACT_MODE: 'कॉम्पैक्ट'
            },
            ja: {
                TARGET_LANG: '対象言語',
                UI_LANG: 'UI 言語',
                THEME: 'テーマ',
                THEME_LIGHT: 'ライト',
                THEME_DARK: 'ダーク',
                RETRANSLATE: '再翻訳',
                COPY_CHATGPT: 'コピー & ChatGPT',
                PAUSE_AUTOTR: '自動翻訳を一時停止',
                RESUME_AUTOTR: '自動翻訳を再開',
                PAUSE: '一時停止',
                RESUME: '再開',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'この翻訳を使用',
                PREVIEW: 'プレビュー',
                BASELINE: 'ベースライン',
                DRAFT: '下書き',
                SHOW_DIFF: '比較ボックスを表示',
                DISCLAIMER: '注意: これは機械翻訳です。保存前に確認してください。',
                STATUS_TRANSLATING: '翻訳中...',
                STATUS_SUCCESS: '✓ 完了',
                STATUS_COPIED: '✓ コピーしました',
                STATUS_ERROR: '✗ エラー',
                STATUS_PAUSED: '自動翻訳は一時停止中',
                COLLAPSE: '折りたたむ',
                EXPAND: '展開',
                CLOSE: '閉じる',
                DRAG: 'ドラッグして移動',
                FULL_MODE: 'フル',
                COMPACT_MODE: 'コンパクト'
            },
            ko: {
                TARGET_LANG: '대상 언어',
                UI_LANG: '인터페이스 언어',
                THEME: '테마',
                THEME_LIGHT: '라이트',
                THEME_DARK: '다크',
                RETRANSLATE: '재번역',
                COPY_CHATGPT: '복사 & ChatGPT',
                PAUSE_AUTOTR: '자동 번역 일시중지',
                RESUME_AUTOTR: '자동 번역 재개',
                PAUSE: '일시중지',
                RESUME: '재개',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: '이 번역 사용',
                PREVIEW: '미리보기',
                BASELINE: '기준',
                DRAFT: '초안',
                SHOW_DIFF: '비교 박스 표시',
                DISCLAIMER: '주의: 기계 번역입니다. 저장하기 전에 확인하세요.',
                STATUS_TRANSLATING: '번역 중...',
                STATUS_SUCCESS: '✓ 완료',
                STATUS_COPIED: '✓ 복사됨',
                STATUS_ERROR: '✗ 오류',
                STATUS_PAUSED: '자동 번역 일시중지됨',
                COLLAPSE: '접기',
                EXPAND: '펼치기',
                CLOSE: '닫기',
                DRAG: '드래그하여 이동',
                FULL_MODE: '전체',
                COMPACT_MODE: '컴팩트'
            },
            pl: {
                TARGET_LANG: 'Język docelowy',
                UI_LANG: 'Język interfejsu',
                THEME: 'Motyw',
                THEME_LIGHT: 'Jasny',
                THEME_DARK: 'Ciemny',
                RETRANSLATE: 'Przetłumacz ponownie',
                COPY_CHATGPT: 'Kopiuj & ChatGPT',
                PAUSE_AUTOTR: 'Wstrzymaj tłumaczenie automatyczne',
                RESUME_AUTOTR: 'Wznów tłumaczenie automatyczne',
                PAUSE: 'Wstrzymaj',
                RESUME: 'Wznów',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Użyj tego tłumaczenia',
                PREVIEW: 'Podgląd',
                BASELINE: 'Oryginał',
                DRAFT: 'Szkic',
                SHOW_DIFF: 'Pokaż pole porównania',
                DISCLAIMER: 'Uwaga: To jest tłumaczenie maszynowe. Sprawdź przed zapisaniem.',
                STATUS_TRANSLATING: 'Tłumaczenie...',
                STATUS_SUCCESS: '✓ Gotowe',
                STATUS_COPIED: '✓ Skopiowano',
                STATUS_ERROR: '✗ Błąd',
                STATUS_PAUSED: 'Tłumaczenie automatyczne wstrzymane',
                COLLAPSE: 'Zwiń',
                EXPAND: 'Rozwiń',
                CLOSE: 'Zamknij',
                DRAG: 'Przeciągnij, aby przesunąć',
                FULL_MODE: 'Pełny',
                COMPACT_MODE: 'Kompaktowy'
            },
            th: {
                TARGET_LANG: 'ภาษาปลายทาง',
                UI_LANG: 'ภาษาของส่วนติดต่อ',
                THEME: 'ธีม',
                THEME_LIGHT: 'สว่าง',
                THEME_DARK: 'มืด',
                RETRANSLATE: 'แปลใหม่',
                COPY_CHATGPT: 'คัดลอก & ChatGPT',
                PAUSE_AUTOTR: 'หยุดการแปลอัตโนมัติ',
                RESUME_AUTOTR: 'ทำต่อการแปลอัตโนมัติ',
                PAUSE: 'หยุด',
                RESUME: 'ทำต่อ',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'ใช้คำแปลนี้',
                PREVIEW: 'ดูตัวอย่าง',
                BASELINE: 'พื้นฐาน',
                DRAFT: 'ร่าง',
                SHOW_DIFF: 'แสดงกล่องเปรียบเทียบ',
                DISCLAIMER: 'โปรดทราบ: นี่คือการแปลด้วยเครื่อง กรุณาตรวจสอบก่อนบันทึก',
                STATUS_TRANSLATING: 'กำลังแปล...',
                STATUS_SUCCESS: '✓ เสร็จสิ้น',
                STATUS_COPIED: '✓ คัดลอกแล้ว',
                STATUS_ERROR: '✗ ข้อผิดพลาด',
                STATUS_PAUSED: 'การแปลอัตโนมัติถูกหยุดไว้',
                COLLAPSE: 'ย่อ',
                EXPAND: 'ขยาย',
                CLOSE: 'ปิด',
                DRAG: 'ลากเพื่อย้าย',
                FULL_MODE: 'เต็ม',
                COMPACT_MODE: 'กระชับ'
            },
            vi: {
                TARGET_LANG: 'Ngôn ngữ đích',
                UI_LANG: 'Ngôn ngữ giao diện',
                THEME: 'Chủ đề',
                THEME_LIGHT: 'Sáng',
                THEME_DARK: 'Tối',
                RETRANSLATE: 'Dịch lại',
                COPY_CHATGPT: 'Sao chép & ChatGPT',
                PAUSE_AUTOTR: 'Tạm dừng dịch tự động',
                RESUME_AUTOTR: 'Tiếp tục dịch tự động',
                PAUSE: 'Tạm dừng',
                RESUME: 'Tiếp tục',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: 'Sử dụng bản dịch này',
                PREVIEW: 'Xem trước',
                BASELINE: 'Gốc',
                DRAFT: 'Bản nháp',
                SHOW_DIFF: 'Hiển thị hộp so sánh',
                DISCLAIMER: 'Lưu ý: Đây là bản dịch máy. Vui lòng kiểm tra trước khi lưu.',
                STATUS_TRANSLATING: 'Đang dịch...',
                STATUS_SUCCESS: '✓ Hoàn tất',
                STATUS_COPIED: '✓ Đã sao chép',
                STATUS_ERROR: '✗ Lỗi',
                STATUS_PAUSED: 'Dịch tự động đã tạm dừng',
                COLLAPSE: 'Thu gọn',
                EXPAND: 'Mở rộng',
                CLOSE: 'Đóng',
                DRAG: 'Kéo để di chuyển',
                FULL_MODE: 'Đầy đủ',
                COMPACT_MODE: 'Thu gọn'
            },
            zh: {
                TARGET_LANG: '目标语言',
                UI_LANG: '界面语言',
                THEME: '主题',
                THEME_LIGHT: '浅色',
                THEME_DARK: '深色',
                RETRANSLATE: '重新翻译',
                COPY_CHATGPT: '复制并打开 ChatGPT',
                PAUSE_AUTOTR: '暂停自动翻译',
                RESUME_AUTOTR: '继续自动翻译',
                PAUSE: '暂停',
                RESUME: '继续',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: '使用此翻译',
                PREVIEW: '预览',
                BASELINE: '基准',
                DRAFT: '草稿',
                SHOW_DIFF: '显示对比框',
                DISCLAIMER: '注意：这是机器翻译。保存前请核对。',
                STATUS_TRANSLATING: '正在翻译...',
                STATUS_SUCCESS: '✓ 完成',
                STATUS_COPIED: '✓ 已复制',
                STATUS_ERROR: '✗ 错误',
                STATUS_PAUSED: '自动翻译已暂停',
                COLLAPSE: '收起',
                EXPAND: '展开',
                CLOSE: '关闭',
                DRAG: '拖动以移动',
                FULL_MODE: '完整',
                COMPACT_MODE: '紧凑'
            },
            "zh-TW": {
                TARGET_LANG: '目標語言',
                UI_LANG: '介面語言',
                THEME: '主題',
                THEME_LIGHT: '淺色',
                THEME_DARK: '深色',
                RETRANSLATE: '重新翻譯',
                COPY_CHATGPT: '複製並打開 ChatGPT',
                PAUSE_AUTOTR: '暫停自動翻譯',
                RESUME_AUTOTR: '繼續自動翻譯',
                PAUSE: '暫停',
                RESUME: '繼續',
                DICTA: 'Dicta Nikud',
                USE_TRANSLATION: '使用此翻譯',
                PREVIEW: '預覽',
                BASELINE: '基準',
                DRAFT: '草稿',
                SHOW_DIFF: '顯示比較框',
                DISCLAIMER: '注意：這是機器翻譯。儲存前請先確認。',
                STATUS_TRANSLATING: '翻譯中...',
                STATUS_SUCCESS: '✓ 完成',
                STATUS_COPIED: '✓ 已複製',
                STATUS_ERROR: '✗ 錯誤',
                STATUS_PAUSED: '自動翻譯已暫停',
                COLLAPSE: '收合',
                EXPAND: '展開',
                CLOSE: '關閉',
                DRAG: '拖曳以移動',
                FULL_MODE: '完整',
                COMPACT_MODE: '精簡'
            },

},
        get(key) {
            return this.labels[this.current]?.[key] || this.labels.en[key] || key;
        },
        setLang(lang) {
            if (this.labels[lang]) {
                this.current = lang;
                TXTR.Storage.set('uiLang', lang);
            }
        },
        init() {
            const saved = TXTR.Storage.get('uiLang');
            if (saved && this.labels[saved]) {
                this.current = saved;
            }
        }
    };

    // ===========================================================================
    // TXTR.Theme - Theme management
    // ===========================================================================
    TXTR.Theme = {
        current: 'light',
        init() {
            const saved = TXTR.Storage.get('theme');
            if (saved === 'light' || saved === 'dark') {
                this.current = saved;
            }
            this.apply();
        },
        toggle() {
            this.current = this.current === 'light' ? 'dark' : 'light';
            TXTR.Storage.set('theme', this.current);
            this.apply();
        },
        setTheme(theme) {
            if (theme === 'light' || theme === 'dark') {
                this.current = theme;
                TXTR.Storage.set('theme', this.current);
                this.apply();
            }
        },
        apply() {
            const ui = document.getElementById('txtr-ui');
            if (ui) {
                ui.classList.remove('txtr-theme-light', 'txtr-theme-dark');
                ui.classList.add(`txtr-theme-${this.current}`);
            }
        }
    };

    // ===========================================================================
    // TXTR.Utils - Helper functions
    // ===========================================================================
    TXTR.Utils = {
        debounce(fn, delay) {
            let timer = null;
            return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        throttle(fn, limit) {
            let inThrottle = false;
            return function(...args) {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        clampSize(w, h, limits) {
            return {
                w: Math.max(limits.minW, Math.min(limits.maxW, w)),
                h: Math.max(limits.minH, Math.min(limits.maxH, h))
            };
        },
        isRTL(lang) {
            return ['he', 'ar', 'fa', 'yi'].includes(lang);
        },
        safeConsole(...args) {
            // Silent in production
        }
    };

    // ===========================================================================
    // TXTR.Core - Translation engine (based on v2.17 logic)
    // ===========================================================================
    TXTR.Core = {
        state: {
            targetLang: 'he',
            autoFlowEnabled: true,
            isTranslating: false,
            lastSourceText: '',
            lastTranslation: '',
            hasPlaceholders: false
        },

        // Token patterns for preserving placeholders (from v2.17)
        TOKEN_PATTERNS: {
            BBCODE: /\[\/?(?:link|b|i|u|\/?id=\d*)?\]|<\/?br\/?>/gi,
            PERCENT: /%[a-zA-Z0-9_]+%/g,
            ANGLE: /<[^>]+>/g,
            UNDERSCORE: /_(?:p|ph|ph\d+)_/gi
        },

        MASTER_TOKEN: null,

        init() {
            // Build master regex
            const patterns = Object.values(this.TOKEN_PATTERNS).map(r => r.source);
            this.MASTER_TOKEN = new RegExp(patterns.join('|'), 'gi');

            // Load saved target language
            const saved = TXTR.Storage.get('targetLang');
            if (saved) this.state.targetLang = saved;

            const savedAutoFlow = TXTR.Storage.get('autoFlow');
            this.state.autoFlowEnabled = savedAutoFlow !== 'false';
        },

        setTargetLang(lang) {
            this.state.targetLang = lang;
            TXTR.Storage.set('targetLang', lang);
        },

        toggleAutoFlow() {
            this.state.autoFlowEnabled = !this.state.autoFlowEnabled;
            TXTR.Storage.set('autoFlow', this.state.autoFlowEnabled.toString());
            TXTR.UI.updatePauseButton();
        },

        // Split text into runs of text and tokens (preserving spacing)
        splitRuns(input) {
            const runs = [];
            let lastIndex = 0;
            let match;
            this.MASTER_TOKEN.lastIndex = 0;

            while ((match = this.MASTER_TOKEN.exec(input)) !== null) {
                const i = match.index;
                if (i > lastIndex) {
                    runs.push({ type: 'text', value: input.slice(lastIndex, i) });
                }
                const prevChar = input[i - 1] || '';
                const nextChar = input[i + match[0].length] || '';
                const hasLeftSpace = /\s/.test(prevChar);
                const hasRightSpace = /\s/.test(nextChar);
                runs.push({
                    type: 'token',
                    value: match[0],
                    leftSpace: hasLeftSpace,
                    rightSpace: hasRightSpace
                });
                lastIndex = i + match[0].length;
            }
            if (lastIndex < input.length) {
                runs.push({ type: 'text', value: input.slice(lastIndex) });
            }
            return runs;
        },

        // Join runs back with proper spacing
        joinRunsWithSpacing(runs) {
            let out = '';
            for (let i = 0; i < runs.length; i++) {
                const r = runs[i];
                if (r.type === 'text') {
                    let val = r.value;
                    if (out.endsWith(' ') && /^\s/.test(val)) {
                        val = val.replace(/^\s+/, '');
                    }
                    out += val;
                } else {
                    if (r.leftSpace && !out.endsWith(' ')) out += ' ';
                    out += r.value;
                    if (r.rightSpace) {
                        const next = runs[i + 1];
                        if (!next || (next.type === 'text' && !/^\s/.test(next.value))) {
                            out += ' ';
                        }
                    }
                }
            }
            return out;
        },

        // Translate a single text segment via Google Translate API
        async translateOne(text, lang) {
            if (!text.trim()) return text;
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
            try {
                const resp = await fetch(url);
                const res = await resp.json();
                if (Array.isArray(res) && Array.isArray(res[0])) {
                    return res[0].map(seg => Array.isArray(seg) ? seg[0] : '').join('');
                }
                return res?.[0]?.[0]?.[0] ?? text;
            } catch (e) {
                return text;
            }
        },

        // Main translation function with token preservation
        async translateText(text, lang) {
            const runs = this.splitRuns(text);
            this.state.hasPlaceholders = runs.some(r => r.type === 'token');

            for (let i = 0; i < runs.length; i++) {
                if (runs[i].type === 'text') {
                    runs[i].value = await this.translateOne(runs[i].value, lang);
                }
            }
            return this.joinRunsWithSpacing(runs);
        },

        // AutoTranslate the source string
        async autoTranslate(force = false) {
            if (!this.state.autoFlowEnabled && !force) {
                TXTR.Preview.update();
                return;
            }

            const srcEl = TXTR.DOM.findSourceTextArea();
            const tgtEl = TXTR.DOM.findTranslationTextArea();

            if (!srcEl || !tgtEl) return;

            const srcText = srcEl.innerText?.trim() || srcEl.textContent?.trim() || '';
            if (!srcText) return;

            // HARD GUARD: prevent overwrite if target has text
            const targetText = (tgtEl.value !== undefined ? tgtEl.value.trim() : (tgtEl.innerText || "").trim());
            if (targetText.length > 0 && !force) {
                TXTR.Preview.update();
                return;
            }

            // Skip if same source and not forced
            if (srcText === this.state.lastSourceText && !force) {
                const targetText = (tgtEl.value !== undefined ? tgtEl.value.trim() : (tgtEl.innerText || '').trim());
                if (targetText.length > 0) {
                    TXTR.Preview.update();
                    return;
                }
            }

            this.state.lastSourceText = srcText;
            this.state.isTranslating = true;
            TXTR.UI.setStatus('STATUS_TRANSLATING');

            try {
                const translated = await this.translateText(srcText, this.state.targetLang);
                this.state.lastTranslation = translated;

                // Write to target
                if (tgtEl.tagName === 'TEXTAREA') {
                    tgtEl.value = translated;
                    tgtEl.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    tgtEl.innerText = translated;
                    tgtEl.dispatchEvent(new Event('input', { bubbles: true }));
                }

                TXTR.UI.setStatus('STATUS_SUCCESS');
                TXTR.Preview.update();
                TXTR.Draft.setBaseline(translated);} catch (e) {
                TXTR.UI.setStatus('STATUS_ERROR');
            } finally {
                this.state.isTranslating = false;
                setTimeout(() => TXTR.UI.clearStatus(), 2000);
            }
        }
    };

    // ===========================================================================
    // TXTR.DOM - DOM helpers and element finders
    // ===========================================================================
    TXTR.DOM = {
        selectors: {
            source: ['#source-string', '[data-testid="source-string"]', '.source-string'],
            target: ['textarea[data-testid="translation-editor-target"]', '#translated-string', '[contenteditable="true"].translation', '.translation-input textarea']
        },

        createElement(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, val]) => {
                if (key === 'className') el.className = val;
                else if (key === 'textContent') el.textContent = val;
                else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
                else el.setAttribute(key, val);
            });
            children.forEach(child => {
                if (typeof child === 'string') el.appendChild(document.createTextNode(child));
                else if (child) el.appendChild(child);
            });
            return el;
        },

        findSourceTextArea() {
            for (const sel of this.selectors.source) {
                const el = document.querySelector(sel);
                if (el) return el;
            }
            return null;
        },

        findTranslationTextArea() {
            for (const sel of this.selectors.target) {
                const el = document.querySelector(sel);
                if (el) return el;
            }
            return null;
        }
    };

    // ===========================================================================
    // TXTR.Preview - Preview panel
    // ===========================================================================
    TXTR.Preview = {
        element: null,

        init(container) {
            this.element = TXTR.DOM.createElement('div', { className: 'txtr-preview-box' });
            container.appendChild(this.element);
        },

        update() {
            if (!this.element) return;
            const tgtEl = TXTR.DOM.findTranslationTextArea();
            let text = '';
            if (tgtEl) {
                text = tgtEl.value || tgtEl.innerText || '';
            }
            
            this.element.innerHTML = this.renderHTML(text);

            // --- Preview word counter (X / Y words) ---
            let counter = this.element.querySelector('.txtr-preview-counter');
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'txtr-preview-counter u-color-secondary';
                counter.style.cssText =
                    'position:absolute;bottom:6px;inset-inline-end:8px;font-size:12px;' +
                    'opacity:0.8;white-space:nowrap;pointer-events:none;';
                this.element.style.position = 'relative';
                this.element.appendChild(counter);
            }

            // Count preview words (exclude counter itself)
            const clone = this.element.cloneNode(true);
            const c2 = clone.querySelector('.txtr-preview-counter');
            if (c2) c2.remove();
            const previewCount = TXTR.WordCounter.count(clone.innerText);

            // Read Transifex size counter (number only)
            const txEl = TXTR.WordCounter.findTransifexCounter();
            const txNum = txEl ? (parseInt((txEl.textContent || '').replace(/\D+/g, ''), 10) || 0) : 0;

            // Counter always in English
            const label = (txNum === 1 ? 'word' : 'words');
            counter.textContent = previewCount + ' / ' + txNum + ' ' + label;

            // Info icon + instant localized tooltip (icon receives pointer events)
            let info = counter.querySelector('.txtr-info');
            if (!info) {
                info = document.createElement('span');
                info.className = 'txtr-info';
                info.textContent = ' ⓘ';
                info.style.pointerEvents = 'auto';
                info.style.cursor = 'help';
                info.style.opacity = '0.8';
                info.style.position = 'relative';
                counter.appendChild(info);

                const tip = document.createElement('span');
                tip.className = 'txtr-tip';
                tip.style.cssText =
                    'position:absolute;bottom:18px;inset-inline-end:0;' +
                    'background:rgba(0,0,0,0.75);color:#fff;padding:4px 6px;' +
                    'border-radius:4px;font-size:11px;white-space:nowrap;' +
                    'opacity:0;pointer-events:none;transition:opacity 0.1s ease;';
                info.appendChild(tip);

                info.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
                info.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
            }

            // Ensure tooltip language matches current UI language on every preview render
            TXTR.updatePreviewCounterTooltip();

            if (TXTR.Draft && TXTR.Draft.setBaseline) { TXTR.Draft.setBaseline(text); }

            // Set direction based on target language
            const isRTL = TXTR.Utils.isRTL(TXTR.Core.state.targetLang);
            this.element.dir = isRTL ? 'rtl' : 'ltr';
            this.element.style.textAlign = isRTL ? 'right' : 'left';
        },

        renderHTML(text) {
            if (!text) return '';
            let esc = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            esc = esc.replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>');
            esc = esc.replace(/\[i\](.*?)\[\/i\]/gi, '<em>$1</em>');
            esc = esc.replace(/\[u\](.*?)\[\/u\]/gi, '<span style="text-decoration:underline">$1</span>');
            esc = esc.replace(/\[br\]/gi, '<br>');
            esc = esc.replace(/\[link id=(\d+)\](.*?)\[\/link\]/gi, '<span class="txtr-fake-link">$2</span>');

            return esc;
        }
    };

    // ===========================================================================
    // TXTR.Draft - Draft and Baseline management
    // ===========================================================================
    TXTR.Draft = {
        baselineBox: null,
        draftBox: null,
        baselineText: '',
        draftText: '',

        init(container) {
            const wrapper = TXTR.DOM.createElement('div', { className: 'txtr-draft-wrapper' });

            // Baseline
            const baselineSection = TXTR.DOM.createElement('div', { className: 'txtr-baseline-section' });
            const baselineLabel = TXTR.DOM.createElement('div', {
                className: 'txtr-label',
                textContent: TXTR.UILang.get('BASELINE')
            });
            this.baselineBox = TXTR.DOM.createElement('div', {
                className: 'txtr-baseline-box',
                contentEditable: 'false'
            });
            baselineSection.appendChild(baselineLabel);
            baselineSection.appendChild(this.baselineBox);

            // Draft
            const draftSection = TXTR.DOM.createElement('div', { className: 'txtr-draft-section' });
            const draftLabel = TXTR.DOM.createElement('div', {
                className: 'txtr-label',
                textContent: TXTR.UILang.get('DRAFT')
            });
            this.draftBox = TXTR.DOM.createElement('textarea', {
                className: 'txtr-draft-box'
            });
            this.draftBox.addEventListener('input', () => {
                this.draftText = this.draftBox.value;
                TXTR.Diff.update(); TXTR.DiffModern.update();
            });
            draftSection.appendChild(draftLabel);
            draftSection.appendChild(this.draftBox);
        // Use button moved from actions row
        const useBtn = TXTR.DOM.createElement('button', {
            className: 'txtr-btn txtr-btn-use',
            textContent: TXTR.UILang.get('USE_TRANSLATION'),
            onClick: () => TXTR.Actions.useTranslation()
        });
        draftSection.appendChild(useBtn);


            wrapper.appendChild(baselineSection);
            wrapper.appendChild(draftSection);
            container.appendChild(wrapper);
        },

        setBaseline(text) {
            this.baselineText = text;
            if (this.baselineBox) {
                this.baselineBox.textContent = text;
            }
        },

        setDraft(text) {
            this.draftText = text;
            if (this.draftBox) {
                this.draftBox.value = text;
            }
        },

        getDraft() {
            return this.draftBox?.value || this.draftText;
        },

        applyDraftToTarget() {
            const tgtEl = TXTR.DOM.findTranslationTextArea();
            if (!tgtEl) return false;

            const draft = this.getDraft();
            if (tgtEl.tagName === 'TEXTAREA') {
                tgtEl.value = draft;
            } else {
                tgtEl.innerText = draft;
            }
            tgtEl.dispatchEvent(new Event('input', { bubbles: true }));
            TXTR.Preview.update();
            return true;
        },

        updateLabels() {
            const baselineLabel = document.querySelector('.txtr-baseline-section .txtr-label');
            const draftLabel = document.querySelector('.txtr-draft-section .txtr-label');
            if (baselineLabel) baselineLabel.textContent = TXTR.UILang.get('BASELINE');
            if (draftLabel) draftLabel.textContent = TXTR.UILang.get('DRAFT');
        }
    };

    // ===========================================================================
    // TXTR.Diff - Diff engine (Style Y - unified diff)
    // ===========================================================================
    TXTR.Diff = {
        element: null,
        enabled: false,

        init(container) {
            this.element = TXTR.DOM.createElement('div', { className: 'txtr-diff-box' });
            this.element.style.display = 'none';
            container.appendChild(this.element);

            const saved = TXTR.Storage.get('showDiff');
            this.enabled = saved === 'true';
        },

        toggle() {
            this.enabled = !this.enabled;
            TXTR.Storage.set('showDiff', this.enabled.toString());
            this.updateVisibility();
            if (this.enabled) this.update();
        },

        updateVisibility() {
            const show = this.enabled;

            // Core diff box visibility
            if (this.element) {
                this.element.style.display = show ? 'block' : 'none';
            }

            // Unified comparison area (baseline + draft + button + labels + diff title/box)
            const selectors = [
                '.txtr-baseline-section',
                '.txtr-draft-section',
                '.txtr-draft-wrapper',
                '.txtr-baseline-box',
                '.txtr-draft-box',
                '.txtr-btn-use',
                '.txtr-diff-title',
                '.txtr-diff-box',
                '.txtr-label'
            ];

            selectors.forEach((sel) => {
                document.querySelectorAll(sel).forEach((el) => {
                    el.style.display = show ? '' : 'none';
                });
            });
        },

        update() {
            if (!this.element || !this.enabled) return;

            const baseline = TXTR.Draft.baselineText;
            const draft = TXTR.Draft.getDraft();
            const diffHTML = this.buildUnifiedDiff(baseline, draft);
            this.element.innerHTML = diffHTML;
        },

        buildUnifiedDiff(oldText, newText) {
            if (oldText === newText) {
                return '<div class="txtr-diff-same">No changes</div>';
            }

            const oldWords = oldText.split(/\s+/);
            const newWords = newText.split(/\s+/);
            let result = '';

            // Simple word-based diff
            const maxLen = Math.max(oldWords.length, newWords.length);
            for (let i = 0; i < maxLen; i++) {
                const oldW = oldWords[i] || '';
                const newW = newWords[i] || '';

                if (oldW === newW) {
                    result += `<span class="txtr-diff-unchanged">${this.escapeHTML(newW)}</span> `;
                } else if (!oldW) {
                    result += `<span class="txtr-diff-added">${this.escapeHTML(newW)}</span> `;
                } else if (!newW) {
                    result += `<span class="txtr-diff-removed">${this.escapeHTML(oldW)}</span> `;
                } else {
                    result += `<span class="txtr-diff-removed">${this.escapeHTML(oldW)}</span>`;
                    result += `<span class="txtr-diff-added">${this.escapeHTML(newW)}</span> `;
                }
            }
            return result;
        },

        escapeHTML(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
    };

    // ===========================================================================
    // TXTR.Actions - Button actions
    // ===========================================================================
    TXTR.Actions = {
        async retranslate() {
            await TXTR.Core.autoTranslate(true);
        },

        async copyAndOpenChatGPT() {
            const srcEl = TXTR.DOM.findSourceTextArea();
            const text = srcEl?.innerText || srcEl?.textContent || '';

            if (text) {
                await this.copyToClipboard(text);
                TXTR.UI.setStatus('STATUS_COPIED');
                window.open('https://chat.openai.com', '_blank');
                setTimeout(() => TXTR.UI.clearStatus(), 1500);
            }
        },

        async copyAndOpenDicta() {
            const tgtEl = TXTR.DOM.findTranslationTextArea();
            const text = tgtEl?.value || tgtEl?.innerText || TXTR.Core.state.lastTranslation;
            if (text) {
                await this.copyToClipboard(text);
                TXTR.UI.setStatus('STATUS_COPIED');
                window.open(`https://nakdan.dicta.org.il/?text=${encodeURIComponent(text)}`, '_blank');
                setTimeout(() => TXTR.UI.clearStatus(), 1500);
            }
        },

        useTranslation() {
            const success = TXTR.Draft.applyDraftToTarget();
            if (success) {
                TXTR.UI.setStatus('STATUS_SUCCESS');
                setTimeout(() => TXTR.UI.clearStatus(), 1500);
            }
        },

        togglePause() {
            TXTR.Core.toggleAutoFlow();
        },

        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                return ok;
            }
        }
    };

    // ===========================================================================
    // TXTR.Observer - DOM observer for auto-translation
    // ===========================================================================
    TXTR.Observer = {
        sourceObserver: null,
        targetObserver: null,
        retryTimer: null,

        init() {
            this.bindObservers();
        },

        bindObservers() {
            const srcEl = TXTR.DOM.findSourceTextArea();
            const tgtEl = TXTR.DOM.findTranslationTextArea();

            if (srcEl && !this.sourceObserver) {
                this.sourceObserver = new MutationObserver(
                    TXTR.Utils.debounce(() => TXTR.Core.autoTranslate(), 300)
                );
                this.sourceObserver.observe(srcEl, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
                // Trigger initial translation
                setTimeout(() => TXTR.Core.autoTranslate(), 100);
            }

            if (tgtEl && !this.targetObserver) {
                this.targetObserver = new MutationObserver(
                    TXTR.Utils.debounce(() => TXTR.Preview.update(), 200)
                );
                this.targetObserver.observe(tgtEl, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                    attributes: true
                });
            }

            // Retry if elements not found
            if (!srcEl || !tgtEl) {
                if (this.retryTimer) clearTimeout(this.retryTimer);
                this.retryTimer = setTimeout(() => this.bindObservers(), 500);
            }
        },

        disconnect() {
            if (this.sourceObserver) {
                this.sourceObserver.disconnect();
                this.sourceObserver = null;
            }
            if (this.targetObserver) {
                this.targetObserver.disconnect();
                this.targetObserver = null;
            }
        },

        rebind() {
            this.disconnect();
            this.bindObservers();
        }
    };

    // ===========================================================================
    // TXTR.Layout - Full/Compact mode management
    // ===========================================================================
    TXTR.Layout = {
        isCompact: false,

        init() {
            const saved = TXTR.Storage.get('compactMode');
            this.isCompact = saved === 'true';
            this.apply();
        },

        toggle() {
            this.isCompact = !this.isCompact;
            TXTR.Storage.set('compactMode', this.isCompact.toString());
            this.apply();
        },

        apply() {
            const ui = document.getElementById('txtr-ui');
            if (!ui) return;

            if (this.isCompact) {
                ui.classList.add('txtr-compact');
                const compact = TXTR.Storage.getJSON('sizeCompact') || { w: 449, h: 318 };
                ui.style.width = compact.w + 'px';
                ui.style.height = compact.h + 'px';
            } else {
                ui.classList.remove('txtr-compact');
                const full = TXTR.Storage.getJSON('sizeFull');
                if (full && full.w && full.h) {
                    ui.style.width = full.w + 'px';
                    ui.style.height = full.h + 'px';
                } else {
                    ui.style.width = '520px';
                    ui.style.height = '360px';
                }
            }

            TXTR.UI.updateActionButtons();
            const draftWrapper = document.querySelector('.txtr-draft-wrapper');
            if (draftWrapper) {
                draftWrapper.style.display = TXTR.Layout.isCompact ? 'none' : '';
            }
        }
    };

    // ===========================================================================
    // TXTR.UI - Main UI builder
    // ===========================================================================
    TXTR.UI = {

enableDrag(ui, header) {
    let dragging = false;
    let offsetX = 0, offsetY = 0;
    let pointerX = 0, pointerY = 0;
    let Lprev = 0, Tprev = 0;
    let rafActive = false;

    function rafLoop() {
        if (!dragging) { rafActive = false; return; }

        const pad = 4;

        let targetL = pointerX - offsetX;
        let targetT = pointerY - offsetY;

        const maxL = window.innerWidth - ui.offsetWidth - pad;
        const maxT = window.innerHeight - ui.offsetHeight - pad;

        targetL = Math.max(pad, Math.min(maxL, targetL));
        targetT = Math.max(pad, Math.min(maxT, targetT));

        // Stronger inertia + faster speed
        const factor = 0.97;   // faster catch-up
        const inertia = 0.08;  // stronger overshoot for OS-like glide

        const deltaL = targetL - Lprev;
        const deltaT = targetT - Tprev;

        Lprev = Lprev + deltaL * factor + deltaL * inertia;
        Tprev = Tprev + deltaT * factor + deltaT * inertia;

        ui.style.left = Lprev + 'px';
        ui.style.top = Tprev + 'px';
        ui.style.right = 'auto';
        ui.style.bottom = 'auto';

        requestAnimationFrame(rafLoop);
    }

    header.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('button')) return;

        const rect = ui.getBoundingClientRect();
        dragging = true;

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        pointerX = e.clientX;
        pointerY = e.clientY;

        Lprev = rect.left;
        Tprev = rect.top;

        document.body.style.userSelect = 'none';

        if (!rafActive) {
            rafActive = true;
            requestAnimationFrame(rafLoop);
        }
    });

    document.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        pointerX = e.clientX;
        pointerY = e.clientY;
    });

    document.addEventListener('pointerup', () => {
        if (!dragging) return;
        dragging = false;

        document.body.style.userSelect = '';
        TXTR.UI.savePosition(ui);
    });
},

        elements: {},
        statusTimeout: null,

        build() {
            // Main container
            const ui = TXTR.DOM.createElement('div', {
                id: 'txtr-ui',
                className: `txtr-theme-${TXTR.Theme.current}`
            });

            // Header
            const header = this.buildHeader();
            ui.appendChild(header);

            // Content area
            const content = TXTR.DOM.createElement('div', { className: 'txtr-content' });

            // Top row (controls)
            const topRow = this.buildTopRow();
            content.appendChild(topRow);

            // Disclaimer
            const disclaimer = TXTR.DOM.createElement('div', {
                className: 'txtr-disclaimer',
                textContent: TXTR.UILang.get('DISCLAIMER')
            });
            this.elements.disclaimer = disclaimer;
            content.appendChild(disclaimer);

            // Action buttons
            const actionsRow = this.buildActionsRow();
            content.appendChild(actionsRow);

            // Scroll area
            const scrollArea = TXTR.DOM.createElement('div', { className: 'txtr-scroll-area' });

            // Preview section
            const previewSection = TXTR.DOM.createElement('div', { className: 'txtr-preview-section' });
            const previewLabel = TXTR.DOM.createElement('div', {
                className: 'txtr-section-title',
                textContent: TXTR.UILang.get('PREVIEW')
            });
            this.elements.previewLabel = previewLabel;
            previewSection.appendChild(previewLabel);
            TXTR.Preview.init(previewSection);
            scrollArea.appendChild(previewSection);

            // Blank line before diff toggle
            const blankLine = TXTR.DOM.createElement('div', { style: 'height:12px;' });
            scrollArea.appendChild(blankLine);

            // Diff toggle moved here
            const diffToggle = TXTR.UI.buildDiffToggle();
            scrollArea.appendChild(diffToggle);


            // Draft/Baseline section
            TXTR.Draft.init(scrollArea);

// Modern diff container (UI only, placeholder)
const diffModernContainer = TXTR.DOM.createElement('div', {
    className: 'txtr-diff-box',
    textContent: 'תיבת השוואה'
});
scrollArea.appendChild(diffModernContainer);

// Diff toggle
            

            // Diff box
            TXTR.Diff.init(scrollArea);

            content.appendChild(scrollArea);
            ui.appendChild(content);

            // Resizer
            const resizer = TXTR.DOM.createElement('div', { className: 'txtr-resizer' });
            ui.appendChild(resizer);

            // Store reference
            this.elements.ui = ui;
            this.elements.content = content;

            // Apply saved position
            this.restorePosition(ui);

            // Enable dragging
            this.enableDrag(ui, header);

            // Enable resizing
            this.enableResize(ui, resizer);

            
// === What's New Popup ===
(function(){
    const key='txtr_whatsnew_shown_3_0_1';
    if(!localStorage.getItem(key)){
        const popup=document.createElement('div');
        popup.className='txtr-whatsnew-popup';
        popup.style.cssText='position:absolute;top:50px;left:20px;right:20px;background:#fff;border:1px solid #ccc;padding:12px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);z-index:9999;font-size:14px;';

        popup.innerHTML = `
<div style="font-weight:600;font-size:15px;margin-bottom:6px;">What's New</div>

<ul style="margin:0 0 10px 18px;padding:0;">
<li><b>Improved UI Layout:</b> switch between Full Mode and Compact Mode</li>
<li><b>Modern Diff section:</b> toggle comparison view</li>
<li><b>Additional UI languages:</b> French, Portuguese, German, Turkish, Filipino and more</li>
<li><b>Enhanced drag & flexible resize</b></li>
</ul>

<div style="font-weight:600;font-size:14px;margin:12px 0 4px 0;">Known Issues:</div>

<ul style="margin:0 0 10px 18px;padding:0;">
<li><b>Transifex escaping:</b> Some characters (like <code>&lt;&lt;</code> <code>&gt;&gt;</code> <code>&lt;tag&gt;</code> <code>&amp;</code>) may appear encoded when inserted automatically via the add-on. This is a Transifex limitation (WAD).</li>
<li><b>UI drag latency:</b> Slight drag delay may occur in some environments.</li>
</ul>

<button class="txtr-whatsnew-ok" style="padding:6px 12px;border:1px solid #888;border-radius:6px;background:#eaeaea;cursor:pointer;margin-top:10px;">
Great!
</button>
`;

        ui.appendChild(popup);

        popup.querySelector('.txtr-whatsnew-ok').onclick = () => {
            popup.remove();
            localStorage.setItem(key,'1');
        };
    }
// ===========================================================================
// TXTR Dropdown Chevron Manager (inside menu, sticky)
// ===========================================================================
(function(){
  function ensureChevron(menu){
    if (!menu) return;

    let chev = menu.querySelector('.txtr-dropdown-chevron');
    if (!chev) {
      chev = document.createElement('div');
      chev.className = 'txtr-dropdown-chevron';
      chev.textContent = '⌄';
      menu.appendChild(chev);
    }

    const update = () => {
      const hasOverflow = menu.scrollHeight > menu.clientHeight + 1;
      chev.style.display = hasOverflow ? 'block' : 'none';
    };

    update();
    menu.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.txtr-dropdown-menu').forEach(menu => {
      ensureChevron(menu);
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
})();

})();

            
// === Version Label ===
(function(){
    const v = document.createElement('div');
    v.className = 'txtr-version';
    v.style.cssText = 'position:absolute;left:6px;bottom:4px;font-size:11px;opacity:0.6;';
    v.textContent = 'v' + GM_info.script.version;
    v.style.pointerEvents = 'auto';
    v.style.cursor = 'pointer';
    v.addEventListener('click', () => {
        if (window.TXTR && TXTR.WhatsNew && typeof TXTR.WhatsNew.show === 'function') {
            TXTR.WhatsNew.show(true);
        }
    });
    ui.appendChild(v);
// ===========================================================================
// TXTR Dropdown Chevron Manager (inside menu, sticky)
// ===========================================================================
(function(){
  function ensureChevron(menu){
    if (!menu) return;

    let chev = menu.querySelector('.txtr-dropdown-chevron');
    if (!chev) {
      chev = document.createElement('div');
      chev.className = 'txtr-dropdown-chevron';
      chev.textContent = '⌄';
      menu.appendChild(chev);
    }

    const update = () => {
      const hasOverflow = menu.scrollHeight > menu.clientHeight + 1;
      chev.style.display = hasOverflow ? 'block' : 'none';
    };

    update();
    menu.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.txtr-dropdown-menu').forEach(menu => {
      ensureChevron(menu);
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
})();

})();

            return ui;
        },

        buildHeader() {
            const header = TXTR.DOM.createElement('div', { className: 'txtr-header' });

            // Left section
            const left = TXTR.DOM.createElement('div', { className: 'txtr-header-left' });

            // Drag handle
            const dragHandle = TXTR.DOM.createElement('span', {
                className: 'txtr-drag-handle',
                textContent: '\u28FF',
                title: TXTR.UILang.get('DRAG')
            });
            left.appendChild(dragHandle);

                        this.elements.dragHandle = dragHandle;

// UI Language button
            const uiLangBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-icon',
                textContent: '\uD83C\uDF10',
                title: TXTR.UILang.get('UI_LANG'),
                onClick: () => this.showUILangMenu(uiLangBtn)
            });
            left.appendChild(uiLangBtn);

                        this.elements.uiLangBtn = uiLangBtn;

// Theme button
            const themeBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-icon',
                textContent: '\uD83C\uDF13',
                title: TXTR.UILang.get('THEME'),
                onClick: () => this.showThemeMenu(themeBtn)
            });
            left.appendChild(themeBtn);

                        this.elements.themeBtn = themeBtn;

header.appendChild(left);

            // Center - Title
            const center = TXTR.DOM.createElement('div', {
                className: 'txtr-header-center',
                textContent: 'Transifex Translator add-on'
            });
            header.appendChild(center);

            // Right section
            const right = TXTR.DOM.createElement('div', { className: 'txtr-header-right' });

            // Mode toggle iOS-style (UI only)
            const modeWrapper = TXTR.DOM.createElement('label', { className: 'txtr-ios-switch' });
            const modeInput = TXTR.DOM.createElement('input', {
                type: 'checkbox',
                className: 'txtr-ios-toggle-input',
                onChange: () => TXTR.Layout.toggle()
            });
            modeInput.checked = TXTR.Layout.isCompact;
            const modeSlider = TXTR.DOM.createElement('span', { className: 'txtr-ios-slider' });
            modeWrapper.appendChild(modeInput);
            modeWrapper.appendChild(modeSlider);
            right.appendChild(modeWrapper);


            // Collapse button
            const collapseBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-icon',
                textContent: '\u2212',
                title: TXTR.UILang.get('COLLAPSE'),
                onClick: () => this.toggleCollapse()
            });
            this.elements.collapseBtn = collapseBtn;
            right.appendChild(collapseBtn);

                        this.elements.collapseBtn = collapseBtn;

// Close button
            const closeBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-icon txtr-btn-close',
                textContent: '\u2716',
                title: TXTR.UILang.get('CLOSE'),
                onClick: () => this.hide()
            });
            right.appendChild(closeBtn);

                        this.elements.closeBtn = closeBtn;

header.appendChild(right);

            this.elements.header = header;
            return header;
        },

        buildTopRow() {
            const row = TXTR.DOM.createElement('div', { className: 'txtr-top-row' });

            // Target language select
            const langLabel = TXTR.DOM.createElement('label', {
                className: 'txtr-label-inline',
                textContent: TXTR.UILang.get('TARGET_LANG') + ':'
            });
            this.elements.langLabel = langLabel;

            const langSelect = TXTR.DOM.createElement('select', {
                className: 'txtr-select',
                onChange: (e) => {
                    TXTR.Core.setTargetLang(e.target.value);
                    TXTR.Core.autoTranslate(true);
                }
            });

            // Populate languages
            this.populateLanguageSelect(langSelect);
            this.elements.langSelect = langSelect;

            row.appendChild(langLabel);
            row.appendChild(langSelect);

            return row;
        },

        buildActionsRow() {
            const row = TXTR.DOM.createElement('div', { className: 'txtr-actions-row' });

            // Pause/Resume button
            const pauseBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-pause',
                textContent: TXTR.Core.state.autoFlowEnabled ? TXTR.UILang.get('PAUSE_AUTOTR') : TXTR.UILang.get('RESUME_AUTOTR'),
                onClick: () => TXTR.Actions.togglePause()
            });
            this.elements.pauseBtn = pauseBtn;

            // Retranslate button
            const retranslateBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-primary',
                textContent: TXTR.UILang.get('RETRANSLATE'),
                onClick: () => TXTR.Actions.retranslate()
            });
            this.elements.retranslateBtn = retranslateBtn;

            // Copy & ChatGPT button
            const chatgptBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-chatgpt',
                innerHTML: `<svg viewBox="0 0 721 721" xmlns="http://www.w3.org/2000/svg">
  <path d="M304.246 295.411V249.828C304.246 245.989 305.687 243.109 309.044 241.191L400.692 188.412C413.167 181.215 428.042 177.858 443.394 177.858C500.971 177.858 537.44 222.482 537.44 269.982C537.44 273.34 537.44 277.179 536.959 281.018L441.954 225.358C436.197 222 430.437 222 424.68 225.358L304.246 295.411ZM518.245 472.945V364.024C518.245 357.304 515.364 352.507 509.608 349.149L389.174 279.096L428.519 256.543C431.877 254.626 434.757 254.626 438.115 256.543L529.762 309.323C556.154 324.679 573.905 357.304 573.905 388.971C573.905 425.436 552.315 459.024 518.245 472.941V472.945ZM275.937 376.982L236.592 353.952C233.235 352.034 231.794 349.154 231.794 345.315V239.756C231.794 188.416 271.139 149.548 324.4 149.548C344.555 149.548 363.264 156.268 379.102 168.262L284.578 222.964C278.822 226.321 275.942 231.119 275.942 237.838V376.986L275.937 376.982ZM360.626 425.922L304.246 394.255V327.083L360.626 295.416L417.002 327.083V394.255L360.626 425.922ZM396.852 571.789C376.698 571.789 357.989 565.07 342.151 553.075L436.674 498.374C442.431 495.017 445.311 490.219 445.311 483.499V344.352L485.138 367.382C488.495 369.299 489.936 372.179 489.936 376.018V481.577C489.936 532.917 450.109 571.785 396.852 571.785V571.789ZM283.134 464.79L191.486 412.01C165.094 396.654 147.343 364.029 147.343 332.362C147.343 295.416 169.415 262.309 203.48 248.393V357.791C203.48 364.51 206.361 369.308 212.117 372.665L332.074 442.237L292.729 464.79C289.372 466.707 286.491 466.707 283.134 464.79ZM277.859 543.48C223.639 543.48 183.813 502.695 183.813 452.314C183.813 448.475 184.294 444.636 184.771 440.797L279.295 495.498C285.051 498.856 290.812 498.856 296.568 495.498L417.002 425.927V471.509C417.002 475.349 415.562 478.229 412.204 480.146L320.557 532.926C308.081 540.122 293.206 543.48 277.854 543.48H277.859ZM396.852 600.576C454.911 600.576 503.37 559.313 514.41 504.612C568.149 490.696 602.696 440.315 602.696 388.976C602.696 355.387 588.303 322.762 562.392 299.25C564.791 289.173 566.231 279.096 566.231 269.024C566.231 200.411 510.571 149.067 446.274 149.067C433.322 149.067 420.846 150.984 408.37 155.305C386.775 134.192 357.026 120.758 324.4 120.758C266.342 120.758 217.883 162.02 206.843 216.721C153.104 230.637 118.557 281.018 118.557 332.357C118.557 365.946 132.95 398.571 158.861 422.083C156.462 432.16 155.022 442.237 155.022 452.309C155.022 520.922 210.682 572.266 274.978 572.266C287.931 572.266 300.407 570.349 312.883 566.028C334.473 587.141 364.222 600.576 396.852 600.576Z" fill="currentColor"/>
</svg>`,
                onClick: () => TXTR.Actions.copyAndOpenChatGPT()
            });
            this.elements.chatgptBtn = chatgptBtn;

            // Dicta button (Hebrew only)
            const dictaBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-dicta',
                textContent: TXTR.UILang.get('DICTA'),
                onClick: () => TXTR.Actions.copyAndOpenDicta()
            });
            this.elements.dictaBtn = dictaBtn;

            // Use Translation button
            const useBtn = TXTR.DOM.createElement('button', {
                className: 'txtr-btn txtr-btn-use',
                textContent: TXTR.UILang.get('USE_TRANSLATION'),
                onClick: () => TXTR.Actions.useTranslation()
            });
            this.elements.useBtn = useBtn;

            // Status
            const status = TXTR.DOM.createElement('span', { className: 'txtr-status' });
            this.elements.status = status;

            row.appendChild(pauseBtn);
            row.appendChild(retranslateBtn);
            row.appendChild(chatgptBtn);
            row.appendChild(dictaBtn);
            // moved useBtn to draft section
            row.appendChild(status);

            this.elements.actionsRow = row;
            return row;
        },

        buildDiffToggle() {
            const wrapper = TXTR.DOM.createElement('div', { className: 'txtr-diff-toggle-wrapper' });

            const label = TXTR.DOM.createElement('label', { className: 'txtr-toggle-label' });

            const checkbox = TXTR.DOM.createElement('input', {
                type: 'checkbox',
                className: 'txtr-toggle-input'
            });
            checkbox.checked = TXTR.Diff.enabled;
            checkbox.addEventListener('change', () => TXTR.Diff.toggle());
            this.elements.diffToggle = checkbox;

            const slider = TXTR.DOM.createElement('span', { className: 'txtr-toggle-slider' });
            const text = TXTR.DOM.createElement('span', {
                className: 'txtr-toggle-text',
                textContent: TXTR.UILang.get('SHOW_DIFF')
            });
            this.elements.diffToggleText = text;

            label.appendChild(checkbox);
            label.appendChild(slider);
            label.appendChild(text);
            wrapper.appendChild(label);

            return wrapper;
        },

        populateLanguageSelect(select) {
            const languages = {
                'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic',
                'hy': 'Armenian', 'az': 'Azerbaijani', 'eu': 'Basque', 'be': 'Belarusian',
                'bn': 'Bengali', 'bs': 'Bosnian', 'bg': 'Bulgarian', 'ca': 'Catalan',
                'ceb': 'Cebuano', 'zh': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)',
                'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish',
                'nl': 'Dutch', 'en': 'English', 'eo': 'Esperanto', 'et': 'Estonian',
                'fi': 'Finnish', 'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician',
                'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gu': 'Gujarati',
                'ht': 'Haitian Creole', 'ha': 'Hausa', 'haw': 'Hawaiian', 'iw': 'Hebrew',
                'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian', 'is': 'Icelandic',
                'ig': 'Igbo', 'id': 'Indonesian', 'ga': 'Irish', 'it': 'Italian',
                'ja': 'Japanese', 'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh',
                'km': 'Khmer', 'ko': 'Korean', 'ku': 'Kurdish', 'ky': 'Kyrgyz',
                'lo': 'Lao', 'la': 'Latin', 'lv': 'Latvian', 'lt': 'Lithuanian',
                'lb': 'Luxembourgish', 'mk': 'Macedonian', 'mg': 'Malagasy', 'ms': 'Malay',
                'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi',
                'mn': 'Mongolian', 'my': 'Myanmar', 'ne': 'Nepali', 'no': 'Norwegian',
                'ny': 'Nyanja', 'or': 'Odia', 'ps': 'Pashto', 'fa': 'Persian',
                'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian',
                'ru': 'Russian', 'sm': 'Samoan', 'gd': 'Scots Gaelic', 'sr': 'Serbian',
                'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi', 'si': 'Sinhala',
                'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish',
                'su': 'Sundanese', 'sw': 'Swahili', 'sv': 'Swedish', 'tl': 'Tagalog',
                'tg': 'Tajik', 'ta': 'Tamil', 'tt': 'Tatar', 'te': 'Telugu',
                'th': 'Thai', 'tr': 'Turkish', 'tk': 'Turkmen', 'uk': 'Ukrainian',
                'ur': 'Urdu', 'ug': 'Uyghur', 'uz': 'Uzbek', 'vi': 'Vietnamese',
                'cy': 'Welsh', 'xh': 'Xhosa', 'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu'
            };

            Object.entries(languages).forEach(([code, name]) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = name;
                if (code === TXTR.Core.state.targetLang) opt.selected = true;
                select.appendChild(opt);
            });
        },

        // Menus
        showUILangMenu(anchor) {
            this.closeAllMenus();

            const names = {
                en:'English', he:'עברית', es:'Español', ru:'Русский', ar:'العربية',
                uk:'Українська', de:'Deutsch', fr:'Français', pt:'Português', it:'Italiano',
                tr:'Türkçe', ms:'Bahasa Melayu', tl:'Tagalog', id:'Bahasa Indonesia', nl:'Nederlands',
                el:'Ελληνικά', fa:'فارسی', hi:'हिन्दी', ja:'日本語', ko:'한국어',
                pl:'Polski', th:'ไทย', vi:'Tiếng Việt', zh:'简体中文', 'zh-TW':'繁體中文'
            };

            const items = Object.keys(TXTR.UILang.labels).map(code => ({
                label: names[code] || code.toUpperCase(),
                value: code,
                checked: TXTR.UILang.current === code
            }));

            const menu = this.createMenu(items, (value) => {
                TXTR.UILang.setLang(value);
                this.updateAllLabels();
                this.closeAllMenus();
            });

            const searchBox = TXTR.DOM.createElement('input', {
                className: 'txtr-search-ui-lang',
                placeholder: 'Search…'
            });

            searchBox.addEventListener('input', () => {
                const q = searchBox.value.toLowerCase();
                const rows = menu.querySelectorAll('.txtr-menu-item');
                rows.forEach(row => {
                    const labelEl = row.querySelector('span:last-child') || row;
                    const labelText = (labelEl.textContent || '').toLowerCase();
                    row.style.display = labelText.includes(q) ? '' : 'none';
                });
            });

            menu.insertBefore(searchBox, menu.firstChild);

            this.positionMenu(menu, anchor);
        },

        showThemeMenu(anchor) {
            this.closeAllMenus();
            const menu = this.createMenu([
                { label: TXTR.UILang.get('THEME_LIGHT'), value: 'light', checked: TXTR.Theme.current === 'light' },
                { label: TXTR.UILang.get('THEME_DARK'), value: 'dark', checked: TXTR.Theme.current === 'dark' }
            ], (value) => {
                TXTR.Theme.setTheme(value);
                this.closeAllMenus();
            });
            this.positionMenu(menu, anchor);
        },

        showTargetLangMenu(anchor) {
            // Use select instead of custom menu for large list
            this.elements.langSelect?.focus();
        },

        createMenu(items, onSelect) {
    const menu = TXTR.DOM.createElement('div', {
        className: 'txtr-menu txtr-dropdown txtr-dropdown-menu'
    });

    menu.style.marginTop = '6px';

    items.forEach(item => {
        const row = TXTR.DOM.createElement('div', {
            className: 'txtr-menu-item' + (item.checked ? ' txtr-menu-item-checked' : ''),
            onClick: () => onSelect(item.value)
        });

        const radio = TXTR.DOM.createElement('span', {
            className: 'txtr-radio' + (item.checked ? ' checked' : '')
        });

        const label = TXTR.DOM.createElement('span', {
            textContent: item.label
        });

        row.appendChild(radio);
        row.appendChild(label);
        menu.appendChild(row);
    });

    document.body.appendChild(menu);
    this.elements.activeMenu = menu;

    setTimeout(() => {
        document.addEventListener('click', this.handleOutsideClick);
    }, 10);

    return menu;
},


        handleOutsideClick: function(e) {
            const menu = TXTR.UI.elements.activeMenu;
            if (menu && !menu.contains(e.target)) {
                TXTR.UI.closeAllMenus();
            }
        },

        positionMenu(menu, anchor) {
            const rect = anchor.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = (rect.bottom + 4) + 'px';
            menu.style.left = rect.left + 'px';
            menu.style.zIndex = '2147483647';
        },

        closeAllMenus() {
            document.removeEventListener('click', this.handleOutsideClick);
            if (this.elements.activeMenu) {
                this.elements.activeMenu.remove();
                this.elements.activeMenu = null;
            }
        },

        // Status
        setStatus(key) {
            if (this.elements.status) {
                this.elements.status.textContent = TXTR.UILang.get(key);
            }
        },

        clearStatus() {
            if (this.elements.status) {
                this.elements.status.textContent = '';
            }
        },

        // Update functions
        updatePauseButton() {
            if (this.elements.pauseBtn) {
                this.elements.pauseBtn.textContent = TXTR.Core.state.autoFlowEnabled
                    ? TXTR.UILang.get('PAUSE_AUTOTR')
                    : TXTR.UILang.get('RESUME_AUTOTR');
                this.elements.pauseBtn.classList.toggle('txtr-paused', !TXTR.Core.state.autoFlowEnabled);
            }
        },

        updateActionButtons() {
            const isCompact = TXTR.Layout.isCompact;
            // In compact mode, show icons; in full mode, show text
            if (this.elements.retranslateBtn) {
                this.elements.retranslateBtn.textContent = isCompact ? '\u21BB' : TXTR.UILang.get('RETRANSLATE');
            }
            if (this.elements.chatgptBtn) {
                if (isCompact) {
                    this.elements.chatgptBtn.innerHTML = `<svg viewBox="0 0 721 721" xmlns="http://www.w3.org/2000/svg">
  <path d="M304.246 295.411V249.828C304.246 245.989 305.687 243.109 309.044 241.191L400.692 188.412C413.167 181.215 428.042 177.858 443.394 177.858C500.971 177.858 537.44 222.482 537.44 269.982C537.44 273.34 537.44 277.179 536.959 281.018L441.954 225.358C436.197 222 430.437 222 424.68 225.358L304.246 295.411ZM518.245 472.945V364.024C518.245 357.304 515.364 352.507 509.608 349.149L389.174 279.096L428.519 256.543C431.877 254.626 434.757 254.626 438.115 256.543L529.762 309.323C556.154 324.679 573.905 357.304 573.905 388.971C573.905 425.436 552.315 459.024 518.245 472.941V472.945ZM275.937 376.982L236.592 353.952C233.235 352.034 231.794 349.154 231.794 345.315V239.756C231.794 188.416 271.139 149.548 324.4 149.548C344.555 149.548 363.264 156.268 379.102 168.262L284.578 222.964C278.822 226.321 275.942 231.119 275.942 237.838V376.986L275.937 376.982ZM360.626 425.922L304.246 394.255V327.083L360.626 295.416L417.002 327.083V394.255L360.626 425.922ZM396.852 571.789C376.698 571.789 357.989 565.07 342.151 553.075L436.674 498.374C442.431 495.017 445.311 490.219 445.311 483.499V344.352L485.138 367.382C488.495 369.299 489.936 372.179 489.936 376.018V481.577C489.936 532.917 450.109 571.785 396.852 571.785V571.789ZM283.134 464.79L191.486 412.01C165.094 396.654 147.343 364.029 147.343 332.362C147.343 295.416 169.415 262.309 203.48 248.393V357.791C203.48 364.51 206.361 369.308 212.117 372.665L332.074 442.237L292.729 464.79C289.372 466.707 286.491 466.707 283.134 464.79ZM277.859 543.48C223.639 543.48 183.813 502.695 183.813 452.314C183.813 448.475 184.294 444.636 184.771 440.797L279.295 495.498C285.051 498.856 290.812 498.856 296.568 495.498L417.002 425.927V471.509C417.002 475.349 415.562 478.229 412.204 480.146L320.557 532.926C308.081 540.122 293.206 543.48 277.854 543.48H277.859ZM396.852 600.576C454.911 600.576 503.37 559.313 514.41 504.612C568.149 490.696 602.696 440.315 602.696 388.976C602.696 355.387 588.303 322.762 562.392 299.25C564.791 289.173 566.231 279.096 566.231 269.024C566.231 200.411 510.571 149.067 446.274 149.067C433.322 149.067 420.846 150.984 408.37 155.305C386.775 134.192 357.026 120.758 324.4 120.758C266.342 120.758 217.883 162.02 206.843 216.721C153.104 230.637 118.557 281.018 118.557 332.357C118.557 365.946 132.95 398.571 158.861 422.083C156.462 432.16 155.022 442.237 155.022 452.309C155.022 520.922 210.682 572.266 274.978 572.266C287.931 572.266 300.407 570.349 312.883 566.028C334.473 587.141 364.222 600.576 396.852 600.576Z" fill="currentColor"/>
</svg>`;
                } else {
                    this.elements.chatgptBtn.textContent = TXTR.UILang.get('COPY_CHATGPT');
                }
            }
            if (this.elements.dictaBtn) {
                this.elements.dictaBtn.textContent = isCompact ? '\u05E0' : TXTR.UILang.get('DICTA');
                // Hide Dicta for non-Hebrew
                this.elements.dictaBtn.style.display = (TXTR.UILang.current === 'he') ? '' : 'none';
            }
            if (this.elements.useBtn) {
                this.elements.useBtn.textContent = isCompact ? '\u2713' : TXTR.UILang.get('USE_TRANSLATION');
            }
            if (this.elements.pauseBtn) {
                this.elements.pauseBtn.textContent = isCompact
                    ? (TXTR.Core.state.autoFlowEnabled ? '\u23F8' : '\u25B6')
                    : (TXTR.Core.state.autoFlowEnabled ? TXTR.UILang.get('PAUSE_AUTOTR') : TXTR.UILang.get('RESUME_AUTOTR'));
            }
        },

        updateAllLabels() {
            const L = TXTR.UILang;
            if (this.elements.langLabel) this.elements.langLabel.textContent = L.get('TARGET_LANG') + ':';
            if (this.elements.disclaimer) this.elements.disclaimer.textContent = L.get('DISCLAIMER');
            if (this.elements.previewLabel) this.elements.previewLabel.textContent = L.get('PREVIEW');
            if (this.elements.diffToggleText) this.elements.diffToggleText.textContent = L.get('SHOW_DIFF');
            TXTR.Draft.updateLabels();
            this.updateActionButtons();

            
            // Update header tooltips (titles) according to current UI language (EN fallback is handled by UILang.get)
            if (this.elements.dragHandle) this.elements.dragHandle.title = L.get('DRAG');
            if (this.elements.uiLangBtn) this.elements.uiLangBtn.title = L.get('UI_LANG');
            if (this.elements.themeBtn) this.elements.themeBtn.title = L.get('THEME');
            if (this.elements.closeBtn) this.elements.closeBtn.title = L.get('CLOSE');
            if (this.elements.collapseBtn) {
                const collapsed = (TXTR.Storage.get('collapsed') === 'true');
                this.elements.collapseBtn.title = collapsed ? L.get('EXPAND') : L.get('COLLAPSE');
            }
// Update direction for RTL languages
            const isRTL = TXTR.Utils.isRTL(L.current);
            const ui = document.getElementById('txtr-ui');
            if (ui) {
                ui.dir = isRTL ? 'rtl' : 'ltr';
            }
        
        try { TXTR.updatePreviewCounterTooltip(); } catch(e) {}
    },

        // Collapse
        toggleCollapse() {
            const ui = this.elements.ui;
            if (!ui) return;

            const collapsed = ui.classList.toggle('txtr-collapsed');

            if (this.elements.collapseBtn) {
                this.elements.collapseBtn.textContent = collapsed ? '+' : '\u2212';
                this.elements.collapseBtn.title = collapsed
                    ? TXTR.UILang.get('EXPAND')
                    : TXTR.UILang.get('COLLAPSE');
            }

            TXTR.Storage.set('collapsed', collapsed ? 'true' : 'false');
        },

        hide() {
            if (this.elements.ui) {
                this.elements.ui.style.display = 'none';
            }
        },

        show() {
            if (this.elements.ui) {
                this.elements.ui.style.display = '';
            }
        },

        // Position management
        restorePosition(ui) {
            const pos = TXTR.Storage.getJSON('position');
            if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
                ui.style.left = pos.left + 'px';
                ui.style.top = pos.top + 'px';
                ui.style.right = 'auto';
                ui.style.bottom = 'auto';
            } else {
                // Default: bottom-right
                ui.style.right = '32px';
                ui.style.bottom = '32px';
                ui.style.left = 'auto';
                ui.style.top = 'auto';
            }

            const full = TXTR.Storage.getJSON('sizeFull');
            const compact = TXTR.Storage.getJSON('sizeCompact') || { w: 449, h: 318 };

            if (TXTR.Layout.isCompact) {
                ui.style.width = compact.w + 'px';
                ui.style.height = compact.h + 'px';
            } else if (full && full.w && full.h) {
                ui.style.width = full.w + 'px';
                ui.style.height = full.h + 'px';
            } else {
                ui.style.width = '520px';
                ui.style.height = '360px';
            }

            // Restore collapsed state
            if (TXTR.Storage.get('collapsed') === 'true') {
                setTimeout(() => this.toggleCollapse(), 0);
            }
        },

        savePosition(ui) {
            const rect = ui.getBoundingClientRect();
            TXTR.Storage.setJSON('position', {
                left: Math.round(rect.left),
                top: Math.round(rect.top)
            });
        },

        saveSize(ui) {
            if (!TXTR.Layout.isCompact) {
                const rect = ui.getBoundingClientRect();
                TXTR.Storage.setJSON('sizeFull', {
                    w: Math.round(rect.width),
                    h: Math.round(rect.height)
                });
            }
        },

        // Drag
        


        // Resize
        enableResize(ui, resizer) {
            let resizing = false;
            let startW = 0, startH = 0, startX = 0, startY = 0;
            const limits = { minW: 400, maxW: 1200, minH: 300, maxH: 900 };

            resizer.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const rect = ui.getBoundingClientRect();
                startW = rect.width;
                startH = rect.height;
                startX = e.clientX;
                startY = e.clientY;
                resizing = true;
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!resizing) return;
                let newW = startW + (e.clientX - startX);
                let newH = startH + (e.clientY - startY);
                newW = Math.max(limits.minW, Math.min(limits.maxW, newW));
                newH = Math.max(limits.minH, Math.min(limits.maxH, newH));
                ui.style.width = newW + 'px';
                ui.style.height = newH + 'px';
            });

            document.addEventListener('mouseup', () => {
                if (!resizing) return;
                resizing = false;
                document.body.style.userSelect = '';
                this.saveSize(ui);
            });
        }
    };

    // ===========================================================================
    // TXTR.Loader - Immediate UI load, delayed engine binding
    // ===========================================================================
    TXTR.Loader = {
        init() {
            // Initialize modules
            TXTR.UILang.init();
            TXTR.Theme.init();
            TXTR.Core.init();
            TXTR.Layout.init();

            // Build and inject UI immediately
            const ui = TXTR.UI.build();
            TXTR.DiffModern.init();
            TXTR.DiffModern.update();
this.injectUI(ui);

            // Apply layout (full / compact) now that UI is in the DOM
            TXTR.Layout.apply();

            // Inject styles
            this.injectStyles();

            // Start observer (waits for DOM elements)
            TXTR.Observer.init();

            // Initial UI update
            TXTR.UI.updateAllLabels();
            TXTR.Diff.updateVisibility();
        },

        injectUI(ui) {
            if (document.body) {
                document.body.appendChild(ui);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(ui);
                });
            }
        },

        injectStyles() {
            const css = `
                #txtr-ui {
                    position: fixed;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    border-radius: 15px;
                    box-shadow: 0 10px 28px rgba(21,149,192,0.28);
                    border: 1px solid rgba(144,202,249,0.9);
                    background: rgba(255,255,255,0.96);
                    color: #113355;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    min-width: 400px;
                    min-height: 300px;
                    opacity: 0.97;
                    transition: all 0.16s ease;
                }
                #txtr-ui.txtr-theme-dark {
                    background: rgba(20,24,28,0.98);
                    color: #e6eef7;
                    border-color: rgba(90,150,210,0.55);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.55);
                }
                #txtr-ui.txtr-compact { min-width: 280px; min-height: auto; }
                /* Compact mode: only header + disclaimer + actions remain visible */
                #txtr-ui.txtr-compact .txtr-top-row,
                #txtr-ui.txtr-compact .txtr-scroll-area,
                #txtr-ui.txtr-compact .txtr-preview-section,
                #txtr-ui.txtr-compact .txtr-draft-wrapper,
                #txtr-ui.txtr-compact .txtr-diff-toggle-wrapper,
                #txtr-ui.txtr-compact .txtr-diff-box,
                #txtr-ui.txtr-compact .txtr-resizer {
                    display: none;
                }
                #txtr-ui.txtr-compact .txtr-btn { width: 38px; height: 38px; padding: 0; font-size: 1.2em; }
                #txtr-ui.txtr-collapsed { min-height: 0; height: auto !important; }
                .txtr-header {
                    display: flex; align-items: center; justify-content: space-between;
                    height: 36px; padding: 0 8px;
                    background: #e3f2fd; border-radius: 15px 15px 0 0;
                    cursor: grab; user-select: none;
                }
                #txtr-ui.txtr-theme-dark .txtr-header { background: rgba(144,202,249,0.12); }
                .txtr-header-left, .txtr-header-right { display: flex; align-items: center; gap: 6px; }
                .txtr-header-center { flex: 1; text-align: center; font-weight: 700; color: #1565c0; }
                #txtr-ui.txtr-theme-dark .txtr-header-center { color: #9bceff; }
                .txtr-drag-handle { font-size: 1.2em; opacity: 0.6; cursor: grab; }
                .txtr-content { flex: 1; display: flex; flex-direction: column; padding: 12px 18px; overflow: hidden; }
                .txtr-scroll-area { flex: 1; overflow: auto; padding: 8px 0; }
                #txtr-ui.txtr-collapsed .txtr-content,
                #txtr-ui.txtr-collapsed .txtr-scroll-area,
                #txtr-ui.txtr-collapsed .txtr-resizer {
                    display: none !important;
                }
                #txtr-ui.txtr-collapsed {
                    height: 38px !important;
                    min-height: 0 !important;
                }

                .txtr-top-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 10px; }
                .txtr-label-inline { font-weight: 700; opacity: 0.92; }
                .txtr-select { min-width: 150px; padding: 7px; border-radius: 9px; border: 1px solid rgba(144,202,249,0.9); background: #fafdff; color: #113355; }
                #txtr-ui.txtr-theme-dark .txtr-select { background: #2a2f35; color: #e6eef7; border-color: rgba(255,255,255,0.18); }
                .txtr-disclaimer { text-align: center; color: #bf5900; font-size: 1.03em; font-weight: 700; margin: 6px 0; }
                .txtr-actions-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; margin: 10px 0; 
    width: 100%;
    text-align: center;}
                /* Status on its own centered row */
                .txtr-actions-row .txtr-status {
                    flex-basis: 100% !important;
                    text-align: center !important;
                    margin-top: 4px !important;
                }

                .txtr-btn { border-radius: 9px; padding: 6px 14px; font-size: 1em; cursor: pointer; border: 1px solid rgba(144,202,249,0.9); background: #eef4ff; color: #1763c9; transition: transform 0.12s, filter 0.12s; }
                .txtr-btn:hover { transform: translateY(-1px); filter: brightness(1.02); }
                .txtr-btn-icon { background: none; border: none; font-size: 1.15em; padding: 4px 8px; opacity: 0.85; }
                .txtr-btn-primary, .txtr-btn-use { background: #1565c0; color: #fff; border-color: transparent; }
                .txtr-btn-chatgpt { background: #e5f2e9; color: #106d3c; border: none; }
                .txtr-btn-dicta { background: #faf7e3; color: #b48a1f; border: none; }
                .txtr-btn-pause { background: #eaf7f2; border: 1px solid #9ad3c2; color: #0b6b53; }
                .txtr-btn-pause.txtr-paused { border-style: dashed; border-color: #f2a03d; }
                .txtr-btn-close { color: #c0392b; }
                #txtr-ui.txtr-theme-dark .txtr-btn { background: #2a2f35; color: #e6eef7; border-color: rgba(255,255,255,0.18); }
                #txtr-ui.txtr-theme-dark .txtr-btn-primary, #txtr-ui.txtr-theme-dark .txtr-btn-use { background: #1565c0; color: #fff; }
                .txtr-status { color: #259c2b; white-space: nowrap; margin-left: auto; }
                #txtr-ui.txtr-theme-dark .txtr-status { color: #76d186; }
                .txtr-section-title { font-weight: 800; margin-bottom: 6px; }
                .txtr-preview-box { padding: 10px; border: 1px dashed rgba(144,202,249,0.9); border-radius: 9px; background: rgba(255,255,255,0.98); min-height: 60px; word-wrap: break-word; white-space: pre-wrap; }
                #txtr-ui.txtr-theme-dark .txtr-preview-box { background: rgba(32,36,41,0.98); border-color: rgba(144,202,249,0.35); }
                .txtr-token { font-family: monospace; background: #eef6ff; border: 1px solid #c7e1ff; border-radius: 4px; padding: 1px 4px; }
                #txtr-ui.txtr-theme-dark .txtr-token { background: rgba(144,202,249,0.12); }
                .txtr-draft-wrapper { display: flex; gap: 12px; margin-top: 12px; }
                .txtr-baseline-section, .txtr-draft-section { flex: 1; }
                .txtr-label { font-weight: 700; margin-bottom: 4px; }
                .txtr-baseline-box { padding: 8px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; min-height: 50px; }
                #txtr-ui.txtr-theme-dark .txtr-baseline-box { background: #2a2f35; border-color: #444; }
                .txtr-draft-box { width: 100%; min-height: 50px; padding: 8px; border: 1px solid #1565c0; border-radius: 8px; resize: vertical; font-family: inherit; }
                #txtr-ui.txtr-theme-dark .txtr-draft-box { background: #2a2f35; color: #e6eef7; border-color: #5a96d2; }
                .txtr-diff-toggle-wrapper { margin: 12px 0; }
                .txtr-toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .txtr-toggle-input { width: 40px; height: 20px; appearance: none; background: #1565c0; border-radius: 10px; position: relative; cursor: pointer; transition: background 0.2s; }
                .txtr-toggle-input:checked { background: #ccc; }
                .txtr-toggle-input::before { content: ''; position: absolute; width: 16px; height: 16px; background: #fff; border-radius: 50%; top: 2px; left: 2px; transition: transform 0.2s; }
                .txtr-toggle-input:checked::before { transform: translateX(20px); }
                .txtr-toggle-text { font-weight: 600; }
                .txtr-diff-box { padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; margin-top: 8px; }
                #txtr-ui.txtr-theme-dark .txtr-diff-box { background: #2a2f35; border-color: #444; }
                .txtr-diff-same { color: #888; font-style: italic; }
                .txtr-diff-unchanged {
    background: var(--txtr-diff-unchanged-bg);
}
                .txtr-diff-added {
    background: var(--txtr-diff-added-bg);
    color: var(--txtr-diff-added-text);
}
                .txtr-diff-removed {
    background: var(--txtr-diff-removed-bg);
    color: var(--txtr-diff-removed-text);
}
                .txtr-resizer { position: absolute; right: 6px; bottom: 6px; width: 16px; height: 16px; cursor: nwse-resize; opacity: 0.6; background: linear-gradient(135deg, transparent 50%, rgba(21,101,192,0.4) 50%); }
                .txtr-menu { position: fixed; z-index: 2147483647; background: #fff; border: 1px solid rgba(0,0,0,0.18); box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-radius: 10px; padding: 6px; min-width: 150px; }
                #txtr-ui.txtr-theme-dark ~ .txtr-menu, .txtr-menu.txtr-dark { background: #202428; color: #e5e7eb; border-color: rgba(255,255,255,0.14); }
                .txtr-menu-item { padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .txtr-menu-item:hover { background: rgba(21,101,192,0.12); }
                .txtr-radio { width: 14px; height: 14px; border: 2px solid #1565c0; border-radius: 50%; position: relative; }
                .txtr-radio.checked::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: #1565c0; }
            
                /* iOS Toggle */
                .txtr-ios-switch { position: relative; display: inline-block; width: 46px; height: 24px; 
                    margin-inline: 20px;}
                .txtr-ios-switch input { opacity: 0; width: 0; height: 0; }
                .txtr-ios-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .25s; border-radius: 24px; }
                .txtr-ios-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .25s; border-radius: 50%; }
                .txtr-ios-toggle-input:checked + .txtr-ios-slider { background-color: #34c759; }
                .txtr-ios-toggle-input:checked + .txtr-ios-slider:before { transform: translateX(22px); }
                /* Full/Compact labels around toggle */
                .txtr-ios-switch::before {
                    content: "F";
                    position: absolute;
                    left: -18px;
                    top: 4px;
                    font-weight: 600;
                    font-size: 0.85em;
                    color: inherit;
                }
                .txtr-ios-switch::after {
                    content: "C";
                    position: absolute;
                    right: -18px;
                    top: 4px;
                    font-weight: 600;
                    font-size: 0.85em;
                    color: inherit;
                }

                .txtr-diff-modern {
                    margin-top: 14px;
                    padding: 12px;
                    border-radius: 10px;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.08);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    font-family: consolas, monospace;
                    font-size: 0.92em;
                    white-space: pre-wrap;
                    overflow-x: auto;
                    color: #223;
                }
                #txtr-ui.txtr-theme-dark .txtr-diff-modern {
                    background: #1f252b;
                    border-color: rgba(255,255,255,0.12);
                    color: #dce7f3;
                }
`;
                    
GM_addStyle(css);

GM_addStyle(`
/* Scroll dropdown */
.txtr-dropdown-menu{max-height:220px;overflow-y:auto;scrollbar-width:thin;}
.txtr-dropdown-menu {
    position: relative;
}

.txtr-dropdown-menu::-webkit-scrollbar{width:6px;}
.txtr-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}

#txtr-ui {
    min-width: 420px !important;
    min-height: 300px !important;
    max-width: 95vw !important;
    max-height: 90vh !important;
}

.txtr-fake-link {
    text-decoration: underline;
    color: inherit;
    cursor: default;
    padding: 0 2px;
    border-radius: 3px;
}
.txtr-theme-light .txtr-fake-link:hover {
    background: rgba(0,0,0,0.05);
}
.txtr-theme-dark .txtr-fake-link:hover {
    background: rgba(255,255,255,0.08);
}

/* === TXTR dark scrollbars (TXTR container only) === */
.txtr-theme-dark .txtr-scroll-area::-webkit-scrollbar {
    width: 10px;
}
.txtr-theme-dark .txtr-scroll-area::-webkit-scrollbar-track {
    background: var(--txtr-scrollbar-bg);
}
.txtr-theme-dark .txtr-scroll-area::-webkit-scrollbar-thumb {
    background: var(--txtr-scrollbar-thumb);
}

`);

GM_addStyle(`
/* Scroll dropdown */
.txtr-dropdown-menu{max-height:220px;overflow-y:auto;scrollbar-width:thin;}
.txtr-dropdown-menu {
    position: relative;
}

.txtr-dropdown-menu::-webkit-scrollbar{width:6px;}
.txtr-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}
.txtr-root, .txtr-container, .txtr-main { height: auto !important; }`);
GM_addStyle(`
/* Scroll dropdown */
.txtr-dropdown-menu{max-height:220px;overflow-y:auto;scrollbar-width:thin;}
.txtr-dropdown-menu {
    position: relative;
}

.txtr-dropdown-menu::-webkit-scrollbar{width:6px;}
.txtr-dropdown-menu::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.25);border-radius:4px;}
.txtr-diff-title { font-weight:700; }`);
        }
    };

    // ===========================================================================
    // Initialize
    // ===========================================================================
    TXTR.Loader.init();

// ===========================================================================
// TXTR Dropdown Chevron Manager (inside menu, sticky)
// ===========================================================================
(function(){
  function ensureChevron(menu){
    if (!menu) return;

    let chev = menu.querySelector('.txtr-dropdown-chevron');
    if (!chev) {
      chev = document.createElement('div');
      chev.className = 'txtr-dropdown-chevron';
      chev.textContent = '⌄';
      menu.appendChild(chev);
    }

    const update = () => {
      const hasOverflow = menu.scrollHeight > menu.clientHeight + 1;
      chev.style.display = hasOverflow ? 'block' : 'none';
    };

    update();
    menu.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.txtr-dropdown-menu').forEach(menu => {
      ensureChevron(menu);
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
})();

})();



// ============================================================================
// TXTR.Core – Translation engine (patched to prevent target overwrite)
// ============================================================================

TXTR.Core.autoTranslate = function (force = false) {

    // Respect AutoFlow toggle unless forced
    if (!this.state.autoFlowEnabled && !force) {
        TXTR.Preview.update();
        return;
    }

    // Locate source and target text areas
    const srcEl = TXTR.DOM.findSourceTextArea();
    const tgtEl = TXTR.DOM.findTranslationTextArea();
    if (!srcEl || !tgtEl) return;

    const srcText = (srcEl.value || srcEl.innerText || "").trim();

    // ----------------------------------------------------------------------
    // HARD GUARD on tgtEl — prevent overwrite if target already has text
    // ----------------------------------------------------------------------
    const targetText = (tgtEl.value !== undefined 
                        ? tgtEl.value 
                        : (tgtEl.innerText || "")).trim();

    if (targetText.length > 0 && !force) {
        TXTR.Preview.update();
        return;
    }

    // Avoid unnecessary re-translation if nothing changed (unless force)
    if (srcText === this.state.lastSourceText && !force) {
        TXTR.Preview.update();
        return;
    }

    this.state.lastSourceText = srcText;

    // Perform translation using the configured engine
    const translation = TXTR.Actions.translateNow(srcText);

    // Write translation into the target element
    if (tgtEl.value !== undefined) tgtEl.value = translation;
    else tgtEl.innerText = translation;

    // Update Preview panel
    TXTR.Preview.update();
};



// --- TXTR UI Language Dropdown Chevron Hint ---
(function(){
    function applyChevron(menu){
        if (!menu) return;
        if (menu.scrollHeight <= menu.clientHeight) return;

        let chev = menu.querySelector('.txtr-dropdown-chevron');
        if (!chev) {
            chev = document.createElement('div');
            chev.className = 'txtr-dropdown-chevron';
            chev.textContent = '⌄';
            menu.appendChild(chev);
        }

        const hide = () => { chev.style.opacity = '0'; };
        menu.addEventListener('scroll', hide, { once: true });
        menu.addEventListener('mouseenter', hide, { once: true });
    }

    if (!TXTR || !TXTR.UI || !TXTR.UI.createMenu) return;
    const _createMenu = TXTR.UI.createMenu;
    TXTR.UI.createMenu = function(items, onSelect){
        const menu = _createMenu.apply(this, arguments);
        setTimeout(() => applyChevron(menu), 0);
        return menu;
    };
// ===========================================================================
// TXTR Dropdown Chevron Manager (inside menu, sticky)
// ===========================================================================
(function(){
  function ensureChevron(menu){
    if (!menu) return;

    let chev = menu.querySelector('.txtr-dropdown-chevron');
    if (!chev) {
      chev = document.createElement('div');
      chev.className = 'txtr-dropdown-chevron';
      chev.textContent = '⌄';
      menu.appendChild(chev);
    }

    const update = () => {
      const hasOverflow = menu.scrollHeight > menu.clientHeight + 1;
      chev.style.display = hasOverflow ? 'block' : 'none';
    };

    update();
    menu.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.txtr-dropdown-menu').forEach(menu => {
      ensureChevron(menu);
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
})();

})();


(function addTxtrChevronStyle(){
  if (document.getElementById('txtr-chevron-style')) return;
  const st = document.createElement('style');
  st.id = 'txtr-chevron-style';
  st.textContent = `/* --- TXTR Dropdown Chevron Scroll Hint --- */
.txtr-dropdown-chevron {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    opacity: 0.35;
    pointer-events: none;
    transition: opacity 0.15s ease;
}
.txtr-theme-dark .txtr-dropdown-chevron {
    color: rgba(255,255,255,0.6);
}
.txtr-theme-light .txtr-dropdown-chevron {
    color: rgba(0,0,0,0.5);
}


`;
  document.head.appendChild(st);
// ===========================================================================
// TXTR Dropdown Chevron Manager (inside menu, sticky)
// ===========================================================================
(function(){
  function ensureChevron(menu){
    if (!menu) return;

    let chev = menu.querySelector('.txtr-dropdown-chevron');
    if (!chev) {
      chev = document.createElement('div');
      chev.className = 'txtr-dropdown-chevron';
      chev.textContent = '⌄';
      menu.appendChild(chev);
    }

    const update = () => {
      const hasOverflow = menu.scrollHeight > menu.clientHeight + 1;
      chev.style.display = hasOverflow ? 'block' : 'none';
    };

    update();
    menu.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  const obs = new MutationObserver(() => {
    document.querySelectorAll('.txtr-dropdown-menu').forEach(menu => {
      ensureChevron(menu);
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
})();

})();

// ===========================================================================
// TXTR Protected Tokens Guard (late-bound, safe)
// Fixes [signal] tags and {...} placeholders being modified by MT
// ===========================================================================
(function TXTR_ProtectedTokensPatch(){
    function freezeProtectedTokens(input) {
        const map = [];
        let idx = 0;

        function stash(match) {
            const key = "__TXTR_PROTECTED_" + (idx++);
            map.push({ key: key, value: match });
            return key;
        }

        let out = input;
        out = out.replace(/\{[^}]+\}/g, stash);
        out = out.replace(/\[signal\][\s\S]*?\[\/signal\]/gi, stash);

        return { text: out, map: map };
    }

    function restoreProtectedTokens(output, map) {
        let out = output;
        map.forEach(item => {
            out = out.replace(item.key, item.value);
        });
        return out;
    }

    function tryPatch() {
        if (!window.TXTR || !TXTR.Translation || typeof TXTR.Translation.translateText !== "function") {
            return false;
        }

        if (TXTR.Translation.__protectedTokensPatched) {
            return true;
        }

        const originalTranslate = TXTR.Translation.translateText.bind(TXTR.Translation);

        TXTR.Translation.translateText = async function(text, targetLang) {
            const frozen = freezeProtectedTokens(text);
            const translated = await originalTranslate(frozen.text, targetLang);
            return restoreProtectedTokens(translated, frozen.map);
        };

        TXTR.Translation.__protectedTokensPatched = true;
        return true;
    }

    // Poll until TXTR is fully initialized
    const iv = setInterval(() => {
        if (tryPatch()) {
            clearInterval(iv);
        }
    }, 50);
})();

// ===========================================================================
// TXTR 3.1.2 Hotfix — Protect [signal] blocks and {...} placeholders on ALL translations (incl. Re-translate)
// Scope: logic only, no UI/CSS changes
// ===========================================================================
(function TXTR_312_SignalPlaceholderHotfix(){
    function freezeProtectedTokens(input) {
        const map = [];
        let idx = 0;

        function stash(match) {
            // Token chosen to be unlikely to be changed by MT
            const key = "⟦TXTRP:" + (idx++) + "⟧";
            map.push({ key, value: match });
            return key;
        }

        let out = input || "";

        // Freeze outer [signal]...[/signal] blocks first (includes nested {...})
        out = out.replace(/\[signal\][\s\S]*?\[\/signal\]/gi, stash);

        // Freeze any remaining {...} placeholders
        out = out.replace(/\{[^}]+\}/g, stash);

        return { text: out, map };
    }

    function restoreProtectedTokens(output, map) {
        let out = output || "";
        for (let i = 0; i < map.length; i++) {
            // Replace all occurrences (in case MT duplicated tokens)
            const k = map[i].key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            out = out.replace(new RegExp(k, "g"), map[i].value);
        }
        return out;
    }

    function apply(){
        if (!window.TXTR || !TXTR.Core) return false;
        const core = TXTR.Core;
        if (core.__txtrSignalPatchApplied) return true;
        if (typeof core.translateText !== "function") return false;

        const originalTranslateText = core.translateText.bind(core);

        core.translateText = async function(text, lang){
            const frozen = freezeProtectedTokens(text);
            const translated = await originalTranslateText(frozen.text, lang);
            return restoreProtectedTokens(translated, frozen.map);
        };

        core.__txtrSignalPatchApplied = true;
        return true;
    }

    if (apply()) return;

    const iv = setInterval(() => {
        if (apply()) clearInterval(iv);
    }, 50);
})();

