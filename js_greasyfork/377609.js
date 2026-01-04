// ==UserScript==
// @name          Přihlaš se na Raiffaisen bank
// @namespace     RAIFFAIISEN-TH			
// @author     	  Tomáš Hnyk mailto:tomashnyk@gmail.com
// @description   Vyplní přihlašovací údaje na stránce internetového bankovnictví Raiffainsen bank
// @require       https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @include       https://*.rb.cz/
// @license	  GPL 3
// @version       1.1
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/377609/P%C5%99ihla%C5%A1%20se%20na%20Raiffaisen%20bank.user.js
// @updateURL https://update.greasyfork.org/scripts/377609/P%C5%99ihla%C5%A1%20se%20na%20Raiffaisen%20bank.meta.js
// ==/UserScript==
// Napište své přihlašovací číslo následujícího řádku vždy mezi úvozovky
// Pozor, kdokoliv s přístupem k vašemu počítači pak může tyto údaje jednoduše zjistit
// To ale moc nevadí, pokud zároveň nezíská váš telefon.
// I-PIN zvládne uložit Firefox - vy pak jen musíte opsat SMS.
var rb_username = "";
function click_button_i()	{var rb_button_rozbal = document.querySelector('.login-button');
													rb_button_rozbal.click();
													};

function click_button_ii(){var rb_button_posli_id = document.querySelector('button[id=sendSms1]');
													rb_button_posli_id.click();
													};
setTimeout(click_button_i, 700);
document.getElementById("clientId1").value = rb_username;
setTimeout(click_button_ii, 3000);