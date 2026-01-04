// ==UserScript==
// @name         文档词典统计工具
// @namespace 	 accountbelongstox@163.com
// @version      0.4.1
// @description  将文档整理成词典，并展示。
// @author       accountbelongstox@163.com
// @match        *://*.*/*
// @match        *://*.*.*/*
// @match        *://*/*
// @exclude      *://*.12gm.com/*
// @exclude      *://*.deepseek.com/*
// @exclude      *://*.chatgpt.com/*
// @license      AGPL License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/452648/%E6%96%87%E6%A1%A3%E8%AF%8D%E5%85%B8%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452648/%E6%96%87%E6%A1%A3%E8%AF%8D%E5%85%B8%E7%BB%9F%E8%AE%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const base_remote_url = "https://api.12gm.com/";
    const module_name = 'dictionary';
    const local_tokenname = 'doc_dict_username';
    let new_words = [];
    let filterwords = [];
    const cssUrls = [];
    const jsUrls = [];

    function init() {
        const up_html = getInitHtml();
        let wcountPanel = document.querySelector('.wcount-panel');
        if (!wcountPanel) {
            wcountPanel = createWcountPanel();
        }

        let shadowHost = wcountPanel.querySelector('#shadow-host');
        if (!shadowHost) {
            shadowHost = document.createElement('div');
            shadowHost.id = 'wcount-shadow-host';
            wcountPanel.appendChild(shadowHost);
        }

        if (!shadowHost.shadowRoot) {
            shadowHost.attachShadow({ mode: 'open' });
        }
        shadowHost.shadowRoot.innerHTML = up_html;

        const shadowRoot = shadowHost.shadowRoot;
        $(shadowRoot).ready(function () {
            $(shadowRoot).find('.button-27').click(function () {
                setWordsToTextarea(shadowRoot);
                $(shadowRoot).find('#wp').toggle();
            });
            const { precent, words, unread_words } = getUserWordsCount(``,shadowRoot);
            setWordsToTextarea(shadowRoot);

            // $(shadowRoot).find('#sortedBtn').click(function () {
            //     displaySortedWords(shadowRoot);
            // });

            // $(shadowRoot).find('#categorizedBtn').click(function () {
            //     displayCategorizedWords(shadowRoot);
            // });
        });
    }

    function createWcountPanel() {
        const wcountPanel = document.createElement('div');
        wcountPanel.classList.add('wcount-panel');
        wcountPanel.style.display = 'block';
        wcountPanel.style.width = '0px';
        wcountPanel.style.height = '0px';
        wcountPanel.style.margin = '0px';
        wcountPanel.style.padding = '0px';
        wcountPanel.style.borderWidth = 'initial';
        wcountPanel.style.borderStyle = 'none';
        wcountPanel.style.borderColor = 'initial';
        wcountPanel.style.borderImage = 'initial';
        wcountPanel.style.outline = 'none';
        document.body.appendChild(wcountPanel);
        return wcountPanel;
    }

    function displaySortedWords(shadowRoot) {
        let tableBody = $(shadowRoot).find('#words_table tbody');
        tableBody.empty(); // Clear the table body

        new_words.sort(); // Sort words in ascending order

        const maxColumns = 20;
        let columns = [];  // Array to hold multiple columns (each with a max of 20 words)

        // Split the words into groups of max 20 words per column
        for (let i = 0; i < new_words.length; i += maxColumns) {
            columns.push(new_words.slice(i, i + maxColumns));
        }

        // Create the table rows with words grouped in columns
        const numRows = columns[0].length; // Number of rows in the first column (they should all have the same number of rows)

        // Loop through the rows
        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            let rowHtml = '<tr>'; // Start a new row

            // Loop through each column
            columns.forEach(function (column) {
                // Add word for this row in each column
                rowHtml += `<td>${column[rowIndex] || ''}</td>`;
            });

            rowHtml += '</tr>'; // End the row
            tableBody.append(rowHtml); // Add the row to the table
        }
    }
    function displayCategorizedWords(shadowRoot) {
        let tableBody = $(shadowRoot).find('#words_table tbody');
        tableBody.empty(); // Clear the table body

        let categorized = {};

        // Group words by their first letter
        new_words.forEach(function (word) {
            let firstLetter = word.charAt(0).toUpperCase();
            if (!categorized[firstLetter]) {
                categorized[firstLetter] = [];
            }
            categorized[firstLetter].push(word);
        });

        // Split each category into multiple columns if the count exceeds 30
        let maxColumnWords = 30;
        let columns = {}; // Store columns for each category

        Object.keys(categorized).forEach(function (letter) {
            let words = categorized[letter];

            // Create columns for categories with more than maxColumnWords
            let columnsForLetter = [];
            for (let i = 0; i < words.length; i += maxColumnWords) {
                columnsForLetter.push(words.slice(i, i + maxColumnWords));
            }

            columns[letter] = columnsForLetter; // Store the columns for the letter
        });

        // Generate table headers (one per column)
        let headerRowHtml = '<tr>';
        Object.keys(columns).forEach(function (letter) {
            headerRowHtml += `<th>${letter}</th>`;
        });
        headerRowHtml += '</tr>';
        tableBody.append(headerRowHtml); // Add headers to the table

        // Determine the maximum number of rows based on the number of columns in any category
        let maxRows = 0;
        Object.keys(columns).forEach(function (letter) {
            maxRows = Math.max(maxRows, columns[letter].length);
        });

        // Create rows, filling in columns for each letter
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            let rowHtml = '<tr>'; // Start a new row

            Object.keys(columns).forEach(function (letter) {
                // If the column has a word for this row, add it; otherwise, add an empty cell
                rowHtml += `<td>${columns[letter][rowIndex] ? columns[letter][rowIndex].join('<br>') : ''}</td>`;
            });

            rowHtml += '</tr>'; // End the row
            tableBody.append(rowHtml); // Add the row to the table
        }
    }

    function setWordsToTextarea(shadowRoot) {
        let wordsText = new_words.join('\n');
        $(shadowRoot).find('#words_textarea').val(wordsText);
    }

    function getUserWordsCount(readwords = "",shadowRoot) {
        readwords = readwords.split(',');
        const words = getDocumentWords();
        const unread_words = words.filter(item => !readwords.includes(item));
        const precent = ((unread_words.length / words.length) * 100).toFixed(2);

        let shadowRootDoc = shadowRoot || document.querySelector('#wcount-shadow-host').shadowRoot;
        $(shadowRootDoc).find('#sw').text(words.length);

        return { precent, words, unread_words };
    }

    function getDocumentWords() {
        let words = [...(
            new Set(
                document.documentElement.textContent.split(/[^a-zA-Z]/)
                    .join(" ").split(/(?<=[a-z])\B(?=[A-Z])/)
                    .join(" ").split(/\s+/)
            )
        )];

        const isNotWord = /^[a-z]+[A-Z]$/;
        for (let word of words) {
            if (isNotWord.test(word) || word.length < 3) {
                if (!filterwords.includes(word)) {
                    filterwords.push(word);
                }
            } else {
                if (!new_words.includes(word)) {
                    new_words.push(word);
                }
            }
        }

        return new_words;
    }

    function splitHtml(html) {
        return html.replaceAll(/<.+?>/g, '');
    }

    function getInitHtml() {
        const styleContent = getStyleContent()
        let html = `
            <style>${styleContent}</style>
<div>
    <div class="fixed-bottom-right">
        <button class="button-27" >Words : <span id="sw">-</span></button>
        <button class="button-85">Unread : <span id="ur">-</span></button>
    </div>
    <div class="fixed-bottom-right bottom_h60 wp-gd" id="wp" style="display: none;">

        <fieldset class="pure-group">
            <textarea class="pure-input-2-3 mh600" id="words_textarea" placeholder="Textareas work too"></textarea>
        </fieldset>

        <div style="display: none;">
            <div class="p10">
                <button class="button-6" id="sortedBtn">Sorted in order</button>
                <button class="button-6" id="categorizedBtn">Categorized by letters</button>
            </div>
            <table class="pure-table" id="words_table">
                <thead>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="tip" style="background-color: #8b1a02;" id="wtnbbcount" style="display: none;">
    <div class="tip-trangle-bottom"></div>
    单词添加成功提示:<br/>
    <span></span>
</div>

<div class="add_worddivbutton" style="display: none;">
    <span class="badge_chat-number"></span>
    <a href="javascript:void(0)" data-click="put_group" class="aw pure-button pure-button-primary">
        <span>提交本页<br><font class='ac'>-</font><br>个词</span>
    </a>
    <input type="button" class="tds_app_lb tds_f pure-button" data-click="check_local_user" value="打开菜单">
</div>

<div class="tds_app_l" style="display: none;">
    <form class="pure-form pure-form-stacked">
        <fieldset>
            <legend>A Stacked Form</legend>
            <label for="stacked-email">Email</label>
            <input id="stacked-email" type="email" placeholder="Email" />
            <span class="pure-form-message">This is a required field.</span>
            <label for="stacked-password">Password</label>
            <input id="stacked-password" type="password" placeholder="Password" />
            <label for="stacked-state">State</label>
            <select id="stacked-state">
                <option>AL</option>
                <option>CA</option>
                <option>IL</option>
            </select>
            <label for="stacked-remember" class="pure-checkbox">
                <input id="stacked-remember" type="checkbox" /> Remember me
            </label>
            <button type="submit" class="pure-button pure-button-primary">Sign in</button>
        </fieldset>
    </form>
</div>

            `
        return html
    }
    function getStyleContent() {
        return `
            html {
                line-height: 1.15;
                -webkit-text-size-adjust: 100%
            }

            body {
                margin: 0
            }

            main {
                display: block
            }

            h1 {
                font-size: 2em;
                margin: .67em 0
            }

            hr {
                box-sizing: content-box;
                height: 0;
                overflow: visible
            }

            pre {
                font-family: monospace, monospace;
                font-size: 1em
            }

            a {
                background-color: transparent
            }

            abbr[title] {
                border-bottom: none;
                text-decoration: underline;
                -webkit-text-decoration: underline dotted;
                text-decoration: underline dotted
            }

            b,
            strong {
                font-weight: bolder
            }

            code,
            kbd,
            samp {
                font-family: monospace, monospace;
                font-size: 1em
            }

            small {
                font-size: 80%
            }

            sub,
            sup {
                font-size: 75%;
                line-height: 0;
                position: relative;
                vertical-align: baseline
            }

            sub {
                bottom: -.25em
            }

            sup {
                top: -.5em
            }

            img {
                border-style: none
            }

            button,
            input,
            optgroup,
            select,
            textarea {
                font-family: inherit;
                font-size: 100%;
                line-height: 1.15;
                margin: 0
            }

            button,
            input {
                overflow: visible
            }

            button,
            select {
                text-transform: none
            }

            [type=button],
            [type=reset],
            [type=submit],
            button {
                -webkit-appearance: button
            }

            [type=button]::-moz-focus-inner,
            [type=reset]::-moz-focus-inner,
            [type=submit]::-moz-focus-inner,
            button::-moz-focus-inner {
                border-style: none;
                padding: 0
            }

            [type=button]:-moz-focusring,
            [type=reset]:-moz-focusring,
            [type=submit]:-moz-focusring,
            button:-moz-focusring {
                outline: 1px dotted ButtonText
            }

            fieldset {
                padding: .35em .75em .625em
            }

            legend {
                box-sizing: border-box;
                color: inherit;
                display: table;
                max-width: 100%;
                padding: 0;
                white-space: normal
            }

            progress {
                vertical-align: baseline
            }

            textarea {
                overflow: auto
            }

            [type=checkbox],
            [type=radio] {
                box-sizing: border-box;
                padding: 0
            }

            [type=number]::-webkit-inner-spin-button,
            [type=number]::-webkit-outer-spin-button {
                height: auto
            }

            [type=search] {
                -webkit-appearance: textfield;
                outline-offset: -2px
            }

            [type=search]::-webkit-search-decoration {
                -webkit-appearance: none
            }

            ::-webkit-file-upload-button {
                -webkit-appearance: button;
                font: inherit
            }

            details {
                display: block
            }

            summary {
                display: list-item
            }

            template {
                display: none
            }

            [hidden] {
                display: none
            }

            html {
                font-family: sans-serif
            }

            .hidden,
            [hidden] {
                display: none !important
            }

            .pure-img {
                max-width: 100%;
                height: auto;
                display: block
            }

            .pure-g {
                display: flex;
                flex-flow: row wrap;
                align-content: flex-start
            }

            .pure-u {
                display: inline-block;
                vertical-align: top
            }

            .pure-u-1,
            .pure-u-1-1,
            .pure-u-1-12,
            .pure-u-1-2,
            .pure-u-1-24,
            .pure-u-1-3,
            .pure-u-1-4,
            .pure-u-1-5,
            .pure-u-1-6,
            .pure-u-1-8,
            .pure-u-10-24,
            .pure-u-11-12,
            .pure-u-11-24,
            .pure-u-12-24,
            .pure-u-13-24,
            .pure-u-14-24,
            .pure-u-15-24,
            .pure-u-16-24,
            .pure-u-17-24,
            .pure-u-18-24,
            .pure-u-19-24,
            .pure-u-2-24,
            .pure-u-2-3,
            .pure-u-2-5,
            .pure-u-20-24,
            .pure-u-21-24,
            .pure-u-22-24,
            .pure-u-23-24,
            .pure-u-24-24,
            .pure-u-3-24,
            .pure-u-3-4,
            .pure-u-3-5,
            .pure-u-3-8,
            .pure-u-4-24,
            .pure-u-4-5,
            .pure-u-5-12,
            .pure-u-5-24,
            .pure-u-5-5,
            .pure-u-5-6,
            .pure-u-5-8,
            .pure-u-6-24,
            .pure-u-7-12,
            .pure-u-7-24,
            .pure-u-7-8,
            .pure-u-8-24,
            .pure-u-9-24 {
                display: inline-block;
                letter-spacing: normal;
                word-spacing: normal;
                vertical-align: top;
                text-rendering: auto
            }

            .pure-u-1-24 {
                width: 4.1667%
            }

            .pure-u-1-12,
            .pure-u-2-24 {
                width: 8.3333%
            }

            .pure-u-1-8,
            .pure-u-3-24 {
                width: 12.5%
            }

            .pure-u-1-6,
            .pure-u-4-24 {
                width: 16.6667%
            }

            .pure-u-1-5 {
                width: 20%
            }

            .pure-u-5-24 {
                width: 20.8333%
            }

            .pure-u-1-4,
            .pure-u-6-24 {
                width: 25%
            }

            .pure-u-7-24 {
                width: 29.1667%
            }

            .pure-u-1-3,
            .pure-u-8-24 {
                width: 33.3333%
            }

            .pure-u-3-8,
            .pure-u-9-24 {
                width: 37.5%
            }

            .pure-u-2-5 {
                width: 40%
            }

            .pure-u-10-24,
            .pure-u-5-12 {
                width: 41.6667%
            }

            .pure-u-11-24 {
                width: 45.8333%
            }

            .pure-u-1-2,
            .pure-u-12-24 {
                width: 50%
            }

            .pure-u-13-24 {
                width: 54.1667%
            }

            .pure-u-14-24,
            .pure-u-7-12 {
                width: 58.3333%
            }

            .pure-u-3-5 {
                width: 60%
            }

            .pure-u-15-24,
            .pure-u-5-8 {
                width: 62.5%
            }

            .pure-u-16-24,
            .pure-u-2-3 {
                width: 66.6667%
            }

            .pure-u-17-24 {
                width: 70.8333%
            }

            .pure-u-18-24,
            .pure-u-3-4 {
                width: 75%
            }

            .pure-u-19-24 {
                width: 79.1667%
            }

            .pure-u-4-5 {
                width: 80%
            }

            .pure-u-20-24,
            .pure-u-5-6 {
                width: 83.3333%
            }

            .pure-u-21-24,
            .pure-u-7-8 {
                width: 87.5%
            }

            .pure-u-11-12,
            .pure-u-22-24 {
                width: 91.6667%
            }

            .pure-u-23-24 {
                width: 95.8333%
            }

            .pure-u-1,
            .pure-u-1-1,
            .pure-u-24-24,
            .pure-u-5-5 {
                width: 100%
            }

            .pure-button {
                display: inline-block;
                line-height: normal;
                white-space: nowrap;
                vertical-align: middle;
                text-align: center;
                cursor: pointer;
                -webkit-user-drag: none;
                -webkit-user-select: none;
                user-select: none;
                box-sizing: border-box
            }

            .pure-button::-moz-focus-inner {
                padding: 0;
                border: 0
            }

            .pure-button-group {
                letter-spacing: -.31em;
                text-rendering: optimizespeed
            }

            .opera-only :-o-prefocus,
            .pure-button-group {
                word-spacing: -0.43em
            }

            .pure-button-group .pure-button {
                letter-spacing: normal;
                word-spacing: normal;
                vertical-align: top;
                text-rendering: auto
            }

            .pure-button {
                font-family: inherit;
                font-size: 100%;
                padding: .5em 1em;
                color: rgba(0, 0, 0, .8);
                border: none transparent;
                background-color: #e6e6e6;
                text-decoration: none;
                border-radius: 2px
            }

            .pure-button-hover,
            .pure-button:focus,
            .pure-button:hover {
                background-image: linear-gradient(transparent, rgba(0, 0, 0, .05) 40%, rgba(0, 0, 0, .1))
            }

            .pure-button:focus {
                outline: 0
            }

            .pure-button-active,
            .pure-button:active {
                box-shadow: 0 0 0 1px rgba(0, 0, 0, .15) inset, 0 0 6px rgba(0, 0, 0, .2) inset;
                border-color: #000
            }

            .pure-button-disabled,
            .pure-button-disabled:active,
            .pure-button-disabled:focus,
            .pure-button-disabled:hover,
            .pure-button[disabled] {
                border: none;
                background-image: none;
                opacity: .4;
                cursor: not-allowed;
                box-shadow: none;
                pointer-events: none
            }

            .pure-button-hidden {
                display: none
            }

            .pure-button-primary,
            .pure-button-selected,
            a.pure-button-primary,
            a.pure-button-selected {
                background-color: #0078e7;
                color: #fff
            }

            .pure-button-group .pure-button {
                margin: 0;
                border-radius: 0;
                border-right: 1px solid rgba(0, 0, 0, .2)
            }

            .pure-button-group .pure-button:first-child {
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px
            }

            .pure-button-group .pure-button:last-child {
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                border-right: none
            }

            .pure-form input[type=color],
            .pure-form input[type=date],
            .pure-form input[type=datetime-local],
            .pure-form input[type=datetime],
            .pure-form input[type=email],
            .pure-form input[type=month],
            .pure-form input[type=number],
            .pure-form input[type=password],
            .pure-form input[type=search],
            .pure-form input[type=tel],
            .pure-form input[type=text],
            .pure-form input[type=time],
            .pure-form input[type=url],
            .pure-form input[type=week],
            .pure-form select,
            .pure-form textarea {
                padding: .5em .6em;
                display: inline-block;
                border: 1px solid #ccc;
                box-shadow: inset 0 1px 3px #ddd;
                border-radius: 4px;
                vertical-align: middle;
                box-sizing: border-box
            }

            .pure-form input:not([type]) {
                padding: .5em .6em;
                display: inline-block;
                border: 1px solid #ccc;
                box-shadow: inset 0 1px 3px #ddd;
                border-radius: 4px;
                box-sizing: border-box
            }

            .pure-form input[type=color] {
                padding: .2em .5em
            }

            .pure-form input[type=color]:focus,
            .pure-form input[type=date]:focus,
            .pure-form input[type=datetime-local]:focus,
            .pure-form input[type=datetime]:focus,
            .pure-form input[type=email]:focus,
            .pure-form input[type=month]:focus,
            .pure-form input[type=number]:focus,
            .pure-form input[type=password]:focus,
            .pure-form input[type=search]:focus,
            .pure-form input[type=tel]:focus,
            .pure-form input[type=text]:focus,
            .pure-form input[type=time]:focus,
            .pure-form input[type=url]:focus,
            .pure-form input[type=week]:focus,
            .pure-form select:focus,
            .pure-form textarea:focus {
                outline: 0;
                border-color: #129fea
            }

            .pure-form input:not([type]):focus {
                outline: 0;
                border-color: #129fea
            }

            .pure-form input[type=checkbox]:focus,
            .pure-form input[type=file]:focus,
            .pure-form input[type=radio]:focus {
                outline: thin solid #129FEA;
                outline: 1px auto #129FEA
            }

            .pure-form .pure-checkbox,
            .pure-form .pure-radio {
                margin: .5em 0;
                display: block
            }

            .pure-form input[type=color][disabled],
            .pure-form input[type=date][disabled],
            .pure-form input[type=datetime-local][disabled],
            .pure-form input[type=datetime][disabled],
            .pure-form input[type=email][disabled],
            .pure-form input[type=month][disabled],
            .pure-form input[type=number][disabled],
            .pure-form input[type=password][disabled],
            .pure-form input[type=search][disabled],
            .pure-form input[type=tel][disabled],
            .pure-form input[type=text][disabled],
            .pure-form input[type=time][disabled],
            .pure-form input[type=url][disabled],
            .pure-form input[type=week][disabled],
            .pure-form select[disabled],
            .pure-form textarea[disabled] {
                cursor: not-allowed;
                background-color: #eaeded;
                color: #cad2d3
            }

            .pure-form input:not([type])[disabled] {
                cursor: not-allowed;
                background-color: #eaeded;
                color: #cad2d3
            }

            .pure-form input[readonly],
            .pure-form select[readonly],
            .pure-form textarea[readonly] {
                background-color: #eee;
                color: #777;
                border-color: #ccc
            }

            .pure-form input:focus:invalid,
            .pure-form select:focus:invalid,
            .pure-form textarea:focus:invalid {
                color: #b94a48;
                border-color: #e9322d
            }

            .pure-form input[type=checkbox]:focus:invalid:focus,
            .pure-form input[type=file]:focus:invalid:focus,
            .pure-form input[type=radio]:focus:invalid:focus {
                outline-color: #e9322d
            }

            .pure-form select {
                height: 2.25em;
                border: 1px solid #ccc;
                background-color: #fff
            }

            .pure-form select[multiple] {
                height: auto
            }

            .pure-form label {
                margin: .5em 0 .2em
            }

            .pure-form fieldset {
                margin: 0;
                padding: .35em 0 .75em;
                border: 0
            }

            .pure-form legend {
                display: block;
                width: 100%;
                padding: .3em 0;
                margin-bottom: .3em;
                color: #333;
                border-bottom: 1px solid #e5e5e5
            }

            .pure-form-stacked input[type=color],
            .pure-form-stacked input[type=date],
            .pure-form-stacked input[type=datetime-local],
            .pure-form-stacked input[type=datetime],
            .pure-form-stacked input[type=email],
            .pure-form-stacked input[type=file],
            .pure-form-stacked input[type=month],
            .pure-form-stacked input[type=number],
            .pure-form-stacked input[type=password],
            .pure-form-stacked input[type=search],
            .pure-form-stacked input[type=tel],
            .pure-form-stacked input[type=text],
            .pure-form-stacked input[type=time],
            .pure-form-stacked input[type=url],
            .pure-form-stacked input[type=week],
            .pure-form-stacked label,
            .pure-form-stacked select,
            .pure-form-stacked textarea {
                display: block;
                margin: .25em 0
            }

            .pure-form-stacked input:not([type]) {
                display: block;
                margin: .25em 0
            }

            .pure-form-aligned input,
            .pure-form-aligned select,
            .pure-form-aligned textarea,
            .pure-form-message-inline {
                display: inline-block;
                vertical-align: middle
            }

            .pure-form-aligned textarea {
                vertical-align: top
            }

            .pure-form-aligned .pure-control-group {
                margin-bottom: .5em
            }

            .pure-form-aligned .pure-control-group label {
                text-align: right;
                display: inline-block;
                vertical-align: middle;
                width: 10em;
                margin: 0 1em 0 0
            }

            .pure-form-aligned .pure-controls {
                margin: 1.5em 0 0 11em
            }

            .pure-form .pure-input-rounded,
            .pure-form input.pure-input-rounded {
                border-radius: 2em;
                padding: .5em 1em
            }

            .pure-form .pure-group fieldset {
                margin-bottom: 10px
            }

            .pure-form .pure-group input,
            .pure-form .pure-group textarea {
                display: block;
                padding: 10px;
                margin: 0 0 -1px;
                border-radius: 0;
                position: relative;
                top: -1px
            }

            .pure-form .pure-group input:focus,
            .pure-form .pure-group textarea:focus {
                z-index: 3
            }

            .pure-form .pure-group input:first-child,
            .pure-form .pure-group textarea:first-child {
                top: 1px;
                border-radius: 4px 4px 0 0;
                margin: 0
            }

            .pure-form .pure-group input:first-child:last-child,
            .pure-form .pure-group textarea:first-child:last-child {
                top: 1px;
                border-radius: 4px;
                margin: 0
            }

            .pure-form .pure-group input:last-child,
            .pure-form .pure-group textarea:last-child {
                top: -2px;
                border-radius: 0 0 4px 4px;
                margin: 0
            }

            .pure-form .pure-group button {
                margin: .35em 0
            }

            .pure-form .pure-input-1 {
                width: 100%
            }

            .pure-form .pure-input-3-4 {
                width: 75%
            }

            .pure-form .pure-input-2-3 {
                width: 66%
            }

            .pure-form .pure-input-1-2 {
                width: 50%
            }

            .pure-form .pure-input-1-3 {
                width: 33%
            }

            .pure-form .pure-input-1-4 {
                width: 25%
            }

            .pure-form-message-inline {
                display: inline-block;
                padding-left: .3em;
                color: #666;
                vertical-align: middle;
                font-size: .875em
            }

            .pure-form-message {
                display: block;
                color: #666;
                font-size: .875em
            }

            @media only screen and (max-width :480px) {
                .pure-form button[type=submit] {
                    margin: .7em 0 0
                }

                .pure-form input:not([type]),
                .pure-form input[type=color],
                .pure-form input[type=date],
                .pure-form input[type=datetime-local],
                .pure-form input[type=datetime],
                .pure-form input[type=email],
                .pure-form input[type=month],
                .pure-form input[type=number],
                .pure-form input[type=password],
                .pure-form input[type=search],
                .pure-form input[type=tel],
                .pure-form input[type=text],
                .pure-form input[type=time],
                .pure-form input[type=url],
                .pure-form input[type=week],
                .pure-form label {
                    margin-bottom: .3em;
                    display: block
                }

                .pure-group input:not([type]),
                .pure-group input[type=color],
                .pure-group input[type=date],
                .pure-group input[type=datetime-local],
                .pure-group input[type=datetime],
                .pure-group input[type=email],
                .pure-group input[type=month],
                .pure-group input[type=number],
                .pure-group input[type=password],
                .pure-group input[type=search],
                .pure-group input[type=tel],
                .pure-group input[type=text],
                .pure-group input[type=time],
                .pure-group input[type=url],
                .pure-group input[type=week] {
                    margin-bottom: 0
                }

                .pure-form-aligned .pure-control-group label {
                    margin-bottom: .3em;
                    text-align: left;
                    display: block;
                    width: 100%
                }

                .pure-form-aligned .pure-controls {
                    margin: 1.5em 0 0 0
                }

                .pure-form-message,
                .pure-form-message-inline {
                    display: block;
                    font-size: .75em;
                    padding: .2em 0 .8em
                }
            }

            .pure-menu {
                box-sizing: border-box
            }

            .pure-menu-fixed {
                position: fixed;
                left: 0;
                top: 0;
                z-index: 3
            }

            .pure-menu-item,
            .pure-menu-list {
                position: relative
            }

            .pure-menu-list {
                list-style: none;
                margin: 0;
                padding: 0
            }

            .pure-menu-item {
                padding: 0;
                margin: 0;
                height: 100%
            }

            .pure-menu-heading,
            .pure-menu-link {
                display: block;
                text-decoration: none;
                white-space: nowrap
            }

            .pure-menu-horizontal {
                width: 100%;
                white-space: nowrap
            }

            .pure-menu-horizontal .pure-menu-list {
                display: inline-block
            }

            .pure-menu-horizontal .pure-menu-heading,
            .pure-menu-horizontal .pure-menu-item,
            .pure-menu-horizontal .pure-menu-separator {
                display: inline-block;
                vertical-align: middle
            }

            .pure-menu-item .pure-menu-item {
                display: block
            }

            .pure-menu-children {
                display: none;
                position: absolute;
                left: 100%;
                top: 0;
                margin: 0;
                padding: 0;
                z-index: 3
            }

            .pure-menu-horizontal .pure-menu-children {
                left: 0;
                top: auto;
                width: inherit
            }

            .pure-menu-active>.pure-menu-children,
            .pure-menu-allow-hover:hover>.pure-menu-children {
                display: block;
                position: absolute
            }

            .pure-menu-has-children>.pure-menu-link:after {
                padding-left: .5em;
                content: "\\25B8";
                font-size: small
            }

            .pure-menu-horizontal .pure-menu-has-children>.pure-menu-link:after {
                content: "\\25BE"
            }

            .pure-menu-scrollable {
                overflow-y: scroll;
                overflow-x: hidden
            }

            .pure-menu-scrollable .pure-menu-list {
                display: block
            }

            .pure-menu-horizontal.pure-menu-scrollable .pure-menu-list {
                display: inline-block
            }

            .pure-menu-horizontal.pure-menu-scrollable {
                white-space: nowrap;
                overflow-y: hidden;
                overflow-x: auto;
                padding: .5em 0
            }

            .pure-menu-horizontal .pure-menu-children .pure-menu-separator,
            .pure-menu-separator {
                background-color: #ccc;
                height: 1px;
                margin: .3em 0
            }

            .pure-menu-horizontal .pure-menu-separator {
                width: 1px;
                height: 1.3em;
                margin: 0 .3em
            }

            .pure-menu-horizontal .pure-menu-children .pure-menu-separator {
                display: block;
                width: auto
            }

            .pure-menu-heading {
                text-transform: uppercase;
                color: #565d64
            }

            .pure-menu-link {
                color: #777
            }

            .pure-menu-children {
                background-color: #fff
            }

            .pure-menu-heading,
            .pure-menu-link {
                padding: .5em 1em
            }

            .pure-menu-disabled {
                opacity: .5
            }

            .pure-menu-disabled .pure-menu-link:hover {
                background-color: transparent;
                cursor: default
            }

            .pure-menu-active>.pure-menu-link,
            .pure-menu-link:focus,
            .pure-menu-link:hover {
                background-color: #eee
            }

            .pure-menu-selected>.pure-menu-link,
            .pure-menu-selected>.pure-menu-link:visited {
                color: #000
            }

            .pure-table {
                border-collapse: collapse;
                border-spacing: 0;
                empty-cells: show;
                border: 1px solid #cbcbcb
            }

            .pure-table caption {
                color: #000;
                font: italic 85%/1 arial, sans-serif;
                padding: 1em 0;
                text-align: center
            }

            .pure-table td,
            .pure-table th {
                border-left: 1px solid #cbcbcb;
                border-width: 0 0 0 1px;
                font-size: 12px;
                margin: 0;
                overflow: visible;
                padding: 0em 1em
            }

            .pure-table thead {
                background-color: #e0e0e0;
                color: #000;
                text-align: left;
                vertical-align: bottom
            }

            .pure-table td {
                background-color: transparent
            }

            .pure-table-odd td {
                background-color: #f2f2f2
            }

            .pure-table-striped tr:nth-child(2n-1) td {
                background-color: #f2f2f2
            }

            .pure-table-bordered td {
                border-bottom: 1px solid #cbcbcb
            }

            .pure-table-bordered tbody>tr:last-child>td {
                border-bottom-width: 0
            }

            .pure-table-horizontal td,
            .pure-table-horizontal th {
                border-width: 0 0 1px 0;
                border-bottom: 1px solid #cbcbcb
            }

            .pure-table-horizontal tbody>tr:last-child>td {
                border-bottom-width: 0
            }
         .fixed-bottom-right {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }.fixed-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
}

.button-6 {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 12px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  padding: 4px 8px;
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}


.button-6:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
.button-27 {
  appearance: none;
  background-color: #000000;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: Roobert,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 12px;
  line-height: normal;
  margin: 0;
  min-width: 0;
  outline: none;
  padding: 8px 8px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  will-change: transform;
}

.button-27:disabled {
  pointer-events: none;
}

.button-27:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.button-27:active {
  box-shadow: none;
  transform: translateY(0);
}
.button-85 {
  padding: 2px 8px;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-85:before {
  content: "";
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff7300,
    #fffb00,
    #48ff00,
    #00ffd5,
    #002bff,
    #7a00ff,
    #ff00c8,
    #ff0000
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing-button-85 20s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing-button-85 {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.button-85:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #222;
  left: 0;
  top: 0;
  border-radius: 10px;
}
            .button-54 {
                font-family: "Open Sans", sans-serif;
                font-size: 12px;
                text-decoration: none;
                text-transform: uppercase;
                color: #000;
                cursor: pointer;
                border: 3px solid;
                box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .button-54:active {
                box-shadow: 0px 0px 0px 0px;
                top: 5px;
                left: 5px;
            }

            @media (min-width: 768px) {
                .button-54 {
                    padding: 0.25em 0.75em;
                }
            }

            .wcount-panel {
                display: block !important;
                width: 0px !important;
                height: 0px !important;
                margin: 0px !important;
                padding: 0px !important;
                border-width: initial !important;
                border-style: none !important;
                border-color: initial !important;
                border-image: initial !important;
                outline: none !important;
            }
            .mh300{
                min-height:200px;
                }

                .mh600{
                    min-height:600px;
                    }
            .wp-gd{
                background-image: linear-gradient(to right bottom, #051937, #004d7a, #008793, #00bf72, #a8eb12);
                min-height:200px;
                min-width:300px;
                }
                .bottom_h60{
                    bottom:60px
                }
                .p10{
                    padding:10px;
                }
            `
    }
    window.addEventListener('load', function () {
        init()
    }, false);
})();