// ==UserScript==
// @name         Taskonator_Beta
// @namespace    http://tampermonkey.net/
// @version      1.5.6
// @description  Pomocne narzędzia dla Ship Lead KTW1
// @author       @Stockton
// @match        https://fclm-portal.amazon.com/employee/*
// @match        https://fclm-portal.amazon.com/reports/timeOnTask*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536774/Taskonator_Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/536774/Taskonator_Beta.meta.js
// ==/UserScript==

//Obsługa taskonatora na stronie pracownika w fclm
(function(Taskalfa) {
    if(location.href.indexOf("https://fclm-portal.amazon.com/employee") >-1) {
        let sekcje = {
            'Lead': [
                {nazwa: 'LSHIP', tekst: 'LSHIP'},
                {nazwa: 'SHIPCL', tekst: 'SHIPCL'},
                {nazwa: 'TSO Clerk', tekst: 'SHPCL'},
                {nazwa: 'FACJAN', tekst: 'FACJAN'}
            ],
            'PPJ': [
                {nazwa: 'OVRFLW', tekst: 'OVRFLW'},
                {nazwa: 'DOCKPL', tekst: 'DOCKPL'},
            ],
            'Ship': [
                {nazwa: 'UISFLTWR', tekst: 'UISFLTWR'},
                {nazwa: 'PRGSHIP', tekst: 'PRGSHIP'},
                {nazwa: 'Offline Mods', tekst: 'OFFMODXO'}
            ],
            'TSO': [
                {nazwa: 'TRFOCR', tekst: 'TRFOCR'},
                {nazwa: 'TSO Clerk', tekst: 'SHPCL'}
            ],
            'Crits': [
                {nazwa: 'TOTOL', tekst: 'TOTOL'},
                {nazwa: 'ROPER', tekst: 'ROPER'},
                {nazwa: 'ROBWS', tekst: 'ROBWS'},
                {nazwa: 'TOWTSP', tekst: 'TOWTSP'}
            ],
            'STOPY': [
                {nazwa: 'MSTOP', tekst: 'MSTOP'},
                {nazwa: 'ISTOP ', tekst: 'ISTOP'},
            ],
            'Spotkania': [
                {nazwa: 'EMP', tekst: 'OPSEMPENG'}
            ],
            'X-TRAIN': [
                {nazwa: 'Instruktor', tekst: 'SAMB'},
                {nazwa: 'Trening', tekst: 'SHPTR'},
            ],
        };

        function saveToLocalStorage() {
            localStorage.setItem('taskonatorConfig', JSON.stringify(sekcje));
        }

        function loadFromLocalStorage() {
            const saved = localStorage.getItem('taskonatorConfig');
            if (saved) {
                sekcje = JSON.parse(saved);
            }
        }

        function sendRequest(taskCode) {
            const badgeElement = document.getElementsByClassName("list-side-by-side")[0].children[5].innerText;
            showCustomDialog(taskCode);

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    "Priority": "u=0, i"
                },
                data: `warehouseId=KTW1&calmCode=${taskCode}&trackingBadgeId=${badgeElement}`,
                anonymous: false,
                withCredentials: true,
                onload: function(response) {
                    localStorage.setItem('lastTaskCode', taskCode);
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                },
                onerror: function(error) {
                    console.log('Error:', error);
                    showCustomDialog(" NO KURDI JEDNAK NIE ZADZIAŁAŁO" );
                }
            });
        }

        function createManagementInterface() {
            const managementPanel = document.createElement('div');
            managementPanel.id = 'taskManagementPanel';
            managementPanel.style.backgroundColor = 'antiquewhite';
            managementPanel.style.padding = '15px';
            managementPanel.style.border = '1px solid #ccc';
            managementPanel.style.position = 'fixed';
            managementPanel.style.top = '50%';
            managementPanel.style.left = '50%';
            managementPanel.style.transform = 'translate(-50%, -50%)';
            managementPanel.style.zIndex = '2000';
            managementPanel.style.maxHeight = '80vh';
            managementPanel.style.overflowY = 'auto';

            const sectionForm = document.createElement('div');
            sectionForm.innerHTML = `
                <h3>Dodaj nową sekcję</h3>
                <input type="text" id="newSectionName" placeholder="Nazwa sekcji">
                <button id="addSectionBtn">Dodaj sekcję</button>

                <h3>Dodaj nowy task</h3>
                <select id="sectionSelect">
                    ${Object.keys(sekcje).map(section =>
                                              `<option value="${section}">${section}</option>`
                                             ).join('')}
                </select>
                <input type="text" id="newTaskName" placeholder="Nazwa taska">
                <input type="text" id="newTaskCode" placeholder="Kod taska">
                <button id="addTaskBtn">Dodaj task</button>

                <h3>Edytuj sekcję</h3>
                <select id="editSelect">
                    ${Object.keys(sekcje).map(section =>
                                              `<option value="${section}">${section}</option>`
                                             ).join('')}
                </select>
                <button id="editSectionBtn">Pokaż taski</button>
                <div id="taskList" style="margin-top: 10px;"></div>

                <h3>Usuń sekcję</h3>
                <select id="deleteSelect">
                    ${Object.keys(sekcje).map(section =>
                                              `<option value="${section}">${section}</option>`
                                             ).join('')}
                </select>
                <button id="deleteSectionBtn">Usuń sekcję</button>
            `;

            managementPanel.appendChild(sectionForm);

            setTimeout(() => {
                document.getElementById('addSectionBtn').addEventListener('click', () => {
                    const sectionName = document.getElementById('newSectionName').value;
                    if (sectionName) {
                        sekcje[sectionName] = [];
                        saveToLocalStorage();
                        refreshInterface();
                        managementPanel.remove();
                    }
                });

                document.getElementById('addTaskBtn').addEventListener('click', () => {
                    const section = document.getElementById('sectionSelect').value;
                    const taskName = document.getElementById('newTaskName').value;
                    const taskCode = document.getElementById('newTaskCode').value;

                    if (section && taskName && taskCode) {
                        sekcje[section].push({
                            nazwa: taskName,
                            tekst: taskCode
                        });
                        saveToLocalStorage();
                        refreshInterface();
                        managementPanel.remove();
                    }
                });

                document.getElementById('deleteSectionBtn').addEventListener('click', () => {
                    const section = document.getElementById('deleteSelect').value;
                    if (confirm(`Czy na pewno chcesz usunąć sekcję ${section}?`)) {
                        delete sekcje[section];
                        saveToLocalStorage();
                        refreshInterface();
                        managementPanel.remove();
                    }
                });

                document.getElementById('editSectionBtn').addEventListener('click', () => {
                    const section = document.getElementById('editSelect').value;
                    const taskList = document.getElementById('taskList');
                    taskList.innerHTML = '<h4>Taski w sekcji ' + section + ':</h4>';

                    if (sekcje[section] && sekcje[section].length > 0) {
                        const taskTable = document.createElement('table');
                        taskTable.style.width = '100%';
                        taskTable.style.borderCollapse = 'collapse';
                        taskTable.style.marginTop = '10px';

                        taskTable.innerHTML = `
                            <tr style="background-color: #f0f0f0;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Nazwa</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Kod</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Akcje</th>
                            </tr>
                        `;

                        sekcje[section].forEach((task, index) => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td style="border: 1px solid #ddd; padding: 8px;">${task.nazwa}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${task.tekst}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                <button class="delete-task-btn">Usuń</button>
                                </td>
                            `;
                            taskTable.appendChild(row);
                            const deleteBtn = row.querySelector('.delete-task-btn');
                            deleteBtn.addEventListener('click', () => deleteTask(section, index));
                            taskTable.appendChild(row);
                        });

                        taskList.appendChild(taskTable);
                    } else {
                        taskList.innerHTML += '<p>Brak tasków w tej sekcji</p>';
                    }
                });
            }, 0);

            return managementPanel;
        }

        function deleteTask(section, index) {
            if (confirm('Czy na pewno chcesz usunąć ten task?')) {
                sekcje[section].splice(index, 1);
                saveToLocalStorage();
                refreshInterface();
                document.getElementById('editSectionBtn').click();
            }
        };

        function refreshInterface() {
            const container = document.getElementById('Taskonator_MENU');
            container.innerHTML = '';

            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️ Edytuj sekcje';
            editButton.style.marginBottom = '10px';

            editButton.addEventListener('click', () => {
                const existingPanel = document.getElementById('taskManagementPanel');

                if (existingPanel) {
                    existingPanel.remove();
                    editButton.innerHTML = '✏️ Edytuj sekcje';
                } else {
                    document.body.appendChild(createManagementInterface());
                    editButton.innerHTML = '❌ Zamknij menu';
                }
            });
            container.appendChild(editButton);

            for (let [nazwa, przyciski] of Object.entries(sekcje)) {
                const sekcja = document.createElement('div');
                sekcja.style.marginBottom = '10px';

                const naglowek = document.createElement('div');
                naglowek.innerHTML = `<strong>${nazwa}</strong>`;
                naglowek.style.marginBottom = '5px';
                naglowek.style.fontSize = '16px';
                naglowek.style.color = '#cc0033';
                naglowek.style.fontWeight = 'bold';
                naglowek.style.padding = '5px 0';
                naglowek.style.borderBottom = '1px solid #ccc';
                naglowek.style.marginBottom = '7px';
                naglowek.style.fontFamily = 'Ember, Arial, sans-serif';
                sekcja.appendChild(naglowek);

                const przyciskiContainer = document.createElement('div');
                przyciskiContainer.style.marginLeft = '7px';

                przyciski.forEach(przycisk => {
                    const btn = document.createElement('button');
                    btn.innerHTML = przycisk.nazwa;
                    btn.onclick = () => sendRequest(przycisk.tekst);
                    btn.style.marginRight = '3px';
                    btn.style.marginBottom = '3px';
                    btn.style.fontSize = '10px';
                    btn.style.padding = '2px 3px';
                    przyciskiContainer.appendChild(btn);
                });

                sekcja.appendChild(przyciskiContainer);
                container.appendChild(sekcja);
            }
        }

        function showCustomDialog(taskCode) {
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 9999;
            `;
            dialog.innerHTML = `
                <p>Pracownik został zataskowany na: ${taskCode}</p>
                <button onclick="this.parentElement.remove()">OK</button>
            `;
            document.body.appendChild(dialog);
        }

        // Inicjalizacja interfejsu
        const container = document.createElement('div');
        container.id = "Taskonator_MENU";
        container.style.position = 'absolute';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'antiquewhite';
        container.style.padding = '10px';

        const contentpanel = document.getElementById("content-panel");
        contentpanel.style.maxWidth = 'max-content';

        const controlpanel = document.getElementById("control-panel");
        controlpanel.style.maxWidth = 'inherit';

        const mainpanel = document.getElementById("main-panel");
        mainpanel.style.minHeight = '750px';

        loadFromLocalStorage();
        const mainPanel = document.querySelector('#main-panel') || document.body;
        mainPanel.insertBefore(container, mainPanel.firstChild);
        refreshInterface();
    }
})();

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//obsługa podświetleń managera w TOT
(function(menagerohighliter) {
    if(location.href.indexOf("https://fclm-portal.amazon.com/reports/timeOnTask")>-1)
    {
        const STORAGE_KEY = 'selectedManagers';
        const HIGHLIGHT_COLOR = 'yellow';
        //Selektory DOM i często używane elementy pamięci podręcznej
        const selectors = {
            rows: () => document.querySelectorAll('tr'),
            totFilters: () => document.querySelector('.tot-filters'),
            checkedBoxes: () => document.querySelectorAll('input[type="checkbox"]:checked')
        };
        //Przechwytywacz pamięci
        const storage = {
            save: (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
            get: () => {
                try {
                    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
                } catch {
                    return [];
                }
            }
        };
        // Tworzenie menu ze stylistyką
        const createUIElement = {
            button: () => {
                const button = document.createElement('button');
                Object.assign(button.style, {
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginLeft: '10px'
                });
                button.innerHTML = '⚙️';
                button.title = 'Toggle Manager Selection';
                return button;
            },
            container: () => {
                const container = document.createElement('div');

                Object.assign(container.style, {
                    position: 'fixed',
                    top: '50px',
                    right: '10px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    zIndex: '9998',
                    display: 'none',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                });
                return container;
            }
        };
        // Stworzenie (i aktualizacja) listy manago
        const getUniqueManagers = (() => {
            let cached = null;
            return () => {
                if (cached) return cached;

                const managers = new Set();
                selectors.rows().forEach(row => {
                    const manager = row.cells[2]?.textContent;
                    if (manager) managers.add(manager);
                });
                cached = Array.from(managers).sort();
                cached = cached.slice(1);
                return cached;
            };
        })();
        const highlightManagerRows = (() => {
            let timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const selectedManagers = new Set(
                        Array.from(selectors.checkedBoxes()).map(cb => cb.value)
                    );

                    selectors.rows().forEach(row => {
                        const manager = row.cells[2]?.textContent;
                        row.style.backgroundColor = selectedManagers.has(manager) ? HIGHLIGHT_COLOR : '';
                    });

                    storage.save(Array.from(selectedManagers));
                }, 50);
            };
        })();
        function createManagerList() {
            const container = createUIElement.container();
            const savedManagers = new Set(storage.get());

            const header = document.createElement('div');
            header.textContent = 'Select managers to highlight:';
            header.style.marginBottom = '10px';
            header.style.fontWeight = 'bold';
            container.appendChild(header);

            const fragment = document.createDocumentFragment();
            getUniqueManagers().forEach(manager => {
                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                const label = document.createElement('label');

                checkbox.type = 'checkbox';
                checkbox.id = `manager-${manager}`;
                checkbox.value = manager;
                checkbox.checked = savedManagers.has(manager);
                checkbox.addEventListener('change', highlightManagerRows);

                label.htmlFor = checkbox.id;
                label.textContent = manager;
                label.style.marginLeft = '5px';

                div.appendChild(checkbox);
                div.appendChild(label);
                fragment.appendChild(div);
            });

            container.appendChild(fragment);
            document.body.appendChild(container);
            return container;
        }
        function init() {
            const button = createUIElement.button();
            const managerList = createManagerList();

            selectors.totFilters()?.appendChild(button);

            button.addEventListener('click', () => {
                managerList.style.display = managerList.style.display === 'none' ? 'block' : 'none';
            });

            highlightManagerRows();
        }

        // Wysrtuj kiedy DOM się załaduje
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }})();