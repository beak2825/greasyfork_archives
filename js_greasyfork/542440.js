// ==UserScript==
// @name         Pilgrim Management
// @namespace    http://tampermonkey.net/
// @version      2.5
// @license      MIT
// @description  Manage pilgrim groups with Chrome/Opera compatibility
// @match        https://ttdevasthanams.ap.gov.in/*
// @exclude      https://ttdevasthanams.ap.gov.in/*receipt*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      ttdevasthanams.ap.gov.in
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/542440/Pilgrim%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/542440/Pilgrim%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_GROUPS = 10;
    let lastMobileNumber = localStorage.getItem('ttdLoginMobile') || '';
    let autoClickInterval = null;
    let autoClickActive = localStorage.getItem('acs') === 'true';

    // Core utility functions
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    function setNativeValue(input, value) {
        input.focus();
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function simulateTyping(input, value, callback) {
        input.focus();
        input.value = '';
        let i = 0;
        function typeChar() {
            if (i < value.length) {
                let partial = value.slice(0, ++i);
                setNativeValue(input, partial);
                setTimeout(typeChar, 20);
            } else {
                input.blur();
                if (callback) setTimeout(callback, 50);
            }
        }
        typeChar();
    }

    function selectDropdownValue(input, valueToSelect, callback) {
        input.click();
        let attempts = 0;
        function trySelect() {
            const options = Array.from(document.querySelectorAll('[role="option"], li, div, span'))
                .filter(el => el.innerText && el.innerText.trim().toLowerCase() === valueToSelect.toLowerCase());
            if (options.length > 0) {
                options[0].click();
                if (callback) setTimeout(callback, 50);
            } else if (attempts++ < 10) {
                setTimeout(trySelect, 50);
            } else {
                console.warn('Option not found:', valueToSelect);
                if (callback) callback();
            }
        }
        setTimeout(trySelect, 100);
    }

    function clickContinueButton() {
        setTimeout(() => {
            const continueBtn = document.querySelector('.primary-btn');
            if (continueBtn) {
                continueBtn.click();
            }
        }, 500);
    }

    // Auto-click function
    function toggleAutoClick(enable) {
        if (autoClickInterval) {
            clearInterval(autoClickInterval);
            autoClickInterval = null;
        }

        autoClickActive = enable;
        localStorage.setItem('acs', enable.toString());

        if (enable) {
            autoClickInterval = setInterval(() => {
                // Try Continue button first
                const continueBtn = document.querySelector('.sevaReview_confirmButton__YiMRk, .primary-btn');
                if (continueBtn) {
                    continueBtn.click();
                    return;
                }

                // Then try Pay Now button
                const payNowBtn = document.querySelector('.ReviewDetails_desktopPaynowButton__Qp_eG');
                if (payNowBtn) {
                    payNowBtn.click();
                }
            }, 10000); // Check every 10 seconds
        }
    }

    // Form filling functions
    function fillNextField(data, index = 0, field = 0) {
        const isFullForm = document.querySelector('input[name="fname"]') !== null;
        const isLimitedForm = document.querySelector('input[name="name"]') !== null;

        if (isLimitedForm && index >= 2) {
            clickContinueButton();
            return;
        }
        if (isFullForm && index >= 6) {
            clickContinueButton();
            return;
        }
        if (!data[index]) {
            clickContinueButton();
            return;
        }

        const person = data[index];
        const fullFields = ['fname', 'age', 'gender', 'photoIdType', 'idProofNumber'];
        const limitedFields = ['name', 'age', 'gender', 'idType', 'idNumber'];
        const values = [person.name, person.age, person.gender, person.idType, person.idNumber];

        let input;
        if (isFullForm) {
            input = document.querySelector(`input[name="${fullFields[field]}"][id="${index}"]`);
        } else {
            const containers = document.querySelectorAll('.pilDetails_mainContainer__HPFSL');
            if (containers[index]) {
                input = containers[index].querySelector(`input[name="${limitedFields[field]}"]`);
            }
        }

        if (!input && isLimitedForm) {
            if (field === 0) {
                input = document.querySelectorAll('input[name="name"]')[index];
            } else if (field === 1) {
                input = document.querySelectorAll('input[name="age"]')[index];
            }
            if (!input) return fillNextField(data, index, field + 1);
        }

        if (input.hasAttribute('disabled')) {
            input.removeAttribute('disabled');
        }

        const next = () => {
            if (field + 1 < fullFields.length) {
                fillNextField(data, index, field + 1);
            } else {
                setTimeout(() => fillNextField(data, index + 1, 0), 200);
            }
        };

        if ((fullFields[field] === 'gender' || fullFields[field] === 'photoIdType' ||
             limitedFields[field] === 'gender' || limitedFields[field] === 'idType')) {
            selectDropdownValue(input, values[field], next);
        } else {
            simulateTyping(input, String(values[field]), next);
        }
    }

    function fillGeneralDetails(meta) {
        const fields = {
            'pilgrimEmail': meta.email,
            'email': meta.email,
            'pilgrimCity': meta.city,
            'city': meta.city,
            'pilgrimState': meta.state,
            'state': meta.state,
            'pilgrimCountry': meta.country,
            'country': meta.country,
            'pilgrimPincode': meta.pincode,
            'pincode': meta.pincode,
            'vpaId': meta.vpaId
        };

        let filledCount = 0;
        const totalFields = Object.keys(fields).filter(name => fields[name]).length;

        Object.entries(fields).forEach(([name, value]) => {
            if (!value) return;
            const input = document.querySelector(`input[name="${name}"]`) ||
                          document.querySelector(`input[label="${name.replace('pilgrim', '')}"]`);
            if (input) {
                if (name.includes('Email')) input.type = 'email';
                simulateTyping(input, value, () => {
                    filledCount++;
                    if (filledCount >= totalFields) {
                        clickContinueButton();
                    }
                });
            }
        });
    }

    // Mobile Number Handling
    function updateMobileDisplays(number) {
        if (!/^\d{10}$/.test(number)) return;

        localStorage.setItem('ttdLoginMobile', number);
        lastMobileNumber = number;

        const gmDisplay = document.getElementById('groupManagerMobileDisplay');
        if (gmDisplay) gmDisplay.textContent = 'Last OTP: ' + number;
    }

    function setupMobileNumberCapture() {
        document.querySelectorAll('button.login_loginbtn__BsrlK, button[id*="login"], button[type="submit"]').forEach(button => {
            if (!button.dataset.ttdListenerAdded) {
                button.dataset.ttdListenerAdded = "true";
                button.addEventListener('click', function() {
                    const form = button.closest('form, .login-popup, .modal');
                    const mobileInput = form?.querySelector('input[type="text"][maxlength="10"]');
                    if (mobileInput) {
                        const mobile = mobileInput.value.trim();
                        if (/^\d{10}$/.test(mobile)) updateMobileDisplays(mobile);
                    }
                });
            }
        });
    }

    // Main UI Creation
    function createUI() {
        const style = document.createElement('style');
        style.textContent = `
            .ttd-input {
                padding: 6px 8px;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 14px;
                width: 100%;
                box-sizing: border-box;
                font-family: 'Segoe UI', sans-serif;
                transition: border-color 0.3s;
            }
            .ttd-input:focus {
                border-color: #007bff;
                outline: none;
            }
            .ttd-button {
                padding: 6px 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
            .ttd-button:hover {
                background-color: #0056b3;
            }
            .ttd-btn-danger {
                background-color: #dc3545;
            }
            .ttd-btn-danger:hover {
                background-color: #c82333;
            }
            .ttd-flex {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            .group-meta {
                background: #f0f8ff;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            .group-meta-row {
                display: flex;
                gap: 10px;
                margin-bottom: 8px;
            }
            .group-meta-row > div {
                flex: 1;
            }
            .meta-toggle {
                background: #e9ecef;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .meta-toggle:hover {
                background: #dee2e6;
            }
            .meta-toggle::after {
                content: "▼";
                font-size: 12px;
                transition: transform 0.2s;
            }
            .meta-toggle.collapsed::after {
                transform: rotate(-90deg);
            }
            .group-meta {
                background: #f0f8ff;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
                transition: all 0.3s ease;
                overflow: hidden;
                max-height: 500px;
            }
            .group-meta.collapsed {
                padding: 0;
                margin-bottom: 0;
                max-height: 0;
                opacity: 0;
            }
            .auto-click-toggle {
                display: flex;
                align-items: center;
                margin-left: 8px;
            }
            .auto-click-toggle label {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .auto-click-toggle .toggle-text {
                margin-right: 6px;
                font-size: 14px;
                color: #555;
            }
            .auto-click-toggle .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            .auto-click-toggle .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .auto-click-toggle .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            .auto-click-toggle .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            .auto-click-toggle input:checked + .slider {
                background-color: #2196F3;
            }
            .auto-click-toggle input:checked + .slider:before {
                transform: translateX(26px);
            }
            .quick-groups-container {
                position: fixed;
                left: 5px;
                top: 25%;
                transform: translateY(-50%);
                background: white;
                border: 1px solid #ddd;
                border-radius: 12px;
                padding: 15px;
                max-height: 70vh;
                overflow-y: auto;
                width: 200px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                z-index: 9998;
            }
            .quick-groups-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #eee;
            }
            .quick-groups-title {
                font-weight: bold;
                font-size: 14px;
                color: #333;
            }
            .quick-group-item {
                padding: 8px 10px;
                margin: 4px 0;
                color: white;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                font-size: 13px;
                transition: all 0.2s ease;
                user-select: none;
                background-color: #007bff;
            }
            .quick-group-item:hover {
                background: #0056b3;
                border-color: #007bff;
                cursor: pointer;
                color: white;
            }
            .quick-group-item:active {
                cursor: pointer;
                transform: scale(0.98);
            }
            .quick-group-item.dragging {
                opacity: 0.5;
                background: #007bff;
                color: white;
            }
            .current-group-display {
                background: #e8f5e8;
                padding: 8px 12px;
                border-radius: 6px;
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: bold;
                color: #2d5016;
                border-left: 4px solid #4caf50;
            }
            .no-group-selected {
                background: #fff3cd;
                color: #856404;
                border-left-color: #ffc107;
            }
        `;
        document.head.appendChild(style);

        let currentGroupKey = null;
        let rows = [];
        let groupMeta = {
            mobile: '',
            email: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            vpaId: ''
        };

        // Create Quick Groups Panel
        function createQuickGroupsPanel() {
            const quickGroupsPanel = document.createElement('div');
            quickGroupsPanel.className = 'quick-groups-container';
            quickGroupsPanel.id = 'quick-groups-panel';

            const header = document.createElement('div');
            header.className = 'quick-groups-header';

            const title = document.createElement('div');
            title.className = 'quick-groups-title';
            title.textContent = '🚀 Quick Groups';

            header.appendChild(title);
            quickGroupsPanel.appendChild(header);

            const groupsList = document.createElement('div');
            groupsList.id = 'quick-groups-list';
            quickGroupsPanel.appendChild(groupsList);

            document.body.appendChild(quickGroupsPanel);
            renderQuickGroups();

            // Make panel draggable
            makeDraggable(quickGroupsPanel);

            return quickGroupsPanel;
        }

        // Make element draggable
        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                if (e.target.classList.contains('quick-group-item')) return;

                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.transform = 'none';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // Render quick groups
        function renderQuickGroups() {
            const groupsList = document.getElementById('quick-groups-list');
            if (!groupsList) return;

            groupsList.innerHTML = '';

            let hasGroups = false;
            for (let i = 1; i <= MAX_GROUPS; i++) {
                const key = `group${i}`;
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (data.persons && data.persons.length) {
                    hasGroups = true;
                    const groupItem = document.createElement('div');
                    groupItem.className = 'quick-group-item';
                    groupItem.textContent = data.persons[0]?.name || `Group ${i}`;
                    groupItem.setAttribute('data-group-key', key);

                    groupItem.addEventListener('click', () => {
                        loadGroupIntoForm(key);
                    });

                    // Make group items draggable for reordering
                    groupItem.draggable = true;
                    groupItem.addEventListener('dragstart', handleDragStart);
                    groupItem.addEventListener('dragover', handleDragOver);
                    groupItem.addEventListener('drop', handleDrop);
                    groupItem.addEventListener('dragend', handleDragEnd);

                    groupsList.appendChild(groupItem);
                }
            }

            if (!hasGroups) {
                const noGroups = document.createElement('div');
                noGroups.textContent = 'No groups saved';
                noGroups.style.textAlign = 'center';
                noGroups.style.color = '#6c757d';
                noGroups.style.fontStyle = 'italic';
                groupsList.appendChild(noGroups);
            }
        }

        // Drag and drop functions for quick groups
        let draggedItem = null;

        function handleDragStart(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDrop(e) {
            e.stopPropagation();
            if (draggedItem !== this) {
                const groupsList = document.getElementById('quick-groups-list');
                const items = Array.from(groupsList.querySelectorAll('.quick-group-item'));
                const fromIndex = items.indexOf(draggedItem);
                const toIndex = items.indexOf(this);

                if (fromIndex < toIndex) {
                    groupsList.insertBefore(draggedItem, this.nextSibling);
                } else {
                    groupsList.insertBefore(draggedItem, this);
                }
            }
            return false;
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
            draggedItem = null;
        }

        // Load group into form
        function loadGroupIntoForm(groupKey) {
            const data = JSON.parse(localStorage.getItem(groupKey) || '{}');
            if (data.persons) {
                currentGroupKey = groupKey;
                groupMeta = {
                    mobile: data.mobile || '',
                    email: data.email || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || '',
                    pincode: data.pincode || '',
                    vpaId: data.vpaId || ''
                };

                // Update group selector
                const groupSelector = document.querySelector('#ttd-group-manager select');
                if (groupSelector) {
                    groupSelector.value = groupKey;
                }

                renderMetaForm();
                renderForm(data.persons || []);
                updateCurrentGroupDisplay(data.persons[0]?.name || groupKey, groupKey);

                // Auto-fill if on form page
                const isFormPage = document.querySelector('input[name="fname"], input[name="name"]') !== null;
                if (isFormPage) {
                    if (data.email || data.city || data.state || data.country || data.pincode) {
                        fillGeneralDetails(data);
                    }
                    setTimeout(() => fillNextField(data.persons), 300);
                }
            }
        }

        // Update current group display
        function updateCurrentGroupDisplay(groupName, groupKey) {
            let groupDisplay = document.getElementById('current-group-display');

            if (!groupDisplay) {
                groupDisplay = document.createElement('div');
                groupDisplay.id = 'current-group-display';
                groupDisplay.className = 'current-group-display';

                const panel = document.getElementById('ttd-group-manager');
                if (panel) {
                    panel.insertBefore(groupDisplay, panel.querySelector('select'));
                }
            }

            if (groupName && groupKey) {
                groupDisplay.textContent = `Current: ${groupName}`;
                groupDisplay.className = 'current-group-display';
            } else {
                groupDisplay.textContent = 'No group selected';
                groupDisplay.className = 'current-group-display no-group-selected';
            }
        }

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '👥 Groups';
        Object.assign(toggleBtn.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 10000
        });
        toggleBtn.className = 'ttd-button';
        document.body.appendChild(toggleBtn);

        // Create panel
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            background: '#fff',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '450px',
            fontFamily: 'Arial, sans-serif',
            display: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        });
        panel.id = 'ttd-group-manager';

        toggleBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        // Panel title with mobile number
        const title = document.createElement('div');
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.alignItems = 'center';
        title.style.marginBottom = '10px';

        const heading = document.createElement('h3');
        heading.textContent = '👥 Group Manager';
        heading.style.margin = '0';
        title.appendChild(heading);

        const mobileDisplay = document.createElement('span');
        mobileDisplay.id = 'groupManagerMobileDisplay';
        mobileDisplay.style.color = 'green';
        mobileDisplay.style.fontSize = '14px';
        mobileDisplay.style.marginLeft = '10px';
        mobileDisplay.textContent = lastMobileNumber ? 'Last OTP: ' + lastMobileNumber : '';
        title.appendChild(mobileDisplay);
        panel.appendChild(title);

        // Group selector dropdown
        const groupSelector = document.createElement('select');
        groupSelector.className = 'ttd-input';
        groupSelector.style.marginBottom = '10px';
        panel.appendChild(groupSelector);

        // Meta container
        const metaContainer = document.createElement('div');
        metaContainer.className = 'group-meta collapsed';
        panel.appendChild(metaContainer);

        // Add toggle button above metaContainer
        const metaToggle = document.createElement('div');
        metaToggle.className = 'meta-toggle collapsed';
        metaToggle.textContent = 'Address Details';
        metaToggle.addEventListener('click', () => {
            metaToggle.classList.toggle('collapsed');
            metaContainer.classList.toggle('collapsed');
        });
        panel.insertBefore(metaToggle, metaContainer);

        // Form container for person details
        const formContainer = document.createElement('div');
        panel.appendChild(formContainer);

        // Button row
        const btnRow = document.createElement('div');
        btnRow.style.marginTop = '12px';
        btnRow.className = 'ttd-flex';

        // Action buttons
        const addBtn = document.createElement('button');
        addBtn.innerHTML = '➕ <b>Add</b>';
        addBtn.className = 'ttd-button';
        addBtn.style.marginRight = '8px';

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '💾 <b>Save</b>';
        saveBtn.className = 'ttd-button';
        saveBtn.style.marginRight = '8px';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📤 Export';
        exportBtn.className = 'ttd-button';
        exportBtn.style.marginRight = '8px';

        const importBtn = document.createElement('button');
        importBtn.textContent = '📥 Import';
        importBtn.className = 'ttd-button';
        importBtn.style.marginRight = '8px';

        // Create auto-click toggle next to Import button
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'auto-click-toggle';

        const toggleLabel = document.createElement('label');
        toggleLabel.title = 'Auto-click Continue/Pay Now buttons every 10 seconds';

        const toggleText = document.createElement('span');
        toggleText.className = 'toggle-text';
        toggleText.textContent = '⟳';

        const toggleSwitch = document.createElement('label');
        toggleSwitch.className = 'switch';

        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.checked = autoClickActive;
        toggleCheckbox.addEventListener('change', function() {
            toggleAutoClick(this.checked);
        });

        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'slider';

        toggleSwitch.appendChild(toggleCheckbox);
        toggleSwitch.appendChild(toggleSlider);
        toggleLabel.appendChild(toggleText);
        toggleLabel.appendChild(toggleSwitch);
        toggleContainer.appendChild(toggleLabel);

        btnRow.appendChild(addBtn);
        btnRow.appendChild(saveBtn);
        btnRow.appendChild(exportBtn);
        btnRow.appendChild(importBtn);
        btnRow.appendChild(toggleContainer);
        panel.appendChild(btnRow);

        // Saved groups container
        const savedGroups = document.createElement('div');
        savedGroups.style.marginTop = '15px';
        panel.appendChild(savedGroups);

        function renderMetaForm() {
            metaContainer.innerHTML = '';
            metaContainer.classList.add('collapsed');
            metaToggle.classList.add('collapsed');

            // First row
            const row1 = document.createElement('div');
            row1.className = 'group-meta-row';

            const mobileInput = document.createElement('input');
            mobileInput.className = 'ttd-input group-mobile';
            mobileInput.value = groupMeta.mobile;
            mobileInput.placeholder = 'Mobile';
            mobileInput.maxLength = 10;
            mobileInput.oninput = function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            };

            const emailInput = document.createElement('input');
            emailInput.className = 'ttd-input group-email';
            emailInput.value = groupMeta.email;
            emailInput.placeholder = 'Email';
            emailInput.type = 'email';

            const cityInput = document.createElement('input');
            cityInput.className = 'ttd-input group-city';
            cityInput.value = groupMeta.city;
            cityInput.placeholder = 'City';

            row1.appendChild(createInputDiv('Mobile', mobileInput));
            row1.appendChild(createInputDiv('Email', emailInput));
            row1.appendChild(createInputDiv('City', cityInput));
            metaContainer.appendChild(row1);

            // Second row
            const row2 = document.createElement('div');
            row2.className = 'group-meta-row';

            const stateInput = document.createElement('input');
            stateInput.className = 'ttd-input group-state';
            stateInput.value = groupMeta.state;
            stateInput.placeholder = 'State';

            const countryInput = document.createElement('input');
            countryInput.className = 'ttd-input group-country';
            countryInput.value = groupMeta.country;
            countryInput.placeholder = 'Country';

            const pincodeInput = document.createElement('input');
            pincodeInput.className = 'ttd-input group-pincode';
            pincodeInput.value = groupMeta.pincode;
            pincodeInput.placeholder = 'Pincode';
            pincodeInput.maxLength = 6;
            pincodeInput.oninput = function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 6);
            };

            row2.appendChild(createInputDiv('State', stateInput));
            row2.appendChild(createInputDiv('Country', countryInput));
            row2.appendChild(createInputDiv('Pincode', pincodeInput));
            metaContainer.appendChild(row2);

            // Third row for VPA ID
            const row3 = document.createElement('div');
            row3.className = 'group-meta-row';

            const vpaInput = document.createElement('input');
            vpaInput.className = 'ttd-input group-vpaid';
            vpaInput.value = groupMeta.vpaId;
            vpaInput.placeholder = 'UPI/VPA ID';
            vpaInput.maxLength = 50;
            vpaInput.oninput = function() {
                this.value = this.value.trim();
            };

            const vpaDiv = createInputDiv('UPI/VPA ID', vpaInput);
            vpaDiv.style.flex = '1 0 100%';
            row3.appendChild(vpaDiv);
            metaContainer.appendChild(row3);
        }

        function createInputDiv(label, input) {
            const div = document.createElement('div');
            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            div.appendChild(labelEl);
            div.appendChild(input);
            return div;
        }

        function renderForm(data = []) {
            formContainer.innerHTML = '';
            rows = [];

            data.forEach(person => {
                const row = document.createElement('div');
                row.className = 'ttd-flex';
                row.style.marginBottom = '6px';

                const name = document.createElement('input');
                name.placeholder = 'Name';
                name.value = person.name || '';
                name.maxLength = 25;
                name.className = 'ttd-input';
                name.style.width = '30%';
                name.oninput = () => {
                    name.value = name.value.toUpperCase().replace(/[^A-Z ]/g, '').slice(0, 25);
                };

                const age = document.createElement('input');
                age.placeholder = 'Age';
                age.type = 'number';
                age.value = person.age || '';
                age.className = 'ttd-input';
                age.style.width = '10%';
                age.oninput = () => {
                    age.value = age.value.replace(/\D/g, '').slice(0, 2);
                };

                const gender = document.createElement('select');
                gender.innerHTML = `
                    <option value="Male" ${person.gender === 'Male' ? 'selected' : ''}>M</option>
                    <option value="Female" ${person.gender === 'Female' ? 'selected' : ''}>F</option>
                `;
                gender.className = 'ttd-input';
                gender.style.width = '15%';

                const idType = document.createElement('select');
                idType.innerHTML = `
                    <option value="Aadhaar Card" ${person.idType === 'Aadhaar Card' ? 'selected' : ''}>ADHAR</option>
                    <option value="Passport" ${person.idType === 'Passport' ? 'selected' : ''}>PASSPORT</option>
                `;
                idType.className = 'ttd-input';
                idType.style.width = '15%';

                const id = document.createElement('input');
                id.placeholder = 'ID Number';
                id.value = person.idNumber || '';
                id.maxLength = 12;
                id.type = 'text';
                id.className = 'ttd-input';
                id.style.width = '30%';
                id.style.fontFamily = 'monospace';
                id.style.letterSpacing = '1px';
                id.oninput = () => {
                    id.value = id.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
                };

                row.appendChild(name);
                row.appendChild(age);
                row.appendChild(gender);
                row.appendChild(idType);
                row.appendChild(id);
                formContainer.appendChild(row);

                rows.push({ name, age, gender, idType, id });
            });
        }

        function renderGroupSelector() {
            groupSelector.innerHTML = '';
            const newOpt = document.createElement('option');
            newOpt.value = 'new';
            newOpt.textContent = '➕ New Group';
            groupSelector.appendChild(newOpt);

            for (let i = 1; i <= MAX_GROUPS; i++) {
                const key = `group${i}`;
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (data.persons && data.persons.length) {
                    const opt = document.createElement('option');
                    opt.value = key;
                    opt.textContent = data.persons[0]?.name || `Group ${i}`;
                    groupSelector.appendChild(opt);
                }
            }
        }

        groupSelector.onchange = () => {
            const selected = groupSelector.value;
            if (selected === 'new') {
                currentGroupKey = null;
                groupMeta = {
                    mobile: '',
                    email: '',
                    city: '',
                    state: '',
                    country: '',
                    pincode: '',
                    vpaId: ''
                };
                renderMetaForm();
                renderForm([{ name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '' }]);
                updateCurrentGroupDisplay(null, null);
            } else {
                currentGroupKey = selected;
                const data = JSON.parse(localStorage.getItem(currentGroupKey) || {});
                groupMeta = {
                    mobile: data.mobile || '',
                    email: data.email || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || '',
                    pincode: data.pincode || '',
                    vpaId: data.vpaId || ''
                };
                renderMetaForm();
                renderForm(data.persons || []);
                updateCurrentGroupDisplay(data.persons[0]?.name || selected, selected);
            }
            metaContainer.classList.remove('collapsed');
            metaToggle.classList.remove('collapsed');
        };

        function renderSavedGroups() {
            savedGroups.innerHTML = '<b>📁 Saved Groups:</b><br>';
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '6px';

            let count = 0;
            for (let i = 1; i <= MAX_GROUPS; i++) {
                const key = `group${i}`;
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (data.persons && data.persons.length) {
                    const groupBox = document.createElement('div');
                    groupBox.style.display = 'flex';
                    groupBox.style.alignItems = 'center';
                    groupBox.style.gap = '4px';
                    groupBox.style.flex = '1 0 35%';
                    groupBox.style.marginBottom = '6px';

                    const fillBtn = document.createElement('button');
                    fillBtn.textContent = `${++count}. ${data.persons[0]?.name || key}`;
                    fillBtn.className = 'ttd-button';
                    fillBtn.style.flex = '1';
                    fillBtn.onclick = () => {
                        if (data.persons) {
                            if (data.email || data.city || data.state || data.country || data.pincode) {
                                fillGeneralDetails(data);
                            }
                            setTimeout(() => fillNextField(data.persons), 300);
                        }
                    };

                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'X';
                    delBtn.className = 'ttd-button ttd-btn-danger';
                    delBtn.onclick = () => {
                        if (confirm(`Delete group ${data.persons[0]?.name || key}?`)) {
                            localStorage.removeItem(key);
                            renderGroupSelector();
                            renderSavedGroups();
                            renderQuickGroups();
                            groupSelector.value = 'new';
                            currentGroupKey = null;
                            renderForm();
                            updateCurrentGroupDisplay(null, null);
                        }
                    };

                    groupBox.appendChild(fillBtn);
                    groupBox.appendChild(delBtn);
                    container.appendChild(groupBox);
                }
            }

            savedGroups.appendChild(container);
        }

        // Button event handlers
        addBtn.onclick = () => {
            const data = rows.map(r => ({
                name: r.name.value,
                age: r.age.value,
                gender: r.gender.value,
                idType: r.idType.value,
                idNumber: r.id.value
            }));
            if (data.length >= 6) return alert('⚠️ Max 6 persons allowed!');
            data.push({ name: '', age: '', gender: 'Male', idType: 'Aadhaar Card', idNumber: '' });
            renderForm(data);
        };

        saveBtn.onclick = () => {
            // Get meta data
            groupMeta = {
                mobile: document.querySelector('.group-mobile').value,
                email: document.querySelector('.group-email').value,
                city: document.querySelector('.group-city').value,
                state: document.querySelector('.group-state').value,
                country: document.querySelector('.group-country').value,
                pincode: document.querySelector('.group-pincode').value,
                vpaId: document.querySelector('.group-vpaid')?.value || ''
            };

            // Validate mobile
            if (!/^\d{10}$/.test(groupMeta.mobile)) {
                return alert('⚠️ Please enter a valid 10-digit mobile number');
            }

            // Validate email if provided
            if (groupMeta.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(groupMeta.email)) {
                return alert('⚠️ Please enter a valid email address');
            }

            // Get person data
            const persons = rows.map(r => ({
                name: r.name.value,
                age: r.age.value,
                gender: r.gender.value,
                idType: r.idType.value,
                idNumber: r.id.value
            })).filter(p => p.name.trim());

            if (!persons.length) return alert('⚠️ No person data to save!');
            if (persons.length > 6) return alert('⚠️ Max 6 persons allowed!');

            let saveKey = currentGroupKey;
            if (!saveKey) {
                for (let i = 1; i <= MAX_GROUPS; i++) {
                    const key = `group${i}`;
                    if (!localStorage.getItem(key)) {
                        saveKey = key;
                        break;
                    }
                }
            }

            if (!saveKey) return alert('❌ All 10 groups are full. Delete one to save new.');

            // Save both meta and person data
            localStorage.setItem(saveKey, JSON.stringify({
                ...groupMeta,
                persons
            }));

            renderGroupSelector();
            renderSavedGroups();
            renderQuickGroups();
            groupSelector.value = saveKey;
            currentGroupKey = saveKey;
            updateCurrentGroupDisplay(persons[0]?.name || saveKey, saveKey);
            alert('✅ Group saved!');
        };

        exportBtn.onclick = () => {
            const allGroups = {};
            for (let i = 1; i <= MAX_GROUPS; i++) {
                const key = `group${i}`;
                const data = localStorage.getItem(key);
                if (data) allGroups[key] = JSON.parse(data);
            }
            const blob = new Blob([JSON.stringify(allGroups, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ttd_groups_backup.json';
            a.click();
            URL.revokeObjectURL(url);
        };

        importBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = () => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const imported = JSON.parse(reader.result);
                        let count = 0;
                        for (let i = 1; i <= MAX_GROUPS; i++) {
                            const key = `group${i}`;
                            if (imported[key]) {
                                localStorage.setItem(key, JSON.stringify(imported[key]));
                                count++;
                            }
                        }
                        alert(`✅ Imported ${count} groups!`);
                        renderGroupSelector();
                        renderSavedGroups();
                        renderQuickGroups();
                    } catch (e) {
                        alert('❌ Invalid file!');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };

        // Initial render
        renderGroupSelector();
        renderMetaForm();
        renderSavedGroups();
        renderForm();
        document.body.appendChild(panel);

        // Create quick groups panel
        createQuickGroupsPanel();

        // Initialize auto-click if it was active
        if (autoClickActive) {
            toggleAutoClick(true);
        }
    }

    // Initialize everything
    window.addEventListener('load', () => {
        setTimeout(() => {
            createUI();
            setupMobileNumberCapture();

            // Observer for dynamic content
            const observer = new MutationObserver(() => {
                setupMobileNumberCapture();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Fallback check every second
            setInterval(setupMobileNumberCapture, 1000);
        }, 1500);
    });

    // Hide dynamic dialog boxes
    function hideDynamicDialogBox() {
        const dialogBox = document.querySelector('[class*="DialogBox_container"]');
        if (dialogBox) dialogBox.style.display = 'none';
    }

    setInterval(hideDynamicDialogBox, 1000);

    // Create the button
    const button = document.createElement('button');
    button.textContent = '🗙';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#f44336';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Arial, sans-serif';
    button.style.fontWeight = 'bold';

    // Hover effects
    button.addEventListener('mouseover', () => button.style.backgroundColor = '#d32f2f');
    button.addEventListener('mouseout', () => button.style.backgroundColor = '#f44336');

    // Click action
    button.addEventListener('click', () => {
        // Remove localStorage item
        localStorage.removeItem('user-access');

        // Force a hard reload (bypass cache)
        window.location.reload(true);
    });

    // Add button to the page
    document.body.appendChild(button);
})();