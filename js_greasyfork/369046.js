// ==UserScript==
// @name         Google Inbox Calendar Link
// @version      0.4
// @description  Adds calendar link to Google Inbox
// @author       Ahmed AlJehairan
// @include        https://inbox.google.com*
// @include        https://inbox.google.com/*
// @namespace https://greasyfork.org/users/189181
// @downloadURL https://update.greasyfork.org/scripts/369046/Google%20Inbox%20Calendar%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/369046/Google%20Inbox%20Calendar%20Link.meta.js
// ==/UserScript==
//Fixed Version of https://greasyfork.org/en/scripts/40761-google-inbox-calendar-link

window.CALENDAR_MENU_ITEM_ID = 'calendarMenuItem';

window.getByXPath = function(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
};

/*
<li jsaction="global.click_contacts_menu_item"
jstcache="1142">
<a class="oin9Fc cQ ig NKwSge"href="https://www.google.com/contacts/u/0/?hl=en-US" tabindex="-1" target="_blank" jstcache="1158">
<img class="gN" src="//ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/1x/ic_contacts_g60_24dp_r3.png" srcset="//ssl.gstatic.com/bt/C3341AA7A1A076756462EE2E5CD71C11/2x/ic_contacts_g60_24dp_r3_2x.png 2x" alt="" aria-hidden="true" jstcache="0">
<span class="op" jstcache="0">
<span title="Contacts" jstcache="1159">
Contacts</span>
</span>
<img class="gg" src="//www.gstatic.com/images/icons/material/system/1x/open_in_new_grey600_18dp.png" srcset="//www.gstatic.com/images/icons/material/system/2x/open_in_new_grey600_18dp.png 2x" alt="" aria-hidden="true" jstcache="1160">
</a>
</li>
*/
window.addCalendarMenuItem = function() {
    let calendarMenuItem = document.createElement('li');
    calendarMenuItem.id = CALENDAR_MENU_ITEM_ID;
    calendarMenuItem.jstcache = '1109';
    calendarMenuItem.jsan = 't-DLSN7eYCq78,22.jsaction';
    calendarMenuItem.jsaction = "global.click_calendar_menu_item"

    let calendarAnchor = document.createElement('a');
    calendarAnchor.href = 'https://calendar.google.com/';
    calendarAnchor.target = '_blank';
    calendarAnchor.classList.add('oin9Fc');
    calendarAnchor.classList.add('cQ');
    calendarAnchor.classList.add('ig');
    calendarAnchor.classList.add('xOMVzc');

    let calendarImg = document.createElement('img');
    calendarImg.src = "https://raw.githubusercontent.com/aj326/GCalIcon-For-Inbox/master/icons8-calendar-18.png";
    calendarImg.classList.add('gN');

    let calendarSpan = document.createElement('span');
    calendarSpan.classList.add('op');

    let calendarInnerSpan = document.createElement('span');
    calendarInnerSpan.innerText = 'Calendar';

    let calendarOpenInNewImg = document.createElement('img');
    calendarOpenInNewImg.classList.add('gg');
    calendarOpenInNewImg.src = '//www.gstatic.com/images/icons/material/system/1x/open_in_new_grey600_18dp.png';
    calendarOpenInNewImg.srcset = '//www.gstatic.com/images/icons/material/system/2x/open_in_new_grey600_18dp.png 2x';
    calendarOpenInNewImg.ariaHidden = 'true';
    calendarOpenInNewImg.jstcache = '1133';

    calendarMenuItem.appendChild(calendarAnchor);
    calendarAnchor.appendChild(calendarImg);
    calendarAnchor.appendChild(calendarSpan);
    calendarSpan.appendChild(calendarInnerSpan);
    calendarAnchor.appendChild(calendarOpenInNewImg);

    let contactsMenuItem = getByXPath('//li[@jsaction="global.click_contacts_menu_item"]').snapshotItem(0);
    console.log("contactsMenuItem ");
    this.console.log(contactsMenuItem);
    console.log("calendarMenuItem ");
    console.log(calendarMenuItem);
    contactsMenuItem.parentNode.insertBefore(calendarMenuItem, contactsMenuItem);
};

window.alreadyAddedCalendarMenuItem = function() {
    if (document.getElementById(CALENDAR_MENU_ITEM_ID) != null) {
        return true;
    } else
        return false;
};

let observer = new MutationObserver(function(mutations, observer) {
    if (!alreadyAddedCalendarMenuItem()) {
        addCalendarMenuItem();
    }
});
console.log(window.alreadyAddedCalendarMenuItem);


observer.observe(document, {
    subtree: true,
    attributes: true
});
