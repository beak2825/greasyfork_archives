// ==UserScript==
// @name         Lute3助手
// @namespace    http://tampermonkey.net/
// @version      1.13.0
// @description  （中文用户）自动填写“原型”，“音标”和“释义”。'ctrl + s'保存单词信息。'ctrl + d'删除单词信息。'ctrl + g'一键清除解释并保存。
// @author       Neo
// @match        http://localhost:*/read/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497997/Lute3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/497997/Lute3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    autoFulfillForm();
    saveByCtrlPlusS();
    clearTranslation();
    deleteTerm();
})();

// 自动填写单词信息
function autoFulfillForm() {
    window.addEventListener('load', function() {
        let word = document.getElementById('text').value; // 获得单词
        word = word.replace(/\u200B/g,''); // 清理零宽空格

        if (document.getElementById('translation').value == ""){
            setImformation(word, false);
        }

    }, false);
}

// 填写表单，同时获取单词信息
function setImformation(word, originJudge, participleInformation = {}, cnt = 0) {
    let encodedWord = encodeURIComponent(word.toLowerCase());
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.iciba.com/word?w=${encodedWord}`,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            let wordInformation = {};
            wordInformation.word = word;

            const phonetics = doc.querySelectorAll('.Mean_symbols__fpCmS li');
            wordInformation.phoneticTexts = Array.from(phonetics).map(li => li.textContent.trim()).join(', ');

            let definitions = doc.querySelectorAll('.Mean_part__UI9M6 li');
            wordInformation.definitionTexts = Array.from(definitions).map(li => {
                const partOfSpeech = li.querySelector('i') ? li.querySelector('i').textContent.trim() : '';
                const definition = li.querySelector('div') ? li.querySelector('div').textContent.trim() : '';
                return `${partOfSpeech} ${definition}`;
            }).join('\n');


            wordInformation.parent = getParent(word, wordInformation.definitionTexts);

            if(wordInformation.definitionTexts != '') {
                // 如果是有原型，则添加原型。
                if(originJudge == false) {
                    if (wordInformation.parent != encodedWord) { // if have parent
                        setImformation(wordInformation.parent, true, wordInformation, cnt + 1);
                        return; // 如果有原型则跳出函数
                    }
                } else{ // have parent
                    if (wordInformation.parent != encodedWord && cnt < 3) { // if have parent
                        setImformation(wordInformation.parent, true, wordInformation, cnt + 1);
                        return; // 如果有原型则跳出函数
                    }
                    if(wordInformation.definitionTexts != participleInformation.definitionTexts) { // 解决短语重复添加问题
                        // wordInformation.definitionTexts = wordInformation.word + '\n' + wordInformation.definitionTexts + '\n\n' + participleInformation.word + '\n' + participleInformation.definitionTexts;
                        wordInformation.phoneticTexts = participleInformation.phoneticTexts;
                    }
                }

                addParent(wordInformation.parent);
                document.getElementById('translation').value = wordInformation.definitionTexts;
                document.getElementById('romanization').value = wordInformation.phoneticTexts;
                console.log(wordInformation);
                // auto submit
                setTimeout(function() { // 提交前延迟，为了等待 "Link to parent"
                    btnClick('btnsubmit');
                }, 500);
            }

        },
        onerror: function(error) {
            console.error('抓取数据时发生错误:', error);
        }
    });
}


// 添加一个快捷键:'ctrl + s'保存单词
// 已知问题：聚焦到右下角（词典部分）时无法使用快捷键
function saveByCtrlPlusS() {
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault(); // 阻止's'键的默认行为
            btnClick('btnsubmit');
        }
    }, true); // 使用true来在捕获阶段监听事件
}

// Click button
function btnClick(s) {
    try {
        var iframe = document.getElementById('wordframeid'); // 通过id获取iframe
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document; // 获取iframe的文档对象
        var deleteButton = innerDoc.getElementById(s); // 从iframe中获取'delete'按钮

        if (deleteButton) {
            deleteButton.click(); // 如果找到按钮，则点击它
        }
    } catch (error) {
        console.error('Error accessing the iframe document:', error);
        document.getElementById(s).click(); // Trigger the submit button click
    }
}

// 为单词添加原型(parents)
function addParent(parent) {
    const parentsContainer = document.querySelector('.tagify__input').parentNode;
    let parentTags = Array.from(parentsContainer.querySelectorAll('.tagify__tag')).map(tag => tag.getAttribute('value'));

    // Check whether 'parent' is already in 'parentTags', if not, add it
    if (!parentTags.includes(parent)) {
        parentTags.push(parent);

        // Create and insert the new tag
        const tag = document.createElement('tag');
        tag.setAttribute('title', parent);
        tag.setAttribute('contenteditable', 'false');
        tag.setAttribute('spellcheck', 'false');
        tag.setAttribute('tabindex', '-1');
        tag.setAttribute('class', 'tagify__tag');
        tag.setAttribute('value', parent);

        const xButton = document.createElement('x');
        xButton.setAttribute('title', '');
        xButton.setAttribute('class', 'tagify__tag__removeBtn');
        xButton.setAttribute('role', 'button');
        xButton.setAttribute('aria-label', 'remove tag');

        const div = document.createElement('div');
        const span = document.createElement('span');
        span.setAttribute('class', 'tagify__tag-text');
        span.textContent = parent;

        div.appendChild(span);
        tag.appendChild(xButton);
        tag.appendChild(div);

        parentsContainer.insertBefore(tag, parentsContainer.firstChild);

        // Update the hidden input's value
        const hiddenInput = document.getElementById('parentslist');
        hiddenInput.value = JSON.stringify(parentTags.map(tagValue => ({ value: tagValue })));
    }
}

// 从释义中获取单词原型
function getParent(word, definitionTexts) {
    // Use a regular expression to find a pattern of any letters followed by '的'
    const rootFormRegex = /(\b\w+)的/;
    const matches = definitionTexts.match(rootFormRegex);

    // If matches are found, return the first matched group which should be the root form
    if (matches && matches[1]) {
        return matches[1];
    }

    // If no matches are found, return the original word
    return word;
}

// 快捷键:'ctrl + g'清除翻译
function clearTranslation() {
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 71) {
            e.preventDefault();
            console.log('test');
            const iframeDocument = document.querySelector('iframe').contentDocument;
            const translationInput = iframeDocument.getElementById('translation');
            if (translationInput) {
                translationInput.focus(); // 将焦点设置到 translation 元素
                translationInput.value = '';
                btnClick('btnsubmit');
            } else {
                console.log('cannot find out');
            }
        }
    }, false);
}

// 快捷键:'ctrl + d'删除单词
function deleteTerm() {
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 68) {
            e.preventDefault(); // 阻止'd'键的默认行为
            btnClick('delete');
        }
    }, true); // 使用true来在捕获阶段监听事件
}