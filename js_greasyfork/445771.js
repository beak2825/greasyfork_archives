// ==UserScript==
// @name         More Ore - Enhanced Save
// @namespace    https://syns.studio/more-ore/
// @version      1.1.2
// @description  Automatically tries to export save to a file every 1+ hours (customizable)
// @author       123HD123
// @match        https://syns.studio/more-ore/
// @icon         https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @require      https://greasyfork.org/scripts/444840-more-ore-notification/code/More%20Ore%20-%20Notification+.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445771/More%20Ore%20-%20Enhanced%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/445771/More%20Ore%20-%20Enhanced%20Save.meta.js
// ==/UserScript==
(function () {
    const MOD_NAME = "Enhanced Save";
    const MOD_ID = "enhancedSave";
    const MOD_STORAGE_DEFAULT = {
        intervals: [],
        mutationObservers: [],
        settings: [{
                id: "askBeforeExport",
                text: "Ask before auto export",
                value: true,
                type: "checkbox"
            },
            {
                id: "autoExportTo",
                text: "Automatically export to",
                value: "file",
                options: ["file", "clipboard"],
                type: "select"
            },
            {
                id: "exportInterval",
                text: "Export save every x hours",
                value: 1,
                type: "range"
            }
        ]
    };

    window.mods = window.mods || {};

    const Logger = NotificationPlus?.notify || console.log;
    if (Object.keys(window.mods).includes(MOD_NAME))
        return Logger(
            "Warning: Mod named " + MOD_NAME + " has already been loaded",
            3
        );

    NotificationPlus?.load(MOD_NAME);

    window.mods[MOD_NAME] = window.mods[MOD_NAME] || Object.assign({}, MOD_STORAGE_DEFAULT);

    const MOD_STORAGE = window.mods[MOD_NAME];

    if (MOD_STORAGE.intervals != [])
        MOD_STORAGE.intervals.forEach(interval => clearInterval(interval.id));

    MOD_STORAGE.intervals = [];

    MOD_STORAGE.settings = JSON.parse(localStorage.getItem(`${MOD_ID}_settings`)) ?? MOD_STORAGE_DEFAULT.settings.slice();
    
    let update = false;
    for(let setting of MOD_STORAGE_DEFAULT.settings) {
        if (MOD_STORAGE_DEFAULT.settings.length != MOD_STORAGE.settings.length) {
            update = true;
            break;
        }
        for(let key of Object.keys(setting)) {
            if (key == "value") continue;
            let index = MOD_STORAGE_DEFAULT.settings.indexOf(setting);
            if (setting[key] != MOD_STORAGE.settings[index][key] && typeof setting[key] != "object") update = true;
            else if (typeof setting[key] == "object") {
                for(let i in setting[key]) {
                    if (setting[key][i] != MOD_STORAGE.settings[index][key][i]) {
                        update = true;
                        break;
                    }
                }
            }
            if (update) break;
        }
        if (update) break;
    }

    if (update) MOD_STORAGE.settings = MOD_STORAGE_DEFAULT.settings.slice();
    
    localStorage.setItem(`${MOD_ID}_settings`, JSON.stringify(MOD_STORAGE.settings));
    
    if (MOD_STORAGE.settings.find(setting => setting.id == "exportInterval").value != -1)
        MOD_STORAGE.intervals.push(setInterval(requestExportSave, MOD_STORAGE.settings.find(setting => setting.id == "exportInterval")?.value * 60 * 60 * 1000));

    MOD_STORAGE.requestExportSave = requestExportSave;

    if (MOD_STORAGE.mutationObservers != [])
        MOD_STORAGE.mutationObservers.forEach(mutationObserver => mutationObserver.disconnect());
    
    MOD_STORAGE.mutationObservers = [];

    let m = new MutationObserver(onSettings);
    m.observe(document.querySelector(".page-container"), {childList: true});
    MOD_STORAGE.mutationObservers.push(m);

    //window.requestExportSave = requestExportSave;
    function requestExportSave() {
        if (MOD_STORAGE.settings.find(setting => setting.id == "askBeforeExport")?.value) {
            let autoExportTo = MOD_STORAGE.settings.find(setting => setting.id == "autoExportTo")?.value;
            utils.confirmModal(
                MOD_NAME,
                `<p>Do you want to export your save to ${autoExportTo == "file" ? "an external file" : "clipboard"}?<br><span style='font-size: 13px;'>(TIP: the time between auto exports can be modified in the settings)</span></p>`,
                () => exportSave(true),
                "Export", "Cancel",
                410,
                true,
                true);
        } else exportSave(true);
    }

    function exportSave(auto = false) {
        let autoExportTo = MOD_STORAGE.settings.find(setting => setting.id == "autoExportTo")?.value;
        document.querySelector(".save-game")?.click();
        // Array.from(document.querySelector(".save-row").children).find(child => child.innerText == "save game")?.click(); // Save game
        let save = localStorage.getItem("s"); // Get save

        if (auto === true) {
            if (autoExportTo == "file") {
                // Download file
                let a = document.createElement("a");
                a.download = `MO - Auto Save ${utils.getTimeFormat()}.txt`;
                a.href = "data:plain/text;charset=utf-8," + save;
                a.click();
            } else if (autoExportTo == "clipboard") {
                navigator.clipboard.writeText(save);
            }
        } else {
            // Download file
            let a = document.createElement("a");
            a.download = `MO - Save ${utils.getTimeFormat()}.txt`;
            a.href = "data:plain/text;charset=utf-8," + save;
            a.click();
        }
    }

    function onSettings(mutationList, observer) {
        for (let mutation of mutationList) {
            if (mutation.addedNodes.keys().length == 0) return;
            let node = mutation.addedNodes.item(0);
            if (!node?.className?.toLowerCase() == "modal-wrapper") return;

            // Insert elements
            if (node?.querySelector(".modal-settings")) {
                // Update volume
                let volumeBar = Array.from(document.querySelectorAll(".setting-section")).find(setting => setting.children[0]?.innerText == "Volume").children[2];
                window.volume = volumeBar.value;
                volumeBar.addEventListener("change", (event) => volume = event.target.value);
                
                insertSettings();
                modifyExportSave();
            } else if (node?.querySelector(".modal-importSave")) {
                insertUploadSave(node);
            }
        }
    }

    function insertSettings() {
        let settings = document.querySelector(".modal-settings");
        if (!settings) return;
        if (Array.from(document.querySelectorAll(".setting-section")).find(child => child.children[0]?.innerText == MOD_NAME)) return;
        let settingSection = document.createElement("div");
        settingSection.classList.add("setting-section");

        let settingTitle = document.createElement("h3");
        settingTitle.innerText = MOD_NAME;
        settingSection.append(settingTitle);

        for (let setting of MOD_STORAGE.settings) {
            let settingRow = document.createElement("div");
            settingRow.classList.add("row");
            settingRow.innerHTML = `<p>${setting.text}</p><input type='${setting.type}'/>`;
            switch(setting.type) {
                case "range": {
                    let text = setting.text.replace(" x ", ` ${setting.value} `);
                    if (setting.value == -1) text = "Auto export is disabled";
                    if (setting.value == 1) text = setting.text.split(" ").slice(0, setting.text.split(" ").length-2).join(" ") + " hour";
                    settingRow.innerHTML = `<p>${text}</p>`;
                    break;
                }
                case "checkbox": {
                    settingRow.children[1].checked = setting.value;
                    break;
                }
                case "select": {
                    settingRow.innerHTML = `<p>${setting.text}</p><select>${
                        setting.options.map(option => `<option value="${option}">${option}</option>`).join("")
                    }</select>`;
                    break;
                }
            }
                
            if (settingRow.children[1])
                settingRow.children[1].onchange = e => {
                    switch(setting.type) {
                        case "checkbox":
                            setting.value = e.target.checked;
                            break;
                        default:
                            setting.value = e.target.value;
                    };
                    localStorage.setItem(`${MOD_ID}_settings`, JSON.stringify(MOD_STORAGE.settings));
                };
            settingSection.append(settingRow);

            if (setting.type == "range") {
                let settingSlider = document.createElement("input");
                settingSlider.type = "range";
                settingSlider.min = "-1";
                settingSlider.max = "12";
                settingSlider.step = "1";
                settingSlider.value = setting.value == .5 ? 0 : setting.value;
                settingSlider.style.width = "100%";
                settingSlider.onchange = _ => {
                    setting.value = parseInt(settingSlider.value) || .5;
                    let text = setting.text.replace(" x ", ` ${setting.value} `);
                    if (setting.value == -1) text = "Auto export is disabled";
                    if (setting.value == 1) text = setting.text.split(" ").slice(0, setting.text.split(" ").length-2).join(" ") + " hour";
                    settingRow.innerHTML = `<p>${text}</p>`;
                    localStorage.setItem(`${MOD_ID}_settings`, JSON.stringify(MOD_STORAGE.settings));

                    clearInterval(MOD_STORAGE.intervals[0]);
                    MOD_STORAGE.intervals = [];
                    if (setting.value == -1) return;
                    MOD_STORAGE.intervals.push(setInterval(requestExportSave, setting.value * 60 * 60 * 1000));
                };
                settingSection.append(settingSlider);
            }
        }
        settings.querySelector(".modal-content").insertBefore(settingSection, Array.from(settings.querySelector(".modal-content").children).find(section => section.querySelector("h3")?.innerText == "Saves"));
    }

    function modifyExportSave() {
        let savesSection = Array.from(document.querySelectorAll(".setting-section").values())
        .find(section => section.children[0].innerText == "Saves");
        let exportFile = savesSection.children[1].children[0];
        let exportClipboard = savesSection.children[2].children[0];

        exportFile.innerHTML = "export (file)";
        exportFile.onclick = exportSave;

        exportClipboard.innerHTML = "export (clipboard)";
        exportClipboard.onclick = () => {
            document.querySelector(".save-game")?.click();
            //Array.from(document.querySelector(".save-row").children).find(child => child.innerText == "save game")?.click(); // Save game
            navigator.clipboard.writeText(localStorage.getItem("s"));
        };
        /*a.onclick = () => utils.choiceModal(
            MOD_NAME,
            "<p>Would you like to export to <b>file</b> or <b>clipboard</b>?</p>",
            {text: "Clipboard", callback: () => {
                Array.from(document.querySelector(".save-row").children).find(child => child.innerText == "save game")?.click(); // Save game
                navigator.clipboard.writeText(localStorage.getItem("s"));
            }},
            {text: "File", callback: exportSave},
            410,
            true);*/
    }

    function insertUploadSave(node) {
        if (node.querySelector("#file")) return;

        let button = document.createElement("button");
        button.className = "modal-action";
        button.style.padding = "0";

        let label = document.createElement("label");
        label.htmlFor = "file";
        label.style.cursor = "pointer";
        label.style.padding = "2px 8px";
        label.innerText = "Import File";

        button.append(label);

        let file = document.createElement("input");
        file.id = "file";
        file.type = "file";
        file.name = "file";
        file.className = "modal-action";
        file.style.display = "none";
        file.addEventListener('change', function() {
            var fr = new FileReader();
            fr.onload = function() {
                node.querySelector('.modal-content > textarea').innerText = fr.result;
            }

            fr.readAsText(this.files[0]);
        });
        document.querySelector(".modal-importSave > .modal-actions").insertBefore(file, document.querySelector(".modal-importSave > .modal-actions").children[1]);
        document.querySelector(".modal-importSave > .modal-actions").insertBefore(button, file);
    }

    const utils = {
        confirmModal: function (title, innerHTML, onConfirm) {
            //this.closeTopmostModal();
            var confirmMessage =
                arguments.length > 3 && void 0 !== arguments[3] ?
                arguments[3] :
                'Confirm',
                cancelMessage =
                arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 'Cancel',
                customWidth = arguments.length > 5 ? arguments[5] : void 0,
                center = arguments.length > 6 ? arguments[6] : void 0,
                nonBlocking = arguments.length > 7 ? arguments[7] : void 0;
            let wrapper = this.createEl('div', ['modal-wrapper']);
            if (nonBlocking) {
                wrapper.style.margin = "auto";
                wrapper.style.width = "fit-content";
                wrapper.style.height = "fit-content";
                wrapper.style.background = "transparent";
            }
            wrapper.addEventListener('click', this.closeTopmostModal);
            var modal = this.createEl('div', [
                'modal'
            ]);
            customWidth && (modal.style.width = customWidth + 'px');
            center && (modal.style.textAlign = 'center');
            var titleElement = this.createEl('h2', ['modal-title'], title);
            modal.append(titleElement);
            var contentElement = this.createEl('div', ['modal-content']);
            contentElement.innerHTML = innerHTML;
            modal.append(contentElement);
            var actionsContainer = this.createEl('div', ['modal-actions']),
                confirmAction = this.createEl('button', ['modal-action'], confirmMessage);
            confirmAction.onclick = function () {
                this.closeTopmostModal();
                onConfirm();
            }.bind(this);
            var cancelAction = this.createEl('button', ['modal-action'], cancelMessage);
            cancelAction.onclick = function () {
                this.closeTopmostModal();
            }.bind(this);
            actionsContainer.append(cancelAction, confirmAction);
            modal.append(actionsContainer);
            wrapper.append(modal);
            document.querySelector(".page-container").append(wrapper);
        },
        choiceModal: function (title, innerHTML, leftButton, rightButton) {
            //this.closeTopmostModal();
            var leftMessage =
                leftButton.text,
                rightMessage =
                rightButton.text,
                customWidth = arguments.length > 4 ? arguments[4] : void 0,
                center = arguments.length > 5 ? arguments[5] : void 0;
            let wrapper = this.createEl('div', ['modal-wrapper']);
            wrapper.addEventListener('click', this.closeTopmostModal);
            var modal = this.createEl('div', [
                'modal'
            ]);
            customWidth && (modal.style.width = customWidth + 'px');
            center && (modal.style.textAlign = 'center');
            var titleElement = this.createEl('h2', ['modal-title'], title);
            modal.append(titleElement);
            var contentElement = this.createEl('div', ['modal-content']);
            contentElement.innerHTML = innerHTML;
            modal.append(contentElement);
            var actionsContainer = this.createEl('div', ['modal-actions']),
                leftAction = this.createEl('button', ['modal-action'], leftMessage);
            leftAction.onclick = function () {
                this.closeTopmostModal();
                leftButton.callback();
            }.bind(this);
            var rightAction = this.createEl('button', ['modal-action'], rightMessage);
            rightAction.onclick = function () {
                this.closeTopmostModal();
                rightButton.callback();
            }.bind(this);
            actionsContainer.append(rightAction, leftAction);
            modal.append(actionsContainer);
            wrapper.append(modal);
            document.querySelector(".page-container").append(wrapper);
        },
        createEl: function (tag) {
            var classes =
                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                innerHTML =
                arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '',
                element = document.createElement(tag);
            return (
                classes.forEach(function (clazz) {
                    return element.classList.add(clazz)
                }),
                (element.innerHTML = innerHTML + ''),
                element
            );
        },
        getCodeName: function (name) {
            return name
                .replace(/(?:^\w|[A-Z]|\b\w)/g, function (match, p1) {
                    return 0 === p1 ? match.toLowerCase() : match.toUpperCase()
                })
                .replace(/\s+/g, '')
                .replace(/\./g, '');
        },
        getTimeFormat: function() {
            let d = new Date();

            let dateString = d.toLocaleDateString().replaceAll("/", "-");

            let hours = d.getHours().toString().padStart(2, '0');
            let minutes = d.getMinutes().toString().padStart(2, '0');
            let seconds = d.getSeconds().toString().padStart(2, '0');

            return `${dateString}-${hours}.${minutes}.${seconds}`;
        },
        closeTopmostModal: function (event) {
            var targetElement;
            if (event) {
                var targetEl = event.target;
                targetElement = targetEl.classList.contains('modal-wrapper') ? targetEl : null;
            } else {
                var allWrappers = document.querySelectorAll('.modal-wrapper');
                allWrappers.length > 0 && (targetElement = allWrappers[allWrappers.length - 1]);
            }
            if (targetElement) {
                targetElement.style.pointerEvents = 'none';
                new Howl({
                    src: ['./sounds/misc.wav'],
                    volume: .1 * volume
                }).play();
                var modal = targetElement.children[0];
                modal.style.animation = 'fadeOutDown .15s ease-out forwards';
                modal.addEventListener('animationend', () => targetElement.parentNode.removeChild(targetElement));
            }
        }
    };
})();