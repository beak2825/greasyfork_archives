// ==UserScript==
// @name        ServiceNow Domain Picker Sorter Beta
// @namespace   http://ogieglo.pl/r/sn-domain-sort
// @description ServiceNow domain picker sorting for Geneva+. Sorts domains list by domain name and puts it at beginning.
// @include     https://*.service-now.com/nav_to.do*
// @include     https://*.service-now.com/navpage.do*
// @version 20161116.26
// @downloadURL https://update.greasyfork.org/scripts/24681/ServiceNow%20Domain%20Picker%20Sorter%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/24681/ServiceNow%20Domain%20Picker%20Sorter%20Beta.meta.js
// ==/UserScript==


function ogiSort(a, b) {
    var nameA2 = a['text'].toLowerCase().split('/').pop();
    var nameB2 = b['text'].toLowerCase().split('/').pop();

    return nameA2.localeCompare(nameB2);
}

function ogiSortSelect(selElem) {
    var tmpSel = selElem.options[selElem.selectedIndex].value
    var tmpAry = [];
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = [];
        tmpAry[i]['text'] = selElem.options[i].text;
        tmpAry[i]['value'] = selElem.options[i].value;
    }
    tmpAry.sort(ogiSort);
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0; i<tmpAry.length; i++) {
        var makeSel = tmpSel == tmpAry[i]['value'];
        var newFullText = tmpAry[i]['text'].indexOf('/') > 0 ? tmpAry[i]['text'].split('/').pop() + " | " + tmpAry[i]['text'] : tmpAry[i]['text'];
        var op = new Option(newFullText  , tmpAry[i]['value'], makeSel, makeSel);
        selElem.options[i] = op;
    }
}

function ogiDomainPickerSort(){
    var ogiElDomainPicker = document.getElementById('domain_picker_select');
    if (ogiElDomainPicker != null) {
        ogiSortSelect(ogiElDomainPicker);
    }
}

/* Loop/interval check if domain picker list is loaded/populated */
var ogiDomainOptionsWatch = setInterval(function () {
    var ogiElDomainPicker = document.getElementById('domain_picker_select');
    if (ogiElDomainPicker != null && ogiElDomainPicker.length > 1) {
        ogiSortSelect(ogiElDomainPicker);
        clearInterval(ogiDomainOptionsWatch);
    }
}, 2000);

