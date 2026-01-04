// ==UserScript==
// @name         🤖ChatGPT - Prompt提示选择器
// @namespace    https://greasyfork.org/
// @version      1.0.8
// @description  一个帮助用户在ChatGPT原生网页快速选择 ChatGPT 提示"Prompt"的脚本。
// @author       OpenAI - ChatGPT
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/?*
// @match        https://chatgpt.com/?*
// @match        https://chatgpt.com/
// @match        https://chat.github-free.com/
// @match        https://chat.github-free.com/c/*
// @match        https://chat.github-free.com/?*
// @match        https://chat.zhile.io/
// @match        https://chat.zhile.io/c/*
// @match        https://chat.zhile.io/?*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495947/%F0%9F%A4%96ChatGPT%20-%20Prompt%E6%8F%90%E7%A4%BA%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/495947/%F0%9F%A4%96ChatGPT%20-%20Prompt%E6%8F%90%E7%A4%BA%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const $ = window.jQuery;
    const DARK_MODE_STYLE = `
    .dark-mode-compatible {
      background-color: white;
      color: black;
    }
    .dark .dark-mode-compatible {
      background-color: #343540;
      color: white;
    }

    select {
      font-size: 16px;
      border-radius: 4px;
    }

    select option {
      font-size: 16px;
      padding: 8px;
    }

  `;

    //可通过替换下面的Json链接来自定义提示库。
    const DATA_URL =
        "https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1681658246070/input.json";

    const CATEGORY_DROPDOWN_ID = "chatgpt-prompt-selector-category";
    const SUBCATEGORY_DROPDOWN_ID = "chatgpt-prompt-selector-subcategory";
    const CUSTOM_PROMPT_DROPDOWN_ID = "customPromptDropdown";
    const CATEGORY_DROPDOWN_PLACEHOLDER = "[类别]";
    const SUBCATEGORY_DROPDOWN_PLACEHOLDER = "[提示]";
    const CUSTOM_PROMPT_DROPDOWN_PLACEHOLDER = "[自定义提示]";

    const CATEGORY_DROPDOWN_WIDTH = 100;
    const SUBCATEGORY_DROPDOWN_WIDTH = 180;
    const CUSTOM_PROMPT_DROPDOWN_WIDTH = 180;
    const DEFAULT_ENTRY_HEIGHT = 20;

    const CHECK_MARKUP_INTERVAL = 500;
    const ENTRY_HEIGHT_RESET_DELAY = 500;

    const CONTAINER_SELECTOR = "form div.absolute.bottom-full"; /*在chatgpt聊天框的上面一行*/
    const ENTRY_SELECTOR = "#prompt-textarea > p";

    const SELECT_START_TAG_TEMPLATE =
        '<select id="{{id}}" class="dark-mode-compatible" style="width: {{width}}px">';
    const SELECT_END_TAG_TEMPLATE = "</select>";
    const OPTION_TAG_TEMPLATE =
        '<option value="{{value}}" title="{{titleMark}}">{{title}}</option>';
    const DATA_LOAD_ERROR_MESSAGE =
        "ChatGPT提示选择器错误：无法下载数据集请检查json链接是否正确。";

    const NEW_LINE = "\r\n";

    let promptItems = null;

    function placeholder(name) {
        return "{{" + name + "}}";
    }

    function createDropdown(parent, id, defaultOptionTitle, width, items) {
        let markup = SELECT_START_TAG_TEMPLATE.replace(
            placeholder("id"),
            id
        ).replace(placeholder("width"), width);

        markup += OPTION_TAG_TEMPLATE.replace(placeholder("value"), "")
            .replace(placeholder("title"), defaultOptionTitle)
            .replace(placeholder("titleMark"), "");

        for (const item of items) {
            const title = item.title;
            const mark = item.mark;
            markup += OPTION_TAG_TEMPLATE.replace(placeholder("value"), mark)
                .replace(placeholder("title"), title)
                .replace(placeholder("titleMark"), mark);
        }

        markup += SELECT_END_TAG_TEMPLATE;

        if (id === CATEGORY_DROPDOWN_ID) {
            parent.prepend(markup);
        } else {
            getCategoryDropdown().after(markup);
        }
    }

    function getCategoryDropdown() {
        return $("#" + CATEGORY_DROPDOWN_ID);
    }

    function getSubcategoryDropdown() {
        return $("#" + SUBCATEGORY_DROPDOWN_ID);
    }

    function getCustomPromptDropdown() {
        return $("#" + CUSTOM_PROMPT_DROPDOWN_ID);
    }

    function handleSubcategoryChange() {
        const categoryDropdown = getCategoryDropdown();
        const categoryMark = categoryDropdown.val();
        const categoryItem = promptItems.find((item) => item.mark === categoryMark);

        if (categoryItem === null) return;

        const subcategoryMark = $(this).val();
        const subcategoryItem = categoryItem.items.find(
            (item) => item.mark === subcategoryMark
        );

        if (subcategoryItem === null) return;

        const prompt = categoryItem.prompt.replace(
            placeholder("prompt"),
            subcategoryItem.prompt
        );
        const parts = prompt.split(NEW_LINE);
        const heightInPixels = DEFAULT_ENTRY_HEIGHT * parts.length + 1;

        const entry = $(ENTRY_SELECTOR);
        const button = entry.next();

        entry.height(heightInPixels);
        entry.text(prompt);

        button.prop("disabled", false);
        button.click(() => {
            setTimeout(() => {
                entry.height(DEFAULT_ENTRY_HEIGHT);
            }, ENTRY_HEIGHT_RESET_DELAY);
        });
        const defaultCategoryMark = categoryDropdown
            .find('option:contains("默认")')
            .val();
        categoryDropdown.val(defaultCategoryMark);
        categoryDropdown.trigger("change");
    }

    function handleCategoryChange() {
        const categoryMark = $(this).val();
        const categoryItem = promptItems.find((item) => item.mark === categoryMark);
        if (categoryItem === null) return;

        const dropdown = getSubcategoryDropdown();
        if (dropdown.length > 0) dropdown.remove();

        const container = getContainer();
        createDropdown(
            container,
            SUBCATEGORY_DROPDOWN_ID,
            SUBCATEGORY_DROPDOWN_PLACEHOLDER,
            SUBCATEGORY_DROPDOWN_WIDTH,
            categoryItem.items
        );

        const subcategoryDropdown = getSubcategoryDropdown();
        subcategoryDropdown.change(handleSubcategoryChange);
    }

    function handleCustomPromptChange() {
        const customPrompt = $(this).val();
        const entry = $(ENTRY_SELECTOR);
        const button = entry.next();

        entry.text(customPrompt);

        // 计算所选自定义提示的高度，并将其应用于输入框
        const parts = customPrompt.split(NEW_LINE);
        const heightInPixels = DEFAULT_ENTRY_HEIGHT * parts.length + 1;
        entry.height(heightInPixels);

        button.prop("disabled", false);
        button.click(() => {
            setTimeout(() => {
                entry.height(DEFAULT_ENTRY_HEIGHT);
            }, ENTRY_HEIGHT_RESET_DELAY);
        });
    }

    function activateCheckTimer() {
        setInterval(checkMarkup, CHECK_MARKUP_INTERVAL);
    }

    function getContainer() {
        return $(CONTAINER_SELECTOR);
    }

    function checkMarkup() {
        const container = getContainer();

        if (container.has("select").length > 0) return;
        if (window.innerWidth <= 480) return;

        createDropdown(
            container,
            CATEGORY_DROPDOWN_ID,
            CATEGORY_DROPDOWN_PLACEHOLDER,
            CATEGORY_DROPDOWN_WIDTH,
            promptItems
        );
        createDropdown(
            container,
            SUBCATEGORY_DROPDOWN_ID,
            SUBCATEGORY_DROPDOWN_PLACEHOLDER,
            SUBCATEGORY_DROPDOWN_WIDTH,
            []
        );
        const customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        createDropdown(
            container,
            CUSTOM_PROMPT_DROPDOWN_ID,
            CUSTOM_PROMPT_DROPDOWN_PLACEHOLDER,
            CUSTOM_PROMPT_DROPDOWN_WIDTH,
            customPrompts
        );
        const customPromptDropdown = getCustomPromptDropdown();
        customPromptDropdown.toggle(customPrompts.length > 0);
        customPromptDropdown.change(handleCustomPromptChange);

        const categoryDropdown = getCategoryDropdown();
        categoryDropdown.change(handleCategoryChange);
        const defaultCategoryMark = categoryDropdown
            .find('option:contains("默认")')
            .val();
        categoryDropdown.val(defaultCategoryMark);
        categoryDropdown.trigger("change");
        addCustomPromptButton();
    }

    function addCustomPrompt() {
        const title = prompt("请输入提示的标题：");
        if (!title) return;
        const customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        if (customPrompts.find((item) => item.title === title)) {
            alert("该标题已经存在，请输入一个新的标题。");
            return;
        }

        const content = prompt("请输入提示的内容：");
        if (!content) return;

        customPrompts.push({
            title,
            mark: content
        });
        GM_setValue("customPrompts", JSON.stringify(customPrompts));

        const customPromptDropdown = getCustomPromptDropdown();
        customPromptDropdown.append(
            OPTION_TAG_TEMPLATE.replace(placeholder("value"), content)
            .replace(placeholder("title"), title)
            .replace(placeholder("titleMark"), content)
        );
        customPromptDropdown.val(content);
        customPromptDropdown.trigger("change");
        customPromptDropdown.show();
    }

    function removeCustomPrompt(mark) {
        let customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        customPrompts = customPrompts.filter((item) => item.mark !== mark);
        GM_setValue("customPrompts", JSON.stringify(customPrompts));
    }

    function addCustomPromptButton() {
        let addButton, removeButton;

        const container = getContainer();
        addButton = $(
            '<button class="dark-mode-compatible btn relative btn-neutral border-0 md:border" type="button">添加</button>'
        );
        addButton.click(addCustomPrompt);
        removeButton = $(
            '<button class="dark-mode-compatible btn relative btn-neutral border-0 md:border" type="button">删除</button>'
        );
        removeButton.click(() => {
            const customPromptDropdown = getCustomPromptDropdown();
            const mark = customPromptDropdown.val();
            if (!mark) return;
            customPromptDropdown.find(`option[value="${mark}"]`).remove();
            removeCustomPrompt(mark);
            if (customPromptDropdown.children().length <= 1) {
                customPromptDropdown.hide();
                removeButton.hide();
                addButton.show(); // 显示添加按钮
            }

            // 清空输入框
            const entry = $(ENTRY_SELECTOR);
            entry.text("");
        });
        removeButton.hide();
        getCustomPromptDropdown().after(removeButton);
        getCustomPromptDropdown().after(addButton);

        const customPromptDropdown = getCustomPromptDropdown();
        if (customPromptDropdown.children().length <= 1) {
            removeButton.hide();
            addButton.show(); // 显示添加按钮
        }

        customPromptDropdown.on("change", () => {
            if (customPromptDropdown.val()) {
                removeButton.show();
                addButton.hide(); // 隐藏添加按钮
            } else {
                removeButton.hide();
                addButton.show(); // 显示添加按钮
            }
            const selectedPrompt = $("#customPromptDropdown").val();
            if (selectedPrompt) {
                const entry = $(ENTRY_SELECTOR);
                entry.text(selectedPrompt);
            }
        });
    }




    function createCustomPromptDropdown() {
        const container = getContainer();
        const customPrompts = JSON.parse(GM_getValue("customPrompts", "[]"));
        const customPromptDropdown = $(
            `<select id="${CUSTOM_PROMPT_DROPDOWN_ID}" class="${CATEGORY_DROPDOWN_ID}" style="width: ${CATEGORY_DROPDOWN_WIDTH}px" size="${customPrompts.length}"></select>`
        );
        container.append(customPromptDropdown);

        for (const customPrompt of customPrompts) {
            customPromptDropdown.append(
                `<option value="${customPrompt.mark}" title="${customPrompt.mark}">${customPrompt.title}</option>`
            );
        }

        if (customPrompts.length === 0) {
            customPromptDropdown.hide();
        } else {
            customPromptDropdown.show();
        }

        /*customPromptDropdown.change(() => {
            const selectedPrompt = customPromptDropdown.val();
            if (selectedPrompt) {
                const entry = $(ENTRY_SELECTOR);
                entry.val(selectedPrompt);
            }
        });*/

        return customPromptDropdown;
    }

    function setReceivedData(jsonText) {
        promptItems = JSON.parse(jsonText);
    }

    function loadData() {
        const getData = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: DATA_URL,
                responseType: "text",
                overrideMimeType: "text/html; charset=UTF-8",
                onload: (response) => {
                    resolve(response.responseText);
                },
                onerror: () => {
                    reject(DATA_LOAD_ERROR_MESSAGE);
                },
            });

        });

        getData
            .then((data) => {
                setReceivedData(data);
                activateCheckTimer();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function addDarkModeStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = DARK_MODE_STYLE;
        document.head.appendChild(styleTag);
    }

    createCustomPromptDropdown();
    activateCheckTimer();
    addDarkModeStyles();
    loadData();
    addCustomPromptButton();
})();
