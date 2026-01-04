// ==UserScript==
// @name         EzyBot - Eventpop (Beta)
// @namespace    EzyBot - Eventpop (Beta)
// @version      2.0
// @description  Event Pop!
// @author       EzyBot - อีซี่บอท
// @match        https://*.eventpop.me/*
// @icon         https://ezyisezy.github.io/easy/epop.png
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/528159/EzyBot%20-%20Eventpop%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528159/EzyBot%20-%20Eventpop%20%28Beta%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const zoneInput = "A1,A2,B1,B2"; // ชื่อเซ็กเตอร์ในผังใน " " เช่น "LM3-C, LM1-C, LM1-B"
  // (บอทจะไล่เข้าให้ตามลำดับ ถ้าโซนก่อนหน้าเป็นสีเทาจะข้ามไปโซนต่อไป)

  function isValidUrl(url) {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  }

  function handleHomepageRedirection() {
    if (window.location.href === "https://www.eventpop.me" || window.location.href === "https://www.eventpop.me/") {
      let redirectUrl = prompt("วาง URL ของหน้าเว็บกดบัตร:\n(กดปุ่ม ยกเลิก หากไม่ต้องการตั้งเวลากด)");

      if (redirectUrl === null) {
        console.log('User cancelled input.');
        return;
      }

      while (!isValidUrl(redirectUrl)) {
        alert("รูป URL ไม่ถูกต้อง (ต้องเริ่มต้นด้วย http:// หรือ https://)");
        redirectUrl = prompt("วาง URL ของหน้าเว็บกดบัตร:\n(กดปุ่ม ยกเลิก หากไม่ต้องการตั้งเวลากด)");

        if (redirectUrl === null) {
          console.log('User cancelled input.');
          return;
        }
      }

      let userInput;
      let isValidDateTime = false;

      while (!isValidDateTime) {
        const now = new Date();
        const currentDateTime = now.toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' }).replace(',', '');
        userInput = prompt(`กรอกวันที่และเวลาที่ต้องการเปิด URL (dd/mm/yyyy hh:mm:ss)`, currentDateTime);

        if (userInput === null) {
          console.log('User cancelled input.');
          return;
        }

        const dateTimePattern = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;

        if (!dateTimePattern.test(userInput)) {
          alert("รูปแบบวันที่และเวลาไม่ถูกต้อง (ต้องเป็น dd/mm/yyyy hh:mm:ss)");
          continue;
        }

        const [_, day, month, year, hours, minutes, seconds] = userInput.match(dateTimePattern);
        const targetDateTime = new Date(year, month - 1, day, hours, minutes, seconds);

        if (targetDateTime <= new Date()) {
          alert("ต้องเป็นวันที่และเวลาในอนาคต กรุณากรอกใหม่อีกครั้ง");
        } else {
          isValidDateTime = true;

          const intervalId = setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= targetDateTime) {
              clearInterval(intervalId);
              window.location.href = redirectUrl;
            }
          }, 1000);
        }
      }
    }
  }

  function handlePrequeuePage() {
    if (window.location.href.startsWith("https://queue.eventpop.me/prequeue/")) {
      const targetNode = document.getElementById('action');

      if (!targetNode) {
        console.error('Target node #action not found!');
        return;
      }

      let button = targetNode.querySelector('.action-button');

      if (button && !button.classList.contains('disabled')) {
        button.click();
        console.log('Button clicked!');
      } else {
        const observer = new MutationObserver(() => {
          button = targetNode.querySelector('.action-button');
          if (button && !button.classList.contains('disabled')) {
            button.click();
            console.log('Button clicked!');
            observer.disconnect();
          }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
      }
    }
  }

  function handleEventPage() {
    if (window.location.href.startsWith("https://www.eventpop.me/e/")) {

      const observer = new MutationObserver(() => {
        const showtimesAnchor = document.querySelector('#event-showtimes-section');
        const ticketsAnchor = document.querySelector('#event-tickets');

        if (showtimesAnchor) {
          if (!window.location.hash.includes("#event-showtimes-section") &&
            !window.location.hash.includes("#event-tickets")) {
            window.location.href += "#event-showtimes-section";
          }
          showtimesAnchor.scrollIntoView({ behavior: 'smooth' });
          observer.disconnect();
        } else if (ticketsAnchor) {
          if (!window.location.hash.includes("#event-showtimes-section") &&
            !window.location.hash.includes("#event-tickets")) {
            window.location.href += "#event-tickets";
          }
          ticketsAnchor.scrollIntoView({ behavior: 'smooth' });
          observer.disconnect();
        } else {
          console.log('Neither event showtimes nor tickets section exists. Waiting for changes...');
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      const buttonObserver = new MutationObserver(() => {
        const button = document.querySelector('.seating-action .select-seat');

        if (button) {
          button.click();
          console.log('Button clicked!');
          buttonObserver.disconnect();
        }
      });

      buttonObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  function isSeatingPage() {
    const url = window.location.pathname + window.location.search;
    return url.startsWith(window.location.pathname) && url.includes('/seating');
  }

  function autoClickDangerButtons() {
    const dangerButtons = document.querySelectorAll('.btn-danger');
    dangerButtons.forEach(button => button.click());
  }

  function handleSeatingPage() {
    if (isSeatingPage()) {
      console.log('On seating page. Checking for .btn-danger buttons...');
      setInterval(() => {
        if (document.querySelectorAll('.btn-danger').length > 0) {
          autoClickDangerButtons();
        }
      }, 100);
    } else {
      console.log('Not on seating page.');
    }
  }

  let seatThreshold = 1;
  let hasPrompted = false;

  function checkUrlAndPrompt() {
    const currentUrl = window.location.href;
    const isSeatingPage = currentUrl.includes('/seating');

    if (isSeatingPage && !hasPrompted) {
      const userInput = prompt("กรอกจำนวนบัตรที่ต้องการกด:\n(หากกดปุ่ม ยกเลิก จะกดได้แค่ 1 ใบ)", "1");
      if (userInput !== null && !isNaN(userInput) && userInput > 0) {
        seatThreshold = parseInt(userInput, 10);
      }
      hasPrompted = true;
    } else if (!isSeatingPage) {
      hasPrompted = false;
    }
  }


  function simulateClick(e) {
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    e.dispatchEvent(evt);
  }

  var zones = zoneInput.split(",").map(zone => zone.trim().toUpperCase());

  async function checkAvailabilityAndProceed(zone) {
    const selectZone = document.querySelector(`[id*="${zone}"]`);

    if (selectZone) {
      if (!selectZone.classList.contains("disabled")) {
        simulateClick(selectZone);
        await new Promise(resolve => setTimeout(resolve, 100));
        const availableSeats = document.querySelectorAll('.seat-g.available');

        if (availableSeats.length < seatThreshold || availableSeats.length === 0) {
          console.log(`Not enough available seats in zone ${zone}. Moving to next zone.`);
          return false;
        } else {
          console.log(`Enough available seats in zone ${zone}.`);
          return true;
        }
      } else {
        console.log(`Zone ${zone} is disabled. Moving to next zone.`);
        return false;
      }
    } else {
      console.log(`Zone ${zone} not found.`);
      return false;
    }
  }

  async function processZones() {
    for (var i = 0; i < zones.length; i++) {
      var zone = zones[i];

      if (await checkAvailabilityAndProceed(zone)) {
        break;
      }
    }
  }

  function autoClickZoomButtons() {
    const zoomButtons = document.querySelectorAll('.seat-map .btn.zoom');

    zoomButtons.forEach(button => {
      if (!button.classList.contains('zoomed')) {
        button.click();
        button.classList.add('zoomed');
      }
    });
  }

  let intervalId = null;
  let submitClicked = false;
  let previousSelectedCount = 0;

  function autoClickSubmitSeat() {
    const selectedSeats = document.querySelectorAll('.seat-g.available.selected');
    const submitButton = document.querySelector('button.submit-seat');
    const currentSelectedCount = selectedSeats.length;

    if (currentSelectedCount >= seatThreshold && submitButton && !submitClicked) {
      submitButton.click();
      submitClicked = true;
    } else if (currentSelectedCount < seatThreshold) {
      submitClicked = false;
    }

    previousSelectedCount = currentSelectedCount;
  }

  function main() {
    handleHomepageRedirection();
    handlePrequeuePage();
    handleEventPage();
    handleSeatingPage();

    checkUrlAndPrompt();
    processZones();
    autoClickZoomButtons();
    intervalId = setInterval(checkZoomButtons, 100);
    setInterval(autoClickSubmitSeat, 100);
  }

  window.onload = () => {
    main();
  };

  window.addEventListener('popstate', () => handleSeatingPage());
  setInterval(checkUrlAndPrompt, 100);

  function checkZoomButtons() {
    const zoomButtons = document.querySelectorAll('.seat-map .btn.zoom');
    const hasZoomed = Array.from(zoomButtons).some(button => button.classList.contains('zoomed'));

    if (hasZoomed) clearInterval(intervalId);
    else intervalId = setInterval(autoClickZoomButtons, 100);
  }
})();
