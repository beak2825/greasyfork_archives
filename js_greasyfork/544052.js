// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/// ==UserScript==
// @name          ChatGPT Cheatcode Menu v4.4 (Cleaned Duplicates)
// @namespace     http://tampermonkey.net/
// @version       0.4.4
// @description   Adds working cheatcode buttons with Hebrew labels to ChatGPT input, inserts text at cursor position in contenteditable div or textarea, with minimize toggle and drag support, and improved layout including Favorites. Duplicates removed.
// @author        ChatGPT Assistant
// @match         https://chat.openai.com/*
// @match         https://chatgpt.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/544052/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/544052/New%20Userscript.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Cheatcode script started at " + new Date().toLocaleString());

    // --- מערך הצ'יטקודים המנוקה ---
    const cheatcodes = [
        { label: "הסבר לילד בן 5", code: "ELI5: " },
        { label: "תקציר תכל'ס", code: "TL;DR: " },
        { label: "הפוך למקצועי", code: "Jargonize: " },
        { label: "סכם טקסט", code: "Summarize: " },
        { label: "שחק תפקיד כ-", code: "Act as: " },
        { label: "כרשימה", code: "Listify: " },
        { label: "שם בטבלה", code: "Table this: " },
        { label: "הרחב", code: "Expand on this: " },
        { label: "פשט שפה", code: "Simplify this language: " },
        { label: "השווה בין", code: "Compare: " },
        { label: "תרגם ל-...", code: "Translate into: " },
        { label: "הסבר כ-[תפקיד]", code: "Explain like I'm a: " },
        { label: "בנקודות", code: "In bullet points: " },
        { label: "ביקורת על", code: "Critique this: " },
        { label: "שפר זאת", code: "Improve this: " },
        { label: "הפוך למצחיק", code: "Make it funny: " },
        { label: "הפוך לשיר", code: "Make it poetic: " },
        { label: "הנדסה הפוכה", code: "Reverse engineer: " },
        { label: "שלב-אחר-שלב", code: "Step-by-step: " },
        { label: "תן דוגמאות", code: "Give examples: " },
        { label: "השתמש בדימויים", code: "Use metaphors: " },
        { label: "תאר ויזואלית", code: "Visualize: " },
        { label: "כתוב פרומפט עבור", code: "Write a prompt for: " },
        { label: "תקן באגים", code: "Debug this code: " },
        { label: "הסבר הבדיחה", code: "Explain the joke: " },
        { label: "הוסף אנלוגיות", code: "Add analogies: " },
        { label: "תגרום לזה להישמע חכם", code: "Make it sound smart: " },
        { label: "פרק נושא", code: "Break it down: " },
        { label: "שלוט באורך", code: "Make it shorter/longer: " }, // איחוד "קצר/ארוך יותר" ו"שליטה באורך הטקסט"
        { label: "אופטימיזציית SEO", code: "SEO-optimize: " },
        { label: "מצב סיפור", code: "Story mode: " },
        { label: "כרשימת בדיקה", code: "As a checklist: " },
        { label: "מרמת מתחיל למתקדם", code: "From beginner to advanced: " },
        { label: "תן טיעוני נגד", code: "Give counter-arguments: " },
        { label: "בסגנון של...", code: "In the style of: " },
        { label: "העמד פנים שאתה...", code: "Pretend you are: " },
        { label: "בלי קישוטים", code: "No fluff: " },
        { label: "עם אימוג'ים", code: "With emojis: " },
        { label: "הסבר ז'רגון", code: "Translate jargon: " },
        { label: "מאפס", code: "From scratch: " },
        { label: "הוסף מקורות", code: "Add citations: " },
        { label: "השתמש בנתונים אמיתיים", code: "Use real-world data: " },
        { label: "התמקד במקרי קצה", code: "Focus on edge cases: " },
        { label: "שמור על שיחה", code: "Keep it conversational: " },
        { label: "בסגנון TED Talk", code: "In the tone of a TED Talk: " },
        { label: "הפוך ל-FAQ", code: "Turn into FAQ: " },
        { label: "שכתב קוד", code: "Refactor this code: " },
        { label: "השווה ביצועים", code: "Benchmark this: " },
        { label: "הוסף סימון ויזואלי", code: "Add visual markup: " },
        { label: "מספר שלבים", code: "Use step numbering: " },
        { label: "היה כנה בבוטות", code: "Be brutally honest: " },
        { label: "בלי ז'רגון טכני", code: "No technical jargon: " },
        { label: "השתמש בגרפים", code: "Use charts: " },
        { label: "תן צעדי פעולה", code: "Add action steps: " },
        { label: "בהתבסס על אילוצי X", code: "Based on X constraints: " },
        { label: "מתחת ל-100 מילים", code: "Under 100 words: " },
        { label: "כתרשים זרימה", code: "Answer as a flowchart: " },
        { label: "כלול טעויות נפוצות", code: "Include common mistakes: " },
        { label: "אנלוגיות מספורט", code: "Use analogies from sports: " },
        { label: "הנח ידע מוקדם של...", code: "Assume prior knowledge of: " },
        { label: "הישמע אקדמי", code: "Make it sound academic: " },
        { label: "אופטימיזציה לביצועים", code: "Optimize for performance: " },
        { label: "הדגש נקודות שנויות במחלוקת", code: "Highlight controversial points: " },
        { label: "צור רשימת בדיקה", code: "Add checklist: " },
        { label: "השתמש בציטוטים", code: "Use quotes: " },
        { label: "הפוך לאינטראקטיבי", code: "Make it interactive: " },
        { label: "ספק צעדים הבאים", code: "Provide next steps: " },
        { label: "כלול הקשר היסטורי", code: "Include historical context: " },
        { label: "אתגר הנחות", code: "Challenge assumptions: " },
        { label: "הומור במתינות", code: "Use humor sparingly: " },
        { label: "הפוך לתוכן שקף", code: "Turn into slide content: " },
        { label: "בסדר כרונולוגי", code: "Use chronological order: " },
        { label: "פורמט מפת חשיבה", code: "Use mind map format: " },
        { label: "היה פרובוקטיבי", code: "Be provocative: " },
        { label: "תרגם למייל עסקי", code: "Translate to professional email: " },
        { label: "פורמט מרקדאון", code: "Use markdown format: " },
        { label: "הוסף TLDR בסוף", code: "Add TLDR at the end: " },
        { label: "הסבר באמצעות Case Study", code: "Explain via case study: " },
        { label: "הפוך את זה לחידון", code: "Turn this into a quiz: " }
    ];

    // --- פונקציות עזר לטעינת/שמירת מועדפים ---
    const STORAGE_KEY = 'chatgpt_cheatcode_favorites';
    let favorites = loadFavorites();

    function loadFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Error loading favorites from localStorage:", e);
            return [];
        }
    }

    function saveFavorites() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error("Error saving favorites to localStorage:", e);
        }
    }

    function isFavorite(code) {
        return favorites.includes(code);
    }

    function toggleFavorite(code) {
        const index = favorites.indexOf(code);
        if (index > -1) {
            favorites.splice(index, 1); // הסר
        } else {
            favorites.push(code); // הוסף
        }
        saveFavorites();
        updateFavoriteButtonStates(); // ודא שכל הכוכבים מתעדכנים
    }

    // --- פונקציות לחיפוש/הכנסת טקסט ---
    function findChatGPTInput() {
        return (
            document.querySelector('#prompt-textarea') ||
            document.querySelector('[data-testid="conversation-textarea"]') ||
            document.querySelector('div[contenteditable="true"][role="textbox"]') ||
            document.querySelector('textarea:not([style*="display: none"])') ||
            document.querySelector('textarea')
        );
    }

    function insertTextAtCursorInContentEditable(text) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) {
            console.warn("No selection or range in contenteditable");
            return false;
        }
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        const inputField = findChatGPTInput();
        if (inputField) {
            const event = new Event('input', { bubbles: true });
            inputField.dispatchEvent(event);
            console.log("Input event dispatched on contenteditable");
        }

        return true;
    }

    function insertTextAtCursorInTextarea(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);

        const beforeInputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertFromPaste',
            data: text,
            dataTransfer: dataTransfer
        });
        textarea.dispatchEvent(beforeInputEvent);

        if (!beforeInputEvent.defaultPrevented) {
            const val = textarea.value;
            textarea.value = val.substring(0, start) + text + val.substring(end);
        }

        const newCursorPos = start + text.length;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        textarea.focus();

        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        console.log("Input event dispatched on textarea after paste simulation");
    }

    // --- פונקציות לבניית והצגת התפריט ---
    let currentFilter = 'all'; // 'all' או 'favorites'
    let allButtons = []; // ישמור רפרנסים לכל הכפתורים שנוצרו

    function updateFavoriteButtonStates() {
        allButtons.forEach(btn => {
            const star = btn.querySelector('.favorite-star');
            if (star) {
                if (isFavorite(btn.dataset.code)) {
                    star.style.color = 'gold'; // כוכב צבוע
                    star.textContent = '★'; // כוכב מלא
                } else {
                    star.style.color = '#ccc'; // כוכב ריק
                    star.textContent = '☆'; // כוכב ריק
                }
            }
        });
        filterButtons(); // ודא שהתצוגה מתעדכנת לפי הסינון הנוכחי
    }

    function filterButtons() {
        allButtons.forEach(btn => {
            if (currentFilter === 'all') {
                btn.style.display = ''; // הצג הכל
            } else if (currentFilter === 'favorites') {
                if (isFavorite(btn.dataset.code)) {
                    btn.style.display = ''; // הצג מועדפים
                } else {
                    btn.style.display = 'none'; // הסתר לא מועדפים
                }
            }
        });
    }

    function createMenu() {
        if (document.querySelector('#cheatcode-menu')) {
            console.log("Cheatcode menu already exists, skipping creation.");
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'cheatcode-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#f9f9f9',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: '2147483647',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)',
            fontSize: '14px',
            color: '#000',
            minWidth: '180px',
            userSelect: 'none',
            cursor: 'default',
            direction: 'rtl',
        });

        // Drag variables
        let isDragging = false;
        let dragStartX, dragStartY;
        let startLeft, startTop;

        menu.addEventListener('mousedown', (e) => {
            if (e.target === menu || e.target === title) {
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                const rect = menu.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                menu.style.transition = 'none';
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newLeft = startLeft + (e.clientX - dragStartX);
            let newTop = startTop + (e.clientY - dragStartY);

            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const rect = menu.getBoundingClientRect();
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + rect.width > vw) newLeft = vw - rect.width;
            if (newTop + rect.height > vh) newTop = vh - rect.height;

            menu.style.left = newLeft + 'px';
            menu.style.top = newTop + 'px';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                menu.style.transition = '';
            }
        });

        // כפתור מזער/הרחב
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'מזער';
        Object.assign(toggleBtn.style, {
            position: 'absolute',
            top: '5px',
            left: '5px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: '1px solid #888',
            background: '#fff',
            color: '#000',
            userSelect: 'none',
            pointerEvents: 'auto',
            position: 'relative',
        });

        let minimized = false;
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            minimized = !minimized;
            if (minimized) {
                menu.style.maxHeight = '30px';
                menu.style.overflow = 'hidden';
                toggleBtn.textContent = 'הרחב';
            } else {
                menu.style.maxHeight = '400px';
                menu.style.overflowY = 'auto';
                toggleBtn.textContent = 'מזער';
            }
        });
        menu.appendChild(toggleBtn);

        // --- כפתורי סינון (טאבים) ---
        const filterButtonsContainer = document.createElement('div');
        Object.assign(filterButtonsContainer.style, {
            marginBottom: '8px',
            textAlign: 'left',
            position: 'relative',
            zIndex: '10',
            paddingRight: '45px'
        });

        const createFilterButton = (text, filterType) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            Object.assign(btn.style, {
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                borderRadius: '5px',
                border: '1px solid #888',
                background: currentFilter === filterType ? '#ddd' : '#fff',
                color: '#000',
                userSelect: 'none',
                marginRight: '5px'
            });
            btn.addEventListener('click', () => {
                currentFilter = filterType;
                filterButtons();
                allFilterBtns.forEach(b => {
                    b.style.background = currentFilter === b.dataset.filterType ? '#ddd' : '#fff';
                });
            });
            btn.dataset.filterType = filterType;
            return btn;
        };

        const allBtn = createFilterButton('כל הצ\'יטקודים', 'all');
        const favoritesBtn = createFilterButton('מועדפים ⭐', 'favorites');
        const allFilterBtns = [allBtn, favoritesBtn];

        filterButtonsContainer.appendChild(favoritesBtn);
        filterButtonsContainer.appendChild(allBtn);
        menu.appendChild(filterButtonsContainer);


        // כותרת
        const title = document.createElement('div');
        title.textContent = "📌 צ'יטקודים:";
        Object.assign(title.style, {
            fontWeight: 'bold',
            marginBottom: '6px',
            userSelect: 'none',
            cursor: 'move',
            position: 'relative',
            zIndex: '10',
            direction: 'rtl',
            textAlign: 'right'
        });
        menu.appendChild(title);

        // קונטיינר לכפתורים עם תצוגת Grid
        const buttonsContainer = document.createElement('div');
        Object.assign(buttonsContainer.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '5px',
            marginTop: '5px',
        });
        menu.appendChild(buttonsContainer);

        // יצירת הכפתורים
        cheatcodes.forEach(({ label, code }) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.title = code;
            btn.dataset.code = code;
            Object.assign(btn.style, {
                margin: '3px 5px 3px 0',
                padding: '6px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                borderRadius: '6px',
                border: '1px solid #888',
                background: '#fff',
                userSelect: 'none',
                pointerEvents: 'auto',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '5px',
            });

            // אייקון כוכב
            const star = document.createElement('span');
            star.classList.add('favorite-star');
            Object.assign(star.style, {
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: '1',
                width: '16px',
                height: '16px',
                display: 'inline-block',
                pointerEvents: 'auto',
                flexShrink: '0',
            });
            star.textContent = '☆';

            star.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFavorite(code);
            });
            btn.prepend(star);

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Button "${label}" clicked.`);

                const inputField = findChatGPTInput();
                if (!inputField) {
                    alert("לא נמצא שדה קלט. נסה לרענן את הדף.");
                    console.warn("Input field not found.");
                    return;
                }

                if (inputField.tagName.toLowerCase() === 'textarea') {
                    insertTextAtCursorInTextarea(inputField, code);
                } else if (inputField.getAttribute('contenteditable') === 'true') {
                    inputField.focus();
                    const inserted = insertTextAtCursorInContentEditable(code);
                    if (!inserted) {
                        inputField.innerText = code + inputField.innerText;
                        const event = new Event('input', { bubbles: true });
                        inputField.dispatchEvent(event);
                    }
                } else {
                    alert("שדה הקלט לא מזוהה כצפוי.");
                    console.warn("Unknown input field type:", inputField);
                }
            });

            buttonsContainer.appendChild(btn);
            allButtons.push(btn);
        });

        document.body.appendChild(menu);
        console.log("Cheatcode menu created successfully.");

        updateFavoriteButtonStates();

        // הגדרת מצב מזעור התחלתי (אם רוצים)
        /*
        minimized = true;
        menu.style.maxHeight = '30px';
        menu.style.overflow = 'hidden';
        toggleBtn.textContent = 'הרחב';
        */
    }

    function waitForInputAndCreateMenu() {
        const selector = 'textarea, div[contenteditable="true"][role="textbox"], #prompt-textarea, [data-testid="conversation-textarea"]';
        let attempts = 0;
        const maxAttempts = 20;

        const interval = setInterval(() => {
            const input = document.querySelector(selector);
            attempts++;
            if (input) {
                clearInterval(interval);
                console.log("Input field found:", input);
                createMenu();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn("Input field not found after waiting.");
            }
        }, 500);
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        waitForInputAndCreateMenu();
    } else {
        window.addEventListener('DOMContentLoaded', waitForInputAndCreateMenu);
    }
})();
// @version      2025-07-27
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    
})();