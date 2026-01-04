// ==UserScript==
// @name         Chat - BackOffice
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Chat - BackOffice otomatik üye arama
// @author       Menderes Acarsoy
// @match        https://dashboardagent.reamaze.com/admin/conversations/*
// @match        https://dashboardagent.reamaze.com/admin/chats*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reamaze.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508832/Chat%20-%20BackOffice.user.js
// @updateURL https://update.greasyfork.org/scripts/508832/Chat%20-%20BackOffice.meta.js
// ==/UserScript==


setInterval(function() {

if(location.href.includes('/conversations/')) {


if (document.querySelector('#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-conversations.section > div.section-header > a > i')) {
    var gecmis = document.querySelector('#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-conversations.section > div.section-header > a > i').className.includes('-down');
    if (gecmis) {document.querySelector('#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-conversations.section > div.section-header > a').click();}
}


// GEREKSİZ BÖLÜMLERİ GİZLE
if (document.querySelector('#conversation-right-rail > li:nth-child(2)')) {document.querySelector('#conversation-right-rail > li:nth-child(2)').style.display = "none";}
if (document.querySelector('div.tui-editor-defaultUI-toolbar.faux-toolbar')) {document.querySelector('div.tui-editor-defaultUI-toolbar.faux-toolbar').style.display = "none";}
if (document.querySelectorAll('div.inline-ai')[0]) {document.querySelectorAll('div.inline-ai')[0].style.display = "none";}
if (document.querySelector("#mode-switch > li:nth-child(2)")) {document.querySelector("#mode-switch > li:nth-child(2)").style.display = "none";}
if (document.querySelector("#mode-switch > li:nth-child(3)")) {document.querySelector("#mode-switch > li:nth-child(3)").style.display = "none";}
if (document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > div.logins-social")) {document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > div.logins-social").style.display = "none";}
if (document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > a")) {document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > a").style.display = "none";}
if (document.querySelector("#customer-data-attributes")) {document.querySelector("#customer-data-attributes").style.display = "none";};
if (document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.section.customer-notes")) {document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.section.customer-notes").style.display = "none";};
if (document.querySelector("#conversation-right-rail > li:nth-child(3) > div > div > div:nth-child(2) > div.send-live-message.section")) {document.querySelector("#conversation-right-rail > li:nth-child(3) > div > div > div:nth-child(2) > div.send-live-message.section").style.display = "none";}


// TRANSLATE BUTONU GİZLE
var translate = document.querySelectorAll("div > a.message-translation-button");
translate.forEach(function(trn) {
trn.style.display = "none";
});



var span_ip_element = document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > div.profile-time-location");
var span_ip_control = document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > div.profile-time-location > a");
var span_ip = document.querySelector("#conversation-right-rail > li:nth-child(1) > div > div.customer-profile > div.profile-details.section > div.profile-time-location > div.profile-location > i");

if (span_ip_element && span_ip && !span_ip_control) {
var ip = span_ip.getAttribute("data-original-title").split(": ")[1]
var link_ip = document.createElement("a");
link_ip.setAttribute("href", "https://bo.bo-2222eos-gbxc.com/player/search?ip=" + ip);
link_ip.textContent = ip;
span_ip_element.after(link_ip);
}



var chatdurum = document.querySelector('#conversation-sticky-top > div.conversation-meta.metaline.clearfix > div.conversation-meta-info > span.conversation-status-wrap.pea > span').textContent;
if (chatdurum === "Ended") {return;}

var temsilci = document.querySelector('#conversation-sticky-top > div.conversation-meta.metaline.clearfix > div.conversation-meta-info > span.assignee.pea > img').getAttribute('data-original-title');
if (temsilci !== "Menderes") {return;}

var mesajkutusu = document.querySelector('#message_body');
if (!mesajkutusu) {return;}

var eskimesaj = document.querySelector('#messages-show-prompt');
if (eskimesaj) {return;}



const mesajlar = document.querySelectorAll('.message.chat-ui:not(.staff) p');
const backofficeLink = 'https://bo.bo-2222eos-gbxc.com/player/search?id=';

mesajlar.forEach(mesaj => {
   mesaj.addEventListener('mouseup', function(event) {
    const selectedText = window.getSelection().toString();

    if (selectedText) {
      const span = document.createElement('span');
      span.classList.add('backoffice');
      span.textContent = '↗️';
      span.style.cursor = 'pointer';
      span.style.marginLeft = '5px';
      span.style.display = 'none';

      span.addEventListener('click', function(event) {
        const newUrl = backofficeLink + selectedText;
        window.open(newUrl, '_blank');
      });

      temizle();

      mesaj.insertBefore(span, mesaj.childNodes[mesaj.childNodes.length]);
      span.style.display = 'inline-block'; // Seçildikten sonra görünür hale getirin
    }
  });
});

document.addEventListener('click', function(event) {
const selectedText = window.getSelection().toString();
    if (!selectedText) {
        temizle();
    }
});


function temizle() {
      const existingSpans = document.querySelectorAll('.backoffice').forEach(existingSpan => {
        existingSpan.remove();
      });
};



///////////////////////////////////////////////////////////////////////////////////////
var p1varmi = false;

var enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true
});

function jsonYaz(kisayol) {
const jsonObject = document.querySelector("#message_body").getAttribute('data-rt-quickinsert');
var data = JSON.parse(jsonObject);
const shortcut = data.find(item => item.name === kisayol)?.body;
return shortcut;
}

function delay(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

async function p1yaz() {
    const mesajlar = document.querySelectorAll('.message.staff.chat-ui p');

    for (const mesaj of mesajlar) {
        if (mesaj.innerText.includes("Canlı Destek Hattına Hoş Geldiniz")) {
            p1varmi = true
        }
    }

    if (p1varmi) {
        console.log("P1 VAR!");
    } else {
        var inputboxElement = document.querySelector("#message_body");
        //inputboxElement.focus();
        inputboxElement.value = jsonYaz("p1");
        await delay(0.1);
        inputboxElement.dispatchEvent(enterEvent);
    }
}


p1yaz();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}

}, 1000);