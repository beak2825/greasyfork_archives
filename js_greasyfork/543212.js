// ==UserScript==
// @name           UPS Address Inserter
// @version        v1.1.0
// @match          https://*.ups.com/*
// @description    Auto fill UPS address fields (Sender + Receiver)
// @grant          GM_addStyle
// @license        MIT
// @namespace      https://greasyfork.org/users/1496986
// @downloadURL https://update.greasyfork.org/scripts/543212/UPS%20Address%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/543212/UPS%20Address%20Inserter.meta.js
// ==/UserScript==
(function (global) {
  if (global !== window) return;

  function _(id) {
    return document.getElementById(id);
  }

  function init() {
    var document = global.document;
    var div = document.createElement("div");

    GM_addStyle(`
      #__scrollToTop {
        font:14px/1.2em Arial,Helvetica,sans-serif;
        margin:0;padding:0;
        position:fixed;
        display:block;
        right:12px;
        bottom:60px;
        text-align:right;
        z-index:999999;
        width:270px;
        height:auto;
        cursor:pointer;
        opacity:0.5;
        padding:2px;
      }
      #__scrollToTop:hover { opacity:1; }
    `);

    div.id = "__scrollToTop";
    div.title = "UPS Autofill";
    div.innerHTML = `
      <div style="display: flex;">
        <input placeholder="Insert ID..." id="id__sharedItemID" name="__sharedItemID" style="flex: 1; border-radius: 5px 0 0 5px" />
        <button style="background-color:blue; color:white; padding:0 8px; border-radius: 0;" name="__submitSenderID">SENDER</button>
        <button style="background-color:green; color:white; padding:0 8px; border-radius: 0 5px 5px 0;" name="__submitItemID">RECEIVER</button>
      </div>
    `;

    document.body.appendChild(div);
    div.addEventListener("mousedown", control, false);
  }

  async function handleSubmitItemID(e) {
    const itemIdValue = _("id__sharedItemID").value;
    const response = await fetch(`https://db.faundit.com/api/public/ups/item/${itemIdValue}`);
    const data = await response.json();
    if (!data || !data.item) return;
    const obj = data.item;

    // Receiver address fields
    const address = _("destination-cac_singleLineAddress");
    const address1 = _("destination-cac_addressLine1");
    const address2 = _("destination-cac_addressLine2");
    const zip = _("destination-cac_postalCode");
    const city = _("destination-cac_city");
    const name = _("destination-cac_companyOrName");
    const contactName = _("destination-cac_contactName");
    const email = _("destination-cac_recipient_email");
    const phone = _("destination-cac_recipient_phone");

    if (address) address.value = obj.address || "";
    if (address1) address1.value = obj.address || "";
    if (address2) address2.value = obj.address2 || "";
    if (zip) zip.value = obj.zipCode || "";
    if (city) city.value = obj.city || "";
    if (name) name.value = obj.companyName || `${obj.firstName.trim()} ${obj.lastName.trim()}`;
    if (contactName) contactName.value = `${obj.firstName.trim()} ${obj.lastName.trim()}`;
    if (email) email.value = obj.contactEmail || "";
    if (phone) phone.value = obj.phoneNumber || "";
  }

  async function handleSubmitSenderID(e) {
    const itemIdValue = _("id__sharedItemID").value;
    const response = await fetch(`https://db.faundit.com/api/public/ups/item/${itemIdValue}`);
    const data = await response.json();
    if (!data || !data.hotel) return;
    const obj = data.hotel;

    // 🟡 Replace the below placeholders with actual UPS sender field IDs
    const address = _("origin-cac_singleLineAddress");
    const address1 = _("origin-cac_addressLine1");
    const address2 = _("origin-cac_addressLine2");
    const zip = _("origin-cac_postalCode");
    const city = _("origin-cac_city");
    const name = _("origin-cac_companyOrName");
    const contactName = _("origin-cac_contactName");
    const email = _("origin-cac_email");
    const phone = _("origin-cac_phone");

    if (address) address.value = obj.address1 || "";
    if (address1) address1.value = obj.address1 || "";
    if (address2) address2.value = obj.address2 || "";
    if (zip) zip.value = obj.zipCode || "";
    if (city) city.value = obj.city || "";
    if (name) name.value = obj.name || "";
    if (contactName) contactName.value = obj.contactPerson || "";
    if (email) email.value = obj.email || "";
    if (phone) phone.value = obj.phone || "";
  }

  function control(e) {
    const t = e.target;
    const name = t.getAttribute("name");
    switch (name) {
      case "__submitItemID":
        handleSubmitItemID(e);
        break;
      case "__submitSenderID":
        handleSubmitSenderID(e);
        break;
    }
  }

  init();
})(window.top);
