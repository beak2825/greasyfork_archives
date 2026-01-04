// ==UserScript==
// @name         LNK_GLexchange
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  запрет обмена существ ГЛ гильдии лидеров
// @author       LNK
// @include      *heroeswm.ru/leader_army_exchange.php*
// @include      *lordswm.com/leader_army_exchange.php*
// @include      *178.248.235.15/leader_army_exchange.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/428196/LNK_GLexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/428196/LNK_GLexchange.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var creDiv = document.getElementsByClassName('cre_mon_parent');
    var creHref, exBut, exCheck, creName, exChecked, exValue, exButText, n;

    //alert(creDiv[0].parentNode.parentNode.nextSibling.nextSibling.childNodes.length);
    for (var i = 0; i < creDiv.length; i++) {
        creHref = creDiv[i].getElementsByTagName('a');
        if (!creHref) { continue; }
        creName = creHref[0].href;
        creName = creName.substr(creName.indexOf('=')+1);
        exBut = creDiv[i].parentNode.parentNode.nextSibling;
        if (!exBut) { continue; }
        exBut = exBut.nextSibling.childNodes[0];
        if (!exBut) { continue; }
        if (!exBut.childNodes[2]) { continue; }
        exValue = '';
        exButText = exBut.childNodes[2].value;
        n = exButText.indexOf('Обменять');
        if (n != -1) {
            exValue = ' (' + exButText.slice(n+9) +')';
        }
        exCheck = document.createElement('div');
        exCheck.innerHTML = '<input type="checkbox" id="exCheck'+creName+'" value="on" /> запрет обмена' + exValue;
        exCheck.style = 'background-color: PaleGreen; box-shadow: 0 0 3px rgba(0,0,0,1); text-align: center; width: 106%';
        exBut.appendChild(exCheck);
        //exBut.style.backgroundColor = "#0ccccc";
        exBut = exBut.childNodes[2];
        document.getElementById('exCheck'+creName).onclick = switchCheck;
        exChecked = GM_getValue('HWMexCheck'+creName, '0');
        if (exChecked == 1) {
            exBut.type = 'hidden';
            document.getElementById('exCheck'+creName).checked = true;
            document.getElementById('exCheck'+creName).parentNode.style.backgroundColor = 'LightSalmon';
        }
    }

    function switchCheck() {
        var exBut1 = this.parentNode.parentNode.childNodes[2];
        var varName = 'HWM'+this.id;
        if (this.checked) {
            exBut1.type = 'hidden';
            this.parentNode.style.backgroundColor = 'LightSalmon';
            GM_setValue(varName,'1'); }
        else {
            exBut1.type = 'submit';
            this.parentNode.style.backgroundColor = 'PaleGreen';
            GM_setValue(varName,'0');
        }
    }

    return;

})();