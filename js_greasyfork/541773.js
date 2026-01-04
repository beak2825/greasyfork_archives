// ==UserScript==
// @name         Isikan AKu Auto-Fill Survey Lingkungan Belajar (GTK Dikdasmen) 
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Mengisi survei lingkungan belajar GTK Dikdasmen dengan pengaturan per soal dan pola rentang, fokus pada halaman yang aktif. Dilengkapi logging debugging.
// @author       ChatGPT
// @match        https://gtk.dikdasmen.go.id/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541773/Isikan%20AKu%20Auto-Fill%20Survey%20Lingkungan%20Belajar%20%28GTK%20Dikdasmen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541773/Isikan%20AKu%20Auto-Fill%20Survey%20Lingkungan%20Belajar%20%28GTK%20Dikdasmen%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Objek untuk menyimpan informasi detail setiap pertanyaan (semua 88 soal)
    const allQuestionsData = {};

    // Objek untuk menyimpan konfigurasi jawaban yang diinginkan pengguna
    const userConfiguredAnswers = {};

    // Variabel untuk mengontrol inisialisasi dan polling
    let initializationAttempts = 0;
    const MAX_INITIALIZATION_ATTEMPTS = 30; // Coba hingga 30 kali (15 detik jika interval 500ms)
    let initializationIntervalId = null;

    /**
     * Membaca teks pertanyaan dari DOM.
     * Disesuaikan untuk struktur yang Anda berikan, termasuk sub-pertanyaan dan bagian utama.
     */
    function getQuestionText(element, soalNumber) {
        let subQuestionText = '';
        let mainSectionTitle = '';

        // 1. Get the immediate question text (e.g., "a.", "Seberapa mudah...")
        if (element.tagName === 'INPUT' && element.type === 'radio') {
            // Check for structure: <tr><td>a.</td><td>Question Text</td><td>...radio buttons...</td></tr>
            const tdElement = element.closest('td');
            if (tdElement && tdElement.previousElementSibling) {
                // This gets 'a.' or 'b.' text
                subQuestionText = tdElement.previousElementSibling.textContent.trim();

                // Get the actual question text (second td) if it exists
                const questionTd = tdElement.previousElementSibling.previousElementSibling;
                if (questionTd && questionTd.tagName === 'TD') {
                    // This is for the structure where 'No' is the first TD and 'Pertanyaan' is the second
                    subQuestionText = questionTd.textContent.trim();
                }
                 // If the question is in a 'radio-wrapper' not inside a table with <td>No</td><td>Pertanyaan</td>
                // And if 'subQuestionText' is still just a letter like 'a.' or empty, try finding the label associated
                if (subQuestionText.length <= 2 && element.nextElementSibling && element.nextElementSibling.tagName === 'LABEL') {
                     subQuestionText = element.nextElementSibling.textContent.trim();
                     // If it's a Likert scale where labels are the options, we might not get the full question text here easily.
                     // The H5 title will be crucial.
                     if (subQuestionText.includes('Sulit') || subQuestionText.includes('Setuju') || subQuestionText.includes('Bermanfaat') || subQuestionText.includes('Kurang')) {
                         subQuestionText = `[Skala Likert]`; // Generic marker for these types
                     }
                }
            }
        } else if (element.tagName === 'TEXTAREA') {
            const labelElement = element.previousElementSibling;
            if (labelElement && labelElement.tagName === 'LABEL') {
                const strongTag = labelElement.querySelector('strong');
                subQuestionText = strongTag ? strongTag.textContent.trim() : labelElement.textContent.trim();
            }
        }

        // 2. Get the main section title (H5) if applicable
        const parentFormPage = element.closest('.form-page');
        if (parentFormPage) {
            const h5Title = parentFormPage.querySelector('h5.font-weight-bold.mb-3');
            if (h5Title) {
                // Remove leading number and dot (e.g., "1. ") from the H5 text
                mainSectionTitle = h5Title.textContent.replace(/^\d+\.\s*/, '').trim();
            }
        }

        // 3. Combine them intelligently
        let finalQuestionText = '';
        if (mainSectionTitle && subQuestionText && subQuestionText !== `[Skala Likert]`) {
            // Avoid redundancy if subQuestionText already starts with the H5 title's context
            if (subQuestionText.startsWith(mainSectionTitle)) {
                 finalQuestionText = subQuestionText;
            } else {
                finalQuestionText = `${mainSectionTitle} - ${subQuestionText}`;
            }
        } else if (mainSectionTitle && subQuestionText === `[Skala Likert]`) {
             // For Likert scale questions, use the H5 title as primary text
             finalQuestionText = `${mainSectionTitle} - Soal Skala`;
        }
        else if (subQuestionText) {
            finalQuestionText = subQuestionText; // Use the most immediate question text
        } else if (mainSectionTitle) {
            finalQuestionText = mainSectionTitle; // Use H5 title as fallback
        } else {
            finalQuestionText = `Soal #${soalNumber}`; // Generic fallback
        }

        // Trim and ensure it's not empty, if so, default to generic.
        finalQuestionText = finalQuestionText.trim();
        if (!finalQuestionText) {
            finalQuestionText = `Soal #${soalNumber} (Teks tidak terdeteksi)`;
        }

        return finalQuestionText;
    }


    /**
     * Mengumpulkan informasi semua pertanyaan di seluruh DOM.
     * Mengisi `allQuestionsData` dengan detail setiap soal.
     */
    function collectAllQuestionsInfo() {
        console.log("Collecting all questions info (initial scan)...");
        const processedRadioGroups = new Set();
        const foundSoalNumbers = new Set();
        let questionsCount = 0;

        // Collect Radio Button Questions
        document.querySelectorAll('input[type="radio"].soal-radio').forEach(input => {
            const soalNumber = input.dataset.nosoal;
            const radioGroupName = input.name;

            // Important: Filter out hidden inputs associated with radio groups, they also have class 'soal-radio'
            // The ones we want have type="radio". The hidden ones have no type or type="hidden".
            if (input.type !== 'radio') {
                return; // Skip hidden inputs with 'soal-radio' class
            }

            if (soalNumber && radioGroupName && !processedRadioGroups.has(radioGroupName)) {
                processedRadioGroups.add(radioGroupName);
                foundSoalNumbers.add(soalNumber);
                const radiosInGroup = document.querySelectorAll(`input[name="${radioGroupName}"][type="radio"]`); // Ensure only radio inputs

                // If this is a question with letter numbering (like 'a.', 'b.', 'c.')
                // it might have a generic question text, we need to find the specific question text from the <td>.
                // Re-evaluate the question text here to be robust.
                allQuestionsData[soalNumber] = {
                    type: "radio",
                    name: radioGroupName,
                    id: input.id,
                    numOptions: radiosInGroup.length,
                    questionText: getQuestionText(input, soalNumber)
                };
                questionsCount++;
            }
        });

        // Collect Textarea Questions
        document.querySelectorAll('textarea.soal-radio').forEach(textarea => {
            const soalNumber = textarea.dataset.nosoal;
            if (soalNumber && !foundSoalNumbers.has(soalNumber)) {
                foundSoalNumbers.add(soalNumber);
                allQuestionsData[soalNumber] = {
                    type: "textarea",
                    name: textarea.name,
                    id: textarea.id,
                    questionText: getQuestionText(textarea, soalNumber)
                };
                questionsCount++;
            }
        });

        // Sort questionsData by soalNumber keys
        const sortedKeys = Object.keys(allQuestionsData).sort((a, b) => parseInt(a) - parseInt(b));
        const sortedQuestionsDataTemp = {};
        sortedKeys.forEach(key => {
            sortedQuestionsDataTemp[key] = allQuestionsData[key];
        });
        Object.assign(allQuestionsData, sortedQuestionsDataTemp);

        console.log(`Initial scan complete. Total unique questions found: ${questionsCount}. Details:`, allQuestionsData);
    }

    /**
     * Membaca jawaban yang sudah ada di form dan menyimpannya ke userConfiguredAnswers.
     */
    function readCurrentAnswersFromForm() {
        console.log("Reading current answers from form...");
        // Iterate only over questions that are currently in the DOM
        const currentSoalElements = document.querySelectorAll('input[type="radio"].soal-radio, textarea.soal-radio');

        currentSoalElements.forEach(el => {
            const soalNumber = el.dataset.nosoal;
            const qData = allQuestionsData[soalNumber];

            // Skip hidden inputs. They also have soal-radio but aren't interactable.
            if (el.tagName === 'INPUT' && el.type !== 'radio') {
                return;
            }

            if (!qData) {
                console.warn(`[Read Current] Soal ${soalNumber} is in DOM but not in allQuestionsData. Skipping.`);
                return;
            }

            if (qData.type === "radio") {
                const selectedRadio = document.querySelector(`input[name="${qData.name}"][type="radio"]:checked`); // Explicitly target type="radio"
                if (selectedRadio) {
                    const radiosInGroup = Array.from(document.querySelectorAll(`input[name="${qData.name}"][type="radio"]`));
                    const selectedIndex = radiosInGroup.indexOf(selectedRadio);
                    if (selectedIndex !== -1) {
                        userConfiguredAnswers[soalNumber] = selectedIndex; // Store 0-indexed
                    }
                } else {
                    delete userConfiguredAnswers[soalNumber];
                }
            } else if (qData.type === "textarea") {
                const textareaEl = document.getElementById(qData.id);
                if (textareaEl && textareaEl.value) {
                    userConfiguredAnswers[soalNumber] = textareaEl.value;
                } else {
                    delete userConfiguredAnswers[soalNumber];
                }
            }
        });
        console.log('Current answers read from form:', userConfiguredAnswers);
    }

    /**
     * Fungsi untuk menerapkan jawaban yang sudah dikonfigurasi ke elemen form yang terlihat.
     */
    function applyConfiguredAnswersToVisibleQuestions() {
        console.log("Applying configured answers to visible questions (actual form interaction)...");

        let questionsAnswered = 0;
        let questionsSkipped = 0;

        const visibleFormPage = document.querySelector('.form-page[style*="block"]');
        if (!visibleFormPage) {
            alert("Tidak ada halaman form yang terlihat. Pastikan Anda berada di halaman survei yang aktif.");
            return;
        }

        const visibleElements = visibleFormPage.querySelectorAll('input[type="radio"].soal-radio, textarea.soal-radio');

        if (visibleElements.length === 0) {
            alert("Tidak ditemukan pertanyaan di halaman yang terlihat. Pastikan halaman sudah termuat sepenuhnya.");
            return;
        }

        visibleElements.forEach(el => {
            // Skip hidden inputs. They also have soal-radio but aren't interactable.
            if (el.tagName === 'INPUT' && el.type !== 'radio') {
                return;
            }

            const soalNumber = el.dataset.nosoal;
            const qData = allQuestionsData[soalNumber];

            if (!qData) {
                console.warn(`[Apply Visible] Informasi untuk Soal ${soalNumber} tidak ditemukan di allQuestionsData. Skipping.`);
                questionsSkipped++;
                return;
            }

            const desiredAnswer = userConfiguredAnswers[soalNumber];

            if (typeof desiredAnswer === 'undefined' || (qData.type === 'textarea' && desiredAnswer === '')) {
                questionsSkipped++;
                return;
            }

            if (qData.type === "radio") {
                const radiosInGroup = document.querySelectorAll(`input[name="${qData.name}"][type="radio"]`);
                if (radiosInGroup.length > desiredAnswer) {
                    const targetRadio = radiosInGroup[desiredAnswer];
                    if (targetRadio) {
                        if (!targetRadio.checked) {
                            targetRadio.click(); // Simulate user click
                            questionsAnswered++;
                            console.log(`[Applied] Soal ${soalNumber}: Klik opsi ${desiredAnswer + 1}`);
                        } else {
                            questionsSkipped++;
                            console.log(`[Skipped] Soal ${soalNumber}: Opsi ${desiredAnswer + 1} sudah terpilih.`);
                        }
                    } else {
                        console.warn(`[SKIPPED] Opsi ke-${desiredAnswer + 1} tidak ditemukan untuk Soal ${soalNumber} (radio elemen).`);
                        questionsSkipped++;
                    }
                } else {
                    console.warn(`[SKIPPED] Soal ${soalNumber} (radio) hanya memiliki ${radiosInGroup.length} opsi, tidak cukup untuk memilih opsi ke-${desiredAnswer + 1}.`);
                    questionsSkipped++;
                }
            } else if (qData.type === "textarea") {
                const textareaEl = document.getElementById(qData.id);
                if (textareaEl) {
                    if (textareaEl.value !== desiredAnswer) {
                        textareaEl.value = desiredAnswer;
                        const event = new Event('input', { bubbles: true });
                        textareaEl.dispatchEvent(event);
                        questionsAnswered++;
                        console.log(`[Applied] Soal ${soalNumber}: Mengisi teks "${desiredAnswer}"`);
                    } else {
                        questionsSkipped++;
                        console.log(`[Skipped] Soal ${soalNumber}: Teks sudah sama.`);
                    }
                } else {
                    console.warn(`[SKIPPED] Textarea dengan ID ${qData.id} (Soal ${soalNumber}) tidak ditemukan.`);
                    questionsSkipped++;
                }
            }
        });

        alert(`Selesai!
        ${questionsAnswered} pertanyaan di halaman ini telah diisi sesuai konfigurasi.
        ${questionsSkipped} pertanyaan dilewati (sudah terisi/tidak memenuhi kriteria/tidak memiliki konfigurasi).`);
    }

    /**
     * Menerapkan pola jawaban ke rentang soal yang ditentukan DALAM HALAMAN YANG TERLIHAT.
     */
    function applyPatternToRange() {
        const startSoalInput = document.getElementById('start-soal-input');
        const endSoalInput = document.getElementById('end-soal-input');
        const patternInput = document.getElementById('pattern-input');

        const startSoal = parseInt(startSoalInput.value);
        const endSoal = parseInt(endSoalInput.value);
        const patternString = patternInput.value.trim();

        if (isNaN(startSoal) || isNaN(endSoal) || startSoal < 1 || endSoal < startSoal) {
            alert("Nomor soal awal dan akhir tidak valid. Pastikan ini adalah angka dan awal <= akhir.");
            return;
        }

        const pattern = patternString.split(',').map(s => {
            const num = parseInt(s.trim());
            return isNaN(num) ? null : num - 1; // Convert to 0-indexed, or null if invalid
        }).filter(n => n !== null); // Filter out invalid numbers

        if (pattern.length === 0) {
            alert("Pola jawaban tidak valid. Masukkan angka yang dipisahkan koma (misal: 1,2,3).");
            return;
        }

        console.log(`Applying pattern "${patternString}" to visible questions from ${startSoal} to ${endSoal}...`);

        let configuredCount = 0;
        const visibleFormPage = document.querySelector('.form-page[style*="block"]');
        if (!visibleFormPage) {
            alert("Tidak ada halaman form yang terlihat untuk menerapkan pola.");
            return;
        }

        // Get visible radio question elements on the current page
        // Filter out hidden inputs that might have soal-radio class
        const visibleRadioElements = visibleFormPage.querySelectorAll('input[type="radio"].soal-radio[type="radio"]');
        const visibleSoalNumbersOnPage = new Set();
        visibleRadioElements.forEach(el => visibleSoalNumbersOnPage.add(el.dataset.nosoal));

        // Filter these visible soal numbers by the user's defined range
        const targetSoalNumbers = Array.from(visibleSoalNumbersOnPage)
            .map(s => parseInt(s))
            .filter(num => num >= startSoal && num <= endSoal)
            .sort((a, b) => a - b);

        if (targetSoalNumbers.length === 0) {
            alert("Tidak ada pertanyaan radio button yang terlihat di halaman ini dalam rentang yang ditentukan.");
            return;
        }

        targetSoalNumbers.forEach((numSoal, indexInFilteredList) => {
            const soalNumber = String(numSoal);
            const qData = allQuestionsData[soalNumber];

            if (qData && qData.type === "radio") {
                const patternIndex = indexInFilteredList % pattern.length; // Use index in filtered list for pattern application
                const desiredOptionIndex = pattern[patternIndex];

                if (desiredOptionIndex < qData.numOptions) {
                    userConfiguredAnswers[soalNumber] = desiredOptionIndex;
                    configuredCount++;
                    console.log(`  Soal ${soalNumber}: Pola -> Opsi ${desiredOptionIndex + 1}`);
                } else {
                    console.warn(`  Soal ${soalNumber} memiliki ${qData.numOptions} opsi, tidak dapat menerapkan opsi ke-${desiredOptionIndex + 1} dari pola.`);
                }
            }
        });

        alert(`${configuredCount} jawaban radio button telah dikonfigurasi berdasarkan pola di halaman ini. Sekarang akan diterapkan ke form.`);
        updateControlPanel(); // Refresh UI panel to reflect changes
        applyConfiguredAnswersToVisibleQuestions(); // Apply the changes to the form immediately
    }


    // --- Pembuatan dan Pembaruan Antarmuka Pengguna (UI) ---
    function updateControlPanel() {
        console.log("Updating control panel UI...");
        let panel = document.getElementById('survey-auto-fill-per-question-panel');
        if (panel) {
            panel.remove();
        }

        panel = document.createElement('div');
        panel.id = 'survey-auto-fill-per-question-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.98);
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 99999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 95vh;
            overflow-y: auto;
            width: 320px;
        `;

        const title = document.createElement('div');
        title.innerHTML = `
            <strong style="color: #333; font-size: 1.1em;">Isi Survei Otomatis</strong>
            <div style="font-size: 0.85em; color: #666; margin-top: 5px;">
                *Konfigurasi ini akan disimpan untuk semua soal (88) dan tetap berlaku saat berpindah halaman.
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
        `;
        panel.appendChild(title);

        // --- Bagian Pengaturan Pola Rentang ---
        const patternSection = document.createElement('div');
        patternSection.style.cssText = `
            border: 1px dashed #007bff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #eaf6ff;
            color: #0056b3;
        `;

        const allSoalNumbers = Object.keys(allQuestionsData).map(s => parseInt(s)).sort((a,b) => a-b);
        const minSoalNum = allSoalNumbers.length > 0 ? allSoalNumbers[0] : 1;
        const maxSoalNum = allSoalNumbers.length > 0 ? allSoalNumbers[allSoalNumbers.length - 1] : 88;

        patternSection.innerHTML = `
            <strong style="font-size: 1em;">Atur Pola Jawaban untuk Rentang Soal Radio Button yang Tampil:</strong>
            <div style="font-size: 0.8em; margin-top: 5px;">
                Dari soal nomor:
                <input type="number" id="start-soal-input" min="1" value="${minSoalNum}" style="width: 50px; padding: 3px; margin: 0 2px;">
                sampai
                <input type="number" id="end-soal-input" min="1" value="${maxSoalNum}" style="width: 50px; padding: 3px; margin: 0 2px;">
            </div>
            <div style="font-size: 0.8em; margin-top: 5px;">
                Pola jawaban (1-indexed, pisahkan koma):
                <input type="text" id="pattern-input" placeholder="contoh: 1,2,3" value="1" style="width: 100%; padding: 3px; margin-top: 5px;">
            </div>
            <button id="apply-pattern-btn" style="
                width: 100%;
                padding: 8px;
                margin-top: 10px;
                border: none;
                border-radius: 4px;
                background-color: #007bff;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            ">Terapkan Pola ke Soal Tampil</button>
        `;
        panel.appendChild(patternSection); // <--- INI PENTING: TAMBAHKAN DULU KE DOM!

        // Pastikan elemen input ada setelah ditambahkan ke DOM!
        const applyPatternBtn = panel.querySelector('#apply-pattern-btn');
        if (applyPatternBtn) {
            applyPatternBtn.onclick = applyPatternToRange;
            applyPatternBtn.onmouseover = () => applyPatternBtn.style.backgroundColor = '#0056b3';
            applyPatternBtn.onmouseout = () => applyPatternBtn.style.backgroundColor = '#007bff';
        } else {
            // Ini seharusnya tidak terjadi lagi jika panel.appendChild(patternSection) sudah benar
            console.error("Critical Error: Input/button for pattern range not found after panel creation. Please check script.");
        }


        panel.appendChild(document.createElement('hr')).style.cssText = "border: 0; border-top: 1px solid #eee; margin: 10px 0;";


        // --- Bagian Pengaturan Per Soal Individual di Halaman Aktif ---
        const visibleFormPage = document.querySelector('.form-page[style*="block"]');
        if (!visibleFormPage) {
            const noQuestionsMsg = document.createElement('p');
            noQuestionsMsg.style.cssText = 'color: #999; font-size: 0.9em; text-align: center;';
            noQuestionsMsg.textContent = 'Tidak ada pertanyaan yang terlihat di halaman ini.';
            panel.appendChild(noQuestionsMsg);
        } else {
            // Only select visible, actual input/textarea elements, NOT hidden inputs
            const visibleQuestionsElements = visibleFormPage.querySelectorAll('input[type="radio"].soal-radio[type="radio"], textarea.soal-radio');

            const visibleSoalNumbers = new Set();
            visibleQuestionsElements.forEach(el => visibleSoalNumbers.add(el.dataset.nosoal));
            const sortedVisibleSoalNumbers = Array.from(visibleSoalNumbers).sort((a, b) => parseInt(a) - parseInt(b));

            if (sortedVisibleSoalNumbers.length === 0) {
                 const noQuestionsMsg = document.createElement('p');
                noQuestionsMsg.style.cssText = 'color: #999; font-size: 0.9em; text-align: center;';
                noQuestionsMsg.textContent = 'Tidak ada pertanyaan terdeteksi di bagian form yang aktif.';
                panel.appendChild(noQuestionsMsg);
            } else {
                sortedVisibleSoalNumbers.forEach(soalNumber => {
                    const qData = allQuestionsData[soalNumber];
                    if (!qData) {
                        console.warn(`Soal ${soalNumber} terlihat tapi tidak ada di allQuestionsData.`);
                        return;
                    }

                    const inputRow = document.createElement('div');
                    inputRow.style.cssText = 'display: flex; flex-direction: column; gap: 3px;';

                    const questionTextDisplay = document.createElement('div');
                    questionTextDisplay.style.cssText = 'font-weight: bold; font-size: 0.9em; color: #555;';
                    const maxTextLength = 50;
                    let displayQuestionText = qData.questionText;
                    if (displayQuestionText.length > maxTextLength) {
                        displayQuestionText = displayQuestionText.substring(0, maxTextLength) + '...';
                    }
                    questionTextDisplay.textContent = `Soal ${soalNumber}: ${displayQuestionText}`;
                    inputRow.appendChild(questionTextDisplay);

                    let inputElement;

                    if (qData.type === "radio") {
                        inputElement = document.createElement('input');
                        inputElement.type = 'number';
                        inputElement.min = 1;
                        inputElement.max = qData.numOptions;
                        inputElement.placeholder = `1-${qData.numOptions}`;
                        inputElement.style.cssText = `
                            width: 100%;
                            padding: 6px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            font-size: 13px;
                            text-align: center;
                        `;
                        if (typeof userConfiguredAnswers[soalNumber] !== 'undefined') {
                            inputElement.value = userConfiguredAnswers[soalNumber] + 1; // Convert to 1-indexed
                        } else {
                            inputElement.value = '';
                        }

                        inputElement.onchange = (event) => {
                            const val = parseInt(event.target.value);
                            if (!isNaN(val) && val >= 1 && val <= qData.numOptions) {
                                userConfiguredAnswers[soalNumber] = val - 1; // Store 0-indexed
                                console.log(`Konfigurasi: Soal ${soalNumber} = Opsi ${val}`);
                            } else {
                                delete userConfiguredAnswers[soalNumber];
                                console.log(`Konfigurasi untuk Soal ${soalNumber} dihapus (input tidak valid).`);
                                event.target.value = '';
                            }
                        };
                    } else if (qData.type === "textarea") {
                        inputElement = document.createElement('textarea');
                        inputElement.rows = 2;
                        inputElement.placeholder = "Ketik jawaban di sini...";
                        inputElement.style.cssText = `
                            width: 100%;
                            padding: 6px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            font-size: 13px;
                            resize: vertical;
                        `;
                        if (typeof userConfiguredAnswers[soalNumber] !== 'undefined') {
                            inputElement.value = userConfiguredAnswers[soalNumber];
                        } else {
                            inputElement.value = '';
                        }

                        inputElement.oninput = (event) => {
                            userConfiguredAnswers[soalNumber] = event.target.value.trim();
                            console.log(`Konfigurasi: Soal ${soalNumber} = "${userConfiguredAnswers[soalNumber]}"`);
                        };
                    }

                    if (inputElement) {
                        inputRow.appendChild(inputElement);
                        panel.appendChild(inputRow);
                    }
                });

                // Tombol untuk menerapkan semua jawaban yang dikonfigurasi di panel ini
                const applyVisibleButton = document.createElement('button');
                applyVisibleButton.textContent = 'Terapkan Jawaban ke Halaman Ini';
                applyVisibleButton.style.cssText = `
                    padding: 10px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background-color: #28a745;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 15px;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
                applyVisibleButton.onmouseover = () => applyVisibleButton.style.backgroundColor = '#218838';
                applyVisibleButton.onmousedown = () => applyVisibleButton.style.transform = 'translateY(1px)';
                applyVisibleButton.onmouseup = () => applyVisibleButton.style.transform = 'translateY(0)';
                applyVisibleButton.onmouseout = () => {
                    applyVisibleButton.style.backgroundColor = '#28a745';
                    applyVisibleButton.style.transform = 'translateY(0)';
                };

                applyVisibleButton.onclick = applyConfiguredAnswersToVisibleQuestions;
                panel.appendChild(applyVisibleButton);
            }
        }
        document.body.appendChild(panel);
        console.log("Control panel appended to body.");
    }

    // --- Inisialisasi Script ---
    let observer;
    let debounceTimer;

    function initializeScript() {
        console.log(`Attempting to initialize script (Attempt ${initializationAttempts + 1}/${MAX_INITIALIZATION_ATTEMPTS})...`);

        // 1. Kumpulkan info tentang semua pertanyaan (sekali saat awal, lalu diperbarui jika perlu)
        collectAllQuestionsInfo();

        // 2. Cek apakah sudah ada pertanyaan yang terdeteksi
        const firstVisiblePage = document.querySelector('.form-page[style*="block"]');
        if (Object.keys(allQuestionsData).length > 0 && firstVisiblePage) {
            console.log("Initial questions detected and a visible form page found. Proceeding with UI creation.");
            clearInterval(initializationIntervalId); // Hentikan interval polling

            readCurrentAnswersFromForm(); // Baca state awal form
            updateControlPanel(); // Buat panel awal

            // 3. Set up MutationObserver untuk mendeteksi perubahan halaman
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                const config = { attributes: true, subtree: true, attributeFilter: ['style'] }; // Watch style changes on subtree
                observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style' &&
                            mutation.target.classList.contains('form-page')) {
                            clearTimeout(debounceTimer);
                            debounceTimer = setTimeout(() => {
                                console.log("Detected form-page style change. Updating control panel.");
                                readCurrentAnswersFromForm();
                                updateControlPanel();
                            }, 200);
                        }
                    });
                });
                observer.observe(formContainer, config);
                console.log("MutationObserver set up for .form-container to watch for page changes.");
            } else {
                console.warn("Element .form-container not found. Page navigation watcher will not be active.");
            }
        } else {
            initializationAttempts++;
            if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
                clearInterval(initializationIntervalId);
                console.error("Failed to find survey questions or active form page after multiple attempts. Userscript UI will not be displayed.");
                alert("Userscript 'Auto-Fill Survey' tidak dapat memuat. Mungkin halaman survei belum sepenuhnya dimuat atau ada perubahan struktur HTML yang tidak sesuai.");
            } else {
                console.log("No questions or active form page found yet. Retrying...");
            }
        }
    }

    // Jalankan inisialisasi secara berkala hingga elemen ditemukan atau batas upaya tercapai
    window.addEventListener('DOMContentLoaded', () => {
        initializationIntervalId = setInterval(initializeScript, 500); // Try every 500ms
    });
    // Fallback and aggressive retry on 'load' event
    window.addEventListener('load', () => {
        if (initializationIntervalId !== null) { // If still polling from DOMContentLoaded
            clearInterval(initializationIntervalId); // Stop previous polling
            console.log("Load event fired. Attempting final initialization with aggressive retry.");
            initializationAttempts = 0; // Reset attempts to give it a full retry chance
            initializationIntervalId = setInterval(initializeScript, 100); // Faster retry after page load
        } else if (!document.getElementById('survey-auto-fill-per-question-panel')) {
            console.log("Load event fired and panel not found. Initiating one last robust attempt.");
            initializationAttempts = 0;
            initializeScript();
        }
    });

})();