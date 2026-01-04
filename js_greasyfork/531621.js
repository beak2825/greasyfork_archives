// ==UserScript==
// @name         Neopets Training Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces training form with smart stat logic, preferences, and modern stat card UI with over-cap breakdown and color bars
// @author       Fatal
// @match        https://www.neopets.com/island/training.phtml?type=courses*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/531621/Neopets%20Training%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531621/Neopets%20Training%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STATUS_URL = 'https://www.neopets.com/island/training.phtml?type=status';
    const FORM_ACTION = 'process_training.phtml';
    const LOCAL_KEY = 'petTrainerPreferences';

    const defaultPrefs = {
        strength: true,
        defence: true,
        agility: true,
        endurance: true
    };

    const savePrefs = (prefs) => localStorage.setItem(LOCAL_KEY, JSON.stringify(prefs));
    const loadPrefs = () => {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { ...defaultPrefs };
        } catch {
            return { ...defaultPrefs };
        }
    };

    const preferences = loadPrefs();
    const petStats = [];

    const wipeOriginalForm = () => {
        const oldForm = document.querySelector('form[action="process_training.phtml"]');
        if (oldForm) {
            const wrapper = document.createElement('div');
            wrapper.id = 'training-form-placeholder';
            oldForm.replaceWith(wrapper);
        }
    };

    wipeOriginalForm();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = STATUS_URL;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        const lastUsedPet = localStorage.getItem('lastUsedPet');
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const blocks = doc.querySelectorAll('td[bgcolor="white"][align="center"]');

        blocks.forEach(block => {
            const html = block.innerHTML;
            const nameMatch = html.match(/cpn\/(.*?)\//);
            if (!nameMatch) return;
            const name = nameMatch[1];

            // Get training status from header row
            const headerRow = block.closest('tr').previousElementSibling;
            const petNameInHeader = headerRow?.innerText?.match(/^(.+?) \(Level/)?.[1]?.trim();
            const isTraining = petNameInHeader === name && headerRow?.innerText?.includes("is currently studying");
            const trainingSkill = isTraining ?
                headerRow.innerText.match(/is currently studying (.+?)\)?$/)?.[1] :
                null;

            // Check payment status
            const hasTimeRemaining = html.includes('Time till course finishes');
            const hasUnpaidCourse = html.includes('This course has not been paid for yet');

            // Parse time remaining if paid course
            const timeMatch = html.match(/Time till course finishes : <br><b>(\d+ hrs?, \d+ minutes?, \d+ seconds?)<\/b>/i);
            const trainingTime = timeMatch ? timeMatch[1] : null;

            // Parse codestones only for unpaid courses
            let codestoneHTML = '';
            let payCancelHTML = '';
            if (hasUnpaidCourse && !hasTimeRemaining) {
                const codestoneMatches = [...html.matchAll(/<b>(.*?) Codestone<\/b>.*?<img src="(.*?)"/g)];
                codestoneHTML = codestoneMatches.map(m =>
                    `<div style="display: flex; align-items: center; gap: 5px; margin: 3px 0;">
                        <img src="${m[2]}" width="20" height="20">
                        <span>${m[1]} Codestone</span>
                    </div>`
                ).join('');

                payCancelHTML = `
                    <div style="margin-top: 8px;">
                        <form action="process_training.phtml" method="post" style="display:inline-block; margin-right:8px;">
                            <input type="hidden" name="pet_name" value="${name}">
                            <input type="hidden" name="type" value="pay">
                            <input type="submit" value="Pay for Course" style="padding: 4px 8px;">
                        </form>
                        <form action="process_training.phtml" method="post" style="display:inline-block;">
                            <input type="hidden" name="pet_name" value="${name}">
                            <input type="hidden" name="type" value="cancel">
                            <input type="submit" value="Cancel" style="padding: 4px 8px;">
                        </form>
                    </div>
                `;
            }

            petStats.push({
                name,
                level: parseInt(html.match(/Lvl : <font color="green"><b>(\d+)<\/b>/)?.[1] || 0),
                str: parseInt(html.match(/Str : <b>(\d+)<\/b>/)?.[1] || 0),
                def: parseInt(html.match(/Def : <b>(\d+)<\/b>/)?.[1] || 0),
                mov: parseInt(html.match(/Mov : <b>(\d+)<\/b>/)?.[1] || 0),
                hp: parseInt(html.match(/Hp  : <b>\d+ \/ (\d+)<\/b>/)?.[1] || 0),
                isTraining,
                trainingSkill,
                trainingTime,
                trainingDetails: {
                    unpaid: hasUnpaidCourse && !hasTimeRemaining,
                    codestones: codestoneHTML,
                    actions: payCancelHTML
                }
            });
        });

        renderCustomForm(lastUsedPet);

        const petDropdown = document.querySelector('select[name="pet_name"]');
        if (lastUsedPet && petDropdown) {
            petDropdown.value = lastUsedPet;
            petDropdown.dispatchEvent(new Event('change'));
        }
    };

    function renderCustomForm(lastUsedPet) {
        const container = document.querySelector('#training-form-placeholder');
        if (!container) return;

        container.innerHTML = '';
        container.style.padding = '10px';
        container.style.border = '1px solid #aaa';
        container.style.borderRadius = '6px';
        container.style.background = '#f8f8f8';

        const form = document.createElement('form');
        form.method = 'post';
        form.action = FORM_ACTION;

        form.innerHTML = `<input type="hidden" name="type" value="start">`;

        const petSelect = document.createElement('select');
        petSelect.name = 'pet_name';
        petSelect.style.width = '100%';
        petSelect.style.marginBottom = '10px';
        petSelect.innerHTML = `<option value="">🎯 Choose A Pet</option>` +
            petStats.map(p => `<option value="${p.name}"${lastUsedPet && p.name === lastUsedPet ? ' selected' : ''}>${p.name}</option>`).join('');
        form.appendChild(petSelect);

        const conditionalUI = document.createElement('div');
        conditionalUI.id = 'conditional-ui';
        conditionalUI.style.display = 'none';
        form.appendChild(conditionalUI);

        const courseSelect = document.createElement('select');
        courseSelect.name = 'course_type';
        courseSelect.style.width = '100%';
        courseSelect.style.marginBottom = '10px';
        conditionalUI.appendChild(courseSelect);

        const checkboxSection = document.createElement('div');
        checkboxSection.style.margin = '10px 0';
        checkboxSection.innerHTML = `<strong>🧠 Training Preferences</strong><br>`;

        const stats = ['strength', 'defence', 'agility', 'endurance'];
        const labels = {
            strength: 'Strength',
            defence: 'Defence',
            agility: 'Agility',
            endurance: 'Endurance (HP)'
        };

        stats.forEach(stat => {
            const label = document.createElement('label');
            label.style.marginRight = '10px';

            const box = document.createElement('input');
            box.type = 'checkbox';
            box.checked = preferences[stat];
            box.addEventListener('change', () => {
                preferences[stat] = box.checked;
                savePrefs(preferences);
                updateSelection();
            });

            label.appendChild(box);
            label.appendChild(document.createTextNode(' ' + labels[stat]));
            checkboxSection.appendChild(label);
        });

        conditionalUI.appendChild(checkboxSection);

        const feedback = document.createElement('div');
        feedback.style.padding = '8px';
        feedback.style.border = '1px solid #ccc';
        feedback.style.background = '#fff';
        feedback.style.borderRadius = '4px';
        feedback.style.marginBottom = '10px';
        conditionalUI.appendChild(feedback);

        const submit = document.createElement('input');
        submit.type = 'submit';
        submit.id = 'start-course-button';
        submit.value = 'Start Training';
        submit.style.marginTop = '10px';
        submit.style.padding = '6px 12px';
        conditionalUI.appendChild(submit);

        petSelect.addEventListener('change', () => {
            const selectedPet = petSelect.value;
            localStorage.setItem('lastUsedPet', selectedPet);
            const showUI = !!selectedPet;
            conditionalUI.style.display = showUI ? 'block' : 'none';
            if (showUI) updateSelection();
        });

        function updateSelection() {
            const selected = petStats.find(p => p.name === petSelect.value);
            if (!selected) return;

            const submitButton = document.querySelector('#start-course-button');
            if (submitButton) {
                submitButton.style.display = selected.isTraining ? 'none' : 'inline-block';
            }

            const level = selected.level;
            const cap = level * 2;

            const statList = [
                { key: 'strength', value: selected.str, label: 'Strength', course: 'Strength' },
                { key: 'defence', value: selected.def, label: 'Defence', course: 'Defence' },
                { key: 'agility', value: selected.mov, label: 'Agility', course: 'Agility' },
                { key: 'endurance', value: selected.hp, label: 'Endurance (HP)', course: 'Endurance' }
            ];

            const overCap = statList.filter(s => s.value > cap);
            const trainableStats = statList.filter(s => preferences[s.key] && s.value < cap);
            const trainable = trainableStats.length > 0 ?
                trainableStats.reduce((lowest, current) => current.value < lowest.value ? current : lowest) : null;

            let selectedCourse = 'Level';
            let reason = '';

            if (overCap.length > 0) {
                const overList = overCap.map(s => `${s.label}: ${s.value} / ${cap}`).join('<br>');
                const highestOver = overCap.reduce((max, stat) => stat.value > max.value ? stat : max, overCap[0]);
                const levelsNeeded = Math.ceil(highestOver.value / 2) - level;
                const levelDurations = [
                    { max: 20, hours: 2 },
                    { max: 40, hours: 3 },
                    { max: 80, hours: 4 },
                    { max: 100, hours: 6 },
                    { max: 120, hours: 8 },
                    { max: 150, hours: 12 },
                    { max: 200, hours: 18 },
                    { max: 250, hours: 24 }
                ];

                let estimatedTimeHours = 0;
                for (let i = 1; i <= levelsNeeded; i++) {
                    const currentLevel = level + i - 1;
                    const bracket = levelDurations.find(b => currentLevel <= b.max);
                    estimatedTimeHours += bracket ? bracket.hours : 24;
                }

                const days = Math.floor(estimatedTimeHours / 24);
                const hours = estimatedTimeHours % 24;
                const estimatedTime = `${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;

                selectedCourse = 'Level';
                reason = `These stats are over the cap of ${cap}, so you must train Level to raise the limit:<br>${overList}<br><br>To unlock further training, your pet must reach level <strong>${Math.ceil(highestOver.value / 2)}</strong>.<br>Estimated time: <strong>${estimatedTime}</strong>`;
            } else if (trainable) {
                selectedCourse = trainable.course;
                reason = `${trainable.label} is below the cap (${cap}) and is selected in your preferences.`;
            } else {
                selectedCourse = 'Level';
                reason = `All selected stats are at or above the cap (${cap}). Training Level to raise the limit.`;
            }

            courseSelect.innerHTML = `
                <option value="Strength"${selectedCourse === 'Strength' ? ' selected' : ''}>Strength</option>
                <option value="Defence"${selectedCourse === 'Defence' ? ' selected' : ''}>Defence</option>
                <option value="Agility"${selectedCourse === 'Agility' ? ' selected' : ''}>Agility</option>
                <option value="Endurance"${selectedCourse === 'Endurance' ? ' selected' : ''}>Endurance</option>
                <option value="Level"${selectedCourse === 'Level' ? ' selected' : ''}>Level</option>
            `;

            const statBars = statList.map(s => {
                const percent = Math.min(s.value / cap, 1);
                const isOver = s.value > cap;
                const barColor = isOver ? '#e74c3c' : '#4caf50';
                return `
                    <div style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 500;">
                            <span>${s.label}</span>
                            <span>${s.value} / ${cap}</span>
                        </div>
                        <div style="background: #eee; border-radius: 4px; overflow: hidden; height: 8px; margin-top: 2px;">
                            <div style="width: ${Math.min(100, percent * 100)}%; background: ${barColor}; height: 100%;"></div>
                        </div>
                    </div>`;
            }).join('');

const trainingBox = selected.isTraining ? `
    <div style="padding: 10px; margin-bottom: 8px; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 6px; color: #856404; font-size: 13px;">
        <strong>Currently Training:</strong> ${selected.trainingSkill}<br>
        ${selected.trainingTime ?
            `⏳ Time remaining: ${selected.trainingTime}` :
            selected.trainingDetails?.codestones ?
                '⚠️ This course has not been paid for yet.<br>' +
                selected.trainingDetails.codestones +
                selected.trainingDetails.actions :
                'Course in progress'
        }
    </div>
` : '';

            feedback.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <img src="https://pets.neopets.com/cpn/${selected.name}/1/4.png" width="180" style="border-radius: 8px;">
                    <div style="flex: 1;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${selected.name}</div>
                        ${trainingBox}
                        <div style="font-size: 13px; margin-bottom: 6px;">
                            <strong>Level:</strong> ${level}<br>
                            <strong>Str:</strong> ${selected.str},
                            <strong>Def:</strong> ${selected.def},
                            <strong>Agi:</strong> ${selected.mov},
                            <strong>HP:</strong> ${selected.hp}
                        </div>
                        <div style="font-weight: bold; color: green; margin-bottom: 6px;">Training: ${selectedCourse}</div>
                        <div style="font-size: 12px; color: #333; margin-bottom: 6px;">${reason}</div>
                        <div style="font-size: 12px; color: #333; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
                            ${statBars}
                        </div>
                    </div>
                </div>
            `;
        }

        container.appendChild(form);
    }
})();