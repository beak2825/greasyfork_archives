//
// ==UserScript==
// @name           HWM Parts spoiler
// @author         Tags https://www.heroeswm.ru/pl_info.php?id=7773958
// @namespace      http://tampermonkey.net/
// @description    Прячем части имперок
// @icon           https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @version        1.0
// @include        /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(pl_info.php*)/
// @require https://greasyfork.org/scripts/447488-hwm-resource-retabler/code/HWM_Resource_Retabler.js?version=1067736
// @noframes
// @license CC0
// @downloadURL https://update.greasyfork.org/scripts/447007/HWM%20Parts%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/447007/HWM%20Parts%20spoiler.meta.js
// ==/UserScript==

const ignoreList = ["абразив","змеиный яд","клык тигра","ледяной кристалл","лунный камень","огненный кристалл","осколок метеорита","цветок ведьм","цветок ветров","цветок папоротника","ядовитый гриб"];

(function() {
    'use strict';
    const tables = Array.from(document.getElementsByClassName('wb'));
    let elementsTable = tables[tables.indexOf(tables.filter(e=>e.innerText=="Ресурсы")[0])+3]
    let resources = Array.from(elementsTable.childNodes).filter(e=>e.hasAttribute("ismercenary")&&!ignoreList.includes(e.getAttribute("name")));
    if(resources.filter(e=>e.getAttribute("ismercenary")==="false").length>0){
    let spoiler = document.createElement('details');
    let summary = Object.assign(
        document.createElement('summary'), {
            innerText: `Части`,
        });
    spoiler.appendChild(summary);
    resources.forEach(r=>spoiler.appendChild(r))
    elementsTable.appendChild(spoiler);
    elementsTable.insertBefore(spoiler, elementsTable.firstChild);
    }
})();