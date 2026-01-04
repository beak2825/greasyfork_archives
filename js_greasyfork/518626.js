// ==UserScript==
// @name         HWM arts_arenda.php Tweaks
// @namespace    nexterot
// @version      0.1.1
// @description  Небольшие улучшения страницы артефактов в аренде
// @author       nexterot
// @match        https://www.heroeswm.ru/arts_arenda.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @license      none
// @homepage     https://greasyfork.org/ru/scripts/518626-hwm-arts-arenda-php-tweaks
// @downloadURL https://update.greasyfork.org/scripts/518626/HWM%20arts_arendaphp%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/518626/HWM%20arts_arendaphp%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let trByNameMap = new Map();
    const charRefs = document.querySelectorAll(`a[href*="pl_info.php"]`);
    for(const ref of charRefs) {
        if (ref.classList.contains('pi')) {
            continue;
        }
        let name = ref.innerHTML;
        var tr = ref.closest('tr');
        if (tr) {
            let list = trByNameMap.get(name) ?? [];
            list.push(tr);
            trByNameMap.set(name, list);
        }
    }

    var html = `<select id="select_box" name="nickname">`;
    let i = 0;
    for (let key of trByNameMap.keys()) {
        html += `<option value="${key}">${key}</option>`;
    }
    html += `</select>&nbsp;`
        + `<span id="takeAll" style="cursor: pointer; text-decoration: underline">Забрать всё у персонажа</span><br>`;

    var elem = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td");
    if (!elem) {
        elem = document.querySelector("#android_container > table > tbody > tr > td");
    }
    elem.innerHTML = html + elem.innerHTML;

    $('takeAll').addEventListener('click', async function(e) {
        var select_box = $('select_box');
        let result = confirm("Press OK to confirm take all arts");
        if (result === true) {
            const selected = select_box.options[select_box.selectedIndex].value;
            //console.log(selected);
            var trs = trByNameMap.get(selected);
                //console.log('take:');
            for(var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                const takeRef = tr.querySelector(`a[href*="/arts_arenda.php"]`);
                //console.log(takeRef.href);
                getPage(takeRef.href);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            setTimeout(reload, 300);
        }
    });
    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
    async function getPage(aURL) {
        var response = fetch(aURL)
            .then((resp) => resp.arrayBuffer());
        let html = new TextDecoder('windows-1251').decode(await response);
        return html;
    }
    function reload() {
        window.location.reload(true);
    }
})();
