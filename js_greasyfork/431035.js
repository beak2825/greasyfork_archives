// ==UserScript==
// @name         planner 名前わかるくん
// @namespace    https://fazerog02.dev
// @version      0.1.2
// @description  plannerの表示名を予め設定した対応表に応じて変換する拡張機能です
// @author       fazerog02
// @match        https://tasks.office.com/*
// @icon         https://tasks.office.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431035/planner%20%E5%90%8D%E5%89%8D%E3%82%8F%E3%81%8B%E3%82%8B%E3%81%8F%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/431035/planner%20%E5%90%8D%E5%89%8D%E3%82%8F%E3%81%8B%E3%82%8B%E3%81%8F%E3%82%93.meta.js
// ==/UserScript==

const NAME_DICT = {
    "int0816 F13": "花野",
    "int0816 F03": "吉田",
    "int0816 F17": "藤川",
    "int0816 F14": "鈴木",
    "int0816 F08": "川淵",
}

const doesExistNamePanel = () => {
    const people_picker_panels = document.getElementsByClassName("ms-Callout plannerAppCallout peoplePicker")
    const member_list_panels = document.getElementsByClassName("ms-Callout plannerAppCallout membersList")
    return people_picker_panels.length > 0 || member_list_panels.length > 0
}

const replaceName = () => {
    const name_divs = document.getElementsByClassName("ms-TooltipHost")
    for(let i = 0; i < name_divs.length - 1; i++){
        if(Object.keys(NAME_DICT).includes(name_divs[i].innerText)){
            name_divs[i].innerText = NAME_DICT[name_divs[i].innerText]
        }
    }
}

(function() {
    const observer = new MutationObserver((mutations) => {
        if(doesExistNamePanel()){
            replaceName()
        }
    })
    observer.observe(document.body, {
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        childList: true,
        subtree: true
    })
})()