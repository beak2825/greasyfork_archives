// ==UserScript==
// @name         Bitrix24 Smart Process Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет меню смарт-процессов в Bitrix24 с настройками
// @author       DevCRM
// @match        https://*.bitrix24.ru/*
// @match        http://*.bitrix24.ru/*
// @icon         https://www.bitrix24.ru/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/537502/Bitrix24%20Smart%20Process%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/537502/Bitrix24%20Smart%20Process%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = window.location.origin;
    const MAX_SMART_PROCESSES = 5;
    const STORAGE_KEY = 'selectedProcesses';

    const colorSchemes = {
        "Лиды": ["#D6EAF8", "#85C1E9", "#3498DB"],
        "Сделки": ["#FADBD8", "#F5B7B1", "#E74C3C"],
        "Контакты": ["#D5F5E3", "#82E0AA", "#27AE60"],
        "Компании": ["#EBDEF0", "#D2B4DE", "#9B59B6"],
        "default": ["#FDEBD0", "#F8C471", "#F39C12"]
    };

    const style = document.createElement('style');
    style.textContent = `
        .custom-icon-menu,
        .custom-icon-menu div,
        .custom-icon-menu span {
            font-family: 'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;
        }
    `;
    document.head.appendChild(style);

    function initStorage() {
        if (!GM_getValue(STORAGE_KEY)) {
            GM_setValue(STORAGE_KEY, []);
        }
    }

    function createSettingsMenu(allProcesses) {
        const selected = GM_getValue(STORAGE_KEY, []);

        const settings = document.createElement('div');
        settings.style.position = 'fixed';
        settings.style.top = '50%';
        settings.style.left = '50%';
        settings.style.transform = 'translate(-50%, -50%)';
        settings.style.backgroundColor = 'white';
        settings.style.padding = '20px';
        settings.style.borderRadius = '8px';
        settings.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
        settings.style.zIndex = '9999';
        settings.style.maxHeight = '80vh';
        settings.style.overflowY = 'auto';
        settings.style.width = '500px';

        const title = document.createElement('h3');
        title.textContent = 'Выберите смарт-процессы для отображения';
        title.style.marginTop = '0';
        settings.appendChild(title);

        const processList = document.createElement('div');
        processList.style.marginBottom = '15px';

        allProcesses.forEach(process => {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `process-${process.id}`;
            checkbox.checked = selected.includes(process.id);
            checkbox.style.marginRight = '10px';

            const label = document.createElement('label');
            label.htmlFor = `process-${process.id}`;
            label.textContent = process.title;
            label.style.cursor = 'pointer';

            container.appendChild(checkbox);
            container.appendChild(label);
            processList.appendChild(container);
        });

        settings.appendChild(processList);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Сохранить';
        saveBtn.style.padding = '8px 16px';
        saveBtn.style.backgroundColor = '#3498DB';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';

        saveBtn.onclick = () => {
            const selectedProcesses = [];
            allProcesses.forEach(process => {
                const checkbox = document.getElementById(`process-${process.id}`);
                if (checkbox.checked) {
                    selectedProcesses.push(process.id);
                }
            });

            GM_setValue(STORAGE_KEY, selectedProcesses.slice(0, MAX_SMART_PROCESSES));
            settings.remove();
            location.reload();
        };

        settings.appendChild(saveBtn);
        document.body.appendChild(settings);
    }

    function createIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("class", "custom-icon");
        svg.style.cursor = "pointer";
        svg.style.width = "32px";
        svg.style.height = "32px";

        const colors = [
            { fill: "#ff8906", d: "M6.514 6.515h4.8v4.8h-4.8z" },
            { fill: "#f25f4c", d: "M6.514 12.687h4.8v4.8h-4.8z" },
            { fill: "#e53170", d: "M12.685 6.515h4.8v4.8h-4.8z" },
            { fill: "#0f0e17", d: "M12.685 12.687h4.8v4.8h-4.8z" }
        ];

        colors.forEach(color => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", color.fill);
            path.setAttribute("fill-rule", "evenodd");
            path.setAttribute("d", color.d);
            path.setAttribute("clip-rule", "evenodd");
            svg.appendChild(path);
        });

        return svg;
    }

    function createSvgButton(text, color) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.style.width = "20px";
        svg.style.height = "20px";
        svg.style.marginRight = "8px";
        svg.style.cursor = "pointer";

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "10");
        circle.setAttribute("fill", color);
        svg.appendChild(circle);

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = text;
        svg.appendChild(title);

        return svg;
    }

    function createActionGroup(title, actions) {
        const group = document.createElement("div");
        group.style.marginBottom = "15px";
        group.style.breakInside = "avoid-column";

        const groupTitle = document.createElement("div");
        groupTitle.textContent = title;
        groupTitle.style.fontWeight = "600";
        groupTitle.style.marginBottom = "5px";
        groupTitle.style.paddingBottom = "5px";
        groupTitle.style.borderBottom = `2px solid ${colorSchemes[title] ? colorSchemes[title][2] : colorSchemes.default[2]}`;
        groupTitle.style.color = "#2C3E50";
        group.appendChild(groupTitle);

        const colors = colorSchemes[title] || colorSchemes.default;

        actions.forEach((action, index) => {
            const button = document.createElement("div");
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.padding = "8px 12px";
            button.style.margin = "4px 0";
            button.style.cursor = "pointer";
            button.style.borderRadius = "4px";
            button.style.transition = "all 0.2s";

            button.onmouseover = () => {
                button.style.backgroundColor = "#f5f5f5";
                button.style.transform = "translateX(2px)";
            };
            button.onmouseout = () => {
                button.style.backgroundColor = "transparent";
                button.style.transform = "translateX(0)";
            };

            const svgBtn = createSvgButton(action.text, colors[index % colors.length]);
            button.appendChild(svgBtn);

            const actionText = document.createElement("span");
            actionText.textContent = action.text;
            actionText.style.color = "#34495E";
            button.appendChild(actionText);

            button.onclick = () => window.location.href = domain + action.url;

            group.appendChild(button);
        });

        return group;
    }

    async function createDropdownMenu() {
        return new Promise((resolve) => {
            BX.rest.callMethod('crm.type.list', {}, (result) => {
                try {
                    const menu = document.createElement("div");
                    menu.className = "custom-icon-menu";
                    menu.style.position = "absolute";
                    menu.style.backgroundColor = "#fff";
                    menu.style.border = "1px solid #ddd";
                    menu.style.borderRadius = "6px";
                    menu.style.padding = "15px";
                    menu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    menu.style.zIndex = "1000";
                    menu.style.display = "none";
                    menu.style.top = "100%";
                    menu.style.right = "0";
                    menu.style.width = "850px";
                    menu.style.maxHeight = "70vh";
                    menu.style.overflowY = "auto";
                    menu.style.columnCount = "3";
                    menu.style.columnGap = "25px";


                    // Стандартные группы
                    const standardGroups = [
                        {
                            title: "Лиды",
                            actions: [
                                { text: "Перейти", url: "/crm/lead/list/" },
                                { text: "Поля", url: "/crm/configs/fields/CRM_LEAD/" },
                                { text: "Бизнес-процессы", url: "/crm/configs/bp/CRM_LEAD/" }
                            ]
                        },
                        {
                            title: "Сделки",
                            actions: [
                                { text: "Перейти", url: "/crm/deal/list/" },
                                { text: "Поля", url: "/crm/configs/fields/CRM_DEAL/" },
                                { text: "Бизнес-процессы", url: "/crm/configs/bp/CRM_DEAL/" }
                            ]
                        },
                        {
                            title: "Контакты",
                            actions: [
                                { text: "Перейти", url: "/crm/contact/list/" },
                                { text: "Поля", url: "/crm/configs/fields/CRM_CONTACT/" },
                                { text: "Бизнес-процессы", url: "/crm/configs/bp/CRM_CONTACT/" }
                            ]
                        },
                        {
                            title: "Компании",
                            actions: [
                                { text: "Перейти", url: "/crm/company/list/" },
                                { text: "Поля", url: "/crm/configs/fields/CRM_COMPANY/" },
                                { text: "Бизнес-процессы", url: "/crm/configs/bp/CRM_COMPANY/" }
                            ]
                        }
                    ];

                    standardGroups.forEach(group => {
                        menu.appendChild(createActionGroup(group.title, group.actions));
                    });

                    // Обработка смарт-процессов
                    if (result && result.data()) {
                        const allProcesses = result.data().types || [];
                        const selectedIds = GM_getValue(STORAGE_KEY, []);
                        let processes = allProcesses.filter(p => selectedIds.includes(p.id));

                        if (processes.length === 0) {
                            processes = allProcesses.slice(0, MAX_SMART_PROCESSES);
                        }

                        processes.forEach(process => {
                            const actions = [
                                { text: "Перейти", url: `/crm/type/${process.entityTypeId}/` },
                                { text: "Поля", url: `/settings/configs/userfield_list.php?moduleId=crm&entityId=CRM_${process.id}` },
                                { text: "Бизнес-процессы", url: `/crm/configs/bp/CRM_DYNAMIC_${process.entityTypeId}/` }
                            ];
                            menu.appendChild(createActionGroup(process.title, actions));
                        });
                    }

                    resolve(menu);
                } catch (error) {
                    console.error('Error creating dropdown menu:', error);
                    // Возвращаем пустое меню в случае ошибки
                    const emptyMenu = document.createElement("div");
                    emptyMenu.className = "custom-icon-menu";
                    emptyMenu.style.display = "none";
                    resolve(emptyMenu);
                }
            });
        });
    }

    async function replaceElement() {
        const targetElement = document.querySelector(".air-header__logo");
        if (!targetElement) return;

        if (targetElement.classList.contains('custom-element-replaced')) return;

        const container = document.createElement("div");
        container.className = "custom-element-container";
        container.style.position = "relative";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.height = "100%";

        const icon = createIcon();
        const dropdown = await createDropdownMenu();

        icon.onclick = function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        };

        document.addEventListener("click", function(e) {
            if (!container.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });

        container.appendChild(icon);
        container.appendChild(dropdown);

        targetElement.innerHTML = "";
        targetElement.appendChild(container);
        targetElement.classList.add('custom-element-replaced');
        targetElement.style.cursor = "pointer";
    }

    function init() {
        initStorage();

        GM_registerMenuCommand("Настроить смарт-процессы", () => {
            BX.rest.callMethod('crm.type.list', {}, (result) => {
                if (result && result.data()) {
                    createSettingsMenu(result.data().types);
                }
            });
        });

        replaceElement();

        const observer = new MutationObserver(function(mutations) {
            replaceElement();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setTimeout(init, 2000);
    window.addEventListener('load', init);
})();