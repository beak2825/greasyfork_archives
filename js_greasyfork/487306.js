// ==UserScript==
// @name               ESJ Zone: Auto Expand Collapsed Chapters
// @name:zh-TW         ESJ Zone：自動展開摺疊章節
// @name:zh-CN         ESJ Zone：自动展开折叠章节
// @description        Expand the collapsed, last read chapters (alternatively, all chapters) automatically.
// @description:zh-TW  自動展開已折疊的最後閱讀章節（或展開所有章節）。
// @description:zh-CN  自动展开已折叠的最后阅读章节（或展开所有章节）。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.1
// @license            MIT
// @match              https://www.esjzone.cc/detail/*.html
// @match              https://www.esjzone.me/detail/*.html
// @match              https://www.esjzone.one/detail/*.html
// @run-at             document-end
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.registerMenuCommand
// @require            https://unpkg.com/typesafe-i18n@5.26.2/dist/i18n.object.min.js
// @require            https://unpkg.com/uuid-random@1.3.2/uuid-random.min.js
// @require            https://update.greasyfork.org/scripts/494512/1373878/gm-inject.js
// @supportURL         https://greasyfork.org/scripts/487306/feedback
// @downloadURL https://update.greasyfork.org/scripts/487306/ESJ%20Zone%3A%20Auto%20Expand%20Collapsed%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/487306/ESJ%20Zone%3A%20Auto%20Expand%20Collapsed%20Chapters.meta.js
// ==/UserScript==

const LL = (function()
{
    const translations =
    {
        "en": {
            COMMAND: {
                SETTING: "Change Expand Setting",
            },
            SETTING: {
                TITLE: "Expand Setting",
                EXPAND_BEHAVIOUR: "Expand Behaviour",
                EXPAND_ALL: "Expand All Chapters",
                LAST_READ: "Last Read Chapters Only",
                CANCEL: "Cancel",
                SAVE: "Save",
            },
        },
        "zh-TW": {
            COMMAND: {
                SETTING: "更改展開設定",
            },
            SETTING: {
                TITLE: "展開設定",
                EXPAND_BEHAVIOUR: "展開行為",
                EXPAND_ALL: "展開所有章節",
                LAST_READ: "展開最後閱讀章節",
                CANCEL: "取消",
                SAVE: "儲存",
            },
        },
        "zh-CN": {
            COMMAND: {
                SETTING: "更改展開设定",
            },
            SETTING: {
                TITLE: "展開设定",
                EXPAND_BEHAVIOUR: "展开行为",
                EXPAND_ALL: "展开所有章节",
                LAST_READ: "展开最后阅读章节",
                CANCEL: "取消",
                SAVE: "储存",
            },
        },
    };

    let locale = "en";
    for (let _locale of navigator.languages.map((language) => new Intl.Locale(language)))
    {
        if (_locale.language === "zh")
        {
            _locale = new Intl.Locale("zh", { region: _locale.maximize().region });
        }
;
        if (_locale.baseName in translations)
        {
            locale = _locale.baseName;
            break;
        }
    }

    return i18nObject(locale, translations[locale]);
})();

const EVENT_KEY = uuid();

const ExpandOptions =
{
    EXPAND_ALL: "expand_all",
    LAST_READ: "last_read",
};

GM.registerMenuCommand(LL.COMMAND.SETTING(), showExpandSetting);

GM.injectPageScript(
    ({ EVENT_KEY }) =>
    {
        window.addEventListener(`${EVENT_KEY}:showModal`, ({ detail: selector }) =>
        {
            $(selector)
                .on("hide.bs.modal", (event) =>
                {
                    event.target.dispatchEvent(new CustomEvent("hide.bs.modal", { ...event }));
                })
                .on("hidden.bs.modal", (event) =>
                {
                    event.target.dispatchEvent(new CustomEvent("hidden.bs.modal", { ...event }));
                })
                .modal("show");
        });

        window.addEventListener(`${EVENT_KEY}:hideModal`, ({ detail: selector }) =>
        {
            $(selector)
                .modal("hide");
        });
    },
    { EVENT_KEY });

(async () =>
{
    const setting = await getExpandSetting();

    const elements = document.querySelectorAll("#chapterList details");
    for (const element of elements)
    {
        if ((setting === ExpandOptions.EXPAND_ALL) || (element.querySelector("p.active") !== null))
        {
            element.open = true;
        }
    }
})();

function getExpandSetting()
{
    return GM.getValue("expand", ExpandOptions.LAST_READ);
}

let settingOpened = false;

function showExpandSetting()
{
    if (settingOpened) { return Promise.resolve(new Error("Setting was already opened.")); }

    return new Promise(async (resolve) =>
    {
        const setting = await getExpandSetting();

        const form = document.createElement("form");
        form.id = uuid();
        form.classList.add("modal", "fade");
        form.addEventListener("submit", async (event) =>
        {
            event.preventDefault();

            const settings = new FormData(form);
            await GM.setValue("expand", settings.get("expand"));

            window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:hideModal`, { detail: `#${form.id}` }));
        });
        form.addEventListener("hide.bs.modal", () => resolve());
        form.addEventListener("hidden.bs.modal", () =>
        {
            form.remove();
            settingOpened = false;
        });

        const modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog");

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        const modalHeader = document.createElement("div");
        modalHeader.classList.add("modal-header");

        const modalTitle = document.createElement("h4");
        modalTitle.classList.add("modal-title");
        modalTitle.innerText = LL.SETTING.TITLE();

        const closeButton = document.createElement("button");
        closeButton.classList.add("close");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerHTML = `<span aria-hidden="true">×</span>`;

        const modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");

        const expandFormGroup = document.createElement("div");
        expandFormGroup.classList.add("form-group");

        const expandSelect = document.createElement("select");
        expandSelect.id = "expand-select";
        expandSelect.classList.add("form-control");
        expandSelect.name = "expand";

        const expandAllOption = document.createElement("option");
        expandAllOption.value = ExpandOptions.EXPAND_ALL;
        expandAllOption.selected = (setting === ExpandOptions.EXPAND_ALL);
        expandAllOption.innerText = LL.SETTING.EXPAND_ALL();

        const lastReadOption = document.createElement("option");
        lastReadOption.value = ExpandOptions.LAST_READ;
        lastReadOption.selected = (setting === ExpandOptions.LAST_READ);
        lastReadOption.innerText = LL.SETTING.LAST_READ();

        const modalFooter = document.createElement("div");
        modalFooter.classList.add("modal-footer");

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("btn", "btn-default");
        cancelButton.type = "button";
        cancelButton.dataset.dismiss = "modal";
        cancelButton.innerText = LL.SETTING.CANCEL();

        const saveButton = document.createElement("button");
        saveButton.classList.add("btn", "btn-primary");
        cancelButton.type = "submit";
        saveButton.innerText = LL.SETTING.SAVE();

        modalHeader.append(modalTitle, closeButton);
        expandSelect.append(expandAllOption, lastReadOption);
        expandFormGroup.append(expandSelect);
        modalBody.append(expandFormGroup);
        modalFooter.append(cancelButton, saveButton);
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        form.append(modalDialog);
        document.body.append(form);

        window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:showModal`, { detail: `#${form.id}` }));
        settingOpened = true;
    });
}
