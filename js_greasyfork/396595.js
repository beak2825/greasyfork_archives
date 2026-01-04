// ==UserScript==
// @name         Salesforce Calendar Auto-Select
// @namespace    #1NL Scripts
// @version      0.1
// @description  Calendar check
// @author       Luiz Menezes
// @match        https://salesforce.wiseup.com/CalendarViewRegionalReadOnly
// @match        https://salesforce.wiseup.com/apex/CustomLookupRadio?oN=Account&WH=%20%20AND%20Type%20=%20%27Franquia%27%20AND%20Status__c%20=%20%27Ativa%27%20&Field1=&NameField1=&core.apexpages.devmode.url=1
// @grant        none
// @run-at       document-idle
// @icon         https://c1.sfdcstatic.com/content/dam/web/en_us/www/images/home/logo-salesforce.svg
// @downloadURL https://update.greasyfork.org/scripts/396595/Salesforce%20Calendar%20Auto-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/396595/Salesforce%20Calendar%20Auto-Select.meta.js
// ==/UserScript==

console.log("(CAL) Cal Ajust - Loaded !");


if (!document.querySelector('.fc-title'))
{
///////////////////////// POPUP /////////////////////////

    if (window.location.href == "https://salesforce.wiseup.com/apex/CustomLookupRadio?oN=Account&WH=%20%20AND%20Type%20=%20%27Franquia%27%20AND%20Status__c%20=%20%27Ativa%27%20&Field1=&NameField1=&core.apexpages.devmode.url=1"){
        //selects first checkbox in POPUP
        document.querySelector('input[type="checkbox"]').click();

        setTimeout(function(){
            document.querySelector('input[value="Selecionar"]').click();
        }, 500);
    }

//////////////////////// CALENDAR ////////////////////////
    else {
        //selects first box and calls event to load regular
        var box1 = document.querySelector('option[value="Number One"]');
        box1.selected = true;
        box1.parentElement.onchange.apply(box1.parentElement);

        //selects second box after ajax is called from 1st box
        (new MutationObserver(check)).observe(document, {childList: true, attributes: true, characterData: true, subtree: true});
        function check(changes, observer) {
            console.log('(CAL) DOM changed logged...');
            var box2 = document.querySelector('option[value="N1 - Regular"]')
            if(box2){
                observer.disconnect();
                console.log("(CAL) Regular Exists");
                box2.selected = true;
            }
            else {console.log('(CAl) ... but no regular to be found');}
        }

        //selects third box
        document.querySelector('option[value="Terça/Quinta"]').selected = true;
        document.querySelector('option[value="Sábado/"]').selected = true;

        //selects fourth box

        var box4 = document.querySelector('input[type="text"]');
        if (box4.value != "N1F Nova Lima"){
            document.querySelector('a[href="#"]').click()
        }
    }
//////////////////////////////////////////////////////////
}