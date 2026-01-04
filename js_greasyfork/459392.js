// ==UserScript==
// @name         battlechat_blacklist
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Добавить новый ник в ЧС в коде скрипта: var blacklist = ["Kurda", "RaistlinMajere"]. Готовая строчка с новым ником: var blacklist = ["Kurda", "RaistlinMajere", "новый_ник"]. Редактировать код можно в расширении Tampermonkey.
// @author       You
// @license     GNU GPLv3
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/459392/battlechat_blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/459392/battlechat_blacklist.meta.js
// ==/UserScript==
var blacklist = ["Kurda", "RaistlinMajere"]

const chatDiv = document.querySelector("#chat_format")
function censor_chat(div){
    if (!div.firstChild || div.firstChild.nodeType !== Node.COMMENT_NODE) return;
    let arr = div.innerHTML.split(/<!--.-->/)
    div.innerHTML = ""
    for (const entry of arr){
        let nickname = entry.match(/\[(.+?)\]/)
        if (!nickname || blacklist.includes(nickname[1])) continue
        div.insertAdjacentHTML('beforeend', entry)
    }
}
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && mutation.addedNodes[0].tagName === 'DIV') {
            censor_chat(mutation.addedNodes[0])
        }
    });
});
const config = { childList: true, subtree: true };
observer.observe(chatDiv, config);
