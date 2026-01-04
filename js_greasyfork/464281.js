// ==UserScript==
// @name         ChatGPT - PromptTool
// @namespace    https://greasyfork.org/
// @version      1.0.2
// @description  A script to help users quickly select "Prompt" from ChatGPT native web pages.
// @author       unknow modify by sw
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @match        https://chat.openai.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464281/ChatGPT%20-%20PromptTool.user.js
// @updateURL https://update.greasyfork.org/scripts/464281/ChatGPT%20-%20PromptTool.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const DARK_MODE_STYLE = `
  .dark-mode-compatible {
    background-color: white;
    color: black;
  }
  .dark .dark-mode-compatible {
    background-color: #343540;
    color: white;
  }
`;
    const PROMPT_BOX_STYLE = `
    #promptBox {
     max-width: 42rem;
     margin: 0 auto;
    }
    #promptBox #chatgpt-prompt-selector-category,
    #promptBox #chatgpt-prompt-selector-subcategory {
    --tw-shadow: 0 0 15px rgba(0,0,0,.1);
    --tw-shadow-colored: 0 0 15px var(--tw-shadow-color);
    box-shadow: 0 0 transparent,0 0 transparent,var(--tw-shadow);
    box-shadow: var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow);
        --tw-text-opacity: 1;
    color: rgba(255,255,255,var(--tw-text-opacity));
    --tw-bg-opacity: 1;
    background-color: rgba(64,65,79,var(--tw-bg-opacity));
    border-color: rgba(32,33,35,.5);
    border-radius: .375rem;
    border-width: 1px;
    margin-bottom: .75rem;
    }
    `
    //可通过替换下面的Json链接来自定义提示库。
    const DATA_URL ="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1681658246070/input.json";

    const CATEGORY_DROPDOWN_ID = "chatgpt-prompt-selector-category";
    const SUBCATEGORY_DROPDOWN_ID = "chatgpt-prompt-selector-subcategory";
    const CATEGORY_DROPDOWN_PLACEHOLDER = "[类别]";
    const SUBCATEGORY_DROPDOWN_PLACEHOLDER = "[提示]";

    const CATEGORY_DROPDOWN_WIDTH = '50%';
    const SUBCATEGORY_DROPDOWN_WIDTH = '50%';
    const DEFAULT_ENTRY_HEIGHT = 20;

    const CHECK_MARKUP_INTERVAL = 500;
    const ENTRY_HEIGHT_RESET_DELAY = 500;

    const CONTAINER_SELECTOR = ".bottom-0 .text-center";
    const ENTRY_SELECTOR = "textarea";

    const SELECT_START_TAG_TEMPLATE =
          '<select id="{{id}}" class="dark-mode-compatible" style="width: {{width}}">';
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
        entry.val(prompt);

        button.prop("disabled", false);
        button.click(() => {
            setTimeout(() => {
                entry.height(DEFAULT_ENTRY_HEIGHT);
            }, ENTRY_HEIGHT_RESET_DELAY);
        });
        const defaultCategoryMark = categoryDropdown.find('option:contains("默认")').val();
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

    function getContainer() {
        return $(CONTAINER_SELECTOR);
    }

    function createDivBox() {
        return $("<div id='promptBox'></div>");
    }

    function addClassToSelect(idSelect) {
        const styles = ``;
        const currentStyle = $(idSelect).attr('style');
        console.log($(idSelect), currentStyle)
        $(idSelect).attr('style', styles + currentStyle);
    }

    function checkMarkup() {
        const container = getContainer();
        if (container.has("select").length > 0) return;
        const divBox = createDivBox();

        createDropdown(
            divBox,
            CATEGORY_DROPDOWN_ID,
            CATEGORY_DROPDOWN_PLACEHOLDER,
            CATEGORY_DROPDOWN_WIDTH,
            promptItems
        );
        createDropdown(
            divBox,
            SUBCATEGORY_DROPDOWN_ID,
            SUBCATEGORY_DROPDOWN_PLACEHOLDER,
            SUBCATEGORY_DROPDOWN_WIDTH,
            []
        );
        container.prepend(divBox)
        const categoryDropdown = getCategoryDropdown();
        categoryDropdown.change(handleCategoryChange);
        const defaultCategoryMark = categoryDropdown.find('option:contains("默认")').val();
        categoryDropdown.val(defaultCategoryMark);
        categoryDropdown.trigger("change");
    }

    function activateCheckTimer() {
        setInterval(checkMarkup, CHECK_MARKUP_INTERVAL);
    }

    function setReceivedData(jsonText) {
        promptItems = JSON.parse(jsonText);
    }

    function loadData() {
        GM_xmlhttpRequest({
            method: "GET",
            url: DATA_URL,
            onload: (response) => {
                setReceivedData(response.responseText);
                activateCheckTimer();
            },
            onerror: () => {
                console.error(DATA_LOAD_ERROR_MESSAGE);
            },
        });
    }

    function addDarkModeStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = DARK_MODE_STYLE + PROMPT_BOX_STYLE;
        document.head.appendChild(styleTag);
    }

    addDarkModeStyles();
    loadData();
})();


