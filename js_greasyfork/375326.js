// ==UserScript==
// @name          Přihlaš se na ING
// @namespace     ING-TH			
// @author     	  Tomáš Hnyk mailto:tomashnyk@gmail.com
// @description   Vyplní přihlašovací údaje na stránce internetového bankovnictví ING a přihlásí se
// @include       https://ib.ing.cz/*
// @license	      GPL 3
// @version       1.3
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require       https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @run-at        document-idle
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375326/P%C5%99ihla%C5%A1%20se%20na%20ING.user.js
// @updateURL https://update.greasyfork.org/scripts/375326/P%C5%99ihla%C5%A1%20se%20na%20ING.meta.js
// ==/UserScript==

// Napište své heslo a ID do následujícího řádku mezi uvozovky
// Pozor, kdokoliv s přístupem k vašemu počítači pak může jednoduše heslo zjistit
// To ale moc nevadí, pokud zároveň nemá váš telefon, aby vám mohl ukrást peníze

var ing_password = "";
var ing_id = "";

var cIdInpt = document.querySelector('input[name=customer-id]');
var cIdInpt_ii = document.querySelector('input[name=password]');


function fill_ing_id() {var cIdInpt = document.querySelector('input[name=customer-id]');
                        var keyupEvnt = new Event ('keyup', {bubbles: true} );  //  no key code needed in this case.
                        var changeEvnt = new Event ('change', {bubbles: true} );  //  no key code needed in this case.
                        cIdInpt.value = ing_id;
                        cIdInpt.dispatchEvent (keyupEvnt);
                        cIdInpt.dispatchEvent (changeEvnt);
};

function fill_ing_password() {var cIdInpt = document.querySelector('input[name=password]');
                            var keyupEvnt = new Event ('keyup', {bubbles: true} );  //  no key code needed in this case.
                            var changeEvnt = new Event ('change', {bubbles: true} );  //  no key code needed in this case.
                            cIdInpt.value = ing_password;
                            cIdInpt.dispatchEvent (keyupEvnt);
                            cIdInpt.dispatchEvent (changeEvnt);
};

function click_ing_button() {var ingbutton_ = document.querySelector('button[data-selector=validate-button]');
                             ingbutton_.click();
                            };

function click_ing_button_ii() {var ingbutton_ = document.querySelector('div.validate-button-container > button[data-selector=accept-button]');
                             ingbutton_.click();
                            };

waitForKeyElements (
        "div.basic-form-control-wrap"
  					, fill_ing_id
        );


waitForKeyElements (
        "button:not(.disabled)[data-selector=validate-button]"
  					, click_ing_button
        );



waitForKeyElements (
        "input.basic-form-control[type=password]"
  					, fill_ing_password
        );


 waitForKeyElements (
        "button:not(.disabled)[data-selector=accept-button]"
  					, click_ing_button_ii
        );
