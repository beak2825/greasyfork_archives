// ==UserScript==
// @name         פאנל מותאם אישית
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  בוחר דרגה, זמן, סוג הרחקה + מוסיף כפתורי פרופיל מותאמים אישית כולל "נתינת ווינר" 🎯🕒⚙️ + הוספת קישורים חיצוניים
// @author       RemixN1V + Assistant
// @license      MIT
// @match        https://www.fxp.co.il/modcp/banning.php*
// @match        https://www.fxp.co.il/member.php?u*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/533487/%D7%A4%D7%90%D7%A0%D7%9C%20%D7%9E%D7%95%D7%AA%D7%90%D7%9D%20%D7%90%D7%99%D7%A9%D7%99%D7%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/533487/%D7%A4%D7%90%D7%A0%D7%9C%20%D7%9E%D7%95%D7%AA%D7%90%D7%9D%20%D7%90%D7%99%D7%A9%D7%99%D7%AA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getUrlParam = (name) => {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    };

    // ---------- חלק 1: בחירת דרגה + תקופת השעיה אוטומטית ----------
    if (window.location.href.includes('modcp/banning.php')) {
        const groupId = getUrlParam('usergroupid');
        const periodCode = getUrlParam('periodcode');

        window.addEventListener('load', function () {
            if (groupId) {
                const select = document.querySelector('select[name="usergroupid"]');
                if (select) {
                    const optionExists = Array.from(select.options).some(opt => opt.value === groupId);
                    if (optionExists) {
                        select.value = groupId;
                    }
                }
            }

            if (periodCode) {
                const periodSelect = document.querySelector('select[name="period"]');
                if (periodSelect) {
                    const option = Array.from(periodSelect.options).find(opt => opt.value === periodCode);
                    if (option) {
                        periodSelect.value = periodCode;
                    }
                }
            }
        });
    }

    // ---------- חלק 2: כפתורים מותאמים אישית בפרופיל משתמש ----------
    if (window.location.href.includes('/member.php?u=')) {
        const userId = getUrlParam('u');
        if (!userId) return;

        const storageKey = "custom_buttons";

        async function loadButtons() {
            return await GM_getValue(storageKey, []);
        }

        async function saveButtons(buttons) {
            await GM_setValue(storageKey, buttons);
        }

        async function renderButtons() {
            const targetElement = document.querySelector('.user_panel_m.gu > b');
            if (!targetElement) return;

            const buttons = await loadButtons();

            buttons.sort((a, b) => {
                const orderA = a.order ?? Infinity;
                const orderB = b.order ?? Infinity;
                return orderA - orderB;
            });

            buttons.forEach((btn, i) => {
                const a = document.createElement('a');
                // החלפת {userId} במזהה המשתמש
                a.href = btn.url.replace('{userId}', userId);
                a.textContent = btn.text;
                a.title = `${btn.text}`;
                a.style.color = btn.color;
                //a.style.marginInlineStart = '10px';
                a.target = btn.external ? '_blank' : '_self'; // אם זה קישור חיצוני - פתיחה בלשונית חדשה
                targetElement.appendChild(a);
                targetElement.insertAdjacentHTML('beforeend', ` &nbsp;&nbsp; `);
            });

            if (!targetElement.querySelector('button[title="ניהול כפתורים"]')) {
                const settingsBtn = document.createElement('button');
                settingsBtn.textContent = '⚙️';
                settingsBtn.title = 'ניהול כפתורים';
                //settingsBtn.style.marginInlineStart = '10px';
                settingsBtn.style.cursor = 'pointer';
                settingsBtn.onclick = () => showPopup(buttons);
                targetElement.appendChild(settingsBtn);
            }
        }

        let editIndex = -1; // שמור את editIndex מחוץ לפונקציה showPopup

        function showPopup(buttons) {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.background = 'rgba(0,0,0,0.5)';
            overlay.style.zIndex = '9999';

            // סגירה עם מקש ESC
            const escHandler = (e) => {
                if (e.key === "Escape") {
                    overlay.remove();
                    document.removeEventListener("keydown", escHandler);
                    editIndex = -1; // איפוס editIndex כשיוצאים מהפופאפ
                }
            };
            document.addEventListener("keydown", escHandler);

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.background = 'white';
            popup.style.padding = '20px';
            popup.style.borderRadius = '10px';
            popup.style.width = '320px';
            popup.style.maxHeight = '80vh';
            popup.style.overflowY = 'auto';
            popup.innerHTML = `<h3>ניהול כפתורים</h3>`;

            const form = document.createElement('form');
            form.innerHTML = `
                <input type="text" placeholder="טקסט על הכפתור" name="text" required style="width:100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">

                <label style="display:block; margin-bottom: 5px; font-weight:bold;">בחר סוג כפתור:</label>
                <select name="type" required style="width:100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">
                    <option value="ban">הרחקה (ברירת מחדל)</option>
                    <option value="external">קישור חיצוני</option>
                </select>

                <div id="banOptions" style="margin-bottom: 10px;">
                    <select name="days" style="width:100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">
                        ${Array.from({ length: 21 }, (_, i) => {
                            const day = i + 1;
                            return `<option value="D_${day}">${day} ימים</option>`;
                        }).join('')}
                        <option value="M_1">חודש</option>
                        <option value="PERMANENT">צמיתות</option>
                    </select>

                    <select name="group" style="width:100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">
                        <option value="8">Banned (8)</option>
                        <option value="40">Winner (40)</option>
                        <option value="73">ווינר למנהלים (73)</option>
                    </select>
                </div>

                <div id="externalOptions" style="display:none; margin-bottom: 10px;">
                    <input type="url" name="externalUrl" placeholder="הכנס קישור חיצוני מלא (https://...)" style="width:100%; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">
                </div>

                <input type="color" name="color" value="#2bb1e2" style="width:100%; margin-bottom: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; height: 35px;">
                <input type="number" placeholder="סדר (מספר)" name="order" style="width:100%; margin-bottom: 15px; padding: 8px; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box;">
                <button type="submit" id="formSubmitBtn" style="width:100%; margin-bottom: 15px; padding: 10px; background-color:#2bb1e2; color:white; border:none; border-radius:8px; font-size: 1.1em; cursor:pointer;">➕ הוסף כפתור</button>
            `;

            // מתג לשינוי בין סוגי הכפתורים
            const typeSelect = form.querySelector('select[name="type"]');
            const banOptions = form.querySelector('#banOptions');
            const externalOptions = form.querySelector('#externalOptions');
            const formSubmitBtn = form.querySelector('#formSubmitBtn'); // קבל הפניה לכפתור השליחה

            typeSelect.onchange = () => {
                if (typeSelect.value === 'external') {
                    banOptions.style.display = 'none';
                    externalOptions.style.display = 'block';
                    // הפוך required בשדות לפי סוג
                    form.days.required = false;
                    form.group.required = false;
                    form.externalUrl.required = true;
                } else {
                    banOptions.style.display = 'block';
                    externalOptions.style.display = 'none';
                    form.days.required = true;
                    form.group.required = true;
                    form.externalUrl.required = false;
                }
            };

            form.onsubmit = async (e) => {
                e.preventDefault();

                let newBtn;
                if (typeSelect.value === 'external') {
                    // כפתור קישור חיצוני
                    newBtn = {
                        text: form.text.value,
                        url: form.externalUrl.value,
                        color: form.color.value,
                        order: form.order.value ? parseInt(form.order.value) : null,
                        external: true
                    };
                } else {
                    // כפתור הרחקה רגיל
                    const periodcode = form.days.value;
                    const groupId = form.group.value;

                    newBtn = {
                        text: form.text.value,
                        url: `/modcp/banning.php?do=banuser&u={userId}&usergroupid=${groupId}&periodcode=${periodcode}`,
                        color: form.color.value,
                        order: form.order.value ? parseInt(form.order.value) : null,
                        external: false
                    };
                }

                if (editIndex !== -1) {
                    buttons[editIndex] = newBtn;
                    formSubmitBtn.textContent = '➕ הוסף כפתור'; // נטפל בזה בפתיחה מחדש
                } else {
                    buttons.push(newBtn);
                }

                await saveButtons(buttons);
                editIndex = -1; // אופס את editIndex רק אחרי שהסגירה והפתיחה מחדש הושלמו
            };

            // טעינת ערכים לעריכה, רק אם editIndex מוגדר
            if (editIndex !== -1) {
                const btnToEdit = buttons[editIndex];
                form.text.value = btnToEdit.text;
                form.color.value = btnToEdit.color;
                form.order.value = btnToEdit.order ?? '';
                formSubmitBtn.textContent = '✏️ עדכן כפתור'; // שנה את טקסט הכפתור

                if (btnToEdit.external) {
                    typeSelect.value = 'external';
                    banOptions.style.display = 'none';
                    externalOptions.style.display = 'block';
                    form.externalUrl.value = btnToEdit.url;
                    form.days.required = false;
                    form.group.required = false;
                    form.externalUrl.required = true;
                } else {
                    typeSelect.value = 'ban';
                    banOptions.style.display = 'block';
                    externalOptions.style.display = 'none';
                    try {
                        const params = new URLSearchParams(btnToEdit.url.split('?')[1]);
                        form.group.value = params.get('usergroupid') || '8';
                        form.days.value = params.get('periodcode') || 'D_1';
                    } catch {
                        form.group.value = '8';
                        form.days.value = 'D_1';
                    }
                    form.days.required = true;
                    form.group.required = true;
                    form.externalUrl.required = false;
                }
                typeSelect.onchange(); // הפעל את הפונקציה כדי לעדכן את תצוגת האפשרויות
            } else { // אם לא במצב עריכה, ודא שכפתור השליחה מראה "הוסף כפתור"
                formSubmitBtn.textContent = '➕ הוסף כפתור';
                typeSelect.value = 'ban'; // ברירת מחדל למצב הוספה חדשה
                typeSelect.onchange(); // ודא שהתצוגה מעודכנת
            }

            popup.appendChild(form);

            const list = document.createElement('ul');
            // נקה את רשימת הכפתורים לפני יצירתה מחדש
            list.innerHTML = '';

            buttons.forEach((btn, index) => {
                const li = document.createElement('li');
                li.style = 'margin-bottom: 15px; display: flex; flex-direction: row; align-content: center; justify-content: center; align-items: center;';
                li.innerHTML = `<span style="flex-grow:1; color: ${btn.color}; cursor: pointer;">${btn.text}</span>`;

                const delBtn = document.createElement('button');
                delBtn.textContent = '❌';
                delBtn.style = 'float: right; padding: 2px; color: white; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer';
                delBtn.onclick = async () => {
                    buttons.splice(index, 1);
                    await saveButtons(buttons);
                    overlay.remove();
                    showPopup(await loadButtons()); // טען מחדש ופתח פופאפ
                    editIndex = -1; // איפוס editIndex לאחר מחיקה
                };

                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️';
                editBtn.style = 'float: right; padding: 2px; color: white; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer';
                editBtn.onclick = () => {
                    editIndex = index; // קבע את editIndex
                    overlay.remove(); // סגור את הפופאפ הנוכחי
                    showPopup(buttons); // פתח את הפופאפ מחדש במצב עריכה
                };


                li.appendChild(editBtn);
                li.appendChild(delBtn);
                list.appendChild(li);
            });
            popup.appendChild(list);

            overlay.appendChild(popup);
            document.body.appendChild(overlay);
        }

        // ודא ש renderButtons נקרא רק פעם אחת בטעינה הראשונית
        window.addEventListener('load', renderButtons);
    }

})();