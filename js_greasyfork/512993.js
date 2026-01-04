// ==UserScript==
// @name         Hattrick transfer filters
// @version      2025-06-25
// @description  Save custom transfers search filters
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/World/Transfers/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace https://greasyfork.org/users/1381786
// @downloadURL https://update.greasyfork.org/scripts/512993/Hattrick%20transfer%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/512993/Hattrick%20transfer%20filters.meta.js
// ==/UserScript==

function setFilter(filter) {
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeMin').value = filter.ageMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeDaysMin').value = filter.ageDaysMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeMax').value = filter.ageMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeDaysMax').value = filter.ageDaysMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1').value = filter.skill1;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1Min').value = filter.skill1Min;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1Max').value = filter.skill1Max;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2').value = filter.skill2;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2Min').value = filter.skill2Min;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2Max').value = filter.skill2Max;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3').value = filter.skill3;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3Min').value = filter.skill3Min;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3Max').value = filter.skill3Max;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4').value = filter.skill4;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4Min').value = filter.skill4Min;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4Max').value = filter.skill4Max;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty1').setAttribute('checked', filter.specialty1);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty1').checked = filter.specialty1 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty2').setAttribute('checked', filter.specialty2);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty2').checked = filter.specialty2 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty3').setAttribute('checked', filter.specialty3);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty3').checked = filter.specialty3 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty4').setAttribute('checked', filter.specialty4);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty4').checked = filter.specialty4 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty5').setAttribute('checked', filter.specialty5);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty5').checked = filter.specialty5 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty6').setAttribute('checked', filter.specialty6);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty6').checked = filter.specialty6 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty8').setAttribute('checked', filter.specialty8);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty8').checked = filter.specialty8 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty0').setAttribute('checked', filter.specialty0);
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty0').checked = filter.specialty0 == 'checked';
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtBidMax').value = filter.bidMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlBornIn').value = filter.bornIn;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlContinent').value = filter.continent;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMin_text').value = filter.tsiMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMin').value = filter.tsiMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMin_Value').value = filter.tsiMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMax_text').value = filter.tsiMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMax').value = filter.tsiMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMax_Value').value = filter.tsiMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtSalaryMin').value = filter.salaryMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtSalaryMax').value = filter.salaryMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTransferCompareAvgMin').value = filter.transferCompareMin;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTransferCompareAvgMax').value = filter.transferCompareMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_chkUseGlobalMax').checked = filter.globalMax;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlGlobalSkillMax').value = filter.globalMaxSkill;
    document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlGlobalSkillMax').disabled = !filter.globalMax;
}

function getFilter() {
    return {
        ageMin: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeMin').value,
        ageDaysMin: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeDaysMin').value,
        ageMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeMax').value,
        ageDaysMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlAgeDaysMax').value,
        skill1: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1').value,
        skill1Min: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1Min').value,
        skill1Max: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill1Max').value,
        skill2: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2').value,
        skill2Min: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2Min').value,
        skill2Max: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill2Max').value,
        skill3: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3').value,
        skill3Min: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3Min').value,
        skill3Max: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill3Max').value,
        skill4: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4').value,
        skill4Min: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4Min').value,
        skill4Max: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlSkill4Max').value,
        specialty1: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty1').getAttribute('checked'),
        specialty2: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty2').getAttribute('checked'),
        specialty3: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty3').getAttribute('checked'),
        specialty4: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty4').getAttribute('checked'),
        specialty5: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty5').getAttribute('checked'),
        specialty6: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty6').getAttribute('checked'),
        specialty8: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty8').getAttribute('checked'),
        specialty0: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkSpecialty0').getAttribute('checked'),
        bidMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtBidMax').value,
        bornIn: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlBornIn').value,
        continent: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlContinent').value,
        tsiMin: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMin_text').value,
        tsiMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTSIMax_text').value,
        salaryMin: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtSalaryMin').value,
        salaryMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtSalaryMax').value,
        transferCompareMin: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTransferCompareAvgMin').value,
        transferCompareMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_txtTransferCompareAvgMax').value,
        globalMax: document.getElementById('ctl00_ctl00_CPContent_CPMain_chkUseGlobalMax').checked,
        globalMaxSkill: document.getElementById('ctl00_ctl00_CPContent_CPMain_ddlGlobalSkillMax').value
    }
}

function saveFilter() {
    let name = document.getElementById('customFilterName').value;
    if (name == '') name = Date.now();
    GM_setValue(name, getFilter());
    printFilters();
}

function deleteFilter(name) {
    GM_deleteValue(name);
    printFilters();
}

function printFilters() {
    let list = '';
    for (let f of GM_listValues().toSorted()) {
        list += `<li filter-name="${f}"><input type="image" src="../../Img/Icons/cross_small.png" class="float_right"><a href="#${f}">${f}</a></li>`;
    }
    document.getElementById('customFilterList').innerHTML = list;
    for (let li of document.getElementById('customFilterList').children) {
        let name = li.getAttribute('filter-name');
        li.children[0].addEventListener('click', () => { deleteFilter(name); });
        li.children[1].addEventListener('click', () => { setFilter(GM_getValue(name)); });
    }
}

(function() {
    'use strict';

    let chkShowAdvanced = document.getElementById('ctl00_ctl00_CPContent_CPMain_chkShowAdvanced');
    if (!chkShowAdvanced.checked) chkShowAdvanced.click();

    let boxHead = '<div class="boxHead"><h2>';
    boxHead += '<input type="text" placeholder="Filter name" id="customFilterName" size="8">';
    boxHead += ' ';
    boxHead += '<button type="button" id="customFilterSave">Save</button>';
    boxHead += '</h2></div>';

    let filtersBox = '<div class="box subMenuBox">';
    filtersBox += boxHead;
    filtersBox += '<div class="boxBody"><h3>Filters</h3><ul id="customFilterList"></ul></div>';
    filtersBox += '<div class="boxFooter"></div></div>';

    document.querySelector('.subMenu').innerHTML += filtersBox;
    document.getElementById('customFilterSave').addEventListener('click', saveFilter);
    document.getElementById('customFilterName').addEventListener('keyup', event => {
        if (event.key == 'Enter') saveFilter();
    });
    printFilters();
})();