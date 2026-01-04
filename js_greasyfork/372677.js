// ==UserScript==
// @name         Stash issue helper
// @namespace    https://greasyfork.org/en/scripts/372677-stash-issue-helper
// @version      2.0.2
// @description  insert #mark#
// @author       刘言明
// @match        http://git.sankuai.com/*
// @grant        none
// @require 	 https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/372677/Stash%20issue%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/372677/Stash%20issue%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // key 请按字母顺序添加，位置按需求
    // 上下顺序决定了按钮的显示位置
    // 通常只需要添加即可；如果按钮有特殊操作可以修改下面的点击事件
    const mapping = Object.freeze({
        // id: [class, token]
        a: ['style-issue', '#代码风格#'],
        b: ['code-smell-suggestion', '#优雅建议#'],
        c: ['invalid-issue', '#无需修改#'],
        d: ['code-review-issue', '#CR#'],
    });

    let targetNodes = $("body");
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let mutationObserver = new MutationObserver (mutationHandler);
    let observeConfig = { childList: true, subtree: true };

    targetNodes.each(function() {
        mutationObserver.observe (this, observeConfig);
    });


    function mutationHandler(mutationRecords) {
        mutationRecords.forEach(function(mutation) {
            if (typeof mutation.addedNodes == "object") {
                const nodes = $(mutation.addedNodes);
                const lastButton = nodes.find('.buttons > button:last');
                for (let [className, token] of Object.values(mapping)) {
                    if (lastButton.hasClass(className)) {
                        return;
                    }
                }
                for (let [className, token] of Object.values(mapping)) {
                    nodes.find('.buttons').append(`<button class ='aui-button ${className} id-${Math.floor(Math.random() * 100)}' autocomplete ="off" style ="color: #ea580d;"> ${token} </button>`);
                }
            }
        });
    }

    $('body').on('click', '.comment-form-container .buttons button', function(e) {
        for (let tag in mapping) {
            let [className, token] = mapping[tag]
            if (tag === 'd') {
                if ($(this).hasClass(className)) {
                    e.preventDefault();
                    const text = prompt('格式：mis|content');
                    const [name, content = ''] = text.split(/\s*[|｜]\s*/);
                    if (!/[a-z]+\d{0,3}/.test(name)) {
                        alert(`mis 号 (${name}) 格式不正确`);
                        return;
                    }
                    handleTextarea($(this), `\`#CR#\` ${name} - ${content}`, { replace: true });
                    return;
                }
            } else {
                if ($(this).hasClass(className)) {
                    e.preventDefault();
                    handleTextarea($(this), `\`${token}\``);
                    return;
                }
            }
        }
    });

    function handleTextarea(that, tokenString, {replace = false} = {}) {
        let textarea = that.parents('.content').find('textarea.textarea').first();
        if (replace) {
            textarea.val(tokenString);
            textarea.focus();
        } else {
            let value = textarea.val()
            if (value.includes(tokenString)) {
                let regex = new RegExp(tokenString + "\\s?", 'i');
                textarea.val(value.replace(regex, ''));
                textarea.focus();
                return;
            }
            textarea.val(tokenString + ' ' + textarea.val());
            textarea.focus();
        }
    }

})();