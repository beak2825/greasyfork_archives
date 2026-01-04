// ==UserScript==
// @name         Google Translate English split words
// @name:en      Google Translate English split words
// @name:zh-CN   Google Translate English split words
// @name:zh-TW   Google Translate English split words
// @name:ja      Google Translate English split words
// @name:ko      Google Translate English split words
// @name:de      Google Translate English split words
// @name:fr      Google Translate English split words
// @name:es      Google Translate English split words
// @name:pt      Google Translate English split words
// @name:ru      Google Translate English split words
// @name:it      Google Translate English split words
// @name:tr      Google Translate English split words
// @name:ar      Google Translate English split words
// @name:th      Google Translate English split words
// @name:vi      Google Translate English split words
// @name:id      Google Translate English split words
// @namespace   Violentmonkey Scripts
// @match       *://translate.google.com/*
// @version     XiaoYing_2023.05.25.22
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @description Violentmonkey Scripts
// @description:en Violentmonkey Scripts
// @description:zh-CN Violentmonkey 脚本
// @description:zh-TW Violentmonkey 腳本
// @description:ja Violentmonkey スクリプト
// @description:ko Violentmonkey 스크립트
// @description:de Violentmonkey Skripte
// @description:fr Violentmonkey Scripts
// @description:es Violentmonkey Scripts
// @description:pt Violentmonkey Scripts
// @description:ru Violentmonkey Сценарии
// @description:it Violentmonkey Scripts
// @description:tr Violentmonkey Scripts
// @description:ar Violentmonkey Scripts
// @description:th Violentmonkey Scripts
// @description:vi Violentmonkey Scripts
// @description:id Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/465359/Google%20Translate%20English%20split%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/465359/Google%20Translate%20English%20split%20words.meta.js
// ==/UserScript==


var GlobalVariable = new Map();

var ProcessRules = new Map();

ProcessRules.set('convertToTitleCase_01', (Text) => {
    return convertToTitleCase(Text, '_');
});

ProcessRules.set('convertToTitleCase_02', (Text) => {
    return convertToTitleCase(Text, '-');
});

ProcessRules.set('UppercaseSplitWords', (Text) => {
    return Text.replace(/(?<!\s)([A-Z])/g, ' $1').trim();
});

function ProcessText(textarea) {
    if (GlobalVariable.get('InputIng') === 1) {
        return null;
    }
    let text = textarea.val();
    if (!containsEnglishLetter(text)) {
        return null;
    }
    if (text == '') {
        return null;
    }
    GlobalVariable.set('InputIng', 1);
    let oldLength = text.length;
    let newText = text;
    for (const item of ProcessRules.values()) {
        newText = item(newText);
        if (newText !== text) {
            break;
        }
    }
    if (newText === text) {
        GlobalVariable.set('InputIng', 0);
        return null;
    }
    let newLength = newText.length;
    global_module.AnalogInput.AnalogInput(textarea[0], newText);
    GlobalVariable.set('InputIng', 0);
    let oldChanges = GlobalVariable.get('IgnoreChanges');
    GlobalVariable.set('IgnoreChanges', oldChanges + 1);
    return newLength - oldLength;
}

function convertToTitleCase(Text, separator) {
    let regx = new RegExp(separator, 'g');
    const words = Text.replace(regx, ' ').split(' ');
    if (words.length == 1) {
        return Text;
    }
    const titleCaseWords = words.map((word) => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
    });
    return titleCaseWords.join(' ');
}

function containsEnglishLetter(str) {
    for (let i = 0; i < str.length; i++) {
        if (i > 1000) {
            break;
        }
        const charCode = str.charCodeAt(i);
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
            return true;
        }
    }
    return false;
}

async function main() {
    let textarea = await global_module.waitForElement('textarea[class][jsname]');
    let polite = await global_module.waitForElement("div[aria-live='polite']");
    textarea = textarea.eq(0);
    GlobalVariable.set('InputIng', 0);
    GlobalVariable.set('IgnoreChanges', 0);
    let MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver || unsafeWindow.MozMutationObserver;
    let observer = new MutationObserver(
        global_module.debounce(() => {
            if (GlobalVariable.get('IgnoreChanges') !== 0) {
                let oldChanges = GlobalVariable.get('IgnoreChanges');
                GlobalVariable.set('IgnoreChanges', oldChanges - 1);
                return;
            }
            let selectionStart = textarea.prop('selectionStart');
            let selectionEnd = textarea.prop('selectionEnd');
            let index = ProcessText(textarea);
            if (index && index != 0) {
                selectionStart += index;
                selectionEnd += index;
            }
            textarea.prop('selectionStart', selectionStart);
            textarea.prop('selectionEnd', selectionEnd);
            textarea.focus();
        }),
        1000
    );
    observer.observe(polite[0], { childList: true, subtree: false });
}

main();
