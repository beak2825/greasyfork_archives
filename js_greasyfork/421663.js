// ==UserScript==
// @name         AtCoderLanguageButtons
// @namespace    http://atcoder.jp/
// @version      0.3.0
// @description  Add buttons to select language.
// @author       magurofly
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @match        https://atcoder.jp/contests/*/custom_test*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/421663/AtCoderLanguageButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/421663/AtCoderLanguageButtons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = "0.3.0";

    // 設定があればロード
    const config = (() => {
        let buttons = new Set();
        let currentChoice = null;

        return {
            load() {
                const config_json = GM_getValue("config", "null");
                if (config_json) {
                    try {
                        const data = JSON.parse(config_json);
                        buttons = new Set(data.buttons);
                        if (data.choice && !currentChoice) currentChoice = data.choice;
                    } catch (e) {
                        console.error("AtCoderLanguageButtons: Invalid JSON", config_json);
                    }
                }
            },

            save() {
                const data = { buttons: [...buttons], choice: currentChoice };
                const config_json = JSON.stringify(data);
                GM_setValue("config", config_json);
                console.info("AtCoderLanguageButtons: saved");
            },

            isSet(lang) {
                return buttons.has(lang);
            },

            set(lang, flag) {
                if (flag) {
                    buttons.add(lang);
                } else {
                    buttons.delete(lang);
                }
            },

            set choice(choice) {
                currentChoice = choice;
                this.save();
            },

            get choice() {
                return currentChoice;
            },
        };
    })();

    // 表示する
    const view = (() => {
        const modal = document.createElement("section");
        modal.className = "modal fade";
        modal.innerHTML = `
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            <h4 class="modal-title">AtCoderLanguageButtons</h4>
        </div>
        <div class="modal-body">
            <p>ボタンを表示する言語を選択してください</p>
            <form id="atcoder-language-buttons-config">
                <div id="atcoder-language-buttons-config-languages"></div>
            </form>
        </div>
    </div>
</div>
`;

        const choices = new Map();
        const group = document.createElement("span");

        return {
            init() {
                this.initView();
                this.initConfigWindow();
                this.updateButtons();
            },

            initView() {
                const container = document.getElementById("select-lang");
                container.appendChild(group);

                const openButton = document.createElement("button");
                openButton.type = "button";
                openButton.className = "glyphicon glyphicon-cog";
                openButton.addEventListener("click", _e => {
                    this.showConfig();
                });
                container.appendChild(openButton);

                const select = $("#select-lang select[name='data.LanguageId']");
                select.on("change", _e => {
                    config.choice = select.val();
                    this.highlightButtons();
                });
                if (config.choice && !select.val()) {
                    select.val(config.choice);
                    this.highlightButtons();
                }
            },

            initConfigWindow() {
                document.body.appendChild(modal);
                const langs = document.getElementById("atcoder-language-buttons-config-languages");
                for (const langOption of document.querySelector("#select-lang select").querySelectorAll("option[value]")) {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.value = langOption.value;
                    checkbox.addEventListener("change", _e => {
                        config.set(checkbox.value, checkbox.checked);
                        config.save();
                        this.updateButtons();
                    });
                    choices.set(langOption.value, {checkbox, label: langOption.textContent});

                    const checkboxLabel = document.createElement("label");
                    checkboxLabel.appendChild(checkbox);
                    checkboxLabel.appendChild(document.createTextNode(langOption.textContent));

                    const checkboxGroup = document.createElement("div");
                    checkboxGroup.className = "checkbox";
                    checkboxGroup.appendChild(checkboxLabel);

                    langs.appendChild(checkboxGroup);
                }
            },

            updateButtons() {
                $(group).empty();//for (const child of group.children) group.removeChild(child);

                for (const [languageId, {label}] of choices.entries()) {
                    if (!config.isSet(languageId)) continue;
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "btn btn-default";
                    button.dataset.languageId = languageId;
                    button.textContent = label;
                    button.addEventListener("click", _e => {
                        //TODO: Set languageId
                        $("#select-lang select[name='data.LanguageId']").val(languageId).trigger("change");
                    });
                    group.appendChild(button);
                }

                this.highlightButtons();
            },

            highlightButtons() {
                const select = $("#select-lang select[name='data.LanguageId']");
                for (const button of group.children) {
                    button.classList.remove("btn-default", "btn-success");
                    if (select.val() == button.dataset.languageId) {
                        button.classList.add("btn-success");
                    } else {
                        button.classList.add("btn-default");
                    }
                }
            },

            showConfig() {
                for (const [languageId, {checkbox}] of choices.entries()) {
                    checkbox.checked = config.isSet(languageId);
                }
                $(modal).modal();
            },
        };
    })();

    // 初期化
    config.load();
    view.init();

    console.info(`AtCoderLanguageButtons v${VERSION}`);
})();