// ==UserScript==
// @name        WhatsApp Dual Timezone
// @namespace   nikhilweee
// @match       https://web.whatsapp.com/*
// @grant       none
// @version     1.0
// @author      nikhilweee
// @description Show message timestamps in two timezones.
// @downloadURL https://update.greasyfork.org/scripts/527164/WhatsApp%20Dual%20Timezone.user.js
// @updateURL https://update.greasyfork.org/scripts/527164/WhatsApp%20Dual%20Timezone.meta.js
// ==/UserScript==

let lastChat = null;

function convertESTtoIST(time) {
  const localDate = new Date();
  const [time12h, period] = time.split(" ");
  const [hours, minutes] = time12h.split(":");
  localDate.setHours(period === "pm" ? +hours + 12 : +hours, +minutes);

  const estDate = localDate.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  });
  const istDate = localDate.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  return `${estDate} EST | ${istDate} IST`;
}

function shouldUpdateTimestamps() {
  const header = document.querySelector("#main header");
  if (header === null) {
    return false;
  }
  if (header.innerText !== lastChat) {
    lastChat = header.innerText;
    return true;
  }
  return false;
}

function updateTimestamps() {
  document.querySelectorAll("span").forEach((span) => {
    if ([" am", " pm"].includes(span.innerHTML.slice(-3))) {
      span.innerHTML = convertESTtoIST(span.textContent);
    }
  });
}

function runScriptWhenReady() {
  if (shouldUpdateTimestamps()) {
    updateTimestamps();
  }
  setTimeout(runScriptWhenReady, 1000);
}

window.addEventListener("load", runScriptWhenReady);
