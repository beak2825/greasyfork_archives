// ==UserScript==
// @name         Clarify Cognition over Ontology
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  所有的 /(.过)/ 改成 "自认为$1"
// @author       InQβ(no1xsyzy)
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415233/Clarify%20Cognition%20over%20Ontology.user.js
// @updateURL https://update.greasyfork.org/scripts/415233/Clarify%20Cognition%20over%20Ontology.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const debug = false;
    const $ = selector => document.querySelector(selector)
    const $$ = selector => Array.from(document.querySelectorAll(selector))
    const prepends = debug ? text => {
        console.log(text);
        const new_text = text.replace(/(.过)/, "自认为$1")
        console.log(new_text)
        return new_text
    } : text => text.replace(/(.过)/, "自认为$1")
    const do_prepend_textContent = debug? el => {
        console.log(el)
        el.textContent = prepends(el.textContent)
        console.log(el)
    } : el => {el.innerText = prepends(el.textContent)}

    const launchObserver = ({
        parentNode,
        selector,
        failCallback = null,
        successCallback = null,
        stopWhenSuccess = true,
        config = {
            childList: true,
            subtree: true
        }
    }) => {
        // if parent node does not exist, return
        if (!parentNode) { return }
        const observeFunc = mutationList => {
            if (!document.querySelector(selector)) {
                if (failCallback) { failCallback() }
                return
            }
            if (stopWhenSuccess) { observer.disconnect() }
            if (successCallback) { successCallback() }
        }
        const observer = new MutationObserver(observeFunc)
        observer.observe(parentNode, config)
    }
    if (debug){
        window.prepends = prepends
        window.do_prepend_textContent = do_prepend_textContent
        window.launchObserver = launchObserver
    }

    $$(`a[href$="collect"]`).forEach(do_prepend_textContent)
    $$(`ul.collect_dropmenu>li>a`).forEach(do_prepend_textContent)
    $$(`#subjectPanelCollect>ul div.innerWithAvatar>small`).forEach(do_prepend_textContent)
    $$(`#subjectPanelCollect>.tip_i a[href$="collections"]`).forEach(do_prepend_textContent)
    $$(`title`).forEach(do_prepend_textContent)
    $$(`.interest_now`).forEach(do_prepend_textContent)
    $$(`#SecTab span`).forEach(do_prepend_textContent)
//     launchObserver({
//         parentNode: $(`#TB_window`),
//         selector: `.collectType.cell label`,
//         successCallback: () => $$(`.collectType.cell label`).map(label => label.childNodes[1]).forEach(do_prepend_textContent)
//     })
    $$(`.collectType.cell label`).map(label => label.childNodes[1]).forEach(do_prepend_textContent)
})();
