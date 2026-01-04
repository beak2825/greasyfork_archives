// ==UserScript==
// @name            WME — RPP
// @version         2.1
// @description     WME - Add a new place of residence (G). Opens edit (pencil) on LMB+G and auto-fills Street/City + Building number/letter with optional increment.
// @match           /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @copyright       2025, Michalito_78
// @author          Michalito_78
// @run-at          document-end
// @grant           none
// @license         MIT
// @icon            https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @namespace       https://greasyfork.org/pl/users/1504072
// @downloadURL https://update.greasyfork.org/scripts/546150/WME%20%E2%80%94%20RPP.user.js
// @updateURL https://update.greasyfork.org/scripts/546150/WME%20%E2%80%94%20RPP.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global WazeWrap */

/*
 Changelog:
  1.0  New script
  1.1  Moving the script to the tab
  1.2  Added building number, letter, increment
  1.3  Added radiobuttons (number/letter)
  1.4  Added checkbox ON/OFF number
  1.5  Added checkbox ON/OFF script
  1.6  Fix HTML
  1.7  Cleaner structure + accurate LOG
  1.8  Fix checkbox ON / OFF script
  1.9  Added line drawing
  2.0  Line drawing fix to checkbox On/OFF
  2.1  Fix copy number to "numer budynku" textbox
*/

(function () {
    'use strict';

    // ──────────────────────────────────────────────────────────────────────────────
    // KONFIGURACJA / CONFIG
    // ──────────────────────────────────────────────────────────────────────────────

    /** Identyfikatory niestandardowych elementów sterujących panelem*/
    const IDS = {
        street: 'wme-rpp-street', // __________________________________________ Input: Nazwa ulicy / Street
        building: 'wme-rpp-building', // ______________________________________ Input: Numer budynku / Building number
        letter: 'wme-rpp-letter', // __________________________________________ Input: Litera / Letter
        increment: 'wme-rpp-increment', // ____________________________________ Input: Przyrost / Increment
        copyToggle: 'wme-rpp-copy-toggle', // _________________________________ Checkbox: ON/OFF numeracja / numbering
        scriptToggle: 'wme-rpp-script-toggle', // _____________________________ Checkbox: ON/OFF script
        radioBuilding: 'wme-rpp-radio-building', // ___________________________ RadioButton numer budynku
        radioLetter: 'wme-rpp-radio-letter', //  ______________________________ RadioButton litera
        tabRoot: 'wme-rpp-tab', // ____________________________________________ Zakładka w dziale skrypty
        userName: 'wme-rpp-user-name', // _____________________________________ Nazwa użytkownika
        userPoints: 'wme-rpp-user-edits', // __________________________________ ilość punktów
    };

    /** Indentyfikatory localstore */
    const LS = {
        street: 'wmeRppStreet', // ____________________________________________ Localstore Nazwa ulicy / Street
        building: 'wmeRppBuildingNumber', // __________________________________ Localstore Numer budynku / Building number
        letter: 'wmeRppBuildingLetter', // ____________________________________ Localstore Litera / Letter
        increment: 'wmeRppIncrement', // ______________________________________ Localstore Przyrost / Increment
    };

    /** Stan skryptu  */
    let state = {
        isGPressed: false, // _________________________________________________ Czy wciśnięty przycisk G
        pencilOpen: false, // _________________________________________________ Czy weszliśmy do edycji (klikniety ołówek)
    };


    /** Polski Alfabet */
    const POLISH_ALPHABET = [
        'A','B','C','D','E','F','G','H','I','J','K','L','Ł',
        'M','N','O','P','R','S','T','U','W','X','Y','Z','AA','AB','AC'
    ];

    /** Elementy zastępcze autouzupełniania WME. */
    const WME_PLACEHOLDERS = {
        street: 'Wpisz ulicę', // _____________________________________________ Pole tekstowe ulica
        city:   'Wpisz miasto', // ____________________________________________ Pole tekstowe miasto
        building: 'Dodaj numer domu', // ______________________________________ Pole tekstowe numer domu
    };

    /** Skrót klawiszowy używany razem z lewym przyciskiem myszy (LPM) do uruchomienia skryptu */
    const HOTKEY = 'g';

    // ──────────────────────────────────────────────────────────────────────────────
    // LOGGER
    // ──────────────────────────────────────────────────────────────────────────────

    const LOG_PREFIX = '[WME - RPP]';

    const log = {
        info:  (...a) => console.info(`${LOG_PREFIX} [INFO]`, ...a),
        warn:  (...a) => console.warn(`${LOG_PREFIX} [WARN]`, ...a),
        error: (...a) => console.error(`${LOG_PREFIX} [ERROR]`, ...a),
        ok:    (...a) => console.log(`${LOG_PREFIX} ✅`, ...a),
    };

    // ──────────────────────────────────────────────────────────────────────────────
    // UTILS
    // ──────────────────────────────────────────────────────────────────────────────

    /** Pomocnik funkcji do opóźnienia wykonania. */
    function debounce(fn, wait = 300) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    }

    /** Odczyt pierwszej liczby całkowitej znalezionej w ciągu. */
    function readInt(value, def = 0) {
        const m = String(value ?? '').trim().match(/-?\d+/);
        return m ? parseInt(m[0], 10) : def;
    }

    /** Przeskok po kolejnych literach alfabetu. */
    function incrementLetter(letterRaw, inc) {
        const n = POLISH_ALPHABET.length;
        let cur = String(letterRaw || '').trim().toUpperCase();
        if (!cur) cur = 'A';
        let index = POLISH_ALPHABET.indexOf(cur);
        if (index === -1) index = POLISH_ALPHABET.indexOf('A');
        const newIndex = (index + (inc % n) + n) % n;
        return POLISH_ALPHABET[newIndex];
    }

    /** Wyszukanie pasujących elementów do rozwijanych list. */
    function deepQueryAll(selector, root = document) {
        const out = [];
        try { out.push(...root.querySelectorAll(selector)); } catch (e) { /* ignore */ }
        const all = root.querySelectorAll('*');
        for (const el of all) {
            if (el.shadowRoot) {
                try { out.push(...el.shadowRoot.querySelectorAll(selector)); } catch (e) { /* ignore */ }
                out.push(...deepQueryAll(selector, el.shadowRoot));
            }
        }
        return Array.from(new Set(out));
    }

    /** Wybierz pierwszy element z listy. */
    function pickVisible(arr) {
        return arr.find(el => el && el.offsetParent !== null) || arr[0] || null;
    }

    /** Znajdywanie podobieństw w liście rozwijanej. */
    function setReactValue(input, value) {
        if (!input) return false;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (!setter) {
            input.value = value;
        } else {
            setter.call(input, value);
        }
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        return true;
    }

    /** Algorytm dopasowania. */
    function levenshtein(a, b) {
        const m = [];
        for (let i = 0; i <= b.length; i++) m[i] = [i];
        for (let j = 0; j <= a.length; j++) m[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                m[i][j] = b.charAt(i-1) === a.charAt(j-1)
                    ? m[i-1][j-1]
                : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
            }
        }
        return m[b.length][a.length];
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // WME FIELD ACCESSORS
    // ──────────────────────────────────────────────────────────────────────────────

    /** Wyszukiwanie danych wejściowych z WME (pole miasto, ulica). */
    function findWmeInput(which) {
        if (which === 'building') {
            // szukamy po placeholderze LUB po aria-label zawierającym "Numer"
            const candidates = deepQueryAll('input[placeholder*="numer" i], input[aria-label*="numer" i]');
            return pickVisible(candidates);
        }
        if (which === 'street') {
            const candidates = deepQueryAll('input[placeholder*="ulic" i]');
            return pickVisible(candidates);
        }
        if (which === 'city') {
            const candidates = deepQueryAll('input[placeholder*="miast" i]');
            return pickVisible(candidates);
        }
        return null;
    }


    /** Próba autouzupełnienia pól miasto i ulica. Przy niezgodności stopujemy autouzupełnianie i zostawiamy otwartą rozwijaną listę. */
    function pickAutocompleteOption(typedLower, maxTries = 3) {
        return new Promise(resolve => {
            let tries = 0;
            const timer = setInterval(() => {

                const options = deepQueryAll('[role="option"]');
                if (options.length) {
                    let best = options.find(opt => (opt.textContent || '').trim().toLowerCase().startsWith(typedLower));
                    if (!best) {
                        let bestScore = Infinity;
                        for (const opt of options) {
                            const label = (opt.textContent || '').trim().toLowerCase();
                            const diff = levenshtein(label, typedLower);
                            if (diff < bestScore) {
                                bestScore = diff;
                                best = opt;
                            }
                        }
                    }
                    if (best) {
                        best.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        best.click();
                        clearInterval(timer);
                        resolve(true);
                        return;
                    }
                }
                if (++tries >= maxTries) {
                    clearInterval(timer);
                    resolve(false);
                }
            }, 220);
        });
    }

    /** Wpisywanie autouzupełnienia. */
    async function writeToAutocompleteField(which, value) {
        const input = findWmeInput(which);
        if (!input) {
            log.warn(`Nie znaleziono pola ${which === 'street' ? 'Ulica/Street' : 'Miasto/City'}.`);
            return false;
        }
        setReactValue(input, value);

        // Otwórz menu rozwijane
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown', bubbles: true }));

        const ok = await pickAutocompleteOption(String(value).toLowerCase());
        if (!ok) {
            // Czasami wWME wymaga kliknięcia
            setTimeout(() => {
                input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                input.focus();
            }, 80);
            log.warn(`Nie udało się zatwierdzić wartości w polu ${which}.`);
        } else {
            log.ok(`${which === 'street' ? 'Ulica/Street' : 'Miasto/City'} wybrana.`);
        }
        return ok;
    }

    /** Kopiowanie numeru budynku. */
   async function writeToBuildingNumber(value) {
    let tries = 0;
    while (tries < 10) {   // spróbuj max 10 razy (ok. 2s)
        const input = findWmeInput('building');
        if (input) {
            setReactValue(input, String(value ?? ''));
            log.ok(`Wpisano numer budynku: ${value}`);
            return true;
        }
        tries++;
        await new Promise(r => setTimeout(r, 200));
    }
    log.warn('Nie udało się znaleźć pola Numer budynku w WME.');
    return false;
}


    // ──────────────────────────────────────────────────────────────────────────────
    // CORE LOGIC
    // ──────────────────────────────────────────────────────────────────────────────

    /** Pobierz cyfrę z przyrostu + odczyt z locarstore.  */
    function getIncrementSafe() {
        const raw = document.getElementById(IDS.increment)?.value ?? localStorage.getItem(LS.increment) ?? '0';
        return readInt(raw, 0);
    }

    /** Zastosuj przyrost do cyfry + zapis do locarstore. */
    function applyNumberIncrement(baseNum, inc) {
        if (Number.isNaN(baseNum)) {
            log.warn('Numer budynku nie jest liczbą – pomijam przyrost.');
            return;
        }
        const next = baseNum + inc;
        const el = /** @type {HTMLInputElement} */ (document.getElementById(IDS.building));
        if (el) el.value = String(next);
        localStorage.setItem(LS.building, String(next));
    }

    /** Zastosuj przyrost do litery+ zapis do locarstore. */
    function applyLetterIncrement(curLetter, inc) {
        const next = incrementLetter(curLetter, inc);
        const el = /** @type {HTMLInputElement} */ (document.getElementById(IDS.letter));
        if (el) el.value = next;
        localStorage.setItem(LS.letter, next);
    }

    /** Główna akcja wywoływana po otwarciu edycji (ołówek).
    - Wypełnia pola zgodnie z ustawieniami panelu.
    - Kopiuje wartość panelu „Ulica” do WME Ulica i Miasto (jak w oryginalnym działaniu)
    - Kopiuje numer budynku (cyfra / cyfra + litera) do WME „Dodaj numer domu”
    - Stosuje inkrementację do cyfry lub litery, jeśli jest włączona. */
    async function performFill() {
        const onOff = /** @type {HTMLInputElement} */ (document.getElementById(IDS.scriptToggle));
        const copyToggle = /** @type {HTMLInputElement} */ (document.getElementById(IDS.copyToggle));
        const streetSrc = /** @type {HTMLInputElement} */ (document.getElementById(IDS.street));
        const buildingSrc = /** @type {HTMLInputElement} */ (document.getElementById(IDS.building));
        const letterSrc = /** @type {HTMLInputElement} */ (document.getElementById(IDS.letter));
        const radioBuilding = /** @type {HTMLInputElement} */ (document.getElementById(IDS.radioBuilding));
        const radioLetter = /** @type {HTMLInputElement} */ (document.getElementById(IDS.radioLetter));

        if (!onOff?.checked) {
            log.info('Skrypt jest wyłączony (ON/OFF).');
            return;
        }

        const streetVal = String(streetSrc?.value || '').trim();
        if (!streetVal) {
            alert('Pole "Nazwa ulicy / Street" w panelu jest puste.');
            return;
        }

        const inc = getIncrementSafe();
        const rawBuilding = String(buildingSrc?.value ?? '');
        const baseNum = readInt(rawBuilding, NaN);
        const curLetter = String(letterSrc?.value || '').toUpperCase();

        if (copyToggle?.checked) {
            if (radioBuilding?.checked) {
                if (!Number.isNaN(baseNum)) {
                    writeToBuildingNumber(String(baseNum));
                } else {
                    log.warn('Numer budynku nie jest liczbą – nie wpisuję do adresu.');
                }
            } else if (radioLetter?.checked) {
                const numberPart = rawBuilding || '';
                const letterPart = curLetter || '';
                writeToBuildingNumber(`${numberPart}${letterPart}`);
            } else {
                // Default: number + letter if present
                const numberPart = rawBuilding || '';
                const letterPart = curLetter || '';
                writeToBuildingNumber(`${numberPart}${letterPart}`);
            }
        }

        if (copyToggle?.checked) {
            if (radioBuilding?.checked && !Number.isNaN(baseNum)) {
                applyNumberIncrement(baseNum, inc);
            }
            if (radioLetter?.checked) {
                applyLetterIncrement(curLetter, inc);
            }
        }

        await writeToAutocompleteField('street', streetVal);
        await writeToAutocompleteField('city', streetVal);

        log.ok('Wypełnianie zakończone.');
    }

    /** Zatwierdzenie całości. */
    function openEditAndFill() {
        setTimeout(() => {
            const button = pickVisible(deepQueryAll("i.w-icon.w-icon-pencil-fill.edit-button[aria-disabled='false']"));
            if (!button) {
                log.warn('Nie znaleziono przycisku edycji (ołówek).');
                return;
            }
            state.pencilOpen = true;
            button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            button.click();

            setTimeout(() => {
                const saveBtn = pickVisible(deepQueryAll('.save-button'));
                if (saveBtn) {
                    saveBtn.addEventListener('click', (ev) => {
                        // We do not block default save; just a hook to observe and reset state
                        log.info('Kliknięto "Zatwierdź" / Save.');
                        state.pencilOpen = false;
                    }, { once: true });
                }
            }, 500);

            setTimeout(performFill, 500);
        }, 150);
    }

    // ──────────────────────────────────────────────────────────────────────────────
    // HOTKEY + LPM HANDLERS
    // ──────────────────────────────────────────────────────────────────────────────

    document.addEventListener('keydown', (e) => {
        if ((e.key === HOTKEY || e.key === HOTKEY.toUpperCase()) &&
            !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            state.isGPressed = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if ((e.key === HOTKEY || e.key === HOTKEY.toUpperCase())) {
            // state.isGPressed = false;
        }
    });

    document.addEventListener('click', (e) => {
        if (state.isGPressed && e.button === 0) {
            openEditAndFill();
            state.isGPressed = false;
            e.stopPropagation();
        }
    });

    log.info('Aktywne: LPM + G → otwórz edycję i wstaw Ulica+Miasto+Numer.');

    // ──────────────────────────────────────────────────────────────────────────────
    // CONTROL PANEL (TAB)
    // ──────────────────────────────────────────────────────────────────────────────

    /** Pobieranie nazwy użytkownika. */
    function readUserInfoSafe() {
        try {
            const box = document.querySelector('#toolbar > div > div > wz-user-box');
            const name = box?.shadowRoot
            ?.querySelector('div > wz-menu > div.user-details-wrapper > div:nth-child(2) > div > wz-h5')
            ?.textContent?.trim() || '';
            const edits = document.querySelector('#toolbar > div > div > wz-user-box > span > wz-user-box-score:nth-child(2)')?.value || '';
            return { name, edits: String(edits) };
        } catch (e) {
            return { name: '', edits: '' };
        }
    }

    /** Inicjacja panelu. */
    function initializeControlPanel() {
        const tabs = document.querySelector('#user-info .nav-tabs');
        const content = document.querySelector('#user-info .tab-content');
        if (!tabs || !content) return;

        // unikaj duplikatów
        if (document.getElementById(IDS.tabRoot)) return;

        // Nazwa nowej zakładki
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${IDS.tabRoot}`;
        a.setAttribute('data-toggle', 'tab');
        a.textContent = '\u2200 RPP';
        li.appendChild(a);
        tabs.appendChild(li);

        // HTML panela
        const section = document.createElement('section');
        section.id = IDS.tabRoot;
        section.className = 'tab-pane';
        section.style.padding = '6px 8px';

        const { name: USER, edits: NUMBER_EDITS } = readUserInfoSafe();

        section.innerHTML = `
      <label id="user-label" style="display:block;margin-bottom:5px;font-weight:bold;font-size:12px;">
        Ilość edycji użytkownika: <span id="${IDS.userName}"></span>
      </label>
      <div id="${IDS.userPoints}"
           style="width:95%;padding:6px;font-size:10px;border:1px solid #ccc;border-radius:6px;margin-bottom:1px;background-color:#f9f9f9;">
      </div>

      <hr style="width:100%;text-align:left;margin: 10px 0;">

      <div style="display:flex;align-items:center;gap:8px; margin: 10px 70px 20px;font-size:10px;">
        <input id="${IDS.scriptToggle}" type="checkbox" checked />
        <label for="${IDS.scriptToggle}" style="margin:0;">ON / OFF skrypt / script</label>
      </div>

      <label for="${IDS.street}" style="display:block;margin-bottom:5px;font-weight:bold;font-size:12px;">
        Nazwa ulicy / Wsi <br> Street / Name of the village
      </label>
      <input id="${IDS.street}" type="text" placeholder="Twoja notatka... / Your note..."
             style="width:95%;padding:6px;font-size:18px;border:1px solid #ccc;border-radius:6px;margin-bottom:12px;margin-bottom:1px" />

      <hr style="width:100%;text-align:left;margin: 10px 0;">

      <div style="display:flex;align-items:center;gap:8px;margin: 10px 40px 20px;font-size:10px;">
        <input id="${IDS.copyToggle}" type="checkbox" checked />
        <label for="${IDS.copyToggle}" style="margin:0;font-size:12px;">ON / OFF numeracja / numbering</label>
      </div>

      <div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:12px;">
        <div style="margin-top:5px;">
          <input type="radio" name="wme-rpp-mode" id="${IDS.radioBuilding}" />
          <label style="font-size:14px;" for="${IDS.radioBuilding}">Nr. budynku / Building number</label>
        </div>
        <div>
          <input id="${IDS.building}" type="number" placeholder="np. 10"
                 style="width:55px;padding:6px;font-size:12px;border:1px solid #ccc;border-radius:6px;" />
        </div>
      </div>

      <div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:12px;color:gray;">
        <div style="margin-top:5px;">
          <input type="radio" name="wme-rpp-mode" id="${IDS.radioLetter}" />
          <label style="font-size:14px;" for="${IDS.radioLetter}">Litera / Letter</label>
        </div>
        <div>
          <input id="${IDS.letter}" type="text" placeholder="np. A" maxlength="2"
                 style="margin-left:115px;width:55px;padding:6px;font-size:12px;border:1px solid #ccc;border-radius:6px;text-transform:uppercase;" />
        </div>
      </div>

      <hr style="width:100%;text-align:left;margin: 10px 0;">

      <label for="${IDS.increment}" style="display:block;font-weight:bold;margin: 10px 0;font-size:14px;">
        Przyrost / Increase
      </label>
      <input id="${IDS.increment}" type="number" value="0"
             style="width:55px;padding:6px;font-size:13px;border:1px solid #ccc;border-radius:6px;" />
    `;

        // Przypisanie użytkownika i jego edycji
        content.appendChild(section);
        section.querySelector(`#${IDS.userName}`).textContent = USER || '(?)';
        section.querySelector(`#${IDS.userPoints}`).textContent = NUMBER_EDITS || '';

        /** Ustawienia początkowe po starcie */
        const radioBuilding = /** @type {HTMLInputElement} */ (section.querySelector(`#${IDS.radioBuilding}`));
        const radioLetter = /** @type {HTMLInputElement} */ (section.querySelector(`#${IDS.radioLetter}`));
        const inputLetter = /** @type {HTMLInputElement} */ (section.querySelector(`#${IDS.letter}`));
        radioBuilding.checked = true;
        inputLetter.disabled = true;

        // Przywracanie zapisanych wartości z localstore
        const stStreet = localStorage.getItem(LS.street) ?? '';
        const stBuilding = localStorage.getItem(LS.building) ?? '';
        const stIncrement = localStorage.getItem(LS.increment) ?? '0';
        const stLetter = (localStorage.getItem(LS.letter) ?? '').toUpperCase();

        /** @type {HTMLInputElement} */
        (section.querySelector(`#${IDS.street}`)).value = stStreet;
        /** @type {HTMLInputElement} */
        (section.querySelector(`#${IDS.building}`)).value = stBuilding;
        /** @type {HTMLInputElement} */
        (section.querySelector(`#${IDS.increment}`)).value = stIncrement;
        /** @type {HTMLInputElement} */
        (section.querySelector(`#${IDS.letter}`)).value = stLetter;

        // ponowne zapisanie do localstore
        const saveStreet = debounce((v) => localStorage.setItem(LS.street, v));
        const saveBuilding = debounce((v) => localStorage.setItem(LS.building, v));
        const saveIncrement = debounce((v) => localStorage.setItem(LS.increment, v));
        const saveLetter = debounce((v) => localStorage.setItem(LS.letter, v.toUpperCase()));

        section.querySelector(`#${IDS.street}`).addEventListener('input', (e) => {
            saveStreet(/** @type {HTMLInputElement} */(e.target).value);
        });
        section.querySelector(`#${IDS.building}`).addEventListener('input', (e) => {
            saveBuilding(/** @type {HTMLInputElement} */(e.target).value);
        });
        section.querySelector(`#${IDS.increment}`).addEventListener('input', (e) => {
            saveIncrement(/** @type {HTMLInputElement} */(e.target).value);
        });
        section.querySelector(`#${IDS.letter}`).addEventListener('input', (e) => {
            const inp = /** @type {HTMLInputElement} */(e.target);
            let v = String(inp.value || '').toUpperCase();

            // Zezwolenie na polskie znaki i dwuliterowa litery
            v = v.replace(/[^A-ZŁ]/gi, '').toUpperCase().slice(0, 2);

            // Wpisanie z ręki innej litery niż w alfabecie jest przyjmowane
            inp.value = v;
            saveLetter(v);

            // Przełaczanie miedzy NR a litera kiedy pojawi się litera
            if (v) {
                radioLetter.checked = true;
                inputLetter.disabled = false;
            } else {
                radioBuilding.checked = true;
                inputLetter.disabled = true;
            }
        });

        // checkbox ON / OFF numeracja / numbering
        section.querySelector(`#${IDS.copyToggle}`).addEventListener('change', function () {
            const isChecked = /** @type {HTMLInputElement} */(this).checked;
            const buildingInput = /** @type {HTMLInputElement} */ (document.getElementById(IDS.building));
            const letterInput = /** @type {HTMLInputElement} */ (document.getElementById(IDS.letter));
            const buildingLbl = section.querySelector(`label[for="${IDS.radioBuilding}"]`);
            const letterLbl = section.querySelector(`label[for="${IDS.radioLetter}"]`);

            radioBuilding.disabled = !isChecked;
            radioLetter.disabled = !isChecked;
            buildingInput.disabled = !isChecked;
            radioBuilding.checked = true;
            radioLetter.checked = false;
            // wyłączenie wprowadzania liter gdy OFF
            letterInput.disabled = true;

            if(!isChecked) letterInput.value = "A";
            if (buildingLbl) buildingLbl.style.color = isChecked ? 'black' : 'gray';
            if (letterLbl) letterLbl.style.color = 'gray';
        });

        // checkbox ON / OFF całego skryptu
        section.querySelector(`#${IDS.scriptToggle}`).addEventListener('change', function () {
            const isChecked = /** @type {HTMLInputElement} */(this).checked;
            drawingEnabled = isChecked; // _____________________________________________________________________________🔴 tutaj sterujemy rysowaniem i spawrdzamy checkboxa ON/OFF

            if (!drawingEnabled) {
                layerBlue?.removeAllFeatures();
                layerBlack?.removeAllFeatures();
            }

            const copyToggle = /** @type {HTMLInputElement} */ (section.querySelector(`#${IDS.copyToggle}`));
            if(isChecked) {
                setTimeout(() => {
                    copyToggle.checked = true;
                    copyToggle.dispatchEvent(new Event('change'));
                }, 200);
            }
            else {
                copyToggle.checked = false;
                copyToggle.dispatchEvent(new Event('change'));
                radioLetter.checked = false;
                radioBuilding.checked = false;
            }
            // Disable all inputs except master toggle
            const inputs = section.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.id !== IDS.scriptToggle) input.disabled = !isChecked;
            });

            // Labels (except user label)
            const labels = section.querySelectorAll('label');
            labels.forEach(label => {
                if (label.getAttribute('for') !== IDS.scriptToggle && label.id !== 'user-label') {
                    label.style.color = isChecked ? 'black' : 'gray';
                }
            });

            // Elementy div (oprócz pola edycji użytkownika)
            const divs = section.querySelectorAll('div');
            divs.forEach(div => {
                if (div.id !== IDS.userPoints) {
                    div.style.color = isChecked ? 'black' : 'gray';
                }
            });

            // Elementy span (oprócz nazwy użytkownika)
            const spans = section.querySelectorAll('span');
            spans.forEach(span => {
                if (span.id !== IDS.userName) {
                    span.style.color = isChecked ? 'black' : 'gray';
                }
            });

            // Kolor przy OFF i ON
            section.querySelectorAll('hr').forEach(hr => {
                /** @type {HTMLElement} */ (hr).style.borderColor = isChecked ? '#ccc' : '#eee';
            });
        });

        // Radiobutton litera
        section.querySelector(`#${IDS.radioLetter}`).addEventListener('change', function () {
            const isChecked = /** @type {HTMLInputElement} */(this).checked;
            const letterInput = /** @type {HTMLInputElement} */ (document.getElementById(IDS.letter));
            const letterLbl = section.querySelector(`label[for="${IDS.radioLetter}"]`);
            if (isChecked) {
                if (!letterInput.value) letterInput.value = 'A';
                if (letterLbl) letterLbl.style.color = 'black';
                letterInput.disabled = false;
            }
        });

        // Radiobutton Nmeracja budynków
        section.querySelector(`#${IDS.radioBuilding}`).addEventListener('change', function () {
            const isChecked = /** @type {HTMLInputElement} */(this).checked;
            const letterInput = /** @type {HTMLInputElement} */ (document.getElementById(IDS.letter));
            const letterLbl = section.querySelector(`label[for="${IDS.radioLetter}"]`);
            if (isChecked) {
                if (letterLbl) letterLbl.style.color = 'gray';
                letterInput.disabled = true;
                letterInput.value = "A";
            }
        });

        log.ok('Panel RPP dodany.');
    }

    /** Oczekiwanie na wyciągnięcie danych użytkownika i inicjacja panelu. */
    function ensurePanelWhenReady() {
        function isDomReady() {
            const userInfo = document.getElementById('user-info');
            if (!userInfo) return false;
            return (
                userInfo.getElementsByClassName('nav-tabs').length > 0 &&
                userInfo.getElementsByClassName('tab-content').length > 0
            );
        }

        function tryInit() {
            const tabsList = document.querySelector('#user-tabs ul.nav-tabs');
            const tabsContent = document.querySelector('#user-tabs .tab-content');
            if (tabsList && tabsContent) {
                initializeControlPanel();
                return true;
            }
            return false;
        }

        const observer = new MutationObserver(() => {
            if (tryInit()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const poll = () => {
            if (isDomReady()) {
                initializeControlPanel();
            } else {
                setTimeout(poll, 500);
            }
        };
        poll();
    }

    ensurePanelWhenReady();

    // ──────────────────────────────────────────────────────────────────────────────
    // ULEPSZENIE WIDOCZNOŚCI LISTBOXA
    // ──────────────────────────────────────────────────────────────────────────────
    (function improveListboxVisibility() {
        const style = document.createElement('style');
        style.textContent = `
      [role="listbox"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
        document.head.appendChild(style);
    })();

     // ──────────────────────────────────────────────────────────────────────────────
    // RYSOWANIE LINII OD TRÓJKĄTÓW DO SEGMENTU
    // ──────────────────────────────────────────────────────────────────────────────

    const MIN_ZOOM = 16;
    const POLL_MS = 300;

    let layerBlue = null;
    let layerBlack = null;

    let prevHighlightId = null;
    let prevZoom = null;
    let hovering = null;
    let drawingEnabled = true; // ______________________________________________________________________________________________________ ⬇️ NOWE: globalna flaga rysowania (spięta z checkboxem)

    const stylePoint = { pointRadius: 6, fillColor: '#00ff00', fillOpacity: 1, strokeColor: '#00ff00', strokeWidth: 2 };
    const stylePointNav = { pointRadius: 6, fillColor: '#ff0000', fillOpacity: 1, strokeColor: '#ff0000', strokeWidth: 2 };
    const styleLineToSeg = { strokeWidth: 4, strokeColor: '#ffa600' };
    const styleLineToNav = { strokeWidth: 3, strokeColor: '#ffa600', strokeDashstyle: 'dash' };

    function waitForAPIs(timeoutMs = 20000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            (function tick() {
                if (typeof W !== 'undefined' && W.map && typeof OpenLayers !== 'undefined' && typeof WazeWrap !== 'undefined') {
                    resolve();
                } else if (Date.now() - start > timeoutMs) {
                    reject(new Error('APIs not ready'));
                } else {
                    setTimeout(tick, 300);
                }
            })();
        });
    }

    function ensureLayers() {
        if (!layerBlue) {
            layerBlue = new OpenLayers.Layer.Vector('RPP blue', { displayInLayerSwitcher: false });
            W.map.addLayer(layerBlue);
        }
        if (!layerBlack) {
            layerBlack = new OpenLayers.Layer.Vector('RPP black', { displayInLayerSwitcher: false });
            W.map.addLayer(layerBlack);
        }
    }

    function navObjToOLPoint(obj) {
        try {
            if (!obj) return null;
            let coords = null;
            if (Array.isArray(obj)) coords = obj;
            else if (obj._point && Array.isArray(obj._point.coordinates)) coords = obj._point.coordinates;
            else if (Array.isArray(obj.coordinates)) coords = obj.coordinates;
            else if (typeof obj.lon === 'number' && typeof obj.lat === 'number') coords = [obj.lon, obj.lat];
            if (!coords) return null;
            const conv = WazeWrap.Geometry.ConvertTo900913(coords[0], coords[1]);
            return new OpenLayers.Geometry.Point(conv.lon, conv.lat);
        } catch {
            return null;
        }
    }

    function drawBlue() {
        if (!drawingEnabled) { layerBlue?.removeAllFeatures(); return; }

        const highlighted = W.map.venueLayer.getFeatureBy('renderIntent', 'highlight');
        const zoom = W.map.getZoom();

        if (!highlighted || zoom < MIN_ZOOM) {
            layerBlue.removeAllFeatures();
            prevHighlightId = null;
            prevZoom = zoom;
            return;
        }

        layerBlack.removeAllFeatures();

        const featId = highlighted.id;
        if (featId === prevHighlightId && zoom === prevZoom) return;
        prevHighlightId = featId;
        prevZoom = zoom;

        const model = WazeWrap.Model.getObjectModel(highlighted);
        let navPoint = null;
        let isArea = false;

        if (model) {
            if (model.getNavigationPoints?.().length > 0) {
                navPoint = navObjToOLPoint(model.getNavigationPoints()[0]);
            }
            if (!navPoint && model.attributes?.entryExitPoints?.length > 0) {
                navPoint = navObjToOLPoint(model.attributes.entryExitPoints[0]);
            }
            if (!navPoint && model.getOLGeometry) {
                isArea = !model.isPoint();
                const geom = model.getOLGeometry();
                navPoint = isArea ? geom.getCentroid() : geom.clone();
            }
        }

        if (!navPoint) { layerBlue.removeAllFeatures(); return; }

        const closestSeg = WazeWrap.Geometry.findClosestSegment(navPoint, false, false);
        if (!closestSeg?.closestPoint) { layerBlue.removeAllFeatures(); return; }

        layerBlue.removeAllFeatures();
        const lineToSeg = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([navPoint, closestSeg.closestPoint]), {}, styleLineToSeg
        );
        const segPoint = new OpenLayers.Feature.Vector(closestSeg.closestPoint, {}, stylePoint);

        layerBlue.addFeatures([lineToSeg, segPoint]);

        if (model) {
            const placeCenter = model.isPoint() ? model.getOLGeometry().clone() : model.getOLGeometry().getCentroid();
            const linePlaceToNav = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString([placeCenter, navPoint]), {}, styleLineToNav
            );
            const navFeature = new OpenLayers.Feature.Vector(navPoint.clone(), {}, stylePointNav);
            const hadEntryExit = model.getNavigationPoints?.().length > 0 || (model.attributes?.entryExitPoints?.length > 0);
            if (hadEntryExit || isArea) {
                layerBlue.addFeatures([linePlaceToNav, navFeature]);
            }
        }
    }

    function decideStartPointForIcon(img) {
        const navEls = Array.from(document.querySelectorAll('div.navigation-point')).filter(e => e.offsetParent !== null);
        if (navEls.length > 0) {
            const r = navEls[0].getBoundingClientRect();
            const mapRect = document.querySelector('.olMapViewport').getBoundingClientRect();
            const px = r.left + r.width / 2 - mapRect.left;
            const py = r.top + r.height / 2 - mapRect.top;
            const lonlat = W.map.getLonLatFromPixel(new OpenLayers.Pixel(px, py));
            const merc = WazeWrap.Geometry.ConvertTo900913(lonlat.lon, lonlat.lat);
            return new OpenLayers.Geometry.Point(merc.lon, merc.lat);
        }
        return null;
    }

    function drawToSegment(layer, startPoint) {
        if (!drawingEnabled) return;
        if (!startPoint) return;
        const nearest = WazeWrap.Geometry.findClosestSegment(startPoint, false, false);
        if (!nearest?.closestPoint) return;
        const end = nearest.closestPoint;

        const line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([startPoint, end]), {}, styleLineToSeg
        );
        const startMark = new OpenLayers.Feature.Vector(startPoint.clone(), {}, stylePoint);
        const endMark = new OpenLayers.Feature.Vector(end.clone(), {}, stylePointNav);

        layer.addFeatures([line, startMark, endMark]);
    }

    function onBlackEnter(img) {
        if (!drawingEnabled) return;
        hovering = img;
        layerBlack.removeAllFeatures();

        const entry = decideStartPointForIcon(img);
        const mapRect = document.querySelector('.olMapViewport').getBoundingClientRect();
        const r = img.getBoundingClientRect();
        const px = r.left + r.width / 2 - mapRect.left;
        const py = r.top + r.height / 2 - mapRect.top;
        const lonlat = W.map.getLonLatFromPixel(new OpenLayers.Pixel(px, py));
        const merc = WazeWrap.Geometry.ConvertTo900913(lonlat.lon, lonlat.lat);
        const triPt = new OpenLayers.Geometry.Point(merc.lon, merc.lat);

        drawToSegment(layerBlack, entry || triPt);
    }

    function onBlackLeave() {
        hovering = null;
        layerBlack.removeAllFeatures();
    }

    function bindBlackIcon(img) {
        if (img._rppBound) return;
        img._rppBound = true;
        img.addEventListener('mouseenter', () => onBlackEnter(img));
        img.addEventListener('mouseleave', onBlackLeave);
    }

    function scanAndBindBlack() {
        document.querySelectorAll('image').forEach(img => {
            const href = img.getAttribute('xlink:href') || '';
            if (href.includes('residential_selected.svg')) {
                bindBlackIcon(img);
            }
        });
    }

    async function init() {
        await waitForAPIs();
        ensureLayers();
        setInterval(drawBlue, POLL_MS);
        scanAndBindBlack();
        const mo = new MutationObserver(scanAndBindBlack);
        mo.observe(document.querySelector('.olMapViewport') || document.body, { childList: true, subtree: true });

        // ⬇️ PODPIĘCIE do checkboxa ON/OFF
        const toggle = document.getElementById('wme-rpp-script-toggle');
        if (toggle) {
            toggle.addEventListener('change', e => {
                drawingEnabled = e.target.checked;
                if (!drawingEnabled) {
                    layerBlue?.removeAllFeatures();
                    layerBlack?.removeAllFeatures();
                }
            });
            drawingEnabled = toggle.checked;
        }
    }

    init();

})();