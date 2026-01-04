// ==UserScript==
// @name         Digiposte - Rename helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will help you rename files with one keypress
// @author       Shuunen
// @match        https://secure.digiposte.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37882/Digiposte%20-%20Rename%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/37882/Digiposte%20-%20Rename%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('drh : init');

    var monthsIn = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    var monthsOut = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    var formatDate = function(str, full) {
        var found = false;
        str = str.replace('.','');
        console.log('drh : trying to format date', str);
        monthsIn.forEach(function(monthIn, monthIndex) {
            var monthPos = str.indexOf(monthIn);
            if (monthPos !== -1) {
                found = true;
                str = str.replace(monthIn, monthsOut[monthIndex]);
            }
        });
        if (!found) {
            alert('drh : did not found month in', str);
        }
        var arr = str.split(' ');
        var year = arr[2];
        if(year.length < 4){
            year = '20' + year;
        }
        var month = arr[1];
        if (month.length < 2) {
            month = '0' + month;
        }
        var day = arr[0];
        if (day.length < 2) {
            day = '0' + day;
        }
        return year + '-' + month + (full ? '-' + day : '');
    };

    var triggerChange = function(el) {
        el.dispatchEvent(new KeyboardEvent('change'));
        el.dispatchEvent(new Event('input', {
            'bubbles': true,
            'cancelable': true
        }));
    };

    var openModal = function(fullDate, doReplace){
        if(!document.querySelector('.safeContent_item--selected')){
            alert('drh : please select a document :)');
            return false;
        }
        document.querySelector('.dataAction_link--rename').click();
        var datePourrie = document.querySelector('.safeContent_item--selected .safeContent_item_inner--date').textContent;
        var dateNickel = formatDate(datePourrie, fullDate);
        console.log('drh : document date is', dateNickel);
        setTimeout(function(){
            var modalInput = document.querySelector('.modal_form_input');
            modalInput.value = dateNickel + (doReplace ? '' : ' ' + modalInput.value);
            triggerChange(modalInput);
            setTimeout(function(){
                document.querySelector('.modal_form_submit').click();
            },100);
        },300);
    };

    window.onkeydown = function(event) {
        if(event.keyCode === 113) {
            console.log('drh : F2 pressed !');
            openModal(false, false);
            return false;
        } else if(event.keyCode === 114) {
            console.log('drh : F3 pressed !');
            openModal(false, true);
            return false;
        } else if(event.keyCode === 115) {
            console.log('drh : F4 pressed !');
            openModal(true, false);
            return false;
        } else {
            console.log('drh : keyCode',event.keyCode,'not handled');
            return true;
        }
    };
})();