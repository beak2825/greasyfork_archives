// ==UserScript==
// @name         protocol_search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      none
// @description  Сырой скрипт по поиску в протоколе передач
// @author       You
// @match       https://www.heroeswm.ru/pl_transfers*
// @match       https://www.lordswm.com/pl_transfers*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465088/protocol_search.user.js
// @updateURL https://update.greasyfork.org/scripts/465088/protocol_search.meta.js
// ==/UserScript==
let search_for = ["Продан", "в тюрьму"]
let first_search_page = 0;
const search_page_amount = 5;
let pl_id = location.href.match(/id=(\d+)/)[1];
const parser = new DOMParser();

let send_get = function(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('text/plain; charset=windows-1251');
    xhr.send(null);
    if(xhr.status == 200) return xhr.responseText;
    return null;
};
let main_div = document.getElementsByClassName("global_a_hover")[1]
main_div.innerHTML = ""
for (let i = first_search_page; i < (search_page_amount + first_search_page); i++) {

    let response_text = send_get(`${location.protocol}//${location.host}/pl_transfers.php?id=${pl_id}&page=${i}`)
    let doc = parser.parseFromString(response_text, 'text/html');
    console.log(i)
    let text;
    let div = doc.getElementsByClassName("global_a_hover")[1]
    if (div) text = div.innerHTML;
    else return
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    let text_arr = text.split("&nbsp;&nbsp;")
    text_arr.forEach(line=>{
        if (search_for.filter(keyword=> line.toLowerCase().includes(keyword.toLowerCase())).length > 0) {
            main_div.insertAdjacentHTML('afterend', `${line}\n`)
        }
    })
}
