// ==UserScript==
// @name        Whatsapp clicked number
// @namespace   Violentmonkey Scripts
// @match       https://haraj.com.sa/*
// @grant       none
// @version     1.0
// @author      Twitter : @loboly_19
// @description 4/4/2023, 1:31:21 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463193/Whatsapp%20clicked%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/463193/Whatsapp%20clicked%20number.meta.js
// ==/UserScript==
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="tel:"]');
    if (link) {
      event.preventDefault(); // prevent the default behavior of clicking on a link
      const phoneNumber = link.getAttribute('href').substring(4); // get the phone number by removing the "tel:" prefix
      const whatsappLink = `https://wa.me/${phoneNumber}`;
      window.open(whatsappLink, '_blank'); // open a new WhatsApp chat tab
    }
  });